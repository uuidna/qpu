// The Clay register recomputed in integer arithmetic only: the Lean definitions ported one for one, the 55 relation
// statements parsed and evaluated, every intermediate value checked to stay an exact integer, and the width each relation
// needs recorded, so a small machine (the Pravets 8M of the author's register) can redo the same sums in software
// multi-byte arithmetic and compare content addresses. The kernel check happened once, in Lean; this recomputes what it
// accepted and says how many bits each identity needs. No floats: `/` is floor division on naturals, `-` truncates at 0.
import { CLAY_RELATIONS } from './clay-statements.js'

const MAX_SAFE = Number.MAX_SAFE_INTEGER
const nat = (x: number, what: string): number => { if (!Number.isInteger(x) || x < 0 || x > MAX_SAFE) throw new Error(`${what} left the exact naturals: ${x}`); return x }
const memo = <A extends unknown[], R>(f: (...a: A) => R): ((...a: A) => R) => { const m = new Map<string, R>(); return (...a) => { const k = a.join(','); if (!m.has(k)) m.set(k, f(...a)); return m.get(k)! } }

// Mint
export const mintOf = memo((k: number): number => (k === 0 ? 1 : nat(mintOf(k - 1) + mintOf(k - 1), 'mintOf')))
export const chooseOf = memo((n: number, k: number): number => (k === 0 ? 1 : n === 0 ? 0 : nat(chooseOf(n - 1, k) + chooseOf(n - 1, k - 1), 'chooseOf')))
// Lattice
export const n = 3
export const seed = mintOf(n - n)
export const coins = seed + seed
export const rays = n + coins + coins
export const vertices = mintOf(n)
export const hexbit = mintOf(coins)
export const bits = mintOf(n + coins)
export const faces = vertices + hexbit + coins
export const amplitudes = mintOf(bits)
export const fused = faces * mintOf(bits + seed)
export const plane = coins * coins * rays
// Combinatorics
export const factorial = memo((k: number): number => (k === 0 ? 1 : nat(k * factorial(k - 1), 'factorial')))
export const choose = memo((a: number, k: number): number => (k === 0 ? 1 : a === 0 ? 0 : nat(choose(a - 1, k) + choose(a - 1, k - 1), 'choose')))
export const triangular = memo((k: number): number => (k === 0 ? 0 : nat(k + triangular(k - 1), 'triangular')))
// Shor (fuelled recursions, as the Lean states them)
const powModAux = (k: number, a: number, m: number, acc: number): number => (k === 0 ? acc : powModAux(k - 1, a, m, nat((acc * a) % m, 'powMod')))
export const powMod = (a: number, e: number, m: number): number => powModAux(e, a, m, 1 % m)
const periodAux = (fuel: number, a: number, m: number, r: number): number => (fuel === 0 ? 0 : powMod(a, r, m) === 1 ? r : periodAux(fuel - 1, a, m, r + 1))
export const periodOf = (a: number, m: number): number => periodAux(m, a, m, 1)
export const half = (a: number, m: number): number => powMod(a, Math.floor(periodOf(a, m) / 2), m)
// Galois, Anyon, Annealing, Clifford, Coil, Grover, Hybrid, Magic, Qaoa, Qft, Stabilizer
export const glProd = memo((nn: number, i: number): number => (i === 0 ? 1 : nat(Math.max(0, mintOf(nn) - mintOf(i - 1)) * glProd(nn, i - 1), 'glProd')))
const fibAux = (k: number, a: number, b: number): number => (k === 0 ? a : fibAux(k - 1, b, nat(a + b, 'fibFusion')))
export const fibFusion = (nn: number): number => fibAux(nn, seed - seed, seed)
export const isingFusion = (m: number): number => mintOf(Math.max(0, m - seed))
export const chimera = (m: number): number => nat(vertices * m ** 2, 'chimera')
const sympProd = memo((j: number): number => (j === 0 ? 1 : nat((mintOf(2 * j) - 1) * sympProd(j - 1), 'sympProd')))
export const symplectic = (nn: number): number => nat(mintOf(nn * nn) * sympProd(nn), 'symplectic')
export const cliffordOrder = (nn: number): number => nat(mintOf(2 * nn) * symplectic(nn), 'cliffordOrder')
export const coil = coins * rays
export const groverIters = (k: number): number => Math.floor(nat((plane * (faces - seed) - n * n) * mintOf(k), 'groverIters') / (coins * coins * (plane * hexbit + seed)))
export const groverSize = (k: number): number => mintOf(2 * k)
export const hybridSpeed = rays + seed
export const magicBlock = faces + seed
export const magicCubic = plane + rays
export const qaoaParams = (p: number): number => coins * p
export const qaoaZz = (p: number, e: number): number => nat(p * e, 'qaoaZz')
export const qaoaX = (p: number, q: number): number => nat(p * q, 'qaoaX')
export const qftGates = (q: number): number => Math.floor((q * (q + 1)) / 2)
export const qftDepth = (q: number): number => Math.max(0, 2 * q - 1)
export const qftStates = (q: number): number => nat(2 ** q, 'qftStates')
export const paulis = (nn: number): number => mintOf(2 * nn + 2)

const CONSTANTS: Record<string, number> = { n, seed, coins, rays, vertices, hexbit, bits, faces, amplitudes, fused, plane, coil, hybridSpeed, magicBlock, magicCubic }
const FUNCTIONS: Record<string, { arity: number; f: (...a: number[]) => number }> = {
  mintOf: { arity: 1, f: (k) => mintOf(k!) }, chooseOf: { arity: 2, f: (a, k) => chooseOf(a!, k!) }, choose: { arity: 2, f: (a, k) => choose(a!, k!) }, factorial: { arity: 1, f: (k) => factorial(k!) }, triangular: { arity: 1, f: (k) => triangular(k!) },
  powMod: { arity: 3, f: (a, e, m) => powMod(a!, e!, m!) }, periodOf: { arity: 2, f: (a, m) => periodOf(a!, m!) }, half: { arity: 2, f: (a, m) => half(a!, m!) },
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

export type Relation = { name: string; statement: string; sides: { expression: string; value: number }[]; holds: boolean; bits: number }
/** Every relation recomputed: each `=` compared, each `∧` all holding, and the bit width of the largest value. */
/** 16-bit limbs a value needs: what an 8-bit machine with 16-bit software arithmetic (the Pravets 8M) holds it in. */
export const limbs16Of = (bits: number): number => Math.max(1, Math.ceil(bits / 16))
export const recomputeClay = (): { relations: Relation[]; total: number; holding: number; maxBits: number; maxLimbs16: number; ledger: string } => {
  const relations: Relation[] = CLAY_RELATIONS.map(({ name, statement }) => {
    const sides = [...new Set(statement.split('∧').flatMap((eq) => eq.split('=')).map((s) => s.trim()))].map((expression) => ({ expression, value: evaluate(expression) }))
    const holds = statement.split('∧').every((eq) => { const [a, b] = eq.split('=').map((s) => evaluate(s.trim())); return a === b })
    const bits = Math.max(1, ...sides.map((s) => (s.value === 0 ? 1 : Math.floor(Math.log2(s.value)) + 1)))
    return { name, statement, sides, holds, bits }
  })
  const holding = relations.filter((r) => r.holds).length
  const ledger = relations.map((r) => `${r.name}=${r.sides[0]!.value}`).join('\n')
  const maxBits = Math.max(...relations.map((r) => r.bits))
  return { relations, total: relations.length, holding, maxBits, maxLimbs16: limbs16Of(maxBits), ledger }
}
