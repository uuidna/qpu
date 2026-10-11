import type { CollectionConfig } from 'payload'
import { anyone, adminOrAbove, never } from '../access'

/** A quantum receipt: its programmable UUID (payload fold + referrer), its stream position and the link before it. */
export const QuantumReceipts: CollectionConfig = {
  slug: 'quantum-receipts',
  admin: { useAsTitle: 'uuid' },
  // The receipt ledger is append-only and content-addressed: a row's `fold` is qpuContentUuidOf of the committed
  // *-receipt.json it mirrors (the content itself stays git-committed, not copied into the row), and the row is never
  // updated or deleted. Append-only (update/delete:never) stops mutation of existing rows; gating `create` to an admin
  // stops a signed-in non-admin from INJECTING a forged append into the public verification ledger — immutability alone
  // did not cover forged appends. Seeding is unaffected: seedReceipts and the local API both create with overrideAccess.
  access: { read: anyone, create: adminOrAbove, update: never, delete: never },
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
