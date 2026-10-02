---
name: payload-cloudflare
description: Configure Next.js + Payload CMS on Cloudflare Workers in any combination — runtime (vinext, OpenNext), database (D1, Postgres via Hyperdrive, or the QPU document database with MongoDB semantics on KV+R2 RAID or on D1), upload storage (R2, S3, none), email (Resend, none) and any subset of the 11 Payload plugins. Use when asked to set up, generate, compare, migrate or verify a Payload/Next.js deployment on Cloudflare, or when MongoDB is wanted on Workers.
---

# Payload on Cloudflare, every combination

All configuration goes through the payload template system (`src/deployment/payload-templates.ts`): `PayloadTemplates.cloudflarePayload(combination)` and `cloudflareCombinations()`. Never hand-write a config outside it.

## Axes
| axis | values | notes |
|---|---|---|
| runtime | `vinext`, `opennext` | vinext is Cloudflare's recommended Next.js path (bindings from `cloudflare:workers`); OpenNext reads them with `getCloudflareContext` |
| db | `d1`, `postgres`, `qpu-raid`, `qpu-d1` | `postgres` connects through a Hyperdrive binding. MongoDB has no Workers path (no Hyperdrive support, no TCP for its driver): a MongoDB request is `qpu-raid` or `qpu-d1` — the QPU document database with MongoDB query/update semantics, Payload adapter `@uuidna/qpu/payload` |
| storage | `r2`, `s3`, `none` | Payload 4 takes storage adapters in `storage: [...]`, not `plugins` |
| email | `resend`, `none` | |
| plugins | any subset of ecommerce, form-builder, import-export, mcp, multi-tenant, nested-docs, redirects, search, sentry, seo, stripe | ecommerce needs `products: true`; multi-tenant adds a `tenants` collection |

A combination's key is `runtime/db/storage/email/plugins` with plugins sorted and joined by `+` (`-` for none), e.g. `vinext/qpu-raid/r2/resend/mcp+seo`.

## Generate one
```bash
npm run build && node scripts/payload-cloudflare.mjs --emit vinext/qpu-raid/r2/resend/mcp+seo --out ./my-site
```
Writes `payload.config.ts`, `wrangler.jsonc` (bindings: D1, HYPERDRIVE, STORAGE+BLOBS, MEDIA as the combination needs; ids omitted for Wrangler auto-provisioning, Hyperdrive id placeholder) and `dependencies.txt`. Secrets go in Wrangler secrets / `.dev.vars`: PAYLOAD_SECRET, plus RESEND_API_KEY, STRIPE_SECRET_KEY, S3_*, SENTRY_DSN when chosen.

## Verify all of them
```bash
npm run payload:cf
```
Enumerates every combination (98,304) with a content UUID and a quantum receipt (stream `payload-cf`), and type-checks every base with no plugins and with all plugins against the installed packages in one tsc program; writes `payload-cf-receipt.json`. A base that compiles with none and all compiles with every subset (plugins are independent `Plugin` calls). Before trusting a pass, break one generated config on purpose and confirm the check fails.

## Runtime checks (beyond types)
- The QPU adapter runs under Payload's local API in Node (memory store): CRUD, where/sort/pagination, drafts and versions, globals, auth, delete — use `overrideAccess: true` in Payload 4 local calls.
- All 11 plugins boot together on it and their hooks write through it (search indexing, multi-tenant relations, redirects, ecommerce products).
- Not run here: a deployed Worker against real D1/KV/R2/Hyperdrive bindings. Do that with `wrangler deploy` (OpenNext) or `npx @vinext/cloudflare deploy` (vinext), then exercise the admin and REST API.

## Limits to state
QPU database: a collection scan reads at most 4 pages × 1000 keys per request on KV+R2; KV is eventually consistent (prefer `qpu-d1` when read-after-write matters); no transactions (adapter answers null, Payload's "no transaction"); localized-field queries and geo operators are not supported.
