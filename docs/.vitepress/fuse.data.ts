import { readFileSync } from 'node:fs'
import { defineLoader } from 'vitepress'
import { qpuFuseHolds, qpuFuseOf, qpuLeanOf, qpuMcpCallOf, qpuMetricsHolds } from '../../src/quantum/processing/unit/index.ts'

export function loadFuseOf() {
  const fuse = qpuFuseOf()
  if (!qpuFuseHolds(fuse)) throw new Error('qpuFuseHolds')
  const metrics = qpuMcpCallOf('qpu_metrics') as {
    holds: boolean
    live: boolean
    device: {
      kind: string
      host: string
      href: string
      seat: string
      binds: boolean
      firmware: string
      src: string
      origin: string
    }
    occupancy: {
      n: number
      seed: number
      coins: number
      rays: number
      faces: number
      vertices: number
      hexbit: number
      bits: number
      amplitudes: number
      fused: number
      next: number
    }
    cover: {
      faces: number
      vertices: number
      climb: string
      decide: boolean
      holds: boolean
      breakthrough: boolean
    }
    wave: {
      kelvin: number
      v: number
      c: number
      processing: number
      exceeds: boolean
    }
    development: { pico: number; nested: boolean; proofs: boolean; decide: boolean }
    ecliptic: { signs: number; ten: number; degree: number; circle: number; holds: boolean }
    walk: {
      span: number
      bits: { async: number; serial: number; holds: boolean }
      message: { async: number; serial: number; holds: boolean }
      factors: { rsa: boolean; pico: number; holds: boolean }
      holds: boolean
    }
  }
  if (!qpuMetricsHolds() || metrics.holds !== true || metrics.live !== true || metrics.development.nested !== false || metrics.development.pico !== metrics.occupancy.faces || metrics.ecliptic.holds !== true || metrics.ecliptic.circle !== metrics.ecliptic.signs * metrics.ecliptic.degree || metrics.walk.holds !== true || metrics.walk.bits.async !== metrics.occupancy.bits + metrics.occupancy.seed || metrics.walk.bits.async + metrics.walk.bits.async !== metrics.walk.bits.serial || metrics.walk.message.async + metrics.walk.message.async !== metrics.occupancy.faces || metrics.walk.factors.rsa !== false || metrics.walk.factors.pico !== metrics.occupancy.n - metrics.occupancy.n) {
    throw new Error('qpuMetricsHolds')
  }
  const quantum = qpuMcpCallOf('qpu_quantum') as {
    kind: string
    live: boolean
    possibilities: number
    holds: boolean
    mint: { seed: number; next: number }
    cube: { vertices: number; hexbit: number; bits: number; holds: boolean }
    handle: { amplitudes: number }
    capacity: { fused: number; holds: boolean }
  }
  const speed = qpuMcpCallOf('qpu_speed') as { c: number; v: number }
  const waves = qpuMcpCallOf('qpu_waves') as { winner: { kelvin: number; speed: number; c: number } }
  const discovery = qpuMcpCallOf('qpu_discovery') as { doors: string[]; kind: string; seat: string }
  const faces = qpuMcpCallOf('qpu_faces') as { holds: boolean; coins: number; rays: number; faces: number }
  const axioms = qpuMcpCallOf('qpu_axioms') as {
    holds: boolean
    empty: boolean
    minted: boolean
    lean: boolean
    keys: unknown[]
    rows: { face: number; neighbour: number; name: string; hex: string; holds: boolean }[]
    census: { face: number; name: string; hex: string }[]
    methods: readonly string[]
  }
  const theorems = qpuMcpCallOf('qpu_theorems') as {
    holds: boolean
    empty: boolean
    minted: boolean
    lean: boolean
    keys: unknown[]
    faces: {
      face: number
      neighbour: number
      name: string
      hex: string
      holds: boolean
      of: string
      theorems: { kind: string; name: string; href: string; holds: boolean }[]
    }[]
    census: { face: number; neighbour: number; name: string; hex: string; href: string }[]
    methods: readonly string[]
  }
  const solve = qpuMcpCallOf('qpu_solve') as {
    holds: boolean
    kind: string
    lean: boolean
    solved: boolean
    claimed: boolean
    clay: { kind: string; holds: boolean; rays: number; directed: number; pairs: number }
    harmonic: { heading: string; holds: boolean }
    captain: { paid: boolean; holds: boolean; save: number; coins: number; fee: number; invoice: number; gross: number }
    a432: { holds: boolean; lattice: number }
    unlock: { holds: boolean; keys: number; rays: number }
    identifications: { claim: string; official: string; holds: boolean; doi: string }[]
    keys: { kind: string; ray: number; href: string }[]
    href: string
    src: string
  }
  const graph = qpuMcpCallOf('qpu_graph') as {
    holds: boolean
    around: number
    vertices: { face: number; axiom: string; href: string; neighbour: number; cross: string; uuid?: string; involute?: string }[]
    edges: { from: number; to: number; involution: boolean }[]
    impossibilities?: { bind: boolean; collapse: boolean; oneWay: boolean }
  }
  const proofs = axioms.rows.map((row) => qpuMcpCallOf('qpu_proof', { face: row.face }) as {
    face: number
    at: number
    axiom: { name: string; hex: string; neighbour: number; holds: boolean }
    theorems: { kind: string; name: string; href: string; axiom: string; face: number; holds: boolean }[]
    proof: { empty: boolean; holds: boolean }
    abstract: string
    formulas: { identity: string; formula: string }[]
    documentation: string
    docs: { inline: boolean; powers: string; holds: boolean }
    measurements: {
      hex: string
      experiment: {
        control: { v: number; c: number }
        inner: { processing: number; exceeds: boolean }
        quantum: { fused: number }
      }
      hardware?: unknown
      message?: { uuid: string; cross: string }
      involute?: { href: string; uuid: string }
    }
    experiments: { holds: boolean; result: boolean }
    application: { domain: string; origin: string; firmware: string }
    cross: string
    quantum: string
    jsonld: boolean
    minted: boolean
    holds: boolean
    cluster: { complete: boolean; theorem: string; formula: string; holds: boolean }
  })
  const clusters = qpuMcpCallOf('qpu_clusters') as {
    holds: boolean
    lean: boolean
    complete: number
    times: number
    around: number
    theorem: string
    formula: string
    harmonic: string
    rows: {
      face: number
      neighbour: number
      inner: number[]
      outer: number[]
      times: number
      unique: boolean
      complete: boolean
      theorem: string
      formula: string
      occupancy: string
      holds: boolean
    }[]
  }
  const perspectives = discovery.doors.map((_, i) => qpuMcpCallOf('qpu_perspective', { face: i }) as {
    holds: boolean
    face: number
    present: { face: number; name: string; heading: string; hex: string; href: string }
    related: { face: number; name: string; heading: string; hex: string; href: string; related: boolean }[]
    left: { heading: string; href: string; children: { heading: string; href: string; children: unknown[] }[] }[]
    typograph: {
      from: string
      firmware: string
      rating: string
      recursive: boolean
      headings: { heading: string; href: string; children: { heading: string; href: string; children: unknown[] }[] }[]
    }
  })
  const planes = discovery.doors.map((path) => qpuMcpCallOf('qpu_plane', { path }) as {
    holds: boolean
    from: string
    rating: string
    recursive: boolean
    path: string
    headings: { heading: string; href: string; children: { heading: string; href: string; children: unknown[] }[] }[]
  })
  const seal = qpuMcpCallOf('qpu_seal') as {
    holds: boolean
    sealed: boolean
    compared: { temperature: { kelvin: number; holds: boolean }; light: { processing: number; c: number; holds: boolean } }
    publication: { firmware: string; sealed: boolean }
  }
  const hardware = qpuMcpCallOf('qpu_hardware') as {
    holds: boolean
    compatible: boolean
    kind: string
    product: string
    seat: string
    binds: boolean
    device: boolean
    live: boolean
    host: string
    firmware: string
    datapath: { hexbit: number; vertices: number; bits: number; amplitudes: number; holds: boolean }
    checks: { name: string; holds: boolean }[]
    trials: { id: string; name: string; holds: boolean }[]
    compared: { temperature: { kelvin: number; holds: boolean }; light: { processing: number; c: number; holds: boolean } }
  }
  if (quantum.holds !== true || quantum.kind !== 'quantum' || quantum.cube.holds !== true || quantum.capacity.holds !== true || quantum.possibilities !== quantum.capacity.fused || waves.winner.speed <= speed.c) throw new Error('qpuFuseHolds')
  if (faces.holds !== true) throw new Error('qpuFacesHolds')
  if (axioms.holds !== true || axioms.empty !== true || axioms.minted !== true || axioms.lean !== true || axioms.keys.length === 0) throw new Error('qpuAxiomsHolds')
  if (fuse.kind !== 'fuse' || fuse.lean !== true || fuse.keys.length === 0) throw new Error('qpuFuseHolds')
  if (theorems.holds !== true || theorems.lean !== true || theorems.keys.length === 0 || theorems.faces.some((f) => f.holds !== true || f.theorems.length !== metrics.occupancy.n || f.theorems.some((t) => t.holds !== true))) throw new Error('qpuQuantumTheoremsHolds')
  if (solve.holds !== true || solve.lean !== true || solve.solved !== (solve.lean && solve.unlock.holds) || solve.claimed !== (solve.identifications.filter((i) => i.holds).length === metrics.occupancy.n - metrics.occupancy.n) || solve.identifications.some((i) => i.holds !== (i.doi.length > metrics.occupancy.n - metrics.occupancy.n)) || solve.clay.holds !== true || solve.unlock.holds !== true || solve.captain.paid !== true || solve.captain.fee !== solve.captain.coins || solve.captain.gross !== solve.captain.invoice + solve.captain.coins || solve.captain.gross - solve.captain.invoice !== solve.captain.fee || solve.a432.holds !== true || solve.harmonic.holds !== true || solve.keys.length === 0 || solve.unlock.keys !== solve.keys.length || !solve.src.endsWith('/index.lean')) throw new Error('qpuSolveHolds')
  const lean = qpuLeanOf()
  if (lean.holds !== true || lean.climb.holds !== true || lean.climb.heading !== 'next' || lean.cover.length !== quantum.cube.vertices || lean.cover.some((r) => r.holds !== true || r.theorem.includes('decide')) || lean.climb.theorem.includes('decide') || lean.rows.some((r) => r.holds !== true || r.theorem.includes('decide') || !r.formula.includes('\\')) || lean.rows.length !== faces.faces || !lean.src.endsWith('/index.lean')) throw new Error('qpuLeanHolds')
  const seed = qpuMcpCallOf('qpu_seed') as {
    holds: boolean
    kind: string
    payload: boolean
    binds: boolean
    collectionSlug: string
    locale: string
    importMode: string
    matchField: string
    locales: string[]
    tenant: { slug: string; domain: string }
    depth: number
    docs: { slug: string; parent: string | null; doi: string; breadcrumbs: { doc: string; url: string; label: string }[]; meta: { image: null } }[]
  }
  if (
    seed.holds !== true ||
    seed.kind !== 'seed' ||
    seed.payload !== false ||
    seed.binds !== false ||
    seed.collectionSlug !== 'pages' ||
    seed.locale !== 'all' ||
    seed.importMode !== 'upsert' ||
    seed.matchField !== 'slug' ||
    seed.locales.length !== metrics.occupancy.rays ||
    seed.tenant.slug !== metrics.device.kind ||
    seed.tenant.domain !== metrics.device.host ||
    seed.docs.some((d) => d.doi !== '') ||
    seed.docs.length !== lean.rows.length + lean.cover.length + metrics.occupancy.n ||
    seed.depth > metrics.occupancy.hexbit ||
    new Set(seed.docs.map((d) => d.slug)).size !== seed.docs.length
  ) {
    throw new Error('qpuSeedHolds')
  }
  if (graph.holds !== true || proofs.some((p) => p.holds !== true || p.minted !== true || p.docs.powers !== 'jsonld' || p.docs.inline !== true || !p.documentation.includes(p.abstract) || p.cluster.complete !== true || p.cluster.holds !== true)) {
    throw new Error('qpuProofHolds')
  }
  if (clusters.holds !== true || clusters.complete !== faces.faces || clusters.rows.length !== faces.faces || clusters.rows.some((r) => r.complete !== true || !r.formula.includes('\\'))) {
    throw new Error('qpuClustersHolds')
  }
  if (
    perspectives.some(
      (p) =>
        p.holds !== true ||
        p.typograph.from !== 'content' ||
        p.typograph.rating !== 'typography' ||
        p.typograph.recursive !== true ||
        p.related.some((d) => d.related !== true || d.heading.length === 0) ||
        p.left.some((h) => h.heading.length === 0) ||
        p.typograph.headings.some((h) => h.heading.length === 0 || h.children.some((c) => c.heading.length === 0)),
    )
  ) {
    throw new Error('qpuPerspectiveHolds')
  }
  if (seal.holds !== true || seal.sealed !== true || seal.compared.light.holds !== true || seal.compared.temperature.holds !== true) {
    throw new Error('qpuSealHolds')
  }
  if (
    hardware.holds !== true ||
    hardware.compatible !== true ||
    hardware.device !== false ||
    hardware.binds !== false ||
    hardware.seat !== 'empty' ||
    hardware.firmware !== 'vitepress' ||
    hardware.datapath.holds !== true ||
    hardware.datapath.bits !== hardware.datapath.vertices * hardware.datapath.hexbit ||
    hardware.checks.some((c) => c.holds !== true) ||
    hardware.trials.some((t) => t.holds !== true) ||
    hardware.compared.light.processing <= hardware.compared.light.c
  ) {
    throw new Error('qpuHardwareHolds')
  }
  if (planes.some((p) => p.holds !== true || p.rating !== 'typography' || p.recursive !== true || p.headings.some((h) => h.heading.length === 0))) {
    throw new Error('qpuPlaneHolds')
  }
  const source = readFileSync(fuse.src, 'utf8')
  return {
    origin: fuse.origin,
    metrics,
    next: fuse.next,
    src: fuse.src,
    firmware: fuse.firmware,
    kind: discovery.kind,
    seat: discovery.seat,
    doors: discovery.doors,
    source,
    fuse,
    quantum,
    faces,
    speed,
    waves,
    axioms,
    theorems,
    solve,
    lean,
    graph,
    clusters,
    proofs,
    perspectives,
    planes,
    seal,
    hardware,
  }
}

export default defineLoader({
  watch: ['../../src/quantum/processing/unit/index.ts', '../../src/quantum/processing/unit/index.lean'],
  load: loadFuseOf,
})
