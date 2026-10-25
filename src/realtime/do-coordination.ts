// Durable Objects Coordination for Real-Time Broadcasting (WAVE 8B)
// Uses DO to coordinate message delivery across multiple workers

/**
 * Durable Object class for real-time coordination
 * Place this in your DO environment binding
 */
export class RealtimeBroadcaster {
  private state: DurableObjectState
  private env: any
  private subscribers: Map<string, Set<string>> = new Map() // channel -> clientIds
  private messageLog: Map<string, any[]> = new Map() // channel -> messages
  private sequences: Map<string, number> = new Map() // channel -> sequence number

  constructor(state: DurableObjectState, env: any) {
    this.state = state
    this.env = env
  }

  /**
   * Handle requests from workers
   */
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)

    // Subscribe a client
    if (url.pathname === '/subscribe') {
      return this.handleSubscribe(request)
    }

    // Broadcast a message
    if (url.pathname === '/broadcast') {
      return this.handleBroadcast(request)
    }

    // Get subscribers for channel
    if (url.pathname === '/subscribers') {
      return this.handleGetSubscribers(request)
    }

    // Get message history
    if (url.pathname === '/history') {
      return this.handleGetHistory(request)
    }

    // Event notification
    if (url.pathname === '/event') {
      return this.handleEvent(request)
    }

    return new Response('Not found', { status: 404 })
  }

  /**
   * Handle subscription request
   */
  private async handleSubscribe(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    const body = await request.json<any>()
    const { channel, clientId } = body

    if (!channel || !clientId) {
      return new Response(
        JSON.stringify({ error: 'Missing channel or clientId' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Add subscriber
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Set())
    }

    this.subscribers.get(channel)!.add(clientId)

    // Persist to durable storage
    await this.state.storage?.put(`subscribers:${channel}`, {
      clientIds: Array.from(this.subscribers.get(channel)!),
      timestamp: Date.now()
    })

    console.log(`[RealtimeBroadcaster] Subscription: ${clientId} -> ${channel}`)

    return new Response(
      JSON.stringify({
        success: true,
        channel,
        clientId,
        subscribers: this.subscribers.get(channel)!.size
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  }

  /**
   * Handle broadcast request
   */
  private async handleBroadcast(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    try {
      const body = await request.json<any>()
      const { message, timestamp } = body

      if (!message || !message.targetChannels) {
        return new Response(
          JSON.stringify({ error: 'Invalid message' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }

      let deliveredCount = 0

      // Broadcast to each channel
      for (const channel of message.targetChannels) {
        // Assign sequence number
        const seq = (this.sequences.get(channel) || 0) + 1
        this.sequences.set(channel, seq)

        // Add sequence to message
        const sequencedMessage = {
          ...message,
          sequenceNumber: seq,
          broadcastTime: Date.now()
        }

        // Store in log
        if (!this.messageLog.has(channel)) {
          this.messageLog.set(channel, [])
        }

        const log = this.messageLog.get(channel)!
        log.push(sequencedMessage)

        // Keep only last 1000 messages
        if (log.length > 1000) {
          log.shift()
        }

        // Get subscribers
        const subscribers = this.subscribers.get(channel)
        if (subscribers) {
          deliveredCount += subscribers.size

          // In a real implementation, would send to subscribers via websocket
          console.log(
            `[RealtimeBroadcaster] Broadcast to ${subscribers.size} on ${channel}`
          )
        }

        // Persist
        await this.state.storage?.put(`log:${channel}`, log)
      }

      return new Response(
        JSON.stringify({
          success: true,
          deliveredCount,
          timestamp: Date.now()
        }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    } catch (error) {
      console.error('[RealtimeBroadcaster] Broadcast error:', error)
      return new Response(
        JSON.stringify({ error: 'Broadcast failed' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }

  /**
   * Get subscribers for channel
   */
  private async handleGetSubscribers(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const channel = url.searchParams.get('channel')

    if (!channel) {
      return new Response(
        JSON.stringify({ error: 'Missing channel' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const subscribers = Array.from(this.subscribers.get(channel)?.values() || [])

    return new Response(
      JSON.stringify({
        channel,
        count: subscribers.length,
        subscribers
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  }

  /**
   * Get message history
   */
  private async handleGetHistory(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const channel = url.searchParams.get('channel')
    const limit = parseInt(url.searchParams.get('limit') || '100')
    const fromSequence = parseInt(url.searchParams.get('from') || '0')

    if (!channel) {
      return new Response(
        JSON.stringify({ error: 'Missing channel' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const log = this.messageLog.get(channel) || []
    const messages = log.slice(fromSequence, fromSequence + limit)

    return new Response(
      JSON.stringify({
        channel,
        fromSequence,
        messages,
        totalMessages: log.length,
        nextSequence: fromSequence + messages.length
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  }

  /**
   * Handle event notification
   */
  private async handleEvent(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    try {
      const body = await request.json<any>()
      const { event, data, timestamp } = body

      console.log(`[RealtimeBroadcaster] Event: ${event}`, data)

      // Handle different events
      switch (event) {
        case 'subscription_added':
          // Handle subscription added
          break

        case 'subscription_removed':
          // Handle subscription removed
          const { channel: remChannel, clientId: remClient } = data
          if (this.subscribers.has(remChannel)) {
            this.subscribers.get(remChannel)!.delete(remClient)
          }
          break

        case 'client_disconnected':
          // Handle client disconnect
          const { clientId: discClient } = data
          for (const [, clients] of this.subscribers) {
            clients.delete(discClient)
          }
          break
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    } catch (error) {
      console.error('[RealtimeBroadcaster] Event error:', error)
      return new Response(
        JSON.stringify({ error: 'Event handling failed' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }

  /**
   * Alarm handler for cleanup
   */
  async alarm(): Promise<void> {
    // Clean up old message logs
    const now = Date.now()
    const maxAge = 3600000 // 1 hour

    for (const [channel, messages] of this.messageLog) {
      const filtered = messages.filter(m => now - (m.broadcastTime || 0) < maxAge)
      this.messageLog.set(channel, filtered)
    }

    // Set next alarm
    this.state.storage?.setAlarm(new Date(Date.now() + 300000)) // 5 minutes
  }
}

/**
 * Configuration for wrangler.toml
 */
export const WRANGLER_CONFIG = `
[env.production]
# Add to your wrangler.toml

[[durable_objects.bindings]]
name = "REALTIME_BROADCASTER"
class_name = "RealtimeBroadcaster"
script_name = "qpu"

[[env.production.durable_objects.migrations]]
tag = "v1"
new_classes = ["RealtimeBroadcaster"]

# Or if using existing binding:
# [[env.production.durable_objects.bindings]]
# name = "REALTIME_BROADCASTER"
# class_name = "RealtimeBroadcaster"
# script_name = "qpu"
`

/**
 * Export the class for Cloudflare Workers
 */
export { RealtimeBroadcaster as default }
