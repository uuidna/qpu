/**
 * Distributed Intelligence Types
 * Node registry, formula routing, consensus, state sync
 */

// ============================================================================
// NODE REGISTRY TYPES
// ============================================================================

export interface NodeInfo {
  id: string
  name: string
  host: string
  port: number
  capabilities: NodeCapability[]
  version: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  lastHeartbeat: number
  cpu: number
  memory: number
  disk: number
  networkLatency?: number
}

export interface NodeCapability {
  type: 'formula' | 'compute' | 'storage' | 'sync' | 'consensus'
  name: string
  affinity?: 'cpu-heavy' | 'memory-intensive' | 'quantum-only' | 'general'
  maxConcurrent: number
  currentLoad: number
}

export interface NodeRegistryState {
  nodes: Map<string, NodeInfo>
  localNodeId: string
  clusterSize: number
  lastSync: number
}

// ============================================================================
// FORMULA ROUTING TYPES
// ============================================================================

export interface FormulaMetadata {
  id: string
  name: string
  domain: string
  distributeAcross?: 'single-node' | 'distributable'
  affinity?: 'cpu-heavy' | 'memory-intensive' | 'quantum-only' | 'general'
  inputSize?: number
  outputSize?: number
  estimatedDuration?: number
  multiResult?: boolean // one input → results from N nodes
  aggregationStrategy?: 'average' | 'consensus' | 'first' | 'all' | 'custom'
}

export interface FormulaRoute {
  formulaId: string
  targetNodes: string[]
  strategy: 'affinity' | 'load-balanced' | 'broadcast'
  priority: number
  timeout: number
}

export interface RoutingResult {
  formulaId: string
  route: FormulaRoute
  selectedNodes: NodeInfo[]
  reason: string
}

// ============================================================================
// CONSENSUS TYPES
// ============================================================================

export type ConsensusPhase = 'pre-prepare' | 'prepare' | 'commit'
export type ConsensusDecision = 'accept' | 'reject' | 'abort'

export interface ConsensusMessage {
  phase: ConsensusPhase
  viewNumber: number
  sequenceNumber: number
  senderId: string
  digest: string // hash of state
  timestamp: number
  data?: any
}

export interface ConsensusState {
  viewNumber: number
  sequenceNumber: number
  currentPhase: ConsensusPhase
  prepareQuorum: Set<string>
  commitQuorum: Set<string>
  decision?: ConsensusDecision
  finalDigest?: string
  timestamp: number
}

export interface ConsensusConfig {
  f: number // max faulty nodes (consensus requires f+1 agreement)
  timeout: number
  retries: number
  viewChangeTimeout: number
}

// ============================================================================
// STATE SYNC TYPES
// ============================================================================

export interface VectorClock {
  [nodeId: string]: number
}

export interface MerkleNode {
  hash: string
  children?: [MerkleNode, MerkleNode]
  leaf?: boolean
  data?: any
}

export interface StateSnapshot {
  version: number
  timestamp: number
  nodeId: string
  vectorClock: VectorClock
  merkleRoot: string
  checksum: string
}

export interface StateSyncEvent {
  type: 'update' | 'delete' | 'merge'
  key: string
  value?: any
  timestamp: number
  sourceNode: string
  vectorClock: VectorClock
}

export interface SyncState {
  localVersion: number
  peerVersions: Map<string, number>
  pendingEvents: StateSyncEvent[]
  vectorClock: VectorClock
  lastMerkleRoot: string
}

// ============================================================================
// DISTRIBUTED EXECUTOR TYPES
// ============================================================================

export interface ExecutionPlan {
  formulaId: string
  targetNodes: string[]
  parallelizable: boolean
  aggregation: 'average' | 'consensus' | 'first' | 'all' | 'custom'
  timeout: number
}

export interface NodeExecutionResult {
  nodeId: string
  formulaId: string
  success: boolean
  result?: any
  error?: string
  duration: number
  timestamp: number
}

export interface AggregatedResult {
  formulaId: string
  success: boolean
  results: NodeExecutionResult[]
  aggregated?: any
  consensus?: boolean
  confidence: number
}

// ============================================================================
// MCP OPERATION TYPES
// ============================================================================

export interface MCPOperation {
  id: string
  domain: string
  name: string
  description: string
  execute: (context: any) => Promise<any>
  verify: () => Promise<boolean>
}

// ============================================================================
// GOSSIP PROTOCOL TYPES
// ============================================================================

export interface GossipMessage {
  id: string
  type: 'state-update' | 'node-join' | 'node-leave' | 'heartbeat'
  sourceNode: string
  timestamp: number
  data: any
  seenBy: Set<string>
}

export interface GossipConfig {
  fanout: number // nodes to gossip to per round
  interval: number // ms between gossip rounds
  maxAge: number // ms to keep gossip messages
}

// ============================================================================
// CLUSTER STATE TYPES
// ============================================================================

export interface ClusterState {
  clusterName: string
  localNodeId: string
  nodes: Map<string, NodeInfo>
  formulas: Map<string, FormulaMetadata>
  routes: Map<string, FormulaRoute>
  consensusState: ConsensusState
  syncState: SyncState
  topologyVersion: number
}

export interface ClusterHealth {
  healthy: number
  degraded: number
  unhealthy: number
  averageLatency: number
  dataConsistency: number // 0-100
  consensusHealth: number // 0-100
}
