import test from 'node:test'
import assert from 'node:assert/strict'
import { CNOT, H, LineQubit, X, applied, powerOf } from './cirq.js'
import { QUANTUM_ECHOES, echoCircuit, echoProbability } from './echo.js'

const [q0, q1] = LineQubit.range(2)
const forward = [applied(H, q0!), applied(CNOT, q0!, q1!)]

test('with no perturbation the echo returns to the start with certainty', () => {
  assert.ok(Math.abs(echoProbability(forward) - 1) < 1e-12)
})

test('a perturbation on the measured qubits disturbs the echo', () => {
  const p = echoProbability(forward, applied(X, q1!))
  assert.ok(p < 1 - 1e-6, `the echo should be disturbed, probability ${p}`)
})

test('the echo circuit runs forward, perturbs once, then runs backward', () => {
  assert.equal(echoCircuit(forward, applied(X, q1!)).operations.length, 2 + 1 + 2)
  assert.equal(echoCircuit(forward).operations.length, 2 + 2)
})

test('a forward run with a gate power still echoes back with certainty: the backward half applies the adjoint', () => {
  const withPower = [applied(powerOf(X, 0.5), q0!), applied(CNOT, q0!, q1!)]
  assert.ok(Math.abs(echoProbability(withPower) - 1) < 1e-12)
})

test('the echo benchmark is Google\'s stated figures: Willow, 105 qubits, 13,000x, molecules of 15 and 28 atoms', () => {
  assert.equal(QUANTUM_ECHOES.processor, 'Willow')
  assert.equal(QUANTUM_ECHOES.qubits, 105)
  assert.equal(QUANTUM_ECHOES.speedup, 13000)
  assert.deepEqual(QUANTUM_ECHOES.molecules, [15, 28])
  assert.equal(QUANTUM_ECHOES.experiment.qubitsUsedInFigure, 65)
  assert.equal(QUANTUM_ECHOES.protocol.length, 6)
})
