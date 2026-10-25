// WAVE 8D: Immutable Audit Trail
// Compliant logging, immutable event storage, forensic analysis

/**
 * Audit event types
 */
export enum AuditEventType {
  // Authentication events
  LOGIN = 'login',
  LOGOUT = 'logout',
  LOGIN_FAILED = 'login_failed',
  TOKEN_GENERATED = 'token_generated',
  TOKEN_REVOKED = 'token_revoked',

  // Authorization events
  PERMISSION_GRANTED = 'permission_granted',
  PERMISSION_REVOKED = 'permission_revoked',
  ROLE_ASSIGNED = 'role_assigned',
  ROLE_REMOVED = 'role_removed',
  POLICY_CREATED = 'policy_created',
  POLICY_UPDATED = 'policy_updated',
  POLICY_DELETED = 'policy_deleted',

  // Data access events
  DATA_READ = 'data_read',
  DATA_CREATED = 'data_created',
  DATA_UPDATED = 'data_updated',
  DATA_DELETED = 'data_deleted',
  DATA_EXPORTED = 'data_exported',
  PII_ACCESSED = 'pii_accessed',

  // Encryption events
  KEY_CREATED = 'key_created',
  KEY_ROTATED = 'key_rotated',
  KEY_REVOKED = 'key_revoked',
  DATA_ENCRYPTED = 'data_encrypted',
  DATA_DECRYPTED = 'data_decrypted',

  // Compliance events
  GDPR_REQUEST = 'gdpr_request',
  DATA_RETENTION_EXPIRED = 'data_retention_expired',
  COMPLIANCE_REPORT_GENERATED = 'compliance_report_generated',

  // Security events
  SECURITY_POLICY_VIOLATED = 'security_policy_violated',
  ANOMALY_DETECTED = 'anomaly_detected',
  THREAT_RESPONSE = 'threat_response',

  // System events
  SYSTEM_CONFIG_CHANGED = 'system_config_changed',
  BACKUP_CREATED = 'backup_created',
  BACKUP_RESTORED = 'backup_restored'
}

/**
 * Audit severity level
 */
export enum AuditSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

/**
 * Audit event
 */
export interface AuditEvent {
  id: string
  timestamp: Date
  eventType: AuditEventType
  severity: AuditSeverity
  userId: string
  userEmail: string
  action: string
  resource: {
    type: string
    id: string
    name?: string
  }
  details: Record<string, any>
  ipAddress?: string
  userAgent?: string
  status: 'success' | 'failure'
  errorMessage?: string
  metadata?: Record<string, any>
  immutable: boolean
  hash?: string // For integrity verification
  previousHash?: string // For chain integrity
}

/**
 * Audit log query filter
 */
export interface AuditLogFilter {
  startDate?: Date
  endDate?: Date
  userId?: string
  eventType?: AuditEventType | AuditEventType[]
  severity?: AuditSeverity | AuditSeverity[]
  resourceType?: string
  resourceId?: string
  status?: 'success' | 'failure'
  limit?: number
  offset?: number
}

/**
 * Audit Log Entry (immutable storage)
 */
export interface AuditLogEntry {
  sequenceNumber: bigint
  event: AuditEvent
  storedAt: Date
  readOnlyAt: Date
  retentionExpiresAt: Date
}

/**
 * Audit Trail Service
 */
export class AuditTrailService {
  private events: Map<string, AuditLogEntry> = new Map()
  private eventIndex: Map<string, string[]> = new Map() // userId -> [eventIds]
  private sequenceCounter: bigint = 0n
  private lastEventHash: string | null = null

  /**
   * Log audit event
   */
  logEvent(event: Omit<AuditEvent, 'id' | 'hash' | 'previousHash'>): AuditLogEntry {
    const eventId = 'audit-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
    const sequenceNumber = this.sequenceCounter++

    // Calculate hash for integrity
    const eventHash = this.calculateHash(event)

    const fullEvent: AuditEvent = {
      ...event,
      id: eventId,
      hash: eventHash,
      previousHash: this.lastEventHash || undefined,
      immutable: true
    }

    const now = new Date()
    const entry: AuditLogEntry = {
      sequenceNumber,
      event: fullEvent,
      storedAt: now,
      readOnlyAt: new Date(now.getTime() + 5 * 60 * 1000), // 5 minutes until read-only
      retentionExpiresAt: this.calculateRetentionExpiry(event.details)
    }

    this.events.set(eventId, entry)
    this.lastEventHash = eventHash

    // Update index
    if (!this.eventIndex.has(event.userId)) {
      this.eventIndex.set(event.userId, [])
    }
    this.eventIndex.get(event.userId)!.push(eventId)

    return entry
  }

  /**
   * Log user authentication
   */
  logAuthenticationEvent(
    userId: string,
    email: string,
    success: boolean,
    ipAddress?: string,
    userAgent?: string,
    error?: string
  ): AuditLogEntry {
    return this.logEvent({
      eventType: success ? AuditEventType.LOGIN : AuditEventType.LOGIN_FAILED,
      severity: success ? AuditSeverity.INFO : AuditSeverity.WARNING,
      userId,
      userEmail: email,
      action: success ? 'User logged in' : 'Login attempt failed',
      resource: { type: 'user', id: userId },
      details: {
        email,
        success
      },
      ipAddress,
      userAgent,
      status: success ? 'success' : 'failure',
      errorMessage: error
    })
  }

  /**
   * Log data access
   */
  logDataAccess(
    userId: string,
    userEmail: string,
    action: 'read' | 'create' | 'update' | 'delete' | 'export',
    resourceType: string,
    resourceId: string,
    resourceName?: string,
    details?: Record<string, any>
  ): AuditLogEntry {
    const eventTypeMap = {
      read: AuditEventType.DATA_READ,
      create: AuditEventType.DATA_CREATED,
      update: AuditEventType.DATA_UPDATED,
      delete: AuditEventType.DATA_DELETED,
      export: AuditEventType.DATA_EXPORTED
    }

    return this.logEvent({
      eventType: eventTypeMap[action],
      severity: action === 'delete' ? AuditSeverity.WARNING : AuditSeverity.INFO,
      userId,
      userEmail,
      action: `Data ${action}: ${resourceType}/${resourceId}`,
      resource: { type: resourceType, id: resourceId, name: resourceName },
      details: details || {},
      status: 'success'
    })
  }

  /**
   * Log PII access
   */
  logPIIAccess(
    userId: string,
    userEmail: string,
    piiType: string,
    resourceId: string,
    justification?: string
  ): AuditLogEntry {
    return this.logEvent({
      eventType: AuditEventType.PII_ACCESSED,
      severity: AuditSeverity.WARNING,
      userId,
      userEmail,
      action: `PII accessed: ${piiType}`,
      resource: { type: 'pii', id: resourceId },
      details: {
        piiType,
        justification
      },
      status: 'success'
    })
  }

  /**
   * Log security policy violation
   */
  logPolicyViolation(
    userId: string,
    userEmail: string,
    policyName: string,
    violationType: string,
    details: Record<string, any>
  ): AuditLogEntry {
    return this.logEvent({
      eventType: AuditEventType.SECURITY_POLICY_VIOLATED,
      severity: AuditSeverity.CRITICAL,
      userId,
      userEmail,
      action: `Policy violation: ${policyName}`,
      resource: { type: 'policy', id: policyName },
      details: {
        violationType,
        ...details
      },
      status: 'failure'
    })
  }

  /**
   * Log encryption key event
   */
  logKeyEvent(
    eventType: AuditEventType.KEY_CREATED | AuditEventType.KEY_ROTATED | AuditEventType.KEY_REVOKED,
    userId: string,
    userEmail: string,
    keyId: string,
    algorithm?: string
  ): AuditLogEntry {
    return this.logEvent({
      eventType,
      severity: AuditSeverity.WARNING,
      userId,
      userEmail,
      action: `Encryption key ${eventType.replace('key_', '')}: ${keyId}`,
      resource: { type: 'encryption_key', id: keyId },
      details: { algorithm },
      status: 'success'
    })
  }

  /**
   * Log GDPR request
   */
  logGDPRRequest(
    userId: string,
    userEmail: string,
    requestType: 'export' | 'delete' | 'rectify' | 'restrict',
    dataSubjectId: string
  ): AuditLogEntry {
    return this.logEvent({
      eventType: AuditEventType.GDPR_REQUEST,
      severity: AuditSeverity.WARNING,
      userId,
      userEmail,
      action: `GDPR ${requestType} request`,
      resource: { type: 'user', id: dataSubjectId },
      details: { requestType },
      status: 'success'
    })
  }

  /**
   * Query audit logs
   */
  queryLogs(filter: AuditLogFilter): AuditLogEntry[] {
    let results = Array.from(this.events.values())

    if (filter.startDate) {
      results = results.filter((e) => e.event.timestamp >= filter.startDate!)
    }

    if (filter.endDate) {
      results = results.filter((e) => e.event.timestamp <= filter.endDate!)
    }

    if (filter.userId) {
      results = results.filter((e) => e.event.userId === filter.userId)
    }

    if (filter.eventType) {
      const types = Array.isArray(filter.eventType) ? filter.eventType : [filter.eventType]
      results = results.filter((e) => types.includes(e.event.eventType))
    }

    if (filter.severity) {
      const severities = Array.isArray(filter.severity) ? filter.severity : [filter.severity]
      results = results.filter((e) => severities.includes(e.event.severity))
    }

    if (filter.resourceType) {
      results = results.filter((e) => e.event.resource.type === filter.resourceType)
    }

    if (filter.resourceId) {
      results = results.filter((e) => e.event.resource.id === filter.resourceId)
    }

    if (filter.status) {
      results = results.filter((e) => e.event.status === filter.status)
    }

    results.sort((a, b) => b.event.timestamp.getTime() - a.event.timestamp.getTime())

    if (filter.limit) {
      results = results.slice(filter.offset || 0, (filter.offset || 0) + filter.limit)
    }

    return results
  }

  /**
   * Get events for user
   */
  getUserEvents(userId: string, limit: number = 100): AuditLogEntry[] {
    const eventIds = this.eventIndex.get(userId) || []
    return eventIds
      .slice(-limit)
      .reverse()
      .map((id) => this.events.get(id)!)
      .filter(Boolean)
  }

  /**
   * Verify event integrity
   */
  verifyEventIntegrity(eventId: string): boolean {
    const entry = this.events.get(eventId)
    if (!entry) return false

    const event = entry.event
    const calculatedHash = this.calculateHash(event)
    return calculatedHash === event.hash
  }

  /**
   * Verify chain integrity
   */
  verifyChainIntegrity(): boolean {
    const entries = Array.from(this.events.values()).sort((a, b) =>
      Number(a.sequenceNumber - b.sequenceNumber)
    )

    for (let i = 0; i < entries.length; i++) {
      const event = entries[i].event

      if (i === 0) {
        if (event.previousHash !== undefined) return false
      } else {
        const previousEvent = entries[i - 1].event
        if (event.previousHash !== previousEvent.hash) return false
      }
    }

    return true
  }

  /**
   * Get audit summary
   */
  getAuditSummary(days: number = 7): {
    totalEvents: number
    eventsByType: Record<string, number>
    eventsBySeverity: Record<string, number>
    failedEvents: number
    criticalEvents: number
    affectedUsers: Set<string>
  } {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const entries = this.queryLogs({ startDate })

    const summary = {
      totalEvents: entries.length,
      eventsByType: {} as Record<string, number>,
      eventsBySeverity: {} as Record<string, number>,
      failedEvents: 0,
      criticalEvents: 0,
      affectedUsers: new Set<string>()
    }

    for (const entry of entries) {
      const event = entry.event

      // Count by type
      summary.eventsByType[event.eventType] = (summary.eventsByType[event.eventType] || 0) + 1

      // Count by severity
      summary.eventsBySeverity[event.severity] = (summary.eventsBySeverity[event.severity] || 0) + 1

      // Count failures
      if (event.status === 'failure') summary.failedEvents++

      // Count critical
      if (event.severity === AuditSeverity.CRITICAL) summary.criticalEvents++

      // Track users
      summary.affectedUsers.add(event.userId)
    }

    return summary
  }

  /**
   * Export audit logs for compliance
   */
  exportLogs(filter: AuditLogFilter): string {
    const entries = this.queryLogs(filter)
    const csvHeader = 'Timestamp,EventType,Severity,UserId,Action,ResourceType,ResourceId,Status,IpAddress'
    const csvRows = entries.map((e) =>
      [
        e.event.timestamp.toISOString(),
        e.event.eventType,
        e.event.severity,
        e.event.userId,
        e.event.action,
        e.event.resource.type,
        e.event.resource.id,
        e.event.status,
        e.event.ipAddress || ''
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    )

    return [csvHeader, ...csvRows].join('\n')
  }

  /**
   * Calculate event hash
   */
  private calculateHash(event: Partial<AuditEvent>): string {
    const { crypto } = require('crypto')
    const eventString = JSON.stringify({
      eventType: event.eventType,
      timestamp: event.timestamp,
      userId: event.userId,
      action: event.action,
      resourceId: event.resource?.id,
      status: event.status
    })
    return crypto.createHash('sha256').update(eventString).digest('hex')
  }

  /**
   * Calculate retention expiry based on event details
   */
  private calculateRetentionExpiry(details: Record<string, any>): Date {
    const expiryDate = new Date()

    // GDPR: 30 days for failed login attempts
    if (details.eventType === AuditEventType.LOGIN_FAILED) {
      expiryDate.setDate(expiryDate.getDate() + 30)
      return expiryDate
    }

    // Default: 7 years for compliance
    expiryDate.setFullYear(expiryDate.getFullYear() + 7)
    return expiryDate
  }

  /**
   * Get retention statistics
   */
  getRetentionStatistics(): {
    totalLogs: number
    logsExpiringSoon: number
    averageRetentionDays: number
  } {
    const entries = Array.from(this.events.values())
    const now = new Date()
    const thirtyDaysAway = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    const logsExpiringSoon = entries.filter(
      (e) => e.retentionExpiresAt <= thirtyDaysAway && e.retentionExpiresAt > now
    ).length

    const averageRetentionDays =
      entries.length > 0
        ? Math.round(
            entries.reduce((sum, e) => sum + (e.retentionExpiresAt.getTime() - e.storedAt.getTime()), 0) /
              entries.length /
              (24 * 60 * 60 * 1000)
          )
        : 0

    return {
      totalLogs: entries.length,
      logsExpiringSoon,
      averageRetentionDays
    }
  }
}

/**
 * Create global audit trail service
 */
export const auditTrailService = new AuditTrailService()
