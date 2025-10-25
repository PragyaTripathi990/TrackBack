# 🚀 Quick Setup Guide for Lost & Found System

## Step-by-Step Setup (15-20 minutes)

### ✅ Step 1: Setup Supabase (5 minutes)

1. **Create Account**: Go to [supabase.com](https://supabase.com) and create a free account
2. **Create Project**: Click "New Project" and choose a name
3. **Get Credentials**: Go to Settings > API
   - Copy your `Project URL`
   - Copy your `anon public` key
   - Copy your `service_role` key (keep this secret!)

4. **Setup Database**:
   - Go to SQL Editor
   - Open `backend/src/config/database.sql`
   - Copy all the SQL and paste it into Supabase SQL Editor
   - Click "Run" - this creates all tables with pgvector extension

5. **Setup Storage**:
   - Go to Storage
   - Create a new bucket named: `lost-found-images`
   - Make it **Public**

---

### ✅ Step 2: Setup CLIP Service - Python (5 minutes)

```bash
# Navigate to clip service
cd clip-service

# Create virtual environment
python3 -m venv venv

# Activate it
# Mac/Linux:
source venv/bin/activate
# Windows:
# venv\Scripts\activate

# Install dependencies (this may take 3-4 minutes)
pip install -r requirements.txt

# Start the service
python app.py
```

**Keep this terminal running!** The CLIP service should be at `http://localhost:8000`

---

### ✅ Step 3: Setup Backend - Node.js (3 minutes)

Open a **NEW terminal** (keep CLIP service running):

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
touch .env

# Edit .env and add (replace with your Supabase credentials):
PORT=5000
NODE_ENV=development

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

CLIP_SERVICE_URL=http://localhost:8000
JWT_SECRET=your_secret_key_123456

CORS_ORIGIN=http://localhost:5173

# Start the server
npm start
```

**Keep this terminal running!** Backend should be at `http://localhost:3000`

---

### ✅ Step 4: Setup Frontend - React (2 minutes)

Open a **THIRD terminal**:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file (optional)
touch .env

# Add to .env (optional - defaults to localhost:3000):
VITE_API_URL=http://localhost:3000/api

# Start frontend
npm run dev
```

**Open browser** and go to `http://localhost:5173`

---

## 🎉 Testing the System

### Test 1: Create a User Account
1. Click "Sign In" button
2. Click "Sign up here"
3. Create an account

### Test 2: Report a Lost Item
1. Navigate to "Report Lost"
2. Upload an image (any photo)
3. Add title: "Black Backpack"
4. Description: "Lost near library, has laptop inside"
5. Location: "Main Campus Library"
6. Click Submit

*Wait 10-15 seconds while AI generates embeddings*

### Test 3: Text Search
1. Click "Search" in navbar
2. Select "Text Search"
3. Type: "bag near library"
4. Click Search
5. You should see your item with ~70-90% similarity!

### Test 4: Image Search
1. Upload ANY image of a backpack
2. It should find visually similar items
3. Even if description is different!

### Test 5: Cross-Modal Search
1. Search text "laptop bag" → finds backpack image ✨
2. Upload backpack image → finds "laptop bag" description ✨

---

## 🐛 Troubleshooting

### CLIP Service Won't Start
```bash
# Check Python version (need 3.8+)
python3 --version

# If model download fails:
# 1. Check internet connection
# 2. Try again (sometimes HuggingFace is slow)
# 3. Or use smaller model in app.py:
# Change MODEL_NAME to "openai/clip-vit-base-patch16"
```

### Backend Can't Connect to Supabase
```bash
# Double-check .env file
cat .env

# Make sure no extra spaces
# URLs should NOT have quotes around them
```

### Frontend Shows "Network Error"
```bash
# Make sure backend is running
curl http://localhost:3000/health

# Should return: {"status":"ok",...}
```

### Search Takes Too Long
```bash
# First time model loads takes 1-2 minutes
# Subsequent searches should be 2-5 seconds
# If still slow, check CLIP service logs
```

---

## 📱 Demo Credentials

If authentication is setup:
- Email: `demo@example.com`
- Password: `password123`

---

## 🔧 Advanced Configuration

### Use Better CLIP Model (Higher Accuracy)
In `clip-service/app.py`, change:
```python
MODEL_NAME = "openai/clip-vit-large-patch14"  # Better but slower
```

### Adjust Similarity Threshold
In search API calls, change `threshold`:
```typescript
threshold: 0.5  // Lower = more results (0.3-0.8 recommended)
```

### Enable CORS for Production
In `backend/src/server.js`:
```javascript
origin: ['https://yourdomain.com', 'https://www.yourdomain.com']
```

---

## 🎯 What Makes This Special

✅ **Semantic Understanding**: "Bottle" matches "Flask"  
✅ **Visual Similarity**: Finds similar-looking items  
✅ **Cross-Modal**: Text finds images, images find text  
✅ **Fuzzy Matching**: No exact words needed  
✅ **AI-Powered**: Uses OpenAI's CLIP model  
✅ **Fast Search**: pgvector for efficient similarity  
✅ **Modern UI**: Beautiful dark mode interface  
✅ **Free to Run**: All open-source tools!  

---

## 📊 System Status Check

Before testing, verify all services are running:

1. **CLIP Service**: http://localhost:8000 (should show model info)
2. **Backend API**: http://localhost:3000/health (should show "ok")
3. **Frontend**: http://localhost:5173 (should load UI)

If all three are working, you're ready to go! 🚀

---

## 💡 Tips for Best Results

1. **Good Descriptions**: More details = better matches
2. **Quality Images**: Clear photos work best
3. **Include Location**: Helps narrow down results
4. **Be Patient**: First search takes longer (model loading)
5. **Try Both**: Text AND image search for best results

---

## 🎓 Understanding the Technology

- **CLIP**: Connects text and images in same "meaning space"
- **pgvector**: PostgreSQL extension for fast vector search
- **Embeddings**: 512-number representations of meaning
- **Cosine Similarity**: Measures how "close" two meanings are

When you search "black wallet":
1. CLIP converts it to 512 numbers
2. Compares with all stored item embeddings
3. Finds closest matches by "distance"
4. Returns ranked by similarity!

---

Need help? Check the main README.md or open an issue on GitHub!

