// Each coin is a UUID and vice versa: a coin is minted per shared witness address, so every coin must be a valid sealed UUID and a malformed address
// must never mint one. These tests lock that invariant on the two minting paths — mintWitnessCoins (the coins) and mergeWitnesses (the witnesses they
// come from) — so a coin can never be booked against an address whose seal does not hold.
import test from 'node:test'
import assert from 'node:assert/strict'
import { uuidOf, uuidFromParts, channelOf, sealOf } from './unit/blocks.ts'
import { mergeWitnesses } from './witnesses.ts'
import { mintWitnessCoins } from './toolboxes/billing.ts'

test('mintWitnessCoins mints a coin only for a valid sealed UUID and rejects the rest', () => {
  const good = [uuidOf('a'), uuidOf('b'), uuidOf('c')]
  assert.ok(good.every((u) => sealOf(u).valid))
  const bad = ['not-a-uuid', '00000000-0000-0000-0000-000000000000' /* nil: version 0, seal invalid */]
  const r = mintWitnessCoins([...good, ...bad])
  assert.equal(r.coins, good.length, 'one coin per valid UUID')
  assert.deepEqual(r.invalid, bad, 'the malformed and the unsealed addresses are rejected, not booked')
  assert.ok(r.balanced && r.lines.every((l) => l.credit === 'coins:author' && l.amount === 0))
  assert.equal(mintWitnessCoins([]).coins, 0)
})

test('every witness mergeWitnesses yields is a sealed UUID, so every coin it mints is a validated address', () => {
  const a = uuidOf('referrer-x'), b = uuidFromParts(channelOf(uuidOf('referrer-x')).handle, channelOf(uuidOf('dest-y')).program, channelOf(uuidOf('dest-y')).tail)
  const m = mergeWitnesses(a, b)
  assert.deepEqual(m.invalid, [])
  assert.ok([...m.referrer.witnesses, ...m.destination.witnesses].every((w) => sealOf(w.uuid).valid), 'every witness is a sealed UUID')
  const coins = mintWitnessCoins(m.shared)
  assert.equal(coins.invalid.length, 0, 'no shared witness is ever an invalid UUID')
  assert.equal(coins.coins, m.shared.length)
})

test('a malformed side mints no coin and never throws (the merge is validated, not crashed)', () => {
  const m = mergeWitnesses('not-a-uuid', uuidOf('ok'))
  assert.deepEqual(m.invalid, ['not-a-uuid'])
  assert.deepEqual(m.shared, [])
  assert.equal(mintWitnessCoins(m.shared).coins, 0)
})
