import test from 'node:test'
import assert from 'node:assert/strict'
import { Circuit, CNOT, GridQubit, H, LineQubit, Moment, Simulator, X, applied, measure } from './cirq.js'

const [q0, q1] = LineQubit.range(2)

test('a Bell circuit simulates to equal weight on |00> and |11>', () => {
  const bell = new Circuit([applied(H, q0!), applied(CNOT, q0!, q1!)])
  const { amplitudes } = new Simulator().simulate(bell)
  const weight = amplitudes.map(([r, i]) => r * r + i * i)
  assert.ok(Math.abs(weight[0]! - 0.5) < 1e-12 && Math.abs(weight[3]! - 0.5) < 1e-12)
  assert.ok(weight[1]! < 1e-12 && weight[2]! < 1e-12)
})

test('run samples only the correlated bitstrings of a Bell pair, by measurement key', () => {
  const bell = new Circuit([applied(H, q0!), applied(CNOT, q0!, q1!), measure([q0!, q1!], 'result')])
  const result = new Simulator().run(bell, 1000)
  const values = result.measurements('result')
  assert.equal(values.length, 1000)
  assert.ok(values.every((bits) => bits === '00' || bits === '11'))
  assert.ok(result.histogram('result').size === 2)
})

test('operations slide to the earliest moment after their last conflict, as Cirq places them by default', () => {
  const c = new Circuit()
  c.append(applied(H, q0!))
  c.append(applied(X, q1!))
  c.append(applied(CNOT, q0!, q1!))
  assert.equal(c.moments.length, 2)
  assert.equal(c.moments[0]!.operations.length, 2)
})

test('a moment cannot act on one qubit twice, and a gate needs its full arity', () => {
  assert.throws(() => new Moment([applied(H, q0!), applied(X, q0!)]))
  assert.throws(() => applied(CNOT, q0!))
})

test('the qubit constructors match Cirq: LineQubit.range, GridQubit.square', () => {
  assert.equal(LineQubit.range(3).length, 3)
  assert.equal(GridQubit.square(4).length, 16)
  assert.deepEqual(GridQubit.square(4)[5], GridQubit.of(1, 1))
})
