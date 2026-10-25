// Real-Time Client Library (WAVE 8B)
// JavaScript/TypeScript client for consuming real-time updates

export interface ClientConfig {
  url: string
  reconnectDelay?: number
  maxReconnectAttempts?: number
  heartbeatInterval?: number
  protocol?: 'auto' | 'websocket' | 'sse'
}

export interface Subscription {
  id: string
  unsubscribe(): Promise<void>
  on(event: 'data' | 'error' | 'complete', callback: (data: any) => void): void
  off(event: 'data' | 'error' | 'complete', callback: (data: any) => void): void
}

export class RealtimeClient {
  private url: string
  private clientId: string
  private websocket: WebSocket | null = null
  private eventSource: EventSource | null = null
  private subscriptions: Map<string, SubscriptionImpl> = new Map()
  private listeners: Map<string, Set<(data: any) => void>> = new Map()
  private messageQueue: any[] = []
  private reconnecting = false
  private reconnectAttempts = 0
  private config: Required<ClientConfig>
  private protocol: 'websocket' | 'sse' = 'websocket'

  constructor(config: ClientConfig) {
    this.url = config.url
    this.clientId = this.generateClientId()
    this.config = {
      url: config.url,
      reconnectDelay: config.reconnectDelay ?? 3000,
      maxReconnectAttempts: config.maxReconnectAttempts ?? 10,
      heartbeatInterval: config.heartbeatInterval ?? 30000,
      protocol: config.protocol ?? 'auto'
    }
  }

  /**
   * Connect to real-time service
   */
  async connect(): Promise<void> {
    console.log('[RealtimeClient] Connecting...')

    // Try WebSocket first
    if (this.config.protocol === 'websocket' || this.config.protocol === 'auto') {
      try {
        await this.connectWebSocket()
        return
      } catch (error) {
        if (this.config.protocol === 'websocket') {
          throw error
        }
        console.warn('[RealtimeClient] WebSocket failed, falling back to SSE')
      }
    }

    // Fall back to SSE
    await this.connectSSE()
  }

  /**
   * Connect via WebSocket
   */
  private connectWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = new URL(this.url)
        wsUrl.protocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:'

        this.websocket = new WebSocket(wsUrl.toString())

        this.websocket.onopen = () => {
          console.log('[RealtimeClient] WebSocket connected')
          this.protocol = 'websocket'
          this.reconnectAttempts = 0
          this.flushQueue()
          this.startHeartbeat()
          resolve()
        }

        this.websocket.onmessage = (event) => {
          this.handleMessage(event.data)
        }

        this.websocket.onerror = (error) => {
          console.error('[RealtimeClient] WebSocket error:', error)
          reject(error)
        }

        this.websocket.onclose = () => {
          console.log('[RealtimeClient] WebSocket closed')
          this.websocket = null
          if (!this.reconnecting) {
            this.reconnect()
          }
        }

        // Timeout
        setTimeout(() => {
          if (this.websocket?.readyState === WebSocket.CONNECTING) {
            this.websocket.close()
            reject(new Error('WebSocket connection timeout'))
          }
        }, 10000)
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Connect via SSE
   */
  private connectSSE(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const sseUrl = new URL(this.url.replace(/^wss?:/, 'https:'))
        sseUrl.searchParams.set('clientId', this.clientId)

        this.eventSource = new EventSource(sseUrl.toString())
        this.protocol = 'sse'

        this.eventSource.onmessage = (event) => {
          this.handleMessage(event.data)
        }

        this.eventSource.onerror = () => {
          console.error('[RealtimeClient] SSE error')
          this.eventSource?.close()
          this.eventSource = null
          if (!this.reconnecting) {
            this.reconnect()
          }
        }

        // Wait for first message
        const timeout = setTimeout(() => {
          resolve()
        }, 1000)

        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Handle incoming message
   */
  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data)

      switch (message.type) {
        case 'subscribe':
          console.log('[RealtimeClient] Subscription confirmed:', message.channel)
          break

        case 'data':
          this.emitData(message.channel, message.data)
          break

        case 'error':
          this.emitError(message.channel, new Error(message.data?.error))
          break

        case 'heartbeat':
          this.handleHeartbeat()
          break

        case 'presence':
          this.emitData(`presence:${message.channel}`, message.data)
          break

        default:
          console.warn('[RealtimeClient] Unknown message type:', message.type)
      }
    } catch (error) {
      console.error('[RealtimeClient] Message parsing error:', error)
    }
  }

  /**
   * Subscribe to real-time updates
   */
  subscribe(query: string, variables?: Record<string, any>): Subscription {
    const subscriptionId = `sub:${Date.now()}:${Math.random().toString(36).slice(2)}`

    const subscription = new SubscriptionImpl(subscriptionId, this)
    this.subscriptions.set(subscriptionId, subscription)

    // Send subscription
    this.send({
      id: subscriptionId,
      type: 'subscribe',
      channel: subscriptionId,
      data: { query, variables },
      clientId: this.clientId,
      timestamp: Date.now()
    })

    return subscription
  }

  /**
   * Subscribe to presence updates for a channel
   */
  subscribePresence(channel: string): Subscription {
    const subscriptionId = `presence:${channel}`

    const subscription = new SubscriptionImpl(subscriptionId, this)
    this.subscriptions.set(subscriptionId, subscription)

    // Join channel
    this.send({
      type: 'join_channel',
      channel,
      clientId: this.clientId,
      timestamp: Date.now()
    })

    return subscription
  }

  /**
   * Unsubscribe from updates
   */
  async unsubscribe(subscriptionId: string): Promise<void> {
    this.subscriptions.delete(subscriptionId)

    this.send({
      type: 'unsubscribe',
      channel: subscriptionId,
      clientId: this.clientId,
      timestamp: Date.now()
    })
  }

  /**
   * Send message to server
   */
  private send(message: any): void {
    const data = JSON.stringify(message)

    if (this.websocket?.readyState === WebSocket.OPEN) {
      this.websocket.send(data)
    } else if (this.protocol === 'sse') {
      // Queue for SSE (can't send via EventSource)
      this.messageQueue.push(message)
    } else {
      // Queue for later
      this.messageQueue.push(message)
    }
  }

  /**
   * Flush queued messages
   */
  private flushQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()
      this.send(message)
    }
  }

  /**
   * Handle heartbeat
   */
  private handleHeartbeat(): void {
    // Respond to heartbeat
    this.send({
      type: 'heartbeat',
      clientId: this.clientId,
      timestamp: Date.now()
    })
  }

  /**
   * Start heartbeat interval
   */
  private startHeartbeat(): void {
    setInterval(() => {
      this.send({
        type: 'heartbeat',
        clientId: this.clientId,
        timestamp: Date.now()
      })
    }, this.config.heartbeatInterval)
  }

  /**
   * Emit data to listeners
   */
  private emitData(channel: string, data: any): void {
    const listeners = this.listeners.get(channel) || new Set()
    for (const listener of listeners) {
      try {
        listener(data)
      } catch (error) {
        console.error('[RealtimeClient] Listener error:', error)
      }
    }
  }

  /**
   * Emit error to listeners
   */
  private emitError(channel: string, error: Error): void {
    const listeners = this.listeners.get(`${channel}:error`) || new Set()
    for (const listener of listeners) {
      try {
        listener(error)
      } catch (err) {
        console.error('[RealtimeClient] Error listener error:', err)
      }
    }
  }

  /**
   * Register listener
   */
  on(channel: string, callback: (data: any) => void): void {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, new Set())
    }
    this.listeners.get(channel)!.add(callback)
  }

  /**
   * Unregister listener
   */
  off(channel: string, callback: (data: any) => void): void {
    const listeners = this.listeners.get(channel)
    if (listeners) {
      listeners.delete(callback)
    }
  }

  /**
   * Reconnect to server
   */
  private async reconnect(): Promise<void> {
    if (this.reconnecting) return

    this.reconnecting = true

    while (this.reconnectAttempts < this.config.maxReconnectAttempts) {
      try {
        await new Promise(resolve => setTimeout(resolve, this.config.reconnectDelay))

        await this.connect()
        this.reconnecting = false
        console.log('[RealtimeClient] Reconnected successfully')
        return
      } catch (error) {
        this.reconnectAttempts++
        console.warn(
          `[RealtimeClient] Reconnection attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts} failed`
        )
      }
    }

    console.error('[RealtimeClient] Failed to reconnect after max attempts')
    this.reconnecting = false
  }

  /**
   * Disconnect
   */
  async disconnect(): Promise<void> {
    if (this.websocket) {
      this.websocket.close()
      this.websocket = null
    }

    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }

    this.subscriptions.clear()
    this.listeners.clear()
    this.messageQueue = []

    console.log('[RealtimeClient] Disconnected')
  }

  /**
   * Get client ID
   */
  getClientId(): string {
    return this.clientId
  }

  /**
   * Get connection state
   */
  isConnected(): boolean {
    return (
      (this.websocket?.readyState === WebSocket.OPEN) ||
      (this.protocol === 'sse' && this.eventSource !== null)
    )
  }

  /**
   * Generate unique client ID
   */
  private generateClientId(): string {
    return `client:${Date.now()}:${Math.random().toString(36).slice(2)}`
  }
}

/**
 * Subscription implementation
 */
class SubscriptionImpl implements Subscription {
  id: string
  private client: RealtimeClient
  private listeners: Map<string, Set<(data: any) => void>> = new Map()

  constructor(id: string, client: RealtimeClient) {
    this.id = id
    this.client = client
  }

  async unsubscribe(): Promise<void> {
    await this.client.unsubscribe(this.id)
    this.listeners.clear()
  }

  on(event: 'data' | 'error' | 'complete', callback: (data: any) => void): void {
    const eventKey = `${this.id}:${event}`
    if (!this.listeners.has(eventKey)) {
      this.listeners.set(eventKey, new Set())
    }
    this.listeners.get(eventKey)!.add(callback)

    // Register with client
    this.client.on(eventKey, callback)
  }

  off(event: 'data' | 'error' | 'complete', callback: (data: any) => void): void {
    const eventKey = `${this.id}:${event}`
    this.listeners.get(eventKey)?.delete(callback)
    this.client.off(eventKey, callback)
  }
}

export default RealtimeClient
