import { readFileSync } from 'node:fs'
import { defineConfig } from 'vitepress'

// The sidebar is written beside this file by src/scripts/site.ts from the seed waves.
const sidebar = JSON.parse(readFileSync(new URL('./sidebar.json', import.meta.url), 'utf8'))

export default defineConfig({
  title: 'Quantum Processing Unit',
  description: 'The QPU pages and MCP catalogue, served statically from the same seeds Payload writes',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'Catalogue', link: '/catalogue' },
      { text: 'Draft applications', link: '/patents/' },
      { text: 'Prose', link: '/prose/' },
      { text: 'MCP catalogue', link: '/mcp.json', target: '_blank' },
    ],
    sidebar,
    search: { provider: 'local' },
  },
})
