<script setup lang="ts">
import { VPBadge } from 'vitepress/theme'
import QpuHeading, { type QpuHeadingNode } from './QpuHeading.vue'

export type QpuPresent = {
  face: number
  name: string
  heading: string
  hex: string
  href: string
}

defineProps<{
  present: QpuPresent
  left: QpuHeadingNode[]
}>()
</script>

<template>
  <nav class="vp-doc" aria-label="related">
    <p>
      <VPBadge type="tip" :text="present.heading" />
      present. Related headings around this domain.
    </p>
    <ul class="root">
      <QpuHeading v-for="(h, i) in left" :key="`${h.href}-${i}`" :node="h" />
    </ul>
  </nav>
</template>
