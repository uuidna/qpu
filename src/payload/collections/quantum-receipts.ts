import type { CollectionConfig } from 'payload'

/** A quantum receipt: its programmable UUID (payload fold + referrer), its stream position and the link before it. */
export const QuantumReceipts: CollectionConfig = {
  slug: 'quantum-receipts',
  admin: { useAsTitle: 'uuid' },
  fields: [
    { name: 'uuid', type: 'text', required: true, unique: true },
    { name: 'name', type: 'text', required: true },
    { name: 'stream', type: 'text', required: true },
    { name: 'seq', type: 'number', required: true },
    { name: 'prev', type: 'text', required: true },
    { name: 'subject', type: 'text' },
    { name: 'referrer', type: 'text', required: true },
    { name: 'fold', type: 'text', required: true },
  ],
}
