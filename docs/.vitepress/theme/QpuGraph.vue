<script setup lang="ts">
import { VPBadge, VPLink } from 'vitepress/theme'

export type QpuGraphRow = {
  holds: boolean
  around: number
  vertices: { face: number; axiom: string; href: string; neighbour: number; cross: string }[]
  edges: { from: number; to: number; involution: boolean }[]
}

defineProps<{ graph: QpuGraphRow }>()
</script>

<template>
  <section class="vp-doc" id="graph">
    <h2>
      <VPBadge type="tip" text="graph" />
      quantum
    </h2>
    <p>Around {{ graph.around }}. Involution {{ graph.edges.every((e) => e.involution) }}.</p>
    <ul>
      <li v-for="v in graph.vertices" :key="v.face">
        <VPLink :href="v.href">{{ v.axiom }}</VPLink>
        →
        <VPLink :href="v.cross">face {{ v.neighbour }}</VPLink>
      </li>
    </ul>
  </section>
</template>
