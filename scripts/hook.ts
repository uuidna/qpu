// The git hooks as clients of one MCP workflow: this script asks the repository tool for the workflow the hook names
// (pre-commit, pre-push, post-commit, prepare-commit-msg) and walks its steps — a command run, an MCP call (local through the
// handler, remote by URL with the user agent the step names), an imprint appended beside the receipt, the trailers written on
// the commit message — exactly as the door answers them, nothing decided here. A strict step that fails ends the hook red.
import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync, statSync, readdirSync, openSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { spawnSync, execSync, spawn } from 'node:child_process'
import { toolCallerOf } from '../src/quantum/processing/mcp.ts'
import { GENERATED_FILES, RUN_FILES, type Rename } from '../src/quantum/processing/toolboxes/repository.ts'
import { LITERAL_ROOTS, listManualDocs } from '../src/quantum/processing/audit.ts'
import { GAP_KINDS, classifyGap } from '../src/quantum/processing/toolboxes/billing.ts'
import { createHash } from 'node:crypto'
import { penalise, clear, correctPenalty, recordPrevented, listOpenPenalties } from './penalties.ts'
import { mcpClient, getJson, raidRead, MCP_URL } from './mcp.ts'
import { redact } from '../src/quantum/processing/machine.ts'
import { homedir } from 'node:os'

type Step = { id: string; kind: 'run' | 'mcp' | 'raid' | 'imprint' | 'trailers' | 'stage'; strict?: boolean; detach?: boolean; cmd?: string; args?: string[]; tool?: string; arguments?: Record<string, unknown>; url?: string; files?: string[]; says: string }
const name = process.argv[2] ?? ''
const git = (a: string[]) => spawnSync('git', a, { encoding: 'utf8', maxBuffer: 1 << 30 }).stdout?.trim() ?? ''
const extra = process.argv.slice(3)
// the repository tool answered by the running Payload app when up and keyed — the decision over its live records, under the tenant's roles, so
// pre-commit and pre-push are Payload hooks — else computed in-process (offline); the e2e gate proves the two answers equal
// the Payload app's CRUD REST is the MCP: a tool runs as POST /api/entries { kind: 'call', body: { tool, arguments } }, the entries beforeValidate
// hook computing the result through callOf — the same core, inside the app, over its live records under the key's roles; offline, in-process
const appBase = (process.env.QPU_APP_MCP ?? MCP_URL).replace(/\/api\/mcp$/, ''), appAuth = `${process.env.QPU_APP_AUTH_COLLECTION ?? 'users'} API-Key ${process.env.QPU_APP_KEY}`
let said = false
const repositoryTool = async (a: Record<string, unknown>): Promise<any> => {
  if (process.env.QPU_OFFLINE !== '1' && process.env.QPU_APP_KEY) try {
    const res = await fetch(`${appBase}/api/entries`, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json', authorization: appAuth }, body: JSON.stringify({ kind: 'call', from: 'hook', body: { tool: 'repository', arguments: a } }), signal: AbortSignal.timeout(30000) })
    if (res.ok) { const r = ((await res.json()) as { doc?: { result?: { content?: { text: string }[]; structuredContent?: unknown } } }).doc?.result, out = r?.content ? JSON.parse(r.content[0]!.text) : r?.structuredContent ?? r; if (out) { if (!said) { console.error(`hook ${name}: decided by the Payload app (${appBase})`); said = true } return out } }
    else console.error(`hook ${name}: the Payload app answered HTTP ${res.status}; in-process`)
  } catch (e) { console.error(`hook ${name}: the Payload app did not answer (${(e as Error).message.slice(0, 60)}); in-process`) }
  return toolCallerOf('repository')(a)
}
let w: { name: string; steps: Step[]; strict: boolean } | undefined, why = 'no such workflow'
try { w = (await repositoryTool({ workflow: name, offline: process.env.QPU_OFFLINE === '1' }))?.workflow } catch (e) { why = (e as Error).message }
if (!w) { console.error(`hook ${name}: ${why}`); process.exit(1) }
let red = false
// the open penalties first, before any step: their count, the tokens and coins they book, and each one's rule and subject
const standing = await listOpenPenalties()
if (!standing.open) console.error(`hook ${name}: penalties unread (${standing.read})`)
else { const shown = standing.open.filter((b) => (b as { printed?: boolean }).printed !== false && b.kind !== 'invisible'); /* an invisible action's penalty is recorded silently, never printed (textbook_penalty_visibility_harmonic) */ console.error(`hook ${name}: ${shown.length} open penalt${shown.length === 1 ? 'y' : 'ies'}, ${standing.tokens} token(s), ${standing.coins} coin(s)`); for (const b of shown) console.error(`  ${(b as { kind?: string }).kind ?? 'refusal'}${(b as { blocks?: boolean }).blocks === false ? ' (listed)' : ''} ${b.rule}: ${b.snapshot?.key}`) }
let automated: { drifted: string[]; bytes: number; files: { path: string; expected: string; actual: string }[] } | null = null
// a raid step: the docket read through the Payload MCP tool the step names, every page (the URL overridden by QPU_APP_MCP, the user's MCP key
// in QPU_APP_KEY, never written anywhere), in the RAID's order: else binding 0's copy; with neither the docket is unread and the rules say unknown
let docket: unknown[] | null = null
const getRaid = (s: Step) => raidRead(s.tool!, async () => (await mcpClient(process.env.QPU_APP_MCP ?? s.url).findAll(s.tool!, s.arguments ?? {})).docs as Record<string, unknown>[] | null)
for (const s of w.steps) {
  if (red && s.strict) break
  // a detached step runs in the background with its own output file, never holding the hook
  if (s.kind === 'run' && s.detach) { const log = join('.qpu', `${s.id}.log`); mkdirSync('.qpu', { recursive: true }); const fd = openSync(log, 'w'); spawn(s.cmd!, s.args ?? [], { detached: true, stdio: ['ignore', fd, fd] }).unref(); console.log(`hook ${name}: ${s.id} started in the background (${log})`); continue }
  if (s.kind === 'run') { const p = spawnSync(s.cmd!, s.args ?? [], { stdio: 'inherit' }); if (p.status !== 0) { console.error(`hook ${name}: step ${s.id} red`); if (s.strict) red = true } continue }
  if (s.kind === 'raid') { const got = await getRaid(s); docket = got.docs ?? null; console.log(`hook ${name}: ${s.id}: ${got.docs?.length ?? 'no'} document(s) from ${got.from}`); continue }
  if (s.kind === 'stage') {
    // before anything is staged: every generated file whose staged content differs from what its generator just wrote (the step above regenerated them)
    const drifted = GENERATED_FILES.filter((p) => existsSync(p) && spawnSync('git', ['diff', '--quiet', '--', p]).status === 1)
    const sha = (b: Buffer | string) => createHash('sha256').update(b).digest('hex')
    automated = { drifted, bytes: drifted.length ? Buffer.byteLength(execSync(`git diff -- ${drifted.map((p) => JSON.stringify(p)).join(' ')}`, { encoding: 'utf8' })) : 0, files: drifted.map((p) => ({ path: p, expected: sha(readFileSync(p)), actual: sha(execSync(`git show :${JSON.stringify(p)}`)) })) }
    spawnSync('git', ['add', '-u', '--', ...(s.files ?? [])], { stdio: 'ignore' }); continue
  }
  if (s.kind === 'imprint') {
    const head = git(['rev-parse', 'HEAD']); const receipt = getJson(RUN_FILES.receipt) as { id?: string; sha256?: string } | null
    mkdirSync('docs/public', { recursive: true }); appendFileSync('docs/public/imprints.ndjson', JSON.stringify({ commit: head, receipt: receipt?.id ?? null, sha256: receipt?.sha256 ?? null, date: new Date().toISOString() }) + '\n')
    console.log(`imprint: commit ${head.slice(0, 8)} ↔ receipt ${receipt?.id ?? 'none'}`); continue
  }
  if (s.kind === 'trailers') {
    const path = extra[0]; const src = extra[1]; if (!path || src === 'merge' || src === 'squash') continue
    const rc = getJson(RUN_FILES.receipt) as { id?: string; sha256?: string; steps?: { name: string; status: string }[] } | null, p = getJson('docs/public/purify-leads.json'), n = getJson('docs/public/next-leads.json'), rd = getJson('docs/public/readiness.json') as { readiness: { ready: boolean; receipt: string }; date: string } | null
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
  if (s.kind === 'mcp' && s.id !== 'sign') { try { toolCallerOf(s.tool!)(s.arguments ?? {}) } catch (e) { console.error(`hook ${name}: ${s.id}: ${(e as Error).message}`); if (s.strict) red = true } }
}
// the involution of thinking: a hand edit of a generated file whose correction the docket already learned (a cleared pre-commit:automated) is
// corrected before the decision — its antimatter (regenerate, restage: reversible, generated files only) applied and recorded as prevented — so
// the same thought is corrected, never refused again
// the hook edits before it decides: every published file redacted (paths relative, each leak by its kind) and staged again
if (name === 'pre-commit') for (const f of [...new Set([...git(['ls-files', '--', 'docs', 'README.md']).split('\n'), ...readdirSync(dirname(RUN_FILES.receipt)).map((p) => join(dirname(RUN_FILES.receipt), p))])].filter((p) => /\.(md|json|ndjson|txt|xml|html)$/.test(p) && existsSync(p))) { const t = readFileSync(f, 'utf8'), r = redact(t, process.cwd(), homedir()); if (r !== t) { writeFileSync(f, r); if (git(['ls-files', '--', f])) git(['add', '--', f]) } }
if (name === 'pre-commit' && automated && automated.drifted.length && standing.learned?.includes('pre-commit:automated')) {
  const c = correctPenalty({ rule: 'pre-commit:automated', bytes: automated.bytes, committer: git(['config', 'user.name']) || null, evidence: { key: `pre-commit:automated::${automated.drifted.join(',')}`, workflow: name, violated: ['automated'], drifted: automated.drifted } }, standing.learned)
  if (c && c.antimatter.needs === 'auto') {
    for (const m of c.antimatter.run) spawnSync(m.cmd, m.args, { stdio: 'inherit' })
    const left = GENERATED_FILES.filter((p) => existsSync(p) && spawnSync('git', ['diff', '--quiet', '--', p]).status === 1)
    // the prevention is recorded only when the correction made the rule hold again; otherwise the rule decides and refuses as before
    console.error(`hook ${name}: ${left.length ? `the learned correction left ${left.length} drifted: the rule decides` : `corrected by the learned antimatter, no penalty: ${c.says}; ${await recordPrevented(c.body)}`}`)
    automated = { ...automated, drifted: left }
  }
}
// pre-commit: the staged diff of the hand-written roots, read once: the core reads literals, folded and proven from it (a file declaring its generator excluded)
// the renames this commit carries, read from Payload: the wave the rename door recorded at HEAD, its renames populated through links (has many)
const renamesAtHead = name === 'pre-commit' && process.env.QPU_APP_KEY ? await (async () => { const m = mcpClient(), head = git(['rev-parse', 'HEAD']), waves = (((await m.findAll('findEntries', { where: JSON.stringify({ kind: { equals: 'rename-wave' } }), depth: 1 })).docs ?? []) as { body?: { base?: string }; links?: { body?: Rename }[] }[]).filter((w) => w.body?.base === head); return waves.flatMap((w) => (w.links ?? []).flatMap((l) => (l.body ? [l.body] : []))) })() : []
const getStagedDiff = () => { const diff = git(['diff', '--cached', '-U0', '--no-color', '--no-renames', '--', ...LITERAL_ROOTS]); return { diff, renames: renamesAtHead, generated: [...diff.matchAll(/^\+\+\+ b\/(.+)$/gm)].map((m) => m[1]!).filter((f) => { try { return /^\/\/ generated by |(automatically|generated) by payload|generated by configure \{/im.test(readFileSync(f, 'utf8').slice(0, 800)) } catch { return true } }) } }
// the hook pays for what a commit adds, before it decides: while the staged code grows, a lead of any status whose record already lives, equal, in Payload,
// whose id no code names and whose prefix no check counts, leaves leads.ts and is staged
if (name === 'pre-commit' && process.env.QPU_APP_KEY) {
  const folded = ((await repositoryTool({ workflow: name, facts: { staged: getStagedDiff() } })).decision as { rules?: { rule: string; evidence?: string }[] } | undefined)?.rules?.find((r) => r.rule === 'folded')?.evidence ?? ''
  let owed = Number(/net (-?\d+)/.exec(folded)?.[1] ?? 0)
  if (owed > 0) {
    // the held leads (what Payload holds, so a code lead may leave leads.ts) read fast from the local content-addressed mirror leads-index.ts
    // (generated from Payload by leads-sync): a lookup, not the slow live docket query that times out on the large docket (verify_beats_recompute);
    // the live read is the fallback only when the mirror is empty
    const { listLeads } = await import('./mcp.ts'), { LEADS } = await import('../src/quantum/processing/leads.ts'), { LEAD_ROWS } = await import('../src/quantum/processing/leads-index.ts')
    const held = new Map((LEAD_ROWS.length ? LEAD_ROWS : (await listLeads()).records).map((l) => [l.id, l]))
    const counted = [...new Set(git(['grep', '-h', '-o', "startsWith('[a-z]*-')", '--', 'src', 'scripts']).match(/'[a-z]+-'/g) ?? [])].map((p) => p.slice(1, -1)), file = 'src/quantum/processing/leads.ts', moved: string[] = []
    // paid in chunks of five, each kept only if a fresh-process audit stays as green as before it, else put back and the next chunk tried
    const failedNow = () => Number(spawnSync('node', ['--input-type=module', '-e', "const { toolCallerOf } = await import('./src/quantum/processing/mcp.ts'); console.log(toolCallerOf('audit')().failed)"], { encoding: 'utf8', maxBuffer: 1 << 26 }).stdout.trim().split('\n').pop() ?? NaN), base = failedNow(), candidates: { id: string; row: string }[] = []
    let text = readFileSync(file, 'utf8')
    // a generated file (a header-declared mirror, e.g. leads-index.ts from the docket) is not code that names the lead: its appearance there must not
    // disqualify the lead from being externalised — the mirror reflects Payload, where the lead lives after the move (textbook_cheap_gates)
    const isGen = (f: string) => { try { return /^\/\/ generated by |(automatically|generated) by payload|generated by configure \{/im.test(readFileSync(f, 'utf8').slice(0, 800)) } catch { return false } }
    for (const l of LEADS) { const p = held.get(l.id); if (p?.statement !== l.statement || p?.status !== l.status || counted.some((c) => l.id.startsWith(c)) || git(['grep', '-l', '-F', `'${l.id}'`, '--', 'src', 'scripts', '.qpu-app/src']).split('\n').some((f) => f && f !== file && !isGen(f))) continue; const row = text.split('\n').find((x) => x.includes(`id: '${l.id}'`)); if (row) candidates.push({ id: l.id, row }) }
    for (let i = 0; i < candidates.length && owed > 0; i += 5) {
      const chunk = candidates.slice(i, i + 5), next = chunk.reduce((t, c) => t.split(c.row + '\n').join(''), text); writeFileSync(file, next)
      if (failedNow() > base) { writeFileSync(file, text); continue }
      text = next; owed -= chunk.reduce((n, c) => n + c.row.length + 1, 0); moved.push(...chunk.map((c) => c.id))
    }
    if (moved.length) { git(['add', '--', file]); console.error(`hook ${name}: paid by ${moved.length} lead(s) whose records live in Payload, every check as green as before: ${moved.join(', ')}`) }
    if (owed > 0) console.error(`hook ${name}: ${owed} byte(s) still owed; folded decides`)
  }
}
const stagedFact = name === 'pre-commit' ? getStagedDiff() : undefined
// pre-commit: a new docs page that no generator writes is manual work, refused by the rule automated (a page already in the tree is listed by purify)
const manualFact = name === 'pre-commit' ? (() => {
  const addedPages = git(['diff', '--cached', '--name-only', '--diff-filter=A', '--', 'docs']).split('\n').filter((f) => f.endsWith('.md'))
  if (!addedPages.length) return []
  const scripts = Object.fromEntries(git(['ls-files', 'scripts']).split('\n').filter((f) => /\.(ts|mjs)$/.test(f)).map((f) => [f, readFileSync(f, 'utf8')]))
  return listManualDocs(addedPages.map((path) => ({ path, bytes: existsSync(path) ? statSync(path).size : 0 })), scripts).rows.filter((r) => r.manual).map((r) => r.path)
})() : []
// the rules of the workflow decided by their theorems over the facts this client read after its steps: the receipt it wrote, the approval the configs step recorded, the gate's decoding; a violation is refused and its case named
// pre-deploy: the OpenNext bundle measured here, the deploy configuration handed over as its text, the docket as the Payload MCP answered it;
// the core folds them into the facts (the bindings, the account, its observability, its usage): this client names no provider and no resource
const newest = (dir: string): number => { let t = 0; const walk = (d: string) => { for (const f of readdirSync(d, { withFileTypes: true })) { const p = join(d, f.name); if (f.isDirectory()) { if (f.name !== 'node_modules' && !f.name.startsWith('.')) walk(p) } else t = Math.max(t, statSync(p).mtimeMs) } }; if (existsSync(dir)) walk(dir); return t }
const deployFacts = name === 'pre-deploy' ? (() => {
  const worker = '.qpu-app/.open-next/worker.js', assets = '.qpu-app/.open-next/assets'
  return { openNext: { worker: existsSync(worker), assets: existsSync(assets), builtAt: existsSync(worker) ? statSync(worker).mtimeMs : 0, sourcesAt: newest('.qpu-app/src') }, config: existsSync('.qpu-app/wrangler.jsonc') ? readFileSync('.qpu-app/wrangler.jsonc', 'utf8') : null, docket }
})() : {}
// pre-push: the newest full run of the commit being pushed, from the receipts' history (a fast offline run skips the build and the publish, so it never counts)
const publishedFact = name === 'pre-push' ? (() => { const head = git(['rev-parse', '--short=8', 'HEAD']); const lines = existsSync('docs/public/receipts.ndjson') ? readFileSync('docs/public/receipts.ndjson', 'utf8').trim().split('\n') : []; for (const l of lines.reverse()) { let r: { head?: string; steps?: { name: string; status: string }[] }; try { r = JSON.parse(l) } catch { continue } if (r.head !== head) continue; const st = (n: string) => r.steps?.find((s) => s.name === n)?.status ?? 'missing'; if (st('docs:build') === 'skipped' || st('publish') === 'skipped') continue; return { head, branch: execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim(), build: st('docs:build'), publish: st('publish') } } return null })() : undefined
const soleFact = name === 'pre-push' ? { branches: git(['branch', '--format=%(refname:short)']).split('\n').filter(Boolean), worktrees: git(['worktree', 'list', '--porcelain']).split('\n').filter((l) => l.startsWith('worktree ')).length } : undefined
const facts = { // the penalties this workflow raised itself are re-decided by this very run (cleared if it passes), so they don't count against it: no deadlock
...(name === 'pre-push' ? { penalties: standing.open ? (() => { const others = standing.open.filter((b) => (b.snapshot as { workflow?: string } | undefined)?.workflow !== name && (b as { blocks?: boolean }).blocks !== false && GAP_KINDS[classifyGap(b.rule ?? '', b.kind)]); /* lex mitior: blocks when it blocked when raised and its kind blocks now */ return { open: others.length, openKeys: others.map((b) => b.snapshot?.key ?? '') } })() : null } : {}), ...(name === 'pre-commit' ? { automated: automated ? { drifted: automated.drifted, manual: manualFact } : null, staged: stagedFact ?? null } : {}), ...(soleFact !== undefined ? { sole: soleFact } : {}), ...(name === 'commit-msg' ? { message: readFileSync(extra[0]!, 'utf8') } : {}), ...(name === 'pre-commit' || name === 'pre-push' ? { workflows: Object.fromEntries(readdirSync(RUN_FILES.workflows).map((f) => [f, readFileSync(join(RUN_FILES.workflows, f), 'utf8')])) } : {}), ...(publishedFact !== undefined ? { published: publishedFact } : {}), ...deployFacts, receipt: getJson(RUN_FILES.receipt) as { steps?: { name: string; status: string }[] } | null, approval: (getJson(RUN_FILES.configs) as { approval?: unknown } | null)?.approval ?? null, e2e: (getJson(RUN_FILES.e2e) as { outcomes?: { uncorrectable: number; agree: number; erased: number } } | null)?.outcomes ?? null }
const d = (await repositoryTool({ workflow: name, facts })).decision as { allowed: boolean; strict: boolean; says: string; court: { arguments: { court: unknown } } | null } | undefined
if (d) {
  console.log(`hook ${name}: ${d.says}`)
  const held = new Set(((d as { rules?: { rule: string; holds: boolean | null }[] }).rules ?? []).filter((r) => r.holds === true).map((r) => r.rule))
  for (const b of standing.open ?? []) { const s = b.snapshot as { key?: string; workflow?: string; violated?: string[] } | undefined; if (!s?.key || s.workflow !== name || !(s.violated ?? []).length || !(s.violated ?? []).every((v) => held.has(v))) continue; const c = await clear(b.rule ?? name, `${(s.violated ?? []).join(', ')} hold again`, s as Record<string, unknown> & { key: string }, b.kind, b.tokens, (b.coin as { debit?: string } | null | undefined)?.debit?.replace(/^coins:/, () => '') ?? null); console.error(`hook ${name}: cleared ${s.key}: ${c.recorded}`) }
  if (!d.allowed && d.court && !process.argv.includes('--pre-use')) { // pre-use: decided before the act, so a refusal costs nothing
    const c = toolCallerOf('legal')({ court: d.court.arguments.court }) as { case?: string; remedy?: string } | undefined
    console.error(`hook ${name}: refused; the case ${c?.case ?? '?'}: ${c?.remedy ?? ''}`)
    // the refusal is a penalty: priced in work (the manual difference for automated, else the refusal's own text), sealed, booked, recorded in the RAID
    const violated = (d as { violated?: string[] }).violated ?? [], unknown = (d as { unknown?: string[] }).unknown ?? []
    const isAutomated = violated.includes('automated') && automated !== null
    const p = await penalise({ rule: `${name}:${[...violated, ...unknown.map((u) => u + '?')].join('+')}`, bytes: isAutomated ? automated!.bytes : Buffer.byteLength(JSON.stringify(((d as { rules?: { rule: string; evidence?: unknown }[] }).rules ?? []).filter((x) => violated.includes(x.rule) || unknown.includes(x.rule)).map((x) => x.evidence ?? x.rule))) /* harmonic: the refusal priced by its violated facts' own bytes */, committer: git(['config', 'user.name']) || null, evidence: { key: `${name}:${violated.join('+')}:${unknown.join('+')}:${isAutomated ? automated!.drifted.join(',') : git(['rev-parse', '--short=8', 'HEAD'])}`, workflow: name, violated, unknown, head: git(['rev-parse', '--short=8', 'HEAD']), branch: git(['rev-parse', '--abbrev-ref', 'HEAD']), stat: git(['diff', '--cached', '--stat']), files: isAutomated ? automated!.files : [], receipt: (getJson(RUN_FILES.receipt) as { id?: string } | null)?.id ?? null, court: c?.case ?? null } })
    console.error(`hook ${name}: penalty ${p.body.seal.address}: ${p.says}; ${p.recorded}`)
  }
}
process.exit((red && w.strict) || (d && !d.allowed) ? 1 : 0)
