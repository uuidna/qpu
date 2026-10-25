// Presence Tracking for Connected Clients (WAVE 8B)
// Tracks online status, typing indicators, and user activity

import type { PresenceData, RealtimeMessage } from './types.js'
import { BroadcasterCoordinator } from './broadcaster.js'

export interface PresenceUpdate {
  clientId: string
  userId?: string
  status: 'online' | 'offline' | 'idle' | 'typing'
  channel: string
  cursor?: { x: number; y: number }
  metadata?: any
}

export interface PresenceEvent {
  type: 'joined' | 'left' | 'updated'
  presence: PresenceData
  timestamp: number
}

export class PresenceTracker {
  private presenceData: Map<string, PresenceData> = new Map()
  private channelPresence: Map<string, Map<string, PresenceData>> = new Map()
  private broadcaster: BroadcasterCoordinator
  private presenceListeners: Map<string, Set<(event: PresenceEvent) => void>> = new Map()
  private inactivityTimeout = 300000 // 5 minutes
  private idleTimeout = 120000 // 2 minutes
  private cleanupInterval: NodeJS.Timeout | null = null
  private activityMap: Map<string, number> = new Map()

  constructor(broadcaster: BroadcasterCoordinator) {
    this.broadcaster = broadcaster
  }

  async initialize(): Promise<void> {
    console.log('[PresenceTracker] Initializing...')

    // Start cleanup process
    this.startCleanup()

    console.log('[PresenceTracker] ✓ Initialized')
  }

  // Client joins a channel
  async join(
    clientId: string,
    channel: string,
    userId?: string,
    metadata?: any
  ): Promise<PresenceData> {
    const presence: PresenceData = {
      clientId,
      userId,
      status: 'online',
      channel,
      lastHeartbeat: Date.now(),
      ...metadata
    }

    // Store presence data
    this.presenceData.set(clientId, presence)

    // Add to channel presence
    if (!this.channelPresence.has(channel)) {
      this.channelPresence.set(channel, new Map())
    }
    this.channelPresence.get(channel)!.set(clientId, presence)

    // Track activity
    this.activityMap.set(clientId, Date.now())

    // Notify about join
    await this.broadcastPresenceEvent('joined', presence)

    console.log(
      `[PresenceTracker] Client joined: ${clientId} on channel: ${channel}`
    )

    return presence
  }

  // Client leaves a channel
  async leave(clientId: string, channel: string): Promise<void> {
    const presence = this.presenceData.get(clientId)

    if (!presence) {
      return
    }

    // Remove from channel
    const channelPresences = this.channelPresence.get(channel)
    if (channelPresences) {
      channelPresences.delete(clientId)
      if (channelPresences.size === 0) {
        this.channelPresence.delete(channel)
      }
    }

    // Remove presence data
    this.presenceData.delete(clientId)
    this.activityMap.delete(clientId)

    // Notify about leave
    const leavingPresence = { ...presence, status: 'offline' as const }
    await this.broadcastPresenceEvent('left', leavingPresence)

    console.log(
      `[PresenceTracker] Client left: ${clientId} from channel: ${channel}`
    )
  }

  // Update presence status
  async updateStatus(
    clientId: string,
    status: 'online' | 'offline' | 'idle' | 'typing',
    metadata?: any
  ): Promise<PresenceData | null> {
    const presence = this.presenceData.get(clientId)

    if (!presence) {
      return null
    }

    presence.status = status
    presence.lastHeartbeat = Date.now()

    if (metadata) {
      Object.assign(presence, metadata)
    }

    // Update activity timestamp
    this.activityMap.set(clientId, Date.now())

    // Broadcast status change
    await this.broadcastPresenceEvent('updated', presence)

    console.log(`[PresenceTracker] Status updated: ${clientId} -> ${status}`)

    return presence
  }

  // Update cursor position
  async updateCursor(
    clientId: string,
    x: number,
    y: number
  ): Promise<PresenceData | null> {
    const presence = this.presenceData.get(clientId)

    if (!presence) {
      return null
    }

    presence.cursor = { x, y }
    presence.lastHeartbeat = Date.now()

    // Update activity timestamp
    this.activityMap.set(clientId, Date.now())

    // Broadcast cursor update
    await this.broadcastPresenceEvent('updated', presence)

    return presence
  }

  // Set typing indicator
  async setTyping(
    clientId: string,
    isTyping: boolean,
    duration?: number
  ): Promise<void> {
    const presence = this.presenceData.get(clientId)

    if (!presence) {
      return
    }

    const previousStatus = presence.status
    presence.status = isTyping ? 'typing' : previousStatus === 'typing' ? 'online' : previousStatus
    presence.lastHeartbeat = Date.now()

    // Broadcast typing status
    await this.broadcastPresenceEvent('updated', presence)

    // Auto-clear typing after duration
    if (isTyping && duration) {
      setTimeout(async () => {
        await this.setTyping(clientId, false)
      }, duration)
    }

    console.log(
      `[PresenceTracker] Typing: ${clientId} -> ${isTyping}`
    )
  }

  // Heartbeat - keep presence alive
  async heartbeat(clientId: string): Promise<PresenceData | null> {
    const presence = this.presenceData.get(clientId)

    if (!presence) {
      return null
    }

    presence.lastHeartbeat = Date.now()
    this.activityMap.set(clientId, Date.now())

    return presence
  }

  // Get channel presence
  getChannelPresence(channel: string): PresenceData[] {
    const channelPresences = this.channelPresence.get(channel)
    return channelPresences ? Array.from(channelPresences.values()) : []
  }

  // Get user presence
  getUserPresence(userId: string): PresenceData[] {
    return Array.from(this.presenceData.values()).filter(p => p.userId === userId)
  }

  // Get presence by client ID
  getPresence(clientId: string): PresenceData | undefined {
    return this.presenceData.get(clientId)
  }

  // Subscribe to presence changes
  onPresenceChange(
    channel: string,
    callback: (event: PresenceEvent) => void
  ): () => void {
    if (!this.presenceListeners.has(channel)) {
      this.presenceListeners.set(channel, new Set())
    }

    const listeners = this.presenceListeners.get(channel)!
    listeners.add(callback)

    // Return unsubscribe function
    return () => {
      listeners.delete(callback)
    }
  }

  // Broadcast presence event
  private async broadcastPresenceEvent(
    type: 'joined' | 'left' | 'updated',
    presence: PresenceData
  ): Promise<void> {
    const event: PresenceEvent = {
      type,
      presence,
      timestamp: Date.now()
    }

    // Notify local listeners
    const listeners = this.presenceListeners.get(presence.channel) || new Set()
    for (const listener of listeners) {
      try {
        listener(event)
      } catch (error) {
        console.error('[PresenceTracker] Listener error:', error)
      }
    }

    // Broadcast via broadcaster
    // This would be picked up by subscribers to the presence channel
  }

  // Clean up inactive presence
  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now()
      const toRemove: string[] = []

      for (const [clientId, lastActive] of this.activityMap) {
        const presence = this.presenceData.get(clientId)
        if (!presence) continue

        const inactiveTime = now - lastActive

        // Mark as idle
        if (inactiveTime > this.idleTimeout && presence.status !== 'idle') {
          presence.status = 'idle'
          console.log(`[PresenceTracker] Marked idle: ${clientId}`)
        }

        // Remove if completely inactive
        if (inactiveTime > this.inactivityTimeout) {
          toRemove.push(clientId)
          console.log(`[PresenceTracker] Removed inactive: ${clientId}`)
        }
      }

      // Clean up
      for (const clientId of toRemove) {
        const presence = this.presenceData.get(clientId)
        if (presence) {
          this.leave(clientId, presence.channel)
        }
      }
    }, 60000) // Check every minute
  }

  // Get presence stats
  getStats(): {
    totalPresent: number
    onlineCount: number
    idleCount: number
    typingCount: number
    channelStats: Record<string, number>
  } {
    let onlineCount = 0
    let idleCount = 0
    let typingCount = 0
    const channelStats: Record<string, number> = {}

    for (const presence of this.presenceData.values()) {
      if (presence.status === 'online') onlineCount++
      if (presence.status === 'idle') idleCount++
      if (presence.status === 'typing') typingCount++

      channelStats[presence.channel] = (channelStats[presence.channel] || 0) + 1
    }

    return {
      totalPresent: this.presenceData.size,
      onlineCount,
      idleCount,
      typingCount,
      channelStats
    }
  }

  // Build presence message
  buildPresenceMessage(
    presence: PresenceData,
    type: 'joined' | 'left' | 'updated'
  ): RealtimeMessage {
    return {
      id: `presence:${Date.now()}:${Math.random().toString(36).slice(2)}`,
      type: 'presence',
      channel: presence.channel,
      data: {
        type,
        presence,
        timestamp: Date.now()
      },
      timestamp: Date.now(),
      clientId: presence.clientId
    }
  }

  // Shutdown
  async shutdown(): Promise<void> {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }

    this.presenceData.clear()
    this.channelPresence.clear()
    this.presenceListeners.clear()
    this.activityMap.clear()

    console.log('[PresenceTracker] Shutdown complete')
  }
}
