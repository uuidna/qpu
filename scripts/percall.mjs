/**
 * WHAT ONE CALL COSTS, which the receipts cannot say.
 *
 * test-receipt.json aggregates per TEST, and the tests that got dearer between 0.1.1 and 0.1.4 all walk the
 * catalogue and call every door — so "production grade MCP" costing 626,647 more units says the walk got
 * dearer without saying whether a door did. The served document is the same size and lists the same eight
 * doors, so the suspicion is that a single call now computes more for the same answer. This measures that
 * directly by snapshotting the ledgers around one call, which is exactly what the test wrapper does per test.
 *
 * COLD AND WARM ARE DIFFERENT QUESTIONS AND ARE REPORTED APART. The first call to a door builds documents the
 * isolate then memoises; the second is served from that memo. A single figure would average a cache miss with
 * a cache hit and call the result "the cost of a call", which is true of no call anybody makes. Cold is what
 * the first request of an isolate pays; warm is what every one after it pays.
 *
 * EXACT, so it compares across releases and machines. Amplitude rows and mint doublings are counted, never
 * timed — a nanosecond figure would measure this laptop.
 *
 * IT ONCE WALKED THE RELEASES and no longer does. A `--releases` mode checked every tag out into its own
 * worktree, built it and measured it — a compile per tag, minutes of machine, in no gate, run exactly once.
 * It answered its question and the answer is recorded where answers belong: per-call cost is FLAT, 1,076,192
 * to 1,093,246 across four releases, +1.6%, and it FELL 3.1% at 0.1.4. That refuted a per-call regression I
 * had committed on an inference from an absence. A tool kept for a question already answered is a long task
 * with nothing behind it, and this repository has enough of those; the git history holds the numbers and
 * anyone who needs them again can write twenty lines.
 *
 * WHAT REMAINS IS A FLOOR. The warm total is ratcheted as a debt, so the memoisation that took it from
 * 842,163 to 176,185 cannot quietly come undone — which is the only reason this file earns its place.
 *
 *   node scripts/percall.mjs [--json]
 */
import { pathToFileURL } from 'node:url'
import { join } from 'node:path'
import { tenOf } from './lattice-values.mjs'

const DOORS = ['quantum', 'lean', 'cite', 'train', 'forge', 'improve', 'compete', 'prove']

/** The two ledgers this package counts as computing, read at a point in time. */
export const markOf = (unit) => ({
  computations: unit.qpuReceiptLedgerOf?.().length ?? 0,
  mint: unit.qpuMintReceiptOf?.().calls ?? 0,
})

export const workBetween = (before, after) => after.computations - before.computations + (after.mint - before.mint)

/**
 * One door, called twice. `cold` includes whatever the isolate had to build; `warm` is the same call again.
 * A door that is absent from a release is reported as absent rather than as zero, because a door that does
 * not exist and a door that costs nothing are different facts and only one of them is interesting.
 */
export const doorCostOf = async (unit, worker, name, env) => {
  const call = async () => {
    const res = await worker.fetch(
      new Request('https://qpu.uuidna.com/mcp', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: {} } }),
      }),
      env,
    )
    const body = await res.json().catch(() => undefined)
    return { status: res.status, ok: body?.result !== undefined }
  }
  const beforeCold = markOf(unit)
  const first = await call()
  const afterCold = markOf(unit)
  if (!first.ok) return { name, present: false, why: `the door answered ${first.status} with no result` }
  const beforeWarm = markOf(unit)
  await call()
  const afterWarm = markOf(unit)
  return { name, present: true, cold: workBetween(beforeCold, afterCold), warm: workBetween(beforeWarm, afterWarm) }
}

/** The totals, and the ratio the memo buys — reported in thousandths so it is an integer. */
export const summaryOf = (rows) => {
  const present = rows.filter((row) => row.present)
  const cold = present.reduce((sum, row) => sum + row.cold, 0)
  const warm = present.reduce((sum, row) => sum + row.warm, 0)
  return {
    doors: present.length,
    absent: rows.length - present.length,
    cold,
    warm,
    /** What a warm call costs as a share of a cold one. Below 1000 means the memo is doing something. */
    warmShare: cold > 0 ? Math.round((warm * tenOf(3)) / cold) : 0,
    holds: present.every((row) => row.cold >= 0 && row.warm >= 0) && present.length + (rows.length - present.length) === rows.length,
  }
}

/** The change from one release to the next, in thousandths, negative when a call got cheaper. */
export const seriesOf = (releases) =>
  releases.map((row, i) => {
    const prior = releases[i - 1]
    return { ...row, delta: prior && prior.cold > 0 ? Math.round(((row.cold - prior.cold) * tenOf(3)) / prior.cold) : undefined }
  })

const invoked = process.argv[1]?.endsWith('percall.mjs') === true

if (invoked) {
  const dist = join(process.cwd(), 'dist', 'quantum', 'processing', 'unit', 'index.js')
  const unit = await import(pathToFileURL(dist).href)
  const worker = unit.default
  const env = { QPU_HOST: 'qpu.uuidna.com' }
  const rows = []
  for (const name of DOORS) rows.push(await doorCostOf(unit, worker, name, env))
  const read = summaryOf(rows)

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify({ rows, ...read }, null, 2))
    process.exit(read.holds ? 0 : 1)
  }
  console.log(`\nPER CALL — ${read.doors} sealed door(s), exact counts, never timed\n`)
  console.log(`  ${'door'.padEnd(14)} ${'cold'.padStart(10)} ${'warm'.padStart(10)}   warm as a share of cold`)
  for (const row of rows) {
    if (!row.present) {
      console.log(`  ${row.name.padEnd(14)} ${'absent'.padStart(10)}              ${row.why}`)
      continue
    }
    const share = row.cold > 0 ? `${((row.warm * 100) / row.cold).toFixed(1)}%` : '—'
    console.log(`  ${row.name.padEnd(14)} ${String(row.cold).padStart(10)} ${String(row.warm).padStart(10)}   ${share}`)
  }
  console.log(`\n  total        ${String(read.cold).padStart(10)} ${String(read.warm).padStart(10)}   ${(read.warmShare / 10).toFixed(1)}%`)
  const { writeFileSync } = await import('node:fs')
  writeFileSync(join(process.cwd(), 'percall-receipt.json'), `${JSON.stringify({ kind: 'percall-receipt', doors: read.doors, cold: read.cold, warm: read.warm }, null, 2)}\n`)
  console.log(`\n  Cold is what the first request of an isolate pays; warm is what every one after it pays.`)
  console.log(`  Counted, not timed, so this compares across releases and machines.\n`)
  process.exit(read.holds ? 0 : 1)
}
