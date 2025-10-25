# ✅ Setup Checklist

Use this checklist to ensure everything is configured correctly.

## 📋 Pre-Setup Checklist

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Python 3.8+ installed (`python3 --version`)
- [ ] npm installed (`npm --version`)
- [ ] pip installed (`pip3 --version`)
- [ ] Git installed (optional)
- [ ] Code editor (VS Code recommended)
- [ ] Supabase account created

---

## 🗄️ Database Setup Checklist

- [ ] Supabase project created
- [ ] Copied Project URL
- [ ] Copied `anon` key
- [ ] Copied `service_role` key
- [ ] Opened SQL Editor in Supabase
- [ ] Pasted and ran `database.sql` (all queries)
- [ ] Verified tables created (users, items, matches, etc.)
- [ ] Created storage bucket: `lost-found-images`
- [ ] Made storage bucket **Public**
- [ ] Tested bucket by uploading a test image

---

## 🐍 CLIP Service Setup Checklist

- [ ] Navigated to `clip-service/` directory
- [ ] Created virtual environment (`python3 -m venv venv`)
- [ ] Activated virtual environment
  - [ ] Mac/Linux: `source venv/bin/activate`
  - [ ] Windows: `venv\Scripts\activate`
- [ ] Installed requirements (`pip install -r requirements.txt`)
- [ ] No errors during installation
- [ ] Started service (`python app.py`)
- [ ] Service running on port 8000
- [ ] Opened http://localhost:8000 in browser
- [ ] Saw JSON response with model info
- [ ] Terminal shows "Model loaded successfully"

---

## 🚀 Backend Setup Checklist

- [ ] Navigated to `backend/` directory
- [ ] Installed dependencies (`npm install`)
- [ ] No errors during installation
- [ ] Created `.env` file (copied from `env.example`)
- [ ] Added `SUPABASE_URL` to `.env`
- [ ] Added `SUPABASE_ANON_KEY` to `.env`
- [ ] Added `SUPABASE_SERVICE_ROLE_KEY` to `.env`
- [ ] Set `CLIP_SERVICE_URL=http://localhost:8000`
- [ ] Set `CORS_ORIGIN=http://localhost:5173`
- [ ] Added `JWT_SECRET` (any random string)
- [ ] Started server (`npm start`)
- [ ] Server running on port 5000
- [ ] Opened http://localhost:3000/health
- [ ] Saw `{"status":"ok",...}` response
- [ ] No errors in terminal

---

## 💻 Frontend Setup Checklist

- [ ] Navigated to `frontend/` directory
- [ ] Installed dependencies (`npm install`)
- [ ] No errors during installation
- [ ] (Optional) Created `.env` file
- [ ] (Optional) Added `VITE_API_URL` if different from default
- [ ] Started development server (`npm run dev`)
- [ ] Server running on port 5173
- [ ] Opened http://localhost:5173 in browser
- [ ] Website loads correctly
- [ ] No console errors in browser
- [ ] Dark mode interface visible
- [ ] Navigation buttons work

---

## 🧪 Testing Checklist

### Test 1: Health Checks
- [ ] CLIP service: http://localhost:8000 shows model info
- [ ] Backend API: http://localhost:3000/health shows "ok"
- [ ] Frontend: http://localhost:5173 loads interface

### Test 2: User Authentication
- [ ] Can open login modal
- [ ] Can switch to registration
- [ ] Can create a test account
- [ ] Account creation works
- [ ] Can log in with test account
- [ ] User name appears in header
- [ ] Can open user menu
- [ ] Can access profile settings
- [ ] Can log out

### Test 3: Report Lost Item
- [ ] Navigate to "Report Lost" page
- [ ] Can select image file
- [ ] Image preview shows
- [ ] Can enter title
- [ ] Can enter description
- [ ] Can enter location
- [ ] Submit button works
- [ ] Shows loading state
- [ ] Success message appears
- [ ] Item appears in list

### Test 4: Text Search
- [ ] Navigate to Search page
- [ ] Text search tab is active
- [ ] Can type search query
- [ ] Submit search
- [ ] Shows "Searching with AI..." loading
- [ ] Results appear (if items exist)
- [ ] Similarity scores visible
- [ ] Can click on result
- [ ] Detail modal opens
- [ ] Can close modal

### Test 5: Image Search
- [ ] Switch to "Image Search" tab
- [ ] Can upload image
- [ ] Image preview shows
- [ ] Submit search
- [ ] Shows uploading state
- [ ] Shows searching state
- [ ] Results appear (if similar items exist)
- [ ] Similarity scores shown
- [ ] Results sorted by score

### Test 6: Hybrid Search
- [ ] Switch to "Hybrid Search" tab
- [ ] Can enter text AND upload image
- [ ] Submit search
- [ ] Both inputs processed
- [ ] Combined results shown
- [ ] Match types indicated (text/image/both)

---

## 🐛 Troubleshooting Checklist

### If CLIP Service Fails:
- [ ] Check Python version (3.8+)
- [ ] Virtual environment activated
- [ ] All requirements installed
- [ ] Port 8000 not in use
- [ ] Enough RAM (4GB+ recommended)
- [ ] Internet connection for model download
- [ ] Check terminal for error messages

### If Backend Fails:
- [ ] Check Node.js version (18+)
- [ ] All npm packages installed
- [ ] .env file exists and correct
- [ ] Supabase credentials valid
- [ ] CLIP service is running
- [ ] Port 5000 not in use
- [ ] Check terminal for error messages

### If Frontend Fails:
- [ ] All npm packages installed
- [ ] Backend is running
- [ ] Port 5173 not in use
- [ ] Browser console checked
- [ ] Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
- [ ] Clear browser cache

### If Search Not Working:
- [ ] CLIP service running and responding
- [ ] Backend can reach CLIP service
- [ ] Items exist in database
- [ ] Embeddings were generated (check logs)
- [ ] Similarity threshold not too high
- [ ] Try both text and image search

---

## 📊 Verification Commands

Run these to verify everything:

```bash
# Check services are running
curl http://localhost:8000  # CLIP service
curl http://localhost:3000/health  # Backend
curl http://localhost:5173  # Frontend (will show HTML)

# Check processes
ps aux | grep python  # Should show app.py
ps aux | grep node    # Should show server.js

# Check ports in use
lsof -i :8000  # CLIP service
lsof -i :5000  # Backend
lsof -i :5173  # Frontend
```

---

## 🎯 Performance Checklist

- [ ] First search takes <30 seconds (model loading)
- [ ] Subsequent searches <5 seconds
- [ ] Image upload <5 seconds
- [ ] Page loads quickly
- [ ] Smooth animations
- [ ] No lag when typing
- [ ] Results display fast

---

## 📱 Browser Compatibility

Test in:
- [ ] Chrome/Chromium (recommended)
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Chrome
- [ ] Mobile Safari

---

## 🔒 Security Checklist

- [ ] `.env` files not committed to git
- [ ] Service role key kept secret
- [ ] CORS configured correctly
- [ ] File upload size limited
- [ ] Input validation working
- [ ] No console warnings in production

---

## 🎉 Final Checklist

- [ ] All three services running
- [ ] Can create account
- [ ] Can report items
- [ ] Can search by text
- [ ] Can search by image
- [ ] Results show similarity scores
- [ ] UI looks good
- [ ] No errors in consoles
- [ ] Documentation read
- [ ] Setup guide followed

---

## ✅ You're Ready!

If all checkboxes are marked, your AI-Powered Lost & Found system is ready to use!

**Next Steps:**
1. Test with real data
2. Invite friends to try it
3. Customize the UI
4. Deploy to production (optional)

---

## 📞 Need Help?

If any checkbox is unchecked and you can't fix it:
1. Read the error message carefully
2. Check SETUP_GUIDE.md troubleshooting
3. Review PROJECT_SUMMARY.md
4. Check all .env variables
5. Restart all services
6. Try in different browser

---

**Last Updated**: October 2025
**Version**: 1.0.0

