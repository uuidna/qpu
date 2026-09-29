#!/bin/bash
# Load Testing Script - Verify QPU Performance Claims
# Runs complete test suite: ramp-up, burst, endurance, stress

set -e

echo "🚀 QPU Load Testing Suite"
echo "=================================================="
echo ""

# Configuration
TESTS=("ramp-up" "burst" "endurance" "stress")
RESULTS_DIR="load-test-results"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create results directory
mkdir -p "$RESULTS_DIR"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Results tracking
declare -A RESULTS

echo "📋 Test Plan:"
echo "1. Ramp-up test (gradual load increase)"
echo "2. Burst test (spike handling)"
echo "3. Endurance test (60s stability)"
echo "4. Stress test (breaking point)"
echo ""
echo "Estimated time: 5-10 minutes"
echo ""

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found. Please install Node.js${NC}"
    exit 1
fi

# Build first
echo "🔨 Building project..."
npm run build > /dev/null 2>&1
echo -e "${GREEN}✅ Build successful${NC}"
echo ""

# Run each test
for test in "${TESTS[@]}"; do
    echo "=================================================="
    echo "📊 Running: $test test"
    echo "=================================================="

    if npm run "load-test:$test" > "$RESULTS_DIR/${test}_${TIMESTAMP}.log" 2>&1; then
        RESULTS[$test]="PASSED"
        echo -e "${GREEN}✅ $test test PASSED${NC}"
    else
        RESULTS[$test]="FAILED"
        echo -e "${RED}❌ $test test FAILED${NC}"
        echo "   See: $RESULTS_DIR/${test}_${TIMESTAMP}.log"
    fi

    echo ""
done

# Summary
echo "=================================================="
echo "📊 Test Results Summary"
echo "=================================================="
echo ""

TOTAL_TESTS=${#TESTS[@]}
PASSED_TESTS=0

for test in "${TESTS[@]}"; do
    result=${RESULTS[$test]}
    if [ "$result" = "PASSED" ]; then
        echo -e "${GREEN}✅ $test${NC}"
        ((PASSED_TESTS++))
    else
        echo -e "${RED}❌ $test${NC}"
    fi
done

echo ""
echo "Score: $PASSED_TESTS/$TOTAL_TESTS tests passed"
echo ""

# Detailed results
echo "📋 Detailed Results:"
echo ""
for test in "${TESTS[@]}"; do
    echo "--- $test test ---"
    tail -10 "$RESULTS_DIR/${test}_${TIMESTAMP}.log"
    echo ""
done

# Export metrics
echo "📤 Exporting metrics..."
if command -v curl &> /dev/null; then
    echo "  Fetching dashboard data..."
    curl -s http://localhost:8080/api/analytics/dashboard 2>/dev/null > "$RESULTS_DIR/dashboard_${TIMESTAMP}.json" || true
    echo "  ✅ Dashboard data saved"

    echo "  Fetching health status..."
    curl -s http://localhost:8080/health 2>/dev/null > "$RESULTS_DIR/health_${TIMESTAMP}.json" || true
    echo "  ✅ Health status saved"
fi

echo ""
echo "📁 Results saved to: $RESULTS_DIR/"
ls -la "$RESULTS_DIR/"/*.log 2>/dev/null | tail -5

echo ""
if [ $PASSED_TESTS -eq $TOTAL_TESTS ]; then
    echo -e "${GREEN}🎉 All tests PASSED!${NC}"
    echo "Status: ✅ Production-ready"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed${NC}"
    echo "Status: ⚠️  Review logs for details"
    exit 1
fi
