import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** POLYMER — MACROMOLECULES AS ARITHMETIC. A chain is numbers: molecular weight from the monomer and the degree of
 *  polymerisation, the dispersity of a weight distribution, cross-link and crystalline fractions, monomer conversion,
 *  the glass transition a sample holds, tensile strength as force over area, and the chain length a run of units makes.
 *  Crosses to `materials` — a polymer is the material it becomes. A measure. */

const PROOF = 'polymer arithmetic (molecular weight, dispersity, cross-link, crystallinity, conversion, glass transition, tensile, chain length); macromolecules as a measure crossed to materials'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'polymer', dst: 'materials', formula, value, proof: PROOF, ...extra }, holds, { name: `polymer.${name}`, params })

export class PolymerFormulas {
  /** MOLECULAR WEIGHT: the monomer mass times the degree of polymerisation. value monomer · degree. */
  static molecularweight(monomer: number, degree: number): CrossFormula { return c('polymer-molecularweight', 'molecularweight(monomer, degree) = monomer · degree', monomer * degree, nat(monomer, degree), 'molecularweight', [monomer, degree]) }
  /** DISPERSITY: the weight-average over the number-average, as a percentage. value ⌊weightavg · 100 / numberavg⌋. */
  static dispersity(weightavg: number, numberavg: number): CrossFormula { return c('polymer-dispersity', 'dispersity(weightavg, numberavg) = ⌊weightavg · 100 / numberavg⌋', numberavg > 0 ? Math.floor((weightavg * 100) / numberavg) : 0, nat(weightavg, numberavg) && numberavg > 0, 'dispersity', [weightavg, numberavg]) }
  /** CROSS-LINK fraction: cross-links over chains, as a percentage. value ⌊links · 100 / chains⌋. */
  static crosslink(links: number, chains: number): CrossFormula { return c('polymer-crosslink', 'crosslink(links, chains) = ⌊links · 100 / chains⌋', chains > 0 ? Math.floor((links * 100) / chains) : 0, nat(links, chains) && chains > 0, 'crosslink', [links, chains]) }
  /** CRYSTALLINITY: the crystalline part of the whole, as a percentage. value ⌊crystalline · 100 / total⌋. */
  static crystallinity(crystalline: number, total: number): CrossFormula { return c('polymer-crystallinity', 'crystallinity(crystalline, total) = ⌊crystalline · 100 / total⌋', total > 0 ? Math.floor((crystalline * 100) / total) : 0, nat(crystalline, total) && total > 0 && crystalline <= total, 'crystallinity', [crystalline, total]) }
  /** CONVERSION: monomer reacted over monomer initial, as a percentage. value ⌊reacted · 100 / initial⌋. */
  static conversion(reacted: number, initial: number): CrossFormula { return c('polymer-conversion', 'conversion(reacted, initial) = ⌊reacted · 100 / initial⌋', initial > 0 ? Math.floor((reacted * 100) / initial) : 0, nat(reacted, initial) && initial > 0 && reacted <= initial, 'conversion', [reacted, initial]) }
  /** GLASS TRANSITION: the temperature a sample holds. value temperature. */
  static glass(temperature: number): CrossFormula { return c('polymer-glass', 'glass(temperature) = temperature', temperature, nat(temperature), 'glass', [temperature]) }
  /** TENSILE STRENGTH: force over the cross-sectional area. value ⌊force / area⌋. */
  static tensile(force: number, area: number): CrossFormula { return c('polymer-tensile', 'tensile(force, area) = ⌊force / area⌋', area > 0 ? Math.floor(force / area) : 0, nat(force, area) && area > 0, 'tensile', [force, area]) }
  /** CHAIN LENGTH: the units a chain holds over the monomer size. value ⌊units / monomer⌋. */
  static chainlength(units: number, monomer: number): CrossFormula { return c('polymer-chainlength', 'chainlength(units, monomer) = ⌊units / monomer⌋', monomer > 0 ? Math.floor(units / monomer) : 0, nat(units, monomer) && monomer > 0, 'chainlength', [units, monomer]) }
}

for (const name of ['chainlength', 'conversion', 'crosslink', 'crystallinity', 'dispersity', 'glass', 'molecularweight', 'tensile'] as const)
  qpuHexRegisterOf('polymer', name, (PolymerFormulas[name] as (...x: unknown[]) => unknown).bind(PolymerFormulas))
