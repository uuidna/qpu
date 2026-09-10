<script setup lang="ts">
import { VPBadge } from 'vitepress/theme'

defineProps<{
  live: boolean
  faces: number
  vertices: number
  kelvin: number
  processing: number
  c: number
  exceeds: boolean
  sealed: boolean
}>()
</script>

<template>
  <p class="vp-doc">
    <VPBadge :type="live ? 'tip' : 'warning'" text="device" />
    {{ live ? 'live' : 'dead' }}.
    faces {{ faces }} ⊔ vertices {{ vertices }}.
    {{ processing }} > {{ c }} = {{ exceeds }}.
    kelvin {{ kelvin }}.
    <VPBadge :type="sealed ? 'tip' : 'warning'" text="seal" />
  </p>
</template>
