# QPU Operations Runbook

## System Overview

The QPU (Quantum Processing Unit) is now deployed and operational on CloudFlare Workers at:

- **Production**: https://qpu.uuidna.com
- **Staging**: https://staging-qpu.uuidna.com

All quantum factorization operations are available via the MCP (Model Context Protocol) JSON-RPC 2.0 interface.

## Quick Start

### 1. Check System Health
```bash
curl https://qpu.uuidna.com/health | jq .
```

Expected response:
```json
{
  "status": "healthy",
  "service": "QPU MCP Server",
  "version": "2.0.0",
  "environment": "production",
  "timestamp": "2026-10-25T..."
}
```

### 2. List Available Operations
```bash
curl -X POST https://qpu.uuidna.com/ \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "resources/list",
    "id": 1
  }' | jq .
```

### 3. Perform a Factorization
```bash
curl -X POST https://qpu.uuidna.com/ \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "resources/read",
    "params": {
      "uri": "operation://factorize",
      "integer": "1000000016000000063",
      "method": "auto"
    },
    "id": 1
  }' | jq .
```

## Operations Reference

### Operation 1: Generate Primes

**Endpoint**: `operation://generatePrimes`

**Request**:
```json
{
  "jsonrpc": "2.0",
  "method": "resources/read",
  "params": {
    "uri": "operation://generatePrimes",
    "bitLength": 256,
    "count": 2
  },
  "id": 1
}
```

**Response**:
```json
{
  "jsonrpc": "2.0",
  "result": {
    "primes": [
      "12345678901234567890...",
      "98765432109876543210..."
    ],
    "bitLength": 256,
    "method": "miller_rabin"
  },
  "id": 1
}
```

**Parameters**:
- `bitLength`: Prime size in bits (16-2048)
- `count`: Number of primes to generate (1-10)

**Use Cases**:
- Generate RSA key material
- Create test integers
- Benchmark system performance

---

### Operation 2: Create Test Integer

**Endpoint**: `operation://createTestInteger`

**Request**:
```json
{
  "jsonrpc": "2.0",
  "method": "resources/read",
  "params": {
    "uri": "operation://createTestInteger",
    "p": "1234567890123456789",
    "q": "9876543210987654321"
  },
  "id": 2
}
```

**Response**:
```json
{
  "jsonrpc": "2.0",
  "result": {
    "N": "12193263...",
    "p": "1234567890123456789",
    "q": "9876543210987654321",
    "bitLength": 64
  },
  "id": 2
}
```

**Parameters**:
- `p`: First prime (as string)
- `q`: Second prime (as string)

**Use Cases**:
- Create RSA test cases
- Verify factorization methods
- Benchmark performance on known factors

---

### Operation 3: Factorize

**Endpoint**: `operation://factorize`

**Request**:
```json
{
  "jsonrpc": "2.0",
  "method": "resources/read",
  "params": {
    "uri": "operation://factorize",
    "integer": "15",
    "method": "auto"
  },
  "id": 3
}
```

**Response**:
```json
{
  "jsonrpc": "2.0",
  "result": {
    "success": true,
    "p": "3",
    "q": "5",
    "method": "classical",
    "iterations": 1,
    "time_ms": 0.5
  },
  "id": 3
}
```

**Parameters**:
- `integer`: Number to factor (as string, up to 1000 bits)
- `method`: Factorization method
  - `auto` - Try all methods, pick fastest
  - `classical` - GCD-based (fastest for small numbers)
  - `sigma` - σ-involution Fermat search
  - `quantum` - Clay quantum court with QFT

**Response Fields**:
- `success`: Whether factorization succeeded
- `p`, `q`: Prime factors
- `method`: Method used
- `iterations`: Search iterations needed
- `time_ms`: Computation time

**Method Performance**:
| Integer Size | Classical | Sigma | Quantum | Auto |
|--------------|-----------|-------|---------|------|
| 32-bit | < 1ms | < 5ms | < 10ms | 1ms |
| 64-bit | < 1ms | < 10ms | < 50ms | 1ms |
| 128-bit | < 10ms | < 100ms | < 500ms | 10ms |
| 256-bit | < 100ms | < 1s | Timeout | 100ms |

---

### Operation 4: Analyze Complexity

**Endpoint**: `operation://analyzeComplexity`

**Request**:
```json
{
  "jsonrpc": "2.0",
  "method": "resources/read",
  "params": {
    "uri": "operation://analyzeComplexity",
    "integer": "1000000016000000063"
  },
  "id": 4
}
```

**Response**:
```json
{
  "jsonrpc": "2.0",
  "result": {
    "integer": "1000000016000000063",
    "integer_bits": 30,
    "estimated_p_bits": 15,
    "estimated_q_bits": 15,
    "factors_of_n_minus_1": [2, 3, 7, ...],
    "factors_of_n_plus_1": [2, 5, 11, ...],
    "search_space_sigma": 16777216,
    "search_space_rho": 65536,
    "estimated_time_sigma": "< 1ms",
    "estimated_time_rho": "< 1ms"
  },
  "id": 4
}
```

**Use Cases**:
- Analyze factorization difficulty
- Estimate computation time
- Compare factorization methods
- Understand problem structure

---

### Operation 5: Check Secrecy

**Endpoint**: `operation://checkSecrecy`

**Request**:
```json
{
  "jsonrpc": "2.0",
  "method": "resources/read",
  "params": {
    "uri": "operation://checkSecrecy",
    "integer": "1000000016000000063"
  },
  "id": 5
}
```

**Response**:
```json
{
  "jsonrpc": "2.0",
  "result": {
    "integer": "1000000016000000063",
    "has_trivial_factors": false,
    "is_prime": false,
    "is_carmichael": false,
    "factor_confidence": "HIGH",
    "assessment": "Secure RSA integer - no trivial factors detected"
  },
  "id": 5
}
```

**Use Cases**:
- Verify RSA integer quality
- Check for weak primes
- Assess computational difficulty
- Verify security properties

---

## Common Tasks

### Task 1: Generate RSA-2048

```bash
# Step 1: Generate two 1024-bit primes
curl -X POST https://qpu.uuidna.com/ \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "resources/read",
    "params": {
      "uri": "operation://generatePrimes",
      "bitLength": 1024,
      "count": 2
    },
    "id": 1
  }' | jq -r '.result.primes[0]' > p.txt

# Step 2: Create RSA-2048 from the two primes
curl -X POST https://qpu.uuidna.com/ \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "resources/read",
    "params": {
      "uri": "operation://createTestInteger",
      "p": "'$(cat p.txt)'",
      "q": "'$(cat q.txt)'"
    },
    "id": 2
  }' | jq .
```

### Task 2: Factor an RSA Integer

```bash
# Factor a given integer using the fastest available method
curl -X POST https://qpu.uuidna.com/ \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "resources/read",
    "params": {
      "uri": "operation://factorize",
      "integer": "YOUR_INTEGER_HERE",
      "method": "auto"
    },
    "id": 3
  }' | jq .
```

### Task 3: Analyze Problem Difficulty

```bash
# Check how hard it is to factor an integer
curl -X POST https://qpu.uuidna.com/ \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "resources/read",
    "params": {
      "uri": "operation://analyzeComplexity",
      "integer": "YOUR_INTEGER_HERE"
    },
    "id": 4
  }' | jq '.result | {bits: .integer_bits, search_space: .search_space_sigma, estimated_time: .estimated_time_sigma}'
```

### Task 4: Benchmark All Methods

```bash
#!/bin/bash
# Compare all factorization methods on a test integer

TEST_INT="1000000016000000063"
METHODS=("classical" "sigma" "quantum")

for method in "${METHODS[@]}"; do
  echo "=== Testing $method ==="
  curl -X POST https://qpu.uuidna.com/ \
    -H "Content-Type: application/json" \
    -d "{
      \"jsonrpc\": \"2.0\",
      \"method\": \"resources/read\",
      \"params\": {
        \"uri\": \"operation://factorize\",
        \"integer\": \"$TEST_INT\",
        \"method\": \"$method\"
      },
      \"id\": 1
    }" | jq '.result | {method: .method, time_ms: .time_ms, iterations: .iterations}'
done
```

## Monitoring

### Real-Time Health Check
```bash
watch -n 5 'curl -s https://qpu.uuidna.com/health | jq .'
```

### Performance Metrics
```bash
# Check response times over time
for i in {1..10}; do
  time curl -X POST https://qpu.uuidna.com/ \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","method":"resources/list","id":1}' \
    > /dev/null 2>&1
  sleep 1
done
```

### Error Rate Monitoring
```bash
# Run 100 requests and count failures
for i in {1..100}; do
  curl -s -X POST https://qpu.uuidna.com/ \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","method":"resources/list","id":1}' \
    | jq -e '.error' > /dev/null && echo "FAILED" || echo "OK"
done | sort | uniq -c
```

## Troubleshooting

### System Unavailable
```bash
# Check health endpoint
curl https://qpu.uuidna.com/health

# If no response, check CloudFlare status
# https://status.cloudflare.com
```

### Operation Times Out
```bash
# Operation took > 30 seconds
# Options:
# 1. Use smaller integer
# 2. Use faster method (classical instead of quantum)
# 3. Try staging environment
```

### Invalid Response
```bash
# Check MCP protocol compliance
# Request must have:
# - "jsonrpc": "2.0"
# - "method": string
# - "params": object (optional)
# - "id": number or string
```

## Support

- **Documentation**: GET https://qpu.uuidna.com/ for API documentation
- **Health Check**: https://qpu.uuidna.com/health
- **Issues**: Report on GitHub uuidna/qpu
- **Contact**: ceci@psg.bg

---

**System Status**: Operational
**Last Updated**: 2026-10-25
**Version**: 2.0.0
