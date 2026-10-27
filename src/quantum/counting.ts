// Resource counts of the circuits this repository builds, read from the circuits themselves: gates by name, two-qubit gates,
// depth in moments, and the T-count of the gates whose Clifford+T cost is a stated figure. Whether a gate is Clifford is
// computed from its unitary (it maps every Pauli string to a Pauli string, up to a phase), not read from its name. The costs
// counted: a Toffoli is 7 T gates (Nielsen & Chuang, Quantum Computation and Quantum Information, figure 4.9; Amy, Maslov,
// Mosca and Roetteler, IEEE TCAD 32, 818 (2013), the same 7 at T-depth 3); T itself (Z**0.25, and X**0.25 = H·Z**0.25·H) is 1;
// a controlled-S (CZ**0.5) is 3, by CS = (T⊗T)·CNOT·(I⊗T†)·CNOT, which the tests verify as a product of matrices. Any other
// non-Clifford gate, an arbitrary-angle rotation or a gate this repository has not decomposed, is listed and left uncounted,
// and the count says so: no synthesis cost is invented.

import { pauliProduct, type Circuit, type Gate } from './cirq.js'

type Complex = [number, number]
type Matrix = Complex[]

const mul = (a: Matrix, b: Matrix, dim: number): Matrix => {
  const out: Matrix = Array.from({ length: dim * dim }, () => [0, 0])
  for (let r = 0; r < dim; r++) for (let k = 0; k < dim; k++) {
    const [ar, ai] = a[r * dim + k]!
    if (ar === 0 && ai === 0) continue
    for (let s = 0; s < dim; s++) {
      const [br, bi] = b[k * dim + s]!
      const o = out[r * dim + s]!
      o[0] += ar * br - ai * bi
      o[1] += ar * bi + ai * br
    }
  }
  return out
}
const dagger = (a: Matrix, dim: number): Matrix => {
  const out: Matrix = []
  for (let r = 0; r < dim; r++) for (let s = 0; s < dim; s++) out.push([a[s * dim + r]![0], -a[s * dim + r]![1]])
  return out
}

/** Every Pauli string on n qubits except the identity, as gates. */
const pauliStrings = (n: number): Gate[] => {
  const letters = ['I', 'X', 'Y', 'Z'] as const
  const out: Gate[] = []
  for (let k = 1; k < 4 ** n; k++) {
    const word: ('I' | 'X' | 'Y' | 'Z')[] = []
    for (let i = 0, rest = k; i < n; i++, rest = Math.floor(rest / 4)) word.push(letters[rest % 4]!)
    out.push(pauliProduct(word))
  }
  return out
}

/** The arity up to which Cliffordness is computed; a wider gate is reported as not decomposed rather than guessed at. */
export const CLIFFORD_CHECK_ARITY = 3

/** Whether a gate is Clifford: U P U† is a Pauli string up to a phase for every Pauli string P. Each conjugate is expanded in
 *  the Pauli basis, Tr(Q·M)/dim, and must have exactly one coefficient of modulus 1. Computed from the unitary. */
export const isClifford = (gate: Gate): boolean => {
  if (gate.arity > CLIFFORD_CHECK_ARITY) throw new Error(`Cliffordness is computed up to ${CLIFFORD_CHECK_ARITY} qubits, not ${gate.arity}`)
  const dim = 1 << gate.arity
  const u = gate.matrix
  const ud = dagger(u, dim)
  const paulis = pauliStrings(gate.arity)
  for (const p of paulis) {
    const m = mul(mul(u, p.matrix, dim), ud, dim)
    let unit = 0
    for (const q of paulis) {
      let re = 0
      let im = 0
      for (let r = 0; r < dim; r++) for (let s = 0; s < dim; s++) {
        const [qr, qi] = q.matrix[r * dim + s]!
        const [mr, mi] = m[s * dim + r]!
        re += qr * mr - qi * mi
        im += qr * mi + qi * mr
      }
      const modulus = Math.hypot(re, im) / dim
      if (modulus > 1e-9 && Math.abs(modulus - 1) > 1e-9) return false
      if (Math.abs(modulus - 1) <= 1e-9) unit += 1
    }
    if (unit !== 1) return false
  }
  return true
}

/** How a gate is counted: Clifford (no T), a T gate (1), a controlled-S (3), a Toffoli (7), a rotation by an angle the Clifford+T
 *  table does not cover (listed, uncounted), or a gate this repository has not decomposed (listed, uncounted). */
type GateClass = { kind: 'clifford' } | { kind: 't'; tCount: 1 } | { kind: 'controlled_s'; tCount: 3 } | { kind: 'toffoli'; tCount: 7 } | { kind: 'rotation'; angle: number } | { kind: 'undecomposed' }

/** The base and exponent of a power gate from its name, G**t with an optional adjoint mark; null for any other name. */
const powerOfName = (name: string): { base: string; t: number } | null => {
  const adjoint = name.endsWith('†')
  const core = adjoint ? name.slice(0, -1) : name
  const at = core.indexOf('**')
  if (at < 0) return null
  const t = Number(core.slice(at + 2))
  return Number.isFinite(t) ? { base: core.slice(0, at), t: adjoint ? -t : t } : null
}

/** t reduced to [0, 2): the power of an involution repeats with period 2. */
const period = (t: number): number => ((t % 2) + 2) % 2
const near = (a: number, b: number): boolean => Math.abs(a - b) < 1e-9

export const classify = (gate: Gate): GateClass => {
  if (gate.arity > CLIFFORD_CHECK_ARITY) return { kind: 'undecomposed' }
  if (isClifford(gate)) return { kind: 'clifford' }
  if (gate.name === 'TOFFOLI') return { kind: 'toffoli', tCount: 7 }
  const power = powerOfName(gate.name)
  if (power) {
    const t = period(power.t)
    // a single-qubit Pauli power or ZZ**t (one Z rotation between two CNOTs) at an odd multiple of a quarter turn is one T gate
    if ((gate.arity === 1 || power.base === 'ZZ') && (near(t, 0.25) || near(t, 0.75) || near(t, 1.25) || near(t, 1.75))) return { kind: 't', tCount: 1 }
    if (power.base === 'CZ' && (near(t, 0.5) || near(t, 1.5))) return { kind: 'controlled_s', tCount: 3 }
    return { kind: 'rotation', angle: Math.PI * power.t }
  }
  const exponential = /^exp\(−i·(-?[0-9.e+-]+)·/.exec(gate.name)
  if (exponential) return { kind: 'rotation', angle: Number(exponential[1]) }
  return { kind: 'undecomposed' }
}

/** The resource count of a circuit. The T-count sums the counted classes; complete says whether every non-Clifford gate was
 *  counted, and the rotations and undecomposed gates list what was not. */
type ResourceCount = {
  qubits: number
  depth: number
  operations: number
  measurements: number
  channels: number
  gates: { name: string; arity: number; count: number; class: GateClass['kind'] }[]
  twoQubitGates: number
  threeOrMoreQubitGates: number
  clifford: number
  tCount: number
  tCountBy: { t: number; controlled_s: number; toffoli: number }
  rotations: { name: string; angle: number; count: number }[]
  undecomposed: { name: string; arity: number; count: number }[]
  complete: boolean
}

export const countResources = (circuit: Circuit): ResourceCount => {
  const byName = new Map<string, { name: string; arity: number; count: number; class: GateClass }>()
  let measurements = 0
  let channels = 0
  let twoQubitGates = 0
  let threeOrMoreQubitGates = 0
  let clifford = 0
  const tCountBy = { t: 0, controlled_s: 0, toffoli: 0 }
  for (const op of circuit.operations) {
    if (op.kind === 'measure') { measurements += 1; continue }
    if (op.kind === 'channel') { channels += 1; continue }
    const entry = byName.get(op.gate.name) ?? { name: op.gate.name, arity: op.gate.arity, count: 0, class: classify(op.gate) }
    entry.count += 1
    byName.set(op.gate.name, entry)
    if (op.gate.arity === 2) twoQubitGates += 1
    if (op.gate.arity >= 3) threeOrMoreQubitGates += 1
    const c = entry.class
    if (c.kind === 'clifford') clifford += 1
    else if (c.kind === 't') tCountBy.t += 1
    else if (c.kind === 'controlled_s') tCountBy.controlled_s += 3
    else if (c.kind === 'toffoli') tCountBy.toffoli += 7
  }
  const gates = [...byName.values()]
  const rotations = gates.filter((g) => g.class.kind === 'rotation').map((g) => ({ name: g.name, angle: (g.class as { angle: number }).angle, count: g.count }))
  const undecomposed = gates.filter((g) => g.class.kind === 'undecomposed').map((g) => ({ name: g.name, arity: g.arity, count: g.count }))
  return {
    qubits: circuit.qubits.length,
    depth: circuit.moments.length,
    operations: circuit.operations.length,
    measurements,
    channels,
    gates: gates.map((g) => ({ name: g.name, arity: g.arity, count: g.count, class: g.class.kind })),
    twoQubitGates,
    threeOrMoreQubitGates,
    clifford,
    tCount: tCountBy.t + tCountBy.controlled_s + tCountBy.toffoli,
    tCountBy,
    rotations,
    undecomposed,
    complete: rotations.length === 0 && undecomposed.length === 0,
  }
}
