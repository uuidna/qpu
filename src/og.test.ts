import { test } from 'node:test'
import assert from 'node:assert/strict'
import { QPU_HOST, QPU_POINTS, VE_FACES, qpuSeatOf } from './hologram.js'
import { handleQpuFetch } from './edge.js'
import { qpuSeoOf } from './seo.js'
import { OG_HEIGHT, OG_PATH, OG_TYPE, OG_WIDTH, qpuOgHolds, qpuOgHrefOf, qpuOgOf, qpuOgSvgOf } from './og.js'
import { qpuMcpCall } from './mcp-catalog.js'

test('hero Open Graph card is 1200×630 and names the empty seat', () => {
  const og = qpuOgOf()
  assert.equal(og.width, OG_WIDTH)
  assert.equal(og.height, OG_HEIGHT)
  assert.equal(og.width, 1200)
  assert.equal(og.height, 630)
  assert.equal(og.type, OG_TYPE)
  assert.equal(og.path, OG_PATH)
  assert.equal(og.href, `https://${QPU_HOST}${OG_PATH}`)
  assert.equal(og.seat, qpuSeatOf().seat)
  assert.equal(og.seat, 'empty')
  assert.equal(og.faces, VE_FACES)
  assert.deepEqual(og.points, [...QPU_POINTS])
  assert.equal(qpuOgHolds(og), true)
  assert.equal(qpuOgHrefOf(), og.href)
  const svg = qpuOgSvgOf()
  assert.match(svg, /<polygon /)
  assert.match(svg, new RegExp(`width="${OG_WIDTH}"`))
  assert.match(svg, new RegExp(`height="${OG_HEIGHT}"`))
  for (const p of QPU_POINTS) assert.ok(svg.includes(p), p)
  assert.ok(svg.includes(QPU_HOST))
  assert.ok(svg.includes('empty'))
})

test('GET /og.svg is the hero card; GET /og is the constructor', async () => {
  const img = await handleQpuFetch(new Request(`https://${QPU_HOST}/og.svg`))
  assert.equal(img.status, 200)
  assert.equal(img.headers.get('content-type'), 'image/svg+xml; charset=utf-8')
  const body = await img.text()
  assert.equal(body, qpuOgSvgOf())
  const meta = await handleQpuFetch(new Request(`https://${QPU_HOST}/og`))
  assert.equal(meta.status, 200)
  const json = await meta.json() as { href: string; width: number; svg?: string }
  assert.equal(json.href, qpuOgOf().href)
  assert.equal(json.width, 1200)
  assert.equal(json.svg, undefined)
})

test('every SEO head carries the hero as og:image with width height type alt', () => {
  const home = qpuSeoOf('/')
  const href = qpuOgHrefOf()
  assert.ok(home.head.some((h) => h[0] === 'meta' && h[1].property === 'og:image' && h[1].content === href))
  assert.ok(home.head.some((h) => h[0] === 'meta' && h[1].property === 'og:image:width' && h[1].content === '1200'))
  assert.ok(home.head.some((h) => h[0] === 'meta' && h[1].property === 'og:image:height' && h[1].content === '630'))
  assert.ok(home.head.some((h) => h[0] === 'meta' && h[1].property === 'og:image:type' && h[1].content === OG_TYPE))
  assert.ok(home.head.some((h) => h[0] === 'meta' && h[1].property === 'og:image:alt' && (h[1].content ?? '').includes('empty')))
  assert.ok(home.head.some((h) => h[0] === 'meta' && h[1].name === 'twitter:image' && h[1].content === href))
  assert.equal((home.jsonLd.image as { url: string }).url, href)
  const gone = qpuSeoOf('/404')
  assert.ok(gone.head.some((h) => h[0] === 'meta' && h[1].property === 'og:image' && h[1].content === href))
})

test('MCP qpu_og returns the hero constructor', async () => {
  const og = await qpuMcpCall('qpu_og', {}) as { href: string; width: number; seat: string }
  assert.equal(og.href, qpuOgHrefOf())
  assert.equal(og.width, 1200)
  assert.equal(og.seat, 'empty')
})
