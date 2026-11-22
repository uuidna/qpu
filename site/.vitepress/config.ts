import { readFileSync } from 'node:fs'
import { defineConfig, type HeadConfig } from 'vitepress'

// The sidebar is written beside this file by src/scripts/site.ts from the seed waves; the theme beside it
// (./theme) registers the Vue components the generated pages use — the live MCP console and the qubit-price
// widget — so the static VitePress site and the live /api/mcp endpoint it is deployed with are one surface.
const sidebar = JSON.parse(readFileSync(new URL('./sidebar.json', import.meta.url), 'utf8'))
const HOST = 'https://qpu.uuidna.com'

export default defineConfig({
  title: 'Quantum Processing Unit',
  description: 'The QPU pages and MCP catalogue, served from the same seeds Lean proves — and the live MCP beside them',
  lang: 'en',
  cleanUrls: true,
  lastUpdated: true,
  metaChunk: true,
  sitemap: { hostname: HOST },
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#1b1b2a' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Quantum Processing Unit' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],
  markdown: {
    lineNumbers: true,
    image: { lazyLoading: true },
  },
  // Per-page Open Graph: the QPU computes a title and description for every page; carry them into the head so each
  // generated page shares with its own address, not the site default.
  transformHead: ({ pageData }): HeadConfig[] => {
    const title = pageData.frontmatter.title ?? pageData.title ?? 'Quantum Processing Unit'
    const description = pageData.frontmatter.description ?? pageData.description ?? ''
    const url = `${HOST}/${pageData.relativePath.replace(/(index)?\.md$/, '')}`
    return [
      ['meta', { property: 'og:title', content: String(title) }],
      ['meta', { property: 'og:description', content: String(description) }],
      ['meta', { property: 'og:url', content: url }],
      ['link', { rel: 'canonical', href: url }],
    ]
  },
  themeConfig: {
    logo: '/favicon.svg',
    nav: [
      { text: 'Catalogue', link: '/catalogue' },
      { text: 'Draft applications', link: '/patents/' },
      { text: 'Prose', link: '/prose/' },
      { text: 'MCP', items: [
        { text: 'Catalogue (JSON)', link: '/mcp.json', target: '_blank' },
        { text: 'Live endpoint /api/mcp', link: '/api/mcp', target: '_blank' },
      ] },
    ],
    sidebar,
    outline: { level: [2, 3], label: 'On this page' },
    search: { provider: 'local', options: { detailedView: true } },
    socialLinks: [{ icon: 'github', link: 'https://github.com/uuidna/qpu' }],
    editLink: undefined,
    lastUpdated: { text: 'Proven', formatOptions: { dateStyle: 'medium' } },
    docFooter: { prev: 'Previous', next: 'Next' },
    footer: {
      message: 'Served over MCP. CC-BY-NC-ND-4.0 — the a432 harmonic default is free under attribution.',
      copyright: '© Tsvetan Rouschev · priced in qubits, always below the quantum market',
    },
  },
})
