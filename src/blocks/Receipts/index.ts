import { blockFields } from '../../fields/blockFields'

/** Every committed receipt and the facts it records. */
export const Receipts = blockFields('Receipts', 'QPU', [{ name: 'facts', type: 'number', defaultValue: 8, min: 1 }])
