import { test } from 'node:test'
import assert from 'node:assert/strict'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import worker, { qpuReadmeHolds, qpuReadmeOf } from './index.js'

const host = 'qpu.uuidna.com'
const env = { QPU_HOST: host }
const html = { accept: 'text/html' }
const origin = `https://${host}`

const fetchOf = (path: string, init: RequestInit = {}) =>
  worker.fetch(new Request(`${origin}${path}`, { headers: html, ...init }), env)

const mcpOf = async (name: string, args: Record<string, unknown> = {}) => {
  const res = await fetchOf('/mcp', {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'text/html' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }),
  })
  const body = (await res.json()) as { result: Record<string, unknown> }
  assert.equal(res.status, 200)
  return body.result
}

test('start measure generate', async () => {
  const started = performance.now()
  const pageRes = await fetchOf('/')
  const catalogRes = await fetchOf('/mcp')
  const prove = (await mcpOf('qpu_prove')) as {
    holds: boolean
    ui: { experienced: boolean; inline: boolean; door: string }
    theorems: { heading: string; theorem: string; holds: boolean }[]
    cern: { faces: number; holds: boolean }
    integrity: { n: number; holds: boolean }
  }
  const quantum = (await mcpOf('qpu_quantum')) as {
    holds: boolean
    fused: number
    next: number
    speed: { cover: string[]; ns?: number; holds: boolean; next: number }
    ui: { experienced: boolean }
  }
  const ns = (performance.now() - started) * 1_000_000
  const page = (await pageRes.json()) as {
    kind: string
    holds: boolean
    docs: { inline: boolean; documentation: string }
    ui: { experienced: boolean; prove: string }
    speed: { cover: string[] }
  }
  const catalog = (await catalogRes.json()) as {
    kind: string
    holds: boolean
    prove: { ui: { experienced: boolean }; theorems: unknown[]; cern: { faces: number } }
  }
  assert.equal(pageRes.status, 200)
  assert.equal((pageRes.headers.get('content-type') ?? '').includes('application/json'), true)
  assert.equal(page.kind, 'quantum')
  assert.equal(page.holds, true)
  assert.equal(page.docs.inline, true)
  assert.equal(page.ui.experienced, true)
  assert.equal(page.ui.prove, 'qpu_prove')
  assert.equal(page.docs.documentation.includes('JSON UI'), true)
  assert.deepEqual(page.speed.cover, ['next', 'Hz', 'ns', 'benchmark'])
  assert.equal(catalog.kind, 'train')
  assert.equal(catalog.holds, true)
  assert.equal(catalog.prove.ui.experienced, true)
  assert.equal(catalog.prove.cern.faces, 14)
  assert.equal(prove.holds, true)
  assert.equal(prove.ui.experienced, true)
  assert.equal(prove.ui.inline, true)
  assert.equal(prove.ui.door, 'qpu_prove')
  assert.equal(prove.theorems.every((r) => r.holds && r.theorem.startsWith('theorem') && r.theorem.includes('by decide') === false), true)
  assert.equal(prove.cern.holds, true)
  assert.equal(prove.integrity.holds, true)
  assert.equal(prove.integrity.n, 3)
  assert.equal(quantum.holds, true)
  assert.equal(quantum.ui.experienced, true)
  assert.equal(quantum.next, quantum.fused + quantum.fused)
  assert.equal(quantum.speed.holds, true)
  assert.equal(quantum.speed.next, quantum.next)
  assert.equal(ns > 0, true)
  const readme = qpuReadmeOf()
  assert.equal(qpuReadmeHolds(readme), true)
  assert.equal(readme.includes('JSON UI'), true)
  assert.equal(readme.includes('experienced'), true)
  writeFileSync(join(process.cwd(), 'README.md'), readme)
})

test('eight doors via mcp', async () => {
  const listed = await fetchOf('/mcp', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
  })
  const catalog = (await listed.json()) as { result: { tools: { name: string; man: { kind: string; name: string } }[] } }
  const names = catalog.result.tools.map((t) => t.name)
  assert.deepEqual(names.slice(0, 8), ['qpu_quantum', 'qpu_lean', 'qpu_cite', 'qpu_train', 'qpu_forge', 'qpu_improve', 'qpu_compete', 'qpu_prove'])
  assert.equal(catalog.result.tools.slice(0, 8).every((t) => t.man.kind === 'man' && t.man.name === t.name), true)
  const q = (await mcpOf('qpu_quantum')) as { holds: boolean; fused: number; docs?: unknown; ui: { experienced: boolean } }
  const lean = (await mcpOf('qpu_lean')) as { holds: boolean; src: string }
  const cite = (await mcpOf('qpu_cite')) as {
    holds: boolean
    style: string
    when: string
    inText: string
    rows: { works: string; doi: string; url: string }[]
  }
  const train = (await mcpOf('qpu_train')) as {
    kind: string
    divide: { teams: number; agents: number; challenges: number }
    sandbox: { memory: boolean; unlocked: boolean; host: boolean }
    vm: { online: boolean; auth: boolean; host: boolean; replicas: number; next: number; holds: boolean }
    holds: boolean
  }
  const sandbox = (await mcpOf('qpu_forge')) as {
    kind: string
    memory: boolean
    unlocked: boolean
    host: boolean
    eval: boolean
    fs: boolean
    tools: { name: string }[]
    holds: boolean
  }
  const improve = (await mcpOf('qpu_improve')) as {
    kind: string
    winner: string
    host: boolean
    unlocked: boolean
    before: { throughoutput: number }
    after: { throughoutput: number }
    used: { name: string; holds: boolean }[]
    holds: boolean
  }
  const compete = (await mcpOf('qpu_compete')) as { winner: string; contest: string; holds: boolean }
  const prove = (await mcpOf('qpu_prove')) as {
    kind: string
    quantum: boolean
    holds: boolean
    src: string
    ui: { experienced: boolean }
    theorems: { theorem: string; holds: boolean }[]
  }
  assert.equal(q.holds, true)
  assert.equal(q.docs, undefined)
  assert.equal(q.ui.experienced, true)
  assert.equal(lean.holds, true)
  assert.equal(lean.src, 'src/quantum/processing/unit/index.lean')
  assert.equal(cite.holds, true)
  assert.equal(cite.style, 'mla8')
  assert.equal(cite.when, 'never')
  assert.equal(cite.inText, '(Rouschev)')
  assert.equal(cite.rows.length, 3)
  assert.equal(cite.rows.every((r) => r.doi === '' && r.url.startsWith(origin)), true)
  assert.equal(train.kind, 'train')
  assert.equal(train.divide.teams, 2)
  assert.equal(train.divide.agents, 7)
  assert.equal(train.divide.challenges, 14)
  assert.equal(train.sandbox.memory, true)
  assert.equal(train.sandbox.unlocked, true)
  assert.equal(train.sandbox.host, false)
  assert.equal(train.vm.online, true)
  assert.equal(train.vm.auth, false)
  assert.equal(train.vm.host, false)
  assert.equal(train.vm.replicas, 8)
  assert.equal(train.vm.next, 16)
  assert.equal(train.vm.holds, true)
  assert.equal(train.holds, true)
  assert.equal(sandbox.kind, 'sandbox')
  assert.equal(sandbox.memory, true)
  assert.equal(sandbox.unlocked, true)
  assert.equal(sandbox.host, false)
  assert.equal(sandbox.eval, true)
  assert.equal(sandbox.fs, true)
  assert.equal(sandbox.holds, true)
  assert.equal(sandbox.tools.length >= 14, true)
  assert.equal(sandbox.tools.some((t) => t.name === 'fs'), true)
  assert.equal(sandbox.tools.some((t) => t.name === 'eval'), true)
  assert.equal(improve.kind, 'improve')
  assert.equal(improve.winner, 'call')
  assert.equal(improve.host, false)
  assert.equal(improve.unlocked, true)
  assert.equal(improve.after.throughoutput > improve.before.throughoutput, true)
  assert.equal(improve.used.length, 10)
  assert.equal(improve.used.every((u) => u.holds), true)
  assert.equal(improve.holds, true)
  assert.equal(compete.winner, 'call')
  assert.equal(compete.contest, 'throughoutput')
  assert.equal(compete.holds, true)
  assert.equal(prove.kind, 'prove')
  assert.equal(prove.quantum, true)
  assert.equal(prove.holds, true)
  assert.equal(prove.ui.experienced, true)
  assert.equal(prove.src, lean.src)
  assert.equal(prove.theorems.every((r) => r.holds && r.theorem.startsWith('theorem') && r.theorem.includes('by decide') === false), true)
  for (const name of names.slice(0, 8)) {
    const man = (await mcpOf(name, { man: true })) as { kind: string; name: string; documentation: string }
    assert.equal(man.kind, 'man')
    assert.equal(man.name, name)
    assert.equal(man.documentation.includes('NAME'), true)
  }
})

test('API only json ui', async () => {
  const pageRes = await fetchOf('/')
  assert.equal(pageRes.status, 200)
  assert.equal((pageRes.headers.get('content-type') ?? '').includes('application/json'), true)
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
  assert.equal(quantum.ui.experienced, true)
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
  assert.equal(still.auth, false)
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
  assert.equal(proxy.auth, false)
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
  const hop = (await sent.json()) as { accepted: boolean; await: boolean; uuid: string; lane: number; hop: number; host: boolean; holds: boolean }
  assert.equal(hop.accepted, true)
  assert.equal(hop.await, false)
  assert.equal(hop.lane, 3)
  assert.equal(hop.hop, 3)
  assert.equal(hop.host, false)
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
    assert.equal((res.headers.get('content-type') ?? '').includes('application/json'), true)
  }
})

test('sandbox via mcp', async () => {
  const sandbox = (await mcpOf('qpu_forge')) as {
    kind: string
    unlocked: boolean
    memory: boolean
    host: boolean
    eval: boolean
    fs: boolean
    net: boolean
    fetch: boolean
    process: boolean
    import: boolean
    disk: boolean
    worker: boolean
    denied: unknown[]
    tools: { name: string }[]
    holds: boolean
  }
  assert.equal(sandbox.holds, true)
  assert.equal(sandbox.unlocked, true)
  assert.equal(sandbox.memory, true)
  assert.equal(sandbox.host, false)
  assert.equal(sandbox.eval, true)
  assert.equal(sandbox.fs, true)
  assert.equal(sandbox.net, true)
  assert.equal(sandbox.fetch, true)
  assert.equal(sandbox.process, true)
  assert.equal(sandbox.import, true)
  assert.equal(sandbox.disk, true)
  assert.equal(sandbox.worker, true)
  assert.equal(sandbox.denied.length, 0)
  assert.equal(sandbox.tools.some((t) => t.name === 'op_mint'), true)
  assert.equal(sandbox.tools.some((t) => t.name === 'slot_fused'), true)
  const mint = (await mcpOf('call_mint')) as { value: unknown; memory: boolean; host: boolean; unlocked: boolean; holds: boolean }
  assert.equal(mint.value, true)
  assert.equal(mint.memory, true)
  assert.equal(mint.host, false)
  assert.equal(mint.unlocked, true)
  assert.equal(mint.holds, true)
  const forged = (await mcpOf('qpu_forge', {
    name: 'probe_next',
    team: 'call',
    run: { op: 'eq', left: { op: 'quantum', name: 'next' }, right: { op: 'add', left: { op: 'quantum', name: 'fused' }, right: { op: 'quantum', name: 'fused' } } },
  })) as { holds: boolean; memory: boolean; forged: boolean; denied?: string }
  assert.equal(forged.holds, true)
  assert.equal(forged.memory, true)
  assert.equal(forged.forged, true)
  const probe = (await mcpOf('probe_next')) as { value: unknown; memory: boolean; holds: boolean }
  assert.equal(probe.value, true)
  assert.equal(probe.memory, true)
  const sealed = (await mcpOf('qpu_forge', { name: 'qpu_quantum', run: { op: 'lit', value: true } })) as { holds: boolean; denied: string }
  assert.equal(sealed.holds, false)
  assert.equal(sealed.denied, 'sealed')
  const js = (await mcpOf('eval', { run: '1+1' })) as { value: { denied?: string } }
  assert.equal(js.value.denied, 'js')
  const evaluated = (await mcpOf('eval', { run: { op: 'mint', k: 3 } })) as { value: unknown; host: boolean }
  assert.equal(evaluated.value, 8)
  assert.equal(evaluated.host, false)
  await mcpOf('op_put', { key: 'durable', value: 8 })
  await mcpOf('fs', { method: 'write', path: '/durable', value: 8 })
  await mcpOf('op_put', { key: 'parent', value: 1 })
  await mcpOf('worker', { run: { op: 'put', key: 'parent', value: 2 } })
  const heap = (await mcpOf('op_get', { key: 'durable' })) as { value: unknown; host: boolean }
  const disk = (await mcpOf('fs', { method: 'read', path: '/durable' })) as { value: unknown; host: boolean }
  const parent = (await mcpOf('op_get', { key: 'parent' })) as { value: unknown }
  assert.equal(heap.value, 8)
  assert.equal(heap.host, false)
  assert.equal(disk.value, 8)
  assert.equal(disk.host, false)
  assert.equal(parent.value, 1)
})

test('paste in free AI chat', async (t) => {
  await t.test('AI sees JSON unit not HTML', async () => {
    const res = await fetchOf('/')
    assert.equal(res.status, 200)
    assert.equal((res.headers.get('content-type') ?? '').includes('application/json'), true)
    assert.equal((res.headers.get('content-type') ?? '').includes('text/html'), false)
    const page = (await res.json()) as {
      kind: string
      holds: boolean
      fused: number
      next: number
      docs: { inline: boolean; guide: boolean; abstract: string; api: { method: string; path: string }[] }
      ui: { experienced: boolean; prove: string }
      speed: { cover: string[] }
      messaging: { await: boolean; when: string; proxy?: boolean; secure?: boolean; hop?: string }
    }
    const quantum = (await mcpOf('qpu_quantum')) as { fused: number }
    assert.equal(page.kind, 'quantum')
    assert.equal(page.holds, true)
    assert.equal(page.fused, quantum.fused)
    assert.equal(page.next, page.fused + page.fused)
    assert.equal(page.docs.inline, true)
    assert.equal(page.docs.guide, true)
    assert.equal(page.ui.experienced, true)
    assert.equal(page.ui.prove, 'qpu_prove')
    assert.equal(page.docs.abstract.includes(`GET ${origin}`), true)
    assert.equal(page.docs.abstract.includes(`POST ${origin}/mcp`), true)
    assert.equal(page.docs.abstract.includes('theorem quantum'), true)
    assert.equal(page.docs.abstract.includes('qpu_prove'), true)
    assert.equal(page.docs.api.length, 7)
    assert.deepEqual(
      page.docs.api.map((a) => `${a.method} ${a.path}`),
      ['GET /', 'GET /quantum/processing/unit', 'GET /mcp', 'POST /mcp', 'GET /cite', 'GET /message', 'POST /message'],
    )
    assert.deepEqual(page.speed.cover, ['next', 'Hz', 'ns', 'benchmark'])
    assert.equal(page.messaging.await, false)
    assert.equal(page.messaging.when, 'never')
    assert.equal(page.messaging.proxy, true)
    assert.equal(page.messaging.secure, true)
    assert.equal(page.messaging.hop, 'involution')
  })

  await t.test('AI calls MCP instead of reading the tree', async () => {
    const page = await fetchOf('/')
    const listed = await fetchOf('/mcp', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
    })
    const called = await fetchOf('/mcp', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'qpu_quantum', arguments: {} } }),
    })
    const proved = await fetchOf('/mcp', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'qpu_prove', arguments: {} } }),
    })
    assert.equal(listed.status, 200)
    assert.equal(called.status, 200)
    assert.equal(proved.status, 200)
    const catalog = (await listed.json()) as { result: { tools: { name: string; man: { kind: string } }[] } }
    const call = (await called.json()) as { result: { holds: boolean; fused: number; ui: { experienced: boolean }; docs?: unknown } }
    const prove = (await proved.json()) as { result: { holds: boolean; ui: { experienced: boolean } } }
    const names = catalog.result.tools.map((t) => t.name)
    assert.deepEqual(names.slice(0, 8), [
      'qpu_quantum',
      'qpu_lean',
      'qpu_cite',
      'qpu_train',
      'qpu_forge',
      'qpu_improve',
      'qpu_compete',
      'qpu_prove',
    ])
    assert.equal(catalog.result.tools[0]?.man.kind, 'man')
    assert.equal(call.result.holds, true)
    assert.equal(call.result.ui.experienced, true)
    assert.equal(call.result.docs, undefined)
    assert.equal(prove.result.holds, true)
    assert.equal(prove.result.ui.experienced, true)
    const pageBytes = (await page.clone().arrayBuffer()).byteLength
    const callBytes = JSON.stringify(call.result).length
    assert.equal(callBytes < pageBytes, true)
  })

  await t.test('user gets cite holds and named doors', async () => {
    const citeRes = await fetchOf('/cite')
    assert.equal(citeRes.status, 200)
    const cite = (await citeRes.json()) as {
      holds: boolean
      inText: string
      when: string
      style: string
      rows: { doi: string; url: string; works: string }[]
    }
    const expected = (await mcpOf('qpu_cite')) as { rows: { works: string; url: string }[] }
    assert.equal(cite.holds, true)
    assert.equal(cite.inText, '(Rouschev)')
    assert.equal(cite.when, 'never')
    assert.equal(cite.style, 'mla8')
    assert.equal(cite.rows.length, 3)
    assert.equal(cite.rows.every((r) => r.doi === ''), true)
    assert.equal(cite.rows.every((r) => r.url.startsWith(origin)), true)
    assert.equal(cite.rows[0]?.works, expected.rows[0]?.works)
    for (const row of expected.rows) {
      const path = new URL(row.url).pathname
      const res = await fetchOf(path === '/' ? '/' : path)
      assert.equal(res.status, 200, row.url)
      assert.equal((res.headers.get('content-type') ?? '').includes('application/json'), true)
    }
  })

  await t.test('unnamed host is lost', async () => {
    const http = await worker.fetch(new Request(`http://${host}/`, { headers: html }), env)
    const other = await worker.fetch(new Request('https://example.com/', { headers: html }), env)
    assert.equal(http.status, 404)
    assert.equal(other.status, 404)
    assert.deepEqual(await http.json(), { holds: false })
    assert.deepEqual(await other.json(), { holds: false })
  })
})

test('live qpu.uuidna.com', async (t) => {
  const live = 'https://qpu.uuidna.com'
  const root = await fetch(live, { headers: html })
  const quantum = (await mcpOf('qpu_quantum')) as { fused: number }
  await t.test('chat fetch is JSON quantum', async () => {
    assert.equal(root.status, 200)
    assert.equal((root.headers.get('content-type') ?? '').includes('application/json'), true)
    const page = (await root.json()) as { kind: string; holds: boolean; fused: number; docs: { inline: boolean; guide: boolean } }
    assert.equal(page.kind, 'quantum')
    assert.equal(page.holds, true)
    assert.equal(page.fused, quantum.fused)
    assert.equal(page.docs.inline, true)
    assert.equal(page.docs.guide, true)
  })
  await t.test('chat calls tools/call', async () => {
    const listed = await fetch(`${live}/mcp`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
    })
    const called = await fetch(`${live}/mcp`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'qpu_quantum', arguments: {} } }),
    })
    assert.equal(listed.status, 200)
    assert.equal(called.status, 200)
    const catalog = (await listed.json()) as { result: { tools: { name: string }[] } }
    const call = (await called.json()) as { result: { holds: boolean; fused: number; docs?: unknown } }
    assert.equal(catalog.result.tools[0]?.name, 'qpu_quantum')
    assert.equal(call.result.holds, true)
    assert.equal(call.result.fused, quantum.fused)
    assert.equal(call.result.docs, undefined)
  })
  await t.test('no auth message proxy', async () => {
    const inbox = await fetch(`${live}/message`, { headers: html })
    assert.equal(inbox.status, 200)
    assert.equal(inbox.headers.get('access-control-allow-origin'), '*')
    const proxy = (await inbox.json()) as { kind: string; proxy: boolean; auth: boolean; holds: boolean }
    assert.equal(proxy.kind, 'message')
    assert.equal(proxy.proxy, true)
    assert.equal(proxy.auth, false)
    assert.equal(proxy.holds, true)
    const sent = await fetch(`${live}/message`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ lane: 0, body: 'public' }),
    })
    assert.equal(sent.status, 202)
    const hop = (await sent.json()) as { accepted: boolean; await: boolean; hop: number; lane: number }
    assert.equal(hop.accepted, true)
    assert.equal(hop.await, false)
    assert.equal(hop.hop, hop.lane)
  })
})
