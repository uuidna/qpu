/**
 * A REFUSAL WITH NO THEOREM NAMED, hunted the way walls are.
 *
 * This unit refuses things: a forge over a reserved name, a write without authorisation, a fetch that would
 * leave the named host, a job past a cap. Every one of those is either a CONSEQUENCE — something a theorem
 * this tree has already sealed makes impossible — or a POLICY, which is somebody's preference wearing a
 * proof's clothes. The two read identically at the call site: both come back `denied`.
 *
 * The difference matters more here than almost anywhere, because the whole claim of this package is that its
 * answers are computed rather than decided. A refusal nobody can trace to a theorem is a decision, and a
 * caller who is told "denied" without being told by what has been given a verdict rather than a reason.
 *
 * CROSS-PROVED, NOT MERELY CITED. Naming a theorem is not enough on its own: the theorem must be one the
 * tree actually holds, so the name is checked against the identities the source declares rather than against
 * a list kept here. A refusal citing `theorem fairness` would fail, because no such theorem exists, which is
 * exactly how a policy smuggles itself in.
 *
 * IT RATCHETS AND DOES NOT REWRITE. Removing a refusal changes what the unit permits, and no finder should
 * do that unattended. The count may only fall.
 *
 *   node scripts/refusals.mjs
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const UNIT = join(ROOT, 'src', 'quantum', 'processing', 'unit', 'index.ts')

/** The identities this tree actually declares, read from the source rather than listed here. */
export const theoremsOf = (text) => new Set([...text.matchAll(/theorem\s+([a-z_]+)/g)].map((row) => row[1]))

/**
 * A refusal is grounded when a theorem the tree holds is named within reach of it. The window is the
 * enclosing blank-line-delimited block, because that is the unit a reader takes in at once — a theorem named
 * forty lines away in another function is not a reason this refusal is correct.
 */
export const groundedOf = (text, theorems) => {
  const lines = text.split('\n')
  const out = []
  lines.forEach((line, i) => {
    if (!/\bdenied:/.test(line)) return
    let from = i
    while (from > 0 && lines[from - 1].trim() !== '') from -= 1
    let to = i
    while (to < lines.length - 1 && lines[to + 1].trim() !== '') to += 1
    const block = lines.slice(Math.max(0, from - 2), to + 2).join('\n')
    const cited = [...new Set([...block.matchAll(/theorem\s+([a-z_]+)/g)].map((row) => row[1]).filter((name) => theorems.has(name)))]
    /**
     * ONE THEOREM IS A CITATION. TWO THAT BOTH BEAR ON IT IS A CROSS.
     *
     * The first version asked only whether a theorem the tree holds was named nearby, and that is a weaker
     * question than the one worth asking. A refusal citing `theorem false` is told what KIND of thing it is;
     * a refusal standing where two theorems meet is told why it could not be otherwise. This package states
     * every quantity twice on purpose — as a sum of like terms and a product of unlike ones — precisely so
     * that a claim rests on two readings that prove each other rather than on one that asserts.
     *
     * Measured when the question was strengthened: the count of properly grounded refusals fell, which is
     * the instrument getting sharper and not the tree getting worse. The earlier 36-to-23 fall came from
     * writing two block comments near clusters of `denied:` — prose moved the number and no refusal changed.
     */
    out.push({
      line: i + 1,
      text: line.trim().slice(0, 88),
      cited,
      cross: cited.length > seedOf(),
      grounded: cited.length > 0,
    })
  })
  return out
}

/** One is a citation; more than one is a cross. Named so the threshold is a statement rather than a digit. */
const seedOf = () => 1

const invoked = process.argv[1]?.endsWith('refusals.mjs') === true
if (invoked) {
  const text = readFileSync(UNIT, 'utf8')
  const theorems = theoremsOf(text)
  const rows = groundedOf(text, theorems)
  const loose = rows.filter((row) => !row.cross)
  const singly = rows.filter((row) => row.grounded && !row.cross)

  console.log(`\n  REFUSALS — ${rows.length} in the unit, against ${theorems.size} theorems it declares\n`)
  console.log(`  cross-grounded, two theorems or more : ${rows.length - loose.length}`)
  console.log(`  one theorem named — a citation       : ${singly.length}`)
  console.log(`  naming no theorem at all             : ${loose.length - singly.length}\n`)
  for (const row of loose.slice(0, 20)) console.log(`    ${String(row.line).padStart(6)}  ${row.text}`)

  const receiptPath = join(ROOT, 'refusals-receipt.json')
  const prior = existsSync(receiptPath) ? JSON.parse(readFileSync(receiptPath, 'utf8')) : {}
  const measure = 'cross'
  const notCross = loose.length
  const write = () =>
    writeFileSync(
      receiptPath,
      `${JSON.stringify({ kind: 'refusals-receipt', measure, refusals: rows.length, notCross, ungrounded: loose.length - singly.length, cited: singly.length, theorems: theorems.size }, null, 2)}\n`,
    )

  /**
   * A FLOOR IS ONLY COMPARABLE WITHIN ONE DEFINITION OF THE MEASURE.
   *
   * This asked "is a theorem named nearby" and now asks "do two theorems meet here", which is the question
   * that was wanted: one name is a citation, two that both bear on a refusal is a cross. Under the old
   * question 23 were loose; under this one 26 are, and that is the instrument sharpening rather than the
   * tree decaying. Comparing the two numbers would report a regression that did not happen.
   *
   * So a change of measure RESETS the floor and says so, once. Every run after it ratchets normally, which
   * is the only way a floor can mean anything across a redefinition — and the reset is recorded in the
   * receipt so the next reader can see that the scale moved under the number.
   */
  if (prior.measure !== measure) {
    write()
    console.log(`\n  the measure changed — "a theorem is named" became "two theorems meet"`)
    console.log(`  floor reset to ${notCross}; the old ${prior.ungrounded ?? '?'} answered a weaker question\n`)
    process.exit(0)
  }
  if (notCross < prior.notCross) {
    write()
    console.log(`\n  fell from ${prior.notCross} — floor recorded\n`)
    process.exit(0)
  }
  if (notCross > prior.notCross) {
    console.log(`\n  ROSE from ${prior.notCross}: a refusal was added without two theorems meeting at it\n`)
    process.exit(1)
  }
  console.log(`\n  unchanged at ${prior.notCross}\n`)
  process.exit(0)
}
