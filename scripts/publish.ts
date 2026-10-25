// Generated data leaves the working tree: every artefact of a run is posted to each configured docket (the Durable Object
// on this host, the unit's, any mirror), so a write lands on all and a read is served by any. Locally the files are build
// output only, ignored by git. Configure QPU_DOCKETS (comma-separated URLs ending in /docket) and QPU_WRITE_TOKEN.
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'
import { channelOf, uuidFromParts, uuidOf } from '../src/quantum/blocks.ts'

const ROOT = process.cwd()
// The tenant's docket and its writer token: from the environment, or from .dev.vars (the file wrangler keeps out of git) —
// the client holds the secret; the tree never does. Default: this tree's own tenant on the deployed Worker.
const vars: Record<string, string> = existsSync(join(ROOT, '.dev.vars')) ? Object.fromEntries(readFileSync(join(ROOT, '.dev.vars'), 'utf8').split('\n').filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)])) : {}
const from = process.env.QPU_HOST ?? 'qpu.uuidna.com'
const tenant = ({ 'qpu.uuidna.com': 'UUIDNA', 'qpu.psg.bg': 'PSG' } as Record<string, string>)[from]
const dockets = (process.env.QPU_DOCKETS ?? vars.QPU_DOCKETS ?? `https://${from}/docket`).split(',').map((s) => s.trim()).filter(Boolean)
const token = process.env.QPU_WRITE_TOKEN ?? (tenant ? vars[`QPU_WRITE_TOKEN_${tenant}`] : undefined) ?? vars.QPU_WRITE_TOKEN
const artefacts: [kind: string, file: string][] = [
  ['receipt', 'docs/public/receipt.json'], ['verification', 'docs/public/verification.json'], ['imagination', 'docs/public/imagination.json'],
  ['graph', 'docs/public/graph.json'], ['purify-leads', 'docs/public/purify-leads.json'], ['next-leads', 'docs/public/next-leads.json'], ['readiness', 'docs/public/readiness.json'],
]
const main = async () => {
  if (!dockets.length || !token) { console.log(`publish: no docket configured (QPU_DOCKETS, QPU_WRITE_TOKEN); ${artefacts.filter(([, f]) => existsSync(join(ROOT, f))).length} artefact(s) stay local build output`); return }
  const results: { kind: string; docket: string; status: number; id?: string }[] = []
  for (const [kind, file] of artefacts) {
    if (!existsSync(join(ROOT, file))) continue
    const body = JSON.parse(readFileSync(join(ROOT, file), 'utf8'))
    for (const docket of dockets) {
      try {
        const res = await fetch(docket, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` }, body: JSON.stringify({ kind, from, body }), signal: AbortSignal.timeout(30000) })
        const r = await res.json().catch(() => ({})) as { id?: string }
        results.push({ kind, docket, status: res.status, id: r.id })
      } catch (e) { results.push({ kind, docket, status: 0 }); console.error(`publish: ${kind} → ${docket}: ${(e as Error).message}`) }
    }
  }
  const byKind = new Map<string, Set<string>>()
  for (const r of results) if (r.id) (byKind.get(r.kind) ?? byKind.set(r.kind, new Set()).get(r.kind)!).add(r.id)
  const disagree = [...byKind.entries()].filter(([, ids]) => ids.size > 1).map(([k]) => k)
  if (disagree.length) { console.error(`publish: mirrors disagree on the content address of ${disagree.join(', ')}; a mirror is not storing what it was sent`); process.exitCode = 1 }
  // The commit's imprint: a commitment whose address carries the commit's handle and whose program and tail are the receipt's.
  const receiptFile = join(ROOT, 'docs/public/receipt.json')
  if (existsSync(receiptFile)) {
    const receipt = JSON.parse(readFileSync(receiptFile, 'utf8')) as { id?: string; sha256?: string; provisional?: boolean; steps?: unknown[] }
    const commit = execSync('git rev-parse HEAD', { cwd: ROOT, encoding: 'utf8' }).trim()
    // inside a run the receipt is provisional (no id yet: the run stamps it last); its address then is the content address of what it holds so far, said so
    const receiptId = receipt.id ?? uuidOf(JSON.stringify(receipt.steps ?? receipt))
    if (!receipt.id) console.log(`publish: the receipt is provisional (the run stamps it last); published under the address of its steps so far, ${receiptId}`)
    const ch = channelOf(receiptId)
    const address = uuidFromParts(commit.slice(0, 8), ch.program, ch.tail)
    for (const docket of dockets) {
      try {
        const res = await fetch(docket, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` }, body: JSON.stringify({ kind: 'imprint', from, address, sha256: (receipt.sha256 ?? 'provisional'), links: [receipt.id] }), signal: AbortSignal.timeout(30000) })
        const r = await res.json().catch(() => ({})) as { id?: string }
        results.push({ kind: `imprint:${commit.slice(0, 8)}`, docket, status: res.status, id: r.id })
      } catch (e) { results.push({ kind: `imprint:${commit.slice(0, 8)}`, docket, status: 0 }); console.error(`publish: imprint → ${docket}: ${(e as Error).message}`) }
    }
  }
  const landed = results.filter((r) => r.status === 201 || r.status === 200).length
  console.log(`publish: ${landed}/${results.length} writes landed across ${dockets.length} docket(s)`)
  for (const r of results) console.log(`  ${r.kind} → ${r.docket} ${r.status}${r.id ? ' ' + r.id : ''}`)
  if (landed < results.length) process.exitCode = 1
}
main().catch((e) => { console.error(e); process.exit(1) })
