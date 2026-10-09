/**
 * EVERY QUANTUM THEOREM IS LEAN AND USED — all of them, consolidated, nothing excluded.
 *
 * QPU is a quantum computer, and all of it is lean. There is no non-quantum subset to carve out: the quantum algorithms
 * (Shor), the circuit model (Circuit), and the lattice foundations they stand on (mintOf, n, seed, coins …) are one
 * consolidated quantum computer. So every theorem of index.lean is a quantum theorem, and each must be:
 *   LEAN — a theorem of index.lean, proved by Lake (`npm run lean` builds and checks it), and
 *   USED — referenced by another theorem's proof or named in the TS surface, so no theorem is proved then abandoned.
 * The set is discovered from the embedded Lean source (leanLinksOf), never a hand list, and no universal foundation is
 * excluded. Read from the filesystem, token-free. Discovered by the scripts/*.test.mjs glob, run by the one gate.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'

const ROOT = join(dirname(new URL(import.meta.url).pathname), '..')
const e = await import(join(ROOT, 'dist/quantum/processing/unit/lean-eval.js'))
const { leanSource } = await import(join(ROOT, 'dist/quantum/processing/unit/lean.js'))

const L = e.leanLinksOf(leanSource)
// every theorem — foundations included; the quantum computer is consolidated, so all of it is quantum
const theorems = L.declarations.filter((d) => d.kind === 'theorem')
const inSource = new Set(e.leanTheoremBlocksOf(leanSource).map(([n]) => n))
const referencedByTheorem = new Set(theorems.flatMap((t) => t.uses ?? []))
const tsText = (() => {
  const files = []
  const walk = (d) => { for (const x of readdirSync(d, { withFileTypes: true })) { const p = join(d, x.name); if (x.isDirectory()) walk(p); else if (/\.tsx?$/.test(x.name) && !/\.d\.ts$/.test(x.name)) files.push(p) } }
  walk(join(ROOT, 'src'))
  return files.map((f) => readFileSync(f, 'utf8')).join('\n')
})()
const used = (name) => referencedByTheorem.has(name) || new RegExp(`\\b${name}\\b`).test(tsText)

test('discover every quantum theorem from the Lean source — consolidated, nothing excluded', () => {
  const families = new Set(theorems.map((t) => t.family))
  assert.ok(theorems.length >= 24, `discovered ${theorems.length} theorems across ${families.size} families — all of the quantum computer`)
})

test('every quantum theorem is LEAN — a theorem of index.lean', () => {
  const notLean = theorems.filter((t) => !inSource.has(t.name)).map((t) => t.name)
  assert.deepEqual(notLean, [], `theorems absent from the Lean source: ${notLean.join(', ')}`)
})

test('every quantum theorem is USED — referenced by a proof or the TS surface, foundations included', () => {
  const orphans = theorems.filter((t) => !used(t.name)).map((t) => t.name)
  assert.deepEqual(orphans, [], `theorems proved but never used: ${orphans.join(', ')}`)
})
