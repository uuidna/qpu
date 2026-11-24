// The lean tool against a recording prover with the container server's contract, then the server itself against this
// checkout's Lean (skipped where lake is not installed): the container's own image runs the same server.
import test from 'node:test'
import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { chmodSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { PROVER_LIMITS, PROVER_TOOLS, callProver, type ProverNamespace } from './prover.ts'
import { serveMcp } from './mcp-http.ts'

const recording = (reply: Record<string, unknown> | Error, status = 200) => {
  const asked: { url: string; body: string }[] = []
  const prover: ProverNamespace = { getByName: () => ({ fetch: async (r: Request) => { asked.push({ url: r.url, body: await r.text() }); if (reply instanceof Error) throw reply; return Response.json(reply, { status }) } }) }
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

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the limits the lean tool states are the ones the container's server and its Durable Object hold. */
test('the limits the lean tool states are the ones the container\'s server and its Durable Object hold', () => {
  const server = readFileSync('alpine/prover-server.ts', 'utf8'), object = readFileSync('src/quantum/net/prover-object.ts', 'utf8'), n = (text: string, re: RegExp) => Number(re.exec(text)?.[1])
  assert.deepEqual([n(server, /AT_ONCE = (\d+)/), n(server, /WAITING = (\d+)/), n(object, /INACTIVITY_TIMEOUT_MS = (\d+) \* 60 \* 1000/)], [PROVER_LIMITS.atOnce, PROVER_LIMITS.waiting, PROVER_LIMITS.idleMinutes])
  const said = PROVER_TOOLS[0].description
  for (const stated of [PROVER_LIMITS.source, PROVER_LIMITS.seconds, 'prover_busy', 'prover_unavailable', 'no receipt']) assert.ok(said.includes(String(stated)), String(stated))
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a receipt is issued for Lean's verdict alone: a prover that failed, timed out, was busy or out of reach answers its code, with no ok and no receipt. */
test('a receipt is issued for Lean\'s verdict alone: a prover that failed, timed out, was busy or out of reach answers its code, with no ok and no receipt', async () => {
  const source = 'theorem t : 1 + 1 = 2 := rfl', toolchain = 'leanprover/lean4:v4.33.0'
  const ask = async (reply: Record<string, unknown> | Error, status = 200) => s(await callProver(recording(reply, status).prover, { source }))
  // what the live server answered on 2026-11-24: Lean never ran, and the answer read as a rejection and was sealed
  const silent = await ask({ ok: false, timedOut: false, ms: 688, messages: [], toolchain })
  assert.deepEqual([silent.code, 'ok' in silent, 'receipt' in silent, silent.verdict, silent.retryable], ['prover_failed', false, false, null, true])
  const failed = await ask({ error: 'prover_failed', exit: 1, signal: null, stderr: 'error: permission denied (error code: 13)\n  file: /qpu/.lake/packages/mathlib/Counterexamples/QuadraticForm.lean', toolchain }, 500)
  assert.deepEqual([failed.code, failed.exit, /permission denied/.test(failed.stderr), 'ok' in failed, 'receipt' in failed], ['prover_failed', 1, true, false, false])
  const away = await ask(new Error('There is no container application assigned to this Durable Object namespace'))
  assert.deepEqual([away.code, /no container application assigned/.test(away.error), 'ok' in away, 'receipt' in away, away.retryable], ['prover_unavailable', true, false, false, true])
  const slow = await ask({ ok: false, timedOut: true, ms: 300000, messages: [], toolchain })
  assert.deepEqual([slow.code, slow.timedOut, 'ok' in slow, 'receipt' in slow, slow.retryable], ['time_limit', true, false, false, false])
  const busy = await ask({ error: 'prover_busy', busy: 2, waiting: 8, retryAfterSeconds: 30 }, 503)
  assert.deepEqual([busy.code, busy.retryAfterSeconds, 'receipt' in busy], ['prover_busy', 30, false])
  const garbled = await ask({ ok: true, messages: [{ line: 1, column: 0, severity: 'error', text: 'x' }], toolchain })
  assert.deepEqual([garbled.code, 'receipt' in garbled], ['prover_failed', false])
  // the two verdicts, and only they, are sealed
  const rejected = await callProver(recording({ ok: false, timedOut: false, ms: 300, messages: [{ line: 1, column: 25, severity: 'error', text: 'Type mismatch' }], toolchain }).prover, { source: 'theorem t : 1 + 1 = 3 := rfl' })
  const accepted = await callProver(recording({ ok: true, timedOut: false, ms: 300, messages: [], toolchain }).prover, { source })
  assert.deepEqual([rejected.isError, s(rejected).ok, s(rejected).verdict, s(rejected).receipt.sealed, accepted.isError, s(accepted).ok, s(accepted).verdict, s(accepted).receipt.sealed], [true, false, 'rejected', true, false, true, 'accepted', true])
  for (const none of [silent, failed, away, slow, busy, garbled]) assert.equal(typeof none.error, 'string')
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

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a Lean that stops without a verdict is the prover's failure, answered 500 with its exit code and what it wrote, never ok false with no message. */
test('a Lean that stops without a verdict is the prover\'s failure, answered 500 with its exit code and what it wrote, never ok false with no message', { skip: !lake }, async () => {
  // a lean that cannot run, first on the server's PATH: what a broken image looks like from inside
  const bin = mkdtempSync(join(tmpdir(), 'broken-lean-')), port = 19000 + Math.floor(Math.random() * 1000)
  writeFileSync(join(bin, 'lean'), '#!/bin/sh\necho "error: permission denied (error code: 13)" >&2\nexit 1\n'); chmodSync(join(bin, 'lean'), 0o755)
  const server = spawn('node', ['alpine/prover-server.ts'], { env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, QPU_ROOT: process.cwd(), PORT: String(port) } })
  try {
    for (let i = 0; ; i++) {
      try {
        const r = await fetch(`http://127.0.0.1:${port}/check`, { method: 'POST', body: JSON.stringify({ source: 'theorem t : 1 + 1 = 2 := rfl' }) }), body = await r.json() as any
        assert.deepEqual([r.status, body.error, body.exit, /permission denied/.test(body.stderr), 'ok' in body], [500, 'prover_failed', 1, true, false])
        const self = await fetch(`http://127.0.0.1:${port}/selftest`)
        assert.deepEqual([self.status, (await self.json() as any).selftest], [500, false])
        break
      } catch (e) { if (i > 50 || (e as { code?: string }).code === 'ERR_ASSERTION') throw e; await new Promise((r) => setTimeout(r, 200)) }
    }
  } finally {
    server.kill(); rmSync(bin, { recursive: true, force: true })
  }
})
