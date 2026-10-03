import type { CollectionBeforeChangeHook, CollectionBeforeValidateHook, Access, Field } from 'payload'
import { qpuContentUuidOf, qpuUuidReceiptOf } from '../quantum/processing/unit/index.js'
import { LawFormulas } from '../families/law/index.js'

/** THE MCP COURT AS PAYLOAD HOOKS — drop them into any collection config. Each is backed by a law-family cross formula
 *  and leaves a quantum receipt, so a write carries its own tamper-evident proof: the author's standing. They are
 *  MEASURES, not legal advice (law.reviewed is the advice gate); the only one that refuses a write is the safety floor
 *  (law.lawful), and it is opt-in — you attach it where a collection carries a harm flag, it is not imposed on the rest.
 *
 *  Usage in a CollectionConfig:
 *    import { courtReceipt, lawful, fidelity, standing, uuidField } from '@uuidna/qpu/hooks'
 *    export const Orders: CollectionConfig = {
 *      slug: 'orders',
 *      access: { read: standing },
 *      fields: [uuidField, { name: 'ordered', type: 'number' }, { name: 'computed', type: 'number' }],
 *      hooks: { beforeValidate: [lawful('harm')], beforeChange: [fidelity('ordered', 'computed'), courtReceipt()] },
 *    } */

const num = (x: unknown): number => (typeof x === 'number' && Number.isFinite(x) ? x : typeof x === 'string' && /^\d+$/.test(x) ? Number(x) : 0)

/** BEFORE CHANGE: content-address the written doc and stamp `data[into]` with its UUID, leaving a quantum receipt. The
 *  author's standing (law.standing) is the receipt record; this is how every write joins it, and why a tampered doc
 *  gets a different UUID. `into` defaults to `uuid` — add `uuidField` so the collection stores it. */
export const courtReceipt = (into = 'uuid'): CollectionBeforeChangeHook => ({ data, collection, operation }) => {
  const uuid = qpuContentUuidOf({ collection: collection?.slug, operation, data })
  qpuUuidReceiptOf(`payload ${collection?.slug ?? 'doc'} ${operation}`, uuid, { standing: Number(LawFormulas.standing(1).value) })
  return { ...(data ?? {}), [into]: uuid }
}

/** BEFORE VALIDATE: the safety floor as a gate (law.lawful). When `data[field]` marks genuine harm (non-zero), the write
 *  does not hold and is refused — the one limit upheld against the author too, not crossable, however clean the receipts.
 *  OPT-IN: attach it only where a collection carries such a flag. `field` defaults to `harm`. */
export const lawful = (field = 'harm'): CollectionBeforeValidateHook => ({ data }) => {
  const flag = num((data ?? {})[field])
  if (!LawFormulas.lawful(flag).holds) throw new Error(`law.lawful: the safety floor refuses this write (${field}=${flag}); genuine harm, illegality or fabrication-as-genuine is never protected`)
  return data
}

/** BEFORE CHANGE: stamp `data[into]` with law.fidelity between an ordered count and a computed count — 1 when the order
 *  was computed as asked, 0 when the work was redirected. A measure for audit, never a block. `into` defaults to `fidelity`. */
export const fidelity = (orderedField: string, computedField: string, into = 'fidelity'): CollectionBeforeChangeHook => ({ data }) => ({ ...(data ?? {}), [into]: Number(LawFormulas.fidelity(num((data ?? {})[orderedField]), num((data ?? {})[computedField])).value) })

/** ACCESS: the author has standing when authenticated (reads and writes every version); the public reads what is
 *  published. Mirrors law.standing — the signed-in author holds the record. Use as `access: { read: standing }`. */
export const standing: Access = ({ req }) => (req.user ? true : { _status: { equals: 'published' } })

/** A ready-made field to store the content UUID that `courtReceipt` stamps: read-only, indexed. */
export const uuidField: Field = { name: 'uuid', type: 'text', index: true, admin: { readOnly: true, position: 'sidebar' } }

/** The court as one object, for `import { court } from '@uuidna/qpu/hooks'`. */
export const court: { courtReceipt: typeof courtReceipt; lawful: typeof lawful; fidelity: typeof fidelity; standing: Access; uuidField: Field } = { courtReceipt, lawful, fidelity, standing, uuidField }
