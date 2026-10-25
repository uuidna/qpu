// The key is 432: the stylesheet derives from it, and each block's accent derives from the middle part of its own
// content-addressed UUID read as CMYK. Deterministic and dependency-free: equal content gives equal colour on any host.
// The a432 harmonic default is the program side of the unit, offered for anyone's free benefit under attribution; the QPU
// framework, over UUID or by any other means, is the other side, licensed for commercial use by the author on request (see README, License).

export const KEY = 432
/** The harmonic series of the key downward by halving, each read as a hue in degrees. */
export const HARMONICS = [432, 216, 108, 54, 27] as const
export const hueOf = (hz: number): number => hz % 360

export type Cmyk = { c: number; m: number; y: number; k: number }
/** The UUID's middle part (time_mid, time_hi_and_version, clock_seq) as four CMYK channels from three hex digits each. */
export const cmykOfUuid = (uuid: string): Cmyk => {
  const middle = uuid.replace(/-/g, '').slice(8, 20)
  const ch = (i: number) => parseInt(middle.slice(i * 3, i * 3 + 3), 16) / 0xfff
  return { c: ch(0), m: ch(1), y: ch(2), k: ch(3) }
}
export const rgbOfCmyk = ({ c, m, y, k }: Cmyk): [number, number, number] => [Math.round(255 * (1 - c) * (1 - k)), Math.round(255 * (1 - m) * (1 - k)), Math.round(255 * (1 - y) * (1 - k))]
export const accentOfUuid = (uuid: string): string => { const [r, g, b] = rgbOfCmyk(cmykOfUuid(uuid)); return `rgb(${r} ${g} ${b})` }

/** The stylesheet from the key: custom properties the widgets may use beside the host's own tokens. */
export const cssOf = (key: number = KEY): string => {
  const lines = [`:root {`, `  --a432-key: ${key};`, `  --a432-hue: ${hueOf(key)};`, ...HARMONICS.map((h, i) => `  --a432-${i + 1}: hsl(${hueOf(h)} 62% ${44 + i * 8}%);`), `  --a432-accent: hsl(${hueOf(key)} 62% 44%);`, `}`]
  return lines.join('\n') + '\n'
}
/** A block's wrapper: its accent as a custom property, drawn as the left rule. */
export const wrapOf = (uuid: string, html: string): string => `<div data-block="${uuid}" style="--block-accent: ${accentOfUuid(uuid)}; border-left: 3px solid var(--block-accent); padding-left: var(--pad-sm, 8px);">${html}</div>`
