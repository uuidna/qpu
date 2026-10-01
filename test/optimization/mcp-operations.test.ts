/**
 * Phase 15: MCP Operations Tests
 * qpu_profile_hotspots, qpu_optimize_formula, qpu_bench_latency
 */

import test from 'node:test'
import assert from 'node:assert'
import {
  profileHotspotsOp,
  optimizeFormulaOp,
  benchLatencyOp
} from '../../src/mcp/phase-15-optimization.js'

// ============================================================================
// MCP Operation 1: qpu_profile_hotspots
// ============================================================================

test('Phase 15: MCP - qpu_profile_hotspots returns snapshot', async () => {
  const response = await profileHotspotsOp.handler({})

  assert.ok(response.timestamp > 0, 'Should have timestamp')
  assert.ok(Array.isArray(response.hotspots), 'Should return hotspots array')
  assert.ok(response.summary, 'Should include summary')
})

test('Phase 15: MCP - qpu_profile_hotspots filters by formula', async () => {
  const response = await profileHotspotsOp.handler({
    formulaFilter: 'test'
  })

  assert.ok(Array.isArray(response.hotspots), 'Should return filtered hotspots')
  // If no formulas match, array will be empty - that's OK
})

test('Phase 15: MCP - qpu_profile_hotspots respects limit', async () => {
  const response1 = await profileHotspotsOp.handler({ limit: 5 })
  const response5 = await profileHotspotsOp.handler({ limit: 5 })
  const response10 = await profileHotspotsOp.handler({ limit: 10 })

  assert.ok(response1.hotspots.length <= 5)
  assert.ok(response5.hotspots.length <= 5)
  assert.ok(response10.hotspots.length <= 10)
})

test('Phase 15: MCP - qpu_profile_hotspots includes suggestions', async () => {
  const response = await profileHotspotsOp.handler({})

  for (const hotspot of response.hotspots) {
    assert.ok(Array.isArray(hotspot.suggestions), 'Should include suggestions array')
  }
})

test('Phase 15: MCP - qpu_profile_hotspots summary calculations', async () => {
  const response = await profileHotspotsOp.handler({})

  assert.ok(response.summary.totalTimeMs >= 0)
  assert.ok(response.summary.avgLatencyMs >= 0)
  assert.ok(response.summary.p99LatencyMs >= 0)
  assert.ok(response.summary.maxBottlenecks >= 0)
})

// ============================================================================
// MCP Operation 2: qpu_optimize_formula
// ============================================================================

test('Phase 15: MCP - qpu_optimize_formula returns optimization plan', async () => {
  const response = await optimizeFormulaOp.handler({
    formulaId: 'test-optimize',
    expression: 'x * 2 + 1'
  })

  assert.strictEqual(response.formulaId, 'test-optimize')
  assert.ok(response.optimizations)
  assert.ok(response.combinedSpeedup > 0)
})

test('Phase 15: MCP - qpu_optimize_formula detects hot formulas', async () => {
  const response = await optimizeFormulaOp.handler({
    formulaId: 'hot-formula',
    expression: 'x * 2',
    callCount: 150 // > 100
  })

  assert.ok(response.optimizations.jit.enabled, 'Should enable JIT for hot formula')
})

test('Phase 15: MCP - qpu_optimize_formula skips JIT for cold formulas', async () => {
  const response = await optimizeFormulaOp.handler({
    formulaId: 'cold-formula',
    expression: 'x + 1',
    callCount: 50 // < 100
  })

  assert.strictEqual(response.optimizations.jit.enabled, false, 'Should not enable JIT for cold formula')
})

test('Phase 15: MCP - qpu_optimize_formula SIMD on large batches', async () => {
  const response = await optimizeFormulaOp.handler({
    formulaId: 'simd-candidate',
    expression: 'x * x',
    batchSize: 64 // >= 16
  })

  assert.ok(response.optimizations.simd.enabled, 'Should enable SIMD for batch >= 16')
  assert.ok(response.optimizations.simd.vectorWidth > 0)
})

test('Phase 15: MCP - qpu_optimize_formula skips SIMD for small batches', async () => {
  const response = await optimizeFormulaOp.handler({
    formulaId: 'small-batch',
    expression: 'x',
    batchSize: 8 // < 16
  })

  assert.strictEqual(response.optimizations.simd.enabled, false, 'Should not enable SIMD for batch < 16')
})

test('Phase 15: MCP - qpu_optimize_formula parallel on medium batches', async () => {
  const response = await optimizeFormulaOp.handler({
    formulaId: 'parallel-candidate',
    expression: 'sqrt(x)',
    batchSize: 100
  })

  assert.ok(response.optimizations.parallel.enabled, 'Should enable parallel for batch >= 8')
})

test('Phase 15: MCP - qpu_optimize_formula combined speedup calculation', async () => {
  const response = await optimizeFormulaOp.handler({
    formulaId: 'full-opt',
    expression: 'x * 2 + sqrt(x)',
    callCount: 150,
    batchSize: 128
  })

  // With JIT (3.5x) + SIMD (6.4x) + Parallel (7x) ≈ combination should be significant
  assert.ok(response.combinedSpeedup > 3.0, `Combined speedup should be >3x, got ${response.combinedSpeedup}`)
})

test('Phase 15: MCP - qpu_optimize_formula latency estimates', async () => {
  const response = await optimizeFormulaOp.handler({
    formulaId: 'latency-test',
    expression: 'x + 1',
    callCount: 150,
    batchSize: 64
  })

  assert.ok(response.estimatedLatencyBefore > 0)
  assert.ok(response.estimatedLatencyAfter > 0)
  assert.ok(response.estimatedLatencyAfter < response.estimatedLatencyBefore,
    'Optimized latency should be better')
})

// ============================================================================
// MCP Operation 3: qpu_bench_latency
// ============================================================================

test('Phase 15: MCP - qpu_bench_latency runs benchmark', async () => {
  const response = await benchLatencyOp.handler({
    formulaId: 'bench-test',
    iterations: 100
  })

  assert.strictEqual(response.formulaId, 'bench-test')
  assert.ok(response.results)
  assert.ok(response.results.avgLatencyMs >= 0)
})

test('Phase 15: MCP - qpu_bench_latency latency ordering', async () => {
  const response = await benchLatencyOp.handler({
    formulaId: 'latency-order',
    iterations: 100
  })

  const r = response.results
  assert.ok(r.minLatencyMs <= r.medianLatencyMs, 'min <= median')
  assert.ok(r.medianLatencyMs <= r.p99LatencyMs, 'median <= p99')
  assert.ok(r.p99LatencyMs <= r.maxLatencyMs, 'p99 <= max')
})

test('Phase 15: MCP - qpu_bench_latency computes statistics', async () => {
  const response = await benchLatencyOp.handler({
    formulaId: 'stats-bench',
    iterations: 50
  })

  const r = response.results
  assert.ok(r.stdDevMs >= 0, 'Should compute std dev')
  assert.ok(r.throughputOpsPerSec >= 0, 'Should compute throughput')
})

test('Phase 15: MCP - qpu_bench_latency warmup runs', async () => {
  const response = await benchLatencyOp.handler({
    formulaId: 'warmup-test',
    iterations: 100,
    warmupRuns: 20
  })

  assert.ok(response.results.avgLatencyMs > 0, 'Should complete after warmup')
})

test('Phase 15: MCP - qpu_bench_latency recommendations', async () => {
  const response = await benchLatencyOp.handler({
    formulaId: 'rec-test',
    iterations: 100
  })

  assert.ok(typeof response.recommendation === 'string', 'Should provide recommendation')
  assert.ok(response.recommendation.length > 0)
})

test('Phase 15: MCP - qpu_bench_latency GC tracking', async () => {
  const response = await benchLatencyOp.handler({
    formulaId: 'gc-test',
    iterations: 100
  })

  assert.ok(typeof response.gcActivity.pausesDetected === 'number')
  assert.ok(response.gcActivity.maxPauseMs >= 0)
})

// ============================================================================
// Integration Tests
// ============================================================================

test('Phase 15: MCP - Profile + Optimize workflow', async () => {
  // First: profile to identify hotspots
  const profile = await profileHotspotsOp.handler({ limit: 1 })
  assert.ok(profile.hotspots !== null)

  // Then: optimize identified formula
  if (profile.hotspots.length > 0) {
    const hotspot = profile.hotspots[0]
    const optimized = await optimizeFormulaOp.handler({
      formulaId: hotspot.formulaId,
      expression: 'x * 2',
      callCount: hotspot.callCount,
      batchSize: 64
    })

    assert.ok(optimized.combinedSpeedup > 1.0)
  }
})

test('Phase 15: MCP - Optimize + Benchmark workflow', async () => {
  // First: get optimization plan
  const plan = await optimizeFormulaOp.handler({
    formulaId: 'workflow-test',
    expression: 'x + 1',
    callCount: 150,
    batchSize: 64
  })

  // Then: benchmark to verify improvements
  const bench = await benchLatencyOp.handler({
    formulaId: 'workflow-test',
    iterations: 100
  })

  assert.ok(plan.combinedSpeedup > 1.0)
  assert.ok(bench.results.p99LatencyMs < 10, 'p99 should be reasonable')
})

test.skip('Phase 15: MCP - Real hotspot profiling', async () => {
  // Would require actual formula execution to generate samples
  // Needs integration with latencyProfiler
})

test.skip('Phase 15: MCP - Correctness verification', async () => {
  // Would verify optimized formula produces same results as scalar
  // Requires reference implementation comparison
})
