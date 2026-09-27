/**
 * THE OUTAGE GUARD, PROVED ABLE TO FAIL.
 *
 * outage.mjs runs the suite five ways and passes when one proof fold comes back from all of them. A comparison
 * that cannot come out unequal proves nothing, and this one has three ways to be vacuously true: every run could
 * be excluded, a single run could compare with itself, or a failure could be counted as agreement. leads.mjs went
 * a whole commit untested and that is the shape it was written to hunt, so its sibling does not.
 *
 * The verdict is pure and separated from the running for exactly this reason — no suite is executed here.
 *
 *   node --test scripts/outage.test.mjs
 */
import assert from 'node:assert/strict'
import test from 'node:test'

import { SHAPES, verdictOf } from './outage.mjs'

test('one fold across several completed conditions holds, and two folds do not', () => {
  const agree = verdictOf([
    { name: 'throw', ok: true, receipt: 'aaaa' },
    { name: 'status', ok: true, receipt: 'aaaa' },
    { name: 'reached', ok: true, receipt: 'aaaa' },
  ])
  assert.equal(agree.holds, true)
  assert.deepEqual(agree.folds, ['aaaa'])

  // THE CONDITION ITSELF. This is the state the split was built to remove: a run that reached CERN folding
  // differently from one that did not, which `npm run proof` then reports as a receipt that moved.
  const moved = verdictOf([
    { name: 'throw', ok: true, receipt: 'aaaa' },
    { name: 'reached', ok: true, receipt: 'bbbb' },
  ])
  assert.equal(moved.holds, false)
  assert.equal(moved.folds.length, 2)
})

test('a condition that did not complete is a failure, not silence', () => {
  // A cancelled run writes no receipt, so "the folds that came back all agree" is true of it and means nothing.
  const cancelled = verdictOf([
    { name: 'hang', ok: false, why: 'the suite did not complete' },
    { name: 'throw', ok: true, receipt: 'aaaa' },
    { name: 'reached', ok: true, receipt: 'aaaa' },
  ])
  assert.equal(cancelled.holds, false)
  assert.deepEqual(cancelled.failed, ['hang'])
})

test('one condition is not a comparison, and none is not either', () => {
  assert.equal(verdictOf([{ name: 'throw', ok: true, receipt: 'aaaa' }]).holds, false, 'a run agreeing with itself proves nothing')
  assert.equal(verdictOf([]).holds, false, 'and nothing asked is not nothing wrong')
})

test('all four shapes a third party fails in are covered, not just the refusal', () => {
  // The original guard tested a refused connection alone. 503, a captive portal's HTML and a silent socket were
  // each a live defect the first time they were run, so dropping one from this list is dropping a known bug.
  assert.deepEqual([...SHAPES].sort(), ['body', 'hang', 'status', 'throw'])
})
