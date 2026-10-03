import { blockFields } from '../../fields/blockFields'

/** Cross-family solutions and sequence identities from the discovery receipt (qpu_discover). */
export const Discovery = blockFields('Discovery', 'QPU', [{ name: 'limit', type: 'number', min: 1, admin: { description: 'empty: every solution' } }])
