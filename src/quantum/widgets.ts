// A widget for each qpu MCP tool: the tool's structured result as HTML that uses the host's design tokens (CSS variables),
// so it follows the harness in light and dark mode. Each builder is a pure string function: no I/O, no Node, no colours
// written out, so the same HTML renders in the harness, in the docs playground, and in any browser OS.

import type { WILLOW } from './processor.js'
import { QUANTUM_ECHOES } from './echo.js'

const escape = (text: string): string => text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

const cards = (items: [label: string, value: string][]): string =>
  `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: var(--gap-md);">${items
    .map(([label, value]) => `<div style="background: var(--surface-1); border-radius: var(--radius); padding: var(--pad-md);"><div style="font-size: var(--font-size-footnote); color: var(--text-muted);">${escape(label)}</div><div style="font-size: var(--font-size-title); font-weight: 500; color: var(--text-primary);">${escape(value)}</div></div>`)
    .join('')}</div>`

const bar = (percent: number): string =>
  `<div style="height: 6px; background: var(--surface-1); border-radius: var(--radius); overflow: hidden;"><div style="width: ${Math.min(100, Math.max(0, percent)).toFixed(2)}%; height: 100%; background: var(--fill-accent);"></div></div>`

const table = (head: string[], rows: string[][]): string =>
  `<div style="background: var(--surface-2); border: 0.5px solid var(--border); border-radius: 12px; padding: var(--pad-sm) var(--pad-md); overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; font-size: var(--font-size-footnote);"><thead><tr>${head
    .map((h) => `<th style="text-align: left; color: var(--text-secondary); font-weight: 500; padding: var(--gap-xs) var(--gap-sm); border-bottom: 0.5px solid var(--border);">${escape(h)}</th>`)
    .join('')}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((cell) => `<td style="color: var(--text-primary); padding: var(--gap-xs) var(--gap-sm); border-bottom: 0.5px solid var(--border);">${escape(cell)}</td>`).join('')}</tr>`)
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

export const leadsWidget = (d: { leads: readonly { id: string; status: string; tool?: string; statement: string }[]; counts: Record<string, number>; total: number }): string =>
  stack([
    cards([
      ['Leads', String(d.total)],
      ['Served', String(d.counts.served ?? 0)],
      ['Partial', String(d.counts.partial ?? 0)],
      ['Blocked', String(d.counts.blocked ?? 0)],
      ['Out of scope', String(d.counts.out_of_scope ?? 0)],
    ]),
    table(['Lead', 'Status', 'Tool', 'Statement'], d.leads.map((l) => [l.id, l.status, l.tool ?? '—', l.statement])),
  ])

export const repositoriesWidget = (d: { repositories: readonly { name: string; description: string; language: string }[]; total: number }): string =>
  stack([
    cards([['Repositories', String(d.total)], ['Shown', String(d.repositories.length)]]),
    table(['Repository', 'Language', 'Description'], d.repositories.map((r) => [r.name, r.language, r.description])),
  ])

export const factoringWidget = (d: any): string => {
  // Handle both old and new factoring proof structures
  const n = d.modulus?.n || d.n
  const from = d.search?.currentCursor ?? d.from ?? 0
  const order = d.search?.order ?? d.order
  const factored = d.result?.factored ?? d.factored ?? false
  const living = d.proof?.alive ?? d.living ?? false
  const factors = d.result?.factors ?? d.factors ?? null
  const note = d.proof?.statement || 'Factoring proof'

  const nLength = n ? String(n).length : 0
  const stateCards: [string, string][] = [
    ['Modulus digits', String(nLength)],
    ['Cursor position', String(from)],
    ['State', living ? '🔍 Searching' : factored ? '✓ Factored' : '○ Complete'],
  ]
  if (order !== null && order !== undefined) stateCards.push(['Order found', String(order)])
  if (factors !== null && factors !== undefined) stateCards.push(['Prime factor p', String(factors.p).substring(0, 20) + '…'])

  return stack([
    cards(stateCards),
    `<div style="background: var(--surface-1); border-radius: var(--radius); padding: var(--pad-md); color: var(--text-secondary); font-size: var(--font-size-footnote);">${escape(note)}</div>`,
  ])
}

export const performanceWidget = (d: {
  test_name: string
  problem: string
  bits: number
  dev_machine_time_ms: number
  dev_machine_cpu: string
  classical_record_time: { value: number; unit: string }
  classical_record_machine: string
  scaling_note: string
}): string => {
  const devTime = `${d.dev_machine_time_ms.toLocaleString('en-US')} ms`
  const classicalTime = `${d.classical_record_time.value.toLocaleString('en-US')} ${d.classical_record_time.unit}`

  const cards_list: [string, string][] = [
    ['Problem', d.problem],
    ['Problem size', `${d.bits} bits`],
    ['Dev machine', d.dev_machine_cpu],
    ['Dev time', devTime],
    ['Classical record', classicalTime],
    ['Record machine', d.classical_record_machine],
  ]

  return stack([
    `<div style="background: var(--surface-1); border-radius: var(--radius); padding: var(--pad-md); border-left: 4px solid var(--fill-accent); color: var(--text-primary); font-weight: 500;">${escape(d.test_name)}</div>`,
    cards(cards_list),
    `<div style="background: var(--surface-1); border-radius: var(--radius); padding: var(--pad-md); color: var(--text-secondary); font-size: var(--font-size-footnote);">${escape(d.scaling_note)}</div>`,
  ])
}

export const quantumAdvantageWidget = (d: {
  problem: string
  bits: number
  classical_method: string
  classical_effort: { value: number; unit: string; verified: boolean }
  quantum_estimated: { value: number; unit: string; speedup: number }
  threshold: string
  evidence: string[]
  sources: string[]
}): string => {
  const classicalCost = `${d.classical_effort.value.toLocaleString('en-US')} ${d.classical_effort.unit}`
  const quantumCost = `${d.quantum_estimated.value.toLocaleString('en-US')} ${d.quantum_estimated.unit}`
  const speedup = `${d.quantum_estimated.speedup.toExponential(2)}×`
  const verified = d.classical_effort.verified ? 'verified' : 'estimated'

  const comparisonCards: [string, string][] = [
    ['Problem', d.problem],
    ['Problem size', `${d.bits} bits`],
    ['Classical method', d.classical_method],
    ['Classical cost', `${classicalCost} (${verified})`],
    ['Quantum estimate', quantumCost],
    ['Quantum advantage', speedup],
    ['Threshold', d.threshold],
  ]

  const evidenceListing = d.evidence.map((e) => `<li>${escape(e)}</li>`).join('')
  const sourceListing = d.sources.map((s) => `<li style="font-size: var(--font-size-footnote); color: var(--text-secondary);">${escape(s)}</li>`).join('')

  return stack([
    cards(comparisonCards),
    `<div style="background: var(--surface-1); border-radius: var(--radius); padding: var(--pad-md); color: var(--text-primary);">
      <div style="font-weight: 500; margin-bottom: var(--gap-sm);">Evidence</div>
      <ul style="margin: 0; padding-left: var(--pad-md); font-size: var(--font-size-footnote);">${evidenceListing}</ul>
    </div>`,
    `<div style="background: var(--surface-1); border-radius: var(--radius); padding: var(--pad-md); color: var(--text-secondary);">
      <div style="font-weight: 500; margin-bottom: var(--gap-sm); color: var(--text-primary);">Sources</div>
      <ul style="margin: 0; padding-left: var(--pad-md);">${sourceListing}</ul>
    </div>`,
  ])
}
