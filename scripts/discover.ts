// The client of the discover tool: thin and host-agnostic. It asks the tool what to fetch, fetches it, hands the answers
// back until the tool says "discovery", and writes what the tool returns. It runs the toolbox's selftest first; a failed
// check is recorded, never a stop. Network; skipped by `next --offline`.
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import './teleport.ts'
import { toolCallerOf } from '../src/quantum/mcp.ts'
import type { Request, Answer } from '../src/quantum/discovery.ts'
import { isShard, isMerge, shareOf, leaveShard, gatherShards, shardLabel } from './shard.ts'
import { bestDoorsOf } from '../src/quantum/discovery.ts'

const ROOT = process.cwd()
mkdirSync(join(ROOT, '.qpu', 'cache'), { recursive: true })
const UA = 'uuidna-qpu-discover (https://qpu.uuidna.com)'
const call = toolCallerOf('discover')
import { setTimeout as sleep } from 'node:timers/promises'
import { readJson, getOf, mcpOf, selftestOf, publishOf, leadsOf } from './mcp.ts'
const { all: LEADS } = await leadsOf()
const fetchOne = async (r: Request): Promise<Answer> => {
  try { const res = await getOf(r.url, 'application/json, text/event-stream, application/yaml, text/xml, */*', 30000, { method: r.method, body: r.body, agent: UA, headers: r.headers }); return { ...r, status: res.status, type: res.headers.get('content-type') ?? '', text: await res.text() } }
  catch (e) { return { ...r, status: 0, type: '', text: `fetch failed: ${(e as Error).message}` } }
}
const main = async () => {
  const selftest = selftestOf('discover', call)
  // the quantum: answers kept by request id for a day; only the rest is fetched, no more than the quantum allows; a discovery
  // from what is answered so far is written either way, marked partial while requests remain
  const QUANTUM_MS = Number(process.env.QPU_QUANTUM_MS ?? 180_000)
  const started0 = Date.now()
  const cachePath = join(ROOT, '.qpu', 'cache', 'discovery-answers.json')
  const cache: Record<string, Answer & { at: string }> = readJson(cachePath, {})
  if (isMerge) Object.assign(cache, gatherShards<Record<string, Answer & { at: string }>>('discover', {}))
  const shardCache: Record<string, Answer & { at: string }> = {}
  console.log(`discover (${shardLabel()})`)
  const fresh = (a: { at: string }) => Date.now() - Date.parse(a.at) < 86_400_000
  const answers: Answer[] = []
  let remaining = 0, fetched = 0, reused = 0
  // tenant configurable: QPU_MCP_HOSTS names the hosts (default: the unit, this tree, Cloudflare's servers); QPU_MCP_TOKEN_<HOST>
  // (dots and dashes as underscores, upper case) carries the tenant's token for a host; both from the environment or .dev.vars
  const all = process.env
  const mcpHosts = (all.QPU_MCP_HOSTS ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  const auth: Record<string, string> = {}
  for (const [k, v] of Object.entries(all)) if (k.startsWith('QPU_MCP_TOKEN_') && v) auth[k.slice('QPU_MCP_TOKEN_'.length).toLowerCase().replace(/_/g, '.')] = v
  let phase = call({ ...(mcpHosts.length ? { mcpHosts } : {}), auth })
  console.log(`discover: ${mcpHosts.length || 'the default'} MCP hosts, ${Object.keys(auth).length} with a tenant token`)
  while (phase.phase !== 'discovery') {
    const list = isShard ? shareOf(phase.requestList as Request[]) : (phase.requestList as Request[])
    remaining = 0
    for (const r of list) {
      const c = cache[r.id]
      if (c && fresh(c) && c.status !== 0) { answers.push({ ...r, status: c.status, type: c.type, text: c.text }); reused += 1; continue }
      if (Date.now() - started0 >= QUANTUM_MS) { remaining += 1; continue }
      const a = await fetchOne(r); answers.push(a); fetched += 1; cache[r.id] = { ...a, at: new Date().toISOString() }; shardCache[r.id] = cache[r.id]!
      await sleep(r.purpose === 'contract' ? 150 : 300)
    }
    // a shard leaves its answers and stops after the first phase: the merge runs every phase with everything kept
    if (isShard) { leaveShard('discover', shardCache); console.log(`discover: ${shardLabel()} fetched ${fetched}, ${remaining} remain`); return }
    writeFileSync(cachePath, JSON.stringify(cache) + '\n')
    if (remaining) { phase = call({ answers }); if (phase.phase !== 'discovery') { const more = (phase.requestList as Request[]).filter((r) => !answers.some((a) => a.id === r.id)); remaining += more.length; phase = call({ answers: [...answers, ...more.map((r) => ({ ...r, status: 0, type: '', text: 'not fetched in this quantum' }))] }) } break }
    phase = call({ answers })
  }
  const date = new Date().toISOString()
  // the sitemap the door read, sealed in the docket at its content address; the newest sealed copy, read back, is what the leads tool is handed
  const { sitemap: read, ...discovery } = phase.discovery, mcp = mcpOf()
  if (read.urls.length) await mcp.call('createEntries', { kind: 'document', from: 'sitemap', body: read })
  const sealed = mcp.docsOf((await mcp.call('findEntries', { where: JSON.stringify({ from: { equals: 'sitemap' } }), sort: '-createdAt', limit: 1, page: 1 })).text ?? '')[0] as { id: string; body: { urls: unknown[] } } | undefined
  const s = sealed ? toolCallerOf('leads')({ sitemap: sealed.body }) : null, sitemap = s ? { entry: sealed!.id, urls: s.urls, covered: s.covered, refused: s.refused, counts: s.counts } : { entry: null, says: 'no sealed sitemap read from the docket' }
  publishOf('discovery', { date, partial: remaining > 0, remaining, fetched, reused, selftest: { passed: selftest.passed, checks: selftest.checks }, ...discovery, sitemap })
  writeFileSync(join(ROOT, 'docs', 'discovery.md'), phase.page)
  // leads first: every hand-written lead still open asks the registry for related MCPs (cached a day, within what is left of the quantum), then each remote's tools/list is read so the related doors are known through qpu
  const related: { lead: string; words: string[]; servers: number; serverList: unknown[]; extended: { server: string; url: string; status: number; doors: number }[]; bestDoors: { server: string; url: string; door: string; score: number; shared: string[] }[] }[] = []
  let relatedFetched = 0, relatedRemaining = 0
  for (const l of shareOf(LEADS.filter((x) => (x.status === 'open' || x.status === 'partial') && x.source !== 'statement' && !/^(sitemap|page:|clay-|lead:)/.test(x.id)))) {
    const plan = call({ lead: l.id, records: [l] })
    const got: unknown[] = []
    for (const r of plan.requestList as Request[]) {
      const c = cache[r.id]
      if (c && fresh(c) && c.status !== 0) { got.push({ ...r, status: c.status, type: c.type, text: c.text }); continue }
      if (Date.now() - started0 >= QUANTUM_MS) { relatedRemaining += 1; continue }
      const a = await fetchOne(r); got.push(a); relatedFetched += 1; cache[r.id] = { ...a, at: new Date().toISOString() }
      await sleep(200)
    }
    if (!got.length) continue
    const rel = call({ lead: l.id, answers: got, records: [l] })
    const extended: { server: string; url: string; status: number; doors: number }[] = []
    const remotes: { server: string; url: string; tools: { name: string; description?: string }[] }[] = []
    for (const e of (rel.extendList as { id: string; server: string; url: string; body: unknown }[])) {
      const c = cache[e.id]
      let a: Answer
      if (c && fresh(c)) a = { ...e, purpose: 'mcp-list', host: new URL(e.url).host, method: 'POST', status: c.status, type: c.type, text: c.text } as Answer
      else if (Date.now() - started0 >= QUANTUM_MS) { relatedRemaining += 1; continue }
      else { a = await fetchOne({ ...e, purpose: 'mcp-list', host: new URL(e.url).host, method: 'POST' } as Request); relatedFetched += 1; cache[e.id] = { ...a, at: new Date().toISOString() }; await sleep(200) }
      let doors = 0; try { const j = JSON.parse(a.text.startsWith('event:') || a.text.startsWith('data:') ? (a.text.split('\n').find((x) => x.startsWith('data:')) ?? '').slice(5) : a.text); const tools = (j.result?.tools ?? []) as { name: string; description?: string }[]; doors = tools.length; if (tools.length) remotes.push({ server: e.server, url: e.url, tools }) } catch { /* no doors read */ }
      extended.push({ server: e.server, url: e.url, status: a.status, doors })
    }
    // use them via qpu: the foreign doors whose words match the lead best, proposed, never called
    related.push({ lead: l.id, words: plan.words, servers: rel.servers, serverList: rel.serverList, extended, bestDoors: bestDoorsOf(l, remotes) })
  }
  writeFileSync(cachePath, JSON.stringify(cache) + '\n')
  writeFileSync(join(ROOT, 'docs', 'public', 'related-mcps.json'), JSON.stringify({ date, partial: relatedRemaining > 0, remaining: relatedRemaining, fetched: relatedFetched, leads: related.length, withServers: related.filter((r) => r.servers > 0).length, related }, null, 1) + '\n')
  writeFileSync(join(ROOT, 'docs', 'related-mcps.md'), ['---', 'title: Related MCPs', 'order: 55', '---', '', '# Leads first: the MCPs related to each lead', '', `Generated by \`npm run next\` on ${date} through the \`discover\` tool: every hand-written lead still open asks the public MCP registry (registry.modelcontextprotocol.io) with its own words before any guess; the servers it names are extended through qpu (their tools/list read). ${related.length} lead(s) asked, ${related.filter((r) => r.servers > 0).length} with related servers${relatedRemaining ? `; ${relatedRemaining} request(s) wait for the next quantum` : ''}.`, '', '| Lead | Words asked | Related servers | Extended (doors) | Doors that match best (proposed, never called) |', '|---|---|---|---|---|', ...related.map((r) => `| ${r.lead} | ${r.words.join(', ')} | ${(r.serverList as { name: string }[]).map((x) => x.name).join(', ') || '—'} | ${r.extended.map((e) => `${new URL(e.url).host}: ${e.status === 200 ? `${e.doors} door(s)` : `HTTP ${e.status}`}`).join('; ') || '—'} | ${r.bestDoors.map((d) => `${new URL(d.url).host}:${d.door} (${d.shared.join(' ')})`).join('; ') || '—'} |`), '', `Doors proposed in all: ${related.reduce((n, r) => n + r.bestDoors.length, 0)}; a proposed door is a lead for the operator, who alone calls another\'s server.`, ''].join('\n'))
  console.log(`related: ${related.length} lead(s) asked the registry, ${related.filter((r) => r.servers > 0).length} with servers, ${related.reduce((n, r) => n + r.extended.filter((e) => e.status === 200).length, 0)} remote(s) extended, ${related.reduce((n, r) => n + r.bestDoors.length, 0)} door(s) proposed, ${relatedFetched} fetched${relatedRemaining ? `, ${relatedRemaining} remain for the next quantum` : ''}`)
  console.log(`discover: ${phase.hosts} hosts, ${phase.doors} doors, statement→verdict ${phase.statementVerdict}, leads ${phase.leads}, sitemap ${sitemap.entry ? `${s.urls} urls (${read.urls.length} read live), ${s.total} page leads` : 'unread'}; ${reused} answers kept from today, ${fetched} fetched${remaining ? `, ${remaining} remain for the next quantum` : ', nothing remains'}`)
}
main().catch((e) => { console.error(e); process.exit(1) })
