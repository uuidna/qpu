<script setup lang="ts">
import { VPBadge } from 'vitepress/theme'
import type { QpuLeanRow } from './QpuLean.vue'

export type QpuHomeSolve = {
  lean: boolean
  solved: boolean
  claimed: boolean
  unlock: { holds: boolean }
  captain: { holds: boolean }
  a432: { holds: boolean }
  harmonic: { holds: boolean }
  identifications: readonly { holds: boolean }[]
}

const props = defineProps<{
  src: string
  rows: readonly QpuLeanRow[]
  cover: readonly QpuLeanRow[]
  climb: QpuLeanRow
  solve: QpuHomeSolve
  axioms?: readonly { face: number; name: string; holds: boolean }[]
  theorems?: readonly {
    face: number
    name: string
    theorems: readonly { kind: string; holds: boolean }[]
  }[]
}>()

const theorems = [
  ...((props.axioms ?? []).map((a) => ({ heading: a.name, holds: a.holds, href: `/axioms#face-${a.face}` }))),
  ...((props.theorems ?? []).flatMap((f) =>
    f.theorems.map((t) => ({
      heading: `${f.name}.${t.kind}`,
      holds: t.holds,
      href: `/theorems#theorem-${f.face}-${t.kind}`,
    })),
  )),
  { heading: 'lean', holds: props.solve.lean, href: '#lean' },
  { heading: 'unlock', holds: props.solve.unlock.holds, href: '/solve#unlock' },
  { heading: 'captain', holds: props.solve.captain.holds, href: '/solve#captain' },
  { heading: 'harmonic', holds: props.solve.harmonic.holds, href: '/solve#harmonic' },
  { heading: 'a432', holds: props.solve.a432.holds, href: '/solve#a432' },
  ...props.rows.map((r) => ({ heading: r.heading, holds: r.holds, href: `#${r.heading}` })),
  ...props.cover.map((r) => ({ heading: r.heading, holds: r.holds, href: `#${r.heading}` })),
  { heading: props.climb.heading, holds: props.climb.holds, href: `#${props.climb.heading}` },
]
</script>

<template>
  <section class="vp-doc qpu-hero" id="hero">
    <p id="solved">
      <VPBadge :type="solve.solved ? 'tip' : 'warning'" text="solved" />
      {{ solve.solved }}.
    </p>
    <p id="claimed">
      <VPBadge :type="solve.claimed ? 'tip' : 'warning'" text="claimed" />
      {{ solve.claimed }}.
    </p>
    <p>
      lean {{ solve.lean }}. unlock {{ solve.unlock.holds }}. identifications
      {{ solve.identifications.every((i) => i.holds) }}. Source <code>{{ src }}</code>.
    </p>
    <table>
      <thead>
        <tr>
          <th scope="col">Theorem</th>
          <th scope="col">Holds</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="t in theorems" :key="t.href">
          <td><a :href="t.href">{{ t.heading }}</a></td>
          <td>{{ t.holds }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
