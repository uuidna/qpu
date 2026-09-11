import { test } from './receipted.js'
import assert from 'node:assert/strict'
import { qpuCracksOf, qpuReadingsOf, qpuSpeedOf } from './index.js'

// MONITOR SPEED AND TEMPERATURE TO FIND CRACKS. Every temperature figure is a crack here — no thermometer — and a
// speed reading is a crack exactly when the clock did not resolve it. Nothing in this list is typed.
test('cracks: every temperature figure is declared and named; unresolved speed readings are named, resolved ones are not', () => {
  const speed = qpuSpeedOf()
  const c = qpuCracksOf()
  assert.equal(c.holds, true)
  assert.ok(c.readings >= speed.benchmark.length)
  const temperature = c.cracks.filter((k) => k.kind === 'temperature')
  assert.ok(temperature.some((k) => k.name === 'fridge.millikelvin'))
  assert.ok(temperature.some((k) => k.name === 'cryostat.mixing'))
  for (const k of temperature) assert.equal(k.why.includes('thermometer'), true)
  const named = new Set(c.cracks.filter((k) => k.kind === 'speed').map((k) => k.name))
  for (const r of qpuReadingsOf()) assert.equal(named.has(r.key), !r.resolved, r.key)
  assert.equal(c.measured + c.cracks.filter((k) => k.kind === 'speed').length, c.readings)
})
