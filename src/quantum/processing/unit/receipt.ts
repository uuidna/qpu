// receipt — THE SUITE'S RESULT AS COMPUTATIONAL RECEIPTS, PROOF APART FROM READINGS. Standard (the captain,
// 2026-09-11): every test carries a receipt proving quantum computation; time and temperature are part of it as
// readings; the receipt itself carries no entropy. Every test file imports `test` from ./receipted.js — the door that
// appends each test's ledger slice and readings to test-receipts.jsonl from inside the test process. This reporter
// folds that file into two artifacts:
//   test-receipt.json  — the PROOF: names, pass/fail, amplitude folds, mint chains, kinds. Deterministic; committed.
//   test-readings.json — the READINGS: wall time per test, temperature (measured or unmeasured, said which), and the
//                        cracks those readings name — an unresolved clock, an unmeasured thermometer. Gitignored.
// A top-level test that computed nothing FAILS the standard. Recomputable: re-run and the proof returns byte for byte.
//
//   node --test --test-reporter=./dist/quantum/processing/unit/receipt.js dist/quantum/processing/unit/*.test.js
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { qpuFoldOf } from './index.js'
import { RECEIPTS_FILE, type TestReceipt } from './receipted.js'

interface TestEvent { type: string; data: { name?: string; file?: string; nesting?: number; details?: { error?: { message?: string } } } }
interface Row { name: string; file: string; nesting: number; pass: boolean; computations: number; kinds: Record<string, number>; receipt: string; states: TestReceipt['states']; mint: { calls: number; chain: string } }

const receiptsOf = (): Map<string, TestReceipt> => {
  const path = join(process.cwd(), RECEIPTS_FILE)
  const map = new Map<string, TestReceipt>()
  if (!existsSync(path)) return map
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    if (!line.trim()) continue
    const row = JSON.parse(line) as TestReceipt
    map.set(row.name, row)
  }
  unlinkSync(path)
  return map
}

export default async function* receipt(source: AsyncIterable<TestEvent>): AsyncGenerator<string> {
  const events: { name: string; file: string; nesting: number; pass: boolean; message: string }[] = []
  for await (const event of source) {
    if (event.type !== 'test:pass' && event.type !== 'test:fail') continue
    const err = event.data?.details?.error
    events.push({
      name: event.data?.name ?? '',
      file: event.data?.file ?? '',
      nesting: event.data?.nesting ?? 0,
      pass: event.type === 'test:pass',
      message: event.type === 'test:fail' ? (err?.message ?? String(err ?? 'no error reported')) : '',
    })
  }
  const receipts = receiptsOf()
  const none: TestReceipt = { name: '', computations: 0, kinds: {}, receipt: qpuFoldOf(''), states: [], mint: { calls: 0, chain: '' }, readings: { time: { ns: 0, resolved: false }, temperature: { measured: false, why: 'no record' } } }
  const rows: Row[] = events.map((e) => {
    const got = receipts.get(e.name) ?? none
    return { name: e.name, file: e.file, nesting: e.nesting, pass: e.pass, computations: got.computations, kinds: got.kinds, receipt: got.receipt, states: got.states, mint: got.mint }
  })
  const failed = events.filter((e) => !e.pass)
  for (const f of failed) {
    yield `✗ ${f.name}\n`
    if (f.file) yield `    ${f.file}\n`
    for (const line of f.message.split('\n').slice(0, 6)) yield `    ${line}\n`
  }
  // subtests ride their parent's receipt; the standard judges the top-level tests
  const dry = rows.filter((r) => r.nesting === 0 && r.computations === 0 && r.mint.calls === 0)
  for (const r of dry) yield `✗ no computational receipt — ${r.name} (${r.file}) computed nothing\n`
  const pass = rows.filter((r) => r.pass).length
  const circuit = rows.filter((r) => r.nesting === 0 && r.computations > 0).length
  const mintOnly = rows.filter((r) => r.nesting === 0 && r.computations === 0 && r.mint.calls > 0).length
  const sorted = [...rows].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
  const fold = qpuFoldOf(sorted.map((r) => `${r.name}:${r.pass}:${r.receipt}:${r.mint.chain}`).join('\u0000'))
  const proof = {
    kind: 'test-receipt',
    standard: 'every test carries a computational receipt proving quantum computation; the proof is deterministic; time and temperature are readings in test-readings.json',
    tests: rows.length,
    pass,
    fail: rows.length - pass,
    dry: dry.length,
    circuit,
    mintOnly,
    receipt: fold,
    readings: 'test-readings.json',
    rows,
  }
  writeFileSync(join(process.cwd(), 'test-receipt.json'), `${JSON.stringify(proof, null, 2)}\n`)
  // readings: measured, per test, never folded, never committed
  const timed = events.filter((e) => e.nesting === 0).map((e) => ({ name: e.name, ...(receipts.get(e.name) ?? none).readings }))
  const totalNs = timed.reduce((acc, r) => acc + r.time.ns, 0)
  const cracks = [
    ...timed.filter((r) => !r.time.resolved).map((r) => ({ kind: 'time', name: r.name, why: 'clock did not resolve the test' })),
    ...(timed.some((r) => r.temperature.measured) ? [] : [{ kind: 'temperature', name: 'host', why: timed[0]?.temperature.measured === false ? timed[0].temperature.why : 'no reading' }]),
  ]
  const readings = { kind: 'test-readings', receipt: fold, time: { totalNs, unit: 'ns', clock: 'process.hrtime' }, temperature: timed[0]?.temperature ?? none.readings.temperature, cracks, rows: timed }
  writeFileSync(join(process.cwd(), 'test-readings.json'), `${JSON.stringify(readings, null, 2)}\n`)
  if (dry.length > 0 || failed.length > 0) process.exitCode = 1
  yield failed.length === 0 && dry.length === 0
    ? `✓ tests — ${pass}/${rows.length} pass; ${circuit} ran the circuit, ${mintOnly} mint-only; receipt ${fold}; readings ${totalNs} ns, temperature ${readings.temperature.measured ? `${(readings.temperature as { millikelvin: number }).millikelvin} mK` : 'unmeasured'}, cracks ${cracks.length}\n`
    : `✗ tests — ${failed.length} failed, ${dry.length} without computational receipt, ${pass}/${rows.length} pass, receipt ${fold}\n`
}
