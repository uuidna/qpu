#!/bin/bash

# QPU Cloudflare Workers Setup Script
# This script automates local setup tasks
# Manual steps in Cloudflare Dashboard and GitHub are still required

set -e

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  QPU Cloudflare Workers Setup                            ║"
echo "║  Domain: qpu.uuidna.com                                  ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Check dependencies
echo "📋 Step 1: Checking dependencies..."
command -v node >/dev/null 2>&1 || { echo "❌ Node.js not found. Please install Node.js 20+"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm not found"; exit 1; }
echo "✅ Dependencies OK (Node.js $(node --version), npm $(npm --version))"
echo ""

# Step 2: Install wrangler
echo "📋 Step 2: Installing Wrangler CLI..."
if npm list wrangler >/dev/null 2>&1; then
  echo "✅ Wrangler already installed"
else
  echo "Installing wrangler..."
  npm install -D wrangler@latest
  echo "✅ Wrangler installed"
fi
echo ""

# Step 3: Check login status
echo "📋 Step 3: Checking Cloudflare authentication..."
if npx wrangler whoami >/dev/null 2>&1; then
  echo "✅ Already authenticated with Cloudflare"
  ACCOUNT_ID=$(npx wrangler whoami 2>&1 | grep -oE '[a-f0-9]{32}' | head -1)
  if [ -z "$ACCOUNT_ID" ]; then
    echo "⚠️  Could not extract Account ID. You'll need to get it manually."
  else
    echo "✅ Account ID found: $ACCOUNT_ID"
  fi
else
  echo "⚠️  Not authenticated. Please run:"
  echo "    npx wrangler login"
  echo ""
  echo "Then return and run this script again."
  exit 1
fi
echo ""

# Step 4: Build the project
echo "📋 Step 4: Building QPU..."
npm run typecheck
npm run build
echo "✅ Build successful"
echo ""

# Step 5: Display setup instructions
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  NEXT STEPS (Manual in Cloudflare Dashboard)              ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

echo "📌 Step 1: Add domain to Cloudflare"
echo "   1. Go to https://dash.cloudflare.com/"
echo "   2. Click 'Add a Site'"
echo "   3. Enter: uuidna.com"
echo "   4. Update DNS nameservers at your domain registrar:"
echo "      - NS1.CLOUDFLARE.COM"
echo "      - NS2.CLOUDFLARE.COM"
echo "      (Exact names provided by Cloudflare)"
echo ""

echo "📌 Step 2: Generate API Token"
echo "   1. Go to https://dash.cloudflare.com/account/api-tokens"
echo "   2. Click 'Create Token'"
echo "   3. Use template: 'Edit Cloudflare Workers'"
echo "   4. Ensure permission: Account.Cloudflare Workers Scripts: Edit"
echo "   5. Copy the token (you'll need it for GitHub)"
echo ""

echo "📌 Step 3: Get Account ID"
echo "   1. Go to https://dash.cloudflare.com/account/overview"
echo "   2. Copy 'Account ID' (32 character hex string)"
if [ ! -z "$ACCOUNT_ID" ]; then
  echo "   ℹ️  Your Account ID: $ACCOUNT_ID"
fi
echo ""

echo "📌 Step 4: Create KV Namespaces"
echo "   Option A: Via CLI"
echo "     npx wrangler kv:namespace create qpu-cache"
echo "     npx wrangler kv:namespace create qpu-state"
echo ""
echo "   Option B: Via Dashboard → Workers → KV Namespaces → Create"
echo "     Then update wrangler.toml with namespace IDs"
echo ""

echo "📌 Step 5: Add GitHub Secrets"
echo "   1. Go to your GitHub repo"
echo "   2. Settings → Secrets and variables → Actions"
echo "   3. Create secret: CLOUDFLARE_API_TOKEN"
echo "      Value: (paste token from Step 2)"
echo "   4. Create secret: CLOUDFLARE_ACCOUNT_ID"
echo "      Value: (paste Account ID from Step 3)"
echo ""

echo "📌 Step 6: Configure Domain Routing"
echo "   1. Go to Cloudflare Dashboard → Workers"
echo "   2. Click on 'QPU' Worker (or create if needed)"
echo "   3. Click 'Routes'"
echo "   4. Add route: qpu.uuidna.com/*"
echo "   5. Confirm zone: uuidna.com"
echo ""

echo "📌 Step 7: Deploy"
echo "   Push to GitHub:"
echo "     git push origin develop   # Deploy to staging-qpu.uuidna.com"
echo "     git push origin main      # Deploy to qpu.uuidna.com (production)"
echo ""
echo "   Or deploy manually:"
echo "     npm run deploy:staging    # Local staging deployment"
echo "     npm run deploy:production # Local production deployment"
echo ""

echo "📌 Step 8: Verify Deployment"
echo "   After GitHub Actions completes (or manual deploy):"
echo ""
echo "   Health check:"
echo "     curl https://qpu.uuidna.com/health"
echo ""
echo "   MCP endpoint:"
echo "     curl -X POST https://qpu.uuidna.com/mcp \\"
echo "       -H 'Content-Type: application/json' \\"
echo "       -d '{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/list\",\"params\":{}}'"
echo ""

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  ✅ Local setup complete!                                 ║"
echo "║  Complete manual steps above, then deploy.                ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "📚 Full documentation: see DEPLOY.md"
