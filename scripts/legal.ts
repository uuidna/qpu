// The client of the legal tool: it reads the tree's texts, the discovery and the theorem ledger, asks the tool for its plan,
// makes every call against its host (free agents by default; QPU_AUDIT_AGENTS, the operator's own list, overrides), hands
// the answers back and writes what the tool returns. Selftest first. Network; skipped by `next --offline`.
import { existsSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs'
import { join } from 'node:path'
import './teleport.ts'
import { handle } from '../src/quantum/mcp.ts'
import { depositOf } from '../src/quantum/coins.ts'
import { LICENSE } from '../src/quantum/license.ts'

const ROOT = process.cwd()
// the coins paid at the wire, one line per call, kept by this payer (the unit's own register is per process and silent)
const account = (door: string, body: unknown) => { const d = depositOf(door, body); appendFileSync(join(ROOT, 'docs', 'public', 'coins.ndjson'), JSON.stringify({ date: new Date().toISOString(), client: 'legal', ...d }) + '\n') }
const call = (args: Record<string, unknown>): any => { const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'legal', arguments: args } }) as any; if (r.error) throw new Error(r.error.message); return r.result.structuredContent }
const text = (f: string) => (existsSync(join(ROOT, f)) ? readFileSync(join(ROOT, f), 'utf8') : undefined)
const readJson = (f: string) => { const t = text(f); return t ? JSON.parse(t) : undefined }
const rpc = async (url: string, name: string, args: unknown): Promise<unknown> => {
  const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json', 'user-agent': 'uuidna-qpu-legal (ceccec@psg.bg)' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }), signal: AbortSignal.timeout(60000) })
  if (res.status !== 200) throw new Error(`HTTP ${res.status}`)
  const body = await res.json() as { result?: { structuredContent?: unknown; content?: { text: string }[]; isError?: boolean }; error?: { message: string } }
  account(name, body)
  if (body.error) throw new Error(body.error.message)
  if (body.result?.isError) throw new Error(body.result.content?.[0]?.text ?? 'the door refused without a text')
  return body.result?.structuredContent ?? (body.result?.content?.[0] ? JSON.parse(body.result.content[0].text) : body.result)
}
const main = async () => {
  const selftest = call({ selftest: true })
  console.log(`legal selftest: ${selftest.passed ? 'pass' : 'FAIL'} (${selftest.checks.filter((c: { passed: boolean }) => c.passed).length}/${selftest.checks.length})`)
  const texts = { readme: text('README.md'), citation: text('CITATION.cff'), zenodo: text('.zenodo.json'), package: text('package.json'), worker: text('src/worker.ts'), billing: text('src/quantum/toolboxes/billing.ts'), hmac: text('src/quantum/hmac.ts'), mcp: text('src/quantum/mcp.ts') }
  const discovery = readJson('docs/public/discovery.json')
  const ledger = text('docs/public/theorems.ndjson')?.split('\n').filter(Boolean).map((l) => (JSON.parse(l) as { key: string }).key).filter((k) => !k.startsWith('_private.') && !/\.(eq_\d+|match_\d+|_proof(?:_\d+)+|_simp(?:_\d+)+)$/.test(k)) ?? []
  const agents = process.env.QPU_AUDIT_AGENTS ? process.env.QPU_AUDIT_AGENTS.split(',').map((s) => s.trim()).filter(Boolean) : undefined
  const offline = process.env.QPU_OFFLINE === '1'
  const inputs = (await import('../src/quantum/blocks.ts')).uuidOf(JSON.stringify({ texts, discovery: discovery ? discovery.date : null, ledger, agents, offline }))
  const outPath = join(ROOT, 'docs', 'public', 'legal.json')
  if (existsSync(outPath)) {
    try {
      const prev = JSON.parse(readFileSync(outPath, 'utf8')) as { inputs?: string; id?: string; online?: boolean; answers?: unknown[]; agents?: string[] }
      if (prev.inputs === inputs && (prev.online || offline)) {
        // the seal: the stored answers recomputed through the same pure tool must give the same address; if not, the file or the code was changed, and that is the lead
        const again = call({ texts, discovery, agents: prev.agents?.length && agents ? agents : undefined, theoremKeys: ledger, answers: prev.answers ?? [] })
        if (again.id === prev.id) { console.log(`legal: inputs unchanged (${inputs}); sealed audit ${prev.id} recomputes to itself`); return }
        console.log(`legal: sealed audit ${prev.id} recomputes to ${again.id}: the stored answers or the tool changed; re-auditing and recording the break`)
        const leadsPath = join(ROOT, 'docs', 'public', 'next-leads.json'); const leads = existsSync(leadsPath) ? JSON.parse(readFileSync(leadsPath, 'utf8')) as unknown[] : []
        leads.push({ id: `legal-seal-broken-${prev.id?.slice(0, 8)}`, source: 'docs/public/legal.json', statement: `the sealed legal audit ${prev.id} recomputed to ${again.id} from its own stored answers`, status: 'open', reason: 'a sealed result that does not recompute to itself was altered after sealing, or the tool that seals it changed; both are measured here', evidence: `${prev.id} ≠ ${again.id}`, head: '', date: new Date().toISOString() })
        writeFileSync(leadsPath, JSON.stringify(leads, null, 1) + '\n')
      }
    } catch { /* re-audit */ }
  }
  const plan = call({ texts, discovery, agents, theoremKeys: ledger })
  const hostUrl = (host: string) => (discovery?.hosts as { host: string; kind: string; contract: string }[] | undefined)?.find((h) => h.host === host && h.kind === 'mcp')?.contract ?? 'https://uuidna.com/mcp'
  const answers: unknown[] = []
  const calls = offline ? [] : (plan.plan.calls as { door: string; host: string; arguments: Record<string, unknown> }[])
  // minimum time: four calls in flight; cheapest price: free doors only, each asked once, nothing retried blindly
  const queue = [...calls]; const inFlight = new Set<Promise<void>>()
  const one = async (c: typeof calls[number]) => { try { answers.push({ ...c, answer: await rpc(hostUrl(c.host), c.door, c.arguments) }) } catch (e) { answers.push({ ...c, refusal: (e as Error).message }) } }
  while (queue.length || inFlight.size) { while (queue.length && inFlight.size < 4) { const p = one(queue.shift()!).finally(() => inFlight.delete(p)); inFlight.add(p) } if (inFlight.size) await Promise.race(inFlight) }
  const audit = call({ texts, discovery, agents, theoremKeys: ledger, answers })
  const date = new Date().toISOString()
  writeFileSync(outPath, JSON.stringify({ license: LICENSE.attribution, date, inputs, online: !offline, id: audit.id, sha256: audit.sha256, inputHashes: audit.inputs, selftest: { passed: selftest.passed }, by: audit.by, agents: plan.plan.agents, calls: calls.length, ...audit.audit, answers }, null, 1) + '\n')
  writeFileSync(join(ROOT, 'docs', 'legal.md'), audit.page)
  console.log(`legal: ${audit.claims} claims, ${calls.length} calls${offline ? ' (offline: the pure half)' : ''}, violations ${audit.violations}, refusals ${audit.refusals}, drift ${audit.drift}, security ${audit.securityPassed}/${audit.securityTotal} (${audit.by}); audit ${audit.id}`)
}
main().catch((e) => { console.error(e); process.exit(1) })
