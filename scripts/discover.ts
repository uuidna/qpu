// The client of the discover tool: thin and host-agnostic. It asks the tool what to fetch, fetches it, hands the answers
// back until the tool says "discovery", and writes what the tool returns. It runs the toolbox's selftest first; a failed
// check is recorded, never a stop. Network; skipped by `next --offline`.
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { handle } from '../src/quantum/mcp.ts'
import { LICENSE } from '../src/quantum/license.ts'
import type { Request, Answer } from '../src/quantum/discovery.ts'

const ROOT = process.cwd()
const UA = 'uuidna-qpu-discover (ceccec@psg.bg)'
const call = (args: Record<string, unknown>): any => { const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'discover', arguments: args } }) as any; if (r.error) throw new Error(r.error.message); return r.result.structuredContent }
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const fetchOne = async (r: Request): Promise<Answer> => {
  try { const res = await fetch(r.url, { method: r.method, headers: { accept: 'application/json, application/yaml, text/xml, */*', 'user-agent': UA, ...(r.body ? { 'content-type': 'application/json' } : {}) }, body: r.body ? JSON.stringify(r.body) : undefined, redirect: 'follow', signal: AbortSignal.timeout(30000) }); return { ...r, status: res.status, type: res.headers.get('content-type') ?? '', text: await res.text() } }
  catch (e) { return { ...r, status: 0, type: '', text: `fetch failed: ${(e as Error).message}` } }
}
const main = async () => {
  const selftest = call({ selftest: true })
  console.log(`discover selftest: ${selftest.passed ? 'pass' : 'FAIL'} (${selftest.checks.filter((c: { passed: boolean }) => c.passed).length}/${selftest.checks.length})`)
  const answers: Answer[] = []
  let phase = call({ mcpHosts: [process.env.UUIDNA_MCP ?? 'https://uuidna.com/mcp', process.env.QPU_MCP ?? 'https://qpu.uuidna.com/mcp'] })
  while (phase.phase !== 'discovery') {
    for (const r of phase.requestList as Request[]) { answers.push(await fetchOne(r)); await sleep(r.purpose === 'contract' ? 150 : 300) }
    phase = call({ answers })
  }
  const date = new Date().toISOString()
  mkdirSync(join(ROOT, 'docs', 'public'), { recursive: true })
  writeFileSync(join(ROOT, 'docs', 'public', 'discovery.json'), JSON.stringify({ license: LICENSE.attribution, date, selftest: { passed: selftest.passed, checks: selftest.checks }, ...phase.discovery }, null, 1) + '\n')
  writeFileSync(join(ROOT, 'docs', 'discovery.md'), phase.page)
  console.log(`discover: ${phase.hosts} hosts, ${phase.doors} doors, statement→verdict ${phase.statementVerdict}, leads ${phase.leads}; ${answers.length} requests answered`)
}
main().catch((e) => { console.error(e); process.exit(1) })
