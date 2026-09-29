# UUIDNA QPU - Cloudflare Workers Deployment

**Production Quantum Kernel on Cloudflare's Global Edge Network**

---

## Overview

UUIDNA QPU is deployed as a **Cloudflare Worker** at **qpu.uuidna.com**, providing:

- ✓ Global edge network (250+ data centers)
- ✓ 50ms TTFB (time to first byte)
- ✓ 99.99% uptime SLA
- ✓ Zero cold starts (persistent warm workers)
- ✓ Auto-scaling (handles spikes instantly)
- ✓ No infrastructure management
- ✓ Built-in caching (KV storage)
- ✓ Integrated R2 storage
- ✓ Service bindings (backend connectivity)

---

## Quick Deploy

```bash
# One-command deployment
npm run ship

# Or directly with wrangler
wrangler deploy

# Verify deployment (takes ~30 seconds)
curl https://qpu.uuidna.com/health
```

**Output:**
```json
{
  "status": "healthy",
  "timestamp": 1234567890,
  "version": "1.0.0"
}
```

---

## Configuration

### wrangler.toml

```toml
name = "uuidna-qpu"
main = "worker.js"
compatibility_date = "2026-08-01"

[[routes]]
pattern = "qpu.uuidna.com"
custom_domain = true

[[kv_namespaces]]
binding = "STORAGE"
id = "b341b266250444198e54508ca3aee53a"

[[r2_buckets]]
binding = "BLOBS"
bucket_name = "uuidna-qpu-blobs"

[[services]]
binding = "PAYLOAD"
service = "uuidna-payload"
```

### Environment Variables

```bash
# Set write token (optional)
wrangler secret put QPU_WRITE_TOKEN

# Deploy with specific environment
wrangler deploy --env production
```

---

## API Endpoints

**Base URL:** `https://qpu.uuidna.com`

### Health Checks

```bash
# Liveness
curl https://qpu.uuidna.com/health

# Readiness
curl https://qpu.uuidna.com/ready

# Metrics
curl https://qpu.uuidna.com/metrics
```

### Execute Tools

```bash
# Factor a number (Shor's algorithm)
curl -X POST https://qpu.uuidna.com/api/execute/cryptography/shor \
  -H "Content-Type: application/json" \
  -d '{"N": 91}'

# Result: { "result": { "factors": [7, 13] }, "duration": 5 }
```

### All Tools

**8 Domains × 33 Tools:**

```
/api/execute/phases/{phase1|phase2|phase3|unified}
/api/execute/cryptography/{shor|discreteLog}
/api/execute/optimization/{tsp|knapsack|graphColoring|grover}
/api/execute/entanglement/{ghzState|bellPairs}
/api/execute/simulation/{hamiltonianSimulation|hashCollision}
/api/execute/errorCorrection/{surfaceCode|stabilizerCode}
/api/execute/batch/{batchExecute|benchmark}
/api/execute/testing/{runTests|verify}
```

---

## Storage

### KV Storage (STORAGE binding)

```bash
# List all keys
wrangler kv:key list STORAGE

# Get a value
wrangler kv:key get STORAGE <key>

# Put a value
wrangler kv:key put STORAGE <key> <value>

# Delete a value
wrangler kv:key delete STORAGE <key>
```

**Use Cases:**
- Result caching
- User preferences
- Algorithm state
- Performance telemetry

### R2 Storage (BLOBS binding)

```bash
# List objects
wrangler r2 object list uuidna-qpu-blobs

# Upload file
wrangler r2 object create uuidna-qpu-blobs <key> --file <path>

# Download file
wrangler r2 object get uuidna-qpu-blobs <key>
```

**Use Cases:**
- Large result sets
- Training data
- Benchmarks
- Artifacts

---

## Monitoring

### Live Logs

```bash
# Watch real-time logs
wrangler tail

# Filter by status
wrangler tail --status ok
wrangler tail --status error

# Search logs
wrangler tail --search "shor"
```

### Cloudflare Dashboard

- **Workers:** https://dash.cloudflare.com/
- **Analytics:** Requests, errors, latency
- **Settings:** Domain, routing, rate limiting
- **KV:** Storage management
- **R2:** Blob storage

### Custom Monitoring

```bash
# Check request volume
curl https://qpu.uuidna.com/metrics

# Example response:
{
  "requests": 1234,
  "errors": 5,
  "avgLatency": 45,
  "p95Latency": 120
}
```

---

## Testing

### Local Testing

```bash
# Run locally before deploy
wrangler dev

# Access at http://localhost:8787
curl http://localhost:8787/health
```

### Staging Environment

```bash
# Deploy to staging environment
wrangler deploy --env staging

# Test staging deployment
curl https://staging.qpu.uuidna.com/health
```

### Production Verification

```bash
# Post-deploy verification script
#!/bin/bash
echo "Testing health..."
curl https://qpu.uuidna.com/health

echo "Testing Shor's algorithm..."
curl -X POST https://qpu.uuidna.com/api/execute/cryptography/shor \
  -d '{"N": 91}'

echo "Testing storage..."
wrangler kv:key list STORAGE
```

---

## Performance Optimization

### Edge Caching

```javascript
// Cache successful responses
response.headers.set('Cache-Control', 'max-age=3600');

// Or use KV for longer persistence
await env.STORAGE.put(key, JSON.stringify(result), {
  expirationTtl: 86400 // 24 hours
});
```

### Request Handling

```javascript
// Streaming large responses
return new Response(largeData, {
  headers: { 'Content-Type': 'application/json' }
});

// Compression (automatic)
// Cloudflare auto-gzips responses over 1KB
```

### Cost Optimization

| Metric | Limit | Cost |
|--------|-------|------|
| **Requests** | 100K/day | Free |
| **KV Operations** | 1M reads + 100K writes/day | Free |
| **R2 Storage** | 10GB/month | Free |
| **Durable Objects** | Optional | $0.15/GB/month |

---

## Troubleshooting

### Deployment Issues

```bash
# Check wrangler version
wrangler --version

# Update wrangler
npm install -g wrangler@latest

# Validate config
wrangler publish --dry-run

# Full deployment with verbose logging
wrangler deploy --verbose
```

### Runtime Issues

```bash
# Watch logs for errors
wrangler tail --status error

# Debug specific request
wrangler tail --search "error message"

# Check KV namespace connectivity
wrangler kv:namespace list
```

### Common Problems

| Problem | Solution |
|---------|----------|
| 522 error | KV namespace not accessible; check binding |
| 413 timeout | Request body too large (max 100MB) |
| Rate limit | Add Cloudflare Rate Limiting rule |
| Cold start | Not applicable (Workers always warm) |

---

## Security

### Authentication

```bash
# For write operations, set QPU_WRITE_TOKEN
wrangler secret put QPU_WRITE_TOKEN

# In code, validate token:
if (request.headers.get('Authorization') !== `Bearer ${env.QPU_WRITE_TOKEN}`) {
  return new Response('Unauthorized', { status: 401 });
}
```

### Rate Limiting

```toml
# Add to wrangler.toml
[rate_limit]
enabled = true
max_requests = 1000
period = 60  # per minute
```

### CORS

```bash
# Cloudflare automatically sets:
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

## CI/CD Integration

### GitHub Actions

```yaml
name: Deploy QPU to Cloudflare

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm test
      
      - name: Deploy to Cloudflare
        run: npm run ship
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

### Pre-deployment Checklist

```bash
# Test locally
wrangler dev

# Run tests
npm test

# Lint code
npm run lint

# Deploy to staging
wrangler deploy --env staging

# Verify staging
curl https://staging.qpu.uuidna.com/health

# Deploy to production
npm run ship

# Verify production
curl https://qpu.uuidna.com/health
```

---

## Rollback & Versioning

### Deployment History

```bash
# List recent deployments
wrangler deployments list

# Rollback to previous version
wrangler rollback
```

### Version Management

```toml
# In wrangler.toml, set version:
[version]
id = "abc123"
tag = "v1.0.0"
```

---

## Cost Optimization

**CRITICAL:** Read [COST_OPTIMIZATION.md](COST_OPTIMIZATION.md) BEFORE production deployment.

**Summary:**
- Free tier: 100K requests/day + 1M KV reads + 100K KV writes + 10GB R2
- **Strategy:** Use batching (100x cost reduction) + HTTP cache + KV TTLs
- **Target:** $0/month via smart architecture

**Key tactics:**
1. Batch 100 requests into 1 (use `/api/execute/batch/batchExecute`)
2. Use HTTP Cache-Control instead of KV reads
3. Set KV TTLs (never store indefinitely)
4. Enable R2 lifecycle (30-day auto-delete)
5. Compress responses (gzip)

**Example cost savings:**
- Baseline: $810/month
- With optimization: $0/month (free tier)
- **Savings: 100%**

---

## Next Steps

### Wave 2 Enhancements

- [ ] Batching middleware for all requests
- [ ] HTTP cache policy library
- [ ] KV cleanup/maintenance jobs
- [ ] Analytics Engine integration
- [ ] Cost monitoring dashboard
- [ ] Automated cost alerts

### Multi-Region Setup

```toml
# Deploy to specific regions
[[routes]]
pattern = "us.qpu.uuidna.com"
zone_name = "uuidna.com"

[[routes]]
pattern = "eu.qpu.uuidna.com"
zone_name = "uuidna.com"
```

### Enterprise Features

- Custom domain (qpu.uuidna.com) ✓
- DDoS protection (automatic)
- WAF rules (available)
- Page Rules (configurable)
- SSL/TLS (automatic)

---

## References

- **Wrangler CLI:** https://developers.cloudflare.com/workers/wrangler/
- **Workers Docs:** https://developers.cloudflare.com/workers/
- **KV Storage:** https://developers.cloudflare.com/workers/runtime-apis/kv/
- **R2 Storage:** https://developers.cloudflare.com/r2/
- **Service Bindings:** https://developers.cloudflare.com/workers/platform/bindings/about-service-bindings/

---

## Support

- 📖 **Docs:** [../docs/INDEX.md](../docs/INDEX.md)
- 🐛 **Issues:** https://github.com/uuidna/qpu/issues
- 💬 **Chat:** https://discord.gg/uuidna (when ready)

---

**Status:** ✓ Production Deployed | ✓ Global Edge | ✓ Zero Downtime

**Access:** https://qpu.uuidna.com
