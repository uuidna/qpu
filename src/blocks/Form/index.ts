import { blockFields } from '../../fields/blockFields.js'

export const Form = blockFields('Form', 'Layout', 'A form-builder form, submitted to form-submissions.', [{ name: 'form', type: 'relationship', relationTo: 'forms', required: true }])
