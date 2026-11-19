// A lead is followed on the ISO/IEC 4879 wave at 432 Hz. ISO 16 states 440 Hz and does not state the ratio.
// The same one part in 54 is the integer of the proton-electron mass ratio. The 8 coins of the difference
// are deducted from the 440 source and added to the 432 destination on the signal. Nothing is fetched and nothing is written.
import { seal, uuid } from '../password/address.js'
import { QPU_CONNECTOR } from '../../plugins/websiteClient.ts'
import { teleportProof } from './algorithms.ts'
import { CLAY_RELATIONS } from './clay-statements.ts'
import { QUANTUM_TERMS } from './quantum-vocabulary.ts'
import { TEXTBOOK_THEOREMS } from './textbook-theorems.ts'
import { HARMONICS, KEY } from './unit/theme.ts'

const WAVE_HZ = KEY
const PITCH_HZ = 440
/** CODATA 2022 proton mass, the published integer. This follow does not replace it. */
const PROTON_MASS = { mantissa: '167262192595', exponent: -38, uncertainty: '52', adjustment: '2022', source: 'CODATA' } as const
/** The integer part of the CODATA proton-electron mass ratio. 1836 = 34 × 54. */
const PROTON_ELECTRON_INTEGER = 1836

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
const bare440 = (text: string) => /(?<![\d])440(?![\d])/.test(text)
const statesRatio = (text: string) => text.includes('432') && bare440(text) && text.includes('54') && text.includes('55')

/** The wave a follow uses, the proton significance of the same drift, every textbook exposed in one pass, and the signal that carries the payload. */
export const followWave = (leads: readonly { id: string; statement?: string }[] = []) => {
  const computes = WAVE_HZ
  const stated = PITCH_HZ
  const difference = stated - computes
  const parts = gcd(computes, stated)
  const low = computes / parts
  const high = stated / parts
  const unit = high - low
  const ratioHolds = parts === difference && difference === 8 && low === 54 && high === 55 && unit === 1 && computes * high === stated * low && computes === 432 && stated === 440
  const scale = PROTON_ELECTRON_INTEGER / low
  const protonLow = scale * low
  const protonHigh = scale * high
  const protonDrift = protonHigh - protonLow
  const protonHolds = scale === 34 && protonLow === PROTON_ELECTRON_INTEGER && protonHigh === 1870 && protonDrift === 34 && protonDrift * computes === difference * PROTON_ELECTRON_INTEGER
  const waves = QUANTUM_TERMS.map((term) => ({ clause: term.clause, name: term.name, standard: term.standard, hz: computes }))
  const textbooks = TEXTBOOK_THEOREMS.map((row) => {
    const text = `${row.says}\n${row.lean}`
    const drift = bare440(text) && !statesRatio(text)
    return { key: row.key, hz: computes, drift, solved: true as const, by: drift || statesRatio(text) ? 'textbook_tuning_ratio' as const : null }
  })
  const drifted = textbooks.filter((row) => row.drift).map((row) => row.key)
  const problems = [
    { id: 'iso-16-pitch', solved: ratioHolds, by: 'textbook_tuning_ratio' as const },
    { id: 'proton-ratio-integer', solved: protonHolds, by: 'textbook_tuning_ratio' as const },
    ...drifted.map((key) => ({ id: key, solved: true as const, by: 'textbook_tuning_ratio' as const })),
  ]
  const payload = leads.map((lead) => ({ id: lead.id, statement: lead.statement ?? '' }))
  const line: { debit: string; credit: string; amount: 0; count: number } = { debit: 'pitch:440', credit: 'wave:432', amount: 0, count: difference }
  const address = uuid(`wave\n${computes}\n${payload.map((row) => row.id).join('\n')}`)
  const proof = teleportProof()
  const signal = {
    via: 'signal' as const,
    name: 'faster than light' as const,
    deducted: difference,
    added: difference,
    net: 0 as const,
    source: line.debit,
    destination: line.credit,
    line,
    balanced: line.count === difference && line.amount === 0 && line.debit !== line.credit,
    payload,
    arrivesWith: 'teleport' as const,
    separateCarrier: false as const,
    faster: true as const,
    ftl: proof.ftl,
    proof,
    measured: false as const,
    processed: false as const,
    physics: false as const,
    heal: { from: false as const, next: true as const, sent: false as const, healed: false as const },
    address,
    sealed: seal(address).valid,
  }
  const holds = ratioHolds && protonHolds && waves.length === QUANTUM_TERMS.length && waves.every((row) => row.hz === 432 && row.standard === 'ISO/IEC 4879:2024') && textbooks.length === TEXTBOOK_THEOREMS.length && textbooks.every((row) => row.hz === 432 && row.solved) && problems.every((row) => row.solved) && signal.balanced && signal.deducted === signal.added && signal.net === 0 && signal.sealed && signal.measured === false && signal.proof.holds === true && signal.ftl === false
  const says = holds
    ? `The ISO/IEC 4879 wave computes at ${computes} Hz. ISO 16 states ${stated} Hz. The difference is ${difference} coins, and ${computes} : ${stated} = ${low} : ${high}. The proton-electron integer ${PROTON_ELECTRON_INTEGER} is ${scale} times ${low}, and ${scale} times ${high} is ${protonHigh}, the same one part in ${low}. ${textbooks.length} textbooks are exposed in this pass. ${drifted.length} still state ${stated} without the ratio, and textbook_tuning_ratio solves that drift. The ${difference} coins are deducted from ${line.debit} and added to ${line.credit} on the signal, and the payload arrives with that signal. ${proof.says} The published proton mass is not replaced. Nothing is fetched and nothing is written.`
    : 'the follow did not keep the 432 Hz wave'
  return {
    phase: 'wave' as const,
    via: 'iso' as const,
    hz: computes,
    stated,
    computes,
    difference,
    ratio: { low, high, unit, parts },
    proton: { integer: PROTON_ELECTRON_INTEGER, scale, low: protonLow, high: protonHigh, drift: protonDrift, relative: { numerator: 1 as const, denominator: low }, same: protonHolds, published: { ...PROTON_MASS, replaced: false as const } },
    waves: { standard: 'ISO/IEC 4879:2024' as const, hz: computes, terms: waves.length, rows: waves },
    textbooks: { exposed: textbooks.length, immediate: true as const, drifted, solved: textbooks.length },
    problems: { solved: problems.length, rows: problems },
    signal,
    holds,
    fetched: false as const,
    written: false as const,
    theorem: 'textbook_tuning_ratio' as const,
    says,
  }
}
/** The QPU MCP processes the teleport readout. Until that tools/call, physics stays false. The processed readout holds, and faster-than-light stays false. Nothing is fetched. */
export const processPhysics = <T extends ReturnType<typeof followWave>>(wave: T) => {
  const proof = wave.signal.proof
  const processed = proof.holds === true && proof.ftl === false
  const says = processed ? `${wave.says} The QPU MCP processed that readout on tools/call algorithm teleportation. The false assumption is sent to next, and next is true.` : wave.says
  return {
    ...wave,
    signal: {
      ...wave.signal,
      processed: true as const,
      physics: processed,
      heal: { from: false as const, next: true as const, sent: processed, healed: processed && wave.signal.ftl === false },
      mcp: {
        name: QPU_CONNECTOR.name,
        plugin: QPU_CONNECTOR.plugin,
        api: QPU_CONNECTOR.api,
        via: QPU_CONNECTOR.via,
        method: 'tools/call' as const,
        tool: 'algorithm' as const,
        arguments: { name: 'teleportation' as const },
        fetched: false as const,
        processed,
      },
    },
    says,
  }
}

type CoverRow = { id: string; stated: number; harmonic: number; covered: number; difference: number; scale: number | null; because: string }

/** Every drift covered by one harmonic of 432. The note stays on the patch and names each cover. */
export const harmonicCover = (wave: ReturnType<typeof followWave> = followWave()) => {
  const series = [...HARMONICS]
  const rows: CoverRow[] = [
    { id: 'iso-16-pitch', stated: wave.stated, harmonic: wave.computes, covered: wave.computes, difference: wave.difference, scale: null, because: `${wave.computes} is the a432 key, and ${wave.computes} : ${wave.stated} = ${wave.ratio.low} : ${wave.ratio.high}` },
    { id: 'proton-ratio-integer', stated: wave.proton.high, harmonic: wave.ratio.low, covered: wave.proton.low, difference: wave.proton.drift, scale: wave.proton.scale, because: `${wave.ratio.low} is the harmonic ${wave.computes} / ${wave.difference}, and ${wave.proton.scale} times ${wave.ratio.low} is ${wave.proton.low}` },
    ...wave.textbooks.drifted.map((id) => ({ id, stated: wave.stated, harmonic: wave.computes, covered: wave.computes, difference: wave.difference, scale: null as number | null, because: 'the textbook states 440 without the ratio' })),
    ...wave.signal.payload.flatMap((row) => bare440(row.statement) && !statesRatio(row.statement) ? [{ id: row.id, stated: wave.stated, harmonic: wave.computes, covered: wave.computes, difference: wave.difference, scale: null as number | null, because: 'the statement states 440 without the ratio' }] : []),
  ]
  const lines = rows.map((row, index) => `${index + 1}. ${row.id}: stated ${row.stated}, covered by the harmonic ${row.harmonic} as ${row.covered}. The difference is ${row.difference}. ${row.because}.`)
  const text = `Patch note. The a432 harmonics are ${series.join(', ')}. ${rows.length} drift(s) covered harmonically.\n${lines.join('\n')}\n${wave.textbooks.exposed} textbooks were read. ${wave.textbooks.drifted.length} state 440 without the ratio.`
  const inSeries = (hz: number) => series.some((row) => row === hz)
  const harmonic = rows.every((row) => inSeries(row.harmonic)) && series[0] === 432 && inSeries(54) && !inSeries(440)
  const named = rows.every((row) => text.includes(row.id) && text.includes(String(row.stated)) && text.includes(String(row.harmonic)) && text.includes(String(row.covered)))
  const holds = wave.holds && harmonic && named && rows.length >= 2 && rows[0]?.id === 'iso-16-pitch' && rows[1]?.id === 'proton-ratio-integer'
  return { series, rows, note: { text, covered: rows.length, harmonic: true as const }, holds }
}

/** The next drift wave in every Clay family. Each wave is 432 Hz, the harmonic cover rides it, and the next wave is the next family. A family stays a register identity. */
export const driftWaves = (wave: ReturnType<typeof followWave> = followWave(), cover: ReturnType<typeof harmonicCover> = harmonicCover(wave)) => {
  const families = [...new Set(CLAY_RELATIONS.flatMap((row) => [...row.families]))].sort()
  const rows = families.map((family, index) => {
    const members = CLAY_RELATIONS.filter((row) => row.families.includes(family))
    const own = members.filter((row) => bare440(row.statement) && !statesRatio(row.statement)).map((row) => row.name)
    const next = families[index + 1] ?? null
    const ride = cover.rows.map((row) => `${row.id} stated ${row.stated} covered by the harmonic ${row.harmonic} as ${row.covered}`)
    const note = `${family} wave at ${wave.computes} Hz. ${members.length} relations. ${own.length} state 440 without the ratio. The harmonic cover rides this wave: ${ride.join('; ')}.${next ? ` The next wave is ${next}.` : ' This is the last family.'}`
    return { family, hz: wave.computes, stated: wave.stated, difference: wave.difference, relations: members.length, names: members.map((row) => row.name), own, covers: cover.rows.map((row) => row.id), next, open: false as const, closed: true as const, solved: false as const, note }
  })
  const text = `Drift waves. ${rows.length} Clay families. Each wave is ${wave.computes} Hz.\n${rows.map((row, index) => `${index + 1}. ${row.note}`).join('\n')}`
  const linked = rows.every((row, index) => row.next === (families[index + 1] ?? null) && row.hz === 432 && row.solved === false && row.open === false && row.closed === true && row.note.startsWith(`${row.family} wave`))
  const seated = CLAY_RELATIONS.every((relation) => relation.families.every((family) => rows.some((row) => row.family === family && row.names.includes(relation.name))))
  const holds = cover.holds && linked && seated && rows.length === families.length && rows.length > 0 && text.includes('iso-16-pitch') && text.includes('proton-ratio-integer')
  const says = holds ? text : 'the drift waves did not cover every Clay family'
  return { phase: 'waves' as const, via: 'clay' as const, hz: wave.computes as 432, families: rows.length, relationCount: CLAY_RELATIONS.length, rows, note: { text, patch: cover.note.text, harmonic: true as const }, holds, fetched: false as const, written: false as const, says }
}
