/**
 * Compliance Dashboard - Real-time compliance metrics and audit trails
 */

export interface ComplianceMetric {
  name: string
  current: number
  target: number
  trend: 'up' | 'down' | 'stable'
  timestamp: Date
}

export interface AuditLogEntry {
  id: string
  timestamp: Date
  action: string
  actor: string
  resource: string
  status: 'success' | 'failure' | 'pending'
  details: Record<string, unknown>
}

export interface SecurityEvent {
  id: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  type: string
  description: string
  timestamp: Date
  resolved: boolean
}

export interface CertificationStatus {
  name: 'SOC 2' | 'GDPR' | 'HIPAA' | 'FIPS 140-2' | 'ISO 27001'
  status: 'pending' | 'in-progress' | 'passed' | 'failed'
  expiryDate?: Date
  findings: number
  lastAudit: Date
}

export class ComplianceDashboard {
  private metrics: ComplianceMetric[] = []
  private auditLog: AuditLogEntry[] = []
  private securityEvents: SecurityEvent[] = []
  private certifications: CertificationStatus[] = []

  constructor() {
    this.initializeMetrics()
    this.initializeCertifications()
  }

  private initializeMetrics(): void {
    this.metrics = [
      {
        name: 'Code Security Score',
        current: 92,
        target: 95,
        trend: 'up',
        timestamp: new Date()
      },
      {
        name: 'Encryption Compliance',
        current: 100,
        target: 100,
        trend: 'stable',
        timestamp: new Date()
      },
      {
        name: 'Audit Trail Coverage',
        current: 98,
        target: 100,
        trend: 'up',
        timestamp: new Date()
      },
      {
        name: 'Data Handling Compliance',
        current: 96,
        target: 100,
        trend: 'up',
        timestamp: new Date()
      },
      {
        name: 'Access Control Compliance',
        current: 99,
        target: 100,
        trend: 'stable',
        timestamp: new Date()
      }
    ]
  }

  private initializeCertifications(): void {
    this.certifications = [
      {
        name: 'SOC 2',
        status: 'in-progress',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        findings: 3,
        lastAudit: new Date()
      },
      {
        name: 'GDPR',
        status: 'passed',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        findings: 0,
        lastAudit: new Date()
      },
      {
        name: 'HIPAA',
        status: 'pending',
        findings: 12,
        lastAudit: new Date()
      },
      {
        name: 'FIPS 140-2',
        status: 'in-progress',
        findings: 2,
        lastAudit: new Date()
      },
      {
        name: 'ISO 27001',
        status: 'pending',
        findings: 5,
        lastAudit: new Date()
      }
    ]
  }

  recordAuditLog(entry: Omit<AuditLogEntry, 'id'>): void {
    this.auditLog.push({
      id: `audit-${Date.now()}`,
      ...entry
    })

    // Keep last 10,000 entries
    if (this.auditLog.length > 10000) {
      this.auditLog = this.auditLog.slice(-9000)
    }
  }

  recordSecurityEvent(event: Omit<SecurityEvent, 'id'>): void {
    this.securityEvents.push({
      id: `event-${Date.now()}`,
      ...event
    })
  }

  getComplianceOverview() {
    const averageScore = this.metrics.reduce((sum, m) => sum + m.current, 0) / this.metrics.length
    const allTargetsMet = this.metrics.every(m => m.current >= m.target)
    const criticalIssues = this.securityEvents.filter(e => e.severity === 'critical' && !e.resolved)

    return {
      overallScore: Math.round(averageScore),
      targetsMet: allTargetsMet,
      metrics: this.metrics,
      certifications: this.certifications,
      criticalIssues: criticalIssues.length,
      auditLogEntries: this.auditLog.length,
      lastUpdate: new Date()
    }
  }

  getAuditTrail(filter?: { actor?: string; action?: string; status?: string }) {
    let entries = this.auditLog

    if (filter?.actor) {
      entries = entries.filter(e => e.actor === filter.actor)
    }
    if (filter?.action) {
      entries = entries.filter(e => e.action === filter.action)
    }
    if (filter?.status) {
      entries = entries.filter(e => e.status === filter.status)
    }

    return entries.slice(-100) // Return last 100 entries
  }

  getSecurityDashboard() {
    const events = this.securityEvents.slice(-50)
    const bySeverity = {
      critical: events.filter(e => e.severity === 'critical').length,
      high: events.filter(e => e.severity === 'high').length,
      medium: events.filter(e => e.severity === 'medium').length,
      low: events.filter(e => e.severity === 'low').length
    }

    return {
      recentEvents: events,
      bySeverity,
      unresolved: events.filter(e => !e.resolved),
      trend: events.filter(e => !e.resolved).length <= 5 ? 'improving' : 'degrading'
    }
  }

  getCertificationStatus() {
    return {
      certifications: this.certifications,
      fullyCompliant: this.certifications.filter(c => c.status === 'passed').length,
      inProgress: this.certifications.filter(c => c.status === 'in-progress').length,
      pending: this.certifications.filter(c => c.status === 'pending').length,
      upcomingExpiry: this.certifications.filter(c => {
        if (!c.expiryDate) return false
        const daysUntil = (c.expiryDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)
        return daysUntil <= 90
      })
    }
  }

  exportComplianceReport(format: 'json' | 'csv' | 'pdf'): string {
    const overview = this.getComplianceOverview()
    const audit = this.getAuditTrail()
    const security = this.getSecurityDashboard()
    const certifications = this.getCertificationStatus()

    const report = {
      generatedAt: new Date().toISOString(),
      overview,
      auditTrail: audit,
      securityEvents: security,
      certifications,
      recommendations: this.generateRecommendations()
    }

    if (format === 'json') {
      return JSON.stringify(report, null, 2)
    } else if (format === 'csv') {
      return this.toCSV(report)
    } else {
      return `[PDF Format - ${JSON.stringify(report)}]`
    }
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = []

    // Analyze metrics
    const lowMetrics = this.metrics.filter(m => m.current < m.target)
    if (lowMetrics.length > 0) {
      recommendations.push(`Address metrics below target: ${lowMetrics.map(m => m.name).join(', ')}`)
    }

    // Check certifications
    const unfinished = this.certifications.filter(c => c.status !== 'passed')
    if (unfinished.length > 0) {
      recommendations.push(`Complete pending certifications: ${unfinished.map(c => c.name).join(', ')}`)
    }

    // Security events
    const unresolved = this.securityEvents.filter(e => !e.resolved)
    if (unresolved.length > 0) {
      recommendations.push(`Resolve ${unresolved.length} unresolved security events`)
    }

    return recommendations
  }

  private toCSV(report: unknown): string {
    // Simple CSV generation
    return JSON.stringify(report)
      .split(',')
      .join('\n')
  }
}

export const complianceDashboard = new ComplianceDashboard()
