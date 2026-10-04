import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** PAYROLL — PAYING PEOPLE, AS ARITHMETIC (chosen by the registry, not by hand). What a company owes its staff is numbers:
 *  gross pay from a rate and hours, overtime past the standard week, net after deductions, the tax and benefit rates, the
 *  cost per head, leave accrued, and the share withheld. Crosses to `accounting` — payroll is a ledger line. A measure. */

const PROOF = 'payroll arithmetic (gross, overtime, net, tax rate, benefits, cost per head, accrual, withholding); a paying-people domain; a measure crossed to accounting'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'payroll', dst: 'accounting', formula, value, proof: PROOF, ...extra }, holds, { name: `payroll.${name}`, params })

export class PayrollFormulas {
  /** GROSS PAY: hours at an hourly rate. value rate · hours. */
  static gross(rate: number, hours: number): CrossFormula { return c('payroll-gross', 'gross(rate, hours) = rate · hours', rate * hours, nat(rate, hours), 'gross', [rate, hours]) }
  /** OVERTIME: hours worked past the standard week. value max(0, hours − standard). */
  static overtime(hours: number, standard: number): CrossFormula { return c('payroll-overtime', 'overtime(hours, standard) = max(0, hours − standard)', Math.max(0, hours - standard), nat(hours, standard), 'overtime', [hours, standard]) }
  /** NET PAY: gross after deductions. value max(0, gross − deductions). */
  static net(gross_: number, deductions: number): CrossFormula { return c('payroll-net', 'net(gross, deductions) = max(0, gross − deductions)', Math.max(0, gross_ - deductions), nat(gross_, deductions), 'net', [gross_, deductions]) }
  /** TAX RATE as a percentage of gross. value ⌊tax · 100 / gross⌋. */
  static taxrate(tax: number, gross_: number): CrossFormula { return c('payroll-taxrate', 'taxrate(tax, gross) = ⌊tax · 100 / gross⌋', gross_ > 0 ? Math.floor((tax * 100) / gross_) : 0, nat(tax, gross_) && gross_ > 0, 'taxrate', [tax, gross_]) }
  /** BENEFITS as a percentage of salary. value ⌊benefit · 100 / salary⌋. */
  static benefits(benefit: number, salary: number): CrossFormula { return c('payroll-benefits', 'benefits(benefit, salary) = ⌊benefit · 100 / salary⌋', salary > 0 ? Math.floor((benefit * 100) / salary) : 0, nat(benefit, salary) && salary > 0, 'benefits', [benefit, salary]) }
  /** COST PER HEAD: total payroll over the headcount. value ⌊total / employees⌋. */
  static costperhead(total: number, employees: number): CrossFormula { return c('payroll-costperhead', 'costperhead(total, employees) = ⌊total / employees⌋', employees > 0 ? Math.floor(total / employees) : 0, nat(total, employees) && employees > 0, 'costperhead', [total, employees]) }
  /** ACCRUAL: leave days accrued at a per-day rate. value days · rate. */
  static accrual(days: number, rate: number): CrossFormula { return c('payroll-accrual', 'accrual(days, rate) = days · rate', days * rate, nat(days, rate), 'accrual', [days, rate]) }
  /** WITHHOLDING as a percentage of gross. value ⌊withheld · 100 / gross⌋. */
  static withholding(withheld: number, gross_: number): CrossFormula { return c('payroll-withholding', 'withholding(withheld, gross) = ⌊withheld · 100 / gross⌋', gross_ > 0 ? Math.floor((withheld * 100) / gross_) : 0, nat(withheld, gross_) && gross_ > 0 && withheld <= gross_, 'withholding', [withheld, gross_]) }
}

for (const name of ['accrual', 'benefits', 'costperhead', 'gross', 'net', 'overtime', 'taxrate', 'withholding'] as const)
  qpuHexRegisterOf('payroll', name, (PayrollFormulas[name] as (...x: unknown[]) => unknown).bind(PayrollFormulas))
