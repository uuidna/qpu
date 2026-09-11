// reach — the largest run this host holds, CLIMBED to, never typed. Every step adds two qubits and so multiplies the
// vector by four; the next step is predicted from the one just measured, four times its wall time and four times its
// heap, and the climb stops when either prediction would not fit. The budget is read from the host — v8's own heap
// limit — and a fixed wall-time allowance. The last run that fit is the reach, and the suite has then exercised the
// biggest vector this host can hold, not a small case standing in for it. A bigger host climbs higher; the reach is
// a reading in the diagnostics, and the receipt carries the computations of the run that set it.
import { test } from './receipted.js'
import assert from 'node:assert/strict'
import v8 from 'node:v8'
import { qpuShorOf } from './index.js'

const MB = 2 ** 20
const timeBudgetMs = 20000

test('reach: the largest run this host holds is climbed to, and the run at the reach holds', (t) => {
  const heapLimit = v8.getHeapStatistics().heap_size_limit
  const floor = qpuShorOf() // the unit's own default run, 91 and 8 — the reach must be past it
  const steps: { qubits: number; dim: number; ms: number; heap: number }[] = []
  for (let work = 4; work <= 50; work += 2) {
    const heap0 = process.memoryUsage().heapUsed
    const t0 = process.hrtime.bigint()
    const run = qpuShorOf(2 ** work - 1, 3)
    const ms = Number(process.hrtime.bigint() - t0) / 1e6
    const heap = Math.max(process.memoryUsage().heapUsed - heap0, 0)
    assert.equal(run.circuitry.qubits, work + 2)
    assert.equal(run.prepare.prepared, true)
    // the state is sparse: at most sixteen nonzero amplitudes whatever the dimension, so the climb no longer meets memory
    assert.equal(run.prepare.amplitudes > 0 && run.prepare.amplitudes <= 16, true)
    assert.equal(run.circuitry.holds, true)
    assert.equal(run.measure.holds, true)
    steps.push({ qubits: run.circuitry.qubits, dim: Number(run.circuitry.dim), ms, heap })
    const heapLeft = heapLimit - process.memoryUsage().heapUsed
    if (ms * 4 > timeBudgetMs || heap * 4 > heapLeft / 2) break
  }
  const reach = steps[steps.length - 1]!
  // each step really was four times the last: the climb was by qubits, not by luck
  for (let i = 1; i < steps.length; i++) assert.equal(steps[i]!.dim, steps[i - 1]!.dim * 4)
  assert.equal(reach.qubits > floor.circuitry.qubits, true)
  assert.equal(reach.dim > Number(floor.circuitry.dim), true)
  t.diagnostic(
    `reach ${reach.qubits} qubits · dim ${reach.dim} · ${reach.ms.toFixed(0)} ms · heap Δ ${(reach.heap / MB).toFixed(0)} MB of a ${(heapLimit / MB).toFixed(0)} MB limit · ${steps.length} steps from ${steps[0]!.qubits}`,
  )
})
