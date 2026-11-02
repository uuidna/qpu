// The Clay register recomputed in integer arithmetic only: the Lean definitions ported one for one, the 55 relation
// statements parsed and evaluated, every intermediate value checked to stay an exact integer, and the width each relation
// needs recorded, so a small machine (the Pravets 8M of the author's register) can redo the same sums in software
// multi-byte arithmetic and compare content addresses. The kernel check happened once, in Lean; this recomputes what it
// accepted and says how many bits each identity needs. No floats: `/` is floor division on naturals, `-` truncates at 0.
import { CLAY_RELATIONS } from './clay-statements.ts'
import { memoOf as memo } from './unit/blocks.ts'

const MAX_SAFE = Number.MAX_SAFE_INTEGER
const nat = (x: number, what: string): number => { if (!Number.isInteger(x) || x < 0 || x > MAX_SAFE) throw new Error(`${what} left the exact naturals: ${x}`); return x }

// Mint
export const mintOf = memo((k: number): number => (k === 0 ? 1 : nat(mintOf(k - 1) + mintOf(k - 1), 'mintOf')))
export const chooseOf = memo((n: number, k: number): number => (k === 0 ? 1 : n === 0 ? 0 : nat(chooseOf(n - 1, k) + chooseOf(n - 1, k - 1), 'chooseOf')))
// Lattice
export const n = 3
const seed = mintOf(n - n)
const coins = seed + seed
const rays = n + coins + coins
export const vertices = mintOf(n)
const hexbit = mintOf(coins)
export const bits = mintOf(n + coins)
export const faces = vertices + hexbit + coins
export const amplitudes = mintOf(bits)
const fused = faces * mintOf(bits + seed)
export const plane = coins * coins * rays
// Combinatorics
const factorial = memo((k: number): number => (k === 0 ? 1 : nat(k * factorial(k - 1), 'factorial')))
export const choose = memo((a: number, k: number): number => (k === 0 ? 1 : a === 0 ? 0 : nat(choose(a - 1, k) + choose(a - 1, k - 1), 'choose')))
const triangular = memo((k: number): number => (k === 0 ? 0 : nat(k + triangular(k - 1), 'triangular')))
// Shor (fuelled recursions, as the Lean states them)
const powModAux = (k: number, a: number, m: number, acc: number): number => (k === 0 ? acc : powModAux(k - 1, a, m, nat((acc * a) % m, 'powMod')))
export const powMod = (a: number, e: number, m: number): number => powModAux(e, a, m, 1 % m)
const periodAux = (fuel: number, a: number, m: number, r: number): number => (fuel === 0 ? 0 : powMod(a, r, m) === 1 ? r : periodAux(fuel - 1, a, m, r + 1))
export const multiplicativePeriod = (a: number, m: number): number => periodAux(m, a, m, 1)
const half = (a: number, m: number): number => powMod(a, Math.floor(multiplicativePeriod(a, m) / 2), m)
// Crypto (Shor): gcd by the Euclidean recursion, and the modulus and base named by the lattice (Qpu/Shor.lean, ported one for one)
const gcdOf = (a: number, b: number): number => (b === 0 ? a : gcdOf(b, a % b))
const totient = (nn: number): number => { let c = 0; for (let k = 1; k <= nn; k++) if (gcdOf(k, nn) === 1) c += 1; return c }
const shorModulus = rays * (faces - seed)
const shorBase = mintOf(n)
// Galois, Anyon, Annealing, Clifford, Coil, Grover, Hybrid, Magic, Qaoa, Qft, Stabilizer
const glProd = memo((nn: number, i: number): number => (i === 0 ? 1 : nat(Math.max(0, mintOf(nn) - mintOf(i - 1)) * glProd(nn, i - 1), 'glProd')))
const fibAux = (k: number, a: number, b: number): number => (k === 0 ? a : fibAux(k - 1, b, nat(a + b, 'fibFusion')))
const fibFusion = (nn: number): number => fibAux(nn, seed - seed, seed)
const isingFusion = (m: number): number => mintOf(Math.max(0, m - seed))
const chimera = (m: number): number => nat(vertices * m ** 2, 'chimera')
const sympProd = memo((j: number): number => (j === 0 ? 1 : nat((mintOf(2 * j) - 1) * sympProd(j - 1), 'sympProd')))
const symplectic = (nn: number): number => nat(mintOf(nn * nn) * sympProd(nn), 'symplectic')
const cliffordOrder = (nn: number): number => nat(mintOf(2 * nn) * symplectic(nn), 'cliffordOrder')
const coil = coins * rays
const groverIters = (k: number): number => Math.floor(nat((plane * (faces - seed) - n * n) * mintOf(k), 'groverIters') / (coins * coins * (plane * hexbit + seed)))
const groverSize = (k: number): number => mintOf(2 * k)
const hybridSpeed = rays + seed
const magicBlock = faces + seed
const magicCubic = plane + rays
const qaoaParams = (p: number): number => coins * p
const qaoaZz = (p: number, e: number): number => nat(p * e, 'qaoaZz')
const qaoaX = (p: number, q: number): number => nat(p * q, 'qaoaX')
const qftGates = (q: number): number => Math.floor((q * (q + 1)) / 2)
const qftDepth = (q: number): number => Math.max(0, 2 * q - 1)
const qftStates = (q: number): number => nat(2 ** q, 'qftStates')
const paulis = (nn: number): number => mintOf(2 * nn + 2)

const CONSTANTS: Record<string, number> = { n, seed, coins, rays, vertices, hexbit, bits, faces, amplitudes, fused, plane, coil, hybridSpeed, magicBlock, magicCubic, shorBase, shorModulus }
const FUNCTIONS: Record<string, { arity: number; f: (...a: number[]) => number }> = {
  mintOf: { arity: 1, f: (k) => mintOf(k!) }, chooseOf: { arity: 2, f: (a, k) => chooseOf(a!, k!) }, choose: { arity: 2, f: (a, k) => choose(a!, k!) }, factorial: { arity: 1, f: (k) => factorial(k!) }, triangular: { arity: 1, f: (k) => triangular(k!) },
  powMod: { arity: 3, f: (a, e, m) => powMod(a!, e!, m!) }, periodOf: { arity: 2, f: (a, m) => multiplicativePeriod(a!, m!) }, half: { arity: 2, f: (a, m) => half(a!, m!) }, gcdOf: { arity: 2, f: (a, b) => gcdOf(a!, b!) }, totient: { arity: 1, f: (nn) => totient(nn!) },
  glProd: { arity: 2, f: (a, b) => glProd(a!, b!) }, fibFusion: { arity: 1, f: (k) => fibFusion(k!) }, isingFusion: { arity: 1, f: (k) => isingFusion(k!) }, chimera: { arity: 1, f: (k) => chimera(k!) },
  cliffordOrder: { arity: 1, f: (k) => cliffordOrder(k!) }, groverIters: { arity: 1, f: (k) => groverIters(k!) }, groverSize: { arity: 1, f: (k) => groverSize(k!) },
  qaoaParams: { arity: 1, f: (k) => qaoaParams(k!) }, qaoaZz: { arity: 2, f: (a, b) => qaoaZz(a!, b!) }, qaoaX: { arity: 2, f: (a, b) => qaoaX(a!, b!) },
  qftGates: { arity: 1, f: (k) => qftGates(k!) }, qftDepth: { arity: 1, f: (k) => qftDepth(k!) }, qftStates: { arity: 1, f: (k) => qftStates(k!) }, paulis: { arity: 1, f: (k) => paulis(k!) },
}

// A small reader of Lean arithmetic: application by juxtaposition, then ^, then * / %, then + -, with ( ).
type Tok = { t: 'num'; v: number } | { t: 'id'; v: string } | { t: 'op'; v: string }
const lex = (src: string): Tok[] => { const out: Tok[] = []; const re = /\s*(\d+|[A-Za-z_][A-Za-z0-9_']*|[-+*/%^()])/gy; let m: RegExpExecArray | null; let i = 0; while (i < src.length) { re.lastIndex = i; m = re.exec(src); if (!m) throw new Error(`cannot read "${src.slice(i)}"`); const s = m[1]!; out.push(/^\d/.test(s) ? { t: 'num', v: Number(s) } : /^[A-Za-z_]/.test(s) ? { t: 'id', v: s } : { t: 'op', v: s }); i = re.lastIndex } return out }
export const evaluate = (src: string): number => {
  const toks = lex(src); let p = 0
  const peek = () => toks[p]; const take = () => toks[p++]!
  const atom = (): number => {
    const t = take()
    if (t.t === 'num') return t.v
    if (t.t === 'op' && t.v === '(') { const v = sum(); const c = take(); if (c.t !== 'op' || c.v !== ')') throw new Error('expected )'); return v }
    if (t.t === 'id') { if (t.v in CONSTANTS) return CONSTANTS[t.v]!; if (t.v in FUNCTIONS) { const { arity, f } = FUNCTIONS[t.v]!; const args: number[] = []; for (let i = 0; i < arity; i++) args.push(atom()); return f(...args) } throw new Error(`unknown name ${t.v}`) }
    throw new Error(`unexpected ${t.v}`)
  }
  const power = (): number => { const b = atom(); const t = peek(); if (t && t.t === 'op' && t.v === '^') { p++; return nat(b ** power(), 'pow') } return b }
  const product = (): number => { let v = power(); for (;;) { const t = peek(); if (!t || t.t !== 'op' || !'*/%'.includes(t.v)) return v; p++; const r = power(); v = t.v === '*' ? nat(v * r, 'mul') : t.v === '/' ? Math.floor(v / r) : v % r } }
  const sum = (): number => { let v = product(); for (;;) { const t = peek(); if (!t || t.t !== 'op' || !'+-'.includes(t.v)) return v; p++; const r = product(); v = t.v === '+' ? nat(v + r, 'add') : Math.max(0, v - r) } }
  const v = sum()
  if (p !== toks.length) throw new Error(`trailing tokens in "${src}"`)
  return v
}

type Relation = { name: string; statement: string; sides: { expression: string; value: number }[]; holds: boolean; bits: number; families: readonly string[] }
/** Every relation recomputed: each `=` compared, each `∧` all holding, and the bit width of the largest value. */
/** 16-bit limbs a value needs: what an 8-bit machine with 16-bit software arithmetic (the Pravets 8M) holds it in. */
const countLimbs16 = (bits: number): number => Math.max(1, Math.ceil(bits / 16))
export const recomputeClay = (): { relations: Relation[]; total: number; holding: number; maxBits: number; maxLimbs16: number; ledger: string } => {
  const relations: Relation[] = CLAY_RELATIONS.map(({ name, statement, families }) => {
    const sides = [...new Set(statement.split('∧').flatMap((eq) => eq.split('=')).map((s) => s.trim()))].map((expression) => ({ expression, value: evaluate(expression) }))
    const holds = statement.split('∧').every((eq) => { const [a, b] = eq.split('=').map((s) => evaluate(s.trim())); return a === b })
    const bits = Math.max(1, ...sides.map((s) => (s.value === 0 ? 1 : Math.floor(Math.log2(s.value)) + 1)))
    return { name, statement, sides, holds, bits, families: families ?? [] }
  })
  const holding = relations.filter((r) => r.holds).length
  const ledger = relations.map((r) => `${r.name}=${r.sides[0]!.value}`).join('\n')
  const maxBits = Math.max(...relations.map((r) => r.bits))
  return { relations, total: relations.length, holding, maxBits, maxLimbs16: countLimbs16(maxBits), ledger }
}

/** The technique applied to the register: every relation's value read as a vortex seed with its σ_10 reflection and both
 * trinities; relations whose seeds reflect each other paired; the fixed ones (seed 5) named; the key's trinity (3, 6, 9) marked. */
type ClayReading = { name: string; value: number; seed: number; reflection: number; trinity: number[]; reflected: number[]; tuned: boolean; fixed: boolean; sequences: { a: string; name: string }[]; solved: boolean }
// the superposition grounded in public sequences: the OEIS families a register value belongs to, decided by exact integer tests (no network),
// so every run documents which cross-toolset formula each value superposes with — a triangular number is also a QFT gate count, a power of two a
// Grover state space, a perfect number also triangular and hexagonal (oeis.org, verified live for 28 and 496).
const isSquare = (x: number): boolean => { if (x < 0) return false; const r = Math.round(Math.sqrt(x)); return r * r === x }
const isPrime = (x: number): boolean => { if (x < 2) return false; for (let i = 2; i * i <= x; i++) if (x % i === 0) return false; return true }
const oeisOf = (v: number, statement = ''): { a: string; name: string }[] => {
  const s: { a: string; name: string }[] = []
  if (v > 0 && (v & (v - 1)) === 0) s.push({ a: 'A000079', name: 'powers of 2 (Grover/QFT state space, mintOf)' })
  if (isSquare(8 * v + 1)) s.push({ a: 'A000217', name: 'triangular numbers (QFT gate count)' })
  if (isSquare(8 * v + 1) && (Math.sqrt(8 * v + 1) + 1) % 4 === 0) s.push({ a: 'A000384', name: 'hexagonal numbers' })
  { let f = 1, k = 1; while (f < v) f *= ++k; if (f === v) s.push({ a: 'A000142', name: 'factorials (Clifford order)' }) }
  if (v > 0 && (isSquare(5 * v * v + 4) || isSquare(5 * v * v - 4))) s.push({ a: 'A000045', name: 'Fibonacci numbers (fibFusion)' })
  { let m = v, e = 0; if (v > 0 && v % 2 === 0) { while ((m & 1) === 0) { m /= 2; e++ } if (m === 2 ** (e + 1) - 1 && isPrime(m)) s.push({ a: 'A000396', name: 'perfect numbers (Euclid–Euler 2^(k−1)(2^k−1), 2^k−1 prime)' }) } }
  if (v > 0 && isSquare(v)) s.push({ a: 'A000290', name: 'squares (qaoaZz m m)' })
  { const c = Math.round(Math.cbrt(v)); if (v > 0 && c * c * c === v) s.push({ a: 'A000578', name: 'cubes' }) }
  if (v > 0 && isSquare(4 * v + 1)) s.push({ a: 'A002378', name: 'pronic numbers k(k+1)' })
  if (isPrime(v)) s.push({ a: 'A000040', name: 'prime numbers' })
  if (/choose/.test(statement)) s.push({ a: 'A007318', name: 'binomial coefficients (Pascal, choose/chooseOf; e.g. C(32,14)=471435600, OEIS A010948)' })
  return s
}
export const digitalRoot = (n: number): number => (n === 0 ? 0 : 1 + ((n - 1) % 9))
export const trinityFor = (seed: number): number[] => (seed === 0 ? [] : seed % 3 === 0 ? [3, 6, 9] : [7, 4, 1].includes(seed) ? [7, 4, 1] : [2, 5, 8])
export const reflectionOfRegister = (relations: readonly Relation[]): { readings: ClayReading[]; bySeed: Record<string, string[]>; byTrinity: Record<string, string[]>; pairs: { a: string; b: string; seeds: [number, number] }[]; fixed: string[]; tuned: string[]; open: { id: string; statement: string; status: 'open'; tool: string }[] } => {
  const readings = relations.map((r) => { const value = r.sides[0]!.value; const seed = digitalRoot(value); const trinity = trinityFor(seed); const sequences = oeisOf(value, r.statement); return { name: r.name, value, seed, reflection: seed === 0 ? 0 : 10 - seed, trinity, reflected: trinity.map((x) => 10 - x), tuned: trinity[0] === 3, fixed: seed === 5, sequences, solved: sequences.length > 0 } })
  const bySeed: Record<string, string[]> = {}; const byTrinity: Record<string, string[]> = {}
  for (const x of readings) { (bySeed[String(x.seed)] ??= []).push(x.name); (byTrinity[x.trinity.join(',') || 'zero'] ??= []).push(x.name) }
  const pairs: { a: string; b: string; seeds: [number, number] }[] = []
  for (const a of readings) for (const b of readings) if (a.name < b.name && a.seed + b.seed === 10 && a.seed !== 5) pairs.push({ a: a.name, b: b.name, seeds: [a.seed, b.seed] })
  // problem-solving at each decide case: a relation grounded in a public sequence is cross-formulated (solved); one that holds but no sequence reaches
  // is an open discovery lead — the qaoa/chimera product still to cross-formulate, carried for the next run to address
  const open = readings.filter((x) => !x.solved).map((x) => ({ id: `clay-open-${x.value}`, statement: `${x.name} (${x.value}) holds but no public sequence cross-formulates it yet: a discovery lead to ground the product`, status: 'open' as const, tool: 'clay' }))
  return { readings, bySeed, byTrinity, pairs, fixed: readings.filter((x) => x.fixed).map((x) => x.name), tuned: readings.filter((x) => x.tuned).map((x) => x.name), open }
}
