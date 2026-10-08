import { blockFields } from '../../fields/blockFields.js'

export const CaseStudyCards = blockFields('CaseStudyCards', 'Layout', 'Cards, each a title, a description and a link.', [{ name: 'items', type: 'array', fields: [{ name: 'title', type: 'text' }, { name: 'description', type: 'textarea' }, { name: 'href', type: 'text' }] }])
