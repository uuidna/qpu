// WAVE 8D: HIPAA Compliance Module
// Protected Health Information (PHI) handling, audit controls, de-identification

/**
 * HIPAA Protected Health Information (PHI) categories
 */
export enum PHICategory {
  PATIENT_ID = 'patient_id',
  MEDICAL_RECORD = 'medical_record',
  DIAGNOSIS = 'diagnosis',
  MEDICATION = 'medication',
  PROCEDURE = 'procedure',
  VITAL_SIGNS = 'vital_signs',
  LAB_RESULT = 'lab_result',
  APPOINTMENT = 'appointment',
  INSURANCE = 'insurance',
  MENTAL_HEALTH = 'mental_health',
  SUBSTANCE_ABUSE = 'substance_abuse',
  GENETIC = 'genetic'
}

/**
 * HIPAA access roles
 */
export enum HIPAARole {
  PATIENT = 'patient',
  PROVIDER = 'provider',
  BILLING_STAFF = 'billing_staff',
  ADMIN = 'admin',
  RESEARCHER = 'researcher',
  AUDITOR = 'auditor'
}

/**
 * HIPAA compliance status
 */
export enum ComplianceStatus {
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
  IN_REMEDIATION = 'in_remediation',
  UNKNOWN = 'unknown'
}

/**
 * Minimum Necessary standard
 */
export interface MinimumNecessary {
  purpose: string
  requiredFields: string[]
  justification: string
  approvedBy: string
  approvedAt: Date
  expiresAt: Date
}

/**
 * Business Associate Agreement
 */
export interface BusinessAssociateAgreement {
  id: string
  organizationName: string
  signedAt: Date
  expiresAt?: Date
  responsibilities: string[]
  dataHandlingRequirements: string[]
  breachNotificationTerms: string
  auditRights: boolean
  status: 'active' | 'expired' | 'terminated'
}

/**
 * De-identification method
 */
export enum DeIdentificationMethod {
  EXPERT_DETERMINATION = 'expert_determination', // Expert certifies low risk
  SAFE_HARBOR = 'safe_harbor' // Remove 18 specific identifiers
}

/**
 * HIPAA Compliance Service
 */
export class HIPAAComplianceService {
  private phiRecords: Map<string, PHIRecord> = new Map()
  private accessLog: HIPAAAccessLog[] = []
  private businessAssociates: Map<string, BusinessAssociateAgreement> = new Map()
  private minimumNecessaryPolicies: Map<string, MinimumNecessary> = new Map()
  private breaches: HIPAABreach[] = []
  private complianceStatus: ComplianceStatus = ComplianceStatus.UNKNOWN

  /**
   * PHI Record
   */
  private phiRecordsData: Map<string, { categories: PHICategory[]; patientId: string; recordDate: Date }> = new Map()

  /**
   * Register PHI data
   */
  registerPHI(
    recordId: string,
    patientId: string,
    categories: PHICategory[],
    dataOwner: string
  ): void {
    this.phiRecordsData.set(recordId, {
      categories,
      patientId,
      recordDate: new Date()
    })

    this.accessLog.push({
      timestamp: new Date(),
      recordId,
      patientId,
      userId: dataOwner,
      action: 'PHI_REGISTERED',
      purpose: 'Clinical record creation',
      result: 'success'
    })
  }

  /**
   * Access PHI with audit trail
   */
  accessPHI(
    recordId: string,
    userId: string,
    userRole: HIPAARole,
    purpose: string,
    justification: string
  ): boolean {
    const record = this.phiRecordsData.get(recordId)
    if (!record) {
      return false
    }

    // Check Minimum Necessary
    const mnPolicy = this.minimumNecessaryPolicies.get(`${userRole}:${purpose}`)
    if (!mnPolicy) {
      this.logAccessDenied(recordId, userId, purpose, 'No minimum necessary policy found')
      return false
    }

    if (new Date() > mnPolicy.expiresAt) {
      this.logAccessDenied(recordId, userId, purpose, 'Minimum necessary policy expired')
      return false
    }

    // Log successful access
    this.accessLog.push({
      timestamp: new Date(),
      recordId,
      patientId: record.patientId,
      userId,
      action: 'PHI_ACCESSED',
      purpose,
      result: 'success',
      role: userRole,
      justification
    })

    return true
  }

  /**
   * Log access denial
   */
  private logAccessDenied(
    recordId: string,
    userId: string,
    purpose: string,
    reason: string
  ): void {
    const record = this.phiRecordsData.get(recordId)
    this.accessLog.push({
      timestamp: new Date(),
      recordId,
      patientId: record?.patientId || 'unknown',
      userId,
      action: 'PHI_ACCESS_DENIED',
      purpose,
      result: 'failure',
      reason
    })
  }

  /**
   * Define minimum necessary requirement
   */
  defineMinimumNecessary(
    role: HIPAARole,
    purpose: string,
    requiredFields: string[],
    justification: string,
    approvedBy: string,
    daysValid: number = 365
  ): void {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + daysValid)

    const policy: MinimumNecessary = {
      purpose,
      requiredFields,
      justification,
      approvedBy,
      approvedAt: new Date(),
      expiresAt
    }

    this.minimumNecessaryPolicies.set(`${role}:${purpose}`, policy)
  }

  /**
   * Sign Business Associate Agreement
   */
  signBAA(baa: BusinessAssociateAgreement): void {
    this.businessAssociates.set(baa.id, baa)
  }

  /**
   * Get BAA status
   */
  getBAAStatus(baaId: string): BusinessAssociateAgreement | null {
    return this.businessAssociates.get(baaId) || null
  }

  /**
   * Check if organization is authorized business associate
   */
  isAuthorizedBusinessAssociate(organizationName: string): boolean {
    for (const baa of this.businessAssociates.values()) {
      if (
        baa.organizationName === organizationName &&
        baa.status === 'active' &&
        (!baa.expiresAt || baa.expiresAt > new Date())
      ) {
        return true
      }
    }
    return false
  }

  /**
   * Report breach
   */
  reportBreach(
    breachDate: Date,
    affectedPatientCount: number,
    phiTypes: PHICategory[],
    description: string,
    discoveredDate: Date,
    reportedDate: Date
  ): HIPAABreach {
    const breach: HIPAABreach = {
      id: 'breach-' + Date.now() + '-' + Math.random().toString(36).substring(7),
      breachDate,
      discoveredDate,
      reportedDate,
      affectedPatientCount,
      phiTypes,
      description,
      mitigationActions: [],
      status: 'reported',
      notificationSentAt: new Date()
    }

    this.breaches.push(breach)
    return breach
  }

  /**
   * Add mitigation action for breach
   */
  addBreachMitigation(breachId: string, action: string, completedAt: Date): void {
    const breach = this.breaches.find((b) => b.id === breachId)
    if (breach) {
      breach.mitigationActions.push({ action, completedAt })
    }
  }

  /**
   * De-identify using Safe Harbor method
   */
  deidentifySafeHarbor(data: Record<string, any>): Record<string, any> {
    const safeHarborIdentifiers = [
      'name',
      'address',
      'phone_number',
      'email',
      'social_security_number',
      'health_plan_number',
      'account_number',
      'certificate_number',
      'vehicle_identifiers',
      'device_identifiers',
      'ip_address',
      'biometric_identifiers',
      'full_face_photos',
      'unique_identifying_number',
      'date_of_birth',
      'zip_code',
      'hospital_name',
      'facility_name',
      'fax_number'
    ]

    const deidentified: Record<string, any> = {}

    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase()
      const isIdentifier = safeHarborIdentifiers.some((id) => lowerKey.includes(id))

      if (!isIdentifier) {
        deidentified[key] = value
      } else if (key === 'zip_code' && typeof value === 'string' && value.length >= 5) {
        // Allow first 3 digits of ZIP code
        deidentified[key] = value.substring(0, 3) + 'XX'
      }
    }

    return deidentified
  }

  /**
   * De-identify using expert determination
   */
  expertDeidentification(data: Record<string, any>, expertCertification: {
    expertName: string
    qualifications: string
    riskAssessment: string
    certificateDate: Date
  }): Record<string, any> {
    // With expert determination, the risk that the information could be used to identify the subject is very small
    // Typically involves both de-identification and statistical methods

    const deidentified: Record<string, any> = {
      ...data,
      _deidentified: true,
      _expertCertification: {
        expert: expertCertification.expertName,
        riskLevel: 'very_low',
        certified: true
      }
    }

    // Remove/generalize key identifiers
    delete deidentified.name
    delete deidentified.address
    delete deidentified.email
    delete deidentified.phone_number

    return deidentified
  }

  /**
   * Get access audit trail for patient
   */
  getPatientAccessLog(patientId: string): HIPAAAccessLog[] {
    return this.accessLog.filter((log) => log.patientId === patientId)
  }

  /**
   * Get unauthorized access attempts
   */
  getUnauthorizedAccessAttempts(days: number = 30): HIPAAAccessLog[] {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    return this.accessLog.filter(
      (log) =>
        log.result === 'failure' &&
        log.action === 'PHI_ACCESS_DENIED' &&
        log.timestamp >= startDate
    )
  }

  /**
   * Audit access control effectiveness
   */
  auditAccessControls(days: number = 90): {
    totalAccessAttempts: number
    authorizedAccesses: number
    deniedAccesses: number
    suspiciousPatterns: string[]
  } {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const recentLogs = this.accessLog.filter((log) => log.timestamp >= startDate)
    const authorizedCount = recentLogs.filter((log) => log.result === 'success').length
    const deniedCount = recentLogs.filter((log) => log.result === 'failure').length

    // Detect suspicious patterns
    const suspiciousPatterns: string[] = []
    const userAccessCounts = new Map<string, number>()

    for (const log of recentLogs) {
      if (log.result === 'success') {
        userAccessCounts.set(log.userId, (userAccessCounts.get(log.userId) || 0) + 1)
      }
    }

    for (const [userId, count] of userAccessCounts) {
      if (count > 100) {
        suspiciousPatterns.push(`User ${userId}: ${count} accesses in ${days} days (unusual volume)`)
      }
    }

    return {
      totalAccessAttempts: recentLogs.length,
      authorizedAccesses: authorizedCount,
      deniedAccesses: deniedCount,
      suspiciousPatterns
    }
  }

  /**
   * Generate HIPAA compliance report
   */
  generateComplianceReport(): {
    status: ComplianceStatus
    breachCount: number
    unreportedBreaches: number
    baaComplianceRate: number
    minimumNecessaryPolicies: number
    lastAuditDate?: Date
    recommendations: string[]
  } {
    const activeBAAs = Array.from(this.businessAssociates.values()).filter(
      (baa) => baa.status === 'active' && (!baa.expiresAt || baa.expiresAt > new Date())
    ).length
    const totalBAAs = this.businessAssociates.size
    const unreportedBreaches = this.breaches.filter((b) => b.status === 'reported').length

    const recommendations: string[] = []

    if (this.breaches.length > 0) {
      recommendations.push('Review breach response procedures')
    }

    if (totalBAAs > 0 && activeBAAs < totalBAAs) {
      recommendations.push('Update expired Business Associate Agreements')
    }

    if (this.minimumNecessaryPolicies.size === 0) {
      recommendations.push('Establish minimum necessary access policies')
    }

    const expiredPolicies = Array.from(this.minimumNecessaryPolicies.values()).filter(
      (p) => p.expiresAt < new Date()
    ).length

    if (expiredPolicies > 0) {
      recommendations.push(`Review and renew ${expiredPolicies} expired minimum necessary policies`)
    }

    return {
      status: this.complianceStatus,
      breachCount: this.breaches.length,
      unreportedBreaches,
      baaComplianceRate: totalBAAs > 0 ? (activeBAAs / totalBAAs) * 100 : 100,
      minimumNecessaryPolicies: this.minimumNecessaryPolicies.size,
      recommendations
    }
  }

  /**
   * Set compliance status
   */
  setComplianceStatus(status: ComplianceStatus): void {
    this.complianceStatus = status
  }

  /**
   * Get all breaches
   */
  getAllBreaches(): HIPAABreach[] {
    return [...this.breaches].sort((a, b) => b.reportedDate.getTime() - a.reportedDate.getTime())
  }
}

/**
 * HIPAA Access Log Entry
 */
export interface HIPAAAccessLog {
  timestamp: Date
  recordId: string
  patientId: string
  userId: string
  action: 'PHI_ACCESSED' | 'PHI_ACCESS_DENIED' | 'PHI_REGISTERED'
  purpose: string
  result: 'success' | 'failure'
  role?: HIPAARole
  justification?: string
  reason?: string
}

/**
 * HIPAA Breach Report
 */
export interface HIPAABreach {
  id: string
  breachDate: Date
  discoveredDate: Date
  reportedDate: Date
  affectedPatientCount: number
  phiTypes: PHICategory[]
  description: string
  mitigationActions: Array<{ action: string; completedAt: Date }>
  status: 'reported' | 'under_investigation' | 'resolved'
  notificationSentAt?: Date
}

/**
 * PHI Record interface
 */
interface PHIRecord {
  categories: PHICategory[]
  patientId: string
  recordDate: Date
}

/**
 * Create global HIPAA compliance service
 */
export const hipaaComplianceService = new HIPAAComplianceService()
