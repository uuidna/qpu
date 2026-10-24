import type { CollectionConfig } from 'payload'
import { hexFamiliesOf, qpuCiteOf } from '@uuidna/qpu'
import { CombinatoricsFormulas } from '../families/combinatorics/index.js'
import { countsOf } from '../families/combinatorics/counts.js'
import { HOME } from '../fields/link'
import { adminOrAbove } from '../access'
import { CrossDomain } from '../blocks/CrossDomain/index.js'
import { Family } from '../blocks/Family/index.js'
import { HexProgram } from '../blocks/HexProgram/index.js'

// the site is the unit's citation: its origin and its name are what the citation serves, not a string here
const cite = qpuCiteOf() as unknown as { href: string; website: string }
export const SITE = { origin: cite.href, name: cite.website } as const

type DocLike = { slug?: unknown; title?: unknown; description?: unknown }
const textOf = (x: unknown): string => (typeof x === 'string' ? x : '')

/** The SEO plugin's generators for docs and pages, and the values each is saved with: the page `home` is the site root
 *  and carries the site's name, as does the documentation index; anything else lives at its own slug. */
export const seoTitleOf = (doc: DocLike): string => (textOf(doc.slug) === 'index' || textOf(doc.slug) === HOME ? SITE.name : [textOf(doc.title), SITE.name].filter(Boolean).join(' — '))
export const seoDescriptionOf = (doc: DocLike): string => textOf(doc.description).slice(0, 160)
export const seoURLOf = (doc: DocLike): string => (textOf(doc.slug) === HOME ? SITE.origin : `${SITE.origin}/${textOf(doc.slug)}`)

/** The combinatorics of a doc, computed on read by the field's hook and never stored: the family's formula count with its
 *  programs, compositions and pairs (countsOf), and for each Family block on the page C(formulas, k) at its own k. */
const combinatoricsOf = (doc: { family?: unknown; content?: unknown }) => {
  const formulas = (family: string) => hexFamiliesOf().get(family)?.length ?? 0
  const blocks = Array.isArray(doc.content) ? (doc.content as { blockType?: string; family?: unknown; combine?: unknown }[]) : []
  const choices = blocks.filter((b) => b.blockType === 'familyBlock').map((b) => {
    const family = textOf(b.family)
    const n = formulas(family)
    const k = typeof b.combine === 'number' ? b.combine : 1
    return { family, k, choose: n > 0 && k <= n ? CombinatoricsFormulas.combinations(n, k).value : 0 }
  })
  return { ...countsOf(formulas(textOf(doc.family))), choices }
}

/** The documentation, generated from the inline docs (scripts/generate-docs.mjs) and seeded on init: the public site. */
export const Docs: CollectionConfig = {
  slug: 'docs',
  admin: { useAsTitle: 'title' },
  access: { read: () => true, create: adminOrAbove, update: adminOrAbove, delete: adminOrAbove },
  hooks: {
    // the SEO fields are populated on every save, so no page waits for someone to press "auto-generate"
    beforeChange: [
      ({ data }) => {
        const meta = (data?.meta ?? {}) as { title?: string; description?: string }
        return { ...data, meta: { ...meta, title: meta.title || seoTitleOf(data ?? {}), description: meta.description || seoDescriptionOf(data ?? {}) } }
      },
    ],
  },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'markdown', type: 'code', admin: { language: 'markdown' } },
    { name: 'html', type: 'code', admin: { language: 'html' } },
    { name: 'uuid', type: 'text', index: true },
    // The node's place in the cross graph: its family and cross domain. nestedDocsPlugin adds `parent`/`breadcrumbs`,
    // so a doc is a node in the domain → family → formula tree.
    { name: 'family', type: 'text', index: true },
    // computed on read from the family and the Family blocks on the page: not stored, so it cannot go stale
    { name: 'combinatorics', type: 'json', admin: { readOnly: true }, hooks: { afterRead: [({ data }) => (data ? combinatoricsOf(data) : undefined)] } },
    { name: 'domain', type: 'text', index: true },
    // DOCS AS NEURONS: synapses are the doc's edges to its related docs (its siblings in its cross domain, and its
    // cross-formula targets) — filled from the sealed bridges. The axon is `parent` up the tree; the dendrites are these.
    { name: 'synapses', type: 'relationship', relationTo: 'docs', hasMany: true },
    // The doc references all related from within itself via lexical/combinatoric blocks: HexProgram (its own query, the
    // hex-UUID combination), Family (its formulas and experts), CrossDomain (its neighbourhood). Each renders by
    // addressing a hex-program UUID — the doc is a neuron that states its own connections.
    { name: 'content', type: 'blocks', blocks: [HexProgram, Family, CrossDomain] },
  ],
}
