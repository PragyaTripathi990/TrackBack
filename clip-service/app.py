from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch
import requests
import io
import numpy as np
from typing import Optional, List
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="CLIP Embedding Service",
    description="Generate embeddings for text and images using CLIP model",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load CLIP model (using a smaller model for faster inference)
# You can use "openai/clip-vit-large-patch14" for better accuracy
MODEL_NAME = "openai/clip-vit-base-patch32"
logger.info(f"Loading CLIP model: {MODEL_NAME}")

try:
    model = CLIPModel.from_pretrained(MODEL_NAME)
    processor = CLIPProcessor.from_pretrained(MODEL_NAME)
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model.to(device)
    model.eval()
    logger.info(f"Model loaded successfully on device: {device}")
except Exception as e:
    logger.error(f"Error loading model: {e}")
    raise

# Request models
class TextRequest(BaseModel):
    text: str

class ImageRequest(BaseModel):
    image_url: str

class BatchTextRequest(BaseModel):
    texts: List[str]

class BatchImageRequest(BaseModel):
    image_urls: List[str]

# Helper functions
def generate_text_embedding(text: str) -> List[float]:
    """Generate CLIP embedding for text"""
    try:
        inputs = processor(text=[text], return_tensors="pt", padding=True).to(device)
        
        with torch.no_grad():
            text_features = model.get_text_features(**inputs)
            # Normalize the features
            text_features = text_features / text_features.norm(dim=-1, keepdim=True)
        
        # Convert to list
        embedding = text_features.cpu().numpy().flatten().tolist()
        return embedding
    except Exception as e:
        logger.error(f"Error generating text embedding: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing text: {str(e)}")

def generate_image_embedding(image_url: str) -> List[float]:
    """Generate CLIP embedding for image"""
    try:
        # Download image
        response = requests.get(image_url, timeout=10)
        response.raise_for_status()
        
        # Open image
        image = Image.open(io.BytesIO(response.content))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Process image
        inputs = processor(images=image, return_tensors="pt").to(device)
        
        with torch.no_grad():
            image_features = model.get_image_features(**inputs)
            # Normalize the features
            image_features = image_features / image_features.norm(dim=-1, keepdim=True)
        
        # Convert to list
        embedding = image_features.cpu().numpy().flatten().tolist()
        return embedding
    except requests.exceptions.RequestException as e:
        logger.error(f"Error downloading image: {e}")
        raise HTTPException(status_code=400, detail=f"Error downloading image: {str(e)}")
    except Exception as e:
        logger.error(f"Error generating image embedding: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

# API Endpoints
@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "CLIP Embedding Service",
        "status": "running",
        "model": MODEL_NAME,
        "device": device,
        "embedding_dimension": 512
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "device": device
    }

@app.post("/encode/text")
async def encode_text(request: TextRequest):
    """Generate embedding for text"""
    if not request.text or len(request.text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    try:
        embedding = generate_text_embedding(request.text)
        return {
            "success": True,
            "embedding": embedding,
            "dimension": len(embedding),
            "text": request.text
        }
    except Exception as e:
        logger.error(f"Error in encode_text: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/encode/image")
async def encode_image(request: ImageRequest):
    """Generate embedding for image"""
    if not request.image_url:
        raise HTTPException(status_code=400, detail="Image URL cannot be empty")
    
    try:
        embedding = generate_image_embedding(request.image_url)
        return {
            "success": True,
            "embedding": embedding,
            "dimension": len(embedding),
            "image_url": request.image_url
        }
    except Exception as e:
        logger.error(f"Error in encode_image: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/encode/batch/text")
async def encode_batch_text(request: BatchTextRequest):
    """Generate embeddings for multiple texts"""
    if not request.texts or len(request.texts) == 0:
        raise HTTPException(status_code=400, detail="Texts list cannot be empty")
    
    try:
        embeddings = []
        for text in request.texts:
            embedding = generate_text_embedding(text)
            embeddings.append(embedding)
        
        return {
            "success": True,
            "embeddings": embeddings,
            "count": len(embeddings),
            "dimension": len(embeddings[0]) if embeddings else 0
        }
    except Exception as e:
        logger.error(f"Error in encode_batch_text: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/encode/batch/image")
async def encode_batch_image(request: BatchImageRequest):
    """Generate embeddings for multiple images"""
    if not request.image_urls or len(request.image_urls) == 0:
        raise HTTPException(status_code=400, detail="Image URLs list cannot be empty")
    
    try:
        embeddings = []
        for image_url in request.image_urls:
            try:
                embedding = generate_image_embedding(image_url)
                embeddings.append({
                    "embedding": embedding,
                    "image_url": image_url,
                    "success": True
                })
            except Exception as e:
                embeddings.append({
                    "embedding": None,
                    "image_url": image_url,
                    "success": False,
                    "error": str(e)
                })
        
        return {
            "success": True,
            "results": embeddings,
            "count": len(embeddings)
        }
    except Exception as e:
        logger.error(f"Error in encode_batch_image: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/similarity/text")
async def compute_text_similarity(text1: str, text2: str):
    """Compute cosine similarity between two texts"""
    try:
        emb1 = np.array(generate_text_embedding(text1))
        emb2 = np.array(generate_text_embedding(text2))
        
        # Cosine similarity
        similarity = np.dot(emb1, emb2) / (np.linalg.norm(emb1) * np.linalg.norm(emb2))
        
        return {
            "success": True,
            "similarity": float(similarity),
            "text1": text1,
            "text2": text2
        }
    except Exception as e:
        logger.error(f"Error computing similarity: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/similarity/cross")
async def compute_cross_similarity(text: str, image_url: str):
    """Compute cosine similarity between text and image (cross-modal)"""
    try:
        text_emb = np.array(generate_text_embedding(text))
        image_emb = np.array(generate_image_embedding(image_url))
        
        # Cosine similarity
        similarity = np.dot(text_emb, image_emb) / (np.linalg.norm(text_emb) * np.linalg.norm(image_emb))
        
        return {
            "success": True,
            "similarity": float(similarity),
            "text": text,
            "image_url": image_url
        }
    except Exception as e:
        logger.error(f"Error computing cross-modal similarity: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

