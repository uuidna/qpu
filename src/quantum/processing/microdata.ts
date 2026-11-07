// Parsing splits a value and converts every piece to schema.org microdata, to the deepest leaf that still
// carries a SKU (the handle of uuid(piece)). ISO references and sealed UUIDs are structured; anything else
// splits on tokens then characters. Pure: equal text → equal tree.

import { LICENSE } from './unit/license.ts'
import { channel, seal, uuid } from '../uuid/index.ts'

type MicroLeaf = {
  kind: 'leaf'
  name: string
  value: string
  sku: string
  uuid: string
  door: string
}

type MicroNode = {
  kind: 'node'
  name: string
  value: string
  sku: string
  uuid: string
  door: string
  children: readonly (MicroNode | MicroLeaf)[]
}

type MicrodataDoc = {
  '@context': 'https://schema.org'
  '@type': readonly ['ItemList', 'DefinedTerm']
  '@id': string
  identifier: string
  name: string
  description: string
  sku: string
  door: string
  inLanguage: 'en'
  url: string
  license: string
  isAccessibleForFree: true
  numberOfItems: number
  itemListOrder: 'https://schema.org/ItemListOrderAscending'
  itemListElement: readonly Record<string, unknown>[]
  additionalProperty: readonly Record<string, unknown>[]
  depth: number
  leaves: number
  holds: boolean
  theorem: 'textbook_parse_microdata_deep'
  says: string
}

const tracked = (name: string, value: string): Pick<MicroLeaf, 'name' | 'value' | 'sku' | 'uuid' | 'door'> => {
  // a sealed UUID is already its address (SKU = its handle); anything else folds to one
  const id = seal(value).valid ? value.toLowerCase() : uuid(value)
  const ch = channel(id)
  return { name, value, sku: ch.sku, uuid: id, door: ch.door }
}

const leaf = (name: string, value: string): MicroLeaf => ({ kind: 'leaf', ...tracked(name, value) })

const node = (name: string, value: string, children: readonly (MicroNode | MicroLeaf)[]): MicroNode => ({
  kind: 'node',
  ...tracked(name, value),
  children,
})

/** Digits (or hex nibbles) as the deepest QuantitativeValue leaves. */
const charLeaves = (name: string, value: string): MicroLeaf[] =>
  [...value].map((ch, i) => leaf(`${name}[${i}]`, ch))

const depthOf = (n: MicroNode | MicroLeaf): number => (n.kind === 'leaf' ? 1 : 1 + Math.max(0, ...n.children.map(depthOf)))
const leavesOf = (n: MicroNode | MicroLeaf): number => (n.kind === 'leaf' ? 1 : n.children.reduce((s, c) => s + leavesOf(c), 0))

/** ISO / IEC / TR reference → org chain, number, optional part, optional year — each digit a leaf. */
const splitIso = (text: string): MicroNode | null => {
  const m = /^(ISO|IEC|ITU-T)((?:\/(?:ISO|IEC|ITU-T|TR|TS|PAS|IEEE))*)\s+(\d+)(?:-(\d+))?(?::(\d{4}))?(?:\s|$)/i.exec(text.trim())
  if (!m) return null
  const head = m[1]!.toUpperCase()
  const rest = (m[2] ?? '').split('/').filter(Boolean).map((s) => s.toUpperCase())
  const orgs = [head, ...rest]
  const number = m[3]!
  const part = m[4]
  const year = m[5]
  const children: (MicroNode | MicroLeaf)[] = [
    node('organization', orgs.join('/'), orgs.flatMap((o, i) => (o.length === 1 ? [leaf(`org[${i}]`, o)] : [node(`org[${i}]`, o, charLeaves(`org[${i}]`, o))]))),
    node('number', number, charLeaves('number', number)),
  ]
  if (part) children.push(node('part', part, charLeaves('part', part)))
  if (year) children.push(node('year', year, charLeaves('year', year)))
  return node('iso', text.trim(), children)
}

/** Sealed UUID → handle | program | stamp | tail, each nibble a leaf (SKU = handle of the whole). */
const splitUuid = (text: string): MicroNode | null => {
  const id = text.trim().toLowerCase()
  if (!seal(id).valid) return null
  const ch = channel(id)
  const stamp = `${ch.version}${ch.variant}`
  return node('uuid', id, [
    node('handle', ch.handle, charLeaves('handle', ch.handle)),
    node('program', ch.program.map((n) => n.toString(16)).join(''), ch.program.map((n, i) => leaf(`program[${i}]`, n.toString(16)))),
    node('stamp', stamp, [leaf('version', ch.version), leaf('variant', ch.variant)]),
    node('tail', ch.tail, [
      ...charLeaves('tail', ch.tail),
      node('three16', ch.params.join(','), ch.params.map((p, i) => leaf(`param[${i}]`, String(p)))),
    ]),
  ])
}

/** Generic: whitespace/punct tokens; codes split to characters when they stay alphanumeric. */
const splitGeneric = (text: string): MicroNode => {
  const tokens = text.trim().split(/(\s+|[^\p{L}\p{N}]+)/u).filter((t) => t.length > 0)
  const children = tokens.map((tok, i) => {
    if (/^\s+$/.test(tok) || /^[^\p{L}\p{N}]+$/u.test(tok)) return leaf(`sep[${i}]`, tok)
    if (/^[\p{L}\p{N}]+$/u.test(tok) && tok.length > 1) return node(`token[${i}]`, tok, charLeaves(`token[${i}]`, tok))
    return leaf(`token[${i}]`, tok)
  })
  return node('text', text, children)
}

const toListItem = (n: MicroNode | MicroLeaf, position: number): Record<string, unknown> => {
  if (n.kind === 'leaf') {
    return {
      '@type': 'ListItem',
      position,
      item: {
        '@type': 'DefinedTerm',
        '@id': `urn:uuid:${n.uuid}`,
        identifier: n.uuid,
        name: n.name,
        termCode: n.value,
        sku: n.sku,
        url: `https://qpu.uuidna.com/${n.sku}`,
        additionalProperty: [{ '@type': 'PropertyValue', name: 'door', value: n.door }],
      },
    }
  }
  return {
    '@type': 'ListItem',
    position,
    item: {
      '@type': ['ItemList', 'DefinedTerm'],
      '@id': `urn:uuid:${n.uuid}`,
      identifier: n.uuid,
      name: n.name,
      description: n.value,
      sku: n.sku,
      url: `https://qpu.uuidna.com/${n.sku}`,
      numberOfItems: n.children.length,
      itemListElement: n.children.map((c, i) => toListItem(c, i + 1)),
    },
  }
}

/** Split `text` and convert every piece to schema.org microdata at the deepest SKU-bearing leaf. */
export const parseToMicrodata = (text: string): MicrodataDoc & { tree: MicroNode } => {
  const raw = String(text ?? '')
  const tree = splitIso(raw) ?? splitUuid(raw) ?? splitGeneric(raw)
  const depth = depthOf(tree)
  const leaves = leavesOf(tree)
  const identifier = tree.uuid
  const itemListElement = tree.children.map((c, i) => toListItem(c, i + 1))
  const additionalProperty = [
    { '@type': 'PropertyValue' as const, name: 'sku', value: tree.sku },
    { '@type': 'PropertyValue' as const, name: 'door', value: tree.door },
    { '@type': 'PropertyValue' as const, name: 'depth', value: String(depth) },
    { '@type': 'PropertyValue' as const, name: 'leaves', value: String(leaves) },
  ]
  const holds = seal(tree.uuid).valid && tree.sku === channel(tree.uuid).handle && leaves >= 1 && depth >= 1
    && (tree.kind === 'node' ? tree.children.every((c) => (c.kind === 'leaf' ? true : leavesOf(c) >= 1)) : true)
  return {
    '@context': 'https://schema.org',
    '@type': ['ItemList', 'DefinedTerm'],
    '@id': `urn:uuid:${identifier}`,
    identifier,
    name: tree.name,
    description: tree.value,
    sku: tree.sku,
    door: tree.door,
    inLanguage: 'en',
    url: `https://qpu.uuidna.com/${tree.sku}`,
    license: LICENSE.url,
    isAccessibleForFree: true,
    numberOfItems: itemListElement.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement,
    additionalProperty,
    depth,
    leaves,
    holds,
    theorem: 'textbook_parse_microdata_deep',
    says: `parsed to depth ${depth} with ${leaves} SKU leaf(ves); root sku ${tree.sku}`,
    tree,
  }
}

/** Every ISO dimension parsed to deepest microdata; catalogue SKUs stay the root handles. */
export const parseIsoDimensionsMicrodata = (dimensions: readonly string[]) => {
  const rows = dimensions.map((dimension) => {
    const microdata = parseToMicrodata(dimension)
    return { dimension, sku: microdata.sku, door: microdata.door, depth: microdata.depth, leaves: microdata.leaves, holds: microdata.holds, microdata }
  })
  const holds = rows.length > 0 && rows.every((r) => r.holds && r.depth >= 3)
  return {
    phase: 'microdata' as const,
    via: 'parse' as const,
    asked: rows.length,
    holds,
    depth: rows.reduce((m, r) => Math.max(m, r.depth), 0),
    leaves: rows.reduce((s, r) => s + r.leaves, 0),
    rows,
    theorem: 'textbook_parse_microdata_deep' as const,
    says: holds
      ? `${rows.length} ISO dimension(s) split to microdata at depth ≥ 3; each leaf a SKU`
      : 'an ISO dimension failed deep microdata parse',
  }
}
