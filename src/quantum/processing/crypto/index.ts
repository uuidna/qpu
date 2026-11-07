// Tsvetan Rouschev, @uuidna/qpu, CC-BY-NC-ND-4.0 (https://orcid.org/0009-0000-7312-9778)
// Pure cryptographic surfaces: the proven 1000-bit surface, UUID superpositions, NIST/CERN scenarios, AEAD/Merkle/PBKDF2/X25519, and attest theorem reads. No MCP, no fetch.
import { createImpossible, decodeImpossible, testPrimality, listFactors, shorReduction, orderFinding, sqrtBig, pasteInteger } from '../algorithms.ts'
import { dnaToHex, hexToDna, dnaStream, uuid, seal, seal as uuidSeal, canonicalText, stream, neighbours, next, navigate, uuidSchemas, UUID_SCHEMAS, compositions, composition, compositionIndex, rosetta, harmonicDefaults, rodinCoil, uuidQubits, hexbit, organiseQubits, quantumSku, coins, reflection, channel } from '../../uuid/index.ts'
import { coins as clayCoins, rays, faces, plane, recomputeClay, AXIOMS } from '../clay-register.ts'
import { CLAY_RELATIONS } from '../clay-statements.ts'
import { speakThousand } from '../i18n.ts'
import { sha256, hmacSha256, sha512, sha1, sha3_256, sha3_512, shake128, shake256, utf8, hex, hkdfExtract, hkdfExpand, pbkdf2Sha256, aes256gcmEncrypt, aes256gcmDecrypt, x25519, chacha20poly1305Encrypt, chacha20poly1305Decrypt, merkleLeafHash, merkleRoot, merkleProof, merkleVerify } from '../unit/hmac.ts'
import { isObj } from '../toolbox.ts'
import { isoEntropyOf } from '../iso-deliverables.ts'

/** Tenant / Payload MCP crypto config: handed by `payload { cryptoConfig: true }` or merged from `tenants.settings.arguments`. Pure crypto never reads TABLES or the tenants collection itself. */
type CryptoAttestApi = { id: string; name: string; url: string; open: boolean; measured: string }
type CryptoPostQuantum = { workers: { flag: string; changelog: string; says: string; read: string }; thisSeal: string; standards: unknown[]; selected: unknown; node: unknown; here: unknown }
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
const cfgHosts = (c: CryptoConfig) => (c.hosts.length ? c.hosts : (() => { throw new Error('crypto config hosts: tenant domains from payload { cryptoConfig } or tenants.settings.arguments') })())
const cfgAttest = (c: CryptoConfig, id: string) => {
  const row = c.attestApis.find((a) => a.id === id)
  if (!row) throw new Error(`crypto config missing ATTEST_APIS id ${id}: configure via Payload MCP`)
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
  const pieces = W.map((w, i) => BigInt('0x' + (hex.slice(off[i]!, off[i]! + w) || '0')))
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
  const dnaP = nextPrime(BigInt('0x' + dnaToHex(dnaSequence.slice(0, 32))) + (1n << 80n))
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
    },
    dnaCrossEncryption: {
      bases: bases.bases,
      uuid: bases.uuids[0]!,
      roundTrips: bases.roundTrips,
      decodedByWitness: dnaDecoded.decoded && dnaDecoded.verified,
      wrongWitnessRefused: dnaWrongRefused,
    },
    glagolitic1000,
    exactArithmetic,
    theorems: [
      'textbook_impossible_trapdoor',
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
  return { agnostic: true as const, refused: false as const, cases: findings, findings, reactions, leads, bound: leads <= findings, collapsed: reactions, entropy, burned: entropy, fuel: entropy, wave: { next: entropy > 0 ? 1 : 0, fuel: entropy }, singularity, sealed: uuidSeal(singularity).valid && rows.every((r) => r.sealed), rows, iso, theorems: ['textbook_entropy_fusion', 'singularity'] as const, says: `${findings} integer case(s) merge to one address; ${entropy} byte(s) of fuel burned; ${iso.standard} ${iso.definition} with W = ${iso.W}, S = ${iso.S} ${iso.unit}; the wave leaves ${leads} lead(s), never more than the cases` }
}

const QUENEAU = Array.from({ length: 14 }, () => 10)
const COMBINATORICS = [
  { name: 'queneau', radices: QUENEAU, theorem: 'textbook_queneau_compositions', formula: '10 ^ 14' },
  { name: 'plugins', radices: [2, 2, 2, 2, 2, 2, 2, 2, 2], theorem: 'textbook_plugin_combinations', formula: '2 ^ 9' },
  { name: 'adapters', radices: [5, 5, 2], theorem: 'textbook_mixed_radix', formula: '5 * 5 * 2' },
  { name: 'sets', radices: [3, 8], theorem: 'textbook_mixed_radix', formula: '3 * 8' },
  { name: 'algorithm', radices: [7, 19, 1, 2, 6, 1, 1, 8, 2, 11], theorem: 'textbook_mixed_radix', formula: '7 * 19 * 1 * 2 * 6 * 1 * 1 * 8 * 2 * 11' },
  { name: 'installations', radices: [3, 2, 5, 5, 2, 512], theorem: 'textbook_mixed_radix', formula: '3 * 2 * 5 * 5 * 2 * 512' },
] as const

const SUPERPOSITION_ADDRESS = '941ef62e-d97b-2438-bfc8-22ae9e5da781'
const SUPERPOSITION_HEXBIT = AXIOMS.find((row) => row.name === 'hexbit')!.value
/** Every UUID superposition this toolbox answers: the six neighbour leads, the harmonic enum space, every RFC schema reading at once, the qubit register and its exchange, the SKU encryption, the Rodin coil's two realities, and the combination spaces held without storing a composition. Pure: nothing fetched, nothing walked. */
type UuidSuperposition = { id: string; surface: string; tool: 'fold'; arguments: Record<string, unknown>; says: string; directions?: number; combinations?: string }
export const uuidSuperpositions = (address = SUPERPOSITION_ADDRESS, width = SUPERPOSITION_HEXBIT) => {
  const around = neighbours(address)
  const team = navigate(address)
  const rotated = next(address)
  const schemas = uuidSchemas(address)
  const sku = quantumSku(address)
  const coil = rodinCoil(address)
  const counted = uuidQubits(width)
  const moved = hexbit(address, width)
  const laid = organiseQubits(address, width)
  const booked = coins([address, 'rodin', address])
  const harmonic = harmonicDefaults({ properties: { style: { enum: ['nova', 'lyra', 'maia'] }, theme: { enum: ['neutral', 'stone', 'zinc', 'gray'] }, radius: { enum: ['0', '0.3', '0.5', '0.75', '1'] } } })
  const spaces = COMBINATORICS.map((s) => ({ name: s.name, count: compositions(s.radices).toString() }))
  const grid = rosetta([6, 7])
  const streamed = stream([address, '016da774-e74c-2e44-8742-f8bcf5e8e8f5', '00000000-0000-1000-8000-000000000000'], { where: { nibble: { at: 1, is: '0' } }, sort: 'hue', execute: true })
  const rows: UuidSuperposition[] = [
    { id: 'neighbours', surface: 'six neighbour superpositions', tool: 'fold', arguments: { neighbours: address }, says: 'six program-space neighbours, each a sealed lead', directions: around.neighbours.length },
    { id: 'navigate', surface: 'neighbourhood team', tool: 'fold', arguments: { navigate: address }, says: 'the team is the six neighbours and their stream', directions: team.neighbours.length },
    { id: 'next', surface: 'program rotation', tool: 'fold', arguments: { next: address }, says: 'the program rotates one place; ten rotations return it' },
    { id: 'harmonic', surface: 'enum superposition', tool: 'fold', arguments: { harmonic: { schema: { properties: { style: { enum: ['nova', 'lyra', 'maia'] }, theme: { enum: ['neutral', 'stone', 'zinc', 'gray'] }, radius: { enum: ['0', '0.3', '0.5', '0.75', '1'] } } } } }, says: 'sixty combinations held at once; the a432 key chooses one', combinations: harmonic.count.toString() },
    { id: 'schemas', surface: 'RFC schema superposition', tool: 'fold', arguments: { hex: address }, says: 'every UUID version schema reads the same bits at once', combinations: String(schemas.schemasRead) },
    { id: 'stream', surface: 'UUID stream superposition', tool: 'fold', arguments: { uuids: [address, '016da774-e74c-2e44-8742-f8bcf5e8e8f5', '00000000-0000-1000-8000-000000000000'], query: { where: { nibble: { at: 1, is: '0' } }, sort: 'hue', execute: true } }, says: 'a UUID-only stream filtered and executed without storing the space', combinations: String(streamed.stream) },
    { id: 'rosetta', surface: 'dual-axis superposition', tool: 'fold', arguments: { rosetta: [6, 7], index: '20' }, says: '6×7 and 7×6 are one scale of forty-two read two ways', combinations: grid.scale.toString() },
    { id: 'combinatorics', surface: 'combination-space superposition', tool: 'fold', arguments: { combinatorics: true }, says: 'every named space counted; none of its compositions stored', combinations: spaces.find((s) => s.name === 'queneau')!.count },
    { id: 'spaces', surface: 'named spaces at once', tool: 'fold', arguments: { spaces: Object.fromEntries(COMBINATORICS.map((s) => [s.name, [...s.radices]])) }, says: 'Queneau, plugins, adapters, sets, algorithm and installations counted by one primitive', combinations: String(spaces.length) },
    { id: 'qubits', surface: 'UUID qubit register', tool: 'fold', arguments: { qubits: width }, says: 'hexbit qubits on each of thirty-two digits; capacity delivered as six neighbour leads', combinations: counted.handles.possible },
    { id: 'exchange', surface: 'qubit exchange', tool: 'fold', arguments: { exchange: { address, hexbit: width } }, says: 'navigation, teleport and σ₁₅ signal over the register', directions: moved.navigate.directions },
    { id: 'organise', surface: 'organised qubit trinities', tool: 'fold', arguments: { organise: { address, hexbit: width } }, says: 'fingerprint, combination and tail laid by trinity' },
    { id: 'sku', surface: 'quantum SKU encryption', tool: 'fold', arguments: { sku: address }, says: 'reflections both ways and six neighbour steps stay this address', directions: sku.encrypted.directions },
    { id: 'coil', surface: 'Rodin coil plasma', tool: 'fold', arguments: { coil: address }, says: 'digits 1 and 6 live as two realities, each with six neighbours', directions: coil.plasma.live.realities.reduce((n, r) => n + r.realities.length, 0) },
    { id: 'coins', surface: 'coins by address', tool: 'fold', arguments: { coins: [address, 'rodin', address] }, says: 'repeated addresses merge to one sealed coin', combinations: String(booked.count) },
  ]
  const holds =
    around.neighbours.length === 6 && around.neighbours.every((n) => n.sealed) &&
    team.neighbours.length === 6 &&
    rotated.places === 10 &&
    harmonic.count === 60n &&
    schemas.schemasRead === UUID_SCHEMAS.length + 2 &&
    streamed.filtered === 1 &&
    grid.scale === 42n &&
    counted.delivery.holds === true && counted.delivery.leads.length === 6 && counted.delivery.leads.every((lead) => lead.sealed) &&
    moved.receipt.holds === true && moved.navigate.directions === 6 &&
    laid.holds === true &&
    sku.holds === true && sku.encrypted.neighbours.length === 6 &&
    coil.holds === true && coil.plasma.live.realities.length === 2 && coil.plasma.live.realities.every((r) => r.realities.length === 6) &&
    booked.sealed === true && booked.count === 2 && booked.fused === true &&
    rows.length === 15
  return {
    phase: 'superpositions' as const, address, hexbit: width, scenarios: rows, superpositions: rows.length,
    neighbours: around.neighbours.length, schemas: schemas.schemasRead, combinations: harmonic.count.toString(),
    qubits: { effective: counted.effective, leads: counted.delivery.leads.length, holds: counted.delivery.holds },
    sku: { holds: sku.holds, directions: sku.encrypted.directions },
    coil: { holds: coil.holds, realities: coil.plasma.live.realities.map((r) => ({ digit: r.digit, neighbours: r.realities.length })) },
    coins: { count: booked.count, fused: booked.fused },
    fetched: false as const, written: false as const, walked: false as const, holds,
    theorems: ['textbook_neighbour_step', 'textbook_harmonic_default', 'textbook_uuid_schemas', 'textbook_mixed_radix', 'textbook_queneau_compositions', 'textbook_coil_green'] as const,
    says: holds
      ? `${rows.length} UUID superposition(s) of ${address}: six neighbour leads, sixty harmonic combinations, ${schemas.schemasRead} schema readings, the ${counted.effective}-qubit register and its exchange, the SKU encryption, the coil's two realities and the combination spaces — none walked, none fetched.`
      : 'a UUID superposition did not hold',
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
  const schemas = uuidSchemas(address)
  const schemasBack = schemas.core.channel.handle === here.handle && schemas.schemasRead === UUID_SCHEMAS.length + 2 && uuidSchemas(address).schemasRead === schemas.schemasRead
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
  const sku = quantumSku(address)
  const mirror = reflection(address)
  const twice = reflection(mirror.mirror)
  const skuBack = sku.encrypted.roundTrip === true && twice.handle === here.handle && twice.tail === here.tail && sku.holds === true
  const coil = rodinCoil(address)
  const coilBack = coil.holds === true && coil.plasma.live.realities.length === 2 && coil.plasma.live.realities.every((r) => r.realities.length === 6 && r.sealed) && coil.plasma.live.digits?.join() === '1,6'
  const booked = coins([address, 'rodin', address])
  const again = coins(booked.coins)
  const coinsBack = booked.sealed === true && booked.count === 2 && again.count === booked.count && again.coins.every((id, i) => id === booked.coins[i]) && booked.fused === true
  const rows = [
    { id: 'neighbours', reverse: 'step back returns the program', returns: neighbourBack.every((row) => row.returns && row.sealed), of: neighbourBack.length },
    { id: 'navigate', reverse: 'each neighbour\'s opposite step returns the program', returns: navigateBack, of: team.neighbours.length },
    { id: 'next', reverse: 'one step back and ten around', returns: nextBack, of: rotated.places },
    { id: 'harmonic', reverse: 'digits make the index', returns: harmonicBack, of: Number(harmonic.count) },
    { id: 'schemas', reverse: 'core channel unchanged', returns: schemasBack, of: schemas.schemasRead },
    { id: 'stream', reverse: 'executed next steps back', returns: streamBack, of: streamed.stream },
    { id: 'rosetta', reverse: 'transpose of the transpose', returns: rosettaBack, of: Number(grid.scale) },
    { id: 'combinatorics', reverse: 'last composition indexes itself', returns: combinatoricsBack, of: 14 },
    { id: 'spaces', reverse: 'each space indexes itself', returns: spacesBack, of: COMBINATORICS.length },
    { id: 'qubits', reverse: 'σ both ways on the delivery coin', returns: qubitsBack, of: counted.delivery.leads.length },
    { id: 'exchange', reverse: 'σ₁₅ signal and neighbour program steps', returns: exchangeBack, of: moved.signal.digits },
    { id: 'organise', reverse: 'combination digits read as index', returns: organiseBack, of: laid.combination.digits },
    { id: 'sku', reverse: 'reflection twice is the handle and tail', returns: skuBack, of: sku.encrypted.directions },
    { id: 'coil', reverse: 'both realities and six neighbours each', returns: coilBack, of: coil.plasma.live.realities.length },
    { id: 'coins', reverse: 'merge is idempotent', returns: coinsBack, of: booked.count },
  ] as const
  const holds = rows.length === 15 && rows.every((row) => row.returns)
  return {
    phase: 'superpositions-reverse' as const, address, hexbit: width, direction: 'reverse' as const,
    scenarios: rows, superpositions: rows.length, reversed: rows.filter((row) => row.returns).length,
    neighbours: neighbourBack, fetched: false as const, written: false as const, walked: false as const, holds,
    theorems: ['textbook_neighbour_step', 'textbook_harmonic_default', 'textbook_uuid_schemas', 'textbook_mixed_radix', 'textbook_queneau_compositions', 'textbook_coil_green'] as const,
    says: holds
      ? `${rows.length} UUID superposition(s) reversed for ${address}: every neighbour steps back to the program, next undoes, the harmonic index rebuilds its digits, the rosetta transpose undoes, σ twice returns the parts, and coins merge once — none walked, none fetched.`
      : `a UUID superposition did not reverse: ${rows.filter((row) => !row.returns).map((row) => row.id).join(', ') || 'none'}`,
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
  if (scalar.length !== 32 || point.length !== 32) throw new Error('x25519 scalar and point are 32 bytes each')
  return { phase: 'x25519' as const, rfc: 7748 as const, shared: hex(x25519(scalar, point)), sizes: { scalar: 32, point: 32, shared: 32 } }
}
/** PBKDF2-HMAC-SHA256 (RFC 8018 / NIST SP 800-132): a password stretched under a salt by `iterations` rounds to `length` bytes (default 32). Password and salt are utf-8 text, or hex when `hex: true`. */
export const derivePbkdf2 = (raw: unknown) => {
  const a = (isObj(raw) ? raw : {}) as { password?: string; salt?: string; iterations?: number; length?: number; hex?: boolean }
  if (typeof a.password !== 'string' || typeof a.salt !== 'string') throw new Error('pbkdf2 takes { password, salt, iterations }')
  if (!Number.isInteger(a.iterations) || (a.iterations as number) < 1) throw new Error('iterations is a positive integer')
  const length = a.length === undefined ? 32 : a.length
  if (!Number.isInteger(length) || length < 1) throw new Error('length is a positive integer')
  const password = a.hex === true ? fromHex(a.password, 'password') : utf8(a.password)
  const salt = a.hex === true ? fromHex(a.salt, 'salt') : utf8(a.salt)
  return { phase: 'pbkdf2' as const, kdf: 'PBKDF2-HMAC-SHA256' as const, rfc: 8018 as const, iterations: a.iterations, length, derived: hex(pbkdf2Sha256(password, salt, a.iterations as number, length)) }
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
  if (!Array.isArray(a.leaves)) throw new Error('merkle takes { leaves }, { leaves, index }, or { leaf, proof, root }')
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
  if (!cipher) throw new Error('cipher is aes-256-gcm or chacha20-poly1305')
  if (typeof a.key !== 'string' || typeof a.nonce !== 'string') throw new Error('aead takes a key and a nonce, as hex')
  const key = fromHex(a.key, 'key'), nonce = fromHex(a.nonce, 'nonce'), aad = typeof a.aad === 'string' ? utf8(a.aad) : new Uint8Array(0)
  const open = isObj(a.open) ? a.open : null
  if (open) {
    if (typeof open.ciphertext !== 'string' || typeof open.tag !== 'string') throw new Error('open takes the ciphertext and the tag, as hex')
    const ciphertext = fromHex(open.ciphertext, 'ciphertext'), tag = fromHex(open.tag, 'tag')
    const plain = cipher === 'aes-256-gcm' ? aes256gcmDecrypt(key, nonce, ciphertext, tag, aad) : chacha20poly1305Decrypt(key, nonce, ciphertext, tag, aad)
    const text = plain ? new TextDecoder('utf-8', { fatal: false }).decode(plain) : null
    return { phase: 'aead' as const, cipher, direction: 'open' as const, verified: plain !== null, plain: plain ? hex(plain) : null, text: plain ? text : null }
  }
  if (typeof a.text !== 'string') throw new Error('aead takes the text to seal, or open: { ciphertext, tag }')
  const sealed = cipher === 'aes-256-gcm' ? aes256gcmEncrypt(key, nonce, utf8(a.text), aad) : chacha20poly1305Encrypt(key, nonce, utf8(a.text), aad)
  return { phase: 'aead' as const, cipher, direction: 'seal' as const, ciphertext: hex(sealed.ciphertext), tag: hex(sealed.tag), plain: hex(utf8(a.text)) }
}

/** Seeds bound to their referer: chunk i is HKDF(secret, salt = the referer's sixteen bytes, info = 'qpu referer seed i'), recomputed from the
 * secret and the referer alone. The referer is public, so it adds no entropy: every bit comes from the secret; it binds the seed to its chain. */
export const deriveRefererSeeds = (referer: unknown, key: unknown) => {
  const { address, chunks = 1 } = (isObj(referer) ? referer : { address: referer }) as { address?: unknown; chunks?: unknown }
  if (typeof address !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(address)) throw new Error('referer is the address of the referer block (a UUID), or { address, chunks }')
  if (!Number.isInteger(chunks) || (chunks as number) < 1) throw new Error('chunks is a whole number of 32-byte seeds, at least one')
  const salt = Uint8Array.from((address.split('-').join('').match(/../g) ?? []).map((h) => parseInt(h, 16))), infos = Array.from({ length: chunks as number }, (_, i) => 'qpu referer seed ' + i)
  const ikm = typeof key === 'string' ? utf8(key) : null, secretBits = ikm ? Math.min(256, ikm.length * 8) : 256
  return { kdf: 'HKDF-SHA256 (RFC 5869)', salt: address, infos, bytesPerChunk: 32, executedBy: ikm ? 'here, under a test key' : 'host', keyVar: 'QPU_PROOF_SIGNING_KEY (its 32-byte seed the input keying material; never sent here)', ...(ikm ? { seeds: infos.map((i) => hex(deriveHkdf(ikm, salt, utf8(i)))) } : {}), entropy: { secretBits, refererBits: 0, totalBits: secretBits, says: 'at most the secret\'s bits: the referer is public and recomputable, so it adds none, however the seed is chunked' }, binds: 'a seed belongs to one referer and one chunk: another referer or chunk gives another seed, and nobody without the secret can make either', recomputedFrom: ['the secret', 'the referer address', 'the chunk index'], theorem: 'textbook_referer_binds_not_entropy' }
}

/** A glTF 2.0 asset read as Unreal Engine reads it. */
const GLB_MAGIC = 0x46546c67, GLB_JSON = 0x4e4f534a, GLB_BIN = 0x004e4942
export const getGltf = (g: { glb64?: string; json?: unknown }, supported: readonly string[]) => {
  let doc: Record<string, any> | null = null, bin = 0, why: string | null = null
  if (typeof g.glb64 === 'string') { const b = Uint8Array.from(atob(g.glb64), (c) => c.charCodeAt(0)), v = new DataView(b.buffer)
    if (b.length < 20 || v.getUint32(0, true) !== GLB_MAGIC) why = 'not a .glb: the magic is not glTF'
    else if (v.getUint32(4, true) !== 2) why = `a .glb of container version ${v.getUint32(4, true)}, not 2`
    else if (v.getUint32(8, true) !== b.length) why = `a .glb whose header says ${v.getUint32(8, true)} bytes, not ${b.length}`
    else for (let at = 12; at + 8 <= b.length;) { const len = v.getUint32(at, true), type = v.getUint32(at + 4, true); if (type === GLB_JSON && !doc) doc = JSON.parse(new TextDecoder().decode(b.subarray(at + 8, at + 8 + len))); else if (type === GLB_BIN) bin = len; at += 8 + len } }
  else if (isObj(g.json)) doc = g.json as Record<string, any>
  if (!why && !doc) why = 'no glTF JSON: hand glb64 (a .glb as base64) or json (a .gltf)'
  if (!why && String(doc?.asset?.version) !== '2.0') why = `glTF ${doc?.asset?.version ?? 'without a version'}: only 2.0 is read`
  if (why) return { phase: 'gltf' as const, loadable: false, why, theorem: 'textbook_gltf_required_extensions' }
  const count = (k: string) => (Array.isArray(doc![k]) ? doc![k].length : 0), used: string[] = doc!.extensionsUsed ?? [], required: string[] = doc!.extensionsRequired ?? []
  const prefix = (e: string) => (e.startsWith('KHR_') ? 'khronos' : e.startsWith('EXT_') ? 'multi-vendor' : 'vendor'), missing = required.filter((e) => !supported.includes(e))
  const external = [...(doc!.buffers ?? []), ...(doc!.images ?? [])].map((x: { uri?: string }) => x.uri).filter((u): u is string => typeof u === 'string' && !u.startsWith('data:'))
  return { phase: 'gltf' as const, format: g.glb64 ? 'glb' : 'gltf', version: '2.0', generator: doc!.asset?.generator ?? null, counts: Object.fromEntries(['scenes', 'nodes', 'meshes', 'materials', 'animations', 'skins', 'textures', 'images', 'buffers'].map((k) => [k, count(k)])), binBytes: bin, external, extensions: used.map((e) => ({ name: e, prefix: prefix(e), required: required.includes(e), supported: supported.includes(e) })), loadable: missing.length === 0, why: missing.length ? `it requires ${missing.join(', ')}, which this reader does not support` : null, theorem: 'textbook_gltf_required_extensions' }
}

/** The ML-DSA parameter sets of FIPS 204 (table 2 of the standard: public key and signature sizes in bytes) and the Web Crypto names Workers and Node give them. */
const ML_DSA = {
  'ML-DSA-44': { category: 2, publicKey: 1312, signature: 2420 },
  'ML-DSA-65': { category: 3, publicKey: 1952, signature: 3309 },
  'ML-DSA-87': { category: 5, publicKey: 2592, signature: 4627 },
} as const
type MlDsa = keyof typeof ML_DSA
type SignaturePlan = { algorithm: MlDsa; fips: 204; over: 'sha256'; message: string; signed: string; executedBy: 'host'; keyVar: string; webcrypto: { flag: string; generateKey: { name: MlDsa }; sign: { name: MlDsa }; keyFormat: 'jwk'; kty: 'AKP'; since: string }; sizes: { publicKey: number; signature: number }; verify: string; value?: string; publicKey?: Record<string, unknown>; keyed?: 'secret' | 'ephemeral'; phase?: 'planned' | 'signed' | 'unsupported'; note?: string }
/** The signature plan, pure: what the host signs (the 32 bytes of the digest), with which algorithm, under which key variable, through which Web Crypto call; the host fills value, publicKey and keyed. Flag/changelog from tenant crypto config. */
export const planSignature = (digest: string, sign: unknown, config: CryptoConfig): SignaturePlan => {
  const algorithm: MlDsa = sign === true || sign === 'ML-DSA-65' ? 'ML-DSA-65' : sign === 'ML-DSA-44' ? 'ML-DSA-44' : sign === 'ML-DSA-87' ? 'ML-DSA-87' : (() => { throw new Error(`sign is ML-DSA-44, ML-DSA-65 or ML-DSA-87 (FIPS 204), not ${JSON.stringify(sign)}`) })()
  const pq = config.postQuantum
  return { algorithm, fips: 204, over: 'sha256', message: digest, signed: 'the 32 bytes of the SHA-256 digest (256 bits, whatever the text\'s length)', executedBy: 'host', keyVar: 'QPU_SIGNING_KEY[_<TENANT>] (a private JWK of kty AKP; absent, the host signs with a key it generates for its own lifetime and says so)', webcrypto: { flag: pq.workers.flag, generateKey: { name: algorithm }, sign: { name: algorithm }, keyFormat: 'jwk', kty: 'AKP', since: pq.workers.changelog }, sizes: { publicKey: ML_DSA[algorithm].publicKey, signature: ML_DSA[algorithm].signature }, verify: `crypto.subtle.verify({ name: '${algorithm}' }, publicKey, signature, bytes(sha256)) with the public key the answer carries: no secret needed`, phase: 'planned' }
}

/** The ML-KEM parameter sets of FIPS 203 (table: encapsulation/decapsulation key, ciphertext and shared-secret sizes in bytes): the post-quantum
 *  key encapsulation that pairs with ML-DSA (FIPS 204) — the attest tool already reads NIST NVD's CVEs on ML-KEM; this is the KEM itself, host-executed. */
const ML_KEM = {
  'ML-KEM-512': { category: 1, encapsulationKey: 800, decapsulationKey: 1632, ciphertext: 768, sharedSecret: 32 },
  'ML-KEM-768': { category: 3, encapsulationKey: 1184, decapsulationKey: 2400, ciphertext: 1088, sharedSecret: 32 },
  'ML-KEM-1024': { category: 5, encapsulationKey: 1568, decapsulationKey: 3168, ciphertext: 1568, sharedSecret: 32 },
} as const
type MlKem = keyof typeof ML_KEM
type EncapsulationPlan = { algorithm: MlKem; fips: 203; executedBy: 'host'; webcrypto: { flag: string; encapsulate: { name: MlKem }; keyFormat: 'raw-public'; since: string }; sizes: { encapsulationKey: number; decapsulationKey: number; ciphertext: number; sharedSecret: number }; encapsulate: string; decapsulate: string; ciphertext?: string; sharedSecret?: string; phase?: 'planned' | 'encapsulated' | 'unsupported' }
/** The KEM encapsulation plan, pure: which ML-KEM, over which Web Crypto call, the sizes; the host runs encapsulate() with the recipient's public key and fills the ciphertext (the shared secret never leaves the host). */
export const planEncapsulation = (kem: unknown, config: CryptoConfig): EncapsulationPlan => {
  const algorithm: MlKem = kem === true || kem === 'ML-KEM-768' ? 'ML-KEM-768' : kem === 'ML-KEM-512' ? 'ML-KEM-512' : kem === 'ML-KEM-1024' ? 'ML-KEM-1024' : (() => { throw new Error(`kem is ML-KEM-512, ML-KEM-768 or ML-KEM-1024 (FIPS 203), not ${JSON.stringify(kem)}`) })()
  const s = ML_KEM[algorithm]
  const pq = config.postQuantum
  return { algorithm, fips: 203, executedBy: 'host', webcrypto: { flag: pq.workers.flag, encapsulate: { name: algorithm }, keyFormat: 'raw-public', since: pq.workers.changelog }, sizes: { encapsulationKey: s.encapsulationKey, decapsulationKey: s.decapsulationKey, ciphertext: s.ciphertext, sharedSecret: s.sharedSecret }, encapsulate: `crypto.subtle.encapsulateBits({ name: '${algorithm}' }, encapsulationKey): the ciphertext travels, the ${s.sharedSecret}-byte shared secret stays on the host`, decapsulate: `crypto.subtle.decapsulateBits({ name: '${algorithm}' }, decapsulationKey, ciphertext): the recipient recovers the same shared secret`, phase: 'planned' }
}

/** Ed25519 (RFC 8032), the classical signature beside the PQC ML-DSA: host-executed via Web Crypto (Node, Workers and browsers all have it), a 32-byte public key and a 64-byte signature over the message itself (no pre-hash); verified without any secret. */
type Ed25519Plan = { algorithm: 'Ed25519'; rfc: 8032; over: 'message'; executedBy: 'host'; webcrypto: { generateKey: { name: 'Ed25519' }; sign: { name: 'Ed25519' }; keyFormat: 'raw' }; sizes: { publicKey: 32; signature: 64 }; message: string; verify: string; phase: 'planned' }
export const planEd25519 = (message: string): Ed25519Plan => ({ algorithm: 'Ed25519', rfc: 8032, over: 'message', executedBy: 'host', webcrypto: { generateKey: { name: 'Ed25519' }, sign: { name: 'Ed25519' }, keyFormat: 'raw' }, sizes: { publicKey: 32, signature: 64 }, message, verify: "crypto.subtle.verify('Ed25519', publicKey, signature, message): the public key the answer carries, no secret needed", phase: 'planned' })

/** SLH-DSA parameter sets of FIPS 205 (table: public key and signature sizes in bytes): the hash-based (SPHINCS+) signature, the third PQC standard beside ML-KEM (203) and ML-DSA (204); host-executed — its signatures are large, so the plan carries the sizes and the call. */
const SLH_DSA = {
  'SLH-DSA-SHA2-128s': { category: 1, publicKey: 32, signature: 7856 },
  'SLH-DSA-SHA2-128f': { category: 1, publicKey: 32, signature: 17088 },
  'SLH-DSA-SHA2-192s': { category: 3, publicKey: 48, signature: 16224 },
  'SLH-DSA-SHA2-256s': { category: 5, publicKey: 64, signature: 29792 },
} as const
type SlhDsa = keyof typeof SLH_DSA
type SlhDsaPlan = { algorithm: SlhDsa; fips: 205; over: 'message'; executedBy: 'host'; sizes: { publicKey: number; signature: number }; verify: string; phase: 'planned' }
export const planSlhDsa = (slh: unknown): SlhDsaPlan => {
  const algorithm = (typeof slh === 'string' && slh in SLH_DSA ? slh : slh === true ? 'SLH-DSA-SHA2-128s' : (() => { throw new Error(`slh is one of ${Object.keys(SLH_DSA).join(', ')} (FIPS 205), not ${JSON.stringify(slh)}`) })()) as SlhDsa
  const s = SLH_DSA[algorithm]
  return { algorithm, fips: 205, over: 'message', executedBy: 'host', sizes: { publicKey: s.publicKey, signature: s.signature }, verify: `verify the ${s.signature}-byte SLH-DSA signature over the message with the ${s.publicKey}-byte public key — hash-based, stateless, no number-theoretic assumption`, phase: 'planned' }
}

/** ECDSA on P-256 (FIPS 186-5), the other classical signature beside Ed25519: host-executed via Web Crypto, over the SHA-256 of the message; 65-byte uncompressed public key, 64-byte raw (r‖s) signature. */
type EcdsaPlan = { algorithm: 'ECDSA'; curve: 'P-256'; fips: '186-5'; over: 'sha256'; executedBy: 'host'; webcrypto: { generateKey: { name: 'ECDSA'; namedCurve: 'P-256' }; sign: { name: 'ECDSA'; hash: 'SHA-256' } }; sizes: { publicKey: 65; signature: 64 }; message: string; verify: string; phase: 'planned' }
export const planEcdsaP256 = (message: string): EcdsaPlan => ({ algorithm: 'ECDSA', curve: 'P-256', fips: '186-5', over: 'sha256', executedBy: 'host', webcrypto: { generateKey: { name: 'ECDSA', namedCurve: 'P-256' }, sign: { name: 'ECDSA', hash: 'SHA-256' } }, sizes: { publicKey: 65, signature: 64 }, message, verify: "crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, publicKey, signature, message): no secret needed", phase: 'planned' })


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
    { id: 'fips-180-4', standard: 'FIPS 180-4', tool: 'seal', arguments: { text: 'nist', fips180: true }, says: 'SHA-1, SHA-256 and SHA-512 of one text' },
    { id: 'fips-186-5-ecdsa', standard: 'FIPS 186-5', tool: 'seal', arguments: { text: 'nist', ecdsa: true }, says: 'ECDSA P-256 over the SHA-256 of the text' },
    { id: 'fips-202-sha3', standard: 'FIPS 202', tool: 'seal', arguments: { text: 'nist', sha3: true }, says: 'SHA3-256 and SHA3-512 beside SHA-256' },
    { id: 'fips-202-shake', standard: 'FIPS 202', tool: 'seal', arguments: { text: 'nist', shake: true }, says: 'SHAKE128 of 32 bytes and SHAKE256 of 64 bytes' },
    ...(['ML-KEM-512', 'ML-KEM-768', 'ML-KEM-1024'] as const).map((kem) => ({ id: `fips-203-${kem}`, standard: 'FIPS 203', tool: 'seal' as const, arguments: { kem }, says: `${kem} names its sizes and stays on the host` })),
    ...(['ML-DSA-44', 'ML-DSA-65', 'ML-DSA-87'] as const).map((sign) => ({ id: `fips-204-${sign}`, standard: 'FIPS 204', tool: 'seal' as const, arguments: { text: 'nist', sign }, says: `${sign} plans a signature over the digest` })),
    ...(['SLH-DSA-SHA2-128s', 'SLH-DSA-SHA2-128f', 'SLH-DSA-SHA2-192s', 'SLH-DSA-SHA2-256s'] as const).map((slh) => ({ id: `fips-205-${slh}`, standard: 'FIPS 205', tool: 'seal' as const, arguments: { slh }, says: `${slh} names its public key and signature` })),
    { id: 'sp-800-132-pbkdf2', standard: 'NIST SP 800-132', tool: 'seal', arguments: { pbkdf2: { password: 'password', salt: 'salt', iterations: 1, length: 32 } }, says: 'PBKDF2-HMAC-SHA256 one-iteration vector' },
    { id: 'sp-800-38d-aes-gcm', standard: 'NIST SP 800-38D', tool: 'seal', arguments: { aead: { ...AES_GCM_VECTOR } }, says: 'AES-256-GCM seals to its known ciphertext and tag' },
    { id: 'codata', standard: 'CODATA', tool: 'seal', arguments: { constants: true }, says: 'CODATA is named and not fetched', request: { id: 'codata', method: 'GET', url: CODATA_URL, accept: 'text/plain' } },
    { id: 'nist-opendata', standard: 'NIST Open Data', tool: 'attest', arguments: { op: 'experience', nist: true }, says: 'NIST Open Data is asked and not fetched', request: { id: 'nist-opendata', method: 'GET', url: 'https://data.nist.gov/rmm/records?page=0&size=5', accept: 'application/json' } },
    { id: 'attest-plan', standard: 'NIST attest', tool: 'attest', arguments: { op: 'plan', hosts: [...hosts] }, says: `attest plans every open API and the live certificate of ${host}` },
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
    says: `${scenarios.length} NIST scenario(s) across ${standards.length} standard(s); ${requests.length} request(s) and ${liveCertificates.length} live certificate(s) for ${host}. Nothing is fetched.`,
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
  const ecdsaOnce = planEcdsaP256(digest), ecdsaAgain = planEcdsaP256(sha('nist'))
  const ecdsaBack = ecdsaOnce.message === digest && ecdsaAgain.message === ecdsaOnce.message && ecdsaOnce.fips === '186-5' && ecdsaOnce.curve === 'P-256'
  const sha3Once = { sha3_256: hex(sha3_256(message)), sha3_512: hex(sha3_512(message)) }
  const sha3Again = { sha3_256: hex(sha3_256(message)), sha3_512: hex(sha3_512(message)) }
  const sha3Back = sha3Once.sha3_256 === sha3Again.sha3_256 && sha3Once.sha3_512 === sha3Again.sha3_512 && sha3Once.sha3_256.length === 64 && sha3Once.sha3_512.length === 128
  const shakeOnce = { shake128: hex(shake128(message, 32)), shake256: hex(shake256(message, 64)) }
  const shakeAgain = { shake128: hex(shake128(message, 32)), shake256: hex(shake256(message, 64)) }
  const shakeBack = shakeOnce.shake128 === shakeAgain.shake128 && shakeOnce.shake256 === shakeAgain.shake256 && shakeOnce.shake128.length === 64 && shakeOnce.shake256.length === 128
  const kemRows = (['ML-KEM-512', 'ML-KEM-768', 'ML-KEM-1024'] as const).map((kem) => {
    const once = planEncapsulation(kem, config), again = planEncapsulation(kem, config)
    return { id: `fips-203-${kem}`, standard: 'FIPS 203', reverse: `${kem} plan recomputes the same sizes`, returns: once.algorithm === again.algorithm && once.sizes.ciphertext === again.sizes.ciphertext && once.sizes.sharedSecret === 32 && once.fips === 203, of: once.sizes.sharedSecret, tool: 'seal' as const, arguments: { kem } }
  })
  const dsaRows = (['ML-DSA-44', 'ML-DSA-65', 'ML-DSA-87'] as const).map((sign) => {
    const once = planSignature(digest, sign, config), again = planSignature(sha('nist'), sign, config)
    return { id: `fips-204-${sign}`, standard: 'FIPS 204', reverse: `${sign} plan recomputes over the same digest`, returns: once.algorithm === again.algorithm && once.message === again.message && once.message === digest && once.fips === 204, of: once.sizes.signature, tool: 'seal' as const, arguments: { text: 'nist', sign } }
  })
  const slhRows = (['SLH-DSA-SHA2-128s', 'SLH-DSA-SHA2-128f', 'SLH-DSA-SHA2-192s', 'SLH-DSA-SHA2-256s'] as const).map((slh) => {
    const once = planSlhDsa(slh), again = planSlhDsa(slh)
    return { id: `fips-205-${slh}`, standard: 'FIPS 205', reverse: `${slh} plan recomputes the same sizes`, returns: once.algorithm === again.algorithm && once.sizes.signature === again.sizes.signature && once.fips === 205, of: once.sizes.signature, tool: 'seal' as const, arguments: { slh } }
  })
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
    { id: 'fips-180-4', standard: 'FIPS 180-4', reverse: 'digests recompute the same hex', returns: fipsBack, of: 3, tool: 'seal', arguments: { text: 'nist', fips180: true } },
    { id: 'fips-186-5-ecdsa', standard: 'FIPS 186-5', reverse: 'ECDSA plan recomputes over the same digest', returns: ecdsaBack, of: ecdsaOnce.sizes.signature, tool: 'seal', arguments: { text: 'nist', ecdsa: true } },
    { id: 'fips-202-sha3', standard: 'FIPS 202', reverse: 'SHA-3 digests recompute the same hex', returns: sha3Back, of: 2, tool: 'seal', arguments: { text: 'nist', sha3: true } },
    { id: 'fips-202-shake', standard: 'FIPS 202', reverse: 'SHAKE digests recompute the same hex', returns: shakeBack, of: 2, tool: 'seal', arguments: { text: 'nist', shake: true } },
    ...kemRows, ...dsaRows, ...slhRows,
    { id: 'sp-800-132-pbkdf2', standard: 'NIST SP 800-132', reverse: 'PBKDF2 recomputes the one-iteration vector', returns: pbkdfBack, of: 32, tool: 'seal', arguments: { pbkdf2: pbkdf } },
    { id: 'sp-800-38d-aes-gcm', standard: 'NIST SP 800-38D', reverse: 'AES-256-GCM opens the text it sealed', returns: aeadBack, of: AES_GCM_VECTOR.text.length, tool: 'seal', arguments: { aead: { cipher: AES_GCM_VECTOR.cipher, key: AES_GCM_VECTOR.key, nonce: AES_GCM_VECTOR.nonce, aad: AES_GCM_VECTOR.aad, open: { ciphertext: sealed.ciphertext, tag: sealed.tag } } } },
    { id: 'rfc-6962-merkle', standard: 'RFC 6962', reverse: 'inclusion proof verifies against the root', returns: merkleBack, of: proof.proof.length, tool: 'seal', arguments: { merkle: { leaf: 'b', proof: proof.proof, root: proof.root } } },
    { id: 'codata', standard: 'CODATA', reverse: 'CODATA is named again and not fetched', returns: true, tool: 'seal', arguments: { constants: true }, request: { id: 'codata', method: 'GET', url: CODATA_URL, accept: 'text/plain' } },
    { id: 'cern-opendata', standard: 'CERN Open Data', reverse: 'CERN Open Data is the pivot and is not fetched', returns: true, tool: 'attest', arguments: { op: 'experience', cern: true }, request: { id: 'cern-opendata', method: 'GET', url: CERN_OPEN_DATA, accept: 'application/json' } },
    { id: 'attest-plan', standard: 'CERN attest', reverse: `attest plans every open API and the live certificate of ${host}`, returns: true, tool: 'attest', arguments: { op: 'plan', hosts: [...hosts] } },
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
      ? `${scenarios.length} NIST scenario(s) reversed via CERN (${host}): AES opens what it sealed, Merkle verifies, digests and plans recompute, and ${requests.length} request(s) lead with CERN Open Data. Nothing is fetched.`
      : `a NIST scenario did not reverse via CERN: ${scenarios.filter((s) => !s.returns).map((s) => s.id).join(', ') || 'none'}`,
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
        verdicts.push(v('textbook_chain_index_steps', p.pulseIndex === q.pulseIndex + 1, `pulse ${p.pulseIndex} follows ${q.pulseIndex}`), v('textbook_beacon_period', Date.parse(p.timeStamp) - Date.parse(q.timeStamp) === p.period, `${Date.parse(p.timeStamp) - Date.parse(q.timeStamp)} ms between the pulses`), v('textbook_chain_links_by_output', previous === q.outputValue, 'the last pulse\'s previous value is the previous pulse\'s output'), v('textbook_precommitment_is_sha512', hex(sha512(new Uint8Array((p.localRandomValue.match(/../g) ?? []).map((x) => parseInt(x, 16))))).toUpperCase() === q.precommitmentValue.toUpperCase(), 'SHA-512 of the last local random value is the previous precommitment')) }
      src('nist-beacon', { chainIndex: p.chainIndex, pulseIndex: p.pulseIndex, timeStamp: p.timeStamp, previous: prev?.pulse ? (prev.pulse as { pulseIndex: number }).pulseIndex : null }, verdicts) } }
  // CT: the signed tree head
  { const j = json('ct-sth') as { tree_size?: number; timestamp?: number; sha256_root_hash?: string } | null | undefined
    if (j === undefined) src('ct-sth', {}, [], 'absent'); else if (!j || typeof j.tree_size !== 'number') src('ct-sth', {}, [], 'unreadable'); else src('ct-sth', { treeSize: j.tree_size, timestamp: j.timestamp }, [v('textbook_hash_bits', b64len(j.sha256_root_hash ?? '') === 32, `root hash ${b64len(j.sha256_root_hash ?? '')} bytes`), v('textbook_tree_size_positive', j.tree_size > 0, `tree size ${j.tree_size}`), ...(now ? [v('textbook_dates_ordered', (j.timestamp ?? 0) <= now, 'the tree head is not from the future')] : [])]) }
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
    if (crt === undefined) src('crt-sh', {}, [], 'absent'); else if (!Array.isArray(crt)) src('crt-sh', {}, [], 'unreadable'); else { for (const e of crt.slice(0, 20)) entries.push({ host: e.common_name ?? '', notBefore: e.not_before, notAfter: e.not_after, issuer: e.issuer_name, from: 'crt-sh' }); src('crt-sh', { entries: crt.length }, []) }
    for (const a of answers) if (a.id.startsWith('tls:')) { try { const c = JSON.parse(a.text) as { notBefore: string; notAfter: string; issuer: string }; entries.push({ host: a.id.slice(4), notBefore: c.notBefore, notAfter: c.notAfter, issuer: c.issuer, from: 'tls-live' }) } catch { sources[a.id] = { status: 'unreadable', facts: {}, verdicts: [] } } }
    const verdicts: Verdict[] = []
    for (const e of entries) { const nb = ms(e.notBefore) ?? 0, na = ms(e.notAfter) ?? 0; verdicts.push(v('textbook_dates_ordered', nb < na, `${e.host}: ${e.notBefore} before ${e.notAfter}`), v('textbook_cert_validity_bound', na - nb <= 398 * dayMs, `${e.host}: ${Math.round((na - nb) / dayMs)} days (≤ 398)`)); if (now && e.from === 'tls-live') verdicts.push(v('textbook_now_within_validity', nb <= now && now <= na, `${e.host}: now within the validity`)) }
    if (entries.some((e) => e.from === 'tls-live')) src('tls-live', { hosts: entries.filter((e) => e.from === 'tls-live').map((e) => `${e.host} (${e.issuer})`) }, verdicts.filter((x) => entries.some((e) => x.says.startsWith(e.host) && e.from === 'tls-live'))); if (crt && Array.isArray(crt)) sources['crt-sh']!.verdicts = verdicts.filter((x) => !sources['tls-live']?.verdicts.includes(x)) }
  // CSRC: the three standards named
  { const a = byId.get('csrc-pqc'); if (!a) src('csrc-pqc', {}, [], 'absent'); else src('csrc-pqc', { named: ['FIPS 203', 'FIPS 204', 'FIPS 205'].filter((f) => a.text.includes(f)) }, [v('textbook_pqc_standards_three', ['FIPS 203', 'FIPS 204', 'FIPS 205'].every((f) => a.text.includes(f)), 'FIPS 203, 204 and 205 named on the page')]) }
  const all = Object.entries(sources).flatMap(([id, x]) => x.verdicts.map((y) => ({ source: id, ...y })))
  const byTheorem: Record<string, { passed: number; failed: number }> = {}
  for (const x of all) { byTheorem[x.theorem] = byTheorem[x.theorem] ?? { passed: 0, failed: 0 }; if (x.passed) byTheorem[x.theorem]!.passed += 1; else byTheorem[x.theorem]!.failed += 1 }
  return { sources, followUps, checked: all.length, passed: all.filter((x) => x.passed).length, violations: all.filter((x) => !x.passed).map((x) => ({ source: x.source, theorem: x.theorem, says: x.says })), byTheorem }
}
export const BEACON_LAST = JSON.stringify({ pulse: { uri: 'https://beacon.nist.gov/beacon/2.0/chain/2/pulse/2000107', chainIndex: 2, pulseIndex: 2000107, timeStamp: '2026-10-26T09:10:00.000Z', period: 60000, localRandomValue: '00'.repeat(64), outputValue: 'A'.repeat(128), signatureValue: 'B'.repeat(1024), precommitmentValue: 'C'.repeat(128), listValues: [{ type: 'previous', value: 'D'.repeat(128) }] } })
export const STH = JSON.stringify({ tree_size: 3461480042, timestamp: 1793005826714, sha256_root_hash: 'BUW2/ROzVcSOkLmZvNPkf3njsT5E2kno4MriPzOPWaU=', tree_head_signature: 'x' })
export const NVD = JSON.stringify({ vulnerabilities: [{ cve: { id: 'CVE-2024-37880', published: '2024-06-10T02:15:47.160', lastModified: '2026-06-17T07:38:58.583', metrics: { cvssMetricV31: [{ cvssData: { baseScore: 7.5 } }] } } }] })
export const CERN = JSON.stringify({ hits: { total: 5566, hits: [{ id: '5209', metadata: { title: 'Higgs to two photons from 2011', files: [{ size: 869, checksum: 'adler32:dca4af81' }], relations: [{ doi: '10.7483/OPENDATA.CMS.N9MJ.QEEC' }] } }] } })

const NIST_OPEN_DATA = 'https://data.nist.gov/rmm/records?page=0&size=5'
/** NIST Open Data, read as the client hands the body. Each record is one coil. The live plasma of that coil is two realities, the digits 1 and 6, and each reality has six neighbours. Nothing is fetched. */
export const nistOpenData = (raw: unknown = true) => {
  if (raw === true) return { phase: 'requests' as const, source: 'nist-opendata' as const, fetched: false as const, written: false as const, request: { id: 'nist-opendata' as const, method: 'GET' as const, url: NIST_OPEN_DATA, accept: 'application/json' as const }, tools: ['kem', 'slh', 'ed25519', 'ecdsa', 'shake'] as const, says: 'NIST Open Data is asked at data.nist.gov. Nothing is fetched. Hand the body back as nist.' }
  let body: { ResultCount?: number; ResultData?: { title?: unknown; doi?: unknown }[] } | null = null
  if (typeof raw === 'string') { try { body = JSON.parse(raw) as typeof body } catch { body = null } }
  else if (isObj(raw)) body = raw as NonNullable<typeof body>
  const rows = Array.isArray(body?.ResultData) ? body.ResultData : []
  const records = rows.map((row) => {
    const title = typeof row.title === 'string' ? row.title : ''
    const doi = String(row.doi ?? '').replace(/^doi:/i, '')
    const address = uuid(`nist-opendata\n${doi}\n${title}`)
    const coil = rodinCoil(address)
    const realities = coil.plasma.live.realities.map((reality) => ({ digit: reality.digit, address: reality.address, sealed: reality.sealed, closed: reality.closed, neighbours: reality.realities.length }))
    // a DOI is required when the record names one; a record without a DOI still coils, and the page holds when every named DOI is well formed and at least one record carries one
    const doiHolds = doi ? /^10\.\d{4,}\/\S+$/.test(doi) : null
    return { title, doi, address, sealed: uuidSeal(address).valid, doiHolds, realities, live: coil.holds === true && realities.length === 2 && realities.every((reality) => reality.neighbours === 6 && reality.sealed && reality.closed) }
  })
  const total = typeof body?.ResultCount === 'number' ? body.ResultCount : rows.length
  const withDoi = records.filter((row) => row.doiHolds !== null)
  const holds = records.length > 0 && total >= records.length && records.every((row) => row.live && row.sealed && row.doiHolds !== false) && withDoi.some((row) => row.doiHolds === true)
  return { phase: 'experience' as const, source: 'nist-opendata' as const, fetched: false as const, written: false as const, total, records: records.length, dois: withDoi.length, rows: records, realities: records.flatMap((row) => row.realities), holds, theorems: ['textbook_doi_well_formed', 'textbook_total_at_least_page', 'textbook_coil_green'] as const, says: holds ? `${records.length} NIST Open Data record(s), ${withDoi.length} with a DOI. Each address is a coil, and its two realities are the digits 1 and 6, each with six neighbours.` : 'a NIST Open Data record did not hold its DOI and its two realities' }
}

/** CERN Open Data, read as the client hands the body. Each hit is one coil. The live plasma of that coil is two realities, the digits 1 and 6, and each reality has six neighbours. Nothing is fetched. */
export const cernOpenData = (raw: unknown = true, config?: CryptoConfig) => {
  if (raw === true) {
    if (!config) throw new Error('cernOpenData requests need crypto config from payload { cryptoConfig } or tenants.settings.arguments')
    return { phase: 'requests' as const, source: 'cern-opendata' as const, fetched: false as const, written: false as const, request: { id: 'cern-opendata' as const, method: 'GET' as const, url: cfgAttest(config, 'cern-opendata').url, accept: 'application/json' as const }, tools: ['kem', 'slh', 'ed25519', 'ecdsa', 'shake'] as const, says: 'CERN Open Data is asked at opendata.cern.ch. Nothing is fetched. Hand the body back as cern.' }
  }
  let body: { hits?: { total?: number; hits?: { id?: unknown; metadata?: { title?: unknown; relations?: { doi?: unknown }[] } }[] } } | null = null
  if (typeof raw === 'string') { try { body = JSON.parse(raw) as typeof body } catch { body = null } }
  else if (isObj(raw)) body = raw as NonNullable<typeof body>
  const rows = Array.isArray(body?.hits?.hits) ? body.hits.hits : []
  const records = rows.map((row) => {
    const title = typeof row.metadata?.title === 'string' ? row.metadata.title : ''
    const doiRaw = row.metadata?.relations?.find((r) => typeof r?.doi === 'string')?.doi
    const doi = String(doiRaw ?? '').replace(/^doi:/i, '')
    const id = String(row.id ?? '')
    const address = uuid(`cern-opendata\n${doi || id}\n${title}`)
    const coil = rodinCoil(address)
    const realities = coil.plasma.live.realities.map((reality) => ({ digit: reality.digit, address: reality.address, sealed: reality.sealed, closed: reality.closed, neighbours: reality.realities.length }))
    const doiHolds = doi ? /^10\.\d{4,}\/\S+$/.test(doi) : null
    return { id, title, doi, address, sealed: uuidSeal(address).valid, doiHolds, realities, live: coil.holds === true && realities.length === 2 && realities.every((reality) => reality.neighbours === 6 && reality.sealed && reality.closed) }
  })
  const total = typeof body?.hits?.total === 'number' ? body.hits.total : rows.length
  const withDoi = records.filter((row) => row.doiHolds !== null)
  const holds = records.length > 0 && total >= records.length && records.every((row) => row.live && row.sealed && row.doiHolds !== false) && withDoi.some((row) => row.doiHolds === true)
  return { phase: 'experience' as const, source: 'cern-opendata' as const, fetched: false as const, written: false as const, total, records: records.length, dois: withDoi.length, rows: records, realities: records.flatMap((row) => row.realities), holds, theorems: ['textbook_doi_well_formed', 'textbook_total_at_least_page', 'textbook_coil_green'] as const, says: holds ? `${records.length} CERN Open Data record(s), ${withDoi.length} with a DOI. Each address is a coil, and its two realities are the digits 1 and 6, each with six neighbours.` : 'a CERN Open Data record did not hold its DOI and its two realities' }
}

