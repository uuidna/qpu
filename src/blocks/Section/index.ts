import type { Block } from 'payload'

/** SECTION — the minimal combinatorial primitive (shadcn-composable): one block whose variant × tone × columns span
 *  what Banner, CallToAction, Content and a hero were separately. Fewer block types, more layouts by combination:
 *  variant(5) × tone(5) × columns(1..4) × optional links — a single primitive covers the presentational space, so a
 *  page composes richer layouts from fewer parts. Maps to shadcn primitives (Card/Alert/Button/grid) at render. */
export const Section: Block = {
  slug: 'section',
  interfaceName: 'SectionBlock',
  admin: { group: 'QPU' },
  fields: [
    { name: 'variant', type: 'select', defaultValue: 'content', options: ['hero', 'banner', 'cta', 'content', 'feature'] },
    { name: 'tone', type: 'select', defaultValue: 'default', options: ['default', 'info', 'warning', 'error', 'success'] },
    { name: 'columns', type: 'select', defaultValue: 'one', options: ['one', 'two', 'three', 'four'] },
    { name: 'richText', type: 'richText' },
    { name: 'links', type: 'array', maxRows: 3, fields: [{ name: 'label', type: 'text' }, { name: 'url', type: 'text' }, { name: 'style', type: 'select', defaultValue: 'default', options: ['default', 'outline', 'ghost', 'link'] }] },
  ],
}
