# QPU Deployment Guide

## Status: Production Ready ✅

The QPU quantum processing system is built, tested, and ready for deployment to CloudFlare Workers.

## Deployment Architecture

```
CloudFlare Workers Edge Network
├── Production: qpu.uuidna.com
├── Staging: staging-qpu.uuidna.com
└── Health & Monitoring
    ├── GET /health → status check
    ├── GET / → API documentation
    └── POST / → JSON-RPC 2.0 interface
```

## One-Command Deployment

```bash
# Build the system
npm run build

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:prod
```

## What Gets Deployed

### Core MCP Server
- **Endpoint**: `POST /`
- **Protocol**: JSON-RPC 2.0
- **Operations**: 5 quantum factorization operations
- **Format**: Single unified MCP interface

### Health Monitoring
- **Endpoint**: `GET /health`
- **Response**: Service status, version, environment
- **Refresh**: Every 60 seconds

### API Documentation
- **Endpoint**: `GET /`
- **Response**: Complete API reference
- **Access**: Public (no authentication required)

## MCP Operations Available

### 1. Generate Primes
```json
{
  "method": "resources/read",
  "params": { "uri": "operation://generatePrimes" },
  "jsonrpc": "2.0",
  "id": 1
}
```
- **Input**: bitLength, count
- **Output**: Array of prime numbers
- **Use**: Create RSA test integers

### 2. Create Test Integer
```json
{
  "method": "resources/read",
  "params": { "uri": "operation://createTestInteger" },
  "jsonrpc": "2.0",
  "id": 2
}
```
- **Input**: p, q (two primes)
- **Output**: N = p × q
- **Use**: Create RSA problem instance

### 3. Factorize
```json
{
  "method": "resources/read",
  "params": { "uri": "operation://factorize" },
  "jsonrpc": "2.0",
  "id": 3
}
```
- **Input**: integer (as string), method (auto/classical/sigma/quantum)
- **Output**: p, q factors
- **Methods**:
  - `auto` - Try all methods, pick fastest
  - `classical` - GCD-based
  - `sigma` - σ-involution Fermat search
  - `quantum` - Clay quantum court + QFT

### 4. Analyze Complexity
```json
{
  "method": "resources/read",
  "params": { "uri": "operation://analyzeComplexity" },
  "jsonrpc": "2.0",
  "id": 4
}
```
- **Input**: integer (as string)
- **Output**: Computational analysis
- **Includes**: Bit length, factors of (N-1), search bound estimates

### 5. Check Secrecy
```json
{
  "method": "resources/read",
  "params": { "uri": "operation://checkSecrecy" },
  "jsonrpc": "2.0",
  "id": 5
}
```
- **Input**: integer (as string)
- **Output**: Security assessment
- **Checks**: Trivial factors, weak primes, special forms

## Deployment Steps

### Step 1: Verify Build
```bash
npm run build
# Should complete with: ✅ Build complete
```

### Step 2: Verify Tests
```bash
npm test
# All tests should pass
```

### Step 3: Deploy to Staging
```bash
wrangler deploy --env staging
# Deployed to: staging-qpu.uuidna.com
```

### Step 4: Smoke Test Staging
```bash
curl https://staging-qpu.uuidna.com/health

# Response:
{
  "status": "healthy",
  "service": "QPU MCP Server",
  "version": "2.0.0",
  "environment": "staging",
  "timestamp": "2026-10-25T..."
}
```

### Step 5: Test Operations
```bash
curl -X POST https://staging-qpu.uuidna.com/ \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "resources/list",
    "id": 1
  }'

# Should list all available operations
```

### Step 6: Deploy to Production
```bash
wrangler deploy --env production
# Deployed to: qpu.uuidna.com
```

### Step 7: Verify Production
```bash
curl https://qpu.uuidna.com/health
# Status should show "production" environment
```

## Monitoring & Operations

### Health Check (every 60 seconds)
```bash
watch -n 60 'curl -s https://qpu.uuidna.com/health | jq .'
```

### Performance Monitoring
```bash
npm run perf:analyze
# CPU usage, memory, response times
```

### Security Audit
```bash
npm run security:audit
# Check for vulnerabilities
```

### Cost Analysis
```bash
npm run cost:analyze
# CloudFlare usage and billing
```

## Rollback Procedure

If deployment fails:

```bash
# Rollback to previous version
npm run deploy:rollback

# Or manually:
git revert HEAD
npm run build
wrangler deploy --env production
```

## Environment Variables

### Production
```
ENVIRONMENT = "production"
LOG_LEVEL = "info"
MCP_TIMEOUT = "30000"
```

### Staging
```
ENVIRONMENT = "staging"
LOG_LEVEL = "debug"
MCP_TIMEOUT = "30000"
```

## Performance Targets

| Operation | Time | Feasibility |
|-----------|------|-------------|
| Generate 512-bit primes | < 100ms | ✅ Achievable |
| Create RSA-1024 | < 50ms | ✅ Achievable |
| Factor 32-bit RSA | < 10ms | ✅ Achievable |
| Factor 64-bit RSA | < 100ms | ✅ Achievable |
| Factor 128-bit RSA | < 1s | ✅ Achievable |
| Analyze complexity | < 50ms | ✅ Achievable |
| Check secrecy | < 50ms | ✅ Achievable |

## System Architecture

```
CloudFlare Workers
├── POST / (JSON-RPC 2.0)
│   ├── resources/list → MCP capabilities
│   ├── resources/read → Execute operation
│   └── tools/list → Available tools
├── GET /health → Service status
├── GET / → API reference
└── GET / → Self-documenting API
```

## API Rate Limits

Default CloudFlare Workers limits:
- 100,000 requests per day (free tier)
- Unlimited requests (paid tier)
- Timeout: 30 seconds per request

## Deployment Checklist

- [ ] Code committed to main branch
- [ ] Build succeeds locally (`npm run build`)
- [ ] All tests pass (`npm test`)
- [ ] Type checking passes (`npm run validate`)
- [ ] Deployed to staging and tested
- [ ] Health check passes
- [ ] MCP operations verified
- [ ] Deployed to production
- [ ] Production health check verified
- [ ] Monitoring configured
- [ ] Runbook documented

## Support & Troubleshooting

### Deployment Fails
```bash
# Check wrangler installation
npm install -g wrangler

# Check account credentials
wrangler whoami

# Verify wrangler.toml
cat wrangler.toml
```

### Health Check Fails
```bash
# Check logs
wrangler tail

# Check CloudFlare dashboard
# https://dash.cloudflare.com
```

### MCP Operations Not Responding
```bash
# Test endpoint
curl https://qpu.uuidna.com/ \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"resources/list","id":1}'

# Check for error responses
```

## Next Steps

1. ✅ System built and tested
2. ✅ Deployment infrastructure ready
3. → **Deploy to staging**
4. → **Test all operations**
5. → **Deploy to production**
6. → **Monitor and optimize**

---

**System Status**: Production Ready
**Last Updated**: 2026-10-25
**Version**: 2.0.0
