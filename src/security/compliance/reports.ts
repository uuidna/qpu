// WAVE 8D: Compliance Reporting
// Multi-standard compliance reports, audit summaries, remediation tracking

import { GDPRComplianceService } from './gdpr'
import { HIPAAComplianceService } from './hipaa'

/**
 * Compliance standard
 */
export enum ComplianceStandard {
  GDPR = 'gdpr',
  HIPAA = 'hipaa',
  SOC2 = 'soc2',
  ISO27001 = 'iso27001',
  PCI_DSS = 'pci_dss',
  CCPA = 'ccpa'
}

/**
 * Compliance report
 */
export interface ComplianceReport {
  id: string
  standard: ComplianceStandard
  generatedAt: Date
  period: { startDate: Date; endDate: Date }
  overallCompliance: number
  sections: ComplianceSection[]
  recommendations: string[]
  signedBy?: string
  nextReviewDate?: Date
}

/**
 * Compliance section
 */
export interface ComplianceSection {
  name: string
  controlId: string
  status: 'compliant' | 'non_compliant' | 'partial' | 'not_applicable'
  findings: string[]
  evidence: string[]
  remediationRequired?: string
  remediationDeadline?: Date
}

/**
 * Remediation item
 */
export interface RemediationItem {
  id: string
  findingId: string
  title: string
  description: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'open' | 'in_progress' | 'completed' | 'deferred'
  owner: string
  deadline: Date
  completedAt?: Date
  evidence?: string
}

/**
 * Compliance Reports Service
 */
export class ComplianceReportsService {
  private reports: Map<string, ComplianceReport> = new Map()
  private remediationItems: Map<string, RemediationItem> = new Map()
  private controlMappings: Map<string, ControlDefinition[]> = new Map()

  constructor(
    private gdprService: GDPRComplianceService,
    private hipaaService: HIPAAComplianceService
  ) {
    this.initializeControlMappings()
  }

  /**
   * Initialize control mappings for standards
   */
  private initializeControlMappings(): void {
    // GDPR controls
    this.controlMappings.set(ComplianceStandard.GDPR, [
      {
        id: 'GDPR-1',
        name: 'Lawful basis for processing',
        description: 'Ensure processing has valid lawful basis'
      },
      {
        id: 'GDPR-2',
        name: 'Consent management',
        description: 'Valid, freely given, specific, informed, and unambiguous consent'
      },
      {
        id: 'GDPR-3',
        name: 'Data subject rights',
        description: 'Implementation of all GDPR rights (access, erasure, portability, etc.)'
      },
      {
        id: 'GDPR-4',
        name: 'Data Protection Impact Assessment',
        description: 'DPIA for high-risk processing'
      },
      {
        id: 'GDPR-5',
        name: 'Data breach notification',
        description: 'Timely notification to authorities and data subjects'
      },
      {
        id: 'GDPR-6',
        name: 'Privacy by design',
        description: 'Privacy considerations in all processing'
      },
      {
        id: 'GDPR-7',
        name: 'Data retention',
        description: 'Data kept only as long as necessary'
      }
    ])

    // HIPAA controls
    this.controlMappings.set(ComplianceStandard.HIPAA, [
      {
        id: 'HIPAA-1',
        name: 'Access controls',
        description: 'Unique user IDs, emergency access procedures, and accountability'
      },
      {
        id: 'HIPAA-2',
        name: 'Audit and accountability',
        description: 'Audit controls and logs for all PHI access'
      },
      {
        id: 'HIPAA-3',
        name: 'Integrity controls',
        description: 'Mechanisms to ensure PHI is not improperly altered'
      },
      {
        id: 'HIPAA-4',
        name: 'Transmission security',
        description: 'Encryption and secure transmission of PHI'
      },
      {
        id: 'HIPAA-5',
        name: 'Business Associate Agreements',
        description: 'Valid BAAs with all service providers'
      },
      {
        id: 'HIPAA-6',
        name: 'Breach notification',
        description: 'Timely notification following security incidents'
      },
      {
        id: 'HIPAA-7',
        name: 'Minimum necessary',
        description: 'Access limited to minimum necessary information'
      },
      {
        id: 'HIPAA-8',
        name: 'De-identification',
        description: 'Proper de-identification standards applied'
      }
    ])
  }

  /**
   * Generate GDPR compliance report
   */
  generateGDPRReport(period: { startDate: Date; endDate: Date }): ComplianceReport {
    const gdprStatus = this.gdprService.generateComplianceReport()

    const sections: ComplianceSection[] = [
      {
        name: 'Lawful Basis',
        controlId: 'GDPR-1',
        status: gdprStatus.consentRate > 80 ? 'compliant' : 'non_compliant',
        findings: [`Consent rate: ${gdprStatus.consentRate.toFixed(2)}%`],
        evidence: ['Consent records audit trail', 'Processing activities register']
      },
      {
        name: 'Data Subject Rights',
        controlId: 'GDPR-3',
        status: gdprStatus.pendingRequests > 0 ? 'partial' : 'compliant',
        findings: [
          `Total data subjects: ${gdprStatus.totalDataSubjects}`,
          `Deleted data subjects: ${gdprStatus.deletedDataSubjects}`,
          `Pending requests: ${gdprStatus.pendingRequests}`
        ],
        evidence: ['GDPR request tracking system', 'Deletion audit trails']
      },
      {
        name: 'Data Retention',
        controlId: 'GDPR-7',
        status:
          gdprStatus.dataRetentionCompliance > 90 ? 'compliant' : 'non_compliant',
        findings: [`Data retention compliance: ${gdprStatus.dataRetentionCompliance.toFixed(2)}%`],
        evidence: ['Retention policies', 'Automated deletion logs'],
        remediationRequired:
          gdprStatus.dataRetentionCompliance <= 90
            ? 'Review and improve data retention procedures'
            : undefined
      }
    ]

    const overallCompliance =
      (gdprStatus.consentRate + gdprStatus.dataRetentionCompliance) / 2

    const report: ComplianceReport = {
      id: 'report-' + Date.now(),
      standard: ComplianceStandard.GDPR,
      generatedAt: new Date(),
      period,
      overallCompliance,
      sections,
      recommendations: [
        'Review consent mechanisms quarterly',
        'Implement automated data retention checks',
        'Train staff on GDPR requirements',
        'Document processing activities'
      ]
    }

    this.reports.set(report.id, report)
    return report
  }

  /**
   * Generate HIPAA compliance report
   */
  generateHIPAAReport(period: { startDate: Date; endDate: Date }): ComplianceReport {
    const hipaaStatus = this.hipaaService.generateComplianceReport()
    const accessAudit = this.hipaaService.auditAccessControls(90)

    const sections: ComplianceSection[] = [
      {
        name: 'Access Controls',
        controlId: 'HIPAA-1',
        status: accessAudit.suspiciousPatterns.length === 0 ? 'compliant' : 'non_compliant',
        findings: accessAudit.suspiciousPatterns,
        evidence: ['Access control logs', 'User authentication records']
      },
      {
        name: 'Audit and Accountability',
        controlId: 'HIPAA-2',
        status: 'compliant',
        findings: [
          `Total authorized accesses: ${accessAudit.authorizedAccesses}`,
          `Denied accesses: ${accessAudit.deniedAccesses}`
        ],
        evidence: ['PHI access audit logs']
      },
      {
        name: 'Business Associate Agreements',
        controlId: 'HIPAA-5',
        status:
          hipaaStatus.baaComplianceRate > 90 ? 'compliant' : 'non_compliant',
        findings: [`BAA compliance rate: ${hipaaStatus.baaComplianceRate.toFixed(2)}%`],
        evidence: ['Signed BAAs', 'BAA review documentation'],
        remediationRequired:
          hipaaStatus.baaComplianceRate <= 90
            ? 'Update expired Business Associate Agreements'
            : undefined
      },
      {
        name: 'Breach Notification',
        controlId: 'HIPAA-6',
        status:
          hipaaStatus.unreportedBreaches === 0 ? 'compliant' : 'non_compliant',
        findings: [
          `Total breaches: ${hipaaStatus.breachCount}`,
          `Unreported breaches: ${hipaaStatus.unreportedBreaches}`
        ],
        evidence: ['Breach logs', 'Notification records']
      }
    ]

    const overallCompliance =
      (accessAudit.authorizedAccesses /
        (accessAudit.totalAccessAttempts || 1)) *
      100

    const report: ComplianceReport = {
      id: 'report-' + Date.now(),
      standard: ComplianceStandard.HIPAA,
      generatedAt: new Date(),
      period,
      overallCompliance,
      sections,
      recommendations: hipaaStatus.recommendations
    }

    this.reports.set(report.id, report)
    return report
  }

  /**
   * Create remediation item
   */
  createRemediationItem(
    findingId: string,
    title: string,
    description: string,
    priority: 'critical' | 'high' | 'medium' | 'low',
    owner: string,
    deadline: Date
  ): RemediationItem {
    const item: RemediationItem = {
      id: 'rem-' + Date.now() + '-' + Math.random().toString(36).substring(7),
      findingId,
      title,
      description,
      priority,
      status: 'open',
      owner,
      deadline
    }

    this.remediationItems.set(item.id, item)
    return item
  }

  /**
   * Update remediation status
   */
  updateRemediationStatus(
    remediationId: string,
    status: 'open' | 'in_progress' | 'completed' | 'deferred',
    evidence?: string
  ): RemediationItem | null {
    const item = this.remediationItems.get(remediationId)
    if (!item) return null

    item.status = status
    if (status === 'completed') {
      item.completedAt = new Date()
      item.evidence = evidence
    }

    return item
  }

  /**
   * Get overdue remediation items
   */
  getOverdueRemediations(): RemediationItem[] {
    const now = new Date()
    return Array.from(this.remediationItems.values()).filter(
      (item) =>
        item.status !== 'completed' &&
        item.status !== 'deferred' &&
        item.deadline < now
    )
  }

  /**
   * Get remediation summary
   */
  getRemediationSummary(): {
    totalItems: number
    openItems: number
    inProgressItems: number
    completedItems: number
    overdueItems: number
    criticalOpenItems: number
  } {
    const items = Array.from(this.remediationItems.values())
    const now = new Date()

    return {
      totalItems: items.length,
      openItems: items.filter((i) => i.status === 'open').length,
      inProgressItems: items.filter((i) => i.status === 'in_progress').length,
      completedItems: items.filter((i) => i.status === 'completed').length,
      overdueItems: items.filter((i) => i.status !== 'completed' && i.deadline < now).length,
      criticalOpenItems: items.filter(
        (i) =>
          i.priority === 'critical' &&
          i.status !== 'completed'
      ).length
    }
  }

  /**
   * Export compliance report
   */
  exportReportToJSON(reportId: string): string {
    const report = this.reports.get(reportId)
    if (!report) {
      throw new Error('Report not found')
    }

    return JSON.stringify(report, null, 2)
  }

  /**
   * Export compliance report to CSV
   */
  exportReportToCSV(reportId: string): string {
    const report = this.reports.get(reportId)
    if (!report) {
      throw new Error('Report not found')
    }

    let csv = `Compliance Report: ${report.standard}\n`
    csv += `Generated: ${report.generatedAt.toISOString()}\n`
    csv += `Overall Compliance: ${report.overallCompliance.toFixed(2)}%\n\n`
    csv += 'Control ID,Name,Status,Findings,Evidence\n'

    for (const section of report.sections) {
      const findings = section.findings.join(';')
      const evidence = section.evidence.join(';')
      csv += `"${section.controlId}","${section.name}","${section.status}","${findings}","${evidence}"\n`
    }

    return csv
  }

  /**
   * Get all reports
   */
  getAllReports(): ComplianceReport[] {
    return Array.from(this.reports.values()).sort(
      (a, b) => b.generatedAt.getTime() - a.generatedAt.getTime()
    )
  }

  /**
   * Get reports by standard
   */
  getReportsByStandard(standard: ComplianceStandard): ComplianceReport[] {
    return Array.from(this.reports.values())
      .filter((r) => r.standard === standard)
      .sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime())
  }

  /**
   * Get compliance trend
   */
  getComplianceTrend(
    standard: ComplianceStandard,
    days: number = 90
  ): Array<{ date: Date; compliance: number }> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    return Array.from(this.reports.values())
      .filter((r) => r.standard === standard && r.generatedAt >= cutoffDate)
      .sort((a, b) => a.generatedAt.getTime() - b.generatedAt.getTime())
      .map((r) => ({
        date: r.generatedAt,
        compliance: r.overallCompliance
      }))
  }
}

/**
 * Control definition
 */
interface ControlDefinition {
  id: string
  name: string
  description: string
}

/**
 * Create compliance reports service
 */
export const createComplianceReportsService = (
  gdprService: GDPRComplianceService,
  hipaaService: HIPAAComplianceService
): ComplianceReportsService => {
  return new ComplianceReportsService(gdprService, hipaaService)
}
