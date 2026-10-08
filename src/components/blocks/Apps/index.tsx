import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BlockWrapper } from '@/components/BlockWrapper'
import { appsOf, scopeOf } from '@/app/_data'
import { FormulaReadings, listedOf } from '@/components/Readings'
import type { AppsBlock } from '@/payload-types'

/** Each tenant as an app on the lattice: its domain and the pages and docs scoped to it, with the per-app / shared split
 *  that keeps determinism — a content UUID is the same bytes for everyone, so the engine is never scoped. */
export async function Apps({ heading, intro, anchor }: AppsBlock) {
  const apps = await appsOf()
  const { scoped, shared } = scopeOf()
  return (
    <BlockWrapper heading={heading} intro={intro} anchor={anchor}>
      <FormulaReadings />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map((a) => (
          <Card key={a.id} className="h-full">
            <CardHeader>
              <CardTitle className="font-mono">{a.name}</CardTitle>
              {a.domain ? <CardDescription className="font-mono">{a.domain}</CardDescription> : null}
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge variant="outline">{a.pages} pages</Badge>
              <Badge variant="outline">{a.docs} docs</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Scoped per app</h3>
          <div className="flex flex-wrap gap-2">
            {listedOf(scoped, (c) => c).map((c) => (
              <Badge key={c} variant="secondary" className="font-mono">{c}</Badge>
            ))}
          </div>
        </section>
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Shared across all apps</h3>
          <div className="flex flex-wrap gap-2">
            {listedOf(shared, (c) => c).map((c) => (
              <Badge key={c} variant="outline" className="font-mono">{c}</Badge>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">The content-addressed engine — a receipt is the same bytes for every app, so it is never scoped to one.</p>
        </section>
      </div>
    </BlockWrapper>
  )
}
