/**
 * Real-Time Server
 * WebSocket support for live updates, subscriptions, and streaming
 * Enables real-time operation feedback, metrics, and notifications
 */

import { ExecutionResult } from '../core/index.js'

// ============================================================================
// REAL-TIME TYPES
// ============================================================================

export type SubscriptionType = 'operation' | 'metrics' | 'health' | 'autonomy' | 'all'

export interface SubscriptionRequest {
  id: string
  type: SubscriptionType
  filter?: Record<string, unknown>
}

export interface RealtimeMessage {
  id: string
  timestamp: Date
  type: SubscriptionType
  event: string
  data: unknown
}

export interface RealtimeClient {
  id: string
  subscriptions: Set<SubscriptionType>
  connected: boolean
}

// ============================================================================
// REAL-TIME EVENT EMITTER
// ============================================================================

export class RealtimeEventEmitter {
  private clients: Map<string, RealtimeClient> = new Map()
  private subscriptions: Map<SubscriptionType, Set<string>> = new Map()
  private messageHistory: RealtimeMessage[] = []
  private maxHistorySize = 1000

  constructor() {
    // Initialize subscription sets
    const types: SubscriptionType[] = ['operation', 'metrics', 'health', 'autonomy', 'all']
    for (const type of types) {
      this.subscriptions.set(type, new Set())
    }
  }

  /**
   * Register a client
   */
  registerClient(clientId: string): RealtimeClient {
    const client: RealtimeClient = {
      id: clientId,
      subscriptions: new Set(),
      connected: true
    }
    this.clients.set(clientId, client)
    return client
  }

  /**
   * Unregister a client
   */
  unregisterClient(clientId: string): void {
    const client = this.clients.get(clientId)
    if (client) {
      for (const type of client.subscriptions) {
        this.subscriptions.get(type)?.delete(clientId)
      }
      this.clients.delete(clientId)
    }
  }

  /**
   * Subscribe client to event type
   */
  subscribe(clientId: string, type: SubscriptionType): boolean {
    const client = this.clients.get(clientId)
    if (!client) return false

    client.subscriptions.add(type)
    this.subscriptions.get(type)?.add(clientId)

    if (type === 'all') {
      const types: SubscriptionType[] = ['operation', 'metrics', 'health', 'autonomy']
      for (const t of types) {
        client.subscriptions.add(t)
        this.subscriptions.get(t)?.add(clientId)
      }
    }

    return true
  }

  /**
   * Unsubscribe client from event type
   */
  unsubscribe(clientId: string, type: SubscriptionType): boolean {
    const client = this.clients.get(clientId)
    if (!client) return false

    client.subscriptions.delete(type)
    this.subscriptions.get(type)?.delete(clientId)
    return true
  }

  /**
   * Emit operation event
   */
  emitOperation(event: string, data: unknown): void {
    this.emit('operation', event, data)
  }

  /**
   * Emit metrics event
   */
  emitMetrics(event: string, data: unknown): void {
    this.emit('metrics', event, data)
  }

  /**
   * Emit health event
   */
  emitHealth(event: string, data: unknown): void {
    this.emit('health', event, data)
  }

  /**
   * Emit autonomy event
   */
  emitAutonomy(event: string, data: unknown): void {
    this.emit('autonomy', event, data)
  }

  /**
   * Internal emit method
   */
  private emit(type: SubscriptionType, event: string, data: unknown): void {
    const message: RealtimeMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: new Date(),
      type,
      event,
      data
    }

    this.messageHistory.push(message)
    if (this.messageHistory.length > this.maxHistorySize) {
      this.messageHistory.shift()
    }

    // Broadcast to subscribed clients
    const subscribers = this.subscriptions.get(type) || new Set()
    for (const clientId of subscribers) {
      this.sendToClient(clientId, message)
    }

    // Also send to 'all' subscribers
    const allSubscribers = this.subscriptions.get('all') || new Set()
    for (const clientId of allSubscribers) {
      this.sendToClient(clientId, message)
    }
  }

  /**
   * Send message to specific client
   */
  private sendToClient(clientId: string, message: RealtimeMessage): void {
    const client = this.clients.get(clientId)
    if (client && client.connected) {
      // In real implementation, would send via WebSocket
      console.log(`[REALTIME] → ${clientId}: ${message.type}/${message.event}`)
    }
  }

  /**
   * Get message history for type
   */
  getHistory(type: SubscriptionType, limit: number = 100): RealtimeMessage[] {
    return this.messageHistory
      .filter(m => m.type === type || type === 'all')
      .slice(-limit)
  }

  /**
   * Get active client count
   */
  getClientCount(): number {
    return this.clients.size
  }

  /**
   * Get subscription count
   */
  getSubscriptionCount(type: SubscriptionType): number {
    return this.subscriptions.get(type)?.size || 0
  }
}

// ============================================================================
// REAL-TIME SERVER
// ============================================================================

export class RealtimeServer {
  private emitter: RealtimeEventEmitter
  private isRunning = false

  constructor(emitter?: RealtimeEventEmitter) {
    this.emitter = emitter || new RealtimeEventEmitter()
  }

  /**
   * Start real-time server
   */
  async start(): Promise<void> {
    if (this.isRunning) return
    this.isRunning = true

    console.log('[REALTIME] Server started')

    // Emit periodic metrics
    setInterval(() => {
      this.emitter.emitMetrics('update', {
        clients: this.emitter.getClientCount(),
        timestamp: new Date()
      })
    }, 5000)
  }

  /**
   * Stop real-time server
   */
  stop(): void {
    this.isRunning = false
  }

  /**
   * Handle WebSocket connection
   */
  handleConnection(clientId: string): RealtimeClient {
    return this.emitter.registerClient(clientId)
  }

  /**
   * Handle WebSocket disconnection
   */
  handleDisconnection(clientId: string): void {
    this.emitter.unregisterClient(clientId)
  }

  /**
   * Handle subscription request
   */
  handleSubscription(clientId: string, request: SubscriptionRequest): boolean {
    return this.emitter.subscribe(clientId, request.type)
  }

  /**
   * Handle unsubscription request
   */
  handleUnsubscription(clientId: string, type: SubscriptionType): boolean {
    return this.emitter.unsubscribe(clientId, type)
  }

  /**
   * Emit operation execution event
   */
  notifyOperationExecution(operation: string, result: ExecutionResult, duration: number): void {
    this.emitter.emitOperation('executed', {
      operation,
      success: result.success,
      duration,
      error: result.error
    })
  }

  /**
   * Emit performance alert
   */
  notifyPerformanceAlert(message: string, details: Record<string, unknown>): void {
    this.emitter.emitMetrics('alert', { message, details, timestamp: new Date() })
  }

  /**
   * Emit health status change
   */
  notifyHealthChange(status: string, issues: string[]): void {
    this.emitter.emitHealth('status-changed', { status, issues, timestamp: new Date() })
  }

  /**
   * Emit autonomy cycle
   */
  notifyAutonomyCycle(cycleId: string, patterns: string[]): void {
    this.emitter.emitAutonomy('cycle-completed', { cycleId, patterns, timestamp: new Date() })
  }

  /**
   * Get event history
   */
  getEventHistory(type: SubscriptionType, limit?: number): RealtimeMessage[] {
    return this.emitter.getHistory(type, limit)
  }

  /**
   * Get server status
   */
  getStatus(): {
    running: boolean
    clients: number
    subscriptions: Record<SubscriptionType, number>
  } {
    const types: SubscriptionType[] = ['operation', 'metrics', 'health', 'autonomy', 'all']
    const subscriptions: Record<SubscriptionType, number> = {} as any

    for (const type of types) {
      subscriptions[type] = this.emitter.getSubscriptionCount(type)
    }

    return {
      running: this.isRunning,
      clients: this.emitter.getClientCount(),
      subscriptions
    }
  }
}

// ============================================================================
// GLOBAL INSTANCE
// ============================================================================

export const realtimeEventEmitter = new RealtimeEventEmitter()
export const realtimeServer = new RealtimeServer(realtimeEventEmitter)

/**
 * Start real-time server (global)
 */
export async function startRealtimeServer(): Promise<void> {
  await realtimeServer.start()
}

/**
 * Notify operation execution (global)
 */
export function notifyOperationExecution(
  operation: string,
  result: ExecutionResult,
  duration: number
): void {
  realtimeServer.notifyOperationExecution(operation, result, duration)
}

export default {
  RealtimeEventEmitter,
  RealtimeServer,
  realtimeEventEmitter,
  realtimeServer,
  startRealtimeServer,
  notifyOperationExecution
}
