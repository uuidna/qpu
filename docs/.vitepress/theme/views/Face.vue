<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, withBase } from 'vitepress'
import { data } from '../../hologram.data.ts'

const props = defineProps<{ n?: string }>()
const router = useRouter()
const idx = computed(() => {
  const x = Number(props.n)
  return x === x ? x : 0
})
const row = computed(() => data.superpositions[idx.value] ?? data.superpositions[0]!)
const heading = computed(() => `face-${row.value.face}`)
const neighbour = computed(() => withBase(`/face/${row.value.opposite}`))
const goNeighbour = () => void router.go(neighbour.value)
</script>

<template>
  <section class="qpu-card qpu-face-reading" :aria-labelledby="heading">
    <h2 :id="heading">Face {{ row.face }} pairs with {{ row.opposite }}</h2>
    <p>
      Referer {{ row.referer }} maps onto door {{ row.door }}.
      Neighbour gateway
      <a :href="neighbour" @click.prevent="goNeighbour">face {{ row.opposite }}</a>.
      Angles are the perspective of this superposition, not a square of reflections.
    </p>
    <table>
      <caption>Perspective angles for face {{ row.face }}</caption>
      <thead>
        <tr>
          <th scope="col">Angle</th>
          <th scope="col">Degrees</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Hue</th>
          <td>{{ row.angles.hue }}</td>
        </tr>
        <tr>
          <th scope="row">Dash</th>
          <td>{{ row.angles.dash }}</td>
        </tr>
        <tr>
          <th scope="row">Slot</th>
          <td>{{ row.angles.slot }}</td>
        </tr>
        <tr>
          <th scope="row">Reflection</th>
          <td>{{ row.angles.reflection }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
