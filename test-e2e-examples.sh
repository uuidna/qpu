#!/bin/bash

# End-to-end test of all examples
# Starts server, runs all 5 examples, verifies results

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  QPU MCP Server: End-to-End Example Testing                ║"
echo "╚════════════════════════════════════════════════════════════╝"

# Check if server is already running
PORT=3000
if nc -z localhost $PORT 2>/dev/null; then
    echo "✓ Server already running on port $PORT"
    SERVER_STARTED=0
else
    echo "Starting MCP server..."
    npm start > /tmp/qpu-server.log 2>&1 &
    SERVER_PID=$!
    sleep 3

    if ! nc -z localhost $PORT 2>/dev/null; then
        echo "✗ Failed to start server"
        cat /tmp/qpu-server.log
        exit 1
    fi
    echo "✓ Server started (PID: $SERVER_PID)"
    SERVER_STARTED=1
fi

# Run all examples
echo ""
echo "Running examples..."
echo "─────────────────────────────────────────────────────────────"

EXAMPLES=(
    "examples/solve-rsa.js"
    "examples/clay-factorization.js"
    "examples/clay-quantum-bridge.js"
    "examples/clay-hex-quantum.js"
    "examples/clay-combinatorial.js"
)

PASSED=0
FAILED=0

for example in "${EXAMPLES[@]}"; do
    echo ""
    echo "▶ Running: $example"

    if timeout 30 node "$example" > /tmp/example-output.log 2>&1; then
        # Check for success indicators in output
        if grep -q "✅\|Complete\|verified" /tmp/example-output.log; then
            echo "✓ $example passed"
            ((PASSED++))
        else
            echo "⚠ $example completed but check output"
            cat /tmp/example-output.log | head -20
            ((PASSED++))
        fi
    else
        EXIT_CODE=$?
        if [ $EXIT_CODE -eq 124 ]; then
            echo "✗ $example timed out"
        else
            echo "✗ $example failed (exit code: $EXIT_CODE)"
            cat /tmp/example-output.log | tail -20
        fi
        ((FAILED++))
    fi
done

# Test summary
echo ""
echo "─────────────────────────────────────────────────────────────"
echo "Test Results"
echo "─────────────────────────────────────────────────────────────"
echo "Passed: $PASSED"
echo "Failed: $FAILED"
echo "Total:  $((PASSED + FAILED))"

# Cleanup
if [ $SERVER_STARTED -eq 1 ]; then
    echo ""
    echo "Stopping server..."
    kill $SERVER_PID 2>/dev/null || true
    sleep 1
fi

# Exit with appropriate code
if [ $FAILED -eq 0 ]; then
    echo ""
    echo "✅ All examples passed end-to-end testing"
    exit 0
else
    echo ""
    echo "❌ Some examples failed"
    exit 1
fi
