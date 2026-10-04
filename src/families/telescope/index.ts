import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** TELESCOPE — OPTICS AS ARITHMETIC. An instrument is numbers: magnification from focal lengths, resolving power from
 *  wavelength and aperture, light gathered against the eye's pupil, the f-ratio, the true field of view, the limiting
 *  magnitude, the exit pupil, and Dawes' limit. Crosses to `astronomy` — a telescope is what astronomy looks through. */

const PROOF = 'telescope optics (magnification, resolution, light gathering, f-ratio, field of view, limiting magnitude, exit pupil, Dawes limit); a measure crossed to astronomy'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'telescope', dst: 'astronomy', formula, value, proof: PROOF, ...extra }, holds, { name: `telescope.${name}`, params })

export class TelescopeFormulas {
  /** MAGNIFICATION: objective focal length over eyepiece focal length. value ⌊focal / eyepiece⌋. */
  static magnification(focal: number, eyepiece: number): CrossFormula { return c('telescope-magnification', 'magnification(focal, eyepiece) = ⌊focal / eyepiece⌋', eyepiece > 0 ? Math.floor(focal / eyepiece) : 0, nat(focal, eyepiece) && eyepiece > 0, 'magnification', [focal, eyepiece]) }
  /** RESOLUTION: angular resolution from wavelength and aperture (×1000). value ⌊wavelength · 1000 / aperture⌋. */
  static resolution(wavelength: number, aperture: number): CrossFormula { return c('telescope-resolution', 'resolution(wavelength, aperture) = ⌊wavelength · 1000 / aperture⌋', aperture > 0 ? Math.floor((wavelength * 1000) / aperture) : 0, nat(wavelength, aperture) && aperture > 0, 'resolution', [wavelength, aperture]) }
  /** LIGHT GATHERING: aperture area over pupil area. value ⌊aperture² / pupil²⌋. */
  static lightgathering(aperture: number, pupil: number): CrossFormula { return c('telescope-lightgathering', 'lightgathering(aperture, pupil) = ⌊aperture² / pupil²⌋', pupil > 0 ? Math.floor((aperture * aperture) / (pupil * pupil)) : 0, nat(aperture, pupil) && pupil > 0, 'lightgathering', [aperture, pupil]) }
  /** F-RATIO: focal length over aperture, the f-number ×10. value ⌊focal · 10 / aperture⌋. */
  static fratio(focal: number, aperture: number): CrossFormula { return c('telescope-fratio', 'fratio(focal, aperture) = ⌊focal · 10 / aperture⌋', aperture > 0 ? Math.floor((focal * 10) / aperture) : 0, nat(focal, aperture) && aperture > 0, 'fratio', [focal, aperture]) }
  /** FIELD OF VIEW: apparent eyepiece field over magnification. value ⌊eyepiece / magnification⌋. */
  static fieldofview(eyepiece: number, magnification_: number): CrossFormula { return c('telescope-fieldofview', 'fieldofview(eyepiece, magnification) = ⌊eyepiece / magnification⌋', magnification_ > 0 ? Math.floor(eyepiece / magnification_) : 0, nat(eyepiece, magnification_) && magnification_ > 0, 'fieldofview', [eyepiece, magnification_]) }
  /** LIMITING MAGNITUDE: faintest star an aperture reaches, a magnitude proxy. value aperture. */
  static limiting(aperture: number): CrossFormula { return c('telescope-limiting', 'limiting(aperture) = aperture', aperture, nat(aperture), 'limiting', [aperture]) }
  /** EXIT PUPIL: aperture over magnification. value ⌊aperture / magnification⌋. */
  static exitpupil(aperture: number, magnification_: number): CrossFormula { return c('telescope-exitpupil', 'exitpupil(aperture, magnification) = ⌊aperture / magnification⌋', magnification_ > 0 ? Math.floor(aperture / magnification_) : 0, nat(aperture, magnification_) && magnification_ > 0, 'exitpupil', [aperture, magnification_]) }
  /** DAWES LIMIT: resolving power in arcseconds (×100). value ⌊11600 / aperture⌋. */
  static dawes(aperture: number): CrossFormula { return c('telescope-dawes', 'dawes(aperture) = ⌊11600 / aperture⌋', aperture > 0 ? Math.floor(11600 / aperture) : 0, nat(aperture) && aperture > 0, 'dawes', [aperture]) }
}

for (const name of ['dawes', 'exitpupil', 'fieldofview', 'fratio', 'lightgathering', 'limiting', 'magnification', 'resolution'] as const)
  qpuHexRegisterOf('telescope', name, (TelescopeFormulas[name] as (...x: unknown[]) => unknown).bind(TelescopeFormulas))
