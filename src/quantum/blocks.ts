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
    vortex: (() => { const seed = one48 === 0 ? 0 : 1 + ((one48 - 1) % 9); return { seed, reflection: seed === 0 ? 0 : 10 - seed, fixed: seed === 5, polarity: seed === 0 ? 'zero' : seed < 5 ? 'minus' : seed > 5 ? 'plus' : 'fixed' } })(),
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
  return text.length <= 200 ? text : text.slice(0, 197) + '…'
}

export const blockOf = (tool: string, args: Record<string, unknown>, structured: unknown, html: string, description: string): Block => {
  const query = Object.keys(args).length ? '?' + new URLSearchParams(Object.entries(args).map(([k, v]) => [k, typeof v === 'string' ? v : JSON.stringify(v)])).toString() : ''
  const id = uuidOf(`${tool}${JSON.stringify(args)}`)
  const wrapped = wrapOf(id, html + attributionHtml())
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
