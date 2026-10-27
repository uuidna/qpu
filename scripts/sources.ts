// The client of leads { sources }, a step of every online next: the plan's first pages fetched, every next page the tool names followed until
// each source ends (unlimited), paced one request at a time per host, GET only, public metadata, a named user agent, no credential; the answers
// handed back and judged by the tool. Writes docs/public/sources.json and docs/sources.md. Offline: the plan alone.
import { writeFileSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import './teleport.ts'
import { handle, cellOf as cell } from '../src/quantum/mcp.ts'
import { LICENSE } from '../src/quantum/license.ts'
import { TENANTS } from '../src/quantum/tenants.ts'
import type { SourceRequest, SourceAnswer } from '../src/quantum/sources.ts'

const ROOT = process.cwd()
const offline = process.env.QPU_OFFLINE === '1' || process.argv.includes('--offline')
const call = (args: Record<string, unknown>): any => { const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'leads', arguments: { sources: args } } }) as any; if (r.error) throw new Error(r.error.message); return r.result.structuredContent }
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) as { name: string }
const repository = (() => { try { return execSync('git remote get-url origin', { encoding: 'utf8' }).trim() } catch { return 'https://github.com/uuidna/qpu.git' } })()
const context = { repository, owner: repository.replace(/\.git$/, '').split('/').slice(-2)[0]!, package: pkg.name, hosts: Object.keys(TENANTS) }
const main = async () => {
  const plan = call({ context }) as { requestList: SourceRequest[] }
  if (offline) { console.log(`sources: offline, ${plan.requestList.length} first pages planned`); return }
  const answers: SourceAnswer[] = []
  const byHost = new Map<string, SourceRequest[]>(); for (const r of plan.requestList) { const h = new URL(r.url).host; byHost.set(h, [...(byHost.get(h) ?? []), r]) }
  // one queue per host, the hosts in parallel; every answer may name its next page, which joins its host's queue
  await Promise.all([...byHost.values()].map(async (queue) => {
    while (queue.length) {
      const r = queue.shift()!
      let status = 0, text = ''
      try { const res = await fetch(r.url, { headers: { accept: r.accept, 'user-agent': 'uuidna-qpu-sources (+https://qpu.uuidna.com)' }, redirect: 'follow', signal: AbortSignal.timeout(30000) }); status = res.status; text = await res.text() } catch { status = 0 }
      const a = { id: r.id, url: r.url, status, text }; answers.push(a)
      const next = call({ context, next: { request: r, answer: a } }).next as SourceRequest | null
      if (next) queue.push(next)
    }
  }))
  const j = call({ context, answers })
  // the public artifacts verified against the digests their registries recorded: every one downloaded and hashed here, compared by the seal
  const listed = (j.immutable?.artifacts ?? []) as { source: string; name: string; url: string; algorithm: string; claimed: string; bytes: number | null }[]
  const hashed = []
  for (const a of listed) { try { const res = await fetch(a.url, { headers: { 'user-agent': 'uuidna-qpu-sources (+https://qpu.uuidna.com)' }, redirect: 'follow', signal: AbortSignal.timeout(120000) }); const buf = Buffer.from(await res.arrayBuffer()); const algo = a.algorithm === 'sha512' ? 'sha512' : a.algorithm === 'sha1' ? 'sha1' : a.algorithm === 'sha256' ? 'sha256' : 'md5'; const digest = createHash(algo).update(buf); hashed.push({ ...a, bytes: buf.length, status: res.status, computed: a.source === 'npm' ? digest.digest('base64') : digest.digest('hex') }) } catch { hashed.push({ ...a, status: 0, computed: null }) } }
  const integrity = (handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'seal', arguments: { text: 'artifacts', artifacts: hashed } } }) as any).result?.structuredContent
  console.log(`sources: integrity: ${integrity?.says}`)
  const date = new Date().toISOString()
  writeFileSync(join(ROOT, 'docs', 'public', 'sources.json'), JSON.stringify({ license: LICENSE.attribution, date, ...j, integrity }, null, 1) + '\n')
  const lines = ['---', 'title: Sources', 'order: 57', '---', '', '# The immutable sources of leads', '', `Read on ${date} by \`leads { sources }\`: ${cell(j.says)}.`, '', '## Licence candidates', '', 'Each is a candidate the court computed a case for. None is a verdict.', '', '| where | name | why | case |', '| --- | --- | --- | --- |', ...j.licence.map((x: { where: string; name: string; url: string; why: string; case: { case: string } }) => `| ${x.where} | [${cell(x.name)}](${x.url}) | ${cell(x.why)} | \`${x.case.case}\` |`), '', '## Precedence', '', '| record | date | neighbours | before | after |', '| --- | --- | --- | --- | --- |', ...j.precedence.map((p: { doi: string; date: string; works: number; before: number; after: number }) => `| ${p.doi} | ${p.date} | ${p.works} | ${p.before} | ${p.after} |`), '', '## Textbooks', '', `${j.textbooks.books} open books: ${j.textbooks.routed} reached by the theorems, ${j.textbooks.inDomain} of their domain are leads, ${j.textbooks.outside} outside.`, '', '| theorem | books |', '| --- | --- |', ...Object.entries(j.textbooks.byTheorem as Record<string, number>).sort((a, b) => b[1] - a[1]).map(([k, n]) => `| \`${k}\` | ${n} |`), '', '## Integrity of the public artifacts', '', `${cell(integrity?.says)}.`, '', '| artifact | algorithm | verdict |', '| --- | --- | --- |', ...((integrity?.rows ?? []) as { name: string; url: string; algorithm: string; verdict: string }[]).map((r) => `| [${cell(r.name)}](${r.url}) | ${r.algorithm} | ${r.verdict} |`), '', '## MCP doors', '', '| server | remote |', '| --- | --- |', ...j.mcp.doors.map((d: { name: string; remote: string | null }) => `| ${cell(d.name)} | ${cell(d.remote ?? '')} |`), '']
  writeFileSync(join(ROOT, 'docs', 'sources.md'), lines.join('\n'))
  console.log(`sources: ${j.says}`)
}
main().catch((e) => { console.error(e); process.exit(1) })
