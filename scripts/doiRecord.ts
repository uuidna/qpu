// The record Zenodo archives with every release, and the release note, from the same build: what is achieved (the kernel's
// theorems, the catalogue, the tools served and the examples replayed), the novelties the tree declares, the laws no earlier
// DOI-registered work was found to state, what is claimed and not yet proved with what each claim still misses, and what funds the work (the donation, the
// x402 price, the licence and the calls the compete door found open). Zenodo's GitHub integration reads .zenodo.json at the
// tagged commit, so the record a version carries is the build that version is. With --check nothing is written and a
// difference fails. The release note is the record's description, which the release workflow reads from .zenodo.json.
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { PROSE, proseFill } from '../src/quantum/processing/prose-index.ts'
import { GENERATED_LEMMAS, KERNEL_THEOREMS, NOVELTIES, OPEN_CLAIMS, THEOREMS } from '../src/quantum/processing/theorems-index.ts'
import { TEXTBOOK_INDEX } from '../src/quantum/processing/textbook-index.ts'
import { NESTED_COUNTS } from '../src/quantum/processing/nested-index.ts'
import { CLAIMS } from '../src/quantum/processing/claims-index.ts'
import { TABLES } from '../src/quantum/processing/tables-index.ts'
import { TENANTS } from '../src/quantum/processing/config-index.ts'
import { EXAMPLES } from '../src/quantum/processing/examples.ts'
import { TOOLBOXES, handle } from '../src/quantum/processing/mcp.ts'
import { DONATION, callPriceUsd } from '../src/quantum/net/mcp-http.ts'
import { LICENSE, PRECEDENCE } from '../src/quantum/processing/unit/license.ts'
import { RELEASE_REPOSITORY, UNIT_CONCEPT_DOI } from '../src/quantum/processing/release.ts'

const RECORD = '.zenodo.json', README = 'README.md'
const pkg = JSON.parse(readFileSync('src/quantum/package.json', 'utf8')) as { name: string; version: string; description: string }
const LEAN_AXIOMS = new Set(['propext', 'Classical.choice', 'Quot.sound'])

// what is achieved
const byHand = THEOREMS.length
const leanOnly = THEOREMS.filter((t) => t.axioms.every((a) => LEAN_AXIOMS.has(a))).length
const families = Object.entries(THEOREMS.reduce<Record<string, number>>((n, t) => ({ ...n, [t.module]: (n[t.module] ?? 0) + 1 }), {}))
  .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).map(([module, n]) => `${module} ${n}`).join(', ')
const tools = ((await handle({ jsonrpc: '2.0', id: 0, method: 'tools/list' })) as { result?: { tools?: unknown[] } }).result?.tools?.length ?? 0
const achieved = [
  proseFill(PROSE.scriptsDoiRecord_kernel, KERNEL_THEOREMS, byHand, GENERATED_LEMMAS, leanOnly),
  proseFill(PROSE.scriptsDoiRecord_families, families),
  proseFill(PROSE.scriptsDoiRecord_catalogue, TEXTBOOK_INDEX.length, NESTED_COUNTS.products, NESTED_COUNTS.variants),
  proseFill(PROSE.scriptsDoiRecord_served, tools, EXAMPLES.length),
]

// novelties: the theorems the tree declares new (the novelty register Lean writes), each proposed for Mathlib
const novelties = NOVELTIES.map((n) => proseFill(PROSE.scriptsDoiRecord_proposed, n.key, n.doc.replace(/\s+/g, ' ').trim()))
// the general laws of the textbook for which the search found no earlier DOI-registered work: only those the kernel proves are listed
const moduleOf = new Map(THEOREMS.map((t) => [t.key, t.module]))
const saysOf = new Map(TEXTBOOK_INDEX.map((t) => [t.key, t.says]))
const searched = CLAIMS.filter((c) => c.status === 'unrecognised'), proved = searched.filter((c) => moduleOf.has(c.theorem))
const unprecedented = proved.map((c) => proseFill(PROSE.scriptsDoiRecord_novelty, c.theorem, moduleOf.get(c.theorem)!, saysOf.get(c.theorem) ?? ''))

// claimed and not yet proved: a prize whose rules cite one of the author's records, with every rule still to meet
type Call = { id: string; name: string; prize: string; rules: string; read: string; kind: string; entry: string; requires: readonly { rule: string; needs: string }[] }
const calls = TABLES.COMPETITIONS as unknown as readonly Call[]
const open = [...OPEN_CLAIMS.map((c) => proseFill(PROSE.scriptsDoiRecord_openClaim, c.name, c.claim.trim(), c.proved.join(', ') || '—', c.missing.trim())), ...calls.filter((c) => c.kind === 'prize').flatMap((c) => {
  const record = PRECEDENCE.find((p) => p.doi !== UNIT_CONCEPT_DOI && c.requires.some((r) => r.needs.includes(p.doi)))
  return record ? [proseFill(PROSE.scriptsDoiRecord_claim, c.name, `${record.title}, doi:${record.doi}.`, c.requires.map((r) => `${r.rule}: ${r.needs}`).join('; '))] : []
})]

// funding
const available = calls.filter((c) => c.entry === 'open' || c.entry === 'rolling')
  .map((c) => proseFill(PROSE.scriptsDoiRecord_call, c.name, c.kind, c.entry, c.read, c.prize, c.rules))
const funding = [
  proseFill(PROSE.scriptsDoiRecord_donation, DONATION),
  proseFill(PROSE.scriptsDoiRecord_paid, callPriceUsd()),
  proseFill(PROSE.scriptsDoiRecord_licence, LICENSE.spdx, LICENSE.url),
  PROSE.scriptsDoiRecord_calls,
]

const sections = [
  { heading: PROSE.scriptsDoiRecord_achieved, lead: achieved, items: [] as string[] },
  { heading: PROSE.scriptsDoiRecord_novelties, lead: [PROSE.scriptsDoiRecord_noveltyLead], items: novelties },
  { heading: PROSE.scriptsDoiRecord_unprecedented, lead: [proseFill(PROSE.scriptsDoiRecord_unprecedentedLead, proved.length, searched.length - proved.length)], items: unprecedented },
  { heading: PROSE.scriptsDoiRecord_open, lead: [], items: open },
  { heading: PROSE.scriptsDoiRecord_funding, lead: funding, items: available },
]

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const html = sections.map((s) => [`<h2>${escape(s.heading)}</h2>`, ...s.lead.map((p) => `<p>${escape(p)}</p>`), ...(s.items.length ? [`<ul>${s.items.map((i) => `<li>${escape(i)}</li>`).join('')}</ul>`] : [])].join('')).join('')

const title = proseFill(PROSE.scriptsDoiRecord_title, pkg.name, pkg.version, pkg.description)
const record = {
  title,
  version: pkg.version,
  upload_type: 'software',
  access_right: 'open',
  license: LICENSE.spdx.toLowerCase(),
  creators: [{ name: LICENSE.author, orcid: LICENSE.orcid.slice(LICENSE.orcid.lastIndexOf('/') + 1) }],
  description: html,
  keywords: TOOLBOXES.map((b) => b.name),
  related_identifiers: [
    { identifier: UNIT_CONCEPT_DOI, relation: 'isVersionOf', scheme: 'doi' },
    ...PRECEDENCE.filter((p) => p.doi !== UNIT_CONCEPT_DOI).map((p) => ({ identifier: p.doi, relation: 'references', scheme: 'doi' })),
    { identifier: `https://github.com/${RELEASE_REPOSITORY}`, relation: 'isSupplementTo', scheme: 'url' },
  ],
}
const text = JSON.stringify(record, null, 2) + '\n'

// the README's publication section: the same sections as the note, where the work is published, and every theorem by family,
// each family linked to its Lean source and to its section of the catalogue on the site
const site = `https://${Object.keys(TENANTS)[0]}`, source = `https://github.com/${RELEASE_REPOSITORY}`
const catalogue = readFileSync('src/quantum/CATALOGUE.md', 'utf8')
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const md = (s: string) => s.split('`').map((part, i) => (i % 2 ? part : part.replace(/</g, '&lt;'))).join('`').replace(/\s*\n\s*/g, ' ')
const grouped = new Map<string, string[]>()
for (const t of THEOREMS) grouped.set(t.module, [...(grouped.get(t.module) ?? []), t.key])
const byFamily = [...grouped].sort((a, b) => (a[0] < b[0] ? -1 : 1)), leanOf = (module: string) => `lean/${module.split('.').join('/')}.lean`
const unsourced = byFamily.map(([module]) => leanOf(module)).filter((path) => !existsSync(path))
const cited = Boolean(LICENSE.author && pkg.name && pkg.description) && /^10\.\d{4,9}\/\S+$/.test(UNIT_CONCEPT_DOI)
const markdown = [
  PROSE.scriptsDoiRecord_readmeStart, '',
  `## ${PROSE.scriptsDoiRecord_publication}`, '',
  proseFill(PROSE.scriptsDoiRecord_record, title, LICENSE.author, LICENSE.orcid, `[${LICENSE.spdx}](${LICENSE.url})`, `[${UNIT_CONCEPT_DOI}](https://doi.org/${UNIT_CONCEPT_DOI})`), '',
  PROSE.scriptsDoiRecord_disclosure, '',
  proseFill(PROSE.scriptsDoiRecord_standards, cited), '',
  `### ${PROSE.scriptsDoiRecord_methods}`, '', PROSE.scriptsDoiRecord_methodHead, '| --- | --- | --- |',
  proseFill(PROSE.scriptsDoiRecord_methodSource, source), proseFill(PROSE.scriptsDoiRecord_methodSite, site), proseFill(PROSE.scriptsDoiRecord_methodCatalogue, `${site}/catalogue`),
  proseFill(PROSE.scriptsDoiRecord_methodMcp, `${site}/api/mcp`), proseFill(PROSE.scriptsDoiRecord_methodPackage, `https://www.npmjs.com/package/${pkg.name}`, pkg.version),
  proseFill(PROSE.scriptsDoiRecord_methodArchive, `https://doi.org/${UNIT_CONCEPT_DOI}`), proseFill(PROSE.scriptsDoiRecord_methodReleases, `${source}/releases`), proseFill(PROSE.scriptsDoiRecord_methodNote, `${site}/release`), '',
  ...sections.flatMap((s) => [`### ${s.heading}`, '', ...s.lead.flatMap((p) => [md(p), '']), ...(s.items.length ? [...s.items.map((i) => `- ${md(i)}`), ''] : [])]),
  `### ${PROSE.scriptsDoiRecord_theorems}`, '',
  proseFill(PROSE.scriptsDoiRecord_theoremsLead, THEOREMS.length, byFamily.length), '',
  ...byFamily.flatMap(([module, keys]) => [`#### ${proseFill(PROSE.scriptsDoiRecord_family, `\`${module}\``, keys.length, `${source}/blob/main/${leanOf(module)}`, `${site}/catalogue${catalogue.includes(`\n## ${module}\n`) ? `#${slug(module)}` : ''}`)}`, '', keys.map((k) => `\`${k}\``).join(' · '), '']),
  PROSE.scriptsDoiRecord_readmeEnd,
].join('\n')
let readme = ''
try { readme = readFileSync(README, 'utf8') } catch { readme = '' }
const start = readme.indexOf(PROSE.scriptsDoiRecord_readmeStart), end = readme.indexOf(PROSE.scriptsDoiRecord_readmeEnd), license = readme.indexOf('\n## License')
const published = start >= 0 && end > start ? readme.slice(0, start) + markdown + readme.slice(end + PROSE.scriptsDoiRecord_readmeEnd.length)
  : license >= 0 ? `${readme.slice(0, license + 1)}${markdown}\n\n${readme.slice(license + 1)}` : `${readme}\n${markdown}\n`

const check = process.argv.includes('--check')
let committed = ''
try { committed = readFileSync(RECORD, 'utf8') } catch { committed = '' }
const agrees = committed === text, shown = readme === published
if (!agrees && !check) writeFileSync(RECORD, text)
if (!shown && !check) writeFileSync(README, published)
console.log(JSON.stringify({ check, agrees, shown, written: !(agrees && shown) && !check, path: RECORD, readme: README, novelties: novelties.length, open: open.length, calls: available.length, theorems: THEOREMS.length, families: byFamily.length, unsourced }))
if (unsourced.length) {
  console.error(proseFill(PROSE.scriptsDoiRecord_s3, unsourced.join(', ')))
  process.exit(1)
}
if (!(agrees && shown) && check) {
  console.error(agrees ? PROSE.scriptsDoiRecord_s2 : PROSE.scriptsDoiRecord_s1)
  process.exit(1)
}
