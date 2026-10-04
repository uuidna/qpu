import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** PROTEIN — A SEQUENCE AS ARITHMETIC. A polypeptide is numbers: the bases that code it, the codons they group into, the
 *  residues translated, the molecular weight, a rough isoelectric point, the hydrophobic fraction, the folded fraction, the
 *  concentration in solution, and the total amino acids across chains. Crosses to `biochemistry` — protein is what
 *  biochemistry measures. A measure. */

const PROOF = 'protein arithmetic (molecular weight, residues, codons, isoelectric point, hydrophobicity, folding ratio, concentration, amino-acid count); a sequence as numbers; a measure crossed to biochemistry'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'protein', dst: 'biochemistry', formula, value, proof: PROOF, ...extra }, holds, { name: `protein.${name}`, params })

export class ProteinFormulas {
  /** MOLECULAR WEIGHT: residues at the average residue mass (110 Da). value residues · 110. */
  static molecularweight(residues: number): CrossFormula { return c('protein-molecularweight', 'molecularweight(residues) = residues · 110', residues * 110, nat(residues), 'molecularweight', [residues]) }
  /** RESIDUES: the amino acids translated from a base count, three bases to a codon. value ⌊bases / 3⌋. */
  static residues(bases: number): CrossFormula { return c('protein-residues', 'residues(bases) = ⌊bases / 3⌋', Math.floor(bases / 3), nat(bases), 'residues', [bases]) }
  /** CODONS: the codons that encode a chain — one per residue plus a stop codon. value residues + 1. */
  static codons(residues: number): CrossFormula { return c('protein-codons', 'codons(residues) = residues + 1', residues + 1, nat(residues), 'codons', [residues]) }
  /** ISOELECTRIC POINT: a rough pI from the acidic and basic residue counts around neutral 7. value max(0, 7 + basic − acidic). */
  static isoelectric(acidic: number, basic: number): CrossFormula { return c('protein-isoelectric', 'isoelectric(acidic, basic) = max(0, 7 + basic − acidic)', Math.max(0, 7 + basic - acidic), nat(acidic, basic), 'isoelectric', [acidic, basic]) }
  /** HYDROPHOBICITY: the hydrophobic fraction as a percentage. value ⌊hydrophobic · 100 / total⌋. */
  static hydrophobicity(hydrophobic: number, total: number): CrossFormula { return c('protein-hydrophobicity', 'hydrophobicity(hydrophobic, total) = ⌊hydrophobic · 100 / total⌋', total > 0 ? Math.floor((hydrophobic * 100) / total) : 0, nat(hydrophobic, total) && total > 0 && hydrophobic <= total, 'hydrophobicity', [hydrophobic, total]) }
  /** FOLDING RATIO: the folded fraction as a percentage. value ⌊folded · 100 / total⌋. */
  static foldingratio(folded: number, total: number): CrossFormula { return c('protein-foldingratio', 'foldingratio(folded, total) = ⌊folded · 100 / total⌋', total > 0 ? Math.floor((folded * 100) / total) : 0, nat(folded, total) && total > 0 && folded <= total, 'foldingratio', [folded, total]) }
  /** CONCENTRATION: mass over volume (mg per mL). value ⌊mass / volume⌋. */
  static concentration(mass: number, volume: number): CrossFormula { return c('protein-concentration', 'concentration(mass, volume) = ⌊mass / volume⌋', volume > 0 ? Math.floor(mass / volume) : 0, nat(mass, volume) && volume > 0, 'concentration', [mass, volume]) }
  /** AMINO-ACID COUNT: residues across every chain of a complex. value residues · chains. */
  static aminoacidcount(residues: number, chains: number): CrossFormula { return c('protein-aminoacidcount', 'aminoacidcount(residues, chains) = residues · chains', residues * chains, nat(residues, chains), 'aminoacidcount', [residues, chains]) }
}

for (const name of ['aminoacidcount', 'codons', 'concentration', 'foldingratio', 'hydrophobicity', 'isoelectric', 'molecularweight', 'residues'] as const)
  qpuHexRegisterOf('protein', name, (ProteinFormulas[name] as (...x: unknown[]) => unknown).bind(ProteinFormulas))
