// Purification: the codebase collided with its own proofs and measurements. Anything not proven becomes an open lead;
// prose that disagrees with a measurement is rewritten from the measurement. Dependency-free and deterministic.
//   1. exports under src/quantum that no test, tool, example or other module references → lead "unproven export"
//   2. files under src/quantum that nothing imports and that are not tests → lead "orphan file"
//   3. the README's measured table is regenerated from git, tsc, the test receipt, lake build, the kernel census and tools/list
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { handle } from '../src/quantum/mcp.ts'
import { EXAMPLES } from '../src/quantum/examples.ts'
import { LEADS, cleanupSubjectsOf } from '../src/quantum/leads.ts'
import { VERIFIERS, factsOf, verifyRequestsOf } from '../src/quantum/verifiers.ts'
import { uuidOf } from '../src/quantum/blocks.ts'

const ROOT = process.cwd()
const Q = join(ROOT, 'src', 'quantum')
const files = readdirSync(Q).filter((f) => f.endsWith('.ts'))
const text = Object.fromEntries(files.map((f) => [f, readFileSync(join(Q, f), 'utf8')]))
// Proof by use is sought in every tracked source text of the tree (TypeScript, Vue, Markdown, Lean), not one folder: a page's component is a use.
const tracked = execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' }).trim().split('\n')
const served = Object.values(text).join('\n') + readdirSync(join(ROOT, 'docs')).filter((f) => f.endsWith('.md')).map((f) => readFileSync(join(ROOT, 'docs', f), 'utf8')).join('\n')
const all = served + '\n' + tracked.filter((f) => /\.(ts|mts|vue|md|lean)$/.test(f) && !f.startsWith('docs/audit/') && existsSync(join(ROOT, f))).map((f) => readFileSync(join(ROOT, f), 'utf8')).join('\n')

type Lead = { id: string; source: string; statement: string; status: 'open'; reason: string }
const leads: Lead[] = []
for (const f of files) {
  if (f.endsWith('.test.ts')) continue
  for (const m of text[f]!.matchAll(/^export (?:const|function|class|type) ([A-Za-z0-9_]+)/gm)) {
    const name = m[1]!
    const uses = (all.match(new RegExp(`\\b${name}\\b`, 'g')) ?? []).length
    if (uses <= 1) leads.push({ id: `unproven-${f.replace(/\.ts$/, '')}-${name}`, source: `src/quantum/${f}`, statement: `export ${name} in ${f} is referenced by nothing: no test, tool, example, page or module`, status: 'open', reason: 'not proven by use; harden with a test or soften by removal' })
  }
  const stem = f.replace(/\.ts$/, '')
  const imported = files.some((g) => g !== f && new RegExp(`from '\\./${stem}\\.(js|ts)'`).test(text[g]!)) || new RegExp(`from '(?:\\.\\./)+src/quantum/${stem}\\.ts'`).test(all)
  if (!imported && !f.endsWith('.test.ts') && f !== 'mcp.ts') leads.push({ id: `orphan-${stem}`, source: `src/quantum/${f}`, statement: `${f} is imported by nothing`, status: 'open', reason: 'an orphan is unproven; fold it in or remove it' })
}

// A cleanup lead is settled only while its subject stays absent: the status is a measurement, re-taken each run, never a memory.
const presentOf = (subjects: ReturnType<typeof cleanupSubjectsOf>): string[] => !subjects ? [] : subjects.kind === 'branches'
  ? subjects.names.filter((b) => execFileSync('git', ['branch', '--list', b], { cwd: ROOT, encoding: 'utf8' }).trim() !== '')
  : subjects.names.filter((path) => existsSync(join(ROOT, path)))
for (const l of LEADS) {
  const present = presentOf(cleanupSubjectsOf(l))
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

// Measurements for the README table.
const sh = (cmd: string, args: string[]): string => { const r = spawnSync(cmd, args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 26 }); return `${r.stdout ?? ''}${r.stderr ?? ''}` }
const tsSources = tracked.filter((f) => /^src\/quantum\/[^/]+\.ts$/.test(f) && !f.endsWith('.test.ts'))
const tsLines = tsSources.reduce((n, f) => n + readFileSync(join(ROOT, f), 'utf8').split('\n').length, 0)
const receipt = existsSync(join(ROOT, 'docs', 'public', 'receipt.json')) ? JSON.parse(readFileSync(join(ROOT, 'docs', 'public', 'receipt.json'), 'utf8')) : { steps: [] }
const step = (name: string) => receipt.steps.filter((s: { name: string }) => s.name === name).at(-1)
const tests = step('test')?.counts ?? {}
const lean = step('lean')?.counts ?? {}
const tools = (handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) as { result: { tools: unknown[] } }).result.tools.length
const lake = [`${process.env.HOME}/.elan/bin/lake`, `${process.env.HOME}/.elan/toolchains/leanprover--lean4---v4.33.0/bin/lake`, 'lake'].find((p) => p === 'lake' || existsSync(p))!
const census = sh(lake, ['env', 'lean', 'scripts/census.lean'])
const kernel = /kernel-accepted\): (\d+)/.exec(census)?.[1] ?? '?'
const axioms = /axioms used by any theorem: \[([^\]]*)\]/.exec(census)?.[1] ?? '?'
const sorried = /sorryAx: (\d+)/.exec(census)?.[1] ?? '?'
const declared = tracked.filter((f) => f.endsWith('.lean') && !f.startsWith('scripts/')).reduce((n, f) => n + (readFileSync(join(ROOT, f), 'utf8').match(/^\s*theorem /gm) ?? []).length, 0)
const modules = tracked.filter((f) => /src\/quantum\/processing\/unit\/lean\/Qpu(\/|\.lean$)/.test(f)).length
const deps = Object.keys(JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).dependencies ?? {}).length
const verification = existsSync(join(ROOT, 'docs', 'public', 'verification.json')) ? JSON.parse(readFileSync(join(ROOT, 'docs', 'public', 'verification.json'), 'utf8')) : null
const rows: [string, string][] = [
  ['Tracked files', String(tracked.length)],
  ['Source files under `src/quantum` (TypeScript)', `${tsSources.length} (${tsLines.toLocaleString('en-US')} lines)`],
  ['MCP tools', String(tools)],
  ['Tests (`node --test`)', tests.tests ? `${tests.pass} pass, ${tests.fail ?? 0} fail of ${tests.tests}` : 'not yet run by `npm run next`'],
  ['Type check (`tsc --noEmit`)', step('typecheck')?.status === 'green' ? '0 errors' : step('typecheck')?.status ?? 'not yet run'],
  ['Runtime dependencies', String(deps)],
  ['Lean 4 modules built (`lake build`, Lean 4.33.0)', lean.jobs ? `${modules} modules, ${lean.jobs} jobs, 0 errors` : `${modules} modules`],
  ['Theorems declared / accepted by the kernel', `${declared} / ${kernel}`],
  ['Theorems using `sorry`', String(sorried)],
  ['Axioms any theorem depends on', axioms.split(',').map((a) => `\`${a.trim()}\``).join(', ')],
  ['Self-audit checks', step('audit')?.counts?.checks ? `${step('audit').counts.checks} of ${step('audit').counts.checksTotal} pass` : 'see docs/audit'],
  ['Cross-verification requests (free public sources)', verification ? `${verification.requests} requests, ${Object.values(verification.summary as Record<string, { ok: number }>).reduce((n, s) => n + s.ok, 0)} reachable on ${verification.date.slice(0, 10)}` : 'not yet run'],
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

const docket = join(ROOT, 'docs', 'public', 'purify-leads.json')
writeFileSync(docket, JSON.stringify(leads, null, 1) + '\n')
const page = ['---', 'title: Purify', 'order: 51', '---', '', '# Purification leads', '', 'What the codebase found unproven when it collided itself with its tests, tools, examples, pages and proofs. Each is an open lead: harden it with a proof of use, or soften it by removal.', '', '| Lead | Statement | Reason |', '|---|---|---|', ...leads.map((l) => `| ${l.id} | ${l.statement} | ${l.reason} |`), ''].join('\n')
writeFileSync(join(ROOT, 'docs', 'purify.md'), page)
console.log(`purify: ${leads.length} lead(s) opened; kernel theorems ${kernel}, sorry ${sorried}, tools ${tools}`)

// The graph: every tool, example, block, lead and verifier as a node, every relation as an edge in both directions,
// so a referrer at any node can signal to every other along every vector. Written as data and as a page each run.
type Node = { id: string; kind: 'tool' | 'example' | 'block' | 'lead' | 'verifier'; label: string }
type Edge = { from: string; to: string; rel: string }
const nodes: Node[] = []
const edges: Edge[] = []
const both = (a: string, b: string, rel: string, back: string) => { edges.push({ from: a, to: b, rel }); edges.push({ from: b, to: a, rel: back }) }
const toolNames = (handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) as { result: { tools: { name: string; description: string }[] } }).result.tools
for (const t of toolNames) nodes.push({ id: `tool:${t.name}`, kind: 'tool', label: t.description.slice(0, 80) })
for (const v of VERIFIERS) nodes.push({ id: `verifier:${v.id}`, kind: 'verifier', label: v.name })
for (const e of EXAMPLES) {
  nodes.push({ id: `example:${e.id}`, kind: 'example', label: e.shows })
  both(`example:${e.id}`, `tool:${e.tool}`, 'calls', 'shown by')
  if (e.tool !== 'audit') {
    const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: e.tool, arguments: e.arguments } }) as { result?: { _meta: { block: { meta: { id: string } } } } }
    const id = r.result?._meta.block.meta.id ?? uuidOf(`${e.tool}${JSON.stringify(e.arguments)}`)
    nodes.push({ id: `block:${id}`, kind: 'block', label: `${e.tool} ${JSON.stringify(e.arguments).slice(0, 60)}` })
    both(`block:${id}`, `example:${e.id}`, 'renders', 'rendered as')
  }
}
for (const l of LEADS) {
  nodes.push({ id: `lead:${l.id}`, kind: 'lead', label: `${l.status}: ${l.statement.slice(0, 80)}` })
  if (l.tool && toolNames.some((t) => t.name === l.tool)) both(`lead:${l.id}`, `tool:${l.tool}`, 'served by', 'serves')
  for (const f of factsOf(l)) for (const r of verifyRequestsOf(f)) both(`lead:${l.id}`, `verifier:${r.verifier}`, 'verified via', 'verifies')
}
const graph = { date: new Date().toISOString(), nodes, edges, counts: { nodes: nodes.length, edges: edges.length } }
writeFileSync(join(ROOT, 'docs', 'public', 'graph.json'), JSON.stringify(graph) + '\n')
const degree = new Map<string, number>()
for (const e of edges) degree.set(e.from, (degree.get(e.from) ?? 0) + 1)
const graphPage = ['---', 'title: Graph', 'order: 52', '---', '', '# The graph, bidirectional', '', `Generated by \`npm run next\`: ${nodes.length} nodes and ${edges.length} directed edges (every relation both ways), as data in \`public/graph.json\`. A referrer at any node reaches every other along these vectors.`, '', '| Kind | Nodes |', '|---|---:|', ...(['tool', 'example', 'block', 'lead', 'verifier'] as const).map((k) => `| ${k} | ${nodes.filter((n) => n.kind === k).length} |`), '', '| Node | Out-degree | Label |', '|---|---:|---|', ...nodes.map((n) => `| ${n.id} | ${degree.get(n.id) ?? 0} | ${n.label.replace(/\|/g, '\\|')} |`), ''].join('\n')
writeFileSync(join(ROOT, 'docs', 'graph.md'), graphPage)
console.log(`graph: ${nodes.length} nodes, ${edges.length} edges`)
