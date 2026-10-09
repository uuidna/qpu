/**
 * THE MCP CAPABILITY SURFACE IS GATED, NOT HOPED. mcp-capabilities.ts registers resources / prompts / completion /
 * logging through qpuMcpRegisterOf — the standard primitives every compatible MCP client reads, not only tool-callers,
 * and the way QPU's family-formula COMBINATIONS are exposed (qpu://hex, qpu://formulas/{family}, and qpu://hex/{uuid}
 * which RUNS a hex-program combination). mcp.test.mjs gates the tools contract; this gates the rest, so a capability
 * cannot silently stop answering for the ecosystem. Driven through publicMcpOf — the same JSON-RPC a client sends.
 * Needs dist — run `npm run build` first. Discovered by the scripts/*.test.mjs glob, run in CI.
 */
import test from 'node:test'
import assert from 'node:assert/strict'

const idx = await import('../dist/quantum/processing/unit/index.js')
if (idx.qpuHexRegistryOf) await idx.qpuHexRegistryOf()
const { publicMcpOf } = await import('../dist/payload/plugins/public.js')

const rpc = async (method, params) => {
  const r = await publicMcpOf(
    new Request('https://qpu.uuidna.com/mcp', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }) }),
    {},
  )
  return r.json()
}

test('initialize advertises every server capability — tools, prompts, resources, completions, logging', async () => {
  const caps = (await rpc('initialize', { protocolVersion: '2025-06-18' })).result.capabilities
  for (const c of ['tools', 'prompts', 'resources', 'completions', 'logging']) assert.ok(caps[c], `capability ${c} not advertised`)
})

test('resources/list exposes the family-formula combinations (the hex catalogue and each family)', async () => {
  const uris = (await rpc('resources/list', {})).result.resources.map((r) => r.uri)
  assert.ok(uris.includes('qpu://hex'), 'qpu://hex catalogue not listed')
  assert.ok(uris.some((u) => u.startsWith('qpu://formulas/')), 'no family-formula resource listed')
})

test('resources/read returns a family’s formulas, and qpu://hex/{uuid} runs a combination', async () => {
  const family = (await rpc('resources/list', {})).result.resources.map((r) => r.uri).find((u) => u.startsWith('qpu://formulas/'))
  const read = JSON.parse((await rpc('resources/read', { uri: family })).result.contents[0].text)
  assert.ok(Array.isArray(read.formulas) && read.formulas.length > 0, 'family resource carried no formulas')
  const uuid = idx.qpuHexUuidOf({ family: 'Qpu.Mint', program: ['chooseOf'], params: [14, 2] })
  const run = await rpc('resources/read', { uri: `qpu://hex/${uuid}` })
  assert.ok(run.result && !run.error, `qpu://hex/{uuid} did not run: ${JSON.stringify(run.error)}`)
})

test('prompts/list and prompts/get answer', async () => {
  const prompts = (await rpc('prompts/list', {})).result.prompts
  assert.ok(prompts.length > 0, 'no prompts listed')
  const got = await rpc('prompts/get', { name: prompts[0].name, arguments: {} })
  assert.ok(got.result?.messages?.length || typeof got.error?.code === 'number', 'prompts/get neither answered nor named a clean error')
})

test('completion/complete returns a completion object', async () => {
  const c = await rpc('completion/complete', { ref: { type: 'ref/resource', uri: 'qpu://formulas/{family}' }, argument: { name: 'family', value: '' } })
  assert.ok(Array.isArray(c.result?.completion?.values), 'completion/complete returned no values array')
})

test('logging/setLevel accepts a level, and an unknown method is a clean error', async () => {
  const ok = await rpc('logging/setLevel', { level: 'info' })
  assert.ok(ok.result && !ok.error, `logging/setLevel failed: ${JSON.stringify(ok.error)}`)
  const bad = await rpc('resources/read', { uri: 'qpu://does-not-exist' })
  assert.equal(typeof bad.error?.code, 'number', 'unknown resource did not return a JSON-RPC error')
})
