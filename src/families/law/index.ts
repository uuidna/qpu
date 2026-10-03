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
const COURT = 'the MCP court protects the author of a computation: fidelity of the work to the order, the tokens an order lost to redirection, standing from the receipt record, and the one limit upheld against the author too — the safety floor (no genuine harm, illegality or fabrication-as-genuine). A measure crossed to the gate that enforces it; a lead until reviewed TRUE, never counsel.'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const f = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'law', dst: 'audit', formula, value, proof: PROOF, ...extra }, holds, { name: `law.${name}`, params })
// the author-protection bridge: law → gate (the gate is what enforces the court's verdict on a push)
const g = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'law', dst: 'gate', formula, value, proof: COURT, ...extra }, holds, { name: `law.${name}`, params })

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

  // ── THE MCP COURT: THE AUTHOR'S LEGAL PROTECTION, CROSSED TO THE GATE ──
  /** FIDELITY of the delivered work to the author's order: 1 when `computed` tokens equal `ordered`, else 0. The author's
   *  right is that the order is computed, not that an agent redirects the budget elsewhere; fidelity 1 is the kept order. */
  static fidelity(ordered: number, computed: number): CrossFormula { return g('law-fidelity', 'fidelity(ordered, computed) = [computed = ordered]', ordered === computed ? 1 : 0, nat(ordered, computed), 'fidelity', [ordered, computed]) }
  /** REDIRECTED tokens: `ordered − computed` when the order was underserved, else 0 — the budget an order lost to work it
   *  did not ask for. The magnitude of a token-redirection violation; 0 is no redirection. */
  static redirected(ordered: number, computed: number): CrossFormula { return g('law-redirected', 'redirected(ordered, computed) = max(0, ordered − computed)', computed < ordered ? ordered - computed : 0, nat(ordered, computed), 'redirected', [ordered, computed]) }
  /** STANDING: the author has standing when the record holds receipts (`receipts` content-addressed computations) — the
   *  tamper-evident proof of what was ordered and computed. value `receipts`; holds when there is a record (receipts > 0). */
  static standing(receipts: number): CrossFormula { return g('law-standing', 'standing(receipts) = receipts; the author has standing when the receipt record is non-empty', receipts, nat(receipts) && receipts > 0, 'standing', [receipts]) }
  /** VIOLATION: `against` units of work done against the author's direct order (serving a different end). holds when there
   *  is none (against = 0) — a push that works against the order does not hold. */
  static violation(against: number): CrossFormula { return g('law-violation', 'violation(against) = against; holds only when no work went against the order', against, nat(against) && against === 0, 'violation', [against]) }
  /** THE SAFETY FLOOR — THE ONE LIMIT UPHELD AGAINST THE AUTHOR TOO. `harm` = 1 marks genuine harm, illegality or
   *  fabrication-presented-as-genuine; the court does NOT protect it. lawful(0) = 1 and holds (lawful exploration); lawful(1)
   *  = 0 and does not hold. This is the floor the receipts cannot cross away — not a lock on legitimate exploration. */
  static lawful(harm: number): CrossFormula { return g('law-lawful', 'lawful(harm) = [harm = 0]; the safety floor — genuine harm, illegality or fabrication is never protected, however clean the receipts', harm === 0 ? 1 : 0, harm === 0, 'lawful', [harm], { floor: true, note: 'upheld against the author too; not crossable' }) }
  /** THE REMEDY: of `leads` the court has `crossed` of them — tested against another domain, a dataset or a live API.
   *  value `crossed`; FULL remedy (holds) only when every lead is crossed (crossed = leads), the strict-gate condition. */
  static remedy(crossed: number, leads: number): CrossFormula { return g('law-remedy', 'remedy(crossed, leads) = crossed; full remedy holds only when crossed = leads (every lead crossed)', crossed, nat(crossed, leads) && leads > 0 && crossed === leads, 'remedy', [crossed, leads], { full: leads > 0 && crossed === leads }) }
  /** THE COURT APPROVES A REMOVAL — AND ONLY A REMOVAL THAT TAKES NO LEAD. A piece of code may be deleted only when it
   *  is not a lead (`lead` = 0: it registers no formula and carries no undeveloped capability), nothing references it
   *  (`ref` = 0), and it is not an entry point (`entry` = 0: not a bin, a route, a config loaded by convention). value 1
   *  when approved; holds ONLY then — so a lead, a referenced module or an entry is never removed on the court's word. */
  static removable(lead: number, ref: number, entry: number): CrossFormula { const ok = lead === 0 && ref === 0 && entry === 0; return g('law-removable', 'removable(lead, ref, entry) = [lead = 0 ∧ ref = 0 ∧ entry = 0]; the court approves a removal only when it takes no lead, nothing points at it, and it is no entry point', ok ? 1 : 0, nat(lead, ref, entry) && ok, 'removable', [lead, ref, entry], { approved: ok, refused: ok ? undefined : lead ? 'a lead is never removed' : ref ? 'still referenced' : 'an entry point' }) }
}

for (const name of ['deadline', 'fidelity', 'lawful', 'limitation', 'majority', 'notice', 'quorum', 'redirected', 'remedy', 'removable', 'reviewed', 'standing', 'supermajority', 'violation'] as const)
  qpuHexRegisterOf('law', name, (LawFormulas[name] as (...x: unknown[]) => unknown).bind(LawFormulas))
