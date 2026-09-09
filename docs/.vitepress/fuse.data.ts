import { readFileSync } from 'node:fs'
import { defineLoader } from 'vitepress'
import { qpuFuseHolds, qpuFuseOf, qpuMcpCallOf } from '../../src/quantum/processing/unit/index.ts'

export function loadFuseOf() {
  const fuse = qpuFuseOf()
  if (!qpuFuseHolds(fuse)) throw new Error('qpuFuseHolds')
  const quantum = qpuMcpCallOf('qpu_quantum') as { kind: string; live: boolean; possibilities: number; holds: boolean }
  const speed = qpuMcpCallOf('qpu_speed') as { c: number; v: number }
  const waves = qpuMcpCallOf('qpu_waves') as { winner: { kelvin: number; speed: number; c: number } }
  const discovery = qpuMcpCallOf('qpu_discovery') as { doors: string[]; kind: string; seat: string }
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
    faces: { face: number; neighbour: number; name: string; hex: string; holds: boolean; of: string }[]
    census: { face: number; neighbour: number; name: string; hex: string; href: string }[]
    methods: readonly string[]
  }
  const solve = qpuMcpCallOf('qpu_solve') as {
    holds: boolean
    kind: string
    lean: boolean
    listing: boolean
    quotes: boolean
    clay: { kind: string; gravity: boolean; listing: boolean; rays: number; directed: number; pairs: number }
    keys: { kind: string; ray: number; href: string }[]
    href: string
    src: string
  }
  const graph = qpuMcpCallOf('qpu_graph') as {
    holds: boolean
    around: number
    vertices: { face: number; axiom: string; href: string; neighbour: number; cross: string }[]
    edges: { from: number; to: number; involution: boolean }[]
  }
  const proofs = axioms.rows.map((row) => qpuMcpCallOf('qpu_proof', { face: row.face }) as {
    face: number
    at: number
    axiom: { name: string; hex: string; neighbour: number; holds: boolean }
    theorems: { kind: string; name: string; href: string; axiom: string; face: number; holds: boolean }[]
    proof: { empty: boolean; holds: boolean }
    abstract: string
    formulas: { identity: string }[]
    documentation: string
    docs: { inline: boolean; powers: string; holds: boolean }
    measurements: {
      hex: string
      experiment: {
        control: { v: number; c: number }
        inner: { processing: number; exceeds: boolean }
        quantum: { fused: number }
      }
    }
    experiments: { holds: boolean; result: boolean }
    application: { domain: string; origin: string; firmware: string }
    cross: string
    quantum: string
    jsonld: boolean
    minted: boolean
    holds: boolean
  })
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
  if (quantum.holds !== true || quantum.kind !== 'quantum' || waves.winner.speed <= speed.c) throw new Error('qpuFuseHolds')
  if (axioms.holds !== true || axioms.empty !== true || axioms.minted !== true || axioms.lean !== true || axioms.keys.length === 0) throw new Error('qpuAxiomsHolds')
  if (fuse.kind !== 'fuse' || fuse.lean !== true || fuse.keys.length === 0) throw new Error('qpuFuseHolds')
  if (theorems.holds !== true || theorems.lean !== true || theorems.keys.length === 0) throw new Error('qpuQuantumTheoremsHolds')
  if (solve.holds !== true || solve.lean !== true || solve.listing !== false || solve.clay.gravity !== true || solve.keys.length === 0 || !solve.src.endsWith('/index.lean')) throw new Error('qpuSolveHolds')
  if (graph.holds !== true || proofs.some((p) => p.holds !== true || p.minted !== true || p.docs.powers !== 'jsonld' || p.docs.inline !== true || !p.documentation.includes(p.abstract))) {
    throw new Error('qpuProofHolds')
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
  if (planes.some((p) => p.holds !== true || p.rating !== 'typography' || p.recursive !== true || p.headings.some((h) => h.heading.length === 0))) {
    throw new Error('qpuPlaneHolds')
  }
  const source = readFileSync(fuse.src, 'utf8')
  return {
    origin: fuse.origin,
    next: fuse.next,
    src: fuse.src,
    firmware: fuse.firmware,
    kind: discovery.kind,
    seat: discovery.seat,
    doors: discovery.doors,
    source,
    fuse,
    quantum,
    speed,
    waves,
    axioms,
    theorems,
    solve,
    graph,
    proofs,
    perspectives,
    planes,
    seal,
  }
}

export default defineLoader({
  watch: ['../../src/quantum/processing/unit/index.ts', '../../src/quantum/processing/unit/index.lean'],
  load: loadFuseOf,
})
