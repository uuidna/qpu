// receipted — THE ONE DOOR EVERY TEST WALKS THROUGH. Standard (the captain, 2026-09-11): every test carries a
// computational receipt proving quantum computation, and time and temperature measurements are part of that proof —
// as READINGS. The proof is the deterministic part: the fold of every amplitude vector the test produced and the count
// of every mintOf doubling; two honest runs fold to the same receipt. The readings are the measured part: the wall
// time of the test body in nanoseconds from the process clock, and the temperature — measured only when a lab supplies
// it as QPU_TEMPERATURE_MILLIKELVIN, otherwise unmeasured and said so. Readings never enter the fold and never enter
// src, so the served unit and the committed receipt carry no entropy; the reporter writes them to a sidecar.
import { appendFileSync } from 'node:fs'
import { join } from 'node:path'
import { test as nodeTest, type TestContext, type TestOptions } from 'node:test'
import { qpuMintReceiptOf, qpuReceiptFoldOf, qpuReceiptLedgerOf } from './index.js'

export const RECEIPTS_FILE = 'test-receipts.jsonl'
export type Temperature = { measured: true; millikelvin: number; source: 'QPU_TEMPERATURE_MILLIKELVIN' } | { measured: false; why: string }
export type TestReceipt = {
  name: string
  computations: number
  kinds: Record<string, number>
  receipt: string
  /** exact integer amplitudes of every distinct measured state this test produced — the Born weights themselves — with how often each was measured */
  states: { name: string; dim: number; amplitudes: readonly string[]; measured: number }[]
  mint: { calls: number; chain: string }
  readings: { time: { ns: number; resolved: boolean }; temperature: Temperature }
}

export const temperatureOf = (env = process.env): Temperature => {
  const raw = env.QPU_TEMPERATURE_MILLIKELVIN
  const millikelvin = raw === undefined ? NaN : Number(raw)
  return millikelvin === millikelvin && raw !== undefined && raw !== ''
    ? { measured: true, millikelvin, source: 'QPU_TEMPERATURE_MILLIKELVIN' }
    : { measured: false, why: 'no thermometer on this host; supply QPU_TEMPERATURE_MILLIKELVIN from a lab reading' }
}

type Fn = (t: TestContext) => void | Promise<void>

/** Distinct states, each counted: the same Bell measurement a thousand times is one state measured a thousand times. */
const statesOf = (slice: ReturnType<typeof qpuReceiptLedgerOf>): TestReceipt['states'] => {
  const seen = new Map<string, TestReceipt['states'][number]>()
  for (const r of slice) {
    if (r.amplitudes === undefined) continue
    const key = `${r.name}:${r.dim}:${r.amplitudes.join(',')}`
    const prior = seen.get(key)
    if (prior) prior.measured += 1
    else seen.set(key, { name: r.name, dim: r.dim, amplitudes: r.amplitudes, measured: 1 })
  }
  return [...seen.values()]
}

const receipted = (name: string, fn: Fn) => async (t: TestContext): Promise<void> => {
  const from = qpuReceiptLedgerOf().length
  const mintFrom = qpuMintReceiptOf()
  const started = process.hrtime.bigint()
  try {
    await fn(t)
  } finally {
    const ns = Number(process.hrtime.bigint() - started)
    const slice = qpuReceiptLedgerOf().slice(from)
    const mintTo = qpuMintReceiptOf()
    const kinds: Record<string, number> = {}
    for (const r of slice) kinds[r.name] = (kinds[r.name] ?? 0) + 1
    const row: TestReceipt = {
      name,
      computations: slice.length,
      kinds,
      receipt: qpuReceiptFoldOf(slice),
      states: statesOf(slice),
      mint: { calls: mintTo.calls - mintFrom.calls, chain: mintTo.chain },
      readings: { time: { ns, resolved: ns > 0 }, temperature: temperatureOf() },
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
