import test from 'node:test'
import assert from 'node:assert/strict'
import { CLIFFORD_CHECK_ARITY, classify, countResources, isClifford } from './counting.ts'
import { Circuit, CNOT, CZ, H, LineQubit, SWAP, TOFFOLI, X, Z, ZZ, applied, pauliProduct, raiseGate, exponentiateGate, type Gate } from './cirq.ts'
import { groverCircuit, qftOperations, teleportationCircuit } from './algorithms.ts'

test('Cliffordness is computed from the unitary: H, CZ, CNOT, SWAP, S and √X are Clifford; T, √X·T-like gates, controlled-S and Toffoli are not', () => {
  for (const g of [H, CZ, CNOT, SWAP, X, Z, raiseGate(Z, 0.5), raiseGate(X, 0.5), raiseGate(ZZ, 0.5)]) assert.ok(isClifford(g), g.name)
  for (const g of [raiseGate(Z, 0.25), raiseGate(X, 0.25), raiseGate(CZ, 0.5), TOFFOLI, raiseGate(ZZ, 0.25), exponentiateGate(pauliProduct(['Y', 'X']), 0.3)]) assert.ok(!isClifford(g), g.name)
  assert.throws(() => isClifford(pauliProduct(['X', 'X', 'X', 'X'])), new RegExp(`up to ${CLIFFORD_CHECK_ARITY} qubits`))
})

test('the counted costs: a Toffoli is 7 T, T and X**0.25 are 1, a controlled-S is 3; other angles are rotations, and a wide gate is undecomposed', () => {
  assert.deepEqual(classify(TOFFOLI), { kind: 'toffoli', tCount: 7 })
  assert.deepEqual(classify(raiseGate(Z, 0.25)), { kind: 't', tCount: 1 })
  assert.deepEqual(classify(raiseGate(X, 0.25)), { kind: 't', tCount: 1 })
  assert.deepEqual(classify(raiseGate(Z, -0.25)), { kind: 't', tCount: 1 })
  assert.deepEqual(classify(raiseGate(CZ, 0.5)), { kind: 'controlled_s', tCount: 3 })
  assert.deepEqual(classify(raiseGate(CZ, -0.5)), { kind: 'controlled_s', tCount: 3 })
  assert.equal(classify(raiseGate(CZ, 0.25)).kind, 'rotation')
  assert.equal(classify(H).kind, 'clifford')
  assert.equal(classify(exponentiateGate(pauliProduct(['Y', 'X']), 0.3)).kind, 'rotation')
  assert.equal(classify(pauliProduct(['X', 'X', 'X', 'X'])).kind, 'undecomposed')
})

const product = (gates: Gate[]): [number, number][] => {
  // the matrix product of 4 × 4 gates, left to right in application order (the first applied is rightmost)
  let m: [number, number][] = Array.from({ length: 16 }, (_, k) => [k % 5 === 0 ? 1 : 0, 0])
  for (const g of gates) {
    const next: [number, number][] = Array.from({ length: 16 }, () => [0, 0])
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) for (let k = 0; k < 4; k++) {
      const [ar, ai] = g.matrix[r * 4 + k]!
      const [br, bi] = m[k * 4 + c]!
      next[r * 4 + c]![0] += ar * br - ai * bi
      next[r * 4 + c]![1] += ar * bi + ai * br
    }
    m = next
  }
  return m
}

test('the controlled-S decomposition CS = (T⊗T)·CNOT·(I⊗T†)·CNOT holds as a matrix product, up to a global phase, so its T-count of 3 is verified', () => {
  const T = raiseGate(Z, 0.25)
  const Tdag = raiseGate(Z, -0.25)
  const two = (a: Gate, b: Gate): Gate => ({ name: `${a.name}⊗${b.name}`, arity: 2, matrix: Array.from({ length: 16 }, (_, k) => { const r = k >> 2, c = k & 3; const [xr, xi] = a.matrix[(r >> 1) * 2 + (c >> 1)]!; const [yr, yi] = b.matrix[(r & 1) * 2 + (c & 1)]!; return [xr * yr - xi * yi, xr * yi + xi * yr] }) })
  const I: Gate = { name: 'I', arity: 1, matrix: [[1, 0], [0, 0], [0, 0], [1, 0]] }
  const cs = product([CNOT, two(I, Tdag), CNOT, two(T, T)])
  const target = raiseGate(CZ, 0.5).matrix
  // the phase is read from the first nonzero entry
  const [pr, pi] = cs[0]!
  const [tr, ti] = target[0]!
  const phase = [(tr * pr + ti * pi) / (pr * pr + pi * pi), (ti * pr - tr * pi) / (pr * pr + pi * pi)]
  cs.forEach(([re, im], k) => {
    const rotated = [re * phase[0]! - im * phase[1]!, re * phase[1]! + im * phase[0]!]
    assert.ok(Math.abs(rotated[0]! - target[k]![0]) < 1e-12 && Math.abs(rotated[1]! - target[k]![1]) < 1e-12, `entry ${k}`)
  })
})

test('Grover on two qubits costs one Toffoli, 7 T, complete; teleportation costs one T; the QFT on three qubits has two controlled-S counted and one controlled-T left as a rotation', () => {
  const grover = countResources(groverCircuit())
  assert.equal(grover.tCount, 7)
  assert.equal(grover.tCountBy.toffoli, 7)
  assert.equal(grover.complete, true)
  assert.equal(grover.measurements, 1)
  const tele = countResources(teleportationCircuit())
  assert.equal(tele.tCount, 1)
  assert.equal(tele.twoQubitGates, 4)
  assert.equal(tele.complete, true)
  const qft = countResources(new Circuit().append(qftOperations(LineQubit.range(3))))
  assert.equal(qft.tCount, 6)
  assert.equal(qft.complete, false)
  assert.deepEqual(qft.rotations.map((r) => [r.name, r.count]), [['CZ**0.25', 1]])
  assert.equal(qft.depth, new Circuit().append(qftOperations(LineQubit.range(3))).moments.length)
})

test('a circuit of Cliffords only has T-count 0 and is complete', () => {
  const [a, b] = LineQubit.range(2)
  const c = countResources(new Circuit().append([applied(H, a!), applied(CNOT, a!, b!), applied(SWAP, a!, b!)]))
  assert.equal(c.tCount, 0)
  assert.equal(c.clifford, 3)
  assert.ok(c.complete)
})
