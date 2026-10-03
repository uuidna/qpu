import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** COLOR — THE CSS COLOR SYSTEM, AS ARITHMETIC (learned from Tailwind's palette and shadcn's HSL tokens, not by hand).
 *  A color is numbers: hue on the wheel, a shade stepping down the lightness of a palette, alpha, the average of two
 *  channels, relative luminance, the complement across the wheel, saturation scaled by a percentage, and the swatches a
 *  palette holds. Crosses to `css` — color is what a stylesheet declares. A measure. */

const PROOF = 'color arithmetic (hue, shade, alpha, channel mix, luminance, complement, saturation, palette); the CSS/HSL color system learned from Tailwind + shadcn; a measure crossed to css'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'color', dst: 'css', formula, value, proof: PROOF, ...extra }, holds, { name: `color.${name}`, params })

export class ColorFormulas {
  /** HUE on the wheel: degrees wrapped to 0..359. value deg mod 360. */
  static hue(deg: number): CrossFormula { return c('color-hue', 'hue(deg) = deg mod 360', deg % 360, nat(deg), 'hue', [deg]) }
  /** SHADE: the lightness stepping down a palette, clamped to 0..100. value max(0, min(100, base − step · 10)). */
  static shade(base: number, step: number): CrossFormula { return c('color-shade', 'shade(base, step) = max(0, min(100, base − step · 10))', Math.max(0, Math.min(100, base - step * 10)), nat(base, step) && base <= 100, 'shade', [base, step]) }
  /** ALPHA: an opacity percentage. value pct. */
  static alpha(pct: number): CrossFormula { return c('color-alpha', 'alpha(pct) = pct', pct, nat(pct) && pct <= 100, 'alpha', [pct]) }
  /** MIX: the average of two 0..255 channels. value ⌊(a + b) / 2⌋. */
  static mix(a: number, b: number): CrossFormula { return c('color-mix', 'mix(a, b) = ⌊(a + b) / 2⌋', Math.floor((a + b) / 2), nat(a, b) && a <= 255 && b <= 255, 'mix', [a, b]) }
  /** LUMINANCE: the midpoint of a light and a dark 0..255 channel. value ⌊(light + dark) / 2⌋. */
  static luminance(light: number, dark: number): CrossFormula { return c('color-luminance', 'luminance(light, dark) = ⌊(light + dark) / 2⌋', Math.floor((light + dark) / 2), nat(light, dark) && light <= 255 && dark <= 255, 'luminance', [light, dark]) }
  /** COMPLEMENT: the opposite hue across the wheel. value (hue + 180) mod 360. */
  static complement(hue: number): CrossFormula { return c('color-complement', 'complement(hue) = (hue + 180) mod 360', (hue + 180) % 360, nat(hue) && hue <= 360, 'complement', [hue]) }
  /** SATURATION scaled by a percentage. value ⌊sat · pct / 100⌋. */
  static saturation(sat: number, pct: number): CrossFormula { return c('color-saturation', 'saturation(sat, pct) = ⌊sat · pct / 100⌋', Math.floor((sat * pct) / 100), nat(sat, pct) && sat <= 100 && pct <= 100, 'saturation', [sat, pct]) }
  /** PALETTE: the swatches of hues at shades. value hues · shades. */
  static palette(hues: number, shades: number): CrossFormula { return c('color-palette', 'palette(hues, shades) = hues · shades', hues * shades, nat(hues, shades), 'palette', [hues, shades]) }
}

for (const name of ['alpha', 'complement', 'hue', 'luminance', 'mix', 'palette', 'saturation', 'shade'] as const)
  qpuHexRegisterOf('color', name, (ColorFormulas[name] as (...x: unknown[]) => unknown).bind(ColorFormulas))
