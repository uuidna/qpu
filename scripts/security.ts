// The client of the security audit: it measures what a client of the MCP sees on every host (the headers, CORS, the token a write needs, the
// surface audit over MCP) and what the developer sees in the tree (the dependency audits, the leak scan, the environment example, the access
// rules, the hooks the plugin adds, the signing flag, the theorem ledger), hands both to the audit tool, which merges them as one, and writes
// what it returns. Network; skipped by `next --offline`.
import { execFile } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { promisify } from 'node:util'
import './teleport.ts'
import { handle, toolCallerOf, cellOf as cell } from '../src/quantum/processing/mcp.ts'
import { getJson, getWithTimeout, publishRecord, mcpClient } from './mcp.ts'
import { listLeaks } from '../src/quantum/processing/audit.ts'

const ROOT = process.cwd()
const HOSTS = (process.env.QPU_E2E_HOSTS ?? 'https://qpu.uuidna.com,https://qpu.psg.bg,https://qpu.ceci.workers.dev').split(',').map((h) => h.trim()).filter(Boolean)
const call = toolCallerOf('audit')
const pexec = promisify(execFile)
// a dependency audit as JSON; async so the two (root, site) run concurrently. npm/pnpm audit
// exit non-zero when they find vulnerabilities, so the count is read from the error's stdout too; a large report needs a bigger maxBuffer than the 1 MB default.
const json = async (cmd: string, args: string[], cwd: string): Promise<Record<string, number>> => { try { const { stdout } = await pexec(cmd, args, { cwd, encoding: 'utf8', timeout: 120_000, maxBuffer: 1 << 26 }); const j = JSON.parse(stdout) as { metadata?: { vulnerabilities?: Record<string, number> } }; return j.metadata?.vulnerabilities ?? {} } catch (e) { const out = (e as { stdout?: string }).stdout; try { const j = JSON.parse(out ?? '') as { metadata?: { vulnerabilities?: Record<string, number> } }; return j.metadata?.vulnerabilities ?? {} } catch { return { unmeasured: 1 } } } }
const main = async () => {
  // the three heavy, independent phases start together and run concurrently — the dependency audits, the docket read, and the host probe — so the step's
  // wall time is the slowest one, not their sum.
  const APP = [process.env.QPU_APP_DIR, '.qpu-app'].find((d) => d && existsSync(join(ROOT, d, 'package.json'))) ?? null
  const vulnP = Promise.all([json('npm', ['audit', '--omit=dev', '--json'], ROOT), APP ? json('pnpm', ['audit', '--prod', '--json'], join(ROOT, APP)) : Promise.resolve({})])
  const app = mcpClient()
  const heldP = (async () => { const held: Record<string, string> = {}; let read = 0; for (const find of ['findPages', 'findEntries']) await app.findEach(find, { draft: true, depth: 0 }, (d) => { const k = `payload/${find.slice(4).toLowerCase()}/${(d as { id: string }).id}`, t = JSON.stringify(d); read++; if (!listLeaks({ [k]: t }).clean) held[k] = t }); console.log(`docket: ${read} read, ${Object.keys(held).length} held for a finding`); return held })()
  // every host probed at once, not one after another: the step's wall time is the slowest single host, not their sum
  const hosts = await Promise.all(HOSTS.map(async (origin) => {
    const host = new URL(origin).host
    try {
      const r = await fetch(origin + '/mcp', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'audit', arguments: {} } }), signal: AbortSignal.timeout(90_000) })
      const headers: Record<string, string> = {}; r.headers.forEach((v, k) => { headers[k] = v })
      const audit = ((await r.json()) as { result?: { structuredContent?: { total: number; failed: number } } }).result?.structuredContent
      const [options, write] = await Promise.all([
        fetch(origin + '/mcp', { method: 'OPTIONS', signal: AbortSignal.timeout(20_000) }).then((o) => o.status).catch(() => 0),
        fetch(origin + '/entries', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}', signal: AbortSignal.timeout(20_000) }).then((w) => w.status).catch(() => 0),
      ])
      return { host, status: r.status, headers, optionsStatus: options, writeWithoutToken: write, ...(audit ? { audit: { total: audit.total, failed: audit.failed } } : {}) }
    } catch (e) { console.log(`security: ${host} unreachable: ${(e as Error).message}`); return { host, status: 0, headers: {} as Record<string, string>, writeWithoutToken: 0 } }
  }))
  const payloadUrl = process.env.QPU_PAYLOAD_URL
  const unauthenticated = payloadUrl ? await fetch(payloadUrl.replace(/\/$/, '') + '/api/mcp', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }), signal: AbortSignal.timeout(20_000) }).then((r) => r.status).catch(() => 0) : null
  const entropy = (getJson(join(ROOT, 'docs', 'public', 'entropy.json')) as { byKind: Record<string, { leads: number }> } | null)
  const env = existsSync(join(ROOT, '.qpu-app', '.env.qpu.example')) ? readFileSync(join(ROOT, '.qpu-app', '.env.qpu.example'), 'utf8') : ''
  const plugin = existsSync(join(ROOT, '.qpu-app', 'src', 'plugins', 'qpu.ts')) ? readFileSync(join(ROOT, '.qpu-app', 'src', 'plugins', 'qpu.ts'), 'utf8') : ''
  const wrangler = existsSync(join(ROOT, 'wrangler.jsonc')) ? readFileSync(join(ROOT, 'wrangler.jsonc'), 'utf8') : ''
  const access = toolCallerOf('configure')({ kind: 'access' }).config as { entries?: { update?: string }; tenants?: { write?: string } }
  const theorems = existsSync(join(ROOT, 'docs', 'public', 'theorems.ndjson')) ? readFileSync(join(ROOT, 'docs', 'public', 'theorems.ndjson'), 'utf8').split('\n').filter(Boolean).length : 0
  const payloadConfig = existsSync(join(ROOT, '.qpu-app', 'src', 'payload.config.ts')) ? readFileSync(join(ROOT, '.qpu-app', 'src', 'payload.config.ts'), 'utf8') : ''
  const [vulnRoot, vulnSite] = await vulnP
  const developer = { autoLogin: /autoLogin\s*:/.test(payloadConfig), vulnerabilities: { root: vulnRoot, site: vulnSite }, leaks: entropy?.byKind.leak?.leads ?? 0, envExampleValueless: !env.split('\n').some((l) => /^[A-Z_]+=\S/.test(l)), access, hooks: ['collisionGuard', 'firstUserBootstrap', 'appRequest'].filter((h) => plugin.includes(h)), signing: /webcrypto_modern_algorithms/.test(wrangler) ? 'ML-DSA under webcrypto_modern_algorithms (wrangler.jsonc)' : 'no signing flag', theorems }
  const result = call({ security: { client: { hosts, payloadMcp: { unauthenticated } }, developer } })
  // leaks found before they are published, and where already served: every published file and the live copies of the logs, through audit { leaks }
  const pub = join(ROOT, 'docs', 'public')
  const { readdirSync } = await import('node:fs')
  const published = Object.fromEntries(readdirSync(pub).filter((f) => /\.(json|ndjson|md|txt|xml|webmanifest|html)$/.test(f)).map((f) => [`docs/public/${f}`, readFileSync(join(pub, f), 'utf8')]))
  const live: Record<string, string> = {}
  // every live file on every host fetched at once, not nested serial loops
  await Promise.all(HOSTS.flatMap((origin) => ['next-leads.json', 'receipts.ndjson', 'receipt.json', 'security.json'].map(async (f) => { try { const r = await getWithTimeout(`${origin}/${f}`); if (r.ok) live[`${new URL(origin).host}/${f}`] = await r.text() } catch { /* unreached: measured next run */ } })))
  // and every document Payload holds, read through its MCP as a client reads it: a page or an entry is served
  const held = await heldP // the docket read started concurrently at the top; awaited here, just before it is scanned
  const leaks = listLeaks({ ...published, ...live, ...held }, [...Object.keys(live), ...Object.keys(held)]) // the pure scanner: no tool call copying the texts
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
