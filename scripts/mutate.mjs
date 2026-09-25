#!/usr/bin/env node
/**
 * Every guard in qpu, proved able to fail.
 *
 * LEARNED FROM @uuidna/school, which built this first and states the reason better than a restatement would: a
 * test that cannot fail is furniture, and that package had shipped two green ones that were measuring the
 * apparatus rather than the code. The RUNNER is that discipline; the TABLE is qpu's own, because a mutation
 * table copied between packages would test the other package's guards.
 *
 * qpu had 26 test files and nothing establishing that any of them could fail. `npm run ci` runs lean, test and
 * proof — three ways of checking the suite agrees with itself, and no way of checking the suite disagrees with
 * a broken build.
 *
 *   node scripts/mutate.mjs            every mutation
 *   node scripts/mutate.mjs gate       only those whose label matches
 */
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

/**
 * Each row: the file, the exact text to replace, what to replace it with, and what breaking it should mean.
 * `from` must occur EXACTLY ONCE — an anchor that stops matching is how a mutation silently becomes a no-op and
 * reports a guard as passing when nothing was tested. Counted below rather than hoped for.
 *
 * The gate is the honesty binary: 1 = the prose stays, 0 = it drains. Every mutation here either stops it
 * refusing something it should refuse, or makes it refuse everything — and BOTH directions matter. A suite that
 * only tests refusals passes a gate that refuses its own README.
 */
const MUTATIONS = [
  { label: 'gate: the RED list stops draining', file: 'src/quantum/processing/unit/gate.ts',
    from: 'if (r) return { binary: 0, hit: r[0] }',
    to: 'if (false) return { binary: 0, hit: r[0] }',
    breaks: 'an outright overclaim in the red list would pass the honesty gate' },

  { label: 'gate: the international RED list stops draining', file: 'src/quantum/processing/unit/gate.ts',
    from: 'if (ri) return { binary: 0, hit: ri[0] }',
    to: 'if (false) return { binary: 0, hit: ri[0] }',
    breaks: 'the same overclaim written in another script, or in Glagolitic, would pass' },

  { label: 'gate: negation parity inverted', file: 'src/quantum/processing/unit/gate.ts',
    from: 'negs % 2 === 1',
    to: 'negs % 2 === 0',
    breaks: 'a NEGATED overclaim would drain and a plain one would pass — the gate exactly backwards' },

  { label: 'gate: predictions stop draining', file: 'src/quantum/processing/unit/gate.ts',
    from: 'if (!NEGATOR_WORD.test(win)) return { binary: 0, hit: pm[0] }',
    to: 'if (false) return { binary: 0, hit: pm[0] }',
    breaks: 'an unhedged prediction about the future would pass as honest prose' },

  // THE CONTROL IN THE OTHER DIRECTION. Every mutation above makes the gate too permissive; this one makes it
  // refuse everything. If it SURVIVES, the suite only ever checks that bad prose drains and never that good
  // prose stays — which is a gate nobody could ship a README through.
  { label: 'gate: honest prose drains too', file: 'src/quantum/processing/unit/gate.ts',
    from: 'return { binary: 1, hit: null }',
    to: 'return { binary: 0, hit: null }',
    breaks: 'nothing checks that honest prose SURVIVES the gate, only that dishonest prose drains' },

  { label: 'gate: the context window collapses', file: 'src/quantum/processing/unit/gate.ts',
    from: 'const win = text.slice(Math.max(0, m.index - 48), mEnd + 40)',
    to: 'const win = text.slice(m.index, mEnd)',
    breaks: 'a solution or negation sitting just outside the match would stop being seen' },
]

const filter = process.argv[2]
const rows = filter ? MUTATIONS.filter((m) => m.label.includes(filter)) : MUTATIONS
if (rows.length === 0) {
  console.error(`no mutation matches "${filter}"`)
  process.exit(1)
}

/**
 * A MUTANT THAT HANGS IS A MUTANT THAT WAS KILLED, and without a bound it looks like a run that never finishes.
 * Worse, a run stopped from outside never reaches its restore and leaves the tree MUTATED — which has happened
 * in the sibling package twice, once on a file git could not restore. The timeout keeps the decision inside this
 * runner, which always puts the file back.
 */
const SUITE_TIMEOUT_MS = 180_000

const suitePasses = () => {
  try {
    execSync('npm test', { cwd: ROOT, encoding: 'utf8', stdio: 'pipe', timeout: SUITE_TIMEOUT_MS })
    return true
  } catch (error) {
    if (error?.code === 'ETIMEDOUT') console.log('     (the mutant hung the suite — killed by timeout)')
    return false
  }
}

/**
 * THE BASELINE MUST BE GREEN OR EVERY MUTANT IS A FALSE KILL.
 *
 * A mutant is "killed" when the suite fails with it applied. If the suite ALREADY fails — a broken build, a
 * peer's half-finished edit, a genuinely failing test — then it fails for every mutant too, and the runner
 * reports a perfect score while testing nothing. That is the apparatus failing toward green, which is the exact
 * fault mutation testing exists to catch, and this runner shipped without a guard against it in itself.
 *
 * Checked once, before anything is touched, and refused rather than reported.
 */
if (!suitePasses()) {
  console.error(
    '\nMUTATION TESTING REFUSED — the suite does not pass before any mutation is applied.\n'
    + 'Every mutant would be recorded as killed and the score would be meaningless. Fix the suite first.\n',
  )
  process.exit(1)
}

console.log(`\nMUTATION TESTING — ${rows.length} mutant(s), baseline green\n`)

const survived = []
const noop = []

for (const m of rows) {
  const path = join(ROOT, m.file)
  const original = readFileSync(path, 'utf8')

  const hits = original.split(m.from).length - 1
  if (hits !== 1) {
    noop.push({ ...m, hits })
    console.log(`  ?  ${m.label}\n     anchor occurs ${hits} time(s), expected exactly 1 — NOT APPLIED`)
    continue
  }

  writeFileSync(path, original.replace(m.from, m.to))
  const passed = suitePasses()
  writeFileSync(path, original)

  if (passed) {
    survived.push(m)
    console.log(`  ✗  ${m.label}\n     SURVIVED — the suite still passed, so nothing checks that ${m.breaks}`)
  } else {
    console.log(`  ✓  ${m.label}`)
  }
}

// leave the tree as it was found, built
execSync('npm run build', { cwd: ROOT, stdio: 'pipe' })

console.log(`\nmutation score: ${rows.length - survived.length - noop.length}/${rows.length} killed`)
if (noop.length) console.log(`${noop.length} not applied — the anchor moved`)
if (survived.length) {
  console.log('\nSURVIVING MUTANTS:')
  for (const m of survived) console.log(`  ${m.label} — ${m.breaks}`)
}

process.exit(survived.length || noop.length ? 1 : 0)
