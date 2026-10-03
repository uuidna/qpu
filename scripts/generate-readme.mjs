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
for (const m of ['mcp/cross-domain-formulas', 'mcp/cross-domain-paths', 'audit/audit-formulas', 'mcp/quantum-secure-signalling', 'mcp/hologram-streams', 'mcp/crypt-formulas', 'mcp/np-formulas', 'mcp/clay-seals', 'mcp/heat-formulas', 'mcp/mcp-capabilities', 'mcp/qpu-fused']) await import(`../dist/${m}.js`)
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
const graph = [
  'flowchart TD',
  ...nodes.map((n) => `  n${short(n.uuid)}["${label(n)}<br/><code>${short(n.uuid)}</code>"]`),
  ...nodes.filter((n) => n.parent).map((n) => `  n${short(n.parent)} --> n${short(n.uuid)}`),
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
  '| Problem | Status | Claim and approach composed by the cross formulas |',
  '|---|---|---|',
  ...clay.map((p) => `| ${cell(p.name)} | ${p.status === 'CLAIMED' ? `claimed solved by ${p.claimedBy} ([claim](${p.source}))` : `solved${p.solver ? ` (${p.solver}${p.year ? `, ${p.year}` : ''})` : ''}`} | ${cell([p.claim, p.approach, ...p.crossFormulas].filter(Boolean).join('; '))} |`),
].join('\n')
const rowsOf = () =>
  nodes.map((n) => `| ${cell(label(n))} | \`${n.uuid}\` | \`${short(n.referrer.replace(/^git:/, ''))}\` | \`${n.fold}\` | ${n.seq} |`)

// AT A GLANCE: what QPU does, how much of it, and what each number is compared with — every figure read from a committed
// receipt or from the unit's own registries, so the summary cannot claim more than the receipts hold. The same text
// is the GitHub Release's notes (RELEASE.md) and the top of the npm page.
const receiptOf = (f) => (fs.existsSync(path.join(ROOT, f)) ? read(f) : {})
const lean = receiptOf('lean-receipt.json'), formulas = receiptOf('formulas-receipt.json'), fuse = receiptOf('fuse-receipt.json')
const discovery = receiptOf('discovery-receipt.json'), heat = receiptOf('heat-receipt.json'), payloadCf = receiptOf('payload-cf-receipt.json'), cross = receiptOf('cross-receipt.json')
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
  `| Public APIs | ${num(fuse.reached)} of ${num(fuse.listed)} APIs walked live, ${num(fuse.methods)} methods, ${num(fuse.edges)} cross formulas | the APIs.guru registry, against the Lean theorem fuse |`,
  `| Cross formulas | ${num(formulas.pass)} of ${num(formulas.rowsTotal)} rows hold across ${num(formulas.formulas)} formulas | their own hex programs (${num(formulas.hexAgrees)} agree) |`,
  `| Cryptography | ${formulas.attacks ?? '—'} attacks resisted, no node:crypto | Node's crypto (parity), its own attacks |`,
  `| Live cross-proof | ${num(cross.agree)} of ${num(cross.of)} claims agree | the hosts the claims name |`,
  `| Payload on Cloudflare | ${num(payloadCf.combinations)} combinations generated; the site is one Worker | Payload's documented plugins and adapters |`,
  `| Code heat | ${num(heat.cold)} of ${num(heat.files)} files cold, ${num(heat.hot)} hot | Qpu.Physics: photon / thermal T |`,
].join('\n')
const summary = `An exact quantum processing unit served over MCP at https://qpu.uuidna.com, with its site, admin and API on the
same host. Reads need no auth; storage writes need a Bearer token. Use it as an MCP server (\`{ "qpu": { "type": "http",
"url": "https://qpu.uuidna.com/mcp" } }\`), as a package (\`npm install @uuidna/qpu\`), or as a container.

${glance}

Cite: Rouschev, Tsvetan. "qpu." doi:[10.5281/zenodo.23091364](https://doi.org/10.5281/zenodo.23091364). License: CC-BY-NC-ND-4.0
(commercial use by license: https://qpu.uuidna.com/license).`

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
