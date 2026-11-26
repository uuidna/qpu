// The kernel theorems claimed by rule (examples.ts, kernelBinding): each claim is a door call whose answer computes every premise and the
// conclusion true at the values it names, each claims a theorem nothing else claims, and every theorem left unclaimed carries its reason.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EXAMPLES } from './examples.ts'
import { call } from './mcp.ts'
import { kernelStatement, kernelBinding } from './expressions.ts'
import { THEOREMS } from './theorems-index.ts'

const made = EXAMPLES.filter((e) => e.id.startsWith('kernel-evaluated-'))

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every kernel claim made by rule is recomputed by the textbook door, premises and conclusion true. */
test('every kernel claim made by rule is recomputed by the textbook door, premises and conclusion true', () => {
  assert.ok(made.length > 0)
  for (const e of made) {
    const s = call(e.tool, e.arguments).result!.structuredContent as { evaluable: boolean; premises: boolean; holds: boolean; needs: string[] }
    assert.deepEqual([s.evaluable, s.premises, s.holds, s.needs.length], [true, true, true, 0], e.id)
    assert.deepEqual(kernelBinding(e.theorem!), (e.arguments.evaluate as { values: Record<string, string> }).values, e.id)
  }
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a kernel claim names a theorem no other example names, once, and a statement not read carries its reason. */
test('a kernel claim names a theorem no other example names, once, and a statement not read carries its reason', () => {
  const others = new Set(EXAMPLES.filter((e) => !e.id.startsWith('kernel-evaluated-')).flatMap((e) => (e.theorem ? [e.theorem] : [])))
  assert.equal(made.every((e) => !others.has(e.theorem!)), true)
  assert.equal(new Set(made.map((e) => e.theorem)).size, made.length)
  for (const t of THEOREMS) { const k = kernelStatement(t.key) as { read: boolean; reason?: string }; assert.ok(k.read || (typeof k.reason === 'string' && k.reason.length > 0), t.key) }
})
