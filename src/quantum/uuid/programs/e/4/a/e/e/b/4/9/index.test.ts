// The kernel theorems claimed by rule (examples.ts, kernelBindingFor): each claim is a door call whose answer computes every premise and the
// conclusion true at the values it names, each claims a theorem nothing else claims, and every theorem left unclaimed carries its reason.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EXAMPLES } from '../../../../../../../../9/d/4/f/e/4/4/2/index.ts'
import { call } from '../../../../../../../../3/8/5/9/0/2/0/f/index.ts'
import { kernelStatement, kernelBindingFor, evaluateKernel } from '../../../../../../../../2/4/6/5/f/6/3/f/index.ts'
import { THEOREMS } from '../../../../../../../../3/f/0/e/7/a/6/f/index.ts'

const made = EXAMPLES.filter((e) => e.id.startsWith('kernel-evaluated-'))

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every kernel claim made by rule is recomputed by the textbook door, premises and conclusion true. */
test('every kernel claim made by rule is recomputed by the textbook door, premises and conclusion true', () => {
  assert.ok(made.length > 0)
  for (const e of made) {
    const s = call(e.tool, e.arguments).result!.structuredContent as { evaluable: boolean; premises: boolean; holds: boolean; needs: string[] }
    assert.deepEqual([s.evaluable, s.premises, s.holds, s.needs.length], [true, true, true, 0], e.id)
    assert.deepEqual(kernelBindingFor(e.theorem!), (e.arguments.evaluate as { values: Record<string, string> }).values, e.id)
  }
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a kernel claim names a theorem no other example names, once, and a statement not read carries its reason. */
test('a kernel claim names a theorem no other example names, once, and a statement not read carries its reason', () => {
  const others = new Set(EXAMPLES.filter((e) => !e.id.startsWith('kernel-evaluated-')).flatMap((e) => (e.theorem ? [e.theorem] : [])))
  assert.equal(made.every((e) => !others.has(e.theorem!)), true)
  assert.equal(new Set(made.map((e) => e.theorem)).size, made.length)
  for (const t of THEOREMS) if (!kernelStatement(t.statement)) { const k = evaluateKernel(t.key) as { evaluable: boolean; reason?: string }; assert.ok(!k.evaluable && typeof k.reason === 'string' && k.reason.length > 0, t.key) }
})
