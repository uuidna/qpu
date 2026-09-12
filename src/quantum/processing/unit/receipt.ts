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
import { join, relative } from 'node:path'
import { qpuFoldOf } from './index.js'
import { receiptsFileOf, type TestReceipt } from './receipted.js'

interface TestEvent { type: string; data: { name?: string; file?: string; nesting?: number; details?: { error?: { message?: string } } } }
interface Row { name: string; file: string; nesting: number; pass: boolean; computations: number; kinds: Record<string, number>; dims: Record<string, number>; dim: string; qubits: number; receipt: string; states: TestReceipt['states']; mint: { calls: number; chain: string }; served: { count: number; folds: string[] } }

/** This run's receipts: the file workers wrote under this process's pid, or, when tests ran in this very process
 * (--test-isolation=none), the one written under its parent. Never another run's. */
const receiptsOf = (): Map<string, TestReceipt> => {
  const own = join(process.cwd(), receiptsFileOf(process.pid))
  const path = existsSync(own) ? own : join(process.cwd(), receiptsFileOf(process.ppid))
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
      // relative to the repo, never absolute: an absolute path carries the machine's home directory into the proof,
      // and the proof must fold the same on a laptop, a runner, and the host
      file: relative(process.cwd(), event.data?.file ?? '') || '',
      nesting: event.data?.nesting ?? 0,
      pass: event.type === 'test:pass',
      message: event.type === 'test:fail' ? (err?.message ?? String(err ?? 'no error reported')) : '',
    })
  }
  const receipts = receiptsOf()
  const none: TestReceipt = { name: '', computations: 0, kinds: {}, dims: {}, dim: '0', qubits: 0, receipt: qpuFoldOf(''), states: [], mint: { calls: 0, chain: '' }, served: { count: 0, folds: [] }, readings: { time: { ns: 0, resolved: false }, temperature: { measured: false, why: 'no record' } } }
  const rows: Row[] = events.map((e) => {
    const got = receipts.get(e.name) ?? none
    return { name: e.name, file: e.file, nesting: e.nesting, pass: e.pass, computations: got.computations, kinds: got.kinds, dims: got.dims, dim: got.dim, qubits: got.qubits, receipt: got.receipt, states: got.states, mint: got.mint, served: got.served ?? { count: 0, folds: [] } }
  })
  const failed = events.filter((e) => !e.pass)
  for (const f of failed) {
    yield `✗ ${f.name}\n`
    if (f.file) yield `    ${f.file}\n`
    for (const line of f.message.split('\n').slice(0, 6)) yield `    ${line}\n`
  }
  // subtests ride their parent's receipt; the standard judges the top-level tests
  // three states: computed, served from the isolate's memo (its fold recorded), or nothing — only nothing is dry
  const dry = rows.filter((r) => r.nesting === 0 && r.computations === 0 && r.mint.calls === 0 && r.served.count === 0)
  const servedOnly = rows.filter((r) => r.nesting === 0 && r.computations === 0 && r.mint.calls === 0 && r.served.count > 0).length
  for (const r of dry) yield `✗ no computational receipt — ${r.name} (${r.file}) computed nothing\n`
  const pass = rows.filter((r) => r.pass).length
  const circuit = rows.filter((r) => r.nesting === 0 && r.computations > 0).length
  const mintOnly = rows.filter((r) => r.nesting === 0 && r.computations === 0 && r.mint.calls > 0).length
  const largest = rows.reduce((top, r) => (r.qubits > top.qubits ? r : top), { dim: '0', qubits: 0, name: '' } as Pick<Row, 'dim' | 'qubits' | 'name'>)
  const sorted = [...rows].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
  const fold = qpuFoldOf(sorted.map((r) => `${r.name}:${r.pass}:${r.receipt}:${r.mint.chain}:${r.served.folds.join(',')}`).join('\u0000'))
  const proof = {
    kind: 'test-receipt',
    standard: 'every test carries a computational receipt proving quantum computation; the proof is deterministic; time and temperature are readings in test-readings.json',
    tests: rows.length,
    pass,
    fail: rows.length - pass,
    dry: dry.length,
    circuit,
    mintOnly,
    servedOnly,
    dim: largest.dim,
    qubits: largest.qubits,
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
    ? `✓ tests — ${pass}/${rows.length} pass; ${circuit} ran the circuit, ${mintOnly} mint-only, ${servedOnly} served-only, largest dim 2^${largest.qubits} (${largest.name.split(':')[0]}); receipt ${fold}; readings ${totalNs} ns, temperature ${readings.temperature.measured ? `${(readings.temperature as { millikelvin: number }).millikelvin} mK` : 'unmeasured'}, cracks ${cracks.length}\n`
    : `✗ tests — ${failed.length} failed, ${dry.length} without computational receipt, ${pass}/${rows.length} pass, receipt ${fold}\n`
}
