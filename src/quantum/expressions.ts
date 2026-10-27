// The textbook's combinatorial expressions as full-featured tools: every textbook theorem's Lean statement read back as arithmetic — its
// variables (the binders), its hypotheses, its conjuncts — and evaluated exactly, natural numbers in BigInt with Lean's own semantics
// (subtraction truncated at zero, division and remainder floored, a power a power), so a client calls any theorem as a computation:
// with no values a closed statement is checked side by side, with values a statement over variables is computed for them, and what it needs
// is named. The prose audit reads the numbers a text states and finds the expression each one rests on, or leaves a lead.
import { TEXTBOOK_THEOREMS } from './textbook-theorems.js'
import { routeOf } from './match.js'
import type { Example } from './examples.js'
import type { Lead } from './leads.js'

type Tok = { t: 'num' | 'id' | 'op' | 'lp' | 'rp'; v: string }
const OPS = ['≤', '≥', '≠', '<', '>', '=', '∧', '∨', '¬', '+', '-', '*', '/', '%', '^', '→']
const tokens = (s: string): Tok[] => {
  const out: Tok[] = []; let i = 0
  while (i < s.length) {
    const c = s[i]!
    if (/\s/.test(c)) { i++; continue }
    if (c === '(') { out.push({ t: 'lp', v: c }); i++; continue }
    if (c === ')') { out.push({ t: 'rp', v: c }); i++; continue }
    const op = OPS.find((o) => s.startsWith(o, i)); if (op) { out.push({ t: 'op', v: op }); i += op.length; continue }
    const n = /^(0x[0-9a-fA-F]+|\d+)/.exec(s.slice(i)); if (n) { out.push({ t: 'num', v: n[1]! }); i += n[1]!.length; continue }
    const id = /^[A-Za-z_][A-Za-z0-9_.']*/.exec(s.slice(i)); if (id) { out.push({ t: 'id', v: id[0] }); i += id[0].length; continue }
    throw new Error(`unread symbol ${c}`)
  }
  return out
}
type Env = Record<string, bigint>
type Value = bigint | boolean
const FUNCS: Record<string, (a: bigint[]) => bigint> = { 'Nat.gcd': ([a, b]) => { let x = a!, y = b!; while (y) [x, y] = [y, x % y]; return x }, max: ([a, b]) => (a! > b! ? a! : b!), min: ([a, b]) => (a! < b! ? a! : b!), 'Nat.succ': ([a]) => a! + 1n, 'Nat.pred': ([a]) => (a! > 0n ? a! - 1n : 0n) }
/** A recursive-descent evaluator: ∨ < ∧ < ¬ < comparison < + − < × / % < ^ (right) < application < atom; booleans and naturals kept apart. */
export const evaluate = (src: string, env: Env): { value: Value; parts: { text: string; left: string; op: string; right: string; holds: boolean }[] } => {
  const ts = tokens(src); let p = 0; const parts: { text: string; left: string; op: string; right: string; holds: boolean }[] = []
  const peek = () => ts[p], take = () => ts[p++]!
  const num = (v: Value): bigint => { if (typeof v !== 'bigint') throw new Error('a truth where a number is due'); return v }
  const atom = (): Value => {
    const k = take()
    if (!k) throw new Error('the statement ends early')
    if (k.t === 'num') return BigInt(k.v)
    if (k.t === 'lp') { const v = disj(); if (take()?.t !== 'rp') throw new Error('an unclosed parenthesis'); return v }
    if (k.t === 'id') {
      if (k.v === 'true') return true; if (k.v === 'false') return false
      if (FUNCS[k.v]) { const args: bigint[] = []; while (peek() && (peek()!.t === 'num' || peek()!.t === 'lp' || (peek()!.t === 'id' && !FUNCS[peek()!.v]))) args.push(num(atom())); return FUNCS[k.v]!(args) }
      if (k.v in env) return env[k.v]!
      throw new Error(`the variable ${k.v} has no value`)
    }
    throw new Error(`unexpected ${k.v}`)
  }
  const power = (): Value => { const b = atom(); if (peek()?.v === '^') { take(); const e = power(); return num(b) ** num(e) } return b }
  const product = (): Value => { let v = power(); while (peek() && ['*', '/', '%'].includes(peek()!.v)) { const o = take().v; const r = num(power()); v = o === '*' ? num(v) * r : r === 0n ? (o === '/' ? 0n : num(v)) : o === '/' ? num(v) / r : num(v) % r } return v }
  const sum = (): Value => { let v = product(); while (peek() && ['+', '-'].includes(peek()!.v)) { const o = take().v; const r = num(product()); v = o === '+' ? num(v) + r : num(v) - r < 0n ? 0n : num(v) - r } return v }
  const comparison = (): Value => {
    const start = p; const l = sum()
    const o = peek()?.v
    if (o && ['=', '≠', '≤', '<', '≥', '>'].includes(o)) {
      take(); const r = sum()
      const holds = typeof l === 'boolean' || typeof r === 'boolean' ? (o === '=' ? l === r : o === '≠' ? l !== r : false) : o === '=' ? l === r : o === '≠' ? l !== r : o === '≤' ? l <= r : o === '<' ? l < r : o === '≥' ? l >= r : l > r
      parts.push({ text: ts.slice(start, p).map((x) => x.v).join(' '), left: String(l), op: o, right: String(r), holds })
      return holds
    }
    return l
  }
  const neg = (): Value => { if (peek()?.v === '¬') { take(); return !(neg() as boolean) } return comparison() }
  const conj = (): Value => { let v = neg(); while (peek()?.v === '∧') { take(); const r = neg(); v = Boolean(v) && Boolean(r) } return v }
  const disj = (): Value => { let v = conj(); while (peek()?.v === '∨') { take(); const r = conj(); v = Boolean(v) || Boolean(r) } return v }
  const value = disj(); if (p < ts.length) throw new Error(`unread ${ts.slice(p).map((x) => x.v).join(' ')}`)
  return { value, parts }
}

/** A theorem's statement read back: its variables, its hypotheses and its conclusion, from the Lean text alone. */
export const statementOf = (lean: string) => {
  const head = lean.replace(/^theorem\s+\S+\s*/, '').replace(/\s*:=[\s\S]*$/, '')
  const variables: string[] = [], hypotheses: { name: string; text: string }[] = []
  let rest = head.trim()
  for (;;) {
    const m = /^\(([^():]+):\s*([^()]*(?:\([^()]*\)[^()]*)*)\)\s*/.exec(rest)
    if (!m) break
    const names = m[1]!.trim().split(/\s+/), type = m[2]!.trim()
    if (type === 'Nat' || type === 'Bool') variables.push(...names); else hypotheses.push({ name: names[0]!, text: type })
    rest = rest.slice(m[0].length)
  }
  const conclusion = rest.replace(/^:\s*/, '').trim()
  return { variables, hypotheses, conclusion, quantified: /∀|∃|→/.test(conclusion) }
}

/** Any textbook theorem evaluated as a tool: values for its variables in, each hypothesis and conjunct computed out, what is missing named. */
export const evaluateOf = (key: string, values: Readonly<Record<string, number | string>> = {}) => {
  const t = TEXTBOOK_THEOREMS.find((x) => x.key === key)
  if (!t) throw new Error(`no textbook theorem ${key}`)
  const s = statementOf(t.lean)
  const env: Env = Object.fromEntries(Object.entries(values).filter(([k]) => s.variables.includes(k)).map(([k, v]) => [k, BigInt(String(v))]))
  const needs = s.variables.filter((v) => !(v in env))
  const inputSchema = { type: 'object', properties: Object.fromEntries(s.variables.map((v) => [v, { type: 'integer', minimum: 0 }])), required: s.variables }, head = { theorem: key, says: t.says, lean: t.lean, ...s, inputSchema }
  if (s.quantified) return { ...head, evaluable: false, reason: 'a quantified or implication statement: the kernel proves it for all values; evaluate it by its instances', needs }
  if (needs.length) return { ...head, evaluable: true, needs, computed: null }
  try {
    const hyps = s.hypotheses.map((h) => ({ ...h, ...evaluate(h.text, env) }))
    const premises = hyps.every((h) => h.value === true)
    const c = evaluate(s.conclusion, env)
    return { ...head, evaluable: true, needs: [], values: Object.fromEntries(Object.entries(env).map(([k, v]) => [k, v.toString()])), hypotheses: hyps.map((h) => ({ name: h.name, text: h.text, holds: h.value === true, parts: h.parts })), premises, conclusion: { text: s.conclusion, holds: c.value === true, parts: c.parts }, holds: !premises || c.value === true, says_now: premises ? (c.value === true ? 'the premises hold and so does the conclusion, as the kernel proved' : 'the premises hold and the conclusion fails: the statement does not match the kernel') : 'a premise fails for these values: the theorem says nothing about them' }
  } catch (e) { return { ...head, evaluable: false, reason: (e as Error).message, needs: [] } }
}

/** Every textbook theorem as a tool: closed ones checked side by side, the rest with their inputs named. */
export const expressionsOf = () => {
  const rows = TEXTBOOK_THEOREMS.map((t) => { const e = evaluateOf(t.key); return { theorem: t.key, variables: e.variables, evaluable: e.evaluable, closed: e.variables.length === 0, holds: 'holds' in e ? e.holds : null, reason: 'reason' in e ? e.reason : null } })
  return { theorems: rows.length, closed: rows.filter((r) => r.closed && r.evaluable).length, withVariables: rows.filter((r) => !r.closed && r.evaluable).length, quantified: rows.filter((r) => !r.evaluable).length, closedHold: rows.filter((r) => r.closed && r.holds === true).length, closedFail: rows.filter((r) => r.closed && r.holds === false).map((r) => r.theorem), rows, theorem: 'textbook_expressions_evaluate' }
}

// The prose audit: the numbers a text states, each resting on an expression of the textbook or left as a lead; verdict words beside the Clay problems flagged.
const NUMBER = /(?<![\w./:#-])(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)(?![\w./:-]|\.\d)/g
const IGNORE = [/https?:\/\/\S+/g, /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, /\b\d{4}-\d{2}-\d{2}(?:T[\d:.]+Z?)?\b/g, /\bv?\d+\.\d+\.\d+\b/g, /\b10\.\d{4,}\/\S+/g, /`[^`]*`/g, /\b(?:RFC|ISO|FIPS|ML-DSA|ML-KEM|SLH-DSA)[ -]?\d+(?:-\d+)?\b/g, /\b(?:19|20)\d{2}\b/g]
// a verdict is solved, unsolved, not solved or disproved beside the Clay problems; "proved by the kernel" states what the kernel accepts and stays
const VERDICT = /\b(Clay|Millennium)\b[^.]{0,120}\b(solved|unsolved|not solved|disproved)\b|\b(solved|unsolved|not solved|disproved)\b[^.]{0,120}\b(Clay|Millennium)\b/i
export const proseOf = (texts: Readonly<Record<string, string>>, examples: readonly Example[]) => {
  const numbersOfTheorem = new Map(TEXTBOOK_THEOREMS.map((t) => [t.key, new Set([...t.lean.replace(/^theorem\s+\S+/, '').matchAll(/\d+/g)].map((m) => m[0]))]))
  const rows: { text: string; sentence: string; number: string; expression: string | null; by: 'route' | 'number' | null }[] = []
  const verdicts: { text: string; sentence: string }[] = []
  let sentences = 0
  for (const [name, raw] of Object.entries(texts)) {
    const body = raw.replace(/^---[\s\S]*?---/, '').replace(/```[\s\S]*?```/g, ' ')
    for (const sentence of body.split(/(?<=[.!?])\s+|\n{2,}|\n(?=[-*#|])/).map((x) => x.trim()).filter((x) => x.length > 0)) {
      sentences++
      if (VERDICT.test(sentence)) verdicts.push({ text: name, sentence: sentence.slice(0, 200) })
      let clean = sentence; for (const re of IGNORE) clean = clean.replace(re, ' ')
      const numbers = [...clean.matchAll(NUMBER)].map((m) => m[1]!.replace(/,/g, '')).filter((n) => !/\./.test(n) && Number(n) >= 2)
      if (!numbers.length) continue
      const route = routeOf(sentence, examples, 8).theorems.map((t) => t.theorem)
      for (const n of numbers) {
        const byRoute = route.find((k) => numbersOfTheorem.get(k)?.has(n))
        const byNumber = byRoute ? undefined : TEXTBOOK_THEOREMS.find((t) => numbersOfTheorem.get(t.key)!.has(n) && route.length > 0 && t.key === route[0])
        rows.push({ text: name, sentence: sentence.slice(0, 200), number: n, expression: byRoute ?? byNumber?.key ?? null, by: byRoute ? 'route' : byNumber ? 'number' : null })
      }
    }
  }
  const unbacked = rows.filter((r) => !r.expression)
  const idOf = (kind: string, text: string, sentence: string) => `prose-${kind}-${text.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-${Math.abs([...sentence].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7)).toString(36)}`
  const leads: Lead[] = [
    ...unbacked.map((r) => ({ id: idOf('number', `${r.text}-${r.number}`, r.sentence), source: r.text, statement: `${r.text} states ${r.number} in "${r.sentence.slice(0, 120)}" and no textbook expression it reaches states it`, status: 'open' as const, reason: 'a number in prose rests on an expression the kernel accepts, or it is a convention to state as one' })),
    ...verdicts.map((v) => ({ id: idOf('verdict', v.text, v.sentence), source: v.text, statement: `${v.text} carries a verdict word beside the Clay problems: "${v.sentence.slice(0, 140)}"`, status: 'open' as const, reason: 'the tree states only what the kernel accepts; match and compete decide, never prose' })),
  ]
  const byText = Object.fromEntries(Object.keys(texts).map((k) => [k, { numbers: rows.filter((r) => r.text === k).length, backed: rows.filter((r) => r.text === k && r.expression).length }]))
  return { texts: Object.keys(texts).length, sentences, numbers: rows.length, backed: rows.length - unbacked.length, unbacked: unbacked.length, verdicts: verdicts.length, byText, consolidation: rows.filter((r) => r.expression).map((r) => ({ text: r.text, number: r.number, expression: r.expression, call: { tool: 'textbook', arguments: { evaluate: { theorem: r.expression } } } })), leads, theorem: 'textbook_expressions_evaluate', says: `${rows.length} number(s) in ${sentences} sentence(s) of ${Object.keys(texts).length} text(s): ${rows.length - unbacked.length} rest on a textbook expression a client can evaluate, ${unbacked.length} are leads; ${verdicts.length} verdict word(s) beside the Clay problems` }
}
