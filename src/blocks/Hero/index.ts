import { blockFields } from '../../fields/blockFields.js'
import { links } from '../../fields/link.js'

export const Hero = blockFields('Hero', 'Layout', 'The page\'s opening: a badge, a heading with its highlighted half, text and links.', [
  { name: 'badge', type: 'text' },
  { name: 'emphasis', type: 'text', admin: { description: 'the second, highlighted part of the heading' } },
  { name: 'text', type: 'textarea', admin: { description: "empty: the documentation index's description" } },
  links(),
])
