---
title: Security
order: 53
---

# Security audit, both perspectives as one

Performed by `npm run next` on 2026-10-26T15:46:03.092Z through the `audit` tool: what a client of the MCP measures on 3 host(s) and what the developer measures in the tree, merged as one list (16 client, 8 developer, 2 both): 25/26 pass; 1 finding(s), each a lead with its remedy. Every finding is a lead with the remedy manual work taught.

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
| dependencies:site | developer | ✗ | info 0, low 3, moderate 7, high 4, critical 0 | npm audit fix or a pinned fixed version; a finding is a lead |
| no-leaks | developer | ✓ | 0 address(es) in the tree | contacts are URLs; the account email is read at deploy |
| no-autologin | developer | ✓ | no auto-login in the Payload config | remove admin.autoLogin from site/src/payload.config.ts: the first user comes from the deployer's account, its password by reset |
| env-named-not-valued | developer | ✓ | the environment example names every variable and holds no value | values never travel: names only |
| access-rules | developer | ✓ | entries.update: no one: an entry is its content address, so a change is a new entry; tenants.write: a super admin (the admin role) | an entry is its content address (no update); tenants are a super admin's |
| hooks-guarded | developer | ✓ | hooks: collisionGuard, firstUserBootstrap, appRequest | the plugin adds the collision guard, the first-user bootstrap and the validated app request |
| signing-at-edge | developer | ✓ | ML-DSA under webcrypto_modern_algorithms (wrangler.jsonc) | the Worker signs with ML-DSA under the Web Crypto flag |
| rest-rbac-both-ways | both | ✓ | two directions under three tenant roles on every adapter dimension (textbook_rest_rbac) |  |
| theorems-sealed | both | ✓ | 1079 kernel-accepted theorems | the textbook is the proof |

## Access from every perspective

The access audit through `audit { access: true }`: public, tenant, operator, client, developer, legal over pages, entries, products, orders, tenants, users; 3 tenant roles × 3 docket roles × 4 operations = 36 role–operation combinations, each decided by one of three deciders: the user's roles, the x-qpu-role header, the entry's kind (textbook_access_combinations); 19/19 pass; clean. Every cell names its hook, its cost, its licence clause and its legal fact, so security and privacy are never apart from the licence and the legal terms.

| Check | Perspective | Pass | Evidence | Hook | Cost | Licence | Legal |
|---|---|---|---|---|---|---|---|
| public:read-everyone | public | ✓ | entries and tenants read by everyone; every tool answers without a credential | none: a read is served from the cache by address | free: a cache hit by address, a 304 by involution | BY: every answer carries _meta.license and the attribution | the moral right of attribution (Berne art. 6bis), honoured on every read |
| public:create-call-only | public | ✓ | an anonymous create is a call, whose address folds it; any other kind needs a tenant role or the writer token | beforeValidate: the content address on create, so a repeated call is the same row | paid once by the provider for the first computation, free after by address | NC: non-commercial use is free and needs no licence; the a432 default is priced 0 | consideration: non-commercial free, commercial billed on the measured advantage |
| public:no-update-anywhere | public | ✓ | no one updates an entry: a change is a new entry linked to the one it replaces | none on change: nothing cached under an address changes | free: no revalidation, ever | ND: no derivative of a sealed entry; the chain of entries is the history | integrity (Berne art. 6bis); the sui generis database right over the sealed ledger (Directive 96/9/EC art. 7) |
| tenant:roles-and-scopes | tenant | ✓ | tenant-admin, editor, viewer over pages, entries, products, orders; reader, writer, admin over the docket | the multi-tenant plugin scopes every read and write by the user's tenants | free: a where on the tenant | the licence names the domains it covers; a tenant acts on its own | tenant isolation: one docket per tenant host; a token at another tenant's host holds no role |
| tenant:delete-scoped | tenant | ✓ | a tenant-admin deletes within its tenant (a where), the admin token within its docket, a super admin anywhere | access.delete: the where is the hook | free: the where is evaluated by the database | the licence's domains bound the act | accountability: a deletion is a role's, named by the token or the user |
| tenant:write-super-admin | tenant | ✓ | tenants are created, updated and deleted by a super admin alone | access on the tenants collection | free | the licence is per domain: a tenant row is a licensed domain | the operator answers for the tenants it names |
| tenant:bindings-named-not-valued | tenant | ✓ | the tenant admin selects binding names (profile, connectors, variables); a value is refused by the field | validate on tenants.bindings.variables.name | free | the licence names the domain, the bindings name the providers: nothing secret in Payload | privacy by data minimisation: no secret, no personal datum in the tree or the admin |
| operator:first-user-from-deploy | operator | ✓ | the first user comes from the deployer's account at deploy; no address in the generated code | users.beforeChange: firstUserBootstrap | free | the author is attributed by ORCID and URL, never by an address | no personal datum kept in the tree: the deployer's address is read at deploy, never written |
| operator:super-admin-everywhere | operator | ✓ | the admin role has access to every tenant; everyone else acts in its tenants | userHasAccessToAllTenants of the multi-tenant plugin | free | the operator holds the licence catalogue: a domain licence is an order of its ecommerce | the operator is the author or the party the author licensed |
| client:api-key-per-user | client | ✓ | every user may hold an API key; the Payload MCP plugin refuses an anonymous request | the plugin: auth.useAPIKey on users | free | a key is a user's of a licensed tenant | accountability: every write over the app's MCP is a user's |
| client:pure-tools-no-credential | client | ✓ | 46 tools, every one read-only and idempotent; credential-named arguments: stripe.secret (the Worker passes it at the edge) | none: the tools are pure functions of their arguments | free: a 304 by involution needs no scope at all | BY: the a432 default free to all under attribution | no credential travels through a tool from a client; where the Worker passes one at the edge, a client never holds it |
| client:advantage-unlimited-no-interaction | client | ✓ | the advantage is computed from the run's counts alone: when every copy is an involution it is unbounded; the metrics tool takes artefacts and nothing else | none: the gate decodes, the involution answers 304, the metric follows | free: no approval, no token, no bound (textbook_advantage_unbounded) | the advantage is what commercial use is billed on, and what non-commercial use gets free | consideration measured by the unit (bill_call), recheckable by anyone |
| developer:content-address-on-create | developer | ✓ | the entry id is the content address of { kind, from, body }, the sha256 beside it, on create only | entries.beforeValidate | free: a duplicate write lands on the same id | ND: an entry is its content | integrity: the address is the proof |
| developer:collision-guard | developer | ✓ | an edit names the address it read and is accepted only while the document still folds to it; a collision answers both addresses | pages.beforeChange: collisionGuard | free: folded from the document the hook already holds | ND: no silent overwrite of anyone's edit | integrity of concurrent authorship |
| developer:app-request-validated | developer | ✓ | an app request is validated as it is typed and refused by the hook when the stream refused it | form-submissions.afterChange: appRequest | free: validated token free | commercial: the app is priced by the catalogue and ordered through the ecommerce plugin | a licence sold is an order with its terms |
| legal:licence-on-every-answer | legal | ✓ | every tools/call result carries _meta.license; initialize states the terms | the handler: _meta.license on every result | free | CC-BY-NC-ND-4.0: Attribute the author; do not distribute a derivative; commercial use of the QPU framework, over UUID or by any other means, requires a licence from the author (https://qpu.uuidna.com). The a432 harmonic default is offered for free benefit under attribution. | the licence is the contract every reader accepts by reading; its address is sealed (9ffcda04-5adc-872e-9358-6b831bbd0c0d) |
| legal:catalogue-free-default | legal | ✓ | the a432 harmonic default at 0 on every domain; a named domain licensed by the year | the ecommerce plugin: products, variants, orders | free to read, paid to license | NC and commercial: the catalogue is the licence | consideration: non-commercial free and needing no licence; commercial billed |
| legal:gdpr-kyc-at-stripe | legal | ✓ | the licence entry stores event, type, state, subject, tenant, domains, product, variant, quantity, customer, amount, currency, at, licence, terms: the customer a Stripe id, no name, address, card or identity document | the stripe tool: the webhook verified before anything is written, the entry the licence | free: the identity and the payment data never enter the tree | all non-harmonic use licensed over MCP by billable automation: the licence is the order, the order is Stripe's checkout | GDPR and KYC are Stripe's: the customer's identity and payment data live at Stripe under its DPA and its account verification; the tree keeps the order, the tenant and the domains |
| legal:facts-not-advice | legal | ✓ | recomputable facts, not legal advice; the work represented by its canonical site only | none | free | the disclaimer travels with the licence | the inputs a qualified attorney starts from, never the conclusion |
