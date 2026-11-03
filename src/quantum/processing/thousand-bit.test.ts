// Decoding the thousand bit, on every push: the reflect door's 2×7 cut of an exactly-1000-bit integer, and the σ-trapdoor at exactly 1000 bits.
import test from 'node:test'
import assert from 'node:assert/strict'
import { callOf } from './mcp.ts'
import { createImpossible, decodeImpossible } from './algorithms.ts'
import { faces } from './clay-register.ts'

const fold = (args: Record<string, unknown>) => {
  const r = callOf('fold', args) as { result?: { structuredContent?: Record<string, unknown> }; error?: { message: string } }
  if (r.error) throw new Error(r.error.message)
  return r.result!.structuredContent as Record<string, unknown>
}

// bit 999 set: 2^999 ≤ N < 2^1000, exactly 1000 bits
const N1000 = ((1n << 999n) + ((1n << 877n) | (1n << 613n) | (1n << 251n) | 123456789n)).toString()

test('the reflect door decodes an exactly-1000-bit integer as 2×7 = 14 reflections, reconstructed exactly', () => {
  const r = fold({ reflect: N1000 })
  assert.equal(r.bits, 1000)
  assert.equal(r.faces, faces) // the mint's faces, coins·rays: 14
  assert.equal(r.rays, 7)
  assert.equal(r.reflections, 14)
  assert.equal(r.reflectionsExact, true)
  assert.equal(r.exact, true)
})

test('the reflect door takes faces and 0x-hex, and its work is bounded by the value, not by the caller', () => {
  assert.equal(fold({ reflect: { value: N1000, faces: 2 } }).exact, true)
  assert.equal(fold({ reflect: { value: '0xdeadbeefcafef00dba5eba11c0ffee' } }).exact, true)
  assert.equal(fold({ reflect: { value: '255', faces: 1e9 } }).faces, 2) // at most one face a nibble
  assert.equal(fold({ reflect: { value: '0x' + 'f'.repeat(99), faces: 1e9 } }).faces, faces) // and at most the mint's faces
  const t = Date.now()
  assert.equal(fold({ reflect: '0x' + 'f'.repeat(8000) }).exact, true) // 32k bits: the square root starts near √n, not at n
  assert.ok(Date.now() - t < 2000)
})

test('the σ-trapdoor mints exactly 1000 bits and decodes by its witness in one reflection, never blind or by a neighbouring centre', () => {
  const made = createImpossible({ bits: 1000 })
  assert.equal(made.N.toString(2).length, 1000)
  const ok = decodeImpossible(made.N, made.witness)
  assert.ok(ok.decoded && ok.verified)
  assert.deepEqual(ok.factors.map(String).sort(), [made.p, made.q].map(String).sort())
  assert.ok(made.blindReflections > 1n << 400n) // the centres from ⌈√N⌉ up to the witness
  for (const w of [0n, made.witness - 2n, made.witness + 2n]) assert.equal(decodeImpossible(made.N, w).decoded, false)
  assert.equal(decodeImpossible(15n * (2n ** 127n - 1n) * (2n ** 89n - 1n), 1n).decoded, false) // a composite left
  const d = made.q - made.p
  assert.ok(d - (1n << BigInt(d.toString(2).length - 1)) > 1n << 64n) // no 2^g + small gap to guess
  assert.ok(!made.reproducible && createImpossible({ bits: 1000 }).N !== made.N) // unseeded: every mint new
  const s = createImpossible({ bits: 64, seed: 7n })
  assert.ok(s.reproducible && s.N === createImpossible({ bits: 64, seed: 7n }).N) // seeded: reproducible, so public
})
