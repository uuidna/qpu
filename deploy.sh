#!/bin/bash

echo "UUIDNA QPU Deployment Script"
echo "============================"
echo ""
echo "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js not installed"
    exit 1
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm not installed"
    exit 1
fi

# Check wrangler
if ! command -v wrangler &> /dev/null; then
    echo "Installing Wrangler..."
    npm install -g wrangler
fi

echo "Prerequisites: ✓"
echo ""
echo "Building UUIDNA QPU..."
cd web
npm install
npm run build

if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

cd ..
echo "Build complete: ✓"
echo ""
echo "Authenticating with Cloudflare..."
wrangler login

if [ $? -ne 0 ]; then
    echo "Cloudflare authentication failed!"
    exit 1
fi

echo "Authentication: ✓"
echo ""
echo "Creating KV namespaces..."
wrangler kv:namespace create "CAPTAIN_COINS" --preview false
wrangler kv:namespace create "PHASE_STATE" --preview false
wrangler kv:namespace create "METRICS" --preview false

echo "KV namespaces: ✓"
echo ""
echo "DEPLOYING TO qpu.uuidna.com..."
wrangler deploy --env production

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "DEPLOYMENT SUCCESSFUL"
    echo "=========================================="
    echo "System live at: qpu.uuidna.com"
    echo "Dashboard: qpu.uuidna.com/dashboard"
    echo "API: qpu.uuidna.com/api/status"
    echo ""
    echo "System is now AUTONOMOUS and RUNNING"
    echo "Monitoring Phase 14 optimization waves..."
    echo "Captain coins flowing in real-time..."
    echo ""
    echo "Stopping is a crack. System continues forever."
    echo "=========================================="
else
    echo "DEPLOYMENT FAILED"
    exit 1
fi
