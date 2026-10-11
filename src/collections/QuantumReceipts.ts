import type { CollectionConfig } from 'payload'
import { anyone, authenticated, never } from '../access'

/** A quantum receipt: its programmable UUID (payload fold + referrer), its stream position and the link before it. */
export const QuantumReceipts: CollectionConfig = {
  slug: 'quantum-receipts',
  admin: { useAsTitle: 'uuid' },
  // The receipt ledger is append-only and content-addressed: a row's `fold` is qpuContentUuidOf of the committed
  // *-receipt.json it mirrors (the content itself stays git-committed, not copied into the row), and the row is never
  // updated or deleted. Immutability is the tamper-evidence — a stored row cannot be re-derived here because it carries a
  // pointer + fold, not the content, so the honest guarantee is append-only, not a create-time re-fold (Wave XIII HIGH).
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
