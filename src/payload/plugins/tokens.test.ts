import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  onlineModeOf,
  redactSecretsOf,
  sealPayloadOf,
  secretsInOf,
  tokenUsageOf,
  waitsAuditOf,
} from './tokens.js'
import { qpuMcpToolsListOf } from '../../quantum/processing/unit/index.js'
import '../../mcp/families.js'

test('seal: Bearer / apiKey / sk- never echoed', () => {
  const dirty = {
    authorization: 'Bearer FAKESECRET_w3x4y5z6a7b8c9d0e1f2',
    apiKey: 'sk-abcdefghijklmnopqrstuvwxyz012345',
    note: 'ok',
    nested: { password: 'hunter2', hex: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee' },
  }
  const sealed = sealPayloadOf(dirty) as typeof dirty
  assert.equal(sealed.authorization, '[redacted]')
  assert.equal(sealed.apiKey, '[redacted]')
  assert.equal((sealed.nested as { password: string }).password, '[redacted]')
  assert.equal((sealed.nested as { hex: string }).hex, 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee')
  assert.equal(sealed.note, 'ok')
  assert.equal(secretsInOf(JSON.stringify(sealed)), false)
  assert.ok(secretsInOf('Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.xxx.yyy'))
})

test('tokenUsageOf names identifiable target + access.token + text.tokens', () => {
  const u = tokenUsageOf(
    { who: 'connector.observe', door: 'connector', tool: 'observe', panel: 'ObservePanel' },
    { holds: true },
  )
  assert.equal(u.target.who, 'connector.observe')
  assert.equal(u.target.door, 'connector')
  assert.equal(u.target.panel, 'ObservePanel')
  assert.equal(u.accessToken.address, 'access.token')
  assert.equal(u.accessToken.holds, true)
  assert.equal(u.textTokens.address, 'text.tokens')
  assert.ok(u.bytes > 0)
  assert.ok(u.llmTokens >= 0)
  assert.equal(u.sealed, true)
})

test('waits audit sorted by cost; connect bill ≤16', () => {
  const w = waitsAuditOf()
  assert.equal(w.kind, 'waits')
  assert.ok(Array.isArray(w.rows) && w.rows.length >= 5)
  for (let i = 1; i < w.rows.length; i++) {
    assert.ok(w.rows[i - 1]!.ms >= w.rows[i]!.ms, 'sorted by ms desc')
  }
  const tools = qpuMcpToolsListOf()
  assert.ok(tools.length <= 16)
  assert.equal(w.connectBill.holds, true)
})

test('onlineModeOf offline matrix holds; secrets sealed', async () => {
  const r = await onlineModeOf({ offline: true })
  assert.equal(r.kind, 'online-mode')
  assert.equal(r.call, 'tools/call connector { offline: true }')
  assert.ok(r.matrix.every((c: { mode: string }) => c.mode === 'offline'))
  assert.ok(r.counts.offlinePass === r.counts.offline)
  assert.equal(r.tokenSeal.sealed, true)
  assert.equal(r.holds, true)
  assert.equal(r.goal, 'OPEN')
  assert.ok(r.usage.every((u: { target: { who: string } }) => typeof u.target.who === 'string'))
  assert.equal(secretsInOf(JSON.stringify(r)), false)
})

test('redactSecretsOf leaves public crypto imprint fields', () => {
  const imprint = { digest: 'abc', signature: 'def', publicKey: 'ghi', hmac: 'jkl' }
  assert.deepEqual(redactSecretsOf(imprint), imprint)
})
