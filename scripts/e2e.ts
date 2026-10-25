// The client of the e2e tool: asks for the requests (every dashboard cell and example on every host), fetches them in a
// pool within the quantum, hands the answers back and writes what the tool decodes: the page, the JSON, and the error
// blocks appended to the UUID stream. Selftest first. Hosts from QPU_E2E_HOSTS (comma separated), else the tool's default.
import { writeFileSync, mkdirSync, appendFileSync } from 'node:fs'
import { join } from 'node:path'
import './teleport.ts'
import { handle } from '../src/quantum/mcp.ts'
import { LICENSE } from '../src/quantum/license.ts'
import type { E2eRequest, E2eAnswer } from '../src/quantum/e2e.ts'

const ROOT = process.cwd()
const call = (args: Record<string, unknown>): any => { const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'e2e', arguments: args } }) as any; if (r.error) throw new Error(r.error.message); return r.result.structuredContent }
const main = async () => {
  const selftest = call({ selftest: true })
  console.log(`e2e selftest: ${selftest.passed ? 'pass' : 'FAIL'} (${selftest.checks.filter((c: { passed: boolean }) => c.passed).length}/${selftest.checks.length})`)
  const hosts = (process.env.QPU_E2E_HOSTS ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  const started = Date.now()
  const plan = call(hosts.length ? { hosts } : {})
  const QUANTUM_MS = Number(process.env.QPU_QUANTUM_MS ?? 120_000)
  const queue = [...(plan.requestList as E2eRequest[])]
  console.log(`e2e: ${plan.combos} combinations × ${plan.hosts.length} host(s) = ${plan.requests} requests (plan ${Date.now() - started} ms), quantum ${QUANTUM_MS / 1000} s`)
  const answers: E2eAnswer[] = []
  const one = async (r: E2eRequest) => {
    const t0 = Date.now()
    try { const res = await fetch(r.url, { method: 'POST', headers: { 'content-type': 'application/json', accept: r.accept, 'user-agent': 'uuidna-qpu-e2e (ceccec@psg.bg)', ...(r.headers ?? {}) }, body: JSON.stringify(r.body), signal: AbortSignal.timeout(20000) }); answers.push({ ...r, status: res.status, ms: Date.now() - t0, text: await res.text(), etag: res.headers.get('etag'), address: res.headers.get('x-qpu-address'), version: res.headers.get('x-qpu-version') }) }
    catch (e) { answers.push({ ...r, status: 0, ms: Date.now() - t0, text: `fetch failed: ${(e as Error).message}` }) }
  }
  const inFlight = new Set<Promise<void>>()
  while ((queue.length && Date.now() - started < QUANTUM_MS) || inFlight.size) {
    while (queue.length && inFlight.size < 8 && Date.now() - started < QUANTUM_MS) { const p = one(queue.shift()!).finally(() => inFlight.delete(p)); inFlight.add(p) }
    if (inFlight.size) await Promise.race(inFlight)
  }
  const remaining = queue.length
  const r = call({ answers, hosts: plan.hosts })
  const date = new Date().toISOString()
  mkdirSync(join(ROOT, 'docs', 'public'), { recursive: true })
  const { page, decoded, ...rest } = r
  writeFileSync(join(ROOT, 'docs', 'public', 'e2e.json'), JSON.stringify({ license: LICENSE.attribution, date, ms: Date.now() - started, partial: remaining > 0, remaining, selftest: { passed: selftest.passed }, ...rest, decoded: decoded.map((d: { copies: unknown; errors: unknown; [k: string]: unknown }) => ({ ...d, copies: undefined, errors: undefined })) }, null, 1) + '\n')
  writeFileSync(join(ROOT, 'docs', 'e2e.md'), page.replace(/\n\n$/, remaining ? `\n\n${remaining} request(s) wait for the next quantum.\n` : '\n'))
  for (const e of r.errors) appendFileSync(join(ROOT, 'docs', 'public', 'e2e.ndjson'), JSON.stringify({ date, ...e }) + '\n')
  // the referer collects the coins: one ledger line per run credits the teleports to the blocks that asked; a teleport deposits nothing (the entanglement was paid when the block was computed)
  if (r.involutions) appendFileSync(join(ROOT, 'docs', 'public', 'coins.ndjson'), JSON.stringify({ date, client: 'e2e', door: 'teleport', deposit: 0, gate: null, receipt: null, clean: !r.errors.some((e: { got: string }) => String(e.got).startsWith('HTTP 304 unverified')), surface: null, teleports: r.involutions, materialised: r.materialised, referers: r.referers }) + '\n')
  console.log(`e2e: versions ${r.versions.join(', ') || 'unnamed'}; ${r.combos} combinations, ${r.copies} copies (${r.involutions} teleported by involution, ${r.materialised} materialised here, ${r.referers} referers collected) in ${((Date.now() - started) / 1000).toFixed(1)} s — ${JSON.stringify(r.outcomes)}; p=${r.physicalErrorRate.toFixed(4)}, logical ${r.logicalErrorRate.toFixed(4)}; ${r.errors.length} error block(s) streamed, ${r.leads.length} lead(s)${remaining ? `; ${remaining} remain for the next quantum` : ''}`)
  if (process.argv.includes('--strict') && r.outcomes.uncorrectable) process.exit(1)
}
main().catch((e) => { console.error(e); process.exit(1) })
