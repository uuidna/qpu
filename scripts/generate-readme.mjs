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

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const git = (cmd) => execSync(`git ${cmd}`, { cwd: ROOT }).toString().trim()
const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'))

const pkg = read('package.json')
const commit = git('rev-parse HEAD')
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
const rowsOf = () =>
  nodes.map((n) => `| ${cell(label(n))} | \`${n.uuid}\` | \`${short(n.referrer.replace(/^git:/, ''))}\` | \`${n.fold}\` | ${n.seq} |`)

const md = `# UUIDNA QPU

**Final build receipt** \`${final.uuid}\`

| | |
|---|---|
| version | ${pkg.version} |
| commit | \`${commit}\`${dirty ? ' (working tree differed from this commit)' : ''} |
| receipts | ${files.length} files, ${nodes.length} nodes |
| build stream | length ${stream?.length}, head \`${stream?.head}\`, chain \`${stream?.chain}\`, holds **${stream?.holds}** |

Each node is a quantum receipt: its UUID is the RFC 9562 v8 content address of its payload fold and its referrer, and
its referrer is the node above it. Change any receipt's bytes and its node, its file's node, the build stream chain
and this final receipt move; the root moves with the commit.

\`\`\`mermaid
${graph}
\`\`\`

| node | receipt uuid | referrer | payload fold | seq |
|---|---|---|---|---|
${rowsOf().join('\n')}

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
