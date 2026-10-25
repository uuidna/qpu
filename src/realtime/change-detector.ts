// Change Detector for MCP Operations (WAVE 8B)
// Monitors all MCP operations and emits change events

import type { ChangeDetectionEvent, DeltaUpdate } from './types.js'
import { BroadcasterCoordinator } from './broadcaster.js'

export interface MCPOperationLog {
  mcp: string
  operation: string
  status: 'pending' | 'success' | 'failure'
  startTime: number
  endTime?: number
  resource?: string
  resourceId?: string
  changes?: any
  error?: string
}

export class ChangeDetector {
  private broadcaster: BroadcasterCoordinator
  private operationLog: Map<string, MCPOperationLog> = new Map()
  private changeListeners: Map<string, Set<(event: ChangeDetectionEvent) => void>> = new Map()
  private operationBuffer: MCPOperationLog[] = []
  private bufferInterval: NodeJS.Timeout | null = null
  private config = {
    bufferSize: 100,
    flushInterval: 1000 // 1 second
  }

  constructor(broadcaster: BroadcasterCoordinator) {
    this.broadcaster = broadcaster
  }

  async initialize(): Promise<void> {
    console.log('[ChangeDetector] Initializing...')

    // Start buffer flush interval
    this.startBufferFlush()

    console.log('[ChangeDetector] ✓ Initialized')
  }

  // Monitor MCP operation
  startOperation(mcp: string, operation: string, context?: any): string {
    const operationId = `op:${Date.now()}:${Math.random().toString(36).slice(2)}`

    const log: MCPOperationLog = {
      mcp,
      operation,
      status: 'pending',
      startTime: Date.now(),
      resource: context?.resource,
      resourceId: context?.resourceId
    }

    this.operationLog.set(operationId, log)

    return operationId
  }

  // Complete operation successfully
  async completeOperation(
    operationId: string,
    result?: any,
    changes?: any
  ): Promise<void> {
    const log = this.operationLog.get(operationId)

    if (!log) {
      console.warn(`[ChangeDetector] Unknown operation: ${operationId}`)
      return
    }

    log.status = 'success'
    log.endTime = Date.now()
    log.changes = changes

    // Emit change event
    await this.emitChangeEvent({
      mcp: log.mcp,
      operation: log.operation,
      resource: log.resource || '',
      resourceId: log.resourceId || '',
      changes: changes || {},
      timestamp: Date.now(),
      userId: result?.userId
    })

    // Add to buffer
    this.operationBuffer.push(log)

    // Clean up
    setTimeout(() => {
      this.operationLog.delete(operationId)
    }, 60000) // Keep in memory for 1 minute

    console.log(
      `[ChangeDetector] Completed: ${log.mcp}/${log.operation} (${log.endTime - log.startTime}ms)`
    )
  }

  // Fail operation
  async failOperation(operationId: string, error: Error | string): Promise<void> {
    const log = this.operationLog.get(operationId)

    if (!log) {
      return
    }

    log.status = 'failure'
    log.endTime = Date.now()
    log.error = typeof error === 'string' ? error : error.message

    this.operationBuffer.push(log)

    console.log(
      `[ChangeDetector] Failed: ${log.mcp}/${log.operation} - ${log.error}`
    )
  }

  // Emit change event
  private async emitChangeEvent(event: ChangeDetectionEvent): Promise<void> {
    // Create delta update
    const deltaUpdate: DeltaUpdate = {
      id: `delta:${Date.now()}:${Math.random().toString(36).slice(2)}`,
      entity: event.resource,
      entityId: event.resourceId,
      changeType: this.inferChangeType(event.operation),
      changes: new Map(Object.entries(event.changes)),
      timestamp: event.timestamp,
      sequenceNumber: 0,
      causedBy: event.userId || 'system'
    }

    // Broadcast change
    await this.broadcaster.broadcast(deltaUpdate)

    // Notify listeners
    const listeners = this.changeListeners.get(event.resource) || new Set()
    for (const listener of listeners) {
      try {
        listener(event)
      } catch (error) {
        console.error('[ChangeDetector] Listener error:', error)
      }
    }
  }

  // Infer change type from operation
  private inferChangeType(operation: string): 'create' | 'update' | 'delete' {
    const op = operation.toLowerCase()

    if (
      op.includes('create') ||
      op.includes('insert') ||
      op.includes('add')
    ) {
      return 'create'
    } else if (
      op.includes('delete') ||
      op.includes('remove') ||
      op.includes('drop')
    ) {
      return 'delete'
    } else {
      return 'update'
    }
  }

  // Register change listener
  onChanges(
    resource: string,
    callback: (event: ChangeDetectionEvent) => void
  ): () => void {
    if (!this.changeListeners.has(resource)) {
      this.changeListeners.set(resource, new Set())
    }

    const listeners = this.changeListeners.get(resource)!
    listeners.add(callback)

    // Return unsubscribe function
    return () => {
      listeners.delete(callback)
    }
  }

  // Get operation status
  getOperationStatus(operationId: string): MCPOperationLog | undefined {
    return this.operationLog.get(operationId)
  }

  // Get recent operations
  getRecentOperations(
    limit: number = 50,
    mcp?: string
  ): MCPOperationLog[] {
    let ops = Array.from(this.operationLog.values())

    if (mcp) {
      ops = ops.filter(op => op.mcp === mcp)
    }

    return ops
      .sort((a, b) => (b.endTime || b.startTime) - (a.endTime || a.startTime))
      .slice(0, limit)
  }

  // Get operation statistics
  getStats(): {
    totalOperations: number
    successCount: number
    failureCount: number
    pendingCount: number
    avgDuration: number
    operationsByMCP: Record<string, number>
  } {
    const logs = Array.from(this.operationLog.values())
    let successCount = 0
    let failureCount = 0
    let pendingCount = 0
    let totalDuration = 0
    let completedCount = 0
    const operationsByMCP: Record<string, number> = {}

    for (const log of logs) {
      if (log.status === 'success') {
        successCount++
        if (log.endTime) {
          totalDuration += log.endTime - log.startTime
          completedCount++
        }
      } else if (log.status === 'failure') {
        failureCount++
      } else {
        pendingCount++
      }

      operationsByMCP[log.mcp] = (operationsByMCP[log.mcp] || 0) + 1
    }

    return {
      totalOperations: logs.length,
      successCount,
      failureCount,
      pendingCount,
      avgDuration: completedCount > 0 ? totalDuration / completedCount : 0,
      operationsByMCP
    }
  }

  // Batch process changes
  private startBufferFlush(): void {
    this.bufferInterval = setInterval(() => {
      if (this.operationBuffer.length > 0) {
        this.flushBuffer()
      }
    }, this.config.flushInterval)
  }

  // Flush operation buffer
  private async flushBuffer(): Promise<void> {
    const batch = this.operationBuffer.splice(0, this.config.bufferSize)

    if (batch.length === 0) return

    console.log(`[ChangeDetector] Flushing ${batch.length} operations`)

    // Send batch to broadcaster for processing
    for (const operation of batch) {
      if (operation.changes) {
        await this.emitChangeEvent({
          mcp: operation.mcp,
          operation: operation.operation,
          resource: operation.resource || '',
          resourceId: operation.resourceId || '',
          changes: operation.changes,
          timestamp: operation.endTime || Date.now()
        })
      }
    }
  }

  // Monitor specific MCP
  watchMCP(mcp: string, callback: (event: MCPOperationLog) => void): () => void {
    const interval = setInterval(() => {
      const ops = this.getRecentOperations(1, mcp)
      if (ops.length > 0) {
        callback(ops[0])
      }
    }, 5000)

    return () => clearInterval(interval)
  }

  // Get operation timeline
  getTimeline(
    startTime: number,
    endTime: number
  ): MCPOperationLog[] {
    return Array.from(this.operationLog.values()).filter(
      op => op.startTime >= startTime && op.startTime <= endTime
    )
  }

  // Shutdown
  async shutdown(): Promise<void> {
    if (this.bufferInterval) {
      clearInterval(this.bufferInterval)
    }

    // Flush remaining operations
    await this.flushBuffer()

    this.operationLog.clear()
    this.changeListeners.clear()
    this.operationBuffer = []

    console.log('[ChangeDetector] Shutdown complete')
  }
}
