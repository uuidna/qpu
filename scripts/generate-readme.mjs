#!/usr/bin/env node
/**
 * README = the final build receipt.
 *
 * Every committed *-receipt.json is a node; every row of test-receipt.json is a node under it. Each node is a quantum
 * receipt minted by the unit's own qpuUuidReceiptOf: its UUID is the content address of its payload and its referrer,
 * and its referrer is its parent, so the README's UUID is accountable to every receipt beneath it. All nodes share
 * the `build` stream, so they are also chained in order; qpuReceiptStreamsOf replays that chain and reports holds.
 *
 * Same commit and same receipt bytes give the same UUIDs. `--check` exits 1 when README.md differs from what the
 * receipts give.
 */
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { qpuContentUuidOf, qpuUuidReceiptOf, qpuReceiptStreamsOf } from '../dist/quantum/processing/unit/index.js'
import { clayOf, wingOf } from '../dist/core/showcase.js'
// every family and door registers on import, as on the host, so the summary counts what clients reach
await import('../dist/mcp/families.js')
const { qpuMcpDoorsOf, qpuMcpToolsListOf } = await import('../dist/quantum/processing/unit/index.js')

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const git = (cmd) => execSync(`git ${cmd}`, { cwd: ROOT }).toString().trim()
const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'))

const pkg = read('package.json')
// the last commit that changed anything but the README: the receipt cannot contain the commit that carries it
const commit = git('log -1 --format=%H -- . ":!README.md"')
const dirty = git('status --porcelain -- . ":!README.md"').length > 0

/** The scalar facts of a receipt file — numbers, booleans and short strings at its top level. */
const summaryOf = (doc) =>
  Object.fromEntries(
    Object.entries(doc).filter(([, v]) => typeof v === 'number' || typeof v === 'boolean' || (typeof v === 'string' && v.length <= 64)),
  )

const nodes = []
const node = (name, payload, value, referrer, parent) => {
  const r = qpuUuidReceiptOf(name, qpuContentUuidOf(payload), value, referrer)
  nodes.push({ ...r, parent })
  return r
}

const root = node('build root', { commit, version: pkg.version }, { commit, version: pkg.version, dirty }, `git:${commit}`)
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

const short = (u) => u.slice(0, 8)
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
const clayTable = [
  '| Problem | Status | The claim |',
  '|---|---|---|',
  ...clay.map((p) => `| ${cell(p.name)} | ${p.status === 'CLAIMED' ? `claimed by ${p.claimedBy} ([the document](${p.source})) — UNVERIFIED` : `solved${p.solver ? ` (${p.solver}${p.year ? `, ${p.year}` : ''})` : ''}`} | ${cell(p.claim ?? '')} |`),
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
const glance = [
  '| Capability | How much | Compared with |',
  '|---|---|---|',
  `| MCP door (https://qpu.uuidna.com/mcp) | ${listed} listed tools; through any of them ${num(doors.doors.length)} doors and ${num(doors.formulas.length)} formulas (\`{ doors: true }\`, \`{ door }\`, \`{ hex }\`, \`{ errors: true }\`) | the Model Context Protocol: \`tools/list\` sealed by the Lean theorem agents_mcp_tools |`,
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
const kindsLine = Object.entries(kinds).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `${k} ${num(v)}`).join(', ')
const next = verdicts.filter(({ file }) => file !== 'next-receipt.json').flatMap(({ file, doc }) => doc.rows.filter((r) => r.pass === false).map((r) => `- ${file.replace(/-receipt\.json$/, '')}: ${cell(r.name)}${r.value !== undefined ? ` — ${cell(String(r.value).slice(0, 160))}` : ''}`))
// the combinations the MCP discovered in the public record that no test yet drives, or that a referrer perspective
// does not close: what the next tests are
const discovered = (nextR.rows ?? []).filter((r) => r.pass === false).map((r) => `- ${cell(r.name)} — ${cell(String(r.value).slice(0, 200))}`)
const usesTable = [
  '| World (registry category) | What QPU may be there: the families its APIs name |',
  '|---|---|',
  ...(uses.rows ?? []).map((r) => `| ${cell(r.name)} | ${cell(String(r.value).replace(/^\d+ APIs read · [^:]*: /, '').slice(0, 300))} |`),
].join('\n')
const proof = `## Proof by MCP

Every figure in this README is read from a receipt a run of the unit wrote; no figure is typed. The tests call the
unit through its own \`tools/call\` (\`{ hex }\` addresses, the live host for the release tests), the gate is the \`gate\`
family's formulas run through the MCP in-process, the API walk is the \`api\` family's addresses, the discovery is the
\`data\` family's. Each receipt below is a node of the final build receipt; its uuid moves with its bytes.

${analytics}

Tests: ${num(test.tests)} top-level, ${num(test.pass)} pass, ${num(test.fail)} fail; ${num(computations)} computations folded (${kindsLine || '—'}); ${num(test.dim)}-dimensional state, ${num(test.qubits)} qubits; test receipt \`${test.receipt ?? '—'}\`.
Gate: ${gate.mode ?? '—'} on ${gate.when ?? '—'}, ${gate.holds === undefined ? '—' : gate.holds ? 'holds' : 'does not hold'}${gate.rows?.length ? ` — ${gate.rows.map((r) => `${r.name.startsWith('gate.crossed') ? '~' : r.pass ? '✓' : '✗'} ${cell(r.name)} = ${cell(String(r.value).slice(0, 120))}`).join('; ')}` : ''}.

### What QPU may be

Imagined by the MCP, not claimed: for every category of the APIs.guru registry, \`data.imagine(c)\` reads that world's
APIs and crosses the words of their titles and operations with the words of every family's formulas; the families
reached are what the unit is for that world (${num(uses.reached)} of ${num(uses.categories)} categories reach a family; ${num(uses.toImagine)} name a family to imagine).
A request in words — a law firm, an auditor, a forensic expert — is imagined the same way by the cross formula
\`qpu_data { source: 'imagine', about }\` (\`data.imagine\` at its hex address). The chat answers any question from the
formula its words name: \`qpu_data { source: 'ask', about }\`.

${usesTable}

### Next

The base for the next development, discovered by the MCP: every family researched in the public record
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

const summary = `An exact quantum processing unit served over MCP at https://qpu.uuidna.com, with its site, admin and API on the
same host. Reads need no auth; storage writes need a Bearer token. Use it as an MCP server (\`{ "qpu": { "type": "http",
"url": "https://qpu.uuidna.com/mcp" } }\`), as a package (\`npm install @uuidna/qpu\`), or as a container.

${glance}

Cite: Rouschev, Tsvetan. "qpu." doi:[10.5281/zenodo.23091364](https://doi.org/10.5281/zenodo.23091364). License: CC-BY-NC-ND-4.0
(commercial use by license: https://qpu.uuidna.com/license).`

// Zenodo shows .zenodo.json's description as HTML: the same summary, its table as a table
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const inline = (t) => esc(t).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
const rowsHtml = glance.split('\n').filter((l) => l.startsWith('|') && !/^\|---/.test(l)).map((l, i) => `<tr>${l.slice(1, -1).split(' | ').map((c) => `<${i ? 'td' : 'th'}>${inline(c.trim())}</${i ? 'td' : 'th'}>`).join('')}</tr>`).join('')
const [intro, , ...tail] = summary.split('\n\n')
const zenodoPath = path.join(ROOT, '.zenodo.json')
const zenodo = JSON.parse(fs.readFileSync(zenodoPath, 'utf8'))
zenodo.description = `<p>${inline(intro.replace(/\n/g, ' '))}</p><table>${rowsHtml}</table>${tail.map((t) => `<p>${inline(t.replace(/\n/g, ' '))}</p>`).join('')}`
zenodo.version = pkg.version
fs.writeFileSync(zenodoPath, JSON.stringify(zenodo, null, 2) + '\n')

fs.writeFileSync(path.join(ROOT, 'RELEASE.md'), `${summary}\n\nEvery figure above is read from a committed receipt; the README carries the final build receipt that accounts for them.\n`)

const md = `# UUIDNA QPU

${summary}

**Final build receipt** \`${final.uuid}\`

| | |
|---|---|
| version | ${pkg.version} |
| commit | \`${commit}\`${dirty ? ' (working tree differed from this commit)' : ''} |
| receipts | ${files.length} files, ${nodes.length} nodes |
| build stream | length ${stream?.length}, head \`${stream?.head}\`, chain \`${stream?.chain}\`, holds **${stream?.holds}** |

${proof}

## What QPU does

An exact quantum processing unit served over MCP at https://qpu.uuidna.com: integer state vectors, Lean-checked theorems,
formula families addressed by hex-program UUIDs, quantum receipts, its own cryptography, and live checks against public
data. Each wing reports itself:

${wingTable}

## Clay Millennium Prize Problems

The author claims solutions to ${clay.filter((p) => p.status === 'CLAIMED').length} of the Millennium Prize Problems, composed by the unit's cross formulas
across its families; Poincaré was solved by Perelman. Each claim links to the document that states it, with its argument
and verification status.

${clayTable}

Proven on the host in one pass (\`clay.pass(14)\`, written by \`node scripts/receipt.mjs clay\`${clayR.when ? ` on ${clayR.when}` : ''}): every seal run at the inputs 1 … 14, its
involution checked where it holds, the values handed to the discovery at once, which finds every formula of every other
family reaching the same value and every seal; each problem looked up in OEIS and the family researched in the record
(${clayR.record ?? '—'}). Two verdicts per problem and nothing else: the seal (σ∘σ = id and its fixed point) is VERIFIED when
recomputed at its address — ${num(clayR.sealsVerified)} of ${num(clayR.problems)} are, ${num(clayR.related)} related formulas found — and the Millennium claim
itself is UNVERIFIED (not accepted by the Clay Institute; no Lean theorem states it). Receipt \`${clayR.receipt ?? '—'}\`.

| Problem (formula) | Seal | Claim | Involution, seal, related formulas, OEIS, address |
|---|---|---|---|
${(clayR.rows ?? []).map((r) => `| ${cell(r.name)} | ${r.pass ? 'VERIFIED' : 'UNVERIFIED'} | UNVERIFIED | ${cell(String(r.value).replace(/^seal: (UN)?VERIFIED \(/, '').replace(/\); claim: UNVERIFIED.*$/, '').slice(0, 400))} |`).join('\n')}

## Build receipt

<details>
<summary>${nodes.length} receipts, chained in the build stream</summary>

Each node is a quantum receipt: its UUID is the RFC 9562 v8 content address of its payload fold and its referrer, and
its referrer is the node above it. Change any receipt's bytes and its node, its file's node, the build stream chain
and this final receipt move; the root moves with the commit.

\`\`\`mermaid
${graph}
\`\`\`

| node | receipt uuid | referrer | payload fold | seq |
|---|---|---|---|---|
${rowsOf().join('\n')}

</details>

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
