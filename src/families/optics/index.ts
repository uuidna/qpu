import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** OPTICS — LIGHT AS INTEGER ARITHMETIC (refractive index scaled x1000 to stay integer). Snell refraction, lens
 *  magnification, focal shift, dioptric power, intensity per area, wavelength from speed and frequency, the f-number
 *  of an aperture, and transmitted fraction. Crosses to `materials` — optics is what a material does to light. A measure. */

const PROOF = 'optics arithmetic (refraction, magnification, focal, power, intensity, wavelength, aperture, transmission); light as integers with refractive index scaled x1000; a measure crossed to materials'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'optics', dst: 'materials', formula, value, proof: PROOF, ...extra }, holds, { name: `optics.${name}`, params })

export class OpticsFormulas {
  /** APERTURE: the f-number (x10) of a focal length over a diameter. value ⌊focal · 10 / diameter⌋. */
  static aperture(focal: number, diameter: number): CrossFormula { return c('optics-aperture', 'aperture(focal, diameter) = ⌊focal · 10 / diameter⌋', diameter > 0 ? Math.floor((focal * 10) / diameter) : 0, nat(focal, diameter) && diameter > 0, 'aperture', [focal, diameter]) }
  /** FOCAL SHIFT: the gap between two distances. value max(0, distance1 − distance2). */
  static focal(distance1: number, distance2: number): CrossFormula { return c('optics-focal', 'focal(distance1, distance2) = max(0, distance1 − distance2)', Math.max(0, distance1 - distance2), nat(distance1, distance2), 'focal', [distance1, distance2]) }
  /** INTENSITY: flux over the area it falls on. value ⌊flux / area⌋. */
  static intensity(flux: number, area: number): CrossFormula { return c('optics-intensity', 'intensity(flux, area) = ⌊flux / area⌋', area > 0 ? Math.floor(flux / area) : 0, nat(flux, area) && area > 0, 'intensity', [flux, area]) }
  /** MAGNIFICATION: image over object (x100). value ⌊image · 100 / object⌋. */
  static magnification(image: number, object: number): CrossFormula { return c('optics-magnification', 'magnification(image, object) = ⌊image · 100 / object⌋', object > 0 ? Math.floor((image * 100) / object) : 0, nat(image, object) && object > 0, 'magnification', [image, object]) }
  /** DIOPTRIC POWER: the reciprocal of a focal length in mm (diopters x1000). value ⌊1000000 / focalmm⌋. */
  static power(focalmm: number): CrossFormula { return c('optics-power', 'power(focalmm) = ⌊1000000 / focalmm⌋', focalmm > 0 ? Math.floor(1000000 / focalmm) : 0, nat(focalmm) && focalmm > 0, 'power', [focalmm]) }
  /** SNELL REFRACTION: incident over the refractive index (x1000). value ⌊incident · 1000 / index⌋. */
  static refraction(incident: number, index: number): CrossFormula { return c('optics-refraction', 'refraction(incident, index) = ⌊incident · 1000 / index⌋', index > 0 ? Math.floor((incident * 1000) / index) : 0, nat(incident, index) && index > 0, 'refraction', [incident, index]) }
  /** TRANSMISSION: the out fraction of the in (x100). value ⌊out · 100 / in⌋. */
  static transmission(out: number, in_: number): CrossFormula { return c('optics-transmission', 'transmission(out, in) = ⌊out · 100 / in⌋', in_ > 0 ? Math.floor((out * 100) / in_) : 0, nat(out, in_) && in_ > 0 && out <= in_, 'transmission', [out, in_]) }
  /** WAVELENGTH: speed over frequency. value ⌊speed / frequency⌋. */
  static wavelength(speed: number, frequency: number): CrossFormula { return c('optics-wavelength', 'wavelength(speed, frequency) = ⌊speed / frequency⌋', frequency > 0 ? Math.floor(speed / frequency) : 0, nat(speed, frequency) && frequency > 0, 'wavelength', [speed, frequency]) }
}

for (const name of ['aperture', 'focal', 'intensity', 'magnification', 'power', 'refraction', 'transmission', 'wavelength'] as const)
  qpuHexRegisterOf('optics', name, (OpticsFormulas[name] as (...x: unknown[]) => unknown).bind(OpticsFormulas))
