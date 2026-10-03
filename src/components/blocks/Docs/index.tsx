import Link from 'next/link'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BlockWrapper } from '@/components/BlockWrapper'
import { docsOf } from '@/app/_data'
import type { DocsBlock } from '@/payload-types'

/** The documentation, each page at its own slug. */
export async function Docs({ heading, intro, anchor, limit }: DocsBlock) {
  const docs = (await docsOf()).filter((d) => d.slug !== 'index')
  return (
    <BlockWrapper heading={heading} intro={intro} anchor={anchor}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(limit ? docs.slice(0, limit) : docs).map((d) => (
          <Link key={d.id} href={`/${d.slug}`} className="group">
            <Card className="h-full transition-colors group-hover:border-primary/60">
              <CardHeader>
                <CardTitle className="text-base">{d.title}</CardTitle>
                <CardDescription className="line-clamp-3">{d.meta?.description ?? d.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </BlockWrapper>
  )
}
