import type { MetadataRoute } from 'next'
import { docsOf, familiesOf, pagesOf } from '@/app/_data'
import { seoURLOf, SITE } from '@/collections/Docs'

export const dynamic = 'force-dynamic'

/** Every address the site answers at, read from what exists: pages, docs and formula families. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, docs] = await Promise.all([pagesOf(), docsOf()])
  return [
    ...pages.map((p) => ({ url: seoURLOf(p), lastModified: p.updatedAt })),
    ...docs.map((d) => ({ url: seoURLOf(d), lastModified: d.updatedAt })),
    ...familiesOf().map((f) => ({ url: `${SITE.origin}/${encodeURIComponent(f.name)}` })),
  ]
}
