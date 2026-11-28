// A receipt as schema.org JSON-LD. A receipt seals one body of computed metadata: its text is its kind and the canonical text of the
// body, its UUID the address of that text, its handle the first eight hex digits. It is a Dataset whose variables are the body, key by
// key; it is based on the Lean formulas the body names in its theorem fields, each with the TeX Lean wrote and what it costs to carry
// as the tree's own accounts count it (accountBytes, measureContext, getBill); and it carries the device that minted it. A combination
// is a receipt whose parts are other receipts, held by their UUIDs under the RFC 6962 root over them, so a merge is decided from the
// handles and UUIDs of its parts and nothing is computed again. Every receipt carries the licence as the licence table holds it and the
// donation link, which is also where the author is reached. No sentence is written here: every string is a key or a value.
import { THEOREMS } from '../../../../../../../../3/f/0/e/7/a/6/f/index.ts'
import { blockJsonLd } from '../../../../../../../../1/9/a/6/8/a/6/f/index.ts'
import { LICENSE } from '../../../../../../../../a/f/3/d/e/a/5/f/index.ts'
import { accountBytes, measureContext } from '../../../../../../../../4/5/8/2/8/f/3/f/index.ts'
import { getBill } from '../../../../../../../../5/b/3/0/7/9/e/2/index.ts'
import { canonicalText, handleOf } from '../../../../../../../../2/7/1/a/7/6/4/9/index.ts'

export type Json = Record<string, unknown>
const byKey = new Map(THEOREMS.map((t) => [t.key, t]))
const NAMING: ReadonlySet<string> = new Set(['theorem', 'theorems', 'relatedTheorems'])
const scalar = (v: unknown) => v === null || typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean'

/** The text a receipt seals: its kind and the canonical text of its body. */
export const receiptText = (kind: string, body: unknown) => `${kind};${canonicalText(body)}`

/** The theorems a body names in its theorem fields: each once, in the order met, and only those the kernel holds. */
export const receiptTheorems = (body: unknown): string[] => {
  const found = new Set<string>()
  const walk = (v: unknown, naming: boolean): void => {
    if (typeof v === 'string') { if (naming && byKey.has(v)) found.add(v) }
    else if (Array.isArray(v)) for (const x of v) walk(x, naming)
    else if (v !== null && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, NAMING.has(k))
  }
  walk(body, false)
  return [...found]
}

/** What a text costs to carry: its bytes and bits and the coin whose handle is the byte count (textbook_chain_bits), the tokens at four
 *  bytes each, and the Landauer joules of the bits (textbook_billing_complete). */
export const receiptCost = (text: string) => {
  const counted = accountBytes([text]), context = measureContext(counted, counted), bill = getBill({ tokens: context.tokens, bits: counted.bits })
  return { bytes: counted.bytes, bits: counted.bits, tokens: context.tokens, joules: bill.joules, coin: counted.uuid }
}

const property = (name: string, value: unknown) => ({ '@type': 'PropertyValue', name, value })
const quantity = (name: string, value: number, unitCode?: string) => ({ '@type': 'QuantitativeValue', name, value, ...(unitCode ? { unitCode } : { unitText: name }) })
/** A cost as schema.org quantities, in UN/CEFACT units where one exists: the byte AD, the bit A99, the joule JOU. */
const quantities = (c: ReturnType<typeof receiptCost>) => [quantity('bytes', c.bytes, 'AD'), quantity('bits', c.bits, 'A99'), quantity('tokens', c.tokens), quantity('joules', c.joules, 'JOU')]

/** A body as schema.org property values, key by key: a scalar or a list of scalars is the value, an object its own property values, and
 *  a list of objects one property value a row, named by its place. An object with no key stays an object, so it is read back as one. */
export const propertyValues = (body: Json): Json[] => Object.entries(body).map(([name, v]) => property(name, valueOf(v)))
const valueOf = (v: unknown): unknown => (scalar(v) ? v : typeof v === 'bigint' ? String(v) : Array.isArray(v) ? (v.every(scalar) ? v : v.map((row, i) => property(String(i + 1), valueOf(row)))) : Object.keys(v as Json).length ? propertyValues(v as Json) : {})
type Property = { name: string; value: unknown }
/** Whether a value is a list of property values, and whether such a list is rows named by their place. */
export const isProperties = (v: unknown): v is Property[] => Array.isArray(v) && v.length > 0 && v.every((x) => x !== null && typeof x === 'object' && (x as Json)['@type'] === 'PropertyValue')
export const isRows = (v: readonly Property[]) => v.every((p, i) => p.name === String(i + 1))
/** The body its property values carry, read back: what propertyValues was given. */
export const receiptBody = (v: unknown): unknown => (isProperties(v) ? (isRows(v) ? v.map((p) => receiptBody(p.value)) : Object.fromEntries(v.map((p) => [p.name, receiptBody(p.value)]))) : v)

/** A formula a receipt is based on: the theorem by name at its Lean source, the TeX Lean wrote for it, and its cost. */
export const formulaJsonLd = (key: string, source: (module: string) => string) => {
  const t = byKey.get(key)!, cost = receiptCost(t.tex)
  return { '@type': 'CreativeWork', name: key, url: source(t.module), encodingFormat: 'application/x-tex', text: t.tex, identifier: cost.coin, size: quantities(cost) }
}

type Sealed = { kind: string; body: Json; address: string; sha256: string }
type Place = { site: string; version: string; source: (module: string) => string }
const receiptUrl = (site: string, address: string) => `${site}/receipts/${handleOf(address)}`

/** The device that minted a receipt, as a schema.org Product: every reading a property value. */
export const deviceJsonLd = (p: Sealed & { site: string }) => ({ '@type': 'Product', '@id': receiptUrl(p.site, p.address), name: p.kind, identifier: [property('uuid', p.address), property('handle', handleOf(p.address)), property('sha256', p.sha256)], additionalProperty: propertyValues(p.body) })

/** A sealed body as a schema.org Dataset on the tree's own block: identified by its UUID, handle, SHA-256 and coin, its variables the
 *  body, based on the formulas the body names, sized by what it costs to carry; a combination has its parts. */
export const receiptJsonLd = (p: Sealed & Place & { technique: string; parts?: readonly { kind: string; address: string }[] }) => {
  const cost = receiptCost(receiptText(p.kind, p.body)), url = receiptUrl(p.site, p.address)
  const { dateModified: _, ...block } = blockJsonLd({ tool: p.kind, id: p.address, description: `${p.kind}: ${Object.keys(p.body).join(', ')}`, url })
  // the licence in the licence table's own fields, and the donation link, where the author is also reached
  const creator = { ...(block.author as Json), contactPoint: { '@type': 'ContactPoint', contactType: 'author', url: LICENSE.donation } }
  return {
    ...block, '@type': 'Dataset', alternateName: p.kind, url, version: p.version, measurementTechnique: p.technique,
    license: LICENSE.deed, acquireLicensePage: LICENSE.url, copyrightNotice: LICENSE.copyright, creditText: LICENSE.attribution, conditionsOfAccess: LICENSE.terms,
    creator, potentialAction: { '@type': 'DonateAction', name: 'donation', target: LICENSE.donation, recipient: creator },
    identifier: [property('uuid', p.address), property('handle', handleOf(p.address)), property('sha256', p.sha256), property('coin', cost.coin)],
    distribution: { '@type': 'DataDownload', encodingFormat: 'text/plain', contentUrl: `${url}.txt`, contentSize: `${cost.bytes} B`, sha256: p.sha256 },
    size: quantities(cost),
    variableMeasured: propertyValues(p.body),
    isBasedOn: receiptTheorems(p.body).map((k) => formulaJsonLd(k, p.source)),
    ...(p.parts ? { hasPart: p.parts.map((x) => ({ '@type': 'Dataset', '@id': receiptUrl(p.site, x.address), name: x.kind, identifier: x.address })) } : {}),
  }
}
