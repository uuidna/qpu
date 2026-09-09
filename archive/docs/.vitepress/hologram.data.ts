import { defineLoader } from 'vitepress'
import {
  BASE, DONATE_URL, HANDLE_BITS, QPU_HOST, QPU_HUE_STEP, QPU_POINTS, QPU_STAR_PTS, VE_FACES,
  donateUrl, qpuChipOf, qpuDirectionOf, qpuExperienceOf, qpuFacesOf, qpuGatewaysHolds, qpuGatewaysOf, qpuHandleMaskOf,
  qpuHologramOf, qpuMachineOf, qpuSeatOf, qpuStarStrokeOf, qpuSuperpositionsOf, qpuTokensOf,
  qpuTwoNOf, qpuWidthOf,
} from '../../src/hologram.ts'
import {
  qpuNavOf, qpuSearchIndexOf, qpuSearchOf, qpuSidebarMapOf, qpuViteDoorsOf,
  type ChromeSearch, type ChromeSearchFilter,
} from '../../src/chrome.ts'
import { qpuCompareHolds, qpuCompareOf, qpuSpeedOf } from '../../src/metrics.ts'
import { qpuOgDocOf, qpuOgOf } from '../../src/og.ts'
import { qpuRoutesOf, qpuSeoOf } from '../../src/seo.ts'
import { QPU_PAYLOAD_API, qpuConfigOf } from '../../src/config.ts'
import { qpuPwaOf } from '../../src/pwa.ts'
import { qpuBootOf } from '../../src/boot.ts'
import { QPU_EVENT_LISTEN, qpuEventsHolds, qpuEventsOf } from '../../src/events.ts'
import { qpuLiveOf } from '../../src/live.ts'
import { STANDING, standingByFileOf, qpuStandingFilesOf } from '../../src/standing.ts'
import { qpuChatOf } from '../../src/chat.ts'
import { qpuPqcOf } from '../../src/pqc.ts'
import { qpuQuantumOf } from '../../src/quantum.ts'
import { qpuLicenceOf } from '../../src/licence.ts'
import { qpuMessengerOf } from '../../src/messenger.ts'
import { qpuTrainOf } from '../../src/train.ts'
import { qpuScaleOf } from '../../src/scale.ts'
import { qpuFractalOf } from '../../src/fractal.ts'
import { qpuWidgetsOf } from '../../src/widgets.ts'

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
  const chat = qpuChatOf()
  const events = { kinds: qpuEventsOf(), listen: QPU_EVENT_LISTEN, holds: qpuEventsHolds(), seat: qpuSeatOf() }
  const standing = { files: qpuStandingFilesOf(), byFile: standingByFileOf(), standing: STANDING }
  const readings: Record<string, unknown> = {
    '/seat': seat,
    '/width': width,
    '/hologram': { ...hologram, superpositions, chip },
    '/chip': chip,
    '/merkaba': chip,
    '/gateways': { neighbours: gateways.length, gateways, holds: qpuGatewaysHolds(gateways) },
    '/metrics': { compare, holds: qpuCompareHolds(compare) },
    '/speed': { speed: qpuSpeedOf(), seat },
    '/pwa': qpuPwaOf(),
    '/boot': qpuBootOf(),
    '/events': events,
    '/live': qpuLiveOf(0),
    '/experience': qpuExperienceOf(),
    '/standing': standing,
    '/chat': chat,
    '/room': chat,
    '/pqc': qpuPqcOf(),
    '/quantum': qpuQuantumOf(),
    '/licence': qpuLicenceOf(),
    '/messenger': qpuMessengerOf(),
    '/train': qpuTrainOf(),
    '/config': qpuConfigOf(),
    '/scale': qpuScaleOf(),
    '/fractal': qpuFractalOf(),
    '/og': qpuOgOf(),
    '/widgets': qpuWidgetsOf(0),
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
  watch: [
    '../../src/hologram.ts', '../../src/chrome.ts', '../../src/config.ts', '../../src/pwa.ts',
    '../../src/boot.ts', '../../src/events.ts', '../../src/live.ts', '../../src/standing.ts',
    '../../src/chat.ts', '../../src/pqc.ts', '../../src/quantum.ts', '../../src/licence.ts',
    '../../src/messenger.ts', '../../src/train.ts', '../../src/scale.ts', '../../src/fractal.ts',
    '../../src/widgets.ts', '../../src/metrics.ts', '../../src/og.ts',
  ],
  load: loadHologramOf,
})
