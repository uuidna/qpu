<script setup lang="ts">
defineOptions({ chrome: { root: {} } })
import { onMounted, onUnmounted, ref } from 'vue'

type Glyph = {
  from?: string
  name: string
  hex?: string
  face: number
  opposite: number
  x: number
  y: number
  hue?: number
  uuid?: string
  first?: boolean
}

const canvas = ref<HTMLCanvasElement | null>(null)
const caption = ref('')
const glyphs = ref<Glyph[]>([])
const center = ref<Glyph | null>(null)
let raf = 0
let es: EventSource | null = null
let k = 0
let at = 0

const GLAGOLITIC_BASE = 0x2c00
const VE = 14
const HEX = '0123456789abcdef'

const reduce = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const fallbackGlyphs = (): Glyph[] =>
  Array.from({ length: VE }, (_, face) => {
    const a = (face / VE) * Math.PI * 2 - Math.PI / 2
    return {
      from: 'glagolitic',
      name: String.fromCodePoint(GLAGOLITIC_BASE + face),
      hex: HEX[face]!,
      face,
      opposite: face === 0 ? 0 : ((1 - (face % 9) + 9) % 9) || 9,
      x: Math.cos(a),
      y: Math.sin(a),
      hue: (360 / 9) * (face % 9),
    }
  })

const paint = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  const rows = glyphs.value.length ? glyphs.value : fallbackGlyphs()
  const core = center.value ?? rows[0]!
  ctx.fillStyle = 'hsl(270 22% 8% / 0.18)'
  ctx.fillRect(0, 0, w, h)
  const cx = w / 2
  const cy = h / 2
  const R = Math.min(w, h) * 0.32
  const pos = (g: Glyph) => [cx + g.x * R, cy + g.y * R] as const
  const live = rows[k % rows.length] ?? rows[0]!
  for (const g of rows) {
    const [x1, y1] = pos(g)
    const opp = rows[g.opposite] ?? g
    const [x2, y2] = pos(opp)
    const on = g.face === live.face || g.face === live.opposite
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(cx, cy)
    ctx.lineTo(x2, y2)
    ctx.strokeStyle = `hsl(${g.hue ?? 280} 45% ${on ? 62 : 38}% / ${on ? 0.55 : 0.18})`
    ctx.lineWidth = on ? 2 : 1
    ctx.stroke()
    const u = (at / 900 + g.face / VE) % 1
    const pulse = (t: number, spin: number) => {
      const s = spin === 1 ? t : 1 - t
      const p = s < 0.5
        ? [x1 + (cx - x1) * s * 2, y1 + (cy - y1) * s * 2]
        : [cx + (x2 - cx) * (s - 0.5) * 2, cy + (y2 - cy) * (s - 0.5) * 2]
      ctx.beginPath()
      ctx.arc(p[0]!, p[1]!, on ? 3.5 : 2, 0, Math.PI * 2)
      ctx.fillStyle = `hsl(${g.hue ?? 280} 70% 72% / ${on ? 0.95 : 0.35})`
      ctx.fill()
    }
    pulse(u, 1)
    pulse(u, -1)
  }
  ctx.beginPath()
  ctx.arc(cx, cy, 10, 0, Math.PI * 2)
  ctx.fillStyle = 'hsl(270 45% 52% / 0.85)'
  ctx.fill()
  ctx.fillStyle = 'hsl(270 20% 96% / 0.95)'
  ctx.font = '16px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(core.name, cx, cy)
  ctx.font = `${Math.max(14, R * 0.12)}px ui-sans-serif, system-ui, sans-serif`
  for (const g of rows) {
    const [x, y] = pos(g)
    const on = g.face === live.face
    ctx.beginPath()
    ctx.arc(x, y, on ? 11 : 8, 0, Math.PI * 2)
    ctx.fillStyle = `hsl(${g.hue ?? 280} 45% ${on ? 52 : 28}% / ${on ? 0.85 : 0.45})`
    ctx.fill()
    ctx.fillStyle = 'hsl(270 20% 96% / 0.95)'
    ctx.fillText(g.name, x, y)
  }
  const hex = 'hex' in live && live.hex ? live.hex : HEX[live.face] ?? ''
  caption.value = `${live.name} ${hex} · first ${core.name} · fifteenth empty`
}

const frame = (now: number) => {
  at = now
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
  paint(ctx, w, h)
}

const loop = (now: number) => {
  if (!glyphs.value.length) k = Math.floor(now / 1000) % VE
  frame(now)
  if (!reduce()) raf = requestAnimationFrame(loop)
}

const apply = (row: { glyphs?: Glyph[]; center?: Glyph; live?: { k: number } }) => {
  if (row.glyphs?.every((g) => g.from === 'glagolitic')) glyphs.value = row.glyphs
  if (row.center?.from === 'glagolitic') center.value = row.center
  if (row.live) k = row.live.k
}

onMounted(() => {
  void fetch('/widgets').then(async (res) => {
    if (!res.ok) return
    const body = await res.json() as { payload?: boolean; stream?: { glyphs?: Glyph[]; center?: Glyph; live?: { k: number } } }
    if (body.payload) return
    if (body.stream) apply(body.stream)
  })
  es = new EventSource('/sse')
  es.addEventListener('stream', (ev) => {
    apply(JSON.parse(String((ev as MessageEvent).data)) as { glyphs?: Glyph[]; center?: Glyph; live?: { k: number } })
  })
  frame(performance.now())
  if (!reduce()) raf = requestAnimationFrame(loop)
})
onUnmounted(() => {
  if (raf) cancelAnimationFrame(raf)
  es?.close()
})
</script>

<template>
  <div class="qpu-movie-layer">
    <canvas ref="canvas" class="qpu-movie-canvas" role="img" :aria-label="caption || 'glagolitic vector equilibrium'" />
    <p class="qpu-movie-ticker" aria-live="polite">{{ caption }}</p>
  </div>
</template>
