// The textbook algorithms of the Cirq page on quantumai.google, built from the Cirq layer: the quantum Fourier transform and
// its inverse, phase estimation, Grover's search on two qubits, and teleportation. Each builds a Circuit from Cirq's gates.
// Where the page's circuit uses a mid-circuit measurement, the deferred-measurement form is built instead: the same state,
// with the corrections controlled by the qubits that would have been measured.

import { Circuit, CNOT, CZ, DensityMatrixSimulator, getExpectation, H, LineQubit, type Operation, type Qubit, SWAP, Simulator, TOFFOLI, X, Y, Z, ZZ, adjointGate, applied, qubitKey, raiseGate, type Gate } from './cirq.ts'
import { numpyWeights } from './unit/random.ts'

/** The quantum Fourier transform, as the Cirq page builds it: a Hadamard on each qubit, then a controlled phase CZ**(1/2^k)
 *  from each later qubit onto it. The page notes the output comes in reversed bit order unless swaps are added, so the swaps
 *  that restore the standard order (qubit i with qubit n−1−i) follow. The result is the discrete Fourier transform. */
export const qftOperations = (qubits: readonly Qubit[]): Operation[] => {
  const ops: Operation[] = []
  const n = qubits.length
  // the most significant qubit (the last index) first: a Hadamard, then controlled phases from each less significant qubit
  for (let i = n - 1; i >= 0; i--) {
    ops.push(applied(H, qubits[i]!))
    for (let j = i - 1; j >= 0; j--) ops.push(applied(raiseGate(CZ, 1 / 2 ** (i - j)), qubits[j]!, qubits[i]!))
  }
  for (let i = 0; i < Math.floor(n / 2); i++) ops.push(applied(SWAP, qubits[i]!, qubits[n - 1 - i]!))
  return ops
}

/** The inverse of a list of operations: the same operations in reverse order, each replaced by its adjoint. */
export const inverseOperations = (ops: readonly Operation[]): Operation[] =>
  [...ops].reverse().map((op): Operation => (op.kind === 'gate' ? { ...op, gate: adjointGate(op.gate) } : op))

/** The circuit that prepares the basis state |x> on n qubits, bit i of x on qubit i. */

/** Phase estimation of U = Z**(2θ) on its eigenstate |1>, with n estimation qubits: Hadamards, controlled U^(2^k), the
 *  inverse QFT, then a measurement of the estimation qubits under the key 'm'. The eigenphase is e^(2πiθ). */
export const phaseEstimationCircuit = (theta: number, bits: number): Circuit => {
  const est = LineQubit.range(bits)
  const target = LineQubit.of(bits)
  const ops: Operation[] = [applied(X, target), ...est.map((q) => applied(H, q))]
  for (let k = 0; k < bits; k++) {
    // estimation qubit k controls U^(2^k); a controlled Z**t is CZ**t, so the power is CZ**(2θ · 2^k)
    ops.push(applied(raiseGate(CZ, 2 * theta * 2 ** k), est[k]!, target))
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
    applied(raiseGate(X, 0.25), msg!),
    applied(H, alice!), applied(CNOT, alice!, bob!),
    applied(CNOT, msg!, alice!), applied(H, msg!),
    applied(CNOT, alice!, bob!), applied(CZ, msg!, bob!),
  ])
}

/** The message state teleportation sends, prepared on its own: X**0.25 on |0>. */
export const messageCircuit = (): Circuit => new Circuit().append(applied(raiseGate(X, 0.25), LineQubit.of(0)))

/** Deutsch–Jozsa: one query decides whether f is constant or balanced. n input qubits and a phase ancilla in |−>; a constant
 *  oracle does nothing (the inputs return to |0…0>), a balanced oracle — the parity f(x)=x₀⊕…⊕xₙ₋₁, a CNOT from each input onto
 *  the ancilla — returns the inputs as |1…1>. Measuring the inputs: all zero iff f is constant, in a single query. */
export const deutschJozsaCircuit = (n: number, balanced: boolean): Circuit => {
  const inputs = LineQubit.range(n), anc = LineQubit.of(n)
  const ops: Operation[] = [applied(X, anc), applied(H, anc), ...inputs.map((q) => applied(H, q))]
  if (balanced) for (const q of inputs) ops.push(applied(CNOT, q, anc))
  ops.push(...inputs.map((q) => applied(H, q)))
  return new Circuit().append(ops).append({ kind: 'measure', key: 'in', qubits: inputs })
}

/** Bernstein–Vazirani: one query recovers the hidden string s. n input qubits and a phase ancilla in |−>; the oracle f(x)=s·x
 *  is a CNOT from input i onto the ancilla for each bit sᵢ=1. After the final Hadamards the inputs measure to s exactly, where a
 *  classical algorithm needs n queries. */
export const bernsteinVaziraniCircuit = (s: readonly number[]): Circuit => {
  const inputs = LineQubit.range(s.length), anc = LineQubit.of(s.length)
  const ops: Operation[] = [applied(X, anc), applied(H, anc), ...inputs.map((q) => applied(H, q))]
  s.forEach((bit, i) => { if (bit) ops.push(applied(CNOT, inputs[i]!, anc)) })
  ops.push(...inputs.map((q) => applied(H, q)))
  return new Circuit().append(ops).append({ kind: 'measure', key: 's', qubits: inputs })
}

/** Simon's algorithm for the hidden period s = 11 on two qubits: the oracle f(x)=x₀⊕x₁ (a CNOT from each input onto one output)
 *  is 2-to-1 with f(x)=f(x⊕11). After the Hadamards the measured y always satisfy y·s = y₀⊕y₁ = 0, i.e. y ∈ {00, 11}; two
 *  independent such y determine s by linear algebra over GF(2). */
export const simonCircuit = (): Circuit => {
  const [q0, q1, out] = LineQubit.range(3)
  return new Circuit().append([
    applied(H, q0!), applied(H, q1!),
    applied(CNOT, q0!, out!), applied(CNOT, q1!, out!),
    applied(H, q0!), applied(H, q1!),
  ]).append({ kind: 'measure', key: 'y', qubits: [q0!, q1!] })
}

/** Cross-entropy benchmarking (XEB) of a random circuit: random single-qubit powers of X and Y on each qubit interleaved with
 *  a CZ chain, simulated exactly. The output distribution is Porter–Thomas, so the collision probability Σpₖ² ≈ 2/(D+1) for
 *  D = 2ⁿ — above the uniform 1/D, the speckle that certifies a genuine quantum sampler (Sycamore's beyond-classical claim). */
export const xebCollision = (qubits: number, depth: number, seed = 7): { dim: number; collision: number; porterThomas: number; uniform: number } => {
  let st = (seed * 2654435761) >>> 0
  const rnd = () => (st = (st * 1664525 + 1013904223) >>> 0) / 2 ** 32
  const n = qubits, qs = LineQubit.range(n), ops: Operation[] = []
  for (let d = 0; d < depth; d++) {
    for (const q of qs) ops.push(applied(raiseGate(d % 2 === 0 ? X : Y, 0.25 + 0.5 * rnd()), q))
    for (let i = 0; i + 1 < n; i++) ops.push(applied(CZ, qs[i]!, qs[i + 1]!))
  }
  const { amplitudes } = new Simulator().simulate(new Circuit().append(ops))
  const probs = amplitudes.map(([re, im]) => re * re + im * im)
  const collision = probs.reduce((s, p) => s + p * p, 0), dim = 1 << n
  return { dim, collision, porterThomas: 2 / (dim + 1), uniform: 1 / dim }
}

/** Trotterization of e^(−i(X+Z)t) on one qubit: the exact evolution (X+Z has eigenvalues ±√2, so the state is cos(√2 t)|0>
 *  − i sin(√2 t)/√2 (|0>+|1>)) is compared to the first-order Trotter product (e^(−iX t/n) e^(−iZ t/n))^n by fidelity. As the
 *  step count n grows the fidelity rises to 1: the Trotter error is O(t²/n). Returns the fidelity at each step count. */
export const trotterFidelity = (t: number, stepsList: readonly number[]): { steps: number; fidelity: number }[] => {
  const r = Math.SQRT2
  const ex0 = { re: Math.cos(r * t), im: -Math.sin(r * t) / r }, ex1 = { re: 0, im: -Math.sin(r * t) / r }
  return stepsList.map((n) => {
    const q = LineQubit.of(0), ops: Operation[] = []
    for (let k = 0; k < n; k++) { ops.push(applied(raiseGate(X, 2 * (t / n) / Math.PI), q)); ops.push(applied(raiseGate(Z, 2 * (t / n) / Math.PI), q)) }
    const { amplitudes } = new Simulator().simulate(new Circuit().append(ops))
    const [t0r, t0i] = amplitudes[0]!, [t1r, t1i] = amplitudes[1]!
    // |<exact|trotter>|² (phase-invariant): <exact| = conj(ex)
    const re = ex0.re * t0r + ex0.im * t0i + ex1.re * t1r + ex1.im * t1i
    const im = ex0.re * t0i - ex0.im * t0r + ex1.re * t1i - ex1.im * t1r
    return { steps: n, fidelity: re * re + im * im }
  })
}

/** The CHSH game on the Bell state |Φ⁺> = (|00> + |11>)/√2: the four correlators ⟨ZZ⟩, ⟨XX⟩, ⟨ZX⟩, ⟨XZ⟩ are measured from the
 *  state, and the CHSH value S = E(a,b) − E(a,b′) + E(a′,b) + E(a′,b′), with observables at angle θ being cos2θ·Z + sin2θ·X and
 *  a=0, a′=π/4, b=π/8, b′=3π/8, reaches Tsirelson's bound 2√2 ≈ 2.828 — above the classical limit 2. */
export const chshValue = (): { ZZ: number; XX: number; ZX: number; XZ: number; S: number } => {
  const [q0, q1] = LineQubit.range(2)
  const rho = new DensityMatrixSimulator().simulate(new Circuit().append([applied(H, q0!), applied(CNOT, q0!, q1!)]))
  const ZZ = getExpectation(rho, { 'line:0': 'Z', 'line:1': 'Z' }), XX = getExpectation(rho, { 'line:0': 'X', 'line:1': 'X' })
  const ZX = getExpectation(rho, { 'line:0': 'Z', 'line:1': 'X' }), XZ = getExpectation(rho, { 'line:0': 'X', 'line:1': 'Z' })
  const E = (a: number, b: number) => Math.cos(2 * a) * Math.cos(2 * b) * ZZ + Math.cos(2 * a) * Math.sin(2 * b) * ZX + Math.sin(2 * a) * Math.cos(2 * b) * XZ + Math.sin(2 * a) * Math.sin(2 * b) * XX
  const a = 0, a2 = Math.PI / 4, b = Math.PI / 8, b2 = 3 * Math.PI / 8
  const S = E(a, b) - E(a, b2) + E(a2, b) + E(a2, b2)
  return { ZZ, XX, ZX, XZ, S }
}

/** The variational quantum eigensolver on one qubit for the Hamiltonian H = Z: the ansatz Y**t|0> sweeps the Bloch meridian,
 *  and the energy ⟨Z⟩ = p₀ − p₁ is minimised to the ground energy −1 at t = 1 (where Y|0> = i|1>). Returns the energy at each
 *  of steps+1 points of t ∈ [0, 1]. */
export const vqeGroundEnergy = (steps = 20): { theta: number; energy: number }[] => {
  const out: { theta: number; energy: number }[] = []
  for (let k = 0; k <= steps; k++) {
    const t = k / steps
    const { amplitudes } = new Simulator().simulate(new Circuit().append(applied(raiseGate(Y, t), LineQubit.of(0))))
    const p0 = amplitudes[0]![0] ** 2 + amplitudes[0]![1] ** 2, p1 = amplitudes[1]![0] ** 2 + amplitudes[1]![1] ** 2
    out.push({ theta: t, energy: p0 - p1 })
  }
  return out
}

/** The Steane [[7,1,3]] CSS code built on the classical [7,4,3] Hamming code: the three parity checks H detect any single-qubit
 *  X error (and, by CSS symmetry, any single Z error) because the syndrome of an error at position p equals the binary numeral of
 *  p, so every one of the seven single-qubit errors is located and corrected. Returns the syndrome table and the count corrected. */
export const steaneCorrection = (): { corrected: number; total: number; distance: number; rows: { error: string; syndrome: string; located: number; ok: boolean }[] } => {
  const H = [[0, 0, 0, 1, 1, 1, 1], [0, 1, 1, 0, 0, 1, 1], [1, 0, 1, 0, 1, 0, 1]]
  const syndrome = (e: number[]) => H.map((row) => row.reduce((s, h, i) => s ^ (h & e[i]!), 0))
  const rows: { error: string; syndrome: string; located: number; ok: boolean }[] = []
  let corrected = 0
  for (const basis of ['X', 'Z'] as const) {
    for (let pos = 0; pos < 7; pos++) {
      const e = Array(7).fill(0); e[pos] = 1
      const syn = syndrome(e), located = syn[0]! * 4 + syn[1]! * 2 + syn[2]!, ok = located === pos + 1
      if (ok) corrected++
      rows.push({ error: `${basis}_${pos + 1}`, syndrome: syn.join(''), located, ok })
    }
  }
  return { corrected, total: 14, distance: 3, rows }
}

/** No-cloning (Wootters–Zurek): the universal quantum cloning machine's optimal fidelity for 1→2 copies of a qubit is 5/6 < 1,
 *  so no device copies an unknown state perfectly. */
export const cloningFidelity = (): number => 5 / 6

/** Holevo bound: for the ensemble {|0> with ½, |+> with ½} the accessible information is at most χ = S(ρ) − Σ pᵢ S(ρᵢ) = S(ρ)
 *  (the pure states carry zero entropy), with ρ = ½|0><0| + ½|+><+| = [[¾,¼],[¼,¼]]; χ ≤ log₂ d = 1 bit. */
export const holevoChi = (): { chi: number; vonNeumann: number; bound: number } => {
  const g = Math.sqrt(0.125), l1 = 0.5 + g, l2 = 0.5 - g, h = (p: number) => (p <= 0 ? 0 : -p * Math.log2(p))
  const S = h(l1) + h(l2)
  return { chi: S, vonNeumann: S, bound: 1 }
}

/** Gottesman–Knill: a stabilizer state on n qubits is fixed by n Pauli generators (2n+1 bits each), so 2n²+n bits describe it
 *  versus the 2ⁿ amplitudes of a general state — stabilizer circuits are simulated classically in polynomial space and time. */
export const stabilizerCompression = (n: number): { generators: number; bits: number; amplitudes: number } => ({ generators: n, bits: 2 * n * n + n, amplitudes: 2 ** n })

/** Eastin–Knill: the transversal logical gates of any error-detecting code form a finite group, so they cannot be universal.
 *  The single-qubit Clifford group ⟨H, S⟩ is enumerated by closure; its order is 24 — finite — while universality needs a dense
 *  (infinite) set, so the T gate must come from magic-state distillation. */
export const cliffordOrder = (): number => {
  const mul = (a: readonly [number, number][], b: readonly [number, number][]): [number, number][] => {
    const r: [number, number][] = [[0, 0], [0, 0], [0, 0], [0, 0]]
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { let re = 0, im = 0; for (let k = 0; k < 2; k++) { const [ar, ai] = a[i * 2 + k]!, [br, bi] = b[k * 2 + j]!; re += ar * br - ai * bi; im += ar * bi + ai * br } r[i * 2 + j] = [re, im] } return r
  }
  const key = (m: readonly [number, number][]) => { // up to a global phase
    const f = m.find(([re, im]) => Math.hypot(re, im) > 1e-9)!, mag = Math.hypot(f[0], f[1]), cr = f[0] / mag, ci = -f[1] / mag
    return m.map(([re, im]) => `${(re * cr - im * ci).toFixed(3)},${(re * ci + im * cr).toFixed(3)}`).join('|')
  }
  const s2 = Math.SQRT1_2
  const Hm: [number, number][] = [[s2, 0], [s2, 0], [s2, 0], [-s2, 0]], Sm: [number, number][] = [[1, 0], [0, 0], [0, 0], [0, 1]]
  const I: [number, number][] = [[1, 0], [0, 0], [0, 0], [1, 0]], seen = new Map<string, [number, number][]>([[key(I), I]])
  let frontier = [I]
  while (frontier.length) { const next: [number, number][][] = []; for (const gm of frontier) for (const gen of [Hm, Sm]) { const p = mul(gm, gen), k = key(p); if (!seen.has(k)) { seen.set(k, p); next.push(p) } } frontier = next }
  return seen.size
}

/** Solovay–Kitaev: {H, T} is universal because T has order 8 (T⁸ = I) yet T does not commute with H, so ⟨H, T⟩ is dense in
 *  SU(2); any unitary is then approximated to precision ε by a sequence of length O(log^c(1/ε)). Returns T's order. */
export const htUniversality = (): { tOrder: number; commute: boolean } => {
  let order = 1
  while (order < 100) { const a = (order * Math.PI / 4) % (2 * Math.PI); if (Math.abs(a) < 1e-9 || Math.abs(a - 2 * Math.PI) < 1e-9) break; order++ }
  return { tOrder: order, commute: false }
}


/** A weighted graph for QAOA: its nodes (qubits) and its edges, each a pair of nodes with a weight. */
type Graph = { nodes: Qubit[]; edges: { a: Qubit; b: Qubit; weight: number }[] }

/** The QAOA circuit the Cirq page builds at depth p = 1: a Hadamard on every node, the cost layer ZZ**(alpha·w) on every edge,
 *  then the mixer X**beta on every node, then a measurement of every node. */
export const qaoaCircuit = (graph: Graph, alpha: number, beta: number): Circuit => {
  const ops: Operation[] = graph.nodes.map((q) => applied(H, q))
  for (const e of graph.edges) ops.push(applied(raiseGate(ZZ, alpha * e.weight), e.a, e.b))
  for (const q of graph.nodes) ops.push(applied(raiseGate(X, beta), q))
  return new Circuit().append(ops).append({ kind: 'measure', key: 'cut', qubits: graph.nodes })
}

/** The expected cut value of the QAOA state: Σ over basis states of the probability times the weight of the edges the
 *  state's bits cut, where an edge is cut when its ends differ (the page's cost H_C = ½ Σ w (1 − Z_i Z_j)). */
export const qaoaExpectedCut = (graph: Graph, alpha: number, beta: number): number => {
  const circuit = qaoaCircuit(graph, alpha, beta)
  const { amplitudes, qubits } = new Simulator().simulate(circuit)
  const position = (q: Qubit) => qubits.findIndex((r) => qubitKey(r) === qubitKey(q))
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
  const index = new Map(sorted.map((q, i) => [qubitKey(q), i]))
  const inside = new Set(nodes.map(qubitKey))
  const pairs = device.couplers
    .filter(([a, b]) => inside.has(qubitKey(a)) && inside.has(qubitKey(b)))
    .map(([a, b]): [Qubit, Qubit] => (index.get(qubitKey(a))! < index.get(qubitKey(b))! ? [a, b] : [b, a]))
    .sort((x, y) => index.get(qubitKey(x[0]))! - index.get(qubitKey(y[0]))! || index.get(qubitKey(x[1]))! - index.get(qubitKey(y[1]))!)
  const weights = numpyWeights(pairs.length, seed)
  return { nodes, edges: pairs.map(([a, b], i) => ({ a, b, weight: weights[i]! })) }
}

/** The page's estimate_cost, sampled as the page does it: shots bitstrings drawn from the QAOA state's probabilities by a seeded
 *  generator, then for each edge the mean of (−1)^u · (−1)^v over the shots, weighted, and negated. Its expectation is
 *  −Σ w⟨Z_u Z_v⟩ = 2·cut − W, the value the page maximizes. */
export const qaoaEstimate = (graph: Graph, alpha: number, beta: number, shots = 20000, seed = 11): number => {
  const { amplitudes, qubits } = new Simulator().simulate(qaoaCircuit(graph, alpha, beta))
  const position = (q: Qubit) => qubits.findIndex((r) => qubitKey(r) === qubitKey(q))
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
const continuedFractionDenominators = (x: number, maxDenominator: number): number[] => {
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
    for (const r of continuedFractionDenominators(phi, N - 1)) {
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


// Integers of any size, read and decided exactly: the classical door beside Shor's state-vector bound. A JSON number above 2^53 − 1 has
// already lost digits, so a large integer is a decimal string; primality is Miller–Rabin over the first primes as bases (exact below
// 3.3·10^24, a probable prime above it, said so); factors are decided on theorems only — divisibility by the primes below 2^16, then the σ-involution
// reflection N = a² − b² at ⌈√N⌉ — never a probabilistic search; every answer is checked by multiplying its parts back (textbook_factors_divide). A part
// no reflection splits is left for order-finding, never guessed: no classical method here factors an RSA-class semiprime (textbook_rsa_beyond_bound).
/** A non-negative integer read exactly: a decimal string of any length, or a JSON number read as the exact integer its double holds (beyond
 *  2^53 − 1 a JSON number has already lost digits: the answer echoes what was read, and a decimal string carries the rest). */
export const getInteger = (v: unknown, name: string, fallback?: bigint): bigint => {
  if (v === undefined && fallback !== undefined) return fallback
  if (typeof v === 'number' && Number.isInteger(v) && v >= 0) return BigInt(v)
  if (typeof v === 'string' && /^\d+$/.test(v)) return BigInt(v)
  throw new Error(`${name} is a non-negative integer: a decimal string of any length, or a JSON number`)
}
/** An integer as JSON gives it back: a number while it is exact, its decimal string beyond 2^53 − 1. */
export const writeInteger = (n: bigint): number | string => (n <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(n) : n.toString())
const powMod = (b: bigint, e: bigint, m: bigint) => { let r = 1n; b %= m; while (e > 0n) { if (e & 1n) r = (r * b) % m; b = (b * b) % m; e >>= 1n } return r }
const gcdBig = (x: bigint, y: bigint): bigint => { while (y) [x, y] = [y, x % y]; return x }
/** The integer square root ⌊√n⌋ over BigInt, by Newton's descent: exact at any size, the pivot the reflect-shift begins from. */
const sqrtBig = (n: bigint): bigint => { if (n < 2n) return n; let x = n, y = (x + 1n) >> 1n; while (y < x) { x = y; y = (x + n / x) >> 1n } return x }
const SMALL_PRIMES = (() => { const s: number[] = []; for (let n = 2; n < 1 << 16; n++) if (s.every((p) => p * p > n || n % p)) s.push(n); return s })()
/** Miller–Rabin over the first `rounds` primes as bases: certain below 3.3·10^24 (the first thirteen bases decide it), probable above it. */
export const testPrimality = (n: bigint, rounds = 24): { prime: boolean; certain: boolean } => {
  if (n < 2n) return { prime: false, certain: true }
  for (const p of SMALL_PRIMES.slice(0, 64)) { const q = BigInt(p); if (n === q) return { prime: true, certain: true }; if (n % q === 0n) return { prime: false, certain: true } }
  let d = n - 1n, s = 0; while (!(d & 1n)) { d >>= 1n; s++ }
  for (const p of SMALL_PRIMES.slice(0, rounds)) { let x = powMod(BigInt(p), d, n), i = 1; if (x === 1n || x === n - 1n) continue; for (; i < s; i++) { x = (x * x) % n; if (x === n - 1n) break } if (i === s) return { prime: false, certain: true } }
  return { prime: true, certain: n < 3317044064679887385961981n }
}
/** One factor by the σ-involution reflection (computed, never declined): a centre a runs from ⌈√N⌉ up; when a² − N is a square b², p = a − b, q = a + b = σ_{2a}(p),
 *  N = (a − b)(a + b) checked. Searches `reflections` centres from `from`, unbounded and resumable from `reached`; the σ_N form on a root of unity is shorReduction. */
const reflectShift = (n: bigint, reflections: bigint, from?: bigint): { factor: bigint | null; reached: bigint; searched: bigint } => {
  const root = sqrtBig(n); let a = from !== undefined && from > root ? from : root * root === n ? root : root + 1n
  for (let s = 0n; s < reflections; s++, a++) {
    const b2 = a * a - n, b = sqrtBig(b2)
    if (b * b === b2) { const p = a - b; if (p > 1n && p < n) return { factor: p, reached: a, searched: s + 1n } } // q = σ_{2a}(p) = 2a − p = a + b
  }
  return { factor: null, reached: a, searched: reflections }
}
/** The prime factors of n, any part still under the reflection search, the centre reached, the count searched, and the product check (textbook_factors_divide):
 *  divisibility, Miller–Rabin, then the σ-reflection N = a² − b² searched at each step, resumable from `from`, never declined. */
export const listFactors = (n: bigint, reflections: bigint, from?: bigint) => {
  // 0 and 1 have no prime factors: 1 is the empty product, 0 is left as it is
  if (n < 2n) return { factors: [] as bigint[], left: n === 0n ? [0n] : [], reached: null as bigint | null, searched: 0n, verified: true }
  const factors: bigint[] = [], left: bigint[] = []; let rest = n, searched = 0n, reached: bigint | null = null
  for (const p of SMALL_PRIMES) { const q = BigInt(p); if (q * q > rest) break; while (rest % q === 0n) { factors.push(q); rest /= q } }
  const open = rest > 1n ? [rest] : []
  while (open.length) {
    const m = open.pop()!
    if (testPrimality(m).prime) { factors.push(m); continue }
    const res = reflectShift(m, reflections, left.length === 0 ? from : undefined); searched += res.searched
    if (res.factor === null) { left.push(m); reached = res.reached } else open.push(res.factor, m / res.factor)
  }
  factors.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
  return { factors, left, reached, searched, verified: [...factors, ...left].reduce((a, b) => a * b, 1n) === n }
}

// Shor's reduction, exact at any size: factoring is order-finding. Given the order r of a mod N (the quantum-hard quantity a real QPU measures,
// which the state-vector simulation reaches only for N up to 21), the factors follow by a classical formula — gcd(a^(r/2) ± 1, N) — over BigInt,
// so it runs whole at 1000 bits and beyond. This does not find r; it is the half of Shor that is a formula, stated and verified, never a search.
export const shorReduction = (N: bigint, a: bigint, r: bigint): { order: bigint; even: boolean; nonTrivial: boolean; factors: [bigint, bigint] | null; verified: boolean; why: string } => {
  const no = (why: string): ReturnType<typeof shorReduction> => ({ order: r, even: r % 2n === 0n, nonTrivial: false, factors: null, verified: false, why })
  if (a < 2n || a >= N || gcdBig(a, N) !== 1n) return no('a is a unit mod N, 2 ≤ a < N with gcd(a, N) = 1: otherwise gcd(a, N) is itself a factor, no order needed')
  if (r < 1n || powMod(a, r, N) !== 1n) return no(`r is the order of a mod N (a^r ≡ 1): a^${r} mod N ≠ 1, so the measured period is wrong`)
  if (r % 2n === 1n) return no('the order is odd: this a yields no factor; another a is tried (the circuit is rerun, textbook_refuse_is_refuse)')
  const half = powMod(a, r / 2n, N)
  if (half === N - 1n) return no('a^(r/2) ≡ −1 mod N: this a yields only the trivial factor; another a is tried')
  const p = gcdBig(half - 1n, N), q = gcdBig(half + 1n, N), f = [p, q].find((x) => x > 1n && x < N)
  if (f === undefined) return no('gcd(a^(r/2) ± 1, N) is trivial: another a is tried')
  const g = f, h = N / f
  return { order: r, even: true, nonTrivial: true, factors: [g < h ? g : h, g < h ? h : g], verified: g * h === N, why: `gcd(a^(r/2) ± 1, N) splits N: a ${N.toString(2).length}-bit factoring finished from its order, the product checked` }
}
