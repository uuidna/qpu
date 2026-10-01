/**
 * Phase 14: Distributed Intelligence
 * Multi-node orchestration, consensus, state sync
 */

import NodeRegistry from './node-registry.js'
import FormulaRouter from './formula-router.js'
import ConsensusEngine from './consensus.js'
import StateSynchronizer from './state-sync.js'
import DistributedExecutor from './distributed-executor.js'

export * from './types.js'
export { NodeRegistry, FormulaRouter, ConsensusEngine, StateSynchronizer, DistributedExecutor }

// Re-export MCP operations
export {
  qpuNodeRegisterOp,
  qpuNodeTopologyOp,
  qpuDistributeFormulaOp,
  qpuConsensusStateOp,
  qpuExecuteDistributedOp,
  qpuStateSnapshotOp,
  phase14Ops,
  orchestratePhase14
} from '../mcp/phase-14-distributed-intelligence.js'

/**
 * Distributed Intelligence Bootstrap
 */
export async function bootstrapDistributedIntelligence(config: {
  nodeId: string
  nodeName?: string
  host?: string
  port?: number
  clusterSize?: number
  seedNodes?: any[]
}): Promise<any> {
  const registry = new (NodeRegistry as any)(config.nodeId)
  const router = new (FormulaRouter as any)(registry)
  const consensus = new (ConsensusEngine as any)(
    config.nodeId,
    config.clusterSize || 3
  )
  const synchronizer = new (StateSynchronizer as any)(config.nodeId)
  const executor = new (DistributedExecutor as any)(registry, router)

  // Register local node
  registry.registerLocalNode({
    name: config.nodeName || `node-${config.nodeId.slice(0, 8)}`,
    host: config.host || 'localhost',
    port: config.port || 3000,
    version: '0.9.0'
  })

  // Connect to cluster
  if (config.seedNodes && config.seedNodes.length > 0) {
    await registry.discoverPeers(config.seedNodes)
  }

  return {
    registry,
    router,
    consensus,
    synchronizer,
    executor
  }
}
