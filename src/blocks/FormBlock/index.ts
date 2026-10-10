import type { Block } from 'payload'

/** Form — an embedded form from the form-builder, with an optional intro. The payloadcms/website `formBlock`. */
export const FormBlock: Block = {
  slug: 'formBlock',
  interfaceName: 'FormBlock',
  admin: { group: 'QPU' },
  fields: [
    { name: 'form', type: 'relationship', relationTo: 'forms', required: true },
    { name: 'enableIntro', type: 'checkbox' },
    { name: 'introContent', type: 'richText' },
  ],
}
