import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import { roleMacOf, signedRoleOf } from './roles.ts'

// kept a test: verifying a role claim takes the deployment's secret, and no door may take a secret over MCP (a client would send it to a public server)
test('a signed role claim is the HMAC node computes, and only a signed claim counts', () => {
  const secret = 'test-secret-not-a-real-one'
  const mac = roleMacOf(secret, 'admin', 'qpu', 'delete')
  assert.equal(mac, createHmac('sha256', secret).update('admin|qpu|DELETE').digest('hex'))
  assert.equal(signedRoleOf({ role: 'admin', tenant: 'qpu', mac, method: 'DELETE' }, secret), 'admin')
  assert.equal(signedRoleOf({ role: 'admin', tenant: 'qpu', mac: null, method: 'DELETE' }, secret), null, 'a bare header is no claim')
  assert.equal(signedRoleOf({ role: 'admin', tenant: 'qpu', mac, method: 'POST' }, secret), null, 'a claim signed for one method does not carry to another')
  assert.equal(signedRoleOf({ role: 'admin', tenant: 'other', mac, method: 'DELETE' }, secret), null, 'nor to another tenant')
  assert.equal(signedRoleOf({ role: 'admin', tenant: 'qpu', mac, method: 'DELETE' }, null), null, 'without the secret configured no claim is honoured')
  assert.equal(signedRoleOf({ role: 'root', tenant: 'qpu', mac: roleMacOf(secret, 'root', 'qpu', 'DELETE'), method: 'DELETE' }, secret), null, 'only the three roles')
})
