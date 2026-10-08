import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BlockWrapper } from '@/components/BlockWrapper'
import { countsOf, familiesOf } from '@/app/_data'
import { FormulaReadings } from '@/components/Readings'
import { formatNumber } from '@/utilities/formatNumber'
import type { FamiliesBlock } from '@/payload-types'

/** Every registered formula family, each at its own name, with what it composes. */
export function Families({ heading, intro, anchor }: FamiliesBlock) {
  return (
    <BlockWrapper heading={heading} intro={intro} anchor={anchor}>
      <FormulaReadings />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {familiesOf().map((f) => {
          const c = countsOf(f.formulas.length)
          return (
            <Link key={f.name} href={`/${encodeURIComponent(f.name)}`} className="group">
              <Card className="h-full transition-colors group-hover:border-primary/60">
                <CardHeader>
                  <CardTitle className="font-mono">{f.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{f.formulas.map((x) => x.name).join(' · ')}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Badge variant="outline">{c.formulas} formulas</Badge>
                  <Badge variant="outline">{c.compositions} compositions</Badge>
                  <Badge variant="secondary" className="font-mono">{formatNumber(c.programs)} programs</Badge>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </BlockWrapper>
  )
}
