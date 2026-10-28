// Cirq, the software layer Google Quantum AI publishes, as the core of its API: qubits, gates, operations, moments, circuits,
// measurement keys, and a simulator with simulate() (the wave function) and run() (sampled bitstrings). Names follow Cirq's
// documentation (quantumai.google/cirq). A state-vector simulator is exact for the sizes Cirq documents (about 20 qubits).

export type Qubit =
  | { kind: 'line'; x: number }
  | { kind: 'grid'; row: number; col: number }
  | { kind: 'named'; name: string }

/** The qubit's key: a stable text form, used for ordering and equality. */
export const qubitKey = (q: Qubit): string => (q.kind === 'line' ? `line:${q.x}` : q.kind === 'grid' ? `grid:${q.row},${q.col}` : `named:${q.name}`)

export const LineQubit = {
  of: (x: number): Qubit => ({ kind: 'line', x }),
  range: (n: number): Qubit[] => Array.from({ length: n }, (_, x) => ({ kind: 'line' as const, x })),
}

export const GridQubit = {
  of: (row: number, col: number): Qubit => ({ kind: 'grid', row, col }),
  square: (n: number): Qubit[] => Array.from({ length: n * n }, (_, i) => ({ kind: 'grid' as const, row: Math.floor(i / n), col: i % n })),
}

export const NamedQubit = { of: (name: string): Qubit => ({ kind: 'named', name }) }

/** A gate: its qubit count and its unitary as complex numbers, row-major, each entry [re, im]. */
export type Gate = { name: string; arity: number; matrix: [number, number][] }

const s2 = Math.SQRT1_2
const c = (re: number, im = 0): [number, number] => [re, im]
/** A matrix row-major, entry by entry. O(dim²). */
const createMatrix = (dim: number, entry: (r: number, s: number) => [number, number]): [number, number][] => Array.from({ length: dim * dim }, (_, k) => entry(Math.floor(k / dim), k % dim))

export const X: Gate = { name: 'X', arity: 1, matrix: [c(0), c(1), c(1), c(0)] }
export const Y: Gate = { name: 'Y', arity: 1, matrix: [c(0), c(0, -1), c(0, 1), c(0)] }
export const Z: Gate = { name: 'Z', arity: 1, matrix: [c(1), c(0), c(0), c(-1)] }
export const H: Gate = { name: 'H', arity: 1, matrix: [c(s2), c(s2), c(s2), c(-s2)] }
// two-qubit gates act on (control, target) in that order, index bit 1 = first qubit
export const CZ: Gate = { name: 'CZ', arity: 2, matrix: [c(1), c(0), c(0), c(0), c(0), c(1), c(0), c(0), c(0), c(0), c(1), c(0), c(0), c(0), c(0), c(-1)] }
export const CNOT: Gate = { name: 'CNOT', arity: 2, matrix: [c(1), c(0), c(0), c(0), c(0), c(1), c(0), c(0), c(0), c(0), c(0), c(1), c(0), c(0), c(1), c(0)] }
export const SWAP: Gate = { name: 'SWAP', arity: 2, matrix: [c(1), c(0), c(0), c(0), c(0), c(0), c(1), c(0), c(0), c(1), c(0), c(0), c(0), c(0), c(0), c(1)] }
/** Cirq's ZZ: Z on each of two qubits. Its eigenvalues are ±1, so ZZ**t is powerOf(ZZ, t), the gate QAOA's cost layer uses. */
export const ZZ: Gate = { name: 'ZZ', arity: 2, matrix: [c(1), c(0), c(0), c(0), c(0), c(-1), c(0), c(0), c(0), c(0), c(-1), c(0), c(0), c(0), c(0), c(1)] }

/** Cirq's TOFFOLI (CCX): flips the third qubit when the first two are both 1. Identity except rows 6 and 7 swapped. */
export const TOFFOLI: Gate = {
  name: 'TOFFOLI',
  arity: 3,
  matrix: createMatrix(8, (r, col) => c((r === col && r < 6) || (r === 6 && col === 7) || (r === 7 && col === 6) ? 1 : 0)),
}

/** Refuses a gate that is not an involution (G·G ≠ I): the powers and exponentials here are exact for involutions only. */
const assertInvolution = (gate: Gate, what: string): void => {
  const dim = 1 << gate.arity
  const at = (m: [number, number][], r: number, s: number) => m[r * dim + s]!
  const square = createMatrix(dim, (r, s) => {
    let sr = 0, si = 0
    for (let k = 0; k < dim; k++) {
      const [ar, ai] = at(gate.matrix, r, k), [br, bi] = at(gate.matrix, k, s)
      sr += ar * br - ai * bi
      si += ar * bi + ai * br
    }
    return [sr, si]
  })
  if (square.some(([sr, si], k) => Math.abs(sr - (k % (dim + 1) === 0 ? 1 : 0)) > 1e-12 || Math.abs(si) > 1e-12)) throw new Error(`${gate.name} is not an involution, so its ${what} is not defined here`)
}

/** Cirq's gate power, G**t: the +1 eigenspace keeps its phase and the −1 eigenspace takes e^{iπt}, so X**0.5 is the square
 *  root of NOT, as Cirq documents. Exact for the involutions here (G·G = I); any other gate is refused, not approximated. */
export const raiseGate = (gate: Gate, t: number): Gate => {
  assertInvolution(gate, 'power')
  const dim = 1 << gate.arity
  const at = (m: [number, number][], r: number, s: number) => m[r * dim + s]!
  const [cr, ci] = [Math.cos(Math.PI * t), Math.sin(Math.PI * t)]
  const matrix = createMatrix(dim, (r, s) => {
    const [gr, gi] = at(gate.matrix, r, s)
    const id = r === s ? 1 : 0
    // P+ = (I+G)/2 and P- = (I-G)/2 are the projectors; the result is P+ + e^{iπt}·P-
    const pr = (id + gr) / 2, pi = gi / 2
    const mr = (id - gr) / 2, mi = -gi / 2
    return [pr + cr * mr - ci * mi, pi + cr * mi + ci * mr]
  })
  return { name: `${gate.name}**${t}`, arity: gate.arity, matrix }
}

/** The exponential exp(−iθG) of an involution G, without a global phase: cos θ·I − i sin θ·G. This is the rotation a
 *  variational ansatz applies, exp(−iθ Y⊗X) for H₂; Cirq writes it as G**(2θ/π) up to the phase e^{iθ}, which an expectation
 *  value cannot see. Any gate that is not an involution is refused. */
export const exponentiateGate = (gate: Gate, theta: number): Gate => {
  assertInvolution(gate, 'exponential')
  const dim = 1 << gate.arity
  const [cs, sn] = [Math.cos(theta), Math.sin(theta)]
  const matrix = createMatrix(dim, (r, s) => {
    const [gr, gi] = gate.matrix[r * dim + s]!
    // −i·sinθ·(gr + i·gi) = sinθ·gi − i·sinθ·gr
    return [cs * (r === s ? 1 : 0) + sn * gi, -sn * gr]
  })
  return { name: `exp(−i·${theta}·${gate.name})`, arity: gate.arity, matrix }
}

/** The tensor product of single-qubit Paulis, P₁⊗P₂⊗…, as one gate on as many qubits: the first Pauli acts on the first qubit
 *  given. Every Pauli string squares to the identity, so it is an involution: powerOf and exponentialOf apply to it. */
export const pauliProduct = (paulis: readonly ('X' | 'Y' | 'Z' | 'I')[]): Gate => {
  const single: Record<'X' | 'Y' | 'Z' | 'I', Gate> = { X, Y, Z, I: { name: 'I', arity: 1, matrix: [c(1), c(0), c(0), c(1)] } }
  const factors = paulis.map((p) => single[p])
  let matrix: [number, number][] = [c(1)]
  let dim = 1
  for (const f of factors) {
    matrix = createMatrix(dim * 2, (r, s) => {
      const [ar, ai] = matrix[Math.floor(r / 2) * dim + Math.floor(s / 2)]!
      const [br, bi] = f.matrix[(r % 2) * 2 + (s % 2)]!
      return [ar * br - ai * bi, ar * bi + ai * br]
    })
    dim *= 2
  }
  return { name: paulis.join('⊗'), arity: paulis.length, matrix }
}

/** The adjoint of a gate, G†: the conjugate transpose of its unitary. It is the inverse of any gate, so an echo can run
 *  its backward half with the true inverse of each operation rather than the operation itself. */
export const adjointGate = (gate: Gate): Gate => {
  const dim = 1 << gate.arity
  return { name: `${gate.name}†`, arity: gate.arity, matrix: createMatrix(dim, (r, s) => { const [re, im] = gate.matrix[s * dim + r]!; return [re, -im] }) }
}

export type Operation =
  | { kind: 'gate'; gate: Gate; qubits: Qubit[] }
  | { kind: 'measure'; key: string; qubits: Qubit[] }
  | { kind: 'channel'; channel: Channel; qubits: Qubit[] }

/** Cirq's operation form: a gate applied to qubits. gate(...qubits) returns the operation. */
export const applied = (gate: Gate, ...qubits: Qubit[]): Operation => {
  if (qubits.length !== gate.arity) throw new Error(`${gate.name} acts on ${gate.arity} qubit(s), not ${qubits.length}`)
  return { kind: 'gate', gate, qubits }
}

/** cirq.measure(*qubits, key=...): tags the measured qubits' results with the key. */
export const measure = (qubits: Qubit[], key: string): Operation => ({ kind: 'measure', key, qubits })

/** A channel placed in the circuit, as Cirq's cirq.bit_flip(p).on(q) is: the noise acts on each qubit named, where the
 *  operation sits, and nowhere else. The density-matrix simulator applies it exactly; the state-vector simulator refuses it. */
export const noisy = (channel: Channel, ...qubits: Qubit[]): Operation => ({ kind: 'channel', channel, qubits })

const touches = (op: Operation, qubits: Set<string>): boolean => op.qubits.some((q) => qubits.has(qubitKey(q)))

/** Cirq's Moment: operations in the same time slice, on disjoint qubits. */
export class Moment {
  readonly operations: Operation[]
  constructor(operations: Operation[] = []) {
    this.operations = operations
    const seen = new Set<string>()
    for (const op of operations) for (const q of op.qubits) {
      if (seen.has(qubitKey(q))) throw new Error(`a moment acts on one qubit twice: ${qubitKey(q)}`)
      seen.add(qubitKey(q))
    }
  }
}

/** Cirq's InsertStrategy: EARLIEST slides an operation to the earliest moment after its last conflict (the default); NEW
 *  gives it a moment of its own; INLINE puts it in the moment just before the insert location when it does not conflict
 *  there, else in a new moment; NEW_THEN_INLINE gives the first operation a new moment and inserts the rest INLINE. */
export type InsertStrategy = 'EARLIEST' | 'NEW' | 'INLINE' | 'NEW_THEN_INLINE'

const flattenOps = (op: Operation | Iterable<Operation>): Operation[] =>
  Symbol.iterator in Object(op) && !('kind' in (op as object)) ? [...(op as Iterable<Operation>)].flatMap(flattenOps) : [op as Operation]

/** Cirq's Circuit: a list of moments. Appended operations are placed by an InsertStrategy, EARLIEST by default. */
export class Circuit {
  readonly moments: Moment[] = []

  constructor(operations: Iterable<Operation | Moment> = []) {
    for (const item of operations) item instanceof Moment ? this.moments.push(item) : this.append(item)
  }

  append(op: Operation | Iterable<Operation>, strategy: InsertStrategy = 'EARLIEST'): this {
    flattenOps(op).forEach((single, i) => {
      const placed: Exclude<InsertStrategy, 'NEW_THEN_INLINE'> = strategy === 'NEW_THEN_INLINE' ? (i === 0 ? 'NEW' : 'INLINE') : strategy
      this.place(single, placed)
    })
    return this
  }

  /** Places one operation: NEW at the end, INLINE in the last moment when it does not clash there, EARLIEST after the last moment
   *  it clashes with, found walking back from the end. O(moments · ops a moment). */
  private place(single: Operation, strategy: Exclude<InsertStrategy, 'NEW_THEN_INLINE'>): void {
    const mine = new Set(single.qubits.map(qubitKey))
    const free = (i: number) => !this.moments[i]!.operations.some((o) => touches(o, mine))
    let at = this.moments.length
    if (strategy === 'EARLIEST') while (at > 0 && free(at - 1)) at -= 1
    else if (strategy === 'INLINE' && at > 0 && free(at - 1)) at -= 1
    this.moments[at] = new Moment([...(this.moments[at]?.operations ?? []), single])
  }

  /** The qubits the circuit acts on, in key order: the basis order of the simulator. */
  get qubits(): Qubit[] {
    const byKey = new Map<string, Qubit>()
    for (const m of this.moments) for (const op of m.operations) for (const q of op.qubits) byKey.set(qubitKey(q), q)
    return [...byKey.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)).map(([, q]) => q)
  }

  get operations(): Operation[] {
    return this.moments.flatMap((m) => m.operations)
  }
}

/** Cirq's Device: the qubits a processor has and the two-qubit operations it accepts. An operation fits when its qubits are
 *  the device's, and a two-qubit gate acts on a coupler, a pair the hardware connects. */
export class Device {
  private readonly keys: Set<string>
  private readonly couplerKeys: Set<string>
  private readonly qubitList: Qubit[]
  private readonly edgeList: [Qubit, Qubit][]

  constructor(qubits: readonly Qubit[], couplers: readonly (readonly [Qubit, Qubit])[]) {
    this.qubitList = [...qubits]
    this.edgeList = couplers.map(([a, b]): [Qubit, Qubit] => [a, b])
    this.keys = new Set(qubits.map(qubitKey))
    this.couplerKeys = new Set(couplers.map(([a, b]) => pairKey(a, b)))
  }

  /** Cirq's qubit_set: the qubits the device has. */
  get qubitSet(): Qubit[] {
    return [...this.qubitList]
  }

  /** Cirq's nx_graph edges: the couplers, each a pair of qubits the hardware connects. */
  get edges(): [Qubit, Qubit][] {
    return this.edgeList.map(([a, b]): [Qubit, Qubit] => [a, b])
  }

  validateOperation(op: Operation): void {
    for (const q of op.qubits) if (!this.keys.has(qubitKey(q))) throw new Error(`${qubitKey(q)} is not a qubit of this device`)
    if (op.kind === 'gate' && op.qubits.length === 2 && !this.couplerKeys.has(pairKey(op.qubits[0]!, op.qubits[1]!))) {
      throw new Error(`${op.gate.name} acts on ${qubitKey(op.qubits[0]!)} and ${qubitKey(op.qubits[1]!)}, which the device does not couple`)
    }
  }

  /** Cirq's validate_moment: every operation of the moment fits the device. */
  validateMoment(moment: Moment): void {
    for (const op of moment.operations) this.validateOperation(op)
  }

  /** Cirq's validate_circuit, by default: every moment is validated. */
  validateCircuit(circuit: Circuit): void {
    for (const moment of circuit.moments) this.validateMoment(moment)
  }
}

const pairKey = (a: Qubit, b: Qubit): string => [qubitKey(a), qubitKey(b)].sort().join('|')

/** The result of run(): the sampled bitstrings per measurement key. */
class Result {
  private readonly records: Map<string, string[]>
  constructor(records: Map<string, string[]>) { this.records = records }
  /** The bitstrings of one key, one per repetition. */
  measurements(key: string): string[] {
    return this.records.get(key) ?? []
  }
  /** Cirq's histogram(key): how many repetitions gave each bitstring. */
  histogram(key: string): Map<number, number> {
    const counts = new Map<number, number>()
    for (const bits of this.measurements(key)) {
      const value = parseInt(bits || '0', 2)
      counts.set(value, (counts.get(value) ?? 0) + 1)
    }
    return counts
  }
}

type State = { re: Float64Array; im: Float64Array }
/** Zeros of a size, or a copy. O(size). */
const toComplexState = (from: number | State): State => (typeof from === 'number' ? { re: new Float64Array(from), im: new Float64Array(from) } : { re: new Float64Array(from.re), im: new Float64Array(from.im) })

const MAX_QUBITS = 20
const createIndexer = (order: Qubit[]) => { const pos = new Map(order.map((q, i) => [qubitKey(q), i])); return (q: Qubit) => pos.get(qubitKey(q))! }

/** Applies a gate in place (index bit k is the k-th qubit). O(2^n · nonzero entries): a permutation gate costs one term a row. */
const applyGate = (state: State, gate: Gate, indices: number[]): void => {
  const dim = 1 << gate.arity
  const offsets = Array.from({ length: dim }, (_, s) => indices.reduce((k, q, b) => (s & (1 << (gate.arity - 1 - b)) ? k | (1 << q) : k), 0))
  const mask = offsets[dim - 1]!, re = new Float64Array(dim), im = new Float64Array(dim)
  const rows = Array.from({ length: dim }, (_, r) => gate.matrix.slice(r * dim, r * dim + dim).flatMap(([mr, mi], s) => (mr || mi ? [[s, mr, mi] as const] : [])))
  for (let base = 0; base < state.re.length; base++) {
    if (base & mask) continue
    for (let s = 0; s < dim; s++) { re[s] = state.re[base | offsets[s]!]!; im[s] = state.im[base | offsets[s]!]! }
    for (let r = 0; r < dim; r++) {
      let nr = 0, ni = 0
      for (const [s, mr, mi] of rows[r]!) {
        nr += mr * re[s]! - mi * im[s]!
        ni += mr * im[s]! + mi * re[s]!
      }
      state.re[base | offsets[r]!] = nr
      state.im[base | offsets[r]!] = ni
    }
  }
}

/** The probability of each bit value of one qubit, and the collapse of the state to a measured value. */
const getQubit = (state: State, index: number, random: () => number): number => {
  let p1 = 0
  for (let k = 0; k < state.re.length; k++) if (k & (1 << index)) p1 += state.re[k]! ** 2 + state.im[k]! ** 2
  const bit = random() < p1 ? 1 : 0
  const norm = Math.sqrt(bit ? p1 : 1 - p1) || 1
  for (let k = 0; k < state.re.length; k++) {
    const kept = (k & (1 << index) ? 1 : 0) === bit
    state.re[k] = kept ? state.re[k]! / norm : 0
    state.im[k] = kept ? state.im[k]! / norm : 0
  }
  return bit
}

/** A random source seeded by text (mulberry32 over a 32-bit fold of the text): the same seed draws the same samples on
 *  every host, so a sampled result is a function of its arguments and the gate's copies agree. */
export const seededRandom = (seed: string): (() => number) => {
  let a = 0x9e3779b9
  for (let i = 0; i < seed.length; i += 1) a = Math.imul(a ^ seed.charCodeAt(i), 0x85ebca6b) >>> 0
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
}
/** Cirq's Simulator: simulate() returns the final state, run() samples measurement results. */
export class Simulator {
  private readonly random: () => number
  constructor(random: () => number = Math.random) { this.random = random }

  private initial(circuit: Circuit): { state: State; order: Qubit[]; indexOf: (q: Qubit) => number } {
    const order = circuit.qubits
    if (order.length > MAX_QUBITS) throw new Error(`the simulator handles up to ${MAX_QUBITS} qubits, the circuit has ${order.length}`)
    const state = toComplexState(1 << order.length)
    state.re[0] = 1
    return { state, order, indexOf: createIndexer(order) }
  }

  /** Gates in place, measurements into bits. O(ops · 2^n). */
  private apply(state: State, ops: readonly Operation[], indexOf: (q: Qubit) => number, bits = new Map<string, number[]>()): Map<string, number[]> {
    for (const op of ops) {
      if (op.kind === 'channel') throw new Error(`a ${op.channel.name} channel runs on the density matrix, not on a state vector`)
      if (op.kind === 'gate') applyGate(state, op.gate, op.qubits.map(indexOf))
      else bits.set(op.key, op.qubits.map((q) => getQubit(state, indexOf(q), this.random)))
    }
    return bits
  }

  /** The final wave function: a list of amplitudes, one per basis state, with the qubit order of circuit.qubits. */
  simulate(circuit: Circuit): { amplitudes: [number, number][]; qubits: Qubit[] } {
    const { state, order, indexOf } = this.initial(circuit)
    this.apply(state, circuit.operations.filter((op) => op.kind !== 'measure'), indexOf)
    return { amplitudes: Array.from(state.re, (r, k) => [r, state.im[k]!] as [number, number]), qubits: order }
  }

  /** Sampled results: the gates before the first measurement draw nothing at random, so they run once and each repetition copies that state. */
  run(circuit: Circuit, repetitions: number): Result {
    if (!circuit.operations.some((op) => op.kind === 'measure')) throw new Error('run needs at least one measurement')
    const { state: prefix, indexOf } = this.initial(circuit)
    const first = circuit.operations.findIndex((op) => op.kind !== 'gate')
    this.apply(prefix, circuit.operations.slice(0, first), indexOf)
    const rest = circuit.operations.slice(first)
    const records = new Map<string, string[]>()
    for (let rep = 0; rep < repetitions; rep++) {
      for (const [key, values] of this.apply(toComplexState(prefix), rest, indexOf)) { const list = records.get(key) ?? []; list.push(values.join('')); records.set(key, list) }
    }
    return new Result(records)
  }
}

/** A square complex matrix, row-major: entry (r, c) is re[r * dim + c] + i·im[r * dim + c]. */
type Matrix = State

const MAX_DENSITY_QUBITS = 8

/** The unitary a gate acts as on n qubits: column c is the state the gate makes of basis state |c>. */
const expandUnitary = (gate: Gate, indices: number[], n: number): Matrix => {
  const dim = 1 << n
  const u = toComplexState(dim * dim)
  for (let c = 0; c < dim; c++) {
    const column = toComplexState(dim)
    column.re[c] = 1
    applyGate(column, gate, indices)
    for (let r = 0; r < dim; r++) {
      u.re[r * dim + c] = column.re[r]!
      u.im[r * dim + c] = column.im[r]!
    }
  }
  return u
}

const multiply = (a: Matrix, b: Matrix, dim: number): Matrix => {
  const out = toComplexState(dim * dim)
  for (let r = 0; r < dim; r++)
    for (let k = 0; k < dim; k++) {
      const ar = a.re[r * dim + k]!, ai = a.im[r * dim + k]!
      if (ar === 0 && ai === 0) continue
      for (let c = 0; c < dim; c++) {
        out.re[r * dim + c]! += ar * b.re[k * dim + c]! - ai * b.im[k * dim + c]!
        out.im[r * dim + c]! += ar * b.im[k * dim + c]! + ai * b.re[k * dim + c]!
      }
    }
  return out
}

/** The adjoint of a matrix: the conjugate transpose. */
const dagger = (m: Matrix, dim: number): Matrix => {
  const out = toComplexState(dim * dim)
  for (let r = 0; r < dim; r++) for (let c = 0; c < dim; c++) {
    out.re[r * dim + c] = m.re[c * dim + r]!
    out.im[r * dim + c] = -m.im[c * dim + r]!
  }
  return out
}

/** U ρ U†: a unitary acting on a density matrix. */
const conjugate = (u: Matrix, rho: Matrix, dim: number): Matrix => multiply(multiply(u, rho, dim), dagger(u, dim), dim)

/** A noise channel, named as Cirq names it, with the parameters Cirq takes. */
export type Channel =
  | { name: 'bit_flip' | 'phase_flip' | 'depolarize'; p: number }
  | { name: 'asymmetric_depolarize'; p_x: number; p_y: number; p_z: number }
  | { name: 'amplitude_damp' | 'phase_damp'; gamma: number }
  | { name: 'generalized_amplitude_damp'; p: number; gamma: number }
  | { name: 'reset' }

const ONE: Gate = { name: 'I', arity: 1, matrix: [c(1), c(0), c(0), c(1)] }
const operator = (matrix: [number, number][]): Gate => ({ name: 'K', arity: 1, matrix })
/** A Pauli (or identity) scaled by the square root of a weight, so that its square carries the weight. */
const weighted = (gate: Gate, weight: number): Gate => ({
  name: gate.name,
  arity: 1,
  matrix: gate.matrix.map(([r, i]): [number, number] => [r * Math.sqrt(weight), i * Math.sqrt(weight)]),
})

const probability = (p: number, name: string): void => {
  if (p < 0 || p > 1) throw new Error(`the ${name} probability ${p} is between 0 and 1`)
}

/** Cirq's channels as Kraus operators: E(ρ) = Σ K ρ K†. The definitions are Cirq's own. */
const krausOperators = (channel: Channel): Gate[] => {
  switch (channel.name) {
    case 'bit_flip':
      probability(channel.p, 'bit-flip')
      return [weighted(ONE, 1 - channel.p), weighted(X, channel.p)]
    case 'phase_flip':
      probability(channel.p, 'phase-flip')
      return [weighted(ONE, 1 - channel.p), weighted(Z, channel.p)]
    case 'depolarize':
      probability(channel.p, 'depolarizing')
      return [weighted(ONE, 1 - channel.p), weighted(X, channel.p / 3), weighted(Y, channel.p / 3), weighted(Z, channel.p / 3)]
    case 'asymmetric_depolarize': {
      const { p_x: px, p_y: py, p_z: pz } = channel
      probability(px, 'x'), probability(py, 'y'), probability(pz, 'z')
      if (px + py + pz > 1) throw new Error('the asymmetric depolarizing probabilities sum to more than 1')
      return [weighted(ONE, 1 - px - py - pz), weighted(X, px), weighted(Y, py), weighted(Z, pz)]
    }
    case 'amplitude_damp':
      probability(channel.gamma, 'damping')
      return [operator([c(1), c(0), c(0), c(Math.sqrt(1 - channel.gamma))]), operator([c(0), c(Math.sqrt(channel.gamma)), c(0), c(0)])]
    case 'phase_damp':
      probability(channel.gamma, 'damping')
      return [operator([c(1), c(0), c(0), c(Math.sqrt(1 - channel.gamma))]), operator([c(0), c(0), c(0), c(Math.sqrt(channel.gamma))])]
    case 'generalized_amplitude_damp': {
      const { p, gamma } = channel
      probability(p, 'generalized amplitude'), probability(gamma, 'damping')
      return [
        operator([c(Math.sqrt(p)), c(0), c(0), c(Math.sqrt(p * (1 - gamma)))]),
        operator([c(0), c(Math.sqrt(p * gamma)), c(0), c(0)]),
        operator([c(Math.sqrt((1 - p) * (1 - gamma))), c(0), c(0), c(Math.sqrt(1 - p))]),
        operator([c(0), c(0), c(Math.sqrt((1 - p) * gamma)), c(0)]),
      ]
    }
    case 'reset':
      return [operator([c(1), c(0), c(0), c(0)]), operator([c(0), c(1), c(0), c(0)])]
  }
}

/** A channel acting on one qubit of the density matrix: the sum of its Kraus operators conjugating ρ. */
const channelOn = (rho: Matrix, index: number, channel: Channel, n: number): Matrix => {
  const dim = 1 << n
  const out = toComplexState(dim * dim)
  for (const kraus of krausOperators(channel)) {
    const term = conjugate(expandUnitary(kraus, [index], n), rho, dim)
    for (let k = 0; k < dim * dim; k++) {
      out.re[k]! += term.re[k]!
      out.im[k]! += term.im[k]!
    }
  }
  return out
}

/** The result of a density-matrix run: the density matrix, its diagonal (the basis probabilities), its trace and purity. */
type DensityResult = { qubits: Qubit[]; density: Matrix; probabilities: number[]; trace: number; purity: number }

/** Cirq's DensityMatrixSimulator: the state as a density matrix, so a noisy channel acts exactly rather than by sampling.
 *  A gate acts as U ρ U†; with a depolarizing probability p, each gate is followed by the depolarizing channel on each of
 *  its qubits. A channel placed in the circuit (noisy) acts where it sits, on its qubits only, and draws no gate noise.
 *  A pure state has purity 1; noise lowers it. Exact for up to 8 qubits. */
export class DensityMatrixSimulator {
  simulate(circuit: Circuit, channels: readonly Channel[] | ((arity: number) => readonly Channel[]) = []): DensityResult {
    if (typeof channels === 'function') [1, 2].forEach((arity) => channels(arity).forEach(krausOperators))
    else channels.forEach(krausOperators)
    const order = circuit.qubits
    if (order.length > MAX_DENSITY_QUBITS) throw new Error(`the density-matrix simulator handles up to ${MAX_DENSITY_QUBITS} qubits, the circuit has ${order.length}`)
    const n = order.length
    const dim = 1 << n
    const indexOf = createIndexer(order)
    let rho = toComplexState(dim * dim)
    rho.re[0] = 1
    for (const op of circuit.operations) {
      if (op.kind === 'channel') {
        krausOperators(op.channel)
        for (const q of op.qubits) rho = channelOn(rho, indexOf(q), op.channel, n)
        continue
      }
      if (op.kind !== 'gate') continue
      const indices = op.qubits.map(indexOf)
      rho = conjugate(expandUnitary(op.gate, indices, n), rho, dim)
      const noise = typeof channels === 'function' ? channels(op.gate.arity) : channels
      for (const i of indices) for (const channel of noise) rho = channelOn(rho, i, channel, n)
    }
    const probabilities = Array.from({ length: dim }, (_, k) => rho.re[k * dim + k]!)
    const trace = probabilities.reduce((sum, p) => sum + p, 0)
    let purity = 0
    for (let k = 0; k < dim * dim; k++) purity += rho.re[k]! ** 2 + rho.im[k]! ** 2
    return { qubits: order, density: rho, probabilities, trace, purity }
  }
}

/** Cirq's simulate_expectation_values for a Pauli string: Tr(ρ O), where O is the tensor product of the Paulis named by
 *  qubit, and the identity on every other qubit. For a Hermitian observable the trace is real. */
export const getExpectation = (result: DensityResult, observable: Record<string, 'X' | 'Y' | 'Z'>): number => {
  const n = result.qubits.length
  const dim = 1 << n
  const index = new Map(result.qubits.map((q, i) => [qubitKey(q), i]))
  const paulis: Record<'X' | 'Y' | 'Z', Gate> = { X, Y, Z }
  let op: Matrix = toComplexState(dim * dim)
  for (let k = 0; k < dim; k++) op.re[k * dim + k] = 1
  for (const [key, pauli] of Object.entries(observable)) {
    const i = index.get(key)
    if (i === undefined) throw new Error(`${key} is not a qubit of this result`)
    op = multiply(op, expandUnitary(paulis[pauli], [i], n), dim)
  }
  let trace = 0
  for (let r = 0; r < dim; r++) for (let k = 0; k < dim; k++) {
    trace += result.density.re[r * dim + k]! * op.re[k * dim + r]! - result.density.im[r * dim + k]! * op.im[k * dim + r]!
  }
  return trace
}

/** The Quantum Virtual Machine, as the Cirq page describes it: simulated hardware that mimics a device's constraints and
 *  its noise. A circuit runs only if it fits the device, and it runs with the depolarizing noise the machine is given. */
export class QuantumVirtualMachine {
  private readonly simulator = new DensityMatrixSimulator()

  private readonly device: Device
  private readonly channels: readonly Channel[] | ((arity: number) => readonly Channel[])
  constructor(device: Device, channels: readonly Channel[] | ((arity: number) => readonly Channel[])) { this.device = device; this.channels = channels }

  simulate(circuit: Circuit): DensityResult {
    this.device.validateCircuit(circuit)
    return this.simulator.simulate(circuit, this.channels)
  }
}
