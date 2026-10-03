import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BlockWrapper } from '@/components/BlockWrapper'
import { clayOf } from '@uuidna/qpu/core/showcase.js'
import type { ClayBlock } from '@/payload-types'

/** The Millennium Prize Problems as the solver holds them: who solved or claims each, how, and the document. */
export function Clay({ heading, intro, anchor }: ClayBlock) {
  return (
    <BlockWrapper heading={heading} intro={intro} anchor={anchor}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clayOf().map((p) => (
          <Card key={p.key}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">{p.name}</CardTitle>
                <Badge variant={p.status === 'CLAIMED' ? 'secondary' : 'default'}>{p.status === 'CLAIMED' ? `claimed solved · ${p.claimedBy}` : `solved${p.solver ? ` · ${p.solver}${p.year ? `, ${p.year}` : ''}` : ''}`}</Badge>
              </div>
              <CardDescription>{p.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {p.approach ? <p><span className="text-muted-foreground">approach</span> <span className="font-mono">{p.approach}</span></p> : null}
              {p.claim ? <p className="text-muted-foreground">{p.claim}</p> : null}
              {p.crossFormulas.length ? <ul className="list-inside list-disc text-muted-foreground">{p.crossFormulas.map((f) => <li key={f} className="font-mono">{f}</li>)}</ul> : null}
              {p.source ? <a href={p.source} className="text-primary hover:underline">the claim →</a> : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </BlockWrapper>
  )
}
