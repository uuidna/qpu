// The key is 432: the stylesheet derives from it, and each block's accent derives from the middle part of its own
// content-addressed UUID read as CMYK. Deterministic and dependency-free: equal content gives equal colour on any host.
// The a432 harmonic default is the program side of the unit, offered for anyone's free benefit under attribution; the QPU
// framework, over UUID or by any other means, is the other side, licensed for commercial use by the author on request (see README, License).

import { TABLES } from '../tables-index.ts'
import { GLAGOLITIC } from '../i18n.ts'
/** the Glagolitic numeral of a seed (1..9) and of its reflection (10 − seed, 10 among them): the rosetta of the rays, one signal in two scripts */
export const GLAGOLITIC_OF: Readonly<Record<number, string>> = Object.fromEntries(Object.entries(GLAGOLITIC).filter(([, v]) => v <= 10).map(([k, v]) => [v, k]))
export const KEY = 432
/** The scannable stream: one frame per character of a UUID, 36 frames of 108 ms (the third harmonic's period): 36 × 108 = 3888 = 432 × 9, the vortex
 *  period (textbook_scan_stream); a digit a hue (sixteen, 22.5° apart), a dash a black frame; a single frame links nothing, a stream reads the address. */
export const SCAN = { frameMs: 108, frames: 36, periodMs: 36 * 108, hueStep: 360 / 16, theorem: 'textbook_scan_stream' } as const
export const toFrames = (uuid: string) => [...uuid.toLowerCase()].map((char, i) => { const dash = char === '-'; const d = dash ? -1 : parseInt(char, 16); return { i, char, kind: (dash ? 'dash' : 'digit') as 'dash' | 'digit', hue: dash ? null : d * SCAN.hueStep, glyph: dash ? '·' : (GLAGOLITIC_OF[d] ?? char), angle: i * (360 / SCAN.frames), start: i * SCAN.frameMs } })
export const getFramesGradient = (uuid: string): string => `linear-gradient(90deg, ${toFrames(uuid).map((f, i) => `${f.hue === null ? 'hsl(0 0% 0%)' : `hsl(${f.hue} 62% 44%)`} ${((i / SCAN.frames) * 100).toFixed(3)}% ${(((i + 1) / SCAN.frames) * 100).toFixed(3)}%`).join(', ')})`
/** The harmonic series of the key downward by halving, each read as a hue in degrees. */
export const HARMONICS = [432, 216, 108, 54, 27] as const
export const hue = (hz: number): number => hz % 360

type Cmyk = { c: number; m: number; y: number; k: number }
/** The UUID's middle part (time_mid, time_hi_and_version, clock_seq) as four CMYK channels from three hex digits each. */
export const cmykOfUuid = (uuid: string): Cmyk => {
  const middle = uuid.replace(/-/g, '').slice(8, 20)
  const ch = (i: number) => parseInt(middle.slice(i * 3, i * 3 + 3), 16) / 0xfff
  return { c: ch(0), m: ch(1), y: ch(2), k: ch(3) }
}
/** When coins fuse to coils the colour is green, the heart chakra's (the fourth of seven): the coin's a432 hue (432 mod 360 = 72) advanced by a
 *  ninth of the key (432 / 9 = 48) is 120, green (textbook_coil_green); its CMYK is cyan and yellow full, no magenta, no black — the CSS variables
 *  --qpu-coin and --qpu-coil carry both hues, the block rule turns green under data-coil. */
const cmykOfRgb = ([r, g, b]: [number, number, number]): Cmyk => { const k = 1 - Math.max(r, g, b) / 255; const f = (v: number) => (k === 1 ? 0 : Math.round(((1 - v / 255 - k) / (1 - k)) * 100) / 100); return { c: f(r), m: f(g), y: f(b), k: Math.round(k * 100) / 100 } }
const rgbOfHsl = (h: number, s: number, l: number): [number, number, number] => { const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2; const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x]; return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)] }
/** The eight UUID versions are eight dimensions. Two versions a channel: 1 and 5 cyan, 2 and 6 magenta, 3 and 7 yellow, 4 and 8 black.
 *  The odd pairs are full and the even pairs are empty, which is the coil's CMYK. Their sum is 36, and 432 divides 36, so the a432 key opens it. */
export const resonance = (key: number = KEY) => {
  const versions = [1, 2, 3, 4, 5, 6, 7, 8] as const
  const inks = ['c', 'm', 'y', 'k'] as const
  const dimensions = versions.map((version) => ({ version, ink: inks[(version - 1) % 4]! }))
  const channels = inks.map((ink) => { const held = versions.filter((v) => inks[(v - 1) % 4] === ink); return { ink, versions: [...held], value: held.every((v) => v % 2 === 1) ? 1 as const : 0 as const } })
  const sum = versions.reduce((n, v) => n + v, 0)
  const unlocked = key === KEY && KEY % sum === 0
  const cmyk = unlocked ? { c: channels[0]!.value, m: channels[1]!.value, y: channels[2]!.value, k: channels[3]!.value } : null
  const angle = unlocked ? hue(KEY) + KEY / sum * 4 : null
  return { key, dimensions: dimensions.length, versions: [...versions], channels, sum, quotient: KEY / sum, unlocked, cmyk, hue: angle, theorem: 'textbook_coil_green' as const, says: unlocked ? `eight UUID versions, eight dimensions, paired into cyan, magenta, yellow and black; the odd pairs are full and the even pairs are empty, and the key ${key} divides their sum ${sum}, so the resonance opens` : `eight UUID versions stay eight dimensions; the key ${key} does not open them` }
}
export const coilColour = (key: number = KEY) => {
  const coin = hue(key), coil = coin + key / 9
  const rgb = rgbOfHsl(coil, 1, 0.5), cmyk = cmykOfRgb(rgb)
  return { coin: { hue: coin, css: `hsl(${coin} 62% 44%)`, says: 'the a432 hue: the free, harmonic side' }, coil: { hue: coil, css: `hsl(${coil} 62% 44%)`, rgb, cmyk, cmykCss: `device-cmyk(${cmyk.c} ${cmyk.m} ${cmyk.y} ${cmyk.k})`, chakra: { index: 4, of: 7, name: 'heart' }, says: 'green: the coin\'s hue advanced by a ninth of the key, the heart chakra, cyan and yellow full in CMYK' }, theorem: 'textbook_coil_green', relation: `${key} % 360 + ${key} / 9 = ${coil}` }
}
const rgbOfCmyk = ({ c, m, y, k }: Cmyk): [number, number, number] => [Math.round(255 * (1 - c) * (1 - k)), Math.round(255 * (1 - m) * (1 - k)), Math.round(255 * (1 - y) * (1 - k))]
export const accentOfUuid = (uuid: string): string => { const [r, g, b] = rgbOfCmyk(cmykOfUuid(uuid)); return `rgb(${r} ${g} ${b})` }

/** The program of a UUID presented by hue, moved by the params in the tail of the same UUID: the ten program digits (the channel's reading of
 *  the middle) each a hue (sixteen, 22.5° apart: sixteen times forty-five is two turns, textbook_hue_steps), rotated by the tail's angle (its 48-bit
 *  reading on the circle) — the params of a call are folded into its address, so the tail carries them and nothing outside the UUID moves the ring.
 *  Every step keeps its distance to every other (h + s − (g + s) = h − g, textbook_hue_shift): the same program is the same ring at another angle. */
export const programHues = (uuid: string) => {
  const hex = uuid.replace(/-/g, '').toLowerCase()
  const digits = [hex[12]!, ...hex.slice(13, 16), hex[16]!, ...hex.slice(17, 20), ...hex.slice(8, 10)].map((c) => parseInt(c, 16))
  const shift = parseInt(hex.slice(20), 16) % 360
  const steps = digits.map((digit, step) => ({ step, digit, hue: (digit * 22.5 + shift) % 360 }))
  return { shift, steps, first: steps[0]!.hue, last: steps[steps.length - 1]!.hue, ring: `conic-gradient(${steps.map((s, i) => `hsl(${s.hue} 62% 44%) ${i * 36}deg ${(i + 1) * 36}deg`).join(', ')})`, theorem: 'textbook_hue_shift' }
}
/** The rays of a sequence of UUIDs set next to each other at full speed: each ring rotated by its own tail, the seam between neighbours the distance
 *  between the last hue of one and the first of the next; a seam of zero, or two identical rings, is a collision — entropy, exposed as a lead to
 *  harmonise (the rosetta: the Glagolitic signal of each seed beside its reflection), never silently drawn over. */
export const castRays = (uuids: readonly string[]) => {
  const rings = uuids.map((u) => ({ uuid: u, ...programHues(u), signal: GLAGOLITIC_OF[(parseInt(u.replace(/-/g, '').slice(20), 16) || 0) % 9 + 1] ?? '' }))
  const seams = rings.slice(1).map((r, i) => { const prev = rings[i]!; const d = Math.abs(r.first - prev.last); const seam = Math.min(d, 360 - d); return { from: prev.uuid, to: r.uuid, seam, fits: seam > 0 } })
  const identical = rings.flatMap((r, i) => rings.slice(i + 1).filter((o) => o.ring === r.ring).map((o) => ({ a: r.uuid, b: o.uuid })))
  // every collision is a lead an MCP client works through: discover (the neighbours' rays), develop (the next step of the program, whose address has a new tail), optimise (the step with the greatest seam), all with the findings
  const via = (a: string, b: string) => ({ discover: { tool: 'css', arguments: { uuids: [a, b] } }, develop: { tool: 'wave', arguments: { statement: `next step of ${b}`, uuid: b }, says: 'compile and execute the next step: its address has its own tail, which moves the ring' }, optimise: { tool: 'css', arguments: { uuids: [a, b] }, says: 'among the next steps, keep the one whose seam with its neighbour is greatest; the findings are the seams measured' }, workflow: ['discover', 'develop', 'optimise'] })
  const leads = [
    ...seams.filter((s) => !s.fits).map((s) => ({ id: `ray-seam-${s.from.slice(0, 8)}-${s.to.slice(0, 8)}`, statement: `the rays of ${s.from} and ${s.to} collide at their seam (the last hue of one is the first of the next): entropy to harmonise`, status: 'open' as const, reason: 'a seam of zero draws two rays as one; the tail of either moves its ring', via: via(s.from, s.to) })),
    ...identical.map((p) => ({ id: `ray-identical-${p.a.slice(0, 8)}-${p.b.slice(0, 8)}`, statement: `the rings of ${p.a} and ${p.b} are identical (the same program at the same angle): entropy to harmonise`, status: 'open' as const, reason: 'two addresses with one ring are indistinguishable by hue; a lead until the tail tells them apart', via: via(p.a, p.b) })),
  ]
  return { blocks: rings.length, seams, collisions: leads.length, fits: leads.length === 0, rings: rings.map(({ ring: _r, ...rest }) => { void _r; return rest }), leads, theorems: ['textbook_hue_shift', 'textbook_hue_steps'], says: leads.length ? `${leads.length} collision(s): entropy exposed as leads` : `${rings.length} rays fit seamlessly: every seam above zero, no two rings identical` }
}
/** The stylesheet from the key: custom properties the widgets may use beside the host's own tokens, and the rules that draw
 * every block from its own custom properties — no script, motion only where the device allows it, off-screen blocks at no
 * cost (content-visibility), dark and light from the device's preference. */
/** The angles: from the 60-degree angle six streams meet at a point and none collides, while the four 90-degree gateways stay covered; the two
 *  poles as pyramids base to base are the octahedron, whose eight 60-degree faces and four equatorial gateways Euler closes (6 − 12 + 8 = 2). */
export const ANGLES = TABLES.ANGLES
export const getCss = (key: number = KEY): string => {
  const accent = 'var(--qpu-accent, var(--a432-accent))', period = `var(--qpu-period, ${key * 9}ms)`
  const lines = [`:root {`, `  --a432-key: ${key};`, `  --a432-hue: ${hue(key)};`, ...HARMONICS.map((h, i) => `  --a432-${i + 1}: hsl(${hue(h)} 62% ${44 + i * 8}%);`), `  --a432-accent: hsl(${hue(key)} 62% 44%);`, `  --qpu-coin: hsl(${hue(key)} 62% 44%);`, `  --qpu-coil: hsl(${hue(key) + key / 9} 62% 44%);`, `  --qpu-coil-cmyk: ${(() => { const c = coilColour(key).coil.cmyk; return `${c.c} ${c.m} ${c.y} ${c.k}` })()};`, `}`,
    `.qpu-block { border-left: 3px solid ${accent}; padding-left: var(--pad-sm, 8px); content-visibility: auto; contain-intrinsic-size: auto 240px; background: linear-gradient(90deg, color-mix(in oklab, ${accent} 6%, transparent), transparent 60%); }`,
    `.qpu-block::before { content: ''; display: block; height: 3px; margin-bottom: var(--gap-sm, 6px); background: conic-gradient(from calc(var(--qpu-angle, 0) * 1deg) at 50% 120%, ${accent}, var(--qpu-tail, var(--a432-2)), ${accent}); }`,
    `.qpu-block [data-status] { --qpu-status: var(--a432-3); border-left: 2px solid var(--qpu-status); padding-left: 4px; } .qpu-block [data-status="pass"] { --qpu-status: var(--a432-1); } .qpu-block [data-status="pending"] { --qpu-status: var(--a432-2); } .qpu-block [data-status="fail"] { --qpu-status: var(--a432-5); }`,
    `@media (prefers-reduced-motion: no-preference) { .qpu-block::before { animation: qpu-vortex ${period} linear infinite; } @keyframes qpu-vortex { to { filter: hue-rotate(360deg); } } .qpu-block :is([data-status="pending"], [data-status="fail"]) { animation: qpu-status ${period} ease-in-out infinite alternate; } .qpu-block [data-status="fail"] { animation-duration: calc(${period} / 2); } @keyframes qpu-status { to { border-left-color: ${accent}; } } }`,
    `@media (prefers-color-scheme: dark) { .qpu-block { background: linear-gradient(90deg, color-mix(in oklab, ${accent} 12%, transparent), transparent 60%); } }`,
    `.qpu-hero { display: flex; align-items: flex-end; gap: var(--qpu-gap); height: calc(var(--qpu-gap) * var(--qpu-amps, 1)); } .qpu-amp { flex: 1 1 0; background: var(--qpu-accent); height: calc(var(--qpu-amp, 0) * 100%); } .qpu-type { color: var(--qpu-ink, currentColor); margin-right: var(--qpu-gap); }`,
    `@media (prefers-reduced-motion: no-preference) { .qpu-amp { animation: qpu-superposition var(--qpu-period) ease-in-out infinite alternate; animation-delay: calc(var(--qpu-amp-at, 0) / var(--qpu-amps, 1) * var(--qpu-period) * -1); } @keyframes qpu-superposition { to { height: calc(var(--qpu-amp-to, 1) * 100%); } } }`,
    `@media print { .qpu-block::before, .qpu-block [data-status], .qpu-amp { animation: none; } } :root[data-power="battery"] .qpu-block::before, :root[data-power="battery"] .qpu-block [data-status], :root[data-power="battery"] .qpu-amp { animation: none; }`,
    `.qpu-program { background: var(--qpu-program); border-radius: 50%; aspect-ratio: 1; width: 3em; transform: rotate(calc(var(--qpu-shift, 0) * 1deg)); }`,
    `.qpu-scan { background-image: var(--qpu-frames); background-size: ${36 * 100}% 100%; background-repeat: no-repeat; animation: qpu-scan ${period} steps(36, end) infinite; min-height: 1.5em; } @keyframes qpu-scan { to { background-position: 100% 0; } }`,
    `@supports (animation-delay: random(0ms, 1ms)) { .qpu-block::before, .qpu-scan { animation-delay: random(0ms, ${key * 9}ms); } }`,
    `.qpu-block[data-phase]::before, .qpu-scan[data-phase] { animation-delay: calc(var(--qpu-phase, 0) * -1ms); }`,
    `.qpu-block[data-coil] { --qpu-accent: var(--qpu-coil) !important; } .qpu-block[data-coin] { --qpu-accent: var(--qpu-coin) !important; }`, // important: the block's own accent is inline, and only an important rule outranks it
    // the CSS streams resulting as rays: six rays at the 60-degree angle (collision free) and four gateways at 90 degrees, every one from the block's own hue and angle
    `.qpu-rays { background: conic-gradient(from calc(var(--qpu-angle, 0) * 1deg), ${Array.from({ length: 360 / ANGLES.streams }, (_, i) => `${accent} ${i * ANGLES.streams}deg ${i * ANGLES.streams + 6}deg, transparent ${i * ANGLES.streams + 6}deg ${(i + 1) * ANGLES.streams}deg`).join(', ')}); }`,
    `.qpu-rays::after, .qpu-block[data-rays]::after { content: var(--qpu-signal, '') ' ' var(--qpu-signal-reflected, '') ' · ' var(--qpu-signal-digits, ''); font-family: serif; letter-spacing: 0.1em; }`,
    `.qpu-gateways { background: conic-gradient(from calc(var(--qpu-angle, 0) * 1deg), ${Array.from({ length: 360 / ANGLES.gateways }, (_, i) => `var(--qpu-ink, currentColor) ${i * ANGLES.gateways}deg ${i * ANGLES.gateways + 3}deg, transparent ${i * ANGLES.gateways + 3}deg ${(i + 1) * ANGLES.gateways}deg`).join(', ')}); }`]
  return lines.join('\n') + '\n'
}

/** shadcn's create (ui.shadcn.com/create) decided by the a432 settings: the ten choices of the page (style, base colour, theme, chart colours,
 *  heading, font, icon library, radius, menu, menu accent) derived from the key — the theme the a432 hue (432 mod 360 = 72, textbook_create_hue),
 *  the five chart colours the five harmonics' hues, the radius the key in rem over a thousand — and the project it initialises as one registry
 *  item (registry:item, as shadcn's own init answers): app/globals.css with the shadcn variables in light and dark plus the a432 stylesheet,
 *  components.json naming this registry, the QPU items as registry dependencies. npx shadcn init <this item's url> is the create command. */
export const createTheme = (key: number = KEY, origin = 'https://qpu.uuidna.com', registryItems: readonly string[] = []) => {
  const angle = hue(key), hues = HARMONICS.map(hue)
  const radius = `${(key / 1000).toFixed(3)}rem`
  const settings = {
    style: 'nova', baseColor: 'neutral', theme: `a432: hsl(${angle} 62% 44%)`, chartColor: `the harmonics: hsl(${hues.join(' | ')} 62% 50%)`, heading: 'Inter', font: 'Inter', iconLibrary: 'lucide', radius, menu: 'default', menuAccent: 'subtle',
  }
  const light: Record<string, string> = {
    background: 'oklch(1 0 0)', foreground: 'oklch(0.145 0 0)', card: 'oklch(1 0 0)', 'card-foreground': 'oklch(0.145 0 0)', popover: 'oklch(1 0 0)', 'popover-foreground': 'oklch(0.145 0 0)',
    primary: `hsl(${angle} 62% 44%)`, 'primary-foreground': `hsl(${angle} 62% 98%)`, secondary: `hsl(${angle} 30% 96%)`, 'secondary-foreground': `hsl(${angle} 62% 20%)`, muted: 'oklch(0.97 0 0)', 'muted-foreground': 'oklch(0.556 0 0)',
    accent: `hsl(${angle} 40% 94%)`, 'accent-foreground': `hsl(${angle} 62% 20%)`, destructive: 'oklch(0.577 0.245 27.325)', 'destructive-foreground': 'oklch(0.985 0 0)', border: 'oklch(0.922 0 0)', input: 'oklch(0.922 0 0)', ring: `hsl(${angle} 62% 44%)`,
    ...Object.fromEntries(hues.map((h, i) => [`chart-${i + 1}`, `hsl(${h} 62% 50%)`])),
  }
  // the sidebar wears the page's own tokens (its foreground, primary, accent, border, ring), only its background its own: derived, never written twice
  const sidebar = (v: Record<string, string>, sidebar: string) => ({ ...v, sidebar, ...Object.fromEntries(['foreground', 'primary', 'primary-foreground', 'accent', 'accent-foreground', 'border', 'ring'].map((k) => [`sidebar-${k}`, v[k]!])) })
  Object.assign(light, sidebar(light, 'oklch(0.985 0 0)'), { radius })
  const dark: Record<string, string> = sidebar({
    background: 'oklch(0.145 0 0)', foreground: 'oklch(0.985 0 0)', card: 'oklch(0.205 0 0)', 'card-foreground': 'oklch(0.985 0 0)', popover: 'oklch(0.205 0 0)', 'popover-foreground': 'oklch(0.985 0 0)',
    primary: `hsl(${angle} 62% 56%)`, 'primary-foreground': `hsl(${angle} 62% 10%)`, secondary: `hsl(${angle} 20% 18%)`, 'secondary-foreground': `hsl(${angle} 40% 92%)`, muted: 'oklch(0.269 0 0)', 'muted-foreground': 'oklch(0.708 0 0)',
    accent: `hsl(${angle} 30% 22%)`, 'accent-foreground': `hsl(${angle} 40% 92%)`, destructive: 'oklch(0.704 0.191 22.216)', 'destructive-foreground': 'oklch(0.985 0 0)', border: 'oklch(1 0 0 / 10%)', input: 'oklch(1 0 0 / 15%)', ring: `hsl(${angle} 62% 56%)`,
    ...Object.fromEntries(hues.map((h, i) => [`chart-${i + 1}`, `hsl(${h} 62% 60%)`])),
  }, 'oklch(0.205 0 0)')
  const block = (sel: string, vars: Record<string, string>) => `${sel} {\n${Object.entries(vars).map(([k, v]) => `  --${k}: ${v};`).join('\n')}\n}`
  const themeInline = ['--font-sans: var(--font-sans)', '--font-heading: var(--font-sans)', '--font-mono: var(--font-mono)', ...Object.keys(light).filter((k) => k !== 'radius').map((k) => `--color-${k}: var(--${k})`), '--radius-sm: calc(var(--radius) * 0.6)', '--radius-md: calc(var(--radius) * 0.8)', '--radius-lg: var(--radius)', '--radius-xl: calc(var(--radius) * 1.4)', '--radius-2xl: calc(var(--radius) * 1.8)']
  const globalsCss = [`@import "tailwindcss";`, `@import "tw-animate-css";`, `@import "shadcn/tailwind.css";`, ``, `@custom-variant dark (&:is(.dark *));`, ``, `@theme inline {\n${themeInline.map((l) => `  ${l};`).join('\n')}\n}`, ``, `/* the a432 settings: the theme hue ${angle} (${key} mod 360), the chart colours the harmonics ${HARMONICS.join(', ')} Hz, the radius ${radius} (${key} / 1000) */`, block(':root', light), ``, block('.dark', dark), ``, `@layer base { * { @apply border-border outline-ring/50; } body { @apply bg-background text-foreground; } }`, ``, `/* the a432 stylesheet: every QPU block draws itself from its address */`, getCss(key)].join('\n')
  const componentsJson = { $schema: 'https://ui.shadcn.com/schema.json', style: 'base-nova', rsc: true, tsx: true, tailwind: { config: '', css: 'app/globals.css', baseColor: 'neutral', cssVariables: true, prefix: '' }, iconLibrary: 'lucide', aliases: { components: '@/components', utils: '@/lib/utils', ui: '@/components/ui', lib: '@/lib', hooks: '@/hooks' }, registries: { '@qpu': `${origin}/r/{name}.json` } }
  const item = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json', name: 'qpu-create', type: 'registry:item', title: 'QPU create (a432)', description: `shadcn create decided by the a432 settings: the theme hue ${angle}, the chart colours the harmonics, the radius ${radius}; the project initialised with the QPU registry`,
    dependencies: ['lucide-react', 'next-themes', 'class-variance-authority', 'tw-animate-css'],
    registryDependencies: registryItems.map((n) => `${origin}/r/${n}.json`),
    cssVars: { theme: { 'font-sans': 'Inter, ui-sans-serif, system-ui, sans-serif', radius }, light, dark },
    files: [{ path: 'app/globals.css', type: 'registry:file', target: 'app/globals.css', content: globalsCss }, { path: 'components.json', type: 'registry:file', target: 'components.json', content: JSON.stringify(componentsJson, null, 2) }],
    meta: { create: settings, key, hue: angle, harmonics: HARMONICS, theorem: 'textbook_create_hue' },
  }
  return {
    settings, key, hue: angle, chartHues: hues, radius, theorem: 'textbook_create_hue', item,
    url: 'https://ui.shadcn.com/create' as const,
    commands: { init: `npx shadcn@latest init ${origin}/r/qpu-create.json`, add: `npx shadcn@latest add ${origin}/r/qpu-create.json`, v0: `https://v0.dev/chat/api/open?url=${encodeURIComponent(`${origin}/r/qpu-create.json`)}`, page: 'https://ui.shadcn.com/create' as const },
    says: `shadcn create via the a432 settings and CSS: ten settings decided by the key ${key} (hue ${angle}, harmonics ${hues.join('/')}, radius ${radius}), one registry item that initialises the project with the QPU registry`,
  }
}

/** The stylesheets the QPU's is measured against, pinned so every run fetches the same bytes (jsDelivr, read 2026-10-26); Tailwind ships no
 *  fixed stylesheet (each project generates its own), so it has no row. */
export const CSS_FRAMEWORKS = TABLES.CSS_FRAMEWORKS as unknown as readonly { id: string; name: string; url: string }[]
/** The rows a client measured, a ratio each: one reader for every comparison by size (the stylesheet, the tools/list). */
export const keepMeasured = <R extends object>(rows: readonly R[]) => rows.filter((r): r is Extract<R, { ratio: number | null }> => 'ratio' in r)
/** The comparison by size, as the client measured it: each framework's bytes raw and gzipped over the QPU stylesheet's, a ratio above one
 *  meaning the framework is that many times larger; a file not fetched is named, never estimated. Size only: render time is not measured here. */
/** Four 8-bit notes, A B C D, witnessed as hex in the tail and sounded as the a432 harmonics. The stylesheet is the codec:
 *  audio is the four frequencies, video is those four frames against the thirty-six of the scan, vibration is the four amplitudes in
 *  milliseconds, and the eight hex digits are the compression. Decoding the stylesheet returns the notes; reversing the hex shows their
 *  shadow, and reversing that returns the notes, so the shadow verifies them without a second address (textbook_scan_stream). */
const decodeMedia = (css: string) => {
  const token = css.match(/--qpu-media:\s*([0-9a-f]{8})/)?.[1]
  if (!token) throw new Error('a media stylesheet carries --qpu-media as eight hex digits')
  const hz = (css.match(/--qpu-audio:\s*([^;]+)/)?.[1] ?? '').match(/(\d+)Hz/g)?.map((s) => parseInt(s, 10)) ?? []
  const notes = (['a', 'b', 'c', 'd'] as const).map((name, i) => {
    const bits = parseInt(css.match(new RegExp(`--qpu-note-${name}:\\s*(\\d+)`))?.[1] ?? '', 10)
    const hex = token.slice(i * 2, i * 2 + 2)
    return { name: name.toUpperCase(), hex, bits, width: 8 as const, hz: hz[i] ?? null, agrees: parseInt(hex, 16) === bits }
  })
  const vibrate = (css.match(/--qpu-vibrate:\s*([^;]+)/)?.[1] ?? '').match(/(\d+)ms/g)?.map((s) => parseInt(s, 10)) ?? []
  return { token, notes, vibrate, agrees: notes.every((n, i) => n.agrees && n.hz === HARMONICS[i]) && vibrate.length === notes.length && vibrate.every((ms, i) => ms === notes[i]!.bits) }
}
export const media = (tail: string) => {
  if (!/^[0-9a-f]{12}$/.test(tail)) throw new Error('the tail is 12 hex: four 8-bit notes and the flags')
  const token = tail.slice(0, 8), flags = parseInt(tail.slice(8), 16)
  const witnesses = (['A', 'B', 'C', 'D'] as const).map((name, i) => {
    const hex = token.slice(i * 2, i * 2 + 2), bits = parseInt(hex, 16)
    return { name, hex, bits, width: 8 as const, hz: HARMONICS[i]! }
  })
  const reverse = (hex: string) => [...hex].reverse().join('')
  const shadow = reverse(token), back = reverse(shadow)
  const shadowNotes = (['A', 'B', 'C', 'D'] as const).map((name, i) => { const hex = shadow.slice(i * 2, i * 2 + 2); return { name, hex, bits: parseInt(hex, 16), width: 8 as const } })
  const verifies = back === token && witnesses.every((w, i) => back.slice(i * 2, i * 2 + 2) === w.hex)
  const video = { frames: witnesses.length, full: SCAN.frames, ratio: SCAN.frames / witnesses.length, clock: SCAN.frameMs, period: SCAN.periodMs, hues: witnesses.map((w) => (w.bits % 16) * SCAN.hueStep) }
  const vibration = witnesses.map((w) => w.bits)
  const harmony = witnesses.every((w, i) => i === 0 || witnesses[i - 1]!.hz === w.hz * 2) && witnesses[0]!.hz === KEY
  const css = [`.qpu-media {`, `  --qpu-media: ${token};`, ...witnesses.map((w) => `  --qpu-note-${w.name.toLowerCase()}: ${w.bits};`), `  --qpu-audio: ${witnesses.map((w) => `${w.hz}Hz`).join(' ')};`, `  --qpu-video: ${video.hues.map((hue) => `hsl(${hue} 62% 44%)`).join(', ')};`, `  --qpu-vibrate: ${vibration.map((ms) => `${ms}ms`).join(' ')};`, `  animation: qpu-video ${video.period}ms steps(${video.full}, end) infinite, qpu-vibrate ${vibration.reduce((n, ms) => n + ms, 0)}ms steps(${vibration.length}, end) infinite;`, `}`].join('\n')
  const decoded = decodeMedia(css)
  const roundTrip = decoded.token === token && decoded.agrees && decoded.notes.every((n, i) => n.bits === witnesses[i]!.bits && n.hz === witnesses[i]!.hz)
  return { token, flags, witnesses, shadow, shadowNotes, back, verifies, audio: { root: KEY, notes: witnesses.map((w) => ({ name: w.name, hz: w.hz, amp: w.bits })) }, video, vibration, css, compressed: token.length, expanded: css.length, ratio: Math.round((css.length / token.length) * 100) / 100, roundTrip, harmony, clock: video.period === KEY * (SCAN.frames / witnesses.length) && SCAN.frames * SCAN.frameMs === KEY * 9, theorem: 'textbook_scan_stream' as const }
}

export const compareCss = (qpu: { bytes: number; gzip: number }, answers: readonly { id: string; status: number; bytes: number; gzip: number }[]) => {
  const ratio = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) / 100 : null)
  const rows = CSS_FRAMEWORKS.map((f) => { const a = answers.find((x) => x.id === f.id); return a && a.status === 200 && a.bytes > 0 ? { id: f.id, name: f.name, url: f.url, bytes: a.bytes, gzip: a.gzip, ratio: ratio(a.bytes, qpu.bytes), ratioGzip: ratio(a.gzip, qpu.gzip) } : { id: f.id, name: f.name, url: f.url, missing: a ? `HTTP ${a.status}` : 'not fetched' } })
  const measured = keepMeasured(rows)
  return { qpu, rows, measured: measured.length, says: measured.length ? `the QPU stylesheet is ${qpu.bytes} bytes (${qpu.gzip} gzipped); ${measured.map((r) => `${r.name} ${r.ratio}× raw, ${r.ratioGzip}× gzipped`).join('; ')}: size only, render time not measured` : 'no framework fetched' }
}
