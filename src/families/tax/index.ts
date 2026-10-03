import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** TAX — WHAT THE LEDGER OWES, BY LAW. Tax is arithmetic over income and the jurisdiction's own thresholds and rates: the
 *  marginal charge in a bracket, a flat or marginal rate, the effective rate, taxable income after a deduction, tax after
 *  a credit, capital gains, withholding, and the net left in hand. Exact and jurisdiction-agnostic — you pass the
 *  jurisdiction's thresholds and rates. Crosses to `law`: tax is assessed by the ledger and enforced by the court. A
 *  measure, not tax advice. */

const PROOF = 'tax arithmetic (bracket, marginal rate, effective rate, deduction, credit, capital gains, withholding, net) over the jurisdiction\'s own thresholds and rates; a measure crossed to law, not advice'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const t = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'tax', dst: 'law', formula, value, proof: PROOF, ...extra }, holds, { name: `tax.${name}`, params })

export class TaxFormulas {
  /** THE MARGINAL CHARGE in a bracket: `rate`% of the income above the bracket `threshold`. value ⌊(income − threshold) · rate / 100⌋. */
  static bracket(income: number, threshold: number, rate: number): CrossFormula { return t('tax-bracket', 'bracket(income, threshold, rate) = ⌊(income − threshold) · rate / 100⌋', income > threshold ? Math.floor(((income - threshold) * rate) / 100) : 0, nat(income, threshold, rate) && rate <= 100, 'bracket', [income, threshold, rate]) }
  /** A FLAT or marginal rate on the whole amount. value ⌊income · rate / 100⌋. */
  static marginal(income: number, rate: number): CrossFormula { return t('tax-marginal', 'marginal(income, rate) = ⌊income · rate / 100⌋', Math.floor((income * rate) / 100), nat(income, rate) && rate <= 100, 'marginal', [income, rate]) }
  /** THE EFFECTIVE RATE as a percentage of income. value ⌊tax · 100 / income⌋. */
  static effective(tax: number, income: number): CrossFormula { return t('tax-effective', 'effective(tax, income) = ⌊tax · 100 / income⌋', income > 0 ? Math.floor((tax * 100) / income) : 0, nat(tax, income) && income > 0, 'effective', [tax, income]) }
  /** TAXABLE INCOME after a deduction. value max(0, income − deduction). */
  static deduct(income: number, deduction: number): CrossFormula { return t('tax-deduct', 'deduct(income, deduction) = max(0, income − deduction)', Math.max(0, income - deduction), nat(income, deduction), 'deduct', [income, deduction]) }
  /** TAX AFTER A CREDIT applied against it. value max(0, tax − credit). */
  static credit(tax: number, credit: number): CrossFormula { return t('tax-credit', 'credit(tax, credit) = max(0, tax − credit)', Math.max(0, tax - credit), nat(tax, credit), 'credit', [tax, credit]) }
  /** CAPITAL GAINS TAX: `rate`% of the gain (proceeds over basis). value ⌊(proceeds − basis) · rate / 100⌋. */
  static capgains(proceeds: number, basis: number, rate: number): CrossFormula { return t('tax-capgains', 'capgains(proceeds, basis, rate) = ⌊(proceeds − basis) · rate / 100⌋', proceeds > basis ? Math.floor(((proceeds - basis) * rate) / 100) : 0, nat(proceeds, basis, rate) && rate <= 100, 'capgains', [proceeds, basis, rate]) }
  /** WITHHOLDING at source: `rate`% of the gross. value ⌊gross · rate / 100⌋. */
  static withhold(gross: number, rate: number): CrossFormula { return t('tax-withhold', 'withhold(gross, rate) = ⌊gross · rate / 100⌋', Math.floor((gross * rate) / 100), nat(gross, rate) && rate <= 100, 'withhold', [gross, rate]) }
  /** THE NET left in hand after the tax. value max(0, gross − tax). */
  static net(gross: number, tax: number): CrossFormula { return t('tax-net', 'net(gross, tax) = max(0, gross − tax)', Math.max(0, gross - tax), nat(gross, tax), 'net', [gross, tax]) }
}

for (const name of ['bracket', 'capgains', 'credit', 'deduct', 'effective', 'marginal', 'net', 'withhold'] as const)
  qpuHexRegisterOf('tax', name, (TaxFormulas[name] as (...x: unknown[]) => unknown).bind(TaxFormulas))
