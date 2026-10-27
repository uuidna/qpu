import type { Block } from 'payload'

import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { blockFields } from '../../fields/blockFields'
import richText from '../../fields/richText'

export const Form: Block = {
  slug: 'form',
  fields: [
    blockFields({
      name: 'formFields',
      fields: [
        richText({ editor: lexicalEditor({ features: ({ defaultFeatures }) => defaultFeatures.filter((f) => f.key !== 'blocks') }) }),
        {
          name: 'form',
          type: 'relationship',
          relationTo: 'forms',
          required: true,
        },
      ],
    }),
  ],
  graphQL: {
    singularName: 'FormBlock',
  },
  interfaceName: 'FormBlock',
  labels: {
    plural: 'Form Blocks',
    singular: 'Form Block',
  },
}
