import { defineLoader } from 'vitepress'
import {
  BASE, DONATE_URL, HANDLE_BITS, QPU_HOST, QPU_HUE_STEP, QPU_POINTS, QPU_STAR_PTS, VE_FACES,
  donateUrl, qpuChipOf, qpuDirectionOf, qpuFacesOf, qpuGatewaysHolds, qpuGatewaysOf, qpuHandleMaskOf,
  qpuHologramOf, qpuMachineOf, qpuSeatOf, qpuStarStrokeOf, qpuSuperpositionsOf, qpuTokensOf,
  qpuTwoNOf, qpuWidthOf,
} from '../../src/hologram.ts'
import {
  qpuNavOf, qpuSearchIndexOf, qpuSearchOf, qpuSidebarMapOf, qpuViteDoorsOf,
  type ChromeSearch, type ChromeSearchFilter,
} from '../../src/chrome.ts'
import { qpuCompareHolds, qpuCompareOf } from '../../src/metrics.ts'
import { qpuOgDocOf, qpuOgOf } from '../../src/og.ts'
import { qpuRoutesOf, qpuSeoOf } from '../../src/seo.ts'
import { QPU_PAYLOAD_API } from '../../src/config.ts'
import { qpuPwaOf } from '../../src/pwa.ts'

export type HologramData = ReturnType<typeof loadHologramOf>

declare const data: HologramData
export { data }

/** payload.find — VitePress defineLoader occupies Payload CRUD. */
export function loadHologramOf() {
  const find = QPU_PAYLOAD_API.find
  const superpositions = qpuSuperpositionsOf()
  const gateways = qpuGatewaysOf()
  const seat = qpuSeatOf()
  const width = qpuWidthOf()
  const hologram = qpuHologramOf()
  const chip = qpuChipOf()
  const machine = qpuMachineOf()
  const nav = qpuNavOf()
  const sidebar = qpuSidebarMapOf()
  const doors = qpuViteDoorsOf()
  const faces = qpuFacesOf()
  const compare = qpuCompareOf()
  const og = qpuOgOf()
  const origin = `https://${QPU_HOST}`
  const direction = qpuDirectionOf()
  const readings: Record<string, unknown> = {
    '/seat': seat,
    '/width': width,
    '/hologram': { ...hologram, superpositions, chip },
    '/chip': chip,
    '/merkaba': chip,
    '/gateways': { neighbours: gateways.length, gateways, holds: qpuGatewaysHolds(gateways) },
    '/metrics': { compare, holds: qpuCompareHolds(compare) },
    '/pwa': qpuPwaOf(),
  }
  for (const g of gateways) {
    readings[`/face/${g.face}`] = { ...g, superposition: superpositions[g.face], holds: true }
  }
  const seo = Object.fromEntries(qpuRoutesOf().map((r) => {
    const doc = qpuOgDocOf({ title: r.title, description: r.description })
    return [r.path, qpuSeoOf(r.path, doc)]
  }))
  return {
    find,
    api: QPU_PAYLOAD_API.vitepress,
    host: QPU_HOST,
    origin,
    donate: donateUrl(origin),
    wallet: DONATE_URL,
    seat,
    width,
    hologram,
    machine,
    chip,
    tokens: qpuTokensOf(),
    cells: superpositions.length,
    veFaces: VE_FACES,
    base: BASE,
    hueStep: QPU_HUE_STEP,
    points: [...QPU_POINTS],
    starPts: QPU_STAR_PTS.map(([x, y]) => [x, y] as const),
    starStroke: [...qpuStarStrokeOf()],
    handleBits: HANDLE_BITS,
    handleMask: qpuHandleMaskOf(HANDLE_BITS),
    handleSpan: qpuTwoNOf(HANDLE_BITS),
    superpositions,
    faces,
    gateways,
    nav,
    sidebar,
    doors,
    searchIndex: qpuSearchIndexOf(),
    compare,
    direction,
    og,
    readings,
    seo,
  }
}

export const searchOf = (q: string, filter: ChromeSearchFilter = {}): ChromeSearch =>
  qpuSearchOf(q, filter)

export default defineLoader({
  watch: ['../../src/hologram.ts', '../../src/chrome.ts', '../../src/config.ts', '../../src/pwa.ts'],
  load: loadHologramOf,
})
