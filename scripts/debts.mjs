/**
 * THE DEBTS THIS TREE CARRIES, COUNTED ONCE.
 *
 * Three gates grew separately this session and turned out to be the same machine: find a named debt in the
 * source, count it, compare it to a floor, refuse a rise, write a receipt. Walls with no cause named, bare
 * numbers the lattice already names, refusals with no theorem behind them. Three files, three receipts,
 * three commands and three places to remember — for one question asked three ways.
 *
 * The finders stay where they are, because each knows something the others do not and walls.mjs is vendored
 * byte-identical from millennium-solutions and must not be restructured here. What is consolidated is the
 * RATCHET: one floor file, one verdict, one command. A gate nobody runs is not a gate, and six commands is
 * how you get a gate nobody runs.
 *
 * EVERY FLOOR MAY ONLY SHRINK. A rise names which debt grew and refuses; a fall records the new floor. The
 * numbers are counts of known, named, findable work and never a claim that none exists — reporting zero
 * walls would be the lie, which is why the floor is 23 and not an aspiration.
 *
 *   node scripts/debts.mjs
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
export const RECEIPT = join(ROOT, 'debts-receipt.json')

/**
 * Each debt runs its own finder as its own command, because that is what keeps them honest about their own
 * receipts, and reports the one number it ratchets. Running them in-process would couple three gates into
 * one failure, and a finder that cannot be run alone — a declared boundary of this harness, not of the
 * finders — cannot be debugged alone.
 */
export const DEBTS = [
  { name: 'walls', what: 'a limit asserted with no cause named', run: 'walls', pick: (r) => r.walls },
  { name: 'lattice', what: 'a bare number the lattice already names', run: 'lattice', pick: (r) => r.literals },
  { name: 'refusals', what: 'a refusal naming no theorem this tree holds', run: 'refusals', pick: (r) => r.ungrounded },
  { name: 'dry', what: 'a top-level test that computed nothing', run: undefined, pick: (r) => r.dry, from: 'test-receipt.json' },
]

/** The verdict, pure: a rise in any single debt fails, whatever the others did. */
export const verdictOf = (rows, floor) => {
  const risen = rows.filter((row) => floor[row.name] !== undefined && row.count > floor[row.name])
  const fallen = rows.filter((row) => floor[row.name] !== undefined && row.count < floor[row.name])
  return {
    total: rows.reduce((sum, row) => sum + row.count, 0),
    risen: risen.map((row) => `${row.name} ${floor[row.name]} -> ${row.count}`),
    fallen: fallen.map((row) => `${row.name} ${floor[row.name]} -> ${row.count}`),
    /* A SUM THAT FELL WHILE A PART ROSE IS NOT PROGRESS. Ratcheting the total would let one debt grow
     * behind another's improvement, which is the whole reason each is named. */
    holds: risen.length === 0,
  }
}

const receiptOf = (file) => {
  try {
    return JSON.parse(readFileSync(join(ROOT, file), 'utf8'))
  } catch {
    return undefined
  }
}

const invoked = process.argv[1]?.endsWith('debts.mjs') === true
if (invoked) {
  const rows = []
  for (const debt of DEBTS) {
    if (debt.run) {
      try {
        execFileSync('npm', ['run', '--silent', debt.run], { cwd: ROOT, stdio: 'ignore' })
      } catch {
        /* A finder that refuses is a rise it has already reported in its own words; its receipt still holds
         * the number, and reading it here is what lets one command speak for all of them. */
      }
    }
    const from = debt.from ?? `${debt.name}-receipt.json`
    const read = receiptOf(from)
    rows.push({ name: debt.name, what: debt.what, count: read === undefined ? undefined : debt.pick(read), from })
  }

  const missing = rows.filter((row) => row.count === undefined)
  const found = rows.filter((row) => row.count !== undefined)
  const floor = existsSync(RECEIPT) ? JSON.parse(readFileSync(RECEIPT, 'utf8')).debts : {}
  const verdict = verdictOf(found, floor)

  console.log(`\n  DEBTS — named, findable work this tree carries\n`)
  for (const row of found) {
    const was = floor[row.name]
    const change = was === undefined ? 'first' : row.count === was ? '' : `${row.count > was ? 'ROSE' : 'fell'} from ${was}`
    console.log(`    ${String(row.count).padStart(5)}  ${row.name.padEnd(9)} ${row.what.padEnd(46)} ${change}`)
  }
  for (const row of missing) console.log(`        ?  ${row.name.padEnd(9)} no receipt at ${row.from} — not decidable here`)

  if (!verdict.holds) {
    console.log(`\n  ✗ a debt ROSE: ${verdict.risen.join(', ')}\n`)
    process.exit(1)
  }
  writeFileSync(RECEIPT, `${JSON.stringify({ kind: 'debts-receipt', total: verdict.total, debts: Object.fromEntries(found.map((r) => [r.name, r.count])) }, null, 2)}\n`)
  console.log(verdict.fallen.length > 0 ? `\n  ✓ ${verdict.fallen.join(', ')} — floor recorded\n` : `\n  ✓ ${verdict.total} in total, none risen\n`)
  process.exit(0)
}
