/**
 * SPLIT TO STAY WITHIN LIMITS, AND STILL COMPUTE IN FULL. One sweep over every family is the lattice squared — it
 * exhausts the worker (Cloudflare 1102) and stalls locally. So discovery takes a family slice per call, and the caller
 * merges the slices back with qpuDiscoverMergeOf: a value's ways are unioned by hex, every cross recomputed over the
 * union. This holds the invariant that the split is LOSSLESS — the merged slices find exactly the relations, runs and
 * seals one monolithic sweep would have found. No skips, no caps raised; the whole lattice, in slices.
 */
import test from 'node:test'
import assert from 'node:assert/strict'

test('discovery splits into family slices and merges back in full — the same relations, runs and seals as one sweep', async (t) => {
  await import('../dist/mcp/families.js')
  const { qpuDiscoverOf, qpuDiscoverMergeOf } = await import('../dist/mcp/discovery.js')
  const live = [7, 13, 14, 91]
  const N = 40 // a bounded prefix of the family surface: enough to find crosses, fast enough for the gate
  const whole = await qpuDiscoverOf(live, { from: 0, count: N })
  const parts = []
  for (let i = 0; i < N; i += 10) parts.push(await qpuDiscoverOf(live, { from: i, count: 10 }))
  const merged = qpuDiscoverMergeOf(parts)
  const sig = (d) => JSON.stringify(d.relations.map((r) => [r.value, r.families, r.live]))
  assert.equal(merged.relations.length, whole.relations.length, 'the same number of cross-formulated relations')
  assert.equal(sig(merged), sig(whole), 'the exact same relations (value, families, live) in the same order')
  assert.equal(merged.runs, whole.runs, 'the same number of runs — no formula skipped, none run twice')
  assert.equal(JSON.stringify(merged.families), JSON.stringify(whole.families), 'the same families')
  assert.equal(merged.seals.length, whole.seals.length, 'the same seals (fixed points, involutions, inverse pairs)')
  assert.ok(whole.relations.length > 0, 'the prefix actually reaches crosses, so the equality means something')
  t.diagnostic(`${parts.length} slices of 10 families merged === one sweep of ${N}: ${whole.relations.length} relations, ${whole.runs} runs, ${whole.seals.length} seals — split, in full`)
})
