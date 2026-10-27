// The git hooks as clients of one MCP workflow: this script asks the repository tool for the workflow the hook names
// (pre-commit, pre-push, post-commit, prepare-commit-msg) and walks its steps — a command run, an MCP call (local through the
// handler, remote by URL with the user agent the step names), an imprint appended beside the receipt, the trailers written on
// the commit message — exactly as the door answers them, nothing decided here. A strict step that fails ends the hook red.
import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync, statSync, readdirSync, openSync } from 'node:fs'
import { join } from 'node:path'
import { spawnSync, execSync, spawn } from 'node:child_process'
import { handle } from '../src/quantum/mcp.ts'
import { GENERATED_FILES, RUN_FILES } from '../src/quantum/toolboxes/repository.ts'
import { LITERAL_ROOTS, manualDocsOf } from '../src/quantum/audit.ts'
import { GAP_KINDS, gapKindOf } from '../src/quantum/toolboxes/billing.ts'
import { createHash } from 'node:crypto'
import { penalise, clear, correctionOf, recordPrevented, openPenaltiesOf } from './penalties.ts'
import { mcpOf } from './mcp.ts'

type Step = { id: string; kind: 'run' | 'mcp' | 'raid' | 'imprint' | 'trailers' | 'stage'; strict?: boolean; detach?: boolean; cmd?: string; args?: string[]; tool?: string; arguments?: Record<string, unknown>; url?: string; files?: string[]; says: string }
const name = process.argv[2] ?? ''
const git = (a: string[]) => spawnSync('git', a, { encoding: 'utf8', maxBuffer: 1 << 30 }).stdout?.trim() ?? ''
const extra = process.argv.slice(3)
const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'repository', arguments: { workflow: name, offline: process.env.QPU_OFFLINE === '1' } } }) as { result?: { structuredContent?: { workflow?: { name: string; steps: Step[]; strict: boolean } } }; error?: { message: string } }
if (r.error || !r.result?.structuredContent?.workflow) { console.error(`hook ${name}: ${r.error?.message ?? 'no such workflow'}`); process.exit(name === 'pre-push' ? 1 : 0) }
const w = r.result.structuredContent.workflow
const read = (f: string): unknown => { try { return JSON.parse(readFileSync(f, 'utf8')) } catch { return null } }
let red = false
// the open penalties first, before any step: their count, the tokens and coins they book, and each one's rule and subject
const standing = await openPenaltiesOf()
if (!standing.open) console.error(`hook ${name}: penalties unread (${standing.read})`)
else { const shown = standing.open.filter((b) => (b as { printed?: boolean }).printed !== false && b.kind !== 'invisible'); /* an invisible action's penalty is recorded silently, never printed (textbook_penalty_visibility_harmonic) */ console.error(`hook ${name}: ${shown.length} open penalt${shown.length === 1 ? 'y' : 'ies'}, ${standing.tokens} token(s), ${standing.coins} coin(s)`); for (const b of shown) console.error(`  ${(b as { kind?: string }).kind ?? 'refusal'}${(b as { blocks?: boolean }).blocks === false ? ' (listed)' : ''} ${b.rule}: ${b.snapshot?.key}`) }
let automated: { drifted: string[]; bytes: number; files: { path: string; expected: string; actual: string }[] } | null = null
// a raid step: the docket read through the Payload MCP tool the step names, every page (the URL overridden by QPU_APP_MCP, the user's MCP key
// in QPU_APP_KEY, never written anywhere); without a key or an answer the docket is unread and the rules over it say unknown
let docket: unknown[] | null = null
const raidOf = (s: Step) => mcpOf(process.env.QPU_APP_MCP ?? s.url).findAll(s.tool!, s.arguments ?? {})
for (const s of w.steps) {
  if (red && s.strict) break
  // a detached step runs in the background with its own output file, never holding the hook
  if (s.kind === 'run' && s.detach) { const log = join('.qpu', `${s.id}.log`); mkdirSync('.qpu', { recursive: true }); const fd = openSync(log, 'w'); spawn(s.cmd!, s.args ?? [], { detached: true, stdio: ['ignore', fd, fd] }).unref(); console.log(`hook ${name}: ${s.id} started in the background (${log})`); continue }
  if (s.kind === 'run') { const p = spawnSync(s.cmd!, s.args ?? [], { stdio: 'inherit' }); if (p.status !== 0) { console.error(`hook ${name}: step ${s.id} red`); if (s.strict) red = true } continue }
  if (s.kind === 'raid') { const got = await raidOf(s); docket = got.docs; console.log(`hook ${name}: ${s.id}: ${got.says}`); continue }
  if (s.kind === 'stage') {
    // before anything is staged: every generated file whose staged content differs from what its generator just wrote (the step above regenerated them)
    const drifted = GENERATED_FILES.filter((p) => existsSync(p) && spawnSync('git', ['diff', '--quiet', '--', p]).status === 1)
    const sha = (b: Buffer | string) => createHash('sha256').update(b).digest('hex')
    automated = { drifted, bytes: drifted.length ? Buffer.byteLength(execSync(`git diff -- ${drifted.map((p) => JSON.stringify(p)).join(' ')}`, { encoding: 'utf8' })) : 0, files: drifted.map((p) => ({ path: p, expected: sha(readFileSync(p)), actual: sha(execSync(`git show :${JSON.stringify(p)}`)) })) }
    spawnSync('git', ['add', '-u', '--', ...(s.files ?? [])], { stdio: 'ignore' }); continue
  }
  if (s.kind === 'imprint') {
    const head = git(['rev-parse', 'HEAD']); const receipt = read('docs/public/receipt.json') as { id?: string; sha256?: string } | null
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
// the involution of thinking: a hand edit of a generated file whose correction the docket already learned (a cleared pre-commit:automated) is
// corrected before the decision — its antimatter (regenerate, restage: reversible, generated files only) applied and recorded as prevented — so
// the same thought is corrected, never refused again
if (name === 'pre-commit' && automated && automated.drifted.length && standing.learned?.includes('pre-commit:automated')) {
  const c = correctionOf({ rule: 'pre-commit:automated', bytes: automated.bytes, committer: git(['config', 'user.name']) || null, evidence: { key: `pre-commit:automated::${automated.drifted.join(',')}`, workflow: name, violated: ['automated'], drifted: automated.drifted } }, standing.learned)
  if (c && c.antimatter.needs === 'auto') {
    for (const m of c.antimatter.run) spawnSync(m.cmd, m.args, { stdio: 'inherit' })
    const left = GENERATED_FILES.filter((p) => existsSync(p) && spawnSync('git', ['diff', '--quiet', '--', p]).status === 1)
    // the prevention is recorded only when the correction made the rule hold again; otherwise the rule decides and refuses as before
    console.error(`hook ${name}: ${left.length ? `the learned correction left ${left.length} drifted: the rule decides` : `corrected by the learned antimatter, no penalty: ${c.says}; ${await recordPrevented(c.body)}`}`)
    automated = { ...automated, drifted: left }
  }
}
// pre-commit: the staged diff of the hand-written roots, read once: the core reads literals, folded and proven from it (a file declaring its generator excluded)
const stagedFact = name === 'pre-commit' ? (() => { const diff = git(['diff', '--cached', '-U0', '--no-color', '--', ...LITERAL_ROOTS]); return { diff, generated: [...diff.matchAll(/^\+\+\+ b\/(.+)$/gm)].map((m) => m[1]!).filter((f) => { try { return /^\/\/ generated by |(automatically|generated) by payload|generated by configure \{/im.test(readFileSync(f, 'utf8').slice(0, 800)) } catch { return true } }) } })() : undefined
// pre-commit: a new docs page that no generator writes is manual work, refused by the rule automated (a page already in the tree is listed by purify)
const manualFact = name === 'pre-commit' ? (() => {
  const addedPages = git(['diff', '--cached', '--name-only', '--diff-filter=A', '--', 'docs']).split('\n').filter((f) => f.endsWith('.md'))
  if (!addedPages.length) return []
  const scripts = Object.fromEntries(git(['ls-files', 'scripts']).split('\n').filter((f) => /\.(ts|mjs)$/.test(f)).map((f) => [f, readFileSync(f, 'utf8')]))
  return manualDocsOf(addedPages.map((path) => ({ path, bytes: existsSync(path) ? statSync(path).size : 0 })), scripts).rows.filter((r) => r.manual).map((r) => r.path)
})() : []
// the rules of the workflow decided by their theorems over the facts this client read after its steps: the receipt it wrote, the approval the configs step recorded, the gate's decoding; a violation is refused and its case named
// pre-deploy: the OpenNext bundle measured here, the deploy configuration handed over as its text, the docket as the Payload MCP answered it;
// the core folds them into the facts (the bindings, the account, its observability, its usage): this client names no provider and no resource
const newest = (dir: string): number => { let t = 0; const walk = (d: string) => { for (const f of readdirSync(d, { withFileTypes: true })) { const p = join(d, f.name); if (f.isDirectory()) { if (f.name !== 'node_modules' && !f.name.startsWith('.')) walk(p) } else t = Math.max(t, statSync(p).mtimeMs) } }; if (existsSync(dir)) walk(dir); return t }
const deployFacts = name === 'pre-deploy' ? (() => {
  const worker = 'site/.open-next/worker.js', assets = 'site/.open-next/assets'
  return { openNext: { worker: existsSync(worker), assets: existsSync(assets), builtAt: existsSync(worker) ? statSync(worker).mtimeMs : 0, sourcesAt: newest('site/src') }, config: existsSync('site/wrangler.jsonc') ? readFileSync('site/wrangler.jsonc', 'utf8') : null, docket }
})() : {}
// pre-push: the newest full run of the commit being pushed, from the receipts' history (a fast offline run skips the build and the publish, so it never counts)
const publishedFact = name === 'pre-push' ? (() => { const head = git(['rev-parse', '--short=8', 'HEAD']); const lines = existsSync('docs/public/receipts.ndjson') ? readFileSync('docs/public/receipts.ndjson', 'utf8').trim().split('\n') : []; for (const l of lines.reverse()) { let r: { head?: string; steps?: { name: string; status: string }[] }; try { r = JSON.parse(l) } catch { continue } if (r.head !== head) continue; const st = (n: string) => r.steps?.find((s) => s.name === n)?.status ?? 'missing'; if (st('docs:build') === 'skipped' || st('publish') === 'skipped') continue; return { head, branch: execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim(), build: st('docs:build'), publish: st('publish') } } return null })() : undefined
const soleFact = name === 'pre-push' ? { branches: git(['branch', '--format=%(refname:short)']).split('\n').filter(Boolean), worktrees: git(['worktree', 'list', '--porcelain']).split('\n').filter((l) => l.startsWith('worktree ')).length } : undefined
const facts = { // the penalties this workflow raised itself are re-decided by this very run (cleared if it passes), so they don't count against it: no deadlock
...(name === 'pre-push' ? { penalties: standing.open ? (() => { const others = standing.open.filter((b) => (b.snapshot as { workflow?: string } | undefined)?.workflow !== name && (b as { blocks?: boolean }).blocks !== false && GAP_KINDS[gapKindOf(b.rule ?? '', b.kind)]); /* lex mitior: blocks when it blocked when raised and its kind blocks now */ return { open: others.length, openKeys: others.map((b) => b.snapshot?.key ?? '') } })() : null } : {}), ...(name === 'pre-commit' ? { automated: automated ? { drifted: automated.drifted, manual: manualFact } : null, staged: stagedFact ?? null } : {}), ...(soleFact !== undefined ? { sole: soleFact } : {}), ...(publishedFact !== undefined ? { published: publishedFact } : {}), ...deployFacts, receipt: read(RUN_FILES.receipt) as { steps?: { name: string; status: string }[] } | null, approval: (read(RUN_FILES.configs) as { approval?: unknown } | null)?.approval ?? null, e2e: (read(RUN_FILES.e2e) as { outcomes?: { uncorrectable: number; agree: number; erased: number } } | null)?.outcomes ?? null }
const d = (handle({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'repository', arguments: { workflow: name, facts } } }) as { result?: { structuredContent?: { decision?: { allowed: boolean; strict: boolean; says: string; court: { arguments: { court: unknown } } | null } } } }).result?.structuredContent?.decision
if (d) {
  console.log(`hook ${name}: ${d.says}`)
  const held = new Set(((d as { rules?: { rule: string; holds: boolean | null }[] }).rules ?? []).filter((r) => r.holds === true).map((r) => r.rule))
  for (const b of standing.open ?? []) { const s = b.snapshot as { key?: string; workflow?: string; violated?: string[] } | undefined; if (!s?.key || s.workflow !== name || !(s.violated ?? []).length || !(s.violated ?? []).every((v) => held.has(v))) continue; const c = await clear(b.rule ?? name, `${(s.violated ?? []).join(', ')} hold again`, s as Record<string, unknown> & { key: string }, b.kind, b.tokens, (b.coin as { debit?: string } | null | undefined)?.debit?.replace(/^coins:/, () => '') ?? null); console.error(`hook ${name}: cleared ${s.key}: ${c.recorded}`) }
  if (!d.allowed && d.court) {
    const c = (handle({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'legal', arguments: { court: d.court.arguments.court } } }) as { result?: { structuredContent?: { case?: string; remedy?: string } } }).result?.structuredContent as { case?: string; remedy?: string } | undefined
    console.error(`hook ${name}: refused; the case ${c?.case ?? '?'}: ${c?.remedy ?? ''}`)
    // the refusal is a penalty: priced in work (the manual difference for automated, else the refusal's own text), sealed, booked, recorded in the RAID
    const violated = (d as { violated?: string[] }).violated ?? [], unknown = (d as { unknown?: string[] }).unknown ?? []
    const isAutomated = violated.includes('automated') && automated !== null
    const p = await penalise({ rule: `${name}:${[...violated, ...unknown.map((u) => u + '?')].join('+')}`, bytes: isAutomated ? automated!.bytes : Buffer.byteLength(JSON.stringify(((d as { rules?: { rule: string; evidence?: unknown }[] }).rules ?? []).filter((x) => violated.includes(x.rule) || unknown.includes(x.rule)).map((x) => x.evidence ?? x.rule))) /* harmonic: the refusal priced by its violated facts' own bytes */, committer: git(['config', 'user.name']) || null, evidence: { key: `${name}:${violated.join('+')}:${unknown.join('+')}:${isAutomated ? automated!.drifted.join(',') : git(['rev-parse', '--short=8', 'HEAD'])}`, workflow: name, violated, unknown, head: git(['rev-parse', '--short=8', 'HEAD']), branch: git(['rev-parse', '--abbrev-ref', 'HEAD']), stat: git(['diff', '--cached', '--stat']), files: isAutomated ? automated!.files : [], receipt: (read(RUN_FILES.receipt) as { id?: string } | null)?.id ?? null, court: c?.case ?? null } })
    console.error(`hook ${name}: penalty ${p.body.seal.address}: ${p.says}; ${p.recorded}`)
  }
}
process.exit((red && w.strict) || (d && !d.allowed) ? 1 : 0)
