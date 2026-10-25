// The client of the metrics tool: it reads the run's artefacts and the docket's listing and writes the metrics as data and a
// page; the numbers are the tool's. Always runs; offline the docket is not asked.
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { handle } from '../src/quantum/mcp.ts'
import { LICENSE } from '../src/quantum/license.ts'
const ROOT = process.cwd()
const readJson = (f: string) => { const p = join(ROOT, 'docs', 'public', f); if (!existsSync(p)) return undefined; try { return JSON.parse(readFileSync(p, 'utf8')) } catch { return undefined } }
const main = async () => {
  const receipts = existsSync(join(ROOT, 'docs', 'public', 'receipts.ndjson')) ? readFileSync(join(ROOT, 'docs', 'public', 'receipts.ndjson'), 'utf8').split('\n').filter(Boolean) : []
  let docket: { entries?: number; root?: string | null; mirrors?: number } = {}
  if (process.env.QPU_OFFLINE !== '1') { try { const r = await fetch(`https://${process.env.QPU_HOST ?? 'qpu.uuidna.com'}/docket`, { signal: AbortSignal.timeout(20000) }); const j = await r.json() as { count?: number; root?: string | null }; docket = { entries: j.count ?? 0, root: j.root ?? null, mirrors: 0 } } catch { docket = {} } }
  const sizes: Record<string, number> = {}
  for (const f of ['discovery.json', 'verification.json', 'readiness.json', 'repository.json', 'legal.json', 'imagination.json', 'receipt.json', 'receipts.ndjson', 'theorems.ndjson', 'next-leads.json', 'purify-leads.json']) { const p = join(ROOT, 'docs', 'public', f); if (existsSync(p)) sizes[f] = readFileSync(p).length }
  for (const f of ['leads.md', 'mcp.md', 'examples.md', 'readiness.md', 'verification.md', 'discovery.md', 'legal.md', 'repository.md', 'theorems.md', 'imagination.md']) { const p = join(ROOT, 'docs', f); if (existsSync(p)) sizes[`docs/${f}`] = readFileSync(p).length }
  const artefacts = { receipt: readJson('receipt.json'), sizes, discovery: readJson('discovery.json'), verification: readJson('verification.json'), readiness: readJson('readiness.json'), repository: readJson('repository.json'), legal: readJson('legal.json'), docket, receipts: { count: receipts.length, last: receipts.length ? (JSON.parse(receipts.at(-1)!) as { id: string }).id : null } }
  const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'metrics', arguments: { artefacts } } }) as any
  if (r.error) throw new Error(r.error.message)
  const m = r.result.structuredContent as Record<string, unknown>
  writeFileSync(join(ROOT, 'docs', 'public', 'metrics.json'), JSON.stringify({ license: LICENSE.attribution, ...m }, null, 1) + '\n')
  const rows = Object.entries(m).filter(([k]) => !['selftests', 'license'].includes(k)).map(([k, v]) => `| ${k} | ${typeof v === 'object' && v !== null ? JSON.stringify(v).replace(/\|/g, '\\|') : String(v)} |`)
  writeFileSync(join(ROOT, 'docs', 'metrics.md'), ['---', 'title: Metrics', 'order: 58', '---', '', '# Computable metrics, in real time', '', `The \`metrics\` tool asked by \`npm run next\` with the run's artefacts: the tree's own counts (tools, toolboxes, examples and how many a kernel-accepted theorem backs, the kernel's theorems, leads, the audit, the balancer), and what the run measured (hosts and doors autodiscovered, verification on public datasets and APIs, the border, the repository, the legal audit, the docket's signalling, the receipt chain). Quality is proven by theorems, not textbook examples: the ratio is the measure.`, '', '| Metric | Value |', '|---|---|', ...rows, ''].join('\n'))
  console.log(`metrics: ${m.tools} tools, ${m.examplesBackedByTheorems}/${m.examples} examples backed by theorems, audit ${m.auditPassed}/${m.auditChecks}, discovered ${m.discoveredDoors} doors, verification ${m.verificationReachable}/${m.verificationRequests}, docket ${m.docketEntries} entries; verbosity ${m.verbosityTotalBytes} bytes, flow ${m.flowMs} ms, ${m.msPerSettledLead} ms and ${m.requestsPerSettledLead} requests per settled lead; computed calls ${m.toolMisses} of ${m.toolCalls} at ${m.msPerComputedCall} ms`)
}
main().catch((e) => { console.error(e); process.exit(1) })
