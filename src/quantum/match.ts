// Any statement, matched against everything the surface can do: the tools and their schemas, the documented examples,
// and the leads. The verdict is `served` when a call answers it (the call is made and returned), `impossible` when the
// surface itself proves it cannot (a schema bound the statement exceeds, a lead whose reason says why, or the handler's
// own refusal), and `unknown` when nothing matches, in which case the statement is returned as a new lead to develop.
// Deterministic: token overlap, no randomness, no network.

import type { Example } from './examples.ts'
import type { Lead } from './leads.ts'
import type { Rpc } from './audit.ts'
import { factsOf, verifyRequestsOf, type VerifyRequest } from './verifiers.ts'
import { numeralsOf, translateOf } from './i18n.ts'
import { THEOREMS } from './theorems-index.ts'
import { TEXTBOOK_THEOREMS } from './textbook-theorems.ts'

/** The route of a prompt to the theorems, decided by the theorems: every textbook theorem is indexed by the words of its key and of what it
 *  says, each word weighted by how rare it is among the theorems (ln of theorems over theorems that use it), so a common word routes nowhere and
 *  a specific one decides; a prompt reaches the theorems with the greatest weight of shared words (two at least), the kernel-accepted ones only,
 *  and each theorem's examples are its routes: the calls it leads to. No theorem reached: the prompt is a lead (textbook_route_or_lead). */
const ROUTE_STOP = new Set(['many', 'much', 'more', 'most', 'when', 'what', 'which', 'where', 'there', 'here', 'with', 'from', 'into', 'over', 'under', 'every', 'each', 'that', 'this', 'these', 'those', 'have', 'does', 'only', 'also', 'then', 'than', 'them', 'they', 'their', 'about', 'after', 'before', 'same', 'other', 'another', 'never', 'none', 'nothing', 'name', 'named', 'theorem', 'textbook', 'kernel', 'qpu'])
export const routeStems = (text: string): Set<string> => new Set(text.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase().replace(/[^a-z0-9\s_.-]/g, ' ').split(/[\s_.-]+/).filter((w) => w.length > 3 && !ROUTE_STOP.has(w)).map((w) => w.replace(/(ings?|ed|es|e|s)$/, '')).filter((w) => w.length > 2))
let routeIndex: { key: string; says: string; lean: string; examples: readonly string[]; keyStems: Set<string>; stems: Set<string> }[] | null = null
let routeIdf: Map<string, number> | null = null
export const routeOf = (statement: string, examples: readonly Example[], top = 3) => {
  if (!routeIndex || !routeIdf) {
    const kernel = new Set(THEOREMS.map((t) => t.key)), textbook = new Set(TEXTBOOK_THEOREMS.map((t) => t.key))
    // every kernel-accepted theorem routes: a textbook theorem by its key and what it says, any other by its key and its module; an example names the theorem it rests on, so its examples are its routes
    const named = new Map<string, string[]>(); for (const e of examples) if (e.theorem) named.set(e.theorem, [...(named.get(e.theorem) ?? []), e.id])
    const keyOf = (k: string) => routeStems(k.replace(/^textbook_/, '').replace(/^Qpu\./, ''))
    routeIndex = [
      ...TEXTBOOK_THEOREMS.filter((t) => kernel.has(t.key)).map((t) => { const keyStems = keyOf(t.key); return { key: t.key, says: t.says, lean: t.lean, examples: [...new Set([...t.examples, ...(named.get(t.key) ?? [])])], keyStems, stems: new Set([...keyStems, ...routeStems(t.says)]) } }),
      ...THEOREMS.filter((t) => !textbook.has(t.key)).map((t) => { const keyStems = keyOf(t.key); return { key: t.key, says: `${t.module}: ${t.statement}`, lean: `theorem ${t.key} : ${t.statement}`, examples: named.get(t.key) ?? [], keyStems, stems: new Set([...keyStems, ...routeStems(t.module.replace(/^Qpu\./, ''))]) } }),
    ]
    const df = new Map<string, number>(); for (const t of routeIndex) for (const w of t.stems) df.set(w, (df.get(w) ?? 0) + 1)
    routeIdf = new Map([...df].map(([w, n]) => [w, Math.log(routeIndex!.length / n)]))
  }
  // a word of the theorem's own key is its subject and weighs twice; a route needs two shared words or one subject word, and the weight above the threshold
  const s = routeStems(statement)
  const ranked = routeIndex.map((t) => { const shared = [...t.stems].filter((w) => s.has(w)); const subject = shared.filter((w) => t.keyStems.has(w)); return { t, shared, subject, weight: shared.reduce((n, w) => n + (routeIdf!.get(w) ?? 0) * (t.keyStems.has(w) ? 2 : 1), 0) } }).filter((r) => (r.shared.length >= 2 || r.subject.length >= 1) && r.weight >= ROUTE_THRESHOLD).sort((a, b) => b.weight - a.weight || a.t.key.localeCompare(b.t.key)).slice(0, top)
  const byId = new Map(examples.map((e) => [e.id, e]))
  const theorems = ranked.map((r) => ({ theorem: r.t.key, lean: r.t.lean, says: r.t.says, shared: r.shared, subject: r.subject, weight: Math.round(r.weight * 100) / 100, routes: r.t.examples.map((id) => byId.get(id)).filter((e): e is Example => !!e).map((e) => ({ example: e.id, call: { name: e.tool, arguments: e.arguments } })) }))
  return { routed: theorems.length > 0, theorems, threshold: ROUTE_THRESHOLD, theorem: 'textbook_route_or_lead', says: theorems.length ? `routed to ${theorems.map((t) => t.theorem).join(', ')} by the weight of the words the prompt shares with them` : 'no theorem reached by its subject or two specific words: the prompt is a lead' }
}
/** a route needs the weight of a word only one or two theorems use plus another: ln(n / 2) for the rarest is about four and a half */
const ROUTE_THRESHOLD = 5
import { uuidOf } from './blocks.ts'

export type Verdict = 'served' | 'impossible' | 'unknown'
/** The unit's verdict vocabularies mapped onto this tree's, so a verdict crossing the border is translated, never guessed.
 *  verify_claim: VERIFIED / UNVERIFIED / REFUTED; due process: PROVEN / NOT-PROVEN / REFUTED. */
export const VERDICTS: Record<string, Verdict> = { VERIFIED: 'served', PROVEN: 'served', REFUTED: 'impossible', UNVERIFIED: 'unknown', 'NOT-PROVEN': 'unknown', NOT_PROVEN: 'unknown' }
export const verdictOf = (foreign: string): Verdict | undefined => VERDICTS[foreign.toUpperCase().replace(/\s+/g, '-')]
export const foreignVerdictsOf = (v: Verdict): string[] => Object.entries(VERDICTS).filter(([, ours]) => ours === v).map(([theirs]) => theirs)
export type Candidate = { kind: 'tool' | 'example' | 'lead' | 'theorem'; id: string; score: number; hits: number; text: string }
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

export type Match = { /** the content address of the recognised call: a recognition is a block like any other */ sealed?: string;
  statement: string
  verdict: Verdict
  evidence: string[]
  tool?: string
  /** the kernel-accepted theorem that serves the statement, when the textbook answers first */
  theorem?: string
  /** the theorems the prompt is routed to, decided by the theorems (the weight of the words it shares with them), each with its examples as routes */
  route?: ReturnType<typeof routeOf>
  /** the pattern the statement carried (a UUID, a relation name, a dashboard, a clone…), when one was recognised */
  pattern?: string
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
/** The stem of a word: one form for token/tokens, server/servers, list/listing, so a door and a lead meet on the word, not its ending. */
export const stem = (t: string): string => t.replace(/(ing|ed|es|s)$/, '')

/** The statement in its mirror forms: stems, the sources' synonyms and complements, and the number-free analog. */
export const reflectionsOf = (statement: string): string[] => {
  const q = tokens(statement)
  const out = new Set<string>()
  const stems = q.map(stem).filter((t) => t.length > 1)
  if (stems.join(' ') !== q.join(' ')) out.add(stems.join(' '))
  for (const t of q) // own keys only: a word like constructor or prototype must never read the object's built-ins (it crashed the match on "constructors": measured)
  for (const m of (Object.hasOwn(MIRROR, t) ? MIRROR[t] : Object.hasOwn(MIRROR, stem(t)) ? MIRROR[stem(t)] : undefined) ?? []) out.add([...q.filter((x) => x !== t), m].join(' '))
  const numberFree = q.filter((t) => !/^\d/.test(t))
  if (numberFree.length && numberFree.length !== q.length) out.add(numberFree.join(' '))
  return [...out].filter((r) => r !== q.join(' '))
}

const slug = (text: string): string => tokens(text).slice(0, 6).join('-') || 'statement'

/** Tools the matcher lists but never calls: calling itself or the audit from inside a match would recurse without end. */
/** Tools the matcher never calls to serve a statement: the judges and layouts of the tree (audit, verify, metrics, textbook, dashboard, clone, css) and every toolbox that fetches, bills or audits; the textbook it serves from is google, clay, leads, language and raid. A pattern may still open any door by name. */
// prose and payload run whatever tool they are handed; a guessed `tool: imagine` ran the whole imagination inside one match
const META = new Set(['match', 'audit', 'verify', 'metrics', 'textbook', 'dashboard', 'clone', 'css', 'prose', 'payload'])
const META_TOOLBOXES = new Set(['flow', 'legal', 'repository', 'billing', 'standards', 'payload', 'extension'])

/** A matcher with its index built once: tools, examples and leads tokenised and weighted, so every lead can be imagined in one run. */
/** Shor's factoring of a small N on the simulator is deterministic: once per process. */
const SHOR = new Map<number, any>()
const INDEXES = new WeakMap<readonly Lead[], WeakMap<readonly Example[], (statement: string) => Match>>()
const indexOf = (handle: (m: Rpc) => any, allExamples: readonly Example[], leads: readonly Lead[]): ((statement: string) => Match) => {
  const byExamples = INDEXES.get(leads) ?? new WeakMap(); INDEXES.set(leads, byExamples)
  const found = byExamples.get(allExamples); if (found) return found
  const built = innerMatcherOf(handle, allExamples, leads); byExamples.set(allExamples, built); return built
}
/** Pattern recognition before the token match: the shapes a statement can carry and the door each opens, as data. A pattern
 * names what it recognised and the call it makes; a statement that carries none goes to the textbook and the tokens. */
export type Pattern = { name: string; test: RegExp; tool: string; args: (m: RegExpMatchArray, statement: string) => Record<string, unknown>; shows: string }
export const PATTERNS: readonly Pattern[] = [
  { name: 'uuid', test: /\b([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\b/i, tool: 'verify', args: (m) => ({ uuid: m[1]!.toLowerCase() }), shows: 'a UUID: its seal, channel, vortex and reflection' },
  { name: 'oeis', test: /\b(A\d{6})\b/, tool: 'leads', args: () => ({}), shows: 'an OEIS sequence number: a sequence fact for the wave' },
  { name: 'relation', test: /\b(relation_\d+)\b/, tool: 'clay', args: (m) => ({ name: m[1] }), shows: 'a Clay relation by name: recomputed' },
  { name: 'clay-technique', test: /\b(clay|register)\b.*\b(reflect|reflection|vortex|trinit)/i, tool: 'clay', args: () => ({ technique: 'reflection' }), shows: 'the register read by the reflection technique' },
  { name: 'dashboard', test: /\b(?:dashboard|lay out|layout|combinations?|all (?:the )?(?:options|values)) (?:of |for )?([a-z_-]+)/i, tool: 'dashboard', args: (m) => ({ tool: m[1]!.toLowerCase() }), shows: 'a tool laid out whole' },
  { name: 'clone', test: /\bclone (?:the )?([a-z-]+)(?: toolbox)?(?: as ([a-z0-9-]+))?/i, tool: 'clone', args: (m) => ({ toolbox: m[1]!.toLowerCase(), ...(m[2] ? { as: m[2].toLowerCase() } : {}) }), shows: 'a toolbox cloned whole' },
  { name: 'translate', test: /\btranslate\b\s*(?:"([^"]+)"|'([^']+)'|(.+?))\s+(?:to|into)\s+([a-z]{2})\b/i, tool: 'translate', args: (m) => ({ text: m[1] ?? m[2] ?? m[3] ?? '', from: 'en', to: m[4]!.toLowerCase() }), shows: 'a text translated by vocabulary' },
  { name: 'css-of', test: /\b(?:css|stylesheet|colou?rs?|aura) (?:of |for )?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\b/i, tool: 'css', args: (m) => ({ uuid: m[1]!.toLowerCase() }), shows: 'the CSS variables of a UUID' },
  { name: 'scan', test: /\bscan\b[^[]*(\[[\s\S]*\])/i, tool: 'verify', args: (m) => { try { return { scan: JSON.parse(m[1]!) } } catch { return { scan: [] } } }, shows: 'a stream of frames (time, hue) a device sampled, read back to the address it links, by majority per frame' },
  { name: 'metrics', test: /\b(metrics|how many (?:tools|examples|theorems|leads)|coins paid)\b/i, tool: 'metrics', args: () => ({}), shows: 'the tree\'s metrics now' },
  { name: 'textbook', test: /\b(?:reuse|replay) (?:example )?([a-z0-9-]+)/i, tool: 'textbook', args: (m) => ({ reuse: m[1]!.toLowerCase() }), shows: 'an example reused by id' },
  { name: 'shor', test: /\bfactor(?:ise|ize)?\s+(\d+)\b/i, tool: 'algorithm', args: (m) => ({ name: 'shor', N: Number(m[1]) }), shows: 'an integer factored by Shor within the bound' },
  // splitting: what a place cannot hold is folded into pieces under a bound; the statement names the bound (bytes) and, in quotes, the text — or is itself the text
  { name: 'fold', test: /\b(?:split|fold|shard)\b[^"'\n]*?(?:"([^"]+)"|'([^']+)')?[^"'\n]*?\b(?:under|into pieces of|by|bound(?: of)?)\s+(\d+)\s*(?:bytes?|b)?\b/i, tool: 'fold', args: (m, statement) => ({ text: m[1] ?? m[2] ?? statement, bound: Number(m[3]) }), shows: 'a text folded into pieces under a bound: each piece addressed, the whole by its root, the bound a reflective boundary' },
  // sealing: a text named by its SHA-256, its fold address and, with a key, its HMAC
  { name: 'seal', test: /\b(?:seal|sha-?256|hmac|hash)\b\s*(?:of\s+|:\s*)?(?:"([^"]+)"|'([^']+)')?(?:.*?\bwith (?:the )?key\s+(?:"([^"]+)"|'([^']+)'|(\S+)))?/i, tool: 'seal', args: (m, statement) => ({ text: m[1] ?? m[2] ?? statement, ...(m[3] ?? m[4] ?? m[5] ? { key: m[3] ?? m[4] ?? m[5] } : {}) }), shows: 'a text sealed: SHA-256, the fold address, and the HMAC under the key named' },
]
/** The pattern a statement carries, if any, and the call it makes; the first pattern that matches wins, in the order above. */
export const patternOf = (statement: string): { pattern: Pattern; call: { name: string; arguments: Record<string, unknown> }; sealed: string } | null => {
  for (const p of PATTERNS) { const m = statement.match(p.test); if (m) { const call = { name: p.tool, arguments: p.args(m, statement) }; return { pattern: p, call, sealed: uuidOf(`${call.name}${JSON.stringify(call.arguments)}`) } } }
  return null
}

/** One tools/call through the handler the matcher was given. */
const toolsCall = (handle: (m: Rpc) => any, params: unknown) => handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params })
export const matcherOf = (handle: (m: Rpc) => any, allExamples: readonly Example[], leads: readonly Lead[]): ((statement: string, locale?: string) => Match) => {
  const inner = indexOf(handle, allExamples, leads)
  return (given: string, locale?: string): Match => {
    const num = numeralsOf(given)
    const tr = locale && locale !== 'en' ? translateOf(num.text, locale, 'en') : null
    const text = tr ? tr.text : num.text
    const recognised = patternOf(text)
    const m = (() => {
      if (recognised && recognised.call.name !== 'leads') {
        const reply = toolsCall(handle, recognised.call)
        const base = inner(text)
        if ('result' in reply) return { ...base, verdict: 'served' as const, tool: recognised.call.name, call: recognised.call, result: reply.result.structuredContent, sealed: recognised.sealed, evidence: [`pattern ${recognised.pattern.name}: ${recognised.pattern.shows}; ${recognised.call.name} answered`, ...base.evidence], pattern: recognised.pattern.name, lead: { ...base.lead, status: 'served' as const, tool: recognised.call.name } }
        return { ...base, sealed: recognised.sealed, evidence: [`pattern ${recognised.pattern.name}: ${recognised.call.name} refused: ${reply.error.message}`, ...base.evidence], pattern: recognised.pattern.name }
      }
      const base = inner(text)
      return recognised ? { ...base, pattern: recognised.pattern.name, sealed: recognised.sealed } : base
    })()
    if (!num.numerals.length && !tr) return m
    return { ...m, read: { given, numerals: num.numerals, locale, untranslated: tr?.untranslated ?? [], verdictIn: tr ? translateOf(m.verdict, 'en', locale!).text : undefined } }
  }
}

const innerMatcherOf = (handle: (m: Rpc) => any, allExamples: readonly Example[], leads: readonly Lead[]): ((statement: string) => Match) => {
  const list = handle({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: { full: true } })
  const allTools: ToolSpec[] = 'result' in list ? list.result.tools : []
  const tools = allTools.filter((t) => !META.has(t.name) && !META_TOOLBOXES.has((t as { _meta?: { toolbox?: string } })._meta?.toolbox ?? ''))
  const callable = new Set(tools.map((t) => t.name))
  const examples = allExamples.filter((e) => callable.has(e.tool))
  const toolText = (t: ToolSpec) => `${t.name} ${t.description} ${Object.keys(t.inputSchema.properties ?? {}).join(' ')} ${Object.values(t.inputSchema.properties ?? {}).flatMap((p) => (p.enum ?? []).map(String)).join(' ')}`
  // an example's arguments enter the index by their words, never by their keys or their punctuation: a key named `now` is not a statement about now
  const leaves = (v: unknown): string[] => (typeof v === 'string' ? [v] : typeof v === 'number' ? [String(v)] : Array.isArray(v) ? v.flatMap(leaves) : v && typeof v === 'object' ? Object.values(v as Record<string, unknown>).flatMap(leaves) : [])
  const exampleText = (e: Example) => `${e.tool} ${e.id} ${e.shows} ${leaves(e.arguments).join(' ')}`
  const leadText = (l: Lead) => `${l.id} ${l.statement} ${l.source} ${l.tool ?? ''} ${l.reason ?? ''}`
  const w = weightsOf([...tools.map(toolText), ...examples.map(exampleText), ...leads.map(leadText)])
  const toolTok = tools.map((t) => tokens(toolText(t)))
  const exTok = examples.map((e) => tokens(exampleText(e)))
  const theoremTok = THEOREMS.map((t) => tokens(`${t.key} ${t.key.replace(/_/g, ' ')} ${t.statement}`))
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
  // 2. Solve first by the QPU textbook: a statement that names a kernel-accepted theorem (its key, or the words of its statement)
  //    is served by that theorem, proven, before any tool is called.
  const substantiveQ = q.filter((t) => !BRAND.has(t))
  if (substantiveQ.length) {
    // the textbook answers when the statement names a theorem: every word of its key is in the statement, and either the key has
    // two words or more (mersenne 127, sigma reflect, relation 15) or the statement is little more than the key (a one-word key
    // such as `qubits` or `energy` serves only the bare word; a question about Willow's qubits stays with the processor tool, the hydrogen energy with the mirror's chemistry)
    let best: { key: string; statement: string; hits: number } | null = null
    for (const [i, th] of THEOREMS.entries()) {
      const keyWords = th.key.toLowerCase().split(/[_.]+/).filter((k) => k.length > 1)
      const named = keyWords.length > 0 && keyWords.every((k) => q.includes(k)) && (keyWords.length >= 2 || substantiveQ.length === 1)
      if (!named) continue
      const hits = overlap(q, theoremTok[i]!) + 2
      if (!best || hits > best.hits || (hits === best.hits && th.key.length > best.key.length)) best = { key: th.key, statement: th.statement, hits }
    }
    if (best) {
      // the next steps, combinatorially: every other theorem of the same module, the textbook's neighbourhood, ranked by the words shared
      const module = THEOREMS.find((t) => t.key === best!.key)?.module
      const cluster: Candidate[] = THEOREMS.map((t, i) => ({ t, i })).filter(({ t }) => t.module === module && t.key !== best!.key).map(({ t, i }) => ({ kind: 'theorem' as const, id: t.key, score: overlap(q, theoremTok[i]!), hits: overlap(q, theoremTok[i]!), text: t.statement })).sort((a, b) => b.score - a.score)
      return { statement, verdict: 'served', theorem: best.key, evidence: [`proven by the kernel: theorem ${best.key}: ${best.statement}`, `next steps in the textbook: ${cluster.length} theorem(s) of ${module}`], candidates: [{ kind: 'theorem', id: best.key, score: best.hits, hits: best.hits, text: best.statement }], cluster, verify: [], reflection: { factors: [], angles: [], queries: [], leads: [], found: [] }, lead: { id: slug(statement), source: 'statement', statement, status: 'served', tool: 'clay', reason: `theorem ${best.key}` } }
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

  // When in doubt: the hidden factors and angles in the reflection of the analog, each a lead to develop.
  const integers = [...new Set((statement.match(/\b\d+\b/g) ?? []).map(Number).filter((n) => n >= 2))]
  const factors: Reflection['factors'] = integers.map((n) => {
    const shor = tools.find((t) => t.name === 'algorithm')?.inputSchema.properties?.N
    if (shor && typeof shor.maximum === 'number' && n <= shor.maximum && n >= (shor.minimum ?? 3)) {
      const reply = SHOR.get(n) ?? (() => { const r = toolsCall(handle, { name: 'algorithm', arguments: { name: 'shor', N: n } }); SHOR.set(n, r); return r })()
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
  const mirror = { source: `reflection of: ${statement}`, status: 'open' as const }
  const reflectionLeads: Lead[] = [
    ...factors.filter((f) => f.factors).map((f) => ({ id: `factors-${f.n}`, ...mirror, statement: `${f.n} = ${f.factors} (order ${f.order}) by ${f.by}`, tool: 'algorithm', reason: 'a hidden factor found in the reflection; verify it across the integer adaptors' })),
    ...angles.map((a) => ({ id: `angle-${a.property}-${a.x}`, ...mirror, statement: `σ_${a.d}(${a.x}) = ${a.sigma} on ${a.property}; QFT angle ${a.angle.toFixed(6)} rad`, reason: 'an angle in the reflection; Qpu.Sigma proves σ_d(σ_d(x)) = x' })),
    ...found.map((c) => ({ id: `mirror-${c.id}`, ...mirror, statement: c.text, tool: c.kind === 'tool' ? c.id : examples.find((e) => e.id === c.id)?.tool, reason: 'found only in the mirror form of the statement' })),
  ]
  const verify: VerifyRequest[] = [...new Map([...matchedLeads, ...reflectionLeads].flatMap((l) => factsOf(l).flatMap(verifyRequestsOf)).map((r) => [r.url + JSON.stringify(r.body), r])).values()]
  const reflection: Reflection = { factors, angles, queries, found, leads: reflectionLeads }, around = { candidates, cluster, verify, reflection }, asLead = { id: slug(statement), source: 'statement', statement }
  const callOf = (c: Candidate) => { const example = c.kind === 'example' ? examples.find((e) => e.id === c.id)! : examples.find((e) => e.tool === c.id), tool = c.kind === 'example' ? example!.tool : c.id, call = { name: tool, arguments: example?.arguments ?? {} }; return { example, tool, call, reply: toolsCall(handle, call) } }

  if (evidence.length > 0) {
    return { statement, verdict: 'impossible', evidence, ...around, lead: { ...asLead, status: 'blocked', reason: evidence.join('; ') } }
  }
  if ((!top || top.hits < 2) && found.length > 0) {
    const f = found[0]!, { tool, call, reply } = callOf(f)
    if ('result' in reply) return { statement, verdict: 'served', evidence: [`found in the reflection: ${f.text}`], tool, call, result: reply.result.structuredContent, ...around, cluster: [f, ...cluster], lead: { ...asLead, status: 'served', tool } }
  }
  const substantive = q.filter((t) => !BRAND.has(t))
  const coverage = top ? top.hits / Math.max(1, substantive.length) : 0
  const reason = top && top.hits >= 2 && coverage < 0.5 && found.length === 0 ? `the best match covers ${Math.round(coverage * 100)}% of the statement's words (${top.kind} ${top.id}); too little to serve it honestly; proposed as a new lead to develop`
    : !top || top.hits < 2 ? 'no tool, example or lead matches the statement, nor its reflections; proposed as a new lead to develop' : null
  if (reason || !top) return { statement, verdict: 'unknown', evidence: [reason!], ...around, lead: { ...asLead, status: 'blocked', reason: reason! } }
  if (top.kind === 'lead') {
    const lead = leads.find((l) => l.id === top.id)!
    // a lead served by a tool the matcher never calls to serve (the flow, the judges, the layouts) is answered by the lead itself: calling imagine or audit from inside a match would replay every lead inside one statement
    if (lead.status === 'served' && lead.tool && !callable.has(lead.tool)) return { statement, verdict: 'served', evidence: [`lead ${lead.id} is served by ${lead.tool}, a tool the matcher does not call to serve (it fetches, judges or lays out); the lead stands as the answer`], tool: lead.tool, ...around, lead: { ...lead, statement } }
    if (lead.status === 'served' && lead.tool) {
      const example = examples.find((e) => e.tool === lead.tool)
      const call = { name: lead.tool, arguments: example?.arguments ?? {} }
      const reply = toolsCall(handle, call)
      if ('result' in reply) return { statement, verdict: 'served', evidence: [`lead ${lead.id} is served by ${lead.tool}; called it`], tool: lead.tool, call, result: reply.result.structuredContent, ...around, lead: { ...lead, statement } }
      return { statement, verdict: 'impossible', evidence: [`lead ${lead.id} names ${lead.tool}, which refused: ${reply.error.message}`], tool: lead.tool, call, ...around, lead: { ...lead, status: 'blocked', reason: reply.error.message } }
    }
    return { statement, verdict: 'impossible', evidence: [`lead ${lead.id} is ${lead.status}: ${lead.reason ?? 'no reason recorded'}`], ...around, lead: { ...lead, statement } }
  }
  const { example, tool, call, reply } = callOf(top)
  if ('result' in reply) {
    const why = example ? example.expect(reply.result.structuredContent) : null
    return { statement, verdict: 'served', evidence: [example ? `example ${example.id}: ${why ?? 'as documented'}` : `tool ${tool} answered the call`], tool, call, result: reply.result.structuredContent, ...around, lead: { ...asLead, status: 'served', tool } }
  }
  return { statement, verdict: 'impossible', evidence: [`tool ${tool} refused: ${reply.error.message}`], tool, call, ...around, lead: { ...asLead, status: 'blocked', reason: reply.error.message } }
  }
}

export const matchOf = (statement: string, handle: (m: Rpc) => any, allExamples: readonly Example[], leads: readonly Lead[], locale?: string): Match => { const m = matcherOf(handle, allExamples, leads)(statement, locale); const route = routeOf(statement, allExamples); return { ...m, route, ...(m.verdict === 'unknown' && route.routed ? { evidence: [...m.evidence, `routed by the theorems: ${route.theorems.map((t) => `${t.theorem} (${t.shared.join(', ')})`).join('; ')}`] } : {}) } }
