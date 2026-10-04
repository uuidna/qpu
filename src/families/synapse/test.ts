import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { SynapseFormulas } from './index.js'
import '../../mcp/families.js'

test('synapse: transmissiondelay, neurotransmitterrelease, receptoroccupancy, summation, firingrate, synapticweight, vesiclecount, releaseprobability — crossing to neurology', async (t) => {
  assert.equal(SynapseFormulas.transmissiondelay(1000, 50).value, 20, 'milliseconds down the axon')
  assert.equal(SynapseFormulas.neurotransmitterrelease(10, 5000).value, 50000)
  assert.equal(SynapseFormulas.receptoroccupancy(750, 1000).value, 75, 'three quarters of receptors bound')
  assert.equal(SynapseFormulas.summation(30, 12).value, 18, 'net excitation')
  assert.equal(SynapseFormulas.firingrate(600, 5).value, 120, 'spikes per second')
  assert.equal(SynapseFormulas.synapticweight(8, 4).value, 32)
  assert.equal(SynapseFormulas.vesiclecount(200, 20).value, 180)
  assert.equal(SynapseFormulas.releaseprobability(3, 10).value, 30, 'release probability as a percentage')
  assert.equal(SynapseFormulas.summation(12, 30).value, 0)
  assert.equal(SynapseFormulas.firingrate(600, 5).dst, 'neurology')
  assert.equal(qpuHexFamiliesOf().get('synapse')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'synapse', program: ['firingrate'], params: [600, 5] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 120, `synapse.firingrate at ${uuid}`)
  qpuUuidReceiptOf('synapse firingrate', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; transmissiondelay 20, neurotransmitterrelease 50000, receptoroccupancy 75, summation 18, firingrate 120, synapticweight 32, vesiclecount 180, releaseprobability 30; crossing to neurology')
})
