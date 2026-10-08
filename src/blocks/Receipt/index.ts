import { blockFields } from '../../fields/blockFields.js'

export const Receipt = blockFields('Receipt', 'QPU', 'Any committed receipt\'s rows, chosen by file name (heat-receipt.json, formulas-receipt.json, …).', [
  { type: 'row', fields: [{ name: 'file', type: 'text', required: true, admin: { description: 'a *-receipt.json at the repository root' } }, { name: 'limit', type: 'number', min: 1 }] },
], { needs: ['file'] })
