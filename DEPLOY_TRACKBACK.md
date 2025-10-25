# 🚀 Deploy TrackBack to GitHub & Vercel

Your repository: [https://github.com/PragyaTripathi990/TrackBack.git](https://github.com/PragyaTripathi990/TrackBack.git)

---

## ⚡ Quick Deploy (2 Commands)

### Step 1: Push to GitHub

```bash
cd /Users/pragyatripathi/Desktop/LostAndFound
bash PUSH_TO_GITHUB.sh
```

This will:
- ✅ Initialize git
- ✅ Add all files
- ✅ Commit with detailed message
- ✅ Push to https://github.com/PragyaTripathi990/TrackBack

### Step 2: Deploy to Vercel

```bash
bash DEPLOY_TO_VERCEL.sh
```

This will:
- ✅ Install Vercel CLI (if needed)
- ✅ Login to Vercel
- ✅ Deploy frontend to production

**Done! Your app is live!** 🎉

---

## 📋 Manual Steps (If Scripts Don't Work)

### Step 1: Push to GitHub

```bash
cd /Users/pragyatripathi/Desktop/LostAndFound

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "AI-Powered Lost & Found System"

# Add your repository
git remote add origin https://github.com/PragyaTripathi990/TrackBack.git

# Push
git branch -M main
git push -u origin main --force
```

✅ **Code is now on GitHub!**

Visit: https://github.com/PragyaTripathi990/TrackBack

---

### Step 2: Deploy Frontend to Vercel

**Option A: Using Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd /Users/pragyatripathi/Desktop/LostAndFound/frontend
vercel --prod
```

**Option B: Using Vercel Dashboard**

1. Go to: https://vercel.com/new
2. Click "Import Git Repository"
3. Enter: `https://github.com/PragyaTripathi990/TrackBack`
4. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add Environment Variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `http://localhost:3000/api` (update later)
6. Click **"Deploy"**

✅ **Frontend is live!**

You'll get a URL like: `https://trackback-xyz.vercel.app`

---

### Step 3: Deploy Backend to Railway

1. Go to: https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select: `PragyaTripathi990/TrackBack`
5. Click "Add variables" and add:

```env
PORT=3000
SUPABASE_URL=https://zufybugbyfvexweiiluj.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1ZnlidWdieWZ2ZXh3ZWlpbHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNzU1OTksImV4cCI6MjA3Njg1MTU5OX0.-Qyg8pMt53ZnHBirfi-Snrhh1zRl5_uHqDUsb2O07Qc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1ZnlidWdieWZ2ZXh3ZWlpbHVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTI3NTU5OSwiZXhwIjoyMDc2ODUxNTk5fQ.RUHpVmek3Z_OTyKUraoPjKkvgpyZWzmpnI5gu7ScQqo
CLIP_SERVICE_URL=http://localhost:8000
CORS_ORIGIN=*
```

6. Set **Root Directory:** `backend`
7. Click **"Deploy"**

✅ **Backend is live!**

You'll get a URL like: `https://trackback-production.up.railway.app`

---

### Step 4: Connect Frontend to Backend

1. Copy your Railway backend URL
2. Go to Vercel → Your Project → Settings → Environment Variables
3. Edit `VITE_API_URL`:
   ```
   https://trackback-production.up.railway.app/api
   ```
4. Go to Deployments → Click "..." → "Redeploy"

✅ **Everything connected!**

---

## 🎯 Your Live URLs

After deployment, you'll have:

- **GitHub Repository:** https://github.com/PragyaTripathi990/TrackBack
- **Frontend (Vercel):** https://trackback-xyz.vercel.app
- **Backend (Railway):** https://trackback-production.up.railway.app

---

## ✅ Deployment Checklist

### GitHub:
- [ ] Run `bash PUSH_TO_GITHUB.sh`
- [ ] Verify code at https://github.com/PragyaTripathi990/TrackBack
- [ ] Check all files are there (frontend, backend, clip-service)

### Vercel (Frontend):
- [ ] Run `bash DEPLOY_TO_VERCEL.sh` OR use dashboard
- [ ] Deployment successful
- [ ] Environment variable `VITE_API_URL` set
- [ ] Site loads correctly

### Railway (Backend):
- [ ] Project created from GitHub
- [ ] All environment variables added
- [ ] Root directory set to `backend`
- [ ] Deployment successful
- [ ] Health check works: `https://your-backend.railway.app/health`

### Final Connection:
- [ ] Update `VITE_API_URL` in Vercel with Railway URL
- [ ] Update `CORS_ORIGIN` in Railway with Vercel URL
- [ ] Redeploy frontend
- [ ] Test: Create account, report item

---

## 🔧 Troubleshooting

### Git Push Fails

If you get "repository not found":
```bash
# Make sure you're logged in to GitHub
git config --global user.name "PragyaTripathi990"
git config --global user.email "your-email@example.com"

# Try again
git push -u origin main --force
```

### Vercel Build Fails

Check the build logs in Vercel dashboard. Common fixes:
```bash
# Test build locally first
cd frontend
npm install
npm run build
```

### Backend Crashes on Railway

Check Railway logs. Common issues:
- Missing environment variables
- Wrong root directory (should be `backend`)
- Port configuration (should be `3000`)

---

## 📊 What Gets Deployed

### To GitHub:
```
TrackBack/
├── frontend/          (React + Vite + Tailwind)
├── backend/           (Node.js + Express)
├── clip-service/      (Python + FastAPI + CLIP)
├── .gitignore         (Protects .env files)
├── README.md
├── DEPLOYMENT_GUIDE.md
└── All documentation
```

### To Vercel:
- Only `frontend/` directory
- Built as static site
- Served globally via CDN

### To Railway:
- Only `backend/` directory
- Runs as Node.js server
- Connects to Supabase

---

## 🎉 Success!

After completing all steps, your AI-Powered Lost & Found (TrackBack) will be:

✅ **Live on the internet**  
✅ **Accessible from anywhere**  
✅ **Fully functional**  
✅ **Connected to Supabase**  
✅ **Using AI for matching**  

Share your Vercel URL with friends and test it out!

---

## 📝 Next Steps

1. **Custom Domain:** Add your own domain in Vercel settings
2. **Analytics:** Enable Vercel Analytics
3. **Monitoring:** Set up error tracking (Sentry)
4. **CLIP Service:** Deploy to Hugging Face Spaces (see DEPLOYMENT_GUIDE.md)
5. **Improvements:** Add email notifications, real-time updates

---

**Need help? Check the logs in Vercel and Railway dashboards!**

Repository: https://github.com/PragyaTripathi990/TrackBack

