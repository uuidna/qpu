// The client of the metrics tool: it reads the run's artefacts and the docket's listing and writes the metrics as data and a
// page; the numbers are the tool's. Always runs; offline the docket is not asked.
import { existsSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs'
import { join } from 'node:path'
import './teleport.ts'
import { handle } from '../src/quantum/mcp.ts'
import { LICENSE } from '../src/quantum/license.ts'
import { accountOf, depositOf } from '../src/quantum/coins.ts'
const ROOT = process.cwd()
const readJson = (f: string) => { const p = join(ROOT, 'docs', 'public', f); if (!existsSync(p)) return undefined; try { return JSON.parse(readFileSync(p, 'utf8')) } catch { return undefined } }
const main = async () => {
  const receipts = existsSync(join(ROOT, 'docs', 'public', 'receipts.ndjson')) ? readFileSync(join(ROOT, 'docs', 'public', 'receipts.ndjson'), 'utf8').split('\n').filter(Boolean) : []
  let docket: { entries?: number; root?: string | null; mirrors?: number } = {}
  if (process.env.QPU_OFFLINE !== '1') { try { const r = await fetch(`https://${process.env.QPU_HOST ?? 'qpu.uuidna.com'}/docket`, { signal: AbortSignal.timeout(20000) }); const j = await r.json() as { count?: number; root?: string | null }; docket = { entries: j.count ?? 0, root: j.root ?? null, mirrors: 0 } } catch { docket = {} } }
  const sizes: Record<string, number> = {}
  for (const f of ['e2e.json', 'discovery.json', 'verification.json', 'readiness.json', 'repository.json', 'legal.json', 'imagination.json', 'receipt.json', 'receipts.ndjson', 'theorems.ndjson', 'next-leads.json', 'purify-leads.json']) { const p = join(ROOT, 'docs', 'public', f); if (existsSync(p)) sizes[f] = readFileSync(p).length }
  for (const f of ['leads.md', 'mcp.md', 'examples.md', 'readiness.md', 'verification.md', 'discovery.md', 'legal.md', 'repository.md', 'theorems.md', 'imagination.md']) { const p = join(ROOT, 'docs', f); if (existsSync(p)) sizes[`docs/${f}`] = readFileSync(p).length }
  const coinsPath = join(ROOT, 'docs', 'public', 'coins.ndjson'); const coinLines = existsSync(coinsPath) ? readFileSync(coinsPath, 'utf8').split('\n').filter(Boolean).flatMap((l) => { try { return [JSON.parse(l)] } catch { return [] } }) : []
  // the advantage billed by the unit, involuted from the piece the edge holds (the whole get_quantum_advantage door does not fit the edge):
  // bill_call with this run's own counts — the copies a classical rerun would compute against the copies proven by hash — the coin accounted
  let advantageByUnit: unknown = null
  const e2eNow = readJson('e2e.json') as { copies?: number; involutions?: number } | null
  if (process.env.QPU_OFFLINE !== '1' && e2eNow?.copies) {
    try {
      const res = await fetch(process.env.UUIDNA_MCP ?? 'https://uuidna.com/mcp', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', 'user-agent': 'uuidna-qpu-metrics (https://qpu.uuidna.com)' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'bill_call', arguments: { commercial: false, recomputeOps: e2eNow.copies, verifyOps: e2eNow.involutions ?? 0 } } }), signal: AbortSignal.timeout(20000) })
      const text = await res.text(); const data = /^(event|data):/m.test(text) ? (text.split('\n').filter((l) => l.startsWith('data:')).map((l) => l.slice(5).trim()).find((l) => l.startsWith('{')) ?? text) : text
      const j = JSON.parse(data) as { result?: { structuredContent?: unknown; content?: { text: string }[] } }
      const body = j.result?.structuredContent ?? (j.result?.content?.[0] ? JSON.parse(j.result.content[0].text) : null)
      advantageByUnit = body ? { ...(body as object), asked: { recomputeOps: e2eNow.copies, verifyOps: e2eNow.involutions ?? 0 }, door: 'bill_call' } : { error: `HTTP ${res.status}` }
      const d = depositOf('bill_call', body); appendFileSync(join(ROOT, 'docs', 'public', 'coins.ndjson'), JSON.stringify({ date: new Date().toISOString(), client: 'metrics', ...d }) + '\n')
    } catch (e) { advantageByUnit = { error: (e as Error).message } }
  }
  const artefacts = { advantageByUnit, e2e: e2eNow, coins: accountOf(coinLines), receipt: readJson('receipt.json'), sizes, discovery: readJson('discovery.json'), verification: readJson('verification.json'), readiness: readJson('readiness.json'), repository: readJson('repository.json'), legal: readJson('legal.json'), docket, receipts: { count: receipts.length, last: receipts.length ? (JSON.parse(receipts.at(-1)!) as { id: string }).id : null } }
  const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'metrics', arguments: { artefacts } } }) as any
  if (r.error) throw new Error(r.error.message)
  const m = r.result.structuredContent as Record<string, unknown>
  writeFileSync(join(ROOT, 'docs', 'public', 'metrics.json'), JSON.stringify({ license: LICENSE.attribution, ...m }, null, 1) + '\n')
  const rows = Object.entries(m).filter(([k]) => !['selftests', 'license'].includes(k)).map(([k, v]) => `| ${k} | ${typeof v === 'object' && v !== null ? JSON.stringify(v).replace(/\|/g, '\\|') : String(v)} |`)
  writeFileSync(join(ROOT, 'docs', 'metrics.md'), ['---', 'title: Metrics', 'order: 58', '---', '', '# Computable metrics, in real time', '', `The \`metrics\` tool asked by \`npm run next\` with the run's artefacts: the tree's own counts (tools, toolboxes, examples and how many a kernel-accepted theorem backs, the kernel's theorems, leads, the audit, the balancer), and what the run measured (hosts and doors autodiscovered, verification on public datasets and APIs, the border, the repository, the legal audit, the docket's signalling, the receipt chain). Quality is proven by theorems, not textbook examples: the ratio is the measure.`, '', '| Metric | Value |', '|---|---|', ...rows, ''].join('\n'))
  console.log(`metrics: coins paid ${m.coinsPaid} over ${m.coinCalls} gated calls; ${m.tools} tools, ${m.examplesBackedByTheorems}/${m.examples} examples backed by theorems, audit ${m.auditPassed}/${m.auditChecks}, discovered ${m.discoveredDoors} doors, verification ${m.verificationReachable}/${m.verificationRequests}, docket ${m.docketEntries} entries; verbosity ${m.verbosityTotalBytes} bytes, flow ${m.flowMs} ms, ${m.msPerSettledLead} ms and ${m.requestsPerSettledLead} requests per settled lead; computed calls ${m.toolMisses} of ${m.toolCalls} at ${m.msPerComputedCall} ms`)
}
main().catch((e) => { console.error(e); process.exit(1) })
