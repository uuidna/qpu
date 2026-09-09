<script setup lang="ts">
defineOptions({ chrome: { 'layout-top': {} } })
import { onMounted, onUnmounted, ref } from 'vue'

type Stream = {
  live: { k: number; heading: string; morph: number; beats: string; verify: string; may: boolean }
}

const live = ref<Stream['live']>({ k: 0, heading: 'inner', morph: 0, beats: '', verify: '', may: true })
let es: EventSource | null = null

const paint = (row: Stream['live']) => {
  live.value = row
  if (typeof document === 'undefined') return
  document.documentElement.dataset.heading = row.heading
  document.documentElement.style.setProperty('--qpu-morph', String(row.morph))
}

const read = async () => {
  const res = await fetch('/widgets')
  if (!res.ok) return
  const body = await res.json() as { payload?: boolean; stream?: Stream }
  if (body.payload) return
  if (body.stream?.live) paint(body.stream.live)
}

onMounted(() => {
  void read()
  es = new EventSource('/sse')
  es.addEventListener('stream', (ev) => {
    const row = JSON.parse(String((ev as MessageEvent).data)) as Stream
    if (row.live) paint(row.live)
  })
})
onUnmounted(() => {
  es?.close()
})
</script>

<template>
  <nav class="qpu-direction" aria-label="Scale speed temperature">
    <a href="/scale">scale {{ live.may ? 'may' : 'wait' }}</a>
    <a href="/speed">speed {{ live.beats }}</a>
    <span>t={{ live.morph }} {{ live.heading }}</span>
    <span>verify {{ live.verify }}</span>
    <a href="/widgets">uuid {{ live.k }}</a>
  </nav>
</template>
