import { test } from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

// node:crypto's own functions become counting spies before the shim loads: any call that reaches them is counted
const calls = { pbkdf2: 0, randomBytes: 0 }
const nativeSync = crypto.pbkdf2Sync.bind(crypto)
const mutable = crypto as unknown as Record<string, unknown>
mutable.pbkdf2 = () => void calls.pbkdf2++
mutable.randomBytes = () => void calls.randomBytes++

const { qpuPbkdf2, qpuRandomBytes } = await import('./workers-crypto.js')
const payloadFile = createRequire(import.meta.url).resolve('payload').replace(/index\.js$/, 'auth/strategies/local/generatePasswordSaltHash.js')
const { generatePasswordSaltHash, getPasswordHashParameters } = await import(pathToFileURL(payloadFile).href)

test('crypto.pbkdf2 and crypto.randomBytes are the qpu crypto', () => {
  assert.equal(mutable.pbkdf2, qpuPbkdf2)
  assert.equal(mutable.randomBytes, qpuRandomBytes)
  crypto.pbkdf2('password', 'salt', 600000, 32, 'sha256', (err, key) => {
    assert.equal(err, null)
    assert.equal(key.toString('hex'), nativeSync('password', 'salt', 600000, 32, 'sha256').toString('hex'))
  })
  const a = crypto.randomBytes(32)
  const b = crypto.randomBytes(32)
  assert.equal(a.length, 32)
  assert.notEqual(a.toString('hex'), b.toString('hex'), 'Payload salts use platform entropy (Web Crypto), not formula DRBG')
  assert.deepEqual(calls, { pbkdf2: 0, randomBytes: 0 })
})

test("Payload's password hash runs on qpu crypto at the full 600000 iterations", async () => {
  const { hash, salt } = await generatePasswordSaltHash({ collection: { slug: 'users' }, isPasswordAuthenticated: true, password: 'correct horse battery staple', req: {} })
  const { hash: hex, iterations, keyLength } = getPasswordHashParameters(hash)
  assert.equal(iterations, 600000)
  assert.equal(salt.length, 64)
  assert.equal(hex, nativeSync('correct horse battery staple', salt, iterations, keyLength, 'sha256').toString('hex'))
  assert.deepEqual(calls, { pbkdf2: 0, randomBytes: 0 })
})

test('sha512 is registered; unbound digests stay off node:crypto', () => {
  qpuPbkdf2('p', 's', 1, 32, 'sha512', (err, key) => {
    assert.equal(err, null)
    assert.equal(key.length, 32)
  })
  qpuPbkdf2('p', 's', 1, 32, 'md5', (err) => assert.match(String(err), /unbound in formula port/))
  assert.deepEqual(calls, { pbkdf2: 0, randomBytes: 0 })
})
