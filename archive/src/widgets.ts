// widgets — licensed-site chrome. UUID streams only. Payload stays off this door.
// Share across named HTTPS hosts. Fetches never. Seat empty.
import {
  HEXBIT_PAGE, HEXBIT_STATES, UUID_HEXBITS, VE_FACES, qpuAnimateHolds, qpuAnimateOf, qpuDirectionOf, qpuEquilibriumHolds, qpuEquilibriumOf, qpuGlagoliticOf, qpuSeatOf,
} from './hologram.js'
import { qpuLiveOf } from './live.js'
import { qpuUuidOf } from './messenger.js'
import { qpuSitesOf } from './chrome.js'

export const QPU_WIDGETS = [
  { id: 'movie', slot: 'root' },
  { id: 'direction', slot: 'layout-top' },
  { id: 'search', slot: 'nav-bar-content-after' },
  { id: 'sidebar', slot: 'sidebar-nav-before' },
  { id: 'lattice', slot: 'home-features-after' },
  { id: 'seat', slot: 'aside-outline-before' },
  { id: 'donate', slot: 'aside-outline-after' },
  { id: 'notfound', slot: 'not-found' },
  { id: 'pentagram', slot: '' },
] as const

const uuidOf = (face: number, k: number): string => {
  const tiles: string[] = []
  for (let i = 0; i < UUID_HEXBITS; i++) tiles.push(HEXBIT_PAGE[(face + k + i) % HEXBIT_STATES]!)
  const h = tiles.join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`
}

/** Public uuid chain for chrome widgets. Layers 0 — imprint, not onion. Payload false. */
export const qpuUuidStreamOf = (at = 0) => {
  const live = qpuLiveOf(at)
  const direction = qpuDirectionOf()
  const t = at < 0 ? 0 : at
  const k = (Math.floor(t / 1000) % VE_FACES + VE_FACES) % VE_FACES
  const uuids = Array.from({ length: VE_FACES }, (_, face) => uuidOf(face, k))
  const glyphs = Array.from({ length: VE_FACES }, (_, face) => ({
    ...qpuAnimateOf(qpuGlagoliticOf(face)),
    uuid: uuids[face]!,
  }))
  const receipt = uuids[k]!
  const center = { ...qpuAnimateOf(qpuGlagoliticOf(0)), uuid: uuids[0]! }
  const equilibrium = qpuEquilibriumOf()
  return {
    kind: 'stream' as const,
    payload: false as const,
    graphql: false as const,
    fetches: 0 as const,
    when: 'never' as const,
    layers: 0 as const,
    uuids,
    glyphs,
    center,
    equilibrium,
    receipt,
    live: {
      k,
      heading: direction.heading,
      morph: direction.temperature.morph,
      beats: direction.speed.beats,
      verify: direction.speed.verify,
      may: direction.scale.may,
      seat: live.seat,
      name: qpuGlagoliticOf(k),
    },
  }
}

export const qpuUuidStreamHolds = (s = qpuUuidStreamOf(0)): boolean =>
  s.kind === 'stream' &&
  s.payload === false &&
  s.graphql === false &&
  s.fetches === 0 &&
  s.layers === 0 &&
  s.uuids.length === VE_FACES &&
  s.glyphs.length === VE_FACES &&
  s.uuids.every((u) => qpuUuidOf(u) === u) &&
  qpuUuidOf(s.receipt) === s.receipt &&
  s.uuids.includes(s.receipt) &&
  s.live.seat === 'empty' &&
  s.live.name === qpuGlagoliticOf(s.live.k) &&
  s.center.from === 'glagolitic' &&
  s.center.first === true &&
  s.center.uuid === s.uuids[0] &&
  s.glyphs.every((g, i) =>
    g.from === 'glagolitic' &&
    g.name === qpuGlagoliticOf(i) &&
    g.uuid === s.uuids[i] &&
    qpuAnimateHolds(g.name),
  ) &&
  qpuEquilibriumHolds(s.equilibrium)

export const qpuWidgetsOf = (at = 0) => {
  const stream = qpuUuidStreamOf(at)
  const sites = qpuSitesOf()
  const holds =
    qpuUuidStreamHolds(stream) &&
    sites.length > 0 &&
    sites.every((site) => site.host.includes('.') && !site.host.includes('*'))
  return {
    kind: 'widgets' as const,
    share: true as const,
    licensed: true as const,
    payload: false as const,
    graphql: false as const,
    finds: false as const,
    sse: '/sse' as const,
    widgets: QPU_WIDGETS.map((w) => ({ ...w, share: true as const, payload: false as const })),
    stream,
    sites,
    holds,
    seat: qpuSeatOf().seat,
    fetches: 0 as const,
    when: 'never' as const,
  }
}

export const qpuWidgetsHolds = (w = qpuWidgetsOf(0)): boolean =>
  w.kind === 'widgets' &&
  w.share === true &&
  w.licensed === true &&
  w.payload === false &&
  w.graphql === false &&
  w.finds === false &&
  w.sse === '/sse' &&
  w.fetches === 0 &&
  w.seat === 'empty' &&
  w.holds === true &&
  w.widgets.length === QPU_WIDGETS.length &&
  w.widgets.every((row) => row.share === true && row.payload === false) &&
  qpuUuidStreamHolds(w.stream)
