// The client of the textbook wave: the examples' verification requests, served from the wave the flow already fetched
// (verification.json) and, for any request the wave did not carry, fetched here by this device over its network — GET only,
// free public sources, a named user agent, no credential, a timeout — then joined back and sealed. Offline: the plan alone.
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import './teleport.ts'
import { handle, toolCallerOf } from '../src/quantum/processing/mcp.ts'
import { isShard, isMerge, takeShare, leaveShard, gatherShards, shardLabel } from './shard.ts'
import { getWithTimeout, getJson, publishRecord } from './mcp.ts'
const ROOT = process.cwd()
const call = toolCallerOf('textbook')
const main = async () => {
  // fast when clean: the wave is a function of the examples, the leads, the tools and the wave's results; the same inputs give the same seal
  const { uuidOf } = await import('../src/quantum/processing/unit/blocks.ts'); const { EXAMPLES } = await import('../src/quantum/processing/examples.ts'); const { LEADS } = await import('../src/quantum/processing/leads.ts')
  const outPath = join(ROOT, 'docs', 'public', 'textbook.json')
  const vpath = join(ROOT, 'docs', 'public', 'verification.json')
  const inputs = uuidOf(JSON.stringify({ examples: EXAMPLES.map((e) => [e.id, e.tool, e.arguments, e.shows, e.theorem ?? null]), leads: LEADS.length, tools: handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }), wave: (getJson(vpath, {}) as { date?: string }).date ?? null, offline: process.env.QPU_OFFLINE === '1' }))
  { const prev = getJson(outPath, {}) as { inputs?: string; id?: string }; if (prev.inputs === inputs) { console.log(`textbook: inputs unchanged (${inputs}); sealed wave ${prev.id} stands`); return } }
  const plan = call({ verify: true })
  const fetched: { url: string; status: number; ok: boolean; contracted?: string }[] = (getJson(vpath, {}) as { results?: { url: string; status: number; ok: boolean; contracted?: string }[] }).results ?? []
  const have = new Set(fetched.map((r) => r.url))
  if (isMerge) for (const r of gatherShards<{ url: string; status: number; ok: boolean; contracted?: string }[]>('textbook', [])) if (!have.has(r.url)) { fetched.push(r); have.add(r.url) }
  const missing = takeShare((plan.requestList as { url: string }[]).filter((r) => !have.has(r.url)))
  console.log(`textbook (${shardLabel()}): ${missing.length} to fetch`)
  if (process.env.QPU_OFFLINE !== '1') for (const r of missing) { try { const res = await getWithTimeout(r.url); fetched.push({ url: r.url, status: res.status, ok: res.ok }) } catch { fetched.push({ url: r.url, status: 0, ok: false }) } await new Promise((t) => setTimeout(t, 250)) }
  if (isShard) { leaveShard('textbook', fetched.filter((r) => missing.some((m) => m.url === r.url))); console.log(`textbook: ${shardLabel()} fetched its share`); process.exit(0) }
  const v = call({ results: fetched })
  // the textbook's axioms replaced by theorems through the tenant's Payload MCP plugin, as a client: when the tenant names its
  // instance (QPU_PAYLOAD_URL) and its key (QPU_PAYLOAD_API_KEY, sent as Authorization and never held by a tool), the pages whose
  // qpu blocks lack a theorem are found and updated with the kernel-accepted key; otherwise the plan is written and the lead stands
  const payloadUrl = process.env.QPU_PAYLOAD_URL, payloadKey = process.env.QPU_PAYLOAD_API_KEY, payloadAuth = process.env.QPU_PAYLOAD_AUTH_COLLECTION ?? 'users'
  const payload = toolCallerOf('payload'), payloadCall = (args: Record<string, unknown>) => payload({ theorems: true, payloadUrl, ...args })
  const post = async (r: { url: string; body: unknown }) => { const res = await fetch(r.url, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', authorization: `${payloadAuth} API-Key ${payloadKey}` }, body: JSON.stringify(r.body), signal: AbortSignal.timeout(30000) }); return await res.text() }
  let theorems: unknown = payloadCall({})
  if (payloadUrl && payloadKey && process.env.QPU_OFFLINE !== '1') {
    try {
      const plan = theorems as { requestList: { url: string; body: unknown }[] }
      const list = await post(plan.requestList[0]!)
      let step = payloadCall({ answers: { list } })
      if (step.phase === 'find') { const found = await post(step.requestList[0]); step = payloadCall({ answers: { list, found } }) }
      let sent = 0
      if (step.phase === 'update') for (const u of step.requestList as { url: string; body: unknown }[]) { await post(u); sent += 1 }
      theorems = { ...step, sent }
      console.log(`textbook: through the Payload MCP at ${payloadUrl}: ${step.phase}${step.phase === 'update' ? `, ${step.axioms} axiom(s) in ${step.pages} page(s), ${sent} replaced by theorems` : ''}`)
    } catch (e) { theorems = { phase: 'refused', error: (e as Error).message }; console.log(`textbook: the Payload MCP did not answer: ${(e as Error).message.slice(0, 80)}`) }
  } else console.log(`textbook: no Payload MCP named (QPU_PAYLOAD_URL, QPU_PAYLOAD_API_KEY): the plan is written, the lead stands`)
  // Payload's combinatorial surface: the dimensions decided by theorem, the sources re-read here (GET, public, a named user agent) and compared to the table; drift a lead
  const schemasCall = (args: Record<string, unknown>) => payload({ schemas: true, ...args })
  let schemas = schemasCall({})
  if (process.env.QPU_OFFLINE !== '1') { const answers: Record<string, string> = {}; for (const r of schemas.requestList as { url: string }[]) { try { const res = await getWithTimeout(r.url, 'text/plain'); if (res.ok) answers[r.url] = await res.text() } catch { /* unread: reported */ } } schemas = schemasCall({ answers }) }
  console.log(`textbook: Payload's surface: ${schemas.dimensions.length} dimensions, ${schemas.agreeing} agree with their theorems, ${schemas.served} served by the match tool${schemas.reread ? `; sources re-read: ${schemas.reread.answered}, ${schemas.reread.agree ? 'no drift' : `${schemas.reread.leads.length} drift lead(s)`}${schemas.reread.unread.length ? `, unread: ${schemas.reread.unread.join(', ')}` : ''}` : ''}`)
  // the prose audited around the textbook: the README, the home page and every tool's own description, each number resting on an expression or a lead
  const listed = (handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) as { result: { tools: { name: string; description: string }[] } }).result.tools
  const proseTexts: Record<string, string> = { 'README.md': readFileSync(join(ROOT, 'README.md'), 'utf8'), 'docs/index.md': readFileSync(join(ROOT, 'docs', 'index.md'), 'utf8'), ...Object.fromEntries(listed.map((t) => [`tools/list ${t.name}`, t.description])) }
  const prose = call({ prose: { texts: proseTexts } }) as { says: string; numbers: number; backed: number; unbacked: number; verdicts: number; leads: unknown[] }
  console.log(`textbook: prose: ${prose.says}`)
  const date = new Date().toISOString()
  const reflected = call({ reflect: { books: (getJson(join(ROOT, 'docs', 'public', 'sources.json'), {}) as { textbooks?: { byTheorem?: Record<string, number> } }).textbooks?.byTheorem } }) as { says: string }
  console.log(`textbook: reflected: ${reflected.says}`)
  publishRecord('textbook', { date, inputs, theoremsViaPayloadMcp: theorems, prose: { numbers: prose.numbers, backed: prose.backed, unbacked: prose.unbacked, verdicts: prose.verdicts, leads: prose.leads }, payloadSurface: { readOn: schemas.readOn, dimensions: schemas.dimensions, agreeing: schemas.agreeing, served: schemas.served, standards: schemas.standards.length, coordination: schemas.coordination.length, reread: schemas.reread, leads: schemas.leads }, online: process.env.QPU_OFFLINE !== '1', fromWave: plan.requests - missing.length, fetchedHere: process.env.QPU_OFFLINE !== '1' ? missing.length : 0, compliance: plan.compliance, ...v })
  writeFileSync(join(ROOT, 'docs', 'textbook.md'), ['---', 'title: Textbook', 'order: 44', '---', '', '# The textbook, verified online', '', `Every example of the surface, categorised for reuse by the \`textbook\` tool, and its public sources fetched by this device on ${date}: ${v.requests} requests (${plan.requests - missing.length} already in the wave), the outcome sealed as \`${v.id}\`. ${plan.compliance}.`, '', `States: ${Object.entries(v.states).map(([k, n]) => `${k} ${n}`).join(', ')}.`, '', '| Example | Tool | Theorem | Requests | Reachable | Contract | State |', '|---|---|---|---:|---:|---:|---|', ...(v.verified as { id: string; tool: string; theorem: string | null; requests: number; reachable: number; contracted: number; state: string }[]).map((x) => `| ${x.id} | ${x.tool} | ${x.theorem ?? '—'} | ${x.requests} | ${x.reachable} | ${x.contracted} | ${x.state} |`), ''].join('\n'))
  console.log(`textbook: ${v.examples} examples, ${v.requests} requests (${plan.requests - missing.length} from the wave, ${missing.length} ${process.env.QPU_OFFLINE === '1' ? 'unfetched offline' : 'fetched here'}); ${Object.entries(v.states).map(([k, n]) => `${k} ${n}`).join(', ')}; sealed ${v.id}`)
}
main().catch((e) => { console.error(e); process.exit(1) })
