# 🔍 AI-Powered Lost & Found System

A modern, intelligent lost and found platform powered by CLIP (Contrastive Language-Image Pre-training) for semantic image and text search.

## ✨ Features

- **🤖 AI-Powered Search**: Use CLIP embeddings for semantic understanding
- **🖼️ Image-to-Image Search**: Find similar items by uploading a photo
- **📝 Text-to-Image Search**: Search with natural language (e.g., "black wallet near library")
- **🔄 Cross-Modal Search**: Text queries match images and vice versa
- **🎯 Fuzzy Matching**: "Bottle" matches "Flask", "Specs" matches "Glasses"
- **📊 Similarity Scores**: Results ranked by semantic similarity
- **👤 User Authentication**: Secure user accounts with profiles
- **📱 Modern UI**: Beautiful dark mode interface with Tailwind CSS
- **⚡ Real-time Updates**: Fast vector similarity search with pgvector

## 🏗️ Architecture

### Frontend
- **React 19** with **Vite**
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Backend
- **Node.js** with **Express.js**
- **Supabase** (PostgreSQL with pgvector extension)
- **Supabase Storage** for image hosting

### AI Service
- **Python** with **FastAPI**
- **CLIP Model** (OpenAI's clip-vit-base-patch32)
- **HuggingFace Transformers**
- **PyTorch** for model inference

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- Supabase account (free tier works!)
- 4GB+ RAM (for CLIP model)

## 🚀 Quick Start

### 1. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `backend/src/config/database.sql`
3. Create a storage bucket named `lost-found-images` (make it public)
4. Get your Supabase URL and keys from Settings > API

### 2. Setup CLIP Service (Python)

```bash
cd clip-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the service
python app.py
```

The CLIP service will run on `http://localhost:8000`

### 3. Setup Backend (Node.js)

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp env.example .env

# Edit .env and add your Supabase credentials:
# SUPABASE_URL=your_supabase_url
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
# CLIP_SERVICE_URL=http://localhost:8000

# Start the server
npm start
# Or for development with auto-reload:
# npm run dev
```

The backend will run on `http://localhost:3000`

### 4. Setup Frontend (React)

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
LostAndFound/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── HomePage.tsx
│   │   │   ├── LostPage.tsx
│   │   │   └── FoundPage.tsx
│   │   ├── contexts/        # React contexts
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   └── package.json
│
├── backend/                  # Express.js backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── supabase.js  # Supabase client
│   │   │   └── database.sql # Database schema
│   │   ├── routes/
│   │   │   ├── items.js     # CRUD for items
│   │   │   ├── search.js    # AI search endpoints
│   │   │   ├── upload.js    # Image upload
│   │   │   └── users.js     # User management
│   │   └── server.js        # Express server
│   └── package.json
│
└── clip-service/             # Python CLIP service
    ├── app.py               # FastAPI application
    └── requirements.txt     # Python dependencies
```

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
CLIP_SERVICE_URL=http://localhost:8000
JWT_SECRET=your_jwt_secret_key_here
CORS_ORIGIN=http://localhost:5173
```

## 📡 API Endpoints

### Items
- `GET /api/items` - Get all items (with filters)
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item (auto-generates embeddings)
- `PATCH /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `GET /api/items/:id/matches` - Get potential matches

### Search
- `POST /api/search/text` - Search by text query
- `POST /api/search/image` - Search by image URL
- `POST /api/search/hybrid` - Combined text + image search
- `GET /api/search/categories` - Get all categories

### Upload
- `POST /api/upload/image` - Upload image to Supabase Storage
- `DELETE /api/upload/image` - Delete image

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PATCH /api/users/:id` - Update user
- `GET /api/users/:id/items` - Get user's items

### CLIP Service
- `POST /encode/text` - Generate text embedding
- `POST /encode/image` - Generate image embedding
- `POST /encode/batch/text` - Batch text embeddings
- `POST /encode/batch/image` - Batch image embeddings
- `POST /similarity/text` - Text-to-text similarity
- `POST /similarity/cross` - Text-to-image similarity

## 🎯 How It Works

### 1. Reporting Lost/Found Items
1. User uploads item with photo, title, description, and location
2. Backend saves image to Supabase Storage
3. CLIP service generates:
   - Image embedding (512-dimensional vector)
   - Text embedding from description
4. Embeddings stored in PostgreSQL with pgvector
5. System automatically finds potential matches

### 2. Text Search
1. User types query: "black water bottle near library"
2. CLIP generates text embedding
3. Vector similarity search in PostgreSQL
4. Returns semantically similar items ranked by score
5. "flask" matches "bottle", "navy" matches "black"

### 3. Image Search
1. User uploads photo of lost item
2. CLIP generates image embedding
3. Vector similarity search against stored images
4. Returns visually similar items
5. Works even if descriptions differ

### 4. Cross-Modal Magic
- Text searches find matching images
- Image searches find matching descriptions
- CLIP's shared embedding space enables this

## 🧪 Testing the Search

### Demo Credentials
- Email: `demo@example.com`
- Password: `password123`

### Test Scenarios

1. **Keyword Search**:
   - Search "black wallet" → finds "dark leather purse"
   - Search "specs" → finds "glasses"
   - Search "bottle" → finds "flask", "water bottle"

2. **Image Upload**:
   - Upload photo of headphones → finds similar headphones
   - Upload bag photo → finds similar bags

3. **Location-Based**:
   - Search "wallet Uniworld 1" → prioritizes items from that location

## 🎨 UI Features

- **Modern Dark Mode**: Beautiful gradient backgrounds
- **Glass Morphism**: Translucent UI elements
- **Smooth Animations**: Fade-ins, hover effects
- **Responsive Design**: Works on mobile, tablet, desktop
- **Real-time Search**: Instant results as you type
- **Similarity Scores**: Visual indication of match quality

## 🔧 Development

### Running in Development Mode

```bash
# Terminal 1: CLIP Service
cd clip-service && python app.py

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: Frontend
cd frontend && npm run dev
```

### Building for Production

```bash
# Frontend
cd frontend && npm run build

# Backend (no build needed, Node.js)
cd backend && npm start

# CLIP Service
cd clip-service && uvicorn app:app --host 0.0.0.0 --port 8000
```

## 📊 Database Schema

### Main Tables
- **users**: User profiles and authentication
- **items**: Lost and found items with embeddings
- **matches**: Potential matches between lost/found
- **reports**: User-reported inappropriate content
- **categories**: Item categories

### Vector Functions
- `search_items_by_image()`: Image similarity search
- `search_items_by_text()`: Text similarity search
- `find_potential_matches()`: Auto-match lost ↔ found

## 🚨 Troubleshooting

### CLIP Service Not Starting
- Check Python version (3.8+)
- Ensure enough RAM (4GB+)
- Try smaller model: `openai/clip-vit-base-patch32`

### Backend Connection Issues
- Verify Supabase credentials
- Check CLIP service is running
- Ensure ports 5000, 8000 are free

### Frontend Not Loading
- Clear browser cache
- Check console for errors
- Verify backend is running

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📝 License

MIT License - feel free to use for your projects!

## 🙏 Credits

- **OpenAI CLIP**: For the amazing vision-language model
- **Supabase**: For excellent PostgreSQL hosting
- **HuggingFace**: For model hosting and transformers library

## 📧 Support

For issues or questions, open a GitHub issue or contact the maintainers.

---

**Built with ❤️ using React, Node.js, Python, and AI**

