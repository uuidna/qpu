// Every textbook axiom has a QPU theorem linked to it: each example of the textbook names the kernel-accepted theorem it rests on, each
// textbook theorem names only examples that exist, and the same answer is served over MCP (textbook { axioms }) and checked by the audit.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { handle } from './mcp.js'
import { EXAMPLES } from './examples.js'
import { TEXTBOOK_THEOREMS } from './textbook-theorems.js'
import { THEOREMS } from './theorems-index.js'
import { axiomsOf } from './audit.js'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

test('every textbook axiom has a kernel-accepted QPU theorem linked to it', () => {
  const a = axiomsOf(EXAMPLES, TEXTBOOK_THEOREMS, new Set(THEOREMS.map((t) => t.key)))
  assert.deepEqual(a.axioms, [], `examples with no theorem: ${a.axioms.join(', ')}`)
  assert.deepEqual(a.broken, [], 'every linked theorem is accepted by the kernel')
  assert.deepEqual(a.dangling, [], 'every example a theorem names exists')
  assert.equal(a.linked, EXAMPLES.length)
})

test('every textbook theorem is in the kernel, and names an example or is cited by the tool that applies it', () => {
  const kernel = new Set(THEOREMS.map((t) => t.key))
  const missing = TEXTBOOK_THEOREMS.filter((t) => !kernel.has(t.key)).map((t) => t.key)
  assert.deepEqual(missing, [], `textbook theorems the kernel has not accepted: ${missing.join(', ')}`)
  // a theorem a tool applies to every item it reads (a patent, a certificate) is cited by that tool's source rather than by one example
  const dir = join(process.cwd(), 'src', 'quantum', 'toolboxes')
  const sources = readdirSync(dir).filter((f) => f.endsWith('.ts')).map((f) => readFileSync(join(dir, f), 'utf8')).join('\n')
  const unlinked = TEXTBOOK_THEOREMS.filter((t) => t.examples.length === 0 && !sources.includes(`'${t.key}'`)).map((t) => t.key)
  assert.deepEqual(unlinked, [], `textbook theorems neither linked to an example nor cited by a tool: ${unlinked.join(', ')}`)
})

test('the same answer is served over MCP: textbook { axioms }', () => {
  const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'textbook', arguments: { axioms: true } } }) as { result?: { structuredContent: { complete: boolean; examples: number; linked: number } } }
  assert.equal(r.result?.structuredContent.complete, true)
  assert.equal(r.result?.structuredContent.linked, r.result?.structuredContent.examples)
})

test('every theorem sentence is a Lean doc comment that opens and closes once, whatever the prose holds', async () => {
  const { TEXTBOOK_LEAN, leanDocOf } = await import('./textbook-theorems.js')
  const docs = TEXTBOOK_LEAN().split('\n').filter((l) => l.startsWith('/-- '))
  assert.ok(docs.length > 0)
  for (const d of docs) { const body = d.slice(4, d.lastIndexOf(' -/')); assert.ok(!body.includes('-/') && !body.includes('/-'), d.slice(0, 80)) }
  assert.equal(leanDocOf('a -/ b /- c'), 'a - / b / - c')
})
