// A widget for each qpu MCP tool: the tool's structured result as HTML that uses the host's design tokens (CSS variables),
// so it follows the harness in light and dark mode. Each builder is a pure string function: no I/O, no Node, no colours
// written out, so the same HTML renders in the harness, in the docs playground, and in any browser OS.

import type { WILLOW } from './processor.js'
import { QUANTUM_ECHOES } from './echo.js'
/** A markdown table cell is text, never markup or a link: the characters a table, Vue or a link would read are escaped, and a URL to a
 *  local host is never linkable, so no generated page carries a dead link. The one escaper every page writer folds onto. */
export const cellOf = (t: unknown): string => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\|/g, '\\|').replace(/\n/g, ' ').replace(/\{/g, '&#123;').replace(/\}/g, '&#125;').replace(/\]\(/g, () => '&#93;(').replace(/:\/\/(localhost|127\.0\.0\.1)/g, (_m, h: string) => `:&#47;&#47;${h}`)

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

export const chemistryWidget = (d: { molecule: { bondLength: number; hartreeFock: number; fci: number }; terms: readonly { label: string; coefficient: number }[]; vqe: { best: { theta: number; energy: number }; grid: readonly { theta: number; energy: number }[] } | null; at: { theta: number; energy: number } | null }): string =>
  stack([
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
export const clayWidget = (d: { total: number; holding: number; maxBits: number; relations: readonly { name: string; statement: string; sides: readonly { expression: string; value: number }[]; holds: boolean; bits: number }[] }): string =>
  stack([
    cards([['Relations', String(d.total)], ['Holding', String(d.holding)], ['Widest value', `${d.maxBits} bits`]]),
    table(['Relation', 'Holds', 'Bits', 'Sides'], d.relations.map((r) => [r.name, mark(r.holds), String(r.bits), r.sides.map((s) => `${s.expression} = ${s.value}`).join(' · ')])),
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
