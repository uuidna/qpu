// fractal — fuse every QPU reading into one self-similar fold.
// Desk constructors. Same shape at every scale. Chip named QPU never binds.
import {
  ADDRESS_BITS, BASE, COINS, HANDLE_HEXBITS, HEXBIT_BITS, HEXBIT_STATES, QPU_DOORS, qpuLicenceHostOf, QPU_POINTS, RAYS, SEAL_TEN, TRINITY, UUID_HEXBITS, VE_FACES,
  digitalRoot, qpuChipHolds, qpuChipOf, qpuCombinationsHolds, qpuCombinationsOf, qpuHologramOf, qpuMorphHolds, qpuMorphOf, qpuSeatOf, qpuStarStrokeOf, qpuSuperpositionsOf, qpuTwoNOf, qpuWidthOf,
} from './hologram.js'
import { qpuProvidersOf, qpuRecognizeOf } from './bindings/index.js'
import type { QpuEnv } from './bindings/env.js'
import { QPU_NATIVE, qpuPeersOf, qpuScaleOf, qpuServerlessOf } from './scale.js'
import { STANDING } from './standing.js'
import { qpuCompareHolds } from './metrics.js'

const gcd = (a: number, b: number): number => {
  let x = a < 0 ? -a : a
  let y = b < 0 ? -b : b
  while (y !== 0) {
    const t = y
    y = x % y
    x = t
  }
  return x
}

const sealHolds = (seal: readonly number[]): boolean => {
  if (seal.length !== SEAL_TEN.length) return false
  for (let i = 0; i < SEAL_TEN.length; i++) if (seal[i] !== SEAL_TEN[i]) return false
  return true
}

/** {5/2} stroke: step coins (2) around the pentagram. Same walk as the OG hero. */
export const qpuStrokeOf = qpuStarStrokeOf

export const qpuFractalScalesOf = () => {
  const address = ADDRESS_BITS
  const coin = ADDRESS_BITS / COINS
  const handle = HANDLE_HEXBITS
  const hexbit = HEXBIT_BITS
  const fold = digitalRoot(ADDRESS_BITS)
  return [
    { scale: 'address', bits: address },
    { scale: 'coin', bits: coin },
    { scale: 'handle', hexbits: handle },
    { scale: 'hexbit', bits: hexbit },
    { scale: 'trinity', width: TRINITY },
    { scale: 'coins', n: COINS },
    { scale: 'fold', root: fold },
    { scale: 'doors', n: QPU_DOORS },
    { scale: 'rays', n: RAYS },
    { scale: 'seal', n: SEAL_TEN.length },
  ]
}

/** Quality gate: hologram seal, combination involution, 2^n amplitudes. Drift from this reading fails the fold. */
export const qpuFractalHolds = (): boolean => {
  const stroke = qpuStrokeOf()
  const hologram = qpuHologramOf()
  const faces = qpuSuperpositionsOf()
  const combos = qpuCombinationsOf()
  const morph = qpuMorphOf(0)
  const single = gcd(COINS, QPU_POINTS.length) === 1
  const coinBits = ADDRESS_BITS / COINS
  const selfSimilar =
    coinBits === UUID_HEXBITS * COINS &&
    digitalRoot(ADDRESS_BITS) === COINS &&
    HANDLE_HEXBITS === UUID_HEXBITS / HEXBIT_BITS &&
    VE_FACES === HANDLE_HEXBITS + HEXBIT_BITS + COINS
  let facesHold = faces.length === VE_FACES
  for (const s of faces) {
    if (s.door !== s.referer % QPU_DOORS) facesHold = false
    if (s.referer !== s.face % HEXBIT_STATES) facesHold = false
  }
  return (
    single &&
    selfSimilar &&
    stroke.length === QPU_POINTS.length &&
    stroke[0] === 0 &&
    sealHolds(hologram.seal) &&
    qpuCombinationsHolds(combos) &&
    qpuMorphHolds(morph) &&
    qpuChipHolds() &&
    facesHold &&
    combos.inner.count === QPU_DOORS * RAYS &&
    combos.outer.count === RAYS * QPU_DOORS &&
    combos.inner.count === combos.outer.count
  )
}

/** One fused fractal: hologram seal, fourteen faces, 6×7⇄7×6 combinations, 2^n amplitudes. */
export const qpuFractalOf = (env?: QpuEnv) => {
  const seat = qpuSeatOf()
  const width = qpuWidthOf()
  const hologram = qpuHologramOf()
  const envR = qpuRecognizeOf(env)
  const scale = qpuScaleOf(env)
  const stroke = qpuStrokeOf()
  const combos = qpuCombinationsOf()
  const morph = qpuMorphOf(0)
  const amplitudes = qpuTwoNOf(VE_FACES)
  const cells = qpuSuperpositionsOf().map((s) => ({
    face: s.face,
    opposite: s.opposite,
    referer: s.referer,
    door: s.door,
    hue: s.angles.hue,
    dash: s.angles.dash,
    slot: s.angles.slot,
    reflection: s.angles.reflection,
    seat: seat.seat,
    stroke: stroke.map((i) => QPU_POINTS[i]!),
  }))
  const providers = qpuProvidersOf().map((p) => ({
    name: p.name,
    seat: p.seat,
    bindings: p.bindings.length,
    serverless: p.bindings.filter((b) => b.kind !== 'qpu' && b.ops.some((op) => op === 'fetch' || op === 'run' || op === 'send')).length,
  }))
  const verified =
    qpuFractalHolds() &&
    envR.fused === true &&
    envR.chip.seat === 'empty' &&
    seat.seat === 'empty' &&
    cells.length === VE_FACES &&
    cells.every((c) => c.seat === 'empty' && c.door === c.referer % QPU_DOORS) &&
    sealHolds(hologram.seal) &&
    qpuCompareHolds() &&
    qpuChipOf().holds &&
    qpuChipOf().claimed &&
    combos.holds &&
    morph.holds &&
    amplitudes === qpuTwoNOf(VE_FACES)
  return {
    fused: true as const,
    host: qpuLicenceHostOf(),
    chip: seat,
    novelty: qpuChipOf(),
    pentagram: {
      points: [...QPU_POINTS],
      stroke,
      visited: stroke.map((i) => QPU_POINTS[i]!),
      single: gcd(COINS, QPU_POINTS.length) === 1,
    },
    hologram,
    width,
    fractal: {
      scales: qpuFractalScalesOf(),
      selfSimilar: qpuFractalHolds(),
      faces: VE_FACES,
      seal: [...hologram.seal],
      doors: QPU_DOORS,
      rays: RAYS,
      inner: combos.inner.count,
      outer: combos.outer.count,
      involution: combos.involution,
      fuse: combos.fuse,
      amplitudes,
      cells,
    },
    morph,
    providers,
    scale,
    native: QPU_NATIVE.map((t) => t.id),
    serverless: qpuServerlessOf().length,
    peers: qpuPeersOf(env),
    standing: STANDING.length,
    base: BASE,
    verified,
  }
}
