// Cirq, the software layer Google Quantum AI publishes, as the core of its API: qubits, gates, operations, moments, circuits,
// measurement keys, and a simulator with simulate() (the wave function) and run() (sampled bitstrings). Names follow Cirq's
// documentation (quantumai.google/cirq). The register has no width ceiling: a narrow one is a dense array, a wide one is the amplitudes that are occupied.
// Every gate is a sealed UUID of its name, arity and matrix. A gate runs only when that address still matches the matrix and the seal holds.

import { canonicalText, seal, uuid } from '../uuid/index.ts'

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

/** A gate: its qubit count and its unitary as complex numbers, row-major, each entry [re, im]. The address is the sealed UUID of that unitary. */
type GateBody = { name: string; arity: number; matrix: [number, number][] }
export type Gate = GateBody & { address: string }

/** The UUID of a gate: the name, the arity and the matrix. The same unitary is the same address. */
export const gateAddress = (gate: GateBody): string => uuid(canonicalText({ name: gate.name, arity: gate.arity, matrix: gate.matrix }))

/** A gate whose address is the sealed UUID of its unitary. A matrix that does not seal is refused. */
export const defineGate = (gate: GateBody): Gate => {
  const address = gateAddress(gate)
  if (!seal(address).valid) throw new Error(`${gate.name} is not a sealed UUID`)
  return { name: gate.name, arity: gate.arity, matrix: gate.matrix, address }
}

/** A gate operation runs only when its unitary's UUID still matches the matrix and the qubits' UUID seals. */
const requireUuidGate = (op: Operation): void => {
  if (op.kind !== 'gate') return
  if (op.gate.address !== gateAddress(op.gate) || !seal(op.gate.address).valid) throw new Error(`${op.gate.name} runs only as a sealed UUID`)
  const on = uuid(canonicalText({ gate: op.gate.address, qubits: op.qubits.map(qubitKey) }))
  if (op.address !== on || !seal(op.address).valid) throw new Error(`${op.gate.name} runs only on a sealed UUID`)
}

const s2 = Math.SQRT1_2
const c = (re: number, im = 0): [number, number] => [re, im]
/** A matrix row-major, entry by entry. O(dim²). */
const createMatrix = (dim: number, entry: (r: number, s: number) => [number, number]): [number, number][] => Array.from({ length: dim * dim }, (_, k) => entry(Math.floor(k / dim), k % dim))

export const X: Gate = defineGate({ name: 'X', arity: 1, matrix: [c(0), c(1), c(1), c(0)] })
export const Y: Gate = defineGate({ name: 'Y', arity: 1, matrix: [c(0), c(0, -1), c(0, 1), c(0)] })
export const Z: Gate = defineGate({ name: 'Z', arity: 1, matrix: [c(1), c(0), c(0), c(-1)] })
export const H: Gate = defineGate({ name: 'H', arity: 1, matrix: [c(s2), c(s2), c(s2), c(-s2)] })
/** S = Z**(1/2) = diag(1, i). Clifford. S·S = Z, so S**t = diag(1, e^{iπt/2}) and S**0.5 is T. */
export const S: Gate = defineGate({ name: 'S', arity: 1, matrix: [c(1), c(0), c(0), c(0, 1)] })
/** T = Z**(1/4) = diag(1, e^{iπ/4}). One T in the Clifford+T count. T·T = S. */
export const T: Gate = defineGate({ name: 'T', arity: 1, matrix: [c(1), c(0), c(0), c(s2, s2)] })
// two-qubit gates act on (control, target) in that order, index bit 1 = first qubit
export const CZ: Gate = defineGate({ name: 'CZ', arity: 2, matrix: [c(1), c(0), c(0), c(0), c(0), c(1), c(0), c(0), c(0), c(0), c(1), c(0), c(0), c(0), c(0), c(-1)] })
export const CNOT: Gate = defineGate({ name: 'CNOT', arity: 2, matrix: [c(1), c(0), c(0), c(0), c(0), c(1), c(0), c(0), c(0), c(0), c(0), c(1), c(0), c(0), c(1), c(0)] })
export const SWAP: Gate = defineGate({ name: 'SWAP', arity: 2, matrix: [c(1), c(0), c(0), c(0), c(0), c(0), c(1), c(0), c(0), c(1), c(0), c(0), c(0), c(0), c(0), c(1)] })
/** Cirq's ZZ: Z on each of two qubits. Its eigenvalues are ±1, so ZZ**t is power(ZZ, t), the gate QAOA's cost layer uses. */
export const ZZ: Gate = defineGate({ name: 'ZZ', arity: 2, matrix: [c(1), c(0), c(0), c(0), c(0), c(-1), c(0), c(0), c(0), c(0), c(-1), c(0), c(0), c(0), c(0), c(1)] })

/** Cirq's TOFFOLI (CCX): flips the third qubit when the first two are both 1. Identity except rows 6 and 7 swapped. */
export const TOFFOLI: Gate = defineGate({
  name: 'TOFFOLI',
  arity: 3,
  matrix: createMatrix(8, (r, col) => c((r === col && r < 6) || (r === 6 && col === 7) || (r === 7 && col === 6) ? 1 : 0)),
})

type C = [number, number]
const zAdd = (a: C, b: C): C => [a[0] + b[0], a[1] + b[1]]
const zSub = (a: C, b: C): C => [a[0] - b[0], a[1] - b[1]]
const zMul = (a: C, b: C): C => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]]
const zScale = (a: C, s: number): C => [a[0] * s, a[1] * s]
const zAbs = (a: C): number => Math.hypot(a[0], a[1])
const zConj = (a: C): C => [a[0], -a[1]]
const zDiv = (a: C, b: C): C => {
  const d = b[0] * b[0] + b[1] * b[1]
  return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]
}
/** Principal logarithm, argument in (−π, π]. A negative real is π, the branch the ±1 formula uses for eigenvalue −1. */
const zLog = (a: C): C => {
  const r = zAbs(a)
  let arg = Math.atan2(a[1], a[0])
  if (a[0] < 0 && Math.abs(a[1]) <= 1e-10 * r) arg = Math.PI
  return [Math.log(r), arg]
}
const zExp = (a: C): C => {
  const m = Math.exp(a[0])
  return [m * Math.cos(a[1]), m * Math.sin(a[1])]
}
/** Principal power a**t. 0**t is 0 for t > 0 and 1 for t = 0. */
const zPow = (a: C, t: number): C => {
  if (a[0] === 0 && a[1] === 0) return t > 0 ? [0, 0] : t === 0 ? [1, 0] : [Number.POSITIVE_INFINITY, Number.NaN]
  return zExp(zScale(zLog(a), t))
}
const zSqrt = (a: C): C => {
  const r = zAbs(a)
  if (r === 0) return [0, 0]
  const re = Math.sqrt((r + a[0]) / 2)
  const im = Math.sqrt(Math.max(0, (r - a[0]) / 2))
  return [re, a[1] < 0 ? -im : im]
}

const entry = (m: readonly C[], n: number, r: number, s: number): C => m[r * n + s]!
const put = (m: C[], n: number, r: number, s: number, v: C): void => {
  m[r * n + s] = v
}
const copyMatrix = (m: readonly C[]): C[] => m.map((z) => [z[0], z[1]])
const eye = (n: number): C[] => Array.from({ length: n * n }, (_, k) => [k % (n + 1) === 0 ? 1 : 0, 0])
const times = (a: readonly C[], b: readonly C[], n: number): C[] => createMatrix(n, (r, s) => {
  let sr = 0, si = 0
  for (let k = 0; k < n; k++) {
    const [ar, ai] = entry(a, n, r, k), [br, bi] = entry(b, n, k, s)
    sr += ar * br - ai * bi
    si += ar * bi + ai * br
  }
  return [sr, si]
})
const conjTranspose = (m: readonly C[], n: number): C[] => createMatrix(n, (r, s) => zConj(entry(m, n, s, r)))

const squaresToIdentity = (matrix: readonly C[], dim: number): boolean => times(matrix, matrix, dim).every(([sr, si], k) => Math.abs(sr - (k % (dim + 1) === 0 ? 1 : 0)) <= 1e-12 && Math.abs(si) <= 1e-12)

const diagonalMatrix = (matrix: readonly C[], dim: number): boolean => {
  for (let r = 0; r < dim; r++) for (let s = 0; s < dim; s++) if (r !== s && zAbs(entry(matrix, dim, r, s)) > 1e-12) return false
  return true
}

/** G**t for G·G = I: the +1 eigenspace keeps its phase and the −1 eigenspace takes e^{iπt}. X**0.5 is the square root of NOT. */
const involutionPower = (matrix: readonly C[], dim: number, t: number): C[] => {
  const [cr, ci] = [Math.cos(Math.PI * t), Math.sin(Math.PI * t)]
  return createMatrix(dim, (r, s) => {
    const [gr, gi] = entry(matrix, dim, r, s)
    const id = r === s ? 1 : 0
    // P+ = (I+G)/2 and P- = (I-G)/2 are the projectors; the result is P+ + e^{iπt}·P-
    const pr = (id + gr) / 2, pi = gi / 2
    const mr = (id - gr) / 2, mi = -gi / 2
    return [pr + cr * mr - ci * mi, pi + cr * mi + ci * mr]
  })
}

/** exp(−iθG) for G·G = I, without a global phase: cos θ·I − i sin θ·G. */
const involutionExponential = (matrix: readonly C[], dim: number, theta: number): C[] => {
  const [cs, sn] = [Math.cos(theta), Math.sin(theta)]
  return createMatrix(dim, (r, s) => {
    const [gr, gi] = entry(matrix, dim, r, s)
    // −i·sinθ·(gr + i·gi) = sinθ·gi − i·sinθ·gr
    return [cs * (r === s ? 1 : 0) + sn * gi, -sn * gr]
  })
}

/** A complex Givens rotation with a real cosine: G [a, b]ᵀ = [r, 0] and cos² + |s|² = 1. */
const givens = (a: C, b: C): { cos: number; s: C } => {
  const absa = zAbs(a), absb = zAbs(b)
  if (absb === 0) return { cos: 1, s: [0, 0] }
  if (absa === 0) return { cos: 0, s: [1, 0] }
  const scale = Math.hypot(absa, absb)
  const phase: C = [a[0] / absa, a[1] / absa]
  return { cos: absa / scale, s: zScale(zMul(phase, zConj(b)), 1 / scale) }
}

const applyGivensLeft = (m: C[], n: number, p: number, q: number, cos: number, s: C): void => {
  const sc = zConj(s)
  for (let j = 0; j < n; j++) {
    const ap = entry(m, n, p, j), aq = entry(m, n, q, j)
    put(m, n, p, j, zAdd(zScale(ap, cos), zMul(s, aq)))
    put(m, n, q, j, zAdd(zMul(zScale(sc, -1), ap), zScale(aq, cos)))
  }
}

/** Right-multiplication by G†, with G the Givens rotation of `cos` and `s`. */
const applyGivensRightH = (m: C[], n: number, p: number, q: number, cos: number, s: C): void => {
  const sc = zConj(s)
  for (let i = 0; i < n; i++) {
    const ap = entry(m, n, i, p), aq = entry(m, n, i, q)
    put(m, n, i, p, zAdd(zScale(ap, cos), zMul(sc, aq)))
    put(m, n, i, q, zAdd(zMul(zScale(s, -1), ap), zScale(aq, cos)))
  }
}

/** Hermitian Householder that maps x onto a phase times ||x|| e₀. A vector that is already along e₀ needs none. */
const householder = (x: readonly C[]): { u: C[]; tau: number } | null => {
  let tail = 0
  for (let i = 1; i < x.length; i++) tail = Math.hypot(tail, x[i]![0], x[i]![1])
  if (tail === 0) return null
  const alpha = x[0]!
  const norm = Math.hypot(zAbs(alpha), tail)
  const absA = zAbs(alpha)
  const phase: C = absA === 0 ? [1, 0] : [alpha[0] / absA, alpha[1] / absA]
  const beta = zScale(phase, -norm)
  const u: C[] = x.map((xi, i) => (i === 0 ? zSub(xi, beta) : [xi[0], xi[1]]))
  let uhu = 0
  for (const ui of u) uhu += ui[0] * ui[0] + ui[1] * ui[1]
  return uhu === 0 ? null : { u, tau: 2 / uhu }
}

const applyHouseLeft = (m: C[], n: number, r0: number, u: readonly C[], tau: number): void => {
  for (let j = 0; j < n; j++) {
    let wr = 0, wi = 0
    for (let i = 0; i < u.length; i++) {
      const a = entry(m, n, r0 + i, j), cv = zConj(u[i]!)
      wr += cv[0] * a[0] - cv[1] * a[1]
      wi += cv[0] * a[1] + cv[1] * a[0]
    }
    const tw = zScale([wr, wi], tau)
    for (let i = 0; i < u.length; i++) put(m, n, r0 + i, j, zSub(entry(m, n, r0 + i, j), zMul(u[i]!, tw)))
  }
}

const applyHouseRight = (m: C[], n: number, c0: number, u: readonly C[], tau: number): void => {
  for (let i = 0; i < n; i++) {
    let dr = 0, di = 0
    for (let k = 0; k < u.length; k++) {
      const a = entry(m, n, i, c0 + k), v = u[k]!
      dr += a[0] * v[0] - a[1] * v[1]
      di += a[0] * v[1] + a[1] * v[0]
    }
    const coef = zScale([dr, di], tau)
    for (let k = 0; k < u.length; k++) put(m, n, i, c0 + k, zSub(entry(m, n, i, c0 + k), zMul(coef, zConj(u[k]!))))
  }
}

/** Unitary reduction to Hessenberg form. A = Q H Q†. */
const hessenberg = (matrix: readonly C[], n: number): { H: C[]; Q: C[] } => {
  const H = copyMatrix(matrix)
  const Q = eye(n)
  for (let k = 0; k < n - 2; k++) {
    const x: C[] = []
    for (let i = k + 1; i < n; i++) x.push([entry(H, n, i, k)[0], entry(H, n, i, k)[1]])
    const ref = householder(x)
    if (!ref) continue
    applyHouseLeft(H, n, k + 1, ref.u, ref.tau)
    applyHouseRight(H, n, k + 1, ref.u, ref.tau)
    applyHouseRight(Q, n, k + 1, ref.u, ref.tau)
    for (let i = k + 2; i < n; i++) put(H, n, i, k, [0, 0])
  }
  return { H, Q }
}

const subdiagTiny = (m: readonly C[], n: number, i: number): boolean => {
  const scale = zAbs(entry(m, n, i, i)) + zAbs(entry(m, n, i - 1, i - 1))
  return zAbs(entry(m, n, i, i - 1)) <= 1e-12 * (scale + 1)
}

/** Eigenvalue of the trailing 2×2 closest to its bottom diagonal entry: the Wilkinson shift. */
const wilkinson = (m: readonly C[], n: number, end: number): C => {
  const a = entry(m, n, end - 2, end - 2), b = entry(m, n, end - 2, end - 1), cc = entry(m, n, end - 1, end - 2), d = entry(m, n, end - 1, end - 1)
  const tr = zAdd(a, d)
  const det = zSub(zMul(a, d), zMul(b, cc))
  const root = zSqrt(zSub(zMul(tr, tr), zScale(det, 4)))
  const l1 = zScale(zAdd(tr, root), 0.5), l2 = zScale(zSub(tr, root), 0.5)
  return zAbs(zSub(l1, d)) < zAbs(zSub(l2, d)) ? l1 : l2
}

/** One shifted QR step on the unreduced Hessenberg block [start, end). */
const qrStep = (H: C[], Q: C[], n: number, start: number, end: number, shift: C): void => {
  let g = givens(zSub(entry(H, n, start, start), shift), entry(H, n, start + 1, start))
  applyGivensLeft(H, n, start, start + 1, g.cos, g.s)
  applyGivensRightH(H, n, start, start + 1, g.cos, g.s)
  applyGivensRightH(Q, n, start, start + 1, g.cos, g.s)
  for (let k = start; k < end - 2; k++) {
    g = givens(entry(H, n, k + 1, k), entry(H, n, k + 2, k))
    applyGivensLeft(H, n, k + 1, k + 2, g.cos, g.s)
    applyGivensRightH(H, n, k + 1, k + 2, g.cos, g.s)
    applyGivensRightH(Q, n, k + 1, k + 2, g.cos, g.s)
    put(H, n, k + 2, k, [0, 0])
  }
}

/** Unitary Schur form A = Q T Q†, T upper triangular. The active window is one unreduced Hessenberg block. */
const schur = (matrix: readonly C[], n: number, label: string): { T: C[]; Q: C[] } => {
  if (n === 1) return { T: copyMatrix(matrix), Q: [[1, 0]] }
  const { H, Q } = n > 2 ? hessenberg(matrix, n) : { H: copyMatrix(matrix), Q: eye(n) }
  for (let iter = 0; iter < 30 * n * n; iter++) {
    let end = n
    while (end > 1 && subdiagTiny(H, n, end - 1)) {
      put(H, n, end - 1, end - 2, [0, 0])
      end--
    }
    if (end <= 1) return { T: H, Q }
    let start = end - 1
    while (start > 0 && !subdiagTiny(H, n, start)) start--
    if (end - start <= 1) return { T: H, Q }
    const shift = iter % 10 === 9 ? zAdd(entry(H, n, end - 1, end - 1), zScale([0.6, 0.8], zAbs(entry(H, n, end - 1, end - 2)))) : wilkinson(H, n, end)
    qrStep(H, Q, n, start, end, shift)
  }
  throw new Error(`${label}: the Schur form did not converge`)
}

const blockMinus = (T: readonly C[], n: number, p: number, q: number, lambda: C): C[] => {
  const m = q - p
  return createMatrix(m, (r, s) => {
    const z = entry(T, n, p + r, p + s)
    return r === s ? zSub(z, lambda) : [z[0], z[1]]
  })
}

/** f(T) for upper-triangular T. A cluster of equal eigenvalues uses the Taylor series of f; separated eigenvalues use Parlett's recurrence. */
const triangularFn = (T: readonly C[], n: number, f: (z: C) => C, deriv: (z: C, k: number) => C): C[] => {
  const F: C[] = Array.from({ length: n * n }, () => [0, 0])
  const close = (a: C, b: C) => zAbs(zSub(a, b)) <= 1e-8 * (1 + zAbs(a) + zAbs(b))
  const clusters: [number, number][] = []
  let start = 0
  for (let i = 1; i <= n; i++) {
    if (i === n || !close(entry(T, n, i, i), entry(T, n, start, start))) {
      clusters.push([start, i])
      start = i
    }
  }
  for (const [p, q] of clusters) {
    const m = q - p
    if (m === 1) {
      put(F, n, p, p, f(entry(T, n, p, p)))
      continue
    }
    let lr = 0, li = 0
    for (let i = p; i < q; i++) {
      const z = entry(T, n, i, i)
      lr += z[0]
      li += z[1]
    }
    const lambda: C = [lr / m, li / m]
    const M = blockMinus(T, n, p, q, lambda)
    let Mk = eye(m)
    const acc: C[] = eye(m).map((z) => zMul(z, f(lambda)))
    let coefK: C = [1, 0]
    for (let k = 1; k <= m + 8; k++) {
      Mk = times(Mk, M, m)
      coefK = zScale(coefK, 1 / k)
      const coef = zMul(coefK, deriv(lambda, k))
      let cn = 0
      for (let i = 0; i < m * m; i++) {
        const add = zMul(coef, Mk[i]!)
        acc[i] = zAdd(acc[i]!, add)
        cn = Math.max(cn, zAbs(add))
      }
      if (cn < 1e-15) break
    }
    for (let r = 0; r < m; r++) for (let s = 0; s < m; s++) put(F, n, p + r, p + s, acc[r * m + s]!)
  }
  for (let d = 1; d < n; d++) for (let i = 0; i < n - d; i++) {
    const j = i + d
    if (clusters.some(([p, q]) => i >= p && j < q)) continue
    const diff = zSub(entry(T, n, j, j), entry(T, n, i, i))
    let rhs = zMul(entry(T, n, i, j), zSub(entry(F, n, j, j), entry(F, n, i, i)))
    for (let k = i + 1; k < j; k++) rhs = zAdd(rhs, zSub(zMul(entry(T, n, i, k), entry(F, n, k, j)), zMul(entry(F, n, i, k), entry(T, n, k, j))))
    put(F, n, i, j, zAbs(diff) < 1e-12 ? [0, 0] : zDiv(rhs, diff))
  }
  return F
}

const finiteMatrix = (label: string, matrix: C[]): C[] => {
  if (matrix.some(([re, im]) => !Number.isFinite(re) || !Number.isFinite(im))) throw new Error(`${label} is not a finite matrix`)
  return matrix
}

/** f(A) = Q f(T) Q† from the Schur form. A 1×1 matrix is f of its only entry. */
const matrixFn = (matrix: readonly C[], n: number, f: (z: C) => C, deriv: (z: C, k: number) => C, label: string): C[] => {
  if (n === 1) return finiteMatrix(label, [f(matrix[0]!)])
  const { T, Q } = schur(matrix, n, label)
  return finiteMatrix(label, times(times(Q, triangularFn(T, n, f, deriv), n), conjTranspose(Q, n), n))
}

const powDeriv = (z: C, t: number, k: number): C => {
  let falling: C = [1, 0]
  for (let i = 0; i < k; i++) falling = zScale(falling, t - i)
  return zMul(falling, zPow(z, t - k))
}

const expDeriv = (z: C, theta: number, k: number): C => {
  let coef: C = [1, 0]
  for (let i = 0; i < k; i++) coef = zMul(coef, [0, -theta])
  return zMul(coef, zExp(zMul([0, -theta], z)))
}

/** Cirq's gate power, G**t. An involution uses the ±1 spectral formula, so X**0.5 is the square root of NOT. A diagonal
 *  gate raises each eigenvalue on the principal branch, so S**0.5 is T, T**2 is S, and S**2 is Z. Any other matrix uses
 *  the Schur form of that same function. */
export const raiseGate = (gate: GateBody, t: number): Gate => {
  const dim = 1 << gate.arity
  const label = `${gate.name}**${t}`
  const matrix = squaresToIdentity(gate.matrix, dim)
    ? involutionPower(gate.matrix, dim, t)
    : diagonalMatrix(gate.matrix, dim)
      ? finiteMatrix(label, createMatrix(dim, (r, s) => (r === s ? zPow(entry(gate.matrix, dim, r, r), t) : [0, 0])))
      : matrixFn(gate.matrix, dim, (z) => zPow(z, t), (z, k) => powDeriv(z, t, k), label)
  return defineGate({ name: label, arity: gate.arity, matrix })
}

/** exp(−iθG). An involution uses cos θ·I − i sin θ·G, the rotation a variational ansatz applies, exp(−iθ Y⊗X) for H₂;
 *  Cirq writes that as G**(2θ/π) up to the phase e^{iθ}, which an expectation value cannot see. Any other matrix uses the
 *  Schur form of the exponential. */
export const exponentiateGate = (gate: GateBody, theta: number): Gate => {
  const dim = 1 << gate.arity
  const label = `exp(−i·${theta}·${gate.name})`
  const matrix = squaresToIdentity(gate.matrix, dim)
    ? involutionExponential(gate.matrix, dim, theta)
    : diagonalMatrix(gate.matrix, dim)
      ? finiteMatrix(label, createMatrix(dim, (r, s) => (r === s ? zExp(zMul([0, -theta], entry(gate.matrix, dim, r, r))) : [0, 0])))
      : matrixFn(gate.matrix, dim, (z) => zExp(zMul([0, -theta], z)), (z, k) => expDeriv(z, theta, k), label)
  return defineGate({ name: label, arity: gate.arity, matrix })
}

/** The tensor product of single-qubit Paulis, P₁⊗P₂⊗…, as one gate on as many qubits: the first Pauli acts on the first qubit
 *  given. Every Pauli string squares to the identity, so its power and its exponential use the ±1 formula. */
export const pauliProduct = (paulis: readonly ('X' | 'Y' | 'Z' | 'I')[]): Gate => {
  const single: Record<'X' | 'Y' | 'Z' | 'I', Gate> = { X, Y, Z, I: defineGate({ name: 'I', arity: 1, matrix: [c(1), c(0), c(0), c(1)] }) }
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
  return defineGate({ name: paulis.join('⊗'), arity: paulis.length, matrix })
}

/** The adjoint of a gate, G†: the conjugate transpose of its unitary. It is the inverse of any gate, so an echo can run
 *  its backward half with the true inverse of each operation rather than the operation itself. */
export const adjointGate = (gate: Gate): Gate => {
  const dim = 1 << gate.arity
  return defineGate({ name: `${gate.name}†`, arity: gate.arity, matrix: createMatrix(dim, (r, s) => { const [re, im] = gate.matrix[s * dim + r]!; return [re, -im] }) })
}

/** Python's `%` for a positive modulus: the remainder lands in [0, m). */
const pyMod = (n: number, m: number): number => {
  const r = n % m
  return r < 0 ? r + m : r
}

/** `1j**t` in Cirq's formula: exp(iπt/2). */
const iPow = (t: number): C => zExp([0, (Math.PI / 2) * t])

/** The published matrix of PhasedXZGate(x, z, a). A half-integer x uses Cirq's exact ½ ± ½i form. */
const phasedXZMatrix = (x: number, z: number, a: number): C[] => {
  const half = Math.abs(pyMod(x, 1) - 0.5) <= 1e-12
  let ucx: C
  let usx: C
  if (half) {
    const odd = Math.abs(Math.floor(x) % 2) === 1
    ucx = [0.5, odd ? -0.5 : 0.5]
    usx = [ucx[0], -ucx[1]]
  } else {
    const cpxh = iPow(x)
    ucx = zScale(cpxh, cpxh[0])
    usx = zMul([0, -1], zScale(cpxh, cpxh[1]))
  }
  return [ucx, zMul(usx, iPow(-2 * a)), zMul(usx, iPow(2 * (z + a))), zMul(ucx, iPow(2 * z))]
}

const turnsLabel = (n: number): string => {
  const r = Math.round(n * 1e12) / 1e12
  return r === 0 ? '0' : String(r)
}

/** Cirq's canonical exponents: x in [0, 1], z and the axis in (−1, 1]. The unitary is the formula of the exponents passed to `phasedXZGate`, not of this reduction. */
export const phasedXZCanonical = (xExponent: number, zExponent: number, axisPhaseExponent: number): { x: number; z: number; axis: number } => {
  if (![xExponent, zExponent, axisPhaseExponent].every((n) => typeof n === 'number' && Number.isFinite(n))) throw new Error('PhasedXZ exponents are finite')
  let x = xExponent
  let z = zExponent
  let a = axisPhaseExponent
  if (x < 0) { x = -x; a += 1 }
  x = pyMod(x, 2)
  if (x === 0) a = 0
  else if (x > 1) { x = 2 - x; a += 1 }
  if (x === 1 && z !== 0) { a += z / 2; z = 0 }
  z = pyMod(z, 2)
  if (z > 1) z -= 2
  a = pyMod(a, 2)
  if (a > 1) a -= 2
  return { x, z, axis: a }
}

/** Cirq's PhasedXZGate. The circuit in time order is Z^{−a}, X^x, Z^{a+z}. The matrix is the one Cirq publishes for those exponents, including the global phase of X^x. */
export const phasedXZGate = (xExponent: number, zExponent: number, axisPhaseExponent: number): Gate => {
  if (![xExponent, zExponent, axisPhaseExponent].every((n) => typeof n === 'number' && Number.isFinite(n))) throw new Error('PhasedXZ exponents are finite')
  return defineGate({ name: `PhasedXZ(${turnsLabel(xExponent)},${turnsLabel(zExponent)},${turnsLabel(axisPhaseExponent)})`, arity: 1, matrix: phasedXZMatrix(xExponent, zExponent, axisPhaseExponent) })
}

/** ZYZ angles of one qubit, in radians: phase, then a Y rotation, then a phase. Cirq drops the global phase. */
const deconstructSingleQubit = (input: readonly C[]): [number, number, number] => {
  let mat = copyMatrix(input)
  const phaseOf = (z: C): number => Math.atan2(z[1], z[0])
  const phaseMatrix = (angle: number): C[] => [[1, 0], [0, 0], [0, 0], zExp([0, angle])]
  const rotationMatrix = (angle: number): C[] => {
    const cosine = Math.cos(angle), sine = Math.sin(angle)
    return [[cosine, 0], [-sine, 0], [sine, 0], [cosine, 0]]
  }
  const right = phaseOf(zMul(entry(mat, 2, 0, 1), zConj(entry(mat, 2, 0, 0)))) + Math.PI
  mat = times(mat, phaseMatrix(-right), 2)
  const bottom = phaseOf(zMul(entry(mat, 2, 1, 0), zConj(entry(mat, 2, 0, 0))))
  mat = times(phaseMatrix(-bottom), mat, 2)
  const rotation = Math.atan2(zAbs(entry(mat, 2, 1, 0)), zAbs(entry(mat, 2, 0, 0)))
  mat = times(rotationMatrix(-rotation), mat, 2)
  const diagonal = phaseOf(zMul(entry(mat, 2, 1, 1), zConj(entry(mat, 2, 0, 0))))
  return [right + diagonal, rotation * 2, bottom]
}

/** Cirq's PhasedXZGate.from_matrix: one PhasedXZ for a one-qubit unitary, in canonical exponents. The global phase is not recovered. */
export const phasedXZOf = (matrix: readonly [number, number][]): Gate => {
  if (matrix.length !== 4) throw new Error('PhasedXZ reads a one-qubit unitary')
  let [pre, rotation, post] = deconstructSingleQubit(matrix)
  pre = pre / Math.PI - 0.5
  post = post / Math.PI + 0.5
  rotation /= Math.PI
  const canonical = phasedXZCanonical(rotation, post + pre, -pre)
  return phasedXZGate(canonical.x, canonical.z, canonical.axis)
}

export type Operation =
  | { kind: 'gate'; gate: Gate; qubits: Qubit[]; address: string }
  | { kind: 'measure'; key: string; qubits: Qubit[] }
  | { kind: 'channel'; channel: Channel; qubits: Qubit[] }

/** Cirq's operation form: a gate applied to qubits. The operation's address is the sealed UUID of that gate on those qubits. */
export const applied = (gate: Gate, ...qubits: Qubit[]): Operation => {
  if (gate.address !== gateAddress(gate) || !seal(gate.address).valid) throw new Error(`${gate.name} runs only as a sealed UUID`)
  if (qubits.length !== gate.arity) throw new Error(`${gate.name} acts on ${gate.arity} qubit(s), not ${qubits.length}`)
  const address = uuid(canonicalText({ gate: gate.address, qubits: qubits.map(qubitKey) }))
  if (!seal(address).valid) throw new Error(`${gate.name} runs only on a sealed UUID`)
  return { kind: 'gate', gate, qubits, address }
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
    requireUuidGate(op)
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

/** A dense array is the wave while the basis fits in one; past that the same wave is the occupied amplitudes, at any width. */
const DENSE_WIDTH = 24
const bit = (q: number): bigint => 1n << BigInt(q)
type Amplitude = [number, number]
type SparseState = Map<bigint, Amplitude>
const createIndexer = (order: Qubit[]) => { const pos = new Map(order.map((q, i) => [qubitKey(q), i])); return (q: Qubit) => pos.get(qubitKey(q))! }

const gateRows = (gate: GateBody) => {
  const dim = 1 << gate.arity
  return Array.from({ length: dim }, (_, r) => gate.matrix.slice(r * dim, r * dim + dim).flatMap(([mr, mi], s) => (mr || mi ? [[s, mr, mi] as const] : [])))
}

const applySparse = (state: SparseState, gate: GateBody, indices: number[]): void => {
  const dim = 1 << gate.arity
  const offsets = indices.map(bit)
  const mask = offsets.reduce((m, b) => m | b, 0n)
  const rows = gateRows(gate)
  const seen = new Set<bigint>()
  const next: SparseState = new Map()
  for (const key of state.keys()) {
    const base = key & ~mask
    if (seen.has(base)) continue
    seen.add(base)
    const re = new Float64Array(dim), im = new Float64Array(dim)
    for (let s = 0; s < dim; s++) {
      let addr = base
      for (let b = 0; b < gate.arity; b++) if (s & (1 << (gate.arity - 1 - b))) addr |= offsets[b]!
      const amp = state.get(addr)
      if (amp) { re[s] = amp[0]; im[s] = amp[1] }
    }
    for (let r = 0; r < dim; r++) {
      let nr = 0, ni = 0
      for (const [s, mr, mi] of rows[r]!) { nr += mr * re[s]! - mi * im[s]!; ni += mr * im[s]! + mi * re[s]! }
      if (nr === 0 && ni === 0) continue
      let addr = base
      for (let b = 0; b < gate.arity; b++) if (r & (1 << (gate.arity - 1 - b))) addr |= offsets[b]!
      next.set(addr, [nr, ni])
    }
  }
  state.clear()
  for (const [k, v] of next) state.set(k, v)
}

const measureSparse = (state: SparseState, index: number, random: () => number): number => {
  const mask = bit(index)
  let p1 = 0
  for (const [k, a] of state) if ((k & mask) !== 0n) p1 += a[0] ** 2 + a[1] ** 2
  const measured = random() < p1 ? 1 : 0
  const norm = Math.sqrt(measured ? p1 : 1 - p1) || 1
  for (const [k, a] of [...state]) {
    const on = (k & mask) !== 0n ? 1 : 0
    if (on !== measured) state.delete(k)
    else state.set(k, [a[0] / norm, a[1] / norm])
  }
  return measured
}

const copySparse = (state: SparseState): SparseState => new Map([...state].map(([k, a]) => [k, [a[0], a[1]] as Amplitude]))

/** Applies a gate in place (index bit k is the k-th qubit). O(2^n · nonzero entries): a permutation gate costs one term a row. */
const applyGate = (state: State, gate: GateBody, indices: number[]): void => {
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
type Wave = { kind: 'dense'; state: State } | { kind: 'sparse'; state: SparseState }

/** Cirq's Simulator: simulate() returns the final state, run() samples measurement results. Any register width. */
export class Simulator {
  private readonly random: () => number
  constructor(random: () => number = Math.random) { this.random = random }

  private initial(circuit: Circuit): { wave: Wave; order: Qubit[]; indexOf: (q: Qubit) => number } {
    const order = circuit.qubits
    const indexOf = createIndexer(order)
    if (order.length >= DENSE_WIDTH) return { wave: { kind: 'sparse', state: new Map([[0n, [1, 0]]]) }, order, indexOf }
    const state = toComplexState(1 << order.length)
    state.re[0] = 1
    return { wave: { kind: 'dense', state }, order, indexOf }
  }

  /** Gates in place, measurements into bits. */
  private apply(wave: Wave, ops: readonly Operation[], indexOf: (q: Qubit) => number, bits = new Map<string, number[]>()): Map<string, number[]> {
    for (const op of ops) {
      if (op.kind === 'channel') throw new Error(`a ${op.channel.name} channel runs on the density matrix, not on a state vector`)
      const at = op.qubits.map(indexOf)
      if (op.kind === 'gate') { requireUuidGate(op); if (wave.kind === 'dense') applyGate(wave.state, op.gate, at); else applySparse(wave.state, op.gate, at) }
      else bits.set(op.key, at.map((q) => (wave.kind === 'dense' ? getQubit(wave.state, q, this.random) : measureSparse(wave.state, q, this.random))))
    }
    return bits
  }

  private copy(wave: Wave): Wave {
    return wave.kind === 'dense' ? { kind: 'dense', state: toComplexState(wave.state) } : { kind: 'sparse', state: copySparse(wave.state) }
  }

  /** The final wave function. A dense register lists one amplitude per basis state. A wide register lists the occupied amplitudes and their basis indices. */
  simulate(circuit: Circuit): { amplitudes: [number, number][]; qubits: Qubit[]; basis?: string[]; width: number } {
    const { wave, order, indexOf } = this.initial(circuit)
    this.apply(wave, circuit.operations.filter((op) => op.kind !== 'measure'), indexOf)
    if (wave.kind === 'dense') return { amplitudes: Array.from(wave.state.re, (r, k) => [r, wave.state.im[k]!] as [number, number]), qubits: order, width: order.length }
    const occupied = [...wave.state.entries()].sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
    return { amplitudes: occupied.map(([, a]) => a), basis: occupied.map(([k]) => k.toString()), qubits: order, width: order.length }
  }

  /** Sampled results: the gates before the first measurement draw nothing at random, so they run once and each repetition copies that state. */
  run(circuit: Circuit, repetitions: number): Result {
    if (!circuit.operations.some((op) => op.kind === 'measure')) throw new Error('run needs at least one measurement')
    const { wave: prefix, indexOf } = this.initial(circuit)
    const first = circuit.operations.findIndex((op) => op.kind !== 'gate')
    this.apply(prefix, circuit.operations.slice(0, first), indexOf)
    const rest = circuit.operations.slice(first)
    const records = new Map<string, string[]>()
    for (let rep = 0; rep < repetitions; rep++) {
      for (const [key, values] of this.apply(this.copy(prefix), rest, indexOf)) { const list = records.get(key) ?? []; list.push(values.join('')); records.set(key, list) }
    }
    return new Result(records)
  }
}

/** A square complex matrix, row-major: entry (r, c) is re[r * dim + c] + i·im[r * dim + c]. */
type Matrix = State

/** The unitary a gate acts as on n qubits: column c is the state the gate makes of basis state |c>. */
const expandUnitary = (gate: GateBody, indices: number[], n: number): Matrix => {
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

const ONE: Gate = defineGate({ name: 'I', arity: 1, matrix: [c(1), c(0), c(0), c(1)] })
// a Kraus operator is not unitary, so it carries no gate address
const operator = (matrix: [number, number][]): GateBody => ({ name: 'K', arity: 1, matrix })
/** A Pauli (or identity) scaled by the square root of a weight, so that its square carries the weight. */
const weighted = (gate: Gate, weight: number): GateBody => ({
  name: gate.name,
  arity: 1,
  matrix: gate.matrix.map(([r, i]): [number, number] => [r * Math.sqrt(weight), i * Math.sqrt(weight)]),
})

const probability = (p: number, name: string): void => {
  if (p < 0 || p > 1) throw new Error(`the ${name} probability ${p} is between 0 and 1`)
}

/** Cirq's channels as Kraus operators: E(ρ) = Σ K ρ K†. The definitions are Cirq's own. */
const krausOperators = (channel: Channel): GateBody[] => {
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

/** The result of a density-matrix run: the density matrix, its diagonal (the basis probabilities), its trace and purity.
 *  When the matrix is wider than one array, `basis` names the occupied diagonal and `probabilities` lines up with it. */
type DensityResult = { qubits: Qubit[]; density: Matrix; probabilities: number[]; trace: number; purity: number; basis?: string[] }

/** The density matrix is one array while it fits. A wider register is the same state: the occupied amplitudes, and noise as Kraus branches of those amplitudes. */
const DENSITY_ARRAY = 12

const mass = (state: SparseState): number => {
  let mass = 0
  for (const a of state.values()) mass += a[0] ** 2 + a[1] ** 2
  return mass
}

/** ⟨a|b⟩. */
const overlap = (a: SparseState, b: SparseState): [number, number] => {
  let re = 0, im = 0
  const [src, dst, swapped] = a.size <= b.size ? [a, b, false] as const : [b, a, true] as const
  for (const [k, x] of src) {
    const y = dst.get(k)
    if (!y) continue
    const left = swapped ? y : x, right = swapped ? x : y
    re += left[0] * right[0] + left[1] * right[1]
    im += left[0] * right[1] - left[1] * right[0]
  }
  return [re, im]
}

/** One channel on one qubit: each occupied amplitude splits into one branch per Kraus operator. The weights sit in the operators. */
const splitChannel = (branches: SparseState[], channel: Channel, index: number): SparseState[] => {
  const next: SparseState[] = []
  for (const state of branches) for (const kraus of krausOperators(channel)) {
    const copy = copySparse(state)
    applySparse(copy, kraus, [index])
    if (mass(copy) > 1e-18) next.push(copy)
  }
  return next
}

/** Cirq's DensityMatrixSimulator: the state as a density matrix, so a noisy channel acts exactly rather than by sampling.
 *  A gate acts as U ρ U†; with a depolarizing probability p, each gate is followed by the depolarizing channel on each of
 *  its qubits. A channel placed in the circuit (noisy) acts where it sits, on its qubits only, and draws no gate noise.
 *  A pure state has purity 1; noise lowers it. The matrix is one array while it fits. A wider register keeps the occupied
 *  amplitudes, and a wider noisy register keeps the Kraus branches of those amplitudes. */
export class DensityMatrixSimulator {
  simulate(circuit: Circuit, channels: readonly Channel[] | ((arity: number) => readonly Channel[]) = []): DensityResult {
    if (typeof channels === 'function') [1, 2].forEach((arity) => channels(arity).forEach(krausOperators))
    else channels.forEach(krausOperators)
    const order = circuit.qubits
    const n = order.length
    const noisy = circuit.operations.some((op) => op.kind === 'channel') || (typeof channels === 'function' ? true : channels.length > 0)
    if (n > DENSITY_ARRAY && !noisy) {
      const pure = new Simulator().simulate(circuit)
      const probabilities = pure.amplitudes.map(([re, im]) => re * re + im * im)
      const trace = probabilities.reduce((s, p) => s + p, 0)
      return { qubits: order, density: { re: Float64Array.from(probabilities), im: new Float64Array(probabilities.length) }, probabilities, ...(pure.basis ? { basis: pure.basis } : {}), trace, purity: 1 }
    }
    if (n > DENSITY_ARRAY) {
      const indexOf = createIndexer(order)
      let branches: SparseState[] = [new Map([[0n, [1, 0]]])]
      for (const op of circuit.operations) {
        if (op.kind === 'channel') {
          krausOperators(op.channel)
          for (const q of op.qubits) branches = splitChannel(branches, op.channel, indexOf(q))
          continue
        }
        if (op.kind !== 'gate') continue
        requireUuidGate(op)
        const indices = op.qubits.map(indexOf)
        for (const state of branches) applySparse(state, op.gate, indices)
        const noise = typeof channels === 'function' ? channels(op.gate.arity) : channels
        for (const i of indices) for (const channel of noise) branches = splitChannel(branches, channel, i)
      }
      const diagonal = new Map<bigint, number>()
      for (const state of branches) for (const [k, a] of state) diagonal.set(k, (diagonal.get(k) ?? 0) + a[0] ** 2 + a[1] ** 2)
      const occupied = [...diagonal.entries()].sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
      const probabilities = occupied.map(([, p]) => p)
      const trace = probabilities.reduce((s, p) => s + p, 0)
      let purity = 0
      for (const a of branches) for (const b of branches) { const [re, im] = overlap(a, b); purity += re * re + im * im }
      return { qubits: order, density: { re: Float64Array.from(probabilities), im: new Float64Array(probabilities.length) }, probabilities, basis: occupied.map(([k]) => k.toString()), trace, purity }
    }
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
      requireUuidGate(op)
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
