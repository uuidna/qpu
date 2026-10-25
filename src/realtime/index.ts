// WAVE 8B Real-Time Synchronization - Main Entry Point
// Provides unified real-time updates via WebSockets and SSE

import { WebSocketServer } from './websocket-server.js'
import { BroadcasterCoordinator } from './broadcaster.js'
import { SubscriptionHandler } from './subscription.js'
import { ChangeDetector } from './change-detector.js'
import { PresenceTracker } from './presence.js'
import { SSEServer } from './sse-server.js'
import type { RealtimeConfig, DeltaUpdate, ChangeDetectionEvent } from './types.js'

export class RealtimeEngine {
  private websocketServer: WebSocketServer
  private sseServer: SSEServer
  private broadcaster: BroadcasterCoordinator
  private subscriptionHandler: SubscriptionHandler
  private changeDetector: ChangeDetector
  private presenceTracker: PresenceTracker
  private config: RealtimeConfig
  private initialized = false

  constructor(config: Partial<RealtimeConfig> = {}) {
    // Default configuration
    this.config = {
      heartbeatInterval: 30000,
      connectionTimeout: 60000,
      maxMessageQueueSize: 1000,
      maxConnections: 10000,
      conflictResolution: { strategy: 'last-write-wins' },
      orderingGuarantee: {
        enabled: true,
        sequenceNumbering: true,
        causalOrdering: false,
        totalOrdering: true
      },
      enablePresenceTracking: true,
      enableCompression: true,
      ...config
    }

    // Initialize components
    this.broadcaster = new BroadcasterCoordinator(
      this.config.conflictResolution,
      this.config.orderingGuarantee
    )

    this.websocketServer = new WebSocketServer(this.broadcaster)
    this.sseServer = new SSEServer(this.broadcaster)
    this.subscriptionHandler = new SubscriptionHandler(this.broadcaster)
    this.changeDetector = new ChangeDetector(this.broadcaster)
    this.presenceTracker = new PresenceTracker(this.broadcaster)
  }

  /**
   * Initialize the real-time engine
   */
  async initialize(doNamespace?: DurableObjectNamespace): Promise<void> {
    if (this.initialized) {
      console.warn('[RealtimeEngine] Already initialized')
      return
    }

    console.log('[RealtimeEngine] Initializing real-time synchronization...')

    // Initialize broadcaster with DO
    await this.broadcaster.initialize(doNamespace)

    // Initialize all components
    await this.websocketServer.initialize()
    await this.sseServer.initialize()
    await this.changeDetector.initialize()
    await this.presenceTracker.initialize()

    this.initialized = true

    console.log('[RealtimeEngine] ✓ All components initialized')
    console.log(`[RealtimeEngine] Config:`)
    console.log(`  - Heartbeat: ${this.config.heartbeatInterval}ms`)
    console.log(`  - Max connections: ${this.config.maxConnections}`)
    console.log(`  - Conflict resolution: ${this.config.conflictResolution.strategy}`)
    console.log(`  - Presence tracking: ${this.config.enablePresenceTracking}`)
  }

  /**
   * Handle WebSocket connection
   */
  async handleWebSocket(ws: WebSocket, req: Request): Promise<string> {
    return this.websocketServer.handleConnection(ws, req)
  }

  /**
   * Handle SSE connection
   */
  async handleSSE(req: Request, clientId?: string): Promise<{ response: Response; clientId: string }> {
    return this.sseServer.handleConnection(req, clientId)
  }

  /**
   * Handle incoming message from client
   */
  async handleMessage(clientId: string, data: string, protocol: 'websocket' | 'sse' = 'websocket'): Promise<void> {
    if (protocol === 'websocket') {
      // WebSocket messages are handled internally
      console.log('[RealtimeEngine] WebSocket message handling done internally')
    } else if (protocol === 'sse') {
      await this.sseServer.handleIncoming(clientId, data)
    }
  }

  /**
   * Subscribe to real-time updates via GraphQL subscription
   */
  async subscribe(
    clientId: string,
    query: string,
    variables?: Record<string, any>
  ): Promise<{ subscriptionId: string; success: boolean; error?: string }> {
    return this.subscriptionHandler.handleSubscription(clientId, query, variables)
  }

  /**
   * Unsubscribe from real-time updates
   */
  async unsubscribe(subscriptionId: string): Promise<boolean> {
    return this.subscriptionHandler.unsubscribe(subscriptionId)
  }

  /**
   * Monitor MCP operation and emit changes
   */
  startMCPOperation(mcp: string, operation: string, context?: any): string {
    return this.changeDetector.startOperation(mcp, operation, context)
  }

  /**
   * Complete MCP operation
   */
  async completeMCPOperation(
    operationId: string,
    result?: any,
    changes?: any
  ): Promise<void> {
    return this.changeDetector.completeOperation(operationId, result, changes)
  }

  /**
   * Fail MCP operation
   */
  async failMCPOperation(operationId: string, error: Error | string): Promise<void> {
    return this.changeDetector.failOperation(operationId, error)
  }

  /**
   * Broadcast delta update
   */
  async broadcastUpdate(update: DeltaUpdate): Promise<void> {
    return this.broadcaster.broadcast(update)
  }

  /**
   * Subscribe to change events
   */
  onChanges(resource: string, callback: (event: ChangeDetectionEvent) => void): () => void {
    return this.changeDetector.onChanges(resource, callback)
  }

  /**
   * Client joins channel (for presence tracking)
   */
  async clientJoins(
    clientId: string,
    channel: string,
    userId?: string,
    metadata?: any
  ): Promise<void> {
    await this.presenceTracker.join(clientId, channel, userId, metadata)
  }

  /**
   * Client leaves channel
   */
  async clientLeaves(clientId: string, channel: string): Promise<void> {
    await this.presenceTracker.leave(clientId, channel)
  }

  /**
   * Update client presence status
   */
  async updatePresence(
    clientId: string,
    status: 'online' | 'offline' | 'idle' | 'typing',
    metadata?: any
  ): Promise<void> {
    await this.presenceTracker.updateStatus(clientId, status, metadata)
  }

  /**
   * Get channel presence
   */
  getChannelPresence(channel: string): any[] {
    return this.presenceTracker.getChannelPresence(channel)
  }

  /**
   * Get statistics
   */
  getStats(): {
    websocket: { connections: number }
    sse: { connections: number }
    subscriptions: { active: number; types: Record<string, number>; clients: number }
    operations: {
      total: number
      success: number
      failure: number
      pending: number
      avgDuration: number
      byMCP: Record<string, number>
    }
    presence: {
      total: number
      online: number
      idle: number
      typing: number
      byChannel: Record<string, number>
    }
  } {
    return {
      websocket: {
        connections: this.websocketServer.getConnectionCount()
      },
      sse: {
        connections: this.sseServer.getConnectionCount()
      },
      subscriptions: this.subscriptionHandler.getStats(),
      operations: this.changeDetector.getStats(),
      presence: this.presenceTracker.getStats()
    }
  }

  /**
   * Shutdown the engine
   */
  async shutdown(): Promise<void> {
    console.log('[RealtimeEngine] Shutting down...')

    await this.websocketServer.shutdown()
    await this.sseServer.shutdown()
    await this.changeDetector.shutdown()
    await this.presenceTracker.shutdown()
    await this.broadcaster.shutdown()
    await this.subscriptionHandler.shutdown()

    this.initialized = false

    console.log('[RealtimeEngine] ✓ Shutdown complete')
  }
}

// Export types
export * from './types.js'
export { WebSocketServer } from './websocket-server.js'
export { BroadcasterCoordinator } from './broadcaster.js'
export { SubscriptionHandler } from './subscription.js'
export { ChangeDetector } from './change-detector.js'
export { PresenceTracker } from './presence.js'
export { SSEServer } from './sse-server.js'

// Default export
export default RealtimeEngine
