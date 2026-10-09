#!/usr/bin/env node
/**
 * THE FAMILIES SPLIT THEMSELVES, THE GATE DECIDES — AND THE GATE JUDGES THE WHOLE, NOT EACH CUT.
 *
 * For every @wing (the families' domain tag) the monolith declares, this cools that wing's declarations into its own
 * conventional module (scripts/cool.mjs). A wing is ACCEPTED only when cooling the entire accepted set PLUS it, from a
 * clean base, still type-checks — so the kept set is always green as a combined state and a wing whose dependency is
 * not also accepted is simply dropped (never left importing a module that was reverted). It grows the accepted set to a
 * fixpoint, then leaves exactly that set cooled on disk, gated green. No dry run, no human review: the gate is the law.
 *
 *   node scripts/split.mjs [file]
 */
import fs from 'node:fs'
import { execSync } from 'node:child_process'
import { mintOf } from './lattice-values.mjs'

const file = process.argv[2] ?? 'src/quantum/processing/unit/index.ts'
const dir = file.replace(/[^/]+$/, '')
const quiet = (cmd) => { try { execSync(cmd, { stdio: 'pipe' }); return true } catch { return false } }
const gate = () => quiet('npx tsc -p tsconfig.json --noEmit')

// wing -> its declaration names, read once from the clean HEAD monolith (@wing is the families' domain decision)
const wingsOf = () => {
  const lines = fs.readFileSync(file, 'utf8').split('\n')
  const decl = /^(?:export )?(?:async )?(?:const|function|class|type|interface) ([A-Za-z0-9_]+)\b/
  const by = {}
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(decl); if (!m) continue
    let wing = null
    for (let j = i - 1; j >= Math.max(0, i - mintOf(4)); j--) { const w = lines[j].match(/@wing ([a-z]+)/); if (w) { wing = w[1]; break }; if (/^export /.test(lines[j]) && j < i - 1) break }
    if (wing) (by[wing] ??= []).push(m[1])
  }
  return by
}

// restore the WHOLE unit dir to HEAD (undeletes pre-existing modules, reverts index.ts) and drop only untracked files
// a cool created — so a trial can never lose a tracked, already-cooled module (that was the bug that deleted proof/quantum)
const reset = () => { quiet(`git checkout -- ${dir}`); quiet(`git clean -fq ${dir}`) }
// cool a set of wings in order from the clean base; returns true iff the combined result type-checks
const trial = (names, order) => { reset(); for (const w of order) if (!quiet(`node scripts/cool.mjs ${file} ${w} ${names[w].join(' ')}`)) return false; return gate() }

const names = wingsOf()
// only wings still IN the monolith without their own module yet; a wing already cooled (proof.ts, quantum.ts, …) is left alone
const all = Object.keys(names).filter((w) => !fs.existsSync(`${dir}${w}.ts`))
if (!gate()) { console.error('tree is not green before splitting — fix first'); process.exit(1) }

const accepted = []
let changed = true
while (changed) {
  changed = false
  for (const wing of all) {
    if (accepted.includes(wing)) continue
    if (trial(names, [...accepted, wing])) { accepted.push(wing); changed = true; console.log(`accepted ${wing} (${names[wing].length}) — combined set still green ✓`); break }
    else console.log(`rejected ${wing} — the whole set went red; left in the monolith`)
  }
}
// leave exactly the accepted set cooled on disk, and prove it green one last time
reset()
for (const w of accepted) quiet(`node scripts/cool.mjs ${file} ${w} ${names[w].join(' ')}`)
const green = gate()
console.log(`\nsplit to fixpoint: ${accepted.length}/${all.length} wings cooled into modules — final build ${green ? 'GREEN ✓' : 'RED ✗ (investigate)'}`)
console.log(`cooled: ${accepted.join(', ') || '(none held the gate)'}`)
process.exit(green ? 0 : 1)
