<script setup lang="ts">
import { computed } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import { data } from '../fuse.data.ts'
import QpuDomains, { type QpuPresent } from './QpuDomains.vue'
import QpuTypograph from './QpuTypograph.vue'
import QpuSeat from './QpuSeat.vue'
import QpuSeal from './QpuSeal.vue'
import type { QpuHeadingNode } from './QpuHeading.vue'

const { Layout } = DefaultTheme
const route = useRoute()

const door = computed(() => {
  const path = route.path.replace(/\/$/, '') || '/'
  const i = data.doors.indexOf(path)
  return i < 0 ? 0 : i
})

const perspective = computed(() => data.perspectives[door.value] ?? data.perspectives[0]!)
const plane = computed(() => data.planes[door.value] ?? data.planes[0]!)
</script>

<template>
  <Layout>
    <template #sidebar-nav-before>
      <QpuDomains :present="perspective.present as QpuPresent" :left="perspective.left as QpuHeadingNode[]" />
    </template>
    <template #aside-outline-before>
      <QpuSeat :name="data.kind" :seat="data.seat" />
      <QpuTypograph
        :headings="plane.headings as QpuHeadingNode[]"
        :rating="plane.rating"
        :recursive="plane.recursive"
      />
    </template>
    <template #aside-outline-after>
      <QpuSeal
        :sealed="data.seal.sealed"
        :kelvin="data.seal.compared.temperature.kelvin"
        :processing="data.seal.compared.light.processing"
        :c="data.seal.compared.light.c"
        :light="data.seal.compared.light.holds"
        :temperature="data.seal.compared.temperature.holds"
      />
    </template>
  </Layout>
</template>
