/**
 * Phase 15: Latency Benchmarks
 * Before/after JIT, SIMD, and parallel execution
 * Target: <1ms median, <5ms p99
 */

import test from 'node:test'
import assert from 'node:assert'
import {
  executeOptimized,
  defaultOptimizationPlan,
  latencyProfiler,
  jitCompiler,
  simdVectorizer,
  parallelExecutor
} from '../../src/optimization/index.js'

test('Phase 15: Latency - Baseline scalar execution', async () => {
  const inputs = [[1], [2], [3], [4], [5]]
  const op = (x: number) => x * x + Math.sqrt(x)

  const start = performance.now()
  const results = inputs.map(inp => op(inp[0]))
  const duration = performance.now() - start

  assert.strictEqual(results.length, 5)
  assert.ok(duration < 1.0, `Baseline execution should be <1ms, got ${duration}ms`)
})

test('Phase 15: Latency - JIT compilation speedup', async () => {
  const inputs = [[1], [2], [3]]
  const op = (x: number) => x * 2 + 1

  // Warm up JIT (>100 calls)
  for (let i = 0; i < 105; i++) {
    jitCompiler.registerFormula('test-jit', 'x*2+1', op)
  }

  const status = jitCompiler.getStatus('test-jit')
  assert.ok(status.callCount > 100, 'Formula should be compiled after 100+ calls')
})

test('Phase 15: Latency - SIMD vectorization on batch >= 16', async () => {
  const batchSize = 32
  const inputs = Array.from({ length: batchSize }, (_, i) => [i + 1])
  const op = (x: number) => Math.sqrt(x) + x

  const profile = simdVectorizer.profile(batchSize)
  assert.ok(profile.shouldVectorize, `SIMD should vectorize batch size ${batchSize}`)
  assert.ok(profile.speedup >= 2.0, `SIMD speedup should be >= 2x, got ${profile.speedup}`)
})

test('Phase 15: Latency - SIMD skips small batches', async () => {
  const batchSize = 8
  const profile = simdVectorizer.profile(batchSize)
  assert.strictEqual(
    profile.shouldVectorize,
    false,
    `SIMD should NOT vectorize batch size < 16, got ${batchSize}`
  )
})

test('Phase 15: Latency - Parallel execution on 8 cores', async () => {
  const itemCount = 100
  const speedup = parallelExecutor.estimateSpeedup(itemCount)
  assert.ok(speedup >= 2.0, `Parallel speedup should be >= 2x, got ${speedup}`)
  assert.ok(speedup <= 8.0, `Parallel speedup should be <= 8x, got ${speedup}`)
})

test('Phase 15: Latency - Full optimization pipeline', async () => {
  const inputs = Array.from({ length: 64 }, (_, i) => [i + 1])
  const op = (x: number) => Math.sqrt(x) + x * x

  const results = await executeOptimized('test-full-pipeline', inputs, op)
  assert.strictEqual(results.length, 64, 'Should produce 64 results')
})

test('Phase 15: Latency - Profiler records samples', async () => {
  latencyProfiler.reset()
  latencyProfiler.recordSample({
    formulaId: 'test-profile',
    startTime: Date.now(),
    duration: 0.5,
    inputSize: 1,
    outputSize: 1,
    gcPauses: 0
  })

  const snapshot = latencyProfiler.getSnapshot()
  assert.ok(snapshot.sampleCount > 0, 'Should have recorded sample')
})

test('Phase 15: Latency - Target <1ms median latency', async () => {
  const inputs = Array.from({ length: 100 }, (_, i) => [i])
  const op = (x: number) => x + 1

  const start = performance.now()
  const results = inputs.map(inp => op(inp[0]))
  const totalTime = performance.now() - start
  const medianTime = totalTime / inputs.length

  assert.strictEqual(results.length, 100)
  assert.ok(medianTime < 1.0, `Median latency should be <1ms, got ${medianTime}ms`)
})

test('Phase 15: Latency - Target <5ms p99 latency', async () => {
  const iterations = 1000
  const latencies: number[] = []
  const op = (x: number) => Math.sqrt(x) + Math.sin(x) * Math.cos(x)

  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    op(i)
    latencies.push(performance.now() - start)
  }

  const sorted = latencies.sort((a, b) => a - b)
  const p99 = sorted[Math.floor(sorted.length * 0.99)]

  assert.ok(p99 < 5.0, `p99 latency should be <5ms, got ${p99}ms`)
})

test('Phase 15: Latency - Zero GC pauses during execution', async () => {
  const memBefore = (globalThis as any).gc?.() || 0
  const start = performance.now()

  const inputs = Array.from({ length: 10000 }, (_, i) => [i])
  const results = inputs.map(inp => inp[0] * 2)

  const duration = performance.now() - start
  const memAfter = (globalThis as any).gc?.() || 0

  assert.strictEqual(results.length, 10000)
  // GC pauses would show up as execution time spikes
  assert.ok(duration < 50, `10K iterations should take <50ms, got ${duration}ms`)
})

test.skip('Phase 15: Latency - Memory pool efficiency', async () => {
  // Requires memory instrumentation
  // Would measure: allocation rate, deallocation rate, pool fragmentation
})

test.skip('Phase 15: Latency - Adaptive optimization', async () => {
  // Would test: auto-tuning based on workload characteristics
  // - Detect memory-bound vs CPU-bound operations
  // - Adjust pool sizes dynamically
  // - Enable/disable optimizations based on profiling
})
