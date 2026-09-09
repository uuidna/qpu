// licence — hex climbs issued by license.uuidna.com. Named uuidna.com hosts only. No wildcards.
// Sequence is the uuid messenger: every combo mixes one hex tile of RFC 9562 clock_seq.
// Apply installs the hex tables once; occupancy rebind keeps them. Constructor-issued certificates
// only: a reproduced JSON object is not the certificate. When never.
import { QPU_FUSE_DOMAINS } from './bindings/recognize.js'
import { QPU_VERSION } from './version.js'

export type QpuLicenceEngine = 'qpu' | 'unreal' | 'lean'

export const QPU_LICENCE_APEX = 'uuidna.com'
export const QPU_LICENCE_ISSUER = 'license.uuidna.com'
export const QPU_LICENCE_REPLICA = 'qpu.uuidna.com'

/** Hex nibble width — every architecture addresses hex, brand-agnostic. */
const NIBBLE = 4
/** 16^1 — one hex tile. */
const HEX = 16
/** Hex places licensed for 16^q. Missing place refuses — the table seals, not an IEEE cap. */
const HEX_PLACES = 256

const REFUSED = 'licence: compute refused'
const APPLY = 'licence: apply a certificate'

const issued = new WeakSet<object>()
const rotations = new WeakMap<object, readonly number[]>()

const versionSequenceOf = (): number => {
  const patch = Number(String(QPU_VERSION).split('.')[2] ?? '')
  if (!Number.isInteger(patch) || patch < 0) return 0
  return patch % HEX
}

const bind = {
  host: '',
  engine: 'qpu' as QpuLicenceEngine,
  sequence: versionSequenceOf(),
}

const sequenceTileOf = (n?: number): number => {
  if (n == null) return bind.sequence
  if (!Number.isInteger(n) || n < 0) return -1
  return n % HEX
}

const hostTilesOf = (host: string): number[] => {
  const tiles: number[] = []
  for (let i = 0; i < host.length; i++) tiles.push(host.charCodeAt(i) % HEX)
  return tiles
}

/** Simple rotated combinations: (subject-tile + issuer-tile + sequence) mod 16, then +k mod 16.
 * Sequence is the uuid messenger — impossible not to use. */
const combosOf = (subject: string, issuer: string, sequence = bind.sequence): number[] => {
  const a = hostTilesOf(subject)
  const b = hostTilesOf(issuer)
  const seq = sequenceTileOf(sequence)
  const out: number[] = []
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      const combined = (a[i]! + b[j]! + seq) % HEX
      for (let k = 0; k < HEX; k++) out.push((combined + k) % HEX)
    }
  }
  return out
}

/** Encryption capacity of a named pair — |subject| × |issuer| × 16. Reproduce from the hosts; do not clone a certificate. */
export const qpuLicenceCapacityOf = (subject: string, issuer = QPU_LICENCE_ISSUER): number =>
  hostTilesOf(subject).length * hostTilesOf(issuer).length * HEX

let nibble: readonly number[] | null = null
let hex: readonly number[] | null = null

const installHex = (): void => {
  if (nibble && hex) return
  const nib = [1, 2, 4, 8]
  const places = new Array<number>(HEX_PLACES)
  places[0] = 1
  for (let i = 1; i < HEX_PLACES; i++) places[i] = places[i - 1]! * HEX
  nibble = Object.freeze(nib)
  hex = Object.freeze(places)
}

/** Sealed bind. Writes refuse. Occupancy applies a certificate; it does not assign fields. */
export const QPU_LICENCE: { readonly host: string; readonly engine: QpuLicenceEngine } = Object.seal({
  get host(): string {
    return bind.host
  },
  set host(_v: string) {
    throw new Error(APPLY)
  },
  get engine(): QpuLicenceEngine {
    return bind.engine
  },
  set engine(_v: QpuLicenceEngine) {
    throw new Error(APPLY)
  },
})

/** Live licensed host. Constructors close over this getter, never a snapshot. */
export const qpuLicenceHostOf = (): string => bind.host

/** Named uuidna.com host on the live SAN. Wildcards and foreign hosts refuse. */
export const qpuLicenceAllowsHostOf = (host: string): boolean => {
  const h = host.trim().toLowerCase()
  if (!namedHostOf(h)) return false
  return qpuLicenceOf().san.includes(h)
}

const namedHostOf = (host: string): boolean => {
  const h = host.trim().toLowerCase()
  if (!h || h.includes('*') || h.includes('/') || h.includes(':') || h.includes(' ')) return false
  if (!h.includes('.') || h.startsWith('.') || h.endsWith('.')) return false
  return h === QPU_LICENCE_APEX || h.endsWith(`.${QPU_LICENCE_APEX}`)
}

const sanOf = (subject: string): string[] => {
  const out: string[] = []
  for (const h of [subject, QPU_LICENCE_ISSUER, QPU_LICENCE_REPLICA, QPU_LICENCE_APEX, ...QPU_FUSE_DOMAINS]) {
    const n = h.trim().toLowerCase()
    if (!namedHostOf(n) || out.includes(n)) continue
    out.push(n)
  }
  return out
}

export const qpuLicenceCertificateOf = (spec?: { subject?: string; engine?: QpuLicenceEngine; sequence?: number }) => {
  const subject = (spec?.subject ?? qpuLicenceHostOf()).trim().toLowerCase()
  const engine = spec?.engine ?? bind.engine
  const sequence = sequenceTileOf(spec?.sequence)
  const san = Object.freeze(sanOf(subject))
  const href = `https://${QPU_LICENCE_ISSUER}/licence`
  const door = new URL(href)
  const holds =
    namedHostOf(subject) &&
    namedHostOf(QPU_LICENCE_ISSUER) &&
    QPU_LICENCE_ISSUER.endsWith(`.${QPU_LICENCE_APEX}`) &&
    san.includes(subject) &&
    san.includes(QPU_LICENCE_ISSUER) &&
    san.every((h) => namedHostOf(h) && !h.includes('*')) &&
    (engine === 'qpu' || engine === 'unreal' || engine === 'lean') &&
    Number.isInteger(sequence) &&
    sequence >= 0 &&
    sequence < HEX &&
    door.protocol === 'https:' &&
    door.hostname === QPU_LICENCE_ISSUER &&
    door.pathname === '/licence'
  const combos = Object.freeze(combosOf(subject, QPU_LICENCE_ISSUER, sequence))
  const cert = Object.freeze({
    kind: 'licence' as const,
    holds,
    offline: true as const,
    when: 'never' as const,
    expires: 'never' as const,
    protocol: 'https' as const,
    issuer: QPU_LICENCE_ISSUER,
    subject,
    engine,
    sequence,
    messenger: 'uuid' as const,
    san,
    wildcards: false as const,
    href,
    hex: true as const,
    nibble: NIBBLE,
    rotate: true as const,
    combine: 'sum' as const,
    capacity: combos.length,
  })
  issued.add(cert)
  rotations.set(cert, combos)
  return cert
}

export type QpuLicenceCertificate = ReturnType<typeof qpuLicenceCertificateOf>

export const qpuLicenceOf = (): QpuLicenceCertificate =>
  qpuLicenceCertificateOf({ subject: bind.host, engine: bind.engine, sequence: bind.sequence })

export const qpuLicenceHolds = (c = qpuLicenceOf()): boolean => {
  const live = rotations.get(c)
  if (!issued.has(c) || !live) return false
  const expect = combosOf(c.subject, c.issuer, c.sequence)
  if (live.length !== expect.length || live.length !== c.capacity) return false
  for (let i = 0; i < live.length; i++) if (live[i] !== expect[i]) return false
  return (
    c.holds === true &&
    c.kind === 'licence' &&
    c.offline === true &&
    c.when === 'never' &&
    c.expires === 'never' &&
    c.protocol === 'https' &&
    c.wildcards === false &&
    c.hex === true &&
    c.nibble === NIBBLE &&
    c.rotate === true &&
    c.combine === 'sum' &&
    c.messenger === 'uuid' &&
    Number.isInteger(c.sequence) &&
    c.sequence >= 0 &&
    c.sequence < HEX &&
    namedHostOf(c.subject) &&
    c.issuer === QPU_LICENCE_ISSUER &&
    c.san.includes(c.subject) &&
    c.san.includes(QPU_LICENCE_ISSUER) &&
    c.san.every((h) => namedHostOf(h)) &&
    new URL(c.href).hostname === QPU_LICENCE_ISSUER &&
    new URL(c.href).pathname === '/licence'
  )
}

/** Apply an offline certificate issued by license.uuidna.com. Direct writes refuse. Clones refuse. Hex tables install once. */
export const qpuLicenceApplyOf = (cert: QpuLicenceCertificate): QpuLicenceCertificate => {
  if (!qpuLicenceHolds(cert)) throw new Error('licence: offline certificate refused')
  bind.host = cert.subject
  bind.engine = cert.engine
  bind.sequence = cert.sequence
  installHex()
  return qpuLicenceOf()
}

/** 2^n = 16^q × 2^r with n = 4q + r. Licensed hex tables, never Math.pow, never a bit loop. */
export function qpuTwoNOf(n: number): number {
  if (!hex || !nibble) throw new Error(REFUSED)
  if (!Number.isInteger(n) || n < 0) throw new Error('qpuTwoNOf: n is not a whole count')
  const r = n % NIBBLE
  const q = (n - r) / NIBBLE
  const place = hex[q]
  const bit = nibble[r]
  if (place == null || bit == null) throw new Error(REFUSED)
  return place * bit
}

/** Split a whole integer into little-endian bits via hex tiles, then each nibble. */
export function qpuBitDigitsOf(n: number): number[] {
  if (!hex || !nibble) throw new Error(REFUSED)
  if (!Number.isSafeInteger(n) || n < 0) throw new Error('qpuBitDigitsOf: n is not a whole integer')
  if (n === 0) return [0]
  const bits: number[] = []
  for (const tile of qpuHexbitDigitsOf(n)) {
    let x = tile
    for (let i = 0; i < NIBBLE; i++) {
      const b = x % 2
      bits.push(b)
      x = (x - b) / 2
    }
  }
  while (bits.length > 1 && bits[bits.length - 1] === 0) bits.pop()
  return bits
}

/** Recompose little-endian bits from licensed hex 2^i places. */
export function qpuIntegerOfBits(bits: readonly number[]): number {
  let n = 0
  for (let i = 0; i < bits.length; i++) {
    const b = bits[i]!
    if (b !== 0 && b !== 1) throw new Error(`qpuIntegerOfBits: bit ${b} is not 0 or 1`)
    if (b === 1) n += qpuTwoNOf(i)
  }
  if (!Number.isSafeInteger(n)) throw new Error('qpuIntegerOfBits: left the safe mantissa')
  return n
}

/** Split a whole integer into little-endian hexbit tiles — remainder 16, never 10³. */
export function qpuHexbitDigitsOf(n: number): number[] {
  if (!hex || !nibble) throw new Error(REFUSED)
  if (!Number.isSafeInteger(n) || n < 0) throw new Error('qpuHexbitDigitsOf: n is not a whole integer')
  if (n === 0) return [0]
  const tiles: number[] = []
  let x = n
  while (x > 0) {
    const t = x % HEX
    tiles.push(t)
    x = (x - t) / HEX
  }
  return tiles
}

/** Recompose little-endian hexbit tiles from licensed 16^i = 2^{4i} places. */
export function qpuIntegerOfHexbits(tiles: readonly number[]): number {
  let n = 0
  for (let i = 0; i < tiles.length; i++) {
    const t = tiles[i]!
    if (!Number.isInteger(t) || t < 0 || t >= HEX)
      throw new Error(`qpuIntegerOfHexbits: tile ${t} is outside 0..${HEX - 1}`)
    n += t * qpuTwoNOf(i * NIBBLE)
  }
  if (!Number.isSafeInteger(n)) throw new Error('qpuIntegerOfHexbits: left the safe mantissa')
  return n
}

qpuLicenceApplyOf(qpuLicenceCertificateOf({ subject: QPU_LICENCE_REPLICA, engine: 'qpu' }))
