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

/** The whole visual state of a block as custom properties computed from its UUID alone: the accent from the middle part as
 * CMYK, the tail as a colour and an angle, the 9-vortex seed, its σ_10 reflection and its trinity as a period and a class. Computed once at the source; the stylesheet does the
 * rest with no script, so a device renders at the cost of CSS and nothing else. */
export const varsOf = (uuid: string): Record<string, string> => {
  const hex = uuid.replace(/-/g, '')
  const { c, m, y, k } = cmykOfUuid(uuid)
  const [r, g, b] = rgbOfCmyk({ c, m, y, k })
  const tail = hex.slice(20)
  const one48 = parseInt(tail, 16)
  const seed = one48 === 0 ? 0 : 1 + ((one48 - 1) % 9)
  const tr = parseInt(tail.slice(0, 2), 16), tg = parseInt(tail.slice(2, 4), 16), tb = parseInt(tail.slice(4, 6), 16)
  const hue = Math.round((parseInt(hex.slice(0, 8), 16) % 360))
  return {
    '--qpu-hue': String(hue), '--qpu-c': c.toFixed(3), '--qpu-m': m.toFixed(3), '--qpu-y': y.toFixed(3), '--qpu-k': k.toFixed(3),
    '--qpu-accent': `rgb(${r} ${g} ${b})`, '--qpu-tail': `rgb(${tr} ${tg} ${tb})`, '--qpu-angle': String(one48 % 360),
    '--qpu-vortex': String(seed), '--qpu-reflection': String(seed === 0 ? 0 : 10 - seed), '--qpu-trinity': seed === 0 ? '0' : seed % 3 === 0 ? '3' : [7, 4, 1].includes(seed) ? '7' : '2', '--qpu-period': `${(seed || 9) * KEY}ms`, '--block-accent': `rgb(${r} ${g} ${b})`,
  }
}
export const styleOf = (uuid: string): string => Object.entries(varsOf(uuid)).map(([k, v]) => `${k}: ${v}`).join('; ')

/** The stylesheet from the key: custom properties the widgets may use beside the host's own tokens, and the rules that draw
 * every block from its own custom properties — no script, motion only where the device allows it, off-screen blocks at no
 * cost (content-visibility), dark and light from the device's preference. */
export const cssOf = (key: number = KEY): string => {
  const lines = [`:root {`, `  --a432-key: ${key};`, `  --a432-hue: ${hueOf(key)};`, ...HARMONICS.map((h, i) => `  --a432-${i + 1}: hsl(${hueOf(h)} 62% ${44 + i * 8}%);`), `  --a432-accent: hsl(${hueOf(key)} 62% 44%);`, `}`,
    `/* every block draws itself from the custom properties its UUID set on its root; nothing here needs a script */`,
    `.qpu-block { border-left: 3px solid var(--qpu-accent, var(--a432-accent)); padding-left: var(--pad-sm, 8px); content-visibility: auto; contain-intrinsic-size: auto 240px; background: linear-gradient(90deg, color-mix(in oklab, var(--qpu-accent, var(--a432-accent)) 6%, transparent), transparent 60%); }`,
    `.qpu-block::before { content: ''; display: block; height: 3px; margin-bottom: var(--gap-sm, 6px); background: conic-gradient(from calc(var(--qpu-angle, 0) * 1deg) at 50% 120%, var(--qpu-accent, var(--a432-accent)), var(--qpu-tail, var(--a432-2)), var(--qpu-accent, var(--a432-accent))); }`,
    `.qpu-block [data-status] { border-left: 2px solid var(--qpu-status, var(--a432-3)); padding-left: 4px; }`,
    `.qpu-block [data-status="served"] { --qpu-status: var(--a432-1); } .qpu-block [data-status="partial"] { --qpu-status: var(--a432-2); } .qpu-block [data-status="open"] { --qpu-status: var(--a432-3); } .qpu-block [data-status="blocked"], .qpu-block [data-status="out_of_scope"] { --qpu-status: var(--a432-5); }`,
    `@media (prefers-reduced-motion: no-preference) { .qpu-block::before { animation: qpu-vortex var(--qpu-period, ${key * 9}ms) linear infinite; } @keyframes qpu-vortex { to { filter: hue-rotate(360deg); } } }`,
    `@media (prefers-color-scheme: dark) { .qpu-block { background: linear-gradient(90deg, color-mix(in oklab, var(--qpu-accent, var(--a432-accent)) 12%, transparent), transparent 60%); } }`,
    `@media print { .qpu-block::before { animation: none; } }`]
  return lines.join('\n') + '\n'
}
/** A block's wrapper: its accent as a custom property, drawn as the left rule. */
export const wrapOf = (uuid: string, html: string): string => `<div data-block="${uuid}" class="qpu-block" data-vortex="${varsOf(uuid)['--qpu-vortex']}" style="${styleOf(uuid)}; border-left: 3px solid var(--qpu-accent); padding-left: var(--pad-sm, 8px);">${html}</div>`
