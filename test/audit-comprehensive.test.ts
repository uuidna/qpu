/**
 * Comprehensive Audit System Tests
 *
 * Tests fusion of legal + standards APIs across all 12 audit operations
 * Validates vector equilibrium, cross-domain formulas, and risk assessment
 */

import { describe, it, expect } from 'vitest'
import {
  legalAPI,
  standardsAPI,
  vectorEquilibriumAudit,
  auditFormulas,
  auditOps,
  runComprehensiveAudit,
  listAuditOperations
} from '../src/audit/index.js'

describe('Audit System - Legal & Standards Fusion', () => {
  // ========================================================================
  // TEST 1: Legal Compliance Frameworks
  // ========================================================================

  describe('Legal Compliance APIs', () => {
    it('GDPR framework has 5 requirements', () => {
      const gdpr = legalAPI.getFramework('gdpr')
      expect(gdpr).toBeDefined()
      expect(gdpr?.requirements.length).toBe(5)
      expect(gdpr?.name).toBe('GDPR')
      expect(gdpr?.riskLevel).toBe('critical')
      expect(gdpr?.automatablePercentage).toBe(72)
    })

    it('HIPAA framework has 4 requirements', () => {
      const hipaa = legalAPI.getFramework('hipaa')
      expect(hipaa).toBeDefined()
      expect(hipaa?.requirements.length).toBe(4)
      expect(hipaa?.sector).toBe('healthcare')
    })

    it('All frameworks list correctly', () => {
      const frameworks = legalAPI.listFrameworks()
      expect(frameworks.length).toBeGreaterThanOrEqual(6)
      expect(frameworks.map(f => f.id)).toContain('gdpr')
      expect(frameworks.map(f => f.id)).toContain('hipaa')
      expect(frameworks.map(f => f.id)).toContain('soc2')
      expect(frameworks.map(f => f.id)).toContain('iso27001')
      expect(frameworks.map(f => f.id)).toContain('pci-dss')
      expect(frameworks.map(f => f.id)).toContain('ccpa')
    })

    it('Can check individual GDPR requirement', async () => {
      const result = await legalAPI.checkRequirement('gdpr', 'gdpr-encryption', {
        'encryption-config': { enabled: true },
        'key-management-audit': { rotated: true }
      })
      expect(result.compliant).toBe(true)
      expect(result.score).toBeGreaterThan(0.5)
    })

    it('Detects missing evidence for requirements', async () => {
      const result = await legalAPI.checkRequirement('gdpr', 'gdpr-encryption', {})
      expect(result.compliant).toBe(false)
      expect(result.gaps.length).toBeGreaterThan(0)
      expect(result.recommendations.length).toBeGreaterThan(0)
    })
  })

  // ========================================================================
  // TEST 2: Industry Standards Benchmarks
  // ========================================================================

  describe('Industry Standards APIs', () => {
    it('NIST CSF has 3+ controls', () => {
      const nist = standardsAPI.getStandard('nist-csf')
      expect(nist).toBeDefined()
      expect(nist?.controls.length).toBeGreaterThanOrEqual(3)
      expect(nist?.version).toBe('1.1')
      expect(nist?.scoringWeights['identify']).toBe(0.2)
    })

    it('CIS Controls v8 defined', () => {
      const cis = standardsAPI.getStandard('cis-controls')
      expect(cis).toBeDefined()
      expect(cis?.version).toBe('8.0')
      expect(cis?.controls.length).toBeGreaterThanOrEqual(2)
    })

    it('OWASP ASVS has multiple security domains', () => {
      const owasp = standardsAPI.getStandard('owasp-asvs')
      expect(owasp).toBeDefined()
      expect(owasp?.category).toBe('application-security')
      expect(Object.keys(owasp?.scoringWeights || {}).length).toBeGreaterThan(3)
    })

    it('SLSA Framework for supply chain', () => {
      const slsa = standardsAPI.getStandard('slsa')
      expect(slsa).toBeDefined()
      expect(slsa?.category).toBe('supply-chain')
      expect(slsa?.controls.some(c => c.id === 'slsa-version-control')).toBe(true)
    })

    it('All standards list correctly', () => {
      const standards = standardsAPI.listStandards()
      expect(standards.length).toBeGreaterThanOrEqual(5)
      expect(standards.map(s => s.id)).toContain('nist-csf')
      expect(standards.map(s => s.id)).toContain('cis-controls')
      expect(standards.map(s => s.id)).toContain('owasp-asvs')
      expect(standards.map(s => s.id)).toContain('slsa')
    })

    it('Can evaluate control with test data', async () => {
      const result = await standardsAPI.evaluateControl('nist-csf', 'nist-identify-1', {
        qualityScore: 0.9
      })
      expect(result.score).toBeLessThanOrEqual(1)
      expect(result.maturityLevel).toBeGreaterThanOrEqual(1)
    })
  })

  // ========================================================================
  // TEST 3: Vector Equilibrium Analysis
  // ========================================================================

  describe('Vector Equilibrium Audit Scoring', () => {
    const auditData = {
      governance: {
        policiesDocumented: true,
        riskAssessment: true,
        complianceProgram: true
      },
      identity: {
        mfaEnabled: true,
        rbacImplemented: true,
        accessReviewFreq: 90,
        automatedProvisioning: true
      },
      dataProtection: {
        encryptionAtRest: true,
        encryptionInTransit: true,
        keyRotationDays: 30,
        dlpEnabled: true
      },
      infrastructure: {
        networkSegmented: true,
        firewallEnabled: true,
        patchCycleMs: 7 * 24 * 60 * 60 * 1000, // 7 days
        redundancyLevel: 0.95
      },
      applications: {
        sdlcProcess: true,
        codeReviewRate: 1.0,
        sastEnabled: true,
        dastEnabled: true,
        scaEnabled: true
      },
      monitoring: {
        loggingEnabled: true,
        siemConfigured: true,
        anomalyDetection: true,
        alertingConfigured: true
      },
      incidentResponse: {
        irPlan: true,
        trainingHours: 8,
        mttrTargetMs: 1800000, // 30 minutes
        drillsPerYear: 4
      },
      supplyChain: {
        vendorAssessmentDone: true,
        sbomGenerated: true,
        dependencyScanEnabled: true,
        contractReviewDone: true
      }
    }

    it('Computes all 8 octant scores', () => {
      const octants = vectorEquilibriumAudit.computeOctantScores(auditData)
      expect(Object.keys(octants).length).toBe(8)
      expect(octants.governance).toBeGreaterThan(0)
      expect(octants.identity).toBeGreaterThan(0)
      expect(octants.dataProtection).toBeGreaterThan(0)
      expect(octants.infrastructure).toBeGreaterThan(0)
      expect(octants.applications).toBeGreaterThan(0)
      expect(octants.monitoring).toBeGreaterThan(0)
      expect(octants.incidentResponse).toBeGreaterThan(0)
      expect(octants.supplyChain).toBeGreaterThan(0)
    })

    it('Octant scores range from 0 to 1', () => {
      const octants = vectorEquilibriumAudit.computeOctantScores(auditData)
      Object.values(octants).forEach(score => {
        expect(score).toBeGreaterThanOrEqual(0)
        expect(score).toBeLessThanOrEqual(1)
      })
    })

    it('Computes equilibrium harmony for balanced audit', () => {
      const octants = vectorEquilibriumAudit.computeOctantScores(auditData)
      const eq = vectorEquilibriumAudit.computeEquilibrium(octants)
      expect(eq.harmony).toBeGreaterThan(0.8) // Should be harmonious
      expect(eq.stability).toBe('harmonious')
      expect(eq.balance).toBeGreaterThan(0.8)
    })

    it('Detects imbalanced octants', () => {
      const imbalanced = {
        governance: { policiesDocumented: true },
        identity: {},
        dataProtection: {},
        infrastructure: {},
        applications: { sdlcProcess: true, codeReviewRate: 0.1 },
        monitoring: {},
        incidentResponse: {},
        supplyChain: {}
      }
      const octants = vectorEquilibriumAudit.computeOctantScores(imbalanced)
      const eq = vectorEquilibriumAudit.computeEquilibrium(octants)
      expect(eq.harmony).toBeLessThan(0.85)
      expect(eq.stability).not.toBe('harmonious')
    })
  })

  // ========================================================================
  // TEST 4: Audit Formulas - Cross-Domain Fusion
  // ========================================================================

  describe('Audit Formulas - Legal + Standards Fusion', () => {
    it('GDPR + ISO27001 + NIST fusion formula', () => {
      const fusion = auditFormulas.gdprIsoNistFusion(0.9, 0.85, 0.88)
      expect(fusion.value).toBeLessThanOrEqual(1)
      expect(fusion.value).toBeGreaterThan(0.8)
      expect(fusion.proof).toContain('GDPR')
      expect(fusion.proof).toContain('ISO27001')
      expect(fusion.proof).toContain('NIST')
    })

    it('Healthcare fusion (HIPAA + SOC2 + NIST)', () => {
      const fusion = auditFormulas.healthcareComplianceFusion(0.95, 0.90, 0.92)
      expect(fusion.value).toBeGreaterThan(0.85)
      expect(fusion.src).toBe('legal.hipaa')
      expect(fusion.dst).toBe('standards.soc2')
    })

    it('Payment security fusion (PCI-DSS + CIS + OWASP)', () => {
      const fusion = auditFormulas.paymentSecurityFusion(0.92, 0.88, 0.90)
      expect(fusion.value).toBeGreaterThan(0.85)
      expect(fusion.formula).toContain('pci_dss * 0.45')
    })

    it('Supply chain risk computation', () => {
      const formula = auditFormulas.supplyChainRiskFormula(0.8, 1.0, 0.95, 0.85)
      expect(formula.value).toBeGreaterThan(0)
      expect(formula.value).toBeLessThanOrEqual(1)
      expect(formula.proof).toContain('supply chain risk')
    })

    it('Data protection score calculation', () => {
      const score = auditFormulas.dataProtectionScore(true, true, true, 24)
      expect(score).toBe(1.0)

      const lowScore = auditFormulas.dataProtectionScore(false, false, false, 168)
      expect(lowScore).toBeLessThan(0.5)
    })

    it('Access control maturity assessment', () => {
      const maturity = auditFormulas.accessControlMaturity(1.0, true, 1.0, true)
      expect(maturity).toBe(1.0)

      const lowMaturity = auditFormulas.accessControlMaturity(0.3, false, 0.2, false)
      expect(lowMaturity).toBeLessThan(0.5)
    })

    it('Incident response capability scoring', () => {
      const capability = auditFormulas.incidentResponseCapability(1.0, 1800000, 1.0, 4)
      expect(capability).toBeGreaterThan(0.8)

      const lowCapability = auditFormulas.incidentResponseCapability(0.3, 86400000, 0.2, 1)
      expect(lowCapability).toBeLessThan(0.5)
    })

    it('Overall audit score with risk weighting', () => {
      const score = auditFormulas.overallAuditScore(0.9, 0.88, 0.92)
      expect(score).toBeLessThanOrEqual(1)
      expect(score).toBeGreaterThan(0.85)
    })

    it('Risk index computation for critical gaps', () => {
      const gaps = [
        { weight: 0.3, severity: 0.9 },
        { weight: 0.25, severity: 0.85 },
        { weight: 0.2, severity: 0.7 }
      ]
      const index = auditFormulas.computeRiskIndex(gaps)
      expect(index).toBeGreaterThan(0)
      expect(index).toBeLessThanOrEqual(1)
    })

    it('Generates audit proof with consistent hash', () => {
      const octants = { gov: 0.9, identity: 0.85, dataProtection: 0.95 }
      const scores = { compliance: 0.88, standards: 0.86 }
      const proof1 = auditFormulas.generateAuditProof(1000, octants, scores)
      const proof2 = auditFormulas.generateAuditProof(1000, octants, scores)
      expect(proof1).toBe(proof2)
      expect(proof1).toContain('audit-proof')
    })
  })

  // ========================================================================
  // TEST 5: Audit Operations
  // ========================================================================

  describe('Audit MCP Operations', () => {
    it('Lists all 12 audit operations', () => {
      const ops = listAuditOperations()
      expect(ops.length).toBe(12)
      expect(ops.map(o => o.id)).toContain('audit:init')
      expect(ops.map(o => o.id)).toContain('audit:gdpr')
      expect(ops.map(o => o.id)).toContain('audit:hipaa')
      expect(ops.map(o => o.id)).toContain('audit:soc2')
      expect(ops.map(o => o.id)).toContain('audit:iso27001')
      expect(ops.map(o => o.id)).toContain('audit:pci-dss')
      expect(ops.map(o => o.id)).toContain('audit:equilibrium')
      expect(ops.map(o => o.id)).toContain('audit:supply-chain')
      expect(ops.map(o => o.id)).toContain('audit:data-protection')
      expect(ops.map(o => o.id)).toContain('audit:access-control')
      expect(ops.map(o => o.id)).toContain('audit:incident-response')
      expect(ops.map(o => o.id)).toContain('audit:report')
    })

    it('audit:init operation initializes assessment', async () => {
      const result = await auditOps['audit:init'].handler({
        organization: 'Test Corp',
        scope: ['gdpr', 'iso27001']
      })
      expect(result.auditId).toBeDefined()
      expect(result.frameworks.length).toBeGreaterThan(0)
      expect(result.startTime).toBeGreaterThan(0)
    })

    it('audit:gdpr operation assesses GDPR compliance', async () => {
      const result = await auditOps['audit:gdpr'].handler({
        'consent-logs': { logged: true },
        'encryption-config': { enabled: true }
      })
      expect(result.framework).toBe('GDPR')
      expect(result.score).toBeGreaterThanOrEqual(0)
      expect(result.score).toBeLessThanOrEqual(100)
      expect(result.compliant).toBeDefined()
    })

    it('audit:equilibrium operation computes vector balance', async () => {
      const result = await auditOps['audit:equilibrium'].handler({
        auditData: {
          governance: { policiesDocumented: true },
          identity: { mfaEnabled: true },
          dataProtection: { encryptionAtRest: true },
          infrastructure: { firewallEnabled: true },
          applications: { sdlcProcess: true },
          monitoring: { loggingEnabled: true },
          incidentResponse: { irPlan: true },
          supplyChain: { sbomGenerated: true }
        }
      })
      expect(result.octants).toBeDefined()
      expect(Object.keys(result.octants).length).toBe(8)
      expect(result.harmony).toBeGreaterThan(0)
      expect(result.stability).toBeDefined()
    })

    it('audit:supply-chain operation assesses SLSA compliance', async () => {
      const result = await auditOps['audit:supply-chain'].handler({
        slsaLevel: 2,
        sbom: { generated: true },
        dependencies: [
          { name: 'dep1', vulnerable: false },
          { name: 'dep2', vulnerable: false }
        ],
        codeQuality: 0.85
      })
      expect(result.framework).toBe('SLSA')
      expect(result.riskScore).toBeGreaterThanOrEqual(0)
      expect(result.riskLevel).toBeDefined()
      expect(['high', 'medium', 'low']).toContain(result.riskLevel)
    })

    it('audit:report operation fuses all assessments', async () => {
      const assessments = {
        'audit:gdpr': { score: 85 },
        'audit:hipaa': { score: 90 },
        'audit:soc2': { score: 88 },
        'audit:iso27001': { score: 87 },
        'audit:pci-dss': { score: 92 },
        'audit:supply-chain': { riskScore: 75 },
        'audit:equilibrium': { octants: { governance: 90, identity: 88 } }
      }
      const result = await auditOps['audit:report'].handler({
        organization: 'Test Org',
        assessments
      })
      expect(result.organization).toBe('Test Org')
      expect(result.summary).toBeDefined()
      expect(result.summary.overallScore).toBeGreaterThan(0)
      expect(result.summary.verdict).toBeDefined()
      expect(result.signatureProof).toContain('audit-proof')
      expect(result.timestamp).toBeGreaterThan(0)
    })
  })

  // ========================================================================
  // TEST 6: Comprehensive Audit Execution
  // ========================================================================

  describe('Comprehensive Audit Execution', () => {
    it('Runs full audit across all frameworks', async () => {
      const auditData = {
        gdpr: {
          'consent-logs': { logged: true },
          'encryption-config': { enabled: true }
        },
        hipaa: {
          accessLogs: { available: true },
          encryptionConfig: { enabled: true }
        },
        soc2: {
          accessPolicy: { defined: true },
          configurations: { reviewed: true }
        },
        iso27001: {
          policies: { documented: true },
          riskRegister: { maintained: true }
        },
        pciDss: {
          networkConfig: { segmented: true },
          encryptionConfig: { enabled: true }
        },
        dataProtection: {
          encAtRest: true,
          encInTransit: true,
          dlpEnabled: true,
          breachResponseHours: 24
        },
        accessControl: {
          rbacImplemented: true,
          mfaEnabled: true,
          zeroTrustControls: 0.9
        },
        incidentResponse: {
          planRating: 0.95,
          mttrMs: 1800000,
          trainingScore: 0.9,
          testsPerYear: 4
        },
        supplyChain: {
          slsaLevel: 3,
          sbom: { generated: true },
          dependencies: [{ vulnerable: false }],
          codeQuality: 0.9
        }
      }

      const result = await runComprehensiveAudit('Test Org', auditData)
      expect(result.auditId).toBeDefined()
      expect(result.organization).toBe('Test Org')
      expect(result.assessment).toBeDefined()
      expect(result.assessment.gdpr).toBeDefined()
      expect(result.assessment.hipaa).toBeDefined()
      expect(result.assessment.equilibrium).toBeDefined()
      expect(result.report).toBeDefined()
      expect(result.report.summary).toBeDefined()
      expect(result.report.summary.overallScore).toBeGreaterThan(0)
      expect(result.report.signatureProof).toContain('audit-proof')
    })

    it('Comprehensive audit detects gaps', async () => {
      const auditData = {
        gdpr: {},
        hipaa: {},
        dataProtection: {
          encAtRest: false,
          encInTransit: false,
          dlpEnabled: false,
          breachResponseHours: 168
        }
      }

      const result = await runComprehensiveAudit('At-Risk Org', auditData)
      expect(result.report.summary.overallScore).toBeLessThan(50)
      expect(result.report.frameworks.some((f: any) => f.status === 'review')).toBe(true)
    })
  })
})

describe('Audit Integration with QPU Systems', () => {
  it('Audit operations are quantum-secure (RBAC enforced)', () => {
    Object.values(auditOps).forEach((op: any) => {
      expect(op.requiredRole).toBeDefined()
      expect(['admin', 'auditor']).toContain(op.requiredRole)
    })
  })

  it('All operations have handler implementations', () => {
    Object.values(auditOps).forEach((op: any) => {
      expect(op.handler).toBeDefined()
      expect(typeof op.handler).toBe('function')
    })
  })

  it('Audit formulas support vector equilibrium', () => {
    const octants = {
      governance: 0.92,
      identity: 0.88,
      dataProtection: 0.95,
      infrastructure: 0.90,
      applications: 0.87,
      monitoring: 0.93,
      incidentResponse: 0.89,
      supplyChain: 0.91
    }
    const eq = vectorEquilibriumAudit.computeEquilibrium(octants)
    expect(eq.stability).toBe('harmonious')
    expect(eq.harmony).toBeGreaterThan(0.85)
  })
})
