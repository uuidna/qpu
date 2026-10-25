// The client of the wave tool: it asks for the requests, fetches each once (a pool in flight, paced per host, progressive
// writes), hands the bodies back with the contracts discovery found, and writes what the tool returns. Selftest first.
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { handle } from '../src/quantum/mcp.ts'
import { LICENSE } from '../src/quantum/license.ts'
import type { WaveRequest, WaveResult } from '../src/quantum/wave.ts'

const ROOT = process.cwd()
const call = (args: Record<string, unknown>): any => { const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'wave', arguments: args } }) as any; if (r.error) throw new Error(r.error.message); return r.result.structuredContent }
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const main = async () => {
  const selftest = call({ selftest: true })
  console.log(`wave selftest: ${selftest.passed ? 'pass' : 'FAIL'} (${selftest.checks.filter((c: { passed: boolean }) => c.passed).length}/${selftest.checks.length})`)
  const plan = call({})
  const queue = [...(plan.requestList as WaveRequest[])]
  const discoveryPath = join(ROOT, 'docs', 'public', 'discovery.json')
  const contracts: Record<string, string[]> = {}
  if (existsSync(discoveryPath)) { try { for (const h of (JSON.parse(readFileSync(discoveryPath, 'utf8')) as { hosts: { host: string; paths?: string[] }[] }).hosts) if (h.paths?.length) contracts[h.host] = h.paths } catch { /* no discovery: every request uncontracted, said so by the tool */ } }
  const results: WaveResult[] = []
  const byHost = new Map<string, number>()
  const inFlight = new Set<Promise<void>>()
  const POOL = 8
  let i = 0
  const one = async (r: WaveRequest) => {
    const host = new URL(r.url).host
    const pace = r.verifier === 'source-page' ? 250 : 1200
    const wait = Math.max(0, (byHost.get(host) ?? 0) + pace - Date.now())
    byHost.set(host, Date.now() + wait)
    if (wait) await sleep(wait)
    const started = Date.now()
    try { const res = await fetch(r.url, { headers: { accept: '*/*', 'user-agent': 'uuidna-qpu-verify (ceccec@psg.bg)' }, redirect: 'follow', signal: AbortSignal.timeout(20000) }); results.push({ ...r, status: res.status, ok: res.ok, ms: Date.now() - started, text: await res.text() }) }
    catch (e) { results.push({ ...r, status: 0, ok: false, ms: Date.now() - started, text: `fetch failed: ${(e as Error).message}` }) }
    i += 1
    if (i % 50 === 0) { console.log(`verify ${i}/${queue.length + i}`); writeFileSync(join(ROOT, 'docs', 'public', 'verification.json'), JSON.stringify({ date: new Date().toISOString(), partial: true, leads: plan.leads, requests: plan.requests, done: i, results: call({ results, contracts }).results }, null, 1) + '\n') }
  }
  while (queue.length || inFlight.size) {
    while (queue.length && inFlight.size < POOL) { const p = one(queue.shift()!).finally(() => inFlight.delete(p)); inFlight.add(p) }
    if (inFlight.size) await Promise.race(inFlight)
  }
  const read = call({ results, contracts })
  const date = new Date().toISOString()
  mkdirSync(join(ROOT, 'docs', 'public'), { recursive: true })
  writeFileSync(join(ROOT, 'docs', 'public', 'verification.json'), JSON.stringify({ license: LICENSE.attribution, date, selftest: { passed: selftest.passed }, leads: plan.leads, requests: read.requests, summary: read.summary, results: read.results }, null, 1) + '\n')
  writeFileSync(join(ROOT, 'docs', 'verification.md'), read.page)
  console.log(`verify: ${read.requests} requests, ${read.reachable} reachable; ${JSON.stringify(read.summary)}`)
}
main().catch((e) => { console.error(e); process.exit(1) })
