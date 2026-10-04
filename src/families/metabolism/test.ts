import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { MetabolismFormulas } from './index.js'
import '../../mcp/families.js'

test('metabolism: bmr, atpyield, respiratoryquotient, caloricburn, oxidation, energycharge, turnover, substrateflux — crossing to biochemistry', async (t) => {
  assert.equal(MetabolismFormulas.bmr(70, 175, 30).value, 1600, 'resting kcal/day')
  assert.equal(MetabolismFormulas.atpyield(10).value, 380, 'ATP from ten glucose')
  assert.equal(MetabolismFormulas.respiratoryquotient(8, 10).value, 80, 'RQ of 0.8')
  assert.equal(MetabolismFormulas.caloricburn(8, 70, 30).value, 280, 'kcal of the effort')
  assert.equal(MetabolismFormulas.oxidation(16).value, 8, 'palmitate into eight acetyl-CoA')
  assert.equal(MetabolismFormulas.energycharge(8, 1, 1).value, 85, 'a charged cell')
  assert.equal(MetabolismFormulas.turnover(6000, 60).value, 100, 'product per unit time')
  assert.equal(MetabolismFormulas.substrateflux(50, 4).value, 200)
  assert.equal(MetabolismFormulas.bmr(70, 175, 30).dst, 'biochemistry')
  assert.equal(qpuHexFamiliesOf().get('metabolism')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'metabolism', program: ['turnover'], params: [6000, 60] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 100, `metabolism.turnover at ${uuid}`)
  qpuUuidReceiptOf('metabolism turnover', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; bmr 1600, atpyield 380, respiratoryquotient 80, caloricburn 280, oxidation 8, energycharge 85, turnover 100, substrateflux 200; crossing to biochemistry')
})
