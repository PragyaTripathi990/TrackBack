#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     🚀 Pushing to GitHub: TrackBack Repository 🚀             ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

cd /Users/pragyatripathi/Desktop/LostAndFound

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
fi

# Add all files
echo "📝 Adding all files..."
git add .

# Commit
echo "💾 Creating commit..."
git commit -m "AI-Powered Lost & Found System with CLIP

Features:
- Modern dark theme UI
- User authentication
- Report lost/found items
- AI embeddings (CLIP model)
- Auto-matching algorithm
- Image uploads to Supabase
- Text & image search
- Vector similarity search
- PostgreSQL with pgvector
- Real-time matching"

# Add remote (your repository)
echo "🔗 Adding remote repository..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/PragyaTripathi990/TrackBack.git

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git branch -M main
git push -u origin main --force

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     ✅ Successfully pushed to GitHub! ✅                       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "🌐 Your repository: https://github.com/PragyaTripathi990/TrackBack"
echo ""
echo "📋 Next: Deploy to Vercel"
echo "   Run: bash DEPLOY_TO_VERCEL.sh"

