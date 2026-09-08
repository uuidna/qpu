<script setup lang="ts">
defineOptions({ chrome: { 'aside-outline-before': { compact: true } } })
import { data } from '../hologram.data.ts'

defineProps<{ compact?: boolean }>()
const seat = data.seat
</script>

<template>
  <aside class="qpu-empty qpu-card" aria-label="QPU seat">
    <p class="qpu-empty-title">{{ seat.name }}</p>
    <p class="qpu-empty-desc">
      Seat {{ seat.seat }}.
      <template v-if="!compact"> Admits {{ seat.admits }}.</template>
    </p>
  </aside>
</template>
