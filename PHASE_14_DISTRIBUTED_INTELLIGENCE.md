# Phase 14: Distributed Intelligence for UUIDNA QPU v0.9.0

## Overview

Phase 14 implements multi-node distributed intelligence for UUIDNA QPU, enabling:
- **Multi-node orchestration**: Cluster discovery, node registry, gossip protocol
- **Cross-node formula routing**: Intelligent routing based on compute affinity
- **Consensus mechanisms**: PBFT-lite for state consistency across nodes
- **State synchronization**: Vector clocks + merkle trees for eventual consistency
- **Distributed execution**: Execute formulas across cluster, aggregate results

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                DISTRIBUTED INTELLIGENCE                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Node 1     │  │   Node 2     │  │   Node 3     │  │
│  │              │  │              │  │              │  │
│  │ Registry     │  │ Registry     │  │ Registry     │  │
│  │ Router       │  │ Router       │  │ Router       │  │
│  │ Consensus    │  │ Consensus    │  │ Consensus    │  │
│  │ Sync         │  │ Sync         │  │ Sync         │  │
│  │ Executor     │  │ Executor     │  │ Executor     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                  │                  │          │
│         └──────────────────┴──────────────────┘          │
│              Gossip Mesh (Discovery)                    │
│              PBFT Consensus (Safety)                    │
│              Merkle Sync (Consistency)                  │
│              Formula Routing (Routing)                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Components

### 1. Node Registry (`src/distributed/node-registry.ts`)

**Purpose**: Register nodes, discover peers via gossip protocol, monitor node health

**Key Features**:
- Gossip-based discovery (low overhead, self-healing)
- Heartbeat monitoring (detects unhealthy nodes)
- Capability-based node filtering
- Load tracking per node

**API**:
```typescript
registry.registerLocalNode(info)
registry.discoverPeers(seedNodes)
registry.registerPeerNode(node)
registry.getHealthyNodes()
registry.getNodesByCapability(type, affinity)
registry.getTopology()
```

### 2. Formula Router (`src/distributed/formula-router.ts`)

**Purpose**: Route formulas to optimal nodes based on compute affinity and load

**Key Features**:
- Affinity-based node selection (cpu-heavy, memory-intensive, quantum-only, general)
- Load-balanced routing
- Broadcast routing for multi-result formulas
- Route caching

**Routing Strategies**:
- **Single-node**: Route to lowest-load node matching affinity
- **Multi-node**: Route to f+1 nodes for consensus aggregation
- **Broadcast**: Send to all healthy nodes
- **Load-balanced**: Select node with lowest current load

**API**:
```typescript
router.registerFormula(metadata)
router.routeFormula(formulaId)
router.getNodesByCapability(type, affinity)
router.clearRouteCache()
```

### 3. Consensus Engine (`src/distributed/consensus.ts`)

**Purpose**: PBFT-lite consensus for state consistency across cluster

**Protocol**: 3-phase commit
1. **PRE-PREPARE**: Primary node proposes state
2. **PREPARE**: Replicas send prepare messages
3. **COMMIT**: Finalize when quorum reached

**Key Features**:
- Quorum-based (f+1 nodes required for consensus)
- Message logging for recovery
- View change on timeout
- State pruning for memory efficiency

**API**:
```typescript
consensus.proposeState(data, sequenceNumber)
consensus.handleMessage(message)
consensus.getState(sequenceNumber)
consensus.getMessageLog(sequenceNumber)
consensus.requestViewChange()
```

### 4. State Synchronizer (`src/distributed/state-sync.ts`)

**Purpose**: Maintain eventual consistency via vector clocks + merkle trees

**Key Features**:
- Vector clocks for causality detection
- Merkle trees for data verification
- Conflict detection (concurrent updates)
- Snapshot creation for disaster recovery

**Conflict Resolution**:
1. Detect concurrent updates via vector clocks
2. Check causality (reject non-causal events)
3. Use wall-clock timestamp as tiebreaker for conflicts
4. Merge structured data (sets, maps)

**API**:
```typescript
sync.updateState(key, value)
sync.deleteState(key)
sync.mergeState(event, peerNodeId)
sync.createSnapshot()
sync.verifyPeerState(snapshot, data)
sync.getState(key)
```

### 5. Distributed Executor (`src/distributed/distributed-executor.ts`)

**Purpose**: Execute formulas across cluster nodes, aggregate results

**Key Features**:
- Parallel execution on multiple nodes
- Result aggregation strategies (consensus, average, first, all)
- Retry logic with exponential backoff
- Execution history and statistics

**Aggregation Strategies**:
- **First**: Return result from first successful node
- **All**: Return results from all nodes
- **Consensus**: Majority vote (Byzantine-tolerant)
- **Average**: Compute average of numeric results
- **Custom**: Formula-specific aggregation

**API**:
```typescript
executor.executeFormula(formulaId, input, timeout)
executor.executeAndWait(formulaId, input, timeout)
executor.executeWithRetry(formulaId, input, maxRetries, timeout)
executor.getExecutionHistory(formulaId)
executor.getStats()
```

## MCP Operations

### 4 Core Operations

#### 1. `qpu_node_register`
Register this node + connect to cluster
```
input:
  nodeId: string
  nodeName?: string
  host?: string
  port?: number
  clusterSize?: number
  seedNodes?: NodeInfo[]

output:
  nodeId: string
  clusterSize: number
  healthyNodes: number
  topology: ClusterTopology
```

#### 2. `qpu_node_topology`
Discover cluster topology + node capabilities
```
input: (optional)

output:
  clusterSize: number
  nodes: NodeInfo[]
  health: {healthy, degraded, unhealthy}
  topology: {nodes, edges}
```

#### 3. `qpu_distribute_formula`
Route formula to optimal node(s)
```
input:
  formulaId: string
  affinity?: string
  formulaMetadata?: FormulaMetadata

output:
  formulaId: string
  targetNodes: NodeInfo[]
  strategy: string
  routing: RouteInfo
```

#### 4. `qpu_consensus_state`
Sync state across cluster via consensus
```
input:
  sequenceNumber?: number
  data: any
  operation?: 'update' | 'merge' | 'delete'

output:
  decision: 'accept' | 'reject' | 'abort'
  sequenceNumber: number
  consensus: boolean
  state: StateInfo
  consensus: ConsensusInfo
```

### Bonus Operations

#### 5. `qpu_execute_distributed`
Execute formula across cluster nodes
```
input:
  formulaId: string
  input: any
  timeout?: number

output:
  formulaId: string
  aggregated: any
  nodes: number
  successfulNodes: number
  confidence: number
```

#### 6. `qpu_state_snapshot`
Create state snapshot for disaster recovery
```
input: (optional)

output:
  snapshot: StateSnapshot
  state: SyncState
  stats: SyncStats
```

## Usage Examples

### Single Node Setup
```typescript
import NodeRegistry from '@uuidna/qpu/distributed'

const registry = new NodeRegistry('my-node')
registry.registerLocalNode({
  name: 'my-node',
  host: 'localhost',
  port: 3000
})

const topology = registry.getTopology()
console.log(`Cluster: ${topology.clusterSize} nodes`)
```

### Cluster Discovery
```typescript
const seedNodes = [
  { id: 'node-2', host: 'remote1.example.com', port: 3000 },
  { id: 'node-3', host: 'remote2.example.com', port: 3000 }
]

const peers = await registry.discoverPeers(seedNodes)
console.log(`Discovered ${peers.length} peers`)
```

### Formula Routing
```typescript
const router = new FormulaRouter(registry)

router.registerFormula({
  id: 'cpu-heavy-job',
  name: 'Large computation',
  affinity: 'cpu-heavy'
})

const routing = await router.routeFormula('cpu-heavy-job')
console.log(`Route to: ${routing.selectedNodes.map(n => n.name)}`)
```

### Distributed Execution
```typescript
const executor = new DistributedExecutor(registry, router)

const result = await executor.executeFormula(
  'cpu-heavy-job',
  { input: 'data' },
  30000 // 30s timeout
)

console.log(`Confidence: ${result.confidence}`)
console.log(`Results: ${result.results.length} nodes`)
```

### State Synchronization
```typescript
const sync = new StateSynchronizer('my-node')

// Update state
sync.updateState('config', { version: '0.9.0' })
sync.updateState('state', { active: true })

// Create snapshot
const snapshot = sync.createSnapshot()
console.log(`Root: ${snapshot.merkleRoot}`)

// Merge peer updates
const peerEvent = {
  type: 'update',
  key: 'peer_config',
  value: { remote: true },
  timestamp: Date.now(),
  sourceNode: 'peer-node',
  vectorClock: { 'my-node': 2, 'peer-node': 1 }
}

sync.mergeState(peerEvent, 'peer-node')
```

### Consensus
```typescript
const consensus = new ConsensusEngine('my-node', 3)

const data = { important: true, value: 42 }
const decision = await consensus.proposeState(data, 1)

if (decision === 'accept') {
  console.log('Consensus reached!')
}
```

## Testing

Run distributed tests:
```bash
npm test -- test/distributed/
```

Test suites:
- `node-registry.test.ts`: Discovery, gossip, heartbeat
- `formula-router.test.ts`: Routing, affinity, load balancing
- `consensus.test.ts`: PBFT protocol, quorum, view changes
- `state-sync.test.ts`: Vector clocks, merkle trees, consistency
- `distributed-executor.test.ts`: Multi-node execution, aggregation
- `integration.test.ts`: Full 3-node cluster workflow

## Performance Characteristics

### Node Discovery
- Gossip fanout: 3 nodes per round
- Gossip interval: 5 seconds
- Heartbeat timeout: 30 seconds
- Expected convergence: <30s for cluster of 10 nodes

### Formula Routing
- Route computation: <10ms
- Route cache TTL: 10 seconds
- Supports up to 1000+ nodes with load balancing

### Consensus
- Quorum size: f+1 nodes (f = faulty nodes)
- 3-phase protocol: PRE-PREPARE → PREPARE → COMMIT
- Timeout: 5 seconds per phase
- View change timeout: 15 seconds
- Supports Byzantine failures (f <= n/3)

### State Sync
- Vector clock size: O(n) per event (n = nodes)
- Merkle tree verification: O(log n)
- Convergence: Eventual (within seconds)
- Bandwidth: Minimal (only changed state)

### Distributed Execution
- Parallel execution on N nodes
- Result aggregation: <100ms for typical formulas
- Retry backoff: 2^n * 100ms (exponential)
- Timeout: Configurable (default 30s)

## Configuration

### Gossip Protocol
```typescript
const registry = new NodeRegistry('node-1', {
  fanout: 3,           // nodes to gossip to per round
  interval: 5000,      // ms between gossip rounds
  maxAge: 60000        // ms to keep gossip messages
})
```

### Consensus Engine
```typescript
const consensus = new ConsensusEngine('node-1', 3, {
  f: 1,                // max faulty nodes
  timeout: 5000,       // ms per phase
  retries: 3,          // retry attempts
  viewChangeTimeout: 15000
})
```

## Monitoring

### Cluster Health
```typescript
const healthy = registry.getHealthyNodes()
const degraded = registry.getState().nodes.values()
  .filter(n => n.status === 'degraded')
const unhealthy = registry.getState().nodes.values()
  .filter(n => n.status === 'unhealthy')
```

### State Consistency
```typescript
const stats = sync.getStats()
console.log(`Consistency: ${stats.consistency}%`)
console.log(`Pending events: ${stats.pendingEvents}`)
console.log(`Data size: ${stats.dataSize} keys`)
```

### Execution Performance
```typescript
const stats = executor.getStats()
console.log(`Success rate: ${stats.successRate}%`)
console.log(`Avg confidence: ${stats.avgConfidence}%`)
console.log(`Avg duration: ${stats.avgDuration}ms`)
```

## Security Considerations

1. **Byzantine Tolerance**: Consensus handles up to f faulty nodes (f < n/3)
2. **Message Signing**: In production, sign consensus messages
3. **Network Security**: Use TLS for inter-node communication
4. **Access Control**: Authenticate nodes before cluster join
5. **State Encryption**: Encrypt sensitive data in synchronizer

## Roadmap

- [ ] WebSocket transport for inter-node communication
- [ ] gRPC alternative for low-latency clusters
- [ ] Multi-datacenter replication
- [ ] Automatic rebalancing on node failure
- [ ] Sharding for large clusters
- [ ] Persistent consensus log

## License

CC-BY-NC-ND-4.0 (standard UUIDNA license)

See /LICENSE for details.
