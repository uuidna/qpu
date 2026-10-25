// WebSocket Server with auto-reconnect support (WAVE 8B)
// Handles real-time WebSocket connections with heartbeat, queuing, and recovery

import type { RealtimeMessage, ConnectionPool } from './types.js'
import { BroadcasterCoordinator } from './broadcaster.js'

export class WebSocketServer {
  private connections: Map<string, ConnectionPool> = new Map()
  private broadcaster: BroadcasterCoordinator
  private heartbeatInterval: NodeJS.Timeout | null = null
  private messageQueue: Map<string, RealtimeMessage[]> = new Map()
  private reconnectTokens: Map<string, { clientId: string; expiresAt: number }> = new Map()
  private config = {
    heartbeatInterval: 30000, // 30 seconds
    connectionTimeout: 60000, // 60 seconds
    maxMessageQueueSize: 1000,
    maxReconnectWait: 300000, // 5 minutes
    tokenExpiry: 3600000 // 1 hour
  }

  constructor(broadcaster: BroadcasterCoordinator) {
    this.broadcaster = broadcaster
  }

  async initialize(): Promise<void> {
    console.log('[WebSocketServer] Initializing...')

    // Start heartbeat process
    this.startHeartbeat()

    // Start connection cleanup
    this.startConnectionCleanup()

    console.log('[WebSocketServer] ✓ Initialized')
  }

  // Handle new WebSocket connection
  async handleConnection(ws: WebSocket, req: Request): Promise<string> {
    const clientId = this.generateClientId()
    const url = new URL(req.url)
    const reconnectToken = url.searchParams.get('reconnect_token')

    // Check if this is a reconnection
    let existingClientId = clientId
    if (reconnectToken && this.validateReconnectToken(reconnectToken)) {
      const tokenData = this.reconnectTokens.get(reconnectToken)
      if (tokenData) {
        existingClientId = tokenData.clientId
        this.reconnectTokens.delete(reconnectToken)
      }
    }

    const connectionPool: ConnectionPool = {
      clientId: existingClientId,
      websocket: ws,
      protocol: 'websocket',
      subscriptions: new Set(),
      messageQueue: [],
      lastSeen: Date.now()
    }

    // Store connection
    this.connections.set(existingClientId, connectionPool)

    // Send welcome message
    this.send(existingClientId, {
      id: `welcome:${Date.now()}`,
      type: 'subscribe',
      channel: 'system',
      data: {
        clientId: existingClientId,
        reconnectToken: this.generateReconnectToken(existingClientId),
        heartbeatInterval: this.config.heartbeatInterval,
        maxMessageQueueSize: this.config.maxMessageQueueSize
      },
      timestamp: Date.now(),
      clientId: existingClientId
    })

    // Handle WebSocket events
    ws.onmessage = (event: MessageEvent) => {
      this.handleMessage(existingClientId, event.data)
    }

    ws.onclose = () => {
      this.handleDisconnect(existingClientId, false)
    }

    ws.onerror = (error: Event) => {
      console.error(`[WebSocketServer] Error for client ${existingClientId}:`, error)
      this.handleDisconnect(existingClientId, true)
    }

    return existingClientId
  }

  // Handle incoming message
  private async handleMessage(clientId: string, data: string): Promise<void> {
    try {
      const message: RealtimeMessage = JSON.parse(data)
      const connection = this.connections.get(clientId)

      if (!connection) {
        console.warn(`[WebSocketServer] Received message from unknown client: ${clientId}`)
        return
      }

      connection.lastSeen = Date.now()

      switch (message.type) {
        case 'subscribe':
          await this.handleSubscribe(clientId, message)
          break
        case 'unsubscribe':
          await this.handleUnsubscribe(clientId, message)
          break
        case 'heartbeat':
          await this.handleHeartbeat(clientId, message)
          break
        default:
          console.warn(`[WebSocketServer] Unknown message type: ${message.type}`)
      }
    } catch (error) {
      console.error(`[WebSocketServer] Error handling message:`, error)
      this.send(clientId, {
        id: `error:${Date.now()}`,
        type: 'error',
        channel: 'system',
        data: { error: 'Failed to process message' },
        timestamp: Date.now(),
        clientId
      })
    }
  }

  // Handle subscription
  private async handleSubscribe(clientId: string, message: RealtimeMessage): Promise<void> {
    const connection = this.connections.get(clientId)
    if (!connection) return

    const subscriptionId = `sub:${clientId}:${Date.now()}`
    connection.subscriptions.add(message.channel)

    // Register with broadcaster
    await this.broadcaster.subscribe({
      id: subscriptionId,
      clientId,
      channel: message.channel,
      query: message.data?.query,
      filters: message.data?.filters,
      createdAt: Date.now()
    })

    // Send confirmation
    this.send(clientId, {
      id: subscriptionId,
      type: 'subscribe',
      channel: message.channel,
      data: { subscribed: true },
      timestamp: Date.now(),
      clientId
    })
  }

  // Handle unsubscription
  private async handleUnsubscribe(clientId: string, message: RealtimeMessage): Promise<void> {
    const connection = this.connections.get(clientId)
    if (!connection) return

    connection.subscriptions.delete(message.channel)

    // Unregister from broadcaster
    await this.broadcaster.unsubscribe(clientId, message.channel)

    // Send confirmation
    this.send(clientId, {
      id: `unsub:${Date.now()}`,
      type: 'unsubscribe',
      channel: message.channel,
      data: { unsubscribed: true },
      timestamp: Date.now(),
      clientId
    })
  }

  // Handle heartbeat
  private async handleHeartbeat(clientId: string, message: RealtimeMessage): Promise<void> {
    const connection = this.connections.get(clientId)
    if (!connection) return

    connection.lastSeen = Date.now()

    // Send heartbeat response
    this.send(clientId, {
      id: `heartbeat:${Date.now()}`,
      type: 'heartbeat',
      channel: 'system',
      data: { acknowledged: true },
      timestamp: Date.now(),
      clientId
    })
  }

  // Disconnect handling
  private async handleDisconnect(clientId: string, isError: boolean): Promise<void> {
    const connection = this.connections.get(clientId)
    if (!connection) return

    // Generate reconnect token
    const reconnectToken = this.generateReconnectToken(clientId)

    // Notify broadcaster
    await this.broadcaster.clientDisconnected(clientId, reconnectToken)

    // Keep connection data for reconnection window
    const timeout = setTimeout(() => {
      this.connections.delete(clientId)
    }, this.config.maxReconnectWait)

    connection.websocket = undefined

    console.log(`[WebSocketServer] Client ${clientId} disconnected (error: ${isError})`)
  }

  // Send message to client
  send(clientId: string, message: RealtimeMessage): void {
    const connection = this.connections.get(clientId)

    if (!connection) {
      console.warn(`[WebSocketServer] Attempted to send to unknown client: ${clientId}`)
      return
    }

    const data = JSON.stringify(message)

    if (connection.websocket && connection.websocket.readyState === WebSocket.OPEN) {
      try {
        connection.websocket.send(data)
      } catch (error) {
        console.error(`[WebSocketServer] Failed to send to client ${clientId}:`, error)
        this.queueMessage(clientId, message)
      }
    } else {
      // Queue message if connection unavailable
      this.queueMessage(clientId, message)
    }
  }

  // Queue message for delivery
  private queueMessage(clientId: string, message: RealtimeMessage): void {
    if (!this.messageQueue.has(clientId)) {
      this.messageQueue.set(clientId, [])
    }

    const queue = this.messageQueue.get(clientId)!
    if (queue.length < this.config.maxMessageQueueSize) {
      queue.push(message)
    } else {
      console.warn(`[WebSocketServer] Message queue full for client ${clientId}`)
    }
  }

  // Get queued messages
  getQueuedMessages(clientId: string): RealtimeMessage[] {
    const messages = this.messageQueue.get(clientId) || []
    this.messageQueue.delete(clientId)
    return messages
  }

  // Broadcast message to channel
  async broadcast(channel: string, message: any, excludeClientId?: string): Promise<void> {
    const clients = Array.from(this.connections.values()).filter(
      conn =>
        conn.subscriptions.has(channel) &&
        (!excludeClientId || conn.clientId !== excludeClientId)
    )

    const realtimeMessage: RealtimeMessage = {
      id: `broadcast:${Date.now()}`,
      type: 'data',
      channel,
      data: message,
      timestamp: Date.now(),
      clientId: 'system'
    }

    for (const client of clients) {
      this.send(client.clientId, realtimeMessage)
    }
  }

  // Start heartbeat process
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      const now = Date.now()
      const clients = Array.from(this.connections.values())

      for (const connection of clients) {
        if (connection.websocket && connection.websocket.readyState === WebSocket.OPEN) {
          this.send(connection.clientId, {
            id: `heartbeat:${now}`,
            type: 'heartbeat',
            channel: 'system',
            timestamp: now,
            clientId: 'system'
          })
        }
      }
    }, this.config.heartbeatInterval)
  }

  // Start connection cleanup
  private startConnectionCleanup(): void {
    setInterval(() => {
      const now = Date.now()
      const clients = Array.from(this.connections.entries())

      for (const [clientId, connection] of clients) {
        if (now - connection.lastSeen > this.config.connectionTimeout) {
          console.log(`[WebSocketServer] Timeout: Cleaning up client ${clientId}`)
          this.handleDisconnect(clientId, false)
        }
      }
    }, 60000) // Run every minute
  }

  // Generate unique client ID
  private generateClientId(): string {
    return `client:${Date.now()}:${Math.random().toString(36).slice(2)}`
  }

  // Generate reconnect token
  private generateReconnectToken(clientId: string): string {
    const token = `token:${clientId}:${Date.now()}:${Math.random().toString(36).slice(2)}`
    this.reconnectTokens.set(token, {
      clientId,
      expiresAt: Date.now() + this.config.tokenExpiry
    })
    return token
  }

  // Validate reconnect token
  private validateReconnectToken(token: string): boolean {
    const data = this.reconnectTokens.get(token)
    if (!data) return false
    if (Date.now() > data.expiresAt) {
      this.reconnectTokens.delete(token)
      return false
    }
    return true
  }

  // Get connection count
  getConnectionCount(): number {
    return this.connections.size
  }

  // Get active subscriptions
  getActiveSubscriptions(clientId: string): string[] {
    const connection = this.connections.get(clientId)
    return connection ? Array.from(connection.subscriptions) : []
  }

  // Shutdown
  async shutdown(): Promise<void> {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }

    for (const [clientId, connection] of this.connections.entries()) {
      if (connection.websocket) {
        connection.websocket.close()
      }
    }

    this.connections.clear()
    this.messageQueue.clear()
    console.log('[WebSocketServer] Shutdown complete')
  }
}
