// Broadcaster coordinated by Durable Objects (WAVE 8B)
// Manages multi-client broadcast with ordering guarantees and conflict resolution

import type {
  BroadcastMessage,
  Subscription,
  DeltaUpdate,
  ConflictResolution,
  OrderingGuarantee
} from './types.js'

export class BroadcasterCoordinator {
  private subscriptions: Map<string, Map<string, Subscription>> = new Map() // channel -> clientId -> subscription
  private sequenceNumbers: Map<string, number> = new Map() // channel -> sequence number
  private messageLog: Map<string, BroadcastMessage[]> = new Map() // channel -> messages
  private doNamespace: DurableObjectNamespace | null = null
  private conflictResolution: ConflictResolution
  private orderingGuarantee: OrderingGuarantee
  private changeBuffer: Map<string, DeltaUpdate[]> = new Map()

  constructor(
    conflictResolution: ConflictResolution = { strategy: 'last-write-wins' },
    orderingGuarantee: OrderingGuarantee = {
      enabled: true,
      sequenceNumbering: true,
      causalOrdering: false,
      totalOrdering: true
    }
  ) {
    this.conflictResolution = conflictResolution
    this.orderingGuarantee = orderingGuarantee
  }

  // Initialize broadcaster with Durable Objects
  async initialize(doNamespace?: DurableObjectNamespace): Promise<void> {
    this.doNamespace = doNamespace
    console.log('[BroadcasterCoordinator] Initialized')
  }

  // Add subscription
  async subscribe(subscription: Subscription): Promise<void> {
    if (!this.subscriptions.has(subscription.channel)) {
      this.subscriptions.set(subscription.channel, new Map())
      this.sequenceNumbers.set(subscription.channel, 0)
      this.messageLog.set(subscription.channel, [])
    }

    const channelSubs = this.subscriptions.get(subscription.channel)!
    channelSubs.set(subscription.clientId, subscription)

    // Notify via Durable Objects
    await this.notifyDO('subscription_added', {
      channel: subscription.channel,
      clientId: subscription.clientId,
      subscriptionId: subscription.id
    })

    console.log(
      `[BroadcasterCoordinator] Subscription: ${subscription.clientId} -> ${subscription.channel}`
    )
  }

  // Remove subscription
  async unsubscribe(clientId: string, channel: string): Promise<void> {
    const channelSubs = this.subscriptions.get(channel)
    if (channelSubs) {
      channelSubs.delete(clientId)
      if (channelSubs.size === 0) {
        this.subscriptions.delete(channel)
      }
    }

    // Notify via Durable Objects
    await this.notifyDO('subscription_removed', {
      channel,
      clientId
    })

    console.log(`[BroadcasterCoordinator] Unsubscription: ${clientId} -> ${channel}`)
  }

  // Broadcast delta update to channel subscribers
  async broadcast(update: DeltaUpdate): Promise<void> {
    const channel = update.entity

    // Assign sequence number
    const currentSeq = this.sequenceNumbers.get(channel) || 0
    const sequenceNumber = currentSeq + 1
    this.sequenceNumbers.set(channel, sequenceNumber)

    // Ensure ordering
    const orderedUpdate = this.orderingGuarantee.sequenceNumbering
      ? { ...update, sequenceNumber }
      : update

    // Create broadcast message
    const message: BroadcastMessage = {
      id: `msg:${Date.now()}:${Math.random().toString(36).slice(2)}`,
      type: 'update',
      payload: orderedUpdate,
      targetChannels: [channel],
      timestamp: Date.now()
    }

    // Store in message log for recovery
    const log = this.messageLog.get(channel) || []
    log.push(message)
    this.messageLog.set(channel, log)

    // Coordinate broadcast via Durable Objects
    await this.coordinateBroadcast(message, channel)

    console.log(
      `[BroadcasterCoordinator] Broadcast: ${channel} (seq: ${sequenceNumber}) - ${update.changeType} ${update.entityId}`
    )
  }

  // Handle conflicts in concurrent updates
  async resolveConflict(
    current: any,
    incoming: any,
    previousState?: any
  ): Promise<any> {
    switch (this.conflictResolution.strategy) {
      case 'last-write-wins':
        return this.lastWriteWins(current, incoming)

      case 'first-write-wins':
        return current

      case 'merge':
        return this.mergeUpdates(current, incoming, previousState)

      case 'custom':
        if (this.conflictResolution.resolution) {
          return this.conflictResolution.resolution(current, incoming)
        }
        return incoming

      default:
        return incoming
    }
  }

  // Last-write-wins conflict resolution
  private lastWriteWins(current: any, incoming: any): any {
    if (!current.timestamp || !incoming.timestamp) {
      return incoming
    }
    return incoming.timestamp > current.timestamp ? incoming : current
  }

  // Merge updates intelligently
  private mergeUpdates(current: any, incoming: any, previousState?: any): any {
    const merged = { ...current }

    for (const [key, value] of Object.entries(incoming)) {
      if (!current.hasOwnProperty(key)) {
        // New field, add it
        merged[key] = value
      } else if (typeof current[key] === 'object' && typeof value === 'object') {
        // Recursive merge for objects
        merged[key] = this.mergeUpdates(current[key], value, previousState?.[key])
      } else {
        // Field changed, keep incoming (could be smarter)
        merged[key] = value
      }
    }

    return merged
  }

  // Coordinate broadcast through Durable Objects
  private async coordinateBroadcast(
    message: BroadcastMessage,
    channel: string
  ): Promise<void> {
    if (!this.doNamespace) {
      console.warn('[BroadcasterCoordinator] Durable Objects not configured, local broadcast only')
      return this.localBroadcast(message)
    }

    try {
      const coordinatorId = this.getCoordinatorId(channel)
      const coordinator = this.doNamespace.get(coordinatorId)

      const response = await coordinator.fetch(
        new Request('http://coordinator/broadcast', {
          method: 'POST',
          body: JSON.stringify({
            message,
            timestamp: Date.now()
          })
        })
      )

      if (!response.ok) {
        console.error(`[BroadcasterCoordinator] Broadcast failed: ${response.status}`)
      }
    } catch (error) {
      console.error('[BroadcasterCoordinator] Broadcast error:', error)
      // Fallback to local broadcast
      await this.localBroadcast(message)
    }
  }

  // Local broadcast (single worker)
  private async localBroadcast(message: BroadcastMessage): Promise<void> {
    for (const channel of message.targetChannels || []) {
      const subscribers = this.subscriptions.get(channel)
      if (!subscribers) continue

      for (const [clientId, subscription] of subscribers) {
        if (clientId === message.excludeClientId) continue

        // Filter based on subscription query/filters
        if (!this.matchesSubscription(message.payload, subscription)) {
          continue
        }

        console.log(
          `[BroadcasterCoordinator] Delivering to ${clientId} on channel ${channel}`
        )
      }
    }
  }

  // Check if message matches subscription filters
  private matchesSubscription(payload: any, subscription: Subscription): boolean {
    if (!subscription.filters) return true

    // Simple filter matching
    for (const [key, value] of Object.entries(subscription.filters)) {
      if (payload[key] !== value) {
        return false
      }
    }

    return true
  }

  // Handle client disconnection
  async clientDisconnected(clientId: string, reconnectToken?: string): Promise<void> {
    // Remove all subscriptions for this client
    const channelsToRemove: string[] = []

    for (const [channel, subscribers] of this.subscriptions) {
      subscribers.delete(clientId)
      if (subscribers.size === 0) {
        channelsToRemove.push(channel)
      }
    }

    for (const channel of channelsToRemove) {
      this.subscriptions.delete(channel)
    }

    // Store reconnect token
    if (reconnectToken) {
      await this.notifyDO('client_disconnected', {
        clientId,
        reconnectToken,
        timestamp: Date.now()
      })
    }

    console.log(`[BroadcasterCoordinator] Client disconnected: ${clientId}`)
  }

  // Get message history for channel
  getMessageHistory(
    channel: string,
    fromSequence: number = 0,
    limit: number = 100
  ): BroadcastMessage[] {
    const log = this.messageLog.get(channel) || []
    return log.slice(Math.max(0, fromSequence), fromSequence + limit)
  }

  // Get subscribers for channel
  getSubscribers(channel: string): string[] {
    const subs = this.subscriptions.get(channel)
    return subs ? Array.from(subs.keys()) : []
  }

  // Get channel stats
  getChannelStats(channel: string): {
    subscribers: number
    messageCount: number
    currentSequence: number
  } {
    return {
      subscribers: this.subscriptions.get(channel)?.size || 0,
      messageCount: this.messageLog.get(channel)?.length || 0,
      currentSequence: this.sequenceNumbers.get(channel) || 0
    }
  }

  // Notify Durable Objects of events
  private async notifyDO(event: string, data: any): Promise<void> {
    if (!this.doNamespace) return

    try {
      const coordinator = this.doNamespace.get('global')
      await coordinator.fetch(
        new Request('http://coordinator/event', {
          method: 'POST',
          body: JSON.stringify({
            event,
            data,
            timestamp: Date.now()
          })
        })
      )
    } catch (error) {
      console.error(`[BroadcasterCoordinator] Failed to notify DO: ${event}`, error)
    }
  }

  // Get coordinator ID for channel
  private getCoordinatorId(channel: string): string {
    // Deterministic coordinator selection based on channel
    const hash = channel
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return `coordinator:${hash % 10}`
  }

  // Shutdown
  async shutdown(): Promise<void> {
    this.subscriptions.clear()
    this.messageLog.clear()
    this.sequenceNumbers.clear()
    this.changeBuffer.clear()
    console.log('[BroadcasterCoordinator] Shutdown complete')
  }
}
