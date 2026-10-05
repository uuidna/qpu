import { blockFields } from '../../fields/blockFields'

export const Discovery = blockFields('Discovery', 'QPU', 'Cross-family solutions and sequence identities from the discovery receipt (discover).', [{ name: 'limit', type: 'number', min: 1, admin: { description: 'empty: every solution' } }])
