import type { CollectionConfig } from 'payload'
import { anyone, authenticated, never } from '../access'

/** A quantum receipt: its programmable UUID (payload fold + referrer), its stream position and the link before it. */
export const QuantumReceipts: CollectionConfig = {
  slug: 'quantum-receipts',
  admin: { useAsTitle: 'uuid' },
  // the receipt ledger is append-only and content-addressed: a receipt's UUID is a fold of its payload, so changing it
  // would break its own address. No update, no delete — tamper-evident by construction (Wave XIII HIGH).
  access: { read: anyone, create: authenticated, update: never, delete: never },
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
