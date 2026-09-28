/**
 * THE PACE SERIES, PROVED ABLE TO CONTRADICT ITSELF.
 *
 * Work per test fell 13.4% across four releases and the same tests got 16.3% MORE expensive over the same
 * span. Both are true and only the second is about the code: the average fell because sixty-one cheaper
 * tests were added, which is dilution wearing efficiency's clothes. A pace report that could only show the
 * average would have reported an improvement that did not happen, so the case where the two disagree is
 * driven here by construction.
 *
 *   node --test scripts/pace.test.mjs
 */
import assert from 'node:assert/strict'
import test from 'node:test'

import { paceOf, releaseOf, sameTestsOf, verdictOf, workOf } from './pace.mjs'

const row = (name, computations, calls = 0) => ({ name, computations, mint: { calls } })
const receipt = (tests, rows) => ({ tests, rows })

test('work is amplitudes and mint doublings, and a row missing either still counts', () => {
  assert.equal(workOf(row('a', 10, 5)), 15)
  assert.equal(workOf({ name: 'a' }), 0, 'a row that computed nothing is zero work, not an error')
  assert.equal(workOf({ name: 'a', computations: 7 }), 7, 'and a row with no mint chain is its computations')
})

test('the foreign rows are excluded from EVERY release, not from the ones that label them', () => {
  /* At 0.1.4 the rows that ask a host moved out of the receipt; earlier receipts still contain them and have
   * no field saying so. Excluding them only where they are labelled compares 168 rows against 160 and calls
   * the difference progress. */
  const old = receipt(3, [row('quiet', 100), row('cern faces via mcp', 900)])
  const now = receipt(2, [row('quiet', 100)])
  const foreign = ['cern faces via mcp']
  assert.equal(releaseOf('v1', old, foreign).rows, 1)
  assert.equal(releaseOf('v1', old, foreign).work, 100, 'the host row is gone from the old release too')
  assert.equal(releaseOf('v1', old, foreign).excluded, 1)
  assert.equal(releaseOf('v2', now, foreign).work, 100)
  // AND WITHOUT THE EXCLUSION the same two releases appear to differ by a factor of ten.
  assert.equal(releaseOf('v1', old, []).work, 1000)
})

test('the average can fall while the same tests get dearer, and the report must show both', () => {
  const before = receipt(2, [row('kept', 1000), row('also kept', 1000)])
  // the two original tests each cost half as much again; four cheap ones join them
  const after = receipt(6, [row('kept', 1500), row('also kept', 1500), row('new a', 10), row('new b', 10), row('new c', 10), row('new d', 10)])

  const series = paceOf([releaseOf('v1', before, []), releaseOf('v2', after, [])])
  assert.equal(series[0].workPerTest, 1000)
  assert.equal(series[1].workPerTest, 507, 'the average collapses, purely from the cheap additions')
  assert.ok(series[1].delta < 0, 'and reads as an improvement')

  /* THE MEASURE THAT CANNOT BE DILUTED contradicts it, which is the whole reason it exists. */
  const same = sameTestsOf(before, after)
  assert.equal(same.shared, 2)
  assert.equal(same.only, 4)
  assert.equal(same.was, 2000)
  assert.equal(same.now, 3000)
  assert.equal(same.delta, 500, 'fifty per cent dearer, in thousandths')
  assert.ok(same.delta > 0 && series[1].delta < 0, 'the two measures disagree, and both are reported')
})

test('a renamed test leaves the intersection rather than being guessed at', () => {
  const before = receipt(1, [row('old name', 100)])
  const after = receipt(1, [row('new name', 100)])
  const same = sameTestsOf(before, after)
  assert.equal(same.shared, 0, 'nothing is shared by the only handle anyone has')
  assert.equal(same.delta, undefined, 'and no change is claimed from an empty comparison')
  assert.equal(same.only, 1)

  // the honest identity case still works
  assert.equal(sameTestsOf(before, before).delta, 0)
})

test('one release is a number, two are a comparison, and the verdict says which it has', () => {
  const one = paceOf([releaseOf('v1', receipt(1, [row('a', 10)]), [])])
  assert.equal(verdictOf(one).compared, 0, 'nothing to compare against')
  assert.equal(verdictOf(one).holds, true, 'which is sound, not broken')

  const two = paceOf([releaseOf('v1', receipt(1, [row('a', 100)]), []), releaseOf('v2', receipt(1, [row('a', 50)]), [])])
  const verdict = verdictOf(two)
  assert.equal(verdict.compared, 1)
  assert.equal(verdict.fell, 1)
  assert.equal(verdict.rose, 0)
  assert.equal(verdict.first, 100)
  assert.equal(verdict.last, 50)
  assert.equal(verdict.holds, true)

  // a release whose every row was excluded has nothing to say, and says nothing rather than zero
  const empty = paceOf([releaseOf('v1', receipt(1, [row('cern', 100)]), ['cern'])])
  assert.equal(empty[0].rows, 0)
  assert.equal(empty[0].workPerTest, 0)
  assert.equal(verdictOf(empty).holds, true)
})
