import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** A11Y — WEB ACCESSIBILITY, AS ARITHMETIC (WCAG as numbers, not as prose). What a page owes its users is counting:
 *  the contrast of text against its background, the images that carry alt text, the inputs that carry labels, tap
 *  targets large enough to hit, the landmarks that structure a page, a sane tab order, valid ARIA, and every
 *  interactive control reachable by keyboard. Crosses to `css` — accessibility is what the stylesheet must honour. A measure. */

const PROOF = 'a11y arithmetic (WCAG: contrast ratio, alt-text coverage, label coverage, tap target, landmarks, tab order, ARIA validity, focus reachability); a measure crossed to css'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'a11y', dst: 'css', formula, value, proof: PROOF, ...extra }, holds, { name: `a11y.${name}`, params })

export class A11yFormulas {
  /** CONTRAST: WCAG relative-luminance ratio ·100 over 0..100 luminance (AA text ≥ 450). value ⌊(max + 5) · 100 / (min + 5)⌋. */
  static contrast(lighter: number, darker: number): CrossFormula { return c('a11y-contrast', 'contrast(lighter, darker) = ⌊(max + 5) · 100 / (min + 5)⌋', Math.floor((Math.max(lighter, darker) + 5) * 100 / (Math.min(lighter, darker) + 5)), nat(lighter, darker) && lighter <= 100 && darker <= 100, 'contrast', [lighter, darker]) }
  /** ALT-TEXT COVERAGE: images that carry alt text, as a percentage. value ⌊described · 100 / images⌋. */
  static alt(described: number, images: number): CrossFormula { return c('a11y-alt', 'alt(described, images) = ⌊described · 100 / images⌋', images > 0 ? Math.floor((described * 100) / images) : 0, nat(described, images) && images > 0 && described <= images, 'alt', [described, images]) }
  /** LABEL COVERAGE: inputs that carry a label, as a percentage. value ⌊labelled · 100 / inputs⌋. */
  static labels(labelled: number, inputs: number): CrossFormula { return c('a11y-labels', 'labels(labelled, inputs) = ⌊labelled · 100 / inputs⌋', inputs > 0 ? Math.floor((labelled * 100) / inputs) : 0, nat(labelled, inputs) && inputs > 0 && labelled <= inputs, 'labels', [labelled, inputs]) }
  /** TAP TARGET: 1 when a control is at least the minimum size (e.g. 44 px). value [px ≥ min]. */
  static target(px: number, min: number): CrossFormula { return c('a11y-target', 'target(px, min) = [px ≥ min]', px >= min ? 1 : 0, nat(px, min), 'target', [px, min]) }
  /** LANDMARKS: the structural landmarks a page declares. value count. */
  static landmarks(count: number): CrossFormula { return c('a11y-landmarks', 'landmarks(count) = count', count, nat(count), 'landmarks', [count]) }
  /** TAB ORDER: 1 when a tabindex sits within the document order. value [order ≤ total]. */
  static tabindex(order: number, total: number): CrossFormula { return c('a11y-tabindex', 'tabindex(order, total) = [order ≤ total]', order <= total ? 1 : 0, nat(order, total), 'tabindex', [order, total]) }
  /** ARIA VALIDITY: ARIA attributes used that are valid, as a percentage. value ⌊valid · 100 / used⌋. */
  static aria(valid: number, used: number): CrossFormula { return c('a11y-aria', 'aria(valid, used) = ⌊valid · 100 / used⌋', used > 0 ? Math.floor((valid * 100) / used) : 0, nat(valid, used) && used > 0 && valid <= used, 'aria', [valid, used]) }
  /** FOCUS REACHABILITY: interactive controls reachable by keyboard, as a percentage. value ⌊reachable · 100 / interactive⌋. */
  static focus(reachable: number, interactive: number): CrossFormula { return c('a11y-focus', 'focus(reachable, interactive) = ⌊reachable · 100 / interactive⌋', interactive > 0 ? Math.floor((reachable * 100) / interactive) : 0, nat(reachable, interactive) && interactive > 0 && reachable <= interactive, 'focus', [reachable, interactive]) }
}

for (const name of ['alt', 'aria', 'contrast', 'focus', 'labels', 'landmarks', 'tabindex', 'target'] as const)
  qpuHexRegisterOf('a11y', name, (A11yFormulas[name] as (...x: unknown[]) => unknown).bind(A11yFormulas))
