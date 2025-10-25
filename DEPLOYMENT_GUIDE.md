# 🚀 Deployment Guide - GitHub & Vercel

## 📋 Table of Contents
1. [Upload to GitHub](#upload-to-github)
2. [Deploy Frontend to Vercel](#deploy-frontend-to-vercel)
3. [Deploy Backend](#deploy-backend)
4. [Deploy CLIP Service](#deploy-clip-service)
5. [Configure Environment Variables](#configure-environment-variables)

---

## 1️⃣ Upload to GitHub

### Step 1: Create GitHub Repository

1. Go to https://github.com
2. Click "+" icon → "New repository"
3. Fill in:
   - **Repository name:** `ai-lost-and-found`
   - **Description:** "AI-Powered Lost & Found System with CLIP"
   - **Visibility:** Public or Private
4. Click "Create repository"

### Step 2: Initialize Git and Push

Open Terminal in your project folder:

```bash
cd /Users/pragyatripathi/Desktop/LostAndFound

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: AI-Powered Lost & Found System"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ai-lost-and-found.git

# Push to GitHub
git branch -M main
git push -u origin main
```

✅ **Your code is now on GitHub!**

---

## 2️⃣ Deploy Frontend to Vercel

### Step 1: Prepare Frontend for Deployment

The frontend is already configured! Just make sure:

```bash
cd frontend
npm run build  # Test if build works
```

### Step 2: Deploy to Vercel

**Option A: Using Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy frontend
cd /Users/pragyatripathi/Desktop/LostAndFound/frontend
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? lost-and-found-frontend
# - Directory? ./
# - Override settings? No
```

**Option B: Using Vercel Dashboard**

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click "Deploy"

### Step 3: Configure Environment Variables on Vercel

In Vercel Dashboard → Your Project → Settings → Environment Variables:

Add:
```
VITE_API_URL=https://your-backend-url.com/api
```

✅ **Frontend deployed!** You'll get a URL like: `https://lost-and-found-frontend.vercel.app`

---

## 3️⃣ Deploy Backend

### Option A: Deploy to Railway (Recommended for Node.js)

1. Go to https://railway.app
2. Sign up/Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Configure:
   - **Root Directory:** `backend`
   - **Start Command:** `npm start`
6. Add Environment Variables:
   ```
   PORT=3000
   SUPABASE_URL=https://zufybugbyfvexweiiluj.supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   CLIP_SERVICE_URL=https://your-clip-service-url.com
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   ```
7. Click "Deploy"

✅ **Backend deployed!** You'll get a URL like: `https://your-backend.railway.app`

### Option B: Deploy to Render

1. Go to https://render.com
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** lost-and-found-backend
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add Environment Variables (same as above)
6. Click "Create Web Service"

---

## 4️⃣ Deploy CLIP Service

### Option A: Deploy to Hugging Face Spaces (FREE!)

1. Go to https://huggingface.co/spaces
2. Click "Create new Space"
3. Configure:
   - **Space name:** `lost-and-found-clip`
   - **SDK:** Docker
   - **Visibility:** Public
4. Create `Dockerfile` in `clip-service`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "app.py"]
```

5. Push to Hugging Face:

```bash
cd clip-service
git init
git remote add hf https://huggingface.co/spaces/YOUR_USERNAME/lost-and-found-clip
git add .
git commit -m "Deploy CLIP service"
git push hf main
```

✅ **CLIP Service deployed!** URL: `https://YOUR_USERNAME-lost-and-found-clip.hf.space`

### Option B: Deploy to Render

1. Create `Dockerfile` in `clip-service` (same as above)
2. Go to Render → New → Web Service
3. Connect repository
4. Configure:
   - **Root Directory:** `clip-service`
   - **Docker Command:** (leave empty, uses Dockerfile)
5. Deploy

---

## 5️⃣ Configure Environment Variables

### Update Frontend Environment

Create `frontend/.env.production`:

```env
VITE_API_URL=https://your-backend.railway.app/api
```

### Update Backend Environment

In Railway/Render, set:

```env
PORT=3000
SUPABASE_URL=https://zufybugbyfvexweiiluj.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
CLIP_SERVICE_URL=https://your-clip-service.hf.space
CORS_ORIGIN=https://your-frontend.vercel.app
```

### Update Supabase CORS

In Supabase Dashboard → Settings → API:

Add your frontend URL to allowed origins:
```
https://your-frontend.vercel.app
```

---

## 🎯 Final Architecture

```
Frontend (Vercel)
    ↓
Backend (Railway/Render)
    ↓
├── Supabase (Database + Storage)
└── CLIP Service (Hugging Face/Render)
```

---

## ✅ Deployment Checklist

### Before Deploying:
- [ ] Test locally: All services running
- [ ] Test locally: Report lost item works
- [ ] Test locally: Search works
- [ ] Environment variables documented

### GitHub:
- [ ] Repository created
- [ ] Code pushed to GitHub
- [ ] .gitignore configured (no .env files!)

### Frontend (Vercel):
- [ ] Deployed successfully
- [ ] Environment variable VITE_API_URL set
- [ ] Custom domain configured (optional)

### Backend (Railway/Render):
- [ ] Deployed successfully
- [ ] All environment variables set
- [ ] CORS configured for frontend URL
- [ ] Health check endpoint working

### CLIP Service:
- [ ] Deployed successfully
- [ ] Model loads correctly
- [ ] Endpoints responding

### Supabase:
- [ ] Database tables created
- [ ] Storage bucket created and public
- [ ] CORS configured for frontend

### Testing Production:
- [ ] Frontend loads
- [ ] Can create account
- [ ] Can report lost item
- [ ] AI embeddings generate
- [ ] Search works
- [ ] Items save to database

---

## 🔧 Troubleshooting

### Frontend Build Fails
```bash
# Check for TypeScript errors
cd frontend
npm run build
```

### Backend Crashes
- Check environment variables are set
- Check Supabase connection
- Check logs in Railway/Render dashboard

### CLIP Service Timeout
- First request takes 30-60 seconds (model loading)
- Increase timeout in backend to 60 seconds
- Consider using model caching

### CORS Errors
- Add frontend URL to backend CORS_ORIGIN
- Add frontend URL to Supabase allowed origins

---

## 📊 Cost Estimate

### Free Tier:
- **Vercel:** Free (Hobby plan)
- **Railway:** $5/month credit (enough for backend)
- **Render:** Free tier available
- **Hugging Face:** Free for public spaces
- **Supabase:** Free tier (500MB database, 1GB storage)

**Total:** $0-5/month for small usage

### Paid Tier (for production):
- **Vercel Pro:** $20/month
- **Railway:** ~$20/month
- **Render:** $7-25/month
- **Supabase Pro:** $25/month

**Total:** ~$50-90/month for production

---

## 🎉 You're Done!

Your AI-Powered Lost & Found is now deployed and accessible worldwide!

**Share your URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-backend.railway.app`

---

## 📝 Next Steps

1. Set up custom domain
2. Enable analytics
3. Set up monitoring (Sentry, LogRocket)
4. Enable email notifications
5. Add social login (Google, Facebook)
6. Implement real-time updates (WebSockets)

---

**Need help? Check the logs in each platform's dashboard!**

