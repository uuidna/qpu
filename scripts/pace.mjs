/**
 * THE PACE ACROSS RELEASES — the part that is comparable, and only that part.
 *
 * `npm run temporal` reports 2260 ns per computation for one run on one machine. That number cannot be
 * tracked across releases, because a laptop and a CI runner differ by more than any change to this code will,
 * and a series of it would be a chart of what the machine was doing. The COUNT is different: computations and
 * mint doublings are exact, deterministic and committed in test-receipt.json at every tag, so the work a
 * release performs is recoverable from git without re-running anything, on any machine, years later.
 *
 * So there are two series and they are not mixed. Work per test is COMPUTED and compared. Nanoseconds per
 * work is MEASURED and is reported for this host only, with the host named, because a number without its
 * instrument cannot be doubted.
 *
 * AND THE SERIES HAS A SEAM, which is the first thing this had to get right. At 0.1.4 the rows that ask a
 * foreign host moved out of the receipt and into the readings, so 0.1.4 covers 168 rows of 172 while 0.1.3
 * covered all 160. Drawing a line from 27.9M to 22.7M and calling it a 19% improvement would be reporting a
 * change in what is counted as a change in what is done. The rows known to be foreign are therefore excluded
 * from EVERY release, so the same work is compared throughout, and what is excluded is printed.
 *
 *   node scripts/pace.mjs
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

/** Work is what this package counts as computing: amplitude rows plus mint doublings. */
export const workOf = (row) => (row.computations ?? 0) + (row.mint?.calls ?? 0)

/**
 * One release, counted over comparable rows only.
 *
 * `foreignNames` are the tests known to ask a host this tree does not own. They are excluded from every
 * release rather than from the ones that happen to label them, because the point of the series is that the
 * same thing is measured each time.
 */
export const releaseOf = (tag, receipt, foreignNames) => {
  const rows = (receipt.rows ?? []).filter((row) => !foreignNames.includes(row.name))
  const excluded = (receipt.rows ?? []).length - rows.length
  const work = rows.reduce((sum, row) => sum + workOf(row), 0)
  return {
    tag,
    tests: receipt.tests ?? 0,
    rows: rows.length,
    excluded,
    work,
    /** The comparable figure: how much computing one test costs. Exact, and independent of any machine. */
    workPerTest: rows.length > 0 ? Math.round(work / rows.length) : 0,
  }
}

/**
 * THE SAME TESTS, RELEASE TO RELEASE — because work per test falls if you merely add cheap ones.
 *
 * A suite that grows with inexpensive tests reports a falling average while every existing test costs
 * exactly what it did, and calling that an improvement would be counting dilution as efficiency. This
 * compares only the tests present in BOTH releases, by name, so what moves is what the same work costs.
 *
 * A test that was renamed leaves both series, which is the honest treatment: it is not the same test by the
 * only handle anyone has, and guessing that it is would be worse than reporting a smaller intersection.
 */
export const sameTestsOf = (before, after) => {
  const prior = new Map((before.rows ?? []).map((row) => [row.name, workOf(row)]))
  const shared = (after.rows ?? []).filter((row) => prior.has(row.name))
  const was = shared.reduce((sum, row) => sum + (prior.get(row.name) ?? 0), 0)
  const now = shared.reduce((sum, row) => sum + workOf(row), 0)
  return {
    shared: shared.length,
    only: (after.rows ?? []).length - shared.length,
    was,
    now,
    delta: was > 0 ? Math.round(((now - was) * 1000) / was) : undefined,
  }
}

/** The change from one release to the next, in thousandths, negative when the work per test fell. */
export const paceOf = (releases) =>
  releases.map((row, i) => {
    const prior = releases[i - 1]
    const delta = prior && prior.workPerTest > 0 ? Math.round(((row.workPerTest - prior.workPerTest) * 1000) / prior.workPerTest) : undefined
    return { ...row, delta }
  })

/**
 * Whether the series says anything. Two releases is a comparison; one is a number, and a release whose rows
 * were all excluded has nothing to compare. Improvement is not asserted — `fell` counts the steps that went
 * down, and a reader decides what that is worth.
 */
export const verdictOf = (series) => {
  const paced = series.filter((row) => row.delta !== undefined)
  return {
    releases: series.length,
    compared: paced.length,
    fell: paced.filter((row) => row.delta < 0).length,
    rose: paced.filter((row) => row.delta > 0).length,
    first: series[0]?.workPerTest ?? 0,
    last: series[series.length - 1]?.workPerTest ?? 0,
    holds: series.every((row) => row.rows === 0 || row.workPerTest > 0) && paced.length === Math.max(0, series.length - 1),
  }
}

const invoked = process.argv[1]?.endsWith('pace.mjs') === true
if (invoked) {
  const root = process.cwd()
  const tags = execFileSync('git', ['tag', '-l', 'v*'], { encoding: 'utf8' })
    .split('\n')
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

  /* The foreign names come from the newest receipt that labels them; older receipts have no such field and
   * would otherwise each be counted over a different set of rows. */
  const local = join(root, 'test-receipt.json')
  const newest = existsSync(local) ? JSON.parse(readFileSync(local, 'utf8')) : { rows: [] }
  const readings = existsSync(join(root, 'test-readings.json')) ? JSON.parse(readFileSync(join(root, 'test-readings.json'), 'utf8')) : {}
  const foreignNames = [...(readings.foreign?.rows ?? []).map((row) => row.name), ...(newest.rows ?? []).filter((row) => (row.foreign ?? 0) > 0).map((row) => row.name)]

  const series = []
  const receipts = new Map()
  for (const tag of tags) {
    let receipt
    try {
      // `${tag}:path` and never `$tag:path` — in zsh the second is a parameter modifier and silently
      // mangles the ref, which reported five releases as having no receipt when every one of them had it.
      receipt = JSON.parse(execFileSync('git', ['show', `${tag}:test-receipt.json`], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }))
    } catch {
      console.log(`  ${tag.padEnd(8)} no committed receipt at this tag`)
      continue
    }
    series.push(releaseOf(tag, receipt, foreignNames))
    receipts.set(tag, receipt)
  }

  const paced = paceOf(series)
  const verdict = verdictOf(paced)
  console.log(`\nPACE — work per test, computed and comparable across ${verdict.releases} release(s)\n`)
  console.log(`  ${'tag'.padEnd(8)} ${'tests'.padStart(6)} ${'rows'.padStart(6)} ${'work'.padStart(12)} ${'per test'.padStart(10)}  change`)
  for (const row of paced) {
    const change = row.delta === undefined ? '' : `${row.delta > 0 ? '+' : ''}${(row.delta / 10).toFixed(1)}%`
    console.log(
      `  ${row.tag.padEnd(8)} ${String(row.tests).padStart(6)} ${String(row.rows).padStart(6)} ${String(row.work).padStart(12)} ${String(row.workPerTest).padStart(10)}  ${change}`,
    )
  }
  if (foreignNames.length > 0) console.log(`\n  excluded from every release, as rows that ask a host this tree does not own:`)
  for (const name of [...new Set(foreignNames)]) console.log(`    ${name.slice(0, 74)}`)

  /* THE MEASURE THAT CANNOT BE DILUTED. Same names, both releases, what the same work costs now. */
  const first = series[0]?.tag
  const last = series[series.length - 1]?.tag
  if (first && last && first !== last) {
    const same = sameTestsOf(receipts.get(first), receipts.get(last))
    console.log(`\n  THE SAME TESTS, ${first} -> ${last}`)
    console.log(`    ${same.shared} test(s) present in both, ${same.only} added since`)
    console.log(`    work ${same.was} -> ${same.now}${same.delta === undefined ? '' : `  ${same.delta > 0 ? '+' : ''}${(same.delta / 10).toFixed(1)}%`}`)
    console.log(`    this is the figure adding cheap tests cannot move`)
  }

  console.log(`\n  ${verdict.fell} of ${verdict.compared} step(s) fell; work per test went ${verdict.first} -> ${verdict.last}.`)
  console.log(
    `  This is the COUNT, which is exact and the same on any machine. The nanoseconds per unit of work are a` +
      `\n  reading of one host and are not tracked here — see npm run temporal, which names its instrument.\n`,
  )
  process.exit(verdict.holds ? 0 : 1)
}
