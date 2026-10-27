// SHA-256 and HMAC-SHA256 as pure functions over bytes, so the handler verifies a Stripe signature without the host's crypto
// and the same code runs in a test, a Worker and a browser. FIPS 180-4; RFC 2104.
/** FIPS 180-4 §4.2.2-3 and §5.3.3-5: the constants are the first 64 bits of the fractional parts of the cube roots of the first 80 primes, the
 *  initial hash those of the square roots of the first 8; SHA-256 keeps the first 64 constants and the first 32 bits of each; derived, never copied */
const PRIMES: number[] = []; for (let n = 2; PRIMES.length < 80; n++) if (PRIMES.every((p) => n % p)) PRIMES.push(n)
const rootOf = (x: bigint, k: bigint) => { let r = 1n << BigInt(Math.ceil(x.toString(2).length / Number(k))), y; while ((y = ((k - 1n) * r + x / r ** (k - 1n)) / k) < r) r = y; return r }
const M64 = (1n << 64n) - 1n, K512 = PRIMES.map((p) => rootOf(BigInt(p) << 192n, 3n) & M64), H512 = PRIMES.slice(0, 8).map((p) => rootOf(BigInt(p) << 128n, 2n) & M64)
const K = Int32Array.from(K512.slice(0, 64), (x) => Number(x >> 32n))
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
