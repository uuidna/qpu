// Every result as a presentation block any host can render: Open Graph metadata for the link preview, and a shadcn
// registry item (https://ui.shadcn.com/schema/registry-item.json) carrying the same HTML as a block, so an MCP host, a
// shadcn-based app, or any adaptor shows the same thing. Pure functions; the id is a deterministic FNV-1a hash of the
// call, so equal calls give equal blocks.

export type OpenGraph = { 'og:title': string; 'og:description': string; 'og:type': 'website'; 'og:url': string; 'og:site_name': string; 'article:author': string; license: string }
export type RegistryItem = { $schema: 'https://ui.shadcn.com/schema/registry-item.json'; name: string; type: 'registry:block'; title: string; description: string; registryDependencies: string[]; author: string; license: string; files: { path: string; type: 'registry:block'; content: string }[]; meta: { tool: string; arguments: Record<string, unknown>; id: string } }
import { KEY, accentOfUuid, cmykOfUuid, hueOf, wrapOf } from './theme.js'
import { LICENSE, attributionHtml } from './license.js'

export type Block = { id: string; html: string; theme: { key: number; hue: number; cmyk: { c: number; m: number; y: number; k: number }; accent: string }; openGraph: OpenGraph; shadcn: RegistryItem }

/** FNV-1a 64 fold of a string to 16 lowercase hex digits, the fold the unit builds every receipt and address on. */
export const foldOf = (text: string): string => {
  let h = 0xcbf29ce484222325n
  for (let i = 0; i < text.length; i++) { h ^= BigInt(text.charCodeAt(i)); h = (h * 0x100000001b3n) & 0xffffffffffffffffn }
  return h.toString(16).padStart(16, '0')
}
const bigPowMod = (base: bigint, exp: bigint, modulus: bigint): bigint => { if (modulus <= 1n) return 0n; let x = 1n % modulus, b = ((base % modulus) + modulus) % modulus, e = exp; while (e > 0n) { if (e % 2n === 1n) x = (x * b) % modulus; b = (b * b) % modulus; e /= 2n } return x }
/** The unit's content UUID, ported one for one from uuidna's shapeUuidOf: two folds, of the text and of the text marked,
 *  laid out 12+1+3 | variant | 3+12 as 8-4-4-4-12, the variant nibble from the low fold (8..b), and the version nibble
 *  DECIDED by the content: 1 + (rest^rays mod C(faces, coins)) mod mintOf(n) = 1 + (rest^7 mod 91) mod 8, so a tampered
 *  middle wears a version its content does not. The same text gives the same UUID here and at uuidna.com. */
/** 32 hex digits stamped and grouped 8-4-4-4-12: the version nibble (position 12) is DECIDED by the other 31. */
export const stampOf = (digits: string): string => {
  const rest = `${digits.slice(0, 12)}${digits.slice(13)}`
  const version = (1 + Number(bigPowMod(BigInt(`0x${rest}`), 7n, 91n) % 8n)).toString(16)
  return `${digits.slice(0, 8)}-${digits.slice(8, 12)}-${version}${digits.slice(13, 16)}-${digits.slice(16, 20)}-${digits.slice(20, 32)}`
}
export const uuidOf = (text: string): string => {
  const high = foldOf(text)
  const low = foldOf(`${text}\u0000shape`)
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
/** A program compiled against the tools: each nibble picks a tool, enum parameters are chosen by the nibble, integer parameters
 *  come from the tail's three 16-bit readings clamped into the schema's bounds. The first step is `next`. */
export type Step = { nibble: number; tool: string; arguments: Record<string, unknown> }
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
  const rest = `${digits.slice(0, 12)}${digits.slice(13)}`
  const expected = (1 + Number(bigPowMod(BigInt(`0x${rest}`), 7n, 91n) % 8n)).toString(16)
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
    // the unit's ℤ/9 convention (run_sequence): the digital root is the seed, its dz-mirror 10 − d the reflection, 5 the fixed point
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
  const program = [...middle].map((c, i) => ({ nibble: c, kept: i === 4 || i === 8, value: parseInt(c, 16) })).filter((n) => !n.kept).map((n) => n.value)
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
  const handle = [...ch.handle].map((c) => (15 - parseInt(c, 16)).toString(16)).join('')
  const program = ch.program.map((n) => 15 - n)
  const tail = [...ch.tail].map((c) => (15 - parseInt(c, 16)).toString(16)).join('')
  const mirror = uuidFromParts(handle, program, tail)
  return { of: uuid, mirror, handle, program, tail, readings: tailReadingsOf(tail), fixed: ch.program.filter((n) => n === 15 - n).length, note: 'σ_15 on nibbles has no fixed point; the pair is two states held at once' }
}

/** Canonical JSON text (sorted keys), the form the unit addresses a JSON value by. */
export const canonicalTextOf = (value: unknown): string =>
  Array.isArray(value) ? `[${value.map(canonicalTextOf).join(',')}]`
    : value !== null && typeof value === 'object' ? `{${Object.keys(value as object).sort().map((k) => `${JSON.stringify(k)}:${canonicalTextOf((value as Record<string, unknown>)[k])}`).join(',')}}`
    : typeof value === 'number' && !Number.isFinite(value) ? `"${value}"` : JSON.stringify(value) ?? 'null'

const describe = (structured: unknown): string => {
  const text = JSON.stringify(structured) ?? ''
  return text
}

const escapeOf = (t: string): string => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export const blockOf = (tool: string, args: Record<string, unknown>, structured: unknown, html: string, description: string): Block => {
  const query = Object.keys(args).length ? '?' + new URLSearchParams(Object.entries(args).map(([k, v]) => [k, typeof v === 'string' ? v : JSON.stringify(v)])).toString() : ''
  const id = uuidOf(`${tool}${JSON.stringify(args)}`)
  // A heading to land on: what a screen reader announces first, and what the audit's accessibility check measures.
  const heading = `<div role="heading" aria-level="2" style="font-size: var(--font-size-footnote); color: var(--text-muted); margin-bottom: var(--gap-sm, 6px);">${tool} · ${escapeOf(description)}</div>`
  const wrapped = wrapOf(id, heading + html + attributionHtml())
  return {
    id,
    html: wrapped,
    theme: { key: KEY, hue: hueOf(KEY), cmyk: cmykOfUuid(id), accent: accentOfUuid(id) },
    openGraph: { 'og:title': `${tool} · @uuidna/qpu`, 'og:description': describe(structured), 'og:type': 'website', 'og:url': `qpu://tools/${tool}${query}`, 'og:site_name': '@uuidna/qpu', 'article:author': LICENSE.author, license: `${LICENSE.spdx} ${LICENSE.url}` },
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
/** Every bit styled from the UUID stream itself, nothing loaded: a block's address decides its hue (the handle), its saturation and lightness
 *  (the program nibbles), its radius and gap (the tail) — pure, deterministic, inline CSS variables; no font, no stylesheet, no fetch. The
 *  shadcn items below (a style lib, a card, a badge, a table, the stream, a dashboard block) compose with these variables. */
export const styleOf = (uuid: string) => {
  const ch = channelOf(uuid)
  const hue = parseInt(ch.handle.slice(0, 3), 16) % 360
  const sum = ch.program.reduce((n, d) => n + d, 0)
  const sat = 40 + (sum % 40), light = 36 + (ch.program[0]! % 20)
  const radius = 2 + (parseInt(ch.tail.slice(0, 1), 16) % 14), gap = 4 + (parseInt(ch.tail.slice(1, 2), 16) % 12)
  const vars = { '--qpu-hue': String(hue), '--qpu-accent': `hsl(${hue} ${sat}% ${light}%)`, '--qpu-surface': `hsl(${hue} ${Math.round(sat / 4)}% 97%)`, '--qpu-ink': `hsl(${hue} ${Math.round(sat / 3)}% 14%)`, '--qpu-radius': `${radius}px`, '--qpu-gap': `${gap}px` }
  return { uuid, hue, sat, light, radius, gap, vars, css: Object.entries(vars).map(([k, v]) => `${k}: ${v}`).join('; '), says: 'computed from the address: the handle gives the hue, the program the saturation and lightness, the tail the radius and the gap; nothing loaded' }
}
/** Any hex is presentable as a shadcn combination: each nibble picks one of the eight registry items (the two hosts and the six styled ones)
 *  and one of two variants (solid, outline) — sixteen choices, a nibble (textbook_hex_presentations) — so a UUID, a hash or an address is a
 *  layout of its own nibbles, every part styled from the hex itself; nothing loaded. */
export const PRESENTABLE_ITEMS = ['qpu-app', 'qpu-block', 'qpu-style', 'qpu-card', 'qpu-badge', 'qpu-table', 'qpu-stream', 'qpu-dashboard'] as const
export const presentationOf = (hex: string) => {
  const clean = hex.toLowerCase().replace(/[^0-9a-f]/g, '')
  if (!clean) throw new Error('a hex string presents itself: give one')
  const nibbles = [...clean].map((c) => parseInt(c, 16))
  const uuid = /^[0-9a-f]{32}$/.test(clean) ? `${clean.slice(0, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}-${clean.slice(16, 20)}-${clean.slice(20)}` : uuidOf(clean)
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
    core: { channel: channelOf(`${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`), says: 'the channel reads the handle, the program and the tail: the same under every schema' },
    schemasRead: UUID_SCHEMAS.length + 2,
  }
}

/** A UUID no docket holds, answered as a block anyway: the page computed from the id alone (seal, channel, reflection),
 *  nothing written, so every read of a block answers and the missing component is filled in real time; a client that
 *  seeds reads `computed` and never stores it (there is no content to address). */
export const computedEntryOf = (id: string) => ({ id, kind: 'uuid', from: 'computed', computed: true, body: verifyOf(id), says: 'no entry at this address: the page of the UUID from the id alone, nothing written (no content to address)' })
