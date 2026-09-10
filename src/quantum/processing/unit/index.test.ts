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
    intelligence?: { kind: string; test: string; research: string; holds: boolean }
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
    only: { holds: boolean; classical: boolean }
    lattice: { occupied: number; vacant: number; holds: boolean }
    circuit: { running: boolean }
    docs: { inline: boolean; documentation: string }
    ui: { experienced: boolean; prove: string }
    speed: { cover: string[] }
    capacity: {
      infinite: boolean
      scaled: boolean
      next: number
      fused: number
      amplitudes: number
      faces: number
      crypt: { split: number; share: number; holds: boolean }
      kv: { kind: string; added: number; amplitudes: number; holds: boolean; name: string }
      agents: { free: boolean; auth: boolean; n: number; holds: boolean }
      schemas: { mounted: number; vacant: number; holds: boolean }
      raid: {
        holds: boolean
        rotate: boolean
        start: string
        cheapest: string
        cover: string[]
        pick: { name: string; cost: number }
        types: { name: string }[]
        clouds: { name: string }[]
        cluster: { safe: boolean; cost: string; rotate: boolean }
      }
      holds: boolean
    }
  }
  const catalog = (await catalogRes.json()) as {
    kind: string
    holds: boolean
    '@context': unknown
    '@type': string
    hasPart: { '@type': string; numberOfItems: number }
    prove: { ui: { experienced: boolean }; theorems: unknown[]; cern: { faces: number } }
    capacity: {
      infinite: boolean
      scaled: boolean
      agents: { free: boolean; auth: boolean; n: number }
      crypt: { holds: boolean }
      schemas: { mounted: number; vacant: number; holds: boolean }
      holds: boolean
    }
  }
  assert.equal(pageRes.status, 200)
  assert.equal((pageRes.headers.get('content-type') ?? '').includes('application/ld+json'), true)
  assert.equal(page.kind, 'quantum')
  assert.equal(page.holds, true)
  assert.equal(page.only.holds, true)
  assert.equal(page.only.classical, false)
  assert.equal(page.lattice.occupied, 14)
  assert.equal(page.lattice.vacant, 0)
  assert.equal(page.lattice.holds, true)
  assert.equal(page.circuit.running, true)
  assert.equal(page.docs.inline, true)
  assert.equal(page.ui.experienced, true)
  assert.equal(page.ui.prove, 'qpu_prove')
  assert.equal(page.docs.documentation.includes('JSON-LD UI'), true)
  assert.deepEqual(page.speed.cover, ['next', 'Hz', 'ns', 'benchmark'])
  assert.equal(page.capacity.infinite, true)
  assert.equal(page.capacity.scaled, true)
  assert.equal(page.capacity.holds, true)
  assert.equal(page.capacity.next, page.capacity.fused + page.capacity.fused)
  assert.equal(page.capacity.crypt.split, 14)
  assert.equal(page.capacity.crypt.holds, true)
  assert.equal(page.capacity.kv.kind, 'kv')
  assert.equal(page.capacity.kv.name, 'kv')
  assert.equal(page.capacity.kv.added, page.capacity.amplitudes)
  assert.equal(page.capacity.kv.amplitudes, page.capacity.fused / 14)
  assert.equal(page.capacity.kv.added + page.capacity.kv.added, page.capacity.kv.amplitudes)
  assert.equal(page.capacity.faces * page.capacity.kv.amplitudes, page.capacity.fused)
  assert.equal(page.capacity.kv.holds, true)
  assert.equal(page.docs.documentation.includes('KV added amplitudes'), true)
  assert.equal(page.capacity.agents.free, true)
  assert.equal(page.capacity.agents.auth, false)
  assert.equal(page.capacity.agents.n, 14)
  assert.equal(page.capacity.agents.holds, true)
  assert.equal(page.capacity.schemas.mounted, 14)
  assert.equal(page.capacity.schemas.vacant, 0)
  assert.equal(page.capacity.schemas.holds, true)
  assert.equal(page.capacity.raid.holds, true)
  assert.equal(page.capacity.raid.rotate, true)
  assert.equal(page.capacity.raid.start, 'cheapest')
  assert.equal(page.capacity.raid.cheapest, page.capacity.raid.cover[0])
  assert.equal(page.capacity.raid.cover.length, 14)
  assert.equal(page.capacity.raid.types.length, 14)
  assert.equal(page.capacity.raid.clouds.length, 14)
  assert.equal(page.capacity.raid.cluster.safe, true)
  assert.equal(page.capacity.raid.cluster.cost, 'minimum')
  assert.equal(page.capacity.raid.pick.name, page.capacity.raid.cover[0])
  assert.equal(catalog.kind, 'quantum')
  assert.equal(catalog.holds, true)
  assert.equal(catalog['@type'], 'WebAPI')
  assert.equal(Array.isArray(catalog['@context']), true)
  assert.equal((catalog['@context'] as unknown[])[0], 'https://schema.org')
  assert.equal(catalog.hasPart['@type'], 'ItemList')
  assert.equal(catalog.hasPart.numberOfItems, 8)
  assert.equal(catalog.capacity.infinite, true)
  assert.equal(catalog.capacity.scaled, true)
  assert.equal(catalog.capacity.holds, true)
  assert.equal(catalog.capacity.agents.free, true)
  assert.equal(catalog.capacity.agents.auth, false)
  assert.equal(catalog.capacity.agents.n, 14)
  assert.equal(catalog.capacity.crypt.holds, true)
  assert.equal(catalog.capacity.schemas.mounted, 14)
  assert.equal(catalog.capacity.schemas.vacant, 0)
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
  assert.equal(prove.intelligence?.kind, 'intelligence')
  assert.equal(prove.intelligence?.test, 'fusion')
  assert.equal(prove.intelligence?.research, 'free online')
  assert.equal(prove.intelligence?.holds, true)
  assert.equal(quantum.holds, true)
  assert.equal(quantum.ui.experienced, true)
  assert.equal(quantum.next, quantum.fused + quantum.fused)
  assert.equal(quantum.speed.holds, true)
  assert.equal(quantum.speed.next, quantum.next)
  assert.equal(ns > 0, true)
  const readme = qpuReadmeOf()
  assert.equal(qpuReadmeHolds(readme), true)
  assert.equal(readme.includes('JSON-LD UI'), true)
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
  assert.equal(train.vm.auth, false)
  assert.equal(train.vm.replicas, 8)
  assert.equal(train.vm.next, 16)
  assert.equal(train.vm.scaled, true)
  assert.equal(train.vm.infinite, true)
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
  assert.equal(improve.quantum.unlocked, true)
  assert.equal(improve.quantum.holds, true)
  assert.equal(improve.quantum.next, improve.after.throughoutput)
  assert.equal(improve.after.throughoutput, improve.before.throughoutput + improve.before.throughoutput)
  assert.equal(improve.after.throughoutput > improve.before.throughoutput, true)
  assert.equal(improve.used.length, 10)
  assert.equal(improve.used.every((u) => u.holds), true)
  assert.equal(improve.holds, true)
  assert.equal(compete.winner, 'call')
  assert.equal(compete.contest, 'throughoutput')
  assert.equal(compete.quantum.unlocked, true)
  assert.equal(compete.quantum.holds, true)
  assert.equal(compete.quantum.next, compete.teams[1]?.throughoutput)
  assert.equal(compete.teams[1]?.throughoutput, (compete.teams[0]?.throughoutput ?? 0) + (compete.teams[0]?.throughoutput ?? 0))
  assert.equal(compete.next[0], 'qpu_prove')
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

test('sandbox via mcp', async () => {
  const sandbox = (await mcpOf('qpu_forge')) as {
    kind: string
    unlocked: boolean
    memory: boolean
    eval: boolean
    fs: boolean
    net: boolean
    fetch: boolean
    process: boolean
    import: boolean
    disk: boolean
    worker: boolean
    quantum: boolean
    denied: unknown[]
    tools: { name: string }[]
    holds: boolean
  }
  assert.equal(sandbox.holds, true)
  assert.equal(sandbox.unlocked, true)
  assert.equal(sandbox.memory, true)
  assert.equal(sandbox.eval, true)
  assert.equal(sandbox.fs, true)
  assert.equal(sandbox.net, true)
  assert.equal(sandbox.fetch, true)
  assert.equal(sandbox.process, true)
  assert.equal(sandbox.import, true)
  assert.equal(sandbox.disk, true)
  assert.equal(sandbox.worker, true)
  assert.equal(sandbox.quantum, true)
  assert.equal(sandbox.denied.length, 0)
  assert.equal(sandbox.tools.some((t) => t.name === 'op_mint'), true)
  assert.equal(sandbox.tools.some((t) => t.name === 'slot_fused'), true)
  assert.equal(sandbox.tools.some((t) => t.name === 'op_quantum'), true)
  const unlockedQuantum = (await mcpOf('op_quantum')) as {
    value: { kind: string; unlocked: boolean; only: { holds: boolean; classical: boolean }; lattice: { occupied: number; vacant: number; holds: boolean } }
    memory: boolean
    holds: boolean
  }
  assert.equal(unlockedQuantum.value.kind, 'quantum')
  assert.equal(unlockedQuantum.value.unlocked, true)
  assert.equal(unlockedQuantum.value.only.holds, true)
  assert.equal(unlockedQuantum.value.only.classical, false)
  assert.equal(unlockedQuantum.value.lattice.occupied, 14)
  assert.equal(unlockedQuantum.value.lattice.vacant, 0)
  assert.equal(unlockedQuantum.value.lattice.holds, true)
  assert.equal(unlockedQuantum.memory, true)
  const mint = (await mcpOf('call_mint')) as { value: unknown; memory: boolean; unlocked: boolean; holds: boolean }
  assert.equal(mint.value, true)
  assert.equal(mint.memory, true)
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
  const evaluated = (await mcpOf('eval', { run: { op: 'mint', k: 3 } })) as { value: unknown }
  assert.equal(evaluated.value, 8)
  await mcpOf('op_put', { key: 'durable', value: 8 })
  await mcpOf('fs', { method: 'write', path: '/durable', value: 8 })
  await mcpOf('op_put', { key: 'parent', value: 1 })
  await mcpOf('worker', { run: { op: 'put', key: 'parent', value: 2 } })
  const heap = (await mcpOf('op_get', { key: 'durable' })) as { value: unknown }
  const disk = (await mcpOf('fs', { method: 'read', path: '/durable' })) as { value: unknown }
  const parent = (await mcpOf('op_get', { key: 'parent' })) as { value: unknown }
  assert.equal(heap.value, 8)
  assert.equal(disk.value, 8)
  assert.equal(parent.value, 1)
})

test('paste in free AI chat', async (t) => {
  await t.test('AI sees JSON unit not HTML', async () => {
    const res = await fetchOf('/')
    assert.equal(res.status, 200)
    assert.equal((res.headers.get('content-type') ?? '').includes('ld+json'), true)
    assert.equal((res.headers.get('content-type') ?? '').includes('text/html'), false)
    const page = (await res.json()) as {
      kind: string
      holds: boolean
      fused: number
      next: number
      only: { holds: boolean; classical: boolean }
      circuit: { running: boolean; only: { holds: boolean } }
      docs: { inline: boolean; guide: boolean; abstract: string; api: { method: string; path: string }[] }
      ui: { experienced: boolean; prove: string }
      speed: { cover: string[] }
      messaging: { await: boolean; when: string; proxy?: boolean; secure?: boolean; hop?: string }
    }
    const quantum = (await mcpOf('qpu_quantum')) as { fused: number; only: { holds: boolean } }
    assert.equal(page.kind, 'quantum')
    assert.equal(page.holds, true)
    assert.equal(page.only.holds, true)
    assert.equal(page.only.classical, false)
    assert.equal(page.circuit.running, true)
    assert.equal(page.circuit.only.holds, true)
    assert.equal(page.fused, quantum.fused)
    assert.equal(quantum.only.holds, true)
    assert.equal(page.next, page.fused + page.fused)
    assert.equal(page.docs.inline, true)
    assert.equal(page.docs.guide, true)
    assert.equal(page.ui.experienced, true)
    assert.equal(page.ui.prove, 'qpu_prove')
    assert.equal(page.docs.abstract.includes('Possible only in quantum'), true)
    assert.equal(page.docs.abstract.includes('running quantum circuit'), true)
    assert.equal(page.docs.abstract.includes('Quantum capacity infinite'), true)
    assert.equal(page.docs.abstract.includes('Crypt split'), true)
    assert.equal(page.docs.abstract.includes('free agents'), true)
    assert.equal(page.docs.abstract.includes('theorem infinite'), true)
    assert.equal(page.docs.abstract.includes('theorem distribute'), true)
    assert.equal(page.docs.abstract.includes(`GET ${origin}`), true)
    assert.equal(page.docs.abstract.includes(`POST ${origin}/mcp`), true)
    assert.equal(page.docs.abstract.includes('theorem quantum'), true)
    assert.equal(page.docs.abstract.includes('theorem raid'), true)
    assert.equal(page.docs.abstract.includes('theorem fusion'), true)
    assert.equal(page.docs.abstract.includes('free online research'), true)
    assert.equal(page.docs.abstract.includes('Start with cheapest and cover all'), true)
    assert.equal(page.docs.abstract.includes('minimum cost'), true)
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
    const call = (await called.json()) as {
      result: {
        holds?: boolean
        fused?: number
        ui?: { experienced: boolean }
        docs?: unknown
        structuredContent?: { holds?: boolean; fused?: number; ui?: { experienced: boolean }; docs?: unknown }
      }
    }
    const prove = (await proved.json()) as {
      result: { holds?: boolean; ui?: { experienced: boolean }; structuredContent?: { holds?: boolean; ui?: { experienced: boolean } } }
    }
    const callShown = call.result.structuredContent ?? call.result
    const proveShown = prove.result.structuredContent ?? prove.result
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
    assert.equal(callShown.holds, true)
    assert.equal(callShown.ui?.experienced, true)
    assert.equal(callShown.docs, undefined)
    assert.equal(proveShown.holds, true)
    assert.equal(proveShown.ui?.experienced, true)
    const pageBytes = (await page.clone().arrayBuffer()).byteLength
    const callBytes = JSON.stringify(callShown).length
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
      assert.equal((res.headers.get('content-type') ?? '').includes('ld+json'), true)
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
  await t.test('chat fetch is JSON quantum', async () => {
    assert.equal(root.status, 200)
    assert.equal((root.headers.get('content-type') ?? '').includes('json'), true)
    const page = (await root.json()) as {
      kind: string
      holds: boolean
      fused: number
      circuit: { running: boolean; only: { holds: boolean; classical: boolean } }
      docs: { inline: boolean; guide: boolean }
    }
    assert.equal(page.kind, 'quantum')
    assert.equal(page.holds, true)
    assert.equal(typeof page.fused, 'number')
    assert.equal(page.circuit.running, true)
    assert.equal(page.circuit.only.holds, true)
    assert.equal(page.circuit.only.classical, false)
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
    const call = (await called.json()) as {
      result: {
        holds?: boolean
        fused?: number
        structuredContent?: { holds?: boolean; fused?: number; circuit?: { only: { holds: boolean } }; docs?: unknown }
        circuit?: { only: { holds: boolean } }
        docs?: unknown
      }
    }
    const shown = call.result.structuredContent ?? call.result
    assert.equal(catalog.result.tools[0]?.name, 'qpu_quantum')
    assert.equal(shown.holds, true)
    assert.equal(typeof shown.fused, 'number')
    assert.equal(shown.circuit?.only.holds, true)
    assert.equal(shown.docs, undefined)
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

test('raid starts cheapest and covers all', async () => {
  const catalog = (await (await fetchOf('/storage')).json()) as {
    kind: string
    anything: boolean
    raid: {
      holds: boolean
      start: string
      cheapest: string
      cover: string[]
      pick: { name: string; cost: number }
      types: { name: string; cost: number; face: number }[]
      clouds: { name: string }[]
      cluster: { rotate: boolean; cost: string; security: string; speed: string }
    }
    hybrid: { speed: number; cost: number; layers: number; holds: boolean }
    payload: { key: string; seed: number; remainder: number; unity: boolean; collections: string[]; secrets: boolean }
    alpine: { native: boolean; os: string; libc: string; toolbox: string; fs: string; upper: string; lower: string; work: string; inode: boolean; unlink: boolean; next: number; fused: number; last: boolean; infinite: boolean }
    holds: boolean
  }
  assert.equal(catalog.kind, 'storage')
  assert.equal(catalog.anything, true)
  assert.equal(catalog.holds, true)
  assert.equal(catalog.hybrid.speed, 8)
  assert.equal(catalog.hybrid.cost, 3)
  assert.equal(catalog.payload.key, 'databases/payload')
  assert.equal(catalog.payload.seed, 1)
  assert.equal(catalog.payload.remainder, 0)
  assert.equal(catalog.payload.unity, true)
  assert.equal(catalog.payload.collections.join(' '), 'pages users media tenants')
  assert.equal(catalog.payload.secrets, false)
  assert.equal(catalog.alpine.native, true)
  assert.equal(catalog.alpine.os, 'alpine')
  assert.equal(catalog.alpine.libc, 'musl')
  assert.equal(catalog.alpine.toolbox, 'busybox')
  assert.equal(catalog.alpine.fs, 'overlay')
  assert.equal(catalog.alpine.upper, 'kv')
  assert.equal(catalog.alpine.lower, 'r2')
  assert.equal(catalog.alpine.work, 'kv')
  assert.equal(catalog.alpine.work, catalog.alpine.upper)
  assert.equal(catalog.alpine.inode, true)
  assert.equal(catalog.alpine.unlink, true)
  assert.equal(catalog.alpine.last, false)
  assert.equal(catalog.alpine.infinite, true)
  assert.equal(catalog.alpine.next, catalog.alpine.fused + catalog.alpine.fused)
  const seeded = (await (await fetchOf('/storage/databases/payload/seed')).json()) as {
    key: string
    seed: number
    remainder: number
    unity: boolean
    holds: boolean
    value: { key: string; seed: number; unity: boolean; secrets: boolean; collections: string[] }
  }
  assert.equal(seeded.holds, true)
  assert.equal(seeded.key, 'databases/payload/seed')
  assert.equal(seeded.seed, 1)
  assert.equal(seeded.remainder, 0)
  assert.equal(seeded.unity, true)
  assert.equal(seeded.value.secrets, false)
  assert.equal(seeded.value.collections.join(' '), 'pages users media tenants')
  assert.equal(catalog.raid.holds, true)
  assert.equal(catalog.raid.start, 'cheapest')
  assert.equal(catalog.raid.cheapest, '0')
  assert.equal(catalog.raid.cover[0], '0')
  assert.equal(catalog.raid.cover.length, 14)
  assert.equal(catalog.raid.types[0]?.name, '0')
  assert.equal(catalog.raid.types[0]?.cost, 1)
  assert.equal(catalog.raid.pick.name, catalog.raid.cover[0])
  assert.equal(catalog.raid.clouds.length, 14)
  assert.equal(catalog.raid.cluster.rotate, true)
  assert.equal(catalog.raid.cluster.cost, 'minimum')
  assert.equal(catalog.raid.cluster.security, 'crypt')
  assert.equal(catalog.raid.cluster.speed, 'coordinated')
    const picked: string[] = []
    for (let i = 0; i < 14; i++) {
      const res = await fetchOf(`/storage/docs/sheet-${i}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ kind: 'docs', row: i, value: i + i }),
      })
      assert.equal(res.status, 200)
    const stored = (await res.json()) as { holds: boolean; raid: { pick: { name: string }; cover: string[] }; value: { kind: string } }
    assert.equal(stored.holds, true)
    assert.equal(stored.value.kind, 'docs')
    picked.push(stored.raid.pick.name)
  }
  assert.deepEqual([...picked].sort(), [...catalog.raid.cover].sort())
  const got = (await (await fetchOf('/storage/docs/sheet-0')).json()) as { key: string; value: { kind: string; row: number }; holds: boolean }
  assert.equal(got.holds, true)
  assert.equal(got.key, 'docs/sheet-0')
  assert.equal(got.value.kind, 'docs')
  assert.equal(got.value.row, 0)
})

test('native Alpine inodes — referrer links, last unlink frees storage', async () => {
  const body = { kind: 'notes', n: 1 }
  const a = (await (await fetchOf('/storage/notes/alpha', {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })).json()) as { holds: boolean; inode: string; nlink: number; referrer: string; address: string; value: { kind: string } }
  assert.equal(a.holds, true)
  assert.equal(a.nlink, 1)
  assert.equal(a.value.kind, 'notes')
  assert.equal(typeof a.inode, 'string')
  assert.equal(a.referrer.includes(a.inode), true)
  const b = (await (await fetchOf('/storage/notes/beta', {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })).json()) as { holds: boolean; inode: string; nlink: number; referrer: string }
  assert.equal(b.holds, true)
  assert.equal(b.inode, a.inode)
  assert.equal(b.nlink, 2)
  const first = (await (await fetchOf('/storage/notes/alpha', { method: 'DELETE' })).json()) as { deleted: boolean; freed: boolean; nlink: number; holds: boolean }
  assert.equal(first.deleted, true)
  assert.equal(first.freed, false)
  assert.equal(first.nlink, 1)
  const still = (await (await fetchOf('/storage/notes/beta')).json()) as { holds: boolean; nlink: number; value: { kind: string } }
  assert.equal(still.holds, true)
  assert.equal(still.nlink, 1)
  assert.equal(still.value.kind, 'notes')
  const access = (await (await fetchOf(new URL(a.referrer).pathname)).json()) as { holds: boolean; inode: string; nlink: number }
  assert.equal(access.holds, true)
  assert.equal(access.inode, a.inode)
  const listed = (await (await fetchOf('/storage')).json()) as { keys: string[] }
  assert.equal(listed.keys.includes('notes/beta'), true)
  assert.equal(listed.keys.includes(`notes/${a.inode}`), false)
  const last = (await (await fetchOf('/storage/notes/beta', { method: 'DELETE' })).json()) as { deleted: boolean; freed: boolean; nlink: number }
  assert.equal(last.deleted, true)
  assert.equal(last.freed, true)
  assert.equal(last.nlink, 0)
  const gone = (await (await fetchOf('/storage/notes/beta')).json()) as { holds: boolean }
  assert.equal(gone.holds, false)
  const inodeGone = (await (await fetchOf(new URL(a.referrer).pathname)).json()) as { holds: boolean }
  assert.equal(inodeGone.holds, false)
})
