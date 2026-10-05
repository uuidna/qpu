import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** THE COURT, FOR A LAW FIRM OR A BENCH — THE ARITHMETIC A MATTER TURNS ON, ANY JURISDICTION, A LEAD UNTIL REVIEWED.
 *  What a court or a firm computes on a matter is arithmetic over the numbers that jurisdiction supplies: whether the
 *  evidence meets the standard of proof, the damages with statutory interest, the taxed costs, the share under
 *  comparative fault, the expected value of a claim, a statutory cap, a fee. These are exact and jurisdiction-agnostic —
 *  you pass the jurisdiction's own percentages, rates and periods. NONE of it is legal ADVICE: it crosses to the `law`
 *  family whose `reviewed(confirmed)` gate is the one that turns a computed conclusion into counsel, and only once a
 *  legal review has confirmed it TRUE against the authoritative document. Until then every result is a lead — computed,
 *  receipted, never asserted as advice. Run in waves (split.kelvin → 0): time split, no heat. */

const PROOF = 'court arithmetic for a matter (standard of proof, damages, statutory interest, costs, comparative-fault apportionment, settlement value, statutory cap, fees; and across instances — criminal restitution, tax penalty, adverse-possession period, bankruptcy distribution, liquidated-damages reasonableness, statute-of-limitations bar, regulatory-deadline compliance); jurisdiction-agnostic. A MEASURE crossed to law, advice only when law.reviewed confirms it TRUE on the document — otherwise a lead, never counsel'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'court', dst: 'law', formula, value, proof: PROOF, ...extra }, holds, { name: `court.${name}`, params })

export class CourtFormulas {
  /** THE STANDARD OF PROOF met: 1 when `confidence` reaches the `required` percentage the jurisdiction sets for the
   *  matter — balance of probabilities (51), clear and convincing (~75), beyond reasonable doubt (~90). value [conf ≥ req]. */
  static standard(confidence: number, required: number): CrossFormula { return c('court-standard', 'standard(confidence, required) = [confidence ≥ required]', confidence >= required ? 1 : 0, nat(confidence, required) && confidence <= 100 && required <= 100, 'standard', [confidence, required]) }
  /** DAMAGES with simple statutory interest: principal plus principal · rate% · years. The jurisdiction sets the rate. */
  static damages(principal: number, rate: number, years: number): CrossFormula { return c('court-damages', 'damages(principal, rate, years) = principal + ⌊principal · rate · years / 100⌋', principal + Math.floor((principal * rate * years) / 100), nat(principal, rate, years), 'damages', [principal, rate, years]) }
  /** STATUTORY INTEREST over `days` at `rate`% per annum (365-day year, rounded down). */
  static interest(principal: number, rate: number, days: number): CrossFormula { return c('court-interest', 'interest(principal, rate, days) = ⌊principal · rate · days / 36500⌋', Math.floor((principal * rate * days) / 36500), nat(principal, rate, days), 'interest', [principal, rate, days]) }
  /** TAXED COSTS: billable `hours` at an hourly `rate`. */
  static costs(hours: number, rate: number): CrossFormula { return c('court-costs', 'costs(hours, rate) = hours · rate', hours * rate, nat(hours, rate), 'costs', [hours, rate]) }
  /** COMPARATIVE-FAULT APPORTIONMENT: a defendant's share of the `award` at `fault` of `total` fault units. */
  static apportion(award: number, fault: number, total: number): CrossFormula { return c('court-apportion', 'apportion(award, fault, total) = ⌊award · fault / total⌋', total > 0 ? Math.floor((award * fault) / total) : 0, nat(award, fault, total) && total > 0 && fault <= total, 'apportion', [award, fault, total]) }
  /** THE EXPECTED VALUE OF A CLAIM at `prob`% chance of success — what a settlement is measured against (a lead, not advice). */
  static settlement(claim: number, prob: number): CrossFormula { return c('court-settlement', 'settlement(claim, prob) = ⌊claim · prob / 100⌋', Math.floor((claim * prob) / 100), nat(claim, prob) && prob <= 100, 'settlement', [claim, prob]) }
  /** A STATUTORY DAMAGES CAP applied: the award, limited to the jurisdiction's statutory maximum. */
  static cap(award: number, statutory: number): CrossFormula { return c('court-cap', 'cap(award, statutory) = min(award, statutory)', Math.min(award, statutory), nat(award, statutory), 'cap', [award, statutory]) }
  /** A FEE by percentage: a contingency fee or a filing fee, `pct`% of the `amount`. */
  static fee(amount: number, pct: number): CrossFormula { return c('court-fee', 'fee(amount, pct) = ⌊amount · pct / 100⌋', Math.floor((amount * pct) / 100), nat(amount, pct) && pct <= 100, 'fee', [amount, pct]) }
  /** CRIMINAL RESTITUTION: the economic `harm` at the jurisdiction's restitution `multiplier`% (≤ 200), plus any fixed
   *  `punitive` the sentencing order adds. value ⌊harm · multiplier / 100⌋ + punitive. */
  static restitution(harm: number, multiplier: number, punitive: number): CrossFormula { return c('court-restitution', 'restitution(harm, multiplier, punitive) = ⌊harm · multiplier / 100⌋ + punitive', Math.floor((harm * multiplier) / 100) + punitive, nat(harm, multiplier, punitive) && multiplier <= 200, 'restitution', [harm, multiplier, punitive]) }
  /** TAX / REGULATORY PENALTY with daily escalation: the `base` penalty plus base · `days` late · `rate`% per annum. */
  static penalty(base: number, days: number, rate: number): CrossFormula { return c('court-penalty', 'penalty(base, days, rate) = base + ⌊base · days · rate / 36500⌋', base + Math.floor((base * days * rate) / 36500), nat(base, days, rate) && rate <= 100, 'penalty', [base, days, rate]) }
  /** ADVERSE POSSESSION period met: 1 when `held` years of open, continuous occupation reach the jurisdiction's
   *  `required` statutory period. The factual elements are law.reviewed's; this is the temporal check. value [held ≥ required]. */
  static possession(held: number, required: number): CrossFormula { return c('court-possession', 'possession(held, required) = [held ≥ required]', held >= required ? 1 : 0, nat(held, required), 'possession', [held, required]) }
  /** BANKRUPTCY PRO-RATA DISTRIBUTION: a creditor's share of the `estate` for its `claim` of `total` claims in the class. */
  static distribution(estate: number, claim: number, total: number): CrossFormula { return c('court-distribution', 'distribution(estate, claim, total) = ⌊estate · claim / total⌋', total > 0 ? Math.floor((estate * claim) / total) : 0, nat(estate, claim, total) && total > 0 && claim <= total, 'distribution', [estate, claim, total]) }
  /** LIQUIDATED DAMAGES reasonableness: 1 when the `clause` does not exceed the actual `harm` (a reasonable estimate,
   *  enforceable); 0 when it does (an unenforceable penalty). value [clause ≤ harm]. */
  static liquidated(clause: number, harm: number): CrossFormula { return c('court-liquidated', 'liquidated(clause, harm) = [clause ≤ harm]', clause <= harm ? 1 : 0, nat(clause, harm), 'liquidated', [clause, harm]) }
  /** STATUTE OF LIMITATIONS: 1 when the claim is time-barred — `elapsed` days since accrual exceed the `limit` the
   *  jurisdiction sets. value [elapsed > limit]. */
  static barred(elapsed: number, limit: number): CrossFormula { return c('court-barred', 'barred(elapsed, limit) = [elapsed > limit]', elapsed > limit ? 1 : 0, nat(elapsed, limit), 'barred', [elapsed, limit]) }
  /** REGULATORY DEADLINE compliance: 1 when a filing or breach-notification made in `elapsed` days is within the
   *  `deadline` the regulation sets (GDPR 72h, SEC, HMRC …). value [elapsed ≤ deadline]. */
  static compliant(elapsed: number, deadline: number): CrossFormula { return c('court-compliant', 'compliant(elapsed, deadline) = [elapsed ≤ deadline]', elapsed <= deadline ? 1 : 0, nat(elapsed, deadline), 'compliant', [elapsed, deadline]) }
}

for (const name of ['apportion', 'barred', 'cap', 'compliant', 'costs', 'damages', 'distribution', 'fee', 'interest', 'liquidated', 'penalty', 'possession', 'restitution', 'settlement', 'standard'] as const)
  qpuHexRegisterOf('court', name, (CourtFormulas[name] as (...x: unknown[]) => unknown).bind(CourtFormulas))
