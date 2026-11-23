// The lean tool against a recording prover with the container server's contract, then the server itself against this
// checkout's Lean (skipped where lake is not installed): the container's own image runs the same server.
import test from 'node:test'
import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { PROVER_LIMITS, PROVER_TOOLS, callProver, type ProverNamespace } from './prover.ts'
import { serveMcp } from './mcp-http.ts'

const recording = (reply: Record<string, unknown>) => {
  const asked: { url: string; body: string }[] = []
  const prover: ProverNamespace = { getByName: () => ({ fetch: async (r: Request) => { asked.push({ url: r.url, body: await r.text() }); return Response.json(reply) } }) }
  return { prover, asked }
}
const s = (r: { structuredContent: Record<string, unknown> }) => r.structuredContent as any

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a source out of bounds is refused before the container is reached, and a verdict is sealed by its content. */
test('a source out of bounds is refused before the container is reached, and a verdict is sealed by its content', async () => {
  const { prover, asked } = recording({ ok: true, messages: [], toolchain: 'leanprover/lean4:v4.33.0' })
  for (const source of ['', 'x'.repeat(PROVER_LIMITS.source + 1), 7]) assert.equal((await callProver(prover, { source })).isError, true)
  assert.equal(asked.length, 0)
  const once = await callProver(prover, { source: 'theorem t : 1 + 1 = 2 := rfl' }), again = await callProver(prover, { source: 'theorem t : 1 + 1 = 2 := rfl' })
  assert.deepEqual([once.isError, s(once).ok, s(once).receipt.address === s(again).receipt.address && s(once).receipt.sealed, asked[0]!.url, JSON.parse(asked[0]!.body).seconds], [false, true, true, 'http://prover/check', PROVER_LIMITS.seconds])
  await callProver(prover, { gaps: true })
  assert.deepEqual([asked.at(-1)!.url, PROVER_TOOLS.map((t) => t.name)], ['http://prover/gaps', ['lean']])
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: where the Worker binds the prover, lean is served over MCP like the kernel's tools, and nowhere else. */
test('where the Worker binds the prover, lean is served over MCP like the kernel\'s tools, and nowhere else', async () => {
  const rpc = async (env: Record<string, unknown>, method: string, params: object = {}) => JSON.parse((await (await serveMcp(new Request('https://qpu.uuidna.com/mcp', { method: 'POST', headers: { host: 'qpu.uuidna.com', 'content-type': 'application/json', accept: 'application/json, text/event-stream' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }) }), env)).text()).replace(/^[\s\S]*?data: /, '')).result
  const { prover } = recording({ ok: true, messages: [], toolchain: 'leanprover/lean4:v4.33.0' })
  const named = async (env: Record<string, unknown>) => (await rpc(env, 'tools/list')).tools.map((t: { name: string }) => t.name).includes('lean')
  const called = await rpc({ PROVER: prover }, 'tools/call', { name: 'lean', arguments: { source: 'example : True := trivial' } })
  assert.deepEqual([await named({ PROVER: prover }), await named({}), called.structuredContent.ok], [true, false, true])
})

const lake = spawnSync('lake', ['--version']).status === 0
/** ISO/IEC/IEEE 29119-3 test case. Identifier: the container's server returns Lean's own verdict, its messages with their place, and stops a check at its limit. */
test('the container\'s server returns Lean\'s own verdict, its messages with their place, and stops a check at its limit', { skip: !lake }, async () => {
  const port = 18000 + Math.floor(Math.random() * 1000)
  const server = spawn('node', ['alpine/prover-server.ts'], { env: { ...process.env, QPU_ROOT: process.cwd(), PORT: String(port) } })
  try {
    const post = async (source: string, seconds?: number) => {
      for (let i = 0; ; i++) {
        try { return await (await fetch(`http://127.0.0.1:${port}/check`, { method: 'POST', body: JSON.stringify({ source, seconds }) })).json() as any }
        catch (e) { if (i > 50) throw e; await new Promise((r) => setTimeout(r, 200)) }
      }
    }
    const holds = await post('theorem t : 1 + 1 = 2 := rfl'), fails = await post('theorem t : 1 + 1 = 3 := rfl'), slow = await post('#eval (List.range 100000000).foldl (· + ·) 0', 2)
    assert.deepEqual([holds.ok, fails.ok, fails.messages[0].line, fails.messages[0].severity, slow.ok, slow.timedOut], [true, false, 1, 'error', false, true])
  } finally {
    server.kill()
  }
})
