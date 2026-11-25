// Tsvetan Rouschev, @uuidna/qpu, CC-BY-NC-ND-4.0 (https://orcid.org/0009-0000-7312-9778)
// Pure cryptographic surfaces: the proven 1000-bit surface, UUID superpositions, NIST/CERN scenarios, AEAD/Merkle/PBKDF2/X25519, and attest theorem reads. No MCP, no fetch.
import { PROSE, proseFill } from '../../../../../../../../5/9/e/4/9/1/a/4/index.ts'
import { createImpossible, decodeImpossible, testPrimality, listFactors, shorReduction, orderFinding, sqrtBig, pasteInteger } from '../../../../../../../../b/1/c/2/3/6/2/1/index.ts'
import { dnaToHex, hexToDna, dnaStream, uuid, seal, seal as uuidSeal, canonicalText, stream, neighbours, next, navigate, compositions, composition, compositionIndex, rosetta, harmonicDefaults, uuidQubits, hexbit, organiseQubits, coins, channel, isUuid } from '../../../../../../../../2/7/1/a/7/6/4/9/index.ts'
import { coins as clayCoins, rays, faces, plane, recomputeClay, AXIOMS } from '../../../../../../../../9/d/1/0/1/4/3/9/index.ts'
import { CLAY_RELATIONS } from '../../../../../../../../1/f/2/7/c/5/1/c/index.ts'
import { speakThousand } from '../../../../../../../d/4/0/8/8/7/9/index.ts'
import { sha256, sha512, sha1, sha3_256, sha3_512, shake128, shake256, utf8, hex, hkdfExtract, hkdfExpand, pbkdf2Sha256, aes256gcmEncrypt, aes256gcmDecrypt, x25519, chacha20poly1305Encrypt, chacha20poly1305Decrypt, merkleLeafHash, merkleRoot, merkleProof, merkleVerify } from '../../../../../../../../9/e/8/6/7/0/6/8/index.ts'
import { isObj } from '../../../../../../../../d/e/7/d/b/7/1/6/index.ts'
import { isoEntropyOf } from '../../../../../../../../0/b/7/1/f/2/4/6/index.ts'
import { kemRound, dsaRound } from '../../../../../../../../4/3/a/3/9/a/e/6/index.ts'
import type { TheoremTally } from '../../../../../../../../d/e/7/d/b/7/1/6/index.ts'

/** Tenant / Payload MCP crypto config: handed by `payload { cryptoConfig: true }` or merged from `tenants.settings.arguments`. Pure crypto never reads TABLES or the tenants collection itself. */
/** The 32 hex digits of one UUID register (ISO/IEC 9834-8): the width of the DNA read, a field of the construction, not a cap. */
const UUID_DIGITS = 32
type CryptoAttestApi = { id: string; name: string; url: string; open: boolean; measured: string }
type CryptoPostQuantum = { workers: { flag: string; changelog: string; says: string; read: string }; thisSeal: string; standards: readonly unknown[]; selected: unknown; node: unknown; here: unknown }
/** ISO/IEC 4879 quantum-computer surface a tenant may choose: processor inventory (no site geometry), circuit schemas, hardware stack summary. */
export type CryptoProcessorName = 'Willow' | 'Sycamore' | 'Sycamore23' | 'Bristlecone' | 'Foxtail'
export type CryptoProcessorRow = {
  name: CryptoProcessorName
  qubits: number
  couplers: number
  technology?: string
  layout?: string
  statedQubits?: number
  statedCouplers?: number
  statedAverageConnectivity?: number
}
/** UUID-as-qubit-register (ISO/IEC 4879 logical qubit + ISO/IEC 9834-8 UUID): register `hexbit` parameter, effective width, delivery leads. */
export type CryptoUuidRegister = {
  standard: 'ISO/IEC 4879:2024'
  uuid: 'ISO/IEC 9834-8'
  quality: 'ISO 9001'
  /** Register parameter `hexbit`: qubits per hex digit (default 4). Not ISO/IEC 4879 vocabulary — feeds the UUID width the standard describes. */
  hexbit: number
  digits: 32
  effective: number
  versionReserved: number
  variantReserved: 2
  formula: string
  handles: { possible: string; capacity: string; fractal: boolean }
  delivery: { leads: 6; holds: boolean }
  clauses: readonly { clause: string; name: string; kind: 'logical-qubit' | 'superposition' | 'uuid' }[]
  doors: { fold: 'qubits' | 'exchange' | 'organise' | 'superpositions'; via: 'qpuMcpPlugin' }
}
type CryptoQuantumComputer = {
  standard: 'ISO/IEC 4879:2024'
  vocabulary: { reference: string; id: number; title: string; scope: string }
  companions: readonly string[]
  processors: {
    default: CryptoProcessorName
    allowed: readonly CryptoProcessorName[]
    inventory: readonly CryptoProcessorRow[]
    /** Minimum role that may choose the processor (Payload RBAC / mayChoose). */
    roles: Readonly<Record<CryptoProcessorName, 'reader' | 'writer' | 'admin'>>
  }
  devices: readonly CryptoProcessorName[]
  schemas: { qubit: unknown; channel: unknown }
  hardware: {
    modality: string
    noiseModels: readonly string[]
    krausChannels: readonly string[]
    twoQubitGates: readonly string[]
  }
  /** Logical qubit register: one UUID, hexbit per digit — tenant crypto, not Cirq hardware sites. */
  register: CryptoUuidRegister
}
export type CryptoConfig = {
  attestApis: readonly CryptoAttestApi[]
  postQuantum: CryptoPostQuantum
  hosts: readonly string[]
  codataUrl: string
  via?: 'qpuMcpPlugin' | 'tenant.settings'
  /** ISO dimensions this tenant seals against, plus the quantum-computer configuration. */
  iso: {
    dimensions: readonly string[]
    quantumComputer: CryptoQuantumComputer
  }
}
const cfgHosts = (c: CryptoConfig) => (c.hosts.length ? c.hosts : (() => { throw new Error(PROSE.quantumProcessingCryptoIndex_s1) })())
const cfgAttest = (c: CryptoConfig, id: string) => {
  const row = c.attestApis.find((a) => a.id === id)
  if (!row) throw new Error(proseFill(PROSE.quantumProcessingCryptoIndex_s2, id))
  return row
}
/** Processors a role may choose under the tenant crypto config (ISO/IEC 4879 inventory ∩ RBAC). */
export const processorsForRole = (config: CryptoConfig, role: 'reader' | 'writer' | 'admin' = 'reader'): readonly CryptoProcessorName[] => {
  const rank = { reader: 0, writer: 1, admin: 2 } as const
  const { allowed, roles } = config.iso.quantumComputer.processors
  return allowed.filter((name) => rank[role] >= rank[roles[name] ?? 'admin'])
}
/** True when the named processor is on the tenant inventory and the role may choose it. */
export const mayUseProcessor = (config: CryptoConfig, name: string, role: 'reader' | 'writer' | 'admin' = 'reader'): name is CryptoProcessorName =>
  processorsForRole(config, role).includes(name as CryptoProcessorName)

export {
  createImpossible,
  decodeImpossible,
  testPrimality,
  listFactors,
  shorReduction,
  orderFinding,
  pasteInteger,
  dnaToHex,
  hexToDna,
  dnaStream,
  speakThousand,
  CLAY_RELATIONS,
  recomputeClay,
}

const sha = (s: string) => hex(sha256(utf8(s)))

/** Canonical 1000-bit test integer (`2^999 <= N1000 < 2^1000`, bit 999 set). */
export const N1000 = ((1n << 999n) + ((1n << 877n) | (1n << 613n) | (1n << 251n) | 123456789n)).toString()

/** Pure 2 * 7 = 14 reflection cut of an integer (`textbook_witness_clock_move`). */
/** The faces of a hex text: each a piece of its width at its offset, as an integer. */
export const facePieces = (hex: string, W: readonly number[], off: readonly number[]): bigint[] => W.map((w, i) => BigInt('0x' + (hex.slice(off[i]!, off[i]! + w) || '0')))
export const reflect1000Bit = (raw: string = N1000, faceCount: number = faces) => {
  const value = BigInt(raw)
  const hex = value.toString(16).padStart(2, '0')
  const L = hex.length
  const base = (L - (L % faceCount)) / faceCount
  const rem = L - base * faceCount
  const W: number[] = []
  const off: number[] = []
  for (let i = 0, s = 0; i < faceCount; i++) {
    const w = base + (i < rem ? 1 : 0)
    W.push(w)
    off.push(s)
    s += w
  }
  const pieces = facePieces(hex, W, off)
  const half = faceCount / 2
  const dec = new Array<bigint>(faceCount)
  let reflections = 0
  let reflectionsExact = true
  for (let j = 0; j < half; j++) {
    const u = pieces[j]!
    const v = pieces[faceCount - 1 - j]!
    const N = u * v
    const d = u + v
    const b = sqrtBig(d * d - 4n * N)
    const lo = (d - b) / 2n
    const hi = (d + b) / 2n
    const orient: 0 | 1 = u >= v ? 0 : 1
    if (d - lo === hi) reflections++
    if (d - hi === lo) reflections++
    reflectionsExact = reflectionsExact && d - lo === hi && d - hi === lo && lo * hi === N
    dec[j] = orient ? lo : hi
    dec[faceCount - 1 - j] = orient ? hi : lo
  }
  const rebuiltHex = dec.map((x, i) => x.toString(16).padStart(W[i]!, '0')).join('')
  const exact = BigInt('0x' + rebuiltHex) === value
  return {
    bits: value.toString(2).length,
    faces: faceCount,
    rays: faceCount / 2,
    reflections,
    reflectionsExact,
    exact,
  }
}

let _crypto1000BitCache: ReturnType<typeof computeCrypto1000Bit> | null = null

const computeCrypto1000Bit = () => {
  // 1. Reflect door: 2 * 7 = 14 reflections on N1000
  const reflect = reflect1000Bit(N1000, faces)

  // 2. Sigma-trapdoor at 1000 bits (deterministic seed: 1n, as used by clay { readme })
  const trapdoor = createImpossible({ bits: 1000, seed: 1n })
  const decoded = decodeImpossible(trapdoor.N, trapdoor.witness)
  const wrongWitnessRefused =
    decodeImpossible(trapdoor.N, 0n).decoded === false &&
    decodeImpossible(trapdoor.N, trapdoor.witness - 2n).decoded === false &&
    decodeImpossible(trapdoor.N, trapdoor.witness + 2n).decoded === false

  // 3. Crypto <-> DNA cross-encryption (64 bases = 1 UUID = 32 hex nibbles)
  const dnaSequence = 'ACGTACGTGGCCAATTACGTACGTGGCCAATTACGTACGTGGCCAATTACGTACGTGGCCAATT'
  const bases = dnaStream(dnaSequence)
  const nextPrime = (x: bigint) => {
    let n = x | 1n
    while (!testPrimality(n).prime) n += 2n
    return n
  }
  const dnaP = nextPrime(BigInt('0x' + dnaToHex(dnaSequence.slice(0, UUID_DIGITS))) + (1n << 80n))
  const dnaQ = nextPrime(BigInt('0x' + dnaToHex(dnaSequence.slice(32))) + (1n << 120n))
  const dnaTrapdoor = createImpossible({ p: dnaP, q: dnaQ })
  const dnaDecoded = decodeImpossible(dnaTrapdoor.N, dnaTrapdoor.witness)
  const dnaWrongRefused = decodeImpossible(dnaTrapdoor.N, dnaTrapdoor.witness + 2n).decoded === false

  // 4. Glagolitic 1000-bit speech (textbook_thousand_bit_width)
  const glagolitic1000 = speakThousand(1000)

  // 5. Clay register & exact arithmetic, including 2^999 + 1 (relation_36 is φ(74) = 36)
  const clay = recomputeClay()
  const algebraicN = (1n << 999n) + 1n
  const algebraic = listFactors(algebraicN, 1n << 12n)
  const algebraicParts = [...algebraic.factors, ...algebraic.left]
  const relation36 = clay.relations.find((r) => r.name === 'relation_36')
  const algorithmRelations = clay.relations.filter((r) => r.families.some((f) => f === 'Shor' || f === 'Qaoa' || f === 'Qft' || f === 'Grover'))
  const exactArithmetic = {
    bits1000: 1000 as const,
    bits1001: 1001 as const,
    cmykKShift3: 10 ** 3 === 1000 && 2 ** 3 * 5 ** 3 === 1000,
    cliffordIdentity: (1 << 10) - 24 === 1000,
    cuboctahedronA432: 71 * 14 + 6 === 1000 && 72 * 6 === 432,
    newEra1001: 7 * 11 * 13 === 1001 && 71 * 14 + 7 === 1001 && (1000 + 1) % 91 === 0,
    clayCasesTotal: clay.total,
    clayCasesHolding: clay.holding,
    algebraicProduct: algebraic.left.length === 0 && algebraic.verified && algebraicParts.reduce((a, b) => a * b, 1n) === algebraicN && algebraic.factors.includes(3n) && algebraic.factors.length >= 20 && algebraicN.toString(2).length === 1000,
    cyclotomicDegree: relation36?.holds === true && relation36.sides[0]?.value === 36,
    clayAlgorithms: algorithmRelations.length > 0 && algorithmRelations.every((r) => r.holds),
  }

  const verified = Boolean(
    reflect.bits === 1000 &&
      reflect.faces === faces &&
      reflect.rays === rays &&
      reflect.reflections === 14 &&
      reflect.reflectionsExact === true &&
      reflect.exact === true &&
      trapdoor.N.toString(2).length === 1000 &&
      decoded.decoded === true &&
      decoded.verified === true &&
      decoded.searched === 1n &&
      wrongWitnessRefused &&
      bases.roundTrips === true &&
      dnaDecoded.decoded === true &&
      dnaDecoded.verified === true &&
      dnaWrongRefused &&
      glagolitic1000.roundTrip === true &&
      clay.holding === clay.total &&
      exactArithmetic.cmykKShift3 &&
      exactArithmetic.cliffordIdentity &&
      exactArithmetic.cuboctahedronA432 &&
      exactArithmetic.newEra1001 &&
      exactArithmetic.algebraicProduct &&
      exactArithmetic.cyclotomicDegree &&
      exactArithmetic.clayAlgorithms,
  )

  const address = uuid(
    canonicalText({
      phase: 'qpu-crypto-1000-bit',
      verified,
      trapdoorN: trapdoor.N.toString(),
      witness: trapdoor.witness.toString(),
      clayHolding: clay.holding,
    }),
  )

  return {
    phase: 'qpu-crypto-1000-bit' as const,
    verified,
    address,
    sealed: seal(address).valid,
    lattice: { coins: clayCoins, rays, faces, plane },
    reflect1000Bit: reflect,
    sigmaTrapdoor1000Bit: {
      bits: trapdoor.bits,
      N: trapdoor.N.toString(),
      p: trapdoor.p.toString(),
      q: trapdoor.q.toString(),
      witness: trapdoor.witness.toString(),
      searched: decoded.searched.toString(),
      decoded: decoded.decoded,
      verified: decoded.verified,
      wrongWitnessRefused,
      refusedForEveryWitness: 'Witness.witness_unique' as const,
    },
    dnaCrossEncryption: {
      bases: bases.bases,
      uuid: bases.uuids[0]!,
      roundTrips: bases.roundTrips,
      decodedByWitness: dnaDecoded.decoded && dnaDecoded.verified,
      wrongWitnessRefused: dnaWrongRefused,
      refusedForEveryWitness: 'Witness.witness_unique' as const,
    },
    glagolitic1000,
    exactArithmetic,
    theorems: [
      'textbook_impossible_trapdoor',
      'Witness.split_unique',
      'Witness.witness_unique',
      'textbook_witness_gates_decode',
      'textbook_decode_not_search',
      'textbook_involution_decoder',
      'textbook_euler_fermat',
      'textbook_relation_rsa',
      'relation_rsa',
      'shor_factored',
      'textbook_shor_sigma_root',
      'textbook_shor_reduction',
      'textbook_rsa_beyond_bound',
      'textbook_factors_divide',
      'textbook_thousand_bit_width',
      'textbook_thousand_bit_three_divides',
      'textbook_dna_base4',
      'textbook_witness_clock_move',
      'legal_only_the_proven_is_admitted',
    ] as const,
  }
}

export const crypto1000Bit = () => {
  if (!_crypto1000BitCache) _crypto1000BitCache = computeCrypto1000Bit()
  return _crypto1000BitCache
}


/** Every paste is an integer case, none refused. Each case is witnessed by the address of its content. The cases merge to one address, the singularity.
 *  Non-integer bytes are fuel burned on the next fusion wave. ISO 80000-5 entropy is S = k ln W over distinct case addresses (W = leads); fusion never multiplies cases (textbook_entropy_fusion). */
export const integers = (raw: unknown) => {
  const list = Array.isArray(raw) ? raw : [raw]
  const rows = list.map((v) => {
    const pasted = pasteInteger(v)
    const kind = pasted.magnitude === null ? (pasted.meaning === 'an empty paste' ? 'empty' as const : 'meaning' as const) : pasted.sign === 'minus' ? 'minus' as const : pasted.rest ? 'mixed' as const : 'digit' as const
    const address = uuid(canonicalText({ kind, integer: pasted.integer, meaning: pasted.meaning }))
    return { kind, integer: pasted.integer, meaning: pasted.meaning, rest: pasted.rest, entropy: utf8(pasted.rest).length, address, sealed: uuidSeal(address).valid }
  })
  const members = [...new Set(rows.map((r) => r.address))].sort()
  const findings = rows.length
  const leads = members.length
  const reactions = findings - leads
  const entropy = rows.reduce((n, r) => n + r.entropy, 0)
  const singularity = uuid(canonicalText(members))
  const iso = isoEntropyOf(leads)
  return { agnostic: true as const, refused: false as const, cases: findings, findings, reactions, leads, bound: leads <= findings, collapsed: reactions, entropy, burned: entropy, fuel: entropy, wave: { next: entropy > 0 ? 1 : 0, fuel: entropy }, singularity, sealed: uuidSeal(singularity).valid && rows.every((r) => r.sealed), rows, iso, theorems: ['textbook_entropy_fusion', 'singularity'] as const, says: proseFill(PROSE.quantumProcessingCryptoIndex_says3, findings, entropy, iso.standard, iso.definition, iso.W, iso.S, iso.unit, leads) }
}

export const QUENEAU = Array.from({ length: 14 }, () => 10)
export const COMBINATORICS = [
  { name: 'queneau', radices: QUENEAU, theorem: 'textbook_queneau_compositions', formula: '10 ^ 14' },
  { name: 'plugins', radices: [2, 2, 2, 2, 2, 2, 2, 2, 2], theorem: 'textbook_plugin_combinations', formula: '2 ^ 9' },
  { name: 'adapters', radices: [5, 5, 2], theorem: 'textbook_mixed_radix', formula: '5 * 5 * 2' },
  { name: 'sets', radices: [3, 8], theorem: 'textbook_mixed_radix', formula: '3 * 8' },
  { name: 'algorithm', radices: [7, 19, 1, 2, 6, 1, 1, 8, 2, 11], theorem: 'textbook_mixed_radix', formula: '7 * 19 * 1 * 2 * 6 * 1 * 1 * 8 * 2 * 11' },
  { name: 'installations', radices: [3, 2, 5, 5, 2, 512], theorem: 'textbook_mixed_radix', formula: '3 * 2 * 5 * 5 * 2 * 512' },
] as const

const SUPERPOSITION_ADDRESS = '941ef62e-d97b-2438-bfc8-22ae9e5da781'
const SUPERPOSITION_HEXBIT = AXIOMS.find((row) => row.name === 'hexbit')!.value
/** Every UUID superposition this toolbox answers: the six neighbour leads, the harmonic enum space, every RFC schema reading at once, the qubit register and its exchange, and the combination spaces held without storing a composition. Pure: nothing fetched, nothing walked. */
type UuidSuperposition = { id: string; surface: string; tool: 'fold'; arguments: Record<string, unknown>; says: string; directions?: number; combinations?: string }
export const uuidSuperpositions = (address = SUPERPOSITION_ADDRESS, width = SUPERPOSITION_HEXBIT) => {
  const around = neighbours(address)
  const team = navigate(address)
  const rotated = next(address)
  const counted = uuidQubits(width)
  const moved = hexbit(address, width)
  const laid = organiseQubits(address, width)
  const booked = coins([address, 'rodin', address])
  const harmonic = harmonicDefaults({ properties: { style: { enum: ['nova', 'lyra', 'maia'] }, theme: { enum: ['neutral', 'stone', 'zinc', 'gray'] }, radius: { enum: ['0', '0.3', '0.5', '0.75', '1'] } } })
  const spaces = COMBINATORICS.map((s) => ({ name: s.name, count: compositions(s.radices).toString() }))
  const grid = rosetta([6, 7])
  const streamed = stream([address, '016da774-e74c-2e44-8742-f8bcf5e8e8f5', '00000000-0000-1000-8000-000000000000'], { where: { nibble: { at: 1, is: '0' } }, sort: 'hue', execute: true })
  const rows: UuidSuperposition[] = [
    { id: 'neighbours', surface: 'six neighbour superpositions', tool: 'fold', arguments: { neighbours: address }, says: PROSE.quantumProcessingCryptoIndex_says4, directions: around.neighbours.length },
    { id: 'navigate', surface: 'neighbourhood team', tool: 'fold', arguments: { navigate: address }, says: PROSE.quantumProcessingCryptoIndex_says5, directions: team.neighbours.length },
    { id: 'next', surface: 'program rotation', tool: 'fold', arguments: { next: address }, says: PROSE.quantumProcessingCryptoIndex_says6 },
    { id: 'harmonic', surface: 'enum superposition', tool: 'fold', arguments: { harmonic: { schema: { properties: { style: { enum: ['nova', 'lyra', 'maia'] }, theme: { enum: ['neutral', 'stone', 'zinc', 'gray'] }, radius: { enum: ['0', '0.3', '0.5', '0.75', '1'] } } } } }, says: PROSE.quantumProcessingCryptoIndex_says7, combinations: harmonic.count.toString() },
    { id: 'stream', surface: 'UUID stream superposition', tool: 'fold', arguments: { uuids: [address, '016da774-e74c-2e44-8742-f8bcf5e8e8f5', '00000000-0000-1000-8000-000000000000'], query: { where: { nibble: { at: 1, is: '0' } }, sort: 'hue', execute: true } }, says: PROSE.quantumProcessingCryptoIndex_says8, combinations: String(streamed.stream) },
    { id: 'rosetta', surface: 'dual-axis superposition', tool: 'fold', arguments: { rosetta: [6, 7], index: '20' }, says: PROSE.quantumProcessingCryptoIndex_says9, combinations: grid.scale.toString() },
    { id: 'combinatorics', surface: 'combination-space superposition', tool: 'fold', arguments: { combinatorics: true }, says: PROSE.quantumProcessingCryptoIndex_says10, combinations: spaces.find((s) => s.name === 'queneau')!.count },
    { id: 'spaces', surface: 'named spaces at once', tool: 'fold', arguments: { spaces: Object.fromEntries(COMBINATORICS.map((s) => [s.name, [...s.radices]])) }, says: PROSE.quantumProcessingCryptoIndex_says11, combinations: String(spaces.length) },
    { id: 'qubits', surface: 'UUID qubit register', tool: 'fold', arguments: { qubits: width }, says: PROSE.quantumProcessingCryptoIndex_says12, combinations: counted.handles.possible },
    { id: 'exchange', surface: 'qubit exchange', tool: 'fold', arguments: { exchange: { address, hexbit: width } }, says: PROSE.quantumProcessingCryptoIndex_says13, directions: moved.navigate.directions },
    { id: 'organise', surface: 'organised qubit trinities', tool: 'fold', arguments: { organise: { address, hexbit: width } }, says: PROSE.quantumProcessingCryptoIndex_says14 },
    { id: 'coins', surface: 'coins by address', tool: 'fold', arguments: { coins: [address, 'rodin', address] }, says: PROSE.quantumProcessingCryptoIndex_says15, combinations: String(booked.count) },
  ]
  const holds =
    around.neighbours.length === 6 && around.neighbours.every((n) => n.sealed) &&
    team.neighbours.length === 6 &&
    rotated.places === 10 &&
    harmonic.count === 60n &&
    streamed.filtered === 1 &&
    grid.scale === 42n &&
    counted.delivery.holds === true && counted.delivery.leads.length === 6 && counted.delivery.leads.every((lead) => lead.sealed) &&
    moved.receipt.holds === true && moved.navigate.directions === 6 &&
    laid.holds === true &&
    booked.sealed === true && booked.count === 2 &&
    rows.length === 12
  return {
    phase: 'superpositions' as const, address, hexbit: width, scenarios: rows, superpositions: rows.length,
    neighbours: around.neighbours.length, combinations: harmonic.count.toString(),
    qubits: { effective: counted.effective, leads: counted.delivery.leads.length, holds: counted.delivery.holds },
    coins: { count: booked.count },
    fetched: false as const, written: false as const, walked: false as const, holds,
    theorems: ['textbook_neighbour_step', 'textbook_harmonic_default', 'textbook_mixed_radix', 'textbook_queneau_compositions', 'textbook_coil_green'] as const,
    says: holds
      ? proseFill(PROSE.quantumProcessingCryptoIndex_s16, rows.length, address, counted.effective)
      : PROSE.quantumProcessingCryptoIndex_s17,
  }
}

/** Every UUID superposition in reverse: the step back, the reflection twice, the transpose of the transpose, the index of the digits — each surface returns to the address it started from. Pure: nothing fetched, nothing walked. */
export const uuidSuperpositionsReverse = (address = SUPERPOSITION_ADDRESS, width = SUPERPOSITION_HEXBIT) => {
  const here = channel(address)
  const around = neighbours(address)
  const neighbourBack = around.neighbours.map((step) => {
    const back = neighbours(step.uuid).neighbours.find((m) => m.axis === step.axis && m.step === -step.step)
    const program = back ? channel(back.uuid).program : null
    return { axis: step.axis, step: step.step, out: step.uuid, back: back?.uuid ?? null, returns: !!program && program.join() === here.program.join(), sealed: step.sealed && (back?.sealed ?? false) }
  })
  const team = navigate(address)
  const navigateBack = team.neighbours.every((step) => {
    const back = neighbours(step.uuid).neighbours.find((m) => m.axis === step.axis && m.step === -step.step)
    return !!back && channel(back.uuid).program.join() === here.program.join()
  })
  const rotated = next(address)
  const nextBack = rotated.back === true && rotated.around === true && next(rotated.next).back === true
  const harmonic = harmonicDefaults({ properties: { style: { enum: ['nova', 'lyra', 'maia'] }, theme: { enum: ['neutral', 'stone', 'zinc', 'gray'] }, radius: { enum: ['0', '0.3', '0.5', '0.75', '1'] } } })
  const harmonicRadices = [3, 4, 5]
  const harmonicDigits = composition(harmonicRadices, harmonic.index)
  const harmonicBack = compositionIndex(harmonicRadices, harmonicDigits) === harmonic.index && harmonic.index === 12n
  const streamed = stream([address, '016da774-e74c-2e44-8742-f8bcf5e8e8f5', '00000000-0000-1000-8000-000000000000'], { where: { nibble: { at: 1, is: '0' } }, sort: 'hue', execute: true })
  const streamRow = streamed.rows[0]!
  const streamBack = streamed.filtered === 1 && next(streamRow.uuid).back === true
  const grid = rosetta([6, 7])
  const mid = 20n
  const rosettaBack = grid.from(grid.to(mid)) === mid && grid.to(grid.from(grid.to(mid))) === grid.to(mid) && grid.scale === 42n
  const queneau = COMBINATORICS.find((s) => s.name === 'queneau')!
  const last = compositions(queneau.radices) - 1n
  const lastDigits = composition(queneau.radices, last)
  const combinatoricsBack = compositionIndex(queneau.radices, lastDigits) === last && lastDigits.every((d) => d === 9)
  const spacesBack = COMBINATORICS.every((s) => {
    const count = compositions(s.radices)
    const sample = count > 1n ? count - 1n : 0n
    return compositionIndex(s.radices, composition(s.radices, sample)) === sample
  })
  const counted = uuidQubits(width)
  const qubitsBack = counted.delivery.cross.roundTrip === true && counted.delivery.holds === true
  const moved = hexbit(address, width)
  const exchangeBack = moved.signal.holds === true && moved.signal.rows.every((row) => row.holds && row.digit + row.to === 15) && moved.navigate.directions === 6 && neighbourBack.every((row) => row.returns)
  const laid = organiseQubits(address, width)
  const organiseBack = laid.holds === true && laid.fingerprint.index === BigInt(`0x${laid.handle}`).toString() && (laid.combination.hex.length === 0 || composition(Array.from({ length: laid.combination.hex.length }, () => 16), BigInt(`0x${laid.combination.hex}`)).every((n, i) => n === parseInt(laid.combination.hex[i]!, 16)))
  const booked = coins([address, 'rodin', address])
  const again = coins(booked.coins)
  const coinsBack = booked.sealed === true && booked.count === 2 && again.count === booked.count && again.coins.every((id, i) => id === booked.coins[i]) 
  const rows = [
    { id: 'neighbours', reverse: PROSE.quantumProcessingCryptoIndex_reverse18, returns: neighbourBack.every((row) => row.returns && row.sealed), of: neighbourBack.length },
    { id: 'navigate', reverse: PROSE.quantumProcessingCryptoIndex_reverse19, returns: navigateBack, of: team.neighbours.length },
    { id: 'next', reverse: PROSE.quantumProcessingCryptoIndex_reverse20, returns: nextBack, of: rotated.places },
    { id: 'harmonic', reverse: 'digits make the index', returns: harmonicBack, of: Number(harmonic.count) },
    { id: 'stream', reverse: 'executed next steps back', returns: streamBack, of: streamed.stream },
    { id: 'rosetta', reverse: 'transpose of the transpose', returns: rosettaBack, of: Number(grid.scale) },
    { id: 'combinatorics', reverse: 'last composition indexes itself', returns: combinatoricsBack, of: 14 },
    { id: 'spaces', reverse: 'each space indexes itself', returns: spacesBack, of: COMBINATORICS.length },
    { id: 'qubits', reverse: PROSE.quantumProcessingCryptoIndex_reverse21, returns: qubitsBack, of: counted.delivery.leads.length },
    { id: 'exchange', reverse: PROSE.quantumProcessingCryptoIndex_reverse22, returns: exchangeBack, of: moved.signal.digits },
    { id: 'organise', reverse: 'combination digits read as index', returns: organiseBack, of: laid.combination.digits },
    { id: 'coins', reverse: 'merge is idempotent', returns: coinsBack, of: booked.count },
  ] as const
  const holds = rows.length === 12 && rows.every((row) => row.returns)
  return {
    phase: 'superpositions-reverse' as const, address, hexbit: width, direction: 'reverse' as const,
    scenarios: rows, superpositions: rows.length, reversed: rows.filter((row) => row.returns).length,
    neighbours: neighbourBack, fetched: false as const, written: false as const, walked: false as const, holds,
    theorems: ['textbook_neighbour_step', 'textbook_harmonic_default', 'textbook_mixed_radix', 'textbook_queneau_compositions', 'textbook_coil_green'] as const,
    says: holds
      ? proseFill(PROSE.quantumProcessingCryptoIndex_s23, rows.length, address)
      : proseFill(PROSE.quantumProcessingCryptoIndex_s24, rows.filter((row) => !row.returns).map((row) => row.id).join(', ') || 'none'),
  }
}


/** HKDF-SHA256 (RFC 5869): the one extract and expand. A salt of no bytes is the hash length of zeros. */
export const deriveHkdf = (ikm: Uint8Array, salt: Uint8Array, info: Uint8Array, length = 32): Uint8Array => hkdfExpand(hkdfExtract(salt, ikm), info, length)
export const fromHex = (raw: string, what: string): Uint8Array => {
  const t = raw.trim().toLowerCase()
  if (!/^[0-9a-f]*$/.test(t) || t.length % 2) throw new Error(`${what} is hex`)
  return Uint8Array.from((t.match(/../g) ?? []).map((b) => parseInt(b, 16)))
}
/** X25519 Diffie–Hellman (RFC 7748 §6.1): a 32-byte scalar and a 32-byte point as hex yield the shared secret; the RFC 7748 Alice×Bob vector is the known answer. */
export const exchangeX25519 = (raw: unknown) => {
  const a = (isObj(raw) ? raw : {}) as { scalar?: string; point?: string }
  if (typeof a.scalar !== 'string' || typeof a.point !== 'string') throw new Error('x25519 takes { scalar, point } as hex')
  const scalar = fromHex(a.scalar, 'scalar'), point = fromHex(a.point, 'point')
  if (scalar.length !== 32 || point.length !== 32) throw new Error(PROSE.quantumProcessingCryptoIndex_s25)
  return { phase: 'x25519' as const, rfc: 7748 as const, shared: hex(x25519(scalar, point)), sizes: { scalar: 32, point: 32, shared: 32 } }
}
/** PBKDF2-HMAC-SHA256 (RFC 8018 / NIST SP 800-132): a password stretched under a salt by `iterations` rounds to `length` bytes (default 32). Password and salt are utf-8 text, or hex when `hex: true`. */
export const derivePbkdf2 = (raw: unknown) => {
  const a = (isObj(raw) ? raw : {}) as { password?: string; salt?: string; iterations?: number; length?: number; hex?: boolean }
  if (typeof a.password !== 'string' || typeof a.salt !== 'string') throw new Error(PROSE.quantumProcessingCryptoIndex_s26)
  if (!Number.isInteger(a.iterations) || (a.iterations as number) < 1) throw new Error('iterations is a positive integer')
  const length = a.length === undefined ? 32 : a.length
  if (!Number.isInteger(length) || length < 1) throw new Error('length is a positive integer')
  const password = a.hex === true ? fromHex(a.password, 'password') : utf8(a.password)
  const salt = a.hex === true ? fromHex(a.salt, 'salt') : utf8(a.salt)
  return { phase: 'pbkdf2' as const, kdf: 'PBKDF2-HMAC-SHA256' as const, rfc: 8018 as const, iterations: a.iterations, length, derived: hex(pbkdf2Sha256(password, salt, a.iterations as number, length)) }
}
// The stale-receipt finder: each recorded receipt (uuidna's merkleGravity over addresses) recomputed under the current fold, then under each earlier
// one; reproduced by an earlier fold it is stale (the fold's history, reseal), by none wrong. uuidna's mint is ported, so nothing is fetched or read.
const mul32 = (a: number, b: number): number => { a >>>= 0; b >>>= 0; return (((a & 0xffff) * b) + ((((a >>> 16) * b) & 0xffff) * 65536)) >>> 0 }
const fmix32 = (h: number): number => { h = mul32(h ^ (h >>> 16), 0x85ebca6b); h = mul32(h ^ (h >>> 13), 0xc2b2ae35); return (h ^ (h >>> 16)) >>> 0 }
/** uuidna's toUuid: FNV-1a over four 32-bit lanes seeded 0, φ, π, e, each finalised by fmix32, the RFC 4122 version and variant bits stamped (122 bits of the 128 carry entropy). toUuid('coins:2') = 1d258da4-cbdf-8e22-890e-a68b5592fe86. */
const uuidnaAddress = (seed: string): string => {
  const lanes = [0, 0x9e3779b9, 0x243f6a88, 0xb7e15162].map((s) => (0x811c9dc5 ^ s) >>> 0)
  for (let i = 0; i < seed.length; i++) { const x = seed.charCodeAt(i); for (let l = 0; l < 4; l++) { const h = mul32(lanes[l]! ^ x, 0x01000193); lanes[l] = (h ^ (h >>> 13)) >>> 0 } }
  const b: number[] = []
  for (const w of lanes.map(fmix32)) b.push((w >>> 24) & 0xff, (w >>> 16) & 0xff, (w >>> 8) & 0xff, w & 0xff)
  b[6] = (b[6]! & 0x0f) | 0x80
  b[8] = (b[8]! & 0x3f) | 0x80
  const h = b.map((v) => v.toString(16).padStart(2, '0')).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}
/** uuidna's merkleGravity under a leaf rule: leaves sorted, paired left to right, a lone leaf carried up, a pair merged as toUuid('a:b'), no leaves toUuid('empty-mind'). */
const receiptFold = (leaves: readonly string[], leaf: (x: string) => string): string => {
  let layer = [...leaves].sort().map(leaf)
  if (layer.length === 0) return uuidnaAddress('empty-mind')
  while (layer.length > 1) {
    const next: string[] = []
    for (let i = 0; i < layer.length; i += 2) { const a = layer[i]!, b = layer[i + 1]; next.push(b === undefined ? a : uuidnaAddress(`${a}:${b}`)) }
    layer = next
  }
  return layer[0]!
}
/** The folds merkleGravity has been, the current one first. */
const RECEIPT_FOLDS: readonly { id: string; change: string; leaf: (x: string) => string }[] = [
  { id: 'uuidna-0a4c4e9d87', change: PROSE.quantumProcessingCryptoIndex_change27, leaf: (x) => uuidnaAddress(`leaf:${x}`) },
  { id: 'uuidna-untagged', change: PROSE.quantumProcessingCryptoIndex_change28, leaf: (x) => x },
]
type ReceiptRow = { id: string; leaves: string[]; recorded: string; computed: string; verdict: 'holds' | 'stale' | 'wrong'; fold: string | null; change: string | null; says: string }
export const findStaleReceipts = (raw: unknown) => {
  if (!Array.isArray(raw)) throw new Error(PROSE.quantumProcessingCryptoIndex_s29)
  const [current, ...earlier] = RECEIPT_FOLDS as [typeof RECEIPT_FOLDS[number], ...typeof RECEIPT_FOLDS[number][]]
  const rows: ReceiptRow[] = raw.map((r, i) => {
    if (!isObj(r) || !Array.isArray(r.leaves) || typeof r.recorded !== 'string') throw new Error(proseFill(PROSE.quantumProcessingCryptoIndex_s30, i))
    const leaves = (r.leaves as unknown[]).map((x, j) => {
      if (typeof x === 'string') return x
      if (isObj(x) && typeof x.seed === 'string') return uuidnaAddress(x.seed)
      throw new Error(proseFill(PROSE.quantumProcessingCryptoIndex_s31, i, j))
    })
    const id = typeof r.id === 'string' ? r.id : String(i), recorded = r.recorded
    const computed = receiptFold(leaves, current.leaf)
    if (computed === recorded) return { id, leaves, recorded, computed, verdict: 'holds', fold: current.id, change: null, says: `recomputes under ${current.id}` }
    const stale = earlier.find((f) => receiptFold(leaves, f.leaf) === recorded)
    if (stale) return { id, leaves, recorded, computed, verdict: 'stale', fold: stale.id, change: current.change, says: proseFill(PROSE.quantumProcessingCryptoIndex_says32, stale.id, recorded, current.id, computed, current.id) }
    return { id, leaves, recorded, computed, verdict: 'wrong', fold: null, change: null, says: proseFill(PROSE.quantumProcessingCryptoIndex_says33, leaves.length, recorded, current.id, computed) }
  })
  const count = (v: ReceiptRow['verdict']) => rows.filter((r) => r.verdict === v).length
  const holds = count('holds'), stale = count('stale'), wrong = count('wrong')
  return { phase: 'receipts' as const, receipts: rows.length, holds, stale, wrong, invalidated: rows.filter((r) => r.verdict !== 'holds').map((r) => r.id), folds: RECEIPT_FOLDS.map(({ id, change }) => ({ id, change })), rows, theorems: ['textbook_receipts_partitioned'] as const, says: proseFill(PROSE.quantumProcessingCryptoIndex_says34, rows.length, rows.length === 1 ? '' : 's', current.id, holds, stale, wrong, holds, stale, wrong, rows.length) }
}

/** RFC 6962 Merkle tree over SHA-256 (the Certificate Transparency log the attest tool reads): leaves as hex or utf-8 text; the root; an inclusion proof at an index; or verify { leaf, proof, root }. */
export const merkleTree = (raw: unknown) => {
  const a = (isObj(raw) ? raw : {}) as { leaves?: unknown; index?: number; leaf?: string; proof?: unknown; root?: string; hex?: boolean }
  const decode = (s: string, what: string) => (a.hex === true ? fromHex(s, what) : utf8(s))
  if (typeof a.leaf === 'string' && Array.isArray(a.proof) && typeof a.root === 'string') {
    const proof = (a.proof as { hash?: string; right?: boolean }[]).map((s, i) => {
      if (typeof s?.hash !== 'string' || typeof s.right !== 'boolean') throw new Error(`proof[${i}] is { hash, right }`)
      return { hash: fromHex(s.hash, `proof[${i}].hash`), right: s.right }
    })
    const leaf = decode(a.leaf, 'leaf'), root = fromHex(a.root, 'root')
    const verified = merkleVerify(leaf, proof, root)
    return { phase: 'merkle' as const, rfc: 6962 as const, direction: 'verify' as const, verified, leaf: hex(merkleLeafHash(leaf)), root: hex(root), proof: proof.map((s) => ({ hash: hex(s.hash), right: s.right })) }
  }
  if (!Array.isArray(a.leaves)) throw new Error(PROSE.quantumProcessingCryptoIndex_s35)
  const leaves = (a.leaves as unknown[]).map((x, i) => {
    if (typeof x !== 'string') throw new Error(`leaves[${i}] is a string`)
    return decode(x, `leaves[${i}]`)
  })
  const root = merkleRoot(leaves)
  if (a.index === undefined) return { phase: 'merkle' as const, rfc: 6962 as const, direction: 'root' as const, leaves: leaves.length, root: hex(root), empty: leaves.length === 0 }
  if (!Number.isInteger(a.index) || (a.index as number) < 0 || (a.index as number) >= leaves.length) throw new Error(`index is in 0..${Math.max(0, leaves.length - 1)}`)
  const index = a.index as number
  const proof = merkleProof(leaves, index)
  const verified = merkleVerify(leaves[index]!, proof, root)
  return { phase: 'merkle' as const, rfc: 6962 as const, direction: 'proof' as const, leaves: leaves.length, index, root: hex(root), leaf: hex(merkleLeafHash(leaves[index]!)), proof: proof.map((s) => ({ hash: hex(s.hash), right: s.right })), verified }
}
/** AES-256-GCM and ChaCha20-Poly1305, both ways. A seal returns the ciphertext and the tag. An open checks the tag first and returns the text, or nothing. */
export const aead = (raw: unknown) => {
  const a = (isObj(raw) ? raw : {}) as { cipher?: string; key?: string; nonce?: string; text?: string; aad?: string; open?: { ciphertext?: string; tag?: string } }
  const cipher = a.cipher === 'aes-256-gcm' || a.cipher === 'chacha20-poly1305' ? a.cipher : null
  if (!cipher) throw new Error(PROSE.quantumProcessingCryptoIndex_s36)
  if (typeof a.key !== 'string' || typeof a.nonce !== 'string') throw new Error(PROSE.quantumProcessingCryptoIndex_s37)
  const key = fromHex(a.key, 'key'), nonce = fromHex(a.nonce, 'nonce'), aad = typeof a.aad === 'string' ? utf8(a.aad) : new Uint8Array(0)
  const open = isObj(a.open) ? a.open : null
  if (open) {
    if (typeof open.ciphertext !== 'string' || typeof open.tag !== 'string') throw new Error(PROSE.quantumProcessingCryptoIndex_s38)
    const ciphertext = fromHex(open.ciphertext, 'ciphertext'), tag = fromHex(open.tag, 'tag')
    const plain = cipher === 'aes-256-gcm' ? aes256gcmDecrypt(key, nonce, ciphertext, tag, aad) : chacha20poly1305Decrypt(key, nonce, ciphertext, tag, aad)
    const text = plain ? new TextDecoder('utf-8').decode(plain) : null
    return { phase: 'aead' as const, cipher, direction: 'open' as const, verified: plain !== null, plain: plain ? hex(plain) : null, text: plain ? text : null }
  }
  if (typeof a.text !== 'string') throw new Error(PROSE.quantumProcessingCryptoIndex_s39)
  const sealed = cipher === 'aes-256-gcm' ? aes256gcmEncrypt(key, nonce, utf8(a.text), aad) : chacha20poly1305Encrypt(key, nonce, utf8(a.text), aad)
  return { phase: 'aead' as const, cipher, direction: 'seal' as const, ciphertext: hex(sealed.ciphertext), tag: hex(sealed.tag), plain: hex(utf8(a.text)) }
}

/** Seeds bound to their referer: chunk i is HKDF(secret, salt = the referer's sixteen bytes, info = 'qpu referer seed i'), recomputed from the
 * secret and the referer alone. The referer is public, so it adds no entropy: every bit comes from the secret; it binds the seed to its chain. */
export const deriveRefererSeeds = (referer: unknown, key: unknown) => {
  const { address, chunks = 1 } = (isObj(referer) ? referer : { address: referer }) as { address?: unknown; chunks?: unknown }
  if (typeof address !== 'string' || !isUuid(address)) throw new Error(PROSE.quantumProcessingCryptoIndex_s40)
  if (!Number.isInteger(chunks) || (chunks as number) < 1) throw new Error(PROSE.quantumProcessingCryptoIndex_s41)
  const salt = Uint8Array.from((address.split('-').join('').match(/../g) ?? []).map((h) => parseInt(h, 16))), infos = Array.from({ length: chunks as number }, (_, i) => 'qpu referer seed ' + i)
  const ikm = typeof key === 'string' ? utf8(key) : null, secretBits = ikm ? Math.min(256, ikm.length * 8) : 256
  return { kdf: 'HKDF-SHA256 (RFC 5869)', salt: address, infos, bytesPerChunk: 32, executedBy: ikm ? 'here, under a test key' : 'host', keyVar: PROSE.quantumProcessingCryptoIndex_keyVar42, ...(ikm ? { seeds: infos.map((i) => hex(deriveHkdf(ikm, salt, utf8(i)))) } : {}), entropy: { secretBits, refererBits: 0, totalBits: secretBits, says: PROSE.quantumProcessingCryptoIndex_says43 }, binds: PROSE.quantumProcessingCryptoIndex_binds44, recomputedFrom: ['the secret', 'the referer address', 'the chunk index'], theorem: 'textbook_referer_binds_not_entropy' }
}

/** A glTF 2.0 asset read as Unreal Engine reads it. */
const GLB_MAGIC = 0x46546c67, GLB_JSON = 0x4e4f534a, GLB_BIN = 0x004e4942
export const getGltf = (g: { glb64?: string; json?: unknown }, supported: readonly string[]) => {
  let doc: Record<string, any> | null = null, bin = 0, why: string | null = null
  if (typeof g.glb64 === 'string') { const b = Uint8Array.from(atob(g.glb64), (c) => c.charCodeAt(0)), v = new DataView(b.buffer)
    if (b.length < 20 || v.getUint32(0, true) !== GLB_MAGIC) why = PROSE.quantumProcessingCryptoIndex_s45
    else if (v.getUint32(4, true) !== 2) why = `a .glb of container version ${v.getUint32(4, true)}, not 2`
    else if (v.getUint32(8, true) !== b.length) why = proseFill(PROSE.quantumProcessingCryptoIndex_s46, v.getUint32(8, true), b.length)
    else for (let at = 12; at + 8 <= b.length;) { const len = v.getUint32(at, true), type = v.getUint32(at + 4, true); if (type === GLB_JSON && !doc) doc = JSON.parse(new TextDecoder().decode(b.subarray(at + 8, at + 8 + len))); else if (type === GLB_BIN) bin = len; at += 8 + len } }
  else if (isObj(g.json)) doc = g.json as Record<string, any>
  if (!why && !doc) why = PROSE.quantumProcessingCryptoIndex_s47
  if (!why && String(doc?.asset?.version) !== '2.0') why = `glTF ${doc?.asset?.version ?? 'without a version'}: only 2.0 is read`
  if (why) return { phase: 'gltf' as const, loadable: false, why, theorem: 'textbook_gltf_required_extensions' }
  const count = (k: string) => (Array.isArray(doc![k]) ? doc![k].length : 0), used: string[] = doc!.extensionsUsed ?? [], required: string[] = doc!.extensionsRequired ?? []
  const prefix = (e: string) => (e.startsWith('KHR_') ? 'khronos' : e.startsWith('EXT_') ? 'multi-vendor' : 'vendor'), missing = required.filter((e) => !supported.includes(e))
  const external = [...(doc!.buffers ?? []), ...(doc!.images ?? [])].map((x: { uri?: string }) => x.uri).filter((u): u is string => typeof u === 'string' && !u.startsWith('data:'))
  return { phase: 'gltf' as const, format: g.glb64 ? 'glb' : 'gltf', version: '2.0', generator: doc!.asset?.generator ?? null, counts: Object.fromEntries(['scenes', 'nodes', 'meshes', 'materials', 'animations', 'skins', 'textures', 'images', 'buffers'].map((k) => [k, count(k)])), binBytes: bin, external, extensions: used.map((e) => ({ name: e, prefix: prefix(e), required: required.includes(e), supported: supported.includes(e) })), loadable: missing.length === 0, why: missing.length ? proseFill(PROSE.quantumProcessingCryptoIndex_s48, missing.join(', ')) : null, theorem: 'textbook_gltf_required_extensions' }
}

/** Derived hosts from a Payload MCP / tenant crypto config. */
export const cryptoHosts = (config: CryptoConfig) => {
  const hosts = cfgHosts(config)
  const cern = new URL(cfgAttest(config, 'cern-opendata').url).host
  const beacon = new URL(cfgAttest(config, 'nist-beacon').url).host
  return { qpu: hosts[0]!, cern, beacon, attest: [...hosts, cern, beacon] as const }
}

/** Every NIST surface this toolbox answers: FIPS digests and signatures, PQC parameter sets, SP 800-132, CODATA, the attest APIs, and NIST Open Data. Pure: the client fetches; nothing is walked here. */
type NistScenario = {
  id: string
  standard: string
  tool: 'fold' | 'seal' | 'attest'
  arguments: Record<string, unknown>
  says: string
  request?: { id: string; method: 'GET'; url: string; accept: string }
  live?: { id: string; host: string; port: 443 }
}
/** NIST SP 800-38D known-answer vector (not a site constant). */
const AES_GCM_VECTOR = { cipher: 'aes-256-gcm' as const, key: '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f', nonce: '000102030405060708090a0b', text: 'functional', aad: 'both' }
export const nistScenarios = (config: CryptoConfig, hosts: readonly string[] = cryptoHosts(config).attest.slice(0, 1)): { phase: 'nist'; host: string; scenarios: NistScenario[]; standards: string[]; tools: readonly string[]; requests: { id: string; method: 'GET'; url: string; accept: string }[]; liveCertificates: { id: string; host: string; port: 443 }[]; fetched: false; written: false; holds: boolean; theorems: readonly string[]; says: string } => {
  const ATTEST_APIS = config.attestApis
  const CODATA_URL = config.codataUrl
  const host = hosts[0] ?? cryptoHosts(config).qpu
  const scenarios: NistScenario[] = [
    { id: 'fips-180-4', standard: 'FIPS 180-4', tool: 'seal', arguments: { text: 'nist', fips180: true }, says: PROSE.quantumProcessingCryptoIndex_says59 },
    { id: 'fips-186-5-ecdsa', standard: 'FIPS 186-5', tool: 'seal', arguments: { text: 'nist', ecdsa: true }, says: PROSE.quantumProcessingCryptoIndex_says60 },
    { id: 'fips-202-sha3', standard: 'FIPS 202', tool: 'seal', arguments: { text: 'nist', sha3: true }, says: PROSE.quantumProcessingCryptoIndex_says61 },
    { id: 'fips-202-shake', standard: 'FIPS 202', tool: 'seal', arguments: { text: 'nist', shake: true }, says: PROSE.quantumProcessingCryptoIndex_says62 },
    ...(['ML-KEM-512', 'ML-KEM-768', 'ML-KEM-1024'] as const).map((kem) => ({ id: `fips-203-${kem}`, standard: 'FIPS 203', tool: 'seal' as const, arguments: { kem }, says: proseFill(PROSE.quantumProcessingCryptoIndex_says63, kem) })),
    ...(['ML-DSA-44', 'ML-DSA-65', 'ML-DSA-87'] as const).map((sign) => ({ id: `fips-204-${sign}`, standard: 'FIPS 204', tool: 'seal' as const, arguments: { text: 'nist', sign }, says: proseFill(PROSE.quantumProcessingCryptoIndex_says64, sign) })),
    ...(['SLH-DSA-SHA2-128s', 'SLH-DSA-SHA2-128f', 'SLH-DSA-SHA2-192s', 'SLH-DSA-SHA2-256s'] as const).map((slh) => ({ id: `fips-205-${slh}`, standard: 'FIPS 205', tool: 'seal' as const, arguments: { slh }, says: proseFill(PROSE.quantumProcessingCryptoIndex_says65, slh) })),
    { id: 'sp-800-132-pbkdf2', standard: 'NIST SP 800-132', tool: 'seal', arguments: { pbkdf2: { password: 'password', salt: 'salt', iterations: 1, length: 32 } }, says: PROSE.quantumProcessingCryptoIndex_says66 },
    { id: 'sp-800-38d-aes-gcm', standard: 'NIST SP 800-38D', tool: 'seal', arguments: { aead: { ...AES_GCM_VECTOR } }, says: PROSE.quantumProcessingCryptoIndex_says67 },
    { id: 'codata', standard: 'CODATA', tool: 'seal', arguments: { constants: true }, says: PROSE.quantumProcessingCryptoIndex_says68, request: { id: 'codata', method: 'GET', url: CODATA_URL, accept: 'text/plain' } },
    { id: 'nist-opendata', standard: 'NIST Open Data', tool: 'attest', arguments: { op: 'experience', nist: true }, says: PROSE.quantumProcessingCryptoIndex_says69, request: { id: 'nist-opendata', method: 'GET', url: 'https://data.nist.gov/rmm/records?page=0&size=5', accept: 'application/json' } },
    { id: 'attest-plan', standard: 'NIST attest', tool: 'attest', arguments: { op: 'plan', hosts: [...hosts] }, says: proseFill(PROSE.quantumProcessingCryptoIndex_says70, host) },
    ...ATTEST_APIS.filter((a) => a.open && !a.url.startsWith('tls://') && a.id !== 'crt-sh').map((a) => ({
      id: a.id, standard: a.name, tool: 'attest' as const, arguments: { op: 'read' as const }, says: a.measured,
      request: { id: a.id, method: 'GET' as const, url: a.url, accept: a.id === 'csrc-pqc' ? 'text/html' : 'application/json' },
    })),
    { id: 'crt-sh', standard: 'crt.sh', tool: 'attest', arguments: { op: 'read' }, says: `certificates logged for ${host}`, request: { id: 'crt-sh', method: 'GET', url: ATTEST_APIS.find((a) => a.id === 'crt-sh')!.url.replace('<host>', host), accept: 'application/json' } },
    ...hosts.map((h) => ({ id: `tls:${h}`, standard: 'TLS live', tool: 'attest' as const, arguments: { op: 'read' as const }, says: `live certificate of ${h}`, live: { id: `tls:${h}`, host: h, port: 443 as const } })),
  ]
  const requests = scenarios.flatMap((s) => (s.request ? [s.request] : []))
  const liveCertificates = scenarios.flatMap((s) => (s.live ? [s.live] : []))
  const standards = [...new Set(scenarios.map((s) => s.standard))]
  const holds = scenarios.length > 0 && requests.some((r) => r.id === 'nist-beacon') && liveCertificates.some((c) => c.host === host)
  return {
    phase: 'nist' as const, host, scenarios, standards, tools: ['kem', 'slh', 'ed25519', 'ecdsa', 'shake', 'sha3', 'fips180', 'pbkdf2', 'aead', 'constants', 'attest'] as const,
    requests, liveCertificates, fetched: false as const, written: false as const, holds,
    theorems: ['textbook_sha256_fips_180_4', 'textbook_sha3_fips_202', 'textbook_pqc_standards_three', 'textbook_precommitment_is_sha512', 'textbook_coil_green'] as const,
    says: proseFill(PROSE.quantumProcessingCryptoIndex_says71, scenarios.length, standards.length, requests.length, liveCertificates.length, host),
  }
}

type NistReverseRow = {
  id: string
  standard: string
  reverse: string
  returns: boolean
  of?: number
  request?: { id: string; method: 'GET'; url: string; accept: string }
  live?: { id: string; host: string; port: 443 }
  arguments?: Record<string, unknown>
  tool?: 'seal' | 'attest'
}
/** Every NIST scenario in reverse, pivoted through CERN: AES opens what it sealed, the Merkle proof verifies, digests and plans recompute the same answer, and the attest requests lead with CERN Open Data and the live certificate of opendata.cern.ch. Pure: nothing fetched. */
export const nistScenariosReverse = (config: CryptoConfig, hosts: readonly string[] = [cryptoHosts(config).cern]): { phase: 'nist-reverse'; direction: 'reverse'; via: 'cern'; host: string; scenarios: NistReverseRow[]; standards: string[]; reversed: number; requests: { id: string; method: 'GET'; url: string; accept: string }[]; liveCertificates: { id: string; host: string; port: 443 }[]; fetched: false; written: false; holds: boolean; theorems: readonly string[]; says: string } => {
  const ATTEST_APIS = config.attestApis
  const CODATA_URL = config.codataUrl
  const CERN_OPEN_DATA = cfgAttest(config, 'cern-opendata').url
  const host = hosts[0] ?? cryptoHosts(config).cern
  const message = utf8('nist')
  const digest = sha('nist')
  const fipsOnce = { sha1: hex(sha1(message)), sha256: digest, sha512: hex(sha512(message)) }
  const fipsAgain = { sha1: hex(sha1(message)), sha256: sha('nist'), sha512: hex(sha512(message)) }
  const fipsBack = fipsOnce.sha1 === fipsAgain.sha1 && fipsOnce.sha256 === fipsAgain.sha256 && fipsOnce.sha512 === fipsAgain.sha512 && fipsOnce.sha1.length === 40 && fipsOnce.sha256.length === 64 && fipsOnce.sha512.length === 128
  const ecdsa = dsaRound({ algorithm: 'ECDSA-P256', seed: '5a'.repeat(48) }, 'nist'), ecdsaBack = !!ecdsa.verified && !!ecdsa.refusesChanged && ecdsa.fips === '186-5' && ecdsa.publicKey.length === 2 * 65
  const sha3Once = { sha3_256: hex(sha3_256(message)), sha3_512: hex(sha3_512(message)) }
  const sha3Again = { sha3_256: hex(sha3_256(message)), sha3_512: hex(sha3_512(message)) }
  const sha3Back = sha3Once.sha3_256 === sha3Again.sha3_256 && sha3Once.sha3_512 === sha3Again.sha3_512 && sha3Once.sha3_256.length === 64 && sha3Once.sha3_512.length === 128
  const shakeOnce = { shake128: hex(shake128(message, 32)), shake256: hex(shake256(message, 64)) }
  const shakeAgain = { shake128: hex(shake128(message, 32)), shake256: hex(shake256(message, 64)) }
  const shakeBack = shakeOnce.shake128 === shakeAgain.shake128 && shakeOnce.shake256 === shakeAgain.shake256 && shakeOnce.shake128.length === 64 && shakeOnce.shake256.length === 128
  const kemRows = (['ML-KEM-512', 'ML-KEM-768', 'ML-KEM-1024'] as const).map((kem) => {
    const r = kemRound({ algorithm: kem, seed: '5a'.repeat(64) })
    return { id: `fips-203-${kem}`, standard: 'FIPS 203', reverse: proseFill(PROSE.quantumProcessingCryptoIndex_reverseKem, kem), returns: r.agrees && r.sizes.sharedSecret === 32 && r.cipherText.length === 2 * r.sizes.cipherText!, of: r.sizes.sharedSecret, tool: 'seal' as const, arguments: { kem } }
  })
  // a signature row verifies its own signature and refuses a changed message; SLH-DSA's 's' sets, seconds a signature, derive their key alone
  const signed = (algorithm: string, fips: string, reverse: string, args: Record<string, unknown>, seed?: string, signs = true) => {
    const r = dsaRound({ algorithm, seed }, signs ? 'nist' : undefined)
    return { id: `fips-${fips}-${algorithm}`, standard: `FIPS ${fips}`, reverse: proseFill(reverse, algorithm), returns: r.fips === +fips && r.publicKey.length === 2 * r.sizes.publicKey! && (!signs || (!!r.verified && !!r.refusesChanged && r.signature?.length === 2 * r.sizes.signature!)), of: r.sizes.signature!, tool: 'seal' as const, arguments: args }
  }
  const dsaRows = (['ML-DSA-44', 'ML-DSA-65', 'ML-DSA-87'] as const).map((sign) => signed(sign, '204', PROSE.quantumProcessingCryptoIndex_reverse73, { text: 'nist', sign }, '5a'.repeat(32)))
  const slhRows = (['SLH-DSA-SHA2-128s', 'SLH-DSA-SHA2-128f', 'SLH-DSA-SHA2-192s', 'SLH-DSA-SHA2-256s'] as const).map((slh) => signed(slh, '205', PROSE.quantumProcessingCryptoIndex_reverse72, { slh }, undefined, slh.endsWith('f')))
  const pbkdf = { password: 'password', salt: 'salt', iterations: 1, length: 32 }
  const derivedOnce = derivePbkdf2(pbkdf) as { derived: string }, derivedAgain = derivePbkdf2(pbkdf) as { derived: string }
  const pbkdfBack = derivedOnce.derived === derivedAgain.derived && derivedOnce.derived === '120fb6cffcf8b32c43e7225256c4f837a86548c92ccc35480805987cb70be17b'
  const sealed = aead({ ...AES_GCM_VECTOR }) as { ciphertext: string; tag: string }
  const opened = aead({ cipher: AES_GCM_VECTOR.cipher, key: AES_GCM_VECTOR.key, nonce: AES_GCM_VECTOR.nonce, aad: AES_GCM_VECTOR.aad, open: { ciphertext: sealed.ciphertext, tag: sealed.tag } }) as { verified: boolean; text: string | null }
  const aeadBack = opened.verified === true && opened.text === AES_GCM_VECTOR.text && sealed.ciphertext === '2177b878b18cad75ec2d'
  const proof = merkleTree({ leaves: ['a', 'b', 'c'], index: 1 }) as { verified: boolean; root: string; proof: { hash: string; right: boolean }[] }
  const verified = merkleTree({ leaf: 'b', proof: proof.proof, root: proof.root }) as { verified: boolean }
  const merkleBack = proof.verified === true && verified.verified === true && proof.root === '36642e73c2540ab121e3a6bf9545b0a24982cd830eb13d3cd19de3ce6c021ec1'
  const openApis = ATTEST_APIS.filter((a) => a.open && !a.url.startsWith('tls://') && a.id !== 'crt-sh')
  // CERN first, then the remaining open APIs in reverse of the NIST-first order
  const attestOrder = [openApis.find((a) => a.id === 'cern-opendata')!, ...[...openApis].filter((a) => a.id !== 'cern-opendata').reverse()]
  const local: NistReverseRow[] = [
    { id: 'fips-180-4', standard: 'FIPS 180-4', reverse: PROSE.quantumProcessingCryptoIndex_reverse74, returns: fipsBack, of: 3, tool: 'seal', arguments: { text: 'nist', fips180: true } },
    { id: 'fips-186-5-ecdsa', standard: 'FIPS 186-5', reverse: PROSE.quantumProcessingCryptoIndex_reverse75, returns: ecdsaBack, of: ecdsa.sizes.signature!, tool: 'seal', arguments: { text: 'nist', ecdsa: true } },
    { id: 'fips-202-sha3', standard: 'FIPS 202', reverse: PROSE.quantumProcessingCryptoIndex_reverse76, returns: sha3Back, of: 2, tool: 'seal', arguments: { text: 'nist', sha3: true } },
    { id: 'fips-202-shake', standard: 'FIPS 202', reverse: PROSE.quantumProcessingCryptoIndex_reverse77, returns: shakeBack, of: 2, tool: 'seal', arguments: { text: 'nist', shake: true } },
    ...kemRows, ...dsaRows, ...slhRows,
    { id: 'sp-800-132-pbkdf2', standard: 'NIST SP 800-132', reverse: PROSE.quantumProcessingCryptoIndex_reverse78, returns: pbkdfBack, of: 32, tool: 'seal', arguments: { pbkdf2: pbkdf } },
    { id: 'sp-800-38d-aes-gcm', standard: 'NIST SP 800-38D', reverse: PROSE.quantumProcessingCryptoIndex_reverse79, returns: aeadBack, of: AES_GCM_VECTOR.text.length, tool: 'seal', arguments: { aead: { cipher: AES_GCM_VECTOR.cipher, key: AES_GCM_VECTOR.key, nonce: AES_GCM_VECTOR.nonce, aad: AES_GCM_VECTOR.aad, open: { ciphertext: sealed.ciphertext, tag: sealed.tag } } } },
    { id: 'rfc-6962-merkle', standard: 'RFC 6962', reverse: PROSE.quantumProcessingCryptoIndex_reverse80, returns: merkleBack, of: proof.proof.length, tool: 'seal', arguments: { merkle: { leaf: 'b', proof: proof.proof, root: proof.root } } },
    { id: 'codata', standard: 'CODATA', reverse: PROSE.quantumProcessingCryptoIndex_reverse81, returns: true, tool: 'seal', arguments: { constants: true }, request: { id: 'codata', method: 'GET', url: CODATA_URL, accept: 'text/plain' } },
    { id: 'cern-opendata', standard: 'CERN Open Data', reverse: PROSE.quantumProcessingCryptoIndex_reverse82, returns: true, tool: 'attest', arguments: { op: 'experience', cern: true }, request: { id: 'cern-opendata', method: 'GET', url: CERN_OPEN_DATA, accept: 'application/json' } },
    { id: 'attest-plan', standard: 'CERN attest', reverse: proseFill(PROSE.quantumProcessingCryptoIndex_says70, host), returns: true, tool: 'attest', arguments: { op: 'plan', hosts: [...hosts] } },
    ...attestOrder.filter((a) => a.id !== 'cern-opendata').map((a) => ({
      id: a.id, standard: a.name, reverse: a.measured, returns: true as const, tool: 'attest' as const, arguments: { op: 'read' as const },
      request: { id: a.id, method: 'GET' as const, url: a.url, accept: a.id === 'csrc-pqc' ? 'text/html' : 'application/json' },
    })),
    { id: 'crt-sh', standard: 'crt.sh', reverse: `certificates logged for ${host}`, returns: true, tool: 'attest', arguments: { op: 'read' }, request: { id: 'crt-sh', method: 'GET', url: ATTEST_APIS.find((a) => a.id === 'crt-sh')!.url.replace('<host>', host), accept: 'application/json' } },
    ...hosts.map((h) => ({ id: `tls:${h}`, standard: 'TLS live', reverse: `live certificate of ${h}`, returns: true as const, tool: 'attest' as const, arguments: { op: 'read' as const }, live: { id: `tls:${h}`, host: h, port: 443 as const } })),
  ]
  const scenarios = local
  const requests = [
    ...scenarios.filter((s) => s.request?.id === 'cern-opendata').map((s) => s.request!),
    ...scenarios.filter((s) => s.request && s.request.id !== 'cern-opendata').map((s) => s.request!),
  ]
  const liveCertificates = scenarios.flatMap((s) => (s.live ? [s.live] : []))
  const standards = [...new Set(scenarios.map((s) => s.standard))]
  const reversed = scenarios.filter((s) => s.returns).length
  const holds = scenarios.length > 0 && scenarios.every((s) => s.returns) && requests[0]?.id === 'cern-opendata' && liveCertificates.some((c) => c.host === host)
  return {
    phase: 'nist-reverse' as const, direction: 'reverse' as const, via: 'cern' as const, host, scenarios, standards, reversed,
    requests, liveCertificates, fetched: false as const, written: false as const, holds,
    theorems: ['textbook_sha256_fips_180_4', 'textbook_sha3_fips_202', 'textbook_pqc_standards_three', 'textbook_tree_size_positive', 'textbook_doi_well_formed', 'textbook_coil_green'] as const,
    says: holds
      ? proseFill(PROSE.quantumProcessingCryptoIndex_s83, scenarios.length, host, requests.length)
      : proseFill(PROSE.quantumProcessingCryptoIndex_s84, scenarios.filter((s) => !s.returns).map((s) => s.id).join(', ') || 'none'),
  }
}
export type AttestAnswer = { id: string; text: string; status?: number }
type Verdict = { theorem: string; passed: boolean; says: string }
const dayMs = 86_400_000
const b64len = (b64: string): number => { const s = b64.replace(/=+$/, ''); return Math.floor((s.length * 3) / 4) }
const ms = (d: string | undefined): number | null => (d ? Date.parse(d) : null)
/** The theorems verified over what each API answered, source by source; a follow-up names the request the next read needs (the beacon's previous pulse): the coordination of the combination. */
export const attestAnswers = (answers: readonly AttestAnswer[], now = 0): { sources: Record<string, { status: 'read' | 'unreadable' | 'absent'; facts: Record<string, unknown>; verdicts: Verdict[] }>; followUps: { id: string; url: string; accept: string }[]; checked: number; passed: number; violations: { source: string; theorem: string; says: string }[]; byTheorem: Record<string, { passed: number; failed: number }> } => {
  const byId = new Map(answers.map((a) => [a.id, a]))
  const sources: Record<string, { status: 'read' | 'unreadable' | 'absent'; facts: Record<string, unknown>; verdicts: Verdict[] }> = {}
  const followUps: { id: string; url: string; accept: string }[] = []
  const json = (id: string): unknown => { const a = byId.get(id); if (!a) return undefined; try { return JSON.parse(a.text) } catch { return null } }
  const src = (id: string, facts: Record<string, unknown>, verdicts: Verdict[], status: 'read' | 'unreadable' | 'absent' = 'read') => { sources[id] = { status, facts, verdicts } }
  const v = (theorem: string, passed: boolean, says: string): Verdict => ({ theorem, passed, says });
  // NIST beacon: the chain, the period, the precommitment (SHA-512 of the next local random value equals the previous pulse's precommitment), the widths
  { const last = json('nist-beacon') as { pulse?: Record<string, unknown> } | null | undefined
    if (last === undefined) src('nist-beacon', {}, [], 'absent'); else if (!last?.pulse) src('nist-beacon', {}, [], 'unreadable'); else {
      const p = last.pulse as { chainIndex: number; pulseIndex: number; timeStamp: string; period: number; localRandomValue: string; outputValue: string; signatureValue: string; precommitmentValue: string; listValues?: { type: string; value: string }[]; uri: string }
      const verdicts = [v('textbook_hash_bits', p.outputValue.length === 128, `outputValue ${p.outputValue.length} hex digits (512 bits)`), v('textbook_beacon_period', p.period === 60_000, `period ${p.period} ms`)]
      const prev = json('nist-beacon-previous') as { pulse?: Record<string, unknown> } | null | undefined
      const prevUri = p.uri.replace(/\/pulse\/\d+$/, `/pulse/${p.pulseIndex - 1}`)
      if (prev === undefined) followUps.push({ id: 'nist-beacon-previous', url: prevUri, accept: 'application/json' })
      else if (prev?.pulse) { const q = prev.pulse as typeof p; const previous = (p.listValues ?? []).find((x) => x.type === 'previous')?.value
        verdicts.push(v('textbook_chain_index_steps', p.pulseIndex === q.pulseIndex + 1, `pulse ${p.pulseIndex} follows ${q.pulseIndex}`), v('textbook_beacon_period', Date.parse(p.timeStamp) - Date.parse(q.timeStamp) === p.period, `${Date.parse(p.timeStamp) - Date.parse(q.timeStamp)} ms between the pulses`), v('textbook_chain_links_by_output', previous === q.outputValue, PROSE.quantumProcessingCryptoIndex_s85), v('textbook_precommitment_is_sha512', hex(sha512(new Uint8Array((p.localRandomValue.match(/../g) ?? []).map((x) => parseInt(x, 16))))).toUpperCase() === q.precommitmentValue.toUpperCase(), PROSE.quantumProcessingCryptoIndex_s86)) }
      src('nist-beacon', { chainIndex: p.chainIndex, pulseIndex: p.pulseIndex, timeStamp: p.timeStamp, previous: prev?.pulse ? (prev.pulse as { pulseIndex: number }).pulseIndex : null }, verdicts) } }
  // CT: the signed tree head
  { const j = json('ct-sth') as { tree_size?: number; timestamp?: number; sha256_root_hash?: string } | null | undefined
    if (j === undefined) src('ct-sth', {}, [], 'absent'); else if (!j || typeof j.tree_size !== 'number') src('ct-sth', {}, [], 'unreadable'); else src('ct-sth', { treeSize: j.tree_size, timestamp: j.timestamp }, [v('textbook_hash_bits', b64len(j.sha256_root_hash ?? '') === 32, `root hash ${b64len(j.sha256_root_hash ?? '')} bytes`), v('textbook_tree_size_positive', j.tree_size > 0, `tree size ${j.tree_size}`), ...(now ? [v('textbook_dates_ordered', (j.timestamp ?? 0) <= now, PROSE.quantumProcessingCryptoIndex_s87)] : [])]) }
  // ACME: the five resources of RFC 8555
  { const j = json('acme-directory') as Record<string, unknown> | null | undefined; const need = ['newNonce', 'newAccount', 'newOrder', 'revokeCert', 'keyChange']
    if (j === undefined) src('acme-directory', {}, [], 'absent'); else if (!j) src('acme-directory', {}, [], 'unreadable'); else src('acme-directory', { resources: need.filter((k) => k in j) }, [v('textbook_acme_resources_five', need.every((k) => typeof j[k] === 'string'), `${need.filter((k) => k in j).length} of the five resources`)]) }
  // NVD: every CVE's score bounded, its dates ordered, its id well formed
  { const j = json('nvd-cves') as { vulnerabilities?: { cve: { id: string; published: string; lastModified: string; metrics?: { cvssMetricV31?: { cvssData: { baseScore: number } }[] } } }[] } | null | undefined
    if (j === undefined) src('nvd-cves', {}, [], 'absent'); else if (!j?.vulnerabilities) src('nvd-cves', {}, [], 'unreadable'); else { const verdicts: Verdict[] = []
      for (const { cve } of j.vulnerabilities) { verdicts.push(v('textbook_cve_id_well_formed', /^CVE-\d{4}-\d{4,}$/.test(cve.id), cve.id), v('textbook_dates_ordered', (ms(cve.published) ?? 0) <= (ms(cve.lastModified) ?? 0), `${cve.id} published ${cve.published} ≤ modified ${cve.lastModified}`)); for (const m of cve.metrics?.cvssMetricV31 ?? []) verdicts.push(v('textbook_cvss_bounded', m.cvssData.baseScore >= 0 && m.cvssData.baseScore <= 10, `${cve.id} score ${m.cvssData.baseScore}`)) }
      src('nvd-cves', { cves: j.vulnerabilities.map((x) => x.cve.id) }, verdicts) } }
  // CERN Open Data: every record's files sized, checksummed, the DOI well formed, the total above the page
  { const j = json('cern-opendata') as { hits?: { total?: number; hits?: { id: string; metadata: { title?: string; files?: { size: number; checksum?: string }[]; relations?: { doi?: string }[] } }[] } } | null | undefined
    if (j === undefined) src('cern-opendata', {}, [], 'absent'); else if (!j?.hits?.hits) src('cern-opendata', {}, [], 'unreadable'); else { const verdicts: Verdict[] = [v('textbook_total_at_least_page', (j.hits.total ?? 0) >= j.hits.hits.length, `total ${j.hits.total} ≥ ${j.hits.hits.length} read`)]
      for (const h of j.hits.hits) { for (const f of h.metadata.files ?? []) { verdicts.push(v('textbook_size_nonnegative', f.size >= 0, `record ${h.id} file ${f.size} bytes`)); if (f.checksum) verdicts.push(v('textbook_adler32_width', /^adler32:[0-9a-f]{8}$/.test(f.checksum), `record ${h.id} ${f.checksum}`)) } for (const r of h.metadata.relations ?? []) if (r.doi) verdicts.push(v('textbook_doi_well_formed', /^10\.\d{4,}\/\S+$/.test(r.doi), r.doi)) }
      src('cern-opendata', { total: j.hits.total, records: j.hits.hits.map((h) => h.id) }, verdicts) } }
  // certificates: crt.sh entries and the live certificates the client read; validity ordered, bounded by 398 days (CA/B Forum), and now within it
  { const entries: { host: string; notBefore: string; notAfter: string; issuer: string; from: string }[] = []
    const crt = json('crt-sh') as { not_before: string; not_after: string; issuer_name: string; common_name?: string }[] | null | undefined
    if (crt === undefined) src('crt-sh', {}, [], 'absent'); else if (!Array.isArray(crt)) src('crt-sh', {}, [], 'unreadable'); else { for (const e of crt) entries.push({ host: e.common_name ?? '', notBefore: e.not_before, notAfter: e.not_after, issuer: e.issuer_name, from: 'crt-sh' }); src('crt-sh', { entries: crt.length }, []) }
    for (const a of answers) if (a.id.startsWith('tls:')) { try { const c = JSON.parse(a.text) as { notBefore: string; notAfter: string; issuer: string }; entries.push({ host: a.id.slice(4), notBefore: c.notBefore, notAfter: c.notAfter, issuer: c.issuer, from: 'tls-live' }) } catch { sources[a.id] = { status: 'unreadable', facts: {}, verdicts: [] } } }
    const verdicts: Verdict[] = []
    for (const e of entries) { const nb = ms(e.notBefore) ?? 0, na = ms(e.notAfter) ?? 0; verdicts.push(v('textbook_dates_ordered', nb < na, `${e.host}: ${e.notBefore} before ${e.notAfter}`), v('textbook_cert_validity_bound', na - nb <= 398 * dayMs, `${e.host}: ${Math.round((na - nb) / dayMs)} days (≤ 398)`)); if (now && e.from === 'tls-live') verdicts.push(v('textbook_now_within_validity', nb <= now && now <= na, `${e.host}: now within the validity`)) }
    if (entries.some((e) => e.from === 'tls-live')) src('tls-live', { hosts: entries.filter((e) => e.from === 'tls-live').map((e) => `${e.host} (${e.issuer})`) }, verdicts.filter((x) => entries.some((e) => x.says.startsWith(e.host) && e.from === 'tls-live'))); if (crt && Array.isArray(crt)) sources['crt-sh']!.verdicts = verdicts.filter((x) => !sources['tls-live']?.verdicts.includes(x)) }
  // CSRC: the three standards named
  { const a = byId.get('csrc-pqc'); if (!a) src('csrc-pqc', {}, [], 'absent'); else src('csrc-pqc', { named: ['FIPS 203', 'FIPS 204', 'FIPS 205'].filter((f) => a.text.includes(f)) }, [v('textbook_pqc_standards_three', ['FIPS 203', 'FIPS 204', 'FIPS 205'].every((f) => a.text.includes(f)), PROSE.quantumProcessingCryptoIndex_s88)]) }
  const all = Object.entries(sources).flatMap(([id, x]) => x.verdicts.map((y) => ({ source: id, ...y })))
  const byTheorem: TheoremTally = {}
  for (const x of all) { byTheorem[x.theorem] = byTheorem[x.theorem] ?? { passed: 0, failed: 0 }; if (x.passed) byTheorem[x.theorem]!.passed += 1; else byTheorem[x.theorem]!.failed += 1 }
  return { sources, followUps, checked: all.length, passed: all.filter((x) => x.passed).length, violations: all.filter((x) => !x.passed).map((x) => ({ source: x.source, theorem: x.theorem, says: x.says })), byTheorem }
}
export const BEACON_LAST = JSON.stringify({ pulse: { uri: 'https://beacon.nist.gov/beacon/2.0/chain/2/pulse/2000107', chainIndex: 2, pulseIndex: 2000107, timeStamp: '2026-10-26T09:10:00.000Z', period: 60000, localRandomValue: '00'.repeat(64), outputValue: 'A'.repeat(128), signatureValue: 'B'.repeat(1024), precommitmentValue: 'C'.repeat(128), listValues: [{ type: 'previous', value: 'D'.repeat(128) }] } })
export const STH = JSON.stringify({ tree_size: 3461480042, timestamp: 1793005826714, sha256_root_hash: 'BUW2/ROzVcSOkLmZvNPkf3njsT5E2kno4MriPzOPWaU=', tree_head_signature: 'x' })
export const NVD = JSON.stringify({ vulnerabilities: [{ cve: { id: 'CVE-2024-37880', published: '2024-06-10T02:15:47.160', lastModified: '2026-06-17T07:38:58.583', metrics: { cvssMetricV31: [{ cvssData: { baseScore: 7.5 } }] } } }] })
export const CERN = JSON.stringify({ hits: { total: 5566, hits: [{ id: '5209', metadata: { title: 'Higgs to two photons from 2011', files: [{ size: 869, checksum: 'adler32:dca4af81' }], relations: [{ doi: '10.7483/OPENDATA.CMS.N9MJ.QEEC' }] } }] } })

const NIST_OPEN_DATA = 'https://data.nist.gov/rmm/records?page=0&size=5'
/** NIST Open Data, read as the client hands the body: each record addressed by a sealed UUID, its DOI well formed when it names one. Nothing is fetched. */
export const nistOpenData = (raw: unknown = true) => {
  if (raw === true) return { phase: 'requests' as const, source: 'nist-opendata' as const, fetched: false as const, written: false as const, request: { id: 'nist-opendata' as const, method: 'GET' as const, url: NIST_OPEN_DATA, accept: 'application/json' as const }, tools: ['kem', 'slh', 'ed25519', 'ecdsa', 'shake'] as const, says: PROSE.quantumProcessingCryptoIndex_says89 }
  type Body = { ResultCount?: number; ResultData?: { title?: unknown; doi?: unknown }[] }
  let body: Body | null = null
  if (typeof raw === 'string') { try { body = JSON.parse(raw) as Body } catch { body = null } }
  else if (isObj(raw)) body = raw as Body
  const rows = Array.isArray(body?.ResultData) ? body.ResultData : []
  const records = rows.map((row) => {
    const title = typeof row.title === 'string' ? row.title : ''
    const doi = String(row.doi ?? '').replace(/^doi:/i, '')
    const address = uuid(`nist-opendata\n${doi}\n${title}`)
    // a DOI is required when the record names one; a record without a DOI still coils, and the page holds when every named DOI is well formed and at least one record carries one
    const doiHolds = doi ? /^10\.\d{4,}\/\S+$/.test(doi) : null
    return { title, doi, address, sealed: uuidSeal(address).valid, doiHolds }
  })
  const total = typeof body?.ResultCount === 'number' ? body.ResultCount : rows.length
  const withDoi = records.filter((row) => row.doiHolds !== null)
  const holds = records.length > 0 && total >= records.length && records.every((row) => row.sealed && row.doiHolds !== false) && withDoi.some((row) => row.doiHolds === true)
  return { phase: 'experience' as const, source: 'nist-opendata' as const, fetched: false as const, written: false as const, total, records: records.length, dois: withDoi.length, rows: records, holds, theorems: ['textbook_seal_and_content_decided'] as const, says: holds ? proseFill(PROSE.quantumProcessingCryptoIndex_s90, records.length, withDoi.length) : PROSE.quantumProcessingCryptoIndex_s91 }
}

/** CERN Open Data, read as the client hands the body: each hit addressed by a sealed UUID, its DOI well formed when it names one. Nothing is fetched. */
export const cernOpenData = (raw: unknown = true, config?: CryptoConfig) => {
  if (raw === true) {
    if (!config) throw new Error(PROSE.quantumProcessingCryptoIndex_s92)
    return { phase: 'requests' as const, source: 'cern-opendata' as const, fetched: false as const, written: false as const, request: { id: 'cern-opendata' as const, method: 'GET' as const, url: cfgAttest(config, 'cern-opendata').url, accept: 'application/json' as const }, tools: ['kem', 'slh', 'ed25519', 'ecdsa', 'shake'] as const, says: PROSE.quantumProcessingCryptoIndex_says93 }
  }
  type Body = { hits?: { total?: number; hits?: { id?: unknown; metadata?: { title?: unknown; relations?: { doi?: unknown }[] } }[] } }
  let body: Body | null = null
  if (typeof raw === 'string') { try { body = JSON.parse(raw) as Body } catch { body = null } }
  else if (isObj(raw)) body = raw as Body
  const rows = Array.isArray(body?.hits?.hits) ? body.hits.hits : []
  const records = rows.map((row) => {
    const title = typeof row.metadata?.title === 'string' ? row.metadata.title : ''
    const doiRaw = row.metadata?.relations?.find((r) => typeof r?.doi === 'string')?.doi
    const doi = String(doiRaw ?? '').replace(/^doi:/i, '')
    const id = String(row.id ?? '')
    const address = uuid(`cern-opendata\n${doi || id}\n${title}`)
    const doiHolds = doi ? /^10\.\d{4,}\/\S+$/.test(doi) : null
    return { id, title, doi, address, sealed: uuidSeal(address).valid, doiHolds }
  })
  const total = typeof body?.hits?.total === 'number' ? body.hits.total : rows.length
  const withDoi = records.filter((row) => row.doiHolds !== null)
  const holds = records.length > 0 && total >= records.length && records.every((row) => row.sealed && row.doiHolds !== false) && withDoi.some((row) => row.doiHolds === true)
  return { phase: 'experience' as const, source: 'cern-opendata' as const, fetched: false as const, written: false as const, total, records: records.length, dois: withDoi.length, rows: records, holds, theorems: ['textbook_seal_and_content_decided'] as const, says: holds ? proseFill(PROSE.quantumProcessingCryptoIndex_s94, records.length, withDoi.length) : PROSE.quantumProcessingCryptoIndex_s95 }
}

