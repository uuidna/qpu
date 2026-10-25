// VitePress Configuration with Combinatorial Doc Generation
// Generates documentation from test data, adapters, and benchmarks

import { defineConfig } from 'vitepress'

// Dynamically generate sidebar from test data
function generateSidebar() {
  return [
    {
      text: 'Getting Started',
      items: [
        { text: 'Quick Start', link: '/guide/quick-start' },
        { text: 'Installation', link: '/guide/installation' },
        { text: 'Your First API', link: '/guide/first-api' }
      ]
    },
    {
      text: 'Examples & Use Cases',
      items: [
        { text: 'Overview', link: '/examples/' },
        {
          text: 'Domains',
          items: [
            { text: 'Entanglement', link: '/examples/domains/entanglement/' },
            { text: 'Algorithms', link: '/examples/domains/algorithms/' },
            { text: 'Optimization', link: '/examples/domains/optimization/' },
            { text: 'Simulation', link: '/examples/domains/simulation/' },
            { text: 'Machine Learning', link: '/examples/domains/ml/' }
          ]
        },
        {
          text: 'Examples',
          items: [
            { text: 'Qiskit Bell State', link: '/examples/examples/qiskit-bell-state/' },
            { text: 'Cirq GHZ State', link: '/examples/examples/cirq-ghz-state/' },
            { text: 'PennyLane Deutsch-Jozsa', link: '/examples/examples/pennylane-deutsch-jozsa/' },
            { text: 'PyQuil Grover Search', link: '/examples/examples/pyquil-grover/' }
          ]
        },
        {
          text: 'Frameworks',
          items: [
            { text: 'Qiskit', link: '/examples/frameworks/qiskit/' },
            { text: 'Cirq', link: '/examples/frameworks/cirq/' },
            { text: 'PennyLane', link: '/examples/frameworks/pennylane/' },
            { text: 'PyQuil', link: '/examples/frameworks/pyquil/' }
          ]
        }
      ]
    },
    {
      text: 'Core Concepts',
      items: [
        { text: 'Dynamic Adapters', link: '/concepts/dynamic-adapters' },
        { text: 'Tool Registry', link: '/concepts/registry' },
        { text: 'MCP Protocol', link: '/concepts/mcp' }
      ]
    },
    {
      text: 'APIs & Providers',
      items: [
        { text: 'Quantum Providers', link: '/apis/quantum' },
        { text: 'Cloud Services', link: '/apis/cloud' },
        { text: 'CI/CD Tools', link: '/apis/cicd' }
      ]
    },
    {
      text: 'Testing',
      items: [
        { text: 'Testing Framework', link: '/testing/overview' },
        { text: 'Quantum Benchmarks', link: '/testing/benchmarks' },
        { text: 'Test Coverage', link: '/testing/coverage' }
      ]
    },
    {
      text: 'API Reference',
      items: [
        { text: 'Dynamic Adapter Tools', link: '/api/dynamic-adapters' },
        { text: 'Quantum Tools', link: '/api/quantum' },
        { text: 'Testing Tools', link: '/api/testing' }
      ]
    }
  ]
}

// Dynamically generate nav from features
function generateNav() {
  return [
    { text: 'Home', link: '/' },
    { text: 'Docs', link: '/guide/quick-start' },
    { text: 'Examples', link: '/examples/' },
    { text: 'API', link: '/api/dynamic-adapters' },
    { text: 'Testing', link: '/testing/overview' },
    {
      text: 'More',
      items: [
        { text: 'GitHub', link: 'https://github.com/anthropics/qpu' },
        { text: 'Zenodo', link: 'https://zenodo.org' }
      ]
    }
  ]
}

export default defineConfig({
  title: 'QPU: Quantum Processing Unit',
  description: 'Zero-hardcoding MCP framework for quantum computing and cloud APIs',
  lang: 'en-US',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }]
  ],

  themeConfig: {
    logo: '/logo.svg',
    nav: generateNav(),
    sidebar: generateSidebar(),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/anthropics/qpu' }
    ],

    footer: {
      message: 'Zero-hardcoding MCP framework for quantum computing',
      copyright: 'Copyright © 2025'
    },

    search: {
      provider: 'local'
    }
  },

  srcDir: './docs',
  srcExclude: ['**/README.md', '**/*.test.md'],

  markdown: {
    container: {
      tipLabel: '💡',
      warningLabel: '⚠️',
      dangerLabel: '🚨',
      infoLabel: 'ℹ️',
      detailsLabel: '📋'
    }
  }
})
