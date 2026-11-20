// The VitePress site, from the same seeds Payload writes. Each seed page becomes one Markdown page at its
// breadcrumb URL, the MCP catalogue becomes static JSON, and the sidebar lists the waves. When Payload or its
// database is down, this site still serves every page and the catalogue. A static site answers no tools/call:
// mcp.json is what tools/list answers, and the live door stays POST /api/mcp.
import { PROSE } from '../quantum/processing/prose-index.ts'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { TOOLBOXES } from '../quantum/processing/mcp.ts'
import { allSeedWaves } from './seedWaves.ts'

type Text = { text?: string; children?: Text[] }
type Page = {
  title: string
  slug: string
  meta: { title: string; description: string }
  breadcrumbs: { url: string; label: string }[]
  layout: { contentFields: { columnOne: { root: { children: Text[] } } } }[]
}

const out = 'site'
const yaml = (text: string) => JSON.stringify(text.replace(/\s+/g, ' ').trim())
/** Markdown and Vue read the page as text: no tag, no interpolation, no accidental markup. */
const plain = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\{\{/g, '&#123;&#123;').replace(/([\\`*_|#[\]])/g, '\\$1')
const textOf = (node: Text): string => node.text ?? (node.children ?? []).map(textOf).join('')
const write = (path: string, text: string) => { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, text) }

const waves = allSeedWaves() as unknown as { name: string; pages: Page[] }[]
const seen = new Map<string, string>()
const sidebar: { text: string; collapsed: boolean; items: { text: string; link: string }[] }[] = []
for (const wave of waves) {
  const items: { text: string; link: string }[] = []
  for (const page of wave.pages) {
    const url = page.breadcrumbs.at(-1)?.url ?? `/${page.slug}`
    // the home page of a wave and the site's own index must not collide with another seed at the same URL
    if (seen.has(url)) continue
    seen.set(url, wave.name)
    const paragraphs = page.layout.flatMap((block) => block.contentFields.columnOne.root.children.map(textOf)).filter((line) => line.length > 0)
    const trail = page.breadcrumbs.slice(0, -1).map((crumb) => `[${plain(crumb.label)}](${crumb.url})`).join(' / ')
    write(join(out, `${url}.md`), [
      '---', `title: ${yaml(page.meta.title || page.title)}`, `description: ${yaml(page.meta.description)}`, `wave: ${yaml(wave.name)}`, '---', '',
      `# ${plain(page.title)}`, '', ...(trail ? [trail, ''] : []), ...paragraphs.flatMap((line) => [plain(line), '']),
    ].join('\n'))
    items.push({ text: page.title, link: url })
  }
  sidebar.push({ text: wave.name, collapsed: true, items })
}

// the catalogue of claims Lean writes, as a page of the site
write(join(out, 'catalogue.md'), ['---', 'title: "Catalogue of claims"', '---', '', readFileSync('src/quantum/CATALOGUE.md', 'utf8')].join('\n'))
const tools = TOOLBOXES.flatMap((box) => box.tools.map((tool) => ({ name: tool.name, toolbox: box.name, description: tool.description, inputSchema: tool.inputSchema })))
write(join(out, 'public', 'mcp.json'), JSON.stringify({ live: 'POST /api/mcp', says: PROSE.scriptsSite_says1, tools }, null, 2))
write(join(out, '.vitepress', 'sidebar.json'), JSON.stringify(sidebar))
write(join(out, 'index.md'), [
  '---', 'title: "Quantum Processing Unit"', PROSE.scriptsSite_s2, '---', '',
  '# Quantum Processing Unit', '',
  PROSE.scriptsSite_s3, '',
  `- ${seen.size} pages in ${waves.length} waves, listed in the sidebar`,
  `- [The MCP catalogue](/mcp.json): ${tools.length} tools in ${TOOLBOXES.length} toolboxes, as \`tools/list\` answers them. Calls go to \`POST /api/mcp\` on the live site.`,
  '- [Catalogue of claims](/catalogue): every theorem the kernel accepted, as a product claimed by its author',
  '- [Draft applications](/patents/): one draft per theoretical use, written by Lean from its inline docs and frontmatter',
  '- [Prose](/prose/): every sentence, by the Lean definition that states it; [prose.json](/prose.json) is the same list for a client', '',
].join('\n'))
console.log(JSON.stringify({ pages: seen.size, waves: waves.length, tools: tools.length, out }))
