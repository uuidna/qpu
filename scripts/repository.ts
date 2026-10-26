// The client of the repository tool: git facts in, GitHub and Zenodo answers in, the watch and its leads out. Selftest first.
// Offline (QPU_OFFLINE=1) the local facts alone are written. Its leads join the next-leads docket, deduplicated by id.
import { existsSync, readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'
import './teleport.ts'
import { toolCallerOf } from '../src/quantum/mcp.ts'
import { LICENSE } from '../src/quantum/license.ts'

const ROOT = process.cwd()
const call = toolCallerOf('repository')
const git = (...args: string[]) => { try { return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim() } catch { return '' } }
const main = async () => {
  const selftest = call({ selftest: true })
  console.log(`repository selftest: ${selftest.passed ? 'pass' : 'FAIL'} (${selftest.checks.filter((c: { passed: boolean }) => c.passed).length}/${selftest.checks.length})`)
  const zen = existsSync(join(ROOT, '.zenodo.json')) ? JSON.parse(readFileSync(join(ROOT, '.zenodo.json'), 'utf8')) as { related_identifiers?: { identifier: string; relation: string }[] } : {}
  const conceptDoi = zen.related_identifiers?.find((r) => r.relation === 'isVersionOf' || r.relation === 'isPartOf')?.identifier ?? (process.env.QPU_CONCEPT_DOI ?? '10.5281/zenodo.22700098')
  const local = {
    pkg: (JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) as { name?: string }).name ?? null, workflows: (() => { try { return readdirSync(join(ROOT, '.github', 'workflows')).filter((f) => /\.ya?ml$/.test(f)) } catch { return [] } })(),
    remote: git('remote', 'get-url', 'origin') || null, head: git('rev-parse', 'HEAD'), branch: git('rev-parse', '--abbrev-ref', 'HEAD'), version: (JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) as { version: string }).version,
    worktrees: git('worktree', 'list', '--porcelain').split('\n\n').filter(Boolean).map((block) => { const f = Object.fromEntries(block.split('\n').map((l) => [l.split(' ')[0]!, l.slice(l.indexOf(' ') + 1)])); return { path: f.worktree ?? '', head: f.HEAD ?? '', branch: f.branch ? f.branch.replace('refs/heads/', '') : null } }),
    branches: git('for-each-ref', '--format=%(refname:short) %(upstream:short) %(objectname:short)', 'refs/heads').split('\n').filter(Boolean).map((l) => { const [name, a, b] = l.split(' '); return b ? { name: name!, upstream: a!, head: b } : { name: name!, upstream: null, head: a! } }),
    tags: git('for-each-ref', '--format=%(refname:short) %(objectname:short)', 'refs/tags').split('\n').filter(Boolean).map((l) => { const [name, commit] = l.split(' '); return { name: name!, commit: commit! } }),
    conceptDoi,
  }
  const discoveryPath = join(ROOT, 'docs', 'public', 'discovery.json')
  const contracts: Record<string, string[]> = {}
  if (existsSync(discoveryPath)) { try { for (const h of (JSON.parse(readFileSync(discoveryPath, 'utf8')) as { hosts: { host: string; paths?: string[] }[] }).hosts) if (h.paths?.length) contracts[h.host] = h.paths } catch { /* unknown contracts */ } }
  const offline = process.env.QPU_OFFLINE === '1'
  // the tenant's token for GitHub's MCP (QPU_MCP_TOKEN_API_GITHUBCOPILOT_COM, from the environment or .dev.vars): with it the watch goes through the doors; without it, the REST contract, said so
  const vars: Record<string, string> = existsSync(join(ROOT, '.dev.vars')) ? Object.fromEntries(readFileSync(join(ROOT, '.dev.vars'), 'utf8').split('\n').filter((l) => /^[A-Z_0-9]+=/.test(l)).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).replace(/^"|"$/g, '')])) : {}
  const githubToken = process.env.QPU_MCP_TOKEN_API_GITHUBCOPILOT_COM ?? vars.QPU_MCP_TOKEN_API_GITHUBCOPILOT_COM
  const via = githubToken ? 'mcp' : 'rest'
  console.log(`repository: watching through ${via === 'mcp' ? 'GitHub\'s MCP doors (the tenant\'s token)' : 'the REST contract (no QPU_MCP_TOKEN_API_GITHUBCOPILOT_COM: GitHub\'s MCP stays a lead)'}`)
  const plan = call({ local, contracts, via })
  const answers: unknown[] = []
  if (!offline) for (const r of plan.requestList as { id: string; url: string; purpose: string; contracted: string }[]) {
    try { const mcp = (r as { via?: string }).via === 'mcp'; const res = await fetch(r.url, { method: mcp ? 'POST' : 'GET', headers: { accept: mcp ? 'application/json, text/event-stream' : 'application/vnd.github+json, application/json', 'user-agent': 'uuidna-qpu-next (https://qpu.uuidna.com)', ...(mcp ? { 'content-type': 'application/json', authorization: `Bearer ${githubToken}` } : {}) }, body: mcp ? JSON.stringify((r as { body?: unknown }).body) : undefined, signal: AbortSignal.timeout(30000) }); answers.push({ ...r, status: res.status, text: await res.text() }) }
    catch (e) { answers.push({ ...r, status: 0, text: `fetch failed: ${(e as Error).message}` }) }
  }
  const w = call({ local, contracts, answers })
  const date = new Date().toISOString()
  writeFileSync(join(ROOT, 'docs', 'public', 'repository.json'), JSON.stringify({ license: LICENSE.attribution, date, online: !offline, selftest: { passed: selftest.passed }, ...w.watch }, null, 1) + '\n')
  writeFileSync(join(ROOT, 'docs', 'repository.md'), w.page)
  // the watch's leads join the docket next keeps, by id
  const docket = join(ROOT, 'docs', 'public', 'next-leads.json')
  const previous = existsSync(docket) ? JSON.parse(readFileSync(docket, 'utf8')) as { id: string }[] : []
  const fresh = (w.watch.leads as { id: string }[]).filter((l) => !previous.some((p) => p.id === l.id)).map((l) => ({ ...l, source: 'repository watch', evidence: w.watch.remote ?? 'git', head: local.head.slice(0, 8), date }))
  if (fresh.length) writeFileSync(docket, JSON.stringify([...previous, ...fresh], null, 1) + '\n')
  console.log(`repository: ${w.branches} branches, ${w.tags} tags, releases ${w.releases < 0 ? 'not reached' : w.releases}, ${w.leads} lead(s)${fresh.length ? ` (${fresh.length} new in the docket)` : ''}, ${w.refusals} refusal(s)${offline ? ' (offline: local facts only)' : ''}`)
}
main().catch((e) => { console.error(e); process.exit(1) })
