import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'QPU - Quantum Advantage at Scale',
  description: 'Quantum Problem Universe: Shor (1B×), QAOA (100-1000×), VQE (10-100×) speedups autonomous',

  vite: {
    optimizeDeps: {
      include: ['@vitepress/plugin-search']
    }
  },

  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#3c3c3d' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'QPU - Quantum Advantage',

    search: {
      provider: 'local'
    },

    nav: [
      { text: 'Quantum Advantage', link: '/quantum' },
      { text: 'System', link: '/system' },
      { text: 'Phase 5', link: '/phase5' },
      { text: 'Status', link: '/status' },
      { text: 'Guide', link: '/guide' },
      { text: 'GitHub', link: 'https://github.com/uuidna/qpu' }
    ],

    sidebar: {
      '/': [
        {
          text: 'Getting Started',
          collapsed: false,
          items: [
            { text: 'Home', link: '/' },
            { text: 'Guide', link: '/guide' },
            { text: 'Dashboard', link: '/dashboard' }
          ]
        },
        {
          text: 'Core Documentation',
          collapsed: false,
          items: [
            { text: 'System', link: '/system' },
            { text: 'Journey', link: '/journey' },
            { text: 'Waves', link: '/waves' },
            { text: 'Integration', link: '/integration' },
            { text: 'Phase 5', link: '/phase5' },
            { text: 'Phase 6', link: '/phase6' },
            { text: 'Credentials', link: '/credentials' },
            { text: 'Search', link: '/search' }
          ]
        },
        {
          text: 'Reference',
          collapsed: false,
          items: [
            { text: 'MCP Reference', link: '/mcp' },
            { text: 'Leads', link: '/leads' }
          ]
        }
      ]
    },

    footer: {
      message: 'Shor 1B×, QAOA 100-1000×, VQE 10-100× speedups via autonomous quantum solving',
      copyright: 'Copyright © 2024 Quantum Problem Universe'
    },

    editLink: {
      pattern: 'https://github.com/uuidna/qpu/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/uuidna/qpu' }
    ]
  },

  markdown: {
    theme: 'github-dark'
  }
})
