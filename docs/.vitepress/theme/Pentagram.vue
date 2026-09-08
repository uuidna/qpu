<script setup lang="ts">
import { data } from '../hologram.data.ts'

const labels = data.points
const pts = data.starPts.map(([x, y]) => `${x},${y}`)
const stroke = [...data.starStroke, 0]
const d = stroke.map((i) => pts[i]).join(' ')
</script>

<template>
  <svg class="qpu-pentagram" viewBox="0 0 120 120" role="img" aria-label="BindingPoint pentagram">
    <polygon :points="d" fill="none" stroke="currentColor" stroke-width="1.5" />
    <circle v-for="(p, i) in pts" :key="i" :cx="p.split(',')[0]" :cy="p.split(',')[1]" r="3" fill="currentColor" />
    <text v-for="(p, i) in pts" :key="'l' + i" :x="p.split(',')[0]" :y="Number(p.split(',')[1]) - 6" text-anchor="middle" font-size="8">{{ labels[i] }}</text>
  </svg>
</template>
