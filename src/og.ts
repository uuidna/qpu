// og — THE HERO IS THE OPEN GRAPH CARD. One constructor. 1200×630.
// Desk wiring. Numbers and addresses. Hardware QPU lane stays empty.
import {
  QPU_HUE_STEP, QPU_POINTS, QPU_STAR_PTS, RAYS, VE_FACES, qpuLicenceHostOf,
  qpuHologramOf, qpuSeatOf, qpuStarStrokeOf,
} from './hologram.js'

/** Open Graph large-image card. Width × height is the named occupancy, not a foundry pixel. */
export const OG_WIDTH = 1200
export const OG_HEIGHT = 630
export const OG_PATH = '/og.svg'
export const OG_TYPE = 'image/svg+xml'

const originOf = (): string => `https://${qpuLicenceHostOf()}`

const xml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const hsl = (plane: number, sat: number, light: number): string =>
  `hsl(${plane * QPU_HUE_STEP} ${sat}% ${light}%)`

export const qpuOgAltOf = (): string => {
  const seat = qpuSeatOf()
  const h = qpuHologramOf()
  return `QPU — ${seat.seat} seat, BindingPoint ${QPU_POINTS.join(' ')}, ${h.veFaces} faces hologram`
}

export const qpuOgHrefOf = (): string => new URL(OG_PATH, `${originOf()}/`).href

/** Hero card as SVG. Same pentagram as the homepage. Crawlers fetch this URL. */
export const qpuOgSvgOf = (): string => {
  const seat = qpuSeatOf()
  const h = qpuHologramOf()
  const stroke = qpuStarStrokeOf()
  const pts = QPU_STAR_PTS.map(([x, y]) => `${x},${y}`)
  const poly = stroke.map((i) => pts[i]!).join(' ')
  const bg = hsl(RAYS, 22, 9)
  const fg = hsl(RAYS, 70, 78)
  const accent = hsl(h.pentagram, 62, 54)
  const mute = hsl(h.credit, 18, 68)
  const labels = QPU_POINTS.map((name, i) => {
    const [x, y] = QPU_STAR_PTS[i]!
    return `<text x="${x}" y="${y - 6}" text-anchor="middle" font-size="8" fill="${accent}">${xml(name)}</text>`
  }).join('')
  const dots = QPU_STAR_PTS.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="${accent}"/>`).join('')
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}" viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}" role="img" aria-label="${xml(qpuOgAltOf())}">
  <rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="${bg}"/>
  <g transform="translate(90 75) scale(4)">
    <polygon points="${poly}" fill="none" stroke="${accent}" stroke-width="1.5"/>
    ${dots}
    ${labels}
  </g>
  <text x="640" y="210" font-family="ui-sans-serif, system-ui, sans-serif" font-size="72" font-weight="700" fill="${fg}">QPU</text>
  <text x="640" y="270" font-family="ui-sans-serif, system-ui, sans-serif" font-size="32" fill="${accent}">Three readings, one machine</text>
  <text x="640" y="330" font-family="ui-sans-serif, system-ui, sans-serif" font-size="22" fill="${mute}">Seat ${xml(seat.seat)}. Width ${xml(QPU_POINTS.join(' '))}.</text>
  <text x="640" y="372" font-family="ui-sans-serif, system-ui, sans-serif" font-size="22" fill="${mute}">Hologram ${h.veFaces} faces. Seal ten. Inner 6×7 ⇄ outer 7×6.</text>
  <text x="640" y="500" font-family="ui-sans-serif, system-ui, sans-serif" font-size="20" fill="${accent}">${xml(qpuLicenceHostOf())}</text>
</svg>
`
}

export const qpuOgOf = () => {
  const svg = qpuOgSvgOf()
  return {
    path: OG_PATH,
    href: qpuOgHrefOf(),
    width: OG_WIDTH,
    height: OG_HEIGHT,
    type: OG_TYPE,
    alt: qpuOgAltOf(),
    host: qpuLicenceHostOf(),
    seat: qpuSeatOf().seat,
    faces: VE_FACES,
    points: [...QPU_POINTS],
    svg,
  }
}

export const qpuOgHolds = (og = qpuOgOf()): boolean =>
  og.width === OG_WIDTH &&
  og.height === OG_HEIGHT &&
  og.type === OG_TYPE &&
  og.path === OG_PATH &&
  new URL(og.href).protocol === 'https:' &&
  og.seat === 'empty' &&
  og.faces === VE_FACES &&
  og.points.length === QPU_POINTS.length &&
  QPU_POINTS.every((p) => og.svg.includes(p)) &&
  og.svg.includes(qpuLicenceHostOf()) &&
  og.svg.includes(`width="${OG_WIDTH}"`) &&
  og.svg.includes(`height="${OG_HEIGHT}"`) &&
  og.svg.includes('polygon') &&
  og.alt.includes('empty')

export type QpuOgDoc = {
  title: string
  description: string
}

const asText = (v: unknown): string => (typeof v === 'string' ? v.trim() : '')

const fillParams = (s: string, params?: Record<string, string>): string => {
  if (!params) return s
  return s.replace(/\{\{\s*\$params\.(\w+)\s*\}\}/g, (_, k: string) => params[k] ?? '')
}

/** Open Graph title and description from a markdown page. Image occupancy stays qpuOgOf. */
export const qpuOgDocOf = (page: {
  title?: unknown
  description?: unknown
  hero?: unknown
  params?: Record<string, string>
}): QpuOgDoc => {
  const hero = page.hero && typeof page.hero === 'object' ? page.hero as Record<string, unknown> : undefined
  const title = fillParams(asText(page.title) || asText(hero?.name), page.params)
  const description = fillParams(
    asText(page.description) || [hero?.text, hero?.tagline].map(asText).filter(Boolean).join('. '),
    page.params,
  )
  return { title, description }
}
