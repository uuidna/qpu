// Cirq, the software layer Google Quantum AI publishes, as the core of its API: qubits, gates, operations, moments, circuits,
// measurement keys, and a simulator with simulate() (the wave function) and run() (sampled bitstrings). Names follow Cirq's
// documentation (quantumai.google/cirq). A state-vector simulator is exact for the sizes Cirq documents (about 20 qubits).

export type Qubit =
  | { kind: 'line'; x: number }
  | { kind: 'grid'; row: number; col: number }
  | { kind: 'named'; name: string }

/** The qubit's key: a stable text form, used for ordering and equality. */
export const keyOf = (q: Qubit): string => (q.kind === 'line' ? `line:${q.x}` : q.kind === 'grid' ? `grid:${q.row},${q.col}` : `named:${q.name}`)

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

export const X: Gate = { name: 'X', arity: 1, matrix: [c(0), c(1), c(1), c(0)] }
export const Y: Gate = { name: 'Y', arity: 1, matrix: [c(0), c(0, -1), c(0, 1), c(0)] }
export const Z: Gate = { name: 'Z', arity: 1, matrix: [c(1), c(0), c(0), c(-1)] }
export const H: Gate = { name: 'H', arity: 1, matrix: [c(s2), c(s2), c(s2), c(-s2)] }
// two-qubit gates act on (control, target) in that order, index bit 1 = first qubit
export const CZ: Gate = { name: 'CZ', arity: 2, matrix: [c(1), c(0), c(0), c(0), c(0), c(1), c(0), c(0), c(0), c(0), c(1), c(0), c(0), c(0), c(0), c(-1)] }
export const CNOT: Gate = { name: 'CNOT', arity: 2, matrix: [c(1), c(0), c(0), c(0), c(0), c(1), c(0), c(0), c(0), c(0), c(0), c(1), c(0), c(0), c(1), c(0)] }
export const SWAP: Gate = { name: 'SWAP', arity: 2, matrix: [c(1), c(0), c(0), c(0), c(0), c(0), c(1), c(0), c(0), c(1), c(0), c(0), c(0), c(0), c(0), c(1)] }

/** Cirq's gate power, G**t: the +1 eigenspace keeps its phase and the −1 eigenspace takes e^{iπt}, so X**0.5 is the square
 *  root of NOT, as Cirq documents. Exact for the involutions here (G·G = I); any other gate is refused, not approximated. */
export const powerOf = (gate: Gate, t: number): Gate => {
  const dim = 1 << gate.arity
  const at = (m: [number, number][], r: number, s: number) => m[r * dim + s]!
  for (let r = 0; r < dim; r++) for (let s = 0; s < dim; s++) {
    let sr = 0, si = 0
    for (let k = 0; k < dim; k++) {
      const [ar, ai] = at(gate.matrix, r, k), [br, bi] = at(gate.matrix, k, s)
      sr += ar * br - ai * bi
      si += ar * bi + ai * br
    }
    const id = r === s ? 1 : 0
    if (Math.abs(sr - id) > 1e-12 || Math.abs(si) > 1e-12) throw new Error(`${gate.name} is not an involution, so its power is not defined here`)
  }
  const [cr, ci] = [Math.cos(Math.PI * t), Math.sin(Math.PI * t)]
  const matrix: [number, number][] = []
  for (let r = 0; r < dim; r++) for (let s = 0; s < dim; s++) {
    const [gr, gi] = at(gate.matrix, r, s)
    const id = r === s ? 1 : 0
    // P+ = (I+G)/2 and P- = (I-G)/2 are the projectors; the result is P+ + e^{iπt}·P-
    const pr = (id + gr) / 2, pi = gi / 2
    const mr = (id - gr) / 2, mi = -gi / 2
    matrix.push([pr + cr * mr - ci * mi, pi + cr * mi + ci * mr])
  }
  return { name: `${gate.name}**${t}`, arity: gate.arity, matrix }
}

/** The adjoint of a gate, G†: the conjugate transpose of its unitary. It is the inverse of any gate, so an echo can run
 *  its backward half with the true inverse of each operation rather than the operation itself. */
export const adjointOf = (gate: Gate): Gate => {
  const dim = 1 << gate.arity
  const matrix: [number, number][] = []
  for (let r = 0; r < dim; r++) for (let s = 0; s < dim; s++) {
    const [re, im] = gate.matrix[s * dim + r]!
    matrix.push([re, -im])
  }
  return { name: `${gate.name}†`, arity: gate.arity, matrix }
}

export type Operation = { kind: 'gate'; gate: Gate; qubits: Qubit[] } | { kind: 'measure'; key: string; qubits: Qubit[] }

/** Cirq's operation form: a gate applied to qubits. gate(...qubits) returns the operation. */
export const applied = (gate: Gate, ...qubits: Qubit[]): Operation => {
  if (qubits.length !== gate.arity) throw new Error(`${gate.name} acts on ${gate.arity} qubit(s), not ${qubits.length}`)
  return { kind: 'gate', gate, qubits }
}

/** cirq.measure(*qubits, key=...): tags the measured qubits' results with the key. */
export const measure = (qubits: Qubit[], key: string): Operation => ({ kind: 'measure', key, qubits })

const touches = (op: Operation, qubits: Set<string>): boolean => op.qubits.some((q) => qubits.has(keyOf(q)))

/** Cirq's Moment: operations in the same time slice, on disjoint qubits. */
export class Moment {
  constructor(public readonly operations: Operation[] = []) {
    const seen = new Set<string>()
    for (const op of operations) for (const q of op.qubits) {
      if (seen.has(keyOf(q))) throw new Error(`a moment acts on one qubit twice: ${keyOf(q)}`)
      seen.add(keyOf(q))
    }
  }
}

/** Cirq's InsertStrategy: EARLIEST slides an operation to the earliest moment after its last conflict (the default); NEW
 *  gives it a moment of its own, at the end of the circuit. */
export type InsertStrategy = 'EARLIEST' | 'NEW'

/** Cirq's Circuit: a list of moments. Appended operations are placed by an InsertStrategy, EARLIEST by default. */
export class Circuit {
  readonly moments: Moment[] = []

  constructor(operations: Iterable<Operation | Moment> = []) {
    for (const item of operations) item instanceof Moment ? this.moments.push(item) : this.append(item)
  }

  append(op: Operation | Iterable<Operation>, strategy: InsertStrategy = 'EARLIEST'): this {
    if (Symbol.iterator in Object(op) && !('kind' in (op as object))) {
      for (const each of op as Iterable<Operation>) this.append(each, strategy)
      return this
    }
    const single = op as Operation
    if (strategy === 'NEW') {
      this.moments.push(new Moment([single]))
      return this
    }
    const mine = new Set(single.qubits.map(keyOf))
    let last = -1
    this.moments.forEach((m, i) => { if (m.operations.some((o) => touches(o, mine))) last = i })
    const at = last + 1
    if (at === this.moments.length) this.moments.push(new Moment([single]))
    else this.moments[at] = new Moment([...this.moments[at]!.operations, single])
    return this
  }

  /** The qubits the circuit acts on, in key order: the basis order of the simulator. */
  get qubits(): Qubit[] {
    const byKey = new Map<string, Qubit>()
    for (const m of this.moments) for (const op of m.operations) for (const q of op.qubits) byKey.set(keyOf(q), q)
    return [...byKey.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)).map(([, q]) => q)
  }

  get operations(): Operation[] {
    return this.moments.flatMap((m) => m.operations)
  }
}

/** Cirq's Device: the qubits a processor has and the two-qubit operations it accepts. An operation fits when its qubits are
 *  the device's, and a two-qubit gate acts on a coupler, a pair the hardware connects. */
export class Device {
  private readonly qubits: Set<string>
  private readonly couplers: Set<string>

  constructor(qubits: readonly Qubit[], couplers: readonly (readonly [Qubit, Qubit])[]) {
    this.qubits = new Set(qubits.map(keyOf))
    this.couplers = new Set(couplers.map(([a, b]) => pairKey(a, b)))
  }

  validateOperation(op: Operation): void {
    for (const q of op.qubits) if (!this.qubits.has(keyOf(q))) throw new Error(`${keyOf(q)} is not a qubit of this device`)
    if (op.kind === 'gate' && op.qubits.length === 2 && !this.couplers.has(pairKey(op.qubits[0]!, op.qubits[1]!))) {
      throw new Error(`${op.gate.name} acts on ${keyOf(op.qubits[0]!)} and ${keyOf(op.qubits[1]!)}, which the device does not couple`)
    }
  }

  validateCircuit(circuit: Circuit): void {
    for (const op of circuit.operations) this.validateOperation(op)
  }
}

const pairKey = (a: Qubit, b: Qubit): string => [keyOf(a), keyOf(b)].sort().join('|')

/** The result of run(): the sampled bitstrings per measurement key. */
export class Result {
  constructor(private readonly records: Map<string, string[]>) {}
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

const MAX_QUBITS = 20

/** Applies a gate to the qubits at the given indices of the state. Index bit k is the k-th qubit in the basis order. */
const applyGate = (state: State, gate: Gate, indices: number[]): void => {
  const n = Math.log2(state.re.length)
  const dim = 1 << gate.arity
  const mask = indices.reduce((m, i) => m | (1 << i), 0)
  for (let base = 0; base < state.re.length; base++) {
    if (base & mask) continue
    const idx = new Array<number>(dim)
    for (let s = 0; s < dim; s++) {
      let k = base
      for (let b = 0; b < gate.arity; b++) if (s & (1 << (gate.arity - 1 - b))) k |= 1 << indices[b]!
      idx[s] = k
    }
    const re = idx.map((k) => state.re[k]!)
    const im = idx.map((k) => state.im[k]!)
    for (let r = 0; r < dim; r++) {
      let nr = 0, ni = 0
      for (let s = 0; s < dim; s++) {
        const [mr, mi] = gate.matrix[r * dim + s]!
        nr += mr * re[s]! - mi * im[s]!
        ni += mr * im[s]! + mi * re[s]!
      }
      state.re[idx[r]!] = nr
      state.im[idx[r]!] = ni
    }
  }
  void n
}

/** The probability of each bit value of one qubit, and the collapse of the state to a measured value. */
const measureQubit = (state: State, index: number, random: () => number): number => {
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

/** Cirq's Simulator: simulate() returns the final state, run() samples measurement results. */
export class Simulator {
  constructor(private readonly random: () => number = Math.random) {}

  private initial(circuit: Circuit): { state: State; order: Qubit[]; indexOf: (q: Qubit) => number } {
    const order = circuit.qubits
    if (order.length > MAX_QUBITS) throw new Error(`the simulator handles up to ${MAX_QUBITS} qubits, the circuit has ${order.length}`)
    const dim = 1 << order.length
    const re = new Float64Array(dim)
    const im = new Float64Array(dim)
    re[0] = 1
    const pos = new Map(order.map((q, i) => [keyOf(q), i]))
    return { state: { re, im }, order, indexOf: (q) => pos.get(keyOf(q))! }
  }

  /** The final wave function: a list of amplitudes, one per basis state, with the qubit order of circuit.qubits. */
  simulate(circuit: Circuit): { amplitudes: [number, number][]; qubits: Qubit[] } {
    const { state, order, indexOf } = this.initial(circuit)
    for (const op of circuit.operations) if (op.kind === 'gate') applyGate(state, op.gate, op.qubits.map(indexOf))
    return { amplitudes: Array.from(state.re, (r, k) => [r, state.im[k]!] as [number, number]), qubits: order }
  }

  /** Sampled results: the circuit is run once per repetition, with each measurement collapsing the state. */
  run(circuit: Circuit, repetitions: number): Result {
    if (!circuit.operations.some((op) => op.kind === 'measure')) throw new Error('run needs at least one measurement')
    const records = new Map<string, string[]>()
    for (let rep = 0; rep < repetitions; rep++) {
      const { state, indexOf } = this.initial(circuit)
      const bits = new Map<string, number[]>()
      for (const op of circuit.operations) {
        if (op.kind === 'gate') applyGate(state, op.gate, op.qubits.map(indexOf))
        else bits.set(op.key, op.qubits.map((q) => measureQubit(state, indexOf(q), this.random)))
      }
      for (const [key, values] of bits) {
        const list = records.get(key) ?? []
        list.push(values.join(''))
        records.set(key, list)
      }
    }
    return new Result(records)
  }
}

/** A square complex matrix, row-major: entry (r, c) is re[r * dim + c] + i·im[r * dim + c]. */
type Matrix = { re: Float64Array; im: Float64Array }

const MAX_DENSITY_QUBITS = 8

/** The unitary a gate acts as on n qubits: column c is the state the gate makes of basis state |c>. */
const unitaryOf = (gate: Gate, indices: number[], n: number): Matrix => {
  const dim = 1 << n
  const u: Matrix = { re: new Float64Array(dim * dim), im: new Float64Array(dim * dim) }
  for (let c = 0; c < dim; c++) {
    const column: State = { re: new Float64Array(dim), im: new Float64Array(dim) }
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
  const out: Matrix = { re: new Float64Array(dim * dim), im: new Float64Array(dim * dim) }
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
  const out: Matrix = { re: new Float64Array(dim * dim), im: new Float64Array(dim * dim) }
  for (let r = 0; r < dim; r++) for (let c = 0; c < dim; c++) {
    out.re[r * dim + c] = m.re[c * dim + r]!
    out.im[r * dim + c] = -m.im[c * dim + r]!
  }
  return out
}

/** U ρ U†: a unitary acting on a density matrix. */
const conjugate = (u: Matrix, rho: Matrix, dim: number): Matrix => multiply(multiply(u, rho, dim), dagger(u, dim), dim)

/** Cirq's depolarizing channel on one qubit: E(ρ) = (1 − p)ρ + p/3 (XρX + YρY + ZρZ). */
const depolarizeOn = (rho: Matrix, index: number, p: number, n: number): Matrix => {
  const dim = 1 << n
  const out: Matrix = { re: new Float64Array(dim * dim), im: new Float64Array(dim * dim) }
  for (let k = 0; k < dim * dim; k++) {
    out.re[k] = (1 - p) * rho.re[k]!
    out.im[k] = (1 - p) * rho.im[k]!
  }
  for (const pauli of [X, Y, Z]) {
    const term = conjugate(unitaryOf(pauli, [index], n), rho, dim)
    for (let k = 0; k < dim * dim; k++) {
      out.re[k]! += (p / 3) * term.re[k]!
      out.im[k]! += (p / 3) * term.im[k]!
    }
  }
  return out
}

/** The result of a density-matrix run: the density matrix, its diagonal (the basis probabilities), its trace and purity. */
export type DensityResult = { qubits: Qubit[]; density: Matrix; probabilities: number[]; trace: number; purity: number }

/** Cirq's DensityMatrixSimulator: the state as a density matrix, so a noisy channel acts exactly rather than by sampling.
 *  A gate acts as U ρ U†; with a depolarizing probability p, each gate is followed by the depolarizing channel on each of
 *  its qubits. A pure state has purity 1; noise lowers it. Exact for up to 8 qubits. */
export class DensityMatrixSimulator {
  simulate(circuit: Circuit, depolarize = 0): DensityResult {
    if (depolarize < 0 || depolarize > 1) throw new Error('the depolarizing probability is between 0 and 1')
    const order = circuit.qubits
    if (order.length > MAX_DENSITY_QUBITS) throw new Error(`the density-matrix simulator handles up to ${MAX_DENSITY_QUBITS} qubits, the circuit has ${order.length}`)
    const n = order.length
    const dim = 1 << n
    const pos = new Map(order.map((q, i) => [keyOf(q), i]))
    let rho: Matrix = { re: new Float64Array(dim * dim), im: new Float64Array(dim * dim) }
    rho.re[0] = 1
    for (const op of circuit.operations) {
      if (op.kind !== 'gate') continue
      const indices = op.qubits.map((q) => pos.get(keyOf(q))!)
      rho = conjugate(unitaryOf(op.gate, indices, n), rho, dim)
      if (depolarize > 0) for (const i of indices) rho = depolarizeOn(rho, i, depolarize, n)
    }
    const probabilities = Array.from({ length: dim }, (_, k) => rho.re[k * dim + k]!)
    const trace = probabilities.reduce((sum, p) => sum + p, 0)
    let purity = 0
    for (let k = 0; k < dim * dim; k++) purity += rho.re[k]! ** 2 + rho.im[k]! ** 2
    return { qubits: order, density: rho, probabilities, trace, purity }
  }
}

/** The Quantum Virtual Machine, as the Cirq page describes it: simulated hardware that mimics a device's constraints and
 *  its noise. A circuit runs only if it fits the device, and it runs with the depolarizing noise the machine is given. */
export class QuantumVirtualMachine {
  private readonly simulator = new DensityMatrixSimulator()

  constructor(private readonly device: Device, private readonly depolarize: number) {}

  simulate(circuit: Circuit): DensityResult {
    this.device.validateCircuit(circuit)
    return this.simulator.simulate(circuit, this.depolarize)
  }
}
