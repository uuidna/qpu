import { test } from './receipted.js'
import assert from 'node:assert/strict'
import { qpuQuantumOf, qpuShorOf } from './index.js'

const html = { accept: 'text/html' }

test('live qpu.uuidna.com', async (t) => {
  const live = 'https://qpu.uuidna.com'
  const local = qpuQuantumOf()
  const root = await fetch(live, { headers: html })
  await t.test('chat fetch is JSON quantum', async () => {
    assert.equal(root.status, 200)
    assert.equal((root.headers.get('content-type') ?? '').includes('json'), true)
    const page = (await root.json()) as {
      kind: string
      holds: boolean
      fused: number
      next: number
      genesis: { domains: string[]; holds: boolean }
      circuit: { running: boolean; only: { holds: boolean; classical: boolean } }
      docs: { inline: boolean; guide: boolean }
    }
    assert.equal(page.kind, 'quantum')
    assert.equal(page.holds, true)
    assert.equal(page.fused, local.fused)
    assert.equal(page.next, local.next)
    assert.equal(page.next, page.fused + page.fused)
    assert.deepEqual(page.genesis.domains, ['scanner', 'radar'])
    assert.equal(page.genesis.holds, true)
    assert.equal(page.circuit.only.holds, true)
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
        next?: number
        structuredContent?: { holds?: boolean; fused?: number; next?: number; circuit?: { only: { holds: boolean } }; docs?: unknown }
        circuit?: { only: { holds: boolean } }
        docs?: unknown
      }
    }
    const shown = call.result.structuredContent ?? call.result
    assert.deepEqual(
      catalog.result.tools.slice(0, 8).map((t) => t.name),
      ['qpu_quantum', 'qpu_lean', 'qpu_cite', 'qpu_train', 'qpu_forge', 'qpu_improve', 'qpu_compete', 'qpu_prove'],
    )
    assert.equal(shown.holds, true)
    assert.equal(shown.fused, local.fused)
    assert.equal(shown.next, local.next)
    assert.equal(shown.circuit?.only.holds, true)
    assert.equal(shown.docs, undefined)
  })
  await t.test('chat uses every sealed door', async () => {
    const names = ['qpu_quantum', 'qpu_lean', 'qpu_cite', 'qpu_train', 'qpu_forge', 'qpu_improve', 'qpu_compete', 'qpu_prove'] as const
    const crypto = ['crypto_catalog', 'crypto_shor', 'crypto_cmodexp', 'crypto_iqft', 'crypto_shots', 'crypto_rsa', 'crypto_split', 'crypto_verify'] as const
    const discovered = await fetch(`${live}/mcp`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize' }),
    })
    assert.equal(discovered.status, 200)
    assert.equal(discovered.headers.get('access-control-allow-origin'), '*')
    const hello = (await discovered.json()) as { result: { holds?: boolean; instructions?: string; serverInfo?: { name: string } } }
    assert.equal(hello.result.holds, true)
    assert.equal(hello.result.serverInfo?.name, '@uuidna/qpu')
    const listed = await fetch(`${live}/mcp`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
    })
    assert.equal(listed.status, 200)
    const catalog = (await listed.json()) as { result: { tools: { name: string; man?: { holds?: boolean } }[] } }
    const listedNames = catalog.result.tools.map((row) => row.name)
    assert.deepEqual(listedNames.slice(0, 8), [...names])
    if (listedNames.length > 8) {
      assert.deepEqual(listedNames.slice(8), [...crypto])
    }
    for (const name of listedNames) {
      const man = await fetch(`${live}/mcp`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: { man: true } } }),
      })
      assert.equal(man.status, 200, name)
      const manBody = (await man.json()) as { result: { structuredContent?: { kind?: string; holds?: boolean }; holds?: boolean; kind?: string } }
      const manShown = manBody.result.structuredContent ?? manBody.result
      assert.equal(manShown.kind, 'man', name)
      assert.equal(manShown.holds, true, name)
      const called = await fetch(`${live}/mcp`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: {} } }),
      })
      assert.equal(called.status, 200, name)
      const body = (await called.json()) as {
        jsonrpc?: string
        result: {
          resultType?: string
          isError?: boolean
          content?: { type: string }[]
          holds?: boolean
          structuredContent?: { holds?: boolean }
        }
      }
      const shown = body.result.structuredContent ?? body.result
      assert.equal(body.jsonrpc, '2.0', name)
      assert.equal(body.result.resultType, 'complete', name)
      assert.equal(body.result.content?.length, 3, name)
      assert.equal(shown.holds, true, name)
      assert.equal(body.result.isError, false, name)
    }
  })
  await t.test('extras catalogs speak MCP JSON-RPC', async () => {
    const extras = [
      {
        path: '/storage',
        names: ['storage_catalog', 'storage_list', 'storage_get', 'storage_put', 'storage_del', 'storage_monitor', 'storage_maintain', 'storage_raid'],
        read: ['storage_catalog', 'storage_list', 'storage_get', 'storage_monitor', 'storage_raid'],
      },
      {
        path: '/network',
        names: ['net_catalog', 'net_list', 'net_send', 'net_recv', 'net_message', 'net_routes', 'net_fetch', 'net_monitor'],
        read: ['net_catalog', 'net_list', 'net_routes', 'net_fetch', 'net_monitor'],
      },
      {
        path: '/server',
        names: ['server_catalog', 'server_backend', 'server_submit', 'server_queue', 'server_result', 'server_shots', 'server_correct', 'server_monitor'],
        read: ['server_catalog', 'server_backend', 'server_queue', 'server_shots', 'server_correct', 'server_monitor'],
      },
    ] as const
    for (const extra of extras) {
      const listed = await fetch(`${live}${extra.path}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
      })
      assert.equal(listed.status, 200, extra.path)
      assert.equal(listed.headers.get('access-control-allow-origin'), '*', extra.path)
      const catalog = (await listed.json()) as { result: { tools: { name: string }[] } }
      assert.deepEqual(catalog.result.tools.map((row) => row.name), [...extra.names], extra.path)
      for (const name of extra.names) {
        const man = await fetch(`${live}${extra.path}`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name, arguments: { man: true } } }),
        })
        assert.equal(man.status, 200, name)
        const manBody = (await man.json()) as { result: { structuredContent?: { kind?: string; holds?: boolean }; kind?: string; holds?: boolean } }
        const manShown = manBody.result.structuredContent ?? manBody.result
        assert.equal(manShown.kind, 'man', name)
        assert.equal(manShown.holds, true, name)
      }
      for (const name of extra.read) {
        const args = name === 'net_fetch' ? { path: '/' } : {}
        const called = await fetch(`${live}${extra.path}`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name, arguments: args } }),
        })
        assert.equal(called.status, 200, name)
        const body = (await called.json()) as { result: { holds?: boolean; structuredContent?: { holds?: boolean } } }
        const shown = body.result.structuredContent ?? body.result
        assert.equal(shown.holds, true, name)
      }
    }
  })
  await t.test('no auth message proxy', async () => {
    const inbox = await fetch(`${live}/message`, { headers: html })
    assert.equal(inbox.status, 200)
    assert.equal(inbox.headers.get('access-control-allow-origin'), '*')
    const proxy = (await inbox.json()) as { kind: string; proxy: boolean; auth: boolean; holds: boolean }
    assert.equal(proxy.kind, 'message')
    assert.equal(proxy.proxy, true)
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

/** The deployed host climbed the same way: the work register doubles each step, the modulus travels as exact decimal
 * text, and the measured growth between steps stops the climb before the budget, so the climb stops before the host does.
 * Where it stops is a reading of qpu.uuidna.com's reach, never a cap: nothing in the unit refuses a wider request. */
test('live reach: qpu.uuidna.com is climbed under a time budget, and the run at its reach holds', async (t) => {
  const live = 'https://qpu.uuidna.com'
  const floor = qpuShorOf()
  const budgetMs = 20000
  type Run = { circuitry: { qubits: number; holds: boolean }; exact: { n: string }; prepare: { prepared: boolean; amplitudes: number; sparse: boolean }; measure: { holds: boolean }; factors: { by: string } }
  const steps: { qubits: number; work: number; ms: number }[] = []
  let stoppedBy = 'nothing'
  for (let work = 8; ; work *= 2) {
    const modulus = (1n << BigInt(work)) - 1n
    const t0 = process.hrtime.bigint()
    const res = await fetch(`${live}/mcp`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'crypto_shor', arguments: { n: modulus.toString(), a: 3 } } }),
    })
    const ms = Number(process.hrtime.bigint() - t0) / 1e6
    assert.equal(res.status, 200, `qubits ${work + 2}`)
    const body = (await res.json()) as { result: { content: { text: string }[] } }
    const run = JSON.parse(body.result.content[0]!.text) as Run
    assert.equal(run.circuitry.qubits, work + 2)
    assert.equal(run.exact.n, modulus.toString())
    assert.equal(run.prepare.prepared, true)
    assert.equal(run.prepare.sparse, true)
    assert.equal(run.prepare.amplitudes > 0 && run.prepare.amplitudes <= 16, true)
    assert.equal(run.circuitry.holds, true)
    assert.equal(run.measure.holds, true)
    assert.equal(run.factors.by, 'gcd') // even work: 3 divides 2^work - 1, so the live climb measures width, never period-finding
    const prev = steps[steps.length - 1]
    steps.push({ qubits: run.circuitry.qubits, work, ms })
    if (ms > budgetMs) {
      stoppedBy = 'this step passed the budget'
      break
    }
    const growth = prev && prev.ms > 0 ? Math.max(ms / prev.ms, 1) : 1
    if (prev && ms * growth > budgetMs) {
      stoppedBy = `measured growth ×${growth.toFixed(2)} predicts the next step past the budget`
      break
    }
  }
  const reach = steps[steps.length - 1]!
  assert.equal(reach.qubits > floor.circuitry.qubits, true)
  t.diagnostic(`live reach ${reach.qubits} qubits · dim 2^${reach.qubits} · ${reach.ms.toFixed(0)} ms round trip · ${steps.length} steps · stopped: ${stoppedBy} · every step factored by gcd, none by period`)
})
