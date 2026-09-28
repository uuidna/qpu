/**
 * THE RATCHET, PROVED UNABLE TO ACCEPT ITS OWN RISE.
 *
 * walls.mjs writes its receipt whatever it found, so the run that reports "rose from 23 to 24" also records
 * 24 — and every run after it says "unchanged". It happened twice in one session and both times the raised
 * floor went in as though it had always been there. A ratchet whose floor is written by the thing it is
 * ratcheting only ever fails once.
 *
 * The consolidating gate keeps its own floor and exits before writing, so the same rise fails again and
 * again until somebody lowers the number rather than the bar. That is the property worth a test.
 *
 *   node --test scripts/debts.test.mjs
 */
import assert from 'node:assert/strict'
import test from 'node:test'

import { DEBTS, verdictOf } from './debts.mjs'

test('a rise in any single debt fails, whatever the total did', () => {
  const rows = [
    { name: 'walls', count: 24 },
    { name: 'refusals', count: 10 },
  ]
  /* THE TOTAL FELL — 34 against a floor summing to 43 — AND ONE PART ROSE. Ratcheting the sum would call
   * this progress and let walls grow behind refusals' improvement, which is the entire reason each debt is
   * named separately rather than added up. */
  const verdict = verdictOf(rows, { walls: 23, refusals: 20 })
  assert.equal(verdict.holds, false)
  assert.deepEqual(verdict.risen, ['walls 23 -> 24'])
  assert.deepEqual(verdict.fallen, ['refusals 20 -> 10'])
  assert.equal(verdict.total, 34)
})

test('a fall is recorded and a steady floor holds', () => {
  assert.equal(verdictOf([{ name: 'walls', count: 23 }], { walls: 23 }).holds, true)
  const fell = verdictOf([{ name: 'walls', count: 20 }], { walls: 23 })
  assert.equal(fell.holds, true)
  assert.deepEqual(fell.fallen, ['walls 23 -> 20'])
})

test('a debt with no floor yet is not a rise', () => {
  /* The first run of a new debt has nothing to compare against, and treating that as a regression would
   * make adding a gate impossible — which is how gates stop being added. */
  const first = verdictOf([{ name: 'fresh', count: 99 }], {})
  assert.equal(first.holds, true)
  assert.deepEqual(first.risen, [])
  assert.deepEqual(first.fallen, [])
})

test('every debt names what it counts, so a number is never bare', () => {
  for (const debt of DEBTS) {
    assert.ok(debt.name.length > 0)
    assert.ok(debt.what.length > 0, `${debt.name} must say what it counts`)
    assert.equal(typeof debt.pick, 'function')
  }
  // and the four are distinct, or one would silently shadow another's floor
  assert.equal(new Set(DEBTS.map((d) => d.name)).size, DEBTS.length)
})
