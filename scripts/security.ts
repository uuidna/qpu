// The client of the security audit: it measures what a client of the MCP sees on every host (the headers, CORS, the token a write needs, the
// surface audit over MCP) and what the developer sees in the tree (the dependency audits, the leak scan, the environment example, the access
// rules, the hooks the plugin adds, the signing flag, the theorem ledger), hands both to the audit tool, which merges them as one, and writes
// what it returns. Network; skipped by `next --offline`.
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import './teleport.ts'
import { handle } from '../src/quantum/mcp.ts'
import { LICENSE } from '../src/quantum/license.ts'

const ROOT = process.cwd()
const HOSTS = (process.env.QPU_E2E_HOSTS ?? 'https://qpu.uuidna.com,https://qpu.psg.bg,https://qpu.ceci.workers.dev').split(',').map((h) => h.trim()).filter(Boolean)
const call = (args: Record<string, unknown>): any => { const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'audit', arguments: args } }) as any; if (r.error) throw new Error(r.error.message); return r.result.structuredContent }
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
  const entropy = existsSync(join(ROOT, 'docs', 'public', 'entropy.json')) ? (JSON.parse(readFileSync(join(ROOT, 'docs', 'public', 'entropy.json'), 'utf8')) as { byKind: Record<string, { leads: number }> }) : null
  const env = existsSync(join(ROOT, 'site', '.env.qpu.example')) ? readFileSync(join(ROOT, 'site', '.env.qpu.example'), 'utf8') : ''
  const plugin = existsSync(join(ROOT, 'site', 'src', 'plugins', 'qpu.ts')) ? readFileSync(join(ROOT, 'site', 'src', 'plugins', 'qpu.ts'), 'utf8') : ''
  const wrangler = existsSync(join(ROOT, 'wrangler.jsonc')) ? readFileSync(join(ROOT, 'wrangler.jsonc'), 'utf8') : ''
  const access = (handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'configure', arguments: { kind: 'access' } } }) as { result: { structuredContent: { config: { entries?: { update?: string }; tenants?: { write?: string } } } } }).result.structuredContent.config
  const theorems = existsSync(join(ROOT, 'docs', 'public', 'theorems.ndjson')) ? readFileSync(join(ROOT, 'docs', 'public', 'theorems.ndjson'), 'utf8').split('\n').filter(Boolean).length : 0
  const developer = { vulnerabilities: { root: json('npm', ['audit', '--omit=dev', '--json'], ROOT), site: json('pnpm', ['audit', '--prod', '--json'], join(ROOT, 'site')) }, leaks: entropy?.byKind.leak?.leads ?? 0, envExampleValueless: !env.split('\n').some((l) => /^[A-Z_]+=\S/.test(l)), access, hooks: ['collisionGuard', 'firstUserBootstrap', 'appRequest'].filter((h) => plugin.includes(h)), signing: /webcrypto_modern_algorithms/.test(wrangler) ? 'ML-DSA under webcrypto_modern_algorithms (wrangler.jsonc)' : 'no signing flag', theorems }
  const result = call({ security: { client: { hosts, payloadMcp: { unauthenticated } }, developer } })
  const date = new Date().toISOString()
  writeFileSync(join(ROOT, 'docs', 'public', 'security.json'), JSON.stringify({ license: LICENSE.attribution, date, hosts: HOSTS, ...result }, null, 1) + '\n')
  const cell = (t: string) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\|/g, '\\|').replace(/\n/g, ' ')
  writeFileSync(join(ROOT, 'docs', 'security.md'), ['---', 'title: Security', 'order: 53', '---', '', '# Security audit, both perspectives as one', '', `Performed by \`npm run next\` on ${date} through the \`audit\` tool: what a client of the MCP measures on ${HOSTS.length} host(s) and what the developer measures in the tree, merged as one list (${result.perspectives.client} client, ${result.perspectives.developer} developer, ${result.perspectives.both} both): ${result.passed}/${result.total} pass; ${result.verdict}. Every finding is a lead with the remedy manual work taught.`, '', '| Check | Perspective | Pass | Evidence | Remedy |', '|---|---|---|---|---|', ...result.checks.map((c: { id: string; perspective: string; passed: boolean; evidence: string; remedy?: string }) => `| ${c.id} | ${c.perspective} | ${c.passed ? '✓' : '✗'} | ${cell(c.evidence)} | ${cell(c.remedy ?? '')} |`), ''].join('\n'))
  console.log(`security: ${result.passed}/${result.total} checks pass (${result.perspectives.client} client, ${result.perspectives.developer} developer, ${result.perspectives.both} both) over ${hosts.length} host(s); ${result.verdict}`)
}
main().catch((e) => { console.error(e); process.exit(1) })
