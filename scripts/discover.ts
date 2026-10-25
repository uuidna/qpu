// The client of the discover tool: thin and host-agnostic. It asks the tool what to fetch, fetches it, hands the answers
// back until the tool says "discovery", and writes what the tool returns. It runs the toolbox's selftest first; a failed
// check is recorded, never a stop. Network; skipped by `next --offline`.
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { handle } from '../src/quantum/mcp.ts'
import { LICENSE } from '../src/quantum/license.ts'
import type { Request, Answer } from '../src/quantum/discovery.ts'

const ROOT = process.cwd()
const UA = 'uuidna-qpu-discover (ceccec@psg.bg)'
const call = (args: Record<string, unknown>): any => { const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'discover', arguments: args } }) as any; if (r.error) throw new Error(r.error.message); return r.result.structuredContent }
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const fetchOne = async (r: Request): Promise<Answer> => {
  try { const res = await fetch(r.url, { method: r.method, headers: { accept: 'application/json, text/event-stream, application/yaml, text/xml, */*', 'user-agent': UA, ...(r.body ? { 'content-type': 'application/json' } : {}), ...(r.headers ?? {}) }, body: r.body ? JSON.stringify(r.body) : undefined, redirect: 'follow', signal: AbortSignal.timeout(30000) }); return { ...r, status: res.status, type: res.headers.get('content-type') ?? '', text: await res.text() } }
  catch (e) { return { ...r, status: 0, type: '', text: `fetch failed: ${(e as Error).message}` } }
}
const main = async () => {
  const selftest = call({ selftest: true })
  console.log(`discover selftest: ${selftest.passed ? 'pass' : 'FAIL'} (${selftest.checks.filter((c: { passed: boolean }) => c.passed).length}/${selftest.checks.length})`)
  // the quantum: answers kept by request id for a day; only the rest is fetched, no more than the quantum allows; a discovery
  // from what is answered so far is written either way, marked partial while requests remain
  const QUANTUM_MS = Number(process.env.QPU_QUANTUM_MS ?? 180_000)
  const started0 = Date.now()
  const cachePath = join(ROOT, 'docs', 'public', 'discovery-answers.json')
  const cache: Record<string, Answer & { at: string }> = existsSync(cachePath) ? (() => { try { return JSON.parse(readFileSync(cachePath, 'utf8')) } catch { return {} } })() : {}
  const fresh = (a: { at: string }) => Date.now() - Date.parse(a.at) < 86_400_000
  const answers: Answer[] = []
  let remaining = 0, fetched = 0, reused = 0
  // tenant configurable: QPU_MCP_HOSTS names the hosts (default: the unit, this tree, Cloudflare's servers); QPU_MCP_TOKEN_<HOST>
  // (dots and dashes as underscores, upper case) carries the tenant's token for a host; both from the environment or .dev.vars
  const vars: Record<string, string> = existsSync(join(ROOT, '.dev.vars')) ? Object.fromEntries(readFileSync(join(ROOT, '.dev.vars'), 'utf8').split('\n').filter((l) => /^[A-Z_0-9]+=/.test(l)).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).replace(/^"|"$/g, '')])) : {}
  const all = { ...vars, ...process.env } as Record<string, string | undefined>
  const mcpHosts = (all.QPU_MCP_HOSTS ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  const auth: Record<string, string> = {}
  for (const [k, v] of Object.entries(all)) if (k.startsWith('QPU_MCP_TOKEN_') && v) auth[k.slice('QPU_MCP_TOKEN_'.length).toLowerCase().replace(/_/g, '.')] = v
  let phase = call({ ...(mcpHosts.length ? { mcpHosts } : {}), auth })
  console.log(`discover: ${mcpHosts.length || 'the default'} MCP hosts, ${Object.keys(auth).length} with a tenant token`)
  while (phase.phase !== 'discovery') {
    const list = phase.requestList as Request[]
    remaining = 0
    for (const r of list) {
      const c = cache[r.id]
      if (c && fresh(c) && c.status !== 0) { answers.push({ ...r, status: c.status, type: c.type, text: c.text }); reused += 1; continue }
      if (Date.now() - started0 >= QUANTUM_MS) { remaining += 1; continue }
      const a = await fetchOne(r); answers.push(a); fetched += 1; cache[r.id] = { ...a, at: new Date().toISOString() }
      await sleep(r.purpose === 'contract' ? 150 : 300)
    }
    writeFileSync(cachePath, JSON.stringify(cache) + '\n')
    if (remaining) { phase = call({ answers }); if (phase.phase !== 'discovery') { const more = (phase.requestList as Request[]).filter((r) => !answers.some((a) => a.id === r.id)); remaining += more.length; phase = call({ answers: [...answers, ...more.map((r) => ({ ...r, status: 0, type: '', text: 'not fetched in this quantum' }))] }) } break }
    phase = call({ answers })
  }
  const date = new Date().toISOString()
  mkdirSync(join(ROOT, 'docs', 'public'), { recursive: true })
  writeFileSync(join(ROOT, 'docs', 'public', 'discovery.json'), JSON.stringify({ license: LICENSE.attribution, date, partial: remaining > 0, remaining, fetched, reused, selftest: { passed: selftest.passed, checks: selftest.checks }, ...phase.discovery }, null, 1) + '\n')
  writeFileSync(join(ROOT, 'docs', 'discovery.md'), phase.page)
  console.log(`discover: ${phase.hosts} hosts, ${phase.doors} doors, statement→verdict ${phase.statementVerdict}, leads ${phase.leads}; ${reused} answers kept from today, ${fetched} fetched${remaining ? `, ${remaining} remain for the next quantum` : ', nothing remains'}`)
}
main().catch((e) => { console.error(e); process.exit(1) })
