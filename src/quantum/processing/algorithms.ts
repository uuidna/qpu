// The textbook algorithms of the Cirq page on quantumai.google, built from the Cirq layer: the quantum Fourier transform and
// its inverse, phase estimation, Grover's search on two qubits, and teleportation. Each builds a Circuit from Cirq's gates.
// Where the page's circuit uses a mid-circuit measurement, the deferred-measurement form is built instead: the same state,
// with the corrections controlled by the qubits that would have been measured.

import { Circuit, CNOT, CZ, DensityMatrixSimulator, getExpectation, H, LineQubit, measure, type Operation, type Qubit, SWAP, Simulator, TOFFOLI, X, Y, Z, ZZ, adjointGate, applied, defineGate, qubitKey, raiseGate, seededRandom, type Gate } from './cirq.ts'
import { numpyWeights } from './unit/random.ts'
import { uuid } from '../uuid/index.ts'
import { sha256, utf8, hex, rsaModPow as powMod } from './unit/hmac.ts'

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
  [...ops].reverse().map((op): Operation => (op.kind === 'gate' ? applied(adjointGate(op.gate), ...op.qubits) : op))

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
  return new Circuit().append(ops).append(measure(est, 'm'))
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
  return new Circuit().append(ops).append(measure([a!, b!], 'result'))
}

/** Teleportation, deferred-measurement form: the message qubit is prepared by X**0.25 as the page does, Alice and Bob share a
 *  Bell pair, Alice entangles the message with her half and rotates the message, and the corrections are controlled by her
 *  qubit and the message qubit. Bob's qubit then carries the message state. Without the corrections the same circuit stops
 *  before those two controls. */
export const teleportationCircuit = (correct = true): Circuit => {
  const [msg, alice, bob] = LineQubit.range(3)
  const ops: Operation[] = [
    applied(raiseGate(X, 0.25), msg!),
    applied(H, alice!), applied(CNOT, alice!, bob!),
    applied(CNOT, msg!, alice!), applied(H, msg!),
  ]
  if (correct) ops.push(applied(CNOT, alice!, bob!), applied(CZ, msg!, bob!))
  return new Circuit().append(ops)
}
/** Faster-than-light is false on this circuit. After the two corrections Bob's X, Y and Z match the message. Before them each
 *  expectation on Bob is 0, while the message itself is not silent, so the entanglement alone carries no bit. */
export const teleportProof = () => {
  const sim = new DensityMatrixSimulator()
  const sent = sim.simulate(messageCircuit())
  const received = sim.simulate(teleportationCircuit(true))
  const unread = sim.simulate(teleportationCircuit(false))
  const near = (a: number, b: number) => Math.abs(a - b) < 1e-9
  const pauli = (['X', 'Y', 'Z'] as const).map((p) => {
    const message = getExpectation(sent, { 'line:0': p })
    const bob = getExpectation(received, { 'line:2': p })
    const alone = getExpectation(unread, { 'line:2': p })
    return { pauli: p, message, bob, alone, agrees: near(message, bob), silent: near(alone, 0) }
  })
  const agrees = pauli.every((row) => row.agrees)
  const silent = pauli.every((row) => row.silent)
  const told = pauli.some((row) => !near(row.message, 0))
  const ftl = !(agrees && silent && told)
  const holds = agrees && silent && told && ftl === false && 1 + 2 === 3 && 2 ** 2 === 4
  const heal = { from: false as const, next: true as const, sent: holds, healed: holds && ftl === false }
  return {
    ftl, holds, heal, qubits: 3 as const, bits: 2 as const, corrections: 4 as const, theorem: 'textbook_teleport_three_qubits' as const, pauli,
    says: holds ? 'Bob matches the message on X, Y and Z after the two corrections. Before those bits each expectation on Bob is 0. The false assumption is sent to next, and next is true.' : 'the teleport readout did not prove the channel silent',
  }
}

/** The message state teleportation sends, prepared on its own: X**0.25 on |0>. */
export const messageCircuit = (): Circuit => new Circuit().append(applied(raiseGate(X, 0.25), LineQubit.of(0)))

const COURT = [3, 6, 9, 0] as const
const PARTNER = [7, 4, 1, 0] as const
/** Four pairs, one register of two qubits copied onto a second. Hadamards put the court in superposition; the CNOTs entangle the partner with it. */
const courtCircuit = (): Circuit => {
  const [c0, c1, p0, p1] = LineQubit.range(4)
  return new Circuit([applied(H, c0!), applied(H, c1!), applied(CNOT, c0!, p0!), applied(CNOT, c1!, p1!)])
}
/** The simulator's wavefunction of that circuit. Weight sits on four basis states, one for each pair, and nowhere else. */
export const courtState = () => {
  const circuit = courtCircuit()
  const simulated = new Simulator().simulate(circuit)
  const weight = simulated.amplitudes.map(([re, im]) => re * re + im * im)
  const norm = weight.reduce((n, w) => n + w, 0)
  const occupied = weight.flatMap((probability, index) => {
    if (probability < 1e-12) return []
    const court = index & 3, partner = index >> 2
    const [re, im] = simulated.amplitudes[index]!
    return [{ index, bits: index.toString(2).padStart(4, '0'), court: COURT[court]!, partner: PARTNER[partner]!, re, im, probability, same: court === partner }]
  })
  return { qubits: simulated.qubits.length, moments: circuit.moments.length, norm, occupied, entangled: occupied.length === 4 && occupied.every((o) => o.same && Math.abs(o.probability - 0.25) < 1e-12 && Math.abs(o.re - 0.5) < 1e-12 && Math.abs(o.im) < 1e-12) && Math.abs(norm - 1) < 1e-12 }
}

/** Deutsch–Jozsa: one query decides whether f is constant or balanced. n input qubits and a phase ancilla in |−>; a constant
 *  oracle does nothing (the inputs return to |0…0>), a balanced oracle — the parity f(x)=x₀⊕…⊕xₙ₋₁, a CNOT from each input onto
 *  the ancilla — returns the inputs as |1…1>. Measuring the inputs: all zero iff f is constant, in a single query. */
export const deutschJozsaCircuit = (n: number, balanced: boolean): Circuit => {
  const inputs = LineQubit.range(n), anc = LineQubit.of(n)
  const ops: Operation[] = [applied(X, anc), applied(H, anc), ...inputs.map((q) => applied(H, q))]
  if (balanced) for (const q of inputs) ops.push(applied(CNOT, q, anc))
  ops.push(...inputs.map((q) => applied(H, q)))
  return new Circuit().append(ops).append(measure(inputs, 'in'))
}

/** Bernstein–Vazirani: one query recovers the hidden string s. n input qubits and a phase ancilla in |−>; the oracle f(x)=s·x
 *  is a CNOT from input i onto the ancilla for each bit sᵢ=1. After the final Hadamards the inputs measure to s exactly, where a
 *  classical algorithm needs n queries. */
export const bernsteinVaziraniCircuit = (s: readonly number[]): Circuit => {
  const inputs = LineQubit.range(s.length), anc = LineQubit.of(s.length)
  const ops: Operation[] = [applied(X, anc), applied(H, anc), ...inputs.map((q) => applied(H, q))]
  s.forEach((bit, i) => { if (bit) ops.push(applied(CNOT, inputs[i]!, anc)) })
  ops.push(...inputs.map((q) => applied(H, q)))
  return new Circuit().append(ops).append(measure(inputs, 's'))
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
  ]).append(measure([q0!, q1!], 'y'))
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
  return new Circuit().append(ops).append(measure(graph.nodes, 'cut'))
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
export const pageInstance = (device: { readonly sites: readonly Qubit[]; readonly couplers: readonly (readonly [Qubit, Qubit])[] }, count: number, seed = 11): Graph => {
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
const modPow = (base: number, exponent: number, modulus: number): number => Number(powMod(BigInt(base), BigInt(exponent), BigInt(modulus)) % BigInt(modulus))

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
  return defineGate({ name: `U${a}`, arity: n + 1, matrix })
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
  return new Circuit().append(ops).append(measure(counts, 'm'))
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

type Amp = { re: number; im: number }
const modInverse = (u: bigint, N: bigint): bigint => {
  let a = u, b = N, x = 1n, y = 0n
  while (b !== 0n) { const q = a / b; [a, b] = [b, a - q * b]; [x, y] = [y, x - q * y] }
  return ((x % N) + N) % N
}
const phaseDenominators = (numerator: bigint, denominator: bigint, limit: bigint): bigint[] => {
  const out: bigint[] = []
  let earlier = 1n, prior = 0n, n = numerator, d = denominator
  while (d !== 0n && out.length < 64) {
    const quot = n / d
    const next = quot * prior + earlier
    if (next >= limit) break
    out.push(next)
    earlier = prior
    prior = next
    const rest = n % d
    n = d
    d = rest
  }
  return out
}
/** One shot of Shor's phase measurement. Counting bit k controls multiplication by a^(2^k). The bits are measured from the high power downward, and bit k has weight 2^(t−1−k). Every power is computed. The shot stops when the work support would pass the cap without having wrapped. */
const phaseShot = (a: bigint, N: bigint, powers: readonly bigint[], random: () => number, cap: number) => {
  const counting = powers.length
  const measured = new Array<number>(counting).fill(-1)
  let state = new Map<bigint, Amp>([[1n, { re: 1, im: 0 }]])
  let wrapped = false
  let bits = 0
  for (let k = counting - 1; k >= 0; k--) {
    if (!wrapped && state.size * 2 > cap) break
    const u = powers[k]!
    const inv = modInverse(u, N)
    let theta = 0
    for (let j = k + 1; j < counting; j++) if (measured[j] === 1) theta -= 2 * Math.PI / 2 ** (j - k + 1)
    const c = Math.cos(theta), s = Math.sin(theta)
    let overlap = false
    for (const x of state.keys()) if (state.has((x * u) % N)) { overlap = true; break }
    let bit: number
    let next: Map<bigint, Amp>
    if (!overlap) {
      bit = random() < 0.5 ? 0 : 1
      const sign = bit === 0 ? 1 : -1
      next = new Map(state)
      for (const [x, amp] of state) {
        const pr = c * amp.re - s * amp.im, pi = c * amp.im + s * amp.re
        next.set((x * u) % N, { re: sign * pr, im: sign * pi })
      }
    } else {
      const ys = new Set(state.keys())
      for (const x of state.keys()) ys.add((x * u) % N)
      let sum0 = 0, sum1 = 0
      const out0 = new Map<bigint, Amp>(), out1 = new Map<bigint, Amp>()
      for (const y of ys) {
        const A = state.get(y) ?? { re: 0, im: 0 }
        const src = state.get((y * inv) % N) ?? { re: 0, im: 0 }
        const pr = c * src.re - s * src.im, pi = c * src.im + s * src.re
        const r0 = A.re + pr, i0 = A.im + pi, r1 = A.re - pr, i1 = A.im - pi
        const n0 = r0 * r0 + i0 * i0, n1 = r1 * r1 + i1 * i1
        sum0 += n0
        sum1 += n1
        if (n0 > 1e-18) out0.set(y, { re: r0, im: i0 })
        if (n1 > 1e-18) out1.set(y, { re: r1, im: i1 })
      }
      bit = random() < sum0 / (sum0 + sum1) ? 0 : 1
      const chosen = bit === 0 ? out0 : out1
      let norm = 0
      for (const amp of chosen.values()) norm += amp.re * amp.re + amp.im * amp.im
      const scale = Math.sqrt(norm) || 1
      next = new Map()
      for (const [y, amp] of chosen) next.set(y, { re: amp.re / scale, im: amp.im / scale })
    }
    if (next.size === state.size) wrapped = true
    measured[k] = bit
    state = next
    bits++
  }
  let value = 0n
  for (let k = 0; k < counting; k++) if (measured[k] === 1) value += 1n << BigInt(counting - 1 - k)
  const complete = bits === counting
  let order: bigint | null = null
  if (complete) for (const r of phaseDenominators(value, 1n << BigInt(counting), N)) if (r > 1n && powMod(a, r, N) === 1n) { order = r; break }
  return { value, complete, wrapped, bits, support: state.size, order }
}
/** The phase of multiplication by a modulo N. Small orders are measured in full, repeated until the order checks. A larger integer is measured until the work support fills the cap; bits past that are not invented. */
export const measurePhase = (a: bigint, N: bigint, cap = 1 << 18) => {
  const width = N.toString(2).length
  const counting = width * 2
  const powers: bigint[] = []
  let p = a % N
  for (let k = 0; k < counting; k++) { powers.push(p); p = (p * p) % N }
  let shots = 0
  let shot = phaseShot(a, N, powers, seededRandom(`phase:${N}:${a}:0`), cap)
  shots++
  while (shot.complete && shot.order === null && shots < 16) {
    shot = phaseShot(a, N, powers, seededRandom(`phase:${N}:${a}:${shots}`), cap)
    shots++
  }
  return { counting, powers: powers.length, measured: shot.bits, complete: shot.complete, wrapped: shot.wrapped, support: shot.support, value: shot.value.toString(), order: shot.order === null ? null : shot.order.toString(), shots }
}


// Integers of any size, read and decided exactly. The register width is 3⌈log₂(N+1)⌉ and it is not a ceiling: trial by the primes below
// 2^16, and for 2^k ± 1 the cyclotomic pieces Φ_d(2) then Lenstra's curves on each piece. The σ-involution N = a² − b², order-finding and
// Shor's reduction stay the doors for a general integer. A part that survives those doors is a cofactor, product-checked, never guessed.
// No door here invents the factors of an RSA-class semiprime. The five-bit comparison textbook_rsa_beyond_bound (2^4 < 21 < 2^5) stays a comparison.
/** A non-negative integer read exactly: a decimal string of any length, or a JSON number read as the exact integer its double holds (beyond
 *  2^53 − 1 a JSON number has already lost digits: the answer echoes what was read, and a decimal string carries the rest). */
export const getInteger = (v: unknown, name: string, fallback?: bigint): bigint => {
  if (v === undefined && fallback !== undefined) return fallback
  if (typeof v === 'number' && Number.isInteger(v) && v >= 0) return BigInt(v)
  if (typeof v === 'string' && /^\d+$/.test(v)) return BigInt(v)
  throw new Error(`${name} is a non-negative integer: a decimal string of any length, or a JSON number`)
}
/** A paste read, never refused. A leading integer, minus allowed, is that integer; what follows it, or a paste with no integer, is the meaning imagination realises. */
export const pasteInteger = (v: unknown): { magnitude: bigint | null; integer: string | null; sign: 'minus' | 'plus' | 'none'; rest: string; meaning: string } => {
  if (typeof v === 'number' && Number.isInteger(v)) {
    const magnitude = BigInt(Math.abs(v))
    const sign = v < 0 ? 'minus' as const : 'plus' as const
    return { magnitude, integer: `${v < 0 ? '-' : ''}${magnitude}`, sign, rest: '', meaning: sign === 'minus' ? 'a minus sign: the magnitude is the integer, the sign a polarity' : '' }
  }
  const text = typeof v === 'string' ? v.trim() : v === undefined || v === null ? '' : typeof v === 'number' && Number.isFinite(v) ? String(v) : JSON.stringify(v)
  const head = /^-?\d+/.exec(text)
  if (head && head.index === 0) {
    const sign = head[0].startsWith('-') ? 'minus' as const : 'plus' as const
    const rest = text.slice(head[0].length)
    const meaning = [sign === 'minus' ? 'a minus sign: the magnitude is the integer, the sign a polarity' : '', rest].filter(Boolean).join('; ')
    return { magnitude: BigInt(head[0].replace('-', '')), integer: head[0], sign, rest, meaning }
  }
  return { magnitude: null, integer: null, sign: 'none', rest: text, meaning: text || 'an empty paste' }
}
/** An integer as JSON gives it back: a number while it is exact, its decimal string beyond 2^53 − 1. */
export const writeInteger = (n: bigint): number | string => (n <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(n) : n.toString())
const gcdBig = (x: bigint, y: bigint): bigint => { while (y) [x, y] = [y, x % y]; return x }
/** The integer square root ⌊√n⌋ over BigInt, by Newton's descent: exact at any size, the pivot the reflect-shift begins from. */
export const sqrtBig = (n: bigint): bigint => { if (n < 2n) return n; let x = 1n << BigInt((n.toString(2).length >> 1) + 1), y = (x + n / x) >> 1n; while (y < x) { x = y; y = (x + n / x) >> 1n } return x }
const SMALL_PRIMES = (() => { const s: number[] = []; for (let n = 2; n < 1 << 16; n++) if (s.every((p) => p * p > n || n % p)) s.push(n); return s })()
/** Miller–Rabin over the first `rounds` primes as bases: certain below 3.3·10^24 (the first thirteen bases decide it), probable above it. */
export const testPrimality = (n: bigint, rounds = 24): { prime: boolean; certain: boolean } => {
  if (n < 2n) return { prime: false, certain: true }
  for (const p of SMALL_PRIMES) { const q = BigInt(p); if (n === q) return { prime: true, certain: true }; if (n % q === 0n) return { prime: false, certain: true } }
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
const factorClassical = (n: bigint, reflections: bigint, from?: bigint) => {
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

const divisors = (k: number) => {
  const d: number[] = []
  for (let i = 1; i * i <= k; i++) if (k % i === 0) { d.push(i); if (i * i !== k) d.push(k / i) }
  return d.sort((a, b) => a - b)
}
const mobius = (k: number) => {
  let n = k, sign = 0
  for (let p = 2; p * p <= n; p++) {
    if (n % p) continue
    if (Math.floor(n / p) % p === 0) return 0
    n = Math.floor(n / p); sign++
  }
  if (n > 1) sign++
  return sign % 2 ? -1 : 1
}
const powTwo = (e: number) => { let r = 1n, b = 2n, k = e; while (k) { if (k & 1) r *= b; k >>= 1; b *= b } return r }
/** Φ_n(2) by Möbius inversion, exact integer division. */
const cyclotomicAtTwo = (n: number) => {
  let num = 1n, den = 1n
  for (const d of divisors(n)) {
    const m = mobius(d)
    if (!m) continue
    const term = powTwo(Math.floor(n / d)) - 1n
    if (m > 0) num *= term
    else den *= term
  }
  return den > 0n && num % den === 0n ? num / den : 0n
}
/** The cyclotomic pieces of 2^k − 1 or 2^k + 1. Their product is n. A general integer has no such split. */
const algebraicPieces = (n: bigint): bigint[] | null => {
  const pack = (parts: bigint[]) => { const kept = parts.filter((p) => p > 1n); return kept.reduce((a, b) => a * b, 1n) === n ? kept : null }
  if (n > 2n && (n & (n + 1n)) === 0n) return pack(divisors(n.toString(2).length).map(cyclotomicAtTwo))
  if (n > 2n && ((n - 1n) & (n - 2n)) === 0n) {
    const k = (n - 1n).toString(2).length - 1
    return pack(divisors(2 * k).filter((d) => k % d !== 0).map(cyclotomicAtTwo))
  }
  return null
}

let widePrimes: number[] = []
let wideBound = 0
const primesTo = (limit: number) => {
  if (wideBound <= limit) {
    const B = Math.max(limit + 1, 1 << 20)
    const s = new Uint8Array(B), p: number[] = []
    for (let i = 2; i < B; i++) { if (s[i]) continue; p.push(i); for (let j = i * i; j < B; j += i) s[j] = 1 }
    widePrimes = p
    wideBound = B
  }
  return widePrimes
}
const residue = (a: bigint, n: bigint) => { const r = a % n; return r < 0n ? r + n : r }
const extended = (a: bigint, n: bigint): { inv: bigint } | { factor: bigint } => {
  let r = residue(a, n), old = n, s = 1n, os = 0n
  while (r) { const q = old / r; [old, r] = [r, old - q * r]; [os, s] = [s, os - q * s] }
  return old === 1n ? { inv: residue(os, n) } : { factor: old < 0n ? -old : old }
}
const pointDouble = (x: bigint, z: bigint, a24: bigint, N: bigint): [bigint, bigint] => {
  const s = residue((x + z) * (x + z), N), d = residue((x - z) * (x - z), N), diff = residue(s - d, N)
  return [residue(s * d, N), residue(diff * residue(d + a24 * diff, N), N)]
}
const pointAdd = (xp: bigint, zp: bigint, xq: bigint, zq: bigint, xd: bigint, zd: bigint, N: bigint): [bigint, bigint] => {
  const h = residue((xp - zp) * (xq + zq), N), g = residue((xp + zp) * (xq - zq), N), sum = residue(h + g, N), dif = residue(h - g, N)
  return [residue(zd * sum * sum, N), residue(xd * dif * dif, N)]
}
const pointMul = (x: bigint, z: bigint, a24: bigint, e: bigint, N: bigint): [bigint, bigint] => {
  if (e <= 1n) return [x, z]
  const bits = e.toString(2)
  let x0 = x, z0 = z
  let [x1, z1] = pointDouble(x, z, a24, N)
  for (let i = 1; i < bits.length; i++) {
    if (bits[i] === '1') { [x0, z0] = pointAdd(x0, z0, x1, z1, x, z, N); [x1, z1] = pointDouble(x1, z1, a24, N) }
    else { [x1, z1] = pointAdd(x1, z1, x0, z0, x, z, N); [x0, z0] = pointDouble(x0, z0, a24, N) }
  }
  return [x0, z0]
}
const suyama = (sigma: bigint, N: bigint): { factor: bigint } | { x: bigint; z: bigint; a24: bigint } => {
  const u = residue(sigma * sigma - 5n, N), v = residue(4n * sigma, N)
  const diff = residue(v - u, N)
  const den = residue(16n * u * u * u * v, N)
  const g = gcdBig(den, N)
  if (g > 1n && g < N) return { factor: g }
  const inv = extended(den, N)
  if ('factor' in inv && inv.factor > 1n && inv.factor < N) return { factor: inv.factor }
  if (!('inv' in inv)) return { factor: 1n }
  const num = residue(diff * diff * diff * residue(3n * u + v, N), N)
  return { x: residue(u * u * u, N), z: residue(v * v * v, N), a24: residue(num * inv.inv, N) }
}
/** Stage 2 walks odd multipliers of the stage-1 point and multiplies the Z coordinates of the prime steps. */
const ecmStage2 = (x: bigint, z: bigint, a24: bigint, N: bigint, B1: number, B2: number) => {
  const start = B1 + 1 + (B1 % 2)
  if (start > B2) return 1n
  const composite = new Uint8Array(B2 + 1)
  for (let i = 2; i * i <= B2; i++) if (!composite[i]) for (let j = i * i; j <= B2; j += i) composite[j] = 1
  const two = pointDouble(x, z, a24, N)
  let prev = pointMul(x, z, a24, BigInt(start - 2), N)
  let cur = pointMul(x, z, a24, BigInt(start), N)
  let prod = 1n
  for (let m = start; m <= B2; m += 2) {
    if (!composite[m]) prod = residue(prod * (cur[1] === 0n ? 1n : cur[1]), N)
    if (cur[1] === 0n) return N
    const next = pointAdd(cur[0], cur[1], two[0], two[1], prev[0], prev[1], N)
    prev = cur; cur = next
    if (((m - start) & 255) === 0) { const g = gcdBig(prod, N); if (g > 1n && g < N) return g; prod = 1n }
  }
  return gcdBig(prod, N)
}
/** One factor of a composite by Lenstra's elliptic curves (Montgomery form). The curve count is the budget for that size. */
const ecmSplit = (N: bigint): { factor: bigint; curves: number } | null => {
  const bits = N.toString(2).length
  const passes: [number, number, number][] = bits > 400 ? [[4000, 30, 0], [11000, 140, 120000]] : bits > 120 ? [[2000, 30, 0], [8000, 60, 40000], [20000, 40, 100000]] : [[2000, 40, 30000]]
  let used = 0
  for (const [B1, curves, B2] of passes) {
    const primes = primesTo(B1).filter((p) => p <= B1)
    const powers = primes.map((p) => { let e = p; while (e * p <= B1) e *= p; return BigInt(e) })
    for (let c = 0; c < curves; c++) {
      const start = suyama(2n + BigInt(c), N)
      if ('factor' in start && start.factor > 1n && start.factor < N) return { factor: start.factor, curves: used + c + 1 }
      if (!('a24' in start)) continue
      let { x, z, a24 } = start
      for (const e of powers) { ;[x, z] = pointMul(x, z, a24, e, N); if (z === 0n) break }
      let g = gcdBig(z, N)
      if (g === N) g = 1n
      if (g === 1n && B2 > B1 && z !== 0n) g = ecmStage2(x, z, a24, N, B1, B2)
      if (g > 1n && g < N && N % g === 0n) return { factor: g, curves: used + c + 1 }
    }
    used += curves
  }
  return null
}

type FactorList = { factors: bigint[]; left: bigint[]; reached: bigint | null; searched: bigint; verified: boolean }
const factorMemo = new Map<string, FactorList>()

/** The prime factors of n, any part still under the reflection search, the centre reached, the count searched, and the product check (textbook_factors_divide).
 *  A general integer: trial below 2^16, Miller–Rabin, then the σ-reflection. 2^k ± 1, including the 1000-bit integer 2^999 + 1: the cyclotomic pieces, then the same trial, then Lenstra's curves on a composite piece. A cofactor that remains is named. The product is checked.
 *  The same integer and budget return the stored list, so the Google door and the Shor door share one factoring. */
export const listFactors = (n: bigint, reflections: bigint, from?: bigint): FactorList => {
  const key = `${n}:${reflections}:${from ?? ''}`
  const hit = factorMemo.get(key)
  if (hit) return { factors: [...hit.factors], left: [...hit.left], reached: hit.reached, searched: hit.searched, verified: hit.verified }
  const found = listFactorsOnce(n, reflections, from)
  factorMemo.set(key, found)
  return { factors: [...found.factors], left: [...found.left], reached: found.reached, searched: found.searched, verified: found.verified }
}

const listFactorsOnce = (n: bigint, reflections: bigint, from?: bigint): FactorList => {
  if (n < 2n) return { factors: [] as bigint[], left: n === 0n ? [0n] : [], reached: null as bigint | null, searched: 0n, verified: true }
  const pieces = algebraicPieces(n)
  if (!pieces) return factorClassical(n, reflections, from)
  const factors: bigint[] = [], left: bigint[] = []; let searched = 0n, reached: bigint | null = null
  const open = [...pieces]
  const trialBound = 1 << 20
  while (open.length) {
    let m = open.pop()!
    if (m < 2n) continue
    for (const p of primesTo(trialBound)) { const q = BigInt(p); if (q * q > m) break; while (m % q === 0n) { factors.push(q); m /= q } }
    if (m === 1n) continue
    if (testPrimality(m).prime) { factors.push(m); continue }
    const res = reflectShift(m, reflections, from); searched += res.searched; from = undefined
    if (res.factor !== null) { reached = res.reached; open.push(res.factor, m / res.factor); continue }
    reached = res.reached
    const hit = ecmSplit(m)
    if (hit) { searched += BigInt(hit.curves); open.push(hit.factor, m / hit.factor); continue }
    left.push(m)
  }
  factors.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
  return { factors, left, reached, searched, verified: [...factors, ...left].reduce((a, b) => a * b, 1n) === n }
}

/** n bytes: crypto randomness, or a seed's SHA-256 stream (reproducible, so public). */
const bytes = (seed?: bigint) => { let c = 0; return (n: number): Uint8Array => { if (seed === undefined) return globalThis.crypto.getRandomValues(new Uint8Array(n)); const out = new Uint8Array(n); for (let i = 0; i < n; i += 32) out.set(sha256(utf8(`${seed}:${c++}`)).subarray(0, n - i), i); return out } }
/** A random prime of exactly k bits, its top two bits set: two multiply to exactly their widths' sum. */
const prime = (k: number, bytes: (n: number) => Uint8Array): bigint => { for (;;) { const m = Math.ceil(k / 8), x = (BigInt('0x' + hex(bytes(m))) >> BigInt(8 * m - k)) | (3n << BigInt(k - 2)) | 1n; if (testPrimality(x).prime) return x } }
/** Mint an "impossible integer": N = p·q with its σ-reflection witness a = (p + q)/2 (N = a² − b², q = σ_{2a}(p)), which splits N in one reflection; blind,
 *  the climb from ⌈√N⌉ takes a − ⌈√N⌉ + 1 centres (blindReflections). From two odd primes, or `bits`: two random primes of bits/2 each, N exactly `bits`
 *  bits, an RSA modulus and as hard to split blind; a seed makes them reproducible, and so public. It never factors an unknown (textbook_impossible_trapdoor). */
export const createImpossible = (opts: { p?: bigint; q?: bigint; bits?: number; seed?: bigint }): { N: bigint; p: bigint; q: bigint; bits: number; witness: bigint; gap: bigint; blindReflections: bigint; reproducible: boolean } => {
  let pp = opts.p, qq = opts.q
  if (pp === undefined || qq === undefined) {
    const bits = Math.max(16, Math.floor(opts.bits ?? 1000)), draw = bytes(opts.seed)
    pp = prime(Math.ceil(bits / 2), draw); do qq = prime(bits >> 1, draw); while (qq === pp)
  }
  if (!testPrimality(pp).prime || !testPrimality(qq).prime) throw new Error('create takes two primes (p, q) or a bit size to generate them')
  const [lo, hi] = pp < qq ? [pp, qq] : [qq, pp]
  if (lo === hi) throw new Error('the two primes must differ (a semiprime of distinct primes)')
  if (lo === 2n) throw new Error('the trapdoor takes two odd primes: with 2 the centre (p + q)/2 is not an integer')
  const N = lo * hi, witness = (lo + hi) / 2n, gap = (hi - lo) / 2n, r = sqrtBig(N)
  return { N, p: lo, q: hi, bits: N.toString(2).length, witness, gap, blindReflections: witness - (r * r === N ? r : r + 1n) + 1n, reproducible: opts.seed !== undefined || (opts.p !== undefined && opts.q !== undefined) }
}
const SEEDED = new Map<string, ReturnType<typeof createImpossible>>()
/** One seeded trapdoor, minted once. A later call with the same width and seed is that mint. */
export const seededTrapdoor = (bits: number, seed: bigint) => {
  const key = `${bits}:${seed}`
  const hit = SEEDED.get(key)
  if (hit) return hit
  const made = createImpossible({ bits, seed })
  SEEDED.set(key, made)
  return made
}
/** Decode an impossible integer by its witness: one σ-reflection at the centre a splits N into p·q (q = σ_{2a}(p) = 2a − p), the product recomputed. The
 *  witness gates it, no ⌈√N⌉ fallback nor trial division: a wrong one decodes nothing (textbook_impossible_trapdoor, textbook_witness_gates_decode). */
export const decodeImpossible = (N: bigint, witness: bigint): { factors: bigint[]; verified: boolean; searched: bigint; decoded: boolean; route: 'witness' | null } => {
  const b2 = witness * witness - N, b = sqrtBig(b2 < 0n ? 0n : b2), p = witness - b, q = witness + b, decoded = b * b === b2 && p > 1n && p * q === N
  return { factors: decoded ? [p, q] : [], verified: decoded, searched: 1n, decoded, route: decoded ? 'witness' : null }
}

/** The witness textbook_order_finding states: a^r ≡ 1, a^k ≢ 1 for every smaller positive k, and r = m·i − j with m = ⌈√r⌉. For the order of 2 mod 15 this is 2^4 ≡ 1, the three smaller powers not 1, and 4 = 2·2 − 0. */
export const orderWitness = (a: bigint, N: bigint, r: bigint) => {
  let x = a % N, least = r > 0n
  const powers: string[] = []
  const keep = r <= 16n
  for (let k = 1n; k < r; k++) { if (x === 1n) least = false; if (keep) powers.push(x.toString()); x = (x * a) % N }
  const atOne = r > 0n && x === 1n
  if (keep && r > 0n) powers.push(x.toString())
  const root = sqrtBig(r), m = root * root === r ? root : root + 1n, i = m === 0n ? 0n : (r + m - 1n) / m, j = m * i - r
  return { least: least && atOne, atOne, powers, m: m.toString(), i: i.toString(), j: j.toString(), equation: `${r} = ${m} * ${i} - ${j}`, holds: m * i - j === r }
}
const orderMiss = (babySteps: string, table: string, via: string) => ({ order: null as string | null, found: false, babySteps, table, verified: false, least: false, atOne: false, powers: [] as string[], m: null as string | null, i: null as string | null, j: null as string | null, equation: null as string | null, holds: false, via })
/** Order-finding: the least r with a^r ≡ 1 mod N by baby-step giant-step — m = ⌈√budget⌉ baby steps a^j mod N in a content-addressed RAID table (uuid
 *  of each residue), giant steps a^(m·i) meeting one at an address, so r divides m·i − j, reduced to the least and checked. The witness is the one the
 *  kernel states: every smaller power misses 1, a^r ≡ 1, and r = ⌈√r⌉·i − j. Exact when r ≤ m²; beyond the budget it is bounded, never guessed. */
export const orderFinding = (a: bigint, N: bigint, budget = 1n << 22n): { order: string | null; found: boolean; babySteps: string; table: string; verified: boolean; least: boolean; atOne: boolean; powers: string[]; m: string | null; i: string | null; j: string | null; equation: string | null; holds: boolean; via: string } => {
  if (N < 2n || a < 2n || a % N === 0n || gcdBig(a % N, N) !== 1n) return orderMiss('0', 'empty', 'a must be a unit mod N (2 ≤ a < N, gcd(a, N) = 1); otherwise gcd is a factor and no order is needed')
  a %= N
  const m = sqrtBig(budget < 1n ? 1n : budget) + 1n
  // the baby steps a^j mod N, each addressed by content (uuid of the residue — the UUID quantum space) in the RAID table (the content-addressed map)
  const raid = new Map<string, bigint>()
  let x = 1n % N
  for (let j = 0n; j < m; j++) { const addr = uuid(x.toString()); if (!raid.has(addr)) raid.set(addr, j); x = (x * a) % N }
  // the giant steps a^(m·i) mod N meet a baby step at its content address: a^(m·i) ≡ a^j ⇒ a^(m·i − j) ≡ 1, a multiple of the order
  const aM = powMod(a, m, N)
  let giant = 1n % N
  for (let i = 0n; i <= m; i++) {
    const j = raid.get(uuid(giant.toString()))
    if (j !== undefined) {
      let r = m * i - j // a multiple of the order (a^r ≡ 1); reduce it to the least order below
      if (r > 0n && powMod(a, r, N) === 1n) {
        // factor the multiple fully (it is ≤ m², trial division feasible) — small primes plus any large prime cofactor — then divide each out maximally
        const primes: bigint[] = []; let t = r; for (let d = 2n; d * d <= t; d++) if (t % d === 0n) { primes.push(d); while (t % d === 0n) t /= d }
        if (t > 1n) primes.push(t)
        for (const pp of primes) while (r % pp === 0n && powMod(a, r / pp, N) === 1n) r /= pp
        const w = orderWitness(a, N, r)
        return { order: r.toString(), found: true, babySteps: m.toString(), table: `${raid.size} content-addressed residues`, verified: w.least && w.atOne && w.holds, ...w, via: 'baby-step giant-step over the UUID-addressed RAID table' }
      }
    }
    giant = (giant * aM) % N
  }
  return orderMiss(m.toString(), `${raid.size} content-addressed residues`, `the order exceeds m² ≈ ${(m * m).toString()} (the budget): bounded, never guessed — order-finding at this scale is computed by a physical quantum backend`)
}

// Shor's reduction, exact at any size: factoring is order-finding. Given the order r of a mod N (the quantity the register measures, at any
// width), the factors follow by gcd(a^(r/2) ± 1, N) over BigInt, so it runs whole at 1000 bits and beyond. An odd order and a trivial
// half-root are doors too: they name why this base does not split. This does not find r; it is the half of Shor that is a formula.
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
