/**
 * Certification Portal - SOC 2, ISO, GDPR compliance tracking and certificate storage
 */

export interface CertificationAudit {
  id: string
  certificationName: string
  startDate: Date
  endDate?: Date
  status: 'planning' | 'in-progress' | 'passed' | 'failed'
  findings: AuditFinding[]
  auditor: string
  reportUrl?: string
}

export interface AuditFinding {
  id: string
  category: string
  severity: 'critical' | 'major' | 'minor'
  description: string
  remediation: string
  status: 'open' | 'in-progress' | 'resolved'
  dueDate?: Date
}

export interface ComplianceCertificate {
  id: string
  certificationName: string
  issueDate: Date
  expiryDate: Date
  scope: string
  certificateUrl: string
  auditReport?: string
}

export interface ComplianceFramework {
  name: string
  description: string
  requirements: number
  meetsRequirements: number
  status: 'not-started' | 'in-progress' | 'compliant' | 'non-compliant'
  lastAssessment: Date
  nextAssessment: Date
}

export class CertificationPortal {
  private audits: Map<string, CertificationAudit> = new Map()
  private certificates: Map<string, ComplianceCertificate> = new Map()
  private frameworks: Map<string, ComplianceFramework> = new Map()

  constructor() {
    this.initializeFrameworks()
  }

  private initializeFrameworks(): void {
    const frameworks: ComplianceFramework[] = [
      {
        name: 'SOC 2 Type II',
        description: 'Security, Availability, Processing Integrity, Confidentiality, Privacy',
        requirements: 47,
        meetsRequirements: 45,
        status: 'in-progress',
        lastAssessment: new Date(),
        nextAssessment: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      },
      {
        name: 'ISO 27001',
        description: 'Information Security Management System',
        requirements: 114,
        meetsRequirements: 110,
        status: 'in-progress',
        lastAssessment: new Date(),
        nextAssessment: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      },
      {
        name: 'GDPR',
        description: 'General Data Protection Regulation',
        requirements: 99,
        meetsRequirements: 99,
        status: 'compliant',
        lastAssessment: new Date(),
        nextAssessment: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      },
      {
        name: 'HIPAA',
        description: 'Health Insurance Portability and Accountability Act',
        requirements: 18,
        meetsRequirements: 12,
        status: 'in-progress',
        lastAssessment: new Date(),
        nextAssessment: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
      },
      {
        name: 'FIPS 140-2',
        description: 'Federal Information Processing Standards',
        requirements: 11,
        meetsRequirements: 11,
        status: 'compliant',
        lastAssessment: new Date(),
        nextAssessment: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      },
      {
        name: 'PCI DSS',
        description: 'Payment Card Industry Data Security Standard',
        requirements: 12,
        meetsRequirements: 10,
        status: 'in-progress',
        lastAssessment: new Date(),
        nextAssessment: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    ]

    frameworks.forEach(fw => {
      this.frameworks.set(fw.name, fw)
    })
  }

  initiateAudit(certificationName: string, auditor: string): CertificationAudit {
    const audit: CertificationAudit = {
      id: `audit-${Date.now()}`,
      certificationName,
      startDate: new Date(),
      status: 'planning',
      findings: [],
      auditor
    }

    this.audits.set(audit.id, audit)
    return audit
  }

  addFinding(auditId: string, finding: Omit<AuditFinding, 'id'>): CertificationAudit | null {
    const audit = this.audits.get(auditId)
    if (!audit) return null

    audit.findings.push({
      id: `finding-${Date.now()}`,
      ...finding
    })

    return audit
  }

  resolveFinding(auditId: string, findingId: string, resolution: string): CertificationAudit | null {
    const audit = this.audits.get(auditId)
    if (!audit) return null

    const finding = audit.findings.find(f => f.id === findingId)
    if (finding) {
      finding.status = 'resolved'
    }

    return audit
  }

  completeAudit(auditId: string, passed: boolean, reportUrl?: string): CertificationAudit | null {
    const audit = this.audits.get(auditId)
    if (!audit) return null

    audit.status = passed ? 'passed' : 'failed'
    audit.endDate = new Date()
    audit.reportUrl = reportUrl

    if (passed) {
      this.issueCertificate(audit.certificationName, audit.auditor)
    }

    return audit
  }

  private issueCertificate(certificationName: string, auditor: string): ComplianceCertificate {
    const cert: ComplianceCertificate = {
      id: `cert-${Date.now()}`,
      certificationName,
      issueDate: new Date(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      scope: 'UUIDNA QPU Platform - All Services',
      certificateUrl: `https://certs.uuidna.com/${Date.now()}.pem`
    }

    this.certificates.set(cert.id, cert)

    // Update framework status
    const framework = this.frameworks.get(certificationName)
    if (framework) {
      framework.status = 'compliant'
      framework.lastAssessment = new Date()
    }

    return cert
  }

  getCertificationStatus(): {
    certifications: ComplianceCertificate[]
    frameworks: ComplianceFramework[]
    completeness: number
    nextAudit: Date
  } {
    const certifications = Array.from(this.certificates.values())
    const frameworks = Array.from(this.frameworks.values())

    const completeness = frameworks.length > 0
      ? Math.round(
          (frameworks.reduce((sum, f) => sum + f.meetsRequirements, 0) /
            frameworks.reduce((sum, f) => sum + f.requirements, 0)) *
            100
        )
      : 0

    const nextAudit = Math.min(
      ...frameworks.map(f => f.nextAssessment.getTime())
    )
      ? new Date(Math.min(...frameworks.map(f => f.nextAssessment.getTime())))
      : new Date()

    return {
      certifications,
      frameworks,
      completeness,
      nextAudit
    }
  }

  getAuditHistory(limit: number = 20): CertificationAudit[] {
    return Array.from(this.audits.values())
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
      .slice(0, limit)
  }

  getComplianceScore(): {
    overall: number
    byFramework: Record<string, number>
    gaps: string[]
  } {
    const frameworks = Array.from(this.frameworks.values())
    const overall = frameworks.length > 0
      ? Math.round(
          frameworks.reduce((sum, f) => sum + (f.meetsRequirements / f.requirements) * 100, 0) /
            frameworks.length
        )
      : 0

    const byFramework: Record<string, number> = {}
    frameworks.forEach(f => {
      byFramework[f.name] = Math.round((f.meetsRequirements / f.requirements) * 100)
    })

    const gaps: string[] = []
    frameworks.forEach(f => {
      if (f.status !== 'compliant') {
        gaps.push(`${f.name}: ${f.requirements - f.meetsRequirements} requirements not met`)
      }
    })

    return { overall, byFramework, gaps }
  }

  generateComplianceReport(): string {
    const status = this.getCertificationStatus()
    const score = this.getComplianceScore()

    const lines: string[] = []
    lines.push('# Compliance Status Report')
    lines.push('')
    lines.push(`**Generated**: ${new Date().toISOString().split('T')[0]}`)
    lines.push(`**Overall Compliance**: ${score.overall}%`)
    lines.push('')

    lines.push('## Active Certifications')
    status.certifications.forEach(cert => {
      lines.push(
        `- **${cert.certificationName}**: Valid until ${cert.expiryDate.toISOString().split('T')[0]}`
      )
    })
    lines.push('')

    lines.push('## Framework Status')
    status.frameworks.forEach(fw => {
      const percent = Math.round((fw.meetsRequirements / fw.requirements) * 100)
      lines.push(
        `- **${fw.name}**: ${fw.meetsRequirements}/${fw.requirements} (${percent}%) - ${fw.status}`
      )
    })
    lines.push('')

    if (score.gaps.length > 0) {
      lines.push('## Compliance Gaps')
      score.gaps.forEach(gap => {
        lines.push(`- ${gap}`)
      })
      lines.push('')
    }

    lines.push(`## Next Audit: ${status.nextAudit.toISOString().split('T')[0]}`)

    return lines.join('\n')
  }

  renewCertificate(certificateId: string): ComplianceCertificate | null {
    const cert = this.certificates.get(certificateId)
    if (!cert) return null

    const newCert: ComplianceCertificate = {
      ...cert,
      id: `cert-${Date.now()}`,
      issueDate: new Date(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    }

    this.certificates.set(newCert.id, newCert)
    return newCert
  }
}

export const certificationPortal = new CertificationPortal()
