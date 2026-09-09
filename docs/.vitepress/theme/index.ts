import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import Layout from './Layout.vue'
import QpuAxioms from './QpuAxioms.vue'
import QpuGraph from './QpuGraph.vue'
import QpuProof from './QpuProof.vue'
import QpuPlane from './QpuPlane.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('QpuAxioms', QpuAxioms)
    app.component('QpuGraph', QpuGraph)
    app.component('QpuProof', QpuProof)
    app.component('QpuPlane', QpuPlane)
  },
} satisfies Theme
