import test from 'node:test'
import assert from 'node:assert/strict'
import { willowNoiseOf } from './processor.js'
import { Circuit, CNOT, CZ, Device, DensityMatrixSimulator, GridQubit, H, LineQubit, Moment, QuantumVirtualMachine, Simulator, TOFFOLI, X, Z, applied, expectationOf, measure, powerOf } from './cirq.js'

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

test('X**0.5 is the square root of NOT, as Cirq documents: its square is X, and it takes |0> to (1+i)/2 |0> + (1-i)/2 |1>', () => {
  const sqrtNot = powerOf(X, 0.5)
  const [a, b, c, d] = sqrtNot.matrix
  assert.ok(Math.abs(a![0] - 0.5) < 1e-12 && Math.abs(a![1] - 0.5) < 1e-12)
  assert.ok(Math.abs(b![0] - 0.5) < 1e-12 && Math.abs(b![1] + 0.5) < 1e-12)
  assert.ok(Math.abs(c![0] - 0.5) < 1e-12 && Math.abs(c![1] + 0.5) < 1e-12)
  assert.ok(Math.abs(d![0] - 0.5) < 1e-12 && Math.abs(d![1] - 0.5) < 1e-12)
  const circuit = new Circuit([applied(sqrtNot, q0!)])
  const [amp0, amp1] = new Simulator().simulate(circuit).amplitudes
  assert.ok(Math.abs(amp0![0] - 0.5) < 1e-12 && Math.abs(amp0![1] - 0.5) < 1e-12)
  assert.ok(Math.abs(amp1![0] - 0.5) < 1e-12 && Math.abs(amp1![1] + 0.5) < 1e-12)
})

test('X**1 is X, and a gate that is not an involution has no power here', () => {
  powerOf(X, 1).matrix.forEach(([r, i], k) => {
    assert.ok(Math.abs(r - X.matrix[k]![0]) < 1e-12 && Math.abs(i - X.matrix[k]![1]) < 1e-12)
  })
  assert.throws(() => powerOf({ name: 'T', arity: 1, matrix: [[1, 0], [0, 0], [0, 0], [Math.SQRT1_2, Math.SQRT1_2]] }, 0.5))
})

test('the NEW insert strategy gives each operation a moment of its own, where EARLIEST would have shared one', () => {
  const earliest = new Circuit().append(applied(H, q0!)).append(applied(X, q1!))
  assert.equal(earliest.moments.length, 1)
  const newed = new Circuit().append(applied(H, q0!), 'NEW').append(applied(X, q1!), 'NEW')
  assert.equal(newed.moments.length, 2)
})

test('a device accepts operations on its qubits and two-qubit gates on its couplers, in either order', () => {
  const device = new Device(LineQubit.range(3), [[q0!, q1!]])
  device.validateOperation(applied(CZ, q0!, q1!))
  device.validateOperation(applied(CZ, q1!, q0!))
  assert.throws(() => device.validateOperation(applied(CZ, q0!, LineQubit.of(2))), /does not couple/)
  assert.throws(() => device.validateOperation(applied(H, LineQubit.of(9))), /not a qubit of this device/)
  device.validateCircuit(new Circuit([applied(H, q0!), applied(CZ, q0!, q1!)]))
})

test('the density-matrix simulator agrees with the state vector on a noiseless Bell pair, and is pure', () => {
  const bell = new Circuit([applied(H, q0!), applied(CNOT, q0!, q1!)])
  const result = new DensityMatrixSimulator().simulate(bell)
  assert.ok(Math.abs(result.trace - 1) < 1e-12)
  assert.ok(Math.abs(result.purity - 1) < 1e-12)
  assert.ok(Math.abs(result.probabilities[0]! - 0.5) < 1e-12 && Math.abs(result.probabilities[3]! - 0.5) < 1e-12)
})

test('the depolarizing channel after an X leaves |1> with probability 1 − 2p/3, and the state is no longer pure', () => {
  const p = 0.3
  const result = new DensityMatrixSimulator().simulate(new Circuit([applied(X, q0!)]), [{ name: 'depolarize', p }])
  assert.ok(Math.abs(result.trace - 1) < 1e-12, 'a channel keeps the trace at 1')
  assert.ok(Math.abs(result.probabilities[1]! - (1 - (2 * p) / 3)) < 1e-12, `P(|1>) should be 1 - 2p/3, got ${result.probabilities[1]}`)
  assert.ok(result.purity < 1 - 1e-6, 'noise lowers the purity')
})

test('a probability outside 0 to 1 is refused, and the density simulator bounds its size', () => {
  assert.throws(() => new DensityMatrixSimulator().simulate(new Circuit([applied(X, q0!)]), [{ name: 'depolarize', p: 1.5 }]), /between 0 and 1/)
  const wide = LineQubit.range(9).map((q) => applied(X, q))
  assert.throws(() => new DensityMatrixSimulator().simulate(new Circuit(wide)), /up to 8 qubits/)
})

test('the Quantum Virtual Machine runs a circuit that fits its device, with the noise it is given, and refuses one that does not fit', () => {
  const machine = new QuantumVirtualMachine(new Device(LineQubit.range(2), [[q0!, q1!]]), [{ name: 'depolarize', p: 0.3 }])
  const result = machine.simulate(new Circuit([applied(X, q0!)]))
  assert.ok(Math.abs(result.probabilities[1]! - (1 - 0.2)) < 1e-12)
  assert.throws(() => machine.simulate(new Circuit([applied(H, LineQubit.of(5))])), /not a qubit of this device/)
})

test('amplitude damping takes |1> to |0> with probability gamma, as Cirq\'s amplitude_damp(0.2) states', () => {
  const result = new DensityMatrixSimulator().simulate(new Circuit([applied(X, q0!)]), [{ name: 'amplitude_damp', gamma: 0.2 }])
  assert.ok(Math.abs(result.trace - 1) < 1e-12)
  assert.ok(Math.abs(result.probabilities[1]! - 0.8) < 1e-12, `P(|1>) should be 0.8, got ${result.probabilities[1]}`)
  assert.ok(Math.abs(result.probabilities[0]! - 0.2) < 1e-12)
})

test('Pauli-string expectation values: Z on |0> is 1, on |1> is -1, and a Bell pair has ZZ and XX equal to 1', () => {
  const zero = new DensityMatrixSimulator().simulate(new Circuit([applied(H, q0!), applied(H, q0!)]))
  assert.ok(Math.abs(expectationOf(zero, { 'line:0': 'Z' }) - 1) < 1e-12)
  const one = new DensityMatrixSimulator().simulate(new Circuit([applied(X, q0!)]))
  assert.ok(Math.abs(expectationOf(one, { 'line:0': 'Z' }) + 1) < 1e-12)
  const bell = new DensityMatrixSimulator().simulate(new Circuit([applied(H, q0!), applied(CNOT, q0!, q1!)]))
  assert.ok(Math.abs(expectationOf(bell, { 'line:0': 'Z', 'line:1': 'Z' }) - 1) < 1e-12)
  assert.ok(Math.abs(expectationOf(bell, { 'line:0': 'X', 'line:1': 'X' }) - 1) < 1e-12)
})

test('the device exposes its qubit set and its couplers, and validates a moment as a whole', () => {
  const device = new Device(LineQubit.range(3), [[q0!, q1!]])
  assert.equal(device.qubitSet.length, 3)
  assert.equal(device.edges.length, 1)
  device.validateMoment(new Moment([applied(CZ, q0!, q1!), applied(H, LineQubit.of(2))]))
  assert.throws(() => device.validateMoment(new Moment([applied(CZ, q0!, LineQubit.of(2))])), /does not couple/)
})

const one = (channel: Parameters<DensityMatrixSimulator['simulate']>[1]) => new DensityMatrixSimulator().simulate(new Circuit([applied(X, q0!)]), channel)

test('bit flip with probability p takes |1> to |0> with probability p, once per gate, and the trace stays 1', () => {
  const r = one([{ name: 'bit_flip', p: 0.2 }])
  assert.ok(Math.abs(r.probabilities[0]! - 0.2) < 1e-12 && Math.abs(r.trace - 1) < 1e-12)
})

test('reset sends any state to |0>, and phase damping leaves the populations of |+> unchanged', () => {
  assert.ok(Math.abs(one([{ name: 'reset' }]).probabilities[0]! - 1) < 1e-12)
  const plus = new DensityMatrixSimulator().simulate(new Circuit([applied(H, q0!)]), [{ name: 'phase_damp', gamma: 0.6 }])
  assert.ok(Math.abs(plus.probabilities[0]! - 0.5) < 1e-12 && Math.abs(plus.probabilities[1]! - 0.5) < 1e-12)
  assert.ok(plus.purity < 1 - 1e-6)
})

test('asymmetric depolarizing noise flips |1> to |0> with px + py, as the channel defines it', () => {
  const r = one([{ name: 'asymmetric_depolarize', p_x: 0.1, p_y: 0.05, p_z: 0.15 }])
  assert.ok(Math.abs(r.probabilities[0]! - 0.15) < 1e-12 && Math.abs(r.trace - 1) < 1e-12)
})

test('generalized amplitude damping with p = 1 is amplitude damping: |1> decays to |0> with probability gamma', () => {
  const r = new DensityMatrixSimulator().simulate(new Circuit([applied(X, q0!)]), [{ name: 'generalized_amplitude_damp', p: 1, gamma: 0.5 }])
  assert.ok(Math.abs(r.probabilities[1]! - 0.5) < 1e-12)
})

test('every named channel is trace-preserving on an entangled pair', () => {
  const bell = new Circuit([applied(H, q0!), applied(CNOT, q0!, q1!)])
  const channels: Parameters<DensityMatrixSimulator['simulate']>[1][] = [
    [{ name: 'bit_flip', p: 0.3 }], [{ name: 'phase_flip', p: 0.3 }], [{ name: 'depolarize', p: 0.3 }],
    [{ name: 'asymmetric_depolarize', p_x: 0.1, p_y: 0.2, p_z: 0.3 }], [{ name: 'amplitude_damp', gamma: 0.4 }],
    [{ name: 'phase_damp', gamma: 0.4 }], [{ name: 'generalized_amplitude_damp', p: 0.7, gamma: 0.4 }], [{ name: 'reset' }],
  ]
  for (const ch of channels) assert.ok(Math.abs(new DensityMatrixSimulator().simulate(bell, ch).trace - 1) < 1e-12, JSON.stringify(ch))
})

test('Toffoli flips the third qubit only when both controls are 1', () => {
  const [a, b, c3] = LineQubit.range(3)
  const r = new Simulator().simulate(new Circuit([applied(X, a!), applied(X, b!), applied(TOFFOLI, a!, b!, c3!)]))
  assert.ok(Math.abs(r.amplitudes[7]![0] - 1) < 1e-12)
  const none = new Simulator().simulate(new Circuit([applied(X, a!), applied(TOFFOLI, a!, b!, c3!)]))
  assert.ok(Math.abs(none.amplitudes[1]![0] - 1) < 1e-12)
})

test('INLINE puts an operation in the moment before the insert location when it does not conflict, else in a new moment', () => {
  const inline = new Circuit().append(applied(H, q0!)).append(applied(H, q1!), 'INLINE')
  assert.equal(inline.moments.length, 1)
  const conflict = new Circuit().append(applied(H, q0!)).append(applied(X, q0!), 'INLINE')
  assert.equal(conflict.moments.length, 2)
})

test('NEW_THEN_INLINE gives the first operation a new moment and inserts the rest inline', () => {
  const c2 = new Circuit().append([applied(H, q0!), applied(H, q1!)], 'NEW_THEN_INLINE')
  assert.equal(c2.moments.length, 1)
  const c3 = new Circuit().append([applied(H, q0!), applied(H, q0!)], 'NEW_THEN_INLINE')
  assert.equal(c3.moments.length, 2)
})

test('the Willow noise after an X on |0> leaves |0> with the spec sheet\'s single-qubit gate error, the average error of that gate', () => {
  const r = new DensityMatrixSimulator().simulate(new Circuit([applied(X, q0!)]), willowNoiseOf('errorCorrection'))
  assert.ok(Math.abs(r.probabilities[0]! - 0.00035) < 1e-12, `P(|0>) should be 0.035%, got ${r.probabilities[0]}`)
  assert.ok(Math.abs(r.trace - 1) < 1e-12)
})
