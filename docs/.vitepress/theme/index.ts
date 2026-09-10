import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import 'katex/dist/katex.min.css'
import './style.css'
import Layout from './Layout.vue'
import QpuAxioms from './QpuAxioms.vue'
import QpuClusters from './QpuClusters.vue'
import QpuFormula from './QpuFormula.vue'
import QpuGraph from './QpuGraph.vue'
import QpuHome from './QpuHome.vue'
import QpuLean from './QpuLean.vue'
import QpuMetrics from './QpuMetrics.vue'
import QpuPlane from './QpuPlane.vue'
import QpuSolve from './QpuSolve.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('QpuAxioms', QpuAxioms)
    app.component('QpuClusters', QpuClusters)
    app.component('QpuFormula', QpuFormula)
    app.component('QpuGraph', QpuGraph)
    app.component('QpuHome', QpuHome)
    app.component('QpuLean', QpuLean)
    app.component('QpuMetrics', QpuMetrics)
    app.component('QpuPlane', QpuPlane)
    app.component('QpuSolve', QpuSolve)
  },
} satisfies Theme
