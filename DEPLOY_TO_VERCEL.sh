#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     🚀 Deploying to Vercel 🚀                                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "🔐 Logging in to Vercel..."
vercel login

echo ""
echo "📁 Deploying frontend..."
cd /Users/pragyatripathi/Desktop/LostAndFound/frontend

# Deploy to production
vercel --prod

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     ✅ Deployed to Vercel! ✅                                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "🎉 Your Lost & Found is now live!"
echo ""
echo "📋 Next steps:"
echo "   1. Copy your Vercel URL"
echo "   2. Deploy backend to Railway"
echo "   3. Update VITE_API_URL in Vercel settings"

