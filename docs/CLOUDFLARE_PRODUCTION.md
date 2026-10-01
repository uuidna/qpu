# Cloudflare Workers - Production Deployment Guide

**UUIDNA QPU v0.2.1**  
**License:** CC-BY-NC-ND-4.0

---

## ✅ Production Checklist

### Prerequisites

- [ ] Cloudflare account with Workers plan
- [ ] Domain configured in Cloudflare DNS
- [ ] IBM Quantum API key (optional, for real hardware)
- [ ] Database URL (PostgreSQL)
- [ ] Monitoring token (for external monitoring)

### Setup Steps

```bash
# 1. Login to Cloudflare
wrangler login

# 2. Get account ID
wrangler whoami
# Copy the Account ID (format: xxxx...xxxx)

# 3. Update wrangler.toml
nano wrangler.toml
# Replace YOUR_CLOUDFLARE_ACCOUNT_ID with actual ID
# Replace example.com with your domain

# 4. Create KV namespaces
wrangler kv:namespace create "formula-cache" --preview
wrangler kv:namespace create "metrics" --preview

# Copy the IDs to wrangler.toml for both production and staging

# 5. Set secrets (production)
wrangler secret put IBM_QUANTUM_API_KEY --env production
wrangler secret put DATABASE_URL --env production
wrangler secret put MONITORING_TOKEN --env production
wrangler secret put SIGNING_KEY --env production

# 6. Set secrets (staging)
wrangler secret put IBM_QUANTUM_API_KEY --env staging
wrangler secret put DATABASE_URL --env staging

# 7. Test locally
wrangler dev --env production
# Open http://localhost:8787

# 8. Deploy to production
wrangler deploy --env production

# 9. Verify deployment
wrangler tail --env production
```

---

## 🔒 Security Configuration

### Environment Secrets

Production requires 4 secrets:

```bash
# 1. IBM Quantum API Key
wrangler secret put IBM_QUANTUM_API_KEY --env production
# Value: sk-proj-abc123...

# 2. Database Connection String
wrangler secret put DATABASE_URL --env production
# Value: postgresql://user:pass@host:5432/db

# 3. Monitoring/Observability Token
wrangler secret put MONITORING_TOKEN --env production
# Value: token_xxx...

# 4. Request Signing Key
wrangler secret put SIGNING_KEY --env production
# Value: your-secret-key-here
```

### Cloudflare Security Features

Enable in Cloudflare Dashboard:

1. **WAF (Web Application Firewall)**
   - Enable OWASP ModSecurity Core Rule Set
   - Block SQL injection, XSS, RFI

2. **Bot Management**
   - Enable Super Bot Fight Mode
   - Verify requests from known bots

3. **DDoS Protection**
   - Enable HTTP Flood protection
   - Set rate limiting rules

4. **API Shield**
   - Enable authentication tokens
   - Require API key header

---

## 💰 Cost Optimization

### KV Storage (Formula Cache)

**Pricing:** $0.50 per million reads, $3.00 per million writes

**Optimization:**

```javascript
// ✓ Good: Cache formula results (high TTL)
const CACHE_TTL = 3600  // 1 hour

// ✗ Avoid: Caching every request (high write cost)
// Cache only GET requests, skip HEAD/OPTIONS
```

**Estimated costs:**
- 100K formula lookups/day = $1.50/month
- 10K writes/day = $9/month

### Durable Objects (Stateful Computation)

**Pricing:** $0.15 per million requests + $0.20 per GB storage

**Optimization:**

```javascript
// ✓ Use Durable Objects only for stateful waves
// ✗ Don't use for simple formula lookups
```

**Estimated cost:** $5-20/month (depending on wave complexity)

### Analytics Engine

**Pricing:** Included in Workers plan

**Benefit:** Free metrics collection and analysis

### Workers Requests

**Pricing:** First 100K free/day, then $0.50 per million requests

**Optimization:**

```javascript
// ✓ Cache heavily (reduce requests)
// ✓ Rate limit (prevent abuse)
// ✗ Avoid unnecessary API calls
```

**Estimated cost:** $0-5/month (with caching)

### Total Estimated Monthly Cost

| Component | Cost |
|-----------|------|
| KV Reads | $1.50 |
| KV Writes | $9.00 |
| Durable Objects | $10.00 |
| Workers Requests | $2.00 |
| Analytics | $0.00 |
| **Total** | **$22.50** |

*(Scales linearly with traffic; first 100K requests/day free)*

---

## 📊 Monitoring & Observability

### Cloudflare Analytics

Dashboard shows:
- Request count and bandwidth
- Error rate (4xx, 5xx)
- Worker CPU time
- KV operations

Access at: https://dash.cloudflare.com → Workers → Your Worker

### Custom Analytics (via Analytics Engine)

```javascript
// In worker.js, metrics are auto-tracked:
env.QUANTUM_METRICS.writeDataPoint({
  indexes: [pathname, status, method],
  blobs: [timestamp],
  doubles: [duration_ms]
})
```

Query in Cloudflare:

```javascript
// SQL query to find slow requests
SELECT timestamp, pathname, AVG(duration_ms)
FROM quantum_metrics
GROUP BY pathname
ORDER BY duration_ms DESC
LIMIT 10
```

### External Monitoring Integration

Use the `MONITORING_TOKEN` to send metrics:

```javascript
// Send to Datadog, New Relic, etc.
fetch('https://api.datadoghq.com/api/v1/series', {
  method: 'POST',
  headers: {
    'DD-API-KEY': env.MONITORING_TOKEN,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    series: [{
      metric: 'qpu.formula.latency',
      points: [[Date.now() / 1000, duration_ms]],
      tags: [`formula:${formulaName}`]
    }]
  })
})
```

---

## 🚀 Performance Optimization

### Edge Caching Strategy

```javascript
// Cache TTL by endpoint
const CACHE_TTL = {
  formula: 3600,      // 1 hour (formula data doesn't change)
  metrics: 300,       // 5 minutes (changes frequently)
  error: 60           // 1 minute (cache errors briefly)
}
```

### Rate Limiting

```javascript
// Production limits
RATE_LIMITS = {
  default: 1000,      // 1000 req/min per IP
  api: 500,           // 500 req/min for API calls
  health: 10000       // 10000 req/min for health checks
}
```

### Request Batching

```javascript
// Good: Batch multiple formulas in one request
POST /api/formulas/batch
{
  "formulas": ["Fibonacci_7", "Bell_3", "Catalan_3"]
}

// Bad: Separate requests for each formula
GET /api/formulas/Fibonacci_7
GET /api/formulas/Bell_3
GET /api/formulas/Catalan_3
```

### Database Connection Pooling

Handled by PostgreSQL on backend, but Cloudflare Workers can:

```javascript
// Reuse connections across requests
const db = env.DATABASE_URL
// Connection pooling happens server-side
```

---

## 🔍 Troubleshooting

### High CPU Usage

**Symptom:** Worker terminating requests (CPU exceeded 50s)

**Solution:** Optimize formula computation
```javascript
// Profile slow operations
const start = Date.now()
await expensiveComputation()
console.log(`Took ${Date.now() - start}ms`)

// Move to Durable Objects if stateful
// or to backend service if repeated
```

### High KV Cost

**Symptom:** Unexpected KV write charges

**Solution:** Implement smarter caching
```javascript
// Only write to KV on cache misses
if (!cachedValue) {
  await env.FORMULA_CACHE.put(key, value, { expirationTtl: 3600 })
}
```

### Rate Limit Rejection

**Symptom:** 429 Too Many Requests errors

**Solution:** Implement exponential backoff
```javascript
// Client side
async function withRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (e) {
      if (e.status === 429 && i < maxRetries - 1) {
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000))
      } else {
        throw e
      }
    }
  }
}
```

---

## 📈 Scaling Strategy

### Phase 1: Launch (0-1M requests/day)
- Single Worker instance
- KV for caching
- Estimated cost: $5-10/month

### Phase 2: Growth (1-10M requests/day)
- Add Durable Objects for stateful computation
- Implement aggressive caching
- Enable bot protection
- Estimated cost: $20-50/month

### Phase 3: Enterprise (10M+ requests/day)
- Multiple regional deployments
- Custom cache key strategy
- Database optimization
- Dedicated support
- Estimated cost: $100+/month

---

## 🛠️ Deployment Commands

### Deploy to Production

```bash
# Build
npm run build:prod

# Deploy
wrangler deploy --env production

# Verify
wrangler tail --env production --follow
```

### Deploy to Staging

```bash
wrangler deploy --env staging
```

### Rollback

```bash
# List deployments
wrangler deployments list --env production

# Rollback to previous
wrangler deployments rollback --env production
```

### View Logs

```bash
# Real-time logs
wrangler tail --env production

# With filtering
wrangler tail --env production --status error
```

---

## 🔄 CI/CD Integration

### GitHub Actions

Add to `.github/workflows/deploy-cloudflare.yml`:

```yaml
name: Deploy to Cloudflare

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 20
      
      - name: Install
        run: npm ci
      
      - name: Build
        run: npm run build:prod
      
      - name: Deploy to Cloudflare
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          environment: production
```

### GitHub Secrets Required

- `CLOUDFLARE_API_TOKEN` - API token from Cloudflare dashboard
- `CLOUDFLARE_ACCOUNT_ID` - Your account ID
- Plus all Worker secrets (IBM_QUANTUM_API_KEY, etc.)

---

## 📋 Maintenance

### Monthly Tasks

- [ ] Review analytics and costs
- [ ] Check error rates and performance
- [ ] Update dependencies
- [ ] Review security logs (WAF)

### Quarterly Tasks

- [ ] Load testing (ensure scaling works)
- [ ] Disaster recovery drill
- [ ] Security audit
- [ ] Cost optimization review

---

## Support & Resources

- **Cloudflare Docs**: https://developers.cloudflare.com/workers
- **Wrangler CLI**: https://developers.cloudflare.com/workers/wrangler
- **KV Storage**: https://developers.cloudflare.com/workers/runtime-apis/kv
- **Durable Objects**: https://developers.cloudflare.com/workers/runtime-apis/durable-objects
- **Analytics Engine**: https://developers.cloudflare.com/workers/platform/analytics-engine

---

**License:** CC-BY-NC-ND-4.0

For commercial licensing, contact ceccec@psg.bg
