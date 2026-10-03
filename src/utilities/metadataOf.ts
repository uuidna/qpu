import type { Metadata } from 'next'
import { seoURLOf } from '@/collections/Docs'
import type { Doc, Page } from '@/payload-types'

/** A page's or doc's metadata from the SEO fields its save filled. */
export const metadataOf = (doc: Page | Doc | undefined, type: 'website' | 'article' = 'website'): Metadata => {
  if (!doc) return {}
  const title = doc.meta?.title ?? doc.title
  const description = doc.meta?.description ?? doc.description ?? undefined
  const url = seoURLOf(doc)
  return { title: { absolute: title }, description, alternates: { canonical: url }, openGraph: { title, description, type, url } }
}
