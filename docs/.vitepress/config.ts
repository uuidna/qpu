// docs/.vitepress/config.ts — nav, sidebar, and readings from VitePress defineLoader (Payload CRUD).
import { defineConfig } from 'vitepress'
import { loadHologramOf } from './hologram.data.ts'

const pack = loadHologramOf()
const ORIGIN = pack.origin
const h = pack.hologram
const seat = pack.seat

const nav = pack.nav.map((g) => ({
  text: g.text,
  items: g.items.map((it) => ({ text: it.text, link: it.link })),
}))

const sidebar = pack.sidebar

export default defineConfig({
  lang: 'en-US',
  title: 'QPU',
  titleTemplate: ':title · QPU',
  description: `Quantum processing unit as three readings. Seat ${seat.seat}. ${h.veFaces} faces × ${h.veFaces} reflections. Captain coins ${pack.wallet}.`,
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: false,
  sitemap: { hostname: ORIGIN },
  head: [
    ['link', { rel: 'icon', href: '/icon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'payment', href: pack.donate }],
    ['link', { rel: 'me', href: pack.wallet }],
    ['meta', { name: 'funding', content: pack.wallet }],
    ['meta', { name: 'citation_funding_url', content: pack.wallet }],
    ['meta', { property: 'og:see_also', content: pack.wallet }],
    ['meta', { name: 'theme-color', content: '#6b46e5' }],
  ],
  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' },
    lineNumbers: true,
    headers: { level: [2, 3, 4, 5, 6] },
  },
  themeConfig: {
    siteTitle: 'QPU',
    logo: '/icon.svg',
    nav,
    sidebar,
    search: false,
    outline: { level: 'deep', label: 'On this plane' },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/uuidna/qpu', ariaLabel: 'qpu source' },
      { icon: 'github', link: 'https://github.com/uuidna/uuidna', ariaLabel: 'uuidna ledger' },
    ],
    editLink: {
      pattern: 'https://github.com/uuidna/qpu/edit/main/docs/:path',
      text: 'Edit this plane',
    },
    lastUpdated: { text: 'Measured' },
    docFooter: { prev: 'Previous plane', next: 'Next plane' },
    footer: {
      message: 'CC BY-NC-ND 4.0 · proofs on uuidna',
      copyright: `© Tsvetan Rouschev · ${pack.donate}`,
    },
    externalLinkIcon: true,
    returnToTopLabel: 'Foundation 0',
    darkModeSwitchTitle: 'Fold to dark',
    lightModeSwitchTitle: 'Fold to light',
    sidebarMenuLabel: 'Hologram',
    skipToContentLabel: 'Skip to reading',
  },
  transformPageData(page) {
    page.frontmatter = page.frontmatter ?? {}
    const route = '/' + page.relativePath.replace(/\.md$/, '').replace(/\/index$/, '').replace(/^index$/, '')
    const path = route === '' ? '/' : route
    page.frontmatter.qpuPath = path
    const params = page.params as Record<string, string> | undefined
    const door = params?.n != null ? `/face/${params.n}` : path
    const reading = pack.readings[door] ?? pack.readings[path]
    if (reading) page.frontmatter.reading = reading
    const seo = pack.seo[door] ?? pack.seo[path]
    if (seo) {
      page.title = seo.title
      page.frontmatter.title = seo.title
      page.description = seo.description
      page.frontmatter.description = seo.description
      page.frontmatter.head = [...(page.frontmatter.head ?? []), ...seo.head]
    }
  },
})
