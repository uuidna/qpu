// The client of the textbook wave: the examples' verification requests, served from the wave the flow already fetched
// (verification.json) and, for any request the wave did not carry, fetched here by this device over its network — GET only,
// free public sources, a named user agent, no credential, a timeout — then joined back and sealed. Offline: the plan alone.
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { handle } from '../src/quantum/mcp.ts'
import { LICENSE } from '../src/quantum/license.ts'
const ROOT = process.cwd()
const call = (args: Record<string, unknown>): any => { const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'textbook', arguments: args } }) as any; if (r.error) throw new Error(r.error.message); return r.result.structuredContent }
const main = async () => {
  const plan = call({ verify: true })
  const vpath = join(ROOT, 'docs', 'public', 'verification.json')
  const fetched: { url: string; status: number; ok: boolean; contracted?: string }[] = existsSync(vpath) ? ((JSON.parse(readFileSync(vpath, 'utf8')) as { results?: { url: string; status: number; ok: boolean; contracted?: string }[] }).results ?? []) : []
  const have = new Set(fetched.map((r) => r.url))
  const missing = (plan.requestList as { url: string }[]).filter((r) => !have.has(r.url))
  if (process.env.QPU_OFFLINE !== '1') for (const r of missing) { try { const res = await fetch(r.url, { headers: { accept: '*/*', 'user-agent': 'uuidna-qpu-textbook (ceccec@psg.bg)' }, redirect: 'follow', signal: AbortSignal.timeout(20000) }); fetched.push({ url: r.url, status: res.status, ok: res.ok }) } catch { fetched.push({ url: r.url, status: 0, ok: false }) } await new Promise((t) => setTimeout(t, 250)) }
  const v = call({ results: fetched })
  const date = new Date().toISOString()
  writeFileSync(join(ROOT, 'docs', 'public', 'textbook.json'), JSON.stringify({ license: LICENSE.attribution, date, online: process.env.QPU_OFFLINE !== '1', fromWave: plan.requests - missing.length, fetchedHere: process.env.QPU_OFFLINE !== '1' ? missing.length : 0, compliance: plan.compliance, ...v }, null, 1) + '\n')
  writeFileSync(join(ROOT, 'docs', 'textbook.md'), ['---', 'title: Textbook', 'order: 44', '---', '', '# The textbook, verified online', '', `Every example of the surface, categorised for reuse by the \`textbook\` tool, and its public sources fetched by this device on ${date}: ${v.requests} requests (${plan.requests - missing.length} already in the wave), the outcome sealed as \`${v.id}\`. ${plan.compliance}.`, '', `States: ${Object.entries(v.states).map(([k, n]) => `${k} ${n}`).join(', ')}.`, '', '| Example | Tool | Theorem | Requests | Reachable | Contract | State |', '|---|---|---|---:|---:|---:|---|', ...(v.verified as { id: string; tool: string; theorem: string | null; requests: number; reachable: number; contracted: number; state: string }[]).map((x) => `| ${x.id} | ${x.tool} | ${x.theorem ?? '—'} | ${x.requests} | ${x.reachable} | ${x.contracted} | ${x.state} |`), ''].join('\n'))
  console.log(`textbook: ${v.examples} examples, ${v.requests} requests (${plan.requests - missing.length} from the wave, ${missing.length} ${process.env.QPU_OFFLINE === '1' ? 'unfetched offline' : 'fetched here'}); ${Object.entries(v.states).map(([k, n]) => `${k} ${n}`).join(', ')}; sealed ${v.id}`)
}
main().catch((e) => { console.error(e); process.exit(1) })
