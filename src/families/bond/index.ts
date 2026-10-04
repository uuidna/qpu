import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** BOND — FIXED INCOME AS ARITHMETIC. A bond is numbers: the coupon it pays, its current yield, the value of a holding,
 *  its par (face) value, the discount below par, the premium above par, the periods to maturity, and the interest accrued
 *  since the last payment. Crosses to `econ` — a bond is an economic instrument. A measure. */

const PROOF = 'bond arithmetic (coupon payment, current yield, holding value, par, discount, premium, periods to maturity, accrued interest); fixed income as integers; a measure crossed to econ'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'bond', dst: 'econ', formula, value, proof: PROOF, ...extra }, holds, { name: `bond.${name}`, params })

export class BondFormulas {
  /** COUPON: annual coupon payment on a face value at a percent rate. value ⌊face · rate / 100⌋. */
  static coupon(face: number, rate: number): CrossFormula { return c('bond-coupon', 'coupon(face, rate) = ⌊face · rate / 100⌋', Math.floor((face * rate) / 100), nat(face, rate), 'coupon', [face, rate]) }
  /** YIELD: current yield as a percent of price. value ⌊coupon · 100 / price⌋. */
  static yield(coupon: number, price: number): CrossFormula { return c('bond-yield', 'yield(coupon, price) = ⌊coupon · 100 / price⌋', price > 0 ? Math.floor((coupon * 100) / price) : 0, nat(coupon, price) && price > 0, 'yield', [coupon, price]) }
  /** CURRENT: the market value of a holding. value price · qty. */
  static current(price: number, qty: number): CrossFormula { return c('bond-current', 'current(price, qty) = price · qty', price * qty, nat(price, qty), 'current', [price, qty]) }
  /** PAR: the par (face) value of a holding. value face · qty. */
  static par(face: number, qty: number): CrossFormula { return c('bond-par', 'par(face, qty) = face · qty', face * qty, nat(face, qty), 'par', [face, qty]) }
  /** DISCOUNT: the amount a price sits below par. value max(0, face − price). */
  static discount(face: number, price: number): CrossFormula { return c('bond-discount', 'discount(face, price) = max(0, face − price)', Math.max(0, face - price), nat(face, price), 'discount', [face, price]) }
  /** PREMIUM: the amount a price sits above par. value max(0, price − face). */
  static premium(price: number, face: number): CrossFormula { return c('bond-premium', 'premium(price, face) = max(0, price − face)', Math.max(0, price - face), nat(price, face), 'premium', [price, face]) }
  /** MATURITY: the number of coupon periods to maturity. value years · periods. */
  static maturity(years: number, periods: number): CrossFormula { return c('bond-maturity', 'maturity(years, periods) = years · periods', years * periods, nat(years, periods), 'maturity', [years, periods]) }
  /** ACCRUED: interest accrued since the last payment. value ⌊coupon · days / period⌋. */
  static accrued(coupon: number, days: number, period: number): CrossFormula { return c('bond-accrued', 'accrued(coupon, days, period) = ⌊coupon · days / period⌋', period > 0 ? Math.floor((coupon * days) / period) : 0, nat(coupon, days, period) && period > 0, 'accrued', [coupon, days, period]) }
}

for (const name of ['accrued', 'coupon', 'current', 'discount', 'maturity', 'par', 'premium', 'yield'] as const)
  qpuHexRegisterOf('bond', name, (BondFormulas[name] as (...x: unknown[]) => unknown).bind(BondFormulas))
