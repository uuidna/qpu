/**
 * SHA-256/512 (FIPS 180-4), HMAC (RFC 2104), HKDF (RFC 5869), ChaCha20-Poly1305 (RFC 8439), X25519 (RFC 7748) and
 * Ed25519 (RFC 8032) in TypeScript, from their formulas. Field and curve arithmetic is BigInt and not constant-time.
 */

export type Bytes = Uint8Array

const enc = new TextEncoder()
export const utf8 = (s: string): Bytes => enc.encode(s)
export const bytesOf = (x: Bytes | string): Bytes => (typeof x === 'string' ? utf8(x) : x)
export const hexOf = (b: Bytes): string => Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('')
export const fromHex = (h: string): Bytes => Uint8Array.from(h.match(/../g) ?? [], (x) => parseInt(x, 16))
export const concat = (...parts: Bytes[]): Bytes => {
  const out = new Uint8Array(parts.reduce((a, p) => a + p.length, 0))
  let at = 0
  for (const p of parts) out.set(p, (at += p.length) - p.length)
  return out
}
export const equal = (a: Bytes, b: Bytes): boolean => {
  if (a.length !== b.length) return false
  let d = 0
  for (let i = 0; i < a.length; i++) d |= a[i]! ^ b[i]!
  return d === 0
}

// ChaCha20 generator with fast key erasure: each call rekeys from its own keystream, so earlier outputs cannot be
// recomputed from the current state. The 32-byte seed is the one value taken from outside: entropy has no formula.
let drbgKey: Bytes | undefined
export const randomBytes = (n: number): Bytes => {
  drbgKey ??= sha256(concat(globalThis.crypto.getRandomValues(new Uint8Array(32)), utf8(String(Date.now()))))
  const stream = chacha20(drbgKey, new Uint8Array(12), 0, new Uint8Array(32 + n))
  drbgKey = stream.slice(0, 32)
  return stream.slice(32)
}
export const randomUUID = (): string => {
  const b = randomBytes(16)
  b[6] = (b[6]! & 0x0f) | 0x40
  b[8] = (b[8]! & 0x3f) | 0x80
  const h = hexOf(b)
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

const leToBig = (b: Bytes): bigint => {
  let v = 0n
  for (let i = b.length - 1; i >= 0; i--) v = (v << 8n) | BigInt(b[i]!)
  return v
}
const bigToLe = (v: bigint, n: number): Bytes => {
  const out = new Uint8Array(n)
  for (let i = 0; i < n; i++, v >>= 8n) out[i] = Number(v & 0xffn)
  return out
}

// ---------------------------------------------------------------------------
// SHA-2 constants: fractional bits of square and cube roots of the first primes
// ---------------------------------------------------------------------------

const primes = (count: number): bigint[] => {
  const out: bigint[] = []
  for (let c = 2; out.length < count; c++) if (out.every((p) => c % Number(p) !== 0)) out.push(BigInt(c))
  return out
}
const iroot = (x: bigint, k: bigint): bigint => {
  if (x < 2n) return x
  let r = 1n << ((BigInt(x.toString(2).length) + k - 1n) / k)
  for (;;) {
    const s = ((k - 1n) * r + x / r ** (k - 1n)) / k
    if (s >= r) return r
    r = s
  }
}
const frac = (p: bigint, k: bigint, bits: bigint): bigint => iroot(p << (k * bits), k) & ((1n << bits) - 1n)
const P80 = primes(80)

const K256 = Uint32Array.from(P80.slice(0, 64), (p) => Number(frac(p, 3n, 32n)))
const H256 = Uint32Array.from(P80.slice(0, 8), (p) => Number(frac(p, 2n, 32n)))
const K512 = P80.map((p) => frac(p, 3n, 64n))
const H512 = P80.slice(0, 8).map((p) => frac(p, 2n, 64n))

const rotr = (x: number, n: number): number => (x >>> n) | (x << (32 - n))

export const sha256 = (input: Bytes | string): Bytes => {
  const data = bytesOf(input)
  const blocks = new Uint8Array(((data.length + 9 + 63) >> 6) << 6)
  blocks.set(data)
  blocks[data.length] = 0x80
  const view = new DataView(blocks.buffer)
  view.setUint32(blocks.length - 8, Math.floor((data.length * 8) / 2 ** 32))
  view.setUint32(blocks.length - 4, (data.length * 8) >>> 0)
  const H = H256.slice()
  const W = new Uint32Array(64)
  for (let off = 0; off < blocks.length; off += 64) {
    for (let t = 0; t < 16; t++) W[t] = view.getUint32(off + 4 * t)
    for (let t = 16; t < 64; t++) {
      const x = W[t - 15]!, y = W[t - 2]!
      W[t] = W[t - 16]! + (rotr(x, 7) ^ rotr(x, 18) ^ (x >>> 3)) + W[t - 7]! + (rotr(y, 17) ^ rotr(y, 19) ^ (y >>> 10))
    }
    let [a, b, c, d, e, f, g, h] = H as unknown as number[]
    for (let t = 0; t < 64; t++) {
      const t1 = (h! + (rotr(e!, 6) ^ rotr(e!, 11) ^ rotr(e!, 25)) + ((e! & f!) ^ (~e! & g!)) + K256[t]! + W[t]!) | 0
      const t2 = ((rotr(a!, 2) ^ rotr(a!, 13) ^ rotr(a!, 22)) + ((a! & b!) ^ (a! & c!) ^ (b! & c!))) | 0
      h = g; g = f; f = e; e = (d! + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0
    }
    H[0]! += a!; H[1]! += b!; H[2]! += c!; H[3]! += d!; H[4]! += e!; H[5]! += f!; H[6]! += g!; H[7]! += h!
  }
  const out = new Uint8Array(32)
  const ov = new DataView(out.buffer)
  H.forEach((v, i) => ov.setUint32(4 * i, v))
  return out
}

const M64 = (1n << 64n) - 1n
const rotr64 = (x: bigint, n: bigint): bigint => ((x >> n) | (x << (64n - n))) & M64

export const sha512 = (input: Bytes | string): Bytes => {
  const data = bytesOf(input)
  const blocks = new Uint8Array(((data.length + 17 + 127) >> 7) << 7)
  blocks.set(data)
  blocks[data.length] = 0x80
  const view = new DataView(blocks.buffer)
  view.setBigUint64(blocks.length - 8, BigInt(data.length) * 8n)
  const H = H512.slice()
  const W = new Array<bigint>(80)
  for (let off = 0; off < blocks.length; off += 128) {
    for (let t = 0; t < 16; t++) W[t] = view.getBigUint64(off + 8 * t)
    for (let t = 16; t < 80; t++) {
      const x = W[t - 15]!, y = W[t - 2]!
      W[t] = (W[t - 16]! + (rotr64(x, 1n) ^ rotr64(x, 8n) ^ (x >> 7n)) + W[t - 7]! + (rotr64(y, 19n) ^ rotr64(y, 61n) ^ (y >> 6n))) & M64
    }
    let [a, b, c, d, e, f, g, h] = H as [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint]
    for (let t = 0; t < 80; t++) {
      const t1 = (h + (rotr64(e, 14n) ^ rotr64(e, 18n) ^ rotr64(e, 41n)) + ((e & f) ^ (~e & M64 & g)) + K512[t]! + W[t]!) & M64
      const t2 = ((rotr64(a, 28n) ^ rotr64(a, 34n) ^ rotr64(a, 39n)) + ((a & b) ^ (a & c) ^ (b & c))) & M64
      h = g; g = f; f = e; e = (d + t1) & M64; d = c; c = b; b = a; a = (t1 + t2) & M64
    }
    ;[a, b, c, d, e, f, g, h].forEach((v, i) => (H[i] = (H[i]! + v) & M64))
  }
  const out = new Uint8Array(64)
  const ov = new DataView(out.buffer)
  H.forEach((v, i) => ov.setBigUint64(8 * i, v))
  return out
}

export const sha256Hex = (input: Bytes | string): string => hexOf(sha256(input))

// ---------------------------------------------------------------------------
// MD5 (RFC 1321): identifiers only, collisions are practical
// ---------------------------------------------------------------------------

const MD5_K = Uint32Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32))
const MD5_S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21]

export const md5 = (input: Bytes | string): Bytes => {
  const data = bytesOf(input)
  const blocks = new Uint8Array(((data.length + 9 + 63) >> 6) << 6)
  blocks.set(data)
  blocks[data.length] = 0x80
  const view = new DataView(blocks.buffer)
  view.setUint32(blocks.length - 8, (data.length * 8) >>> 0, true)
  view.setUint32(blocks.length - 4, Math.floor((data.length * 8) / 2 ** 32), true)
  const H = Uint32Array.of(0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476)
  for (let off = 0; off < blocks.length; off += 64) {
    let [a, b, c, d] = H as unknown as number[]
    for (let i = 0; i < 64; i++) {
      const [f, g] = i < 16 ? [(b! & c!) | (~b! & d!), i] : i < 32 ? [(d! & b!) | (~d! & c!), (5 * i + 1) % 16] : i < 48 ? [b! ^ c! ^ d!, (3 * i + 5) % 16] : [c! ^ (b! | ~d!), (7 * i) % 16]
      const t = (f + a! + MD5_K[i]! + view.getUint32(off + 4 * g, true)) | 0
      a = d; d = c; c = b
      b = (b! + ((t << MD5_S[(i >> 4) * 4 + (i & 3)]!) | (t >>> (32 - MD5_S[(i >> 4) * 4 + (i & 3)]!)))) | 0
    }
    H[0]! += a!; H[1]! += b!; H[2]! += c!; H[3]! += d!
  }
  const out = new Uint8Array(16)
  const ov = new DataView(out.buffer)
  H.forEach((v, i) => ov.setUint32(4 * i, v, true))
  return out
}

export const md5Hex = (input: Bytes | string): string => hexOf(md5(input))

// ---------------------------------------------------------------------------
// HMAC and HKDF
// ---------------------------------------------------------------------------

const BLOCK = { sha256: 64, sha512: 128 } as const
const HASH = { sha256, sha512 } as const
export type HashName = keyof typeof HASH

export const hmac = (hash: HashName, key: Bytes | string, message: Bytes | string): Bytes => {
  let k = bytesOf(key)
  if (k.length > BLOCK[hash]) k = HASH[hash](k)
  const padded = new Uint8Array(BLOCK[hash])
  padded.set(k)
  const ipad = padded.map((x) => x ^ 0x36)
  const opad = padded.map((x) => x ^ 0x5c)
  return HASH[hash](concat(opad, HASH[hash](concat(ipad, bytesOf(message)))))
}

export const hkdf = (hash: HashName, ikm: Bytes, salt: Bytes, info: Bytes | string, length: number): Bytes => {
  const size = HASH[hash](new Uint8Array()).length
  if (length > 255 * size) throw new Error('hkdf: length too large')
  const prk = hmac(hash, salt.length ? salt : new Uint8Array(size), ikm)
  const out = new Uint8Array(length)
  let t = new Uint8Array()
  for (let i = 1, at = 0; at < length; i++, at += size) {
    t = hmac(hash, prk, concat(t, bytesOf(info), Uint8Array.of(i))) as Uint8Array<ArrayBuffer>
    out.set(t.subarray(0, Math.min(size, length - at)), at)
  }
  return out
}

// ---------------------------------------------------------------------------
// PBKDF2-HMAC-SHA256 (RFC 8018): the HMAC inner and outer states are computed once, so every iteration is two
// compressions of one fixed 64-byte block, with no allocation in the loop
// ---------------------------------------------------------------------------

const compress = (H: Uint32Array, W: Uint32Array): void => {
  for (let t = 16; t < 64; t++) {
    const x = W[t - 15]!, y = W[t - 2]!
    W[t] = W[t - 16]! + (rotr(x, 7) ^ rotr(x, 18) ^ (x >>> 3)) + W[t - 7]! + (rotr(y, 17) ^ rotr(y, 19) ^ (y >>> 10))
  }
  let a = H[0]!, b = H[1]!, c = H[2]!, d = H[3]!, e = H[4]!, f = H[5]!, g = H[6]!, h = H[7]!
  for (let t = 0; t < 64; t++) {
    const t1 = (h + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K256[t]! + W[t]!) | 0
    const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0
    h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0
  }
  H[0]! += a; H[1]! += b; H[2]! += c; H[3]! += d; H[4]! += e; H[5]! += f; H[6]! += g; H[7]! += h
}

const padStateOf = (key: Bytes, pad: number): Uint32Array => {
  const block = new Uint8Array(64)
  block.set(key)
  const v = new DataView(block.buffer)
  const W = new Uint32Array(64)
  for (let i = 0; i < 16; i++) W[i] = v.getUint32(4 * i) ^ (pad * 0x01010101)
  const H = H256.slice()
  compress(H, W)
  return H
}

export const pbkdf2Sha256 = (password: Bytes | string, salt: Bytes | string, iterations: number, length: number): Bytes => {
  if (!Number.isSafeInteger(iterations) || iterations < 1 || !Number.isSafeInteger(length) || length < 1) throw new Error('pbkdf2: iterations and length must be positive integers')
  let key = bytesOf(password)
  if (key.length > 64) key = sha256(key)
  const inner = padStateOf(key, 0x36)
  const outer = padStateOf(key, 0x5c)
  const s = bytesOf(salt)
  const out = new Uint8Array(length)
  const ov = new DataView(out.buffer)
  const W = new Uint32Array(64)
  const H = new Uint32Array(8)
  const T = new Uint32Array(8)
  for (let block = 1, at = 0; at < length; block++, at += 32) {
    // U1 = HMAC(P, S || INT(block))
    const first = hmac('sha256', key, concat(s, Uint8Array.of(block >>> 24, (block >>> 16) & 255, (block >>> 8) & 255, block & 255)))
    const fv = new DataView(first.buffer, first.byteOffset, 32)
    for (let i = 0; i < 8; i++) T[i] = H[i] = fv.getUint32(4 * i)
    // U_j = HMAC(P, U_{j-1}): one 32-byte message after each pad, so the block is U, 0x80, zeros and the bit length 768
    for (let j = 1; j < iterations; j++) {
      for (let i = 0; i < 8; i++) W[i] = H[i]!
      W[8] = 0x80000000; W[9] = W[10] = W[11] = W[12] = W[13] = W[14] = 0; W[15] = 768
      H.set(inner)
      compress(H, W)
      for (let i = 0; i < 8; i++) W[i] = H[i]!
      W[8] = 0x80000000; W[9] = W[10] = W[11] = W[12] = W[13] = W[14] = 0; W[15] = 768
      H.set(outer)
      compress(H, W)
      for (let i = 0; i < 8; i++) T[i]! ^= H[i]!
    }
    for (let i = 0; i < 8 && at + 4 * i < length; i++) {
      if (at + 4 * i + 4 <= length) ov.setUint32(at + 4 * i, T[i]!)
      else for (let k = 0; at + 4 * i + k < length; k++) out[at + 4 * i + k] = (T[i]! >>> (24 - 8 * k)) & 255
    }
  }
  return out
}

// ---------------------------------------------------------------------------
// ChaCha20-Poly1305
// ---------------------------------------------------------------------------

const rotl = (x: number, n: number): number => (x << n) | (x >>> (32 - n))
const words = (b: Bytes): Uint32Array => {
  const v = new DataView(b.buffer, b.byteOffset, b.byteLength)
  return Uint32Array.from({ length: b.length / 4 }, (_, i) => v.getUint32(4 * i, true))
}

const chachaBlock = (key: Uint32Array, counter: number, nonce: Uint32Array): Bytes => {
  const s = Uint32Array.of(0x61707865, 0x3320646e, 0x79622d32, 0x6b206574, ...key, counter >>> 0, ...nonce)
  const x = s.slice()
  const qr = (a: number, b: number, c: number, d: number) => {
    x[a]! += x[b]!; x[d] = rotl(x[d]! ^ x[a]!, 16)
    x[c]! += x[d]!; x[b] = rotl(x[b]! ^ x[c]!, 12)
    x[a]! += x[b]!; x[d] = rotl(x[d]! ^ x[a]!, 8)
    x[c]! += x[d]!; x[b] = rotl(x[b]! ^ x[c]!, 7)
  }
  for (let i = 0; i < 10; i++) {
    qr(0, 4, 8, 12); qr(1, 5, 9, 13); qr(2, 6, 10, 14); qr(3, 7, 11, 15)
    qr(0, 5, 10, 15); qr(1, 6, 11, 12); qr(2, 7, 8, 13); qr(3, 4, 9, 14)
  }
  const out = new Uint8Array(64)
  const v = new DataView(out.buffer)
  for (let i = 0; i < 16; i++) v.setUint32(4 * i, (x[i]! + s[i]!) >>> 0, true)
  return out
}

export const chacha20 = (key: Bytes, nonce: Bytes, counter: number, data: Bytes): Bytes => {
  if (key.length !== 32 || nonce.length !== 12) throw new Error('chacha20: key 32 bytes, nonce 12 bytes')
  if (counter + Math.ceil(data.length / 64) > 2 ** 32) throw new Error('chacha20: block counter would wrap')
  const k = words(key), n = words(nonce)
  const out = new Uint8Array(data.length)
  for (let at = 0, c = counter; at < data.length; at += 64, c++) {
    const block = chachaBlock(k, c, n)
    for (let i = 0; i < 64 && at + i < data.length; i++) out[at + i] = data[at + i]! ^ block[i]!
  }
  return out
}

const P1305 = (1n << 130n) - 5n
export const poly1305 = (key: Bytes, message: Bytes): Bytes => {
  const r = leToBig(key.subarray(0, 16)) & 0x0ffffffc0ffffffc0ffffffc0fffffffn
  const s = leToBig(key.subarray(16, 32))
  let acc = 0n
  for (let at = 0; at < message.length; at += 16) {
    const chunk = message.subarray(at, at + 16)
    acc = ((acc + leToBig(chunk) + (1n << BigInt(8 * chunk.length))) * r) % P1305
  }
  return bigToLe((acc + s) & ((1n << 128n) - 1n), 16)
}

const pad16 = (n: number): Bytes => new Uint8Array((16 - (n % 16)) % 16)
const macData = (aad: Bytes, ct: Bytes): Bytes => concat(aad, pad16(aad.length), ct, pad16(ct.length), bigToLe(BigInt(aad.length), 8), bigToLe(BigInt(ct.length), 8))

/** ciphertext || 16-byte tag */
export const aeadSeal = (key: Bytes, nonce: Bytes, plaintext: Bytes, aad: Bytes = new Uint8Array()): Bytes => {
  const otk = chacha20(key, nonce, 0, new Uint8Array(32))
  const ct = chacha20(key, nonce, 1, plaintext)
  return concat(ct, poly1305(otk, macData(aad, ct)))
}

/** The plaintext, or null when the tag does not authenticate ciphertext and aad. */
export const aeadOpen = (key: Bytes, nonce: Bytes, sealed: Bytes, aad: Bytes = new Uint8Array()): Bytes | null => {
  if (sealed.length < 16) return null
  const ct = sealed.subarray(0, sealed.length - 16)
  const otk = chacha20(key, nonce, 0, new Uint8Array(32))
  if (!equal(poly1305(otk, macData(aad, ct)), sealed.subarray(sealed.length - 16))) return null
  return chacha20(key, nonce, 1, ct)
}

// ---------------------------------------------------------------------------
// Curve25519 field
// ---------------------------------------------------------------------------

const P = (1n << 255n) - 19n
const mod = (a: bigint): bigint => {
  const r = a % P
  return r < 0n ? r + P : r
}
const pow = (b: bigint, e: bigint): bigint => {
  let r = 1n
  for (b = mod(b); e > 0n; e >>= 1n, b = (b * b) % P) if (e & 1n) r = (r * b) % P
  return r
}
const inv = (x: bigint): bigint => pow(x, P - 2n)

// ---------------------------------------------------------------------------
// X25519
// ---------------------------------------------------------------------------

export const x25519 = (scalar: Bytes, u: Bytes): Bytes => {
  const k = scalar.slice(0, 32)
  k[0]! &= 248
  k[31]! &= 127
  k[31]! |= 64
  const n = leToBig(k)
  const ub = u.slice(0, 32)
  ub[31]! &= 127
  const x1 = mod(leToBig(ub))
  let x2 = 1n, z2 = 0n, x3 = x1, z3 = 1n, swap = 0n
  for (let t = 254; t >= 0; t--) {
    const bit = (n >> BigInt(t)) & 1n
    if (swap ^ bit) [x2, x3, z2, z3] = [x3, x2, z3, z2]
    swap = bit
    const A = x2 + z2, B = x2 - z2, C = x3 + z3, D = x3 - z3
    const AA = mod(A * A), BB = mod(B * B), E = mod(AA - BB), DA = mod(D * A), CB = mod(C * B)
    x3 = mod((DA + CB) ** 2n)
    z3 = mod(x1 * (DA - CB) ** 2n)
    x2 = mod(AA * BB)
    z2 = mod(E * (AA + 121665n * E))
  }
  if (swap) [x2, z2] = [x3, z3]
  return bigToLe(mod(x2 * inv(z2)), 32)
}

const BASE_U = bigToLe(9n, 32)
export const x25519PublicKey = (secret: Bytes): Bytes => x25519(secret, BASE_U)

/** The shared secret, or null for a low-order public key (all-zero output). */
export const x25519Shared = (secret: Bytes, publicKey: Bytes): Bytes | null => {
  const s = x25519(secret, publicKey)
  return s.some((b) => b !== 0) ? s : null
}

// ---------------------------------------------------------------------------
// Ed25519
// ---------------------------------------------------------------------------

type Point = readonly [bigint, bigint, bigint, bigint]
const D = mod(-121665n * inv(121666n))
const D2 = mod(2n * D)
const SQRT_M1 = pow(2n, (P - 1n) / 4n)
const L = (1n << 252n) + 27742317777372353535851937790883648493n
const ZERO: Point = [0n, 1n, 1n, 0n]

const add = ([X1, Y1, Z1, T1]: Point, [X2, Y2, Z2, T2]: Point): Point => {
  const A = mod((Y1 - X1) * (Y2 - X2)), B = mod((Y1 + X1) * (Y2 + X2))
  const C = mod(T1 * D2 * T2), Dz = mod(2n * Z1 * Z2)
  const E = B - A, F = Dz - C, G = Dz + C, H = B + A
  return [mod(E * F), mod(G * H), mod(F * G), mod(E * H)]
}
const multiply = (s: bigint, p: Point): Point => {
  let q = ZERO
  for (let i = BigInt(s.toString(2).length) - 1n; i >= 0n; i--) {
    q = add(q, q)
    if ((s >> i) & 1n) q = add(q, p)
  }
  return q
}
const recoverX = (y: bigint, sign: bigint): bigint | null => {
  const x2 = mod((y * y - 1n) * inv(D * y * y + 1n))
  if (x2 === 0n) return sign ? null : 0n
  let x = pow(x2, (P + 3n) / 8n)
  if (mod(x * x - x2) !== 0n) x = mod(x * SQRT_M1)
  if (mod(x * x - x2) !== 0n) return null
  return (x & 1n) === sign ? x : P - x
}
const BY = mod(4n * inv(5n))
const BASE: Point = [recoverX(BY, 0n)!, BY, 1n, mod(recoverX(BY, 0n)! * BY)]

const encodePoint = ([X, Y, Z]: Point): Bytes => {
  const zi = inv(Z)
  const out = bigToLe(mod(Y * zi), 32)
  if (mod(X * zi) & 1n) out[31]! |= 0x80
  return out
}
const decodePoint = (b: Bytes): Point | null => {
  if (b.length !== 32) return null
  const c = b.slice()
  const sign = BigInt(c[31]! >> 7)
  c[31]! &= 0x7f
  const y = leToBig(c)
  if (y >= P) return null
  const x = recoverX(y, sign)
  return x === null ? null : [x, y, 1n, mod(x * y)]
}
const expand = (seed: Bytes) => {
  const h = sha512(seed)
  const a = h.slice(0, 32)
  a[0]! &= 248
  a[31]! &= 127
  a[31]! |= 64
  const s = leToBig(a)
  return { s, prefix: h.subarray(32), publicKey: encodePoint(multiply(s, BASE)) }
}
const modL = (b: Bytes): bigint => leToBig(b) % L

export const ed25519PublicKey = (seed: Bytes): Bytes => expand(seed).publicKey

export const ed25519Sign = (seed: Bytes, message: Bytes | string): Bytes => {
  const m = bytesOf(message)
  const { s, prefix, publicKey } = expand(seed)
  const r = modL(sha512(concat(prefix, m)))
  const R = encodePoint(multiply(r, BASE))
  const k = modL(sha512(concat(R, publicKey, m)))
  return concat(R, bigToLe((r + k * s) % L, 32))
}

const isSmallOrder = (p: Point): boolean => {
  const [X, Y, Z] = multiply(8n, p)
  return mod(X) === 0n && mod(Y - Z) === 0n
}

/** Strict: canonical S, on-curve canonical points, and no small-order A or R (a small-order key verifies forgeries). */
export const ed25519Verify = (publicKey: Bytes, message: Bytes | string, signature: Bytes): boolean => {
  if (signature.length !== 64) return false
  const S = leToBig(signature.subarray(32))
  const A = decodePoint(publicKey)
  const R = decodePoint(signature.subarray(0, 32))
  if (S >= L || !A || !R || isSmallOrder(A) || isSmallOrder(R)) return false
  const k = modL(sha512(concat(signature.subarray(0, 32), publicKey, bytesOf(message))))
  return equal(encodePoint(multiply(S, BASE)), encodePoint(add(R, multiply(k, A))))
}
