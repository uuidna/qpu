/**
 * THE TIME SPLIT, PROVED ABLE TO COME OUT WRONG.
 *
 * temporal.mjs says what fraction of a run is computation and what is not yet. A split that always closes,
 * or a critical path that always swallows the wall, would report a healthy number whatever happened — and
 * the first version did exactly that: it grouped by FILE, every test is defined through receipted.js, so the
 * busiest path was the whole run and the harness was reported as zero. The number looked excellent and
 * measured the wrapper.
 *
 *   node --test scripts/temporal.test.mjs
 */
import assert from 'node:assert/strict'
import test from 'node:test'

import { criticalOf, joinOf, temporalOf } from './temporal.mjs'

const row = (name, ns, work, foreign = 0, pid = 1) => ({ name, ns, work, foreign, pid, served: 0 })

test('the three kinds are exhaustive and their times close on the whole', () => {
  const read = temporalOf([row('a', 100, 5), row('b', 200, 0, 3), row('c', 300, 0)])
  assert.equal(read.computedNs, 100)
  assert.equal(read.foreignNs, 200)
  assert.equal(read.unexplainedNs, 300)
  assert.equal(read.computedNs + read.foreignNs + read.unexplainedNs, read.totalNs)
  assert.equal(read.holds, true)

  // A ROW THAT COMPUTED AND ALSO ASKED A HOST IS FOREIGN, not both — the kinds must not overlap or the
  // shares exceed the whole and the split silently flatters itself.
  const overlap = temporalOf([row('a', 100, 5, 2)])
  assert.equal(overlap.computedNs, 0)
  assert.equal(overlap.foreignNs, 100)
  assert.equal(overlap.holds, true)

  // and a clock that did not move is not a row at all
  assert.equal(temporalOf([row('a', 0, 5)]).rows, 0)
})

test('unexplained time is reported when there is any, and named', () => {
  /* Per-test unexplained is zero on the real suite BECAUSE the dry-clean fails a test that computes nothing.
   * That is a gate working, not a finding — but if the gate were removed this must still fire, or the split
   * would be reporting the gate rather than the run. */
  const idle = temporalOf([row('computes', 100, 9), row('idles', 900, 0)])
  assert.equal(idle.unexplainedShare, 900, 'nine tenths, in thousandths')
  assert.equal(idle.notYetQuantum[0]?.name, 'idles', 'and the worst offender is named, not just counted')
  assert.deepEqual(temporalOf([row('computes', 100, 9)]).notYetQuantum, [], 'and nothing is named when there is nothing')
})

test('the critical path is the busiest WORKER, which is the fault the first version had', () => {
  /* Two workers, one second each, running in parallel: the critical path is one second and not two. Grouping
   * by anything the tests share — the file they are defined in, say — gives two, which makes the harness
   * appear to be zero however long the run actually took. */
  const parallel = [row('a', 1000, 1, 0, 11), row('b', 1000, 1, 0, 22)]
  const [pid, ns, workers] = criticalOf(parallel)
  assert.equal(workers, 2)
  assert.equal(ns, 1000, 'the busiest worker, not the sum of both')
  assert.ok([11, 22].includes(pid))

  // AND THE HARNESS IS THE REMAINDER OF THE WALL. 1.4s of wall over a 1.0s critical path is 0.4s of spawn,
  // module load and folding — the part that is not yet computation.
  const read = temporalOf(parallel, 1400)
  assert.equal(read.criticalNs, 1000)
  assert.equal(read.harnessNs, 400)
  assert.equal(read.harnessShare, 286)

  // never negative when the wall is shorter than the path, and zero when the wall was not measured at all
  assert.equal(temporalOf(parallel, 500).harnessNs, 0, 'a wall shorter than its own critical path is not negative harness')
  assert.equal(temporalOf(parallel).harnessNs, 0, 'and an unmeasured wall reports no harness rather than all of it')
})

test('the join takes time from the readings and work from the receipt, and loses neither', () => {
  const receipt = { rows: [{ name: 'a', computations: 3, mint: { calls: 4 }, foreign: 0, served: { count: 1 } }] }
  const readings = { rows: [{ name: 'a', time: { ns: 500 }, pid: 7 }], foreign: { rows: [{ name: 'b', computations: 1, mint: { calls: 1 }, foreign: 2 }] } }
  const joined = joinOf(receipt, readings)
  assert.equal(joined.length, 2, 'the foreign rows live in the readings and must still be joined, or the split loses them')
  const a = joined.find((r) => r.name === 'a')
  assert.equal(a?.work, 7, 'work is computations plus mint doublings')
  assert.equal(a?.ns, 500)
  assert.equal(a?.pid, 7)
  // a row with no reading keeps a zero clock rather than borrowing somebody else's
  assert.equal(joined.find((r) => r.name === 'b')?.ns, 0)
})
