import { blockFields } from '../../fields/blockFields'

export const Docs = blockFields('Docs', 'QPU', 'The documentation, each page at its own slug.', [{ name: 'limit', type: 'number', min: 1 }])
