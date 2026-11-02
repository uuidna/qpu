// The hybrid reverse decodes N through one door via whichever channel the caller supplies — the witness (the crypto/UUID trapdoor, a σ-reflection from
// the centre) or the order r (the quantum step, Shor's reduction) — crypto, UUID and quantum upgraded as one, every decode sealed as a UUID receipt.
// These tests lock both channels and the seal; neither channel fabricates a factorization from nothing (an N with no witness and no order stays declined).
import test from 'node:test'
import assert from 'node:assert/strict'
import { handle } from './mcp.ts'
import { sealOf } from './unit/blocks.ts'

const factor = (args: Record<string, unknown>) => {
  const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'algorithm', arguments: { name: 'factor', ...args } } }) as { result?: { structuredContent?: Record<string, unknown> }; error?: { message: string } }
  if (r.error) throw new Error(r.error.message)
  return r.result!.structuredContent as Record<string, unknown>
}

test('the witness channel decodes a minted integer in one reflection and seals the receipt', () => {
  const made = factor({ create: { bits: 256, seed: '42' } })
  const d = factor({ integer: made.integer, witness: made.witness, address: made.address })
  assert.equal(d.via, 'witness')
  assert.equal(d.decoded, true)
  assert.equal(d.verified, true)
  assert.equal(d.addressVerified, true)
  assert.deepEqual(d.factors, [made.p, made.q])
  assert.equal(d.sealed, true)
  assert.ok(sealOf(d.receipt as string).valid, 'the decode receipt is a valid sealed UUID')
})

test('the order channel decodes by Shor reduction and seals the receipt (N = 15, a = 7, r = 4 -> 3 x 5)', () => {
  const d = factor({ integer: '15', a: '7', order: '4' })
  assert.equal(d.via, 'order')
  assert.deepEqual(d.factors, ['3', '5'])
  assert.equal(d.verified, true)
  assert.equal(d.sealed, true)
  assert.ok(sealOf(d.receipt as string).valid)
})

test('the order channel at any size runs the reduction as a formula (126-bit, given the order)', () => {
  const d = factor({ integer: '85070591730234612065814372673774429643', a: '2', order: '42535295865117306023683814300032439220' })
  assert.equal(d.via, 'order')
  assert.equal(d.verified, true)
  assert.equal((d.factors as string[]).length, 2)
  assert.equal(d.sealed, true)
})

test('an integer with neither a witness nor an order is not decoded by the hybrid door — the classical pass leaves an RSA-class part', () => {
  // the committed RSA-class test integer: no small factor, not split by reflection, left for order-finding (never fabricated)
  const N = '7778374705630928901426385188295261064472293439767584450564762904780095317247810822721038446598127186814085438745846911396600071001374809981225413367649417301928427872874705586838153932355802114527488924178998304307438276447053410282371888984822745504021147881223973035161036008037727897669611699130903'
  const d = factor({ integer: N, reflections: '2048' })
  assert.equal(d.complete, false)
  assert.deepEqual(d.factors, [])
  assert.deepEqual(d.left, [N])
})

test('the factor door claims no more than it computed', () => {
  assert.match(String(factor({ integer: '1' }).says), /1, neither prime nor composite/)
  const m = factor({ integer: (2n ** 1279n - 1n).toString() })
  assert.equal(m.certain, false)
  assert.equal(m.complete, false)
})

test('create takes its entropy from the caller: the pure door draws none', () => {
  assert.throws(() => factor({ create: { bits: 64 } }), /takes a seed/)
  assert.notEqual(factor({ create: { bits: 64, seed: '1' } }).integer, factor({ create: { bits: 64, seed: '2' } }).integer)
})
