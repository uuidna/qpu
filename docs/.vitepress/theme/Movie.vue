<script setup lang="ts">
defineOptions({ chrome: { root: {} } })
import { onMounted, onUnmounted, ref } from 'vue'
import { data } from '../hologram.data.ts'

const canvas = ref<HTMLCanvasElement | null>(null)
const caption = ref('')
let raf = 0

const reduce = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const paint = (ctx: CanvasRenderingContext2D, w: number, h: number, at: number) => {
  const k = Math.floor(Math.max(0, at) / 1000) % data.cells
  const hue = (p: number, s: number, l: number, a = 1) =>
    `hsl(${p * data.hueStep} ${s}% ${l}% / ${a})`
  ctx.fillStyle = hue(data.hologram.fold, 22, 8, 0.18)
  ctx.fillRect(0, 0, w, h)
  const pad = Math.min(w, h) * 0.08
  const grid = Math.min(w, h) * 0.42
  const cell = grid / data.veFaces
  const ox = pad
  const oy = (h - cell) / 2
  ctx.font = `${Math.max(10, cell * 0.45)}px ui-sans-serif, system-ui, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  for (const s of data.superpositions) {
    const x = ox + s.face * cell
    const on = s.face === k
    ctx.fillStyle = hue(s.face % data.base, 45, on ? 52 : 28, on ? 0.55 : 0.16)
    ctx.fillRect(x, oy, cell - 1, cell - 1)
    ctx.fillStyle = hue(data.hologram.fold, 20, on ? 96 : 80, 0.95)
    ctx.fillText(String(s.face), x + cell / 2, oy + cell / 2)
  }
  const star = Math.min(w, h) * 0.36
  const sx = w - star - pad
  const sy = (h - star) / 2
  const scale = star / 120
  const pts = data.starPts.map(([x, y]) => [sx + x * scale, sy + y * scale] as const)
  ctx.beginPath()
  data.starStroke.forEach((i, n) => {
    const [x, y] = pts[i]!
    if (n === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.closePath()
  ctx.strokeStyle = hue(data.hologram.pentagram, 62, 54, 0.7)
  ctx.lineWidth = 1.5
  ctx.stroke()
  for (let i = 0; i < pts.length; i++) {
    const [x, y] = pts[i]!
    const on = data.starStroke[k % data.starStroke.length] === i
    ctx.fillStyle = hue(data.hologram.pentagram, 62, on ? 72 : 48, on ? 0.95 : 0.45)
    ctx.beginPath()
    ctx.arc(x, y, on ? 5 : 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = hue(data.hologram.fold, 20, 80, 0.7)
    ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(data.points[i]!, x, y - 8)
  }
  const row = data.compare[k % data.compare.length]!
  const message = `face ${k} · ${row.name} ${row.value}=${row.peer}`
  caption.value = message
  ctx.fillStyle = hue(data.hologram.fold, 20, 88, 0.9)
  ctx.font = '13px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(message, pad, h - pad * 0.6)
}

const frame = (at: number) => {
  const el = canvas.value
  if (!el) return
  const ctx = el.getContext('2d')
  if (!ctx) return
  const dpr = window.devicePixelRatio || 1
  const w = window.innerWidth
  const h = window.innerHeight
  if (el.width !== Math.floor(w * dpr) || el.height !== Math.floor(h * dpr)) {
    el.width = Math.floor(w * dpr)
    el.height = Math.floor(h * dpr)
    el.style.width = `${w}px`
    el.style.height = `${h}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  paint(ctx, w, h, at)
}

const loop = (at: number) => {
  frame(at)
  if (!reduce()) raf = requestAnimationFrame(loop)
}

onMounted(() => {
  frame(performance.now())
  if (!reduce()) raf = requestAnimationFrame(loop)
})

onUnmounted(() => {
  if (raf) cancelAnimationFrame(raf)
})
</script>

<template>
  <div class="qpu-movie-layer">
    <canvas ref="canvas" class="qpu-movie-canvas" role="img" :aria-label="caption || 'QPU live metrics movie'" />
    <p class="qpu-movie-ticker" aria-live="polite">{{ caption }}</p>
  </div>
</template>
