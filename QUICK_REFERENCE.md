# 🚀 TrackBack - Quick Reference

## 📱 Your Live Sites

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | https://track-back-rosy.vercel.app | ✅ Live |
| **Backend** | Not deployed yet | ⚠️ Local only |
| **Database** | Supabase | ✅ Live |

---

## 🔧 Local Development

### Start Everything:
```bash
# Terminal 1 - Backend
cd /Users/pragyatripathi/Desktop/LostAndFound/backend
npm start

# Terminal 2 - CLIP Service
cd /Users/pragyatripathi/Desktop/LostAndFound/clip-service
source venv/bin/activate
python app.py

# Terminal 3 - Frontend
cd /Users/pragyatripathi/Desktop/LostAndFound/frontend
npm run dev
```

### Test Locally:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- CLIP: http://localhost:8000

---

## 📤 Push Changes to GitHub

```bash
cd /Users/pragyatripathi/Desktop/LostAndFound
git add .
git commit -m "Your message"
git push origin main
```

**OR** use GitHub Desktop → Click "Push origin"

**Result:** Vercel auto-deploys in ~2 minutes!

---

## 🚀 Deploy Backend (Optional)

### Railway (Easiest):
1. Go to: https://railway.app
2. New Project → Deploy from GitHub
3. Select: `PragyaTripathi990/TrackBack`
4. Root Directory: `backend`
5. Add environment variables (see below)
6. Deploy!

### Environment Variables for Backend:
```
PORT=3000
NODE_ENV=production
SUPABASE_URL=https://zufybugbyfvexweiiluj.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1ZnlidWdieWZ2ZXh3ZWlpbHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNzU1OTksImV4cCI6MjA3Njg1MTU5OX0.-Qyg8pMt53ZnHBirfi-Snrhh1zRl5_uHqDUsb2O07Qc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1ZnlidWdieWZ2ZXh3ZWlpbHVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImiYXQiOjE3NjEyNzU1OTksImV4cCI6MjA3Njg1MTU5OX0.RUHpVmek3Z_OTyKUraoPjKkvgpyZWzmpnI5gu7ScQqo
CLIP_SERVICE_URL=http://localhost:8000
CORS_ORIGIN=https://track-back-rosy.vercel.app
```

### After Backend Deployment:
1. Copy your Railway URL (e.g., `https://trackback.railway.app`)
2. Go to Vercel Dashboard
3. Project Settings → Environment Variables
4. Update `VITE_API_URL` to: `https://trackback.railway.app/api`
5. Redeploy frontend

---

## 🐛 Common Issues

### "Backend not available" error on Vercel:
**Cause:** Backend isn't deployed yet  
**Fix:** Deploy backend to Railway OR test locally

### CORS errors:
**Cause:** Vercel domain not in allowed origins  
**Fix:** Already fixed! Just push the latest changes

### Port already in use:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

### Frontend not updating on Vercel:
**Cause:** Changes not pushed to GitHub  
**Fix:** `git push origin main`

---

## 📁 Project Structure

```
LostAndFound/
├── frontend/          # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   └── lib/
│   └── package.json
│
├── backend/           # Node.js + Express
│   ├── src/
│   │   ├── routes/
│   │   └── config/
│   └── package.json
│
└── clip-service/      # Python + FastAPI + CLIP
    ├── app.py
    └── requirements.txt
```

---

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `ERRORS_FIXED.md` | What errors were fixed |
| `VERCEL_DEPLOYMENT.md` | Complete deployment guide |
| `QUICK_REFERENCE.md` | This file! |
| `backend/.env` | Backend environment variables |
| `frontend/src/lib/api.ts` | API client configuration |

---

## 🎯 What Works Now

### ✅ On Vercel (Live):
- Beautiful UI
- Authentication (mock)
- All pages load
- Responsive design
- Dark mode

### ⚠️ Needs Backend:
- Report Lost/Found items
- Search functionality
- AI matching
- Image uploads
- View matches

### ✅ On Localhost:
- Everything works!

---

## 📞 Quick Commands

```bash
# Check if backend is running
curl http://localhost:3000/health

# Check if CLIP is running
curl http://localhost:8000/health

# View backend logs
cd backend && npm start

# Restart everything
pkill -f "node src/server.js"
pkill -f "python app.py"
cd backend && npm start &
cd ../clip-service && source venv/bin/activate && python app.py &
cd ../frontend && npm run dev &
```

---

## 🎉 You've Built:

✅ AI-Powered Lost & Found System  
✅ Modern React Frontend  
✅ RESTful API Backend  
✅ CLIP Image Search  
✅ Supabase Database  
✅ User Authentication  
✅ Deployed to Vercel  
✅ Auto-deployment from GitHub  

**Amazing work! 🚀**

---

## 📚 Learn More

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Supabase Docs:** https://supabase.com/docs
- **React Docs:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com

---

**Keep this file handy for quick reference! 📌**

