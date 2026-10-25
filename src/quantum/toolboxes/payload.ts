// The payload toolbox: every result in Payload's own plugin schema and nothing custom — a lexical document whose one block is
// the programmable UUID logic (the block's uuid, its handle, program and tail, the tool and its arguments, the next step the
// program rotated to), nested by the referer chain as the nested-docs plugin nests (parent, breadcrumbs), described by the
// SEO plugin's fields from the block's Open Graph, carrying its JSON-LD and its licence. Pure and small: computed once per
// block by the balancer, so the cost is a few kilobytes and no computation on the device — the battery is the result.
import { toolOf, type Toolbox, type Context } from '../toolbox.js'
import { channelOf, uuidFromParts, uuidOf } from '../blocks.js'
import { seedOf, trinityOf } from '../clay-register.js'
import { TENANTS } from '../tenants.js'
import { CLOUDFLARE_MCP, DEFAULT_MCP_HOSTS } from '../discovery.js'
import { KEY, hueOf } from '../theme.js'
import { blockJsonLdOf } from '../standards.js'
import { LICENSE } from '../license.js'
import { flowWidget } from '../widgets.js'

export type LexicalDoc = { root: { type: 'root'; version: 1; direction: 'ltr'; format: ''; indent: 0; children: unknown[] } }
export type PayloadDoc = { id: string; lexical: LexicalDoc; nestedDocs: { parent: string | null; breadcrumbs: { doc: string; url: string; label: string }[] }; seo: { title: string; description: string; image: string | null }; jsonLd: unknown; license: string }

/** A result as the document Payload's plugins would hold: one lexical block of UUID logic, nested by prev, described for SEO. */
export const payloadDocOf = (p: { uuid: string; tool: string; arguments: Record<string, unknown>; description: string; openGraph?: Record<string, string>; html?: string; prev?: string | null; chain?: string[]; origin?: string }): PayloadDoc => {
  const ch = channelOf(p.uuid)
  const next = uuidFromParts(ch.handle, [...ch.program.slice(1), ch.program[0]!], ch.tail)
  const origin = p.origin ?? 'https://qpu.uuidna.com'
  const url = (id: string) => `${origin}/u/${id}`
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

const payload = toolOf('payload', {
  name: 'payload',
  description: 'Any tool\'s result as the document Payload\'s default plugins hold, no custom collection: a lexical document whose one block is the programmable UUID logic (uuid, handle, program, tail, tool, arguments, prev, next), nested by the referer chain as nested-docs nests (parent, breadcrumbs), the SEO plugin\'s title, description and image from the block\'s Open Graph, the JSON-LD and the licence. Every tools/call result carries the same in _meta.payload.',
  inputSchema: { type: 'object', properties: { site: { type: 'boolean', description: 'the site as its own use cases: every toolbox a use case, every example a page document, as payloadcms.com is built of what Payload computes' }, tool: { type: 'string' }, arguments: { type: 'object' }, prev: { type: 'string', description: 'the referer block\'s uuid' }, chain: { type: 'array', items: { type: 'string' }, description: 'the referers before prev, oldest first' }, origin: { type: 'string' }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (args.selftest) return { selftest: true, ...PAYLOAD.skill.selftest(ctx) }
    if (args.site) return siteOf(ctx, typeof args.origin === 'string' ? args.origin : 'https://qpu.uuidna.com')
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
  { name: 'nested-docs', pkg: '@payloadcms/plugin-nested-docs', options: { collections: ['pages'], generateLabel: 'the block\'s tool', generateURL: '/u/<uuid>' } },
  { name: 'seo', pkg: '@payloadcms/plugin-seo', options: { collections: ['pages'], uploadsCollection: null, generateTitle: 'og:title of the block', generateDescription: 'og:description of the block', generateImage: 'og:image of the block' } },
  { name: 'search', pkg: '@payloadcms/plugin-search', options: { collections: ['pages'], searchOverrides: { fields: ['tool', 'uuid'] } } },
  { name: 'redirects', pkg: '@payloadcms/plugin-redirects', options: { collections: ['pages'], from: '/u/<prev>', to: '/u/<next>' } },
  { name: 'form-builder', pkg: '@payloadcms/plugin-form-builder', options: { fields: ['text', 'select', 'checkbox', 'number'], note: 'every tool\'s inputSchema is a form; the dashboard tool enumerates its facets' } },
  { name: 'multi-tenant', pkg: '@payloadcms/plugin-multi-tenant', options: { tenants: Object.values(TENANTS), tenantField: 'tenant', byHost: TENANTS } },
  { name: 'mcp', pkg: '@payloadcms/plugin-mcp', options: { servers: 'the registration extend gives (direction out), plus every host the tenant names', rbac: 'roles of every MCP server managed over MCP itself; the Worker asks this host first (QPU_RBAC_MCP, QPU_RBAC_TOOL)' } },
]
/** The site as its own use cases: the reference is payloadcms.com, whose REST answers pages of blocks with SEO meta and breadcrumbs — the site is what the product computes. Here every toolbox is a use case and every example a page document whose one block is the result's UUID logic, at its live address. */
export const siteOf = (ctx: Context, origin: string) => {
  const list = (ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) as { result: { tools: { name: string; description: string; _meta?: { toolbox?: string } }[] } }).result.tools
  const boxOf = new Map(list.map((t) => [t.name, t._meta?.toolbox ?? 'none']))
  const heavy = new Set(['audit', 'metrics', 'imagine', 'discover', 'wave', 'readiness', 'e2e', 'textbook', 'clone'])
  const docs = ctx.examples.filter((e) => !heavy.has(e.tool) && !e.arguments.selftest).map((e) => {
    const r = ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: e.tool, arguments: e.arguments } }) as { result?: { _meta: { block: { meta: { id: string } }; openGraph: Record<string, string> } }; error?: { message: string } }
    if (!r.result) return { id: e.id, tool: e.tool, toolbox: boxOf.get(e.tool) ?? 'none', error: r.error?.message ?? 'no result' }
    const uuid = r.result._meta.block.meta.id
    const d = payloadDocOf({ uuid, tool: e.tool, arguments: e.arguments, description: e.shows, openGraph: r.result._meta.openGraph, prev: null, chain: [], origin })
    return { id: e.id, tool: e.tool, toolbox: boxOf.get(e.tool) ?? 'none', uuid, url: `${origin}/u/${uuid}`, title: d.seo.title, description: e.shows, theorem: e.theorem ?? null, breadcrumbs: d.nestedDocs.breadcrumbs.length, blocks: 1 }
  })
  const useCases = [...new Set(docs.map((d) => d.toolbox))].map((toolbox) => ({ toolbox, pages: docs.filter((d) => d.toolbox === toolbox).length, tools: [...new Set(docs.filter((d) => d.toolbox === toolbox).map((d) => d.tool))] }))
  return { reference: { site: 'https://payloadcms.com', contract: 'https://payloadcms.com/api/pages?limit=1&depth=0', shape: 'docs with layout blocks (blockType), meta (title, description), breadcrumbs: the site is what Payload computes; discovery reads it as the standard payload-site' }, origin, useCases: useCases.length, pages: docs.length, byUseCase: useCases, docs, collection: { slug: 'pages', totalDocs: docs.length, docs: docs.filter((d) => 'uuid' in d).map((d) => ({ id: d.uuid, title: d.title, slug: `/u/${d.uuid}`, layout: [{ blockType: 'qpu', tool: d.tool, uuid: d.uuid }], meta: { title: d.title, description: d.description }, breadcrumbs: [{ doc: d.uuid, url: `/u/${d.uuid}`, label: d.title }] })) } }
}
const configKinds = ['payload', 'wrangler', 'tenant', 'pwa', 'mcp'] as const
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
export const configOf = (kind: ConfigKind, ctx: Context, p: { version?: string; description?: string } = {}) => {
  const hosts = Object.keys(TENANTS)
  switch (kind) {
    case 'payload': return { collections: [{ slug: 'pages', fields: ['lexical', 'tenant'], note: 'the plugins\' own collection; the fields are the plugins\'' }], plugins: PAYLOAD_PLUGINS.map((p) => ({ [p.name]: { package: p.pkg, ...p.options } })), combinations: 2 ** PAYLOAD_PLUGINS.length, combinationNote: 'every subset of the plugins is a configuration; the dashboard of this tool enumerates them by address' }
    case 'wrangler': return { $schema: 'node_modules/wrangler/config-schema.json', name: 'qpu', main: 'src/worker.ts', compatibility_date: '2026-10-01', workers_dev: true, assets: { directory: './docs/.vitepress/dist', binding: 'ASSETS', run_worker_first: true, not_found_handling: 'none' }, routes: hosts.map((h) => ({ pattern: h, custom_domain: true })), durable_objects: { bindings: [{ name: 'DOCKET', class_name: 'DocketObject' }] }, migrations: [{ tag: 'v1', new_sqlite_classes: ['DocketObject'] }], observability: { enabled: true } }
    case 'tenant': return { tenants: [...Object.values(TENANTS), 'ceci'].map(varsOf), mcpHostsDefault: DEFAULT_MCP_HOSTS }
    case 'pwa': { const accent = `hsl(${hueOf(KEY)} 62% 44%)`; return { name: '@uuidna/qpu', short_name: 'qpu', description: p.description ?? '', id: '/', start_url: '/', scope: '/', display: 'standalone', orientation: 'any', background_color: '#0b0b0f', theme_color: accent, lang: 'en', dir: 'ltr', categories: ['developer', 'education', 'productivity'], icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }, { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' }], shortcuts: [{ name: 'Every tool laid out', url: '/u/' + uuidOf('dashboard{}'), description: 'the dashboard index: every tool with the size of its space' }, { name: 'Examples', url: '/examples' }, { name: 'Stream', url: '/stream' }, { name: 'Readiness', url: '/readiness' }], related_applications: [], prefer_related_applications: false, license: 'CC-BY-NC-ND-4.0', version: p.version ?? null } }
    case 'mcp': { const r = ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'extend', arguments: { direction: 'out' } } }) as { result: { structuredContent: { outward: { mcpServers: unknown; tools: unknown[] } } } }; return { mcpServers: r.result.structuredContent.outward.mcpServers, tools: r.result.structuredContent.outward.tools.length, hosts: DEFAULT_MCP_HOSTS } }
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
  description: 'MCP configures Payload and the rest: Payload\'s default plugins (lexical with the one qpu block, nested-docs, seo, search, redirects, form-builder, multi-tenant, mcp) in all their combinations with no custom collection; the Worker\'s wrangler configuration from the tenants; each tenant\'s variable names (never values); the PWA manifest; the MCP registration. Every configuration carries its torus: address, seed, reflection and trinity, and whether the loop closes (config → text → config at the same address). With current (the text a client holds), the drift: every path that differs, each a lead. Without kind: all of them, tested.',
  inputSchema: { type: 'object', properties: { kind: { type: 'string', enum: [...configKinds], description: 'omit for all' }, current: { type: 'string', description: 'the configuration text the client holds (JSON or JSONC): compared, the drift answered' }, version: { type: 'string' }, description: { type: 'string' }, env: { type: 'array', items: { type: 'string' }, description: 'the variable NAMES the client\'s environment holds: which of a tenant\'s are missing (values never travel)' }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (args.selftest) return { selftest: true, ...PAYLOAD.skill.selftest(ctx) }
    const p = { version: typeof args.version === 'string' ? args.version : undefined, description: typeof args.description === 'string' ? args.description : undefined }
    if (typeof args.kind === 'string') {
      if (!configKinds.includes(args.kind as ConfigKind)) throw new Error(`no configuration ${args.kind}; the kinds are ${configKinds.join(', ')}`)
      const kind = args.kind as ConfigKind
      const config = configOf(kind, ctx, p)
      const out: Record<string, unknown> = { kind, config, torus: torusOf(config) }
      if (typeof args.current === 'string') { let cur: unknown; try { cur = JSON.parse(stripJsonc(args.current)) } catch (e) { cur = { unparsable: (e as Error).message } }; const drift = driftOf(config, cur); out.drift = drift; out.driftCount = drift.length; out.leads = drift.map((d) => ({ id: `config-${kind}-${d}`, statement: `${kind}: ${d} differs between the configuration MCP computes and the text the client holds`, status: 'open', reason: 'the client rewrites its text from the configuration, or the configuration learns what the operator set by hand' })) }
      if (kind === 'tenant' && Array.isArray(args.env)) { const have = new Set(args.env.map(String)); out.missing = (config as { tenants: { tenant: string; secrets: string[]; vars: string[] }[] }).tenants.map((t) => ({ tenant: t.tenant, secrets: t.secrets.filter((s) => !have.has(s)), vars: t.vars.filter((v) => !have.has(v)) })) }
      return out
    }
    const all = configKinds.map((kind) => { const config = configOf(kind, ctx, p); return { kind, torus: torusOf(config), config } })
    return { kinds: all.length, tested: all.filter((a) => a.torus.closed).length, closed: all.every((a) => a.torus.closed), doubleTorus: { inward: 'config → text → config at the same address, every kind', outward: 'this catalogue → registration → doors → catalogue (extend identity)' }, byTrinity: Object.fromEntries([[3, 6, 9], [7, 4, 1], [2, 5, 8]].map((t) => [t.join(''), all.filter((a) => a.torus.trinity.join('') === t.join('')).map((a) => a.kind)])), configs: all }
  },
  widget: flowWidget,
})

export const PAYLOAD: Toolbox = {
  name: 'payload',
  idea: 'Payload\'s plugin schema as the one shape of every result: nested docs of lexical documents whose blocks are programmable UUID logic, SEO from the block, no custom collection, a few kilobytes computed once',
  tools: [payload, configure],
  examples: [
    { id: 'configure-all', tool: 'configure', arguments: {}, shows: 'Every configuration MCP computes, tested around the torus: Payload\'s plugins, the Worker, the tenants\' variable names, the manifest, the registration; each with its address, seed, reflection and trinity, every loop closed.', expect: (s) => (s.kinds === 5 && s.tested === 5 && s.closed === true && s.configs.every((c: { torus: { reflection: number; seed: number } }) => c.torus.seed + c.torus.reflection === 10) ? null : `${s.tested}/${s.kinds} closed`) },
    { id: 'configure-payload', tool: 'configure', arguments: { kind: 'payload' }, shows: 'Payload configured by MCP: eight default plugins over the one pages collection, the lexical block qpu with its UUID logic fields, the tenants in multi-tenant, 256 combinations.', expect: (s) => (s.config.plugins.length === 8 && s.config.combinations === 256 && s.config.collections.length === 1 && s.config.plugins[0].lexical.blocks[0] === 'qpu' && s.torus.closed ? null : `${s.config.plugins?.length} plugins`) },
    { id: 'configure-wrangler-drift', tool: 'configure', arguments: { kind: 'wrangler', current: '{ "name": "qpu", "main": "src/worker.ts", "routes": [] }' }, shows: 'The Worker configuration compared to a text a client holds: every differing path is a lead, nothing is rewritten by the tool.', expect: (s) => (s.driftCount >= 5 && s.drift.includes('routes') && s.leads.every((l: { status: string }) => l.status === 'open') ? null : `${s.driftCount} drift`) },
    { id: 'configure-tenant-missing', tool: 'configure', arguments: { kind: 'tenant', env: ['QPU_WRITE_TOKEN_UUIDNA', 'QPU_ADMIN_TOKEN_UUIDNA', 'QPU_DATA_KEY'] }, shows: 'Each tenant\'s variable names and which an environment lacks: Stripe keys and the Cloudflare MCP tokens are the operator\'s to set; values never travel.', expect: (s) => (s.missing.length === 3 && s.missing[0].tenant === 'uuidna' && s.missing[0].secrets.includes('STRIPE_SECRET_KEY_UUIDNA') && s.missing[0].secrets.includes('QPU_MCP_TOKEN_BINDINGS_MCP_CLOUDFLARE_COM_UUIDNA') && !s.missing[0].secrets.includes('QPU_WRITE_TOKEN_UUIDNA') ? null : JSON.stringify(s.missing?.[0]).slice(0, 120)) },
    { id: 'payload-site', tool: 'payload', arguments: { site: true }, shows: 'The site as its own use cases, as payloadcms.com is built of what Payload computes: every toolbox a use case, every example a page document in Payload\'s pages shape (layout blocks, meta, breadcrumbs) at its live /u address.', expect: (s) => (s.useCases >= 9 && s.pages >= 40 && s.collection.slug === 'pages' && s.collection.docs.every((d: { layout: { blockType: string }[]; meta: { title: string }; breadcrumbs: unknown[] }) => d.layout[0]!.blockType === 'qpu' && d.meta.title && d.breadcrumbs.length === 1) && s.reference.site === 'https://payloadcms.com' ? null : `${s.useCases} use cases, ${s.pages} pages`) },
    { id: 'payload-doc', tool: 'payload', arguments: { tool: 'clay', arguments: { name: 'relation_15' }, prev: '016da774-e74c-2e44-8742-f8bcf5e8e8f5' }, shows: 'The clay result as a Payload document: a lexical root with a heading, one qpu block of UUID logic and the licence paragraph; nested under its referer; the SEO fields from the block\'s Open Graph.', expect: (s) => (s.blocks === 1 && s.breadcrumbs === 2 && s.parent === '016da774-e74c-2e44-8742-f8bcf5e8e8f5' && s.doc.lexical.root.children[1].fields.blockType === 'qpu' && s.doc.lexical.root.children[1].fields.next.length === 36 && s.doc.seo.title.includes('clay') ? null : `${s.blocks} blocks, ${s.breadcrumbs} crumbs, parent ${s.parent}`) },
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
      check('configure:payload-plugins', pl.plugins.length === 8 && pl.combinations === 256 && pl.plugins.some((p) => 'multi-tenant' in p), 'the eight default plugins, 256 combinations, the tenants in multi-tenant')
      const m = configOf('mcp', ctx) as { tools: number; mcpServers: { qpu: { url: string } } }
      check('configure:mcp-registration', m.tools >= 36 && m.mcpServers.qpu.url.endsWith('/mcp'), `the registration of ${m.tools} tools, through the extension toolbox`)
      return { passed: checks.every((c) => c.passed), checks }
    },
  },
}
