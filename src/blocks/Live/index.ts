import { blockFields } from '../../fields/blockFields'

/** Live public datasets read and checked against the unit (qpu_data). */
export const Live = blockFields('Live', 'QPU', [{ name: 'match', type: 'text', admin: { description: 'only sources whose label contains this' } }])
