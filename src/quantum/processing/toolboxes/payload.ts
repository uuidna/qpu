// The payload toolbox: every result in Payload's own plugin schema and nothing custom — a lexical document whose one block is
// the programmable UUID logic (the block's uuid, its handle, program and tail, the tool and its arguments, the next step the
// program rotated to), nested by the referer chain as the nested-docs plugin nests (parent, breadcrumbs), described by the
// SEO plugin's fields from the block's Open Graph, carrying its JSON-LD and its licence. Pure and small: computed once per
// block by the balancer, so the cost is a few kilobytes and no computation on the device — the battery is the result.
import { narrowScope, createSandbox, type NarrowRequest } from '../unit/namespaces.ts'
import { defineTool, createChecks, listTools, isObj, type Toolbox, type Context } from '../toolbox.ts'
import { compositionIndexOf, channelOf, uuidFromParts, uuidOf, canonicalTextOf, styleOf, presentationOf, streamOf, qpuHooksOf, PRESENTABLE_ITEMS, type StreamQuery } from '../unit/blocks.ts'
import { digitalRoot, trinityFor } from '../clay-register.ts'
import { TENANTS, tenantOf } from '../unit/tenants.ts'
import { LOCALES } from '../i18n.ts'
import { CLOUDFLARE_MCP, DEFAULT_MCP_HOSTS, CLAUDE_API, KNOWN_MCP, MCP_REGISTRY, GOOGLE_MCPS, GOOGLE_HOST, GOOGLE_DISCOVERY, GOOGLE_ENDPOINTS, detect } from '../discovery.ts'
import { KEY, hueOf, ANGLES, createTheme, coilColour } from '../unit/theme.ts'
import { VERSION } from '../unit/version.ts'
import { TEXTBOOK_THEOREMS } from '../textbook-theorems.ts'
import { getAnswer } from './extension.ts'
import { blockJsonLd, STANDARDS, API_ENDPOINTS, createOpenapi } from '../standards.ts'
import { LICENSE, INSTRUCTIONS } from '../unit/license.ts'
import { flowWidget } from '../widgets.ts'
import { WEBCRYPTO_FLAG, ATTEST_APIS } from './crypto.ts'
import { ROLES } from '../unit/roles.ts'
import { CATALOGUE, convertAmounts, RATE_SOURCES, CURRENCY_MCPS, TENANT_CURRENCY, DOMAIN_CURRENCY } from './billing.ts'
import { PATENT_APIS, PATENT_MCPS, COMPETITIONS, FUNDING_MCPS, NEWS_APIS, knowCompetition } from './legal.ts'
import type { Lead } from '../leads.ts'
import { diffMembers, getAdvantage, scanLexical } from '../audit.ts'
import { createReferenceGraph, referenceIndexOf, listReferences, type RefDoc, type ScopedRefDoc } from '../references.ts'
import { MACHINE_ACTIONS } from '../machine.ts'
import { createSchemas, type PayloadCollectionInput } from './payload-schemas.ts'
import { portAt, listPorts, PORT_RADICES } from '../port.ts'
import { getWorkspace } from '../workspace.ts'
import { TABLES } from '../tables-index.ts'
import { configKinds, TENANT_ROLES, OPERATIONS } from '../payload-vocabulary.ts'

type LexicalDoc = { root: { type: 'root'; version: 1; direction: 'ltr'; format: ''; indent: 0; children: unknown[] } }
type PayloadDoc = { id: string; lexical: LexicalDoc; nestedDocs: { parent: string | null; breadcrumbs: { doc: string; url: string; label: string }[] }; seo: { title: string; description: string; image: string | null }; jsonLd: unknown; license: string }

/** A result as the document Payload's plugins would hold: one lexical block of UUID logic, nested by prev, described for SEO. */
export const payloadDocOf = (p: { uuid: string; tool: string; arguments: Record<string, unknown>; description: string; openGraph?: Record<string, string>; html?: string; prev?: string | null; chain?: string[]; origin?: string }): PayloadDoc => {
  const ch = channelOf(p.uuid)
  const next = uuidFromParts(ch.handle, [...ch.program.slice(1), ch.program[0]!], ch.tail)
  const origin = p.origin ?? 'https://qpu.uuidna.com'
  const url = (id: string) => `${origin}/${id}`
  const chain = [...(p.chain ?? []), ...(p.prev ? [p.prev] : [])]
  const block = qpuNodeOf(p.uuid, p.tool, p.arguments, null, { prev: p.prev ?? null, next, html: p.html ?? null })
  const title = p.openGraph?.['og:title'] ?? `${p.tool} · @uuidna/qpu`
  return {
    id: p.uuid,
    lexical: { root: { type: 'root', version: 1, direction: 'ltr', format: '', indent: 0, children: [{ type: 'heading', tag: 'h2', version: 1, format: '', indent: 0, direction: 'ltr', children: [{ type: 'text', version: 1, text: title, format: 0, mode: 'normal', style: '', detail: 0 }] }, block, { type: 'paragraph', version: 1, format: '', indent: 0, direction: 'ltr', textFormat: 0, children: [{ type: 'text', version: 1, text: `${LICENSE.attribution}. ${LICENSE.terms}`, format: 0, mode: 'normal', style: '', detail: 0 }] }] } },
    nestedDocs: { parent: p.prev ?? null, breadcrumbs: [...chain.map((id) => ({ doc: id, url: url(id), label: id.slice(0, 8) })), { doc: p.uuid, url: url(p.uuid), label: p.uuid.slice(0, 8) }] },
    seo: { title, description: p.openGraph?.['og:description'] ?? p.description, image: p.openGraph?.['og:image'] ?? null },
    jsonLd: blockJsonLd({ tool: p.tool, id: p.uuid, description: p.description, url: url(p.uuid) }),
    license: LICENSE.spdx,
  }
}

/** The QPU monetises by generating enterprise-grade production apps on request from the Payload UI: a request (a name, a host that becomes the
 *  first tenant at deploy, the plugins, the environment names, the licence variant) answered as the app — every generated file with its content
 *  address and the address of the bundle (textbook_app_bundle: the full stack's files plus the Worker configuration and the environment example),
 *  the adapters the environment chooses, the enterprise capabilities it carries, the licence variant priced by the catalogue in the host's
 *  currency, and the order the ecommerce plugin sells at its own checkout. The Apps collection takes the request; this answer is what it stores. */
/** The streamed form validated as it is typed and verified online, token free: every field judged by the patterns the full stack enforces,
 *  the environment names by the bindings and adapters the stack knows, the variant by the catalogue; the host verified by a request the client
 *  sends itself (the host answers or not) and this answer from the Worker's /mcp, which needs no key. The Form block streams the values on
 *  every change and renders each verdict before the submit; the submission hook validates once more and refuses what the stream refused. */
const appValidationOf = (v: Record<string, unknown>) => {
  const name = String(v.name ?? '').trim(); const host = String(v.host ?? '').trim().toLowerCase(); const env = String(Array.isArray(v.env) ? v.env.join(',') : v.env ?? '').split(/[,\s]+/).filter(Boolean); const variant = String(v.variant ?? 'yearly')
  const known = new Set([...BINDINGS.flatMap((b) => b.names.map((n) => n.replace(/_<TENANT>$/, ''))), ...(Object.values(ADAPTERS).flat() as unknown[]).filter((a): a is { needs: string[] } => typeof a === 'object' && a !== null && 'needs' in a).flatMap((a) => a.needs.map((n) => n.split(' ')[0]!))])
  const tld = host.split('.').pop() ?? ''
  const fields = {
    name: { ok: name.length > 0, says: name ? 'named' : 'an app has a name' },
    host: { ok: /^[a-z0-9.-]+\.[a-z]{2,}$/.test(host), says: /^[a-z0-9.-]+\.[a-z]{2,}$/.test(host) ? `the first tenant at deploy; prices in ${DOMAIN_CURRENCY[tld] ?? 'EUR'}` : 'a host name (letters, digits, dots, dashes, a top-level domain of letters)', currency: DOMAIN_CURRENCY[tld] ?? 'EUR' },
    env: { ok: env.every((n) => known.has(n)), unknown: env.filter((n) => !known.has(n)), says: env.every((n) => known.has(n)) ? `${env.length} name(s) the stack binds to` : `unknown: ${env.filter((n) => !known.has(n)).join(', ')} (the names the stack knows: ${[...known].join(', ')})` },
    variant: { ok: CATALOGUE.some((c) => c.product === 'qpu-domain' && c.variant === variant), says: CATALOGUE.some((c) => c.product === 'qpu-domain' && c.variant === variant) ? 'in the catalogue' : `one of ${CATALOGUE.filter((c) => c.product === 'qpu-domain').map((c) => c.variant).join(', ')}` },
  }
  const ok = Object.values(fields).every((f) => f.ok)
  return { fields, ok, online: { tokenFree: true, requests: fields.host.ok ? [{ id: `host:${host}`, method: 'HEAD', url: `https://${host}/`, verifier: 'the host answers (any status, even opaque): it exists to become the first tenant at deploy; sent by the client, no token' }] : [], mcp: 'POST /mcp tools/call payload { app: { validate } }: this answer, from the Worker, free of any key' }, streamed: 'the Form block sends the values on every change (validate.ts, debounced) and renders each field\'s verdict before the submit; the submission hook validates once more and refuses what the stream refused' }
}
/** The form a user submits to request an app: the form-builder plugin's own document, nothing added to the schema. */
const appRequestFormOf = () => ({ title: 'Request an app', submitButtonLabel: 'Request the app', confirmationType: 'message', confirmationMessage: lx.doc([lx.paragraph([lx.text('Your app is being generated: its bundle appears in Media (every file with its address), the licence is a product at the checkout.')])]), fields: [{ blockType: 'text', name: 'name', label: 'App name', required: true, width: 100 }, { blockType: 'text', name: 'host', label: 'Host (the first tenant at deploy)', required: true, width: 100 }, { blockType: 'text', name: 'env', label: 'Environment variable names (D1, R2, RESEND_API_KEY, DATABASE_URI, ...; values never travel)', required: false, width: 100 }, { blockType: 'select', name: 'variant', label: 'Licence', required: true, defaultValue: 'yearly', options: CATALOGUE.filter((v) => v.product === 'qpu-domain').map((v) => ({ label: `${v.variant}: ${v.description}`, value: v.variant })) }] })
const appOf = (ctx: Context, r: { name: string; host: string; plugins?: readonly string[]; env?: readonly string[]; variant?: string }) => {
  if ((r as { form?: boolean }).form) return { form: appRequestFormOf(), says: 'the form-builder plugin\'s form a user submits to request an app; the seed creates it, the submission\'s afterChange hook (appRequest) generates the app' }
  if (typeof r.name !== 'string' || !r.name || typeof r.host !== 'string' || !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(r.host)) throw new Error('an app request names the app and its host (the first tenant at deploy)')
  const tenant = r.host.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const fs = configOf('fullstack', ctx) as { files: Record<string, string>; partition: string }
  const chosen = (r.plugins ?? PAYLOAD_PLUGINS.map((p) => p.name)).filter((p) => PAYLOAD_PLUGINS.some((q) => q.name === p))
  const ad = adaptersOf(r.env ?? [])
  const files: Record<string, string> = { ...fs.files, '.qpu-app/wrangler.jsonc': JSON.stringify(siteWranglerOf(), null, 2) + '\n', '.qpu-app/.env.qpu.example': envExampleOf() + '\n' }
  const addresses = Object.fromEntries(Object.entries(files).map(([p, t]) => [p, uuidOf(t)]))
  const bundle = uuidOf(Object.keys(addresses).sort().map((p) => `${p} ${addresses[p]}`).join('\n'))
  const variant = CATALOGUE.find((v) => v.product === 'qpu-domain' && v.variant === (r.variant ?? 'yearly')) ?? CATALOGUE.find((v) => v.product === 'qpu-domain')!
  const currency = DOMAIN_CURRENCY[r.host.toLowerCase().split('.').pop() ?? ''] ?? 'EUR'
  const amount = variant.amounts[currency.toLowerCase()] ?? variant.amounts.eur ?? 0
  const title = `QPU ${variant.product.replace(/^qpu-/, '')} · ${variant.variant}`
  return {
    request: { name: r.name, host: r.host, plugins: chosen, env: r.env ?? [], variant: variant.variant }, tenant,
    files: Object.keys(files).length, partition: `${fs.partition.split(' = ')[0]} + 2 = ${Object.keys(files).length}`, addresses, bundle,
    adapters: ad.chosen, plugins: chosen.length, combinations: 2 ** chosen.length,
    enterprise: { tenants: 'multi-tenant with tenant roles (tenant-admin, editor, viewer); the host is the first tenant at deploy', users: 'the first user is the deployer\'s account, a super admin; API keys per user for MCP clients', access: ACCESS.entries, adapters: `${ad.chosen.database}, ${ad.chosen.storage}, ${ad.chosen.email}`, signing: 'ML-DSA at the edge (seal), the gate verifying', realtime: `${REALTIME.streams.length} streams and the collision precondition by address`, ui: 'MCP Apps views and the shadcn registry', gate: 'the e2e repetition code over every host' },
    licence: { product: variant.product, variant: variant.variant, unit: variant.unit, interval: variant.interval, description: variant.description, terms: LICENSE.spdx },
    price: { currency, amount, minorUnits: true, says: `${(amount / 100).toFixed(2)} ${currency} per ${variant.unit} per ${variant.interval}, the catalogue's amount in the host's currency` },
    order: { product: title, checkout: '/checkout: the ecommerce plugin\'s own, the Stripe adapter the payment', then: 'the licence is the completed order itself (orders.status completed, read through the Payload MCP plugin; the transactions are the ledger) and the bundle is the tenant\'s to deploy from .qpu-app/ (npx wrangler deploy, OpenNext); deployed is what the gate measures when it decodes the tenant\'s host: no hook, nothing added' },
    usable: { inUi: 'the request is a submission of the form-builder\'s form "Request an app" (seeded); its afterChange hook generates this answer into the media collection as a JSON file; the tenant\'s settings (its tenants document) are the plugin options merged into every qpu block call under its hosts; nothing added to the schema', viaMcp: 'the Payload MCP plugin serves the installed plugins\' default collections: a client requests (a form submission), reads the bundle (media), buys the licence (a product in a cart at the checkout) and configures (tenants.settings) with its API key', asPlugin: 'a tenant-configurable plugin: the same generated app, configured per tenant as data in the plugins\' own collections, never a second Payload config and never a collection added' },
    monetises: 'the QPU is paid for the apps it generates on request: the Apps collection in the Payload UI takes the request, this answer is the app, the catalogue prices it, the ecommerce plugin sells it, and the tenant uses it in the same UI or through the Payload MCP plugin',
    // the app as a lexical document: one qpu block per generated file at its content address, one for the bundle (textbook_app_doc_blocks): what the Apps UI shows and the admin edits
    doc: docOf(`${r.name} · ${title}`, [...Object.entries(addresses).map(([path, address]) => ({ uuid: address, tool: 'configure', arguments: { kind: 'fullstack', file: path } })), { uuid: bundle, tool: 'payload', arguments: { app: { name: r.name, host: r.host, variant: variant.variant } } }], [`${(amount / 100).toFixed(2)} ${currency} per ${variant.unit} per ${variant.interval}; ${LICENSE.spdx}: ${LICENSE.terms}`]),
    docBlocks: Object.keys(addresses).length + 1,
    bundleFiles: files,
  }
}
// Google integration as exact pairs: pages naming Google or holding a google-toolbox block, calls of google-toolbox tools, tenants and keys naming either
const googleOf = (g: { pages?: any[]; tenants?: object[]; entries?: any[]; keys?: object[] }, tools: string[]) => {
  const names = (x: unknown) => { const t = JSON.stringify(x); return /google/i.test(t) || tools.some((n) => t.includes(`"${n}":true`)) }, pair = (xs: unknown[] = [], p: (x: any) => unknown) => ({ live: xs.filter(p).length, of: xs.length })
  const jobs = (g.entries ?? []).filter((e) => e.from === 'qpu-google-call' && e.body), pages = (g.pages ?? []).filter((p) => /google/i.test(p.fullTitle ?? p.title) || p.layout?.some((b: { tool: string }) => tools.includes(b.tool))), answered = pair((g.entries ?? []).filter((e) => e.kind === 'call' && tools.includes(e.body?.tool)), (e) => e.result?.error === undefined)
  return { pages: { published: pair(pages, (p) => p._status === 'published'), parented: pair(pages, (p) => p.parent), blocks: pages.flatMap((p) => p.layout ?? []).reduce((a: Record<string, number>, b: { tool: string }) => ({ ...a, [b.tool]: (a[b.tool] ?? 0) + 1 }), {}) }, tenants: pair(g.tenants, names), calls: { answered, refused: answered.of - answered.live, job: pair(jobs.filter((e) => 'allowed' in e.body), (e) => e.body.allowed && e.body.status < 400), queued: jobs.filter((e) => !('allowed' in e.body)).length, elsewhere: (g.entries ?? []).filter((e) => e.from !== 'qpu-google-call' && URL.canParse(e.body?.url) && GOOGLE_HOST.test(new URL(e.body.url).hostname)).length }, keys: pair(g.keys, names), theorem: 'textbook_google_measured' }
}
/** Every method of a Discovery document, its resources walked level by level. */
const discoveryMethods = (d: any): any[] => { const out: any[] = [], level = [d]; while (level.length) { const r = level.pop(); out.push(...Object.values(r?.methods ?? {})); level.push(...Object.values(r?.resources ?? {})) } return out }
/** Google's APIs as gates: every API the directory lists, placed by its own Discovery document. Reads (GET) are the frontend's candidates under
 *  the tenant's API key, the first keyed call deciding which are public; every method runs in the admin under the tenant's OAuth; an admin.*
 *  scope only under a Workspace admin's domain-wide delegation (the Admin SDK). Every call goes through the one door, payload { googleCall }. */
type GoogleApis = { list?: { items?: { name?: string; version?: string; title?: string; documentationLink?: string; discoveryRestUrl?: string }[] }; documents?: Record<string, unknown> }
const placeGoogleApis = (google: GoogleApis = {}): RawGate[] => (google.list?.items ?? []).filter((it) => it.name && it.version).map((it) => {
  const key = `${it.name}-${it.version}`, doc = google.documents?.[key], all = doc ? discoveryMethods(doc) : [], reads = all.filter((m) => m.httpMethod === 'GET').length
  const delegation = all.some((m) => (m.scopes ?? []).some((s: string) => /\/auth\/admin\./.test(s))), url = it.documentationLink ?? it.discoveryRestUrl ?? ''
  return { id: `google-${key}`, category: 'google-apis', name: `${it.title ?? it.name} ${it.version}`, url, host: gateHostOf(url), kind: 'keyed' as GateKind, by: 'payload', measured: doc ? `${all.length} methods: ${reads} reads the frontend may call under the tenant's API key (the first keyed call decides which are public), all ${all.length} in the admin under the tenant's OAuth${delegation ? ", admin scopes only under a Workspace admin's domain-wide delegation" : ''}; through payload { googleCall }` : 'its Discovery document not read yet: discover asks it next run, through the one Google door', match: `${it.name}.googleapis.com` }
})
// One Google call as the qpu-google-call job runs it: a Google page or MCP endpoint by its host, or an API method validated against its Discovery
// document (the method by id, every parameter known, the required present, enums and patterns held, no credential from the caller); without the
// document the plan names where the job reads it, keyless
const googleCallOf = (c: { api?: string; version?: string; method?: string; params?: Record<string, unknown>; body?: unknown; url?: string; httpMethod?: string; endpoint?: string; discovery?: any }) => {
  const no = (why: string) => ({ phase: 'google-call' as const, allowed: false, why }), ok = (method: string, url: string, httpMethod: string, scopes: string[]) => ({ phase: 'google-call' as const, allowed: true, method, request: { url, httpMethod, body: c.body ?? null, scopes }, ...(scopes.length ? { token: GOOGLE_DISCOVERY.token } : {}) })
  if (c.url) { const u = URL.canParse(c.url) ? new URL(c.url) : null; return u?.protocol === 'https:' && GOOGLE_HOST.test(u.hostname) ? (/[?&](key|access_token|secret|api_secret)=/.test(u.search) ? no(`${u.hostname}: a credential is the server's to add`) : ok(u.hostname, u.href, c.httpMethod ?? 'GET', [])) : no(`${c.url} is not a Google host over https`) }
  // a named endpoint outside Discovery: its URL and method from the registry, its secret the server's
  if (c.endpoint) { const e = Object.hasOwn(GOOGLE_ENDPOINTS, c.endpoint) ? GOOGLE_ENDPOINTS[c.endpoint] : null; if (!e) return no(`${c.endpoint} is not a named Google endpoint`); const p = c.params ?? {}; return e.secret.param in p ? no(`${c.endpoint}: ${e.secret.param} is the server's credential`) : { ...ok(c.endpoint, `${e.url}?${new URLSearchParams(Object.entries(p).map(([k, v]) => [k, String(v)]))}`, e.httpMethod, []), secret: e.secret } }
  const d = c.discovery
  if (!d) return { phase: 'google-call' as const, allowed: null, discovery: GOOGLE_DISCOVERY.rest.replace('{api}', () => encodeURIComponent(c.api ?? '')).replace('{version}', () => encodeURIComponent(c.version ?? '')) }
  const m = discoveryMethods(d).find((x) => x.id === c.method || x.id === `${d.name}.${c.method}`)
  if (!m) return no(`${c.method} is not a method of ${d.name} ${d.version}`)
  const known: Record<string, { required?: boolean; enum?: string[]; pattern?: string; location?: string }> = { ...d.parameters, ...m.parameters }, p = c.params ?? {}, list = (v: unknown) => [v].flat().map(String)
  const bad = [...Object.keys(p).filter((k) => !known[k] || /^(key|access_token|oauth_token)$/.test(k)).map((k) => (known[k] ? `${k} is the server's credential` : `${k} unknown`)), ...Object.entries(known).filter(([k, s]) => s.required && p[k] == null).map(([k]) => `${k} required`), ...Object.entries(p).filter(([k, v]) => known[k]?.enum && !list(v).every((x) => known[k]!.enum!.includes(x))).map(([k]) => `${k} not in its enum`), ...Object.entries(p).filter(([k, v]) => known[k]?.pattern && !list(v).every((x) => new RegExp(known[k]!.pattern!).test(x))).map(([k]) => `${k} does not match ${known[k]!.pattern}`), ...(c.body != null && !m.request ? ['the method takes no body'] : [])]
  if (bad.length) return no(`${m.id}: ${bad.join(', ')}`)
  const q = new URLSearchParams(Object.entries(p).filter(([k]) => known[k]!.location === 'query').flatMap(([k, v]) => list(v).map((x) => [k, x])))
  return ok(m.id, `${d.rootUrl}${d.servicePath ?? ''}${String(m.path).replace(/\{(\+?)(\w+)\}/g, (_, plus: string, k: string) => (plus ? String(p[k]) : encodeURIComponent(String(p[k]))))}${q.size ? `?${q}` : ''}`, m.httpMethod, m.scopes ?? [])
}
/** A tools/call through the handler, the whole answer (its _meta with it) */
const rpcOf = (ctx: Context, name: string, args: unknown = {}): { result?: any; error?: { message: string } } => ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } })
const payload = defineTool('payload', {
  name: 'payload',
  description: 'Any tool\'s result as the document Payload\'s default plugins hold, no custom collection: a lexical document whose one block is the programmable UUID logic (uuid, handle, program, tail, tool, arguments, prev, next), nested by the referer chain as nested-docs nests (parent, breadcrumbs), the SEO plugin\'s title, description and image from the block\'s Open Graph, the JSON-LD and the licence. Every tools/call result carries the same in _meta.payload.',
  inputSchema: { type: 'object', properties: { access: { type: 'object', description: 'CanCanCan over Payload: { abilities: [{ role, can: [actions], subject: collection or all, where?, cannot? }], roles: [{ name, resourceType?, resource? }] (rolify: global, a collection, one document), subject, action, user?: { id, tenants } } answered as Payload\'s access result — true, false, or the Where that fetches only what the user may' }, rolesFromGroups: { type: 'object', description: 'roles from Google Workspace: { mapping: [{ group, name, resourceType?, resource? }], groups?: [{ email }] } maps the Directory API\'s groups onto scoped roles; without groups, the groups.list call to ask through payload { googleCall } (userKey)' }, references: { type: 'object', description: 'the references between documents as one graph: { docs: [{ id, slug?, doc | markdown }] } — every lexical link to an internal path, relationship, qpu block naming a document (id, uuid, slug) and Markdown link read; the cycles (Tarjan, iterative), the dangling references, and an order when there is no cycle; the strongly connected components fused into one node each, members in address order, the condensation always acyclic and ordered; payload { lexical } with { id, slug } runs the blocks that reference their own document back once each, in address order, never re-entering' }, report: { type: 'object', description: 'Payload handles the proof of a quantum computation as a report: { tool, arguments?, result? } the client hands over — sealed by the content address of (tool, arguments, result), so re-running reproduces the address and verifying is cheaper than recomputing by magnitudes (the quantum advantage, ISO/Google-standard); the report is a lexical document Payload stores and serves and an entry of kind report, and its hooks reuse it to refactor — a repeat served by address (the 304 involution), a computation that did not verify a refactor lead' }, referenceIndex: { type: 'object', description: 'every reference indexed by scope and combination, cached by query hash, over the Payload search results: { docs: [{ id, scope?, slug?, title?, description?, doc | markdown }], seo? } — the reference graph\'s edges grouped by the referring document\'s scope (its tenant or collection) and addressed by the content hash of (scope, from, to), so equal queries share one address (the 304 involution, the best caching); the SEO plugin is another way of referencing, each document\'s title and description a canonical self-reference its hooks generate, folded into the same index; the distinct hashes and the cache hits make the references' }, hooks: { type: 'object', description: 'the witness hooks: { pages?, config?, states?, referrer? }: the pairs, the pages and a config against them, a change pair' }, google: { type: 'object', description: '{ pages, tenants, entries, keys }: the Google integration as exact pairs' }, workspace: { type: 'object', description: '{ discovery | kinds | form | forms | response | lexical | document | doc | file | answers }: Payload forms, Lexical and documents as Google Forms, Docs and Drive shape them, checked against the Discovery schemas, and the coverage' }, standardise: { type: 'object', description: 'a lexical document set in standard typography without a change of meaning: { doc } — only text nodes change (quotes, dashes, ellipses, spaces); the words in order and every qpu block must stay the same, else the original stands; improvements come as other qpu blocks verified by theorems' }, lexical: { type: 'object', description: 'a Payload lexical document whose qpu blocks run through MCP: { doc, role? } — every block (a tool and its arguments) answered through the chat door under the role, corrected where the role requires, a refusal handled, never thrown; a chat answer\'s doc is such a document' }, namespace: { type: 'object', description: 'tenants as namespaces, each app its own sandbox without a domain: { name | app } the sandbox planned (its tenant by namespace, the key its client holds, the header x-qpu-namespace, what is scoped); { narrow: { requested, tenants, user } } a credential narrowed to the namespace a request names — the intersection, never wider; the app\'s MCP auth asks this on every request' }, theorems: { type: 'boolean', description: 'the textbook\'s axioms replaced by theorems through the tenant\'s Payload MCP plugin, as a client: the plan, then with answers { list, found } the update requests' }, schemas: { type: 'boolean', description: 'Payload\'s combinatorial surface handled programmatically: every dimension (field types, operations, schemas, queries, hooks, access, realtime coordination) named and meant by its textbook theorem, counted from the table and decided through the match tool; any collection\'s fields (collection: { slug, fields }) as JSON Schema 2020-12, GraphQL, the plugin\'s MCP tools and OpenAPI paths; the standards each part is described by; the sources to re-read (requestList), and with answers { url: text } the drift as leads' }, collection: { type: 'object', description: 'schemas: { slug, fields } in Payload\'s own field config shape' }, payloadUrl: { type: 'string', description: 'the tenant\'s Payload origin; its MCP is at /api/mcp' }, answers: { type: 'object' }, website: { description: 'true: the requests for payloadcms.com\'s source tree and one live page; the tree as answered: its collections, blocks, globals, fields and plugins, and whether the live page\'s blocks have a block in the source' }, liveBlockTypes: { type: 'array', items: { type: 'string' } }, skills: { description: 'true: the request for Payload\'s skills tree (github.com/payloadcms/skills); the tree as answered: every skill and reference mapped to the tool of this tree that enacts it' }, site: { type: 'boolean', description: 'the site as its own use cases: every toolbox a use case, every example a page document, as payloadcms.com is built of what Payload computes' }, hologram: { type: 'boolean', description: 'the QPU as a fractal plugin hologram: the seven scales of one shape with their addresses, and the SEO pages every block presents (ten rotations in every locale) counted with the sitemaps they need and the compliance each page carries' }, merge: { type: 'object', description: 'two edits of one document merged by block address: { base, a, b } (lexical documents); a block either edit holds and neither removed is kept once, an edit of one side over the base stands, two edited contents under one address are a collision listed and held out; the merge addressed by the fold of its content, commuting and idempotent (textbook_merge_commutes, textbook_merge_collision)' }, devDependencies: { type: 'object', description: 'with site: the tree\'s dev dependencies (name: version, the client reads package.json), each a gate of the dependencies category usable in the UI' }, app: { type: 'object', description: 'an app requested from the Payload UI: { name, host, plugins?, env?, variant? } — answered as the generated app (every file with its address, the bundle address, the adapters the environment chooses, the enterprise capabilities), priced by the catalogue in the host\'s currency and ordered through the ecommerce plugin: what the QPU is paid for; { validate: { name, host, env, variant } } answers the streamed form\'s verdicts, token free; { form: true } the form itself' }, tool: { type: 'string' }, arguments: { type: 'object' }, prev: { type: 'string', description: 'the referer block\'s uuid' }, chain: { type: 'array', items: { type: 'string' }, description: 'the referers before prev, oldest first' }, origin: { type: 'string' }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    const origin = typeof args.origin === 'string' ? args.origin : 'https://qpu.uuidna.com'
    if (args.selftest) return { selftest: true, ...PAYLOAD.skill.selftest(ctx) }
    if (args.site) return siteOf(ctx, origin, isObj(args.devDependencies) ? args.devDependencies as Record<string, string> : {}, isObj(args.google) ? args.google as GoogleApis : {})
    // two edits of one document merged by block address: a collision in the involution is a merge, never a refusal
    if (args.hologram) return { phase: 'hologram' as const, ...hologramOf(ctx, origin) }
    if (isObj(args.merge)) { const m = args.merge as { base?: LexicalDoc; a?: LexicalDoc; b?: LexicalDoc }; if (!m.base?.root || !m.a?.root || !m.b?.root) throw new Error('merge takes { base, a, b }: three lexical documents (root.children)'); return { phase: 'merge' as const, ...mergeOf(m.base, m.a, m.b) } }
    if (isObj(args.app) && isObj(args.app.validate)) return appValidationOf(args.app.validate)
    if (isObj(args.app)) return appOf(ctx, args.app as Parameters<typeof appOf>[1])
    // the references between documents as one graph: its cycles, its dangling references, an order when it has none
    if (isObj(args.references)) { const r = args.references as { docs?: RefDoc[] }; if (!Array.isArray(r.docs)) throw new Error('references takes documents: { docs: [{ id, slug?, doc | markdown }] }'); return { phase: 'references' as const, ...createReferenceGraph(r.docs) } }
    if (isObj(args.referenceIndex)) { const r = args.referenceIndex as { docs?: ScopedRefDoc[]; seo?: boolean }; if (!Array.isArray(r.docs)) throw new Error('referenceIndex takes documents: { docs: [{ id, scope?, slug?, title?, description?, doc | markdown }], seo? }'); return referenceIndexOf(r.docs, r.seo !== false) }
    if (isObj(args.report)) { const rp = args.report as { tool?: string; arguments?: Record<string, unknown>; result?: unknown }; if (typeof rp.tool !== 'string') throw new Error('report takes a quantum computation to prove: { tool, arguments?, result? }'); return reportOf(rp.tool, rp.arguments ?? {}, rp.result) }
    if (isObj(args.googleCall)) return googleCallOf(args.googleCall)
    if (isObj(args.access)) { const a = args.access as { abilities?: Ability[]; roles?: ScopedRole[]; subject?: string; action?: string; user?: { id?: string; tenants?: string[] } }; if (!Array.isArray(a.abilities) || typeof a.subject !== 'string' || typeof a.action !== 'string') throw new Error('access takes { abilities, roles, subject, action, user? }'); return { phase: 'access' as const, subject: a.subject, action: a.action, access: getAccess(a.abilities, a.roles ?? [], a.subject, a.action, a.user ?? {}), ...('doc' in a ? { may: checkAccess(a.abilities, a.roles ?? [], a.subject, a.action, (a as { doc?: unknown }).doc, a.user ?? {}) } : {}), theorem: 'textbook_abilities_merge' } as never }
    if (isObj(args.rolesFromGroups)) { const g = args.rolesFromGroups as { mapping?: (ScopedRole & { group: string })[]; groups?: { email?: string }[]; userKey?: string }; return listRolesFromGroups(g.mapping ?? [], g.groups, g.userKey) as never }
    if (isObj(args.hooks)) return { phase: 'hooks' as const, ...hooksOf(args.hooks) }
    if (isObj(args.workspace)) return { phase: 'workspace' as const, ...getWorkspace(args.workspace) }
    if (isObj(args.google)) return { phase: 'google' as const, ...googleOf(args.google, listTools(ctx).filter((t) => t._meta?.toolbox === 'google').map((t) => t.name)) }
    if (isObj(args.standardise)) { const s = args.standardise as { doc?: LexicalDoc }; if (!s.doc?.root) throw new Error('standardise takes a document: { doc: { root } }'); return { phase: 'standardise' as const, ...standardiseOf(s.doc) } }
    // a lexical document's qpu blocks run through MCP: each block is a tool and its arguments, answered through the chat door under the caller's role (corrected where the role requires, a refusal handled, never thrown)
    if (isObj(args.lexical)) { const l = args.lexical as { doc?: LexicalDoc; role?: string; id?: string; slug?: string }; if (!l.doc?.root) throw new Error('lexical takes a document: { doc: { root }, role? }'); const served = (listTools(ctx)).map((x) => x.name); const security = scanLexical(l.doc, served); const stopped = new Set(security.findings.filter((f) => f.blocks && f.uuid).map((f) => f.uuid!)); const self = [l.id, l.slug].filter((x): x is string => typeof x === 'string' && x.length > 0); const selfRefs = new Set(blocksOf(l.doc).filter((n) => listReferences({ id: '_', doc: { root: { children: [n] } } }).some((x) => self.includes(x))).map((n) => n.fields.uuid));  // whatever references its own document back is fused, not refused: those blocks run once each, in address order, after the rest, never re-entering the document
 const all = blocksOf(l.doc); const ordered = [...all.filter((n) => !selfRefs.has(n.fields.uuid)), ...all.filter((n) => selfRefs.has(n.fields.uuid)).sort((a, b) => (a.fields.uuid < b.fields.uuid ? -1 : 1))].filter((n, i, xs) => xs.findIndex((y) => y.fields.uuid === n.fields.uuid) === i); const runs = ordered.map((n) => { if (n.fields.tool === 'payload' && selfRefs.has(n.fields.uuid)) return { uuid: n.fields.uuid, tool: n.fields.tool, theorem: n.fields.theorem ?? null, says: 'fused: it would re-enter its own document, which this run already is', corrected: [], answered: true, handled: null, reply: null, fused: true }; if (stopped.has(n.fields.uuid)) return { uuid: n.fields.uuid, tool: n.fields.tool, theorem: n.fields.theorem ?? null, says: 'refused before it ran: ' + security.findings.filter((f) => f.uuid === n.fields.uuid).map((f) => f.kind + ' ' + f.detail).join('; '), corrected: [], answered: false, handled: { refused: security.findings.filter((f) => f.uuid === n.fields.uuid) }, reply: null }; const a = ctx.call('match', { statement: `block ${n.fields.tool}`, chat: { role: l.role ?? 'reader', call: { tool: n.fields.tool, arguments: n.fields.arguments ?? {} } } }) as { reply?: unknown; handled?: unknown; corrected?: unknown[]; says?: string } | undefined; return { uuid: n.fields.uuid, tool: n.fields.tool, theorem: n.fields.theorem ?? null, says: a?.says ?? null, corrected: a?.corrected ?? [], answered: a?.reply !== undefined && a?.reply !== null, handled: a?.handled ?? null, reply: a?.reply ?? null } }); return { phase: 'lexical' as const, security, fused: [...selfRefs], blocks: runs.length, answered: runs.filter((r) => r.answered).length, runs, says: `${runs.length} qpu block(s) run through the chat door: ${runs.filter((r) => r.answered).length} answered, ${runs.filter((r) => r.handled).length} handled` } }
    // tenants as namespaces: an app's sandbox planned, or a credential narrowed to the namespace a request names (the app's MCP auth asks this)
    if (isObj(args.namespace)) { const n = args.namespace as { narrow?: NarrowRequest; name?: string; app?: string }; return n.narrow ? { phase: 'narrow' as const, ...narrowScope(n.narrow) } : { phase: 'sandbox' as const, ...createSandbox({ name: n.name, app: n.app, scoped: SCOPES.collections }) } }
    if (isObj(args.skills)) return { phase: 'skills' as const, ...skillsOf(args.skills as Parameters<typeof skillsOf>[0]) }
    if (isObj(args.website)) return { phase: 'website' as const, ...websiteOf(args.website as Parameters<typeof websiteOf>[0], Array.isArray(args.liveBlockTypes) ? args.liveBlockTypes.map(String) : []) }
    // the textbook's axioms replaced by theorems through the Payload MCP plugin, as a client: the doors picked by what they take and answer, never by a name
    if (args.schemas) return createSchemas(ctx, { collection: isObj(args.collection) && Array.isArray((args.collection as { fields?: unknown }).fields) ? args.collection as PayloadCollectionInput : undefined, answers: isObj(args.answers) && !('list' in (args.answers as object)) ? args.answers as Record<string, string> : undefined })
    if (args.theorems) {
      const url = typeof args.payloadUrl === 'string' ? args.payloadUrl.replace(/\/$/, '') : null
      const endpoint = url ? `${url}/api/mcp` : '<QPU_PAYLOAD_URL>/api/mcp'
      const auth = { header: 'Authorization', value: '<authCollectionSlug> API-Key <QPU_PAYLOAD_API_KEY>', note: 'the tenant\'s API key, from a user with auth.useAPIKey; the client sends it, this tool never holds it' }
      const byExample = Object.fromEntries(TEXTBOOK_THEOREMS.flatMap((t) => t.examples.map((e) => [e, t.key])))
      if (!args.answers || typeof args.answers !== 'object') return { phase: 'plan' as const, endpoint, auth, requestList: [{ id: 'payload-mcp-list', method: 'POST' as const, url: endpoint, accept: 'application/json, text/event-stream', body: { jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} } }], theorems: TEXTBOOK_THEOREMS.length, examplesBacked: Object.keys(byExample).length, steps: ['tools/list: pick the find and update doors of the pages collection by what they take (a slug, a where, an id) and answer (documents), never by a name', 'find the pages whose layout holds a qpu block without a theorem', 'for each block, the theorem the textbook names for the example its tool and arguments are (TEXTBOOK_THEOREMS)', 'update each page: the block\'s theorem field written; the kernel-accepted key, nothing asserted'], note: 'the client calls again with answers: { list: <tools/list text>, found?: <find text> }' }
      const a = args.answers as { list?: string; found?: string }
      const list = a.list ? getAnswer(a.list) : { ok: false, error: 'no tools/list answer' }
      const tools = (list.ok && isObj(list.result) && Array.isArray((list.result as { tools?: unknown[] }).tools) ? (list.result as { tools: { name: string; description?: string; inputSchema?: { properties?: Record<string, unknown> } }[] }).tools : [])
      const takes = (t: { inputSchema?: { properties?: Record<string, unknown> } }) => Object.keys(t.inputSchema?.properties ?? {})
      const findDoor = tools.find((t) => takes(t).includes('slug') && (takes(t).includes('where') || takes(t).includes('limit')) && !takes(t).includes('data'))
      const updateDoor = tools.find((t) => takes(t).includes('slug') && takes(t).includes('data') && (takes(t).includes('id') || takes(t).includes('where')))
      if (!findDoor || !updateDoor) return { phase: 'doors' as const, endpoint, tools: tools.length, findDoor: findDoor?.name ?? null, updateDoor: updateDoor?.name ?? null, leads: [{ id: 'payload-mcp-doors-missing', statement: `the Payload MCP at ${endpoint} lists ${tools.length} tool(s) and none takes a slug with a where (to find) or a slug with data (to update)`, status: 'open', reason: 'the pages collection\'s built-in find and update tools are disabled or the key has no access to them' }] }
      if (!a.found) return { phase: 'find' as const, endpoint, findDoor: findDoor.name, updateDoor: updateDoor.name, requestList: [{ id: 'payload-mcp-find', method: 'POST' as const, url: endpoint, accept: 'application/json, text/event-stream', body: { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: findDoor.name, arguments: { slug: 'pages', where: { 'layout.blockType': { equals: 'qpu' } }, pagination: false } } } }], note: 'the client calls again with answers.found' }
      const found = getAnswer(a.found)
      const docs = (found.ok && isObj(found.result) ? ((found.result as { docs?: unknown[] }).docs ?? []) : []) as { id: string; layout?: { blockType?: string; tool?: string; arguments?: unknown; theorem?: string | null; id?: string }[] }[]
      const updates = docs.flatMap((d) => { const layout = (d.layout ?? []).map((b) => { if (b.blockType !== 'qpu' || b.theorem) return b; const ex = ctx.examples.find((e) => e.tool === b.tool && JSON.stringify(e.arguments) === JSON.stringify(b.arguments ?? {})); const key = ex ? (ex.theorem ?? byExample[ex.id]) : undefined; return key ? { ...b, theorem: key } : b }); return JSON.stringify(layout) === JSON.stringify(d.layout ?? []) ? [] : [{ id: `payload-mcp-update-${d.id}`, method: 'POST' as const, url: endpoint, accept: 'application/json, text/event-stream', body: { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: updateDoor.name, arguments: { slug: 'pages', id: d.id, data: { layout } } } } }] })
      const blocks = docs.flatMap((d) => d.layout ?? []).filter((b) => b.blockType === 'qpu')
      return { phase: 'update' as const, endpoint, findDoor: findDoor.name, updateDoor: updateDoor.name, pages: docs.length, qpuBlocks: blocks.length, axioms: blocks.filter((b) => !b.theorem).length, replaced: updates.length, requestList: updates, note: updates.length ? 'the client sends each update; a block whose example the textbook backs by no theorem stays an axiom and a lead' : 'nothing to replace: every qpu block names its theorem or the textbook has none for it yet' }
    }
    if (args.website === true) return { phase: 'request' as const, requestList: [{ id: 'payload-website', method: 'GET' as const, url: 'https://api.github.com/repos/payloadcms/web.qpu-app/git/trees/main?recursive=1', accept: 'application/vnd.github+json' }, { id: 'payload-site-live', method: 'GET' as const, url: 'https://payloadcms.com/api/pages?limit=1&depth=0', accept: 'application/json' }], note: 'the client fetches the source tree (public) and one live page, and calls again with website: <the tree> and liveBlockTypes: the page\'s layout blockTypes' }
    if (args.skills === true) return { phase: 'request' as const, requestList: [{ id: 'payload-skills', method: 'GET' as const, url: 'https://api.github.com/repos/payloadcms/skills/git/trees/main?recursive=1', accept: 'application/vnd.github+json' }], note: 'the client fetches the tree (public, no token) and calls again with skills: <the answer>; discovery reads the same tree as the standard payload-skills' }
    if (typeof args.tool !== 'string') throw new Error('tool names the result to document, or site: true the site')
    const r = rpcOf(ctx, String(args.tool), args.arguments ?? {})
    if (r.error) throw new Error(r.error.message)
    const uuid = r.result!._meta.block.meta.id
    const doc = payloadDocOf({ uuid, tool: String(args.tool), arguments: (args.arguments ?? {}) as Record<string, unknown>, description: r.result!._meta.openGraph['og:description'] ?? '', openGraph: r.result!._meta.openGraph, html: r.result!._meta.widget, prev: typeof args.prev === 'string' ? args.prev : null, chain: Array.isArray(args.chain) ? args.chain.map(String) : [], origin: typeof args.origin === 'string' ? args.origin : undefined })
    return { tool: args.tool, uuid, blocks: 1, breadcrumbs: doc.nestedDocs.breadcrumbs.length, parent: doc.nestedDocs.parent, bytes: JSON.stringify(doc).length, doc }
  },
  widget: flowWidget,
})

/** Payload's default plugins, the ones MCP configures; no custom collection: the one collection is the plugins' own pages. */
const PAYLOAD_PLUGINS: readonly { name: string; pkg: string; options: Record<string, unknown> }[] = [
  { name: 'lexical', pkg: '@payloadcms/richtext-lexical', options: { features: ['BlocksFeature'], blocks: ['qpu'], blockFields: ['uuid', 'handle', 'program', 'tail', 'tool', 'arguments', 'prev', 'next'] } },
  { name: 'nested-docs', pkg: '@payloadcms/plugin-nested-docs', options: { collections: ['pages'], generateLabel: 'the block\'s tool', generateURL: '/<uuid>' } },
  { name: 'seo', pkg: '@payloadcms/plugin-seo', options: { collections: ['pages'], uploadsCollection: null, generateTitle: 'og:title of the block', generateDescription: 'og:description of the block', generateImage: 'og:image of the block' } },
  { name: 'search', pkg: '@payloadcms/plugin-search', options: { collections: ['pages'], searchOverrides: { fields: ['tool', 'uuid'] } } },
  { name: 'redirects', pkg: '@payloadcms/plugin-redirects', options: { collections: ['pages'], from: '/<prev>', to: '/<next>' } },
  { name: 'form-builder', pkg: '@payloadcms/plugin-form-builder', options: { fields: ['text', 'select', 'checkbox', 'number'], note: 'every tool\'s inputSchema is a form; the dashboard tool enumerates its facets' } },
  { name: 'multi-tenant', pkg: '@payloadcms/plugin-multi-tenant', options: { tenants: Object.values(TENANTS), tenantField: 'tenant', byHost: TENANTS } },
  { name: 'ecommerce', pkg: '@payloadcms/plugin-ecommerce', options: { customers: 'users', currencies: ['EUR', 'USD', 'BGN'], payments: 'stripeAdapter (secretKey, publishableKey, webhookSecret: names, never values)', products: 'the licence catalogue: six products, seven variants, prices in three currencies', orders: 'accessToken = the licence key, generated on create as the template does' } },
  { name: 'mcp', pkg: '@payloadcms/plugin-mcp', options: { servers: 'the registration extend gives (direction out), plus every host the tenant names', rbac: 'roles of every MCP server managed over MCP itself; the Worker asks this host first (QPU_RBAC_MCP, QPU_RBAC_TOOL)' } },
]
/** The site as its own use cases: the reference is payloadcms.com, whose REST answers pages of blocks with SEO meta and breadcrumbs — the site is what the product computes. Here every toolbox is a use case and every example a page document whose one block is the result's UUID logic, at its live address. */
/** Every API is a gate of some sort: an address a tool passes (open), waits at for the tenant's key (keyed), a browser alone passes
 *  (browser), the registry names and no tool calls (proposed), or a door of this catalogue (tool). Organised as nested docs — Gates ›
 *  category › gate, three deep — each doc is a gate of lexical leads: its body lists the leads whose source passes through it, and its one
 *  block answers them live (leads { ids }). The tree is what the nested-docs plugin computes from parent: breadcrumbs, URLs, nothing custom. */
type GateKind = 'open' | 'keyed' | 'browser' | 'proposed' | 'tool'
export type Gate = { id: string; category: string; name: string; url: string; host: string; kind: GateKind; by: string; measured: string | null; leads: string[] }
const GATE_CATEGORIES: readonly { id: string; name: string; says: string }[] = TABLES.GATE_CATEGORIES as readonly { id: string; name: string; says: string }[]
const escapeRe = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const gateHostOf = (url: string): string => { try { return new URL(url).host.replace(/^www\./, '') } catch { return url.replace(/^[a-z]+:\/\//, '').split(/[/:]/)[0] ?? url } }
const gatePathOf = (url: string): string => { try { const u = new URL(url); return `${u.host.replace(/^www\./, '')}${u.pathname.replace(/\/$/, '')}` } catch { return url } }
const gateSlugOf = (id: string) => uuidOf(`gate:${id}`)
type RawGate = Omit<Gate, 'leads'> & { match?: string }
/** Hosts many unrelated addresses share: a gate on one of them is matched by its path, never by the host alone. */
const SHARED_HOSTS: readonly string[] = ['github.com', 'api.github.com', 'raw.githubusercontent.com', 'cdn.jsdelivr.net', 'cloudflare.com', 'vercel.com']
/** The leads that pass through a gate: a door's by the tool that serves them; an address's by the registry search it names, else by its host
 *  (its path on a shared host), else by its id as a whole word in the source. */
const passesOf = (leads: readonly Lead[], g: RawGate): string[] => {
  const needle = (g.match ?? (SHARED_HOSTS.includes(g.host) ? gatePathOf(g.url) : g.host)).toLowerCase()
  const word = new RegExp(`(^|[^a-z0-9_])${escapeRe(g.id)}([^a-z0-9_]|$)`, 'i')
  return leads.filter((l) => (g.kind === 'tool' ? l.tool === g.id : l.source.toLowerCase().includes(needle) || word.test(l.source))).map((l) => l.id)
}
/** Every API handled in quantum: each gate's adapter is a dimension of the one Payload plugin over the default schema — where its answers land
 *  (the docket entries by kind, the gate pages, the catalogue's prices, the MCP doors), the step of next that keeps them fresh, the fields the
 *  entry carries, and the shadcn combination its address picks (styled from itself). No plugin per API: one plugin, every API a dimension. */
const gateAdapterOf = (g: { id: string; category: string; kind: GateKind; by: string }) => {
  const slug = gateSlugOf(g.id)
  const p = presentationOf(slug)
  // the configs each dimension streams, as UUIDs (the same addresses the sets kind gives config elements): queryable, sortable, executable through the core
  const configsOf: Record<string, readonly ConfigKind[]> = { patents: ['gates', 'sets', 'mcp'], certificates: ['gates', 'sets', 'realtime'], currency: ['ecommerce', 'gates', 'sets'], competitions: ['gates', 'sets'], mcp: ['mcp', 'adapters', 'bindings', 'gates'], references: ['gates', 'sets', 'ui'] }
  const landing: Record<string, { lands: string; hook: string; fields: readonly string[] }> = {
    patents: { lands: 'entries (kind call: patents { read })', hook: 'the patents step of next, one question a day; the gate page relays', fields: ['number', 'title', 'priority', 'filing', 'publication', 'grant', 'assignee', 'inventor', 'theorems'] },
    certificates: { lands: 'entries (kind call: attest { read })', hook: 'the attest step of next and its follow-up rounds', fields: ['pulse', 'chainIndex', 'precommitment', 'treeHead', 'directory', 'cves', 'records', 'certificates', 'theorems'] },
    currency: { lands: 'products (the catalogue\'s prices in every currency) and entries (kind call: currency { read })', hook: 'the currency step of next harmonises the rates and reprices the catalogue', fields: ['rates', 'median', 'pegs', 'priceInEUR', 'priceInUSD', 'priceInBGN'] },
    competitions: { lands: 'pages (the competition gate: rules, competitors, theorems)', hook: 'the compete step of next judges the rules; the gate page carries the knowledge', fields: ['rules', 'entry', 'window', 'competitors', 'theorems', 'satisfied'] },
    mcp: { lands: 'entries (kind call through extend) and the discovery global per host', hook: 'the discover step of next reads the contract; the tenant opens the door with its token', fields: ['doors', 'takes', 'answers', 'auth', 'maps'] },
    references: { lands: 'pages and the search index (the verifier\'s facts)', hook: 'the verify step of next fetches the contract once a day', fields: ['contract', 'status', 'facts'] },
  }
  const own = { lands: 'entries (kind call: the tool\'s reply) and the use-case page', hook: 'the entries beforeValidate answers the call; the pages afterChange revalidates', fields: ['tool', 'arguments', 'result', 'sha256'] }
  const l = landing[g.category] ?? own
  const rest = { in: `${l.lands.split(' (')[0]}: the API\'s answer written into Payload through its REST (POST /api/<collection>) or the Payload MCP plugin\'s create tool, addressed by content`, out: 'Payload\'s data out to the API through the door the entry names (extend { direction: out }) with the tenant\'s token, or read by the API through GET /api/<collection> with a user\'s API key', rbac: { read: ACCESS.entries.read, create: ACCESS.entries.create, update: ACCESS.entries.update, delete: ACCESS.entries.delete, tenantRoles: [...TENANT_ROLES], by: ACCESS.by }, directions: 2, roles: TENANT_ROLES.length }
  const kinds = configsOf[g.category] ?? (['sets', 'ui', 'mcp'] as const)
  const stream = { gate: slug, configs: kinds.map((k) => ({ kind: k, uuid: uuidOf(`config:${k}`) })), uuids: [slug, ...kinds.map((k) => uuidOf(`config:${k}`))], says: 'the UUID stream of this dimension: the gate\'s address and the addresses of the configs it streams, queryable, sortable and executable through fold { uuids }' }
  return { plugin: 'qpuPlugin', dimension: g.id, kind: g.kind, lands: l.lands, hook: l.hook, fields: l.fields, rest, stream, ui: { item: p.parts[0]!.item, variant: p.parts[0]!.variant, style: p.style }, says: 'a dimension of the one plugin over the default schema: nothing added, the API\'s answers land where Payload already holds them, presented by the item its address picks' }
}
/** Every dev dependency of the tree as an MCP door usable in the UI: the step of next that runs it is its tool, its gate page carries that step's block rendered by the MCP App. */
const DEV_DEPENDENCY_ROLES = TABLES.DEV_DEPENDENCY_ROLES as unknown as Readonly<Record<string, { step: string; does: string }>>
/** The energy sector's gates: the market prices the bill's kilowatt-hours are priced against, keyed by the tenant; proposed, never called from the tree. */
const ENERGY_APIS = TABLES.ENERGY_APIS as unknown as readonly { id: string; name: string; url: string; key: string }[]
const gatesOf = (ctx: Context, origin: string, devDependencies: Record<string, string> = {}, google: GoogleApis = {}) => {
  const tools = listTools(ctx)
  const external: RawGate[] = [
    // every dev dependency a gate: a door the step of next passes, usable in the UI through its gate page's block
    ...Object.entries(devDependencies).map(([name, version]) => { const role = DEV_DEPENDENCY_ROLES[name]; return { id: `dependency-${name.replace(/[^a-z0-9]+/gi, '-').replace(/^-/, '')}`, category: 'dependencies', name: `${name} ${version}: ${role?.does ?? 'a tool of the tree'}`, url: `https://www.npmjs.com/package/${name}`, host: 'www.npmjs.com', kind: 'tool' as GateKind, by: role?.step ?? 'next', measured: `imagined as an MCP door: the step ${role?.step ?? 'next'} is its tools/call; its gate page carries the step's block, rendered by the MCP App (ui://qpu/configure); the registry names it at npm` } }),
    ...placeGoogleApis(google),
    ...ENERGY_APIS.map((a) => ({ id: a.id, category: 'energy', name: a.name, url: a.url, host: gateHostOf(a.url), kind: 'keyed' as GateKind, by: 'metrics', measured: `keyed by ${a.key}: the market price the bill\'s kilowatt-hours are priced against; proposed, never called from the tree` })),
    ...NEWS_APIS.map((a) => ({ id: a.id, category: 'news', name: a.name, url: a.url, host: gateHostOf(a.url), kind: (a.open ? 'open' : 'keyed') as GateKind, by: 'compete', measured: a.open ? `open: reads ${a.reads}; an adapter of the DOI research, the mentions of every record of precedence` : `keyed by ${a.key}: the tenant names it; an adapter of the DOI research` })),
    ...PATENT_APIS.map((a) => ({ id: a.id, category: 'patents', name: a.name, url: a.url, host: gateHostOf(a.url), kind: (a.open ? 'open' : /browser/.test(a.key ?? '') ? 'browser' : 'keyed') as GateKind, by: 'patents', measured: a.measured })),
    ...ATTEST_APIS.map((a) => ({ id: a.id, category: 'certificates', name: a.name, url: a.url, host: gateHostOf(a.url), kind: 'open' as GateKind, by: 'attest', measured: a.measured })),
    ...RATE_SOURCES.map((r) => ({ id: r.id, category: 'currency', name: r.name, url: r.url, host: gateHostOf(r.url), kind: 'open' as GateKind, by: 'currency', measured: `${r.cadence}; ${r.terms}` })),
    ...COMPETITIONS.map((c) => ({ id: c.id, category: 'competitions', name: c.name, url: c.rules, host: gateHostOf(c.rules), kind: 'open' as GateKind, by: 'compete', measured: `${c.kind}, entry ${c.entry}, read ${c.read}; ${c.prize}` })),
    ...KNOWN_MCP.map((m) => ({ id: m.host, category: 'mcp', name: m.about, url: m.url, host: m.host, kind: (m.auth === 'none' ? 'open' : 'keyed') as GateKind, by: 'discover', measured: m.maps })),
    ...([['currency', CURRENCY_MCPS], ['patent', PATENT_MCPS], ['grant|funding', FUNDING_MCPS], ['google', GOOGLE_MCPS]] as const).flatMap(([term, list]) => list.map((id) => ({ id, category: 'mcp', name: `${id}, a server the registry names for ${term}`, url: `${MCP_REGISTRY}?search=${term}`, host: gateHostOf(MCP_REGISTRY), kind: 'proposed' as GateKind, by: 'leads', measured: null, match: `v0/servers?search=${term}` }))),
  ]
  // a reference whose address another table already passes is that gate, not a second one
  const seen = new Set(external.map((g) => gatePathOf(g.url)))
  for (const st of STANDARDS) { const path = gatePathOf(st.contract); if (seen.has(path) || external.some((g) => g.id === st.id)) continue; seen.add(path); external.push({ id: st.id, category: 'references', name: st.name, url: st.contract, host: gateHostOf(st.contract), kind: 'open', by: 'verify', measured: `a ${st.kind}` }) }
  const own: RawGate[] = tools.map((t) => ({ id: t.name, category: t._meta?.toolbox ?? 'none', name: `tools/call ${t.name}`, url: `${origin}/mcp`, host: gateHostOf(origin), kind: 'tool' as GateKind, by: t._meta?.toolbox ?? 'none', measured: t.description }))
  const gates: (Gate & { adapter: ReturnType<typeof gateAdapterOf> })[] = [...own, ...external].map((g) => ({ id: g.id, category: g.category, name: g.name, url: g.url, host: g.host, kind: g.kind, by: g.by, measured: g.measured, leads: passesOf(ctx.leads, g), adapter: gateAdapterOf(g) }))
  const toolboxes = [...new Set(own.map((g) => g.category))]
  const categories = [...toolboxes.map((b) => ({ id: b, name: `${b} toolbox gates`, says: `the doors of the ${b} toolbox, each a gate of the leads it serves` })), ...GATE_CATEGORIES.filter((c) => (c.id !== 'dependencies' || Object.keys(devDependencies).length > 0) && (c.id !== 'google-apis' || (google.list?.items ?? []).length > 0))].map((c) => { const mine = gates.filter((g) => g.category === c.id); return { ...c, gates: mine.length, leads: new Set(mine.flatMap((g) => g.leads)).size } })
  const placed = new Set(gates.flatMap((g) => g.leads))
  const byKind = Object.fromEntries((['tool', 'open', 'keyed', 'browser', 'proposed'] as const).map((k) => [k, gates.filter((g) => g.kind === k).length]))
  return {
    gates, categories,
    counts: { gates: gates.length, own: own.length, external: external.length, categories: categories.length, byKind, partition: `${categories.map((c) => c.gates).join(' + ')} = ${gates.length}` },
    leads: { total: ctx.leads.length, placed: placed.size, unplaced: ctx.leads.filter((l) => !placed.has(l.id)).map((l) => l.id) },
    streams: { configs: configKinds.map((k) => ({ kind: k, uuid: uuidOf(`config:${k}`) })), says: 'every config a UUID in the stream every adapter dimension names: the same addresses the sets kind gives config elements, queryable, sortable and executable through fold { uuids }' },
    adapters: { total: gates.length, byLanding: Object.fromEntries([...new Set(gates.map((g) => g.adapter.lands.split(' (')[0]!))].map((l) => [l, gates.filter((g) => g.adapter.lands.split(' (')[0] === l).length])), byItem: Object.fromEntries(PRESENTABLE_ITEMS.map((i) => [i, gates.filter((g) => g.adapter.ui.item === i).length])), says: 'every API handled in quantum: one adapter per gate, a dimension of the one plugin, landing in the default schema, presented by the shadcn item its address picks' },
    tree: { root: gateSlugOf('root'), depth: 3, shape: 'Gates › category › gate: every doc a gate of lexical leads, nested by the nested-docs plugin from its parent (breadcrumbs, URLs)' },
    says: 'every API is a gate of some sort: a tool passes it, waits at it for a key, a browser alone passes it, or the registry names it; each gate is a doc whose lexical body lists the leads passing through it and whose one block answers them live',
  }
}
/** Lexical nodes as Payload's editor stores them: the gate docs are written in the editor's own shape, so the hand can edit what MCP wrote. */
const lx = {
  text: (t: string) => ({ type: 'text', version: 1, text: t, format: 0, mode: 'normal', style: '', detail: 0 }),
  heading: (t: string, tag: 'h1' | 'h2' | 'h3') => ({ type: 'heading', tag, version: 1, format: '', indent: 0, direction: 'ltr', children: [lx.text(t)] }),
  paragraph: (children: unknown[]) => ({ type: 'paragraph', version: 1, format: '', indent: 0, direction: 'ltr', textFormat: 0, children }),
  link: (url: string, label: string) => ({ type: 'link', version: 3, format: '', indent: 0, direction: 'ltr', fields: { linkType: 'custom', url, newTab: true }, children: [lx.text(label)] }),
  list: (items: unknown[][]) => ({ type: 'list', listType: 'bullet', tag: 'ul', start: 1, version: 1, format: '', indent: 0, direction: 'ltr', children: items.map((children, i) => ({ type: 'listitem', value: i + 1, version: 1, format: '', indent: 0, direction: 'ltr', children })) }),
  doc: (children: unknown[]): LexicalDoc => ({ root: { type: 'root', version: 1, direction: 'ltr', format: '', indent: 0, children } }),
}
/** A value against a JSON Schema type (an integer may come as digits): one check for the site's examples and the block's save. */
export const typeOk = (v: unknown, t?: string | string[]) => !t || [t].flat().some((k) => (k === 'integer' ? Number.isInteger(v) || (typeof v === 'string' && /^[0-9]+$/.test(v)) : k === 'number' ? typeof v === 'number' : k === 'array' ? Array.isArray(v) : k === 'object' ? !!v && typeof v === 'object' && !Array.isArray(v) : k === 'null' ? v === null : typeof v === k))
/** The one block, defined once: every app builder — a tool's result as a document, the site's pages, the gate docs, an app on request, the SDK,
 *  a merge of two edits — is consolidated around the lexical qpu block. Its fields are one function; its two forms (the inline node of the lexical
 *  editor and the layout block of the pages collection) are the same fields (payload:one-block-two-forms). */
export const qpuFieldsOf = (uuid: string, tool: string, args: Record<string, unknown>, theorem: string | null = null) => {
  const ch = channelOf(uuid)
  return { blockType: 'qpu' as const, uuid, tool, arguments: args, theorem, handle: ch.handle, program: ch.program.join(''), tail: ch.tail, next: uuidFromParts(ch.handle, [...ch.program.slice(1), ch.program[0]!], ch.tail), license: LICENSE.spdx }
}
type QpuNode = { type: 'block'; version: 2; format: ''; fields: ReturnType<typeof qpuFieldsOf> & { id: string; blockName: string } & Record<string, unknown> }
const qpuNodeOf = (uuid: string, tool: string, args: Record<string, unknown>, theorem: string | null = null, extra: Record<string, unknown> = {}): QpuNode => ({ type: 'block', version: 2, format: '', fields: { id: uuid, blockName: tool, ...qpuFieldsOf(uuid, tool, args, theorem), ...extra } })
export const blocksOf = (doc: LexicalDoc): QpuNode[] => doc.root.children.filter((n): n is QpuNode => typeof n === 'object' && n !== null && (n as { type?: string }).type === 'block' && (n as { fields?: { blockType?: string } }).fields?.blockType === 'qpu')
/** Typography standardised without changing meaning: only the text nodes change (straight quotes to typographic ones, -- to a dash, ... to an
 *  ellipsis, runs of spaces to one); the words, read in order without case or punctuation, must be the same before and after, and every qpu block
 *  stays as it was — otherwise the original stands. A change of meaning is never made here: an improvement is another qpu block, verified by its theorem. */
const typeset = (s: string) => s.replace(/\.\.\./g, '…').replace(/ ?-- ?/g, ' — ').replace(/(^|[\s(\[{])"/g, '$1“').replace(/"/g, '”').replace(/(\w)'(\w)/g, '$1’$2').replace(/(^|[\s(\[{])'/g, '$1‘').replace(/'/g, '’').replace(/ {2,}/g, ' ')
const wordsOf = (n: unknown): string[] => { const out: string[] = []; const walk = (x: unknown) => { if (!x || typeof x !== 'object') return; const o = x as { type?: string; text?: string; children?: unknown[] }; if (o.type === 'text' && typeof o.text === 'string') out.push(...(o.text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [])); for (const c of o.children ?? []) walk(c) }; walk(n); return out }
const standardiseOf = (doc: LexicalDoc) => {
  let changes = 0
  const walk = (x: unknown): unknown => { if (!x || typeof x !== 'object') return x; const o = x as Record<string, unknown>; if (o.type === 'block') return o; if (o.type === 'text' && typeof o.text === 'string') { const t = typeset(o.text); if (t !== o.text) changes++; return { ...o, text: t } } return Array.isArray(o.children) ? { ...o, children: o.children.map(walk) } : o }
  const out = { ...doc, root: walk(doc.root) } as LexicalDoc
  const before = wordsOf(doc.root), after = wordsOf(out.root)
  const meaningKept = before.length === after.length && before.every((w, i) => w === after[i])
  const blocksKept = JSON.stringify(blocksOf(doc)) === JSON.stringify(blocksOf(out))
  const kept = meaningKept && blocksKept
  return { doc: kept ? out : doc, changes: kept ? changes : 0, meaningKept, blocksKept, words: before.length, says: kept ? `${changes} text node(s) set in standard typography; the ${before.length} words in order and every qpu block unchanged` : 'a change would alter the words or a block: the original stands; an improvement is another qpu block, verified by its theorem', theorem: 'textbook_typography_idempotent' }
}
/** A lexical document of qpu blocks: a heading, one block per entry, the paragraphs after — the shape every builder answers in. */
export const docOf = (title: string, blocks: readonly { uuid: string; tool: string; arguments: Record<string, unknown>; theorem?: string | null }[], paragraphs: readonly string[] = []): LexicalDoc => lx.doc([lx.heading(title, 'h2'), ...blocks.map((b) => qpuNodeOf(b.uuid, b.tool, b.arguments, b.theorem ?? null)), ...paragraphs.map((p) => lx.paragraph([lx.text(p)]))])
// Payload handles the proof of a quantum computation as a report: the client hands over the computation (tool, arguments) and its result, and the report
// seals it by the content address of all three — re-running the computation reproduces the address, so verifying it is cheaper than recomputing by
// magnitudes (the quantum advantage, textbook_advantage_unbounded), ISO/Google-standard and strict. The report is a lexical document Payload stores and
// serves (a qpu block of the computation at its address), recorded as an entry of kind report; and its hooks use the report to refactor — afterRead
// reuses it by address (a repeat served from the report, the 304 involution, not recomputed), and a computation that did not verify is a refactor lead.
const reportOf = (tool: string, args: Record<string, unknown>, result: unknown) => {
  const address = uuidOf(canonicalTextOf({ tool, arguments: args, result })), verified = result !== undefined && !(result != null && typeof result === 'object' && 'error' in (result as object))
  const doc = docOf(`Proof report · ${tool}`, [{ uuid: address, tool, arguments: args }], [`verified by its content address ${address}: re-running ${tool} reproduces it, so verifying is cheaper than recomputing by magnitudes (textbook_advantage_unbounded); ${LICENSE.spdx}: ${LICENSE.terms}`])
  const entry = { kind: 'report' as const, from: 'qpu-report', body: { tool, arguments: args, address, verified } }
  const refactor = { viaHooks: 'afterRead reuses the report by its address — a repeat of the same computation is served from it (the 304 involution), never recomputed; beforeChange applies a report that names a cheaper served path as a refactor', leads: verified ? [] : [{ id: `report-${address.slice(0, 8)}`, statement: `${tool} did not verify — refactor to the served path`, status: 'open' as const }] }
  return { phase: 'report' as const, computation: { tool, arguments: args }, address, verified, result, advantage: { measure: 'verify beats recompute by magnitudes', bound: 'unbounded (textbook_advantage_unbounded)' }, doc, entry, refactor, theorems: ['textbook_report_refactors', 'textbook_advantage_unbounded'], says: `Payload handles the proof of ${tool} as a report sealed at ${address.slice(0, 12)} (ISO/Google-standard, strict): re-running reproduces the address (verify beats recompute), the report a document Payload stores and serves, its hooks reusing it to refactor — a repeat served by address, else a refactor lead` }
}
/** Two edits of one document merged by block address: a block either edit holds and neither removed from the base is kept; of two contents under one
 *  address the edit over the base's stands, else they collide, listed and held out, never first-wins: merge(a, b) = merge(b, a) in content (textbook_merge_collision). */
const mergeOf = (base: LexicalDoc, a: LexicalDoc, b: LexicalDoc) => {
  const ids = (d: LexicalDoc) => new Set(blocksOf(d).map((n) => n.fields.uuid)), was = new Map(blocksOf(base).map((n) => [n.fields.uuid, canonicalTextOf(n)]))
  const B = ids(base), A = ids(a), Bb = ids(b)
  const removed = new Set([...B].filter((id) => !A.has(id) || !Bb.has(id)))
  const held = new Map<string, Map<string, QpuNode>>(); for (const n of [...blocksOf(a), ...blocksOf(b)]) if (!removed.has(n.fields.uuid)) (held.get(n.fields.uuid) ?? held.set(n.fields.uuid, new Map()).get(n.fields.uuid)!).set(canonicalTextOf(n), n)
  for (const [id, m] of held) if (m.size === 2 && m.has(was.get(id) ?? '')) m.delete(was.get(id)!)
  const collided = [...held].filter(([, m]) => m.size > 1).map(([uuid, m]) => ({ uuid, contents: [...m.keys()].sort() }))
  const blocks = [...held.values()].filter((m) => m.size === 1).map((m) => [...m.values()][0]!).sort((x, y) => x.fields.uuid.localeCompare(y.fields.uuid))
  const texts = [...new Set([...proseOf(a), ...proseOf(b)])].sort()
  const doc: LexicalDoc = lx.doc([...texts.map((t) => JSON.parse(t) as unknown), ...blocks])
  const only = (s: Set<string>, t: Set<string>) => [...s].filter((id) => !t.has(id) && !removed.has(id))
  return { doc, address: foldOf(doc), blocks: blocks.length, fromA: only(A, Bb).length, fromB: only(Bb, A).length, both: [...A].filter((id) => Bb.has(id) && !removed.has(id)).length, removed: removed.size, collisions: collided.length, collided, angles: ANGLES, says: `merged by block address: every block either edit holds and neither removed is kept once; the address folds the content, so the merge commutes and is idempotent; ${collided.length} collision(s) held out` }
}
const proseOf = (d: LexicalDoc) => d.root.children.filter((n) => !(typeof n === 'object' && n !== null && (n as { type?: string }).type === 'block')).map(canonicalTextOf)
/** A document's address: the fold of its blocks' and prose's canonical texts, sorted: its content, not its order. */
export const foldOf = (doc: LexicalDoc): string => uuidOf(canonicalTextOf([...blocksOf(doc).map(canonicalTextOf).sort(), ...[...new Set(proseOf(doc))].sort()]))
type GateDoc = { id: string; title: string; slug: string; path: string; parent: string | null; depth: number; layout: Record<string, unknown>[]; meta: { title: string; description: string }; hero: { type: 'default'; richText: LexicalDoc }; breadcrumbs: { doc: string; url: string; label: string }[] }
/** The gates as the nested page documents the seed creates, parents first: the root, a page per category, a page per gate. */
/** A competition gate knows its competitors as well as the theorems: both in its lexical body (the pages collection the Payload MCP plugin serves). */
const adapterOf = (x: Gate): unknown[] => { const a = gateAdapterOf(x); return [lx.heading('Adapter: a dimension of the one plugin', 'h2'), lx.paragraph([lx.text(`Lands in ${a.lands}. ${a.hook}. Fields: ${a.fields.join(', ')}. Presented as ${a.ui.item} (${a.ui.variant}), styled from the address.`)]), lx.paragraph([lx.text(`REST both ways under RBAC — in: ${a.rest.in}; out: ${a.rest.out}; read ${a.rest.rbac.read}, create ${a.rest.rbac.create}, update ${a.rest.rbac.update}, delete ${a.rest.rbac.delete}; tenant roles ${a.rest.rbac.tenantRoles.join(', ')}.`)]), lx.paragraph([lx.text(`UUID stream of its configs: ${a.stream.configs.map((c) => `${c.kind} ${c.uuid}`).join('; ')}.`)])] }
const knowledgeOf = (x: Gate): unknown[] => { const c = x.category === 'competitions' ? COMPETITIONS.find((k) => k.id === x.id) : undefined; if (!c) return []; const k = knowCompetition(c); return [lx.heading('Competitors, as the page measures them', 'h2'), lx.paragraph([lx.link(c.competitors.source, c.competitors.source), lx.text(` (read ${c.competitors.read}): ${c.competitors.measured}`)]), ...(c.competitors.known.length ? [lx.list(c.competitors.known.map((n) => [lx.text(n)]))] : []), lx.heading(`${k.theorems.length} theorems the tree carries`, 'h2'), lx.list(k.theorems.map((t) => [lx.text(t)]))] }
const gateDocsOf = (ctx: Context, origin: string, devDependencies: Record<string, string> = {}, google: GoogleApis = {}) => {
  const g = gatesOf(ctx, origin, devDependencies, google)
  const theorem = 'textbook_gates_partition'
  const leadOf = new Map(ctx.leads.map((l) => [l.id, l]))
  // a nested page is addressed by its breadcrumb path, the URL the nested-docs plugin joins from the slugs and the fork resolves
  const crumb = (path: string, slug: string, label: string) => ({ doc: slug, url: path, label })
  const root = { slug: gateSlugOf('root'), title: 'Gates' }
  const rootPath = `/${root.slug}`
  const rootCrumb = crumb(rootPath, root.slug, root.title)
  const catSlug = (id: string) => gateSlugOf(`category:${id}`)
  const catPath = (id: string) => `${rootPath}/${catSlug(id)}`
  const gatePath = (x: Gate) => `${catPath(x.category)}/${gateSlugOf(x.id)}`
  const leadItems = (ids: string[]) => lx.list(ids.map((id) => { const l = leadOf.get(id)!; return [lx.text(`${l.id} · ${l.status}${l.tool ? ` · ${l.tool}` : ''}: ${l.statement}`)] }))
  const docs: GateDoc[] = [
    { id: root.slug, title: root.title, slug: `/${root.slug}`, path: rootPath, parent: null, depth: 1, layout: [qpuFieldsOf(root.slug, 'leads', {}, theorem)], meta: { title: 'Gates · @uuidna/qpu', description: g.says }, hero: { type: 'default', richText: lx.doc([lx.heading('Every API is a gate', 'h1'), lx.paragraph([lx.text(`${g.counts.gates} gates in ${g.counts.categories} categories (${g.counts.partition}): ${g.counts.own} doors of this catalogue and ${g.counts.external} addresses outside it; ${g.leads.placed} of ${g.leads.total} leads pass through a gate.`)]), lx.list(g.categories.map((c) => [lx.link(catPath(c.id), c.name), lx.text(`: ${c.gates} gates, ${c.leads} leads — ${c.says}`)]))]) }, breadcrumbs: [rootCrumb] },
    ...g.categories.map((c): GateDoc => { const slug = catSlug(c.id); const mine = g.gates.filter((x) => x.category === c.id); const ids = [...new Set(mine.flatMap((x) => x.leads))]; return { id: slug, title: c.name, slug: `/${slug}`, path: catPath(c.id), parent: `/${root.slug}`, depth: 2, layout: [qpuFieldsOf(slug, 'leads', { ids }, theorem)], meta: { title: `${c.name} · @uuidna/qpu`, description: c.says }, hero: { type: 'default', richText: lx.doc([lx.heading(c.name, 'h1'), lx.paragraph([lx.text(`${c.says}: ${mine.length} gates, ${ids.length} leads.`)]), lx.list(mine.map((x) => [lx.link(gatePath(x), x.name), lx.text(` (${x.kind}, ${x.leads.length} leads)`)]))]) }, breadcrumbs: [rootCrumb, crumb(catPath(c.id), slug, c.name)] } }),
    ...g.gates.map((x): GateDoc => { const slug = gateSlugOf(x.id); const c = g.categories.find((y) => y.id === x.category)!; return { id: slug, title: x.name, slug: `/${slug}`, path: gatePath(x), parent: `/${catSlug(c.id)}`, depth: 3, layout: [qpuFieldsOf(slug, 'leads', { ids: x.leads }, theorem)], meta: { title: `${x.name} · @uuidna/qpu`, description: `${x.kind} gate of ${x.leads.length} leads, passed by ${x.by}${x.measured ? `: ${x.measured}` : ''}` }, hero: { type: 'default', richText: lx.doc([lx.heading(x.name, 'h1'), lx.paragraph([lx.text(`A ${x.kind} gate at `), lx.link(x.url, x.url), lx.text(`, passed by ${x.by}.${x.measured ? ` Measured: ${x.measured}` : ''}`)]), lx.heading(`${x.leads.length} leads pass through it`, 'h2'), ...(x.leads.length ? [leadItems(x.leads)] : [lx.paragraph([lx.text('No lead names this gate yet: the gate itself is the lead.')])]), ...adapterOf(x), ...knowledgeOf(x)]) }, breadcrumbs: [rootCrumb, crumb(catPath(c.id), catSlug(c.id), c.name), crumb(gatePath(x), slug, x.name)] } }),
  ]
  return { ...g, docs }
}

/** The MCP imagined as config sets of widget-skilled tools: a server is nothing but a set of configurations — its tools, each carrying its
 *  widget (the UI resource it renders through) and its skill (the toolbox's instructions and directions), its resources, its examples, its
 *  configuration kinds, its theorems — and every subset (a toolbox, a tenant's mount, the tools with a UI, the examples a theorem backs) is a
 *  config set with a content address: the fold of its sorted members, so two hosts serving the same set share one address (the involution)
 *  and a tenant's mount of the whole server is the same set at every host. Sets compose by union, intersection and difference (inclusion–
 *  exclusion holds by theorem); the server's initialize answer is derived from the whole set, not declared beside it. */
type ConfigSet = { name: string; by: string; size: number; address: string; members: string[] }
/** A set's distinct members, sorted and addressed by their canonical text: a repeat is one member, a newline in one never two. */
const setOf = (members: readonly string[]) => { const m = [...new Set(members)].sort(); return { size: m.length, address: uuidOf(canonicalTextOf(m)), members: m } }
const setsOf = (ctx: Context, names: readonly (string | { name: string; members: readonly string[] })[] = ['legal', 'crypto']) => {
  const tools = listTools(ctx)
  const resources = (ctx.handle({ jsonrpc: '2.0', id: 1, method: 'resources/list' }) as { result: { resources: { uri: string; mimeType: string }[] } }).result.resources
  const live = (ctx.handle({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'sets', version: '0' } } }) as { result: { capabilities: Record<string, unknown> } }).result.capabilities
  const elements = [
    // a tool's address folds its schema, its widget and its skill: the widget-skilled tool is the element
    ...tools.map((t) => ({ id: `tool:${t.name}`, kind: 'tool' as const, address: uuidOf(JSON.stringify({ name: t.name, inputSchema: t.inputSchema, widget: t._meta?.ui?.resourceUri ?? null, skill: t._meta?.skill?.instructions ?? null })) })),
    ...resources.map((r) => ({ id: `resource:${r.uri}`, kind: 'resource' as const, address: uuidOf(`${r.uri}\n${r.mimeType}`) })),
    ...ctx.examples.map((e) => ({ id: `example:${e.id}`, kind: 'example' as const, address: uuidOf(JSON.stringify({ tool: e.tool, arguments: e.arguments })) })),
    ...configKinds.map((k) => ({ id: `config:${k}`, kind: 'config' as const, address: uuidOf(`config:${k}`) })),
    ...TEXTBOOK_THEOREMS.map((t) => ({ id: `theorem:${t.key}`, kind: 'theorem' as const, address: uuidOf(t.lean) })),
  ]
  const set = (name: string, by: string, members: readonly string[]): ConfigSet => ({ name, by, ...setOf(members) })
  const toolboxes = [...new Set(tools.map((t) => t._meta?.toolbox ?? 'none'))]
  const ofBox = (b: string) => { const names = tools.filter((t) => (t._meta?.toolbox ?? 'none') === b).map((t) => t.name); return [...names.map((n) => `tool:${n}`), ...names.map((n) => `resource:ui://qpu/${n}`).filter((id) => elements.some((e) => e.id === id)), ...ctx.examples.filter((e) => names.includes(e.tool)).map((e) => `example:${e.id}`)] }
  const universe = set('mcp', 'the whole server: every element', elements.map((e) => e.id))
  const sets: ConfigSet[] = [
    universe,
    ...toolboxes.map((b) => set(b, 'toolbox: its tools, their UI resources, their examples', ofBox(b))),
    set('tools', 'every door', tools.map((t) => `tool:${t.name}`)),
    set('ui', 'the tools with a widget: a UI resource to render through', tools.filter((t) => t._meta?.ui?.resourceUri).map((t) => `tool:${t.name}`)),
    set('skilled', 'the tools with a skill: a toolbox whose instructions a client follows and whose directions it tests in', tools.filter((t) => t._meta?.skill?.instructions && t._meta.skill.directions > 0).map((t) => `tool:${t.name}`)),
    set('backed', 'the examples a theorem makes true', ctx.examples.filter((e) => e.theorem).map((e) => `example:${e.id}`)),
    set('configs', 'the configuration kinds', configKinds.map((k) => `config:${k}`)),
    ...[...Object.values(TENANTS), 'ceci'].map((t) => set(`mount:${t}`, 'a tenant\'s mount of the server: the whole set, so every mount shares one address', elements.map((e) => e.id))),
  ]
  const byName = new Map(sets.map((x) => [x.name, x]))
  const [a, b] = names.map((n) => (typeof n === 'string' ? byName.get(n) ?? set(n, 'named, empty: no such set', []) : set(n.name, 'given', n.members)))
  const A = new Set(a!.members), B = new Set(b!.members)
  const union = [...new Set([...A, ...B])], intersection = [...A].filter((m) => B.has(m)), difference = [...A].filter((m) => !B.has(m)), symmetric = [...difference, ...[...B].filter((m) => !A.has(m))]
  const algebra = { a: a!.name, b: b!.name, addresses: [a!.address, b!.address], union: set(`${a!.name} ∪ ${b!.name}`, 'union', union), intersection: set(`${a!.name} ∩ ${b!.name}`, 'intersection', intersection), difference: set(`${a!.name} ∖ ${b!.name}`, 'difference', difference), symmetric: set(`${a!.name} △ ${b!.name}`, 'symmetric difference', symmetric), inclusionExclusion: union.length === a!.size + b!.size - intersection.length, leads: diffMembers({ name: a!.name, members: a!.members }, { name: b!.name, members: b!.members }, { config: 'sets' }).leads }
  const mounts = sets.filter((x) => x.name.startsWith('mount:'))
  // the initialize answer derived from the set: tools because the tool set is non-empty, resources and the UI extension because the UI set is
  // the UI extension declares the mime types of the UI resources alone (ui://): the SDK resource is served, not negotiated as an app view
  const derived = { tools: {}, ...(sets.find((x) => x.name === 'ui')!.size ? { resources: {}, extensions: { [MCP_APPS.extension]: { mimeTypes: [...new Set(resources.filter((r) => r.uri.startsWith('ui://')).map((r) => r.mimeType))] } } } : {}) }
  const partition = toolboxes.map((bx) => tools.filter((t) => (t._meta?.toolbox ?? 'none') === bx).length)
  const widgeted = byName.get('ui')!, skilled = byName.get('skilled')!
  const widgetSkilled = { widgeted: widgeted.size, skilled: skilled.size, both: widgeted.members.filter((m) => skilled.members.includes(m)).length, every: widgeted.size === tools.length && skilled.size === tools.length && widgeted.address === skilled.address, says: 'the widgeted set and the skilled set are the tool set itself (one address), so every element of every set is a widget-skilled tool' }
  return {
    elements: { total: elements.length, byKind: Object.fromEntries((['tool', 'resource', 'example', 'config', 'theorem'] as const).map((k) => [k, elements.filter((e) => e.kind === k).length])) },
    sets: sets.map(({ members: _m, ...rest }) => rest), members: Object.fromEntries(sets.map((x) => [x.name, x.members])),
    partition: { by: 'toolbox', sizes: partition, says: `${partition.join(' + ')} = ${tools.length} tools` },
    mounts: { tenants: mounts.map((m) => m.name.slice(6)), oneAddress: new Set(mounts.map((m) => m.address)).size === 1, address: mounts[0]?.address ?? null, says: 'every tenant mounts the same set, so every mount has the same address: the e2e gate decodes the hosts as copies of it' },
    algebra, widgetSkilled,
    initialize: { derived, live, agrees: JSON.stringify(derived) === JSON.stringify(live) },
    sdk: (({ module: _m, ...rest }) => rest)(sdkOf('https://qpu.uuidna.com', tools.map((t) => t.name))),
    says: 'the MCP is its config sets of widget-skilled tools: the server is the set of every element, a toolbox a subset, a mount the whole set at a host; sets are addressed by the fold of their sorted members and composed by union, intersection and difference; the initialize answer follows from the set',
  }
}
const siteOf = (ctx: Context, origin: string, devDependencies: Record<string, string> = {}, google: GoogleApis = {}) => {
  const list = listTools(ctx)
  const boxOf = new Map(list.map((t) => [t.name, t._meta?.toolbox ?? 'none']))
  const heavy = new Set(['audit', 'metrics', 'imagine', 'discover', 'wave', 'readiness', 'e2e', 'textbook', 'clone'])
  // a verified formula: the block's arguments satisfy the tool's own schema (the required keys, the types, the enums), the same contract the qpu
  // block enforces on save — an example whose arguments do not are not emitted into the site (no block comes from an unverified formula)
  const schemaOf = new Map(list.map((t) => [t.name, t.inputSchema as { required?: string[]; properties?: Record<string, { type?: string | string[]; enum?: unknown[] }> }]))
  const verified = (tool: string, args: Record<string, unknown> = {}): boolean => { const s = schemaOf.get(tool); if (!s) return true; if ((s.required ?? []).some((k) => !(k in args))) return false; for (const [k, p] of Object.entries(s.properties ?? {})) { if (!(k in args)) continue; if (!typeOk(args[k], p.type)) return false; if (p.enum && !p.enum.includes(args[k])) return false } return true }
  // the site never lays itself out inside itself: the example that is this very call is skipped (it would replay every example again, inside the first replay)
  const docs = ctx.examples.filter((e) => !heavy.has(e.tool) && !e.arguments.selftest && !(e.tool === 'payload' && (e.arguments.site || e.arguments.hologram)) && verified(e.tool, e.arguments)).map((e) => {
    const r = rpcOf(ctx, e.tool, e.arguments)
    if (!r.result) return { id: e.id, tool: e.tool, toolbox: boxOf.get(e.tool) ?? 'none', error: r.error?.message ?? 'no result' }
    const uuid = r.result._meta.block.meta.id
    const d = payloadDocOf({ uuid, tool: e.tool, arguments: e.arguments, description: e.shows, openGraph: r.result._meta.openGraph, prev: null, chain: [], origin })
    return { id: e.id, tool: e.tool, toolbox: boxOf.get(e.tool) ?? 'none', uuid, url: `${origin}/${uuid}`, title: d.seo.title, description: e.shows, theorem: e.theorem ?? null, arguments: e.arguments, breadcrumbs: d.nestedDocs.breadcrumbs.length, blocks: 1 }
  })
  const useCases = [...new Set(docs.map((d) => d.toolbox))].map((toolbox) => ({ toolbox, pages: docs.filter((d) => d.toolbox === toolbox).length, tools: [...new Set(docs.filter((d) => d.toolbox === toolbox).map((d) => d.tool))] }))
  const gated = gateDocsOf(ctx, origin, devDependencies, google)
  return { reference: { site: 'https://payloadcms.com', contract: 'https://payloadcms.com/api/pages?limit=1&depth=0', shape: 'docs with layout blocks (blockType), meta (title, description), breadcrumbs: the site is what Payload computes; discovery reads it as the standard payload-site' }, origin, useCases: useCases.length, pages: docs.length, byUseCase: useCases, docs, gates: { root: gated.tree.root, categories: gated.counts.categories, gates: gated.counts.gates, pages: gated.docs.length, depth: gated.tree.depth, partition: gated.counts.partition, byKind: gated.counts.byKind, leads: gated.leads, byCategory: gated.categories }, collection: { slug: 'pages', totalDocs: docs.length + gated.docs.length, docs: [...docs.filter((d) => 'uuid' in d).map((d) => ({ id: d.uuid, title: d.title, slug: `/${d.uuid}`, layout: [(() => { const ch = channelOf(String(d.uuid)); return { blockType: 'qpu', tool: d.tool, uuid: d.uuid, handle: ch.handle, program: ch.program.join(''), tail: ch.tail, arguments: (d as { arguments?: Record<string, unknown> }).arguments ?? null, theorem: d.theorem ?? null } })()], meta: { title: d.title, description: d.description }, breadcrumbs: [{ doc: d.uuid, url: `/${d.uuid}`, label: d.title }], path: `/${d.uuid}`, parent: null, depth: 1 })), ...gated.docs] } }
}
/** Payload's skills for agents, read as data from the repository tree (github.com/payloadcms/skills): each skill and each of its references mapped to the tool of this tree that enacts it. No text of the skills is carried: the repository declares no licence; names, paths and sizes are facts. */
const SKILL_MAP: Readonly<Record<string, { enactedBy: readonly string[]; how: string }>> = TABLES.SKILL_MAP as Readonly<Record<string, { enactedBy: readonly string[]; how: string }>>
/** payloadcms.com's own configuration, read at github.com/payloadcms/website (MIT) on 2026-10-25, src/payload.config.ts: the plugins it mounts and the database it runs on — facts, compared with the plugins MCP configures here. */
const PAYLOAD_WEBSITE = TABLES.PAYLOAD_WEBSITE
const camel = (dir: string) => dir.replace(/\.tsx?$/, '').replace(/^[A-Z]/, (c) => c.toLowerCase())
const BLOCK_ALIASES: Readonly<Record<string, string>> = { callToAction: 'cta', mediaContent: 'mediaContent' }
/** The website's source read as a tree: its collections, blocks, globals, fields and plugins by path; with the live page's block types, whether the site agrees with its source. */
const websiteOf = (tree: { tree?: { path: string; type?: string; size?: number }[]; sha?: string; truncated?: boolean }, liveBlockTypes: readonly string[] = []) => {
  const entries = Array.isArray(tree.tree) ? tree.tree : []
  const under = (dir: string) => [...new Set(entries.filter((e) => e.path.startsWith(`${dir}/`)).map((e) => e.path.split('/')[2]!).filter(Boolean))]
  const collections = under('src/collections').map((d) => d.replace(/\.tsx?$/, ''))
  const blocks = under('src/blocks')
  const globals = under('src/globals').map((d) => d.replace(/\.tsx?$/, '')).filter((d) => !/^CustomRowLabel/.test(d))
  const fields = under('src/fields').map((d) => d.replace(/\.tsx?$/, ''))
  const plugins = under('src/plugins').map((d) => d.replace(/\.tsx?$/, ''))
  const blockTypes = blocks.map((b) => BLOCK_ALIASES[camel(b)] ?? camel(b))
  const live = liveBlockTypes.map((t) => ({ blockType: t, inSource: blockTypes.includes(t) }))
  const ours = PAYLOAD_PLUGINS.map((p) => p.name)
  const shared = PAYLOAD_WEBSITE.plugins.filter((p) => ours.includes(p)), onlyHere = ours.filter((p) => !(PAYLOAD_WEBSITE.plugins as readonly string[]).includes(p) && p !== 'lexical')
  return { repository: PAYLOAD_WEBSITE.repository, licence: PAYLOAD_WEBSITE.licence, sha: tree.sha ?? null, entries: entries.length, truncated: !!tree.truncated, collections: collections.length, collectionList: collections, blocks: blocks.length, blockList: blocks, blockTypes, globals: globals.length, globalList: globals, fields: fields.length, fieldList: fields, ownPlugins: plugins, mounted: PAYLOAD_WEBSITE, live, agrees: live.length ? live.every((l) => l.inSource) : null, pluginsShared: shared, pluginsOnlyHere: onlyHere, says: `payloadcms.com is what Payload computes: ${collections.length} collections, ${blocks.length} blocks, ${globals.length} globals and ${fields.length} fields in its source, ${PAYLOAD_WEBSITE.plugins.length} default plugins mounted (${PAYLOAD_WEBSITE.plugins.join(', ')}) on ${PAYLOAD_WEBSITE.database}; of the plugins MCP configures here, ${shared.length} are the site's own and ${onlyHere.length} go beyond it (${onlyHere.join(', ')})${live.length ? `; the live page's block types ${live.every((l) => l.inSource) ? 'all have' : 'do not all have'} a block in the source` : ''}` }
}
const skillsOf = (tree: { tree?: { path: string; type?: string; size?: number }[]; sha?: string; truncated?: boolean }) => {
  const entries = Array.isArray(tree.tree) ? tree.tree : []
  const skills = entries.filter((e) => /\/SKILL\.md$/.test(e.path)).map((e) => { const name = e.path.split('/').slice(-2, -1)[0]!; const dir = e.path.replace(/\/SKILL\.md$/, ''); const references = entries.filter((r) => r.path.startsWith(`${dir}/reference/`) && /\.md$/.test(r.path)).map((r) => { const ref = r.path.split('/').pop()!.replace(/\.md$/, ''); return { reference: ref, path: r.path, bytes: r.size ?? null, ...(SKILL_MAP[ref] ?? { enactedBy: [], how: 'no tool of this tree enacts this reference yet: a lead' }) } }); return { skill: name, path: e.path, bytes: e.size ?? null, ...(SKILL_MAP[name] ?? { enactedBy: [], how: 'no tool of this tree enacts this skill yet: a lead' }), references } })
  const unmapped = skills.flatMap((s) => [...(s.enactedBy.length ? [] : [s.skill]), ...s.references.filter((r) => !r.enactedBy.length).map((r) => r.reference)])
  return { repository: 'https://github.com/payloadcms/skills', sha: tree.sha ?? null, entries: entries.length, truncated: !!tree.truncated, skills: skills.length, references: skills.reduce((n, s) => n + s.references.length, 0), unmapped, catalogue: skills, licence: 'the repository declares no licence: names, paths and sizes are read as facts; no text is carried' }
}
/** The packages Payload ships, read from the packages directory of github.com/payloadcms/payload (the standard payload-packages, read by discovery on every run; names only, 2026-10-26: 45 directories). Every plugin, adapter and editor this tree configures must be one of them. */
const PAYLOAD_PACKAGES = TABLES.PAYLOAD_PACKAGES
const PACKAGE_KIND = (name: string): string => name.startsWith('plugin-') ? 'plugins' : name.startsWith('db-') ? 'databases' : name.startsWith('storage-') ? 'storage' : name.startsWith('email-') ? 'email' : name.startsWith('richtext-') ? 'editors' : name.startsWith('live-preview') ? 'live-preview' : 'runtime-and-tooling'
/** The catalogue classified, what the full stack mounts of it, and the minimum-cost path it offers: Payload's own adapters for Cloudflare D1 and R2. */
const packagesOf = (names: readonly string[] = PAYLOAD_PACKAGES.names) => {
  const byKind: Record<string, string[]> = {}
  for (const n of names) (byKind[PACKAGE_KIND(n)] ??= []).push(n)
  const mounted = [...PAYLOAD_PLUGINS.map((p) => p.pkg.replace('@payloadcms/', '')), 'db-mongodb', 'storage-vercel-blob', 'email-nodemailer', 'plugin-stripe', 'next', 'ui', 'payload', 'graphql']
  const unknown = mounted.filter((m) => !names.includes(m))
  return { repository: PAYLOAD_PACKAGES.repository, read: PAYLOAD_PACKAGES.read, count: names.length, byKind, counts: Object.fromEntries(Object.entries(byKind).map(([k, v]) => [k, v.length])), mounted: mounted.filter((m) => names.includes(m)), unknown, available: names.filter((n) => !mounted.includes(n)), minimumCost: { cloudflare: names.filter((n) => n === 'db-d1-sqlite' || n === 'storage-r2'), says: 'Payload ships its own adapters for Cloudflare D1 and R2, so the app can bind to one provider at its free tiers (D1 5 GB, R2 10 GB) beside the Worker; choosing them is the tenant\'s act — a lead until then' }, says: `${names.length} packages: ${Object.entries(byKind).map(([k, v]) => `${v.length} ${k}`).join(', ')}; ${mounted.filter((m) => names.includes(m)).length} mounted by the full stack${unknown.length ? `; UNKNOWN to Payload: ${unknown.join(', ')}` : ''}` }
}
/** Payload's ecommerce template, read at the source (github.com/payloadcms/payload, templates/ecommerce, 2026-10-26; names and shapes only): the standard payload-ecommerce-template discovery reads on every run. */
const PAYLOAD_ECOMMERCE = TABLES.PAYLOAD_ECOMMERCE
export const QPU_CURRENCIES = [{ code: 'EUR', decimals: 2, label: 'Euro', symbol: '€' }, { code: 'USD', decimals: 2, label: 'US Dollar', symbol: '$' }, { code: 'BGN', decimals: 2, label: 'Bulgarian lev', symbol: 'лв' }] as const
/** The licence catalogue as the ecommerce plugin's products: the API of selling is Payload's config (products, variants, carts, orders, transactions), the Stripe adapter its payment, nothing customised. */
const ecommerceOf = (rates?: Record<string, { rate: number }>) => {
  const products = [...new Set(CATALOGUE.map((v) => v.product))]
  const harmonised = rates && Object.keys(rates).length ? rates : null
  return {
    template: PAYLOAD_ECOMMERCE,
    plugin: { package: '@payloadcms/plugin-ecommerce', version: '3.90.1', collections: PAYLOAD_ECOMMERCE.pluginCollections, customers: 'users (the site\'s own, roles admin | public)', currencies: { defaultCurrency: 'EUR', supportedCurrencies: QPU_CURRENCIES.map((c) => c.code) }, payments: { adapter: 'stripeAdapter', names: ['STRIPE_SECRET_KEY', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'STRIPE_WEBHOOKS_SIGNING_SECRET'] }, access: { isAdmin: 'a user with the admin role', adminOrPublishedStatus: 'admin, or the published status', isDocumentOwner: 'the customer of the document', adminOnlyFieldAccess: 'admin', isCustomer: 'a signed-in user' } },
    catalogue: { products: products.length, variants: CATALOGUE.length, currencies: QPU_CURRENCIES.length, prices: CATALOGUE.length * QPU_CURRENCIES.length, items: CATALOGUE.map((v) => ({ title: `QPU ${v.product.replace(/^qpu-/, '')} · ${v.variant}`, licence: { product: v.product, variant: v.variant, unit: v.unit, interval: v.interval, domains: v.domains }, prices: Object.fromEntries(QPU_CURRENCIES.map((c) => [`priceIn${c.code}`, harmonised ? Math.round((convertAmounts(v.amounts.eur ?? 0, harmonised)[c.code.toLowerCase()] ?? v.amounts[c.code.toLowerCase()] ?? 0)) : v.amounts[c.code.toLowerCase()] ?? 0])) })), units: 'amounts in the currency\'s minor unit (cents, stotinki), as Stripe and the plugin\'s amount field take them', pricedBy: harmonised ? `the harmonised rates the currency step measured (${Object.keys(harmonised).join(', ')}): every price derived from the euro amount` : 'the catalogue\'s own amounts per currency (no harmonised rates passed: the currency step has not run yet)' },
    replaces: 'the fork\'s stripePlugin (plugin-stripe) — the ecommerce plugin\'s Stripe adapter is the payment; the Worker\'s stripe tool and its edge-executed checkout stay until the gate decodes the app beside it',
    seeded: 'src/scripts/seedQpu.ts creates every catalogue item as a product (by title) through the local API',
  }
}
/** The UI as a configuration (MCP Apps, SEP-1865, specification 2026-01-26, read at the source 2026-10-26): one app shell for every tool, a pure
 * function of the key and the theme — no randomness, no clock, no external domain — served as the ui:// resource of each tool and hosted by any
 * host that negotiates the extension; the site's playground hosts the same resource. The widget the tool computes is what the shell renders. */
export const MCP_APPS = TABLES.MCP_APPS
/** The host's standardised theme variables mapped onto the tokens every widget of this tree uses: the widget never changes, the host's theme shows through. A token never maps onto its own name (a self-reference is a cycle the browser drops: measured as serif text in the playground); --font-sans is the host's own and read where it is used. */
const UI_TOKENS = TABLES.UI_TOKENS as unknown as readonly [string, string, string][]
/** The host of an MCP App in React (a client component): reads the tool's ui:// resource over the app's own MCP endpoint, hosts it in a sandboxed frame and speaks the Apps protocol; the same host the site's playground runs in Vue. Served to any shadcn frontend as the registry item qpu-app. */
const reactHostOf = (): string => [
  "'use client'",
  "// The host of an MCP App: the tool's ui:// resource read over the MCP endpoint (resources/read), hosted in a sandboxed frame and spoken to",
  "// through the MCP Apps protocol (ui/initialize → initialized, tool-input, tool-result, size-changed). The UI is built from the MCP; nothing is drawn here.",
  "import React, { useEffect, useRef, useState } from 'react'",
  '',
  '// html: the resource already read by the server (the app reads it from the handler in its own runtime); else it is read over mcp with the key the MCP plugin takes (Authorization: Bearer <payload-mcp-api-keys key>, measured on 3.90.1)',
  'export type QpuAppProps = { tool?: string; args?: Record<string, unknown>; result?: unknown; html?: string; mcp?: string; apiKey?: string }',
  '// no tool: the chat (ui://qpu/chat), as the admin mounts it',
  'export const QpuApp: React.FC<QpuAppProps> = ({ tool = \'chat\', args = {}, result = null, html: given, mcp = \'/api/mcp\', apiKey }) => {',
  '  const frame = useRef<HTMLIFrameElement>(null)',
  "  const [html, setHtml] = useState('') // mounted only once the listener below is registered: the view's ui/initialize must not race the host (measured)",
  '  const [height, setHeight] = useState(120)',
  '  const ready = useRef(false)',
  "  // plain data only: a framework proxy cannot be cloned across the frame, so every message is the JSON of itself",
  "  const post = (m: Record<string, unknown>) => frame.current?.contentWindow?.postMessage(JSON.parse(JSON.stringify({ jsonrpc: '2.0', ...m })), '*')",
  "  // one request with the host's key: the JSON, or a stream's last data line",
  "  const rpc = (id: unknown, method: string, params: unknown) => fetch(mcp, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', ...(apiKey ? { authorization: 'Bearer ' + apiKey } : {}) }, body: JSON.stringify({ jsonrpc: '2.0', id, method, params }) }).then((r) => r.text()).then((t) => JSON.parse((t.split('\\n').filter((l) => l.startsWith('{') || l.startsWith('data: ')).pop() ?? t).replace(/^data: /, '')))",
  "  const tell = () => { if (!ready.current) return; post({ method: 'ui/notifications/tool-input', params: { arguments: args } }); post({ method: 'ui/notifications/tool-result', params: result }) }",
  '  useEffect(() => {',
  '    ready.current = false',
  "    if (given !== undefined) { setTimeout(() => setHtml(given), 0); return }",
  "    rpc(1, 'resources/read', { uri: 'ui://qpu/' + tool }).then((j) => setHtml(j.result?.contents?.[0]?.text ?? '')).catch(() => setHtml(''))",
  '  }, [tool, mcp, given, apiKey])',
  '  useEffect(() => { tell() }, [result])',
  '  useEffect(() => {',
  '    const on = (e: MessageEvent) => {',
  '      if (!frame.current || e.source !== frame.current.contentWindow) return',
  '      const m = e.data ?? {}',
  "      if (m.method === 'ui/initialize') { post({ id: m.id, result: { protocolVersion: '2026-01-26', hostCapabilities: {}, hostContext: { displayMode: 'inline' } } }); return }",
  "      if (m.method === 'ui/notifications/initialized') { ready.current = true; tell(); return }",
  "      if (m.method === 'ui/notifications/size-changed' && typeof m.params?.height === 'number') setHeight(Math.max(40, Math.min(2400, m.params.height + 8)))",
  "      // the view's tools/call (a verification, a chat turn) through the app's MCP with the host's key, no model; a link opened only when https",
  "      if (m.method === 'tools/call' && m.id !== undefined) { rpc(m.id, 'tools/call', m.params).then(post).catch((e) => post({ id: m.id, error: { code: -32603, message: String(e) } })); return }",
  "      if (m.method === 'ui/open-link' && typeof m.params?.url === 'string' && /^https:\\/\\//.test(m.params.url)) { window.open(m.params.url, '_blank', 'noopener'); post({ id: m.id, result: {} }); return }",
  '    }',
  "    window.addEventListener('message', on)",
  "    return () => window.removeEventListener('message', on)",
  '  })',
  "  return <iframe ref={frame} srcDoc={html} sandbox=\"allow-scripts\" title={'qpu · ' + tool} style={{ width: '100%', height, border: '0.5px solid var(--color-border-primary, #e4e4e7)', borderRadius: 8, background: 'transparent' }} />",
  '}',
  '',
].join('\n')
/** The shadcn registry (ui.shadcn.com/schema/registry.json, read 2026-10-26): the host and the block as registry items any shadcn frontend adds with npx shadcn add <url>; written by the configs step to the app's and the site's public/r. */
const STYLED_ITEMS: readonly { name: string; type: 'registry:lib' | 'registry:component' | 'registry:block'; title: string; description: string; file: string; content: string }[] = [
  { name: 'qpu-style', type: 'registry:lib', title: 'QPU style', description: 'styleOf(uuid): the CSS variables of a block computed from its address; nothing loaded', file: 'lib/qpu-style.ts', content: `export const styleOf = (uuid: string) => { const hex = uuid.replace(/-/g, ''); const program = [...hex.slice(8, 20)].filter((_c, i) => i !== 4 && i !== 8).map((c) => parseInt(c, 16)), tail = hex.slice(20); const hue = parseInt(hex.slice(0, 8), 16) % 360; const [c, m, y, k] = [8, 11, 14, 17].map((i) => parseInt(hex.slice(i, i + 3), 16) / 0xfff); const rgb = (v: number) => Math.round(255 * (1 - v) * (1 - k!)); const sat = 40 + (program.reduce((n, d) => n + d, 0) % 40); const radius = 2 + (parseInt(tail.slice(0, 1), 16) % 14), gap = 4 + (parseInt(tail.slice(1, 2), 16) % 12); return { '--qpu-hue': String(hue), '--qpu-accent': \`rgb(\${rgb(c!)} \${rgb(m!)} \${rgb(y!)})\`, '--qpu-surface': \`hsl(\${hue} \${Math.round(sat / 4)}% 97%)\`, '--qpu-ink': \`hsl(\${hue} \${Math.round(sat / 3)}% 14%)\`, '--qpu-radius': \`\${radius}px\`, '--qpu-gap': \`\${gap}px\` } as React.CSSProperties }\n` },
  { name: 'qpu-card', type: 'registry:component', title: 'QPU card', description: 'a card styled by the address it shows', file: 'components/qpu/card.tsx', content: `import React from 'react'\nimport { styleOf } from '@/lib/qpu-style'\nexport const QpuCard: React.FC<{ uuid: string; title: string; children?: React.ReactNode }> = ({ uuid, title, children }) => (\n  <section style={{ ...styleOf(uuid), background: 'var(--qpu-surface)', color: 'var(--qpu-ink)', borderLeft: '3px solid var(--qpu-accent)', borderRadius: 'var(--qpu-radius)', padding: 'var(--qpu-gap)' }} data-uuid={uuid}>\n    <h3 style={{ margin: 0, color: 'var(--qpu-accent)' }}>{title}</h3>\n    {children}\n  </section>\n)\n` },
  { name: 'qpu-badge', type: 'registry:component', title: 'QPU badge', description: 'an address as a badge in its own hue', file: 'components/qpu/badge.tsx', content: `import React from 'react'\nimport { styleOf } from '@/lib/qpu-style'\nexport const QpuBadge: React.FC<{ uuid: string; label?: string }> = ({ uuid, label }) => (\n  <span style={{ ...styleOf(uuid), background: 'var(--qpu-accent)', color: 'white', borderRadius: 'var(--qpu-radius)', padding: '0 var(--qpu-gap)', fontFamily: 'monospace' }} title={uuid}>{label ?? uuid.slice(0, 8)}</span>\n)\n` },
  { name: 'qpu-table', type: 'registry:component', title: 'QPU table', description: 'rows of blocks, each row in the hue of its address', file: 'components/qpu/table.tsx', content: `import React from 'react'\nimport { styleOf } from '@/lib/qpu-style'\nexport const QpuTable: React.FC<{ head: string[]; rows: { uuid: string; cells: React.ReactNode[] }[] }> = ({ head, rows }) => (\n  <table style={{ borderCollapse: 'collapse', width: '100%' }}>\n    <thead><tr>{head.map((h) => <th key={h} style={{ textAlign: 'left', padding: '4px 8px' }}>{h}</th>)}</tr></thead>\n    <tbody>{rows.map((r) => <tr key={r.uuid} style={{ ...styleOf(r.uuid), borderLeft: '3px solid var(--qpu-accent)' }}>{r.cells.map((c, i) => <td key={i} style={{ padding: 'var(--qpu-gap) 8px' }}>{c}</td>)}</tr>)}</tbody>\n  </table>\n)\n` },
  { name: 'qpu-stream', type: 'registry:component', title: 'QPU stream', description: 'the UUID stream (e2e, coins, entropy, receipts): one card per block, styled by its own address, newest first', file: 'components/qpu/stream.tsx', content: `import React from 'react'\nimport { QpuCard } from '@/components/qpu/card'\nimport { QpuBadge } from '@/components/qpu/badge'\nexport const QpuStream: React.FC<{ blocks: { address: string; kind?: string; date?: string; [k: string]: unknown }[] }> = ({ blocks }) => (\n  <div style={{ display: 'grid', gap: 8 }}>\n    {[...blocks].reverse().map((b) => <QpuCard key={b.address} uuid={b.address} title={b.kind ?? 'block'}><QpuBadge uuid={b.address} /> <small>{b.date ?? ''}</small></QpuCard>)}\n  </div>\n)\n` },
  { name: 'qpu-scan', type: 'registry:component', title: 'QPU scan', description: 'the scannable stream of an address: one frame per character at the vortex period, multidimensional (hue, glyph, angle), impossible to link from one frame, read back by a device that streams it (verify { scan })', file: 'components/qpu/scan.tsx', content: `import React from 'react'\nimport { styleOf } from '@/lib/qpu-style'\n/** The stream of an address: the frames the block's own --qpu-frames gradient holds, stepped through at the vortex period (36 frames of 108 ms). A device reads it by streaming: verify { scan: samples }. */\nexport const QpuScan: React.FC<{ uuid: string; phase?: number; label?: string }> = ({ uuid, phase, label }) => (\n  <div className="qpu-scan" role="img" aria-label={label ?? 'a scannable stream: one character a frame'} data-phase={phase === undefined ? undefined : ''} style={{ ...styleOf(uuid), ...(phase === undefined ? {} : { ['--qpu-phase' as string]: String(Math.floor(phase)) }), borderRadius: 'var(--radius, 0.432rem)', minHeight: '3em' }} />\n)\n` },
  { name: 'qpu-dashboard', type: 'registry:block', title: 'QPU dashboard', description: 'a dashboard of the stream: cards of counts by kind, the table of the latest blocks, the stream itself; every bit styled from the addresses', file: 'blocks/qpu-dashboard/page.tsx', content: `import React from 'react'\nimport { QpuCard } from '@/components/qpu/card'\nimport { QpuTable } from '@/components/qpu/table'\nimport { QpuStream } from '@/components/qpu/stream'\nexport default function QpuDashboard({ blocks }: { blocks: { address: string; kind?: string; date?: string }[] }) {\n  const kinds = [...new Set(blocks.map((b) => b.kind ?? 'block'))]\n  return (\n    <main style={{ display: 'grid', gap: 16 }}>\n      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>{kinds.map((k) => { const of = blocks.filter((b) => (b.kind ?? 'block') === k); return <QpuCard key={k} uuid={of[of.length - 1]!.address} title={k}><strong>{of.length}</strong></QpuCard> })}</div>\n      <QpuTable head={['address', 'kind', 'date']} rows={blocks.slice(-20).map((b) => ({ uuid: b.address, cells: [b.address, b.kind ?? 'block', b.date ?? ''] }))} />\n      <QpuStream blocks={blocks} />\n    </main>\n  )\n}\n` },
]
/** The SDK: the config sets as the base of combinatorial application builders — one generated module (a shadcn lib item, nothing loaded but it)
 *  that calls the QPU over MCP, token free at the Worker's /mcp or with a user's API key at the app's /api/mcp, and composes an app from the
 *  sets: the configuration kinds, the set algebra, the app request (form, validation, build), the core (present, stream), the gates and the
 *  realtime channels. Generated by configure { kind: 'sets' }; written to the registry as qpu-sdk. */
export const sdkOf = (origin = 'https://qpu.uuidna.com', tools: readonly string[] = []) => {
  const builders = ['configure(kind, args)', 'sets(a, b)', 'scope(env)', 'app.form()', 'app.validate(values)', 'app.build(request)', 'lexical.doc(tool, args)', 'lexical.app(request)', 'lexical.merge(base, a, b)', 'present(hex)', 'stream(uuids, query)', 'gates()', 'realtime()', 'schema()', 'call(tool, args)', 'collections.find(slug, args)', 'collections.create(slug, data)', 'collections.update(slug, id, data)', 'collections.delete(slug, id)', 'plugins.<name>.collections / find / create / update', 'plugins.compose(names)', 'plugins.list()']
  const module = `// @uuidna/qpu SDK: the config sets as the base of combinatorial application builders. Generated by configure { kind: 'sets' } on the QPU; nothing loaded but this file.
// Token free at the Worker's /mcp (every pure tool); with a user's API key at the app's /api/mcp (the Payload MCP plugin, the collections among its tools).
// Via Payload MCP and vice versa: the plugin serves this module as the resource sdk://qpu/lib, and this module calls the plugin's own collection tools (findPages, createEntries, ...).
export type Call = (name: string, args?: Record<string, unknown>) => Promise<unknown>
const CONFIG_KINDS = ${JSON.stringify([...configKinds])} as const
export const TOOLS = ${JSON.stringify(tools)} as const
/** the installed plugins and the collections each owns: a builder set per plugin */
const PLUGINS = ${JSON.stringify(PLUGIN_COLLECTIONS)} as const
/** the plugins the full stack mounts, ${PAYLOAD_PLUGINS.length} of them: ${2 ** PAYLOAD_PLUGINS.length} combinations */
const PLUGIN_NAMES = ${JSON.stringify(PAYLOAD_PLUGINS.map((p) => p.name))} as const
export const qpu = (origin = ${JSON.stringify(origin)}, apiKey?: string) => {
  const call: Call = async (name, args = {}) => {
    const r = await fetch(origin + (apiKey ? '/api/mcp' : '/mcp'), { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', ...(apiKey ? { authorization: 'users API-Key ' + apiKey } : {}) }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }) })
    const text = await r.text()
    const line = text.split('\\n').find((l) => l.startsWith('data:'))
    const j = JSON.parse(line ? line.slice(5) : text) as { result?: { structuredContent: unknown }; error?: { message: string } }
    if (j.error) throw new Error(j.error.message)
    return j.result?.structuredContent
  }
  return {
    call,
    /** a configuration kind: the sets every app is composed from */
    configure: (kind: (typeof CONFIG_KINDS)[number], args: Record<string, unknown> = {}) => call('configure', { kind, ...args }),
    /** two config sets composed: union, intersection, differences as leads */
    sets: (a: string, b: string) => call('configure', { kind: 'sets', sets: [a, b] }),
    app: {
      form: () => call('payload', { app: { form: true } }),
      validate: (values: Record<string, unknown>) => call('payload', { app: { validate: values } }),
      build: (request: { name: string; host: string; plugins?: string[]; env?: string[]; variant?: string }) => call('payload', { app: request }),
    },
    /** every builder answers in one shape, a lexical document of qpu blocks: a tool's result as one, an app as one block per file, two edits merged by block address */
    lexical: {
      doc: (tool: string, args: Record<string, unknown> = {}) => call('payload', { tool, arguments: args }),
      app: (request: { name: string; host: string; plugins?: string[]; env?: string[]; variant?: string }) => call('payload', { app: request }).then((a) => (a as { doc: unknown }).doc),
      merge: (base: unknown, a: unknown, b: unknown) => call('payload', { merge: { base, a, b } }),
    },
    /** the MCP separated by an environment combination: the adapters and connectors the names choose, the plugins and collections mounted, one address per combination */
    scope: (env: string[] = []) => call('configure', { kind: 'sets', env }),
    /** the one quantum core: any hex presented, any UUID-only stream queried, sorted, filtered, executed */
    present: (hex: string) => call('fold', { hex }),
    stream: (uuids: string[], query: Record<string, unknown> = {}) => call('fold', { uuids, query }),
    gates: () => call('configure', { kind: 'gates' }),
    realtime: () => call('configure', { kind: 'realtime' }),
    schema: () => call('configure', { kind: 'mcp' }),
    /** sdk plugins: every installed plugin as a builder set over the collections it owns, and the combinations of the plugins the stack mounts */
    plugins: {
      list: () => call('configure', { kind: 'payload' }),
      compose: (names: readonly string[]) => ({ names: names.filter((n) => (PLUGIN_NAMES as readonly string[]).includes(n)), combinations: 2 ** names.filter((n) => (PLUGIN_NAMES as readonly string[]).includes(n)).length, collections: names.flatMap((n) => [...(PLUGINS[n as keyof typeof PLUGINS] ?? [])]) }),
      ...Object.fromEntries(Object.entries(PLUGINS).map(([name, slugs]) => [name, { collections: slugs, find: (slug: (typeof slugs)[number], args: Record<string, unknown> = {}) => call(toolNameOf('find', slug), args), create: (slug: (typeof slugs)[number], data: Record<string, unknown>) => call(toolNameOf('create', slug), { data }), update: (slug: (typeof slugs)[number], id: string, data: Record<string, unknown>) => call(toolNameOf('update', slug), { id, data }) }])),
    },
    /** the Payload MCP plugin's own collection tools (find<Slug>, create<Slug>, update<Slug>, delete<Slug>): a user's API key at /api/mcp */
    collections: {
      find: (slug: string, args: Record<string, unknown> = {}) => call(toolNameOf('find', slug), args),
      create: (slug: string, data: Record<string, unknown>) => call(toolNameOf('create', slug), { data }),
      update: (slug: string, id: string, data: Record<string, unknown>) => call(toolNameOf('update', slug), { id, data }),
      delete: (slug: string, id: string) => call(toolNameOf('delete', slug), { id }),
    },
  }
}
/** the plugin names a collection tool by verb and the slug in PascalCase: form-submissions → findFormSubmissions */
const toolNameOf = (verb: 'find' | 'create' | 'update' | 'delete', slug: string): string => verb + slug.split(/[-_]/).map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('')
`
  return { item: 'qpu-sdk', add: `npx shadcn add ${origin}/r/qpu-sdk.json`, builders, kinds: configKinds.length, tools: tools.length, bytes: module.length, module, says: 'the SDK composes an app from the config sets: a builder per set and per core operation, every call a tools/call over MCP, nothing loaded but the module' }
}
export const registryOf = (origin = 'https://qpu.uuidna.com', blockSource = ''): Record<string, unknown> => {
  const sdk = sdkOf(origin), $schema = 'https://ui.shadcn.com/schema/registry-item.json'
  const sdkItem = { $schema, name: 'qpu-sdk', type: 'registry:lib', title: 'QPU SDK', description: 'the config sets as the base of combinatorial application builders: one module that calls the QPU over MCP and composes an app from the sets', files: [{ path: 'lib/qpu-sdk.ts', type: 'registry:lib', content: sdk.module }] }
  const styled = STYLED_ITEMS.map((it) => ({ $schema, name: it.name, type: it.type, title: it.title, description: it.description, registryDependencies: it.name === 'qpu-style' ? [] : [`${origin}/r/qpu-style.json`, ...(it.name === 'qpu-stream' ? [`${origin}/r/qpu-card.json`, `${origin}/r/qpu-badge.json`] : it.name === 'qpu-dashboard' ? [`${origin}/r/qpu-card.json`, `${origin}/r/qpu-table.json`, `${origin}/r/qpu-stream.json`] : [])], files: [{ path: it.file, type: it.type === 'registry:block' ? 'registry:page' : it.type === 'registry:lib' ? 'registry:lib' : 'registry:component', content: it.content, ...(it.type === 'registry:block' ? { target: 'app/qpu/page.tsx' } : {}) }] }))
  const app = { $schema, name: 'qpu-app', type: 'registry:component', title: 'QPU App host', description: 'The host of an MCP App: reads a tool\'s ui://qpu/<tool> resource over the MCP endpoint and hosts it through the MCP Apps protocol in a sandboxed frame.', dependencies: [], registryDependencies: [], files: [{ path: 'components/qpu/app.tsx', type: 'registry:component', content: reactHostOf() }], docs: `import { QpuApp } from '@/components/qpu/app' — <QpuApp tool="processor" args={{ name: 'Willow' }} result={reply.result} mcp="${origin}/mcp" /> (the Worker takes no key); against a Payload app's /api/mcp pass apiKey (a payload-mcp-api-keys key the admin made) or html read by your server`, categories: ['mcp', 'qpu'] }
  const chat = { $schema, name: 'qpu-chat', type: 'registry:component', title: 'QPU chat', description: 'The chat as an MCP App: <QpuApp /> with no tool hosts ui://qpu/chat, every turn a tools/call through the app\'s MCP.', registryDependencies: [`${origin}/r/qpu-app.json`], categories: ['mcp', 'qpu'] }
  const block = { $schema, name: 'qpu-block', type: 'registry:file', title: 'QPU block', description: 'The qpu block of UUID logic for Payload\'s lexical editor: the shape every tools/call result carries in _meta.payload.', dependencies: ['payload'], files: [{ path: 'blocks/qpu/config.ts', type: 'registry:file', target: 'src/blocks/Qpu/config.ts', content: blockSource }], categories: ['payload', 'qpu'] }
  const create = createTheme(KEY, origin, ['qpu-style', 'qpu-block', 'qpu-app', 'qpu-chat', ...STYLED_ITEMS.map((i) => i.name).filter((n) => n !== 'qpu-style')]).item
  // the index lists every item's files by path, type and target; each item serves its content
  const listed = (i: { name: string; files?: readonly { path: string; type: string; target?: string }[] }) => ({ ...i, files: i.files?.map(({ path, type, target }) => ({ path, type, target })) })
  return { 'qpu-create.json': create, 'registry.json': { $schema: 'https://ui.shadcn.com/schema/registry.json', name: 'qpu', homepage: origin, items: [create, sdkItem, ...styled, app, chat, block].map(listed) }, 'qpu-app.json': app, 'qpu-chat.json': chat, 'qpu-block.json': block, 'qpu-sdk.json': sdkItem, ...Object.fromEntries(styled.map((i) => [`${i.name}.json`, i])) }
}
export const uiOf = (tool: string, key: number = KEY): { uri: string; name: string; mimeType: string; html: string; csp: { connectDomains: string[]; resourceDomains: string[] }; prefersBorder: boolean } => {
  const accent = `hsl(${hueOf(key)} 62% 44%)`
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>qpu · ${tool}</title>
<style>
:root { --a432-key: ${key}; --a432-accent: ${accent}; --qpu-coin: ${accent}; --qpu-coil: hsl(${hueOf(key) + key / 9} 62% 44%); ${UI_TOKENS.map(([t, h, d]) => `${t}: var(${h}, ${d});`).join(' ')} }
body { margin: 0; padding: var(--pad-sm); font-family: var(--font-sans, system-ui, sans-serif); color: var(--text-primary); background: transparent; }
.qpu-block { border-left: 3px solid var(--qpu-accent, var(--a432-accent)); padding-left: var(--pad-sm); }
.qpu-args { color: var(--text-muted); font-size: var(--font-size-footnote); margin-bottom: var(--gap-sm); white-space: pre-wrap; }
.qpu-verify { display: flex; flex-direction: column; gap: var(--pad-sm); margin-top: var(--pad-sm); }
.qpu-verify div { display: flex; flex-wrap: wrap; align-items: center; gap: var(--pad-sm); }
.qpu-ask, #view label { display: flex; gap: var(--pad-sm); }
.qpu-ask input { flex: 1; font: inherit; border: thin solid; border-radius: var(--radius); background: none; color: inherit; }
.qpu-verify button, .qpu-ask button { font: inherit; font-size: var(--font-size-footnote); padding: 0 var(--pad-sm); border-radius: var(--radius); border: thin solid var(--qpu-accent, currentColor); background: transparent; color: inherit; cursor: pointer; }
.qpu-verify button:first-child { background: var(--qpu-accent, currentColor); color: var(--surface-1, Canvas); }
.qpu-verify span { font-size: var(--font-size-footnote); }
pre { background: var(--surface-1); border-radius: var(--radius); padding: var(--pad-sm); overflow: auto; font-size: var(--font-size-footnote); }
</style></head>
<body>${tool === 'chat' ? '<div class="qpu-ask"><input id="s" aria-label="problem"><button id="go">Ask</button></div>' : ''}<div id="args" class="qpu-args"></div><div id="view" class="qpu-block" data-tool="${tool}">${tool === 'chat' ? '' : 'waiting for the tool\'s result'}</div>
<script>
(function () {
  // the view of the MCP Apps protocol: JSON-RPC over postMessage; every message the host sends is a notification this shell renders, nothing else runs
  var seq = 0, view = document.getElementById('view'), args = document.getElementById('args'), pending = {}
  var send = function (m) { parent.postMessage(Object.assign({ jsonrpc: '2.0' }, m), '*') }
  // the device's randomness: the phase of the stream's animation at every interaction (eleven bits), the device's own nonce (thirty-two bits), the pointer; the phase set on the root so the CSS continues from it; every 36 samples the seal tool takes them through the host (a coil beyond the first period: the fusion)
  var samples = [], period = ${key * 9}
  document.addEventListener('pointerdown', function (e) { var a = document.getAnimations ? document.getAnimations()[0] : null; var phase = (a && typeof a.currentTime === 'number' ? a.currentTime : performance.now()) % period; var nonce = (self.crypto && crypto.getRandomValues) ? crypto.getRandomValues(new Uint32Array(1))[0] : 0; samples.push({ phase: phase, t: performance.now(), nonce: nonce, x: e.clientX, y: e.clientY }); document.documentElement.style.setProperty('--qpu-phase', String(Math.floor(phase))); if (samples.length % 36 === 0) send({ id: ++seq, method: 'tools/call', params: { name: 'seal', arguments: { text: location.href, entropy: samples.slice(-36) } } }) })
  var size = function () { send({ method: 'ui/notifications/size-changed', params: { height: document.documentElement.scrollHeight } }) }
  var render = function (r, el) {
    var meta = r && r._meta ? r._meta : {}, view = el || document.getElementById('view')
    if (meta.theme) for (var k in meta.theme) view.style.setProperty(k, meta.theme[k])
    view.innerHTML = meta.widget ? meta.widget : '<pre>' + JSON.stringify(r && r.structuredContent !== undefined ? r.structuredContent : r, null, 1).replace(/</g, '&lt;') + '</pre>'
    // a decision verified by its client: every theorem it rests on, asked of the server through the host (tools/call: host to server, no model, no tokens) and its Lean source opened online; text only, never markup
    var sc = r && r.structuredContent, v = sc && (sc.verify || (sc.decision && sc.decision.verify))
    if (v && v.length) { var box = document.createElement('div'); box.className = 'qpu-verify'; v.forEach(function (x) { var row = document.createElement('div'), b = document.createElement('button'), out = document.createElement('span'); b.textContent = 'Verify ' + x.theorem; b.onclick = function () { var id = ++seq; pending[id] = function (m) { var a = m.result && m.result.structuredContent; out.textContent = a ? (a.accepted ? ' accepted by the kernel: ' : ' not in the kernel: ') + (a.statement || a.theorem) : ' ' + JSON.stringify(m.error || m.result) }; out.textContent = ' asking the server'; send({ id: id, method: 'tools/call', params: x.call }) }; row.appendChild(b); if (x.online) { var s = document.createElement('button'); s.textContent = 'Lean source'; s.onclick = function () { send({ id: ++seq, method: 'ui/open-link', params: { url: x.online } }) }; row.appendChild(s) } row.appendChild(out); box.appendChild(row) }); view.appendChild(box) }
    size()
  }
  window.addEventListener('message', function (e) {
    var m = e.data || {}
    if (m.id === 1 && m.result) { send({ method: 'ui/notifications/initialized' }); return }
    if (m.id && pending[m.id]) { pending[m.id](m); delete pending[m.id]; size(); return }
    if (m.method === 'ui/notifications/tool-input') { args.textContent = JSON.stringify(m.params && m.params.arguments); size() }
    if (m.method === 'ui/notifications/tool-result' && m.params) render(m.params)
    if (m.method === 'ui/notifications/tool-cancelled') { view.textContent = 'the call was cancelled'; size() }
  })
  // the chat: each problem a tools/call of the chat door through the host, a question's options radios whose choice re-enters
  var ask = function (s, choice) { var id = ++seq, el = view.insertBefore(document.createElement('div'), view.firstChild); pending[id] = function (m) { var r = m.result || { structuredContent: m.error }, q = r.structuredContent && r.structuredContent.question; render(r, el); if (q) el.append(q.asks), q.options.forEach(function (o) { var l = el.appendChild(document.createElement('label')); l.innerHTML = '<input type=radio name=q' + id + '>'; l.append(o); l.onchange = function () { ask(s, o) } }) }; send({ id: id, method: 'tools/call', params: { name: 'match', arguments: { statement: s, chat: { choice: choice } } } }) }
  // no form: a sandboxed frame without allow-forms never submits one
  var s = document.getElementById('s'), go = function () { if (s.value) ask(s.value); s.value = '' }; if (s) { s.onkeydown = function (e) { if (e.key === 'Enter') go() }; document.getElementById('go').onclick = go }
  send({ id: ++seq, method: 'ui/initialize', params: { appCapabilities: { availableDisplayModes: ['inline'] }, appInfo: { name: 'qpu', version: '${VERSION}' } } })
  new ResizeObserver(size).observe(document.body)
})()
</script></body></html>
`
  return { uri: `ui://qpu/${tool}`, name: `qpu · ${tool}`, mimeType: MCP_APPS.mimeType, html, csp: { connectDomains: [], resourceDomains: [] }, prefersBorder: true }
}
/** Payload's adapters as a matrix over providers and Cloudflare bindings (the packages Payload ships, read at the source): a database, a storage and an email adapter make a combination, the payment adapter rides with the ecommerce plugin, and the RAID's docket (content-addressed entries, four verbs) is the semantics over whichever database answers. */
export const ADAPTERS = TABLES.ADAPTERS
// the adapter combinatorics over whatever records it is given — the baked index or the live Tables rows a Payload hook reads — so the
// count is a function of the records, never a literal; a re-read is 304 by involution
export const combinationsFromAdapters = (a: { database: readonly unknown[]; storage: readonly unknown[]; email: readonly unknown[] }): { dimensions: [number, number, number]; combinations: number } => {
  const dimensions: [number, number, number] = [a.database.length, a.storage.length, a.email.length]
  return { dimensions, combinations: dimensions.reduce((n, d) => n * d, 1) }
}
export const adaptersOf = (env: readonly string[] = []) => {
  const have = new Set(env.map(String))
  const cloudflare = have.has('D1') || have.has('R2') || have.has('QPU_ADAPTERS=cloudflare')
  // the google profile: Cloud SQL (postgres), Cloud Storage and Gmail, Cloud Run the deploy; reached through Google's own MCP servers (sqladmin, run, monitoring)
  const google = !cloudflare && (have.has('GOOGLE_CLOUD_PROJECT') || have.has('GCS_BUCKET') || have.has('QPU_ADAPTERS=google'))
  const choose = <T extends { pkg: string; needs: readonly string[]; binding: string | null }>(list: readonly T[], fallback: T): T => list.find((a) => (a.binding ? cloudflare && have.has(a.binding) : a.needs.every((n) => have.has(n.split(' ')[0]!)))) ?? fallback
  const chosen = google ? { database: ADAPTERS.database.find((a) => a.pkg === 'db-postgres')!, storage: ADAPTERS.storage.find((a) => a.pkg === 'storage-gcs')!, email: ADAPTERS.email[0], payments: ADAPTERS.payments[0] } : { database: choose(ADAPTERS.database, ADAPTERS.database[0]), storage: choose(ADAPTERS.storage, ADAPTERS.storage[0]), email: choose(ADAPTERS.email, ADAPTERS.email[0]), payments: ADAPTERS.payments[0] }
  const { combinations } = combinationsFromAdapters(ADAPTERS)
  // every adapter a Payload plugin by its slug (qpuAdapterPlugins in the generated adapters module mounts those whose package the app installs)
  const plugins = (['database', 'storage', 'email'] as const).flatMap((part) => ADAPTERS[part].map((a) => ({ slug: 'qpu-' + a.pkg, part })))
  return { matrix: ADAPTERS, combinations, plugins, says: `${ADAPTERS.database.length} databases × ${ADAPTERS.storage.length} storages × ${ADAPTERS.email.length} email adapters = ${combinations} combinations; chosen by what the environment names`, profiles: { cloudflare: ['db-d1-sqlite', 'storage-r2', 'email-resend', 'plugin-ecommerce (Stripe over HTTP)'], google: ['db-postgres (Cloud SQL: DATABASE_URI)', 'storage-gcs (GCS_BUCKET, GCS_PROJECT_ID)', 'email-nodemailer (Gmail SMTP: GMAIL_USER, GMAIL_APP_PASSWORD)', 'plugin-ecommerce'], vercel: ['db-mongodb', 'storage-vercel-blob', 'email-nodemailer', 'plugin-ecommerce'], local: ['db-mongodb (the mongod listening)', 'storage-vercel-blob (disabled)', 'email-nodemailer (no key: logged)', 'plugin-ecommerce'] }, chosen: { database: chosen.database.pkg, storage: chosen.storage.pkg, email: chosen.email.pkg, payments: chosen.payments.pkg, profile: cloudflare ? 'cloudflare' : google ? 'google' : have.has('BLOB_READ_WRITE_TOKEN') ? 'vercel' : 'local' }, bindings: ADAPTERS.bindings, raid: ADAPTERS.raid,
    // the connectors dimension: the one /mcp endpoint as a Cloudflare connector and an AI connector at once, chosen by the names the tenant binds (textbook_bindings_named_not_valued)
    connectors: { oauth: have.has('OAUTH_KV') ? 'workers-oauth-provider over OAUTH_KV: OAuth 2.1 with dynamic client registration for the docket roles (reader, writer, admin as scopes), the issuer QPU_OAUTH_ISSUER_<TENANT>, the metadata of RFC 9728 at /.well-known/oauth-protected-resource' : 'the tenant\'s tokens by name (QPU_WRITE_TOKEN_<TENANT>, QPU_ADMIN_TOKEN_<TENANT>); the pure tools need none; /.well-known/oauth-protected-resource names no authorization server', registry: have.has('MCP_PUBLISHER_TOKEN') ? 'server.json (configure { kind: mcp }) published to registry.modelcontextprotocol.io under MCP_PUBLISHER_TOKEN' : 'server.json generated by configure { kind: mcp }; publishing waits for MCP_PUBLISHER_TOKEN to be named: the author\'s act', claude: 'a custom connector today: streamable HTTP at /mcp, no credential for the pure tools, every tool annotated read-only and idempotent; the directory listing is the author\'s act', cloudflare: 'a remote MCP server on Workers today; listed as a connector once the OAuth adapter and the registry entry are named', managedIn: 'Payload, the tenants collection (bindings: profile, connectors, variables): names a tenant admin selects; values the Worker and the app read from their environment by those names' } }
}
/** The app's own wrangler configuration for Cloudflare (OpenNext's layout): every binding the adapters can take, the flags the Worker needs, the service binding to the QPU Worker. */
/** The deploy sets: every template (the Worker, the Payload app over OpenNext, an app generated on request) over every product of the
 *  catalogue, each a wrangler environment deployable by name (npx wrangler deploy --env <use case>) at its own workers.dev name beside the
 *  default deploy (the migration's deploy-beside step; the tenants' custom domains bind to one deploy, the default environment's), with the
 *  bindings the use case needs redeclared (wrangler inherits no binding into an environment) and as usable as direct use: the same tools/list
 *  the handler answers in-process, the same addresses, decoded by the gate's copies. Templates × use cases = sets (textbook_deploy_sets). */
const DEPLOY_TEMPLATES = ['site', 'app'] as const
type DeployTemplate = typeof DEPLOY_TEMPLATES[number]
const DEPLOY_USE_CASES: readonly string[] = [...new Set(CATALOGUE.map((v) => v.product.replace(/^qpu-/, '')))]
const siteBindingsOf = (suffix: string) => ({ d1_databases: [{ binding: 'D1', database_name: `qpu-site${suffix}`, database_id: '<the tenant\'s>' }], r2_buckets: [{ binding: 'R2', bucket_name: `qpu-media${suffix}` }], kv_namespaces: [{ binding: 'KV', id: '<the tenant\'s>' }], services: [{ binding: 'QPU', service: 'qpu' }], ai: { binding: 'AI' } })
export const deploySetOf = (template: DeployTemplate, useCase: string, hosts: readonly string[], name = 'qpu-app') => {
  if (!DEPLOY_TEMPLATES.includes(template)) throw new Error(`no template ${template}; the templates are ${DEPLOY_TEMPLATES.join(', ')}`)
  const variants = CATALOGUE.filter((v) => v.product === `qpu-${useCase}`)
  if (!variants.length) throw new Error(`no use case ${useCase}; the use cases are ${DEPLOY_USE_CASES.join(', ')}`)
  const unit = variants[0]!.unit, metered = variants.some((v) => v.interval === 'metered'), free = variants.every((v) => v.amounts.eur === 0)
  const base = template === 'site' ? 'qpu-site' : name
  const vars = { QPU_USE_CASE: useCase, QPU_PRODUCT: `qpu-${useCase}`, QPU_UNIT: unit, QPU_LICENCE: free ? 'a432: free under attribution' : `covered by the licence (${variants.map((v) => v.variant).join(', ')})`, ...(metered ? { QPU_METER: variants[0]!.variant } : {}), QPU_ADAPTERS: 'cloudflare', QPU_ORIGIN: 'https://qpu.uuidna.com', QPU_TEMPLATE: template }
  const wrangler = { name: `${base}-${useCase}`, workers_dev: true, routes: [] as { pattern: string; custom_domain: boolean }[], vars, ...siteBindingsOf(`-${useCase}`) }
  const file = template === 'site' ? '.qpu-app/wrangler.jsonc' : `${name}/wrangler.jsonc`
  const build = 'npx opennextjs-cloudflare build'
  return {
    template, useCase, unit, metered, free, variants: variants.map((v) => v.variant), env: useCase, file, wrangler,
    bindings: ['ASSETS', 'D1', 'R2', 'KV', 'QPU', 'AI'],
    commands: { build, deploy: `${build} && npx wrangler deploy -c ${file} --env ${useCase}`, dev: `npx wrangler dev -c ${file} --env ${useCase}`, dry: `npx wrangler deploy -c ${file} --env ${useCase} --dry-run` },
    hosts: { set: `${base}-${useCase}.<account>.workers.dev`, default: hosts, says: 'the custom domains bind to one deploy, the default environment\'s; a set answers at its workers.dev name beside it, every address the same' },
    direct: { inProcess: "import { handle } from '@uuidna/qpu/mcp'; handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' })", deployed: `POST https://${base}-${useCase}.<account>.workers.dev/mcp {"jsonrpc":"2.0","id":1,"method":"tools/list"}`, parity: 'the same tools, the same content addresses (ETag by content, 304 by involution); the e2e gate calls every example on every host and decodes the copies by majority, so a set is as usable as direct use exactly when the gate decodes it' },
  }
}
export const deploySetsOf = (hosts: readonly string[]) => ({ templates: DEPLOY_TEMPLATES.length, useCases: DEPLOY_USE_CASES.length, total: DEPLOY_TEMPLATES.length * DEPLOY_USE_CASES.length, theorem: 'textbook_deploy_sets', sets: DEPLOY_TEMPLATES.flatMap((t) => DEPLOY_USE_CASES.map((u) => { const d = deploySetOf(t, u, hosts); return { template: t, useCase: u, name: d.wrangler.name, deploy: d.commands.deploy } })), says: 'every template over every product of the catalogue is a wrangler environment in the template\'s own file: wrangler deploy --env <use case> deploys it beside the default deploy, as usable as direct use' })
const envsOf = (template: DeployTemplate, hosts: readonly string[]) => Object.fromEntries(DEPLOY_USE_CASES.map((u) => [u, deploySetOf(template, u, hosts).wrangler]))
export const siteWranglerOf = () => ({ $schema: 'node_modules/wrangler/config-schema.json', name: 'qpu-site', main: '.open-next/worker.js', compatibility_date: '2026-10-01', compatibility_flags: ['nodejs_compat', WEBCRYPTO_FLAG], assets: { directory: '.open-next/assets', binding: 'ASSETS' }, vars: { QPU_ADAPTERS: 'cloudflare', QPU_ORIGIN: 'https://qpu.uuidna.com' }, ...siteBindingsOf(''), observability: { enabled: true }, env: envsOf('site', Object.keys(TENANTS)) })
/** The scopes of the full stack: every tenant over every scoped collection (the multi-tenant plugin), every role over the docket (the Worker's roles), every toolbox as a scope of the MCP server. More tenants is the whole of scaling: no more code. */
const SCOPES = {
  tenants: [...Object.values(TENANTS), 'ceci'],
  collections: ['pages', 'entries', 'products', 'orders'],
  tenantRoles: TENANT_ROLES,
  superAdmin: 'a user with the admin role has access to every tenant (userHasAccessToAllTenants); every other user acts in the tenants of its tenants array, with the roles the row names',
  firstUser: 'a deploy creates the first user from the deployer\'s account email (FIRST_USER_EMAIL, CLOUDFLARE_EMAIL, or wrangler whoami; the seed), the super admin and tenant-admin of the first tenant, its password unknown to everyone until the admin resets it through the panel\'s forgot-password mail; the users collection\'s beforeChange hook (generated) makes any first user the super admin and names the request host\'s tenant when the caller named none, so the create-first-user form stands only where no account email is known',
  apiKeys: 'every user may hold an API key (auth.useAPIKey) for the REST API; the MCP plugin (3.90.1, measured) takes its own keys from the payload-mcp-api-keys collection an admin makes, each bound to a user, sent as Authorization: Bearer <key>; an anonymous MCP request is refused, so the app reads the ui:// resource in its own server',
  roles: Object.entries(ROLES).map(([role, r]) => ({ role, may: r.may, header: r.header })),
  toolboxes: 'every toolbox is a scope of the MCP server: a client that names a toolbox sees its tools alone (tools/list?toolbox=)',
  scale: 'a tenant is a host in TENANTS and a row of the tenants collection; its scope is its own docket, pages and tokens; adding one adds no code',
} as const
/** The fields of what QPU adds to Payload: the entries collection (the docket) and the qpu block, each with its validation (a function of the value alone). */
export const FIELDS = TABLES.FIELDS
/** The validations as regular expressions the generated collection enforces (Payload validate functions): pure, the same in the app and at the edge. */
/** Every field validation the tree generates, each named by the kernel-accepted theorem that states its arithmetic (the harmonic basis: a pattern
 *  is a count the kernel checks, never a convention); a validation no theorem states is a lead the validations kind reports. The same table
 *  renders the validate function of every generated field (validateOf), with the theorem carried in the field's custom, so the Payload MCP's
 *  getCollectionSchema answers it. */
const VALIDATIONS = TABLES.VALIDATIONS as unknown as readonly { field: string; of: 'entries' | 'qpu' | 'tenants'; pattern: string; says: string; nullable?: boolean; theorem: string | null }[]
/** The validate function of a generated field, rendered from the table: the pattern, the sentence, and the theorem in custom (null when none states it). */
export const validateOf = (of: 'entries' | 'qpu' | 'tenants', field: string): string => {
  const v = VALIDATIONS.find((x) => x.of === of && x.field === field)
  if (!v) throw new Error(`no validation for ${of}.${field}`)
  const re = v.pattern.replace(/\\/g, '\\\\')
  return `validate: (v: unknown) => ${v.nullable ? "(v == null || v === '') || " : ''}/${re}/.test(String(v)) || '${v.says.replace(/'/g, "\\'")}', custom: { theorem: ${v.theorem ? `'${v.theorem}'` : 'null'} }`
}
/** The access of the entries collection by role, the Worker's roles carried into Payload: a reader reads, a writer creates, nothing updates (content-addressed: immutable), an admin deletes. */
/** Abilities after CanCanCan: rules `can action, subject, conditions` over Payload's collections, none by default; manage covers every action,
 *  all every collection, a cannot rule subtracts. Roles after rolify: a name, global, or scoped to a collection (a resource class) or to one
 *  document of it (a resource instance); a global role holds everywhere. The answer is Payload's own access result: true, false, or the Where
 *  that fetches only what the user may (CanCanCan's accessible_by). $user and $tenants in a condition stand for the user's id and tenants; the
 *  role all is held by every user, so its cannot binds every role. */
export type Ability = { role: string; can: readonly string[]; subject: string; where?: Record<string, unknown>; cannot?: boolean }
export type ScopedRole = { name: string; resourceType?: string; resource?: string }
// Payload's Where has no general negation: a cannot with conditions negates field operators only (equals, in, exists)
const NEGATED: Readonly<Record<string, string>> = { equals: 'not_equals', not_equals: 'equals', in: 'not_in', not_in: 'in' }
// not (a and b) is (not a) or (not b): a condition over several fields negates into a disjunction of each negated
const negateWhere = (w: Record<string, unknown>): Record<string, unknown> => { const each = Object.entries(w).map(([field, ops]) => negateField({ [field]: ops })); return each.length === 1 ? each[0]! : { or: each } }
const negateField = (w: Record<string, unknown>): Record<string, unknown> => Object.fromEntries(Object.entries(w).map(([field, ops]) => { if (field === 'and' || field === 'or' || !isObj(ops)) throw new Error(`a cannot condition negates field operators only, not ${field}`); return [field, Object.fromEntries(Object.entries(ops).map(([op, v]) => (op === 'exists' ? [op, !v] : NEGATED[op] ? [NEGATED[op], v] : (() => { throw new Error(`a cannot condition cannot negate ${op}`) })())))] }))
export const getAccess = (abilities: readonly Ability[], roles: readonly ScopedRole[], subject: string, action: string, user: { id?: string | null; tenants?: readonly string[] } = {}): boolean | Record<string, unknown> => {
  const fill = (w?: Record<string, unknown>) => (w ? (JSON.parse(JSON.stringify(w).replace(/"\$(user|tenants)"/g, (_m, k: string) => JSON.stringify(k === 'user' ? (user.id ?? null) : (user.tenants ?? [])))) as Record<string, unknown>) : null)
  // a role held for this subject: everywhere (global), over the collection (its class), or on one document (its instance, an id condition)
  const scopes = (role: string) => (role === 'all' ? [null] : roles.filter((r) => r.name === role && (!r.resourceType || r.resourceType === subject)).map((r) => (r.resourceType && r.resource ? { id: { equals: r.resource } } : null)))
  const rules = (cannot: boolean) => abilities.filter((a) => !!a.cannot === cannot && (a.subject === subject || a.subject === 'all') && (a.can.includes(action) || a.can.includes('manage'))).flatMap((a) => scopes(a.role).map((scope) => [fill(a.where), scope].filter((w): w is Record<string, unknown> => !!w && Object.keys(w).length > 0)))
  const can = rules(false), cannot = rules(true)
  if (!can.length || cannot.some((ws) => ws.length === 0)) return false
  const allowed = can.some((ws) => ws.length === 0) ? null : { or: can.map((ws) => (ws.length === 1 ? ws[0]! : { and: ws })) }, denied = cannot.map((ws) => (ws.length === 1 ? negateWhere(ws[0]!) : { or: ws.map(negateWhere) })) // not (a and b) is (not a) or (not b)
  const all = [...(allowed ? [allowed] : []), ...denied]
  return all.length === 0 ? true : all.length === 1 ? all[0]! : { and: all }
}
/** CanCanCan's can? on one document: the access answer evaluated against it, the Where read as Payload reads it (and, or, dot paths, field
 *  operators), without recursion: a node is decided once its children are. */
export const valueAt = (doc: unknown, path: string): unknown => path.split('.').reduce<unknown>((v, k) => (isObj(v) ? (v as Record<string, unknown>)[k] : undefined), doc)
const fieldHolds = (doc: unknown, field: string, ops: Record<string, unknown>) => Object.entries(ops).every(([op, x]) => { const d = valueAt(doc, field)
  switch (op) { case 'equals': return d === x; case 'not_equals': return d !== x; case 'in': return Array.isArray(x) && x.includes(d); case 'not_in': return Array.isArray(x) && !x.includes(d); case 'exists': return (d !== undefined && d !== null) === Boolean(x); default: throw new Error(`no evaluation of the operator ${op}`) } })
const matchesWhere = (doc: unknown, root: Record<string, unknown>): boolean => {
  const decided = new Map<object, boolean>(), stack: Record<string, unknown>[] = [root]
  while (stack.length) { const n = stack[stack.length - 1]!, kids = Object.entries(n).flatMap(([k, v]) => (k === 'and' || k === 'or' ? (v as Record<string, unknown>[]) : [])), open = kids.filter((c) => !decided.has(c))
    if (open.length) { stack.push(...open); continue } stack.pop()
    decided.set(n, Object.entries(n).every(([k, v]) => (k === 'and' ? (v as object[]).every((c) => decided.get(c)) : k === 'or' ? (v as object[]).some((c) => decided.get(c)) : fieldHolds(doc, k, v as Record<string, unknown>)))) }
  return decided.get(root)!
}
export const checkAccess = (abilities: readonly Ability[], roles: readonly ScopedRole[], subject: string, action: string, doc: unknown, user: { id?: string | null; tenants?: readonly string[] } = {}): boolean => { const a = getAccess(abilities, roles, subject, action, user); return typeof a === 'boolean' ? a : matchesWhere(doc, a) }
/** The Rails guide Active Record Associations, implemented by Payload's own fields: the fields each side of an association carries. belongs_to is a
 *  relationship; has_many a join on the target's relationship back; has_one that join limited to one, the target's relationship unique; :through
 *  a join over the join model's two belongs_to; has_and_belongs_to_many a hasMany relationship with a join as its inverse; polymorphic a
 *  relationship to many collections; a self join a relationship to its own collection; single table inheritance a type select whose subtypes'
 *  fields show by condition; delegated types a polymorphic relationship from the base. Options: dependent, counter_cache and touch as hooks. */
type Field = Record<string, unknown>
export type Association = { type: 'belongs_to' | 'has_one' | 'has_many' | 'has_many_through' | 'has_one_through' | 'has_and_belongs_to_many' | 'polymorphic' | 'self_join' | 'sti' | 'delegated_type'; owner: string; name: string; target?: string; targets?: readonly string[]; through?: string; on?: string; inverse?: string; optional?: boolean; subtypes?: Readonly<Record<string, readonly Field[]>>; dependent?: 'destroy'; counterCache?: string; touch?: boolean }
export const createAssociation = (a: Association) => {
  // the key a has_many or has_one is joined on: Rails' convention, the owner's singular name on the target (authors has_many books: books.author)
  const t = a.target ?? '', on = a.on ?? a.owner.replace(/ies$/, 'y').replace(/s$/, ''), rel = (name: string, to: string | readonly string[], extra: Field = {}): Field => ({ name, type: 'relationship', relationTo: to, ...extra }), join = (name: string, collection: string, by: string, extra: Field = {}): Field => ({ name, type: 'join', collection, on: by, ...extra })
  const sides: { owner: Field[]; target?: Field[]; through?: Field[] } =
    a.type === 'belongs_to' ? { owner: [rel(a.name, t, { required: !a.optional, index: true })] }
    : a.type === 'has_one' ? { owner: [join(a.name, t, on, { defaultLimit: 1 })], target: [rel(on, a.owner, { unique: true, index: true })] }
    : a.type === 'has_many' ? { owner: [join(a.name, t, on)], target: [rel(on, a.owner, { index: true })] }
    : a.type === 'has_many_through' || a.type === 'has_one_through' ? { owner: [join(a.name, a.through ?? '', on, a.type === 'has_one_through' ? { defaultLimit: 1 } : {})], through: [rel(on, a.owner, { required: true, index: true }), rel(a.inverse ?? t, t, { required: true, index: true })] }
    : a.type === 'has_and_belongs_to_many' ? { owner: [rel(a.name, t, { hasMany: true })], target: [join(a.inverse ?? a.owner, a.owner, a.name)] }
    : a.type === 'polymorphic' ? { owner: [rel(a.name, a.targets ?? [])] }
    : a.type === 'self_join' ? { owner: [rel(a.name, a.owner, { hasMany: true }), join(a.inverse ?? `${a.name}By`, a.owner, a.name)] }
    : a.type === 'sti' ? { owner: [{ name: a.name, type: 'select', required: true, options: Object.keys(a.subtypes ?? {}) }, ...Object.entries(a.subtypes ?? {}).flatMap(([sub, fs]) => fs.map((f) => ({ ...f, admin: { condition: `(data) => data?.${a.name} === '${sub}'` } })))] }
    : { owner: [rel(a.name, a.targets ?? [], { required: true })], target: (a.targets ?? []).map((x) => join(a.inverse ?? a.owner, a.owner, a.name)) }
  // the association options as Payload hooks, their source for the generator to write
  const hooks = [...(a.dependent === 'destroy' ? [{ on: a.owner, hook: 'afterDelete', source: `async ({ doc, req }) => { await req.payload.delete({ collection: '${t}', where: { ${on}: { equals: doc.id } }, req }) }` }] : []), ...(a.counterCache ? [{ on: t || a.owner, hook: 'afterChange', source: `async ({ doc, req }) => { const parent = doc.${on}; if (parent) await req.payload.update({ collection: '${a.owner}', id: typeof parent === 'object' ? parent.id : parent, data: { ${a.counterCache}: (await req.payload.count({ collection: '${t}', where: { ${on}: { equals: typeof parent === 'object' ? parent.id : parent } }, req })).totalDocs }, req }) }` }] : []), ...(a.touch ? [{ on: t || a.owner, hook: 'afterChange', source: `async ({ doc, req }) => { const parent = doc.${on}; if (parent) await req.payload.update({ collection: '${a.owner}', id: typeof parent === 'object' ? parent.id : parent, data: {}, req }) }` }] : [])]
  return { phase: 'association' as const, rails: a.type, ...sides, hooks, theorem: 'textbook_association_fields' }
}
/** The Rails guide Active Record Validations, implemented by Payload's own field options where Payload has one (required, unique, minLength,
 *  maxLength, min, max, options), else by a validate function whose source the generator writes: a string is the error message, true passes.
 *  :allow_nil and :allow_blank pass an empty value, :on names the operation, :if and :unless read the sibling data, :message replaces the text. */
export type Validation = { name: string; helper: 'absence' | 'acceptance' | 'confirmation' | 'comparison' | 'format' | 'inclusion' | 'exclusion' | 'length' | 'numericality' | 'presence' | 'uniqueness' | 'validates_associated' | 'validates_each' | 'validates_with'; options?: { with?: string; in?: readonly (string | number)[]; minimum?: number; maximum?: number; is?: number; onlyInteger?: boolean; greaterThan?: number | string; lessThan?: number | string; allowNil?: boolean; allowBlank?: boolean; message?: string; on?: 'create' | 'update'; if?: string; unless?: string; validator?: string } }
export const createValidation = (v: Validation) => {
  const o = v.options ?? {}, say = (m: string) => JSON.stringify(o.message ?? `${v.name} ${m}`), field: Field = {}
  const test: string | null =
    v.helper === 'presence' ? (field.required = true, null)
    : v.helper === 'uniqueness' ? (field.unique = true, field.index = true, null)
    : v.helper === 'validates_associated' ? null // Payload refuses a relationship to a document that is not there
    : v.helper === 'length' && o.is === undefined ? (o.minimum !== undefined && (field.minLength = o.minimum), o.maximum !== undefined && (field.maxLength = o.maximum), null)
    : v.helper === 'inclusion' && !o.message ? (field.options = o.in ?? [], null)
    : v.helper === 'absence' ? `(value == null || value === '') || ${say('must be blank')}`
    : v.helper === 'acceptance' ? `value === true || ${say('must be accepted')}`
    : v.helper === 'confirmation' ? `value === siblingData?.${v.name}Confirmation || ${say('doesn\'t match confirmation')}`
    : v.helper === 'comparison' ? `(${o.greaterThan !== undefined ? `value > ${typeof o.greaterThan === 'string' ? `siblingData?.${o.greaterThan}` : o.greaterThan}` : 'true'} && ${o.lessThan !== undefined ? `value < ${typeof o.lessThan === 'string' ? `siblingData?.${o.lessThan}` : o.lessThan}` : 'true'}) || ${say('is out of comparison')}`
    : v.helper === 'format' ? `new RegExp(${JSON.stringify(o.with ?? '.*')}).test(String(value ?? '')) || ${say('is invalid')}`
    : v.helper === 'inclusion' ? `${JSON.stringify(o.in ?? [])}.includes(value) || ${say('is not included in the list')}`
    : v.helper === 'exclusion' ? `!${JSON.stringify(o.in ?? [])}.includes(value) || ${say('is reserved')}`
    : v.helper === 'length' ? `String(value ?? '').length === ${o.is} || ${say(`is the wrong length (should be ${o.is} characters)`)}`
    : v.helper === 'numericality' ? (field.type = 'number', o.minimum !== undefined && (field.min = o.minimum), o.maximum !== undefined && (field.max = o.maximum), o.onlyInteger ? `Number.isInteger(value) || ${say('must be an integer')}` : null)
    : `(${o.validator ?? '() => true'})(value, siblingData)` // validates_each and validates_with: the tenant's own validator
  // the options wrap the test: empty values pass when allowed, the operation and the condition decide whether it runs
  const guards = [...(o.allowNil || o.allowBlank ? [`value == null${o.allowBlank ? ` || value === ''` : ''}`] : []), ...(o.on ? [`operation !== '${o.on}'`] : []), ...(o.if ? [`!(${o.if})`] : []), ...(o.unless ? [`(${o.unless})`] : [])]
  const validate = test ? `(value, { siblingData, operation }) => ${guards.length ? `(${guards.join(' || ')}) || ` : ''}(${test})` : null
  return { phase: 'validation' as const, rails: v.helper, field: { name: v.name, ...field }, validate, theorem: 'textbook_validation_helpers' }
}
/** Roles from Google Workspace: the groups the Admin SDK's Directory API lists for a user (groups.list by userKey, through the one Google door),
 *  each mapped by the tenant's table onto a scoped role; a group the table does not name grants nothing. Without the groups, the call to ask. */
export const listRolesFromGroups = (mapping: readonly (ScopedRole & { group: string })[], groups?: readonly { email?: string }[], userKey?: string) =>
  groups ? { phase: 'roles' as const, roles: groups.flatMap((g) => mapping.filter((r) => r.group === g.email).map(({ group: _g, ...role }) => role)) }
    : { phase: 'plan' as const, googleCall: { api: 'admin', version: 'directory_v1', method: 'groups.list', params: { userKey: userKey ?? '' } }, scope: 'admin.directory.group.readonly', says: 'ask the Directory API through payload { googleCall }, under a Workspace admin\'s domain-wide delegation, and hand the groups back' }

/** The read groups and the per-collection access, read from Payload: groups after Google's data classes — what everyone reads stays outside them;
 *  an operational kind (machine, chat, penalty, session, call, message) is read by its tenant and admins; google-user-data by its grantor (Limited Use). */
export const ACCESS = TABLES.ACCESS
/** The Entries read, computed from the groups: a kind outside them read by everyone, each group's kinds by its readers. */
const readClause = () => {
  const q = (xs: readonly string[]) => JSON.stringify(xs).replace(/"/g, "'").replace(/,/g, ', '), gs = Object.values(ACCESS.groups), by = (r: string) => gs.filter((g) => g.readers === r).flatMap((g) => g.kinds)
  return `({ or: [{ kind: { not_in: ${q(gs.flatMap((g) => g.kinds))} } }, { and: [{ kind: { in: ${q(by('tenant'))} } }, { tenant: { in: tenantsOf(req.user) } }] }, { and: [{ kind: { in: ${q(by('grantor'))} } }, { or: [{ from: { equals: String((req.user as { id?: unknown } | null)?.id ?? '') } }, { tenant: { in: tenantsWithRole(req.user, ['tenant-admin']) } }] }] }] } as Where)`
}
/** The actions at quantum scale: a batch is one JSON-RPC array answered as one array; Payload\'s bulk REST by where; a batch above the quantum is sharded (the shard tool\'s theorems) and the shards run as one wave; the experience the gate measured decides the shard size. */
const actionsOf = (experience?: { copies?: number; involutions?: number; msByHost?: Record<string, number> }) => {
  const free = experience?.copies ? Math.round(((experience.involutions ?? 0) / experience.copies) * 100) : null
  const slowest = experience?.msByHost ? Math.max(...Object.values(experience.msByHost)) : null
  // the shard size from the measured experience: a wave should answer within one second of the slowest host's median, so a batch is sharded until each shard's share does
  const shardSize = slowest ? Math.max(1, Math.floor(1000 / slowest)) : 8
  return {
    batch: { mcp: 'POST /mcp with a JSON-RPC array: every call answered in the same array, in order, one request (the handler maps the array)', rest: ['PATCH /api/entries?where[kind][equals]=<kind> (bulk update by where: refused for entries, immutable)', 'DELETE /api/entries?where[from][equals]=<device> (bulk delete, admin)', 'POST /api/entries (one create; a batch is one MCP array of raid calls)'] },
    quantum: { shard: 'a batch above the quantum is split by the shard tool: item k to shard k mod n (every item shared, no overlap)', waves: 'shards run at once as one wave, the outputs merged in order; the next step is teleported the blocks already computed', coordinated: 'input and output are coordinated by address: a call\'s output block is the next call\'s input by uuid, so a batch is a chain of addresses the balancer answers without recomputing' },
    experience: { measured: experience ?? null, freeShare: free, slowestMedianMs: slowest, shardSize, says: experience ? `${free}% of the gate\'s copies answered free (304 by involution); the slowest host answers in ${slowest} ms, so a batch is sharded to ${shardSize} calls a shard to stay within a second` : 'no measurement passed: the defaults stand (8 calls a shard)' },
  }
}
/** The Payload hooks the full stack carries, each with what it does and what it keeps free: a hook is configuration too, improved on every run. */
/** The organisation of the generated files is decided by role, never typed by hand: a role fixes the folder, the case of the name and the
 *  extension (Payload's own layout under the fork's aliases) and says what loads the file — the computational reason for its place: a block
 *  config, a collection and a global load with the Payload config (server only); a config module is imported by payload.config.ts, one per
 *  concern; a component is reachable by the Pages Router too, so it imports no next/headers and no @payload-config; a script runs under
 *  payload run; a notice is never compiled. textbook_fullstack_files_by_role partitions the fifteen files over the eight roles. */
export const FILE_ROLES = TABLES.FILE_ROLES
type FileRole = keyof typeof FILE_ROLES
const pascalOf = (t: string) => t.replace(/(^|[-_ ])([a-z])/g, (_m, _s, c: string) => c.toUpperCase())
const camelOf = (t: string) => { const p = pascalOf(t); return p.slice(0, 1).toLowerCase() + p.slice(1) }
/** The path of a generated file from its role and key alone. */
// the default payloadcms/website app directory the overlay is generated into (the deploy clones the template here); site/ is removed
export const APP_DIR = '.qpu-app'
export const fileOf = (role: FileRole, key: string): string => {
  const base = [APP_DIR, FILE_ROLES[role].folder].filter(Boolean).join('/')
  switch (role) {
    case 'block': return `${base}/${pascalOf(key)}/config.ts`
    case 'config': return `${base}/payload.qpu.${key.toLowerCase()}.ts`
    case 'notice': return `${base}/${key.toUpperCase()}.qpu.md`
    case 'collection': case 'global': return `${base}/${pascalOf(key)}.ts`
    case 'hooks': return `${base}/${key.toLowerCase()}.qpu.hooks.ts`
    case 'component': return `${base}/${key}.tsx`
    case 'graphic': return `${base}/${pascalOf(key)}/index.tsx`
    case 'script': case 'plugin': return `${base}/${camelOf(key)}.ts`
    case 'root': return `${base}/${key.toLowerCase()}.config.ts`
    case 'migration': return `${base}/${key}.ts`
  }
}
/** The witness hooks: the pairs, the Hooks pages ("<where> <hook>") against the declared hooks, a config's finds, a change pair over two states */
const hooksOf = (h: { pages?: { title: string }[]; config?: Record<string, any>; states?: unknown[]; referrer?: string }) => {
  const { pairs } = qpuHooksOf({}), run = qpuHooksOf({ collections: [{}] }).config.collections[0].hooks, c: Record<string, any> = { referrer: h.referrer }, titles = (h.pages ?? []).map((p) => p.title)
  const declared = Object.entries(pairs).flatMap(([w, ps]) => ps.flatMap((p) => [p.before, p.after].filter(Boolean).map((hook) => `${w} ${hook}`)))
  run.beforeChange[0]({ data: h.states?.[0] ?? null, context: c }); run.afterChange.at(-1)({ doc: h.states?.[1] ?? null, context: c })
  return { pairs, witnesses: declared.length, pages: h.pages ? { declared: declared.length, paged: declared.filter((d) => titles.includes(d)).length, missing: declared.filter((d) => !titles.includes(d)), extra: titles.filter((x) => /^(collection|global|field|node) /.test(x) && !declared.includes(x)) } : null, found: h.config ? qpuHooksOf(h.config).found : null, pair: c.qpuWitness['collection::change'] }
}
/** Every provider the full stack binds to, its bindings and variable NAMES (values never travel), and where its cost sits. */
const BINDINGS: readonly { provider: string; role: string; bindings: string[]; names: string[]; freeTier: string; paidFor: string; keptFree: string }[] = [
  { provider: 'cloudflare', role: 'the Worker and the docket (until the gate decodes the Payload app beside them)', bindings: ['ASSETS (static site)', 'DOCKET (Durable Object, SQLite)', `compatibility_flags [${WEBCRYPTO_FLAG}]`], names: ['QPU_WRITE_TOKEN_<TENANT>', 'QPU_ADMIN_TOKEN_<TENANT>', 'QPU_DATA_KEY', 'QPU_SIGNING_KEY_<TENANT>', 'QPU_MCP_HOSTS_<TENANT>'], freeTier: '100k requests a day, static assets free', paidFor: 'requests beyond the tier, Durable Object requests and storage', keptFree: 'ETag involutions answer 304 without a body; a block computed once is teleported, never recomputed' },
  { provider: 'google-cloud', role: 'the app on Cloud Run with Cloud SQL, Cloud Storage and Gmail (the adapters profile google), reached through Google\'s own MCP servers (run, sqladmin, monitoring)', bindings: ['Cloud Run service', 'Cloud SQL instance (postgres)', 'Cloud Storage bucket', 'Gmail SMTP'], names: ['GOOGLE_CLOUD_PROJECT', 'GOOGLE_APPLICATION_CREDENTIALS', 'GCS_BUCKET', 'GCS_PROJECT_ID', 'DATABASE_URI', 'GMAIL_USER', 'GMAIL_APP_PASSWORD'], freeTier: 'Cloud Run 2 million requests a month, Cloud Storage 5 GB, Gmail 500 mails a day; Cloud SQL has no free tier', paidFor: 'the Cloud SQL instance, egress, requests beyond the free tier', keptFree: 'reads by address through the docket; the involutions answer 304 before Cloud Run runs' },
  { provider: 'news', role: 'the public news APIs as adapters of the DOI research: the open ones need no name; the keyed ones the tenant names, never values', bindings: ['the news gates (open and keyed)'], names: ['NEWSAPI_KEY', 'GUARDIAN_API_KEY', 'NYT_API_KEY'], freeTier: 'GDELT, Hacker News, Crossref Event Data and Wikipedia free without a key; NewsAPI, The Guardian and The New York Times free developer keys', paidFor: 'nothing in the open tier', keptFree: 'the open four answer every run; a keyed one answers when named' },
  { provider: 'energy', role: 'the energy and IoT sectors the bill links to: the tariff per kilowatt-hour the tenant names, the market-price gates it opens with its key (ENTSO-E transparency platform, the EIA open data), every IoT reading a docket entry billed per device', bindings: ['the docket entries of kind reading (IoT)', 'the energy gates (keyed)'], names: ['ENERGY_TARIFF_EUR_PER_KWH_<TENANT>', 'ENTSOE_API_TOKEN', 'EIA_API_KEY'], freeTier: 'ENTSO-E and EIA free with a registered key; the tariff is a number the tenant names', paidFor: 'nothing: the bill prices the joules the computations moved at the tariff', keptFree: 'the involutions move no bits: a 304 costs no joule' },
  { provider: 'connectors', role: 'the QPU as a Cloudflare connector and an AI connector at once, over the one /mcp endpoint: OAuth 2.1 for the docket roles (the protected-resource metadata of RFC 9728 at /.well-known/oauth-protected-resource, dynamic client registration), the MCP registry entry (server.json from configure { kind: mcp }), the directories; every binding a name a tenant admin selects in Payload (tenants.bindings), never a value', bindings: ['OAUTH_KV (KV namespace: the OAuth provider\'s clients, grants and tokens)', 'the /.well-known/oauth-protected-resource document, served by the Worker from the names'], names: ['QPU_OAUTH_ISSUER_<TENANT>', 'QPU_OAUTH_CLIENT_ID_<TENANT>', 'QPU_OAUTH_CLIENT_SECRET_<TENANT>', 'MCP_PUBLISHER_TOKEN'], freeTier: 'KV 100k reads and 1k writes a day; the registry and the directories free', paidFor: 'KV beyond the tier', keptFree: 'the pure tools need no token, so no OAuth round trip precedes them; only the docket roles are scoped, and a 304 by involution needs no scope at all' },
  { provider: 'mongodb-atlas', role: 'the database behind Payload (the docket over the mongo language)', bindings: ['DATABASE_URI (mongooseAdapter)'], names: ['DATABASE_URI'], freeTier: 'M0 shared cluster, 512 MB', paidFor: 'storage and operations beyond M0', keptFree: 'content-addressed entries are written once; reads come from the app\'s cache by tag' },
  { provider: 'vercel', role: 'the Payload app (Next.js) and blob storage', bindings: ['BLOB_READ_WRITE_TOKEN (vercelBlobStorage)', 'NEXT_PRIVATE_REVALIDATION_KEY', 'NEXT_PRIVATE_DRAFT_SECRET'], names: ['PAYLOAD_SECRET', 'BLOB_READ_WRITE_TOKEN', 'BLOB_STORAGE_ENABLED', 'BLOB_STORE_ID', 'NEXT_PUBLIC_SITE_URL', 'NEXT_PRIVATE_REVALIDATION_KEY', 'NEXT_PRIVATE_DRAFT_SECRET', 'QPU_ORIGIN'], freeTier: 'hobby: serverless functions, 100 GB bandwidth, blob 1 GB', paidFor: 'function invocations and bandwidth beyond hobby', keptFree: 'tags revalidate one page per change; UUID pages are immutable and cached forever' },
  { provider: 'stripe', role: 'the licence checkout per tenant (the Worker) and the ecommerce plugin\'s payment (the app)', bindings: ['ecommercePlugin: stripeAdapter'], names: ['STRIPE_SECRET_KEY_<TENANT>', 'STRIPE_WEBHOOK_SECRET_<TENANT>', 'STRIPE_SECRET_KEY', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'STRIPE_WEBHOOKS_SIGNING_SECRET'], freeTier: 'no fee without a payment', paidFor: 'a fee per successful payment', keptFree: 'a plan is computed here; Stripe is asked only at checkout' },
  { provider: 'payload-mcp', role: 'the handler\'s tools served by @payloadcms/plugin-mcp', bindings: ['mcpPlugin (server qpu)'], names: ['PAYLOAD_MCP_API_KEY'], freeTier: 'the app\'s own compute', paidFor: 'nothing beyond the app', keptFree: 'tools/call is pure: the same arguments answer the same address' },
  { provider: 'anthropic', role: 'the operator agent that mounts the QPU through the MCP connector (only when named)', bindings: ['mcp_servers + mcp_toolset'], names: ['ANTHROPIC_API_KEY'], freeTier: 'none', paidFor: 'tokens of every request', keptFree: 'never called by the tree; the registration is computed, the request is the operator\'s' },
]
/** The repository's home and code owner, for the policies and the MCP registry entry */
const REPOSITORY = { home: 'https://github.com/uuidna/qpu', owner: '@ceccec' } as const
/** Every configuration's file in the tree and who is its source: the tool (written on every run, drift zero by construction) or the hand (measured on every run, drift a lead). */
export const CONFIG_FILES: readonly { kind: ConfigKind; path: string; source: 'tool' | 'hand'; format: 'jsonc' | 'json' | 'text' | 'ts'; /** files the hand-held one spreads into itself: measured as one text */ with?: readonly string[] }[] = [
  { kind: 'wrangler', path: 'wrangler.jsonc', source: 'tool', format: 'jsonc' },
  { kind: 'pwa', path: 'docs/public/manifest.webmanifest', source: 'tool', format: 'json' },
  { kind: 'policies', path: 'SECURITY.md', source: 'tool', format: 'text' },
  { kind: 'fullstack', path: '.qpu-app/', source: 'tool', format: 'text' },
  { kind: 'bindings', path: '.qpu-app/.env.qpu.example', source: 'tool', format: 'text' },
  { kind: 'ui', path: '.qpu-app/public/r/', source: 'tool', format: 'text' },
  { kind: 'adapters', path: '.qpu-app/wrangler.jsonc', source: 'tool', format: 'jsonc' },
  { kind: 'payload', path: '.qpu-app/src/payload.config.ts', source: 'hand', format: 'ts', with: [fileOf('plugin', 'qpu'), fileOf('config', 'config'), fileOf('config', 'ecommerce'), fileOf('config', 'adapters')] },
  { kind: 'hooks', path: fileOf('plugin', 'qpu'), source: 'tool', format: 'ts' },
  { kind: 'api', path: '.qpu-app/next.config.js', source: 'hand', format: 'ts' },
]
/** The drift of a hand-held TypeScript file against the configuration MCP computes: what the file should mount or call and does not. */
const heldDriftOf = (kind: ConfigKind, text: string): string[] => {
  // the plugin must be mounted last: it hooks the collections the other plugins create (form-submissions), so a plugin called after it is drift
  if (kind === 'payload') return [...(/autoLogin\s*:/.test(text) ? ['admin.autoLogin'] : []), ...(/\.\.\.qpuAdapterPlugins\(\)/.test(text) && /qpuPlugin\(\{[^}]*adapters:\s*'auto'/.test(text) ? ['adapters.qpuAdapterPlugins.twice'] : []), ...(/\bqpuPlugin\(/.test(text) ? [] : ['plugins.qpuPlugin']), ...((() => { const at = text.indexOf('qpuPlugin('); if (at < 0) return []; const tail = text.slice(at + 10); const end = tail.indexOf(']'); return /\b[a-zA-Z]+Plugin\(/.test(end < 0 ? tail : tail.slice(0, end)) ? ['plugins.qpuPlugin.last'] : [] })()), ...['qpuDb', 'qpuEmail', 'qpuAdapterPlugins'].filter((fn) => !(fn === 'qpuAdapterPlugins' && /qpuPlugin\(\{[^}]*adapters:\s*'auto'/.test(text)) && !new RegExp(`\\b${fn}\\(`).test(text)).map((fn) => `adapters.${fn}`), ...(/process\.env\.PAYLOAD_SECRET/.test(text) ? [] : ['env.PAYLOAD_SECRET'])]
  if (kind === 'hooks') return [] // the hooks are the plugin's (tool-sourced): nothing held by hand, nothing to drift
  if (kind === 'api') return [...['/api/globals/qpu', '/api/mcp', '/api/entries/:uuid'].filter((d) => !text.includes(d)).map((d) => `rewrite.${d}`), ...(text.includes("'/api/qpu'") ? ['custom-endpoint./api/qpu'] : [])]
  if (kind === 'bindings') return BINDINGS.flatMap((b) => b.names.filter((n) => !n.includes('<TENANT>') && b.provider !== 'anthropic' && b.provider !== 'cloudflare' && !text.includes(n)).map((n) => `${b.provider}.${n}`))
  return []
}
/** The environment example for the app: every name the bindings need, its provider and role, never a value. */
const envExampleOf = (): string => ['# @uuidna/qpu: the names the full stack binds to, by provider (values never travel; set them in the provider\'s dashboard or .env)', '# GENERATED by npm run next through configure { kind: \'bindings\' }; edit src/quantum/processing/toolboxes/payload.ts (BINDINGS), never this file.', '', ...BINDINGS.flatMap((b) => [`# ${b.provider}: ${b.role}`, `#   free: ${b.freeTier}; paid for: ${b.paidFor}; kept free: ${b.keptFree}`, ...b.names.map((n) => (n.includes('<TENANT>') ? [...Object.values(TENANTS), 'ceci'].map((t) => `${n.replace('<TENANT>', t.toUpperCase())}=`) : [`${n}=`])).flat(), ''])].join('\n')
/** Realtime editing through the channels Payload streams, collisions by content address (textbook_edit_collides: two edits share their base or
 *  collide); what each channel carries and signals is the Hooks › Realtime page in Payload */
const REALTIME = {
  streams: ['document lock', 'live preview', 'autosave', 'versions', 'form validation', 'MCP stream'].map((channel) => ({ channel })),
  collisions: { precondition: 'If-Match (REST), context.prev (local), editBase (MCP)', hook: fileOf('hooks', 'pages'), theorem: 'textbook_edit_collides' },
  held: { file: fileOf('plugin', 'qpu'), must: ['lockDocuments', 'versions.drafts.autosave', 'hooks.beforeChange: collisionGuard', 'editBase (virtual, hidden)'] },
} as const
/** Via the Payload MCP plugin is mandatory: the default collections of the installed plugins (nothing added) are served by the plugin's own tools,
 *  scoped by the multi-tenant plugin and authorised by a user's API key, each with the capabilities a client may use. The intelligence of
 *  combinatorics is to fit any environment without hacking it: a request is a form submission, a bundle a media file, a licence a product,
 *  a tenant's configuration its tenants document; what the stack holds beyond the defaults is a refactoring lead. */
const PLUGIN_DEFAULT_COLLECTIONS: readonly string[] = ['pages', 'posts', 'media', 'users', 'forms', 'form-submissions', 'search', 'redirects', 'tenants', 'products', 'variants', 'carts', 'orders', 'transactions', 'addresses', 'payload-mcp-api-keys']
type McpCollection = { description: string; enabled: { find: boolean; create: boolean; update: boolean; delete: boolean }; /** scoped to the tenant by the multi-tenant plugin */ scoped: boolean; /** what the collection's own access filters for a client */ filter: string; /** relationship fields → the collections they point at */ relations: Record<string, string>; /** select fields → their options */ enums: Record<string, readonly string[]>; /** the hooks the QPU plugin puts on it */ hooks: readonly string[] }
/** Every scope can find and none can delete: only create and update differ from one collection to the next. */
const findAnd = (create: boolean, update: boolean) => ({ find: true, create, update, delete: false })
const MCP_COLLECTIONS: Readonly<Record<string, McpCollection>> = {
  pages: { description: 'the site\'s pages: the use cases and the gates (the competition gates carry the competitors and the theorems), each a qpu block; edits carry editBase (the collision precondition)', enabled: findAnd(true, true) , scoped: true, filter: 'published pages to everyone, drafts to users of the tenant', relations: { parent: 'pages (nested docs)', tenant: 'tenants', 'layout.qpu': 'a block: tool + arguments, the entries it writes' }, enums: { _status: ['draft', 'published'], 'hero.type': ['default', 'contentMedia', 'centeredContent', 'form', 'home', 'livestream', 'gradient', 'three'] }, hooks: ['collisionGuard (beforeChange)', 'lockDocuments', 'autosave', 'editBase'] },
  forms: { description: 'the forms: "Request an app" among them', enabled: findAnd(true, false) , scoped: false, filter: 'every form to everyone', relations: {}, enums: { confirmationType: ['message', 'redirect'], 'fields.blockType': ['text', 'textarea', 'select', 'email', 'number', 'checkbox', 'country', 'state', 'message', 'payment'] }, hooks: [] },
  'form-submissions': { description: 'a submission of "Request an app" generates the app (the bundle into media, the licence at the checkout)', enabled: findAnd(true, false) , scoped: false, filter: 'a client creates; users read', relations: { form: 'forms' }, enums: {}, hooks: ['appRequest (afterChange): a submission of Request an app generates the app into media'] },
  media: { description: 'the uploads: a generated app is a JSON file here (every file with its address, the bundle address, the price, the order)', enabled: findAnd(false, false) , scoped: false, filter: 'every upload to everyone', relations: {}, enums: {}, hooks: [] },
  products: { description: 'the licence catalogue as products of the ecommerce plugin', enabled: findAnd(false, false) , scoped: true, filter: 'published products to everyone', relations: { tenant: 'tenants', variants: 'variants' }, enums: { _status: ['draft', 'published'] }, hooks: [] },
  carts: { description: 'the carts of the ecommerce plugin: a licence product put in one is bought at its checkout', enabled: findAnd(true, true) , scoped: false, filter: 'a customer\'s own cart', relations: { customer: 'users', 'items.product': 'products', 'items.variant': 'variants' }, enums: { currency: QPU_CURRENCIES.map((c) => c.code) }, hooks: [] },
  orders: { description: 'the orders the checkout wrote', enabled: findAnd(false, false) , scoped: true, filter: 'a customer\'s own orders; a tenant\'s to its admins', relations: { customer: 'users', tenant: 'tenants', 'items.product': 'products', transactions: 'transactions' }, enums: { status: ['processing', 'completed', 'cancelled', 'refunded'] }, hooks: [] },
  tenants: { description: 'the tenants by host; settings are the plugin options a tenant configures (merged into every qpu block call under its hosts)', enabled: findAnd(false, true) , scoped: false, filter: 'every tenant to everyone; written by a super admin', relations: {}, enums: { currency: QPU_CURRENCIES.map((c) => c.code) }, hooks: [] },
  entries: { description: 'the docket: content-addressed entries (calls, licences, signals, messages); immutable — the editors\' channel: a message or a signal is an entry created here, read by find where from = page:<slug>', enabled: findAnd(true, false) , scoped: true, filter: 'every entry to everyone; created by a writer', relations: { tenant: 'tenants', links: 'entries', linkedBy: 'entries' }, enums: { kind: ['call', 'licence', 'signal', 'message'] }, hooks: ['beforeValidate: the content address and, for a call, the tool\'s reply'] },
  posts: { description: 'the site\'s posts', enabled: findAnd(true, true) , scoped: false, filter: 'published posts to everyone', relations: { authors: 'users' }, enums: { _status: ['draft', 'published'] }, hooks: [] },
  search: { description: 'the search plugin\'s index', enabled: findAnd(false, false) , scoped: false, filter: 'the index to everyone', relations: { 'doc.value': 'pages | posts' }, enums: { 'doc.relationTo': ['pages', 'posts'] }, hooks: [] },
  redirects: { description: 'the redirects plugin\'s rules', enabled: findAnd(false, false) , scoped: false, filter: 'every rule to everyone', relations: { 'to.reference': 'pages | posts | case-studies' }, enums: { 'to.type': ['reference', 'custom'] }, hooks: [] },
  variants: { description: 'the ecommerce plugin\'s variants', enabled: findAnd(false, false) , scoped: false, filter: 'with their products', relations: { product: 'products' }, enums: {}, hooks: [] },
  transactions: { description: 'the ecommerce plugin\'s transactions: the payment ledger', enabled: findAnd(false, false) , scoped: false, filter: 'a customer\'s own; a tenant\'s to its admins', relations: { customer: 'users', order: 'orders' }, enums: { status: ['pending', 'succeeded', 'failed', 'cancelled', 'refunded'] }, hooks: [] },
  addresses: { description: 'the ecommerce plugin\'s addresses', enabled: findAnd(false, false) , scoped: false, filter: 'a customer\'s own', relations: { customer: 'users' }, enums: {}, hooks: [] },
  users: { description: 'the users: who edits; keys never travel', enabled: findAnd(false, false) , scoped: false, filter: 'self, or an admin', relations: { 'tenants.tenant': 'tenants' }, enums: { roles: Object.keys(ROLES), 'tenants.roles': [...TENANT_ROLES] }, hooks: ['firstUserBootstrap (beforeChange)', 'useAPIKey'] }
}
/** Which installed plugin owns which served collection: the SDK's plugin builders follow it (the QPU plugin owns the docket). */
const PLUGIN_COLLECTIONS = TABLES.PLUGIN_COLLECTIONS as unknown as Readonly<Record<string, readonly string[]>>
/** The MCP plugin\'s own secrets collection: never served, by design. */
const MCP_UNSERVED: readonly { collection: string; why: string }[] = [{ collection: 'payload-mcp-api-keys', why: 'the MCP plugin\'s own API keys: secrets never travel' }]
const hookNames = () => Object.values(qpuHooksOf({}).pairs as Record<string, { before?: string; after?: string }[]>).flat().flatMap((p) => [p.before, p.after].filter(Boolean)).length
type ConfigKind = typeof configKinds[number]
/** The torus of a configuration: its address, seed and reflection, and whether the loop closes (config → text → config at the same address). */
const torusOf = (config: unknown) => {
  const text = JSON.stringify(config)
  const address = uuidOf(text)
  const seed = digitalRoot(parseInt(address.slice(-2), 16) || 1)
  const back = JSON.stringify(JSON.parse(text))
  return { address, seed, reflection: 10 - seed, trinity: trinityFor(seed), closed: uuidOf(back) === address, bytes: text.length }
}
const varsOf = (tenant: string) => {
  const T = tenant.toUpperCase()
  const hostVar = (h: string) => `QPU_MCP_TOKEN_${h.toUpperCase().replace(/[.-]/g, '_')}_${T}`
  return {
    tenant,
    secrets: [`QPU_WRITE_TOKEN_${T}`, `QPU_ADMIN_TOKEN_${T}`, `STRIPE_SECRET_KEY_${T}`, `STRIPE_WEBHOOK_SECRET_${T}`, `QPU_OAUTH_CLIENT_SECRET_${T}`, ...CLOUDFLARE_MCP.filter((c) => c.host !== 'docs.mcp.cloudflare.com').map((c) => hostVar(c.host))],
    vars: [`QPU_MCP_HOSTS_${T}`, `QPU_OAUTH_ISSUER_${T}`, `QPU_OAUTH_CLIENT_ID_${T}`],
    shared: ['QPU_DATA_KEY', 'QPU_RBAC_MCP', 'QPU_RBAC_TOOL', 'MCP_PUBLISHER_TOKEN'],
    // the tenant's bindings as the Payload admin holds them (tenants.bindings): the defaults here, the tenant admin's selection there; names only
    bindings: { profile: 'cloudflare', connectors: ['claude', 'cloudflare'], variables: [`QPU_OAUTH_ISSUER_${T}`, `QPU_OAUTH_CLIENT_ID_${T}`, `QPU_OAUTH_CLIENT_SECRET_${T}`, 'MCP_PUBLISHER_TOKEN'], managedIn: 'the tenants collection of the Payload admin' },
    note: 'names only: the operator sets the values as wrangler secrets; a tool never reads or carries a value',
  }
}
/** The next version, defined by development, kept as low as the architecture allows: every component is one digit (0–9); a
 *  patch never moves the number (the change lives in the content address: build metadata +fold); a tool new carries the
 *  minor digit, and at 10 the major; a tool gone carries the major; the major past 9 returns to 1 with the epoch counted in
 *  the build metadata — so the lifespan of every single-digit combination is infinite: within a version, every state is an
 *  address, and the number changes only when the catalogue changes shape. */
export const buildOf = (toolsNow: readonly string[]): string => uuidOf(`catalogue${toolsNow.join(',')}`).slice(0, 8)
const nextVersionOf = (current: string, toolsNow: readonly string[], lastTag: { version: string; tools: readonly string[]; epoch?: number }): { next: string; bump: 'major' | 'minor' | 'none'; epoch: number; build: string; added: string[]; removed: string[]; digits: 'single' } => {
  const added = toolsNow.filter((t) => !lastTag.tools.includes(t)), removed = lastTag.tools.filter((t) => !toolsNow.includes(t))
  const bump = removed.length ? 'major' : added.length ? 'minor' : 'none'
  const [ma, mi] = lastTag.version.replace(/^v/, '').split('.').map((n) => Number(n) || 0) as [number, number]
  let epoch = lastTag.epoch ?? 1
  let major = ma, minor = mi
  if (bump === 'minor') { minor += 1; if (minor > 9) { minor = 0; major += 1 } }
  if (bump === 'major') { major += 1; minor = 0 }
  if (major > 9) { major = 1; epoch += 1 }
  const build = uuidOf(`catalogue${toolsNow.join(',')}`).slice(0, 8)
  const next = bump === 'none' ? `${ma}.${mi}.0` : `${major}.${minor}.0`
  void current
  return { next: `${next}+e${epoch}.${build}`, bump, epoch, build, added, removed, digits: 'single' }
}
const configOf = (kind: ConfigKind, ctx: Context, p: { version?: string; description?: string; google?: GoogleApis; lastTag?: { version: string; tools: readonly string[] }; experience?: { copies?: number; involutions?: number; msByHost?: Record<string, number> }; rates?: Record<string, { rate: number }>; env?: readonly string[]; sets?: readonly (string | { name: string; members: readonly string[] })[]; hex?: string; stream?: readonly string[]; query?: StreamQuery; devDependencies?: Record<string, string>; branding?: BrandingInput; port?: number | boolean } = {}) => {
  const hosts = Object.keys(TENANTS)
  switch (kind) {
    case 'payload': return { collections: [{ slug: 'pages', fields: ['lexical', 'tenant'], note: 'the plugins\' own collection; the fields are the plugins\'' }], plugins: PAYLOAD_PLUGINS.map((p) => ({ [p.name]: { package: p.pkg, ...p.options } })), combinations: 2 ** PAYLOAD_PLUGINS.length, combinationNote: 'every subset of the plugins is a configuration; the dashboard of this tool enumerates them by address' }
    case 'wrangler': return siteWranglerOf()
    case 'tenant': return { tenants: [...Object.values(TENANTS), 'ceci'].map(varsOf), records: Object.entries(TENANTS).reduce<Record<string, { name: string; slug: string; domains: { domain: string }[]; currency: string }>>((acc, [host, t]) => ({ ...acc, [t]: { name: t, slug: t, domains: [...(acc[t]?.domains ?? []), { domain: host }], currency: TENANT_CURRENCY[t] ?? 'EUR' } }), {}), mcpHostsDefault: DEFAULT_MCP_HOSTS }
    // the repository's policies, none hand-written (Scorecard Security-Policy, Code-Review, Dependency-Update-Tool)
    case 'policies': { const made = (c: string) => `${c} Generated by configure { kind: 'policies' }; never edit by hand.`; return { files: {
      'SECURITY.md': `<!--${made('')} -->\n# Security policy\n\nReport a vulnerability privately, through GitHub's private vulnerability reporting at ${REPOSITORY.home}/security/advisories/new. Don't open a public issue for it.\n\nOnly the latest release receives security fixes.\n`,
      'CONTRIBUTING.md': `<!--${made('')} -->\n# Contributing\n\nOpen an issue at ${REPOSITORY.home}/issues before you start a change, so that it can be agreed first. Report a vulnerability as SECURITY.md describes.\n\nEvery change passes the repository's git hooks: its message is a Google CL description and its hand-written code doesn't grow. The licence is in LICENSE.\n`,
      '.github/CODEOWNERS': `${made('#')}\n* ${REPOSITORY.owner}\n`,
      '.github/dependabot.yml': `${made('#')}\nversion: 2\nupdates:\n${[['npm', '/'], ['npm', '/site'], ['github-actions', '/']].map(([e, d]) => `  - package-ecosystem: ${e}\n    directory: ${d}\n    schedule:\n      interval: weekly\n`).join('')}`,
    } } }
    case 'pwa': { const accent = `hsl(${hueOf(KEY)} 62% 44%)`; return { name: '@uuidna/qpu', short_name: 'qpu', description: p.description ?? '', id: '/', start_url: '/', scope: '/', display: 'standalone', orientation: 'any', background_color: '#0b0b0f', theme_color: accent, lang: 'en', dir: 'ltr', categories: ['developer', 'education', 'productivity'], icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }, { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' }], shortcuts: [{ name: 'Every tool laid out', url: '/' + uuidOf('dashboard{}'), description: 'the dashboard index: every tool with the size of its space' }, { name: 'Examples', url: '/examples' }, { name: 'Stream', url: '/stream' }, { name: 'Readiness', url: '/readiness' }], related_applications: [], prefer_related_applications: false, license: 'CC-BY-NC-ND-4.0', version: p.version ?? null } }
    case 'versions': {
      const tools = listTools(ctx).map((t) => t.name)
      const open = ctx.leads.filter((l) => l.status === 'open' || l.status === 'partial')
      return {
        current: VERSION, source: 'package.json, injected at generation into src/quantum/version.ts; the Worker names it on every reply (X-Qpu-Version) and in its discovery document',
        // development defines the version: the next number follows what the catalogue changed since the last tag the repository tool read
        lifespan: 'infinite by architecture: every component a single digit, a patch never moves the number (the change is its content address, carried as build metadata), a tool new carries the minor digit and at 10 the major, the major past 9 returns to 1 with the epoch counted; within a version every state is an address',
        next: p.lastTag ? nextVersionOf(VERSION, tools, p.lastTag) : null, nextNeeds: p.lastTag ? null : 'lastTag { version, tools }: the last tag and the tools it served, from the repository tool\'s watch; without it the next number is not guessed',
        // the version defines development: the leads open at it are its plan, each settled lead a step of the next version
        defines: { openLeads: open.length, byStatus: { open: open.filter((l) => l.status === 'open').length, partial: open.filter((l) => l.status === 'partial').length }, plan: open.map((l) => l.id) },
        // Payload's versioning over the RAID: every version of a document is an entry addressed by its content, prev the earlier version, never overwritten; drafts are commitments, published the reveal; no cap on versions per document
        payload: { collections: { pages: { versions: { drafts: { autosave: true }, maxPerDoc: 0 } } }, overRaid: 'a version is a docket entry (fold address + SHA-256), its prev the earlier version; both answer by address, so a reader on either version reads whole; a draft is a commitment entry, publishing reveals it into the same address' },
        quantum: 'versions coexist: every block and page is addressed by content, the service worker keeps a shell per version, the ETag is the content hash, so an earlier version\'s addresses answer beside the new one\'s and nothing is invalidated by a release',
        // the state the version represents, and the approval a push needs: the package at this version answers this build on initialize (serverInfo.build) and in its discovery document, the hosts online answer theirs in X-Qpu-Version and the gate decodes them as copies; the version is the last tag or its one next step, never a skipped number
        state: { build: buildOf(tools), represents: `${VERSION}+${buildOf(tools)}`, inPackage: 'initialize answers serverInfo.build, the same function over the same tools/list', online: 'the e2e gate reads every host\'s version (X-Qpu-Version) and decodes the hosts as copies: a host on the previous version is the migration law, not a violation' },
        sequential: (() => { const bumped = p.lastTag ? nextVersionOf(VERSION, tools, p.lastTag).next.split('+')[0]! : null; const violation = p.lastTag && VERSION !== p.lastTag.version && VERSION !== bumped ? `the version ${VERSION} is neither the last tag ${p.lastTag.version} nor its one next step ${bumped}: a versioning violation, red before a push` : null; return { lastTag: p.lastTag?.version ?? null, bumped, violation, approved: p.lastTag ? !violation : null } })(),
        release: { when: 'nothing to carry: leads { carry: true } answers zero leads carried (every lead converted to a Payload document), then the next sequential version is published', approval: 'a push is approved when the version is the last tag or its one next step and the build it names is the catalogue\'s address; next --strict goes red otherwise (textbook_carry_release)' },
      }
    }
    case 'migration': return {
      uptime: '100 %: no address is moved, so no reader waits',
      providers: [...hosts.map((h) => `https://${h}/mcp`), 'https://qpu.ceci.workers.dev/mcp'],
      addProvider: 'deploy the same Worker at the new provider; name its endpoint among the gate\'s hosts (QPU_E2E_HOSTS) and among the tenant\'s MCP hosts; the docket mirrors heal by address; the gate decodes old and new as copies of one value',
      steps: [
        { step: 1, name: 'deploy beside', does: 'the new version is deployed beside the old one; both answer every address (content addressing, ETag by content, a shell per version in the service worker)' },
        { step: 2, name: 'mirror', does: 'the docket of each tenant is mirrored to the new provider by address; a missing entry heals from any mirror' },
        { step: 3, name: 'decode', does: 'the e2e gate calls every combination on old and new hosts and decodes them as copies of one logical value; the migration is finished when every combination agrees and no erasure remains; a flip is a lead, never a cut-over' },
        { step: 4, name: 'route', does: 'the custom domains point at the new provider; the old one keeps answering until the gate has agreed once more from the new route' },
        { step: 5, name: 'rollback', does: 'the earlier version\'s addresses still answer: routing back is the whole rollback' },
      ],
      measuredBy: 'the e2e gate: versions per host, outcomes per combination, erasures per host; uptime is whole while every combination agrees',
    }
    case 'api': {
      // the API overview, as platform.claude.com/docs/en/api/overview is one for the Claude API: every surface of this tree, from the handler and the Worker, as data a page is written from
      const list = listTools(ctx)
      const origin = 'https://qpu.uuidna.com'
      const apiHosts = [...hosts.map((h) => `https://${h}`), 'https://qpu.ceci.workers.dev']
      // the standard contract, and the tree's own reading of it: the discover step's detector over the document, as over any host's
      const openapi = createOpenapi(origin, list, apiHosts)
      const standard = detect({ status: 200, type: 'application/json', text: JSON.stringify(openapi) })
      return {
        name: '@uuidna/qpu', version: VERSION, origin, hosts: apiHosts,
        architecture: 'Everything goes through one MCP endpoint: POST /mcp takes JSON-RPC 2.0 (initialize, tools/list, tools/call); every tools/call result is a block addressed by its content, and every other surface serves or carries blocks. No hardware, no network inside the tools, nothing factored beyond N ≤ 21.',
        endpoints: API_ENDPOINTS,
        openapi, standard: { ...standard, says: 'the same detector discovery runs over every host, run over this tree\'s own contract: a host that publishes no machine-readable contract is a lead, so the tree publishes its own' },
        headers: { request: ['content-type: application/json', 'accept: application/json or text/event-stream', 'if-none-match: "<content hash>" — a 304 answers with no body when the block is the one held', 'authorization: Bearer <tenant token> (the docket\'s writes only)'], response: ['etag: the content hash of the result (the clock masked)', 'x-qpu-address: the block address (uuidOf(tool + arguments))', 'x-qpu-version', 'cache-control: public, max-age=31536000, immutable on addressed replies', 'link: <https://uuidna.com/license>; rel="license"'] },
        authorization: { pure: 'every tool answers without a credential: the tools are pure functions of their arguments', docket: 'roles reader, writer, admin per tenant: the RBAC MCP host first (QPU_RBAC_MCP, QPU_RBAC_TOOL), else the tenant\'s tokens by name; a token at another tenant\'s host holds no role there', never: 'no key, token or secret travels through a tool; the client sends them, the tools name them' },
        contentAddressing: { address: 'uuidOf(tool + JSON(arguments)): the same arguments at any host give the same address', hash: 'the content hash of the result with the clock masked: the same code gives the same hash at any host', involution: 'a request naming the hash with If-None-Match is answered 304: the analog is verified digitally at the destination, nothing computed or sent', versions: 'versions coexist: an earlier version\'s addresses answer beside the new one\'s' },
        payloadApp: { principle: 'the app\'s API is built from Payload\'s config, nothing customised or bypassed: collections, a global, hooks, access and the MCP plugin', rest: [{ method: 'POST', path: '/api/entries', takes: '{ kind: call, from, body: { tool, arguments }, tenant: <tenant id> } with Authorization: users API-Key <key> of a user of that tenant (measured: the multi-tenant plugin strips the tenant from an anonymous request, so a call over REST is a user\'s; the app\'s own page calls through the local API without a user)', answers: 'the entry with result (content, structuredContent, _meta with the widget): the hook computes the tool\'s reply; the id is the content address of the call, so the same call is the same entry; every entry belongs to a tenant (the multi-tenant plugin requires it; the app\'s page resolves the tenant from the host)', auth: 'a user of the tenant (API key or session); the page alone calls anonymously through the local API' }, { method: 'GET', path: '/api/entries/<address>', takes: 'the address of a call or an entry', answers: 'the entry, cached by its tag: free', auth: 'none' }, { method: 'GET', path: '/api/entries?where[kind][equals]=call', takes: 'Payload\'s where', answers: 'the calls made: the docket\'s own query language', auth: 'none' }, { method: 'DELETE', path: '/api/entries?where[from][equals]=<device>', takes: 'Payload\'s where', answers: 'bulk delete', auth: 'admin' }, { method: 'GET', path: '/api/globals/qpu', takes: 'nothing', answers: 'the discovery document, computed by the global\'s afterRead hook', auth: 'none' }, { method: 'POST', path: '/api/mcp', takes: 'JSON-RPC: the MCP plugin', answers: 'a door per collection and verb, and the catalogue\'s tools', auth: 'the plugin\'s API key for writes' }], rewrites: { '/mcp': '/api/mcp', '/.well-known/qpu.json': '/api/globals/qpu', '/<uuid> (accept json)': '/api/entries/<uuid>' } },
        tools: list.map((t) => ({ name: t.name, toolbox: t._meta?.toolbox ?? 'none', description: t.description })),
        toolboxes: [...new Set(list.map((t) => t._meta?.toolbox ?? 'none'))],
        mcpConnector: { claude: { endpoint: CLAUDE_API.messages, betas: [CLAUDE_API.mcpConnector.beta], mcp_servers: [{ type: 'url', url: `${origin}/mcp`, name: 'qpu' }], tools: [{ type: 'mcp_toolset', mcp_server_name: 'qpu' }] }, any: { mcpServers: { qpu: { url: `${origin}/mcp` } } } },
        quickTests: [
          { says: 'list the tools', curl: `curl -s ${origin}/mcp -X POST -H 'content-type: application/json' -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'` },
          { says: 'the Clay register read by reflection', curl: `curl -s ${origin}/mcp -X POST -H 'content-type: application/json' -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"clay","arguments":{"technique":"reflection"}}}'` },
          { says: 'the involution: ask with the hash and receive 304', curl: `curl -si ${origin}/mcp -X POST -H 'content-type: application/json' -H 'if-none-match: "<etag of the reply above>"' -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"clay","arguments":{"technique":"reflection"}}}'` },
          { says: 'the discovery document', curl: `curl -s ${origin}/.well-known/qpu.json` },
        ],
        limits: { shorN: 21, qubits: 6, entry: 'the docket\'s entry bound (413 above it; fold splits what a place cannot hold)', quantum: 'a client\'s run stops at QPU_QUANTUM_MS and keeps what it settled' },
        errors: [{ code: -32601, means: 'no such tool or method; the answer names the tools' }, { code: -32602, means: 'invalid params; the answer names the bound the schema sets' }, { code: -32700, means: 'parse error' }, { http: 304, means: 'the block held is the block asked: nothing sent' }, { http: 400, means: 'an entry\'s shape refused, named' }, { http: 401, means: 'a token with no role at this tenant' }, { http: 413, means: 'an entry above the bound: fold it' }],
      }
    }
    case 'hooks': return hooksOf({})
    case 'gates': return gatesOf(ctx, 'https://qpu.uuidna.com', p.devDependencies, p.google)
    case 'sets': return p.env ? scopeOf(ctx, p.env) : setsOf(ctx, p.sets)
    case 'realtime': return REALTIME
    case 'branding': return brandingOf(p.branding)
    case 'scopes': return SCOPES
    case 'packages': return packagesOf()
    case 'ecommerce': return ecommerceOf(p.rates)
    case 'adapters': if (p.port !== undefined) return typeof p.port === 'number' ? portAt(p.port) : listPorts()
      return { ...adaptersOf(p.env ?? []), wrangler: siteWranglerOf(), openNext: { config: fileOf('root', 'open-next'), build: 'npx opennextjs-cloudflare build (the fork\'s pnpm build inside, so the build environment names PAYLOAD_SECRET and DATABASE_URI)', requires: ['no export const runtime = \'edge\' in any route: the whole app is the Worker and OpenNext runs the Node runtime under nodejs_compat'], measured: 'the Next build passes; the OpenNext bundle refused the og route while it declared the edge runtime (2026-10-26); the export removed' } }
    case 'ui': { const u = uiOf('processor'); const reg = registryOf(); const byTool = [...new Map(ctx.examples.map((e) => [e.tool, e])).values()]; const presented = byTool.map((e) => ({ tool: e.tool, parts: presentationOf(uuidOf(e.tool + JSON.stringify(e.arguments)).replace(/-/g, '')).parts.length })); const coverage = { tools: byTool.length, covered: presented.filter((x) => x.parts === 32).length, items: PRESENTABLE_ITEMS.length, variants: 2, choicesPerNibble: PRESENTABLE_ITEMS.length * 2, combinations: '16^32 = 2^128: every UUID one combination of the registry items, styled from itself', loaded: 0, cost: 'one shell and one stylesheet from the cache, immutable; every widget a 304 by involution after the first; no script loaded, no memory beyond the block', says: 'the shadcn widgets cover every tool of the MCP as combinations of eight items in two variants chosen by the address alone: minimum code, minimum memory, minimum cost, the advantage unlimited (textbook_widgets_cover_mcp)' }; return { coverage, core: 'one quantum core used by all: the UUID combinatorics of blocks.ts (channel, fold, style, presentation, stream) — the crypto fold tool exposes them over MCP, this kind delegates to them', ...(p.hex ? { presentation: presentationOf(p.hex) } : {}), ...(p.stream ? { stream: streamOf(p.stream, p.query ?? {}) } : {}), styled: { items: STYLED_ITEMS.map((i) => i.name), from: 'the UUID stream itself: styleOf(uuid) computes every variable from the address; nothing loaded', presentable: 'any hex is a shadcn combination: configure { kind: ui, hex }' }, registry: { schema: 'https://ui.shadcn.com/schema/registry.json', items: (reg['registry.json'] as { items: { name: string; type: string }[] }).items.map((i) => `${i.name} (${i.type})`), add: 'npx shadcn add https://qpu.uuidna.com/r/qpu-app.json', host: 'the React host QpuApp, the same host the site runs in Vue' }, extension: MCP_APPS.extension, mimeType: MCP_APPS.mimeType, scheme: MCP_APPS.scheme, specification: MCP_APPS.specification, tokens: UI_TOKENS.map(([token, host, fallback]) => ({ token, host, fallback })), csp: u.csp, prefersBorder: u.prefersBorder, shellBytes: u.html.length, deterministic: 'a pure function of the key and the theme: no randomness, no clock, no external domain; the same resource at every host', hosted: 'any host that negotiates io.modelcontextprotocol/ui; the site\'s playground hosts the same resource through the same protocol', rendering: 'the widget the tool computes (_meta.widget) with the tool\'s theme (_meta.theme), else the structured content' } }
    case 'fields': return FIELDS
    case 'validations': {
      const hooks = Object.entries(hooksOf({}).pairs).flatMap(([where, ps]) => ps.flatMap((p) => [p.before, p.after].filter(Boolean).map((hook) => ({ where, hook, theorem: p.paired ? 'textbook_witness_pair' : 'textbook_harmonic_default' }))))
      const unbackedValidations = VALIDATIONS.filter((v) => !v.theorem)
      const leads: Lead[] = [
        ...unbackedValidations.map((v) => ({ id: `validation-without-theorem-${v.of}-${v.field.replace(/\./g, '-')}`, statement: `the validation of ${v.of}.${v.field} (${v.says}) names no theorem: a pattern the kernel has not stated`, status: 'open' as const, reason: 'a convention until a theorem states its arithmetic; the a432 default applies where the field is empty' } as Lead)),
      ]
      return {
        validations: VALIDATIONS, hooks, enforced: 'as validate functions in the generated collections and block (the theorem in each field\'s custom, read through the Payload MCP\'s getCollectionSchema); the same patterns the edge checks',
        harmonic: { key: KEY, hue: hueOf(KEY), theorem: 'harmonic', involution: 'involution', free: { product: 'qpu-a432', variant: 'harmonic-default', theorem: 'textbook_free_or_coil' }, says: 'the a432 harmonic default is the basis: every validation and hook is backed by a theorem the kernel accepts or is a lead; a field left empty takes the a432 default (the accent); the free variant is the harmonic one' },
        backed: { validations: VALIDATIONS.length - unbackedValidations.length, hooks: hooks.length, of: VALIDATIONS.length + hooks.length },
        live: { fields: 'POST /api/<collection> with a value outside a pattern answers 400 naming the field (the validate function)', access: 'an anonymous create of any kind but call answers 403 before validation (access runs first)', tenantScoping: 'measured on the local app 2026-10-26: an anonymous REST create of a call is refused by the multi-tenant plugin\'s tenant assignment (invalid selection) even when the hook names the host\'s tenant; a call through the Payload MCP (a key\'s user of the tenant) or the Local API lands; anonymous calls are computed at the Worker\'s /mcp and never stored, which keeps the read free and the write licensed', measured: 'on the local app at every build; on the deployed app by the gate' },
        leads,
      }
    }
    case 'access': return ACCESS
    case 'actions': return actionsOf(p.experience)
    case 'bindings': return { providers: BINDINGS.map((b) => ({ ...b, names: b.names.map((n) => (n.includes('<TENANT>') ? [...Object.values(TENANTS), 'ceci'].map((t) => n.replace('<TENANT>', t.toUpperCase())) : [n])).flat() })),
      // every Cloudflare binding paired one-to-one with its Google equivalent and the thing that uses it, so none is idle and the same app the Payload
      // admin drives runs the Google way (the adapters profile google): the RAID db adapter (qpuRaidDb) uses the data and storage bindings, the Worker
      // the compute binding, the email adapter the mail binding — used + idle = total, idle = 0
      roles: [
        { role: 'compute', cloudflare: 'Worker + ASSETS (static site)', google: 'Cloud Run', usedBy: 'serves the Payload admin and the /api/mcp endpoint — every tool call lands through it', idle: false },
        { role: 'database', cloudflare: 'D1 (SQLite) / DOCKET (Durable Object, SQLite)', google: 'Cloud SQL (postgres)', usedBy: 'qpuRaidDb persists every collection here as a content-addressed blob (the RAID db store)', idle: false },
        { role: 'object-store', cloudflare: 'R2', google: 'Cloud Storage (GCS)', usedBy: 'qpuRaidDb writes each blob at its hex-path address here (a RAID store, same key as the GCS object)', idle: false },
        { role: 'key-value', cloudflare: 'KV', google: 'Firestore', usedBy: 'qpuRaidDb uses it as a RAID store when no filesystem or object store is bound', idle: false },
        { role: 'email', cloudflare: 'Email Routing / Resend', google: 'Gmail SMTP', usedBy: 'the email adapter (qpuAdapterPlugins) sends through whichever is chosen by the environment', idle: false },
      ],
      minimum: 'every provider at its free tier first; what keeps it free is measured by the gate (involutions, 304s, cached blocks) and by the hooks (content addresses, tags): a paid step is a write or a first computation, never a read', scale: 'full scale is more tenants, never more code: a tenant is a host in TENANTS, its bindings its own names (values never travel)' }
    case 'fullstack': {
      // QPU's full stack from the source of payloadcms.com (MIT): the site's own collections, blocks, globals and plugins kept, the qpu block
      // added to its thirty, the plugins MCP configures here added, the database the RAID's Mongo language, storage and deploy at Cloudflare
      const ws = websiteOf(WEBSITE_FIXTURE)
      // the licence layering: the fork stays MIT (Payload's copyright kept whole); what QPU adds carries QPU's licence, named in every added file and in the notice
      const header = `// ${LICENSE.attribution}\n// Added to the MIT fork of payloadcms/website (Copyright (c) 2023 Payload); this file is QPU's: see NOTICE.qpu.md.\n`
      const qpuBlock = `${header}// The qpu block: one lexical/layout block of programmable UUID logic, the shape every tools/call result already carries in _meta.payload.
import type { Block } from 'payload'
import { uuidOf } from '@uuidna/qpu/blocks'
import { qpuFieldsOf, typeOk } from '@uuidna/qpu/payload'
import { callOf, handle } from '@uuidna/qpu/mcp'
import { createHmac, createPrivateKey, hkdfSync, sign } from 'node:crypto'
// the tools an editor names, each with its schema from the MCP's own tools/list: the tool checked on save, and its arguments against that
// tool's schema (the required keys, the types, the enums); a bound is the tool's to re-fuse, and a key the schema does not name is the tool's
type ToolSchema = { required?: string[]; properties?: Record<string, { type?: string | string[]; enum?: unknown[] }> }
const TOOL_SCHEMAS = new Map((handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) as { result: { tools: { name: string; inputSchema: ToolSchema }[] } }).result.tools.map((t) => [t.name, t.inputSchema]))
const checkTool = (v: unknown) => TOOL_SCHEMAS.has(String(v)) || \`\${String(v)} is no tool: name one of \${[...TOOL_SCHEMAS.keys()].join(', ')}\`
const checkArguments = (v: unknown, { siblingData }: { siblingData?: { tool?: string } }) => {
  const s = TOOL_SCHEMAS.get(String(siblingData?.tool)); if (!s) return true
  if (v != null && (typeof v !== 'object' || Array.isArray(v))) return 'the arguments are one object'
  const a = (v ?? {}) as Record<string, unknown>, missing = (s.required ?? []).filter((k) => !(k in a))
  if (missing.length) return \`\${siblingData!.tool} needs \${missing.join(', ')}\`
  for (const [k, p] of Object.entries(s.properties ?? {})) { if (!(k in a)) continue; if (!typeOk(a[k], p.type)) return \`\${k} is \${[p.type].flat().join(' or ')}\`; if (p.enum && !p.enum.includes(a[k])) return \`\${k} is one of \${p.enum.join(', ')}\` }
  return true
}
// the proof keys made once per process from their witnesses (the deployment secret, the signing seed), then only used, as a factor is
let keys: { mac: Buffer | null; signing: ReturnType<typeof createPrivateKey> | null } | undefined
const keysOf = () => (keys ??= { mac: process.env.QPU_DATA_KEY ? Buffer.from(hkdfSync('sha256', process.env.QPU_DATA_KEY, '', 'qpu proof mac', 32)) : null, signing: process.env.QPU_PROOF_SIGNING_KEY ? createPrivateKey({ key: Buffer.from(process.env.QPU_PROOF_SIGNING_KEY, 'base64'), format: 'der', type: 'pkcs8' }) : null })
export const Qpu: Block = {
  slug: 'qpu',
  interfaceName: 'QpuBlock',
  fields: [
    // the caller sends the tool and its arguments; the address and all read from it are computed here
    { name: 'uuid', type: 'text', ${validateOf('qpu', 'uuid')}, hooks: { beforeValidate: [({ siblingData: s }) => (s?.tool ? Object.assign(s, qpuFieldsOf(uuidOf(JSON.stringify({ tool: s.tool, arguments: s.arguments ?? {} })), s.tool, s.arguments ?? {}, s.theorem ?? null)).uuid : s?.uuid)] }, admin: { readOnly: true, description: 'the block address: a content-addressed RFC 9562 v8 UUID' } },
    { name: 'handle', type: 'text', admin: { readOnly: true } },
    { name: 'program', type: 'text', admin: { readOnly: true, description: 'the hex program (the version and variant nibbles rotated)' } },
    { name: 'tail', type: 'text', admin: { readOnly: true } },
    { name: 'tool', type: 'text', required: true, validate: checkTool, admin: { description: 'the tool whose result this block is: one the MCP lists (tools/list)' } },
    { name: 'arguments', type: 'json', validate: checkArguments as never, admin: { description: 'the arguments, so the block recomputes anywhere: checked on save against the schema of the tool' } },
    { name: 'prev', type: 'text', ${validateOf('qpu', 'prev')}, admin: { description: 'the referer block' } },
    { name: 'next', type: 'text', ${validateOf('qpu', 'next')}, admin: { description: 'the program rotated: the next step' } },
    { name: 'stream', type: 'text', admin: { readOnly: true, description: 'the scannable stream of the address: the frames as a CSS gradient, stepped through by the qpu-scan item; computed by the lexical hook from uuid, never typed' }, custom: { theorem: 'textbook_scan_stream' }, hooks: { afterRead: [({ siblingData }) => { const u = String(siblingData?.uuid ?? ''); if (!/^[0-9a-f-]{36}$/.test(u)) return null; const hue = (ch: string) => (ch === '-' ? null : parseInt(ch, 16) * 22.5); return 'linear-gradient(90deg, ' + [...u].map((ch, i) => (hue(ch) === null ? 'hsl(0 0% 0%)' : 'hsl(' + hue(ch) + ' 62% 44%)') + ' ' + ((i / 36) * 100).toFixed(3) + '% ' + (((i + 1) / 36) * 100).toFixed(3) + '%').join(', ') + ')' }] } },
    { name: 'theorem', type: 'text', hooks: { beforeValidate: [({ value, siblingData: s }) => { const r = (callOf('verify', value ? { theorem: value } : { call: { tool: s?.tool, arguments: s?.arguments ?? {} } }) as { result?: { structuredContent?: { theorem?: string | null; accepted?: boolean } } }).result?.structuredContent; if (value && !r?.accepted) throw new Error('the kernel accepts no theorem ' + value); return value || (r?.accepted ? r.theorem : value) }] }, admin: { description: 'the kernel-accepted theorem that makes this block true; written by the QPU as a client of this MCP, read from the textbook' } },
    { name: 'proof', type: 'json', admin: { readOnly: true, description: 'the proof of the block, the digest of its round trip signed twice: an HMAC under the deployment secret, checked by the server, and a signature by the key the deployment holds (alg read from it), checked offline with the published public key' }, hooks: { beforeValidate: [({ siblingData: s }) => { const r = (callOf('verify', { call: { tool: s?.tool, arguments: s?.arguments ?? {} }, ...(s?.theorem ? { theorem: s.theorem } : {}) }) as { result?: { structuredContent?: { digest?: string | null; accepted?: boolean } } }).result?.structuredContent; if (!r?.digest || !r.accepted) return null; const k = keysOf(), d = r.digest; return { digest: d, alg: k.signing?.asymmetricKeyType ?? null, mac: k.mac ? createHmac('sha256', k.mac).update(d).digest('hex') : null, signature: k.signing ? sign(null, Buffer.from(d), k.signing).toString('base64') : null } }] } },
    { name: 'license', type: 'text', admin: { readOnly: true, description: 'the licence the block is served under (SPDX), kept with the content as every result carries it' } },
  ],
}
`
      const config = `${header}// QPU's full stack on the source of payloadcms.com (github.com/payloadcms/website, MIT): the qpu block beside the site's blocks, the
// plugins MCP configures here that the site does not mount yet (its own four — form-builder, nested-docs, redirects, seo — stay as they are),
// the database the RAID (the mongo tool's language over the docket). Generated by configure { kind: 'fullstack' }; imported by src/payload.config.ts.
import { searchPlugin } from '@payloadcms/plugin-search'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { UnauthorizedError } from 'payload'
import { toolCallerOf } from '@uuidna/qpu/mcp'
import { qpuEcommerce } from './payload.qpu.ecommerce'
import { Qpu } from './blocks/Qpu/config'
import { qpuMcpTools, qpuMcpResources, qpuServerInfo } from './payload.qpu.mcp'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import type { Config, CollectionConfig } from 'payload'

// governance by role, from the configs: who may move data in and out, who may read a document's history, which languages the content speaks
type QpuUser = { roles?: string[]; tenants?: { roles?: string[] }[] } | null | undefined
const qpuSuperAdmin = (u: unknown) => ((u as QpuUser)?.roles ?? []).includes('admin')
const qpuEditor = ({ req }: { req: { user?: unknown } }) => qpuSuperAdmin(req.user) || ((req.user as QpuUser)?.tenants ?? []).some((r) => (r.roles ?? []).some((x) => x === 'tenant-admin' || x === 'editor'))
const qpuSuperAdminOnly = ({ req }: { req: { user?: unknown } }) => qpuSuperAdmin(req.user)
// a bulk import or export overrides many documents at once: the super admin's act alone, never a tenant's, and never updated
const qpuTransferAccess = ({ collection }: { collection: CollectionConfig }): CollectionConfig => ({ ...collection, access: { ...collection.access, read: qpuSuperAdminOnly, create: qpuSuperAdminOnly, update: () => false, delete: qpuSuperAdminOnly } })
/** the languages by ISO 639-1 code, from the QPU's own language list: English the default, a missing translation falling back to it */
export const qpuLocalization = { locales: ${JSON.stringify(Object.keys(LOCALES))}, defaultLocale: 'en', fallback: true }
/** a document's version history readable only by those who may edit it, on every versioned collection; the localization set when the config sets none */
export const qpuGovernance = (config: Config): Config => ({ ...config, localization: config.localization ?? qpuLocalization, collections: (config.collections ?? []).map((c) => (c.versions ? { ...c, access: { ...c.access, readVersions: c.access?.readVersions ?? qpuEditor } } : c)) })

export const qpuBlocks = [Qpu] // beside the site's ${ws.blocks} blocks; referenced as 'qpu' in every layout
export const qpuPlugins = [
  // data moved in and out by the super admin alone: a bulk import or export overrides many documents at once, so its records are read, created and deleted only by the super admin, never updated; orders leave, never enter
  importExportPlugin({ collections: [{ slug: 'pages' }, { slug: 'posts' }, { slug: 'entries' }, { slug: 'products' }, { slug: 'orders', import: false }], overrideExportCollection: qpuTransferAccess, overrideImportCollection: qpuTransferAccess }),
  // the ecommerce plugin first: it creates products, carts, orders, transactions and addresses, which the multi-tenant plugin scopes (measured: placed after, the plugin warns of missing collections)
  qpuEcommerce, // the licence catalogue sold through Payload's own ecommerce plugin with its Stripe adapter: the API from the config
  searchPlugin({ collections: ['pages', 'posts'] }),
  // enterprise tenants from the configs: four scoped collections, a super admin by the admin role (never everyone), tenant roles on every user's tenants row, tenants readable by all
  multiTenantPlugin({ collections: { ${SCOPES.collections.map((c) => `${c}: {}`).join(', ')} }, tenantsSlug: 'tenants', userHasAccessToAllTenants: (user) => Array.isArray((user as { roles?: string[] }).roles) && (user as { roles: string[] }).roles.includes('admin'), tenantsArrayField: { includeDefaultField: true, rowFields: [{ name: 'roles', type: 'select', hasMany: true, defaultValue: ['viewer'], options: [${TENANT_ROLES.map((r) => `'${r}'`).join(', ')}] }] } } as never), // scopes: ${SCOPES.tenants.join(', ')} over ${SCOPES.collections.join(', ')}; roles ${TENANT_ROLES.join(', ')}
  // only Payload: the handler's tools served by the MCP plugin (the server named qpu), the Worker's /mcp replaced
  mcpPlugin({ collections: ${JSON.stringify(Object.fromEntries(Object.entries(MCP_COLLECTIONS).map(([k, v]) => [k, { description: v.description, enabled: v.enabled }])))}, mcp: { tools: qpuMcpTools, resources: qpuMcpResources, serverOptions: { serverInfo: qpuServerInfo } }, overrideAuth: async (req: any, getDefault: () => Promise<any>) => {
    // tenants as namespaces: a request naming x-qpu-namespace is narrowed to that one tenant, as the payload tool decides (textbook_namespace_narrows)
    // the admin's viewer by their own key, never valued
    const own = req.user && !req.headers.get('authorization') && (await req.payload.find({ collection: 'payload-mcp-api-keys', where: { user: { equals: req.user.id } }, depth: 1, pagination: false, overrideAccess: true })).docs[0]
    if (own) Object.assign(own.user, { collection: 'users', _strategy: 'mcp-api-key' })
    const settings = own ?? await getDefault(); const ns = req.headers.get('x-qpu-namespace'); if (!ns) return settings
    const tenants = (await req.payload.find({ collection: 'tenants', where: { namespace: { equals: ns } }, limit: 1, depth: 0, overrideAccess: true })).docs.map((x: any) => ({ id: String(x.id), namespace: x.namespace }))
    const user = settings.user; const rows = (user.tenants ?? []).map((r: any) => ({ tenant: String(typeof r.tenant === 'object' ? r.tenant?.id : r.tenant), roles: r.roles ?? [] }))
    const n = toolCallerOf('payload')({ namespace: { narrow: { requested: ns, tenants, user: { roles: user.roles ?? [], tenants: rows } } } })
    if (!n?.allowed) throw new UnauthorizedError()
    user.roles = n.roles; user.tenants = n.rows; return settings
  } } as never), // the tools and the ui:// resources of every tool (MCP Apps) through the plugin; an API key per user authorises a client, narrowed to the namespace a request names
  qpuGovernance, // last, over every collection the plugins above added: version history by role, the languages by ISO 639-1
]
export const qpuEnv = {
  DATABASE_URI: "the RAID docket of the tenant (the mongo tool's language), as the site's MongoDB",
  PAYLOAD_SECRET: "the tenant's",
  R2: "Cloudflare R2 through the bindings MCP once the tenant's token opens it (the site's vercel-blob until then)",
  QPU_ORIGIN: "https://qpu.uuidna.com: the Worker that computes every qpu block and every /<uuid> page",
}
`
      // only Payload: the handler's tools served by the Payload MCP plugin, the docket an entries collection over MongoDB, the discovery document an endpoint, Stripe by its plugin
      const mcpTools = `${header}// The QPU's tools served by the Payload MCP plugin (@payloadcms/plugin-mcp 3.90.1): every tool of the handler, its JSON Schema read into
// zod parameters, its result answered as text; the server is named qpu with the tree's version. Generated by configure { kind: 'fullstack' }.
import { z } from 'zod'
import { handle, toolCallerOf, callOf } from '@uuidna/qpu/mcp'
import { VERSION } from '@uuidna/qpu/version'
import { runMachine } from '@uuidna/qpu/machine'
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import path from 'node:path'

type Schema = { type?: string; properties?: Record<string, Schema & { description?: string; enum?: unknown[]; items?: Schema }>; required?: string[]; description?: string; enum?: unknown[]; items?: Schema }
const zodOf = (s: Schema | undefined): z.ZodTypeAny => {
  if (!s) return z.unknown()
  if (Array.isArray(s.enum)) return z.enum(s.enum.map(String) as [string, ...string[]])
  switch (s.type) {
    case 'string': return z.string()
    case 'integer': return z.number().int()
    case 'number': return z.number()
    case 'boolean': return z.boolean()
    case 'array': return z.array(zodOf(s.items))
    case 'object': return z.record(z.string(), z.unknown())
    default: return z.unknown()
  }
}
const list = (handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) as { result: { tools: { name: string; description: string; inputSchema: Schema }[] } }).result.tools
const handlerTools = list.map((t) => ({
  name: t.name,
  description: t.description,
  parameters: Object.fromEntries(Object.entries(t.inputSchema.properties ?? {}).map(([k, p]) => [k, (t.inputSchema.required ?? []).includes(k) ? zodOf(p).describe(p.description ?? '') : zodOf(p).optional().describe(p.description ?? '')])) as z.ZodRawShape,
  handler: async (args: Record<string, unknown>, req?: any) => {
    // a chat turn: an entry made as the viewer, answered by the entries hook under the viewer's roles
    const chat = args.chat as { call?: unknown; choice?: string } | undefined, ask = t.name === 'match' && chat && !chat.call && await req?.payload.create({ collection: 'entries', data: { kind: 'chat', from: 'mcp', body: { statement: args.statement, choice: chat.choice } }, req, overrideAccess: false }).catch(() => null)
    const r = (ask ? { result: { structuredContent: ask.result } } : callOf(t.name, args)) as { result?: { structuredContent: unknown }; error?: { message: string } }
    // the widget mounted by the host: the result names the tool's own ui:// resource (MCP Apps), since the plugin's tools/list carries no _meta
    return { content: [{ type: 'text' as const, text: JSON.stringify(r.error ? { error: r.error.message } : r.result!.structuredContent) }], ...(r.error ? {} : { structuredContent: r.result!.structuredContent as Record<string, unknown> }), _meta: { ui: { resourceUri: 'ui://qpu/' + t.name } } }
  },
}))
// the developer machine through the Payload MCP: the handler's door plans every action from its allow-list; the action runs here, in this
// process, only on a local app (a loopback host) and only for a super admin, with no shell; every run is an entry of the Entries collection
// created as the user (the tenant's roles and the entries hooks apply); the result names the repository tool's MCP App view
const callTool = (name: string, args: Record<string, unknown>) => toolCallerOf(name)(args)
const LOOPBACK = ['localhost', '127.0.0.1', '[::1]']
type MachineReq = { headers?: { get?: (k: string) => string | null }; user?: { roles?: string[] } | null; payload: { create: (o: Record<string, unknown>) => Promise<{ id: string | number }> } }
export const qpuMachineTool = {
  name: 'machine',
  description: 'The developer machine managed through the Payload MCP, securely: one action of the allow-list (repository { machine: { actions: true } } names them) run on this local app for a super admin, with no shell; commit and push decided by the workflow rules, a push only with confirm; every run an entry of the Entries collection, its paths relative and its leaks redacted',
  parameters: { action: z.string().describe('an action of the allow-list: ${MACHINE_ACTIONS.map((x) => x.id).join(', ')}'), message: z.string().optional().describe('commit: the message'), confirm: z.boolean().optional().describe('push: the user confirms it'), branch: z.string().optional().describe('merge, branch-delete: the branch'), path: z.string().optional().describe('worktree-remove: the worktree'), tag: z.string().optional().describe('tag: an archive/ name'), commit: z.string().optional().describe('tag: the full commit'), from: z.string().optional().describe('port: the file in a worktree'), file: z.string().optional().describe('port: the path in main'), archived: z.boolean().optional().describe('branch-delete: -D behind an archive tag') },
  handler: async (args: Record<string, unknown>, req: MachineReq, extra?: { _meta?: { progressToken?: string | number }; sendNotification?: (n: { method: string; params: Record<string, unknown> }) => Promise<void> }) => {
    const answer = (x: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(x) }], _meta: { ui: { resourceUri: 'ui://qpu/repository' } } })
    const h = String(req.headers?.get?.('host') ?? '')
    const host = h.startsWith('[') ? h.slice(0, h.indexOf(']') + 1) : h.split(':')[0]!
    if (!LOOPBACK.includes(host)) return answer({ refused: 'the machine answers only on a local app', court: callTool('legal', { court: { gate: 'machine', status: 403, rule: 'role', evidence: { host } } }) })
    if (!(req.user?.roles ?? []).includes('admin')) return answer({ refused: 'the machine needs the super admin', court: callTool('legal', { court: { gate: 'machine', status: 403, rule: 'role', evidence: { action: args.action } } }) })
    // the one runner (scripts/machine.ts) plans, runs with no shell and records; a call carrying a progress token is streamed through the plugin's request context, step by step for next
    const progressToken = extra?._meta?.progressToken
    const r = await runMachine(args, path.resolve(process.cwd(), '..'), (p) => { if (progressToken !== undefined) void extra?.sendNotification?.({ method: 'notifications/progress', params: { progressToken, ...p } }) })
    if (!r.record) return answer(r.plan)
    const doc = await req.payload.create({ collection: 'entries', data: { kind: 'machine', from: 'local', body: r.record.entry.body }, req, overrideAccess: false, user: req.user })
    return answer({ ...r.answer, stored: { collection: 'entries', id: doc.id } })
  },
}
export const qpuMcpTools = handlerTools // the machine joins them through the qpu-machine plugin
// the UI resources (MCP Apps): one ui://qpu/<tool> per tool, read from the handler's resources/read, served through the plugin's resources
const resources = (handle({ jsonrpc: '2.0', id: 1, method: 'resources/list' }) as { result: { resources: { uri: string; name: string; description: string; mimeType: string }[] } }).result.resources
export const qpuMcpResources = resources.map((r) => ({
  name: r.uri.replace(/^([a-z]+):\\/\\/qpu\\//, '$1-'),
  title: r.name,
  description: r.description,
  uri: r.uri,
  mimeType: r.mimeType,
  handler: async () => { const x = handle({ jsonrpc: '2.0', id: 1, method: 'resources/read', params: { uri: r.uri } }) as { result?: { contents: { uri: string; text: string }[] } }; return { contents: (x.result?.contents ?? []).map((c) => ({ uri: c.uri, text: c.text })) } },
}))
export const qpuServerInfo = { name: 'qpu', version: VERSION }
`
      const entries = `${header}// The docket as a Payload collection over MongoDB (the mongo tool's language): every entry addressed by its content — the id is the
// fold address of what it holds, the sha256 beside it — never overwritten; the four verbs are Payload's REST (/api/entries).
import { createHmac, hkdfSync } from 'node:crypto'
import type { CollectionConfig, Where } from 'payload'
import { entryTextOf, uuidOf } from '@uuidna/qpu/blocks'
import { callOf, toolCallerOf } from '@uuidna/qpu/mcp'
import { signedRoleOf } from '@uuidna/qpu/roles'

type TenantUser = { roles?: string[]; tenants?: { tenant?: { id?: string } | string; roles?: string[] }[] } | null | undefined
const isSuperAdmin = (user: unknown): boolean => ((user as TenantUser)?.roles ?? []).includes('admin')
const tenantIdOf = (t: unknown): string | null => (typeof t === 'string' ? t : (t as { id?: string } | undefined)?.id ?? null)
const tenantsWithRole = (user: unknown, roles: readonly string[]): string[] => ((user as TenantUser)?.tenants ?? []).filter((row) => (row.roles ?? []).some((r) => roles.includes(r))).map((row) => tenantIdOf(row.tenant)).filter((id): id is string => !!id)
const memberOf = (user: unknown, tenant: string | null, roles: readonly string[]): boolean => !!tenant && tenantsWithRole(user, roles).includes(tenant)
const tenantsOf = (user: unknown): string[] => ((user as TenantUser)?.tenants ?? []).map((row) => tenantIdOf(row.tenant)).filter((x): x is string => !!x)
// a role claimed in a header counts only when signed under the deployment's secret (x-qpu-role-mac over role|tenant|METHOD); a bare header is no claim
const claimedRole = (req: { headers: Headers; method?: string }) => signedRoleOf({ role: req.headers.get('x-qpu-role'), tenant: req.headers.get('x-qpu-tenant'), mac: req.headers.get('x-qpu-role-mac'), method: req.method ?? '' }, process.env.QPU_ROLE_SECRET)
export const Entries: CollectionConfig = {
  slug: 'entries',
  admin: { useAsTitle: 'id', defaultColumns: ['id', 'kind', 'from', 'createdAt'] },
  enableQueryPresets: true, // each tenant's saved lists: its devices, readings, commands
  // access by tenant roles and the Worker's roles: a reader reads; a call is created by anyone; an entry of other kinds by a super admin, a tenant-admin or editor of its tenant, or a writer role signed under the deployment's secret; no one updates (an entry is its content address); a super admin, a tenant-admin of its tenant or a signed admin role deletes
  access: {
    // the operational kinds (a machine's runs, chats, penalties, sessions) to their tenant and admins alone; the rest is the public docket
    read: ({ req }) => isSuperAdmin(req.user) || claimedRole(req) === 'admin' || ${readClause()},
    create: ({ req, data }) => data?.kind === 'call' || data?.kind === 'chat' || isSuperAdmin(req.user) || memberOf(req.user, tenantIdOf(data?.tenant), ['tenant-admin', 'editor']) || claimedRole(req) === 'writer' || claimedRole(req) === 'admin',
    update: () => false,
    delete: ({ req }) => isSuperAdmin(req.user) || claimedRole(req) === 'admin' || { tenant: { in: tenantsWithRole(req.user, ['tenant-admin']) } },
  },
  fields: [
    { name: 'id', type: 'text', required: true, ${validateOf('entries', 'id')}, admin: { readOnly: true, description: 'the content address: computed from kind, from and body' } },
    { name: 'kind', type: 'text', required: true, index: true, ${validateOf('entries', 'kind')} },
    { name: 'from', type: 'text', required: true, index: true },
    { name: 'body', type: 'json' },
    { name: 'sha256', type: 'text', ${validateOf('entries', 'sha256')}, admin: { readOnly: true } },
    { name: 'result', type: 'json', admin: { readOnly: true, description: 'kind call: the reply of the tool, computed by the hook from body { tool, arguments }; the API of every tool is this collection' } },
    // the docket's relations, Payload's own: an entry has many entries it links (a belongs-to-many of the same collection), and the entries
    // linking it are joined back by Payload, never stored twice
    { name: 'links', type: 'relationship', relationTo: 'entries', hasMany: true, admin: { description: 'the entries this one links: a relation of the docket (has many)' } },
    { name: 'linkedBy', type: 'join', collection: 'entries', on: 'links', admin: { description: 'the entries that link this one: the inverse, joined by Payload' } },
  ],
  hooks: {
    // every 404 from a block answered, nothing written: a well-formed UUID the collection does not hold is healed from the Worker by address (QPU_ORIGIN, accept json),
    // which answers the entry its docket holds or the UUID's own page computed from the id alone; unreachable, the same page is computed here by the handler
    afterError: [async ({ error, req }) => {
      const id = String((req as { routeParams?: { id?: unknown } } | undefined)?.routeParams?.id ?? (req?.url ?? '').split('?')[0]!.split('/').pop() ?? '')
      if ((error as { status?: number }).status !== 404 || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id)) return
      try { const res = await fetch((process.env.QPU_ORIGIN ?? 'https://qpu.uuidna.com') + '/' + id, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(10000) }); if (res.ok) { const entry = await res.json() as { id?: string; kind?: string; from?: string; body?: unknown; links?: string[]; computed?: boolean }; if (entry && entry.kind && entry.from && !entry.computed) { try { await req.payload.create({ collection: 'entries' as never, data: { kind: entry.kind, from: entry.from, body: entry.body, links: entry.links ?? [] } as never, overrideAccess: true, context: { disableRevalidate: true } }) } catch { /* seeded already, or refused: the answer stands */ } } return { response: entry, status: 200 } } } catch { /* the Worker unreached: computed here */ }
      const v = toolCallerOf('verify')({ uuid: id })
      return { response: { id, kind: 'uuid', from: 'computed', computed: true, body: v ?? null, says: 'no entry at this address: the page of the UUID from the id alone, nothing written (no content address to seed at)' }, status: 200 }
    }],
    beforeValidate: [async ({ data, operation, req }) => {
      if (operation !== 'create' || !data) return data
      // the tenant the multi-tenant plugin requires: the caller's, else the request host's row (as the users hook names it), else the first tenant, so a public call lands under the tenant that answers it
      if (!data.tenant) { const host = (req?.headers?.get?.('host') ?? '').split(':')[0] || 'localhost'; const byHost = await req.payload.find({ collection: 'tenants' as never, where: { 'domains.domain': { equals: host } }, limit: 1, overrideAccess: true }); const first = byHost.docs[0] ?? (await req.payload.find({ collection: 'tenants' as never, limit: 1, sort: 'createdAt', overrideAccess: true })).docs[0]; if (first) data.tenant = (first as { id: string }).id }
      // a call salted under the server's data key: the same request keeps its address, but no one who knows the request can compute it, nor its answer's
      if (data.kind === 'call' && process.env.QPU_DATA_KEY && data.body && typeof data.body === 'object' && !('salt' in data.body)) data.body = { ...data.body, salt: createHmac('sha256', Buffer.from(hkdfSync('sha256', process.env.QPU_DATA_KEY, '', 'qpu call salt', 32))).update(JSON.stringify(data.body)).digest('hex') }
      // the caller's role, from Payload's user and the tenant (a signed role claim counts too): the chat door corrects what the role may not choose
      const tenantId = tenantIdOf(data.tenant)
      const role = isSuperAdmin(req.user) || claimedRole(req) === 'admin' || memberOf(req.user, tenantId, ['tenant-admin']) ? 'admin' : claimedRole(req) === 'writer' || memberOf(req.user, tenantId, ['editor']) ? 'writer' : 'reader'
      const chatDoor = (statement: string, chat: Record<string, unknown>) => toolCallerOf('match')({ statement, chat })
      // a call is folded as it will run: its arguments corrected for the role first, so the same address always holds the same reply
      const asked = data.body as { tool?: string; arguments?: Record<string, unknown>; statement?: string; choice?: string } | undefined
      let corrected: unknown[] = []
      if (data.kind === 'call' && asked?.tool) { const c = chatDoor('call ' + asked.tool, { role, run: false, call: { tool: asked.tool, arguments: asked.arguments ?? {} } }); if (c?.call) { data.body = { tool: asked.tool, arguments: c.call.arguments }; corrected = c.corrected ?? [] } }
      // a chat entry: the statement, the role and any choice are its body; the hook answers it through the chat door, nothing thrown back
      if (data.kind === 'chat') data.body = { statement: String(asked?.statement ?? ''), role, ...(asked?.choice && { choice: String(asked.choice) }) }
      const chat = data.kind === 'chat' ? chatDoor(String(asked?.statement ?? ''), { role, choice: asked?.choice }) : undefined
      // the address folds the entry's canonical text and the ids it links: the same body linking other entries is another entry
      const links = Array.isArray(data.links) ? data.links.map((l) => String(typeof l === 'object' && l ? (l as { id?: unknown }).id : l)) : []
      const text = entryTextOf({ kind: data.kind, from: data.from, body: data.body, links })
      const bytes = new TextEncoder().encode(text)
      const digest = await crypto.subtle.digest('SHA-256', bytes)
      // the API built from the config: an entry of kind call carries a tool and its arguments, and the hook answers it from the handler; the address folds the call, not the reply, so the same call is the same entry (read free, computed once)
      const body = data.body as { tool?: string; arguments?: Record<string, unknown> } | undefined
      // the reply's result stands as the entry's result (content, structuredContent, _meta with the widget); a refusal stands as { error }
      const reply = data.kind === 'call' && body?.tool ? callOf(body.tool, body.arguments ?? {}) : undefined
      const result = chat ? chat : reply ? { ...((reply.result ?? { error: reply.error }) as object), ...(corrected.length ? { corrected } : {}) } : undefined
      return { ...data, id: uuidOf(text), sha256: [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join(''), ...(result ? { result } : {}) }
    }],
    // no revalidation hook: an entry is its content address and never updates, so nothing cached under it ever changes (measured: a revalidateTag during the render that creates a call is refused by Next)
  },
}
`
      // the API built from Payload's config, nothing customised or bypassed: the discovery document is a global (read at /api/globals/qpu), computed by its afterRead hook
      const qpuGlobal = `${header}// The discovery document as a Payload global: GET /api/globals/qpu answers it from the handler alone, computed on read by the global's own hook; no custom endpoint.
import type { GlobalConfig } from 'payload'
import { discoveryOf } from '@uuidna/qpu/discovery-document'
import { toolCallerOf } from '@uuidna/qpu/mcp'

export const QpuGlobal: GlobalConfig = {
  slug: 'qpu',
  access: { read: () => true },
  fields: [
    { name: 'origin', type: 'text', defaultValue: 'https://qpu.uuidna.com', admin: { description: 'the origin the discovery document names' } },
    { name: 'document', type: 'json', admin: { readOnly: true, description: 'the discovery document: computed on every read, never stored' } },
    { name: 'branding', type: 'json', admin: { readOnly: true, description: 'the branding of the tenant that asked: its tenants row where defined, computed in real time from its address where not' } },
  ],
  // per tenant: the document names the origin of the host that asked (a tenant's domain), else the origin the global holds; a local host keeps the global's
  hooks: { afterRead: [async ({ doc, req }) => { const host = req?.headers?.get?.('host') ?? ''; const origin = host && !/^(localhost|127\\.0\\.0\\.1)(:|$)/.test(host) ? 'https://' + host.split(':')[0] : String(doc?.origin ?? 'https://qpu.uuidna.com'); const hostname = host.split(':')[0] ?? ''; const row = hostname ? ((await req.payload.find({ collection: 'tenants' as never, where: { 'domains.domain': { equals: hostname } }, limit: 1, overrideAccess: true })).docs[0] as { slug?: string; name?: string; branding?: unknown } | undefined) : undefined; const b = toolCallerOf('configure')({ kind: 'branding', branding: { host: hostname, slug: row?.slug, name: row?.name, branding: row?.branding ?? null } }); return { ...doc, origin, document: discoveryOf(origin, process.env as Record<string, unknown>), branding: b?.config ?? null } }] },
}
`
      // the UUID page rendered by the app itself: the handler verifies the address and lays out its channel, vortex and theme; no Worker behind it
      // the tenants collection from the configs: one tenant per host of TENANTS, its currency, its domains; readable by all, written by a super admin
      const tenants = `${header}// The tenants: the collection the multi-tenant plugin requires, from the configs — a name, a slug, the domains that name the tenant
// (as the Worker's TENANTS map) and its currency; readable by everyone, written by a super admin (the admin role). Generated by configure { kind: 'fullstack' }.
import type { CollectionConfig } from 'payload'

const roles = (req: { user?: unknown }): string[] => ((req.user as { roles?: string[] } | undefined)?.roles ?? [])
export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'slug', 'currency'] },
  access: { read: () => true, create: ({ req }) => roles(req).includes('admin'), update: ({ req }) => roles(req).includes('admin'), delete: ({ req }) => roles(req).includes('admin') },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    { name: 'slug', type: 'text', required: true, unique: true, ${validateOf('tenants', 'slug')} },
    { name: 'namespace', type: 'text', unique: true, index: true, validate: (v: unknown) => (v == null || v === '') || /^[a-z][a-z0-9-]{1,62}$/.test(String(v)) || 'a namespace: lower-case letters, digits and dashes, starting with a letter', custom: { theorem: 'textbook_namespace_narrows' }, admin: { description: 'the namespace that names the tenant without a domain: the sandbox of an app, chosen by the x-qpu-namespace header; a credential is narrowed to it, never widened' } },
    { name: 'domains', type: 'array', fields: [{ name: 'domain', type: 'text', required: true }], admin: { description: 'the hosts that name the tenant; the Worker maps each to the docket' } },
    { name: 'currency', type: 'select', defaultValue: 'EUR', options: ${JSON.stringify(QPU_CURRENCIES.map((c) => c.code))}, admin: { description: 'the currency the tenant prices in' } },
    { name: 'settings', type: 'json', admin: { description: 'the plugin options this tenant configures: { arguments: {...} } is merged into every qpu block call under its hosts; read by the page and by MCP clients through the Payload MCP plugin' } },
    // the bindings a tenant uses, strictly by name: the adapters profile, the connectors the endpoint is listed as, the variables it binds; the values stay in the Worker's and the app's environment
    { name: 'bindings', type: 'group', admin: { description: 'the bindings this tenant uses, by name: the adapters profile, the connectors it is listed as, the variables it names; values never here — the Worker and the app read them from their environment by these names (the configure tool computes the choice from the names: kinds adapters and bindings)' }, fields: [
      { name: 'profile', type: 'select', defaultValue: 'cloudflare', options: ['cloudflare', 'google', 'vercel', 'local'], admin: { description: 'the adapters profile: database, storage and email chosen by what the environment names' } },
      { name: 'connectors', type: 'select', hasMany: true, defaultValue: ['claude', 'cloudflare'], options: ['claude', 'cloudflare', 'registry'], admin: { description: 'what the one /mcp endpoint is listed as: a Claude connector, a Cloudflare remote MCP, an entry of the MCP registry' } },
      { name: 'variables', type: 'array', fields: [{ name: 'name', type: 'text', required: true, ${validateOf('tenants', 'bindings.variables.name')} }], admin: { description: 'the variable names this tenant binds (QPU_OAUTH_ISSUER_<TENANT>, MCP_PUBLISHER_TOKEN, ...): names the bindings kind knows; the tenant kind measures which the environment lacks' } },
    ] },
    // the tenant's branding: what the tenant defines here stands; what it leaves empty is computed in real time from its address (configure, kind branding)
    { name: 'branding', type: 'group', admin: { description: 'the branding: defined here, or computed in real time from the tenant address when left empty — the name, the tagline, the accent, the logo, the icon' }, fields: [
      { name: 'name', type: 'text' }, { name: 'tagline', type: 'text' }, { name: 'accent', type: 'text', ${validateOf('tenants', 'branding.accent')} },
      { name: 'logo', type: 'upload', relationTo: 'media' }, { name: 'icon', type: 'upload', relationTo: 'media' },
    ] },
  ],
}
`
      const reactHost = reactHostOf()
      // the adapters chosen by the environment at run time: Cloudflare bindings when the host hands them (OpenNext: globalThis.__qpuBindings), the site's own otherwise
      const adaptersModule = `${header}// Payload's adapters chosen by the environment: the D1 database, the R2 storage and Resend mail when the Cloudflare bindings are handed to the app
// (OpenNext's worker sets globalThis.__qpuBindings from its env), the site's own MongoDB, Vercel Blob and nodemailer otherwise; the RAID's docket is
// the semantics over whichever database answers. Generated by configure { kind: 'adapters' }; imported by src/payload.config.ts.
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { gcsStorage } from '@payloadcms/storage-gcs'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { resendAdapter } from '@payloadcms/email-resend'
import { r2Storage } from '@payloadcms/storage-r2'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { qpuRaidDb } from './payload.qpu.db'
import path from 'node:path'
import { definePlugin, type Config, type EmailAdapter, type Plugin } from 'payload'

type Bindings = { D1?: unknown; R2?: unknown; KV?: unknown; DOCKET?: unknown; AI?: unknown }
export const qpuBindings = (): Bindings => ((globalThis as { __qpuBindings?: Bindings }).__qpuBindings ?? {})
export const qpuGoogle = (): boolean => !qpuBindings().D1 && (process.env.QPU_ADAPTERS === 'google' || Boolean(process.env.GCS_BUCKET) || Boolean(process.env.GOOGLE_CLOUD_PROJECT))
export const qpuProfile = (): 'cloudflare' | 'google' | 'vercel' | 'local' => (qpuBindings().D1 || process.env.QPU_ADAPTERS === 'cloudflare' ? 'cloudflare' : qpuGoogle() ? 'google' : process.env.BLOB_READ_WRITE_TOKEN ? 'vercel' : 'local')
// email over the contract Payload holds: Cloudflare's email sending builder, an entry of kind openapi-operation read from Cloudflare's own OpenAPI
// (node scripts/mcp.ts openapi-import), its server and path read from the entry when a mail is sent; the account and the token are the tenant's
// bindings, named never valued; the Workers-safe HTTP form of the send_email binding the port was owed
const cloudflareEmail = (from: { defaultFromAddress: string; defaultFromName: string }): EmailAdapter => ({ payload }) => ({ name: 'cloudflare-email-sending', ...from, sendEmail: async (message) => {
  const op = ((await payload.find({ collection: 'entries' as never, where: { kind: { equals: 'openapi-operation' } }, depth: 0, pagination: false, overrideAccess: true })).docs as { body?: { operationId?: string; server?: string | null; path?: string; method?: string } }[]).map((d) => d.body).find((b) => b?.operationId === 'email-sending-account-send-builder' && b.server)
  if (!op?.server || !op.path) throw new Error('the email sending contract is not held in Payload: node scripts/mcp.ts openapi-import names it')
  const res = await fetch(op.server + op.path.split('{account_id}').join(process.env.CLOUDFLARE_ACCOUNT_ID ?? ''), { method: op.method ?? 'POST', headers: { authorization: 'Bearer ' + process.env.CLOUDFLARE_EMAIL_TOKEN, 'content-type': 'application/json' }, body: JSON.stringify({ from: message.from || from.defaultFromAddress, to: message.to, cc: message.cc, bcc: message.bcc, subject: message.subject, html: message.html, text: message.text, reply_to: message.replyTo }), signal: AbortSignal.timeout(20000) })
  if (!res.ok) throw new Error('Cloudflare email sending answered ' + res.status)
  return res.json()
} })
const mailFrom = () => ({ defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'no-reply@localhost.test', defaultFromName: process.env.EMAIL_FROM_NAME || 'QPU' })
const smtp = (): Record<string, unknown> | undefined => (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD ? { service: 'gmail', auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD } } : process.env.SENDGRID_API_KEY ? { host: 'smtp.sendgrid.net', port: 587, auth: { user: 'apikey', pass: process.env.SENDGRID_API_KEY } } : undefined)
// every adapter a Payload plugin (definePlugin, its slug the adapter's package): per part, the first one its environment names sets that part of
// the config; the parts and their adapters are the ADAPTERS rows Payload holds, edited in its admin (configure { kind: 'adapters' } writes this file)
type Adapter = { pkg: string; named: () => boolean; make: () => unknown }
const ADAPTERS: Record<'db' | 'email' | 'storage', Adapter[]> = {
  db: [
    { pkg: 'db-d1-sqlite', named: () => Boolean(qpuBindings().D1), make: () => sqliteD1Adapter({ binding: qpuBindings().D1 as never }) },
    { pkg: 'db-postgres', named: qpuGoogle, make: () => postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI || '' } }) },
    { pkg: 'db-mongodb', named: () => true, make: () => mongooseAdapter({ url: process.env.DATABASE_URI || '', migrationDir: path.resolve(process.cwd(), 'src/migrations/qpu') }) },
  ],
  email: [
    { pkg: 'email-resend', named: () => Boolean(process.env.RESEND_API_KEY), make: () => resendAdapter({ apiKey: process.env.RESEND_API_KEY || '', ...mailFrom() }) },
    { pkg: 'email-cloudflare', named: () => Boolean(process.env.CLOUDFLARE_EMAIL_TOKEN && process.env.CLOUDFLARE_ACCOUNT_ID), make: () => cloudflareEmail(mailFrom()) },
    { pkg: 'email-nodemailer', named: () => true, make: () => { const t = smtp(); return nodemailerAdapter({ ...mailFrom(), ...(t ? { transportOptions: t as never } : {}) }) } },
  ],
  storage: [
    { pkg: 'storage-r2', named: () => Boolean(qpuBindings().R2), make: () => r2Storage({ bucket: qpuBindings().R2 as never, collections: { media: true } }) },
    { pkg: 'storage-gcs', named: () => Boolean(process.env.GCS_BUCKET), make: () => gcsStorage({ bucket: process.env.GCS_BUCKET || '', options: { projectId: process.env.GCS_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT }, collections: { media: true } }) },
    { pkg: 'storage-vercel-blob', named: () => true, make: () => vercelBlobStorage({ cacheControlMaxAge: 60 * 60 * 24 * 365, collections: { media: { generateFileURL: ({ filename }) => \`https://\${process.env.BLOB_STORE_ID}/\${filename}\` } }, enabled: Boolean(process.env.BLOB_STORAGE_ENABLED) || false, token: process.env.BLOB_READ_WRITE_TOKEN || '' }) },
  ],
}
const chosen = (part: keyof typeof ADAPTERS): Adapter => ADAPTERS[part].find((a) => a.named())!
// the RAID database over binding 0 (or the bindings when there is no filesystem) when QPU_ADAPTERS names it, else the adapter the environment chooses
export const qpuDb = () => (process.env.QPU_ADAPTERS === 'raid' ? qpuRaidDb() : chosen('db').make()) as Config['db']
export const qpuEmail = () => chosen('email').make() as EmailAdapter
export const qpuAdapterPlugins = (): Plugin[] => (Object.keys(ADAPTERS) as (keyof typeof ADAPTERS)[]).flatMap((part) => ADAPTERS[part].map((a) => definePlugin<{ enabled?: boolean }>({ slug: 'qpu-' + a.pkg, plugin: ({ config, enabled }) => (enabled === false || chosen(part) !== a || (part === 'db' && process.env.QPU_ADAPTERS === 'raid') ? config : part === 'storage' ? (a.make() as Plugin)(config) : { ...config, [part]: a.make() }) })({})))
`
      // the first user is the super admin and the first tenant is the request host: a hook of the users collection, generated; the fork's Users.ts registers it
      const usersHooks = `${header}// The first user bootstrap: the first user created (a deploy's seed from the deployer's account email, or the admin panel's create-first-user)
// is always the super admin (the admin role), and the first tenant is the host of that request — created if absent, the user its tenant-admin
// — unless the caller named the tenants (a deploy's seed names the first tenant of the configs). Every later user is what the admin makes it. Generated by configure { kind: 'fullstack' }; registered by src/collections/Users.ts (hooks.beforeChange).
import type { CollectionBeforeChangeHook } from 'payload'

export const firstUserBootstrap: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation !== 'create') return data
  const { totalDocs } = await req.payload.count({ collection: 'users', overrideAccess: true })
  if (totalDocs > 0) return data
  const host = (req.headers.get('host') ?? '').split(':')[0] || 'localhost'
  const slug = host.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'local'
  const found = await req.payload.find({ collection: 'tenants' as never, where: { slug: { equals: slug } }, limit: 1, overrideAccess: true })
  const tenant = (found.docs[0] ?? await req.payload.create({ collection: 'tenants' as never, overrideAccess: true, data: { name: host, slug, domains: [{ domain: host }], currency: 'EUR' } as never })) as { id: string }
  const roles = Array.from(new Set([...((data as { roles?: string[] }).roles ?? []), 'admin']))
  const given = (data as { tenants?: unknown[] }).tenants
  return { ...data, roles, tenants: Array.isArray(given) && given.length ? given : [{ tenant: tenant.id, roles: ['tenant-admin'] }] }
}
`
      // the qpu block in a page's layout, rendered through the host: the block's call is an entry of the page's tenant (the local API), its view the tool's ui:// resource; nothing drawn by hand
      const blockView = `${header}// The qpu block in a page's layout: the block names a tool and its arguments; the app computes the call from the handler (once per process,
// by the balancer) and renders its result through the tool's own ui:// resource and the host (the UI from the MCP only). The call becomes an
// entry of the tenant on the UUID page (page.tsx), not here: this renderer is reached by the Pages Router too, where the config's caches do
// not exist (measured at build). Generated by configure { kind: 'fullstack' }.
import React from 'react'
import { handle, callOf } from '@uuidna/qpu/mcp'
import { QpuApp } from './App'

export type QpuBlockProps = { uuid: string; handle: string; program: string; tail: string; tool: string; arguments?: Record<string, unknown> | null; prev?: string | null; next?: string | null; theorem?: string | null }

export const QpuBlock: React.FC<QpuBlockProps> = ({ uuid, tool, arguments: args, next, theorem }) => {
  const reply = callOf(tool, args ?? {})
  const view = (handle({ jsonrpc: '2.0', id: 1, method: 'resources/read', params: { uri: 'ui://qpu/' + tool } }) as { result?: { contents: { text: string }[] } }).result?.contents[0]?.text ?? ''
  return (
    <section data-block={uuid} data-tool={tool} data-theorem={theorem ?? undefined}>
      <QpuApp tool={tool} args={(args ?? {}) as Record<string, unknown>} result={reply.result ?? { error: reply.error }} html={view} />
      {theorem ? <small>proven by {theorem}</small> : null}
      {next ? <a href={'/' + next}>next</a> : null}
    </section>
  )
}
`
      const uuidPage = `${header}// A UUID page through Payload's own API: the page is the entry of the call { tool: verify, arguments: { uuid } } in the entries collection —
// read by its content address through the local API (free: nothing computed), created once when absent (the collection's hook computes the result).
// The catch-all hands a single UUID segment to this component. Nothing is fetched from anywhere else; no custom endpoint.
import React from 'react'
import { getPayload } from 'payload'
import { entryTextOf, uuidOf } from '@uuidna/qpu/blocks'
import { handle } from '@uuidna/qpu/mcp'
import { QpuApp } from './App'

type Call = { id: string; result?: { structuredContent?: Record<string, unknown>; _meta?: { widget?: string; theme?: Record<string, string> }; error?: { message: string } } }
// the tenant of the request: the host that names it (the tenants' domains, as the Worker's TENANTS), else the first tenant (a local run)
type Tenant = { id: string; slug: string; settings?: { arguments?: Record<string, unknown> } }
const tenantOf = async (payload: Awaited<ReturnType<typeof getPayload>>): Promise<Tenant> => {
  // next/headers is loaded when the module runs (never imported statically): the block renderer is reached by the Pages Router too, where that API does not exist (measured at build)
  let host = ''
  try { const { headers } = await import('next/headers'); host = (await headers()).get('host')?.split(':')[0] ?? '' } catch { /* no request: the first tenant */ }
  const byDomain = await payload.find({ collection: 'tenants' as never, where: { 'domains.domain': { equals: host } }, limit: 1, overrideAccess: true })
  const t = (byDomain.docs[0] ?? (await payload.find({ collection: 'tenants' as never, limit: 1, sort: 'slug', overrideAccess: true })).docs[0]) as Tenant | undefined
  if (!t) throw new Error('no tenant: seed the tenants first (src/scripts/seedQpu.ts)')
  return t
}
export const callOf = async (tool: string, args: Record<string, unknown>): Promise<Call> => {
  // the config loaded when the module runs, never imported statically: the block renderer is reached by the Pages Router too, and the config's hooks name App Router caches (measured at build)
  const { default: config } = await import('@payload-config')
  const payload = await getPayload({ config })
  const tenant = await tenantOf(payload)
  // the tenant's settings (its tenants document, in this UI or through the Payload MCP plugin) configure every call under its hosts
  const from = 'page:' + tenant.slug // the same call at two tenants is two entries: the address folds the tenant through from
  const body = { tool, arguments: { ...args, ...(tenant.settings?.arguments ?? {}) } }
  const id = uuidOf(entryTextOf({ kind: 'call', from, body }))
  // the collection is QPU's own (the generated types of the fork name the site's); the id is the content address of the call
  try { return await payload.findByID({ collection: 'entries' as never, id }) as unknown as Call } catch { /* not yet called: created once below */ }
  return await payload.create({ collection: 'entries' as never, data: { id, kind: 'call', from, body, tenant: tenant.id } as never }) as unknown as Call
}

export const QpuPage = async ({ uuid }: { uuid: string }) => {
  const verify = await callOf('verify', { uuid })
  // the view read by the server from the handler's own resources/read (the MCP plugin takes a key from every client; the app is its own server)
  const view = (handle({ jsonrpc: '2.0', id: 1, method: 'resources/read', params: { uri: 'ui://qpu/verify' } }) as { result?: { contents: { text: string }[] } }).result?.contents[0]?.text ?? ''
  const r = verify.result
  if (!r?.structuredContent) return <main><h1>{uuid}</h1><p>{r?.error?.message ?? 'not verified'}</p></main>
  // the UI from the MCP only: the entry's result rendered by the tool's own ui:// resource, hosted through the Apps protocol; nothing drawn here
  return (
    <main data-block={uuid} data-entry={verify.id}>
      <h1>{uuid}</h1>
      <QpuApp tool="verify" args={{ uuid }} result={r} html={view} />
    </main>
  )
}
`
      // one content source: the site's documents (payload { site }) seeded into the app's pages by its local API
      // the licence catalogue sold through Payload's ecommerce plugin, configured as the ecommerce template configures it (templates/ecommerce, read 2026-10-26)
      const ecommerce = `${header}// The licence catalogue as Payload's own ecommerce: the plugin's products, variants, carts, orders, transactions and addresses, the
// Stripe adapter as the payment, access by the site's roles, the order's accessToken as the licence key — the API of selling from the config.
import { ecommercePlugin } from '@payloadcms/plugin-ecommerce'
import { stripeAdapter } from '@payloadcms/plugin-ecommerce/payments/stripe'
import type { Access, FieldAccess } from 'payload'

export const QPU_CURRENCIES = ${JSON.stringify(QPU_CURRENCIES)}
const roles = (req: { user?: unknown }): string[] => ((req.user as { roles?: string[] } | undefined)?.roles ?? [])
const isAdmin: Access = ({ req }) => roles(req).includes('admin')
const isAdminField: FieldAccess = ({ req }) => roles(req).includes('admin')
const isCustomerField: FieldAccess = ({ req }) => !!req.user

export const qpuEcommerce = ecommercePlugin({
  access: {
    isAdmin,
    adminOnlyFieldAccess: isAdminField,
    adminOrPublishedStatus: ({ req }) => (roles(req).includes('admin') ? true : { _status: { equals: 'published' } }),
    isCustomer: isCustomerField,
    isDocumentOwner: ({ req }) => (req.user ? { customer: { equals: (req.user as { id: string }).id } } : false),
  },
  customers: { slug: 'users' },
  currencies: { defaultCurrency: 'EUR', supportedCurrencies: [...QPU_CURRENCIES] },
  orders: {
    ordersCollectionOverride: ({ defaultCollection }) => ({
      ...defaultCollection,
      fields: [...defaultCollection.fields, { name: 'accessToken', type: 'text', unique: true, index: true, admin: { position: 'sidebar', readOnly: true, description: 'the licence key of the order' }, hooks: { beforeValidate: [({ value, operation }) => (operation === 'create' || !value ? crypto.randomUUID() : value)] } }],
    }),
  },
  payments: { paymentMethods: [stripeAdapter({ secretKey: process.env.STRIPE_SECRET_KEY ?? '', publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '', webhookSecret: process.env.STRIPE_WEBHOOKS_SIGNING_SECRET })] },
  products: {
    productsCollectionOverride: ({ defaultCollection }) => ({
      ...defaultCollection,
      admin: { ...defaultCollection.admin, useAsTitle: 'title' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'licence', type: 'group', fields: [{ name: 'product', type: 'text' }, { name: 'variant', type: 'text' }, { name: 'unit', type: 'text' }, { name: 'interval', type: 'text' }, { name: 'domains', type: 'text' }] },
        ...defaultCollection.fields,
      ],
    }),
  },
})
`
      const seed = `${header}// The site seeded from the one content source: every document payload { site: true } lays out, created as a page of the app through
// Payload's local API; a page already there (by slug) is left as it is. Run with: pnpm payload run src/scripts/seedQpu.ts
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { getPayload } from 'payload'
import config from '@payload-config'
import { toolCallerOf } from '@uuidna/qpu/mcp'

const payloadTool = toolCallerOf('payload'), configureTool = toolCallerOf('configure')

const main = async () => {
  const payload = await getPayload({ config })
  const site = payloadTool({ site: true }).collection.docs as { id: string; title: string; slug: string; layout: Record<string, unknown>[]; meta: { title: string; description: string }; parent?: string | null; hero?: Record<string, unknown> }[]
  // the tenants from the configs first, read from the handler at run time (nothing seeded is written into this file): one per host, by slug; the super
  // admin seeds, so no user is passed; every scoped document below belongs to the first tenant
  const tenants = configureTool({ kind: 'tenant' }).config.records as Record<string, { name: string; slug: string; domains: { domain: string }[]; currency: string }>
  let tenantsCreated = 0
  for (const t of Object.values(tenants)) {
    const found = await payload.find({ collection: 'tenants' as never, where: { slug: { equals: t.slug } }, limit: 1, overrideAccess: true })
    if (found.totalDocs) continue
    await payload.create({ collection: 'tenants' as never, overrideAccess: true, data: t as never })
    tenantsCreated += 1
  }
  const tenant = (await payload.find({ collection: 'tenants' as never, where: { slug: { equals: Object.keys(tenants)[0] } }, limit: 1, overrideAccess: true })).docs[0] as { id: string } | undefined
  if (!tenant) throw new Error('no tenant to scope the documents to')
  // the first user from the deployer's account: a deploy creates it (no create-first-user form), its password unknown to everyone — the admin sets one through
  // the panel's reset (forgot password) with the mail the app sends; the email from FIRST_USER_EMAIL, else CLOUDFLARE_EMAIL, else wrangler whoami; none: the form stands
  let firstUser = 'none'
  if (!(await payload.count({ collection: 'users', overrideAccess: true })).totalDocs) {
    // a local super admin for the dev harness: when QPU_APP_KEY is set outside production, the first user carries it as its API key, so the git hooks
    // decide through the Payload MCP, the machine runs and the generated indexes sync — no manual keychain step (never in production, never a real address)
    const localKey = process.env.NODE_ENV !== 'production' && process.env.QPU_APP_KEY ? process.env.QPU_APP_KEY : null
    const email = process.env.FIRST_USER_EMAIL ?? process.env.CLOUDFLARE_EMAIL ?? (() => { try { return /associated with the email ([^\\s]+@[^\\s]+?)[.,;]?(?:\\s|$)/.exec(execSync('npx wrangler whoami', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).replace(/\\u001b\\[[0-9;]*m/g, ''))?.[1] ?? null } catch { return null } })() ?? (localKey ? 'admin@localhost.test' : null)
    if (email) { await payload.create({ collection: 'users', overrideAccess: true, context: { disableRevalidate: true }, data: { email, password: randomUUID() + randomUUID(), firstName: 'Super', lastName: 'Admin', roles: ['admin'], enableAPIKey: Boolean(localKey), ...(localKey ? { apiKey: localKey } : {}), tenants: [{ tenant: tenant.id, roles: ['tenant-admin'] }] } as never }); firstUser = localKey ? 'created as the local super admin with its API key from QPU_APP_KEY' : 'created from the account email (its password unknown: reset it through the admin panel)' }
    else firstUser = 'no account email known (FIRST_USER_EMAIL, CLOUDFLARE_EMAIL, wrangler whoami): the create-first-user form of the admin panel stands'
  } else firstUser = 'a user exists already'
  let created = 0, kept = 0, updated = 0
  for (const d of site) {
    const slug = d.slug.replace(/^\\//, '')
    const found = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, overrideAccess: true, draft: true })
    // nested: the parent is the page of the parent slug, created before its children (the documents come parents first); the plugin computes the breadcrumbs
    const parent = d.parent ? ((await payload.find({ collection: 'pages', where: { slug: { equals: d.parent.replace(/^\\//, '') } }, limit: 1, overrideAccess: true, draft: true })).docs[0] as { id: string } | undefined)?.id ?? null : null
    // the layout compared as Payload stores it: block ids, nulls and empty objects are not content, so a page is relaid only when its blocks changed
    const canon = (layout: unknown) => JSON.stringify(layout, (k, v) => (k === 'id' || v === null || (v?.constructor === Object && Object.keys(v).length === 0) ? undefined : v?.constructor === Object ? Object.fromEntries(Object.keys(v as object).sort().map((key) => [key, (v as Record<string, unknown>)[key]])) : v))
    if (found.totalDocs) { const page = found.docs[0] as { id: string; _status?: string; layout?: unknown[]; parent?: string | { id: string } | null }; const stale = canon(page.layout ?? []) !== canon(d.layout) || ((typeof page.parent === 'object' && page.parent ? page.parent.id : page.parent) ?? null) !== parent || (d.hero ? canon((page as { hero?: { richText?: unknown } }).hero?.richText ?? null) !== canon(d.hero.richText ?? null) : false); if (page._status !== 'published' || stale) await payload.update({ collection: 'pages', id: page.id, overrideAccess: true, context: { disableRevalidate: true }, data: { _status: 'published', ...(stale ? { layout: d.layout, parent, ...(d.hero ? { hero: d.hero } : {}) } : {}) } as never }); kept += 1; if (stale) updated += 1; continue }
    // published: the site is what the QPU computes, public at once; a draft would answer no reader
    await payload.create({ collection: 'pages', overrideAccess: true, context: { disableRevalidate: true }, data: { title: d.title, slug, hero: d.hero ?? { type: 'default' }, layout: d.layout, meta: d.meta, tenant: tenant.id, parent, _status: 'published' } as never })
    created += 1
  }
  // the licence catalogue as products of the ecommerce plugin, read from the handler at run time: one per variant, by title, prices in the minor unit per
  // currency — harmonised when the environment carries the rates the currency step measured (QPU_RATES, the JSON the currency tool answers), else the catalogue's own
  const catalogue = configureTool({ kind: 'ecommerce', ...(process.env.QPU_RATES ? { rates: JSON.parse(process.env.QPU_RATES) } : {}) }).config.catalogue.items as { title: string; licence: Record<string, string>; prices: Record<string, number> }[]
  let products = 0
  for (const item of catalogue) {
    const found = await payload.find({ collection: 'products' as never, where: { title: { equals: item.title } }, limit: 1, overrideAccess: true })
    if (found.totalDocs) continue
    await payload.create({ collection: 'products' as never, overrideAccess: true, context: { disableRevalidate: true }, data: { title: item.title, licence: item.licence, tenant: tenant.id, ...Object.fromEntries(Object.entries(item.prices).flatMap(([k, v]) => [[k, v], [k + 'Enabled', true]])), _status: 'published' } as never })
    products += 1
  }
  // the "Request an app" form of the form-builder plugin, from the handler: a submission generates the app (appRequest, form-submissions afterChange)
  const form = payloadTool({ app: { form: true } }).form as Record<string, unknown> & { title: string }
  let formState = 'kept'
  if (!(await payload.find({ collection: 'forms', where: { title: { equals: form.title } }, limit: 1, overrideAccess: true })).totalDocs) { await payload.create({ collection: 'forms', overrideAccess: true, context: { disableRevalidate: true }, data: form as never }); formState = 'created' }
  console.log(\`seed: \${created} page(s) created, \${kept} kept (\${updated} relaid), from \${site.length} documents; \${tenantsCreated} tenant(s) created of \${Object.keys(tenants).length}; \${products} product(s) created of \${catalogue.length}; the request form \${formState}; first user: \${firstUser}\`)
}
// awaited at the top level: payload run returns when the module has loaded, so a pending promise would be left behind (measured: the seed printed nothing and wrote nothing)
await main()
process.exit(0)
`
      const readme = `# QPU full stack

The source of payloadcms.com (MIT) is the full stack, forked under .qpu-app/: its ${ws.collections} collections, ${ws.blocks} blocks, ${ws.globals} globals and ${ws.fields} fields kept. Applied: \`src/blocks/Qpu/config.ts\` (the qpu block, the shape every tools/call result carries in _meta.payload), registered in payload.config blocks and the pages layout; \`src/components/blocks/Qpu/index.tsx\` (the renderer: the page asks the Worker for the block and carries its widget), mapped in RenderBlocks; \`src/payload.qpu.config.ts\` (search and multi-tenant beside the site's four plugins, the database the RAID); \`src/collections/Tenants.ts\` (the multi-tenant plugin's own collection: the hosts that name the tenants). The catch-all makes prefixes useless: a UUID is one address — the entry\'s JSON when the client accepts application/json (the entries collection\'s own door), the block\'s page otherwise; the list is /api/entries; /mcp is the MCP plugin\'s /api/mcp and /.well-known/qpu.json the endpoint /api/qpu; no Worker behind any of them. Deploy at Cloudflare beside this Worker; every step at whole uptime: configure { kind: 'migration' }.
`
      const notice = `# Licences in this fork

- The fork itself is the MIT-licensed source of payloadcms.com (Copyright (c) 2023 Payload); its LICENSE file stands whole and every file of the original stays under it.
- What QPU adds carries QPU's licence: ${LICENSE.attribution} (${LICENSE.deed}). Each added file names it in its first line. The added files: src/blocks/Qpu/config.ts, src/components/blocks/Qpu/index.tsx, src/payload.qpu.config.ts, src/payload.qpu.mcp.ts, src/globals/Qpu.ts, src/components/blocks/Qpu/page.tsx, src/components/blocks/Qpu/App.tsx, src/scripts/seedQpu.ts, src/collections/Tenants.ts, src/collections/Entries.ts, the rewrites in next.config.js, README.qpu.md and this notice.
- The two licences meet at the file boundary: MIT permits the fork and the additions; the additions' own terms apply to them alone; the combined site, served, carries both notices.
`
      const pagesHooks = `${header}// Realtime editing with collisions managed precisely: Payload streams an edit through its own channels (the document lock the admin shows,
// the live preview's postMessage stream, autosave drafts, versions); this hook adds the precondition — an edit names the address it read
// (If-Match for REST, context.prev for the local API, editBase in the data for an MCP client: the Payload MCP plugin's update tool passes data
// and nothing else) and is accepted only while the stored document still folds to that address; else the collision is answered with both
// addresses, never a silent overwrite. An edit that names no base (the admin panel) is guarded by the document lock instead. The address folds the content (title, hero, layout, meta), not the clocks. Generated by configure { kind: 'fullstack' }.
import type { CollectionBeforeChangeHook } from 'payload'
import { ValidationError } from 'payload'
import { canonicalTextOf, uuidOf } from '@uuidna/qpu/blocks'

export const editAddressOf = (doc: Record<string, unknown>): string => uuidOf(canonicalTextOf(JSON.parse(JSON.stringify({ title: doc.title, hero: doc.hero, layout: doc.layout, meta: doc.meta }, (k, v) => (k === 'id' ? undefined : v)))))
export const collisionGuard: CollectionBeforeChangeHook = async ({ collection, data, operation, originalDoc, req }) => {
  const base = (data as { editBase?: string | null }).editBase ?? null
  delete (data as { editBase?: string | null }).editBase
  if (operation !== 'update' || !originalDoc) return data
  // the precondition is the edited document's alone: the nested-docs plugin re-saves the children with the same request, and those carry no base
  const ctx = req.context as { prev?: string; qpuGuarded?: boolean }
  if (ctx.qpuGuarded) return data
  const prev = req.headers.get('if-match')?.replace(/^W\\//, '').replace(/"/g, '') ?? ctx.prev ?? base
  if (!prev) return data
  ctx.qpuGuarded = true
  const current = editAddressOf(originalDoc as Record<string, unknown>)
  if (current !== prev) throw new ValidationError({ collection: collection.slug, errors: [{ path: 'layout', message: \`collision: the document is at \${current}, the edit was based on \${prev}; read it again and re-apply\` }] }, req.t)
  return data
}
`
      const submissionHooks = `${header}// A submission of the "Request an app" form (the form-builder plugin's own collection) generates the app: the answer of payload { app }
// written as a JSON file into the media collection (the plugin's default upload), the licence product named for the checkout the ecommerce
// plugin serves; nothing added to the schema — the intelligence of combinatorics is to fit the environment without hacking it. Generated by configure { kind: 'fullstack' }.
import type { CollectionAfterChangeHook } from 'payload'
import { callOf, toolCallerOf } from '@uuidna/qpu/mcp'

export const APP_REQUEST_FORM_TITLE = 'Request an app'
export const appRequest: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc
  const form = (typeof doc.form === 'object' && doc.form ? doc.form : await req.payload.findByID({ collection: 'forms', id: doc.form, overrideAccess: true }).catch(() => null)) as { title?: string } | null
  if (!form || form.title !== APP_REQUEST_FORM_TITLE) return doc
  const data = Object.fromEntries(((doc.submissionData ?? []) as { field: string; value: string }[]).map((f) => [f.field, f.value]))
  const verdict = toolCallerOf('payload')({ app: { validate: data } }) as { ok: boolean; fields: Record<string, { ok: boolean; says: string }> }
  if (!verdict?.ok) { req.payload.logger.warn('app request refused by validation: ' + JSON.stringify(verdict?.fields ?? {})); return doc }
  const r = callOf('payload', { app: { name: data.name, host: data.host, env: String(data.env ?? '').split(/[,\\s]+/).filter(Boolean), variant: data.variant || 'yearly' } })
  if (!r.result) { req.payload.logger.warn('app request refused: ' + (r.error?.message ?? 'no result')); return doc }
  const app = r.result.structuredContent
  const text = JSON.stringify(app, null, 1)
  const product = (await req.payload.find({ collection: 'products' as never, where: { title: { equals: app.order.product } }, limit: 1, overrideAccess: true })).docs[0] as { id: string } | undefined
  await req.payload.create({ collection: 'media', overrideAccess: true, context: { disableRevalidate: true }, data: { alt: 'app ' + String(data.host) + ': bundle ' + app.bundle + ', ' + (app.price.amount / 100).toFixed(2) + ' ' + app.price.currency + (product ? ', product ' + product.id : '') } as never, file: { data: Buffer.from(text), mimetype: 'application/json', name: String(data.host).replace(/[^a-z0-9.-]/gi, '-') + '.app.json', size: Buffer.byteLength(text) } })
  return doc
}
`
      const pluginModule = `${header}// The QPU as Payload plugins, one per capability, each by Payload's plugin guide (definePlugin: a slug, typed options, enabled, arrays spread),
// composed by the umbrella qpuPlugin: qpu (the core), qpu-agents, qpu-machine, qpu-google, qpu-raid and qpu-hooks. Generated by configure { kind: 'fullstack' }.
import { APIError, definePlugin } from 'payload'
import type { Block, CollectionAfterChangeHook, CollectionConfig, Config, Field, Plugin, PayloadRequest, TaskConfig } from 'payload'
import { existsSync, readFileSync, readdirSync, renameSync, mkdirSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import path from 'node:path'
import { createSign } from 'node:crypto'
import { callOf, toolCallerOf, redact } from '@uuidna/qpu/mcp'
import { qpuHooksOf } from '@uuidna/qpu/blocks'
import { Qpu } from '../blocks/Qpu/config'
import { Entries } from '../collections/Entries'
import { Tenants } from '../collections/Tenants'
import { QpuGlobal } from '../globals/Qpu'
import { qpuPlugins } from '../payload.qpu.config'
import { collisionGuard } from '../collections/pages.qpu.hooks'
import { firstUserBootstrap } from '../collections/users.qpu.hooks'
import { appRequest } from '../collections/form-submissions.qpu.hooks'
import { qpuDb, qpuEmail, qpuAdapterPlugins } from '../payload.qpu.adapters'
import { qpuMachineTool } from '../payload.qpu.mcp'

// the block added wherever a layout takes blocks: by object, or by reference where the field references the config's blocks
const withBlock = (fields: Field[], block: Block): Field[] => fields.map((f): Field => {
  if (f.type === 'blocks' && f.name === 'layout') {
    const refs = (f as { blockReferences?: (Block | string)[] }).blockReferences
    if (refs) return { ...f, blockReferences: refs.some((b) => (typeof b === 'string' ? b : b.slug) === block.slug) ? refs : [...refs, block.slug] } as Field
    return { ...f, blocks: f.blocks.some((b) => b.slug === block.slug) ? f.blocks : [...f.blocks, block] }
  }
  if (f.type === 'tabs') return { ...f, tabs: f.tabs.map((t) => ({ ...t, fields: withBlock(t.fields, block) })) }
  if ('fields' in f && Array.isArray(f.fields)) return { ...f, fields: withBlock(f.fields, block) } as Field
  return f
})
// a hook put first on a collection unless it is there already, so applying a plugin twice is applying it once
const first = (c: CollectionConfig, on: 'beforeChange' | 'afterChange' | 'afterRead', fn: never): CollectionConfig => ({ ...c, hooks: { ...c.hooks, [on]: (c.hooks?.[on] ?? []).includes(fn) ? c.hooks?.[on] : [fn, ...(c.hooks?.[on] ?? [])] } })
const withTask = (config: Config, t: { slug: string }) => ({ ...config.jobs, tasks: [...(config.jobs?.tasks ?? []).filter((x) => x.slug !== t.slug), t as never] })
const pages = (c: CollectionConfig): CollectionConfig => first({
  ...c,
  fields: [...withBlock(c.fields, Qpu), ...(c.fields.some((f) => 'name' in f && f.name === 'editBase') ? [] : [{ name: 'editBase', type: 'text', virtual: true, admin: { hidden: true } } as Field])],
  lockDocuments: c.lockDocuments ?? { duration: 300 },
  versions: { ...(typeof c.versions === 'object' ? c.versions : {}), drafts: { ...(typeof c.versions === 'object' && typeof c.versions.drafts === 'object' ? c.versions.drafts : {}), autosave: { interval: 800 } } },
}, 'beforeChange', collisionGuard as never)
const users = (c: CollectionConfig): CollectionConfig => first({ ...c, auth: { ...(typeof c.auth === 'object' ? c.auth : {}), useAPIKey: true } }, 'beforeChange', firstUserBootstrap as never)
const submissions = (c: CollectionConfig): CollectionConfig => first(c, 'afterChange', appRequest as never)
const hooked = (config: Config, by: Record<string, (c: CollectionConfig) => CollectionConfig>): Config => ({ ...config, collections: (config.collections ?? []).map((c) => by[c.slug]?.(c) ?? c) })
export type QpuPluginOptions = { enabled?: boolean; adapters?: 'auto' | 'none'; branding?: boolean; plugins?: Plugin[] }
/** qpu: the core plugin — the block, the global, the tenants, the docket, the pages' guard and lock, the app request, the branding, the adapters */
// a glTF uploaded to media read as Unreal Engine reads it (seal { gltf }): what the scene holds kept on the document; an asset that requires an
// extension the GLTF_EXTENSIONS table Payload holds does not list is refused, as Unreal cannot load it
const readGltfUpload = (async ({ data, req }: { data: Record<string, unknown>; req: PayloadRequest }) => {
  const file = req.file as { data?: Buffer; name?: string } | undefined, name = (file?.name ?? '').toLowerCase()
  if (!file?.data || !(name.endsWith('.glb') || name.endsWith('.gltf'))) return data
  const r = callOf('seal', { text: file.name, gltf: name.endsWith('.glb') ? { glb64: file.data.toString('base64') } : { json: JSON.parse(file.data.toString('utf8')) } }) as { result?: { structuredContent?: { loadable?: boolean; why?: string | null } }; error?: { message: string } }, answer = r.result?.structuredContent
  if (!answer?.loadable) throw new APIError('this glTF cannot be loaded: ' + (answer?.why ?? r.error?.message ?? 'unread'), 400)
  return { ...data, gltf: answer }
}) as never
const gltfMedia = (c: CollectionConfig): CollectionConfig => first({ ...c, fields: [...c.fields.filter((f) => !('name' in f) || f.name !== 'gltf'), { name: 'gltf', type: 'json', admin: { readOnly: true, description: 'a glTF 2.0 asset as Unreal Engine reads it: what the scene holds and its extensions by prefix (seal { gltf })' } }] }, 'beforeChange', readGltfUpload)
export const qpuCore = definePlugin<QpuPluginOptions>({ slug: 'qpu', plugin: ({ config: incoming, enabled, branding }) => (enabled === false ? incoming : hooked({
  ...incoming,
  db: incoming.db ?? qpuDb(),
  email: incoming.email ?? qpuEmail(),
  admin: branding === false ? incoming.admin : { ...incoming.admin, meta: { ...incoming.admin?.meta, titleSuffix: incoming.admin?.meta?.titleSuffix ?? ' · QPU' }, components: { ...incoming.admin?.components, beforeDashboard: [...(incoming.admin?.components?.beforeDashboard ?? []), ...[{ tool: 'clay', args: { technique: 'reflection' } }, { tool: 'dashboard', args: {} }, { tool: 'leads', args: {} }, { tool: 'metrics', args: {} }, { tool: 'match', args: {} }, { tool: 'repository', args: { machine: { actions: true } } }].map((p) => ({ path: '@root/components/blocks/Qpu/App#QpuApp', clientProps: p }))], graphics: { Logo: '@root/components/blocks/Qpu/Branding#QpuLogo', Icon: '@root/components/blocks/Qpu/Branding#QpuIcon', ...incoming.admin?.components?.graphics } } },
  collections: [...(incoming.collections ?? []).filter((c) => c.slug !== Tenants.slug && c.slug !== Entries.slug), Tenants, Entries],
  globals: [...(incoming.globals ?? []).filter((g) => g.slug !== QpuGlobal.slug), QpuGlobal],
  blocks: [...(incoming.blocks ?? []).filter((b) => b.slug !== Qpu.slug), Qpu],
}, { pages, 'form-submissions': submissions, media: gltfMedia })) })
/** qpu-agents: an API key per user (an agent's key to the MCP), the first user from the deploy */
export const qpuAgents = definePlugin<{ enabled?: boolean }>({ slug: 'qpu-agents', plugin: ({ config, enabled }) => (enabled === false ? config : hooked(config, { users })) })
const all = async (req: PayloadRequest, c: string) => (await req.payload.find({ collection: c as never, pagination: false, depth: 0, draft: true, overrideAccess: true })).docs
// the Google integration measured once a burst of changes settles, never holding a change, and kept on the qpu global
let googleTimer: ReturnType<typeof setTimeout> | undefined
const measureGoogle: CollectionAfterChangeHook = ({ doc, req, context }) => {
  if (context.qpuGoogle) return doc
  clearTimeout(googleTimer)
  googleTimer = setTimeout(() => void (async () => {
    const google = toolCallerOf('payload')({ google: { pages: await all(req, 'pages'), tenants: await all(req, 'tenants'), entries: await all(req, 'entries'), keys: await all(req, 'payload-mcp-api-keys') } })
    await req.payload.updateGlobal({ slug: 'qpu', data: { google } as never, context: { qpuGoogle: true }, overrideAccess: true })
  })().catch((e: Error) => req.payload.logger.warn('google: ' + e.message)), 2000)
  return doc
}
// every Google call one job on the server, qpu-google-call, asked by an entry of kind call from qpu-google-call (createEntries through the MCP):
// the job reads the API's Discovery document keyless, the door validates the call against it, the credential is the server's (an API key the
// tenant's bindings name or the secret a named endpoint takes, else a service account or ADC exchanged at the token endpoint, else keyless) and the
// answer is an entry of kind call, the secret never in it
const googleAuthOf = async (req: PayloadRequest, tenant: unknown, token?: string, scopes: string[] = [], secret?: { param: string; named: string }): Promise<{ by: string; query?: Record<string, string>; bearer?: string }> => {
  const t = tenant ? await req.payload.findByID({ collection: 'tenants' as never, id: String(tenant), depth: 0, overrideAccess: true }).catch(() => null) : null
  const named = ((t as { bindings?: { variables?: { name: string }[] } } | null)?.bindings?.variables ?? []).map((v) => v.name).filter((n) => process.env[n]), key = named.find((n) => /^GOOGLE_[A-Z_]*KEY$/.test(n)), held = named.find((n) => /CREDENTIALS$/.test(n))
  const given = secret ? named.find((n) => n.includes(secret.named)) : key
  if (secret || key) return given ? { by: given, query: { [secret?.param ?? 'key']: process.env[given]! } } : { by: 'keyless' }
  const file = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? path.join(homedir(), '.config', 'gcloud', 'application_default_credentials.json')
  const raw = !token ? null : held ? process.env[held]!.trim() : existsSync(file) ? readFileSync(file, 'utf8') : null, c = raw ? JSON.parse(raw.startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8')) : null
  const enc = (o: object) => Buffer.from(JSON.stringify(o)).toString('base64url'), now = Math.floor(Date.now() / 1000), claims = enc({ alg: 'RS256', typ: 'JWT' }) + '.' + enc({ iss: c?.client_email, scope: scopes.join(' '), aud: token, iat: now, exp: now + 3600 })
  const grant: Record<string, string> | null = c?.type === 'service_account' ? { grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: claims + '.' + createSign('RSA-SHA256').update(claims).sign(c.private_key, 'base64url') } : c?.type === 'authorized_user' ? { grant_type: 'refresh_token', client_id: c.client_id, client_secret: c.client_secret, refresh_token: c.refresh_token } : null
  const bearer = grant ? ((await (await fetch(token!, { method: 'POST', body: new URLSearchParams(grant) })).json()) as { access_token?: string }).access_token : undefined
  return bearer ? { by: held ?? 'adc', bearer } : { by: 'keyless' }
}
const googleCallTask: TaskConfig<{ input: Record<string, any>; output: { entry: string } }> = {
  slug: 'qpu-google-call', retries: 0,
  inputSchema: [...['api', 'version', 'method', 'url', 'httpMethod', 'endpoint', 'request', 'tenant'].map((name) => ({ name, type: 'text' }) as Field), { name: 'params', type: 'json' }, { name: 'body', type: 'json' }],
  outputSchema: [{ name: 'entry', type: 'text' }],
  handler: async ({ input, req }) => {
    const ask = (x: object) => toolCallerOf('payload')({ googleCall: x }), asked = ask(input)
    const plan = asked.discovery ? ask({ ...input, discovery: await fetch(asked.discovery, { signal: AbortSignal.timeout(20000) }).then((r) => r.json(), () => null) }) : asked
    const auth = plan.allowed ? await googleAuthOf(req, input.tenant, plan.token, plan.request.scopes, plan.secret) : null, url = plan.allowed ? new URL(plan.request.url) : null, body = plan.request?.body
    for (const [k, v] of Object.entries(auth?.query ?? {})) url?.searchParams.set(k, v)
    const res = url ? await fetch(url, { method: plan.request.httpMethod, headers: { ...(auth?.bearer ? { authorization: 'Bearer ' + auth.bearer } : {}), ...(body != null ? { 'content-type': 'application/json' } : {}) }, body: body != null ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(20000) }).then(async (r) => ({ status: r.status, text: await r.text() }), (e: Error) => ({ status: 0, text: e.message })) : null
    const entry = await req.payload.create({ collection: 'entries' as never, data: { kind: 'call', from: 'qpu-google-call', ...(input.tenant ? { tenant: input.tenant } : {}), body: { request: input.request ?? null, method: plan.method ?? null, allowed: plan.allowed === true, why: plan.why ?? (plan.allowed ? null : 'the Discovery document was not read'), by: auth?.by ?? null, status: res?.status ?? null, answer: res?.text == null ? null : redact(res.text) } } as never, overrideAccess: true, context: { qpuGoogle: true } })
    return { output: { entry: String((entry as { id: string }).id) } }
  },
}
// a call asked of a job (qpu-google-call, qpu-raid-verify) is queued and run at once, so its answer entry stands when createEntries answers
const queueGoogleCall: CollectionAfterChangeHook = async ({ doc, req, operation, context }) => {
  if (operation !== 'create' || context.qpuGoogle || doc.kind !== 'call' || !['qpu-google-call', 'qpu-raid-verify', 'qpu-lead-run'].includes(doc.from) || !doc.body || 'allowed' in doc.body) return doc
  const job = (await req.payload.jobs.queue({ task: doc.from as never, input: { ...doc.body, request: doc.id, tenant: typeof doc.tenant === 'object' ? doc.tenant?.id : doc.tenant } as never, req })) as { id: string }
  await req.payload.jobs.runByID({ id: job.id, req })
  return doc
}
/** qpu-google: the Google integration measured on the qpu global and every Google call the qpu-google-call job; order 20, after the MCP plugin made its keys */
export const qpuGoogle = definePlugin<{ enabled?: boolean }>({ slug: 'qpu-google', order: 20, plugin: ({ config, enabled }) => (enabled === false ? config : {
  ...hooked(config, Object.fromEntries(['pages', 'tenants', 'entries', 'payload-mcp-api-keys'].map((s) => [s, (c: CollectionConfig) => first(s === 'entries' ? first(c, 'afterChange', queueGoogleCall as never) : c, 'afterChange', measureGoogle as never)]))),
  jobs: withTask(config, googleCallTask),
  globals: (config.globals ?? []).map((g) => (g.slug !== 'qpu' || g.fields.some((f) => 'name' in f && f.name === 'google') ? g : { ...g, fields: [...g.fields, { name: 'google', type: 'json', admin: { readOnly: true } } as Field] })),
}) })
/** qpu-machine: the machine tool written into the MCP plugin's options through the plugins map before it runs (its order 10) */
// a lead that names its door runs as a job (payloadcms.com/docs/jobs-queue/tasks), asked by an entry of kind call from qpu-lead-run: the door
// called here (a QPU tool, or the machine tool for an action of its allow-list), its answer an entry linked to the request, the lead served once it answered
type LeadBlock = { tool?: string; arguments?: { lead?: { id?: string; status?: string; reason?: string; run?: { tool: string; arguments?: Record<string, unknown> } } } }
const leadRunTask: TaskConfig<{ input: { lead?: string; request?: string }; output: { entry: string } }> = {
  slug: 'qpu-lead-run', retries: 0, inputSchema: [{ name: 'lead', type: 'text' }, { name: 'request', type: 'text' }], outputSchema: [{ name: 'entry', type: 'text' }],
  handler: async ({ input, req }) => {
    const pages = (await req.payload.find({ collection: 'pages', where: { 'layout.tool': { equals: 'leads' } }, depth: 0, limit: 0, draft: true, overrideAccess: true })).docs as unknown as { id: string; layout?: LeadBlock[] }[]
    const page = pages.find((p) => (p.layout ?? []).some((b) => b.arguments?.lead?.id === input.lead)), block = page?.layout?.find((b) => b.arguments?.lead?.id === input.lead), run = block?.arguments?.lead?.run
    const answer: { result?: unknown; error?: string } = !run ? { error: 'the lead names no door' } : run.tool === 'machine' ? await qpuMachineTool.handler(run.arguments ?? {}, req as never).then((r) => ({ result: r }), (e: Error) => ({ error: e.message })) : ((r) => (r.error ? { error: r.error.message } : { result: r.result?.structuredContent ?? null }))(callOf(run.tool, run.arguments ?? {}) as { result?: { structuredContent?: unknown }; error?: { message: string } })
    const entry = await req.payload.create({ collection: 'entries' as never, data: { kind: 'lead-run', from: 'qpu-lead-run', body: { lead: input.lead ?? null, tool: run?.tool ?? null, ok: !answer.error, answer }, links: input.request ? [input.request] : [] } as never, overrideAccess: true })
    if (page && block && !answer.error) await req.payload.update({ collection: 'pages', id: page.id, data: { layout: page.layout!.map((b) => (b === block ? { ...b, arguments: { ...b.arguments, lead: { ...b.arguments!.lead, status: 'served', reason: 'served by ' + run!.tool + ' (entry ' + String((entry as { id: string }).id) + ')' } } } : b)) } as never, overrideAccess: true, context: { disableRevalidate: true } })
    return { output: { entry: String((entry as { id: string }).id) } }
  },
}
// the daily editorial loop as a Payload job (payloadcms.com/docs/jobs-queue/tasks, scheduled daily, never a deploy): a tenant's news read as problems,
// the served ones solved and written as draft blog posts (Payload publishing — the tenant's editor publishes each at will), the unknown ones the editorial
// backlog, monetised on the tenant's own catalogue. editorialOf (the match tool) writes the posts from the verified combinatorics; Payload's validations verify them.
export const newsSolveTask: TaskConfig<{ input: { tenant?: string; news?: unknown }; output: { entry: string; posts: number } }> = {
  slug: 'qpu-news-solve', retries: 0, inputSchema: [{ name: 'tenant', type: 'text' }, { name: 'news', type: 'json' }], outputSchema: [{ name: 'entry', type: 'text' }, { name: 'posts', type: 'number' }],
  handler: async ({ input, req }) => {
    const tenantSlug = input.tenant ?? 'uuidna', items = Array.isArray(input.news) ? input.news : typeof input.news === 'string' ? (JSON.parse(input.news) as unknown[]) : []
    const r = callOf('match', { tenant: tenantSlug, news: items }) as { result?: { structuredContent?: { drafts?: { title: string; content?: unknown[] }[]; apps?: unknown[] } }; error?: { message: string } }
    const ed = r.result?.structuredContent, drafts = ed?.drafts ?? [], apps = ed?.apps ?? []
    // the tenant relationship: the tenant doc by its slug, so each post belongs to its tenant's blog (newsSolveTask writes the solution as the content body)
    const tenantDoc = (await req.payload.find({ collection: 'tenants' as never, where: { slug: { equals: tenantSlug } }, depth: 0, limit: 1, overrideAccess: true }).then((x) => x, () => ({ docs: [] }))).docs?.[0] as { id?: string } | undefined
    let posts = 0
    for (const d of drafts) { try { await req.payload.create({ collection: 'posts' as never, data: { title: d.title, content: d.content, ...(tenantDoc?.id ? { tenant: tenantDoc.id } : {}), _status: 'draft' } as never, draft: true, overrideAccess: true }); posts++ } catch { /* a post the editor's backlog keeps until its fields are complete */ } }
    const entry = await req.payload.create({ collection: 'entries' as never, data: { kind: 'editorial', from: 'qpu-news-solve', body: { tenant: tenantSlug, items: items.length, posts, apps: apps.length } } as never, overrideAccess: true })
    return { output: { entry: String((entry as { id: string }).id), posts } }
  },
}
export const qpuMachine = definePlugin<{ enabled?: boolean }>({ slug: 'qpu-machine', order: 5, plugin: ({ config, plugins, enabled }) => {
  const o = plugins['@payloadcms/plugin-mcp']?.options
  if (o && enabled !== false) o.mcp = { ...o.mcp, tools: [...(o.mcp?.tools ?? []).filter((t) => t.name !== qpuMachineTool.name), qpuMachineTool as never] }
  return enabled === false ? config : { ...config, jobs: withTask({ ...config, jobs: withTask(config, leadRunTask) }, newsSolveTask) }
} })
// binding 0 (payloadcms.com/docs/hooks/collections): every document a collection changes or reads, at its content address in hex folders by the UUID's
// middle beside the repository (its R2 key, its GCS object) with a pointer to its latest version, the copy the RAID reads back verified when no other binding answers
const BINDING0 = process.env.QPU_BINDING0 ?? path.resolve(process.cwd(), '..', '.qpu'), mongo = toolCallerOf('mongo')
const write = (files: { path: string; text: string }[]) => { for (const f of files) { const at = path.join(BINDING0, f.path); if (!existsSync(at) || (f.path.endsWith('.latest') && readFileSync(at, 'utf8') !== f.text)) { mkdirSync(path.dirname(at), { recursive: true }); writeFileSync(at, f.text) } } }
const mirror = ({ doc, collection }: { doc: Record<string, unknown>; collection: { slug: string } }) => {
  try { write(mongo({ op: 'mirror', collection: collection.slug, docs: [doc] }).files) } catch { /* binding 0 unwritable: the other bindings stand */ }
  return doc
}
// the batch (payloadcms.com/docs/jobs-queue/tasks), asked by an entry of kind call from qpu-raid-verify: binding 0 and Payload's copy of the collection named
// (else every one) verified against bit 0 by the mongo door; the rebuilds written, the files moved to their middle-part folders, one entry
const verifyTask: TaskConfig<{ input: { collection?: string }; output: { entry: string } }> = {
  slug: 'qpu-raid-verify', retries: 0, inputSchema: [{ name: 'collection', type: 'text' }], outputSchema: [{ name: 'entry', type: 'text' }],
  handler: async ({ input, req }) => {
    const files = existsSync(BINDING0) ? Object.fromEntries(readdirSync(BINDING0, { recursive: true }).map(String).filter((p) => /[\\da-f-]{36}(\\.latest)?$/.test(p)).map((p) => [p, readFileSync(path.join(BINDING0, p), 'utf8')])) : {}
    const payload = await Promise.all(req.payload.config.collections.filter((c) => !input.collection || c.slug === input.collection).map(async (c) => mongo({ op: 'mirror', collection: c.slug, docs: await all(req, c.slug) }).files as { path: string; text: string }[]))
    const { rebuild, ...v } = mongo({ op: 'verify', copies: { filesystem: files, payload: Object.fromEntries(payload.flat().map((f) => [f.path, f.text])) } })
    for (const m of v.moves) if (m.binding === 'filesystem') { mkdirSync(path.dirname(path.join(BINDING0, m.to)), { recursive: true }); renameSync(path.join(BINDING0, m.from), path.join(BINDING0, m.to)) }
    write(rebuild.filter((r: { binding: string }) => r.binding === 'filesystem'))
    const entry = await req.payload.create({ collection: 'entries' as never, data: { kind: 'verification', from: 'qpu-raid-verify', body: { ...v, rebuilt: rebuild.length } } as never, overrideAccess: true })
    return { output: { entry: String((entry as { id: string }).id) } }
  },
}
/** qpu-raid: binding 0 under every collection, by its afterChange and afterRead hooks, and its verification against bit 0 as a batch */
export const qpuRaid = definePlugin<{ enabled?: boolean }>({ slug: 'qpu-raid', plugin: ({ config, enabled }) => (enabled === false ? config : { ...config, collections: (config.collections ?? []).map((c) => first(first(c, 'afterChange', mirror as never), 'afterRead', mirror as never)), jobs: withTask(config, verifyTask) }) })
/** qpu-hooks: the witnesses on the final config, every rich text field and Lexical block node; ordered last, any config mounts it with one line */
export const qpuHooks = definePlugin<{ enabled?: boolean }>({ slug: 'qpu-hooks', order: Number.MAX_SAFE_INTEGER, plugin: ({ config, enabled }) => (enabled === false ? config : qpuHooksOf(config).config) })
/** The umbrella: the capabilities, the storage, the plugins the configs order and the tenant's own, each seeing the others in the plugins map */
export const qpuPlugin = (options: QpuPluginOptions = {}): Plugin => async (incoming: Config): Promise<Config> => {
  const inner = [qpuCore(options), qpuAgents({}), qpuMachine({}), ...(options.adapters === 'none' ? [] : qpuAdapterPlugins()), ...qpuPlugins, qpuGoogle({}), ...(options.plugins ?? []), qpuRaid({}), qpuHooks({})]
  let config: Config = { ...incoming, plugins: [...(incoming.plugins ?? []), ...inner] }
  for (const plugin of inner) config = await plugin(config)
  return { ...config, plugins: incoming.plugins }
}
`
      const validateStream = `${header}// Streamed validation, token free: the Form block calls this on every change; the values go to the Worker's /mcp (the pure validation needs
// no key) and each field's verdict comes back before the submit; the host is verified by the client's own request (opaque is enough: it
// answers). Nothing loaded, nothing stored. Generated by configure { kind: 'fullstack' }.
export type Verdicts = { ok: boolean; fields: Record<string, { ok: boolean; says: string }>; online: { tokenFree: boolean; requests: { id: string; url: string; method: string; verifier: string }[]; answered?: Record<string, boolean> } }
export const validateStream = (origin: string, values: Record<string, unknown>, onVerdict: (v: Verdicts) => void, wait = 800): (() => void) => {
  const timer = setTimeout(async () => {
    const r = await fetch(origin + '/mcp', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'payload', arguments: { app: { validate: values } } } }) })
    const v = ((await r.json()) as { result?: { structuredContent: Verdicts } }).result?.structuredContent
    if (!v) return
    const answered: Record<string, boolean> = {}
    await Promise.all(v.online.requests.map(async (q) => { try { await fetch(q.url, { method: q.method, mode: 'no-cors' }); answered[q.id] = true } catch { answered[q.id] = false } }))
    onVerdict({ ...v, online: { ...v.online, answered } })
  }, wait)
  return () => clearTimeout(timer)
}
`
      const openNext = `${header}// The OpenNext Cloudflare build of the app: the Next.js output as a Worker (.qpu-app/wrangler.jsonc, main .open-next/worker.js), the adapters the environment
// names (D1, R2, Resend) bound by the deploy; the build is npx opennextjs-cloudflare build, the deploy the tenant's. Generated by configure { kind: 'fullstack' }.
import { defineCloudflareConfig } from '@opennextjs/cloudflare'

export default defineCloudflareConfig({})
`
      // the branding: computed in real time from the tenant's address, the tenant's own when it defines it in the admin; the fork's wordmark re-exported from it, so the hand-held header and footer change nothing
      const brandingComponent = `'use client'
${header}// The branding, computed in real time from the host's address (the one quantum core) until the tenant's global answers with what the tenant defined in the admin
// (tenants.branding: name, tagline, accent, logo, icon); the admin's Logo and Icon and the site's wordmark render from here. Nothing loaded but the core.
import * as React from 'react'
import { uuidOf, styleOf } from '@uuidna/qpu/blocks'
export type Branding = { name: string; tagline?: string; accent: string; logo?: string; icon?: string; source?: Record<string, string> }
const computed = (host: string): Branding => { const s = styleOf(uuidOf('tenant:' + (host || 'uuidna'))); return { name: host || '@uuidna/qpu', accent: \`hsl(\${s.hue} \${s.sat}% 45%)\`, source: { name: 'computed', accent: 'computed' } } }
export const useBranding = (): Branding => {
  const [b, set] = React.useState<Branding>(() => computed(typeof window === 'undefined' ? '' : window.location.hostname))
  React.useEffect(() => { let on = true; fetch('/api/globals/qpu?depth=1', { headers: { accept: 'application/json' } }).then((r) => r.json()).then((j: { branding?: Branding | null }) => { if (on && j.branding) set(j.branding) }).catch(() => { /* the computed branding stands */ }); return () => { on = false } }, [])
  return b
}
export const QpuIcon = (props: React.ComponentPropsWithoutRef<'svg'>) => { const b = useBranding(); return b.icon ? <img src={b.icon} alt={b.name} height={24} width={24} /> : <svg viewBox="0 0 24 24" width={24} height={24} role="img" aria-label={b.name} {...props}><rect width="24" height="24" rx="6" fill={b.accent} /></svg> }
export const QpuLogo = ({ className, ...rest }: React.ComponentPropsWithoutRef<'svg'>) => { const b = useBranding(); if (b.logo) return <img className={className} src={b.logo} alt={b.name} height={30} />; return <svg className={className} viewBox="0 0 194 44" height={44} width={194} role="img" aria-label={b.name} {...rest}><rect x="0" y="4" width="36" height="36" rx="8" fill={b.accent} /><text x="46" y="31" fontFamily="system-ui, sans-serif" fontSize="22" fill="currentColor">{b.name}</text></svg> }
export default QpuLogo
`
      const fullLogo = `'use client'
${header}// The wordmark the fork rendered (Payload's) replaced by the computed branding: the hand-held header and footer import this file unchanged.
export { QpuLogo as FullLogo, QpuLogo as default } from '../../components/blocks/Qpu/Branding'
`
      // the docket's links as Payload's relation: up turns links stored as [{ entry }] rows into the ids the relationship holds, down turns them back
      // the docket's links as Payload's relation: up turns links stored as [{ entry }] rows into the ids the relationship holds, down turns them back
      const linksMigration = header + ["// Generated by configure { kind: 'fullstack' }; never edit by hand.", "import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'", '',
        'export async function up({ payload, session }: MigrateUpArgs): Promise<void> {', "  await payload.db.collections.entries!.collection.updateMany({ 'links.entry': { $exists: true } }, [{ $set: { links: { $map: { input: '$links', in: '$$this.entry' } } } }], { session })", '}', '',
        'export async function down({ payload, session }: MigrateDownArgs): Promise<void> {', "  await payload.db.collections.entries!.collection.updateMany({ 'links.0': { $type: 'string' } }, [{ $set: { links: { $map: { input: '$links', in: { entry: '$$this' } } } } }], { session })", '}', ''].join('\n')
      const migrationsIndex = header + ["// Generated by configure { kind: 'fullstack' }; never edit by hand.", "import * as migration_20261027_000000_entries_links from './20261027_000000_entries_links'", '', 'export const migrations = [', '  {', "    name: '20261027_000000_entries_links',", '    down: migration_20261027_000000_entries_links.down,', '    up: migration_20261027_000000_entries_links.up,', '  },', ']', ''].join('\n')
      const generated: { role: FileRole; key: string; text: string }[] = [{ role: 'component', key: 'Branding', text: brandingComponent }, { role: 'graphic', key: 'full-logo', text: fullLogo }, { role: 'block', key: 'qpu', text: qpuBlock }, { role: 'config', key: 'config', text: config }, { role: 'notice', key: 'readme', text: readme }, { role: 'notice', key: 'notice', text: notice }, { role: 'config', key: 'mcp', text: mcpTools }, { role: 'collection', key: 'entries', text: entries }, { role: 'global', key: 'qpu', text: qpuGlobal }, { role: 'config', key: 'ecommerce', text: ecommerce }, { role: 'collection', key: 'tenants', text: tenants }, { role: 'hooks', key: 'form-submissions', text: submissionHooks }, { role: 'hooks', key: 'users', text: usersHooks }, { role: 'hooks', key: 'pages', text: pagesHooks }, { role: 'config', key: 'adapters', text: adaptersModule }, { role: 'component', key: 'App', text: `${header}${reactHost}` }, { role: 'component', key: 'index', text: blockView }, { role: 'component', key: 'page', text: uuidPage }, { role: 'component', key: 'validate', text: validateStream }, { role: 'script', key: 'seed-qpu', text: seed }, { role: 'plugin', key: 'qpu', text: pluginModule }, { role: 'root', key: 'open-next', text: openNext }, { role: 'migration', key: '20261027_000000_entries_links', text: linksMigration }, { role: 'migration', key: 'index', text: migrationsIndex }]
      return { repository: PAYLOAD_WEBSITE.repository, licence: PAYLOAD_WEBSITE.licence, qpuLicence: LICENSE.spdx, keep: { collections: ws.collectionList, blocks: ws.blockList, globals: ws.globalList, fields: ws.fieldList, plugins: [...PAYLOAD_WEBSITE.plugins] }, add: { block: 'qpu', plugins: ['search', 'multi-tenant', 'mcp'], database: 'db-mongodb over the RAID docket (the mongo tool\'s language)', storage: 'Cloudflare R2 through the bindings MCP (the tenant\'s token)', deploy: 'Cloudflare Workers beside this Worker (run_worker_first keeps /mcp, /docket, /.well-known)', tenants: Object.values(TENANTS) }, organisation: FILE_ROLES, byRole: Object.fromEntries((Object.keys(FILE_ROLES) as FileRole[]).map((r) => [r, generated.filter((g) => g.role === r).map((g) => fileOf(g.role, g.key))])), partition: `${(Object.keys(FILE_ROLES) as FileRole[]).map((r) => generated.filter((g) => g.role === r).length).join(' + ')} = ${generated.length}`, files: Object.fromEntries(generated.map((g) => [fileOf(g.role, g.key), g.text])), steps: ['fork payloadcms/website (MIT) under .qpu-app/ — done', 'register the qpu block (payload.config blocks, the pages layout, the RenderBlocks map under the @blocks alias), the tenants collection, spread qpuPlugins — done; the fork typechecks', 'rewrite any UUID path and /mcp, /docket, /.well-known to the Worker before the catch-all — done', 'point DATABASE_URI and PAYLOAD_SECRET at the tenant\'s (the build needs them beyond the tree)', 'deploy at Cloudflare beside this Worker; the gate decodes old and new as copies; the old site is removed only then'], note: 'generated text: a fork applies it; nothing here runs Payload' }
    }
    case 'mcp': { const r = ctx.call('extend', { direction: 'out' }) as { outward: { mcpServers: unknown; tools: unknown[] } }; const held = [...PLUGIN_DEFAULT_COLLECTIONS, 'entries']; const beyond = diffMembers({ name: 'the stack\'s collections', members: held }, { name: 'the installed plugins\' defaults (the QPU plugin\'s own among them)', members: [...PLUGIN_DEFAULT_COLLECTIONS, 'entries'] }, { config: 'payload' }); const unserved = diffMembers({ name: 'the stack\'s collections', members: held.filter((c) => !MCP_UNSERVED.some((u) => u.collection === c)) }, { name: 'payload-mcp', members: Object.keys(MCP_COLLECTIONS) }, { config: 'mcp' }); return { mcpServers: r.outward.mcpServers, tools: r.outward.tools.length, hosts: DEFAULT_MCP_HOSTS, payloadMcp: { mandatory: 'every capability is reached through the Payload MCP plugin: the QPU\'s tools and ui:// resources as its tools and resources, the installed plugins\' default collections as its collection tools; nothing added to the schema', collections: MCP_COLLECTIONS, served: Object.keys(MCP_COLLECTIONS).length, defaults: PLUGIN_DEFAULT_COLLECTIONS.length, unservedByDesign: MCP_UNSERVED, schema: { says: 'the combinatorial use apps live in the default schema: a request is a form submission (→ forms), a bundle a media file, a licence a product in a cart bought as an order with its transactions, tenancy the tenants document every scoped collection relates to, content the pages with their qpu blocks and nested parents, calls and messages the entries from = page:<slug>; a client composes an app by these relations, filtered by each collection\'s own access and scoped by the tenant', scoped: Object.entries(MCP_COLLECTIONS).filter(([, v]) => v.scoped).map(([k]) => k), relations: Object.fromEntries(Object.entries(MCP_COLLECTIONS).filter(([, v]) => Object.keys(v.relations).length).map(([k, v]) => [k, v.relations])), enums: Object.fromEntries(Object.entries(MCP_COLLECTIONS).filter(([, v]) => Object.keys(v.enums).length).map(([k, v]) => [k, v.enums])), hooked: Object.fromEntries(Object.entries(MCP_COLLECTIONS).filter(([, v]) => v.hooks.length).map(([k, v]) => [k, v.hooks])), combinations: Object.values(MCP_COLLECTIONS).reduce((n, v) => n * Object.values(v.enums).reduce((m, o) => m * o.length, 1), 1) }, refactoring: [...beyond.leads, ...unserved.leads],
      // the MCP registry entry, generated from the same registration: the one /mcp endpoint as every directory lists it; publishing is the author's act under a name the tenant binds
      registry: { $schema: 'https://static.modelcontextprotocol.io/schemas/2025-07-09/server.json', name: 'com.uuidna/qpu', description: `An exact, formally verified quantum processing unit served over MCP: ${r.outward.tools.length} tools, every result a content-addressed block, every tool read-only and idempotent`, version: VERSION, repository: { url: REPOSITORY.home, source: 'github' }, remotes: [{ type: 'streamable-http', url: 'https://qpu.uuidna.com/mcp' }], publish: 'mcp-publisher publish with MCP_PUBLISHER_TOKEN named in the tenant\'s bindings (the author\'s act); until then the entry is proposed, and the tree reads a registry it is not yet in' },
      says: `${beyond.leads.length} collection(s) beyond the plugins\' defaults and ${unserved.leads.length} not served by the plugin: refactoring leads` } } }
  }
}
/** The drift between a configuration as MCP computes it and the text a client holds (a file): every path whose value differs. */
const driftOf = (computed: unknown, current: unknown, path = ''): string[] => {
  if (JSON.stringify(computed) === JSON.stringify(current)) return []
  if (computed && current && typeof computed === 'object' && typeof current === 'object' && !Array.isArray(computed) && !Array.isArray(current)) {
    const keys = new Set([...Object.keys(computed), ...Object.keys(current)])
    return [...keys].flatMap((k) => driftOf((computed as Record<string, unknown>)[k], (current as Record<string, unknown>)[k], path ? `${path}.${k}` : k))
  }
  return [path || '(root)']
}
const stripJsonc = (text: string) => text.replace(/^\s*\/\/.*$/gm, '').replace(/,(\s*[}\]])/g, '$1')

const configure = defineTool('payload', {
  name: 'configure',
  description: 'MCP configures Payload and the rest: Payload\'s default plugins (lexical with the one qpu block, nested-docs, seo, search, redirects, form-builder, multi-tenant, mcp, ecommerce) in all their combinations with no custom collection; the Worker\'s wrangler configuration from the tenants; each tenant\'s variable names (never values); the PWA manifest; the MCP registration. Every configuration carries its torus: address, seed, reflection and trinity, and whether the loop closes (config → text → config at the same address). With current (the text a client holds), the drift: every path that differs, each a lead; for a hand-held TypeScript file (payload, hooks, bindings), what MCP configures and the text lacks. With files: every configuration\'s file and its source, what next writes and what it measures on every run. Kinds hooks and bindings: the Payload hooks and the providers\' bindings for full-scale use at minimum cost. Without kind: all of them, tested.',
  inputSchema: { type: 'object', properties: { port: { description: 'kind adapters: the port onto Cloudflare — true every one of the combinations (the complete ones, the missing links each a lead, the Cloudflare MCP tools they call); an index from 0 to 49 that combination\'s workflow (its bindings, every step with its MCP call, its plan, its missing links)' }, kind: { type: 'string', enum: [...configKinds], description: 'omit for all' }, files: { type: 'boolean', description: 'the file of every configuration and its source (tool or hand): what next writes and what it measures' }, experience: { type: 'object', description: 'kind actions: what the gate measured ({ copies, involutions, msByHost }): the shard size follows it' }, rates: { type: 'object', description: 'kind ecommerce: the harmonised rates the currency tool answered (currency → { rate }): every price derived from the euro amount' }, lastTag: { type: 'object', description: '{ version, tools }: the last tag and the tools it served, from the repository tool; with it, kind versions computes the next number' }, current: { type: 'string', description: 'the configuration text the client holds (JSON or JSONC): compared, the drift answered' }, version: { type: 'string' }, description: { type: 'string' }, env: { type: 'array', items: { type: 'string' }, description: 'the variable NAMES the client\'s environment holds: which of a tenant\'s are missing (values never travel)' }, template: { type: 'string', enum: [...DEPLOY_TEMPLATES], description: 'kind wrangler: the deploy template (worker, site, app); with useCase, that one set' }, useCase: { type: 'string', description: 'kind wrangler: a product of the catalogue (a432, domain, tenant, seat, metered, iot, delivered, enterprise): the wrangler environment of that use case' }, name: { type: 'string', description: 'kind wrangler, template app: the app\'s name' }, hex: { type: 'string', description: 'kind ui: any hex (a UUID, a hash, an address) presented as a shadcn combination: each nibble an item and a variant, the whole styled from itself' }, stream: { type: 'array', items: { type: 'string' }, description: 'kind ui: a UUID-only stream, queried, sorted, filtered and executed by query (the crypto fold tool answers the same)' }, query: { type: 'object', description: 'kind ui, with stream: { where: { handle, nibble: { at, is }, item, variant, hueBetween }, sort: hex | hue | program | tail, descending, execute }' }, sets: { type: 'array', description: 'kind sets: two sets, each a name (a toolbox, mcp, tools, ui, backed, configs, mount:<tenant>) or { name, members } given, whose union, intersection and differences are answered; with env instead, the MCP scoped by that environment combination (one address per combination)' }, devDependencies: { type: 'object', description: 'kind gates: the tree\'s dev dependencies (name: version), each a gate of the dependencies category — an MCP door the step of next passes, usable in the UI' }, google: { type: 'object', description: 'kind gates: Google\'s APIs as discover read them — { list: the directory (preferred versions), documents: { <name>-<version>: its Discovery document } } — each a gate of the google category, placed in the frontend, the admin or under delegation' }, branding: { type: 'object', description: 'kind branding: the tenant ({ slug | host, name, branding: { name, tagline, accent, logo, icon } } as its tenants row holds it); what the tenant left empty is computed in real time from its address' }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (args.selftest) return { selftest: true, ...PAYLOAD.skill.selftest(ctx) }
    const p = { version: typeof args.version === 'string' ? args.version : undefined, description: typeof args.description === 'string' ? args.description : undefined, lastTag: isObj(args.lastTag) ? args.lastTag as { version: string; tools: string[] } : undefined, experience: isObj(args.experience) ? args.experience as { copies?: number; involutions?: number; msByHost?: Record<string, number> } : undefined, rates: isObj(args.rates) ? args.rates as Record<string, { rate: number }> : undefined, env: Array.isArray(args.env) ? args.env.map(String) : undefined, sets: Array.isArray(args.sets) ? args.sets.map((x) => (isObj(x) && Array.isArray(x.members) ? { name: String(x.name), members: x.members.map(String) } : String(x))) : undefined, hex: typeof args.hex === 'string' ? args.hex : undefined, stream: Array.isArray(args.stream) ? args.stream.map(String) : undefined, query: isObj(args.query) ? args.query as StreamQuery : undefined , google: isObj(args.google) ? args.google as GoogleApis : undefined, devDependencies: isObj(args.devDependencies) ? args.devDependencies as Record<string, string> : undefined, branding: isObj(args.branding) ? args.branding as BrandingInput : undefined, port: typeof args.port === 'number' || typeof args.port === 'boolean' ? args.port : undefined }
    if (args.files) { const tool = CONFIG_FILES.filter((f) => f.source === 'tool').length; const hand = CONFIG_FILES.length - tool; return { files: CONFIG_FILES, kinds: configKinds.length, tool, hand, unfiled: configKinds.length - CONFIG_FILES.length, partition: `${tool} + ${hand} + ${configKinds.length - CONFIG_FILES.length} = ${configKinds.length}`, says: 'a tool-sourced file is written on every run (drift zero by construction); a hand-held file is measured on every run (drift a lead); the rest are answered, not filed' } }
    if (typeof args.kind === 'string') {
      if (!configKinds.includes(args.kind as ConfigKind)) throw new Error(`no configuration ${args.kind}; the kinds are ${configKinds.join(', ')}`)
      const kind = args.kind as ConfigKind
      const config = configOf(kind, ctx, p)
      const out: Record<string, unknown> = { kind, config, torus: torusOf(config) }
      if (kind === 'wrangler') { const hosts = Object.keys(TENANTS); out.sets = deploySetsOf(hosts); if (typeof args.template === 'string') { if (typeof args.useCase !== 'string') throw new Error(`a template names its use case: one of ${DEPLOY_USE_CASES.join(', ')}`); out.set = deploySetOf(args.template as DeployTemplate, args.useCase, hosts, typeof args.name === 'string' ? args.name : undefined) } }
      if (typeof args.current === 'string' && (kind === 'payload' || kind === 'hooks' || kind === 'bindings' || kind === 'api')) { const drift = heldDriftOf(kind, args.current); out.drift = drift; out.driftCount = drift.length; out.leads = diffMembers({ name: 'mcp', members: drift }, { name: 'the file the hand holds', members: [] }, { config: kind }).leads; if (kind === 'bindings') out.env = envExampleOf() }
      else if (typeof args.current === 'string') { let cur: unknown; try { cur = JSON.parse(stripJsonc(args.current)) } catch (e) { cur = { unparsable: (e as Error).message } }; const drift = driftOf(config, cur); out.drift = drift; out.driftCount = drift.length; out.leads = diffMembers({ name: 'mcp', members: drift }, { name: 'the text the client holds', members: [] }, { config: kind }).leads }
      if (kind === 'tenant' && Array.isArray(args.env)) { const have = new Set(args.env.map(String)); out.missing = (config as { tenants: { tenant: string; secrets: string[]; vars: string[] }[] }).tenants.map((t) => ({ tenant: t.tenant, secrets: t.secrets.filter((s) => !have.has(s)), vars: t.vars.filter((v) => !have.has(v)) })) }
      return out
    }
    const all = configKinds.map((kind) => { const config = configOf(kind, ctx, p); return { kind, torus: torusOf(config), config } })
    return { kinds: all.length, tested: all.filter((a) => a.torus.closed).length, closed: all.every((a) => a.torus.closed), doubleTorus: { inward: 'config → text → config at the same address, every kind', outward: 'this catalogue → registration → doors → catalogue (extend identity)' }, byTrinity: Object.fromEntries([[3, 6, 9], [7, 4, 1], [2, 5, 8]].map((t) => [t.join(''), all.filter((a) => a.torus.trinity.join('') === t.join('')).map((a) => a.kind)])), configs: all }
  },
  widget: flowWidget,
})

/** The tree read at github.com/payloadcms/website on 2026-10-25 (main, 1,949 entries): the names under src, as facts. */
const WEBSITE_FIXTURE = { sha: 'main', truncated: false, tree: [
  ...['CaseStudies.ts', 'Categories.ts', 'CommunityHelp', 'Docs', 'DocsFeedback', 'Media.ts', 'Pages.ts', 'PartnerFilters.ts', 'Partners.ts', 'Posts.ts', 'ReusableContent.ts', 'Users.ts'].map((c) => ({ path: `src/collections/${c}${c.endsWith('.ts') ? '' : '/index.ts'}`, type: 'blob' })),
  ...['Banner', 'BlogContent', 'BlogMarkdown', 'CallToAction', 'Callout', 'CardGrid', 'CaseStudiesHighlight', 'CaseStudyCards', 'CaseStudyParallax', 'Code', 'CodeFeature', 'ComparisonTable', 'Content', 'ContentGrid', 'Download', 'ExampleTabs', 'Form', 'HoverCards', 'HoverHighlights', 'LinkGrid', 'LogoGrid', 'Media', 'MediaContent', 'MediaContentAccordion', 'Pricing', 'ReusableContent', 'Slider', 'Statement', 'Steps', 'StickyHighlights'].map((b) => ({ path: `src/blocks/${b}/index.tsx`, type: 'blob' })),
  ...['CustomRowLabelNavItems.tsx', 'CustomRowLabelTabs.tsx', 'Footer.ts', 'GetStarted.ts', 'MainMenu.ts', 'PartnerProgram.ts', 'TopBar.ts'].map((g) => ({ path: `src/globals/${g}`, type: 'blob' })),
  ...['addToDocs', 'blockFields.ts', 'codeBlips.ts', 'fullTitle', 'hero.ts', 'link.ts', 'linkGroup.ts', 'livestreamFields.ts', 'richText', 'slug.ts'].map((f) => ({ path: `src/fields/${f}${f.endsWith('.ts') ? '' : '/index.ts'}`, type: 'blob' })),
  { path: 'src/plugins/opsCounter.ts', type: 'blob' }, { path: 'src/payload.config.ts', type: 'blob' },
] }
/** The access audit from every perspective — the public reader at the default domain (qpu.uuidna.com), a licensed tenant's users at their own
 *  domain, the operator, an MCP client with a key, the developer in the generated code, the licence and the law — over the collections, hooks
 *  and scopes the tool itself generates: each check names who may, the hook that guards it, what it costs (free by address and involution, paid
 *  once by the provider), the licence clause it enacts (BY, NC, ND; commercial use by licence) and the legal fact behind it. Measured on the
 *  generated code and the answered configurations, never asserted by hand; the role–operation combinations counted by the kernel
 *  (textbook_access_combinations); the quantum advantage among the checks, unlimited and without interaction (textbook_advantage_unbounded). Pure. */
const PERSPECTIVES = ['public', 'tenant', 'operator', 'client', 'developer', 'legal'] as const
export const accessAuditOf = (ctx: Context) => {
  const files = (configOf('fullstack', ctx, {}) as { files: Record<string, string> }).files
  const text = (path: string) => files[path] ?? ''
  const entries = text(fileOf('collection', 'entries')); const tenants = text(fileOf('collection', 'tenants')); const plugin = text(fileOf('plugin', 'qpu'))
  const users = text(fileOf('hooks', 'users')); const pages = text(fileOf('hooks', 'pages')); const submissions = text(fileOf('hooks', 'form-submissions'))
  const mcpModule = text(fileOf('config', 'mcp'))
  const tools = listTools(ctx)
  const clay = rpcOf(ctx, 'clay')
  const checks: { id: string; perspective: typeof PERSPECTIVES[number]; passed: boolean; evidence: string; hook: string; cost: string; licence: string; legal: string }[] = []
  const c = (id: string, perspective: typeof PERSPECTIVES[number], passed: boolean, evidence: string, hook: string, cost: string, licence: string, legal: string) => checks.push({ id, perspective, passed, evidence, hook, cost, licence, legal })
  // the public: anyone at the default domain, no account, no token
  c('public:read-everyone', 'public', entries.includes(readClause()) && ACCESS.entries.read.startsWith('everyone') && ACCESS.tenants.read === 'everyone', 'entries (but the operational kinds, read by their tenant) and tenants read by everyone; every tool answers without a credential', 'none: a read is served from the cache by address', 'free: a cache hit by address, a 304 by involution', 'BY: every answer carries _meta.license and the attribution', 'the moral right of attribution (Berne art. 6bis), honoured on every read')
  c('public:create-call-only', 'public', /data\?\.kind === 'call'/.test(entries) && /claimedRole\(req\) === 'writer'/.test(entries) && !/headers\.get\('x-qpu-role'\) ===/.test(entries), 'an anonymous create is a call or a chat, whose address folds it as corrected for the role; any other kind needs a tenant role or a writer role signed under the deployment secret (a bare header is no claim)', 'beforeValidate: the content address on create, so a repeated call is the same row', 'paid once by the provider for the first computation, free after by address', 'NC: non-commercial use is free and needs no licence; the a432 default is priced 0', 'consideration: non-commercial free, commercial billed on the measured advantage')
  c('public:no-update-anywhere', 'public', /update: \(\) => false/.test(entries) && /no one/.test(ACCESS.entries.update), 'no one updates an entry: a change is a new entry linked to the one it replaces', 'none on change: nothing cached under an address changes', 'free: no revalidation, ever', 'ND: no derivative of a sealed entry; the chain of entries is the history', 'integrity (Berne art. 6bis); the sui generis database right over the sealed ledger (Directive 96/9/EC art. 7)')
  // a licensed tenant's users at their own domain
  c('tenant:roles-and-scopes', 'tenant', TENANT_ROLES.length === 3 && SCOPES.collections.length === 4 && Object.keys(ROLES).length === 3, `${TENANT_ROLES.join(', ')} over ${SCOPES.collections.join(', ')}; ${Object.keys(ROLES).join(', ')} over the docket`, 'the multi-tenant plugin scopes every read and write by the user\'s tenants', 'free: a where on the tenant', 'the licence names the domains it covers; a tenant acts on its own', 'tenant isolation: one docket per tenant host; a token at another tenant\'s host holds no role')
  c('tenant:delete-scoped', 'tenant', /tenantsWithRole\(req\.user, \['tenant-admin'\]\)/.test(entries) && /claimedRole\(req\) === 'admin'/.test(entries), 'a tenant-admin deletes within its tenant (a where), a signed admin role within its docket, a super admin anywhere', 'access.delete: the where is the hook', 'free: the where is evaluated by the database', 'the licence\'s domains bound the act', 'accountability: a deletion is a role\'s, named by the token or the user')
  c('tenant:write-super-admin', 'tenant', /create: \(\{ req \}\) => roles\(req\)\.includes\('admin'\)/.test(tenants) && /update: \(\{ req \}\) => roles\(req\)\.includes\('admin'\)/.test(tenants), 'tenants are created, updated and deleted by a super admin alone', 'access on the tenants collection', 'free', 'the licence is per domain: a tenant row is a licensed domain', 'the operator answers for the tenants it names')
  c('tenant:bindings-named-not-valued', 'tenant', /name: 'bindings', type: 'group'/.test(tenants) && /never a value/.test(tenants) && /\^\[A-Z\]\[A-Z0-9_\]\*\$/.test(tenants), 'the tenant admin selects binding names (profile, connectors, variables); a value is refused by the field', 'validate on tenants.bindings.variables.name', 'free', 'the licence names the domain, the bindings name the providers: nothing secret in Payload', 'privacy by data minimisation: no secret, no personal datum in the tree or the admin')
  // the operator
  c('developer:machine-local-admin-no-shell', 'developer', /LOOPBACK\.includes\(host\)/.test(mcpModule) && /\.includes\('admin'\)/.test(mcpModule) && /runMachine\(/.test(mcpModule) && !/\bexec\(|execFile\(|shell:\s*true|spawn\(/.test(mcpModule) && /overrideAccess: false/.test(mcpModule), 'the machine tool of the Payload MCP runs only on a loopback host for a super admin, an argument vector the allow-list planned handed to the one runner (scripts/machine.ts, spawn with no shell) and never a process of its own, every run created as the user', 'payload.qpu.mcp.ts: machineTool', 'free', 'the developer\'s own machine, under the licence', 'nothing leaves the machine but what the user confirms: a push needs confirm and the pre-push rules')
  c('operator:first-user-from-deploy', 'operator', /firstUserBootstrap/.test(plugin) && /firstUserBootstrap/.test(users) && !/[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}/.test(users + plugin + entries + tenants), 'the first user comes from the deployer\'s account at deploy; no address in the generated code', 'users.beforeChange: firstUserBootstrap', 'free', 'the author is attributed by ORCID and URL, never by an address', 'no personal datum kept in the tree: the deployer\'s address is read at deploy, never written')
  c('operator:super-admin-everywhere', 'operator', /isSuperAdmin\(req\.user\)/.test(entries) && /super admin/.test(ACCESS.tenants.write), 'the admin role has access to every tenant; everyone else acts in its tenants', 'userHasAccessToAllTenants of the multi-tenant plugin', 'free', 'the operator holds the licence catalogue: a domain licence is an order of its ecommerce', 'the operator is the author or the party the author licensed')
  // an MCP client
  c('client:api-key-per-user', 'client', /useAPIKey: true/.test(plugin), 'every user may hold an API key; the Payload MCP plugin refuses an anonymous request', 'the plugin: auth.useAPIKey on users', 'free', 'a key is a user\'s of a licensed tenant', 'accountability: every write over the app\'s MCP is a user\'s')
  // a credential-named argument is allowed only where the Worker itself passes it at the edge and a client never holds it (the Stripe webhook secret)
  const credentialArgs = tools.flatMap((t) => Object.entries((t.inputSchema.properties ?? {}) as Record<string, { description?: string }>).filter(([k]) => /token|secret|password|apikey|api_key/i.test(k)).map(([k, v]) => ({ tool: t.name, arg: k, edge: /Worker passes|client never has|never travels/.test(String(v.description ?? '')) })))
  c('client:pure-tools-no-credential', 'client', tools.length > 0 && tools.every((t) => t.annotations?.readOnlyHint === true && t.annotations?.idempotentHint === true) && credentialArgs.every((a) => a.edge), `${tools.length} tools, every one read-only and idempotent; credential-named arguments: ${credentialArgs.map((a) => `${a.tool}.${a.arg} (${a.edge ? 'the Worker passes it at the edge' : 'a client could hold it'})`).join(', ') || 'none'}`, 'none: the tools are pure functions of their arguments', 'free: a 304 by involution needs no scope at all', 'BY: the a432 default free to all under attribution', 'no credential travels through a tool from a client; where the Worker passes one at the edge, a client never holds it')
  const unlimited = getAdvantage(3, 3); const finite = getAdvantage(4, 3); const none = getAdvantage(0, 0)
  const metricsSchema = tools.find((t) => t.name === 'metrics')?.inputSchema.properties ?? {}
  c('client:advantage-unlimited-no-interaction', 'client', unlimited?.unbounded === true && unlimited.ratio === null && finite?.ratio === 4 && finite.unbounded === false && none === null && Object.keys(metricsSchema).length === 1 && 'artefacts' in metricsSchema, 'the advantage is computed from the run\'s counts alone: when every copy is an involution it is unbounded; the metrics tool takes artefacts and nothing else', 'none: the gate decodes, the involution answers 304, the metric follows', 'free: no approval, no token, no bound (textbook_advantage_unbounded)', 'the advantage is what commercial use is billed on, and what non-commercial use gets free', 'consideration measured by the unit (bill_call), recheckable by anyone')
  // the developer, in the generated code
  c('developer:content-address-on-create', 'developer', /beforeValidate/.test(entries) && /uuidOf/.test(entries) && /sha256/.test(entries), 'the entry id is the content address of { kind, from, body }, the sha256 beside it, on create only', 'entries.beforeValidate', 'free: a duplicate write lands on the same id', 'ND: an entry is its content', 'integrity: the address is the proof')
  c('developer:collision-guard', 'developer', /collisionGuard/.test(plugin) && /If-Match|editBase|context\.prev/.test(pages), 'an edit names the address it read and is accepted only while the document still folds to it; a collision answers both addresses', 'pages.beforeChange: collisionGuard', 'free: folded from the document the hook already holds', 'ND: no silent overwrite of anyone\'s edit', 'integrity of concurrent authorship')
  c('developer:app-request-validated', 'developer', /appRequest/.test(plugin) && /ValidationError|refus/.test(submissions), 'an app request is validated as it is typed and refused by the hook when the stream refused it', 'form-submissions.afterChange: appRequest', 'free: validated token free', 'commercial: the app is priced by the catalogue and ordered through the ecommerce plugin', 'a licence sold is an order with its terms')
  // the licence and the law
  c('legal:licence-on-every-answer', 'legal', Boolean(clay.result?._meta?.license) && INSTRUCTIONS.includes(LICENSE.spdx) && /commercial use/.test(LICENSE.terms), 'every tools/call result carries _meta.license; initialize states the terms', 'the handler: _meta.license on every result', 'free', `${LICENSE.spdx}: ${LICENSE.terms}`, 'the licence is the contract every reader accepts by reading; its address is sealed (' + LICENSE.address + ')')
  c('legal:catalogue-free-default', 'legal', CATALOGUE.some((v) => v.product === 'qpu-a432' && v.amounts.eur === 0 && v.domains === '*') && CATALOGUE.some((v) => v.domains === 'named' && v.amounts.eur > 0), 'the a432 harmonic default at 0 on every domain; a named domain licensed by the year', 'the ecommerce plugin: products, variants, orders', 'free to read, paid to license', 'NC and commercial: the catalogue is the licence', 'consideration: non-commercial free and needing no licence; commercial billed')
  // all non-harmonic use is licensed over MCP by billable automation; identity and payment data stay at Stripe, so GDPR and KYC are Stripe's: measured on what the webhook stores
  const webhook = ctx.examples.find((e) => e.id === 'stripe-webhook')
  const stored = webhook ? (ctx.call('stripe', webhook.arguments)?.entry?.body as Record<string, unknown> | undefined) ?? null : null
  const pii = ['name', 'email', 'address', 'phone', 'card', 'iban', 'birth', 'passport', 'tax']
  const keysStored = Object.keys(stored ?? {}); const piiStored = keysStored.filter((k) => pii.some((w) => k.toLowerCase().includes(w)))
  c('legal:gdpr-kyc-at-stripe', 'legal', Boolean(stored) && piiStored.length === 0 && /^cus_/.test(String(stored?.customer ?? '')), `the licence entry stores ${keysStored.join(', ')}: the customer a Stripe id, no name, address, card or identity document`, 'the stripe tool: the webhook verified before anything is written, the entry the licence', 'free: the identity and the payment data never enter the tree', 'all non-harmonic use licensed over MCP by billable automation: the licence is the order, the order is Stripe\'s checkout', 'GDPR and KYC are Stripe\'s: the customer\'s identity and payment data live at Stripe under its DPA and its account verification; the tree keeps the order, the tenant and the domains')
  c('legal:facts-not-advice', 'legal', /not legal advice/i.test(LICENSE.disclaimer) && /represented by/.test(LICENSE.representation), 'recomputable facts, not legal advice; the work represented by its canonical site only', 'none', 'free', 'the disclaimer travels with the licence', 'the inputs a qualified attorney starts from, never the conclusion')
  const failed = checks.filter((x) => !x.passed)
  const byPerspective = Object.fromEntries(PERSPECTIVES.map((p) => [p, checks.filter((x) => x.perspective === p).length]))
  const combinations = TENANT_ROLES.length * Object.keys(ROLES).length * OPERATIONS.length
  return { perspectives: PERSPECTIVES, operations: OPERATIONS, collections: [...SCOPES.collections, 'tenants', 'users'], tenantRoles: TENANT_ROLES, docketRoles: Object.keys(ROLES), combinations, combinationsSay: `${TENANT_ROLES.length} tenant roles × ${Object.keys(ROLES).length} docket roles × ${OPERATIONS.length} operations = ${combinations} role–operation combinations, each decided by one of three deciders: the user\'s roles, the x-qpu-role header, the entry\'s kind (textbook_access_combinations)`, access: ACCESS, checks, total: checks.length, passed: checks.length - failed.length, failed: failed.length, byPerspective, advantage: unlimited, angles: ANGLES, leads: failed.map((f) => ({ id: `access-${f.id.replace(/[^a-z0-9]+/gi, '-')}`, statement: `${f.id} (${f.perspective}): ${f.evidence}`, status: 'open' as const, remedy: f.hook, tool: 'audit' })), verdict: failed.length === 0 ? 'clean' : `${failed.length} finding(s), each a lead naming its hook`, says: 'the access audit from every perspective over the generated code and the answered configurations: every cell names its hook, its cost, its licence clause and its legal fact, so security and privacy are never apart from the licence and the legal terms' }
}

/** The MCP separated by an environment combination: every pure tool in every environment, the adapters and connectors the names choose, the
 *  plugins and the collections the app mounts; one address per combination (the fold of the sorted members), so two hosts in one environment
 *  mount the same set. The simplification: the MCP is organised around Payload's plugins and collections, each empowered by the one plugin
 *  (content addresses, involutions, teleports: minimal cost, every read free after the first). */
const scopeOf = (ctx: Context, env: readonly string[]) => {
  const ad = adaptersOf(env)
  const tools = listTools(ctx).map((t) => t.name)
  const plugins = PAYLOAD_PLUGINS.map((p) => p.name)
  const collections = Object.fromEntries(Object.entries(PLUGIN_COLLECTIONS).map(([plugin, slugs]) => [plugin, { collections: slugs, mcp: slugs.filter((s) => MCP_COLLECTIONS[s]?.enabled.find), powers: ['content address on create (a duplicate write is one row)', 'every read a cache hit by address', '304 by involution at the edge', 'teleported between steps', 'REST both ways under the three tenant roles'] }]))
  const { size, address } = setOf([...tools.map((t) => `tool:${t}`), ...plugins.map((p) => `plugin:${p}`), ...Object.values(PLUGIN_COLLECTIONS).flat().map((c) => `collection:${c}`), `adapter:${ad.chosen.database}`, `adapter:${ad.chosen.storage}`, `adapter:${ad.chosen.email}`, `profile:${ad.chosen.profile}`])
  return { env, profile: ad.chosen.profile, adapters: ad.chosen, connectors: ad.connectors, tools: tools.length, plugins, collections, members: size, address, angles: ANGLES, says: 'the MCP separated by its environment combination: every pure tool everywhere, the adapters and connectors the names choose, the plugins and collections the app mounts, each collection empowered by the one plugin at minimal cost; one address per combination' }
}

/** The branding, computed in real time from the tenant's address (the one quantum core) unless the tenant defines it in the admin (tenants.branding):
 *  the name, the tagline, the accent, the logo, the icon; each field says whether it is the user's or computed. Pure; the global and the Branding
 *  component render from it. */
type BrandingInput = { slug?: string; host?: string; name?: string; branding?: { name?: string | null; tagline?: string | null; accent?: string | null; logo?: { url?: string } | string | null; icon?: { url?: string } | string | null } | null }
const brandingOf = (t: BrandingInput = {}) => {
  const slug = t.slug ?? (t.host ? tenantOf(t.host) : 'uuidna')
  const address = uuidOf(`tenant:${slug}`); const s = styleOf(address)
  const user = t.branding ?? {}
  const urlOf = (x: { url?: string } | string | null | undefined) => (typeof x === 'string' ? x : x?.url) || null
  const name = user.name?.trim() || t.name || slug
  const accent = user.accent?.trim() || `hsl(${s.hue} ${s.sat}% 45%)`
  const esc = (x: string) => x.replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c] ?? c)
  const svg = (body: string, w: number, h: number) => 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(name)}">${body}</svg>`)
  const logo = urlOf(user.logo) ?? svg(`<rect x="0" y="4" width="36" height="36" rx="8" fill="${accent}"/><text x="46" y="31" font-family="system-ui, sans-serif" font-size="22" fill="#111">${esc(name)}</text>`, 194, 44)
  const icon = urlOf(user.icon) ?? svg(`<rect width="24" height="24" rx="6" fill="${accent}"/>`, 24, 24)
  const source = { name: user.name?.trim() ? 'user' : 'computed', tagline: user.tagline?.trim() ? 'user' : 'computed', accent: user.accent?.trim() ? 'user' : 'computed', logo: urlOf(user.logo) ? 'user' : 'computed', icon: urlOf(user.icon) ? 'user' : 'computed' } as const
  return { tenant: slug, address, name, tagline: user.tagline?.trim() || `${name} · @uuidna/qpu`, accent, hue: s.hue, colours: coilColour(), logo, icon, titleSuffix: ` · ${name}`, source, computed: Object.values(source).filter((v) => v === 'computed').length, says: 'the branding computed in real time from the tenant\'s address unless the tenant defines it in the admin (tenants.branding); every field says whose it is' }
}
/** The QPU as a fractal plugin hologram: the same shape at every scale — a block, a document, a page, the site, an app, a tenant's mount, the MCP —
 *  each addressed by the fold of the scale below, every block carrying the whole (its licence, its next address, the one address every mount
 *  shares). As an example of what the hologram presents: every block offers its ten program rotations in every locale as SEO pages from the
 *  address alone, so the count of URLs the sitemaps may present, the sitemaps that count needs within the protocol's limits, and the compliance
 *  every page carries are computed here (textbook_hologram_rotations, textbook_sitemap_capacity, textbook_fractal_scales). */
const hologramOf = (ctx: Context, origin = 'https://qpu.uuidna.com') => {
  const site = siteOf(ctx, origin)
  const docs = site.pages
  const gatePages = site.gates.pages
  const block = rpcOf(ctx, 'clay').result._meta.block.meta.id
  const app = appOf(ctx, { name: 'hologram', host: 'hologram.example', env: [] })
  const tools = listTools(ctx).map((t) => t.name)
  const scales = [
    { scale: 'block', address: block, holds: 'the tool, its arguments, its licence, its next address' },
    { scale: 'document', address: payloadDocOf({ uuid: block, tool: 'clay', arguments: {}, description: 'the register', origin }).id, holds: 'one block, nested by its referer, described for SEO' },
    { scale: 'page', address: uuidOf(site.gates.root), holds: 'the gates, three deep, each a doc of lexical leads' },
    { scale: 'site', address: uuidOf(site.byUseCase.map((u) => u.toolbox).sort().join('\n')), holds: `${docs} use-case pages and ${gatePages} gate pages` },
    { scale: 'app', address: app.bundle, holds: `${app.files} files, each at its address, the bundle their fold` },
    { scale: 'tenant', address: scopeOf(ctx, []).address, holds: 'the mount of the catalogue by an environment combination' },
    { scale: 'mcp', address: uuidOf(tools.sort().join('\n')), holds: `${tools.length} tools, every result a block` },
  ]
  const rotations = 10, locales = Object.keys(LOCALES).length, pages = docs + gatePages
  const urls = pages * rotations * locales, perSitemap = 50000, indexMax = 50000
  const sitemaps = Math.ceil(urls / perSitemap)
  return { scales: scales.length, scaleList: scales, selfSimilar: 'every scale a lexical document of qpu blocks, addressed by the fold of the scale below', hologram: 'every block carries the whole: its licence, its next address, the one address every mount of the catalogue shares', pages, rotations, locales, urls, perSitemap, sitemaps, indexMax, capacity: perSitemap * indexMax, fits: sitemaps <= indexMax, compliance: [{ law: LICENSE.spdx, how: 'every page links rel=license, states the attribution and the copyright; no derivative: a page is computed from its address, never edited' }, { law: 'data minimisation (GDPR art. 5)', how: 'no personal datum on any page: the address, the block, the licence' }, { law: 'canonical and hreflang', how: 'the origin page canonical; the rotations and the locales alternates' }, { law: 'schema.org JSON-LD', how: 'every page a WebPage of the SoftwareApplication, ISO 8601 dates, ISO 639-1 languages' }, { law: 'the sitemap protocol', how: '50,000 URLs and 50 MB a sitemap, 50,000 sitemaps an index' }], angles: ANGLES, says: 'the fractal plugin hologram: seven scales of one shape, and the SEO pages every block presents — ten rotations in every locale — counted with the sitemaps they need and the compliance each carries' }
}

export const PAYLOAD: Toolbox = {
  name: 'payload',
  idea: 'Payload\'s plugin schema as the one shape of every result: nested docs of lexical documents whose blocks are programmable UUID logic, SEO from the block, no custom collection, a few kilobytes computed once',
  tools: [payload, configure],
  examples: [
    { id: 'configure-versions', tool: 'configure', arguments: { kind: 'versions', lastTag: { version: 'v1.4.0', tools: ['processor', 'circuit', 'clay'] } }, shows: 'Versions define development and development defines versions: the current version from its single source, the next number from what the catalogue changed since the last tag (tools added: the minor digit carries), kept to single digits with a build address, the open leads as the version\'s plan, Payload\'s versioning over the RAID (every version an entry, never overwritten, no cap).', expect: (s) => (s.config.current === '1.4.0' && s.config.next.bump === 'minor' && s.config.next.next.startsWith('1.5.0+e1.') && s.config.next.digits === 'single' && s.config.next.added.length >= 30 && s.config.defines.openLeads > 0 && s.config.payload.collections.pages.versions.maxPerDoc === 0 && s.torus.closed ? null : JSON.stringify(s.config.next).slice(0, 120)) },
    { id: 'configure-migration', tool: 'configure', theorem: 'textbook_providers_are_tenants_plus_operator', arguments: { kind: 'migration' }, shows: 'A provider added or moved at 100 % uptime: deploy beside, mirror the docket by address, decode old and new as copies through the gate, route, and the rollback is the earlier version still answering.', expect: (s) => (s.config.steps.length === 5 && s.config.providers.length === 3 && s.config.uptime.startsWith('100') ? null : `${s.config.steps?.length} steps`) },
    { id: 'configure-api', tool: 'configure', theorem: 'textbook_openapi_contract', arguments: { kind: 'api' }, shows: 'The QPU\'s API overview as data, the way platform.claude.com\'s overview is one for the Claude API: one MCP endpoint and every surface around it, the headers, the authorization (none for every pure tool), the content addressing and its involution, the tools by toolbox, the MCP connector for Claude and for any client, quick tests, limits and errors; docs/api.md is written from it.', expect: (s) => (s.config.endpoints.length >= 10 && s.config.tools.length >= 41 && s.config.openapi.openapi === '3.1.0' && Object.keys(s.config.openapi.components.schemas).length - 2 === s.config.tools.length && Object.keys(s.config.openapi.paths).length === new Set(s.config.endpoints.map((e: { path: string }) => e.path)).size && String(s.config.standard.detected).startsWith('openapi 3.1') && s.config.mcpConnector.claude.mcp_servers[0].name === 'qpu' && s.config.quickTests.length === 4 && s.config.authorization.pure.includes('without a credential') && s.torus.closed ? null : `${s.config.endpoints?.length} endpoints, ${s.config.tools?.length} tools`) },
    { id: 'configure-fullstack', tool: 'configure', theorem: 'textbook_fullstack_files_by_role', arguments: { kind: 'fullstack' }, shows: 'QPU\'s full stack from the source of payloadcms.com (MIT): its twelve collections, thirty blocks, globals and fields kept, the qpu block added, search, multi-tenant and mcp added to its four plugins, the database the RAID, storage and deploy at Cloudflare; two source files and a README generated for the fork.', expect: (s) => (s.config.keep.blocks.length === 30 && s.config.add.block === 'qpu' && s.config.partition === `${s.config.partition.split(' = ')[0]} = ${Object.keys(s.config.files).length}` && s.config.partition.split(' = ')[0].split(' + ').reduce((n: number, x: string) => n + Number(x), 0) === Object.keys(s.config.files).length && Object.keys(s.config.files).every((f) => f.startsWith('.qpu-app/')) && s.config.files[fileOf('config', 'adapters')].includes('sqliteD1Adapter') && s.config.files[fileOf('hooks', 'users')].includes('firstUserBootstrap') && s.config.files[fileOf('component', 'index')].includes('QpuApp') && s.config.files[fileOf('config', 'ecommerce')].includes('ecommercePlugin(') && s.config.files[fileOf('collection', 'tenants')].includes("slug: 'tenants'") && s.config.files[fileOf('component', 'App')].includes('ui/initialize') && s.config.files[fileOf('config', 'mcp')].includes('qpuMcpTools') && s.config.files[fileOf('notice', 'notice')].includes('MIT') && s.config.files[fileOf('block', 'qpu')].startsWith('// Tsvetan Rouschev, @uuidna/qpu, CC-BY-NC-ND-4.0') && s.config.files[fileOf('block', 'qpu')].includes("slug: 'qpu'") && s.config.steps.length === 5 && s.torus.closed ? null : `${s.config.keep?.blocks?.length} blocks`) },
    { id: 'configure-files', tool: 'configure', theorem: 'textbook_configs_partition', arguments: { files: true }, shows: 'Every configuration\'s file and its source: seven kinds the tool writes on every run (wrangler, the PWA manifest, the full stack\'s files, the bindings\' env example, the shadcn registry, the app\'s wrangler, the plugin that carries the hooks), two the hand holds and MCP measures (the Payload config that mounts the plugin and the adapters, the app\'s rewrites), fourteen answered inside them (realtime, sets, gates, scopes, fields, validations, access, hooks, bindings, actions and the rest) — next always improves them.', expect: (s) => (s.tool + s.hand + s.unfiled === s.kinds && s.kinds === configKinds.length && s.tool === CONFIG_FILES.filter((f) => f.source === 'tool').length ? null : JSON.stringify(s)) },
    { id: 'configure-packages', tool: 'configure', theorem: 'textbook_packages_partition', arguments: { kind: 'packages' }, shows: 'The packages Payload ships, read from the packages directory of payloadcms/payload: twelve plugins, five databases, five storages, two email adapters, one editor, three live-preview packages and seventeen of runtime and tooling; which the full stack mounts, which stay available, and the minimum-cost path (Payload\'s own D1 and R2 adapters).', expect: (s) => (s.config.count === PAYLOAD_PACKAGES.names.length && Object.values(s.config.counts as Record<string, number>).reduce((a, n) => a + n, 0) === s.config.count && s.config.unknown.length === 0 && s.config.minimumCost.cloudflare.length === 2 ? null : JSON.stringify(s.config.counts)) },
    { id: 'configure-ecommerce', tool: 'configure', theorem: 'textbook_catalogue_prices', arguments: { kind: 'ecommerce' }, shows: 'The licence catalogue as Payload\'s own ecommerce, configured as the ecommerce template configures it: six products in seven variants priced in three currencies (twenty-one prices), the Stripe adapter as the payment, access by the site\'s roles, the order\'s access token as the licence key; the fork\'s Stripe plugin replaced, the Worker\'s checkout kept until the gate decodes the app.', expect: (s) => (s.config.catalogue.products === new Set(CATALOGUE.map((v) => v.product)).size && s.config.catalogue.variants === CATALOGUE.length && s.config.catalogue.prices === CATALOGUE.length * QPU_CURRENCIES.length && s.config.plugin.collections.length === 8 ? null : JSON.stringify(s.config.catalogue)) },
    { id: 'configure-adapters-port', tool: 'configure', theorem: 'textbook_ports_cover', arguments: { kind: 'adapters', port: true }, shows: 'Every database, storage and mail adapter of the Payload app ported onto Cloudflare as its documentation states the port — D1 native, SQLite into D1, Postgres and Vercel Postgres over Hyperdrive, MongoDB over TCP sockets with its client in a Durable Object, R2 native, S3 and GCS by Super Slurper or Sippy, Azure by Sippy, Vercel Blob copied by the app, Resend over HTTP, SMTP replaced by the send_email binding — every combination composed from its mixed-radix index into one workflow; the ones that port completely counted, every missing link a lead naming the combinations it blocks.', expect: (r) => { const s = r.config; return s.combinations === PORT_RADICES.reduce((a, n) => a * n, 1) && s.complete + s.blocked === s.combinations && s.completeOnes.includes('db-d1-sqlite + storage-r2 + email-resend') && s.missingLinks > 0 && s.leads.length === s.missingLinks && s.mcpTools.includes('d1_database_create') && s.writes.every((w: string) => /create|query/.test(w)) ? null : String(s.says) } },
    { id: 'configure-adapters-port-one', tool: 'configure', theorem: 'textbook_mixed_radix', arguments: { kind: 'adapters', port: Number(compositionIndexOf([...PORT_RADICES], [3, 1, 0])) }, shows: 'One combination from its index: the mixed-radix digits 3, 1, 0 — SQLite, R2 and SMTP — so its workflow dumps the SQLite file into D1, creates the R2 bucket and replaces SMTP by the send_email binding, every step beside the Cloudflare MCP call that does it, the plan the paid one (sending to any recipient), the missing links named.', expect: (r) => { const s = r.config; return s.digits.join('') === '310' && s.database === 'db-sqlite' && s.storage === 'storage-r2' && s.email === 'email-nodemailer' && s.plan === 'paid' && s.complete === false && s.workflow.length === 9 && 'd1_databases' in s.bindings && 'r2_buckets' in s.bindings && 'send_email' in s.bindings ? null : JSON.stringify({ d: s.digits, w: s.workflow?.length }) } },
    { id: 'configure-adapters', tool: 'configure', theorem: 'textbook_adapter_combinations', arguments: { kind: 'adapters', env: ['D1', 'R2', 'RESEND_API_KEY'] }, shows: 'Payload\'s adapters as a matrix over providers and Cloudflare bindings — the database, storage and email adapters Payload holds, multiplied — the combination chosen by what the environment names (here D1, R2 and Resend: the Cloudflare profile), the app\'s own wrangler with every binding, and the RAID\'s docket as the semantics over whichever database answers.', expect: (s) => (s.config.combinations === PORT_RADICES.reduce((a, n) => a * n, 1) && s.config.chosen.database === 'db-d1-sqlite' && s.config.chosen.storage === 'storage-r2' && s.config.chosen.email === 'email-resend' && s.config.chosen.profile === 'cloudflare' && s.config.wrangler.d1_databases.length === 1 ? null : JSON.stringify(s.config.chosen)) },
    { id: 'configure-realtime', tool: 'configure', theorem: 'textbook_edit_collides', arguments: { kind: 'realtime' }, shows: 'Realtime collaboration and editing through every channel Payload streams — the document lock, the live preview, autosave, versions, the MCP event stream — with collisions managed precisely: an edit names the address it read and is accepted only while the document still folds to it; a collision is answered with both addresses (no third case, by theorem), never a silent overwrite; the messaging during editing is the lock, the preview, the collision answer and the version; a message channel between editors is an open lead.', expect: (s) => (s.config.streams.length === 6 && s.config.collisions.theorem === 'textbook_edit_collides' && s.config.collisions.hook === fileOf('hooks', 'pages') && s.config.held.must.length === 4 && s.config.collisions.precondition.includes('editBase') ? null : JSON.stringify(s.config.collisions)) },
    { id: 'configure-sets', tool: 'configure', theorem: 'textbook_set_union', arguments: { kind: 'sets', sets: ['legal', 'crypto'] }, shows: 'The MCP as config sets of widget-skilled tools, and the SDK those sets found: a builder per set, per core operation and per collection of the Payload MCP plugin (configure, sets, app.form/validate/build, present, stream, gates, realtime, schema, call, collections.find/create/update/delete, plugins.<name>.find/create/update, plugins.compose, plugins.list), one module over MCP served as the resource sdk://qpu/lib by this server and by the plugin — via Payload MCP and vice versa — nothing loaded; the server is the set of every element (tools, each with its widget and its skill; resources, examples, configuration kinds, theorems), a toolbox a subset, a tenant\'s mount the whole set, each addressed by the fold of its sorted members so every mount shares one address; two sets composed by union, intersection and difference with inclusion–exclusion holding; the initialize answer derived from the set and agreeing with the live one.', expect: (s) => (s.config.mounts.oneAddress && s.config.widgetSkilled.every && s.config.sdk.builders.length === 22 && s.config.sdk.kinds === configKinds.length && s.config.algebra.inclusionExclusion && s.config.algebra.intersection.size === 0 && s.config.algebra.union.size === s.config.sets.find((x: { name: string }) => x.name === 'legal').size + s.config.sets.find((x: { name: string }) => x.name === 'crypto').size && s.config.initialize.agrees && s.config.partition.sizes.reduce((n: number, x: number) => n + x, 0) === s.config.sets.find((x: { name: string }) => x.name === 'tools').size ? null : JSON.stringify({ mounts: s.config.mounts, algebra: s.config.algebra.inclusionExclusion, initialize: s.config.initialize })) },
    { id: 'configure-gates', tool: 'configure', theorem: 'textbook_gates_partition', arguments: { kind: 'gates' }, shows: 'Every API as a gate of some sort — a door of this catalogue, an open address, one keyed by the tenant, one a browser alone passes, one the registry names — organised as nested docs three deep (Gates › category › gate) so each doc is a gate of lexical leads: the leads that pass through it listed in its body and answered live by its one block.', expect: (s) => (s.config.tree.depth === 3 && s.config.counts.gates === s.config.gates.length && s.config.counts.own + s.config.counts.external === s.config.counts.gates && s.config.leads.placed > 0 && s.config.counts.partition.split(' = ')[0].split(' + ').reduce((n: number, x: string) => n + Number(x), 0) === s.config.counts.gates && s.config.adapters.total === s.config.counts.gates && s.config.gates.every((g: { adapter: { lands: string; ui: { item: string }; rest: { directions: number; roles: number } } }) => g.adapter.lands && g.adapter.ui.item.startsWith('qpu-') && g.adapter.rest.directions * g.adapter.rest.roles === 6) && s.config.streams.configs.length === configKinds.length && s.config.gates.every((g: { adapter: { stream: { uuids: string[] } } }) => g.adapter.stream.uuids.length >= 2) && s.config.gates.every((g: { leads: string[] }) => g.leads.every((id: string) => typeof id === 'string')) ? null : JSON.stringify(s.config.counts)) },
    { id: 'configure-ui-hex', tool: 'configure', theorem: 'textbook_hex_presentations', arguments: { kind: 'ui', hex: '941ef62e-d97b-2438-bfc8-22ae9e5da781' }, shows: 'Any hex is presentable as a shadcn combination: each of the thirty-two nibbles of a UUID picks one of the eight registry items and one of two variants (sixteen choices a nibble), the whole layout styled from the hex itself (hue from the handle, saturation and lightness from the program, radius and gap from the tail); nothing loaded.', expect: (s) => (s.config.presentation.nibbles === 32 && s.config.presentation.choices === 16 && s.config.presentation.parts.length === 32 && s.config.presentation.parts.every((p: { item: string; variant: string }) => ['solid', 'outline'].includes(p.variant) && p.item.startsWith('qpu-')) && /^rgb\(\d+ \d+ \d+\)$/.test(s.config.presentation.style['--qpu-accent']) && s.config.styled.items.length === 7 ? null : JSON.stringify(s.config.presentation?.parts?.slice(0, 2))) },
    { id: 'configure-ui-stream', tool: 'configure', theorem: 'textbook_stream_filter', arguments: { kind: 'ui', stream: ['941ef62e-d97b-2438-bfc8-22ae9e5da781', '016da774-e74c-2e44-8742-f8bcf5e8e8f5', '00000000-0000-1000-8000-000000000000'], query: { sort: 'hue', execute: true } }, shows: 'A UUID-only stream sorted by the hue each address computes from itself and executed as its program rotated (the next address) with the page and the dashboard it answers; the same core the crypto fold tool exposes; nothing read but the stream.', expect: (s) => (s.config.stream.stream === 3 && s.config.stream.filtered === 3 && s.config.stream.rows.every((r: { next: string; page: string }) => /^[0-9a-f-]{36}$/.test(r.next) && r.page.startsWith('https://')) && s.config.stream.rows.every((r: { hue: number }, i: number, a: { hue: number }[]) => i === 0 || a[i - 1]!.hue <= r.hue) ? null : JSON.stringify(s.config.stream.rows)) },
    { id: 'configure-ui', tool: 'configure', theorem: 'textbook_ui_deterministic', arguments: { kind: 'ui' }, shows: 'The UI as a configuration: the MCP Apps extension, the mime type, the ui://qpu/<tool> scheme, the host\'s theme variables mapped onto the widgets\' tokens, an empty CSP, one app shell that is a pure function of the key and the theme — hosted by any host that negotiates the extension and by the site\'s playground.', expect: (s) => (s.config.extension === 'io.modelcontextprotocol/ui' && s.config.mimeType === 'text/html;profile=mcp-app' && s.config.tokens.length === UI_TOKENS.length && s.config.csp.connectDomains.length === 0 && s.config.registry.items.length === 12 && s.config.styled.items.length === 7 && String(s.config.registry.items[0]).startsWith('qpu-create') ? null : JSON.stringify(s.config.registry)) },
    { id: 'configure-scopes', tool: 'configure', arguments: { kind: 'scopes' }, shows: 'The scopes: three tenants over four scoped collections (pages, entries, products, orders), three roles per tenant on every user (tenant-admin, editor, viewer) beside the three roles over the docket, a super admin by the admin role, an API key per user for MCP clients; scaling is a tenant added, never code.', expect: (s) => (s.config.tenants.length === 3 && s.config.roles.length === 3 ? null : JSON.stringify(s.config)) },
    { id: 'configure-fields', tool: 'configure', arguments: { kind: 'fields' }, shows: 'The fields QPU adds to Payload: six of the entries collection, eight of the qpu block, each with its validation.', expect: (s) => (s.config.entries.length === 6 && s.config.qpu.length === 9 ? null : JSON.stringify(s.config)) },
    { id: 'configure-validations', tool: 'configure', theorem: 'textbook_sha256_is_64', arguments: { kind: 'validations' }, shows: 'Payload validated through its own field and hook validation, harmonically: every pattern the tree generates (UUIDs of 36 characters, kinds of lower-case letters and dashes, digests of 64 hex digits, slugs and binding names of 37 symbols) named by the theorem that states its arithmetic and carried in the field\'s custom; every hook named by its theorem (the address an involution, the 404 answer a fallback involution, the collision guard the edit theorem); the a432 harmonic default the basis (the free variant, the accent when empty); a validation or hook no theorem states is a lead, never a convention kept quiet.', expect: (s) => (s.config.validations.length === VALIDATIONS.length && s.config.validations.every((v: { pattern: string }) => new RegExp(v.pattern) instanceof RegExp) && s.config.backed.validations === VALIDATIONS.filter((v) => v.theorem).length && s.config.backed.hooks === hookNames() && s.config.harmonic.key === 432 && s.config.harmonic.hue === 72 && s.config.leads.length === VALIDATIONS.filter((v) => !v.theorem).length && s.config.leads.every((l: { status: string }) => l.status === 'open') ? null : `${s.config.backed.validations} backed, ${s.config.leads.length} leads`) },
    { id: 'configure-access', tool: 'configure', arguments: { kind: 'access' }, shows: 'Access by role carried from the Worker into Payload: everyone reads, a writer creates, no one updates an entry (it is its content address), an admin deletes.', expect: (s) => (s.config.entries.update.startsWith('no one') ? null : JSON.stringify(s.config)) },
    { id: 'configure-actions', tool: 'configure', arguments: { kind: 'actions', experience: { copies: 546, involutions: 507, msByHost: { 'qpu.uuidna.com': 120, 'qpu.psg.bg': 140, 'qpu.ceci.workers.dev': 110 } } }, shows: 'Actions at quantum scale: a JSON-RPC array answered as one array, Payload\'s bulk REST by where, a batch above the quantum sharded and run as one wave, input and output coordinated by address; the shard size follows the experience the gate measured (the slowest host\'s median).', expect: (s) => (s.config.experience.freeShare === 93 && s.config.experience.shardSize === 7 ? null : JSON.stringify(s.config.experience)) },
    { id: 'configure-hooks', tool: 'configure', theorem: 'textbook_witness_pair', arguments: { kind: 'hooks' }, shows: 'The witnesses qpuHooksOf binds: seven collection pairs among 33 hooks.', expect: (s) => (s.config.pairs.collection.filter((p: { paired: boolean }) => p.paired).length === 7 && s.config.witnesses === hookNames() && s.torus.closed ? null : JSON.stringify(s.config.pairs)) },
    { id: 'configure-bindings', tool: 'configure', arguments: { kind: 'bindings', env: ['DATABASE_URI', 'PAYLOAD_SECRET'] }, shows: 'Every provider the full stack binds to at full scale and minimum cost: its bindings, its variable names per tenant (never values), its free tier, what is paid for and what the hooks and involutions keep free.', expect: (s) => (s.config.providers.length === 10 && s.torus.closed ? null : JSON.stringify(s.torus)) },
    { id: 'configure-bindings-google', tool: 'configure', theorem: 'textbook_bindings_used_google', arguments: { kind: 'bindings', env: ['DATABASE_URI'] }, shows: 'Every Cloudflare binding is used and usable the Google way: the bindings config pairs each role — compute, database, object store, key-value, email — with a Cloudflare binding and its google-cloud equivalent (Worker↔Cloud Run, D1/DOCKET↔Cloud SQL, R2↔Cloud Storage, KV↔Firestore, Email↔Gmail) and names what uses it (qpuRaidDb for data/object/key-value, the Worker for compute, the email adapter for mail), none idle, so the same app the Payload admin drives runs on either cloud.', expect: (s) => { const r = s.config.roles as { cloudflare: string; google: string; usedBy: string; idle: boolean }[]; return Array.isArray(r) && r.length === 5 && r.every((x) => x.cloudflare && x.google && x.usedBy && x.idle === false) && r.some((x) => /qpuRaidDb/.test(x.usedBy)) && r.some((x) => /Cloud Run/.test(x.google)) && r.some((x) => /Gmail/.test(x.google)) ? null : JSON.stringify(r) } },
    { id: 'configure-all', tool: 'configure', theorem: 'textbook_reflection_sums_to_ten', arguments: {}, shows: 'Every configuration MCP computes, tested around the torus: Payload\'s plugins, the Worker, the tenants\' variable names, the manifest, the registration, the versions, the migration, the full stack; each with its address, seed, reflection and trinity, every loop closed.', expect: (s) => (s.kinds === configKinds.length && s.tested === s.kinds && s.closed === true && s.configs.every((c: { torus: { reflection: number; seed: number } }) => c.torus.seed + c.torus.reflection === 10) ? null : `${s.tested}/${s.kinds} closed`) },
    { id: 'configure-payload', tool: 'configure', theorem: 'textbook_plugin_combinations', arguments: { kind: 'payload' }, shows: 'Payload configured by MCP: nine default plugins over the one pages collection, the lexical block qpu with its UUID logic fields, the tenants in multi-tenant, the licence catalogue in ecommerce, 512 combinations.', expect: (s) => (s.config.plugins.length === PAYLOAD_PLUGINS.length && s.config.combinations === 2 ** s.config.plugins.length && s.config.collections.length === 1 && s.config.plugins[0].lexical.blocks[0] === 'qpu' && s.torus.closed ? null : `${s.config.plugins?.length} plugins`) },
    { id: 'configure-wrangler-set', tool: 'configure', theorem: 'textbook_deploy_sets', arguments: { kind: 'wrangler', template: 'site', useCase: 'metered' }, shows: 'The deploy via wrangler as usable as direct use and set for every template and use case, deploySetOf for one and deploySetsOf for all: the Worker, the Payload app and a generated app over every product of the catalogue (three times eight sets), each a wrangler environment in the template\'s own file deployed by name beside the default deploy (its workers.dev name, its own D1, R2 and KV, the use case in its vars), the same tools and addresses the handler answers in-process, decoded by the gate.', expect: (s) => (s.sets.total === s.sets.templates * s.sets.useCases && s.sets.templates === DEPLOY_TEMPLATES.length && s.sets.useCases === DEPLOY_USE_CASES.length && s.set.wrangler.name === 'qpu-site-metered' && s.set.wrangler.vars.QPU_USE_CASE === 'metered' && s.set.metered === true && s.set.wrangler.d1_databases[0].database_name === 'qpu-site-metered' && s.set.commands.deploy.includes('--env metered') && Object.keys(s.config.env).length === DEPLOY_USE_CASES.length && s.config.env.a432.vars.QPU_LICENCE.startsWith('a432') && s.config.env.a432.vars.QPU_TEMPLATE === 'site' ? null : `${s.sets.total} sets, ${s.set.wrangler.name}`) },
    { id: 'configure-wrangler-drift', tool: 'configure', arguments: { kind: 'wrangler', current: '{ "name": "qpu", "main": "src/worker.ts", "routes": [] }' }, shows: 'The Worker configuration compared to a text a client holds: every differing path is a lead, nothing is rewritten by the tool.', expect: (s) => (s.driftCount >= 5 && s.drift.includes('routes') && s.leads.every((l: { status: string }) => l.status === 'open') ? null : `${s.driftCount} drift`) },
    { id: 'configure-tenant-missing', tool: 'configure', arguments: { kind: 'tenant', env: ['QPU_WRITE_TOKEN_UUIDNA', 'QPU_ADMIN_TOKEN_UUIDNA', 'QPU_DATA_KEY'] }, shows: 'Each tenant\'s variable names and which an environment lacks: Stripe keys and the Cloudflare MCP tokens are the operator\'s to set; values never travel.', expect: (s) => (s.missing.length === 3 && s.missing[0].tenant === 'uuidna' && s.missing[0].secrets.includes('STRIPE_SECRET_KEY_UUIDNA') && s.missing[0].secrets.includes('QPU_MCP_TOKEN_BINDINGS_MCP_CLOUDFLARE_COM_UUIDNA') && !s.missing[0].secrets.includes('QPU_WRITE_TOKEN_UUIDNA') ? null : JSON.stringify(s.missing?.[0]).slice(0, 120)) },
    { id: 'configure-ui-coverage', tool: 'configure', theorem: 'textbook_widgets_cover_mcp', arguments: { kind: 'ui' }, shows: 'The shadcn widgets covering every tool of the MCP: each tool\'s example block presented as a combination of the eight registry items in two variants, sixteen choices a nibble chosen by the address alone, nothing loaded, every widget free by involution after the first — minimum code, memory and cost at unlimited advantage.', expect: (s) => (s.config.coverage.covered === s.config.coverage.tools && s.config.coverage.tools >= 46 && s.config.coverage.choicesPerNibble === 16 && s.config.coverage.loaded === 0 ? null : JSON.stringify(s.config.coverage)) },
    { id: 'configure-branding', tool: 'configure', theorem: 'textbook_fractal_scales', arguments: { kind: 'branding', branding: { host: 'qpu.psg.bg' } }, shows: 'The branding of a tenant computed in real time from its address: the name, the tagline, the accent from its hue, the logo and the icon as SVG data, every field computed because the tenant defined none.', expect: (s) => (s.config.tenant === 'psg' && s.config.computed === 5 && s.config.accent.startsWith('hsl(') && s.config.logo.startsWith('data:image/svg+xml') && s.config.source.name === 'computed' ? null : JSON.stringify(s.config.source)) },
    { id: 'configure-branding-user', tool: 'configure', arguments: { kind: 'branding', branding: { host: 'qpu.psg.bg', branding: { name: 'PSG consulting', accent: '#123456', logo: { url: 'https://qpu.psg.bg/media/logo.svg' } } } }, shows: 'The same tenant with a name, an accent and a logo defined in the admin: those three are the user\'s, the tagline and the icon still computed.', expect: (s) => (s.config.name === 'PSG consulting' && s.config.accent === '#123456' && s.config.logo === 'https://qpu.psg.bg/media/logo.svg' && s.config.source.name === 'user' && s.config.source.icon === 'computed' && s.config.computed === 2 ? null : JSON.stringify(s.config.source)) },
    { id: 'payload-schemas', tool: 'payload', theorem: 'textbook_payload_schemas', arguments: { schemas: true, collection: { slug: 'pages', fields: [{ name: 'title', type: 'text', required: true }, { name: 'layout', type: 'blocks', blocks: [{ slug: 'qpu', fields: [{ name: 'tool', type: 'text' }, { name: 'uuid', type: 'text' }] }] }, { name: 'meta', type: 'group', fields: [{ name: 'description', type: 'textarea' }] }, { name: 'tenant', type: 'relationship', relationTo: 'tenants' }, { type: 'tabs', tabs: [{ name: 'seo', fields: [{ name: 'keywords', type: 'select', hasMany: true, options: ['quantum', 'uuid'] }] }] }] } }, shows: 'Payload\'s combinatorial surface handled programmatically and in real time: every field type, operation, where operator, hook, access function and realtime channel read from Payload\'s docs and source into one table; every dimension named and meant by its textbook theorem (nineteen data field types over seventeen collection operations are 323 schemas, sixteen operators over nineteen types 304 queries, thirty hooks, sixteen access functions, eight channels over fifty operations 400 coordinations), each count computed from the table and decided through the match tool, which serves the kernel-accepted theorem; any collection\'s fields as JSON Schema 2020-12, the GraphQL type, the MCP plugin\'s tools and the OpenAPI 3.1 paths; the thirteen standards each part is described by; the sources re-read by the textbook step, drift a lead.', expect: (s) => (s.dimensions.length === 7 && s.agreeing === 7 && s.served === 7 && s.schema.jsonSchema.required.includes('title') && s.schema.jsonSchema.properties.layout.items.oneOf[0].properties.blockType.const === 'qpu' && s.schema.jsonSchema.properties.meta.properties.description && s.schema.jsonSchema.properties.seo.properties.keywords.items.enum.length === 2 && s.schema.graphql.includes('type Pages') && s.schema.mcpTools.length >= 5 && Object.keys(s.schema.openapiPaths).includes('/api/pages/{id}') && s.standards.length === 13 && s.coordination.length === 8 && s.requestList.length === 11 && s.leads.length === 0 ? null : `${s.agreeing} agree, ${s.served} served, ${s.leads.length} leads`) },
    { id: 'payload-hologram', tool: 'payload', theorem: 'textbook_hologram_rotations', arguments: { hologram: true }, shows: 'The QPU as a fractal plugin hologram: seven scales of one shape — block, document, page, site, app, tenant, MCP — each with its address; and what the hologram presents: every block its ten program rotations in every locale as SEO pages from the address alone, counted with the sitemaps that count needs within the protocol\'s limits and the compliance every page carries — mass coverage with strict compliance.', expect: (s) => (s.scales === 7 && s.rotations === 10 && s.locales === Object.keys(LOCALES).length && s.urls === s.pages * 110 && s.sitemaps === Math.ceil(s.urls / 50000) && s.fits && s.compliance.length === 5 && s.capacity === 2500000000 ? null : JSON.stringify({ scales: s.scales, urls: s.urls, pages: s.pages })) },
    { id: 'dashboard-attest', tool: 'dashboard', arguments: { tool: 'attest' }, shows: 'The attest tool laid out whole as dashboard cells: its one enumerable facet (plan, read) and the cells each a final combination with a link to its walk — the NIST beacon, CERN open data and the CODATA constants verified by theorems, usable from the dashboard widget.', expect: (s) => (s.tool === 'attest' && s.cells === 2 && s.facetList.some((f: { property: string; values: string[] }) => f.property === 'op' && f.values.includes('read')) ? null : JSON.stringify({ cells: s.cells })) },
    { id: 'payload-attest-doc', tool: 'payload', theorem: 'sigma_planck', arguments: { tool: 'attest', arguments: { op: 'plan' } }, shows: 'The attest plan — every crypto and certificate API with NIST and CERN, the theorems verified over the answers — as the Payload document its plugins hold: one qpu block rendered by the shadcn widget, usable through the Payload MCP plugin; the Planck relation the Physics module proves among the theorems the wave verifies.', expect: (s) => (s.tool === 'attest' && s.blocks === 1 && s.doc.lexical.root.children.some((n: { type: string; fields?: { tool?: string } }) => n.type === 'block' && n.fields?.tool === 'attest') ? null : JSON.stringify({ blocks: s.blocks })) },
    { id: 'payload-merge', tool: 'payload', theorem: 'textbook_merge_commutes', arguments: { merge: { base: docOf('base', [{ uuid: '016da774-e74c-2e44-8742-f8bcf5e8e8f5', tool: 'clay', arguments: {} }, { uuid: '00000000-0000-1000-8000-000000000000', tool: 'software', arguments: {} }]), a: docOf('a', [{ uuid: '016da774-e74c-2e44-8742-f8bcf5e8e8f5', tool: 'clay', arguments: {} }, { uuid: '00000000-0000-1000-8000-000000000000', tool: 'software', arguments: {} }, { uuid: '941ef62e-d97b-2438-bfc8-22ae9e5da781', tool: 'roadmap', arguments: {} }]), b: docOf('b', [{ uuid: '016da774-e74c-2e44-8742-f8bcf5e8e8f5', tool: 'clay', arguments: {} }]) } }, shows: 'Two edits of one document merged by block address: a added a block, b removed one; the merge keeps what either holds and neither removed (two blocks), no address holds two contents here so nothing collides, and the merge commutes and is idempotent; from the 60-degree angle the streams are collision free and cover the 90-degree gateways.', expect: (s) => (s.phase === 'merge' && s.blocks === 2 && s.removed === 1 && s.fromA === 1 && s.both === 1 && s.collisions === 0 && s.angles.perspectives === 6 && s.angles.operations === 4 ? null : JSON.stringify({ blocks: s.blocks, removed: s.removed, fromA: s.fromA, both: s.both })) },
    { id: 'payload-app-lexical', tool: 'payload', theorem: 'textbook_app_doc_blocks', arguments: { app: { name: 'Acme research', host: 'research.acme.com', env: ['D1', 'R2', 'RESEND_API_KEY'], variant: 'yearly' } }, shows: 'The app on request as a lexical document: one qpu block per generated file at its content address and one for the bundle, twenty-three blocks, the licence and the price as the paragraph after — the shape every builder answers in, shown in the Apps UI and edited in the admin.', expect: (s) => (s.docBlocks > 0 && s.doc.root.children.filter((n: { type: string }) => n.type === 'block').length === s.docBlocks && s.doc.root.children[0].type === 'heading' ? null : `${s.docBlocks} blocks`) },
    { id: 'configure-scope', tool: 'configure', theorem: 'textbook_streams_cover_gateways', arguments: { kind: 'sets', env: ['D1', 'R2', 'RESEND_API_KEY', 'OAUTH_KV'] }, shows: 'The MCP separated by an environment combination: with D1, R2, Resend and the OAuth KV named, the cloudflare profile, every pure tool, the plugins and the collections the app mounts, each collection empowered by the one plugin; one address for the combination, so two hosts in it mount the same set.', expect: (s) => (s.config.profile === 'cloudflare' && s.config.tools >= 46 && s.config.plugins.length > 0 && /^[0-9a-f-]{36}$/.test(s.config.address) && String(s.config.connectors.oauth).startsWith('workers-oauth-provider') && s.config.angles.faces === 8 ? null : JSON.stringify({ profile: s.config.profile, tools: s.config.tools })) },
    { id: 'configure-google-apis', tool: 'configure', theorem: 'textbook_google_api_surfaces', arguments: { kind: 'gates', google: { list: { items: [{ name: 'blogger', version: 'v3', title: 'Blogger API' }, { name: 'admin', version: 'directory_v1', title: 'Admin SDK API' }, { name: 'books', version: 'v1', title: 'Books API' }] }, documents: { 'blogger-v3': { resources: { posts: { methods: { list: { id: 'blogger.posts.list', httpMethod: 'GET', scopes: ['/auth/blogger.readonly'] }, insert: { id: 'blogger.posts.insert', httpMethod: 'POST', scopes: ['/auth/blogger'] } } } } }, 'admin-directory_v1': { resources: { users: { methods: { list: { id: 'directory.users.list', httpMethod: 'GET', scopes: ['/auth/admin.directory.user.readonly'] } } } } } } } }, shows: 'Every Google API usable in the admin and the frontend as a gate of its own: Blogger\'s posts read in the frontend under the tenant\'s API key and written in the admin under its OAuth, the Admin SDK\'s directory only under a Workspace admin\'s domain-wide delegation, Books waiting for its Discovery document; every call through payload { googleCall }.', expect: (s) => { const g = (id: string) => s.config.gates.find((x: { id: string }) => x.id === id); return g('google-blogger-v3')?.measured.startsWith('2 methods: 1 reads') && /delegation/.test(g('google-admin-directory_v1')?.measured ?? '') && !/delegation/.test(g('google-blogger-v3').measured) && /not read yet/.test(g('google-books-v1')?.measured ?? '') && s.config.categories.some((c: { id: string; gates: number }) => c.id === 'google-apis' && c.gates === 3) ? null : JSON.stringify(s.config.gates.filter((x: { category: string }) => x.category === 'google-apis')) } },
    { id: 'configure-dependencies', tool: 'configure', theorem: 'textbook_poles_pyramid', arguments: { kind: 'gates', devDependencies: { typescript: '5', tsx: '4', vitepress: '2', wrangler: '4', '@types/node': '26' } }, shows: 'Every dev dependency imagined as an MCP door usable in the UI: five gates of the dependencies category, each the step of next that runs it, its gate page carrying that step\'s block rendered by the MCP App.', expect: (s) => (s.config.gates.filter((g: { category: string }) => g.category === 'dependencies').length === 5 && s.config.gates.some((g: { id: string; by: string }) => g.id === 'dependency-typescript' && g.by === 'typecheck') ? null : `${s.config.gates.filter((g: { category: string }) => g.category === 'dependencies').length} dependency gates`) },
    { id: 'configure-connectors', tool: 'configure', theorem: 'textbook_bindings_named_not_valued', arguments: { kind: 'adapters', env: ['D1', 'R2', 'OAUTH_KV', 'MCP_PUBLISHER_TOKEN'] }, shows: 'The QPU as a Cloudflare connector and an AI connector at once, a dimension of the adapters: with OAUTH_KV and MCP_PUBLISHER_TOKEN named, the docket roles are OAuth scopes under the RFC 9728 metadata and the registry entry is published; without them the tenant tokens stand and the entry is proposed; every binding a name a tenant admin selects in Payload (tenants.bindings), never a value.', expect: (s) => (s.config.chosen.profile === 'cloudflare' && String(s.config.connectors.oauth).startsWith('workers-oauth-provider') && String(s.config.connectors.registry).includes('published') && String(s.config.connectors.claude).includes('custom connector') && String(s.config.connectors.managedIn).includes('tenants collection') ? null : JSON.stringify(s.config.connectors).slice(0, 160)) },
    { id: 'payload-theorems-plan', tool: 'payload', arguments: { theorems: true, payloadUrl: 'https://payload.example' }, shows: 'The textbook\'s axioms replaced by theorems through the Payload MCP plugin, as a client: the endpoint, the authorization the tenant sends, the tools/list request, and the steps — the find and update doors picked by what they take, every qpu block without a theorem given the kernel-accepted key its example names.', expect: (s) => (s.phase === 'plan' && s.endpoint === 'https://payload.example/api/mcp' && s.requestList[0].body.method === 'tools/list' && s.theorems >= 10 && s.examplesBacked >= 10 && s.steps.length === 4 ? null : `${s.phase} ${s.endpoint}`) },
    { id: 'payload-theorems-update', tool: 'payload', arguments: { theorems: true, payloadUrl: 'https://payload.example', answers: { list: JSON.stringify({ jsonrpc: '2.0', id: 1, result: { tools: [{ name: 'findDocuments', inputSchema: { properties: { slug: {}, where: {}, limit: {} } } }, { name: 'updateDocument', inputSchema: { properties: { slug: {}, id: {}, data: {} } } }] } }), found: JSON.stringify({ jsonrpc: '2.0', id: 2, result: { structuredContent: { docs: [{ id: 'p1', layout: [{ blockType: 'qpu', tool: 'configure', arguments: { kind: 'payload' }, theorem: null }, { blockType: 'cta' }] }, { id: 'p2', layout: [{ blockType: 'qpu', tool: 'clay', arguments: { name: 'relation_15' }, theorem: 'relation_15' }] }] } } }) } }, shows: 'With the Payload MCP\'s answers: the find and update doors recognised by what they take, two pages read, one qpu block without a theorem given textbook_plugin_combinations (the example configure-payload), one already naming its theorem left as it is; one update request emitted.', expect: (s) => (s.phase === 'update' && s.findDoor === 'findDocuments' && s.updateDoor === 'updateDocument' && s.pages === 2 && s.qpuBlocks === 2 && s.axioms === 1 && s.replaced === 1 && s.requestList[0].body.params.arguments.data.layout[0].theorem === 'textbook_plugin_combinations' ? null : `${s.phase} ${s.replaced} ${JSON.stringify(s.requestList?.[0]?.body?.params?.arguments?.data).slice(0, 120)}`) },
    { id: 'payload-website', tool: 'payload', theorem: 'textbook_website_plugins_partition', arguments: { website: WEBSITE_FIXTURE, liveBlockTypes: ['contentGrid', 'cta'] }, shows: 'The source of payloadcms.com (github.com/payloadcms/website, MIT) read as a tree: twelve collections, thirty blocks, seven globals, ten fields, its own opsCounter plugin, and the four default plugins its config mounts; the live page\'s block types contentGrid and cta have their blocks in the source — the site is what Payload computes, verified.', expect: (s) => (s.phase === 'website' && s.collections === 12 && s.blocks === 30 && s.globals === 5 && s.agrees === true && s.pluginsShared.length === 4 && s.pluginsOnlyHere.includes('mcp') ? null : `${s.collections} collections, ${s.blocks} blocks, ${s.globals} globals, agrees ${s.agrees}, shared ${s.pluginsShared?.length}`) },
    { id: 'payload-app', tool: 'payload', theorem: 'textbook_app_bundle', arguments: { app: { name: 'Acme research', host: 'research.acme.com', env: ['D1', 'R2', 'RESEND_API_KEY'], variant: 'yearly' } }, shows: 'An enterprise-grade production app generated on request, as the Apps collection in the Payload UI requests it: the full stack\'s twenty files plus the Worker configuration and the environment example (twenty-two, each with its content address, the bundle addressed by their fold), the Cloudflare adapters the environment chooses, tenants, API keys, access, edge signing, realtime and the gate carried; the yearly domain licence priced by the catalogue in the host\'s currency (USD for a .com) and ordered through the ecommerce plugin\'s own checkout: what the QPU is paid for.', expect: (s) => (s.partition.endsWith(`= ${s.files}`) && s.partition.split(' = ')[0].split(' + ').reduce((n: number, x: string) => n + Number(x), 0) === s.files && s.adapters.profile === 'cloudflare' && s.price.currency === 'USD' && s.price.amount === 47500 && s.licence.variant === 'yearly' && /^[0-9a-f-]{36}$/.test(s.bundle) && Object.keys(s.addresses).length === s.files && s.tenant === 'research-acme-com' && s.usable.viaMcp.includes('Payload MCP plugin') ? null : JSON.stringify({ files: s.files, price: s.price, adapters: s.adapters })) },
    { id: 'payload-app-validate', tool: 'payload', arguments: { app: { validate: { name: 'Acme research', host: 'research.acme.com', env: 'D1, R2, NOPE', variant: 'yearly' } } }, shows: 'The streamed form validated as it is typed, token free: the name, the host (and the currency it prices in), the environment names against the bindings and adapters the stack knows (NOPE unknown), the variant against the catalogue; the host verified by a request the client sends itself; the submission hook refuses what the stream refused.', expect: (s) => (!s.ok && s.fields.env.unknown.join() === 'NOPE' && s.fields.host.ok && s.fields.host.currency === 'USD' && s.fields.variant.ok && s.online.tokenFree && s.online.requests.length === 1 && s.online.requests[0].url === 'https://research.acme.com/' ? null : JSON.stringify(s.fields)) },
    { id: 'payload-site', tool: 'payload', arguments: { site: true }, shows: 'The site as its own use cases, as payloadcms.com is built of what Payload computes: every toolbox a use case, every example a page document in Payload\'s pages shape (layout blocks, meta, breadcrumbs) at its live /u address.', expect: (s) => (s.useCases >= 9 && s.pages >= 40 && s.collection.slug === 'pages' && s.collection.docs.every((d: { layout: { blockType: string }[]; meta: { title: string }; breadcrumbs: unknown[] }) => d.layout[0]!.blockType === 'qpu' && d.meta.title && d.breadcrumbs.length >= 1 && d.breadcrumbs.length <= 3) && s.gates.depth === 3 && s.gates.pages === s.gates.gates + s.gates.categories + 1 && s.collection.totalDocs === s.pages + s.gates.pages && s.reference.site === 'https://payloadcms.com' ? null : `${s.useCases} use cases, ${s.pages} pages`) },
    { id: 'payload-doc', tool: 'payload', theorem: 'textbook_uuid_is_36', arguments: { tool: 'clay', arguments: { name: 'relation_15' }, prev: '016da774-e74c-2e44-8742-f8bcf5e8e8f5' }, shows: 'The clay result as a Payload document: a lexical root with a heading, one qpu block of UUID logic and the licence paragraph; nested under its referer; the SEO fields from the block\'s Open Graph.', expect: (s) => (s.blocks === 1 && s.breadcrumbs === 2 && s.parent === '016da774-e74c-2e44-8742-f8bcf5e8e8f5' && s.doc.lexical.root.children[1].fields.blockType === 'qpu' && s.doc.lexical.root.children[1].fields.next.length === 36 && s.doc.seo.title.includes('clay') ? null : `${s.blocks} blocks, ${s.breadcrumbs} crumbs, parent ${s.parent}`) },
  ],
  skill: {
    instructions: 'configure: a client calls it with no kind to test every configuration around the torus, with kind and current (its file text) to learn the drift as leads, with kind tenant and the names of its environment to learn what the operator still has to set; gen-docs writes the manifest from kind pwa. A Payload host with the default plugins (lexical, nested-docs, seo) stores _meta.payload of any result as it is: the lexical field is the document, nestedDocs.parent the parent relation, seo the plugin\'s fields; the block\'s uuid is the id. A device renders the block from its uuid alone (the walk) and never recomputes what the balancer computed.',
    directions: ['server only: the document shape on a fixture block; the next uuid is the program rotated; the breadcrumbs follow the chain', 'toolbox → toolbox: the block\'s Open Graph and JSON-LD come from the tree and standards toolboxes', 'client → server: a Payload host reads the document; the device reads the uuid'],
    selftest: (ctx) => {
      const { check, done } = createChecks()
      const d = payloadDocOf({ uuid: '941ef62e-d97b-2438-bfc8-22ae9e5da781', tool: 'software', arguments: {}, description: 'd', openGraph: { 'og:title': 'software · @uuidna/qpu', 'og:description': 'five tools' }, prev: '016da774-e74c-2e44-8742-f8bcf5e8e8f5', chain: ['00000000-0000-1000-8000-000000000000'] })
      const block = d.lexical.root.children[1] as { type: string; fields: { blockType: string; uuid: string; next: string; program: string; handle: string } }
      const ch = channelOf(d.id); const nx = channelOf(block.fields.next)
      check('payload:lexical-block', d.lexical.root.type === 'root' && block.type === 'block' && block.fields.blockType === 'qpu' && block.fields.uuid === d.id && block.fields.handle === ch.handle && block.fields.program === ch.program.join(''), `one qpu block of UUID logic in a lexical root: handle ${ch.handle}, program ${ch.program.join('')}`)
      check('payload:next-rotated', block.fields.next !== d.id && nx.handle === ch.handle && nx.tail === ch.tail && nx.program.join('') !== ch.program.join(''), `the next uuid keeps the handle and the tail and rotates the program: ${ch.program.join('')} → ${nx.program.join('')}`)
      check('payload:nested', d.nestedDocs.parent === '016da774-e74c-2e44-8742-f8bcf5e8e8f5' && d.nestedDocs.breadcrumbs.length === 3 && d.nestedDocs.breadcrumbs[2]!.doc === d.id, 'parent and breadcrumbs follow the chain')
      check('payload:seo-and-ld', d.seo.title === 'software · @uuidna/qpu' && d.seo.description === 'five tools' && (d.jsonLd as { '@type': string })['@type'] === 'CreativeWork' && d.license === 'CC-BY-NC-ND-4.0', 'SEO from Open Graph, JSON-LD and licence carried')
      check('payload:fixtures', ctx.examples.filter((e) => /^payload-(workspace|skills|hooks)/.test(e.id)).every((e) => e.expect(ctx.call('payload', e.arguments)) === null), 'the workspace, skills and hooks fixtures answer as their examples show'),
      check('payload:small', JSON.stringify(d).length < 4000, `${JSON.stringify(d).length} bytes without html: computed once, a few kilobytes`)
      const w = configOf('wrangler', ctx); const tw = torusOf(w)
      check('configure:torus-closed', tw.closed && tw.seed + tw.reflection === 10 && tw.trinity.includes(tw.seed), `wrangler at ${tw.address}: seed ${tw.seed}, reflection ${tw.reflection}, trinity ${tw.trinity.join('')}`)
      check('configure:no-drift-with-itself', driftOf(w, JSON.parse(stripJsonc('// a comment\n' + JSON.stringify(w, null, 1)))).length === 0 && driftOf(w, { ...w, name: 'x', routes: [] }).join() === 'name,routes', 'a JSONC text of the configuration drifts nowhere; a changed name and routes drift exactly there')
      const t = configOf('tenant', ctx) as { tenants: { tenant: string; secrets: string[] }[] }
      check('configure:tenants-named-never-valued', t.tenants.length === 3 && t.tenants.every((x) => x.secrets.every((s) => /^[A-Z_0-9]+$/.test(s))) && !JSON.stringify(t).includes('sk_'), `${t.tenants.length} tenants, ${t.tenants[0]!.secrets.length} secret names each, no value`)
      const pl = configOf('payload', ctx) as { plugins: Record<string, unknown>[]; combinations: number }
      check('configure:payload-plugins', pl.plugins.length === 9 && pl.combinations === 512 && pl.plugins.some((p) => 'multi-tenant' in p), 'the eight default plugins, 256 combinations, the tenants in multi-tenant')
      const ws = websiteOf(WEBSITE_FIXTURE, ['contentGrid', 'cta', 'nowhere'])
      check('payload:website-is-what-payload-computes', ws.collections === 12 && ws.blocks === 30 && ws.blockTypes.includes('cta') && ws.agrees === false && ws.live.filter((l) => l.inSource).length === 2 && ws.pluginsShared.join() === 'form-builder,nested-docs,redirects,seo', `${ws.collections} collections, ${ws.blocks} blocks; two live block types in the source, a made-up one not; four plugins shared`)
      const m = configOf('mcp', ctx) as { tools: number; mcpServers: { qpu: { url: string } } }
      const nv = nextVersionOf('1.4.0', ['a', 'b', 'c'], { version: 'v1.4.0', tools: ['a', 'b'] }); const rm = nextVersionOf('1.4.0', ['a'], { version: '1.4.0', tools: ['a', 'b'] }); const same = nextVersionOf('1.4.0', ['a', 'b'], { version: '1.4.0', tools: ['a', 'b'] })
      check('configure:development-defines-the-version', nv.next.startsWith('1.5.0+e1.') && nv.bump === 'minor' && rm.next.startsWith('2.0.0+e1.') && same.next.startsWith('1.4.0+e1.') && same.bump === 'none', `a tool added: ${nv.next}; a tool gone: ${rm.next}; nothing changed: ${same.next} (the number stays; the build address moves)`)
      const carry = nextVersionOf('1.9.0', ['a', 'b'], { version: '1.9.0', tools: ['a'] }); const wrap = nextVersionOf('9.3.0', ['a'], { version: '9.3.0', tools: ['a', 'b'] })
      check('configure:single-digits-infinite-lifespan', carry.next.startsWith('2.0.0+e1.') && wrap.next.startsWith('1.0.0+e2.') && wrap.epoch === 2 && same.build === nextVersionOf('1.4.0', ['a', 'b'], { version: '1.4.0', tools: ['a', 'b'] }).build, `minor carries at 10: ${carry.next}; major past 9 returns to 1 with the epoch: ${wrap.next}; the build address is a function of the catalogue`)
      const mg = configOf('migration', ctx) as { steps: unknown[]; uptime: string }
      check('configure:migration-at-whole-uptime', mg.steps.length === 5 && mg.uptime.startsWith('100'), 'five steps, no address moved')
      check('configure:mcp-registration', m.tools >= 36 && m.mcpServers.qpu.url.endsWith('/mcp'), `the registration of ${m.tools} tools, through the extension toolbox`)
      const files = CONFIG_FILES; const tool = files.filter((f) => f.source === 'tool').length
      check('configure:files-partition', tool + (files.length - tool) + (configKinds.length - files.length) === configKinds.length && tool === 8 && files.length - tool === 2 && configKinds.length === 25, `${tool} tool-sourced, ${files.length - tool} hand-held, ${configKinds.length - files.length} unfiled of ${configKinds.length} kinds`)
      const gd = gateDocsOf(ctx, 'https://qpu.uuidna.com')
      check('configure:gates-nested-three-deep', gd.docs.every((d) => d.breadcrumbs.length === d.depth && (d.depth === 1 || gd.docs.some((p) => p.slug === d.parent)) && d.layout[0]!.tool === 'leads') && gd.docs.filter((d) => d.depth === 3).length === gd.counts.gates && gd.docs.length === gd.counts.gates + gd.counts.categories + 1 && new Set(gd.docs.map((d) => d.slug)).size === gd.docs.length && gd.gates.every((g) => g.leads.every((id) => ctx.leads.some((l) => l.id === id))) && gd.leads.placed + gd.leads.unplaced.length === ctx.leads.length, `${gd.counts.gates} gates (${gd.counts.partition}) in ${gd.counts.categories} categories, ${gd.docs.length} nested docs, every parent a doc before its children, ${gd.leads.placed} leads placed`)
      const ss = setsOf(ctx, ['legal', 'legal'])
      check('configure:mcp-is-its-config-sets', ss.mounts.oneAddress && ss.widgetSkilled.every && ss.algebra.inclusionExclusion && ss.algebra.union.address === ss.algebra.intersection.address && ss.algebra.difference.size === 0 && ss.initialize.agrees && ss.sets.find((x) => x.name === 'mcp')!.size === ss.elements.total && ss.partition.sizes.reduce((n, x) => n + x, 0) === ss.sets.find((x) => x.name === 'tools')!.size, `${ss.elements.total} elements in ${ss.sets.length} sets; a set united with itself is itself (one address); every mount one address; ${ss.widgetSkilled.both} widget-skilled tools; initialize derived = live`)
      check('configure:realtime-collisions-exact', REALTIME.streams.length === 6 && REALTIME.collisions.hook === fileOf('hooks', 'pages') && REALTIME.held.file === fileOf('plugin', 'qpu') && REALTIME.collisions.precondition.includes('editBase'), 'six streams Payload carries; the plugin adds the lock, the autosave, the guard and the base field to pages, so no hand-held file drifts; an MCP client carries the base in the data')
      check('configure:files-named-by-role', fileOf('block', 'qpu') === '.qpu-app/src/blocks/Qpu/config.ts' && fileOf('script', 'seed-qpu') === '.qpu-app/src/scripts/seedQpu.ts' && fileOf('hooks', 'users') === '.qpu-app/src/collections/users.qpu.hooks.ts' && fileOf('notice', 'readme') === '.qpu-app/README.qpu.md' && fileOf('component', 'App') === '.qpu-app/src/components/blocks/Qpu/App.tsx' && fileOf('plugin', 'qpu') === '.qpu-app/src/plugins/qpu.ts' && fileOf('root', 'open-next') === '.qpu-app/open-next.config.ts' && (Object.keys(FILE_ROLES) as FileRole[]).every((r) => FILE_ROLES[r].loads.length > 0), 'every generated path is a function of its role and key; every role says what loads it')
      check('configure:wrangler-carries-the-flag', (w as { compatibility_flags: string[] }).compatibility_flags.includes(WEBCRYPTO_FLAG), 'the seal tool needs ML-DSA in Web Crypto, so the wrangler configuration carries the flag')
      check('configure:bindings-named-never-valued', BINDINGS.length === 10 && BINDINGS.every((b) => b.names.every((n) => /^[A-Z_<>]+$/.test(n)) && b.freeTier && b.paidFor) && !envExampleOf().split('\n').some((l) => /=[^\s]/.test(l)), `${BINDINGS.length} providers, every name a name, every line of the env example empty after =`)
      check('configure:scopes-fields-validations-access', SCOPES.tenants.length === 3 && SCOPES.collections.length === 4 && SCOPES.tenantRoles.length === 3 && FIELDS.entries.length === 6 && FIELDS.qpu.length === 9 && VALIDATIONS.length === 9 && VALIDATIONS.every((v) => new RegExp(v.pattern).test(({ kind: 'reading', sha256: 'a'.repeat(64), prev: '', next: '', slug: 'psg', 'bindings.variables.name': 'STRIPE_SECRET_KEY', 'branding.accent': '#09090b' } as Record<string, string>)[v.field] ?? '12345678-1234-1234-1234-123456789abc')) && ACCESS.entries.update.startsWith('no one'), 'three tenants, fifteen fields, nine validations that accept their own examples, each named by its theorem or a lead, entries immutable')
      check('configure:actions-follow-the-experience', actionsOf({ copies: 100, involutions: 90, msByHost: { a: 250, b: 500 } }).experience.shardSize === 2 && actionsOf().experience.shardSize === 8 && actionsOf({ copies: 100, involutions: 90 }).experience.freeShare === 90, 'the shard size from the slowest host\'s median; the free share from the involutions')
      const pk = packagesOf()
      check('configure:packages-ship-what-we-mount', pk.unknown.length === 0 && pk.count === 45 && pk.counts.plugins === 12 && pk.counts.databases === 5 && pk.counts.storage === 5 && pk.counts.email === 2 && pk.counts.editors === 1 && pk.counts['live-preview'] === 3 && pk.counts['runtime-and-tooling'] === 17, `every plugin, adapter and editor configured here is a package Payload ships (${pk.mounted.length} mounted of ${pk.count})`)
      const ec = ecommerceOf()
      check('configure:ecommerce-from-the-template', ec.catalogue.prices === ec.catalogue.variants * ec.catalogue.currencies && ec.catalogue.items.every((i) => Object.keys(i.prices).length === 3 && Object.values(i.prices).every((v) => Number.isInteger(v) && v >= 0)) && PAYLOAD_ECOMMERCE.pluginCollections.length === 8 && pk.mounted.includes('plugin-ecommerce'), `${ec.catalogue.variants} variants × ${ec.catalogue.currencies} currencies = ${ec.catalogue.prices} prices, every amount an integer in the minor unit; the plugin\'s eight collections`)
      const u1 = uiOf('processor'); const u2 = uiOf('processor')
      const st3 = streamOf(['941ef62e-d97b-2438-bfc8-22ae9e5da781', '016da774-e74c-2e44-8742-f8bcf5e8e8f5', '00000000-0000-1000-8000-000000000000'], { sort: 'hue', execute: true })
      check('configure:uuid-stream-queried-sorted-executed', st3.rows.length === 3 && st3.rows.every((r, i, a) => i === 0 || a[i - 1]!.hue <= r.hue) && st3.rows.every((r) => 'next' in r && r.next !== r.uuid) && streamOf(['941ef62e-d97b-2438-bfc8-22ae9e5da781'], { where: { nibble: { at: 0, is: '9' } } }).filtered === 1 && streamOf(['941ef62e-d97b-2438-bfc8-22ae9e5da781'], { where: { nibble: { at: 0, is: 'a' } } }).filtered === 0, 'three addresses sorted by their own hue, each executed to its next address; a nibble query keeps or drops by the hex alone')
      const p1 = presentationOf('941ef62e-d97b-2438-bfc8-22ae9e5da781'); const p2 = presentationOf('941EF62ED97B2438BFC822AE9E5DA781'); const s1 = styleOf('941ef62e-d97b-2438-bfc8-22ae9e5da781')
      check('configure:any-hex-presentable-styled-from-itself', p1.parts.length === 32 && JSON.stringify(p1) === JSON.stringify(p2) && s1.hue < 360 && s1.sat >= 40 && s1.sat < 80 && s1.radius >= 2 && s1.radius < 16 && Object.keys(registryOf()).length === 6 + STYLED_ITEMS.length && sdkOf().builders.length === 22 && /toolNameOf/.test(sdkOf().module) && /PLUGINS = /.test(sdkOf().module) && !/https?:\/\/(?!qpu\.uuidna\.com)/.test(sdkOf().module) && !/https?:\/\/|@import|<link/.test(STYLED_ITEMS.map((i) => i.content).join('')), `a UUID is 32 parts, the same in any case; hue ${s1.hue}, saturation ${s1.sat}, radius ${s1.radius}; ${STYLED_ITEMS.length} styled items in the registry, none loading anything`)
      check('configure:ui-shell-deterministic-and-closed', u1.html === u2.html && u1.uri === 'ui://qpu/processor' && u1.mimeType === 'text/html;profile=mcp-app' && !/Math\.random|Date\.now|https?:\/\//.test(u1.html) && /ui\/initialize/.test(u1.html) && /ui\/notifications\/tool-result/.test(u1.html) && /ui\/notifications\/size-changed/.test(u1.html) && UI_TOKENS.every(([t, h]) => u1.html.includes(t) && t !== h) && /font-family: var\(--font-sans, /.test(u1.html), 'the same shell twice, no randomness, no clock, no external URL; the handshake, the result and the size notifications; every widget token mapped onto a host variable of another name, the font read where it is used')
      const ad = adaptersOf(['DATABASE_URI', 'BLOB_READ_WRITE_TOKEN', 'SENDGRID_API_KEY']); const cf = adaptersOf(['D1', 'R2'])
      const gg = adaptersOf(['GOOGLE_CLOUD_PROJECT', 'GCS_BUCKET', 'GCS_PROJECT_ID', 'DATABASE_URI', 'GMAIL_USER'])
      check('configure:adapters-google-profile', gg.chosen.profile === 'google' && gg.chosen.database === 'db-postgres' && gg.chosen.storage === 'storage-gcs' && gg.chosen.email === 'email-nodemailer', `google: ${gg.chosen.database}, ${gg.chosen.storage}, ${gg.chosen.email} (Cloud SQL, Cloud Storage, Gmail)`)
      // the one block in its two forms, and the merge that commutes and is idempotent
      const u = '016da774-e74c-2e44-8742-f8bcf5e8e8f5'; const inline = qpuNodeOf(u, 'clay', { technique: 'reflection' }, 'triad_reflect').fields; const layout = qpuFieldsOf(u, 'clay', { technique: 'reflection' }, 'triad_reflect')
      check('payload:one-block-two-forms', (Object.keys(layout) as (keyof typeof layout)[]).every((k) => JSON.stringify(inline[k]) === JSON.stringify(layout[k])) && inline.id === u && inline.blockName === 'clay', 'the inline node and the layout block carry the same fields from one function')
      const base = docOf('base', [{ uuid: u, tool: 'clay', arguments: {} }]); const ea = docOf('a', [{ uuid: u, tool: 'clay', arguments: {} }, { uuid: '941ef62e-d97b-2438-bfc8-22ae9e5da781', tool: 'roadmap', arguments: {} }]); const eb = docOf('b', [{ uuid: u, tool: 'clay', arguments: {} }, { uuid: '00000000-0000-1000-8000-000000000000', tool: 'software', arguments: {} }])
      const ab = mergeOf(base, ea, eb), ba = mergeOf(base, eb, ea), aa = mergeOf(base, ea, ea)
      check('payload:merge-commutes-idempotent', ab.address === ba.address && ab.blocks === 3 && aa.address === foldOf(ea) && aa.blocks === 2 && ab.collisions === 0, `merge(a, b) = merge(b, a) at ${ab.address.slice(0, 8)}; merge(a, a) folds to a; no collision`)
      check('configure:adapters-chosen-by-environment', ad.combinations === PORT_RADICES.reduce((a, n) => a * n, 1) && ad.chosen.profile === 'vercel' && ad.chosen.database === 'db-mongodb' && cf.chosen.profile === 'cloudflare' && cf.chosen.database === 'db-d1-sqlite' && cf.chosen.storage === 'storage-r2' && cf.chosen.email === 'email-nodemailer' && adaptersOf([]).chosen.profile === 'local', 'every combination; Vercel names Mongo, Blob and nodemailer, Cloudflare names D1 and R2 with the mail adapter the keys name, nothing named is local')
      check('configure:held-drift-measured', heldDriftOf('payload', 'seoPlugin( nestedDocsPlugin( mongooseAdapter( process.env.PAYLOAD_SECRET').join() === 'plugins.qpuPlugin,adapters.qpuDb,adapters.qpuEmail,adapters.qpuAdapterPlugins' && heldDriftOf('payload', 'formBuilderPlugin( qpuPlugin() qpuDb() qpuEmail() qpuAdapterPlugins() process.env.PAYLOAD_SECRET').length === 0 && heldDriftOf('payload', 'qpuPlugin() formBuilderPlugin( qpuDb() qpuEmail() qpuAdapterPlugins() process.env.PAYLOAD_SECRET').join() === 'plugins.qpuPlugin.last' && heldDriftOf('hooks', 'nothing').length === 0 && heldDriftOf('api', "destination: '/api/qpu'").join() === 'rewrite./api/globals/qpu,rewrite./api/mcp,rewrite./api/entries/:uuid,custom-endpoint./api/qpu', 'a hand-held file measured by what MCP configures and the text lacks')
      return done()
    },
  },
}
