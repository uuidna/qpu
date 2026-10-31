// `npm run audit`: the MCP surface audits itself and exits non-zero on any failed check.
// Split by the shard theorems, on request (QPU_AUDIT_SHARDS): each worker process replays the examples whose index mod n is its own (`--shard i/n`), the checks
// made once for the whole surface running in share 0; the parent merges the shares and holds them to the theorems — every example audited
// in exactly one share (textbook_shards_cover, textbook_shards_disjoint) — before it prints, so a split never hides or doubles an example.
import { readFileSync, readdirSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir, availableParallelism } from 'node:os'
import { createHash } from 'node:crypto'
import { spawn } from 'node:child_process'
import './teleport.ts'

type Check = { id: string; passed: boolean; evidence: string }
type Result = { shard: { i: number; n: number }; total: number; passed: number; failed: number; tools: number; examples: number; leads: number; checks: Check[]; integers: Record<string, string>; decided: { bySeal: number; byInteger: number; byText: number; sealed: boolean } }
const auditCall = async (args: Record<string, unknown>): Promise<Result> => {
  const { handle } = await import('../src/quantum/mcp.ts')
  const reply = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'audit', arguments: args } }) as { result?: { structuredContent: Result }; error?: unknown }
  if (!reply.result) { console.error(reply.error); process.exit(2) }
  return reply.result.structuredContent
}

// a worker: one share, its input (the ledger and the code's fingerprint) read from the parent's file, its answer written to the parent's file
const at = process.argv.indexOf('--shard')
if (at > 0) {
  const [i, n] = process.argv[at + 1]!.split('/').map(Number) as [number, number]
  const input = JSON.parse(readFileSync(process.argv[process.argv.indexOf('--input') + 1]!, 'utf8')) as { known: Record<string, string>; code: string }
  writeFileSync(process.argv[process.argv.indexOf('--output') + 1]!, JSON.stringify(await auditCall({ known: input.known, code: input.code, shard: { i, n } })))
  process.exit(0)
}

// the parent: the ledger read once (the newest docket entry from audit-integers, through the Payload MCP; unread, nothing is known and every
// example is confirmed by text), the code fingerprinted once, the shares run in parallel, merged, held to the theorems, the ledger written back
const { mcpClient } = await import('./mcp.ts')
const mcp = mcpClient()
const page = await mcp.call('findEntries', { where: JSON.stringify({ from: { equals: 'audit-integers' } }), sort: '-createdAt', limit: 1, page: 1 })
const read = page.error !== undefined ? { docs: null, says: `unread: ${page.error}` } : { docs: mcp.docsOf(page.text), says: 'read' }
const newest = (read.docs ?? [])[0] as { body?: { integers?: Record<string, string> } } | undefined
const known: Record<string, string> = newest?.body?.integers ?? {}
const t0 = performance.now()
const files = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((f) => (f.isDirectory() ? (f.name === '.lake' || f.name === 'node_modules' ? [] : files(join(dir, f.name))) : /\.(ts|lean)$/.test(f.name) ? [join(dir, f.name)] : []))
const code = createHash('sha256').update([...files('src/quantum')].sort().map((f) => `${f}\n${readFileSync(f, 'utf8')}`).join('\n')).digest('hex')

// the number of shares: QPU_AUDIT_SHARDS (a number, or 'cores' for one per core); one by default, since measured on 10 cores the split is
// slower (cold 8.6 s against 7.4 s, warm 1.06 s against 0.37 s): one example, readiness-plan, takes 9.4 s cold of the 12 s every example
// costs, no share can end before it, and each worker loads the core again (lead audit-critical-path-readiness)
const asked = process.env.QPU_AUDIT_SHARDS
const n = Math.max(1, (asked === 'cores' ? availableParallelism() : Number(asked ?? 1)) || 1)
let shares: Result[]
if (n === 1) shares = [await auditCall({ known, code })]
else {
  const dir = mkdtempSync(join(tmpdir(), 'qpu-audit-'))
  const input = join(dir, 'input.json'); writeFileSync(input, JSON.stringify({ known, code }))
  const run = (i: number) => new Promise<Result>((resolve, reject) => {
    const output = join(dir, `share-${i}.json`)
    const p = spawn(process.execPath, ['scripts/audit.ts', '--shard', `${i}/${n}`, '--input', input, '--output', output], { stdio: ['ignore', 'ignore', 'inherit'] })
    p.on('exit', (status) => { try { status === 0 ? resolve(JSON.parse(readFileSync(output, 'utf8')) as Result) : reject(new Error(`share ${i}/${n} ended with status ${status}`)) } catch (e) { reject(e) } })
  })
  try { shares = await Promise.all(Array.from({ length: n }, (_, i) => run(i))) } finally { rmSync(dir, { recursive: true, force: true }) }
}

// the merge, held to the shard theorems: every example audited in exactly one share, none missing, none twice
const checks = shares.flatMap((s) => s.checks)
const seen = new Map<string, number>(); for (const c of checks) if (c.id.startsWith('example-tool:')) seen.set(c.id, (seen.get(c.id) ?? 0) + 1)
const twice = [...seen].filter(([, k]) => k > 1).map(([id]) => id.slice('example-tool:'.length))
const head = shares.find((s) => s.shard.i === 0) ?? shares[0]!
if (twice.length || seen.size !== head.examples) {
  const { EXAMPLES } = await import('../src/quantum/examples.ts')
  const missing = EXAMPLES.map((e) => e.id).filter((id) => !seen.has(`example-tool:${id}`))
  console.error(`the shares broke the shard theorems: ${missing.length ? `not covered: ${missing.join(', ')}` : ''}${twice.length ? ` audited twice: ${twice.join(', ')}` : ''}`)
  process.exit(3)
}
const a = { total: checks.length, passed: checks.filter((c) => c.passed).length, failed: checks.filter((c) => !c.passed).length, tools: head.tools, examples: head.examples, leads: head.leads, integers: Object.assign({}, ...shares.map((s) => s.integers)) as Record<string, string>, decided: shares.reduce((d, s) => ({ bySeal: d.bySeal + (s.decided.bySeal ?? 0), byInteger: d.byInteger + s.decided.byInteger, byText: d.byText + s.decided.byText }), { bySeal: 0, byInteger: 0, byText: 0 }) }
const ms = Math.round(performance.now() - t0)
for (const c of checks) console.log(`${c.passed ? '✓' : '✗'} ${c.id} — ${c.evidence}`)
const wrote = read.docs ? await mcp.call('createEntries', { kind: 'document', from: 'audit-integers', body: { integers: a.integers } }) : { error: read.says }
console.log(`examples sealed under the code ${a.decided.bySeal}, decided by integers ${a.decided.byInteger}, confirmed by text ${a.decided.byText}; ${ms} ms in ${n} share(s), every example audited once; ledger ${read.docs ? `read (${Object.keys(known).length} known)` : read.says}, ${wrote.error === undefined ? 'written to the docket' : `not written: ${wrote.error.slice(0, 120)}`}`)
console.log(`\n${a.passed}/${a.total} checks pass over ${a.tools} tools, ${a.examples} examples, ${a.leads} leads`)
process.exit(a.failed === 0 ? 0 : 1)
