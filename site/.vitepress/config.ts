import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { crc32, deflateSync } from 'node:zlib'
import { SUPPORTED_PROTOCOL_VERSIONS } from '@modelcontextprotocol/server'
import { defineConfig, type HeadConfig } from 'vitepress'
import { VERSION } from '../../src/quantum/processing/unit/version.ts'
import { LICENSE, PRECEDENCE } from '../../src/quantum/processing/unit/license.ts'
import { PROSE, proseFill } from '../../src/quantum/processing/prose-index.ts'
import { UNIT_CONCEPT_DOI } from '../../src/quantum/processing/release.ts'
import { TENANTS } from '../../src/quantum/processing/unit/tenants.ts'
import { coilColour, rgbOfHsl, toFrames } from '../../src/quantum/processing/unit/theme.ts'
import { style } from '../../src/quantum/uuid/index.ts'
import { FOLD } from './theme/fold-index.ts'

// The sidebar is written beside this file by scripts/site.ts from the seed waves; the theme beside it
// (./theme) registers the Vue components the generated pages use — the live MCP console and the qubit-price
// widget — so the static VitePress site and the live /api/mcp endpoint it is deployed with are one surface.
const sidebar = JSON.parse(readFileSync(new URL('./sidebar.json', import.meta.url), 'utf8'))
const HOST = 'https://qpu.uuidna.com'
const NAME = 'Quantum Processing Unit'
const DESCRIPTION = 'The QPU pages and MCP catalogue, served from the same seeds Lean proves — and the live MCP beside them'
const MCP = `${HOST}/api/mcp`
// the domains bound to the Worker are the tenants' hosts, and a call on one of them is free (serveMcp)
const HOSTS = new Intl.ListFormat('en').format(Object.keys(TENANTS))
const REPOSITORY = 'https://github.com/uuidna/qpu'
const IMAGE = { url: `${HOST}/og.png`, width: 1200, height: 630, alt: NAME }
// The mark is zero. The sixteen hex digits stand around one hole, each at its own hue (a digit a hue, 22.5° apart:
// theme.ts toFrames), in the saturation and lightness every QPU hue wears (coilColour). Every number over zero is
// zero (textbook_div_zero), so a line runs from each digit to the centre. Each segment is as long at its middle as
// the ring is thick, which the count of digits fixes: hole over ring = (n - pi) / (n + pi). The ground is the ink of
// the licence's own address (style). Nothing here is drawn by hand: the icon and the social image are written at build.
const DIGITS = toFrames(Array.from({ length: FOLD.digits }, (_, d) => d.toString(FOLD.digits)).join(''))
const numbers = (css: string) => css.match(/[\d.]+/g)!.map(Number)
const [, SATURATION, LIGHTNESS] = numbers(coilColour().coin.css) as [number, number, number]
const rgbOf = (h: number, s: number, l: number) => rgbOfHsl(h, s / 100, l / 100)
const hexOf = (rgb: readonly number[]) => `#${rgb.map((v) => v.toString(16).padStart(2, '0')).join('')}`
const INKS = DIGITS.map((d) => rgbOf(d.hue!, SATURATION, LIGHTNESS))
const GROUND = rgbOf(...(numbers(style(LICENSE.address).vars['--qpu-ink']) as [number, number, number]))
const HOLE = (DIGITS.length - Math.PI) / (DIGITS.length + Math.PI)
const TURN = (2 * Math.PI) / DIGITS.length
// a line's width over the ring's radius, and how strongly it shows at the rim: one digit's share of the ring's thickness, and the hole's share of the ring
const LINE = (1 - HOLE) / DIGITS.length, SHOWN = HOLE
const at = (angle: number, radius: number) => `${(radius * Math.sin(angle)).toFixed(4)} ${(-radius * Math.cos(angle)).toFixed(4)}`
// The icon folds, and holds what it needs. Lean writes the plan (lean/tools/Fold.lean, from
// Advantage.fold_upper_onto_lower): how many digits stand in the ring, the half the places still spread fold onto at
// each fold, and the folds each digit takes part in, after which every digit lies on digit 0. The same folds open the
// ring again (Advantage.fold_unfold), one fold for each period of the licence address's clock (style). Here a fold is
// only drawn: a turn about the boundary between the two halves, seen from above, is a scale across it from 1 through
// 0 to -1. Folded colours add as light does. The icon
// computes each digit's hue from the digit in its own CSS and carries the work's citation (SOFTWARE) as its metadata.
// A reader that runs no CSS sees the ring open, in the same colours, which are also written on each segment.
const FOLDS = FOLD.halves.map((half, j) => ({ fold: j + 1, half }))
const markSvg = () => {
  const beats = 2 * FOLDS.length, beat = (n: number) => `${(100 * n / beats).toFixed(3)}%`
  const css = [
    `svg{--qpu-period:${style(LICENSE.address).vars['--qpu-period']}}`,
    `path[style]{fill:hsl(calc(var(--d)*1turn/${DIGITS.length}) ${SATURATION}% ${LIGHTNESS}%)}`,
    'path{mix-blend-mode:screen}',
    ...FOLDS.map(({ fold }) => `.f${fold}{animation:f${fold} calc(${beats}*var(--qpu-period)) ease-in-out infinite}@keyframes f${fold}{0%,${beat(fold - 1)}{transform:scaleY(1)}${beat(fold)},${beat(beats - fold)}{transform:scaleY(-1)}${beat(beats - fold + 1)},100%{transform:scaleY(1)}}`),
    '@media (prefers-reduced-motion:reduce){g{animation:none!important}}',
  ].join('')
  const segment = (ink: readonly number[], i: number) => {
    const from = (i - 0.5) * TURN, to = (i + 0.5) * TURN, colour = hexOf(ink)
    let body = `<linearGradient id="l${i}" gradientUnits="userSpaceOnUse" x1="${(HOLE * Math.sin(i * TURN)).toFixed(4)}" y1="${(-HOLE * Math.cos(i * TURN)).toFixed(4)}" x2="0" y2="0"><stop stop-color="${colour}" stop-opacity="${SHOWN.toFixed(4)}"/><stop offset="1" stop-color="${colour}" stop-opacity="0"/></linearGradient>`
      + `<path style="--d:${i}" fill="${colour}" d="M${at(from, 1)}A1 1 0 0 1 ${at(to, 1)}L${at(to, HOLE)}A${HOLE.toFixed(4)} ${HOLE.toFixed(4)} 0 0 0 ${at(from, HOLE)}Z"/>`
      + `<path stroke="url(#l${i})" stroke-width="${LINE.toFixed(4)}" d="M${at(i * TURN, HOLE)}L0 0"/>`
    for (const { fold, half } of FOLDS) if (FOLD.moves[i]![fold - 1]) {
      // the fold line leaves the centre at the boundary between the two halves: turn it onto the x axis, scale across it, turn back
      const turned = ((half - 0.5) * TURN * 180 / Math.PI - 90).toFixed(2)
      body = `<g transform="rotate(${turned})"><g class="f${fold}"><g transform="rotate(${-turned})">${body}</g></g></g>`
    }
    return body
  }
  const cited = JSON.stringify({ '@context': 'https://schema.org', ...SOFTWARE }).replace(/&/g, '&amp;').replace(/</g, '&lt;')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 2 2"><title>${NAME}</title><metadata>${cited}</metadata><style>${css}</style><g style="isolation:isolate">${INKS.map(segment).join('')}</g></svg>\n`
}
// The social image: the same mark on its ground, each pixel the mean of nine samples, as an 8-bit RGB PNG (ISO/IEC 15948).
const markPng = (width: number, height: number) => {
  const radius = height * HOLE / 2, rows = Buffer.alloc(height * (1 + width * 3))
  const sample = (x: number, y: number): readonly number[] => {
    const r = Math.hypot(x, y) / radius, turn = ((Math.atan2(x, -y) / TURN) % DIGITS.length + DIGITS.length) % DIGITS.length, i = Math.round(turn) % DIGITS.length
    if (r > 1) return GROUND
    if (r >= HOLE) return INKS[i]!
    const off = Math.abs(turn - Math.round(turn)) * TURN * r
    const shown = off < LINE / 2 ? SHOWN * (r / HOLE) : 0
    return GROUND.map((g, c) => g + (INKS[i]![c]! - g) * shown)
  }
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const sum = [0, 0, 0]
    for (const dy of [1, 3, 5]) for (const dx of [1, 3, 5]) sample(x + dx / 6 - width / 2, y + dy / 6 - height / 2).forEach((v, c) => { sum[c]! += v })
    sum.forEach((v, c) => { rows[y * (1 + width * 3) + 1 + x * 3 + c] = Math.round(v / 9) })
  }
  const chunk = (type: string, data: Buffer) => { const body = Buffer.concat([Buffer.from(type, 'latin1'), data]), size = Buffer.alloc(4), sum = Buffer.alloc(4); size.writeUInt32BE(data.length); sum.writeUInt32BE(crc32(body)); return Buffer.concat([size, body, sum]) }
  const header = Buffer.alloc(13); header.writeUInt32BE(width, 0); header.writeUInt32BE(height, 4); header.set([8, 2, 0, 0, 0], 8)
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', header), chunk('IDAT', deflateSync(rows, { level: 9 })), chunk('IEND', Buffer.alloc(0))])
}
const WEBSITE = `${HOST}/#website`
const ORGANIZATION = `${HOST}/#organization`
// the author, the ORCID, the work and its licence deed are the licence table's (unit/license.ts)
const ORCID = LICENSE.orcid
const AUTHOR = { '@type': 'Person', '@id': ORCID, name: LICENSE.author, url: ORCID, sameAs: ORCID, identifier: { '@type': 'PropertyValue', propertyID: 'ORCID', value: ORCID.slice(ORCID.lastIndexOf('/') + 1) } }
// A DOI as schema.org states one: the identifier, and the address that resolves it.
const doi = (value: string) => ({ identifier: { '@type': 'PropertyValue', propertyID: 'DOI', value }, sameAs: `https://doi.org/${value}` })
// The software as a citable work: its concept DOI names every version (release.ts), and the author's other records
// in the precedence table are what it cites, each by its own DOI.
const SOFTWARE = {
  '@type': 'SoftwareSourceCode', '@id': `${HOST}/#software`, name: LICENSE.work, description: DESCRIPTION, url: `${HOST}/`, codeRepository: REPOSITORY,
  version: VERSION, license: LICENSE.deed, author: AUTHOR, publisher: { '@id': ORGANIZATION }, ...doi(UNIT_CONCEPT_DOI),
  citation: PRECEDENCE.filter((r) => !r.title.startsWith(LICENSE.work)).map((r) => ({ '@type': 'ScholarlyArticle', name: r.title, author: AUTHOR, datePublished: String(r.year), ...doi(r.doi) })),
}

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
    ['meta', { name: 'theme-color', content: hexOf(GROUND) }],
    ['meta', { name: 'author', content: AUTHOR.name }],
    // FAIR Signposting (signposting.org): the author, the persistent identifier to cite, and the licence, as typed links
    ['link', { rel: 'author', href: ORCID }],
    ['link', { rel: 'cite-as', href: SOFTWARE.sameAs }],
    ['link', { rel: 'license', href: LICENSE.deed }],
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
      { '@type': 'WebAPI', '@id': `${MCP}#api`, name: `${NAME} MCP server`, url: MCP, description: proseFill(PROSE.siteVitepressConfig_webApi, HOSTS), documentation: `${HOST}/llms.txt`, provider: { '@id': ORGANIZATION } },
      SOFTWARE,
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
    const out = (path: string, text: string | Buffer) => { mkdirSync(dirname(join(siteConfig.outDir, path)), { recursive: true }); writeFileSync(join(siteConfig.outDir, path), text) }
    out('favicon.svg', markSvg())
    out('og.png', markPng(IMAGE.width, IMAGE.height))
    const card = {
      $schema: 'https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json',
      name: 'com.uuidna/qpu', version: VERSION, title: NAME,
      description: proseFill(PROSE.siteVitepressConfig_card, HOSTS),
      websiteUrl: `${HOST}/`,
      repository: { url: REPOSITORY, source: 'github' },
      icons: [{ src: `${HOST}/favicon.svg`, mimeType: 'image/svg+xml', sizes: ['any'] }],
      remotes: [{ type: 'streamable-http', url: MCP, supportedProtocolVersions: [...SUPPORTED_PROTOCOL_VERSIONS] }],
      _meta: { 'com.uuidna/x402': { x402Version: 2, free: Object.keys(TENANTS), catalogue: `${HOST}/mcp.json` } },
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
      `- [Endpoint](${MCP}): ${proseFill(PROSE.siteVitepressConfig_endpoint, SUPPORTED_PROTOCOL_VERSIONS.join(', '), HOSTS)}`,
      `- [Server Card](${MCP}/server-card): MCP Server Card (SEP-2127), application/mcp-server-card+json`,
      `- [AI Catalog](${HOST}/.well-known/ai-catalog.json): domain-level discovery of the server card`,
      `- [Tool catalogue](${HOST}/mcp.json): every tool with its input schema, as tools/list answers`,
      `- Connect: add a remote (Streamable HTTP) MCP server with the URL ${MCP} in any MCP client, e.g. \`claude mcp add --transport http qpu ${MCP}\``, '',
      ...[...sections].flatMap(([section, list]) => [`## ${section}`, '', ...list.map(([, p]) => `- [${p.title}](${p.url}): ${p.description}`), '']),
      '## Cite', '', `- [${AUTHOR.name}](${ORCID}): ${proseFill(PROSE.siteVitepressConfig_citeAuthor, AUTHOR.name, AUTHOR.identifier.value)}`, `- [${SOFTWARE.name}](${SOFTWARE.sameAs}): ${proseFill(PROSE.siteVitepressConfig_citeWork, UNIT_CONCEPT_DOI)}`,
      ...SOFTWARE.citation.map((c) => `- [${c.name}](${c.sameAs}): ${proseFill(PROSE.siteVitepressConfig_citeRecord, c.identifier.value)}`), '',
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
