import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as node from 'node:crypto'
import * as qpu from './crypt.js'

const b64 = (b: Uint8Array) => Buffer.from(b).toString('base64url')
const P = (1n << 255n) - 19n
const L = (1n << 252n) + 27742317777372353535851937790883648493n
const le = (v: bigint, n = 32): Uint8Array => {
  const out = new Uint8Array(n)
  for (let i = 0; i < n; i++, v >>= 8n) out[i] = Number(v & 0xffn)
  return out
}
const leBig = (b: Uint8Array): bigint => b.reduceRight((v, x) => (v << 8n) | BigInt(x), 0n)

/** Every node:crypto function, ported to qpu (and parity-tested below) or not, with why. */
const PORTED: Record<string, string> = {
  createHash: 'sha256, sha512, md5', hash: 'sha256, sha512, md5', createHmac: 'hmac(sha256 | sha512)',
  hkdf: 'hkdf', hkdfSync: 'hkdf', pbkdf2: 'pbkdf2Sha256', pbkdf2Sync: 'pbkdf2Sha256',
  randomBytes: 'randomBytes', randomFill: 'randomBytes', randomFillSync: 'randomBytes', getRandomValues: 'randomBytes', randomUUID: 'randomUUID',
  createCipheriv: 'aeadSeal (chacha20-poly1305)', createDecipheriv: 'aeadOpen (chacha20-poly1305)',
  diffieHellman: 'x25519Shared', generateKeyPair: 'x25519PublicKey, ed25519PublicKey', generateKeyPairSync: 'x25519PublicKey, ed25519PublicKey',
  sign: 'ed25519Sign', verify: 'ed25519Verify', timingSafeEqual: 'equal',
}
const NOT_PORTED: Record<string, string> = {
  createSign: 'RSA/ECDSA streaming signatures (qpu signs with Ed25519)', createVerify: 'RSA/ECDSA streaming signatures',
  Sign: 'class of createSign', Verify: 'class of createVerify', Hash: 'class of createHash', Hmac: 'class of createHmac',
  Cipheriv: 'class of createCipheriv', Decipheriv: 'class of createDecipheriv',
  publicEncrypt: 'RSA encryption: broken by Shor, not ported', privateDecrypt: 'RSA', privateEncrypt: 'RSA', publicDecrypt: 'RSA',
  scrypt: 'memory-hard KDF not ported', scryptSync: 'memory-hard KDF not ported',
  argon2: 'memory-hard KDF not ported', argon2Sync: 'memory-hard KDF not ported',
  createDiffieHellman: 'finite-field DH: X25519 instead', createDiffieHellmanGroup: 'finite-field DH', getDiffieHellman: 'finite-field DH',
  DiffieHellman: 'finite-field DH', DiffieHellmanGroup: 'finite-field DH', createECDH: 'NIST-curve ECDH: X25519 instead', ECDH: 'NIST-curve ECDH',
  generateKey: 'symmetric KeyObjects: raw bytes from randomBytes instead', generateKeySync: 'symmetric KeyObjects',
  createPublicKey: 'KeyObject/PEM/DER parsing', createPrivateKey: 'KeyObject/PEM/DER parsing', createSecretKey: 'KeyObject',
  KeyObject: 'KeyObject', X509Certificate: 'X.509 parsing', Certificate: 'SPKAC', generatePrime: 'prime generation', generatePrimeSync: 'prime generation',
  checkPrime: 'primality testing', checkPrimeSync: 'primality testing', randomInt: 'not ported', getCiphers: 'OpenSSL catalogue', getHashes: 'OpenSSL catalogue',
  getCurves: 'OpenSSL catalogue', getCipherInfo: 'OpenSSL catalogue', secureHeapUsed: 'OpenSSL heap', setEngine: 'OpenSSL engines', getFips: 'OpenSSL FIPS',
  setFips: 'OpenSSL FIPS', createCipher: 'removed from node', createDecipher: 'removed from node', encapsulate: 'ML-KEM not ported', decapsulate: 'ML-KEM not ported',
}

test('every node:crypto function is either ported (parity-tested) or listed as not ported', () => {
  const functions = Object.keys(node).filter((k) => typeof (node as Record<string, unknown>)[k] === 'function')
  const unclassified = functions.filter((k) => !(k in PORTED) && !(k in NOT_PORTED))
  const ported = functions.filter((k) => k in PORTED)
  console.log(`node:crypto functions ${functions.length}; ported to qpu ${ported.length}; not ported ${functions.length - ported.length - unclassified.length}`)
  assert.deepEqual(unclassified, [], `unclassified node:crypto functions: ${unclassified.join(', ')}`)
})

test('ported surface: byte parity with node:crypto', () => {
  for (const n of [0, 1, 64, 1000]) {
    const m = qpu.randomBytes(n), k = qpu.randomBytes(48)
    for (const h of ['sha256', 'sha512', 'md5'] as const) assert.equal(qpu.hexOf(qpu[h](m)), node.createHash(h).update(m).digest('hex'))
    for (const h of ['sha256', 'sha512'] as const) assert.equal(qpu.hexOf(qpu.hmac(h, k, m)), node.createHmac(h, k).update(m).digest('hex'))
    assert.equal(qpu.hexOf(qpu.hkdf('sha256', m, k, 'i', 64)), Buffer.from(node.hkdfSync('sha256', m, k, 'i', 64)).toString('hex'))
    assert.equal(qpu.hexOf(qpu.pbkdf2Sha256(m, k, 1000, 32)), node.pbkdf2Sync(m, k, 1000, 32, 'sha256').toString('hex'))
    const key = qpu.randomBytes(32), iv = qpu.randomBytes(12)
    const c = node.createCipheriv('chacha20-poly1305', key, iv, { authTagLength: 16 })
    assert.equal(qpu.hexOf(qpu.aeadSeal(key, iv, m)), Buffer.concat([c.update(m), c.final(), c.getAuthTag()]).toString('hex'))
  }
  const a = qpu.randomBytes(32), seed = qpu.randomBytes(32), msg = qpu.randomBytes(40)
  const A = qpu.x25519PublicKey(a), bKeys = node.generateKeyPairSync('x25519')
  const B = new Uint8Array(Buffer.from(bKeys.publicKey.export({ format: 'jwk' }).x!, 'base64url'))
  const nodeA = node.createPrivateKey({ key: { kty: 'OKP', crv: 'X25519', d: b64(a), x: b64(A) }, format: 'jwk' })
  assert.equal(qpu.hexOf(qpu.x25519Shared(a, B)!), node.diffieHellman({ privateKey: nodeA, publicKey: bKeys.publicKey }).toString('hex'))
  const pub = qpu.ed25519PublicKey(seed)
  const nodeKey = node.createPrivateKey({ key: { kty: 'OKP', crv: 'Ed25519', d: b64(seed), x: b64(pub) }, format: 'jwk' })
  assert.equal(qpu.hexOf(qpu.ed25519Sign(seed, msg)), node.sign(null, msg, nodeKey).toString('hex'))
  assert.equal(qpu.randomUUID().length, node.randomUUID().length)
})

type Row = { attack: string; node: boolean; qpu: boolean }
const rows: Row[] = []
const nodeEdPublic = (raw: Uint8Array) => {
  try {
    return node.createPublicKey({ key: { kty: 'OKP', crv: 'Ed25519', x: b64(raw) }, format: 'jwk' })
  } catch {
    return null
  }
}
const nodeVerify = (raw: Uint8Array, m: Uint8Array, sig: Uint8Array): boolean => {
  const k = nodeEdPublic(raw)
  if (!k) return false
  try {
    return node.verify(null, m, k, sig)
  } catch {
    return false
  }
}

test('security: the same attacks against node:crypto and qpu crypto (true = the attack was rejected)', () => {
  // a signature that verifies under a small-order public key for any message: R = sB, S = s
  const forge = (A: Uint8Array) => {
    const seed = qpu.randomBytes(32)
    const h = qpu.sha512(seed).slice(0, 32)
    h[0]! &= 248; h[31]! &= 127; h[31]! |= 64
    return qpu.concat(qpu.ed25519PublicKey(seed), le(leBig(h) % L))
  }
  for (const [name, A] of [['ed25519 forgery under the identity key', le(1n)], ['ed25519 forgery under an order-2 key', le(P - 1n)]] as const) {
    let nodeAccepted = false, qpuAccepted = false
    for (let i = 0; i < 16; i++) {
      const m = qpu.randomBytes(24), sig = forge(A)
      nodeAccepted ||= nodeVerify(A, m, sig)
      qpuAccepted ||= qpu.ed25519Verify(A, m, sig)
    }
    rows.push({ attack: name, node: !nodeAccepted, qpu: !qpuAccepted })
  }
  const seed = qpu.randomBytes(32), pub = qpu.ed25519PublicKey(seed), m = qpu.utf8('pay 1')
  const sig = qpu.ed25519Sign(seed, m), malleable = qpu.concat(sig.subarray(0, 32), le(leBig(sig.subarray(32)) + L))
  rows.push({ attack: 'ed25519 malleability S + L', node: !nodeVerify(pub, m, malleable), qpu: !qpu.ed25519Verify(pub, m, malleable) })

  const low = [le(0n), le(1n), le(P - 1n)]
  const nodeLow = low.every((u) => {
    try {
      const priv = node.generateKeyPairSync('x25519').privateKey
      const s = node.diffieHellman({ privateKey: priv, publicKey: node.createPublicKey({ key: { kty: 'OKP', crv: 'X25519', x: b64(u) }, format: 'jwk' }) })
      return s.some((x) => x !== 0)
    } catch {
      return true
    }
  })
  rows.push({ attack: 'x25519 low-order public keys', node: nodeLow, qpu: low.every((u) => qpu.x25519Shared(qpu.randomBytes(32), u) === null) })

  const key = qpu.randomBytes(32), iv = qpu.randomBytes(12), sealed = qpu.aeadSeal(key, iv, m)
  const flipped = sealed.slice(); flipped[0]! ^= 1
  let nodeRejects = false
  try {
    const d = node.createDecipheriv('chacha20-poly1305', key, iv, { authTagLength: 16 })
    d.setAuthTag(flipped.subarray(flipped.length - 16))
    d.update(flipped.subarray(0, flipped.length - 16)); d.final()
  } catch {
    nodeRejects = true
  }
  rows.push({ attack: 'aead ciphertext tamper', node: nodeRejects, qpu: qpu.aeadOpen(key, iv, flipped) === null })

  let nodeNoThrow = true
  try {
    node.timingSafeEqual(new Uint8Array(3), new Uint8Array(4))
  } catch {
    nodeNoThrow = false
  }
  rows.push({ attack: 'compare unequal lengths without throwing', node: nodeNoThrow, qpu: qpu.equal(new Uint8Array(3), new Uint8Array(4)) === false })

  console.table(rows)
  const stricter = rows.filter((r) => r.qpu && !r.node).map((r) => r.attack)
  const weaker = rows.filter((r) => r.node && !r.qpu).map((r) => r.attack)
  console.log(`qpu rejects and node:crypto accepts: ${stricter.length ? stricter.join('; ') : 'none'}`)
  console.log(`node:crypto rejects and qpu accepts: ${weaker.length ? weaker.join('; ') : 'none'}`)
  console.log('not measured here: node:crypto (OpenSSL) runs curve arithmetic in constant time; qpu uses BigInt and does not')
  assert.ok(rows.every((r) => r.qpu), 'qpu must reject every attack')
  assert.deepEqual(weaker, [])
})
