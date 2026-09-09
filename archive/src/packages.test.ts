import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { QPU_DEV_PACKAGES, QPU_PKG_STAMP, qpuPackagesHolds, qpuPackagesOf } from './packages.js'
import { QPU_MCP_NAME, QPU_VERSION } from './version.js'
import { QPU_NATIVE, handleQpuEmail, handleQpuQueue, handleQpuSse, qpuWsFrameOf } from './scale.js'
import { qpuSeatOf } from './hologram.js'

test('zero runtime deps; exact allowlisted pins; stamp matches package.json', () => {
  const p = qpuPackagesOf()
  assert.equal(p.runtime, 0)
  assert.deepEqual(p.unknown, [])
  assert.deepEqual(p.missing, [])
  assert.deepEqual(p.floating, [])
  assert.equal(p.exact, true)
  assert.equal(p.dev, QPU_DEV_PACKAGES.length)
  assert.equal(qpuPackagesHolds(), true)
  const file = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'package.json'), 'utf8')) as {
    name: string
    version: string
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
    engines?: { node?: string }
  }
  assert.deepEqual(file.dependencies ?? {}, {})
  assert.deepEqual(file.devDependencies, QPU_PKG_STAMP.devDependencies)
  assert.equal(file.engines?.node, QPU_PKG_STAMP.engines?.node)
  assert.equal(QPU_PKG_STAMP.version, file.version)
  assert.equal(QPU_PKG_STAMP.name, file.name)
  assert.equal(QPU_VERSION, file.version, 'MCP initialize and the stamp must advertise package.json')
  const tsconfig = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'tsconfig.json'), 'utf8')
  assert.match(tsconfig, /"strict": true/)
  assert.match(tsconfig, /"noEmitOnError": true/)
  assert.doesNotMatch(tsconfig, /"strictNullChecks": false/)
})

test('self-sufficient: no sibling package imports; native transports hold', async () => {
  const srcRoot = join(dirname(fileURLToPath(import.meta.url)), '..', 'src')
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const p = join(dir, e.name)
      if (e.isDirectory()) return e.name === 'node_modules' || e.name === 'dist' ? [] : walk(p)
      return e.name.endsWith('.ts') ? [p] : []
    })
  for (const file of walk(srcRoot)) {
    const src = readFileSync(file, 'utf8')
    assert.doesNotMatch(src, /from ['"]@uuidna\/uuidna['"]/, file)
    assert.doesNotMatch(src, /from ['"]@uuidna\/unreal['"]/, file)
  }
  assert.ok(QPU_NATIVE.some((t) => t.id === 'websocket'))
  assert.ok(QPU_NATIVE.some((t) => t.id === 'sse'))
  assert.ok(QPU_NATIVE.some((t) => t.id === 'queue'))
  assert.ok(QPU_NATIVE.some((t) => t.id === 'email'))
  assert.ok(QPU_NATIVE.some((t) => t.id === 'mcp'))
  const seat = await qpuWsFrameOf(JSON.stringify({ op: 'seat' })) as { seat: string }
  assert.equal(seat.seat, qpuSeatOf().seat)
  const sse = await handleQpuSse()
  assert.equal(sse.status, 200)
  assert.match(sse.headers.get('content-type') ?? '', /text\/event-stream/)
  let acked = 0
  await handleQpuQueue({ messages: [{ body: JSON.stringify({ op: 'seat' }), ack: () => { acked += 1 } }] })
  assert.equal(acked, 1)
  const mail = await handleQpuEmail({ raw: 'email' })
  assert.equal(mail.ok, true)
})

test('MCP initialize advertises the package version', async () => {
  const { handleQpuMcpRpc } = await import('./mcp-rpc.js')
  const init = await handleQpuMcpRpc({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} }) as {
    result: { protocolVersion: string; serverInfo: { name: string; version: string } }
  }
  assert.equal(init.result.serverInfo.name, QPU_MCP_NAME)
  assert.equal(init.result.serverInfo.version, QPU_VERSION)
})
