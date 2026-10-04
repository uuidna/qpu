import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { BatteryFormulas } from './index.js'
import '../../mcp/families.js'

test('battery: capacity, charge, crate, cycles, depth, energy, runtime, soh — crossing to electrical', async (t) => {
  assert.equal(BatteryFormulas.capacity(4, 3000).value, 12000, 'a four-cell pack')
  assert.equal(BatteryFormulas.charge(6000, 12000).value, 50)
  assert.equal(BatteryFormulas.crate(12000, 2).value, 24000, 'the current at 2C')
  assert.equal(BatteryFormulas.cycles(2000, 500).value, 1500)
  assert.equal(BatteryFormulas.cycles(100, 500).value, 0, 'clamped at zero')
  assert.equal(BatteryFormulas.depth(3000, 12000).value, 25)
  assert.equal(BatteryFormulas.energy(12, 3000).value, 36, 'watt-hours')
  assert.equal(BatteryFormulas.runtime(12000, 1000).value, 12)
  assert.equal(BatteryFormulas.soh(9000, 12000).value, 75)
  assert.equal(BatteryFormulas.capacity(4, 3000).dst, 'electrical')
  assert.equal(qpuHexFamiliesOf().get('battery')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'battery', program: ['runtime'], params: [12000, 1000] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 12, `battery.runtime at ${uuid}`)
  qpuUuidReceiptOf('battery runtime', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; capacity 12000, charge 50, crate 24000, cycles 1500, depth 25, energy 36, runtime 12, soh 75; crossing to electrical')
})
