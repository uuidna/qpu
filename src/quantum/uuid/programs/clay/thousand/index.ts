import { FACTOR_CERTIFICATES, createImpossible, decodeImpossible, testPrimality } from '../../b/1/c/2/3/6/2/1/index.ts'
import { catalogClay1000Bit } from '../../3/2/7/5/4/2/0/1/index.ts'
import { recomputeClay, reflectionOfRegister } from '../../9/d/1/0/1/4/3/9/index.ts'
import { call } from '../../3/8/5/9/0/2/0/f/index.ts'
import { TEXTBOOK_THEOREMS } from '../../3/4/7/e/0/c/e/0/index.ts'
import { THOUSAND, THOUSAND_SHARED, THOUSAND_WALK } from '../../6/6/3/7/3/f/6/6/index.ts'
import { LICENSE } from '../../a/f/3/d/e/a/5/f/index.ts'
import { hex, sha256, utf8 } from '../../9/e/8/6/7/0/6/8/index.ts'
import { canonicalText, seal, uuid, handleOf } from '../../2/7/1/a/7/6/4/9/index.ts'
import { recomputeClayPravets } from '../index.ts'
import { trimTrailingSlashes } from '../../sdk/path/index.ts'

const MASK16 = 0xffffn
const RADIX16 = 0x10000n

/** Exact 1000-bit Clay cyclotomic target 2^999 + 1 (relation_36: φ(74) = 36). */
export const CLAY_1000_N = (1n << 999n) + 1n

/** Prime factors of 2^999 + 1 (with multiplicity) from the certified cyclotomic decomposition. */
export const CLAY_1000_PRIMES: readonly bigint[] =
  (FACTOR_CERTIFICATES[CLAY_1000_N.toString()]?.factors ?? []).map(BigInt)

/** Minimal count of 16-bit Pravets limbs covering a b-bit integer (limbs16_cover). */
export const limbs16Width = (bits: number): number => (bits <= 0 ? 1 : Math.ceil(bits / 16))

/** Encode any non-negative BigInt into little-endian 16-bit Pravets limbs. */
export const toLimbs16BigInt = (n: bigint): number[] => {
  if (n < 0n) throw new Error('limb')
  if (n === 0n) return [0]
  const out: number[] = []
  for (let x = n; x > 0n; x >>= 16n) out.push(Number(x & MASK16))
  return out
}

/** Decode little-endian 16-bit Pravets limbs back into an exact non-negative BigInt. */
export const fromLimbs16BigInt = (limbs: readonly number[]): bigint => {
  let n = 0n
  let shift = 0n
  for (const limb of limbs) {
    if (!Number.isInteger(limb) || limb < 0 || limb > 0xffff) throw new Error('limb')
    n += BigInt(limb) << shift
    shift += 16n
  }
  return n
}

const roundTrip16 = (n: bigint): boolean => fromLimbs16BigInt(toLimbs16BigInt(n)) === n

/** Resolve every Clay MCP textbook-variant gap across universal Lean theorems and 16-bit limbs. */
export const clay1000TextbookGaps = () => {
  const solved = call('clay', { solve: true }).result!.structuredContent as {
    gaps: { shown: number; missing: number; of: number; products: { product: string; variants: number; shown: number; gaps: number }[] }
    variants: { product: string; variant: string; relation: string; value: number; shown: boolean; bits: number; categories: string[] }[]
  }
  const holding = new Map(recomputeClay().relations.map((r) => [r.name, r.holds]))
  const theoremSet = new Set(TEXTBOOK_THEOREMS.map((t) => t.key))
  const rows = solved.variants.map((v) => {
    const limbs = toLimbs16BigInt(BigInt(v.value))
    const provedByClay = holding.get(v.relation) === true
    const universalBacked = theoremSet.has(v.product)
    return {
      product: v.product,
      variant: v.variant,
      relation: v.relation,
      value: v.value,
      bits: v.bits,
      limbs16: limbs,
      limbsRoundTrip: roundTrip16(BigInt(v.value)),
      inTextbookLiteral: v.shown,
      provedByClay,
      universalBacked,
      resolved: provedByClay && universalBacked,
    }
  })
  const provedByClay = rows.filter((r) => r.provedByClay).length
  const universalBacked = rows.filter((r) => r.universalBacked).length
  const resolved = rows.filter((r) => r.resolved).length
  return {
    phase: 'clay-textbook-gaps' as const,
    products: solved.gaps.products.length,
    total: rows.length,
    literalInUniversal: solved.gaps.shown,
    missingLiterals: solved.gaps.missing,
    provedByClay,
    universalBacked,
    resolved,
    allResolved: rows.length > 0 && resolved === rows.length && rows.every((r) => r.limbsRoundTrip),
    byProduct: solved.gaps.products,
    rows,
  }
}

/** Deep-research Clay via Clay MCP across register, textbook gaps, 1000-qubit walk, 2^999+1 factoring, σ-trapdoor, and 63-limb Pravets codecs. */
export const clay1000Research = (origin = 'https://qpu.uuidna.com') => {
  const root = trimTrailingSlashes(origin)
  const reg = recomputeClay()
  const refl = reflectionOfRegister(reg.relations)
  const pravets38 = recomputeClayPravets()
  const textbookGaps = clay1000TextbookGaps()

  const members = THOUSAND_WALK.formulas.reduce((n, f) => n + f.reaches, 0)
  const allBound = THOUSAND_WALK.formulas.every((f) => f.binding !== null)
  const zeroReach = THOUSAND_WALK.formulas.filter((f) => f.reaches === 0).map((f) => f.name)
  const pegasusZero = zeroReach.includes('pegasus')
  const thermalZero = zeroReach.includes('thermal')

  const cat = catalogClay1000Bit(1, 5)
  const limbsN = toLimbs16BigInt(CLAY_1000_N)
  const limbsRoundTripN = fromLimbs16BigInt(limbsN) === CLAY_1000_N
  const productN = CLAY_1000_PRIMES.reduce((a, b) => a * b, 1n)
  const distinctPrimes = [...new Set(CLAY_1000_PRIMES.map((p) => p.toString()))]
  const allPrimesVerified = CLAY_1000_PRIMES.length >= 20 &&
    productN === CLAY_1000_N &&
    CLAY_1000_PRIMES.every((p) => testPrimality(p).prime && roundTrip16(p))

  const made = createImpossible({ bits: 1000, seed: 1n })
  const ok = decodeImpossible(made.N, made.witness)
  const bad = decodeImpossible(made.N, made.witness + 2n)
  const impossibleLimbs = toLimbs16BigInt(made.N)
  const impossibleAddress = uuid(JSON.stringify({ clay: 'impossible-integer', N: made.N.toString(), witness: made.witness.toString() }))
  const impossibleHolds = made.bits === 1000 &&
    made.reproducible === true &&
    ok.decoded === true &&
    ok.verified === true &&
    bad.decoded === false &&
    impossibleLimbs.length === limbs16Width(1000) &&
    roundTrip16(made.N) &&
    roundTrip16(made.p) &&
    roundTrip16(made.q) &&
    roundTrip16(made.witness) &&
    seal(impossibleAddress).valid

  const holds = reg.holding === reg.total &&
    reg.total === 38 &&
    refl.open.length === 0 &&
    pravets38.holds &&
    textbookGaps.allResolved &&
    THOUSAND_WALK.qubits === 1000 &&
    allBound &&
    pegasusZero &&
    thermalZero &&
    limbsN.length === 63 &&
    limbsRoundTripN &&
    allPrimesVerified &&
    cat.bits === 1000 &&
    cat.totalProducts === 327680 &&
    cat.totalVariants === 5243696 &&
    impossibleHolds

  const summary = {
    phase: 'clay-1000bit-research' as const,
    origin: root,
    holds,
    register: {
      total: reg.total,
      holding: reg.holding,
      open: refl.open.length,
      pairs: refl.pairs.length,
      maxBits: reg.maxBits,
      maxLimbs16: reg.maxLimbs16,
      pravetsHolds: pravets38.holds,
    },
    textbookGaps: {
      products: textbookGaps.products,
      total: textbookGaps.total,
      literalInUniversal: textbookGaps.literalInUniversal,
      provedByClay: textbookGaps.provedByClay,
      universalBacked: textbookGaps.universalBacked,
      resolved: textbookGaps.resolved,
      allResolved: textbookGaps.allResolved,
    },
    walk: {
      qubits: THOUSAND_WALK.qubits,
      formulas: THOUSAND.length,
      sharedNumbers: THOUSAND_SHARED.length,
      members,
      allBound,
      zeroReachProofs: [
        { formula: 'pegasus', reaches: 0, divisor: 3, theorem: 'pegasus_ne_two_pow', holds: pegasusZero },
        { formula: 'thermal', reaches: 0, divisor: 5, theorem: 'thermal_ne_two_pow', holds: thermalZero },
      ],
      triangularBridge: 'triangular_eq_nat_choose',
      limbsCoverTheorem: 'limbs16_cover',
    },
    cyclotomic1000: {
      bits: 1000,
      totientRelation: 'relation_36',
      limbs16: limbsN.length,
      radixBits: 16,
      radix: RADIX16.toString(),
      limbsRoundTrip: limbsRoundTripN,
      distinctPrimes: distinctPrimes.length,
      factorCount: CLAY_1000_PRIMES.length,
      productMatchesN: productN === CLAY_1000_N,
      allPrimesVerified,
      products: cat.totalProducts,
      bellPairs: cat.bellPairs,
      ghzTrinities: cat.ghzTrinities,
      variants: cat.totalVariants,
    },
    impossible1000: {
      bits: made.bits,
      limbs16: impossibleLimbs.length,
      reproducible: made.reproducible,
      witnessDecodes: ok.decoded && ok.verified,
      wrongWitnessRefused: !bad.decoded,
      address: impossibleAddress,
      sealed: seal(impossibleAddress).valid,
      doubleTorusBlindLimit: 21,
      witnessReachBits: 1000,
    },
  }

  const canonical = canonicalText(summary)
  const address = uuid(canonical)
  return {
    ...summary,
    address,
    handle: handleOf(address),
    sha256: hex(sha256(utf8(canonical))),
    sealed: seal(address).valid,
    standard: 'ISO/IEC 4879:2024' as const,
    licence: LICENSE.spdx,
    verify: { method: 'tools/call' as const, params: { name: 'verify' as const, arguments: { uuid: address, content: canonical } } },
  }
}
