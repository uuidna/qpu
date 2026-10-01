/**
 * Phase 14: Distributed Intelligence
 * Multi-node orchestration, consensus, state sync
 */

export * from './types.js'
export { default as NodeRegistry } from './node-registry.js'
export { default as FormulaRouter } from './formula-router.js'
export { default as ConsensusEngine } from './consensus.js'
export { default as StateSynchronizer } from './state-sync.js'
export { default as DistributedExecutor } from './distributed-executor.js'

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
}): Promise<{
  registry: typeof NodeRegistry
  router: typeof FormulaRouter
  consensus: typeof ConsensusEngine
  synchronizer: typeof StateSynchronizer
  executor: typeof DistributedExecutor
}> {
  const registry = new (await import('./node-registry.js')).default(config.nodeId)
  const router = new (await import('./formula-router.js')).default(registry)
  const consensus = new (await import('./consensus.js')).default(
    config.nodeId,
    config.clusterSize || 3
  )
  const synchronizer = new (await import('./state-sync.js')).default(config.nodeId)
  const executor = new (await import('./distributed-executor.js')).default(registry, router)

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
    registry: NodeRegistry,
    router: FormulaRouter,
    consensus: ConsensusEngine,
    synchronizer: StateSynchronizer,
    executor: DistributedExecutor
  }
}
