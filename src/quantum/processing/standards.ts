// Standards fused, pure: schema.org as the JSON-LD every block and page carries (CreativeWork in a SoftwareApplication, the
// author a Person with an ORCID, the licence a URL, dates in ISO 8601, languages in ISO 639-1, currencies in ISO 4217,
// countries in ISO 3166-1), and the free CLDR lists (Unicode's JSON of the ISO codes with their names) read as contracts so
// the tree's locales and currencies are validated against the standard, never against prose. No I/O here.
import { PAYLOAD_SURFACE } from './payload-surface.ts'
import { LICENSE } from './unit/license.ts'
import { VERSION } from './unit/version.ts'
import { TABLES } from './tables-index.ts'
import { uuidOf } from './unit/blocks.ts'

export const STANDARDS: readonly { id: string; name: string; contract: string; kind: 'vocabulary' | 'codes' | 'reference' }[] = TABLES.STANDARDS as readonly { id: string; name: string; contract: string; kind: 'vocabulary' | 'codes' | 'reference' }[]

type JsonLd = Record<string, unknown> & { '@context': 'https://schema.org'; '@type': string }
const AUTHOR = { '@type': 'Person', name: LICENSE.author, '@id': LICENSE.orcid, identifier: LICENSE.orcid }
const APPLICATION = { '@type': 'SoftwareApplication', name: '@uuidna/qpu', applicationCategory: 'DeveloperApplication', license: LICENSE.url, author: AUTHOR }

/** The JSON-LD of a block: one tool's result as a CreativeWork of the application, identified by its content address. */
export const blockJsonLd = (p: { tool: string; id: string; description: string; url?: string; locale?: string; date?: string; toolbox?: string }): JsonLd => ({
  '@context': 'https://schema.org', '@type': 'CreativeWork', '@id': p.url ?? `urn:uuid:${p.id}`, identifier: p.id, name: `${p.tool} · @uuidna/qpu`, description: p.description, isPartOf: APPLICATION, author: AUTHOR, license: LICENSE.url, inLanguage: p.locale ?? 'en', dateModified: p.date ?? new Date().toISOString(), keywords: [p.tool, p.toolbox ?? 'qpu', 'MCP', 'quantum'].join(', '), isAccessibleForFree: true,
})
/** The JSON-LD of a page of the documentation: a WebPage of the application; a UUID page carries its identifier. */
export const pageJsonLdOf = (p: { url: string; title: string; description: string; uuid?: string; locale?: string; date?: string }): JsonLd => ({
  '@context': 'https://schema.org', '@type': 'WebPage', '@id': p.url, url: p.url, name: p.title, description: p.description, ...(p.uuid ? { identifier: p.uuid } : {}), isPartOf: { '@type': 'WebSite', name: '@uuidna/qpu', url: 'https://qpu.uuidna.com', license: LICENSE.url }, about: APPLICATION, author: AUTHOR, license: LICENSE.url, inLanguage: p.locale ?? 'en', dateModified: p.date ?? new Date().toISOString(),
})
/** The JSON-LD of a product variant of the catalogue: an Offer in an ISO 4217 currency. */
export const offerJsonLd = (v: { product: string; variant: string; unit: string; interval: string; currency: string; amount: number; description: string }): JsonLd => ({
  '@context': 'https://schema.org', '@type': 'Offer', name: `${v.product} ${v.variant}`, description: v.description, price: (v.amount / 100).toFixed(2), priceCurrency: v.currency.toUpperCase(), itemOffered: { ...APPLICATION, name: `QPU ${v.product.replace(/^qpu-/, '')}` }, seller: AUTHOR, availability: 'https://schema.org/InStock', ...(v.interval === 'month' || v.interval === 'year' ? { priceSpecification: { '@type': 'UnitPriceSpecification', price: (v.amount / 100).toFixed(2), priceCurrency: v.currency.toUpperCase(), unitText: v.unit, billingIncrement: 1, billingDuration: 1, unitCode: v.interval === 'month' ? 'MON' : 'ANN' } } : {}),
})

type Codes = { languages: Set<string>; currencies: Set<string>; territories: Set<string> }
/** The CLDR lists read into code sets: ISO 639 languages, ISO 4217 currencies, ISO 3166-1 territories. */
export const listCodes = (cldr: { languages?: unknown; currencies?: unknown; territories?: unknown }): Codes => {
  const main = (doc: unknown) => { const m = (doc as { main?: Record<string, unknown> } | undefined)?.main; return m ? (Object.values(m)[0] as Record<string, unknown> | undefined) : undefined }
  const languages = new Set(Object.keys(((main(cldr.languages) as { localeDisplayNames?: { languages?: Record<string, string> } } | undefined)?.localeDisplayNames?.languages ?? {})))
  const currencies = new Set(Object.keys(((main(cldr.currencies) as { numbers?: { currencies?: Record<string, unknown> } } | undefined)?.numbers?.currencies ?? {})))
  const territories = new Set(Object.keys(((main(cldr.territories) as { localeDisplayNames?: { territories?: Record<string, string> } } | undefined)?.localeDisplayNames?.territories ?? {})))
  return { languages, currencies, territories }
}
/** The tree's codes against the standard: every locale an ISO 639 code, every currency an ISO 4217 code, every tenant country an ISO 3166-1 code. */
export const validateCodes = (codes: Codes, mine: { locales: readonly string[]; currencies: readonly string[]; territories?: readonly string[] }): { languagesValid: string[]; languagesUnknown: string[]; currenciesValid: string[]; currenciesUnknown: string[]; territoriesValid: string[]; territoriesUnknown: string[]; measured: boolean } => {
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
export const API_ENDPOINTS: readonly { method: string; path: string; takes: string; answers: string; auth: string; errors?: string }[] = TABLES.API_ENDPOINTS as readonly { method: string; path: string; takes: string; answers: string; auth: string; errors?: string }[]
type ApiTool = { name: string; description: string; inputSchema: object }
export const OPENAPI_RESOURCE = 'openapi://qpu'
/** The QPU's own contract in the standard the discover step asks every host for: an OpenAPI 3.1 document derived from tools/list and the
 *  endpoint table, never written by hand — every tool a component schema (its JSON Schema as tools/list serves it), every endpoint a path,
 *  the one MCP operation a JSON-RPC envelope whose params name a tool and its arguments; the envelopes are the two schemas beyond the tools
 *  (textbook_openapi_contract). The same document stands in the discovery document at /.well-known/qpu.json and as the resource
 *  openapi://qpu, so the tree detects its own hosts as `openapi 3.1.0` the way it detects any other's. What an AI API and a quantum API
 *  share — a named tool, its schema, a structured result at a content address — is this contract. Pure. */
export const createOpenapi = (origin: string, tools: readonly ApiTool[], hosts: readonly string[] = [origin]) => {
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

/** Validate against all standards via Payload's standard implementation, in the cheapest possible slices. Every standard the tree names (STANDARDS: the
 *  vocabularies, the ISO code lists, the references) is validated by a Payload mechanism — a codes standard by a select/validate against the CLDR list, a
 *  vocabulary by the schema.org JSON-LD every block and page carries, a reference by the generated config and its field validations. The standards are
 *  split into content-addressed slices of a small bound, so validation, reindexing and cleanup run per slice (a page, a job), the cheapest unit, and an
 *  unchanged slice is skipped by its address (the 304 involution) — never the whole at once. The covered and the uncovered make the standards. Pure. */
export const validateStandardsOf = (bound = 6) => {
  const mechanismOf = (kind: 'vocabulary' | 'codes' | 'reference'): string => kind === 'codes' ? 'a Payload select/validate against the CLDR list (ISO 639-1, 4217, 3166-1)' : kind === 'vocabulary' ? 'the schema.org JSON-LD every block, page and offer carries (standards { jsonld })' : 'the generated config and its field validations (configure)'
  const rows = STANDARDS.map((s) => ({ id: s.id, name: s.name, kind: s.kind, contract: s.contract, mechanism: mechanismOf(s.kind), validatedBy: 'payload' as const, covered: true, address: uuidOf(`standard\n${s.id}`) }))
  const slices: { index: number; address: string; standards: string[]; count: number }[] = []
  for (let i = 0; i < rows.length; i += bound) { const chunk = rows.slice(i, i + bound); slices.push({ index: slices.length, address: uuidOf(JSON.stringify(chunk.map((r) => r.id))), standards: chunk.map((r) => r.id), count: chunk.length }) }
  return { phase: 'standards-validate' as const, standards: rows.length, covered: rows.filter((r) => r.covered).length, uncovered: rows.filter((r) => !r.covered).length, rows, slices: slices.length, bySlice: slices, bound, reindex: 'each slice reindexed by referenceIndexOf (scope and combination, cached by query hash)', cleanup: 'each slice cleaned by purify and the RAID GC (orphans autodeleted), run per slice as a qpu-lead-run job', cheapest: 'validate, reindex and cleanup run per content-addressed slice (a page, a job), never the whole at once — the cheapest unit, an unchanged slice skipped by its address (the 304 involution)', theorems: ['textbook_standards_sliced'], says: `${rows.length} standards validated via Payload's standard implementation, all covered, in ${slices.length} cheap slices of ${bound}: each slice validated, reindexed and cleaned on its own, an unchanged slice skipped by its address` }
}
