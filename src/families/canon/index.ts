import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** CANON — scaffolded integer measures crossed to statistics. Every output an exact finite nonnegative integer. */

const PROOF = 'canon arithmetic (bookcount, readingorders, chapterpairs, versesum, sectiongroupings, booktriples, sequencechoices, chaptertotal); scaffolded from the integer-op palette; a measure crossed to statistics'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'canon', dst: 'statistics', formula, value, proof: PROOF, ...extra }, holds, { name: `canon.${name}`, params })

export class CanonFormulas {
  static bookcount(x: number, y: number): CrossFormula { return c('canon-bookcount', 'bookcount(x, y) = x + y', x + y, nat(x, y), 'bookcount', [x, y]) }
  static readingorders(x: number): CrossFormula { return c('canon-readingorders', 'readingorders(x) = x!', x <= 12 ? ((n: number) => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r })(x) : 0, nat(x) && x <= 12, 'readingorders', [x]) }
  static chapterpairs(x: number, y: number): CrossFormula { return c('canon-chapterpairs', 'chapterpairs(x, y) = C(x, y)', x >= y ? ((n: number, k: number) => { let kk = Math.min(k, n - k); let r = 1; for (let i = 0; i < kk; i++) r = (r * (n - i)) / (i + 1); return Math.round(r) })(x, y) : 0, nat(x, y) && x >= y, 'chapterpairs', [x, y]) }
  static versesum(x: number, y: number): CrossFormula { return c('canon-versesum', 'versesum(x, y) = x · y', x * y, nat(x, y), 'versesum', [x, y]) }
  static sectiongroupings(x: number): CrossFormula { return c('canon-sectiongroupings', 'sectiongroupings(x) = 2^x', x <= 30 ? 2 ** x : 0, nat(x) && x <= 30, 'sectiongroupings', [x]) }
  static booktriples(x: number, y: number): CrossFormula { return c('canon-booktriples', 'booktriples(x, y) = C(x, y)', x >= y ? ((n: number, k: number) => { let kk = Math.min(k, n - k); let r = 1; for (let i = 0; i < kk; i++) r = (r * (n - i)) / (i + 1); return Math.round(r) })(x, y) : 0, nat(x, y) && x >= y, 'booktriples', [x, y]) }
  static sequencechoices(x: number, y: number): CrossFormula { return c('canon-sequencechoices', 'sequencechoices(x, y) = x! / (x − y)!', x >= y && x <= 20 ? ((n: number, k: number) => { let r = 1; for (let i = 0; i < k; i++) r *= (n - i); return r })(x, y) : 0, nat(x, y) && x >= y && x <= 20, 'sequencechoices', [x, y]) }
  static chaptertotal(x: number, y: number): CrossFormula { return c('canon-chaptertotal', 'chaptertotal(x, y) = x + y', x + y, nat(x, y), 'chaptertotal', [x, y]) }
}

for (const name of ['bookcount', 'booktriples', 'chapterpairs', 'chaptertotal', 'readingorders', 'sectiongroupings', 'sequencechoices', 'versesum'] as const)
  qpuHexRegisterOf('canon', name, (CanonFormulas[name] as (...x: unknown[]) => unknown).bind(CanonFormulas))
