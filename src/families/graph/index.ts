import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** GRAPH — A NETWORK AS ARITHMETIC (nodes and edges, no drawing). The counts a graph is made of: the most edges it can hold,
 *  how dense it is, the sum of its degrees (the handshake), its connected components, the edges of a spanning tree, the edges
 *  of a complete bipartite split, its cyclomatic number (independent cycles), and its average degree. Crosses to `graphtheory`
 *  — graph is graph theory counted. A measure. */

const PROOF = 'graph arithmetic (max edges, density, degree sum, components, tree edges, bipartite edges, cyclomatic number, average degree); a network as counts; a measure crossed to graphtheory'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'graph', dst: 'graphtheory', formula, value, proof: PROOF, ...extra }, holds, { name: `graph.${name}`, params })

export class GraphFormulas {
  /** MAX EDGES: the most edges a simple graph on n nodes can hold. value ⌊n · (n − 1) / 2⌋. */
  static maxedges(n: number): CrossFormula { return c('graph-maxedges', 'maxedges(n) = ⌊n · (n − 1) / 2⌋', Math.floor((n * (n - 1)) / 2), nat(n), 'maxedges', [n]) }
  /** DENSITY as a percentage of the most edges possible. value ⌊edges · 100 / maxedges⌋. */
  static density(edges: number, n: number): CrossFormula { return c('graph-density', 'density(edges, n) = ⌊edges · 100 / ⌊n · (n − 1) / 2⌋⌋', Math.floor((n * (n - 1)) / 2) > 0 ? Math.floor((edges * 100) / Math.floor((n * (n - 1)) / 2)) : 0, nat(edges, n), 'density', [edges, n]) }
  /** DEGREE SUM: the handshake lemma — the degrees sum to twice the edges. value 2 · edges. */
  static degreesum(edges: number): CrossFormula { return c('graph-degreesum', 'degreesum(edges) = 2 · edges', 2 * edges, nat(edges), 'degreesum', [edges]) }
  /** COMPONENTS: a forest on n nodes with `edges` edges has n − edges components. value max(0, n − edges). */
  static components(n: number, edges: number): CrossFormula { return c('graph-components', 'components(n, edges) = max(0, n − edges)', Math.max(0, n - edges), nat(n, edges), 'components', [n, edges]) }
  /** TREE EDGES: a spanning tree on n nodes has n − 1 edges. value max(0, n − 1). */
  static treeedges(n: number): CrossFormula { return c('graph-treeedges', 'treeedges(n) = max(0, n − 1)', Math.max(0, n - 1), nat(n), 'treeedges', [n]) }
  /** BIPARTITE EDGES: the edges of a complete bipartite graph K(a, b). value a · b. */
  static bipartiteedges(a: number, b: number): CrossFormula { return c('graph-bipartiteedges', 'bipartiteedges(a, b) = a · b', a * b, nat(a, b), 'bipartiteedges', [a, b]) }
  /** CYCLOMATIC NUMBER: the independent cycles (circuit rank). value max(0, edges − n + components). */
  static cyclomaticnumber(edges: number, n: number, components: number): CrossFormula { return c('graph-cyclomaticnumber', 'cyclomaticnumber(edges, n, components) = max(0, edges − n + components)', Math.max(0, edges - n + components), nat(edges, n, components), 'cyclomaticnumber', [edges, n, components]) }
  /** AVERAGE DEGREE: twice the edges over the nodes. value ⌊2 · edges / n⌋. */
  static averagedegree(edges: number, n: number): CrossFormula { return c('graph-averagedegree', 'averagedegree(edges, n) = ⌊2 · edges / n⌋', n > 0 ? Math.floor((2 * edges) / n) : 0, nat(edges, n) && n > 0, 'averagedegree', [edges, n]) }
}

for (const name of ['averagedegree', 'bipartiteedges', 'components', 'cyclomaticnumber', 'degreesum', 'density', 'maxedges', 'treeedges'] as const)
  qpuHexRegisterOf('graph', name, (GraphFormulas[name] as (...x: unknown[]) => unknown).bind(GraphFormulas))
