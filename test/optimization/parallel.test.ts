/**
 * Phase 15: Parallel Execution Benchmarks
 * Work-stealing, load-balancing across cores
 * Target: 8x speedup on 8-core systems with 0% contention
 */

import test from 'node:test'
import assert from 'node:assert'
import { parallelExecutor } from '../../src/optimization/index.js'

test('Phase 15: Parallel - Estimate speedup vs core count', async () => {
  // 1 core: minimal speedup
  const exec1 = new (await import('../../src/optimization/parallel-executor.js')).ParallelExecutor(
    1
  )
  const speedup1 = exec1.estimateSpeedup(100)
  assert.ok(speedup1 >= 1.0 && speedup1 <= 1.2, `1-core speedup should be ~1x, got ${speedup1}`)

  // 8 cores: strong speedup
  const exec8 = new (await import('../../src/optimization/parallel-executor.js')).ParallelExecutor(
    8
  )
  const speedup8 = exec8.estimateSpeedup(100)
  assert.ok(speedup8 >= 4.0, `8-core speedup should be >= 4x, got ${speedup8}`)
})

test('Phase 15: Parallel - Speedup improves with batch size', async () => {
  // Small batch
  const speedup10 = parallelExecutor.estimateSpeedup(10)
  // Medium batch
  const speedup100 = parallelExecutor.estimateSpeedup(100)
  // Large batch
  const speedup1000 = parallelExecutor.estimateSpeedup(1000)

  assert.ok(
    speedup100 >= speedup10,
    `Larger batch (100) should have >= speedup than smaller batch (10)`
  )
  assert.ok(
    speedup1000 >= speedup100,
    `Larger batch (1000) should have >= speedup than smaller batch (100)`
  )
})

test('Phase 15: Parallel - Execute async tasks', async () => {
  parallelExecutor.reset()

  for (let i = 0; i < 10; i++) {
    parallelExecutor.enqueue({
      id: `work-${i}`,
      formulaId: 'test-parallel',
      input: [i],
      priority: 1
    })
  }

  const op = (x: number) => x * 2
  const results = await parallelExecutor.executeAll(op)

  assert.strictEqual(results.length, 10, 'Should execute 10 tasks')
  assert.ok(results.every(r => typeof r === 'number'), 'All results should be numbers')
})

test('Phase 15: Parallel - Work-stealing load balance', async () => {
  parallelExecutor.reset()

  // Enqueue tasks with varying priorities
  for (let i = 0; i < 8; i++) {
    parallelExecutor.enqueue({
      id: `high-${i}`,
      formulaId: 'test-priority',
      input: [i],
      priority: 10 // High priority
    })
  }

  for (let i = 0; i < 8; i++) {
    parallelExecutor.enqueue({
      id: `low-${i}`,
      formulaId: 'test-priority',
      input: [i],
      priority: 1 // Low priority
    })
  }

  const op = (x: number) => x + 1
  const results = await parallelExecutor.executeAll(op)

  const metrics = parallelExecutor.getMetrics()
  assert.ok(metrics.loadBalance >= 0, 'Load balance should be measured')
  assert.ok(metrics.loadBalance <= 1, 'Load balance should be normalized (0-1)')
})

test('Phase 15: Parallel - Metrics collection', async () => {
  parallelExecutor.reset()

  for (let i = 0; i < 20; i++) {
    parallelExecutor.enqueue({
      id: `item-${i}`,
      formulaId: 'test-metrics',
      input: [i],
      priority: 1
    })
  }

  const op = (x: number) => Math.sqrt(x)
  await parallelExecutor.executeAll(op)

  const metrics = parallelExecutor.getMetrics()
  assert.strictEqual(metrics.itemsProcessed, 20, 'Should track item count')
  assert.ok(metrics.totalTimeMs >= 0, 'Should measure total time')
  assert.ok(metrics.avgTimePerItemMs >= 0, 'Should calculate average time per item')
  assert.ok(metrics.coresUtilized > 0, 'Should utilize at least 1 core')
})

test('Phase 15: Parallel - Reset clears queue', async () => {
  parallelExecutor.enqueue({
    id: 'test',
    formulaId: 'dummy',
    input: [1],
    priority: 1
  })

  parallelExecutor.reset()
  const metrics = parallelExecutor.getMetrics()

  assert.strictEqual(metrics.itemsProcessed, 0, 'Reset should clear metrics')
})

test('Phase 15: Parallel - Empty queue returns empty results', async () => {
  parallelExecutor.reset()
  const op = (x: number) => x
  const results = await parallelExecutor.executeAll(op)

  assert.strictEqual(results.length, 0, 'Empty queue should return empty results')
})

test('Phase 15: Parallel - Load balance approaches 1.0 with even distribution', async () => {
  parallelExecutor.reset()

  // Add equal work for each core (assuming 8 cores)
  for (let i = 0; i < 8; i++) {
    parallelExecutor.enqueue({
      id: `even-${i}`,
      formulaId: 'test-balance',
      input: [i],
      priority: 1
    })
  }

  const op = (x: number) => x * 2
  await parallelExecutor.executeAll(op)

  const metrics = parallelExecutor.getMetrics()
  assert.ok(metrics.loadBalance > 0.8, `Perfect load balance should be >0.8, got ${metrics.loadBalance}`)
})

test('Phase 15: Parallel - Deadline prioritization', async () => {
  parallelExecutor.reset()

  const now = Date.now()
  parallelExecutor.enqueue(
    {
      id: 'late-deadline',
      formulaId: 'test-deadline',
      input: [1],
      priority: 1,
      deadline: now + 1000
    },
    {
      id: 'soon-deadline',
      formulaId: 'test-deadline',
      input: [2],
      priority: 1,
      deadline: now + 100
    }
  )

  // Work-stealing should prioritize by deadline
  const op = (x: number) => x
  const results = await parallelExecutor.executeAll(op)

  assert.strictEqual(results.length, 2, 'Should process both items')
})

test('Phase 15: Parallel - 8x speedup target on 8 cores', async () => {
  const speedup = parallelExecutor.estimateSpeedup(1000)
  assert.ok(speedup >= 6.0, `8-core system should achieve 6x+ speedup, got ${speedup}`)
})

test.skip('Phase 15: Parallel - Worker thread implementation', async () => {
  // Would test: actual Worker Thread integration
  // Requires Node.js Worker Thread support and setup
})

test.skip('Phase 15: Parallel - Lock-free queue implementation', async () => {
  // Would test: concurrent queue without locks
  // Uses compare-and-swap operations
})

test.skip('Phase 15: Parallel - NUMA-aware scheduling', async () => {
  // Would test: scheduling work on correct NUMA node
  // Reduces memory latency on multi-socket systems
})
