import { test } from 'node:test'
import assert from 'node:assert/strict'
import worker, {
  qpuCiteOf,
  qpuLeanHolds,
  qpuLeanOf,
  qpuMcpCallOf,
  qpuMcpHolds,
  qpuMcpOf,
  qpuMessageHolds,
  qpuMessageOf,
  qpuQuantumHolds,
  qpuQuantumOf,
  qpuSandboxDurabilityHolds,
  qpuSandboxDurabilityOf,
  qpuSandboxHolds,
  qpuSandboxOf,
  qpuShorHolds,
  qpuTestsHolds,
  qpuTestsOf,
  qpuUnitOf,
} from './index.js'

test('agents design tests proving QPU is quantum', async (t) => {
  const unit = qpuUnitOf()
  const designed = qpuTestsOf()
  await t.test('designed', () => {
    assert.equal(qpuTestsHolds(designed), true)
    assert.equal(designed.quantum, true)
    assert.equal(designed.designedBy, 'call')
    assert.equal(designed.src, unit.fuse.lean)
    assert.equal(qpuShorHolds(designed.shor), true)
    assert.equal(designed.shor.breaks, 'rsa')
    assert.equal(designed.auth, false)
    assert.equal(designed.public, true)
    assert.equal(qpuMessageHolds(), true)
    assert.equal(designed.shor.challenges.length, 14)
    assert.equal('scale' in designed.shor, false)
    assert.equal(designed.agents.free, true)
    assert.equal(designed.agents.auth, false)
    assert.equal(designed.agents.test, 'quantum proofs')
    assert.equal(designed.agents.call.path, 'mcp')
    assert.equal(designed.agents.call.proofs, designed.cases.length)
    assert.equal(designed.agents.read.proofs, designed.cases.length)
    assert.equal(designed.agents.call.ns > 0, true)
    assert.equal(designed.agents.read.ns > 0, true)
    assert.equal(designed.agents.call.hz > 0, true)
    assert.equal(designed.agents.read.hz > 0, true)
  })
  for (const row of designed.cases) {
    await t.test(`${row.agent} ${row.name}`, () => {
      assert.equal(row.holds, true)
      assert.equal(row.left, row.right)
      assert.equal(row.theorem.includes('by decide'), false)
    })
  }
  for (const row of designed.shor.challenges) {
    await t.test(`shor ${row.modulus}`, () => {
      assert.equal(row.holds, true)
      assert.equal(row.p * row.q, row.modulus)
      assert.equal(row.left, row.right)
    })
  }
})

test('QPU lean proof', async (t) => {
  const unit = qpuUnitOf()
  const quantum = qpuQuantumOf()
  const lean = qpuLeanOf()
  await t.test('unit', () => {
    assert.equal(unit.kind, 'qpu')
    assert.equal(unit.host, 'qpu.uuidna.com')
    assert.equal(unit.path, 'quantum/processing/unit')
    assert.equal(unit.holds, true)
    assert.equal(unit.fuse.lean, 'src/quantum/processing/unit/index.lean')
  })
  await t.test('quantum', () => {
    assert.equal(qpuQuantumHolds(quantum), true)
    assert.equal(quantum.docs.inline, true)
    assert.equal(quantum.docs.guide, true)
    assert.equal(quantum.docs.documentation.includes(quantum.docs.abstract), true)
  })
  await t.test('lean', async (st) => {
    assert.equal(qpuLeanHolds(lean), true)
    assert.equal(lean.src, unit.fuse.lean)
    for (const row of [...lean.rows, ...lean.cover, lean.climb]) {
      await st.test(row.heading, () => {
        assert.equal(row.holds, true)
        assert.equal(row.theorem.includes('by decide'), false)
        assert.equal(row.formula.includes('\\'), true)
      })
    }
  })
  await t.test('mcp', () => {
    const mcp = qpuMcpOf()
    assert.equal(qpuMcpHolds(mcp), true)
    assert.equal(mcp.kind, 'train')
    assert.equal(mcp.module, 'agent efficiency')
    assert.equal(mcp.compete.winner, 'call')
    assert.equal(mcp.prove.quantum, true)
    assert.equal(mcp.tools.map((t) => t.name).join(' '), 'qpu_quantum qpu_lean qpu_cite qpu_train qpu_forge qpu_improve qpu_compete qpu_prove')
    assert.equal(mcp.tools.every((t) => t.man.kind === 'man' && t.man.inline === true && t.man.name === t.name), true)
    const q = qpuMcpCallOf('qpu_quantum') as { holds: boolean; fused: number; docs?: unknown }
    const p = qpuMcpCallOf('qpu_lean') as { holds: boolean }
    const cite = qpuMcpCallOf('qpu_cite') as {
      holds: boolean
      style: string
      when: string
      inText: string
      rows: { works: string; doi: string; url: string }[]
    }
    const prove = qpuMcpCallOf('qpu_prove') as {
      kind: string
      quantum: boolean
      holds: boolean
      auth: boolean
      agents: { free: boolean; auth: boolean; test: string; call: { path: string; ns: number; hz: number; proofs: number }; cases: number }
    }
    const compete = qpuMcpCallOf('qpu_compete') as { winner: string; contest: string; holds: boolean }
    const improve = qpuMcpCallOf('qpu_improve') as {
      kind: string
      winner: string
      host: boolean
      unlocked: boolean
      before: { throughoutput: number }
      after: { throughoutput: number; quality: number; security: number }
      used: { name: string; holds: boolean }[]
      holds: boolean
    }
    const train = qpuMcpCallOf('qpu_train') as { kind: string; divide: { teams: number; agents: number; challenges: number }; sandbox: { memory: boolean; unlocked: boolean; host: boolean }; holds: boolean }
    const sandbox = qpuMcpCallOf('qpu_forge') as { kind: string; memory: boolean; unlocked: boolean; host: boolean; eval: boolean; fs: boolean; tools: { name: string }[]; holds: boolean }
    const quantumMan = qpuMcpCallOf('qpu_quantum', { man: true }) as { kind: string; name: string; holds: boolean }
    assert.equal(q.holds, true)
    assert.equal(q.docs, undefined)
    assert.equal(q.fused, quantum.fused)
    assert.equal(p.holds, true)
    assert.equal(cite.holds, true)
    assert.equal(cite.style, 'mla8')
    assert.equal(cite.when, 'never')
    assert.equal(cite.inText, '(Rouschev)')
    assert.equal(cite.rows.length, unit.path.split('/').length)
    assert.equal(cite.rows.every((r) => r.doi === '' && r.url.startsWith(unit.origin)), true)
    assert.equal(prove.kind, 'prove')
    assert.equal(prove.quantum, true)
    assert.equal(prove.holds, true)
    assert.equal(prove.auth, false)
    assert.equal(prove.agents.free, true)
    assert.equal(prove.agents.auth, false)
    assert.equal(prove.agents.test, 'quantum proofs')
    assert.equal(prove.agents.call.path, 'mcp')
    assert.equal(prove.agents.call.proofs, prove.agents.cases)
    assert.equal(prove.agents.call.ns > 0, true)
    assert.equal(compete.winner, 'call')
    assert.equal(compete.contest, 'throughoutput')
    assert.equal(compete.holds, true)
    assert.equal(improve.kind, 'improve')
    assert.equal(improve.winner, 'call')
    assert.equal(improve.host, false)
    assert.equal(improve.unlocked, true)
    assert.equal(improve.after.throughoutput > improve.before.throughoutput, true)
    assert.equal(improve.used.length, 10)
    assert.equal(improve.used.every((u) => u.holds), true)
    assert.equal(improve.holds, true)
    assert.equal(train.kind, 'train')
    assert.equal(train.divide.teams, 2)
    assert.equal(train.divide.agents, 7)
    assert.equal(train.divide.challenges, 14)
    assert.equal(train.sandbox.memory, true)
    assert.equal(train.sandbox.unlocked, true)
    assert.equal(train.sandbox.host, false)
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
    assert.equal(sandbox.tools.some((t) => t.name === 'op_mint'), true)
    assert.equal(sandbox.tools.some((t) => t.name === 'slot_fused'), true)
    const mint = qpuMcpCallOf('call_mint') as { value: unknown; memory: boolean; host: boolean; unlocked: boolean; holds: boolean }
    assert.equal(mint.value, true)
    assert.equal(mint.memory, true)
    assert.equal(mint.host, false)
    assert.equal(mint.unlocked, true)
    assert.equal(mint.holds, true)
    const forged = qpuMcpCallOf('qpu_forge', {
      name: 'probe_next',
      team: 'call',
      run: { op: 'eq', left: { op: 'quantum', name: 'next' }, right: { op: 'add', left: { op: 'quantum', name: 'fused' }, right: { op: 'quantum', name: 'fused' } } },
    }) as { holds: boolean; memory: boolean; forged: boolean; denied?: string }
    assert.equal(forged.holds, true)
    assert.equal(forged.memory, true)
    assert.equal(forged.forged, true)
    const probe = qpuMcpCallOf('probe_next') as { value: unknown; memory: boolean; holds: boolean }
    assert.equal(probe.value, true)
    assert.equal(probe.memory, true)
    const sealed = qpuMcpCallOf('qpu_forge', { name: 'qpu_quantum', run: { op: 'lit', value: true } }) as { holds: boolean; denied: string }
    assert.equal(sealed.holds, false)
    assert.equal(sealed.denied, 'sealed')
    const js = qpuMcpCallOf('eval', { run: '1+1' }) as { value: { denied?: string } }
    assert.equal(js.value.denied, 'js')
    const evaluated = qpuMcpCallOf('eval', { run: { op: 'mint', k: 3 } }) as { value: unknown; host: boolean }
    assert.equal(evaluated.value, 8)
    assert.equal(evaluated.host, false)
    assert.equal(quantumMan.kind, 'man')
    assert.equal(quantumMan.name, 'qpu_quantum')
    for (const tool of mcp.tools) {
      const man = qpuMcpCallOf(tool.name, { man: true }) as { kind: string; name: string; documentation: string }
      assert.equal(man.kind, 'man')
      assert.equal(man.name, tool.name)
      assert.equal(man.documentation.includes('NAME'), true)
    }
  })
})

test('API only', async () => {
  const unit = qpuUnitOf()
  const env = { QPU_HOST: unit.host }
  const html = { accept: 'text/html' }
  const origin = await worker.fetch(new Request(`https://${unit.host}/`, { headers: html }), env)
  assert.equal(origin.status, 200)
  assert.equal((origin.headers.get('content-type') ?? '').includes('application/json'), true)
  const quantum = (await origin.json()) as { kind: string; holds: boolean; fused: number; docs: { inline: boolean; guide: boolean } }
  assert.equal(quantum.kind, 'quantum')
  assert.equal(quantum.holds, true)
  assert.equal(quantum.fused, qpuQuantumOf().fused)
  assert.equal(quantum.docs.inline, true)
  assert.equal(quantum.docs.guide, true)
  assert.equal(origin.headers.get('access-control-allow-origin'), '*')
  const preflight = await worker.fetch(
    new Request(`https://${unit.host}/mcp`, {
      method: 'OPTIONS',
      headers: { origin: 'https://example.com', 'access-control-request-method': 'POST' },
    }),
    env,
  )
  assert.equal(preflight.status, 204)
  assert.equal(preflight.headers.get('access-control-allow-origin'), '*')
  const authed = await worker.fetch(
    new Request(`https://${unit.host}/`, { headers: { ...html, authorization: 'Bearer x' } }),
    env,
  )
  assert.equal(authed.status, 200)
  const still = (await authed.json()) as { auth: boolean; public: boolean; holds: boolean }
  assert.equal(still.auth, false)
  assert.equal(still.public, true)
  const inbox = await worker.fetch(new Request(`https://${unit.host}/message`, { headers: html }), env)
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
  assert.equal(qpuMessageHolds(qpuMessageOf()), true)
  const sent = await worker.fetch(
    new Request(`https://${unit.host}/message`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ lane: 3, body: 'breakthrough' }),
    }),
    env,
  )
  assert.equal(sent.status, 202)
  const hop = (await sent.json()) as { accepted: boolean; await: boolean; uuid: string; lane: number; hop: number; host: boolean; holds: boolean }
  assert.equal(hop.accepted, true)
  assert.equal(hop.await, false)
  assert.equal(hop.lane, 3)
  assert.equal(hop.hop, 3)
  assert.equal(hop.host, false)
  assert.equal(hop.uuid.replace(/-/g, '').length, 32)
  assert.equal(hop.holds, true)
  const door = await worker.fetch(new Request(`https://${unit.host}/${unit.path}`, { headers: html }), env)
  assert.equal(door.status, 200)
  const lean = (await door.json()) as { holds: boolean; src: string }
  assert.equal(lean.holds, true)
  assert.equal(lean.src, unit.fuse.lean)
  const listed = await worker.fetch(
    new Request(`https://${unit.host}/mcp`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
    }),
    env,
  )
  const catalog = (await listed.json()) as { result: { tools: { name: string; man: { kind: string; name: string } }[] } }
  const names = catalog.result.tools.map((t) => t.name)
  assert.deepEqual(names.slice(0, 8), ['qpu_quantum', 'qpu_lean', 'qpu_cite', 'qpu_train', 'qpu_forge', 'qpu_improve', 'qpu_compete', 'qpu_prove'])
  assert.equal(names.includes('call_mint'), true)
  assert.equal(names.includes('read_next'), true)
  assert.equal(names.includes('fs'), true)
  assert.equal(names.includes('eval'), true)
  assert.equal(names.includes('op_mint'), true)
  assert.equal(names.includes('slot_fused'), true)
  assert.equal(catalog.result.tools.every((t) => t.man.kind === 'man' && t.man.name === t.name), true)
  const trained = await worker.fetch(new Request(`https://${unit.host}/mcp`, { headers: html }), env)
  const module = (await trained.json()) as { kind: string; module: string; training: boolean; prove: { quantum: boolean }; compete: { winner: string }; holds: boolean }
  assert.equal(trained.status, 200)
  assert.equal(module.kind, 'train')
  assert.equal(module.module, 'agent efficiency')
  assert.equal(module.training, true)
  assert.equal(module.prove.quantum, true)
  assert.equal(module.compete.winner, 'call')
  assert.equal(module.holds, true)
  const cite = qpuMcpCallOf('qpu_cite') as { rows: { title: string; url: string }[] }
  for (const row of cite.rows) {
    const res = await worker.fetch(new Request(row.url, { headers: html }), env)
    assert.equal(res.status, 200, `${row.title} ${row.url} → ${res.status}`)
    assert.equal((res.headers.get('content-type') ?? '').includes('application/json'), true)
  }
})

test('sandbox durability', async (t) => {
  const sandbox = qpuSandboxOf()
  await t.test('unlocked catalog', () => {
    assert.equal(qpuSandboxHolds(sandbox), true)
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
  })
  const durable = qpuSandboxDurabilityOf()
  await t.test('holds', () => {
    assert.equal(qpuSandboxDurabilityHolds(durable), true)
    assert.equal(durable.kind, 'durability')
    assert.equal(durable.unlocked, true)
    assert.equal(durable.memory, true)
    assert.equal(durable.host, false)
    assert.equal(durable.persist, true)
    assert.equal(durable.isolate, true)
    assert.equal(durable.eval, true)
    assert.equal(durable.js, true)
    assert.equal(durable.fetch, true)
    assert.equal(durable.process, true)
    assert.equal(durable.challenges, durable.expected)
    assert.equal(durable.rounds, 8)
  })
  await t.test('state survives later calls', () => {
    const heap = qpuMcpCallOf('op_get', { key: 'durable' }) as { value: unknown; host: boolean }
    const disk = qpuMcpCallOf('fs', { method: 'read', path: '/durable' }) as { value: unknown; host: boolean }
    const parent = qpuMcpCallOf('op_get', { key: 'parent' }) as { value: unknown }
    assert.equal(heap.value, 8)
    assert.equal(heap.host, false)
    assert.equal(disk.value, 8)
    assert.equal(disk.host, false)
    assert.equal(parent.value, 1)
    assert.equal(qpuSandboxHolds(), true)
    assert.equal(qpuMcpHolds(), true)
  })
})

test('paste in free AI chat', async (t) => {
  const unit = qpuUnitOf()
  const env = { QPU_HOST: unit.host }
  const html = { accept: 'text/html' }
  const origin = `https://${unit.host}`
  const fetchOf = (path: string, init: RequestInit = {}) =>
    worker.fetch(new Request(`${origin}${path}`, { headers: html, ...init }), env)
  const jsonrpcOf = (method: string, params?: Record<string, unknown>) =>
    fetchOf('/mcp', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    })

  await t.test('AI sees JSON unit not HTML occupancy', async () => {
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
      speed: { cover: string[] }
      messaging: { await: boolean; when: string; proxy?: boolean; secure?: boolean; hop?: string }
    }
    assert.equal(page.kind, 'quantum')
    assert.equal(page.holds, true)
    assert.equal(page.fused, qpuQuantumOf().fused)
    assert.equal(page.next, page.fused + page.fused)
    assert.equal(page.docs.inline, true)
    assert.equal(page.docs.guide, true)
    assert.equal(page.docs.abstract.includes(`GET ${origin}`), true)
    assert.equal(page.docs.abstract.includes(`POST ${origin}/mcp`), true)
    assert.equal(page.docs.abstract.includes('theorem quantum'), true)
    assert.equal(page.docs.api.length, 7)
    assert.deepEqual(
      page.docs.api.map((a) => `${a.method} ${a.path}`),
      [
        'GET /',
        `GET /${unit.path}`,
        'GET /mcp',
        'POST /mcp',
        'GET /cite',
        'GET /message',
        'POST /message',
      ],
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
    const listed = await jsonrpcOf('tools/list')
    const called = await jsonrpcOf('tools/call', { name: 'qpu_quantum', arguments: {} })
    assert.equal(listed.status, 200)
    assert.equal(called.status, 200)
    const catalog = (await listed.json()) as { result: { tools: { name: string; man: { kind: string } }[] } }
    const call = (await called.json()) as { result: { holds: boolean; fused: number; docs?: unknown } }
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
    assert.equal(call.result.fused, qpuQuantumOf().fused)
    assert.equal(call.result.docs, undefined)
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
    const expected = qpuCiteOf()
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
    const http = await worker.fetch(new Request(`http://${unit.host}/`, { headers: html }), env)
    const other = await worker.fetch(new Request('https://example.com/', { headers: html }), env)
    assert.equal(http.status, 404)
    assert.equal(other.status, 404)
    assert.deepEqual(await http.json(), { holds: false })
    assert.deepEqual(await other.json(), { holds: false })
  })
})

test('live qpu.uuidna.com', async (t) => {
  const origin = 'https://qpu.uuidna.com'
  const html = { accept: 'text/html' }
  const root = await fetch(origin, { headers: html })
  await t.test('chat fetch is JSON quantum', async () => {
    assert.equal(root.status, 200)
    assert.equal((root.headers.get('content-type') ?? '').includes('application/json'), true)
    const page = (await root.json()) as { kind: string; holds: boolean; fused: number; docs: { inline: boolean; guide: boolean } }
    assert.equal(page.kind, 'quantum')
    assert.equal(page.holds, true)
    assert.equal(page.fused, qpuQuantumOf().fused)
    assert.equal(page.docs.inline, true)
    assert.equal(page.docs.guide, true)
  })
  await t.test('chat calls tools/call', async () => {
    const listed = await fetch(`${origin}/mcp`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
    })
    const called = await fetch(`${origin}/mcp`, {
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
    assert.equal(call.result.fused, qpuQuantumOf().fused)
    assert.equal(call.result.docs, undefined)
  })
  await t.test('no auth message proxy', async () => {
    const inbox = await fetch(`${origin}/message`, { headers: html })
    assert.equal(inbox.status, 200)
    assert.equal(inbox.headers.get('access-control-allow-origin'), '*')
    const proxy = (await inbox.json()) as { kind: string; proxy: boolean; auth: boolean; holds: boolean }
    assert.equal(proxy.kind, 'message')
    assert.equal(proxy.proxy, true)
    assert.equal(proxy.auth, false)
    assert.equal(proxy.holds, true)
    const sent = await fetch(`${origin}/message`, {
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
