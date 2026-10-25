// WAVE 8D: GDPR Compliance Module
// Right to be forgotten, data export, consent management, data processing agreements

/**
 * GDPR request types
 */
export enum GDPRRequestType {
  ACCESS = 'access', // Right to access data
  EXPORT = 'export', // Right to data portability
  RECTIFY = 'rectify', // Right to rectification
  DELETE = 'delete', // Right to be forgotten
  RESTRICT = 'restrict', // Right to restriction of processing
  OBJECT = 'object', // Right to object to processing
  WITHDRAW_CONSENT = 'withdraw_consent' // Right to withdraw consent
}

/**
 * GDPR request status
 */
export enum GDPRRequestStatus {
  SUBMITTED = 'submitted',
  ACKNOWLEDGED = 'acknowledged',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DENIED = 'denied',
  EXPIRED = 'expired'
}

/**
 * Data processing basis
 */
export enum ProcessingBasis {
  CONSENT = 'consent',
  CONTRACT = 'contract',
  LEGAL_OBLIGATION = 'legal_obligation',
  VITAL_INTERESTS = 'vital_interests',
  PUBLIC_TASK = 'public_task',
  LEGITIMATE_INTERESTS = 'legitimate_interests'
}

/**
 * Consent record
 */
export interface ConsentRecord {
  id: string
  dataSubjectId: string
  consentType: string // 'marketing', 'analytics', 'cookies', etc.
  basis: ProcessingBasis
  givenAt: Date
  expiresAt?: Date
  withdrawnAt?: Date
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, any>
}

/**
 * GDPR data subject
 */
export interface DataSubject {
  id: string
  email: string
  name: string
  createdAt: Date
  lastActiveAt: Date
  consents: ConsentRecord[]
  dataRetentionDays: number
  isDeleted: boolean
  deletedAt?: Date
}

/**
 * GDPR request
 */
export interface GDPRRequest {
  id: string
  dataSubjectId: string
  dataSubjectEmail: string
  requestType: GDPRRequestType
  status: GDPRRequestStatus
  submittedAt: Date
  respondByDate: Date // GDPR allows 30 days
  completedAt?: Date
  denialReason?: string
  dataExportUrl?: string // For export requests
  verificationToken: string
  verified: boolean
  verifiedAt?: Date
  metadata?: Record<string, any>
}

/**
 * Data retention policy
 */
export interface DataRetentionPolicy {
  dataCategory: string // 'user_account', 'logs', 'cookies', etc.
  retentionDays: number
  basisForRetention: ProcessingBasis
  deletionMethod: 'pseudonymize' | 'delete' | 'anonymize'
  exceptions?: string[] // Legal holds, etc.
}

/**
 * GDPR Compliance Service
 */
export class GDPRComplianceService {
  private dataSubjects: Map<string, DataSubject> = new Map()
  private gdprRequests: Map<string, GDPRRequest> = new Map()
  private consentRecords: Map<string, ConsentRecord[]> = new Map()
  private retentionPolicies: Map<string, DataRetentionPolicy> = new Map()
  private dataProcessingLog: Array<{
    dataSubjectId: string
    operation: string
    timestamp: Date
  }> = []

  /**
   * Register data subject
   */
  registerDataSubject(dataSubjectId: string, email: string, name: string): DataSubject {
    if (this.dataSubjects.has(dataSubjectId)) {
      return this.dataSubjects.get(dataSubjectId)!
    }

    const dataSubject: DataSubject = {
      id: dataSubjectId,
      email,
      name,
      createdAt: new Date(),
      lastActiveAt: new Date(),
      consents: [],
      dataRetentionDays: 365,
      isDeleted: false
    }

    this.dataSubjects.set(dataSubjectId, dataSubject)
    return dataSubject
  }

  /**
   * Record consent
   */
  recordConsent(
    dataSubjectId: string,
    consentType: string,
    basis: ProcessingBasis,
    ipAddress?: string,
    userAgent?: string
  ): ConsentRecord {
    const dataSubject = this.dataSubjects.get(dataSubjectId)
    if (!dataSubject) {
      throw new Error('Data subject not found')
    }

    const consent: ConsentRecord = {
      id: 'consent-' + Date.now() + '-' + Math.random().toString(36).substring(7),
      dataSubjectId,
      consentType,
      basis,
      givenAt: new Date(),
      ipAddress,
      userAgent
    }

    dataSubject.consents.push(consent)

    if (!this.consentRecords.has(dataSubjectId)) {
      this.consentRecords.set(dataSubjectId, [])
    }
    this.consentRecords.get(dataSubjectId)!.push(consent)

    return consent
  }

  /**
   * Withdraw consent
   */
  withdrawConsent(dataSubjectId: string, consentId: string): void {
    const consent = this.consentRecords
      .get(dataSubjectId)
      ?.find((c) => c.id === consentId)

    if (consent) {
      consent.withdrawnAt = new Date()
    }
  }

  /**
   * Submit GDPR request
   */
  submitGDPRRequest(dataSubjectId: string, email: string, requestType: GDPRRequestType): GDPRRequest {
    const dataSubject = this.dataSubjects.get(dataSubjectId)
    if (!dataSubject) {
      throw new Error('Data subject not found')
    }

    const verificationToken = Math.random().toString(36).substring(2, 15)
    const respondByDate = new Date()
    respondByDate.setDate(respondByDate.getDate() + 30) // 30-day response window

    const request: GDPRRequest = {
      id: 'gdpr-' + Date.now() + '-' + Math.random().toString(36).substring(7),
      dataSubjectId,
      dataSubjectEmail: email,
      requestType,
      status: GDPRRequestStatus.SUBMITTED,
      submittedAt: new Date(),
      respondByDate,
      verificationToken,
      verified: false
    }

    this.gdprRequests.set(request.id, request)
    return request
  }

  /**
   * Verify GDPR request (via email verification token)
   */
  verifyGDPRRequest(requestId: string, token: string): boolean {
    const request = this.gdprRequests.get(requestId)
    if (!request) return false

    if (request.verificationToken !== token) return false

    request.verified = true
    request.verifiedAt = new Date()
    request.status = GDPRRequestStatus.ACKNOWLEDGED

    return true
  }

  /**
   * Get data for data subject (right to access)
   */
  getDataSubjectData(dataSubjectId: string): Record<string, any> {
    const dataSubject = this.dataSubjects.get(dataSubjectId)
    if (!dataSubject) {
      throw new Error('Data subject not found')
    }

    return {
      profile: {
        id: dataSubject.id,
        email: dataSubject.email,
        name: dataSubject.name,
        createdAt: dataSubject.createdAt,
        lastActiveAt: dataSubject.lastActiveAt
      },
      consents: dataSubject.consents.map((c) => ({
        type: c.consentType,
        givenAt: c.givenAt,
        withdrawnAt: c.withdrawnAt,
        basis: c.basis
      })),
      dataRetention: {
        retentionDays: dataSubject.dataRetentionDays,
        expiresAt: new Date(dataSubject.lastActiveAt.getTime() + dataSubject.dataRetentionDays * 24 * 60 * 60 * 1000)
      }
    }
  }

  /**
   * Export data for data subject (right to portability)
   */
  exportDataSubjectData(dataSubjectId: string): string {
    const data = this.getDataSubjectData(dataSubjectId)
    return JSON.stringify(data, null, 2)
  }

  /**
   * Delete data subject (right to be forgotten)
   */
  async deleteDataSubject(dataSubjectId: string, requestId: string): Promise<void> {
    const dataSubject = this.dataSubjects.get(dataSubjectId)
    if (!dataSubject) {
      throw new Error('Data subject not found')
    }

    const request = this.gdprRequests.get(requestId)
    if (!request || request.dataSubjectId !== dataSubjectId || !request.verified) {
      throw new Error('Invalid deletion request')
    }

    // Mark as deleted instead of hard delete (keep for audit trail)
    dataSubject.isDeleted = true
    dataSubject.deletedAt = new Date()

    // Clear personal data
    dataSubject.name = '[DELETED]'
    dataSubject.email = '[DELETED]'
    dataSubject.consents = []

    request.status = GDPRRequestStatus.COMPLETED
    request.completedAt = new Date()

    this.dataProcessingLog.push({
      dataSubjectId,
      operation: 'data_deleted',
      timestamp: new Date()
    })
  }

  /**
   * Restrict data processing
   */
  restrictProcessing(dataSubjectId: string, restrictions: string[]): void {
    const dataSubject = this.dataSubjects.get(dataSubjectId)
    if (!dataSubject) {
      throw new Error('Data subject not found')
    }

    // Withdraw consents that conflict with restrictions
    for (const consent of dataSubject.consents) {
      if (restrictions.includes(consent.consentType)) {
        consent.withdrawnAt = new Date()
      }
    }

    this.dataProcessingLog.push({
      dataSubjectId,
      operation: `processing_restricted: ${restrictions.join(',')}`,
      timestamp: new Date()
    })
  }

  /**
   * Check if data processing is allowed
   */
  canProcessData(dataSubjectId: string, purposeType: string): boolean {
    const dataSubject = this.dataSubjects.get(dataSubjectId)
    if (!dataSubject) return false

    if (dataSubject.isDeleted) return false

    // Check if consent exists and is not withdrawn
    const consent = dataSubject.consents.find(
      (c) => c.consentType === purposeType && !c.withdrawnAt
    )

    return consent !== undefined
  }

  /**
   * Define data retention policy
   */
  defineRetentionPolicy(policy: DataRetentionPolicy): void {
    this.retentionPolicies.set(policy.dataCategory, policy)
  }

  /**
   * Check if data should be deleted due to retention policy
   */
  checkDataRetention(): Array<{ dataSubjectId: string; reason: string }> {
    const toDelete: Array<{ dataSubjectId: string; reason: string }> = []

    for (const [, dataSubject] of this.dataSubjects) {
      if (dataSubject.isDeleted) continue

      const policy = this.retentionPolicies.get('user_account')
      if (policy) {
        const daysSinceLastActive = (Date.now() - dataSubject.lastActiveAt.getTime()) / (1000 * 60 * 60 * 24)
        if (daysSinceLastActive > policy.retentionDays) {
          toDelete.push({
            dataSubjectId: dataSubject.id,
            reason: `Data retention policy: ${policy.retentionDays} days exceeded`
          })
        }
      }
    }

    return toDelete
  }

  /**
   * Deny GDPR request
   */
  denyGDPRRequest(requestId: string, reason: string): void {
    const request = this.gdprRequests.get(requestId)
    if (!request) {
      throw new Error('Request not found')
    }

    request.status = GDPRRequestStatus.DENIED
    request.denialReason = reason
    request.completedAt = new Date()
  }

  /**
   * Get GDPR request status
   */
  getRequestStatus(requestId: string): GDPRRequest | null {
    return this.gdprRequests.get(requestId) || null
  }

  /**
   * Get all requests for data subject
   */
  getDataSubjectRequests(dataSubjectId: string): GDPRRequest[] {
    return Array.from(this.gdprRequests.values()).filter(
      (r) => r.dataSubjectId === dataSubjectId
    )
  }

  /**
   * Generate GDPR compliance report
   */
  generateComplianceReport(): {
    totalDataSubjects: number
    deletedDataSubjects: number
    pendingRequests: number
    consentRate: number
    dataRetentionCompliance: number
  } {
    const dataSubjects = Array.from(this.dataSubjects.values())
    const deletedCount = dataSubjects.filter((d) => d.isDeleted).length
    const totalWithConsent = dataSubjects.filter((d) => d.consents.length > 0).length
    const pendingRequests = Array.from(this.gdprRequests.values()).filter(
      (r) => r.status === GDPRRequestStatus.SUBMITTED ||
             r.status === GDPRRequestStatus.IN_PROGRESS
    ).length

    const retentionCompliant = Array.from(this.dataSubjects.values()).filter((d) => {
      const policy = this.retentionPolicies.get('user_account')
      if (!policy) return true
      const daysSinceLastActive = (Date.now() - d.lastActiveAt.getTime()) / (1000 * 60 * 60 * 24)
      return daysSinceLastActive <= policy.retentionDays || d.isDeleted
    }).length

    return {
      totalDataSubjects: dataSubjects.length,
      deletedDataSubjects: deletedCount,
      pendingRequests,
      consentRate: dataSubjects.length > 0 ? (totalWithConsent / dataSubjects.length) * 100 : 0,
      dataRetentionCompliance: dataSubjects.length > 0 ? (retentionCompliant / dataSubjects.length) * 100 : 0
    }
  }

  /**
   * List all data processing activities
   */
  listDataProcessingActivities(): Array<{
    dataSubjectId: string
    operation: string
    timestamp: Date
  }> {
    return [...this.dataProcessingLog].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }
}

/**
 * Create global GDPR compliance service
 */
export const gdprComplianceService = new GDPRComplianceService()
