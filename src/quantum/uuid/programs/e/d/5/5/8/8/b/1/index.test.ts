// Prose is written in Lean and verifiable where the tree is served: the MCP tool `prose` answers which Lean
// definition states a sentence, and the site carries the same sentences.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { call } from '../../../../../../../../3/8/5/9/0/2/0/f/index.ts'
import { PROSE } from '../../../../../../../../5/9/e/4/9/1/a/4/index.ts'
import { THEOREMS } from '../../../../../../../../3/f/0/e/7/a/6/f/index.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a sentence is verified by its name or by its text, and an unsaid sentence is refused. */
test('a sentence is verified by its name or by its text, and an unsaid sentence is refused', () => {
  const name = 'quantumPayloadDeploy_says1'
  const byName = call('prose', { verify: name }).result!.structuredContent
  assert.equal(byName.found, true)
  assert.equal(byName.module, 'Qpu.General.Prose.QuantumPayloadDeploy')
  assert.equal(byName.text, PROSE[name])
  assert.equal(existsSync(byName.file), true)
  assert.equal(readFileSync(byName.file, 'utf8').includes(`def ${name} : String := `), true)
  const byText = call('prose', { verify: PROSE[name] }).result!.structuredContent
  assert.equal(byText.name, name)
  const unsaid = call('prose', { verify: `${PROSE[name]} — and something Lean never wrote` }).result!.structuredContent
  assert.equal(unsaid.found, false)
  assert.equal(unsaid.grounded, false)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a sentence is grounded only when it cites a theorem the kernel accepted. */
test('a sentence is grounded only when it cites a theorem the kernel accepted', () => {
  const kernel = new Set(THEOREMS.map((t) => t.key))
  const names = Object.keys(PROSE)
  const answers = names.map((name) => call('prose', { verify: name }).result!.structuredContent)
  assert.equal(answers.every((a) => a.found && a.sentences === names.length), true)
  assert.equal(answers.every((a) => a.grounded === (a.theorems.length > 0) && a.theorems.every((t: { theorem: string }) => kernel.has(t.theorem))), true)
  assert.equal(answers.every((a) => a.mathlib === a.theorems.some((t: { module: string }) => t.module === 'Qpu.General.Meaning')), true)
})
