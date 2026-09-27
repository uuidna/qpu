/**
 * THE PROOF MUST NOT MOVE FOR SOMEBODY ELSE'S WEATHER.
 *
 * test-receipt.json is committed and `npm run proof` fails the build when git says it changed. That is the right
 * gate only if the fold is a property of this tree. It was not: the readers reach opendata.cern.ch, and when that
 * host answered they built documents and minted doublings that a refused run never built, so the receipt moved and
 * the gate named this repository for something that had not happened here. It rejected two pushes that way.
 *
 * The repair was to split the fold — rows that asked no foreign host are the proof, rows that asked one are a
 * reading — and the repair was verified by hand, with a fetch shim in a scratchpad, which is exactly the kind of
 * verification that is true once and never again. This script is that shim, kept.
 *
 * FOUR SHAPES, BECAUSE A THIRD PARTY FAILS IN FOUR WAYS. Only the first was ever tested:
 *   throw   the connection is refused                     — TypeError, the shape the original bug reported
 *   status  the host answers 503                          — `live` is true and the answer is useless
 *   body    the host answers 200 with a captive portal    — response.json() throws SyntaxError out of the reader
 *   hang    the socket opens and stays silent             — the deadline decides, or the test is cancelled
 * Each of the last three was a live defect when first run, and none of them is exotic: 503 is a maintenance
 * window, and `body` is every hotel and conference network in the world.
 *
 * Plus `reached`, run against the network as it is. That one is a reading of the day and cannot be required to
 * pass — if CERN is down while this runs, its result equals a blocked run, which is the invariant, not a failure.
 *
 *   node scripts/outage.mjs
 */
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync, writeFileSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const HOST = 'opendata.cern.ch'

/** The shim, written beside the run rather than committed into src: it belongs to the test, not to the unit. */
const SHIM = `
const mode = process.env.CERN_FAIL
const real = globalThis.fetch
globalThis.fetch = async (req, init) => {
  const url = typeof req === 'string' ? req : req.url
  // NO MODE MEANS DO NOTHING. This defaulted to 'throw', so the \`reached\` run was a fifth blocked run wearing the
  // reached run's name — five conditions agreeing, four of them the same condition. The comparison reported that
  // the proof does not move while never once letting the host answer.
  if (!mode || !url.includes('${HOST}')) return real(req, init)
  if (mode === 'throw') throw new TypeError('fetch failed')
  if (mode === 'status') return new Response('upstream unavailable', { status: 503 })
  if (mode === 'body') return new Response('<html>captive portal</html>', { headers: { 'content-type': 'text/html' }, status: 200 })
  if (mode === 'hang') return await new Promise((_, reject) => {
    const signal = init?.signal ?? (typeof req === 'object' ? req.signal : undefined)
    // AN ALREADY-ABORTED SIGNAL NEVER FIRES 'abort' AGAIN. Missing this made the shim itself hang forever once the
    // unit started sharing one deadline across a reading — the harness's bug, reported as the unit's.
    if (!signal) return setTimeout(() => reject(new TypeError('fetch failed')), 30_000)
    if (signal.aborted) return reject(signal.reason ?? new DOMException('aborted', 'AbortError'))
    signal.addEventListener('abort', () => reject(signal.reason ?? new DOMException('aborted', 'AbortError')), { once: true })
  })
  throw new Error('unknown CERN_FAIL: ' + mode)
}
`

export const SHAPES = ['throw', 'status', 'body', 'hang']

/** The verdict, pure, so it is testable without running a suite: one committed artifact across every condition
 *  that ran. `receipt` here is the hash of test-receipt.json itself, because that whole file is what git diffs. */
export const verdictOf = (runs) => {
  const ran = runs.filter((r) => r.ok)
  const folds = [...new Set(ran.map((r) => r.receipt))]
  const failed = runs.filter((r) => !r.ok)
  return {
    folds,
    failed: failed.map((r) => r.name),
    /* A run that could not complete proves nothing, so it is not silence — it is a failure. And one condition is
     * not a comparison: a single green run would otherwise satisfy "all folds agree" vacuously. */
    holds: failed.length === 0 && ran.length > 1 && folds.length === 1,
  }
}

const SUITES = 'dist/quantum/processing/unit'
const suitesOf = () => readdirSync(SUITES).filter((f) => f.endsWith('.test.js')).sort().map((f) => `${SUITES}/${f}`)

const runOf = (dir, name, env) => {
  const out = join(dir, `${name}.txt`)
  try {
    execFileSync(
      process.execPath,
      [
        '--import',
        join(dir, 'shim.mjs'),
        '--test',
        '--test-reporter=./dist/quantum/processing/unit/receipt.js',
        '--test-reporter-destination=stdout',
        // every built suite, read from the tree rather than listed here: a list goes stale the first time a
        // suite is added, and it goes stale silently, which is the failure mode this whole script exists for
        ...suitesOf(),
      ],
      { env: { ...process.env, ...env }, encoding: 'utf8', timeout: 600_000, stdio: ['ignore', 'pipe', 'pipe'] },
    )
  } catch (error) {
    /* THE REASON TRAVELS WITH THE VERDICT. This wrote the output to a temporary directory and printed its path,
     * which is readable on a laptop and gone on a runner — the first real failure this guard caught was a CI-only
     * cancellation whose cause could not be read from the log it failed in. A guard that says only THAT something
     * broke sends the reader back to reproduce it, which is the job the guard was supposed to have done. */
    const log = String(error?.stdout ?? '') + String(error?.stderr ?? '')
    writeFileSync(out, log)
    /* NO FILTER. Two were written here and both were wrong, and each cost a CI round trip to discover: the first
     * matched ✖ where the reporter emits ✗ and printed a blank line; the second matched the ✗ headline and
     * dropped the message lines underneath it, which is where the reason actually is. A failure is rare and its
     * output is short — the tail, verbatim, cannot be wrong about which lines mattered. */
    const said = log.split('\n').filter((line) => line.trim() !== '').slice(-40)
    return { name, ok: false, why: `the suite did not complete`, said }
  }
  const text = readFileSync('test-receipt.json', 'utf8')
  const proof = JSON.parse(text)
  if (proof.fail > 0) return { name, ok: false, why: `${proof.fail} test(s) failed` }
  const readings = JSON.parse(readFileSync('test-readings.json', 'utf8'))
  /* THE GATE DIFFS THE FILE, SO THIS COMPARES THE FILE. Comparing folds alone said the proof held while the
   * artifact still carried three foreign rows and a read count that moved 87 to 205 — `npm run proof` would have
   * gone red on a run this script called green. A check that is weaker than the gate it stands in for is worse
   * than no check, because it is believed. */
  return {
    name,
    ok: true,
    receipt: createHash('sha256').update(text).digest('hex').slice(0, 16),
    fold: proof.receipt,
    reading: readings.foreign?.fold,
    reads: readings.foreign?.reads,
    tests: proof.tests,
    rows: proof.computed,
  }
}

const invoked = process.argv[1]?.endsWith('outage.mjs') === true
if (invoked) {
  execFileSync('npm', ['run', 'build'], { stdio: 'inherit' })
  const dir = mkdtempSync(join(tmpdir(), 'qpu-outage-'))
  writeFileSync(join(dir, 'shim.mjs'), SHIM)

  console.log(`\nOUTAGE — ${HOST} forced into each shape a third party fails in\n`)
  const runs = []
  for (const shape of SHAPES) {
    const row = runOf(dir, shape, { CERN_FAIL: shape })
    runs.push(row)
    console.log(
      row.ok
        ? `  ✓  ${shape.padEnd(7)} ${row.tests} tests, fold ${row.fold} over ${row.rows} rows, file ${row.receipt}, reading ${row.reading} from ${row.reads} reads`
        : `  ✗  ${shape.padEnd(7)} ${row.why}\n${(row.said ?? []).map((line) => `         ${line.trim()}`).join('\n')}`,
    )
  }
  /* The network as it is, reported apart. It is a reading: if the host is down while this runs it simply equals a
   * blocked run, which is the invariant being checked and not a fault. */
  const reached = runOf(dir, 'reached', {})
  console.log(
    reached.ok
      ? `  ·  ${'reached'.padEnd(7)} ${reached.tests} tests, fold ${reached.fold} over ${reached.rows} rows, file ${reached.receipt}, reading ${reached.reading} from ${reached.reads} reads`
      : `  ✗  ${'reached'.padEnd(7)} ${reached.why}\n${(reached.said ?? []).map((line) => `         ${line.trim()}`).join('\n')}`,
  )

  const verdict = verdictOf([...runs, reached])
  console.log('')
  if (verdict.holds) {
    console.log(`test-receipt.json does not move for somebody else's weather: ${verdict.folds[0]} across ${SHAPES.length + 1} conditions`)
    process.exit(0)
  }
  if (verdict.failed.length > 0) console.log(`conditions that did not complete: ${verdict.failed.join(', ')}`)
  if (verdict.folds.length > 1) console.log(`THE COMMITTED FILE MOVED — ${verdict.folds.length} distinct versions: ${verdict.folds.join(' ')}`)
  console.log('a row whose numbers came from a host must carry foreign > 0, or it does not belong in the proof')
  process.exit(1)
}
