<script setup lang="ts">
// The background movie: one canvas behind every page, one clock, two streams told apart.
// The clock is the kernel's: a 12-hour dial whose hand is reflected by σ₁₂(x) = 12 − x and restored by the same reflection
// (textbook_clock_clone_involution), and a ring of witnesses that moves 14 → 12 → 14 → 16 (textbook_witness_clock_move).
// Stream one, the published experiments: every figure is evaluated from the statement the Lean kernel recorded, and
// the statements are found by their formulas (supremacy.data.ts), drawn on one log-seconds axis against the bound.
// Stream two, the live model: this deployment's own /api/mcp (movie-live.ts). MovieCaption.vue says what both mean.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { data } from './supremacy.data'
import { live, startLive } from './movie-live'

const canvas = ref<HTMLCanvasElement | null>(null)

// the experiments as the loader found them by their formulas: the separated one (quantum seconds < classical seconds,
// the bound between them) and the one within the bound (classical seconds ≤ the bound)
const willow = data.experiments.separated[0]?.sides ?? null
const sycamore = data.experiments.within[0]?.sides ?? null
const bound = data.experiments.bound
const label = computed(() => [
  `Willow RCS ${data.willow.qubits} qubits depth ${data.willow.depth}: ${data.willow.quantum} against an estimated ${data.willow.classical} classically`,
  live.value ? `live model ${live.value.effective} qubits (${live.value.formula}) answered in ${live.value.ms.toFixed(0)} ms` : 'live model pending',
  `${new Set([...data.played.flatMap((p) => p.keys), ...data.experiments.within.map((e) => e.key), ...data.experiments.separated.map((e) => e.key)]).size} kernel-checked theorems played`,
].join(' · '))

const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
let frame = 0
const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()
const human = (s: number) => s < 3600 ? `${Math.round(s)} s` : s < 31557600 ? `${Math.round(s / 3600)} h` : `10^${Math.round(Math.log10(s / 31557600))} years`

const paint = (atMs: number) => {
  const el = canvas.value
  if (!el) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = window.innerWidth, h = window.innerHeight
  if (el.width !== Math.round(w * dpr) || el.height !== Math.round(h * dpr)) { el.width = Math.round(w * dpr); el.height = Math.round(h * dpr) }
  const ctx = el.getContext('2d')!
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, w, h)
  const ink = css('--vp-c-text-1'), soft = css('--vp-c-text-3'), brand = css('--vp-c-brand-1'), ok = css('--vp-c-green-1') || brand, warn = css('--vp-c-yellow-1') || soft
  const narrow = w < 768
  ctx.globalAlpha = narrow ? 0.22 : 0.5

  // the clock: one hour per second, the hand at x and its reflection at 12 − x, meeting at 6 and at 12 (the fixed points)
  const hour = reduce ? 3 : (atMs / 1000) % 12
  // the free column right of the page's content, where the layout leaves one wide enough: the clock and the axis live there
  const contentRight = document.querySelector('.VPDoc .content-container')?.getBoundingClientRect().right ?? w
  const column = !narrow && w - contentRight - 48 >= 260
  const cx = column ? (contentRight + w) / 2 : w * 0.8, cy = h * 0.3
  const r = column ? Math.min(Math.min(w, h) * 0.14, (w - contentRight) / 2 - 56) : Math.min(w, h) * (narrow ? 0.22 : 0.14)
  ctx.strokeStyle = soft; ctx.lineWidth = 1
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke()
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2 - Math.PI / 2; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r * 0.9, cy + Math.sin(a) * r * 0.9); ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); ctx.stroke() }
  const hand = (x: number, colour: string) => { const a = (x / 12) * Math.PI * 2 - Math.PI / 2; ctx.strokeStyle = colour; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * r * 0.8, cy + Math.sin(a) * r * 0.8); ctx.stroke() }
  hand(hour, brand)
  hand(12 - hour, ink)

  // the witnesses: 2k on a ring, k stepping 7 → 6 → 7 → 8 with the clock (14 → 12 → 14 → 16)
  const k = reduce ? 7 : [7, 6, 7, 8][Math.floor(atMs / 3000) % 4]!
  for (let i = 0; i < 2 * k; i++) { const a = (i / (2 * k)) * Math.PI * 2 + (reduce ? 0 : atMs / 4000); ctx.fillStyle = brand; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * r * 1.25, cy + Math.sin(a) * r * 1.25, 2.5, 0, Math.PI * 2); ctx.fill() }

  // the experiments on one log₁₀-seconds axis, against the feasibility bound
  if (willow && bound && column) {
    const x0 = contentRight + 24, x1 = w - 24, y = Math.min(h - 40, cy + r * 1.25 + 150), top = Math.log10(Math.max(willow[1], bound)) + 1
    const at = (s: number) => x0 + (Math.log10(Math.max(s, 1)) / top) * (x1 - x0)
    const sweep = reduce ? 1 : Math.min(1, (atMs % 12000) / 9000)
    ctx.font = `11px ${css('--vp-font-family-mono') || 'monospace'}`
    ctx.strokeStyle = soft; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke()
    ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(at(bound), y - 60); ctx.lineTo(at(bound), y + 6); ctx.stroke(); ctx.setLineDash([])
    ctx.fillStyle = soft; ctx.fillText(`- - - bound: the age of the universe, ${human(bound)}`, x0, y + 16)
    const bar = (to: number, row: number, colour: string, text: string) => {
      ctx.strokeStyle = colour; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0, y - row); ctx.lineTo(x0 + (at(to) - x0) * sweep, y - row); ctx.stroke()
      ctx.fillStyle = colour; ctx.fillText(text, x0, y - row - 6)
    }
    bar(willow[1], 54, warn, `Willow, classical estimate ${human(willow[1])}`)
    bar(willow[0], 32, ok, `Willow, quantum ${human(willow[0])}`)
    if (sycamore) bar(sycamore[0], 12, soft, `Sycamore, matched classically 2022 in ${human(sycamore[0])}`)
  }
  ctx.globalAlpha = 1
}

const tick = (atMs: number) => { paint(atMs); if (!reduce) frame = requestAnimationFrame(tick) }
const repaint = () => paint(performance.now())

onMounted(() => {
  frame = requestAnimationFrame(tick)
  startLive()
  window.addEventListener('resize', repaint)
})
onBeforeUnmount(() => { cancelAnimationFrame(frame); window.removeEventListener('resize', repaint) })
</script>

<template>
  <div class="qpu-movie">
    <canvas ref="canvas" class="qpu-movie__canvas" role="img" :aria-label="label" :data-quantum-model="label" />
  </div>
</template>

<style scoped>
.qpu-movie { position: fixed; inset: 0; z-index: -1; pointer-events: none; }
.qpu-movie__canvas { display: block; width: 100%; height: 100%; }
</style>
