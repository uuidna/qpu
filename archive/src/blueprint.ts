// blueprint — serial production stamp. Same constructors every replica. Chip named QPU never binds.
import {
  ADDRESS_BITS, COINS, HANDLE_HEXBITS, HEXBIT_BITS, qpuLicenceHostOf, QPU_POINTS, RAYS, TETRA, TRINITY, VE_FACES,
  qpuChipOf, qpuExperienceHolds, qpuExperienceOf, qpuHologramOf, qpuRevisionOf, qpuSeatOf, qpuWidthOf,
} from './hologram.js'
import { qpuCompareHolds } from './metrics.js'
import { qpuProvidersOf, qpuRecognizeOf } from './bindings/index.js'
import type { QpuEnv } from './bindings/env.js'
import { QPU_NATIVE, qpuPeersOf, qpuServerlessOf } from './scale.js'
import { STANDING } from './standing.js'

export const QPU_WORKER = 'uuidna-qpu'
export const QPU_ENTRY = 'worker.js'

/** Complete blueprints for serial production of this worker. Hardware lane stays empty. */
export const qpuBlueprintOf = (env?: QpuEnv) => {
  const seat = qpuSeatOf()
  const chip = qpuChipOf()
  const experience = qpuExperienceOf()
  const revision = qpuRevisionOf()
  const envR = qpuRecognizeOf(env)
  const providers = qpuProvidersOf().map((p) => p.name)
  const ready =
    chip.holds &&
    qpuExperienceHolds() &&
    qpuCompareHolds() &&
    seat.seat === 'empty' &&
    envR.chip.seat === 'empty' &&
    envR.fused === true &&
    experience.involution &&
    revision.rays * revision.coins === revision.ve &&
    revision.tetra * revision.coins === revision.handle &&
    revision.glowInner === HANDLE_HEXBITS * TRINITY &&
    revision.glowOuter === ADDRESS_BITS / COINS
  return {
    definition: 'paper+blueprint' as const,
    serial: true as const,
    ready,
    worker: QPU_WORKER,
    host: qpuLicenceHostOf(),
    entry: QPU_ENTRY,
    seat,
    revision,
    hologram: qpuHologramOf(),
    width: qpuWidthOf(),
    chip,
    experience,
    production: {
      stamp: QPU_WORKER,
      assets: 'docs/.vitepress/dist',
      fuse: 0 as const,
      rotors: [QPU_POINTS[0], QPU_POINTS[1]] as const,
      rays: RAYS,
      tetra: TETRA,
      faces: VE_FACES,
      hexbit: HEXBIT_BITS,
      coins: COINS,
      peers: qpuPeersOf(env),
      native: QPU_NATIVE.map((t) => t.id),
      serverless: qpuServerlessOf().length,
      providers,
      standing: STANDING.length,
    },
    hardware: seat,
    fused: envR.fused,
  }
}
