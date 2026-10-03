import { blockFields } from '../../fields/blockFields'

/** The documentation, each page at its own slug. */
export const Docs = blockFields('Docs', 'QPU', [{ name: 'limit', type: 'number', min: 1 }])
