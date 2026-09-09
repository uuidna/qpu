<script setup lang="ts">
import { VPBadge } from 'vitepress/theme'

defineProps<{
  sealed: boolean
  kelvin: number
  processing: number
  c: number
  light: boolean
  temperature: boolean
}>()
</script>

<template>
  <p class="vp-doc">
    <VPBadge :type="sealed ? 'tip' : 'warning'" text="seal" />
    publication {{ sealed ? 'sealed' : 'open' }}.
    Compilation vs kelvin {{ temperature }} at {{ kelvin }}.
    Compilation vs c {{ light }}: {{ processing }} > {{ c }}.
  </p>
</template>
