// The witnesses of a UUID cross-encrypted: the ring closes, nothing changed or foreign passes, a seed rebuilds it and no secret is answered.
import test from 'node:test'
import assert from 'node:assert/strict'
import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js'
import { call } from '../mcp.ts'

const UUID = '9f46ed5e-ad2b-8c96-bd8d-431be987c981', SEED = '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f'
const cross = (witnesses: unknown) => call('seal', { witnesses })
const bytes = (h: string) => Uint8Array.from(h.match(/../g)!.map((x) => parseInt(x, 16)))

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the fourteen witnesses form a ring in which every link is opened by its successor alone, verified, and refused when anything is changed. */
test('the fourteen witnesses form a ring in which every link is opened by its successor alone, verified, and refused when anything is changed', () => {
  const s = cross({ uuid: UUID, seed: SEED }).result!.structuredContent
  assert.deepEqual([s.phase, s.faces, s.links.length, s.closes, s.refused, s.holds, s.reproducible], ['witnesses-cross', 14, 14, true, true, true, true])
  for (const [i, l] of s.links.entries()) {
    assert.deepEqual([l.to, l.opened, l.signed, l.refuses], [s.links[(i + 1) % 14].from, true, true, { changed: true, stranger: true, forged: true }], `link ${i}`)
    assert.deepEqual([l.publicKeys.kem.bytes, l.publicKeys.dsa.bytes, l.kem.bytes, l.signature.bytes, l.tag.length, l.nonce.length], [1184, 1952, 1088, 3309, 32, 24])
  }
  assert.equal(new Set(s.links.map((l: { from: string }) => l.from)).size, 14)
  // no secret key and no shared secret is in the answer: its largest hex text is a public key's or a signature's digest, and nothing is named a secret
  assert.deepEqual([s.secret.travels, /secretKey|sharedSecret/.test(JSON.stringify(s))], [false, false])
  assert.deepEqual([s.cost.kem, s.cost.signature.fips, s.cost.aead.grover, s.cost.address.preimage.grover, s.cost.address.meetsFloor], [{ algorithm: 'ML-KEM-768', fips: 203, category: 3, stated: 'described' }, 204, 128, 61, false])
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the seed rebuilds the same ring, another seed another, a ring without a seed cannot be rebuilt, and a short seed is refused. */
test('the seed rebuilds the same ring, another seed another, a ring without a seed cannot be rebuilt, and a short seed is refused', () => {
  const a = cross({ uuid: UUID, seed: SEED }).result!.structuredContent, other = cross({ uuid: UUID, seed: SEED.replace('00', 'ff') }).result!.structuredContent
  assert.deepEqual(cross({ seed: SEED, uuid: UUID }).result!.structuredContent.links, a.links)
  assert.notEqual(other.links[0].ciphertext, a.links[0].ciphertext)
  assert.deepEqual([other.closes, other.refused], [true, true])
  const fresh = cross(UUID).result!.structuredContent
  assert.deepEqual([fresh.reproducible, fresh.holds], [false, true])
  assert.match(cross({ uuid: UUID, seed: '00ff' }).error!.message, /at least 32 bytes/)
  assert.match(cross({ seed: SEED }).error!.message, /witnesses takes a UUID/)
  // witnesses is one alternative of seal: named beside another it is refused by name
  assert.equal((call('seal', { witnesses: UUID, text: 'a' }) as { error?: { data?: { code?: string } } }).error?.data?.code, 'ambiguous_arguments')
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: given whole, a link's signature verifies under its witness's public key with the library alone, and not over a changed link. */
test('given whole, a link\'s signature verifies under its witness\'s public key with the library alone, and not over a changed link', () => {
  const s = cross({ uuid: UUID, seed: SEED, full: true }).result!.structuredContent, l = s.links[3]
  const signedOver = bytes(l.kem + l.nonce + l.ciphertext + l.tag)
  assert.equal(ml_dsa65.verify(bytes(l.signature), signedOver, bytes(l.publicKeys.dsa)), true)
  signedOver[0] = signedOver[0]! ^ 1
  assert.equal(ml_dsa65.verify(bytes(l.signature), signedOver, bytes(l.publicKeys.dsa)), false)
  // another witness's key does not verify it
  assert.equal(ml_dsa65.verify(bytes(l.signature), bytes(l.kem + l.nonce + l.ciphertext + l.tag), bytes(s.links[4].publicKeys.dsa)), false)
})
