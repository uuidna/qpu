import { blockFields } from '../../fields/blockFields'

/** Any committed receipt's rows, chosen by file name (heat-receipt.json, formulas-receipt.json, …). */
export const Receipt = blockFields('Receipt', 'QPU', [
  { type: 'row', fields: [{ name: 'file', type: 'text', required: true, admin: { description: 'a *-receipt.json at the repository root' } }, { name: 'limit', type: 'number', min: 1 }] },
])
