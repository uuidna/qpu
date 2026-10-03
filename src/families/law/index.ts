import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** THE COURT TOOLKIT AS FORMULAS — ANY CASE, ANY JURISDICTION, NO ADVICE UNTIL REVIEWED. What a clerk computes in any
 *  court is arithmetic over the numbers that jurisdiction supplies: a limitation period in days, a filing deadline from
 *  a start day, a quorum and a majority or super-majority of a body, a notice period met or not. These are exact and
 *  jurisdiction-agnostic — you pass the jurisdiction's own years, percentages and counts. None of it is legal ADVICE:
 *  `reviewed(confirmed)` is the gate — a computed conclusion holds as advice only once a legal review has confirmed it
 *  TRUE against the authoritative document (data.law reads the court-accepted source). Until then every result is a
 *  lead, computed and receipted, never asserted as counsel. Run them in waves (split.kelvin → 0): time split, no heat. */

const PROOF = 'exact legal arithmetic (limitation days, deadlines, quorum, majority, super-majority, notice); a result is ADVICE only when reviewed TRUE against the authoritative document via data.law — otherwise a lead'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const f = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'law', dst: 'audit', formula, value, proof: PROOF, ...extra }, holds, { name: `law.${name}`, params })

export class LawFormulas {
  /** A limitation period of `years` in days (365-day years): the window to bring a claim. The jurisdiction sets the years. */
  static limitation(years: number): CrossFormula { return f('law-limitation', 'limitation(years) = years · 365 days', years * 365, nat(years), 'limitation', [years]) }
  /** A deadline: `start` day-number plus `days` — the day a filing is due (day numbers, e.g. Julian day). */
  static deadline(start: number, days: number): CrossFormula { return f('law-deadline', 'deadline(start, days) = start + days', start + days, nat(start, days), 'deadline', [start, days]) }
  /** The quorum of a body of `members` at `pct` percent, rounded up: the least present for business. */
  static quorum(members: number, pct: number): CrossFormula { return f('law-quorum', 'quorum(members, pct) = ⌈members · pct / 100⌉', members > 0 ? Math.ceil((members * pct) / 100) : 0, nat(members, pct) && members > 0 && pct <= 100, 'quorum', [members, pct]) }
  /** 1 when `votes` is a simple majority of `total` (more than half). */
  static majority(votes: number, total: number): CrossFormula { return f('law-majority', 'majority(votes, total) = [2 · votes > total]', total > 0 && 2 * votes > total ? 1 : 0, nat(votes, total) && votes <= total && total > 0, 'majority', [votes, total]) }
  /** 1 when `votes` meets a super-majority of `total` at `pct` percent (e.g. 67 for two-thirds, 75 for three-quarters). */
  static supermajority(votes: number, total: number, pct: number): CrossFormula { return f('law-supermajority', 'supermajority(votes, total, pct) = [100 · votes ≥ total · pct]', total > 0 && 100 * votes >= total * pct ? 1 : 0, nat(votes, total, pct) && votes <= total && total > 0 && pct <= 100, 'supermajority', [votes, total, pct]) }
  /** 1 when a notice of `given` days meets the `required` period. */
  static notice(required: number, given: number): CrossFormula { return f('law-notice', 'notice(required, given) = [given ≥ required]', given >= required ? 1 : 0, nat(required, given), 'notice', [required, given]) }
  /** THE ADVICE GATE: a conclusion is advice only when a legal review has confirmed it TRUE against the authoritative
   *  document (`confirmed` = 1 from a data.law review). value `confirmed`; holds ONLY when confirmed — so an unreviewed
   *  legal computation does not hold, and the unit never presents a lead as advice. */
  static reviewed(confirmed: number): CrossFormula { return f('law-reviewed', 'reviewed(confirmed) = confirmed; a result is ADVICE only when a review confirmed it TRUE on the document', confirmed === 1 ? 1 : 0, confirmed === 1, 'reviewed', [confirmed], { advice: confirmed === 1, note: 'otherwise a lead, not advice' }) }
}

for (const name of ['deadline', 'limitation', 'majority', 'notice', 'quorum', 'reviewed', 'supermajority'] as const)
  qpuHexRegisterOf('law', name, (LawFormulas[name] as (...x: unknown[]) => unknown).bind(LawFormulas))
