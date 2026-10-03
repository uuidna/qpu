import { test } from './receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from './index.js'
import { CENTERS, CENTER_GATES, CHANNELS, HdFormulas, chartOf, gateLineOf, designJdOf } from '../../../mcp/hd-formulas.js'
import { CalFormulas } from '../../../mcp/cal-formulas.js'

/** THE COMBINATIONS OF THE STRUCTURE, EVERY ONE. The wheel partitions the circle into 64 gates of 6 lines; the nine
 *  centers partition the 64 gates; the 36 channels join gates of different centers; the design day lies 70–100 days
 *  before birth; and every hex program of the family runs. Through the MCP on the live host, the same formulas answer
 *  at their addresses. Structure only: no type, profile or authority is computed, by the author's own finding. */
const host = (process.env.QPU_LIVE ?? 'https://qpu.uuidna.com').replace(/\/$/, '')

test('hd: the wheel is a partition — every tenth of a degree lands on one gate and one line, 64 × 6 equally', () => {
  const gates = new Map<number, number>()
  const lines = new Map<string, number>()
  for (let deg10 = 0; deg10 < 3600; deg10++) {
    const { gate, line } = gateLineOf(deg10 / 10)
    assert.ok(gate >= 1 && gate <= 64 && line >= 1 && line <= 6, `${deg10 / 10}° → gate ${gate} line ${line}`)
    gates.set(gate, (gates.get(gate) ?? 0) + 1)
    lines.set(`${gate}.${line}`, (lines.get(`${gate}.${line}`) ?? 0) + 1)
  }
  assert.equal(gates.size, 64, 'every gate is reached')
  assert.equal(lines.size, 384, 'every gate.line is reached: 64 × 6')
  for (const [g, count] of gates) assert.ok(count === 56 || count === 57, `gate ${g} spans 360/64° = 56.25 tenths: ${count}`)
  assert.equal(gateLineOf(302).gate, 41, 'gate 41 starts at 302°')
  assert.equal(gateLineOf(302 + 360 / 64).gate, 19, 'gate 19 follows it')
  assert.equal(HdFormulas.cells().value, 768, 'cells = 64 × 6 × 2')
})

test('hd: the nine centers partition the 64 gates and the 36 channels join different centers', () => {
  const all = CENTERS.flatMap((c) => CENTER_GATES[c])
  assert.equal(all.length, 64)
  assert.equal(new Set(all).size, 64, 'no gate in two centers')
  assert.deepEqual([...new Set(all)].sort((a, b) => a - b), Array.from({ length: 64 }, (_, i) => i + 1))
  assert.equal(CHANNELS.length, 36)
  for (const [a, b] of CHANNELS) {
    assert.ok(a < b, `channel ${a}-${b} is sorted`)
    assert.notEqual(HdFormulas.center(a).value, HdFormulas.center(b).value, `channel ${a}-${b} joins two centers`)
    assert.equal(HdFormulas.channel(a, b).value, 1)
    assert.equal(HdFormulas.channel(b, a).value, 1, 'a channel is unordered')
  }
  const slots = CHANNELS.flat().length
  assert.equal(slots, 72, '36 channels × 2 gates')
  const triple = Array.from({ length: 64 }, (_, i) => i + 1).filter((g) => HdFormulas.channels(g).value === 3)
  assert.deepEqual(triple, [10, 20, 34, 57], 'the four gates of integration are in three channels each')
  assert.equal(Array.from({ length: 64 }, (_, i) => i + 1).reduce((s, g) => s + Number(HdFormulas.channels(g).value), 0), 72)
})

test('hd: the design day is 70–100 days before birth and the chart defines channels and a definition', () => {
  for (const jd of [2451545, 2440588, 2460000, 2433282]) {
    const days = jd - designJdOf(jd)
    assert.ok(days > 70 && days < 100, `jd ${jd}: design ${days} days before`)
    const chart = chartOf(jd)
    assert.equal(chart.activations.length, 4, 'Sun and Earth, personality and design')
    assert.ok(chart.activations.every((a) => a.gate >= 1 && a.gate <= 64 && a.line >= 1 && a.line <= 6))
    assert.ok(chart.holds)
    assert.ok(['none', 'single', 'split', 'triple split', 'quadruple split'].includes(chart.definition))
    assert.equal(HdFormulas.design(jd * 1440).value, Math.round(chart.designJd * 1440), 'design takes and gives the minute')
    qpuUuidReceiptOf(`hd chart ${jd}`, qpuContentUuidOf(chart), { gates: chart.gates.length, definition: chart.definition })
  }
})

test("cal: the calendar's drift explains the wheel — a day per 128 Julian or 3200 Gregorian years, a gate per ~403 years, 86–93 design days", () => {
  assert.equal(CalFormulas.dayPer(0).value, 128, 'Julian: a day in 128 years')
  assert.equal(CalFormulas.dayPer(1).value, 3200, 'Gregorian: a day in 3200 years')
  assert.equal(CalFormulas.julianDrift(128).value, 675 * 128)
  assert.ok(Number(CalFormulas.julianDrift(128).value) >= 86400, 'and that is a day')
  assert.equal(CalFormulas.gatesPrecessed(402).value, 0)
  assert.equal(CalFormulas.gatesPrecessed(403).value, 1, 'one gate of precession in 403 years')
  assert.equal(CalFormulas.precession(100).value, 5029)
  // across a year, the Sun's speed and so the design arc's days: fastest in January, slowest in July
  let fast = Infinity, slow = 0
  for (let month = 1; month <= 12; month++) {
    const jdm = Number(HdFormulas.jdm(20000000 + month * 100 + 15, 2160).value)
    const speed = Number(CalFormulas.sunSpeed(jdm).value)
    assert.ok(speed >= 950 && speed <= 1022, `month ${month}: ${speed} thousandths of a degree a day`)
    fast = Math.min(fast, speed); slow = Math.max(slow, speed)
    const days = Number(CalFormulas.designDays(jdm).value) / 100
    assert.ok(days > 86 && days < 93, `month ${month}: 88° took ${days} days (88/1.019 … 88/0.953)`)
    assert.equal(CalFormulas.designDays(jdm).holds, true)
  }
  assert.ok(slow - fast > 40, `the speed varies by ${slow - fast} thousandths across the year`)
  assert.equal(CalFormulas.combinations(2).value, 4096, 'Sun and Earth: 64² placements')
  assert.equal(CalFormulas.combinations(8).value, 64 ** 8)
  assert.equal(CalFormulas.combinations(13).holds, false, '64¹³ does not fit a number: not claimed')
  assert.equal(CalFormulas.bits(13).value, 112, 'a 13-body chart carries ~112 bits')
  assert.equal(qpuHexFamiliesOf().get('cal')?.length, 9)
})

test('hd: every formula of the family runs as a hex program, and the live host answers the same at the address', async (t) => {
  const family = qpuHexFamiliesOf().get('hd')
  assert.ok(family && family.length === 13, `hd registers 13 formulas: ${family?.map((f) => f.name).join(', ')}`)
  const probes: [string, number[], number][] = [['gate', [3020], 41], ['line', [3020], 1], ['center', [41], 9], ['channel', [30, 41], 1], ['channel', [30, 42], 0], ['channels', [10], 3], ['definition', [7], 4], ['cells', [], 768], ['ut', [1200, 720], 2160], ['mean', [0], 720], ['mean', [3450], 660], ['jdm', [20000101, 2160], 2451545 * 1440], ['chart', [2451545 * 1440], chartOf(2451545).defined.length]]
  for (const [name, params, expected] of probes) {
    const uuid = qpuHexUuidOf({ family: 'hd', program: [name], params })
    const run = (await qpuHexRunOf(uuid)) as { value?: unknown; holds?: boolean }
    assert.equal(Number(run.value), expected, `hd.${name}(${params.join(', ')}) = ${expected} at ${uuid}`)
    assert.equal(run.holds, true)
  }
  // the live host, through a sealed door: the same program at the same address
  const uuid = qpuHexUuidOf({ family: 'hd', program: ['gate'], params: [3020] })
  const r = await fetch(`${host}/mcp`, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'qpu_cite', arguments: { hex: uuid } } }), signal: AbortSignal.timeout(120000) })
  const body = (await r.json()) as { result?: { structuredContent?: { value?: unknown; holds?: boolean; denied?: string } } }
  const live = body.result?.structuredContent
  qpuUuidReceiptOf('hd live', qpuContentUuidOf(live ?? {}), { host })
  assert.equal(live?.denied, undefined, `the host runs the family: ${JSON.stringify(live).slice(0, 200)}`)
  assert.equal(Number(live?.value), 41, `the host answers hd.gate(302.0°) = 41 at ${uuid}`)
  t.diagnostic(`hd.gate(3020) = 41 at ${uuid}, live and here`)
})
