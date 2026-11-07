// Alpine directives, magics, globals and first-party plugins. The OS is imported from its source.
// A name that does not run is an exit, and an entries row covers that exit. Nothing here fetches the upstream.

import os from '../os/alpine/index.ts'
import { portPackages, type PackageAsk } from '../os/alpine/packages.ts'
import { lintExpression, type EslintFinding } from '../os/eslint.ts'
import { entriesCover } from '../payload/index.ts'
import { uuid } from '../uuid/index.ts'
import type { Lead } from './leads.ts'

type Val = string | number | boolean | null | Val[] | { [k: string]: Val }
type Scope = Record<string, Val>

/** The documented surface. Names are the docs' own pages and headings, not the undocumented internals. */
const DIRECTIVES = ['x-data', 'x-init', 'x-show', 'x-bind', 'x-on', 'x-text', 'x-html', 'x-model', 'x-modelable', 'x-for', 'x-transition', 'x-effect', 'x-ignore', 'x-ref', 'x-cloak', 'x-teleport', 'x-if', 'x-id'] as const
const MAGICS = ['$el', '$refs', '$store', '$watch', '$dispatch', '$nextTick', '$root', '$data', '$id'] as const
const GLOBALS = ['Alpine.data', 'Alpine.store', 'Alpine.bind', 'Alpine.start', 'Alpine.plugin', 'Alpine.directive', 'Alpine.magic', 'Alpine.effect', 'Alpine.reactive', 'Alpine.addScopeToNode', 'Alpine.deferInit', 'Alpine.interceptInit'] as const
const PLUGINS: readonly { name: string; symbols: readonly string[] }[] = [
  { name: 'anchor', symbols: ['x-anchor'] },
  { name: 'collapse', symbols: ['x-collapse'] },
  { name: 'focus', symbols: ['x-trap', '$focus'] },
  { name: 'intersect', symbols: ['x-intersect'] },
  { name: 'mask', symbols: ['x-mask'] },
  { name: 'morph', symbols: ['Alpine.morph', 'Alpine.morphBetween'] },
  { name: 'persist', symbols: ['$persist', 'Alpine.$persist'] },
  { name: 'resize', symbols: ['x-resize'] },
  { name: 'sort', symbols: ['x-sort', '$item', '$position'] },
]

/** A name is ported when this handler runs it. A name that runs once is partial. Any other documented name is a gap, and that gap is an exit. */
const PORTED = new Set<string>(['x-data', 'x-init', 'x-show', 'x-bind', 'x-on', 'x-text', 'x-for', 'x-model', 'x-id', 'x-ignore', 'x-if', '$data', '$store', '$id', 'Alpine.data', 'Alpine.store', 'Alpine.bind'])
const PARTIAL = new Set<string>(['x-effect', 'Alpine.effect', 'Alpine.reactive'])

const WHY: Record<string, string> = {
  'x-html': 'inserts markup into the document; this handler admits no markup',
  'x-modelable': 'binds two components through the document',
  'x-transition': 'animates an element in the document',
  'x-effect': 'runs once here; nothing re-runs it when the scope changes',
  'x-ref': 'names an element in the document',
  'x-cloak': 'hides an element until the document starts',
  'x-teleport': 'moves an element in the document',
  '$el': 'the element itself',
  '$refs': 'the named elements',
  '$watch': 're-runs when a value changes',
  '$dispatch': 'fires an event on the document',
  '$nextTick': 'waits for the document to paint',
  '$root': 'the component\'s root element',
  'Alpine.start': 'walks the document; this handler has no document',
  'Alpine.plugin': 'loads a plugin into the document runtime',
  'Alpine.directive': 'registers a directive the document walks',
  'Alpine.magic': 'registers a magic the document evaluates',
  'Alpine.effect': 'runs once here; the dependency reactor is not ported',
  'Alpine.reactive': 'the object is kept; the proxy that tracks dependencies is not ported',
  'Alpine.addScopeToNode': 'attaches a scope to a document node',
  'Alpine.deferInit': 'defers the document\'s start',
  'Alpine.interceptInit': 'hooks the document\'s start',
}

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const leadFor = (name: string, why: string, source: string, status: 'open' | 'partial' = 'open'): Lead => {
  const formula = `${name} is still to port: ${why}`
  return {
    id: `alpine-${slug(name)}`,
    source,
    statement: formula,
    status,
    tool: 'payload',
    reason: why,
    run: { tool: 'payload', arguments: { develop: { formula, product: 'alpine', variant: name } } },
  }
}

type SymbolRow = { name: string; kind: 'directive' | 'magic' | 'global' | 'plugin'; plugin: string | null; ported: 'full' | 'partial' | 'gap'; onto: string | null }

const rows = (): SymbolRow[] => {
  const one = (name: string, kind: SymbolRow['kind'], plugin: string | null): SymbolRow => {
    const ported = PORTED.has(name) ? 'full' as const : PARTIAL.has(name) ? 'partial' as const : 'gap' as const
    const onto = ported === 'gap' ? null : 'qpu browser quantum os'
    return { name, kind, plugin, ported, onto }
  }
  return [
    ...DIRECTIVES.map((name) => one(name, 'directive', null)),
    ...MAGICS.map((name) => one(name, 'magic', null)),
    ...GLOBALS.map((name) => one(name, 'global', null)),
    ...PLUGINS.flatMap((p) => p.symbols.map((name) => one(name, 'plugin', p.name))),
  ]
}

/** The whole documented surface. What is ported, what runs once, and the gaps, each gap a lead to develop next. */
export const listAlpine = () => {
  const symbols = rows()
  const ported = symbols.filter((s) => s.ported === 'full').length
  const partial = symbols.filter((s) => s.ported === 'partial').length
  const gaps = symbols.filter((s) => s.ported === 'gap').length
  const leads = symbols.filter((s) => s.ported !== 'full').map((s) => leadFor(s.name, WHY[s.name] ?? `the ${s.plugin ?? s.kind} ${s.name} needs the document`, os.upstream, s.ported === 'partial' ? 'partial' : 'open'))
  const total = symbols.length
  const cover = entriesCover(leads.map((l) => ({ from: l.id, body: { status: l.status, name: (l.run?.arguments as { develop?: { variant?: string } } | undefined)?.develop?.variant ?? l.id } })))
  const complete = ported === total && partial === 0 && gaps === 0 && leads.length === 0
  return {
    phase: 'alpine' as const,
    source: os.source,
    upstream: os.upstream,
    symbols, total, ported, partial, gaps, leads,
    next: leads.map((l) => l.run),
    cover,
    holds: ported + partial + gaps === total && leads.length === partial + gaps && cover.holds && cover.exits === leads.length && cover.uncovered === 0,
    os: { ...os, complete },
    says: `${total} Alpine names on ${os.name}. ${ported} run here, ${partial} run once, ${gaps} do not. ${cover.entries.length} entries cover ${cover.exits} exits.`,
  }
}

const banned = new Set(['__proto__', 'constructor', 'prototype'])

class Gap extends Error {}

const isObj = (v: unknown): v is Record<string, Val> => v !== null && typeof v === 'object' && !Array.isArray(v)

const read = (root: Val, parts: readonly string[]): Val => {
  let cur: Val = root
  for (const part of parts) {
    if (banned.has(part)) throw new Gap(`${part} is not a path`)
    if (Array.isArray(cur)) { const n = Number(part); if (!Number.isInteger(n) || String(n) !== part) throw new Gap(`${part} is not an index`); cur = cur[n] ?? null; continue }
    if (!isObj(cur) || !Object.hasOwn(cur, part)) return null
    cur = cur[part] ?? null
  }
  return cur
}

const write = (scope: Scope, parts: readonly string[], value: Val): Scope => {
  if (parts.length === 0 || parts.some((p) => banned.has(p) || p.startsWith('$'))) throw new Gap('that assignment is not a scope path')
  const next: Scope = { ...scope }
  if (parts.length === 1) { next[parts[0]!] = value; return next }
  const head = parts[0]!
  const child = isObj(next[head]) ? { ...(next[head] as Scope) } : {}
  next[head] = child as Val
  let cur = child
  for (let i = 1; i < parts.length - 1; i++) {
    const key = parts[i]!
    const inner = isObj(cur[key]) ? { ...(cur[key] as Scope) } : {}
    cur[key] = inner as Val
    cur = inner
  }
  cur[parts[parts.length - 1]!] = value
  return next
}

type Node = { id: string; ref: string | null; parent: string | null; html: string; text: string; cloak: boolean; show: boolean }
type Os = {
  root: string
  nodes: Node[]
  refs: Scope
  events: { name: string; detail: Val | null }[]
  focus: string | null
  started: boolean
  defer: boolean
  plugins: string[]
  directives: string[]
  magics: string[]
  magicValues: Scope
  tick: string[]
  watches: { path: string; before: Val }[]
  persisted: Scope
  eslint: { checked: number; findings: EslintFinding[] }
}
const freshOs = (root: string): Os => ({ root, nodes: [{ id: root, ref: null, parent: null, html: '', text: '', cloak: false, show: true }], refs: {}, events: [], focus: null, started: false, defer: false, plugins: [], directives: [], magics: [], magicValues: {}, tick: [], watches: [], persisted: {}, eslint: { checked: 0, findings: [] } })
const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
const applyMask = (mask: string, value: string) => {
  const chars = value.replace(/[^0-9A-Za-z]/g, '')
  let at = 0, out = ''
  for (const c of mask) {
    if (c === '9' || c === 'a' || c === '*') { const ch = chars[at++]; if (!ch) break; if (c === '9' && !/[0-9]/.test(ch)) break; if (c === 'a' && !/[A-Za-z]/.test(ch)) break; out += ch; continue }
    out += c
  }
  return out
}
const idsOf = (xs: unknown) => Array.isArray(xs) ? xs.map((x) => typeof x === 'string' ? x : isObj(x) && typeof (x as { id?: unknown }).id === 'string' ? (x as { id: string }).id : '').filter((id) => id.length > 0) : []
type Frame = { scope: Scope; stores: Scope; os: Os }

const evaluate = (source: string, frame: Frame): { value: Val; scope: Scope } => {
  const s = source.trim()
  let i = 0
  const skip = () => { while (s[i] === ' ') i++ }
  const gap = (why: string): never => { throw new Gap(why) }
  const lint = lintExpression(s, Object.keys(frame.scope))
  frame.os.eslint.checked += 1
  if (!lint.clean) { frame.os.eslint.findings.push(...lint.findings); gap(lint.findings.map((finding) => finding.message).join(' ')) }
  const pathOf = (): string[] => {
    skip()
    const start = i
    if (!/[A-Za-z_$]/.test(s[i] ?? '')) gap('an expression needs a name or a value')
    while (/[\w$]/.test(s[i] ?? '')) i++
    const parts = [s.slice(start, i)]
    for (;;) {
      if (s[i] === '.') { i++; const from = i; while (/[\w$]/.test(s[i] ?? '')) i++; if (i === from) gap('a dot needs a name'); parts.push(s.slice(from, i)); continue }
      if (s[i] === '[') { i++; skip(); const from = i; while (/[0-9]/.test(s[i] ?? '')) i++; if (i === from || s[i] !== ']') gap('an index is digits in brackets'); parts.push(s.slice(from, i)); i++; continue }
      break
    }
    return parts
  }
  const lookup = (parts: string[]): Val => {
    const head = parts[0]!
    if (head === '$data') return parts.length === 1 ? frame.scope as unknown as Val : read(frame.scope as unknown as Val, parts.slice(1))
    if (head === '$store') return parts.length === 1 ? frame.stores as unknown as Val : read(frame.stores as unknown as Val, parts.slice(1))
    if (head === '$el' || head === '$root') return frame.os.root
    if (head === '$refs') return parts.length === 1 ? frame.os.refs as unknown as Val : read(frame.os.refs as unknown as Val, parts.slice(1))
    if (head === '$persist') return parts.length === 1 ? frame.os.persisted as unknown as Val : read(frame.os.persisted as unknown as Val, parts.slice(1))
    if (head === '$focus') return frame.os.focus
    if (head === 'Alpine' && parts[1] === '$persist') return parts.length === 2 ? frame.os.persisted as unknown as Val : read(frame.os.persisted as unknown as Val, parts.slice(2))
    if (frame.os.magics.includes(head)) return read(frame.os.magicValues as unknown as Val, parts)
    if (head === '$id') gap('$id takes a name in quotes')
    if (head.startsWith('$')) gap(`${head} is not ported`)
    return read(frame.scope as unknown as Val, parts)
  }
  const primary = (): Val => {
    skip()
    const c = s[i]
    if (c === undefined) gap('the expression ended early')
    if (c === '(') { i++; const v = or(); skip(); if (s[i] !== ')') gap('a parenthesis was not closed'); i++; return v }
    if (c === "'" || c === '"') { const q = c; i++; let out = ''; while (s[i] !== undefined && s[i] !== q) { if (s[i] === '\\') { i++; out += s[i] ?? ''; i++; continue } out += s[i]; i++ } if (s[i] !== q) gap('a string was not closed'); i++; return out }
    if (c === '[') { i++; const xs: Val[] = []; skip(); if (s[i] === ']') { i++; return xs } for (;;) { xs.push(or()); skip(); if (s[i] === ']') { i++; return xs } if (s[i] !== ',') gap('an array needs a comma'); i++ } }
    if (/[0-9-]/.test(c) && !(c === '-' && /[A-Za-z_(]/.test(s[i + 1] ?? ''))) { const from = i; if (s[i] === '-') i++; while (/[0-9]/.test(s[i] ?? '')) i++; if (s[i] === '.') { i++; while (/[0-9]/.test(s[i] ?? '')) i++ } const n = Number(s.slice(from, i)); if (!Number.isFinite(n)) gap('not a number'); return n }
    if (s.startsWith('true', i) && !/[\w$]/.test(s[i + 4] ?? '')) { i += 4; return true }
    if (s.startsWith('false', i) && !/[\w$]/.test(s[i + 5] ?? '')) { i += 5; return false }
    if (s.startsWith('null', i) && !/[\w$]/.test(s[i + 4] ?? '')) { i += 4; return null }
    const parts = pathOf()
    skip()
    if (s[i] === '(') {
      const head = parts[0]!
      const args = (): Val[] => { i++; const xs: Val[] = []; skip(); if (s[i] === ')') { i++; return xs } for (;;) { xs.push(or()); skip(); if (s[i] === ')') { i++; return xs } if (s[i] !== ',') gap('a call needs a comma'); i++ } }
      if (head === '$id' && parts.length === 1) { const xs = args(); const name = xs[0]; if (typeof name !== 'string') gap('$id takes a name in quotes'); return uuid(`alpine-id:${name}`) }
      if (head === '$dispatch' && parts.length === 1) { const xs = args(); if (typeof xs[0] !== 'string') gap('$dispatch takes a name'); frame.os.events.push({ name: xs[0], detail: (xs[1] ?? null) as Val }); return null }
      if (head === '$nextTick' && parts.length === 1) { const xs = args(); if (typeof xs[0] !== 'string') gap('$nextTick takes an expression'); frame.os.tick.push(xs[0]); return null }
      if (head === '$watch' && parts.length === 1) { const xs = args(); if (typeof xs[0] !== 'string') gap('$watch takes a path'); const before = read(frame.scope as unknown as Val, xs[0].split('.')); frame.os.watches.push({ path: xs[0], before }); return before }
      if (head === '$focus' && parts.length === 1) { const xs = args(); const id = typeof xs[0] === 'string' ? xs[0] : frame.os.root; frame.os.focus = id; return id }
      gap(`${head} calls a function; a function call is not ported`)
    }
    return lookup(parts)
  }
  const unary = (): Val => { skip(); if (s[i] === '!') { i++; return !unary() } if (s[i] === '-' && /[0-9(]/.test(s[i + 1] ?? '') === false && s[i + 1] !== ' ') { i++; const v = unary(); if (typeof v !== 'number') gap('minus takes a number'); return -v } return primary() }
  const mul = (): Val => { let v = unary(); for (;;) { skip(); const op = s[i]; if (op !== '*' && op !== '/') break; i++; const r = unary(); if (typeof v !== 'number' || typeof r !== 'number') gap('arithmetic takes numbers'); v = op === '*' ? v * r : r === 0 ? gap('division by zero') : v / r } return v }
  const add = (): Val => { let v = mul(); for (;;) { skip(); const op = s[i]; if ((op !== '+' && op !== '-') || s[i + 1] === '=') break; i++; const r = mul(); if (typeof v === 'string' || typeof r === 'string') { if (op !== '+') gap('strings only add'); v = String(v) + String(r); continue } if (typeof v !== 'number' || typeof r !== 'number') gap('arithmetic takes numbers'); v = op === '+' ? v + r : v - r } return v }
  const rel = (): Val => { let v = add(); for (;;) { skip(); const op = s.startsWith('<=', i) ? '<=' : s.startsWith('>=', i) ? '>=' : s[i] === '<' ? '<' : s[i] === '>' ? '>' : ''; if (!op) break; i += op.length; const r = add(); if (typeof v === 'number' && typeof r === 'number') v = op === '<' ? v < r : op === '>' ? v > r : op === '<=' ? v <= r : v >= r; else v = op === '<' || op === '>' ? false : gap('that comparison is not two numbers'); } return v }
  const eq = (): Val => { let v = rel(); for (;;) { skip(); const op = s.startsWith('===', i) || s.startsWith('!==', i) ? gap('use == and !=') : s.startsWith('==', i) ? '==' : s.startsWith('!=', i) ? '!=' : ''; if (!op) break; i += 2; const r = rel(); v = op === '==' ? v === r : v !== r } return v }
  const and = (): Val => { let v = eq(); for (;;) { skip(); if (!s.startsWith('&&', i)) break; i += 2; const r = eq(); v = Boolean(v) && Boolean(r) } return v }
  const or = (): Val => { let v = and(); for (;;) { skip(); if (s.startsWith('||', i)) { i += 2; const r = and(); v = Boolean(v) || Boolean(r); continue } if (s[i] === '?') { i++; const yes = or(); skip(); if (s[i] !== ':') gap('a ternary needs a colon'); i++; const no = or(); v = v ? yes : no; continue } break } return v }
  const assigned = (): { value: Val; scope: Scope } => {
    skip()
    const mark = i
    if (/[A-Za-z_]/.test(s[i] ?? '')) {
      const parts = pathOf()
      skip()
      if (s[i] === '=' && s[i + 1] !== '=') { i++; const value = or(); skip(); if (i !== s.length) gap('the expression did not end'); return { value, scope: write(frame.scope, parts, value) } }
      i = mark
    }
    const value = or()
    skip()
    if (i !== s.length) gap(`unported at ${s.slice(i, i + 12)}`)
    return { value, scope: frame.scope }
  }
  return assigned()
}

const base = (key: string) => key.split(':')[0]!

type Run = { directives?: Record<string, unknown>; stores?: Record<string, unknown>; data?: Record<string, unknown>; bind?: Record<string, Record<string, unknown>>; model?: unknown; children?: unknown[]; tree?: unknown[]; from?: unknown[]; to?: unknown[]; order?: number[]; size?: { width?: number; height?: number }; visible?: boolean; persist?: Record<string, unknown>; magics?: Record<string, unknown>; start?: boolean }

const asScope = (v: unknown, name: string): Scope => {
  if (!isObj(v)) throw new Error(`${name} is an object`)
  return v as Scope
}

/** One component on the browser OS. Every documented directive reads and writes that OS. A name that does not run is still a lead. */
const runAlpine = (raw: Run, depth = 0) => {
  const stores = asScope(raw.stores ?? {}, 'stores')
  const registry = asScope(raw.data ?? {}, 'data')
  const binds = raw.bind ?? {}
  const browser = freshOs(uuid(`alpine-root\n${Object.keys(raw.directives ?? {}).join('\n')}`))
  browser.persisted = asScope(raw.persist ?? {}, 'persist')
  browser.magicValues = asScope(raw.magics ?? {}, 'magics')
  const node = browser.nodes[0]!
  let scope: Scope = {}
  const ran: string[] = []
  const leads: Lead[] = []
  const out: Record<string, Val> = {}
  const note = (name: string, why: string, status: 'open' | 'partial' = 'open') => { if (!leads.some((l) => (l.run?.arguments as { develop?: { variant?: string } } | undefined)?.develop?.variant === name)) leads.push(leadFor(name, why, os.upstream, status)) }
  const runExpr = (name: string, expr: string) => {
    try { const got = evaluate(expr, { scope, stores, os: browser }); scope = got.scope; ran.push(name); return got.value }
    catch (e) { if (e instanceof Gap) { note(name, e.message); return null } throw e }
  }
  const settle = (name: string, expr: string) => {
    let prev = JSON.stringify(scope)
    for (let n = 0; n < 8; n++) { runExpr(name, expr); const now = JSON.stringify(scope); if (now === prev) return; prev = now }
    note(name, 'the effect did not settle')
  }
  const dirs = raw.directives ?? {}
  const keys = Object.keys(dirs)
  const dataKey = keys.find((k) => base(k) === 'x-data')
  if (dataKey) {
    const text = String(dirs[dataKey])
    try { const parsed = JSON.parse(text) as unknown; if (!isObj(parsed)) throw new Error('not an object'); scope = parsed as Scope; ran.push('x-data') }
    catch { const named = registry[text.trim()]; if (isObj(named)) { scope = { ...named }; ran.push('Alpine.data') } else note('x-data', 'x-data is a JSON object or a name Alpine.data registered; a JavaScript object literal is not ported') }
  }
  const ignore = keys.some((k) => base(k) === 'x-ignore')
  if (ignore) ran.push('x-ignore')
  if (!ignore) {
    for (const key of keys) {
      const name = base(key)
      const expr = String(dirs[key] ?? '')
      if (name === 'x-data' || name === 'x-ignore') continue
      if (PARTIAL.has(name)) { if (expr) runExpr(name, expr); note(name, WHY[name] ?? `${name} runs once`, 'partial'); continue }
      if (!PORTED.has(name)) { note(name, WHY[name] ?? `${name} does not run here`); continue }
      if (name === 'Alpine.plugin') { if (expr.trim()) browser.plugins.push(expr.trim()); ran.push(name); continue }
      if (name === 'Alpine.directive') { if (expr.trim()) browser.directives.push(expr.trim()); ran.push(name); continue }
      if (name === 'Alpine.magic') { if (expr.trim()) browser.magics.push(expr.trim()); ran.push(name); continue }
      if (name === 'Alpine.deferInit') { browser.defer = true; ran.push(name); continue }
      if (name === 'Alpine.interceptInit') { runExpr(name, expr); continue }
      if (name === 'Alpine.reactive') { try { const parsed = JSON.parse(expr) as unknown; if (isObj(parsed)) scope = { ...scope, ...parsed }; ran.push(name) } catch { note(name, 'Alpine.reactive takes a JSON object') } continue }
      if (name === 'Alpine.start' || (name === 'x-init' && raw.start === true)) { browser.started = true; browser.defer = false; ran.push(name === 'Alpine.start' ? 'Alpine.start' : name); if (name === 'Alpine.start') continue }
      if (name === 'x-init' || name === 'x-on') { runExpr(name, expr); continue }
      if (name === 'x-effect' || name === 'Alpine.effect') { settle(name, expr); continue }
      if (name === 'x-text') { const v = runExpr(name, expr); if (v !== null || ran.includes(name)) { const text = v === null ? '' : String(v as Val); out.text = text; node.text = text } continue }
      if (name === 'x-html') { const v = runExpr(name, expr); if (v !== null || ran.includes(name)) { const html = escapeHtml(v === null ? '' : String(v as Val)); out.html = html; node.html = html } continue }
      if (name === 'x-show' || name === 'x-if' || name === 'x-collapse') { const v = runExpr(name, expr); const on = Boolean(v); out[name === 'x-show' ? 'show' : name === 'x-if' ? 'when' : 'collapse'] = on; if (name === 'x-show') node.show = on; continue }
      if (name === 'x-transition') { out.transition = { name: expr || null, show: node.show } as Val; ran.push(name); continue }
      if (name === 'x-bind') { if (isObj(binds[expr])) { for (const [k, value] of Object.entries(binds[expr] as Record<string, unknown>)) { if (typeof value === 'string' && k.startsWith('x-')) runExpr(base(k), value); else out[k] = value as Val } ran.push('Alpine.bind'); continue } const v = runExpr('x-bind', expr); out[key.slice('x-bind'.length).replace(/^:/, '') || 'bind'] = v; continue }
      if (name === 'x-for') { const m = /^([A-Za-z_][\w]*) in (.+)$/.exec(expr.trim()); if (!m) { note('x-for', 'x-for is `name in list`'); continue } const list = runExpr('x-for', m[2]!); out.rows = Array.isArray(list) ? list.map((item) => ({ [m[1]!]: item })) as Val : []; continue }
      if (name === 'x-model' || name === 'x-modelable') { if (raw.model !== undefined) { try { scope = write(scope, expr.trim().split('.'), raw.model as Val); ran.push(name) } catch (e) { if (e instanceof Gap) note(name, e.message); else throw e } } else runExpr(name, expr); continue }
      if (name === 'x-id') { const v = runExpr('$id', expr.startsWith('[') ? expr : `'${expr.replace(/'/g, '')}'`); out.id = typeof v === 'string' ? v : uuid(`alpine-id:${expr}`); ran.push('x-id'); continue }
      if (name === 'x-ref') { node.ref = expr; browser.refs[expr] = node.id; out.refs = { ...browser.refs } as Val; ran.push(name); ran.push('$refs'); continue }
      if (name === 'x-cloak') { node.cloak = !browser.started; out.cloak = node.cloak; ran.push(name); continue }
      if (name === 'x-teleport') { node.parent = expr; out.teleport = expr; ran.push(name); continue }
      if (name === '$el' || name === '$root') { out[name === '$el' ? 'el' : 'root'] = browser.root; ran.push(name); continue }
      if (name === '$dispatch') { browser.events.push({ name: expr, detail: null }); ran.push(name); continue }
      if (name === '$nextTick') { if (expr) browser.tick.push(expr); ran.push(name); continue }
      if (name === '$watch') { browser.watches.push({ path: expr, before: read(scope as unknown as Val, expr.split('.')) }); ran.push(name); continue }
      if (name === '$persist' || name === 'Alpine.$persist') { const key = expr.trim() || 'value'; if (raw.model !== undefined) browser.persisted[key] = raw.model as Val; else if (!(key in browser.persisted)) browser.persisted[key] = (scope[key] ?? null) as Val; scope[key] = browser.persisted[key] as Val; out.persist = { ...browser.persisted } as Val; ran.push(name); continue }
      if (name === '$focus') { browser.focus = expr || browser.root; out.focus = browser.focus; ran.push(name); continue }
      if (name === '$data' || name === '$store' || name === '$refs' || name === '$id') { ran.push(name); continue }
      if (name === 'x-anchor') { out.anchor = { to: expr, placed: true } as Val; ran.push(name); continue }
      if (name === 'x-trap') { browser.focus = expr || browser.root; out.trap = browser.focus; ran.push(name); ran.push('$focus'); continue }
      if (name === 'x-intersect') { out.intersect = expr; if (raw.visible === true && expr) runExpr(name, expr); else ran.push(name); continue }
      if (name === 'x-mask') { const current = raw.model !== undefined ? String(raw.model) : String(scope.n ?? ''); const masked = applyMask(expr, current); if (expr.trim()) scope.n = masked; out.mask = masked; ran.push(name); continue }
      if (name === 'Alpine.morph' || name === 'Alpine.morphBetween') { const from = new Set(idsOf(raw.from)), to = new Set(idsOf(raw.to)); out.morph = { added: [...to].filter((id) => !from.has(id)), removed: [...from].filter((id) => !to.has(id)), kept: [...from].filter((id) => to.has(id)) } as Val; ran.push(name); continue }
      if (name === 'x-resize') { const width = Number(raw.size?.width ?? 0), height = Number(raw.size?.height ?? 0); scope = { ...scope, width, height }; out.resize = { width, height } as Val; if (expr) runExpr(name, expr); else ran.push(name); continue }
      if (name === 'x-sort') { const list = expr ? runExpr(name, expr) : []; const rows = Array.isArray(list) ? list : []; const ordered = Array.isArray(raw.order) ? raw.order.map((i) => rows[i]).filter((item) => item !== undefined) : rows; out.rows = ordered as Val; out.item = (ordered[0] ?? null) as Val; out.position = 0; ran.push('x-sort'); ran.push('$item'); ran.push('$position'); continue }
      if (name === '$item' || name === '$position') { out[name === '$item' ? 'item' : 'position'] = name === '$item' ? (out.item ?? null) as Val : (out.position ?? 0) as Val; ran.push(name); continue }
      if (name === 'Alpine.store') { if (expr.trim() && isObj(stores[expr.trim()])) out.store = stores[expr.trim()] as Val; ran.push(name); continue }
      if (name === 'Alpine.data' || name === 'Alpine.bind') { ran.push(name); continue }
      if (name === 'Alpine.addScopeToNode') { out.scoped = { node: expr || browser.root, id: browser.root } as Val; ran.push(name); continue }
      if (browser.directives.includes(name) && expr) runExpr(name, expr)
      else note(name, WHY[name] ?? `${name} is not on the browser os`)
    }
    if (raw.model !== undefined && !keys.some((k) => base(k) === 'x-model' || base(k) === 'x-modelable')) note('x-model', 'a model value was handed with no x-model path')
    const queued = [...browser.tick]; browser.tick = []; for (const expr of queued) runExpr('$nextTick', expr)
    if (Array.isArray(raw.tree) && browser.started && !browser.defer && depth < 8) for (const child of raw.tree) if (isObj(child)) { const sub = runAlpine(child as Run, depth + 1); browser.nodes.push(...sub.document.nodes); browser.events.push(...sub.document.events) }
  } else if (Array.isArray(raw.children) && raw.children.length > 0) {
    ran.push('x-ignore')
  }
  if (keys.some((k) => base(k) === 'x-cloak')) { node.cloak = !browser.started; out.cloak = node.cloak }
  const watched = browser.watches.map((w) => { const after = read(scope as unknown as Val, w.path.split('.')); return { path: w.path, before: w.before, after, changed: JSON.stringify(w.before) !== JSON.stringify(after) } })
  const document = { root: browser.root, nodes: browser.nodes, events: browser.events, focus: browser.focus, started: browser.started, plugins: browser.plugins, directives: browser.directives, magics: browser.magics, persisted: browser.persisted, watched }
  const cover = entriesCover(leads.map((l) => ({ from: l.id, body: { status: l.status, name: (l.run.arguments as { develop: { variant: string } }).develop.variant } })))
  const eslint = { via: os.eslint.via, version: os.eslint.version, checked: browser.eslint.checked, clean: browser.eslint.findings.length === 0, findings: browser.eslint.findings }
  return {
    phase: 'alpine' as const, data: scope, stores, ...out, ran, leads, next: leads.map((l) => l.run), document, eslint, os: { ...os, complete: leads.length === 0 }, cover,
    says: leads.length === 0 ? `${ran.length} Alpine directive(s) ran on the qpu browser quantum os. ESLint ${eslint.version} checked ${eslint.checked}.` : `${ran.length} Alpine directive(s) ran on the qpu browser quantum os. ${cover.entries.length} entries cover ${cover.exits} exits. ESLint ${eslint.version} checked ${eslint.checked}.`,
  }
}

const asksPackage = (raw: object) => 'package' in raw || 'packages' in raw

/** true: the documented surface. { package } or { packages }: Alpine Linux packages the client device runs in the browser. Any other object: one component, its scope, and the leads still to develop. */
export const portAlpine = (raw: unknown) => raw === true ? listAlpine() : raw && typeof raw === 'object' && asksPackage(raw) ? portPackages(raw as PackageAsk) : runAlpine((raw ?? {}) as Run)
