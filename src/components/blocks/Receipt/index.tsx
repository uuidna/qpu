import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { BlockWrapper } from '@/components/BlockWrapper'
import { receiptsOf, type ReceiptRow } from '@/app/_data'
import { FormulaReadings, listedOf } from '@/components/Readings'
import { receiptFactsOf } from '@uuidna/qpu/core/showcase.js'
import type { ReceiptBlock } from '@/payload-types'

/** One receipt as it was committed: its scalar facts, then each row, passing or not, with its value and hex program. */
export function Receipt({ heading, intro, anchor, file, limit }: ReceiptBlock) {
  const found = receiptsOf().find((r) => r.file === file)
  if (!found) return <BlockWrapper heading={heading} intro={`No receipt named ${file}.`} anchor={anchor}>{null}</BlockWrapper>
  const rows = listedOf((Array.isArray(found.doc.rows) ? found.doc.rows : []) as (ReceiptRow & { hex?: string })[], (r) => r.name)
  return (
    <BlockWrapper heading={heading} intro={intro} anchor={anchor}>
      <FormulaReadings />
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {receiptFactsOf(found.doc).filter((f) => !/uuid|receipt|kind/.test(f.key)).slice(0, 6).map((f) => (
          <Card key={f.key}>
            <CardHeader className="pb-2">
              <CardDescription>{f.key}</CardDescription>
              <CardTitle className="truncate font-mono text-lg" title={f.value}>{f.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      <Table>
        <TableBody>
          {(limit ? rows.slice(0, limit) : rows).map((r) => (
            <TableRow key={r.name}>
              <TableCell className="w-24"><Badge variant={r.pass ? 'default' : 'destructive'}>{r.pass ? 'holds' : 'does not hold'}</Badge></TableCell>
              <TableCell className="font-mono text-sm">{r.hex ? <a href={`/${r.hex}`} className="hover:underline">{r.name}</a> : r.name}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">{r.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </BlockWrapper>
  )
}
