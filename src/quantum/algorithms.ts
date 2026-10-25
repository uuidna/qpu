// The textbook algorithms of the Cirq page on quantumai.google, built from the Cirq layer: the quantum Fourier transform and
// its inverse, phase estimation, Grover's search on two qubits, and teleportation. Each builds a Circuit from Cirq's gates.
// Where the page's circuit uses a mid-circuit measurement, the deferred-measurement form is built instead: the same state,
// with the corrections controlled by the qubits that would have been measured.

import { Circuit, CNOT, CZ, H, LineQubit, Operation, Qubit, SWAP, Simulator, TOFFOLI, X, ZZ, adjointOf, applied, keyOf, powerOf, type Gate } from './cirq.js'
import { numpyWeights } from './random.js'

/** The quantum Fourier transform, as the Cirq page builds it: a Hadamard on each qubit, then a controlled phase CZ**(1/2^k)
 *  from each later qubit onto it. The page notes the output comes in reversed bit order unless swaps are added, so the swaps
 *  that restore the standard order (qubit i with qubit n−1−i) follow. The result is the discrete Fourier transform. */
export const qftOperations = (qubits: readonly Qubit[]): Operation[] => {
  const ops: Operation[] = []
  const n = qubits.length
  // the most significant qubit (the last index) first: a Hadamard, then controlled phases from each less significant qubit
  for (let i = n - 1; i >= 0; i--) {
    ops.push(applied(H, qubits[i]!))
    for (let j = i - 1; j >= 0; j--) ops.push(applied(powerOf(CZ, 1 / 2 ** (i - j)), qubits[j]!, qubits[i]!))
  }
  for (let i = 0; i < Math.floor(n / 2); i++) ops.push(applied(SWAP, qubits[i]!, qubits[n - 1 - i]!))
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

/** The page's instance: its device's first twelve qubits in sorted order, the device's couplers among them in networkx's edge
 *  order (the lower node first, nodes and neighbours in sorted order), and the weights numpy draws under seed 11 for those edges. */
export const pageInstance = (device: { readonly sites: readonly Qubit[]; readonly couplers: readonly (readonly [Qubit, Qubit])[] }, count = 12, seed = 11): Graph => {
  const row = (q: Qubit) => (q.kind === 'grid' ? q.row : 0)
  const col = (q: Qubit) => (q.kind === 'grid' ? q.col : 0)
  const sorted = [...device.sites].sort((a, b) => row(a) - row(b) || col(a) - col(b))
  const nodes = sorted.slice(0, count)
  const index = new Map(sorted.map((q, i) => [keyOf(q), i]))
  const inside = new Set(nodes.map(keyOf))
  const pairs = device.couplers
    .filter(([a, b]) => inside.has(keyOf(a)) && inside.has(keyOf(b)))
    .map(([a, b]): [Qubit, Qubit] => (index.get(keyOf(a))! < index.get(keyOf(b))! ? [a, b] : [b, a]))
    .sort((x, y) => index.get(keyOf(x[0]))! - index.get(keyOf(y[0]))! || index.get(keyOf(x[1]))! - index.get(keyOf(y[1]))!)
  const weights = numpyWeights(pairs.length, seed)
  return { nodes, edges: pairs.map(([a, b], i) => ({ a, b, weight: weights[i]! })) }
}

/** The page's estimate_cost, sampled as the page does it: shots bitstrings drawn from the QAOA state's probabilities by a seeded
 *  generator, then for each edge the mean of (−1)^u · (−1)^v over the shots, weighted, and negated. Its expectation is
 *  −Σ w⟨Z_u Z_v⟩ = 2·cut − W, the value the page maximizes. */
export const qaoaEstimate = (graph: Graph, alpha: number, beta: number, shots = 20000, seed = 11): number => {
  const { amplitudes, qubits } = new Simulator().simulate(qaoaCircuit(graph, alpha, beta))
  const position = (q: Qubit) => qubits.findIndex((r) => keyOf(r) === keyOf(q))
  const cumulative: number[] = []
  let total = 0
  for (const [re, im] of amplitudes) {
    total += re * re + im * im
    cumulative.push(total)
  }
  let state = seed >>> 0
  const draw = (): number => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return (state / 2 ** 32) * total
  }
  const sums = graph.edges.map(() => 0)
  for (let shot = 0; shot < shots; shot++) {
    const target = draw()
    let lo = 0
    let hi = cumulative.length - 1
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (cumulative[mid]! < target) lo = mid + 1
      else hi = mid
    }
    graph.edges.forEach((e, i) => {
      const su = 1 - 2 * ((lo >> position(e.a)) & 1)
      const sv = 1 - 2 * ((lo >> position(e.b)) & 1)
      sums[i]! += su * sv
    })
  }
  let cost = 0
  graph.edges.forEach((e, i) => {
    cost += (sums[i]! / shots) * e.weight
  })
  return -cost
}

/** The page's sweep: alpha and beta each over gridSize points of [0, 2π) (the page's comment states the half-open interval),
 *  scored by qaoaEstimate with the page's 20,000 shots, and the best chosen by argmax (the page's np.argmax). */
export const qaoaSweep = (graph: Graph, gridSize = 5, shots = 20000): { grid: number[]; best: { alpha: number; beta: number; value: number; expectedCut: number }; randomBaseline: number } => {
  const total = graph.edges.reduce((sum, e) => sum + e.weight, 0)
  const grid = Array.from({ length: gridSize }, (_, i) => (2 * Math.PI * i) / gridSize)
  let best = { alpha: 0, beta: 0, value: -Infinity, expectedCut: 0 }
  for (const alpha of grid) for (const beta of grid) {
    const value = qaoaEstimate(graph, alpha, beta, shots)
    if (value > best.value) best = { alpha, beta, value, expectedCut: (value + total) / 2 }
  }
  return { grid, best, randomBaseline: total / 2 }
}

/** A modular exponent by repeated squaring, for the small N of the demonstration. */
const modPow = (base: number, exponent: number, modulus: number): number => {
  let result = 1 % modulus
  let b = base % modulus
  let e = exponent
  while (e > 0) {
    if (e & 1) result = (result * b) % modulus
    b = (b * b) % modulus
    e >>= 1
  }
  return result
}

/** The controlled modular multiplication: on control 1 the work register |x> becomes |a·x mod N> (x < N; larger x are fixed),
 *  on control 0 it is unchanged. Its matrix index is the control bit above the work bits, the work value in its natural bits. */
const modularGate = (a: number, N: number, n: number): Gate => {
  const dim = 1 << (n + 1)
  const matrix: [number, number][] = Array.from({ length: dim * dim }, () => [0, 0])
  const size = 1 << n
  for (let x = 0; x < size; x++) {
    const image = x < N ? (a * x) % N : x
    matrix[x * dim + x] = [1, 0]
    matrix[(size + image) * dim + (size + x)] = [1, 0]
  }
  return { name: `U${a}`, arity: n + 1, matrix }
}

/** Shor's order finding for N and a, by phase estimation of U|x> = |a·x mod N>: 2n counting qubits, where n is the bit length of
 *  N, each controlling U^(2^k), an inverse QFT, and a measurement of the counting register under 'm'. The work register starts in |1>. */
export const shorCircuit = (N: number, a: number): Circuit => {
  const n = Math.ceil(Math.log2(N + 1))
  const t = 2 * n
  const counts = LineQubit.range(t)
  const work = LineQubit.range(n).map((_, j) => LineQubit.of(t + j))
  const ops: Operation[] = [applied(X, work[0]!), ...counts.map((q) => applied(H, q))]
  for (let k = 0; k < t; k++) {
    ops.push(applied(modularGate(modPow(a, 2 ** k, N), N, n), counts[k]!, ...[...work].reverse()))
  }
  ops.push(...inverseOperations(qftOperations(counts)))
  return new Circuit().append(ops).append({ kind: 'measure', key: 'm', qubits: counts })
}

/** The continued-fraction denominators of x, up to maxDenominator: the candidates for the order's fraction s/r. */
const denominatorsOf = (x: number, maxDenominator: number): number[] => {
  const out: number[] = []
  let [prev, last] = [0, 1]
  let v = x - Math.floor(x)
  for (let i = 0; i < 40 && v > 1e-12; i++) {
    v = 1 / v
    const a = Math.floor(v)
    ;[prev, last] = [last, a * last + prev]
    if (last > maxDenominator) break
    out.push(last)
    v -= a
  }
  return out
}

const gcd = (x: number, y: number): number => (y === 0 ? Math.abs(x) : gcd(y, x % y))

/** From the measured counting bitstrings, the order r of a mod N and the factors of N the order gives, if any. The string is
 *  read least significant bit first, as the inverse QFT leaves it. */
export const shorFactors = (N: number, a: number, bitstrings: readonly string[]): { order: number | null; factors: [number, number] | null; estimates: number[] } => {
  const t = 2 * Math.ceil(Math.log2(N + 1))
  const estimates = bitstrings.map((b) => [...b].reduce((sum, bit, k) => sum + Number(bit) * 2 ** k, 0) / 2 ** t)
  for (const phi of estimates) {
    for (const r of denominatorsOf(phi, N - 1)) {
      if (r < 2 || modPow(a, r, N) !== 1) continue
      if (r % 2 === 1) return { order: r, factors: null, estimates }
      const half = modPow(a, r / 2, N)
      if (half === N - 1) return { order: r, factors: null, estimates }
      const p = gcd(half - 1, N)
      const q = gcd(half + 1, N)
      const factor = [p, q].find((f) => f > 1 && f < N)
      if (factor !== undefined) return { order: r, factors: [Math.min(factor, N / factor), Math.max(factor, N / factor)], estimates }
    }
  }
  return { order: null, factors: null, estimates }
}

export const modPowOf = (base: bigint, exponent: bigint, N: bigint): bigint => {
  let result = 1n % N
  let b = base % N
  for (let e = exponent; e > 0n; e >>= 1n) {
    if (e & 1n) result = (result * b) % N
    b = (b * b) % N
  }
  return result
}

const gcdOf = (x: bigint, y: bigint): bigint => {
  let [u, v] = [x < 0n ? -x : x, y < 0n ? -y : y]
  while (v !== 0n) [u, v] = [v, u % v]
  return u
}

/** The factors of N from a known order r of a modulo N, in exact integer arithmetic. The split is returned only when p · q = N,
 *  with p ≤ q; otherwise null. Use it where N is too large for a number. */
export const splitOf = (N: bigint, a: bigint, r: bigint): { p: bigint; q: bigint } | null => {
  if (r < 2n || r % 2n === 1n || modPowOf(a, r, N) !== 1n) return null
  const half = modPowOf(a, r / 2n, N)
  if (half === N - 1n) return null
  for (const f of [gcdOf(half - 1n, N), gcdOf(half + 1n, N)]) {
    if (f <= 1n || f >= N) continue
    const g = N / f
    const [p, q] = f < g ? [f, g] : [g, f]
    if (p * q === N) return { p, q }
  }
  return null
}
