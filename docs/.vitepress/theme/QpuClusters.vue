<script setup lang="ts">
import { VPBadge } from 'vitepress/theme'
import QpuFormula from './QpuFormula.vue'

export type QpuClusterRow = {
  face: number
  neighbour: number
  inner: number[]
  outer: number[]
  times: number
  unique: boolean
  complete: boolean
  theorem: string
  formula: string
  occupancy: string
  holds: boolean
}

export type QpuClustersPlane = {
  theorem: string
  formula: string
  harmonic: string
  around: number
  times: number
  complete: number
  rows: QpuClusterRow[]
  lean: boolean
  holds: boolean
}

defineProps<{ clusters: QpuClustersPlane }>()
</script>

<template>
  <section class="vp-doc qpu-clusters-plane" id="clusters">
    <h2>
      <VPBadge type="tip" text="complete" />
      all harmonic superpositions
    </h2>
    <p>
      One Lean proof. {{ clusters.complete }} of {{ clusters.around }} clusters unique at every time ({{ clusters.times }}).
      Lean {{ clusters.lean }}. Holds {{ clusters.holds }}.
    </p>
    <div class="qpu-clusters">
      <article
        v-for="c in clusters.rows"
        :id="`cluster-${c.face}`"
        :key="c.face"
        class="qpu-cluster"
      >
        <header class="qpu-cluster-head">
          <VPBadge :type="c.complete ? 'tip' : 'warning'" :text="c.complete ? 'complete' : 'open'" />
          <a :href="`#face-${c.face}`">{{ c.face }}↔{{ c.neighbour }}</a>
        </header>
        <div class="qpu-cluster-halves" aria-label="harmonic halves">
          <ol class="qpu-half qpu-half-inner">
            <li v-for="f in c.inner" :key="`i${f}`">{{ f }}</li>
          </ol>
          <span class="qpu-sqcup" aria-hidden="true">⊔</span>
          <ol class="qpu-half qpu-half-outer">
            <li v-for="f in c.outer" :key="`o${f}`">{{ f }}</li>
          </ol>
        </div>
        <QpuFormula :tex="c.formula" />
        <div class="language-lean">
          <pre class="shiki"><code>{{ c.theorem }}</code></pre>
        </div>
      </article>
    </div>
  </section>
</template>
