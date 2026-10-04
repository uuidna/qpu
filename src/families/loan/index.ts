import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** LOAN — LENDING AS ARITHMETIC. A loan is numbers: the simple interest on a principal, the level monthly payment, the
 *  interest paid over the life, the balance still owed, the annualized rate of a fee, the months to clear it, a
 *  prepayment penalty, and a flat installment. Crosses to `banking` — a loan is what a bank books. A measure. */

const PROOF = 'loan arithmetic (simple interest, EMI, total interest, balance, APR, term, prepayment, installment); lending booked by the bank; a measure crossed to banking'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'loan', dst: 'banking', formula, value, proof: PROOF, ...extra }, holds, { name: `loan.${name}`, params })

export class LoanFormulas {
  /** SIMPLE INTEREST: principal at a percent rate over years. value ⌊principal · rate · years / 100⌋. */
  static simpleinterest(principal: number, rate: number, years: number): CrossFormula { return c('loan-simpleinterest', 'simpleinterest(principal, rate, years) = ⌊principal · rate · years / 100⌋', Math.floor((principal * rate * years) / 100), nat(principal, rate, years), 'simpleinterest', [principal, rate, years]) }
  /** EMI: the level monthly payment, principal plus a flat rate% spread over months. value ⌊principal · (100 + rate) / (100 · months)⌋. */
  static emi(principal: number, rate: number, months: number): CrossFormula { return c('loan-emi', 'emi(principal, rate, months) = ⌊principal · (100 + rate) / (100 · months)⌋', months > 0 ? Math.floor((principal * (100 + rate)) / (100 * months)) : 0, nat(principal, rate, months) && months > 0, 'emi', [principal, rate, months]) }
  /** TOTAL INTEREST: what the payments add up to beyond the principal. value max(0, emi · months − principal). */
  static totalinterest(emi: number, months: number, principal: number): CrossFormula { return c('loan-totalinterest', 'totalinterest(emi, months, principal) = max(0, emi · months − principal)', Math.max(0, emi * months - principal), nat(emi, months, principal), 'totalinterest', [emi, months, principal]) }
  /** BALANCE: the principal still owed after payments. value max(0, principal − paid). */
  static balance(principal: number, paid: number): CrossFormula { return c('loan-balance', 'balance(principal, paid) = max(0, principal − paid)', Math.max(0, principal - paid), nat(principal, paid), 'balance', [principal, paid]) }
  /** APR: a fee annualized against the principal over years, as a percent. value ⌊fee · 100 / (principal · years)⌋. */
  static apr(fee: number, principal: number, years: number): CrossFormula { return c('loan-apr', 'apr(fee, principal, years) = ⌊fee · 100 / (principal · years)⌋', principal > 0 && years > 0 ? Math.floor((fee * 100) / (principal * years)) : 0, nat(fee, principal, years) && principal > 0 && years > 0, 'apr', [fee, principal, years]) }
  /** TERM: the months to clear a principal at a monthly payment. value ⌈principal / emi⌉. */
  static term(principal: number, emi: number): CrossFormula { return c('loan-term', 'term(principal, emi) = ⌈principal / emi⌉', emi > 0 ? Math.ceil(principal / emi) : 0, nat(principal, emi) && emi > 0, 'term', [principal, emi]) }
  /** PREPAYMENT: a penalty on the balance paid off early, at a percent. value ⌊balance · penalty / 100⌋. */
  static prepayment(balance: number, penalty: number): CrossFormula { return c('loan-prepayment', 'prepayment(balance, penalty) = ⌊balance · penalty / 100⌋', Math.floor((balance * penalty) / 100), nat(balance, penalty), 'prepayment', [balance, penalty]) }
  /** INSTALLMENT: a flat installment, the principal split evenly over months. value ⌈principal / months⌉. */
  static installment(principal: number, months: number): CrossFormula { return c('loan-installment', 'installment(principal, months) = ⌈principal / months⌉', months > 0 ? Math.ceil(principal / months) : 0, nat(principal, months) && months > 0, 'installment', [principal, months]) }
}

for (const name of ['apr', 'balance', 'emi', 'installment', 'prepayment', 'simpleinterest', 'term', 'totalinterest'] as const)
  qpuHexRegisterOf('loan', name, (LoanFormulas[name] as (...x: unknown[]) => unknown).bind(LoanFormulas))
