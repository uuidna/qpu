#!/bin/bash
# verify-bindings.sh
# Comprehensive Cloudflare bindings verification before deployment
# Checks: STORAGE (KV), BLOBS (R2), PAYLOAD (Service), CF_VERSION_METADATA

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 UUIDNA QPU - Bindings Verification${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""

# Counter
PASSED=0
FAILED=0
WARNINGS=0

# Helper functions
pass() {
  echo -e "${GREEN}✅ $1${NC}"
  ((PASSED++))
}

fail() {
  echo -e "${RED}❌ $1${NC}"
  ((FAILED++))
}

warn() {
  echo -e "${YELLOW}⚠️  $1${NC}"
  ((WARNINGS++))
}

# 1. Check wrangler installation
echo -e "${BLUE}1️⃣  Checking Prerequisites${NC}"
if command -v wrangler &> /dev/null; then
  pass "wrangler CLI is installed"
else
  fail "wrangler CLI not found. Install: npm install -g wrangler"
  exit 1
fi

if command -v curl &> /dev/null; then
  pass "curl is installed"
else
  fail "curl not found. Install curl to test endpoints"
  exit 1
fi

echo ""

# 2. Verify wrangler.jsonc configuration
echo -e "${BLUE}2️⃣  Verifying wrangler.jsonc${NC}"
if [ ! -f "wrangler.jsonc" ]; then
  fail "wrangler.jsonc not found"
  exit 1
fi

if grep -q "\"binding\": \"STORAGE\"" wrangler.jsonc; then
  pass "STORAGE binding configured"
else
  fail "STORAGE binding not found in wrangler.jsonc"
fi

if grep -q "\"binding\": \"BLOBS\"" wrangler.jsonc; then
  pass "BLOBS binding configured"
else
  fail "BLOBS binding not found in wrangler.jsonc"
fi

if grep -q "open-next/worker.js" worker.js; then
  pass "Payload app served in-process (worker.js)"
else
  warn "worker.js does not front the Payload app"
fi

if grep -q "version_metadata" wrangler.jsonc; then
  pass "CF_VERSION_METADATA binding configured"
else
  warn "CF_VERSION_METADATA binding not configured"
fi

echo ""

# 3. Test STORAGE (KV) binding
echo -e "${BLUE}3️⃣  Testing STORAGE (KV Namespace)${NC}"
STORAGE_ID=$(grep -A1 "binding = \"STORAGE\"" wrangler.jsonc | grep "^id = " | cut -d'"' -f2)

if [ -n "$STORAGE_ID" ]; then
  pass "STORAGE namespace ID: $STORAGE_ID"

  # Test write
  if wrangler kv:key put STORAGE qpu-binding-test "$(date +%s)" > /dev/null 2>&1; then
    pass "STORAGE write test passed"

    # Test read
    if VALUE=$(wrangler kv:key get STORAGE qpu-binding-test 2>/dev/null); then
      pass "STORAGE read test passed"

      # Test delete
      if wrangler kv:key delete STORAGE qpu-binding-test > /dev/null 2>&1; then
        pass "STORAGE delete test passed"
      else
        warn "STORAGE delete test failed"
      fi
    else
      fail "STORAGE read test failed"
    fi
  else
    fail "STORAGE write test failed - namespace may not be accessible"
  fi
else
  warn "STORAGE namespace ID not found in wrangler.jsonc"
fi

echo ""

# 4. Test BLOBS (R2) binding
echo -e "${BLUE}4️⃣  Testing BLOBS (R2 Bucket)${NC}"
BLOBS_BUCKET=$(grep -A1 "binding = \"BLOBS\"" wrangler.jsonc | grep "^bucket_name = " | cut -d'"' -f2)

if [ -n "$BLOBS_BUCKET" ]; then
  pass "BLOBS bucket: $BLOBS_BUCKET"

  # Test bucket exists
  if wrangler r2 bucket list | grep -q "$BLOBS_BUCKET"; then
    pass "BLOBS bucket exists"

    # Test write
    echo "test-$(date +%s)" > /tmp/qpu-binding-test.txt
    if wrangler r2 object create "$BLOBS_BUCKET" "qpu-binding-test.txt" --file /tmp/qpu-binding-test.txt > /dev/null 2>&1; then
      pass "BLOBS write test passed"

      # Test read
      if wrangler r2 object get "$BLOBS_BUCKET" "qpu-binding-test.txt" > /dev/null 2>&1; then
        pass "BLOBS read test passed"

        # Test delete
        if wrangler r2 object delete "$BLOBS_BUCKET" "qpu-binding-test.txt" > /dev/null 2>&1; then
          pass "BLOBS delete test passed"
        else
          warn "BLOBS delete test failed"
        fi
      else
        fail "BLOBS read test failed"
      fi
      rm -f /tmp/qpu-binding-test.txt
    else
      fail "BLOBS write test failed"
    fi
  else
    fail "BLOBS bucket '$BLOBS_BUCKET' does not exist"
  fi
else
  warn "BLOBS bucket name not found in wrangler.jsonc"
fi

echo ""

# 5. Test PAYLOAD (Service) binding
echo -e "${BLUE}5️⃣  Testing PAYLOAD (Service Binding)${NC}"
if grep -q "binding = \"PAYLOAD\"" wrangler.jsonc; then
  PAYLOAD_SERVICE=$(grep -A1 "binding = \"PAYLOAD\"" wrangler.jsonc | grep "^service = " | cut -d'"' -f2)
  pass "PAYLOAD service binding configured: $PAYLOAD_SERVICE"

  if wrangler services list 2>/dev/null | grep -q "$PAYLOAD_SERVICE"; then
    pass "PAYLOAD service '$PAYLOAD_SERVICE' is deployed"
  else
    warn "PAYLOAD service '$PAYLOAD_SERVICE' may not be deployed yet (may be required for production)"
  fi
else
  warn "PAYLOAD service binding not found (check if needed for your setup)"
fi

echo ""

# 6. Verify quantum kernel build
echo -e "${BLUE}6️⃣  Verifying Quantum Kernel Build${NC}"
if [ -f "dist/quantum/processing/unit/index.js" ]; then
  pass "Quantum kernel compiled (dist/quantum/processing/unit/index.js)"

  # Check for key exports
  if grep -q "qpuStorageOf" dist/quantum/processing/unit/index.js 2>/dev/null; then
    pass "qpuStorageOf function exported"
  else
    warn "qpuStorageOf may not be exported in compiled output"
  fi
else
  warn "Quantum kernel not yet compiled - will be built during deploy"
  echo "   Run 'npm run build' to compile now, or it will compile automatically on deploy"
fi

echo ""

# 7. Test worker deployment (if already deployed)
echo -e "${BLUE}7️⃣  Testing Worker Deployment${NC}"
if curl -s https://qpu.uuidna.com/health 2>/dev/null | grep -q "healthy"; then
  pass "Worker is deployed and responding"

  # Test API
  if curl -s -X POST https://qpu.uuidna.com/api/execute/phases/phase1 \
    -H "Content-Type: application/json" \
    -d '{}' 2>/dev/null | grep -q "result"; then
    pass "Worker API is functional"
  else
    warn "Worker API may not be fully operational"
  fi
else
  warn "Worker not yet deployed at qpu.uuidna.com (will be deployed with 'npm run ship')"
fi

echo ""

# 8. Environment variables
echo -e "${BLUE}8️⃣  Checking Environment${NC}"
if [ -n "$CLOUDFLARE_API_TOKEN" ]; then
  pass "CLOUDFLARE_API_TOKEN is set"
else
  warn "CLOUDFLARE_API_TOKEN not set - may need it for authenticated operations"
fi

if [ -n "$CLOUDFLARE_ACCOUNT_ID" ]; then
  pass "CLOUDFLARE_ACCOUNT_ID is set"
else
  warn "CLOUDFLARE_ACCOUNT_ID not set - Wrangler will use local config"
fi

if [ -n "$QPU_WRITE_TOKEN" ]; then
  pass "QPU_WRITE_TOKEN is set"
else
  warn "QPU_WRITE_TOKEN not set - auth-required endpoints will fail"
fi

echo ""

# 9. Summary
echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}📊 Verification Summary${NC}"
echo -e "${BLUE}=====================================${NC}"
echo -e "Passed:  ${GREEN}$PASSED${NC}"
echo -e "Failed:  ${RED}$FAILED${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
echo ""

# Verdict
if [ $FAILED -eq 0 ]; then
  if [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All bindings verified! Ready to deploy.${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. npm test              # Run test suite"
    echo "  2. wrangler dev          # Test locally"
    echo "  3. npm run ship          # Deploy to production"
    echo "  4. wrangler tail         # Watch live logs"
    exit 0
  else
    echo -e "${YELLOW}⚠️  Some warnings detected but no critical failures.${NC}"
    echo ""
    echo "You can proceed with deployment, but review warnings above."
    echo ""
    echo "Deploy with: npm run ship"
    exit 0
  fi
else
  echo -e "${RED}❌ Critical binding errors detected!${NC}"
  echo ""
  echo "Please fix the issues above before deploying."
  echo "See deploy/BINDINGS.md for troubleshooting."
  exit 1
fi
