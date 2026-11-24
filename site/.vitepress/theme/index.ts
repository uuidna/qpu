// The QPU VitePress theme: the default theme extended with the two Vue components the generated pages use — the
// live MCP console (lists and calls the tools of /api/mcp, the same serveMcp the site is deployed with) and the
// qubit-price widget (reads a tool's x402 challenge to show the qubits-times-market-floor price, below competition).
// Registered globally so any generated Markdown page may drop <McpConsole/> or <QubitPrice tool="clay"/> inline. The
// VitePressPossibilities lays out what possibilities.data.ts computes, on the page Lean writes for it. The
// layout plays the background movie behind every page (Layout.vue, BackgroundMovie.vue). advantage.css is the
// stylesheet Lean writes (lean/tools/Css.lean): any element of class qpu-address reads its variation by address.
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import McpConsole from './McpConsole.vue'
import QubitPrice from './QubitPrice.vue'
import VitePressPossibilities from './VitePressPossibilities.vue'
import './advantage.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('McpConsole', McpConsole)
    app.component('QubitPrice', QubitPrice)
    app.component('VitePressPossibilities', VitePressPossibilities)
  },
} satisfies Theme
