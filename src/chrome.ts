// chrome — nav, sidebar, and search computed upon request from the hologram. Never hand-typed menus.
// Search engine: deep-analyze every licensed site from constructors. Census of URL shape, never a live crawl.
import { QPU_HOST, QPU_POINTS, VE_FACES, qpuFacesOf, qpuHologramOf, qpuSeatOf, qpuSuperpositionsOf } from './hologram.js'
import { STANDING, standingByFileOf } from './standing.js'
import { qpuRoutesOf, type SeoRoute } from './seo.js'
export interface ChromeLink {
  text: string
  link: string
}

export interface ChromeGroup {
  text: string
  items: ChromeLink[]
}

export interface ChromeHit {
  kind: string
  text: string
  link: string
  site?: string
  score?: number
}

const SATELLITES: readonly { host: string; path: string; alias?: string; kind: string; product: string; nav?: string }[] = []
const satelliteDoorsOf = (): string[] => []
const satelliteOccupies = (_p: string): boolean => false
const satelliteSearchOf = (): ChromeHit[] => []
const OUTER_HOLOGRAM_HOST = QPU_HOST


export interface ChromeSearchFilter {
  site?: string
  kind?: string
}

export interface ChromeSearchSite {
  host: string
  path: string
  hits: number
}

export interface ChromeSearch {
  q: string
  hits: ChromeHit[]
  analyzed: {
    tokens: string[]
    indexed: number
    sites: ChromeSearchSite[]
    kinds: string[]
    deep: true
  }
}

/** Occupancy doors the worker serves that are not yet a SEO reading row. Exact paths only. */
const LATTICE_EXTRA = ['/standing', '/events', '/boot'] as const

const SEARCH_CAP = 64

const faceOfPath = (path: string): number | null => {
  const m = /^\/face\/(\d+)\/?$/.exec(path.split('#')[0] ?? '')
  if (!m) return null
  const n = Number(m[1])
  if (n !== n || n < 0 || n >= VE_FACES) return null
  return n
}

const bareOf = (path: string): string => {
  const raw = (path.split('#')[0] ?? '/').trim() || '/'
  if (raw.length > 1 && raw.endsWith('/')) return raw.slice(0, -1)
  return raw || '/'
}

const isAliasRoute = (r: SeoRoute): boolean => /^same /i.test(r.description)

const labelOfRoute = (r: SeoRoute): string => {
  const sat = SATELLITES.find((s) => s.path === r.path)
  if (sat?.nav) return sat.nav
  const head = r.title.split('—')[0]?.trim() ?? r.title
  return head.replace(/^QPU /i, '').replace(/^Unreal /i, '').trim() || r.path
}

const siteOfPath = (path: string): string => {
  const bare = bareOf(path)
  const sat = SATELLITES.find((s) => s.path === bare || s.alias === bare)
  if (sat) return sat.host
  if (path.startsWith('http')) {
    try { return new URL(path).hostname } catch { return QPU_HOST }
  }
  return QPU_HOST
}

/** Licensed hosts this worker occupies. Named licence, no wildcard, no live crawl. */
export const qpuSitesOf = (): readonly { host: string; path: string; kind: string; product: string }[] => {
  const rows = [
    { host: OUTER_HOLOGRAM_HOST, path: '/hologram', kind: 'hologram', product: 'QPU hologram' },
  ]
  const seen = new Set<string>()
  return rows.filter((r) => {
    const k = `${r.host}:${r.path}`
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

const latticePathsOf = (): Set<string> => {
  const set = new Set<string>(satelliteDoorsOf())
  for (const r of qpuRoutesOf()) {
    if (r.kind === 'reading') set.add(r.path)
  }
  for (const p of LATTICE_EXTRA) set.add(p)
  return set
}

const occupiesLattice = (path: string): boolean => {
  const bare = bareOf(path)
  if (bare === '/' || bare === '/paper' || bare === '/manual' || bare === '/author') return false
  if (faceOfPath(bare) !== null) return false
  return satelliteOccupies(bare) || latticePathsOf().has(bare)
}

const paperOf = (): ChromeGroup[] => [
  {
    text: 'Paper',
    items: [
      { text: 'Overview', link: '/paper' },
      { text: 'User manual', link: '/manual' },
      { text: 'Cite', link: '/author' },
    ],
  },
]

const latticeOf = (): ChromeGroup[] => [
  {
    text: `${VE_FACES} faces`,
    items: qpuSuperpositionsOf().map((s) => ({
      text: `face ${s.face} door ${s.door} referer ${s.referer}`,
      link: `/face/${s.face}`,
    })),
  },
]

/** VitePress themeConfig.nav doors — site-root paths only. */
export const qpuViteDoorsOf = (): ChromeLink[] => {
  const seen = new Set<string>()
  const out: ChromeLink[] = []
  for (const g of qpuNavOf()) {
    for (const it of g.items) {
      if (!it.link.startsWith('/') || seen.has(it.link)) continue
      seen.add(it.link)
      out.push(it)
    }
  }
  return out
}

export const qpuNavOf = (): ChromeGroup[] => {
  const h = qpuHologramOf()
  const seat = qpuSeatOf()
  const seen = new Set<string>()
  const readings: ChromeLink[] = []
  const push = (text: string, link: string) => {
    if (seen.has(link)) return
    seen.add(link)
    readings.push({ text, link })
  }
  push(`Seat · ${seat.seat}`, '/seat')
  push(`Width · ${QPU_POINTS.join(' ')}`, '/width')
  push(`Hologram · ${h.veFaces} faces`, '/hologram')
  for (const r of qpuRoutesOf()) {
    if (r.kind !== 'reading' || isAliasRoute(r)) continue
    push(labelOfRoute(r), r.path)
  }
  for (const p of LATTICE_EXTRA) {
    push(p.slice(1).replace(/^\w/, (c) => c.toUpperCase()), p)
  }
  push('Speed', '/speed')
  push('Hero · Open Graph', '/og')
  return [
    { text: 'Readings', items: readings },
    {
      text: `${h.veFaces} faces`,
      items: qpuFacesOf().map((f) => ({ text: `${f.face}↔${f.opposite}`, link: `/face/${f.face}` })),
    },
    ...paperOf(),
  ]
}

/** Sidebar for this path — referer and angles when the request is a face. */
export const qpuSidebarOf = (path: string): ChromeGroup[] => {
  const raw = path.trim() || '/'
  const face = faceOfPath(raw)
  if (face !== null) {
    const s = qpuSuperpositionsOf()[face]!
    return [
      {
        text: `Face ${s.face}↔${s.opposite}`,
        items: [
          { text: `referer ${s.referer}`, link: `/face/${s.face}` },
          { text: `door ${s.door}`, link: `/face/${s.face}` },
          { text: `hue ${s.angles.hue}°`, link: `/face/${s.face}` },
          { text: `dash ${s.angles.dash}°`, link: `/face/${s.face}` },
          { text: `slot ${s.angles.slot}°`, link: `/face/${s.face}` },
          { text: `reflection ${s.angles.reflection}°`, link: `/face/${s.face}` },
        ],
      },
      {
        text: 'All faces',
        items: qpuFacesOf().map((f) => ({ text: `${f.face}↔${f.opposite}`, link: `/face/${f.face}` })),
      },
    ]
  }
  const bare = bareOf(raw)
  if (occupiesLattice(bare)) return latticeOf()
  if (bare === '/paper' || bare === '/manual' || bare === '/author') {
    return [
      ...paperOf(),
      ...standingByFileOf().map((f) => ({
        text: f.file,
        items: f.theorems.map((s) => ({
          text: s.key,
          link: `https://uuidna.com/theorem/${s.key}`,
        })),
      })),
    ]
  }
  return qpuNavOf()
}

/** VitePress themeConfig.sidebar — every linkable route, from the QPU API only. */
export const qpuSidebarMapOf = (): Record<string, ChromeGroup[]> => {
  const map: Record<string, ChromeGroup[]> = {}
  for (const r of qpuRoutesOf()) map[r.path] = qpuSidebarOf(r.path)
  for (const p of LATTICE_EXTRA) map[p] = qpuSidebarOf(p)
  return map
}

const indexOf = (): ChromeHit[] => {
  const h = qpuHologramOf()
  const hits: ChromeHit[] = [
    { kind: 'plane', text: `foundation ${h.foundation}`, link: '/hologram', site: QPU_HOST },
    { kind: 'plane', text: `debit ${h.debit}`, link: '/hologram', site: QPU_HOST },
    { kind: 'plane', text: `credit ${h.credit}`, link: '/hologram', site: QPU_HOST },
    { kind: 'plane', text: `pentagram ${h.pentagram}`, link: '/width', site: QPU_HOST },
    { kind: 'plane', text: `fold ${h.fold}`, link: '/hologram', site: QPU_HOST },
    { kind: 'plane', text: `octet ${h.octet}`, link: '/hologram', site: QPU_HOST },
    { kind: 'plane', text: `veFaces ${h.veFaces}`, link: '/hologram', site: QPU_HOST },
    { kind: 'image', text: 'og.svg 1200×630', link: '/og.svg', site: QPU_HOST },
    { kind: 'paper', text: 'paper overview citation APA', link: '/paper', site: QPU_HOST },
    { kind: 'paper', text: 'user manual', link: '/manual', site: QPU_HOST },
    { kind: 'host', text: QPU_HOST, link: '/', site: QPU_HOST },
  ]
  for (const site of qpuSitesOf()) {
    hits.push({
      kind: 'site',
      text: `${site.host} ${site.product} ${site.kind}`,
      link: site.path,
      site: site.host,
    })
  }
  for (const s of satelliteSearchOf()) {
    hits.push({ kind: s.kind, text: s.text, link: s.link, site: siteOfPath(s.link) })
  }
  for (const r of qpuRoutesOf()) {
    hits.push({
      kind: r.kind === 'reading' ? 'door' : r.kind,
      text: `${r.title} ${r.description} ${r.path}`,
      link: r.path,
      site: siteOfPath(r.path),
    })
  }
  for (const p of LATTICE_EXTRA) {
    hits.push({ kind: 'door', text: `qpu ${p.slice(1)} reading`, link: p, site: QPU_HOST })
  }
  for (const f of qpuFacesOf()) {
    hits.push({
      kind: 'face',
      text: `face ${f.face} opposite ${f.opposite}`,
      link: `/face/${f.face}`,
      site: QPU_HOST,
    })
  }
  for (const s of qpuSuperpositionsOf()) {
    hits.push({
      kind: 'face',
      text: `face ${s.face} opposite ${s.opposite} referer ${s.referer} door ${s.door} hue ${s.angles.hue} dash ${s.angles.dash}`,
      link: `/face/${s.face}`,
      site: QPU_HOST,
    })
  }
  for (const s of STANDING) {
    hits.push({
      kind: `standing-${s.role}`,
      text: `${s.key} ${s.claim}`,
      link: `https://uuidna.com/theorem/${s.key}`,
      site: 'uuidna.com',
    })
  }
  for (const g of qpuNavOf()) {
    for (const it of g.items) {
      hits.push({ kind: 'nav', text: it.text, link: it.link, site: siteOfPath(it.link) })
    }
  }
  return hits
}

/** VitePress defineLoader search corpus — Payload/VitePress find, never a crawl. */
export const qpuSearchIndexOf = (): ChromeHit[] => indexOf()

const scoreOf = (hit: ChromeHit, needle: string, tokens: string[]): number => {
  const hay = `${hit.kind} ${hit.text} ${hit.link} ${hit.site ?? ''}`.toLowerCase()
  if (tokens.some((t) => !hay.includes(t))) return 0
  const path = bareOf(hit.link).toLowerCase()
  const site = (hit.site ?? '').toLowerCase()
  let n = 4
  if (site === needle) n += 100
  if (path === needle || path === `/${needle}` || hit.link.toLowerCase() === needle) n += 90
  if (site.endsWith(`.${needle}`) === false && site.includes(needle) && site !== needle) n += 25
  if (hit.text.toLowerCase().includes(needle)) n += 30
  if (hit.link.toLowerCase().includes(needle)) n += 20
  if (hay.includes(needle)) n += 10
  if (hit.kind === 'site' || hit.kind === 'door' || hit.kind === 'reading') n += 16
  if (hit.kind === 'nav') n += 8
  if (hit.kind === 'reflection') n -= 8
  n += tokens.length * 2
  return n
}

const analyzedOf = (hits: ChromeHit[], indexed: number, tokens: string[]) => {
  const byHost = new Map<string, ChromeSearchSite>()
  for (const h of hits) {
    const host = h.site ?? QPU_HOST
    const row = byHost.get(host)
    if (row) row.hits += 1
    else byHost.set(host, { host, path: bareOf(h.link), hits: 1 })
  }
  const kinds = [...new Set(hits.map((h) => h.kind))]
  return {
    tokens,
    indexed,
    sites: [...byHost.values()].sort((a, b) => b.hits - a.hits || (a.host < b.host ? -1 : 1)),
    kinds,
    deep: true as const,
  }
}

/** Deep-analyze every licensed site in the hologram index — constructors only, never a crawl. */
export const qpuSearchOf = (q: string, filter: ChromeSearchFilter = {}): ChromeSearch => {
  const needle = q.trim().toLowerCase()
  const tokens = needle.split(/\s+/).filter(Boolean)
  const indexed = indexOf()
  if (!needle) {
    return { q, hits: [], analyzed: analyzedOf([], indexed.length, tokens) }
  }
  const siteNeedle = filter.site?.trim().toLowerCase()
  const kindNeedle = filter.kind?.trim().toLowerCase()
  const ranked: ChromeHit[] = []
  for (const h of indexed) {
    if (siteNeedle && (h.site ?? '').toLowerCase() !== siteNeedle) continue
    if (kindNeedle && h.kind.toLowerCase() !== kindNeedle) continue
    const score = scoreOf(h, needle, tokens)
    if (score <= 0) continue
    ranked.push({ ...h, score })
  }
  ranked.sort((a, b) => (b.score ?? 0) - (a.score ?? 0) || (a.link < b.link ? -1 : 1))
  const hits = ranked.slice(0, SEARCH_CAP)
  return { q, hits, analyzed: analyzedOf(hits, indexed.length, tokens) }
}

export const qpuChromeOf = (path: string, q = ''): {
  nav: ChromeGroup[]
  sidebar: ChromeGroup[]
  search: ChromeSearch
} => ({
  nav: qpuNavOf(),
  sidebar: qpuSidebarOf(path),
  search: qpuSearchOf(q),
})

export const qpuSearchHolds = (s = qpuSearchOf('qpu.uuidna.com')): boolean =>
  s.analyzed.deep === true &&
  s.analyzed.indexed > VE_FACES &&
  s.hits.some((h) => h.link === '/hologram') &&
  qpuSitesOf().every((site) => site.host.includes('.') && !site.host.includes('*')) &&
  Object.keys(qpuSidebarMapOf()).includes('/hologram')
