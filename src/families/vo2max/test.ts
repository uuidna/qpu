import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { Vo2maxFormulas } from './index.js'
import '../../mcp/families.js'

test('vo2max: estimate, absolute, metequivalent, heartratemax, fitnessscore, oxygenpulse, aerobiccapacity, improvement — crossing to physiology', async (t) => {
  assert.equal(Vo2maxFormulas.estimate(3500, 70).value, 50)
  assert.equal(Vo2maxFormulas.absolute(50, 70).value, 3500)
  assert.equal(Vo2maxFormulas.metequivalent(175, 50).value, 3)
  assert.equal(Vo2maxFormulas.heartratemax(220, 30).value, 190)
  assert.equal(Vo2maxFormulas.fitnessscore(50, 60).value, 83)
  assert.equal(Vo2maxFormulas.oxygenpulse(3500, 175).value, 20)
  assert.equal(Vo2maxFormulas.aerobiccapacity(50, 8).value, 400)
  assert.equal(Vo2maxFormulas.improvement(55, 50).value, 5)
  assert.equal(Vo2maxFormulas.estimate(3500, 70).dst, 'physiology')
  assert.equal(qpuHexFamiliesOf().get('vo2max')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'vo2max', program: ['estimate'], params: [3500, 70] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 50, `vo2max.estimate at ${uuid}`)
  qpuUuidReceiptOf('vo2max estimate', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; estimate 50, absolute 3500, metequivalent 3, heartratemax 190, fitnessscore 83, oxygenpulse 20, aerobiccapacity 400, improvement 5; crossing to physiology')
})
