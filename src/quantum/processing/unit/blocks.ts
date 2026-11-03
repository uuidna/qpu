// Every result as a presentation block any host can render: Open Graph metadata for the link preview, and a shadcn
// registry item (https://ui.shadcn.com/schema/registry-item.json) carrying the same HTML as a block, so an MCP host, a
// shadcn-based app, or any adaptor shows the same thing. Pure functions; the id is a deterministic FNV-1a hash of the
// call, so equal calls give equal blocks.

export type OpenGraph = { 'og:title': string; 'og:description': string; 'og:type': 'website'; 'og:url': string; 'og:site_name': string; 'article:author': string; license: string }
export type RegistryItem = { $schema: 'https://ui.shadcn.com/schema/registry-item.json'; name: string; type: 'registry:block'; title: string; description: string; registryDependencies: string[]; author: string; license: string; files: { path: string; type: 'registry:block'; content: string }[]; meta: { tool: string; arguments: Record<string, unknown>; id: string } }
import { KEY, accentOfUuid, cmykOfUuid, hueOf, programHues, getFramesGradient, GLAGOLITIC_OF } from './theme.ts'
import { LICENSE, attributionHtml } from './license.ts'

export type Block = { id: string; html: string; theme: { key: number; hue: number; cmyk: { c: number; m: number; y: number; k: number }; accent: string }; openGraph: OpenGraph; shadcn: RegistryItem }

/** FNV-1a 64 in 16-bit limbs, low first, continued over text: foldOf(a + b) is foldFrom(foldFrom(OFFSET, a), b). O(n), no BigInt. */
type Limbs = [number, number, number, number]
const OFFSET: Limbs = [0x2325, 0x8422, 0x9ce4, 0xcbf2]
const foldFrom = ([h0, h1, h2, h3]: Limbs, text: string): Limbs => {
  for (let i = 0; i < text.length; i++) {
    h0 ^= text.charCodeAt(i)
    const t0 = h0 * 0x1b3, t1 = h1 * 0x1b3 + (t0 >>> 16), t2 = h2 * 0x1b3 + (h0 << 8) + (t1 >>> 16)
    h3 = (h3 * 0x1b3 + (h1 << 8) + (t2 >>> 16)) & 0xffff; h0 = t0 & 0xffff; h1 = t1 & 0xffff; h2 = t2 & 0xffff
  }
  return [h0, h1, h2, h3]
}
const hexOf = (limbs: Limbs): string => limbs.map((l) => l.toString(16).padStart(4, '0')).reverse().join('')
/** FNV-1a 64 fold of a string to 16 lowercase hex digits, the fold the unit builds every receipt and address on. O(n). */
export const foldOf = (text: string): string => hexOf(foldFrom(OFFSET, text))
/** The version nibble the other 31 digits decide: 1 + (rest^7 mod 91) mod 8, exact in numbers (r^7 < 2^53). O(1). */
const versionOf = (digits: string): string => { const r = [...digits].reduce((m, d, i) => (i === 12 ? m : (m * 16 + parseInt(d, 16)) % 91), 0); return (1 + ((r ** 7) % 91) % 8).toString(16) }
const dashedOf = (h: string): string => `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`
/** 32 hex digits stamped and grouped 8-4-4-4-12: the version nibble (position 12) is DECIDED by the other 31. O(1). */
export const stampOf = (digits: string): string => dashedOf(`${digits.slice(0, 12)}${versionOf(digits)}${digits.slice(13)}`)
/** The unit's content UUID, ported one for one from uuidna's shapeUuidOf: two folds, of the text and of the text marked,
 *  laid out 12+1+3 | variant | 3+12 as 8-4-4-4-12, the variant nibble from the low fold (8..b), and the version nibble
 *  DECIDED by the content: 1 + (rest^rays mod C(faces, coins)) mod mintOf(n) = 1 + (rest^7 mod 91) mod 8, so a tampered
 *  middle wears a version its content does not. The same text gives the same UUID here and at uuidna.com. O(n), one fold. */
export const uuidOf = (text: string): string => {
  const state = foldFrom(OFFSET, text)
  const high = hexOf(state)
  const low = hexOf(foldFrom(state, '\u0000shape'))
  const variant = ((parseInt(low.slice(0, 1), 16) % 4) + 8).toString(16)
  return stampOf(`${high.slice(0, 12)}${high.slice(15, 16)}${high.slice(12, 15)}${variant}${low.slice(1, 4)}${low.slice(4, 16)}`)
}
/** A UUID reassembled from its parts: handle (8 hex), ten program nibbles, tail (12 hex); the variant nibble is 8 and the version is
 *  decided by the stamp, so the result is a valid, sealed address whose channel reads back the same handle, program and tail. */
export const uuidFromParts = (handle: string, program: readonly number[], tail: string): string => {
  if (!/^[0-9a-f]{8}$/.test(handle) || program.length !== 10 || program.some((n) => !Number.isInteger(n) || n < 0 || n > 15) || !/^[0-9a-f]{12}$/.test(tail)) throw new Error('a handle is 8 hex, a program ten nibbles 0..15, a tail 12 hex')
  const p = program.map((n) => n.toString(16))
  const middle = `${p.slice(0, 4).join('')}0${p.slice(4, 7).join('')}8${p.slice(7, 10).join('')}` // version slot filled by the stamp
  return stampOf(`${handle}${middle}${tail}`)
}
/** The program-space neighbours of an address (textbook_neighbour_step): g1's 16 program bits and g2's and g3's 12 each (their first nibble is
 *  the stamp's, decided, never walked) stepped by one either way modulo their width and stamped again: six sealed addresses with the same handle
 *  and tail, each with its colour; the step back returns the program. O(1). */
export const neighboursOf = (uuid: string) => {
  const ch = channelOf(uuid)
  const hexOfProgram = (p: readonly number[]) => p.map((n) => n.toString(16)).join('')
  return { uuid, program: hexOfProgram(ch.program), neighbours: [[0, 4], [4, 7], [7, 10]].flatMap(([s, e], g) => [1, -1].map((step) => {
    const w = 16 ** (e! - s!), v = (ch.program.slice(s, e).reduce((n, d) => n * 16 + d, 0) + step + w) % w, p = [...ch.program]
    for (let i = e! - 1, r = v; i >= s!; i--, r = Math.floor(r / 16)) p[i] = r % 16
    const id = uuidFromParts(ch.handle, p, ch.tail)
    return { axis: `g${g + 1}`, step, uuid: id, program: hexOfProgram(p), colour: accentOfUuid(id), sealed: sealOf(id).valid }
  })), says: 'one step on g1, g2 or g3 either way, modulo the group\'s program bits; the handle and the tail kept, the stamp decided again' }
}
/** Navigation through the content-addressed UUID space: a position (a UUID) with its coordinates (the program), its six one-step neighbours
 *  (neighboursOf, g1/g2/g3 either way) and the stream of the position with its neighbours ordered along an axis (streamOf) — the walkable
 *  lattice. A client steps to a neighbour, sweeps the stream by hue|program|tail, or jumps by content address (the match door). The same frame
 *  tracks the Internet of Things: a device is a UUID, its readings are entries at its address, so a device is a position and a fleet is a stream,
 *  navigated and tracked exactly the same way — move, sweep, jump; no device registry beyond the address. Pure, O(1) over the six-neighbour lattice. */
export const navigate = (uuid: string, q: Parameters<typeof streamOf>[1] = {}) => {
  const here = neighboursOf(uuid)
  const stream = streamOf([uuid, ...here.neighbours.map((n) => n.uuid)], q)
  return { here: uuid, program: here.program, neighbours: here.neighbours, stream }
}

/** A program compiled against the tools: each nibble picks a tool, enum parameters are chosen by the nibble, integer parameters
 *  come from the tail's three 16-bit readings clamped into the schema's bounds. The first step is `next`. */
export type Step = { nibble: number; tool: string; arguments: Record<string, unknown> }
/** A program compiled against the tools: each of the ten program nibbles picks a usable tool (not audit/match/verify), its enum parameters chosen by the
 *  nibble and its integer parameters read from the tail's three 16-bit values clamped into the schema's bounds; the first step is `next`. Pure; served by
 *  the Compile docs component (its use keeps it, textbook_program_compiles). */
export const compileOf = (program: readonly number[], tools: readonly { name: string; inputSchema: { properties?: Record<string, { type?: string; enum?: unknown[]; minimum?: number; maximum?: number; default?: unknown }>; required?: string[] } }[], message: { three16: readonly number[] }): { steps: Step[]; next: Step | undefined } => {
  const usable = tools.filter((t) => !['audit', 'match', 'verify'].includes(t.name))
  const steps: Step[] = program.map((nibble, i) => {
    const tool = usable[nibble % usable.length]!
    const args: Record<string, unknown> = {}
    let k = 0
    for (const [name, spec] of Object.entries(tool.inputSchema.properties ?? {})) {
      const required = tool.inputSchema.required?.includes(name)
      if (spec.enum && (required || nibble % 2 === 1)) args[name] = spec.enum[(nibble + i) % spec.enum.length]
      else if ((spec.type === 'integer' || spec.type === 'number') && (required || typeof spec.default !== 'undefined')) {
        const raw = message.three16[k++ % 3]!
        if (spec.type === 'number' && typeof spec.maximum !== 'number') args[name] = Math.round((raw / 65536) * 1e4) / 1e4 // an unbounded number reads the tail as a fraction
        else { const lo = spec.minimum ?? 0, hi = spec.maximum ?? Math.max(lo, raw); args[name] = lo + (raw % (hi - lo + 1)) }
      }
    }
    return { nibble, tool: tool.name, arguments: args }
  })
  return { steps, next: steps[0] }
}
/** The cheap check without the content: the version nibble the other 31 nibbles decide, read back. A tampered middle wears a
 *  version its content does not; one modular power tells. Shape and variant are checked too. */
export const sealOf = (uuid: string): { valid: boolean; shape: boolean; variant: boolean; version: { found: string; expected: string; agree: boolean } } => {
  const shape = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(uuid)
  if (!shape) return { valid: false, shape, variant: false, version: { found: '', expected: '', agree: false } }
  const digits = uuid.replace(/-/g, '')
  const found = digits[12]!
  const expected = versionOf(digits)
  const variant = /^[89ab]$/.test(digits[16]!)
  return { valid: variant && found === expected, shape, variant, version: { found, expected, agree: found === expected } }
}
/** Content, neighbours, seal: what one UUID can be checked against, each check independent and each cheap. */
export const verifyOf = (uuid: string, content?: string, prev?: { id: string }, next?: { id: string; prev?: string }, self?: { prev?: string }) => {
  const seal = sealOf(uuid)
  const checks: { check: string; passed: boolean | null; evidence: string }[] = [
    { check: 'seal', passed: seal.valid, evidence: seal.shape ? `version ${seal.version.found} vs decided ${seal.version.expected}; variant ${seal.variant ? 'in 8..b' : 'out of range'}` : 'not an RFC 9562 shape' },
    { check: 'content', passed: content === undefined ? null : uuidOf(content) === uuid, evidence: content === undefined ? 'no content given' : `uuidOf(content) = ${uuidOf(content)}` },
    { check: 'prev', passed: prev === undefined || self === undefined ? null : self.prev === prev.id, evidence: prev === undefined || self === undefined ? 'no predecessor given' : `self.prev ${self.prev ?? 'none'} vs prev.id ${prev.id}` },
    { check: 'next', passed: next === undefined ? null : next.prev === uuid, evidence: next === undefined ? 'no successor given' : `next.prev ${next.prev ?? 'none'} vs ${uuid}` },
  ]
  const decided = checks.filter((c) => c.passed !== null)
  return { uuid, channel: channelOf(uuid), reflection: reflectionOf(uuid), valid: decided.every((c) => c.passed), checks, decided: decided.length, cost: 'one modular power for the seal, one fold for the content, two string equalities for the neighbours', bound: 'the fold is tamper-evident and separates content; it is not collision-resistant against an adversary who searches for one. The docket and the receipts carry a SHA-256 beside it for that case.' }
}

/** The tail read every way at once — the program's step decides which reading it means. */
export const tailReadingsOf = (tail: string) => {
  const one48 = parseInt(tail, 16)
  const bytes = [...Array(6).keys()].map((i) => parseInt(tail.slice(i * 2, i * 2 + 2), 16))
  const text6 = bytes.every((b) => b >= 32 && b < 127) ? String.fromCharCode(...bytes) : null
  const date = new Date(one48)
  const timestamp = one48 >= Date.UTC(1970, 0, 2) && one48 <= Date.UTC(2100, 0, 1) ? date.toISOString() : null
  const two24 = [parseInt(tail.slice(0, 6), 16), parseInt(tail.slice(6), 16)]
  return {
    one48, two24, three16: [parseInt(tail.slice(0, 4), 16), parseInt(tail.slice(4, 8), 16), parseInt(tail.slice(8), 16)],
    text6, timestamp,
    referrer: { handle: tail.slice(0, 8), flags: parseInt(tail.slice(8), 16) },
    colour: { rgb: `#${tail.slice(0, 6)}`, key: parseInt(tail.slice(6), 16) / 0xffffff },
    coordinate: { lat: Math.round((two24[0]! / 0xffffff * 180 - 90) * 1e6) / 1e6, lon: Math.round((two24[1]! / 0xffffff * 360 - 180) * 1e6) / 1e6 },
    // the 9-vortex: the seed, its reflection under σ_10 (the involution the kernel holds: 10 - (10 - x) = x), the trinity the
    // seed belongs to and the trinity it reflects into at the same time — 3, 6, 9 reflect to 7, 4, 1 and back; 2, 5, 8 reflect
    // into themselves with 5 fixed — and whether the seed sits in the key's trinity (432 → 4 + 3 + 2 = 9 → 3, 6, 9)
    vortex: (() => { const seed = one48 === 0 ? 0 : 1 + ((one48 - 1) % 9); const trinity = seed === 0 ? [] : seed % 3 === 0 ? [3, 6, 9] : [7, 4, 1].includes(seed) ? [7, 4, 1] : [2, 5, 8]; const reflected = trinity.map((x) => 10 - x); return { seed, reflection: seed === 0 ? 0 : 10 - seed, fixed: seed === 5, polarity: seed === 0 ? 'zero' : seed < 5 ? 'minus' : seed > 5 ? 'plus' : 'fixed', trinity, reflected, tuned: trinity[0] === 3, key: KEY } })(),
  }
}

/** The channel a UUID is: handle (8 hex, the family), the hex PROGRAM (the twelve middle nibbles; the version and variant nibbles
 *  are kept, the other ten are one formula index each), and the MESSAGE in the tail (12 hex = 48 bits: one 48-bit natural, two
 *  24-bit, or three 16-bit). Read from the id alone, so a page's head is computable without any lookup. */
export const channelOf = (uuid: string) => {
  const hex = uuid.replace(/-/g, '')
  const handle = hex.slice(0, 8)
  const middle = hex.slice(8, 20)
  const tail = hex.slice(20, 32)
  const program = [...middle].filter((_c, i) => i !== 4 && i !== 8).map((c) => parseInt(c, 16))
  return {
    uuid, handle, middle, tail, program, version: middle[4]!, variant: middle[8]!,
    message: tailReadingsOf(tail),
    door: `qpu://${handle}`,
    words: `${handle} · program ${program.join('')} · tail ${tail}`,
  }
}

/** The reflection of an address: σ applied to every part at once — each program nibble to 15 − n, the tail to its 48-bit complement
 *  (so every reading mirrors), the handle to its complement family — stamped into a valid address. Reflecting twice returns the
 *  parts (Qpu.Sigma: σ_d(σ_d(x)) = x); the version nibble is decided afresh each time, so only the parts round-trip, by design. */
export const reflectionOf = (uuid: string) => {
  const ch = channelOf(uuid)
  const complementOf = (hex: string) => [...hex].map((c) => (15 - parseInt(c, 16)).toString(16)).join('')
  const handle = complementOf(ch.handle)
  const program = ch.program.map((n) => 15 - n)
  const tail = complementOf(ch.tail)
  const mirror = uuidFromParts(handle, program, tail)
  return { of: uuid, mirror, handle, program, tail, readings: tailReadingsOf(tail), fixed: ch.program.filter((n) => n === 15 - n).length, note: 'σ_15 on nibbles has no fixed point; the pair is two states held at once' }
}

/** Canonical text (sorted keys), the form the unit addresses a value by: a BigInt as its digits with an `n` marker (so 10n, 10 and "10" are
 *  three addresses, never one — plain JSON.stringify throws on a BigInt); a value with a `toJSON` (a Date among them) by what it serialises to, as
 *  JSON itself does (so two Dates never collide to `{}`); a non-finite number as its name; a key whose value is undefined dropped, as on the wire (never
 *  `{"a":null}`); everything else as canonical JSON. A plain object with no enumerable keys and no toJSON (a Map, a Set) still reads as `{}` — such
 *  values are not JSON and are not addressed by content. */
export const canonicalTextOf = (value: unknown): string =>
  typeof value === 'bigint' ? `"${value}n"`
    : Array.isArray(value) ? `[${value.map(canonicalTextOf).join(',')}]`
    : value !== null && typeof value === 'object'
      ? typeof (value as { toJSON?: unknown }).toJSON === 'function' ? canonicalTextOf((value as { toJSON: () => unknown }).toJSON())
        : `{${Object.keys(value as object).filter((k) => (value as Record<string, unknown>)[k] !== undefined).sort().map((k) => `${JSON.stringify(k)}:${canonicalTextOf((value as Record<string, unknown>)[k])}`).join(',')}}`
    : typeof value === 'number' && !Number.isFinite(value) ? `"${value}"` : JSON.stringify(value) ?? 'null'

/** A docket entry's canonical text (kind, source, body, the ids it links): what the entries hook addresses and every client predicting an address computes. */
export const entryTextOf = (e: { kind: unknown; from: unknown; body?: unknown; links?: readonly string[] }): string => canonicalTextOf({ kind: e.kind, from: e.from, body: e.body ?? null, ...(e.links?.length ? { links: [...e.links].sort() } : {}) })
/** f memoised by the content address of its arguments, unbounded; for a pure f only, memoOf(f)(x) = f(x) (textbook_memo_identity). */
export const memoOf = <A extends unknown[], R>(f: (...a: A) => R): ((...a: A) => R) => { const m = new Map<string, R>(); return (...a) => { const k = uuidOf(canonicalTextOf(a)); if (!m.has(k)) m.set(k, f(...a)); return m.get(k)! } }

const escapeOf = (t: string): string => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export const blockOf = (tool: string, args: Record<string, unknown>, structured: unknown, html: string, description: string): Block => {
  const query = Object.keys(args).length ? '?' + new URLSearchParams(Object.entries(args).map(([k, v]) => [k, typeof v === 'string' ? v : JSON.stringify(v)])).toString() : ''
  const id = uuidOf(`${tool}${JSON.stringify(args)}`)
  // A heading to land on: what a screen reader announces first, and what the audit's accessibility check measures.
  const heading = `<div role="heading" aria-level="2" style="font-size: var(--font-size-footnote); color: var(--text-muted); margin-bottom: var(--gap-sm, 6px);">${tool} · ${escapeOf(description)}</div>`
  // the wrapper: the block's own custom properties inline, its accent drawn as the left rule
  const style = styleOf(id), wrapped = `<div data-block="${id}" class="qpu-block" data-vortex="${style.vars['--qpu-vortex']}" style="${style.css}; border-left: 3px solid var(--qpu-accent); padding-left: var(--pad-sm, 8px);">${heading + html + attributionHtml()}</div>`
  return {
    id,
    html: wrapped,
    theme: { key: KEY, hue: hueOf(KEY), cmyk: cmykOfUuid(id), accent: accentOfUuid(id) },
    openGraph: { 'og:title': `${tool} · @uuidna/qpu`, 'og:description': JSON.stringify(structured) ?? '', 'og:type': 'website', 'og:url': `qpu://tools/${tool}${query}`, 'og:site_name': '@uuidna/qpu', 'article:author': LICENSE.author, license: `${LICENSE.spdx} ${LICENSE.url}` },
    shadcn: {
      $schema: 'https://ui.shadcn.com/schema/registry-item.json',
      name: `qpu-${tool}-${id.slice(0, 8)}`,
      type: 'registry:block',
      title: `${tool} · @uuidna/qpu`,
      description,
      registryDependencies: ['card', 'table', 'badge'],
      author: `${LICENSE.author} <${LICENSE.contact}> (${LICENSE.orcid})`,
      license: LICENSE.spdx,
      files: [{ path: `blocks/qpu-${tool}-${id.slice(0, 8)}.html`, type: 'registry:block', content: wrapped }],
      meta: { tool, arguments: args, id },
    },
  }
}

/** One quantum core used by all: a UUID's 32 nibbles are its handle (8), its program (10), its tail (12) and the two stamp nibbles
 *  (textbook_uuid_core); every toolbox's result is such an address, and the combinatorics below — the style an address computes for itself, the
 *  presentation of any hex as a shadcn combination, the query, sort, filter and execution of a UUID-only stream — are this module's alone:
 *  the crypto fold tool exposes them over MCP, the payload toolbox delegates to them, the site renders by them. */
/** Every bit styled from the UUID stream itself, nothing loaded — the one cascade source: every custom property a block wears (inline, in the css
 *  tool, the presentation, the shadcn items) is computed here once, one value each. The handle gives the hue, the middle as CMYK the accent, the
 *  program the saturation and lightness, the tail the radius, the gap and the 9-vortex; the reflected hue and the drift's prime dust in the same pass. */
export const styleOf = (uuid: string) => {
  const ch = channelOf(uuid), { one48, vortex: { seed, trinity } } = ch.message, program = programHues(uuid), { c, m, y, k } = cmykOfUuid(uuid), accent = accentOfUuid(uuid)
  const hue = parseInt(ch.handle, 16) % 360, sat = 40 + (ch.program.reduce((n, d) => n + d, 0) % 40), light = 36 + (ch.program[0]! % 20)
  const radius = 2 + (parseInt(ch.tail.slice(0, 1), 16) % 14), gap = 4 + (parseInt(ch.tail.slice(1, 2), 16) % 12), drift = Math.abs(2 * hue - 360)
  const dust: number[] = []; { let n = drift; for (let p = 2; p * p <= n; p += 1) while (n % p === 0) { dust.push(p); n /= p } if (n > 1) dust.push(n) }
  const vars = {
    '--qpu-hue': String(hue), '--qpu-reflected-hue': String((360 - hue) % 360), '--qpu-drift': String(drift), '--qpu-dust': dust.join(' ') || '0', '--qpu-drift-angle': ((2 * Math.PI * drift) / 360).toFixed(6),
    '--qpu-frames': getFramesGradient(uuid), '--qpu-program': program.ring, '--qpu-shift': String(program.shift), '--qpu-c': c.toFixed(3), '--qpu-m': m.toFixed(3), '--qpu-y': y.toFixed(3), '--qpu-k': k.toFixed(3),
    '--qpu-accent': accent, '--block-accent': accent, '--qpu-surface': `hsl(${hue} ${Math.round(sat / 4)}% 97%)`, '--qpu-ink': `hsl(${hue} ${Math.round(sat / 3)}% 14%)`, '--qpu-radius': `${radius}px`, '--qpu-gap': `${gap}px`,
    '--qpu-tail': `rgb(${[0, 2, 4].map((i) => parseInt(ch.tail.slice(i, i + 2), 16)).join(' ')})`, '--qpu-angle': String(one48 % 360), '--qpu-vortex': String(seed), '--qpu-reflection': String(10 - seed),
    '--qpu-signal': `'${GLAGOLITIC_OF[seed] ?? ''}'`, '--qpu-signal-reflected': `'${GLAGOLITIC_OF[10 - seed] ?? ''}'`, '--qpu-signal-digits': `'${seed} ${10 - seed}'`, '--qpu-trinity': String(trinity[0] ?? 0), '--qpu-period': `${(seed || 9) * KEY}ms`,
  }
  return { uuid, hue, sat, light, radius, gap, vars, css: Object.entries(vars).map(([k, v]) => `${k}: ${v}`).join('; '), says: 'computed from the address, one value per property: the handle gives the hue, the middle the accent, the program the saturation and lightness, the tail the radius, the gap and the vortex; nothing loaded' }
}
/** Any hex is presentable as a shadcn combination: each nibble picks one of the eight registry items (the two hosts and the six styled ones)
 *  and one of two variants (solid, outline) — sixteen choices, a nibble (textbook_hex_presentations) — so a UUID, a hash or an address is a
 *  layout of its own nibbles, every part styled from the hex itself; nothing loaded. */
export const PRESENTABLE_ITEMS = ['qpu-app', 'qpu-block', 'qpu-style', 'qpu-card', 'qpu-badge', 'qpu-table', 'qpu-stream', 'qpu-dashboard'] as const
export const presentationOf = (hex: string) => {
  const clean = hex.toLowerCase().replace(/[^0-9a-f]/g, '')
  if (!clean) throw new Error('a hex string presents itself: give one')
  const nibbles = [...clean].map((c) => parseInt(c, 16))
  const uuid = /^[0-9a-f]{32}$/.test(clean) ? dashedOf(clean) : uuidOf(clean)
  const style = styleOf(uuid)
  const parts = nibbles.map((n, i) => ({ at: i, nibble: n.toString(16), item: PRESENTABLE_ITEMS[n % 8]!, variant: n < 8 ? 'solid' : 'outline' }))
  const layout = parts.map((p) => `<${p.item.replace(/^qpu-/, 'Qpu').replace(/^Qpu(.)/, (_m, c: string) => `Qpu${c.toUpperCase()}`)} variant="${p.variant}" uuid="${uuid}" />`).join('\n')
  return { hex: clean, uuid, nibbles: nibbles.length, choices: 16, items: PRESENTABLE_ITEMS.length, variants: 2, combinations: `16^${nibbles.length}`, style: style.vars, parts, layout, says: 'each nibble is one of sixteen choices: an item of eight and a variant of two; the whole hex is a layout styled from itself, nothing loaded' }
}
/** A UUID-only stream is queryable, sortable, filterable and executable, like any hex is presentable: every row is the hex itself — its
 *  channel (handle, program, tail), its style, the item and the variant its first nibble picks — so a query names nibbles and handles, a
 *  sort names hex, hue or program, a filter names an item or a variant, and execution is the program rotated (the next address) with the
 *  page and the dashboard the address answers; nothing but the stream is read. */
export type StreamQuery = { where?: { handle?: string; nibble?: { at: number; is: string }; item?: string; variant?: 'solid' | 'outline'; hueBetween?: [number, number] }; sort?: 'hex' | 'hue' | 'program' | 'tail'; descending?: boolean; execute?: boolean; origin?: string }
export const streamOf = (hexes: readonly string[], q: StreamQuery = {}) => {
  const origin = q.origin ?? 'https://qpu.uuidna.com'
  const rows = hexes.map((h) => { const p = presentationOf(h); const ch = channelOf(p.uuid); const st = styleOf(p.uuid); return { hex: p.hex, uuid: p.uuid, handle: ch.handle, program: ch.program.join(''), tail: ch.tail, hue: st.hue, sum: ch.program.reduce((n, d) => n + d, 0), item: p.parts[0]!.item, variant: p.parts[0]!.variant, style: st.vars } })
  const w = q.where ?? {}
  const filtered = rows.filter((r) => (w.handle ? r.handle.startsWith(w.handle.toLowerCase()) : true) && (w.nibble ? r.hex[w.nibble.at] === w.nibble.is.toLowerCase() : true) && (w.item ? r.item === w.item : true) && (w.variant ? r.variant === w.variant : true) && (w.hueBetween ? r.hue >= w.hueBetween[0] && r.hue <= w.hueBetween[1] : true))
  const key = q.sort ?? 'hex'
  const sorted = [...filtered].sort((a, b) => (key === 'hue' ? a.hue - b.hue : key === 'program' ? a.sum - b.sum : key === 'tail' ? a.tail.localeCompare(b.tail) : a.hex.localeCompare(b.hex)) * (q.descending ? -1 : 1))
  const executed = q.execute ? sorted.map((r) => { const ch = channelOf(r.uuid); const next = uuidFromParts(ch.handle, [...ch.program.slice(1), ch.program[0]!], ch.tail); return { ...r, next, dashboard: `${origin}/${uuidOf(`dashboard${JSON.stringify({ uuid: r.uuid })}`)}`, page: `${origin}/${r.uuid}` } }) : sorted
  return { stream: hexes.length, filtered: filtered.length, rows: executed, ops: { where: w, sort: key, descending: !!q.descending, executed: !!q.execute }, says: 'a stream of hexes alone: queried by handle, nibble, item, variant or hue; sorted by hex, hue, program or tail; executed as the program rotated (the next address) and the page and dashboard the address answers; every row styled from itself' }
}

/** DNA as a UUID stream (textbook_dna_base4): two bases a nibble, 64 a UUID, read back exactly with the base count. */
const DNA_BASES = 'ACGT'
export const dnaToHex = (seq: string): string => { const s = seq.toUpperCase().replace(/[^ACGT]/g, ''); let h = ''; for (let i = 0; i < s.length; i += 2) h += (((DNA_BASES.indexOf(s[i]!) & 3) << 2) | (i + 1 < s.length ? DNA_BASES.indexOf(s[i + 1]!) & 3 : 0)).toString(16); return h }
export const hexToDna = (hex: string): string => [...hex.toLowerCase().replace(/[^0-9a-f]/g, '')].map((c) => { const n = parseInt(c, 16); return DNA_BASES[(n >> 2) & 3]! + DNA_BASES[n & 3]! }).join('')
export const dnaStreamOf = (seq: string, q: StreamQuery = {}) => {
  const clean = seq.toUpperCase().replace(/\s/g, ''), bad = /[^ACGT\s]/iu.exec(seq), hex = dnaToHex(clean)
  if (bad) throw new Error(`dna takes A, C, G and T only (whitespace aside): ${bad[0]} at ${bad.index} is not a base`)
  const chunks: string[] = []; for (let i = 0; i < hex.length; i += 32) chunks.push(hex.slice(i, i + 32).padEnd(32, '0'))
  const uuids = chunks.map((c) => dashedOf(c))
  return { bases: clean.length, basesPerUuid: 64, hex, uuids, readBack: hexToDna(hex).slice(0, clean.length), roundTrips: hexToDna(hex).slice(0, clean.length) === clean, address: uuidOf(clean), stream: streamOf(uuids, q), theorem: 'textbook_dna_base4', says: `${clean.length} base(s) as ${uuids.length} UUID(s) — two bases a nibble, read back one for one — the DNA stream navigable like any UUID stream (uuid dna uuidna)` }
}

/** All UUID version schemas at once in one UUID: the same 128 bits read as every RFC 9562 layout — version 1 (Gregorian time, clock
 *  sequence, node), 3 and 5 (a name hashed), 4 (random), 6 (the Gregorian time reordered), 7 (Unix milliseconds and random), 8 (custom),
 *  nil and max (textbook_uuid_schemas: seven versions and two constants) — beside the version and variant the stamp nibbles declare; the
 *  core's channel, style, presentation and stream read none of them, so every schema presents the same. */
export const UUID_SCHEMAS = [1, 3, 4, 5, 6, 7, 8] as const
export const uuidSchemasOf = (uuid: string) => {
  const hex = uuid.toLowerCase().replace(/[^0-9a-f]/g, '')
  if (hex.length !== 32) throw new Error('a UUID is 32 hex digits')
  const stamped = { version: parseInt(hex[12]!, 16), variant: ((parseInt(hex[16]!, 16) >> 2) === 2 ? 'RFC 9562 (10xx)' : (parseInt(hex[16]!, 16) >> 1) === 6 ? 'Microsoft (110x)' : parseInt(hex[16]!, 16) < 8 ? 'NCS (0xxx)' : 'future (111x)') }
  const gregorian = (ticks: bigint) => new Date(Number(ticks / 10_000n) - 12_219_292_800_000).toISOString()
  const v1Ticks = (BigInt('0x' + hex.slice(13, 16)) << 48n) | (BigInt('0x' + hex.slice(8, 12)) << 32n) | BigInt('0x' + hex.slice(0, 8))
  const v6Ticks = (BigInt('0x' + hex.slice(0, 8)) << 28n) | (BigInt('0x' + hex.slice(8, 12)) << 12n) | BigInt('0x' + hex.slice(13, 16))
  const safeDate = (f: () => string) => { try { return f() } catch { return 'out of range' } }
  return {
    hex, stamped, isNil: /^0{32}$/.test(hex), isMax: /^f{32}$/.test(hex),
    schemas: {
      v1: { time_low: hex.slice(0, 8), time_mid: hex.slice(8, 12), time_hi: hex.slice(13, 16), clock_seq: hex.slice(16, 20), node: hex.slice(20), time: safeDate(() => gregorian(v1Ticks)) },
      v3: { md5: hex, says: 'a name hashed with MD5: the bits are the digest' },
      v4: { random: hex, says: 'random bits' },
      v5: { sha1: hex, says: 'a name hashed with SHA-1: the bits are the digest' },
      v6: { time_high: hex.slice(0, 8), time_mid: hex.slice(8, 12), time_low: hex.slice(13, 16), clock_seq: hex.slice(16, 20), node: hex.slice(20), time: safeDate(() => gregorian(v6Ticks)) },
      v7: { unix_ts_ms: Number(BigInt('0x' + hex.slice(0, 12))), time: safeDate(() => new Date(Number(BigInt('0x' + hex.slice(0, 12)))).toISOString()), rand_a: hex.slice(13, 16), rand_b: hex.slice(16) },
      v8: { custom_a: hex.slice(0, 12), custom_b: hex.slice(13, 16), custom_c: hex.slice(16), says: 'custom bits: here the handle, the program and the tail' },
    },
    core: { channel: channelOf(dashedOf(hex)), says: 'the channel reads the handle, the program and the tail: the same under every schema' },
    schemasRead: UUID_SCHEMAS.length + 2,
  }
}

/** A UUID no docket holds, answered as a block anyway: the page computed from the id alone (seal, channel, reflection),
 *  nothing written, so every read of a block answers and the missing component is filled in real time; a client that
 *  seeds reads `computed` and never stores it (there is no content to address). */
/** Queneau's combinatorics as the one primitive of every combination space: positions with their numbers of choices (the radices); the count is
 *  their product, the n-th composition its mixed-radix digits, and a composition's index the number its digits make — every composition computed
 *  from its address and back, none stored (textbook_mixed_radix, textbook_queneau_compositions). BigInt, so no space is too large to count. */
export const compositionsOf = (radices: readonly number[]): bigint => radices.reduce((n, r) => n * BigInt(r), 1n)
export const compositionOf = (radices: readonly number[], index: bigint): number[] => { const digits: number[] = new Array(radices.length); let q = index; for (let i = radices.length - 1; i >= 0; i--) { const r = BigInt(radices[i]!); digits[i] = Number(q % r); q /= r } return digits }
export const compositionIndexOf = (radices: readonly number[], digits: readonly number[]): bigint => digits.reduce((n, d, i) => n * BigInt(radices[i]!) + BigInt(d), 0n)

/** A rosetta: one combination space read through more than one ordering of its axes — the same compositions, the same count, a different index, so a
 *  grid of 6×7 and its transpose 7×6 are the one scale of forty-two read two ways (textbook_mixed_radix). A permutation of the axes keeps the product,
 *  so compositionsOf is the same both ways; `to` carries an index of the one ordering to the index of the same cell in the other and `from` carries it
 *  back, a bijection, so a walk of 6×7 and 7×6 covers the whole scale and stores none. The default order is the reverse — the transpose. */
export const rosettaOf = (radices: readonly number[], order: readonly number[] = radices.map((_, i) => radices.length - 1 - i)) => {
  const permuted = order.map((k) => radices[k]!)
  const to = (index: bigint) => { const d = compositionOf(radices, index); return compositionIndexOf(permuted, order.map((k) => d[k]!)) }
  const from = (index: bigint) => { const d = compositionOf(permuted, index), back = new Array<number>(radices.length); order.forEach((k, i) => (back[k] = d[i]!)); return compositionIndexOf(radices, back) }
  return { radices, order, permuted, scale: compositionsOf(radices), to, from }
}

/** Harmonic options by default: a schema's enum properties are a superposition — every combination of their values at once, mixed radices whose
 *  product is the count — and the referrer measures it: the referrer's address read as a 128-bit integer (or the a432 key, 432, when no one
 *  refers), reduced modulo the count, names one combination, decoded one value per enum; the remainder is always below the count, so the default is
 *  always a combination of the schema (textbook_harmonic_default). The schema keeps every value; `default` marks the measured one. */
export const harmonicDefaultsOf = (schema: { properties?: Record<string, { enum?: readonly unknown[]; default?: unknown }> }, referrer?: string, allowed: (prop: string, value: unknown) => boolean = () => true) => {
  // a role sees the values it may choose: the superposition narrowed to them, an enum with none left withheld
  const options = Object.fromEntries(Object.entries(schema.properties ?? {}).filter(([, p]) => Array.isArray(p.enum) && p.enum.length > 0).map(([k, p]) => [k, p.enum!.filter((v) => allowed(k, v))]))
  const withheld = Object.entries(options).filter(([, v]) => v.length === 0).map(([k]) => k)
  const props = Object.entries(schema.properties ?? {}).filter(([k, p]) => Array.isArray(p.enum) && p.enum.length > 0 && p.default === undefined && options[k]!.length > 0).map(([k, p]) => [k, { ...p, enum: options[k]! }] as const)
  const radices = props.map(([, p]) => p.enum!.length)
  const count = compositionsOf(radices)
  const hex = (referrer ?? '').replace(/-/g, '')
  const seed = /^[0-9a-f]{32}$/i.test(hex) ? BigInt('0x' + hex) : 432n
  const index = count > 0n ? seed % count : 0n
  const digits = compositionOf(radices, index)
  return { count, index, from: /^[0-9a-f]{32}$/i.test(hex) ? 'referrer' as const : 'a432' as const, defaults: Object.fromEntries(props.map(([k, p], i) => [k, p.enum![digits[i]!]])), options, withheld }
}

/** The hooks Payload 3.90.1 declares (its types, read again by the test), paired by phase; one witness each puts the address it sees and the referrer's collapse on the context */
const NODE = 'beforeValidate beforeChange afterChange afterRead', GLOBAL = 'beforeOperation beforeRead ' + NODE
const DECLARED = { collection: GLOBAL + ' beforeDelete afterDelete afterOperation afterError beforeLogin afterLogin afterLogout me afterMe refresh afterRefresh afterForgotPassword', global: GLOBAL, field: NODE + ' beforeDuplicate', node: NODE }
type Where = keyof typeof DECLARED
const sideOf = (h: string) => { const m = /^(before|after)(\w)(\w*)$/.exec(h); return { side: (m?.[1] ?? 'before') as 'before' | 'after', phase: m ? m[2]!.toLowerCase() + m[3] : h } }
const pairsOf = (w: Where) => { const by: Record<string, { before?: string; after?: string }> = {}; for (const h of DECLARED[w].split(' ')) { const s = sideOf(h); (by[s.phase] ??= {})[s.side] = h } return Object.entries(by).map(([phase, s]) => ({ phase, ...s, paired: !!(s.before && s.after) })) }
const collapseOf = memoOf((w: Where, ref: string) => Number(harmonicDefaultsOf({ properties: { phase: { enum: pairsOf(w).filter((p) => p.paired).map((p) => p.phase) }, side: { enum: ['before', 'after'] } } }, ref).index))
const made = new Map<string, (a: any) => unknown>()
const witnessOf = (w: Where, h: string) => made.get(w + h) ?? made.set(w + h, (a: any) => {
  const c = a.context ?? a.req?.context ?? a.args?.req?.context, { side, phase } = sideOf(h), ref = a.req?.headers?.get?.('referer') ?? c?.referrer, k = w === 'field' ? 'value' : ['node', 'doc', 'data', 'result', 'response', 'user', 'token', 'id'].find((x) => a[x] !== undefined)
  if (c) try { const at = ((c.qpuWitness ??= {})[[w, a.path?.join('.') ?? a.node?.fields?.id ?? a.node?.type ?? a.collection?.slug ?? a.global?.slug, phase].join(':')] ??= {}); at[side] = uuidOf(canonicalTextOf(k ? a[k] : a.args ? [a.args.data, a.args.id, a.args.where] : null)); if (w === 'node') at.block = a.node?.type ?? a.node?.fields?.blockType ?? at.block; if (at.before && at.after) { at.changed = at.before !== at.after; at.teleport = at.before === at.after } at.collapse = collapseOf(w, ref ? uuidOf(String(ref)) : ''); c.qpuWitnessed = (c.qpuWitnessed ?? 0) + 1 } catch (e) { (c.qpuWitnessErrors ??= []).push(String(e)) }
  return w === 'node' ? a.node : undefined
}).get(w + h)!
const into = (have: unknown[] = [], w: Where, h: string) => { const f = witnessOf(w, h); return have.includes(f) ? have : sideOf(h).side === 'before' ? [f, ...have] : [...have, f] }
const boundOf = (hooks: Record<string, unknown[]> = {}, w: Where) => ({ ...hooks, ...Object.fromEntries(DECLARED[w].split(' ').map((h) => [h, into(hooks[h], w, h)])) })
const nodesOf = (adapter: any) => { const f = adapter?.editorConfig?.features; for (const [h, m] of Object.entries((f?.nodeHooks ?? {}) as Record<string, Map<string, unknown[]>>)) for (const t of f.getSubFields?.keys() ?? []) m.set(t, into(m.get(t), 'node', h)); return adapter }
const editorOf = (e: any) => (typeof e !== 'function' ? nodesOf(e) : e.qpuWitness ? e : Object.assign(async (a: unknown) => nodesOf(await e(a)), { qpuWitness: true }))
/** qpuHooksOf: the witnesses bound to any config walked whole, every rich text field and Lexical block node (textbook_witness_pair) */
export const qpuHooksOf = (config: Record<string, any>) => {
  const n = { richText: 0, blocks: 0 }, box = (b: any): any => (typeof b === 'string' ? b : (n.blocks++, { ...b, fields: fields(b.fields) }))
  const fields = (fs: any[] = []): any[] => fs.map((f) => (f.type === 'richText' ? (n.richText++, { ...f, hooks: boundOf(f.hooks, 'field'), ...(f.editor ? { editor: editorOf(f.editor) } : {}) }) : f.tabs ? { ...f, tabs: f.tabs.map((t: any) => ({ ...t, fields: fields(t.fields) })) } : f.blocks ? { ...f, blocks: f.blocks.map(box) } : f.fields ? { ...f, fields: fields(f.fields) } : f))
  const at = (xs: any[] | undefined, w: Where) => xs?.map((x) => ({ ...x, hooks: boundOf(x.hooks, w), fields: fields(x.fields) }))
  return { config: { ...config, collections: at(config.collections, 'collection'), globals: at(config.globals, 'global'), blocks: config.blocks?.map(box), ...(config.editor ? { editor: editorOf(config.editor) } : {}) } as any, found: n, pairs: Object.fromEntries((Object.keys(DECLARED) as Where[]).map((w) => [w, pairsOf(w)])) }
}
