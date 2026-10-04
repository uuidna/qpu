import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { HovercraftFormulas } from './index.js'
import '../../mcp/families.js'

test('hovercraft: liftpressure, skirtarea, payload, speed, fanpower, clearance, cushionforce, efficiency — crossing to physics', async (t) => {
  assert.equal(HovercraftFormulas.liftpressure(5000, 2).value, 2500)
  assert.equal(HovercraftFormulas.skirtarea(40, 1).value, 40)
  assert.equal(HovercraftFormulas.payload(2000, 1).value, 2000)
  assert.equal(HovercraftFormulas.speed(60, 1).value, 60)
  assert.equal(HovercraftFormulas.fanpower(200, 2).value, 400)
  assert.equal(HovercraftFormulas.clearance(300, 1).value, 300)
  assert.equal(HovercraftFormulas.cushionforce(2500, 40).value, 100000)
  assert.equal(HovercraftFormulas.efficiency(70, 100).value, 70)
  assert.equal(HovercraftFormulas.liftpressure(5000, 2).dst, 'physics')
  assert.equal(qpuHexFamiliesOf().get('hovercraft')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'hovercraft', program: ['liftpressure'], params: [5000, 2] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 2500, `hovercraft.liftpressure at ${uuid}`)
  qpuUuidReceiptOf('hovercraft liftpressure', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; liftpressure 2500, skirtarea 40, payload 2000, speed 60, fanpower 400, clearance 300, cushionforce 100000, efficiency 70; crossing to physics')
})
