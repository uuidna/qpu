// The QPU VitePress theme: the default theme extended with the two Vue components the generated pages use — the
// live MCP console (lists and calls the tools of /api/mcp, the same serveMcp the site is deployed with) and the
// qubit-price widget (reads a tool's x402 challenge to show the qubits-times-market-floor price, below competition).
// Registered globally so any generated Markdown page may drop <McpConsole/> or <QubitPrice tool="clay"/> inline.
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import McpConsole from './McpConsole.vue'
import QubitPrice from './QubitPrice.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('McpConsole', McpConsole)
    app.component('QubitPrice', QubitPrice)
  },
} satisfies Theme
