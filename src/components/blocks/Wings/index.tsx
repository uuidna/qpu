import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BlockWrapper } from '@/components/BlockWrapper'
import { docOf, docsOf } from '@/app/_data'
import { wingOf } from '@uuidna/qpu/core/showcase.js'
import type { WingsBlock } from '@/payload-types'

/** The wings are the pages the documentation index links to, each reporting its own statistics table. */
export async function Wings({ heading, intro, anchor }: WingsBlock) {
  const index = await docOf('index')
  const linked = new Set([...(index?.markdown ?? '').matchAll(/\]\(([\w-]+)\.md\)/g)].map((m) => m[1]))
  const wings = (await docsOf()).filter((d) => linked.has(d.slug)).flatMap((d) => { const w = wingOf(d.slug, d.markdown ?? ''); return w ? [w] : [] })
  return (
    <BlockWrapper heading={heading} intro={intro} anchor={anchor}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wings.map((w) => (
          <Link key={w.slug} href={`/${w.slug}`} className="group">
            <Card className="h-full transition-colors group-hover:border-primary/60">
              <CardHeader>
                <CardTitle className="text-base">{w.title}</CardTitle>
                <CardDescription className="line-clamp-2">{w.description}</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                {w.stats.map((s) => (
                  <div key={s.label} className="contents">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="text-right font-mono">{s.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </BlockWrapper>
  )
}
