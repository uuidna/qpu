<script setup lang="ts">
import { VPBadge } from 'vitepress/theme'

export type QpuPlaneRow = {
  face: number
  neighbour: number
  name: string
  hex: string
  holds: boolean
  of?: string
  href?: string
}

defineProps<{
  empty: boolean
  minted: boolean
  lean: boolean
  rows: QpuPlaneRow[]
  census: QpuPlaneRow[]
  methods: readonly string[]
}>()
</script>

<template>
  <div class="vp-doc">
    <p>
      <VPBadge type="tip" text="plane" />
      empty {{ empty }}. Minted {{ minted }}. Lean {{ lean }}.
    </p>
    <h2 id="faces">Faces</h2>
    <table>
      <thead>
        <tr>
          <th scope="col">Face</th>
          <th scope="col">Name</th>
          <th scope="col">Hex</th>
          <th scope="col">Neighbour</th>
          <th v-if="rows[0]?.of" scope="col">Constructor</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in rows" :id="`face-${r.face}`" :key="r.face">
          <td>{{ r.face }}↔{{ r.neighbour }}</td>
          <td>{{ r.name }}</td>
          <td><code>{{ r.hex }}</code></td>
          <td>{{ r.neighbour }}</td>
          <td v-if="r.of"><code>{{ r.of }}</code></td>
        </tr>
      </tbody>
    </table>
    <h2 id="census">Census</h2>
    <table>
      <thead>
        <tr>
          <th scope="col">Vertex</th>
          <th scope="col">Name</th>
          <th scope="col">Hex</th>
          <th v-if="census[0]?.href" scope="col">Href</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in census" :key="r.face">
          <td>{{ r.face }}</td>
          <td>{{ r.name }}</td>
          <td><code>{{ r.hex }}</code></td>
          <td v-if="r.href"><a :href="r.href">{{ r.href }}</a></td>
        </tr>
      </tbody>
    </table>
    <h2 id="methods">Methods</h2>
    <table>
      <thead>
        <tr>
          <th scope="col">Rotor</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in methods" :key="m">
          <td>{{ m }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
