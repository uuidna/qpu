// receipt — THE SUITE'S RESULT AS COMPUTATIONAL RECEIPTS. Standard requirement (the captain, 2026-09-11): every test
// carries a receipt proving quantum computation. Every test file imports `test` from ./receipted.js — the door that
// appends each test's ledger slice to test-receipts.jsonl from inside the test process. This reporter, in the runner
// process, folds that file into test-receipt.json, prints failures in full, folds passes, and FAILS the run for any
// top-level test that computed nothing (no amplitude vector and no mint). Recomputable: re-run and the folds return.
//
//   node --test --test-reporter=./dist/quantum/processing/unit/receipt.js dist/quantum/processing/unit/*.test.js
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { qpuCracksOf, qpuFoldOf } from './index.js'
import { RECEIPTS_FILE, type TestReceipt } from './receipted.js'

interface TestEvent { type: string; data: { name?: string; file?: string; nesting?: number; details?: { error?: { message?: string } } } }
interface Row extends TestReceipt { file: string; nesting: number; pass: boolean }

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
  const rows: Row[] = events.map((e) => {
    const got = receipts.get(e.name) ?? { name: e.name, computations: 0, kinds: {}, receipt: qpuFoldOf(''), mint: { calls: 0, chain: '' } }
    return { ...got, file: e.file, nesting: e.nesting, pass: e.pass }
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
  const cracks = qpuCracksOf()
  const out = {
    kind: 'test-receipt',
    standard: 'every test carries a computational receipt proving quantum computation; amplitude receipts and mint receipts are named apart',
    tests: rows.length,
    pass,
    fail: rows.length - pass,
    dry: dry.length,
    circuit,
    mintOnly,
    receipt: fold,
    cracks: { readings: cracks.readings, measured: cracks.measured, named: cracks.cracks.length, list: cracks.cracks },
    rows,
  }
  writeFileSync(join(process.cwd(), 'test-receipt.json'), `${JSON.stringify(out, null, 2)}\n`)
  if (dry.length > 0 || failed.length > 0) process.exitCode = 1
  yield failed.length === 0 && dry.length === 0
    ? `✓ tests — ${pass}/${rows.length} pass; ${circuit} ran the circuit, ${mintOnly} mint-only; cracks ${cracks.cracks.length} (${cracks.measured}/${cracks.readings} readings resolved); receipt ${fold}\n`
    : `✗ tests — ${failed.length} failed, ${dry.length} without computational receipt, ${pass}/${rows.length} pass, receipt ${fold}\n`
}
