import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ErrorCode, LATEST_PROTOCOL_VERSION, McpError, SUPPORTED_PROTOCOL_VERSIONS } from '@modelcontextprotocol/sdk/types.js'
import { ROOT, STDIO_SOURCE, httpClient, rawRpc, startHttp, startStdio, stdioClient } from './harness.mjs'

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))
const toolchain = readFileSync(join(ROOT, 'lean-toolchain'), 'utf8').trim()

const mintOf = (k) => 2 ** k
const n = ['quantum', 'processing', 'unit'].length
const seed = mintOf(n - n)
const coins = seed + seed
const rays = n + coins + coins
const vertices = mintOf(n)
const hexbit = mintOf(coins)
const bits = mintOf(n + coins)
const faces = vertices + hexbit + coins
const amplitudes = mintOf(bits)
const fused = faces * mintOf(bits + seed)

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b))
const powMod = (a, e, m) => {
  let r = 1 % m
  for (let i = 0; i < e; i++) r = (r * a) % m
  return r
}
const orderOf = (a, m) => {
  let r = 1
  while (powMod(a, r, m) !== 1) r++
  return r
}
const isPrime = (p) => {
  if (p < 2) return false
  for (let d = 2; d * d <= p; d++) if (p % d === 0) return false
  return true
}

const SHOR_N = 91
const SHOR_A = 8
const COUNTING = 2

const shorBornOf = (N, a, t) => {
  const Q = mintOf(t)
  const byWork = new Map()
  for (let x = 0; x < Q; x++) {
    const y = powMod(a, x, N)
    byWork.set(y, [...(byWork.get(y) ?? []), x])
  }
  const probs = Array.from({ length: Q }, () => 0)
  let nonzero = 0
  for (const xs of byWork.values()) {
    for (let k = 0; k < Q; k++) {
      let re = 0
      let im = 0
      for (const x of xs) {
        const theta = (-2 * Math.PI * x * k) / Q
        re += Math.cos(theta)
        im += Math.sin(theta)
      }
      const p = (re * re + im * im) / (Q * Q)
      if (p > 1e-12) nonzero++
      probs[k] += p
    }
  }
  return { Q, probs, nonzero, orbit: byWork.size }
}

const expectedShor = (() => {
  const period = orderOf(SHOR_A, SHOR_N)
  const half = powMod(SHOR_A, period / 2, SHOR_N)
  const factors = [gcd(half - 1, SHOR_N), gcd(half + 1, SHOR_N)].sort((x, y) => x - y)
  const work = SHOR_N.toString(2).length
  return { period, half, factors, work, born: shorBornOf(SHOR_N, SHOR_A, COUNTING) }
})()

test('independent references agree with the lattice and number theory they are derived from', () => {
  assert.equal(n, 3)
  assert.equal(faces, 14)
  assert.equal(faces, coins * rays)
  assert.equal(bits, vertices * hexbit)
  assert.equal(fused, 14 * 2 ** 33)
  assert.equal(fused, 120259084288)
  assert.ok(Number.isSafeInteger(fused + fused))
  assert.equal(SHOR_N, 7 * 13)
  assert.equal(gcd(SHOR_A, SHOR_N), 1)
  assert.equal(expectedShor.period, 4)
  assert.equal(powMod(SHOR_A, 4, SHOR_N), 1)
  assert.deepEqual([1, 2, 3].map((e) => powMod(SHOR_A, e, SHOR_N)), [8, 64, 57])
  assert.notEqual(expectedShor.half, SHOR_N - 1)
  assert.deepEqual(expectedShor.factors, [7, 13])
  assert.ok(expectedShor.factors.every(isPrime))
  assert.equal(expectedShor.work, 7)
  assert.equal(expectedShor.born.orbit, 4)
  assert.equal(expectedShor.born.nonzero, 16)
  assert.ok(Math.abs(expectedShor.born.probs.reduce((s, p) => s + p, 0) - 1) < 1e-12)
  for (const p of expectedShor.born.probs) assert.ok(Math.abs(p - 1 / 4) < 1e-12)
})

const assertProve = (result) => {
  assert.equal(result.isError, false)
  assert.ok(Array.isArray(result.content) && result.content.length > 0)
  const text = result.content.find((c) => c.type === 'text')
  assert.ok(text, 'qpu_prove carries a text content block')
  const s = result.structuredContent
  assert.ok(s && typeof s === 'object', 'qpu_prove carries structuredContent')
  assert.deepEqual(JSON.parse(text.text), s)
  assert.equal(s.kind, 'prove')
  assert.equal(s.holds, true)
  assert.equal(s.quantum, true)
  assert.equal(s.only.entangle, true)
  assert.equal(s.only.product, false)

  assert.equal(s.lattice.faces, faces)
  assert.equal(s.lattice.nodes.length, faces)
  assert.deepEqual(s.lattice.nodes.map((node) => node.face), Array.from({ length: faces }, (_, i) => i))
  assert.equal(new Set(s.lattice.nodes.map((node) => node.name)).size, faces)
  assert.equal(s.lattice.occupied + s.lattice.vacant, faces)
  assert.equal(s.lattice.cover, vertices * faces)

  assert.equal(s.shor.n, SHOR_N)
  assert.equal(s.shor.a, SHOR_A)
  assert.equal(s.shor.coprime, gcd(SHOR_A, SHOR_N) === 1)
  assert.equal(s.shor.period, expectedShor.period)
  assert.deepEqual([...s.shor.factors].sort((x, y) => x - y), expectedShor.factors)
  assert.equal(s.shor.factors[0] * s.shor.factors[1], SHOR_N)
  assert.equal(s.shor.rsa.modulus, SHOR_N)
  assert.deepEqual([s.shor.rsa.p, s.shor.rsa.q].sort((x, y) => x - y), expectedShor.factors)

  assert.equal(s.encrypt.fused, fused)
  assert.equal(s.encrypt.share, mintOf(bits + seed))
  assert.equal(s.encrypt.split, faces)
  assert.equal(s.encrypt.modulus, SHOR_N)
  assert.equal(s.coil.windings, coins)
  assert.equal(s.coil.coil, coins * rays)
  assert.equal(s.coil.faces, faces)
  assert.equal(s.entangle.pairs, rays)
  assert.equal(s.next.amplitudes, amplitudes)
  assert.equal(s.next.next, amplitudes + amplitudes)
  assert.equal(s.next.fused, fused)
  assert.equal(s.next.nextFused, fused + fused)
  assert.equal(s.next.nextFused, faces * mintOf(bits + coins))
  assert.equal(s.next.nextCoil, coins * rays * mintOf(bits + coins))
  const quantumRow = s.integrity.tests.find((t) => t.name === 'quantum')
  assert.equal(quantumRow.left, fused)
  assert.equal(quantumRow.right, fused)

  const map = s.evidence.provenance.map
  assert.equal(map.counting, COUNTING)
  assert.equal(map.work, expectedShor.work)
  for (const row of s.receipts.rows) {
    assert.equal(row.qubits, COUNTING + expectedShor.work)
    assert.equal(row.dim, mintOf(COUNTING + expectedShor.work))
    assert.equal(row.nonzero, expectedShor.born.nonzero)
  }
  const weights = s.evidence.provenance.weights
  assert.equal(weights.length, expectedShor.born.Q)
  const total = weights.reduce((sum, w) => sum + w, 0)
  assert.ok(total > 0)
  const born = weights.map((w) => w / total)
  assert.ok(Math.abs(born.reduce((sum, p) => sum + p, 0) - 1) < 1e-12)
  born.forEach((p, k) => assert.ok(Math.abs(p - expectedShor.born.probs[k]) < 1e-12, `Born weight of outcome ${k}`))
  const support = expectedShor.born.probs.flatMap((p, k) => (p > 1e-12 ? [k] : []))
  assert.deepEqual([...new Set(s.evidence.provenance.outcomes)].sort((x, y) => x - y), support)
  assert.equal(s.evidence.provenance.outcomes.length, s.evidence.provenance.shots)

  assert.equal(s.source.toolchain, toolchain)
  return s
}

let qpu
let client

before(async () => {
  qpu = await startHttp()
  client = await httpClient(qpu.mcpUrl)
}, { timeout: 180_000 })

after(async () => {
  await client?.close()
  await qpu?.stop()
})

test('boot proves before serving and serves on the free port it was given', async () => {
  assert.match(qpu.url, /^http:\/\/127\.0\.0\.1:\d+$/)
  assert.equal(qpu.mcpUrl, `${qpu.url}/mcp`)
  assert.equal(new URL(qpu.url).port, String(qpu.port))
  assert.ok(qpu.port > 0 && qpu.port < 65536)
  assert.ok(qpu.servingLine.includes(`:${qpu.port}`), qpu.servingLine)
  const proveAt = qpu.stdout.findIndex((line) => line.includes('qpu_prove holds'))
  const servingAt = qpu.stdout.findIndex((line) => line.includes('serving'))
  assert.ok(proveAt >= 0, 'boot printed that qpu_prove holds')
  assert.ok(proveAt < servingAt, 'prove precedes serving')
  assert.ok(qpu.stdout[proveAt].includes(process.version))
  assert.ok(qpu.proveMs > 0 && qpu.proveMs <= qpu.bootMs)
  const health = await fetch(`${qpu.url}/health`)
  assert.equal(health.status, 200)
  assert.deepEqual(await health.json(), { status: 'healthy', holds: true })
})

test('initialize over Streamable HTTP negotiates a supported protocol and names this package', async () => {
  const info = client.getServerVersion()
  assert.equal(info.name, pkg.name)
  assert.equal(info.version, pkg.version)
  assert.ok(client.getServerCapabilities()?.tools, 'server declares the tools capability')
  const negotiated = client.transport.protocolVersion
  assert.ok(SUPPORTED_PROTOCOL_VERSIONS.includes(negotiated), negotiated)
  const offered = await rawRpc(qpu.mcpUrl, { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: LATEST_PROTOCOL_VERSION, capabilities: {}, clientInfo: { name: 'raw', version: '0' } } })
  const advertised = offered.json.result.versions
  assert.ok(Array.isArray(advertised) && advertised.length > 0)
  const expected = advertised.includes(LATEST_PROTOCOL_VERSION) ? LATEST_PROTOCOL_VERSION : [...advertised].sort().at(-1)
  assert.equal(negotiated, expected)
})

test('initialize echoes every advertised version and answers an unknown one with its latest', async () => {
  const init = (protocolVersion, id) => rawRpc(qpu.mcpUrl, { jsonrpc: '2.0', id, method: 'initialize', params: { protocolVersion, capabilities: {}, clientInfo: { name: 'raw', version: '0' } } })
  const { json } = await init('1999-01-01', 1)
  const advertised = json.result.versions
  assert.equal(json.result.protocolVersion, [...advertised].sort().at(-1))
  for (const [i, version] of advertised.entries()) {
    const reply = await init(version, i + 2)
    assert.equal(reply.status, 200)
    assert.equal(reply.json.id, i + 2)
    assert.equal(reply.json.result.protocolVersion, version)
  }
})

test('tools/list returns well-formed, uniquely named tools including qpu_prove', async () => {
  const { tools } = await client.listTools()
  assert.ok(tools.length > 0)
  const names = tools.map((t) => t.name)
  assert.equal(new Set(names).size, names.length)
  assert.ok(names.includes('qpu_prove'))
  for (const tool of tools) {
    assert.equal(typeof tool.name, 'string')
    assert.ok(tool.name.length > 0)
    assert.equal(tool.inputSchema.type, 'object')
  }
})

test('tools/call qpu_prove leads with recognition and expands on { full: true }', async () => {
  const seen = await client.callTool({ name: 'qpu_prove', arguments: {} })
  const led = seen.structuredContent
  assert.equal(seen.isError, false)
  assert.equal(JSON.parse(seen.content.find((c) => c.type === 'text').text).recognition.kind, 'recognition')
  assert.equal(led.recognition.kind, 'recognition')
  assert.equal(led.recognition.holds, true)
  assert.equal(led.holds, true)
  assert.equal(Object.keys(led)[0], 'recognition')
  const result = await client.callTool({ name: 'qpu_prove', arguments: { full: true } })
  const s = assertProve(result)
  assert.ok(JSON.stringify(led).length < JSON.stringify(s).length)
  const lean = await fetch(new URL(s.source.path, qpu.url))
  assert.equal(lean.status, 200)
  const source = await lean.text()
  assert.equal(Buffer.byteLength(source, 'utf8'), s.source.bytes)
  assert.equal(source.match(/^theorem\s/gm)?.length ?? 0, s.source.theorems)
  assert.ok(s.theorems.length > 0)
  for (const row of s.theorems) assert.ok(source.includes(row.theorem), `theorem quoted verbatim: ${row.heading}`)
})

test('an unknown tool is a JSON-RPC invalid-params error, not a result', async () => {
  await assert.rejects(client.callTool({ name: 'qpu_no_such_tool', arguments: {} }), (error) => {
    assert.ok(error instanceof McpError)
    assert.equal(error.code, ErrorCode.InvalidParams)
    return true
  })
})

test('raw JSON-RPC edge cases answer with the spec error codes', async () => {
  const unknownMethod = await rawRpc(qpu.mcpUrl, { jsonrpc: '2.0', id: 4, method: 'resources/list' })
  assert.equal(unknownMethod.json.id, 4)
  assert.equal(unknownMethod.json.error.code, ErrorCode.MethodNotFound)

  const malformed = await rawRpc(qpu.mcpUrl, '{"jsonrpc":')
  assert.equal(malformed.status, 400)
  assert.equal(malformed.json.id, null)
  assert.equal(malformed.json.error.code, ErrorCode.ParseError)

  const noMethod = await rawRpc(qpu.mcpUrl, { jsonrpc: '2.0', id: 6 })
  assert.equal(noMethod.status, 400)
  assert.equal(noMethod.json.error.code, ErrorCode.InvalidRequest)

  const scalar = await rawRpc(qpu.mcpUrl, 42)
  assert.equal(scalar.status, 400)
  assert.equal(scalar.json.error.code, ErrorCode.InvalidRequest)

  const emptyBatch = await rawRpc(qpu.mcpUrl, [])
  assert.equal(emptyBatch.status, 400)
  assert.equal(emptyBatch.json.error.code, ErrorCode.InvalidRequest)

  const stringId = await rawRpc(qpu.mcpUrl, { jsonrpc: '2.0', id: 'abc', method: 'ping' })
  assert.deepEqual(stringId.json, { jsonrpc: '2.0', id: 'abc', result: {} })

  const batch = await rawRpc(qpu.mcpUrl, [
    { jsonrpc: '2.0', id: 7, method: 'ping' },
    { jsonrpc: '2.0', method: 'notifications/initialized' },
    { jsonrpc: '2.0', id: 8, method: 'tools/list' },
  ])
  assert.equal(batch.status, 200)
  assert.deepEqual(batch.json.map((m) => m.id), [7, 8])
  assert.deepEqual(batch.json[0].result, {})
  assert.ok(batch.json[1].result.tools.length > 0)

  const sse = await fetch(qpu.mcpUrl, { headers: { accept: 'text/event-stream' } })
  await sse.body?.cancel()
  assert.equal(sse.status, 405)
  assert.ok((sse.headers.get('allow') ?? '').split(/,\s*/).includes('POST'))
})

test('a lone notification is accepted with 202 and no body', { todo: 'defect in src/quantum/processing/unit/index.ts /mcp: notifications/initialized posted alone is answered 200 with {"jsonrpc":"2.0","id":null,"result":{}}; JSON-RPC 2.0 forbids replying to a notification and MCP Streamable HTTP requires 202 Accepted with no body' }, async () => {
  const reply = await rawRpc(qpu.mcpUrl, { jsonrpc: '2.0', method: 'notifications/initialized' })
  assert.equal(reply.status, 202)
  assert.equal(reply.text, '')
})

test('two boots at once take distinct free ports, and stop() ends each one for good', async () => {
  const [a, b] = await Promise.all([startHttp(), startHttp()])
  try {
    assert.notEqual(a.port, b.port)
    assert.notEqual(a.port, qpu.port)
    assert.notEqual(b.port, qpu.port)
    for (const boot of [a, b]) assert.equal((await fetch(`${boot.url}/health`)).status, 200)
  } finally {
    const [exitA, exitB] = await Promise.all([a.stop(), b.stop()])
    assert.equal(exitA.signal, 'SIGTERM')
    assert.equal(exitB.signal, 'SIGTERM')
  }
  assert.deepEqual(await a.stop(), await a.stop())
  assert.equal(a.child.exitCode ?? a.child.signalCode, 'SIGTERM')
  await assert.rejects(fetch(`${a.url}/health`))
  await assert.rejects(fetch(`${b.url}/health`))
  assert.equal(existsSync(a.script), false)
  assert.equal((await fetch(`${qpu.url}/health`)).status, 200)
})

test('stdio transport serves the same tools and the same proof', { skip: existsSync(STDIO_SOURCE) ? false : 'src/quantum/processing/unit/stdio.ts is absent' }, async () => {
  const spec = await startStdio()
  assert.ok(spec, 'startStdio returns a spec when stdio.ts exists')
  assert.equal(spec.command, process.execPath)
  const stdio = await stdioClient(spec)
  try {
    const { tools } = await stdio.listTools()
    const { tools: httpTools } = await client.listTools()
    assert.deepEqual(tools.map((t) => t.name).sort(), httpTools.map((t) => t.name).sort())
    assertProve(await stdio.callTool({ name: 'qpu_prove', arguments: { full: true } }))
  } finally {
    await stdio.close()
  }
})
