// Molecular hydrogen in the STO-3G basis, computed here from the published basis constants: the one- and two-electron integrals
// over the two contracted s Gaussians (closed forms for s-type Gaussians, Szabo & Ostlund, Modern Quantum Chemistry, appendix A),
// the bonding and antibonding orbitals the molecule's symmetry fixes, the Hartree-Fock, MP2 and full-CI energies, and the
// two-electron Hamiltonian in the singlet S_z = 0 sector as a two-qubit Pauli-term operator. The OpenFermion tutorial on
// quantumai.google (openfermion/tutorials/intro_to_openfermion) prints no qubit Hamiltonian for H₂; it prints the molecule's
// energies at bond lengths 0.7 and 0.8 Å from OpenFermion's data, and the integrals here are checked against those printed
// figures in the tests and in the tool's output. Every energy a VQE sweep returns is an expectation value of a simulated state.

import { Circuit, DensityMatrixSimulator, LineQubit, applied, exponentiateGate, computeExpectation, pauliProduct } from './cirq.ts'

/** The STO-3G hydrogen 1s function: three primitive Gaussians, exponents and contraction coefficients as Hehre, Stewart and
 *  Pople fit them (J. Chem. Phys. 51, 2657 (1969)), with the exponents scaled for hydrogen (ζ = 1.24), as the basis set is
 *  distributed. */
export const STO3G_H = {
  exponents: [3.42525091, 0.62391373, 0.1688554],
  coefficients: [0.15432897, 0.53532814, 0.44463454],
  source: 'Hehre, Stewart, Pople, J. Chem. Phys. 51, 2657 (1969); STO-3G hydrogen as distributed',
} as const

/** The Bohr radius OpenFermion's data used, in ångström, recovered from the tutorial's printed nuclear repulsion at 0.7 Å
 *  (0.7559674408428572 Ha = 1 / (0.7 Å / a₀)): 0.52917720859 Å, the CODATA 2006 value. */
export const BOHR_ANGSTROM = 0.52917720859

/** The energies the OpenFermion tutorial prints for H₂ (STO-3G, singlet) at two bond lengths, as stated there. */
export const TUTORIAL_ENERGIES = {
  source: 'quantumai.google/openfermion/tutorials/intro_to_openfermion, the printed energies of molecular hydrogen',
  bondLengthDefault: 0.7414,
  points: [
    { bondLength: 0.7, hartreeFock: -1.1173490350703141, mp2: -1.1295815518324286, fci: -1.1361894542708848, nuclearRepulsion: 0.7559674408428572, orbitalEnergies: [-0.5954634716745077, 0.7141652810054977] },
    { bondLength: 0.8, hartreeFock: -1.1108503969854677, mp2: -1.125453091983669, fci: -1.1341476663578605, nuclearRepulsion: 0.6614715107375, orbitalEnergies: [-0.5544958797639515, 0.6126180834930599] },
  ],
} as const

/** The error function: its Taylor series up to 2.5, and the continued fraction of erfc beyond, each to double precision. */
export const erf = (x: number): number => {
  const ax = Math.abs(x)
  if (ax <= 2.5) {
    let term = ax
    let sum = ax
    for (let n = 1; n < 200; n++) {
      term *= (-ax * ax) / n
      const next = term / (2 * n + 1)
      sum += next
      if (Math.abs(next) < 1e-17 * Math.abs(sum)) break
    }
    return Math.sign(x) * (2 / Math.sqrt(Math.PI)) * sum
  }
  let f = ax
  for (let n = 80; n >= 1; n--) f = ax + n / 2 / f
  const erfc = Math.exp(-ax * ax) / Math.sqrt(Math.PI) / f
  return Math.sign(x) * (1 - erfc)
}

/** The Boys function of order zero, F₀(t) = ½√(π/t)·erf(√t), with its series at small t. */
export const boys0 = (t: number): number => (t < 1e-10 ? 1 - t / 3 : (0.5 * Math.sqrt(Math.PI / t)) * erf(Math.sqrt(t)))

type Vec = readonly [number, number, number]
const dist2 = (a: Vec, b: Vec): number => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2
const centre = (alpha: number, a: Vec, beta: number, b: Vec): Vec => {
  const p = alpha + beta
  return [(alpha * a[0] + beta * b[0]) / p, (alpha * a[1] + beta * b[1]) / p, (alpha * a[2] + beta * b[2]) / p]
}
/** The normalization of a primitive s Gaussian exp(−α r²): (2α/π)^{3/4}. */
const norm = (alpha: number): number => (2 * alpha / Math.PI) ** 0.75

/** A contracted s function: its centre (bohr) and its primitives, each an exponent with its contraction coefficient. */
type Contracted = { centre: Vec; primitives: readonly { alpha: number; d: number }[] }

/** The overlap of two primitives. */
const overlapP = (a: number, A: Vec, b: number, B: Vec): number => {
  const p = a + b
  return norm(a) * norm(b) * (Math.PI / p) ** 1.5 * Math.exp((-a * b / p) * dist2(A, B))
}
/** The kinetic energy integral of two primitives. */
const kineticP = (a: number, A: Vec, b: number, B: Vec): number => {
  const p = a + b
  const ab = (a * b) / p
  return norm(a) * norm(b) * ab * (3 - 2 * ab * dist2(A, B)) * (Math.PI / p) ** 1.5 * Math.exp(-ab * dist2(A, B))
}
/** The attraction of two primitives to a nucleus of charge Z at C. */
const nuclearP = (a: number, A: Vec, b: number, B: Vec, C: Vec, Z: number): number => {
  const p = a + b
  const P = centre(a, A, b, B)
  return norm(a) * norm(b) * (-2 * Math.PI / p) * Z * Math.exp((-a * b / p) * dist2(A, B)) * boys0(p * dist2(P, C))
}
/** The two-electron repulsion (ab|cd) of four primitives, in chemist's notation. */
const repulsionP = (a: number, A: Vec, b: number, B: Vec, c: number, C: Vec, d: number, D: Vec): number => {
  const p = a + b
  const q = c + d
  const P = centre(a, A, b, B)
  const Q = centre(c, C, d, D)
  return norm(a) * norm(b) * norm(c) * norm(d) * (2 * Math.PI ** 2.5) / (p * q * Math.sqrt(p + q)) *
    Math.exp((-a * b / p) * dist2(A, B) - (c * d / q) * dist2(C, D)) * boys0(((p * q) / (p + q)) * dist2(P, Q))
}

const contract2 = (x: Contracted, y: Contracted, f: (a: number, A: Vec, b: number, B: Vec) => number): number => {
  let sum = 0
  for (const i of x.primitives) for (const j of y.primitives) sum += i.d * j.d * f(i.alpha, x.centre, j.alpha, y.centre)
  return sum
}
const contract4 = (w: Contracted, x: Contracted, y: Contracted, z: Contracted): number => {
  let sum = 0
  for (const i of w.primitives) for (const j of x.primitives) for (const k of y.primitives) for (const l of z.primitives) {
    sum += i.d * j.d * k.d * l.d * repulsionP(i.alpha, w.centre, j.alpha, x.centre, k.alpha, y.centre, l.alpha, z.centre)
  }
  return sum
}

/** The molecule's integrals and energies at one bond length: the atomic-orbital matrices, the molecular orbitals g and u, the
 *  one-electron integrals h_pq and the two-electron (pq|rs) over them, the nuclear repulsion, and the Hartree-Fock, MP2 and
 *  full-CI energies the integrals give. All in hartree; the bond length in ångström. */
type Hydrogen = {
  bondLength: number
  nuclearRepulsion: number
  overlapAB: number
  h: { gg: number; uu: number }
  eri: { gggg: number; uuuu: number; gguu: number; gugu: number }
  orbitalEnergies: [number, number]
  hartreeFock: number
  mp2: number
  fci: number
}

export const hydrogen = (bondLength: number = TUTORIAL_ENERGIES.bondLengthDefault): Hydrogen => {
  if (!(bondLength > 0)) throw new Error('the bond length is a positive distance in ångström')
  const R = bondLength / BOHR_ANGSTROM
  const A: Vec = [0, 0, 0]
  const B: Vec = [0, 0, R]
  const primitives = STO3G_H.exponents.map((alpha, i) => ({ alpha, d: STO3G_H.coefficients[i]! }))
  const raw = (c: Vec): Contracted => ({ centre: c, primitives })
  // normalize each contracted function, as the electronic-structure packages do
  const normalized = (c: Vec): Contracted => {
    const r = raw(c)
    const s = contract2(r, r, overlapP)
    return { centre: c, primitives: primitives.map((p) => ({ alpha: p.alpha, d: p.d / Math.sqrt(s) })) }
  }
  const chi = [normalized(A), normalized(B)]
  const S = chi.map((x) => chi.map((y) => contract2(x, y, overlapP)))
  const Hcore = chi.map((x) => chi.map((y) => contract2(x, y, kineticP) + contract2(x, y, (a, Ac, b, Bc) => nuclearP(a, Ac, b, Bc, A, 1) + nuclearP(a, Ac, b, Bc, B, 1))))
  const eri = chi.map((w) => chi.map((x) => chi.map((y) => chi.map((z) => contract4(w, x, y, z)))))
  const sAB = S[0]![1]!
  // the symmetric and antisymmetric combinations: the molecular orbitals of a homonuclear diatomic in a minimal basis
  const C = [[1 / Math.sqrt(2 * (1 + sAB)), 1 / Math.sqrt(2 * (1 + sAB))], [1 / Math.sqrt(2 * (1 - sAB)), -1 / Math.sqrt(2 * (1 - sAB))]]
  const h1 = (p: number, q: number): number => {
    let sum = 0
    for (let m = 0; m < 2; m++) for (let n = 0; n < 2; n++) sum += C[p]![m]! * C[q]![n]! * Hcore[m]![n]!
    return sum
  }
  const h2 = (p: number, q: number, r: number, s: number): number => {
    let sum = 0
    for (let m = 0; m < 2; m++) for (let n = 0; n < 2; n++) for (let l = 0; l < 2; l++) for (let k = 0; k < 2; k++) {
      sum += C[p]![m]! * C[q]![n]! * C[r]![l]! * C[s]![k]! * eri[m]![n]![l]![k]!
    }
    return sum
  }
  const [g, u] = [0, 1]
  const hgg = h1(g, g), huu = h1(u, u)
  const gggg = h2(g, g, g, g), uuuu = h2(u, u, u, u), gguu = h2(g, g, u, u), gugu = h2(g, u, g, u)
  const nuclearRepulsion = 1 / R
  const epsG = hgg + gggg
  const epsU = huu + 2 * gguu - gugu
  const hartreeFock = 2 * hgg + gggg + nuclearRepulsion
  // second-order perturbation with one occupied and one virtual orbital
  const mp2 = hartreeFock - (gugu * gugu) / (2 * (epsU - epsG))
  // the ground state of the singlet sector: the lower eigenvalue of the 2 × 2 block coupling |gg⟩ and |uu⟩ by (gu|gu)
  const e00 = 2 * hgg + gggg
  const e11 = 2 * huu + uuuu
  const fci = (e00 + e11) / 2 - Math.sqrt(((e00 - e11) / 2) ** 2 + gugu * gugu) + nuclearRepulsion
  return { bondLength, nuclearRepulsion, overlapAB: sAB, h: { gg: hgg, uu: huu }, eri: { gggg, uuuu, gguu, gugu }, orbitalEnergies: [epsG, epsU], hartreeFock, mp2, fci }
}

/** A Pauli term of a qubit Hamiltonian: a real coefficient and the Paulis by qubit key (unlisted qubits take the identity). */
type PauliTerm = { coefficient: number; paulis: Record<string, 'X' | 'Y' | 'Z'>; label: string }

/** The two-qubit Hamiltonian of H₂ in the two-electron S_z = 0 sector: qubit line:0 says which orbital the spin-up electron
 *  occupies (|0⟩ = g, |1⟩ = u) and line:1 the same for spin-down. The 4 × 4 matrix elements follow the Slater-Condon rules for
 *  opposite-spin determinants, ⟨ab|H|cd⟩ = h_ac δ_bd + h_bd δ_ac + (ac|bd), and the operator is decomposed in the Pauli basis as
 *  c_P = Tr(P·H)/4. The nuclear repulsion is in the identity term. */
export const hydrogenHamiltonian = (molecule: Hydrogen): PauliTerm[] => {
  const { h, eri, nuclearRepulsion } = molecule
  // basis index = a + 2b, a the spin-up orbital (0 g, 1 u), b the spin-down orbital
  const H = [
    [2 * h.gg + eri.gggg + nuclearRepulsion, 0, 0, eri.gugu],
    [0, h.gg + h.uu + eri.gguu + nuclearRepulsion, eri.gugu, 0],
    [0, eri.gugu, h.gg + h.uu + eri.gguu + nuclearRepulsion, 0],
    [eri.gugu, 0, 0, 2 * h.uu + eri.uuuu + nuclearRepulsion],
  ]
  const single: Record<'I' | 'X' | 'Y' | 'Z', [number, number][][]> = {
    I: [[[1, 0], [0, 0]], [[0, 0], [1, 0]]],
    X: [[[0, 0], [1, 0]], [[1, 0], [0, 0]]],
    Y: [[[0, 0], [0, -1]], [[0, 1], [0, 0]]],
    Z: [[[1, 0], [0, 0]], [[0, 0], [-1, 0]]],
  }
  const terms: PauliTerm[] = []
  for (const p0 of ['I', 'X', 'Y', 'Z'] as const) for (const p1 of ['I', 'X', 'Y', 'Z'] as const) {
    // Tr(P H) with P = p0 on bit 0 and p1 on bit 1, H real: Σ_ij P[j][i]·H[i][j]
    let re = 0
    let im = 0
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
      const [a0, b0] = single[p0][j & 1]![i & 1]!
      const [a1, b1] = single[p1][j >> 1]![i >> 1]!
      re += (a0 * a1 - b0 * b1) * H[i]![j]!
      im += (a0 * b1 + b0 * a1) * H[i]![j]!
    }
    if (Math.abs(im) > 1e-12) throw new Error('the Hamiltonian is Hermitian, so every Pauli coefficient is real')
    const coefficient = re / 4
    if (Math.abs(coefficient) < 1e-12) continue
    const paulis: Record<string, 'X' | 'Y' | 'Z'> = {}
    if (p0 !== 'I') paulis['line:0'] = p0
    if (p1 !== 'I') paulis['line:1'] = p1
    terms.push({ coefficient, paulis, label: `${p0}${p1}` === 'II' ? 'I' : `${p0 === 'I' ? '' : p0 + '0'}${p1 === 'I' ? '' : p1 + '1'}` })
  }
  return terms
}

/** The ansatz circuit: the Hartree-Fock state |gg⟩ = |00⟩ rotated by exp(−iθ Y⊗X), which takes it to cos θ|00⟩ + sin θ|11⟩, the
 *  double excitation the singlet ground state needs (the single excitations do not mix in by symmetry). */
export const ansatzCircuit = (theta: number): Circuit => {
  const [q0, q1] = LineQubit.range(2)
  return new Circuit([applied(exponentiateGate(pauliProduct(['Y', 'X']), theta), q0!, q1!)])
}

/** The energy of the ansatz at θ: the Pauli terms' expectation values on the simulated density matrix, summed. */
export const energyAt = (terms: readonly PauliTerm[], theta: number): number => {
  const state = new DensityMatrixSimulator().simulate(ansatzCircuit(theta))
  return terms.reduce((sum, t) => sum + t.coefficient * computeExpectation(state, t.paulis), 0)
}

/** The VQE sweep: θ over a grid of [−π/2, π/2), each energy from the simulator, then a golden-section search between the
 *  neighbours of the best grid point, also by simulated energies, to the tolerance given. */
export const vqeSweep = (terms: readonly PauliTerm[], steps = 180, tolerance = 1e-12): { grid: { theta: number; energy: number }[]; best: { theta: number; energy: number }; evaluations: number } => {
  if (!Number.isInteger(steps) || steps < 4) throw new Error('the sweep needs at least 4 steps')
  let evaluations = 0
  const at = (theta: number): number => {
    evaluations += 1
    return energyAt(terms, theta)
  }
  const grid = Array.from({ length: steps }, (_, i) => {
    const theta = -Math.PI / 2 + (Math.PI * i) / steps
    return { theta, energy: at(theta) }
  })
  let bestIndex = 0
  grid.forEach((g, i) => { if (g.energy < grid[bestIndex]!.energy) bestIndex = i })
  const step = Math.PI / steps
  let lo = grid[bestIndex]!.theta - step
  let hi = grid[bestIndex]!.theta + step
  const phi = (Math.sqrt(5) - 1) / 2
  let x1 = hi - phi * (hi - lo)
  let x2 = lo + phi * (hi - lo)
  let f1 = at(x1)
  let f2 = at(x2)
  while (hi - lo > tolerance) {
    if (f1 < f2) {
      hi = x2
      x2 = x1
      f2 = f1
      x1 = hi - phi * (hi - lo)
      f1 = at(x1)
    } else {
      lo = x1
      x1 = x2
      f1 = f2
      x2 = lo + phi * (hi - lo)
      f2 = at(x2)
    }
  }
  const theta = (lo + hi) / 2
  return { grid, best: { theta, energy: at(theta) }, evaluations }
}

/** The computed figures against the tutorial's printed ones, at the bond lengths it prints: each a stated value, the value the
 *  integrals here give, and their difference. */
export const tutorialChecks = (): { bondLength: number; figure: string; stated: number; computed: number; difference: number }[] =>
  TUTORIAL_ENERGIES.points.flatMap((point) => {
    const m = hydrogen(point.bondLength)
    const pairs: [string, number, number][] = [
      ['nuclear repulsion', point.nuclearRepulsion, m.nuclearRepulsion],
      ['Hartree-Fock', point.hartreeFock, m.hartreeFock],
      ['MP2', point.mp2, m.mp2],
      ['FCI', point.fci, m.fci],
      ['orbital energy g', point.orbitalEnergies[0], m.orbitalEnergies[0]],
      ['orbital energy u', point.orbitalEnergies[1], m.orbitalEnergies[1]],
    ]
    return pairs.map(([figure, stated, computed]) => ({ bondLength: point.bondLength, figure, stated, computed, difference: computed - stated }))
  })
