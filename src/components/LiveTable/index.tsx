import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { liveOf } from '@/app/_data'

type Row = Awaited<ReturnType<typeof liveOf>>[number]
const show = (x: unknown) => (typeof x === 'object' ? JSON.stringify(x) : String(x ?? ''))

// a sequence OEIS does not hold is not a disagreement: it is a sequence the unit has and OEIS does not
const verdictOf = (r: Row): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } =>
  r.result.agrees ? { label: 'agrees', variant: 'default' }
    : r.result.denied ? { label: 'unreachable', variant: 'secondary' }
    : r.source === 'sequence' ? { label: 'not in OEIS', variant: 'outline' }
    : { label: 'differs', variant: 'destructive' }

/** Live public datasets, each read and compared with what the unit proves or computes. */
export function LiveTable({ rows }: { rows: Row[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Source</TableHead>
          <TableHead>Checks</TableHead>
          <TableHead>Reading</TableHead>
          <TableHead className="text-right">Agrees</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => {
          const v = verdictOf(r)
          return (
            <TableRow key={r.label}>
              <TableCell className="whitespace-nowrap">{r.result.url ? <a href={r.result.url} className="text-primary hover:underline">{r.label}</a> : r.label}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">{r.checks}</TableCell>
              <TableCell className="max-w-md truncate font-mono text-xs" title={show(r.result.reading)}>{r.result.denied ? `unreachable: ${show(r.result.reading)}` : show(r.result.reading)}</TableCell>
              <TableCell className="text-right"><Badge variant={v.variant}>{v.label}</Badge></TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
