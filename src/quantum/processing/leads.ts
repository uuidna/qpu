// Every lead on quantumai.google, its PDFs and the quantumlib repositories, with its status and serving tool: served, partial, blocked (the
// reason dated), out of scope (not technical content) or open; every sitemap page no hand-written lead names is a lead through leads { sitemap }.

import { TABLES } from './tables-index.ts'
import * as cirq from './cirq.ts'
import { recomputeClay } from './clay-register.ts'
import { uuid } from '../uuid/index.ts'
import { LEAD_ROWS } from './leads-index.ts'
import { quantumStandardLeads } from './quantum-vocabulary.ts'

export type LeadStatus = 'served' | 'partial' | 'blocked' | 'out_of_scope' | 'open'

export type Lead = { id: string; source: string; statement: string; status: LeadStatus; tool?: string; reason?: string; lastmod?: string; /** the door that serves it, run as the Payload job qpu-lead-run */ run?: { tool: string; arguments?: Record<string, unknown> } }

/** The src directories. Each one is an inode. A lead is developed in the inode of the module that serves it. */
const SRC_INODES = [
  'src',
  'src/app',
  'src/collections',
  'src/components',
  'src/globals',
  'src/plugins',
  'src/quantum',
  'src/quantum/password',
  'src/quantum/payload',
  'src/quantum/processing',
  'src/quantum/processing/crypto',
  'src/quantum/processing/toolboxes',
  'src/quantum/processing/unit',
  'src/quantum/uuid',
] as const

const TOOLBOX_TOOLS = new Set(['payload', 'configure', 'stripe', 'currency', 'translate', 'prose', 'fold', 'seal', 'attest', 'repository', 'legal', 'compete', 'patents', 'discover', 'e2e', 'shard', 'wave', 'readiness', 'imagine', 'jsonld', 'codes', 'validate', 'mongo', 'extend'])

/** The inode a lead is developed in: the toolbox directory when the tool lives there, otherwise the processing directory. */
const leadInode = (tool?: string): (typeof SRC_INODES)[number] => tool && TOOLBOX_TOOLS.has(tool) ? 'src/quantum/processing/toolboxes' : 'src/quantum/processing'

/** Every src inode is one superposition: 2 to the number of leads developed there. An empty inode is 2^0 = 1. */
export const inodeSuperpositions = (leads: readonly { tool?: string }[]) => {
  const counts = new Map<string, number>(SRC_INODES.map((inode) => [inode, 0]))
  for (const lead of leads) counts.set(leadInode(lead.tool), (counts.get(leadInode(lead.tool)) ?? 0) + 1)
  return SRC_INODES.map((inode) => {
    const bits = counts.get(inode) ?? 0
    return { inode, parent: inode.includes('/') ? inode.slice(0, inode.lastIndexOf('/')) : null, bits, superposition: (1n << BigInt(bits)).toString(), address: uuid(inode) }
  })
}
/** The leads that run themselves: open, partial or blocked, and naming the door that serves them; each run by next as a Payload job. */
export const listRunnableLeads = (leads: readonly Lead[]) => leads.filter((l) => l.run?.tool && l.status !== 'served' && l.status !== 'out_of_scope').map((l) => ({ lead: l.id, tool: l.run!.tool, arguments: l.run!.arguments ?? {} }))

// A cleanup lead names what was removed (paths or branches), settled by measuring its absence; this parse is shared by purify and readiness.
export const listCleanupSubjects = (l: Lead): { kind: 'branches' | 'paths'; names: string[] } | null => {
  if (!l.id.startsWith('cleanup-') || l.status !== 'out_of_scope') return null
  const branches = /^git branches (.+)$/.exec(l.source)
  return branches ? { kind: 'branches', names: branches[1]!.split(/,\s*/) } : { kind: 'paths', names: [l.source.split(/\s/)[0]!.replace(/\/$/, '')] }
}



/** The Cirq API symbols the sitemap documents that cirq.ts implements, each with its export; an entry without one is never used. */
const CIRQ_SYMBOLS = TABLES.CIRQ_SYMBOLS as unknown as readonly [symbol: string, exported: string, note: string][]
const CIRQ_EXPORT_ALIASES: Readonly<Record<string, keyof typeof cirq>> = {
  key: 'qubitKey',
  power: 'raiseGate',
  adjoint: 'adjointGate',
  expectation: 'getExpectation',
  Result: 'Simulator',
}
const EXTRA_CIRQ_SYMBOLS: readonly [symbol: string, exported: keyof typeof cirq, note: string][] = [
  ['QuantumVirtualMachine', 'QuantumVirtualMachine', 'simulated hardware validating device constraints and applying chip noise'],
  ['exponentiateGate', 'exponentiateGate', 'exp(−iθG) for every gate'],
  ['seededRandom', 'seededRandom', 'deterministic mulberry32 PRNG for reproducible sampling'],
  ['PhasedXZGate', 'phasedXZGate', 'Z^{−a} X^x Z^{a+z}: every one-qubit unitary'],
]
const CIRQ_IMPLEMENTED = new Map(
  [...CIRQ_SYMBOLS, ...EXTRA_CIRQ_SYMBOLS]
    .map(([symbol, exported, note]) => [symbol, (exported in cirq ? exported : CIRQ_EXPORT_ALIASES[exported]) ?? '', note] as const)
    .filter(([, exported]) => exported in cirq)
    .map(([symbol, exported, note]) => [symbol, { exported, note }]),
)

/** The paths a hand-written lead names on quantumai.google, so the sitemap's leads do not repeat them. */
const coveredPaths = (): Set<string> => {
  const covered = new Set<string>()
  // every lead Payload holds names the pages it covers, the sitemap's own leads aside (their id is the one sitemapLead builds)
  const own = sitemapLead('', '').id.split(':')[0] + ':'
  for (const lead of LEAD_ROWS.filter((l) => !l.id.startsWith(own))) {
    for (const match of lead.source.matchAll(/quantumai\.google\/([^\s;,()]+)/g)) covered.add(match[1]!.replace(/^static\//, ''))
    if (lead.source === 'quantumai.google') covered.add('')
  }
  return covered
}

const OTHER_VENDORS = TABLES.OTHER_VENDORS as unknown as Record<string, string>

/** The lead one page of the sitemap makes, by what the page is and what this repository implements of it. */
const sitemapLead = (path: string, lastmod: string): Lead => {
  const base = { id: `page:${path || 'home'}`, source: `quantumai.google/${path}`, lastmod }
  const open = (statement: string): Lead => ({ ...base, statement, status: 'open', reason: `in the sitemap (lastmod ${lastmod}); fetchable; no tool follows this page yet` })
  if (path.startsWith('?hl=')) return { ...base, statement: `the home page in another language (${path.slice(4)})`, status: 'out_of_scope', reason: 'a language variant of the home page; the English page is the lead' }
  if (path === 'robots.txt') return { ...base, statement: 'the crawler rules file', status: 'out_of_scope', reason: 'site plumbing, not content' }
  if (/^google[0-9a-f]+$/.test(path)) return { ...base, statement: 'a site-verification token page', status: 'out_of_scope', reason: 'site plumbing, not content' }
  const reference = /^reference\/(python|cc)\/([^/]+)\/(.+)$/.exec(path)
  if (reference) {
    const [, , pkg, symbol] = reference as unknown as [string, string, string, string]
    if (pkg === 'cirq') {
      const found = CIRQ_IMPLEMENTED.get(symbol)
      if (found) return { ...base, statement: `API reference of cirq.${symbol}; implemented here as ${found.exported}${found.note ? ` (${found.note})` : ''}`, status: 'served', tool: 'circuit' }
      return open(`API reference of cirq.${symbol.replace(/\//g, '.')}, not implemented here`)
    }
    if (pkg === 'cirq_google') {
      if (symbol === 'Sycamore' || symbol === 'Sycamore23' || symbol === 'devices/known_devices') return { ...base, statement: `API reference of cirq_google.${symbol.replace(/\//g, '.')}; the device is built here from the same grid`, status: 'served', tool: 'processor' }
      return open(`API reference of cirq_google.${symbol.replace(/\//g, '.')}, not implemented here`)
    }
    if (pkg === 'openfermion') {
      if (symbol === 'transforms/jordan_wigner') return { ...base, statement: 'API reference of openfermion.transforms.jordan_wigner; one fermionic term of ladder operators becomes Pauli strings', status: 'served', tool: 'chemistry-simulation' }
      if (symbol === 'chem/MolecularData' || symbol === 'ops/QubitOperator') return { ...base, statement: `API reference of openfermion.${symbol.replace(/\//g, '.')}; for H₂ in STO-3G its content (the integrals, the Pauli-term Hamiltonian) is computed here`, status: 'partial', tool: 'chemistry-simulation', reason: 'one molecule in its minimal basis is computed here; the general class is not implemented' }
      return open(`API reference of openfermion.${symbol.replace(/\//g, '.')}, not implemented here`)
    }
    if (pkg in OTHER_VENDORS) return { ...base, statement: `API reference of ${pkg}.${symbol.replace(/\//g, '.')}`, status: 'out_of_scope', reason: `${OTHER_VENDORS[pkg]}, not Google Quantum AI's layer` }
    return open(`API reference of ${pkg}.${symbol.replace(/\//g, '.')}, not implemented here`)
  }
  return open(`the page ${path}`)
}

/** The leads of a sitemap's urls (sitemaps.org: loc, lastmod) that no hand-written lead names, in its sorted order; a url off the site or a
 *  lastmod not a W3C date is refused by name. */
export const sitemapLeads = (urls: readonly { loc: string; lastmod?: string }[]) => {
  const covered = coveredPaths(), site = 'https://quantumai.google/', valid = urls.filter((u) => typeof u?.loc === 'string' && u.loc.startsWith(site) && (u.lastmod === undefined || /^\d{4}-\d{2}-\d{2}(T[\d:.]+(Z|[+-]\d{2}:\d{2}))?$/.test(u.lastmod)))
  const paths = valid.map((u) => [u.loc.slice(site.length), (u.lastmod ?? '').slice(0, 10)] as const).sort((a, b) => (a[0] < b[0] ? -1 : 1))
  return { leads: paths.filter(([p]) => !covered.has(p)).map(([p, d]) => sitemapLead(p, d)), urls: urls.length, covered: paths.filter(([p]) => covered.has(p)).length, refused: urls.filter((u) => !valid.includes(u)).map((u) => String(u?.loc)), theorem: 'textbook_sitemap_leads' }
}

/** Every relation of the Clay register as a lead served by the clay tool, its integers facts for the wave. */
const CLAY_LEADS: readonly Lead[] = recomputeClay().relations.map((r) => ({ id: `clay-${r.name}`, source: `src/quantum/processing/unit/lean/Qpu/Clay.lean ${r.name}`, statement: `${r.name}: ${r.statement} = ${r.sides[0]!.value} (${r.bits} bits, seed ${1 + ((r.sides[0]!.value - 1) % 9)})`, status: 'served', tool: 'clay' }))
const STANDARD_LEADS: readonly Lead[] = quantumStandardLeads().map(({ id, source, statement, status, tool, reason, run }) => ({ id, source, statement, status, tool, ...(reason ? { reason } : {}), ...(run ? { run } : {}) }))

// every lead Payload holds, the ones this module computes taking their place: Payload is the source, the generated index its copy
const COMPUTED = new Set([...CLAY_LEADS, ...STANDARD_LEADS].map((l) => l.id))
// a lead is its id: of the docket's entries for one lead (one per run), the tree carries the first
const byId = (ls: readonly Lead[]): Lead[] => { const seen = new Set<string>(); return ls.filter((l) => (seen.has(l.id) ? false : (seen.add(l.id), true))) }
export const LEADS: readonly Lead[] = byId([...LEAD_ROWS.filter((l) => !COMPUTED.has(l.id)), ...CLAY_LEADS, ...STANDARD_LEADS])

/** The leads by status: the counts the leads tool reports. */
export const leadCounts = (leads: readonly Lead[] = LEADS): Record<LeadStatus, number> => {
  const counts: Record<LeadStatus, number> = { served: 0, partial: 0, blocked: 0, out_of_scope: 0, open: 0 }
  for (const l of leads) counts[l.status] += 1
  return counts
}

// a432 = 2⁴ · 3³ is the lead space: four binary dimensions and three ternary read from the lead's fields, so every lead lands in exactly one
// cell by mixed radix; the default cell is the key (or a referrer's address) mod 432 (textbook_lead_cells).
const RADICES = [2, 2, 2, 2, 3, 3, 3] as const
const PLACES = RADICES.map((_, i) => RADICES.filter((__, j) => j < i).reduce((p, r) => p * r, 1))
const CELLS = RADICES.reduce((p: number, r) => p * r, 1)
const DIMENSIONS = [['open', 'closed'], ['code', 'payload'], ['offline', 'online'], ['harmonic', 'gravity'], ['cleanable', 'judgment', 'blocked'], ['high', 'mid', 'low'], ['doubling', 'axis', 'zero']] as const
/** a lead of any docket: the leads tool's, next's, purify's, the entropy stream's, or an Open work item */
export type CellLead = { id: string; statement: string; status: string; source?: string; kind?: string; tool?: string; priority?: 'high' | 'mid' | 'low'; payload?: boolean }
const CLOSED = /^(served|out_of_scope|published|closed|done|settled)$/
const ENTROPY_KINDS = /^(literal|typed-path|cap|clock|duplicate|shape|todo|leak|repeat|address)$/
const GRAVITY_IDS = /^(next-|leak-|unproven-|orphan-|collision-|email-leak|double-escaped|entropy-|e2e-|errors?-)/
const BLOCKER = /\bblocked\b|\bneeds? (?:the |a )?(?:tenant(?:'s)? )?(?:key|token|secret|credential|approval)\b|\bapi key\b|\bunauthori[sz]ed\b|\bforbidden\b|\b(?:401|403|429)\b|\bno key\b/i
const HIGH = /\btop priority\b|\bimportant\b|\burgent\b|\bcritical\b|\basap\b/i
const ONLINE = /https?:\/\/|\b[a-z0-9-]+\.(?:com|org|net|io|dev|google|bg|ai|gov|int|edu)\b/i
const digitsOfCell = (cell: number) => RADICES.map((r, k) => Math.floor(cell / PLACES[k]!) % r)
const labelsOfCell = (cell: number) => digitsOfCell(cell).map((d, k) => DIMENSIONS[k]![d]!).join(' · ')
const digitsOfLead = (l: CellLead): number[] => {
  const closed = CLOSED.test(l.status), source = l.source ?? ''
  const gravity = (!!l.kind && ENTROPY_KINDS.test(l.kind)) || GRAVITY_IDS.test(l.id)
  const blocked = l.status === 'blocked' || (!closed && BLOCKER.test(l.statement))
  const cleanable = !blocked && (gravity || closed)
  const priority = l.priority ?? (HIGH.test(l.statement) ? 'high' : closed ? 'low' : 'mid')
  const root = Number(BigInt(`0x${uuid(l.id).replace(/-/g, '')}`) % 9n)
  return [closed ? 1 : 0, l.payload || /^site\/|payload/i.test(source) ? 1 : 0, ONLINE.test(source) && !/^(src|scripts|docs|site)\//.test(source) ? 1 : 0, gravity ? 1 : 0, blocked ? 2 : cleanable ? 0 : 1, ['high', 'mid', 'low'].indexOf(priority), root === 0 ? 2 : root % 3 === 0 ? 1 : 0]
}
const cellOfLead = (l: CellLead) => digitsOfLead(l).reduce((n, d, k) => n + d * PLACES[k]!, 0)

/** Every lead in its a432 cell: all 432 counted, the filled ones as work clusters, and the values the Clay rosetta reads with their calls. */
export const combineLeads = (leads: readonly CellLead[], referrer?: string) => {
  const byCell = Array.from({ length: CELLS }, () => [] as string[])
  for (const l of leads) byCell[cellOfLead(l)]!.push(l.id)
  const cells = byCell.map((ids, cell) => ({ cell, digits: digitsOfCell(cell), labels: labelsOfCell(cell), count: ids.length, value: ids.length || cell }))
  const hex = (referrer ?? '').replace(/-/g, ''), fromReferrer = /^[0-9a-f]{32}$/i.test(hex)
  const cell = Number((fromReferrer ? BigInt(`0x${hex}`) : 432n) % BigInt(CELLS))
  const filled = cells.filter((c) => c.count > 0)
  const values = [...new Set(filled.map((c) => c.value))].sort((a, b) => a - b), grid = [...new Set(cells.map((c) => c.value))].sort((a, b) => a - b)
  return {
    radices: [...RADICES], places: PLACES, dimensions: DIMENSIONS.map((d) => [...d]), total: CELLS, placed: leads.length, filled: filled.length, empty: CELLS - filled.length, cells,
    clusters: filled.map((c) => ({ ...c, ids: byCell[c.cell]! })).sort((a, b) => b.count - a.count || a.cell - b.cell),
    default: { cell, from: fromReferrer ? 'referrer' : 'a432', labels: labelsOfCell(cell), count: byCell[cell]!.length },
    rosetta: { values, grid, plan: values.map((input) => ({ name: 'run_sequence', arguments: { input } })), conventions: { tree: 'the digital root, 1 + (n − 1) mod 9', unit: 'the last decimal digit, n mod 10', both: 'seed + reflection ≡ 0 (mod 10)' } },
    theorem: 'textbook_lead_cells',
    says: `${leads.length} lead(s) in ${filled.length} of ${CELLS} cells (${CELLS - filled.length} empty); default cell ${cell} (${labelsOfCell(cell)}) from ${fromReferrer ? 'the referrer' : 'the a432 key'}`,
  }
}

// The session door: every user directive of every session decides what is next and how. Pure: the client reads the transcripts and Open work.
const SESSION_RULES: readonly [string, RegExp][] = [
  ['raw git commit or push in a shell', /\bgit (commit|push)\b/],
  ['--no-verify', /--no-verify/],
  ['killing by name', /\b(pkill|killall)\b/],
  ['raw npm or pnpm install', /\b(npm|pnpm)( --dir \S+)? (install|i|add|update)\b/],
  ['String.replace with a string on a tree file', /\.replace\([^,]+,\s*['"`][^)]*\$[&'`]/],
  ['raw createEntries from a script', /createEntries/],
]
/** the standing rules every item inherits as its acceptance, never restated per request */
// quality before any lead: cleans, standards fixes, folds and speed come first in every plan
const QUALITY = /\b(clean\w*|fold\w*|dedup\w*|duplicat\w*|standard\w*|style|lint\w*|speed\w*|fast\w*|slow\w*|perform\w*|simplif\w*|consolidat\w*|entropy|refactor\w*|quality|efficien\w*|defragment\w*|remov\w*)\b/i
// a proposal states an act when its title opens on a verb, not on a question word, a pronoun or a link, and names three stems at least
const NOT_AN_ACT = /^(why|how|what|where|when|who|which|is|are|do|does|did|can|could|would|should|shall|will|and|but|or|i|you|we|it|this|that|these|those|there|so|if|then|also|ok|okay|yes|no|now|the|a|an|https?:)\b/i
const STANDING = ['a textbook theorem and an example with expect per export', 'hooks and validations generated, never hand-held', 'no added collection', 'no caps on reads or walks', 'a Google CL description', 'measured by the gate', 'recorded in Payload Open work']
const STOP = new Set('this that with from have what when then them they there their will would should could also just into only each every more most some such than very your about after before which while where being been were make made does done need needs want like please sure okay thing things using used here know think even much many well same other another again still because these those over under were what whats dont doesnt isnt cant wont didnt'.split(' '))
const leadStems = (text: string): Set<string> => new Set(text.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 4 && !STOP.has(w) && !/^\d+$/.test(w)).map((w) => w.replace(/(?:ings|ing|edly|ed|es|s|ly)$/, (m) => (w.length - m.length >= 4 ? '' : m))))
type Directive = { session: string; at: string; text: string }
export type SessionInput = {
  directives?: Directive[]; answers?: { session: string; at: string; question: string; answer: string }[]
  breaks?: ({ session?: string; tool?: string; text: string } | { rule: string; count: number })[]; errors?: { session?: string; tool: string }[]
  open?: { id: string; title: string; statement?: string; status?: string; createdAt?: string; started?: boolean }[]
  files?: string[]; now?: string
  /** the bytes the quality wave frees (measured from the entropy docket) and the net bytes one predicted file of a lead adds (measured from the history) */
  quality?: { freed: number; cost: number }
  /** the forecast of one commit of one predicted file, in ms, with its 95 % interval (forecast over the commit runs) */
  forecast?: { ms: number; interval?: readonly [number, number] | null }
}
/** The waves as a Routes API route: each wave a leg lasting its longest item, the route their sum; staticDuration the items one after another,
 *  never shorter (textbook_route_waves). Absent without a forecast. */
const routeLeads = (waves: readonly { files: Set<string>; items: readonly { id: string; files: readonly string[] }[] }[], f?: SessionInput['forecast']) => {
  if (!f) return null
  const span = (k: number, x: number) => Math.max(...waves[k]!.items.map((i) => x * Math.max(1, i.files.length))), sum = (x: number) => waves.reduce((n, _, k) => n + span(k, x), 0), s = (ms: number) => `${Math.round(ms / 1000)}s`
  const all = waves.flatMap((w) => w.items).reduce((n, i) => n + f.ms * Math.max(1, i.files.length), 0)
  return { estimated: true as const, legs: waves.map((w, k) => ({ startLocation: w.items[0]!.id, endLocation: w.items.at(-1)!.id, steps: w.items.map((i) => i.id), distance: w.files.size, duration: s(span(k, f.ms)), staticDuration: s(w.items.reduce((n, i) => n + f.ms * Math.max(1, i.files.length), 0)) })), distance: waves.reduce((n, w) => n + w.files.size, 0), duration: s(sum(f.ms)), staticDuration: s(all), interval: f.interval ? [s(sum(f.interval[0])), s(sum(f.interval[1]))] : null, theorem: 'textbook_route_waves' }
}
/** Every directive folded into an Open work item or proposed new; items ranked (started first), routed, given their files and cell, and packed
 *  into parallel waves of disjoint files; a blocker is a probe-closed lead, never a wait (textbook_session_partition). */
export const runSession = (input: SessionInput, route: (statement: string) => { call?: { name: string; arguments: Record<string, unknown> } | null; by?: string } = () => ({})) => {
  const now = Date.parse(input.now ?? '1970-01-01T00:00:00Z')
  const said: Directive[] = [...(input.directives ?? []), ...(input.answers ?? []).map((a) => ({ session: a.session, at: a.at, text: `${a.question} ${a.answer}` }))]
  const items = (input.open ?? []).map((o) => ({ ...o, stems: leadStems(`${o.title} ${o.statement ?? ''}`), folded: [] as Directive[] }))
  const docs = [...items.map((i) => i.stems), ...said.map((d) => leadStems(d.text))]
  const df = new Map<string, number>(); for (const d of docs) for (const w of d) df.set(w, (df.get(w) ?? 0) + 1)
  const idf = (w: string) => Math.log((1 + docs.length) / (1 + (df.get(w) ?? 0)))
  const weight = (s: Set<string>) => [...s].reduce((n, w) => n + idf(w), 0)
  const score = (a: Set<string>, b: Set<string>) => { const shared = [...a].filter((w) => b.has(w)); return shared.length < 2 ? 0 : shared.reduce((n, w) => n + idf(w), 0) / Math.sqrt(weight(a) * weight(b) || 1) }
  const FOLD = 0.3
  const proposals: { stems: Set<string>; title: string; folded: Directive[] }[] = []
  let assents = 0
  for (const d of said) {
    const s = leadStems(d.text)
    if (s.size < 2) { assents += 1; continue }
    const best = items.map((i) => ({ i, v: score(s, i.stems) })).sort((a, b) => b.v - a.v)[0]
    if (best && best.v >= FOLD) { best.i.folded.push(d); continue }
    const near = proposals.map((p) => ({ p, v: score(s, p.stems) })).sort((a, b) => b.v - a.v)[0]
    if (near && near.v >= FOLD) { near.p.folded.push(d); continue }
    proposals.push({ stems: s, title: d.text.split('\n')[0]!.split(/(?<=[.?!])\s/)[0]!.split(/\s+/).filter(Boolean).slice(0, 12).join(' '), folded: [d] })
  }
  // a directive said once in one session was acted on where it was said; said again, in another session or with the user's emphasis, it is work
  const evident = proposals.filter((p) => new Set(p.folded.map((d) => d.session)).size >= 2 || p.folded.some((d) => HIGH.test(d.text)))
  const once = proposals.filter((p) => !evident.includes(p)).reduce((n, p) => n + p.folded.length, 0)
  const fileStems = (input.files ?? []).map((f) => ({ f, s: new Set(f.split('/').pop()!.replace(/([a-z])([A-Z])/g, (_, a: string, b: string) => `${a} ${b}`).toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 4 && !/^(test|lean|index|config)$/.test(w)).map((w) => w.replace(/(?:ings|ing|es|s)$/, (m) => (w.length - m.length >= 4 ? '' : m)))) }))
  const fdf = new Map<string, number>(); for (const { s } of fileStems) for (const w of s) fdf.set(w, (fdf.get(w) ?? 0) + 1)
  const files = (stems: Set<string>): string[] => { const scored = fileStems.map(({ f, s }) => ({ f, v: [...s].filter((w) => stems.has(w)).reduce((n, w) => n + Math.log((1 + fileStems.length) / (fdf.get(w) ?? 1)), 0) })); const top = Math.max(0, ...scored.map((x) => x.v)); return top > 0 ? scored.filter((x) => x.v === top).map((x) => x.f) : [] }
  const all = [
    ...items.filter((i) => !CLOSED.test(i.status ?? 'draft')).map((i) => ({ id: i.id, title: i.title, statement: i.statement ?? '', created: i.createdAt ?? null, started: !!i.started, stems: i.stems, folded: i.folded, proposed: false })),
    ...evident.map((p) => ({ id: `proposed-${uuid(p.title)}`, title: p.title, statement: '', created: p.folded.map((d) => d.at).sort()[0] ?? null, started: false, stems: p.stems, folded: p.folded, proposed: true })),
  ].map((i) => {
    const emphatic = HIGH.test(`${i.title} ${i.statement}`) || i.folded.some((d) => HIGH.test(d.text))
    const ageDays = i.created ? Math.max(0, (now - Date.parse(i.created)) / 86_400_000) : 0
    const priority: 'high' | 'mid' | 'low' = emphatic || i.folded.length >= 3 ? 'high' : i.folded.length >= 1 || ageDays >= 1 ? 'mid' : 'low'
    const r = route(`${i.title}. ${i.statement}`)
    const blocked = BLOCKER.test(`${i.title} ${i.statement}`)
    const cell = cellOfLead({ id: i.id, statement: `${i.title} ${i.statement}`, status: 'open', source: 'payload open work', payload: true, priority })
    return {
      id: i.id, title: i.title, kind: QUALITY.test(`${i.title} ${i.statement}`) ? 'quality' as const : 'lead' as const, proposed: i.proposed, act: !i.proposed || (!/\?\s*$/.test(i.title) && !NOT_AN_ACT.test(i.title.trim()) && leadStems(i.title).size >= 3), started: i.started, priority, rank: (emphatic ? 3 : 0) + i.folded.length + ageDays / 7, directives: i.folded.length, sessions: new Set(i.folded.map((d) => d.session)).size,
      how: r.call ?? null, by: r.by ?? null, files: files(i.stems), cell, labels: labelsOfCell(cell),
      blocker: blocked ? { id: `probe-${i.id}`, probe: r.call ?? { name: 'readiness', arguments: {} }, closes: 'when its probe answers without the blocker; never a wait' } : null,
      acceptance: STANDING,
      evident: [['tests', 'audit'], ['docs page', 'textbook'], ['textbook theorem and example', 'textbook'], ['measure', 'metrics']].map(([what, tool]) => ({ title: `${i.title}: ${what}`, tool })),
    }
  }).sort((a, b) => Number(a.kind === 'lead') - Number(b.kind === 'lead') || Number(b.started) - Number(a.started) || ['high', 'mid', 'low'].indexOf(a.priority) - ['high', 'mid', 'low'].indexOf(b.priority) || a.cell - b.cell || b.rank - a.rank || a.id.localeCompare(b.id))
  // parallel waves of disjoint files: each item in the first wave none of whose items touches its files (an item with no predicted file stands alone)
  // the quality waves first; a lead after them, in a wave only while the bytes the quality wave frees cover its predicted net bytes (the rule folded)
  const freed = input.quality?.freed ?? 0, cost = input.quality?.cost ?? 0
  let owed = 0
  const priced = all.map((i) => { const netBytes = i.kind === 'quality' ? null : cost * Math.max(1, i.files.length); const paid = netBytes === null || owed + netBytes <= freed; if (netBytes !== null && paid) owed += netBytes; return { ...i, netBytes, paid } })
  const waves: { files: Set<string>; items: typeof priced; kind: 'quality' | 'lead' }[] = []
  for (const i of priced.filter((x) => x.paid)) { const keys = i.files.length ? i.files : [`item:${i.id}`]; const w = waves.find((x) => x.kind === i.kind && keys.every((k) => !x.files.has(k))); if (w) { w.items.push(i); for (const k of keys) w.files.add(k) } else waves.push({ files: new Set(keys), items: [i], kind: i.kind }) }
  const breaks: Record<string, number> = Object.fromEntries(SESSION_RULES.map(([r]) => [r, 0]))
  for (const b of input.breaks ?? []) { if ('rule' in b) { if (b.rule in breaks) breaks[b.rule]! += b.count; continue } for (const [r, re] of SESSION_RULES) if (re.test(b.text)) breaks[r]! += 1 }
  const errorsByTool: Record<string, number> = {}; for (const e of input.errors ?? []) errorsByTool[e.tool] = (errorsByTool[e.tool] ?? 0) + 1
  const folded = items.reduce((n, i) => n + i.folded.length, 0), proposedCount = evident.reduce((n, p) => n + p.folded.length, 0)
  return {
    directives: { total: said.length, sessions: new Set(said.map((d) => d.session)).size, folded, proposed: proposedCount, once, assents, answers: (input.answers ?? []).length },
    breaks, errors: { total: (input.errors ?? []).length, byTool: errorsByTool },
    items: priced, quality: { items: priced.filter((i) => i.kind === 'quality').length, waves: waves.filter((w) => w.kind === 'quality').length, freed, cost, owed, unpaid: priced.filter((i) => !i.paid).length }, proposed: all.filter((i) => i.proposed).length, started: all.filter((i) => i.started).length, blockers: all.filter((i) => i.blocker).length,
    waves: waves.map((w, k) => ({ wave: k + 1, kind: w.kind, head: w.items[0]!.id, items: w.items.map((i) => i.id) })),
    route: routeLeads(waves, input.forecast),
    next: waves.map((w, k) => ({ wave: k + 1, item: w.items[0]!.title, how: w.items[0]!.how })),
    theorem: 'textbook_session_partition',
    says: `${said.length} directive(s) from ${new Set(said.map((d) => d.session)).size} session(s): ${folded} folded, ${proposedCount} proposed in ${evident.length} item(s), ${once} acted on where said, ${assents} assent(s); next: ${priced.filter((i) => i.paid).length} item(s) in ${waves.length} parallel wave(s), quality first (${waves.filter((w) => w.kind === 'quality').length} wave(s)); ${priced.filter((i) => !i.paid).length} lead(s) unpaid until a quality wave frees their bytes`,
  }
}
