import { defineConfig } from 'vitepress'
import { qpuFuseOf, qpuHumanizeOf, qpuMcpOf, qpuMetricsOf, qpuUnitOf } from '../../src/quantum/processing/unit/index.ts'

const fuse = qpuFuseOf()
const unit = qpuUnitOf()
const mcp = qpuMcpOf()
const metrics = qpuMetricsOf()

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
  transformPageData(pageData) {
    const rel = pageData.relativePath.replace(/\\/g, '/')
    const path = rel === 'index.md' ? '/' : `/${rel.replace(/\.md$/, '')}`
    pageData.title = qpuHumanizeOf(path)
  },
  themeConfig: {
    siteTitle: unit.host,
    nav: [
      ...unit.doors.map((path) => ({ text: qpuHumanizeOf(path), link: path })),
      { text: qpuHumanizeOf(new URL(mcp.href).pathname), link: mcp.href },
    ],
    search: false,
    sidebar: [{ text: 'related', items: [{ text: 'present', link: '/' }] }],
    outline: false,
    socialLinks: [{ icon: 'github', link: 'https://github.com/uuidna/qpu' }],
    footer: {
      message: metrics.live
        ? `Device live. occupancy faces ${metrics.occupancy.faces} vertices ${metrics.occupancy.vertices}. pico ${metrics.development.pico}. ${metrics.wave.processing} > ${metrics.wave.c}. nested ${metrics.development.nested}.`
        : 'Device dead. Occupancy metrics failed.',
      copyright: fuse.origin,
    },
  },
})
