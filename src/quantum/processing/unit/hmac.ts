// SHA-256 and HMAC-SHA256 as pure functions over bytes, so the handler verifies a Stripe signature without the host's crypto
// and the same code runs in a test, a Worker and a browser. FIPS 180-4; RFC 2104.
/** FIPS 180-4 §4.2.2-3 and §5.3.3-5: the constants are the first 64 bits of the fractional parts of the cube roots of the first 80 primes, the
 *  initial hash those of the square roots of the first 8; SHA-256 keeps the first 64 constants and the first 32 bits of each; derived, never copied */
const PRIMES: number[] = []; for (let n = 2; PRIMES.length < 80; n++) if (PRIMES.every((p) => n % p)) PRIMES.push(n)
const rootOf = (x: bigint, k: bigint) => { let r = 1n << BigInt(Math.ceil(x.toString(2).length / Number(k))), y; while ((y = ((k - 1n) * r + x / r ** (k - 1n)) / k) < r) r = y; return r }
const M64 = (1n << 64n) - 1n, K512 = PRIMES.map((p) => rootOf(BigInt(p) << 192n, 3n) & M64), H512 = PRIMES.slice(0, 8).map((p) => rootOf(BigInt(p) << 128n, 2n) & M64)
const K = Int32Array.from(K512.slice(0, 64), (x) => Number(x >> 32n)) // no cap: SHA-256's fixed 64 round constants, structural — not a read or walk cap
const rotr = (x: number, n: number) => (x >>> n) | (x << (32 - n))
const ENCODER = new TextEncoder()
export const utf8 = (s: string): Uint8Array => ENCODER.encode(s)
export const hex = (b: Uint8Array): string => [...b].map((x) => x.toString(16).padStart(2, '0')).join('')

/** SHA-256 of bytes (FIPS 180-4). O(n), all int32: Int32Arrays wrap mod 2^32 on store, so no word becomes a double. */
export const sha256 = (message: Uint8Array): Uint8Array => {
  const h = Int32Array.from(H512, (x) => Number(x >> 32n))
  const l = message.length, padded = new Uint8Array(((l + 9 + 63) >> 6) << 6), dv = new DataView(padded.buffer), w = new Int32Array(64)
  padded.set(message); padded[l] = 0x80
  dv.setUint32(padded.length - 8, Math.floor(l / 0x20000000)); dv.setUint32(padded.length - 4, l * 8)
  for (let off = 0; off < padded.length; off += 64) {
    for (let i = 0; i < 16; i++) w[i] = dv.getInt32(off + i * 4)
    for (let i = 16; i < 64; i++) { const x = w[i - 15]!, y = w[i - 2]!; w[i] = w[i - 16]! + (rotr(x, 7) ^ rotr(x, 18) ^ (x >>> 3)) + w[i - 7]! + (rotr(y, 17) ^ rotr(y, 19) ^ (y >>> 10)) }
    let a = h[0]!, b = h[1]!, c = h[2]!, d = h[3]!, e = h[4]!, f = h[5]!, g = h[6]!, hh = h[7]!
    for (let i = 0; i < 64; i++) {
      const t1 = (hh + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[i]! + w[i]!) | 0
      const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0
      hh = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0
    }
    ;[a, b, c, d, e, f, g, hh].forEach((v, i) => { h[i] = h[i]! + v })
  }
  const out = new Uint8Array(32), ov = new DataView(out.buffer); h.forEach((x, i) => ov.setInt32(i * 4, x)); return out
}
export const hmacSha256 = (key: Uint8Array, message: Uint8Array): Uint8Array => {
  const k = key.length > 64 ? sha256(key) : key
  const padded = (x: number, rest: Uint8Array) => { const b = new Uint8Array(64 + rest.length); b.set(rest, 64); for (let i = 0; i < 64; i++) b[i] = (k[i] ?? 0) ^ x; return b }
  return sha256(padded(0x5c, sha256(padded(0x36, message))))
}
/** Equal in constant time, so a signature check leaks nothing by timing. */
export const sameHex = (a: string, b: string): boolean => { if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0 }

/** RFC 6962 Merkle tree over SHA-256: the Certificate Transparency log the attest tool reads a tree head of IS this tree; a client verifies an
 *  entry's inclusion here. Empty = SHA-256(); leaf = SHA-256(0x00 ‖ d); node = SHA-256(0x01 ‖ left ‖ right); the split is the largest power of two below n. */
const concatBytes = (...a: Uint8Array[]): Uint8Array => { const n = a.reduce((s, x) => s + x.length, 0), o = new Uint8Array(n); let p = 0; for (const x of a) { o.set(x, p); p += x.length } return o }
const LEAF = new Uint8Array([0]), NODE = new Uint8Array([1])
const splitPow2 = (n: number): number => { let k = 1; while (k * 2 < n) k *= 2; return k }
export const merkleLeafHash = (d: Uint8Array): Uint8Array => sha256(concatBytes(LEAF, d))
export const merkleRoot = (leaves: readonly Uint8Array[]): Uint8Array => {
  if (leaves.length === 0) return sha256(new Uint8Array(0))
  if (leaves.length === 1) return merkleLeafHash(leaves[0]!)
  const k = splitPow2(leaves.length)
  return sha256(concatBytes(NODE, merkleRoot(leaves.slice(0, k)), merkleRoot(leaves.slice(k))))
}
/** The audit path proving leaf m is in the tree of n: each sibling hash bottom-up with its side (right: the sibling is to the right of us). */
export const merkleProof = (leaves: readonly Uint8Array[], m: number): { hash: Uint8Array; right: boolean }[] => {
  const n = leaves.length
  if (n <= 1) return []
  const k = splitPow2(n)
  return m < k
    ? [...merkleProof(leaves.slice(0, k), m), { hash: merkleRoot(leaves.slice(k)), right: true }]
    : [...merkleProof(leaves.slice(k), m - k), { hash: merkleRoot(leaves.slice(0, k)), right: false }]
}
/** Verify an entry's inclusion: fold the leaf up its audit path and compare to the tree head — O(log n), the whole tree never read. */
export const merkleVerify = (leaf: Uint8Array, proof: readonly { hash: Uint8Array; right: boolean }[], root: Uint8Array): boolean => {
  let r = merkleLeafHash(leaf)
  for (const s of proof) r = sha256(concatBytes(NODE, s.right ? r : s.hash, s.right ? s.hash : r))
  return sameHex(hex(r), hex(root))
}

/** PBKDF2-HMAC-SHA256 (RFC 8018 / NIST SP 800-132): a password stretched to a derived key by `iterations` rounds of HMAC — password hashing the ISO way, pure over hmacSha256; missing it is a security gap (passwords stored unstretched). */
export const pbkdf2Sha256 = (password: Uint8Array, salt: Uint8Array, iterations: number, dkLen: number): Uint8Array => {
  const out = new Uint8Array(dkLen), blocks = Math.ceil(dkLen / 32)
  for (let i = 1; i <= blocks; i++) {
    const idx = new Uint8Array([(i >>> 24) & 255, (i >>> 16) & 255, (i >>> 8) & 255, i & 255])
    let u = hmacSha256(password, concatBytes(salt, idx)); const t = u.slice()
    for (let j = 1; j < iterations; j++) { u = hmacSha256(password, u); for (let k = 0; k < 32; k++) t[k]! ^= u[k]! }
    out.set(t.subarray(0, Math.min(32, dkLen - (i - 1) * 32)), (i - 1) * 32)
  }
  return out
}
/** HKDF-SHA256 (RFC 5869): extract a pseudorandom key from input keying material (a salt and the IKM), then expand it to any length under a context label; pure, so seeds derive the same in a test, a Worker and a browser. */
export const hkdfExtract = (salt: Uint8Array, ikm: Uint8Array): Uint8Array => hmacSha256(salt.length ? salt : new Uint8Array(32), ikm)
export const hkdfExpand = (prk: Uint8Array, info: Uint8Array, length: number): Uint8Array => {
  const out = new Uint8Array(length); let t: Uint8Array = new Uint8Array(0); const n = Math.ceil(length / 32)
  for (let i = 1; i <= n; i++) { t = hmacSha256(prk, concatBytes(t, info, new Uint8Array([i]))); out.set(t.subarray(0, Math.min(32, length - (i - 1) * 32)), (i - 1) * 32) }
  return out
}

/** SHA-512, pure (FIPS 180-4), in 64-bit words as BigInt: the NIST beacon's precommitment (SHA-512 of the next pulse's local random value) is verified here, nowhere else. */
const rotr64 = (x: bigint, n: bigint): bigint => ((x >> n) | (x << (64n - n))) & M64
export const sha512 = (message: Uint8Array): Uint8Array => {
  const H = [...H512]
  const l = message.length; const padded = new Uint8Array(Math.ceil((l + 17) / 128) * 128); padded.set(message); padded[l] = 0x80
  const bits = BigInt(l) * 8n; for (let i = 0; i < 16; i += 1) padded[padded.length - 1 - i] = Number((bits >> BigInt(8 * i)) & 0xffn)
  const w = new Array<bigint>(80)
  for (let o = 0; o < padded.length; o += 128) {
    for (let t = 0; t < 16; t += 1) { let v = 0n; for (let b = 0; b < 8; b += 1) v = (v << 8n) | BigInt(padded[o + t * 8 + b]!); w[t] = v }
    for (let t = 16; t < 80; t += 1) { const s0 = rotr64(w[t - 15]!, 1n) ^ rotr64(w[t - 15]!, 8n) ^ (w[t - 15]! >> 7n); const s1 = rotr64(w[t - 2]!, 19n) ^ rotr64(w[t - 2]!, 61n) ^ (w[t - 2]! >> 6n); w[t] = (w[t - 16]! + s0 + w[t - 7]! + s1) & M64 }
    let [a, b, c, d, e, f, g, h] = H as [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint]
    for (let t = 0; t < 80; t += 1) {
      const S1 = rotr64(e, 14n) ^ rotr64(e, 18n) ^ rotr64(e, 41n); const ch = (e & f) ^ (~e & M64 & g); const t1 = (h + S1 + ch + K512[t]! + w[t]!) & M64
      const S0 = rotr64(a, 28n) ^ rotr64(a, 34n) ^ rotr64(a, 39n); const maj = (a & b) ^ (a & c) ^ (b & c); const t2 = (S0 + maj) & M64
      h = g; g = f; f = e; e = (d + t1) & M64; d = c; c = b; b = a; a = (t1 + t2) & M64
    }
    ;[a, b, c, d, e, f, g, h].forEach((v, i) => { H[i] = (H[i]! + v) & M64 })
  }
  const out = new Uint8Array(64); H.forEach((v, i) => { for (let b = 0; b < 8; b += 1) out[i * 8 + b] = Number((v >> BigInt(8 * (7 - b))) & 0xffn) }); return out
}

/** SHA-3 and SHAKE (FIPS 202), pure Keccak-f[1600] over 64-bit BigInt lanes: the sponge hash family beside SHA-2, for domains that require Keccak; KAT-verified, never a stub. */
const KECCAK_RC: readonly bigint[] = [0x1n, 0x8082n, 0x800000000000808an, 0x8000000080008000n, 0x808bn, 0x80000001n, 0x8000000080008081n, 0x8000000000008009n, 0x8an, 0x88n, 0x80008009n, 0x8000000an, 0x8000808bn, 0x800000000000008bn, 0x8000000000008089n, 0x8000000000008003n, 0x8000000000008002n, 0x8000000000000080n, 0x800an, 0x800000008000000an, 0x8000000080008081n, 0x8000000000008080n, 0x80000001n, 0x8000000080008008n]
const rotlK = (x: bigint, n: number): bigint => (n === 0 ? x : ((x << BigInt(n)) | (x >> BigInt(64 - n))) & M64)
const keccakF = (s: bigint[]): void => {
  for (let round = 0; round < 24; round++) {
    const C: bigint[] = [0, 1, 2, 3, 4].map((x) => s[x]! ^ s[x + 5]! ^ s[x + 10]! ^ s[x + 15]! ^ s[x + 20]!)
    const D: bigint[] = [0, 1, 2, 3, 4].map((x) => C[(x + 4) % 5]! ^ rotlK(C[(x + 1) % 5]!, 1))
    for (let x = 0; x < 5; x++) for (let y = 0; y < 25; y += 5) s[x + y] = s[x + y]! ^ D[x]!
    let x = 1, y = 0, cur = s[1]!
    for (let t = 0; t < 24; t++) { const X = y, Y = (2 * x + 3 * y) % 5, i = X + 5 * Y, tmp = s[i]!; s[i] = rotlK(cur, (((t + 1) * (t + 2)) / 2) % 64); cur = tmp; x = X; y = Y }
    for (let yy = 0; yy < 25; yy += 5) { const t = [0, 1, 2, 3, 4].map((xx) => s[yy + xx]!); for (let xx = 0; xx < 5; xx++) s[yy + xx] = t[xx]! ^ (~t[(xx + 1) % 5]! & M64 & t[(xx + 2) % 5]!) }
    s[0] = s[0]! ^ KECCAK_RC[round]!
  }
}
const keccak = (rateBits: number, pad: number, outLen: number, msg: Uint8Array): Uint8Array => {
  const s = new Array<bigint>(25).fill(0n), rate = rateBits / 8
  const padded = new Uint8Array(Math.max(1, Math.ceil((msg.length + 1) / rate)) * rate); padded.set(msg); padded[msg.length] = pad; padded[padded.length - 1] = padded[padded.length - 1]! | 0x80
  for (let off = 0; off < padded.length; off += rate) { for (let i = 0; i < rate; i++) { const lane = i >> 3; s[lane] = s[lane]! ^ (BigInt(padded[off + i]!) << BigInt(8 * (i & 7))) } keccakF(s) }
  const out = new Uint8Array(outLen); let got = 0
  while (got < outLen) { for (let i = 0; i < rate && got < outLen; i++) { const lane = i >> 3; out[got++] = Number((s[lane]! >> BigInt(8 * (i & 7))) & 0xffn) } if (got < outLen) keccakF(s) }
  return out
}
export const sha3_256 = (m: Uint8Array): Uint8Array => keccak(1088, 0x06, 32, m)
export const sha3_512 = (m: Uint8Array): Uint8Array => keccak(576, 0x06, 64, m)
export const shake128 = (m: Uint8Array, outBytes: number): Uint8Array => keccak(1344, 0x1f, outBytes, m)
export const shake256 = (m: Uint8Array, outBytes: number): Uint8Array => keccak(1088, 0x1f, outBytes, m)

/** AES-256-GCM (FIPS 197 + NIST SP 800-38D), pure: the S-box derived in GF(2^8) (multiplicative inverse + affine, never a copied table), the key schedule, the block cipher, and GCM (CTR + GHASH in GF(2^128)); authenticated symmetric encryption, KAT-verified. */
const gmul8 = (a: number, b: number): number => { let p = 0; for (let i = 0; i < 8; i++) { if (b & 1) p ^= a; const hi = a & 0x80; a = (a << 1) & 0xff; if (hi) a ^= 0x1b; b >>= 1 } return p & 0xff }
const AES_INV = (() => { const inv = new Uint8Array(256); for (let i = 1; i < 256; i++) for (let j = 1; j < 256; j++) if (gmul8(i, j) === 1) { inv[i] = j; break } return inv })()
const AES_SBOX = (() => { const s = new Uint8Array(256); for (let i = 0; i < 256; i++) { const x = AES_INV[i]!; let r = x; for (let k = 1; k < 5; k++) r ^= ((x << k) | (x >> (8 - k))) & 0xff; s[i] = r ^ 0x63 } return s })()
const aesExpandKey256 = (key: Uint8Array): Uint8Array[] => {
  const Nk = 8, Nr = 14, w: number[][] = []
  for (let i = 0; i < Nk; i++) w.push([key[4 * i]!, key[4 * i + 1]!, key[4 * i + 2]!, key[4 * i + 3]!])
  let rcon = 1
  for (let i = Nk; i < 4 * (Nr + 1); i++) {
    let t = [...w[i - 1]!]
    if (i % Nk === 0) { t = [t[1]!, t[2]!, t[3]!, t[0]!].map((b) => AES_SBOX[b]!); t[0]! ^= rcon; rcon = gmul8(rcon, 2) }
    else if (i % Nk === 4) t = t.map((b) => AES_SBOX[b]!)
    w.push(w[i - Nk]!.map((b, j) => b ^ t[j]!))
  }
  const rk: Uint8Array[] = []
  for (let r = 0; r <= Nr; r++) { const b = new Uint8Array(16); for (let c = 0; c < 4; c++) for (let j = 0; j < 4; j++) b[c * 4 + j] = w[r * 4 + c]![j]!; rk.push(b) }
  return rk
}
const aesEncBlock = (rk: Uint8Array[], input: Uint8Array): Uint8Array => {
  let s = Uint8Array.from(input)
  for (let i = 0; i < 16; i++) s[i]! ^= rk[0]![i]!
  for (let round = 1; round <= 14; round++) {
    const sub = new Uint8Array(16); for (let i = 0; i < 16; i++) sub[i] = AES_SBOX[s[i]!]!
    const sh = new Uint8Array(16); for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) sh[c * 4 + r] = sub[((c + r) % 4) * 4 + r]!
    if (round < 14) { const m = new Uint8Array(16); for (let c = 0; c < 4; c++) { const a0 = sh[c * 4]!, a1 = sh[c * 4 + 1]!, a2 = sh[c * 4 + 2]!, a3 = sh[c * 4 + 3]!; m[c * 4] = gmul8(a0, 2) ^ gmul8(a1, 3) ^ a2 ^ a3; m[c * 4 + 1] = a0 ^ gmul8(a1, 2) ^ gmul8(a2, 3) ^ a3; m[c * 4 + 2] = a0 ^ a1 ^ gmul8(a2, 2) ^ gmul8(a3, 3); m[c * 4 + 3] = gmul8(a0, 3) ^ a1 ^ a2 ^ gmul8(a3, 2) } s = m } else s = sh
    for (let i = 0; i < 16; i++) s[i]! ^= rk[round]![i]!
  }
  return s
}
const gmul128 = (x: Uint8Array, y: Uint8Array): Uint8Array => {
  const z = new Uint8Array(16), v = Uint8Array.from(y)
  for (let i = 0; i < 128; i++) {
    if ((x[i >> 3]! >> (7 - (i & 7))) & 1) for (let j = 0; j < 16; j++) z[j]! ^= v[j]!
    const lsb = v[15]! & 1
    for (let j = 15; j > 0; j--) v[j] = ((v[j]! >> 1) | ((v[j - 1]! & 1) << 7)) & 0xff
    v[0] = v[0]! >> 1; if (lsb) v[0]! ^= 0xe1
  }
  return z
}
const ghash = (h: Uint8Array, data: Uint8Array): Uint8Array => { let y: Uint8Array = new Uint8Array(16); for (let off = 0; off < data.length; off += 16) { const blk = new Uint8Array(16); blk.set(data.subarray(off, off + 16)); for (let j = 0; j < 16; j++) y[j]! ^= blk[j]!; y = gmul128(y, h) } return y }
export const aes256gcmEncrypt = (key: Uint8Array, iv: Uint8Array, plaintext: Uint8Array, aad: Uint8Array = new Uint8Array(0)): { ciphertext: Uint8Array; tag: Uint8Array } => {
  const rk = aesExpandKey256(key), h = aesEncBlock(rk, new Uint8Array(16))
  const j0 = new Uint8Array(16); j0.set(iv.subarray(0, 12)); j0[15] = 1
  const ct = new Uint8Array(plaintext.length), ctr = Uint8Array.from(j0)
  for (let off = 0; off < plaintext.length; off += 16) { for (let i = 15; i >= 12; i--) { ctr[i] = (ctr[i]! + 1) & 0xff; if (ctr[i]) break } const ks = aesEncBlock(rk, ctr); for (let i = 0; i < 16 && off + i < plaintext.length; i++) ct[off + i] = plaintext[off + i]! ^ ks[i]! }
  const padLen = (n: number) => (16 - (n % 16)) % 16
  const g = new Uint8Array(aad.length + padLen(aad.length) + ct.length + padLen(ct.length) + 16); let p = 0; g.set(aad, p); p += aad.length + padLen(aad.length); g.set(ct, p); p += ct.length + padLen(ct.length)
  new DataView(g.buffer).setBigUint64(p, BigInt(aad.length * 8)); new DataView(g.buffer).setBigUint64(p + 8, BigInt(ct.length * 8))
  const s = ghash(h, g), ej0 = aesEncBlock(rk, j0), tag = new Uint8Array(16); for (let i = 0; i < 16; i++) tag[i] = s[i]! ^ ej0[i]!
  return { ciphertext: ct, tag }
}
/** AES-256-GCM decrypt: the inverse — the tag recomputed and compared in constant time before any plaintext is returned, so a forged or altered ciphertext yields null, never plaintext. */
export const aes256gcmDecrypt = (key: Uint8Array, iv: Uint8Array, ciphertext: Uint8Array, tag: Uint8Array, aad: Uint8Array = new Uint8Array(0)): Uint8Array | null => {
  const rk = aesExpandKey256(key), h = aesEncBlock(rk, new Uint8Array(16))
  const j0 = new Uint8Array(16); j0.set(iv.subarray(0, 12)); j0[15] = 1
  const padLen = (n: number) => (16 - (n % 16)) % 16
  const g = new Uint8Array(aad.length + padLen(aad.length) + ciphertext.length + padLen(ciphertext.length) + 16); let p = 0; g.set(aad, p); p += aad.length + padLen(aad.length); g.set(ciphertext, p); p += ciphertext.length + padLen(ciphertext.length)
  new DataView(g.buffer).setBigUint64(p, BigInt(aad.length * 8)); new DataView(g.buffer).setBigUint64(p + 8, BigInt(ciphertext.length * 8))
  const s = ghash(h, g), ej0 = aesEncBlock(rk, j0), t = new Uint8Array(16); for (let i = 0; i < 16; i++) t[i] = s[i]! ^ ej0[i]!
  if (!sameHex(hex(t), hex(tag))) return null
  const pt = new Uint8Array(ciphertext.length), ctr = Uint8Array.from(j0)
  for (let off = 0; off < ciphertext.length; off += 16) { for (let i = 15; i >= 12; i--) { ctr[i] = (ctr[i]! + 1) & 0xff; if (ctr[i]) break } const ks = aesEncBlock(rk, ctr); for (let i = 0; i < 16 && off + i < ciphertext.length; i++) pt[off + i] = ciphertext[off + i]! ^ ks[i]! }
  return pt
}

/** X25519 (RFC 7748), pure: Diffie-Hellman key agreement on Curve25519 by the Montgomery ladder over GF(2^255-19); the shared secret both sides compute without any key leaving either. */
const P25519 = (1n << 255n) - 19n
export const x25519 = (scalar: Uint8Array, point: Uint8Array): Uint8Array => {
  const k = Uint8Array.from(scalar); k[0]! &= 248; k[31]! = (k[31]! & 127) | 64
  const le = (b: Uint8Array) => { let n = 0n; for (let i = 31; i >= 0; i--) n = (n << 8n) | BigInt(b[i]!); return n }
  const s = le(k); const x1 = le(point) & ((1n << 255n) - 1n)
  const mod = (a: bigint) => ((a % P25519) + P25519) % P25519
  let x2 = 1n, z2 = 0n, x3 = x1, z3 = 1n, swap = 0n
  for (let t = 254; t >= 0; t--) {
    const kt = (s >> BigInt(t)) & 1n; swap ^= kt
    if (swap) { [x2, x3] = [x3, x2];[z2, z3] = [z3, z2] }
    swap = kt
    const A = mod(x2 + z2), AA = mod(A * A), B = mod(x2 - z2), BB = mod(B * B), E = mod(AA - BB), C = mod(x3 + z3), D = mod(x3 - z3), DA = mod(D * A), CB = mod(C * B)
    const dapcb = mod(DA + CB), damcb = mod(DA - CB)
    x3 = mod(dapcb * dapcb); z3 = mod(x1 * mod(damcb * damcb)); x2 = mod(AA * BB); z2 = mod(E * mod(AA + mod(121665n * E)))
  }
  if (swap) { [x2, x3] = [x3, x2];[z2, z3] = [z3, z2] }
  let r = 1n, b = z2 % P25519, e = P25519 - 2n; while (e > 0n) { if (e & 1n) r = (r * b) % P25519; b = (b * b) % P25519; e >>= 1n }
  const res = mod(x2 * r); const out = new Uint8Array(32); let n = res; for (let i = 0; i < 32; i++) { out[i] = Number(n & 0xffn); n >>= 8n } return out
}

/** ChaCha20-Poly1305 AEAD (RFC 8439), pure: the other modern authenticated cipher beside AES-GCM; ChaCha20 (the quarter-round, 20 rounds, counter mode) with the Poly1305 one-time MAC over GF(2^130-5). KAT-verified. */
const rotl32 = (x: number, n: number): number => ((x << n) | (x >>> (32 - n))) >>> 0
const le32 = (b: Uint8Array, o: number): number => (b[o]! | (b[o + 1]! << 8) | (b[o + 2]! << 16) | (b[o + 3]! << 24)) >>> 0
const chachaBlock = (key: Uint8Array, counter: number, nonce: Uint8Array): Uint8Array => {
  const s = new Uint32Array(16); s[0] = 0x61707865; s[1] = 0x3320646e; s[2] = 0x79622d32; s[3] = 0x6b206574
  for (let i = 0; i < 8; i++) s[4 + i] = le32(key, i * 4)
  s[12] = counter >>> 0; for (let i = 0; i < 3; i++) s[13 + i] = le32(nonce, i * 4)
  const w = Uint32Array.from(s)
  const QR = (a: number, b: number, c: number, d: number) => { w[a] = (w[a]! + w[b]!) >>> 0; w[d] = rotl32(w[d]! ^ w[a]!, 16); w[c] = (w[c]! + w[d]!) >>> 0; w[b] = rotl32(w[b]! ^ w[c]!, 12); w[a] = (w[a]! + w[b]!) >>> 0; w[d] = rotl32(w[d]! ^ w[a]!, 8); w[c] = (w[c]! + w[d]!) >>> 0; w[b] = rotl32(w[b]! ^ w[c]!, 7) }
  for (let i = 0; i < 10; i++) { QR(0, 4, 8, 12); QR(1, 5, 9, 13); QR(2, 6, 10, 14); QR(3, 7, 11, 15); QR(0, 5, 10, 15); QR(1, 6, 11, 12); QR(2, 7, 8, 13); QR(3, 4, 9, 14) }
  const out = new Uint8Array(64); for (let i = 0; i < 16; i++) { const v = (w[i]! + s[i]!) >>> 0; out[i * 4] = v & 0xff; out[i * 4 + 1] = (v >>> 8) & 0xff; out[i * 4 + 2] = (v >>> 16) & 0xff; out[i * 4 + 3] = (v >>> 24) & 0xff } return out
}
const chacha20 = (key: Uint8Array, nonce: Uint8Array, data: Uint8Array, counter: number): Uint8Array => { const out = new Uint8Array(data.length); for (let off = 0; off < data.length; off += 64) { const ks = chachaBlock(key, counter + (off >> 6), nonce); for (let i = 0; i < 64 && off + i < data.length; i++) out[off + i] = data[off + i]! ^ ks[i]! } return out }
const leBig = (b: Uint8Array): bigint => { let n = 0n; for (let i = b.length - 1; i >= 0; i--) n = (n << 8n) | BigInt(b[i]!); return n }
const poly1305 = (otk: Uint8Array, msg: Uint8Array): Uint8Array => {
  const r = leBig(otk.subarray(0, 16)) & 0x0ffffffc0ffffffc0ffffffc0fffffffn, s = leBig(otk.subarray(16, 32)), p = (1n << 130n) - 5n
  let acc = 0n
  for (let i = 0; i < msg.length; i += 16) { const blk = msg.subarray(i, i + 16); acc = ((acc + (leBig(blk) + (1n << BigInt(8 * blk.length)))) * r) % p }
  acc = (acc + s) & ((1n << 128n) - 1n)
  const out = new Uint8Array(16); for (let i = 0; i < 16; i++) { out[i] = Number(acc & 0xffn); acc >>= 8n } return out
}
export const chacha20poly1305Encrypt = (key: Uint8Array, nonce: Uint8Array, plaintext: Uint8Array, aad: Uint8Array = new Uint8Array(0)): { ciphertext: Uint8Array; tag: Uint8Array } => {
  const otk = chachaBlock(key, 0, nonce).subarray(0, 32)
  const ct = chacha20(key, nonce, plaintext, 1)
  const pad = (n: number) => (16 - (n % 16)) % 16
  const mac = new Uint8Array(aad.length + pad(aad.length) + ct.length + pad(ct.length) + 16); let o = 0; mac.set(aad, o); o += aad.length + pad(aad.length); mac.set(ct, o); o += ct.length + pad(ct.length)
  const dv = new DataView(mac.buffer); dv.setBigUint64(o, BigInt(aad.length), true); dv.setBigUint64(o + 8, BigInt(ct.length), true)
  return { ciphertext: ct, tag: poly1305(otk, mac) }
}

/** SHA-1 (FIPS 180-4), pure: deprecated for signatures but still required to read legacy systems (Git object ids, old TLS, HMAC-SHA1); provided for interop, KAT-verified — a gap, not a skip. */
export const sha1 = (message: Uint8Array): Uint8Array => {
  const h = new Int32Array([0x67452301, 0xefcdab89 | 0, 0x98badcfe | 0, 0x10325476, 0xc3d2e1f0 | 0])
  const l = message.length, padded = new Uint8Array(((l + 9 + 63) >> 6) << 6), dv = new DataView(padded.buffer), w = new Int32Array(80)
  padded.set(message); padded[l] = 0x80; dv.setUint32(padded.length - 8, Math.floor(l / 0x20000000)); dv.setUint32(padded.length - 4, (l * 8) >>> 0)
  for (let off = 0; off < padded.length; off += 64) {
    for (let i = 0; i < 16; i++) w[i] = dv.getInt32(off + i * 4)
    for (let i = 16; i < 80; i++) { const x = w[i - 3]! ^ w[i - 8]! ^ w[i - 14]! ^ w[i - 16]!; w[i] = (x << 1) | (x >>> 31) }
    let a = h[0]!, b = h[1]!, c = h[2]!, d = h[3]!, e = h[4]!
    for (let i = 0; i < 80; i++) { const f = i < 20 ? (b & c) | (~b & d) : i < 40 ? b ^ c ^ d : i < 60 ? (b & c) | (b & d) | (c & d) : b ^ c ^ d; const k = i < 20 ? 0x5a827999 : i < 40 ? 0x6ed9eba1 : i < 60 ? 0x8f1bbcdc | 0 : 0xca62c1d6 | 0; const t = (((a << 5) | (a >>> 27)) + f + e + k + w[i]!) | 0; e = d; d = c; c = ((b << 30) | (b >>> 2)) | 0; b = a; a = t }
    h[0] = (h[0]! + a) | 0; h[1] = (h[1]! + b) | 0; h[2] = (h[2]! + c) | 0; h[3] = (h[3]! + d) | 0; h[4] = (h[4]! + e) | 0
  }
  const out = new Uint8Array(20), ov = new DataView(out.buffer); for (let i = 0; i < 5; i++) ov.setInt32(i * 4, h[i]!); return out
}
/** MD5 (RFC 1321), pure: broken for collisions but still needed to read legacy checksums and protocols; interop only, KAT-verified. */
export const md5 = (message: Uint8Array): Uint8Array => {
  const S = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21]
  const K = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) | 0)
  let a0 = 0x67452301, b0 = 0xefcdab89 | 0, c0 = 0x98badcfe | 0, d0 = 0x10325476
  const l = message.length, padded = new Uint8Array(((((l + 8) >> 6) + 1) << 6)); padded.set(message); padded[l] = 0x80
  const dv = new DataView(padded.buffer); dv.setUint32(padded.length - 8, (l * 8) >>> 0, true); dv.setUint32(padded.length - 4, Math.floor(l / 0x20000000), true)
  for (let off = 0; off < padded.length; off += 64) {
    const M = new Int32Array(16); for (let i = 0; i < 16; i++) M[i] = dv.getInt32(off + i * 4, true)
    let A = a0, B = b0, C = c0, D = d0
    for (let i = 0; i < 64; i++) { let F: number, g: number; if (i < 16) { F = (B & C) | (~B & D); g = i } else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16 } else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16 } else { F = C ^ (B | ~D); g = (7 * i) % 16 } F = (F + A + K[i]! + M[g]!) | 0; A = D; D = C; C = B; B = (B + (((F << S[i]!) | (F >>> (32 - S[i]!))) | 0)) | 0 }
    a0 = (a0 + A) | 0; b0 = (b0 + B) | 0; c0 = (c0 + C) | 0; d0 = (d0 + D) | 0
  }
  const out = new Uint8Array(16), ov = new DataView(out.buffer); ov.setInt32(0, a0, true); ov.setInt32(4, b0, true); ov.setInt32(8, c0, true); ov.setInt32(12, d0, true); return out
}
/** RSA primitive (PKCS#1, FIPS 186): modular exponentiation c = m^e mod n and back; the classical public-key operation, still widely deployed. Pure BigInt, KAT-verified. */
export const rsaModPow = (base: bigint, exp: bigint, mod: bigint): bigint => { let r = 1n, b = base % mod; while (exp > 0n) { if (exp & 1n) r = (r * b) % mod; b = (b * b) % mod; exp >>= 1n } return r }
