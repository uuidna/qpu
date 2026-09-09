<script setup lang="ts">
import { VPBadge } from 'vitepress/theme'
import QpuProof, { type QpuProofRow } from './QpuProof.vue'
import QpuGraph, { type QpuGraphRow } from './QpuGraph.vue'

defineProps<{
  empty: boolean
  minted: boolean
  proofs: QpuProofRow[]
  graph: QpuGraphRow
}>()
</script>

<template>
  <div class="vp-doc">
    <p>
      <VPBadge type="tip" text="axiom" />
      empty {{ empty }}. Minted {{ minted }}.
      Theorems displayed per superposition. Crosslinks are the quantum graph.
    </p>
    <QpuGraph :graph="graph" />
    <QpuProof v-for="p in proofs" :key="p.face" :proof="p" />
  </div>
</template>
