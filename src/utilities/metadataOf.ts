import type { Metadata } from 'next'
import { seoURLOf } from '@/collections/Docs'
import type { Doc, Page } from '@/payload-types'
import { SEO_KEYWORDS } from '@/seed/seo-keywords'

/** A page's or doc's metadata from the SEO fields its save filled, with the generated keyword set (every field the
 *  work spans — the family registry's domains, kept in sync with .zenodo.json) for discoverability. */
export const metadataOf = (doc: Page | Doc | undefined, type: 'website' | 'article' = 'website'): Metadata => {
  if (!doc) return { keywords: SEO_KEYWORDS }
  const title = doc.meta?.title ?? doc.title
  const description = doc.meta?.description ?? doc.description ?? undefined
  const url = seoURLOf(doc)
  return { title: { absolute: title }, description, keywords: SEO_KEYWORDS, alternates: { canonical: url }, openGraph: { title, description, type, url } }
}
