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
    const cited = [...block.matchAll(/theorem\s+([a-z_]+)/g)].map((row) => row[1]).filter((name) => theorems.has(name))
    out.push({ line: i + 1, text: line.trim().slice(0, 88), grounded: cited.length > 0, cited: [...new Set(cited)] })
  })
  return out
}

const invoked = process.argv[1]?.endsWith('refusals.mjs') === true
if (invoked) {
  const text = readFileSync(UNIT, 'utf8')
  const theorems = theoremsOf(text)
  const rows = groundedOf(text, theorems)
  const loose = rows.filter((row) => !row.grounded)

  console.log(`\n  REFUSALS — ${rows.length} in the unit, against ${theorems.size} theorems it declares\n`)
  console.log(`  grounded in a theorem the tree holds : ${rows.length - loose.length}`)
  console.log(`  naming no theorem                    : ${loose.length}\n`)
  for (const row of loose.slice(0, 20)) console.log(`    ${String(row.line).padStart(6)}  ${row.text}`)

  const receiptPath = join(ROOT, 'refusals-receipt.json')
  const was = existsSync(receiptPath) ? JSON.parse(readFileSync(receiptPath, 'utf8')).ungrounded : undefined
  if (was === undefined || loose.length < was) {
    writeFileSync(receiptPath, `${JSON.stringify({ kind: 'refusals-receipt', refusals: rows.length, ungrounded: loose.length, theorems: theorems.size }, null, 2)}\n`)
    console.log(was === undefined ? '\n  recorded as the first floor\n' : `\n  fell from ${was} — floor recorded\n`)
    process.exit(0)
  }
  if (loose.length > was) {
    console.log(`\n  ROSE from ${was}: a refusal was added without naming the theorem that makes it a consequence\n`)
    process.exit(1)
  }
  console.log(`\n  unchanged at ${was}\n`)
  process.exit(0)
}
