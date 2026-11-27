// The gate after a deploy, judged on answers: the ones the live server gave on 2026-11-24 (a prover that never ran, sealed as a
// rejection; selftests and the audit ended by error 1102), the right ones, and a prover that is still starting; then the runner
// against a local server that is cold once.
import test from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { call } from '../../../../../../../../3/8/5/9/0/2/0/f/index.ts'
import { DEPLOYED_ATTEMPTS, createDeployedRequests, judgeDeployed, type DeployedAnswer, type DeployedRequest } from './index.ts'

const URL_ = 'https://qpu.uuidna.com/api/mcp', toolchain = 'leanprover/lean4:v4.33.0'
const sse = (structured: Record<string, unknown>, isError = false) => `event: message\ndata: ${JSON.stringify({ result: { content: [{ type: 'text', text: JSON.stringify(structured) }], structuredContent: structured, isError }, jsonrpc: '2.0', id: 1 })}\n\n`
/** What a server in order answers each request of the gate. */
const right = (q: DeployedRequest): string => {
  const a = q.body.params.arguments as { shard?: { i: number; n: number } }
  if (q.id === 'lean-holds') return sse({ ok: true, verdict: 'accepted', timedOut: false, ms: 280, messages: [], toolchain })
  if (q.id === 'lean-fails') return sse({ ok: false, verdict: 'rejected', timedOut: false, ms: 279, messages: [{ line: 1, column: 25, severity: 'error', text: 'Type mismatch' }], toolchain }, true)
  if (q.kind === 'selftest') return sse({ selftest: true, passed: true, checks: [{ id: 'crypto:seal-merkle', passed: true, evidence: '' }] })
  return sse({ shard: a.shard, total: 370, passed: 370, failed: 0, checks: [] })
}
const answered = (requests: readonly DeployedRequest[], say: (q: DeployedRequest) => { status?: number; text: string }): DeployedAnswer[] => requests.map((q) => ({ ...q, status: 200, ms: 1, ...say(q) }))
const unavailable = sse({ error: 'The prover could not be reached: There is no container application assigned to this Durable Object namespace.', code: 'prover_unavailable', verdict: null, retryable: true }, true)

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the gate asks Lean both ways, both selftest doors and every audit share once, and holds only when each answer is right. */
test('the gate asks Lean both ways, both selftest doors and every audit share once, and holds only when each answer is right', () => {
  const requests = createDeployedRequests(URL_, 8)
  assert.deepEqual([requests.length, requests.filter((q) => q.kind === 'audit').map((q) => (q.body.params.arguments.shard as { i: number }).i).join(), new Set(requests.map((q) => q.id)).size], [12, '0,1,2,3,4,5,6,7', 12])
  const planned = call('repository', { deployed: {} }).result!.structuredContent
  assert.deepEqual([planned.phase, planned.requests, planned.url], ['requests', 12, URL_])
  const good = judgeDeployed(URL_, 8, answered(requests, (q) => ({ text: right(q) })))
  assert.deepEqual([good.phase, good.holds, good.right, good.wrong], ['deployed', true, 12, []])
  // through the door, as the runner hands the answers back
  assert.equal(call('repository', { deployed: {}, answers: answered(requests, (q) => ({ text: right(q) })) }).result!.structuredContent.holds, true)
  // an answer missing is an answer wrong
  assert.deepEqual(judgeDeployed(URL_, 8, answered(requests, (q) => ({ text: right(q) })).slice(1)).wrong, ['lean-holds'])
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the answers the live server gave on 2026-11-24 do not pass: a silent rejection of a true theorem, and error 1102 in place of the selftests and the audit. */
test('the answers the live server gave on 2026-11-24 do not pass: a silent rejection of a true theorem, and error 1102 in place of the selftests and the audit', () => {
  const requests = createDeployedRequests(URL_, 8)
  const live = (q: DeployedRequest) => (q.kind === 'lean-holds' || q.kind === 'lean-fails'
    ? { text: sse({ ok: false, timedOut: false, ms: 743, messages: [], toolchain, receipt: { kind: 'lean', address: 'ff86d84e-f362-6a3e-af3c-c8d994073ff4', handle: 'ff86d84e', path: 'src/quantum/uuid/programs/f/f/8/6/d/8/4/e/index.ts', sealed: true } }, true) }
    : q.id === 'audit-1-of-8' ? { text: right(q) } : { status: 503, text: 'error code: 1102' })
  const judged = judgeDeployed(URL_, 8, answered(requests, live))
  assert.deepEqual([judged.phase, judged.holds, judged.right, judged.wrong.length, judged.retry.length], ['deployed', false, 1, 11, 0])
  const evidence = (id: string) => judged.checks.find((c) => c.id === id)!.evidence
  // a false theorem "rejected" with no message of Lean's is no rejection: the prover never ran
  assert.match(evidence('lean-fails'), /must reject .* with an error message of its own/)
  assert.match(evidence('lean-holds'), /"messages":\[\]/)
  assert.match(evidence('selftest-seal'), /HTTP 503 error code: 1102/)
  assert.match(evidence('audit-0-of-8'), /HTTP 503 error code: 1102/)
  // a share with a failed check is wrong, and the failed check is named
  const failing = judgeDeployed(URL_, 8, answered(requests, (q) => ({ text: q.id === 'audit-6-of-8' ? sse({ shard: { i: 6, n: 8 }, total: 361, passed: 359, failed: 2, checks: [{ id: 'example:fold-superpositions', passed: false, evidence: 'holds false' }] }) : right(q) })))
  assert.deepEqual([failing.holds, failing.wrong], [false, ['audit-6-of-8']])
  assert.match(failing.checks.find((c) => c.id === 'audit-6-of-8')!.evidence, /example:fold-superpositions/)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a prover that is starting has given no verdict: its request alone is asked again with the reason, and after the last attempt it is wrong. */
test('a prover that is starting has given no verdict: its request alone is asked again with the reason, and after the last attempt it is wrong', () => {
  const requests = createDeployedRequests(URL_, 8), cold = answered(requests, (q) => (q.id === 'lean-holds' ? { text: unavailable } : q.id === 'lean-fails' ? { status: 0, text: 'TimeoutError: The operation was aborted due to timeout' } : { text: right(q) }))
  const first = judgeDeployed(URL_, 8, cold, 1, 0)
  assert.deepEqual([first.phase, 'holds' in first, first.requestList?.map((q) => q.id), first.kept?.length, first.retry.map((r) => r.why), first.waitMs], ['deployed-retry', false, ['lean-holds', 'lean-fails'], 10, ['prover_unavailable', 'HTTP 0'], 0])
  assert.match(first.retry[0]!.says, /lean-holds is asked again, attempt 2 of 5, because the prover gave no verdict \(prover_unavailable\).*no container application assigned/)
  // a selftest ended by 1102 is not a cold start: it is wrong at once, never asked again
  assert.deepEqual(judgeDeployed(URL_, 8, answered(requests, (q) => (q.id === 'selftest-seal' ? { status: 503, text: 'error code: 1102' } : { text: right(q) }))).wrong, ['selftest-seal'])
  const last = judgeDeployed(URL_, 8, cold, DEPLOYED_ATTEMPTS)
  assert.deepEqual([last.phase, last.holds, last.wrong], ['deployed', false, ['lean-holds', 'lean-fails']])
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the runner fetches the gate's requests, asks a cold prover again saying why, and exits by whether the gate holds. */
test('the runner fetches the gate\'s requests, asks a cold prover again saying why, and exits by whether the gate holds', async () => {
  const run = async (broken: boolean) => {
    let coldOnce = true
    const server = createServer((req, res) => { let body = ''; req.on('data', (c) => { body += c }).on('end', () => {
      const rpc = JSON.parse(body) as DeployedRequest['body'], q = createDeployedRequests('x', 8).find((r) => r.body.id === rpc.id)!
      const text = q.id === 'lean-holds' && coldOnce ? (coldOnce = false, unavailable) : q.id === 'lean-holds' && broken ? sse({ ok: false, timedOut: false, ms: 743, messages: [], toolchain }, true) : right(q)
      res.writeHead(200, { 'content-type': 'text/event-stream' }); res.end(text)
    }) })
    await new Promise<void>((done) => server.listen(0, '127.0.0.1', done))
    const url = `http://127.0.0.1:${(server.address() as { port: number }).port}/api/mcp`
    const child = spawn(process.execPath, ['src/quantum/uuid/programs/0/d/b/3/5/7/8/9/index.ts', 'step', 'repository', JSON.stringify({ deployed: { url, waitMs: 10 } })])
    let out = ''; child.stdout.on('data', (c) => { out += c }); child.stderr.on('data', (c) => { out += c })
    const code = await new Promise<number | null>((done) => child.on('close', done))
    server.close()
    return { code, out }
  }
  const healed = await run(false), still = await run(true)
  assert.match(healed.out, /retry lean-holds is asked again, attempt 2 of 5, because the prover gave no verdict \(prover_unavailable\)/)
  assert.deepEqual([healed.code, /"holds":true/.test(healed.out)], [0, true])
  assert.deepEqual([still.code, /"holds":false/.test(still.out)], [1, true])
})
