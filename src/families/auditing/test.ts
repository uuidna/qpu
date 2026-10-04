import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { AuditingFormulas } from './index.js'
import '../../mcp/families.js'

test('auditing: materiality, samplesize, errorrate, coverage, findings, variance, risk, compliance — crossing to accounting', async (t) => {
  assert.equal(AuditingFormulas.materiality(5, 1000).value, 0, 'threshold a half-percent of the total')
  assert.equal(AuditingFormulas.samplesize(1000, 20).value, 50, 'fifty items to sample')
  assert.equal(AuditingFormulas.errorrate(3, 50).value, 6)
  assert.equal(AuditingFormulas.coverage(80, 100).value, 80)
  assert.equal(AuditingFormulas.findings(2, 40).value, 5)
  assert.equal(AuditingFormulas.variance(110, 100).value, 110)
  assert.equal(AuditingFormulas.risk(3, 4).value, 12, 'likelihood times impact')
  assert.equal(AuditingFormulas.compliance(95, 100).value, 95)
  assert.equal(AuditingFormulas.materiality(5, 1000).dst, 'accounting')
  assert.equal(qpuHexFamiliesOf().get('auditing')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'auditing', program: ['coverage'], params: [80, 100] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 80, `auditing.coverage at ${uuid}`)
  qpuUuidReceiptOf('auditing coverage', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; materiality 0, samplesize 50, errorrate 6, coverage 80, findings 5, variance 110, risk 12, compliance 95; crossing to accounting')
})
