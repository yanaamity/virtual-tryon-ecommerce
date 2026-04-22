#!/bin/bash

# Virtual Try-On eCommerce MVP - Deployment Script
# This script will:
# 1. Initialize git repository
# 2. Commit all files
# 3. Show you the commands to push to GitHub
# 4. Guide you through Vercel deployment

echo "=========================================="
echo "Virtual Try-On MVP - Deployment Script"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ ERROR: package.json not found!"
    echo "Make sure you're in the project directory with all the files."
    exit 1
fi

echo "✅ Found package.json - proceeding..."
echo ""

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git repository already exists"
fi

echo ""
echo "📝 Creating .gitignore..."
cat > .gitignore << 'EOF'
node_modules/
.next/
.env.local
.env.*.local
dist/
build/
*.log
.DS_Store
.idea/
.vscode/
EOF
echo "✅ .gitignore created"

echo ""
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"

echo ""
echo "🧪 Testing locally..."
echo "⏳ Starting dev server (this will run in background)..."
npm run dev &
DEV_PID=$!
sleep 5

echo "✅ Dev server running at http://localhost:3000"
echo ""
echo "📝 IMPORTANT: Before continuing, please verify:"
echo "  1. Open http://localhost:3000 in your browser"
echo "  2. Verify home page loads"
echo "  3. Click 'Try On' button"
echo "  4. Check that you can upload a photo"
echo "  5. Verify products load in the grid"
echo ""
read -p "Did everything work? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    kill $DEV_PID
    echo "❌ Fix errors before deploying. Check the dev server output above."
    exit 1
fi

# Kill the dev server
kill $DEV_PID
echo "✅ Dev server stopped"

echo ""
echo "✨ All tests passed!"
echo ""
echo "=========================================="
echo "NEXT STEPS - Create GitHub Repository"
echo "=========================================="
echo ""
echo "1. Go to: https://github.com/new"
echo "2. Fill in:"
echo "   - Repository name: virtual-tryon-ecommerce"
echo "   - Description: Virtual Try-On eCommerce MVP"
echo "   - Visibility: PUBLIC"
echo "3. Click 'Create repository'"
echo ""
echo "4. After creating, copy your repository URL"
echo "   It should look like:"
echo "   https://github.com/YOUR_USERNAME/virtual-tryon-ecommerce.git"
echo ""

read -p "Have you created the GitHub repository? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 0
fi

echo ""
read -p "Enter your GitHub repository URL (e.g., https://github.com/username/virtual-tryon-ecommerce.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ No repository URL provided"
    exit 1
fi

echo ""
echo "📤 Committing files..."
git add .
git commit -m "Initial commit: Virtual Try-On eCommerce MVP"

if [ $? -ne 0 ]; then
    echo "⚠️  Nothing to commit (files already committed)"
fi

echo ""
echo "🚀 Setting up remote repository..."
git branch -M main
git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"

echo ""
echo "📤 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
else
    echo "❌ Failed to push. Check your credentials and try again."
    exit 1
fi

echo ""
echo "=========================================="
echo "NEXT STEPS - Deploy to Vercel"
echo "=========================================="
echo ""
echo "1. Go to: https://vercel.com"
echo "2. Sign in with GitHub"
echo "3. Click 'Add New' → 'Project'"
echo "4. Select: virtual-tryon-ecommerce"
echo "5. Click 'Import'"
echo "6. Accept defaults and click 'Deploy'"
echo ""
echo "⏳ Wait 2-3 minutes for deployment..."
echo ""
echo "After deployment completes:"
echo ""
echo "7. Go to 'Settings' tab"
echo "8. Click 'Environment Variables'"
echo "9. Add:"
echo "   Key: NEXT_PUBLIC_ADMIN_PASSWORD"
echo "   Value: admin123"
echo ""
echo "10. Add another:"
echo "   Key: NEXT_PUBLIC_API_URL"
echo "   Value: https://YOUR_PROJECT_NAME.vercel.app"
echo ""
echo "11. Click 'Save'"
echo "12. Go to 'Deployments' tab"
echo "13. Find latest deployment, click '...', select 'Redeploy'"
echo ""
echo "14. Your app will be live at:"
echo "   https://YOUR_PROJECT_NAME.vercel.app"
echo ""
echo "=========================================="
echo "✨ DEPLOYMENT COMPLETE!"
echo "=========================================="
echo ""
echo "Share your demo URL with users!"
echo ""
