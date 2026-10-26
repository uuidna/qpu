// Standards fused, pure: schema.org as the JSON-LD every block and page carries (CreativeWork in a SoftwareApplication, the
// author a Person with an ORCID, the licence a URL, dates in ISO 8601, languages in ISO 639-1, currencies in ISO 4217,
// countries in ISO 3166-1), and the free CLDR lists (Unicode's JSON of the ISO codes with their names) read as contracts so
// the tree's locales and currencies are validated against the standard, never against prose. No I/O here.
import { LICENSE } from './license.js'
import { VERSION } from './version.js'

export const STANDARDS: readonly { id: string; name: string; contract: string; kind: 'vocabulary' | 'codes' | 'reference' }[] = [
  // the reference site: payloadcms.com is built of what Payload computes (its REST answers Payload's own shape: docs with blocks, meta, breadcrumbs), as qpu.uuidna.com is built of what qpu computes
  { id: 'payload-site', name: 'payloadcms.com, built with Payload (REST pages)', contract: 'https://payloadcms.com/api/pages?limit=1&depth=0', kind: 'reference' },
  // NIST's first post-quantum standards, read at CSRC on 2026-10-25: FIPS 203, 204 and 205 published August 13, 2024; HQC selected March 11, 2025 (NIST IR 8545)
  // Stripe's own contract: every use case of its API a path of its OpenAPI specification, read by the discover step and compared to the MCP's combinations by the stripe tool (op usecases)
  { id: 'stripe-openapi', name: 'Stripe API, the OpenAPI specification: every use case a path', contract: 'https://raw.githubusercontent.com/stripe/openapi/master/openapi/spec3.json', kind: 'reference' },
  { id: 'nist-fips-203', name: 'NIST FIPS 203, Module-Lattice-Based Key-Encapsulation Mechanism Standard (ML-KEM)', contract: 'https://csrc.nist.gov/pubs/fips/203/final', kind: 'reference' },
  { id: 'nist-fips-204', name: 'NIST FIPS 204, Module-Lattice-Based Digital Signature Standard (ML-DSA)', contract: 'https://csrc.nist.gov/pubs/fips/204/final', kind: 'reference' },
  { id: 'nist-fips-205', name: 'NIST FIPS 205, Stateless Hash-Based Digital Signature Standard (SLH-DSA)', contract: 'https://csrc.nist.gov/pubs/fips/205/final', kind: 'reference' },
  { id: 'nist-pqc', name: 'NIST Post-Quantum Cryptography project (the selections, HQC among them)', contract: 'https://csrc.nist.gov/projects/post-quantum-cryptography', kind: 'reference' },
  // Payload's own skills for agents (github.com/payloadcms/skills): read as a tree, every SKILL.md a skill, every reference a door the payload toolbox maps; no licence is declared there, so only names, paths and sizes are read, never the text
  // the source of payloadcms.com (github.com/payloadcms/website, MIT): the tree read for its collections, blocks, globals, fields and plugins, the proof that the site is what Payload computes
  // the Claude API's overview, read as a page; its Models door answers 401 until a tenant's key opens it (discovery names it, never guesses)
  { id: 'cloudflare-webcrypto-modern', name: 'Cloudflare changelog 2026-09-28: Web Crypto adds ML-KEM and ML-DSA (webcrypto_modern_algorithms)', contract: 'https://developers.cloudflare.com/changelog/post/2026-09-28-webcrypto-modern-algorithms/', kind: 'reference' },
  { id: 'claude-api', name: 'Claude API overview (platform.claude.com)', contract: 'https://platform.claude.com/docs/en/api/overview', kind: 'reference' },
  { id: 'payload-website', name: 'payloadcms/website, the source of payloadcms.com (the repository tree)', contract: 'https://api.github.com/repos/payloadcms/website/git/trees/main?recursive=1', kind: 'reference' },
  { id: 'payload-packages', name: 'payloadcms/payload, the packages Payload ships (the packages directory)', contract: 'https://api.github.com/repos/payloadcms/payload/contents/packages', kind: 'reference' },
  { id: 'payload-ecommerce-template', name: 'payloadcms/payload, the ecommerce template (templates/ecommerce/src)', contract: 'https://api.github.com/repos/payloadcms/payload/contents/templates/ecommerce/src', kind: 'reference' },
  { id: 'ecb-rates', name: 'European Central Bank, euro foreign exchange reference rates (daily XML)', contract: 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml', kind: 'reference' },
  { id: 'frankfurter-rates', name: 'Frankfurter, the ECB rates as JSON (v1)', contract: 'https://api.frankfurter.dev/v1/latest?base=EUR', kind: 'reference' },
  { id: 'bnb-rates', name: 'Bulgarian National Bank, reference rates (foreign currency per euro)', contract: 'https://www.bnb.bg/Statistics/StExternalSector/StExchangeRates/StERForeignCurrencies/index.htm?download=xml&search=&lang=EN', kind: 'reference' },
  { id: 'er-api-rates', name: 'open.er-api.com, daily rates (free tier)', contract: 'https://open.er-api.com/v6/latest/EUR', kind: 'reference' },
  { id: 'currency-api-rates', name: 'fawazahmed0/currency-api on jsDelivr (daily, CC0)', contract: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json', kind: 'reference' },
  { id: 'clay-millennium-rules', name: 'Clay Mathematics Institute, rules for the Millennium Prize Problems', contract: 'https://www.claymath.org/millennium-problems/rules/', kind: 'reference' },
  { id: 'xprize-quantum-applications', name: 'XPRIZE Quantum Applications (Google Quantum AI)', contract: 'https://www.xprize.org/prizes/qc-apps', kind: 'reference' },
  { id: 'vercel-open-source-program', name: 'Vercel Open Source Program', contract: 'https://vercel.com/open-source-program', kind: 'reference' },
  { id: 'github-accelerator', name: 'GitHub Accelerator and maintainer programs', contract: 'https://github.com/accelerator', kind: 'reference' },
  { id: 'google-patents', name: 'Google Patents, the query endpoint its site uses (JSON behind a prefix)', contract: 'https://patents.google.com/xhr/query?url=q%3Dquantum%2Berror%2Bcorrection%26num%3D1', kind: 'reference' },
  { id: 'epo-publication-server', name: 'EPO publication server REST, the publication dates', contract: 'https://data.epo.org/publication-server/rest/v1.2/publication-dates', kind: 'reference' },
  { id: 'nist-beacon', name: 'NIST Randomness Beacon 2.0, the last pulse', contract: 'https://beacon.nist.gov/beacon/2.0/pulse/last', kind: 'reference' },
  { id: 'ct-argon-sth', name: 'Certificate Transparency, Google Argon 2026h2, the signed tree head', contract: 'https://ct.googleapis.com/logs/us1/argon2026h2/ct/v1/get-sth', kind: 'reference' },
  { id: 'acme-directory', name: "Let's Encrypt ACME v2 directory", contract: 'https://acme-v02.api.letsencrypt.org/directory', kind: 'reference' },
  { id: 'cern-opendata', name: 'CERN Open Data Portal records API', contract: 'https://opendata.cern.ch/api/records/?q=higgs&size=1', kind: 'reference' },
  { id: 'payload-skills', name: 'payloadcms/skills, Payload\'s skills for AI agents (the repository tree)', contract: 'https://api.github.com/repos/payloadcms/skills/git/trees/main?recursive=1', kind: 'reference' },
  { id: 'schema-org', name: 'schema.org vocabulary (JSON-LD)', contract: 'https://schema.org/version/latest/schemaorg-current-https.jsonld', kind: 'vocabulary' },
  { id: 'cldr-languages', name: 'Unicode CLDR language names (ISO 639)', contract: 'https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-localenames-full/main/en/languages.json', kind: 'codes' },
  { id: 'cldr-currencies', name: 'Unicode CLDR currency names (ISO 4217)', contract: 'https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-numbers-full/main/en/currencies.json', kind: 'codes' },
  { id: 'cldr-territories', name: 'Unicode CLDR territory names (ISO 3166-1)', contract: 'https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-localenames-full/main/en/territories.json', kind: 'codes' },
]

export type JsonLd = Record<string, unknown> & { '@context': 'https://schema.org'; '@type': string }
const AUTHOR = { '@type': 'Person', name: LICENSE.author, '@id': LICENSE.orcid, identifier: LICENSE.orcid }
const APPLICATION = { '@type': 'SoftwareApplication', name: '@uuidna/qpu', applicationCategory: 'DeveloperApplication', license: LICENSE.url, author: AUTHOR }

/** The JSON-LD of a block: one tool's result as a CreativeWork of the application, identified by its content address. */
export const blockJsonLdOf = (p: { tool: string; id: string; description: string; url?: string; locale?: string; date?: string; toolbox?: string }): JsonLd => ({
  '@context': 'https://schema.org', '@type': 'CreativeWork', '@id': p.url ?? `urn:uuid:${p.id}`, identifier: p.id, name: `${p.tool} · @uuidna/qpu`, description: p.description, isPartOf: APPLICATION, author: AUTHOR, license: LICENSE.url, inLanguage: p.locale ?? 'en', dateModified: p.date ?? new Date().toISOString(), keywords: [p.tool, p.toolbox ?? 'qpu', 'MCP', 'quantum'].join(', '), isAccessibleForFree: true,
})
/** The JSON-LD of a page of the documentation: a WebPage of the application; a UUID page carries its identifier. */
export const pageJsonLdOf = (p: { url: string; title: string; description: string; uuid?: string; locale?: string; date?: string }): JsonLd => ({
  '@context': 'https://schema.org', '@type': 'WebPage', '@id': p.url, url: p.url, name: p.title, description: p.description, ...(p.uuid ? { identifier: p.uuid } : {}), isPartOf: { '@type': 'WebSite', name: '@uuidna/qpu', url: 'https://qpu.uuidna.com', license: LICENSE.url }, about: APPLICATION, author: AUTHOR, license: LICENSE.url, inLanguage: p.locale ?? 'en', dateModified: p.date ?? new Date().toISOString(),
})
/** The JSON-LD of a product variant of the catalogue: an Offer in an ISO 4217 currency. */
export const offerJsonLdOf = (v: { product: string; variant: string; unit: string; interval: string; currency: string; amount: number; description: string }): JsonLd => ({
  '@context': 'https://schema.org', '@type': 'Offer', name: `${v.product} ${v.variant}`, description: v.description, price: (v.amount / 100).toFixed(2), priceCurrency: v.currency.toUpperCase(), itemOffered: { ...APPLICATION, name: `QPU ${v.product.replace(/^qpu-/, '')}` }, seller: AUTHOR, availability: 'https://schema.org/InStock', ...(v.interval === 'month' || v.interval === 'year' ? { priceSpecification: { '@type': 'UnitPriceSpecification', price: (v.amount / 100).toFixed(2), priceCurrency: v.currency.toUpperCase(), unitText: v.unit, billingIncrement: 1, billingDuration: 1, unitCode: v.interval === 'month' ? 'MON' : 'ANN' } } : {}),
})

export type Codes = { languages: Set<string>; currencies: Set<string>; territories: Set<string> }
/** The CLDR lists read into code sets: ISO 639 languages, ISO 4217 currencies, ISO 3166-1 territories. */
export const codesOf = (cldr: { languages?: unknown; currencies?: unknown; territories?: unknown }): Codes => {
  const main = (doc: unknown) => { const m = (doc as { main?: Record<string, unknown> } | undefined)?.main; return m ? (Object.values(m)[0] as Record<string, unknown> | undefined) : undefined }
  const languages = new Set(Object.keys(((main(cldr.languages) as { localeDisplayNames?: { languages?: Record<string, string> } } | undefined)?.localeDisplayNames?.languages ?? {})))
  const currencies = new Set(Object.keys(((main(cldr.currencies) as { numbers?: { currencies?: Record<string, unknown> } } | undefined)?.numbers?.currencies ?? {})))
  const territories = new Set(Object.keys(((main(cldr.territories) as { localeDisplayNames?: { territories?: Record<string, string> } } | undefined)?.localeDisplayNames?.territories ?? {})))
  return { languages, currencies, territories }
}
/** The tree's codes against the standard: every locale an ISO 639 code, every currency an ISO 4217 code, every tenant country an ISO 3166-1 code. */
export const validateOf = (codes: Codes, mine: { locales: readonly string[]; currencies: readonly string[]; territories?: readonly string[] }): { languagesValid: string[]; languagesUnknown: string[]; currenciesValid: string[]; currenciesUnknown: string[]; territoriesValid: string[]; territoriesUnknown: string[]; measured: boolean } => {
  const measured = codes.languages.size > 0 && codes.currencies.size > 0
  const split = (list: readonly string[], set: Set<string>, norm: (s: string) => string) => ({ valid: list.filter((c) => set.has(norm(c))), unknown: set.size ? list.filter((c) => !set.has(norm(c))) : [] })
  const l = split(mine.locales, codes.languages, (s) => s.toLowerCase()); const c = split(mine.currencies, codes.currencies, (s) => s.toUpperCase()); const t = split(mine.territories ?? [], codes.territories, (s) => s.toUpperCase())
  return { languagesValid: l.valid, languagesUnknown: l.unknown, currenciesValid: c.valid, currenciesUnknown: c.unknown, territoriesValid: t.valid, territoriesUnknown: t.unknown, measured }
}
/** Which standard document a text is: the schema.org JSON-LD vocabulary, or a CLDR list. */
export const detectStandard = (text: string): { detected: string; note: string } | null => {
  try { const j = JSON.parse(text) as { sha?: string; tree?: { path: string; type: string; size?: number }[]; truncated?: boolean }; if (Array.isArray(j.tree) && typeof j.sha === 'string') { const skills = j.tree.filter((e) => /\/SKILL\.md$/.test(e.path)).map((e) => e.path.split('/').slice(-2, -1)[0]); const refs = j.tree.filter((e) => /\/reference\/[^/]+\.md$/.test(e.path)).length; return { detected: 'github tree', note: `${j.tree.length} entries${j.truncated ? ' (truncated)' : ''}; ${skills.length} skill(s): ${skills.join(', ')}; ${refs} reference(s)` } } } catch { /* not a tree */ }
  try { const j = JSON.parse(text) as { docs?: { layout?: { blockType: string }[]; meta?: object; breadcrumbs?: unknown[]; createdAt?: string }[]; totalDocs?: number }; if (Array.isArray(j.docs) && j.docs[0] && typeof j.docs[0].createdAt === 'string') { const d = j.docs[0]; return { detected: 'payload rest', note: `${j.totalDocs ?? j.docs.length} docs; blocks ${(d.layout ?? []).map((b) => b.blockType).join(', ') || 'none'}; ${d.meta ? 'seo meta' : 'no meta'}; ${Array.isArray(d.breadcrumbs) ? `${d.breadcrumbs.length} breadcrumb(s)` : 'no breadcrumbs'}: the site is the product's own output` } } } catch { /* not payload */ }
  try {
    const j = JSON.parse(text) as Record<string, unknown>
    if (Array.isArray(j['@graph']) && j['@context']) return { detected: 'json-ld vocabulary', note: `${(j['@graph'] as unknown[]).length} terms (${text.length.toLocaleString('en-US')} chars)` }
    const main = (j as { main?: Record<string, unknown> }).main
    if (main) { const first = Object.values(main)[0] as Record<string, unknown> | undefined; const kind = first?.localeDisplayNames ? 'locale display names' : first?.numbers ? 'numbers' : 'unknown'; return { detected: 'cldr json', note: `${kind} (${text.length.toLocaleString('en-US')} chars)` } }
  } catch { /* not json */ }
  return null
}

/** The endpoints of the Worker, as the API overview states them (the source of docs/api.md) and as the OpenAPI document derives its paths. */
export const API_ENDPOINTS: readonly { method: string; path: string; takes: string; answers: string; auth: string; errors?: string }[] = [
  { method: 'POST', path: '/mcp', takes: 'JSON-RPC 2.0: initialize, tools/list, tools/call { name, arguments }', answers: 'the result with structuredContent and _meta (widget, block, theme, jsonLd, payload, license); ETag the content hash, X-Qpu-Address the block address, X-Qpu-Version; streamed by default as the MCP streamable transport\'s event when the client accepts text/event-stream, JSON otherwise', auth: 'none for every pure tool; a tenant\'s tokens only for the docket', errors: 'JSON-RPC -32601 (no such tool or method), -32602 (invalid params, with the bound the schema names), -32700 (parse error)' },
  { method: 'GET', path: '/.well-known/qpu.json', takes: 'nothing', answers: 'the discovery document: mcp, docket, methods, tools, bounds, version, tenants, mcpHosts, roles, licence, the reverse (the unit), and the OpenAPI 3.1 contract (openapi, info, servers, paths, components)', auth: 'none' },
  { method: 'GET', path: '/.well-known/oauth-protected-resource', takes: 'nothing', answers: 'the protected-resource metadata of RFC 9728 for /mcp: the authorization servers the tenant names (QPU_OAUTH_ISSUER_<TENANT>; none named means the pure tools need no token and the docket takes the tenant\'s tokens by name), the docket roles as scopes, the bearer method', auth: 'none' },
  { method: 'GET', path: '/', takes: 'accept: application/json for the discovery document; otherwise the web OS', answers: 'the discovery document or the site', auth: 'none' },
  { method: 'GET', path: '/<uuid>', takes: 'a content-addressed v8 UUID: one address for the block and for the entry; accept: application/json for the entry', answers: 'the block\'s page (the widget, prev and next, the theme from the UUID), or the entry as JSON; immutable, ETag the address, 304 to If-None-Match; no prefix: the catch-all routes all', auth: 'none' },
  { method: 'GET', path: '/docket', takes: '?kind=&since=', answers: 'the tenant\'s entries (one docket per tenant host)', auth: 'none to read' },
  { method: 'GET', path: '/docket/<id>', takes: 'an entry id; ?cheap, ?heal', answers: 'the entry, healed from a mirror by address when missing', auth: 'none to read' },
  { method: 'POST', path: '/docket', takes: '{ kind, from, body, links? } or a commitment { kind, from, address, sha256 }', answers: '201 with the entry id (content address); 400 on shape, 413 above the entry bound', auth: 'Bearer: the tenant\'s writer token (QPU_WRITE_TOKEN_<TENANT>) or the RBAC MCP host\'s role' },
  { method: 'DELETE', path: '/docket/<id>', takes: 'an entry id', answers: 'the entry gone', auth: 'Bearer: the tenant\'s admin token' },
  { method: 'POST', path: '/docket/stripe', takes: 'a Stripe webhook, signed', answers: 'the event as an entry, idempotent', auth: 'STRIPE_WEBHOOK_SECRET_<TENANT>' },
  { method: 'GET', path: '/health', takes: 'nothing', answers: 'status, tenant, licence and the metrics computed now', auth: 'none' },
]
export type ApiTool = { name: string; description: string; inputSchema: object }
export const OPENAPI_RESOURCE = 'openapi://qpu'
/** The QPU's own contract in the standard the discover step asks every host for: an OpenAPI 3.1 document derived from tools/list and the
 *  endpoint table, never written by hand — every tool a component schema (its JSON Schema as tools/list serves it), every endpoint a path,
 *  the one MCP operation a JSON-RPC envelope whose params name a tool and its arguments; the envelopes are the two schemas beyond the tools
 *  (textbook_openapi_contract). The same document stands in the discovery document at /.well-known/qpu.json and as the resource
 *  openapi://qpu, so the tree detects its own hosts as `openapi 3.1.0` the way it detects any other's. What an AI API and a quantum API
 *  share — a named tool, its schema, a structured result at a content address — is this contract. Pure. */
export const openapiOf = (origin: string, tools: readonly ApiTool[], hosts: readonly string[] = [origin]) => {
  const paths: Record<string, Record<string, unknown>> = {}
  for (const e of API_ENDPOINTS) {
    const path = e.path.replace(/<([a-z]+)>/g, '{$1}'); const method = e.method.toLowerCase()
    const parameters = [...path.matchAll(/\{([a-z]+)\}/g)].map((m) => ({ name: m[1], in: 'path', required: true, schema: { type: 'string' } }))
    const op: Record<string, unknown> = { operationId: `${method}${path.replace(/[^a-z0-9]+/gi, '_').replace(/_+$/, '')}`, summary: e.takes, description: e.answers, ...(parameters.length ? { parameters } : {}), responses: { '200': { description: e.answers } }, 'x-qpu-auth': e.auth, ...(e.errors ? { 'x-qpu-errors': e.errors } : {}) }
    if (e.path === '/mcp') {
      op.operationId = 'mcp'
      op.requestBody = { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/JsonRpcRequest' } } } }
      op.responses = { '200': { description: 'the JSON-RPC result: content, structuredContent and _meta (widget, block, theme, jsonLd, license); ETag the content hash, X-Qpu-Address the block address', content: { 'application/json': { schema: { $ref: '#/components/schemas/JsonRpcResponse' } }, 'text/event-stream': { schema: { type: 'string', description: 'the MCP streamable transport: the same result as one event' } } } }, '304': { description: 'the block held is the block asked (If-None-Match named its content hash): nothing computed, nothing sent — the involution' } }
    }
    paths[path] = { ...(paths[path] ?? {}), [method]: op }
  }
  const schemas: Record<string, unknown> = {}
  for (const t of tools) schemas[t.name] = { description: t.description, ...(t.inputSchema as object) }
  schemas.JsonRpcRequest = { type: 'object', required: ['jsonrpc', 'id', 'method'], properties: { jsonrpc: { const: '2.0' }, id: { type: ['integer', 'string'] }, method: { enum: ['initialize', 'tools/list', 'tools/call', 'resources/list', 'resources/templates/list', 'resources/read'] }, params: { type: 'object', properties: { name: { enum: tools.map((t) => t.name) }, arguments: { oneOf: tools.map((t) => ({ $ref: `#/components/schemas/${t.name}` })) }, uri: { type: 'string' } } } } }
  schemas.JsonRpcResponse = { type: 'object', required: ['jsonrpc', 'id'], properties: { jsonrpc: { const: '2.0' }, id: { type: ['integer', 'string', 'null'] }, result: { type: 'object', properties: { content: { type: 'array' }, structuredContent: { type: 'object' }, _meta: { type: 'object' } } }, error: { type: 'object', required: ['code', 'message'], properties: { code: { enum: [-32601, -32602, -32700] }, message: { type: 'string' } } } } }
  return {
    openapi: '3.1.0',
    info: { title: '@uuidna/qpu', version: VERSION, summary: 'An exact, formally verified quantum processing unit served over MCP: one endpoint, every tool a schema, every result a content-addressed block', license: { name: LICENSE.spdx, url: LICENSE.url }, contact: { name: LICENSE.author, url: origin } },
    servers: hosts.map((url) => ({ url })),
    paths, components: { schemas },
    'x-mcp': { endpoint: `${origin}/mcp`, protocol: '2025-06-18', methods: ['initialize', 'tools/list', 'tools/call', 'resources/list', 'resources/templates/list', 'resources/read'], tools: tools.map((t) => t.name), resource: OPENAPI_RESOURCE, says: 'the tools are the component schemas; a tools/call is the mcp operation with params.name one of them and params.arguments its schema; the two envelopes beyond the tools are JsonRpcRequest and JsonRpcResponse' },
  }
}
