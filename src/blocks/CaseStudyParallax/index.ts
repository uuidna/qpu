import { blockFields } from '../../fields/blockFields.js'

export const CaseStudyParallax = blockFields('CaseStudyParallax', 'Layout', 'A media reference shown with parallax, with a caption.', [{ name: 'media', type: 'text', admin: { description: 'the media URL' } }, { name: 'caption', type: 'text' }])
