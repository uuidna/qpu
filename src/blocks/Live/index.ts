import { blockFields } from '../../fields/blockFields'

export const Live = blockFields('Live', 'QPU', 'Live public datasets read and checked against the unit (qpu_data).', [{ name: 'match', type: 'text', admin: { description: 'only sources whose label contains this' } }], { live: true })
