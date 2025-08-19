#!/bin/bash

# Heroku Deployment Script for NextGen EduMigrate
# Make this file executable: chmod +x deploy-heroku.sh

echo "🚀 Starting Heroku deployment for NextGen EduMigrate..."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI is not installed. Please install it first:"
    echo "   https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Check if user is logged in to Heroku
if ! heroku whoami &> /dev/null; then
    echo "🔐 Please login to Heroku first:"
    heroku login
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "📁 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit"
fi

# Check if Heroku remote exists
if ! git remote | grep -q heroku; then
    echo "🏗️  No Heroku app found. Please create one first:"
    echo "   heroku create your-app-name"
    echo "   Example: heroku create nextgen-edumigrate-prod"
    exit 1
fi

# Build and test locally first
echo "🔨 Building project locally..."
if ! npm run build; then
    echo "❌ Local build failed. Please fix errors before deploying."
    exit 1
fi

echo "✅ Local build successful!"

# Check if environment variables are set
echo "🔧 Checking environment variables..."
if ! heroku config | grep -q "NEXT_PUBLIC_FIREBASE_API_KEY"; then
    echo "⚠️  Environment variables not set. Please set them first:"
    echo "   Run: heroku config:set NEXT_PUBLIC_FIREBASE_API_KEY=your_value"
    echo "   See HEROKU_DEPLOYMENT.md for complete list"
fi

# Deploy to Heroku
echo "📦 Deploying to Heroku..."
git add .
git commit -m "Deploy to Heroku - $(date)"
git push heroku main

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Opening your app..."
    heroku open
else
    echo "❌ Deployment failed. Check logs:"
    echo "   heroku logs --tail"
fi

echo "🎉 Deployment script completed!"
