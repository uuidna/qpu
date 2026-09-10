<script setup lang="ts">
import { computed } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import { qpuHumanizeOf, qpuSlugOf } from '../../../src/quantum/processing/unit/index.ts'
import { data } from '../fuse.data.ts'
import QpuDomains, { type QpuPresent } from './QpuDomains.vue'
import QpuTypograph from './QpuTypograph.vue'
import QpuSeat from './QpuSeat.vue'
import QpuSeal from './QpuSeal.vue'
import type { QpuHeadingNode } from './QpuHeading.vue'

const { Layout } = DefaultTheme
const route = useRoute()

const path = computed(() => route.path.replace(/\/$/, '') || '/')
const title = computed(() => qpuHumanizeOf(path.value))
const slug = computed(() => qpuSlugOf(path.value))

const door = computed(() => {
  const i = data.doors.indexOf(path.value)
  return i < 0 ? 0 : i
})

const perspective = computed(() => data.perspectives[door.value] ?? data.perspectives[0]!)
const plane = computed(() => data.planes[door.value] ?? data.planes[0]!)
</script>

<template>
  <Layout>
    <template #doc-before>
      <div class="vp-doc">
        <h1 :id="slug">{{ title }}</h1>
      </div>
    </template>
    <template #sidebar-nav-before>
      <QpuDomains :present="perspective.present as QpuPresent" :left="perspective.left as QpuHeadingNode[]" />
    </template>
    <template #aside-outline-before>
      <QpuSeat :name="data.metrics.device.kind" :seat="data.metrics.device.seat" :live="data.metrics.live" />
      <QpuTypograph
        :headings="plane.headings as QpuHeadingNode[]"
        :rating="plane.rating"
        :recursive="plane.recursive"
      />
    </template>
    <template #aside-outline-after>
      <QpuSeal
        :live="data.metrics.live"
        :faces="data.metrics.occupancy.faces"
        :vertices="data.metrics.occupancy.vertices"
        :kelvin="data.metrics.wave.kelvin"
        :processing="data.metrics.wave.processing"
        :c="data.metrics.wave.c"
        :exceeds="data.metrics.wave.exceeds"
        :sealed="data.seal.sealed"
      />
    </template>
  </Layout>
</template>
