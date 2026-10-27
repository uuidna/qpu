// The client of the wave tool: it asks for the requests, fetches each once (a pool in flight, paced per host, progressive
// writes), hands the bodies back with the contracts discovery found, and writes what the tool returns. Selftest first.
import { writeFileSync, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import './teleport.ts'
import { toolCallerOf } from '../src/quantum/mcp.ts'
import { LICENSE } from '../src/quantum/license.ts'
import type { WaveRequest, WaveResult } from '../src/quantum/wave.ts'
import { isShard, isMerge, shareOf, leaveShard, gatherShards, shardLabel } from './shard.ts'

const ROOT = process.cwd()
const call = toolCallerOf('wave')
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const main = async () => {
  const selftest = call({ selftest: true })
  console.log(`wave selftest: ${selftest.passed ? 'pass' : 'FAIL'} (${selftest.checks.filter((c: { passed: boolean }) => c.passed).length}/${selftest.checks.length})`)
  const plan = call({})
  // the quantum: what an earlier run fetched today stands (by url); only the rest is fetched, and no more than the quantum allows
  const QUANTUM_MS = Number(process.env.QPU_QUANTUM_MS ?? 180_000)
  const started0 = Date.now()
  const vpath0 = join(ROOT, 'docs', 'public', 'verification.json')
  const kept: WaveResult[] = []
  if (existsSync(vpath0)) { try { const prev = JSON.parse(readFileSync(vpath0, 'utf8')) as { date?: string; results?: WaveResult[] }; if (prev.date && Date.now() - Date.parse(prev.date) < 86_400_000) for (const r of prev.results ?? []) if (r.url && typeof r.status === 'number') kept.push(r) } catch { /* nothing kept */ } }
  const keyOf = (r: WaveRequest) => (r.method === 'POST' ? `${r.url}#${JSON.stringify(r.body)}` : r.url)
  // the merge gathers what the shards fetched, as if kept from today
  if (isMerge) for (const r of gatherShards<WaveResult[]>('verify', [])) if (!kept.some((k) => keyOf(k) === keyOf(r))) kept.push(r)
  const have = new Set(kept.map(keyOf))
  const all = plan.requestList as WaveRequest[]
  const queue = shareOf(all.filter((r) => !have.has(keyOf(r))))
  console.log(`verify (${shardLabel()})`)
  console.log(`verify: ${all.length} requests, ${all.length - queue.length} kept from today, ${queue.length} to fetch in a quantum of ${QUANTUM_MS / 1000} s`)
  const discoveryPath = join(ROOT, 'docs', 'public', 'discovery.json')
  const contracts: Record<string, string[]> = {}
  if (existsSync(discoveryPath)) { try { for (const h of (JSON.parse(readFileSync(discoveryPath, 'utf8')) as { hosts: { host: string; paths?: string[] }[] }).hosts) if (h.paths?.length) contracts[h.host] = h.paths } catch { /* no discovery: every request uncontracted, said so by the tool */ } }
  const results: WaveResult[] = kept.filter((r) => all.some((a) => keyOf(a) === keyOf(r)))
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
    try { const res = await fetch(r.url, { method: r.method ?? 'GET', headers: { accept: r.accept ?? '*/*', 'user-agent': 'uuidna-qpu-verify (https://qpu.uuidna.com)', ...(r.body ? { 'content-type': 'application/json' } : {}) }, body: r.body ? JSON.stringify(r.body) : undefined, redirect: 'follow', signal: AbortSignal.timeout(20000) }); results.push({ ...r, status: res.status, ok: res.ok, ms: Date.now() - started, text: await res.text() }) }
    catch (e) { results.push({ ...r, status: 0, ok: false, ms: Date.now() - started, text: `fetch failed: ${(e as Error).message}` }) }
    i += 1
    if (i % 50 === 0) { console.log(`verify ${i}/${queue.length + i}`); writeFileSync(join(ROOT, 'docs', 'public', 'verification.json'), JSON.stringify({ date: new Date().toISOString(), partial: true, leads: plan.leads, requests: all.length, done: results.length, results: call({ results, contracts }).results }, null, 1) + '\n') }
  }
  while ((queue.length && Date.now() - started0 < QUANTUM_MS) || inFlight.size) {
    while (queue.length && inFlight.size < POOL && Date.now() - started0 < QUANTUM_MS) { const p = one(queue.shift()!).finally(() => inFlight.delete(p)); inFlight.add(p) }
    if (inFlight.size) await Promise.race(inFlight)
  }
  const remaining = queue.length
  // a shard leaves what it fetched and stops here: the merge writes the artefacts
  if (isShard) { const mine = results.filter((r) => !have.has(keyOf(r))); leaveShard('verify', mine); console.log(`verify: ${shardLabel()} fetched ${mine.length}, ${remaining} remain`); return }
  const read = call({ results, contracts })
  const date = new Date().toISOString()
  writeFileSync(join(ROOT, 'docs', 'public', 'verification.json'), JSON.stringify({ license: LICENSE.attribution, date, selftest: { passed: selftest.passed }, partial: remaining > 0, remaining, leads: plan.leads, requests: all.length, done: read.results.length, summary: read.summary, results: read.results }, null, 1) + '\n')
  writeFileSync(join(ROOT, 'docs', 'verification.md'), read.page)
  console.log(`verify: ${read.results.length} of ${all.length} fetched, ${read.reachable} reachable${remaining ? `; ${remaining} remain for the next quantum` : '; the wave is whole'}; ${JSON.stringify(read.summary)}`)
}
main().catch((e) => { console.error(e); process.exit(1) })
