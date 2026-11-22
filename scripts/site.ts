// The VitePress site, from the quantum tree itself: one section per clause of the ISO/IEC 4879:2024 vocabulary, one for
// the standards it fuses, and one page per MCP toolbox with its tools. The MCP catalogue becomes static JSON beside it. A
// static site answers no tools/call: mcp.json is what tools/list answers, and the live door stays POST /api/mcp.
import { PROSE } from '../src/quantum/processing/prose-index.ts'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { TOOLBOXES, handle } from '../src/quantum/processing/mcp.ts'
import { QUANTUM_TERMS } from '../src/quantum/processing/quantum-vocabulary.ts'
import { ISO_DIMENSIONS } from '../src/quantum/processing/iso-index.ts'

type Page = { title: string; url: string; description: string; lines: string[] }
type Section = { name: string; pages: Page[] }

const out = 'site'
const yaml = (text: string) => JSON.stringify(text.replace(/\s+/g, ' ').trim())
/** Markdown and Vue read the page as text: no tag, no interpolation, no accidental markup. */
const plain = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\{\{/g, '&#123;&#123;').replace(/([\\`*_|#[\]])/g, '\\$1')
const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-|-$/g, '')
const write = (path: string, text: string) => { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, text) }

const clauses = [...new Set(QUANTUM_TERMS.map((term) => term.clause.split('.').slice(0, 2).join('.')))]
const sections: Section[] = [
  ...clauses.map((clause) => ({
    name: clause,
    pages: QUANTUM_TERMS.filter((term) => term.clause.startsWith(`${clause}.`)).map((term) => ({ title: `${term.clause} ${term.name}`, url: `/${slug(`${term.clause} ${term.name}`)}`, description: `${term.standard} ${term.clause}`, lines: [`${term.standard} ${term.clause}: ${term.name}`] })),
  })),
  { name: 'standards', pages: ISO_DIMENSIONS.map((dimension) => ({ title: dimension, url: `/standards/${slug(dimension)}`, description: dimension, lines: [dimension] })) },
  {
    name: 'mcp',
    pages: TOOLBOXES.map((box) => ({ title: box.name, url: `/mcp/${slug(box.name)}`, description: box.idea, lines: [box.idea, ...box.tools.map((tool) => `${tool.name}: ${tool.description}`)] })),
  },
]

const sidebar: { text: string; collapsed: boolean; items: { text: string; link: string }[] }[] = []
let pages = 0
for (const section of sections) {
  for (const page of section.pages) {
    write(join(out, `${page.url}.md`), ['---', `title: ${yaml(page.title)}`, `description: ${yaml(page.description)}`, `section: ${yaml(section.name)}`, '---', '', `# ${plain(page.title)}`, '', ...page.lines.flatMap((line) => [plain(line), ''])].join('\n'))
    pages += 1
  }
  sidebar.push({ text: section.name, collapsed: true, items: section.pages.map((page) => ({ text: page.title, link: page.url })) })
}

// the catalogue of claims Lean writes, as a page of the site
write(join(out, 'catalogue.md'), ['---', 'title: "Catalogue of claims"', '---', '', readFileSync('src/quantum/CATALOGUE.md', 'utf8')].join('\n'))
const tools = TOOLBOXES.flatMap((box) => box.tools.map((tool) => ({ name: tool.name, toolbox: box.name, description: tool.description, inputSchema: tool.inputSchema })))
write(join(out, 'public', 'mcp.json'), JSON.stringify({ live: 'POST /api/mcp', says: PROSE.scriptsSite_says1, tools }, null, 2))
// the manifest the repository publishes beside the docs: exactly what tools/list answers
write(join('docs', 'public', 'mcp.json'), JSON.stringify({ tools: (handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) as { result: { tools: unknown } }).result.tools }, null, 2))
write(join(out, '.vitepress', 'sidebar.json'), JSON.stringify(sidebar))
write(join(out, 'index.md'), [
  '---', 'title: "Quantum Processing Unit"', PROSE.scriptsSite_s2, '---', '',
  '# Quantum Processing Unit', '',
  PROSE.scriptsSite_s3, '',
  `- ${pages} pages in ${sections.length} sections, listed in the sidebar`,
  `- [The MCP catalogue](/mcp.json): ${tools.length} tools in ${TOOLBOXES.length} toolboxes, as \`tools/list\` answers them. Calls go to \`POST /api/mcp\` on the live site.`,
  '- [Catalogue of claims](/catalogue): every theorem the kernel accepted, as a product claimed by its author',
  '- [Draft applications](/patents/): one draft per theoretical use, written by Lean from its inline docs and frontmatter',
  '- [Prose](/prose/): every sentence, by the Lean definition that states it; [prose.json](/prose.json) is the same list for a client', '',
].join('\n'))
console.log(JSON.stringify({ pages, sections: sections.length, tools: tools.length, out }))
