import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** VECTOR — VECTOR GEOMETRY AS ARITHMETIC (paths, curves, strokes). Drawing is numbers: the anchor points a path carries,
 *  the cubic segments those anchors form, the bounding box they span, how a simplify pass thins them, the squared length of
 *  a step, the nodes a network holds, the net winding, and the area a stroke paints. Crosses to `cartography` — vector
 *  geometry is what a map is drawn from. A measure. */

const PROOF = 'vector arithmetic (anchor points, bezier segments, bounding box, simplify, path length squared, nodes, winding, stroke area); vector geometry crossed to cartography'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'vector', dst: 'cartography', formula, value, proof: PROOF, ...extra }, holds, { name: `vector.${name}`, params })

export class VectorFormulas {
  /** ANCHOR POINTS: an open path with that many segments carries one more anchor. value segments + 1. */
  static anchorpoints(segments: number): CrossFormula { return c('vector-anchorpoints', 'anchorpoints(segments) = segments + 1', segments + 1, nat(segments), 'anchorpoints', [segments]) }
  /** BEZIER SEGMENTS: cubic segments formed by that many anchors (three new anchors per segment). value ⌊(anchors − 1) / 3⌋. */
  static beziersegments(anchors: number): CrossFormula { return c('vector-beziersegments', 'beziersegments(anchors) = ⌊(anchors − 1) / 3⌋', Math.floor(Math.max(0, anchors - 1) / 3), nat(anchors), 'beziersegments', [anchors]) }
  /** BOUNDING BOX: the area the box spans. value width · height. */
  static boundingbox(width: number, height: number): CrossFormula { return c('vector-boundingbox', 'boundingbox(width, height) = width · height', width * height, nat(width, height), 'boundingbox', [width, height]) }
  /** NODES: a planar network of edges over components holds that many nodes (a forest). value edges + components. */
  static nodes(edges: number, components: number): CrossFormula { return c('vector-nodes', 'nodes(edges, components) = edges + components', edges + components, nat(edges, components), 'nodes', [edges, components]) }
  /** PATH LENGTH SQUARED: the squared length of a step, no root. value dx² + dy². */
  static pathlengthsq(dx: number, dy: number): CrossFormula { return c('vector-pathlengthsq', 'pathlengthsq(dx, dy) = dx² + dy²', dx * dx + dy * dy, nat(dx, dy), 'pathlengthsq', [dx, dy]) }
  /** SIMPLIFY: the points a thinning pass keeps at keep-of-total. value ⌊points · keep / total⌋. */
  static simplify(points: number, keep: number, total: number): CrossFormula { return c('vector-simplify', 'simplify(points, keep, total) = ⌊points · keep / total⌋', total > 0 ? Math.floor((points * keep) / total) : 0, nat(points, keep, total) && total > 0 && keep <= total, 'simplify', [points, keep, total]) }
  /** STROKE AREA: the area a stroke of some width paints along a length. value length · width. */
  static strokearea(length: number, width: number): CrossFormula { return c('vector-strokearea', 'strokearea(length, width) = length · width', length * width, nat(length, width), 'strokearea', [length, width]) }
  /** WINDING: the net winding of clockwise over counter-clockwise turns. value max(0, cw − ccw). */
  static winding(cw: number, ccw: number): CrossFormula { return c('vector-winding', 'winding(cw, ccw) = max(0, cw − ccw)', Math.max(0, cw - ccw), nat(cw, ccw), 'winding', [cw, ccw]) }
}

for (const name of ['anchorpoints', 'beziersegments', 'boundingbox', 'nodes', 'pathlengthsq', 'simplify', 'strokearea', 'winding'] as const)
  qpuHexRegisterOf('vector', name, (VectorFormulas[name] as (...x: unknown[]) => unknown).bind(VectorFormulas))
