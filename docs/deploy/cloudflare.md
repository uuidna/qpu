# Deploy QPU to Cloudflare Workers

Cloudflare Workers provides serverless compute at the edge, perfect for hosting the QPU MCP server globally.

## Prerequisites

- Cloudflare account with a domain (uuidna.com)
- `wrangler` CLI installed
- GitHub repository with CI/CD secrets configured
- Node.js 20+ installed locally

## Local Setup

### 1. Install Wrangler

```bash
npm install -D wrangler
```

### 2. Authenticate with Cloudflare

```bash
wrangler login
```

This opens your browser to authenticate and grants the CLI access to your account.

### 3. Create KV Namespaces

QPU uses Cloudflare KV for caching and state management:

```bash
npm run cf:kv:create
```

This creates two namespaces:
- `qpu-cache-prod`: Response caching
- `qpu-state-prod`: Persistent state

### 4. Configure Domain

Edit `wrangler.toml` and update the zone_name and routes:

```toml
[env.production]
routes = [
  { pattern = "qpu.uuidna.com/*", zone_name = "uuidna.com" }
]
```

Update `uuidna.com` to your actual domain.

## Deploy Locally

### Development (Local)

```bash
npm run deploy:dev
```

Opens a local development server at `http://localhost:8787`.

### Staging

```bash
npm run deploy:staging
```

Deploys to `staging-qpu.uuidna.com` (requires staging route in wrangler.toml).

### Production

```bash
npm run deploy:production
```

Deploys to `qpu.uuidna.com`.

## Verify Deployment

After deployment, verify the service is running:

```bash
# Health check
curl https://qpu.uuidna.com/health

# Documentation
curl https://qpu.uuidna.com/docs

# MCP compliance
curl -X POST https://qpu.uuidna.com/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

## GitHub Actions Setup

### Required Secrets

Add these to your GitHub repository settings:

1. **CLOUDFLARE_API_TOKEN**
   - Go to Cloudflare Dashboard → Account Settings → API Tokens
   - Create token with "Edit Cloudflare Workers" permissions
   - Add to GitHub: Settings → Secrets → New repository secret

2. **CLOUDFLARE_ACCOUNT_ID**
   - Go to Cloudflare Dashboard → Account Settings → Overview
   - Copy "Account ID"
   - Add to GitHub: Settings → Secrets → New repository secret

### Automated Deployment

The CI/CD pipeline deploys automatically:

- **Develop branch** → staging-qpu.uuidna.com
- **Main branch** → qpu.uuidna.com

Check GitHub Actions for deployment status.

## Configuration

### Environment Variables

Set in `wrangler.toml` per environment:

```toml
[env.production.vars]
ENVIRONMENT = "production"
LOG_LEVEL = "info"
MCP_TIMEOUT = "30000"

[env.staging.vars]
ENVIRONMENT = "staging"
LOG_LEVEL = "debug"
MCP_TIMEOUT = "30000"
```

### KV Bindings

Access KV in the Worker:

```typescript
export default {
  async fetch(request: Request, env: Env) {
    // env.QPU_CACHE — response caching
    // env.QPU_STATE — persistent state
    // env.QPU_ANALYTICS — analytics engine
  }
};
```

## Monitoring

### Analytics Engine

View analytics in Cloudflare Dashboard:
- Workers → QPU → Analytics
- Metrics: requests, errors, latency

### Logs

View real-time logs:

```bash
wrangler tail
```

Or in Cloudflare Dashboard:
- Workers → QPU → Real-time logs

### Custom Domains

Add custom domains:

```bash
wrangler deployments rollback
```

## Scaling & Performance

### Workers Limits

- **Requests**: 100,000 requests/day free tier
- **Timeout**: 30 seconds per request
- **Memory**: 128MB per execution
- **CPU**: Varies by plan

### Optimization

1. **Caching**: Use KV for frequently accessed data
2. **Edge Location**: Requests served from ~200 edge locations globally
3. **Compression**: Gzip/brotli automatic
4. **Durable Objects**: For stateful operations (optional)

## Rollback

Rollback to previous version:

```bash
wrangler deployments list
wrangler deployments rollback
```

## Cost

Cloudflare Workers pricing (as of 2024):

- **Free tier**: 100,000 requests/day
- **Paid tier**: $0.50/million requests
- **KV Storage**: Free 1GB, then $0.50/GB/month
- **Analytics Engine**: Included

## Troubleshooting

### Deployment fails

```bash
# Check authentication
wrangler whoami

# Validate configuration
wrangler publish --dry-run

# Check logs
wrangler tail
```

### Health check fails

```bash
# Test endpoint locally
npm run deploy:dev
curl http://localhost:8787/health

# Check Cloudflare logs
wrangler tail --env production
```

### High latency

1. Check Cloudflare Analytics
2. Review Worker execution time
3. Optimize database queries
4. Check KV access patterns

## Next Steps

- [API Reference](./api.md)
- [Examples](./examples-quick-start.md)
- [Architecture](./architecture.md)
- [Cloudflare Docs](https://developers.cloudflare.com/workers/)
