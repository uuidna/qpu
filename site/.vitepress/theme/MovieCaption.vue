<script setup lang="ts">
// What the background movie plays, in the page's own flow: the published experiments, measured by the theorems the kernel
// recorded; the live model, from this deployment's /api/mcp; and what the page does not prove.
import { computed, onMounted } from 'vue'
import { data } from './supremacy.data'
import { live, liveError, startLive } from './movie-live'

// each formula the movie plays, with how many theorems of the kernel index state it, and each experiment's statement
const kernel = computed(() => [...data.played.map((p) => `${p.formula} · ${p.keys.length}`), ...[...data.experiments.within, ...data.experiments.separated].map((e) => e.statement)])
onMounted(startLive)
</script>

<template>
  <section class="qpu-caption" aria-label="What the background movie plays">
    <p><strong>Published experiments.</strong> Willow, random circuit sampling on {{ data.willow.qubits }} qubits at depth {{ data.willow.depth }}: {{ data.willow.quantum }}, against an estimated {{ data.willow.classical }} classically, beyond the age-of-the-universe bound. Sycamore 2019 was matched classically in 2022, within the bound. Lean checks the arithmetic of the stated figures.</p>
    <p><strong>Live model</strong>, this page on classical hardware:
      <span v-if="live">{{ live.effective }} qubits ({{ live.formula }}), {{ live.holds ? 'holds' : 'does not hold' }}, answered in {{ live.ms.toFixed(0) }} ms.</span>
      <span v-else-if="liveError">/api/mcp did not answer.</span>
      <span v-else>asking /api/mcp…</span>
    </p>
    <p class="qpu-caption__limit">No program on classical hardware proves quantum supremacy, and no classical lower bound for these tasks is proved: the classical times are their authors' estimates.</p>
    <ul class="qpu-caption__kernel">
      <li v-for="formula in kernel" :key="formula">✓ {{ formula }}</li>
      <li v-for="m in data.missing" :key="m" class="missing">✗ {{ m }}, not in the kernel index</li>
    </ul>
  </section>
</template>

<style scoped>
.qpu-caption { margin: 32px 0 0; padding: 12px 14px; border: 1px solid var(--vp-c-divider); border-radius: 12px; color: var(--vp-c-text-2); font-size: 13px; line-height: 1.5; background: var(--vp-c-bg); }
.qpu-caption p { margin: 0 0 6px; }
.qpu-caption strong { color: var(--vp-c-text-1); }
.qpu-caption__limit { color: var(--vp-c-text-3); }
.qpu-caption__kernel { margin: 6px 0 0; padding: 0; list-style: none; font-family: var(--vp-font-family-mono); font-size: 11px; }
.qpu-caption__kernel .missing { color: var(--vp-c-danger-1); }
</style>
