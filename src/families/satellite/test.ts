import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { SatelliteFormulas } from './index.js'
import '../../mcp/families.js'

test('satellite: period, coverage, linkbudget, footprint, revisit, downlink, elevation, latency — crossing to aerospace', async (t) => {
  assert.equal(SatelliteFormulas.period(500, 95).value, 47500, 'period proxy from altitude')
  assert.equal(SatelliteFormulas.coverage(2000, 15).value, 30000)
  assert.equal(SatelliteFormulas.linkbudget(100, 40).value, 60, 'power left after path loss')
  assert.equal(SatelliteFormulas.linkbudget(40, 100).value, 0, 'never below zero')
  assert.equal(SatelliteFormulas.footprint(500, 60).value, 30000)
  assert.equal(SatelliteFormulas.revisit(1000, 25).value, 40, 'revisit over the constellation')
  assert.equal(SatelliteFormulas.downlink(6000, 60).value, 100, 'bits per second in a pass')
  assert.equal(SatelliteFormulas.elevation(45).value, 45)
  assert.equal(SatelliteFormulas.latency(6000, 300).value, 20)
  assert.equal(SatelliteFormulas.period(500, 95).dst, 'aerospace')
  assert.equal(qpuHexFamiliesOf().get('satellite')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'satellite', program: ['coverage'], params: [2000, 15] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 30000, `satellite.coverage at ${uuid}`)
  qpuUuidReceiptOf('satellite coverage', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; period 47500, coverage 30000, linkbudget 60, footprint 30000, revisit 40, downlink 100, elevation 45, latency 20; crossing to aerospace')
})
