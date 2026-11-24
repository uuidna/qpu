// Agents on the QPU: an agent's own usage report with its ledger of time and space, many agents coordinated on one list, and the bound on
// the answers a process remembers.
import test from 'node:test'
import assert from 'node:assert/strict'
import { call } from './mcp.ts'
import { ANSWER_MEMORY_BYTES } from './config-index.ts'
import { LICENSE } from './unit/license.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: an agent's report debits what it computed and credits what an address would have served, with the licence's terms beside it. */
test('an agent\'s report debits what it computed and credits what an address would have served, with the licence\'s terms beside it', () => {
  const calls = [
    { tool: 'fold', arguments: { qubits: 4 }, tokens: 500, bytes: 9000, ms: 12 },
    { tool: 'fold', arguments: { qubits: 4 }, tokens: 500, bytes: 9000, ms: 12 },
    { tool: 'fold', arguments: { qubits: 4 }, tokens: 500, bytes: 9000, ms: 12 },
    { tool: 'metrics', arguments: {}, tokens: 17000, bytes: 70000, ms: 16 },
  ]
  const r = call('shard', { usage: { calls } }).result!.structuredContent
  assert.deepEqual([r.phase, r.calls, r.distinct, r.again, r.kept], ['usage', 4, 2, 2, false])
  const line = (account: string) => r.ledger.find((l: { account: string }) => l.account === account)
  assert.deepEqual([line('time').debit, line('time').credit, line('space').debit, line('space').credit, line('context').credit], [28, 24, 79000, 18000, 1000])
  assert.equal(line('time').reusable, 24 / 52)
  assert.deepEqual(r.repeats.map((x: { tool: string; times: number }) => [x.tool, x.times]), [['fold', 3]])
  assert.deepEqual(r.byTool.map((t: { tool: string; commercial: string }) => [t.tool, t.commercial]), [['metrics', 'a licence of the catalogue'], ['fold', 'free under attribution']])
  assert.deepEqual([r.licence.attribution, r.licence.terms, r.licence.spdx], [LICENSE.attribution, LICENSE.terms, LICENSE.spdx])
  // the keys of a call's arguments in any order are one call, as the kernel addresses it
  assert.equal(call('shard', { usage: { calls: [{ tool: 'seal', arguments: { text: 'a', brief: true } }, { tool: 'seal', arguments: { brief: true, text: 'a' } }] } }).result!.structuredContent.again, 1)
  assert.match(call('shard', { usage: { calls: [{ ms: 1 }] } }).error!.message, /usage takes \{ calls \}/)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: hundreds of agents on one list each have their own address and share, every item has exactly one agent, and a room is named only by their secret. */
test('hundreds of agents on one list each have their own address and share, every item has exactly one agent, and a room is named only by their secret', () => {
  const list = Array.from({ length: 5000 }, (_, k) => `task-${k}`)
  const r = call('shard', { list, agents: 300 }).result!.structuredContent
  assert.deepEqual([r.phase, r.agents, r.items, r.covered, r.largest, r.smallest, 'room' in r], ['coordinate', 300, 5000, true, 17, 16, false])
  const seen = new Map<string, number>()
  for (const row of r.rows) for (const item of row.shareList) seen.set(item, (seen.get(item) ?? 0) + 1)
  assert.deepEqual([seen.size, [...seen.values()].every((n) => n === 1), new Set(r.rows.map((x: { address: string }) => x.address)).size], [5000, true, 300])
  // agent i holds the positions i modulo the count, the share the shard door answers for that index
  const one = call('shard', { list, index: 7, count: 300 }).result!.structuredContent
  assert.deepEqual(r.rows[7].shareList, one.shareList)
  assert.deepEqual([r.capacity.free, r.capacity.full, r.capacity.gate, r.capacity.most], [122, true, true, 4096])
  const secret = call('shard', { list, agents: 300, secret: 'only we know' }).result!.structuredContent, other = call('shard', { list, agents: 300, secret: 'someone else' }).result!.structuredContent
  assert.match(secret.room.id, /^[0-9a-f]{64}$/)
  assert.notEqual(secret.room.id, other.room.id)
  assert.equal(secret.room.names.length, 300)
  for (const bad of [0, 4097, 1.5, 'many']) assert.match(call('shard', { list, agents: bad }).error!.message, /whole number from 1 to 4096/)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the answers a process remembers are bounded in bytes, and metrics states the bound and what is held. */
test('the answers a process remembers are bounded in bytes, and metrics states the bound and what is held', () => {
  for (let k = 0; k < 40; k++) call('seal', { text: `bounded-${k}`, brief: true })
  const m = call('metrics', {}).result!.structuredContent
  assert.deepEqual([m.balancerBound, ANSWER_MEMORY_BYTES], [67108864, 67108864])
  assert.ok(m.balancerBytes > 0 && m.balancerBytes <= m.balancerBound, `${m.balancerBytes}`)
  assert.ok(m.balancer >= 40 && Number.isInteger(m.balancerForgotten))
  // an answer asked again is still served from memory: between two readings of metrics, itself never remembered, nothing else is computed
  const before = call('metrics', {}).result!.structuredContent.toolMisses
  call('seal', { text: 'bounded-0', brief: true })
  assert.equal(call('metrics', {}).result!.structuredContent.toolMisses - before, 1)
})
