<script setup lang="ts">
import { VPLink } from 'vitepress/theme'
import QpuHeading from './QpuHeading.vue'

export type QpuHeadingNode = {
  heading: string
  href: string
  children: QpuHeadingNode[]
}

defineProps<{ node: QpuHeadingNode }>()
</script>

<template>
  <li>
    <VPLink :href="node.href">{{ node.heading }}</VPLink>
    <ul v-if="node.children.length" class="nested">
      <QpuHeading v-for="(c, i) in node.children" :key="`${c.href}-${i}`" :node="c" />
    </ul>
  </li>
</template>
