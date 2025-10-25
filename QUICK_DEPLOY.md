# ⚡ Quick Deploy Guide (5 Minutes)

## 🚀 Upload to GitHub (2 minutes)

### Copy and paste these commands in Terminal:

```bash
cd /Users/pragyatripathi/Desktop/LostAndFound

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: AI Lost & Found System"
```

### Now create GitHub repository:

1. Go to: https://github.com/new
2. Repository name: `ai-lost-and-found`
3. Click "Create repository"
4. Copy the commands shown and run them (they look like this):

```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-lost-and-found.git
git branch -M main
git push -u origin main
```

✅ **Done! Your code is on GitHub!**

---

## 🌐 Deploy Frontend to Vercel (2 minutes)

### Option 1: One-Click Deploy

1. Go to: https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `ai-lost-and-found` repository
4. Configure:
   - **Root Directory:** `frontend`
   - **Framework:** Vite
5. Add Environment Variable:
   - `VITE_API_URL` = `http://localhost:3000/api` (change later)
6. Click "Deploy"

✅ **Done! Frontend is live!**

You'll get a URL like: `https://ai-lost-and-found.vercel.app`

---

## 🔧 Deploy Backend (1 minute)

### Railway (Easiest):

1. Go to: https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Click "Add variables" and paste:

```env
PORT=3000
SUPABASE_URL=https://zufybugbyfvexweiiluj.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1ZnlidWdieWZ2ZXh3ZWlpbHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNzU1OTksImV4cCI6MjA3Njg1MTU5OX0.-Qyg8pMt53ZnHBirfi-Snrhh1zRl5_uHqDUsb2O07Qc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1ZnlidWdieWZ2ZXh3ZWlpbHVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTI3NTU5OSwiZXhwIjoyMDc2ODUxNTk5fQ.RUHpVmek3Z_OTyKUraoPjKkvgpyZWzmpnI5gu7ScQqo
CLIP_SERVICE_URL=http://localhost:8000
CORS_ORIGIN=*
```

6. Set Root Directory: `backend`
7. Click "Deploy"

✅ **Done! Backend is live!**

---

## 🔗 Connect Frontend to Backend

1. Go to Vercel → Your Project → Settings → Environment Variables
2. Edit `VITE_API_URL` to your Railway backend URL:
   ```
   https://your-backend.railway.app/api
   ```
3. Redeploy frontend

✅ **Everything connected!**

---

## 📋 Summary

After following these steps, you'll have:

- ✅ Code on GitHub
- ✅ Frontend on Vercel
- ✅ Backend on Railway
- ✅ Everything connected

**Your URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.railway.app`

---

## 🎯 What About CLIP Service?

For now, CLIP service can run locally or you can:
- Deploy to Hugging Face Spaces (free)
- Deploy to Render with Docker
- Use serverless (AWS Lambda)

See `DEPLOYMENT_GUIDE.md` for full instructions.

---

## 🆘 Need Help?

**Common Issues:**

1. **Build fails on Vercel:**
   - Check `frontend/package.json` has all dependencies
   - Run `npm install` and `npm run build` locally first

2. **Backend crashes:**
   - Check all environment variables are set
   - Check Railway logs

3. **Can't connect:**
   - Update CORS_ORIGIN in backend to your Vercel URL
   - Update VITE_API_URL in Vercel to your Railway URL

---

**Read `DEPLOYMENT_GUIDE.md` for detailed instructions!**

