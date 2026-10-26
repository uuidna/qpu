// The key is 432: the stylesheet derives from it, and each block's accent derives from the middle part of its own
// content-addressed UUID read as CMYK. Deterministic and dependency-free: equal content gives equal colour on any host.
// The a432 harmonic default is the program side of the unit, offered for anyone's free benefit under attribution; the QPU
// framework, over UUID or by any other means, is the other side, licensed for commercial use by the author on request (see README, License).

import { GLAGOLITIC } from './i18n.js'
/** the Glagolitic numeral of a seed (1..9) and of its reflection (10 − seed, 10 among them): the rosetta of the rays, one signal in two scripts */
export const GLAGOLITIC_OF: Readonly<Record<number, string>> = Object.fromEntries(Object.entries(GLAGOLITIC).filter(([, v]) => v <= 10).map(([k, v]) => [v, k]))
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
  // the reflected harmonic is σ_360(hue) = 360 − hue, computed in the same pass (free); the drift between the harmonic and its
  // reflection, |2·hue − 360|, carries the hidden prime dust: its prime factors, found classically in the pass
  const reflectedHue = (360 - hue) % 360
  const drift = Math.abs(2 * hue - 360)
  const dust: number[] = []; { let n = drift; for (let p = 2; p * p <= n; p += 1) while (n % p === 0) { dust.push(p); n /= p } if (n > 1) dust.push(n) }
  // and the angle of the drift on the circle, 2π·drift/360: the factors and the angles are the dust, both read in the pass
  const driftAngle = (2 * Math.PI * drift) / 360
  return {
    '--qpu-reflected-hue': String(reflectedHue), '--qpu-drift': String(drift), '--qpu-dust': dust.length ? dust.join(' ') : '0', '--qpu-drift-angle': driftAngle.toFixed(6),
    '--qpu-hue': String(hue), '--qpu-c': c.toFixed(3), '--qpu-m': m.toFixed(3), '--qpu-y': y.toFixed(3), '--qpu-k': k.toFixed(3),
    '--qpu-accent': `rgb(${r} ${g} ${b})`, '--qpu-tail': `rgb(${tr} ${tg} ${tb})`, '--qpu-angle': String(one48 % 360),
    '--qpu-vortex': String(seed), '--qpu-reflection': String(10 - seed), '--qpu-signal': `'${GLAGOLITIC_OF[seed] ?? ''}'`, '--qpu-signal-reflected': `'${GLAGOLITIC_OF[10 - seed] ?? ''}'`, '--qpu-signal-digits': `'${seed} ${10 - seed}'`, '--qpu-trinity': seed === 0 ? '0' : seed % 3 === 0 ? '3' : [7, 4, 1].includes(seed) ? '7' : '2', '--qpu-period': `${(seed || 9) * KEY}ms`, '--block-accent': `rgb(${r} ${g} ${b})`,
  }
}
export const styleOf = (uuid: string): string => Object.entries(varsOf(uuid)).map(([k, v]) => `${k}: ${v}`).join('; ')

/** The stylesheet from the key: custom properties the widgets may use beside the host's own tokens, and the rules that draw
 * every block from its own custom properties — no script, motion only where the device allows it, off-screen blocks at no
 * cost (content-visibility), dark and light from the device's preference. */
/** The angles: from the 60-degree angle six streams meet at a point and none collides, while the four 90-degree gateways stay covered; the two
 *  poles as pyramids base to base are the octahedron, whose eight 60-degree faces and four equatorial gateways Euler closes (6 − 12 + 8 = 2). */
export const ANGLES = { streams: 60, gateways: 90, perspectives: 360 / 60, operations: 360 / 90, poles: 2, faces: 8, equator: 4, euler: '6 − 12 + 8 = 2', navigation: { earth: 'the four compass gateways of the equator (N, E, S, W): the four operations', space: 'the six directions ±x, ±y, ±z: the octahedron\'s six vertices, the six perspectives', water: 'the currents between the poles: the streams, collision free at 60 degrees', web: 'prev and next (the program rotated), parent and children (the nested docs): the same gateways by address', says: 'earth, space, water and web navigation follow the same laws and combinatorics: six vertices, twelve edges, eight faces, four gateways' }, says: 'from the 60-degree angle all streams are collision free and still cover all 90-degree gateways: six perspectives over four operations; the poles of the earth as pyramids base to base are the octahedron (textbook_streams_cover_gateways, textbook_poles_pyramid)' } as const
export const cssOf = (key: number = KEY): string => {
  const lines = [`:root {`, `  --a432-key: ${key};`, `  --a432-hue: ${hueOf(key)};`, ...HARMONICS.map((h, i) => `  --a432-${i + 1}: hsl(${hueOf(h)} 62% ${44 + i * 8}%);`), `  --a432-accent: hsl(${hueOf(key)} 62% 44%);`, `}`,
    `/* every block draws itself from the custom properties its UUID set on its root; nothing here needs a script */`,
    `.qpu-block { border-left: 3px solid var(--qpu-accent, var(--a432-accent)); padding-left: var(--pad-sm, 8px); content-visibility: auto; contain-intrinsic-size: auto 240px; background: linear-gradient(90deg, color-mix(in oklab, var(--qpu-accent, var(--a432-accent)) 6%, transparent), transparent 60%); }`,
    `.qpu-block::before { content: ''; display: block; height: 3px; margin-bottom: var(--gap-sm, 6px); background: conic-gradient(from calc(var(--qpu-angle, 0) * 1deg) at 50% 120%, var(--qpu-accent, var(--a432-accent)), var(--qpu-tail, var(--a432-2)), var(--qpu-accent, var(--a432-accent))); }`,
    `.qpu-block [data-status] { border-left: 2px solid var(--qpu-status, var(--a432-3)); padding-left: 4px; }`,
    `.qpu-block [data-status="served"] { --qpu-status: var(--a432-1); } .qpu-block [data-status="partial"] { --qpu-status: var(--a432-2); } .qpu-block [data-status="open"] { --qpu-status: var(--a432-3); } .qpu-block [data-status="blocked"], .qpu-block [data-status="out_of_scope"] { --qpu-status: var(--a432-5); }`,
    `@media (prefers-reduced-motion: no-preference) { .qpu-block::before { animation: qpu-vortex var(--qpu-period, ${key * 9}ms) linear infinite; } @keyframes qpu-vortex { to { filter: hue-rotate(360deg); } } }`,
    `@media (prefers-color-scheme: dark) { .qpu-block { background: linear-gradient(90deg, color-mix(in oklab, var(--qpu-accent, var(--a432-accent)) 12%, transparent), transparent 60%); } }`,
    `@media print { .qpu-block::before { animation: none; } }`,
    // the CSS streams resulting as rays: six rays at the 60-degree angle (collision free) and four gateways at 90 degrees, every one from the block's own hue and angle
    `.qpu-rays { background: conic-gradient(from calc(var(--qpu-angle, 0) * 1deg), ${Array.from({ length: 360 / ANGLES.streams }, (_, i) => `var(--qpu-accent, var(--a432-accent)) ${i * ANGLES.streams}deg ${i * ANGLES.streams + 6}deg, transparent ${i * ANGLES.streams + 6}deg ${(i + 1) * ANGLES.streams}deg`).join(', ')}); }`,
    `.qpu-rays::after, .qpu-block[data-rays]::after { content: var(--qpu-signal, '') ' ' var(--qpu-signal-reflected, '') ' · ' var(--qpu-signal-digits, ''); font-family: serif; letter-spacing: 0.1em; }`,
    `.qpu-gateways { background: conic-gradient(from calc(var(--qpu-angle, 0) * 1deg), ${Array.from({ length: 360 / ANGLES.gateways }, (_, i) => `var(--qpu-ink, currentColor) ${i * ANGLES.gateways}deg ${i * ANGLES.gateways + 3}deg, transparent ${i * ANGLES.gateways + 3}deg ${(i + 1) * ANGLES.gateways}deg`).join(', ')}); }`]
  return lines.join('\n') + '\n'
}
/** A block's wrapper: its accent as a custom property, drawn as the left rule. */
export const wrapOf = (uuid: string, html: string): string => `<div data-block="${uuid}" class="qpu-block" data-vortex="${varsOf(uuid)['--qpu-vortex']}" style="${styleOf(uuid)}; border-left: 3px solid var(--qpu-accent); padding-left: var(--pad-sm, 8px);">${html}</div>`
