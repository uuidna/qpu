<script setup lang="ts">
defineOptions({
  chrome: {
    'aside-outline-after': {},
    'layout-bottom': { bar: true },
  },
})
import { data } from '../hologram.data.ts'

defineProps<{ bar?: boolean }>()
const href = data.donate
</script>

<template>
  <p class="qpu-donate" :class="{ bar }">
    Captain coins
    <a :href="href">{{ href }}</a>
  </p>
</template>
