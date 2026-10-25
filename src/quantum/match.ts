// Any statement, matched against everything the surface can do: the tools and their schemas, the documented examples,
// and the leads. The verdict is `served` when a call answers it (the call is made and returned), `impossible` when the
// surface itself proves it cannot (a schema bound the statement exceeds, a lead whose reason says why, or the handler's
// own refusal), and `unknown` when nothing matches, in which case the statement is returned as a new lead to develop.
// Deterministic: token overlap, no randomness, no network.

import type { Example } from './examples.js'
import type { Lead } from './leads.js'
import type { Rpc } from './audit.js'
import { factsOf, verifyRequestsOf, type VerifyRequest } from './verifiers.js'
import { numeralsOf, translateOf } from './i18n.js'

export type Verdict = 'served' | 'impossible' | 'unknown'
/** The unit's verdict vocabularies mapped onto this tree's, so a verdict crossing the border is translated, never guessed.
 *  verify_claim: VERIFIED / UNVERIFIED / REFUTED; due process: PROVEN / NOT-PROVEN / REFUTED. */
export const VERDICTS: Record<string, Verdict> = { VERIFIED: 'served', PROVEN: 'served', REFUTED: 'impossible', UNVERIFIED: 'unknown', 'NOT-PROVEN': 'unknown', NOT_PROVEN: 'unknown' }
export const verdictOf = (foreign: string): Verdict | undefined => VERDICTS[foreign.toUpperCase().replace(/\s+/g, '-')]
export const foreignVerdictsOf = (v: Verdict): string[] => Object.entries(VERDICTS).filter(([, ours]) => ours === v).map(([theirs]) => theirs)
export type Candidate = { kind: 'tool' | 'example' | 'lead'; id: string; score: number; hits: number; text: string }
export type Reflection = {
  /** integers in the statement factored by the surface's own Shor tool when inside its bound; beyond it, the bound is the answer */
  factors: { n: number; factors?: string; order?: string; by: string }[]
  /** each number against the nearest schema bound d: its σ-reflection d − x (Qpu.Sigma) and the QFT angle 2πx/d */
  angles: { x: number; property: string; d: number; sigma: number; angle: number }[]
  /** the statement re-asked in its mirror forms: stems, complements, the sources' synonyms, the number-free analog */
  queries: string[]
  /** what the reflections found that the digital tokens did not */
  found: Candidate[]
  /** every reflection as a lead to develop */
  leads: Lead[]
}

export type Match = {
  statement: string
  verdict: Verdict
  evidence: string[]
  tool?: string
  call?: { name: string; arguments: Record<string, unknown> }
  result?: unknown
  candidates: Candidate[]
  /** the served possibilities around the statement, ranked: what the surface CAN do in its neighbourhood */
  cluster: Candidate[]
  /** where the client can verify them live, across every adaptor that can see each fact. This handler does no I/O; the client's own MCP fetches. */
  verify: VerifyRequest[]
  /** when in doubt: the hidden factors and angles in the reflection of the analog, each a lead to develop */
  reflection: Reflection
  /** the statement as a lead: served with its tool, or blocked/out of scope with the proof, or a new lead to develop */
  lead: Lead
  /** how the statement was read before matching: Glagolitic numerals as integers, a locale translated by vocabulary, offline */
  read?: { given: string; numerals: { glyphs: string; value: number }[]; locale?: string; untranslated: string[]; verdictIn?: string }
}

/** The surface's own names: they name where, never what, so they count for nothing in coverage. */
const BRAND = new Set(['qpu', 'uuidna', 'mcp', 'tool', 'tools'])
const STOP = new Set(['the', 'a', 'an', 'of', 'to', 'in', 'on', 'for', 'and', 'or', 'is', 'are', 'it', 'its', 'with', 'as', 'by', 'at', 'from', 'this', 'that', 'be', 'can', 'do', 'does', 'what', 'how', 'me', 'i', 'you', 'we', 'please', 'show', 'give', 'run', 'use', 'using', 'now', 'today', 'here', 'there', 'then', 'just', 'also', 'very', 'any', 'all', 'some', 'one', 'two', 'not', 'no', 'yes', 'has', 'have', 'had', 'was', 'were', 'will', 'would', 'should', 'may', 'might', 'into', 'over', 'under', 'than', 'when', 'where', 'which', 'who', 'why'])
export const tokens = (text: string): string[] => text.toLowerCase().replace(/[^a-z0-9.\s_-]/g, ' ').split(/[\s_-]+/).map((t) => t.replace(/^\.+|\.+$/g, '')).filter((t) => t.length > 1 && !STOP.has(t))

const overlap = (a: string[], b: string[]): number => {
  const set = new Set(b)
  let n = 0
  for (const t of new Set(a)) if (set.has(t) && !BRAND.has(t)) n += 1
  return n
}

/** Rare words rank higher than common ones: a term's weight is 1 / (1 + ln df) over every text the surface can match. */
const weightsOf = (texts: string[]): ((t: string) => number) => {
  const df = new Map<string, number>()
  for (const text of texts) for (const t of new Set(tokens(text))) df.set(t, (df.get(t) ?? 0) + 1)
  return (t) => 1 / (1 + Math.log(df.get(t) ?? 1))
}
const weighted = (a: string[], b: string[], w: (t: string) => number): number => {
  const set = new Set(b)
  let n = 0
  for (const t of new Set(a)) if (set.has(t)) n += w(t)
  return n
}

type ToolSpec = { name: string; description: string; inputSchema: { properties?: Record<string, { type?: string; enum?: unknown[]; maximum?: number; minimum?: number; description?: string }> } }

/** Words in a statement that name a bounded parameter, and the number that follows or precedes them. */
const BOUND_WORDS: Record<string, string> = { n: 'N', rsa: 'N', factor: 'N', factorise: 'N', factorize: 'N', semiprime: 'N', modulus: 'N', qubit: 'qubits', qubits: 'qubits', bit: 'bits', bits: 'bits', node: 'nodes', nodes: 'nodes', vertices: 'nodes', milestone: 'milestone', shots: 'repetitions', repetitions: 'repetitions', samples: 'repetitions' }

const numbersNear = (statement: string): { property: string; value: number; phrase: string }[] => {
  const out: { property: string; value: number; phrase: string }[] = []
  const words = statement.toLowerCase().replace(/[^a-z0-9.\s=-]/g, ' ').split(/\s+/).filter(Boolean)
  for (let i = 0; i < words.length; i++) {
    const w = words[i]!
    // "rsa-2048", "n=35", "2048-bit"
    const joined = /^([a-z]+)[-=](\d+(?:\.\d+)?)$/.exec(w) ?? /^(\d+(?:\.\d+)?)[-=]([a-z]+)$/.exec(w)
    if (joined) {
      const [, x, y] = joined
      const word = /^\d/.test(x!) ? y! : x!
      const value = Number(/^\d/.test(x!) ? x : y)
      const property = BOUND_WORDS[word.replace(/s$/, '')] ?? BOUND_WORDS[word]
      if (property && Number.isFinite(value)) out.push({ property, value, phrase: w })
      continue
    }
    const property = BOUND_WORDS[w] ?? BOUND_WORDS[w.replace(/s$/, '')]
    if (!property) continue
    for (const j of [i + 1, i - 1, i + 2]) {
      const v = words[j]
      if (v && /^\d+(\.\d+)?$/.test(v)) { out.push({ property, value: Number(v), phrase: `${w} ${v}` }); break }
    }
  }
  return out
}

const MIRROR: Record<string, string[]> = {
  factor: ['shor', 'order', 'period', 'semiprime'], factors: ['shor', 'order', 'period'], factorize: ['shor'], factorise: ['shor'],
  qubit: ['qubits', 'processor', 'grid'], qubits: ['qubit', 'processor'], chip: ['processor', 'willow', 'sycamore'], chips: ['processor'],
  error: ['noise', 'channel', 'correction', 'repetition'], errors: ['noise', 'channel'], noise: ['channel', 'error'],
  speed: ['speedup', 'benchmark', 'echo'], fast: ['speedup', 'benchmark'], speedup: ['benchmark', 'echo'],
  google: ['quantumai', 'willow', 'sycamore'], impossible: ['blocked', 'out_of_scope', 'bound'], possible: ['served'],
  mirror: ['sigma', 'reflection', 'involution'], reflection: ['sigma', 'involution'], angle: ['phase', 'qft'], angles: ['phase', 'qft'], phase: ['angle', 'qft'],
  molecule: ['chemistry', 'hydrogen', 'h2'], chemistry: ['hydrogen', 'molecule'], energy: ['chemistry', 'hydrogen'],
  code: ['repetition', 'correction', 'stim'], decoder: ['chromobius', 'tesseract', 'stim'], paper: ['preprint', 'arxiv', 'statements'],
}
const stem = (t: string): string => t.replace(/(ing|ed|es|s)$/, '')

/** The statement in its mirror forms: stems, the sources' synonyms and complements, and the number-free analog. */
export const reflectionsOf = (statement: string): string[] => {
  const q = tokens(statement)
  const out = new Set<string>()
  const stems = q.map(stem).filter((t) => t.length > 1)
  if (stems.join(' ') !== q.join(' ')) out.add(stems.join(' '))
  for (const t of q) for (const m of MIRROR[t] ?? MIRROR[stem(t)] ?? []) out.add([...q.filter((x) => x !== t), m].join(' '))
  const numberFree = q.filter((t) => !/^\d/.test(t))
  if (numberFree.length && numberFree.length !== q.length) out.add(numberFree.join(' '))
  return [...out].filter((r) => r !== q.join(' '))
}

const slug = (text: string): string => tokens(text).slice(0, 6).join('-') || 'statement'

/** Tools the matcher lists but never calls: calling itself or the audit from inside a match would recurse without end. */
const META = new Set(['match', 'audit'])

/** A matcher with its index built once: tools, examples and leads tokenised and weighted, so every lead can be imagined in one run. */
/** Shor's factoring of a small N on the simulator is deterministic: once per process. */
const SHOR = new Map<number, any>()
const INDEXES = new WeakMap<readonly Lead[], WeakMap<readonly Example[], (statement: string) => Match>>()
const indexOf = (handle: (m: Rpc) => any, allExamples: readonly Example[], leads: readonly Lead[]): ((statement: string) => Match) => {
  const byExamples = INDEXES.get(leads) ?? new WeakMap(); INDEXES.set(leads, byExamples)
  const found = byExamples.get(allExamples); if (found) return found
  const built = innerMatcherOf(handle, allExamples, leads); byExamples.set(allExamples, built); return built
}
export const matcherOf = (handle: (m: Rpc) => any, allExamples: readonly Example[], leads: readonly Lead[]): ((statement: string, locale?: string) => Match) => {
  const inner = indexOf(handle, allExamples, leads)
  return (given: string, locale?: string): Match => {
    const num = numeralsOf(given)
    const tr = locale && locale !== 'en' ? translateOf(num.text, locale, 'en') : null
    const m = inner(tr ? tr.text : num.text)
    if (!num.numerals.length && !tr) return m
    return { ...m, read: { given, numerals: num.numerals, locale, untranslated: tr?.untranslated ?? [], verdictIn: tr ? translateOf(m.verdict, 'en', locale!).text : undefined } }
  }
}

const innerMatcherOf = (handle: (m: Rpc) => any, allExamples: readonly Example[], leads: readonly Lead[]): ((statement: string) => Match) => {
  const list = handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' })
  const allTools: ToolSpec[] = 'result' in list ? list.result.tools : []
  const tools = allTools.filter((t) => !META.has(t.name))
  const examples = allExamples.filter((e) => !META.has(e.tool))
  const toolText = (t: ToolSpec) => `${t.name} ${t.description} ${Object.keys(t.inputSchema.properties ?? {}).join(' ')} ${Object.values(t.inputSchema.properties ?? {}).flatMap((p) => (p.enum ?? []).map(String)).join(' ')}`
  // an example's arguments enter the index by their words, never by their keys or their punctuation: a key named `now` is not a statement about now
  const leaves = (v: unknown): string[] => (typeof v === 'string' ? [v] : typeof v === 'number' ? [String(v)] : Array.isArray(v) ? v.flatMap(leaves) : v && typeof v === 'object' ? Object.values(v as Record<string, unknown>).flatMap(leaves) : [])
  const exampleText = (e: Example) => `${e.tool} ${e.id} ${e.shows} ${leaves(e.arguments).join(' ')}`
  const leadText = (l: Lead) => `${l.id} ${l.statement} ${l.source} ${l.tool ?? ''} ${l.reason ?? ''}`
  const w = weightsOf([...tools.map(toolText), ...examples.map(exampleText), ...leads.map(leadText)])
  const toolTok = tools.map((t) => tokens(toolText(t)))
  const exTok = examples.map((e) => tokens(exampleText(e)))
  const leadTok = leads.map((l) => tokens(leadText(l)))
  const servedLeads = new Set(leads.filter((l) => l.status === 'served').map((l) => l.id))
  const bounds: { property: string; d: number }[] = tools.flatMap((t) => Object.entries(t.inputSchema.properties ?? {}).filter(([, p]) => typeof p.maximum === 'number').map(([property, p]) => ({ property, d: p.maximum as number })))

  return (statement: string): Match => {
  const q = tokens(statement)
  const evidence: string[] = []

  // 1. A bound the statement exceeds is a proof of impossibility from the schema itself.
  for (const { property, value, phrase } of numbersNear(statement)) {
    for (const t of tools) {
      const p = t.inputSchema.properties?.[property]
      if (!p || typeof p.maximum !== 'number') continue
      if (value > p.maximum || (typeof p.minimum === 'number' && value < p.minimum)) {
        evidence.push(`${t.name}.${property} is bounded to [${p.minimum ?? '…'}, ${p.maximum}] by its schema; the statement asks for ${phrase}${p.description ? ` (${p.description})` : ''}`)
      }
    }
  }
  const candidates: Candidate[] = []
  for (const [i, t] of tools.entries()) {
    const tt = toolTok[i]!
    const hits = overlap(q, tt) + (q.includes(t.name.toLowerCase()) ? 2 : 0)
    if (hits > 0) candidates.push({ kind: 'tool', id: t.name, score: weighted(q, tt, w) + (q.includes(t.name.toLowerCase()) ? 2 : 0), hits, text: t.description })
  }
  for (const [i, e] of examples.entries()) {
    const et = exTok[i]!
    const hits = overlap(q, et)
    if (hits > 0) candidates.push({ kind: 'example', id: e.id, score: weighted(q, et, w) + 0.5, hits: hits + 1, text: e.shows })
  }
  for (const [i, l] of leads.entries()) {
    const lt = leadTok[i]!
    const hits = overlap(q, lt)
    if (hits > 0) candidates.push({ kind: 'lead', id: l.id, score: weighted(q, lt, w), hits, text: `${l.status}${l.tool ? ` by ${l.tool}` : ''}${l.reason ? `: ${l.reason}` : ''}` })
  }
  candidates.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
  const top = candidates[0]
  const cluster = candidates.filter((c) => c.kind === 'example' || c.kind === 'tool' || servedLeads.has(c.id))
  const matchedLeads = candidates.filter((c) => c.kind === 'lead').map((c) => leads.find((l) => l.id === c.id)!).filter((l) => l.source && l.source !== 'statement')
  const verify: VerifyRequest[] = matchedLeads.flatMap((l) => factsOf(l).flatMap(verifyRequestsOf))

  // When in doubt: the hidden factors and angles in the reflection of the analog, each a lead to develop.
  const integers = [...new Set((statement.match(/\b\d+\b/g) ?? []).map(Number).filter((n) => n >= 2))]
  const factors: Reflection['factors'] = integers.map((n) => {
    const shor = tools.find((t) => t.name === 'algorithm')?.inputSchema.properties?.N
    if (shor && typeof shor.maximum === 'number' && n <= shor.maximum && n >= (shor.minimum ?? 3)) {
      const reply = SHOR.get(n) ?? (() => { const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'algorithm', arguments: { name: 'shor', N: n } } }); SHOR.set(n, r); return r })()
      if ('result' in reply) {
        const rows: unknown[][] = reply.result.structuredContent?.summary ?? []
        const f = rows.find((r) => r[0] === 'Factors')?.[1] as string | undefined
        const o = rows.find((r) => r[0] === 'Order of a mod N')?.[1] as string | undefined
        return { n, factors: f, order: o, by: "the algorithm tool's Shor circuit on the state-vector simulator" }
      }
      return { n, by: `the algorithm tool refused: ${reply.error.message}` }
    }
    return { n, by: `beyond the simulator's bound N ≤ ${shor?.maximum ?? '?'}: not factored here` }
  })
  const angles: Reflection['angles'] = integers.flatMap((x) => bounds.filter((b) => x <= b.d).map((b) => ({ x, property: b.property, d: b.d, sigma: b.d - x, angle: (2 * Math.PI * x) / b.d })))
  const queries = reflectionsOf(statement)
  const found: Candidate[] = []
  for (const r of queries) {
    const rq = tokens(r)
    for (const [i, t] of tools.entries()) {
      const score = overlap(rq, toolTok[i]!)
      if (score >= 2 && !candidates.some((c) => c.kind === 'tool' && c.id === t.name)) found.push({ kind: 'tool', id: t.name, score, hits: score, text: `via "${r}": ${t.description.slice(0, 80)}` })
    }
    for (const [i, e] of examples.entries()) {
      const score = overlap(rq, exTok[i]!)
      if (score >= 2 && !candidates.some((c) => c.kind === 'example' && c.id === e.id)) found.push({ kind: 'example', id: e.id, score, hits: score, text: `via "${r}": ${e.shows}` })
    }
  }
  found.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
  const reflectionLeads: Lead[] = [
    ...factors.filter((f) => f.factors).map((f) => ({ id: `factors-${f.n}`, source: `reflection of: ${statement}`, statement: `${f.n} = ${f.factors} (order ${f.order}) by ${f.by}`, status: 'open' as const, tool: 'algorithm', reason: 'a hidden factor found in the reflection; verify it across the integer adaptors' })),
    ...angles.map((a) => ({ id: `angle-${a.property}-${a.x}`, source: `reflection of: ${statement}`, statement: `σ_${a.d}(${a.x}) = ${a.sigma} on ${a.property}; QFT angle ${a.angle.toFixed(6)} rad`, status: 'open' as const, reason: 'an angle in the reflection; Qpu.Sigma proves σ_d(σ_d(x)) = x' })),
    ...found.map((c) => ({ id: `mirror-${c.id}`, source: `reflection of: ${statement}`, statement: c.text, status: 'open' as const, tool: c.kind === 'tool' ? c.id : examples.find((e) => e.id === c.id)?.tool, reason: 'found only in the mirror form of the statement' })),
  ]
  for (const l of reflectionLeads) verify.push(...factsOf(l).flatMap(verifyRequestsOf))
  const reflection: Reflection = { factors, angles, queries, found, leads: reflectionLeads }

  if (evidence.length > 0) {
    return { statement, verdict: 'impossible', evidence, candidates, cluster, verify, reflection, lead: { id: slug(statement), source: 'statement', statement, status: 'blocked', reason: evidence.join('; ') } }
  }
  if ((!top || top.hits < 2) && found.length > 0) {
    const f = found[0]!
    const example = f.kind === 'example' ? examples.find((e) => e.id === f.id)! : examples.find((e) => e.tool === f.id)
    const tool = f.kind === 'example' ? example!.tool : f.id
    const call = { name: tool, arguments: example?.arguments ?? {} }
    const reply = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: call })
    if ('result' in reply) return { statement, verdict: 'served', evidence: [`found in the reflection: ${f.text}`], tool, call, result: reply.result.structuredContent, candidates, cluster: [f, ...cluster], verify, reflection, lead: { id: slug(statement), source: 'statement', statement, status: 'served', tool } }
  }
  const substantive = q.filter((t) => !BRAND.has(t))
  const coverage = top ? top.hits / Math.max(1, substantive.length) : 0
  if (top && top.hits >= 2 && coverage < 0.5 && found.length === 0) {
    const reason = `the best match covers ${Math.round(coverage * 100)}% of the statement's words (${top.kind} ${top.id}); too little to serve it honestly; proposed as a new lead to develop`
    return { statement, verdict: 'unknown', evidence: [reason], candidates, cluster, verify, reflection, lead: { id: slug(statement), source: 'statement', statement, status: 'blocked', reason } }
  }
  if (!top || top.hits < 2) {
    const reason = 'no tool, example or lead matches the statement, nor its reflections; proposed as a new lead to develop'
    return { statement, verdict: 'unknown', evidence: [reason], candidates, cluster, verify, reflection, lead: { id: slug(statement), source: 'statement', statement, status: 'blocked', reason } }
  }
  if (top.kind === 'lead') {
    const lead = leads.find((l) => l.id === top.id)!
    if (lead.status === 'served' && lead.tool) {
      const example = examples.find((e) => e.tool === lead.tool)
      const call = { name: lead.tool, arguments: example?.arguments ?? {} }
      const reply = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: call })
      if ('result' in reply) return { statement, verdict: 'served', evidence: [`lead ${lead.id} is served by ${lead.tool}; called it`], tool: lead.tool, call, result: reply.result.structuredContent, candidates, cluster, verify, reflection, lead: { ...lead, statement } }
      return { statement, verdict: 'impossible', evidence: [`lead ${lead.id} names ${lead.tool}, which refused: ${reply.error.message}`], tool: lead.tool, call, candidates, cluster, verify, reflection, lead: { ...lead, status: 'blocked', reason: reply.error.message } }
    }
    return { statement, verdict: 'impossible', evidence: [`lead ${lead.id} is ${lead.status}: ${lead.reason ?? 'no reason recorded'}`], candidates, cluster, verify, reflection, lead: { ...lead, statement } }
  }
  const example = top.kind === 'example' ? examples.find((e) => e.id === top.id)! : examples.find((e) => e.tool === top.id)
  const tool = top.kind === 'example' ? example!.tool : top.id
  const call = { name: tool, arguments: example?.arguments ?? {} }
  const reply = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: call })
  if ('result' in reply) {
    const why = example ? example.expect(reply.result.structuredContent) : null
    return { statement, verdict: 'served', evidence: [example ? `example ${example.id}: ${why ?? 'as documented'}` : `tool ${tool} answered the call`], tool, call, result: reply.result.structuredContent, candidates, cluster, verify, reflection, lead: { id: slug(statement), source: 'statement', statement, status: 'served', tool } }
  }
  return { statement, verdict: 'impossible', evidence: [`tool ${tool} refused: ${reply.error.message}`], tool, call, candidates, cluster, verify, reflection, lead: { id: slug(statement), source: 'statement', statement, status: 'blocked', reason: reply.error.message } }
  }
}

export const matchOf = (statement: string, handle: (m: Rpc) => any, allExamples: readonly Example[], leads: readonly Lead[], locale?: string): Match => matcherOf(handle, allExamples, leads)(statement, locale)
