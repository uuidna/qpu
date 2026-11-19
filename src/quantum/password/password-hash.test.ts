// The password digest is PBKDF2-SHA256 for 600000 iterations of one salt, then an HKDF seal under the worker secret.
// These tests lock that function: the digest matches that stretch, a right password verifies, and a wrong one does not.
import test from 'node:test'
import assert from 'node:assert/strict'
import { pbkdf2Sync } from 'node:crypto'
import { qpuPasswordDigest, qpuPasswordVerify, isQpuPasswordHash, PASSWORD_ITERATIONS, QPU_PASSWORD_PREFIX } from './password-hash.js'
import { mintTokenCoil } from '../processing/unit/coil.ts'
import { hex, hkdfExpand, hkdfExtract, utf8 } from '../processing/unit/hmac.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a password digest is PBKDF2-SHA256 of 600000 iterations, and verify accepts only that password. */
test('a password digest is PBKDF2-SHA256 of 600000 iterations, and verify accepts only that password', async () => {
  const previous = process.env['PAYLOAD_SECRET']
  process.env['PAYLOAD_SECRET'] = 'test-pepper'
  try {
    const password = 'correct horse', salt = 'page-salt'
    const digest = await qpuPasswordDigest(password, salt)
    const block = new Uint8Array(pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, 32, 'sha256'))
    const coil = mintTokenCoil(salt, 0)
    const prk = hkdfExtract(utf8('test-pepper'), block)
    const okm = hkdfExpand(prk, utf8(`qpu password v1\n${coil.uuid}\n${coil.reflecting[0]}\n${coil.reflecting[1]}`), 32)
    assert.equal(digest, `${QPU_PASSWORD_PREFIX}${hex(okm)}`)
    assert.equal(isQpuPasswordHash(digest), true)
    assert.equal(await qpuPasswordVerify(password, salt, digest), true)
    assert.equal(await qpuPasswordVerify('wrong horse', salt, digest), false)
    assert.equal(await qpuPasswordVerify(password, 'other-salt', digest), false)
    assert.equal(await qpuPasswordVerify(password, salt, 'sha256:nope'), false)
  } finally {
    if (previous === undefined) delete process.env['PAYLOAD_SECRET']
    else process.env['PAYLOAD_SECRET'] = previous
  }
})
