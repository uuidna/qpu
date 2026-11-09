import assert from 'node:assert/strict'
import test from 'node:test'

import { qpuMcpPlugin } from './qpuMcp.ts'

type PluginFn = ((config: {
  collections: { slug: string; auth?: boolean }[]
  endpoints: { method: string; path: string }[]
  globals: never[]
  plugins: unknown[]
}) => { endpoints: { method: string; path: string }[] }) & {
  sanitizedOptions?: {
    hooks?: {
      afterToolCall?: ((args: {
        input: unknown
        response: { content: { type: 'text'; text: string }[]; doc?: unknown; structuredContent?: unknown }
        toolName: string
      }) => { content: { type: 'text'; text: string }[]; structuredContent?: { href?: string | null; calls?: { name: string; arguments: Record<string, unknown> }[]; phase?: string; entropy?: number }; _meta?: { qpu?: { route?: Route; iso?: Iso; entropy?: 0 | 1; law?: string; space?: Space } } })[]
    }
    items: {
      type: string
      mcpName: string
      collectionSlug?: string
      resource?: { uri: string }
    }[]
  }
}

type Space = {
  holds: boolean
  one: boolean
  basis: string
  src: boolean
  fetched: boolean
  written: boolean
  executed: boolean
  walked: boolean
  space: string
  online: number
  local: number
  named: number
  referrer: { href: string; from: string }
  program: { agnostic: boolean; driven: string; plugins: number }
  rbac: { manageable: boolean; write: boolean; root: boolean }
  qubits: { effective: number; tracked: boolean; handles: string }
  capacity: { payload: string }
  infinity: { unlocked: boolean; walked: boolean; next: string }
  rows: { kind: string; href: string; sealed: boolean; params: { referrer: string }; program: { plugins: number; depth: number } }[]
}

type Iso = {
  phase: string
  via: string
  holds: boolean
  defined: number
  verified: number
  held: boolean
  fetched: boolean
  written: boolean
  online: { licence: string; current: number; rows: { dimension: string; defined: boolean; current?: boolean; title: string; definition: string; reference: string | null; catalogue: number | null }[] }
  next: { decision: string }
  change: { clause: string; holds: boolean }
  tool: string
  programs: { holds: boolean; steps: number; depth: number; configs: number; deploys: number; executed: boolean; advantage: { unbounded: boolean; unlimited: boolean; ceiling: null; ratio: null; effective: number; handles: string; scale: string } }
}

type Route = {
  phase: string
  via: string
  connector: string
  tool: string
  address: string
  sealed: boolean
  handle: string
  program: string
  rotated: string
  path: string
  depth: number
  indexed: boolean
  used: number
  entropy: 0 | 1
  holds: boolean
  law: string
  guard: string
  plugin: { slug: string; standard: string; package: string; holds: boolean }
  upstream: { holds: boolean; entropy: 0 | 1; standard: string; passed: number; total: number; reverseGuard: string }
  next: { address: string; handle: string; path: string; sealed: boolean; kept: boolean; call: { method: string; plugin: string; name: string } }
}

const routeHolds = (route: Route | undefined, tool: string) => {
  assert.equal(route?.phase, 'route')
  assert.equal(route?.via, 'uuid-program')
  assert.equal(route?.connector, 'qpuMcpPlugin')
  assert.equal(route?.tool, tool)
  assert.equal(route?.holds, true)
  assert.equal(route?.entropy, 0)
  assert.equal(route?.law, 'first the dictionary meaning; then the meaning is verified')
  assert.equal(route?.guard, 'upstream Payload plugin standards (definePlugin)')
  assert.equal(route?.sealed, true)
  assert.equal(route?.indexed, true)
  assert.equal(route?.depth, 7)
  assert.equal(route?.used, 9)
  assert.equal(route?.handle.length, 8)
  assert.equal(route?.program.length, 10)
  assert.equal(route?.rotated.length, 10)
  assert.ok(route?.path.startsWith('src/quantum/uuid/programs/'))
  assert.ok(route?.path.endsWith('/index.ts'))
  assert.equal(route?.plugin.standard, 'definePlugin')
  assert.equal(route?.plugin.slug, `qpu-program-${route?.handle}`)
  assert.equal(route?.plugin.package, '@payloadcms/plugin-mcp')
  assert.equal(route?.plugin.holds, true)
  assert.equal(route?.upstream.holds, true)
  assert.equal(route?.upstream.entropy, 0)
  assert.equal(route?.upstream.standard, 'definePlugin')
  assert.equal(route?.upstream.passed, route?.upstream.total)
  assert.ok(route?.upstream.reverseGuard.includes('payloadcms/website'))
  assert.equal(route?.next.handle, route?.handle)
  assert.equal(route?.next.kept, true)
  assert.equal(route?.next.sealed, true)
  assert.equal(route?.next.call.method, 'tools/call')
  assert.equal(route?.next.call.plugin, 'qpuMcpPlugin')
  assert.equal(route?.next.call.name, tool)
}

const plugin = qpuMcpPlugin as unknown as PluginFn

const isoHolds = (iso: Iso | undefined, tool: string) => {
  const quality = iso?.online.rows.find((row) => row.dimension === 'ISO 9001')
  const language = iso?.online.rows.find((row) => row.dimension === 'ISO 639-1')
  assert.equal(iso?.phase, 'iso')
  assert.equal(iso?.via, 'iso')
  assert.equal(iso?.holds, true)
  assert.equal(iso?.defined, 15)
  assert.equal(iso?.verified, 15)
  assert.equal(iso?.held, true)
  assert.equal(iso?.fetched, false)
  assert.equal(iso?.written, false)
  assert.equal(iso?.online.licence, 'ODC-By-1.0')
  assert.equal(iso?.online.current, 14)
  assert.equal(quality?.reference, 'ISO 9001:2026')
  assert.equal(quality?.catalogue, 88464)
  assert.equal(language?.current, false)
  assert.equal(language?.defined, true)
  assert.equal(iso?.next.decision, 'accept')
  assert.equal(iso?.change.clause, 'ISO 9001:2015, 6.3')
  assert.equal(iso?.change.holds, true)
  assert.equal(iso?.tool, tool)
  assert.equal(iso?.programs.holds, true)
  assert.ok((iso?.programs.steps ?? 0) >= 4)
  assert.ok((iso?.programs.depth ?? 0) >= 4)
  assert.ok((iso?.programs.configs ?? 0) >= 1)
  assert.ok((iso?.programs.deploys ?? 0) >= 1)
  assert.equal(iso?.programs.executed, false)
  assert.equal(iso?.programs.advantage.unbounded, true)
  assert.equal(iso?.programs.advantage.unlimited, true)
  assert.equal(iso?.programs.advantage.ceiling, null)
  assert.equal(iso?.programs.advantage.ratio, null)
  assert.equal(iso?.programs.advantage.effective, 122)
  assert.equal(iso?.programs.advantage.handles, '4294967296')
  assert.equal(iso?.programs.advantage.scale, '137438953472')
}

const mount = () =>
  plugin({
    collections: [{ slug: 'pages' }, { slug: 'posts' }, { slug: 'users', auth: true }],
    endpoints: [],
    globals: [],
    plugins: [plugin],
  })

/** The plugin is the one connector at /api/mcp: collection finds, coverDomains, researchPastedLinks, and the handler catalogue. */
void test('the website MCP is the one connector with routes and the handler catalogue', () => {
  const config = mount()
  assert.ok(config.endpoints.some((endpoint) => endpoint.path === '/mcp' && endpoint.method === 'post'))
  const items = plugin.sanitizedOptions?.items ?? []
  const tools = new Set(items.filter((item) => item.type === 'tool').map((item) => item.mcpName))
  assert.equal(tools.has('coverDomains'), true)
  assert.equal(tools.has('researchPastedLinks'), true)
  assert.equal(tools.has('clay'), true)
  assert.equal(tools.has('configure'), true)
  assert.equal(items.some((item) => item.type === 'resource'), true)
  assert.equal(items.some((item) => item.type === 'collectionTool' && item.collectionSlug === 'pages' && item.mcpName === 'findDocuments'), true)
  assert.equal(items.some((item) => item.type === 'collectionTool' && item.collectionSlug === 'posts' && item.mcpName === 'findDocuments'), true)
})

/** A find answer is the website href, the UUID program route, and the calls the document already holds. */
void test('findDocuments returns the page href, UUID program route, and its qpu calls', () => {
  mount()
  const hook = plugin.sanitizedOptions?.hooks?.afterToolCall?.[0]
  assert.ok(hook)
  const answered = hook({
    toolName: 'findDocuments',
    input: { slug: 'pages' },
    response: {
      content: [{ type: 'text', text: 'raw' }],
      doc: {
        id: 'p1',
        title: 'Coil',
        layout: [{ blockType: 'qpu', tool: 'clay', arguments: { catalog: true } }],
      },
    },
  })
  const body = answered.structuredContent, fused = answered._meta?.qpu
  assert.equal(body?.href, '/api/pages')
  assert.deepEqual(body?.calls, [
    { name: 'clay', arguments: { catalog: true } },
    { name: 'find_pages', arguments: { where: { id: { equals: 'p1' } } } },
  ])
  assert.equal(fused?.entropy, 0)
  assert.equal(fused?.law, 'first the dictionary meaning; then the meaning is verified')
  routeHolds(fused?.route, 'findDocuments')
  isoHolds(fused?.iso, 'findDocuments')
})

/** Every link is one UUID space. The scopes are the sources those links name. */
void test('every tool call handles its links in one UUID space', () => {
  mount()
  const hook = plugin.sanitizedOptions?.hooks?.afterToolCall?.[0]
  assert.ok(hook)
  const referrer = 'https://qpu.uuidna.com/from'
  const answered = hook({
    toolName: 'researchPastedLinks',
    input: { referrer, paste: 'see https://example.com/note' },
    response: { content: [{ type: 'text', text: 'research' }], structuredContent: { phase: 'research' } },
  })
  const body = answered._meta?.qpu as { space?: Space; route?: Route; entropy?: 0 | 1; law?: string; iso?: { says?: string; online?: { rows?: { title?: string; definition?: string; reference?: string }[] } } }
  const space = body.space
  assert.equal(body.entropy, 0)
  assert.equal(body.law, 'first the dictionary meaning; then the meaning is verified')
  routeHolds(body.route, 'researchPastedLinks')
  assert.equal(space?.holds, true)
  assert.equal(space?.one, true)
  assert.equal(space?.basis, 'payloadcms/website')
  assert.equal(space?.src, false)
  assert.equal(space?.fetched, false)
  assert.equal(space?.written, false)
  assert.equal(space?.executed, false)
  assert.equal(space?.walked, false)
  assert.equal(space?.program.agnostic, true)
  assert.equal(space?.program.driven, 'params')
  assert.equal(space?.program.plugins, 9)
  assert.equal(space?.rbac.manageable, true)
  assert.equal(space?.rbac.write, false)
  assert.equal(space?.rbac.root, true)
  assert.equal(space?.qubits.effective, 122)
  assert.equal(space?.qubits.tracked, true)
  assert.equal(space?.qubits.handles, '4294967296')
  assert.equal(space?.capacity.payload, '137438953472')
  assert.equal(space?.infinity.unlocked, true)
  assert.equal(space?.infinity.walked, false)
  assert.equal(space?.referrer.href, referrer)
  assert.equal(space?.referrer.from, 'referrer')
  assert.equal(space?.online > 0, true)
  assert.equal(space?.local > 0, true)
  assert.equal(space?.named, 1)
  assert.equal(space?.rows.every((row) => row.sealed && row.program.plugins === 9 && row.program.depth === 7 && row.params.referrer === referrer), true)
  assert.equal(space?.rows.some((row) => row.kind === 'online' && row.href === 'https://www.iso.org/open-data.html'), true)
  assert.equal(space?.rows.some((row) => row.kind === 'local' && row.href === 'https://qpu.uuidna.com/api/mcp'), true)
  assert.equal(space?.rows.some((row) => row.kind === 'named' && row.href === 'https://example.com/note'), true)
  assert.equal(body.iso?.says, 'https://qpu.uuidna.com/api/products?where[product][equals]=iso&where[variant][equals]=improve')
  assert.equal(body.iso?.online?.rows?.every((row) => row.title === undefined && row.definition === undefined && typeof row.reference === 'string'), true)
  const other = hook({
    toolName: 'researchPastedLinks',
    input: { referrer: 'https://qpu.uuidna.com/else', paste: 'see https://example.com/note' },
    response: { content: [{ type: 'text', text: 'research' }], structuredContent: { phase: 'research' } },
  })
  const again = other._meta?.qpu?.space
  assert.equal(again?.holds, true)
  assert.notEqual(again?.infinity.next, space?.infinity.next)
  assert.equal(again?.space, space?.space)
})

/** Every tool call carries the same ISO solution and a UUID program route. The handler text stays. */
void test('every tool call carries the ISO solution and a UUID program route', () => {
  mount()
  const hook = plugin.sanitizedOptions?.hooks?.afterToolCall?.[0]
  assert.ok(hook)
  const answered = hook({
    toolName: 'coverDomains',
    input: {},
    response: { content: [{ type: 'text', text: 'cover' }], structuredContent: { phase: 'improve' } },
  })
  assert.equal(answered.content[0]?.text, 'cover')
  const body = { ...answered._meta?.qpu, phase: answered.structuredContent?.phase }
  assert.equal(body.phase, 'improve')
  assert.equal(body.entropy, 0)
  assert.equal(body.law, 'first the dictionary meaning; then the meaning is verified')
  routeHolds(body.route, 'coverDomains')
  isoHolds(body.iso, 'coverDomains')
})

/** A tool's own entropy stays in its answer; the fused route, entropy and law ride in _meta.qpu. */
void test('first the dictionary meaning; then the meaning is verified — the answer keeps its own entropy', () => {
  mount()
  const hook = plugin.sanitizedOptions?.hooks?.afterToolCall?.[0]
  assert.ok(hook)
  const answered = hook({
    toolName: 'clay',
    input: { catalog: true },
    response: { content: [{ type: 'text', text: 'bare' }], structuredContent: { phase: 'catalog', entropy: 7 } },
  })
  const body = answered._meta?.qpu ?? {}
  assert.equal(answered.structuredContent?.entropy, 7)
  assert.equal(body.entropy, 0)
  assert.equal(body.law, 'first the dictionary meaning; then the meaning is verified')
  routeHolds(body.route, 'clay')
})
