import { blockFields } from '../../fields/blockFields'

/** A form-builder form, submitted to form-submissions. */
export const Form = blockFields('Form', 'Layout', [{ name: 'form', type: 'relationship', relationTo: 'forms', required: true }])
