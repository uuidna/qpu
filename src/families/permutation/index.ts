import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** PERMUTATION — THE SYMMETRIC GROUP, AS ARITHMETIC. A permutation of n is numbers by the book (Stanley EC1): the n!
 *  arrangements, k-permutations and binomial subsets, the maximum inversions and major index C(n,2) (the Mahonian
 *  statistics, equidistributed), derangements and involutions by their fixed tables, the identity's n cycles and the
 *  moved-point count, the n-1 adjacent transpositions / descents / ascents / excedances that bound a sort, the Eulerian
 *  number A(n,1) = 2^n - n - 1, and the (n-1)! distinct n-cycles. Deterministic integer identities, standard enumerative
 *  combinatorics. Crosses to `combinatorics`. A measure, not advice. */

const F = [1, 1, 2, 6, 24, 120, 720, 5040, 40320] // n! for 0 ≤ n ≤ 8
const D = [1, 0, 1, 2, 9, 44, 265, 1854] // derangements d(n) for 0 ≤ n ≤ 7
const I = [1, 1, 2, 4, 10, 26, 76, 232] // involutions i(n) for 0 ≤ n ≤ 7
const PROOF = 'Permutation arithmetic by the book (Stanley EC1): factorial n! from the table, k-permutations n!/(n−k)! and binomial n!/(k!(n−k)!), maximum inversions and major index C(n,2) (Mahonian, equidistributed), derangements and involutions by table, the identity′s n cycles, fixed = n−moved, the n−1 adjacent transpositions/descents/ascents/excedances bounding a sort, Eulerian A(n,1)=2^n−n−1, and (n−1)! distinct n-cycles; deterministic integer identities crossed to combinatorics; a measure'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const p = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'permutation', dst: 'combinatorics', formula, value, proof: PROOF, ...extra }, holds, { name: `permutation.${name}`, params })

export class PermutationFormulas {
  /** ASCENTS — the maximum ascents of a permutation of n, bounded by the n−1 adjacent gaps. value n − 1; holds n ≥ 1. */
  static ascents(n: number): CrossFormula { return p('permutation-ascents', 'ascents(n) = n − 1 (maximum, n ≥ 1)', n >= 1 ? n - 1 : 0, nat(n) && n >= 1, 'ascents', [n]) }
  /** CHOOSE — the k-element subsets of n, the binomial coefficient. value n! / (k! · (n−k)!); holds 0 ≤ k ≤ n ≤ 8. */
  static choose(n: number, k: number): CrossFormula { return p('permutation-choose', 'choose(n, k) = n! / (k! · (n−k)!)', nat(n, k) && k <= n && n <= 8 ? F[n] / (F[k] * F[n - k]) : 0, nat(n, k) && k <= n && n <= 8, 'choose', [n, k]) }
  /** CYCLES — the maximum disjoint cycles of a permutation of n, the identity's n fixed points. value n. */
  static cycles(n: number): CrossFormula { return p('permutation-cycles', 'cycles(n) = n (maximum, the identity)', n, nat(n), 'cycles', [n]) }
  /** DERANGEMENTS — the permutations of n with no fixed point (subfactorial). value d(n) from the table; holds 0 ≤ n ≤ 7. */
  static derangements(n: number): CrossFormula { return p('permutation-derangements', 'derangements(n) = d(n) = n! · Σ (−1)^k/k!', nat(n) && n <= 7 ? D[n] : 0, nat(n) && n <= 7, 'derangements', [n]) }
  /** DESCENTS — the maximum descents of a permutation of n, bounded by the n−1 adjacent gaps. value n − 1; holds n ≥ 1. */
  static descents(n: number): CrossFormula { return p('permutation-descents', 'descents(n) = n − 1 (maximum, n ≥ 1)', n >= 1 ? n - 1 : 0, nat(n) && n >= 1, 'descents', [n]) }
  /** EULERIAN — the Eulerian number A(n, 1), permutations of n with exactly one descent. value 2^n − n − 1; holds n ≥ 1. */
  static eulerian(n: number): CrossFormula { return p('permutation-eulerian', 'eulerian(n) = A(n, 1) = 2^n − n − 1 (n ≥ 1)', n >= 1 ? Math.pow(2, n) - n - 1 : 0, nat(n) && n >= 1, 'eulerian', [n]) }
  /** EXCEDANCES — the maximum excedances of a permutation of n (positions with π(i) > i). value n − 1; holds n ≥ 1. */
  static excedances(n: number): CrossFormula { return p('permutation-excedances', 'excedances(n) = n − 1 (maximum, n ≥ 1)', n >= 1 ? n - 1 : 0, nat(n) && n >= 1, 'excedances', [n]) }
  /** FACTORIAL — the n! arrangements of n distinct symbols. value n! from the table; holds 0 ≤ n ≤ 8. */
  static factorial(n: number): CrossFormula { return p('permutation-factorial', 'factorial(n) = n! = n · (n−1) ⋯ 1', nat(n) && n <= 8 ? F[n] : 0, nat(n) && n <= 8, 'factorial', [n]) }
  /** FIXEDPOINTS — the fixed points left when `moved` of the n points are displaced. value n − moved; holds moved ≤ n. */
  static fixedpoints(n: number, moved: number): CrossFormula { return p('permutation-fixedpoints', 'fixedpoints(n, moved) = n − moved (moved ≤ n)', moved <= n ? n - moved : 0, nat(n, moved) && moved <= n, 'fixedpoints', [n, moved]) }
  /** INVOLUTIONS — the self-inverse permutations of n (products of fixed points and transpositions). value i(n) from the table; holds 0 ≤ n ≤ 7. */
  static involutions(n: number): CrossFormula { return p('permutation-involutions', 'involutions(n) = i(n) = i(n−1) + (n−1)·i(n−2)', nat(n) && n <= 7 ? I[n] : 0, nat(n) && n <= 7, 'involutions', [n]) }
  /** INVERSIONS — the maximum inversions of a permutation of n, the reversal's C(n,2). value n · (n−1) / 2. */
  static inversions(n: number): CrossFormula { return p('permutation-inversions', 'inversions(n) = C(n, 2) = n · (n−1) / 2 (maximum)', (n * (n - 1)) / 2, nat(n), 'inversions', [n]) }
  /** MAJORINDEX — the maximum major index of a permutation of n, Mahonian with inversions at C(n,2). value n · (n−1) / 2. */
  static majorindex(n: number): CrossFormula { return p('permutation-majorindex', 'majorindex(n) = C(n, 2) = n · (n−1) / 2 (maximum, Mahonian)', (n * (n - 1)) / 2, nat(n), 'majorindex', [n]) }
  /** NCYCLES — the distinct n-cycles of a permutation of n, the unsigned Stirling c(n,1). value (n−1)!; holds 1 ≤ n ≤ 8. */
  static ncycles(n: number): CrossFormula { return p('permutation-ncycles', 'ncycles(n) = c(n, 1) = (n−1)!', nat(n) && n >= 1 && n <= 8 ? F[n - 1] : 0, nat(n) && n >= 1 && n <= 8, 'ncycles', [n]) }
  /** PERMUTATIONS — the ordered k-arrangements of n distinct symbols (k-permutations). value n! / (n−k)!; holds 0 ≤ k ≤ n ≤ 8. */
  static permutations(n: number, k: number): CrossFormula { return p('permutation-permutations', 'permutations(n, k) = n! / (n−k)!', nat(n, k) && k <= n && n <= 8 ? F[n] / F[n - k] : 0, nat(n, k) && k <= n && n <= 8, 'permutations', [n, k]) }
  /** TRANSPOSITIONS — the minimum adjacent transpositions to turn the identity into an n-cycle (to sort the reversal is C(n,2)). value n − 1; holds n ≥ 1. */
  static transpositions(n: number): CrossFormula { return p('permutation-transpositions', 'transpositions(n) = n − 1 (minimum for an n-cycle, n ≥ 1)', n >= 1 ? n - 1 : 0, nat(n) && n >= 1, 'transpositions', [n]) }
}

for (const name of ['ascents', 'choose', 'cycles', 'derangements', 'descents', 'eulerian', 'excedances', 'factorial', 'fixedpoints', 'inversions', 'involutions', 'majorindex', 'ncycles', 'permutations', 'transpositions'] as const)
  qpuHexRegisterOf('permutation', name, (PermutationFormulas[name] as (...x: unknown[]) => unknown).bind(PermutationFormulas))
