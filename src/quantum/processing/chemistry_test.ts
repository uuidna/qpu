import test from 'node:test'
import assert from 'node:assert/strict'
import { BOHR_ANGSTROM, TUTORIAL_ENERGIES, ansatzCircuit, boys0, energyAt, erf, hydrogen, hydrogenHamiltonian, jordanWigner, tutorialChecks, vqeSweep } from './chemistry.ts'
import { DensityMatrixSimulator } from './cirq.ts'

const close = (a: number, b: number, tolerance: number) => assert.ok(Math.abs(a - b) < tolerance, `${a} is not within ${tolerance} of ${b}`)

/** ISO/IEC/IEEE 29119-3 test case. Identifier: erf and the Boys function: erf(1), erf(3) and erf(−1) to double precision, F₀(0) = 1, and F₀ at large t tends to ½√(π/t). */
test('erf and the Boys function: erf(1), erf(3) and erf(−1) to double precision, F₀(0) = 1, and F₀ at large t tends to ½√(π/t)', () => {
  close(erf(1), 0.8427007929497149, 1e-15)
  close(erf(3), 0.9999779095030014, 1e-15)
  close(erf(-1), -0.8427007929497149, 1e-15)
  close(erf(2.4), 0.9993114861033549, 1e-15)
  close(erf(2.6), 0.9997639655834707, 1e-15)
  assert.equal(boys0(0), 1)
  close(boys0(50), 0.5 * Math.sqrt(Math.PI / 50), 1e-15)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the Bohr radius used is the one the tutorial's nuclear repulsion at 0.7 Å implies. */
test('the Bohr radius used is the one the tutorial\'s nuclear repulsion at 0.7 Å implies', () => {
  close(BOHR_ANGSTROM / 0.7, TUTORIAL_ENERGIES.points[0].nuclearRepulsion, 1e-15)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the integrals computed here reproduce the energies the OpenFermion tutorial prints at 0.7 and 0.8 Å: nuclear repulsion, Hartree-Fock, full CI and both orbital energies to 10⁻⁹, MP2 to 10⁻⁶. */
test('the integrals computed here reproduce the energies the OpenFermion tutorial prints at 0.7 and 0.8 Å: nuclear repulsion, Hartree-Fock, full CI and both orbital energies to 10⁻⁹, MP2 to 10⁻⁶', () => {
  const checks = tutorialChecks()
  assert.equal(checks.length, 12)
  for (const c of checks) close(c.computed, c.stated, c.figure === 'MP2' ? 1e-6 : 1e-9)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: at the tutorial's 0.7414 Å the full-CI energy is about −1.137 Ha, below Hartree-Fock. */
test('at the tutorial\'s 0.7414 Å the full-CI energy is about −1.137 Ha, below Hartree-Fock', () => {
  const m = hydrogen()
  close(m.fci, -1.137, 1e-3)
  assert.ok(m.hartreeFock > m.fci)
  assert.throws(() => hydrogen(0), /positive distance/)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the two-qubit Hamiltonian has real Pauli terms whose identity term carries the nuclear repulsion, and its energy on |00⟩ is the Hartree-Fock energy. */
test('the two-qubit Hamiltonian has real Pauli terms whose identity term carries the nuclear repulsion, and its energy on |00⟩ is the Hartree-Fock energy', () => {
  const m = hydrogen()
  const terms = hydrogenHamiltonian(m)
  assert.deepEqual(terms.map((t) => t.label).sort(), ['I', 'X0X1', 'Z0', 'Z0Z1', 'Z1'])
  const z0 = terms.find((t) => t.label === 'Z0')!
  const z1 = terms.find((t) => t.label === 'Z1')!
  close(z0.coefficient, z1.coefficient, 1e-12)
  close(terms.find((t) => t.label === 'X0X1')!.coefficient, m.eri.gugu, 1e-12)
  close(energyAt(terms, 0), m.hartreeFock, 1e-12)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the ansatz exp(−iθ Y⊗X) takes |00⟩ to cos θ|00⟩ + sin θ|11⟩, and the VQE sweep finds the full-CI energy from simulated expectation values. */
test('the ansatz exp(−iθ Y⊗X) takes |00⟩ to cos θ|00⟩ + sin θ|11⟩, and the VQE sweep finds the full-CI energy from simulated expectation values', () => {
  const theta = 0.3
  const state = new DensityMatrixSimulator().simulate(ansatzCircuit(theta))
  close(state.probabilities[0]!, Math.cos(theta) ** 2, 1e-12)
  close(state.probabilities[3]!, Math.sin(theta) ** 2, 1e-12)
  close(state.probabilities[1]! + state.probabilities[2]!, 0, 1e-12)
  const m = hydrogen()
  const sweep = vqeSweep(hydrogenHamiltonian(m), 36)
  close(sweep.best.energy, m.fci, 1e-9)
  close(sweep.best.energy, -1.137, 1e-3)
  assert.equal(sweep.grid.length, 36)
  assert.ok(sweep.evaluations > 36)
  assert.throws(() => vqeSweep(hydrogenHamiltonian(m), 2), /at least 4/)
})

const term = (label: string, rows: { label: string; coefficient: number; imaginary: number }[]) => rows.find((row) => row.label === label)

/** ISO/IEC/IEEE 29119-3 test case. Identifier: Jordan–Wigner sends a†₀a₀ to (I − Z₀)/2 and the hopping term to (X₀X₁ + Y₀Y₁)/2. */
test('Jordan–Wigner sends a†₀a₀ to (I − Z₀)/2 and the hopping term to (X₀X₁ + Y₀Y₁)/2', () => {
  const number = jordanWigner({ coefficient: 1, operators: [{ mode: 0, dagger: true }, { mode: 0, dagger: false }] })
  assert.equal(number.length, 2)
  close(term('I', number)!.coefficient, 0.5, 1e-12)
  close(term('Z0', number)!.coefficient, -0.5, 1e-12)
  assert.ok(number.every((row) => Math.abs(row.imaginary) < 1e-12))
  const down = jordanWigner({ coefficient: 1, operators: [{ mode: 0, dagger: true }, { mode: 1, dagger: false }] })
  const up = jordanWigner({ coefficient: 1, operators: [{ mode: 1, dagger: true }, { mode: 0, dagger: false }] })
  const labels = new Map<string, { re: number; im: number }>()
  for (const row of [...down, ...up]) {
    const prior = labels.get(row.label) ?? { re: 0, im: 0 }
    labels.set(row.label, { re: prior.re + row.coefficient, im: prior.im + row.imaginary })
  }
  const kept = [...labels.entries()].filter(([, v]) => Math.hypot(v.re, v.im) > 1e-12)
  assert.equal(kept.length, 2)
  close(labels.get('X0X1')!.re, 0.5, 1e-12)
  close(labels.get('Y0Y1')!.re, 0.5, 1e-12)
  assert.ok(kept.every(([, v]) => Math.abs(v.im) < 1e-12))
  assert.throws(() => jordanWigner({ coefficient: 1, operators: [{ mode: -1, dagger: true }] }), /at least 0/)
})
