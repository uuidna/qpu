import { blockFields } from '../../fields/blockFields.js'

export const Docs = blockFields('Docs', 'QPU', 'The documentation the unit generates from itself, each page at its own slug, nested as the docs plugin places it.', [{ name: 'limit', type: 'number', min: 1 }])
