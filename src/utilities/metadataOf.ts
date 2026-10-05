import type { Metadata } from 'next'
import { seoURLOf } from '@/collections/Docs'
import type { Doc, Page } from '@/payload-types'

/** A page's or doc's metadata from the SEO fields its save filled. */
export const metadataOf = (doc: Page | Doc | undefined, type: 'website' | 'article' = 'website'): Metadata => {
  if (!doc) return {}
  const title = doc.meta?.title ?? doc.title
  const description = doc.meta?.description ?? doc.description ?? undefined
  const url = seoURLOf(doc)
  // best-practice SEO by architecture: title, description, one canonical, Open Graph, a Twitter card, and indexable robots
  return { title: { absolute: title }, description, alternates: { canonical: url }, openGraph: { title, description, type, url }, twitter: { card: 'summary_large_image', title, description }, robots: { index: true, follow: true } }
}
