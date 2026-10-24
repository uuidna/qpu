import test from 'node:test'
import assert from 'node:assert/strict'
import { Circuit, DensityMatrixSimulator, LineQubit, Simulator, X, applied, expectationOf } from './cirq.js'
import { groverCircuit, inverseOperations, messageCircuit, phaseEstimationCircuit, qaoaExpectedCut, qftOperations, teleportationCircuit } from './algorithms.js'

const n = 3
const N = 1 << n

test('the QFT maps |x> to the discrete Fourier basis: amplitude e^(2πi·x·k/N)/√N at state k', () => {
  const x = 5
  const qs = LineQubit.range(n)
  const c = new Circuit().append(qs.filter((_, i) => (x >> i) & 1).map((q) => applied(X, q))).append(qftOperations(qs))
  const { amplitudes } = new Simulator().simulate(c)
  for (let k = 0; k < N; k++) {
    const angle = (2 * Math.PI * x * k) / N
    assert.ok(Math.abs(amplitudes[k]![0] - Math.cos(angle) / Math.sqrt(N)) < 1e-9, `re at ${k}`)
    assert.ok(Math.abs(amplitudes[k]![1] - Math.sin(angle) / Math.sqrt(N)) < 1e-9, `im at ${k}`)
  }
})

test('the inverse QFT undoes the QFT: |x> is returned exactly', () => {
  const x = 6
  const qs = LineQubit.range(n)
  const ops = qftOperations(qs)
  const c = new Circuit().append(qs.filter((_, i) => (x >> i) & 1).map((q) => applied(X, q))).append(ops).append(inverseOperations(ops))
  const { amplitudes } = new Simulator().simulate(c)
  assert.ok(Math.abs(amplitudes[x]![0] - 1) < 1e-9)
})

test('phase estimation of θ = 0.234 with three bits peaks at 0.25, the nearest multiple of 1/8', () => {
  const run = new Simulator().run(phaseEstimationCircuit(0.234, 3), 2000)
  const counts = new Map<number, number>()
  for (const bits of run.measurements('m')) {
    // bit k of the estimate is the k-th measured qubit, so the string is read least significant first
    const value = [...bits].reduce((sum, b, k) => sum + Number(b) * 2 ** k, 0) / 8
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }
  const [best] = [...counts.entries()].sort((a, b) => b[1] - a[1])
  assert.equal(best![0], 0.25)
  assert.ok(best![1] > 1500)
})

test('Grover on two qubits finds the marked |00> with certainty in one iteration', () => {
  const run = new Simulator().run(groverCircuit(), 10)
  assert.deepEqual([...new Set(run.measurements('result'))], ['00'])
})

test('teleportation carries the message state to Bob: his Pauli expectations equal the message\'s', () => {
  const sent = new DensityMatrixSimulator().simulate(messageCircuit())
  const bob = new DensityMatrixSimulator().simulate(teleportationCircuit())
  for (const pauli of ['X', 'Y', 'Z'] as const) {
    const want = expectationOf(sent, { 'line:0': pauli })
    const got = expectationOf(bob, { 'line:2': pauli })
    assert.ok(Math.abs(got - want) < 1e-9, `${pauli}: sent ${want}, received ${got}`)
  }
})

test('QAOA on a triangle: with no angles the state is uniform and cuts half the weight; some depth-1 angles beat that', () => {
  const [a, b, c3] = LineQubit.range(3)
  const triangle = { nodes: [a!, b!, c3!], edges: [{ a: a!, b: b!, weight: 1 }, { a: b!, b: c3!, weight: 1 }, { a: a!, b: c3!, weight: 1 }] }
  assert.ok(Math.abs(qaoaExpectedCut(triangle, 0, 0) - 1.5) < 1e-9)
  let best = 0
  for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) best = Math.max(best, qaoaExpectedCut(triangle, (Math.PI * i) / 15, (Math.PI * j) / 30))
  assert.ok(best > 1.6, `best expected cut ${best} should beat the random 1.5`)
})
