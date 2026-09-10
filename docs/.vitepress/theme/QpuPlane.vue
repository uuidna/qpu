<script setup lang="ts">
import { computed } from 'vue'
import { VPBadge } from 'vitepress/theme'

export type QpuPlaneTheorem = {
  kind: string
  name: string
  href: string
  holds: boolean
}

export type QpuPlaneRow = {
  face: number
  neighbour: number
  name: string
  hex: string
  holds: boolean
  of?: string
  href?: string
  theorems?: readonly QpuPlaneTheorem[]
}

const props = defineProps<{
  empty: boolean
  minted: boolean
  lean: boolean
  rows: QpuPlaneRow[]
  heading?: string
}>()

const landed = computed(() =>
  props.rows.flatMap((r) =>
    (r.theorems ?? []).map((t) => ({
      face: r.face,
      axiom: r.name,
      kind: t.kind,
      name: t.name,
      href: t.href,
      holds: t.holds,
    })),
  ),
)
</script>

<template>
  <div class="vp-doc">
    <p>
      <VPBadge type="tip" text="plane" />
      empty {{ empty }}. Minted {{ minted }}. Lean {{ lean }}.
    </p>
    <h2 :id="(heading ?? 'Faces').toLowerCase()">{{ heading ?? 'Faces' }}</h2>
    <table>
      <thead>
        <tr>
          <th scope="col">Face</th>
          <th scope="col">Name</th>
          <th scope="col">Hex</th>
          <th scope="col">Neighbour</th>
          <th scope="col">Holds</th>
          <th v-if="rows[0]?.of" scope="col">Constructor</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in rows" :id="`face-${r.face}`" :key="r.face">
          <td>{{ r.face }}↔{{ r.neighbour }}</td>
          <td>{{ r.name }}</td>
          <td><code>{{ r.hex }}</code></td>
          <td>{{ r.neighbour }}</td>
          <td>{{ r.holds }}</td>
          <td v-if="r.of"><code>{{ r.of }}</code></td>
        </tr>
      </tbody>
    </table>
    <template v-if="landed.length">
      <h2 id="face-theorems">Theorems</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Face</th>
            <th scope="col">Axiom</th>
            <th scope="col">Kind</th>
            <th scope="col">Name</th>
            <th scope="col">Holds</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in landed" :id="`theorem-${t.face}-${t.kind}`" :key="`${t.face}-${t.kind}`">
            <td>{{ t.face }}</td>
            <td>{{ t.axiom }}</td>
            <td><a :href="t.href">{{ t.kind }}</a></td>
            <td>{{ t.name }}</td>
            <td>{{ t.holds }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>
