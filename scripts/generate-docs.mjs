#!/usr/bin/env node
/**
 * DOCUMENTATION FROM THE INLINE DOCS. Every exported capability's doc comment carries its frontmatter (@wing, @kind,
 * @evidence); this reads them, evaluates each evidence predicate against the built unit, and writes:
 *   docs/README.md, docs/<wing>.md, docs/comparison.md, docs/state.md   — Markdown with YAML frontmatter (Open Graph)
 *   src/seed/docs.ts                                             — the same pages as Payload content (the public site)
 * then checks every page: each path it names exists, each `npm run` script exists, each relative link resolves.
 *
 *   npm run docs            write
 *   npm run docs -- --check exit 1 if the written docs differ from what the sources give, or any check fails
 */
import fs from 'node:fs'
import path from 'node:path'
import { FILES, WINGS, wingOf, kindOf } from './doc-tags.mjs'
import { mintOf, vertices } from './lattice-values.mjs'

const ROOT = process.cwd()
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const REPO = 'https://github.com/uuidna/qpu'
const OG_IMAGE = 'https://opengraph.githubassets.com/qpu/uuidna/qpu'
const receipt = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : undefined)

// ---- read the inline docs ----------------------------------------------------------------------------------------
const caps = []
for (const file of FILES) {
  const L = fs.readFileSync(file, 'utf8').split('\n')
  L.forEach((line, i) => {
    const m = /^export (?:const|function\*?|async function|class) ([A-Za-z0-9_]+)/.exec(line)
    if (!m || /Holds$/.test(m[1])) return
    let j = i - 1
    while (j >= 0 && L[j].trim().startsWith('//')) j--
    if (!(j >= 0 && /\*\/\s*$/.test(L[j]))) return caps.push({ name: m[1], file, line: i + 1, wing: wingOf(m[1], file), kind: kindOf(m[1], line), summary: '', evidence: undefined, documented: false })
    let k = j
    while (k >= 0 && !/^\s*\/\*\*/.test(L[k])) k--
    const raw = L.slice(k, j + 1).join('\n').replace(/^\s*\/\*\*\s?/, '').replace(/\s*\*\/\s*$/, '').split('\n').map((x) => x.replace(/^\s*\*\s?/, ''))
    const tag = (t) => (raw.find((x) => x.startsWith(`@${t} `)) ?? '').slice(t.length + 2).trim() || undefined
    const text = raw.filter((x) => !x.startsWith('@')).join(' ').replace(/\s+/g, ' ').trim()
    const first = text.split(/(?<=\.)\s+(?=[A-Z])/)[0] ?? text
    caps.push({ name: m[1], file, line: i + 1, wing: tag('wing') ?? wingOf(m[1], file), kind: tag('kind') ?? kindOf(m[1], line), evidence: tag('evidence'), summary: first, documented: true })
  })
}

// ---- evaluate the evidence ---------------------------------------------------------------------------------------
const unit = await import(path.join(ROOT, 'dist/quantum/processing/unit/index.js'))
const results = new Map()
for (const c of caps) {
  if (!c.evidence || results.has(c.evidence)) continue
  const f = unit[c.evidence]
  if (typeof f !== 'function') { results.set(c.evidence, 'missing'); continue }
  if (/Live|Fetch/.test(c.evidence)) { results.set(c.evidence, 'live'); continue }
  try {
    let v = f()
    // a predicate over a value (x?: ReturnType<typeof qpuXOf>) is asked of the builder's own output
    const builder = unit[c.evidence.replace(/Holds$/, 'Of')]
    if (v === false && typeof builder === 'function') {
      if (builder.length > 0) { results.set(c.evidence, 'on-call'); continue }
      const built = builder()
      if (built instanceof Promise) { built.catch(() => {}); results.set(c.evidence, 'live'); continue }
      v = f(built)
      if (v === false && built && Array.isArray(built.rows)) v = f(built.rows)
    }
    results.set(c.evidence, v instanceof Promise ? (v.catch(() => {}), 'live') : v === true ? 'holds' : 'false')
  } catch (e) {
    results.set(c.evidence, 'error')
  }
}
const statusOf = (c) => (c.evidence ? results.get(c.evidence) : '—')

// ---- page helpers ------------------------------------------------------------------------------------------------
const esc = (s) => String(s).replace(/\|/g, '\\|')
const yamlStr = (s) => JSON.stringify(String(s))
const frontmatter = (slug, title, description) =>
  ['---', `uuid: ${yamlStr(unit.qpuContentUuidOf({ slug, title, description }))}`, `title: ${yamlStr(title)}`, `description: ${yamlStr(description)}`, `og:title: ${yamlStr(`${title} — @uuidna/qpu`)}`, `og:description: ${yamlStr(description)}`,
    `og:type: article`, `og:url: ${yamlStr(`${REPO}/blob/main/docs/${slug}.md`)}`, `og:image: ${yamlStr(OG_IMAGE)}`, `og:site_name: "@uuidna/qpu"`,
    `twitter:card: summary_large_image`, `twitter:title: ${yamlStr(title)}`, `twitter:description: ${yamlStr(description)}`, `version: ${yamlStr(pkg.version)}`, '---', ''].join('\n')
const link = (c) => `[\`${c.name}\`](../${c.file}#L${c.line})`
const badge = { holds: 'holds', 'on-call': 'checked on each call (needs inputs)', false: '**false**', live: 'live (network)', missing: 'missing', error: '**error**', '—': '—' }
const pages = {}

// ---- wing pages --------------------------------------------------------------------------------------------------
const kinds = ['builder', 'function', 'class', 'store', 'adapter', 'constant']
for (const [slug, title, blurb] of WINGS) {
  const rows = caps.filter((c) => c.wing === slug).sort((a, b) => kinds.indexOf(a.kind) - kinds.indexOf(b.kind) || a.name.localeCompare(b.name))
  const ok = rows.filter((c) => statusOf(c) === 'holds').length
  const withEv = rows.filter((c) => c.evidence).length
  const description = `${blurb} ${rows.length} capabilities; ${ok} of ${withEv} evidence predicates hold.`
  pages[slug] = frontmatter(slug, title, description) + [
    `# ${title}`, '', blurb, '',
    `| | |`, `|---|---|`, `| Capabilities | ${rows.length} |`, `| With an evidence predicate | ${withEv} |`, `| Predicates that hold now | ${ok} |`,
    `| Live (need the network; checked by the live doors) | ${rows.filter((c) => statusOf(c) === 'live').length} |`, '',
    '| Capability | Kind | What it does | Evidence | Status |', '|---|---|---|---|---|',
    ...rows.map((c) => `| ${link(c)} | ${c.kind} | ${esc(c.summary || '—')} | ${c.evidence ? `\`${c.evidence}\`` : '—'} | ${badge[statusOf(c)]} |`),
    '', `Generated from the inline docs by \`npm run docs\`. Index: [docs](README.md).`, '',
  ].join('\n')
}

// ---- the Lean families: each module is a formula family and a hex handle; links are discovered from the proofs ----
{
  const { leanSource } = await import(path.join(ROOT, 'dist/quantum/processing/unit/lean.js'))
  const { leanLinksOf } = await import(path.join(ROOT, 'dist/quantum/processing/unit/lean-eval.js'))
  const g = leanLinksOf(leanSource)
  const fams = unit.qpuHexFamiliesOf()
  const disc = unit.qpuHexDiscoverOf()
  pages.proof = pages.proof.replace(/\nGenerated from the inline docs/, [
    '', '## Lean families', '',
    'index.lean is the bundle of these modules (scripts/lean-bundle.mjs); `npm run lean` builds the modules with Lake, checks the bundle matches them, and checks the bundle with Lean. Each module with definitions is a hex family: its handle is the fold of its name and each definition is one program nibble.', '',
    '| Module | Hex handle | Formulas (nibble: name) | Theorems | Uses |', '|---|---|---|---|---|',
    ...g.families.map((f) => { const h = fams.get(`Qpu.${f.family}`); return `| [Qpu.${f.family}](../src/quantum/processing/unit/lean/Qpu/${f.family}.lean) | ${h ? `\`${unit.qpuFoldOf(`Qpu.${f.family}`).slice(0, 8)}\`` : '—'} | ${h ? h.map((x, i) => `${(i + 1).toString(16)}: ${x.name}`).join(', ') : '—'} | ${f.theorems} | ${g.familyLinks.filter((l) => l.from === f.family).map((l) => `${l.to} (${l.count})`).join(', ') || '—'} |` }),
    '', `${g.related.length} pairs of definitions are related by at least one theorem. Strongest: ${g.related.slice(0, 6).map((r) => `${r.pair.join(' ~ ')} (${r.by.length})`).join(', ')}.`, '',
    '## Discovered relations', '', 'Every formula evaluated over the lattice constants; values reached by formulas of two or more families, each way as a runnable hex program (`GET /hex/<uuid>`).', '',
    '| Value | Families | Ways (hex) |', '|---|---|---|',
    ...disc.relations.map((r) => `| ${r.value} | ${r.families.join(', ')} | ${r.ways.slice(0, 3).map((w) => `${w.formula}(${w.params.join(', ')}) \`${w.hex}\``).join('<br>')} |`),
    '', 'Generated from the inline docs'].join('\n'))
}

// ---- comparison --------------------------------------------------------------------------------------------------
const lean = receipt('lean-receipt.json'), fuse = receipt('fuse-receipt.json'), pcf = receipt('payload-cf-receipt.json'), cross = receipt('cross-receipt.json')
const sources = [
  ['Amazon Braket simulators', 'https://docs.aws.amazon.com/braket/latest/developerguide/choose-a-simulator.html'],
  ['Qiskit Aer AerSimulator', 'https://qiskit.org/ecosystem/aer/stubs/qiskit_aer.AerSimulator.html'],
  ['Cirq', 'https://pypi.org/project/cirq/'],
  ['qsim', 'https://github.com/quantumlib/qsim'],
  ['PennyLane Lightning', 'https://pypi.org/project/PennyLane-Lightning/0.32.0'],
  ['Model Context Protocol', 'https://modelcontextprotocol.io/'],
]
pages.comparison = frontmatter('comparison', 'Comparison', 'What @uuidna/qpu does, wing by wing, beside quantum SDKs and simulators (Qiskit Aer, Cirq, Amazon Braket, PennyLane) and general AI models.') + [
  '# Comparison', '',
  'Rows are capability classes; a cell says what the system documents, not a benchmark. The qpu column is generated from this repository (receipts and evidence predicates); the others cite the vendor documentation listed below. qpu runs no physical quantum hardware.', '',
  '| Capability | qpu | Qiskit Aer | Cirq | Amazon Braket | PennyLane | AI models (LLMs) |', '|---|---|---|---|---|---|---|',
  `| Exact state vector | integer amplitudes, 3-qubit register (dim vertices); sparse states, Shor on 9 qubits (dim mintOf(9)) | statevector (dense, GPU) | state vector; qsim | SV1, up to 34 qubits | lightning.qubit / .gpu / .kokkos | none |`,
  `| Noise / density matrix | XX noise identity only | noise models, density matrix | density matrix | DM1, up to 17 qubits | default.mixed | none |`,
  `| Stabilizer / large structured states | graph state of the fused API registry, ${fuse?.graphState?.qubits ?? '—'} qubits, exact entanglement by GF(2) rank | stabilizer, extended stabilizer, MPS | Clifford simulator | TN1, up to 50 qubits | lightning.tensor (MPS) | none |`,
  `| Physical hardware | none | IBM Quantum | Google Quantum AI (by access) | IonQ, Rigetti, IQM, QuEra and others | via plugins | none |`,
  `| Formal proof | ${lean ? `${lean.theorems} Lean 4 theorems, all served and recomputed (${lean.recomputed}/${lean.theorems})` : '—'} | none | none | none | none | none |`,
  `| Content-addressed results | RFC 9562 v8 UUIDs and chained quantum receipts on every computation | job ids | none | task ARNs | none | none |`,
  `| Agent interface | MCP server (/mcp), ${unit.qpuMcpToolsListOf ? unit.qpuMcpToolsListOf().length : '—'} tools | SDK (Python) | SDK (Python) | SDK and API | SDK (Python) | call tools through MCP or function calling |`,
  `| Document database | MongoDB query/update semantics on Cloudflare KV+R2 or D1, Payload adapter | — | — | — | — | — |`,
  `| API fusion | ${fuse ? `${fuse.reached} APIs, ${fuse.edges} composing pairs, ${fuse.formulas?.produced ?? '—'} cross formulas` : '—'} | — | — | — | — | — |`,
  `| CMS on the edge | ${pcf ? `${pcf.combinations} Next.js + Payload configurations on Workers` : '—'} | — | — | — | — | — |`,
  `| License | CC-BY-NC-ND-4.0 (non-commercial, no derivatives) | Apache-2.0 | Apache-2.0 | commercial service | Apache-2.0 | per provider |`,
  '', '## Sources', '', ...sources.map(([t, u]) => `- [${t}](${u})`), '',
  `Live cross-checks of qpu's own claims against CERN, Zenodo, ORCID and NIST: ${cross ? `${cross.agree} of ${cross.of} agree` : '—'} (see [state](state.md)).`, '',
].join('\n')

// ---- state -------------------------------------------------------------------------------------------------------
const issues = JSON.parse(fs.readFileSync('docs/known-issues.json', 'utf8'))
const holds = [...results.values()].filter((v) => v === 'holds').length
pages.state = frontmatter('state', 'State', `Current state of @uuidna/qpu ${pkg.version}: what is built, what is verified, and what is open.`) + [
  '# State', '', `Version **${pkg.version}** (version lock: \`v1.<minor>.<digit>\`, 0 = LTS; [scripts/version-lock.mjs](../scripts/version-lock.mjs)).`, '',
  '| Measure | Value | Source |', '|---|---|---|',
  `| Capabilities documented inline | ${caps.filter((c) => c.documented).length} of ${caps.length} exports | [scripts/generate-docs.mjs](../scripts/generate-docs.mjs) |`,
  `| Evidence predicates that hold | ${holds} of ${results.size} (live ones need the network) | evaluated by \`npm run docs\` |`,
  lean && `| Lean theorems served / recomputed | ${lean.served} / ${lean.recomputed} of ${lean.theorems} | [lean-receipt.json](../lean-receipt.json) |`,
  fuse && `| API registry fused | ${fuse.reached} of ${fuse.listed} APIs, ${fuse.formulas?.produced ?? '—'} cross formulas | [fuse-receipt.json](../fuse-receipt.json) |`,
  pcf && `| Payload on Cloudflare | ${pcf.combinations} combinations, ${pcf.typechecked.ok} of ${pcf.typechecked.bases} bases type-check | [payload-cf-receipt.json](../payload-cf-receipt.json) |`,
  cross && `| Live cross-proof | ${cross.agree} of ${cross.of} claims agree; differ: ${cross.differ.join(', ')} | [cross-receipt.json](../cross-receipt.json) |`,
  '', '## Open', '', ...issues.map((x) => `- **${x.title}.** ${x.detail}${x.evidence ? ` Evidence: ${x.evidence}` : ''}`), '',
].filter((x) => x !== undefined && x !== false).join('\n')

// ---- index -------------------------------------------------------------------------------------------------------
pages.README = frontmatter('README', 'Documentation', `@uuidna/qpu ${pkg.version}: an exact quantum processing unit served over MCP, with formal proofs, content-addressed receipts, a document database on Cloudflare and Payload CMS integration.`) + [
  '# @uuidna/qpu documentation', '',
  'An exact quantum processing unit served over MCP at qpu.uuidna.com: integer-amplitude state vectors, Lean-checked theorems, content-addressed quantum receipts, a MongoDB-semantics document database on Cloudflare bindings, API fusion and Payload CMS on Workers. Every page is generated from the inline docs; every capability links to its source and its evidence.', '',
  '| Wing | Capabilities | Evidence holds |', '|---|---|---|',
  ...WINGS.map(([slug, title]) => { const r = caps.filter((c) => c.wing === slug); return `| [${title}](${slug}.md) | ${r.length} | ${r.filter((c) => statusOf(c) === 'holds').length} of ${r.filter((c) => c.evidence).length} |` }),
  '', `Also: [state](state.md) · [comparison](comparison.md) · [build receipt](../README.md)`, '',
  '## Use', '', '| Command | Does |', '|---|---|',
  ...[['build', 'compile, after the version lock'], ['lean', 'check index.lean with Lean 4'], ['lean:embed', 'embed index.lean and the version into the unit'], ['fuse', 'fuse the API registry'], ['payload:cf', 'enumerate and type-check every Payload-on-Cloudflare combination (`-- --repo` regenerates this repo\'s configs)'], ['readme', 'write the build receipt'], ['docs', 'write these docs']]
    .filter(([s]) => pkg.scripts[s]).map(([s, d]) => `| \`npm run ${s}\` | ${d} |`),
  '',
].join('\n')

// ---- HTML with Open Graph ----------------------------------------------------------------------------------------
const inline = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => `<a href="${u.replace(/^README\.md$/, '/').replace(/^(?!https?:)(?!\.\.\/)([\w-]+)\.md$/, (_, name) => `/${name.toLowerCase().replace(/_/g, '-')}`).replace(/^\.\.\//, `${REPO}/blob/main/`)}">${t}</a>`)
const htmlOf = (md) => {
  const fm = Object.fromEntries([...md.matchAll(/^([\w:]+): (.*)$/gm)].slice(0, 13).map(([, k, v]) => [k, v.startsWith('"') ? JSON.parse(v) : v]))
  const body = md.replace(/^---[\s\S]*?---\n/, '').split('\n')
  const out = []
  for (let i = 0; i < body.length; i++) {
    const l = body[i]
    if (l.startsWith('|')) {
      const rows = []
      while (i < body.length && body[i].startsWith('|')) rows.push(body[i++])
      i--
      const cells = (r) => r.slice(1, -1).split(/(?<!\\)\|/).map((c) => inline(c.trim().replace(/\\\|/g, '|')))
      out.push('<table>', `<tr>${cells(rows[0]).map((c) => `<th>${c}</th>`).join('')}</tr>`, ...rows.slice(2).map((r) => `<tr>${cells(r).map((c) => `<td>${c}</td>`).join('')}</tr>`), '</table>')
    } else if (/^#+ /.test(l)) { const h = /^#+/.exec(l)[0].length; out.push(`<h${h}>${inline(l.slice(h + 1))}</h${h}>`) }
    else if (l.startsWith('- ')) out.push(`<li>${inline(l.slice(2))}</li>`)
    else if (l.trim()) out.push(`<p>${inline(l)}</p>`)
  }
  return { fm, html: out.join('\n') }
}

// ---- write or check ----------------------------------------------------------------------------------------------
const files = {}
const docs = []
for (const [slug, md] of Object.entries(pages)) {
  files[`docs/${slug}.md`] = md
  const { fm, html } = htmlOf(md)
  docs.push({ slug: slug === 'README' ? 'index' : slug, title: fm.title, description: fm.description, markdown: md.replace(/^---[\s\S]*?---\n/, ''), html })
}
// nothing written by hand is published: every doc below is generated from the code, so its SEO and quality are the
// code's. A hand-written Markdown file is a lead (scripts/leads.mjs: manualDocLeadsOf), not a page.
// the same pages as Payload content: the docs collection, upserted on init by content UUID (the public site)
// id: the UUID of the slug, so a page has one address however many isolates seed it; uuid: the UUID of its content
const docRows = docs.map((d) => ({ id: unit.qpuShapeUuidOf(`docs/${d.slug}`), ...d, uuid: unit.qpuContentUuidOf(d) }))
files['src/seed/docs.ts'] = `/** Generated by scripts/generate-docs.mjs — the documentation as Payload content, upserted on init. */
import type { Payload } from 'payload'

export const docs = ${JSON.stringify(docRows, null, 1)}

export async function seedDocs(payload: Payload) {
  // each page read at its own address and written only when its content UUID changed: no listing, so no race
  await Promise.all(docs.map(async (doc) => {
    const old = (await payload.findByID({ collection: 'docs' as never, id: doc.id, depth: 0, disableErrors: true, overrideAccess: true })) as { uuid?: string } | null
    if (!old) await payload.create({ collection: 'docs' as never, data: doc as never, overrideAccess: true })
    else if (old.uuid !== doc.uuid) await payload.update({ collection: 'docs' as never, id: doc.id, data: doc as never, overrideAccess: true })
  }))
}
`
const problems = []
for (const [f, text] of Object.entries(files)) {
  if (!f.endsWith('.md')) continue
  for (const m of text.matchAll(/\]\(([^)#\s]+)(?:#[^)]*)?\)/g)) { const u = m[1]; if (!/^https?:/.test(u) && !fs.existsSync(path.join(path.dirname(f), u)) && !files[path.normalize(path.join(path.dirname(f), u))]) problems.push(`${f}: link ${u}`) }
  for (const m of text.matchAll(/npm run ([\w:.-]+)/g)) if (!pkg.scripts[m[1]]) problems.push(`${f}: npm run ${m[1]}`)
}
for (const f of ['README.md']) for (const m of fs.readFileSync(f, 'utf8').matchAll(/\]\(([^)#\s]+)\)/g)) if (!/^https?:/.test(m[1]) && !fs.existsSync(m[1]) && !files[m[1]]) problems.push(`${f}: link ${m[1]}`)
const check = process.argv.includes('--check')
const stale = Object.entries(files).filter(([f, t]) => !fs.existsSync(f) || fs.readFileSync(f, 'utf8') !== t).map(([f]) => f)
if (!check) {
  for (const [f, t] of Object.entries(files)) fs.writeFileSync(f, t)
}
const summary = { pages: Object.keys(pages).length, capabilities: caps.length, documented: caps.filter((c) => c.documented).length, evidence: results.size, holds, live: [...results.values()].filter((v) => v === 'live').length, failing: [...results].filter(([, v]) => v === 'false' || v === 'error' || v === 'missing').map(([k, v]) => `${k}:${v}`), problems, ...(check ? { stale } : {}) }
console.log(JSON.stringify(summary, null, 1))
process.exit(problems.length || (check && stale.length) ? 1 : 0)
