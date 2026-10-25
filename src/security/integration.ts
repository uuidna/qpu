// WAVE 8D: Security Integration Layer
// Middleware and hooks for API gateway and database layer integration

import {
  AuthorizationEngine,
  AuthorizationContext,
  EncryptionService,
  AuditTrailService,
  DataMaskingService,
  GDPRComplianceService,
  HIPAAComplianceService
} from './index'
import { AuditEventType, AuditSeverity } from './audit-trail'

/**
 * Secure Request Interface
 */
export interface SecureRequest {
  headers: Record<string, string>
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  body?: any
  query?: Record<string, any>
  userId?: string
  userEmail?: string
  userRoles?: string[]
  ipAddress?: string
  userAgent?: string
}

/**
 * Security middleware for API Gateway
 */
export class SecurityMiddleware {
  constructor(
    private authorization: AuthorizationEngine,
    private encryption: EncryptionService,
    private auditTrail: AuditTrailService,
    private dataMasking: DataMaskingService,
    private gdprCompliance: GDPRComplianceService,
    private hipaaCompliance: HIPAAComplianceService
  ) {}

  /**
   * Process secure request
   */
  async processSecureRequest(req: SecureRequest): Promise<{
    authorized: boolean
    context: AuthorizationContext | null
    error?: string
  }> {
    // 1. Authenticate and build context
    const context = this.buildAuthContext(req)
    if (!context) {
      return {
        authorized: false,
        context: null,
        error: 'Authentication failed'
      }
    }

    // 2. Check authorization
    const resource = this.extractResource(req.path)
    const action = req.method.toLowerCase()

    if (!this.authorization.canPerformAction(context, resource, action)) {
      // Log unauthorized attempt
      this.auditTrail.logEvent({
        eventType: AuditEventType.SECURITY_POLICY_VIOLATED,
        severity: AuditSeverity.WARNING,
        userId: context.userId,
        userEmail: context.email,
        action: `Unauthorized ${action} on ${resource}`,
        resource: { type: resource, id: req.path },
        details: {
          method: req.method,
          path: req.path,
          denialReason: 'Insufficient permissions'
        },
        ipAddress: req.ipAddress,
        userAgent: req.userAgent,
        status: 'failure'
      })

      return {
        authorized: false,
        context: null,
        error: 'Insufficient permissions'
      }
    }

    // 3. Check GDPR restrictions
    if (req.body?.inclusPII || action === 'DELETE') {
      const dataSubject = await this.checkGDPRRestrictions(context.userId)
      if (!dataSubject) {
        return {
          authorized: false,
          context,
          error: 'Data subject has restrictions'
        }
      }
    }

    // 4. Check HIPAA requirements
    if (req.path.includes('/phi')) {
      const canAccessPHI = this.hipaaCompliance.accessPHI(
        req.path,
        context.userId,
        'provider',
        'api_access',
        `API request: ${req.method} ${req.path}`
      )

      if (!canAccessPHI) {
        return {
          authorized: false,
          context,
          error: 'PHI access denied'
        }
      }
    }

    // 5. Audit the access
    this.auditTrail.logDataAccess(
      context.userId,
      context.email,
      action as 'read' | 'create' | 'update' | 'delete',
      resource,
      this.extractResourceId(req.path),
      undefined,
      {
        method: req.method,
        path: req.path
      }
    )

    return {
      authorized: true,
      context
    }
  }

  /**
   * Decrypt request body if needed
   */
  async decryptRequestBody(req: SecureRequest): Promise<any> {
    if (!req.body?.encrypted) return req.body

    try {
      const decryptedData = this.encryption.decryptAtRest(req.body)
      return JSON.parse(decryptedData)
    } catch (error) {
      throw new Error('Failed to decrypt request body')
    }
  }

  /**
   * Filter response based on authorization
   */
  async filterResponse(
    context: AuthorizationContext,
    resource: string,
    data: any
  ): Promise<any> {
    if (Array.isArray(data)) {
      return Promise.all(
        data.map((item) => this.filterResponse(context, resource, item))
      )
    }

    // Apply field-level filtering
    const filtered = await this.authorization.filterFields(
      context,
      resource,
      data,
      'read'
    )

    // Apply data masking for non-privileged users
    if (!this.hasHighPrivilege(context)) {
      return this.dataMasking.maskRecord(resource, filtered)
    }

    return filtered
  }

  /**
   * Encrypt response if needed
   */
  encryptResponse(data: any): string {
    const encrypted = this.encryption.encryptAtRest(JSON.stringify(data))
    return JSON.stringify(encrypted)
  }

  /**
   * Build authorization context from request
   */
  private buildAuthContext(req: SecureRequest): AuthorizationContext | null {
    if (!req.userId || !req.userEmail) {
      return null
    }

    return {
      userId: req.userId,
      email: req.userEmail,
      roles: req.userRoles || [],
      attributes: new Map(),
      permissions: new Set(),
      teams: [],
      ipAddress: req.ipAddress,
      timestamp: new Date()
    }
  }

  /**
   * Check GDPR restrictions
   */
  private async checkGDPRRestrictions(userId: string): Promise<boolean> {
    try {
      // Check if user has active GDPR delete request
      const requests = this.gdprCompliance.getDataSubjectRequests(userId)
      const pendingDelete = requests.some(
        (r) =>
          r.requestType === 'delete' &&
          r.status === 'in_progress'
      )

      return !pendingDelete
    } catch {
      return true
    }
  }

  /**
   * Extract resource from path
   */
  private extractResource(path: string): string {
    const parts = path.split('/')
    return parts[1] || 'unknown'
  }

  /**
   * Extract resource ID from path
   */
  private extractResourceId(path: string): string {
    const parts = path.split('/')
    return parts[2] || 'unknown'
  }

  /**
   * Check if user has high privilege
   */
  private hasHighPrivilege(context: AuthorizationContext): boolean {
    return context.roles.some((r) => ['admin', 'dpa', 'data_owner'].includes(r))
  }
}

/**
 * Database query security wrapper
 */
export class SecureDatabaseQuery {
  constructor(
    private authorization: AuthorizationEngine,
    private auditTrail: AuditTrailService
  ) {}

  /**
   * Apply security to SELECT query
   */
  applySelectSecurity(
    context: AuthorizationContext,
    tableName: string,
    query: any
  ): any {
    // Apply row-level security
    const rlsPredicate = this.authorization.getRLSPredicate(context, tableName)

    if (rlsPredicate) {
      query = {
        ...query,
        where: {
          ...query.where,
          _rls: rlsPredicate
        }
      }
    }

    // Restrict fields based on authorization
    if (query.select) {
      const allowedFields = query.select.filter((field: string) =>
        this.canAccessField(context, tableName, field)
      )
      query.select = allowedFields
    }

    return query
  }

  /**
   * Apply security to INSERT query
   */
  async applyInsertSecurity(
    context: AuthorizationContext,
    tableName: string,
    data: Record<string, any>
  ): Promise<Record<string, any>> {
    // Filter fields based on write permissions
    const filtered: Record<string, any> = {}

    for (const [key, value] of Object.entries(data)) {
      if (this.canWriteField(context, tableName, key)) {
        filtered[key] = value
      }
    }

    // Audit the insert
    this.auditTrail.logDataAccess(
      context.userId,
      context.email,
      'create',
      tableName,
      'new',
      undefined,
      { fieldsWritten: Object.keys(filtered).length }
    )

    return filtered
  }

  /**
   * Apply security to UPDATE query
   */
  async applyUpdateSecurity(
    context: AuthorizationContext,
    tableName: string,
    data: Record<string, any>
  ): Promise<Record<string, any>> {
    // Filter fields based on write permissions
    const filtered: Record<string, any> = {}

    for (const [key, value] of Object.entries(data)) {
      if (this.canWriteField(context, tableName, key)) {
        filtered[key] = value
      }
    }

    // Audit the update
    this.auditTrail.logDataAccess(
      context.userId,
      context.email,
      'update',
      tableName,
      'updated_record',
      undefined,
      { fieldsUpdated: Object.keys(filtered).length }
    )

    return filtered
  }

  /**
   * Apply security to DELETE query
   */
  async applyDeleteSecurity(
    context: AuthorizationContext,
    tableName: string,
    recordId: string
  ): Promise<boolean> {
    // Check delete permission
    if (!this.authorization.canPerformAction(context, tableName, 'delete')) {
      return false
    }

    // Audit the delete
    this.auditTrail.logDataAccess(
      context.userId,
      context.email,
      'delete',
      tableName,
      recordId
    )

    return true
  }

  /**
   * Check if user can access field
   */
  private canAccessField(
    context: AuthorizationContext,
    tableName: string,
    fieldName: string
  ): boolean {
    // For now, allow if user has read permission on table
    // In production, check field-level permissions
    return this.authorization.canPerformAction(context, tableName, 'read')
  }

  /**
   * Check if user can write field
   */
  private canWriteField(
    context: AuthorizationContext,
    tableName: string,
    fieldName: string
  ): boolean {
    // For now, allow if user has write permission on table
    // In production, check field-level permissions
    return this.authorization.canPerformAction(context, tableName, 'write')
  }
}

/**
 * Security event handler
 */
export class SecurityEventHandler {
  constructor(
    private auditTrail: AuditTrailService,
    private gdprCompliance: GDPRComplianceService,
    private hipaaCompliance: HIPAAComplianceService
  ) {}

  /**
   * Handle data retention expiry
   */
  async handleRetentionExpiry(): Promise<void> {
    // Check GDPR retention
    const gdprExpired = this.gdprCompliance.checkDataRetention()
    for (const item of gdprExpired) {
      this.auditTrail.logEvent({
        eventType: AuditEventType.DATA_RETENTION_EXPIRED,
        severity: AuditSeverity.INFO,
        userId: 'system',
        userEmail: 'system@qpu.internal',
        action: item.reason,
        resource: { type: 'user', id: item.dataSubjectId },
        details: { reason: item.reason },
        status: 'success'
      })
    }
  }

  /**
   * Handle security anomaly
   */
  async handleSecurityAnomaly(
    anomalyType: string,
    details: Record<string, any>,
    severity: AuditSeverity = AuditSeverity.WARNING
  ): Promise<void> {
    this.auditTrail.logEvent({
      eventType: AuditEventType.ANOMALY_DETECTED,
      severity,
      userId: 'system',
      userEmail: 'system@qpu.internal',
      action: `Security anomaly detected: ${anomalyType}`,
      resource: { type: 'security_event', id: anomalyType },
      details,
      status: 'success'
    })
  }

  /**
   * Handle breach notification
   */
  async handleBreach(
    breachDate: Date,
    affectedCount: number,
    description: string
  ): Promise<void> {
    const breach = this.hipaaCompliance.reportBreach(
      breachDate,
      affectedCount,
      [],
      description,
      new Date(),
      new Date()
    )

    this.auditTrail.logEvent({
      eventType: AuditEventType.SECURITY_POLICY_VIOLATED,
      severity: AuditSeverity.CRITICAL,
      userId: 'system',
      userEmail: 'system@qpu.internal',
      action: 'Security breach reported',
      resource: { type: 'breach', id: breach.id },
      details: {
        affectedCount,
        description
      },
      status: 'failure'
    })
  }
}

/**
 * Initialize integrated security layer
 */
export function initializeIntegratedSecurity(
  authorization: AuthorizationEngine,
  encryption: EncryptionService,
  auditTrail: AuditTrailService,
  dataMasking: DataMaskingService,
  gdprCompliance: GDPRComplianceService,
  hipaaCompliance: HIPAAComplianceService
): {
  middleware: SecurityMiddleware
  dbQuery: SecureDatabaseQuery
  eventHandler: SecurityEventHandler
} {
  return {
    middleware: new SecurityMiddleware(
      authorization,
      encryption,
      auditTrail,
      dataMasking,
      gdprCompliance,
      hipaaCompliance
    ),
    dbQuery: new SecureDatabaseQuery(authorization, auditTrail),
    eventHandler: new SecurityEventHandler(auditTrail, gdprCompliance, hipaaCompliance)
  }
}
