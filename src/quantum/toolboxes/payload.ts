// The payload toolbox: every result in Payload's own plugin schema and nothing custom — a lexical document whose one block is
// the programmable UUID logic (the block's uuid, its handle, program and tail, the tool and its arguments, the next step the
// program rotated to), nested by the referer chain as the nested-docs plugin nests (parent, breadcrumbs), described by the
// SEO plugin's fields from the block's Open Graph, carrying its JSON-LD and its licence. Pure and small: computed once per
// block by the balancer, so the cost is a few kilobytes and no computation on the device — the battery is the result.
import { toolOf, type Toolbox, type Context } from '../toolbox.js'
import { channelOf, uuidFromParts, uuidOf } from '../blocks.js'
import { seedOf, trinityOf } from '../clay-register.js'
import { TENANTS } from '../tenants.js'
import { CLOUDFLARE_MCP, DEFAULT_MCP_HOSTS, CLAUDE_API, KNOWN_MCP, MCP_REGISTRY } from '../discovery.js'
import { KEY, hueOf } from '../theme.js'
import { VERSION } from '../version.js'
import { TEXTBOOK_THEOREMS } from '../textbook-theorems.js'
import { answerOf } from './extension.js'
import { blockJsonLdOf, STANDARDS } from '../standards.js'
import { LICENSE } from '../license.js'
import { flowWidget } from '../widgets.js'
import { WEBCRYPTO_FLAG, ATTEST_APIS } from './crypto.js'
import { ROLES } from '../roles.js'
import { CATALOGUE, amountsOf, RATE_SOURCES, CURRENCY_MCPS, TENANT_CURRENCY, DOMAIN_CURRENCY } from './billing.js'
import { PATENT_APIS, PATENT_MCPS, COMPETITIONS, FUNDING_MCPS, knowOf } from './legal.js'
import type { Lead } from '../leads.js'
import { differencesOf } from '../audit.js'

export type LexicalDoc = { root: { type: 'root'; version: 1; direction: 'ltr'; format: ''; indent: 0; children: unknown[] } }
export type PayloadDoc = { id: string; lexical: LexicalDoc; nestedDocs: { parent: string | null; breadcrumbs: { doc: string; url: string; label: string }[] }; seo: { title: string; description: string; image: string | null }; jsonLd: unknown; license: string }

/** A result as the document Payload's plugins would hold: one lexical block of UUID logic, nested by prev, described for SEO. */
export const payloadDocOf = (p: { uuid: string; tool: string; arguments: Record<string, unknown>; description: string; openGraph?: Record<string, string>; html?: string; prev?: string | null; chain?: string[]; origin?: string }): PayloadDoc => {
  const ch = channelOf(p.uuid)
  const next = uuidFromParts(ch.handle, [...ch.program.slice(1), ch.program[0]!], ch.tail)
  const origin = p.origin ?? 'https://qpu.uuidna.com'
  const url = (id: string) => `${origin}/${id}`
  const chain = [...(p.chain ?? []), ...(p.prev ? [p.prev] : [])]
  const block = { type: 'block', version: 2, format: '', fields: { id: p.uuid, blockName: p.tool, blockType: 'qpu', uuid: p.uuid, handle: ch.handle, program: ch.program.join(''), tail: ch.tail, tool: p.tool, arguments: p.arguments, prev: p.prev ?? null, next, html: p.html ?? null, license: LICENSE.spdx } }
  const title = p.openGraph?.['og:title'] ?? `${p.tool} · @uuidna/qpu`
  return {
    id: p.uuid,
    lexical: { root: { type: 'root', version: 1, direction: 'ltr', format: '', indent: 0, children: [{ type: 'heading', tag: 'h2', version: 1, format: '', indent: 0, direction: 'ltr', children: [{ type: 'text', version: 1, text: title, format: 0, mode: 'normal', style: '', detail: 0 }] }, block, { type: 'paragraph', version: 1, format: '', indent: 0, direction: 'ltr', textFormat: 0, children: [{ type: 'text', version: 1, text: `${LICENSE.attribution}. ${LICENSE.terms}`, format: 0, mode: 'normal', style: '', detail: 0 }] }] } },
    nestedDocs: { parent: p.prev ?? null, breadcrumbs: [...chain.map((id) => ({ doc: id, url: url(id), label: id.slice(0, 8) })), { doc: p.uuid, url: url(p.uuid), label: p.uuid.slice(0, 8) }] },
    seo: { title, description: p.openGraph?.['og:description'] ?? p.description, image: p.openGraph?.['og:image'] ?? null },
    jsonLd: blockJsonLdOf({ tool: p.tool, id: p.uuid, description: p.description, url: url(p.uuid) }),
    license: LICENSE.spdx,
  }
}

/** The QPU monetises by generating enterprise-grade production apps on request from the Payload UI: a request (a name, a host that becomes the
 *  first tenant at deploy, the plugins, the environment names, the licence variant) answered as the app — every generated file with its content
 *  address and the address of the bundle (textbook_app_bundle: the full stack's files plus the Worker configuration and the environment example),
 *  the adapters the environment chooses, the enterprise capabilities it carries, the licence variant priced by the catalogue in the host's
 *  currency, and the order the ecommerce plugin sells at its own checkout. The Apps collection takes the request; this answer is what it stores. */
/** The form a user submits to request an app: the form-builder plugin's own document, nothing added to the schema. */
export const appRequestFormOf = () => ({ title: 'Request an app', submitButtonLabel: 'Request the app', confirmationType: 'message', confirmationMessage: lx.doc([lx.paragraph([lx.text('Your app is being generated: its bundle appears in Media (every file with its address), the licence is a product at the checkout.')])]), fields: [{ blockType: 'text', name: 'name', label: 'App name', required: true, width: 100 }, { blockType: 'text', name: 'host', label: 'Host (the first tenant at deploy)', required: true, width: 100 }, { blockType: 'text', name: 'env', label: 'Environment variable names (D1, R2, RESEND_API_KEY, DATABASE_URI, ...; values never travel)', required: false, width: 100 }, { blockType: 'select', name: 'variant', label: 'Licence', required: true, defaultValue: 'yearly', options: CATALOGUE.filter((v) => v.product === 'qpu-domain').map((v) => ({ label: `${v.variant}: ${v.description}`, value: v.variant })) }] })
export const appOf = (ctx: Context, r: { name: string; host: string; plugins?: readonly string[]; env?: readonly string[]; variant?: string }) => {
  if ((r as { form?: boolean }).form) return { form: appRequestFormOf(), says: 'the form-builder plugin\'s form a user submits to request an app; the seed creates it, the submission\'s afterChange hook (appRequest) generates the app' }
  if (typeof r.name !== 'string' || !r.name || typeof r.host !== 'string' || !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(r.host)) throw new Error('an app request names the app and its host (the first tenant at deploy)')
  const tenant = r.host.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const fs = configOf('fullstack', ctx) as { files: Record<string, string>; partition: string }
  const chosen = (r.plugins ?? PAYLOAD_PLUGINS.map((p) => p.name)).filter((p) => PAYLOAD_PLUGINS.some((q) => q.name === p))
  const ad = adaptersOf(r.env ?? [])
  const files: Record<string, string> = { ...fs.files, 'site/wrangler.jsonc': JSON.stringify(siteWranglerOf(), null, 2) + '\n', 'site/.env.qpu.example': envExampleOf() + '\n' }
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
    order: { product: title, checkout: '/checkout: the ecommerce plugin\'s own, the Stripe adapter the payment', then: 'on payment the licence entry is granted to the tenant (the billing toolbox\'s licence ledger) and the bundle is the tenant\'s to deploy from site/ (npx wrangler deploy, OpenNext); the status streams requested → generated → paid → deployed' },
    usable: { inUi: 'the request is a submission of the form-builder\'s form "Request an app" (seeded); its afterChange hook generates this answer into the media collection as a JSON file; the tenant\'s settings (its tenants document) are the plugin options merged into every qpu block call under its hosts; nothing added to the schema', viaMcp: 'the Payload MCP plugin serves the installed plugins\' default collections: a client requests (a form submission), reads the bundle (media), buys the licence (a product in a cart at the checkout) and configures (tenants.settings) with its API key', asPlugin: 'a tenant-configurable plugin: the same generated app, configured per tenant as data in the plugins\' own collections, never a second Payload config and never a collection added' },
    monetises: 'the QPU is paid for the apps it generates on request: the Apps collection in the Payload UI takes the request, this answer is the app, the catalogue prices it, the ecommerce plugin sells it, and the tenant uses it in the same UI or through the Payload MCP plugin',
    bundleFiles: files,
  }
}
const payload = toolOf('payload', {
  name: 'payload',
  description: 'Any tool\'s result as the document Payload\'s default plugins hold, no custom collection: a lexical document whose one block is the programmable UUID logic (uuid, handle, program, tail, tool, arguments, prev, next), nested by the referer chain as nested-docs nests (parent, breadcrumbs), the SEO plugin\'s title, description and image from the block\'s Open Graph, the JSON-LD and the licence. Every tools/call result carries the same in _meta.payload.',
  inputSchema: { type: 'object', properties: { theorems: { type: 'boolean', description: 'the textbook\'s axioms replaced by theorems through the tenant\'s Payload MCP plugin, as a client: the plan, then with answers { list, found } the update requests' }, payloadUrl: { type: 'string', description: 'the tenant\'s Payload origin; its MCP is at /api/mcp' }, answers: { type: 'object' }, website: { description: 'true: the requests for payloadcms.com\'s source tree and one live page; the tree as answered: its collections, blocks, globals, fields and plugins, and whether the live page\'s blocks have a block in the source' }, liveBlockTypes: { type: 'array', items: { type: 'string' } }, skills: { description: 'true: the request for Payload\'s skills tree (github.com/payloadcms/skills); the tree as answered: every skill and reference mapped to the tool of this tree that enacts it' }, site: { type: 'boolean', description: 'the site as its own use cases: every toolbox a use case, every example a page document, as payloadcms.com is built of what Payload computes' }, app: { type: 'object', description: 'an app requested from the Payload UI: { name, host, plugins?, env?, variant? } — answered as the generated app (every file with its address, the bundle address, the adapters the environment chooses, the enterprise capabilities), priced by the catalogue in the host\'s currency and ordered through the ecommerce plugin: what the QPU is paid for' }, tool: { type: 'string' }, arguments: { type: 'object' }, prev: { type: 'string', description: 'the referer block\'s uuid' }, chain: { type: 'array', items: { type: 'string' }, description: 'the referers before prev, oldest first' }, origin: { type: 'string' }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (args.selftest) return { selftest: true, ...PAYLOAD.skill.selftest(ctx) }
    if (args.site) return siteOf(ctx, typeof args.origin === 'string' ? args.origin : 'https://qpu.uuidna.com')
    if (args.app && typeof args.app === 'object') return appOf(ctx, args.app as Parameters<typeof appOf>[1])
    if (args.skills && typeof args.skills === 'object') return { phase: 'skills' as const, ...skillsOf(args.skills as Parameters<typeof skillsOf>[0]) }
    if (args.website && typeof args.website === 'object') return { phase: 'website' as const, ...websiteOf(args.website as Parameters<typeof websiteOf>[0], Array.isArray(args.liveBlockTypes) ? args.liveBlockTypes.map(String) : []) }
    // the textbook's axioms replaced by theorems through the Payload MCP plugin, as a client: the doors picked by what they take and answer, never by a name
    if (args.theorems) {
      const url = typeof args.payloadUrl === 'string' ? args.payloadUrl.replace(/\/$/, '') : null
      const endpoint = url ? `${url}/api/mcp` : '<QPU_PAYLOAD_URL>/api/mcp'
      const auth = { header: 'Authorization', value: '<authCollectionSlug> API-Key <QPU_PAYLOAD_API_KEY>', note: 'the tenant\'s API key, from a user with auth.useAPIKey; the client sends it, this tool never holds it' }
      const byExample = Object.fromEntries(TEXTBOOK_THEOREMS.flatMap((t) => t.examples.map((e) => [e, t.key])))
      if (!args.answers || typeof args.answers !== 'object') return { phase: 'plan' as const, endpoint, auth, requestList: [{ id: 'payload-mcp-list', method: 'POST' as const, url: endpoint, accept: 'application/json, text/event-stream', body: { jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} } }], theorems: TEXTBOOK_THEOREMS.length, examplesBacked: Object.keys(byExample).length, steps: ['tools/list: pick the find and update doors of the pages collection by what they take (a slug, a where, an id) and answer (documents), never by a name', 'find the pages whose layout holds a qpu block without a theorem', 'for each block, the theorem the textbook names for the example its tool and arguments are (TEXTBOOK_THEOREMS)', 'update each page: the block\'s theorem field written; the kernel-accepted key, nothing asserted'], note: 'the client calls again with answers: { list: <tools/list text>, found?: <find text> }' }
      const a = args.answers as { list?: string; found?: string }
      const list = a.list ? answerOf(a.list) : { ok: false, error: 'no tools/list answer' }
      const tools = (list.ok && list.result && typeof list.result === 'object' && Array.isArray((list.result as { tools?: unknown[] }).tools) ? (list.result as { tools: { name: string; description?: string; inputSchema?: { properties?: Record<string, unknown> } }[] }).tools : [])
      const takes = (t: { inputSchema?: { properties?: Record<string, unknown> } }) => Object.keys(t.inputSchema?.properties ?? {})
      const findDoor = tools.find((t) => takes(t).includes('slug') && (takes(t).includes('where') || takes(t).includes('limit')) && !takes(t).includes('data'))
      const updateDoor = tools.find((t) => takes(t).includes('slug') && takes(t).includes('data') && (takes(t).includes('id') || takes(t).includes('where')))
      if (!findDoor || !updateDoor) return { phase: 'doors' as const, endpoint, tools: tools.length, findDoor: findDoor?.name ?? null, updateDoor: updateDoor?.name ?? null, leads: [{ id: 'payload-mcp-doors-missing', statement: `the Payload MCP at ${endpoint} lists ${tools.length} tool(s) and none takes a slug with a where (to find) or a slug with data (to update)`, status: 'open', reason: 'the pages collection\'s built-in find and update tools are disabled or the key has no access to them' }] }
      if (!a.found) return { phase: 'find' as const, endpoint, findDoor: findDoor.name, updateDoor: updateDoor.name, requestList: [{ id: 'payload-mcp-find', method: 'POST' as const, url: endpoint, accept: 'application/json, text/event-stream', body: { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: findDoor.name, arguments: { slug: 'pages', where: { 'layout.blockType': { equals: 'qpu' } }, limit: 1000 } } } }], note: 'the client calls again with answers.found' }
      const found = answerOf(a.found)
      const docs = (found.ok && found.result && typeof found.result === 'object' ? ((found.result as { docs?: unknown[] }).docs ?? []) : []) as { id: string; layout?: { blockType?: string; tool?: string; arguments?: unknown; theorem?: string | null; id?: string }[] }[]
      const updates = docs.flatMap((d) => { const layout = (d.layout ?? []).map((b) => { if (b.blockType !== 'qpu' || b.theorem) return b; const ex = ctx.examples.find((e) => e.tool === b.tool && JSON.stringify(e.arguments) === JSON.stringify(b.arguments ?? {})); const key = ex ? (ex.theorem ?? byExample[ex.id]) : undefined; return key ? { ...b, theorem: key } : b }); return JSON.stringify(layout) === JSON.stringify(d.layout ?? []) ? [] : [{ id: `payload-mcp-update-${d.id}`, method: 'POST' as const, url: endpoint, accept: 'application/json, text/event-stream', body: { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: updateDoor.name, arguments: { slug: 'pages', id: d.id, data: { layout } } } } }] })
      const blocks = docs.flatMap((d) => d.layout ?? []).filter((b) => b.blockType === 'qpu')
      return { phase: 'update' as const, endpoint, findDoor: findDoor.name, updateDoor: updateDoor.name, pages: docs.length, qpuBlocks: blocks.length, axioms: blocks.filter((b) => !b.theorem).length, replaced: updates.length, requestList: updates, note: updates.length ? 'the client sends each update; a block whose example the textbook backs by no theorem stays an axiom and a lead' : 'nothing to replace: every qpu block names its theorem or the textbook has none for it yet' }
    }
    if (args.website === true) return { phase: 'request' as const, requestList: [{ id: 'payload-website', method: 'GET' as const, url: 'https://api.github.com/repos/payloadcms/website/git/trees/main?recursive=1', accept: 'application/vnd.github+json' }, { id: 'payload-site-live', method: 'GET' as const, url: 'https://payloadcms.com/api/pages?limit=1&depth=0', accept: 'application/json' }], note: 'the client fetches the source tree (public) and one live page, and calls again with website: <the tree> and liveBlockTypes: the page\'s layout blockTypes' }
    if (args.skills === true) return { phase: 'request' as const, requestList: [{ id: 'payload-skills', method: 'GET' as const, url: 'https://api.github.com/repos/payloadcms/skills/git/trees/main?recursive=1', accept: 'application/vnd.github+json' }], note: 'the client fetches the tree (public, no token) and calls again with skills: <the answer>; discovery reads the same tree as the standard payload-skills' }
    if (typeof args.tool !== 'string') throw new Error('tool names the result to document, or site: true the site')
    const r = ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: String(args.tool), arguments: args.arguments ?? {} } }) as { result?: { _meta: { block: { meta: { id: string } }; openGraph: Record<string, string>; widget: string } }; error?: { message: string } }
    if (r.error) throw new Error(r.error.message)
    const uuid = r.result!._meta.block.meta.id
    const doc = payloadDocOf({ uuid, tool: String(args.tool), arguments: (args.arguments ?? {}) as Record<string, unknown>, description: r.result!._meta.openGraph['og:description'] ?? '', openGraph: r.result!._meta.openGraph, html: r.result!._meta.widget, prev: typeof args.prev === 'string' ? args.prev : null, chain: Array.isArray(args.chain) ? args.chain.map(String) : [], origin: typeof args.origin === 'string' ? args.origin : undefined })
    return { tool: args.tool, uuid, blocks: 1, breadcrumbs: doc.nestedDocs.breadcrumbs.length, parent: doc.nestedDocs.parent, bytes: JSON.stringify(doc).length, doc }
  },
  widget: flowWidget,
})

/** Payload's default plugins, the ones MCP configures; no custom collection: the one collection is the plugins' own pages. */
export const PAYLOAD_PLUGINS: readonly { name: string; pkg: string; options: Record<string, unknown> }[] = [
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
export type GateKind = 'open' | 'keyed' | 'browser' | 'proposed' | 'tool'
export type Gate = { id: string; category: string; name: string; url: string; host: string; kind: GateKind; by: string; measured: string | null; leads: string[] }
export const GATE_CATEGORIES: readonly { id: string; name: string; says: string }[] = [
  { id: 'patents', name: 'Patent gates', says: 'the offices and indexes the patents tool passes' },
  { id: 'certificates', name: 'Certificate and crypto gates', says: 'the beacon, the logs, the directory, the vulnerability index and the physics the attest tool passes' },
  { id: 'currency', name: 'Currency gates', says: 'the rate sources the currency tool harmonises' },
  { id: 'competitions', name: 'Competition gates', says: 'the rules pages the compete tool follows' },
  { id: 'mcp', name: 'MCP gates', says: 'the servers discovery reads, and the servers the registry names beside them: proposed, never called from the tree' },
  { id: 'references', name: 'Reference gates', says: 'the vocabularies, codes and references the verifier reads' },
]
const escapeRe = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const gateHostOf = (url: string): string => { try { return new URL(url).host.replace(/^www\./, '') } catch { return url.replace(/^[a-z]+:\/\//, '').split(/[/:]/)[0] ?? url } }
const gatePathOf = (url: string): string => { try { const u = new URL(url); return `${u.host.replace(/^www\./, '')}${u.pathname.replace(/\/$/, '')}` } catch { return url } }
export const gateSlugOf = (id: string) => uuidOf(`gate:${id}`)
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
export const gatesOf = (ctx: Context, origin: string) => {
  const tools = (ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) as { result: { tools: { name: string; description: string; _meta?: { toolbox?: string } }[] } }).result.tools
  const external: RawGate[] = [
    ...PATENT_APIS.map((a) => ({ id: a.id, category: 'patents', name: a.name, url: a.url, host: gateHostOf(a.url), kind: (a.open ? 'open' : /browser/.test(a.key ?? '') ? 'browser' : 'keyed') as GateKind, by: 'patents', measured: a.measured })),
    ...ATTEST_APIS.map((a) => ({ id: a.id, category: 'certificates', name: a.name, url: a.url, host: gateHostOf(a.url), kind: 'open' as GateKind, by: 'attest', measured: a.measured })),
    ...RATE_SOURCES.map((r) => ({ id: r.id, category: 'currency', name: r.name, url: r.url, host: gateHostOf(r.url), kind: 'open' as GateKind, by: 'currency', measured: `${r.cadence}; ${r.terms}` })),
    ...COMPETITIONS.map((c) => ({ id: c.id, category: 'competitions', name: c.name, url: c.rules, host: gateHostOf(c.rules), kind: 'open' as GateKind, by: 'compete', measured: `${c.kind}, entry ${c.entry}, read ${c.read}; ${c.prize}` })),
    ...KNOWN_MCP.map((m) => ({ id: m.host, category: 'mcp', name: m.about, url: m.url, host: m.host, kind: (m.auth === 'none' ? 'open' : 'keyed') as GateKind, by: 'discover', measured: m.maps })),
    ...([['currency', CURRENCY_MCPS], ['patent', PATENT_MCPS], ['grant|funding', FUNDING_MCPS]] as const).flatMap(([term, list]) => list.map((id) => ({ id, category: 'mcp', name: `${id}, a server the registry names for ${term}`, url: `${MCP_REGISTRY}?search=${term}`, host: gateHostOf(MCP_REGISTRY), kind: 'proposed' as GateKind, by: 'leads', measured: null, match: `v0/servers?search=${term}` }))),
  ]
  // a reference whose address another table already passes is that gate, not a second one
  const seen = new Set(external.map((g) => gatePathOf(g.url)))
  for (const st of STANDARDS) { const path = gatePathOf(st.contract); if (seen.has(path) || external.some((g) => g.id === st.id)) continue; seen.add(path); external.push({ id: st.id, category: 'references', name: st.name, url: st.contract, host: gateHostOf(st.contract), kind: 'open', by: 'verify', measured: `a ${st.kind}` }) }
  const own: RawGate[] = tools.map((t) => ({ id: t.name, category: t._meta?.toolbox ?? 'none', name: `tools/call ${t.name}`, url: `${origin}/mcp`, host: gateHostOf(origin), kind: 'tool' as GateKind, by: t._meta?.toolbox ?? 'none', measured: t.description }))
  const gates: Gate[] = [...own, ...external].map((g) => ({ id: g.id, category: g.category, name: g.name, url: g.url, host: g.host, kind: g.kind, by: g.by, measured: g.measured, leads: passesOf(ctx.leads, g) }))
  const toolboxes = [...new Set(own.map((g) => g.category))]
  const categories = [...toolboxes.map((b) => ({ id: b, name: `${b} toolbox gates`, says: `the doors of the ${b} toolbox, each a gate of the leads it serves` })), ...GATE_CATEGORIES].map((c) => { const mine = gates.filter((g) => g.category === c.id); return { ...c, gates: mine.length, leads: new Set(mine.flatMap((g) => g.leads)).size } })
  const placed = new Set(gates.flatMap((g) => g.leads))
  const byKind = Object.fromEntries((['tool', 'open', 'keyed', 'browser', 'proposed'] as const).map((k) => [k, gates.filter((g) => g.kind === k).length]))
  return {
    gates, categories,
    counts: { gates: gates.length, own: own.length, external: external.length, categories: categories.length, byKind, partition: `${categories.map((c) => c.gates).join(' + ')} = ${gates.length}` },
    leads: { total: ctx.leads.length, placed: placed.size, unplaced: ctx.leads.filter((l) => !placed.has(l.id)).map((l) => l.id) },
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
const qpuBlockOf = (uuid: string, tool: string, args: Record<string, unknown>, theorem: string | null) => { const ch = channelOf(uuid); return { blockType: 'qpu', tool, uuid, handle: ch.handle, program: ch.program.join(''), tail: ch.tail, arguments: args, theorem } }
export type GateDoc = { id: string; title: string; slug: string; path: string; parent: string | null; depth: number; layout: Record<string, unknown>[]; meta: { title: string; description: string }; hero: { type: 'default'; richText: LexicalDoc }; breadcrumbs: { doc: string; url: string; label: string }[] }
/** The gates as the nested page documents the seed creates, parents first: the root, a page per category, a page per gate. */
/** A competition gate knows its competitors as well as the theorems: both in its lexical body (the pages collection the Payload MCP plugin serves). */
const knowledgeOf = (x: Gate): unknown[] => { const c = x.category === 'competitions' ? COMPETITIONS.find((k) => k.id === x.id) : undefined; if (!c) return []; const k = knowOf(c); return [lx.heading('Competitors, as the page measures them', 'h2'), lx.paragraph([lx.link(c.competitors.source, c.competitors.source), lx.text(` (read ${c.competitors.read}): ${c.competitors.measured}`)]), ...(c.competitors.known.length ? [lx.list(c.competitors.known.map((n) => [lx.text(n)]))] : []), lx.heading(`${k.theorems.length} theorems the tree carries`, 'h2'), lx.list(k.theorems.map((t) => [lx.text(t)]))] }
export const gateDocsOf = (ctx: Context, origin: string) => {
  const g = gatesOf(ctx, origin)
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
    { id: root.slug, title: root.title, slug: `/${root.slug}`, path: rootPath, parent: null, depth: 1, layout: [qpuBlockOf(root.slug, 'leads', {}, theorem)], meta: { title: 'Gates · @uuidna/qpu', description: g.says }, hero: { type: 'default', richText: lx.doc([lx.heading('Every API is a gate', 'h1'), lx.paragraph([lx.text(`${g.counts.gates} gates in ${g.counts.categories} categories (${g.counts.partition}): ${g.counts.own} doors of this catalogue and ${g.counts.external} addresses outside it; ${g.leads.placed} of ${g.leads.total} leads pass through a gate.`)]), lx.list(g.categories.map((c) => [lx.link(catPath(c.id), c.name), lx.text(`: ${c.gates} gates, ${c.leads} leads — ${c.says}`)]))]) }, breadcrumbs: [rootCrumb] },
    ...g.categories.map((c): GateDoc => { const slug = catSlug(c.id); const mine = g.gates.filter((x) => x.category === c.id); const ids = [...new Set(mine.flatMap((x) => x.leads))]; return { id: slug, title: c.name, slug: `/${slug}`, path: catPath(c.id), parent: `/${root.slug}`, depth: 2, layout: [qpuBlockOf(slug, 'leads', { ids }, theorem)], meta: { title: `${c.name} · @uuidna/qpu`, description: c.says }, hero: { type: 'default', richText: lx.doc([lx.heading(c.name, 'h1'), lx.paragraph([lx.text(`${c.says}: ${mine.length} gates, ${ids.length} leads.`)]), lx.list(mine.map((x) => [lx.link(gatePath(x), x.name), lx.text(` (${x.kind}, ${x.leads.length} leads)`)]))]) }, breadcrumbs: [rootCrumb, crumb(catPath(c.id), slug, c.name)] } }),
    ...g.gates.map((x): GateDoc => { const slug = gateSlugOf(x.id); const c = g.categories.find((y) => y.id === x.category)!; return { id: slug, title: x.name, slug: `/${slug}`, path: gatePath(x), parent: `/${catSlug(c.id)}`, depth: 3, layout: [qpuBlockOf(slug, 'leads', { ids: x.leads }, theorem)], meta: { title: `${x.name} · @uuidna/qpu`, description: `${x.kind} gate of ${x.leads.length} leads, passed by ${x.by}${x.measured ? `: ${x.measured}` : ''}` }, hero: { type: 'default', richText: lx.doc([lx.heading(x.name, 'h1'), lx.paragraph([lx.text(`A ${x.kind} gate at `), lx.link(x.url, x.url), lx.text(`, passed by ${x.by}.${x.measured ? ` Measured: ${x.measured}` : ''}`)]), lx.heading(`${x.leads.length} leads pass through it`, 'h2'), ...(x.leads.length ? [leadItems(x.leads)] : [lx.paragraph([lx.text('No lead names this gate yet: the gate itself is the lead.')])]), ...knowledgeOf(x)]) }, breadcrumbs: [rootCrumb, crumb(catPath(c.id), catSlug(c.id), c.name), crumb(gatePath(x), slug, x.name)] } }),
  ]
  return { ...g, docs }
}

/** The MCP imagined as config sets of widget-skilled tools: a server is nothing but a set of configurations — its tools, each carrying its
 *  widget (the UI resource it renders through) and its skill (the toolbox's instructions and directions), its resources, its examples, its
 *  configuration kinds, its theorems — and every subset (a toolbox, a tenant's mount, the tools with a UI, the examples a theorem backs) is a
 *  config set with a content address: the fold of its sorted members, so two hosts serving the same set share one address (the involution)
 *  and a tenant's mount of the whole server is the same set at every host. Sets compose by union, intersection and difference (inclusion–
 *  exclusion holds by theorem); the server's initialize answer is derived from the whole set, not declared beside it. */
export type ConfigSet = { name: string; by: string; size: number; address: string; members: string[] }
export const setsOf = (ctx: Context, names: readonly string[] = ['legal', 'crypto']) => {
  const tools = (ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) as { result: { tools: { name: string; inputSchema: object; _meta?: { toolbox?: string; skill?: { instructions: string; directions: number }; ui?: { resourceUri?: string } } }[] } }).result.tools
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
  const addressOf = (members: readonly string[]) => uuidOf([...members].sort().join('\n'))
  const set = (name: string, by: string, members: readonly string[]): ConfigSet => ({ name, by, size: members.length, address: addressOf(members), members: [...members] })
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
  const [a, b] = names.map((n) => byName.get(n) ?? set(n, 'named, empty: no such set', []))
  const A = new Set(a!.members), B = new Set(b!.members)
  const union = [...new Set([...A, ...B])], intersection = [...A].filter((m) => B.has(m)), difference = [...A].filter((m) => !B.has(m)), symmetric = [...difference, ...[...B].filter((m) => !A.has(m))]
  const algebra = { a: a!.name, b: b!.name, union: set(`${a!.name} ∪ ${b!.name}`, 'union', union), intersection: set(`${a!.name} ∩ ${b!.name}`, 'intersection', intersection), difference: set(`${a!.name} ∖ ${b!.name}`, 'difference', difference), symmetric: set(`${a!.name} △ ${b!.name}`, 'symmetric difference', symmetric), inclusionExclusion: union.length === a!.size + b!.size - intersection.length, leads: differencesOf({ name: a!.name, members: a!.members }, { name: b!.name, members: b!.members }, { config: 'sets' }).leads }
  const mounts = sets.filter((x) => x.name.startsWith('mount:'))
  // the initialize answer derived from the set: tools because the tool set is non-empty, resources and the UI extension because the UI set is
  const derived = { tools: {}, ...(sets.find((x) => x.name === 'ui')!.size ? { resources: {}, extensions: { [MCP_APPS.extension]: { mimeTypes: [...new Set(resources.map((r) => r.mimeType))] } } } : {}) }
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
    says: 'the MCP is its config sets of widget-skilled tools: the server is the set of every element, a toolbox a subset, a mount the whole set at a host; sets are addressed by the fold of their sorted members and composed by union, intersection and difference; the initialize answer follows from the set',
  }
}
export const siteOf = (ctx: Context, origin: string) => {
  const list = (ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) as { result: { tools: { name: string; description: string; _meta?: { toolbox?: string } }[] } }).result.tools
  const boxOf = new Map(list.map((t) => [t.name, t._meta?.toolbox ?? 'none']))
  const heavy = new Set(['audit', 'metrics', 'imagine', 'discover', 'wave', 'readiness', 'e2e', 'textbook', 'clone'])
  // the site never lays itself out inside itself: the example that is this very call is skipped (it would replay every example again, inside the first replay)
  const docs = ctx.examples.filter((e) => !heavy.has(e.tool) && !e.arguments.selftest && !(e.tool === 'payload' && e.arguments.site)).map((e) => {
    const r = ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: e.tool, arguments: e.arguments } }) as { result?: { _meta: { block: { meta: { id: string } }; openGraph: Record<string, string> } }; error?: { message: string } }
    if (!r.result) return { id: e.id, tool: e.tool, toolbox: boxOf.get(e.tool) ?? 'none', error: r.error?.message ?? 'no result' }
    const uuid = r.result._meta.block.meta.id
    const d = payloadDocOf({ uuid, tool: e.tool, arguments: e.arguments, description: e.shows, openGraph: r.result._meta.openGraph, prev: null, chain: [], origin })
    return { id: e.id, tool: e.tool, toolbox: boxOf.get(e.tool) ?? 'none', uuid, url: `${origin}/${uuid}`, title: d.seo.title, description: e.shows, theorem: e.theorem ?? null, arguments: e.arguments, breadcrumbs: d.nestedDocs.breadcrumbs.length, blocks: 1 }
  })
  const useCases = [...new Set(docs.map((d) => d.toolbox))].map((toolbox) => ({ toolbox, pages: docs.filter((d) => d.toolbox === toolbox).length, tools: [...new Set(docs.filter((d) => d.toolbox === toolbox).map((d) => d.tool))] }))
  const gated = gateDocsOf(ctx, origin)
  return { reference: { site: 'https://payloadcms.com', contract: 'https://payloadcms.com/api/pages?limit=1&depth=0', shape: 'docs with layout blocks (blockType), meta (title, description), breadcrumbs: the site is what Payload computes; discovery reads it as the standard payload-site' }, origin, useCases: useCases.length, pages: docs.length, byUseCase: useCases, docs, gates: { root: gated.tree.root, categories: gated.counts.categories, gates: gated.counts.gates, pages: gated.docs.length, depth: gated.tree.depth, partition: gated.counts.partition, byKind: gated.counts.byKind, leads: gated.leads, byCategory: gated.categories }, collection: { slug: 'pages', totalDocs: docs.length + gated.docs.length, docs: [...docs.filter((d) => 'uuid' in d).map((d) => ({ id: d.uuid, title: d.title, slug: `/${d.uuid}`, layout: [(() => { const ch = channelOf(String(d.uuid)); return { blockType: 'qpu', tool: d.tool, uuid: d.uuid, handle: ch.handle, program: ch.program.join(''), tail: ch.tail, arguments: (d as { arguments?: Record<string, unknown> }).arguments ?? null, theorem: d.theorem ?? null } })()], meta: { title: d.title, description: d.description }, breadcrumbs: [{ doc: d.uuid, url: `/${d.uuid}`, label: d.title }], path: `/${d.uuid}`, parent: null, depth: 1 })), ...gated.docs] } }
}
/** Payload's skills for agents, read as data from the repository tree (github.com/payloadcms/skills): each skill and each of its references mapped to the tool of this tree that enacts it. No text of the skills is carried: the repository declares no licence; names, paths and sizes are facts. */
export const SKILL_MAP: Readonly<Record<string, { enactedBy: string[]; how: string }>> = {
  'payload': { enactedBy: ['configure', 'payload', 'extend'], how: 'the project shape: configure { kind: payload } holds the default plugins over the one pages collection; payload { site } lays the site out as pages; extend mounts this catalogue in the Payload MCP plugin' },
  'cms-migration': { enactedBy: ['configure', 'fold', 'mongo'], how: 'content moved at whole uptime: configure { kind: migration } is the plan, fold splits what a place cannot hold, mongo is the RAID\'s query language for the rows' },
  'ACCESS-CONTROL': { enactedBy: ['legal', 'configure'], how: 'roles over MCP itself: the RBAC host the Worker asks first (QPU_RBAC_MCP), the tenants\' tokens by name in configure { kind: tenant }' },
  'ACCESS-CONTROL-ADVANCED': { enactedBy: ['legal'], how: 'the security checks of the legal audit, sealed by the inputs\' SHA-256' },
  'ADAPTERS': { enactedBy: ['mongo', 'extend'], how: 'the RAID is the adapter of all adapters: the docket over the Mongo query language; every MCP an adapter through extend' },
  'ADVANCED': { enactedBy: ['dashboard', 'clone'], how: 'every facet of every tool laid out; a toolbox cloned whole for another host' },
  'COLLECTIONS': { enactedBy: ['payload', 'configure'], how: 'no custom collection: the plugins\' pages, every result a document with one qpu block' },
  'ENDPOINTS': { enactedBy: ['discover', 'extend'], how: 'the endpoints are doors: tools/list, the docket\'s four verbs, /.well-known/qpu.json; in the app, Payload\'s own: the entries collection (a call is an entry), the qpu global, the MCP plugin — no custom endpoint' },
  'FIELD-TYPE-GUARDS': { enactedBy: ['payload'], how: 'the block\'s fields are typed by the lexical document shape payloadDocOf gives' },
  'FIELDS': { enactedBy: ['payload', 'dashboard'], how: 'the qpu block\'s fields (uuid, handle, program, tail, tool, arguments, prev, next); every tool\'s inputSchema a form the dashboard enumerates' },
  'HOOKS': { enactedBy: ['payload'], how: 'blocks double as hooks: the next uuid is the program rotated, the referer chain the breadcrumbs' },
  'PLUGIN-DEVELOPMENT': { enactedBy: ['configure', 'clone'], how: 'MCP configures the default plugins in all combinations; a toolbox is a plugin cloned whole' },
  'QUERIES': { enactedBy: ['mongo', 'match'], how: 'the Mongo query language over the docket; a statement matched to the tool that serves it' },
  'PAYLOAD-FIELD-REFERENCE': { enactedBy: ['payload', 'fold'], how: 'the field reference of a migration: the document shape, and the fold that moves the rows under any bound' },
}
/** payloadcms.com's own configuration, read at github.com/payloadcms/website (MIT) on 2026-10-25, src/payload.config.ts: the plugins it mounts and the database it runs on — facts, compared with the plugins MCP configures here. */
export const PAYLOAD_WEBSITE = { repository: 'https://github.com/payloadcms/website', licence: 'MIT', config: 'src/payload.config.ts', plugins: ['form-builder', 'nested-docs', 'redirects', 'seo'], own: ['opsCounter'], editor: 'lexical with BlocksFeature', database: '@payloadcms/db-mongodb', storage: '@payloadcms/storage-vercel-blob', email: '@payloadcms/email-nodemailer', readAt: '2026-10-25' } as const
const camel = (dir: string) => dir.replace(/\.tsx?$/, '').replace(/^[A-Z]/, (c) => c.toLowerCase())
const BLOCK_ALIASES: Readonly<Record<string, string>> = { callToAction: 'cta', mediaContent: 'mediaContent' }
/** The website's source read as a tree: its collections, blocks, globals, fields and plugins by path; with the live page's block types, whether the site agrees with its source. */
export const websiteOf = (tree: { tree?: { path: string; type?: string; size?: number }[]; sha?: string; truncated?: boolean }, liveBlockTypes: readonly string[] = []) => {
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
export const skillsOf = (tree: { tree?: { path: string; type?: string; size?: number }[]; sha?: string; truncated?: boolean }) => {
  const entries = Array.isArray(tree.tree) ? tree.tree : []
  const skills = entries.filter((e) => /\/SKILL\.md$/.test(e.path)).map((e) => { const name = e.path.split('/').slice(-2, -1)[0]!; const dir = e.path.replace(/\/SKILL\.md$/, ''); const references = entries.filter((r) => r.path.startsWith(`${dir}/reference/`) && /\.md$/.test(r.path)).map((r) => { const ref = r.path.split('/').pop()!.replace(/\.md$/, ''); return { reference: ref, path: r.path, bytes: r.size ?? null, ...(SKILL_MAP[ref] ?? { enactedBy: [], how: 'no tool of this tree enacts this reference yet: a lead' }) } }); return { skill: name, path: e.path, bytes: e.size ?? null, ...(SKILL_MAP[name] ?? { enactedBy: [], how: 'no tool of this tree enacts this skill yet: a lead' }), references } })
  const unmapped = skills.flatMap((s) => [...(s.enactedBy.length ? [] : [s.skill]), ...s.references.filter((r) => !r.enactedBy.length).map((r) => r.reference)])
  return { repository: 'https://github.com/payloadcms/skills', sha: tree.sha ?? null, entries: entries.length, truncated: !!tree.truncated, skills: skills.length, references: skills.reduce((n, s) => n + s.references.length, 0), unmapped, catalogue: skills, licence: 'the repository declares no licence: names, paths and sizes are read as facts; no text is carried' }
}
/** The packages Payload ships, read from the packages directory of github.com/payloadcms/payload (the standard payload-packages, read by discovery on every run; names only, 2026-10-26: 45 directories). Every plugin, adapter and editor this tree configures must be one of them. */
export const PAYLOAD_PACKAGES = { repository: 'https://github.com/payloadcms/payload/tree/main/packages', read: '2026-10-26', names: ['admin-bar', 'codemod', 'create-payload-app', 'db-d1-sqlite', 'db-mongodb', 'db-postgres', 'db-sqlite', 'db-vercel-postgres', 'drizzle', 'email-nodemailer', 'email-resend', 'graphql', 'kv-redis', 'live-preview-react', 'live-preview-vue', 'live-preview', 'next', 'oxlint-config', 'oxlint-plugin', 'payload-cloud', 'payload', 'plugin-cloud-storage', 'plugin-ecommerce', 'plugin-form-builder', 'plugin-import-export', 'plugin-mcp', 'plugin-multi-tenant', 'plugin-nested-docs', 'plugin-redirects', 'plugin-search', 'plugin-sentry', 'plugin-seo', 'plugin-stripe', 'richtext-lexical', 'sdk', 'storage-azure', 'storage-gcs', 'storage-r2', 'storage-s3', 'storage-vercel-blob', 'tanstack-start', 'transformer-sharp', 'translations', 'typescript-plugin', 'ui'] } as const
const PACKAGE_KIND = (name: string): string => name.startsWith('plugin-') ? 'plugins' : name.startsWith('db-') ? 'databases' : name.startsWith('storage-') ? 'storage' : name.startsWith('email-') ? 'email' : name.startsWith('richtext-') ? 'editors' : name.startsWith('live-preview') ? 'live-preview' : 'runtime-and-tooling'
/** The catalogue classified, what the full stack mounts of it, and the minimum-cost path it offers: Payload's own adapters for Cloudflare D1 and R2. */
export const packagesOf = (names: readonly string[] = PAYLOAD_PACKAGES.names) => {
  const byKind: Record<string, string[]> = {}
  for (const n of names) (byKind[PACKAGE_KIND(n)] ??= []).push(n)
  const mounted = [...PAYLOAD_PLUGINS.map((p) => p.pkg.replace('@payloadcms/', '')), 'db-mongodb', 'storage-vercel-blob', 'email-nodemailer', 'plugin-stripe', 'next', 'ui', 'payload', 'graphql']
  const unknown = mounted.filter((m) => !names.includes(m))
  return { repository: PAYLOAD_PACKAGES.repository, read: PAYLOAD_PACKAGES.read, count: names.length, byKind, counts: Object.fromEntries(Object.entries(byKind).map(([k, v]) => [k, v.length])), mounted: mounted.filter((m) => names.includes(m)), unknown, available: names.filter((n) => !mounted.includes(n)), minimumCost: { cloudflare: names.filter((n) => n === 'db-d1-sqlite' || n === 'storage-r2'), says: 'Payload ships its own adapters for Cloudflare D1 and R2, so the app can bind to one provider at its free tiers (D1 5 GB, R2 10 GB) beside the Worker; choosing them is the tenant\'s act — a lead until then' }, says: `${names.length} packages: ${Object.entries(byKind).map(([k, v]) => `${v.length} ${k}`).join(', ')}; ${mounted.filter((m) => names.includes(m)).length} mounted by the full stack${unknown.length ? `; UNKNOWN to Payload: ${unknown.join(', ')}` : ''}` }
}
/** Payload's ecommerce template, read at the source (github.com/payloadcms/payload, templates/ecommerce, 2026-10-26; names and shapes only): the standard payload-ecommerce-template discovery reads on every run. */
export const PAYLOAD_ECOMMERCE = { repository: 'https://github.com/payloadcms/payload/tree/main/templates/ecommerce', read: '2026-10-26', src: ['access', 'app', 'blocks', 'collections', 'components', 'endpoints', 'fields', 'globals', 'heros', 'hooks', 'lib', 'plugins', 'providers', 'utilities'], collections: ['Categories', 'Media', 'Pages', 'Products', 'Users'], plugin: { package: 'plugin-ecommerce', access: ['adminOnlyFieldAccess', 'adminOrPublishedStatus', 'customerOnlyFieldAccess', 'isAdmin', 'isDocumentOwner'], customers: 'users', orders: 'ordersCollectionOverride adding accessToken (crypto.randomUUID on create)', payments: 'stripeAdapter({ secretKey, publishableKey, webhookSecret }) from @payloadcms/plugin-ecommerce/payments/stripe', products: 'productsCollectionOverride (title, description, gallery, layout, relatedProducts, meta, categories, slug)' }, pluginCollections: ['products', 'variants', 'variantTypes', 'variantOptions', 'carts', 'orders', 'transactions', 'addresses'], deps: ['stripe@18.5.0', '@stripe/stripe-js@^4', '@stripe/react-stripe-js@^3'] } as const
export const QPU_CURRENCIES = [{ code: 'EUR', decimals: 2, label: 'Euro', symbol: '€' }, { code: 'USD', decimals: 2, label: 'US Dollar', symbol: '$' }, { code: 'BGN', decimals: 2, label: 'Bulgarian lev', symbol: 'лв' }] as const
/** The licence catalogue as the ecommerce plugin's products: the API of selling is Payload's config (products, variants, carts, orders, transactions), the Stripe adapter its payment, nothing customised. */
export const ecommerceOf = (rates?: Record<string, { rate: number }>) => {
  const products = [...new Set(CATALOGUE.map((v) => v.product))]
  const harmonised = rates && Object.keys(rates).length ? rates : null
  return {
    template: PAYLOAD_ECOMMERCE,
    plugin: { package: '@payloadcms/plugin-ecommerce', version: '3.90.1', collections: PAYLOAD_ECOMMERCE.pluginCollections, customers: 'users (the site\'s own, roles admin | public)', currencies: { defaultCurrency: 'EUR', supportedCurrencies: QPU_CURRENCIES.map((c) => c.code) }, payments: { adapter: 'stripeAdapter', names: ['STRIPE_SECRET_KEY', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'STRIPE_WEBHOOKS_SIGNING_SECRET'] }, access: { isAdmin: 'a user with the admin role', adminOrPublishedStatus: 'admin, or the published status', isDocumentOwner: 'the customer of the document', adminOnlyFieldAccess: 'admin', isCustomer: 'a signed-in user' } },
    catalogue: { products: products.length, variants: CATALOGUE.length, currencies: QPU_CURRENCIES.length, prices: CATALOGUE.length * QPU_CURRENCIES.length, items: CATALOGUE.map((v) => ({ title: `QPU ${v.product.replace(/^qpu-/, '')} · ${v.variant}`, licence: { product: v.product, variant: v.variant, unit: v.unit, interval: v.interval, domains: v.domains }, prices: Object.fromEntries(QPU_CURRENCIES.map((c) => [`priceIn${c.code}`, harmonised ? Math.round((amountsOf(v.amounts.eur ?? 0, harmonised)[c.code.toLowerCase()] ?? v.amounts[c.code.toLowerCase()] ?? 0)) : v.amounts[c.code.toLowerCase()] ?? 0])) })), units: 'amounts in the currency\'s minor unit (cents, stotinki), as Stripe and the plugin\'s amount field take them', pricedBy: harmonised ? `the harmonised rates the currency step measured (${Object.keys(harmonised).join(', ')}): every price derived from the euro amount` : 'the catalogue\'s own amounts per currency (no harmonised rates passed: the currency step has not run yet)' },
    replaces: 'the fork\'s stripePlugin (plugin-stripe) — the ecommerce plugin\'s Stripe adapter is the payment; the Worker\'s stripe tool and its edge-executed checkout stay until the gate decodes the app beside it',
    seeded: 'src/scripts/seedQpu.ts creates every catalogue item as a product (by title) through the local API',
  }
}
/** The UI as a configuration (MCP Apps, SEP-1865, specification 2026-01-26, read at the source 2026-10-26): one app shell for every tool, a pure
 * function of the key and the theme — no randomness, no clock, no external domain — served as the ui:// resource of each tool and hosted by any
 * host that negotiates the extension; the site's playground hosts the same resource. The widget the tool computes is what the shell renders. */
export const MCP_APPS = { extension: 'io.modelcontextprotocol/ui', mimeType: 'text/html;profile=mcp-app', specification: 'https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx', scheme: 'ui://qpu/<tool>', read: '2026-10-26', methods: { view: ['ui/initialize', 'ui/notifications/initialized', 'ui/notifications/size-changed'], host: ['ui/notifications/tool-input', 'ui/notifications/tool-result', 'ui/notifications/tool-cancelled'] } } as const
/** The host's standardised theme variables mapped onto the tokens every widget of this tree uses: the widget never changes, the host's theme shows through. A token never maps onto its own name (a self-reference is a cycle the browser drops: measured as serif text in the playground); --font-sans is the host's own and read where it is used. */
export const UI_TOKENS: readonly [string, string, string][] = [
  ['--surface-1', '--color-background-secondary', '#f4f4f5'], ['--surface-2', '--color-background-tertiary', '#fafafa'], ['--border', '--color-border-primary', '#e4e4e7'],
  ['--text-primary', '--color-text-primary', '#18181b'], ['--text-secondary', '--color-text-secondary', '#52525b'], ['--text-muted', '--color-text-tertiary', '#71717a'],
  ['--fill-accent', '--color-background-info', 'var(--a432-accent)'], ['--font-size-title', '--font-text-md-size', '15px'], ['--font-size-footnote', '--font-text-xs-size', '12px'],
  ['--radius', '--border-radius-md', '8px'], ['--gap-xs', '--spacing-xs', '4px'], ['--gap-sm', '--spacing-sm', '8px'], ['--gap-md', '--spacing-md', '12px'], ['--pad-sm', '--spacing-sm', '8px'], ['--pad-md', '--spacing-md', '12px'],
]
/** The host of an MCP App in React (a client component): reads the tool's ui:// resource over the app's own MCP endpoint, hosts it in a sandboxed frame and speaks the Apps protocol; the same host the site's playground runs in Vue. Served to any shadcn frontend as the registry item qpu-app. */
export const reactHostOf = (): string => [
  "'use client'",
  "// The host of an MCP App: the tool's ui:// resource read over the MCP endpoint (resources/read), hosted in a sandboxed frame and spoken to",
  "// through the MCP Apps protocol (ui/initialize → initialized, tool-input, tool-result, size-changed). The UI is built from the MCP; nothing is drawn here.",
  "import React, { useEffect, useRef, useState } from 'react'",
  '',
  '// html: the resource already read by the server (the app reads it from the handler in its own runtime); else it is read over mcp with the key the MCP plugin takes (Authorization: Bearer <payload-mcp-api-keys key>, measured on 3.90.1)',
  'export type QpuAppProps = { tool: string; args: Record<string, unknown>; result: unknown; html?: string; mcp?: string; apiKey?: string }',
  'export const QpuApp: React.FC<QpuAppProps> = ({ tool, args, result, html: given, mcp = \'/api/mcp\', apiKey }) => {',
  '  const frame = useRef<HTMLIFrameElement>(null)',
  "  const [html, setHtml] = useState('') // mounted only once the listener below is registered: the view's ui/initialize must not race the host (measured)",
  '  const [height, setHeight] = useState(120)',
  '  const ready = useRef(false)',
  "  // plain data only: a framework proxy cannot be cloned across the frame, so every message is the JSON of itself",
  "  const post = (m: Record<string, unknown>) => frame.current?.contentWindow?.postMessage(JSON.parse(JSON.stringify({ jsonrpc: '2.0', ...m })), '*')",
  "  const tell = () => { if (!ready.current) return; post({ method: 'ui/notifications/tool-input', params: { arguments: args } }); post({ method: 'ui/notifications/tool-result', params: result }) }",
  '  useEffect(() => {',
  '    ready.current = false',
  "    if (given !== undefined) { setTimeout(() => setHtml(given), 0); return }",
  "    fetch(mcp, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', ...(apiKey ? { authorization: 'Bearer ' + apiKey } : {}) }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'resources/read', params: { uri: 'ui://qpu/' + tool } }) })",
  "      .then((r) => r.text()).then((t) => { const line = t.split('\\n').find((l) => l.startsWith('{') || l.startsWith('data: ')) ?? t; const j = JSON.parse(line.replace(/^data: /, '')); setHtml(j.result?.contents?.[0]?.text ?? '') }).catch(() => setHtml(''))",
  '  }, [tool, mcp, given, apiKey])',
  '  useEffect(() => { tell() }, [result])',
  '  useEffect(() => {',
  '    const on = (e: MessageEvent) => {',
  '      if (!frame.current || e.source !== frame.current.contentWindow) return',
  '      const m = e.data ?? {}',
  "      if (m.method === 'ui/initialize') { post({ id: m.id, result: { protocolVersion: '2026-01-26', hostCapabilities: {}, hostContext: { displayMode: 'inline' } } }); return }",
  "      if (m.method === 'ui/notifications/initialized') { ready.current = true; tell(); return }",
  "      if (m.method === 'ui/notifications/size-changed' && typeof m.params?.height === 'number') setHeight(Math.max(40, Math.min(2400, m.params.height + 8)))",
  '    }',
  "    window.addEventListener('message', on)",
  "    return () => window.removeEventListener('message', on)",
  '  })',
  "  return <iframe ref={frame} srcDoc={html} sandbox=\"allow-scripts\" title={'qpu · ' + tool} style={{ width: '100%', height, border: '0.5px solid var(--color-border-primary, #e4e4e7)', borderRadius: 8, background: 'transparent' }} />",
  '}',
  '',
].join('\n')
/** The shadcn registry (ui.shadcn.com/schema/registry.json, read 2026-10-26): the host and the block as registry items any shadcn frontend adds with npx shadcn add <url>; written by the configs step to the app's and the site's public/r. */
export const registryOf = (origin = 'https://qpu.uuidna.com', blockSource = ''): Record<string, unknown> => {
  const app = { $schema: 'https://ui.shadcn.com/schema/registry-item.json', name: 'qpu-app', type: 'registry:component', title: 'QPU App host', description: 'The host of an MCP App: reads a tool\'s ui://qpu/<tool> resource over the MCP endpoint and hosts it through the MCP Apps protocol in a sandboxed frame.', dependencies: [], registryDependencies: [], files: [{ path: 'components/qpu/app.tsx', type: 'registry:component', content: reactHostOf() }], docs: `import { QpuApp } from '@/components/qpu/app' — <QpuApp tool="processor" args={{ name: 'Willow' }} result={reply.result} mcp="${origin}/mcp" /> (the Worker takes no key); against a Payload app's /api/mcp pass apiKey (a payload-mcp-api-keys key the admin made) or html read by your server`, categories: ['mcp', 'qpu'] }
  const block = { $schema: 'https://ui.shadcn.com/schema/registry-item.json', name: 'qpu-block', type: 'registry:file', title: 'QPU block', description: 'The qpu block of UUID logic for Payload\'s lexical editor: the shape every tools/call result carries in _meta.payload.', dependencies: ['payload'], files: [{ path: 'blocks/qpu/config.ts', type: 'registry:file', target: 'src/blocks/Qpu/config.ts', content: blockSource }], categories: ['payload', 'qpu'] }
  return { 'registry.json': { $schema: 'https://ui.shadcn.com/schema/registry.json', name: 'qpu', homepage: origin, items: [{ ...app, files: app.files.map(({ path, type }) => ({ path, type })) }, { ...block, files: block.files.map(({ path, type, target }) => ({ path, type, target })) }] }, 'qpu-app.json': app, 'qpu-block.json': block }
}
export const uiOf = (tool: string, key: number = KEY): { uri: string; name: string; mimeType: string; html: string; csp: { connectDomains: string[]; resourceDomains: string[] }; prefersBorder: boolean } => {
  const accent = `hsl(${hueOf(key)} 62% 44%)`
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>qpu · ${tool}</title>
<style>
:root { --a432-key: ${key}; --a432-accent: ${accent}; ${UI_TOKENS.map(([t, h, d]) => `${t}: var(${h}, ${d});`).join(' ')} }
body { margin: 0; padding: var(--pad-sm); font-family: var(--font-sans, system-ui, sans-serif); color: var(--text-primary); background: transparent; }
.qpu-block { border-left: 3px solid var(--qpu-accent, var(--a432-accent)); padding-left: var(--pad-sm); }
.qpu-args { color: var(--text-muted); font-size: var(--font-size-footnote); margin-bottom: var(--gap-sm); white-space: pre-wrap; }
pre { background: var(--surface-1); border-radius: var(--radius); padding: var(--pad-sm); overflow: auto; font-size: var(--font-size-footnote); }
</style></head>
<body><div id="args" class="qpu-args"></div><div id="view" class="qpu-block" data-tool="${tool}">waiting for the tool's result</div>
<script>
(function () {
  // the view of the MCP Apps protocol: JSON-RPC over postMessage; every message the host sends is a notification this shell renders, nothing else runs
  var seq = 0, view = document.getElementById('view'), args = document.getElementById('args')
  var send = function (m) { parent.postMessage(Object.assign({ jsonrpc: '2.0' }, m), '*') }
  var size = function () { send({ method: 'ui/notifications/size-changed', params: { height: document.documentElement.scrollHeight } }) }
  var render = function (r) {
    var meta = r && r._meta ? r._meta : {}
    if (meta.theme) for (var k in meta.theme) view.style.setProperty(k, meta.theme[k])
    view.innerHTML = meta.widget ? meta.widget : '<pre>' + JSON.stringify(r && r.structuredContent !== undefined ? r.structuredContent : r, null, 1).replace(/</g, '&lt;') + '</pre>'
    size()
  }
  window.addEventListener('message', function (e) {
    var m = e.data || {}
    if (m.id === 1 && m.result) { send({ method: 'ui/notifications/initialized' }); return }
    if (m.method === 'ui/notifications/tool-input') { args.textContent = JSON.stringify(m.params && m.params.arguments); size() }
    if (m.method === 'ui/notifications/tool-result') render(m.params)
    if (m.method === 'ui/notifications/tool-cancelled') { view.textContent = 'the call was cancelled'; size() }
  })
  send({ id: ++seq, method: 'ui/initialize', params: { appCapabilities: { availableDisplayModes: ['inline'] }, appInfo: { name: 'qpu', version: '${VERSION}' } } })
  new ResizeObserver(size).observe(document.body)
})()
</script></body></html>
`
  return { uri: `ui://qpu/${tool}`, name: `qpu · ${tool}`, mimeType: MCP_APPS.mimeType, html, csp: { connectDomains: [], resourceDomains: [] }, prefersBorder: true }
}
/** Payload's adapters as a matrix over providers and Cloudflare bindings (the packages Payload ships, read at the source): a database, a storage and an email adapter make a combination, the payment adapter rides with the ecommerce plugin, and the RAID's docket (content-addressed entries, four verbs) is the semantics over whichever database answers. */
export const ADAPTERS = {
  database: [
    { pkg: 'db-mongodb', fn: 'mongooseAdapter', needs: ['DATABASE_URI'], provider: 'mongodb-atlas', binding: null, free: 'M0 512 MB' },
    { pkg: 'db-d1-sqlite', fn: 'sqliteD1Adapter', needs: ['D1 (a Cloudflare binding)'], provider: 'cloudflare', binding: 'D1', free: '5 GB, 5 million rows read a day' },
    { pkg: 'db-postgres', fn: 'postgresAdapter', needs: ['DATABASE_URI'], provider: 'neon, supabase or any postgres', binding: null, free: 'provider\'s free tier' },
    { pkg: 'db-sqlite', fn: 'sqliteAdapter', needs: ['DATABASE_URI (a file or libsql)'], provider: 'turso or a file', binding: null, free: 'a file' },
    { pkg: 'db-vercel-postgres', fn: 'vercelPostgresAdapter', needs: ['POSTGRES_URL'], provider: 'vercel', binding: null, free: 'hobby' },
  ],
  storage: [
    { pkg: 'storage-vercel-blob', fn: 'vercelBlobStorage', needs: ['BLOB_READ_WRITE_TOKEN'], provider: 'vercel', binding: null, free: '1 GB' },
    { pkg: 'storage-r2', fn: 'r2Storage', needs: ['R2 (a Cloudflare binding)'], provider: 'cloudflare', binding: 'R2', free: '10 GB, no egress fee' },
    { pkg: 'storage-s3', fn: 's3Storage', needs: ['S3_BUCKET', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY', 'S3_REGION'], provider: 'aws', binding: null, free: '5 GB a year' },
    { pkg: 'storage-gcs', fn: 'gcsStorage', needs: ['GCS_BUCKET', 'GCS_PROJECT_ID'], provider: 'google-cloud', binding: null, free: '5 GB' },
    { pkg: 'storage-azure', fn: 'azureStorage', needs: ['AZURE_STORAGE_CONNECTION_STRING', 'AZURE_STORAGE_CONTAINER_NAME'], provider: 'azure', binding: null, free: '5 GB a year' },
  ],
  email: [
    { pkg: 'email-nodemailer', fn: 'nodemailerAdapter', needs: ['SENDGRID_API_KEY (or any SMTP)'], provider: 'sendgrid or smtp', binding: null, free: '100 mails a day' },
    { pkg: 'email-resend', fn: 'resendAdapter', needs: ['RESEND_API_KEY'], provider: 'resend (HTTP, so it runs in a Worker)', binding: null, free: '3 000 mails a month' },
  ],
  payments: [{ pkg: 'plugin-ecommerce', fn: 'stripeAdapter', needs: ['STRIPE_SECRET_KEY', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'STRIPE_WEBHOOKS_SIGNING_SECRET'], provider: 'stripe', binding: null, free: 'no fee without a payment' }],
  bindings: ['D1 (database)', 'R2 (storage)', 'KV (cache by address)', 'DOCKET (the Durable Object docket, the RAID)', 'AI (Workers AI)', 'QPU (the Worker, a service binding)'],
  raid: 'the docket is the semantics over any database adapter: every entry addressed by its content, never overwritten, four verbs — Payload\'s REST and MCP are its doors, so the CMS reaches beyond its plugins by composing entries, not by adding routes',
} as const
export const adaptersOf = (env: readonly string[] = []) => {
  const have = new Set(env.map(String))
  const cloudflare = have.has('D1') || have.has('R2') || have.has('QPU_ADAPTERS=cloudflare')
  const choose = <T extends { pkg: string; needs: readonly string[]; binding: string | null }>(list: readonly T[], fallback: T): T => list.find((a) => (a.binding ? cloudflare && have.has(a.binding) : a.needs.every((n) => have.has(n.split(' ')[0]!)))) ?? fallback
  const chosen = { database: choose(ADAPTERS.database, ADAPTERS.database[0]), storage: choose(ADAPTERS.storage, ADAPTERS.storage[0]), email: choose(ADAPTERS.email, ADAPTERS.email[0]), payments: ADAPTERS.payments[0] }
  const combinations = ADAPTERS.database.length * ADAPTERS.storage.length * ADAPTERS.email.length
  return { matrix: ADAPTERS, combinations, says: `${ADAPTERS.database.length} databases × ${ADAPTERS.storage.length} storages × ${ADAPTERS.email.length} email adapters = ${combinations} combinations; chosen by what the environment names`, profiles: { cloudflare: ['db-d1-sqlite', 'storage-r2', 'email-resend', 'plugin-ecommerce (Stripe over HTTP)'], vercel: ['db-mongodb', 'storage-vercel-blob', 'email-nodemailer', 'plugin-ecommerce'], local: ['db-mongodb (the mongod listening)', 'storage-vercel-blob (disabled)', 'email-nodemailer (no key: logged)', 'plugin-ecommerce'] }, chosen: { database: chosen.database.pkg, storage: chosen.storage.pkg, email: chosen.email.pkg, payments: chosen.payments.pkg, profile: cloudflare ? 'cloudflare' : have.has('BLOB_READ_WRITE_TOKEN') ? 'vercel' : 'local' }, bindings: ADAPTERS.bindings, raid: ADAPTERS.raid }
}
/** The app's own wrangler configuration for Cloudflare (OpenNext's layout): every binding the adapters can take, the flags the Worker needs, the service binding to the QPU Worker. */
export const siteWranglerOf = () => ({ $schema: 'node_modules/wrangler/config-schema.json', name: 'qpu-site', main: '.open-next/worker.js', compatibility_date: '2026-10-01', compatibility_flags: ['nodejs_compat', WEBCRYPTO_FLAG], assets: { directory: '.open-next/assets', binding: 'ASSETS' }, vars: { QPU_ADAPTERS: 'cloudflare', QPU_ORIGIN: 'https://qpu.uuidna.com' }, d1_databases: [{ binding: 'D1', database_name: 'qpu-site', database_id: '<the tenant\'s>' }], r2_buckets: [{ binding: 'R2', bucket_name: 'qpu-media' }], kv_namespaces: [{ binding: 'KV', id: '<the tenant\'s>' }], services: [{ binding: 'QPU', service: 'qpu' }], ai: { binding: 'AI' }, observability: { enabled: true } })
/** The scopes of the full stack: every tenant over every scoped collection (the multi-tenant plugin), every role over the docket (the Worker's roles), every toolbox as a scope of the MCP server. More tenants is the whole of scaling: no more code. */
export const TENANT_ROLES = ['tenant-admin', 'editor', 'viewer'] as const
export const SCOPES = {
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
export const FIELDS = {
  entries: [
    { name: 'id', type: 'text', required: true, readOnly: true, validation: 'a RFC 9562 UUID of 36 characters, the content address computed by the hook' },
    { name: 'kind', type: 'text', required: true, index: true, validation: 'lower-case letters and dashes' },
    { name: 'from', type: 'text', required: true, index: true, validation: 'a device, a tool or a tenant name' },
    { name: 'body', type: 'json', required: false, validation: 'JSON, any shape; its bytes are what the address folds' },
    { name: 'sha256', type: 'text', required: false, readOnly: true, validation: '64 hex digits, computed by the hook' },
    { name: 'links', type: 'array', required: false, validation: 'entries by address: each a UUID of 36 characters' },
  ],
  qpu: [
    { name: 'uuid', type: 'text', required: true, validation: 'a UUID of 36 characters: the block address' },
    { name: 'handle', type: 'text', required: true, validation: 'the handle the UUID\'s first hex digits name' },
    { name: 'program', type: 'text', required: true, validation: 'the program digits of the UUID' },
    { name: 'tail', type: 'text', required: true, validation: 'the tail digits of the UUID' },
    { name: 'tool', type: 'text', required: true, validation: 'a tool of the catalogue (tools/list)' },
    { name: 'arguments', type: 'json', required: false, validation: 'the tool\'s inputSchema' },
    { name: 'prev', type: 'text', required: false, validation: 'a UUID of 36 characters or empty' },
    { name: 'next', type: 'text', required: false, validation: 'a UUID of 36 characters or empty' },
  ],
} as const
/** The validations as regular expressions the generated collection enforces (Payload validate functions): pure, the same in the app and at the edge. */
export const VALIDATIONS: readonly { field: string; of: 'entries' | 'qpu'; pattern: string; says: string }[] = [
  { field: 'id', of: 'entries', pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', says: 'a UUID of 36 characters' },
  { field: 'kind', of: 'entries', pattern: '^[a-z][a-z-]*$', says: 'lower-case letters and dashes' },
  { field: 'sha256', of: 'entries', pattern: '^[0-9a-f]{64}$', says: '64 hex digits' },
  { field: 'uuid', of: 'qpu', pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', says: 'a UUID of 36 characters' },
  { field: 'prev', of: 'qpu', pattern: '^$|^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', says: 'a UUID or empty' },
  { field: 'next', of: 'qpu', pattern: '^$|^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', says: 'a UUID or empty' },
]
/** The access of the entries collection by role, the Worker's roles carried into Payload: a reader reads, a writer creates, nothing updates (content-addressed: immutable), an admin deletes. */
export const ACCESS = {
  entries: { read: 'everyone', create: 'a call by anyone (its address folds the call); other kinds by a super admin, a tenant-admin or editor of the entry\'s tenant, or the tenant\'s writer token', update: 'no one: an entry is its content address, so a change is a new entry', delete: 'a super admin, a tenant-admin of the entry\'s tenant (a where on the tenant), or the tenant\'s admin token' },
  tenants: { read: 'everyone', write: 'a super admin (the admin role)' },
  users: 'the site\'s own (admin or self), with an API key per user for MCP clients',
  pages: 'the site\'s own access, kept (published pages public, drafts to users)',
  by: 'the x-qpu-role header the Worker sets from the Authorization token (roles.ts), or Payload\'s user',
} as const
/** The actions at quantum scale: a batch is one JSON-RPC array answered as one array; Payload\'s bulk REST by where; a batch above the quantum is sharded (the shard tool\'s theorems) and the shards run as one wave; the experience the gate measured decides the shard size. */
export const actionsOf = (experience?: { copies?: number; involutions?: number; msByHost?: Record<string, number> }) => {
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
export const FILE_ROLES = {
  block: { folder: 'src/blocks', shape: '<Pascal>/config.ts', loads: 'the Payload config (the blocks of the pages layout), server only' },
  config: { folder: 'src', shape: 'payload.qpu.<lower>.ts', loads: 'imported by payload.config.ts: one module per concern (plugins, mcp, ecommerce, adapters)' },
  notice: { folder: '', shape: '<UPPER>.qpu.md', loads: 'read by people and licence scanners; never compiled' },
  collection: { folder: 'src/collections', shape: '<Pascal>.ts', loads: 'the Payload config, server only' },
  hooks: { folder: 'src/collections', shape: '<lower>.qpu.hooks.ts', loads: 'imported by the hand-held collection of that slug' },
  global: { folder: 'src/globals', shape: '<Pascal>.ts', loads: 'the Payload config, server only' },
  component: { folder: 'src/components/blocks/Qpu', shape: '<member>.tsx', loads: 'the App Router and the Pages Router (RenderBlocks): no next/headers, no @payload-config' },
  script: { folder: 'src/scripts', shape: '<camel>.ts', loads: 'payload run, with the config' },
  plugin: { folder: 'src/plugins', shape: '<camel>.ts', loads: 'the Payload config, as plugins: [qpuPlugin()]: one plugin with multidimensional capabilities that fits any config without hacking it — its collections, its global, its block, its hooks on the installed plugins\' default collections, the plugins it composes' },
} as const
export type FileRole = keyof typeof FILE_ROLES
const pascalOf = (t: string) => t.replace(/(^|[-_ ])([a-z])/g, (_m, _s, c: string) => c.toUpperCase())
const camelOf = (t: string) => { const p = pascalOf(t); return p.slice(0, 1).toLowerCase() + p.slice(1) }
/** The path of a generated file from its role and key alone. */
export const fileOf = (role: FileRole, key: string): string => {
  const base = ['site', FILE_ROLES[role].folder].filter(Boolean).join('/')
  switch (role) {
    case 'block': return `${base}/${pascalOf(key)}/config.ts`
    case 'config': return `${base}/payload.qpu.${key.toLowerCase()}.ts`
    case 'notice': return `${base}/${key.toUpperCase()}.qpu.md`
    case 'collection': case 'global': return `${base}/${pascalOf(key)}.ts`
    case 'hooks': return `${base}/${key.toLowerCase()}.qpu.hooks.ts`
    case 'component': return `${base}/${key}.tsx`
    case 'script': case 'plugin': return `${base}/${camelOf(key)}.ts`
  }
}
export const HOOKS = {
  principle: 'every hook keeps a read free: the content address makes an entry immutable (a duplicate write is the same id), the tag invalidates only the page that changed, so the provider is paid for writes and first computations, never for reads',
  collections: [
    { slug: 'entries', file: fileOf('collection', 'entries'), source: 'tool', hooks: [
      { hook: 'beforeValidate', does: 'id = the content address of { kind, from, body }, sha256 beside it; on create only; never typed, never overwritten', keepsFree: 'a duplicate write lands on the same id: no second row, no second computation' },
      { hook: 'none on change', does: 'an entry never updates (access.update is false) and its address is its content, so nothing cached under it changes: no revalidation; a call created during a render needs none (Next refuses one)', keepsFree: 'every read after the first is a cache hit by address, forever' },
    ] },
    { slug: 'pages', file: fileOf('plugin', 'qpu'), source: 'tool', hooks: [
      { hook: 'afterChange', does: 'revalidatePath of the breadcrumb url on publish (the site\'s own hook, kept)', keepsFree: 'a page is rebuilt once per change and served from the cache between' },
      { hook: 'beforeChange', does: 'collisionGuard: an edit that names the address it read (If-Match, or context.prev) is accepted only while the document still folds to that address; else the collision is answered with both addresses, never a silent overwrite', keepsFree: 'no read is spent: the stored address is folded from the document the hook already holds' },
    ] },
  ],
} as const
/** Every provider the full stack binds to, its bindings and variable NAMES (values never travel), and where its cost sits. */
export const BINDINGS: readonly { provider: string; role: string; bindings: string[]; names: string[]; freeTier: string; paidFor: string; keptFree: string }[] = [
  { provider: 'cloudflare', role: 'the Worker and the docket (until the gate decodes the Payload app beside them)', bindings: ['ASSETS (static site)', 'DOCKET (Durable Object, SQLite)', `compatibility_flags [${WEBCRYPTO_FLAG}]`], names: ['QPU_WRITE_TOKEN_<TENANT>', 'QPU_ADMIN_TOKEN_<TENANT>', 'QPU_DATA_KEY', 'QPU_SIGNING_KEY_<TENANT>', 'QPU_MCP_HOSTS_<TENANT>'], freeTier: '100k requests a day, static assets free', paidFor: 'requests beyond the tier, Durable Object requests and storage', keptFree: 'ETag involutions answer 304 without a body; a block computed once is teleported, never recomputed' },
  { provider: 'mongodb-atlas', role: 'the database behind Payload (the docket over the mongo language)', bindings: ['DATABASE_URI (mongooseAdapter)'], names: ['DATABASE_URI'], freeTier: 'M0 shared cluster, 512 MB', paidFor: 'storage and operations beyond M0', keptFree: 'content-addressed entries are written once; reads come from the app\'s cache by tag' },
  { provider: 'vercel', role: 'the Payload app (Next.js) and blob storage', bindings: ['BLOB_READ_WRITE_TOKEN (vercelBlobStorage)', 'NEXT_PRIVATE_REVALIDATION_KEY', 'NEXT_PRIVATE_DRAFT_SECRET'], names: ['PAYLOAD_SECRET', 'BLOB_READ_WRITE_TOKEN', 'BLOB_STORAGE_ENABLED', 'BLOB_STORE_ID', 'NEXT_PUBLIC_SITE_URL', 'NEXT_PRIVATE_REVALIDATION_KEY', 'NEXT_PRIVATE_DRAFT_SECRET', 'QPU_ORIGIN'], freeTier: 'hobby: serverless functions, 100 GB bandwidth, blob 1 GB', paidFor: 'function invocations and bandwidth beyond hobby', keptFree: 'tags revalidate one page per change; UUID pages are immutable and cached forever' },
  { provider: 'stripe', role: 'the licence checkout per tenant (the Worker) and the ecommerce plugin\'s payment (the app)', bindings: ['ecommercePlugin: stripeAdapter'], names: ['STRIPE_SECRET_KEY_<TENANT>', 'STRIPE_WEBHOOK_SECRET_<TENANT>', 'STRIPE_SECRET_KEY', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'STRIPE_WEBHOOKS_SIGNING_SECRET'], freeTier: 'no fee without a payment', paidFor: 'a fee per successful payment', keptFree: 'a plan is computed here; Stripe is asked only at checkout' },
  { provider: 'payload-mcp', role: 'the handler\'s tools served by @payloadcms/plugin-mcp', bindings: ['mcpPlugin (server qpu)'], names: ['PAYLOAD_MCP_API_KEY'], freeTier: 'the app\'s own compute', paidFor: 'nothing beyond the app', keptFree: 'tools/call is pure: the same arguments answer the same address' },
  { provider: 'anthropic', role: 'the operator agent that mounts the QPU through the MCP connector (only when named)', bindings: ['mcp_servers + mcp_toolset'], names: ['ANTHROPIC_API_KEY'], freeTier: 'none', paidFor: 'tokens of every request', keptFree: 'never called by the tree; the registration is computed, the request is the operator\'s' },
]
/** Every configuration's file in the tree and who is its source: the tool (written on every run, drift zero by construction) or the hand (measured on every run, drift a lead). */
export const CONFIG_FILES: readonly { kind: ConfigKind; path: string; source: 'tool' | 'hand'; format: 'jsonc' | 'json' | 'text' | 'ts'; /** files the hand-held one spreads into itself: measured as one text */ with?: readonly string[] }[] = [
  { kind: 'wrangler', path: 'wrangler.jsonc', source: 'tool', format: 'jsonc' },
  { kind: 'pwa', path: 'docs/public/manifest.webmanifest', source: 'tool', format: 'json' },
  { kind: 'fullstack', path: 'site/', source: 'tool', format: 'text' },
  { kind: 'bindings', path: 'site/.env.qpu.example', source: 'tool', format: 'text' },
  { kind: 'ui', path: 'site/public/r/', source: 'tool', format: 'text' },
  { kind: 'adapters', path: 'site/wrangler.jsonc', source: 'tool', format: 'jsonc' },
  { kind: 'payload', path: 'site/src/payload.config.ts', source: 'hand', format: 'ts', with: [fileOf('plugin', 'qpu'), fileOf('config', 'config'), fileOf('config', 'ecommerce'), fileOf('config', 'adapters')] },
  { kind: 'hooks', path: fileOf('plugin', 'qpu'), source: 'tool', format: 'ts' },
  { kind: 'api', path: 'site/next.config.js', source: 'hand', format: 'ts' },
]
const PLUGIN_FN: Record<string, string> = { ecommerce: 'ecommercePlugin', lexical: 'lexicalEditor', 'nested-docs': 'nestedDocsPlugin', seo: 'seoPlugin', search: 'searchPlugin', redirects: 'redirectsPlugin', 'form-builder': 'formBuilderPlugin', 'multi-tenant': 'multiTenantPlugin', mcp: 'mcpPlugin' }
/** The drift of a hand-held TypeScript file against the configuration MCP computes: what the file should mount or call and does not. */
export const heldDriftOf = (kind: ConfigKind, text: string): string[] => {
  // the plugin must be mounted last: it hooks the collections the other plugins create (form-submissions), so a plugin called after it is drift
  if (kind === 'payload') return [...(/\bqpuPlugin\(/.test(text) ? [] : ['plugins.qpuPlugin']), ...(/\bqpuPlugin\(/.test(text) && /\b[a-zA-Z]+Plugin\(/.test(text.slice(text.indexOf('qpuPlugin(') + 10)) ? ['plugins.qpuPlugin.last'] : []), ...['qpuDb', 'qpuEmail', 'qpuStoragePlugins'].filter((fn) => !new RegExp(`\\b${fn}\\(`).test(text)).map((fn) => `adapters.${fn}`), ...(/process\.env\.PAYLOAD_SECRET/.test(text) ? [] : ['env.PAYLOAD_SECRET'])]
  if (kind === 'hooks') return [] // the hooks are the plugin's (tool-sourced): nothing held by hand, nothing to drift
  if (kind === 'api') return [...['/api/globals/qpu', '/api/mcp', '/api/entries/:uuid'].filter((d) => !text.includes(d)).map((d) => `rewrite.${d}`), ...(text.includes("'/api/qpu'") ? ['custom-endpoint./api/qpu'] : [])]
  if (kind === 'bindings') return BINDINGS.flatMap((b) => b.names.filter((n) => !n.includes('<TENANT>') && b.provider !== 'anthropic' && b.provider !== 'cloudflare' && !text.includes(n)).map((n) => `${b.provider}.${n}`))
  return []
}
/** The environment example for the app: every name the bindings need, its provider and role, never a value. */
export const envExampleOf = (): string => ['# @uuidna/qpu: the names the full stack binds to, by provider (values never travel; set them in the provider\'s dashboard or .env)', '# GENERATED by npm run next through configure { kind: \'bindings\' }; edit src/quantum/toolboxes/payload.ts (BINDINGS), never this file.', '', ...BINDINGS.flatMap((b) => [`# ${b.provider}: ${b.role}`, `#   free: ${b.freeTier}; paid for: ${b.paidFor}; kept free: ${b.keptFree}`, ...b.names.map((n) => (n.includes('<TENANT>') ? [...Object.values(TENANTS), 'ceci'].map((t) => `${n.replace('<TENANT>', t.toUpperCase())}=`) : [`${n}=`])).flat(), ''])].join('\n')
/** Realtime collaboration and editing through every channel Payload streams — the document lock, the live preview, autosave, versions, the MCP
 *  event stream — with collisions managed precisely: an edit names the address it read and is accepted only while the document still folds to
 *  it (textbook_edit_collides: two edits of one document share their base or collide, no third case), so a collision is detected exactly and
 *  signalled with both addresses, never guessed from clocks and never a silent overwrite. */
export const REALTIME = {
  streams: [
    { channel: 'document lock', payload: 'lockDocuments { duration: 300 } on every editable collection', signals: 'who edits which document, shown to every other editor in the admin; released on save, on leave or after the duration', collections: ['pages', 'products', 'tenants', 'users'] },
    { channel: 'live preview', payload: 'admin.livePreview { url, breakpoints } on pages: the form state streamed to the preview frame by postMessage and rendered by @payloadcms/live-preview-react', signals: 'every keystroke rendered before it is saved' },
    { channel: 'autosave', payload: 'versions.drafts.autosave { interval: 800 }: the draft streamed to the store on an interval', signals: 'a version per autosave; an editor never loses an edit' },
    { channel: 'versions', payload: 'versions on pages: every save a version, drafts beside the published document', signals: 'the history every editor reads; a restore is an edit' },
    { channel: 'MCP stream', payload: 'the MCP plugin over streamable HTTP (text/event-stream): a client holds the stream open and receives results as events', signals: 'the tool results of the QPU, the entries this app writes among them' },
  ],
  collisions: { precondition: 'If-Match: <address> (REST), context.prev (the local API)', address: 'the fold of the content (title, hero, layout, meta), never the clocks', onMismatch: 'ValidationError: collision — the document is at <current>, the edit was based on <prev>; read it again and re-apply (Payload answers 400; the Worker answers 412 for the same precondition on the docket)', hook: fileOf('hooks', 'pages'), theorem: 'textbook_edit_collides', says: 'two edits of one document either share their base address or collide: there is no third case, so a collision is detected exactly, never guessed from clocks' },
  messaging: { during: 'the lock names the editor; the live preview shows the edit; a collision answers with both addresses; an accepted edit is a version the others read', channel: 'Payload has no message channel between editors: the MCP stream carries the QPU\'s results, not chat', lead: 'payload-realtime-messaging' },
  editing: {
    manually: 'the admin panel: the lock names the editor, autosave streams the draft, the live preview renders it; REST: If-Match: <address> on PATCH /api/pages/<id> (read the address from GET first)',
    viaMcp: 'the Payload MCP plugin\'s update tool (Authorization: <users> API-Key <key>) with editBase: <address> in the data — the virtual field the guard reads and drops, so the plugin\'s own tools carry the precondition unchanged; the QPU\'s payload tool answers the document shape and the entries the edit writes',
    signal: 'a collision answers both addresses to whichever channel sent the edit (the admin form, the REST client, the MCP client); an accepted edit is the next address every channel reads',
  },
  held: { file: fileOf('plugin', 'qpu'), must: ['lockDocuments', 'versions.drafts.autosave', 'hooks.beforeChange: collisionGuard', 'editBase (virtual, hidden)'], measured: 'the plugin adds them to pages at config time: nothing held by hand, nothing to drift' },
} as const
/** Via the Payload MCP plugin is mandatory: the default collections of the installed plugins (nothing added) are served by the plugin's own tools,
 *  scoped by the multi-tenant plugin and authorised by a user's API key, each with the capabilities a client may use. The intelligence of
 *  combinatorics is to fit any environment without hacking it: a request is a form submission, a bundle a media file, a licence a product,
 *  a tenant's configuration its tenants document; what the stack holds beyond the defaults is a refactoring lead. */
export const PLUGIN_DEFAULT_COLLECTIONS: readonly string[] = ['pages', 'posts', 'media', 'users', 'forms', 'form-submissions', 'search', 'redirects', 'tenants', 'products', 'variants', 'carts', 'orders', 'transactions', 'addresses', 'payload-mcp-api-keys']
export const MCP_COLLECTIONS: Readonly<Record<string, { description: string; enabled: { find: boolean; create: boolean; update: boolean; delete: boolean } }>> = {
  pages: { description: 'the site\'s pages: the use cases and the gates (the competition gates carry the competitors and the theorems), each a qpu block; edits carry editBase (the collision precondition)', enabled: { find: true, create: true, update: true, delete: false } },
  forms: { description: 'the forms: "Request an app" among them', enabled: { find: true, create: false, update: false, delete: false } },
  'form-submissions': { description: 'a submission of "Request an app" generates the app (the bundle into media, the licence at the checkout)', enabled: { find: true, create: true, update: false, delete: false } },
  media: { description: 'the uploads: a generated app is a JSON file here (every file with its address, the bundle address, the price, the order)', enabled: { find: true, create: false, update: false, delete: false } },
  products: { description: 'the licence catalogue as products of the ecommerce plugin', enabled: { find: true, create: false, update: false, delete: false } },
  carts: { description: 'the carts of the ecommerce plugin: a licence product put in one is bought at its checkout', enabled: { find: true, create: true, update: true, delete: false } },
  orders: { description: 'the orders the checkout wrote', enabled: { find: true, create: false, update: false, delete: false } },
  tenants: { description: 'the tenants by host; settings are the plugin options a tenant configures (merged into every qpu block call under its hosts)', enabled: { find: true, create: false, update: true, delete: false } },
  entries: { description: 'the docket: content-addressed entries (calls, licences, signals); immutable', enabled: { find: true, create: true, update: false, delete: false } },
}
const configKinds = ['payload', 'wrangler', 'tenant', 'pwa', 'mcp', 'versions', 'migration', 'fullstack', 'api', 'hooks', 'bindings', 'scopes', 'fields', 'validations', 'access', 'actions', 'packages', 'ecommerce', 'ui', 'adapters', 'gates', 'sets', 'realtime'] as const
type ConfigKind = typeof configKinds[number]
/** The torus of a configuration: its address, seed and reflection, and whether the loop closes (config → text → config at the same address). */
const torusOf = (config: unknown) => {
  const text = JSON.stringify(config)
  const address = uuidOf(text)
  const seed = seedOf(parseInt(address.slice(-2), 16) || 1)
  const back = JSON.stringify(JSON.parse(text))
  return { address, seed, reflection: 10 - seed, trinity: trinityOf(seed), closed: uuidOf(back) === address, bytes: text.length }
}
const varsOf = (tenant: string) => {
  const T = tenant.toUpperCase()
  const hostVar = (h: string) => `QPU_MCP_TOKEN_${h.toUpperCase().replace(/[.-]/g, '_')}_${T}`
  return {
    tenant,
    secrets: [`QPU_WRITE_TOKEN_${T}`, `QPU_ADMIN_TOKEN_${T}`, `STRIPE_SECRET_KEY_${T}`, `STRIPE_WEBHOOK_SECRET_${T}`, ...CLOUDFLARE_MCP.filter((c) => c.host !== 'docs.mcp.cloudflare.com').map((c) => hostVar(c.host))],
    vars: [`QPU_MCP_HOSTS_${T}`],
    shared: ['QPU_DATA_KEY', 'QPU_RBAC_MCP', 'QPU_RBAC_TOOL'],
    note: 'names only: the operator sets the values as wrangler secrets; a tool never reads or carries a value',
  }
}
/** The next version, defined by development, kept as low as the architecture allows: every component is one digit (0–9); a
 *  patch never moves the number (the change lives in the content address: build metadata +fold); a tool new carries the
 *  minor digit, and at 10 the major; a tool gone carries the major; the major past 9 returns to 1 with the epoch counted in
 *  the build metadata — so the lifespan of every single-digit combination is infinite: within a version, every state is an
 *  address, and the number changes only when the catalogue changes shape. */
export const nextVersionOf = (current: string, toolsNow: readonly string[], lastTag: { version: string; tools: readonly string[]; epoch?: number }): { next: string; bump: 'major' | 'minor' | 'none'; epoch: number; build: string; added: string[]; removed: string[]; digits: 'single' } => {
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
export const configOf = (kind: ConfigKind, ctx: Context, p: { version?: string; description?: string; lastTag?: { version: string; tools: readonly string[] }; experience?: { copies?: number; involutions?: number; msByHost?: Record<string, number> }; rates?: Record<string, { rate: number }>; env?: readonly string[]; sets?: readonly string[] } = {}) => {
  const hosts = Object.keys(TENANTS)
  switch (kind) {
    case 'payload': return { collections: [{ slug: 'pages', fields: ['lexical', 'tenant'], note: 'the plugins\' own collection; the fields are the plugins\'' }], plugins: PAYLOAD_PLUGINS.map((p) => ({ [p.name]: { package: p.pkg, ...p.options } })), combinations: 2 ** PAYLOAD_PLUGINS.length, combinationNote: 'every subset of the plugins is a configuration; the dashboard of this tool enumerates them by address' }
    case 'wrangler': return { $schema: 'node_modules/wrangler/config-schema.json', name: 'qpu', main: 'src/worker.ts', compatibility_date: '2026-10-01', compatibility_flags: [WEBCRYPTO_FLAG], workers_dev: true, assets: { directory: './docs/.vitepress/dist', binding: 'ASSETS', run_worker_first: true, not_found_handling: 'none' }, routes: hosts.map((h) => ({ pattern: h, custom_domain: true })), durable_objects: { bindings: [{ name: 'DOCKET', class_name: 'DocketObject' }] }, migrations: [{ tag: 'v1', new_sqlite_classes: ['DocketObject'] }], observability: { enabled: true } }
    case 'tenant': return { tenants: [...Object.values(TENANTS), 'ceci'].map(varsOf), records: Object.entries(TENANTS).reduce<Record<string, { name: string; slug: string; domains: { domain: string }[]; currency: string }>>((acc, [host, t]) => ({ ...acc, [t]: { name: t, slug: t, domains: [...(acc[t]?.domains ?? []), { domain: host }], currency: TENANT_CURRENCY[t] ?? 'EUR' } }), {}), mcpHostsDefault: DEFAULT_MCP_HOSTS }
    case 'pwa': { const accent = `hsl(${hueOf(KEY)} 62% 44%)`; return { name: '@uuidna/qpu', short_name: 'qpu', description: p.description ?? '', id: '/', start_url: '/', scope: '/', display: 'standalone', orientation: 'any', background_color: '#0b0b0f', theme_color: accent, lang: 'en', dir: 'ltr', categories: ['developer', 'education', 'productivity'], icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }, { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' }], shortcuts: [{ name: 'Every tool laid out', url: '/' + uuidOf('dashboard{}'), description: 'the dashboard index: every tool with the size of its space' }, { name: 'Examples', url: '/examples' }, { name: 'Stream', url: '/stream' }, { name: 'Readiness', url: '/readiness' }], related_applications: [], prefer_related_applications: false, license: 'CC-BY-NC-ND-4.0', version: p.version ?? null } }
    case 'versions': {
      const tools = (ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) as { result: { tools: { name: string }[] } }).result.tools.map((t) => t.name)
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
      const list = (ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) as { result: { tools: { name: string; description: string; _meta?: { toolbox?: string } }[] } }).result.tools
      const origin = 'https://qpu.uuidna.com'
      return {
        name: '@uuidna/qpu', version: VERSION, origin, hosts: [...hosts.map((h) => `https://${h}`), 'https://qpu.ceci.workers.dev'],
        architecture: 'Everything goes through one MCP endpoint: POST /mcp takes JSON-RPC 2.0 (initialize, tools/list, tools/call); every tools/call result is a block addressed by its content, and every other surface serves or carries blocks. No hardware, no network inside the tools, nothing factored beyond N ≤ 21.',
        endpoints: [
          { method: 'POST', path: '/mcp', takes: 'JSON-RPC 2.0: initialize, tools/list, tools/call { name, arguments }', answers: 'the result with structuredContent and _meta (widget, block, theme, jsonLd, payload, license); ETag the content hash, X-Qpu-Address the block address, X-Qpu-Version; streamed by default as the MCP streamable transport\'s event when the client accepts text/event-stream, JSON otherwise', auth: 'none for every pure tool; a tenant\'s tokens only for the docket', errors: 'JSON-RPC -32601 (no such tool or method), -32602 (invalid params, with the bound the schema names), -32700 (parse error)' },
          { method: 'GET', path: '/.well-known/qpu.json', takes: 'nothing', answers: 'the discovery document: mcp, docket, methods, tools, bounds, version, tenants, mcpHosts, roles, licence, the reverse (the unit)', auth: 'none' },
          { method: 'GET', path: '/', takes: 'accept: application/json for the discovery document; otherwise the web OS', answers: 'the discovery document or the site', auth: 'none' },
          { method: 'GET', path: '/<uuid>', takes: 'a content-addressed v8 UUID: one address for the block and for the entry; accept: application/json for the entry', answers: 'the block\'s page (the widget, prev and next, the theme from the UUID), or the entry as JSON; immutable, ETag the address, 304 to If-None-Match; no prefix: the catch-all routes all', auth: 'none' },
          { method: 'GET', path: '/docket', takes: '?kind=&since=', answers: 'the tenant\'s entries (one docket per tenant host)', auth: 'none to read' },
          { method: 'GET', path: '/docket/<id>', takes: 'an entry id; ?cheap, ?heal', answers: 'the entry, healed from a mirror by address when missing', auth: 'none to read' },
          { method: 'POST', path: '/docket', takes: '{ kind, from, body, links? } or a commitment { kind, from, address, sha256 }', answers: '201 with the entry id (content address); 400 on shape, 413 above the entry bound', auth: 'Bearer: the tenant\'s writer token (QPU_WRITE_TOKEN_<TENANT>) or the RBAC MCP host\'s role' },
          { method: 'DELETE', path: '/docket/<id>', takes: 'an entry id', answers: 'the entry gone', auth: 'Bearer: the tenant\'s admin token' },
          { method: 'POST', path: '/docket/stripe', takes: 'a Stripe webhook, signed', answers: 'the event as an entry, idempotent', auth: 'STRIPE_WEBHOOK_SECRET_<TENANT>' },
          { method: 'GET', path: '/health', takes: 'nothing', answers: 'status, tenant, licence and the metrics computed now', auth: 'none' },
        ],
        headers: { request: ['content-type: application/json', 'accept: application/json or text/event-stream', 'if-none-match: "<content hash>" — a 304 answers with no body when the block is the one held', 'authorization: Bearer <tenant token> (the docket\'s writes only)'], response: ['etag: the content hash of the result (the clock masked)', 'x-qpu-address: the block address (uuidOf(tool + arguments))', 'x-qpu-version', 'cache-control: public, max-age=31536000, immutable on addressed replies', 'link: <https://uuidna.com/license>; rel="license"'] },
        authorization: { pure: 'every tool answers without a credential: the tools are pure functions of their arguments', docket: 'roles reader, writer, admin per tenant: the RBAC MCP host first (QPU_RBAC_MCP, QPU_RBAC_TOOL), else the tenant\'s tokens by name; a token at another tenant\'s host holds no role there', never: 'no key, token or secret travels through a tool; the client sends them, the tools name them' },
        contentAddressing: { address: 'uuidOf(tool + JSON(arguments)): the same arguments at any host give the same address', hash: 'the content hash of the result with the clock masked: the same code gives the same hash at any host', involution: 'a request naming the hash with If-None-Match is answered 304: the analog is verified digitally at the destination, nothing computed or sent', versions: 'versions coexist: an earlier version\'s addresses answer beside the new one\'s' },
        payloadApp: { principle: 'the app\'s API is built from Payload\'s config, nothing customised or bypassed: collections, a global, hooks, access and the MCP plugin', rest: [{ method: 'POST', path: '/api/entries', takes: '{ kind: call, from, body: { tool, arguments }, tenant: <tenant id> } with Authorization: users API-Key <key> of a user of that tenant (measured: the multi-tenant plugin strips the tenant from an anonymous request, so a call over REST is a user\'s; the app\'s own page calls through the local API without a user)', answers: 'the entry with result (content, structuredContent, _meta with the widget): the hook computes the tool\'s reply; the id is the content address of the call, so the same call is the same entry; every entry belongs to a tenant (the multi-tenant plugin requires it; the app\'s page resolves the tenant from the host)', auth: 'a user of the tenant (API key or session); the page alone calls anonymously through the local API' }, { method: 'GET', path: '/api/entries/<address>', takes: 'the address of a call or an entry', answers: 'the entry, cached by its tag: free', auth: 'none' }, { method: 'GET', path: '/api/entries?where[kind][equals]=call', takes: 'Payload\'s where', answers: 'the calls made: the docket\'s own query language', auth: 'none' }, { method: 'DELETE', path: '/api/entries?where[from][equals]=<device>', takes: 'Payload\'s where', answers: 'bulk delete', auth: 'admin' }, { method: 'GET', path: '/api/globals/qpu', takes: 'nothing', answers: 'the discovery document, computed by the global\'s afterRead hook', auth: 'none' }, { method: 'POST', path: '/api/mcp', takes: 'JSON-RPC: the MCP plugin', answers: 'a door per collection and verb, and the catalogue\'s tools', auth: 'the plugin\'s API key for writes' }], rewrites: { '/mcp': '/api/mcp', '/.well-known/qpu.json': '/api/globals/qpu', '/<uuid> (accept json)': '/api/entries/<uuid>' } },
        tools: list.map((t) => ({ name: t.name, toolbox: t._meta?.toolbox ?? 'none', description: t.description.slice(0, 120) })),
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
    case 'hooks': return HOOKS
    case 'gates': return gatesOf(ctx, 'https://qpu.uuidna.com')
    case 'sets': return setsOf(ctx, p.sets)
    case 'realtime': return REALTIME
    case 'scopes': return SCOPES
    case 'packages': return packagesOf()
    case 'ecommerce': return ecommerceOf(p.rates)
    case 'adapters': return { ...adaptersOf(p.env ?? []), wrangler: siteWranglerOf() }
    case 'ui': { const u = uiOf('processor'); const reg = registryOf(); return { registry: { schema: 'https://ui.shadcn.com/schema/registry.json', items: (reg['registry.json'] as { items: { name: string; type: string }[] }).items.map((i) => `${i.name} (${i.type})`), add: 'npx shadcn add https://qpu.uuidna.com/r/qpu-app.json', host: 'the React host QpuApp, the same host the site runs in Vue' }, extension: MCP_APPS.extension, mimeType: MCP_APPS.mimeType, scheme: MCP_APPS.scheme, specification: MCP_APPS.specification, tokens: UI_TOKENS.map(([token, host, fallback]) => ({ token, host, fallback })), csp: u.csp, prefersBorder: u.prefersBorder, shellBytes: u.html.length, deterministic: 'a pure function of the key and the theme: no randomness, no clock, no external domain; the same resource at every host', hosted: 'any host that negotiates io.modelcontextprotocol/ui; the site\'s playground hosts the same resource through the same protocol', rendering: 'the widget the tool computes (_meta.widget) with the tool\'s theme (_meta.theme), else the structured content' } }
    case 'fields': return FIELDS
    case 'validations': return { validations: VALIDATIONS, enforced: 'as validate functions in the generated collection and block; the same patterns the edge checks' }
    case 'access': return ACCESS
    case 'actions': return actionsOf(p.experience)
    case 'bindings': return { providers: BINDINGS.map((b) => ({ ...b, names: b.names.map((n) => (n.includes('<TENANT>') ? [...Object.values(TENANTS), 'ceci'].map((t) => n.replace('<TENANT>', t.toUpperCase())) : [n])).flat() })), minimum: 'every provider at its free tier first; what keeps it free is measured by the gate (involutions, 304s, cached blocks) and by the hooks (content addresses, tags): a paid step is a write or a first computation, never a read', scale: 'full scale is more tenants, never more code: a tenant is a host in TENANTS, its bindings its own names (values never travel)' }
    case 'fullstack': {
      // QPU's full stack from the source of payloadcms.com (MIT): the site's own collections, blocks, globals and plugins kept, the qpu block
      // added to its thirty, the plugins MCP configures here added, the database the RAID's Mongo language, storage and deploy at Cloudflare
      const ws = websiteOf(WEBSITE_FIXTURE)
      // the licence layering: the fork stays MIT (Payload's copyright kept whole); what QPU adds carries QPU's licence, named in every added file and in the notice
      const header = `// ${LICENSE.attribution}\n// Added to the MIT fork of payloadcms/website (Copyright (c) 2023 Payload); this file is QPU's: see NOTICE.qpu.md.\n`
      const qpuBlock = `${header}// The qpu block: one lexical/layout block of programmable UUID logic, the shape every tools/call result already carries in _meta.payload.
import type { Block } from 'payload'
export const Qpu: Block = {
  slug: 'qpu',
  interfaceName: 'QpuBlock',
  fields: [
    { name: 'uuid', type: 'text', required: true, admin: { description: 'the block address: a content-addressed RFC 9562 v8 UUID' } },
    { name: 'handle', type: 'text', required: true },
    { name: 'program', type: 'text', required: true, admin: { description: 'the hex program (the version and variant nibbles rotated)' } },
    { name: 'tail', type: 'text', required: true },
    { name: 'tool', type: 'text', required: true, admin: { description: 'the tool whose result this block is' } },
    { name: 'arguments', type: 'json', admin: { description: 'the arguments, so the block recomputes anywhere' } },
    { name: 'prev', type: 'text', admin: { description: 'the referer block' } },
    { name: 'next', type: 'text', admin: { description: 'the program rotated: the next step' } },
    { name: 'theorem', type: 'text', admin: { description: 'the kernel-accepted theorem that makes this block true; written by the QPU as a client of this MCP, read from the textbook' } },
  ],
}
`
      const config = `${header}// QPU's full stack on the source of payloadcms.com (github.com/payloadcms/website, MIT): the qpu block beside the site's blocks, the
// plugins MCP configures here that the site does not mount yet (its own four — form-builder, nested-docs, redirects, seo — stay as they are),
// the database the RAID (the mongo tool's language over the docket). Generated by configure { kind: 'fullstack' }; imported by src/payload.config.ts.
import { searchPlugin } from '@payloadcms/plugin-search'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { qpuEcommerce } from './payload.qpu.ecommerce'
import { Qpu } from './blocks/Qpu/config'
import { qpuMcpTools, qpuMcpResources, qpuServerInfo } from './payload.qpu.mcp'

export const qpuBlocks = [Qpu] // beside the site's ${ws.blocks} blocks; referenced as 'qpu' in every layout
export const qpuPlugins = [
  // the ecommerce plugin first: it creates products, carts, orders, transactions and addresses, which the multi-tenant plugin scopes (measured: placed after, the plugin warns of missing collections)
  qpuEcommerce, // the licence catalogue sold through Payload's own ecommerce plugin with its Stripe adapter: the API from the config
  searchPlugin({ collections: ['pages', 'posts'] }),
  // enterprise tenants from the configs: four scoped collections, a super admin by the admin role (never everyone), tenant roles on every user's tenants row, tenants readable by all
  multiTenantPlugin({ collections: { ${SCOPES.collections.map((c) => `${c}: {}`).join(', ')} }, tenantsSlug: 'tenants', userHasAccessToAllTenants: (user) => Array.isArray((user as { roles?: string[] }).roles) && (user as { roles: string[] }).roles.includes('admin'), tenantsArrayField: { includeDefaultField: true, rowFields: [{ name: 'roles', type: 'select', hasMany: true, defaultValue: ['viewer'], options: [${TENANT_ROLES.map((r) => `'${r}'`).join(', ')}] }] } } as never), // scopes: ${SCOPES.tenants.join(', ')} over ${SCOPES.collections.join(', ')}; roles ${TENANT_ROLES.join(', ')}
  // only Payload: the handler's tools served by the MCP plugin (the server named qpu), the Worker's /mcp replaced
  mcpPlugin({ collections: ${JSON.stringify(MCP_COLLECTIONS)}, mcp: { tools: qpuMcpTools, resources: qpuMcpResources, serverOptions: { serverInfo: qpuServerInfo } } } as never), // the tools and the ui:// resources of every tool (MCP Apps) through the plugin; an API key per user authorises a client
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
import { handle } from '@uuidna/qpu/mcp'
import { VERSION } from '@uuidna/qpu/version'

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
export const qpuMcpTools = list.map((t) => ({
  name: t.name,
  description: t.description,
  parameters: Object.fromEntries(Object.entries(t.inputSchema.properties ?? {}).map(([k, p]) => [k, (t.inputSchema.required ?? []).includes(k) ? zodOf(p).describe(p.description ?? '') : zodOf(p).optional().describe(p.description ?? '')])) as z.ZodRawShape,
  handler: async (args: Record<string, unknown>) => {
    const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: t.name, arguments: args } }) as { result?: { structuredContent: unknown }; error?: { message: string } }
    return { content: [{ type: 'text' as const, text: JSON.stringify(r.error ? { error: r.error.message } : r.result!.structuredContent) }] }
  },
}))
// the UI resources (MCP Apps): one ui://qpu/<tool> per tool, read from the handler's resources/read, served through the plugin's resources
const resources = (handle({ jsonrpc: '2.0', id: 1, method: 'resources/list' }) as { result: { resources: { uri: string; name: string; description: string; mimeType: string }[] } }).result.resources
export const qpuMcpResources = resources.map((r) => ({
  name: r.uri.replace('ui://qpu/', 'ui-'),
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
import type { CollectionConfig } from 'payload'
import { uuidOf } from '@uuidna/qpu/blocks'
import { handle } from '@uuidna/qpu/mcp'

type TenantUser = { roles?: string[]; tenants?: { tenant?: { id?: string } | string; roles?: string[] }[] } | null | undefined
const isSuperAdmin = (user: unknown): boolean => ((user as TenantUser)?.roles ?? []).includes('admin')
const tenantIdOf = (t: unknown): string | null => (typeof t === 'string' ? t : (t as { id?: string } | undefined)?.id ?? null)
const tenantsWithRole = (user: unknown, roles: readonly string[]): string[] => ((user as TenantUser)?.tenants ?? []).filter((row) => (row.roles ?? []).some((r) => roles.includes(r))).map((row) => tenantIdOf(row.tenant)).filter((id): id is string => !!id)
const memberOf = (user: unknown, tenant: string | null, roles: readonly string[]): boolean => !!tenant && tenantsWithRole(user, roles).includes(tenant)
export const Entries: CollectionConfig = {
  slug: 'entries',
  admin: { useAsTitle: 'id', defaultColumns: ['id', 'kind', 'from', 'createdAt'] },
  // access by tenant roles and the Worker's roles: a reader reads; a call is created by anyone; an entry of other kinds by a super admin, a tenant-admin or editor of its tenant, or the writer token; no one updates (an entry is its content address); a super admin, a tenant-admin of its tenant or the admin token deletes
  access: {
    read: () => true,
    create: ({ req, data }) => data?.kind === 'call' || isSuperAdmin(req.user) || memberOf(req.user, tenantIdOf(data?.tenant), ['tenant-admin', 'editor']) || req.headers.get('x-qpu-role') === 'writer' || req.headers.get('x-qpu-role') === 'admin',
    update: () => false,
    delete: ({ req }) => isSuperAdmin(req.user) || req.headers.get('x-qpu-role') === 'admin' || { tenant: { in: tenantsWithRole(req.user, ['tenant-admin']) } },
  },
  fields: [
    { name: 'id', type: 'text', required: true, validate: (v: unknown) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(String(v)) || 'a UUID of 36 characters', admin: { readOnly: true, description: 'the content address: computed from kind, from and body' } },
    { name: 'kind', type: 'text', required: true, index: true, validate: (v: unknown) => /^[a-z][a-z-]*$/.test(String(v)) || 'lower-case letters and dashes' },
    { name: 'from', type: 'text', required: true, index: true },
    { name: 'body', type: 'json' },
    { name: 'sha256', type: 'text', validate: (v: unknown) => v == null || /^[0-9a-f]{64}$/.test(String(v)) || '64 hex digits', admin: { readOnly: true } },
    { name: 'result', type: 'json', admin: { readOnly: true, description: 'kind call: the reply of the tool, computed by the hook from body { tool, arguments }; the API of every tool is this collection' } },
    { name: 'links', type: 'array', fields: [{ name: 'entry', type: 'text' }] },
  ],
  hooks: {
    beforeValidate: [async ({ data, operation }) => {
      if (operation !== 'create' || !data) return data
      const text = JSON.stringify({ kind: data.kind, from: data.from, body: data.body ?? null })
      const bytes = new TextEncoder().encode(text)
      const digest = await crypto.subtle.digest('SHA-256', bytes)
      // the API built from the config: an entry of kind call carries a tool and its arguments, and the hook answers it from the handler; the address folds the call, not the reply, so the same call is the same entry (read free, computed once)
      const body = data.body as { tool?: string; arguments?: Record<string, unknown> } | undefined
      // the reply's result stands as the entry's result (content, structuredContent, _meta with the widget); a refusal stands as { error }
      const reply = data.kind === 'call' && body?.tool ? (handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: body.tool, arguments: body.arguments ?? {} } }) as { result?: unknown; error?: { message: string } }) : undefined
      const result = reply ? (reply.result ?? { error: reply.error }) : undefined
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

export const QpuGlobal: GlobalConfig = {
  slug: 'qpu',
  access: { read: () => true },
  fields: [
    { name: 'origin', type: 'text', defaultValue: 'https://qpu.uuidna.com', admin: { description: 'the origin the discovery document names' } },
    { name: 'document', type: 'json', admin: { readOnly: true, description: 'the discovery document: computed on every read, never stored' } },
  ],
  // per tenant: the document names the origin of the host that asked (a tenant's domain), else the origin the global holds; a local host keeps the global's
  hooks: { afterRead: [({ doc, req }) => { const host = req?.headers?.get?.('host') ?? ''; const origin = host && !/^(localhost|127\\.0\\.0\\.1)(:|$)/.test(host) ? 'https://' + host.split(':')[0] : String(doc?.origin ?? 'https://qpu.uuidna.com'); return { ...doc, origin, document: discoveryOf(origin, process.env as Record<string, unknown>) } }] },
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
    { name: 'slug', type: 'text', required: true, unique: true, validate: (v: unknown) => /^[a-z][a-z0-9-]*$/.test(String(v)) || 'lower-case letters, digits and dashes' },
    { name: 'domains', type: 'array', required: true, fields: [{ name: 'domain', type: 'text', required: true }], admin: { description: 'the hosts that name the tenant; the Worker maps each to the docket' } },
    { name: 'currency', type: 'select', defaultValue: 'EUR', options: ${JSON.stringify(QPU_CURRENCIES.map((c) => c.code))}, admin: { description: 'the currency the tenant prices in' } },
    { name: 'settings', type: 'json', admin: { description: 'the plugin options this tenant configures: { arguments: {...} } is merged into every qpu block call under its hosts; read by the page and by MCP clients through the Payload MCP plugin' } },
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
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { resendAdapter } from '@payloadcms/email-resend'
import { r2Storage } from '@payloadcms/storage-r2'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import nodemailerSendgrid from 'nodemailer-sendgrid'
import type { Plugin } from 'payload'

type Bindings = { D1?: unknown; R2?: unknown; KV?: unknown; DOCKET?: unknown; AI?: unknown }
export const qpuBindings = (): Bindings => ((globalThis as { __qpuBindings?: Bindings }).__qpuBindings ?? {})
export const qpuProfile = (): 'cloudflare' | 'vercel' | 'local' => (qpuBindings().D1 || process.env.QPU_ADAPTERS === 'cloudflare' ? 'cloudflare' : process.env.BLOB_READ_WRITE_TOKEN ? 'vercel' : 'local')
export const qpuDb = () => { const b = qpuBindings(); return b.D1 ? sqliteD1Adapter({ binding: b.D1 as never }) : mongooseAdapter({ url: process.env.DATABASE_URI || '' }) }
export const qpuEmail = () => (process.env.RESEND_API_KEY ? resendAdapter({ apiKey: process.env.RESEND_API_KEY, defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'no-reply@localhost.test', defaultFromName: process.env.EMAIL_FROM_NAME || 'QPU' }) : nodemailerAdapter({ defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'no-reply@localhost.test', defaultFromName: process.env.EMAIL_FROM_NAME || 'QPU', ...(process.env.SENDGRID_API_KEY ? { transportOptions: nodemailerSendgrid({ apiKey: process.env.SENDGRID_API_KEY }) } : {}) }))
export const qpuStoragePlugins = (): Plugin[] => { const b = qpuBindings(); return b.R2 ? [r2Storage({ bucket: b.R2 as never, collections: { media: true } })] : [vercelBlobStorage({ cacheControlMaxAge: 60 * 60 * 24 * 365, collections: { media: { generateFileURL: ({ filename }) => \`https://\${process.env.BLOB_STORE_ID}/\${filename}\` } }, enabled: Boolean(process.env.BLOB_STORAGE_ENABLED) || false, token: process.env.BLOB_READ_WRITE_TOKEN || '' })] }
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
import { handle } from '@uuidna/qpu/mcp'
import { QpuApp } from './App'

export type QpuBlockProps = { uuid: string; handle: string; program: string; tail: string; tool: string; arguments?: Record<string, unknown> | null; prev?: string | null; next?: string | null; theorem?: string | null }

export const QpuBlock: React.FC<QpuBlockProps> = ({ uuid, tool, arguments: args, next, theorem }) => {
  const reply = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: tool, arguments: args ?? {} } }) as { result?: unknown; error?: { message: string } }
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
import { uuidOf } from '@uuidna/qpu/blocks'
import { handle } from '@uuidna/qpu/mcp'
import { QpuApp } from './App'

type Call = { id: string; result?: { structuredContent?: Record<string, unknown>; _meta?: { widget?: string; theme?: Record<string, string> }; error?: { message: string } } }
// the tenant of the request: the host that names it (the tenants' domains, as the Worker's TENANTS), else the first tenant (a local run)
const tenantOf = async (payload: Awaited<ReturnType<typeof getPayload>>): Promise<{ id: string; slug: string; settings?: { arguments?: Record<string, unknown> } }> => {
  // next/headers is loaded when the module runs (never imported statically): the block renderer is reached by the Pages Router too, where that API does not exist (measured at build)
  let host = ''
  try { const { headers } = await import('next/headers'); host = (await headers()).get('host')?.split(':')[0] ?? '' } catch { /* no request: the first tenant */ }
  const byDomain = await payload.find({ collection: 'tenants' as never, where: { 'domains.domain': { equals: host } }, limit: 1, overrideAccess: true })
  const t = (byDomain.docs[0] ?? (await payload.find({ collection: 'tenants' as never, limit: 1, sort: 'slug', overrideAccess: true })).docs[0]) as { id: string; slug: string; settings?: { arguments?: Record<string, unknown> } } | undefined
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
  const id = uuidOf(JSON.stringify({ kind: 'call', from, body }))
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
import { handle } from '@uuidna/qpu/mcp'

const main = async () => {
  const payload = await getPayload({ config })
  const site = (handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'payload', arguments: { site: true } } }) as { result: { structuredContent: { collection: { docs: { id: string; title: string; slug: string; layout: Record<string, unknown>[]; meta: { title: string; description: string }; parent?: string | null; hero?: Record<string, unknown> }[] } } } }).result.structuredContent.collection.docs
  // the tenants from the configs first, read from the handler at run time (nothing seeded is written into this file): one per host, by slug; the super
  // admin seeds, so no user is passed; every scoped document below belongs to the first tenant
  const tenants = (handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'configure', arguments: { kind: 'tenant' } } }) as { result: { structuredContent: { config: { records: Record<string, { name: string; slug: string; domains: { domain: string }[]; currency: string }> } } } }).result.structuredContent.config.records
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
    const email = process.env.FIRST_USER_EMAIL ?? process.env.CLOUDFLARE_EMAIL ?? (() => { try { return /associated with the email ([^\\s]+@[^\\s]+?)[.,;]?(?:\\s|$)/.exec(execSync('npx wrangler whoami', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).replace(/\\u001b\\[[0-9;]*m/g, ''))?.[1] ?? null } catch { return null } })()
    if (email) { await payload.create({ collection: 'users', overrideAccess: true, context: { disableRevalidate: true }, data: { email, password: randomUUID() + randomUUID(), firstName: 'Super', lastName: 'Admin', roles: ['admin'], enableAPIKey: false, tenants: [{ tenant: tenant.id, roles: ['tenant-admin'] }] } as never }); firstUser = 'created from the account email (its password unknown: reset it through the admin panel)' }
    else firstUser = 'no account email known (FIRST_USER_EMAIL, CLOUDFLARE_EMAIL, wrangler whoami): the create-first-user form of the admin panel stands'
  } else firstUser = 'a user exists already'
  let created = 0, kept = 0, updated = 0
  for (const d of site) {
    const slug = d.slug.replace(/^\\//, '')
    const found = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, overrideAccess: true, draft: true })
    // nested: the parent is the page of the parent slug, created before its children (the documents come parents first); the plugin computes the breadcrumbs
    const parent = d.parent ? ((await payload.find({ collection: 'pages', where: { slug: { equals: d.parent.replace(/^\\//, '') } }, limit: 1, overrideAccess: true, draft: true })).docs[0] as { id: string } | undefined)?.id ?? null : null
    // the layout compared as Payload stores it: block ids, nulls and empty objects are not content, so a page is relaid only when its blocks changed
    const canon = (layout: unknown) => JSON.stringify(layout, (k, v) => (k === 'id' || v === null || (v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0) ? undefined : v && typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries(Object.keys(v as object).sort().map((key) => [key, (v as Record<string, unknown>)[key]])) : v))
    if (found.totalDocs) { const page = found.docs[0] as { id: string; _status?: string; layout?: unknown[]; parent?: string | { id: string } | null }; const stale = canon(page.layout ?? []) !== canon(d.layout) || ((typeof page.parent === 'object' && page.parent ? page.parent.id : page.parent) ?? null) !== parent || (d.hero ? canon((page as { hero?: { richText?: unknown } }).hero?.richText ?? null) !== canon(d.hero.richText ?? null) : false); if (page._status !== 'published' || stale) await payload.update({ collection: 'pages', id: page.id, overrideAccess: true, context: { disableRevalidate: true }, data: { _status: 'published', ...(stale ? { layout: d.layout, parent, ...(d.hero ? { hero: d.hero } : {}) } : {}) } as never }); kept += 1; if (stale) updated += 1; continue }
    // published: the site is what the QPU computes, public at once; a draft would answer no reader
    await payload.create({ collection: 'pages', overrideAccess: true, context: { disableRevalidate: true }, data: { title: d.title, slug, hero: d.hero ?? { type: 'default' }, layout: d.layout, meta: d.meta, tenant: tenant.id, parent, _status: 'published' } as never })
    created += 1
  }
  // the licence catalogue as products of the ecommerce plugin, read from the handler at run time: one per variant, by title, prices in the minor unit per
  // currency — harmonised when the environment carries the rates the currency step measured (QPU_RATES, the JSON the currency tool answers), else the catalogue's own
  const catalogue = (handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'configure', arguments: { kind: 'ecommerce', ...(process.env.QPU_RATES ? { rates: JSON.parse(process.env.QPU_RATES) } : {}) } } }) as { result: { structuredContent: { config: { catalogue: { items: { title: string; licence: Record<string, string>; prices: Record<string, number> }[] } } } } }).result.structuredContent.config.catalogue.items
  let products = 0
  for (const item of catalogue) {
    const found = await payload.find({ collection: 'products' as never, where: { title: { equals: item.title } }, limit: 1, overrideAccess: true })
    if (found.totalDocs) continue
    await payload.create({ collection: 'products' as never, overrideAccess: true, context: { disableRevalidate: true }, data: { title: item.title, licence: item.licence, tenant: tenant.id, ...Object.fromEntries(Object.entries(item.prices).flatMap(([k, v]) => [[k, v], [k + 'Enabled', true]])), _status: 'published' } as never })
    products += 1
  }
  // the "Request an app" form of the form-builder plugin, from the handler: a submission generates the app (appRequest, form-submissions afterChange)
  const form = (handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'payload', arguments: { app: { form: true } } } }) as { result: { structuredContent: { form: Record<string, unknown> & { title: string } } } }).result.structuredContent.form
  let formState = 'kept'
  if (!(await payload.find({ collection: 'forms', where: { title: { equals: form.title } }, limit: 1, overrideAccess: true })).totalDocs) { await payload.create({ collection: 'forms', overrideAccess: true, context: { disableRevalidate: true }, data: form as never }); formState = 'created' }
  console.log(\`seed: \${created} page(s) created, \${kept} kept (\${updated} relaid), from \${site.length} documents; \${tenantsCreated} tenant(s) created of \${Object.keys(tenants).length}; \${products} product(s) created of \${catalogue.length}; the request form \${formState}; first user: \${firstUser}\`)
}
// awaited at the top level: payload run returns when the module has loaded, so a pending promise would be left behind (measured: the seed printed nothing and wrote nothing)
await main()
process.exit(0)
`
      const readme = `# QPU full stack

The source of payloadcms.com (MIT) is the full stack, forked under site/: its ${ws.collections} collections, ${ws.blocks} blocks, ${ws.globals} globals and ${ws.fields} fields kept. Applied: \`src/blocks/Qpu/config.ts\` (the qpu block, the shape every tools/call result carries in _meta.payload), registered in payload.config blocks and the pages layout; \`src/components/blocks/Qpu/index.tsx\` (the renderer: the page asks the Worker for the block and carries its widget), mapped in RenderBlocks; \`src/payload.qpu.config.ts\` (search and multi-tenant beside the site's four plugins, the database the RAID); \`src/collections/Tenants.ts\` (the multi-tenant plugin's own collection: the hosts that name the tenants). The catch-all makes prefixes useless: a UUID is one address — the entry\'s JSON when the client accepts application/json (the entries collection\'s own door), the block\'s page otherwise; the list is /api/entries; /mcp is the MCP plugin\'s /api/mcp and /.well-known/qpu.json the endpoint /api/qpu; no Worker behind any of them. Deploy at Cloudflare beside this Worker; every step at whole uptime: configure { kind: 'migration' }.
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
import { uuidOf } from '@uuidna/qpu/blocks'

export const editAddressOf = (doc: Record<string, unknown>): string => uuidOf(JSON.stringify({ title: doc.title, hero: doc.hero, layout: doc.layout, meta: doc.meta }, (k, v) => (k === 'id' ? undefined : v)))
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
import { handle } from '@uuidna/qpu/mcp'

export const APP_REQUEST_FORM_TITLE = 'Request an app'
export const appRequest: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc
  const form = (typeof doc.form === 'object' && doc.form ? doc.form : await req.payload.findByID({ collection: 'forms', id: doc.form, overrideAccess: true }).catch(() => null)) as { title?: string } | null
  if (!form || form.title !== APP_REQUEST_FORM_TITLE) return doc
  const data = Object.fromEntries(((doc.submissionData ?? []) as { field: string; value: string }[]).map((f) => [f.field, f.value]))
  const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'payload', arguments: { app: { name: data.name, host: data.host, env: String(data.env ?? '').split(/[,\\s]+/).filter(Boolean), variant: data.variant || 'yearly' } } } }) as { result?: { structuredContent: { bundle: string; price: { currency: string; amount: number }; order: { product: string } } }; error?: { message: string } }
  if (!r.result) { req.payload.logger.warn('app request refused: ' + (r.error?.message ?? 'no result')); return doc }
  const app = r.result.structuredContent
  const text = JSON.stringify(app, null, 1)
  const product = (await req.payload.find({ collection: 'products' as never, where: { title: { equals: app.order.product } }, limit: 1, overrideAccess: true })).docs[0] as { id: string } | undefined
  await req.payload.create({ collection: 'media', overrideAccess: true, context: { disableRevalidate: true }, data: { alt: 'app ' + String(data.host) + ': bundle ' + app.bundle + ', ' + (app.price.amount / 100).toFixed(2) + ' ' + app.price.currency + (product ? ', product ' + product.id : '') } as never, file: { data: Buffer.from(text), mimetype: 'application/json', name: String(data.host).replace(/[^a-z0-9.-]/gi, '-') + '.app.json', size: Buffer.byteLength(text) } })
  return doc
}
`
      const pluginModule = `${header}// The QPU as one Payload plugin with multidimensional capabilities: it fits any Payload config without hacking it — its own collections
// (the tenants the multi-tenant plugin requires, the docket entries), its global (the discovery document per host), its block (the programmable
// UUID logic, added to the config's blocks and to the pages' layout), its hooks on the installed plugins' default collections (pages: the
// collision guard, the lock, the autosave, the edit base; users: the first-user bootstrap and the API key; form-submissions: the app request),
// and the plugins it composes (ecommerce, search, multi-tenant, MCP). plugins: [qpuPlugin()] is the whole mount. Generated by configure { kind: 'fullstack' }.
import type { Block, CollectionConfig, Config, Field, Plugin } from 'payload'
import { Qpu } from '../blocks/Qpu/config'
import { Entries } from '../collections/Entries'
import { Tenants } from '../collections/Tenants'
import { QpuGlobal } from '../globals/Qpu'
import { qpuPlugins } from '../payload.qpu.config'
import { collisionGuard } from '../collections/pages.qpu.hooks'
import { firstUserBootstrap } from '../collections/users.qpu.hooks'
import { appRequest } from '../collections/form-submissions.qpu.hooks'

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
const has = (hooks: readonly unknown[] | undefined, fn: unknown): boolean => (hooks ?? []).includes(fn)
const pages = (c: CollectionConfig): CollectionConfig => ({
  ...c,
  fields: [...withBlock(c.fields, Qpu), ...(c.fields.some((f) => 'name' in f && f.name === 'editBase') ? [] : [{ name: 'editBase', type: 'text', virtual: true, admin: { hidden: true } } as Field])],
  lockDocuments: c.lockDocuments ?? { duration: 300 },
  versions: { ...(typeof c.versions === 'object' ? c.versions : {}), drafts: { ...(typeof c.versions === 'object' && typeof c.versions.drafts === 'object' ? c.versions.drafts : {}), autosave: { interval: 800 } } },
  hooks: { ...c.hooks, beforeChange: has(c.hooks?.beforeChange, collisionGuard) ? c.hooks?.beforeChange : [collisionGuard, ...(c.hooks?.beforeChange ?? [])] },
})
const users = (c: CollectionConfig): CollectionConfig => ({ ...c, auth: { ...(typeof c.auth === 'object' ? c.auth : {}), useAPIKey: true }, hooks: { ...c.hooks, beforeChange: has(c.hooks?.beforeChange, firstUserBootstrap) ? c.hooks?.beforeChange : [firstUserBootstrap, ...(c.hooks?.beforeChange ?? [])] } })
const submissions = (c: CollectionConfig): CollectionConfig => ({ ...c, hooks: { ...c.hooks, afterChange: has(c.hooks?.afterChange, appRequest) ? c.hooks?.afterChange : [appRequest, ...(c.hooks?.afterChange ?? [])] } })
export const qpuPlugin = (): Plugin => async (incoming: Config): Promise<Config> => {
  let config: Config = {
    ...incoming,
    collections: [...(incoming.collections ?? []).filter((c) => c.slug !== Tenants.slug && c.slug !== Entries.slug), Tenants, Entries],
    globals: [...(incoming.globals ?? []).filter((g) => g.slug !== QpuGlobal.slug), QpuGlobal],
    blocks: [...(incoming.blocks ?? []).filter((b) => b.slug !== Qpu.slug), Qpu],
  }
  for (const plugin of qpuPlugins) config = await plugin(config) // ecommerce first, then search, multi-tenant and MCP, as the configs order them
  return { ...config, collections: (config.collections ?? []).map((c) => (c.slug === 'pages' ? pages(c) : c.slug === 'users' ? users(c) : c.slug === 'form-submissions' ? submissions(c) : c)) }
}
`
      const generated: { role: FileRole; key: string; text: string }[] = [{ role: 'block', key: 'qpu', text: qpuBlock }, { role: 'config', key: 'config', text: config }, { role: 'notice', key: 'readme', text: readme }, { role: 'notice', key: 'notice', text: notice }, { role: 'config', key: 'mcp', text: mcpTools }, { role: 'collection', key: 'entries', text: entries }, { role: 'global', key: 'qpu', text: qpuGlobal }, { role: 'config', key: 'ecommerce', text: ecommerce }, { role: 'collection', key: 'tenants', text: tenants }, { role: 'hooks', key: 'form-submissions', text: submissionHooks }, { role: 'hooks', key: 'users', text: usersHooks }, { role: 'hooks', key: 'pages', text: pagesHooks }, { role: 'config', key: 'adapters', text: adaptersModule }, { role: 'component', key: 'App', text: `${header}${reactHost}` }, { role: 'component', key: 'index', text: blockView }, { role: 'component', key: 'page', text: uuidPage }, { role: 'script', key: 'seed-qpu', text: seed }, { role: 'plugin', key: 'qpu', text: pluginModule }]
      return { repository: PAYLOAD_WEBSITE.repository, licence: PAYLOAD_WEBSITE.licence, qpuLicence: LICENSE.spdx, keep: { collections: ws.collectionList, blocks: ws.blockList, globals: ws.globalList, fields: ws.fieldList, plugins: [...PAYLOAD_WEBSITE.plugins] }, add: { block: 'qpu', plugins: ['search', 'multi-tenant', 'mcp'], database: 'db-mongodb over the RAID docket (the mongo tool\'s language)', storage: 'Cloudflare R2 through the bindings MCP (the tenant\'s token)', deploy: 'Cloudflare Workers beside this Worker (run_worker_first keeps /mcp, /docket, /.well-known)', tenants: Object.values(TENANTS) }, organisation: FILE_ROLES, byRole: Object.fromEntries((Object.keys(FILE_ROLES) as FileRole[]).map((r) => [r, generated.filter((g) => g.role === r).map((g) => fileOf(g.role, g.key))])), partition: `${(Object.keys(FILE_ROLES) as FileRole[]).map((r) => generated.filter((g) => g.role === r).length).join(' + ')} = ${generated.length}`, files: Object.fromEntries(generated.map((g) => [fileOf(g.role, g.key), g.text])), steps: ['fork payloadcms/website (MIT) under site/ — done', 'register the qpu block (payload.config blocks, the pages layout, the RenderBlocks map under the @blocks alias), the tenants collection, spread qpuPlugins — done; the fork typechecks', 'rewrite any UUID path and /mcp, /docket, /.well-known to the Worker before the catch-all — done', 'point DATABASE_URI and PAYLOAD_SECRET at the tenant\'s (the build needs them beyond the tree)', 'deploy at Cloudflare beside this Worker; the gate decodes old and new as copies; the old site is removed only then'], note: 'generated text: a fork applies it; nothing here runs Payload' }
    }
    case 'mcp': { const r = ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'extend', arguments: { direction: 'out' } } }) as { result: { structuredContent: { outward: { mcpServers: unknown; tools: unknown[] } } } }; const held = [...PLUGIN_DEFAULT_COLLECTIONS, 'entries']; const beyond = differencesOf({ name: 'the stack\'s collections', members: held }, { name: 'the installed plugins\' defaults', members: PLUGIN_DEFAULT_COLLECTIONS }, { config: 'payload' }); const unserved = differencesOf({ name: 'the stack\'s collections', members: held }, { name: 'payload-mcp', members: Object.keys(MCP_COLLECTIONS) }, { config: 'mcp' }); return { mcpServers: r.result.structuredContent.outward.mcpServers, tools: r.result.structuredContent.outward.tools.length, hosts: DEFAULT_MCP_HOSTS, payloadMcp: { mandatory: 'every capability is reached through the Payload MCP plugin: the QPU\'s tools and ui:// resources as its tools and resources, the installed plugins\' default collections as its collection tools; nothing added to the schema', collections: MCP_COLLECTIONS, served: Object.keys(MCP_COLLECTIONS).length, defaults: PLUGIN_DEFAULT_COLLECTIONS.length, refactoring: [...beyond.leads, ...unserved.leads], says: `${beyond.leads.length} collection(s) beyond the plugins\' defaults and ${unserved.leads.length} not served by the plugin: refactoring leads` } } }
  }
}
/** The drift between a configuration as MCP computes it and the text a client holds (a file): every path whose value differs. */
export const driftOf = (computed: unknown, current: unknown, path = ''): string[] => {
  if (JSON.stringify(computed) === JSON.stringify(current)) return []
  if (computed && current && typeof computed === 'object' && typeof current === 'object' && !Array.isArray(computed) && !Array.isArray(current)) {
    const keys = new Set([...Object.keys(computed), ...Object.keys(current)])
    return [...keys].flatMap((k) => driftOf((computed as Record<string, unknown>)[k], (current as Record<string, unknown>)[k], path ? `${path}.${k}` : k))
  }
  return [path || '(root)']
}
const stripJsonc = (text: string) => text.replace(/^\s*\/\/.*$/gm, '').replace(/,(\s*[}\]])/g, '$1')

const configure = toolOf('payload', {
  name: 'configure',
  description: 'MCP configures Payload and the rest: Payload\'s default plugins (lexical with the one qpu block, nested-docs, seo, search, redirects, form-builder, multi-tenant, mcp, ecommerce) in all their combinations with no custom collection; the Worker\'s wrangler configuration from the tenants; each tenant\'s variable names (never values); the PWA manifest; the MCP registration. Every configuration carries its torus: address, seed, reflection and trinity, and whether the loop closes (config → text → config at the same address). With current (the text a client holds), the drift: every path that differs, each a lead; for a hand-held TypeScript file (payload, hooks, bindings), what MCP configures and the text lacks. With files: every configuration\'s file and its source, what next writes and what it measures on every run. Kinds hooks and bindings: the Payload hooks and the providers\' bindings for full-scale use at minimum cost. Without kind: all of them, tested.',
  inputSchema: { type: 'object', properties: { kind: { type: 'string', enum: [...configKinds], description: 'omit for all' }, files: { type: 'boolean', description: 'the file of every configuration and its source (tool or hand): what next writes and what it measures' }, experience: { type: 'object', description: 'kind actions: what the gate measured ({ copies, involutions, msByHost }): the shard size follows it' }, rates: { type: 'object', description: 'kind ecommerce: the harmonised rates the currency tool answered (currency → { rate }): every price derived from the euro amount' }, lastTag: { type: 'object', description: '{ version, tools }: the last tag and the tools it served, from the repository tool; with it, kind versions computes the next number' }, current: { type: 'string', description: 'the configuration text the client holds (JSON or JSONC): compared, the drift answered' }, version: { type: 'string' }, description: { type: 'string' }, env: { type: 'array', items: { type: 'string' }, description: 'the variable NAMES the client\'s environment holds: which of a tenant\'s are missing (values never travel)' }, sets: { type: 'array', items: { type: 'string' }, description: 'kind sets: two set names (a toolbox, mcp, tools, ui, backed, configs, mount:<tenant>) whose union, intersection and differences are answered' }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (args.selftest) return { selftest: true, ...PAYLOAD.skill.selftest(ctx) }
    const p = { version: typeof args.version === 'string' ? args.version : undefined, description: typeof args.description === 'string' ? args.description : undefined, lastTag: args.lastTag && typeof args.lastTag === 'object' ? args.lastTag as { version: string; tools: string[] } : undefined, experience: args.experience && typeof args.experience === 'object' ? args.experience as { copies?: number; involutions?: number; msByHost?: Record<string, number> } : undefined, rates: args.rates && typeof args.rates === 'object' ? args.rates as Record<string, { rate: number }> : undefined, env: Array.isArray(args.env) ? args.env.map(String) : undefined, sets: Array.isArray(args.sets) ? args.sets.map(String) : undefined }
    if (args.files) { const tool = CONFIG_FILES.filter((f) => f.source === 'tool').length; const hand = CONFIG_FILES.length - tool; return { files: CONFIG_FILES, kinds: configKinds.length, tool, hand, unfiled: configKinds.length - CONFIG_FILES.length, partition: `${tool} + ${hand} + ${configKinds.length - CONFIG_FILES.length} = ${configKinds.length}`, says: 'a tool-sourced file is written on every run (drift zero by construction); a hand-held file is measured on every run (drift a lead); the rest are answered, not filed' } }
    if (typeof args.kind === 'string') {
      if (!configKinds.includes(args.kind as ConfigKind)) throw new Error(`no configuration ${args.kind}; the kinds are ${configKinds.join(', ')}`)
      const kind = args.kind as ConfigKind
      const config = configOf(kind, ctx, p)
      const out: Record<string, unknown> = { kind, config, torus: torusOf(config) }
      if (typeof args.current === 'string' && (kind === 'payload' || kind === 'hooks' || kind === 'bindings' || kind === 'api')) { const drift = heldDriftOf(kind, args.current); out.drift = drift; out.driftCount = drift.length; out.leads = differencesOf({ name: 'mcp', members: drift }, { name: 'the file the hand holds', members: [] }, { config: kind }).leads; if (kind === 'bindings') out.env = envExampleOf() }
      else if (typeof args.current === 'string') { let cur: unknown; try { cur = JSON.parse(stripJsonc(args.current)) } catch (e) { cur = { unparsable: (e as Error).message } }; const drift = driftOf(config, cur); out.drift = drift; out.driftCount = drift.length; out.leads = differencesOf({ name: 'mcp', members: drift }, { name: 'the text the client holds', members: [] }, { config: kind }).leads }
      if (kind === 'tenant' && Array.isArray(args.env)) { const have = new Set(args.env.map(String)); out.missing = (config as { tenants: { tenant: string; secrets: string[]; vars: string[] }[] }).tenants.map((t) => ({ tenant: t.tenant, secrets: t.secrets.filter((s) => !have.has(s)), vars: t.vars.filter((v) => !have.has(v)) })) }
      return out
    }
    const all = configKinds.map((kind) => { const config = configOf(kind, ctx, p); return { kind, torus: torusOf(config), config } })
    return { kinds: all.length, tested: all.filter((a) => a.torus.closed).length, closed: all.every((a) => a.torus.closed), doubleTorus: { inward: 'config → text → config at the same address, every kind', outward: 'this catalogue → registration → doors → catalogue (extend identity)' }, byTrinity: Object.fromEntries([[3, 6, 9], [7, 4, 1], [2, 5, 8]].map((t) => [t.join(''), all.filter((a) => a.torus.trinity.join('') === t.join('')).map((a) => a.kind)])), configs: all }
  },
  widget: flowWidget,
})

/** The tree read at github.com/payloadcms/skills on 2026-10-25 (main): the paths and sizes, as facts. */
const SKILLS_FIXTURE = { sha: 'main', truncated: false, tree: [
  { path: 'README.md', type: 'blob', size: 2285 }, { path: 'AGENTS.md', type: 'blob', size: 3390 },
  { path: 'skills/cms-migration/SKILL.md', type: 'blob', size: 5374 }, { path: 'skills/cms-migration/reference/PAYLOAD-FIELD-REFERENCE.md', type: 'blob', size: 31127 },
  { path: 'skills/payload/SKILL.md', type: 'blob', size: 23062 }, { path: 'skills/payload/README.md', type: 'blob', size: 2537 },
  ...['ACCESS-CONTROL-ADVANCED', 'ACCESS-CONTROL', 'ADAPTERS', 'ADVANCED', 'COLLECTIONS', 'ENDPOINTS', 'FIELD-TYPE-GUARDS', 'FIELDS', 'HOOKS', 'PLUGIN-DEVELOPMENT', 'QUERIES'].map((r) => ({ path: `skills/payload/reference/${r}.md`, type: 'blob', size: 1000 })),
] }
/** The tree read at github.com/payloadcms/website on 2026-10-25 (main, 1,949 entries): the names under src, as facts. */
const WEBSITE_FIXTURE = { sha: 'main', truncated: false, tree: [
  ...['CaseStudies.ts', 'Categories.ts', 'CommunityHelp', 'Docs', 'DocsFeedback', 'Media.ts', 'Pages.ts', 'PartnerFilters.ts', 'Partners.ts', 'Posts.ts', 'ReusableContent.ts', 'Users.ts'].map((c) => ({ path: `src/collections/${c}${c.endsWith('.ts') ? '' : '/index.ts'}`, type: 'blob' })),
  ...['Banner', 'BlogContent', 'BlogMarkdown', 'CallToAction', 'Callout', 'CardGrid', 'CaseStudiesHighlight', 'CaseStudyCards', 'CaseStudyParallax', 'Code', 'CodeFeature', 'ComparisonTable', 'Content', 'ContentGrid', 'Download', 'ExampleTabs', 'Form', 'HoverCards', 'HoverHighlights', 'LinkGrid', 'LogoGrid', 'Media', 'MediaContent', 'MediaContentAccordion', 'Pricing', 'ReusableContent', 'Slider', 'Statement', 'Steps', 'StickyHighlights'].map((b) => ({ path: `src/blocks/${b}/index.tsx`, type: 'blob' })),
  ...['CustomRowLabelNavItems.tsx', 'CustomRowLabelTabs.tsx', 'Footer.ts', 'GetStarted.ts', 'MainMenu.ts', 'PartnerProgram.ts', 'TopBar.ts'].map((g) => ({ path: `src/globals/${g}`, type: 'blob' })),
  ...['addToDocs', 'blockFields.ts', 'codeBlips.ts', 'fullTitle', 'hero.ts', 'link.ts', 'linkGroup.ts', 'livestreamFields.ts', 'richText', 'slug.ts'].map((f) => ({ path: `src/fields/${f}${f.endsWith('.ts') ? '' : '/index.ts'}`, type: 'blob' })),
  { path: 'src/plugins/opsCounter.ts', type: 'blob' }, { path: 'src/payload.config.ts', type: 'blob' },
] }
export const PAYLOAD: Toolbox = {
  name: 'payload',
  idea: 'Payload\'s plugin schema as the one shape of every result: nested docs of lexical documents whose blocks are programmable UUID logic, SEO from the block, no custom collection, a few kilobytes computed once',
  tools: [payload, configure],
  examples: [
    { id: 'configure-versions', tool: 'configure', arguments: { kind: 'versions', lastTag: { version: 'v1.4.0', tools: ['processor', 'circuit', 'clay'] } }, shows: 'Versions define development and development defines versions: the current version from its single source, the next number from what the catalogue changed since the last tag (tools added: the minor digit carries), kept to single digits with a build address, the open leads as the version\'s plan, Payload\'s versioning over the RAID (every version an entry, never overwritten, no cap).', expect: (s) => (s.config.current === '1.4.0' && s.config.next.bump === 'minor' && s.config.next.next.startsWith('1.5.0+e1.') && s.config.next.digits === 'single' && s.config.next.added.length >= 30 && s.config.defines.openLeads > 0 && s.config.payload.collections.pages.versions.maxPerDoc === 0 && s.torus.closed ? null : JSON.stringify(s.config.next).slice(0, 120)) },
    { id: 'configure-migration', tool: 'configure', theorem: 'textbook_providers_are_tenants_plus_operator', arguments: { kind: 'migration' }, shows: 'A provider added or moved at 100 % uptime: deploy beside, mirror the docket by address, decode old and new as copies through the gate, route, and the rollback is the earlier version still answering.', expect: (s) => (s.config.steps.length === 5 && s.config.providers.length === 3 && s.config.uptime.startsWith('100') ? null : `${s.config.steps?.length} steps`) },
    { id: 'configure-api', tool: 'configure', arguments: { kind: 'api' }, shows: 'The QPU\'s API overview as data, the way platform.claude.com\'s overview is one for the Claude API: one MCP endpoint and every surface around it, the headers, the authorization (none for every pure tool), the content addressing and its involution, the tools by toolbox, the MCP connector for Claude and for any client, quick tests, limits and errors; docs/api.md is written from it.', expect: (s) => (s.config.endpoints.length >= 10 && s.config.tools.length >= 41 && s.config.mcpConnector.claude.mcp_servers[0].name === 'qpu' && s.config.quickTests.length === 4 && s.config.authorization.pure.includes('without a credential') && s.torus.closed ? null : `${s.config.endpoints?.length} endpoints, ${s.config.tools?.length} tools`) },
    { id: 'configure-fullstack', tool: 'configure', theorem: 'textbook_fullstack_files_by_role', arguments: { kind: 'fullstack' }, shows: 'QPU\'s full stack from the source of payloadcms.com (MIT): its twelve collections, thirty blocks, globals and fields kept, the qpu block added, search, multi-tenant and mcp added to its four plugins, the database the RAID, storage and deploy at Cloudflare; two source files and a README generated for the fork.', expect: (s) => (s.config.keep.blocks.length === 30 && s.config.add.block === 'qpu' && Object.keys(s.config.files).length === 18 && s.config.partition === '1 + 4 + 2 + 2 + 3 + 1 + 3 + 1 + 1 = 18' && Object.keys(s.config.files).every((f) => f.startsWith('site/')) && s.config.files[fileOf('config', 'adapters')].includes('sqliteD1Adapter') && s.config.files[fileOf('hooks', 'users')].includes('firstUserBootstrap') && s.config.files[fileOf('component', 'index')].includes('QpuApp') && s.config.files[fileOf('config', 'ecommerce')].includes('ecommercePlugin(') && s.config.files[fileOf('collection', 'tenants')].includes("slug: 'tenants'") && s.config.files[fileOf('component', 'App')].includes('ui/initialize') && s.config.files[fileOf('config', 'mcp')].includes('qpuMcpTools') && s.config.files[fileOf('notice', 'notice')].includes('MIT') && s.config.files[fileOf('block', 'qpu')].startsWith('// Tsvetan Rouschev, @uuidna/qpu, CC-BY-NC-ND-4.0') && s.config.files[fileOf('block', 'qpu')].includes("slug: 'qpu'") && s.config.steps.length === 5 && s.torus.closed ? null : `${s.config.keep?.blocks?.length} blocks`) },
    { id: 'configure-files', tool: 'configure', theorem: 'textbook_configs_partition', arguments: { files: true }, shows: 'Every configuration\'s file and its source: seven kinds the tool writes on every run (wrangler, the PWA manifest, the full stack\'s files, the bindings\' env example, the shadcn registry, the app\'s wrangler, the plugin that carries the hooks), two the hand holds and MCP measures (the Payload config that mounts the plugin and the adapters, the app\'s rewrites), fourteen answered inside them (realtime, sets, gates, scopes, fields, validations, access, hooks, bindings, actions and the rest) — next always improves them.', expect: (s) => (s.tool === 7 && s.hand === 2 && s.unfiled === 14 && s.kinds === 23 ? null : JSON.stringify(s)) },
    { id: 'configure-packages', tool: 'configure', theorem: 'textbook_packages_partition', arguments: { kind: 'packages' }, shows: 'The packages Payload ships, read from the packages directory of payloadcms/payload: twelve plugins, five databases, five storages, two email adapters, one editor, three live-preview packages and seventeen of runtime and tooling; which the full stack mounts, which stay available, and the minimum-cost path (Payload\'s own D1 and R2 adapters).', expect: (s) => (s.config.count === 45 && s.config.counts.plugins === 12 && s.config.unknown.length === 0 && s.config.minimumCost.cloudflare.length === 2 ? null : JSON.stringify(s.config.counts)) },
    { id: 'configure-ecommerce', tool: 'configure', theorem: 'textbook_catalogue_prices', arguments: { kind: 'ecommerce' }, shows: 'The licence catalogue as Payload\'s own ecommerce, configured as the ecommerce template configures it: six products in seven variants priced in three currencies (twenty-one prices), the Stripe adapter as the payment, access by the site\'s roles, the order\'s access token as the licence key; the fork\'s Stripe plugin replaced, the Worker\'s checkout kept until the gate decodes the app.', expect: (s) => (s.config.catalogue.products === 6 && s.config.catalogue.variants === 7 && s.config.catalogue.prices === 21 && s.config.plugin.collections.length === 8 ? null : JSON.stringify(s.config.catalogue)) },
    { id: 'configure-adapters', tool: 'configure', theorem: 'textbook_adapter_combinations', arguments: { kind: 'adapters', env: ['D1', 'R2', 'RESEND_API_KEY'] }, shows: 'Payload\'s adapters as a matrix over providers and Cloudflare bindings — five databases, five storages, two email adapters, fifty combinations — the combination chosen by what the environment names (here D1, R2 and Resend: the Cloudflare profile), the app\'s own wrangler with every binding, and the RAID\'s docket as the semantics over whichever database answers.', expect: (s) => (s.config.combinations === 50 && s.config.chosen.database === 'db-d1-sqlite' && s.config.chosen.storage === 'storage-r2' && s.config.chosen.email === 'email-resend' && s.config.chosen.profile === 'cloudflare' && s.config.wrangler.d1_databases.length === 1 ? null : JSON.stringify(s.config.chosen)) },
    { id: 'configure-realtime', tool: 'configure', theorem: 'textbook_edit_collides', arguments: { kind: 'realtime' }, shows: 'Realtime collaboration and editing through every channel Payload streams — the document lock, the live preview, autosave, versions, the MCP event stream — with collisions managed precisely: an edit names the address it read and is accepted only while the document still folds to it; a collision is answered with both addresses (no third case, by theorem), never a silent overwrite; the messaging during editing is the lock, the preview, the collision answer and the version; a message channel between editors is an open lead.', expect: (s) => (s.config.streams.length === 5 && s.config.collisions.theorem === 'textbook_edit_collides' && s.config.collisions.hook === 'site/src/collections/pages.qpu.hooks.ts' && s.config.held.must.length === 4 && s.config.editing.viaMcp.includes('editBase') ? null : JSON.stringify(s.config.collisions)) },
    { id: 'configure-sets', tool: 'configure', theorem: 'textbook_set_union', arguments: { kind: 'sets', sets: ['legal', 'crypto'] }, shows: 'The MCP as config sets of widget-skilled tools: the server is the set of every element (tools, each with its widget and its skill; resources, examples, configuration kinds, theorems), a toolbox a subset, a tenant\'s mount the whole set, each addressed by the fold of its sorted members so every mount shares one address; two sets composed by union, intersection and difference with inclusion–exclusion holding; the initialize answer derived from the set and agreeing with the live one.', expect: (s) => (s.config.mounts.oneAddress && s.config.widgetSkilled.every && s.config.algebra.inclusionExclusion && s.config.algebra.intersection.size === 0 && s.config.algebra.union.size === s.config.sets.find((x: { name: string }) => x.name === 'legal').size + s.config.sets.find((x: { name: string }) => x.name === 'crypto').size && s.config.initialize.agrees && s.config.partition.sizes.reduce((n: number, x: number) => n + x, 0) === s.config.sets.find((x: { name: string }) => x.name === 'tools').size ? null : JSON.stringify({ mounts: s.config.mounts, algebra: s.config.algebra.inclusionExclusion, initialize: s.config.initialize })) },
    { id: 'configure-gates', tool: 'configure', theorem: 'textbook_gates_partition', arguments: { kind: 'gates' }, shows: 'Every API as a gate of some sort — a door of this catalogue, an open address, one keyed by the tenant, one a browser alone passes, one the registry names — organised as nested docs three deep (Gates › category › gate) so each doc is a gate of lexical leads: the leads that pass through it listed in its body and answered live by its one block.', expect: (s) => (s.config.tree.depth === 3 && s.config.counts.gates === s.config.gates.length && s.config.counts.own + s.config.counts.external === s.config.counts.gates && s.config.leads.placed > 0 && s.config.counts.gates === 125 && s.config.gates.every((g: { leads: string[] }) => g.leads.every((id: string) => typeof id === 'string')) ? null : JSON.stringify(s.config.counts)) },
    { id: 'configure-ui', tool: 'configure', theorem: 'textbook_ui_deterministic', arguments: { kind: 'ui' }, shows: 'The UI as a configuration: the MCP Apps extension, the mime type, the ui://qpu/<tool> scheme, the host\'s theme variables mapped onto the widgets\' tokens, an empty CSP, one app shell that is a pure function of the key and the theme — hosted by any host that negotiates the extension and by the site\'s playground.', expect: (s) => (s.config.extension === 'io.modelcontextprotocol/ui' && s.config.mimeType === 'text/html;profile=mcp-app' && s.config.tokens.length === 15 && s.config.csp.connectDomains.length === 0 && s.config.registry.items.length === 2 ? null : JSON.stringify(s.config)) },
    { id: 'configure-scopes', tool: 'configure', arguments: { kind: 'scopes' }, shows: 'The scopes: three tenants over four scoped collections (pages, entries, products, orders), three roles per tenant on every user (tenant-admin, editor, viewer) beside the three roles over the docket, a super admin by the admin role, an API key per user for MCP clients; scaling is a tenant added, never code.', expect: (s) => (s.config.tenants.length === 3 && s.config.roles.length === 3 ? null : JSON.stringify(s.config)) },
    { id: 'configure-fields', tool: 'configure', arguments: { kind: 'fields' }, shows: 'The fields QPU adds to Payload: six of the entries collection, eight of the qpu block, each with its validation.', expect: (s) => (s.config.entries.length === 6 && s.config.qpu.length === 8 ? null : JSON.stringify(s.config)) },
    { id: 'configure-validations', tool: 'configure', arguments: { kind: 'validations' }, shows: 'The validations as patterns, enforced by the generated collection and block and the same at the edge: UUIDs of 36 characters, kinds of lower-case letters, digests of 64 hex digits.', expect: (s) => (s.config.validations.length === 6 && s.config.validations.every((v: { pattern: string }) => new RegExp(v.pattern) instanceof RegExp) ? null : JSON.stringify(s.config)) },
    { id: 'configure-access', tool: 'configure', arguments: { kind: 'access' }, shows: 'Access by role carried from the Worker into Payload: everyone reads, a writer creates, no one updates an entry (it is its content address), an admin deletes.', expect: (s) => (s.config.entries.update.startsWith('no one') ? null : JSON.stringify(s.config)) },
    { id: 'configure-actions', tool: 'configure', arguments: { kind: 'actions', experience: { copies: 546, involutions: 507, msByHost: { 'qpu.uuidna.com': 120, 'qpu.psg.bg': 140, 'qpu.ceci.workers.dev': 110 } } }, shows: 'Actions at quantum scale: a JSON-RPC array answered as one array, Payload\'s bulk REST by where, a batch above the quantum sharded and run as one wave, input and output coordinated by address; the shard size follows the experience the gate measured (the slowest host\'s median).', expect: (s) => (s.config.experience.freeShare === 93 && s.config.experience.shardSize === 7 ? null : JSON.stringify(s.config.experience)) },
    { id: 'configure-hooks', tool: 'configure', arguments: { kind: 'hooks' }, shows: 'The Payload hooks the full stack carries, each with what it does and what it keeps free: the content address on create, the tag revalidated on change, the site\'s own page hook kept.', expect: (s) => (s.config.collections.length === 2 && s.torus.closed ? null : JSON.stringify(s.torus)) },
    { id: 'configure-bindings', tool: 'configure', arguments: { kind: 'bindings', env: ['DATABASE_URI', 'PAYLOAD_SECRET'] }, shows: 'Every provider the full stack binds to at full scale and minimum cost: its bindings, its variable names per tenant (never values), its free tier, what is paid for and what the hooks and involutions keep free.', expect: (s) => (s.config.providers.length === 6 && s.torus.closed ? null : JSON.stringify(s.torus)) },
    { id: 'configure-all', tool: 'configure', theorem: 'textbook_reflection_sums_to_ten', arguments: {}, shows: 'Every configuration MCP computes, tested around the torus: Payload\'s plugins, the Worker, the tenants\' variable names, the manifest, the registration, the versions, the migration, the full stack; each with its address, seed, reflection and trinity, every loop closed.', expect: (s) => (s.kinds === 23 && s.tested === 23 && s.closed === true && s.configs.every((c: { torus: { reflection: number; seed: number } }) => c.torus.seed + c.torus.reflection === 10) ? null : `${s.tested}/${s.kinds} closed`) },
    { id: 'configure-payload', tool: 'configure', theorem: 'textbook_plugin_combinations', arguments: { kind: 'payload' }, shows: 'Payload configured by MCP: nine default plugins over the one pages collection, the lexical block qpu with its UUID logic fields, the tenants in multi-tenant, the licence catalogue in ecommerce, 512 combinations.', expect: (s) => (s.config.plugins.length === 9 && s.config.combinations === 512 && s.config.collections.length === 1 && s.config.plugins[0].lexical.blocks[0] === 'qpu' && s.torus.closed ? null : `${s.config.plugins?.length} plugins`) },
    { id: 'configure-wrangler-drift', tool: 'configure', arguments: { kind: 'wrangler', current: '{ "name": "qpu", "main": "src/worker.ts", "routes": [] }' }, shows: 'The Worker configuration compared to a text a client holds: every differing path is a lead, nothing is rewritten by the tool.', expect: (s) => (s.driftCount >= 5 && s.drift.includes('routes') && s.leads.every((l: { status: string }) => l.status === 'open') ? null : `${s.driftCount} drift`) },
    { id: 'configure-tenant-missing', tool: 'configure', arguments: { kind: 'tenant', env: ['QPU_WRITE_TOKEN_UUIDNA', 'QPU_ADMIN_TOKEN_UUIDNA', 'QPU_DATA_KEY'] }, shows: 'Each tenant\'s variable names and which an environment lacks: Stripe keys and the Cloudflare MCP tokens are the operator\'s to set; values never travel.', expect: (s) => (s.missing.length === 3 && s.missing[0].tenant === 'uuidna' && s.missing[0].secrets.includes('STRIPE_SECRET_KEY_UUIDNA') && s.missing[0].secrets.includes('QPU_MCP_TOKEN_BINDINGS_MCP_CLOUDFLARE_COM_UUIDNA') && !s.missing[0].secrets.includes('QPU_WRITE_TOKEN_UUIDNA') ? null : JSON.stringify(s.missing?.[0]).slice(0, 120)) },
    { id: 'payload-theorems-plan', tool: 'payload', arguments: { theorems: true, payloadUrl: 'https://payload.example' }, shows: 'The textbook\'s axioms replaced by theorems through the Payload MCP plugin, as a client: the endpoint, the authorization the tenant sends, the tools/list request, and the steps — the find and update doors picked by what they take, every qpu block without a theorem given the kernel-accepted key its example names.', expect: (s) => (s.phase === 'plan' && s.endpoint === 'https://payload.example/api/mcp' && s.requestList[0].body.method === 'tools/list' && s.theorems >= 10 && s.examplesBacked >= 10 && s.steps.length === 4 ? null : `${s.phase} ${s.endpoint}`) },
    { id: 'payload-theorems-update', tool: 'payload', arguments: { theorems: true, payloadUrl: 'https://payload.example', answers: { list: JSON.stringify({ jsonrpc: '2.0', id: 1, result: { tools: [{ name: 'findDocuments', inputSchema: { properties: { slug: {}, where: {}, limit: {} } } }, { name: 'updateDocument', inputSchema: { properties: { slug: {}, id: {}, data: {} } } }] } }), found: JSON.stringify({ jsonrpc: '2.0', id: 2, result: { structuredContent: { docs: [{ id: 'p1', layout: [{ blockType: 'qpu', tool: 'configure', arguments: { kind: 'payload' }, theorem: null }, { blockType: 'cta' }] }, { id: 'p2', layout: [{ blockType: 'qpu', tool: 'clay', arguments: { name: 'relation_15' }, theorem: 'relation_15' }] }] } } }) } }, shows: 'With the Payload MCP\'s answers: the find and update doors recognised by what they take, two pages read, one qpu block without a theorem given textbook_plugin_combinations (the example configure-payload), one already naming its theorem left as it is; one update request emitted.', expect: (s) => (s.phase === 'update' && s.findDoor === 'findDocuments' && s.updateDoor === 'updateDocument' && s.pages === 2 && s.qpuBlocks === 2 && s.axioms === 1 && s.replaced === 1 && s.requestList[0].body.params.arguments.data.layout[0].theorem === 'textbook_plugin_combinations' ? null : `${s.phase} ${s.replaced} ${JSON.stringify(s.requestList?.[0]?.body?.params?.arguments?.data).slice(0, 120)}`) },
    { id: 'payload-website', tool: 'payload', theorem: 'textbook_website_plugins_partition', arguments: { website: WEBSITE_FIXTURE, liveBlockTypes: ['contentGrid', 'cta'] }, shows: 'The source of payloadcms.com (github.com/payloadcms/website, MIT) read as a tree: twelve collections, thirty blocks, seven globals, ten fields, its own opsCounter plugin, and the four default plugins its config mounts; the live page\'s block types contentGrid and cta have their blocks in the source — the site is what Payload computes, verified.', expect: (s) => (s.phase === 'website' && s.collections === 12 && s.blocks === 30 && s.globals === 5 && s.agrees === true && s.pluginsShared.length === 4 && s.pluginsOnlyHere.includes('mcp') ? null : `${s.collections} collections, ${s.blocks} blocks, ${s.globals} globals, agrees ${s.agrees}, shared ${s.pluginsShared?.length}`) },
    { id: 'payload-skills', tool: 'payload', theorem: 'textbook_skills_documents', arguments: { skills: SKILLS_FIXTURE }, shows: 'Payload\'s skills for agents (github.com/payloadcms/skills) read as a tree: two skills, payload and cms-migration, their fourteen references, each mapped to the tool of this tree that enacts it; names and paths as facts, no text carried.', expect: (s) => (s.phase === 'skills' && s.skills === 2 && s.references === 12 && s.unmapped.length === 0 && s.catalogue.every((k: { enactedBy: string[] }) => k.enactedBy.length > 0) ? null : `${s.skills} skills, ${s.references} refs, unmapped ${s.unmapped?.join(',')}`) },
    { id: 'payload-app', tool: 'payload', theorem: 'textbook_app_bundle', arguments: { app: { name: 'Acme research', host: 'research.acme.com', env: ['D1', 'R2', 'RESEND_API_KEY'], variant: 'yearly' } }, shows: 'An enterprise-grade production app generated on request, as the Apps collection in the Payload UI requests it: the full stack\'s eighteen files plus the Worker configuration and the environment example (twenty, each with its content address, the bundle addressed by their fold), the Cloudflare adapters the environment chooses, tenants, API keys, access, edge signing, realtime and the gate carried; the yearly domain licence priced by the catalogue in the host\'s currency (USD for a .com) and ordered through the ecommerce plugin\'s own checkout: what the QPU is paid for.', expect: (s) => (s.files === 20 && s.partition.endsWith('= 20') && s.adapters.profile === 'cloudflare' && s.price.currency === 'USD' && s.price.amount === 47500 && s.licence.variant === 'yearly' && /^[0-9a-f-]{36}$/.test(s.bundle) && Object.keys(s.addresses).length === 20 && s.tenant === 'research-acme-com' && s.usable.viaMcp.includes('Payload MCP plugin') ? null : JSON.stringify({ files: s.files, price: s.price, adapters: s.adapters })) },
    { id: 'payload-site', tool: 'payload', arguments: { site: true }, shows: 'The site as its own use cases, as payloadcms.com is built of what Payload computes: every toolbox a use case, every example a page document in Payload\'s pages shape (layout blocks, meta, breadcrumbs) at its live /u address.', expect: (s) => (s.useCases >= 9 && s.pages >= 40 && s.collection.slug === 'pages' && s.collection.docs.every((d: { layout: { blockType: string }[]; meta: { title: string }; breadcrumbs: unknown[] }) => d.layout[0]!.blockType === 'qpu' && d.meta.title && d.breadcrumbs.length >= 1 && d.breadcrumbs.length <= 3) && s.gates.depth === 3 && s.gates.pages === s.gates.gates + s.gates.categories + 1 && s.collection.totalDocs === s.pages + s.gates.pages && s.reference.site === 'https://payloadcms.com' ? null : `${s.useCases} use cases, ${s.pages} pages`) },
    { id: 'payload-doc', tool: 'payload', theorem: 'textbook_uuid_is_36', arguments: { tool: 'clay', arguments: { name: 'relation_15' }, prev: '016da774-e74c-2e44-8742-f8bcf5e8e8f5' }, shows: 'The clay result as a Payload document: a lexical root with a heading, one qpu block of UUID logic and the licence paragraph; nested under its referer; the SEO fields from the block\'s Open Graph.', expect: (s) => (s.blocks === 1 && s.breadcrumbs === 2 && s.parent === '016da774-e74c-2e44-8742-f8bcf5e8e8f5' && s.doc.lexical.root.children[1].fields.blockType === 'qpu' && s.doc.lexical.root.children[1].fields.next.length === 36 && s.doc.seo.title.includes('clay') ? null : `${s.blocks} blocks, ${s.breadcrumbs} crumbs, parent ${s.parent}`) },
  ],
  skill: {
    instructions: 'configure: a client calls it with no kind to test every configuration around the torus, with kind and current (its file text) to learn the drift as leads, with kind tenant and the names of its environment to learn what the operator still has to set; gen-docs writes the manifest from kind pwa. A Payload host with the default plugins (lexical, nested-docs, seo) stores _meta.payload of any result as it is: the lexical field is the document, nestedDocs.parent the parent relation, seo the plugin\'s fields; the block\'s uuid is the id. A device renders the block from its uuid alone (the walk) and never recomputes what the balancer computed.',
    directions: ['server only: the document shape on a fixture block; the next uuid is the program rotated; the breadcrumbs follow the chain', 'toolbox → toolbox: the block\'s Open Graph and JSON-LD come from the tree and standards toolboxes', 'client → server: a Payload host reads the document; the device reads the uuid'],
    selftest: (ctx) => {
      const checks: { id: string; passed: boolean; evidence: string }[] = []
      const check = (id: string, passed: boolean, evidence: string) => checks.push({ id, passed, evidence })
      const d = payloadDocOf({ uuid: '941ef62e-d97b-2438-bfc8-22ae9e5da781', tool: 'software', arguments: {}, description: 'd', openGraph: { 'og:title': 'software · @uuidna/qpu', 'og:description': 'five tools' }, prev: '016da774-e74c-2e44-8742-f8bcf5e8e8f5', chain: ['00000000-0000-1000-8000-000000000000'] })
      const block = d.lexical.root.children[1] as { type: string; fields: { blockType: string; uuid: string; next: string; program: string; handle: string } }
      const ch = channelOf(d.id); const nx = channelOf(block.fields.next)
      check('payload:lexical-block', d.lexical.root.type === 'root' && block.type === 'block' && block.fields.blockType === 'qpu' && block.fields.uuid === d.id && block.fields.handle === ch.handle && block.fields.program === ch.program.join(''), `one qpu block of UUID logic in a lexical root: handle ${ch.handle}, program ${ch.program.join('')}`)
      check('payload:next-rotated', block.fields.next !== d.id && nx.handle === ch.handle && nx.tail === ch.tail && nx.program.join('') !== ch.program.join(''), `the next uuid keeps the handle and the tail and rotates the program: ${ch.program.join('')} → ${nx.program.join('')}`)
      check('payload:nested', d.nestedDocs.parent === '016da774-e74c-2e44-8742-f8bcf5e8e8f5' && d.nestedDocs.breadcrumbs.length === 3 && d.nestedDocs.breadcrumbs[2]!.doc === d.id, 'parent and breadcrumbs follow the chain')
      check('payload:seo-and-ld', d.seo.title === 'software · @uuidna/qpu' && d.seo.description === 'five tools' && (d.jsonLd as { '@type': string })['@type'] === 'CreativeWork' && d.license === 'CC-BY-NC-ND-4.0', 'SEO from Open Graph, JSON-LD and licence carried')
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
      const sk = skillsOf(SKILLS_FIXTURE)
      check('payload:skills-mapped', sk.skills === 2 && sk.references === 12 && sk.unmapped.length === 0 && sk.catalogue.find((k) => k.skill === 'cms-migration')!.enactedBy.includes('fold'), `${sk.skills} skills and ${sk.references} references, every one enacted by a tool of this tree`)
      const m = configOf('mcp', ctx) as { tools: number; mcpServers: { qpu: { url: string } } }
      const nv = nextVersionOf('1.4.0', ['a', 'b', 'c'], { version: 'v1.4.0', tools: ['a', 'b'] }); const rm = nextVersionOf('1.4.0', ['a'], { version: '1.4.0', tools: ['a', 'b'] }); const same = nextVersionOf('1.4.0', ['a', 'b'], { version: '1.4.0', tools: ['a', 'b'] })
      check('configure:development-defines-the-version', nv.next.startsWith('1.5.0+e1.') && nv.bump === 'minor' && rm.next.startsWith('2.0.0+e1.') && same.next.startsWith('1.4.0+e1.') && same.bump === 'none', `a tool added: ${nv.next}; a tool gone: ${rm.next}; nothing changed: ${same.next} (the number stays; the build address moves)`)
      const carry = nextVersionOf('1.9.0', ['a', 'b'], { version: '1.9.0', tools: ['a'] }); const wrap = nextVersionOf('9.3.0', ['a'], { version: '9.3.0', tools: ['a', 'b'] })
      check('configure:single-digits-infinite-lifespan', carry.next.startsWith('2.0.0+e1.') && wrap.next.startsWith('1.0.0+e2.') && wrap.epoch === 2 && same.build === nextVersionOf('1.4.0', ['a', 'b'], { version: '1.4.0', tools: ['a', 'b'] }).build, `minor carries at 10: ${carry.next}; major past 9 returns to 1 with the epoch: ${wrap.next}; the build address is a function of the catalogue`)
      const mg = configOf('migration', ctx) as { steps: unknown[]; uptime: string }
      check('configure:migration-at-whole-uptime', mg.steps.length === 5 && mg.uptime.startsWith('100'), 'five steps, no address moved')
      check('configure:mcp-registration', m.tools >= 36 && m.mcpServers.qpu.url.endsWith('/mcp'), `the registration of ${m.tools} tools, through the extension toolbox`)
      const files = CONFIG_FILES; const tool = files.filter((f) => f.source === 'tool').length
      check('configure:files-partition', tool + (files.length - tool) + (configKinds.length - files.length) === configKinds.length && tool === 7 && files.length - tool === 2 && configKinds.length === 23, `${tool} tool-sourced, ${files.length - tool} hand-held, ${configKinds.length - files.length} unfiled of ${configKinds.length} kinds`)
      const gd = gateDocsOf(ctx, 'https://qpu.uuidna.com')
      check('configure:gates-nested-three-deep', gd.docs.every((d) => d.breadcrumbs.length === d.depth && (d.depth === 1 || gd.docs.some((p) => p.slug === d.parent)) && d.layout[0]!.tool === 'leads') && gd.docs.filter((d) => d.depth === 3).length === gd.counts.gates && gd.docs.length === gd.counts.gates + gd.counts.categories + 1 && new Set(gd.docs.map((d) => d.slug)).size === gd.docs.length && gd.gates.every((g) => g.leads.every((id) => ctx.leads.some((l) => l.id === id))) && gd.leads.placed + gd.leads.unplaced.length === ctx.leads.length, `${gd.counts.gates} gates (${gd.counts.partition}) in ${gd.counts.categories} categories, ${gd.docs.length} nested docs, every parent a doc before its children, ${gd.leads.placed} leads placed`)
      const ss = setsOf(ctx, ['legal', 'legal'])
      check('configure:mcp-is-its-config-sets', ss.mounts.oneAddress && ss.widgetSkilled.every && ss.algebra.inclusionExclusion && ss.algebra.union.address === ss.algebra.intersection.address && ss.algebra.difference.size === 0 && ss.initialize.agrees && ss.sets.find((x) => x.name === 'mcp')!.size === ss.elements.total && ss.partition.sizes.reduce((n, x) => n + x, 0) === ss.sets.find((x) => x.name === 'tools')!.size, `${ss.elements.total} elements in ${ss.sets.length} sets; a set united with itself is itself (one address); every mount one address; ${ss.widgetSkilled.both} widget-skilled tools; initialize derived = live`)
      check('configure:realtime-collisions-exact', REALTIME.streams.length === 5 && REALTIME.collisions.hook === fileOf('hooks', 'pages') && REALTIME.held.file === fileOf('plugin', 'qpu') && REALTIME.editing.viaMcp.includes('editBase'), 'five streams Payload carries; the plugin adds the lock, the autosave, the guard and the base field to pages, so no hand-held file drifts; an MCP client carries the base in the data')
      check('configure:files-named-by-role', fileOf('block', 'qpu') === 'site/src/blocks/Qpu/config.ts' && fileOf('script', 'seed-qpu') === 'site/src/scripts/seedQpu.ts' && fileOf('hooks', 'users') === 'site/src/collections/users.qpu.hooks.ts' && fileOf('notice', 'readme') === 'site/README.qpu.md' && fileOf('component', 'App') === 'site/src/components/blocks/Qpu/App.tsx' && fileOf('plugin', 'qpu') === 'site/src/plugins/qpu.ts' && (Object.keys(FILE_ROLES) as FileRole[]).every((r) => FILE_ROLES[r].loads.length > 0), 'every generated path is a function of its role and key; every role says what loads it')
      check('configure:wrangler-carries-the-flag', (w as { compatibility_flags: string[] }).compatibility_flags.includes(WEBCRYPTO_FLAG), 'the seal tool needs ML-DSA in Web Crypto, so the wrangler configuration carries the flag')
      check('configure:hooks-keep-reads-free', HOOKS.collections.every((c) => c.hooks.every((h) => h.keepsFree.length > 0)) && HOOKS.collections[0]!.hooks.some((h) => h.hook === 'beforeValidate'), 'every hook names what it keeps free; entries are addressed on create and never revalidated')
      check('configure:bindings-named-never-valued', BINDINGS.length === 6 && BINDINGS.every((b) => b.names.every((n) => /^[A-Z_<>]+$/.test(n)) && b.freeTier && b.paidFor) && !envExampleOf().split('\n').some((l) => /=[^\s]/.test(l)), `${BINDINGS.length} providers, every name a name, every line of the env example empty after =`)
      check('configure:scopes-fields-validations-access', SCOPES.tenants.length === 3 && SCOPES.collections.length === 4 && SCOPES.tenantRoles.length === 3 && FIELDS.entries.length === 6 && FIELDS.qpu.length === 8 && VALIDATIONS.every((v) => new RegExp(v.pattern).test(v.field === 'kind' ? 'reading' : v.field === 'sha256' ? 'a'.repeat(64) : v.field === 'prev' || v.field === 'next' ? '' : '12345678-1234-1234-1234-123456789abc')) && ACCESS.entries.update.startsWith('no one'), 'three tenants, fourteen fields, six validations that accept their own examples, entries immutable')
      check('configure:actions-follow-the-experience', actionsOf({ copies: 100, involutions: 90, msByHost: { a: 250, b: 500 } }).experience.shardSize === 2 && actionsOf().experience.shardSize === 8 && actionsOf({ copies: 100, involutions: 90 }).experience.freeShare === 90, 'the shard size from the slowest host\'s median; the free share from the involutions')
      const pk = packagesOf()
      check('configure:packages-ship-what-we-mount', pk.unknown.length === 0 && pk.count === 45 && pk.counts.plugins === 12 && pk.counts.databases === 5 && pk.counts.storage === 5 && pk.counts.email === 2 && pk.counts.editors === 1 && pk.counts['live-preview'] === 3 && pk.counts['runtime-and-tooling'] === 17, `every plugin, adapter and editor configured here is a package Payload ships (${pk.mounted.length} mounted of ${pk.count})`)
      const ec = ecommerceOf()
      check('configure:ecommerce-from-the-template', ec.catalogue.prices === ec.catalogue.variants * ec.catalogue.currencies && ec.catalogue.items.every((i) => Object.keys(i.prices).length === 3 && Object.values(i.prices).every((v) => Number.isInteger(v) && v >= 0)) && PAYLOAD_ECOMMERCE.pluginCollections.length === 8 && pk.mounted.includes('plugin-ecommerce'), `${ec.catalogue.variants} variants × ${ec.catalogue.currencies} currencies = ${ec.catalogue.prices} prices, every amount an integer in the minor unit; the plugin\'s eight collections`)
      const u1 = uiOf('processor'); const u2 = uiOf('processor')
      check('configure:ui-shell-deterministic-and-closed', u1.html === u2.html && u1.uri === 'ui://qpu/processor' && u1.mimeType === 'text/html;profile=mcp-app' && !/Math\.random|Date\.now|https?:\/\//.test(u1.html) && /ui\/initialize/.test(u1.html) && /ui\/notifications\/tool-result/.test(u1.html) && /ui\/notifications\/size-changed/.test(u1.html) && UI_TOKENS.every(([t, h]) => u1.html.includes(t) && t !== h) && /font-family: var\(--font-sans, /.test(u1.html), 'the same shell twice, no randomness, no clock, no external URL; the handshake, the result and the size notifications; every widget token mapped onto a host variable of another name, the font read where it is used')
      const ad = adaptersOf(['DATABASE_URI', 'BLOB_READ_WRITE_TOKEN', 'SENDGRID_API_KEY']); const cf = adaptersOf(['D1', 'R2'])
      check('configure:adapters-chosen-by-environment', ad.combinations === 50 && ad.chosen.profile === 'vercel' && ad.chosen.database === 'db-mongodb' && cf.chosen.profile === 'cloudflare' && cf.chosen.database === 'db-d1-sqlite' && cf.chosen.storage === 'storage-r2' && cf.chosen.email === 'email-nodemailer' && adaptersOf([]).chosen.profile === 'local', 'fifty combinations; Vercel names Mongo, Blob and nodemailer, Cloudflare names D1 and R2 with the mail adapter the keys name, nothing named is local')
      check('configure:held-drift-measured', heldDriftOf('payload', 'seoPlugin( nestedDocsPlugin( mongooseAdapter( process.env.PAYLOAD_SECRET').join() === 'plugins.qpuPlugin,adapters.qpuDb,adapters.qpuEmail,adapters.qpuStoragePlugins' && heldDriftOf('payload', 'formBuilderPlugin( qpuPlugin() qpuDb() qpuEmail() qpuStoragePlugins() process.env.PAYLOAD_SECRET').length === 0 && heldDriftOf('payload', 'qpuPlugin() formBuilderPlugin( qpuDb() qpuEmail() qpuStoragePlugins() process.env.PAYLOAD_SECRET').join() === 'plugins.qpuPlugin.last' && heldDriftOf('hooks', 'nothing').length === 0 && heldDriftOf('api', "destination: '/api/qpu'").join() === 'rewrite./api/globals/qpu,rewrite./api/mcp,rewrite./api/entries/:uuid,custom-endpoint./api/qpu', 'a hand-held file measured by what MCP configures and the text lacks')
      return { passed: checks.every((c) => c.passed), checks }
    },
  },
}
