/**
 * Node Registry Tests: Discovery, gossip, heartbeat
 */

import test from 'node:test'
import assert from 'node:assert'
import NodeRegistry from '../../src/distributed/node-registry.js'

test('NodeRegistry: Local node registration', async () => {
  const registry = new NodeRegistry('node-1')

  registry.registerLocalNode({
    name: 'node-1',
    host: 'localhost',
    port: 3000,
    version: '0.9.0'
  })

  const state = registry.getState()
  assert.strictEqual(state.nodes.size, 1)
  assert.strictEqual(state.localNodeId, 'node-1')
  assert.strictEqual(state.clusterSize, 1)

  console.log('✅ Local node registration works')
})

test('NodeRegistry: Peer discovery', async () => {
  const registry = new NodeRegistry('node-1')

  registry.registerLocalNode({
    name: 'node-1',
    host: 'localhost',
    port: 3000
  })

  // Simulate seed nodes
  const peers = await registry.discoverPeers([
    { id: 'node-2', name: 'node-2', host: 'localhost', port: 3001 },
    { id: 'node-3', name: 'node-3', host: 'localhost', port: 3002 }
  ])

  assert.strictEqual(peers.length, 3)
  assert.strictEqual(registry.getClusterSize(), 3)

  console.log('✅ Peer discovery works')
})

test('NodeRegistry: Get healthy nodes', async () => {
  const registry = new NodeRegistry('node-1')

  registry.registerLocalNode({
    name: 'node-1',
    host: 'localhost',
    port: 3000
  })

  registry.registerPeerNode({
    id: 'node-2',
    name: 'node-2',
    host: 'localhost',
    port: 3001,
    capabilities: [],
    version: '0.9.0',
    status: 'healthy',
    lastHeartbeat: Date.now(),
    cpu: 50,
    memory: 60,
    disk: 40
  })

  registry.registerPeerNode({
    id: 'node-3',
    name: 'node-3',
    host: 'localhost',
    port: 3002,
    capabilities: [],
    version: '0.9.0',
    status: 'unhealthy',
    lastHeartbeat: Date.now() - 60000,
    cpu: 20,
    memory: 30,
    disk: 10
  })

  const healthy = registry.getHealthyNodes()
  assert.strictEqual(healthy.length, 2) // node-1 and node-2
  assert(healthy.some(n => n.id === 'node-1'))
  assert(healthy.some(n => n.id === 'node-2'))
  assert(!healthy.some(n => n.id === 'node-3'))

  console.log('✅ Healthy nodes filtering works')
})

test('NodeRegistry: Get nodes by capability', async () => {
  const registry = new NodeRegistry('node-1')

  registry.registerLocalNode({
    name: 'node-1',
    host: 'localhost',
    port: 3000,
    capabilities: [
      {
        type: 'formula',
        name: 'executor',
        maxConcurrent: 10,
        currentLoad: 0
      },
      {
        type: 'compute',
        name: 'cpu',
        affinity: 'cpu-heavy',
        maxConcurrent: 100,
        currentLoad: 0
      }
    ]
  })

  registry.registerPeerNode({
    id: 'node-2',
    name: 'node-2',
    host: 'localhost',
    port: 3001,
    capabilities: [
      {
        type: 'compute',
        name: 'gpu',
        affinity: 'quantum-only',
        maxConcurrent: 50,
        currentLoad: 0
      }
    ],
    version: '0.9.0',
    status: 'healthy',
    lastHeartbeat: Date.now(),
    cpu: 30,
    memory: 40,
    disk: 20
  })

  const cpuNodes = registry.getNodesByCapability('compute', 'cpu-heavy')
  assert.strictEqual(cpuNodes.length, 1)
  assert.strictEqual(cpuNodes[0].id, 'node-1')

  const quantumNodes = registry.getNodesByCapability('compute', 'quantum-only')
  assert.strictEqual(quantumNodes.length, 1)
  assert.strictEqual(quantumNodes[0].id, 'node-2')

  console.log('✅ Capability-based filtering works')
})

test('NodeRegistry: Topology info', async () => {
  const registry = new NodeRegistry('node-1')

  registry.registerLocalNode({
    name: 'node-1',
    host: 'localhost',
    port: 3000
  })

  registry.registerPeerNode({
    id: 'node-2',
    name: 'node-2',
    host: 'localhost',
    port: 3001,
    capabilities: [],
    version: '0.9.0',
    status: 'healthy',
    lastHeartbeat: Date.now(),
    cpu: 50,
    memory: 60,
    disk: 40
  })

  const topology = registry.getTopology()

  assert.strictEqual(topology.clusterSize, 2)
  assert.strictEqual(topology.nodes.length, 2)
  assert.strictEqual(topology.topology_version, 2)
  assert(topology.nodes.every((n: any) => n.id && n.name && n.status))

  console.log('✅ Topology info works')
})

test('NodeRegistry: Unregister peer', async () => {
  const registry = new NodeRegistry('node-1')

  registry.registerLocalNode({
    name: 'node-1',
    host: 'localhost',
    port: 3000
  })

  registry.registerPeerNode({
    id: 'node-2',
    name: 'node-2',
    host: 'localhost',
    port: 3001,
    capabilities: [],
    version: '0.9.0',
    status: 'healthy',
    lastHeartbeat: Date.now(),
    cpu: 50,
    memory: 60,
    disk: 40
  })

  assert.strictEqual(registry.getClusterSize(), 2)

  registry.unregisterPeerNode('node-2')

  assert.strictEqual(registry.getClusterSize(), 1)
  assert.strictEqual(registry.getNodeInfo('node-2'), undefined)

  console.log('✅ Unregister peer works')
})

console.log(`
╔════════════════════════════════════════════════════════════════════════════════╗
║                    NODE REGISTRY TESTS COMPLETE                               ║
╚════════════════════════════════════════════════════════════════════════════════╝
`)
