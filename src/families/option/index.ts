import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** OPTION — A CALL OPTION, AS ARITHMETIC (chosen by the public-API registry, not by hand). An option is numbers: the
 *  intrinsic value against the strike, the time value left in the premium, the payoff after cost, the break-even price,
 *  moneyness, the premium itself, the leverage it buys, and the value at exercise. Crosses to `trading` — an option is
 *  what a trade is written on. A measure. */

const PROOF = 'option arithmetic (intrinsic value, time value, payoff, break-even, moneyness, premium, leverage, exercise value); a call option as a measure crossed to trading'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'option', dst: 'trading', formula, value, proof: PROOF, ...extra }, holds, { name: `option.${name}`, params })

export class OptionFormulas {
  /** INTRINSIC VALUE of a call: how far it is in the money. value max(0, spot − strike). */
  static intrinsicvalue(spot: number, strike: number): CrossFormula { return c('option-intrinsicvalue', 'intrinsicvalue(spot, strike) = max(0, spot − strike)', Math.max(0, spot - strike), nat(spot, strike), 'intrinsicvalue', [spot, strike]) }
  /** TIME VALUE: the premium left over the intrinsic value. value max(0, premium − intrinsic). */
  static timevalue(premium: number, intrinsic: number): CrossFormula { return c('option-timevalue', 'timevalue(premium, intrinsic) = max(0, premium − intrinsic)', Math.max(0, premium - intrinsic), nat(premium, intrinsic), 'timevalue', [premium, intrinsic]) }
  /** PAYOFF of a call after its cost. value max(0, spot − strike − premium). */
  static payoff(spot: number, strike: number, premium: number): CrossFormula { return c('option-payoff', 'payoff(spot, strike, premium) = max(0, spot − strike − premium)', Math.max(0, spot - strike - premium), nat(spot, strike, premium), 'payoff', [spot, strike, premium]) }
  /** BREAK-EVEN price of a call: the strike plus what it cost. value strike + premium. */
  static breakeven(strike: number, premium: number): CrossFormula { return c('option-breakeven', 'breakeven(strike, premium) = strike + premium', strike + premium, nat(strike, premium), 'breakeven', [strike, premium]) }
  /** MONEYNESS: the spot as a percentage of the strike. value ⌊spot · 100 / strike⌋. */
  static moneyness(spot: number, strike: number): CrossFormula { return c('option-moneyness', 'moneyness(spot, strike) = ⌊spot · 100 / strike⌋', strike > 0 ? Math.floor((spot * 100) / strike) : 0, nat(spot, strike) && strike > 0, 'moneyness', [spot, strike]) }
  /** PREMIUM: the price of the option, intrinsic plus time value. value intrinsic + time. */
  static premium(intrinsic: number, time: number): CrossFormula { return c('option-premium', 'premium(intrinsic, time) = intrinsic + time', intrinsic + time, nat(intrinsic, time), 'premium', [intrinsic, time]) }
  /** LEVERAGE RATIO: the exposure the premium controls. value ⌊spot / premium⌋. */
  static leverageratio(spot: number, premium: number): CrossFormula { return c('option-leverageratio', 'leverageratio(spot, premium) = ⌊spot / premium⌋', premium > 0 ? Math.floor(spot / premium) : 0, nat(spot, premium) && premium > 0, 'leverageratio', [spot, premium]) }
  /** EXERCISE VALUE: the intrinsic value across the contracts held. value max(0, spot − strike) · contracts. */
  static exercisevalue(spot: number, strike: number, contracts: number): CrossFormula { return c('option-exercisevalue', 'exercisevalue(spot, strike, contracts) = max(0, spot − strike) · contracts', Math.max(0, spot - strike) * contracts, nat(spot, strike, contracts), 'exercisevalue', [spot, strike, contracts]) }
}

for (const name of ['breakeven', 'exercisevalue', 'intrinsicvalue', 'leverageratio', 'moneyness', 'payoff', 'premium', 'timevalue'] as const)
  qpuHexRegisterOf('option', name, (OptionFormulas[name] as (...x: unknown[]) => unknown).bind(OptionFormulas))
