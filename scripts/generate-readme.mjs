#!/usr/bin/env node
/**
 * README = the final build receipt.
 *
 * Every committed *-receipt.json is a node; every row of test-receipt.json is a node under it. Each node is a quantum
 * receipt minted by the unit's own qpuUuidReceiptOf: its UUID is the content address of its payload and its referrer,
 * and its referrer is its parent, so the README's UUID is accountable to every receipt beneath it. All nodes share
 * the `build` stream, so they are also chained in order; qpuReceiptStreamsOf replays that chain and reports holds.
 *
 * The receipt bytes alone give the UUIDs — nothing depends on the git commit, so committing the tree never moves
 * them; a UUID moves only when a reading does. `--check` exits 1 when README.md differs from what the receipts give.
 */
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { qpuCiteOf, qpuContentUuidOf, qpuUuidReceiptOf, qpuReceiptStreamsOf } from '../dist/quantum/processing/unit/index.js'
import { qpuAnalyticsOf, qpuPublicOf } from '../dist/quantum/processing/unit/zeropage.js'
import { reactorStatsOf } from '../dist/families/reactor/index.js'
import { clayOf, wingOf } from '../dist/core/showcase.js'
import { mintOf, vertices } from './lattice-values.mjs'
// every family and door registers on import, as on the host, so the summary counts what clients reach
await import('../dist/mcp/families.js')
const { qpuMcpDoorsOf, qpuMcpToolsListOf } = await import('../dist/quantum/processing/unit/index.js')

// the MCP resource surface, counted the way a client reaches it (resources/list + templates), not a hand list
const { publicMcpOf } = await import('../dist/payload/plugins/public.js')
const mcpRpc = async (method, params) =>
  (await publicMcpOf(new Request('https://qpu.uuidna.com/mcp', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }) }), {})).json()
const mcpListLen = async (scope) => {
  let len = 0, cursor, pages = 0
  do {
    const list = (await mcpRpc('resources/list', { ...(scope ? { scope } : {}), ...(cursor ? { cursor } : {}) })).result
    len += list.resources.length
    cursor = list.nextCursor
    pages += 1
  } while (cursor && pages < 5000)
  return len
}
const mcpCore = await mcpListLen()
const mcpAll = await mcpListLen('all')
const mcpTemplates = await (async () => {
  let len = 0, cursor, pages = 0
  do {
    const list = (await mcpRpc('resources/templates/list', cursor ? { cursor } : {})).result
    len += (list.resourceTemplates ?? []).length
    cursor = list.nextCursor
    pages += 1
  } while (cursor && pages < 5000)
  return len
})()

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const git = (cmd) => execSync(`git ${cmd}`, { cwd: ROOT }).toString().trim()
const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'))

const pkg = read('package.json')

/** The scalar facts of a receipt file — numbers, booleans and short strings at its top level. */
const summaryOf = (doc) =>
  Object.fromEntries(
    Object.entries(doc).filter(([, v]) => typeof v === 'number' || typeof v === 'boolean' || (typeof v === 'string' && v.length <= mintOf(6))),
  )

const nodes = []
const node = (name, payload, value, referrer, parent) => {
  const r = qpuUuidReceiptOf(name, qpuContentUuidOf(payload), value, referrer)
  nodes.push({ ...r, parent })
  return r
}

// the build root is seeded by the version alone, never the git commit: a receipt is a reading, and committing the
// tree is not one — so a UUID moves only when a receipt's bytes move, and the README never drifts on a commit
const root = node('build root', { version: pkg.version }, { version: pkg.version }, 'build')
const files = git('ls-files "*-receipt.json"').split('\n').filter(Boolean).sort()
const tops = []
for (const file of files) {
  const doc = read(file)
  const blob = git(`hash-object ${file}`)
  const top = node(`build ${file}`, doc, { file, blob, ...summaryOf(doc) }, root.uuid, root.uuid)
  tops.push(top)
  if (Array.isArray(doc.rows)) {
    doc.rows.forEach((row, i) =>
      node(
        `build ${file}#${i}`,
        row,
        { name: row.name, pass: row.pass, computations: row.computations, receipt: row.receipt, mint: row.mint?.chain },
        top.uuid,
        top.uuid,
      ),
    )
  }
}
const final = node('build readme', { children: tops.map((t) => t.uuid) }, { files: files.length, nodes: nodes.length }, root.uuid, root.uuid)
const stream = qpuReceiptStreamsOf(nodes.length).streams.find((s) => s.stream === 'build')

const short = (u) => u.slice(0, vertices)
const label = (n) => n.name.replace(/^build /, '').replace(/"/g, "'")
// the build tree has one node per receipt file and one per receipt row — thousands; a flowchart of all of them does
// not render on GitHub and rewrites itself every run (each uuid moves with its bytes). The diagram draws the structure
// only — the build root, one node per receipt file with how many row-nodes hang beneath it, and the final receipt —
// and the table below lists every node.
const childCount = (uuid) => nodes.filter((n) => n.parent === uuid).length
const structural = nodes.filter((n) => !n.parent || n.parent === root.uuid)
const graph = [
  'flowchart TD',
  ...structural.map((n) => { const k = n.parent ? childCount(n.uuid) : 0; return `  n${short(n.uuid)}["${label(n)}${k ? `<br/>${k} rows` : ''}<br/><code>${short(n.uuid)}</code>"]` }),
  ...structural.filter((n) => n.parent).map((n) => `  n${short(n.parent)} --> n${short(n.uuid)}`),
].join('\n')

const cell = (v) => String(v ?? '').replace(/\|/g, '\\|')

// what the unit does, read from the docs it generates: a page is a wing when it carries the statistics table
// the wings are the pages docs/README.md links to
const wings = [...new Set([...fs.readFileSync(path.join(ROOT, 'docs', 'README.md'), 'utf8').matchAll(/\]\(([\w-]+)\.md\)/g)].map((m) => m[1]))]
  .filter((slug) => fs.existsSync(path.join(ROOT, 'docs', `${slug}.md`)))
  .map((slug) => wingOf(slug, fs.readFileSync(path.join(ROOT, 'docs', `${slug}.md`), 'utf8'))).filter(Boolean)
const labels = [...new Set(wings.flatMap((w) => w.stats.map((s) => s.label)))]
const wingTable = [
  `| Wing | ${labels.join(' | ')} |`,
  `|---|${labels.map(() => '---:').join('|')}|`,
  ...wings.map((w) => `| [${cell(w.title)}](https://qpu.uuidna.com/${w.slug}) | ${labels.map((l) => cell(w.stats.find((s) => s.label === l)?.value ?? '')).join(' | ')} |`),
].join('\n')
const clay = clayOf()
/** CLAIMED rows are the programmatic clay.* seals (CLAY_SEALS). Poincaré is not claimable here. */
const CLAIMED_SEAL = {
  'P vs NP': 'clay.pVsNp',
  'Hodge Conjecture': 'clay.hodge',
  'Riemann Hypothesis': 'clay.riemann',
  'Yang-Mills and Mass Gap': 'clay.yangMills',
  'Navier-Stokes Existence and Smoothness': 'clay.navierStokes',
  'Birch and Swinnerton-Dyer Conjecture': 'clay.bsd',
}
const clayTable = [
  '| Problem | Attribution | Seal name in tree |',
  '|---|---|---|',
  ...clay.map((p) => `| ${cell(p.name)} | ${p.status === 'CLAIMED' ? `Tsvetan Rouschev ([document](${p.source}))` : `named for ${p.solver ?? 'Perelman'}${p.year ? ` (${p.year})` : ''}; not a clay.* seal; not an Institute award in this tree`} | ${cell(p.status === 'CLAIMED' ? (CLAIMED_SEAL[p.name] ?? '—') : '—')} |`),
].join('\n')

const rowsOf = () =>
  nodes.map((n) => `| ${cell(label(n))} | \`${n.uuid}\` | \`${short(n.referrer.replace(/^git:/, ''))}\` | \`${n.fold}\` | ${n.seq} |`)

// AT A GLANCE: what QPU does, how much of it, and what each number is compared with — every figure read from a committed
// receipt or from the unit's own registries, so the summary cannot claim more than the receipts hold. The same text
// is the GitHub Release's notes (RELEASE.md) and the top of the npm page.
const receiptOf = (f) => (fs.existsSync(path.join(ROOT, f)) ? read(f) : {})
const lean = receiptOf('lean-receipt.json'), formulas = receiptOf('formulas-receipt.json'), fuse = receiptOf('fuse-receipt.json')
const discovery = receiptOf('discovery-receipt.json'), heat = receiptOf('heat-receipt.json'), payloadCf = receiptOf('payload-cf-receipt.json'), cross = receiptOf('cross-receipt.json'), apis = receiptOf('api-receipt.json')
const doors = qpuMcpDoorsOf()
const listed = qpuMcpToolsListOf().length
const num = (x) => (typeof x === 'number' ? x.toLocaleString('en') : String(x ?? '—'))
// THE FULL FAMILY CATALOG, the main lead a reader develops: every registered family and how many formulas it carries,
// read from the live registry (qpuMcpDoorsOf), not a hand-kept list. The glance counts the Lean families discovery runs;
// this is the whole registered set, so a reader sees the breadth — every family a hex-program UUID crossing to another
// (the cross formulations), each holding when its formulas recompute at their addresses (the cross-formula rows).
const famCounts = (() => { const by = new Map(); for (const fm of doors.formulas) { const k = fm.name.split('.')[0]; by.set(k, (by.get(k) ?? 0) + 1) } return [...by.entries()].sort((a, b) => a[0].localeCompare(b[0])) })()
const familiesTable = [
  `${num(famCounts.length)} families carry ${num(doors.formulas.length)} formulas, every one a hex-program UUID (RFC 9562) that crosses to another family — the cross formulations. A family holds when each of its formulas recomputes at its address; ${num(formulas.pass)} of ${num(formulas.rowsTotal)} cross-formula rows hold (${num(formulas.hexAgrees)} agree with their hex programs).`,
  '',
  '| Family | Formulas | Family | Formulas | Family | Formulas |',
  '|---|---:|---|---:|---|---:|',
  ...Array.from({ length: Math.ceil(famCounts.length / 3) }, (_, r) => `| ${[0, 1, 2].map((c) => famCounts[r * 3 + c]).map((e) => (e ? `\`${cell(e[0])}\` | ${num(e[1])}` : ' | ')).join(' | ')} |`),
].join('\n')
const glance = [
  '| Capability | How much | Compared with |',
  '|---|---|---|',
  `| MCP door (https://qpu.uuidna.com/mcp) | ${listed} listed tools; through any of them ${num(doors.doors.length)} doors and ${num(doors.formulas.length)} formulas (\`{ doors: true }\`, \`{ door }\`, \`{ hex }\`, \`{ errors: true }\`) | the Model Context Protocol: \`tools/list\` sealed by the Lean theorem agents_mcp_tools |`,
  `| MCP resources | ${num(mcpCore)} core resources by default — the quantum computer (its proof, Clay solutions, hex catalogue, schema, hooks, receipts, paper); \`{ scope: 'all' }\` reaches ${num(mcpAll)}, \`{ scope: family }\` a scoped set, over ${num(mcpTemplates)} \`qpu://…\` templates (each lean theorem and hex program a UUID) | the Model Context Protocol \`resources/list\` + \`resources/read\` |`,
  `| Formal proof | ${num(lean.theorems)} Lean theorems served, ${num(lean.recomputed)} recomputed in TypeScript | the Lean 4 kernel (${lean.toolchain ?? 'toolchain'}) |`,
  `| Formula families | ${num(discovery.families)} families run as hex-program UUIDs (RFC 9562 v8); ${num(discovery.runs)} programs in the last discovery | each other: ${num(discovery.relationsTotal)} values reached by two or more families, ${num(discovery.seals)} seals (fixed points, involutions) |`,
  `| Live public data | ${num(discovery.sourcesAgree)} of ${num(discovery.sources)} sources agree | CERN Open Data, NIST CODATA, OEIS (${num(discovery.sequences)} formulas identified as sequences), Zenodo, DataCite, ORCID, GitHub, npm, INSPIRE catalogues |`,
  `| Public APIs | ${num(fuse.reached)} of ${num(fuse.listed)} APIs walked live, ${num(fuse.methods)} methods, ${num(fuse.edges)} cross formulas; ${num(apis.fused)} fused and ${num(apis.used)} used as hex addresses api.call(i, j, s) | the APIs.guru registry, against the Lean theorem fuse |`,
  `| Cross formulas | ${num(formulas.pass)} of ${num(formulas.rowsTotal)} rows hold across ${num(formulas.formulas)} formulas | their own hex programs (${num(formulas.hexAgrees)} agree) |`,
  `| Cryptography | ${formulas.attacks ?? '—'} attacks resisted, no node:crypto | Node's crypto (parity), its own attacks |`,
  `| Live cross-proof | ${num(cross.agree)} of ${num(cross.of)} claims agree | the hosts the claims name |`,
  `| Payload on Cloudflare | ${num(payloadCf.combinations)} combinations generated; the site is one Worker | Payload's documented plugins and adapters |`,
  `| Code heat | ${num(heat.cold)} of ${num(heat.files)} files cold, ${num(heat.hot)} hot | Qpu.Physics: photon / thermal T |`,
].join('\n')
// PROOF BY MCP, ANALYTICS: every verdict in every committed receipt counted (pass, fail), the computations the tests
// folded, the gate's last verdicts; and NEXT: every failing row of every receipt, named with its value — the base for
// the next development is what the receipts say does not yet hold, not a plan written by hand
const test = receiptOf('test-receipt.json'), gate = receiptOf('gate-receipt.json'), nextR = receiptOf('next-receipt.json'), uses = receiptOf('uses-receipt.json'), clayR = receiptOf('clay-receipt.json')
const kinds = (test.rows ?? []).reduce((m, r) => { for (const [k, v] of Object.entries(r.kinds ?? {})) m[k] = (m[k] ?? 0) + v; return m }, {})
const computations = (test.rows ?? []).reduce((n, r) => n + (r.computations ?? 0), 0)
const verdicts = files.map((f) => ({ file: f, doc: read(f) })).filter(({ doc }) => Array.isArray(doc.rows) && doc.rows.some((r) => typeof r.pass === 'boolean'))
const analytics = [
  '| Receipt | Verdicts | Hold | Do not hold | Receipt uuid |',
  '|---|---:|---:|---:|---|',
  ...verdicts.map(({ file, doc }) => `| ${file.replace(/-receipt\.json$/, '')} | ${num(doc.rows.length)} | ${num(doc.rows.filter((r) => r.pass === true).length)} | ${num(doc.rows.filter((r) => r.pass === false).length)} | \`${doc.receipt ?? doc.uuid ?? doc.stream?.chain ?? '—'}\` |`),
].join('\n')
const kindsLine = Object.entries(kinds).sort((a, b) => b[1] - a[1]).slice(0, vertices).map(([k, v]) => `${k} ${num(v)}`).join(', ')
const next = verdicts.filter(({ file }) => file !== 'next-receipt.json').flatMap(({ file, doc }) => doc.rows.filter((r) => r.pass === false).map((r) => `- ${file.replace(/-receipt\.json$/, '')}: ${cell(r.name)}${r.value !== undefined ? ` — ${cell(String(r.value).slice(0, 160))}` : ''}`))
// the combinations the MCP discovered in the public record that no test yet drives, or that a referrer perspective
// does not close: what the next tests are
const discovered = (nextR.rows ?? []).filter((r) => r.pass === false).map((r) => `- ${cell(r.name)} — ${cell(String(r.value).slice(0, 200))}`)
const usesTable = [
  '| World (registry category) | What QPU may be there: the families its APIs name |',
  '|---|---|',
  ...(uses.rows ?? []).map((r) => `| ${cell(r.name)} | ${cell(String(r.value).replace(/^\d+ APIs read · [^:]*: /, '').slice(0, 300))} |`),
].join('\n')
// The white-paper section bodies, each a pure function of the receipts (no prose claims beyond what the figures state).
const verification = `Every figure in this paper is read from a receipt a run of the unit wrote; no figure is typed. The tests call the
unit through its own \`tools/call\` (\`{ hex }\` addresses, the live host for the release tests), the gate is the \`gate\`
family's formulas run through the MCP in-process, the API walk is the \`api\` family's addresses, the discovery is the
\`data\` family's. Each receipt below is a node of the final build receipt; its uuid moves with its bytes.

${analytics}

Tests: ${num(test.tests)} top-level, ${num(test.pass)} pass, ${num(test.fail)} fail; ${num(computations)} computations folded (${kindsLine || '—'}); ${num(test.dim)}-dimensional state, ${num(test.qubits)} qubits; test receipt \`${test.receipt ?? '—'}\`.
Gate: ${gate.mode ?? '—'} on ${gate.when ?? '—'}, ${gate.holds === undefined ? '—' : gate.holds ? 'holds' : 'does not hold'}${gate.rows?.length ? ` — ${gate.rows.map((r) => `${r.name.startsWith('gate.crossed') ? '~' : r.pass ? '✓' : '✗'} ${cell(r.name)} = ${cell(String(r.value).slice(0, 120))}`).join('; ')}` : ''}.`

const applications = `Imagined by the MCP, not claimed: for every category of the APIs.guru registry, \`data.imagine(c)\` reads that world's
APIs and crosses the words of their titles and operations with the words of every family's formulas; the families
reached are what the unit is for that world (${num(uses.reached)} of ${num(uses.categories)} categories reach a family; ${num(uses.toImagine)} name a family to imagine).
A request in words — a law firm, an auditor, a forensic expert — is imagined the same way by the cross formula
\`data { source: 'imagine', about }\` (\`data.imagine\` at its hex address). The chat answers any question from the
formula its words name: \`data { source: 'ask', about }\`.

${usesTable}`

const openProblems = `The base for the next development, discovered by the MCP: every family researched in the public record
(${num(nextR.researched)} of ${num(nextR.families)} families found APIs their formulas name, ${num(nextR.read)} read live), one discovery over every reading
(${num(nextR.liveInputs)} live inputs, ${num(nextR.relations)} superpositions — values reached by two or more families, ${num(nextR.live)} reached by a live reading),
each superposition run from every other way's referrer perspective (${num(nextR.invariant)} of ${num(nextR.perspectives)} perspectives answer the same value);
${num(nextR.tested)} are driven by a test and closed, ${num(nextR.untested)} are what the next tests drive${discovered.length ? ':' : '.'}

${discovered.join('\n')}

The leads (\`gate.crossed\`): formulas no relation with another family reaches and no dataset identifies, each given
every effort — OEIS at every small fixed slot, the Clay lens, the involuted perspective, the family's research — and
tagged by what crossed it or, failing all, by \`signal.detection(k)\`, the chance k checks would have caught a
manipulation; an unverified lead is developed before anything is removed or edited${(gate.leads ?? []).length ? ':' : ' — none.'}

${(gate.leads ?? []).map((l) => `- ${cell(l.formula)} — ${cell(l.tag)} (OEIS ${l.efforts?.oeis}, seal ${l.efforts?.seal}, involutes ${l.efforts?.involutes}, research ${l.efforts?.research}, APIs ${l.efforts?.apis} read${(l.apis ?? []).length ? `: ${cell(l.apis.join(', '))}` : ''}, rosetta ${l.efforts?.rosetta ?? '—'}, detection ${l.detection})`).join('\n')}

And every row of every other receipt that does not hold, as the receipt names it${next.length ? ':' : ' — none.'}

${next.join('\n')}`

const cite = qpuCiteOf()
const licenseHref = cite.links.edges.find((edge) => edge.to.endsWith('/license'))?.to ?? cite.links.edges.find((edge) => edge.from.endsWith('/license'))?.from ?? ''
const linkNews = cite.links.edges.map((edge) => `- ${edge.from} → ${edge.to}`).join('\n')
const clayRegister = qpuAnalyticsOf()
const reactorStats = reactorStatsOf(heat)
const clayRegisterTable = [
  '| Count | Integer |',
  '|---|---:|',
  ...['seed', 'coins', 'n', 'rays', 'clay', 'modulus', 'riemann', 'bsd', 'hodge', 'navierStokes', 'pVsNp', 'yangMills', 'hz', 'low', 'high', 'amplitudes', 'fused', 'next', 'plane'].map((key) => `| ${key} | ${num(clayRegister[key])} |`),
  `| zero | ${num(reactorStats.zero)} |`,
  `| temp | ${num(reactorStats.temp)} |`,
  `| time | ${num(reactorStats.time)} |`,
  `| heat | ${num(reactorStats.heat)} |`,
  `| cold | ${num(reactorStats.cold)} |`,
  `| coldFusion | ${num(reactorStats.coldFusion)} |`,
].join('\n')
const summary = `An exact quantum processing unit served over MCP at https://qpu.uuidna.com, with its site, admin and API on the
same host. Reads need no auth; storage writes need a Bearer token. Use it as an MCP server (\`{ "qpu": { "type": "http",
"url": "https://qpu.uuidna.com/mcp" } }\`), as a package (\`npm install @uuidna/qpu\`), or as a container.

${qpuPublicOf(clayRegister).lines.join('\n\n')}

Zero / temp / time / heat / cold-fusion from the tree: heat.identity kind heat${reactorStats.heatIdentity ? ` hex \`${reactorStats.heatIdentity}\`` : ''}; reactor.coldfusion → plasma.fusion of cooled signal (receipt heat when present). Holds ${reactorStats.holds}.

${clayRegisterTable}

${glance}

Cite: ${cite.author.last}, ${cite.author.first}. "qpu." doi:[${cite.doi}](${cite.identifier}). License: CC-BY-NC-ND-4.0
(commercial use by license: ${licenseHref}).

${linkNews}`

// Zenodo shows .zenodo.json's description as HTML: the same summary, its table as a table
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const inline = (t) => esc(t).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
const rowsHtml = glance.split('\n').filter((l) => l.startsWith('|') && !/^\|---/.test(l)).map((l, i) => `<tr>${l.slice(1, -1).split(' | ').map((c) => `<${i ? 'td' : 'th'}>${inline(c.trim())}</${i ? 'td' : 'th'}>`).join('')}</tr>`).join('')
const blocks = summary.split('\n\n')
const intro = blocks[0] ?? ''
const tail = blocks.slice(1).filter((block) => !block.startsWith('| Capability'))
const zenodoPath = path.join(ROOT, '.zenodo.json')
const zenodo = JSON.parse(fs.readFileSync(zenodoPath, 'utf8'))
zenodo.description = `<p>${inline(intro.replace(/\n/g, ' '))}</p><table>${rowsHtml}</table>${tail.map((t) => `<p>${inline(t.replace(/\n/g, ' '))}</p>`).join('')}`
// The version field names the published Zenodo archive. package.json's version is the git tag and is not copied here.
// SEO: the keywords, notes and language are generated, never hand-kept — every registered family and wing is a term a
// searcher might use, so the archive is found by what the unit actually is, read from the registry and the docs.
const famKeys = [...new Set(doors.formulas.map((f) => f.name.split('.')[0]))].sort()
zenodo.keywords = [...new Set([
  ...pkg.keywords,
  'quantum computing', 'quantum processing unit', 'Model Context Protocol', 'MCP server',
  'Lean 4', 'formal verification', 'theorem proving', 'hex-program UUID', 'RFC 9562', 'content addressing',
  "Shor's algorithm", 'quantum receipts', 'cross-formula', 'exact computation', 'recomputable',
  'Cloudflare Workers', 'Payload CMS', 'open data', 'OEIS',
  ...famKeys, ...wings.map((w) => w.slug),
])].filter(Boolean)
zenodo.notes = `${num(doors.formulas.length)} formulas across ${famKeys.length} families as hex-program UUIDs (RFC 9562 v8); ${num(lean.theorems)} Lean theorems recomputed in TypeScript; ${num(listed)} MCP tools over ${num(doors.doors.length)} doors; served, recomputable, at https://qpu.uuidna.com.`
zenodo.language = 'eng'
fs.writeFileSync(zenodoPath, JSON.stringify(zenodo, null, 2) + '\n')
// the site's SEO keywords, generated from the same metadata (families + their domains), for Metadata.keywords
const seoKeywords = zenodo.keywords
fs.writeFileSync(path.join(ROOT, 'src/seed/seo-keywords.ts'), `// Generated by scripts/generate-readme.mjs from .zenodo.json keywords (the family registry's domains) — regenerate, do not edit\nexport const SEO_KEYWORDS: string[] = ${JSON.stringify(seoKeywords)}\n`)

fs.writeFileSync(path.join(ROOT, 'RELEASE.md'), `${summary}\n\nEvery figure above is read from a committed receipt; the README carries the final build receipt that accounts for them.\n`)

// one generated line of the headline figures, for the abstract — read from the same receipts, never typed
const abstractLine = `This paper reports, entirely from machine receipts: ${num(lean.theorems)} Lean 4 theorems (${num(lean.recomputed)} recomputed in TypeScript), ${num(doors.formulas.length)} formulas across ${num(famCounts.length)} families addressed as hex-program UUIDs (RFC 9562 v8), ${num(listed)} MCP tools over ${num(doors.doors.length)} doors, and ${num(discovery.relationsTotal)} cross-family relations discovered over lattice and public data. Every figure is read from a committed quantum receipt; none is typed.`
const reactorLine = `Zero / temp / time / heat / cold-fusion from the tree: heat.identity kind heat${reactorStats.heatIdentity ? ` hex \`${reactorStats.heatIdentity}\`` : ''}; reactor.coldfusion → plasma.fusion of cooled signal (receipt heat when present). Holds ${reactorStats.holds}.`

// README = a white paper about the quantum computer, every section a pure function of the receipts (generated, not written).
const md = `# UUIDNA QPU — an exact, formally verified quantum processing unit served over MCP

*${cite.author.first} ${cite.author.last}* · v${pkg.version} · doi:[${cite.doi}](${cite.identifier}) · CC-BY-NC-ND-4.0 · https://qpu.uuidna.com

## Abstract

${intro}

${abstractLine}

## 1. Introduction

An exact quantum processing unit served over MCP at https://qpu.uuidna.com: integer state vectors, Lean-checked theorems,
formula families addressed by hex-program UUIDs, quantum receipts, its own cryptography, and live checks against public
data. The unit, its site, admin and API are one Worker; reads need no auth, storage writes need a Bearer token.

${qpuPublicOf(clayRegister).lines.join('\n\n')}

## 2. Architecture

The unit is a lattice of formula families; each formula is a hex-program UUID (RFC 9562) that recomputes exactly at its
address and crosses to other families. Each wing reports itself:

${wingTable}

### 2.1 Formula families

${familiesTable}

### 2.2 Lattice register

${reactorLine}

${clayRegisterTable}

## 3. Methods — formal verification and discovery

${verification}

## 4. Results

${glance}

## 5. Applications

${applications}

## 6. Clay Millennium Prize Problems

Author claim: "All Seven Clay Millennium Problems Sealed via Universal σ-Involution" (Rouschev, 2026,
doi:[10.5281/zenodo.21781602](https://doi.org/10.5281/zenodo.21781602)). A prize is a lead. \`qpuPublicOf().prize\` is false.
\`legal.citation\` for the naming-scheme statement holds false, lead true. Evidence in this tree is seal formula
hex / value / holds / next only — this section does not state problems solved or unsolved, and does not publish as solved.
Claimable programmatically = the ${num(Object.keys(CLAIMED_SEAL).length)} \`clay.*\` seals in CLAY_SEALS; Poincaré is named, not a seal formula.

${clayTable}

Seal-wave on the host (\`clay.pass\` / \`claySealWaveOf\`${clayR.when ? `, receipt ${clayR.when}` : ''}): each seal recomputes σ∘σ = id on its combinatorial domain; related formulas and OEIS lookups are discovery readings. Seals with holds true this run: ${num(clayR.sealsVerified)} of ${num(clayR.problems)}. Record: ${clayR.record ?? '—'}. Receipt \`${clayR.receipt ?? '—'}\`.

| Problem (formula) | Seal holds | Attribution | Involution, seal, related formulas, OEIS, address |
|---|---|---|---|
${(clayR.rows ?? []).map((r) => `| ${cell(r.name)} | ${r.pass ? 'holds' : 'does not hold'} | author document | ${cell(String(r.value).replace(/^seal: (holds|does not hold|VERIFIED|UNVERIFIED) \(/, '').replace(/\); claim:.*$/, '').slice(0, 400))} |`).join('\n')}

## 7. Open problems and next work

${openProblems}

## 8. Reproducibility — the build receipt

**Final build receipt** \`${final.uuid}\`

| | |
|---|---|
| git tag | v${pkg.version} |
| receipts | ${files.length} files, ${nodes.length} nodes |
| build stream | length ${stream?.length}, head \`${stream?.head}\`, chain \`${stream?.chain}\`, holds **${stream?.holds}** |

<details>
<summary>${nodes.length} receipts, chained in the build stream</summary>

Each node is a quantum receipt: its UUID is the RFC 9562 v8 content address of its payload fold and its referrer, and
its referrer is the node above it. Change any receipt's bytes and its node, its file's node, the build stream chain
and this final receipt move. Nothing here depends on the git commit, so committing the tree never moves a UUID — only a changed reading does.

\`\`\`mermaid
${graph}
\`\`\`

| node | receipt uuid | referrer | payload fold | seq |
|---|---|---|---|---|
${rowsOf().join('\n')}

</details>

## References

Cite: ${cite.author.last}, ${cite.author.first}. "qpu." doi:[${cite.doi}](${cite.identifier}). License: CC-BY-NC-ND-4.0
(commercial use by license: ${licenseHref}).

${linkNews}

Regenerate with \`npm run readme\` after \`npm run build\` and the receipt-producing runs; \`node scripts/generate-readme.mjs --check\`
compares. Documentation: [docs/README.md](docs/README.md). License: CC-BY-NC-ND-4.0.
`

const out = path.join(ROOT, 'README.md')
if (process.argv.includes('--check')) {
  const same = fs.existsSync(out) && fs.readFileSync(out, 'utf8') === md
  console.log(same ? `README.md matches ${final.uuid}` : `README.md differs from ${final.uuid}`)
  process.exit(same ? 0 : 1)
}
fs.writeFileSync(out, md)
console.log(JSON.stringify({ readme: final.uuid, nodes: nodes.length, stream: stream?.holds }))
