import { test } from './receipted.js'
import assert from 'node:assert/strict'
import worker from './index.js'

const host = 'qpu.uuidna.com'
const env = { QPU_HOST: host }
const html = { accept: 'text/html' }
const origin = `https://${host}`

const fetchOf = (path: string, init: RequestInit = {}) =>
  worker.fetch(
    new Request(`${origin}${path}`, {
      ...init,
      headers: { ...html, ...(init.headers as Record<string, string> | undefined) },
    }),
    env,
  )

const mcpOf = async (name: string, args: Record<string, unknown> = {}) => {
  const res = await fetchOf('/mcp', {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'text/html' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }),
  })
  const body = (await res.json()) as { result: { structuredContent?: Record<string, unknown> } & Record<string, unknown> }
  assert.equal(res.status, 200)
  return body.result.structuredContent ?? body.result
}

test('API only json ui', async () => {
  const pageRes = await fetchOf('/')
  assert.equal(pageRes.status, 200)
  assert.equal((pageRes.headers.get('content-type') ?? '').includes('ld+json'), true)
  const quantum = (await pageRes.json()) as {
    kind: string
    holds: boolean
    fused: number
    docs: { inline: boolean; guide: boolean }
    ui: { experienced: boolean }
    auth: boolean
    public: boolean
  }
  const mcpQuantum = (await mcpOf('qpu_quantum')) as { fused: number }
  assert.equal(quantum.kind, 'quantum')
  assert.equal(quantum.holds, true)
  assert.equal(quantum.fused, mcpQuantum.fused)
  assert.equal(quantum.docs.inline, true)
  assert.equal(quantum.docs.guide, true)
  assert.equal(pageRes.headers.get('access-control-allow-origin'), '*')
  const preflight = await worker.fetch(
    new Request(`${origin}/mcp`, {
      method: 'OPTIONS',
      headers: { origin: 'https://example.com', 'access-control-request-method': 'POST' },
    }),
    env,
  )
  assert.equal(preflight.status, 204)
  assert.equal(preflight.headers.get('access-control-allow-origin'), '*')
  const authed = await fetchOf('/', { headers: { ...html, authorization: 'Bearer x' } })
  assert.equal(authed.status, 200)
  const still = (await authed.json()) as { auth: boolean; public: boolean; holds: boolean }
  assert.equal(still.public, true)
  const inbox = await fetchOf('/message')
  assert.equal(inbox.status, 200)
  const proxy = (await inbox.json()) as {
    kind: string
    proxy: boolean
    secure: boolean
    auth: boolean
    await: boolean
    lanes: number
    hop: string
    routes: { lane: number; hop: number; involution: boolean }[]
    holds: boolean
  }
  assert.equal(proxy.kind, 'message')
  assert.equal(proxy.proxy, true)
  assert.equal(proxy.secure, true)
  assert.equal(proxy.await, false)
  assert.equal(proxy.hop, 'involution')
  assert.equal(proxy.lanes, 14)
  assert.equal(proxy.routes.length, 14)
  assert.equal(proxy.routes.every((r) => r.involution && r.hop === r.lane), true)
  const sent = await fetchOf('/message', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ lane: 3, body: 'breakthrough' }),
  })
  assert.equal(sent.status, 202)
  const hop = (await sent.json()) as { accepted: boolean; await: boolean; uuid: string; lane: number; hop: number; holds: boolean }
  assert.equal(hop.accepted, true)
  assert.equal(hop.await, false)
  assert.equal(hop.lane, 3)
  assert.equal(hop.hop, 3)
  assert.equal(hop.uuid.replace(/-/g, '').length, 32)
  assert.equal(hop.holds, true)
  const door = await fetchOf('/quantum/processing/unit')
  assert.equal(door.status, 200)
  const lean = (await door.json()) as { holds: boolean; src: string }
  assert.equal(lean.holds, true)
  assert.equal(lean.src, 'src/quantum/processing/unit/index.lean')
  const cite = (await mcpOf('qpu_cite')) as { rows: { title: string; url: string }[] }
  for (const row of cite.rows) {
    const res = await worker.fetch(new Request(row.url, { headers: html }), env)
    assert.equal(res.status, 200, `${row.title} ${row.url} → ${res.status}`)
    assert.equal((res.headers.get('content-type') ?? '').includes('ld+json'), true)
  }
})
