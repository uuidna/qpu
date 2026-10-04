import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** LINEARALGEBRA — THE SMALL-DIMENSION LINEAR OPERATIONS, AS ARITHMETIC. Vectors and 2x2 matrices are numbers: the dot of
 *  two 2-vectors, the determinant and trace of a 2x2, how many entries a matrix holds, the rank of a diagonal, an L1 norm,
 *  the 2D cross magnitude, and a scalar times a vector. Crosses to `algebra` — linear algebra is algebra over a space. A
 *  measure, every output an exact finite nonnegative integer. */

const PROOF = 'linear-algebra arithmetic (dot, 2x2 determinant & trace, matrix elements, diagonal rank, L1 norm, 2D cross, scalar multiply); small-dimension hex-addressable entries; a measure crossed to algebra'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'linearalgebra', dst: 'algebra', formula, value, proof: PROOF, ...extra }, holds, { name: `linearalgebra.${name}`, params })

export class LinearalgebraFormulas {
  /** DOT of two 2-vectors (a, b) and (b, c). value a·b + b·c. */
  static dot2(a: number, b: number, cc: number): CrossFormula { return c('la-dot2', 'dot2(a, b, c) = a·b + b·c = (a,b)·(b,c)', a * b + b * cc, nat(a, b, cc), 'dot2', [a, b, cc]) }
  /** DETERMINANT of the symmetric 2x2 [[a, b],[b, c]]. value max(0, a·c − b²). */
  static determinant2x2(a: number, b: number, cc: number): CrossFormula { return c('la-determinant2x2', 'determinant2x2(a, b, c) = max(0, a·c − b²), [[a,b],[b,c]]', Math.max(0, a * cc - b * b), nat(a, b, cc), 'determinant2x2', [a, b, cc]) }
  /** TRACE of a 2x2 with diagonal (a, b). value a + b. */
  static trace2(a: number, b: number): CrossFormula { return c('la-trace2', 'trace2(a, b) = a + b', a + b, nat(a, b), 'trace2', [a, b]) }
  /** MATRIX ELEMENTS: the entries of an r×c matrix. value r · c. */
  static matrixelements(r: number, cc: number): CrossFormula { return c('la-matrixelements', 'matrixelements(r, c) = r · c', r * cc, nat(r, cc), 'matrixelements', [r, cc]) }
  /** RANK of the diagonal matrix diag(a, b): the nonzero diagonal entries. value [a≠0] + [b≠0]. */
  static rank(a: number, b: number): CrossFormula { return c('la-rank', 'rank(a, b) = [a≠0] + [b≠0] for diag(a, b)', (a !== 0 ? 1 : 0) + (b !== 0 ? 1 : 0), nat(a, b), 'rank', [a, b]) }
  /** L1 NORM (Manhattan) of the 2-vector (a, b). value |a| + |b|. */
  static norm1(a: number, b: number): CrossFormula { return c('la-norm1', 'norm1(a, b) = |a| + |b|', Math.abs(a) + Math.abs(b), nat(a, b), 'norm1', [a, b]) }
  /** CROSS: the 2D cross magnitude of (a, b) and (c, c). value max(0, a·c − b·c). */
  static cross(a: number, b: number, cc: number): CrossFormula { return c('la-cross', 'cross(a, b, c) = max(0, a·c − b·c) = (a,b)×(c,c)', Math.max(0, a * cc - b * cc), nat(a, b, cc), 'cross', [a, b, cc]) }
  /** SCALAR MULTIPLY: k · (a, b), returned as the L1 norm of the scaled vector. value k·a + k·b. */
  static scalarmul(k: number, a: number, b: number): CrossFormula { return c('la-scalarmul', 'scalarmul(k, a, b) = k·a + k·b = |k·(a,b)|₁', k * a + k * b, nat(k, a, b), 'scalarmul', [k, a, b]) }
}

for (const name of ['cross', 'determinant2x2', 'dot2', 'matrixelements', 'norm1', 'rank', 'scalarmul', 'trace2'] as const)
  qpuHexRegisterOf('linearalgebra', name, (LinearalgebraFormulas[name] as (...x: unknown[]) => unknown).bind(LinearalgebraFormulas))
