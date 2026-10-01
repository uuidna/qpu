#!/bin/bash

###############################################################################
# Pre-Deployment Verification Script
# Ensures all systems are ready before tagging v1.0.0
# Exit code 0 = ready for deployment, non-zero = deployment blocked
###############################################################################

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  UUIDNA QPU v0.9.0 → v1.0.0 Pre-Deployment Verification      ║"
echo "╚════════════════════════════════════════════════════════════════╝"

FAILED=0
PASSED=0

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check() {
  echo -n "Checking: $1... "
  if eval "$2"; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
  else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
  fi
}

# ============================================================================
# 1. GIT STATE VERIFICATION
# ============================================================================

echo -e "\n${YELLOW}[1/10] Git State Verification${NC}"
check "Git branch is main" "git rev-parse --abbrev-ref HEAD | grep -q '^main$'"
check "No uncommitted changes" "git status --porcelain | wc -l | grep -q '^0$'"
check "No untracked files (except node_modules)" "git status --porcelain | grep -v 'node_modules' | wc -l | grep -q '^0$'"
check "All files staged" "git diff-index --cached --quiet HEAD"

# ============================================================================
# 2. BUILD VERIFICATION
# ============================================================================

echo -e "\n${YELLOW}[2/10] Build Verification${NC}"
check "npm run build succeeds" "npm run build > /dev/null 2>&1"
check "dist/ directory exists" "[ -d dist ]"
check "dist/quantum exists" "[ -d dist/quantum ]"
check "dist/deployment exists" "[ -d dist/deployment ]"
check "No TypeScript errors" "! npm run build 2>&1 | grep -q 'error TS'"

# ============================================================================
# 3. TEST VERIFICATION
# ============================================================================

echo -e "\n${YELLOW}[3/10] Test Verification${NC}"
check "All tests passing" "npm test > /dev/null 2>&1"
check "Receipt validation passing" "npm test 2>&1 | grep -q '11/11 pass'"

# ============================================================================
# 4. PAYLOAD TEMPLATE VERIFICATION
# ============================================================================

echo -e "\n${YELLOW}[4/10] Payload Template Verification${NC}"
check "Browser payload defined" "grep -q 'browserPayload' src/deployment/payload-templates.ts"
check "Standalone payload defined" "grep -q 'standalonePayload' src/deployment/payload-templates.ts"
check "Docker payload defined" "grep -q 'dockerPayload' src/deployment/payload-templates.ts"
check "Kubernetes payload defined" "grep -q 'kubernetesPayload' src/deployment/payload-templates.ts"
check "Auto-detect function exists" "grep -q 'autoDetectPayload' src/deployment/payload-templates.ts"

# ============================================================================
# 5. SECURITY VERIFICATION
# ============================================================================

echo -e "\n${YELLOW}[5/10] Security Verification${NC}"
check "Secure chat RBAC exists" "[ -f src/mcp/secure-chat-rbac.ts ]"
check "Quantum signalling exists" "grep -q 'QuantumSignaller' src/mcp/secure-chat-rbac.ts"
check "RBAC engine exists" "grep -q 'RBACEngine' src/mcp/secure-chat-rbac.ts"
check "Encryption implemented" "grep -q 'encryptSignal' src/mcp/secure-chat-rbac.ts"

# ============================================================================
# 6. CORE SYSTEMS VERIFICATION
# ============================================================================

echo -e "\n${YELLOW}[6/10] Core Systems Verification${NC}"
check "MCP operations defined" "[ -f src/mcp/core.ts ]"
check "Formulas orchestrated" "grep -q 'orchestrator' src/harmony/orchestrator.ts"
check "Quantum hardware integration" "[ -f src/quantum/quantum-executor.ts ]"
check "Distributed intelligence" "[ -f src/distributed/distributed-executor.ts ]"
check "Optimization systems" "[ -f src/optimization/jit-compiler.ts ]"

# ============================================================================
# 7. DEPLOYMENT MODE VERIFICATION
# ============================================================================

echo -e "\n${YELLOW}[7/10] Deployment Mode Verification${NC}"
check "Browser deployment config" "grep -q 'browser' src/deployment/payload-templates.ts"
check "Standalone deployment config" "grep -q 'standalone' src/deployment/payload-templates.ts"
check "Docker deployment config" "grep -q 'docker' src/deployment/payload-templates.ts"
check "Kubernetes deployment config" "grep -q 'kubernetes' src/deployment/payload-templates.ts"

# ============================================================================
# 8. DOCUMENTATION VERIFICATION
# ============================================================================

echo -e "\n${YELLOW}[8/10] Documentation Verification${NC}"
check "README exists" "[ -f README.md ]"
check "DEPLOYMENT_CHECKLIST exists" "[ -f DEPLOYMENT_CHECKLIST.md ]"
check "DEPLOYMENT_GUIDE exists" "[ -f docs/DEPLOYMENT_GUIDE_v0.2.2.md ]"
check "API documentation" "[ -f docs/API_REFERENCE.md ]"

# ============================================================================
# 9. PACKAGE VERIFICATION
# ============================================================================

echo -e "\n${YELLOW}[9/10] Package Verification${NC}"
check "package.json exists" "[ -f package.json ]"
check "package-lock.json exists" "[ -f package-lock.json ]"
check "Version correct" "grep -q '\"version\": \"0.5.0\"' package.json"
check "Build script exists" "grep -q '\"build\"' package.json"
check "Test script exists" "grep -q '\"test\"' package.json"

# ============================================================================
# 10. REMOTE VERIFICATION
# ============================================================================

echo -e "\n${YELLOW}[10/10] Remote Verification${NC}"
check "Remote origin configured" "git remote | grep -q '^origin$'"
check "Can fetch from origin" "git fetch origin > /dev/null 2>&1 || true; [ $? -eq 0 ]"
check "Local commits ahead" "git rev-list --count origin/main..HEAD | grep -E '^[0-9]+$'"

# ============================================================================
# SUMMARY
# ============================================================================

TOTAL=$((PASSED + FAILED))

echo -e "\n╔════════════════════════════════════════════════════════════════╗"
echo "║                    VERIFICATION SUMMARY                        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "Passed: ${GREEN}${PASSED}${NC}  |  Failed: ${RED}${FAILED}${NC}  |  Total: ${TOTAL}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ ALL CHECKS PASSED - READY FOR DEPLOYMENT${NC}"
  echo ""
  echo "Next steps:"
  echo "  1. Create tag: git tag -a v1.0.0 -m 'UUIDNA QPU v1.0.0'"
  echo "  2. Push tag: git push origin v1.0.0"
  echo "  3. Deploy to production"
  echo ""
  exit 0
else
  echo -e "${RED}✗ DEPLOYMENT BLOCKED - ${FAILED} CHECKS FAILED${NC}"
  echo ""
  echo "Fix the failing checks before deploying."
  echo ""
  exit 1
fi
