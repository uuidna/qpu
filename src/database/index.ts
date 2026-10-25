// Database Module Exports (WAVE 6)
// Distributed database with RAID redundancy, multi-provider routing, automatic failover

export { DistributedDatabase, distributedDB } from './distributed-db.js'
export { MultiProviderRouter } from './router/multi-provider-router.js'
export { RAIDLayer, type RAIDChunk, type RAIDParity } from './raid/raid-layer.js'
export { ConflictResolver, type ConflictMetadata, type VersionedData, type ConflictResolutionStrategy } from './replication/conflict-resolution.js'

// Adapters
export { DatabaseAdapter } from './adapters/base-adapter.js'
export { CloudflareD1Adapter } from './adapters/cloudflare-d1.js'
export { PostgreSQLAdapter } from './adapters/postgresql.js'
export { MongoDBAdapter } from './adapters/mongodb.js'
export { SQLiteAdapter } from './adapters/sqlite.js'

// Types
export type {
  DatabaseProvider,
  Consistency,
  RAIDLevel,
  OperationType,
  HealthStatus,
  QueryOptions,
  WriteOperation,
  ReplicationEvent,
  Transaction,
  FailoverConfig,
  DatabaseConfig,
  ProviderConfig,
  ReplicationConfig,
  ConnectionInfo,
  DatabaseResult,
  MCPDatabaseResponse
} from './types.js'
