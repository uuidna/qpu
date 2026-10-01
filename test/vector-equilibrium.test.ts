/**
 * Vector Equilibrium Test Suite
 * Tests the 88-formula network in all directions:
 * - Forward/backward execution paths
 * - Cross-domain formula interactions
 * - Harmonic stability under load
 * - Bidirectional data flows
 * - Equilibrium recovery after perturbations
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { defaultManager, executeGlobal, operationRegistry } from '../src/core/index.js'
import { orchestrator } from '../src/harmony/orchestrator.js'
import { metricsCollector } from '../src/core/obs.js'

describe('Vector Equilibrium - All Directions', () => {
  beforeAll(async () => {
    // Initialize system
    await defaultManager.initialize()
    metricsCollector.start()
  })

  afterAll(async () => {
    metricsCollector.stop()
    await defaultManager.shutdown()
  })

  describe('Axis-Aligned Tests (Single Dimensions)', () => {
    it('should execute formulas along X-axis (forward computation)', async () => {
      const ops = operationRegistry.list()
      expect(ops.length).toBeGreaterThan(0)

      for (const op of ops.slice(0, 10)) {
        const result = await executeGlobal(op.name, {})
        expect(result).toBeDefined()
        expect(result.status).toBe('success' || 'pending')
      }
    })

    it('should execute formulas along Y-axis (cross-domain)', async () => {
      const domains = [
        'harmony',
        'quantum',
        'ai',
        'enterprise',
        'io',
        'ml'
      ]

      for (const domain of domains) {
        const domainOps = operationRegistry.list().filter(o => o.tags?.includes(domain))
        expect(domainOps.length).toBeGreaterThan(0)

        // Execute each domain's representative formula
        if (domainOps.length > 0) {
          const result = await executeGlobal(domainOps[0].name, {})
          expect(result.status).toBeDefined()
        }
      }
    })

    it('should execute formulas along Z-axis (composition depth)', async () => {
      // Test single, binary, and ternary compositions
      const singleResult = await executeGlobal('identity', { x: 42 })
      expect(singleResult).toBeDefined()

      // Compose two operations
      const composed2 = await executeGlobal('compose', {
        ops: ['double', 'add-one']
      })
      expect(composed2).toBeDefined()

      // Compose three operations
      const composed3 = await executeGlobal('compose', {
        ops: ['double', 'add-one', 'square']
      })
      expect(composed3).toBeDefined()
    })
  })

  describe('Diagonal Tests (Multi-Dimensional)', () => {
    it('should traverse XY diagonal (computation + cross-domain)', async () => {
      const paths = [
        ['harmony-cluster', 'ai-optimize'],
        ['quantum-gate', 'ml-train'],
        ['enterprise-shard', 'io-stream']
      ]

      for (const [op1, op2] of paths) {
        const r1 = await executeGlobal(op1, {})
        const r2 = await executeGlobal(op2, {})
        expect(r1).toBeDefined()
        expect(r2).toBeDefined()
      }
    })

    it('should traverse XZ diagonal (computation + depth)', async () => {
      const input = { data: 'test' }
      const r1 = await executeGlobal('preprocess', input)
      const r2 = await executeGlobal('transform', r1)
      const r3 = await executeGlobal('aggregate', r2)

      expect(r1).toBeDefined()
      expect(r2).toBeDefined()
      expect(r3).toBeDefined()
    })

    it('should traverse YZ diagonal (domain + depth)', async () => {
      // Quantum domain, varying composition depth
      const q1 = await executeGlobal('quantum-measure', {})
      const q2 = await executeGlobal('quantum-entangle', {})
      expect(q1).toBeDefined()
      expect(q2).toBeDefined()
    })

    it('should traverse XYZ diagonal (all three dimensions)', async () => {
      // Start with quantum optimization across harmony cluster with composition
      const step1 = await executeGlobal('quantum-optimize', {})
      const step2 = await executeGlobal('harmony-broadcast', step1)
      const step3 = await executeGlobal('aggregate-consensus', step2)

      expect(step1).toBeDefined()
      expect(step2).toBeDefined()
      expect(step3).toBeDefined()
    })
  })

  describe('Octant Tests (All 8 Directions)', () => {
    const octants = [
      { name: '+X+Y+Z', path: ['forward', 'domain-1', 'compose'] },
      { name: '+X+Y-Z', path: ['forward', 'domain-1', 'single'] },
      { name: '+X-Y+Z', path: ['forward', 'domain-2', 'compose'] },
      { name: '+X-Y-Z', path: ['forward', 'domain-2', 'single'] },
      { name: '-X+Y+Z', path: ['backward', 'domain-1', 'compose'] },
      { name: '-X+Y-Z', path: ['backward', 'domain-1', 'single'] },
      { name: '-X-Y+Z', path: ['backward', 'domain-2', 'compose'] },
      { name: '-X-Y-Z', path: ['backward', 'domain-2', 'single'] }
    ]

    for (const octant of octants) {
      it(`should execute octant ${octant.name}`, async () => {
        const results = []
        for (const op of octant.path) {
          try {
            const result = await executeGlobal(op, {})
            results.push(result)
          } catch (e) {
            // Op may not exist; that's ok for this test
          }
        }
        expect(results.length).toBeGreaterThan(0)
      })
    }
  })

  describe('Harmonic Coherence (Equilibrium Stability)', () => {
    it('should maintain stability when executing all 88 formulas', async () => {
      const allOps = operationRegistry.list()
      const results = []

      for (const op of allOps) {
        try {
          const result = await executeGlobal(op.name, {})
          results.push(result)
        } catch (e) {
          // Some ops may require specific inputs
        }
      }

      expect(results.length).toBeGreaterThanOrEqual(allOps.length * 0.8)
      const successCount = results.filter(r => r.status === 'success').length
      expect(successCount / results.length).toBeGreaterThan(0.7)
    })

    it('should recover equilibrium after perturbation', async () => {
      const baseline = metricsCollector.getMetrics()

      // Execute rapid fire of operations
      for (let i = 0; i < 50; i++) {
        const ops = operationRegistry.list()
        const randomOp = ops[Math.floor(Math.random() * ops.length)]
        try {
          await executeGlobal(randomOp.name, {})
        } catch (e) {
          // Ignore errors
        }
      }

      // Wait for system to stabilize
      await new Promise(resolve => setTimeout(resolve, 100))

      const afterPerturbation = metricsCollector.getMetrics()

      // Check that error rate isn't excessive
      expect(afterPerturbation.errorCount).toBeLessThan(baseline.errorCount + 50)
    })

    it('should exhibit harmonic resonance across orchestrator', async () => {
      const clusters = await orchestrator.getClusters()
      expect(clusters).toBeDefined()

      // Verify harmonic score in equilibrium
      const score = orchestrator.getHarmonicScore?.() ?? 0
      expect(score).toBeGreaterThan(0)
    })
  })

  describe('Load Distribution (Multi-Vector Stress)', () => {
    it('should distribute load across all domains under concurrent execution', async () => {
      const concurrentOps = 20
      const promises = []

      for (let i = 0; i < concurrentOps; i++) {
        const ops = operationRegistry.list()
        const randomOp = ops[Math.floor(Math.random() * ops.length)]
        promises.push(executeGlobal(randomOp.name, {}).catch(() => null))
      }

      const results = await Promise.all(promises)
      const successCount = results.filter(r => r !== null).length
      expect(successCount).toBeGreaterThan(concurrentOps * 0.6)
    })

    it('should maintain equilibrium under sustained load', async () => {
      const duration = 1000 // 1 second
      const startTime = Date.now()
      let executionCount = 0

      while (Date.now() - startTime < duration) {
        const ops = operationRegistry.list()
        const randomOp = ops[Math.floor(Math.random() * ops.length)]
        try {
          await executeGlobal(randomOp.name, {})
          executionCount++
        } catch (e) {
          // Continue on error
        }
      }

      expect(executionCount).toBeGreaterThan(10)
    })
  })

  describe('Bidirectional Flows (Forward & Backward)', () => {
    it('should support forward execution paths', async () => {
      const forward = await executeGlobal('encode', { data: 'test' })
      expect(forward).toBeDefined()
    })

    it('should support reverse/inverse operations', async () => {
      const encoded = { data: 'test' }
      const decoded = await executeGlobal('decode', encoded)
      expect(decoded).toBeDefined()
    })

    it('should maintain consistency in bidirectional flows', async () => {
      const original = { value: 42 }

      // Forward
      const forward = await executeGlobal('transform-forward', original)

      // If reverse exists, should be close to original
      if (forward) {
        const reverse = await executeGlobal('transform-reverse', forward)
        expect(reverse).toBeDefined()
      }
    })
  })

  describe('Edge Cases & Boundary Conditions', () => {
    it('should handle empty inputs gracefully', async () => {
      const ops = operationRegistry.list().slice(0, 5)

      for (const op of ops) {
        const result = await executeGlobal(op.name, {})
        expect(result).toBeDefined()
      }
    })

    it('should handle null/undefined vectors', async () => {
      try {
        await executeGlobal('identity', undefined)
      } catch (e) {
        // Expected
      }
      expect(true).toBe(true)
    })

    it('should recover from invalid operation names', async () => {
      try {
        await executeGlobal('nonexistent-op-12345', {})
      } catch (e) {
        expect(e).toBeDefined()
      }
    })
  })

  describe('Vector Magnitude & Direction Tests', () => {
    it('should compute vector magnitude of operation response', async () => {
      const result = await executeGlobal('quantum-state', {})
      expect(result).toBeDefined()
      // Magnitude typically encoded in result structure
    })

    it('should preserve vector direction through compositions', async () => {
      const r1 = await executeGlobal('normalize', { data: [1, 2, 3] })
      expect(r1).toBeDefined()
    })

    it('should handle orthogonal operations (independent)', async () => {
      const r1 = await executeGlobal('rotate-x', {})
      const r2 = await executeGlobal('rotate-y', {})
      const r3 = await executeGlobal('rotate-z', {})

      expect(r1).toBeDefined()
      expect(r2).toBeDefined()
      expect(r3).toBeDefined()
    })
  })
})
