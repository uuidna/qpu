# QPU Cloudflare Workers Deployment Checklist

Complete guide for deploying QPU to Cloudflare Workers at **qpu.uuidna.com**.

## Phase 1: Cloudflare Setup

### Step 1: Create Cloudflare Account & Add Domain
- [ ] Go to https://dash.cloudflare.com/
- [ ] Create account (if needed)
- [ ] Add domain `uuidna.com`
- [ ] Update DNS nameservers to Cloudflare:
  - Tsvetan's Namespever Ceci DNS provider to point to Cloudflare
  - NS1, NS2, etc. (provided by Cloudflare)

### Step 2: Generate API Token
- [ ] Go to Cloudflare Dashboard → Account Settings → API Tokens
- [ ] Click "Create Token"
- [ ] Use template "Edit Cloudflare Workers"
- [ ] Add permission: "Account.Cloudflare Workers Scripts: Edit"
- [ ] Copy the token (save securely)

### Step 3: Get Account ID
- [ ] Go to Cloudflare Dashboard → Account Settings → Overview
- [ ] Copy "Account ID" (alphanumeric string)

## Phase 2: GitHub Setup

### Step 4: Add GitHub Secrets
- [ ] Go to GitHub repo Settings → Secrets and variables → Actions
- [ ] Create secret: **CLOUDFLARE_API_TOKEN** (from Step 2)
- [ ] Create secret: **CLOUDFLARE_ACCOUNT_ID** (from Step 3)

### Step 5: Create Cloudflare KV Namespaces

Option A: Via CLI (requires local setup)
```bash
# Install wrangler
npm install -D wrangler

# Login to Cloudflare
wrangler login

# Create namespaces
wrangler kv:namespace create qpu-cache
wrangler kv:namespace create qpu-state
```

Option B: Via Dashboard
- [ ] Go to Cloudflare Dashboard → Workers → KV Namespaces
- [ ] Create namespace: `qpu-cache`
- [ ] Create namespace: `qpu-state`
- [ ] Copy namespace IDs, update `wrangler.toml`:
  ```toml
  [[kv_namespaces]]
  binding = "QPU_CACHE"
  id = "your-cache-id"
  preview_id = "your-preview-id"
  ```

## Phase 3: Configure Domain Routing

### Step 6: Create Cloudflare Worker Route
- [ ] Go to Cloudflare Dashboard → Workers → QPU
- [ ] Click "Routes"
- [ ] Add route: `qpu.uuidna.com/*`
- [ ] Confirm zone: `uuidna.com`

### Step 7: Update wrangler.toml
Edit `wrangler.toml` and ensure:
```toml
[env.production]
routes = [
  { pattern = "qpu.uuidna.com/*", zone_name = "uuidna.com" }
]
```

## Phase 4: Deploy

### Step 8: Local Test (Optional)
```bash
# Install dependencies
npm install

# Build
npm run build

# Test locally
npm run deploy:dev
# Visit http://localhost:8787/health
```

### Step 9: Deploy to Staging
Push to `develop` branch or run:
```bash
npm run deploy:staging
```

Check GitHub Actions → Deploy to Cloudflare Workers → Staging

### Step 10: Deploy to Production
Push to `main` branch or run:
```bash
npm run deploy:production
```

Check GitHub Actions → Deploy to Cloudflare Workers → Production

## Phase 5: Verification

### Step 11: Verify Deployment
Once deployed, test:

```bash
# Health check
curl https://qpu.uuidna.com/health

# Expected response:
{
  "status": "healthy",
  "service": "QPU MCP Server",
  "version": "2.0.0",
  "environment": "production"
}
```

### Step 12: Test MCP Endpoint
```bash
curl -X POST https://qpu.uuidna.com/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list",
    "params": {}
  }'
```

### Step 13: Check Analytics
- [ ] Go to Cloudflare Dashboard → Workers → QPU → Analytics
- [ ] Verify requests are being tracked
- [ ] Check performance metrics

## Phase 6: Monitoring

### Step 14: Enable Real-time Logs
```bash
npm install -D wrangler
wrangler tail --env production
```

### Step 15: Set Up Alerting (Optional)
- [ ] Go to Cloudflare Dashboard → Notifications
- [ ] Create alert for high error rate
- [ ] Set error threshold (e.g., > 5% errors)

## Phase 7: DNS Configuration (If Using Custom Domain)

### Step 16: Update DNS Records
If not using Cloudflare nameservers, add CNAME:
```
qpu.uuidna.com CNAME example.workers.dev
```

Get your Worker's `.workers.dev` subdomain from:
- Cloudflare Dashboard → Workers → Settings → Default route

## Rollback

If deployment has issues:

```bash
# List recent deployments
wrangler deployments list

# Rollback to previous version
wrangler deployments rollback
```

Or re-deploy from a previous commit:
```bash
git checkout <commit-hash>
npm run deploy:production
```

## Testing All Features

### Test Solve Tool
```bash
curl -X POST https://qpu.uuidna.com/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "solve",
      "arguments": {
        "problem": "factorize rsa-260",
        "network": true
      }
    }
  }'
```

### Test Resources
```bash
curl -X POST https://qpu.uuidna.com/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "resources/read",
    "params": {
      "uri": "qpu://rsa/rsa-260"
    }
  }'
```

## Troubleshooting

### "Route not found" error
- Verify domain is in Cloudflare account
- Check `wrangler.toml` zone_name matches Cloudflare zone
- Ensure DNS is pointed to Cloudflare

### "Authentication failed" in CI/CD
- Verify CLOUDFLARE_API_TOKEN is set in GitHub Secrets
- Verify CLOUDFLARE_ACCOUNT_ID is set in GitHub Secrets
- Check token permissions include "Cloudflare Workers"

### High latency
- Check Cloudflare Analytics for performance
- Review KV namespace access patterns
- Consider caching headers

### KV operations failing
- Verify namespace IDs in `wrangler.toml`
- Check KV quota (1GB free tier)
- Review error logs: `wrangler tail`

## Next Steps

- ✅ Deployment complete
- [ ] Add custom caching headers
- [ ] Set up Durable Objects for stateful operations
- [ ] Configure rate limiting
- [ ] Add authentication/API keys (optional)
- [ ] Set up CDN for faster serving

## Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare KV Storage](https://developers.cloudflare.com/workers/runtime-apis/kv/)
- [QPU Documentation](./docs/)
- [GitHub Actions Integration](https://github.com/cloudflare/wrangler-action)

**Status**: Configuration complete, ready for deployment
**Domain**: qpu.uuidna.com
**Version**: 2.0.0
**Environments**: Staging (develop), Production (main)
