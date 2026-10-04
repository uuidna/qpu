import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { FluidFormulas } from './index.js'
import '../../mcp/families.js'

test('fluid: reynolds, bernoulli, viscosity, drag, buoyancy, continuity, froude, pressure — crossing to hydraulics', async (t) => {
  assert.equal(FluidFormulas.reynolds(20, 15).value, 300, 'Reynolds proxy')
  assert.equal(FluidFormulas.bernoulli(500, 250).value, 750, 'total head')
  assert.equal(FluidFormulas.viscosity(1000, 4).value, 250)
  assert.equal(FluidFormulas.viscosity(1000, 0).value, 0, 'rate guard')
  assert.equal(FluidFormulas.drag(3, 40).value, 120)
  assert.equal(FluidFormulas.buoyancy(1000, 5).value, 5000)
  assert.equal(FluidFormulas.continuity(10, 25).value, 250, 'flow rate')
  assert.equal(FluidFormulas.froude(50, 20).value, 250)
  assert.equal(FluidFormulas.froude(50, 0).value, 0, 'wave guard')
  assert.equal(FluidFormulas.pressure(1000, 4).value, 250)
  assert.equal(FluidFormulas.pressure(1000, 0).value, 0, 'area guard')
  assert.equal(FluidFormulas.reynolds(20, 15).dst, 'hydraulics')
  assert.equal(qpuHexFamiliesOf().get('fluid')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'fluid', program: ['continuity'], params: [10, 25] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 250, `fluid.continuity at ${uuid}`)
  qpuUuidReceiptOf('fluid continuity', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; reynolds 300, bernoulli 750, viscosity 250, drag 120, buoyancy 5000, continuity 250, froude 250, pressure 250; crossing to hydraulics')
})
