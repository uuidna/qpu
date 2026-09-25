import { test } from './receipted.js'
import assert from 'node:assert/strict'
import worker, { qpuMcpCallOf, qpuStorageOf, qpuStorageWriteAllowedOf, qpuStorageListOf } from './index.js'

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

// THE SERVICE BINDING IS ITS OWN CREDENTIAL (2026-09-14: deposits through uuidna's MCP door, no token on any host). The
// QpuDeposit entrypoint in worker.js writes with via: 'binding'; no public path can set it, so a write through the
// binding holds even where no token is bound, and every public write stays refused.
test('a write through the service binding needs no token; every public write still does', async () => {
  const through = (await qpuStorageOf(unbound, { method: 'PUT', key: 'receipts/uuidna/probe/binding', value: { kind: 'probe', n: 1 }, via: 'binding' })) as { holds: boolean; denied?: string }
  assert.equal(through.holds, true, 'the binding write must hold with no token bound')
  assert.equal(through.denied, undefined)
  // CONTROL: the same write without the binding marker is refused, token or no token
  const naked = (await qpuStorageOf(unbound, { method: 'PUT', key: 'receipts/uuidna/probe/binding', value: { kind: 'probe', n: 1 } })) as { holds: boolean; denied?: string }
  assert.equal(naked.holds, false)
  assert.equal(naked.denied, 'auth')
  // CONTROL: the public HTTP path cannot reach it — no header or body field turns a public PUT into a binding write
  const json = { 'content-type': 'application/json' }
  const pub = await fetchOf(unbound, '/storage/receipts/uuidna/probe/binding', { method: 'PUT', headers: { ...json, via: 'binding' }, body: JSON.stringify({ via: 'binding', value: 1 }) })
  assert.equal(pub.status, 401)
})

// THE LIVE LISTING (uuidna.com/live): the links under a prefix, ascending, with their documents — so a name led by an
// inverted arrival time lists the newest first. Only links list: the RAID shares every write adds never appear.
test('a prefix lists its links ascending with their documents; other prefixes and shares never list', async () => {
  for (const [key, value] of [['live/probe/0002-b', { n: 2 }], ['live/probe/0001-a', { n: 1 }], ['live/other/0001-z', { n: 9 }]] as const)
    await qpuStorageOf(unbound, { method: 'PUT', key, value, via: 'binding' })
  const all = (await qpuStorageListOf(unbound, 'live/probe/', 10)) as { keys: { key: string; doc: unknown }[] }
  assert.deepEqual(all.keys.map((r) => r.key), ['live/probe/0001-a', 'live/probe/0002-b'], 'ascending, this prefix only, no shares')
  assert.ok(all.keys.every((r) => r.doc !== null), 'each link carries its document')
  // CONTROL: the limit bounds the links, never the shares that pad the store's page
  const one = (await qpuStorageListOf(unbound, 'live/probe/', 1)) as { keys: { key: string }[] }
  assert.deepEqual(one.keys.map((r) => r.key), ['live/probe/0001-a'])
  const http = await fetchOf(unbound, '/storage?prefix=live%2Fprobe%2F&limit=10')
  assert.equal(http.status, 200)
  assert.deepEqual(((await http.json()) as { keys: { key: string }[] }).keys.map((r) => r.key), ['live/probe/0001-a', 'live/probe/0002-b'])
})

test('storage: maintain is a write, so it needs what writes need', async () => {
  // MAINTAIN REWRITES SHARES AND DELETES ORPHANS — store.put and store.drop — but it called the store directly
  // instead of going through qpuStorageOf, which is the one place the bearer check lived. So
  // `POST /storage {"maintain":true}` and the store_maintain tool wrote and deleted for ANY caller, on a host
  // that answers CORS *, while the README said storage writes need a Bearer token.
  //
  // The same shape was measured here on 2026-09-11: the preflight advertised PUT and DELETE to every origin and
  // the handler honoured them unchecked. That was fixed at qpuStorageOf, and this path never went through it — a
  // guard on one door says nothing about the door beside it, which is why this asserts the door and not the guard.
  const bound = {
    QPU_HOST: host,
    QPU_WRITE_TOKEN: 'qpu-test-write-token',
    STORAGE: {
      get: async () => ({ v: 1 }),
      put: async () => {},
      delete: async () => {},
      list: async () => ({ keys: [], list_complete: true }),
    },
    BLOBS: {
      get: async () => null,
      put: async () => ({}),
      delete: async () => {},
      list: async () => ({ objects: [], truncated: false }),
    },
  }
  const maintain = (headers: Record<string, string>) =>
    worker.fetch(
      new Request(`https://${host}/storage`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'text/html', ...headers },
        body: JSON.stringify({ maintain: true }),
      }),
      bound,
    )

  const anonymous = await maintain({})
  assert.equal(anonymous.status, 401)
  assert.equal(((await anonymous.json()) as { denied?: string }).denied, 'auth')

  const wrong = await maintain({ authorization: 'Bearer not-the-token' })
  assert.equal(wrong.status, 401)
  assert.equal(((await wrong.json()) as { denied?: string }).denied, 'auth')

  const held = await maintain({ authorization: `Bearer ${bound.QPU_WRITE_TOKEN}` })
  assert.equal(held.status, 200)
  const body = (await held.json()) as { holds: boolean; denied?: string }
  assert.equal(body.denied, undefined)
  assert.equal(body.holds, true)
})
