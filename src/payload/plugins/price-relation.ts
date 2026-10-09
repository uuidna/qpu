/**
 * Price = CrossFormula relations among quantities the tree names
 * (lattice, scale, access mode, shots, seal, cart/seats, FX when rate given).
 *
 * No priceInUSD. Each case is court-tried for up-to-date stability:
 * law.fidelity + court.standard + law.standing; incomplete pairs gate holds false.
 * Live cloud tickets: formulated hex identity on the job, not a vendor dollar SKU.
 */
import '../../families/ecommerce/index.js'
import '../../families/cloud/index.js'
import '../../families/quantum/index.js'
import '../../families/pricing/index.js'
import '../../families/payment/index.js'
import '../../families/combinatorics/index.js'
import '../../families/access/index.js'
import '../../families/court/index.js'
import '../../families/law/index.js'
import { AccessFormulas } from '../../families/access/index.js'
import { CloudFormulas } from '../../families/cloud/index.js'
import { CombinatoricsFormulas } from '../../families/combinatorics/index.js'
import { CourtFormulas } from '../../families/court/index.js'
import { EcommerceFormulas } from '../../families/ecommerce/index.js'
import { LawFormulas } from '../../families/law/index.js'
import { PaymentFormulas } from '../../families/payment/index.js'
import { PricingFormulas } from '../../families/pricing/index.js'
import { QuantumFormulas } from '../../families/quantum/index.js'
import { qpuHexUuidOf, qpuLatticeNamesOf } from '../../quantum/processing/unit/index.js'

export type PriceLeg = {
  family: string
  formula: string
  address: string
  params: readonly number[]
  slots: readonly string[]
  value: number
  hex: string | null
  holds: boolean
}

/** Job / offer identity as formulated hex — not an IBM/Braket dollar SKU. */
export type PriceTicket = {
  kind: 'formulated-ticket'
  minted: false
  address: string
  hex: string | null
  vendorIndex: number | null
  shots: number | null
  batches: number | null
  mode: number | null
  sealIndex: number | null
}

/** Per-case court trial — same gate style as connector/law/court (recomputed each call). */
export type PriceCourtTrial = {
  kind: 'price-court'
  /** law.fidelity(ordered, computed) — legs asked vs legs that hold. */
  fidelity: PriceLeg
  /** court.standard(confidence, 100) — all holding legs required. */
  standard: PriceLeg
  /** law.standing(receipts) — hex-backed legs are the receipt record. */
  standing: PriceLeg
  /** law.reviewed(0) — advice gate stays a lead (do not flip prize/citation). */
  reviewed: PriceLeg
  /** court.costs when hours·rate named; else null. */
  costs: PriceLeg | null
  holds: boolean
}

export type PriceRelationInput = {
  items?: number
  unit?: number
  shots?: number
  batches?: number
  vendorIndex?: number
  mode?: number
  sealIndex?: number
  load?: number
  perNode?: number
  hours?: number
  rate?: number
  seats?: number
  perSeat?: number
  fxAmount?: number
  fxRate?: number
  slug?: string
  vendor?: string
  latticeCost?: boolean
}

export type PriceRelation = {
  kind: 'price-relation'
  ticket: PriceTicket
  legs: readonly PriceLeg[]
  bare: readonly string[]
  measure: number | null
  court: PriceCourtTrial
  holds: boolean
  goal: 'OPEN' | 'LEAD'
}

const legOf = (
  family: string,
  formula: string,
  slots: readonly string[],
  params: readonly number[],
  value: number,
  holds: boolean,
  hex?: string | null,
): PriceLeg => ({
  family,
  formula,
  address: `${family}.${formula}`,
  params,
  slots,
  value,
  hex: hex ?? (() => {
    try {
      return qpuHexUuidOf({ family, program: [formula], params: [...params] })
    } catch {
      return null
    }
  })(),
  holds,
})

const intOf = (x: unknown, min = 0): number | null =>
  typeof x === 'number' && Number.isSafeInteger(x) ? Math.max(min, x) : null

const crossToLeg = (family: string, formula: string, slots: readonly string[], params: readonly number[], row: { value: number; holds: boolean; hex?: string }): PriceLeg =>
  legOf(family, formula, slots, params, Number(row.value), row.holds === true, row.hex ?? null)

/**
 * Court-try one price case. Confidence = holding legs / (legs + bare half-pairs) × 100.
 * Required standard = 100 (every named slot must participate in a holding leg).
 * Recomputed each call — up-to-date stability, not a cached demotion flag.
 */
export const priceCourtTrialOf = (
  legs: readonly PriceLeg[],
  bare: readonly string[],
  measure: number | null,
  costsInput?: { hours: number; rate: number },
): PriceCourtTrial => {
  const holding = legs.filter((l) => l.holds === true)
  const ordered = legs.length + bare.length
  const computed = holding.length
  const fidelity = LawFormulas.fidelity(ordered, computed)
  const denom = Math.max(1, ordered)
  const confidence = bare.length === 0 && legs.length > 0
    ? Math.floor((holding.length * 100) / denom)
    : 0
  const standard = CourtFormulas.standard(confidence, 100)
  const receipts = holding.filter((l) => typeof l.hex === 'string' && l.hex.length > 0).length
  const standing = LawFormulas.standing(receipts)
  const reviewed = LawFormulas.reviewed(0)
  const costs = costsInput
    ? (() => {
        const row = CourtFormulas.costs(costsInput.hours, costsInput.rate)
        return crossToLeg('court', 'costs', ['hours', 'rate'], [costsInput.hours, costsInput.rate], row)
      })()
    : null

  const fidelityLeg = crossToLeg('law', 'fidelity', ['ordered', 'computed'], [ordered, computed], fidelity)
  const standardLeg = crossToLeg('court', 'standard', ['confidence', 'required'], [confidence, 100], standard)
  const standingLeg = crossToLeg('law', 'standing', ['receipts'], [receipts], standing)
  const reviewedLeg = crossToLeg('law', 'reviewed', ['confirmed'], [0], reviewed)

  // Gate holds when court standard + fidelity match + standing; reviewed stays lead (not advice).
  const holds =
    bare.length === 0 &&
    measure !== null &&
    legs.length > 0 &&
    standard.holds === true &&
    standard.value === 1 &&
    fidelity.holds === true &&
    fidelity.value === 1 &&
    standing.holds === true &&
    standing.value > 0

  return {
    kind: 'price-court',
    fidelity: fidelityLeg,
    standard: standardLeg,
    standing: standingLeg,
    reviewed: reviewedLeg,
    costs,
    holds,
  }
}

/**
 * Compute relational price, then court-try the case.
 * Partial FX / cart / cost pairs → bare → court.standard fails → holds false.
 */
export const priceRelationOf = (input: PriceRelationInput = {}): PriceRelation => {
  const lattice = qpuLatticeNamesOf()
  const legs: PriceLeg[] = []
  const bare: string[] = []

  const shots = intOf(input.shots)
  const batches = intOf(input.batches, 1) ?? (shots !== null ? 1 : null)
  const vendorIndex = intOf(input.vendorIndex)
  const mode = typeof input.mode === 'number' && Number.isSafeInteger(input.mode) ? input.mode & 7 : null
  const sealIndex = typeof input.sealIndex === 'number' && Number.isSafeInteger(input.sealIndex) ? input.sealIndex & 7 : null

  if (shots !== null && batches !== null) {
    const s = QuantumFormulas.shots(shots, batches)
    legs.push(legOf('quantum', 'shots', ['shots', 'batches'], [shots, batches], Number(s.value), s.holds === true, s.hex ?? null))
  }

  if (vendorIndex !== null) {
    const n = Math.max(vendorIndex + 1, 1)
    const c = CombinatoricsFormulas.combinations(n, 1)
    legs.push(legOf('combinatorics', 'combinations', ['n', 'k'], [n, 1], Number(c.value), c.holds === true, c.hex ?? null))
  }

  // Unix mode digit 0..7 → access.rank (screen wants capability bitmask 31, not chmod).
  if (mode !== null) {
    const a = AccessFormulas.rank(mode)
    legs.push(legOf('access', 'rank', ['h'], [mode], Number(a.value), a.holds === true, a.hex ?? null))
  }

  if (sealIndex !== null) {
    const n = Math.min(4, Math.max(1, sealIndex + 1))
    const b = CombinatoricsFormulas.binomial(n)
    legs.push(legOf('combinatorics', 'binomial', ['n'], [n], Number(b.value), b.holds === true, b.hex ?? null))
  }

  const load = intOf(input.load)
  const perNode = intOf(input.perNode)
  if (load !== null && perNode !== null && perNode > 0) {
    const sc = CloudFormulas.scale(load, perNode)
    legs.push(legOf('cloud', 'scale', ['load', 'perNode'], [load, perNode], Number(sc.value), sc.holds === true, sc.hex ?? null))
  } else if (load !== null || perNode !== null) {
    if (load === null) bare.push('load')
    if (perNode === null || perNode === 0) bare.push('perNode')
  }

  const hours = intOf(input.hours)
  const rate = intOf(input.rate)
  if (hours !== null && rate !== null) {
    const cost = CloudFormulas.cost(hours, rate)
    legs.push(legOf('cloud', 'cost', ['hours', 'rate'], [hours, rate], Number(cost.value), cost.holds === true, cost.hex ?? null))
  } else if (hours !== null || rate !== null) {
    if (hours === null) bare.push('hours')
    if (rate === null) bare.push('rate')
  }

  const items = intOf(input.items)
  const unit = intOf(input.unit)
  if (items !== null && unit !== null) {
    const cart = EcommerceFormulas.cart(items, unit)
    legs.push(legOf('ecommerce', 'cart', ['items', 'price'], [items, unit], Number(cart.value), cart.holds === true, cart.hex ?? null))
  } else if (items !== null || unit !== null) {
    if (items === null) bare.push('items')
    if (unit === null) bare.push('unit')
  }

  const seats = intOf(input.seats)
  const perSeat = intOf(input.perSeat)
  if (seats !== null && perSeat !== null) {
    const s = PricingFormulas.seats(seats, perSeat)
    legs.push(legOf('pricing', 'seats', ['users', 'perSeat'], [seats, perSeat], Number(s.value), s.holds === true, s.hex ?? null))
  } else if (seats !== null || perSeat !== null) {
    if (seats === null) bare.push('seats')
    if (perSeat === null) bare.push('perSeat')
  }

  const fxAmount = intOf(input.fxAmount)
  const fxRate = intOf(input.fxRate)
  if (fxAmount !== null && fxRate !== null) {
    const fx = PaymentFormulas.fx(fxAmount, fxRate)
    legs.push(legOf('payment', 'fx', ['amount', 'rate'], [fxAmount, fxRate], Number(fx.value), fx.holds === true, fx.hex ?? null))
  } else if (fxAmount !== null || fxRate !== null) {
    if (fxAmount === null) bare.push('fxAmount')
    if (fxRate === null) bare.push('fxRate')
  }

  const wantLattice =
    input.latticeCost === true ||
    (!legs.some((l) => l.address === 'cloud.cost' || l.address === 'ecommerce.cart' || l.address === 'pricing.seats') && bare.length === 0)
  if (wantLattice && !legs.some((l) => l.address === 'cloud.cost')) {
    const hybrid = lattice.coins + lattice.seed
    const cost = CloudFormulas.cost(1, hybrid)
    legs.push(legOf('cloud', 'cost', ['hours', 'rate'], [1, hybrid], Number(cost.value), cost.holds === true, cost.hex ?? null))
  }

  let ticketHex: string | null = null
  try {
    ticketHex = qpuHexUuidOf({
      family: 'quantum',
      program: ['shots'],
      params: [shots ?? 0, batches ?? 1],
    })
  } catch {
    ticketHex = null
  }
  const slug = input.slug ?? input.vendor ?? 'job'
  const ticket: PriceTicket = {
    kind: 'formulated-ticket',
    minted: false,
    address: `ticket.${slug}·quantum.shots(${shots ?? 0},${batches ?? 1})·vendor[${vendorIndex ?? '—'}]·mode${mode ?? '—'}·seal${sealIndex ?? '—'}`,
    hex: ticketHex,
    vendorIndex,
    shots,
    batches,
    mode,
    sealIndex,
  }

  const measureLegs = legs.filter((l) =>
    l.address === 'ecommerce.cart' || l.address === 'cloud.cost' || l.address === 'pricing.seats' || l.address === 'payment.fx',
  )
  const measure = measureLegs.length ? measureLegs.reduce((acc, l) => acc + l.value, 0) : null
  const uniqueBare = [...new Set(bare)]
  const court = priceCourtTrialOf(
    legs,
    uniqueBare,
    measure,
    hours !== null && rate !== null ? { hours, rate } : undefined,
  )

  return {
    kind: 'price-relation',
    ticket,
    legs,
    bare: uniqueBare,
    measure,
    court,
    holds: court.holds === true,
    goal: court.holds === true ? 'OPEN' : 'LEAD',
  }
}

/** Catalog offer: lattice hybrid cloud.cost; court-tried per slug. */
export const catalogPriceRelationOf = (slug: string, extra: PriceRelationInput = {}): PriceRelation =>
  priceRelationOf({ slug, latticeCost: true, ...extra })

/** Native job ticket: vendor × shots × mode × seal — court-tried, not a cloud dollar SKU. */
export const nativeJobPriceOf = (input: {
  vendorIndex: number
  vendor: string
  shots?: number
  batches?: number
  mode?: number
  sealIndex?: number
  hours?: number
  rate?: number
  fxAmount?: number
  fxRate?: number
}): PriceRelation =>
  priceRelationOf({
    slug: input.vendor,
    vendor: input.vendor,
    vendorIndex: input.vendorIndex,
    shots: input.shots,
    batches: input.batches ?? 1,
    mode: input.mode,
    sealIndex: input.sealIndex,
    hours: input.hours,
    rate: input.rate,
    fxAmount: input.fxAmount,
    fxRate: input.fxRate,
    latticeCost: input.hours === undefined && input.rate === undefined,
  })
