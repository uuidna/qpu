// Order-finding completed over the UUID quantum space and the RAID controller: baby-step giant-step over a content-addressed power table finds the least
// r with a^r ≡ 1 mod N, in O(√r). These tests lock its correctness (the true least order, not a multiple), the end-to-end factor-find where σ-reflection
// cannot reach, and the honest bound at scale — order-finding at RSA scale stays bounded, never guessed.
import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { orderFinding, shorReduction } from './algorithms.ts'
import { callOf } from './mcp.ts'

const factor = (args: Record<string, unknown>) => {
  const r = callOf('algorithm', args) as { result?: { structuredContent?: Record<string, unknown> }; error?: { message: string } }
  if (r.error) throw new Error(r.error.message)
  return r.result!.structuredContent as Record<string, unknown>
}

test('orderFinding returns the least order, verified (not merely a multiple)', () => {
  for (const [a, N, ord] of [[7n, 15n, 4n], [2n, 21n, 6n], [8n, 91n, 4n], [2n, 91n, 12n], [7n, 143n, 60n]] as const) {
    const o = orderFinding(a, N)
    assert.equal(o.order, ord.toString(), `ord(${a}, ${N})`)
    assert.equal(o.verified, true)
    assert.equal((a ** ord) % N, 1n % N) // the found order really closes the cycle
  }
})

test('order-finding plus Shor reduction factors a semiprime σ-reflection cannot split (both primes above 2^16)', () => {
  const N = 65537n * 178481n // distant primes; reflection leaves it, order-finding reaches it (order 736 within budget)
  const o = orderFinding(2n, N)
  assert.equal(o.found, true)
  assert.equal(o.order, '736')
  const red = shorReduction(N, 2n, BigInt(o.order!))
  assert.deepEqual(red.factors?.map(String).sort(), ['178481', '65537'])
  assert.equal(red.verified, true)
})

test('the order door and factor find complete over the UUID/RAID space through the tool', () => {
  const od = factor({ name: 'order', N: '143', a: '7' })
  assert.equal(od.order, '60')
  assert.equal(od.found, true)
  assert.ok((od.table as string).includes('content-addressed'))
  const fd = factor({ name: 'factor', integer: (65537n * 178481n).toString(), a: '2', find: true })
  assert.equal(fd.mode, 'find')
  assert.equal(fd.sha256, createHash('sha256').update(JSON.stringify({ decode: fd.integer, factors: fd.factors, via: 'order' })).digest('hex'))
  assert.equal(fd.order, '736')
  assert.deepEqual((fd.factors as string[]).sort(), ['178481', '65537'])
})

test('order-finding at RSA scale is bounded, never guessed', () => {
  // the committed 1000-bit RSA-class test integer: the order is far beyond any feasible budget, so it bounds honestly (no order, no fabrication)
  const N = 7778374705630928901426385188295261064472293439767584450564762904780095317247810822721038446598127186814085438745846911396600071001374809981225413367649417301928427872874705586838153932355802114527488924178998304307438276447053410282371888984822745504021147881223973035161036008037727897669611699130903n
  const o = orderFinding(2n, N, 1n << 16n)
  assert.equal(o.found, false)
  assert.equal(o.order, null)
  assert.match(o.via, /bounded/)
})
