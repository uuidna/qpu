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

// Walk every hexbit folder of a scope to the end — the listing is hex-addressed and stable, so following nextCursor
// terminates; the bound is only a runaway guard, never a cap on what is served. No scope → the quantum computer core.
const allResources = async (scope) => {
  const uris = []
  let cursor
  let pages = 0
  do {
    const params = { ...(scope ? { scope } : {}), ...(cursor ? { cursor } : {}) }
    const list = (await rpc('resources/list', params)).result
    for (const r of list.resources) uris.push(r.uri)
    cursor = list.nextCursor
    pages += 1
  } while (cursor && pages < 5000)
  assert.ok(!cursor, 'resources/list did not terminate: a hexbit-folder cursor never ran out')
  return uris
}

test('by default resources/list is the quantum computer core — the aggregates only, one page, the rest not spilled', async () => {
  const core = await allResources()
  for (const u of ['qpu://hex', 'qpu://lean', 'qpu://schema', 'qpu://readme', 'qpu://docs', 'qpu://receipts', 'qpu://fused', 'qpu://hologram', 'qpu://hooks']) {
    assert.ok(core.includes(u), `core aggregate ${u} missing from the default listing`)
  }
  assert.ok(!core.some((u) => u.startsWith('qpu://formulas/')), 'the default listing spilled the families — they belong on request')
  assert.ok(core.length <= 12, `the default listing is not lean: ${core.length} resources`)
})

test('the rest on request: scope "all" reaches every family, scope "Qpu.Mint" is its scoped collection', async () => {
  const all = await allResources('all')
  assert.ok(all.some((u) => u.startsWith('qpu://formulas/')), 'scope=all did not reach the family formulas')
  assert.ok(all.includes('qpu://hex') && all.includes('qpu://readme'), 'scope=all dropped the core aggregates')
  const scoped = await allResources('Qpu.Mint')
  assert.ok(scoped.includes('qpu://formulas/Qpu.Mint'), 'the family scope did not include its formulas')
  assert.ok(scoped.includes('qpu://compatible/Qpu.Mint'), 'the family scope did not include its compatible-programs query')
  assert.ok(scoped.length < all.length, 'a family scope is not smaller than the whole catalogue')
})

test('resources/read returns a family’s formulas, the README as markdown, and qpu://hex/{uuid} runs a combination', async () => {
  const family = (await allResources('all')).find((u) => u.startsWith('qpu://formulas/'))
  const read = JSON.parse((await rpc('resources/read', { uri: family })).result.contents[0].text)
  assert.ok(Array.isArray(read.formulas) && read.formulas.length > 0, 'family resource carried no formulas')
  const uuid = idx.qpuHexUuidOf({ family: 'Qpu.Mint', program: ['chooseOf'], params: [14, 2] })
  const run = await rpc('resources/read', { uri: `qpu://hex/${uuid}` })
  assert.ok(run.result && !run.error, `qpu://hex/{uuid} did not run: ${JSON.stringify(run.error)}`)
  const readme = (await rpc('resources/read', { uri: 'qpu://readme' })).result.contents[0]
  assert.equal(readme.mimeType, 'text/markdown', 'README not served as markdown')
  assert.ok(readme.text.length > 0, 'README content empty')
})

test('lean computations are UUID programs: addressed by hexbit handle or full uuid, each recomputed and holding', async () => {
  const lean = (await allResources('all')).filter((u) => u.startsWith('qpu://lean/'))
  assert.ok(lean.length > 0, 'no lean computations distributed as hex-addressed resources')
  const handle = lean[0].split('/').pop()
  const body = JSON.parse((await rpc('resources/read', { uri: `qpu://lean/${handle}` })).result.contents[0].text)
  assert.ok(Array.isArray(body.theorems) && body.theorems.length > 0, 'lean handle carried no theorem')
  assert.match(body.uuid, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, 'theorem is not a UUID program')
  assert.equal(body.uuid.slice(0, 8), handle, 'the hexbit handle is not the program UUID’s first 8 hex')
  assert.ok(body.theorems.every((t) => t.holds === true), 'a distributed lean computation does not hold')
  const byUuid = JSON.parse((await rpc('resources/read', { uri: `qpu://lean/${body.uuid}` })).result.contents[0].text)
  assert.equal(byUuid.handle, handle, 'the full UUID program did not resolve to the same computation as its handle')
})

test('tools are also hooks: qpu://hooks is the full combinatorics of tools × lifecycle events', async () => {
  const h = JSON.parse((await rpc('resources/read', { uri: 'qpu://hooks' })).result.contents[0].text)
  assert.ok(h.tools.length > 0 && h.events.length > 0, 'no tools or events to combine')
  assert.equal(h.combinations, h.tools.length * h.events.length, 'combinations is not the full tool × event product')
  assert.equal(h.bindings.length, h.combinations, 'not every tool × event binding is enumerated')
  assert.ok(h.holds, 'the hook combinatorics does not hold')
})

test('hard fail fast on a hex violation: a malformed hex program address is an error, not a soft miss', async () => {
  const bad = await rpc('resources/read', { uri: 'qpu://hex/not-a-uuid' })
  assert.equal(typeof bad.error?.code, 'number', 'a malformed hex address was not rejected')
  assert.match(String(bad.error.message), /hex violation/, 'the rejection did not name the hex violation')
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
