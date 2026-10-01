/**
 * Formula Router Tests: Routing, affinity matching, load balancing
 */

import test from 'node:test'
import assert from 'node:assert'
import NodeRegistry from '../../src/distributed/node-registry.js'
import FormulaRouter from '../../src/distributed/formula-router.js'

test('FormulaRouter: Register and route formula', async () => {
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

  const router = new FormulaRouter(registry)

  router.registerFormula({
    id: 'formula-1',
    name: 'test-formula',
    domain: 'quantum',
    distributeAcross: 'single-node',
    affinity: 'general'
  })

  const result = await router.routeFormula('formula-1')

  assert.strictEqual(result.formulaId, 'formula-1')
  assert.strictEqual(result.selectedNodes.length, 1)
  assert(result.selectedNodes[0])
  assert.strictEqual(result.route.strategy, 'load-balanced')

  console.log('✅ Single-node routing works')
})

test('FormulaRouter: Multi-node routing', async () => {
  const registry = new NodeRegistry('node-1')

  registry.registerLocalNode({
    name: 'node-1',
    host: 'localhost',
    port: 3000
  })

  for (let i = 2; i <= 4; i++) {
    registry.registerPeerNode({
      id: `node-${i}`,
      name: `node-${i}`,
      host: 'localhost',
      port: 3000 + i,
      capabilities: [],
      version: '0.9.0',
      status: 'healthy',
      lastHeartbeat: Date.now(),
      cpu: 50,
      memory: 60,
      disk: 40
    })
  }

  const router = new FormulaRouter(registry)

  router.registerFormula({
    id: 'formula-multi',
    name: 'test-formula',
    domain: 'quantum',
    distributeAcross: 'distributable',
    multiResult: true,
    affinity: 'general'
  })

  const result = await router.routeFormula('formula-multi')

  assert.strictEqual(result.formulaId, 'formula-multi')
  assert.strictEqual(result.route.strategy, 'broadcast')
  assert(result.selectedNodes.length >= 2)

  console.log(`✅ Multi-node routing works (${result.selectedNodes.length} nodes)`)
})

test('FormulaRouter: Affinity matching', async () => {
  const registry = new NodeRegistry('node-1')

  registry.registerLocalNode({
    name: 'node-1',
    host: 'localhost',
    port: 3000,
    cpu: 20, // Low CPU
    capabilities: [
      {
        type: 'compute',
        name: 'general',
        affinity: 'general',
        maxConcurrent: 100,
        currentLoad: 0
      }
    ]
  })

  registry.registerPeerNode({
    id: 'node-2',
    name: 'node-2-high-cpu',
    host: 'localhost',
    port: 3001,
    capabilities: [
      {
        type: 'compute',
        name: 'cpu',
        affinity: 'cpu-heavy',
        maxConcurrent: 100,
        currentLoad: 0
      }
    ],
    version: '0.9.0',
    status: 'healthy',
    lastHeartbeat: Date.now(),
    cpu: 95, // High CPU
    memory: 40,
    disk: 30
  })

  registry.registerPeerNode({
    id: 'node-3',
    name: 'node-3-high-mem',
    host: 'localhost',
    port: 3002,
    capabilities: [
      {
        type: 'compute',
        name: 'memory',
        affinity: 'memory-intensive',
        maxConcurrent: 50,
        currentLoad: 0
      }
    ],
    version: '0.9.0',
    status: 'healthy',
    lastHeartbeat: Date.now(),
    cpu: 20,
    memory: 95,
    disk: 50
  })

  const router = new FormulaRouter(registry)

  // CPU-heavy formula
  router.registerFormula({
    id: 'cpu-formula',
    name: 'cpu-intensive',
    domain: 'compute',
    distributeAcross: 'single-node',
    affinity: 'cpu-heavy'
  })

  const cpuResult = await router.routeFormula('cpu-formula')
  assert.strictEqual(cpuResult.selectedNodes[0].id, 'node-2')

  // Memory-intensive formula
  router.registerFormula({
    id: 'mem-formula',
    name: 'memory-intensive',
    domain: 'compute',
    distributeAcross: 'single-node',
    affinity: 'memory-intensive'
  })

  const memResult = await router.routeFormula('mem-formula')
  assert.strictEqual(memResult.selectedNodes[0].id, 'node-3')

  console.log('✅ Affinity matching works')
})

test('FormulaRouter: Route cache', async () => {
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

  const router = new FormulaRouter(registry)

  router.registerFormula({
    id: 'formula-cache-test',
    name: 'test',
    domain: 'test',
    distributeAcross: 'single-node'
  })

  // First route
  const result1 = await router.routeFormula('formula-cache-test')
  const nodes1 = result1.selectedNodes.map(n => n.id)

  // Second route (should use cache)
  const result2 = await router.routeFormula('formula-cache-test')
  const nodes2 = result2.selectedNodes.map(n => n.id)

  assert.deepStrictEqual(nodes1, nodes2)
  assert.strictEqual(result2.reason, 'cached')

  // Clear cache
  router.clearRouteCache()

  const result3 = await router.routeFormula('formula-cache-test')
  assert.notStrictEqual(result3.reason, 'cached')

  console.log('✅ Route cache works')
})

test('FormulaRouter: List formulas', async () => {
  const registry = new NodeRegistry('node-1')

  registry.registerLocalNode({
    name: 'node-1',
    host: 'localhost',
    port: 3000
  })

  const router = new FormulaRouter(registry)

  router.registerFormulas([
    {
      id: 'f1',
      name: 'formula-1',
      domain: 'a',
      distributeAcross: 'single-node'
    },
    {
      id: 'f2',
      name: 'formula-2',
      domain: 'b',
      distributeAcross: 'distributable'
    },
    {
      id: 'f3',
      name: 'formula-3',
      domain: 'c',
      distributeAcross: 'single-node'
    }
  ])

  const formulas = router.listFormulas()
  assert.strictEqual(formulas.length, 3)
  assert(formulas.some(f => f.id === 'f1'))
  assert(formulas.some(f => f.id === 'f2'))
  assert(formulas.some(f => f.id === 'f3'))

  console.log('✅ Formula listing works')
})

console.log(`
╔════════════════════════════════════════════════════════════════════════════════╗
║                    FORMULA ROUTER TESTS COMPLETE                              ║
╚════════════════════════════════════════════════════════════════════════════════╝
`)
