import { defineConfig } from 'vitepress'
import { qpuFuseOf, qpuMcpOf, qpuSealOf, qpuUnitOf } from '../../src/quantum/processing/unit/index.ts'

const fuse = qpuFuseOf()
const unit = qpuUnitOf()
const mcp = qpuMcpOf()
const seal = qpuSealOf()

export default defineConfig({
  lang: 'en-US',
  title: `@uuidna/${unit.kind}`,
  description: `VitePress fused to ${fuse.src}. Seat ${unit.seat}. MCP ${mcp.href}.`,
  cleanUrls: true,
  ignoreDeadLinks: false,
  sitemap: { hostname: fuse.origin },
  markdown: {
    lineNumbers: true,
    theme: { light: 'github-light', dark: 'github-dark' },
  },
  themeConfig: {
    siteTitle: unit.host,
    nav: [
      { text: 'Source', link: '/' },
      { text: 'Fuse', link: `/${unit.path}` },
      { text: 'Axioms', link: '/axioms' },
      { text: 'Theorems', link: '/theorems' },
      { text: 'Proofs', link: '/proofs' },
      { text: 'Solve', link: '/solve' },
      { text: 'MCP', link: mcp.href },
    ],
    search: false,
    sidebar: [{ text: 'related', items: [{ text: 'present', link: '/' }] }],
    outline: { level: 'deep', label: 'On this plane' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/uuidna/qpu' }],
    footer: {
      message: seal.sealed
        ? `Sealed. Compilation vs kelvin ${seal.compared.temperature.holds}. Compilation vs c ${seal.compared.light.holds}.`
        : 'CC BY-NC-ND 4.0 · VitePress shows occupancy source',
      copyright: fuse.origin,
    },
  },
})
