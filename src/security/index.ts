// WAVE 8D: Security & Compliance - Main Export
// Comprehensive security layer with field-level access control, encryption, and compliance

export {
  AuthorizationEngine,
  AuthorizationContext,
  FieldAuthResult,
  DataClassification,
  FieldMetadata,
  ResourceDefinition,
  ABACPolicy,
  ABACCondition,
  RLSPolicy,
  FieldPermission,
  RoleDefinition
} from './authorization'

export {
  EncryptionService,
  EncryptionAlgorithm,
  EncryptionKey,
  EncryptedData,
  KeyRotationPolicy,
  TLSConfig,
  encryptionService
} from './encryption'

export {
  AuditTrailService,
  AuditEventType,
  AuditEvent,
  AuditSeverity,
  AuditLogEntry,
  AuditLogFilter,
  auditTrailService
} from './audit-trail'

export {
  DataMaskingService,
  MaskingStrategy,
  MaskingRule,
  AnonymizationTechnique,
  AnonymizationRule,
  PIIType,
  FieldPermission,
  dataMaskingService
} from './data-mask'

export {
  GDPRComplianceService,
  GDPRRequestType,
  GDPRRequestStatus,
  GDPRRequest,
  DataSubject,
  ConsentRecord,
  ProcessingBasis,
  DataRetentionPolicy,
  gdprComplianceService
} from './compliance/gdpr'

export {
  HIPAAComplianceService,
  HIPAARole,
  PHICategory,
  ComplianceStatus,
  MinimumNecessary,
  BusinessAssociateAgreement,
  DeIdentificationMethod,
  HIPAAAccessLog,
  HIPAABreach,
  hipaaComplianceService
} from './compliance/hipaa'

export {
  ComplianceReportsService,
  ComplianceStandard,
  ComplianceReport,
  ComplianceSection,
  RemediationItem,
  createComplianceReportsService
} from './compliance/reports'

/**
 * Integrated Security Context
 */
export interface SecurityContext {
  authorization: AuthorizationEngine
  encryption: EncryptionService
  auditTrail: EncryptionService
  dataMasking: DataMaskingService
  gdprCompliance: GDPRComplianceService
  hipaaCompliance: HIPAAComplianceService
}

/**
 * Initialize complete security infrastructure
 */
export function initializeSecurityLayer(): {
  authorization: AuthorizationEngine
  encryption: EncryptionService
  auditTrail: import('./audit-trail').AuditTrailService
  dataMasking: DataMaskingService
  gdprCompliance: GDPRComplianceService
  hipaaCompliance: HIPAAComplianceService
} {
  const authorization = new AuthorizationEngine()
  const encryption = new EncryptionService()
  const { auditTrailService } = require('./audit-trail')
  const dataMasking = new DataMaskingService()
  const gdprCompliance = new GDPRComplianceService()
  const hipaaCompliance = new HIPAAComplianceService()

  return {
    authorization,
    encryption,
    auditTrail: auditTrailService,
    dataMasking,
    gdprCompliance,
    hipaaCompliance
  }
}
