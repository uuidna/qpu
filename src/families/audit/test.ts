import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { verifyHex } from '../verify.js'
import { AuditFormulas } from './index.js'
import '../../mcp/families.js'

/** COMPLIANCE AS FUSION, EXACT. Each formula fuses a few standards' scores: GDPR+ISO+NIST as a plain mean, healthcare
 *  and payment as the weighted sums their frameworks state (HIPAA 0.4 / SOC2 0.35 / NIST 0.25; PCI-DSS 0.45 / CIS 0.3 /
 *  OWASP 0.25), and supply-chain risk as 1/(1 + mean of the four controls) — risk that falls as the controls rise.
 *  Crosses audit → the standards it names. */
test('audit: the compliance fusions are the exact weighted scores, and risk falls as controls rise', async (t) => {
  assert.equal(AuditFormulas.gdprIsoNistFusion(90, 85, 80).value, 85, 'the mean of the three standards')
  assert.equal(AuditFormulas.gdprIsoNistFusion(60, 60, 60).value, 60, 'all equal, the fusion is the same')
  assert.equal(AuditFormulas.healthcareComplianceFusion(90, 85, 80).value, 85.75, 'HIPAA·0.4 + SOC2·0.35 + NIST·0.25')
  assert.equal(AuditFormulas.healthcareComplianceFusion(100, 100, 100).value, 100, 'full compliance scores 100')
  assert.equal(AuditFormulas.paymentSecurityFusion(90, 85, 80).value, 86, 'PCI-DSS·0.45 + CIS·0.3 + OWASP·0.25')
  assert.equal(AuditFormulas.paymentSecurityFusion(100, 100, 100).value, 100)
  assert.equal(AuditFormulas.supplyChainRiskFormula(0, 0, 0, 0).value, 1, 'no controls: maximum risk, 1/(1+0)')
  assert.ok(AuditFormulas.supplyChainRiskFormula(100, 100, 100, 100).value < AuditFormulas.supplyChainRiskFormula(10, 10, 10, 10).value, 'more controls, less risk')
  assert.equal(AuditFormulas.supplyChainRiskFormula(80, 90, 70, 100).value, 1 / (1 + 85), '1/(1 + mean of SLSA, SBOM, SCA, code quality)')
  assert.equal(AuditFormulas.gdprIsoNistFusion(90, 85, 80).dst, 'standards.nist')
  assert.equal(AuditFormulas.paymentSecurityFusion(90, 85, 80).dst, 'standards.owasp')
  assert.equal(AuditFormulas.supplyChainRiskFormula(0, 0, 0, 0).dst, 'audit.risk')
  // supplyChainRiskFormula takes four params; a hex program addresses at most three, so it is checked directly above
  await verifyHex('audit', 4, [
    ['gdprIsoNistFusion', [90, 85, 80], 85],
    ['gdprIsoNistFusion', [60, 60, 60], 60],
    ['healthcareComplianceFusion', [90, 85, 80], 85.75],
    ['healthcareComplianceFusion', [100, 100, 100], 100],
    ['paymentSecurityFusion', [90, 85, 80], 86],
    ['paymentSecurityFusion', [100, 100, 100], 100],
  ])
  t.diagnostic('4 formulas; GDPR/ISO/NIST mean 85, healthcare 85.75, payment 86, supply-chain risk 1 at zero controls and falling; crossing to the standards')
})
