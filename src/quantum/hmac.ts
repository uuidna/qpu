// SHA-256 and HMAC-SHA256 as pure functions over bytes, so the handler verifies a Stripe signature without the host's crypto
// and the same code runs in a test, a Worker and a browser. FIPS 180-4; RFC 2104.
const K = Int32Array.of(0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2)
const rotr = (x: number, n: number) => (x >>> n) | (x << (32 - n))
const ENCODER = new TextEncoder()
export const utf8 = (s: string): Uint8Array => ENCODER.encode(s)
export const hex = (b: Uint8Array): string => [...b].map((x) => x.toString(16).padStart(2, '0')).join('')

/** SHA-256 of bytes (FIPS 180-4). O(n), all int32: Int32Arrays wrap mod 2^32 on store, so no word becomes a double. */
export const sha256 = (message: Uint8Array): Uint8Array => {
  const h = Int32Array.of(0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19)
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
const K512 = ['428a2f98d728ae22', '7137449123ef65cd', 'b5c0fbcfec4d3b2f', 'e9b5dba58189dbbc', '3956c25bf348b538', '59f111f1b605d019', '923f82a4af194f9b', 'ab1c5ed5da6d8118', 'd807aa98a3030242', '12835b0145706fbe', '243185be4ee4b28c', '550c7dc3d5ffb4e2', '72be5d74f27b896f', '80deb1fe3b1696b1', '9bdc06a725c71235', 'c19bf174cf692694', 'e49b69c19ef14ad2', 'efbe4786384f25e3', '0fc19dc68b8cd5b5', '240ca1cc77ac9c65', '2de92c6f592b0275', '4a7484aa6ea6e483', '5cb0a9dcbd41fbd4', '76f988da831153b5', '983e5152ee66dfab', 'a831c66d2db43210', 'b00327c898fb213f', 'bf597fc7beef0ee4', 'c6e00bf33da88fc2', 'd5a79147930aa725', '06ca6351e003826f', '142929670a0e6e70', '27b70a8546d22ffc', '2e1b21385c26c926', '4d2c6dfc5ac42aed', '53380d139d95b3df', '650a73548baf63de', '766a0abb3c77b2a8', '81c2c92e47edaee6', '92722c851482353b', 'a2bfe8a14cf10364', 'a81a664bbc423001', 'c24b8b70d0f89791', 'c76c51a30654be30', 'd192e819d6ef5218', 'd69906245565a910', 'f40e35855771202a', '106aa07032bbd1b8', '19a4c116b8d2d0c8', '1e376c085141ab53', '2748774cdf8eeb99', '34b0bcb5e19b48a8', '391c0cb3c5c95a63', '4ed8aa4ae3418acb', '5b9cca4f7763e373', '682e6ff3d6b2b8a3', '748f82ee5defb2fc', '78a5636f43172f60', '84c87814a1f0ab72', '8cc702081a6439ec', '90befffa23631e28', 'a4506cebde82bde9', 'bef9a3f7b2c67915', 'c67178f2e372532b', 'ca273eceea26619c', 'd186b8c721c0c207', 'eada7dd6cde0eb1e', 'f57d4f7fee6ed178', '06f067aa72176fba', '0a637dc5a2c898a6', '113f9804bef90dae', '1b710b35131c471b', '28db77f523047d84', '32caab7b40c72493', '3c9ebe0a15c9bebc', '431d67c49c100d4c', '4cc5d4becb3e42b6', '597f299cfc657e2a', '5fcb6fab3ad6faec', '6c44198c4a475817'].map((h) => BigInt('0x' + h))
const M64 = (1n << 64n) - 1n
const rotr64 = (x: bigint, n: bigint): bigint => ((x >> n) | (x << (64n - n))) & M64
export const sha512 = (message: Uint8Array): Uint8Array => {
  const H = ['6a09e667f3bcc908', 'bb67ae8584caa73b', '3c6ef372fe94f82b', 'a54ff53a5f1d36f1', '510e527fade682d1', '9b05688c2b3e6c1f', '1f83d9abfb41bd6b', '5be0cd19137e2179'].map((h) => BigInt('0x' + h))
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
