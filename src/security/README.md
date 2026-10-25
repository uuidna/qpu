# WAVE 8D: Security & Compliance Framework

Complete fine-grained access control, encryption, audit logging, and regulatory compliance for the QPU platform.

## Architecture

```
Security Layer
├── Authorization Engine (RBAC/ABAC + Field-Level)
├── Encryption Service (At-Rest & In-Transit)
├── Immutable Audit Trail
├── Data Masking & Anonymization
└── Compliance Modules
    ├── GDPR
    ├── HIPAA
    └── Multi-Standard Reporting
```

## Modules

### 1. Authorization Engine (`authorization.ts`)

Field-level RBAC and ABAC with row-level security.

**Features:**
- Role-based access control (RBAC)
- Attribute-based access control (ABAC)
- Field-level authorization
- Row-level security (RLS) policies
- Data classification (Public, Internal, Sensitive, PII, Confidential, Restricted)

**Usage:**

```typescript
import { AuthorizationEngine, DataClassification } from '@/security'

const authEngine = new AuthorizationEngine()

// Define resource with field-level security
authEngine.registerResource({
  name: 'users',
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
    ['phone', {
      name: 'phone',
      type: 'string',
      classification: DataClassification.SENSITIVE,
      encrypted: true,
      requiresAudit: true
    }],
    ['name', {
      name: 'name',
      type: 'string',
      classification: DataClassification.INTERNAL,
      encrypted: false,
      requiresAudit: false
    }]
  ])
})

// Check field authorization
const context = {
  userId: 'user-123',
  email: 'user@example.com',
  roles: ['data_analyst'],
  attributes: new Map(),
  permissions: new Set(['read:public']),
  teams: [],
  timestamp: new Date()
}

const fieldAuth = await authEngine.checkFieldAuthorization(
  context,
  'users',
  'email',
  'read'
)

console.log(fieldAuth)
// {
//   fieldName: 'email',
//   canRead: false,
//   canWrite: false,
//   canDelete: false,
//   maskingRequired: true,
//   encryptionRequired: true,
//   reason: 'Insufficient access for pii data'
// }
```

### 2. Encryption Service (`encryption.ts`)

Comprehensive encryption for data at-rest and in-transit with key management.

**Features:**
- AES-256-GCM, AES-256-CBC, ChaCha20-Poly1305, RSA encryption
- Automatic key rotation
- HMAC for integrity verification
- TLS/mTLS configuration
- Key management system integration

**Usage:**

```typescript
import { EncryptionService, EncryptionAlgorithm } from '@/security'

const encryption = new EncryptionService()

// Encrypt data
const encrypted = encryption.encryptAtRest('sensitive data')
console.log(encrypted)
// {
//   ciphertext: 'base64...',
//   iv: 'base64...',
//   tag: 'base64...',
//   algorithm: 'aes-256-gcm',
//   keyId: 'key-...'
// }

// Decrypt
const decrypted = encryption.decryptAtRest(encrypted)
console.log(decrypted) // 'sensitive data'

// Set key rotation policy
encryption.setKeyRotationPolicy(keyId, {
  enabled: true,
  rotationIntervalDays: 90,
  retentionDays: 365,
  algorithm: EncryptionAlgorithm.AES_256_GCM,
  autoRotate: true
})

// Hash for comparison
const hash = encryption.hash('password')

// HMAC for integrity
const hmac = encryption.createHMAC('data')
const isValid = encryption.verifyHMAC('data', hmac, keyId)
```

### 3. Audit Trail (`audit-trail.ts`)

Immutable, chain-verified audit logging for compliance.

**Features:**
- Immutable event storage with chain verification
- Event hash integrity
- Automatic retention policies
- Multi-level severity tracking
- Export for compliance

**Usage:**

```typescript
import { AuditTrailService, AuditEventType, AuditSeverity } from '@/security'

const auditTrail = new AuditTrailService()

// Log authentication
auditTrail.logAuthenticationEvent(
  'user-123',
  'user@example.com',
  true,
  '192.168.1.1',
  'Mozilla/5.0...'
)

// Log data access
auditTrail.logDataAccess(
  'user-123',
  'user@example.com',
  'read',
  'user',
  'user-456',
  'John Doe'
)

// Log PII access
auditTrail.logPIIAccess(
  'user-123',
  'user@example.com',
  'email',
  'user-456',
  'Customer support inquiry'
)

// Query audit logs
const logs = auditTrail.queryLogs({
  startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  endDate: new Date(),
  userId: 'user-123',
  severity: [AuditSeverity.WARNING, AuditSeverity.CRITICAL]
})

// Get summary
const summary = auditTrail.getAuditSummary(7)
console.log(summary)
// {
//   totalEvents: 145,
//   eventsByType: { login: 10, data_read: 120, ... },
//   eventsBySeverity: { info: 130, warning: 15, ... },
//   failedEvents: 3,
//   criticalEvents: 0,
//   affectedUsers: Set(5) { 'user-1', 'user-2', ... }
// }

// Export for compliance
const csv = auditTrail.exportLogs({
  startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
})
```

### 4. Data Masking & Anonymization (`data-mask.ts`)

PII redaction, field masking, k-anonymity, l-diversity.

**Features:**
- Multiple masking strategies (redact, hash, partial, replace)
- Anonymization techniques (generalization, suppression, perturbation)
- PII detection and redaction
- K-anonymity and l-diversity checks
- Pseudonymization support

**Usage:**

```typescript
import { DataMaskingService, MaskingStrategy, PIIType } from '@/security'

const masking = new DataMaskingService()

// Define masking rules
masking.defineMaskingRule({
  fieldName: 'email',
  strategy: MaskingStrategy.PARTIAL,
  showCharacters: 3
})

masking.defineMaskingRule({
  fieldName: 'ssn',
  strategy: MaskingStrategy.REDACT
})

// Mask field
console.log(masking.maskField('email', 'user@example.com'))
// 'use***'

console.log(masking.maskField('ssn', '123-45-6789'))
// '***'

// Detect PII
const piiFindings = masking.detectPII('Contact: john@example.com or 555-123-4567')
console.log(piiFindings)
// [
//   { type: 'email', value: 'john@example.com', position: 10 },
//   { type: 'phone', value: '555-123-4567', position: 28 }
// ]

// Redact PII
const redacted = masking.redactPII('Email: john@example.com')
// 'Email: [REDACTED]'

// Check k-anonymity
const kAnonymity = masking.checkKAnonymity(records, ['age', 'zipcode'], 5)
console.log(kAnonymity)
// {
//   kValue: 8,
//   isKAnonymous: true,
//   vulnerableGroups: 0
// }
```

### 5. GDPR Compliance (`compliance/gdpr.ts`)

GDPR right to access, export, delete, and consent management.

**Features:**
- Right to access (data subject can request their data)
- Right to be forgotten (erasure)
- Right to data portability (export)
- Right to restrict processing
- Consent management and withdrawal
- Automated retention policies
- Compliance reporting

**Usage:**

```typescript
import { GDPRComplianceService, GDPRRequestType, ProcessingBasis } from '@/security'

const gdpr = new GDPRComplianceService()

// Register data subject
gdpr.registerDataSubject('user-123', 'user@example.com', 'John Doe')

// Record consent
gdpr.recordConsent(
  'user-123',
  'marketing_emails',
  ProcessingBasis.CONSENT,
  '192.168.1.1'
)

// Submit GDPR request
const request = gdpr.submitGDPRRequest(
  'user-123',
  'user@example.com',
  GDPRRequestType.ACCESS
)

// Verify request (via email token)
gdpr.verifyGDPRRequest(request.id, request.verificationToken)

// Get data export
const dataExport = gdpr.exportDataSubjectData('user-123')

// Delete data (right to be forgotten)
await gdpr.deleteDataSubject('user-123', request.id)

// Generate compliance report
const report = gdpr.generateComplianceReport()
console.log(report)
// {
//   totalDataSubjects: 1000,
//   deletedDataSubjects: 5,
//   pendingRequests: 2,
//   consentRate: 87.5,
//   dataRetentionCompliance: 95.2
// }
```

### 6. HIPAA Compliance (`compliance/hipaa.ts`)

HIPAA Protected Health Information (PHI) access control and breach reporting.

**Features:**
- PHI access audit with detailed logging
- Minimum necessary principle enforcement
- Business Associate Agreements (BAA)
- De-identification (Safe Harbor + Expert Determination)
- Breach notification and mitigation
- Access control auditing

**Usage:**

```typescript
import { HIPAAComplianceService, HIPAARole, PHICategory, DeIdentificationMethod } from '@/security'

const hipaa = new HIPAAComplianceService()

// Register PHI
hipaa.registerPHI(
  'record-123',
  'patient-456',
  [PHICategory.DIAGNOSIS, PHICategory.MEDICATION],
  'provider-789'
)

// Define minimum necessary
hipaa.defineMinimumNecessary(
  HIPAARole.PROVIDER,
  'treatment',
  ['diagnosis', 'medication', 'vitals'],
  'Medical treatment provision',
  'Dr. Smith',
  365
)

// Access PHI
const canAccess = hipaa.accessPHI(
  'record-123',
  'provider-789',
  HIPAARole.PROVIDER,
  'treatment',
  'Patient scheduled for follow-up'
)

// Sign Business Associate Agreement
hipaa.signBAA({
  id: 'baa-123',
  organizationName: 'Data Analytics Corp',
  signedAt: new Date(),
  responsibilities: ['Data processor', 'Subcontractor management'],
  dataHandlingRequirements: ['Encryption', 'Access controls'],
  breachNotificationTerms: '24-48 hours',
  auditRights: true,
  status: 'active'
})

// De-identify using Safe Harbor
const deidentified = hipaa.deidentifySafeHarbor({
  name: 'John Doe',
  email: 'john@example.com',
  ssn: '123-45-6789',
  diagnosis: 'Type 2 Diabetes',
  treatmentDate: '2024-01-15'
})
// Removes all 18 HIPAA identifiers

// Report breach
const breach = hipaa.reportBreach(
  new Date('2024-01-10'),
  50,
  [PHICategory.MEDICAL_RECORD],
  'Unauthorized access to server',
  new Date('2024-01-15'),
  new Date('2024-01-16')
)

// Audit access controls
const audit = hipaa.auditAccessControls(90)
console.log(audit)
// {
//   totalAccessAttempts: 5000,
//   authorizedAccesses: 4990,
//   deniedAccesses: 10,
//   suspiciousPatterns: []
// }

// Generate compliance report
const report = hipaa.generateComplianceReport()
```

### 7. Compliance Reports (`compliance/reports.ts`)

Multi-standard compliance reporting with remediation tracking.

**Features:**
- GDPR, HIPAA, SOC2, ISO27001, PCI-DSS, CCPA reports
- Automated control assessment
- Remediation tracking
- Compliance trend analysis
- CSV and JSON export

**Usage:**

```typescript
import { ComplianceReportsService, ComplianceStandard } from '@/security'

const reports = new ComplianceReportsService(gdprService, hipaaService)

// Generate GDPR report
const gdprReport = reports.generateGDPRReport({
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-12-31')
})

console.log(gdprReport)
// {
//   id: 'report-...',
//   standard: 'gdpr',
//   generatedAt: Date,
//   overallCompliance: 92.5,
//   sections: [
//     {
//       name: 'Lawful Basis',
//       status: 'compliant',
//       findings: ['Consent rate: 89.5%'],
//       ...
//     }
//   ]
// }

// Generate HIPAA report
const hipaaReport = reports.generateHIPAAReport({
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-12-31')
})

// Create remediation item
const remediation = reports.createRemediationItem(
  'finding-123',
  'Update BAAs',
  'Three Business Associate Agreements expired',
  'high',
  'Compliance Officer',
  new Date('2024-02-28')
)

// Track remediation
reports.updateRemediationStatus(remediation.id, 'completed', 'BAAs signed and verified')

// Get remediation summary
const summary = reports.getRemediationSummary()
console.log(summary)
// {
//   totalItems: 15,
//   openItems: 3,
//   inProgressItems: 5,
//   completedItems: 7,
//   overdueItems: 1,
//   criticalOpenItems: 0
// }

// Export report
const csv = reports.exportReportToCSV(gdprReport.id)
```

## Integration with API Gateway

```typescript
// middleware/security.ts
import {
  AuthorizationEngine,
  EncryptionService,
  AuditTrailService,
  DataMaskingService
} from '@/security'

export async function securityMiddleware(req, res, next) {
  // 1. Authenticate
  const user = await authenticateUser(req)
  
  // 2. Check authorization
  const authEngine = req.app.get('authEngine')
  const context = buildAuthContext(user)
  
  if (!authEngine.canPerformAction(context, req.resource, req.method)) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  // 3. Encrypt request body if needed
  const encryption = req.app.get('encryption')
  if (req.body.encrypted) {
    req.body = JSON.parse(encryption.decryptAtRest(req.body))
  }

  // 4. Audit log the access
  const auditTrail = req.app.get('auditTrail')
  auditTrail.logDataAccess(
    user.id,
    user.email,
    req.method.toLowerCase(),
    req.resource,
    req.resourceId
  )

  // 5. Filter response fields based on authorization
  const originalJson = res.json.bind(res)
  res.json = async function(data) {
    const filtered = await authEngine.filterFields(context, req.resource, data)
    return originalJson(filtered)
  }

  // 6. Mask PII in response
  const masking = req.app.get('dataMasking')
  res.json = (data) => {
    const masked = masking.maskRecord(req.resource, data)
    return originalJson(masked)
  }

  next()
}
```

## Integration with Database Layer

```typescript
// Integrate with WAVE 6 Distributed Database
import { DistributedDatabase } from '@/database'
import { AuthorizationEngine } from '@/security'

export async function secureQuery(
  db: DistributedDatabase,
  auth: AuthorizationEngine,
  context: AuthorizationContext,
  tableName: string,
  query: any
) {
  // Apply row-level security
  const rlsPredicate = auth.getRLSPredicate(context, tableName)
  if (rlsPredicate) {
    query.where = {
      ...query.where,
      _rls: rlsPredicate
    }
  }

  // Execute query
  const results = await db.query(query)

  // Apply field-level filtering
  const filtered = []
  for (const row of results) {
    const allowed = await auth.filterFields(context, tableName, row)
    filtered.push(allowed)
  }

  return filtered
}
```

## Configuration Example

```typescript
// security.config.ts
import { initializeSecurityLayer } from '@/security'

export function initializeSecurity() {
  const security = initializeSecurityLayer()

  // Configure RBAC roles
  security.authorization.defineRole('data_scientist', {
    name: 'data_scientist',
    description: 'Data science research and analysis',
    permissions: ['read:public', 'read:internal', 'write:own', 'export:data'],
    dataAccessLevel: 'team',
    fieldAccessLevel: 'limited'
  })

  // Configure field-level permissions
  security.authorization.defineFieldPermissions(
    'users',
    'data_scientist',
    [
      { fieldName: 'id', canRead: true, canWrite: false, canDelete: false },
      { fieldName: 'email', canRead: true, canWrite: false, canDelete: false, requiresMasking: true },
      { fieldName: 'name', canRead: true, canWrite: false, canDelete: false }
    ]
  )

  // Configure encryption
  security.encryption.setKeyRotationPolicy(keyId, {
    enabled: true,
    rotationIntervalDays: 90,
    retentionDays: 365,
    algorithm: 'aes-256-gcm',
    autoRotate: true
  })

  // Configure GDPR retention
  security.gdprCompliance.defineRetentionPolicy({
    dataCategory: 'user_account',
    retentionDays: 365,
    basisForRetention: 'consent',
    deletionMethod: 'pseudonymize'
  })

  // Configure HIPAA minimum necessary
  security.hipaaCompliance.defineMinimumNecessary(
    'provider',
    'treatment',
    ['diagnosis', 'medication', 'vitals'],
    'Patient treatment provision',
    'CISO',
    365
  )

  return security
}
```

## Testing

```typescript
// security.test.ts
import { AuthorizationEngine, DataClassification } from '@/security'

describe('Authorization Engine', () => {
  let authEngine: AuthorizationEngine

  beforeEach(() => {
    authEngine = new AuthorizationEngine()
  })

  it('should deny access to PII for non-authorized users', async () => {
    authEngine.registerResource({
      name: 'users',
      ownershipField: 'userId',
      defaultClassification: DataClassification.INTERNAL,
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

    const context = {
      userId: 'user-123',
      email: 'user@example.com',
      roles: ['viewer'],
      attributes: new Map(),
      permissions: new Set(['read:public']),
      teams: [],
      timestamp: new Date()
    }

    const result = await authEngine.checkFieldAuthorization(
      context,
      'users',
      'email',
      'read'
    )

    expect(result.canRead).toBe(false)
    expect(result.maskingRequired).toBe(true)
  })
})
```

## Best Practices

1. **Field-Level Security:** Always define field classification and permissions
2. **Encryption:** Encrypt PII and sensitive data at-rest and in-transit
3. **Audit Trail:** Log all sensitive operations for compliance
4. **Data Masking:** Apply masking for non-authorized users
5. **Key Rotation:** Enable automatic key rotation for encryption keys
6. **Compliance:** Run regular compliance reports (monthly for GDPR, quarterly for HIPAA)
7. **Remediation:** Track and close remediation items promptly
8. **Training:** Ensure team understands security policies

## Performance Considerations

- Field authorization checks are O(1) - use caching for frequent lookups
- Encryption/decryption: AES-256-GCM ~1-2ms per operation
- Audit trail: O(log n) with indexed queries
- Masking: O(n) where n is field count in record
- For high-throughput systems, batch encrypt/decrypt operations

## References

- GDPR: https://gdpr-info.eu/
- HIPAA: https://www.hhs.gov/hipaa/
- NIST Cybersecurity Framework: https://www.nist.gov/cyberframework
- OWASP: https://owasp.org/
