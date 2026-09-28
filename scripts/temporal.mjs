/**
 * WHAT IS NOT YET QUANTUM, MEASURED RATHER THAN GUESSED.
 *
 * This package computes exactly and folds what it computed: amplitudes, mint doublings, a receipt. Beside that
 * it records time, because time is MEASURED and never enters the fold. Both halves have been written to disk
 * for months — computation per test in test-receipt.json, wall time per test in test-readings.json — and
 * nothing has ever joined them, which is a shame, because the join is the only honest way to ask the question
 * this tree keeps asserting an answer to.
 *
 * A SECOND SPENT COMPUTING IS QUANTUM. A second spent waiting is not, whatever the README says. So each test's
 * nanoseconds are set against what it actually computed and the run divides three ways:
 *
 *   computed     time that tracks amplitudes and mint doublings — the part that is what it claims to be
 *   foreign      time explained by a host this tree does not own, which is honest and is not ours to remove
 *   unexplained  time with neither: no computation, no foreign read, and a clock that still moved
 *
 * THE THIRD COLUMN IS THE FINDING. It is not a failure — building, parsing, serialising and starting a
 * process all take real time and none of it is a defect. It is the part that has not been made computational,
 * and naming it is the difference between "this is a quantum unit" and "this is a quantum unit and here is
 * the fraction of its own runtime that still is not".
 *
 * It reads artifacts rather than re-running anything, so it costs nothing and cannot disturb what it measures.
 *
 *   node scripts/temporal.mjs
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

/** A row is quantum in proportion to what it computed; the rate is how many nanoseconds each computation cost. */
export const ONE_SECOND_NS = 1_000_000_000

/**
 * The critical path: the busiest WORKER, not the busiest file.
 *
 * Grouping by `file` gave the whole sum on one row, because every test is defined through receipted.js and
 * that is the file the runner reports — so the estimate said the critical path was the entire run and the
 * harness was zero, which is the answer you get when you measure the wrapper instead of the process. The pid
 * is the worker, it is recorded beside the time, and the division is then exact rather than assumed.
 */
export const criticalOf = (rows) => {
  const perWorker = new Map()
  for (const row of rows) perWorker.set(row.pid, (perWorker.get(row.pid) ?? 0) + row.ns)
  const [pid, ns] = [...perWorker.entries()].sort((a, b) => b[1] - a[1])[0] ?? [0, 0]
  return [pid, ns, perWorker.size]
}

/**
 * The verdict, pure and separate from the reading of files, so it can be driven with the conditions it claims
 * to catch. `work` is computations plus mint calls — the two things this package counts as computing.
 */
export const temporalOf = (rows, wallNs = 0) => {
  const seen = rows.filter((row) => row.ns > 0)
  const computed = seen.filter((row) => row.work > 0 && row.foreign === 0)
  const foreign = seen.filter((row) => row.foreign > 0)
  const unexplained = seen.filter((row) => row.work === 0 && row.foreign === 0)
  const nsOf = (list) => list.reduce((sum, row) => sum + row.ns, 0)
  const totalNs = nsOf(seen)
  /* The rate is taken over the rows that computed and asked nobody, because a row that waited on a host has a
   * cost the arithmetic here cannot attribute and a row that computed nothing has no denominator. */
  const work = computed.reduce((sum, row) => sum + row.work, 0)
  const [slowest, critical, workers] = criticalOf(seen)
  return {
    rows: seen.length,
    totalNs,
    computedNs: nsOf(computed),
    foreignNs: nsOf(foreign),
    unexplainedNs: nsOf(unexplained),
    /** Thousandths, so each share is an integer and the three of them close. */
    computedShare: totalNs > 0 ? Math.round((nsOf(computed) * 1000) / totalNs) : 0,
    foreignShare: totalNs > 0 ? Math.round((nsOf(foreign) * 1000) / totalNs) : 0,
    unexplainedShare: totalNs > 0 ? Math.round((nsOf(unexplained) * 1000) / totalNs) : 0,
    nsPerWork: work > 0 ? Math.round(nsOf(computed) / work) : 0,
    /**
     * THE HARNESS, WHICH IS THE ACTUAL ANSWER TO THE QUESTION.
     *
     * Every top-level test computes something, because the dry-clean rule fails a run where one does not — so
     * per-test unexplained time is zero BY CONSTRUCTION and reporting it as a finding would be reporting that
     * a gate works. The time that is not yet quantum is around the tests, not inside them: files run in
     * parallel worker processes, so the wall is the critical path plus module load, spawn and the fold.
     *
     * An ESTIMATE, and said to be. Perfect parallelism is assumed, so the critical path is taken as the
     * slowest file; a run that queued workers has less harness than this reports and more waiting.
     */
    wallNs,
    criticalNs: critical,
    criticalPid: slowest,
    workers,
    /** Wall minus the critical path: spawn, module load, the fold. Never negative, and zero when unmeasured. */
    harnessNs: wallNs > 0 ? Math.max(0, wallNs - critical) : 0,
    harnessShare: wallNs > 0 ? Math.round((Math.max(0, wallNs - critical) * 1000) / wallNs) : 0,
    /** The rows that took the longest while computing nothing and asking nobody — where to look first. */
    notYetQuantum: [...unexplained].sort((a, b) => b.ns - a.ns).slice(0, 7),
    /* Sound when every row it counted landed in exactly one of the three. A row cannot be both waiting on a
     * host and unexplained, and a run whose parts do not sum to its whole has lost time somewhere. */
    holds: computed.length + foreign.length + unexplained.length === seen.length && nsOf(computed) + nsOf(foreign) + nsOf(unexplained) === totalNs,
  }
}

/** Join the two artifacts by test name. A name in one and not the other is reported, never silently dropped. */
export const joinOf = (receipt, readings) => {
  const timed = new Map(readings.rows.map((row) => [row.name, { ns: row.time?.ns ?? 0, pid: row.pid ?? 0 }]))
  const all = [...receipt.rows, ...(readings.foreign?.rows ?? [])]
  return all.map((row) => ({
    name: row.name,
    ns: timed.get(row.name)?.ns ?? 0,
    pid: timed.get(row.name)?.pid ?? 0,
    work: (row.computations ?? 0) + (row.mint?.calls ?? 0),
    foreign: row.foreign ?? 0,
    served: row.served?.count ?? 0,
  }))
}

const invoked = process.argv[1]?.endsWith('temporal.mjs') === true
if (invoked) {
  const root = process.cwd()
  const receiptPath = join(root, 'test-receipt.json')
  const readingsPath = join(root, 'test-readings.json')
  if (!existsSync(receiptPath) || !existsSync(readingsPath)) {
    console.log('run `npm test` first — this reads the artifacts it wrote, and measures nothing itself')
    process.exit(1)
  }
  const receipt = JSON.parse(readFileSync(receiptPath, 'utf8'))
  const readings = JSON.parse(readFileSync(readingsPath, 'utf8'))
  const rows = joinOf(receipt, readings)
  const read = temporalOf(rows, readings.process?.uptimeNs ?? 0)
  const secs = (ns) => (ns / ONE_SECOND_NS).toFixed(1)
  const pct = (share) => `${(share / 10).toFixed(1)}%`

  console.log(`\nTIME — ${read.rows} tests over ${secs(read.wallNs)}s of wall, ${secs(read.totalNs)}s summed across parallel workers\n`)
  console.log(`  INSIDE THE TESTS`)
  console.log(`    computed    ${secs(read.computedNs).padStart(7)}s  ${pct(read.computedShare).padStart(6)}  amplitudes and mint doublings, ${read.nsPerWork} ns each`)
  console.log(`    foreign     ${secs(read.foreignNs).padStart(7)}s  ${pct(read.foreignShare).padStart(6)}  a host this tree does not own`)
  console.log(`    unexplained ${secs(read.unexplainedNs).padStart(7)}s  ${pct(read.unexplainedShare).padStart(6)}  zero by construction: the dry-clean fails a test that computes nothing`)
  console.log(`\n  AROUND THEM`)
  console.log(`    critical    ${secs(read.criticalNs).padStart(7)}s          the busiest of ${read.workers} worker(s), pid ${read.criticalPid}`)
  console.log(`    harness     ${secs(read.harnessNs).padStart(7)}s  ${pct(read.harnessShare).padStart(6)}  NOT YET QUANTUM — spawn, module load, the fold`)
  if (read.notYetQuantum.length > 0) {
    console.log(`\n  tests where the clock moved and nothing was computed:`)
    for (const row of read.notYetQuantum) console.log(`    ${secs(row.ns).padStart(6)}s  ${row.name.slice(0, 66)}`)
  }
  console.log(
    `\nThe dry-clean drove per-test unexplained time to zero, which is a gate working rather than a finding.` +
      `\nWhat is not yet quantum is the ${pct(read.harnessShare)} of wall spent starting, loading and folding — real time,` +
      `\nno defect, and not yet computation. The critical path is the busiest worker, grouped by pid.\n`,
  )
  process.exit(read.holds ? 0 : 1)
}
