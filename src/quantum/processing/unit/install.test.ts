import { test } from 'node:test'
import assert from 'node:assert/strict'
import { qpuInstallOf, qpuPayloadMcpOf, qpuFusionOf, qpuMcpCallOf, qpuToolsOf, qpuPentagramOf } from './index.js'

const mcpOf = async (name: string, args: Record<string, unknown> = {}) => {
  const shown = (await qpuMcpCallOf(name, args)) as { structuredContent?: Record<string, unknown> } & Record<string, unknown>
  return shown.structuredContent ?? shown
}

test('interactive installer seats QPU, Payload MCP, and VitePress payload without a ninth sealed tool', async () => {
  qpuInstallOf({ reset: true })
  const ask = (await mcpOf('install', { reset: true })) as { kind: string; interactive: boolean; html: boolean; sealed: number; prompt: string; holds: boolean }
  assert.equal(ask.kind, 'install')
  assert.equal(ask.interactive, true)
  assert.equal(ask.html, false)
  assert.equal(ask.sealed, 8)
  assert.equal(ask.holds, true)
  assert.match(ask.prompt, /qpu\.uuidna\.com\/mcp/)

  await mcpOf('install', { yes: true, step: 0 })
  await mcpOf('install', { yes: true, step: 1 })
  await mcpOf('install', { yes: true, step: 2 })
  const simulated = (await mcpOf('install', { verb: 'simulate' })) as {
    plan: { added: string[]; removed: string[]; lossless: boolean }
    pending: string[]
  }
  assert.deepEqual(simulated.pending, ['qpu-mcp', 'payload-mcp', 'vitepress-payload'])
  assert.equal(simulated.plan.lossless, true)
  assert.equal(simulated.plan.removed.length, 0)

  const committed = (await mcpOf('install', { verb: 'commit', yes: true })) as { committed: boolean }
  assert.equal(committed.committed, true)
  const audited = (await mcpOf('install', { verb: 'audit' })) as {
    audit: boolean
    seated: string[]
    client: { qpu: { html: boolean }; vitepress: { qpu: boolean; concurrency: number } }
    payload: { write: boolean; morph: boolean; tools: { name: string }[] }
  }
  assert.equal(audited.audit, true)
  assert.deepEqual(audited.seated, ['qpu-mcp', 'payload-mcp', 'vitepress-payload'])
  assert.equal(audited.client.qpu.html, false)
  assert.equal(audited.client.vitepress.qpu, false)
  assert.equal(audited.client.vitepress.concurrency, 2)
  assert.equal(audited.payload.write, false)
  assert.equal(audited.payload.morph, true)
  assert.equal(audited.payload.tools.length, 4)
})

test('install select seats a combination in one call', async () => {
  qpuInstallOf({ reset: true })
  const mix = (await mcpOf('install', { line: '1 3 saas' })) as {
    pending: string[]
    occupancy: string
    cloudflare: { qpu: string }
    combinations: { key: string }[]
  }
  assert.deepEqual(mix.pending, ['qpu-mcp', 'vitepress-payload'])
  assert.equal(mix.occupancy, 'saas')
  assert.ok(mix.cloudflare.qpu.includes('github.com/uuidna/qpu'))
  assert.equal(mix.combinations.length, 3)
  const all = qpuInstallOf({ reset: true, all: true, verb: 'commit', yes: true })
  assert.equal(all.committed, true)
  assert.deepEqual(all.seated, ['qpu-mcp', 'payload-mcp', 'vitepress-payload'])
})

test('tools/list stays eight sealed tools; install and Payload finds morph at call time', async () => {
  const sealed = qpuToolsOf()
  assert.equal(sealed.length, 8)
  assert.deepEqual(sealed.map((t) => t.name), [
    'qpu_quantum',
    'qpu_lean',
    'qpu_cite',
    'qpu_train',
    'qpu_forge',
    'qpu_improve',
    'qpu_compete',
    'qpu_prove',
  ])

  const found = (await mcpOf('findPages')) as { kind: string; find: boolean; write: boolean; sealed: boolean; morph: boolean; holds: boolean }
  assert.equal(found.kind, 'payload')
  assert.equal(found.find, true)
  assert.equal(found.write, false)
  assert.equal(found.sealed, false)
  assert.equal(found.morph, true)
  assert.equal(found.holds, true)

  const apk = (await mcpOf('apk', { verb: 'ask' })) as { kind: string; interactive: boolean }
  assert.equal(apk.kind, 'install')
  assert.equal(apk.interactive, true)
})

test('fusion carries Payload MCP and the installer from harmonic schemas', () => {
  const payload = qpuPayloadMcpOf()
  assert.equal(payload.tools.length, 4)
  assert.equal(payload.write, false)
  assert.equal(payload.morph, true)
  const fusion = qpuFusionOf()
  assert.equal(fusion.payload.holds, true)
  assert.equal(fusion.install.kind, 'install')
  assert.equal(fusion.install.html, false)
  assert.equal(fusion.install.vitepress, false)
  assert.equal(fusion.faces, 14)
})

test('train dry-cleans occupancy — one pentagram, not a ninth tool', () => {
  const pentagram = qpuPentagramOf()
  const seated = qpuInstallOf({ reset: true, occupancy: 'saas' })
  assert.deepEqual(seated.occupancies, [...pentagram.occupancies])
  assert.equal(seated.occupancies.join(' '), 'personal business corporate saas paas')
  assert.equal(qpuToolsOf().length, 8)
})
