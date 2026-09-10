<script setup lang="ts">
import { VPBadge } from 'vitepress/theme'
import QpuProof, { type QpuProofRow } from './QpuProof.vue'

defineProps<{
  empty: boolean
  minted: boolean
  proofs: QpuProofRow[]
}>()
</script>

<template>
  <div class="vp-doc">
    <p>
      <VPBadge type="tip" text="axiom" />
      empty {{ empty }}. Minted {{ minted }}.
    </p>
    <QpuProof v-for="p in proofs" :key="p.face" :proof="p" />
  </div>
</template>
