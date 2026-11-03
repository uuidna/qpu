// Any statement matched against the tools, their schemas, the examples and the leads, then decided by its witnesses: served when all are
// present, impossible when one is contradicted, unknown (a new lead) when one is missing. Deterministic: no randomness, no network.

import type { Example } from './examples.ts'
import type { Lead } from './leads.ts'
import type { Rpc } from './audit.ts'
import { extractFacts, createVerifyRequests, type VerifyRequest } from './verifiers.ts'
import { listNumerals, translateOf } from './i18n.ts'
import { THEOREMS } from './theorems-index.ts'
import { TEXTBOOK_THEOREMS } from './textbook-theorems.ts'
import { TABLES } from './tables-index.ts'
import { evaluate, evaluateTheorem, getStatement, numbersOf, sidesOf } from './expressions.ts'
import { testPrimality } from './algorithms.ts'

/** A prompt routed to the kernel-accepted theorems by the weight of the words it shares with them (a word weighs ln(theorems / theorems using
 *  it), so a common word routes nowhere); each theorem's examples are its routes, and a prompt that reaches none is a lead (textbook_route_or_lead). */
const ROUTE_STOP = new Set(['many', 'much', 'more', 'most', 'when', 'what', 'which', 'where', 'there', 'here', 'with', 'from', 'into', 'over', 'under', 'every', 'each', 'that', 'this', 'these', 'those', 'have', 'does', 'only', 'also', 'then', 'than', 'them', 'they', 'their', 'about', 'after', 'before', 'same', 'other', 'another', 'never', 'none', 'nothing', 'name', 'named', 'theorem', 'textbook', 'kernel', 'qpu'])
export const routeStems = (text: string): Set<string> => new Set(text.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase().replace(/[^a-z0-9\s_.-]/g, ' ').split(/[\s_.-]+/).filter((w) => w.length > 3 && !ROUTE_STOP.has(w)).map((w) => w.replace(/(ings?|ed|es|e|s)$/, '')).filter((w) => w.length > 2))
let routeIndex: { key: string; says: string; lean: string; examples: readonly string[]; keyStems: Set<string>; stems: Set<string> }[] | null = null
let routeIdf: Map<string, number> | null = null
export const routeStatement = (statement: string, examples: readonly Example[], top?: number) => {
  if (!routeIndex || !routeIdf) {
    const textbook = new Set(TEXTBOOK_THEOREMS.map((t) => t.key))
    // a textbook theorem routes by its key and what it says, any other by its key and its module; the examples naming it are its routes
    const named = new Map<string, string[]>(); for (const e of examples) if (e.theorem) named.set(e.theorem, [...(named.get(e.theorem) ?? []), e.id])
    const keyOf = (k: string) => routeStems(k.replace(/^textbook_/, '').replace(/^Qpu\./, ''))
    routeIndex = [
      ...TEXTBOOK_THEOREMS.filter((t) => KERNEL.has(t.key)).map((t) => { const keyStems = keyOf(t.key); return { key: t.key, says: t.says, lean: t.lean, examples: [...new Set([...t.examples, ...(named.get(t.key) ?? [])])], keyStems, stems: new Set([...keyStems, ...routeStems(t.says)]) } }),
      ...THEOREMS.filter((t) => !textbook.has(t.key)).map((t) => { const keyStems = keyOf(t.key); return { key: t.key, says: `${t.module}: ${t.statement}`, lean: `theorem ${t.key} : ${t.statement}`, examples: named.get(t.key) ?? [], keyStems, stems: new Set([...keyStems, ...routeStems(t.module.replace(/^Qpu\./, ''))]) } }),
    ]
    const df = new Map<string, number>(); for (const t of routeIndex) for (const w of t.stems) df.set(w, (df.get(w) ?? 0) + 1)
    routeIdf = new Map([...df].map(([w, n]) => [w, Math.log(routeIndex!.length / n)]))
  }
  // a word of the theorem's key weighs twice; a route needs two shared words or one key word, above the threshold
  const s = routeStems(statement)
  const ranked = routeIndex.map((t) => { const shared = [...t.stems].filter((w) => s.has(w)); const subject = shared.filter((w) => t.keyStems.has(w)); return { t, shared, subject, weight: shared.reduce((n, w) => n + (routeIdf!.get(w) ?? 0) * (t.keyStems.has(w) ? 2 : 1), 0) } }).filter((r) => (r.shared.length >= 2 || r.subject.length >= 1) && r.weight >= ROUTE_THRESHOLD).sort((a, b) => b.weight - a.weight || a.t.key.localeCompare(b.t.key)).slice(0, top ?? Infinity) // top undefined: every theorem past the threshold, used at once (no cap — both sides, however many)
  const byId = new Map(examples.map((e) => [e.id, e]))
  const theorems = ranked.map((r) => ({ theorem: r.t.key, lean: r.t.lean, says: r.t.says, shared: r.shared, subject: r.subject, weight: Math.round(r.weight * 100) / 100, routes: r.t.examples.map((id) => byId.get(id)).filter((e): e is Example => !!e).map((e) => ({ example: e.id, call: { name: e.tool, arguments: e.arguments } })) }))
  return { routed: theorems.length > 0, theorems, threshold: ROUTE_THRESHOLD, theorem: 'textbook_route_or_lead', says: theorems.length ? `routed to ${theorems.map((t) => t.theorem).join(', ')} by the weight of the words the prompt shares with them` : 'no theorem reached by its subject or two specific words: the prompt is a lead' }
}
/** a route needs the weight of a word only one or two theorems use plus another: ln(n / 2) for the rarest is about four and a half */
const ROUTE_THRESHOLD = 5
const KERNEL = new Set(THEOREMS.map((t) => t.key))
/** A routed textbook theorem computed as the match and the chat read it, the statement's whole numbers bound to its variables in order; null
 *  for a theorem quantified or needing a value the statement lacks. */
export const evaluateRouted = (theorem: string, statement: string) => {
  const t = TEXTBOOK_THEOREMS.find((x) => x.key === theorem), nums = numbersOf(statement).filter((n) => /^\d+$/.test(n)); if (!t) return null
  const values: Record<string, string> = Object.fromEntries(getStatement(t.lean).variables.flatMap((v, i) => (nums[i] ? [[v, nums[i]]] : []))), ev = evaluateTheorem(theorem, values) as { evaluable?: boolean; needs?: string[] }
  return ev.evaluable && !ev.needs?.length ? { theorem, lean: t.lean, values } : null
}
/** A number read exactly as digits × 10^e (6.62607015e-34 is 662607015e-42); a stated one agrees with a witness's when equal, a decimal to the
 *  places it is written to (3.5 agrees with 3.47). */
const decOf = (s: string) => { const m = /^(\d+)(?:\.(\d+))?(?:e([-+]?\d+))?$/i.exec(s.trim()); return m ? { d: BigInt(m[1]! + (m[2] ?? '')), e: Number(m[3] ?? 0) - (m[2] ?? '').length, exact: !m[2] && !m[3] } : null }
const agree = (stated: string, witness: string) => { const s = decOf(stated), w = decOf(witness); if (!s || !w) return false; const k = 10n ** BigInt(Math.abs(s.e - w.e)); return w.e >= s.e ? w.d * k === s.d : s.exact ? w.d === s.d * k : (2n * w.d + k) / (2n * k) === s.d }
/** A negation; a value claimed (a number after a verb or =, never inside a word or an expression, its unit after it, a percent in hundredths);
 *  an arithmetic relation. */
const NEGATION = /\b(?:not|never|false|untrue|wrong|cannot|disprove[sd]?|refute[sd]?)\b|\b\w+n['’]t\b/gi
const VERB = /\b(?:is|are|was|were|equals?|has|have|had|makes?|gives?|totals?)\b/.source
const CLAIM = new RegExp(`(${VERB}\\s*(?:to\\s+|about\\s+|exactly\\s+)?|=\\s*)?(?<![\\w.-])(\\d[\\d,.]*(?:e[-+]?\\d+)?)(%?)(?![.,]?\\w)(?!\\s*[+\\-−*/×·^]\\s*[\\w(])(\\s+(?!${VERB})[a-z]+)?`, 'gi')
const RELATION = /(?<![\w.])[\d(][\d\s().,+\-*/%^×·−]*?(?:=|≠|≤|≥|<|>)[\d\s().,+\-*/%^×·−]*\d\)*/g
import { uuidOf, navigate } from './unit/blocks.ts'

type Verdict = 'served' | 'impossible' | 'unknown'
/** The unit's verdict vocabularies mapped onto this tree's, so a verdict crossing the border is translated, never guessed.
 *  verify_claim: VERIFIED / UNVERIFIED / REFUTED; due process: PROVEN / NOT-PROVEN / REFUTED. */
const VERDICTS: Record<string, Verdict> = { VERIFIED: 'served', PROVEN: 'served', REFUTED: 'impossible', UNVERIFIED: 'unknown', 'NOT-PROVEN': 'unknown', NOT_PROVEN: 'unknown' }
export const translateVerdict = (foreign: string): Verdict | undefined => VERDICTS[foreign.toUpperCase().replace(/\s+/g, '-')]
export const listForeignVerdicts = (v: Verdict): string[] => Object.entries(VERDICTS).filter(([, ours]) => ours === v).map(([theirs]) => theirs)
type Witnesses = Record<'present' | 'missing' | 'contradicted', string[]>
type Candidate = { kind: 'tool' | 'example' | 'lead' | 'theorem'; id: string; score: number; hits: number; text: string }
type Reflection = {
  /** the statement's integers factored by the Shor tool within its bound; beyond it, the bound is the answer */
  factors: { n: number; factors?: string; order?: string; by: string }[]
  /** each number against the nearest schema bound d: its σ-reflection d − x (Qpu.Sigma) and the QFT angle 2πx/d */
  angles: { x: number; property: string; d: number; sigma: number; angle: number }[]
  /** the statement in its mirror forms (reflectStatement) */
  queries: string[]
  /** what the reflections found that the digital tokens did not */
  found: Candidate[]
  /** every reflection as a lead to develop */
  leads: Lead[]
}

type Match = { /** the content address of the recognised call: a recognition is a block like any other */ sealed?: string;
  statement: string
  verdict: Verdict
  evidence: string[]
  tool?: string
  /** the kernel-accepted theorem that serves the statement, when the textbook answers first */
  theorem?: string
  /** the theorems the prompt is routed to (routeStatement) */
  route?: ReturnType<typeof routeStatement>
  /** the pattern the statement carried (a UUID, a relation name, a dashboard, a clone…), when one was recognised */
  pattern?: string
  /** the share of the statement's words the serving match covers, and whether it is too weak to claim the match */
  coverage?: number
  /** the example whose replay answered it; its witnesses, present (recomputed now), contradicted or missing (named); the state they leave: gas
   *  (one missing), liquid (all present), solid (all present, the kernel accepting the theorem naming the answer) or collision */
  example?: string
  witnesses?: Witnesses
  state?: 'gas' | 'liquid' | 'solid' | 'collision'
  weak?: boolean
  call?: { name: string; arguments: Record<string, unknown> }
  result?: unknown
  candidates: Candidate[]
  /** the served possibilities around the statement, ranked */
  cluster: Candidate[]
  /** where the client's own MCP verifies each fact live (this handler does no I/O) */
  verify: VerifyRequest[]
  /** the hidden factors and angles in the reflection, each a lead to develop */
  reflection: Reflection
  /** the statement's address navigated: its program-space neighbours as an executed UUID stream, computed on request, none stored */
  possibilities?: ReturnType<typeof navigate>
  /** the statement as a lead: served with its tool, blocked with the proof, or open */
  lead: Lead
  /** how it was read: Glagolitic numerals as integers, a locale translated by vocabulary */
  read?: { given: string; numerals: { glyphs: string; value: number }[]; locale?: string; untranslated: string[]; verdictIn?: string }
}

/** The surface's own names: they name where, never what, so they count for nothing in coverage. */
const BRAND = new Set(['qpu', 'uuidna', 'mcp', 'tool', 'tools'])
const STOP = new Set(['the', 'a', 'an', 'of', 'per', 'to', 'in', 'on', 'for', 'and', 'or', 'is', 'are', 'it', 'its', 'with', 'as', 'by', 'at', 'from', 'this', 'that', 'be', 'can', 'do', 'does', 'what', 'how', 'me', 'i', 'you', 'we', 'please', 'show', 'give', 'run', 'use', 'using', 'now', 'today', 'here', 'there', 'then', 'just', 'also', 'very', 'any', 'all', 'some', 'one', 'two', 'not', 'no', 'yes', 'has', 'have', 'had', 'was', 'were', 'will', 'would', 'should', 'may', 'might', 'into', 'over', 'under', 'than', 'when', 'where', 'which', 'who', 'why'])
export const tokens = (text: string): string[] => text.toLowerCase().replace(/[^a-z0-9.\s_-]/g, ' ').split(/[\s_-]+/).map((t) => t.replace(/^\.+|\.+$/g, '')).filter((t) => t.length > 1 && !STOP.has(t))

/** The words two texts share, each counted by its weight: one, the surface's own names none. */
const overlap = (a: string[], b: string[], w: (t: string) => number = (t) => (BRAND.has(t) ? 0 : 1)): number => {
  const set = new Set(b)
  let n = 0
  for (const t of new Set(a)) if (set.has(t)) n += w(t)
  return n
}

/** Rare words rank higher than common ones: a term's weight is 1 / (1 + ln df) over every text the surface can match. */
const weighTerms = (texts: string[]): ((t: string) => number) => {
  const df = new Map<string, number>()
  for (const text of texts) for (const t of new Set(tokens(text))) df.set(t, (df.get(t) ?? 0) + 1)
  return (t) => 1 / (1 + Math.log(df.get(t) ?? 1))
}

type ToolSpec = { name: string; description: string; inputSchema: { properties?: Record<string, { type?: string; enum?: unknown[]; maximum?: number; minimum?: number; description?: string }> } }

/** Words in a statement that name a bounded parameter, and the number that follows or precedes them. */
const BOUND_WORDS = TABLES.BOUND_WORDS as unknown as Record<string, string>

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

const MIRROR: Readonly<Record<string, readonly string[]>> = TABLES.MIRROR as Readonly<Record<string, readonly string[]>>
/** The stem of a word: token/tokens, list/listing meet on one form. */
export const stem = (t: string): string => t.replace(/(ing|ed|es|s)$/, '')
/** A text's words as stems (camelCase split; numbers, the surface's names and negations dropped); every number a result states with the
 *  words naming it: the keys on its path and the labels beside and above it (says names nothing). */
const stemsOf = (text: string) => tokens(text.replace(/([a-z])([A-Z])/g, (_, a: string, b: string) => `${a} ${b}`).replace(NEGATION, () => ' ')).filter((t) => /^[a-z]/.test(t) && !BRAND.has(t)).map(stem)
const valuesOf = (v: unknown, at = '', words: readonly string[] = []): { n: string; at: string; words: Set<string> }[] => {
  const o = (v && typeof v === 'object' ? v : {}) as Record<string, unknown>, n = 'mantissa' in o ? `${o.mantissa}e${o.exponent}` : String(v), labels = Object.entries(o).flatMap(([k, x]) => (k !== 'says' && typeof x === 'string' && !decOf(x) ? stemsOf(x) : []))
  return (typeof v !== 'object' || 'mantissa' in o) ? (decOf(n) ? [{ n, at, words: new Set(words) }] : []) : Object.entries(o).flatMap(([k, x]) => valuesOf(x, Array.isArray(v) ? `${at}[${k}]` : at ? `${at}.${k}` : k, [...words, ...labels, ...(Array.isArray(v) ? [] : stemsOf(k))]))
}
/** The values a text claims, each with its subject (the words before it in its clause, and its unit), after a verb or anywhere when bare; a
 *  number alone in its clause continues the claim before it (the factors are 3 and 7); an input is no claim. */
const claimsOf = (text: string, bare = false, taken: readonly string[] = []) => {
  let last: string[] = []
  return text.split(/[,;]|\band\b|\bbut\b/).flatMap((clause) => [...clause.matchAll(CLAIM)].flatMap((c) => {
    const n = numbersOf(c[2]!)[0], before = stemsOf(`${clause.slice(0, c.index)} ${c[4] ?? ''}`), more = !c[1] && !before.length && last.length > 0
    if (!n || !(bare || c[1] || more) || taken.some((x) => agree(n, x))) return []
    last = before.length ? before : more ? last : stemsOf(text)
    return [{ n: c[3] ? `${n}e-2` : n, shown: n + c[3], subject: last }]
  }))
}
/** The statement in its mirror forms: stems, the sources' synonyms and complements, and the number-free analog. */
export const reflectStatement = (statement: string): string[] => {
  const q = tokens(statement)
  const out = new Set<string>()
  const stems = q.map(stem).filter((t) => t.length > 1)
  if (stems.join(' ') !== q.join(' ')) out.add(stems.join(' '))
  for (const t of q) // own keys only: constructor or prototype must never read the object's built-ins
  for (const m of (Object.hasOwn(MIRROR, t) ? MIRROR[t] : Object.hasOwn(MIRROR, stem(t)) ? MIRROR[stem(t)] : undefined) ?? []) out.add([...q.filter((x) => x !== t), m].join(' '))
  const numberFree = q.filter((t) => !/^\d/.test(t))
  if (numberFree.length && numberFree.length !== q.length) out.add(numberFree.join(' '))
  return [...out].filter((r) => r !== q.join(' '))
}

const slug = (text: string): string => tokens(text).slice(0, 6).join('-') || 'statement'

/** Tools the matcher never calls to serve a statement: itself, the judges and layouts, the doors that run any tool they are handed (prose,
 *  payload) and every toolbox that fetches, bills or audits. A pattern may still open any door by name. */
const META = new Set(['match', 'audit', 'verify', 'metrics', 'textbook', 'dashboard', 'clone', 'css', 'prose', 'payload'])
const META_TOOLBOXES = new Set(['flow', 'legal', 'repository', 'billing', 'standards', 'payload', 'extension'])

/** Shor's factoring of a small N on the simulator is deterministic: once per process; a matcher's index is built once. */
const SHOR = new Map<number, any>()
type Inner = { match: (statement: string) => Match; judge: (statement: string, m: Match, route?: ReturnType<typeof routeStatement>) => Match }
const INDEXES = new WeakMap<readonly Lead[], WeakMap<readonly Example[], Inner>>()
const indexOf = (handle: (m: Rpc) => any, allExamples: readonly Example[], leads: readonly Lead[]): Inner => {
  const byExamples = INDEXES.get(leads) ?? new WeakMap(); INDEXES.set(leads, byExamples)
  const found = byExamples.get(allExamples); if (found) return found
  const built = createInnerMatcher(handle, allExamples, leads); byExamples.set(allExamples, built); return built
}
/** The shapes a statement can carry and the door each opens, recognised before the token match. */
type Pattern = { name: string; test: RegExp; tool: string; args: (m: RegExpMatchArray, statement: string) => Record<string, unknown>; shows: string }
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
  { name: 'shor', test: /\bfactor(?:ise|ize)?\s+(\d+)\b/i, tool: 'algorithm', args: (m) => (BigInt(m[1]!) <= 21n ? { name: 'shor', N: Number(m[1]) } : { name: 'factor', integer: m[1]! }), shows: 'an integer factored: by Shor within the state-vector bound, by the classical door beyond it' },
  { name: 'prime', test: /\bis\s+(\d+)\s+(?:a\s+)?prime\b/i, tool: 'algorithm', args: (m) => ({ name: 'factor', integer: m[1]! }), shows: 'an integer of any size decided prime or composite (Miller–Rabin) and factored within its budget' },
  // an exploit is re-fused to patching: a hack, vulnerability, breach or CVE opens audit { repair } (a live patch, or a remediation lead), never a denial
  { name: 'repair', test: /\b(?:hack(?:ed|ing)?|exploit(?:ed|s|ing)?|vulnerab(?:le|ility|ilities)|breach(?:ed|es)?|compromis(?:e|ed)|malware|ransomware|CVE-\d{4}-\d{1,7})\b/i, tool: 'audit', args: (m, statement) => { const cve = /\bCVE-\d{4}-\d{1,7}\b/i.exec(statement)?.[0]; const mod = /\b(?:in|package|module|library|dependency|the)\s+([a-z0-9@._/-]{2,})/i.exec(statement)?.[1] ?? /\b(linux|kernel|openssl|openssh|glibc|systemd|sudo|log4j|node)\b/i.exec(statement)?.[1]; return { repair: [{ module: (mod ?? 'reported').toLowerCase(), severity: 'critical', ...(cve ? { cve } : {}), title: statement }] } }, shows: 'an exploit re-fused to the patching tool: audit { repair } ranks the kernel first, live-patches with no reboot (SLA 100%), turns an unpatched advisory into a remediation lead — the attack becomes a patch, never a denial' },
  // splitting under a bound (bytes): the quoted text, or the statement itself
  { name: 'fold', test: /\b(?:split|fold|shard)\b[^"'\n]*?(?:"([^"]+)"|'([^']+)')?[^"'\n]*?\b(?:under|into pieces of|by|bound(?: of)?)\s+(\d+)\s*(?:bytes?|b)?\b/i, tool: 'fold', args: (m, statement) => ({ text: m[1] ?? m[2] ?? statement, bound: Number(m[3]) }), shows: 'a text folded into pieces under a bound: each piece addressed, the whole by its root, the bound a reflective boundary' },
  // sealing: a text named by its SHA-256, its fold address and, with a key, its HMAC
  { name: 'seal', test: /\b(?:seal|sha-?256|hmac|hash)\b\s*(?:of\s+|:\s*)?(?:"([^"]+)"|'([^']+)')?(?:.*?\bwith (?:the )?key\s+(?:"([^"]+)"|'([^']+)'|(\S+)))?/i, tool: 'seal', args: (m, statement) => ({ text: m[1] ?? m[2] ?? statement, ...(m[3] ?? m[4] ?? m[5] ? { key: m[3] ?? m[4] ?? m[5] } : {}) }), shows: 'a text sealed: SHA-256, the fold address, and the HMAC under the key named' },
]
/** The pattern a statement carries, if any, and the call it makes; the first pattern that matches wins, in the order above. */
export const getPattern = (statement: string): { pattern: Pattern; call: { name: string; arguments: Record<string, unknown> }; sealed: string } | null => {
  for (const p of PATTERNS) { const m = statement.match(p.test); if (m) { const call = { name: p.tool, arguments: p.args(m, statement) }; return { pattern: p, call, sealed: uuidOf(`${call.name}${JSON.stringify(call.arguments)}`) } } }
  return null
}

/** One tools/call through the handler the matcher was given. */
const toolsCall = (handle: (m: Rpc) => any, params: unknown) => handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params })
export const createMatcher = (handle: (m: Rpc) => any, allExamples: readonly Example[], leads: readonly Lead[]): ((statement: string, locale?: string) => Match) => {
  const { match: inner, judge } = indexOf(handle, allExamples, leads)
  return (given: string, locale?: string): Match => {
    const num = listNumerals(given)
    const tr = locale && locale !== 'en' ? translateOf(num.text, locale, 'en') : null
    const text = tr ? tr.text : num.text
    const recognised = getPattern(text)
    // whichever door answers, the judge decides; the route is read when the statement states a number
    const route = numbersOf(text).length ? routeStatement(text, allExamples) : undefined
    const m = { ...judge(text, (() => {
      if (recognised && recognised.call.name !== 'leads') {
        const reply = toolsCall(handle, recognised.call)
        const base = inner(text)
        if ('result' in reply) return { ...base, verdict: 'served' as const, tool: recognised.call.name, call: recognised.call, result: reply.result.structuredContent, example: undefined, sealed: recognised.sealed, evidence: [`pattern ${recognised.pattern.name}: ${recognised.pattern.shows}; ${recognised.call.name} answered`, ...base.evidence], pattern: recognised.pattern.name, lead: { ...base.lead, status: 'served' as const, tool: recognised.call.name } }
        return { ...base, sealed: recognised.sealed, evidence: [`pattern ${recognised.pattern.name}: ${recognised.call.name} refused: ${reply.error.message}`, ...base.evidence], pattern: recognised.pattern.name }
      }
      const base = inner(text)
      return recognised ? { ...base, pattern: recognised.pattern.name, sealed: recognised.sealed } : base
    })(), route), route }
    if (!num.numerals.length && !tr) return m
    return { ...m, read: { given, numerals: num.numerals, locale, untranslated: tr?.untranslated ?? [], verdictIn: tr ? translateOf(m.verdict, 'en', locale!).text : undefined } }
  }
}

const createInnerMatcher = (handle: (m: Rpc) => any, allExamples: readonly Example[], leads: readonly Lead[]): Inner => {
  const list = handle({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: { full: true } })
  const allTools: ToolSpec[] = 'result' in list ? list.result.tools : []
  const tools = allTools.filter((t) => !META.has(t.name) && !META_TOOLBOXES.has((t as { _meta?: { toolbox?: string } })._meta?.toolbox ?? ''))
  const callable = new Set(tools.map((t) => t.name))
  const examples = allExamples.filter((e) => callable.has(e.tool))
  const toolText = (t: ToolSpec) => `${t.name} ${t.description} ${Object.keys(t.inputSchema.properties ?? {}).join(' ')} ${Object.values(t.inputSchema.properties ?? {}).flatMap((p) => (p.enum ?? []).map(String)).join(' ')}`
  // an example's arguments enter the index by their words, never their keys (a key named `now` is no statement about now)
  const leaves = (v: unknown): string[] => (typeof v === 'string' ? [v] : typeof v === 'number' ? [String(v)] : Array.isArray(v) ? v.flatMap(leaves) : v && typeof v === 'object' ? Object.values(v as Record<string, unknown>).flatMap(leaves) : [])
  const exampleText = (e: Example) => `${e.tool} ${e.id} ${e.shows} ${leaves(e.arguments).join(' ')}`
  const leadText = (l: Lead) => `${l.id} ${l.statement} ${l.source} ${l.tool ?? ''} ${l.reason ?? ''}`
  const w = weighTerms([...tools.map(toolText), ...examples.map(exampleText), ...leads.map(leadText)])
  const toolTok = tools.map((t) => tokens(toolText(t)))
  const exTok = examples.map((e) => tokens(exampleText(e)))
  const theoremTok = THEOREMS.map((t) => tokens(`${t.key} ${t.key.replace(/_/g, ' ')} ${t.statement}`))
  const leadTok = leads.map((l) => tokens(leadText(l)))
  const servedLeads = new Set(leads.filter((l) => l.status === 'served').map((l) => l.id))
  const bounds: { property: string; d: number }[] = tools.flatMap((t) => Object.entries(t.inputSchema.properties ?? {}).filter(([, p]) => typeof p.maximum === 'number').map(([property, p]) => ({ property, d: p.maximum as number })))
  /** each bound a statement names and the schema bounds it exceeds */
  const boundsOf = (statement: string) => numbersNear(statement).map(({ property, value, phrase }) => ({ property, phrase, text: /\d+(?:\.\d+)?/.exec(phrase)![0], exceeded: tools.flatMap((t) => { const p = t.inputSchema.properties?.[property]; return p && typeof p.maximum === 'number' && (value > p.maximum || (typeof p.minimum === 'number' && value < p.minimum)) ? [`${t.name}.${property} is bounded to [${p.minimum ?? '…'}, ${p.maximum}] by its schema; the statement asks for ${phrase}${p.description ? ` (${p.description})` : ''}`] : [] }) }))

  const match = (statement: string): Match => {
  const q = tokens(statement), substantive = q.filter((t) => !BRAND.has(t))
  // the textbook first: a statement naming a kernel-accepted theorem is served by it before any tool is called; named means every word of its
  // key is in the statement and the key has two words (sigma reflect) or the statement is the bare word (Willow's qubits stay with the processor)
  if (substantive.length) {
    let best: { key: string; statement: string; hits: number } | null = null
    for (const [i, th] of THEOREMS.entries()) {
      const keyWords = th.key.toLowerCase().split(/[_.]+/).filter((k) => k.length > 1)
      const named = keyWords.length > 0 && keyWords.every((k) => q.includes(k)) && (keyWords.length >= 2 || substantive.length === 1)
      if (!named) continue
      const hits = overlap(q, theoremTok[i]!) + 2
      if (!best || hits > best.hits || (hits === best.hits && th.key.length > best.key.length)) best = { key: th.key, statement: th.statement, hits }
    }
    if (best) {
      // the next steps: the other theorems of its module, ranked by the words shared
      const module = THEOREMS.find((t) => t.key === best!.key)?.module
      const cluster: Candidate[] = THEOREMS.map((t, i) => ({ t, i })).filter(({ t }) => t.module === module && t.key !== best!.key).map(({ t, i }) => ({ kind: 'theorem' as const, id: t.key, score: overlap(q, theoremTok[i]!), hits: overlap(q, theoremTok[i]!), text: t.statement })).sort((a, b) => b.score - a.score)
      return { statement, verdict: 'served', theorem: best.key, evidence: [`proven by the kernel: theorem ${best.key}: ${best.statement}`, `next steps in the textbook: ${cluster.length} theorem(s) of ${module}`], candidates: [{ kind: 'theorem', id: best.key, score: best.hits, hits: best.hits, text: best.statement }], cluster, verify: [], reflection: { factors: [], angles: [], queries: [], leads: [], found: [] }, lead: { id: slug(statement), source: 'statement', statement, status: 'served', tool: 'clay', reason: `theorem ${best.key}` } }
    }
  }
  const candidates: Candidate[] = []
  for (const [i, t] of tools.entries()) {
    const tt = toolTok[i]!
    const hits = overlap(q, tt) + (q.includes(t.name.toLowerCase()) ? 2 : 0)
    if (hits > 0) candidates.push({ kind: 'tool', id: t.name, score: overlap(q, tt, w) + (q.includes(t.name.toLowerCase()) ? 2 : 0), hits, text: t.description })
  }
  for (const [i, e] of examples.entries()) {
    const et = exTok[i]!
    const hits = overlap(q, et)
    if (hits > 0) candidates.push({ kind: 'example', id: e.id, score: overlap(q, et, w) + 0.5, hits: hits + 1, text: e.shows })
  }
  for (const [i, l] of leads.entries()) {
    const lt = leadTok[i]!
    const hits = overlap(q, lt)
    if (hits > 0) candidates.push({ kind: 'lead', id: l.id, score: overlap(q, lt, w), hits, text: `${l.status}${l.tool ? ` by ${l.tool}` : ''}${l.reason ? `: ${l.reason}` : ''}` })
  }
  candidates.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
  const top = candidates[0]
  const cluster = candidates.filter((c) => c.kind === 'example' || c.kind === 'tool' || servedLeads.has(c.id))
  const matchedLeads = candidates.filter((c) => c.kind === 'lead').map((c) => leads.find((l) => l.id === c.id)!).filter((l) => l.source && l.source !== 'statement')

  // the hidden factors and angles in the reflection, each a lead
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
  const queries = reflectStatement(statement)
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
  const verify: VerifyRequest[] = [...new Map([...matchedLeads, ...reflectionLeads].flatMap((l) => extractFacts(l).flatMap(createVerifyRequests)).map((r) => [r.url + JSON.stringify(r.body), r])).values()]
  const possibilities = navigate(uuidOf(statement), { execute: true })
  const reflection: Reflection = { factors, angles, queries, found, leads: reflectionLeads }, around = { candidates, cluster, verify, reflection, possibilities }, asLead = { id: slug(statement), source: 'statement', statement }
  const callOf = (c: Candidate) => { const example = c.kind === 'example' ? examples.find((e) => e.id === c.id)! : examples.find((e) => e.tool === c.id), tool = c.kind === 'example' ? example!.tool : c.id, call = { name: tool, arguments: example?.arguments ?? {} }; return { example, tool, call, reply: toolsCall(handle, call) } }

  if ((!top || top.hits < 2) && found.length > 0) {
    // the reflection serves as an example does: its replay as documented and its share of the statement's words are its witnesses
    const f = found[0]!, { example, tool, call, reply } = callOf(f), share = f.hits / Math.max(1, substantive.length)
    if ('result' in reply && share >= 0.7 && (!example || example.expect(reply.result.structuredContent) === null)) return { statement, verdict: 'served', evidence: [`found in the reflection: ${f.text}`], tool, call, result: reply.result.structuredContent, example: example?.id, coverage: share, ...around, cluster: [f, ...cluster], lead: { ...asLead, status: 'served', tool } }
  }
  const coverage = top ? top.hits / Math.max(1, substantive.length) : 0
  const reason = top && top.hits >= 2 && coverage < 0.5 && found.length === 0 ? `the best match covers ${Math.round(coverage * 100)}% of the statement's words (${top.kind} ${top.id}); too little to serve it honestly; proposed as a new lead to develop`
    : !top || top.hits < 2 ? 'no tool, example or lead matches the statement, nor its reflections; proposed as a new lead to develop' : null
  if (reason || !top) return { statement, verdict: 'unknown', evidence: [reason!], ...around, lead: { ...asLead, status: 'blocked', reason: reason! } }
  if (top.kind === 'lead') {
    const lead = leads.find((l) => l.id === top.id)!
    // a lead's status is the docket's record, never a witness recomputed now: served by a door the matcher does not call (calling imagine or
    // audit here would replay every lead), its call is the witness missing
    if (lead.status === 'served' && lead.tool && !callable.has(lead.tool)) return { statement, verdict: 'unknown', evidence: [`lead ${lead.id} is served by ${lead.tool}, a tool the matcher does not call to serve (it fetches, judges or lays out): the call that witnesses it is not made here`], tool: lead.tool, ...around, lead: { ...asLead, status: 'open', tool: lead.tool, reason: `the call to ${lead.tool} is its witness` } }
    if (lead.status === 'served' && lead.tool) {
      const { call, reply } = callOf({ kind: 'tool', id: lead.tool, score: 0, hits: 0, text: '' })
      if ('result' in reply) return { statement, verdict: 'served', evidence: [`lead ${lead.id} is served by ${lead.tool}; called it`], tool: lead.tool, call, result: reply.result.structuredContent, ...around, lead: { ...lead, statement } }
      return { statement, verdict: 'impossible', evidence: [`lead ${lead.id} names ${lead.tool}, which refused: ${reply.error.message}`], tool: lead.tool, call, ...around, lead: { ...lead, status: 'blocked', reason: reply.error.message } }
    }
    return { statement, verdict: 'unknown', evidence: [`lead ${lead.id} is ${lead.status}: ${lead.reason ?? 'no reason recorded'}`], ...around, lead: { ...lead, statement } }
  }
  const { example, tool, call, reply } = callOf(top)
  if ('result' in reply) {
    const why = example ? example.expect(reply.result.structuredContent) : null
    // only the proven is admitted (legal_only_the_proven_is_admitted): a weak or unreplayed match is unknown, a discovery lead, never a false "served"
    if (coverage < 0.7 || (example && why !== null)) return { statement, verdict: 'unknown', evidence: [`honesty hooked to the court (legal_only_the_proven_is_admitted — only the proven is admitted): the best match ${example ? `example ${example.id}` : `tool ${tool}`} ${why !== null ? `does not replay as documented (${why})` : `covers only ${Math.round(coverage * 100)}% of the statement`} — not admitted as served; the overclaim is processed as an underclaim (textbook_claim_prove_involution: a claim never exceeds the proven) and routed towards discovery for verified online research`], tool: 'discover', coverage, ...around, lead: { ...asLead, status: 'open', tool: 'discover', reason: `overclaim processed as underclaim (${Math.round(coverage * 100)}% coverage); the court admits only the proven — discover and verify online, then it is a lead or a served proof` } }
    return { statement, verdict: 'served', evidence: [example ? `example ${example.id}: ${why ?? 'as documented'}` : `tool ${tool} answered the call`], tool, call, result: reply.result.structuredContent, example: example?.id, coverage, weak: coverage < 0.7, ...around, lead: { ...asLead, status: 'served', tool } }
  }
  return { statement, verdict: 'impossible', evidence: [`tool ${tool} refused: ${reply.error.message}`], tool, call, ...around, lead: { ...asLead, status: 'blocked', reason: reply.error.message } }
  }
  /** One statement decided through its witnesses: its bounds against the door that answers, its arithmetic recomputed, the answer (the
   *  kernel's theorem, or the call made now and its example replayed), each value it claims against the answer's and its routed theorem's, its
   *  polarity, and the words a named theorem does not state. A number naming the answer is an input, never a claim. */
  const judge = (statement: string, m: Match, route?: ReturnType<typeof routeStatement>): Match => {
    const w: Witnesses = { present: [], missing: [], contradicted: [] }, put = (ok: boolean | null, why: string) => void w[ok === null ? 'missing' : ok ? 'present' : 'contradicted'].push(why)
    const negated = statement.search(NEGATION) >= 0, plain = statement.replace(NEGATION, () => ' '), served = m.verdict === 'served', proven = served && !!m.theorem && !m.call
    const computed = route?.theorems[0] ? evaluateRouted(route.theorems[0].theorem, statement) : null, example = examples.find((e) => e.id === m.example), theorem = THEOREMS.find((t) => t.key === m.theorem), door = allTools.find((t) => t.name === m.call?.name)
    const relations = [...plain.matchAll(RELATION)].map((r) => r[0].trim()), inputs = [...leaves(m.call?.arguments ?? {}).flatMap((v) => (m.pattern ? numbersOf(v.replace(/_/g, () => ' ')) : [v])), ...(proven ? m.theorem!.split(/[_.]/) : []), ...Object.values(computed?.values ?? {})], has = (xs: string[], n: string) => xs.some((x) => agree(n, x))
    // a bound exceeded refutes when the answering door (or no door) is bounded by it; beside a door it does not bind it is a claim (Willow has 105 qubits)
    const held = boundsOf(statement).filter((b) => !b.exceeded.length || has(inputs, b.text) || (door ? !!door.inputSchema.properties?.[b.property] : !proven))
    for (const b of held) if (!b.exceeded.length || has(inputs, b.text)) put(true, `${b.phrase}: within ${b.exceeded.length ? `the call ${m.call!.name} answered` : 'every schema bound'}`); else for (const e of b.exceeded) put(false, e)
    for (const r of relations) { try { const e = evaluate(r.replace(/[×·]/g, () => '*').replace(/−/g, () => '-'), {}); if (typeof e.value === 'boolean') put(e.value !== negated, `${r}: recomputed ${e.parts.map((x) => `${x.left} ${x.op} ${x.right}`).join(', ')}`) } catch { /* no arithmetic the evaluator reads */ } }
    // a primality claim is recomputed, never taken from a door that answered about the number (91 is prime: 91 = 7 × 13)
    for (const p of plain.matchAll(/\b(\d+)\s+is\s+(?:an?\s+)?(prime|composite)\b/gi)) { const r = testPrimality(BigInt(p[1]!)); put((r.prime === (p[2]!.toLowerCase() === 'prime')) !== negated, `${p[1]} is ${p[2]}: recomputed, ${p[1]} is ${r.prime ? 'prime' : 'composite'}${r.certain ? '' : ' (probable)'}`) }
    if (served) put(true, proven ? `the kernel accepts ${m.theorem}` : `${m.tool} answered the call now${example ? `; example ${example.id} replays as documented` : ''}`)
    else for (const e of m.evidence) if (!w.contradicted.includes(e)) put(m.verdict === 'impossible' ? false : null, e)
    // a named theorem witnesses only its own words (sigma reflect proves P equals NP)
    const wordsOf = (key = '', text = '') => new Set(stemsOf(`${key.replace(/[_.]/g, () => ' ')} ${text} ${TEXTBOOK_THEOREMS.find((t) => t.key === key)?.says ?? ''}`)), own = wordsOf(m.theorem, `${theorem?.statement} ${theorem?.module}`), near = wordsOf(computed?.theorem)
    const uncovered = proven ? [...new Set(stemsOf(plain))].filter((x) => !own.has(x)) : []
    if (uncovered.length) put(null, `the words ${uncovered.join(', ')}: ${m.theorem} states none of them`)
    // a claim is decided by the values its subject names in full, else passed by any agreeing value, else missing
    const taken = [...inputs, ...relations.flatMap(numbersOf), ...held.map((b) => b.text)]
    const claims = claimsOf(plain, proven, taken), stated = numbersOf(plain).filter((n) => !has(taken, n) && !claims.some((c) => c.shown === n || c.shown === `${n}%`))
    // a side its theorem's own words name (the order is 4) decides first
    const sides = (lean: string, by: string, words: Set<string>, values = {}) => { const named = claimsOf(TEXTBOOK_THEOREMS.find((t) => t.key === by)?.says ?? ''); return sidesOf(lean, values).map((n) => ({ n, by, words, label: named.filter((l) => agree(l.n, n)).flatMap((l) => l.subject) })) }
    const values = [...((claims.length || stated.length) && served && m.result !== undefined ? valuesOf(m.result).map((v) => ({ ...v, by: `${m.example ?? m.tool} at ${v.at}` })) : []), ...(proven && theorem ? sides(`theorem ${theorem.key} : ${theorem.statement}`, theorem.key, own) : []), ...(computed ? sides(computed.lean, computed.theorem, near, computed.values) : [])]
    for (const c of claims) {
      const all = values.map((v) => ({ ...v, full: c.subject.every((x) => v.words.has(x)), named: 'label' in v && v.label.length > 0 && v.label.every((x) => c.subject.includes(x)), agrees: agree(c.n, v.n) })), full = all.filter((v) => v.full)
      const decisive = full.some((v) => v.named) ? full.filter((v) => v.named || !('label' in v)) : full
      const ok = decisive.length ? decisive.some((v) => v.agrees) : all.some((v) => v.agrees) || null, shown = (decisive.length ? decisive : all).filter((v) => (ok ? v.agrees : ok === false))
      put(ok === null ? null : ok !== negated, `${c.shown} (${c.subject.join(' ')}): ${[...new Set(shown.map((v) => v.by))].map((b) => `${b} states ${shown.filter((v) => v.by === b).map((v) => v.n).join(', ')}`).join('; ') || 'no witness states it'}`)
    }
    // a number stated but neither an input nor a claim is witnessed only by a value equal to it (91 is prime, answered about another integer)
    for (const n of stated) if (served && !values.some((v) => agree(n, v.n))) put(null, `${n}: no witness states it`)
    if (negated && served && !claims.length && !relations.length) put(proven && !uncovered.length ? false : null, `the statement negates what ${proven ? `${m.theorem} proves` : `${m.tool} answers`}`)
    const state = w.contradicted.length ? 'collision' : w.missing.length || !w.present.length ? 'gas' : KERNEL.has(m.theorem ?? example?.theorem ?? '') ? 'solid' : 'liquid'
    const verdict = state === 'collision' ? 'impossible' : state === 'gas' && served ? 'unknown' : m.verdict, why = verdict === 'impossible' ? w.contradicted : w.missing
    return { ...m, witnesses: w, state, ...(verdict === m.verdict ? {} : { verdict, evidence: [...new Set(verdict === 'impossible' ? [...why, ...m.evidence] : [...m.evidence, ...why])], lead: { ...m.lead, status: verdict === 'impossible' ? 'blocked' : 'open', reason: why.join('; ') } }) }
  }
  return { match, judge }
}

export const matchStatement = (statement: string, handle: (m: Rpc) => any, allExamples: readonly Example[], leads: readonly Lead[], locale?: string): Match => { const m = createMatcher(handle, allExamples, leads)(statement, locale); const route = m.route ?? routeStatement(statement, allExamples); return { ...m, route, ...(m.verdict === 'unknown' && route.routed ? { evidence: [...m.evidence, `routed by the theorems: ${route.theorems.map((t) => `${t.theorem} (${t.shared.join(', ')})`).join('; ')}`] } : {}) } }
/** The news as problems: every item's title matched, so a served item carries its solution, an impossible one its proof and an unknown one a
 *  lead; the three make the items (textbook_news_problems). The client fetches the news; the match is pure. */
export const matchNews = (items: readonly { title: string; source?: string; url?: string }[], handle: (m: Rpc) => any, allExamples: readonly Example[], leads: readonly Lead[], locale?: string) => {
  const problems = items.map((it) => { const m = matchStatement(String(it.title ?? ''), handle, allExamples, leads, locale); return { source: it.source ?? null, url: it.url ?? null, problem: String(it.title ?? ''), verdict: m.verdict, solution: m.verdict === 'served' ? (m.call ?? null) : null, result: m.verdict === 'served' ? ((m as { result?: unknown }).result ?? null) : null, lead: m.verdict === 'served' ? null : (m.lead ?? { id: slug(String(it.title ?? '')), statement: String(it.title ?? ''), status: 'open' as const }) } })
  const by = (v: Verdict) => problems.filter((p) => p.verdict === v).length
  return { phase: 'news' as const, items: items.length, served: by('served'), impossible: by('impossible'), unknown: by('unknown'), problems, leads: problems.filter((p) => p.lead).map((p) => p.lead), theorems: ['textbook_news_problems'], says: `${items.length} news item(s) read as problems: ${by('served')} with a solution the surface serves, ${by('impossible')} proven out of reach, ${by('unknown')} new leads to develop — the news define the problems every day, the QPU provides the solutions` }
}
/** The day's news solved (matchNews) into a tenant's blog: each served problem a draft post (Payload publishing, the tenant's editor publishes
 *  it) bodied by its solution, the unknowns the backlog; the posts and the backlog make the items (textbook_editorial_posts). Pure. */
export const editorialOf = (items: readonly { title: string; source?: string; url?: string }[], tenant: string, handle: (m: Rpc) => any, allExamples: readonly Example[], leads: readonly Lead[], locale?: string) => {
  const news = matchNews(items, handle, allExamples, leads, locale)
  // the post body: a blogMarkdown block holding the served call and its result
  const bodyOf = (p: { problem: string; source: string | null; solution: { name: string } | null; result: unknown }) => `## ${p.problem}\n\nSolved by \`${p.solution?.name ?? 'the surface'}\`${p.source ? ` — from ${p.source}` : ''}.\n\n\`\`\`json\n${JSON.stringify(p.result ?? p.solution ?? {}, null, 2)}\n\`\`\``
  const drafts = news.problems.filter((p) => p.verdict === 'served').map((p) => ({ collection: 'posts', tenant, _status: 'draft' as const, title: p.problem, slug: slug(p.problem), source: p.source, url: p.url, content: [{ blockType: 'blogMarkdown', blogMarkdownFields: { markdown: bodyOf(p) } }], solution: p.solution, result: p.result, address: uuidOf(`post\n${tenant}\n${p.problem}`), monetisation: `priced by ${tenant}'s own catalogue (its variants and currency), sold through the tenant's ecommerce` }))
  // every unknown lead becomes its own tenant app at <slug>.uuidna.com, sold through its own catalogue
  const apps = news.problems.filter((p) => p.verdict !== 'served').map((p) => { const s = slug(p.problem); return { lead: p.lead!, slug: s, host: `${s}.uuidna.com`, app: { name: s, host: `${s}.uuidna.com` }, monetisation: `a tenant app of its own at ${s}.uuidna.com, priced by its catalogue and sold through its ecommerce`, says: `the lead "${p.problem}" implemented as the tenant app ${s}.uuidna.com` } })
  return { phase: 'editorial' as const, tenant, items: items.length, posts: drafts.length, backlog: apps.length, drafts, apps, leads: apps.map((a) => a.lead), theorems: ['textbook_editorial_posts', 'textbook_news_problems'], says: `${tenant}: ${drafts.length} solved news item(s) written as draft blog posts (the solution the body), ${apps.length} unknown ones split into tenant apps at <slug>.uuidna.com — each monetised on its own catalogue; the posts and the apps make the items, run daily as the qpu-news-solve Payload job, never auto-deployed` }
}
