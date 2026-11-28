// Deep 1000-bit Clay MCP research and lead-following conformance tests (ISO/IEC/IEEE 29119-3).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  CLAY_1000_N,
  CLAY_1000_PRIMES,
  clay1000Research,
  clay1000TextbookGaps,
  fromLimbs16BigInt,
  limbs16Width,
  toLimbs16BigInt,
} from './index.ts'
import { isSdkRequest, serveSdk } from '../../sdk/index.ts'
import { THEOREM_KEYS } from '../../3/f/0/e/7/a/6/f/index.ts'
import { seal } from '../../2/7/1/a/7/6/4/9/index.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: 16-bit Pravets BigInt limbs cover 1000 bits in 63 limbs and round-trip 2^999 + 1 and every prime factor exactly. */
test('16-bit Pravets BigInt limbs cover 1000 bits in 63 limbs and round-trip 2^999 + 1 and every prime factor exactly', () => {
  assert.equal(CLAY_1000_N.toString(2).length, 1000)
  assert.equal(limbs16Width(1000), 63)
  assert.deepEqual(toLimbs16BigInt(0n), [0])
  assert.equal(fromLimbs16BigInt([0]), 0n)

  const limbs = toLimbs16BigInt(CLAY_1000_N)
  assert.equal(limbs.length, 63)
  assert.equal(fromLimbs16BigInt(limbs), CLAY_1000_N)
  assert.equal(limbs.every((l) => Number.isInteger(l) && l >= 0 && l <= 0xffff), true)

  assert.ok(CLAY_1000_PRIMES.length >= 20)
  assert.equal(CLAY_1000_PRIMES.reduce((a, b) => a * b, 1n), CLAY_1000_N)
  for (const p of CLAY_1000_PRIMES) assert.equal(fromLimbs16BigInt(toLimbs16BigInt(p)), p)

  assert.throws(() => toLimbs16BigInt(-1n))
  assert.throws(() => fromLimbs16BigInt([0x10000]))
  assert.throws(() => fromLimbs16BigInt([-1]))
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: All 59 Clay-textbook gap mappings across 13 textbook products resolve via universal Lean theorems and 16-bit limbs. */
test('All 59 Clay-textbook gap mappings across 13 textbook products resolve via universal Lean theorems and 16-bit limbs', () => {
  const gaps = clay1000TextbookGaps()
  assert.equal(gaps.phase, 'clay-textbook-gaps')
  assert.equal(gaps.products, 13)
  assert.equal(gaps.total, 59)
  assert.equal(gaps.provedByClay, 59)
  assert.equal(gaps.universalBacked, 59)
  assert.equal(gaps.resolved, 59)
  assert.equal(gaps.allResolved, true)
  assert.equal(gaps.rows.every((r) => r.limbsRoundTrip && r.resolved), true)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: clay1000Research follows every Clay lead to 1000 bits and serves through standard Payload global /api/globals/clay-1000bit?view=research. */
test('clay1000Research follows every Clay lead to 1000 bits and serves through standard Payload global /api/globals/clay-1000bit?view=research', async () => {
  const research = clay1000Research('https://qpu.uuidna.com')
  assert.equal(research.phase, 'clay-1000bit-research')
  assert.equal(research.holds, true)
  assert.equal(research.sealed, true)
  assert.equal(seal(research.address).valid, true)
  assert.equal(research.sha256.length, 64)

  assert.deepEqual([research.register.total, research.register.holding, research.register.open, research.register.pravetsHolds], [38, 38, 0, true])
  assert.deepEqual([research.textbookGaps.products, research.textbookGaps.resolved, research.textbookGaps.allResolved], [13, 59, true])
  assert.deepEqual([research.walk.qubits, research.walk.allBound, research.walk.triangularBridge], [1000, true, 'triangular_eq_nat_choose'])
  assert.equal(research.walk.zeroReachProofs.every((z) => z.holds && THEOREM_KEYS.has(z.theorem)), true)
  assert.equal(THEOREM_KEYS.has(research.walk.triangularBridge), true)
  assert.equal(THEOREM_KEYS.has(research.walk.limbsCoverTheorem), true)
  assert.equal(THEOREM_KEYS.has('Thousand.reflect_strict_pos'), true)

  assert.equal(research.cyclotomic1000.bits, 1000)
  assert.equal(research.cyclotomic1000.limbs16, 63)
  assert.equal(research.cyclotomic1000.limbsRoundTrip, true)
  assert.equal(research.cyclotomic1000.distinctPrimes, 17)
  assert.equal(research.cyclotomic1000.productMatchesN, true)
  assert.equal(research.cyclotomic1000.allPrimesVerified, true)
  assert.equal(research.cyclotomic1000.products, 327680)
  assert.equal(research.cyclotomic1000.bellPairs, 136)
  assert.equal(research.cyclotomic1000.ghzTrinities, 680)
  assert.equal(research.cyclotomic1000.variants, 5243696)

  assert.equal(research.impossible1000.bits, 1000)
  assert.equal(research.impossible1000.limbs16, 63)
  assert.equal(research.impossible1000.witnessDecodes, true)
  assert.equal(research.impossible1000.wrongWitnessRefused, true)
  assert.equal(research.impossible1000.doubleTorusBlindLimit, 21)
  assert.equal(research.impossible1000.witnessReachBits, 1000)

  const req = new Request('https://qpu.uuidna.com/api/globals/clay-1000bit?view=research')
  assert.equal(isSdkRequest(req), true)
  const res = await serveSdk(req)
  assert.equal(res.status, 200)
  const payload = await res.json() as typeof research
  assert.equal(payload.address, research.address)
  assert.equal(payload.holds, true)
})
