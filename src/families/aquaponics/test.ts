import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { AquaponicsFormulas } from './index.js'
import '../../mcp/families.js'

test('aquaponics: fishdensity, plantgrowbeds, nitrogencycle, feedratio, watervolume, bacteriastrains, phbalance, yieldratio — crossing to agriculture', async (t) => {
  assert.equal(AquaponicsFormulas.fishdensity(50, 1).value, 50)
  assert.equal(AquaponicsFormulas.plantgrowbeds(4, 2).value, 8)
  assert.equal(AquaponicsFormulas.nitrogencycle(3, 0).value, 3)
  assert.equal(AquaponicsFormulas.feedratio(2, 100).value, 2)
  assert.equal(AquaponicsFormulas.watervolume(1000, 4).value, 4000)
  assert.equal(AquaponicsFormulas.bacteriastrains(2, 1).value, 3)
  assert.equal(AquaponicsFormulas.phbalance(68, 10).value, 6)
  assert.equal(AquaponicsFormulas.yieldratio(90, 100).value, 90)
  assert.equal(AquaponicsFormulas.fishdensity(50, 1).dst, 'agriculture')
  assert.equal(qpuHexFamiliesOf().get('aquaponics')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'aquaponics', program: ['fishdensity'], params: [50, 1] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 50, `aquaponics.fishdensity at ${uuid}`)
  qpuUuidReceiptOf('aquaponics fishdensity', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; fishdensity 50, plantgrowbeds 8, nitrogencycle 3, feedratio 2, watervolume 4000, bacteriastrains 3, phbalance 6, yieldratio 90; crossing to agriculture')
})
