<script setup lang="ts">
import QpuHeading, { type QpuHeadingNode } from './QpuHeading.vue'

defineProps<{
  headings: QpuHeadingNode[]
  rating: string
  recursive: boolean
}>()
</script>

<template>
  <nav class="vp-doc" aria-label="typograph">
    <p>On this plane. Typograph rates headings, not items. Recursive {{ recursive }}. Rating {{ rating }}.</p>
    <ul class="root">
      <QpuHeading v-for="(h, i) in headings" :key="`${h.href}-${i}`" :node="h" />
    </ul>
  </nav>
</template>
