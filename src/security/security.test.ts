// WAVE 8D: Security & Compliance - Comprehensive Test Suite

import {
  AuthorizationEngine,
  DataClassification,
  EncryptionService,
  EncryptionAlgorithm,
  AuditTrailService,
  AuditEventType,
  DataMaskingService,
  MaskingStrategy,
  GDPRComplianceService,
  GDPRRequestType,
  ProcessingBasis,
  HIPAAComplianceService,
  HIPAARole,
  PHICategory,
  ComplianceReportsService
} from './index'

/**
 * Test Suite: Authorization Engine
 */
describe('AuthorizationEngine', () => {
  let authEngine: AuthorizationEngine

  beforeEach(() => {
    authEngine = new AuthorizationEngine()
  })

  describe('RBAC', () => {
    it('should grant admin full access', () => {
      const context = {
        userId: 'admin-1',
        email: 'admin@example.com',
        roles: ['admin'],
        attributes: new Map(),
        permissions: new Set(),
        teams: [],
        timestamp: new Date()
      }

      expect(authEngine.canPerformAction(context, 'users', 'read')).toBe(true)
      expect(authEngine.canPerformAction(context, 'users', 'write')).toBe(true)
      expect(authEngine.canPerformAction(context, 'users', 'delete')).toBe(true)
    })

    it('should restrict viewer to read-only', () => {
      const context = {
        userId: 'viewer-1',
        email: 'viewer@example.com',
        roles: ['viewer'],
        attributes: new Map(),
        permissions: new Set(),
        teams: [],
        timestamp: new Date()
      }

      expect(authEngine.canPerformAction(context, 'users', 'read')).toBe(true)
      expect(authEngine.canPerformAction(context, 'users', 'write')).toBe(false)
    })
  })

  describe('Field-Level Authorization', () => {
    it('should restrict PII access', async () => {
      authEngine.registerResource({
        name: 'employees',
        ownershipField: 'userId',
        defaultClassification: DataClassification.INTERNAL,
        fields: new Map([
          ['email', {
            name: 'email',
            type: 'string',
            classification: DataClassification.PII,
            piiType: 'email',
            encrypted: true,
            requiresAudit: true
          }],
          ['department', {
            name: 'department',
            type: 'string',
            classification: DataClassification.INTERNAL,
            encrypted: false,
            requiresAudit: false
          }]
        ])
      })

      const context = {
        userId: 'analyst-1',
        email: 'analyst@example.com',
        roles: ['data_analyst'],
        attributes: new Map(),
        permissions: new Set(['read:public']),
        teams: [],
        timestamp: new Date()
      }

      const emailAuth = await authEngine.checkFieldAuthorization(
        context,
        'employees',
        'email',
        'read'
      )

      expect(emailAuth.canRead).toBe(false)
      expect(emailAuth.maskingRequired).toBe(true)

      const deptAuth = await authEngine.checkFieldAuthorization(
        context,
        'employees',
        'department',
        'read'
      )

      expect(deptAuth.canRead).toBe(true)
      expect(deptAuth.maskingRequired).toBe(false)
    })
  })

  describe('Row-Level Security', () => {
    it('should apply RLS predicates', () => {
      authEngine.addRLSPolicy({
        id: 'rls-1',
        tableName: 'documents',
        policyName: 'team_isolation',
        using: 'team_id = current_user_team_id()',
        roles: ['data_analyst']
      })

      const context = {
        userId: 'analyst-1',
        email: 'analyst@example.com',
        roles: ['data_analyst'],
        attributes: new Map(),
        permissions: new Set(),
        teams: ['team-1'],
        timestamp: new Date()
      }

      const predicate = authEngine.getRLSPredicate(context, 'documents')
      expect(predicate).toBe('team_id = current_user_team_id()')
    })
  })
})

/**
 * Test Suite: Encryption Service
 */
describe('EncryptionService', () => {
  let encryption: EncryptionService

  beforeEach(() => {
    encryption = new EncryptionService()
  })

  describe('Encryption', () => {
    it('should encrypt and decrypt data', () => {
      const plaintext = 'sensitive data'
      const encrypted = encryption.encryptAtRest(plaintext)

      expect(encrypted.ciphertext).toBeDefined()
      expect(encrypted.iv).toBeDefined()
      expect(encrypted.algorithm).toBe(EncryptionAlgorithm.AES_256_GCM)

      const decrypted = encryption.decryptAtRest(encrypted)
      expect(decrypted).toBe(plaintext)
    })

    it('should create and verify HMAC', () => {
      const data = 'message'
      const hmac = encryption.createHMAC(data)

      expect(encryption.verifyHMAC(data, hmac, encryption.listKeys()[0].id)).toBe(true)
      expect(encryption.verifyHMAC('different data', hmac, encryption.listKeys()[0].id)).toBe(false)
    })
  })

  describe('Key Management', () => {
    it('should rotate keys', () => {
      const keyId = encryption.listKeys()[0].id
      const newKey = encryption.rotateKey(keyId)

      expect(newKey.id).not.toBe(keyId)
      expect(newKey.status).toBe('active')

      const oldKey = encryption.listKeys().find((k) => k.id === keyId)
      expect(oldKey?.status).toBe('retired')
    })

    it('should track key statistics', () => {
      const stats = encryption.getStatistics()

      expect(stats.activeKeys).toBeGreaterThan(0)
      expect(stats.totalKeys).toBeGreaterThanOrEqual(stats.activeKeys)
    })
  })
})

/**
 * Test Suite: Audit Trail
 */
describe('AuditTrailService', () => {
  let auditTrail: AuditTrailService

  beforeEach(() => {
    auditTrail = new AuditTrailService()
  })

  describe('Event Logging', () => {
    it('should log authentication events', () => {
      auditTrail.logAuthenticationEvent(
        'user-1',
        'user@example.com',
        true,
        '192.168.1.1'
      )

      const logs = auditTrail.getUserEvents('user-1')
      expect(logs.length).toBe(1)
      expect(logs[0].event.eventType).toBe(AuditEventType.LOGIN)
    })

    it('should log data access', () => {
      auditTrail.logDataAccess(
        'user-1',
        'user@example.com',
        'read',
        'users',
        'user-2'
      )

      const logs = auditTrail.getUserEvents('user-1')
      expect(logs.length).toBe(1)
      expect(logs[0].event.eventType).toBe(AuditEventType.DATA_READ)
    })
  })

  describe('Audit Queries', () => {
    it('should query logs with filters', () => {
      auditTrail.logAuthenticationEvent('user-1', 'user@example.com', true)
      auditTrail.logAuthenticationEvent('user-2', 'user2@example.com', false)
      auditTrail.logDataAccess('user-1', 'user@example.com', 'read', 'users', 'user-3')

      const failedLogins = auditTrail.queryLogs({
        eventType: AuditEventType.LOGIN_FAILED
      })

      expect(failedLogins.length).toBe(1)
      expect(failedLogins[0].event.userId).toBe('user-2')
    })

    it('should generate audit summary', () => {
      auditTrail.logAuthenticationEvent('user-1', 'user@example.com', true)
      auditTrail.logDataAccess('user-1', 'user@example.com', 'read', 'users', 'user-2')
      auditTrail.logDataAccess('user-2', 'user2@example.com', 'read', 'users', 'user-3')

      const summary = auditTrail.getAuditSummary(7)

      expect(summary.totalEvents).toBe(3)
      expect(summary.affectedUsers.size).toBe(2)
      expect(summary.eventsByType[AuditEventType.LOGIN]).toBe(1)
    })
  })

  describe('Integrity Verification', () => {
    it('should verify event integrity', () => {
      const entry = auditTrail.logAuthenticationEvent('user-1', 'user@example.com', true)
      const isValid = auditTrail.verifyEventIntegrity(entry.event.id)

      expect(isValid).toBe(true)
    })

    it('should verify chain integrity', () => {
      auditTrail.logAuthenticationEvent('user-1', 'user@example.com', true)
      auditTrail.logDataAccess('user-1', 'user@example.com', 'read', 'users', 'user-2')
      auditTrail.logAuthenticationEvent('user-1', 'user@example.com', false)

      const isChainValid = auditTrail.verifyChainIntegrity()
      expect(isChainValid).toBe(true)
    })
  })
})

/**
 * Test Suite: Data Masking
 */
describe('DataMaskingService', () => {
  let masking: DataMaskingService

  beforeEach(() => {
    masking = new DataMaskingService()
  })

  describe('Field Masking', () => {
    it('should redact sensitive fields', () => {
      masking.defineMaskingRule({
        fieldName: 'ssn',
        strategy: MaskingStrategy.REDACT
      })

      const masked = masking.maskField('ssn', '123-45-6789')
      expect(masked).toBe('***')
    })

    it('should partially mask with show characters', () => {
      masking.defineMaskingRule({
        fieldName: 'email',
        strategy: MaskingStrategy.PARTIAL,
        showCharacters: 3
      })

      const masked = masking.maskField('email', 'user@example.com')
      expect(masked).toMatch(/^.{3}\*+$/)
    })

    it('should hash sensitive values', () => {
      masking.defineMaskingRule({
        fieldName: 'password',
        strategy: MaskingStrategy.HASH
      })

      const masked = masking.maskField('password', 'secret123')
      expect(masked).toMatch(/^[a-f0-9]+$/)
      expect(masked.length).toBe(16)
    })
  })

  describe('PII Detection', () => {
    it('should detect emails', () => {
      const findings = masking.detectPII('Contact: john@example.com')

      expect(findings.some((f) => f.type === 'email')).toBe(true)
    })

    it('should detect phone numbers', () => {
      const findings = masking.detectPII('Call 555-123-4567')

      expect(findings.some((f) => f.type === 'phone')).toBe(true)
    })

    it('should redact PII', () => {
      const redacted = masking.redactPII('Email: john@example.com')

      expect(redacted).toContain('[REDACTED]')
      expect(redacted).not.toContain('john@example.com')
    })
  })

  describe('K-Anonymity', () => {
    it('should check k-anonymity', () => {
      const records = [
        { age: 25, zipcode: '90210', salary: 50000 },
        { age: 25, zipcode: '90210', salary: 60000 },
        { age: 25, zipcode: '90210', salary: 55000 },
        { age: 25, zipcode: '90210', salary: 65000 },
        { age: 25, zipcode: '90210', salary: 48000 }
      ]

      const result = masking.checkKAnonymity(records, ['age', 'zipcode'], 5)

      expect(result.isKAnonymous).toBe(true)
      expect(result.kValue).toBe(5)
    })
  })
})

/**
 * Test Suite: GDPR Compliance
 */
describe('GDPRComplianceService', () => {
  let gdpr: GDPRComplianceService

  beforeEach(() => {
    gdpr = new GDPRComplianceService()
  })

  describe('Data Subject Management', () => {
    it('should register data subject', () => {
      const subject = gdpr.registerDataSubject('ds-1', 'user@example.com', 'John Doe')

      expect(subject.id).toBe('ds-1')
      expect(subject.email).toBe('user@example.com')
      expect(subject.isDeleted).toBe(false)
    })

    it('should record consent', () => {
      gdpr.registerDataSubject('ds-1', 'user@example.com', 'John Doe')

      const consent = gdpr.recordConsent(
        'ds-1',
        'marketing',
        ProcessingBasis.CONSENT
      )

      expect(consent.consentType).toBe('marketing')
      expect(consent.withdrawnAt).toBeUndefined()
    })

    it('should withdraw consent', () => {
      gdpr.registerDataSubject('ds-1', 'user@example.com', 'John Doe')
      const consent = gdpr.recordConsent(
        'ds-1',
        'marketing',
        ProcessingBasis.CONSENT
      )

      gdpr.withdrawConsent('ds-1', consent.id)

      expect(gdpr.canProcessData('ds-1', 'marketing')).toBe(false)
    })
  })

  describe('GDPR Requests', () => {
    it('should submit and verify access request', () => {
      gdpr.registerDataSubject('ds-1', 'user@example.com', 'John Doe')

      const request = gdpr.submitGDPRRequest('ds-1', 'user@example.com', GDPRRequestType.ACCESS)

      expect(request.status).toBe('submitted')
      expect(request.verified).toBe(false)

      const verified = gdpr.verifyGDPRRequest(request.id, request.verificationToken)

      expect(verified).toBe(true)
      const verifiedRequest = gdpr.getRequestStatus(request.id)
      expect(verifiedRequest?.status).toBe('acknowledged')
    })

    it('should export data', () => {
      gdpr.registerDataSubject('ds-1', 'user@example.com', 'John Doe')
      gdpr.recordConsent('ds-1', 'marketing', ProcessingBasis.CONSENT)

      const exported = gdpr.exportDataSubjectData('ds-1')
      const data = JSON.parse(exported)

      expect(data.profile.email).toBe('user@example.com')
      expect(data.consents.length).toBe(1)
    })

    it('should delete data subject', async () => {
      gdpr.registerDataSubject('ds-1', 'user@example.com', 'John Doe')
      const request = gdpr.submitGDPRRequest('ds-1', 'user@example.com', GDPRRequestType.DELETE)
      gdpr.verifyGDPRRequest(request.id, request.verificationToken)

      await gdpr.deleteDataSubject('ds-1', request.id)

      const subject = gdpr.registerDataSubject('ds-1', 'user@example.com', 'John Doe') // Re-register to get
      // the updated one
      expect(subject.isDeleted).toBe(true)
    })
  })
})

/**
 * Test Suite: HIPAA Compliance
 */
describe('HIPAAComplianceService', () => {
  let hipaa: HIPAAComplianceService

  beforeEach(() => {
    hipaa = new HIPAAComplianceService()
  })

  describe('PHI Management', () => {
    it('should register PHI', () => {
      hipaa.registerPHI(
        'record-1',
        'patient-1',
        [PHICategory.DIAGNOSIS, PHICategory.MEDICATION],
        'provider-1'
      )

      const logs = hipaa.getPatientAccessLog('patient-1')
      expect(logs.length).toBeGreaterThan(0)
      expect(logs[0].action).toBe('PHI_REGISTERED')
    })

    it('should enforce minimum necessary', () => {
      hipaa.registerPHI('record-1', 'patient-1', [PHICategory.DIAGNOSIS], 'provider-1')
      hipaa.defineMinimumNecessary(
        HIPAARole.PROVIDER,
        'treatment',
        ['diagnosis', 'medication'],
        'Treatment provision',
        'CISO',
        365
      )

      const canAccess = hipaa.accessPHI(
        'record-1',
        'provider-1',
        HIPAARole.PROVIDER,
        'treatment',
        'Patient care'
      )

      expect(canAccess).toBe(true)
    })
  })

  describe('De-identification', () => {
    it('should de-identify using Safe Harbor', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        ssn: '123-45-6789',
        diagnosis: 'Diabetes',
        zipcode: '90210'
      }

      const deidentified = hipaa.deidentifySafeHarbor(data)

      expect(deidentified.name).toBeUndefined()
      expect(deidentified.email).toBeUndefined()
      expect(deidentified.ssn).toBeUndefined()
      expect(deidentified.diagnosis).toBe('Diabetes')
      expect(deidentified.zipcode).toBe('902XX')
    })
  })

  describe('Breach Reporting', () => {
    it('should report breach', () => {
      const breach = hipaa.reportBreach(
        new Date('2024-01-10'),
        50,
        [PHICategory.MEDICAL_RECORD],
        'Unauthorized access',
        new Date('2024-01-15'),
        new Date('2024-01-16')
      )

      expect(breach.status).toBe('reported')
      expect(breach.affectedPatientCount).toBe(50)

      const allBreaches = hipaa.getAllBreaches()
      expect(allBreaches.length).toBe(1)
    })
  })
})

/**
 * Integration Test
 */
describe('Security Layer Integration', () => {
  it('should work together for secure data access', async () => {
    const authorization = new AuthorizationEngine()
    const encryption = new EncryptionService()
    const auditTrail = new AuditTrailService()
    const dataMasking = new DataMaskingService()

    // 1. Set up authorization
    authorization.registerResource({
      name: 'patients',
      ownershipField: 'userId',
      defaultClassification: DataClassification.SENSITIVE,
      fields: new Map([
        ['email', {
          name: 'email',
          type: 'string',
          classification: DataClassification.PII,
          encrypted: true,
          requiresAudit: true
        }]
      ])
    })

    // 2. Encrypt sensitive data
    const sensitiveData = 'patient@example.com'
    const encrypted = encryption.encryptAtRest(sensitiveData)

    // 3. Decrypt and audit access
    const decrypted = encryption.decryptAtRest(encrypted)
    auditTrail.logDataAccess('analyst-1', 'analyst@example.com', 'read', 'patients', 'patient-1')

    // 4. Apply masking for non-privileged user
    dataMasking.defineMaskingRule({
      fieldName: 'email',
      strategy: MaskingStrategy.PARTIAL,
      showCharacters: 3
    })

    const masked = dataMasking.maskField('email', decrypted)

    expect(decrypted).toBe(sensitiveData)
    expect(masked).toMatch(/^.{3}\*+$/)
    expect(masked).not.toBe(sensitiveData)

    const logs = auditTrail.queryLogs({})
    expect(logs.length).toBeGreaterThan(0)
  })
})
