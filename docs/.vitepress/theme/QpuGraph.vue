<script setup lang="ts">
import { VPBadge, VPLink } from 'vitepress/theme'

export type QpuGraphRow = {
  holds: boolean
  around: number
  impossibilities?: { bind: boolean; collapse: boolean; oneWay: boolean }
  vertices: {
    face: number
    axiom: string
    href: string
    axioms?: string
    neighbour: number
    cross: string
    uuid?: string
    involute?: string
  }[]
  edges: { from: number; to: number; involution: boolean; href?: string }[]
}

defineProps<{ graph: QpuGraphRow }>()
</script>

<template>
  <section class="vp-doc" id="graph">
    <h2>
      <VPBadge type="tip" text="graph" />
      messaging
    </h2>
    <p>
      Around {{ graph.around }}. Involution {{ graph.edges.every((e) => e.involution) }}.
      Impossibilities bind {{ graph.impossibilities?.bind }} collapse {{ graph.impossibilities?.collapse }} one-way {{ graph.impossibilities?.oneWay }}.
    </p>
    <ul>
      <li v-for="v in graph.vertices" :key="v.face">
        <VPLink :href="v.axioms ?? v.href">{{ v.axiom }}</VPLink>
        <code>{{ v.uuid }}</code>
        involute
        <VPLink :href="v.cross"><code>{{ v.involute }}</code></VPLink>
      </li>
    </ul>
  </section>
</template>
