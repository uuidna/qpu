import type { Block, Field } from 'payload'

/** A block's slug and interface are its folder's name: src/blocks/CallToAction is `callToAction` and `CallToActionBlock`. */
export const slugOf = (name: string): string => `${name[0]!.toLowerCase()}${name.slice(1)}`

// every block may carry a heading, an anchor for in-page links and an introduction
const head: Field[] = [
  { type: 'row', fields: [{ name: 'heading', type: 'text' }, { name: 'anchor', type: 'text', admin: { description: 'id for in-page links (#families)' } }] },
  { name: 'intro', type: 'textarea' },
]

export const blockFields = (name: string, group: 'Layout' | 'QPU', fields: Field[] = []): Block => ({
  slug: slugOf(name),
  interfaceName: `${name}Block`,
  admin: { group },
  fields: [...head, ...fields],
})
