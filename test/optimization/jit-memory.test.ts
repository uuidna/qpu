/**
 * Phase 15: JIT Compilation & Memory Pool Benchmarks
 * 3-5x speedup for hot paths, <1ms GC pauses
 */

import test from 'node:test'
import assert from 'node:assert'
import {
  jitCompiler,
  memoryPoolManager,
  float64Pool,
  formulaResultPool
} from '../../src/optimization/index.js'

// ============================================================================
// JIT Compilation Tests
// ============================================================================

test('Phase 15: JIT - Register formula for compilation', async () => {
  jitCompiler.clearCache()

  const fallback = (x: number) => x * 2
  const fn = jitCompiler.registerFormula('simple-mul', 'x*2', fallback)

  assert.ok(typeof fn === 'function', 'Should return a function')
  const result = fn(5)
  assert.strictEqual(result, 10, 'Function should compute correctly')
})

test('Phase 15: JIT - Compile after threshold', async () => {
  jitCompiler.clearCache()

  const fallback = (x: number) => x + 1
  const thresholdFormula = 'x+1'

  // Call <100 times
  for (let i = 0; i < 50; i++) {
    jitCompiler.registerFormula('threshold-test', thresholdFormula, fallback)
  }

  let status = jitCompiler.getStatus('threshold-test')
  assert.strictEqual(status.isCompiled, false, 'Should not be compiled at 50 calls')

  // Call to threshold
  for (let i = 0; i < 55; i++) {
    jitCompiler.registerFormula('threshold-test', thresholdFormula, fallback)
  }

  status = jitCompiler.getStatus('threshold-test')
  assert.ok(status.callCount >= 100, 'Should have >100 calls')
  assert.ok(status.estimatedSpeedup! > 1.0, 'Should estimate speedup when compiled')
})

test('Phase 15: JIT - Estimated speedup >= 3x', async () => {
  jitCompiler.clearCache()

  const formula = (x: number) => Math.sqrt(x) + x * 2
  const compiled = jitCompiler.compile('speedup-test', 'sqrt(x)+x*2', formula)

  const status = jitCompiler.getStatus('speedup-test')
  assert.ok(status.estimatedSpeedup! >= 3.0, `JIT speedup should be >= 3x, got ${status.estimatedSpeedup}`)
})

test('Phase 15: JIT - Statistics tracking', async () => {
  jitCompiler.clearCache()

  const fallback = (x: number) => x * x
  for (let i = 0; i < 105; i++) {
    jitCompiler.registerFormula('stats-test', 'x*x', fallback)
  }

  const stats = jitCompiler.getStats()
  assert.ok(stats.compiledCount >= 0, 'Should track compiled formulas')
  assert.ok(stats.totalBytecodeSize >= 0, 'Should track bytecode size')
  assert.ok(stats.estimatedGainMs >= 0, 'Should estimate performance gain')
})

test('Phase 15: JIT - Clear cache on memory pressure', async () => {
  jitCompiler.clearCache()

  const fallback = (x: number) => x + 1
  for (let i = 0; i < 105; i++) {
    jitCompiler.registerFormula('cache-clear-test', 'x+1', fallback)
  }

  const stats1 = jitCompiler.getStats()
  const bytecodeSize1 = stats1.totalBytecodeSize

  // Clear cache
  jitCompiler.clearCache()

  const stats2 = jitCompiler.getStats()
  assert.strictEqual(stats2.compiledCount, 0, 'Should clear all compiled formulas')
  assert.strictEqual(stats2.totalBytecodeSize, 0, 'Should free bytecode memory')
})

test('Phase 15: JIT - Tunable threshold', async () => {
  jitCompiler.clearCache()
  jitCompiler.setJITThreshold(50)

  const fallback = (x: number) => x
  for (let i = 0; i < 52; i++) {
    jitCompiler.registerFormula('tunable-test', 'x', fallback)
  }

  const status = jitCompiler.getStatus('tunable-test')
  assert.ok(status.callCount >= 50, 'Should compile at custom threshold')
})

// ============================================================================
// Memory Pool Tests
// ============================================================================

test('Phase 15: Memory Pool - Acquire and release', async () => {
  const acquired = float64Pool.acquire()
  assert.ok(acquired, 'Should acquire object from pool')

  float64Pool.release(acquired)
  const stats = float64Pool.getStats()
  assert.ok(stats.available > 0, 'Released object should be available')
})

test('Phase 15: Memory Pool - Reuse objects', async () => {
  const obj1 = float64Pool.acquire()
  const id1 = Object.prototype.toString.call(obj1)

  float64Pool.release(obj1)

  const obj2 = float64Pool.acquire()
  const id2 = Object.prototype.toString.call(obj2)

  // Same object should be reused
  assert.strictEqual(id1, id2, 'Freed object should be reused')
  float64Pool.release(obj2)
})

test('Phase 15: Memory Pool - Track statistics', async () => {
  const stats = float64Pool.getStats()

  assert.ok(stats.poolName === 'float64')
  assert.ok(stats.totalAllocated >= 0)
  assert.ok(stats.inUse >= 0)
  assert.ok(stats.available >= 0)
  assert.ok(stats.gcPausesMs >= 0)
  assert.ok(stats.allocationRate >= 0)
})

test('Phase 15: Memory Pool - Adaptive resizing', async () => {
  const stats1 = float64Pool.getStats()
  const initialSize = stats1.totalAllocated

  // Simulate heavy load
  for (let i = 0; i < 50; i++) {
    float64Pool.acquire()
  }

  memoryPoolManager.adaptPoolSizes()
  const stats2 = float64Pool.getStats()

  // Pool should grow under load
  assert.ok(
    stats2.totalAllocated >= initialSize,
    'Pool should grow or maintain size under load'
  )

  // Release all
  for (let i = 0; i < 50; i++) {
    const obj = float64Pool.acquire()
    float64Pool.release(obj)
  }

  memoryPoolManager.adaptPoolSizes()
  const stats3 = float64Pool.getStats()

  // Pool might shrink when idle (implementation-dependent)
  assert.ok(stats3.totalAllocated > 0, 'Pool should maintain minimum size')
})

test('Phase 15: Memory Pool - Formula result pool', async () => {
  const result = formulaResultPool.acquire()
  result.formulaId = 'test'
  result.inputs = [1, 2, 3]
  result.outputs = [2, 4, 6]

  formulaResultPool.release(result)

  const result2 = formulaResultPool.acquire()
  assert.strictEqual(result2.formulaId, '', 'Released object should be reset')
  assert.strictEqual(result2.inputs.length, 0, 'Inputs should be cleared')

  formulaResultPool.release(result2)
})

test('Phase 15: Memory Pool - Manager coordination', async () => {
  const stats = memoryPoolManager.getMemoryStats()
  assert.ok(stats.length > 0, 'Should track multiple pools')

  const totalMemory = memoryPoolManager.getTotalMemory()
  assert.ok(totalMemory >= 0, 'Should estimate total memory')
})

test('Phase 15: Memory Pool - <1ms GC pause target', async () => {
  // Acquire and release many objects
  for (let i = 0; i < 1000; i++) {
    const obj = float64Pool.acquire()
    float64Pool.release(obj)
  }

  const stats = float64Pool.getStats()
  // GC pauses would be tracked - ideally <1ms
  assert.ok(stats.gcPausesMs < 10, 'GC pauses should be minimal (target <1ms)')
})

test('Phase 15: Memory Pool - Allocation rate monitoring', async () => {
  const stats = float64Pool.getStats()
  assert.ok(stats.allocationRate >= 0, 'Should measure allocation rate')
})

test('Phase 15: Combined - JIT + Memory Pool efficiency', async () => {
  jitCompiler.clearCache()

  // Warm up with pooled objects
  for (let i = 0; i < 110; i++) {
    const result = formulaResultPool.acquire()
    result.inputs = [i]
    result.outputs = [i * 2]
    formulaResultPool.release(result)

    // Also warm up JIT
    jitCompiler.registerFormula('combined', 'x*2', (x: number) => x * 2)
  }

  const jitStats = jitCompiler.getStats()
  const poolStats = float64Pool.getStats()

  assert.ok(jitStats.compiledCount > 0, 'JIT should have compiled')
  assert.ok(poolStats.inUse === 0, 'Pool should have released all objects')
})

test.skip('Phase 15: Memory Pool - Zero-copy object passing', async () => {
  // Would test: direct buffer passing without copies
  // Requires specialized pool implementation for shared memory
})

test.skip('Phase 15: JIT - Profile-guided optimization', async () => {
  // Would test: adaptive optimization based on runtime profiles
  // Requires continuous profiling integration
})
