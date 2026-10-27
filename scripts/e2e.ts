// The client of the e2e tool: asks for the requests (every dashboard cell and example on every host), fetches them in a
// pool within the quantum, hands the answers back and writes what the tool decodes: the page, the JSON, and the error
// blocks appended to the UUID stream. Selftest first. Hosts from QPU_E2E_HOSTS (comma separated), else the tool's default.
import { writeFileSync, appendFileSync } from 'node:fs'
import { join } from 'node:path'
import './teleport.ts'
import { handle, toolCallerOf } from '../src/quantum/mcp.ts'
import { selftestOf } from './mcp.ts'
import { LICENSE } from '../src/quantum/license.ts'
import type { E2eRequest, E2eAnswer } from '../src/quantum/e2e.ts'
import { valueOf } from '../src/quantum/e2e.ts'
import { mountThroughClaude } from './claude-mount.ts'
import { verifySignaturesAt } from './pqc-verify.ts'
import { compareStylesheets, compareToolLists, compareCoverage } from './compare.ts'

const ROOT = process.cwd()
const call = toolCallerOf('e2e')
const main = async () => {
  const selftest = selftestOf('e2e', call)
  const hosts = (process.env.QPU_E2E_HOSTS ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  const started = Date.now()
  const plan = call(hosts.length ? { hosts } : {})
  const QUANTUM_MS = Number(process.env.QPU_QUANTUM_MS ?? 120_000)
  const queue = [...(plan.requestList as E2eRequest[])]
  console.log(`e2e: ${plan.combos} combinations × ${plan.hosts.length} host(s) = ${plan.requests} requests (plan ${Date.now() - started} ms), quantum ${QUANTUM_MS / 1000} s`)
  const answers: E2eAnswer[] = []
  const one = async (r: E2eRequest) => {
    const t0 = Date.now()
    try { const res = await fetch(r.url, { method: 'POST', headers: { 'content-type': 'application/json', accept: r.accept, 'user-agent': 'uuidna-qpu-e2e (https://qpu.uuidna.com)', ...(r.headers ?? {}) }, body: JSON.stringify(r.body), signal: AbortSignal.timeout(20000) }); const body = await res.text(); const base = { ...r, status: res.status, ms: Date.now() - t0, etag: res.headers.get('etag'), address: res.headers.get('x-qpu-address'), version: res.headers.get('x-qpu-version') }; answers.push(res.status === 200 ? { ...base, text: '', decoded: valueOf({ status: 200, text: body }) } : { ...base, text: body }) /* a 200 is decoded on arrival and its body released; a 304 has no body and is checked against the tree's own copy */ }
    catch (e) { answers.push({ ...r, status: 0, ms: Date.now() - t0, text: `fetch failed: ${(e as Error).message}` }) }
  }
  // the online measurements (the Claude mount, the signatures, the stylesheet, the tools/list, the coverage) wait on the network: overlapped with the requests
  const off = process.env.QPU_OFFLINE === '1', asked = { phase: 'offline' as const, note: 'offline: not asked' }, measured_ = { phase: 'offline' as const, says: 'offline: not measured' }
  const measured = Promise.all([
    off ? asked : mountThroughClaude(), off ? asked : verifySignaturesAt(plan.hosts as string[]),
    off ? measured_ : compareStylesheets(), off ? measured_ : compareToolLists(),
    off ? measured_ : compareCoverage(),
  ])
  const inFlight = new Set<Promise<void>>()
  while ((queue.length && Date.now() - started < QUANTUM_MS) || inFlight.size) {
    while (queue.length && inFlight.size < 8 && Date.now() - started < QUANTUM_MS) { const p = one(queue.shift()!).finally(() => inFlight.delete(p)); inFlight.add(p) }
    if (inFlight.size) await Promise.race(inFlight)
  }
  const remaining = queue.length
  const r = call({ answers, hosts: plan.hosts })
  const [claudeMount, pqc, css, toolsList, coverage] = await measured
  for (const [what, says] of Object.entries({ 'mount through Claude': `${claudeMount.phase} — ${claudeMount.note}`, 'post-quantum signatures': pqc.note, stylesheet: css.says, 'tools/list': toolsList.says, coverage: coverage.says })) console.log(`e2e: ${what}: ${says}`)
  const date = new Date().toISOString()
  const { page, decoded, ...rest } = r
  writeFileSync(join(ROOT, 'docs', 'public', 'e2e.json'), JSON.stringify({ license: LICENSE.attribution, date, ms: Date.now() - started, partial: remaining > 0, remaining, selftest: { passed: selftest.passed }, claudeMount, pqc, css, toolsList, coverage, ...rest, decoded: decoded.map((d: { copies: unknown; errors: unknown; [k: string]: unknown }) => ({ ...d, copies: undefined, errors: undefined })) }, null, 1) + '\n')
  const pqcLine = 'hosts' in pqc ? `\n\n## Post-quantum signatures\n\nEvery host asked \`seal { text: 'qpu', sign: 'ML-DSA-65' }\`; the signature each answered is verified here with the public key it carries, no secret: ${pqc.note}.\n\n| Host | Phase | Key | Verified | Note |\n|---|---|---|---|---|\n${pqc.hosts.map((h) => `| ${h.host} | ${h.phase} | ${h.keyed ?? '—'} | ${h.verified === null ? '—' : h.verified ? 'yes' : 'no'} | ${h.note.replace(/\|/g, '\\|')} |`).join('\n')}\n` : ''
  writeFileSync(join(ROOT, 'docs', 'e2e.md'), page.replace(/\n\n$/, remaining ? `\n\n${remaining} request(s) wait for the next quantum.\n` : '\n').replace(/\n$/, pqcLine + '\n'))
  for (const e of r.errors) appendFileSync(join(ROOT, 'docs', 'public', 'e2e.ndjson'), JSON.stringify({ date, ...e }) + '\n')
  // the referer collects the coins: one ledger line per run credits the teleports to the blocks that asked; a teleport deposits nothing (the entanglement was paid when the block was computed)
  if (r.involutions) appendFileSync(join(ROOT, 'docs', 'public', 'coins.ndjson'), JSON.stringify({ date, client: 'e2e', door: 'teleport', deposit: 0, gate: null, receipt: null, clean: !r.errors.some((e: { got: string }) => String(e.got).startsWith('HTTP 304 unverified')), surface: null, teleports: r.involutions, materialised: r.materialised, referers: r.referers }) + '\n')
  console.log(`e2e: versions ${r.versions.join(', ') || 'unnamed'}; ${r.combos} combinations, ${r.copies} copies (${r.involutions} teleported by involution, ${r.materialised} materialised here, ${r.referers} referers collected) in ${((Date.now() - started) / 1000).toFixed(1)} s — ${JSON.stringify(r.outcomes)}; p=${r.physicalErrorRate.toFixed(4)}, logical ${r.logicalErrorRate.toFixed(4)}; ${r.errors.length} error block(s) streamed, ${r.leads.length} lead(s)${remaining ? `; ${remaining} remain for the next quantum` : ''}`)
  if (process.argv.includes('--strict') && r.outcomes.uncorrectable) process.exit(1)
}
main().catch((e) => { console.error(e); process.exit(1) })
