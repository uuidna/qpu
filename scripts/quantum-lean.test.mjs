/**
 * EVERY QUANTUM-RELATED THEOREM IS LEAN AND USED — discovered, not listed.
 *
 * QPU is a quantum computer, and all of it is lean. The quantum computer is Qpu.Shor (the algorithms) and Qpu.Circuit
 * (the model). A theorem is quantum-related when it belongs to one of those families, or when it reasons over a def the
 * quantum families own (periodOf, gcdOf, half, powMod — the quantum arithmetic) — discovered from the Lean reference
 * graph (leanLinksOf), never a hand list. Every discovered theorem must be:
 *   LEAN — a theorem of index.lean, proved by Lake (`npm run lean` builds and checks it), and
 *   USED — referenced by another Lean theorem or named in the TS surface, so no quantum theorem is proved then abandoned.
 * Read from the filesystem + the embedded Lean source, token-free. Discovered by the scripts/*.test.mjs glob, run by the gate.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'

const ROOT = join(dirname(new URL(import.meta.url).pathname), '..')
const e = await import(join(ROOT, 'dist/quantum/processing/unit/lean-eval.js'))
const { leanSource } = await import(join(ROOT, 'dist/quantum/processing/unit/lean.js'))

const L = e.leanLinksOf(leanSource)
const thms = L.declarations.filter((d) => d.kind === 'theorem')
const QUANTUM_FAMILIES = new Set(['Shor', 'Circuit'])
// the defs the quantum families own — the quantum arithmetic (periodOf, gcdOf, half, powMod …)
const quantumDefs = new Set(L.declarations.filter((d) => d.kind === 'def' && QUANTUM_FAMILIES.has(d.family)).map((d) => d.name))
// discovered: a theorem of a quantum family, or one that reasons over a quantum def — from the graph, not a list
const quantum = thms.filter((t) => QUANTUM_FAMILIES.has(t.family) || (t.uses ?? []).some((u) => quantumDefs.has(u)))
const quantumNames = new Set(quantum.map((t) => t.name))

// LEAN: the theorem exists as a theorem of the embedded Lean source (Lake proves it in `npm run lean`)
const inSource = new Set(e.leanTheoremBlocksOf(leanSource).map(([n]) => n))
// USED: referenced by another Lean theorem's proof, or named anywhere in the TS surface
const referencedByTheorem = new Set(thms.flatMap((t) => t.uses ?? []))
const tsText = (() => {
  const files = []
  const walk = (d) => { for (const x of readdirSync(d, { withFileTypes: true })) { const p = join(d, x.name); if (x.isDirectory()) walk(p); else if (/\.tsx?$/.test(x.name) && !/\.d\.ts$/.test(x.name)) files.push(p) } }
  walk(join(ROOT, 'src'))
  return files.map((f) => readFileSync(f, 'utf8')).join('\n')
})()
const usedBy = new Map(quantum.map((t) => [t.name, referencedByTheorem.has(t.name) ? 'lean proof' : new RegExp(`\\b${t.name}\\b`).test(tsText) ? 'TS surface' : null]))

test('discover all quantum-related theorems from the graph — not a hand list', () => {
  assert.ok(quantum.length >= 24, `discovered ${quantum.length} quantum-related theorems across ${new Set(quantum.map((t) => t.family)).size} families`)
})

test('every quantum-related theorem is LEAN — a theorem of index.lean', () => {
  const notLean = [...quantumNames].filter((n) => !inSource.has(n))
  assert.deepEqual(notLean, [], `quantum theorems absent from the Lean source: ${notLean.join(', ')}`)
})

test('every quantum-related theorem is USED — referenced by a proof or the TS surface', () => {
  const orphans = quantum.filter((t) => usedBy.get(t.name) === null).map((t) => t.name)
  assert.deepEqual(orphans, [], `quantum theorems proved but never used: ${orphans.join(', ')}`)
})
