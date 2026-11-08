// Each coin is a UUID and vice versa: a coin is minted per shared witness address, so every coin must be a valid sealed UUID and a malformed address
// must never mint one. Furthermore:
//   - Each token is a coil (1 unified sealed UUID) with 2 reflecting UUIDs imprinted in one (mergeWitnesses recovers the coil UUID and mints 2 coins).
//   - Each coin is also a token depending on the accounting transaction: in transaction T_k it is 1 coin (one reflecting side of T_k's coil);
//     in transaction T_{k+1} that coin unfolds as a token-coil with its own 2 reflecting UUIDs, forming an append-only UUID blockchain.
import test from 'node:test'
import assert from 'node:assert/strict'
import { uuid, uuidFromParts, channel, seal } from '../uuid/index.ts'
import { mergeWitnesses } from './witnesses.ts'
import { mintWitnessCoins } from './toolboxes/billing.ts'
import {
  LATTICE_COINS,
  LATTICE_RAYS,
  LATTICE_FACES,
  LATTICE_COIL,
  LATTICE_PLANE,
  SHOR_MODULUS,
  NATIVE_PAYLOAD_PLUGINS,
  mintTokenCoil,
  coinAsToken,
  buildCoinCoilBlockchain,
  verifyCoinCoilBlockchain,
  solveAllViaCoins,
  coinsCoilsAccounting,
  qpuAccountingEndpoint,
} from './unit/coil.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: mintWitnessCoins mints a coin only for a valid sealed UUID and rejects the rest. */
test('mintWitnessCoins mints a coin only for a valid sealed UUID and rejects the rest', () => {
  const good = [uuid('a'), uuid('b'), uuid('c')]
  assert.ok(good.every((u) => seal(u).valid))
  const bad = ['not-a-uuid', '00000000-0000-0000-0000-000000000000' /* nil: version 0, seal invalid */]
  const r = mintWitnessCoins([...good, ...bad])
  assert.equal(r.coins, good.length, 'one coin per valid UUID')
  assert.deepEqual(r.invalid, bad, 'the malformed and the unsealed addresses are rejected, not booked')
  assert.ok(r.balanced && r.lines.every((l) => l.credit === 'coins:author' && l.amount === 0))
  assert.equal(mintWitnessCoins([]).coins, 0)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every witness mergeWitnesses yields is a sealed UUID, so every coin it mints is a validated address. */
test('every witness mergeWitnesses yields is a sealed UUID, so every coin it mints is a validated address', () => {
  const a = uuid('referrer-x'), b = uuidFromParts(channel(uuid('referrer-x')).handle, channel(uuid('dest-y')).program, channel(uuid('dest-y')).tail)
  const m = mergeWitnesses(a, b)
  assert.deepEqual(m.invalid, [])
  assert.ok([...m.referrer.witnesses, ...m.destination.witnesses].every((w) => seal(w.uuid).valid), 'every witness is a sealed UUID')
  const coins = mintWitnessCoins(m.shared)
  assert.equal(coins.invalid.length, 0, 'no shared witness is ever an invalid UUID')
  assert.equal(coins.coins, m.shared.length)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a malformed side mints no coin and never throws (the merge is validated, not crashed). */
test('a malformed side mints no coin and never throws (the merge is validated, not crashed)', () => {
  const m = mergeWitnesses('not-a-uuid', uuid('ok'))
  assert.deepEqual(m.invalid, ['not-a-uuid'])
  assert.deepEqual(m.shared, [])
  assert.equal(mintWitnessCoins(m.shared).coins, 0)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: each token is a coil with 2 reflecting UUIDs imprinted in one, verified by mergeWitnesses and mintWitnessCoins. */
test('each token is a coil with 2 reflecting UUIDs imprinted in one, verified by mergeWitnesses and mintWitnessCoins', () => {
  assert.deepEqual([LATTICE_COINS, LATTICE_RAYS, LATTICE_FACES, LATTICE_COIL, LATTICE_PLANE, SHOR_MODULUS], [2, 7, 14, 14, 28, 91])
  for (let i = 0; i < 8; i++) {
    const token = mintTokenCoil(`token-seed-${i}`, i)
    assert.equal(token.coil, 1, '1 token is 1 coil')
    assert.equal(token.coins, 2, '2 reflecting UUIDs imprinted in 1 coil')
    assert.equal(token.rays, 7)
    assert.equal(token.faces, 14)
    assert.equal(token.plane, 28)
    assert.ok(token.holds, 'token-coil imprint holds')
    assert.ok(seal(token.uuid).valid && seal(token.reflecting[0]).valid && seal(token.reflecting[1]).valid)
    assert.notEqual(token.reflecting[0], token.reflecting[1], 'the 2 reflecting coin UUIDs are distinct')
    assert.ok(token.imprint.imprintedInOne && token.imprint.recoversFromObverse && token.imprint.recoversFromReverse)
    assert.equal(token.imprint.shared.length, 2, 'mergeWitnesses of the 2 reflecting coins yields exactly 2 shared witnesses')
    assert.ok(token.imprint.shared.includes(token.uuid), 'the coil UUID itself is imprinted in the shared witness intersection of its 2 reflecting coins')
    assert.equal(token.imprint.mintedCoins, 2, 'mintWitnessCoins mints 2 coins in balanced double entry')
  }
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: each coin is also a token depending on the accounting transaction, chaining into a verified UUID blockchain across all native Payload plugins. */
test('each coin is also a token depending on the accounting transaction, chaining into a verified UUID blockchain across all native Payload plugins', async () => {
  const parentToken = mintTokenCoil('genesis-order-tx', 0)
  const [debitCoin, creditCoin] = parentToken.reflecting

  // Both the obverse (debit) coin and reverse (credit) coin unfold as valid tokens in their respective accounting transactions
  const debitAsToken = coinAsToken(debitCoin, {
    plugin: '@payloadcms/plugin-ecommerce',
    collection: 'orders',
    operation: 'debit-side-tx',
    tenant: 'uuidna',
    pairIndex: 0,
    prevTokenUuid: parentToken.uuid,
    prevSide: 0,
  })
  const creditAsToken = coinAsToken(creditCoin, {
    plugin: '@payloadcms/plugin-ecommerce',
    collection: 'transactions',
    operation: 'credit-side-tx',
    tenant: 'psg',
    pairIndex: 0,
    prevTokenUuid: parentToken.uuid,
    prevSide: 1,
  })

  assert.ok(debitAsToken.holds && debitAsToken.parentMatches && debitAsToken.parentTokenRecovered === parentToken.uuid)
  assert.ok(creditAsToken.holds && creditAsToken.parentMatches && creditAsToken.parentTokenRecovered === parentToken.uuid)
  assert.equal(debitAsToken.asToken.reflecting[0], parentToken.uuid, 'σ-involution on the obverse coin recovers the parent token-coil UUID')
  assert.equal(creditAsToken.asToken.reflecting[1], parentToken.uuid, 'σ-involution on the reverse coin recovers the parent token-coil UUID')

  // Verify the full multi-block accounting blockchain across all 10 native @payloadcms/* packages
  const solved = solveAllViaCoins()
  assert.equal(solved.solved, true, 'all catalogue variants, 512 plugin combinations, and native Payload plugins solved via coins')
  assert.equal(solved.plugins.length, NATIVE_PAYLOAD_PLUGINS.length)
  assert.equal(solved.blockchain.valid, true)
  assert.equal(solved.blockchain.blocks.length, NATIVE_PAYLOAD_PLUGINS.length)
  assert.equal(solved.blockchain.hashLinks, NATIVE_PAYLOAD_PLUGINS.length - 1, 'n blocks carry n - 1 hash links')
  assert.equal(solved.blockchain.spentOnce, true, 'no coin is spent more than once (no double spending)')
  assert.equal(solved.blockchain.balanced, true, 'blockchain double-entry debits equal credits (net 0)')
  assert.equal(solved.blockchain.net, 0)

  const res = await qpuAccountingEndpoint.handler({ url: 'http://local/api/qpu/accounting?tenant=psg&currency=eur' } as never)
  const body = (await res.json()) as ReturnType<typeof coinsCoilsAccounting>
  assert.equal(body.phase, 'qpu-coins-coils-accounting')
  assert.equal(body.tenant, 'psg')
  assert.equal(body.solved, true)
  assert.equal(body.tenantCoinAsToken.holds, true)
  assert.equal(body.blockchain.valid, true)
})
