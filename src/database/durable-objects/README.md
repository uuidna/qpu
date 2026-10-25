# Durable Objects Integration (WAVE 6)

Cloudflare Durable Objects provide **strong consistency, coordination, and persistent state** for the distributed database layer. They solve critical coordination problems across multiple database providers.

## Why Durable Objects?

Traditional database replication faces these challenges:

| Problem | Solution |
|---------|----------|
| **No global coordination** | Durable Objects provide single source of truth |
| **Race conditions in failover** | Consensus-based failover with DO coordination |
| **Lost replication events** | Persistent replication queue in DO storage |
| **Distributed transaction problems** | Global lock coordination via DO |
| **Conflict resolution conflicts** | Centralized conflict log in DO |
| **Vector clock coordination** | Shared vector clock state in DO |

Durable Objects eliminate these issues by providing:
- ✅ **Strong consistency** - Single global state
- ✅ **Persistent storage** - Survives worker restarts
- ✅ **Distributed locks** - Prevent race conditions
- ✅ **Coordination** - Leader election, consensus
- ✅ **Request ordering** - Serialized access

## Architecture

```
┌─────────────────────────────────────────┐
│  Distributed Database Requests          │
├─────────────────────────────────────────┤
│  Durable Objects Coordinator            │
├──────────┬──────────┬──────────┬────────┤
│Repl      │Failover  │Conflict  │Locks   │
│Queue     │Votes     │Log       │        │
├──────────┴──────────┴──────────┴────────┤
│  DO Storage (Persistent)                │
└─────────────────────────────────────────┘
```

## Key Components

### 1. Replication Coordinator

Manages replication queue and tracks status:

```typescript
// Coordinator queues replication work
await doIntegration.coordinatedWrite(
  'users',
  { id: 123, name: 'John' },
  ['postgresql', 'mongodb']
)

// Returns: { success: true, replicated: 2 }
```

**Features:**
- Persistent replication queue
- Status tracking (pending → in-progress → completed)
- Automatic timeout detection (5 minutes)
- Prevents concurrent replication of same data
- Tracks error messages for each replication

### 2. Failover Coordinator

Manages consensus-based failover:

```typescript
// Coordinate failover with majority consensus
const failed = await doIntegration.coordinateFailover('mongodb')

if (failed) {
  console.log('Failover successful with consensus')
} else {
  console.log('No consensus reached')
}
```

**Process:**
1. Each provider votes based on health
2. Coordinator collects votes
3. Majority (2/3+) determines new primary
4. Failover executed only with consensus
5. State persisted to prevent flip-flops

### 3. Conflict Coordinator

Records and resolves conflicts:

```typescript
// Record conflict
const conflictId = await doIntegration.recordConflict(
  'user:123:name',
  [
    { value: 'John', timestamp: 1000, provider: 'postgresql' },
    { value: 'Jane', timestamp: 1001, provider: 'mongodb' }
  ],
  'last-write-wins'
)

// Later: resolve it
await doIntegration.resolveConflict(conflictId, {
  value: 'Jane',
  resolvedBy: 'last-write-wins',
  timestamp: 1001
})
```

**Benefits:**
- Audit trail of conflicts
- Resolution strategy recorded
- Queryable conflict history
- Prevents duplicate resolutions

### 4. Distributed Locks

Serialize access to shared resources:

```typescript
// Acquire lock before critical operation
if (await doIntegration.acquireLock('user:123:update', 30000)) {
  try {
    // Guaranteed exclusive access for 30 seconds
    await updateUser(123, newData)
  } finally {
    await doIntegration.releaseLock('user:123:update')
  }
} else {
  console.log('Another operation in progress')
}
```

**Use cases:**
- Prevent concurrent migrations
- Serialize configuration changes
- Lock table migrations
- Coordinate schema changes

### 5. Vector Clock Coordination

Maintain causal ordering:

```typescript
// After write on provider
const clock = await doIntegration.updateVectorClock('postgresql', {
  'postgresql': 5,
  'mongodb': 3,
  'd1': 4
})

// Later: check causality
const currentClock = await doIntegration.getVectorClock()
const isCausallyBefore = (clock.postgresql <= currentClock.postgresql)
```

## Usage Examples

### Example 1: Replicate with Persistence

```typescript
// Coordinated replication with queue
const result = await doIntegration.coordinatedWrite(
  'events',
  { userId: 123, action: 'login', timestamp: Date.now() },
  ['postgresql', 'mongodb']
)

// If replication fails, status is in DO and will be retried
console.log(`Replicated to ${result.replicated} providers`)
```

### Example 2: Strong Consistency Write

```typescript
// Wait for full replication
const result = await doIntegration.strongConsistencyWrite(
  'accounts',
  { id: 1, balance: 1000 },
  ['postgresql', 'mongodb']
)

// Only returns when fully replicated to all providers
if (result.success) {
  console.log('Write is now durable on all providers')
}
```

### Example 3: Distributed Transaction

```typescript
// Coordinate transaction with locks
const result = await doIntegration.coordinateTransaction(
  [
    { query: 'UPDATE users SET balance = balance - ? WHERE id = ?', params: [100, 1] },
    { query: 'UPDATE users SET balance = balance + ? WHERE id = ?', params: [100, 2] }
  ],
  ['postgresql', 'mongodb']  // optional: replicate after
)

if (result.success) {
  console.log('Transaction completed with consensus')
}
```

### Example 4: Consensus Failover

```typescript
// Detect primary down
const health = await router.getHealth('postgresql')

if (health.status === 'unavailable') {
  // Coordinate failover with consensus
  const success = await doIntegration.coordinateFailover('mongodb')

  if (success) {
    console.log('Failover successful - new primary is MongoDB')
  } else {
    console.log('No consensus - keep old primary offline')
  }
}
```

### Example 5: Prevent Race Conditions

```typescript
// Prevent concurrent schema migrations
const lockKey = 'schema:migration:v2'

if (await doIntegration.acquireLock(lockKey, 300000)) {
  try {
    // Only one worker can run this at a time
    await migrateSchema()
  } finally {
    await doIntegration.releaseLock(lockKey)
  }
} else {
  console.log('Migration already in progress')
}
```

## Configuration

### wrangler.toml

```toml
# Durable Objects binding
[[durable_objects.bindings]]
name = "REPLICATION_COORDINATOR"
class_name = "ReplicationCoordinator"
script_name = "qpu"

# Production environment
[env.production.durable_objects.bindings]
name = "REPLICATION_COORDINATOR"
class_name = "ReplicationCoordinator"
script_name = "qpu-prod"
```

### Initialize in Worker

```typescript
import { DurableObjectIntegration } from './database/durable-objects'
import { distributedDB } from './database'

// In handler or startup:
const doIntegration = new DurableObjectIntegration()
await doIntegration.initialize(distributedDB.getRouter(), env.REPLICATION_COORDINATOR)
```

## Storage Layout

Durable Objects store in `/state`:

```json
{
  "replicationQueue": [
    {
      "id": "repl:123:abc",
      "sourceProvider": "cloudflare-d1",
      "targetProviders": ["postgresql", "mongodb"],
      "status": "completed",
      "startTime": 1696200000000,
      "endTime": 1696200005000,
      "rowsReplicated": 1000,
      "errors": []
    }
  ],
  "failoverState": {
    "currentPrimary": "mongodb",
    "previousPrimary": "postgresql",
    "failoverTime": 1696200010000,
    "consensusReached": true,
    "votes": {
      "cloudflare-d1": "mongodb",
      "postgresql": "mongodb",
      "mongodb": "mongodb"
    }
  },
  "conflictLog": {
    "conflict:123:abc": {
      "id": "conflict:123:abc",
      "key": "user:456:name",
      "conflictingVersions": [...],
      "resolution": {...},
      "resolvedAt": 1696200015000,
      "strategy": "last-write-wins"
    }
  },
  "vectorClocks": {
    "postgresql": { "postgresql": 100, "mongodb": 95, "d1": 98 },
    "mongodb": { "postgresql": 99, "mongodb": 101, "d1": 99 }
  },
  "locks": {
    "user:123:update": { "owner": "owner:xyz", "expires": 1696200020000 }
  }
}
```

## Performance

| Operation | Latency | Notes |
|-----------|---------|-------|
| Queue replication | <50ms | Single DO stub |
| Check status | <50ms | Single DO read |
| Acquire lock | <50ms | Atomic write |
| Record conflict | <50ms | Append to log |
| Get failover state | <50ms | Single read |
| Consensus failover | <500ms | Multiple DO calls |

## Resilience

### Durability
- ✅ All writes persisted immediately
- ✅ Survives worker restarts
- ✅ Survives Cloudflare edge outages
- ✅ Geo-replicated automatically

### Consistency
- ✅ Strong consistency within DO
- ✅ Linearizable for all operations
- ✅ Single DO ensures ordering
- ✅ No conflicts within DO

## Monitoring

```typescript
// Get comprehensive stats
const stats = await doIntegration.getStats()

console.log(stats)
// {
//   replication: { pending: 2, inProgress: 1, completed: 100, failed: 0 },
//   failover: { consensusReached: false, currentPrimary: 'postgresql' },
//   conflicts: { total: 15, unresolved: 2 },
//   locks: 3,
//   vectorClocks: 4
// }
```

## Best Practices

1. **Always release locks**
   ```typescript
   try {
     await doIntegration.acquireLock(key, ttl)
     // do work
   } finally {
     await doIntegration.releaseLock(key)
   }
   ```

2. **Wait for replication on critical writes**
   ```typescript
   // For payments, inventory, critical data
   await doIntegration.strongConsistencyWrite(...)
   
   // For logs, analytics - don't wait
   await doIntegration.coordinatedWrite(...)
   ```

3. **Monitor conflict resolution**
   ```typescript
   const stats = await doIntegration.getStats()
   if (stats.conflicts.unresolved > 10) {
     alert('Too many unresolved conflicts')
   }
   ```

4. **Set appropriate TTLs**
   ```typescript
   // Short TTL for fast-moving resources
   await doIntegration.acquireLock('session:123', 5000)
   
   // Long TTL for schema changes
   await doIntegration.acquireLock('schema:migration', 300000)
   ```

## Integration with Database MCP

Durable Objects are used internally by the database system:

```typescript
// MCP calls automatically use DO coordination
await mcp.call({
  tool: 'db:write',
  args: {
    operation: 'insert',
    table: 'users',
    data: { id: 1, name: 'John' },
    replication: 'all'  // Uses DO queue internally
  }
})

// Failover is consensus-based
await mcp.call({
  tool: 'db:failover',
  args: { to: 'mongodb' }  // Uses DO for consensus
})
```

## Troubleshooting

### Lock timeout
**Problem:** Acquiring lock fails  
**Solution:** Check if previous operation crashed without releasing lock  
**Fix:** Implement lock expiration (already done - 5 minute timeout)

### Replication queue grows
**Problem:** Replication keeps failing  
**Solution:** Check health of target providers  
**Fix:** Automatic cleanup after 1 hour for failed replication

### Conflicts unresolved
**Problem:** Too many unresolved conflicts  
**Solution:** Check conflict resolution strategy  
**Fix:** Implement custom resolver or increase consistency level

## See Also

- [RAID Layer](../raid/) - Storage redundancy
- [Multi-Provider Router](../router/) - Query routing
- [Conflict Resolution](../replication/) - Conflict strategies
- [Database Types](../types.ts) - Type definitions
