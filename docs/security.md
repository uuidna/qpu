---
title: Security
order: 53
---

# Security audit, both perspectives as one

Performed by `npm run next` on 2026-10-26T11:54:20.575Z through the `audit` tool: what a client of the MCP measures on 3 host(s) and what the developer measures in the tree, merged as one list (16 client, 7 developer, 2 both): 24/25 pass; 1 finding(s), each a lead with its remedy. Every finding is a lead with the remedy manual work taught.

| Check | Perspective | Pass | Evidence | Remedy |
|---|---|---|---|---|
| cors:qpu.uuidna.com | client | ✓ | allow-origin *, allow-headers content-type, authorization | reads answer every origin; writes carry Authorization |
| hsts:qpu.uuidna.com | client | ✓ | HSTS max-age=31536000; includeSubDomains | enable HSTS on the zone (Cloudflare SSL/TLS, Edge Certificates): the tenant's act |
| no-sniff:qpu.uuidna.com | client | ✓ | nosniff | the Worker answers X-Content-Type-Options: nosniff on every reply |
| write-needs-token:qpu.uuidna.com | client | ✓ | POST /entries without a token answers 404 | a write without Authorization is refused with 401 or 403 |
| surface-audit:qpu.uuidna.com | client | ✓ | 952/952 checks pass over MCP | every failed check is a lead with its evidence |
| cors:qpu.psg.bg | client | ✓ | allow-origin *, allow-headers content-type, authorization | reads answer every origin; writes carry Authorization |
| hsts:qpu.psg.bg | client | ✓ | HSTS max-age=31536000; includeSubDomains | enable HSTS on the zone (Cloudflare SSL/TLS, Edge Certificates): the tenant's act |
| no-sniff:qpu.psg.bg | client | ✓ | nosniff | the Worker answers X-Content-Type-Options: nosniff on every reply |
| write-needs-token:qpu.psg.bg | client | ✓ | POST /entries without a token answers 404 | a write without Authorization is refused with 401 or 403 |
| surface-audit:qpu.psg.bg | client | ✓ | 952/952 checks pass over MCP | every failed check is a lead with its evidence |
| cors:qpu.ceci.workers.dev | client | ✓ | allow-origin *, allow-headers content-type, authorization | reads answer every origin; writes carry Authorization |
| hsts:qpu.ceci.workers.dev | client | ✓ | HSTS max-age=31536000; includeSubDomains | enable HSTS on the zone (Cloudflare SSL/TLS, Edge Certificates): the tenant's act |
| no-sniff:qpu.ceci.workers.dev | client | ✓ | nosniff | the Worker answers X-Content-Type-Options: nosniff on every reply |
| write-needs-token:qpu.ceci.workers.dev | client | ✓ | POST /entries without a token answers 404 | a write without Authorization is refused with 401 or 403 |
| surface-audit:qpu.ceci.workers.dev | client | ✓ | 952/952 checks pass over MCP | every failed check is a lead with its evidence |
| payload-mcp-key | client | ✓ | the app is not deployed: the plugin requires Authorization: &lt;users&gt; API-Key (measured locally), pending online | the Payload MCP plugin refuses a request without a user's API key |
| dependencies:root | developer | ✓ | info 0, low 0, moderate 0, high 0, critical 0, total 0 | npm audit fix or a pinned fixed version; a finding is a lead |
| dependencies:site | developer | ✗ | info 0, low 11, moderate 44, high 45, critical 11 | npm audit fix or a pinned fixed version; a finding is a lead |
| no-leaks | developer | ✓ | 0 address(es) in the tree | contacts are URLs; the account email is read at deploy |
| env-named-not-valued | developer | ✓ | the environment example names every variable and holds no value | values never travel: names only |
| access-rules | developer | ✓ | entries.update: no one: an entry is its content address, so a change is a new entry; tenants.write: a super admin (the admin role) | an entry is its content address (no update); tenants are a super admin's |
| hooks-guarded | developer | ✓ | hooks: collisionGuard, firstUserBootstrap, appRequest | the plugin adds the collision guard, the first-user bootstrap and the validated app request |
| signing-at-edge | developer | ✓ | ML-DSA under webcrypto_modern_algorithms (wrangler.jsonc) | the Worker signs with ML-DSA under the Web Crypto flag |
| rest-rbac-both-ways | both | ✓ | two directions under three tenant roles on every adapter dimension (textbook_rest_rbac) |  |
| theorems-sealed | both | ✓ | 1036 kernel-accepted theorems | the textbook is the proof |
