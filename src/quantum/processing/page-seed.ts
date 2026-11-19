// A pages document in the website seed schema: title, slug, default hero, one content block, SEO meta.
// The slug rule is the website's formatSlug: spaces become hyphens, other marks drop, then lowercase.
import { canonicalText, channel, uuid } from '../uuid/index.ts'

export const formatSlug = (val: string) => val.replace(/ /g, '-').replace(/[^\w-]+/g, '').toLowerCase()
/** The nested-docs plugin: each ancestor's slug, joined from the root. */
export const nestedUrl = (docs: readonly { slug: string }[]) => docs.reduce((url, doc) => `${url}/${doc.slug}`, '')
const lexicalParagraph = (t: string) => ({ type: 'paragraph' as const, version: 1, format: '' as const, indent: 0, direction: 'ltr' as const, textFormat: 0, textStyle: '', children: [{ type: 'text' as const, version: 1, text: t, format: 0, mode: 'normal' as const, style: '', detail: 0 }] })

/** A seed starts as a draft; a seed set may publish it. */
export type PageStatus = 'draft' | 'published'

export const pageSeed = (title: string, text: string, id = uuid(canonicalText({ title, text }))) => {
  const name = title.trim().slice(0, 120) || 'idea'
  const slug = (formatSlug(name).slice(0, 80) || 'idea')
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0)
  const columnOne = { root: { type: 'root' as const, version: 1, direction: 'ltr' as const, format: '' as const, indent: 0, children: (lines.length ? lines : [text]).map(lexicalParagraph) } }
  const description = (lines[0] ?? name).slice(0, 160)
  return {
    id,
    sku: channel(id).sku,
    title: name,
    slug,
    _status: 'draft' as PageStatus,
    hero: { type: 'default' as const },
    layout: [{ blockType: 'content' as const, contentFields: { useLeadingHeader: false, layout: 'oneColumn' as const, columnOne } }],
    meta: { title: name, description },
    breadcrumbs: [{ doc: id, url: `/${slug}`, label: name }],
  }
}
