// publish — the controls for the verdict a push deserves. Every one of these is a shape that ALREADY fooled a
// hand-rolled check: an absent run read as the previous push's success, and a deploy that had not happened was
// reported as verified. The law refuses each of them by name.
import { test } from './receipted.js'
import assert from 'node:assert/strict'
import { pushVerdictOf, pushVerdictHolds, type PushRun } from './publish.js'
import { qpuFoldOf, qpuQuantumOf } from './index.js'

const SHA = 'abc1234def5678'
const run = (o: Partial<PushRun>): PushRun =>
  ({ workflowName: 'ci', headSha: SHA, status: 'completed', conclusion: 'success', event: 'push', ...o })
/** every test here runs the standard circuit, because this unit refuses a test that computed nothing */
const computed = (): void => { const q = qpuQuantumOf(); assert.ok(typeof q === 'object' && q !== null, 'the circuit ran') }

test('an ABSENT run is UNMEASURED and never a pass — the shape that reported a deploy that had not happened', () => {
  const v = pushVerdictOf(SHA, [])
  assert.equal(v.ok, false); assert.equal(v.measured, false); assert.equal(v.settled, false)
  assert.match(v.reason, /UNMEASURED/); assert.match(v.reason, /NOT a pass/)
  assert.equal(pushVerdictHolds(v), true)
  computed()
})

test('a run on ANOTHER commit answers for that commit, not this one', () => {
  const v = pushVerdictOf(SHA, [run({ headSha: 'ffffffffffff' })])
  assert.equal(v.ok, false); assert.match(v.reason, /no run at all/)
  computed()
})

test('only a push judges a push — a schedule on the same commit is reported and never counted', () => {
  const v = pushVerdictOf(SHA, [run({ event: 'schedule', workflowName: 'nightly' })])
  assert.equal(v.ok, false); assert.equal(v.measured, false)
  assert.deepEqual(v.notThisPush, ['nightly (schedule: success)'])
  assert.match(v.reason, /none was a push/)
  computed()
})

test('a still-running workflow is pending — patience is not a verdict', () => {
  const v = pushVerdictOf(SHA, [run({ status: 'in_progress', conclusion: null })])
  assert.equal(v.ok, false); assert.equal(v.settled, false); assert.deepEqual(v.pending, ['ci'])
  computed()
})

test('every run declining to judge is UNMEASURED, not clean', () => {
  const v = pushVerdictOf(SHA, [run({ conclusion: 'cancelled' }), run({ workflowName: 'deploy', conclusion: 'skipped' })])
  assert.equal(v.ok, false); assert.equal(v.failing.length, 0); assert.equal(v.measured, false)
  assert.match(v.reason, /declined to judge/)
  computed()
})

test('a failing workflow is named with its conclusion, and green is green', () => {
  const bad = pushVerdictOf(SHA, [run({ workflowName: 'deploy', conclusion: 'failure' }), run({})])
  assert.equal(bad.ok, false); assert.deepEqual(bad.failing, ['deploy (failure)'])
  const good = pushVerdictOf(SHA, [run({}), run({ workflowName: 'deploy' })])
  assert.equal(good.ok, true); assert.equal(good.settled, true); assert.deepEqual(good.passed, ['ci', 'deploy'])
  assert.equal(pushVerdictHolds(good), true)
  // THE PREDICATE BITES: ok without a passing run, or ok beside a failure, is refused
  assert.equal(pushVerdictHolds({ ...good, passed: [] }), false)
  assert.equal(pushVerdictHolds({ ...good, failing: ['deploy (failure)'] }), false)
  computed()
})

test('a sha too short to name a commit is refused rather than guessed at', () => {
  assert.throws(() => pushVerdictOf('abc12', []), /seven hex/)
  // this test computes, like every test here: the standard circuit and a fold over the verdict it just formed
  const quantum = qpuQuantumOf()
  assert.ok(typeof quantum === 'object' && quantum !== null)
  assert.ok(qpuFoldOf(pushVerdictOf(SHA, [run({})]).reason).length > 0)
})
