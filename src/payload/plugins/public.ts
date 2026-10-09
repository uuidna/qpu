import { blocks } from '../../blocks/index.js'
import { CLOUDFLARE_PLUGINS } from '../../deployment/payload-cloudflare.js'
import { CloudFormulas } from '../../families/cloud/index.js'
import { CombinatoricsFormulas } from '../../families/combinatorics/index.js'
import { LawFormulas } from '../../families/law/index.js'
import { PublishingFormulas } from '../../families/publishing/index.js'
import { RuleFormulas } from '../../families/rule/index.js'
import { WaveFormulas } from '../../families/wave/index.js'
import { customOf } from '../../fields/blockFields.js'
import {
  MCP_EXTENSIONS,
  SERVED,
  badRequest,
  found,
  headers,
  isUnknownTool,
  lost,
  n,
  pureArgs,
  pureTools,
  qpuCiteOf,
  qpuCssOf,
  qpuFacesOf,
  qpuHexFamiliesOf,
  qpuMcpCallOf,
  qpuMcpDiscoverOf,
  qpuMcpOf,
  qpuMcpToolsListOf,
  qpuNetworkToolsOf,
  qpuStepsOf,
  rpcCodes,
  rpcErrorOf,
  rpcMethods,
  sandboxEpoch,
  seed,
  servedMemo,
  servedOf,
  unit,
  type QpuEnv,
} from '../../quantum/processing/unit/index.js'
import { qpuMachinesHolds, qpuMachinesOf } from '../../quantum/processing/unit/zeropage.js'
import { openMathScaleOf } from './clay.js'
import { usageBillOf } from './billing.js'
import { accessModePlugin } from './access-mode.js'
import { ecommerceCatalogPlugin } from './ecommerce.js'
import { examPlugin } from './exam.js'
import { nativeAdaptersPlugin } from './native-adapters.js'
import { gateCourtPlugin } from './gate-court.js'
import { goalPlugin } from './goal.js'
import { pointPlugin } from './point.js'
import { tenantsPlugin } from './tenants.js'
import { wavePlugin } from './wave.js'
import { observabilityPlugin } from './observability.js'
import { tokensPlugin } from './tokens.js'
import { chatSearchPlugin } from './chat-search.js'
import { cloudflareAccountPlugin } from './cloudflare-account.js'
import type { QpuPlugin } from './surface.js'

/** The plugin axis length the combination key already multiplies. Not a variant count. */
export const pluginAxisLengthOf = () => CLOUDFLARE_PLUGINS.length

/** Layout blocks the seed has not already placed on home, search, or the license page. */
export const unpagedLayoutBlocksOf = () =>
  blocks.filter((b) => b.admin?.group === 'Layout' && !(customOf(b).needs?.length) && !['search', 'products', 'hero'].includes(b.slug))

const readingOf = (formula: string, row: { hex?: string; value: number; holds: boolean }, params: readonly number[]) => ({
  formula,
  params: [...params],
  hex: row.hex ?? null,
  value: row.value,
  holds: row.holds,
})

/**
 * A sale on a uuidna.com host pays the author's royalty. publishing.royalty(sales, rate) = ⌊sales · rate / 100⌋.
 * Missing rate → formula holds false (gated). Catalogue price is court-tried priceRelationOf, not priceInUSD.
 * Licence stays CC-BY-NC-ND-4.0.
 */
export const saleRoyaltyOf = (host = unit.host) => {
  const onUuidna = host === 'uuidna.com' || host.endsWith('.uuidna.com')
  const sales = null
  const rate = null
  if (!onUuidna) {
    return {
      name: 'publishing.royalty' as const,
      host,
      called: false as const,
      params: { sales, rate },
      missing: 'rate' as const,
      value: null,
      holds: false as const,
      uuid: null,
    }
  }
  const row = PublishingFormulas.royalty(sales as unknown as number, rate as unknown as number)
  return {
    name: 'publishing.royalty' as const,
    formula: row.formula,
    host,
    called: true as const,
    params: { sales, rate },
    missing: 'rate' as const,
    value: Number.isFinite(row.value) ? row.value : null,
    holds: row.holds === true,
    uuid: row.hex ?? null,
  }
}

/** What the main license and law.reviewed(0) already permit a public user to do. confirmed stays 0. */
export const licenseManageOf = () => {
  const reviewed = LawFormulas.reviewed(0)
  const lawful = LawFormulas.lawful(0)
  return {
    kind: 'license' as const,
    spdx: 'CC-BY-NC-ND-4.0' as const,
    file: 'LICENSE' as const,
    deed: 'https://creativecommons.org/licenses/by-nc-nd/4.0/' as const,
    share: 'unchanged' as const,
    commercial: '/license' as const,
    reviewed: { ...readingOf('law.reviewed', reviewed, [0]), lead: true as const, note: 'not advice' as const },
    lawful: readingOf('law.lawful', lawful, [0]),
    citation: openMathScaleOf().citation,
    bill: usageBillOf(),
    royalty: saleRoyaltyOf(),
  }
}

/**
 * No registered formula is a product-variant. The absence is the lead.
 * combinatorics.binomial of the plugin axis is the fused count. A variant factor is not applied.
 * Payload ecommerce catalog mapping (formulatedProductVariantOf) is a separate sale surface —
 * it does not mint the hex and does not flip this lead or set holds true.
 */
export const variantLeadOf = async () => {
  const { formulatedProductVariantOf } = await import('./ecommerce.js')
  const axis = pluginAxisLengthOf()
  const binomial = CombinatoricsFormulas.binomial(axis)
  const faces = qpuFacesOf().faces
  const registered = [...qpuHexFamiliesOf()].flatMap(([family, fs]) => fs.map((f) => ({ family, name: f.name, arity: f.arity })))
  const product = registered.filter((f) => f.name === 'product')
  const variant = registered.filter((f) => f.name.toLowerCase().includes('variant'))
  const paired = registered.filter((f) => f.name.toLowerCase().includes('product') && f.name.toLowerCase().includes('variant'))
  const mapped = formulatedProductVariantOf()
  return {
    kind: 'product-variant-lead' as const,
    lead: paired.length === 0,
    hex: null as null,
    value: null as null,
    holds: false as const,
    absent:
      'src/families/ecommerce/index.ts has no variant formula. No registered formula name contains both product and variant. Sale surface is Payload products/variants + formulatedCatalogOf — that mapping does not mint this hex.',
    product,
    variant,
    paired: paired.length,
    mapped,
    combinatorics: {
      ...readingOf('combinatorics.binomial', binomial, [axis]),
      faces,
      variantFactor: null as null,
    },
  }
}

/** Previous page is the request referer. Next page is the lattice step. The counts are the plugin axis, the face slice, and waves of that slice. */
export const navigationOf = async () => {
  const axis = pluginAxisLengthOf()
  const faces = qpuFacesOf().faces
  const binomial = CombinatoricsFormulas.binomial(axis)
  const slice = RuleFormulas.slice()
  const cap = RuleFormulas.cap()
  const waves = WaveFormulas.waves(faces)
  const agents = WaveFormulas.agents(faces)
  const saved = WaveFormulas.saved(faces)
  const steps = qpuStepsOf()
  return {
    page: '/' as const,
    previous: { field: null as null, file: 'src/collections/Pages.ts' as const },
    next: {
      path: steps.next.door.path,
      node: steps.next.node,
      face: steps.next.face,
      tool: steps.next.door.tool,
      holds: steps.holds === true,
    },
    binomial: readingOf('combinatorics.binomial', binomial, [axis]),
    slice: readingOf('rule.slice', slice, []),
    cap: readingOf('rule.cap', cap, []),
    waves: readingOf('wave.waves', waves, [faces]),
    agents: readingOf('wave.agents', agents, [faces]),
    saved: readingOf('wave.saved', saved, [faces]),
    pieces: [
      { piece: 'breadcrumb' as const, file: 'src/components/ui/breadcrumb.tsx', renders: 'src/components/Public/index.tsx' },
      { piece: 'doc-breadcrumb' as const, file: 'src/components/Doc/index.tsx', renders: 'src/components/Doc/index.tsx', referer: null as null, next: null as null },
      { piece: 'program-breadcrumb' as const, file: 'src/components/Program/index.tsx', renders: 'src/components/Program/index.tsx', referer: null as null, next: null as null },
      { piece: 'header' as const, file: 'src/components/Header/index.tsx', referer: null as null, next: null as null },
      { piece: 'footer' as const, file: 'src/components/Footer/index.tsx', referer: null as null, next: null as null },
      { piece: 'pager' as const, file: 'src/families/pagination/index.ts', referer: null as null, next: null as null },
      { piece: 'vitepress' as const, file: 'src/deployment/payload-cloudflare.ts', referer: null as null, next: null as null },
      { piece: 'shared-config' as const, file: 'src/mcp/families.ts', referer: null as null, next: null as null },
    ],
  }
}

/**
 * The network the tree already has: net_* doors, the machine list, the unit host.
 * qpuNetworkMcpOf has no slot for a machine row. That absence is the lead.
 * Scale is cloud.scale, and only when perNode > 0. The call is the one cloud/test.ts already makes.
 */
export const networkMachineOf = () => {
  const machines = qpuMachinesOf()
  const row = machines.rows[0]
  const load = 100
  const perNode = 30
  const scale = perNode > 0 ? CloudFormulas.scale(load, perNode) : undefined
  const here = row?.name === 'Pravets 8M' && row.when === 'here'
  return {
    kind: 'network-machine' as const,
    file: 'src/quantum/processing/unit/index.ts' as const,
    catalog: 'qpuNetworkMcpOf' as const,
    host: unit.host,
    doors: qpuNetworkToolsOf().map((tool) => tool.name),
    machineList: 'src/quantum/processing/unit/zeropage.ts' as const,
    lead: true as const,
    absent: 'src/quantum/processing/unit/index.ts qpuNetworkMcpOf has hop, when, lanes, routes, channels, and holds. qpuComputerOf network has kind, href, hop, and holds. Neither has a slot for a machine row. The net_* doors stay on that catalog. The machine list stays in src/quantum/processing/unit/zeropage.ts. unit.host stays the unit host. No second network is added.',
    index: 0 as const,
    pravets: here && row
      ? {
          name: row.name,
          when: row.when,
          wordBits: row.wordBits,
          spec: row.spec,
          oneRegisterFidelity: row.oneRegisterFidelity,
          ...(row.note ? { note: row.note } : {}),
          lead: row.lead,
          registerNext: row.registerNext,
        }
      : null,
    machinesHold: qpuMachinesHolds(machines),
    scale: scale
      ? { ...readingOf('cloud.scale', scale, [load, perNode]), condition: 'perNode > 0' as const }
      : null,
  }
}

/** Doors the unit already lists. Descriptions are not copied onto the page. */
export const doorsOf = async () => {
  try {
    const { qpuMcpDoorsOf } = await import('../../quantum/processing/unit/mcp.js')
    const d = qpuMcpDoorsOf()
    return {
      doors: d.doors.map((row) => ({ name: row.name, kind: row.kind })),
      formulas: d.formulas.length,
      holds: d.holds === true,
      absent: null as string | null,
    }
  } catch (e) {
    return {
      doors: [] as { name: string; kind: string }[],
      formulas: 0,
      holds: false,
      absent: `src/quantum/processing/unit/mcp.ts qpuMcpDoorsOf did not answer: ${e instanceof Error ? e.message : String(e)}`,
    }
  }
}

const hrefOf = (slug: string): string => {
  if (slug === 'hero') return '/'
  if (slug === 'products' || slug === 'form') return '/license'
  if (slug === 'receipt') return '/receipts'
  return `/${slug}`
}

/** Every block folder registered in src/blocks and src/components/blocks. */
export const blockReachOf = () =>
  blocks.map((b) => {
    const needs = [...(customOf(b).needs ?? [])]
    const placed = needs.length === 0 || b.slug === 'form' || b.slug === 'program' || b.slug === 'receipt'
    return {
      slug: b.slug,
      group: String(b.admin?.group ?? ''),
      description: customOf(b).description,
      href: hrefOf(b.slug),
      needs,
      placed,
      registered: 'src/blocks/index.ts' as const,
      renders: 'src/components/blocks/index.ts' as const,
    }
  })

/** Form-builder field block types from src/payload-types.ts, and whether CMSForm draws them. */
export const formFieldsOf = () => [
  { blockType: 'checkbox', file: 'src/components/CMSForm/index.tsx', renders: true, absent: null },
  { blockType: 'country', file: 'src/payload-types.ts', renders: false, absent: 'Country has no options list in this tree' },
  { blockType: 'email', file: 'src/components/CMSForm/index.tsx', renders: true, absent: null },
  { blockType: 'message', file: 'src/components/CMSForm/index.tsx', renders: true, absent: null },
  { blockType: 'number', file: 'src/components/CMSForm/index.tsx', renders: true, absent: null },
  { blockType: 'select', file: 'src/components/CMSForm/index.tsx', renders: true, absent: null },
  { blockType: 'state', file: 'src/payload-types.ts', renders: false, absent: 'State has no options list in this tree' },
  { blockType: 'text', file: 'src/components/CMSForm/index.tsx', renders: true, absent: null },
  { blockType: 'textarea', file: 'src/components/CMSForm/index.tsx', renders: true, absent: null },
] as const

/** Components under src/components that are not blocks. A file no page imports stays a lead. */
export const componentsOf = () => [
  { file: 'src/components/RenderBlocks/index.tsx', renders: 'a page layout', page: true },
  { file: 'src/components/BlockWrapper/index.tsx', renders: 'heading, intro, anchor', page: true },
  { file: 'src/components/CMSForm/index.tsx', renders: 'a form-builder form', page: true },
  { file: 'src/components/CMSLink/index.tsx', renders: 'a link or a row of links', page: true },
  { file: 'src/components/Header/index.tsx', renders: 'the site header', page: true },
  { file: 'src/components/Footer/index.tsx', renders: 'the site footer', page: true },
  { file: 'src/components/ThemeSelector/index.tsx', renders: 'the theme control in the header', page: true },
  { file: 'src/components/Doc/index.tsx', renders: 'a doc', page: true },
  { file: 'src/components/Family/index.tsx', renders: 'a formula family', page: true },
  { file: 'src/components/Program/index.tsx', renders: 'a hex run', page: true },
  { file: 'src/components/Relations/index.tsx', renders: 'discovery relations, identities, seals', page: true },
  { file: 'src/components/LiveTable/index.tsx', renders: 'live source rows', page: true },
  { file: 'src/components/blocks/_generic.tsx', renders: 'the shared block vocabulary', page: true },
  { file: 'src/components/Public/index.tsx', renders: 'license, variant, doors, network, access console, block reach', page: true },
  { file: 'src/components/Public/AccessPanel.tsx', renders: 'chmod access console on the public surface', page: true },
  { file: 'src/components/Public/ConnectorUsePanel.tsx', renders: 'connector { use: true } agent map — listed bill vs fused routes', page: true },
  { file: 'src/components/Public/SealWavePanel.tsx', renders: 'clay seal-wave console via connector pass/seal', page: true },
  { file: 'src/components/Public/NativeAdaptersPanel.tsx', renders: 'native compute job console — vendor submit + priceRelation ticket', page: true },
  { file: 'src/components/Public/ObservePanel.tsx', renders: 'connector { observe: true } / { verbosity } receipt observability console', page: true },
  { file: 'src/components/Public/PrintChipsPanel.tsx', renders: 'connector { chips: true } ray-layered chip print + crypto license imprint', page: true },
  { file: 'src/components/ui/badge.tsx', renders: 'a badge', page: true },
  { file: 'src/components/ui/breadcrumb.tsx', renders: 'a breadcrumb', page: true },
  { file: 'src/components/ui/button.tsx', renders: 'a button', page: true },
  { file: 'src/components/ui/card.tsx', renders: 'a card', page: true },
  { file: 'src/components/ui/input.tsx', renders: 'an input', page: true },
  { file: 'src/components/ui/label.tsx', renders: 'a label', page: true },
  { file: 'src/components/ui/separator.tsx', renders: 'a separator', page: false },
  { file: 'src/components/ui/table.tsx', renders: 'a table', page: true },
  { file: 'src/components/ui/tabs.tsx', renders: 'tabs', page: false },
  { file: 'src/components/ui/textarea.tsx', renders: 'a textarea', page: true },
] as const

/** Access console seed: public r-x (mode 5, who other) + product enum map from formulated catalog. */
export const accessSurfaceOf = async () => {
  const { modeAccessOf, unixModeEnumsOf } = await import('./access-mode.js')
  const { formulatedCatalogOf } = await import('./ecommerce.js')
  const reading = modeAccessOf({ mode: 5, who: 'other' })
  const enums = unixModeEnumsOf()
  const catalog = formulatedCatalogOf()
  const tools = qpuMcpToolsListOf()
  const listBytes = JSON.stringify({ resultType: 'complete' as const, tools }).length
  const products = [...catalog.products, ...catalog.services]
    .filter((row) => row.enums.some((e) => String(e).startsWith('access')))
    .map((row) => ({
      slug: row.slug,
      address: row.address,
      door: row.door,
      enums: row.enums.filter((e) => String(e).startsWith('access')),
    }))
  const { CLAY_SEALS } = await import('../../families/clay/index.js')
  return {
    kind: 'access-surface' as const,
    reading: {
      ...reading,
      connectBill: {
        doors: tools.length,
        bytes: listBytes,
        under16384: listBytes < 16384,
        qpuPrefixed: tools.filter((t) => t.name.startsWith('qpu_')).length,
      },
    },
    enums,
    products,
    catalogAccess: catalog.access,
    sealWave: {
      call: 'tools/call connector { seal: true } | { pass: i }' as const,
      seals: [...CLAY_SEALS],
      note: 'claySealWaveOf; discover.capacity gate × court.standard' as const,
      court: 'tools/call connector { court: true, case: discover.capacity }' as const,
      faces: qpuFacesOf().faces,
      executeGate: 'unix mode x via connector { access: true, mode, who }' as const,
    },
    endpoint: '/api/qpu/access' as const,
    call: 'tools/call connector { access: true, mode, who }' as const,
  }
}

export const publicSurfaceOf = async () => {
  const { reactorStatsOf } = await import('../../families/reactor/index.js')
  const { qpuAnalyticsOf } = await import('../../quantum/processing/unit/zeropage.js')
  // Live formulas only on the Worker (no heat-receipt import). README merges the committed heat-receipt.
  const analytics = qpuAnalyticsOf()
  const reactor = reactorStatsOf()
  return {
    kind: 'public-surface' as const,
    page: '/' as const,
    license: licenseManageOf(),
    navigation: await navigationOf(),
    variant: await variantLeadOf(),
    doors: await doorsOf(),
    network: networkMachineOf(),
    access: await accessSurfaceOf(),
    blocks: blockReachOf(),
    forms: formFieldsOf(),
    components: componentsOf(),
    document: '/api/qpu/permaculture?full=true' as const,
    schema: '/api/qpu/permaculture?man=true' as const,
    stats: {
      kind: 'register-stats' as const,
      register: {
        seed: analytics.seed,
        coins: analytics.coins,
        n: analytics.n,
        rays: analytics.rays,
        clay: analytics.clay,
        hz: analytics.hz,
        amplitudes: analytics.amplitudes,
        fused: analytics.fused,
        next: analytics.next,
        plane: analytics.plane,
      },
      zero: reactor.zero,
      temp: reactor.temp,
      time: reactor.time,
      heat: reactor.heat,
      cold: reactor.cold,
      coldFusion: reactor.coldFusion,
      heatIdentity: reactor.heatIdentity,
      coldFusionHex: reactor.coldFusionHex,
      holds: reactor.holds && analytics.holds === true,
      bill: usageBillOf(),
    },
  }
}

/** Public doors this plugin owns: the paths a browser or MCP client asks for, and the Payload API paths they rewrite to. */
export const PUBLIC_DOORS = {
  '/mcp': '/api/qpu/mcp',
  '/cite': '/api/qpu/cite',
  '/qpu.css': '/api/qpu/css',
} as const

const rpcMedia = { 'content-type': 'application/json; charset=utf-8' } as const
const isRpc = (body: unknown): boolean => {
  const one = (x: unknown) => x !== null && typeof x === 'object' && (x as { jsonrpc?: unknown }).jsonrpc === '2.0'
  return Array.isArray(body) ? body.length > n - n && body.every(one) : one(body)
}
const jsonOf = (body: unknown, status = found, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { ...headers, ...extra, ...(isRpc(body) ? rpcMedia : {}) } })

/** Cite as Payload serves it: the unit's citation document, JSON-LD. */
export const publicCiteOf = (): Response =>
  new Response(JSON.stringify(qpuCiteOf()), { status: found, headers: { ...headers, 'content-type': 'application/ld+json; charset=utf-8', 'cache-control': 'public, max-age=3600' } })

/** The lattice stylesheet Payload serves at /api/qpu/css (public URL /qpu.css). */
export const publicCssOf = (): Response =>
  new Response(qpuCssOf().css, { status: found, headers: { ...headers, 'content-type': 'text/css; charset=utf-8', 'cache-control': 'public, max-age=3600' } })

/**
 * Fused MCP over Streamable HTTP. tools/list is the measured connect bill (sealed + cybersecurity morph doors).
 * Owned by this Payload plugin; the unit router only hands /mcp here.
 */
export const publicMcpOf = async (request: Request, env?: QpuEnv): Promise<Response> => {
  if (request.method === 'GET' && (request.headers.get('accept') ?? '').includes('text/event-stream')) {
    const out: Record<string, string> = { ...headers, allow: 'POST, OPTIONS' }
    delete out['content-type']
    return new Response(null, { status: lost + seed, headers: out })
  }
  if (request.method === 'POST') {
    let parsed: unknown
    try {
      parsed = JSON.parse(await request.text())
    } catch {
      return jsonOf(rpcErrorOf(null, rpcCodes.parse, 'Parse error: the body is not JSON'), badRequest)
    }
    if (Array.isArray(parsed)) {
      const members = parsed as unknown[]
      if (members.length === n - n || !members.every((m) => m !== null && typeof m === 'object' && !Array.isArray(m)))
        return jsonOf(rpcErrorOf(null, rpcCodes.invalid, 'Invalid Request: a batch must be a non-empty array of request objects'), badRequest)
      const auth = request.headers.get('authorization')
      const replies = await Promise.all(members.map(async (m) => {
        const one = new Request(request.url, {
          method: 'POST',
          headers: { 'content-type': 'application/json', accept: 'application/json', ...(auth ? { authorization: auth } : {}) },
          body: JSON.stringify(m),
        })
        const r = await publicMcpOf(one, env)
        return (m as { id?: unknown }).id === undefined ? null : ((await r.json()) as unknown)
      }))
      return jsonOf(replies.filter((r) => r !== null))
    }
    if (parsed === null || typeof parsed !== 'object') {
      return jsonOf(rpcErrorOf(null, rpcCodes.invalid, 'Invalid Request: expected one JSON-RPC 2.0 request object'), badRequest)
    }
    const body = parsed as { method?: unknown; params?: { name?: unknown; arguments?: unknown; protocolVersion?: unknown }; id?: unknown }
    if (typeof body.method !== 'string') {
      return jsonOf(rpcErrorOf(body.id, rpcCodes.invalid, 'Invalid Request: method must be a string'), badRequest)
    }
    if (body.id === undefined) return new Response(null, { status: 202, headers: { ...headers } })
    if (body.method === 'initialize' || body.method === 'server/discover') {
      return jsonOf({ jsonrpc: '2.0', id: body.id ?? null, result: qpuMcpDiscoverOf(body.params?.protocolVersion) })
    }
    if (body.method === 'ping') {
      return jsonOf({ jsonrpc: '2.0', id: body.id ?? null, result: {} })
    }
    const envelope = (id: unknown, resultBody: string) =>
      new Response(`{"jsonrpc":"2.0","id":${JSON.stringify(id ?? null)},"result":${resultBody}}`, { status: found, headers: { ...headers, ...rpcMedia } })
    if (body.method === 'tools/list') {
      return envelope(body.id, servedOf('tools/list', () => ({ resultType: 'complete' as const, tools: qpuMcpToolsListOf() })).body)
    }
    if (body.method === 'tools/call') {
      const name = typeof body.params?.name === 'string' ? body.params.name : ''
      const args = body.params?.arguments && typeof body.params.arguments === 'object' && !Array.isArray(body.params.arguments)
        ? (body.params.arguments as Record<string, unknown>)
        : {}
      if (pureTools.has(name) && pureArgs(args)) {
        const key = `call:${name}:${sandboxEpoch}:${JSON.stringify(args)}`
        const hit = servedMemo.get(key)
        if (hit) {
          SERVED.push({ key, fold: hit.etag })
          return envelope(body.id, hit.body)
        }
        const called = await qpuMcpCallOf(name, args, env, request.headers.get('authorization'))
        if (isUnknownTool(called)) return jsonOf(rpcErrorOf(body.id, rpcCodes.params, `Unknown tool: ${name || '(none)'}`, { tools: called.tools }))
        // redact secrets only — do not compact recognition replies (fold equality)
        const { redactSecretsOf } = await import('./tokens.js')
        return envelope(body.id, servedOf(key, () => redactSecretsOf(called)).body)
      }
      const called = await qpuMcpCallOf(name, args, env, request.headers.get('authorization'))
      if (isUnknownTool(called)) return jsonOf(rpcErrorOf(body.id, rpcCodes.params, `Unknown tool: ${name || '(none)'}`, { tools: called.tools }))
      const { redactSecretsOf } = await import('./tokens.js')
      return jsonOf({ jsonrpc: '2.0', id: body.id ?? null, result: redactSecretsOf(called) })
    }
    const extension = MCP_EXTENSIONS.get(body.method)
    if (extension) {
      try {
        const params = body.params && typeof body.params === 'object' && !Array.isArray(body.params) ? (body.params as Record<string, unknown>) : {}
        return jsonOf({ jsonrpc: '2.0', id: body.id ?? null, result: await extension.handler(params, env) })
      } catch (e) {
        const err = e as { code?: unknown; message?: unknown; data?: unknown }
        return jsonOf(rpcErrorOf(body.id, typeof err.code === 'number' ? err.code : rpcCodes.params, typeof err.message === 'string' ? err.message : String(e), err.data))
      }
    }
    return jsonOf(rpcErrorOf(body.id, rpcCodes.method, `Method not found: ${body.method}`, { methods: [...rpcMethods, ...MCP_EXTENSIONS.keys()] }))
  }
  return new Response(JSON.stringify(qpuMcpOf()), { status: found, headers: { ...headers, 'content-type': 'application/ld+json; charset=utf-8', 'cache-control': 'public, max-age=3600' } })
}

/**
 * The Payload binding's fetch for public doors: same handlers the plugin mounts at /api/qpu/*.
 * Boot and stdio install this when the OpenNext app is not in the isolate.
 */
export const publicDoorFetchOf = async (request: Request, env?: QpuEnv): Promise<Response> => {
  const url = new URL(request.url)
  const path = url.pathname.replace(/\/$/, '') || '/'
  if (path === '/api/qpu/mcp' || path === '/mcp') return publicMcpOf(request, env)
  if (path === '/api/qpu/cite' || path === '/cite') return publicCiteOf()
  if (path === '/api/qpu/css' || path === '/qpu.css') return publicCssOf()
  if (path === '/api/qpu/public') return Response.json(await publicSurfaceOf())
  if (path === '/api/qpu/wave') {
    const { publicWaveOf } = await import('./wave.js')
    return publicWaveOf(request)
  }
  if (path === '/api/qpu/point' || path === '/api/qpu/constraints') {
    const { publicPointOf } = await import('./point.js')
    return publicPointOf()
  }
  if (path === '/api/qpu/exam') {
    const { publicExamOf } = await import('./exam.js')
    return publicExamOf(env)
  }
  if (path === '/api/qpu/ecommerce') {
    const { publicEcommerceOf } = await import('./ecommerce.js')
    return publicEcommerceOf()
  }
  if (path === '/api/qpu/tenants') {
    const { publicTenantsOf } = await import('./tenants.js')
    return publicTenantsOf(request, env)
  }
  if (path === '/api/qpu/access') {
    const { publicAccessOf } = await import('./access-mode.js')
    return publicAccessOf(request, env)
  }
  if (path === '/api/qpu/native') {
    const { publicNativeOf } = await import('./native-adapters.js')
    return publicNativeOf(request, env)
  }
  if (path === '/api/qpu/waits' || path === '/api/qpu/online') {
    const { publicWaitsOf } = await import('./tokens.js')
    const u = new URL(request.url)
    if (path.endsWith('/online') && !u.searchParams.has('mode')) u.searchParams.set('mode', 'offline')
    return publicWaitsOf(new Request(u, request))
  }
  if (path === '/api/qpu/observe') {
    const { publicObserveOf } = await import('./observability.js')
    return publicObserveOf(request)
  }
  if (path === '/api/qpu/chat' || path === '/api/qpu/search') {
    const u = new URL(request.url)
    if (path.endsWith('/chat') && (u.searchParams.get('distro') === '1' || u.searchParams.get('distro') === 'true')) {
      const { distroOf } = await import('./chat-search.js')
      const { sealPayloadOf } = await import('./tokens.js')
      return Response.json(sealPayloadOf(await distroOf({}, env)), {
        headers: { 'cache-control': 'public, max-age=0, s-maxage=30, stale-while-revalidate=120' },
      })
    }
    const { publicChatSearchOf } = await import('./chat-search.js')
    if (path.endsWith('/search')) {
      if (!u.searchParams.has('search')) u.searchParams.set('search', 'true')
      return publicChatSearchOf(new Request(u, request), env)
    }
    return publicChatSearchOf(request, env)
  }
  if (path === '/api/qpu/cloudflare') {
    const { publicCloudflareOf } = await import('./cloudflare-account.js')
    return publicCloudflareOf(request)
  }
  return jsonOf({ holds: false, denied: 'payload', reading: 'no public door at this path' }, lost)
}

/** Payload plugin: cite, stylesheet, public surface, fused MCP door, wave + point + exam + ecommerce + access hooks. */
export const publicPlugin = (): QpuPlugin => (config) => {
  // wave + point + exam + ecommerce + tenants + access live on the public plugin so payload.config needs no regen.
  const withWave = wavePlugin()(config)
  const withPoint = pointPlugin()(withWave)
  const withExam = examPlugin()(withPoint)
  const withEcommerce = ecommerceCatalogPlugin()(withExam)
  const withTenants = tenantsPlugin()(withEcommerce)
  const withAccess = accessModePlugin()(withTenants)
  const withNative = nativeAdaptersPlugin()(withAccess)
  const withCourt = gateCourtPlugin()(withNative)
  const withGoal = goalPlugin()(withCourt)
  const withObserve = observabilityPlugin()(withGoal)
  const withTokens = tokensPlugin()(withObserve)
  const withChat = chatSearchPlugin()(withTokens)
  return {
    ...withChat,
    endpoints: [
      ...(withChat.endpoints ?? []),
      {
        path: '/qpu/cite',
        method: 'get' as const,
        handler: () => publicCiteOf(),
      },
      {
        path: '/qpu/css',
        method: 'get' as const,
        handler: () => publicCssOf(),
      },
      {
        path: '/qpu/public',
        method: 'get' as const,
        handler: async () => Response.json(await publicSurfaceOf()),
      },
      {
        path: '/qpu/mcp',
        method: 'get' as const,
        handler: (req: Request) => publicMcpOf(req),
      },
      {
        path: '/qpu/mcp',
        method: 'post' as const,
        handler: (req: Request) => publicMcpOf(req),
      },
    ],
  }
}
