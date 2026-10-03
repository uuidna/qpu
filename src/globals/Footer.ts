import type { GlobalConfig } from 'payload'
import { links } from '../fields/link'

/** The site footer: its links and the copyright line. */
export const Footer: GlobalConfig = {
  slug: 'footer',
  access: { read: () => true },
  fields: [links('navItems'), { name: 'copyright', type: 'text' }],
}
