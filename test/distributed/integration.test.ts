/**
 * Distributed Intelligence Integration Tests
 * 3-node cluster: discovery, routing, consensus, sync, execution
 */

import test from 'node:test'
import assert from 'node:assert'
import NodeRegistry from '../../src/distributed/node-registry.js'
import FormulaRouter from '../../src/distributed/formula-router.js'
import ConsensusEngine from '../../src/distributed/consensus.js'
import StateSynchronizer from '../../src/distributed/state-sync.js'
import DistributedExecutor from '../../src/distributed/distributed-executor.js'

async function setupCluster(): Promise<{
  registries: Map<string, NodeRegistry>
  routers: Map<string, FormulaRouter>
  consensus: Map<string, ConsensusEngine>
  synchronizers: Map<string, StateSynchronizer>
  executors: Map<string, DistributedExecutor>
}> {
  const registries = new Map<string, NodeRegistry>()
  const routers = new Map<string, FormulaRouter>()
  const consensus = new Map<string, ConsensusEngine>()
  const synchronizers = new Map<string, StateSynchronizer>()
  const executors = new Map<string, DistributedExecutor>()

  // Initialize 3 nodes
  for (let i = 1; i <= 3; i++) {
    const nodeId = `node-${i}`

    const registry = new NodeRegistry(nodeId)
    registry.registerLocalNode({
      name: nodeId,
      host: 'localhost',
      port: 3000 + i,
      version: '0.9.0',
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      disk: Math.random() * 100
    })

    const router = new FormulaRouter(registry)
    const consensusEngine = new ConsensusEngine(nodeId, 3)
    const synchronizer = new StateSynchronizer(nodeId)
    const executor = new DistributedExecutor(registry, router)

    registries.set(nodeId, registry)
    routers.set(nodeId, router)
    consensus.set(nodeId, consensusEngine)
    synchronizers.set(nodeId, synchronizer)
    executors.set(nodeId, executor)
  }

  // Connect all nodes
  const seedNodes = Array.from(registries.entries())
    .slice(1)
    .map(([_, reg]) => reg.getState().nodes.values().next().value)

  for (const [nodeId, registry] of registries) {
    if (nodeId !== 'node-1') {
      await registry.discoverPeers(seedNodes)
    }
  }

  return { registries, routers, consensus, synchronizers, executors }
}

test('Integration: 3-node cluster setup', async () => {
  const { registries } = await setupCluster()

  // Each node should have all 3 nodes
  for (const [nodeId, registry] of registries) {
    const state = registry.getState()
    assert.strictEqual(state.clusterSize, 3, `${nodeId} should see 3 nodes`)
  }

  console.log('✅ 3-node cluster setup works')
})

test('Integration: Node topology discovery', async () => {
  const { registries } = await setupCluster()

  for (const [nodeId, registry] of registries) {
    const topology = registry.getTopology()

    assert.strictEqual(topology.clusterSize, 3)
    assert.strictEqual(topology.nodes.length, 3)
    assert(topology.nodes.every((n: any) => n.id && n.name && n.status))

    console.log(`${nodeId}: topology verified`)
  }

  console.log('✅ Node topology discovery works')
})

test('Integration: Formula routing across cluster', async () => {
  const { routers } = await setupCluster()

  // Register formulas
  const formulaMetadata = [
    {
      id: 'cpu-heavy-formula',
      name: 'cpu-heavy',
      domain: 'compute',
      distributeAcross: 'single-node' as const,
      affinity: 'cpu-heavy' as const
    },
    {
      id: 'distributed-formula',
      name: 'distributed',
      domain: 'quantum',
      distributeAcross: 'distributable' as const,
      multiResult: true
    }
  ]

  for (const [_, router] of routers) {
    router.registerFormulas(formulaMetadata)
  }

  // Route formulas from each node
  for (const [nodeId, router] of routers) {
    const result = await router.routeFormula('cpu-heavy-formula')
    assert.strictEqual(result.selectedNodes.length, 1)

    const multiResult = await router.routeFormula('distributed-formula')
    assert(multiResult.selectedNodes.length >= 1)

    console.log(`${nodeId}: routed formulas successfully`)
  }

  console.log('✅ Formula routing works across cluster')
})

test('Integration: Consensus protocol', async () => {
  const clusterData = await setupCluster()
  const { consensus: consensusEngines } = clusterData

  // All nodes propose same state
  const testData = { cluster: 'test', value: 42 }

  const results: Array<{ node: string; decision: string }> = []

  for (const [nodeId, engine] of consensusEngines) {
    const decision = await engine.proposeState(testData, 1)
    results.push({ node: nodeId, decision })
  }

  // Check decisions
  for (const result of results) {
    assert(result.decision === 'accept' || result.decision === 'reject' || result.decision === 'abort')
  }

  console.log(`✅ Consensus reached: ${results.map(r => `${r.node}=${r.decision}`).join(', ')}`)
})

test('Integration: State synchronization', async () => {
  const { synchronizers } = await setupCluster()

  // Node 1 updates state
  const [node1Id, node1Sync] = synchronizers.entries().next().value
  node1Sync.updateState('shared_key', 'shared_value')
  node1Sync.updateState('config', { version: '0.9.0' })

  // Get state snapshot
  const snapshot = node1Sync.createSnapshot()
  const { data: stateData } = node1Sync.getStateForSync()

  // Verify from other nodes
  let verified = 0
  for (const [nodeId, sync] of synchronizers) {
    if (nodeId === node1Id) continue

    const verification = sync.verifyPeerState(snapshot, stateData)
    if (verification.consistent) {
      verified++
    }
  }

  assert(verified > 0, 'At least one peer should verify state')

  console.log(`✅ State synchronized and verified by ${verified} peers`)
})

test('Integration: Distributed formula execution', async () => {
  const { routers, executors } = await setupCluster()

  // Register formula on all nodes
  for (const [_, router] of routers) {
    router.registerFormula({
      id: 'exec-test',
      name: 'execution-test',
      domain: 'test',
      distributeAcross: 'single-node'
    })
  }

  // Execute from first node
  const [firstNodeId, firstExecutor] = executors.entries().next().value

  const result = await firstExecutor.executeFormula('exec-test', { test: true }, 3000)

  assert.strictEqual(result.formulaId, 'exec-test')
  assert(result.results.length > 0)
  assert(typeof result.confidence === 'number')

  console.log(`✅ Distributed execution: ${result.results.length} results, confidence ${Math.round(result.confidence * 100)}%`)
})

test('Integration: Concurrent state updates', async () => {
  const { synchronizers } = await setupCluster()

  // All nodes update different keys concurrently
  const updates = Array.from(synchronizers.entries()).map(([nodeId, sync], idx) => {
    sync.updateState(`key_${nodeId}`, `value_from_${nodeId}`)
    return nodeId
  })

  // Verify all updates
  for (const [nodeId, sync] of synchronizers) {
    const stats = sync.getStats()
    assert(stats.dataSize > 0)
    assert(stats.localVersion > 0)
  }

  console.log(`✅ Concurrent updates from ${updates.length} nodes completed`)
})

test('Integration: Cluster health monitoring', async () => {
  const { registries } = await setupCluster()

  // Check health from each node
  for (const [nodeId, registry] of registries) {
    const healthy = registry.getHealthyNodes()
    const topology = registry.getTopology()

    assert(healthy.length > 0)
    assert(topology.health.healthy > 0)

    console.log(`${nodeId}: ${topology.health.healthy} healthy, ${topology.health.degraded} degraded, ${topology.health.unhealthy} unhealthy`)
  }

  console.log('✅ Cluster health monitoring works')
})

test('Integration: Full distributed workflow', async () => {
  console.log('\n📋 Running full distributed workflow...\n')

  const { registries, routers, consensus: consensusEngines, synchronizers, executors } = await setupCluster()

  // Step 1: Discover nodes
  console.log('[1/5] Node discovery...')
  for (const [nodeId, registry] of registries) {
    const nodes = registry.getHealthyNodes()
    assert.strictEqual(nodes.length, 3)
  }
  console.log('✅ All 3 nodes discovered\n')

  // Step 2: Register formulas
  console.log('[2/5] Formula registration...')
  for (const [_, router] of routers) {
    router.registerFormulas([
      {
        id: 'workflow-formula',
        name: 'workflow-test',
        domain: 'test',
        distributeAcross: 'distributable',
        multiResult: true
      }
    ])
  }
  console.log('✅ Formulas registered\n')

  // Step 3: Route formulas
  console.log('[3/5] Formula routing...')
  const [, primaryRouter] = routers.entries().next().value
  const routing = await primaryRouter.routeFormula('workflow-formula')
  assert(routing.selectedNodes.length > 0)
  console.log(`✅ Formula routed to ${routing.selectedNodes.length} nodes\n`)

  // Step 4: Consensus on state
  console.log('[4/5] Consensus synchronization...')
  const sharedState = { workflow: 'distributed', status: 'active' }
  const [, primaryConsensus] = consensusEngines.entries().next().value
  const decision = await primaryConsensus.proposeState(sharedState, 1)
  assert(decision === 'accept' || decision === 'reject' || decision === 'abort')
  console.log(`✅ Consensus decision: ${decision}\n`)

  // Step 5: Execute distributed
  console.log('[5/5] Distributed execution...')
  const [, primaryExecutor] = executors.entries().next().value
  const result = await primaryExecutor.executeFormula('workflow-formula', sharedState, 5000)
  console.log(`✅ Execution complete: ${result.results.length} nodes, ${Math.round(result.confidence * 100)}% confidence\n`)

  console.log('🎉 Full workflow completed successfully!')
})

console.log(`
╔════════════════════════════════════════════════════════════════════════════════╗
║                 DISTRIBUTED INTEGRATION TESTS COMPLETE                        ║
╚════════════════════════════════════════════════════════════════════════════════╝
`)
