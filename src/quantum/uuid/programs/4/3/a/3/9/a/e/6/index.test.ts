// X-Wing and ML-DSA computed end to end; every parameter set's round trip is a row of nistScenariosReverse (index.test.ts).
import test from 'node:test'
import assert from 'node:assert/strict'
import { pqc } from './index.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: X-Wing and ML-DSA round-trip, and a changed message or another seed is refused. */
test('X-Wing and ML-DSA round-trip, and a changed message or another seed is refused', () => {
  const seed = 'a5'.repeat(32), { publicKey } = pqc({ op: 'kem-keygen', seed }) as { publicKey: string }
  const sent = pqc({ op: 'kem-encapsulate', publicKey }) as { cipherText: string; sharedSecret: string }, back = (s: string) => (pqc({ op: 'kem-decapsulate', seed: s, cipherText: sent.cipherText }) as { sharedSecret: string }).sharedSecret
  assert.deepEqual([publicKey.length, back(seed) === sent.sharedSecret, back('5a'.repeat(32)) === sent.sharedSecret], [2 * 1216, true, false])
  const { signature } = pqc({ op: 'dsa-sign', seed, message: 'qpu' }) as { signature: string }, key = (pqc({ op: 'dsa-keygen', seed }) as { publicKey: string }).publicKey
  assert.deepEqual(['qpu', 'qpU'].map((message) => (pqc({ op: 'dsa-verify', publicKey: key, message, signature }) as { verified: boolean }).verified), [true, false])
  assert.equal((pqc({ op: 'dsa-keygen', algorithm: 'ML-DSA-44', seed }) as { publicKey: string }).publicKey.length, 2 * 1312)
  assert.throws(() => pqc({ op: 'kem-keygen', seed: 'ab' }))
})
