// The git hooks as clients of one MCP workflow: this script asks the repository tool for the workflow the hook names
// (pre-commit, pre-push, post-commit, prepare-commit-msg) and walks its steps — a command run, an MCP call (local through the
// handler, remote by URL with the user agent the step names), an imprint appended beside the receipt, the trailers written on
// the commit message — exactly as the door answers them, nothing decided here. A strict step that fails ends the hook red.
import { readFileSync, writeFileSync, appendFileSync, mkdirSync } from 'node:fs'
import { spawnSync, execSync } from 'node:child_process'
import { handle } from '../src/quantum/mcp.ts'

type Step = { id: string; kind: 'run' | 'mcp' | 'imprint' | 'trailers' | 'stage'; strict?: boolean; cmd?: string; args?: string[]; tool?: string; arguments?: Record<string, unknown>; url?: string; files?: string[]; says: string }
const name = process.argv[2] ?? ''
const extra = process.argv.slice(3)
const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'repository', arguments: { workflow: name, offline: process.env.QPU_OFFLINE === '1' } } }) as { result?: { structuredContent?: { workflow?: { name: string; steps: Step[]; strict: boolean } } }; error?: { message: string } }
if (r.error || !r.result?.structuredContent?.workflow) { console.error(`hook ${name}: ${r.error?.message ?? 'no such workflow'}`); process.exit(name === 'pre-push' ? 1 : 0) }
const w = r.result.structuredContent.workflow
const read = (f: string): unknown => { try { return JSON.parse(readFileSync(f, 'utf8')) } catch { return null } }
let red = false
for (const s of w.steps) {
  if (red && s.strict) break
  if (s.kind === 'run') { const p = spawnSync(s.cmd!, s.args ?? [], { stdio: 'inherit' }); if (p.status !== 0) { console.error(`hook ${name}: step ${s.id} red`); if (s.strict) red = true } continue }
  if (s.kind === 'stage') { spawnSync('git', ['add', '-u', '--', ...(s.files ?? [])], { stdio: 'ignore' }); continue }
  if (s.kind === 'imprint') {
    const head = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(); const receipt = read('docs/public/receipt.json') as { id?: string; sha256?: string } | null
    mkdirSync('docs/public', { recursive: true }); appendFileSync('docs/public/imprints.ndjson', JSON.stringify({ commit: head, receipt: receipt?.id ?? null, sha256: receipt?.sha256 ?? null, date: new Date().toISOString() }) + '\n')
    console.log(`imprint: commit ${head.slice(0, 8)} ↔ receipt ${receipt?.id ?? 'none'}`); continue
  }
  if (s.kind === 'trailers') {
    const path = extra[0]; const src = extra[1]; if (!path || src === 'merge' || src === 'squash') continue
    const rc = read('docs/public/receipt.json') as { id?: string; sha256?: string; steps?: { name: string; status: string }[] } | null, p = read('docs/public/purify-leads.json'), n = read('docs/public/next-leads.json'), rd = read('docs/public/readiness.json') as { readiness: { ready: boolean; receipt: string }; date: string } | null
    const steps = rc?.steps ? rc.steps.filter((x) => x.status !== 'skipped').map((x) => `${x.name}=${x.status}`).join(' ') : 'none'
    const trailers = [`Receipt: ${rc?.id ?? 'none'}`, `Receipt-SHA256: ${rc?.sha256 ?? 'none'}`, `Next: ${steps}`, `Purity-leads: ${Array.isArray(p) ? p.length : 'unmeasured'}`, `Next-leads: ${Array.isArray(n) ? n.length : 'unmeasured'}`, `Readiness: ${rd ? `${rd.readiness.ready ? 'ready' : 'not ready'} (${rd.readiness.receipt}, ${rd.date.slice(0, 10)})` : 'unmeasured here (network step)'}`, 'License: CC-BY-NC-ND-4.0 (c) Tsvetan Rouschev']
    const msg = readFileSync(path, 'utf8'); if (msg.includes('\nReceipt: ')) continue
    const body = msg.replace(/\s+$/, '')
    const sign = w.steps.find((x) => x.kind === 'mcp' && x.id === 'sign')
    let signature = 'unsigned (no signing step)'
    if (sign) {
      if (process.env.QPU_OFFLINE === '1' || !sign.url) signature = 'unsigned (offline)'
      else {
        const message = `${body}\n\n${trailers.slice(0, 2).join('\n')}\nBacked by theorem ${(sign.arguments?.theorems as string[])[0]} and theorem ${(sign.arguments?.theorems as string[])[1]}.`
        try {
          const res = await fetch(process.env.UUIDNA_MCP ?? sign.url, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json', 'user-agent': 'uuidna-qpu-hook (https://qpu.uuidna.com)' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: sign.tool, arguments: { ...sign.arguments, message } } }), signal: AbortSignal.timeout(20000) })
          if (!res.ok) signature = `unsigned (the hosted door answered HTTP ${res.status}; lead gap-sign-door-hosted)`
          else { const j = await res.json() as { result?: { structuredContent?: { signed?: boolean; verdict?: string; address?: string; fold?: string; cited?: string[]; reason?: string }; content?: { text: string }[] }; error?: { message: string } }; const out = j.result?.structuredContent ?? (j.result?.content?.[0] ? JSON.parse(j.result.content[0].text) : null); signature = !out ? `unsigned (${j.error?.message ?? 'no answer'})` : out.signed ? `${out.verdict} address ${out.address} fold ${out.fold} (uuidna.com sign_commit, cites ${(out.cited ?? []).join(', ')})` : `refused: ${out.reason}` }
        } catch (e) { signature = `unsigned (${(e as Error).message.slice(0, 60)})` }
      }
    }
    trailers.push(`Signed-by-unit: ${signature}`); writeFileSync(path, `${body}\n\n${trailers.join('\n')}\n`); continue
  }
  if (s.kind === 'mcp' && s.id !== 'sign') { const rr = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: s.tool!, arguments: s.arguments ?? {} } }) as { error?: { message: string } }; if (rr.error) { console.error(`hook ${name}: ${s.id}: ${rr.error.message}`); if (s.strict) red = true } }
}
process.exit(red && w.strict ? 1 : 0)
