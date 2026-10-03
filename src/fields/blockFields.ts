import type { Block, Field } from 'payload'

/** A block's slug and interface are its folder's name: src/blocks/CallToAction is `callToAction` and `CallToActionBlock`. */
export const slugOf = (name: string): string => `${name[0]!.toLowerCase()}${name.slice(1)}`

// every block may carry a heading, an anchor for in-page links and an introduction
const head: Field[] = [
  { type: 'row', fields: [{ name: 'heading', type: 'text' }, { name: 'anchor', type: 'text', admin: { description: 'id for in-page links (#families)' } }] },
  { name: 'intro', type: 'textarea' },
]

/** What a block is, as data the site composes from: its description is the intro of the page it makes, `live` marks a
 *  block that reads the network when served (its own page, not the home page), `needs` the fields a page must supply. */
export type BlockCustom = { description: string; live?: boolean; needs?: string[] }

export const blockFields = (name: string, group: 'Layout' | 'QPU', description: string, fields: Field[] = [], custom: Omit<BlockCustom, 'description'> = {}): Block => ({
  slug: slugOf(name),
  interfaceName: `${name}Block`,
  admin: { group, custom: { description, ...custom } },
  fields: [...head, ...fields],
})

export const customOf = (b: Block): BlockCustom => (b.admin?.custom ?? { description: '' }) as BlockCustom
