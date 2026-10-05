/**
 * EVERY FAMILY HAS ITS STRICT STANDARDS AND LAWS — AND IS AGNOSTIC, SO IT IS REUSABLE IN ALL DIMENSIONS. Read from the
 * family sources, held per family:
 *   STANDARD — it declares a PROOF (the sentence its receipts carry) and names its formulas as exact integers.
 *   LAW — it guards its domain: a `nat(...)` / `holds` condition, so a value holds only where it is lawful.
 *   JURISDICTION — it crosses into a domain (crossFormulaOf, or builds a CrossFormula with the unit primitives).
 *   NAME — one lowercase word (atoms; combinations are paths, not families).
 *   AGNOSTIC — no `node:*` import: pure formulas over naturals, so the family runs in every dimension (browser,
 *     standalone, worker, docker, k8s) and is maximally reusable.
 * A family that breaks any of these is reported. Token-free (file reads), zero temp. Run by the one gate.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'

const ROOT = join(dirname(new URL(import.meta.url).pathname), '..')

test('every family has its strict standards and laws, and is agnostic (reusable in all dimensions)', async (t) => {
  await import('../dist/mcp/families.js')
  const { qpuHexRegisteredSizeOf } = await import('../dist/quantum/processing/unit/index.js')
  const breaches = []
  for (const e of readdirSync(join(ROOT, 'src/families'), { withFileTypes: true })) {
    if (!e.isDirectory()) continue
    const fam = e.name
    const file = join(ROOT, 'src/families', fam, 'index.ts')
    if (!existsSync(file) || qpuHexRegisteredSizeOf(fam) === 0) continue
    const src = readFileSync(file, 'utf8')
    const need = []
    if (!/^[a-z]+$/.test(fam)) need.push('a one-word name')
    if (!/\bPROOF\b|proof:/.test(src)) need.push('a declared PROOF (its standard)')
    if (!/\bnat\(|holds\b/.test(src)) need.push('a domain law (nat/holds guard)')
    if (!/CrossFormula|crossFormulaOf|qpuContentUuidOf/.test(src)) need.push('a crossing into its jurisdiction')
    if (/\bfrom\s*'node:/.test(src) || /\brequire\(\s*'node:/.test(src)) need.push('agnosticism (it imports node:*)')
    if (need.length) breaches.push(`${fam} lacks: ${need.join('; ')}`)
  }
  assert.deepEqual(breaches, [], `families not meeting their strict standards and laws:\n  ${breaches.join('\n  ')}`)
  t.diagnostic(`every registered family holds its standards (PROOF), laws (nat/holds + crossing), one-word name, and is agnostic (node-free, reusable in all dimensions)`)
})
