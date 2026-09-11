// reach — the widest run this host holds inside a time budget, CLIMBED to, never typed. The Shor state is sparse and
// exact, so no dimension is out of reach and the cost is the width of the modulus: each step doubles the work register,
// the growth between the last two steps is measured, and the climb stops when that growth predicts the next step past
// the budget. There is no loop bound; the budget and the host decide. The last run that fit is the reach, and the suite
// has then exercised the widest modulus this host runs, not a small case standing in for it. The receipt carries the
// dimension of every run on the way up.
import { test } from './receipted.js'
import assert from 'node:assert/strict'
import { qpuShorOf } from './index.js'

const timeBudgetMs = 20000

test('reach: the widest run this host holds in budget is climbed to, and the run at the reach holds', (t) => {
  const floor = qpuShorOf() // the unit's own default run, 91 and 8 — the reach must be past it
  const steps: { qubits: number; work: number; ms: number }[] = []
  let stoppedBy = 'nothing'
  for (let work = 4; ; work *= 2) {
    const modulus = (1n << BigInt(work)) - 1n
    const t0 = process.hrtime.bigint()
    const run = qpuShorOf(modulus, 3)
    const ms = Number(process.hrtime.bigint() - t0) / 1e6
    assert.equal(run.circuitry.qubits, work + 2)
    assert.equal(run.exact.n, modulus.toString()) // the modulus went in and came out exact, whatever its width
    assert.equal(run.prepare.prepared, true)
    assert.equal(run.prepare.sparse, true)
    assert.equal(run.prepare.amplitudes > 0 && run.prepare.amplitudes <= 16, true)
    assert.equal(run.circuitry.holds, true)
    assert.equal(run.measure.holds, true)
    const prev = steps[steps.length - 1]
    steps.push({ qubits: run.circuitry.qubits, work, ms })
    if (ms > timeBudgetMs) {
      stoppedBy = 'this step passed the budget'
      break
    }
    const growth = prev && prev.ms > 0 ? Math.max(ms / prev.ms, 1) : 1
    if (prev && ms * growth > timeBudgetMs) {
      stoppedBy = `measured growth ×${growth.toFixed(2)} predicts the next step past the budget`
      break
    }
  }
  const reach = steps[steps.length - 1]!
  for (let i = 1; i < steps.length; i++) assert.equal(steps[i]!.work, steps[i - 1]!.work * 2) // the climb was by width, not by luck
  assert.equal(reach.qubits > floor.circuitry.qubits, true)
  assert.equal(stoppedBy !== 'nothing', true)
  t.diagnostic(`reach ${reach.qubits} qubits · dim 2^${reach.qubits} · ${reach.ms.toFixed(0)} ms · ${steps.length} steps from ${steps[0]!.qubits} · stopped: ${stoppedBy}`)
})
