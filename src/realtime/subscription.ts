// GraphQL Subscriptions Handler (WAVE 8B)
// Handles GraphQL subscription queries with real-time updates

import type { RealtimeMessage, DeltaUpdate, Subscription } from './types.js'
import { BroadcasterCoordinator } from './broadcaster.js'

export interface GraphQLSubscriptionQuery {
  operation: string
  fields: string[]
  filters?: Record<string, any>
  variables?: Record<string, any>
}

export interface SubscriptionContext {
  clientId: string
  subscriptionId: string
  query: GraphQLSubscriptionQuery
  filters?: any
  variables?: Record<string, any>
}

export class SubscriptionHandler {
  private subscriptions: Map<string, SubscriptionContext> = new Map()
  private broadcaster: BroadcasterCoordinator
  private queryCache: Map<string, any> = new Map()

  constructor(broadcaster: BroadcasterCoordinator) {
    this.broadcaster = broadcaster
  }

  // Parse GraphQL subscription query
  parseSubscriptionQuery(query: string): GraphQLSubscriptionQuery | null {
    try {
      // Simple GraphQL subscription parser
      const match = query.match(
        /subscription\s*\{\s*(\w+)\s*\(([^)]*)\)\s*\{([^}]*)\}/i
      )

      if (!match) {
        return null
      }

      const [, operation, paramsStr, fieldsStr] = match

      // Parse fields
      const fields = fieldsStr
        .split('\n')
        .map(f => f.trim())
        .filter(f => f && !f.startsWith('__'))

      // Parse filters from parameters
      const filters: Record<string, any> = {}
      const paramMatches = paramsStr.matchAll(/(\w+):\s*"([^"]*)"/g)
      for (const [, key, value] of paramMatches) {
        filters[key] = value
      }

      return {
        operation,
        fields,
        filters: Object.keys(filters).length > 0 ? filters : undefined
      }
    } catch (error) {
      console.error('[SubscriptionHandler] Failed to parse query:', error)
      return null
    }
  }

  // Handle subscription request
  async handleSubscription(
    clientId: string,
    query: string,
    variables?: Record<string, any>
  ): Promise<{ subscriptionId: string; success: boolean; error?: string }> {
    const parsedQuery = this.parseSubscriptionQuery(query)

    if (!parsedQuery) {
      return {
        subscriptionId: '',
        success: false,
        error: 'Invalid subscription query'
      }
    }

    const subscriptionId = `sub:${clientId}:${Date.now()}`
    const context: SubscriptionContext = {
      clientId,
      subscriptionId,
      query: parsedQuery,
      variables
    }

    this.subscriptions.set(subscriptionId, context)

    // Register with broadcaster
    const channel = this.getChannelFromOperation(parsedQuery.operation)
    await this.broadcaster.subscribe({
      id: subscriptionId,
      clientId,
      channel,
      query: parsedQuery,
      filters: parsedQuery.filters,
      createdAt: Date.now()
    })

    console.log(
      `[SubscriptionHandler] Subscription created: ${subscriptionId} for operation: ${parsedQuery.operation}`
    )

    return {
      subscriptionId,
      success: true
    }
  }

  // Handle unsubscription
  async unsubscribe(subscriptionId: string): Promise<boolean> {
    const context = this.subscriptions.get(subscriptionId)

    if (!context) {
      return false
    }

    const channel = this.getChannelFromOperation(context.query.operation)
    await this.broadcaster.unsubscribe(context.clientId, channel)

    this.subscriptions.delete(subscriptionId)

    console.log(`[SubscriptionHandler] Unsubscribed: ${subscriptionId}`)

    return true
  }

  // Process update for subscription
  async processUpdate(update: DeltaUpdate): Promise<Map<string, RealtimeMessage>> {
    const results = new Map<string, RealtimeMessage>()

    for (const [subscriptionId, context] of this.subscriptions) {
      if (!this.matchesSubscription(update, context)) {
        continue
      }

      const message = this.buildSubscriptionMessage(update, context)
      results.set(subscriptionId, message)
    }

    return results
  }

  // Check if update matches subscription
  private matchesSubscription(update: DeltaUpdate, context: SubscriptionContext): boolean {
    // Check operation type
    if (context.query.operation !== `on${this.capitalize(update.entity)}Change`) {
      return false
    }

    // Check filters
    if (context.query.filters) {
      for (const [key, value] of Object.entries(context.query.filters)) {
        if (update.changes.get(key) !== value && update.previousValues?.get(key) !== value) {
          return false
        }
      }
    }

    return true
  }

  // Build subscription message from update
  private buildSubscriptionMessage(
    update: DeltaUpdate,
    context: SubscriptionContext
  ): RealtimeMessage {
    const payload: any = {
      changeType: update.changeType,
      id: update.entityId,
      timestamp: update.timestamp
    }

    // Include only requested fields
    for (const field of context.query.fields) {
      if (update.changes.has(field)) {
        payload[field] = update.changes.get(field)
      }
    }

    return {
      id: `update:${Date.now()}:${Math.random().toString(36).slice(2)}`,
      type: 'data',
      channel: context.subscriptionId,
      data: payload,
      timestamp: Date.now(),
      clientId: context.clientId
    }
  }

  // Get subscription context
  getSubscription(subscriptionId: string): SubscriptionContext | undefined {
    return this.subscriptions.get(subscriptionId)
  }

  // Get all active subscriptions for client
  getClientSubscriptions(clientId: string): SubscriptionContext[] {
    return Array.from(this.subscriptions.values()).filter(
      sub => sub.clientId === clientId
    )
  }

  // Map operation name to channel
  private getChannelFromOperation(operation: string): string {
    // Infer channel from operation name
    // e.g., onDatabaseChange -> database, onUserChange -> user
    const match = operation.match(/^on(\w+)Change$/i)
    if (match) {
      return match[1].toLowerCase()
    }
    return operation.toLowerCase()
  }

  // Capitalize first letter
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  // Get subscription stats
  getStats(): {
    activeSubscriptions: number
    operationTypes: Record<string, number>
    clientCount: number
  } {
    const operationTypes: Record<string, number> = {}
    const clientSet = new Set<string>()

    for (const context of this.subscriptions.values()) {
      const op = context.query.operation
      operationTypes[op] = (operationTypes[op] || 0) + 1
      clientSet.add(context.clientId)
    }

    return {
      activeSubscriptions: this.subscriptions.size,
      operationTypes,
      clientCount: clientSet.size
    }
  }

  // Shutdown
  async shutdown(): Promise<void> {
    this.subscriptions.clear()
    this.queryCache.clear()
    console.log('[SubscriptionHandler] Shutdown complete')
  }
}

// Example GraphQL subscriptions
export const EXAMPLE_SUBSCRIPTIONS = {
  onDatabaseChange: `
    subscription {
      onDatabaseChange(table: "users") {
        id
        name
        email
        updatedAt
      }
    }
  `,

  onUserStatusChange: `
    subscription {
      onUserStatusChange(userId: "user123") {
        status
        lastSeen
        isOnline
      }
    }
  `,

  onMCPOperationChange: `
    subscription {
      onMCPOperationChange(mcp: "database") {
        operation
        status
        timestamp
        duration
      }
    }
  `,

  onReplicationStatusChange: `
    subscription {
      onReplicationStatusChange(table: "analytics") {
        status
        rowsReplicated
        targetProvider
      }
    }
  `,

  onPresenceUpdate: `
    subscription {
      onPresenceUpdate(channel: "code-editor") {
        clientId
        status
        cursor {
          x
          y
        }
      }
    }
  `
}
