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

const PROOF = 'court arithmetic for a matter (standard of proof, damages, statutory interest, costs, comparative-fault apportionment, settlement value, statutory cap, fees); jurisdiction-agnostic. A MEASURE crossed to law, advice only when law.reviewed confirms it TRUE on the document — otherwise a lead, never counsel'
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
}

for (const name of ['apportion', 'cap', 'costs', 'damages', 'fee', 'interest', 'settlement', 'standard'] as const)
  qpuHexRegisterOf('court', name, (CourtFormulas[name] as (...x: unknown[]) => unknown).bind(CourtFormulas))
