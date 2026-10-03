import type { GlobalConfig } from 'payload'
import { links } from '../fields/link'

/** The site header, edited in the admin as payloadcms/website does: its navigation is content, not code. */
export const Header: GlobalConfig = {
  slug: 'header',
  access: { read: () => true },
  fields: [links('navItems')],
}
