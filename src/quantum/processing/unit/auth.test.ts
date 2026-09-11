import { test } from './receipted.js'
import assert from 'node:assert/strict'
import worker, { qpuMcpCallOf, qpuStorageOf, qpuStorageWriteAllowedOf } from './index.js'

// WRITE AUTH, FAIL CLOSED. Measured 2026-09-11 by a peer session: OPTIONS /storage advertised PUT and DELETE to every
// origin and the handler honoured them unauthenticated. Reads stay open. Writes need Authorization: Bearer
// QPU_WRITE_TOKEN; an unbound token refuses every write, so a replica deployed without the secret is read-only.
const host = 'qpu.uuidna.com'
const origin = `https://${host}`
const token = 'qpu-test-write-token'
const bound = { QPU_HOST: host, QPU_WRITE_TOKEN: token }
const unbound = { QPU_HOST: host }
const body = JSON.stringify({ kind: 'notes', n: 1 })
const fetchOf = (env: Record<string, string>, path: string, init: RequestInit = {}) =>
  worker.fetch(new Request(`${origin}${path}`, { ...init, headers: { accept: 'text/html', ...(init.headers as Record<string, string> | undefined) } }), env)

test('storage writes are refused without the bearer, with a wrong bearer, and when no token is bound', async () => {
  assert.equal(qpuStorageWriteAllowedOf(bound, `Bearer ${token}`), true)
  assert.equal(qpuStorageWriteAllowedOf(bound, 'Bearer wrong'), false)
  assert.equal(qpuStorageWriteAllowedOf(bound, null), false)
  assert.equal(qpuStorageWriteAllowedOf(unbound, `Bearer ${token}`), false)
  assert.equal(qpuStorageWriteAllowedOf(undefined, `Bearer ${token}`), false)
  const json = { 'content-type': 'application/json' }
  const naked = await fetchOf(bound, '/storage/notes/auth', { method: 'PUT', headers: json, body })
  assert.equal(naked.status, 401)
  const nakedBody = (await naked.json()) as { holds: boolean; denied: string; auth: string }
  assert.equal(nakedBody.holds, false)
  assert.equal(nakedBody.denied, 'auth')
  assert.equal(nakedBody.auth, 'Bearer QPU_WRITE_TOKEN')
  const wrong = await fetchOf(bound, '/storage/notes/auth', { method: 'PUT', headers: { ...json, authorization: 'Bearer wrong' }, body })
  assert.equal(wrong.status, 401)
  const nobody = await fetchOf(unbound, '/storage/notes/auth', { method: 'PUT', headers: { ...json, authorization: `Bearer ${token}` }, body })
  assert.equal(nobody.status, 401)
  const del = await fetchOf(bound, '/storage/notes/auth', { method: 'DELETE' })
  assert.equal(del.status, 401)
  const ok = await fetchOf(bound, '/storage/notes/auth', { method: 'PUT', headers: { ...json, authorization: `Bearer ${token}` }, body })
  assert.equal(ok.status, 200)
  assert.equal(((await ok.json()) as { holds: boolean }).holds, true)
  const read = await fetchOf(unbound, '/storage/notes/auth')
  assert.equal(read.status, 200)
  const gone = await fetchOf(bound, '/storage/notes/auth', { method: 'DELETE', headers: { authorization: `Bearer ${token}` } })
  assert.equal(gone.status, 200)
})

test('MCP storage_put and storage_del carry the request bearer; the in-process call without one is refused', async () => {
  const rpc = (name: string, args: Record<string, unknown>, headers: Record<string, string>) =>
    fetchOf(bound, '/mcp', {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...headers },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }),
    })
  const naked = (await (await rpc('storage_put', { key: 'mcp/auth', value: 8 }, {})).json()) as { result: { structuredContent?: { holds: boolean; denied?: string } } }
  assert.equal(naked.result.structuredContent?.holds, false)
  assert.equal(naked.result.structuredContent?.denied, 'auth')
  const ok = (await (await rpc('storage_put', { key: 'mcp/auth', value: 8 }, { authorization: `Bearer ${token}` })).json()) as { result: { structuredContent?: { holds: boolean } } }
  assert.equal(ok.result.structuredContent?.holds, true)
  const direct = (await qpuMcpCallOf('storage_del', { key: 'mcp/auth' }, bound)) as { structuredContent?: { holds: boolean; denied?: string } }
  assert.equal(direct.structuredContent?.holds, false)
  assert.equal(direct.structuredContent?.denied, 'auth')
  const lib = (await qpuStorageOf(bound, { method: 'DELETE', key: 'mcp/auth', auth: `Bearer ${token}` })) as { holds: boolean }
  assert.equal(lib.holds, true)
})
