// Every lead on quantumai.google, its linked PDFs and the quantumlib repositories, with its status and the MCP tool that serves
// it. A lead is served when a tool answers it, partial when a tool answers part of it (the reason says which part), blocked when
// the page could not be read (the reason says why, with the date and status code), out of scope when it is not technical content
// this repository carries (a video, a jobs listing, a crawler file), and open when it is a page of the sitemap that is fetchable
// and no tool follows yet. The hand-written leads are here; every page of the sitemap (the discover door's, sealed in the docket) that no
// hand-written lead already names is a lead of its own through leads { sitemap }, so nothing the site lists is dropped.

import * as cirq from './cirq.ts'
import { recomputeClay } from './clay-register.ts'
import { uuidOf } from './blocks.ts'
import { LEAD_ROWS } from './leads-index.ts'

export type LeadStatus = 'served' | 'partial' | 'blocked' | 'out_of_scope' | 'open'

export type Lead = { id: string; source: string; statement: string; status: LeadStatus; tool?: string; reason?: string; lastmod?: string }

// A cleanup lead names what was removed: file paths, or git branches. Its settlement is a measurement (is the subject still absent?)
// taken by the scripts that can see the tree; this parse is the pure half, shared so purify and readiness measure the same thing.
export const findCleanupSubjects = (l: Lead): { kind: 'branches' | 'paths'; names: string[] } | null => {
  if (!l.id.startsWith('cleanup-') || l.status !== 'out_of_scope') return null
  const branches = /^git branches (.+)$/.exec(l.source)
  return branches ? { kind: 'branches', names: branches[1]!.split(/,\s*/) } : { kind: 'paths', names: [l.source.split(/\s/)[0]!.replace(/\/$/, '')] }
}

const FETCHED = '2026-10-25'

/** The leads followed by hand: each read from its page, PDF or repository, with the tool that serves it. */
const HAND_LEADS: readonly Lead[] = [
  { id: 'willow-spec', source: 'quantumai.google/static/site-assets/downloads/willow-spec-sheet.pdf', statement: 'Willow: 105 qubits, the grid, two chips with their figures', status: 'served', tool: 'processor' },
  { id: 'roadmap', source: 'services.google.com PDF, roadmap figure; quantumai.google/roadmap', statement: 'Six milestones, physical-qubit scale, Milestone 3 in progress', status: 'served', tool: 'roadmap' },
  { id: 'software', source: 'quantumai.google/software', statement: 'Cirq, qsim, Qualtran, OpenFermion, TensorFlow Quantum', status: 'served', tool: 'software' },
  { id: 'cirq-overview', source: 'quantumai.google/cirq', statement: 'Cirq is a Python library for writing, manipulating and optimizing circuits', status: 'served', tool: 'statements' },
  { id: 'qaoa', source: 'quantumai.google/cirq/experiments/qaoa/qaoa_maxcut; github.com/quantumlib/Cirq', statement: 'QAOA max-cut at p = 1 on Sycamore: the first twelve sorted qubits, their couplers in networkx order, numpy\'s seed-11 weights (reproduced exactly), the 5 by 5 sweep, and the estimate_cost objective sampled at 20,000 shots', status: 'served', tool: 'algorithm' },
  { id: 'shor', source: 'quantumai.google/cirq/experiments/textbook_algorithms; quantumai.google/cirq/experiments/shor', statement: 'Shor\'s order finding, the later use of phase estimation the page names', status: 'served', tool: 'algorithm' },
  { id: 'qsim', source: 'github.com/quantumlib/qsim; quantumai.google/qsim', statement: 'qsim: a fast state-vector simulator with a Cirq interface, Apache-2.0', status: 'served', tool: 'statements' },
  { id: 'research', source: 'quantumai.google/research (quantumai.google/research/publications returns 404)', statement: 'Research publications: the page\'s title and description', status: 'partial', tool: 'statements', reason: `on ${FETCHED} quantumai.google/research returned HTTP 200 with the title "Research Publications" and the site description, which the research statement serves; its publication list is rendered by script and is not in the fetched HTML; research/publications returned HTTP 404` },
  { id: 'learn-map', source: 'quantumai.google/learn/map', statement: 'Our quantum computing journey: the page\'s title and description', status: 'partial', tool: 'statements', reason: `on ${FETCHED} the page returned HTTP 200 (it was 404 to the earlier fetch) with its title and description, which the learn_map statement serves; the journey itself is an interactive map in a frame from dreamcoat-guggenheim.uc.r.appspot.com, whose text is not in the fetched HTML` },
  { id: 'qualtran', source: 'github.com/quantumlib/Qualtran; quantumai.google/qualtran', statement: 'Qualtran: abstractions for quantum programs and a library of algorithms, experimental', status: 'served', tool: 'statements' },
  { id: 'openfermion', source: 'github.com/quantumlib/OpenFermion; quantumai.google/openfermion', statement: 'OpenFermion: compiling and analyzing quantum algorithms to simulate fermionic systems', status: 'served', tool: 'statements' },
  { id: 'repo-cirq', source: 'github.com/quantumlib/Cirq', statement: 'Cirq: the NISQ circuit framework', status: 'served', tool: 'repositories' },
  { id: 'repo-github', source: 'github.com/quantumlib/.github', statement: 'organization configuration: the profile README, a markdownlint configuration and a code of conduct', status: 'out_of_scope', reason: `fetched on ${FETCHED}: the repository has no description and holds the organization profile, .markdownlintrc and CODE_OF_CONDUCT.md; configuration for the quantumlib repositories, not a library or a result` },
  { id: 'repo-allstar', source: 'github.com/quantumlib/.allstar', statement: 'organization configuration: the default Allstar policy files', status: 'out_of_scope', reason: `fetched on ${FETCHED}: a public archive holding allstar.yaml, binary_artifacts.yaml and branch_protection.yaml, described as the default Allstar configuration that points to google/allstar-config; security policy for the repositories, not a library or a result` },
  { id: 'cirq-google-concepts', source: 'quantumai.google/cirq/google/concepts', statement: 'the page\'s stated content, served as the google_concepts statement', status: 'served', tool: 'statements' },
  { id: 'qsim-hardware', source: 'quantumai.google/qsim/choose_hw', statement: 'the page\'s stated content, served as the qsim_hardware statement', status: 'served', tool: 'statements' },
  { id: 'sitemap', source: 'quantumai.google/sitemap.xml and its child sitemaps', statement: 'The site\'s sitemap as sitemaps.org defines it (loc, lastmod): planned by the discover door, sealed in the docket from sitemap, handed to leads { sitemap } by its client, every page a lead', status: 'served', tool: 'leads' },
  { id: 'learn', source: 'quantumai.google/learn', statement: 'Learn overview', status: 'blocked', reason: `the path is not in the sitemap and returned HTTP 404 on ${FETCHED}; its children learn/map and learn/lab are in the sitemap and are served` },
  { id: 'sycamore', source: 'quantumai.google/cirq/google/devices, printed diagram; github.com/quantumlib/Cirq known_devices.py', statement: 'Sycamore: 54 qubits and 88 couplers, its printed layout, its two-qubit gates', status: 'served', tool: 'processor' },
  // the leads of v1.1.0 restored, each judged against the tools on this branch
  { id: 'qpu-quantumlib', source: 'github.com/quantumlib', statement: 'The quantumlib GitHub organization: fifteen active repositories for quantum computing, with what this repository implements of each', status: 'served', tool: 'quantumlib' },
  // leads the whole sitemap added
  { id: 'home', source: 'quantumai.google', statement: 'The home page: Willow, Quantum Echoes, the Nature papers and the Early Access Program it links', status: 'served', tool: 'statements' },
]

/** The Cirq API symbols the sitemap documents that this repository implements, each with the export here that stands for it.
 *  Only entries whose export exists in cirq.ts are used, so the list cannot name an implementation that is not there. */
const CIRQ_SYMBOLS: readonly [symbol: string, exported: string, note: string][] = [
  ['Circuit', 'Circuit', 'moments, append with an insert strategy, qubits in key order'],
  ['Moment', 'Moment', 'operations on disjoint qubits'],
  ['Simulator', 'Simulator', 'simulate (the state vector) and run (sampled bitstrings), up to 20 qubits'],
  ['DensityMatrixSimulator', 'DensityMatrixSimulator', 'exact channels, up to 8 qubits'],
  ['Device', 'Device', 'validate_operation, validate_moment, validate_circuit'],
  ['LineQubit', 'LineQubit', 'of and range'],
  ['GridQubit', 'GridQubit', 'of and square'],
  ['NamedQubit', 'NamedQubit', 'of'],
  ['Qid', 'keyOf', 'the qubit key that orders and compares qubits'],
  ['X', 'X', ''], ['Y', 'Y', ''], ['Z', 'Z', ''], ['H', 'H', ''], ['CZ', 'CZ', ''], ['CNOT', 'CNOT', ''], ['CX', 'CNOT', ''], ['SWAP', 'SWAP', ''], ['TOFFOLI', 'TOFFOLI', ''], ['CCX', 'TOFFOLI', ''], ['CCNOT', 'TOFFOLI', ''], ['ZZ', 'ZZ', ''],
  ['S', 'powerOf', 'Z**0.5'], ['T', 'powerOf', 'Z**0.25'],
  ['XPowGate', 'powerOf', 'X**t'], ['YPowGate', 'powerOf', 'Y**t'], ['ZPowGate', 'powerOf', 'Z**t'], ['HPowGate', 'powerOf', 'H**t'], ['CZPowGate', 'powerOf', 'CZ**t'], ['CXPowGate', 'powerOf', 'CNOT**t'], ['CNotPowGate', 'powerOf', 'CNOT**t'], ['SwapPowGate', 'powerOf', 'SWAP**t'], ['ZZPowGate', 'powerOf', 'ZZ**t'], ['CCXPowGate', 'powerOf', 'TOFFOLI**t'], ['CCZPowGate', 'powerOf', 'CCZ**t is not built; TOFFOLI**t is'],
  ['Gate', 'applied', 'a gate is its name, arity and unitary'], ['GateOperation', 'applied', 'gate.on(*qubits)'], ['Operation', 'applied', ''],
  ['MeasurementGate', 'measure', ''], ['measure', 'measure', ''],
  ['InsertStrategy', 'Circuit', 'EARLIEST, NEW, INLINE, NEW_THEN_INLINE'],
  ['Result', 'Result', 'measurements and histogram'],
  ['inverse', 'adjointOf', 'the adjoint of a gate'], ['unitary', 'applied', 'every gate carries its unitary'],
  ['bit_flip', 'noisy', ''], ['phase_flip', 'noisy', ''], ['depolarize', 'noisy', ''], ['asymmetric_depolarize', 'noisy', ''], ['amplitude_damp', 'noisy', ''], ['phase_damp', 'noisy', ''], ['generalized_amplitude_damp', 'noisy', ''], ['reset', 'noisy', ''],
  ['BitFlipChannel', 'noisy', ''], ['PhaseFlipChannel', 'noisy', ''], ['DepolarizingChannel', 'noisy', ''], ['AsymmetricDepolarizingChannel', 'noisy', ''], ['AmplitudeDampingChannel', 'noisy', ''], ['PhaseDampingChannel', 'noisy', ''], ['GeneralizedAmplitudeDampingChannel', 'noisy', ''], ['ResetChannel', 'noisy', ''],
  ['kraus', 'noisy', 'each channel is its Kraus operators'],
  ['PauliString', 'expectationOf', 'a Pauli observable by qubit'], ['DensePauliString', 'pauliProduct', 'a Pauli string as one gate'],
  ['qft', 'Circuit', 'qftOperations in algorithms.ts'], ['QuantumFourierTransformGate', 'Circuit', 'qftOperations in algorithms.ts'],
]

const CIRQ_IMPLEMENTED = new Map(CIRQ_SYMBOLS.filter(([, exported]) => exported in cirq).map(([symbol, exported, note]) => [symbol, { exported, note }]))

/** The paths a hand-written lead names on quantumai.google, so the sitemap's leads do not repeat them. */
const coveredPaths = (): Set<string> => {
  const covered = new Set<string>()
  for (const lead of HAND_LEADS) {
    for (const match of lead.source.matchAll(/quantumai\.google\/([^\s;,()]+)/g)) covered.add(match[1]!.replace(/^static\//, ''))
    if (lead.source === 'quantumai.google') covered.add('')
  }
  return covered
}

const OTHER_VENDORS: Record<string, string> = {
  cirq_ionq: 'IonQ\'s trapped-ion hardware integration in Cirq',
  cirq_aqt: 'AQT\'s trapped-ion hardware integration in Cirq',
  cirq_pasqal: 'Pasqal\'s neutral-atom hardware integration in Cirq',
  cirq_web: 'Cirq\'s web visualisation package',
}

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

/** Every relation of the Clay register as a lead: served by the clay tool, its integers facts for the wave (OEIS, Wikipedia),
 * its statement reflected by the imagination, its value read by the unit's sequence door at readiness. */
const CLAY_LEADS: readonly Lead[] = recomputeClay().relations.map((r) => ({ id: `clay-${r.name}`, source: `src/quantum/processing/unit/lean/Qpu/Clay.lean ${r.name}`, statement: `${r.name}: ${r.statement} = ${r.sides[0]!.value} (${r.bits} bits, seed ${1 + ((r.sides[0]!.value - 1) % 9)})`, status: 'served', tool: 'clay' }))

// every lead Payload holds, the ones this module computes taking their place: Payload is the source, the generated index its copy
const COMPUTED = new Set([...HAND_LEADS, ...CLAY_LEADS].map((l) => l.id))
export const LEADS: readonly Lead[] = [...LEAD_ROWS.filter((l) => !COMPUTED.has(l.id)), ...HAND_LEADS, ...CLAY_LEADS]

/** The leads by status: the counts the leads tool reports. */
export const leadCounts = (leads: readonly Lead[] = LEADS): Record<LeadStatus, number> => {
  const counts: Record<LeadStatus, number> = { served: 0, partial: 0, blocked: 0, out_of_scope: 0, open: 0 }
  for (const l of leads) counts[l.status] += 1
  return counts
}

// a432 builds every lead combination: the key 432 = 2⁴ · 3³ is the lead space, seven dimensions read from the lead's own fields, four binary
// (open or closed, code or Payload, offline or online, harmonic or gravity) and three ternary (cleanable, judgment or blocked by its probe; the
// user's priority high, mid or low; the gateway of its address: the doubling orbit, the 3/6 axis or 0/9). Every lead lands in exactly one cell by
// mixed radix, nothing unplaced; the default cell is the a432 key (or a referrer's address) reduced mod 432 (textbook_lead_cells).
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
  const root = Number(BigInt(`0x${uuidOf(l.id).replace(/-/g, '')}`) % 9n)
  return [closed ? 1 : 0, l.payload || /^site\/|payload/i.test(source) ? 1 : 0, ONLINE.test(source) && !/^(src|scripts|docs|site)\//.test(source) ? 1 : 0, gravity ? 1 : 0, blocked ? 2 : cleanable ? 0 : 1, ['high', 'mid', 'low'].indexOf(priority), root === 0 ? 2 : root % 3 === 0 ? 1 : 0]
}
const cellOfLead = (l: CellLead) => digitsOfLead(l).reduce((n, d, k) => n + d * PLACES[k]!, 0)

/** Every lead in its a432 cell: all 432 cells counted (the empty too), the filled ones as work clusters, the default cell from the key or a referrer,
 *  and the values the Clay rosetta reads (a cell's count, else its index) with the unit's run_sequence calls that read them. */
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
  /** the forecast of one commit of one predicted file, in ms, with its 95 % interval (forecastOf over the commit runs) */
  forecast?: { ms: number; interval?: readonly [number, number] | null }
}
/** The route through the waves as the Routes API's route takes it (legs with their start and end, steps, duration and staticDuration): each wave a leg whose items run at once, its
 *  duration its longest item (one commit per predicted file at the forecast), the route the sum of its legs; staticDuration the same items one
 *  after another, never shorter (textbook_route_waves). Estimated, with the interval the forecast gives, or absent without one. */
const routeLeads = (waves: readonly { files: Set<string>; items: readonly { id: string; files: readonly string[] }[] }[], f?: SessionInput['forecast']) => {
  if (!f) return null
  const span = (k: number, x: number) => Math.max(...waves[k]!.items.map((i) => x * Math.max(1, i.files.length))), sum = (x: number) => waves.reduce((n, _, k) => n + span(k, x), 0), s = (ms: number) => `${Math.round(ms / 1000)}s`
  const all = waves.flatMap((w) => w.items).reduce((n, i) => n + f.ms * Math.max(1, i.files.length), 0)
  return { estimated: true as const, legs: waves.map((w, k) => ({ startLocation: w.items[0]!.id, endLocation: w.items.at(-1)!.id, steps: w.items.map((i) => i.id), distance: w.files.size, duration: s(span(k, f.ms)), staticDuration: s(w.items.reduce((n, i) => n + f.ms * Math.max(1, i.files.length), 0)) })), distance: waves.reduce((n, w) => n + w.files.size, 0), duration: s(sum(f.ms)), staticDuration: s(all), interval: f.interval ? [s(sum(f.interval[0])), s(sum(f.interval[1]))] : null, theorem: 'textbook_route_waves' }
}
/** Every directive folded into an Open work item by shared stems or proposed new; every item ranked (started first, then the user's words, the
 *  repetitions and the age), routed to the call that does it, given its predicted files, its cell and its acceptance, and packed into parallel
 *  waves of disjoint files; a blocker is a probe-closed lead, never a wait (textbook_session_partition). */
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
  const filesOf = (stems: Set<string>): string[] => { const scored = fileStems.map(({ f, s }) => ({ f, v: [...s].filter((w) => stems.has(w)).reduce((n, w) => n + Math.log((1 + fileStems.length) / (fdf.get(w) ?? 1)), 0) })); const top = Math.max(0, ...scored.map((x) => x.v)); return top > 0 ? scored.filter((x) => x.v === top).map((x) => x.f) : [] }
  const all = [
    ...items.filter((i) => !CLOSED.test(i.status ?? 'draft')).map((i) => ({ id: i.id, title: i.title, statement: i.statement ?? '', created: i.createdAt ?? null, started: !!i.started, stems: i.stems, folded: i.folded, proposed: false })),
    ...evident.map((p) => ({ id: `proposed-${uuidOf(p.title)}`, title: p.title, statement: '', created: p.folded.map((d) => d.at).sort()[0] ?? null, started: false, stems: p.stems, folded: p.folded, proposed: true })),
  ].map((i) => {
    const emphatic = HIGH.test(`${i.title} ${i.statement}`) || i.folded.some((d) => HIGH.test(d.text))
    const ageDays = i.created ? Math.max(0, (now - Date.parse(i.created)) / 86_400_000) : 0
    const priority: 'high' | 'mid' | 'low' = emphatic || i.folded.length >= 3 ? 'high' : i.folded.length >= 1 || ageDays >= 1 ? 'mid' : 'low'
    const r = route(`${i.title}. ${i.statement}`)
    const blocked = BLOCKER.test(`${i.title} ${i.statement}`)
    const cell = cellOfLead({ id: i.id, statement: `${i.title} ${i.statement}`, status: 'open', source: 'payload open work', payload: true, priority })
    return {
      id: i.id, title: i.title, kind: QUALITY.test(`${i.title} ${i.statement}`) ? 'quality' as const : 'lead' as const, proposed: i.proposed, act: !i.proposed || (!/\?\s*$/.test(i.title) && !NOT_AN_ACT.test(i.title.trim()) && leadStems(i.title).size >= 3), started: i.started, priority, rank: (emphatic ? 3 : 0) + i.folded.length + ageDays / 7, directives: i.folded.length, sessions: new Set(i.folded.map((d) => d.session)).size,
      how: r.call ?? null, by: r.by ?? null, files: filesOf(i.stems), cell, labels: labelsOfCell(cell),
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
