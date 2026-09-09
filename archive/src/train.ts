// train — occupancy corpus. Fourteen VE faces, fourteen lessons. Sequence is the uuid messenger.
// Constructors only, never a crawl. When never. Seat empty. Desk does not mint theorem keys.
// Law: named uuidna.com HTTPS only. No keys. No third-party completions. No exchange quotes.
import { HANDLE_HEXBITS, QPU_HOST, QPU_POINTS, VE_FACES, qpuFacesOf, qpuSeatOf, qpuVersionIntegerOf } from './hologram.js'
import { QPU_VERSION } from './version.js'
import { QPU_FUSE_DOMAINS } from './bindings/recognize.js'
import { qpuSolidsOf } from './bindings/index.js'
import { QPU_LICENCE_APEX, qpuLicenceOf } from './licence.js'
import { QPU_CLOCK_SEQ_BITS } from './messenger.js'
import { STANDING, THEOREM_HOST } from './standing.js'
import { qpuLiveOf } from './live.js'

const ORIGIN = `https://${QPU_HOST}`
const theoremHrefOf = (slug: string): string => new URL(slug, `${THEOREM_HOST}/`).href

const namedUuidnaHostOf = (host: string): boolean => {
  const h = host.trim().toLowerCase()
  if (!h || h.includes('*') || h.includes('/') || h.includes(':') || h.includes(' ')) return false
  if (!h.includes('.') || h.startsWith('.') || h.endsWith('.')) return false
  return h === QPU_LICENCE_APEX || h.endsWith(`.${QPU_LICENCE_APEX}`)
}

const namedHttpsOf = (host: string, path = '/'): string | null => {
  if (!namedUuidnaHostOf(host) || path.includes('*') || !path.startsWith('/')) return null
  const u = new URL(path, `https://${host}/`)
  if (u.protocol !== 'https:' || u.hostname !== host) return null
  return u.href
}

/** Fourteen lessons occupying VE faces. The corpus is the square, not a sample. Named HTTPS doors only. */
export const QPU_TRAIN_LESSONS = [
  { title: 'seat', path: '/seat', constructor: 'qpuSeatOf', claim: 'the chip named QPU admits nothing' },
  { title: 'width', path: '/width', constructor: 'qpuWidthOf', claim: 'five BindingPoint names; the smaller point is the width' },
  { title: 'hologram', path: '/hologram', constructor: 'qpuHologramOf', claim: 'planes 0 3 6 5 7 8 14 are derived, not stranded' },
  { title: 'sandbox', path: '/environment', constructor: 'qpuRecognizeOf', claim: 'HTTP of named domains only; wildcards refuse' },
  { title: 'licence', path: '/licence', constructor: 'qpuLicenceOf', claim: 'license.uuidna.com issues offline certificates; clones refuse' },
  { title: 'hex', path: '/speed', constructor: 'qpuTwoNOf', claim: '2^n = 16^q × 2^r; empty tables refuse compute' },
  { title: 'messenger', path: '/messenger', constructor: 'qpuMessengerOf', claim: 'RFC 9562 clock_seq is fourteen bits through the uuid' },
  { title: 'when', path: '/live', constructor: 'qpuPqcOf', claim: 'when never; occupancy is not a clock' },
  { title: 'chip', path: '/chip', constructor: 'qpuChipOf', claim: 'hardware kind qpu never binds' },
  { title: 'square', path: '/gateways', constructor: 'qpuGatewaysOf', claim: 'fourteen neighbours are capacity gateways; amplitudes are 2^n' },
  { title: 'pqc', path: '/pqc', constructor: 'qpuPqcOf', claim: 'every face, every reflection, eight uuidna.com tiles' },
  { title: 'quantum', path: '/quantum', constructor: 'qpuQuantumOf', claim: 'pure, agnostic, every VE possibility' },
  { title: 'events', path: '/events', constructor: 'qpuEventsOf', claim: 'fourteen UI kinds occupy the same faces as live k' },
  { title: 'use', path: '/config', constructor: 'qpuLicenceApplyOf', claim: 'impossible not to use: compute closes over the live licence' },
] as const

/** Handle census of sealed leads. Prior art on uuidna.com/theorem. Captain posts only after Zenodo. */
export const QPU_TRAIN_CENSUS = [
  'key_floor_is_one_uuid',
  've_fourteen_faces',
  'qpu_superpositions_are_the_ve_square',
  'hardware_coverage_is_not_correctness_coverage',
  'naming_the_binding_point_is_total',
  'buying_the_point_that_does_not_bind_buys_nothing',
  'verify_beats_recompute_by_magnitudes',
  'monitoring_the_points_covers_every_crack_by_architecture',
] as const

/** Public keyless APIs: uuidna replicas only. They respond as occupancy JSON. No third-party inference. */
export const QPU_TRAIN_APIS = [
  { host: 'qpu.uuidna.com', kind: 'qpu' as const, path: '/train' },
  { host: 'unreal.uuidna.com', kind: 'occupancy' as const, path: '/' },
  { host: 'lean.uuidna.com', kind: 'lean' as const, path: '/' },
  { host: QPU_LICENCE_APEX, kind: 'apex' as const, path: '/' },
  { host: 'license.uuidna.com', kind: 'licence' as const, path: '/licence' },
] as const

/** BindingPoint leads. Hardware occupancy vs constructor APIs merge on the pentagram. */
export const QPU_TRAIN_RELATION_LEADS = [
  'width_is_the_binding_point_0',
  'qpu_cpu_gpu_self_balance',
  'the_width_is_never_below_one',
  'verify_beats_recompute_by_magnitudes',
  'hardware_coverage_is_not_correctness_coverage',
] as const

/** Hashed VitePress assets skip the Worker. Paid bindings stay unbound. Constructors, never a scrape. */
export const QPU_TRAIN_WORKER_FIRST = ['/*', '!/assets/*'] as const

const censusHold = (census: readonly { slug: string; href: string }[]): boolean => {
  const keys = new Set(STANDING.map((s) => s.key))
  if (census.length !== QPU_TRAIN_CENSUS.length || QPU_TRAIN_CENSUS.length !== HANDLE_HEXBITS) return false
  for (let i = 0; i < census.length; i++) {
    const row = census[i]!
    const want = QPU_TRAIN_CENSUS[i]!
    if (row.slug !== want || !keys.has(row.slug)) return false
    const u = new URL(row.href)
    if (u.protocol !== 'https:' || u.hostname !== 'uuidna.com' || u.pathname !== `/theorem/${row.slug}`) return false
  }
  return true
}

const apisHold = (apis: readonly { host: string; href: string; key: boolean; uuidna: string }[]): boolean => {
  if (apis.length !== QPU_POINTS.length || QPU_TRAIN_APIS.length !== QPU_POINTS.length) return false
  for (let i = 0; i < apis.length; i++) {
    const row = apis[i]!
    const want = QPU_TRAIN_APIS[i]!
    const href = namedHttpsOf(want.host, want.path)
    if (!href || row.host !== want.host || row.href !== href) return false
    if (row.key !== false || row.uuidna !== 'hold') return false
  }
  return true
}

/** Occupancy corpus for the live working QPU. Fourteen lessons fused with hardware, constructor APIs, billing, relations, and leads. */
export const qpuTrainOf = () => {
  const href = new URL('/train', `${ORIGIN}/`).href
  const faces = qpuFacesOf()
  const packed = qpuVersionIntegerOf(QPU_VERSION)
  const licence = qpuLicenceOf()
  const live = qpuLiveOf(0)
  const solids = qpuSolidsOf()
  const lessons = faces.map((face, i) => {
    const row = QPU_TRAIN_LESSONS[i]!
    return {
      face: face.face,
      opposite: face.opposite,
      title: row.title,
      path: row.path,
      constructor: row.constructor,
      claim: row.claim,
      record: 'may' as const,
    }
  })
  const census = QPU_TRAIN_CENSUS.map((slug) => ({ slug, href: theoremHrefOf(slug) }))
  const apis = QPU_TRAIN_APIS.map((row, i) => ({
    host: row.host,
    kind: row.kind,
    path: row.path,
    href: namedHttpsOf(row.host, row.path) ?? '',
    key: false as const,
    uuidna: 'hold' as const,
    point: QPU_POINTS[i]!,
    crawl: false as const,
    fetches: 0 as const,
  }))
  const trading = solids.apis.filter((a) => a.provider !== 'hardware')
  const relations = QPU_POINTS.map((point, i) => {
    const lead = QPU_TRAIN_RELATION_LEADS[i]!
    const trades = trading.filter((a) => a.point === point)
    return {
      point,
      hardware: { provider: 'hardware' as const, claimed: false as const, kind: 'qpu', binds: false as const },
      trading: { count: trades.length, quotes: false as const, crawl: false as const, fetches: 0 as const },
      ai: apis[i]!,
      lead: { slug: lead, href: theoremHrefOf(lead) },
      merge: trades.length > 0,
    }
  })
  const billing = {
    kind: 'workers' as const,
    runWorkerFirst: [...QPU_TRAIN_WORKER_FIRST],
    assets: { invoke: false as const, path: '/assets/*' as const },
    included: { requests: 10_000_000 as const, cpuMs: 30_000_000 as const },
    kv: false as const,
    d1: false as const,
    r2: false as const,
    durable: false as const,
    ai: false as const,
    egress: false as const,
    crawl: false as const,
    fetches: 0 as const,
  }
  const law = {
    keys: false as const,
    crawl: false as const,
    fetches: 0 as const,
    wildcards: false as const,
    completions: false as const,
    quotes: false as const,
    secrets: false as const,
    hosts: QPU_LICENCE_APEX,
    seat: 'empty' as const,
  }
  const strategies = lessons.map((lesson, i) => {
    const point = QPU_POINTS[i % QPU_POINTS.length]!
    const relation = relations[i % relations.length]!
    const api = apis[i % apis.length]!
    const lead = census[i % census.length]!
    return {
      face: lesson.face,
      title: lesson.title,
      point,
      hardware: {
        live: true as const,
        k: live.k,
        walked: live.walked,
        seat: live.seat,
        claimed: false as const,
        fetches: 0 as const,
      },
      trading: {
        count: relation.trading.count,
        quotes: false as const,
        crawl: false as const,
        fetches: 0 as const,
      },
      ai: {
        host: api.host,
        href: api.href,
        key: false as const,
        uuidna: 'hold' as const,
        fetches: 0 as const,
      },
      billing: { runWorkerFirst: billing.runWorkerFirst, assets: billing.assets.path, invoke: false as const },
      relation: { point: relation.point, merge: relation.merge },
      lead,
    }
  })
  const door = new URL(href)
  const holds =
    QPU_TRAIN_LESSONS.length === VE_FACES &&
    lessons.length === VE_FACES &&
    lessons.every((l, i) => {
      const want = QPU_TRAIN_LESSONS[i]!
      const lessonDoor = new URL(l.path, `${ORIGIN}/`)
      return l.face === i &&
        l.title === want.title &&
        l.path === want.path &&
        l.constructor === want.constructor &&
        l.record === 'may' &&
        want.path.startsWith('/') &&
        !want.path.includes('*') &&
        lessonDoor.protocol === 'https:' &&
        lessonDoor.hostname === QPU_HOST &&
        lessonDoor.pathname === want.path
    }) &&
    new Set(QPU_TRAIN_LESSONS.map((l) => l.path)).size === VE_FACES &&
    packed.hexbits[0] === packed.sequence &&
    licence.messenger === 'uuid' &&
    QPU_CLOCK_SEQ_BITS === VE_FACES &&
    QPU_FUSE_DOMAINS.every((d) => d.includes('.') && !d.includes('*')) &&
    censusHold(census) &&
    apisHold(apis) &&
    QPU_TRAIN_RELATION_LEADS.length === QPU_POINTS.length &&
    relations.length === QPU_POINTS.length &&
    relations.every((r, i) => r.point === QPU_POINTS[i] && r.merge === true && r.hardware.claimed === false && r.hardware.binds === false && r.trading.quotes === false && r.trading.fetches === 0) &&
    strategies.length === VE_FACES &&
    strategies.every((s) => s.hardware.claimed === false && s.trading.quotes === false && s.ai.key === false && s.ai.uuidna === 'hold' && s.billing.invoke === false && s.lead.href.startsWith('https://uuidna.com/theorem/')) &&
    live.seat === 'empty' &&
    live.walked === true &&
    billing.ai === false &&
    billing.kv === false &&
    billing.d1 === false &&
    billing.r2 === false &&
    billing.durable === false &&
    billing.fetches === 0 &&
    law.keys === false &&
    law.completions === false &&
    law.quotes === false &&
    law.crawl === false &&
    qpuSeatOf().seat === 'empty' &&
    door.protocol === 'https:' &&
    door.hostname === QPU_HOST &&
    door.pathname === '/train'
  return {
    kind: 'train' as const,
    holds,
    when: 'never' as const,
    seat: qpuSeatOf().seat,
    href,
    faces: VE_FACES,
    sequence: packed.sequence,
    messenger: 'uuid' as const,
    corpus: 'occupancy' as const,
    crawl: false as const,
    fetches: 0 as const,
    training: 'professional' as const,
    record: 'may' as const,
    video: { container: 'webm' as const, chapters: true as const, role: 'train' as const },
    law,
    billing,
    apis,
    relations,
    strategies,
    lessons,
    census,
    leads: census,
  }
}

export const qpuTrainHolds = (t = qpuTrainOf()): boolean =>
  t.kind === 'train' &&
  t.holds === true &&
  t.when === 'never' &&
  t.seat === 'empty' &&
  t.crawl === false &&
  t.fetches === 0 &&
  t.corpus === 'occupancy' &&
  t.training === 'professional' &&
  t.record === 'may' &&
  t.law.keys === false &&
  t.law.completions === false &&
  t.law.quotes === false &&
  t.law.hosts === QPU_LICENCE_APEX &&
  t.billing.ai === false &&
  t.apis.length === QPU_POINTS.length &&
  t.relations.length === QPU_POINTS.length &&
  t.strategies.length === VE_FACES &&
  t.leads.length === HANDLE_HEXBITS &&
  t.video.container === 'webm' &&
  t.video.chapters === true &&
  t.video.role === 'train' &&
  t.messenger === 'uuid' &&
  t.lessons.length === VE_FACES &&
  new URL(t.href).pathname === '/train'
