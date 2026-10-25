# Deployment

Deploy QPU MCP Server to Cloudflare Workers at **qpu.uuidna.com**.

## Quick Start

3-step deployment (8 minutes):

1. **Add domain** → https://dash.cloudflare.com/
2. **Connect GitHub** → Cloudflare auto-detects `wrangler.toml`
3. **Deploy** → `git push origin main`

[Full Guide →](./getting-started.md)

## Auto-Deploy

Cloudflare's native GitHub integration:
- `main` branch → **qpu.uuidna.com** (production)
- `develop` branch → **staging-qpu.uuidna.com** (staging)

## Reference

- [Getting Started](./getting-started.md) — 3-step quickstart
- [Cloudflare Workers](./cloudflare.md) — Technical details
- [Local Development](./local.md) — Local testing
- [Checklist](./checklist.md) — Complete reference

---

## Before You Deploy

1. **[Quick Start](/guide/quick-start)** — Verify local setup works
2. **[API Reference](/api/)** — Understand the tools
3. **[System Capacity](/concepts/capacity)** — Know the limits
4. **[Architecture](/architecture/)** — Understand the design

---

## Deployment Path

- **Local first**: [Local Development](./local.md)
- **Then cloud**: [Getting Started](./getting-started.md)
- **Check before shipping**: [Checklist](./checklist.md)

---

## Full Documentation Map

- **[Guide](/guide/quick-start)** — Tutorials and guides
- **[Concepts](/concepts/)** — System design and principles
- **[API Reference](/api/)** — Tool specifications
- **[Reference](/reference/)** — Component documentation
- **[Architecture](/architecture/)** — How it works
