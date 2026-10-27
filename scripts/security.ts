// The client of the security audit: it measures what a client of the MCP sees on every host (the headers, CORS, the token a write needs, the
// surface audit over MCP) and what the developer sees in the tree (the dependency audits, the leak scan, the environment example, the access
// rules, the hooks the plugin adds, the signing flag, the theorem ledger), hands both to the audit tool, which merges them as one, and writes
// what it returns. Network; skipped by `next --offline`.
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import './teleport.ts'
import { handle, toolCallerOf, cellOf as cell } from '../src/quantum/mcp.ts'
import { readJson, fetchWithTimeout, publishRecord, mcpClient } from './mcp.ts'

const ROOT = process.cwd()
const HOSTS = (process.env.QPU_E2E_HOSTS ?? 'https://qpu.uuidna.com,https://qpu.psg.bg,https://qpu.ceci.workers.dev').split(',').map((h) => h.trim()).filter(Boolean)
const call = toolCallerOf('audit')
const json = (cmd: string, args: string[], cwd: string): Record<string, number> => { try { const out = execFileSync(cmd, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 120_000 }); const j = JSON.parse(out) as { metadata?: { vulnerabilities?: Record<string, number> } }; return j.metadata?.vulnerabilities ?? {} } catch (e) { const out = (e as { stdout?: string }).stdout; try { const j = JSON.parse(out ?? '') as { metadata?: { vulnerabilities?: Record<string, number> } }; return j.metadata?.vulnerabilities ?? {} } catch { return { unmeasured: 1 } } } }
const main = async () => {
  const hosts = []
  for (const origin of HOSTS) {
    const host = new URL(origin).host
    try {
      const r = await fetch(origin + '/mcp', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'audit', arguments: {} } }), signal: AbortSignal.timeout(90_000) })
      const headers: Record<string, string> = {}; r.headers.forEach((v, k) => { headers[k] = v })
      const audit = ((await r.json()) as { result?: { structuredContent?: { total: number; failed: number } } }).result?.structuredContent
      const options = await fetch(origin + '/mcp', { method: 'OPTIONS', signal: AbortSignal.timeout(20_000) }).then((o) => o.status).catch(() => 0)
      const write = await fetch(origin + '/entries', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}', signal: AbortSignal.timeout(20_000) }).then((w) => w.status).catch(() => 0)
      hosts.push({ host, status: r.status, headers, optionsStatus: options, writeWithoutToken: write, ...(audit ? { audit: { total: audit.total, failed: audit.failed } } : {}) })
    } catch (e) { hosts.push({ host, status: 0, headers: {}, writeWithoutToken: 0 }); console.log(`security: ${host} unreachable: ${(e as Error).message}`) }
  }
  const payloadUrl = process.env.QPU_PAYLOAD_URL
  const unauthenticated = payloadUrl ? await fetch(payloadUrl.replace(/\/$/, '') + '/api/mcp', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }), signal: AbortSignal.timeout(20_000) }).then((r) => r.status).catch(() => 0) : null
  const entropy = (readJson(join(ROOT, 'docs', 'public', 'entropy.json')) as { byKind: Record<string, { leads: number }> } | null)
  const env = existsSync(join(ROOT, 'site', '.env.qpu.example')) ? readFileSync(join(ROOT, 'site', '.env.qpu.example'), 'utf8') : ''
  const plugin = existsSync(join(ROOT, 'site', 'src', 'plugins', 'qpu.ts')) ? readFileSync(join(ROOT, 'site', 'src', 'plugins', 'qpu.ts'), 'utf8') : ''
  const wrangler = existsSync(join(ROOT, 'wrangler.jsonc')) ? readFileSync(join(ROOT, 'wrangler.jsonc'), 'utf8') : ''
  const access = toolCallerOf('configure')({ kind: 'access' }).config as { entries?: { update?: string }; tenants?: { write?: string } }
  const theorems = existsSync(join(ROOT, 'docs', 'public', 'theorems.ndjson')) ? readFileSync(join(ROOT, 'docs', 'public', 'theorems.ndjson'), 'utf8').split('\n').filter(Boolean).length : 0
  const payloadConfig = existsSync(join(ROOT, 'site', 'src', 'payload.config.ts')) ? readFileSync(join(ROOT, 'site', 'src', 'payload.config.ts'), 'utf8') : ''
  const developer = { autoLogin: /autoLogin\s*:/.test(payloadConfig), vulnerabilities: { root: json('npm', ['audit', '--omit=dev', '--json'], ROOT), site: json('pnpm', ['audit', '--prod', '--json'], join(ROOT, 'site')) }, leaks: entropy?.byKind.leak?.leads ?? 0, envExampleValueless: !env.split('\n').some((l) => /^[A-Z_]+=\S/.test(l)), access, hooks: ['collisionGuard', 'firstUserBootstrap', 'appRequest'].filter((h) => plugin.includes(h)), signing: /webcrypto_modern_algorithms/.test(wrangler) ? 'ML-DSA under webcrypto_modern_algorithms (wrangler.jsonc)' : 'no signing flag', theorems }
  const result = call({ security: { client: { hosts, payloadMcp: { unauthenticated } }, developer } })
  // leaks found before they are published, and where already served: every published file and the live copies of the logs, through audit { leaks }
  const pub = join(ROOT, 'docs', 'public')
  const { readdirSync } = await import('node:fs')
  const published = Object.fromEntries(readdirSync(pub).filter((f) => /\.(json|ndjson|md|txt|xml|webmanifest|html)$/.test(f)).map((f) => [`docs/public/${f}`, readFileSync(join(pub, f), 'utf8')]))
  const live: Record<string, string> = {}
  for (const origin of HOSTS) for (const f of ['next-leads.json', 'receipts.ndjson', 'receipt.json', 'security.json']) { try { const r = await fetchWithTimeout(`${origin}/${f}`); if (r.ok) live[`${new URL(origin).host}/${f}`] = await r.text() } catch { /* unreached: measured next run */ } }
  // and every document Payload holds, read through its MCP as a client reads it: a page or an entry is served
  const app = mcpClient(), held: Record<string, string> = {}
  for (const find of ['findPages', 'findEntries']) for (const d of ((await app.findAll(find, { draft: true, depth: 0 })).docs ?? []) as { id: string }[]) held[`payload/${find.slice(4).toLowerCase()}/${d.id}`] = JSON.stringify(d)
  const leaks = call({ leaks: { texts: { ...published, ...live, ...held }, served: [...Object.keys(live), ...Object.keys(held)] } })
  console.log(`leaks: ${leaks.says}`)
  // the access audit from every perspective: the generated collections, hooks and scopes, every cell naming its licence clause and its legal fact
  const accessAudit = call({ access: true })
  const date = new Date().toISOString()
  publishRecord('security', { date, hosts: HOSTS, ...result, access: accessAudit, leaks: { ...leaks, findings: leaks.findings } })
  writeFileSync(join(ROOT, 'docs', 'security.md'), ['---', 'title: Security', 'order: 53', '---', '', '# Security audit, both perspectives as one', '', `Performed by \`npm run next\` on ${date} through the \`audit\` tool: what a client of the MCP measures on ${HOSTS.length} host(s) and what the developer measures in the tree, merged as one list (${result.perspectives.client} client, ${result.perspectives.developer} developer, ${result.perspectives.both} both): ${result.passed}/${result.total} pass; ${result.verdict}. Every finding is a lead with the remedy manual work taught.`, '', '| Check | Perspective | Pass | Evidence | Remedy |', '|---|---|---|---|---|', ...result.checks.map((c: { id: string; perspective: string; passed: boolean; evidence: string; remedy?: string }) => `| ${c.id} | ${c.perspective} | ${c.passed ? '✓' : '✗'} | ${cell(c.evidence)} | ${cell(c.remedy ?? '')} |`), '', '## Access from every perspective', '', `The access audit through \`audit { access: true }\`: ${accessAudit.perspectives.join(', ')} over ${accessAudit.collections.join(', ')}; ${accessAudit.combinationsSay}; ${accessAudit.passed}/${accessAudit.total} pass; ${accessAudit.verdict}. Every cell names its hook, its cost, its licence clause and its legal fact, so security and privacy are never apart from the licence and the legal terms.`, '', '| Check | Perspective | Pass | Evidence | Hook | Cost | Licence | Legal |', '|---|---|---|---|---|---|---|---|', ...accessAudit.checks.map((c: { id: string; perspective: string; passed: boolean; evidence: string; hook: string; cost: string; licence: string; legal: string }) => `| ${c.id} | ${c.perspective} | ${c.passed ? '✓' : '✗'} | ${cell(c.evidence)} | ${cell(c.hook)} | ${cell(c.cost)} | ${cell(c.licence)} | ${cell(c.legal)} |`), ''].join('\n'))
  console.log(`access: ${accessAudit.passed}/${accessAudit.total} checks pass from ${accessAudit.perspectives.length} perspectives (${accessAudit.combinations} role–operation combinations); ${accessAudit.verdict}`)
  console.log(`security: ${result.passed}/${result.total} checks pass (${result.perspectives.client} client, ${result.perspectives.developer} developer, ${result.perspectives.both} both) over ${hosts.length} host(s); ${result.verdict}`)
}
main().catch((e) => { console.error(e); process.exit(1) })
