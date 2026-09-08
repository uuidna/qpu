// hologram — THE OCTET READ AS QPU: named planes, one sequence, fourteen faces.
// The whole quantum computer is the QPU itself.
// Desk wiring. Numbers and addresses. The hardware QPU lane stays empty; this module does not dispatch a device.
import { QPU_VERSION } from './version.js'
import { QPU_LICENCE, qpuLicenceHostOf, qpuTwoNOf, qpuBitDigitsOf, qpuIntegerOfBits, qpuHexbitDigitsOf, qpuIntegerOfHexbits } from './licence.js'
export {
  QPU_LICENCE, qpuLicenceHostOf,
  qpuTwoNOf, qpuBitDigitsOf, qpuIntegerOfBits, qpuHexbitDigitsOf, qpuIntegerOfHexbits,
} from './licence.js'

/** Trinity — debit width. */
export const TRINITY = 3
/** Captain coins. */
export const COINS = 2
/** Hexbit tile width. */
export const HEXBIT_BITS = 4
/** Vortex base. */
export const BASE = TRINITY ** 2

/** 2^HEXBIT_BITS states — licensed hex climb 16^1, never Math.pow. */
export const HEXBIT_STATES: number = qpuTwoNOf(HEXBIT_BITS)

/** One uuid in hexbit tiles — states × coins. */
export const UUID_HEXBITS = HEXBIT_STATES * COINS
/** Handle width in hexbit tiles. */
export const HANDLE_HEXBITS = UUID_HEXBITS / HEXBIT_BITS
/** Handle width in bits — every bit is a usable mask. Same count as UUID_HEXBITS. */
export const HANDLE_BITS = HANDLE_HEXBITS * HEXBIT_BITS
/** VE faces: handle tiles plus hexbit plus coins. Fourteen neighbours are capacity gateways. */
export const VE_FACES = HANDLE_HEXBITS + HEXBIT_BITS + COINS
/** Seven rays — fold plane. Two coins of them are the VE. */
export const RAYS = BASE - COINS
/** Six doors — credit plane, referer modulus. Inner combo is doors × rays. */
export const QPU_DOORS = HEXBIT_BITS + COINS
/** shadcn variant doors — one per referer door. */
export const QPU_SHADCN_DOORS = ['default', 'secondary', 'muted', 'accent', 'destructive', 'outline'] as const
/** shadcn radius rungs — one per ray. Ray 0 fuses at foundation. */
export const QPU_SHADCN_RAYS = ['fuse', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const
/** One tetrahedron of the merkaba — four vertices. */
export const TETRA = HEXBIT_BITS
/** Merkaba vertices — two tetrahedra. */
export const MERKABA_VERTICES = TETRA * COINS
/** Address width in bits — uuid hexbits × hexbit. Grover floor of the identifier. */
export const ADDRESS_BITS = UUID_HEXBITS * HEXBIT_BITS

export type QpuVersionInteger = {
  version: string
  mask: number
  sequence: number
  rosettas: number[]
  hexbits: number[]
  bits: number[]
  code: number
}

const padHexbits = (tiles: readonly number[], width: number): number[] => {
  const out = tiles.slice()
  while (out.length < width) out.push(0)
  if (out.length > width) throw new Error('qpuVersionIntegerOf: hexbits overflow the version integer')
  return out
}

/** The captain command — two wildcard fields, never a glued `**`. Occupying it is not minting 1.0.0. */
export const QPU_VERSION_COMMAND = 'v1.*.*'
/** The reminder restates the command. Same family. */
export const QPU_VERSION_REMINDER = 'v1.*.* is the mask'

export function qpuVersionMaskOf(text: string): number {
  const raw = String(text)
  if (raw.includes('**')) throw new Error('qpuVersionMaskOf: glued wildcards — the mask is vN.*.*')
  const found = /v(\d+)\.\*\.\*/.exec(raw)
  if (!found) throw new Error(`qpuVersionMaskOf: no vN.*.* mask in ${raw}`)
  const n = Number(found[1])
  if (!Number.isInteger(n) || n < 1) throw new Error(`qpuVersionMaskOf: mask ${n} is not a family`)
  if (!raw.includes(`v${n}.*.*`)) throw new Error(`qpuVersionMaskOf: ${raw} does not carry v${n}.*.*`)
  return n
}

export const QPU_VERSION_MASK: number = qpuVersionMaskOf(QPU_VERSION_COMMAND)

/** npm string as a hexbit integer: last digit Sequence, middle two tiles the rotors, first the v1 mask. */
export function qpuVersionIntegerOf(version: string): QpuVersionInteger {
  const parts = String(version).split('.').map((p) => Number(p))
  const mask = parts[0], middle = parts[1], sequence = parts[2]
  if (
    parts.length !== 3 ||
    !Number.isInteger(mask) || !Number.isInteger(middle) || !Number.isInteger(sequence) ||
    mask < 0 || middle < 0 || sequence < 0 || sequence > BASE
  )
    throw new Error(`qpuVersionIntegerOf: expected mask.rosettas.sequence, got ${version}`)
  if (mask !== 0 && mask !== QPU_VERSION_MASK)
    throw new Error(`qpuVersionIntegerOf: mask is 0 or ${QPU_VERSION_COMMAND}, got ${version}`)
  const rosettas = padHexbits(qpuHexbitDigitsOf(middle), COINS)
  if (mask === QPU_VERSION_MASK) {
    for (const r of rosettas) {
      if (r >= RAYS) throw new Error(`qpuVersionIntegerOf: rosetta ${r} is outside ℤ/${RAYS}`)
    }
  }
  const hexbits = padHexbits([sequence, ...rosettas, mask], HANDLE_HEXBITS)
  const code = qpuIntegerOfHexbits(hexbits)
  const bits = qpuBitDigitsOf(code)
  if (qpuIntegerOfBits(bits) !== code) throw new Error('qpuVersionIntegerOf: bit round-trip failed')
  return { version: `${mask}.${middle}.${sequence}`, mask, sequence, rosettas, hexbits, bits, code }
}

export const qpuVersionMaskHolds = (): boolean => {
  const fromCommand = qpuVersionMaskOf(QPU_VERSION_COMMAND)
  const fromReminder = qpuVersionMaskOf(QPU_VERSION_REMINDER)
  if (fromCommand !== fromReminder || fromCommand !== QPU_VERSION_MASK) return false
  if (QPU_VERSION_COMMAND !== `v${QPU_VERSION_MASK}.*.*`) return false
  if (!QPU_VERSION_REMINDER.includes(QPU_VERSION_COMMAND)) return false
  if (QPU_VERSION_COMMAND.includes('**')) return false
  const packed = qpuVersionIntegerOf(`${QPU_VERSION_MASK}.0.0`)
  return packed.mask === QPU_VERSION_MASK && packed.hexbits.length === HANDLE_HEXBITS && packed.hexbits[1 + COINS] === QPU_VERSION_MASK
}

/** Seat empty, published string still v0, mask family is the command — not a stamped 1.0.0. */
export const qpuCaptainOrdersHolds = (pkgVersion = QPU_VERSION): boolean => {
  if (!qpuVersionMaskHolds()) return false
  if (qpuSeatOf().seat !== 'empty') return false
  const major = Number(String(pkgVersion).split('.')[0])
  if (major !== 0) return false
  return qpuVersionIntegerOf(pkgVersion).mask === 0
}

/** Prefix mask of `bits` on the handle. Every bit 0..HANDLE_BITS is usable. Licensed 2^n, never Math.pow. */
export const qpuHandleMaskOf = (bits: number): number => {
  if (!Number.isInteger(bits) || bits < 0 || bits > HANDLE_BITS)
    throw new Error('qpuHandleMaskOf: bit is outside the handle')
  if (bits === 0) return 0
  if (bits === HANDLE_BITS) return qpuTwoNOf(HANDLE_BITS) - 1
  return qpuTwoNOf(HANDLE_BITS) - qpuTwoNOf(HANDLE_BITS - bits)
}

export const qpuHandleMaskHolds = (): boolean => {
  if (HANDLE_BITS !== HANDLE_HEXBITS * HEXBIT_BITS) return false
  if (HANDLE_BITS !== UUID_HEXBITS) return false
  for (let b = 0; b <= HANDLE_BITS; b++) {
    const m = qpuHandleMaskOf(b)
    if (b === 0 && m !== 0) return false
    if (b === HANDLE_BITS && m !== qpuTwoNOf(HANDLE_BITS) - 1) return false
    if (b > 0 && b < HANDLE_BITS && m !== qpuTwoNOf(HANDLE_BITS) - qpuTwoNOf(HANDLE_BITS - b)) return false
  }
  try {
    qpuHandleMaskOf(-1)
    return false
  } catch { /* refused */ }
  try {
    qpuHandleMaskOf(HANDLE_BITS + 1)
    return false
  } catch { /* refused */ }
  return true
}

/** seal_ten — void · orbit · axis. */
export const SEAL_TEN = [0, 1, 2, 4, 8, 7, 5, 3, 6, 9] as const

/** Digital root in ℤ/9 (1..9; multiples of 9 map to 9). */
export function digitalRoot(n: number): number {
  const r = ((n % 9) + 9) % 9
  return r === 0 ? 9 : r
}

/** Mirror through the void — 1−n mod 9; void root 0 is fixed. */
export function throughVoid(d: number): number {
  return d === 0 ? 0 : digitalRoot(1 - d)
}

/** Replica identity of @uuidna/qpu. Occupancy exports its own QPU_HOST. */
export const QPU_HOST = 'qpu.uuidna.com'

/** Captain-coins deposit — same wallet as uuidna. */
export const DONATE_URL = 'https://revolut.me/ceccec'

/** Captain-coins deposit URL: https://revolut.me/ceccec?note=${encodeURIComponent(referrer)} */
export function donateUrl(referrer: string): string {
  const raw = referrer.trim()
  if (!raw) throw new Error('donateUrl: referrer is empty')
  return `${DONATE_URL}?note=${encodeURIComponent(raw)}`
}

/** BindingPoint pentagram — CPU, GPU, RAM, CACHE, STORAGE. */
export const QPU_POINTS = ['CPU', 'GPU', 'RAM', 'CACHE', 'STORAGE'] as const

/** Star vertices in the 120×120 icon viewBox — hero and Open Graph share this. */
export const QPU_STAR_PTS = [
  [60, 8],
  [111, 45],
  [91, 108],
  [29, 108],
  [9, 45],
] as const

/** {5/2} stroke: step coins around the pentagram. */
export const qpuStarStrokeOf = (): number[] => {
  const n = QPU_POINTS.length
  const out: number[] = []
  let p = 0
  for (let i = 0; i < n; i++) {
    out.push(p)
    p = (p + COINS) % n
  }
  return out
}

export type QpuSpin = 1 | -1

/** One 7-ray rosette. Spin +1 clockwise, −1 counterclockwise. Both fuse at residue 0. */
export const qpuRosetteOf = (spin: QpuSpin) => {
  const rays: number[] = []
  for (let i = 0; i < RAYS; i++) rays.push(spin === 1 ? i : (RAYS - i) % RAYS)
  return { spin, rays, fuse: rays[0]!, count: RAYS }
}

export interface QpuCombo {
  door: number
  ray: number
  variant: (typeof QPU_SHADCN_DOORS)[number]
  rung: (typeof QPU_SHADCN_RAYS)[number]
  spin: QpuSpin
}

/** Inner 6×7 (door × clockwise ray). Outer 7×6 (counterclockwise ray × door). Same 42 pairs, opposite order. */
export const qpuCombinationsOf = () => {
  const cw = qpuRosetteOf(1).rays
  const ccw = qpuRosetteOf(-1).rays
  const inner: QpuCombo[] = []
  for (let door = 0; door < QPU_DOORS; door++) {
    for (const ray of cw) {
      inner.push({
        door,
        ray,
        variant: QPU_SHADCN_DOORS[door]!,
        rung: QPU_SHADCN_RAYS[ray]!,
        spin: 1,
      })
    }
  }
  const outer: QpuCombo[] = []
  for (const ray of ccw) {
    for (let door = 0; door < QPU_DOORS; door++) {
      outer.push({
        door,
        ray,
        variant: QPU_SHADCN_DOORS[door]!,
        rung: QPU_SHADCN_RAYS[ray]!,
        spin: -1,
      })
    }
  }
  const keyOf = (c: QpuCombo): string => `${c.door}:${c.ray}`
  const innerKeys = new Set(inner.map(keyOf))
  const outerKeys = new Set(outer.map(keyOf))
  let involution = innerKeys.size === inner.length && outerKeys.size === outer.length
  for (const k of innerKeys) if (!outerKeys.has(k)) involution = false
  const holds =
    inner.length === QPU_DOORS * RAYS &&
    outer.length === RAYS * QPU_DOORS &&
    inner.length === outer.length &&
    involution &&
    cw[0] === 0 &&
    ccw[0] === 0 &&
    QPU_SHADCN_DOORS.length === QPU_DOORS &&
    QPU_SHADCN_RAYS.length === RAYS
  return {
    doors: QPU_DOORS,
    rays: RAYS,
    inner: { rows: QPU_DOORS, cols: RAYS, combos: inner, count: inner.length },
    outer: { rows: RAYS, cols: QPU_DOORS, combos: outer, count: outer.length },
    fuse: 0 as const,
    involution,
    holds,
  }
}

export const qpuCombinationsHolds = (c = qpuCombinationsOf()): boolean =>
  c.holds === true &&
  c.doors === HEXBIT_BITS + COINS &&
  c.rays === RAYS &&
  c.inner.rows * c.inner.cols === c.inner.count &&
  c.outer.rows * c.outer.cols === c.outer.count &&
  c.inner.count === c.outer.count &&
  c.fuse === 0 &&
  c.involution === true

export interface QpuMorphCell extends QpuCombo {
  x: number
  y: number
}

/** Video morph: each combo lerps from the 6×7 inner grid to the 7×6 outer grid. t=0 inner, t=1 outer, t=½ fuse. Analog stays in [0,1]. */
export const qpuMorphOf = (t: number) => {
  const u = t < 0 ? 0 : t > 1 ? 1 : t
  const combos = qpuCombinationsOf()
  const cw = qpuRosetteOf(1).rays
  const ccw = qpuRosetteOf(-1).rays
  const cells: QpuMorphCell[] = combos.inner.combos.map((c) => {
    const ic = cw.indexOf(c.ray)
    const oc = ccw.indexOf(c.ray)
    const ix = (ic + 1) / (RAYS + 1)
    const iy = (c.door + 1) / (QPU_DOORS + 1)
    const ox = (c.door + 1) / (QPU_DOORS + 1)
    const oy = (oc + 1) / (RAYS + 1)
    return {
      ...c,
      x: ix + (ox - ix) * u,
      y: iy + (oy - iy) * u,
    }
  })
  return {
    t: u,
    fuse: 0 as const,
    cells,
    inner: combos.inner,
    outer: combos.outer,
    holds: combos.holds && cells.length === QPU_DOORS * RAYS && u >= 0 && u <= 1,
  }
}

export const qpuMorphHolds = (m = qpuMorphOf(0)): boolean =>
  m.holds === true &&
  m.cells.length === QPU_DOORS * RAYS &&
  m.fuse === 0

/** Two tetrahedra, two counter-rotating 7-ray rosettes, fuse at foundation 0. */
export const qpuMerkabaOf = () => ({
  rotors: COINS,
  rays: RAYS,
  doors: QPU_DOORS,
  tetra: TETRA,
  vertices: MERKABA_VERTICES,
  faces: VE_FACES,
  clockwise: qpuRosetteOf(1),
  counterclockwise: qpuRosetteOf(-1),
  inner: qpuRosetteOf(1),
  outer: qpuRosetteOf(-1),
  tetrahedra: qpuTetrahedraOf(),
  combinations: qpuCombinationsOf(),
  fuse: 0 as const,
})

/** CPU and GPU are the two rotors. Width is BindingPoint min. Hardware QPU is not a third compute chip. */
export const qpuBalanceOf = () => ({
  cpu: QPU_POINTS[0],
  gpu: QPU_POINTS[1],
  binds: 'cpu' as const,
  rotors: COINS,
  hardware: qpuSeatOf(),
})

const parityOf = (n: number): number => (n % 2 + ((n / 2) | 0) % 2 + ((n / 4) | 0) % 2) % 2

/** Even-parity tetrahedron (inner) and odd-parity dual (outer) on the eight merkaba vertices. */
export const qpuTetrahedraOf = () => {
  const codes: number[] = []
  for (let n = 0; n < MERKABA_VERTICES; n++) codes.push(n)
  return {
    inner: codes.filter((n) => parityOf(n) === 0),
    outer: codes.filter((n) => parityOf(n) === 1),
  }
}

/** Doubling vortex (inner) and its reverse (outer) — coins × trinity steps of ×coins through the void. */
export const qpuVortexOf = () => {
  const inner: number[] = []
  let x = 1
  for (let i = 0; i < COINS * TRINITY; i++) {
    inner.push(x)
    x = digitalRoot(x * COINS)
  }
  const outer = inner.slice().reverse()
  return { inner, outer }
}

/** Inner and outer experience of the chip: two rotors, two tetrahedra, two vortex walks, two glows. Involution through 0. Occupancy shares this reading; it does not wrap a second constructor. */
export const qpuExperienceOf = () => {
  const innerRosette = qpuRosetteOf(1)
  const outerRosette = qpuRosetteOf(-1)
  const tet = qpuTetrahedraOf()
  const vortex = qpuVortexOf()
  const combinations = qpuCombinationsOf()
  const glowInner = HANDLE_HEXBITS * TRINITY
  const glowOuter = ADDRESS_BITS / COINS
  let involution = innerRosette.fuse === 0 && outerRosette.fuse === 0
  for (let i = 0; i < RAYS; i++) {
    const r = innerRosette.rays[i]!
    const once = (RAYS - r) % RAYS
    const twice = (RAYS - once) % RAYS
    if (twice !== r || outerRosette.rays[i] !== once) involution = false
  }
  const seat = qpuSeatOf()
  const holds =
    involution &&
    innerRosette.fuse === 0 &&
    outerRosette.fuse === 0 &&
    tet.inner.length === TETRA &&
    tet.outer.length === TETRA &&
    glowInner === HANDLE_HEXBITS * TRINITY &&
    glowOuter === ADDRESS_BITS / COINS &&
    glowOuter === HANDLE_HEXBITS * HANDLE_HEXBITS &&
    vortex.inner.length === COINS * TRINITY &&
    vortex.outer.join() === vortex.inner.slice().reverse().join() &&
    combinations.holds &&
    seat.seat === 'empty'
  return {
    kind: 'experience' as const,
    holds,
    when: 'never' as const,
    seat,
    inner: {
      name: 'inner' as const,
      rotor: QPU_POINTS[0],
      spin: 1 as const,
      rosette: innerRosette,
      tetra: tet.inner,
      vortex: vortex.inner,
      glow: glowInner,
      spread: HEXBIT_BITS,
      combinations: combinations.inner,
    },
    outer: {
      name: 'outer' as const,
      rotor: QPU_POINTS[1],
      spin: -1 as const,
      rosette: outerRosette,
      tetra: tet.outer,
      vortex: vortex.outer,
      glow: glowOuter,
      spread: HEXBIT_BITS * TRINITY,
      combinations: combinations.outer,
    },
    fuse: 0 as const,
    involution,
  }
}

export const qpuExperienceHolds = (e = qpuExperienceOf()): boolean =>
  e.kind === 'experience' &&
  e.holds === true &&
  e.when === 'never' &&
  e.seat.seat === 'empty' &&
  e.involution === true &&
  e.inner.rotor === 'CPU' &&
  e.outer.rotor === 'GPU' &&
  e.inner.tetra.length === TETRA &&
  e.outer.tetra.length === TETRA &&
  e.inner.glow === HANDLE_HEXBITS * TRINITY &&
  e.outer.glow === ADDRESS_BITS / COINS &&
  e.outer.glow === HANDLE_HEXBITS * HANDLE_HEXBITS &&
  e.inner.vortex.length === COINS * TRINITY &&
  e.outer.vortex.join() === e.inner.vortex.slice().reverse().join() &&
  e.inner.combinations.count === QPU_DOORS * RAYS &&
  e.outer.combinations.count === RAYS * QPU_DOORS &&
  e.inner.combinations.count === e.outer.combinations.count

/** Bill of constructors — every serial replica must match this revision. */
export const qpuRevisionOf = () => ({
  trinity: TRINITY,
  coins: COINS,
  hexbit: HEXBIT_BITS,
  base: BASE,
  rays: RAYS,
  doors: QPU_DOORS,
  tetra: TETRA,
  handle: HANDLE_HEXBITS,
  ve: VE_FACES,
  address: ADDRESS_BITS,
  glowInner: HANDLE_HEXBITS * TRINITY,
  glowOuter: ADDRESS_BITS / COINS,
})

export const qpuSeatOf = () => ({
  name: 'QPU' as const,
  seat: 'empty' as const,
  admits: 'nothing',
})

/** This worker's novelty chip — merkaba fusion. Hardware lane stays empty. */
export const qpuChipOf = () => {
  const merkaba = qpuMerkabaOf()
  const balance = qpuBalanceOf()
  const experience = qpuExperienceOf()
  const holds =
    RAYS * COINS === VE_FACES &&
    TETRA * COINS === MERKABA_VERTICES &&
    MERKABA_VERTICES === HANDLE_HEXBITS &&
    RAYS === BASE - COINS &&
    merkaba.doors === HEXBIT_BITS + COINS &&
    merkaba.clockwise.fuse === 0 &&
    merkaba.counterclockwise.fuse === 0 &&
    merkaba.clockwise.rays.join() === '0,1,2,3,4,5,6' &&
    merkaba.counterclockwise.rays.join() === '0,6,5,4,3,2,1' &&
    qpuCombinationsHolds(merkaba.combinations) &&
    qpuMorphHolds(qpuMorphOf(0)) &&
    qpuMorphHolds(qpuMorphOf(0.5)) &&
    qpuFuseHolds() &&
    balance.cpu === 'CPU' &&
    balance.gpu === 'GPU' &&
    qpuExperienceHolds()
  return {
    name: 'QPU' as const,
    novelty: 'merkaba' as const,
    claimed: true as const,
    holds,
    merkaba,
    balance,
    experience,
    dimensions: qpuHologramOf(),
    hardware: qpuSeatOf(),
  }
}

export const qpuChipHolds = (): boolean => qpuChipOf().holds

export const qpuWidthOf = () => ({
  points: [...QPU_POINTS],
  pentagram: QPU_POINTS.length,
  binds: 'cpu',
})

/** Fasten slow processes to the BindingPoint. Width is never below one; concurrency 0 overstates. */
export const qpuFastenOf = () => {
  const width = qpuWidthOf()
  const balance = qpuBalanceOf()
  const lanes = 1
  const holds =
    width.binds === 'cpu' &&
    balance.binds === 'cpu' &&
    lanes === 1 &&
    qpuSeatOf().seat === 'empty'
  return {
    kind: 'fasten' as const,
    holds,
    binds: width.binds,
    point: QPU_POINTS[0]!,
    lanes,
    concurrency: lanes,
    isolation: 'none' as const,
    rounds: lanes,
  }
}

export const qpuFastenHolds = (f = qpuFastenOf()): boolean =>
  f.holds === true &&
  f.kind === 'fasten' &&
  f.concurrency >= 1 &&
  f.isolation === 'none' &&
  f.rounds === f.lanes

export const qpuHologramOf = () => ({
    foundation: 0,
    debit: TRINITY,
    credit: HEXBIT_BITS + COINS,
    pentagram: QPU_POINTS.length,
    fold: BASE - COINS,
    octet: HANDLE_HEXBITS,
    veFaces: VE_FACES,
    seal: [...SEAL_TEN],
})

/** Recursion fuse: every hologram dimension occupies payload.find at once. Morph inner/outer involute at residue 0. */
export const qpuFuseOf = () => {
  const hologram = qpuHologramOf()
  const combinations = qpuCombinationsOf()
  const morph = qpuMorphOf(0.5)
  const rungs = [
    { name: 'foundation' as const, n: hologram.foundation, span: qpuTwoNOf(0) },
    { name: 'trinity' as const, n: hologram.debit, span: qpuTwoNOf(TRINITY) },
    { name: 'doors' as const, n: hologram.credit, span: qpuTwoNOf(hologram.credit) },
    { name: 'pentagram' as const, n: hologram.pentagram, span: qpuTwoNOf(QPU_POINTS.length) },
    { name: 'fold' as const, n: hologram.fold, span: qpuTwoNOf(RAYS) },
    { name: 'octet' as const, n: hologram.octet, span: qpuTwoNOf(HANDLE_HEXBITS) },
    { name: 'faces' as const, n: hologram.veFaces, span: qpuTwoNOf(VE_FACES) },
    { name: 'hexbit' as const, n: HEXBIT_BITS, span: qpuTwoNOf(HEXBIT_BITS) },
    { name: 'tetra' as const, n: TETRA, span: qpuTwoNOf(TETRA) },
    { name: 'handle' as const, n: HANDLE_BITS, span: qpuTwoNOf(HANDLE_BITS) },
  ]
  const holds =
    qpuCombinationsHolds(combinations) &&
    qpuMorphHolds(morph) &&
    morph.t === 0.5 &&
    combinations.involution === true &&
    combinations.fuse === 0 &&
    morph.fuse === 0 &&
    rungs.every((r) => r.span === qpuTwoNOf(r.n)) &&
    rungs.length === 10 &&
    hologram.veFaces === VE_FACES
  return {
    kind: 'fuse' as const,
    at: 'once' as const,
    recursive: true as const,
    fetches: 0 as const,
    crawl: false as const,
    t: 0.5 as const,
    morph,
    combinations,
    hologram,
    rungs,
    holds,
  }
}

export const qpuFuseHolds = (f = qpuFuseOf()): boolean =>
  f.holds === true &&
  f.kind === 'fuse' &&
  f.at === 'once' &&
  f.recursive === true &&
  f.fetches === 0 &&
  f.crawl === false &&
  f.t === 0.5 &&
  f.rungs.length === 10 &&
  f.rungs.every((r) => r.span === qpuTwoNOf(r.n)) &&
  qpuMorphHolds(f.morph) &&
  qpuCombinationsHolds(f.combinations)

/** Opposite VE faces are throughVoid of each other — counted, not dispatched. */
export const qpuFacesOf = (): readonly { face: number; opposite: number }[] =>
  Array.from({ length: VE_FACES }, (_, i) => ({ face: i, opposite: throughVoid(i % BASE) }))

/** Fourteen VE-face neighbours — each is a capacity gateway over every handle-bit mask. */
export const qpuGatewaysOf = () => {
  const bits = HANDLE_BITS
  const masks = bits + 1
  const capacity = qpuTwoNOf(bits)
  return qpuFacesOf().map(({ face, opposite }) => ({
    kind: 'gateway' as const,
    face,
    neighbour: opposite,
    bits,
    masks,
    capacity,
  }))
}

export const qpuGatewaysHolds = (rows = qpuGatewaysOf()): boolean => {
  if (rows.length !== VE_FACES) return false
  if (!qpuHandleMaskHolds()) return false
  const capacity = qpuTwoNOf(HANDLE_BITS)
  const faces = qpuFacesOf()
  return rows.every((g, i) =>
    g.kind === 'gateway' &&
    g.face === i &&
    g.neighbour === faces[i]!.opposite &&
    g.bits === HANDLE_BITS &&
    g.masks === HANDLE_BITS + 1 &&
    g.capacity === capacity
  )
}

/** Perspective angles of one superposition — polarity_angles, angles_close, law_of_reflection. Not a 14×14 grid. */
export interface QpuAngles {
  hue: number
  dash: number
  slot: number
  reflection: number
}

/** One VE face. The referer (hex tile) picks the door; angles are the perspective, not k-reflections. */
export interface QpuSuperposition {
  face: number
  opposite: number
  referer: number
  door: number
  angles: QpuAngles
}

/** 360/9, 360/6, 360/10, 180 — Colour.lean polarity_angles, Sequence.lean angles_close, Optics.lean reflection. */
export const QPU_ANGLES: QpuAngles = {
  hue: 360 / BASE,
  dash: 360 / 6,
  slot: 360 / 10,
  reflection: 180,
}

/**
 * One superposition per VE face. The referer is the face as a hex tile (door_of_the_referrer: t mod 6).
 * 14×14=196 is photography's rounded f/1.4, not occupancy. Sequence amplitudes are 2^n (qpuTwoNOf(VE_FACES)).
 */
export const qpuSuperpositionsOf = (): QpuSuperposition[] =>
  qpuFacesOf().map(({ face, opposite }) => {
    const referer = face % HEXBIT_STATES
    return { face, opposite, referer, door: referer % QPU_DOORS, angles: QPU_ANGLES }
  })

/** Hue step: a full turn over the vortex base — 360 / 9 = 40. */
export const QPU_HUE_STEP = 360 / BASE

/** CSS custom properties — the hologram planes. VitePress tokens bind to these (singularity). */
export const qpuTokensOf = (): Record<string, string> => {
  const h = qpuHologramOf()
  return {
    '--qpu-foundation': String(h.foundation),
    '--qpu-debit': String(h.debit),
    '--qpu-credit': String(h.credit),
    '--qpu-pentagram': String(h.pentagram),
    '--qpu-fold': String(h.fold),
    '--qpu-octet': String(h.octet),
    '--qpu-ve': String(h.veFaces),
    '--qpu-gateways': String(VE_FACES),
    '--qpu-handle-bits': String(HANDLE_BITS),
    '--qpu-base': String(BASE),
    '--qpu-trinity': String(TRINITY),
    '--qpu-coins': String(COINS),
    '--qpu-hexbit': String(HEXBIT_BITS),
    '--qpu-rays': String(RAYS),
    '--qpu-doors': String(QPU_DOORS),
    '--qpu-combo-inner': String(QPU_DOORS * RAYS),
    '--qpu-combo-outer': String(RAYS * QPU_DOORS),
    '--qpu-rotors': String(COINS),
    '--qpu-merkaba': String(MERKABA_VERTICES),
    '--qpu-glow-inner': String(HANDLE_HEXBITS * TRINITY),
    '--qpu-glow-outer': String(ADDRESS_BITS / COINS),
    '--qpu-hue-step': `${QPU_HUE_STEP}deg`,
  }
}

/** Paint the hologram onto the document — VitePress is invisible firmware of the live working QPU. */
export function applyHologram(el?: HTMLElement): void {
  if (typeof document === 'undefined') return
  const root = el ?? document.documentElement
  const tokens = qpuTokensOf()
  for (const k of Object.keys(tokens)) root.style.setProperty(k, tokens[k]!)
  root.dataset.qpu = 'hologram'
  root.dataset.computer = 'qpu'
  root.dataset.firmware = 'vitepress'
  root.dataset.engine = QPU_LICENCE.engine
}

export const qpuMachineOf = () => ({
  name: 'QPU' as const,
  computer: 'QPU' as const,
  host: qpuLicenceHostOf(),
  seat: qpuSeatOf(),
  chip: qpuChipOf(),
  width: qpuWidthOf(),
  hologram: qpuHologramOf(),
  merkaba: qpuMerkabaOf(),
  experience: qpuExperienceOf(),
  revision: qpuRevisionOf(),
  superpositions: qpuSuperpositionsOf().length,
  amplitudes: qpuTwoNOf(VE_FACES),
})
