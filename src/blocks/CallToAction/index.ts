import type { Block } from 'payload'

/** Call to action — richText beside up to two links. The payloadcms/website `cta` block. */
export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  admin: { group: 'QPU' },
  fields: [
    { name: 'richText', type: 'richText' },
    { name: 'links', type: 'array', maxRows: 2, fields: [{ name: 'label', type: 'text' }, { name: 'url', type: 'text' }] },
  ],
}
