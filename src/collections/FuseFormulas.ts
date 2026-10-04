import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '../access'

/** One cross formula of the fusion: a composing pair, its rarest field per direction, its specificity and receipt. */
export const FuseFormulas: CollectionConfig = {
  slug: 'fuse-formulas',
  admin: { useAsTitle: 'formulaId' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  fields: [
    { name: 'uuid', type: 'text', required: true, unique: true },
    { name: 'formulaId', type: 'text', required: true },
    { name: 'src', type: 'text', required: true },
    { name: 'dst', type: 'text', required: true },
    { name: 'formula', type: 'textarea', required: true },
    { name: 'value', type: 'number', required: true },
    { name: 'entangled', type: 'checkbox', required: true },
    { name: 'forward', type: 'json' },
    { name: 'backward', type: 'json' },
    { name: 'proof', type: 'textarea' },
    { name: 'receipt', type: 'text', required: true },
    { name: 'holds', type: 'checkbox', required: true },
  ],
}
