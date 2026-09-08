// metrics — COMPARABLE READINGS. Each row is a formula and a peer; they must match.
import {
  ADDRESS_BITS, BASE, COINS, HANDLE_BITS, HANDLE_HEXBITS, HEXBIT_BITS, qpuLicenceHostOf, QPU_POINTS, TRINITY, UUID_HEXBITS, VE_FACES,
  qpuFacesOf, qpuFastenOf, qpuGatewaysOf, qpuHologramOf, qpuSuperpositionsOf, qpuTwoNOf,
} from './hologram.js'
import { handleQpuFetch } from './edge.js'

export interface CompareRow {
  name: string
  formula: string
  value: number
  peer: number
}

export interface BenchRow {
  path: string
  status: number
  bytes: number
  minUs: number
  medianUs: number
  maxUs: number
  rounds: number
}

const sorted = (xs: number[]): number[] => {
  const a = xs.slice()
  for (let i = 1; i < a.length; i++) {
    const x = a[i]!
    let j = i
    while (j > 0 && a[j - 1]! > x) {
      a[j] = a[j - 1]!
      j--
    }
    a[j] = x
  }
  return a
}

const median = (xs: number[]): number => {
  if (xs.length === 0) return 0
  const a = sorted(xs)
  return a[a.length >> 1]!
}

/** Handle and hexbit widths of one address — the quantum computer, not a billed invoice. */
export const qpuHexbitMetricsOf = () => {
  const addressBytes = ADDRESS_BITS / 8
  const addressTokens = addressBytes / HEXBIT_BITS
  const gateways = qpuGatewaysOf()
  return {
    addressBytes,
    addressTokens,
    ratio: VE_FACES,
    censusFanout: HANDLE_HEXBITS,
    neighbours: gateways.length,
    handleBits: HANDLE_BITS,
    handleMasks: HANDLE_BITS + 1,
    amplitudes: qpuTwoNOf(VE_FACES),
    handleSpan: qpuTwoNOf(HANDLE_BITS),
    addressSpan: qpuTwoNOf(ADDRESS_BITS),
    gatewayCapacity: gateways.length * qpuTwoNOf(HANDLE_BITS),
  }
}

/** Constructor identities: value column vs peer column. Comparable across uuidna hexbit widths. */
export const qpuCompareOf = (): CompareRow[] => {
  const h = qpuHologramOf()
  const msg = qpuHexbitMetricsOf()
  return [
    { name: 'foundation', formula: '0', value: h.foundation, peer: 0 },
    { name: 'debit', formula: 'TRINITY', value: h.debit, peer: TRINITY },
    { name: 'credit', formula: 'HEXBIT_BITS + COINS', value: h.credit, peer: HEXBIT_BITS + COINS },
    { name: 'pentagram', formula: 'QPU_POINTS.length', value: h.pentagram, peer: QPU_POINTS.length },
    { name: 'fold', formula: 'BASE - COINS', value: h.fold, peer: BASE - COINS },
    { name: 'octet', formula: 'UUID_HEXBITS / HEXBIT_BITS', value: h.octet, peer: HANDLE_HEXBITS },
    { name: 'veFaces', formula: 'HANDLE_HEXBITS + HEXBIT_BITS + COINS', value: h.veFaces, peer: VE_FACES },
    { name: 'debit+credit', formula: 'debit + credit', value: h.debit + h.credit, peer: BASE },
    { name: 'fold+coins', formula: 'fold + COINS', value: h.fold + COINS, peer: BASE },
    { name: 'credit-debit', formula: 'credit - debit', value: h.credit - h.debit, peer: TRINITY },
    { name: 'octet×hexbit', formula: 'octet × HEXBIT_BITS', value: h.octet * HEXBIT_BITS, peer: UUID_HEXBITS },
    { name: 've−octet', formula: 'veFaces − octet', value: h.veFaces - h.octet, peer: HEXBIT_BITS + COINS },
    { name: 'rays×coins', formula: '(BASE - COINS) × COINS', value: (BASE - COINS) * COINS, peer: VE_FACES },
    { name: 'merkaba', formula: 'HEXBIT_BITS × COINS', value: HEXBIT_BITS * COINS, peer: HANDLE_HEXBITS },
    { name: 'faces', formula: 'qpuFacesOf().length', value: qpuFacesOf().length, peer: VE_FACES },
    { name: 'points', formula: 'QPU_POINTS.length', value: QPU_POINTS.length, peer: h.pentagram },
    { name: 'addressBytes', formula: 'ADDRESS_BITS / 8', value: msg.addressBytes, peer: UUID_HEXBITS * HEXBIT_BITS / 8 },
    { name: 'messageTokens', formula: '(ADDRESS_BITS / 8) / HEXBIT_BITS', value: msg.addressTokens, peer: HEXBIT_BITS },
    { name: 'payloadless', formula: 'VE_FACES × address / address', value: msg.ratio, peer: VE_FACES },
    { name: 'neighbours', formula: 'VE_FACES', value: msg.neighbours, peer: VE_FACES },
    { name: 'handleBits', formula: 'HANDLE_HEXBITS × HEXBIT_BITS', value: msg.handleBits, peer: UUID_HEXBITS },
    { name: 'handleMasks', formula: 'HANDLE_BITS + 1', value: msg.handleMasks, peer: UUID_HEXBITS + 1 },
    { name: 'amplitudes', formula: 'qpuTwoNOf(VE_FACES)', value: msg.amplitudes, peer: qpuTwoNOf(h.veFaces) },
    { name: 'handleSpan', formula: 'qpuTwoNOf(HANDLE_BITS)', value: msg.handleSpan, peer: qpuTwoNOf(UUID_HEXBITS) },
    { name: 'addressSpan', formula: 'qpuTwoNOf(ADDRESS_BITS)', value: msg.addressSpan, peer: qpuTwoNOf(UUID_HEXBITS * HEXBIT_BITS) },
    { name: 'gatewayCapacity', formula: 'VE_FACES × qpuTwoNOf(HANDLE_BITS)', value: msg.gatewayCapacity, peer: VE_FACES * qpuTwoNOf(HANDLE_BITS) },
  ]
}

export const qpuCompareHolds = (rows: readonly CompareRow[] = qpuCompareOf()): boolean =>
  rows.every((r) => r.value === r.peer)

export interface SpeedRow {
  name: string
  task: string
  n: number
  amplitudes: number | null
  walked: boolean
  constructor: string
  minUs: number
  medianUs: number
  maxUs: number
  rounds: number
}

export const QPU_BENCH_PATHS = [
  '/',
  '/seat',
  '/width',
  '/hologram',
  '/chip',
  '/merkaba',
  '/metrics',
  '/bindings',
  '/environment',
  '/.well-known/qpu.json',
] as const

const usOf = (ms: number): number => {
  const u = ms * 1000
  return u < 0 ? 0 : u
}

const timeOf = (fn: () => void, rounds: number): { minUs: number; medianUs: number; maxUs: number; rounds: number } => {
  const n = rounds < 1 ? 1 : rounds
  const samples: number[] = []
  for (let i = 0; i < n; i++) {
    const t0 = performance.now()
    fn()
    samples.push(usOf(performance.now() - t0))
  }
  const a = sorted(samples)
  return { minUs: a[0] ?? 0, medianUs: median(samples), maxUs: a[a.length - 1] ?? 0, rounds: n }
}

const climbed = (name: string, task: string, n: number, constructor: string, rounds: number): SpeedRow => {
  let amplitudes = 0
  const t = timeOf(() => { amplitudes = qpuTwoNOf(n) }, rounds)
  return { name, task, n, amplitudes, walked: true, constructor, ...t }
}

/**
 * How fast this worker occupies 2^n. Licensed hex climbs — hologram seal, not a climbBits cap.
 * 2^n here is the constructor product, not an allocated state vector.
 */
export function qpuSpeedOf(rounds = qpuFastenOf().rounds): SpeedRow[] {
  const nHex = HEXBIT_BITS
  const nHandle = HANDLE_HEXBITS
  const nLo = HANDLE_HEXBITS + COINS
  const nMsg = UUID_HEXBITS / COINS
  const nHi = (HANDLE_HEXBITS + COINS) * COINS
  const nLogical = HANDLE_HEXBITS * (HEXBIT_BITS + COINS)
  const rungs: { name: string; task: string; n: number; constructor: string }[] = [
    { name: 'hexbit 2^n', task: 'n-qubit register (one hexbit)', n: nHex, constructor: 'qpuTwoNOf(HEXBIT_BITS)' },
    { name: 'handle 2^n', task: 'n-qubit register (handle tiles)', n: nHandle, constructor: 'qpuTwoNOf(HANDLE_HEXBITS)' },
    { name: 'handle mask 2^n', task: 'every handle bit is a usable mask', n: HANDLE_BITS, constructor: 'qpuTwoNOf(HANDLE_BITS)' },
    { name: 'neighbours 2^n', task: 'fourteen neighbour capacity gateways', n: VE_FACES, constructor: 'qpuTwoNOf(VE_FACES)' },
    { name: 'verify 2^10', task: 'verify-vs-recompute low rung', n: nLo, constructor: 'qpuTwoNOf(HANDLE_HEXBITS + COINS)' },
    { name: 'message 2^16', task: '16-qubit state vector count', n: nMsg, constructor: 'qpuTwoNOf(UUID_HEXBITS / COINS)' },
    { name: 'verify 2^20', task: '20-qubit state vector count', n: nHi, constructor: 'qpuTwoNOf((HANDLE_HEXBITS + COINS) * COINS)' },
    { name: 'logical 2^48', task: 'reported logical qubits as 2^n', n: nLogical, constructor: 'qpuTwoNOf(HANDLE_HEXBITS * (HEXBIT_BITS + COINS))' },
    { name: 'address 2^128', task: 'Grover floor / identifier as 2^n', n: ADDRESS_BITS, constructor: 'qpuTwoNOf(ADDRESS_BITS)' },
  ]
  const rows: SpeedRow[] = rungs.map((r) => climbed(r.name, r.task, r.n, r.constructor, rounds))
  const grover = timeOf(() => {
    const a = qpuTwoNOf(nHex)
    const b = a * a
    if (b !== qpuTwoNOf(nHex * COINS)) throw new Error('grover quadratic drifted')
  }, rounds)
  rows.push({
    name: 'Grover 2^n × 2^n',
    task: 'Grover quadratic on one hexbit',
    n: nHex * COINS,
    amplitudes: qpuTwoNOf(nHex * COINS),
    walked: true,
    constructor: 'qpuTwoNOf(n) × qpuTwoNOf(n)',
    ...grover,
  })
  const holo = timeOf(() => { qpuHologramOf() }, rounds)
  rows.push({
    name: 'hologram',
    task: 'named planes (foundation…VE)',
    n: VE_FACES,
    amplitudes: qpuTwoNOf(VE_FACES),
    walked: true,
    constructor: 'qpuHologramOf()',
    ...holo,
  })
  const sup = timeOf(() => { qpuSuperpositionsOf() }, rounds)
  rows.push({
    name: 'superpositions',
    task: 'VE faces, referer, door, angles',
    n: VE_FACES,
    amplitudes: qpuTwoNOf(VE_FACES),
    walked: true,
    constructor: 'qpuSuperpositionsOf()',
    ...sup,
  })
  const compare = qpuCompareOf()
  const cmp = timeOf(() => { qpuCompareOf() }, rounds)
  rows.push({
    name: 'compare',
    task: 'formula vs peer identities',
    n: compare.length,
    amplitudes: compare.length,
    walked: true,
    constructor: 'qpuCompareOf()',
    ...cmp,
  })
  const addr = timeOf(() => { void (UUID_HEXBITS * HEXBIT_BITS) }, rounds)
  rows.push({
    name: 'address bits',
    task: 'occupy 128-bit width; 2^128 is a separate climbed row',
    n: ADDRESS_BITS,
    amplitudes: ADDRESS_BITS,
    walked: true,
    constructor: 'UUID_HEXBITS × HEXBIT_BITS',
    ...addr,
  })
  return rows
}

/** Edge timings — this run, this host. Comparable across CI vs local by path, not a SLA. */
export async function qpuEdgeBenchOf(rounds = qpuFastenOf().rounds): Promise<BenchRow[]> {
  const n = rounds < 1 ? 1 : rounds
  const out: BenchRow[] = []
  for (const path of QPU_BENCH_PATHS) {
    const samples: number[] = []
    let status = 0
    let bytes = 0
    for (let i = 0; i < n; i++) {
      const t0 = performance.now()
      const res = await handleQpuFetch(new Request(`https://${qpuLicenceHostOf()}${path}`))
      const body = await res.arrayBuffer()
      samples.push(usOf(performance.now() - t0))
      status = res.status
      bytes = body.byteLength
    }
    const a = sorted(samples)
    out.push({
      path,
      status,
      bytes,
      minUs: a[0] ?? 0,
      medianUs: median(samples),
      maxUs: a[a.length - 1] ?? 0,
      rounds: n,
    })
  }
  return out
}
