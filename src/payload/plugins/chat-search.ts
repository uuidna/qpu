/**
 * ONE AGNOSTIC CHAT+SEARCH SURFACE — idea → ask (chat) + registry search → blueprints/docs → Public apps.
 *
 * Same reading for every harness: MCP `connector { about|chat|search|idea }`, Payload `/api/qpu/chat`,
 * Next Public panel, stdio/boot, Worker (publicDoorFetchOf). No framework lock-in. RAID-native ask lives in
 * qpuDataOf; search is api-door + search.* formulas (Payload search collection is optional, not required).
 * Papers/blueprints/docs fuse through papersOf when asked. Token-sealed. Goal stays OPEN.
 */
import { qpuFacesOf, qpuHarnessesOf, type QpuEnv } from '../../quantum/processing/unit/index.js'
import { SearchFormulas } from '../../families/search/index.js'
import { ContractFormulas } from '../../families/contract/index.js'
import type { QpuPlugin } from './surface.js'

export const CHAT_SEARCH_FRAMEWORKS = [
  'mcp',
  'payload',
  'next',
  'stdio',
  'boot',
  'worker',
  'native',
  'raid',
] as const

export type ChatSearchFramework = (typeof CHAT_SEARCH_FRAMEWORKS)[number]

const str = (x: unknown): string => (typeof x === 'string' ? x.trim() : '')

const ideaOf = (args: Record<string, unknown>): string =>
  str(args.about) || str(args.q) || str(args.idea) || str(args.query) || str(args.chat) || str(args.search) || ''

const wordsOf = (s: string): string[] =>
  s
    .replace(/[A-Z]/g, (c) => ` ${c.toLowerCase()}`)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 1)

/**
 * Distro path map: any idea through chat/search to blueprints/docs/apps — formulated stages, not marketing.
 */
export const distroPathOf = (idea: string) => {
  const faces = qpuFacesOf().faces
  const cure = ContractFormulas.cure(7, 14)
  const stages = [
    {
      stage: 'idea' as const,
      via: 'connector { idea|about } · /api/qpu/chat?about=' as const,
      does: 'name the idea in words (+ numbers for formulas)' as const,
    },
    {
      stage: 'chat' as const,
      via: 'qpuDataOf ask · tools/call connector { chat: true, about }' as const,
      does: 'human-intelligence communication: words → formula hex/value/fold/hue' as const,
    },
    {
      stage: 'search' as const,
      via: 'apiSearchOf + search.* · connector { search: true, q }' as const,
      does: 'registry APIs + search.f1/hits — IR arithmetic, not a vendor index lock-in' as const,
    },
    {
      stage: 'blueprint' as const,
      via: 'papersOf / connector { papers: true } | { chips: true }' as const,
      does: 'blueprints + whitepapers + chip prints the tree already names' as const,
    },
    {
      stage: 'docs' as const,
      via: 'papersOf scripts/generate-docs · { docs: true }' as const,
      does: 'docs/ seed + skills when dist is free' as const,
    },
    {
      stage: 'app' as const,
      via: 'Public panels · /api/qpu/public · Payload clone rest' as const,
      does: 'Public UI + RAID-native Payload on Workers — same doors' as const,
    },
    {
      stage: 'cure' as const,
      via: `contract.cure · hex ${cure.hex ?? '—'}` as const,
      does: 'healing arithmetic on the path (cure window), not a prize flip' as const,
      value: cure.value,
      holds: cure.holds === true,
    },
  ] as const
  return {
    kind: 'distro-path' as const,
    idea: idea || null,
    stages,
    frameworks: [...CHAT_SEARCH_FRAMEWORKS],
    harnesses: qpuHarnessesOf().rows.map((r) => r.harness),
    faces,
    cure: { family: 'contract' as const, formula: 'cure' as const, hex: cure.hex ?? null, value: cure.value, holds: cure.holds === true },
    note: 'one path · no framework lock-in · token-sealed replies' as const,
  }
}

/**
 * Chat+search (+ optional papers) — one sealed reading for all frameworks.
 */
export const chatSearchOf = async (
  args: Record<string, unknown> = {},
  env?: QpuEnv,
): Promise<Record<string, unknown>> => {
  const { sealPayloadOf, tokenUsageOf, secretsInOf } = await import('./tokens.js')
  const idea = ideaOf(args)
  const wantChat =
    args.chat === true ||
    args.ask === true ||
    (typeof args.about === 'string' && args.about.length > 0) ||
    (typeof args.idea === 'string' && args.idea.length > 0) ||
    (args.search !== true && idea.length > 0 && args.papers !== true && args.blueprint !== true && args.docs !== true)
  const wantSearch =
    args.search === true ||
    typeof args.q === 'string' ||
    typeof args.query === 'string' ||
    (idea.length > 0 && args.chat !== false)
  const wantPapers = args.papers === true || args.blueprint === true || args.docs === true || args.print === true || args.chips === true
  const wantApp = args.app === true || args.apps === true || args.panel === true
  const path = distroPathOf(idea)
  const faces = qpuFacesOf().faces

  let chat: Record<string, unknown> | null = null
  if (wantChat && idea) {
    const { qpuDataOf } = await import('../../mcp/qpu-fused.js')
    const r = (await qpuDataOf('ask', { about: idea }, env)) as {
      reading?: Record<string, unknown>
      agrees?: boolean
      url?: string
      source?: string
    }
    chat = {
      source: r.source ?? 'ask',
      url: r.url ?? null,
      agrees: r.agrees === true,
      reading: r.reading ?? null,
    }
  }

  let search: Record<string, unknown> | null = null
  if (wantSearch && idea) {
    const terms = wordsOf(idea).filter((w) => w.length > 2).slice(0, faces)
    const { apiSearchOf } = await import('../../mcp/api-door.js')
    const found = await apiSearchOf(terms.length ? terms : wordsOf(idea), faces, 0)
    const matched = found.matched
    const readable = found.readable
    const hits = SearchFormulas.hits(Math.min(readable, matched || 1), Math.max(matched, 1))
    const precision = SearchFormulas.precision(Math.min(readable, matched || 0), Math.max(found.read, 1))
    const recall = SearchFormulas.recall(Math.min(readable, matched || 0), Math.max(matched, 1))
    const f1 = SearchFormulas.f1(Number(precision.value), Number(recall.value))
    search = {
      kind: found.kind,
      words: found.words,
      matched,
      scanned: found.scanned,
      read: found.read,
      readable,
      next: 'next' in found ? found.next : null,
      apis: found.apis.slice(0, faces).map((a) => ({
        api: a.api,
        index: a.index,
        title: a.title,
        free: a.free,
        operations: a.operations.slice(0, faces),
      })),
      formulas: {
        hits: { value: hits.value, holds: hits.holds === true, hex: hits.hex ?? null },
        precision: { value: precision.value, holds: precision.holds === true, hex: precision.hex ?? null },
        recall: { value: recall.value, holds: recall.holds === true, hex: recall.hex ?? null },
        f1: { value: f1.value, holds: f1.holds === true, hex: f1.hex ?? null },
      },
      holds: f1.holds === true || matched > 0,
    }
  }

  let papers: Record<string, unknown> | null = null
  if (wantPapers) {
    const { papersOf } = await import('../../mcp/papers.js')
    const paperArgs: Record<string, unknown> = {}
    if (args.chips === true || args.chip === true) paperArgs.chips = true
    if (args.print === true || args.printAll === true) paperArgs.print = true
    papers = await papersOf(paperArgs)
  }

  let app: Record<string, unknown> | null = null
  if (wantApp) {
    app = {
      kind: 'app-surface' as const,
      panels: [
        'AccessPanel',
        'ConnectorUsePanel',
        'ObservePanel',
        'SealWavePanel',
        'NativeAdaptersPanel',
        'PrintChipsPanel',
        'ChatSearchPanel',
      ] as const,
      endpoints: [
        '/api/qpu/chat',
        '/api/qpu/mcp',
        '/api/qpu/public',
        '/api/qpu/wave',
        '/api/qpu/observe',
        '/api/qpu/native',
      ] as const,
      install: 'install.json · qpu-boot · qpu-mcp' as const,
      note: 'Public panels share connector doors — Payload/Next clone rest on RAID' as const,
    }
  }

  const harnesses = qpuHarnessesOf()
  const chatHolds = chat === null ? true : chat.agrees === true || (chat.reading !== null && typeof chat.reading === 'object')
  const searchHolds = search === null ? true : search.holds === true
  const papersHolds = papers === null ? true : papers.holds === true
  const holds = chatHolds && searchHolds && papersHolds && path.cure.holds === true && harnesses.holds === true

  const body = {
    kind: 'chat-search' as const,
    call: 'tools/call connector { about|chat|search|idea } · GET|POST /api/qpu/chat' as const,
    idea: idea || null,
    path,
    frameworks: {
      all: [...CHAT_SEARCH_FRAMEWORKS],
      harnesses: harnesses.rows.map((r) => ({ harness: r.harness, how: r.how })),
      mcpUrl: harnesses.url,
      holds: harnesses.holds === true,
    },
    chat,
    search,
    papers,
    app,
    entrypoints: {
      install: 'install.json · npm i @uuidna/qpu · qpu-boot / qpu-mcp' as const,
      mcp: harnesses.url,
      chatSearch: '/api/qpu/chat' as const,
      papers: 'tools/call connector { papers: true } | { chips: true } | { print: true }' as const,
      apps: '/api/qpu/public · Public panels' as const,
      raid: 'tools/call connector { raid: true }' as const,
      ports: 'npm run port -- --all | --dependencies' as const,
    },
    goal: 'OPEN' as const,
    holds,
    note: 'agnostic distro · idea→chat/search→blueprint/docs→app · secrets sealed · no Clay prize flip' as const,
  }

  const sealed = sealPayloadOf(body)
  const usage = tokenUsageOf(
    { who: 'chat-search', door: 'connector', tool: 'chat-search', panel: 'chat-search', family: 'search' },
    sealed,
  )
  const leak = secretsInOf(JSON.stringify(sealed))
  return sealPayloadOf({
    ...sealed,
    usage: [usage],
    tokenSeal: { sealed: usage.sealed === true && !leak, note: 'redact+compact on the wire' as const },
  })
}

export const publicChatSearchOf = async (request?: Request, env?: QpuEnv): Promise<Response> => {
  const url = request ? new URL(request.url) : null
  let args: Record<string, unknown> = {}
  if (request?.method === 'POST') {
    args = ((await request.json().catch(() => ({}))) as Record<string, unknown>) ?? {}
  }
  if (url) {
    for (const key of ['about', 'q', 'idea', 'query'] as const) {
      const v = url.searchParams.get(key)
      if (v) args[key] = v
    }
    for (const flag of ['chat', 'search', 'papers', 'blueprint', 'docs', 'chips', 'print', 'app', 'apps'] as const) {
      if (url.searchParams.get(flag) === '1' || url.searchParams.get(flag) === 'true') args[flag] = true
    }
  }
  if (!ideaOf(args) && args.chat !== true && args.search !== true && args.papers !== true && args.app !== true) {
    args = { ...args, app: true }
  }
  const body = await chatSearchOf(args, env)
  return Response.json(body, {
    headers: { 'cache-control': 'public, max-age=0, s-maxage=30, stale-while-revalidate=120' },
  })
}

/**
 * Combinatorial distro cover on the tree's double-torus / rosetta manifold.
 * Possibilities = C(faces,k) × binomial modes × doubled-width wave passes — not a hand list.
 * Outside-in: harness → MCP → connector chat/search → formula.
 * Inside-out: merkaba.torus/rosetta/coil → fuse → distro path → apps.
 * Geometry is merkaba.* already named; invent nothing.
 */
export const distroOf = async (
  args: Record<string, unknown> = {},
  env?: QpuEnv,
): Promise<Record<string, unknown>> => {
  const { sealPayloadOf, tokenUsageOf, secretsInOf } = await import('./tokens.js')
  const { CombinatoricsFormulas } = await import('../../families/combinatorics/index.js')
  const { MerkabaFormulas } = await import('../../families/merkaba/index.js')
  const faces = qpuFacesOf().faces
  const k = typeof args.k === 'number' && Number.isSafeInteger(args.k) && args.k > 0 ? Math.min(args.k, faces) : 2
  const passesN = typeof args.passes === 'number' && Number.isSafeInteger(args.passes) && args.passes > 0 ? Math.min(args.passes, 4) : 2
  const width0 = typeof args.width === 'number' && Number.isSafeInteger(args.width) && args.width > 0 ? args.width : faces * 2
  const from0 = typeof args.from === 'number' && Number.isSafeInteger(args.from) && args.from >= 0 ? args.from : 0

  const binFaces = CombinatoricsFormulas.binomial(faces)
  const combNk = CombinatoricsFormulas.combinations(faces, k)
  const combFace2 = CombinatoricsFormulas.combinations(faces, 2)
  const modeSpace = CombinatoricsFormulas.binomial(3) // 8 = harness half / chmod triad space already used elsewhere

  // Manifold — double torus + rosetta + coil (merkaba test names the double torus)
  const torus = await MerkabaFormulas.torus(0, 1, 2)
  const rosetta = MerkabaFormulas.rosetta(Math.min(faces, 7))
  const coil = MerkabaFormulas.coil(Math.min(faces, 7))
  const manifold = {
    kind: 'double-torus-rosetta' as const,
    proof: 'merkaba.torus = flow|mirror referrer close; merkaba.rosetta = 2n edges both ways; merkaba.coil = n trinities' as const,
    torus: {
      formula: 'merkaba.torus' as const,
      params: [0, 1, 2] as const,
      value: torus.value,
      holds: torus.holds === true,
      hex: torus.hex ?? null,
      up: (torus as { up?: number }).up ?? null,
      down: (torus as { down?: number }).down ?? null,
    },
    rosetta: {
      formula: 'merkaba.rosetta' as const,
      params: [Math.min(faces, 7)],
      value: rosetta.value,
      holds: rosetta.holds === true,
      hex: rosetta.hex ?? null,
      edges: (rosetta as { edges?: number }).edges ?? null,
      forward: (rosetta as { forward?: number }).forward ?? null,
      back: (rosetta as { back?: number }).back ?? null,
    },
    coil: {
      formula: 'merkaba.coil' as const,
      params: [Math.min(faces, 7)],
      value: coil.value,
      holds: coil.holds === true,
      hex: coil.hex ?? null,
    },
    holds: torus.holds === true && (rosetta.holds === true || Number(rosetta.value) >= 0) && coil.holds !== false,
  }

  // Combinatorial batches: width doubles each pass (same scheme as port/wave)
  type Pass = {
    pass: number
    width: number
    fromStart: number
    indices: number[]
    cells: { index: number; stage: string; holds: boolean }[]
    holdsTrue: number
    holdsFalse: number
  }
  const stages = distroPathOf('').stages.map((s) => s.stage)
  const passes: Pass[] = []
  let from = from0
  let width = width0
  for (let p = 1; p <= passesN; p++) {
    const indices = Array.from({ length: width }, (_, i) => from + i * faces)
    const cells = indices.map((index) => {
      const stage = stages[index % stages.length]!
      // a cell holds when its stage index is lawful under C(faces,k) cover (index mod faces < faces)
      const holds = Number.isSafeInteger(index) && index >= 0 && stages.includes(stage)
      return { index, stage, holds }
    })
    passes.push({
      pass: p,
      width,
      fromStart: from,
      indices,
      cells,
      holdsTrue: cells.filter((c) => c.holds).length,
      holdsFalse: cells.filter((c) => !c.holds).length,
    })
    from = from + width * faces
    width *= 2
  }

  const cover = {
    kind: 'combinatorial-cover' as const,
    faces,
    k,
    scheme: {
      stride: faces,
      width0,
      passes: passesN,
      widthDoublesEachPass: true as const,
      batch: 'Promise.all-ready indices' as const,
    },
    formulas: {
      binomialFaces: { value: binFaces.value, holds: binFaces.holds === true, hex: binFaces.hex ?? null },
      combinationsNk: { value: combNk.value, holds: combNk.holds === true, hex: combNk.hex ?? null, k },
      combinationsFaces2: { value: combFace2.value, holds: combFace2.holds === true, hex: combFace2.hex ?? null },
      binomialModes: { value: modeSpace.value, holds: modeSpace.holds === true, hex: modeSpace.hex ?? null },
    },
    passes: passes.map((p) => ({
      pass: p.pass,
      width: p.width,
      fromStart: p.fromStart,
      sweeps: p.cells.length,
      holdsTrue: p.holdsTrue,
      holdsFalse: p.holdsFalse,
      stages: [...new Set(p.cells.map((c) => c.stage))],
    })),
    possibilitySpace: Number(binFaces.value) * Number(combNk.value),
    holds: passes.every((p) => p.holdsFalse === 0) && binFaces.holds === true && combNk.holds === true,
  }

  type Hop = {
    dir: 'inside-out' | 'outside-in'
    layer: string
    holds: boolean
    ms: number
    value?: unknown
    note?: string
    hex?: string | null
  }
  const hops: Hop[] = []

  // ─── INSIDE-OUT: formula → fuse → distro ───
  {
    const t0 = Date.now()
    hops.push({
      dir: 'inside-out',
      layer: 'merkaba.torus',
      holds: manifold.torus.holds,
      ms: Date.now() - t0,
      value: manifold.torus.value,
      hex: manifold.torus.hex,
      note: 'double torus closes when flow|mirror agree',
    })
  }
  {
    const t0 = Date.now()
    hops.push({
      dir: 'inside-out',
      layer: 'merkaba.rosetta',
      holds: manifold.rosetta.holds || manifold.rosetta.edges !== null,
      ms: Date.now() - t0,
      value: { value: manifold.rosetta.value, edges: manifold.rosetta.edges, forward: manifold.rosetta.forward, back: manifold.rosetta.back },
      hex: manifold.rosetta.hex,
      note: '2n edges both ways around the ring',
    })
  }
  {
    const t0 = Date.now()
    hops.push({
      dir: 'inside-out',
      layer: 'merkaba.coil',
      holds: typeof manifold.coil.value === 'number',
      ms: Date.now() - t0,
      value: manifold.coil.value,
      hex: manifold.coil.hex,
      note: 'n trinities on the rosetta ring',
    })
  }
  {
    const t0 = Date.now()
    const path = distroPathOf('combinatorial distro')
    hops.push({
      dir: 'inside-out',
      layer: 'distro-path',
      holds: path.stages.length >= 6 && path.cure.holds === true,
      ms: Date.now() - t0,
      value: path.stages.map((s) => s.stage),
      note: 'idea→chat→search→blueprint→docs→app→cure',
    })
  }
  {
    const t0 = Date.now()
    const surface = await chatSearchOf({ about: 'search precision 8 10', chat: true, search: true }, env)
    hops.push({
      dir: 'inside-out',
      layer: 'chat-search-fuse',
      holds: surface.kind === 'chat-search' && surface.tokenSeal !== undefined,
      ms: Date.now() - t0,
      value: { kind: surface.kind, holds: surface.holds, sealed: (surface.tokenSeal as { sealed?: boolean } | undefined)?.sealed },
      note: 'formula/ask + api search sealed',
    })
  }
  {
    const t0 = Date.now()
    const h = qpuHarnessesOf()
    hops.push({
      dir: 'inside-out',
      layer: 'harnesses',
      holds: h.holds === true,
      ms: Date.now() - t0,
      value: h.rows.length,
      note: h.url,
    })
  }

  // ─── OUTSIDE-IN: harness → MCP → connector → formula ───
  {
    const t0 = Date.now()
    const h = qpuHarnessesOf()
    hops.push({
      dir: 'outside-in',
      layer: 'harness→url',
      holds: h.holds === true && h.rows.length >= 8,
      ms: Date.now() - t0,
      value: h.rows.map((r) => r.harness),
      note: '8 connector harnesses → one /mcp',
    })
  }
  {
    const t0 = Date.now()
    try {
      const { publicMcpOf } = await import('./public.js')
      const res = await publicMcpOf(
        new Request('https://qpu.uuidna.com/mcp', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
        }),
        env,
      )
      const body = (await res.json()) as { result?: { tools?: { name: string }[] } }
      const tools = body.result?.tools ?? []
      hops.push({
        dir: 'outside-in',
        layer: 'tools/list',
        holds: res.status === 200 && tools.length <= 16,
        ms: Date.now() - t0,
        value: tools.length,
        note: tools.map((t) => t.name).join(','),
      })
    } catch (e) {
      hops.push({ dir: 'outside-in', layer: 'tools/list', holds: false, ms: Date.now() - t0, note: String(e) })
    }
  }
  {
    const t0 = Date.now()
    try {
      const { publicMcpOf } = await import('./public.js')
      const res = await publicMcpOf(
        new Request('https://qpu.uuidna.com/mcp', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 2,
            method: 'tools/call',
            params: { name: 'connector', arguments: { about: 'search precision 8 10' } },
          }),
        }),
        env,
      )
      const body = (await res.json()) as {
        result?: { structuredContent?: { kind?: string; holds?: boolean }; kind?: string; holds?: boolean }
        error?: unknown
      }
      const sc = (body.result?.structuredContent ?? body.result ?? {}) as { kind?: string; holds?: boolean }
      hops.push({
        dir: 'outside-in',
        layer: 'tools/call→connector→chat-search',
        holds: res.status === 200 && !body.error && (sc.kind === 'chat-search' || sc.holds === true),
        ms: Date.now() - t0,
        value: { kind: sc.kind, holds: sc.holds },
        note: 'harness→MCP→connector { about } → chat-search',
      })
    } catch (e) {
      hops.push({
        dir: 'outside-in',
        layer: 'tools/call→connector→chat-search',
        holds: false,
        ms: Date.now() - t0,
        note: String(e),
      })
    }
  }
  {
    const t0 = Date.now()
    try {
      const res = await publicChatSearchOf(
        new Request('https://qpu.uuidna.com/api/qpu/chat?about=search%20precision%208%2010&chat=true&search=true'),
        env,
      )
      const body = (await res.json()) as { kind?: string; holds?: boolean; tokenSeal?: { sealed?: boolean } }
      hops.push({
        dir: 'outside-in',
        layer: 'GET /api/qpu/chat',
        holds: res.status === 200 && body.kind === 'chat-search',
        ms: Date.now() - t0,
        value: { kind: body.kind, sealed: body.tokenSeal?.sealed },
        note: 'Payload/Next public door — same reading',
      })
    } catch (e) {
      hops.push({ dir: 'outside-in', layer: 'GET /api/qpu/chat', holds: false, ms: Date.now() - t0, note: String(e) })
    }
  }

  const inside = hops.filter((h) => h.dir === 'inside-out')
  const outside = hops.filter((h) => h.dir === 'outside-in')
  const healthy = hops.filter((h) => h.holds)
  const path = distroPathOf(typeof args.idea === 'string' ? args.idea : 'combinatorial distro')
  const holds =
    cover.holds &&
    manifold.holds &&
    healthy.length >= Math.ceil(hops.length / 2) &&
    inside.some((h) => h.holds) &&
    outside.some((h) => h.holds)

  const body = {
    kind: 'distro' as const,
    call: 'tools/call connector { distro: true }' as const,
    endpoint: '/api/qpu/chat?distro=true' as const,
    path,
    manifold,
    cover,
    maps: {
      insideOut: ['merkaba.torus', 'merkaba.rosetta', 'merkaba.coil', 'distro-path', 'chat-search-fuse', 'harnesses'] as const,
      outsideIn: ['harness→url', 'tools/list', 'tools/call→connector→chat-search', 'GET /api/qpu/chat'] as const,
    },
    hops,
    counts: {
      hops: hops.length,
      inside: inside.length,
      outside: outside.length,
      healthy: healthy.length,
      blind: hops.length - healthy.length,
    },
    frameworks: [...CHAT_SEARCH_FRAMEWORKS],
    goal: 'OPEN' as const,
    holds,
    note: 'combinatorial cover on double-torus/rosetta · outside-in + inside-out · token-sealed · no invented geometry' as const,
  }

  const sealed = sealPayloadOf(body)
  const usage = tokenUsageOf({ who: 'distro', door: 'connector', tool: 'distro', panel: 'distro', family: 'merkaba' }, sealed)
  const leak = secretsInOf(JSON.stringify(sealed))
  return sealPayloadOf({
    ...sealed,
    usage: [usage],
    tokenSeal: { sealed: usage.sealed === true && !leak, note: 'redact+compact on the wire' as const },
  })
}

export const chatSearchPlugin = (): QpuPlugin => (config) => ({
  ...config,
  endpoints: [
    ...(config.endpoints ?? []),
    {
      path: '/qpu/chat',
      method: 'get' as const,
      handler: async (req: Request) => {
        const u = new URL(req.url)
        if (u.searchParams.get('distro') === '1' || u.searchParams.get('distro') === 'true') {
          const { sealPayloadOf } = await import('./tokens.js')
          return Response.json(sealPayloadOf(await distroOf({}, undefined)), {
            headers: { 'cache-control': 'public, max-age=0, s-maxage=30, stale-while-revalidate=120' },
          })
        }
        return publicChatSearchOf(req)
      },
    },
    {
      path: '/qpu/chat',
      method: 'post' as const,
      handler: async (req: Request) => {
        const args = ((await req.clone().json().catch(() => ({}))) as Record<string, unknown>) ?? {}
        if (args.distro === true) {
          const { sealPayloadOf } = await import('./tokens.js')
          return Response.json(sealPayloadOf(await distroOf(args)), {
            headers: { 'cache-control': 'public, max-age=0, s-maxage=30, stale-while-revalidate=120' },
          })
        }
        return publicChatSearchOf(req)
      },
    },
    {
      path: '/qpu/search',
      method: 'get' as const,
      handler: async (req: Request) => {
        const u = new URL(req.url)
        if (!u.searchParams.has('search')) u.searchParams.set('search', 'true')
        return publicChatSearchOf(new Request(u, req))
      },
    },
  ],
})
