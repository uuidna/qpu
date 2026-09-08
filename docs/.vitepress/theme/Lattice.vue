<script setup lang="ts">
defineOptions({ chrome: { 'home-features-after': { mini: true } } })
import { useRouter, withBase } from 'vitepress'
import { data } from '../hologram.data.ts'

defineProps<{ mini?: boolean }>()

const rows = data.superpositions
const router = useRouter()
const go = (face: number) => void router.go(withBase(`/face/${face}`))
</script>

<template>
  <ul class="qpu-lattice" :class="{ mini }" aria-label="Fourteen VE faces">
    <li v-for="s in rows" :key="s.face">
      <a
        class="qpu-face-card"
        :href="withBase(`/face/${s.face}`)"
        :style="{ '--cell': s.face }"
        :aria-label="`Face ${s.face} pairs with ${s.opposite}, referer ${s.referer}, door ${s.door}`"
        @click.prevent="go(s.face)"
      >
        <span class="qpu-face-id">{{ s.face }}</span>
        <span class="qpu-face-meta">door {{ s.door }} · referer {{ s.referer }}</span>
        <span class="qpu-face-pair">pairs with {{ s.opposite }}</span>
      </a>
    </li>
  </ul>
</template>
