import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BlockWrapper } from '@/components/BlockWrapper'
import { ReadingBadge, sortReadingOf } from '@/components/Readings'
import { clayOf } from '@uuidna/qpu/core/showcase.js'
import { claySealReadingsOf } from '@/payload/plugins/clay'
import type { ClayBlock } from '@/payload-types'

/** The problem's formula in the clay family, by the problem's key. */
const FORMULA: Record<string, string> = { p_vs_np: 'pVsNp', hodge_conjecture: 'hodge', riemann_hypothesis: 'riemann', yang_mills: 'yangMills', navier_stokes: 'navierStokes', bsd_conjecture: 'bsd' }

/** Each seal's badge is that seal's reading. Poincaré has no seal in CLAY_SEALS. */
export function Clay({ heading, intro, anchor }: ClayBlock) {
  const readings = claySealReadingsOf()
  const sort = sortReadingOf()
  const readingOf = (key: string) => readings.find((r) => r.formula === FORMULA[key])
  return (
    <BlockWrapper heading={heading} intro={intro} anchor={anchor}>
      <div className="space-y-2">
        <Badge variant="outline">lead: no tag formula</Badge>
        <ReadingBadge reading={sort} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clayOf().map((p) => {
          const reading = readingOf(p.key)
          return (
            <Card key={p.key}>
              <CardHeader>
                <CardTitle className="text-base">{p.name}</CardTitle>
                <CardDescription>{p.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {reading ? <ReadingBadge reading={reading} /> : <Badge variant="outline">lead: no clay seal</Badge>}
                {p.source ? <a href={p.source} className="text-primary hover:underline">{p.source}</a> : null}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </BlockWrapper>
  )
}
