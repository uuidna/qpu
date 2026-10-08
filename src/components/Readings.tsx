import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { claySealReadingsOf, type ClaySealReading } from '@/payload/plugins/clay'
import { SortFormulas } from '@/families/sort'

/** The arguments src/families/sort/test.ts already passes to comparisons. */
const SORT_PARAMS = [1000, 10] as const

export type SortReading = {
  family: 'sort'
  formula: 'comparisons'
  params: readonly [number, number]
  hex: string
  value: number
  holds: boolean
}

export const sortReadingOf = (): SortReading => {
  const run = SortFormulas.comparisons(SORT_PARAMS[0], SORT_PARAMS[1])
  return { family: 'sort', formula: 'comparisons', params: SORT_PARAMS, hex: run.hex ?? '', value: run.value, holds: run.holds }
}

export const listedOf = <T,>(rows: readonly T[], name: (row: T) => string): T[] =>
  [...rows].sort((a, b) => name(a).localeCompare(name(b)))

const textOf = (reading: { hex: string; value: number; holds: boolean }) =>
  `hex ${reading.hex} · value ${reading.value} · holds ${String(reading.holds)}`

/** The badge text is the reading. The formula name sits beside it so six seals stay distinct. */
export function ReadingBadge({ reading }: { reading: ClaySealReading | SortReading }) {
  const text = textOf(reading)
  return (
    <span className="inline-flex max-w-full flex-wrap items-center gap-2">
      <span className="font-mono text-xs text-muted-foreground">{reading.family}.{reading.formula}({reading.params.join(',')})</span>
      <Badge variant="outline" className="h-auto max-w-full justify-start overflow-visible whitespace-normal text-left font-mono">
        {reading.hex ? <Link href={`/${reading.hex}`} className="break-all">{text}</Link> : text}
      </Badge>
    </span>
  )
}

/** No tag formula is registered. The badges are the seal readings and the sort reading. */
export function FormulaReadings() {
  const seals = claySealReadingsOf()
  const sort = sortReadingOf()
  return (
    <div className="space-y-2">
      <Badge variant="outline">lead: no tag formula</Badge>
      <div className="flex flex-col gap-2">
        {seals.map((reading) => <ReadingBadge key={reading.formula} reading={reading} />)}
        <ReadingBadge reading={sort} />
      </div>
    </div>
  )
}
