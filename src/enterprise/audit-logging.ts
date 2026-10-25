// Audit Logging & Execution History (WAVE 4)
// Track all user actions, quantum executions, and system events

interface AuditLog {
  id: string
  timestamp: Date
  userId: string
  action: string
  resource: string
  resourceId: string
  changes: Record<string, any>
  status: 'success' | 'failure'
  errorMessage?: string
  ipAddress: string
  userAgent: string
}

interface ExecutionRecord {
  id: string
  userId: string
  teamId: string
  circuit: any
  provider: string
  status: 'queued' | 'running' | 'completed' | 'failed'
  startTime: Date
  endTime?: Date
  duration?: number
  qubits: number
  gates: number
  fidelity?: number
  result?: any
  cost: number
  costCurrency: string
  errorMessage?: string
  notebookId?: string // Link to notebook if created from there
}

interface HistoryQuery {
  userId?: string
  teamId?: string
  action?: string
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}

/**
 * Audit Logger: Track all system activities
 */
export class AuditLogger {
  private logs: Map<string, AuditLog> = new Map()
  private userActions: Map<string, AuditLog[]> = new Map()
  private actionIndex: Map<string, AuditLog[]> = new Map()

  /**
   * Log user action
   */
  logAction(
    userId: string,
    action: string,
    resource: string,
    resourceId: string,
    changes: Record<string, any>,
    ipAddress: string,
    userAgent: string,
    status: 'success' | 'failure' = 'success',
    errorMessage?: string
  ): AuditLog {
    const logId = 'log_' + Math.random().toString(36).substr(2, 9)
    const log: AuditLog = {
      id: logId,
      timestamp: new Date(),
      userId,
      action,
      resource,
      resourceId,
      changes,
      status,
      errorMessage,
      ipAddress,
      userAgent
    }

    this.logs.set(logId, log)

    // Index by user
    if (!this.userActions.has(userId)) {
      this.userActions.set(userId, [])
    }
    this.userActions.get(userId)!.push(log)

    // Index by action
    if (!this.actionIndex.has(action)) {
      this.actionIndex.set(action, [])
    }
    this.actionIndex.get(action)!.push(log)

    return log
  }

  /**
   * Query audit logs
   */
  queryLogs(query: HistoryQuery): AuditLog[] {
    let results: AuditLog[] = []

    if (query.userId) {
      results = this.userActions.get(query.userId) || []
    } else if (query.action) {
      results = this.actionIndex.get(query.action) || []
    } else {
      results = Array.from(this.logs.values())
    }

    // Filter by date range
    if (query.startDate || query.endDate) {
      results = results.filter((log) => {
        if (query.startDate && log.timestamp < query.startDate) return false
        if (query.endDate && log.timestamp > query.endDate) return false
        return true
      })
    }

    // Pagination
    const offset = query.offset || 0
    const limit = query.limit || 100
    return results.slice(offset, offset + limit)
  }

  /**
   * Get user activity summary
   */
  getUserActivitySummary(userId: string, days: number = 30): Record<string, number> {
    const logs = this.userActions.get(userId) || []
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)

    const recentLogs = logs.filter((log) => log.timestamp >= cutoff)
    const summary: Record<string, number> = {}

    for (const log of recentLogs) {
      summary[log.action] = (summary[log.action] || 0) + 1
    }

    return summary
  }

  /**
   * Get action statistics
   */
  getActionStats(action: string): { total: number; success: number; failure: number } {
    const logs = this.actionIndex.get(action) || []

    return {
      total: logs.length,
      success: logs.filter((l) => l.status === 'success').length,
      failure: logs.filter((l) => l.status === 'failure').length
    }
  }

  /**
   * Export logs to CSV
   */
  exportLogsCSV(logs: AuditLog[]): string {
    const headers = ['ID', 'Timestamp', 'User', 'Action', 'Resource', 'Status']
    const rows = logs.map((log) => [
      log.id,
      log.timestamp.toISOString(),
      log.userId,
      log.action,
      `${log.resource}/${log.resourceId}`,
      log.status
    ])

    return [headers, ...rows].map((row) => row.join(',')).join('\n')
  }
}

/**
 * Execution History Manager
 */
export class ExecutionHistory {
  private executions: Map<string, ExecutionRecord> = new Map()
  private userExecutions: Map<string, ExecutionRecord[]> = new Map()
  private teamExecutions: Map<string, ExecutionRecord[]> = new Map()

  /**
   * Record new execution
   */
  recordExecution(
    userId: string,
    teamId: string,
    circuit: any,
    provider: string,
    qubits: number,
    gates: number,
    cost: number
  ): ExecutionRecord {
    const execId = 'exec_' + Math.random().toString(36).substr(2, 9)

    const execution: ExecutionRecord = {
      id: execId,
      userId,
      teamId,
      circuit,
      provider,
      status: 'queued',
      startTime: new Date(),
      qubits,
      gates,
      cost,
      costCurrency: 'USD'
    }

    this.executions.set(execId, execution)

    // Index by user
    if (!this.userExecutions.has(userId)) {
      this.userExecutions.set(userId, [])
    }
    this.userExecutions.get(userId)!.push(execution)

    // Index by team
    if (!this.teamExecutions.has(teamId)) {
      this.teamExecutions.set(teamId, [])
    }
    this.teamExecutions.get(teamId)!.push(execution)

    return execution
  }

  /**
   * Update execution status
   */
  updateExecutionStatus(
    execId: string,
    status: 'queued' | 'running' | 'completed' | 'failed',
    result?: any,
    fidelity?: number,
    errorMessage?: string
  ): ExecutionRecord {
    const exec = this.executions.get(execId)
    if (!exec) throw new Error('Execution not found')

    exec.status = status
    exec.endTime = new Date()
    exec.duration = exec.endTime.getTime() - exec.startTime.getTime()

    if (status === 'completed') {
      exec.result = result
      exec.fidelity = fidelity
    } else if (status === 'failed') {
      exec.errorMessage = errorMessage
    }

    return exec
  }

  /**
   * Get execution by ID
   */
  getExecution(execId: string): ExecutionRecord | null {
    return this.executions.get(execId) || null
  }

  /**
   * Get user execution history
   */
  getUserExecutions(userId: string, limit: number = 50): ExecutionRecord[] {
    const executions = this.userExecutions.get(userId) || []
    return executions.slice(-limit).reverse() // Most recent first
  }

  /**
   * Get team execution history
   */
  getTeamExecutions(teamId: string, limit: number = 100): ExecutionRecord[] {
    const executions = this.teamExecutions.get(teamId) || []
    return executions.slice(-limit).reverse()
  }

  /**
   * Get execution statistics for team
   */
  getTeamExecutionStats(teamId: string): Record<string, any> {
    const executions = this.teamExecutions.get(teamId) || []

    const totalCost = executions.reduce((sum, e) => sum + e.cost, 0)
    const avgDuration =
      executions.filter((e) => e.duration).reduce((sum, e) => sum + (e.duration || 0), 0) /
      executions.filter((e) => e.duration).length

    const byProvider: Record<string, number> = {}
    for (const exec of executions) {
      byProvider[exec.provider] = (byProvider[exec.provider] || 0) + 1
    }

    return {
      totalExecutions: executions.length,
      totalCost,
      avgDuration: Math.round(avgDuration),
      byProvider,
      successRate:
        executions.filter((e) => e.status === 'completed').length / executions.length || 0,
      avgFidelity:
        executions
          .filter((e) => e.fidelity)
          .reduce((sum, e) => sum + (e.fidelity || 0), 0) / executions.filter((e) => e.fidelity).length || 0
    }
  }

  /**
   * Export execution history to CSV
   */
  exportExecutionsCSV(executions: ExecutionRecord[]): string {
    const headers = ['ID', 'User', 'Provider', 'Status', 'Duration (ms)', 'Cost ($)', 'Qubits', 'Gates']
    const rows = executions.map((exec) => [
      exec.id,
      exec.userId,
      exec.provider,
      exec.status,
      exec.duration?.toString() || 'N/A',
      exec.cost.toFixed(2),
      exec.qubits.toString(),
      exec.gates.toString()
    ])

    return [headers, ...rows].map((row) => row.join(',')).join('\n')
  }
}

export { AuditLog, ExecutionRecord, HistoryQuery }
