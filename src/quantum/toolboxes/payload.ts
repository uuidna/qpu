// The payload toolbox: every result in Payload's own plugin schema and nothing custom — a lexical document whose one block is
// the programmable UUID logic (the block's uuid, its handle, program and tail, the tool and its arguments, the next step the
// program rotated to), nested by the referer chain as the nested-docs plugin nests (parent, breadcrumbs), described by the
// SEO plugin's fields from the block's Open Graph, carrying its JSON-LD and its licence. Pure and small: computed once per
// block by the balancer, so the cost is a few kilobytes and no computation on the device — the battery is the result.
import { toolOf, type Toolbox, type Context } from '../toolbox.js'
import { channelOf, uuidFromParts, uuidOf } from '../blocks.js'
import { seedOf, trinityOf } from '../clay-register.js'
import { TENANTS } from '../tenants.js'
import { CLOUDFLARE_MCP, DEFAULT_MCP_HOSTS, CLAUDE_API } from '../discovery.js'
import { KEY, hueOf } from '../theme.js'
import { VERSION } from '../version.js'
import { TEXTBOOK_THEOREMS } from '../textbook-theorems.js'
import { answerOf } from './extension.js'
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
  inputSchema: { type: 'object', properties: { theorems: { type: 'boolean', description: 'the textbook\'s axioms replaced by theorems through the tenant\'s Payload MCP plugin, as a client: the plan, then with answers { list, found } the update requests' }, payloadUrl: { type: 'string', description: 'the tenant\'s Payload origin; its MCP is at /api/mcp' }, answers: { type: 'object' }, website: { description: 'true: the requests for payloadcms.com\'s source tree and one live page; the tree as answered: its collections, blocks, globals, fields and plugins, and whether the live page\'s blocks have a block in the source' }, liveBlockTypes: { type: 'array', items: { type: 'string' } }, skills: { description: 'true: the request for Payload\'s skills tree (github.com/payloadcms/skills); the tree as answered: every skill and reference mapped to the tool of this tree that enacts it' }, site: { type: 'boolean', description: 'the site as its own use cases: every toolbox a use case, every example a page document, as payloadcms.com is built of what Payload computes' }, tool: { type: 'string' }, arguments: { type: 'object' }, prev: { type: 'string', description: 'the referer block\'s uuid' }, chain: { type: 'array', items: { type: 'string' }, description: 'the referers before prev, oldest first' }, origin: { type: 'string' }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (args.selftest) return { selftest: true, ...PAYLOAD.skill.selftest(ctx) }
    if (args.site) return siteOf(ctx, typeof args.origin === 'string' ? args.origin : 'https://qpu.uuidna.com')
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
  // the site never lays itself out inside itself: the example that is this very call is skipped (it would replay every example again, inside the first replay)
  const docs = ctx.examples.filter((e) => !heavy.has(e.tool) && !e.arguments.selftest && !(e.tool === 'payload' && e.arguments.site)).map((e) => {
    const r = ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: e.tool, arguments: e.arguments } }) as { result?: { _meta: { block: { meta: { id: string } }; openGraph: Record<string, string> } }; error?: { message: string } }
    if (!r.result) return { id: e.id, tool: e.tool, toolbox: boxOf.get(e.tool) ?? 'none', error: r.error?.message ?? 'no result' }
    const uuid = r.result._meta.block.meta.id
    const d = payloadDocOf({ uuid, tool: e.tool, arguments: e.arguments, description: e.shows, openGraph: r.result._meta.openGraph, prev: null, chain: [], origin })
    return { id: e.id, tool: e.tool, toolbox: boxOf.get(e.tool) ?? 'none', uuid, url: `${origin}/u/${uuid}`, title: d.seo.title, description: e.shows, theorem: e.theorem ?? null, breadcrumbs: d.nestedDocs.breadcrumbs.length, blocks: 1 }
  })
  const useCases = [...new Set(docs.map((d) => d.toolbox))].map((toolbox) => ({ toolbox, pages: docs.filter((d) => d.toolbox === toolbox).length, tools: [...new Set(docs.filter((d) => d.toolbox === toolbox).map((d) => d.tool))] }))
  return { reference: { site: 'https://payloadcms.com', contract: 'https://payloadcms.com/api/pages?limit=1&depth=0', shape: 'docs with layout blocks (blockType), meta (title, description), breadcrumbs: the site is what Payload computes; discovery reads it as the standard payload-site' }, origin, useCases: useCases.length, pages: docs.length, byUseCase: useCases, docs, collection: { slug: 'pages', totalDocs: docs.length, docs: docs.filter((d) => 'uuid' in d).map((d) => ({ id: d.uuid, title: d.title, slug: `/u/${d.uuid}`, layout: [{ blockType: 'qpu', tool: d.tool, uuid: d.uuid }], meta: { title: d.title, description: d.description }, breadcrumbs: [{ doc: d.uuid, url: `/u/${d.uuid}`, label: d.title }] })) } }
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
  'ENDPOINTS': { enactedBy: ['discover', 'extend'], how: 'the endpoints are doors: tools/list, the docket\'s four verbs, /.well-known/qpu.json' },
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
const configKinds = ['payload', 'wrangler', 'tenant', 'pwa', 'mcp', 'versions', 'migration', 'fullstack', 'api'] as const
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
export const configOf = (kind: ConfigKind, ctx: Context, p: { version?: string; description?: string; lastTag?: { version: string; tools: readonly string[] } } = {}) => {
  const hosts = Object.keys(TENANTS)
  switch (kind) {
    case 'payload': return { collections: [{ slug: 'pages', fields: ['lexical', 'tenant'], note: 'the plugins\' own collection; the fields are the plugins\'' }], plugins: PAYLOAD_PLUGINS.map((p) => ({ [p.name]: { package: p.pkg, ...p.options } })), combinations: 2 ** PAYLOAD_PLUGINS.length, combinationNote: 'every subset of the plugins is a configuration; the dashboard of this tool enumerates them by address' }
    case 'wrangler': return { $schema: 'node_modules/wrangler/config-schema.json', name: 'qpu', main: 'src/worker.ts', compatibility_date: '2026-10-01', workers_dev: true, assets: { directory: './docs/.vitepress/dist', binding: 'ASSETS', run_worker_first: true, not_found_handling: 'none' }, routes: hosts.map((h) => ({ pattern: h, custom_domain: true })), durable_objects: { bindings: [{ name: 'DOCKET', class_name: 'DocketObject' }] }, migrations: [{ tag: 'v1', new_sqlite_classes: ['DocketObject'] }], observability: { enabled: true } }
    case 'tenant': return { tenants: [...Object.values(TENANTS), 'ceci'].map(varsOf), mcpHostsDefault: DEFAULT_MCP_HOSTS }
    case 'pwa': { const accent = `hsl(${hueOf(KEY)} 62% 44%)`; return { name: '@uuidna/qpu', short_name: 'qpu', description: p.description ?? '', id: '/', start_url: '/', scope: '/', display: 'standalone', orientation: 'any', background_color: '#0b0b0f', theme_color: accent, lang: 'en', dir: 'ltr', categories: ['developer', 'education', 'productivity'], icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }, { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' }], shortcuts: [{ name: 'Every tool laid out', url: '/u/' + uuidOf('dashboard{}'), description: 'the dashboard index: every tool with the size of its space' }, { name: 'Examples', url: '/examples' }, { name: 'Stream', url: '/stream' }, { name: 'Readiness', url: '/readiness' }], related_applications: [], prefer_related_applications: false, license: 'CC-BY-NC-ND-4.0', version: p.version ?? null } }
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
          { method: 'GET', path: '/<uuid> or /u/<uuid>', takes: 'a content-addressed v8 UUID', answers: 'the block\'s page (the widget, prev and next, the theme from the UUID); immutable, ETag the address, 304 to If-None-Match', auth: 'none' },
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
import { Qpu } from './blocks/Qpu/config'

export const qpuBlocks = [Qpu] // beside the site's ${ws.blocks} blocks; referenced as 'qpu' in every layout
export const qpuPlugins = [
  searchPlugin({ collections: ['pages', 'posts'] }),
  multiTenantPlugin({ collections: { pages: {} }, tenantsSlug: 'tenants', userHasAccessToAllTenants: () => true } as never), // tenants: ${Object.values(TENANTS).join(', ')}
]
export const qpuEnv = {
  DATABASE_URI: "the RAID docket of the tenant (the mongo tool's language), as the site's MongoDB",
  PAYLOAD_SECRET: "the tenant's",
  R2: "Cloudflare R2 through the bindings MCP once the tenant's token opens it (the site's vercel-blob until then)",
  QPU_ORIGIN: "https://qpu.uuidna.com: the Worker that computes every qpu block and every /u/<uuid> page",
}
`
      const readme = `# QPU full stack

The source of payloadcms.com (MIT) is the full stack, forked under site/: its ${ws.collections} collections, ${ws.blocks} blocks, ${ws.globals} globals and ${ws.fields} fields kept. Applied: \`src/blocks/Qpu/config.ts\` (the qpu block, the shape every tools/call result carries in _meta.payload), registered in payload.config blocks and the pages layout; \`src/components/blocks/Qpu/index.tsx\` (the renderer: the page asks the Worker for the block and carries its widget), mapped in RenderBlocks; \`src/payload.qpu.config.ts\` (search and multi-tenant beside the site's four plugins, the database the RAID); \`src/collections/Tenants.ts\` (the multi-tenant plugin's own collection: the hosts that name the tenants). The catch-all makes prefixes useless: next.config rewrites any path that is a UUID to the Worker's page before the catch-all, and /mcp, /docket and /.well-known to the Worker. Deploy at Cloudflare beside this Worker; every step at whole uptime: configure { kind: 'migration' }.
`
      const notice = `# Licences in this fork

- The fork itself is the MIT-licensed source of payloadcms.com (Copyright (c) 2023 Payload); its LICENSE file stands whole and every file of the original stays under it.
- What QPU adds carries QPU's licence: ${LICENSE.attribution} (${LICENSE.deed}). Each added file names it in its first line. The added files: src/blocks/Qpu/config.ts, src/components/blocks/Qpu/index.tsx, src/payload.qpu.config.ts, src/collections/Tenants.ts, the rewrites in next.config.js, README.qpu.md and this notice.
- The two licences meet at the file boundary: MIT permits the fork and the additions; the additions' own terms apply to them alone; the combined site, served, carries both notices.
`
      return { repository: PAYLOAD_WEBSITE.repository, licence: PAYLOAD_WEBSITE.licence, qpuLicence: LICENSE.spdx, keep: { collections: ws.collectionList, blocks: ws.blockList, globals: ws.globalList, fields: ws.fieldList, plugins: [...PAYLOAD_WEBSITE.plugins] }, add: { block: 'qpu', plugins: ['search', 'multi-tenant', 'mcp'], database: 'db-mongodb over the RAID docket (the mongo tool\'s language)', storage: 'Cloudflare R2 through the bindings MCP (the tenant\'s token)', deploy: 'Cloudflare Workers beside this Worker (run_worker_first keeps /mcp, /docket, /.well-known)', tenants: Object.values(TENANTS) }, files: { 'fullstack/src/blocks/Qpu/config.ts': qpuBlock, 'fullstack/src/payload.qpu.config.ts': config, 'fullstack/README.md': readme, 'fullstack/NOTICE.qpu.md': notice }, steps: ['fork payloadcms/website (MIT) under site/ — done', 'register the qpu block (payload.config blocks, the pages layout, the RenderBlocks map under the @blocks alias), the tenants collection, spread qpuPlugins — done; the fork typechecks', 'rewrite any UUID path and /mcp, /docket, /.well-known to the Worker before the catch-all — done', 'point DATABASE_URI and PAYLOAD_SECRET at the tenant\'s (the build needs them beyond the tree)', 'deploy at Cloudflare beside this Worker; the gate decodes old and new as copies; the old site is removed only then'], note: 'generated text: a fork applies it; nothing here runs Payload' }
    }
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
  inputSchema: { type: 'object', properties: { kind: { type: 'string', enum: [...configKinds], description: 'omit for all' }, lastTag: { type: 'object', description: '{ version, tools }: the last tag and the tools it served, from the repository tool; with it, kind versions computes the next number' }, current: { type: 'string', description: 'the configuration text the client holds (JSON or JSONC): compared, the drift answered' }, version: { type: 'string' }, description: { type: 'string' }, env: { type: 'array', items: { type: 'string' }, description: 'the variable NAMES the client\'s environment holds: which of a tenant\'s are missing (values never travel)' }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (args.selftest) return { selftest: true, ...PAYLOAD.skill.selftest(ctx) }
    const p = { version: typeof args.version === 'string' ? args.version : undefined, description: typeof args.description === 'string' ? args.description : undefined, lastTag: args.lastTag && typeof args.lastTag === 'object' ? args.lastTag as { version: string; tools: string[] } : undefined }
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
    { id: 'configure-fullstack', tool: 'configure', arguments: { kind: 'fullstack' }, shows: 'QPU\'s full stack from the source of payloadcms.com (MIT): its twelve collections, thirty blocks, globals and fields kept, the qpu block added, search, multi-tenant and mcp added to its four plugins, the database the RAID, storage and deploy at Cloudflare; two source files and a README generated for the fork.', expect: (s) => (s.config.keep.blocks.length === 30 && s.config.add.block === 'qpu' && Object.keys(s.config.files).length === 4 && s.config.files['fullstack/NOTICE.qpu.md'].includes('MIT') && s.config.files['fullstack/src/blocks/Qpu/config.ts'].startsWith('// Tsvetan Rouschev, @uuidna/qpu, CC-BY-NC-ND-4.0') && s.config.files['fullstack/src/blocks/Qpu/config.ts'].includes("slug: 'qpu'") && s.config.steps.length === 5 && s.torus.closed ? null : `${s.config.keep?.blocks?.length} blocks`) },
    { id: 'configure-all', tool: 'configure', theorem: 'textbook_reflection_sums_to_ten', arguments: {}, shows: 'Every configuration MCP computes, tested around the torus: Payload\'s plugins, the Worker, the tenants\' variable names, the manifest, the registration, the versions, the migration, the full stack; each with its address, seed, reflection and trinity, every loop closed.', expect: (s) => (s.kinds === 9 && s.tested === 9 && s.closed === true && s.configs.every((c: { torus: { reflection: number; seed: number } }) => c.torus.seed + c.torus.reflection === 10) ? null : `${s.tested}/${s.kinds} closed`) },
    { id: 'configure-payload', tool: 'configure', theorem: 'textbook_plugin_combinations', arguments: { kind: 'payload' }, shows: 'Payload configured by MCP: eight default plugins over the one pages collection, the lexical block qpu with its UUID logic fields, the tenants in multi-tenant, 256 combinations.', expect: (s) => (s.config.plugins.length === 8 && s.config.combinations === 256 && s.config.collections.length === 1 && s.config.plugins[0].lexical.blocks[0] === 'qpu' && s.torus.closed ? null : `${s.config.plugins?.length} plugins`) },
    { id: 'configure-wrangler-drift', tool: 'configure', arguments: { kind: 'wrangler', current: '{ "name": "qpu", "main": "src/worker.ts", "routes": [] }' }, shows: 'The Worker configuration compared to a text a client holds: every differing path is a lead, nothing is rewritten by the tool.', expect: (s) => (s.driftCount >= 5 && s.drift.includes('routes') && s.leads.every((l: { status: string }) => l.status === 'open') ? null : `${s.driftCount} drift`) },
    { id: 'configure-tenant-missing', tool: 'configure', arguments: { kind: 'tenant', env: ['QPU_WRITE_TOKEN_UUIDNA', 'QPU_ADMIN_TOKEN_UUIDNA', 'QPU_DATA_KEY'] }, shows: 'Each tenant\'s variable names and which an environment lacks: Stripe keys and the Cloudflare MCP tokens are the operator\'s to set; values never travel.', expect: (s) => (s.missing.length === 3 && s.missing[0].tenant === 'uuidna' && s.missing[0].secrets.includes('STRIPE_SECRET_KEY_UUIDNA') && s.missing[0].secrets.includes('QPU_MCP_TOKEN_BINDINGS_MCP_CLOUDFLARE_COM_UUIDNA') && !s.missing[0].secrets.includes('QPU_WRITE_TOKEN_UUIDNA') ? null : JSON.stringify(s.missing?.[0]).slice(0, 120)) },
    { id: 'payload-theorems-plan', tool: 'payload', arguments: { theorems: true, payloadUrl: 'https://payload.example' }, shows: 'The textbook\'s axioms replaced by theorems through the Payload MCP plugin, as a client: the endpoint, the authorization the tenant sends, the tools/list request, and the steps — the find and update doors picked by what they take, every qpu block without a theorem given the kernel-accepted key its example names.', expect: (s) => (s.phase === 'plan' && s.endpoint === 'https://payload.example/api/mcp' && s.requestList[0].body.method === 'tools/list' && s.theorems >= 10 && s.examplesBacked >= 10 && s.steps.length === 4 ? null : `${s.phase} ${s.endpoint}`) },
    { id: 'payload-theorems-update', tool: 'payload', arguments: { theorems: true, payloadUrl: 'https://payload.example', answers: { list: JSON.stringify({ jsonrpc: '2.0', id: 1, result: { tools: [{ name: 'findDocuments', inputSchema: { properties: { slug: {}, where: {}, limit: {} } } }, { name: 'updateDocument', inputSchema: { properties: { slug: {}, id: {}, data: {} } } }] } }), found: JSON.stringify({ jsonrpc: '2.0', id: 2, result: { structuredContent: { docs: [{ id: 'p1', layout: [{ blockType: 'qpu', tool: 'configure', arguments: { kind: 'payload' }, theorem: null }, { blockType: 'cta' }] }, { id: 'p2', layout: [{ blockType: 'qpu', tool: 'clay', arguments: { name: 'relation_15' }, theorem: 'relation_15' }] }] } } }) } }, shows: 'With the Payload MCP\'s answers: the find and update doors recognised by what they take, two pages read, one qpu block without a theorem given textbook_plugin_combinations (the example configure-payload), one already naming its theorem left as it is; one update request emitted.', expect: (s) => (s.phase === 'update' && s.findDoor === 'findDocuments' && s.updateDoor === 'updateDocument' && s.pages === 2 && s.qpuBlocks === 2 && s.axioms === 1 && s.replaced === 1 && s.requestList[0].body.params.arguments.data.layout[0].theorem === 'textbook_plugin_combinations' ? null : `${s.phase} ${s.replaced} ${JSON.stringify(s.requestList?.[0]?.body?.params?.arguments?.data).slice(0, 120)}`) },
    { id: 'payload-website', tool: 'payload', theorem: 'textbook_website_plugins_partition', arguments: { website: WEBSITE_FIXTURE, liveBlockTypes: ['contentGrid', 'cta'] }, shows: 'The source of payloadcms.com (github.com/payloadcms/website, MIT) read as a tree: twelve collections, thirty blocks, seven globals, ten fields, its own opsCounter plugin, and the four default plugins its config mounts; the live page\'s block types contentGrid and cta have their blocks in the source — the site is what Payload computes, verified.', expect: (s) => (s.phase === 'website' && s.collections === 12 && s.blocks === 30 && s.globals === 5 && s.agrees === true && s.pluginsShared.length === 4 && s.pluginsOnlyHere.includes('mcp') ? null : `${s.collections} collections, ${s.blocks} blocks, ${s.globals} globals, agrees ${s.agrees}, shared ${s.pluginsShared?.length}`) },
    { id: 'payload-skills', tool: 'payload', theorem: 'textbook_skills_documents', arguments: { skills: SKILLS_FIXTURE }, shows: 'Payload\'s skills for agents (github.com/payloadcms/skills) read as a tree: two skills, payload and cms-migration, their fourteen references, each mapped to the tool of this tree that enacts it; names and paths as facts, no text carried.', expect: (s) => (s.phase === 'skills' && s.skills === 2 && s.references === 12 && s.unmapped.length === 0 && s.catalogue.every((k: { enactedBy: string[] }) => k.enactedBy.length > 0) ? null : `${s.skills} skills, ${s.references} refs, unmapped ${s.unmapped?.join(',')}`) },
    { id: 'payload-site', tool: 'payload', arguments: { site: true }, shows: 'The site as its own use cases, as payloadcms.com is built of what Payload computes: every toolbox a use case, every example a page document in Payload\'s pages shape (layout blocks, meta, breadcrumbs) at its live /u address.', expect: (s) => (s.useCases >= 9 && s.pages >= 40 && s.collection.slug === 'pages' && s.collection.docs.every((d: { layout: { blockType: string }[]; meta: { title: string }; breadcrumbs: unknown[] }) => d.layout[0]!.blockType === 'qpu' && d.meta.title && d.breadcrumbs.length === 1) && s.reference.site === 'https://payloadcms.com' ? null : `${s.useCases} use cases, ${s.pages} pages`) },
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
      check('configure:payload-plugins', pl.plugins.length === 8 && pl.combinations === 256 && pl.plugins.some((p) => 'multi-tenant' in p), 'the eight default plugins, 256 combinations, the tenants in multi-tenant')
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
      return { passed: checks.every((c) => c.passed), checks }
    },
  },
}
