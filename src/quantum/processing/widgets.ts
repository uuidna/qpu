// A widget for each qpu MCP tool: the tool's structured result as HTML that uses the host's design tokens (CSS variables),
// so it follows the harness in light and dark mode. Each builder is a pure string function: no I/O, no Node, no colours
// written out, so the same HTML renders in the harness, in the docs playground, and in any browser OS.

import type { WILLOW } from './processor.ts'
import { QUANTUM_ECHOES } from './echo.ts'
/** A markdown table cell is text, never markup or a link: the characters a table, Vue or a link would read are escaped, and a URL to a
 *  local host is never linkable, so no generated page carries a dead link. The one escaper every page writer folds onto. */
export const cell = (t: unknown): string => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\|/g, '\\|').replace(/\n/g, ' ').replace(/\{/g, '&#123;').replace(/\}/g, '&#125;').replace(/\]\(/g, () => '&#93;(').replace(/:\/\/(localhost|127\.0\.0\.1)/g, (_m, h: string) => `:&#47;&#47;${h}`)

const escape = (text: string): string => text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

const cards = (items: [label: string, value: string][]): string =>
  `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: var(--gap-md);">${items
    .map(([label, value]) => `<div style="background: var(--surface-1); border-radius: var(--radius); padding: var(--pad-md);"><div style="font-size: var(--font-size-footnote); color: var(--text-muted);">${escape(label)}</div><div style="font-size: var(--font-size-title); font-weight: 500; color: var(--text-primary);">${escape(value)}</div></div>`)
    .join('')}</div>`

const bar = (percent: number): string =>
  `<div style="height: 6px; background: var(--surface-1); border-radius: var(--radius); overflow: hidden;"><div style="width: ${Math.min(100, Math.max(0, percent)).toFixed(2)}%; height: 100%; background: var(--fill-accent);"></div></div>`

const CELL = 'padding: var(--gap-xs) var(--gap-sm); border-bottom: 0.5px solid var(--border);'
// status cells, coloured and moved by the stylesheet
const STATUS: Record<string, string> = { '✓': 'pass', '✗': 'fail', 'not decided': 'pending', served: 'pass', partial: 'pending', open: 'pending', blocked: 'fail', out_of_scope: 'fail' }
const mark = (passed: boolean | null): string => (passed === null ? 'not decided' : passed ? '✓' : '✗')
const table = (head: string[], rows: string[][]): string =>
  `<div style="background: var(--surface-2); border: 0.5px solid var(--border); border-radius: 12px; padding: var(--pad-sm) var(--pad-md); overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; font-size: var(--font-size-footnote);"><thead><tr>${head
    .map((h) => `<th style="text-align: left; color: var(--text-secondary); font-weight: 500; ${CELL}">${escape(h)}</th>`)
    .join('')}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((cell) => `<td${STATUS[cell] ? ` data-status="${STATUS[cell]}"` : ''} style="color: var(--text-primary); ${CELL}">${escape(cell)}</td>`).join('')}</tr>`)
    .join('')}</tbody></table></div>`

const stack = (parts: string[]): string => `<div style="font-family: var(--font-sans); color: var(--text-primary); display: grid; gap: var(--gap-md);">${parts.join('')}</div>`

/** The figure as the sheet states it: a mean with its spread, both as percentages with three decimals. */
const percent = ({ mean, spread }: { mean: number; spread: number }): string => `${(mean * 100).toFixed(3)}% ± ${(spread * 100).toFixed(3)}%`

type ProcessorView = Pick<typeof WILLOW, 'qubits' | 'statedAverageConnectivity' | 'chips' | 'magicStateCultivation'>

export const processorWidget = (p: ProcessorView | { name: string; qubits: number; couplers: number; statedQubits?: number; statedCouplers?: number; layout: string }): string => {
  if (!('chips' in p)) return stack([cards([['Qubits', String(p.qubits)], ['Couplers', String(p.couplers)]]), table(['Figure', 'Value'], [...(p.statedQubits === undefined ? [] : [['Stated qubits', String(p.statedQubits)], ['Stated couplers', String(p.statedCouplers)]]), ['Layout', p.layout]])])
  const one = p.chips.errorCorrection
  const two = p.chips.randomCircuitSampling
  return stack([
    cards([
      ['Qubits', String(p.qubits)],
      ['Average connectivity', p.statedAverageConnectivity.toFixed(2)],
      ['Λ for distances 3, 5, 7', one.errorSuppression.mean.toFixed(2)],
      ['Magic state error reduction', `${p.magicStateCultivation.errorReductionFactor}×`],
    ]),
    table(['Figure', 'Chip 1: error correction', 'Chip 2: random circuit sampling'], [
      ['Single-qubit gate error', percent(one.singleQubitGateError), percent(two.singleQubitGateError)],
      [`Two-qubit gate error (${one.twoQubitGateError.gate} / ${two.twoQubitGateError.gate})`, percent(one.twoQubitGateError), percent(two.twoQubitGateError)],
      ['Measurement error', percent(one.measurementError), percent(two.measurementError)],
      ['T1', `${one.t1Microseconds.mean} µs ± ${one.t1Microseconds.spread} µs`, `${two.t1Microseconds.mean} µs ± ${two.t1Microseconds.spread} µs`],
      ['Rate', `${one.errorCorrectionCyclesPerSecond.toLocaleString('en-US')} cycles per second`, `${two.circuitRepetitionsPerSecond.toLocaleString('en-US')} repetitions per second`],
    ]),
  ])
}

type Amplitude = { re: number; im: number }
type CircuitView =
  | { qubits: string[]; amplitudes: Amplitude[] }
  | { key: string; bitstrings: string[]; histogram: Record<string, number> }
  | { qubits: string[]; probabilities: number[]; trace: number; purity: number; expectations: number[] }

export const circuitWidget = (d: CircuitView): string => {
  if ('probabilities' in d) {
    const width = Math.max(1, Math.round(Math.log2(d.probabilities.length)))
    const rows = d.probabilities.map((p, k) => ({ k, p })).filter((r) => r.p > 1e-12)
    return stack([
      cards([['Trace', d.trace.toFixed(6)], ['Purity', d.purity.toFixed(6)], ['Basis states with weight', String(rows.length)]]),
      table(['State', 'Probability'], rows.map((r) => [`|${r.k.toString(2).padStart(width, '0')}⟩`, `${(r.p * 100).toFixed(2)}%`])),
      ...(d.expectations.length ? [table(['Observable', 'Expectation'], d.expectations.map((e, i) => [`observable ${i + 1}`, e.toFixed(6)]))] : []),
    ])
  }
  if ('amplitudes' in d) {
    const width = Math.max(1, Math.round(Math.log2(d.amplitudes.length)))
    const rows = d.amplitudes.map((a, k) => ({ k, p: a.re * a.re + a.im * a.im })).filter((r) => r.p > 1e-12)
    return stack([
      cards([['Qubits', String(width)], ['Basis states with weight', String(rows.length)]]),
      table(['State', 'Probability'], rows.map((r) => [`|${r.k.toString(2).padStart(width, '0')}⟩`, `${(r.p * 100).toFixed(2)}%`])),
      ...rows.map((r) => bar(r.p * 100)),
    ])
  }
  const width = d.bitstrings[0]?.length ?? 1
  const total = d.bitstrings.length
  const rows = Object.entries(d.histogram).map(([value, count]) => ({ bits: Number(value).toString(2).padStart(width, '0'), count, share: (count / total) * 100 }))
  return stack([
    cards([['Repetitions', String(total)], ['Measurement key', d.key], ['Distinct outcomes', String(rows.length)]]),
    table(['Bitstring', 'Count', 'Share'], rows.map((r) => [r.bits, String(r.count), `${r.share.toFixed(1)}%`])),
    ...rows.map((r) => bar(r.share)),
  ])
}

export const echoWidget = (d: { probability: number; operations: number }): string =>
  stack([
    cards([
      ['Probability the echo returns', d.probability.toFixed(6)],
      ['Operations in the echo circuit', String(d.operations)],
    ]),
    bar(d.probability * 100),
  ])

export const echoBenchmarkWidget = (d: typeof QUANTUM_ECHOES): string =>
  stack([
    cards([
      ['Processor', d.processor],
      ['Qubits in the array', String(d.qubits)],
      ['Speedup over the fastest supercomputers', `${d.speedup.toLocaleString('en-US')}×`],
      ['Molecules', d.molecules.map((m) => `${m} atoms`).join(', ')],
    ]),
  ])

export const roadmapWidget = (d: {
  milestones: readonly { number: number; title: string; year: string | null; physicalQubits: number; status: string }[]
  applications: readonly { band: string; applications: readonly string[] }[]
}): string =>
  stack([
    table(['Milestone', 'Title', 'Year', 'Physical qubits', 'Status'], d.milestones.map((m) => [
      `M${m.number}`,
      m.title,
      m.year ?? '—',
      m.physicalQubits.toLocaleString('en-US'),
      m.status,
    ])),
    ...d.milestones.map((m) => bar((m.physicalQubits / 1000000) * 100)),
    table(['Physical qubits needed', 'Predicted applications'], d.applications.map((a) => [a.band, a.applications.join('; ')])),
  ])

export const algorithmWidget = (d: { name: string; summary: readonly (readonly string[])[]; header: readonly string[]; rows: readonly (readonly string[])[] }): string =>
  stack([
    cards(d.summary.map((row) => [row[0] ?? '', row[1] ?? ''] as [string, string])),
    table([...d.header], d.rows.map((r) => [...r])),
  ])

export const softwareWidget = (d: { tools: readonly { name: string; description: string; implemented: boolean }[] }): string =>
  stack([
    cards([['Tools', String(d.tools.length)], ['Implemented here', String(d.tools.filter((t) => t.implemented).length)]]),
    table(['Tool', 'What it is', 'In this repository'], d.tools.map((t) => [t.name, t.description, t.implemented ? 'yes' : 'no'])),
  ])

export const statementsWidget = (d: { statements: readonly { topic: string; text: string }[] }): string =>
  stack([table(['Topic', 'Statement'], d.statements.map((s) => [s.topic, s.text]))])

export const entropyWidget = (d: { files: number; lines: number; findings: number; fused: number; reactions: number; gravity: string; vacuum: boolean; byKind: Record<string, { findings: number; leads: number }>; leads: readonly { id: string; kind: string; occurrences: number; source: string; statement: string }[] }): string =>
  stack([
    cards([
      ['Files', String(d.files)],
      ['Lines', String(d.lines)],
      ['Findings', String(d.findings)],
      ['Leads (fused)', String(d.fused)],
      ['Reactions', String(d.reactions)],
      ['Vacuum', d.vacuum ? 'yes' : 'no'],
    ]),
    `<p>gravity <code>${d.gravity}</code></p>`,
    table(['Kind', 'Findings', 'Leads'], Object.entries(d.byKind).map(([k, v]) => [k, String(v.findings), String(v.leads)])),
    table(['Lead', 'Kind', 'Occurrences', 'Sources', 'Statement'], d.leads.map((l) => [l.id, l.kind, String(l.occurrences), l.source, l.statement])),
  ])
export const leadsWidget = (d: { leads: readonly { id: string; status: string; tool?: string; statement: string }[]; counts: Record<string, number>; total: number }): string =>
  stack([
    cards([
      ['Leads', String(d.total)],
      ['Served', String(d.counts.served ?? 0)],
      ['Partial', String(d.counts.partial ?? 0)],
      ['Blocked', String(d.counts.blocked ?? 0)],
      ['Out of scope', String(d.counts.out_of_scope ?? 0)],
      ['Open', String(d.counts.open ?? 0)],
    ]),
    table(['Lead', 'Status', 'Tool', 'Statement'], d.leads.map((l) => [l.id, l.status, l.tool ?? '—', l.statement])),
  ])

export const quantumlibWidget = (d: { repositories: readonly { name: string; language: string; description: string; implementedHere: readonly string[]; tools: readonly string[]; note: string }[]; total: number; emulated: number }): string =>
  stack([
    cards([['Repositories', String(d.total)], ['With an emulation here', String(d.emulated)]]),
    table(['Repository', 'Language', 'Implemented here', 'Tools', 'Note'], d.repositories.map((r) => [r.name, r.language, r.implementedHere.join(', ') || '—', r.tools.join(', ') || '—', r.note])),
  ])

export const errorCorrectionWidget = (d: { code: string; channel: string; logical: string; at: { p: number; physicalError: number; logicalError: number; textbook: number | null }; sweep: readonly { p: number; physicalError: number; logicalError: number }[]; breakEven: number | null; helpsAtP: boolean }): string =>
  stack([
    cards([
      ['Code', d.code], ['Channel', d.channel], ['Logical state', `|${d.logical}⟩`],
      ['Physical error at p', d.at.physicalError.toFixed(6)], ['Logical error at p', d.at.logicalError.toFixed(6)],
      ['Break-even p (bisected)', d.breakEven === null ? 'none in the sweep' : d.breakEven.toFixed(6)],
    ]),
    table(['p', 'Physical error', 'Logical error', 'Code helps'], d.sweep.map((s) => [s.p.toFixed(4), s.physicalError.toFixed(6), s.logicalError.toFixed(6), s.logicalError < s.physicalError ? 'yes' : 'no'])),
    ...d.sweep.map((s) => bar(s.logicalError * 100)),
  ])

export const chemistryWidget = (d: { phase?: string; mapping?: string; says?: string; molecule?: { bondLength: number; hartreeFock: number; fci: number }; terms?: readonly { label: string; coefficient: number; imaginary?: number }[]; vqe?: { best: { theta: number; energy: number }; grid: readonly { theta: number; energy: number }[] } | null; at?: { theta: number; energy: number } | null }): string =>
  d.mapping === 'Jordan–Wigner' && d.terms ? stack([
    cards([['Mapping', d.mapping], ['Terms', String(d.terms.length)]]),
    ...(d.says ? [`<p>${escape(d.says)}</p>`] : []),
    table(['Term', 'Real', 'Imaginary'], d.terms.map((t) => [t.label, t.coefficient.toFixed(8), (t.imaginary ?? 0).toFixed(8)])),
  ]) : !d.molecule || !d.terms ? stack([cards([['Phase', d.phase ?? 'unlimited']])]) : stack([
    cards([
      ['Bond length (Å)', d.molecule.bondLength.toFixed(4)],
      ['Hartree-Fock (Ha)', d.molecule.hartreeFock.toFixed(6)],
      ['Full CI (Ha)', d.molecule.fci.toFixed(6)],
      ...(d.vqe ? [['VQE minimum (Ha)', d.vqe.best.energy.toFixed(6)] as [string, string], ['θ at the minimum', d.vqe.best.theta.toFixed(6)] as [string, string]] : []),
      ...(d.at ? [[`E(θ = ${d.at.theta})`, d.at.energy.toFixed(6)] as [string, string]] : []),
    ]),
    table(['Term', 'Coefficient (Ha)'], d.terms.map((t) => [t.label, t.coefficient.toFixed(8)])),
    ...(d.vqe ? [table(['θ', 'Energy (Ha)'], d.vqe.grid.map((g) => [g.theta.toFixed(4), g.energy.toFixed(6)]))] : []),
  ])

export const resourcesWidget = (d: { circuits: readonly { name: string; count: { qubits: number; depth: number; operations: number; twoQubitGates: number; tCount: number; complete: boolean; gates: readonly { name: string; count: number; class: string }[] } }[] }): string =>
  stack([
    table(['Circuit', 'Qubits', 'Depth', 'Operations', 'Two-qubit gates', 'T-count', 'Complete'], d.circuits.map((c) => [c.name, String(c.count.qubits), String(c.count.depth), String(c.count.operations), String(c.count.twoQubitGates), String(c.count.tCount), c.count.complete ? 'yes' : 'no: rotations or undecomposed gates uncounted'])),
    ...d.circuits.map((c) => table([`${c.name}: gate`, 'Count', 'Class'], c.count.gates.map((g) => [g.name, String(g.count), g.class]))),
  ])

export const repositoriesWidget = (d: { repositories: readonly { name: string; description: string; language: string }[]; total: number }): string =>
  stack([
    cards([['Repositories', String(d.total)], ['Shown', String(d.repositories.length)]]),
    table(['Repository', 'Language', 'Description'], d.repositories.map((r) => [r.name, r.language, r.description])),
  ])

/** The audit as cards and a table: the counts, then every check with its evidence. */
export const auditWidget = (d: { total: number; passed: number; failed: number; tools: number; examples: number; leads: number; checks: readonly { id: string; passed: boolean; evidence: string }[] }): string =>
  stack([
    cards([
      ['Checks', String(d.total)],
      ['Passed', String(d.passed)],
      ['Failed', String(d.failed)],
      ['Tools', String(d.tools)],
      ['Examples', String(d.examples)],
      ['Leads', String(d.leads)],
    ]),
    table(['Check', 'Result', 'Evidence'], d.checks.map((c) => [c.id, mark(c.passed), c.evidence])),
  ])

/** The match as its verdict, its evidence, and the ranked candidates. */
export const matchWidget = (d: { statement: string; verdict: string; evidence: string[]; tool?: string; candidates: readonly { kind: string; id: string; score: number; text: string }[]; cluster: readonly { kind: string; id: string; score: number; text: string }[]; verify: readonly { verifier: string; url: string; check: string }[]; reflection: { factors: readonly { n: number; factors?: string; by: string }[]; angles: readonly { x: number; property: string; d: number; sigma: number; angle: number }[]; queries: readonly string[]; leads: readonly { id: string; statement: string }[] }; lead: { id: string; status: string; reason?: string } }): string =>
  stack([
    cards([
      ['Statement', d.statement],
      ['Verdict', d.verdict],
      ['Tool', d.tool ?? '—'],
      ['Lead', `${d.lead.id} (${d.lead.status})`],
    ]),
    table(['Evidence'], d.evidence.map((e) => [e])),
    table(['Served possibility', 'Kind', 'Score', 'Text'], d.cluster.map((c) => [c.id, c.kind, String(c.score), c.text])),
    table(['Verify live via', 'URL', 'Check'], d.verify.map((v) => [v.verifier, v.url, v.check])),
    table(['Reflection: n', 'Hidden factors', 'By'], d.reflection.factors.map((f) => [String(f.n), f.factors ?? '—', f.by])),
    table(['Reflection: x', 'Bound', 'σ_d(x)', 'QFT angle'], d.reflection.angles.map((a) => [String(a.x), `${a.property} ≤ ${a.d}`, String(a.sigma), a.angle.toFixed(4)])),
    table(['Mirror query'], d.reflection.queries.map((q) => [q])),
    table(['Lead to develop', 'Statement'], d.reflection.leads.map((l) => [l.id, l.statement])),
    table(['Kind', 'Candidate', 'Score', 'Text'], d.candidates.map((c) => [c.kind, c.id, String(c.score), c.text])),
  ])

/** The Clay register: the totals, then every relation with its sides, values and width. */
/** Public SEO of the product relations: every formula and its proof, then the backend role, subscription and coin bill. */
export const seoWidget = (d: { public: boolean; coverage: { full: boolean; covered: number; of: number }; coins: { count: number; merged: number; by: string }; pages: readonly { title: string; formula: string; proof: string; coin: string; gap: boolean }[]; backend: { roles: readonly { role: string; abilities: readonly string[]; subscription: { product: string; variant: string; monthlyEur: number } }[]; call: { allowed: boolean; ability: string; coins: { address: string | null; booked: boolean } } | null } }): string =>
  stack([
    cards([['Public', d.public ? 'yes' : 'no'], ['Coverage', `${d.coverage.covered} / ${d.coverage.of}`], ['Full', d.coverage.full ? 'yes' : 'no'], ['Coins', String(d.coins.count)], ['Merged', String(d.coins.merged)], ['By', d.coins.by]]),
    table(['Title', 'Formula', 'Proof', 'Coin', 'Gap'], d.pages.map((p) => [p.title, p.formula, p.proof, p.coin, p.gap ? 'gap' : ''])),
    table(['Role', 'Abilities', 'Subscription', 'EUR / month'], d.backend.roles.map((r) => [r.role, r.abilities.join(', '), `${r.subscription.product}/${r.subscription.variant}`, String(r.subscription.monthlyEur)])),
    ...(d.backend.call ? [cards([['API', d.backend.call.allowed ? 'allowed' : 'refused'], ['Ability', d.backend.call.ability], ['Coin', d.backend.call.coins.address ?? ''], ['Booked', d.backend.call.coins.booked ? 'yes' : 'no']])] : []),
  ])

export const clayWidget = (d: { phase?: string; total?: number; holding?: number; solved?: number; open?: readonly unknown[]; families?: number; hz?: number; relationCount?: number; categories?: readonly { name: string }[]; variants?: readonly { product: string; variant: string; relation: string }[]; maxBits?: number; space?: string; crossVerified?: boolean; depth?: number; axioms?: readonly { name: string; formula: string; value: number; proved?: boolean }[]; hooks?: { iso: string; validated: boolean; proved: boolean }; rows?: readonly { problem?: string; products?: number; combinations?: string; solved: boolean; family?: string; relations?: number; own?: readonly string[]; next?: string | null; handle?: string; hz?: number }[]; relations?: readonly { name: string; statement: string; sides: readonly { expression: string; value: number }[]; holds: boolean; bits: number }[]; products?: readonly { title: string; taxonomy: readonly string[]; variants: readonly unknown[]; variations: readonly unknown[]; price: { coins: number; superposition: number } }[]; teams?: number; players?: number; against?: number; plays?: number; combinations?: number; productCount?: number; squares?: number; period?: number; roster?: readonly { family: string; piece: string; formulas: readonly unknown[]; players: readonly unknown[] }[]; nist?: { pieces?: number }; cern?: { pieces?: number }; scenarios?: readonly { nist: { formula: string; seed: number }; cern: { formula: string; seed: number }; mover: string | null; piece: string | null; product: string }[] }): string =>
  d.phase === 'combinations'
    ? stack([
        cards([['Axioms', String(d.axioms?.length ?? 0)], ['ISO 9001', d.hooks?.validated ? 'yes' : ''], ['Cross-verified', d.crossVerified ? 'yes' : ''], ['Depth', String(d.depth ?? 0)], ['Proved', d.hooks?.proved ? 'yes' : ''], ['Combinations', d.space ?? '0']]),
        table(['Axiom', 'Formula', 'Parameter', 'Proved'], (d.axioms ?? []).map((a) => [a.name, a.formula, String(a.value), a.proved ? 'yes' : ''])),
        table(['Problem', 'Products', 'Combinations', 'Solved'], (d.rows ?? []).map((r) => [r.problem ?? '', String(r.products ?? 0), r.combinations ?? '', r.solved ? 'yes' : ''])),
      ])
    : d.phase === 'solve'
    ? stack([
        cards([['Solved', `${d.solved ?? 0} / ${d.total}`], ['Open', String(d.open?.length ?? 0)], ['Categories', String(d.categories?.length ?? 0)], ['Variants', String(d.variants?.length ?? 0)]]),
        table(['Product', 'Variant', 'Relation'], (d.variants ?? []).map((v) => [v.product, v.variant, v.relation])),
      ])
    : d.phase === 'chess'
    ? stack([
        cards([['NIST', String(d.nist?.pieces ?? 0)], ['CERN', String(d.cern?.pieces ?? 0)], ['Scenarios', String(d.scenarios?.length ?? 0)], ['Plays', String(d.plays ?? 0)], ['Products', String(d.productCount ?? 0)]]),
        table(['NIST', 'CERN', 'Mover', 'Piece', 'Product'], (d.scenarios ?? []).map((s) => [s.nist.formula, s.cern.formula, s.mover ?? '', s.piece ?? '', s.product])),
      ])
    : d.phase === 'programs'
    ? stack([
        cards([['Programs', String(d.families ?? 0)], ['Hz', String(d.hz ?? 0)], ['Schema', 'program'], ['Params', 'tail']]),
        table(['Family', 'Handle', 'Hz', 'Next', 'Solved'], (d.rows ?? []).map((r) => [r.family ?? '', r.handle ?? '', String(r.hz ?? ''), r.next ?? '', r.solved ? 'yes' : ''])),
      ])
    : d.phase === 'waves'
    ? stack([
        cards([['Families', String(d.families ?? 0)], ['Hz', String(d.hz ?? 0)], ['Relations', String(d.relationCount ?? 0)]]),
        table(['Family', 'Relations', 'Own drift', 'Next', 'Solved'], (d.rows ?? []).map((r) => [r.family ?? '', String(r.relations ?? 0), String(r.own?.length ?? 0), r.next ?? '', r.solved ? 'yes' : ''])),
      ])
    : d.products
    ? stack([
        cards([['Products', String(d.total)], ['Variants', String(d.products.reduce((n, p) => n + p.variants.length, 0))], ['Cross-use variations', String(d.products.reduce((n, p) => n + p.variations.length, 0))]]),
        table(['Product', 'Variants', 'Variations', 'Taxonomy', 'Coins / superposition'], d.products.map((p) => [p.title, String(p.variants.length), String(p.variations.length), p.taxonomy.join(', '), `${p.price.coins} / ${p.price.superposition}`])),
      ])
    : stack([
        cards([['Relations', String(d.total)], ['Holding', String(d.holding)], ['Widest value', `${d.maxBits} bits`]]),
        table(['Relation', 'Holds', 'Bits', 'Sides'], (d.relations ?? []).map((r) => [r.name, mark(r.holds), String(r.bits), r.sides.map((s) => `${s.expression} = ${s.value}`).join(' · ')])),
      ])

/** One UUID's cheap checks, each with its evidence. */
export const verifyWidget = (d: { uuid: string; valid: boolean; decided: number; cost: string; checks: readonly { check: string; passed: boolean | null; evidence: string }[] }): string =>
  stack([
    cards([['UUID', d.uuid], ['Valid', mark(d.valid)], ['Checks decided', String(d.decided)]]),
    table(['Check', 'Result', 'Evidence'], d.checks.map((c) => [c.check, mark(c.passed), c.evidence])),
    table(['Cost'], [[d.cost]]),
  ])

/** A flow tool's result: its scalar fields as cards (phase, counts, verdicts), its check table when it is a selftest. */
export const flowWidget = (d: Record<string, unknown>): string => {
  const scalars = Object.entries(d).filter(([, v]) => typeof v === 'number' || typeof v === 'string' || typeof v === 'boolean').map(([k, v]) => [k, String(v)] as [string, string])
  const checks = Array.isArray(d.checks) ? (d.checks as { id: string; passed: boolean; evidence: string }[]) : null
  return stack([cards(scalars), ...(checks ? [table(['Check', 'Passed', 'Evidence'], checks.map((c) => [c.id, mark(c.passed), c.evidence]))] : [])])
}

/** The three admin APIs as one surface: the doors by provider, the Cloudflare meters and their bill, the merged operation index by provider and tag, the coverage of Payload's own packages, templates, examples and plugins with the next gap named. */
export const apisWidget = (d: Record<string, any>): string => {
  const parts: string[] = []
  const doors = d.phase === 'doors' ? d : d.doors
  if (doors) parts.push(cards([['Doors', String(doors.total)], ['Payload', String(doors.byProvider.payload)], ['Cloudflare', String(doors.byProvider.cloudflare)], ['Google', String(doors.byProvider.google)], ['Sealed', doors.holds ? 'all' : 'no']]), table(['Provider', 'Kind', 'Door', 'URL', 'Maps to'], doors.rows.map((r: any) => [r.provider, r.kind, r.name, r.url, r.maps])))
  const cost = d.phase === 'cost' ? d : (d.cost ?? (d.cloudflare?.cost ? d.cloudflare : undefined))
  if (cost?.rows || cost?.meters) { const rows = cost.rows ?? cost.meters; parts.push(cards([['Bill (USD)', String(cost.usd ?? cost.cost?.usd ?? 0)], ['Covered', (cost.covered ?? cost.cost?.covered) ? 'yes: inside every allowance' : 'no'], ['Leads', String((cost.leads ?? []).length)]]), table(['Meter', 'Used', 'Included', 'Share %', 'USD', 'Remedy'], rows.map((r: any) => [r.meter, String(r.used), String(r.included), String(r.share), String(r.usd ?? r.microUsd / 1_000_000), r.remedy ?? '']))); if (cost.leads?.length) parts.push(table(['Lead', 'Statement'], cost.leads.map((l: any) => [l.id, l.statement]))) }
  const index = d.phase === 'index' ? d : d.index
  if (index) parts.push(cards([['Operations', String(index.total)], ['Payload', String(index.byProvider.payload)], ['Cloudflare', String(index.byProvider.cloudflare)], ['Google', String(index.byProvider.google)], ['Distinct addresses', String(index.distinct ?? index.total)]]), table(['Tag', 'Operations'], Object.entries(index.byTag ?? {}).sort((a: any, b: any) => b[1] - a[1]).map(([t, n]) => [t, String(n)])))
  const coverage = d.phase === 'coverage' ? d : d.coverage
  if (coverage) parts.push(cards([['Payload surface', String(coverage.total)], ['Covered', String(coverage.covered)], ['Gaps', String(coverage.total - coverage.covered)], ['Next', coverage.next ? coverage.next.name : 'none: full coverage']]), table(['Kind', 'Name', 'Covered', 'Address'], (coverage.rows ?? []).map((r: any) => [r.kind, r.name, r.covered ? 'yes' : 'no', r.address])))
  if (d.pricing && !cost) parts.push(table(['Meter', 'Included a month', 'USD per million past it', 'Remedy'], d.pricing.map((m: any) => [m.meter, String(m.included), String(m.perMillionUsd), m.remedy])))
  return stack(parts.length ? parts : [table(['Phase'], [[String(d.phase ?? 'apis')]])])
}
