// Every textbook theorem's Lean statement read back as arithmetic (variables, hypotheses, conjuncts) and evaluated exactly in BigInt with
// Lean's Nat semantics (truncated subtraction, floored division), so a client calls any theorem as a computation; the prose audit finds the
// expression each number of a text rests on, or leaves a lead.
import { PROSE, proseFill } from './prose-index.ts'
import { div, mod, mul, natSub, pow } from '../apps/index.ts'
import { TEXTBOOK_THEOREMS } from './textbook-theorems.ts'
import { THEOREMS } from './theorems-index.ts'
import { routeStatement } from './match.ts'
import type { Example } from './examples.ts'
import type { Lead } from './leads.ts'

type Tok = { t: 'num' | 'id' | 'op' | 'lp' | 'rp'; v: string }
const OPS = ['∀', '↔', '→', '&&', '||', '≤', '≥', '≠', '∧', '∨', '¬', '∣', '+', '-', '*', '/', '%', '^', '<', '>', '=', ',', '!']
const tokens = (s: string): Tok[] => {
  const out: Tok[] = []; let i = 0
  while (i < s.length) {
    const c = s[i]!
    if (/\s/.test(c)) { i++; continue }
    if (c === '(') { out.push({ t: 'lp', v: c }); i++; continue }
    if (c === ')') { out.push({ t: 'rp', v: c }); i++; continue }
    const op = OPS.find((o) => s.startsWith(o, i)); if (op) { out.push({ t: 'op', v: op }); i += op.length; continue }
    const n = /^(0x[0-9a-fA-F]+|\d+)/.exec(s.slice(i)); if (n) { out.push({ t: 'num', v: n[1]! }); i += n[1]!.length; continue }
    const id = /^[A-Za-z_][A-Za-z0-9_.'\u2080-\u2089]*/.exec(s.slice(i)); if (id) { out.push({ t: 'id', v: id[0] }); i += id[0].length; continue }
    throw new Error(`unread symbol ${c}`)
  }
  return out
}
type Env = Record<string, bigint | boolean>
type Value = bigint | boolean | Value[]
const FUNCS: Record<string, (a: bigint[]) => bigint> = { 'Nat.gcd': ([a, b]) => { let x = a!, y = b!; while (y) [x, y] = [y, mod(x, y)]; return x }, max: ([a, b]) => (a! > b! ? a! : b!), min: ([a, b]) => (a! < b! ? a! : b!), 'Nat.succ': ([a]) => a! + 1n, 'Nat.pred': ([a]) => (a! > 0n ? a! - 1n : 0n) }
/** A recursive-descent evaluator: ∨ < ∧ < ¬ < comparison < + − < × / % < ^ (right) < application < atom; booleans and naturals kept apart.
 *  proposition: true also reads an implication, a biconditional, && || !, if-then-else, a tuple, Nat.zero, a cast and an uninterpreted function. */
export const evaluate = (src: string, env: Env, mode?: { proposition?: boolean; functions?: readonly string[] }): { value: Value; parts: { text: string; left: string; op: string; right: string; holds: boolean }[] } => {
  const proposition = mode?.proposition === true, fns = new Set(mode?.functions ?? [])
  const text = proposition ? src.replaceAll('Nat.zero', '0').replace(/\s*:\s*(?:Int|Nat|Bool)\b/g, '') : src
  const ts = tokens(text); let p = 0; const parts: { text: string; left: string; op: string; right: string; holds: boolean }[] = []
  const peek = () => ts[p], take = () => ts[p++]!
  const num = (v: Value): bigint => { if (typeof v !== 'bigint') throw new Error(PROSE.quantumProcessingExpressions_s7); return v }
  const asBool = (v: Value): boolean => { if (v === true || v === 1n) return true; if (v === false || v === 0n) return false; throw new Error(PROSE.quantumProcessingExpressions_s6) }
  const eq = (a: Value, b: Value): boolean => Array.isArray(a) || Array.isArray(b) ? Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((x, i) => eq(x, b[i]!)) : a === b
  const hashFn = (name: string, args: Value[]): bigint => {
    const flat = (v: Value): string => Array.isArray(v) ? `[${v.map(flat).join(',')}]` : typeof v === 'boolean' ? String(v) : v.toString()
    let h = 0n
    for (const ch of `${name}(${args.map(flat).join(',')})`) h = (h * 131n + BigInt(ch.codePointAt(0)!)) & 0xffffffffffffffffn
    return h
  }
  const atom = (): Value => {
    const k = take()
    if (!k) throw new Error('the statement ends early')
    if (k.t === 'num') return BigInt(k.v)
    if (k.t === 'lp') {
      const v = proposition ? formula() : disj()
      if (proposition && peek()?.v === ',') { const items = [v]; while (peek()?.v === ',') { take(); items.push(formula()) }; if (take()?.t !== 'rp') throw new Error('an unclosed parenthesis'); return items }
      if (take()?.t !== 'rp') throw new Error('an unclosed parenthesis')
      return v
    }
    if (k.t === 'id') {
      if (proposition && k.v === 'if') { const c = formula(); if (take()?.v !== 'then') throw new Error('unread if'); const a = formula(); if (take()?.v !== 'else') throw new Error('unread if'); const b = formula(); return asBool(c) ? a : b }
      if (k.v === 'true') return true; if (k.v === 'false') return false
      if (FUNCS[k.v]) { const args: bigint[] = []; while (peek() && (peek()!.t === 'num' || peek()!.t === 'lp' || (peek()!.t === 'id' && !FUNCS[peek()!.v] && (!proposition || (peek()!.v !== 'then' && peek()!.v !== 'else' && !fns.has(peek()!.v)))))) args.push(num(atom())); return FUNCS[k.v]!(args) }
      if (proposition && fns.has(k.v)) { const args: Value[] = []; while (peek() && peek()!.t !== 'op' && peek()!.t !== 'rp' && !(peek()!.t === 'id' && (peek()!.v === 'then' || peek()!.v === 'else'))) args.push(atom()); return hashFn(k.v, args) }
      if (k.v in env) return env[k.v]!
      throw new Error(`the variable ${k.v} has no value`)
    }
    throw new Error(`unexpected ${k.v}`)
  }
  const power = (): Value => { const b = atom(); if (peek()?.v === '^') { take(); const e = power(); return pow(num(b), num(e)) } return b }
  const product = (): Value => { let v = power(); while (peek() && ['*', '/', '%'].includes(peek()!.v)) { const o = take().v; const r = num(power()); v = o === '*' ? mul(num(v), r) : o === '/' ? div(num(v), r) : mod(num(v), r) } return v }
  const sum = (): Value => { let v = product(); while (peek() && ['+', '-'].includes(peek()!.v)) { const o = take().v; const r = num(product()); v = o === '+' ? num(v) + r : natSub(num(v), r) } return v }
  const comparison = (): Value => {
    const start = p; const l = sum()
    const o = peek()?.v
    if (o && (o === '=' || o === '≠' || o === '≤' || o === '<' || o === '≥' || o === '>' || (proposition && o === '∣'))) {
      take(); const r = sum()
      const holds = Array.isArray(l) || Array.isArray(r) ? (o === '=' ? eq(l, r) : o === '≠' ? !eq(l, r) : false) : typeof l === 'boolean' || typeof r === 'boolean' ? (o === '=' ? l === r : o === '≠' ? l !== r : false) : o === '∣' ? mod(num(r), num(l)) === 0n : o === '=' ? l === r : o === '≠' ? l !== r : o === '≤' ? l <= r : o === '<' ? l < r : o === '≥' ? l >= r : l > r
      parts.push({ text: ts.slice(start, p).map((x) => x.v).join(' '), left: String(l), op: o, right: String(r), holds })
      return holds
    }
    return l
  }
  const neg = (): Value => { if (peek()?.v === '¬') { take(); return !(neg() as boolean) } if (proposition && peek()?.v === '!') { take(); return !asBool(neg()) } return comparison() }
  const conj = (): Value => { let v = neg(); while (peek()?.v === '∧' || (proposition && peek()?.v === '&&')) { const op = take().v; const r = neg(); v = op === '&&' ? asBool(v) && asBool(r) : Boolean(v) && Boolean(r) } return v }
  const disj = (): Value => { let v = conj(); while (peek()?.v === '∨' || (proposition && peek()?.v === '||')) { const op = take().v; const r = conj(); v = op === '||' ? asBool(v) || asBool(r) : Boolean(v) || Boolean(r) } return v }
  const impl = (): Value => { const left = disj(); if (peek()?.v !== '→') return left; take(); const right = impl(); return !asBool(left) || asBool(right) }
  const iff = (): Value => { let v = impl(); while (peek()?.v === '↔') { take(); const right = impl(); v = asBool(v) === asBool(right) } return v }
  // a bounded ∀ b, b < n → P is checked at every b the bound names; any other quantifier stays a quantified statement
  const formula = (): Value => {
    if (!(proposition && peek()?.v === '∀')) return iff()
    take()
    const name = take()
    const refuse = (): never => { throw new Error(PROSE.quantumProcessingExpressions_s1) }
    if (!name || name.t !== 'id') refuse()
    if (peek()?.v === ':') { take(); if (take()?.t !== 'id') refuse() }
    if (take()?.v !== ',') refuse()
    const from = p
    if (!(ts[from]?.v === name.v && (ts[from + 1]?.v === '<' || ts[from + 1]?.v === '≤') && ts[from + 2]?.t === 'num' && ts[from + 3]?.v === '→')) refuse()
    const n = Number(ts[from + 2]!.v)
    if (!Number.isInteger(n) || n < 0 || n > 30) refuse()
    const saved = env[name.v]
    env[name.v] = 0n
    const mark = parts.length
    try { iff() } finally { parts.length = mark; if (saved === undefined) delete env[name.v]; else env[name.v] = saved }
    const body = ts.slice(from, p).map((tok) => tok.v).join(' ')
    const last = ts[from + 1]!.v === '<' ? n - 1 : n
    for (let i = 0; i <= last; i++) if (evaluate(body, { ...env, [name.v]: BigInt(i) }, { proposition: true, functions: [...fns] }).value !== true) return false
    return true
  }
  const value = proposition ? formula() : disj(); if (p < ts.length) throw new Error(`unread ${ts.slice(p).map((x) => x.v).join(' ')}`)
  return { value, parts }
}

const FUNCTION_TYPE = /^(?:Nat|Bool|Int|Prop)(?:\s*→\s*(?:Nat|Bool|Int|Prop))+$/
/** A theorem's statement read back: its variables, its hypotheses and its conclusion, from the Lean text alone. */
export const getStatement = (lean: string) => {
  const head = lean.replace(/ℕ/g, 'Nat').replace(/ℤ/g, 'Int').replace(/^theorem\s+\S+\s*/, '').replace(/\s*:=[\s\S]*$/, '')
  const variables: string[] = [], bools: string[] = [], functions: string[] = [], hypotheses: { name: string; text: string }[] = []
  let rest = head.trim()
  // an implicit type binder ({α : Type*}) is read at ℕ, among its models; an instance binder ([OrderedSub α]) is the model's
  const models: string[] = []
  for (;;) {
    const implicit = /^(?:\{([^{}:]+):\s*Type\*?\}|\[[^[\]]*(?:\[[^[\]]*\][^[\]]*)*\])\s*/.exec(rest)
    if (implicit) { models.push(...(implicit[1]?.trim().split(/\s+/) ?? [])); rest = rest.slice(implicit[0].length); continue }
    const m = /^\(([^():]+):\s*([^()]*(?:\([^()]*\)[^()]*)*)\)\s*/.exec(rest)
    if (!m) break
    const names = m[1]!.trim().split(/\s+/), type = m[2]!.trim()
    if (type === 'Nat' || type === 'Int' || models.includes(type)) variables.push(...names)
    else if (type === 'Bool' || type === 'Prop') { variables.push(...names); bools.push(...names) }
    else if (FUNCTION_TYPE.test(type)) functions.push(...names)
    else if (!/^List\b/.test(type)) hypotheses.push({ name: names[0]!, text: type })
    rest = rest.slice(m[0].length)
  }
  const conclusion = rest.replace(/^:\s*/, '').trim()
  for (const name of `${conclusion} ${hypotheses.map((h) => h.text).join(' ')}`.match(/[A-Za-z_][A-Za-z0-9_']*(?:\.[A-Za-z_][A-Za-z0-9_']*)+/g) ?? []) if (name !== 'Nat.zero' && !FUNCS[name] && !variables.includes(name)) variables.push(name)
  const bounded = /∀\s+[A-Za-z_][\w']*\s*,\s*[A-Za-z_][\w']*\s*[<≤]\s*\d+\s*→/.test(conclusion)
  return { variables, bools, functions, hypotheses, conclusion, quantified: /∃/.test(conclusion) || (/∀/.test(conclusion) && !bounded) }
}

/** The closed instance a general theorem's example lines state, the numbers the kernel checked (`: 2 ^ 9 = 512 := by decide`). */
export const closedOf = (key?: string) => (TEXTBOOK_THEOREMS.find((x) => x.key === key)?.example ?? '').split('\n').map((l) => /^example\s*(:[\s\S]*)$/.exec(l)?.[1]).find((x) => x && /:=\s*by decide$/.test(x))
/** Any textbook theorem evaluated as a tool: values for its variables in, each hypothesis and conjunct computed out, what is missing named. */
export const evaluateTheorem = (key: string, values: Readonly<Record<string, number | string>> = {}) => {
  const t = TEXTBOOK_THEOREMS.find((x) => x.key === key)
  if (!t) return evaluateKernel(key, values)
  // a general theorem asked without values is evaluated at the closed instance its example states
  const instance = Object.keys(values).length ? undefined : closedOf(key)
  const s = getStatement(instance ?? t.lean)
  const env: Env = {}
  for (const [k, v] of Object.entries(values)) { if (!s.variables.includes(k)) continue; const raw = String(v); env[k] = s.bools.includes(k) && (raw === 'true' || raw === 'false') ? raw === 'true' : BigInt(raw) }
  const needs = s.variables.filter((v) => !(v in env))
  const inputSchema = { type: 'object', properties: Object.fromEntries(s.variables.map((v) => [v, s.bools.includes(v) ? { type: 'boolean' } : { type: 'integer', minimum: 0 }])), required: s.variables }, head = { theorem: key, says: t.says, lean: t.lean, ...s, inputSchema }
  const read = { proposition: true, functions: s.functions }
  if (s.quantified) return { ...head, evaluable: false, reason: PROSE.quantumProcessingExpressions_reason2, needs }
  if (needs.length) return { ...head, evaluable: true, needs, computed: null }
  try {
    const hyps = s.hypotheses.map((h) => ({ ...h, ...evaluate(h.text, env, read) }))
    const premises = hyps.every((h) => h.value === true)
    const c = evaluate(s.conclusion, env, read)
    return { ...head, evaluable: true, needs: [], values: Object.fromEntries(Object.entries(env).map(([k, v]) => [k, v.toString()])), hypotheses: hyps.map((h) => ({ name: h.name, text: h.text, holds: h.value === true, parts: h.parts })), premises, conclusion: { text: s.conclusion, holds: c.value === true, parts: c.parts }, holds: !premises || c.value === true, says_now: premises ? (c.value === true ? PROSE.quantumProcessingExpressions_s3 : PROSE.quantumProcessingExpressions_s4) : PROSE.quantumProcessingExpressions_s5 }
  } catch (e) { return { ...head, evaluable: false, reason: (e as Error).message, needs: [] } }
}

// A kernel theorem the textbook does not carry, read back from the statement the kernel printed: its leading ∀ over naturals and booleans
// are its variables and each top-level → before the last a premise. A name the statement does not bind is a Lean definition no evaluator
// here computes, so such a statement is not evaluable and is never given values: an instance is claimed only where every side is computed.
const KEYWORDS = new Set(['true', 'false', 'if', 'then', 'else', 'Nat.zero', 'Nat', 'Int', 'Bool'])
const topLevel = (s: string, sep: string): string[] => {
  const out: string[] = []; let depth = 0, from = 0
  for (let i = 0; i < s.length; i++) { const c = s[i]!; if (c === '(' || c === '[' || c === '{') depth++; else if (c === ')' || c === ']' || c === '}') depth--; else if (depth === 0 && s.startsWith(sep, i)) { out.push(s.slice(from, i).trim()); from = i + sep.length } }
  return [...out, s.slice(from).trim()]
}
/** A kernel theorem's statement as variables, premises and conclusion, or the reason it is not read. */
export const kernelStatement = (key: string) => {
  const t = THEOREMS.find((x) => x.key === key)
  if (!t) throw new Error(`no kernel theorem ${key}`)
  const variables: string[] = [], bools: string[] = []
  let rest = t.statement.replace(/\s+/g, ' ').replace(/ℕ/g, 'Nat').trim()
  const head = { theorem: key, module: t.module, statement: t.statement }
  if (rest.startsWith('∀ ')) {
    rest = rest.slice(2)
    for (;;) { const m = /^\(([^():]+) : (Nat|Bool)\) ?/.exec(rest); if (!m) break; const names = m[1]!.trim().split(' '); variables.push(...names); if (m[2] === 'Bool') bools.push(...names); rest = rest.slice(m[0].length) }
    if (!rest.startsWith(',')) return { ...head, variables, bools, read: false as const, reason: PROSE.quantumProcessingExpressions_kernelBinder }
    rest = rest.slice(1).trim()
  }
  const pieces = topLevel(rest, ' → '), conclusion = pieces.pop()!, hypotheses = pieces.map((text, i) => ({ name: `h${i + 1}`, text }))
  if ([conclusion, ...pieces].some((p) => /[∀∃]/.test(p))) return { ...head, variables, bools, read: false as const, reason: PROSE.quantumProcessingExpressions_reason2 }
  let names: string[]
  try { names = [conclusion, ...pieces].flatMap((p) => tokens(p.replace(/\s*:\s*(?:Int|Nat|Bool)\b/g, '')).filter((k) => k.t === 'id').map((k) => k.v)) } catch (e) { return { ...head, variables, bools, read: false as const, reason: (e as Error).message } }
  const unbound = [...new Set(names.filter((n) => !variables.includes(n) && !KEYWORDS.has(n) && !FUNCS[n]))]
  if (unbound.length) return { ...head, variables, bools, read: false as const, reason: proseFill(PROSE.quantumProcessingExpressions_kernelUnbound, unbound.join(', ')) }
  return { ...head, variables, bools, read: true as const, hypotheses, conclusion }
}
/** A kernel theorem evaluated as a tool, as a textbook theorem is: values for its variables in, each premise and the conclusion computed out. */
export const evaluateKernel = (key: string, values: Readonly<Record<string, number | string>> = {}) => {
  const k = kernelStatement(key)
  if (!k.read) return { ...k, evaluable: false, reason: k.reason, needs: [] as string[] }
  const env: Env = {}
  for (const [name, v] of Object.entries(values)) { if (!k.variables.includes(name)) continue; const raw = String(v); env[name] = k.bools.includes(name) && (raw === 'true' || raw === 'false') ? raw === 'true' : BigInt(raw) }
  const needs = k.variables.filter((v) => !(v in env))
  if (needs.length) return { ...k, evaluable: true, needs, computed: null }
  try {
    const read = { proposition: true }
    const hyps = k.hypotheses.map((h) => ({ ...h, ...evaluate(h.text, env, read) }))
    const premises = hyps.every((h) => h.value === true)
    const c = evaluate(k.conclusion, env, read)
    return { ...k, evaluable: true, needs: [] as string[], values: Object.fromEntries(Object.entries(env).map(([n, v]) => [n, v.toString()])), hypotheses: hyps.map((h) => ({ name: h.name, text: h.text, holds: h.value === true, parts: h.parts })), premises, holds: c.value === true, parts: c.parts }
  } catch (e) { return { ...k, evaluable: false, reason: (e as Error).message, needs: [] as string[] } }
}
/** Values that make a kernel theorem's statement hold with every premise true: closed as it stands, else the first numerals it states. */
export const kernelBinding = (key: string): Record<string, string> | null => {
  const k = kernelStatement(key)
  if (!k.read || k.variables.length > 4) return null
  const fit = (values: Record<string, string>) => { const ev = evaluateKernel(key, values) as { evaluable: boolean; needs: string[]; premises?: boolean; holds?: boolean; values?: Record<string, string> }; return ev.evaluable && !ev.needs.length && ev.premises === true && ev.holds === true ? (ev.values ?? {}) : null }
  if (!k.variables.length) return fit({})
  const stated = numbers(`${k.conclusion} ${k.hypotheses.map((h) => h.text).join(' ')}`).filter((n) => /^\d+$/.test(n) && n.length <= 7)
  const numerals = [...new Set(['1', '0', '2', ...stated])].slice(0, 8)
  const rec = (i: number, acc: Record<string, string>): Record<string, string> | null => {
    if (i === k.variables.length) return fit(acc)
    for (const n of k.bools.includes(k.variables[i]!) ? ['true', 'false'] : numerals) { const hit = rec(i + 1, { ...acc, [k.variables[i]!]: n }); if (hit) return hit }
    return null
  }
  return rec(0, {})
}

/** Values that make a theorem's own sentence hold: the closed ones as they stand, and a theorem with variables by the first
 *  numerals it states (1, then 0, then 2, then the numerals in its statement; a boolean is true, then false) for which every premise holds and the conclusion holds.
 *  A quantified statement, or one whose conclusion the evaluator cannot read, has no such binding. */
export const bindingFor = (key: string): Record<string, string> | null => {
  const fit = (values: Record<string, string>) => {
    try {
      const ev = evaluateTheorem(key, values)
      return 'holds' in ev && ev.evaluable && !ev.needs?.length && ev.premises !== false && ev.holds === true ? (ev.values ?? {}) : null
    } catch { return null }
  }
  const closed = fit({})
  if (closed) return closed
  const t = TEXTBOOK_THEOREMS.find((x) => x.key === key)
  if (!t) return null
  const s = getStatement(t.lean)
  if (s.quantified || !s.variables.length || s.variables.length > 7) return null
  const stated = numbers(`${s.conclusion} ${s.hypotheses.map((h) => h.text).join(' ')}`).filter((n) => /^\d+$/.test(n) && n.length <= 7)
  const wide = s.variables.length > 4
  const numerals = [...new Set(wide ? ['0', '1', ...stated] : ['1', '0', '2', ...stated])].slice(0, wide ? 3 : 10)
  const domain = (v: string) => s.bools.includes(v) ? ['true', 'false'] : numerals
  const rec = (i: number, acc: Record<string, string>): Record<string, string> | null => {
    if (i === s.variables.length) return fit(acc)
    for (const n of domain(s.variables[i]!)) { const hit = rec(i + 1, { ...acc, [s.variables[i]!]: n }); if (hit) return hit }
    return null
  }
  return rec(0, {})
}

/** Every textbook theorem as a tool: closed ones checked side by side, the rest with their inputs named. */
export const listExpressions = () => {
  const rows = TEXTBOOK_THEOREMS.map((t) => { const e = evaluateTheorem(t.key); return { theorem: t.key, variables: e.variables, evaluable: e.evaluable, closed: e.variables.length === 0, holds: 'holds' in e ? e.holds : null, reason: 'reason' in e ? e.reason : null } })
  return { theorems: rows.length, closed: rows.filter((r) => r.closed && r.evaluable).length, withVariables: rows.filter((r) => !r.closed && r.evaluable).length, quantified: rows.filter((r) => !r.evaluable).length, closedHold: rows.filter((r) => r.closed && r.holds === true).length, closedFail: rows.filter((r) => r.closed && r.holds === false).map((r) => r.theorem), rows, theorem: 'textbook_expressions_evaluate' }
}

// The prose audit: each number a text states rests on a textbook expression or is a lead; verdict words beside the Clay problems flagged.
const NUMBER = /(?<![\w./:#-])(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?(?:e[-+]?\d+)?)(?![\w/:-]|\.\w)/gi
const IGNORE = [/https?:\/\/\S+/g, /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, /\b\d{4}-\d{2}-\d{2}(?:T[\d:.]+Z?)?\b/g, /\bv?\d+\.\d+\.\d+\b/g, /\b10\.\d{4,}\/\S+/g, /`[^`]*`/g, /\b(?:RFC|ISO|FIPS|ML-DSA|ML-KEM|SLH-DSA)[ -]?\d+(?:-\d+)?\b/g, /\b(?:19|20)\d{2}\b/g]
// a verdict word beside the Clay problems; "proved by the kernel" states what the kernel accepts and stays
const VERDICT = /\b(Clay|Millennium)\b[^.]{0,120}\b(solved|unsolved|not solved|disproved)\b|\b(solved|unsolved|not solved|disproved)\b[^.]{0,120}\b(Clay|Millennium)\b/i
/** The numbers a text states, read once for the prose audit, the match and the chat: links, addresses, dates, versions, DOIs, code, standards
 *  and years set aside, thousands' commas dropped, a decimal and an exponent kept, a number ending its sentence read. */
export const numbers = (text: string): string[] => { let clean = text; for (const re of IGNORE) clean = clean.replace(re, () => ' '); return [...clean.matchAll(NUMBER)].map((m) => m[1]!.replace(/,/g, () => '')) }
/** The values a theorem states, its variables bound to the values given: both sides of each relation of its conclusion computed (432 % 360 = 72
 *  states 72, never 432), else a side that is a numeral alone. */
export const sides = (lean: string, values: Readonly<Record<string, string>> = {}): string[] => { const env: Env = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, BigInt(v)])); return [...new Set(getStatement(lean).conclusion.split('∧').flatMap((part) => { try { return evaluate(part, env).parts.flatMap((x) => [x.left, x.right]) } catch { return part.split(/[=≠≤≥<>]/).map((x) => x.trim()) } }).filter((x) => /^\d+$/.test(x)))] }
export const getProse = (texts: Readonly<Record<string, string>>, examples: readonly Example[]) => {
  const rows: { text: string; sentence: string; number: string; expression: string | null; by: 'route' | null }[] = []
  const verdicts: { text: string; sentence: string }[] = []
  let sentences = 0
  for (const [name, raw] of Object.entries(texts)) {
    const body = raw.replace(/^---[\s\S]*?---/, '').replace(/```[\s\S]*?```/g, ' ')
    for (const sentence of body.split(/(?<=[.!?])\s+|\n{2,}|\n(?=[-*#|])/).map((x) => x.trim()).filter((x) => x.length > 0)) {
      sentences++
      if (VERDICT.test(sentence)) verdicts.push({ text: name, sentence: sentence })
      const numerals = numbers(sentence).filter((n) => /^\d+$/.test(n) && Number(n) >= 2)
      if (!numerals.length) continue
      // a number rests on the first routed theorem when that theorem computes it, never on a numeral it merely contains
      const route = routeStatement(sentence, examples, 1).theorems
      for (const n of numerals) {
        const byRoute = route.find((t) => sides(closedOf(t.theorem) ?? t.lean).includes(n))?.theorem
        rows.push({ text: name, sentence, number: n, expression: byRoute ?? null, by: byRoute ? 'route' : null })
      }
    }
  }
  const unbacked = rows.filter((r) => !r.expression)
  const id = (kind: string, text: string, sentence: string) => `prose-${kind}-${text.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-${Math.abs([...sentence].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7)).toString(36)}`
  const leads: Lead[] = [
    ...unbacked.map((r) => ({ id: id('number', `${r.text}-${r.number}`, r.sentence), source: r.text, statement: proseFill(PROSE.quantumProcessingExpressions_statement6, r.text, r.number, r.sentence), status: 'open' as const, reason: PROSE.quantumProcessingExpressions_reason7 })),
    ...verdicts.map((v) => ({ id: id('verdict', v.text, v.sentence), source: v.text, statement: proseFill(PROSE.quantumProcessingExpressions_statement8, v.text, v.sentence), status: 'open' as const, reason: PROSE.quantumProcessingExpressions_reason9 })),
  ]
  const byText = Object.fromEntries(Object.keys(texts).map((k) => [k, { numbers: rows.filter((r) => r.text === k).length, backed: rows.filter((r) => r.text === k && r.expression).length }]))
  return { texts: Object.keys(texts).length, sentences, numbers: rows.length, backed: rows.length - unbacked.length, unbacked: unbacked.length, verdicts: verdicts.length, byText, consolidation: rows.filter((r) => r.expression).map((r) => ({ text: r.text, number: r.number, expression: r.expression, call: { tool: 'textbook', arguments: { evaluate: { theorem: r.expression } } } })), leads, theorem: 'textbook_expressions_evaluate', says: proseFill(PROSE.quantumProcessingExpressions_says10, rows.length, sentences, Object.keys(texts).length, rows.length - unbacked.length, unbacked.length, verdicts.length) }
}
