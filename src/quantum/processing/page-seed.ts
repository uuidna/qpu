// A pages document in the website seed schema: title, slug, default hero, one content block, SEO meta.
// The slug rule is the website's formatSlug: spaces become hyphens, other marks drop, then lowercase.
import { canonicalText, channel, uuid } from '../uuid/index.ts'

export const formatSlug = (val: string) => val.replace(/ /g, '-').replace(/[^\w-]+/g, '').toLowerCase()
/** The nested-docs plugin: each ancestor's slug, joined from the root. */
export const nestedUrl = (docs: readonly { slug: string }[]) => docs.reduce((url, doc) => `${url}/${doc.slug}`, '')
const lexicalParagraph = (t: string) => ({ type: 'paragraph', version: 1, format: '', indent: 0, direction: 'ltr' as const, children: [{ type: 'text', version: 1, text: t, format: 0, mode: 'normal', style: '', detail: 0 }] })

export const pageSeed = (title: string, text: string, id = uuid(canonicalText({ title, text }))) => {
  const name = title.trim().slice(0, 120) || 'idea'
  const slug = (formatSlug(name).slice(0, 80) || 'idea')
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0)
  const columnOne = { root: { type: 'root', version: 1, direction: 'ltr', format: '', indent: 0, children: (lines.length ? lines : [text]).map(lexicalParagraph) } }
  const description = (lines[0] ?? name).slice(0, 160)
  return {
    id,
    sku: channel(id).sku,
    title: name,
    slug,
    _status: 'draft' as const,
    hero: { type: 'default' as const },
    layout: [{ blockType: 'content' as const, contentFields: { useLeadingHeader: false, layout: 'oneColumn' as const, columnOne } }],
    meta: { title: name, description },
    breadcrumbs: [{ doc: id, url: `/${slug}`, label: name }],
  }
}
