/**
 * THE PER-CALL MEASURE, PROVED ABLE TO SEPARATE WHAT IT CLAIMS TO.
 *
 * This exists because I asserted a per-call regression from the fact that the served surface had not grown —
 * an inference from an absence — and the measurement said the opposite: cold cost rose 1.6% across four
 * releases and fell 3.1% at the last one. The tests got 16% dearer by doing more, not by the doors costing
 * more. A measure that could not tell a cold call from a warm one, or a missing door from a free one, would
 * not have settled it either way.
 *
 *   node --test scripts/percall.test.mjs
 */
import assert from 'node:assert/strict'
import test from 'node:test'

import { doorCostOf, markOf, seriesOf, summaryOf, workBetween } from './percall.mjs'

/** A unit whose ledgers advance by whatever the fake worker says each call costs. */
const unitOf = (costs) => {
  const state = { computations: 0, mint: 0 }
  let call = 0
  return {
    unit: {
      qpuReceiptLedgerOf: () => ({ length: state.computations }),
      qpuMintReceiptOf: () => ({ calls: state.mint }),
    },
    worker: {
      fetch: async () => {
        const cost = costs[Math.min(call, costs.length - 1)]
        call += 1
        if (cost === null) return { status: 500, json: async () => ({ error: 'no' }) }
        state.computations += cost.computations ?? 0
        state.mint += cost.mint ?? 0
        return { status: 200, json: async () => ({ result: { ok: true } }) }
      },
    },
  }
}

test('work is the advance of both ledgers, and a mark is a point in time', () => {
  const { unit } = unitOf([])
  assert.deepEqual(markOf(unit), { computations: 0, mint: 0 })
  assert.equal(workBetween({ computations: 1, mint: 2 }, { computations: 4, mint: 10 }), 11)
  // a unit that exposes neither ledger reads as zero rather than throwing — old releases may lack an export
  assert.deepEqual(markOf({}), { computations: 0, mint: 0 })
})

test('cold and warm are measured apart, because averaging a miss with a hit describes no real call', async () => {
  /* First call builds and memoises; the second is served. A single figure would report 550 as "the cost of a
   * call to this door", which is true of neither the first nor any that follow. */
  const { unit, worker } = unitOf([{ computations: 1000 }, { computations: 100 }])
  const row = await doorCostOf(unit, worker, 'qpu_prove', {})
  assert.equal(row.present, true)
  assert.equal(row.cold, 1000)
  assert.equal(row.warm, 100)
  assert.notEqual(row.cold, row.warm)

  // A DOOR WITH NO MEMO pays the same twice, which must read as equal and not as a measurement error.
  const flat = await doorCostOf(...Object.values(unitOf([{ computations: 500 }, { computations: 500 }])), 'qpu_improve', {})
  assert.equal(flat.cold, flat.warm)
})

test('a door that is absent is absent, not free', async () => {
  const { unit, worker } = unitOf([null])
  const row = await doorCostOf(unit, worker, 'qpu_future', {})
  assert.equal(row.present, false)
  assert.match(row.why, /answered 500/)
  assert.equal(row.cold, undefined, 'no cost is reported for a call that did not happen')

  /* AND THE SUMMARY MUST NOT COUNT IT. A release measured before a door existed would otherwise show that
   * door as costing nothing and the release as cheaper, which is the dilution fault one level down. */
  const read = summaryOf([{ name: 'a', present: true, cold: 100, warm: 10 }, row])
  assert.equal(read.doors, 1)
  assert.equal(read.absent, 1)
  assert.equal(read.cold, 100)
  assert.equal(read.holds, true)
})

test('the warm share says whether the memo is doing anything', () => {
  const memoised = summaryOf([{ name: 'a', present: true, cold: 1000, warm: 100 }])
  assert.equal(memoised.warmShare, 100, 'a tenth, in thousandths')
  const none = summaryOf([{ name: 'a', present: true, cold: 1000, warm: 1000 }])
  assert.equal(none.warmShare, 1000, 'and a door with no memo pays in full every time')
  assert.equal(summaryOf([]).warmShare, 0, 'nothing measured is not a division by zero')
})

test('the release series is a comparison only where there is a prior release', () => {
  const series = seriesOf([
    { tag: 'v1', cold: 1000, warm: 800 },
    { tag: 'v2', cold: 1100, warm: 900 },
    { tag: 'v3', cold: 1067, warm: 870 },
  ])
  assert.equal(series[0].delta, undefined, 'the first release has nothing to be compared against')
  assert.equal(series[1].delta, 100, 'ten per cent dearer, in thousandths')
  assert.ok(series[2].delta < 0, 'and a fall reads as a fall')
  // THE SHAPE THE REAL DATA HAS: it rose, then fell, and the net is small — which is what "flat" means and
  // is not the same as "unchanged at every step".
  assert.equal(seriesOf([{ tag: 'v1', cold: 1000 }]).length, 1)
})
