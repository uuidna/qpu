/**
 * Seed Data Validator
 * Ensures all seed data matches collection schemas and test fixtures
 */

import { usersSeed } from '../seeds/users.seed'
import { complianceIssuesSeed } from '../seeds/compliance-issues.seed'
import { auditLogsSeed } from '../seeds/audit-logs.seed'
import { supportTicketsSeed } from '../seeds/support-tickets.seed'
import { enrollmentsSeed } from '../seeds/enrollments.seed'
import { metricsSeed } from '../seeds/metrics.seed'
import { certificationsSeed } from '../seeds/certifications.seed'

interface ValidationResult {
  collection: string
  valid: boolean
  recordsChecked: number
  errors: string[]
}

/**
 * Validate all seeds against expected schema
 */
export function validateAllSeeds(): ValidationResult[] {
  const results: ValidationResult[] = []

  results.push(validateUsersSeed())
  results.push(validateComplianceIssuesSeed())
  results.push(validateAuditLogsSeed())
  results.push(validateSupportTicketsSeed())
  results.push(validateEnrollmentsSeed())
  results.push(validateMetricsSeed())
  results.push(validateCertificationsSeed())

  return results
}

function validateUsersSeed(): ValidationResult {
  const errors: string[] = []

  usersSeed.forEach((user, idx) => {
    if (!user.email) errors.push(`User ${idx}: missing email`)
    if (!user.name) errors.push(`User ${idx}: missing name`)
    if (!['admin', 'support', 'auditor', 'trainer', 'user'].includes(user.role)) {
      errors.push(`User ${idx}: invalid role ${user.role}`)
    }
  })

  return {
    collection: 'users',
    valid: errors.length === 0,
    recordsChecked: usersSeed.length,
    errors,
  }
}

function validateComplianceIssuesSeed(): ValidationResult {
  const errors: string[] = []

  complianceIssuesSeed.forEach((issue, idx) => {
    if (!['critical', 'high', 'medium', 'low', 'info'].includes(issue.severity)) {
      errors.push(`Issue ${idx}: invalid severity ${issue.severity}`)
    }
    if (!issue.type) errors.push(`Issue ${idx}: missing type`)
    if (!issue.description) errors.push(`Issue ${idx}: missing description`)
  })

  return {
    collection: 'compliance-issues',
    valid: errors.length === 0,
    recordsChecked: complianceIssuesSeed.length,
    errors,
  }
}

function validateAuditLogsSeed(): ValidationResult {
  const errors: string[] = []

  auditLogsSeed.forEach((log, idx) => {
    if (!log.timestamp) errors.push(`AuditLog ${idx}: missing timestamp`)
    if (!['deploy', 'access', 'modify', 'delete', 'export'].includes(log.action)) {
      errors.push(`AuditLog ${idx}: invalid action ${log.action}`)
    }
    if (!['success', 'failure', 'pending'].includes(log.status)) {
      errors.push(`AuditLog ${idx}: invalid status ${log.status}`)
    }
  })

  return {
    collection: 'audit-logs',
    valid: errors.length === 0,
    recordsChecked: auditLogsSeed.length,
    errors,
  }
}

function validateSupportTicketsSeed(): ValidationResult {
  const errors: string[] = []

  supportTicketsSeed.forEach((ticket, idx) => {
    if (!ticket.subject) errors.push(`Ticket ${idx}: missing subject`)
    if (!['low', 'medium', 'high', 'critical'].includes(ticket.priority)) {
      errors.push(`Ticket ${idx}: invalid priority ${ticket.priority}`)
    }
    if (!ticket.requester?.email) errors.push(`Ticket ${idx}: missing requester email`)
  })

  return {
    collection: 'support-tickets',
    valid: errors.length === 0,
    recordsChecked: supportTicketsSeed.length,
    errors,
  }
}

function validateEnrollmentsSeed(): ValidationResult {
  const errors: string[] = []

  enrollmentsSeed.forEach((enrollment, idx) => {
    if (!enrollment.courseId) errors.push(`Enrollment ${idx}: missing courseId`)
    if (enrollment.progress < 0 || enrollment.progress > 100) {
      errors.push(`Enrollment ${idx}: progress out of range ${enrollment.progress}`)
    }
    if (!['enrolled', 'in-progress', 'completed', 'dropped'].includes(enrollment.status)) {
      errors.push(`Enrollment ${idx}: invalid status ${enrollment.status}`)
    }
  })

  return {
    collection: 'enrollments',
    valid: errors.length === 0,
    recordsChecked: enrollmentsSeed.length,
    errors,
  }
}

function validateMetricsSeed(): ValidationResult {
  const errors: string[] = []

  metricsSeed.forEach((metric, idx) => {
    if (!metric.name) errors.push(`Metric ${idx}: missing name`)
    if (typeof metric.value !== 'number') errors.push(`Metric ${idx}: value not a number`)
    if (metric.status && !['healthy', 'warning', 'critical'].includes(metric.status)) {
      errors.push(`Metric ${idx}: invalid status ${metric.status}`)
    }
  })

  return {
    collection: 'metrics',
    valid: errors.length === 0,
    recordsChecked: metricsSeed.length,
    errors,
  }
}

function validateCertificationsSeed(): ValidationResult {
  const errors: string[] = []

  certificationsSeed.forEach((cert, idx) => {
    if (!cert.framework) errors.push(`Certification ${idx}: missing framework`)
    if (!['planning', 'in-progress', 'review', 'completed', 'expired'].includes(cert.status)) {
      errors.push(`Certification ${idx}: invalid status ${cert.status}`)
    }
    if (cert.completeness < 0 || cert.completeness > 100) {
      errors.push(`Certification ${idx}: completeness out of range ${cert.completeness}`)
    }
  })

  return {
    collection: 'certifications',
    valid: errors.length === 0,
    recordsChecked: certificationsSeed.length,
    errors,
  }
}

/**
 * Print validation report
 */
export function printValidationReport(results: ValidationResult[]): void {
  console.log('\n📊 Payload CMS Seed Validation Report')
  console.log('=====================================\n')

  const totalRecords = results.reduce((sum, r) => sum + r.recordsChecked, 0)
  const validCollections = results.filter(r => r.valid).length
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0)

  results.forEach(result => {
    const status = result.valid ? '✅' : '❌'
    console.log(`${status} ${result.collection}: ${result.recordsChecked} records`)
    if (result.errors.length > 0) {
      result.errors.forEach(error => console.log(`   - ${error}`))
    }
  })

  console.log(`\n📈 Summary:`)
  console.log(`   - Total collections: ${results.length}`)
  console.log(`   - Valid collections: ${validCollections}`)
  console.log(`   - Total records: ${totalRecords}`)
  console.log(`   - Total errors: ${totalErrors}`)
  console.log()
}
