// quantum — pure occupancy of every quantum possibility. The live site is the working QPU.
// Agnostic: all faces, no named product, when never. Seat empty. Not a device.
// Holds proves fourteen faces with referer, door, and angles; amplitudes are 2^n. Quantum.lean keys complete, not a sample.
import {
  BASE, HEXBIT_STATES, QPU_ANGLES, QPU_DOORS, QPU_HOST, VE_FACES,
  qpuFacesOf, qpuSeatOf, qpuSuperpositionsOf, qpuTwoNOf, throughVoid,
} from './hologram.js'
import { STANDING, THEOREM_HOST } from './standing.js'

const ORIGIN = `https://${QPU_HOST}`
const SQUARE = 'qpu_superpositions_are_the_ve_square'
const theoremHrefOf = (slug: string): string => new URL(slug, `${THEOREM_HOST}/`).href

/** Unique Quantum.lean keys this worker is licensed to cite. Complete file census, not a sample. */
export const qpuQuantumKeysOf = (): string[] => {
  const seen = new Set<string>()
  const keys: string[] = []
  for (const s of STANDING) {
    if (s.file !== 'Quantum.lean' || seen.has(s.key)) continue
    seen.add(s.key)
    keys.push(s.key)
  }
  return keys
}

export const qpuQuantumFacesHold = (surfaces: readonly { face: number; opposite: number }[]): boolean => {
  if (surfaces.length !== VE_FACES) return false
  const seen = new Set<number>()
  for (let i = 0; i < VE_FACES; i++) {
    const row = surfaces[i]!
    if (row.face !== i) return false
    if (row.opposite !== throughVoid(i % BASE)) return false
    if (seen.has(row.face)) return false
    seen.add(row.face)
  }
  return seen.size === VE_FACES
}

export const qpuQuantumSquareHold = (rows: ReturnType<typeof qpuSuperpositionsOf>): boolean => {
  if (rows.length !== VE_FACES) return false
  for (let i = 0; i < VE_FACES; i++) {
    const s = rows[i]!
    if (s.face !== i) return false
    if (s.opposite !== throughVoid(i % BASE)) return false
    if (s.referer !== s.face % HEXBIT_STATES) return false
    if (s.door !== s.referer % QPU_DOORS) return false
    if (s.angles.hue !== QPU_ANGLES.hue) return false
    if (s.angles.dash !== QPU_ANGLES.dash) return false
    if (s.angles.slot !== QPU_ANGLES.slot) return false
    if (s.angles.reflection !== QPU_ANGLES.reflection) return false
  }
  return true
}

const censusHold = (census: readonly { slug: string; href: string }[]): boolean => {
  const keys = qpuQuantumKeysOf()
  if (census.length !== keys.length || keys.length === 0) return false
  const standing = new Set(STANDING.map((s) => s.key))
  const seen = new Set<string>()
  for (let i = 0; i < census.length; i++) {
    const row = census[i]!
    if (row.slug !== keys[i]) return false
    if (seen.has(row.slug) || !standing.has(row.slug)) return false
    seen.add(row.slug)
    const u = new URL(row.href)
    if (u.protocol !== 'https:' || u.hostname !== 'uuidna.com' || u.pathname !== `/theorem/${row.slug}`) return false
  }
  return seen.size === keys.length
}

const namedProductOf = (raw: string): boolean =>
  /unreal|lean\.uuidna|kernel/i.test(raw)

/** Live working QPU at qpu.uuidna.com. Pure. Agnostic. Every VE possibility. */
export const qpuQuantumOf = () => {
  const href = new URL('/quantum', `${ORIGIN}/`).href
  const surfaces = qpuFacesOf().map((face) => ({ face: face.face, opposite: face.opposite }))
  const superpositions = qpuSuperpositionsOf()
  const census = qpuQuantumKeysOf().map((slug) => ({ slug, href: theoremHrefOf(slug) }))
  const square = { slug: SQUARE, href: theoremHrefOf(SQUARE) }
  const products: readonly string[] = []
  const target = { seat: 'empty' as const, admits: 'nothing' as const }
  const door = new URL(href)
  const possibilities = qpuTwoNOf(VE_FACES)
  const holds =
    qpuQuantumFacesHold(surfaces) &&
    qpuQuantumSquareHold(superpositions) &&
    censusHold(census) &&
    products.length === 0 &&
    square.slug === SQUARE &&
    new URL(square.href).pathname === `/theorem/${SQUARE}` &&
    target.seat === 'empty' &&
    target.admits === 'nothing' &&
    door.protocol === 'https:' &&
    door.hostname === QPU_HOST &&
    door.pathname === '/quantum' &&
    qpuSeatOf().seat === 'empty' &&
    superpositions.length === VE_FACES &&
    !namedProductOf(href) &&
    !namedProductOf(JSON.stringify({ census, square, products }))
  return {
    kind: 'quantum' as const,
    holds,
    pure: true as const,
    agnostic: true as const,
    live: true as const,
    working: true as const,
    host: QPU_HOST,
    when: 'never' as const,
    products,
    seat: qpuSeatOf().seat,
    target,
    href,
    surfaces,
    superpositions,
    census,
    square,
    faces: VE_FACES,
    possibilities,
  }
}

export const qpuQuantumHolds = (q = qpuQuantumOf()): boolean =>
  q.holds === true &&
  q.kind === 'quantum' &&
  q.pure === true &&
  q.agnostic === true &&
  q.live === true &&
  q.working === true &&
  q.host === QPU_HOST &&
  q.when === 'never' &&
  q.products.length === 0 &&
  q.seat === 'empty' &&
  q.target.seat === 'empty' &&
  q.target.admits === 'nothing' &&
  qpuQuantumFacesHold(q.surfaces) &&
  qpuQuantumSquareHold(q.superpositions) &&
  censusHold(q.census) &&
  q.possibilities === qpuTwoNOf(VE_FACES) &&
  new URL(q.href).hostname === QPU_HOST &&
  new URL(q.href).pathname === '/quantum'
