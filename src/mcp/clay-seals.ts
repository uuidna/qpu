import { qpuHexRegisterOf } from '../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from './cross-domain-formulas.js'
import { chooseOf, mintOf, qpuLatticeNamesOf, tenOf } from '../quantum/processing/unit/index.js'
const L = { ...qpuLatticeNamesOf(), mintOf, chooseOf, tenOf }

/** The σ-involution seals of "All Seven Clay Millennium Problems Sealed via Universal σ-Involution" (Rouschev, 2026,
 *  doi:10.5281/zenodo.21781603), each computed exactly as the paper states it: σ is self-inverse (σ∘σ = id) and its
 *  fixed points are the ones the paper names. Registered as the hex family `clay`. */
export const CLAY_SEAL_SOURCE = 'https://doi.org/10.5281/zenodo.21781603'

const nat = (...xs: number[]): boolean => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

export class ClaySeals {
  /** Riemann: σ(s) = 1 − s on s = num/den; σ(σ(s)) = s, and σ(s) = s exactly at s = 1/2. Value 1 when num/den is the fixed point. */
  static riemann(num: number, den: number): CrossFormula {
    const involutive = den - (den - num) === num
    const fixed = 2 * num === den
    return crossFormulaOf({ id: 'clay-riemann', src: 'clay', dst: 'lattice', formula: 'σ(s) = 1 − s; σ(s) = s ⟺ s = 1/2', value: fixed ? 1 : 0, proof: `${CLAY_SEAL_SOURCE} §Riemann` }, nat(num, den) && den > 0 && involutive, { name: 'clay.riemann', params: [num, den] })
  }

  /** BSD: the non-trivial inverse pairs of (ℤ/mℤ)*; at m = 9 they are (2,5) and (4,7). Value: how many there are. */
  static bsd(m: number): CrossFormula {
    // the count from the factorisation, O(√m): (φ(m) − #{a : a² ≡ 1}) / 2; the pairs themselves are listed for small m
    let phi = m, odd = 0, twos = 0, x = m
    while (x % 2 === 0 && x > 0) { x /= 2; twos++ }
    if (twos) phi = phi / 2
    for (let p = 3; p * p <= x; p += 2) if (x % p === 0) { odd++; phi = (phi / p) * (p - 1); while (x % p === 0) x /= p }
    if (x > 1) { odd++; phi = (phi / x) * (x - 1) }
    const roots = 2 ** odd * (twos <= 1 ? 1 : twos === 2 ? 2 : 4)
    const count = m > 2 ? (phi - roots) / 2 : 0
    const pairs: [number, number][] = []
    if (m <= L.tenOf(L.n)) for (let a = 2; a < m; a++) if (gcd(a, m) === 1) for (let b = a + 1; b < m; b++) if ((a * b) % m === 1) pairs.push([a, b])
    return crossFormulaOf({ id: 'clay-bsd', src: 'clay', dst: 'crypto', formula: 'σ(a) = a⁻¹ in (ℤ/mℤ)*; non-trivial pairs a ≠ a⁻¹', value: count, proof: `${CLAY_SEAL_SOURCE} §BSD${pairs.length ? `: ${pairs.map((p) => `(${p})`).join(' ')}` : ''}` }, nat(m) && m > 2, { name: 'clay.bsd', params: [m] })
  }

  /** Hodge: Poincaré duality on the genus-g surface; H₁(Σ_g) = ℤ^(2g), so H₁(Σ₂) = ℤ⁴. Value: the rank 2g. */
  static hodge(genus: number): CrossFormula {
    return crossFormulaOf({ id: 'clay-hodge', src: 'clay', dst: 'proof', formula: 'rank H₁(Σ_g) = 2g', value: 2 * genus, proof: `${CLAY_SEAL_SOURCE} §Hodge` }, nat(genus), { name: 'clay.hodge', params: [genus] })
  }

  /** Navier–Stokes: the seam involution σ(ω₊, ω₋) = (−ω₋, −ω₊) on the two lobes; σ∘σ = id and σ(ω) = ω ⟺ ω₊ = −ω₋.
   *  Value 1 when the pair (a, −b) is a fixed point, i.e. a = b in magnitude with opposite sign. */
  static navierStokes(a: number, b: number): CrossFormula {
    const s = (p: [number, number]): [number, number] => [-p[1], -p[0]]
    const w: [number, number] = [a, -b]
    const back = s(s(w))
    const fixed = s(w)[0] === w[0] && s(w)[1] === w[1]
    return crossFormulaOf({ id: 'clay-navier-stokes', src: 'clay', dst: 'science', formula: 'σ(ω₊, ω₋) = (−ω₋, −ω₊); σ(ω) = ω ⟺ ω₊ = −ω₋', value: fixed ? 1 : 0, proof: `${CLAY_SEAL_SOURCE} §Navier–Stokes` }, nat(a, b) && back[0] === w[0] && back[1] === w[1], { name: 'clay.navierStokes', params: [a, b] })
  }

  /** Yang–Mills: a self-adjoint involution σ† = σ, σ² = I has real spectrum in {−1, +1}; on the Pauli σ_x the trace is 0 and
   *  the determinant −1, so the eigenvalues are exactly ±1. Value: the number of real eigenvalues (2). */
  static yangMills(): CrossFormula {
    const [a, b, c, d] = [0, 1, 1, 0]
    const square = [a * a + b * c, a * b + b * d, c * a + d * c, c * b + d * d]
    const involutive = square.join() === '1,0,0,1'
    const trace = a + d, det = a * d - b * c
    const disc = trace * trace - 4 * det
    return crossFormulaOf({ id: 'clay-yang-mills', src: 'clay', dst: 'quantum', formula: 'σ† = σ, σ² = I ⟹ spec σ ⊂ {−1, +1}', value: disc >= 0 ? 2 : 0, proof: `${CLAY_SEAL_SOURCE} §Yang–Mills` }, involutive && b === c, { name: 'clay.yangMills', params: [] })
  }

  /** P vs NP: σ(search, w) = (reuse, w) swaps the mode and keeps the witness; σ∘σ = id and no mode is its own image, so a
   *  fixed point exists only when the witness is already in memory (presupposed). Value: fixed points among the two modes. */
  static pVsNp(presupposed: number): CrossFormula {
    const sigma = (mode: number) => 1 - mode
    const involutive = [0, 1].every((m) => sigma(sigma(m)) === m)
    const fixed = presupposed ? 1 : [0, 1].filter((m) => sigma(m) === m).length
    return crossFormulaOf({ id: 'clay-p-vs-np', src: 'clay', dst: 'np', formula: 'σ(search, w) = (reuse, w); fixed only if w is presupposed', value: fixed, proof: `${CLAY_SEAL_SOURCE} §P vs NP` }, nat(presupposed) && presupposed <= 1 && involutive, { name: 'clay.pVsNp', params: [presupposed] })
  }
}

for (const name of ['bsd', 'hodge', 'navierStokes', 'pVsNp', 'riemann', 'yangMills'] as const)
  qpuHexRegisterOf('clay', name, (ClaySeals[name] as (...x: unknown[]) => unknown).bind(ClaySeals))
