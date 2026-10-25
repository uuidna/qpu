// Real-time synchronization types (WAVE 8B)

export interface RealtimeMessage {
  id: string
  type: 'subscribe' | 'unsubscribe' | 'data' | 'error' | 'heartbeat' | 'presence'
  channel: string
  data?: any
  timestamp: number
  clientId: string
}

export interface DeltaUpdate {
  id: string
  entity: string
  entityId: string
  changeType: 'create' | 'update' | 'delete'
  changes: Map<string, any>
  previousValues?: Map<string, any>
  timestamp: number
  sequenceNumber: number
  causedBy: string // userId or systemId
}

export interface PresenceData {
  clientId: string
  userId?: string
  status: 'online' | 'offline' | 'idle' | 'typing'
  channel: string
  cursor?: { x: number; y: number }
  lastHeartbeat: number
}

export interface Subscription {
  id: string
  clientId: string
  channel: string
  query?: any // GraphQL query
  filters?: any
  createdAt: number
}

export interface BroadcastMessage {
  id: string
  type: 'update' | 'presence' | 'heartbeat' | 'ack'
  payload: any
  targetChannels?: string[]
  excludeClientId?: string
  timestamp: number
}

export interface ChangeDetectionEvent {
  mcp: string
  operation: string
  resource: string
  resourceId: string
  changes: any
  timestamp: number
  userId?: string
}

export interface ConnectionPool {
  clientId: string
  websocket?: WebSocket
  sse?: ReadableStreamDefaultController<any>
  protocol: 'websocket' | 'sse'
  subscriptions: Set<string>
  messageQueue: RealtimeMessage[]
  lastSeen: number
  reconnectToken?: string
}

export interface ConflictResolution {
  strategy: 'last-write-wins' | 'first-write-wins' | 'merge' | 'custom'
  resolution?: (a: any, b: any) => any
}

export interface OrderingGuarantee {
  enabled: boolean
  sequenceNumbering: boolean
  causalOrdering: boolean
  totalOrdering: boolean
}

export interface RealtimeConfig {
  heartbeatInterval: number
  connectionTimeout: number
  maxMessageQueueSize: number
  maxConnections: number
  conflictResolution: ConflictResolution
  orderingGuarantee: OrderingGuarantee
  enablePresenceTracking: boolean
  enableCompression: boolean
}
