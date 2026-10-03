import type { Field, GroupField } from 'payload'

/** The page served at the site root. */
export const HOME = 'home'

/** A link as payloadcms/website models it: a reference to a page or doc, or a custom URL, with its label. */
export const link = (name = 'link'): GroupField => ({
  name,
  type: 'group',
  fields: [
    { name: 'type', type: 'radio', defaultValue: 'custom', options: [{ label: 'Page or doc', value: 'reference' }, { label: 'URL', value: 'custom' }], admin: { layout: 'horizontal' } },
    { name: 'reference', type: 'relationship', relationTo: ['pages', 'docs'], admin: { condition: (_, s) => s?.type === 'reference' } },
    { name: 'url', type: 'text', admin: { condition: (_, s) => s?.type !== 'reference' } },
    { name: 'label', type: 'text', required: true },
  ],
})

export const links = (name = 'links'): Field => ({ name, type: 'array', fields: [link()] })

type LinkValue = { type?: string | null; url?: string | null; label?: string | null; reference?: { relationTo?: string; value?: unknown } | null }

/** Where a link goes: a referenced page or doc lives at its own slug (the page `home` at the root), a URL as written. */
export const hrefOf = (l: LinkValue | null | undefined): string => {
  if (!l) return '/'
  if (l.type === 'reference' && l.reference && typeof l.reference.value === 'object' && l.reference.value) {
    const slug = (l.reference.value as { slug?: string }).slug ?? ''
    return l.reference.relationTo === 'pages' && slug === HOME ? '/' : `/${slug}`
  }
  return l.url ?? '/'
}
