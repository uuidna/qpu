// The disclosure the textbook door writes (scripts.disclosure) counts what the indexes count: every declared theorem once with the line its
// module declares it on, the kernel's numbers in its scope, every open lead once, and it says it is unpublished.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { call } from '../../../../../../../../3/8/5/9/0/2/0/f/index.ts'
import { KERNEL_THEOREMS, THEOREMS } from '../../../../../../../../3/f/0/e/7/a/6/f/index.ts'
import { LEAD_ROWS } from '../../../../../../../../f/3/5/3/8/2/1/2/index.ts'
import { leanPath, proofLines } from '../../../../../../../../e/1/c/6/d/e/b/3/index.ts'

const lean = Object.fromEntries([...new Set(THEOREMS.map((t) => leanPath(t.module)))].map((p) => [p, readFileSync(p, 'utf8')]))
type Block = { kind: string; head?: string[]; rows?: string[][] }
const answer = call('textbook', { scripts: { disclosure: { lean } } }).result!.structuredContent as { blocks: Block[]; files: { path: string }[]; holds: boolean }
const tables = answer.blocks.filter((b) => b.kind === 'table')

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the disclosure lists every declared theorem once, each with the line its module declares it on. */
test('the disclosure lists every declared theorem once, each with the line its module declares it on', () => {
  const rows = tables.filter((b) => b.head![0] === 'theorem').flatMap((b) => b.rows!)
  assert.equal(rows.length, THEOREMS.length)
  assert.equal(new Set(rows.map((r) => r[0])).size, THEOREMS.length)
  const lines = proofLines(THEOREMS, lean)
  for (const r of rows) { const key = r[0]!.slice(1, -1); assert.ok(r[4]!.endsWith(`#L${lines.get(key)}`), key); assert.ok(lean[r[4]!.slice(r[4]!.indexOf('/lean/') + 1, r[4]!.lastIndexOf('#'))]!.split('\n')[lines.get(key)! - 1]!.includes(key.slice(key.lastIndexOf('.') + 1)), key) }
  assert.deepEqual(answer.files.map((f) => f.path), ['.disclosure/disclosure.md', '.disclosure/disclosure.html'])
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the disclosure's scope is the kernel's count and its open section every open lead, unpublished. */
test("the disclosure's scope is the kernel's count and its open section every open lead, unpublished", () => {
  const scope = Object.fromEntries(tables.find((b) => b.head![0] === 'scope')!.rows!.map(([k, v]) => [k, v]))
  assert.deepEqual([scope['kernel theorems'], scope['declared theorems']], [String(KERNEL_THEOREMS), String(THEOREMS.length)])
  assert.equal(tables.find((b) => b.head![0] === 'lead')!.rows!.length, LEAD_ROWS.filter((l) => l.status !== 'served' && l.status !== 'out_of_scope').length)
  assert.equal(tables[0]!.rows!.find((r) => r[0] === 'publication')![1], 'unpublished')
})
