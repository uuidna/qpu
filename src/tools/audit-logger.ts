/**
 * Audit Logger
 * Comprehensive logging of all operations for compliance and debugging
 * Records: execution, changes, decisions, errors
 */

import { ExecutionResult } from '../core/index.js'

// ============================================================================
// AUDIT TYPES
// ============================================================================

export type AuditLevel = 'info' | 'warn' | 'error' | 'critical' | 'audit'

export interface AuditLogEntry {
  id: string
  timestamp: Date
  level: AuditLevel
  operation: string
  action: string
  userId?: string
  inputs?: Record<string, unknown>
  result?: ExecutionResult
  duration?: number
  metadata?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
}

export interface AuditQuery {
  operation?: string
  level?: AuditLevel
  startTime?: Date
  endTime?: Date
  userId?: string
  limit?: number
  offset?: number
}

// ============================================================================
// AUDIT LOGGER
// ============================================================================

export class AuditLogger {
  private logs: AuditLogEntry[] = []
  private maxLogs: number = 10000

  /**
   * Log operation execution
   */
  logExecution(
    operation: string,
    inputs: Record<string, unknown>,
    result: ExecutionResult,
    duration: number,
    userId?: string,
    metadata?: Record<string, unknown>
  ): string {
    const id = `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`

    const entry: AuditLogEntry = {
      id,
      timestamp: new Date(),
      level: result.success ? 'info' : 'warn',
      operation,
      action: 'execute',
      userId,
      inputs,
      result,
      duration,
      metadata
    }

    this.addLog(entry)
    return id
  }

  /**
   * Log error
   */
  logError(
    operation: string,
    error: Error | string,
    userId?: string,
    context?: Record<string, unknown>
  ): string {
    const id = `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`

    const entry: AuditLogEntry = {
      id,
      timestamp: new Date(),
      level: 'error',
      operation,
      action: 'error',
      userId,
      result: {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      },
      metadata: context
    }

    this.addLog(entry)
    return id
  }

  /**
   * Log critical issue
   */
  logCritical(
    operation: string,
    message: string,
    userId?: string,
    context?: Record<string, unknown>
  ): string {
    const id = `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`

    const entry: AuditLogEntry = {
      id,
      timestamp: new Date(),
      level: 'critical',
      operation,
      action: 'critical',
      userId,
      result: {
        success: false,
        error: message
      },
      metadata: context
    }

    this.addLog(entry)
    console.error(`[CRITICAL] ${operation}: ${message}`)
    return id
  }

  /**
   * Log audit event (compliance/security)
   */
  logAudit(
    operation: string,
    action: string,
    details: Record<string, unknown>,
    userId?: string
  ): string {
    const id = `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`

    const entry: AuditLogEntry = {
      id,
      timestamp: new Date(),
      level: 'audit',
      operation,
      action,
      userId,
      metadata: details
    }

    this.addLog(entry)
    return id
  }

  /**
   * Add log entry
   */
  private addLog(entry: AuditLogEntry): void {
    this.logs.push(entry)

    // Trim old logs if exceeding max
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }
  }

  /**
   * Query audit logs
   */
  query(query: AuditQuery): AuditLogEntry[] {
    let results = [...this.logs]

    if (query.operation) {
      results = results.filter(log => log.operation === query.operation)
    }

    if (query.level) {
      results = results.filter(log => log.level === query.level)
    }

    if (query.startTime) {
      results = results.filter(log => log.timestamp >= query.startTime!)
    }

    if (query.endTime) {
      results = results.filter(log => log.timestamp <= query.endTime!)
    }

    if (query.userId) {
      results = results.filter(log => log.userId === query.userId)
    }

    // Apply pagination
    const offset = query.offset || 0
    const limit = query.limit || 100
    return results.slice(offset, offset + limit)
  }

  /**
   * Get logs for operation
   */
  getOperationLogs(operation: string, limit: number = 100): AuditLogEntry[] {
    return this.logs
      .filter(log => log.operation === operation)
      .slice(-limit)
  }

  /**
   * Get logs for user
   */
  getUserLogs(userId: string, limit: number = 100): AuditLogEntry[] {
    return this.logs
      .filter(log => log.userId === userId)
      .slice(-limit)
  }

  /**
   * Get error logs
   */
  getErrors(limit: number = 100): AuditLogEntry[] {
    return this.logs
      .filter(log => log.level === 'error' || log.level === 'critical')
      .slice(-limit)
  }

  /**
   * Get critical logs
   */
  getCritical(): AuditLogEntry[] {
    return this.logs.filter(log => log.level === 'critical')
  }

  /**
   * Get audit events (compliance)
   */
  getAuditEvents(limit: number = 100): AuditLogEntry[] {
    return this.logs
      .filter(log => log.level === 'audit')
      .slice(-limit)
  }

  /**
   * Generate audit report
   */
  generateReport(startTime?: Date, endTime?: Date): {
    totalLogs: number
    byLevel: Record<AuditLevel, number>
    byOperation: Record<string, number>
    errors: AuditLogEntry[]
    critical: AuditLogEntry[]
    timeline: AuditLogEntry[]
  } {
    let filtered = [...this.logs]

    if (startTime) {
      filtered = filtered.filter(log => log.timestamp >= startTime)
    }
    if (endTime) {
      filtered = filtered.filter(log => log.timestamp <= endTime)
    }

    const byLevel: Record<AuditLevel, number> = {
      info: 0,
      warn: 0,
      error: 0,
      critical: 0,
      audit: 0
    }

    const byOperation: Record<string, number> = {}

    for (const log of filtered) {
      byLevel[log.level]++
      byOperation[log.operation] = (byOperation[log.operation] || 0) + 1
    }

    return {
      totalLogs: filtered.length,
      byLevel,
      byOperation,
      errors: filtered.filter(log => log.level === 'error'),
      critical: filtered.filter(log => log.level === 'critical'),
      timeline: filtered
    }
  }

  /**
   * Export logs as JSON
   */
  exportJson(query?: AuditQuery): string {
    const logs = query ? this.query(query) : this.logs
    return JSON.stringify(logs, null, 2)
  }

  /**
   * Export logs as CSV
   */
  exportCsv(query?: AuditQuery): string {
    const logs = query ? this.query(query) : this.logs
    const lines: string[] = [
      'ID,Timestamp,Level,Operation,Action,UserId,Duration,Success,Error'
    ]

    for (const log of logs) {
      const timestamp = log.timestamp.toISOString()
      const duration = log.duration || ''
      const success = log.result?.success ? 'true' : 'false'
      const error = log.result?.error ? `"${log.result.error}"` : ''

      lines.push(
        `${log.id},${timestamp},${log.level},${log.operation},${log.action},${log.userId || ''},${duration},${success},${error}`
      )
    }

    return lines.join('\n')
  }

  /**
   * Clear old logs
   */
  clearOlder(olderThanHours: number = 72): number {
    const cutoff = Date.now() - olderThanHours * 3600 * 1000
    const beforeCount = this.logs.length

    this.logs = this.logs.filter(log => log.timestamp.getTime() > cutoff)

    return beforeCount - this.logs.length
  }

  /**
   * Get log count
   */
  getCount(): number {
    return this.logs.length
  }
}

// ============================================================================
// GLOBAL INSTANCE
// ============================================================================

export const auditLogger = new AuditLogger()

/**
 * Log execution (global)
 */
export function logExecution(
  operation: string,
  inputs: Record<string, unknown>,
  result: ExecutionResult,
  duration: number,
  userId?: string
): string {
  return auditLogger.logExecution(operation, inputs, result, duration, userId)
}

/**
 * Log error (global)
 */
export function logError(
  operation: string,
  error: Error | string,
  userId?: string
): string {
  return auditLogger.logError(operation, error, userId)
}

export default {
  AuditLogger,
  auditLogger,
  logExecution,
  logError
}
