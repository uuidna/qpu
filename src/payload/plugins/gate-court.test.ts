import { test } from 'node:test'
import assert from 'node:assert/strict'
import '../../mcp/families.js'
import { gateCourtTrialOf } from './gate-court.js'

// The trial engine had no unit test (only the circular registry sweep in scripts/court.test.mjs). These pin what the
// court actually is: a non-adversarial router that gives every matter a forum and a remedy and NEVER refuses, with the
// whole registry as the jury, faithful on re-trial — and NEVER legal counsel (a measure/lead, advice only when reviewed).
const trial = (confidence: number, holds = true) =>
  gateCourtTrialOf({ case: 'audit', gate: { call: 'c', name: 'law.audit', params: [confidence, 51], hex: null, value: confidence, holds, rawNext: 'absent', definition: 'the remedy' }, confidence })

test('gate-court: every matter is routed — a forum and a remedy — and nothing is refused (allow or lead)', () => {
  const high = trial(100)
  const low = trial(20)
  assert.equal(high.allow, true, 'a holding, confident case clears the bar and is allowed')
  assert.equal(low.allow, false, 'a case below the balance bar does not clear it')
  for (const t of [high, low]) {
    assert.ok(typeof t.forum === 'string' && t.forum.length > 0, 'every case names a forum')
    assert.ok(t.remedy !== undefined, 'every case carries a remedy — none is refused; a floor failure is a LEAD')
  }
})

test('gate-court: the jury is the whole registry, and the trial is faithful on re-trial', () => {
  const a = trial(100)
  const b = trial(100)
  assert.equal(a.experts.all, true, 'the court involves all families (the jury is the whole registry)')
  assert.ok(a.experts.count > 1000, 'every registered family is on the panel')
  assert.equal(a.allow, b.allow, 'same inputs, same verdict')
  assert.equal(JSON.stringify(a.trial), JSON.stringify(b.trial), 'law.fidelity: re-trial is faithful')
})

test('gate-court: a verdict is a measure/lead, never legal counsel asserted autonomously', () => {
  const t = trial(100)
  // the court carries the review gate but the trial itself holds reviewed at 0 — it never reaches "advice" on its own
  assert.ok(t.reviewed, 'the trial records the law.reviewed gate')
  assert.ok('remedy' in t && 'standing' in t && 'fidelity' in t, 'the output is a measure (remedy/standing/fidelity), not counsel')
  assert.equal(typeof t.allow, 'boolean', 'allow is a measure of the gate clearing a bar, not a legal ruling')
})
