import { blockFields } from '../../fields/blockFields'

export const Receipts = blockFields('Receipts', 'QPU', 'Every committed receipt and the facts it records: each one a node of the final build receipt the README carries.', [{ name: 'facts', type: 'number', defaultValue: 8, min: 1 }])
