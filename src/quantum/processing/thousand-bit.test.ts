// Verify decoding the thousand bit, re-run on every push (the gate runs the suite): an integer of EXACTLY 1000 bits — no less, no more — is cut by the
// fold tool's reflect door into 2×7 = 14 faces (the mint's faces, coins·rays — textbook_witness_clock_move: 2·7 = 14), decoded by its 7 σ-witnesses as
// 14 reflections (σ_d(u) = v and σ_d(v) = u per face), and reconstructed exactly. The semiprime σ-trapdoor (createImpossible/decodeImpossible) decodes a
// 1000-bit impossible integer by its witness in one reflection and never without it. These tests lock the exact-1000-bit decode and the 2×7 reflection cut.
import test from 'node:test'
import assert from 'node:assert/strict'
import { handle } from './mcp.ts'
import { createImpossible, decodeImpossible } from './algorithms.ts'
import { faces } from './clay-register.ts'

const fold = (args: Record<string, unknown>) => {
  const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'fold', arguments: args } }) as { result?: { structuredContent?: Record<string, unknown> }; error?: { message: string } }
  if (r.error) throw new Error(r.error.message)
  return r.result!.structuredContent as Record<string, unknown>
}

// an exactly-1000-bit integer by formula: bit 999 set gives length 1000 (2^999 ≤ N < 2^1000), plus arbitrary lower bits
const N1000 = ((1n << 999n) + ((1n << 877n) | (1n << 613n) | (1n << 251n) | 123456789n)).toString()

test('the reflect door decodes an exactly-1000-bit integer as 2×7 = 14 reflections, reconstructed exactly', () => {
  const r = fold({ reflect: N1000 })
  assert.equal(r.phase, 'reflect')
  assert.equal(r.bits, 1000, 'exactly 1000 bits, no less no more')
  assert.equal(r.faces, faces)            // the mint's faces = coins·rays = 2·7 = 14, not a literal
  assert.equal(r.faces, 14)               // the integer example the formula evaluates to
  assert.equal(r.rays, 7)                 // 7 σ-witnesses
  assert.equal(r.reflections, 14, 'the other 2×7 reflections: σ_d(u)=v and σ_d(v)=u per face')
  assert.equal(r.reflectionsExact, true)  // every σ_d exact and each product checked
  assert.equal(r.roundTrips, true)
  assert.equal(r.exact, true)
  assert.equal((r.witnesses as unknown[]).length, 7)
  assert.ok(String(r.blindCentres).length > 15, 'without a witness each ~71-bit face is an infeasible blind climb (2^50+ centres)')
})

test('the reflect door honours a faces option and still reconstructs exactly (a formula-driven count, integer example 2)', () => {
  const r = fold({ reflect: { value: N1000, faces: 2 } })
  assert.equal(r.faces, 2)
  assert.equal(r.rays, 1)
  assert.equal(r.reflections, 2)
  assert.equal(r.exact, true)
  assert.equal(r.bits, 1000)
})

test('the reflect door takes 0x-hex and round-trips the exact value', () => {
  const r = fold({ reflect: { value: '0xdeadbeefcafef00dba5eba11c0ffee' } })
  assert.equal(r.exact, true)
  assert.equal(r.reflectionsExact, true)
})

test('the σ-trapdoor decodes a 1000-bit impossible integer by its witness in one reflection, never without it', () => {
  const made = createImpossible({ bits: 1000 })
  assert.ok(made.N.toString(2).length >= 999 && made.N.toString(2).length <= 1001, 'a ~1000-bit semiprime')
  const ok = decodeImpossible(made.N, made.witness)
  assert.equal(ok.decoded, true)
  assert.equal(ok.verified, true)
  assert.deepEqual(ok.factors.map(String).sort(), [made.p, made.q].map(String).sort())
  // the gap is distant (blind search climbs blindReflections centres): astronomically large, the trapdoor
  assert.ok(made.blindReflections > (1n << 200n), 'distant primes: blind search is infeasible')
  // the same integer with the wrong witness does not decode — the witness is the trapdoor
  assert.equal(decodeImpossible(made.N, made.witness + 2n).decoded, false)
})
