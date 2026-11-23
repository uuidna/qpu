import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { SUPPORTED_PROTOCOL_VERSIONS } from '@modelcontextprotocol/server'
import { defineConfig, type HeadConfig } from 'vitepress'
import { VERSION } from '../../src/quantum/processing/unit/version.ts'

// The sidebar is written beside this file by scripts/site.ts from the seed waves; the theme beside it
// (./theme) registers the Vue components the generated pages use — the live MCP console and the qubit-price
// widget — so the static VitePress site and the live /api/mcp endpoint it is deployed with are one surface.
const sidebar = JSON.parse(readFileSync(new URL('./sidebar.json', import.meta.url), 'utf8'))
const HOST = 'https://qpu.uuidna.com'
const NAME = 'Quantum Processing Unit'
const DESCRIPTION = 'The QPU pages and MCP catalogue, served from the same seeds Lean proves — and the live MCP beside them'
const MCP = `${HOST}/api/mcp`
const REPOSITORY = 'https://github.com/uuidna/qpu'
const IMAGE = { url: `${HOST}/og.png`, width: 1200, height: 630, alt: NAME }
const WEBSITE = `${HOST}/#website`
const ORGANIZATION = `${HOST}/#organization`
const AUTHOR = { '@type': 'Person', name: 'Tsvetan Rouschev', sameAs: 'https://orcid.org/0009-0000-7312-9778' }

// Search engines show about 160 characters of a description: a longer one is cut at its last whole sentence (or word),
// and a page that states none is described by its first paragraph, never by the site default twice.
const clip = (text: string, max = 160) => {
  const t = text.replace(/\s+/g, ' ').trim()
  if (t.length < max) return t
  const sentence = t.slice(0, max).match(/^.*[.!?](?=\s|$)/)?.[0]
  return sentence && sentence.length >= 60 ? sentence : `${t.slice(0, max - 1).replace(/\s+\S*$/, '')}…`
}
const firstParagraph = (markdown: string) => markdown.replace(/^---\n[\s\S]*?\n---\n/, '').replace(/<!--[\s\S]*?-->/g, '').split(/\n\s*\n/)
  .map((block) => block.trim()).find((block) => block && !/^[#<|>`\-*!:]/.test(block))
  ?.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[`*_]/g, '')

const urlOf = (relativePath: string) => `${HOST}/${relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')}`
// The schema.org subject the page already carries as microdata, read back from the rendered HTML so the JSON-LD and
// the microdata name the same thing.
const subjectOf = (html: string) => {
  const m = html.match(/itemscope itemtype="https:\/\/schema\.org\/(DefinedTerm|SoftwareApplication)">\s*<meta itemprop="name" content="([^"]*)">(?:\s*<meta itemprop="inDefinedTermSet" content="([^"]*)">)?(?:\s*<meta itemprop="termCode" content="([^"]*)">)?/)
  const text = (s?: string) => s?.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  return m ? { '@type': m[1], name: text(m[2]), ...(m[3] ? { inDefinedTermSet: text(m[3]) } : {}), ...(m[4] ? { termCode: text(m[4]) } : {}) } : undefined
}

// A title or description two pages share is no longer unique to either: the title takes the page's wave or section,
// the description its title, both counted over the Markdown the seed wrote.
const SRC = new URL('..', import.meta.url)
const front = readdirSync(SRC, { recursive: true, encoding: 'utf8' }).filter((f) => f.endsWith('.md') && !/(^|\/)(\.vitepress|public|node_modules)\//.test(f))
  .map((f) => readFileSync(new URL(f, SRC), 'utf8').match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? '')
const counted = (key: string) => front.reduce((n, fm) => { const v = fm.match(new RegExp(`^${key}: (.*)$`, 'm'))?.[1]; if (v) n.set(JSON.parse(v), (n.get(JSON.parse(v)) ?? 0) + 1); return n }, new Map<string, number>())
const TITLES = counted('title'), DESCRIPTIONS = counted('description')

// Every rendered page, for llms.txt: its address, title and description as the head states them.
const pages = new Map<string, { url: string; title: string; description: string }>()

export default defineConfig({
  title: NAME,
  description: DESCRIPTION,
  lang: 'en',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: { hostname: HOST },
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#1b1b2a' }],
    ['meta', { property: 'og:site_name', content: NAME }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { property: 'og:image', content: IMAGE.url }],
    ['meta', { property: 'og:image:type', content: 'image/png' }],
    ['meta', { property: 'og:image:width', content: String(IMAGE.width) }],
    ['meta', { property: 'og:image:height', content: String(IMAGE.height) }],
    ['meta', { property: 'og:image:alt', content: IMAGE.alt }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: IMAGE.url }],
    ['meta', { name: 'twitter:image:alt', content: IMAGE.alt }],
  ],
  markdown: {
    lineNumbers: true,
    image: { lazyLoad: true },
  },
  transformPageData: (pageData, { siteConfig }) => {
    const fm = pageData.frontmatter, dir = pageData.relativePath.split('/').slice(0, -1).join('/')
    const title = (TITLES.get(fm.title) ?? 0) > 1 ? `${fm.title} · ${fm.wave ? `${fm.wave} wave` : fm.section ?? dir}` : pageData.title
    const stated = fm.description ?? firstParagraph(readFileSync(join(siteConfig.srcDir, pageData.filePath), 'utf8')) ?? DESCRIPTION
    return { title, description: clip((DESCRIPTIONS.get(fm.description) ?? 0) > 1 ? `${title}: ${stated}` : stated) }
  },
  // Per-page Open Graph, Twitter card, canonical address and JSON-LD: each generated page shares with its own address,
  // title and description, not the site default.
  transformHead: ({ pageData, content, siteConfig }): HeadConfig[] => {
    if (pageData.isNotFound || !siteConfig.pages.includes(pageData.relativePath)) return [['meta', { name: 'robots', content: 'noindex' }]]
    const title = String(pageData.title || NAME)
    const description = String(pageData.description || DESCRIPTION)
    const url = urlOf(pageData.relativePath)
    const home = pageData.relativePath === 'index.md'
    pages.set(pageData.relativePath, { url, title, description })
    const about = subjectOf(content)
    const crumbs = [{ name: NAME, item: `${HOST}/` }, ...pageData.relativePath.split('/').slice(0, -1).flatMap((_, i, dirs) => {
      const index = `${dirs.slice(0, i + 1).join('/')}/index.md`
      return siteConfig.pages.includes(index) && index !== pageData.relativePath ? [{ name: dirs[i]!, item: urlOf(index) }] : []
    }), ...(home ? [] : [{ name: title, item: url }])]
    const webpage = {
      '@type': home ? 'WebPage' : 'TechArticle', '@id': url, url, name: title, headline: title, description, inLanguage: 'en',
      isPartOf: { '@id': WEBSITE }, publisher: { '@id': ORGANIZATION }, author: AUTHOR, image: IMAGE.url,
      ...(pageData.lastUpdated ? { dateModified: new Date(pageData.lastUpdated).toISOString() } : {}),
      ...(about ? { about } : {}),
      ...(crumbs.length > 1 ? { breadcrumb: { '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, ...c })) } } : {}),
    }
    const site = home ? [
      { '@type': 'WebSite', '@id': WEBSITE, url: `${HOST}/`, name: NAME, description: DESCRIPTION, inLanguage: 'en', publisher: { '@id': ORGANIZATION }, author: AUTHOR },
      { '@type': 'Organization', '@id': ORGANIZATION, name: 'uuidna', url: 'https://uuidna.com', logo: `${HOST}/favicon.svg`, sameAs: ['https://github.com/uuidna'] },
      { '@type': 'WebAPI', '@id': `${MCP}#api`, name: `${NAME} MCP server`, url: MCP, description: 'Model Context Protocol server over Streamable HTTP; tools/call is paid through x402', documentation: `${HOST}/llms.txt`, provider: { '@id': ORGANIZATION } },
    ] : []
    return [
      ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large' }],
      ['meta', { property: 'og:type', content: home ? 'website' : 'article' }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
      ['link', { rel: 'canonical', href: url }],
      ['script', { type: 'application/ld+json' }, JSON.stringify({ '@context': 'https://schema.org', '@graph': [...site, webpage] })],
    ]
  },
  // The crawler files, derived at build from the pages just rendered and the MCP server the site is deployed with:
  // robots.txt, llms.txt and llms-full.txt (llmstxt.org), the AI Catalog (/.well-known/ai-catalog.json) and the MCP
  // Server Card at its reserved location <streamable-http-url>/server-card (SEP-2127), with the headers its
  // discovery document asks for (_headers, Workers static assets).
  buildEnd: (siteConfig) => {
    if (!pages.size) throw new Error('transformHead saw no page: llms.txt would be empty')
    const out = (path: string, text: string) => { mkdirSync(dirname(join(siteConfig.outDir, path)), { recursive: true }); writeFileSync(join(siteConfig.outDir, path), text) }
    const card = {
      $schema: 'https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json',
      name: 'com.uuidna/qpu', version: VERSION, title: NAME,
      description: 'ISO/IEC 4879 quantum vocabulary, Lean-proved, as MCP tools; tools/call paid via x402',
      websiteUrl: `${HOST}/`,
      repository: { url: REPOSITORY, source: 'github' },
      icons: [{ src: `${HOST}/favicon.svg`, mimeType: 'image/svg+xml', sizes: ['any'] }],
      remotes: [{ type: 'streamable-http', url: MCP, supportedProtocolVersions: [...SUPPORTED_PROTOCOL_VERSIONS] }],
      _meta: { 'com.uuidna/x402': { x402Version: 2, paid: 'tools/call', catalogue: `${HOST}/mcp.json` } },
    }
    out('api/mcp/server-card', `${JSON.stringify(card, null, 2)}\n`)
    out('.well-known/ai-catalog.json', `${JSON.stringify({
      specVersion: '0.9',
      host: { displayName: 'uuidna', identifier: 'qpu.uuidna.com', documentationUrl: `${HOST}/llms.txt`, logoUrl: `${HOST}/favicon.svg` },
      entries: [{ identifier: 'urn:air:qpu.uuidna.com:qpu:mcp', displayName: NAME, type: 'application/mcp-server-card+json', url: `${MCP}/server-card` }],
    }, null, 2)}\n`)
    const cors = ['  Access-Control-Allow-Origin: *', '  Access-Control-Allow-Methods: GET', '  Access-Control-Allow-Headers: Content-Type, If-None-Match', '  Access-Control-Expose-Headers: ETag', '  Cache-Control: public, max-age=3600']
    out('_headers', [
      '/api/mcp/server-card', '  Content-Type: application/mcp-server-card+json', ...cors, '',
      '/.well-known/ai-catalog.json', '  Content-Type: application/ai-catalog+json', ...cors, '',
      ...['/llms.txt', '/llms-full.txt'].flatMap((path) => [path, '  Content-Type: text/plain; charset=utf-8', '  Access-Control-Allow-Origin: *', '']),
    ].join('\n'))
    out('robots.txt', ['User-agent: *', 'Allow: /', '', `Sitemap: ${HOST}/sitemap.xml`, ''].join('\n'))
    const sorted = [...pages.entries()].sort(([a], [b]) => (a === 'index.md' ? -1 : b === 'index.md' ? 1 : a.localeCompare(b, 'en', { numeric: true })))
    const sections = Map.groupBy(sorted, ([path]) => (path.includes('/') ? path.split('/')[0]! : 'pages'))
    const home = pages.get('index.md')
    out('llms.txt', [
      `# ${NAME}`, '', `> ${home?.description ?? DESCRIPTION}`, '',
      '## MCP server', '',
      `- [Endpoint](${MCP}): Model Context Protocol, Streamable HTTP transport (POST JSON-RPC), protocol versions ${SUPPORTED_PROTOCOL_VERSIONS.join(', ')}. tools/list and resources/list are free; tools/call is paid through x402 v2: an unpaid call answers with the payment requirements in the result's _meta["x402/error"]; retry with the signed payment in params._meta["x402/payment"] (or the PAYMENT-SIGNATURE header).`,
      `- [Server Card](${MCP}/server-card): MCP Server Card (SEP-2127), application/mcp-server-card+json`,
      `- [AI Catalog](${HOST}/.well-known/ai-catalog.json): domain-level discovery of the server card`,
      `- [Tool catalogue](${HOST}/mcp.json): every tool with its input schema, as tools/list answers`,
      `- Connect: add a remote (Streamable HTTP) MCP server with the URL ${MCP} in any MCP client, e.g. \`claude mcp add --transport http qpu ${MCP}\``, '',
      ...[...sections].flatMap(([section, list]) => [`## ${section}`, '', ...list.map(([, p]) => `- [${p.title}](${p.url}): ${p.description}`), '']),
      '## Optional', '', `- [llms-full.txt](${HOST}/llms-full.txt): the Markdown source of every page`, `- [Source](${REPOSITORY}): the repository`, '',
    ].join('\n'))
    out('llms-full.txt', sorted.map(([path, p]) => `<!-- ${p.url} -->\n${readFileSync(join(siteConfig.srcDir, path), 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '').trim()}\n`).join('\n'))
  },
  themeConfig: {
    logo: { src: '/favicon.svg', alt: NAME },
    nav: [
      { text: 'Catalogue', link: '/catalogue' },
      { text: 'Draft applications', link: '/patents/' },
      { text: 'Prose', link: '/prose/' },
      { text: 'MCP', items: [
        { text: 'Catalogue (JSON)', link: '/mcp.json', target: '_blank' },
        { text: 'Live endpoint /api/mcp', link: '/api/mcp', target: '_blank' },
        { text: 'Server Card', link: '/api/mcp/server-card', target: '_blank' },
        { text: 'llms.txt', link: '/llms.txt', target: '_blank' },
      ] },
    ],
    sidebar,
    outline: { level: [2, 3], label: 'On this page' },
    search: { provider: 'local', options: { detailedView: true } },
    socialLinks: [{ icon: 'github', link: REPOSITORY }],
    editLink: undefined,
    lastUpdated: { text: 'Proven', formatOptions: { dateStyle: 'medium' } },
    docFooter: { prev: 'Previous', next: 'Next' },
    footer: {
      message: 'Served over MCP. CC-BY-NC-ND-4.0 — the a432 harmonic default is free under attribution.',
      copyright: '© Tsvetan Rouschev · priced in qubits, always below the quantum market',
    },
  },
})
