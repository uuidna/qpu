// receipted — THE ONE DOOR EVERY TEST WALKS THROUGH. Standard requirement (the captain, 2026-09-11): every test carries
// a computational receipt proving quantum computation. This wrapper snapshots the simulator's receipt ledgers around the
// test body and appends the exact slice that test produced to test-receipts.jsonl; the reporter (receipt.ts) folds that
// file into test-receipt.json and fails any top-level test that computed nothing. Two ledgers, named apart so a receipt
// never overstates: `computations` are amplitude vectors (gate primitives, measurement, cmodexp, xx); `mint` is the
// amplitude-count doubling mintOf(k) = 2^k every constructor runs through. A test file that imports `test` from
// node:test instead of here writes no record, so it reads as dry and fails the standard — the guard is computed.
import { appendFileSync } from 'node:fs'
import { join } from 'node:path'
import { test as nodeTest, type TestContext, type TestOptions } from 'node:test'
import { qpuMintReceiptOf, qpuReceiptFoldOf, qpuReceiptLedgerOf } from './index.js'

export const RECEIPTS_FILE = 'test-receipts.jsonl'
export type TestReceipt = {
  name: string
  computations: number
  kinds: Record<string, number>
  receipt: string
  mint: { calls: number; chain: string }
}

type Fn = (t: TestContext) => void | Promise<void>

const receipted = (name: string, fn: Fn) => async (t: TestContext): Promise<void> => {
  const from = qpuReceiptLedgerOf().length
  const mintFrom = qpuMintReceiptOf()
  try {
    await fn(t)
  } finally {
    const slice = qpuReceiptLedgerOf().slice(from)
    const mintTo = qpuMintReceiptOf()
    const kinds: Record<string, number> = {}
    for (const r of slice) kinds[r.name] = (kinds[r.name] ?? 0) + 1
    const row: TestReceipt = {
      name,
      computations: slice.length,
      kinds,
      receipt: qpuReceiptFoldOf(slice),
      mint: { calls: mintTo.calls - mintFrom.calls, chain: mintTo.chain },
    }
    appendFileSync(join(process.cwd(), RECEIPTS_FILE), `${JSON.stringify(row)}\n`)
  }
}

export function test(name: string, fn: Fn): Promise<void>
export function test(name: string, options: TestOptions, fn: Fn): Promise<void>
export function test(name: string, a: TestOptions | Fn, b?: Fn): Promise<void> {
  if (typeof a === 'function') return nodeTest(name, receipted(name, a))
  return nodeTest(name, a, receipted(name, b as Fn))
}
