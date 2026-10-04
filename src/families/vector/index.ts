import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** VectorFormulas — 8 exact-integer formulas of the vector domain, each at a hex address crossing to cross; develops the vector leads. */

const PROOF = "vector counts: dot(x, y) = x · y; magnitude(x, y) = x / y; dims(x, y) = x + y; scale(x, y) = x · y; components(x, y) = x · y; crossprod(x, y, z) = x · y · z; norm(x, y) = max(0, x − y); combos(x, y) = C(x, y)"
const factOf = (x: number): number => { if (x > 12) return 0; let v = 1; for (let i = 2; i <= x; i++) v *= i; return v }
const combOf = (nn: number, k: number): number => { if (k < 0 || k > nn) return 0; let kk = k > nn - k ? nn - k : k, v = 1; for (let i = 0; i < kk; i++) v = (v * (nn - i)) / (i + 1); return Math.round(v) }
const permOf = (nn: number, k: number): number => (k < 0 || k > nn || nn > 20 ? 0 : combOf(nn, k) * factOf(k))
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const f = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[]): CrossFormula =>
  crossFormulaOf({ id, src: 'vector', dst: 'cross', formula, value, proof: PROOF }, holds, { name: `vector.${name}`, params })

export class VectorFormulas {
  /** dot(x, y) = x · y. */
  static dot(x: number, y: number): CrossFormula { return f('vector-dot', 'dot(x, y) = x · y', x * y, nat(x, y), 'dot', [x, y]) }
  /** magnitude(x, y) = x / y. */
  static magnitude(x: number, y: number): CrossFormula { return f('vector-magnitude', 'magnitude(x, y) = x / y', y > 0 ? Math.floor(x / y) : 0, nat(x, y) && y > 0, 'magnitude', [x, y]) }
  /** dims(x, y) = x + y. */
  static dims(x: number, y: number): CrossFormula { return f('vector-dims', 'dims(x, y) = x + y', x + y, nat(x, y), 'dims', [x, y]) }
  /** scale(x, y) = x · y. */
  static scale(x: number, y: number): CrossFormula { return f('vector-scale', 'scale(x, y) = x · y', x * y, nat(x, y), 'scale', [x, y]) }
  /** components(x, y) = x · y. */
  static components(x: number, y: number): CrossFormula { return f('vector-components', 'components(x, y) = x · y', x * y, nat(x, y), 'components', [x, y]) }
  /** crossprod(x, y, z) = x · y · z. */
  static crossprod(x: number, y: number, z: number): CrossFormula { return f('vector-crossprod', 'crossprod(x, y, z) = x · y · z', x * y * z, nat(x, y, z), 'crossprod', [x, y, z]) }
  /** norm(x, y) = max(0, x − y). */
  static norm(x: number, y: number): CrossFormula { return f('vector-norm', 'norm(x, y) = max(0, x − y)', Math.max(0, x - y), nat(x, y), 'norm', [x, y]) }
  /** combos(x, y) = C(x, y). */
  static combos(x: number, y: number): CrossFormula { return f('vector-combos', 'combos(x, y) = C(x, y)', combOf(x, y), nat(x, y) && y <= x, 'combos', [x, y]) }
}

for (const name of ['combos', 'components', 'crossprod', 'dims', 'dot', 'magnitude', 'norm', 'scale'] as const)
  qpuHexRegisterOf('vector', name, (VectorFormulas[name] as (...x: unknown[]) => unknown).bind(VectorFormulas))
