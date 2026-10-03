import { Atom, Database, FileText, Sigma } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BlockWrapper } from '@/components/BlockWrapper'
import { countsOf, familiesOf } from '@/app/_data'
import { formatNumber } from '@/utilities/formatNumber'
import type { StatsBlock } from '@/payload-types'

/** The combinatorics of every registered family, summed: nothing counted by hand. */
export function Stats({ heading, intro, anchor }: StatsBlock) {
  const families = familiesOf()
  const t = families.reduce((s, f) => { const c = countsOf(f.formulas.length); return { formulas: s.formulas + c.formulas, compositions: s.compositions + c.compositions, programs: s.programs + c.programs } }, { formulas: 0, compositions: 0, programs: 0n })
  const cells = [
    { icon: Atom, label: 'formula families', value: families.length },
    { icon: Sigma, label: 'formulas', value: t.formulas },
    { icon: Database, label: 'two-step compositions', value: t.compositions },
    { icon: FileText, label: 'programs of up to ten steps', value: t.programs },
  ]
  return (
    <BlockWrapper heading={heading} intro={intro} anchor={anchor}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cells.map(({ icon: Icon, label, value }) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2"><Icon className="size-4" /> {label}</CardDescription>
              <CardTitle className="font-mono text-3xl">{formatNumber(value)}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </BlockWrapper>
  )
}
