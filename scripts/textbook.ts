// The client of the textbook wave: the examples' verification requests, served from the wave the flow already fetched
// (verification.json) and, for any request the wave did not carry, fetched here by this device over its network — GET only,
// free public sources, a named user agent, no credential, a timeout — then joined back and sealed. Offline: the plan alone.
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import './teleport.ts'
import { handle } from '../src/quantum/mcp.ts'
import { isShard, isMerge, shareOf, leaveShard, gatherShards, shardLabel } from './shard.ts'
import { LICENSE } from '../src/quantum/license.ts'
const ROOT = process.cwd()
const call = (args: Record<string, unknown>): any => { const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'textbook', arguments: args } }) as any; if (r.error) throw new Error(r.error.message); return r.result.structuredContent }
const main = async () => {
  // fast when clean: the wave is a function of the examples, the leads, the tools and the wave's results; the same inputs give the same seal
  const { uuidOf } = await import('../src/quantum/blocks.ts'); const { EXAMPLES } = await import('../src/quantum/examples.ts'); const { LEADS } = await import('../src/quantum/leads.ts')
  const outPath = join(ROOT, 'docs', 'public', 'textbook.json')
  const vpathEarly = join(ROOT, 'docs', 'public', 'verification.json')
  const inputs = uuidOf(JSON.stringify({ examples: EXAMPLES.map((e) => [e.id, e.tool, e.arguments, e.shows, e.theorem ?? null]), leads: LEADS.length, tools: handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }), wave: existsSync(vpathEarly) ? (JSON.parse(readFileSync(vpathEarly, 'utf8')) as { date?: string }).date ?? null : null, offline: process.env.QPU_OFFLINE === '1' }))
  if (existsSync(outPath)) { try { const prev = JSON.parse(readFileSync(outPath, 'utf8')) as { inputs?: string; id?: string }; if (prev.inputs === inputs) { console.log(`textbook: inputs unchanged (${inputs}); sealed wave ${prev.id} stands`); return } } catch { /* re-run */ } }
  const plan = call({ verify: true })
  const vpath = join(ROOT, 'docs', 'public', 'verification.json')
  const fetched: { url: string; status: number; ok: boolean; contracted?: string }[] = existsSync(vpath) ? ((JSON.parse(readFileSync(vpath, 'utf8')) as { results?: { url: string; status: number; ok: boolean; contracted?: string }[] }).results ?? []) : []
  const have = new Set(fetched.map((r) => r.url))
  if (isMerge) for (const r of gatherShards<{ url: string; status: number; ok: boolean; contracted?: string }[]>('textbook', [])) if (!have.has(r.url)) { fetched.push(r); have.add(r.url) }
  const missing = shareOf((plan.requestList as { url: string }[]).filter((r) => !have.has(r.url)))
  console.log(`textbook (${shardLabel()}): ${missing.length} to fetch`)
  if (process.env.QPU_OFFLINE !== '1') for (const r of missing) { try { const res = await fetch(r.url, { headers: { accept: '*/*', 'user-agent': 'uuidna-qpu-textbook (https://qpu.uuidna.com)' }, redirect: 'follow', signal: AbortSignal.timeout(20000) }); fetched.push({ url: r.url, status: res.status, ok: res.ok }) } catch { fetched.push({ url: r.url, status: 0, ok: false }) } await new Promise((t) => setTimeout(t, 250)) }
  if (isShard) { leaveShard('textbook', fetched.filter((r) => missing.some((m) => m.url === r.url))); console.log(`textbook: ${shardLabel()} fetched its share`); process.exit(0) }
  const v = call({ results: fetched })
  // the textbook's axioms replaced by theorems through the tenant's Payload MCP plugin, as a client: when the tenant names its
  // instance (QPU_PAYLOAD_URL) and its key (QPU_PAYLOAD_API_KEY, sent as Authorization and never held by a tool), the pages whose
  // qpu blocks lack a theorem are found and updated with the kernel-accepted key; otherwise the plan is written and the lead stands
  const vars: Record<string, string> = existsSync(join(ROOT, '.dev.vars')) ? Object.fromEntries(readFileSync(join(ROOT, '.dev.vars'), 'utf8').split('\n').filter((l) => /^[A-Z_0-9]+=/.test(l)).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).replace(/^"|"$/g, '')])) : {}
  const payloadUrl = process.env.QPU_PAYLOAD_URL ?? vars.QPU_PAYLOAD_URL, payloadKey = process.env.QPU_PAYLOAD_API_KEY ?? vars.QPU_PAYLOAD_API_KEY, payloadAuth = process.env.QPU_PAYLOAD_AUTH_COLLECTION ?? vars.QPU_PAYLOAD_AUTH_COLLECTION ?? 'users'
  const payloadCall = (args: Record<string, unknown>): any => { const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'payload', arguments: { theorems: true, payloadUrl: payloadUrl ?? undefined, ...args } } }) as any; if (r.error) throw new Error(r.error.message); return r.result.structuredContent }
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
  const schemasCall = (args: Record<string, unknown>): any => { const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'payload', arguments: { schemas: true, ...args } } }) as any; if (r.error) throw new Error(r.error.message); return r.result.structuredContent }
  let schemas = schemasCall({})
  if (process.env.QPU_OFFLINE !== '1') { const answers: Record<string, string> = {}; for (const r of schemas.requestList as { url: string }[]) { try { const res = await fetch(r.url, { headers: { accept: 'text/plain', 'user-agent': 'uuidna-qpu-textbook (https://qpu.uuidna.com)' }, signal: AbortSignal.timeout(20000) }); if (res.ok) answers[r.url] = await res.text() } catch { /* unread: reported */ } } schemas = schemasCall({ answers }) }
  console.log(`textbook: Payload's surface: ${schemas.dimensions.length} dimensions, ${schemas.agreeing} agree with their theorems, ${schemas.served} served by the match tool${schemas.reread ? `; sources re-read: ${schemas.reread.answered}, ${schemas.reread.agree ? 'no drift' : `${schemas.reread.leads.length} drift lead(s)`}${schemas.reread.unread.length ? `, unread: ${schemas.reread.unread.join(', ')}` : ''}` : ''}`)
  const date = new Date().toISOString()
  writeFileSync(join(ROOT, 'docs', 'public', 'textbook.json'), JSON.stringify({ license: LICENSE.attribution, date, inputs, theoremsViaPayloadMcp: theorems, payloadSurface: { readOn: schemas.readOn, dimensions: schemas.dimensions, agreeing: schemas.agreeing, served: schemas.served, standards: schemas.standards.length, coordination: schemas.coordination.length, reread: schemas.reread, leads: schemas.leads }, online: process.env.QPU_OFFLINE !== '1', fromWave: plan.requests - missing.length, fetchedHere: process.env.QPU_OFFLINE !== '1' ? missing.length : 0, compliance: plan.compliance, ...v }, null, 1) + '\n')
  writeFileSync(join(ROOT, 'docs', 'textbook.md'), ['---', 'title: Textbook', 'order: 44', '---', '', '# The textbook, verified online', '', `Every example of the surface, categorised for reuse by the \`textbook\` tool, and its public sources fetched by this device on ${date}: ${v.requests} requests (${plan.requests - missing.length} already in the wave), the outcome sealed as \`${v.id}\`. ${plan.compliance}.`, '', `States: ${Object.entries(v.states).map(([k, n]) => `${k} ${n}`).join(', ')}.`, '', '| Example | Tool | Theorem | Requests | Reachable | Contract | State |', '|---|---|---|---:|---:|---:|---|', ...(v.verified as { id: string; tool: string; theorem: string | null; requests: number; reachable: number; contracted: number; state: string }[]).map((x) => `| ${x.id} | ${x.tool} | ${x.theorem ?? '—'} | ${x.requests} | ${x.reachable} | ${x.contracted} | ${x.state} |`), ''].join('\n'))
  console.log(`textbook: ${v.examples} examples, ${v.requests} requests (${plan.requests - missing.length} from the wave, ${missing.length} ${process.env.QPU_OFFLINE === '1' ? 'unfetched offline' : 'fetched here'}); ${Object.entries(v.states).map(([k, n]) => `${k} ${n}`).join(', ')}; sealed ${v.id}`)
}
main().catch((e) => { console.error(e); process.exit(1) })
