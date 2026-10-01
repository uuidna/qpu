/**
 * QPU Comprehensive Audit System - Export Index
 *
 * Fuses Legal Compliance APIs + Industry Standards + Distributed Intelligence
 * All operations quantum-secure (RBAC) and vector-equilibrium balanced
 */

export { LegalComplianceAPI, IndustryStandardsAPI, legalAPI, standardsAPI } from './legal-standards-apis.js'
export type {
  ComplianceFramework,
  ComplianceRequirement,
  StandardsBenchmark,
  BenchmarkControl
} from './legal-standards-apis.js'

export {
  VectorEquilibriumAudit,
  AuditFormulas,
  vectorEquilibriumAudit,
  auditFormulas
} from './audit-formulas.js'
export type { AuditFramework, AuditControl, AuditResult } from './audit-formulas.js'

export { auditOperations, auditOps } from './audit-operations.js'
export type { AuditOperation } from './audit-operations.js'

import { auditOps as auditOpsImport } from './audit-operations.js'

// ============================================================================
// QUICK-START AUDIT FUNCTION
// ============================================================================

/**
 * Execute comprehensive audit across all compliance frameworks and standards
 * Returns complete assessment with vector equilibrium analysis and recommendations
 */
export async function runComprehensiveAudit(
  organization: string,
  auditData: Record<string, any>
): Promise<any> {
  const ops = auditOpsImport

  // Initialize audit
  const init = await ops['audit:init'].handler({
    organization,
    scope: ['gdpr', 'hipaa', 'soc2', 'iso27001', 'pci-dss']
  })

  // Run all assessments in parallel
  const [gdpr, hipaa, soc2, iso, pci, equilibrium, supplyChain, dataProtection, access, ir] = await Promise.all([
    ops['audit:gdpr'].handler(auditData.gdpr || {}),
    ops['audit:hipaa'].handler(auditData.hipaa || {}),
    ops['audit:soc2'].handler(auditData.soc2 || {}),
    ops['audit:iso27001'].handler(auditData.iso27001 || {}),
    ops['audit:pci-dss'].handler(auditData.pciDss || {}),
    ops['audit:equilibrium'].handler(auditData),
    ops['audit:supply-chain'].handler(auditData.supplyChain || {}),
    ops['audit:data-protection'].handler(auditData.dataProtection || {}),
    ops['audit:access-control'].handler(auditData.accessControl || {}),
    ops['audit:incident-response'].handler(auditData.incidentResponse || {})
  ])

  // Generate final report
  const report = await ops['audit:report'].handler({
    organization,
    assessments: {
      'audit:gdpr': gdpr,
      'audit:hipaa': hipaa,
      'audit:soc2': soc2,
      'audit:iso27001': iso,
      'audit:pci-dss': pci,
      'audit:equilibrium': equilibrium,
      'audit:supply-chain': supplyChain,
      'audit:data-protection': dataProtection,
      'audit:access-control': access,
      'audit:incident-response': ir
    }
  })

  return {
    auditId: init.auditId,
    organization,
    startTime: init.startTime,
    assessment: {
      gdpr,
      hipaa,
      soc2,
      iso27001: iso,
      pciDss: pci,
      supplyChain,
      dataProtection,
      accessControl: access,
      incidentResponse: ir,
      equilibrium
    },
    report
  }
}

/**
 * List all available audit operations
 */
export function listAuditOperations(): Array<{ id: string; name: string; description: string }> {
  return Object.entries(auditOpsImport).map(([_key, op]: [string, any]) => ({
    id: op.id,
    name: op.name,
    description: op.description
  }))
}
