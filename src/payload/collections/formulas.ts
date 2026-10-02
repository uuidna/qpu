import type { CollectionConfig } from 'payload'

/**
 * Formulas Collection
 * All 12+ cross-domain formulas from QPU hex framework
 */
export const Formulas: CollectionConfig = {
  slug: 'formulas',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    {
      name: 'id',
      type: 'text',
      required: true,
      unique: true,
      index: true
    },
    {
      name: 'name',
      type: 'text',
      required: true
    },
    {
      name: 'domain',
      type: 'select',
      required: true,
      options: [
        { label: 'Causal Inference', value: 'causal' },
        { label: 'Explainability (XAI)', value: 'xai' },
        { label: 'Federated Learning', value: 'federated' },
        { label: 'Program Synthesis', value: 'synthesis' },
        { label: 'Zero-Shot Transfer', value: 'transfer' },
      ]
    },
    {
      name: 'description',
      type: 'textarea'
    },
    {
      name: 'problem',
      type: 'text',
      admin: { placeholder: 'e.g., P vs NP, Hodge Conjecture' }
    },
    {
      name: 'keywords',
      type: 'array',
      fields: [
        { name: 'keyword', type: 'text' }
      ]
    },
    {
      name: 'hexAddress',
      type: 'text',
      admin: { readOnly: true }
    },
  ],
}
