import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** LEDGER — DOUBLE-ENTRY BOOKKEEPING, AS ARITHMETIC (chosen by the public-API registry, not by hand). Keeping books is
 *  numbers: the running balance, total debits, total credits, whether a trial balances, the batches a posting needs,
 *  journal line cost, a reconciliation gap, and budget variance. Crosses to `accounting` — ledger is what accounting
 *  closes on. A measure. */

const PROOF = 'ledger arithmetic (balance, debit, credit, trial, posting batches, journal cost, reconcile gap, budget variance); double-entry bookkeeping; a measure crossed to accounting'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'ledger', dst: 'accounting', formula, value, proof: PROOF, ...extra }, holds, { name: `ledger.${name}`, params })

export class LedgerFormulas {
  /** BALANCE: debits net of credits, floored at zero. value max(0, debits − credits). */
  static balance(debits: number, credits: number): CrossFormula { return c('ledger-balance', 'balance(debits, credits) = max(0, debits − credits)', Math.max(0, debits - credits), nat(debits, credits), 'balance', [debits, credits]) }
  /** TOTAL CREDITS: a line amount over its count. value amount · count. */
  static credit(amount: number, count: number): CrossFormula { return c('ledger-credit', 'credit(amount, count) = amount · count', amount * count, nat(amount, count), 'credit', [amount, count]) }
  /** TOTAL DEBITS: a line amount over its count. value amount · count. */
  static debit(amount: number, count: number): CrossFormula { return c('ledger-debit', 'debit(amount, count) = amount · count', amount * count, nat(amount, count), 'debit', [amount, count]) }
  /** JOURNAL COST: lines at a per-line rate. value lines · rate. */
  static journal(lines: number, rate: number): CrossFormula { return c('ledger-journal', 'journal(lines, rate) = lines · rate', lines * rate, nat(lines, rate), 'journal', [lines, rate]) }
  /** POSTING: the batches entries need at a per-batch size. value ⌈entries / perBatch⌉. */
  static posting(entries: number, perBatch: number): CrossFormula { return c('ledger-posting', 'posting(entries, perBatch) = ⌈entries / perBatch⌉', perBatch > 0 ? Math.ceil(entries / perBatch) : 0, nat(entries, perBatch) && perBatch > 0, 'posting', [entries, perBatch]) }
  /** RECONCILE: the gap of books over bank, floored at zero. value max(0, book − bank). */
  static reconcile(book: number, bank: number): CrossFormula { return c('ledger-reconcile', 'reconcile(book, bank) = max(0, book − bank)', Math.max(0, book - bank), nat(book, bank), 'reconcile', [book, bank]) }
  /** TRIAL BALANCE: 1 when debits equal credits. value [debits = credits]. */
  static trial(debits: number, credits: number): CrossFormula { return c('ledger-trial', 'trial(debits, credits) = [debits = credits]', debits === credits ? 1 : 0, nat(debits, credits), 'trial', [debits, credits]) }
  /** BUDGET VARIANCE: actual over budget, floored at zero. value max(0, actual − budget). */
  static variance(actual: number, budget: number): CrossFormula { return c('ledger-variance', 'variance(actual, budget) = max(0, actual − budget)', Math.max(0, actual - budget), nat(actual, budget), 'variance', [actual, budget]) }
}

for (const name of ['balance', 'credit', 'debit', 'journal', 'posting', 'reconcile', 'trial', 'variance'] as const)
  qpuHexRegisterOf('ledger', name, (LedgerFormulas[name] as (...x: unknown[]) => unknown).bind(LedgerFormulas))
