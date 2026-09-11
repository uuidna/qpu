// reach — the widest run in the suite, CLIMBED to a fixed width ceiling, the same on every host. The Shor state is
// sparse and exact, so no dimension is out of reach and the cost is the width of the modulus; each step doubles the
// work register from 4 bits to 2^16 bits, fifteen steps, and the run at each holds. The ceiling, not a clock, bounds
// the climb: a climb that stopped on a time budget carried a different receipt on every machine, so the committed
// proof was one host's snapshot and CI could never match it. Now the receipt of this climb is the same in CI, on a
// laptop, and on the host, and test-receipt.json is a gate. The wall time of each step is a reading, in the
// diagnostics, never in the fold.
import { test } from './receipted.js'
import assert from 'node:assert/strict'
import { qpuShorOf } from './index.js'

const widthCeiling = 65536

test('reach: the climb to the width ceiling holds at every step, and its receipt is the same on every host', (t) => {
  const floor = qpuShorOf() // the unit's own default run, 91 and 8 — the ceiling is far past it
  const steps: { qubits: number; work: number; ms: number }[] = []
  for (let work = 4; work <= widthCeiling; work *= 2) {
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
    assert.equal(run.factors.by, 'gcd') // 2^work - 1 with even work is divisible by 3: the climb measures the state's width, never period-finding
    steps.push({ qubits: run.circuitry.qubits, work, ms })
  }
  const reach = steps[steps.length - 1]!
  for (let i = 1; i < steps.length; i++) assert.equal(steps[i]!.work, steps[i - 1]!.work * 2) // the climb was by width, not by luck
  assert.equal(steps.length, 15)
  assert.equal(reach.work, widthCeiling)
  assert.equal(reach.qubits, widthCeiling + 2)
  assert.equal(reach.qubits > floor.circuitry.qubits, true)
  const slowest = steps.reduce((top, s) => (s.ms > top.ms ? s : top), steps[0]!)
  t.diagnostic(`reach ${reach.qubits} qubits · dim 2^${reach.qubits} · ${steps.length} steps from ${steps[0]!.qubits} · ceiling ${widthCeiling} bits · slowest step ${slowest.ms.toFixed(0)} ms at ${slowest.qubits} qubits (a reading) · every step factored by gcd, none by period`)
})
