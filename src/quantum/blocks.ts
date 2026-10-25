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
export const uuidOf = (text: string): string => {
  const high = foldOf(text)
  const low = foldOf(`${text}\u0000shape`)
  const variant = ((parseInt(low.slice(0, 1), 16) % 4) + 8).toString(16)
  const digits = `${high.slice(0, 12)}${high.slice(15, 16)}${high.slice(12, 15)}${variant}${low.slice(1, 4)}${low.slice(4, 16)}`
  const rest = `${digits.slice(0, 12)}${digits.slice(13)}`
  const version = (1 + Number(bigPowMod(BigInt(`0x${rest}`), 7n, 91n) % 8n)).toString(16)
  return `${digits.slice(0, 8)}-${digits.slice(8, 12)}-${version}${digits.slice(13, 16)}-${digits.slice(16, 20)}-${digits.slice(20, 32)}`
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
  return { uuid, valid: decided.every((c) => c.passed), checks, decided: decided.length, cost: 'one modular power for the seal, one fold for the content, two string equalities for the neighbours', bound: 'the fold is tamper-evident and separates content; it is not collision-resistant against an adversary who searches for one. The docket and the receipts carry a SHA-256 beside it for that case.' }
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
