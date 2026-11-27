// Cryptography computed (FIPS 203, 204, 205, X-Wing, and the classical Ed25519 and ECDSA P-256). The secret key never travels: the caller keeps its seed.
import { ml_kem768_x25519 } from '@noble/post-quantum/hybrid.js'
import { ml_kem512, ml_kem768, ml_kem1024 } from '@noble/post-quantum/ml-kem.js'
import { ml_dsa44, ml_dsa65, ml_dsa87 } from '@noble/post-quantum/ml-dsa.js'
import { slh_dsa_sha2_128s, slh_dsa_sha2_128f, slh_dsa_sha2_192s, slh_dsa_sha2_256s } from '@noble/post-quantum/slh-dsa.js'
import { ed25519 } from '@noble/curves/ed25519.js'
import { p256 } from '@noble/curves/nist.js'
import { PROSE, proseFill } from '../../../../../../../../5/9/e/4/9/1/a/4/index.ts'
import { hex, utf8 } from '../../../../../../../../9/e/8/6/7/0/6/8/index.ts'
import { fromHex } from '../../../../../../../../e/1/9/1/6/4/9/c/index.ts'

const OPS = ['kem-keygen', 'kem-encapsulate', 'kem-decapsulate', 'dsa-keygen', 'dsa-sign', 'dsa-verify'] as const
const KEMS = { 'X-Wing': ml_kem768_x25519, 'ML-KEM-512': ml_kem512, 'ML-KEM-768': ml_kem768, 'ML-KEM-1024': ml_kem1024 }
const SIGNS = { 'ML-DSA-44': ml_dsa44, 'ML-DSA-65': ml_dsa65, 'ML-DSA-87': ml_dsa87, 'SLH-DSA-SHA2-128s': slh_dsa_sha2_128s, 'SLH-DSA-SHA2-128f': slh_dsa_sha2_128f, 'SLH-DSA-SHA2-192s': slh_dsa_sha2_192s, 'SLH-DSA-SHA2-256s': slh_dsa_sha2_256s, Ed25519: ed25519,
  // ECDSA over the SHA-256 of the message (noble prehashes), its public key uncompressed
  'ECDSA-P256': { lengths: { ...p256.lengths, publicKey: p256.lengths.publicKeyUncompressed }, keygen: (seed?: Uint8Array) => { const { secretKey } = p256.keygen(seed); return { secretKey, publicKey: p256.getPublicKey(secretKey, false) } }, sign: p256.sign, verify: p256.verify } }
type Scheme = { lengths: { seed?: number }; keygen: (seed?: Uint8Array) => { publicKey: Uint8Array; secretKey: Uint8Array } }
/** The named (or fallback) set of a family, its standard, and its key from the seed (a fresh one without). */
const use = <T extends Record<string, Scheme>>(sets: T, name: unknown, fallback: keyof T, seed?: unknown) => {
  const n = String(name ?? fallback)
  if (!Object.hasOwn(sets, n)) throw new Error(proseFill(PROSE.quantumProcessingCryptoPqc_algorithm, Object.keys(sets).join(', '), n))
  const s = sets[n]!, bytes = s.lengths.seed!, given = seed === undefined ? undefined : fromHex(String(seed), 'seed')
  return { algorithm: n as keyof T & string, s: s as T[keyof T], standard: n === 'Ed25519' ? { rfc: 8032 } : { fips: /^EC/.test(n) ? '186-5' : /^SL/.test(n) ? 205 : /^ML-D/.test(n) ? 204 : 203 }, key: () => { if (given && given.length !== bytes) throw new Error(proseFill(PROSE.quantumProcessingCryptoPqc_seed, bytes, 2 * bytes)); return s.keygen(given) } }
}
const specOf = (spec: unknown) => (spec && typeof spec === 'object' ? spec : { algorithm: spec === true ? undefined : spec }) as { algorithm?: unknown; seed?: string }

/** One post-quantum operation: a KEM key, encapsulation or decapsulation (X-Wing by default), or a signature key, signature or verification (ML-DSA-65 by default). */
export const pqc = (raw: unknown) => {
  const a = (raw ?? {}) as Record<string, unknown>, op = String(a.op), bytes = (k: string) => fromHex(String(a[k] ?? ''), k), message = utf8(String(a.message ?? ''))
  if (!OPS.includes(op as never)) throw new Error(proseFill(PROSE.quantumProcessingCryptoPqc_op, OPS.join(', ')))
  const { algorithm, s, standard, key } = op.startsWith('kem-') ? use(KEMS, a.algorithm, 'X-Wing', a.seed ?? '') : use(SIGNS, a.algorithm, 'ML-DSA-65', a.seed ?? ''), at = { phase: 'pqc' as const, op, algorithm, ...standard, sizes: s.lengths }
  const k = s as typeof ml_kem768, d = s as typeof ml_dsa65
  if (op.endsWith('keygen')) return { ...at, publicKey: hex(key().publicKey) }
  if (op === 'kem-encapsulate') { const e = k.encapsulate(bytes('publicKey')); return { ...at, cipherText: hex(e.cipherText), sharedSecret: hex(e.sharedSecret) } }
  if (op === 'kem-decapsulate') return { ...at, sharedSecret: hex(k.decapsulate(bytes('cipherText'), key().secretKey)) }
  return op === 'dsa-verify' ? { ...at, verified: d.verify(bytes('signature'), message, bytes('publicKey')) } : { ...at, signature: hex(d.sign(message, key().secretKey)) }
}

/** A KEM round trip (ML-KEM-768 by default): a key from the seed or a fresh one, encapsulated to and decapsulated; the secret stays here. */
export const kemRound = (spec: unknown) => {
  const o = specOf(spec), { algorithm, s, standard, key } = use(KEMS, o.algorithm, 'ML-KEM-768', o.seed), k = key(), e = s.encapsulate(k.publicKey)
  return { algorithm, ...standard, sizes: { ...s.lengths, sharedSecret: e.sharedSecret.length }, publicKey: hex(k.publicKey), cipherText: hex(e.cipherText), agrees: hex(s.decapsulate(e.cipherText, k.secretKey)) === hex(e.sharedSecret) }
}

/** A signature key (the fallback by default) from the seed or a fresh one; given a message, its signature verified and a changed message refused. */
export const dsaRound = (spec: unknown, message?: string, fallback: keyof typeof SIGNS = 'ML-DSA-65') => {
  const o = specOf(spec), { algorithm, s, standard, key } = use(SIGNS, o.algorithm, fallback, o.seed), k = key(), m = message === undefined ? null : utf8(message), signature = m && s.sign(m, k.secretKey)
  return { algorithm, ...standard, sizes: s.lengths, publicKey: hex(k.publicKey), ...(m && signature ? { message, signature: hex(signature), verified: s.verify(signature, m, k.publicKey), refusesChanged: !s.verify(signature, utf8(message + '\u0000'), k.publicKey) } : {}) }
}
