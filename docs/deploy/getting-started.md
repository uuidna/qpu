# Deploy QPU to qpu.uuidna.com (Simplified)

**Just 3 steps. No GitHub secrets needed.**

## Step 1: Add Domain to Cloudflare (5 min)

1. Go to https://dash.cloudflare.com/
2. Click **Add a site** → Enter `uuidna.com`
3. Update DNS nameservers at your domain registrar:
   - NS1.CLOUDFLARE.COM
   - NS2.CLOUDFLARE.COM
   (Exact names provided by Cloudflare)

## Step 2: Connect GitHub to Cloudflare (2 min)

1. In Cloudflare Dashboard → **Workers & Pages**
2. Click **Create** → **Deploy with Git**
3. Connect your GitHub account (authorize Cloudflare app)
4. Select repo: `uuidna/qpu`
5. Cloudflare auto-detects `wrangler.toml`
6. Click **Deploy**

Cloudflare will:
- ✅ Clone the repo
- ✅ Build the Worker
- ✅ Deploy to qpu.uuidna.com
- ✅ Set up auto-deploy on git push

## Step 3: Verify (1 min)

```bash
curl https://qpu.uuidna.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "QPU MCP Server",
  "version": "2.0.0"
}
```

## Done!

- ✅ Domain configured
- ✅ GitHub connected
- ✅ Auto-deploy enabled
- ✅ qpu.uuidna.com live

Every push to `main` branch auto-deploys to production.
Every push to `develop` branch auto-deploys to staging.

**Total time: ~8 minutes**

No secrets, no complexity. Cloudflare handles everything.
