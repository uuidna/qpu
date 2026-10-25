// Server-Sent Events (SSE) Server - WebSocket Fallback (WAVE 8B)
// Provides real-time updates via HTTP streaming for browsers without WebSocket support

import type { RealtimeMessage, ConnectionPool } from './types.js'
import { BroadcasterCoordinator } from './broadcaster.js'

export class SSEServer {
  private connections: Map<string, ConnectionPool> = new Map()
  private broadcaster: BroadcasterCoordinator
  private messageQueue: Map<string, RealtimeMessage[]> = new Map()
  private keepAliveInterval = 30000 // 30 seconds

  constructor(broadcaster: BroadcasterCoordinator) {
    this.broadcaster = broadcaster
  }

  async initialize(): Promise<void> {
    console.log('[SSEServer] Initializing...')
    console.log('[SSEServer] ✓ Initialized')
  }

  // Handle SSE connection
  async handleConnection(
    req: Request,
    clientId?: string
  ): Promise<{ response: Response; clientId: string }> {
    const actualClientId = clientId || this.generateClientId()

    // Create readable stream for SSE
    const stream = new ReadableStream<any>({
      start: async (controller) => {
        const connectionPool: ConnectionPool = {
          clientId: actualClientId,
          sse: controller,
          protocol: 'sse',
          subscriptions: new Set(),
          messageQueue: [],
          lastSeen: Date.now()
        }

        this.connections.set(actualClientId, connectionPool)

        // Send welcome message
        this.sendSSEMessage(controller, {
          id: `welcome:${Date.now()}`,
          type: 'subscribe',
          channel: 'system',
          data: {
            clientId: actualClientId,
            protocol: 'sse',
            keepAliveInterval: this.keepAliveInterval
          },
          timestamp: Date.now(),
          clientId: actualClientId
        })

        // Send any queued messages
        const queued = this.messageQueue.get(actualClientId) || []
        for (const msg of queued) {
          this.sendSSEMessage(controller, msg)
        }
        this.messageQueue.delete(actualClientId)

        // Start keep-alive
        const keepAliveTimer = setInterval(() => {
          try {
            controller.enqueue(': keep-alive\n\n')
          } catch (error) {
            console.log(`[SSEServer] Connection closed: ${actualClientId}`)
            clearInterval(keepAliveTimer)
            this.handleDisconnect(actualClientId)
          }
        }, this.keepAliveInterval)

        // Handle stream close
        req.signal?.addEventListener('abort', () => {
          clearInterval(keepAliveTimer)
          this.handleDisconnect(actualClientId)
        })
      }
    })

    const response = new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      }
    })

    return { response, clientId: actualClientId }
  }

  // Send SSE formatted message
  private sendSSEMessage(
    controller: ReadableStreamDefaultController<any>,
    message: RealtimeMessage
  ): void {
    const data = JSON.stringify(message)
    const sseMessage = `data: ${data}\n\n`

    try {
      controller.enqueue(sseMessage)
    } catch (error) {
      console.error('[SSEServer] Failed to send message:', error)
    }
  }

  // Handle incoming data (via polling or POST)
  async handleIncoming(
    clientId: string,
    data: string
  ): Promise<{ success: boolean }> {
    try {
      const message: RealtimeMessage = JSON.parse(data)
      const connection = this.connections.get(clientId)

      if (!connection) {
        return { success: false }
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
          console.warn(`[SSEServer] Unknown message type: ${message.type}`)
      }

      return { success: true }
    } catch (error) {
      console.error('[SSEServer] Error handling message:', error)
      return { success: false }
    }
  }

  // Handle subscription
  private async handleSubscribe(clientId: string, message: RealtimeMessage): Promise<void> {
    const connection = this.connections.get(clientId)
    if (!connection) return

    connection.subscriptions.add(message.channel)

    // Register with broadcaster
    await this.broadcaster.subscribe({
      id: `sub:${clientId}:${Date.now()}`,
      clientId,
      channel: message.channel,
      query: message.data?.query,
      filters: message.data?.filters,
      createdAt: Date.now()
    })

    // Send confirmation
    const controller = connection.sse
    if (controller) {
      this.sendSSEMessage(controller, {
        id: `sub-ack:${Date.now()}`,
        type: 'subscribe',
        channel: message.channel,
        data: { subscribed: true },
        timestamp: Date.now(),
        clientId
      })
    }
  }

  // Handle unsubscription
  private async handleUnsubscribe(clientId: string, message: RealtimeMessage): Promise<void> {
    const connection = this.connections.get(clientId)
    if (!connection) return

    connection.subscriptions.delete(message.channel)

    // Unregister from broadcaster
    await this.broadcaster.unsubscribe(clientId, message.channel)

    // Send confirmation
    const controller = connection.sse
    if (controller) {
      this.sendSSEMessage(controller, {
        id: `unsub-ack:${Date.now()}`,
        type: 'unsubscribe',
        channel: message.channel,
        data: { unsubscribed: true },
        timestamp: Date.now(),
        clientId
      })
    }
  }

  // Handle heartbeat
  private async handleHeartbeat(clientId: string, message: RealtimeMessage): Promise<void> {
    const connection = this.connections.get(clientId)
    if (!connection) return

    connection.lastSeen = Date.now()

    // Send heartbeat response
    const controller = connection.sse
    if (controller) {
      this.sendSSEMessage(controller, {
        id: `heartbeat-ack:${Date.now()}`,
        type: 'heartbeat',
        channel: 'system',
        data: { acknowledged: true },
        timestamp: Date.now(),
        clientId
      })
    }
  }

  // Handle disconnection
  private async handleDisconnect(clientId: string): Promise<void> {
    const connection = this.connections.get(clientId)
    if (!connection) return

    await this.broadcaster.clientDisconnected(clientId)

    this.connections.delete(clientId)
    this.messageQueue.delete(clientId)

    console.log(`[SSEServer] Client disconnected: ${clientId}`)
  }

  // Send message to client
  send(clientId: string, message: RealtimeMessage): void {
    const connection = this.connections.get(clientId)

    if (!connection) {
      console.warn(`[SSEServer] Client not found: ${clientId}`)
      this.queueMessage(clientId, message)
      return
    }

    if (connection.sse) {
      this.sendSSEMessage(connection.sse, message)
    } else {
      this.queueMessage(clientId, message)
    }
  }

  // Queue message for delivery
  private queueMessage(clientId: string, message: RealtimeMessage): void {
    if (!this.messageQueue.has(clientId)) {
      this.messageQueue.set(clientId, [])
    }

    const queue = this.messageQueue.get(clientId)!
    queue.push(message)

    // Clean old messages
    if (queue.length > 100) {
      queue.shift()
    }
  }

  // Broadcast to channel
  async broadcast(channel: string, message: any, excludeClientId?: string): Promise<void> {
    const clients = Array.from(this.connections.values()).filter(
      conn =>
        conn.subscriptions.has(channel) &&
        (!excludeClientId || conn.clientId !== excludeClientId)
    )

    const sseMessage: RealtimeMessage = {
      id: `broadcast:${Date.now()}`,
      type: 'data',
      channel,
      data: message,
      timestamp: Date.now(),
      clientId: 'system'
    }

    for (const client of clients) {
      this.send(client.clientId, sseMessage)
    }
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

  // Generate unique client ID
  private generateClientId(): string {
    return `sse:${Date.now()}:${Math.random().toString(36).slice(2)}`
  }

  // Shutdown
  async shutdown(): Promise<void> {
    this.connections.clear()
    this.messageQueue.clear()
    console.log('[SSEServer] Shutdown complete')
  }
}
