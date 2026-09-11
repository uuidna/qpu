import { test } from './receipted.js'
import assert from 'node:assert/strict'
import worker, { shorFactorOf } from './index.js'

const host = 'qpu.uuidna.com'
const env = { QPU_HOST: host, QPU_WRITE_TOKEN: 'qpu-test-write-token' }
const bearer = { authorization: `Bearer ${env.QPU_WRITE_TOKEN}` }
const html = { accept: 'text/html' }
const origin = `https://${host}`

const fetchOf = (path: string, init: RequestInit = {}) =>
  worker.fetch(
    new Request(`${origin}${path}`, {
      ...init,
      headers: {
        ...html,
        ...(init.method === 'PUT' || init.method === 'POST' || init.method === 'DELETE' ? bearer : {}),
        ...(init.headers as Record<string, string> | undefined),
      },
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

test('eight doors via mcp', async () => {
  const listed = await fetchOf('/mcp', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
  })
  const catalog = (await listed.json()) as { result: { tools: { name: string; man: { kind: string; name: string } }[] } }
  const names = catalog.result.tools.map((t) => t.name)
  assert.equal(names.length, 16)
  assert.deepEqual(names.slice(0, 8), ['qpu_quantum', 'qpu_lean', 'qpu_cite', 'qpu_train', 'qpu_forge', 'qpu_improve', 'qpu_compete', 'qpu_prove'])
  assert.deepEqual(names.slice(8), ['crypto_catalog', 'crypto_shor', 'crypto_cmodexp', 'crypto_iqft', 'crypto_shots', 'crypto_rsa', 'crypto_split', 'crypto_verify'])
  assert.equal(catalog.result.tools.every((t) => t.man === undefined), true) // tools/list stays lean; man is one call away
  const crypto = catalog.result.tools.slice(8)
  assert.equal(crypto.length, 8)
  assert.deepEqual(crypto.map((t) => t.name), ['crypto_catalog', 'crypto_shor', 'crypto_cmodexp', 'crypto_iqft', 'crypto_shots', 'crypto_rsa', 'crypto_split', 'crypto_verify'])
  const q = (await mcpOf('qpu_quantum')) as {
    holds: boolean
    fused: number
    docs?: unknown
    ui: { experienced: boolean }
    shor: { rsa: { kind: string; factored: boolean; p: number; q: number; modulus: number } }
  }
  const lean = (await mcpOf('qpu_lean')) as { holds: boolean; src: string }
  const cite = (await mcpOf('qpu_cite')) as {
    holds: boolean
    style: string
    when: string
    inText: string
    author: { orcid: string }
    doi: string
    identifier: string
    archive: string
    sameAs: string[]
    rows: { works: string; doi: string; url: string }[]
  }
  const train = (await mcpOf('qpu_train')) as {
    kind: string
    divide: { teams: number; agents: number; challenges: number }
    dry: { kind: string; coordinated: boolean; entropy: boolean; sealed: boolean; occupancy: string[]; domains: string[]; hz: number; holds: boolean }
    sandbox: { memory: boolean; unlocked: boolean }
    vm: { online: boolean; auth: boolean; replicas: number; next: number; scaled: boolean; infinite: boolean; crypt: boolean; free: boolean; agents: number; holds: boolean }
    holds: boolean
  }
  const sandbox = (await mcpOf('qpu_forge')) as {
    kind: string
    memory: boolean
    unlocked: boolean
    eval: boolean
    fs: boolean
    tools: { name: string }[]
    holds: boolean
  }
  const improve = (await mcpOf('qpu_improve')) as {
    kind: string
    winner: string
    unlocked: boolean
    quantum: { unlocked: boolean; next: number; holds: boolean }
    before: { throughoutput: number }
    after: { throughoutput: number }
    used: { name: string; holds: boolean }[]
    holds: boolean
  }
  const compete = (await mcpOf('qpu_compete')) as {
    winner: string
    contest: string
    quantum: { unlocked: boolean; next: number; holds: boolean }
    teams: { name: string; throughoutput: number }[]
    next: string[]
    holds: boolean
  }
  const prove = (await mcpOf('qpu_prove')) as {
    kind: string
    quantum: boolean
    holds: boolean
    src: string
    ui: { experienced: boolean }
    theorems: { theorem: string; holds: boolean }[]
    shor: { rsa: { kind: string; factored: boolean; modulus: number } }
  }
  assert.equal(q.holds, true)
  assert.equal(q.docs, undefined)
  assert.equal(q.shor.rsa.kind, 'rsa')
  assert.equal(q.shor.rsa.factored, true)
  assert.equal(q.shor.rsa.p * q.shor.rsa.q, q.shor.rsa.modulus)
  assert.equal(lean.holds, true)
  assert.equal(lean.src, 'src/quantum/processing/unit/index.lean')
  assert.equal(cite.holds, true)
  assert.equal(cite.style, 'mla8')
  assert.equal(cite.when, 'never')
  assert.equal(cite.inText, '(Rouschev)')
  assert.equal(cite.author.orcid, 'https://orcid.org/0009-0000-7312-9778')
  assert.equal(cite.doi, '10.5281/zenodo.22700099')
  assert.equal(cite.identifier, `https://doi.org/${cite.doi}`)
  assert.equal(cite.sameAs.includes(cite.archive), true)
  assert.equal(cite.sameAs.includes(cite.author.orcid), true)
  assert.equal(cite.rows.every((r) => r.doi === cite.doi && r.url.startsWith(origin)), true)
  assert.equal(train.kind, 'train')
  assert.equal(train.divide.teams, 2)
  assert.equal(train.divide.agents, 7)
  assert.equal(train.divide.challenges, 14)
  assert.equal(train.dry.kind, 'clean')
  assert.equal(train.dry.coordinated, true)
  assert.equal(train.dry.entropy, false)
  assert.equal(train.dry.sealed, false)
  assert.deepEqual(train.dry.occupancy, ['personal', 'business', 'corporate', 'saas', 'paas'])
  assert.deepEqual(train.dry.domains, ['scanner', 'radar'])
  assert.equal(train.dry.hz, 432)
  assert.equal(train.dry.holds, true)
  assert.equal(train.sandbox.memory, true)
  assert.equal(train.sandbox.unlocked, true)
  assert.equal(train.vm.online, true)
  assert.equal(train.vm.replicas, 8)
  assert.equal(train.vm.next, 16)
  assert.equal(train.vm.crypt, true)
  assert.equal(train.vm.free, true)
  assert.equal(train.vm.agents, 14)
  assert.equal(train.vm.holds, true)
  assert.equal(train.holds, true)
  assert.equal(sandbox.kind, 'sandbox')
  assert.equal(sandbox.memory, true)
  assert.equal(sandbox.unlocked, true)
  assert.equal(sandbox.eval, true)
  assert.equal(sandbox.fs, true)
  assert.equal(sandbox.holds, true)
  assert.equal(sandbox.tools.length >= 14, true)
  assert.equal(sandbox.tools.some((t) => t.name === 'fs'), true)
  assert.equal(sandbox.tools.some((t) => t.name === 'eval'), true)
  assert.equal(improve.kind, 'improve')
  assert.equal(improve.winner, 'call')
  assert.equal(improve.unlocked, true)
  assert.equal(improve.quantum.holds, true)
  assert.equal(improve.quantum.next, improve.after.throughoutput)
  assert.equal(improve.after.throughoutput, improve.before.throughoutput + improve.before.throughoutput)
  assert.equal(improve.after.throughoutput > improve.before.throughoutput, true)
  assert.equal(improve.used.length, 10)
  assert.equal(improve.used.every((u) => u.holds), true)
  assert.equal(improve.holds, true)
  assert.equal(compete.winner, 'call')
  assert.equal(compete.contest, 'throughoutput')
  assert.equal(compete.quantum.holds, true)
  assert.equal(compete.quantum.next, compete.teams[1]?.throughoutput)
  assert.equal(compete.teams[1]?.throughoutput, (compete.teams[0]?.throughoutput ?? 0) + (compete.teams[0]?.throughoutput ?? 0))
  assert.equal(compete.next[0], 'qpu_prove')
  assert.equal(compete.holds, true)
  assert.equal(prove.kind, 'prove')
  assert.equal(prove.quantum, true)
  assert.equal(prove.holds, true)
  assert.equal(prove.shor.rsa.kind, 'rsa')
  assert.equal(prove.shor.rsa.factored, true)
  assert.equal(prove.src, lean.src)
  assert.equal(prove.theorems.every((r) => r.holds && r.theorem.startsWith('theorem') && r.theorem.includes('by decide') === false), true)
  for (const name of names) {
    const man = (await mcpOf(name, { man: true })) as { kind: string; name: string; documentation: string; holds: boolean }
    assert.equal(man.kind, 'man')
    assert.equal(man.name, name)
    assert.equal(man.holds, true)
    assert.equal(man.documentation.includes('NAME'), true)
    if (name === 'qpu_quantum' || name === 'qpu_lean' || name === 'qpu_prove') {
      assert.equal(man.documentation.includes(shorFactorOf()), true, name)
    }
  }
})

const rpcOf = async (path: string, method: string, params: Record<string, unknown> = {}) => {
  const res = await fetchOf(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'text/html' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  })
  const body = (await res.json()) as { result: { structuredContent?: Record<string, unknown>; tools?: { name: string; man?: { holds: boolean } }[] } & Record<string, unknown> }
  assert.equal(res.status, 200, path)
  return body.result
}

test('web mcp initialize, extras catalogs, and morph tools are callable', async () => {
  const discovered = await rpcOf('/mcp', 'initialize')
  assert.equal(discovered.holds, true)
  assert.equal((discovered.serverInfo as { name?: string } | undefined)?.name, '@uuidna/qpu')
  assert.equal(typeof discovered.instructions === 'string' && discovered.instructions.includes('Eight doors'), true)
  assert.equal(typeof discovered.instructions === 'string' && discovered.instructions.includes('Eight cybersecurity'), true)
  assert.equal(typeof discovered.instructions === 'string' && discovered.instructions.includes('crypto_rsa'), true)
  assert.equal(typeof discovered.instructions === 'string' && discovered.instructions.includes(shorFactorOf()), true)
  const ping = await rpcOf('/mcp', 'ping')
  assert.deepEqual(ping, {})

  const sealed = ['qpu_quantum', 'qpu_lean', 'qpu_cite', 'qpu_train', 'qpu_forge', 'qpu_improve', 'qpu_compete', 'qpu_prove'] as const
  const crypto = ['crypto_catalog', 'crypto_shor', 'crypto_cmodexp', 'crypto_iqft', 'crypto_shots', 'crypto_rsa', 'crypto_split', 'crypto_verify'] as const
  const storage = ['storage_catalog', 'storage_list', 'storage_get', 'storage_put', 'storage_del', 'storage_monitor', 'storage_maintain', 'storage_raid'] as const
  const network = ['net_catalog', 'net_list', 'net_send', 'net_recv', 'net_message', 'net_routes', 'net_fetch', 'net_monitor'] as const
  const server = ['server_catalog', 'server_backend', 'server_submit', 'server_queue', 'server_result', 'server_shots', 'server_correct', 'server_monitor'] as const
  const payload = ['findPages', 'findUsers', 'findMedia', 'findTenants'] as const

  const listed = await rpcOf('/mcp', 'tools/list')
  assert.deepEqual(listed.tools?.map((t) => t.name), [...sealed, ...crypto])
  assert.equal(listed.tools?.length, 16)
  assert.equal(listed.tools?.every((t) => t.man === undefined), true)

  for (const [path, names] of [
    ['/storage', storage],
    ['/network', network],
    ['/server', server],
  ] as const) {
    const extra = await rpcOf(path, 'tools/list')
    assert.deepEqual(extra.tools?.map((t) => t.name), [...names], path)
    assert.equal(extra.tools?.length, 8, path)
  }

  const morph = [...crypto, ...storage, ...network, ...server, ...payload, 'install'] as const
  for (const name of morph) {
    const man = (await mcpOf(name, { man: true })) as { kind: string; name: string; holds: boolean; documentation: string }
    assert.equal(man.kind, 'man', name)
    assert.equal(man.name, name)
    assert.equal(man.holds, true, name)
    assert.equal(man.documentation.includes('NAME'), true, name)
  }

  const catalog = (await mcpOf('crypto_catalog')) as { kind: string; sealed: boolean; morph: boolean; holds: boolean; tools: string[]; rsa: { kind: string; factored: boolean } }
  assert.equal(catalog.kind, 'cybersecurity')
  assert.equal(catalog.sealed, false)
  assert.equal(catalog.morph, true)
  assert.equal(catalog.holds, true)
  assert.equal(catalog.rsa.kind, 'rsa')
  assert.equal(catalog.rsa.factored, true)
  assert.deepEqual(catalog.tools, [...crypto])

  const stored = (await mcpOf('storage_catalog')) as { kind: string; holds: boolean; tools: { name: string }[] }
  assert.equal(stored.kind, 'storage')
  assert.equal(stored.holds, true)
  assert.deepEqual(stored.tools.map((t) => t.name), [...storage])

  const net = (await mcpOf('net_catalog')) as { kind: string; holds: boolean; tools: { name: string }[] }
  assert.equal(net.kind, 'network')
  assert.equal(net.holds, true)
  assert.deepEqual(net.tools.map((t) => t.name), [...network])

  const jobs = (await mcpOf('server_catalog')) as { kind: string; holds: boolean; tools: { name: string }[] }
  assert.equal(jobs.kind, 'server')
  assert.equal(jobs.holds, true)
  assert.deepEqual(jobs.tools.map((t) => t.name), [...server])

  const put = (await mcpOf('storage_put', { key: 'mcp/web', value: 8 })) as { holds: boolean; key: string }
  const got = (await mcpOf('storage_get', { key: 'mcp/web' })) as { holds: boolean }
  const raid = (await mcpOf('storage_raid')) as { holds: boolean; cluster: { security: string } }
  assert.equal(put.holds, true)
  assert.equal(got.holds, true)
  assert.equal(raid.holds, true)
  assert.equal(raid.cluster.security, 'crypt')

  const sent = (await mcpOf('net_send', { channel: 'mcp', body: 'web' })) as { holds: boolean }
  const recv = (await mcpOf('net_recv', { channel: 'mcp' })) as { holds: boolean; value: unknown }
  const fetched = (await mcpOf('net_fetch', { path: '/mcp' })) as { holds: boolean; named: boolean; hostEscape: boolean }
  assert.equal(sent.holds, true)
  assert.equal(recv.holds, true)
  assert.equal(fetched.holds, true)
  assert.equal(fetched.named, true)
  assert.equal(fetched.hostEscape, false)

  const submitted = (await mcpOf('server_submit')) as { holds: boolean; id: number }
  const result = (await mcpOf('server_result', { id: submitted.id })) as { holds: boolean; id: number }
  const shots = (await mcpOf('server_shots')) as { holds: boolean }
  assert.equal(submitted.holds, true)
  assert.equal(result.holds, true)
  assert.equal(result.id, submitted.id)
  assert.equal(shots.holds, true)

  const found = (await mcpOf('findPages')) as { kind: string; morph: boolean; sealed: boolean; holds: boolean }
  const apk = (await mcpOf('apk', { verb: 'ask' })) as { kind: string; sealed: number; holds: boolean }
  assert.equal(found.kind, 'payload')
  assert.equal(found.morph, true)
  assert.equal(found.sealed, false)
  assert.equal(found.holds, true)
  assert.equal(apk.kind, 'install')
  assert.equal(apk.sealed, 8)
  assert.equal(apk.holds, true)

  const listedAfter = await rpcOf('/mcp', 'tools/list')
  assert.equal(listedAfter.tools?.length, 16)
})

type ShownPayload = {
  holds?: boolean
  kind?: string
  name?: string
  id?: unknown
  sealed?: unknown
  morph?: unknown
  hostEscape?: unknown
  cluster?: { security?: string }
} & Record<string, unknown>

type ShownCall = {
  jsonrpc: string
  id: unknown
  result: {
    _meta?: { resultType?: string; role?: string }
    isError?: boolean
    role?: string
    content?: { type: string }[]
    structuredContent?: ShownPayload
  }
}

const callRpcOf = async (path: string, name: string, args: Record<string, unknown> = {}, id = 7) => {
  const res = await fetchOf(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'text/html' },
    body: JSON.stringify({ jsonrpc: '2.0', id, method: 'tools/call', params: { name, arguments: args } }),
  })
  assert.equal(res.status, 200, `${path} ${name}`)
  assert.equal(res.headers.get('access-control-allow-origin'), '*', name)
  assert.equal((res.headers.get('content-type') ?? '').includes('ld+json'), true, name)
  const body = (await res.json()) as ShownCall
  assert.equal(body.jsonrpc, '2.0', name)
  assert.equal(body.id, id, name)
  assert.equal(body.result._meta?.resultType, 'complete', name)
  assert.equal(body.result._meta?.role, 'tool', name)
  assert.equal((body.result.content?.length ?? 0) >= 1 && (body.result.content?.length ?? 0) <= 2, true, name) // text, plus a link only where a GET returns the reply
  const shown = body.result.structuredContent
  assert.equal(shown !== undefined, true, name)
  const payload = shown as ShownPayload
  assert.equal(body.result.isError, payload.holds !== true, name)
  return { res, body, shown: payload }
}

test('production grade MCP — every tool listed, called, and usable', async (t) => {
  const sealed = ['qpu_quantum', 'qpu_lean', 'qpu_cite', 'qpu_train', 'qpu_forge', 'qpu_improve', 'qpu_compete', 'qpu_prove'] as const
  const crypto = ['crypto_catalog', 'crypto_shor', 'crypto_cmodexp', 'crypto_iqft', 'crypto_shots', 'crypto_rsa', 'crypto_split', 'crypto_verify'] as const
  const storage = ['storage_catalog', 'storage_list', 'storage_get', 'storage_put', 'storage_del', 'storage_monitor', 'storage_maintain', 'storage_raid'] as const
  const network = ['net_catalog', 'net_list', 'net_send', 'net_recv', 'net_message', 'net_routes', 'net_fetch', 'net_monitor'] as const
  const server = ['server_catalog', 'server_backend', 'server_submit', 'server_queue', 'server_result', 'server_shots', 'server_correct', 'server_monitor'] as const
  const payload = ['findPages', 'findUsers', 'findMedia', 'findTenants'] as const

  await t.test('CORS initialize ping and GET catalog', async () => {
    const preflight = await worker.fetch(
      new Request(`${origin}/mcp`, {
        method: 'OPTIONS',
        headers: { origin: 'https://example.com', 'access-control-request-method': 'POST' },
      }),
      env,
    )
    assert.equal(preflight.status, 204)
    assert.equal(preflight.headers.get('access-control-allow-origin'), '*')
    const discovered = await rpcOf('/mcp', 'initialize')
    assert.equal(discovered.holds, true)
    assert.equal((discovered.serverInfo as { name?: string } | undefined)?.name, '@uuidna/qpu')
    const ping = await rpcOf('/mcp', 'ping')
    assert.deepEqual(ping, {})
    const ready = await rpcOf('/mcp', 'notifications/initialized')
    assert.deepEqual(ready, {})
    const page = await fetchOf('/mcp')
    assert.equal(page.status, 200)
    assert.equal(page.headers.get('access-control-allow-origin'), '*')
    const catalog = (await page.json()) as {
      holds: boolean
      tools: { name: string }[]
      cybersecurity: { listed: boolean; sealed: boolean; morph: boolean; rsa: { kind: string; factored: boolean; unlocked: boolean; modulus: number }; encrypt: { kind: string; theorem: string; identity: boolean; holds: boolean }; tools: { name: string }[] }
      prove: { shor: { rsa: boolean; p: number; q: number; n: number; unlocked: boolean } }
    }
    assert.equal(catalog.holds, true)
    assert.deepEqual(catalog.tools.map((row) => row.name), [...sealed])
    assert.equal(catalog.cybersecurity.listed, true)
    assert.equal(catalog.cybersecurity.sealed, false)
    assert.equal(catalog.cybersecurity.morph, true)
    assert.equal(catalog.cybersecurity.rsa.kind, 'rsa')
    assert.equal(catalog.cybersecurity.rsa.factored, true)
    assert.equal(catalog.cybersecurity.rsa.unlocked, true)
    assert.equal(catalog.cybersecurity.encrypt.kind, 'encrypt')
    assert.equal(catalog.cybersecurity.encrypt.theorem, 'crypto')
    assert.equal(catalog.cybersecurity.encrypt.identity, true)
    assert.equal(catalog.cybersecurity.encrypt.holds, true)
    assert.equal(catalog.cybersecurity.rsa.modulus, 91)
    assert.deepEqual(catalog.cybersecurity.tools.map((row) => row.name), [...crypto])
    assert.equal(catalog.prove.shor.rsa, true)
    assert.equal(catalog.prove.shor.n, 91)
    assert.equal(catalog.prove.shor.unlocked, true)
    assert.equal(catalog.prove.shor.p * catalog.prove.shor.q, catalog.prove.shor.n)
  })

  await t.test('listed tools expose schema man and envelope', async () => {
    const listed = await rpcOf('/mcp', 'tools/list')
    const names = listed.tools?.map((row) => row.name) ?? []
    assert.deepEqual(names, [...sealed, ...crypto])
    assert.equal(listed.tools?.every((row) => row.man === undefined), true)
    for (const row of listed.tools ?? []) {
      const shape = row as { name: string; inputSchema?: { type?: string }; input_schema?: unknown; parameters?: unknown; function?: unknown }
      assert.equal(shape.inputSchema?.type, 'object', row.name)
      // plain MCP on the wire: the vendor shapes live on the JSON-LD catalogue (GET /mcp), not in tools/list
      assert.equal(shape.input_schema, undefined, row.name)
      assert.equal(shape.parameters, undefined, row.name)
      assert.equal(shape.function, undefined, row.name)
    }
    for (const name of names) {
      const man = await callRpcOf('/mcp', name, { man: true })
      assert.equal(man.shown.kind, 'man', name)
      assert.equal(man.shown.name, name)
      assert.equal(man.shown.holds, true, name)
      if (name.startsWith('crypto_')) {
        const doc = typeof man.shown.documentation === 'string' ? man.shown.documentation : ''
        const factors = name !== 'crypto_split'
        const encrypts = name === 'crypto_catalog' || name === 'crypto_split' || name === 'crypto_verify'
        assert.equal(!factors || doc.includes('theorem shor'), true, name)
        assert.equal(!encrypts || doc.includes('theorem crypto'), true, name)
      }
      const called = await callRpcOf('/mcp', name)
      assert.equal(called.shown.holds, true, name)
    }
  })

  await t.test('extras catalogs list eight and run every tool', async () => {
    for (const [path, names] of [
      ['/storage', storage],
      ['/network', network],
      ['/server', server],
    ] as const) {
      const hello = await rpcOf(path, 'initialize')
      assert.equal(hello.holds, true, path)
      const extra = await rpcOf(path, 'tools/list')
      assert.deepEqual(extra.tools?.map((row) => row.name), [...names], path)
      for (const name of names) {
        const man = await callRpcOf(path, name, { man: true })
        assert.equal(man.shown.kind, 'man', name)
        assert.equal(man.shown.holds, true, name)
        const viaMcp = await callRpcOf('/mcp', name, { man: true })
        assert.equal(viaMcp.shown.name, name)
        assert.equal(viaMcp.shown.holds, true, name)
      }
    }
  })

  await t.test('storage RAID lifecycle via MCP', async () => {
    const putDocs = await callRpcOf('/mcp', 'storage_put', { key: 'docs/mcp', value: { kind: 'docs', row: 0 } })
    const putNotes = await callRpcOf('/storage', 'storage_put', { key: 'notes/mcp', value: { kind: 'notes', row: 1 } })
    assert.equal(putDocs.shown.holds, true)
    assert.equal(putNotes.shown.holds, true)
    const got = await callRpcOf('/mcp', 'storage_get', { key: 'docs/mcp' })
    const listed = await callRpcOf('/mcp', 'storage_list')
    const monitor = await callRpcOf('/mcp', 'storage_monitor')
    const maintain = await callRpcOf('/mcp', 'storage_maintain')
    const raid = await callRpcOf('/mcp', 'storage_raid')
    assert.equal(got.shown.holds, true)
    assert.equal(listed.shown.holds, true)
    assert.equal(monitor.shown.holds, true)
    assert.equal(maintain.shown.holds, true)
    assert.equal(raid.shown.holds, true)
    assert.equal((raid.shown.cluster as { security?: string } | undefined)?.security, 'crypt')
    const dropped = await callRpcOf('/mcp', 'storage_del', { key: 'docs/mcp' })
    assert.equal(dropped.shown.holds, true)
  })

  await t.test('network lanes via MCP', async () => {
    const sent = await callRpcOf('/network', 'net_send', { channel: 'grade', body: 'web' })
    const recv = await callRpcOf('/mcp', 'net_recv', { channel: 'grade' })
    const listed = await callRpcOf('/mcp', 'net_list')
    const routes = await callRpcOf('/mcp', 'net_routes')
    const message = await callRpcOf('/mcp', 'net_message', { lane: 0, body: 'public' })
    const fetched = await callRpcOf('/mcp', 'net_fetch', { path: '/' })
    const monitor = await callRpcOf('/mcp', 'net_monitor')
    assert.equal(sent.shown.holds, true)
    assert.equal(recv.shown.holds, true)
    assert.equal(listed.shown.holds, true)
    assert.equal(routes.shown.holds, true)
    assert.equal(message.shown.holds, true)
    assert.equal(fetched.shown.holds, true)
    assert.equal(fetched.shown.hostEscape, false)
    assert.equal(monitor.shown.holds, true)
  })

  await t.test('server jobs via MCP', async () => {
    const backend = await callRpcOf('/server', 'server_backend')
    const submitted = await callRpcOf('/mcp', 'server_submit')
    const queue = await callRpcOf('/mcp', 'server_queue')
    const result = await callRpcOf('/mcp', 'server_result', { id: submitted.shown.id })
    const shots = await callRpcOf('/mcp', 'server_shots')
    const correct = await callRpcOf('/mcp', 'server_correct')
    const monitor = await callRpcOf('/mcp', 'server_monitor')
    assert.equal(backend.shown.holds, true)
    assert.equal(submitted.shown.holds, true)
    assert.equal(queue.shown.holds, true)
    assert.equal(result.shown.holds, true)
    assert.equal(result.shown.id, submitted.shown.id)
    assert.equal(shots.shown.holds, true)
    assert.equal(correct.shown.holds, true)
    assert.equal(monitor.shown.holds, true)
  })

  await t.test('payload finds and installer via MCP', async () => {
    for (const name of payload) {
      const found = await callRpcOf('/mcp', name)
      assert.equal(found.shown.kind, 'payload', name)
      assert.equal(found.shown.holds, true, name)
      assert.equal(found.shown.morph, true, name)
      assert.equal(found.shown.sealed, false, name)
    }
    const ask = await callRpcOf('/mcp', 'install', { reset: true })
    assert.equal(ask.shown.kind, 'install')
    assert.equal(ask.shown.holds, true)
    assert.equal(ask.shown.sealed, 8)
  })
})

test('protocol errors are JSON-RPC errors, an unknown tool is an error, and a job says its result is inline', async () => {
  type RpcError = { jsonrpc: string; id: unknown; error: { code: number; message: string; data?: { tools?: string[]; methods?: string[] } }; result?: unknown }
  const post = async (path: string, body: string) => {
    const res = await fetchOf(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body })
    return { status: res.status, json: (await res.json()) as RpcError & Record<string, unknown> }
  }
  // a body that is not JSON: parse error on 400, id null
  const parse = await post('/mcp', 'not json')
  assert.equal(parse.status, 400)
  assert.deepEqual({ jsonrpc: parse.json.jsonrpc, id: parse.json.id, code: parse.json.error.code }, { jsonrpc: '2.0', id: null, code: -32700 })
  // a JSON body that is not a request object, or has no method: invalid request on 400
  for (const body of ['[]', '{"jsonrpc":"2.0","id":9}', '"text"', 'null']) {
    const invalid = await post('/mcp', body)
    assert.equal(invalid.status, 400, body)
    assert.equal(invalid.json.error.code, -32600, body)
  }
  assert.equal((await post('/mcp', '{"jsonrpc":"2.0","id":9}')).json.id, 9)
  // a method this server does not have: method not found on 200, with the methods it does have
  const method = await post('/mcp', '{"jsonrpc":"2.0","id":3,"method":"resources/list"}')
  assert.equal(method.status, 200)
  assert.equal(method.json.id, 3)
  assert.equal(method.json.error.code, -32601)
  assert.equal(method.json.error.data?.methods?.includes('tools/call'), true)
  assert.equal('holds' in method.json, false)
  // a tool this server does not have, or a call that names none: invalid params on 200, with the tools it lists; never the root document
  for (const body of ['{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"nope"}}', '{"jsonrpc":"2.0","id":4,"method":"tools/call"}']) {
    const unknown = await post('/mcp', body)
    assert.equal(unknown.status, 200, body)
    assert.equal(unknown.json.id, 4, body)
    assert.equal(unknown.json.error.code, -32602, body)
    assert.equal(unknown.json.error.data?.tools?.length, 16, body)
    assert.equal(unknown.json.result, undefined, body)
  }
  // the sub-servers decline the same way instead of turning the body into a job
  const subUnknown = await post('/server', '{"jsonrpc":"2.0","id":5,"method":"tools/call","params":{"name":"nope"}}')
  assert.equal(subUnknown.json.error.code, -32602)
  const subMethod = await post('/server', '{"jsonrpc":"2.0","id":6,"method":"nope"}')
  assert.equal(subMethod.json.error.code, -32601)
  assert.equal(subMethod.json.result, undefined)
  // a known call still answers with a result and no error
  const known = await post('/mcp', '{"jsonrpc":"2.0","id":8,"method":"tools/call","params":{"name":"qpu_cite"}}')
  assert.equal(known.status, 200)
  assert.equal(known.json.error, undefined)
  assert.notEqual(known.json.result, undefined)
  // a job's result is in the submit reply; the reply says nothing is stored and links the server, not an id that will not resolve
  const job = await post('/server', '{"gates":[{"name":"h","q":0},{"name":"cnot","c":0,"t":1}]}')
  const j = job.json as unknown as { kind: string; id: number; href: string; stored: boolean; result: string; index: number; counts: unknown; holds: boolean }
  assert.equal(job.status, 200)
  assert.equal(j.kind, 'job')
  assert.equal(j.stored, false)
  assert.equal(j.result, 'inline')
  assert.equal(j.href, `${origin}/server`)
  assert.equal(typeof j.index, 'number')
  assert.notEqual(j.counts, undefined)
  // the id resolves only inside the isolate that ran it (here, this process); an id nobody ran is a 404 that says why
  const same = await fetchOf(`/server/${j.id}`)
  assert.equal(same.status, 200)
  assert.equal(((await same.json()) as { stored: boolean }).stored, false)
  const gone = await fetchOf('/server/999999')
  assert.equal(gone.status, 404)
  const g = (await gone.json()) as { denied: string; why: string; holds: boolean }
  assert.equal(g.denied, 'job')
  assert.equal(g.holds, false)
  assert.equal(g.why.includes('not stored'), true)
})

test('the catalog says sixteen, a job says how its gates were read, shots say they are enumerated, and the words are served', async () => {
  const page = (await (await fetchOf('/')).json()) as { docs: { api: { path: string; method: string; reading: string }[] }; shor: { measure: { sampled: boolean; enumerated: boolean; shots: number; outcomes: number[] } }; purpose: { nature: { product: boolean; entangled: boolean; entangle?: unknown } }; glossary: Record<string, string> }
  const catalog = page.docs.api.find((r) => r.path === '/mcp' && r.method === 'GET')!
  assert.equal(catalog.reading.startsWith('tools 16 in tools/list: 8 doors and 8 cybersecurity.'), true)
  const discovered = await rpcOf('/mcp', 'initialize', {})
  assert.equal(typeof discovered.instructions === 'string' && discovered.instructions.includes('Sixteen tools'), true)
  const listed = await rpcOf('/mcp', 'tools/list')
  assert.equal(listed.tools?.length, 16)
  // the Bell measurement's shots are the support enumerated, and say so
  assert.equal(page.shor.measure.sampled, false)
  assert.equal(page.shor.measure.enumerated, true)
  assert.equal(page.shor.measure.outcomes.length, page.shor.measure.shots)
  // nature says entangled and product, never a field named entangle holding the product flag
  assert.equal(page.purpose.nature.product, false)
  assert.equal(page.purpose.nature.entangled, true)
  assert.equal('entangle' in page.purpose.nature, false)
  // the glossary is served on the root and says what holds is not
  assert.equal(page.glossary.holds.includes('not a claim'), true)
  assert.equal(page.glossary.sampled.includes('false'), true)
  const proved = await callRpcOf('/mcp', 'qpu_prove')
  assert.equal(typeof (proved.shown as { glossary?: { holds?: string } }).glossary?.holds, 'string')
  // a job reads its gates: read, absent, or default — and a defaulted circuit does not hold
  const post = async (body: unknown) => (await (await fetchOf('/server', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })).json()) as { read: string; dropped: number; gates: string[]; holds: boolean }
  const read = await post({ gates: [{ name: 'h', q: 0 }, { name: 'x', q: 1 }, { nope: true }] })
  assert.equal(read.read, 'read')
  assert.equal(read.dropped, 1)
  assert.deepEqual(read.gates, ['h', 'x'])
  assert.equal(read.holds, true)
  const absent = await post({})
  assert.equal(absent.read, 'absent')
  assert.deepEqual(absent.gates, ['h', 'cnot'])
  assert.equal(absent.holds, true)
  const nonsense = await post({ gates: 'nope' })
  assert.equal(nonsense.read, 'default')
  assert.deepEqual(nonsense.gates, ['h', 'cnot'])
  assert.equal(nonsense.holds, false)
  const empty = await post({ gates: [{ name: 'teleport' }, 5] })
  assert.equal(empty.read, 'default')
  assert.equal(empty.dropped, 2)
  assert.equal(empty.holds, false)
})

// initialize NEGOTIATES: a supported version is echoed, an unknown one gets the latest supported. An external audit
// (2026-09-12) found the reply always said 2026-07-28, a version no client had ever sent.
test('initialize echoes a supported protocol version and never invents one', async () => {
  const ask = async (protocolVersion: unknown) => {
    const res = await fetchOf('/mcp', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'text/html' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion, capabilities: {}, clientInfo: { name: 'audit', version: '1' } } }),
    })
    return ((await res.json()) as { result: { protocolVersion: string; versions: string[] } }).result
  }
  assert.equal((await ask('2024-11-05')).protocolVersion, '2024-11-05')
  assert.equal((await ask('2025-06-18')).protocolVersion, '2025-06-18')
  assert.equal((await ask('2026-07-28')).protocolVersion, '2025-06-18')
  assert.equal((await ask(undefined)).protocolVersion, '2025-06-18')
  assert.deepEqual((await ask(undefined)).versions, ['2024-11-05', '2025-03-26', '2025-06-18'])
})

test('every listed tool carries an output schema read from its own replies, and a held-out reply validates against it', async () => {
  type Schema = { type: string; properties: Record<string, { type: string | string[]; properties?: Record<string, { type: string | string[] }> }>; required: string[]; description: string }
  const listed = await rpcOf('/mcp', 'tools/list')
  const tools = (listed.tools ?? []) as { name: string; outputSchema: Schema }[]
  assert.equal(tools.length, 16)
  const typeOf = (v: unknown): string => (v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v === 'number' ? (Number.isInteger(v) ? 'integer' : 'number') : typeof v)
  const fits = (t: string | string[], v: unknown): boolean => (Array.isArray(t) ? t : [t]).includes(typeOf(v)) || (typeOf(v) === 'integer' && (Array.isArray(t) ? t : [t]).includes('number'))
  const validate = (schema: Schema, reply: Record<string, unknown>): string[] => {
    const errs: string[] = []
    for (const k of schema.required) if (!(k in reply)) errs.push(`${k} required`)
    for (const [k, v] of Object.entries(reply)) {
      const prop = schema.properties[k]
      if (!prop) continue
      if (!fits(prop.type, v)) errs.push(`${k}: ${typeOf(v)} not ${JSON.stringify(prop.type)}`)
      if (prop.properties && v && typeof v === 'object' && !Array.isArray(v)) {
        for (const [ik, iv] of Object.entries(v as Record<string, unknown>)) {
          const ip = prop.properties[ik]
          if (ip && !fits(ip.type, iv)) errs.push(`${k}.${ik}: ${typeOf(iv)} not ${JSON.stringify(ip.type)}`)
        }
      }
    }
    return errs
  }
  for (const t of tools) {
    assert.equal(t.outputSchema.type, 'object', t.name)
    assert.equal(t.outputSchema.required.includes('holds'), true, t.name)
    assert.deepEqual(t.outputSchema.properties.holds, { type: 'boolean' }, t.name)
    assert.equal(Object.keys(t.outputSchema.properties).length > 3, true, t.name)
    assert.equal(t.outputSchema.description.startsWith('derived from'), true, t.name)
  }
  // held-out replies: arguments the schema was not derived from
  const shor = tools.find((t) => t.name === 'crypto_shor')!.outputSchema
  for (const args of [{ n: 21, a: 2 }, { n: 91, a: 7 }, { n: '2305843009213693952', a: 3 }, { n: [15] }]) {
    const reply = (await callRpcOf('/mcp', 'crypto_shor', args)).shown as Record<string, unknown>
    assert.deepEqual(validate(shor, reply), [], JSON.stringify(args))
  }
  const rsa = tools.find((t) => t.name === 'crypto_rsa')!.outputSchema
  assert.deepEqual(validate(rsa, (await callRpcOf('/mcp', 'crypto_rsa', { n: 35, a: 6 })).shown as Record<string, unknown>), [])
  for (const name of ['qpu_cite', 'qpu_lean', 'crypto_verify', 'crypto_split']) {
    const schema = tools.find((t) => t.name === name)!.outputSchema
    assert.deepEqual(validate(schema, (await callRpcOf('/mcp', name)).shown as Record<string, unknown>), [], name)
  }
  // the mutation arm: a reply without holds, and a reply whose n is an object, fail
  const good = (await callRpcOf('/mcp', 'crypto_shor', { n: 15, a: 7 })).shown as Record<string, unknown>
  const { holds: _dropped, ...noHolds } = good
  assert.equal(validate(shor, noHolds).includes('holds required'), true)
  assert.equal(validate(shor, { ...good, n: { bent: true } }).length > 0, true)
})

test('a reply carries its payload twice, as text and as structure, and links only to a page that returns the same document', async () => {
  const listed = await rpcOf('/mcp', 'tools/list')
  const names = (listed.tools ?? []).map((t) => t.name)
  assert.equal(names.length, 16)
  let linked = 0
  for (const name of names) {
    const res = await fetchOf('/mcp', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name } }) })
    const body = (await res.json()) as { result: { content: { type: string; text?: string; uri?: string }[]; structuredContent: unknown; isError: boolean; _meta: Record<string, unknown> } }
    const r = body.result
    assert.deepEqual(Object.keys(r).sort(), ['_meta', 'content', 'isError', 'structuredContent'], name)
    const payload = JSON.stringify(r.structuredContent)
    assert.equal(r.content[0]?.type, 'text', name)
    assert.equal(r.content[0]?.text, payload, name)
    assert.equal(r.content.length <= 2, true, name)
    assert.equal('output' in r._meta, false, name)
    assert.equal('functionResponse' in r._meta, false, name)
    // two copies and a small envelope: never more than 2.2 times the payload plus a kilobyte
    assert.equal(JSON.stringify(r).length < payload.length * 2.2 + 1024, true, `${name}: ${JSON.stringify(r).length} B for a ${payload.length} B payload`)
    const link = r.content.find((c) => c.type === 'resource_link')
    if (link) {
      linked += 1
      assert.equal(link.uri, r._meta.resource, name)
      const page = await fetchOf(new URL(link.uri!).pathname)
      assert.equal(page.status, 200, name)
      assert.deepEqual(await page.json(), r.structuredContent, `${name}: GET ${link.uri} must return the reply it links`)
    } else {
      assert.equal('resource' in r._meta, false, name)
    }
  }
  assert.equal(linked, 2)
})
