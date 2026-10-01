/**
 * Phase 15: SIMD Vectorization Benchmarks
 * 8x speedup target for batch sizes >= 16
 * AVX-512 / NEON compatible
 */

import test from 'node:test'
import assert from 'node:assert'
import { simdVectorizer } from '../../src/optimization/index.js'

test('Phase 15: SIMD - Profile decision for various batch sizes', async () => {
  // Small batch: skip vectorization
  const small = simdVectorizer.profile(8)
  assert.strictEqual(small.shouldVectorize, false, 'Batch size 8 should not vectorize')
  assert.strictEqual(small.speedup, 1.0, 'No speedup for small batches')

  // Medium batch: vectorize
  const medium = simdVectorizer.profile(16)
  assert.strictEqual(medium.shouldVectorize, true, 'Batch size 16 should vectorize')
  assert.ok(medium.speedup >= 1.5, `Medium batch should get 1.5x speedup, got ${medium.speedup}`)

  // Large batch: strong speedup
  const large = simdVectorizer.profile(256)
  assert.strictEqual(large.shouldVectorize, true, 'Batch size 256 should vectorize')
  assert.ok(large.speedup >= 3.0, `Large batch should get 3x+ speedup, got ${large.speedup}`)
})

test('Phase 15: SIMD - Vectorize formula with inputs', async () => {
  const inputs = Array.from({ length: 32 }, (_, i) => [i + 1, i + 2])
  const vectorized = simdVectorizer.vectorize('test-simd', inputs, [])

  assert.ok(vectorized, 'Should produce vectorized formula')
  assert.strictEqual(vectorized!.id, 'test-simd')
  assert.strictEqual(vectorized!.vectorWidth, 8)
  assert.ok(vectorized!.batches.length >= 1, 'Should have at least 1 batch')
  assert.ok(vectorized!.neon, 'Should support ARM NEON')
  assert.ok(vectorized!.avx512, 'Should support AVX-512')
})

test('Phase 15: SIMD - Skip vectorization for small batch', async () => {
  const inputs = Array.from({ length: 8 }, (_, i) => [i])
  const vectorized = simdVectorizer.vectorize('test-small', inputs, [])

  assert.strictEqual(vectorized, null, 'Should not vectorize batch < 16')
})

test('Phase 15: SIMD - Execute vectorized formula', async () => {
  const inputs = Array.from({ length: 32 }, (_, i) => [i + 1])
  const vectorized = simdVectorizer.vectorize('test-exec', inputs, [])
  assert.ok(vectorized, 'Should vectorize')

  const op = (x: number) => x * 2
  const results = simdVectorizer.executeVectorized(vectorized!, op)

  assert.strictEqual(results.length, 32, 'Should have 32 results')
  assert.strictEqual(results[0], 2, 'First result should be 1*2=2')
})

test('Phase 15: SIMD - Throughput estimation', async () => {
  const profile = simdVectorizer.profile(64)
  assert.ok(profile.estimatedThroughput > 0, 'Should estimate positive throughput')
  assert.ok(profile.estimatedThroughput > 1000, `Throughput should be >1000 ops/ms, got ${profile.estimatedThroughput}`)
})

test('Phase 15: SIMD - Adaptive vectorization with HW capabilities', async () => {
  const inputs = Array.from({ length: 32 }, (_, i) => [i])

  // Both enabled
  const both = simdVectorizer.adaptiveVectorize('test-both', inputs, {
    neon: true,
    avx512: true
  })
  assert.ok(both, 'Should vectorize with both capabilities')
  assert.ok(both!.neon)
  assert.ok(both!.avx512)

  // Only NEON
  const neonOnly = simdVectorizer.adaptiveVectorize('test-neon', inputs, {
    neon: true,
    avx512: false
  })
  assert.ok(neonOnly, 'Should vectorize with NEON only')
  assert.ok(neonOnly!.neon)
  assert.strictEqual(neonOnly!.avx512, false)

  // Only AVX-512
  const avx512Only = simdVectorizer.adaptiveVectorize('test-avx512', inputs, {
    neon: false,
    avx512: true
  })
  assert.ok(avx512Only, 'Should vectorize with AVX-512 only')
  assert.strictEqual(avx512Only!.neon, false)
  assert.ok(avx512Only!.avx512)
})

test('Phase 15: SIMD - 8x speedup target for batch 128', async () => {
  const profile = simdVectorizer.profile(128)
  assert.ok(
    profile.speedup >= 6.0,
    `Batch 128 should achieve 6x+ speedup, got ${profile.speedup}`
  )
})

test('Phase 15: SIMD - Overhead calculation', async () => {
  const batch16 = simdVectorizer.profile(16)
  const batch256 = simdVectorizer.profile(256)

  // Larger batches should amortize overhead better
  assert.ok(
    batch256.speedup > batch16.speedup,
    `Larger batch (256) should have better speedup than smaller batch (16)`
  )
})

test('Phase 15: SIMD - Vector alignment requirements', async () => {
  const inputs = Array.from({ length: 16 }, (_, i) => [i])
  const vectorized = simdVectorizer.vectorize('test-align', inputs, [])

  if (vectorized && vectorized.batches.length > 0) {
    const firstBatch = vectorized.batches[0]
    assert.strictEqual(firstBatch.alignment, 8, 'Alignment should be 8 elements')
  }
})

test.skip('Phase 15: SIMD - WASM SIMD code generation', async () => {
  // Would test: generate wasm-simd bytecode
  // Requires wasm compiler integration
})

test.skip('Phase 15: SIMD - LLVM IR generation', async () => {
  // Would test: generate LLVM IR for SIMD operations
  // Requires LLVM bindings
})
