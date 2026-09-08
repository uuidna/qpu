// proofs — constructor census of the prototype (concept) and occupancy (work).
// Numbers and addresses. Desk does not mint theorem keys.
import { BASE, COINS, QPU_DOORS, RAYS, SEAL_TEN, qpuChipOf, qpuHologramOf, qpuSeatOf, qpuSuperpositionsOf, qpuTwoNOf, qpuWidthOf } from './hologram.js'
import { qpuCompareHolds, qpuCompareOf } from './metrics.js'
import { QPU_TOOLS } from './mcp-catalog.js'
import { qpuProvidersOf, qpuRecognizeOf } from './bindings/index.js'
import { STANDING } from './standing.js'
import { qpuRoutesOf } from './seo.js'
import { qpuPqcHolds, qpuPqcOf } from './pqc.js'
import { qpuQuantumHolds, qpuQuantumOf } from './quantum.js'

export interface QpuReceipt {
  tests: number
  pass: number
  fail: number
  skipped?: number
  durationMs?: number
}

export const qpuProofsOf = (receipt?: QpuReceipt) => {
  const seat = qpuSeatOf()
  const width = qpuWidthOf()
  const h = qpuHologramOf()
  const chip = qpuChipOf()
  const compare = qpuCompareOf()
  const env = qpuRecognizeOf()
  const providers = qpuProvidersOf()
  let bindings = 0
  for (const p of providers) bindings = bindings + p.bindings.length
  const superpositions = qpuSuperpositionsOf()
  const pqc = qpuPqcOf()
  const quantum = qpuQuantumOf()
  const concept = {
    seat: seat.seat,
    admits: seat.admits,
    points: width.pentagram,
    foundation: h.foundation,
    debit: h.debit,
    credit: h.credit,
    fold: h.fold,
    octet: h.octet,
    veFaces: h.veFaces,
    seal: [...h.seal],
    superpositions: superpositions.length,
    combinations: chip.merkaba.combinations.inner.count,
    amplitudes: qpuTwoNOf(h.veFaces),
    providers: providers.length,
    bindings,
    tools: QPU_TOOLS.length,
    standing: STANDING.length,
    routes: qpuRoutesOf().length,
    fused: env.fused,
    chip: env.chip.seat,
    novelty: chip.novelty,
    claimed: chip.claimed,
    chipHolds: chip.holds,
    rotors: chip.merkaba.rotors,
    rays: chip.merkaba.rays,
    vertices: chip.merkaba.vertices,
    gravity: STANDING.some((s) => s.key === 'clay_gravity_equals_rosette' && s.file === 'Clay.lean'),
    sandbox: env.sandbox,
    experiments: env.experiments,
    when: env.when,
    pqc: pqc.holds,
    quantum: quantum.holds,
    pure: quantum.pure,
    agnostic: quantum.agnostic,
    live: quantum.live,
    working: quantum.working,
    possibilities: quantum.possibilities,
  }
  const holds = qpuCompareHolds(compare)
  const testsOk = receipt
    ? receipt.fail === 0 && receipt.pass === receipt.tests && receipt.tests > 0
    : true
  const work = {
    compareRows: compare.length,
    compareHolds: holds,
    tests: receipt?.tests ?? 0,
    pass: receipt?.pass ?? 0,
    fail: receipt?.fail ?? 0,
    durationMs: receipt?.durationMs ?? 0,
    debitCredit: h.debit + h.credit,
    foldCoins: h.fold + COINS,
    base: BASE,
  }
  const conceptOk =
    concept.seat === 'empty' &&
    concept.fused === true &&
    concept.chip === 'empty' &&
    concept.claimed === true &&
    concept.chipHolds === true &&
    concept.rotors * concept.rays === concept.veFaces &&
    concept.superpositions === concept.veFaces &&
    concept.combinations === QPU_DOORS * RAYS &&
    concept.amplitudes === qpuTwoNOf(concept.veFaces) &&
    concept.seal.join() === [...SEAL_TEN].join() &&
    concept.gravity === true &&
    concept.sandbox === true &&
    concept.experiments === 'unlimited' &&
    concept.when === 'never' &&
    concept.pqc === true &&
    qpuPqcHolds(pqc) &&
    concept.quantum === true &&
    concept.pure === true &&
    concept.agnostic === true &&
    concept.live === true &&
    concept.working === true &&
    qpuQuantumHolds(quantum) &&
    concept.possibilities === concept.amplitudes
  const workOk = holds && work.debitCredit === BASE && work.foldCoins === BASE && testsOk
  return { concept, work, complete: conceptOk && workOk }
}
