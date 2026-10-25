# Distributed Database Layer (WAVE 6)

Production-grade distributed database with RAID redundancy, multi-provider routing, automatic failover, and complete data portability.

## Quick Start

```typescript
import { distributedDB } from '@uuidna/qpu/database'

// Initialize with configuration
await distributedDB.initialize({
  primary: {
    provider: 'cloudflare-d1',
    connection: { db: env.db, kv: env.CACHE },
    options: { timeout: 30000 }
  },
  secondary: [
    {
      provider: 'postgresql',
      connection: process.env.POSTGRES_URL,
      priority: 1,
      regions: ['us-east-1']
    },
    {
      provider: 'mongodb',
      connection: process.env.MONGODB_URI,
      priority: 2
    }
  ],
  cache: {
    provider: 'cloudflare-kv',
    connection: { kv: env.CACHE }
  },
  failover: {
    enabled: true,
    strategy: 'active-active',
    healthCheckInterval: 30000,
    replicationLag: 5000,
    maxRetries: 3,
    autoPromote: true
  },
  replication: {
    maxRetries: 3,
    batchSize: 100,
    processingInterval: 1000,
    confirmationRequired: true,
    maxLag: 5000,
    conflictResolution: 'last-write-wins'
  }
})

// Query with automatic provider selection
const users = await distributedDB.query({
  sql: 'SELECT * FROM users WHERE active = ?',
  params: [true],
  consistency: 'eventual',
  preferredProviders: ['cloudflare-d1', 'postgresql']
})

// Write with automatic replication
await distributedDB.write({
  operation: 'insert',
  table: 'events',
  data: { userId: 123, event: 'login', timestamp: new Date() },
  replication: 'all',  // Replicate to all secondary providers
  consistency: 'eventual'
})

// Transaction for strong consistency
const result = await distributedDB.transaction({
  provider: 'postgresql',
  steps: [
    { query: 'UPDATE accounts SET balance = balance - $1 WHERE id = $2', params: [100, 1] },
    { query: 'UPDATE accounts SET balance = balance + $1 WHERE id = $2', params: [100, 2] }
  ],
  isolation: 'serializable'
})

// Health check
const health = await distributedDB.health()

// Migrate between providers
await distributedDB.migrate('cloudflare-d1', 'postgresql')

// Export/import for portability
const backup = await distributedDB.exportAll()
await fs.writeFile('backup.json', JSON.stringify(backup))
```

## Architecture

### RAID Levels

| Level | Type | Use Case | Redundancy |
|-------|------|----------|-----------|
| **RAID 0** | Striping | High performance, low redundancy | 1x |
| **RAID 1** | Mirroring | Full redundancy, 2x overhead | 2x |
| **RAID 5** | Striping + Parity | Balanced (default) | 1.5x |
| **RAID 10** | Mirrored pairs | Maximum resilience | 2x |

### Multi-Provider Routing

Query routing automatically selects the best provider based on:
- Provider health (from continuous health checks)
- Consistency requirements (strong/eventual/causal)
- Geographic region
- Current load
- Preferred providers

```typescript
// Strong consistency → PostgreSQL (ACID)
await distributedDB.query({
  sql: 'SELECT balance FROM accounts WHERE id = ?',
  params: [123],
  consistency: 'strong',
  preferredProviders: ['postgresql']
})

// Analytics queries → MongoDB (fast scanning)
await distributedDB.query({
  sql: 'SELECT COUNT(*) as count FROM events WHERE date >= ?',
  params: [dateThreshold],
  consistency: 'eventual',
  preferredProviders: ['mongodb', 'cloudflare-d1']
})

// Hot data → Cloudflare KV (edge latency)
await distributedDB.query({
  sql: 'SELECT * FROM users WHERE id = ?',
  params: [123],
  consistency: 'eventual',
  preferredProviders: ['cloudflare-kv']
})
```

### Automatic Failover

When primary provider becomes unavailable:

1. Health check detects failure (no response in 30s)
2. Automatic failover to secondary provider
3. Replication log is replayed to sync state
4. Clients automatically reconnected
5. Alert sent to ops team
6. Primary recovery initiated in background

```typescript
// Manual failover if needed
await distributedDB.failover('mongodb')
```

### Data Replication

Supports different replication modes:

```typescript
// Replicate to all providers
await distributedDB.write({
  operation: 'insert',
  table: 'critical_data',
  data: { ... },
  replication: 'all'
})

// Replicate to majority (consensus)
await distributedDB.write({
  operation: 'insert',
  table: 'important_data',
  data: { ... },
  replication: 'majority'
})

// Replicate only to primary
await distributedDB.write({
  operation: 'insert',
  table: 'log_data',
  data: { ... },
  replication: 'primary'
})

// No replication
await distributedDB.write({
  operation: 'insert',
  table: 'temporary_data',
  data: { ... },
  replication: 'none'
})
```

### Consistency Models

```typescript
// Strong consistency (ACID)
// Synchronous replication, full durability
await distributedDB.query({
  sql: '...',
  consistency: 'strong'
})

// Eventual consistency
// Asynchronous replication, eventually consistent
await distributedDB.query({
  sql: '...',
  consistency: 'eventual'
})

// Causal consistency
// Causally related operations are ordered
await distributedDB.query({
  sql: '...',
  consistency: 'causal'
})

// Read-repair consistency
// Reads trigger repair of inconsistent replicas
await distributedDB.query({
  sql: '...',
  consistency: 'read-repair'
})
```

## Conflict Resolution

When data is written concurrently to multiple providers:

### Strategies

```typescript
// Last-write-wins (default)
// Later timestamp wins
conflictResolver: 'last-write-wins'

// First-write-wins
// Earlier timestamp wins
conflictResolver: 'first-write-wins'

// Vector clock
// Causality-based ordering
conflictResolver: 'vector-clock'

// Provider priority
// Higher-priority provider wins
conflictResolver: 'provider-priority'

// Custom
// Application-specific logic
conflictResolver: 'custom'
```

### Conflict Detection

```typescript
const validation = await distributedDB.validate()
if (!validation.valid) {
  console.log('Conflicts detected:')
  validation.mismatches.forEach(m => console.log(m))
}
```

## Database Adapters

### Cloudflare D1 (Default)
- **Strengths**: Edge latency, serverless, no ops
- **Use**: Primary provider, cache layer
- **Configuration**: Via Wrangler bindings

### PostgreSQL
- **Strengths**: ACID, complex queries, mature ecosystem
- **Use**: Strong consistency, transactions
- **Configuration**: Connection string, pool size

### MongoDB
- **Strengths**: Flexible schema, fast scanning, good for analytics
- **Use**: Denormalized reads, analytics
- **Configuration**: Connection string, pool size

### SQLite
- **Strengths**: Lightweight, embedded, no network
- **Use**: Local caching, development
- **Configuration**: File path or `:memory:`

## Data Migration

### Export all data
```typescript
const backup = await distributedDB.exportAll()
console.log(`Exported ${backup.data.length} tables`)
```

### Migrate between providers
```typescript
const result = await distributedDB.migrate('cloudflare-d1', 'postgresql')
console.log(`Migrated ${result.migratedRows} rows`)
```

### Import from backup
```typescript
const backup = JSON.parse(await fs.readFile('backup.json', 'utf-8'))
await distributedDB.importAll(backup.schema, backup.data)
```

## Monitoring & Health

```typescript
// Get health status
const health = await distributedDB.health()
console.log(health)
// [
//   { provider: 'cloudflare-d1', status: 'healthy', latency: 12ms, errorRate: 0% },
//   { provider: 'postgresql', status: 'healthy', latency: 45ms, errorRate: 0.5% },
//   { provider: 'mongodb', status: 'degraded', latency: 200ms, errorRate: 5% }
// ]

// Get comprehensive stats
const stats = await distributedDB.stats()
console.log(stats)
```

## Integration with MCP

The database is exposed as an MCP service:

```typescript
import { DatabaseMCP } from '@uuidna/qpu/mcp/database-mcp'

const dbMcp = new DatabaseMCP()
await dbMcp.initialize(config)

// Via MCP tools
await mcp.call({
  tool: 'db:query',
  args: { sql: 'SELECT * FROM users', consistency: 'strong' }
})

await mcp.call({
  tool: 'db:write',
  args: { operation: 'insert', table: 'events', data: {...}, replication: 'all' }
})

await mcp.call({
  tool: 'db:health',
  args: { providers: ['cloudflare-d1', 'postgresql'] }
})
```

## Performance Characteristics

| Operation | P50 | P95 | P99 |
|-----------|-----|-----|-----|
| D1 Single Read | 10ms | 25ms | 50ms |
| PostgreSQL Read | 5ms | 15ms | 30ms |
| MongoDB Read | 8ms | 20ms | 40ms |
| KV Cache Hit | 1ms | 2ms | 5ms |
| Write (all replicas) | 50ms | 100ms | 200ms |
| Failover Switch | <1s | <2s | <5s |

## Configuration Examples

### Development (SQLite)
```typescript
{
  primary: { provider: 'sqlite', connection: ':memory:' },
  secondary: [],
  failover: { enabled: false }
}
```

### Staging (PostgreSQL + MongoDB)
```typescript
{
  primary: {
    provider: 'postgresql',
    connection: process.env.POSTGRES_URL
  },
  secondary: [
    {
      provider: 'mongodb',
      connection: process.env.MONGODB_URI,
      priority: 1
    }
  ],
  failover: { enabled: true }
}
```

### Production (Cloudflare + PostgreSQL + MongoDB)
```typescript
{
  primary: {
    provider: 'cloudflare-d1',
    connection: { db: env.db }
  },
  secondary: [
    {
      provider: 'postgresql',
      connection: process.env.POSTGRES_URL,
      priority: 1,
      regions: ['us-east-1', 'eu-west-1']
    },
    {
      provider: 'mongodb',
      connection: process.env.MONGODB_URI,
      priority: 2,
      regions: ['us-west-2']
    }
  ],
  cache: {
    provider: 'cloudflare-kv',
    connection: { kv: env.CACHE }
  },
  failover: {
    enabled: true,
    strategy: 'active-active',
    healthCheckInterval: 30000,
    autoPromote: true
  },
  replication: {
    conflictResolution: 'last-write-wins',
    maxLag: 5000
  }
}
```

## Best Practices

1. **Use strong consistency for critical operations**
   ```typescript
   consistency: 'strong'  // For payments, inventory
   ```

2. **Use eventual consistency for non-critical data**
   ```typescript
   consistency: 'eventual'  // For analytics, logs
   ```

3. **Always replicate important writes**
   ```typescript
   replication: 'all'  // For user data, settings
   ```

4. **Monitor health regularly**
   ```typescript
   setInterval(() => distributedDB.health(), 30000)
   ```

5. **Test failover in staging**
   ```typescript
   // Simulate provider failure and verify automatic recovery
   ```

6. **Backup critical data**
   ```typescript
   const backup = await distributedDB.exportAll()
   // Store in secure location
   ```

## Troubleshooting

### Provider unavailable
Check health status and verify configuration. Auto-failover will activate if enabled.

### Replication lag
High replication lag can indicate network issues or provider overload. Check secondary provider load.

### Conflicts detected
Use `/health` to check provider status. Conflicts typically resolve automatically with configured strategy.

### Migration failures
Ensure schema is compatible between providers. Start with test data.

## License

CC-BY-NC-ND-4.0 — See LICENSE for details.
