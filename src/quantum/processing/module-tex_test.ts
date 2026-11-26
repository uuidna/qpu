// Every Lean module has its LaTeX document beside its source, written by the textbook door (scripts.moduleTex, next step tex:gen): one
// paragraph for each of its theorems, each statement the TeX Lean wrote, and the committed copy is the one the door answers.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { call } from './mcp.ts'
import { THEOREMS } from './theorems-index.ts'
import { leanPath } from './proof-lines.ts'

const modules = Map.groupBy(THEOREMS, (t) => t.module)
const lean = Object.fromEntries([...modules.keys()].map((m) => [leanPath(m), readFileSync(leanPath(m), 'utf8')]))
const answer = call('textbook', { scripts: { moduleTex: { lean } } }).result!.structuredContent as { files: { path: string; text: string }[]; holds: boolean }

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every module's document is beside its source, as the door writes it, one paragraph a theorem. */
test("every module's document is beside its source, as the door writes it, one paragraph a theorem", () => {
  assert.equal(answer.holds, true)
  assert.equal(answer.files.length, modules.size)
  for (const f of answer.files) {
    assert.ok(existsSync(f.path), f.path)
    assert.equal(readFileSync(f.path, 'utf8'), f.text, f.path)
    const module = [...modules.keys()].find((m) => leanPath(m).replace(/\.lean$/, '.tex') === f.path)!
    assert.equal(f.text.match(/^\\paragraph\{/gm)?.length, modules.get(module)!.length, f.path)
    for (const t of modules.get(module)!) assert.ok(f.text.includes(`\\[ ${t.tex} \\]`), t.key)
  }
})
