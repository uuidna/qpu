// The textbook algorithms of the Cirq page on quantumai.google, built from the Cirq layer: the quantum Fourier transform and
// its inverse, phase estimation, Grover's search on two qubits, and teleportation. Each builds a Circuit from Cirq's gates.
// Where the page's circuit uses a mid-circuit measurement, the deferred-measurement form is built instead: the same state,
// with the corrections controlled by the qubits that would have been measured.

import { Circuit, CNOT, CZ, H, LineQubit, Operation, Qubit, Simulator, TOFFOLI, X, ZZ, adjointOf, applied, keyOf, powerOf } from './cirq.js'

/** The quantum Fourier transform, as the Cirq page builds it: a Hadamard on each qubit, then a controlled phase CZ**(1/2^k)
 *  from each later qubit onto it. There are no final swaps, so the output comes in reversed bit order, as the page notes. */
export const qftOperations = (qubits: readonly Qubit[]): Operation[] => {
  const ops: Operation[] = []
  for (let i = 0; i < qubits.length; i++) {
    ops.push(applied(H, qubits[i]!))
    for (let j = i + 1; j < qubits.length; j++) ops.push(applied(powerOf(CZ, 1 / 2 ** (j - i)), qubits[j]!, qubits[i]!))
  }
  return ops
}

/** The inverse of a list of operations: the same operations in reverse order, each replaced by its adjoint. */
export const inverseOperations = (ops: readonly Operation[]): Operation[] =>
  [...ops].reverse().map((op): Operation => (op.kind === 'gate' ? { ...op, gate: adjointOf(op.gate) } : op))

/** The circuit that prepares the basis state |x> on n qubits, bit i of x on qubit i. */
const basisOf = (qubits: readonly Qubit[], x: number): Operation[] => qubits.filter((_, i) => (x >> i) & 1).map((q) => applied(X, q))

/** Phase estimation of U = Z**(2θ) on its eigenstate |1>, with n estimation qubits: Hadamards, controlled U^(2^k), the
 *  inverse QFT, then a measurement of the estimation qubits under the key 'm'. The eigenphase is e^(2πiθ). */
export const phaseEstimationCircuit = (theta: number, bits: number): Circuit => {
  const est = LineQubit.range(bits)
  const target = LineQubit.of(bits)
  const ops: Operation[] = [applied(X, target), ...est.map((q) => applied(H, q))]
  for (let k = 0; k < bits; k++) {
    // estimation qubit k controls U^(2^k); a controlled Z**t is CZ**t, so the power is CZ**(2θ · 2^k)
    ops.push(applied(powerOf(CZ, 2 * theta * 2 ** k), est[k]!, target))
  }
  ops.push(...inverseOperations(qftOperations(est)))
  return new Circuit().append(ops).append({ kind: 'measure', key: 'm', qubits: est })
}

/** Grover's search on two qubits for the marked state |00>, as the Cirq page builds it: Hadamards, the oracle (an open-control
 *  Toffoli onto an ancilla in |−>, which flips the phase of the marked state), and the diffusion. One iteration suffices for
 *  two qubits, so the measured data qubits give |00> with certainty. */
export const groverCircuit = (): Circuit => {
  const [a, b, anc] = LineQubit.range(3)
  const ops: Operation[] = [
    applied(H, a!), applied(H, b!),
    applied(X, anc!), applied(H, anc!),
    applied(X, a!), applied(X, b!), applied(TOFFOLI, a!, b!, anc!), applied(X, a!), applied(X, b!),
    applied(H, a!), applied(H, b!), applied(X, a!), applied(X, b!), applied(CZ, a!, b!), applied(X, a!), applied(X, b!), applied(H, a!), applied(H, b!),
  ]
  return new Circuit().append(ops).append({ kind: 'measure', key: 'result', qubits: [a!, b!] })
}

/** Teleportation, deferred-measurement form: the message qubit is prepared by X**0.25 as the page does, Alice and Bob share a
 *  Bell pair, Alice entangles the message with her half and rotates the message, and the corrections are controlled by her
 *  qubit and the message qubit. Bob's qubit then carries the message state. */
export const teleportationCircuit = (): Circuit => {
  const [msg, alice, bob] = LineQubit.range(3)
  return new Circuit().append([
    applied(powerOf(X, 0.25), msg!),
    applied(H, alice!), applied(CNOT, alice!, bob!),
    applied(CNOT, msg!, alice!), applied(H, msg!),
    applied(CNOT, alice!, bob!), applied(CZ, msg!, bob!),
  ])
}

/** The message state teleportation sends, prepared on its own: X**0.25 on |0>. */
export const messageCircuit = (): Circuit => new Circuit().append(applied(powerOf(X, 0.25), LineQubit.of(0)))


/** A weighted graph for QAOA: its nodes (qubits) and its edges, each a pair of nodes with a weight. */
export type Graph = { nodes: Qubit[]; edges: { a: Qubit; b: Qubit; weight: number }[] }

/** The QAOA circuit the Cirq page builds at depth p = 1: a Hadamard on every node, the cost layer ZZ**(alpha·w) on every edge,
 *  then the mixer X**beta on every node, then a measurement of every node. */
export const qaoaCircuit = (graph: Graph, alpha: number, beta: number): Circuit => {
  const ops: Operation[] = graph.nodes.map((q) => applied(H, q))
  for (const e of graph.edges) ops.push(applied(powerOf(ZZ, alpha * e.weight), e.a, e.b))
  for (const q of graph.nodes) ops.push(applied(powerOf(X, beta), q))
  return new Circuit().append(ops).append({ kind: 'measure', key: 'cut', qubits: graph.nodes })
}

/** The expected cut value of the QAOA state: Σ over basis states of the probability times the weight of the edges the
 *  state's bits cut, where an edge is cut when its ends differ (the page's cost H_C = ½ Σ w (1 − Z_i Z_j)). */
export const qaoaExpectedCut = (graph: Graph, alpha: number, beta: number): number => {
  const circuit = qaoaCircuit(graph, alpha, beta)
  const { amplitudes, qubits } = new Simulator().simulate(circuit)
  const position = (q: Qubit) => qubits.findIndex((r) => keyOf(r) === keyOf(q))
  let expected = 0
  amplitudes.forEach(([re, im], k) => {
    const probability = re * re + im * im
    if (probability === 0) return
    for (const e of graph.edges) {
      if (((k >> position(e.a)) & 1) !== ((k >> position(e.b)) & 1)) expected += probability * e.weight
    }
  })
  return expected
}
