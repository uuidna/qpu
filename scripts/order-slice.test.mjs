/**
 * ORDER-FINDING IS A SPLIT, NOT A CAP. The multiplicative order a Shor factorisation needs is walked in hexbit-wide
 * slices (qpuOrderSliceOf): each slice carries its running power out, the caller caches it in that slice's hex folder
 * and resumes at `next`, so live memory is O(1) and the reach has no ceiling — a slice at a time, for any order. The
 * factors fall out of the recovered order (gcd(base^(r/2) ± 1, n)), and the slice cache is cleaned up at the end.
 * Needs dist — run `npm run build` first. Discovered by the scripts/*.test.mjs glob, run in CI.
 */
import test from 'node:test'
import assert from 'node:assert/strict'

const idx = await import('../dist/quantum/processing/unit/index.js')

const modpow = (b, e, m) => { let r = 1n; b %= m; while (e > 0n) { if (e & 1n) r = (r * b) % m; b = (b * b) % m; e >>= 1n } return r }
const gcd = (a, b) => { while (b) { [a, b] = [b, a % b] } return a < 0n ? -a : a }

test('order-finding splits into hexbit folders, caches each slice, factors from the order, and cleans up at the end', () => {
  const base = 8n
  const modulus = 8051n // 83 × 97
  const cache = new Map() // hex folder → base^from — the split's only state, nothing else held
  let from = 0
  let cur = 1n
  let order = null
  let guard = 0
  cache.set(from.toString(16), cur)
  while (order === null && guard++ < 1_000_000) {
    const s = idx.qpuOrderSliceOf(base, modulus, from, cur)
    if (s.order !== null) { order = s.order; break }
    from = s.next
    cur = s.cur
    cache.set(from.toString(16), cur) // cache this slice's carried power, hex-addressed
  }
  assert.equal(order, 656, 'the exact multiplicative order, recovered across hexbit slices')
  assert.ok(cache.size > 1, 'the walk really spanned more than one hexbit folder (a true split)')

  // the factors fall out of the recovered order — Shor: gcd(base^(r/2) ± 1, n)
  assert.equal(order % 2, 0, 'an even order factors directly')
  const half = modpow(base, BigInt(order / 2), modulus)
  const p = gcd(half - 1n, modulus)
  const q = gcd(half + 1n, modulus)
  assert.deepEqual([Number(p), Number(q)].sort((a, b) => a - b), [83, 97], 'the sliced order factors 8051 = 83 × 97')

  // cleanup at the end
  cache.clear()
  assert.equal(cache.size, 0, 'the slice cache is cleaned up at the end of the test')
})
