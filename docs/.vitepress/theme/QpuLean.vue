<script setup lang="ts">
import { computed } from 'vue'
import QpuLexical from './QpuLexical.vue'
import { qpuTheoremLexicalOf } from '../../../src/quantum/processing/unit/seed.ts'

export type QpuLeanRow = {
  heading: string
  theorem: string
  formula: string
  reading: string
  holds: boolean
}

const props = defineProps<{
  src: string
  rows: readonly QpuLeanRow[]
  climb?: QpuLeanRow
  cover?: readonly QpuLeanRow[]
}>()

const faceStates = computed(() => props.rows.map((p) => qpuTheoremLexicalOf(p)))
const coverStates = computed(() => (props.cover ?? []).map((p) => qpuTheoremLexicalOf(p)))
const climbState = computed(() => (props.climb ? qpuTheoremLexicalOf(props.climb) : undefined))
</script>

<template>
  <section class="vp-doc qpu-lean" id="lean">
    <p>
      Lean only. Pure Nat algebra. No <code>Math</code>, no math library, no <code>decide</code>.
      Source <code>{{ src }}</code>. Fourteen faces. Eight vertices cover all. Next doubles, not a cap.
    </p>
    <QpuLexical v-for="(state, i) in faceStates" :key="rows[i]!.heading" :state="state" />
    <template v-if="coverStates.length">
      <h2 id="cover">Cover</h2>
      <QpuLexical v-for="(state, i) in coverStates" :key="cover![i]!.heading" :state="state" />
    </template>
    <QpuLexical v-if="climbState" :state="climbState" />
  </section>
</template>
