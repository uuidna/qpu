import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** DIVIDEND — PAYING SHAREHOLDERS, AS ARITHMETIC. Returning cash to owners is numbers: the yield on the price, the share of
 *  earnings paid out, how many times earnings cover the payout, the dividend per share, its growth, shares bought by
 *  reinvesting, the earnings retained, and the total income a holding throws off. Crosses to `portfolio` — a dividend is one
 *  line in a portfolio. A measure. */

const PROOF = 'dividend arithmetic (yield, payout ratio, cover, per-share, growth, reinvest, retention, total income); returning cash to owners as numbers; a measure crossed to portfolio'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'dividend', dst: 'portfolio', formula, value, proof: PROOF, ...extra }, holds, { name: `dividend.${name}`, params })

export class DividendFormulas {
  /** YIELD: annual dividend per share as a percentage of the share price. value ⌊dividend · 100 / price⌋. */
  static yield(dividend: number, price: number): CrossFormula { return c('dividend-yield', 'yield(dividend, price) = ⌊dividend · 100 / price⌋', price > 0 ? Math.floor((dividend * 100) / price) : 0, nat(dividend, price) && price > 0, 'yield', [dividend, price]) }
  /** PAYOUT RATIO: dividends paid as a percentage of earnings. value ⌊dividends · 100 / earnings⌋. */
  static payout(dividends: number, earnings: number): CrossFormula { return c('dividend-payout', 'payout(dividends, earnings) = ⌊dividends · 100 / earnings⌋', earnings > 0 ? Math.floor((dividends * 100) / earnings) : 0, nat(dividends, earnings) && earnings > 0, 'payout', [dividends, earnings]) }
  /** COVER: how many times earnings cover the dividends. value ⌊earnings / dividends⌋. */
  static cover(earnings: number, dividends: number): CrossFormula { return c('dividend-cover', 'cover(earnings, dividends) = ⌊earnings / dividends⌋', dividends > 0 ? Math.floor(earnings / dividends) : 0, nat(earnings, dividends) && dividends > 0, 'cover', [earnings, dividends]) }
  /** PER SHARE: total dividend spread over the shares. value ⌊total / shares⌋. */
  static pershare(total: number, shares: number): CrossFormula { return c('dividend-pershare', 'pershare(total, shares) = ⌊total / shares⌋', shares > 0 ? Math.floor(total / shares) : 0, nat(total, shares) && shares > 0, 'pershare', [total, shares]) }
  /** GROWTH: the rise over last period as a percentage of it. value ⌊max(0, now − prev) · 100 / prev⌋. */
  static growth(now: number, prev: number): CrossFormula { return c('dividend-growth', 'growth(now, prev) = ⌊max(0, now − prev) · 100 / prev⌋', prev > 0 ? Math.floor((Math.max(0, now - prev) * 100) / prev) : 0, nat(now, prev) && prev > 0, 'growth', [now, prev]) }
  /** REINVEST: shares bought by reinvesting an amount at a price. value ⌊amount / price⌋. */
  static reinvest(amount: number, price: number): CrossFormula { return c('dividend-reinvest', 'reinvest(amount, price) = ⌊amount / price⌋', price > 0 ? Math.floor(amount / price) : 0, nat(amount, price) && price > 0, 'reinvest', [amount, price]) }
  /** RETENTION: the share of earnings kept, one minus the payout ratio. value max(0, 100 − ⌊dividends · 100 / earnings⌋). */
  static retention(dividends: number, earnings: number): CrossFormula { return c('dividend-retention', 'retention(dividends, earnings) = max(0, 100 − ⌊dividends · 100 / earnings⌋)', earnings > 0 ? Math.max(0, 100 - Math.floor((dividends * 100) / earnings)) : 0, nat(dividends, earnings) && earnings > 0, 'retention', [dividends, earnings]) }
  /** TOTAL INCOME: dividend per share across the shares held. value pershare · shares. */
  static total(pershare: number, shares: number): CrossFormula { return c('dividend-total', 'total(pershare, shares) = pershare · shares', pershare * shares, nat(pershare, shares), 'total', [pershare, shares]) }
}

for (const name of ['cover', 'growth', 'payout', 'pershare', 'reinvest', 'retention', 'total', 'yield'] as const)
  qpuHexRegisterOf('dividend', name, (DividendFormulas[name] as (...x: unknown[]) => unknown).bind(DividendFormulas))
