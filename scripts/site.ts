// The site from the quantum tree, each page with its kernel-checked proofs as schema.org microdata.
import { PROSE } from '../src/quantum/processing/prose-index.ts'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { TOOLBOXES, handle } from '../src/quantum/processing/mcp.ts'
import { ISO_CLAUSES, ISO_GROUPS, ISO_STANDARDS, ISO_VOCABULARY } from '../src/quantum/processing/iso-index.ts'
import { THEOREMS } from '../src/quantum/processing/theorems-index.ts'
import { page } from './oneText.ts'
import { listEnvelope } from '../src/quantum/processing/toolbox.ts'
import { catalogProduct, catalogSummary } from '../src/quantum/processing/catalog.ts'
import { EXAMPLES } from '../src/quantum/processing/examples.ts'

type Proof = { key: string; module: string; statement: string; axioms: readonly string[] }
type Subject = { type: 'DefinedTerm' | 'SoftwareApplication'; name: string; set?: string; code?: string }
type Page = { title: string; url: string; description: string; lines: string[]; subject: Subject; proofs: Proof[] }
type Section = { name: string; pages: Page[] }

const out = 'site'
const REPOSITORY = 'https://github.com/uuidna/qpu/blob/main/lean'
const yaml = (text: string) => JSON.stringify(text.replace(/\s+/g, ' ').trim())
const plain = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\{\{/g, '&#123;&#123;').replace(/([\\`*_|#[\]])/g, '\\$1')
const html = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-|-$/g, '')
const write = (path: string, text: string) => { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, text) }
const proofOf = (key: string | null | undefined): Proof[] => THEOREMS.filter((t) => t.key === key).map(({ key, module, statement, axioms }) => ({ key, module, statement, axioms }))

const microdata = (subject: Subject, proofs: readonly Proof[]) => [
  `<div v-pre class="qpu-proofs" itemscope itemtype="https://schema.org/${subject.type}">`,
  `<meta itemprop="name" content="${html(subject.name)}">`,
  ...(subject.set ? [`<meta itemprop="inDefinedTermSet" content="${html(subject.set)}">`] : []),
  ...(subject.code ? [`<meta itemprop="termCode" content="${html(subject.code)}">`] : []),
  ...proofs.map((p) => [
    `<section itemprop="subjectOf" itemscope itemtype="https://schema.org/SoftwareSourceCode">`,
    `<h3 itemprop="name">${html(p.key)}</h3>`,
    `<meta itemprop="programmingLanguage" content="Lean 4">`,
    `<link itemprop="codeRepository" href="${REPOSITORY}/${p.module.replace(/\./g, '/')}.lean">`,
    `<p><code itemprop="isPartOf">${html(p.module)}</code> · <span itemprop="keywords">${html(p.axioms.length ? p.axioms.join(', ') : 'no axioms')}</span></p>`,
    `<pre><code itemprop="text">${html(p.statement)}</code></pre>`,
    `</section>`,
  ].join('\n')),
  `</div>`,
].join('\n')

const sections: Section[] = [
  ...ISO_GROUPS.map((group) => ({
    name: `${group.group} ${group.title}`,
    pages: ISO_CLAUSES.filter((c) => c.clause.startsWith(`${group.group}.`)).map((c) => ({
      title: `${c.clause} ${c.name}`, url: `/${slug(`${c.clause} ${c.name}`)}`, description: c.says, lines: [c.says],
      subject: { type: 'DefinedTerm' as const, name: c.name, set: ISO_VOCABULARY, code: c.clause }, proofs: proofOf(c.witness),
    })),
  })),
  {
    name: 'standards',
    pages: ISO_STANDARDS.map((s) => ({
      title: s.reference, url: `/standards/${slug(s.reference)}`, description: s.says, lines: [s.says],
      subject: { type: 'DefinedTerm' as const, name: s.reference, set: 'ISO' }, proofs: proofOf(s.witness),
    })),
  },
  {
    name: 'mcp',
    pages: TOOLBOXES.map((box) => ({
      title: box.name, url: `/mcp/${slug(box.name)}`, description: box.idea, lines: [box.idea, ...box.tools.map((tool) => `${tool.name}: ${tool.description}`)],
      subject: { type: 'SoftwareApplication' as const, name: box.name },
      proofs: [...new Set(box.examples.map((e) => e.theorem).filter((t): t is string => typeof t === 'string'))].flatMap(proofOf),
    })),
  },
]

const sidebar: { text: string; collapsed: boolean; items: { text: string; link: string }[] }[] = []
let pages = 0, proofs = 0
for (const section of sections) {
  for (const page of section.pages) {
    write(join(out, `${page.url}.md`), [
      '---', `title: ${yaml(page.title)}`, `description: ${yaml(page.description)}`, `section: ${yaml(section.name)}`, '---', '',
      `# ${plain(page.title)}`, '', ...page.lines.flatMap((line) => [plain(line), '']),
      ...(page.proofs.length ? [PROSE.scriptsSite_proofs1, '', microdata(page.subject, page.proofs), ''] : []),
    ].join('\n'))
    pages += 1
    proofs += page.proofs.length
  }
  sidebar.push({ text: section.name, collapsed: true, items: section.pages.map((page) => ({ text: page.title, link: page.url })) })
}

write(join(out, 'catalogue.md'), ['---', 'title: "Catalogue of claims"', '---', '', readFileSync('src/quantum/CATALOGUE.md', 'utf8')].join('\n'))
const tools = TOOLBOXES.flatMap((box) => box.tools.map((tool) => ({ name: tool.name, toolbox: box.name, description: tool.description, inputSchema: tool.inputSchema })))
write(join(out, 'public', 'mcp.json'), JSON.stringify({ live: 'POST /api/mcp', says: PROSE.scriptsSite_says1, tools }, null, 2))
write(join('docs', 'public', 'mcp.json'), JSON.stringify({ tools: (handle(listEnvelope()) as { result: { tools: unknown } }).result.tools }, null, 2))
write(join(out, '.vitepress', 'sidebar.json'), JSON.stringify(sidebar))
// the catalog's index: its count as the catalog states it, then every product by module, each a link to the page its route writes
const counted = catalogSummary(EXAMPLES)
const facts: [string, string][] = [['products', String(counted.products)], ['examples', String(counted.examples)], ['witnesses', String(counted.witnesses)], ['variants', String(counted.variants)], ['walked', String(counted.walked)], ['discovered', counted.discovered], ['unclaimed', String(counted.unclaimed.products)], ['price', String(counted.funding.price)], ['funding', counted.funding.donation], ['root', `\`${counted.receipt.root}\``], ['receipt', `\`${counted.receipt.address}\``], ['documents', ['/api/catalog', ...counted.order.filter((c) => c !== 'variants').map((c) => `/api/${c}`)].join(' ')]]
write(join(out, 'catalog', 'index.md'), ['---', 'title: "Products"', `description: ${yaml(counted.says)}`, '---', '', '# Products', '', '| | |', '|---|---|', ...facts.map(([k, v]) => `| ${k} | ${v} |`), '', ...[...Map.groupBy(THEOREMS, (t) => t.module)].flatMap(([module, rows]) => [`## ${plain(module)}`, '', ...rows.map((t) => `- [${plain(t.key)}](/catalog/${catalogProduct(EXAMPLES, t.key).product.id})`), ''])].join('\n'))
// the page every product is routed through (site/catalog/[product].paths.ts): its heading is the theorem and its body the route's content
write(join(out, 'catalog', '[product].md'), ['---', 'layout: doc', '---', '', '# {{ $params.theorem }}', '', '<!-- @content -->', ''].join('\n'))
// the home page is the one text the build writes (scripts/oneText.ts): the same as the README, the npm README and the Zenodo record
write(join(out, 'index.md'), ['---', 'title: "Quantum Processing Unit"', PROSE.scriptsSite_s2, '---', '', '::: v-pre', '', page, '', ':::', ''].join('\n'))
console.log(JSON.stringify({ pages, proofs, sections: sections.length, tools: tools.length, out }))
