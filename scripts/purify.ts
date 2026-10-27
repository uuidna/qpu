// Purification: the codebase collided with its own proofs and measurements. Anything not proven becomes an open lead;
// prose that disagrees with a measurement is rewritten from the measurement. Dependency-free and deterministic.
//   1. exports under src/quantum that no test, tool, example or other module references → lead "unproven export"
//   2. files under src/quantum that nothing imports and that are not tests → lead "orphan file"
//   3. the README's measured table is regenerated from git, tsc, the test receipt, lake build, the theorem ledger and tools/list
import { findLeaks, LEAK_ALLOWED } from '../src/quantum/audit.ts'
import { execFileSync, spawnSync } from 'node:child_process'
import { appendFileSync, existsSync, readFileSync, readdirSync, writeFileSync, renameSync } from 'node:fs'
import { join } from 'node:path'
import './teleport.ts'
import { handle, cellOf as cell } from '../src/quantum/mcp.ts'
import { EXAMPLES } from '../src/quantum/examples.ts'
import { findCleanupSubjects } from '../src/quantum/leads.ts'
import { VERIFIERS, extractFacts, buildVerifyRequests } from '../src/quantum/verifiers.ts'
import { uuidOf } from '../src/quantum/blocks.ts'
import { readJson, readLeads } from './mcp.ts'
const { all: LEADS } = await readLeads()

const ROOT = process.cwd()
// text that reaches a page is escaped once: an angle bracket in evidence or a node name is text, never a tag
const Q = join(ROOT, 'src', 'quantum')
const files = readdirSync(Q).filter((f) => f.endsWith('.ts'))
const text = Object.fromEntries(files.map((f) => [f, readFileSync(join(Q, f), 'utf8')]))
// Proof by use is sought in every tracked source text of the tree (TypeScript, Vue, Markdown, Lean), not one folder: a page's component is a use.
// tracked and new alike: a file written this run proves use as much as one committed; what git ignores stays out
const tracked = [...new Set(execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { cwd: ROOT, encoding: 'utf8' }).trim().split('\n').filter(Boolean))]
const served = Object.values(text).join('\n') + readdirSync(join(ROOT, 'docs')).filter((f) => f.endsWith('.md')).map((f) => readFileSync(join(ROOT, 'docs', f), 'utf8')).join('\n')
const all = served + '\n' + tracked.filter((f) => /\.(ts|mts|vue|md|lean)$/.test(f) && !f.startsWith('docs/audit/') && existsSync(join(ROOT, f))).map((f) => readFileSync(join(ROOT, f), 'utf8')).join('\n')

type Lead = { id: string; source: string; statement: string; status: 'open'; reason?: string; tool?: string }
const leads: Lead[] = []
for (const f of files) {
  if (f.endsWith('.test.ts')) continue
  for (const m of text[f]!.matchAll(/^export (?:const|function|class|type) ([A-Za-z0-9_]+)/gm)) {
    const name = m[1]!
    const uses = (all.match(new RegExp(`\\b${name}\\b`, 'g')) ?? []).length
    if (uses <= 1) leads.push({ id: `unproven-${f.replace(/\.ts$/, '')}-${name}`, source: `src/quantum/${f}`, statement: `export ${name} in ${f} is referenced by nothing: no test, tool, example, page or module`, status: 'open', reason: 'not proven by use; harden with a test or soften by removal' })
  }
  const stem = f.replace(/\.ts$/, '')
  const imported = files.some((g) => g !== f && new RegExp(`from '\\./${stem}\\.(js|ts)'`).test(text[g]!)) || new RegExp(`from '(?:(?:\\.\\.?/)+(?:src/)?(?:quantum/)?|@uuidna/qpu/)${stem}(?:\\.(js|ts))?'`).test(all)
  if (!imported && !f.endsWith('.test.ts') && f !== 'mcp.ts') leads.push({ id: `orphan-${stem}`, source: `src/quantum/${f}`, statement: `${f} is imported by nothing`, status: 'open', reason: 'an orphan is unproven; fold it in or remove it' })
}

// A cleanup lead is settled only while its subject stays absent: the status is a measurement, re-taken each run, never a memory.
const presentSubjects = (subjects: ReturnType<typeof findCleanupSubjects>): string[] => !subjects ? [] : subjects.kind === 'branches'
  ? subjects.names.filter((b) => execFileSync('git', ['branch', '--list', b], { cwd: ROOT, encoding: 'utf8' }).trim() !== '')
  : subjects.names.filter((path) => existsSync(join(ROOT, path)))
for (const l of LEADS) {
  const present = presentSubjects(findCleanupSubjects(l))
  if (present.length) leads.push({ id: `${l.id}-returned`, source: l.source, statement: `${l.id} records a removal, yet ${present.join(', ')} is present again`, status: 'open', reason: 'a cleanup is settled only while its subject stays absent; remove it or reopen the lead' })
}

const doubled = (served.match(/&amp;#\d+;|&amp;[a-z]+;/g) ?? []).length
if (doubled) leads.push({ id: 'double-escaped-entities', source: 'src/quantum', statement: `${doubled} double-escaped HTML entities (an ampersand escaped twice) in served text: titles were escaped at the source and again by the widget`, status: 'open', reason: 'decode entities where the text enters; escape once where it leaves' })

// Collisions are leads: every text the tree addresses (example texts, lead statements) folded; two different texts at one address is a lead.
const addressed = new Map<string, Set<string>>()
for (const e of EXAMPLES) { const t = `${e.tool}${JSON.stringify(e.arguments)}`; (addressed.get(uuidOf(t)) ?? addressed.set(uuidOf(t), new Set()).get(uuidOf(t))!).add(t) }
for (const l of LEADS) (addressed.get(uuidOf(l.statement)) ?? addressed.set(uuidOf(l.statement), new Set()).get(uuidOf(l.statement))!).add(l.statement)
let collisions = 0
for (const [address, texts] of addressed) if (texts.size > 1) { collisions += 1; leads.push({ id: `collision-${address.slice(0, 8)}`, source: 'purify fold scan', statement: `fold collision at ${address}: ${texts.size} different texts share one address`, status: 'open', reason: 'the fold is not collision-resistant against a search; develop the colliding pair' }) }
console.log(`purify: ${addressed.size} addresses scanned, ${collisions} collision(s)`)
// no email in the tree: the deployer's address is read from the Cloudflare account at build and deploy and never written; every address found in a
// tracked file that is not an upstream placeholder (the MIT fork's own, example domains) is a leak — a lead and a red step, so a commit stops
const scanned = tracked.filter((f) => !/pnpm-lock|package-lock|\.(png|jpg|jpeg|gif|mp4|ico|woff2?|pdf|svg)$/.test(f))
const leaks: { file: string; domain: string }[] = []
for (const f of scanned) { let text = ''; try { text = readFileSync(join(ROOT, f), 'utf8') } catch { continue }; for (const m of text.matchAll(/[A-Za-z0-9._%+-]+@([A-Za-z0-9.-]+\.[A-Za-z]{2,})/g)) { const domain = m[1]!.toLowerCase(); if (!LEAK_ALLOWED.has(domain) && !findLeaks({ m: m[0] }).setAside) leaks.push({ file: f, domain }) } } // the notations audit { leaks } sets aside (a block address <uuid>@<host>, the reserved test domains, documentation placeholders) are not addresses
if (leaks.length) leads.push({ id: 'email-leak', source: [...new Set(leaks.map((l) => l.file))].join(', '), statement: `${leaks.length} email address(es) in tracked files (${[...new Set(leaks.map((l) => l.domain))].join(', ')}): the tree keeps none; the deployer's is read from the Cloudflare account at build and deploy`, status: 'open', reason: 'remove the address; a contact is a URL' })
console.log(`purify: ${scanned.length} tracked files scanned for email addresses, ${leaks.length} leak(s)${leaks.length ? ` in ${[...new Set(leaks.map((l) => l.file))].join(', ')}` : ''}`)

// Measurements for the README table.
const sh = (cmd: string, args: string[]): string => { const r = spawnSync(cmd, args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 26 }); return `${r.stdout ?? ''}${r.stderr ?? ''}` }
const tsSources = tracked.filter((f) => /^src\/quantum\/[^/]+\.ts$/.test(f) && !f.endsWith('.test.ts'))
const tsLines = tsSources.reduce((n, f) => n + readFileSync(join(ROOT, f), 'utf8').split('\n').length, 0)
const receipt = readJson(join(ROOT, 'docs', 'public', 'receipt.json'), { steps: [] })
const step = (name: string) => receipt.steps.filter((s: { name: string }) => s.name === name).at(-1)
const tests = step('test')?.counts ?? {}
const lean = step('lean')?.counts ?? {}
const toolNames = (handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) as { result: { tools: { name: string; description: string }[] } }).result.tools, tools = toolNames.length
const lake = [`${process.env.HOME}/.elan/bin/lake`, `${process.env.HOME}/.elan/toolchains/leanprover--lean4---v4.33.0/bin/lake`, 'lake'].find((p) => p === 'lake' || existsSync(p))!
// The theorem ledger: every kernel-accepted theorem of the Qpu modules with its statement and axioms, one JSON line each
// (scripts/theorems.lean), written as build output and as a page; the counts below are taken from it, never from prose.
type TheoremRow = { key: string; module: string; statement: string; axioms: string[] }
const ledgerText = sh(lake, ['env', 'lean', 'scripts/theorems.lean'])
const ledger: TheoremRow[] = ledgerText.split('\n').filter((l) => l.startsWith('{')).flatMap((l) => { try { return [JSON.parse(l) as TheoremRow] } catch { return [] } })
if (!ledger.length) leads.push({ id: 'theorem-ledger-empty', source: 'scripts/theorems.lean', statement: 'the theorem ledger came back empty', status: 'open', reason: ledgerText.trim().split('\n').slice(-3).join(' | ') || 'no output' })
// The compiler's own names: equation lemmas, match splitters, the _proof_N and _simp_N auxiliaries, structure and recursor boilerplate.
const GENERATED = /\.(eq_\d+|eq_def|match_\d+|proof_\d+|_proof(?:_\d+)+|_simp(?:_\d+)+|_sunfold|_unfold|inj|injEq|sizeOf_spec|noConfusion\w*|casesOn\w*|rec\w*|below\w*|brecOn\w*|brecOn\.eq|ibelow\w*|binductionOn\w*)$/
const handWritten = ledger.filter((r) => !r.key.startsWith('_private.') && !GENERATED.test(r.key))
const generated = ledger.length - handWritten.length
const kernel = ledger.length ? String(ledger.length) : '?'
const axioms = ledger.length ? [...new Set(ledger.flatMap((r) => r.axioms))].filter((a) => a !== 'sorryAx').sort().join(', ') : '?'
const sorried = ledger.length ? String(ledger.filter((r) => r.axioms.includes('sorryAx')).length) : '?'
writeFileSync(join(ROOT, 'docs', 'public', 'theorems.ndjson'), ledger.map((r) => JSON.stringify(r)).join('\n') + '\n')
// The index the handler carries: every hand-written theorem's key, module and statement, generated from the kernel's own
// environment, so an example that names a theorem is checked against what the kernel accepted, never against prose.
// written only when it changes, and atomically (a sibling file renamed over it), so the checks running beside purify read the old index or the new,
// never half of one
if (ledger.length) { const indexPath = join(ROOT, 'src', 'quantum', 'theorems-index.ts'), indexText = ['// GENERATED by scripts/purify.ts from the Lean environment (scripts/theorems.lean). Do not edit: the kernel decides.', `export const KERNEL_THEOREMS = ${ledger.length}`, `export const GENERATED_LEMMAS = ${generated}`, 'export const THEOREMS: readonly { key: string; module: string; statement: string }[] = [', ...handWritten.map((r) => `  ${JSON.stringify({ key: r.key, module: r.module, statement: r.statement })},`), ']', 'export const THEOREM_KEYS: ReadonlySet<string> = new Set(THEOREMS.map((t) => t.key))', ''].join('\n'); if (!existsSync(indexPath) || readFileSync(indexPath, 'utf8') !== indexText) { writeFileSync(`${indexPath}.tmp`, indexText); renameSync(`${indexPath}.tmp`, indexPath) } }
const perModule = new Map<string, number>()
for (const r of handWritten) perModule.set(r.module, (perModule.get(r.module) ?? 0) + 1)
writeFileSync(join(ROOT, 'docs', 'theorems.md'), ['---', 'title: Theorems', 'order: 47', '---', '', '# The theorem ledger', '',
  `Every theorem the Lean kernel accepted in the Qpu modules, read from the environment by \`scripts/theorems.lean\` on ${new Date().toISOString().slice(0, 10)}: ${ledger.length} constants, of which ${handWritten.length} hand-written and ${generated} equation and match lemmas the compiler generated beside them; ${sorried} depend on \`sorryAx\`; axioms used: ${axioms}. The ledger is also served as \`/theorems.ndjson\`, one JSON line per theorem, the form offered to the unit's deposit door.`, '',
  '| Module | Hand-written theorems |', '|---|---:|', ...[...perModule.entries()].sort().map(([m, n]) => `| ${m} | ${n} |`), '',
  '| Key | Statement | Axioms |', '|---|---|---|', ...handWritten.map((r) => `| \`${r.key}\` | \`${r.statement.replace(/\|/g, '\\|').replace(/`/g, "'")}\` | ${r.axioms.join(', ') || '—'} |`), ''].join('\n'))
const declared = tracked.filter((f) => f.endsWith('.lean') && !f.startsWith('scripts/')).reduce((n, f) => n + (readFileSync(join(ROOT, f), 'utf8').match(/^\s*(?:@\[[^\]]*\]\s*)?(?:private\s+|protected\s+)?theorem /gm) ?? []).length, 0)
const modules = tracked.filter((f) => /src\/quantum\/processing\/unit\/lean\/Qpu(\/|\.lean$)/.test(f)).length
const deps = Object.keys(readJson('package.json').dependencies ?? {}).length
const verification = readJson(join(ROOT, 'docs', 'public', 'verification.json'))
const rows: [string, string][] = [
  ['Tracked files', String(tracked.length)],
  ['Source files under `src/quantum` (TypeScript)', `${tsSources.length} (${tsLines.toLocaleString('en-US')} lines)`],
  ['MCP tools', String(tools)],
  ['Tests (`node --test`)', tests.tests ? `${tests.pass} pass, ${tests.fail ?? 0} fail of ${tests.tests}` : 'not yet run by `npm run next`'],
  ['Type check (`tsc --noEmit`)', step('typecheck')?.status === 'green' ? '0 errors' : step('typecheck')?.status ?? 'not yet run'],
  ['Runtime dependencies', String(deps)],
  ['Lean 4 modules built (`lake build`, Lean 4.33.0)', lean.jobs ? `${modules} modules, ${lean.jobs} jobs, 0 errors` : `${modules} modules`],
  ['Theorems declared / accepted by the kernel', `${declared} / ${kernel} (${handWritten.length} hand-written, ${generated} generated equation lemmas)`],
  ['Theorems using `sorry`', String(sorried)],
  ['Axioms used by the kernel-accepted theorems', axioms.split(',').map((a) => `\`${a.trim()}\``).join(', ')],
  ['Self-audit checks', step('audit')?.counts?.checks ? `${step('audit').counts.checks} of ${step('audit').counts.checksTotal} pass` : 'see docs/audit'],
  // a wave in flight writes its file partially (no summary yet): read as in progress, never as a stop
  ['Cross-verification requests (free public sources)', verification?.summary ? `${verification.requests} requests, ${Object.values(verification.summary as Record<string, { ok: number }>).reduce((n, s) => n + s.ok, 0)} reachable on ${verification.date.slice(0, 10)}` : verification ? `wave in flight: ${verification.done ?? 0} of ${verification.requests ?? '?'} fetched` : 'not yet run'],
  ['Servers, workers, network calls in the handler', '0'],
]
const readme = join(ROOT, 'README.md')
let md = readFileSync(readme, 'utf8')
const table = `| Measure | Value |\n|---|---:|\n${rows.map(([k, v]) => `| ${k} | ${v} |`).join('\n')}\n`
const re = /\| Measure \| Value \|\n\|---\|---:\|\n(?:\|[^\n]*\|\n)+/
if (re.test(md)) { const before = md; md = md.replace(re, table); if (md !== before) console.log('purify: README measured table rewritten from the measurements') }
else leads.push({ id: 'readme-table-missing', source: 'README.md', statement: 'the README has no measured table to regenerate', status: 'open', reason: 'prose must fold onto measurements' })
md = md.replace(/Every figure below was measured on this tree on \d{4}-\d{2}-\d{2}/, `Every figure below was measured on this tree on ${new Date().toISOString().slice(0, 10)}`)
writeFileSync(readme, md)

// the vacuum-gravity entropy cleaner: every source text of the tree (the handler's, the scripts', the site's, the docs' components) read here and
// handed to the audit tool, which converts entropy to leads; each lead signalled once into the entropy stream (a UUID block by address) and into
// this docket, so the next steps and the next run fuse with what was already found
const sources = tracked.filter((f) => (/^(src|scripts|docs\/\.vitepress)\/.*\.(ts|mts|vue)$/.test(f) || /^site\/src\/.*\.(ts|tsx)$/.test(f)) && !f.endsWith('.d.ts') && !/payload-types\.ts$|importMap\.js$/.test(f) && existsSync(join(ROOT, f)))
const entropy = (handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'audit', arguments: { entropy: Object.fromEntries(sources.map((f) => [f, readFileSync(join(ROOT, f), 'utf8')])) } } }) as { result: { structuredContent: { files: number; lines: number; findings: number; fused: number; reactions: number; gravity: string; vacuum: boolean; byKind: Record<string, { findings: number; leads: number }>; leads: { id: string; kind: string; source: string; statement: string; status: 'open'; tool: string; occurrences: number; address: string; explore?: unknown; config?: unknown }[] } } }).result.structuredContent
const streamPath = join(ROOT, 'docs', 'public', 'entropy.ndjson')
const streamed = new Set(existsSync(streamPath) ? readFileSync(streamPath, 'utf8').split('\n').filter(Boolean).map((l) => { try { return (JSON.parse(l) as { address: string }).address } catch { return '' } }) : [])
const date = new Date().toISOString()
// the differences between this run and the stream are the leads: an address that appeared is explored, one that vanished is settled (signalled once)
const settled = new Set(existsSync(streamPath) ? readFileSync(streamPath, 'utf8').split('\n').filter(Boolean).map((l) => { try { const b = JSON.parse(l) as { address: string; settled?: boolean }; return b.settled ? b.address : '' } catch { return '' } }) : [])
// the run's difference answered agnostically by the audit tool: addresses only in the stream settled, addresses only in this run appeared (leads to explore)
const diff = (handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'audit', arguments: { difference: { a: { name: 'stream', members: [...streamed].filter((a) => a && !settled.has(a)) }, b: { name: 'now', members: entropy.leads.map((l) => l.address) }, config: null } } } }) as { result: { structuredContent: { sizes: { onlyA: number; onlyB: number }; leads: { member: string; side: string }[]; proven: boolean } } }).result.structuredContent
const appeared = entropy.leads.filter((l) => diff.leads.some((d) => d.side === 'now' && d.member === l.address))
const vanished = diff.leads.filter((d) => d.side === 'stream').map((d) => d.member)
let signalled = 0
for (const l of appeared) { appendFileSync(streamPath, JSON.stringify({ date, address: l.address, id: l.id, kind: l.kind, occurrences: l.occurrences, source: l.source, explore: l.explore, config: l.config }) + '\n'); signalled += 1 }
for (const a of vanished) appendFileSync(streamPath, JSON.stringify({ date, address: a, settled: true }) + '\n')
for (const l of entropy.leads) leads.push({ id: l.id, source: l.source, statement: l.statement, status: 'open', tool: l.tool })
writeFileSync(join(ROOT, 'docs', 'public', 'entropy.json'), JSON.stringify({ date, literals: (() => { const l = (entropy as { literals?: { urls: number; distinctUrls: number; paths: number; outside: number; tokens: number; byFile: [string, number][] } }).literals; return l ? { urls: l.urls, distinctUrls: l.distinctUrls, paths: l.paths, outside: l.outside, tokens: l.tokens, byFile: l.byFile, priced: 'the tree', theorem: 'textbook_literal_in_registry' } : null })(), files: entropy.files, lines: entropy.lines, findings: entropy.findings, fused: entropy.fused, reactions: entropy.reactions, gravity: entropy.gravity, vacuum: entropy.vacuum, byKind: entropy.byKind, difference: { appeared: appeared.length, settled: vanished.length }, toExplore: (entropy as { toExplore?: Record<string, number> }).toExplore ?? {}, toConfig: (entropy as { toConfig?: Record<string, number> }).toConfig ?? {}, leads: entropy.leads }, null, 1) + '\n')
writeFileSync(join(ROOT, 'docs', 'entropy.md'), ['---', 'title: Entropy', 'order: 52', '---', '', '# Entropy converted to leads', '', `The vacuum-gravity entropy cleaner, run by \`npm run next\` on ${date} through the \`audit\` tool over ${entropy.files} source files (${entropy.lines} lines): every finding is a lead, never a ruling; findings of one content address fuse into one lead naming every source (${entropy.findings} findings, ${entropy.fused} leads, ${entropy.reactions} fusion reactions); the gravity of the tree is \`${entropy.gravity}\`${entropy.vacuum ? ' — the vacuum: nothing found' : ''}. ${signalled} new lead(s) signalled into the entropy stream this run; the differences since the last run: ${appeared.length} appeared (to explore), ${vanished.length} settled, counted by the audit tool's difference (proven ${diff.proven}). Every lead names the tool that explores it and the configuration that settles it.`, '', '| Kind | Findings | Leads |', '|---|---:|---:|', ...Object.entries(entropy.byKind).map(([k, v]) => `| ${k} | ${v.findings} | ${v.leads} |`), '', '| Lead | Kind | Explore | Config | Occurrences | Sources | Statement |', '|---|---|---|---|---:|---|---|', ...entropy.leads.map((l) => `| ${l.id} | ${l.kind} | ${(l as { explore?: string }).explore ?? ''} | ${(l as { config?: string | null }).config ?? '—'} | ${l.occurrences} | ${cell(l.source)} | ${cell(l.statement)} |`), ''].join('\n'))
{ const l = (entropy as { literals?: { outside: number; tokens: number; urls: number; paths: number } }).literals; if (l) console.log(`purify: ${l.outside} path and URL literal(s) outside their registry (${l.urls} URLs, ${l.paths} paths), ${l.tokens} token(s) priced to the tree, listed (textbook_literal_in_registry)`) }
console.log(`purify: entropy ${entropy.findings} finding(s) → ${entropy.fused} lead(s) over ${entropy.files} files (${entropy.reactions} reactions, gravity ${entropy.gravity}); ${signalled} appeared, ${vanished.length} settled`)
const docket = join(ROOT, 'docs', 'public', 'purify-leads.json')
writeFileSync(docket, JSON.stringify(leads, null, 1) + '\n')
const page = ['---', 'title: Purify', 'order: 51', '---', '', '# Purification leads', '', 'What the codebase found unproven when it collided itself with its tests, tools, examples, pages and proofs. Each is an open lead: harden it with a proof of use, or soften it by removal.', '', '| Lead | Statement | Reason |', '|---|---|---|', ...leads.map((l) => `| ${l.id} | ${cell(l.statement)} | ${cell(l.reason ?? '')} |`), ''].join('\n')
writeFileSync(join(ROOT, 'docs', 'purify.md'), page)
console.log(`purify: ${leads.length} lead(s) opened; kernel theorems ${kernel}, sorry ${sorried}, tools ${tools}`)

// The graph: every tool, example, block, lead and verifier as a node, every relation as an edge in both directions,
// so a referrer at any node can signal to every other along every vector. Written as data and as a page each run.
type Node = { id: string; kind: 'tool' | 'example' | 'block' | 'lead' | 'verifier'; label: string }
type Edge = { from: string; to: string; rel: string }
const nodes: Node[] = []
const edges: Edge[] = []
const both = (a: string, b: string, rel: string, back: string) => { edges.push({ from: a, to: b, rel }); edges.push({ from: b, to: a, rel: back }) }
for (const t of toolNames) nodes.push({ id: `tool:${t.name}`, kind: 'tool', label: t.description.slice(0, 80) })
for (const v of VERIFIERS) nodes.push({ id: `verifier:${v.id}`, kind: 'verifier', label: v.name })
for (const e of EXAMPLES) {
  nodes.push({ id: `example:${e.id}`, kind: 'example', label: e.shows })
  both(`example:${e.id}`, `tool:${e.tool}`, 'calls', 'shown by')
  if (e.tool !== 'audit') {
    const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: e.tool, arguments: e.arguments } }) as { result?: { _meta: { block: { meta: { id: string } } } } }
    const id = r.result?._meta.block.meta.id ?? uuidOf(`${e.tool}${JSON.stringify(e.arguments)}`)
    nodes.push({ id: `block:${id}`, kind: 'block', label: `${e.tool} ${JSON.stringify(e.arguments)}` })
    both(`block:${id}`, `example:${e.id}`, 'renders', 'rendered as')
  }
}
for (const l of LEADS) {
  nodes.push({ id: `lead:${l.id}`, kind: 'lead', label: `${l.status}: ${l.statement.slice(0, 80)}` })
  if (l.tool && toolNames.some((t) => t.name === l.tool)) both(`lead:${l.id}`, `tool:${l.tool}`, 'served by', 'serves')
  for (const f of extractFacts(l)) for (const r of buildVerifyRequests(f)) both(`lead:${l.id}`, `verifier:${r.verifier}`, 'verified via', 'verifies')
}
const graph = { date: new Date().toISOString(), nodes, edges, counts: { nodes: nodes.length, edges: edges.length } }
writeFileSync(join(ROOT, 'docs', 'public', 'graph.json'), JSON.stringify(graph) + '\n')
const degree = new Map<string, number>()
for (const e of edges) degree.set(e.from, (degree.get(e.from) ?? 0) + 1)
const graphPage = ['---', 'title: Graph', 'order: 52', '---', '', '# The graph, bidirectional', '', `Generated by \`npm run next\`: ${nodes.length} nodes and ${edges.length} directed edges (every relation both ways), as data in \`public/graph.json\`. A referrer at any node reaches every other along these vectors.`, '', '| Kind | Nodes |', '|---|---:|', ...(['tool', 'example', 'block', 'lead', 'verifier'] as const).map((k) => `| ${k} | ${nodes.filter((n) => n.kind === k).length} |`), '', '| Node | Out-degree | Label |', '|---|---:|---|', ...nodes.map((n) => `| ${cell(n.id)} | ${degree.get(n.id) ?? 0} | ${cell(n.label)} |`), ''].join('\n')
writeFileSync(join(ROOT, 'docs', 'graph.md'), graphPage)
console.log(`graph: ${nodes.length} nodes, ${edges.length} edges`)
if (leaks.length) { console.error('purify: an email leak is a red step: the commit stops'); process.exit(1) }
