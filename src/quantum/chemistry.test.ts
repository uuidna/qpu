import test from 'node:test'
import assert from 'node:assert/strict'
import { BOHR_ANGSTROM, TUTORIAL_ENERGIES, ansatzCircuit, boys0, energyAt, erf, hydrogen, hydrogenHamiltonian, tutorialChecks, vqeSweep } from './chemistry.js'
import { DensityMatrixSimulator } from './cirq.js'

const close = (a: number, b: number, tolerance: number) => assert.ok(Math.abs(a - b) < tolerance, `${a} is not within ${tolerance} of ${b}`)

test('erf and the Boys function: erf(1), erf(3) and erf(−1) to double precision, F₀(0) = 1, and F₀ at large t tends to ½√(π/t)', () => {
  close(erf(1), 0.8427007929497149, 1e-15)
  close(erf(3), 0.9999779095030014, 1e-15)
  close(erf(-1), -0.8427007929497149, 1e-15)
  close(erf(2.4), 0.9993114861033549, 1e-15)
  close(erf(2.6), 0.9997639655834707, 1e-15)
  assert.equal(boys0(0), 1)
  close(boys0(50), 0.5 * Math.sqrt(Math.PI / 50), 1e-15)
})

test('the Bohr radius used is the one the tutorial\'s nuclear repulsion at 0.7 Å implies', () => {
  close(BOHR_ANGSTROM / 0.7, TUTORIAL_ENERGIES.points[0].nuclearRepulsion, 1e-15)
})

test('the integrals computed here reproduce the energies the OpenFermion tutorial prints at 0.7 and 0.8 Å: nuclear repulsion, Hartree-Fock, full CI and both orbital energies to 10⁻⁹, MP2 to 10⁻⁶', () => {
  const checks = tutorialChecks()
  assert.equal(checks.length, 12)
  for (const c of checks) close(c.computed, c.stated, c.figure === 'MP2' ? 1e-6 : 1e-9)
})

test('at the tutorial\'s 0.7414 Å the full-CI energy is about −1.137 Ha, below Hartree-Fock', () => {
  const m = hydrogen()
  close(m.fci, -1.137, 1e-3)
  assert.ok(m.hartreeFock > m.fci)
  assert.throws(() => hydrogen(0), /positive distance/)
})

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
