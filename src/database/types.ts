// Distributed Database Layer - Types & Interfaces (WAVE 6)
// Multi-provider, RAID-based, automatic failover

export type DatabaseProvider =
  | 'cloudflare-d1'
  | 'postgresql'
  | 'mongodb'
  | 'sqlite'
  | 'duckdb'
  | 'dynamodb'
  | 'firestore'

export type Consistency =
  | 'strong'
  | 'eventual'
  | 'causal'
  | 'read-repair'

export type RAIDLevel = 0 | 1 | 5 | 10

export type OperationType = 'insert' | 'update' | 'delete' | 'select'

// Health status
export interface HealthStatus {
  provider: string
  status: 'healthy' | 'degraded' | 'unavailable'
  latency: number
  connectionPoolSize: number
  failureCount: number
  lastCheckTime: number
  uptime: number
  errorRate: number
}

// Query interface
export interface QueryOptions {
  sql: string
  params?: any[]
  consistency?: Consistency
  preferredProviders?: DatabaseProvider[]
  timeout?: number
  retries?: number
}

// Write operation
export interface WriteOperation {
  operation: OperationType
  table: string
  data?: any
  where?: any
  replication?: 'all' | 'majority' | 'primary' | 'none'
  timeout?: number
  consistency?: Consistency
}

// Replication event
export interface ReplicationEvent {
  id: string
  timestamp: number
  operation: OperationType
  table: string
  primaryKey: string | number
  previousValue?: any
  newValue?: any
  sourceProvider: DatabaseProvider
  replicated: boolean
  replicationTargets: DatabaseProvider[]
  replicationLag: number
}

// Transaction
export interface Transaction {
  provider: DatabaseProvider
  steps: Array<{ query: string; params?: any[] }>
  isolation?: 'read-uncommitted' | 'read-committed' | 'repeatable-read' | 'serializable'
  timeout?: number
}

// Failover config
export interface FailoverConfig {
  enabled: boolean
  strategy: 'active-active' | 'active-passive' | 'round-robin'
  healthCheckInterval: number
  replicationLag: number
  maxRetries: number
  autoPromote: boolean
}

// Database config
export interface DatabaseConfig {
  primary: ProviderConfig
  secondary: ProviderConfig[]
  cache?: ProviderConfig
  failover: FailoverConfig
  replication?: ReplicationConfig
}

// Provider config
export interface ProviderConfig {
  provider: DatabaseProvider
  connection: string | any
  priority?: number
  regions?: string[]
  options?: {
    timeout?: number
    retries?: number
    batchSize?: number
    maxConnections?: number
    [key: string]: any
  }
}

// Replication config
export interface ReplicationConfig {
  maxRetries: number
  batchSize: number
  processingInterval: number
  confirmationRequired: boolean
  maxLag: number
  conflictResolution: 'first-write-wins' | 'last-write-wins' | 'custom'
}

// Connection info
export interface ConnectionInfo {
  provider: DatabaseProvider
  pool: any
  connected: boolean
  connectionTime: number
  dialect: string
}

// Database result
export interface DatabaseResult<T = any> {
  data: T[]
  count: number
  affectedRows?: number
  insertId?: string | number
  provider: DatabaseProvider
  latency: number
  fromCache: boolean
}

// MCP database call response
export interface MCPDatabaseResponse {
  success: boolean
  data?: any
  error?: string
  provider: DatabaseProvider
  latency: number
  timestamp: number
}
