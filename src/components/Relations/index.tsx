import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type ReceiptRow = { name: string; pass: boolean; value: string; receipt: string }

/** Cross-family solutions from the discovery receipt: each value, the families that reach it and the programs that do. */
export function RelationsTable({ rows }: { rows: ReceiptRow[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-right">Value</TableHead>
          <TableHead>Families and programs</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => {
          const [families, ways] = r.value.split(/: (.*)/s)
          return (
            <TableRow key={r.name}>
              <TableCell className="text-right align-top font-mono">{r.name.replace('relation ', '')}</TableCell>
              <TableCell className="space-y-1">
                <div className="flex flex-wrap items-center gap-1">
                  {families!.replace(' (live)', '').split(' + ').map((f) => <Link key={f} href={`/${encodeURIComponent(f)}`}><Badge variant="outline" className="font-mono">{f}</Badge></Link>)}
                  {families!.includes('(live)') ? <Badge>live</Badge> : null}
                </div>
                <div className="flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                  {(ways ?? '').split('; ').map((w) => {
                    const uuid = w.split(' ').at(-1)!
                    return <Link key={w} href={`/${uuid}`} className="font-mono hover:text-foreground">{w.replace(` ${uuid}`, '')}</Link>
                  })}
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

/** Formulas of different families that OEIS identifies as one sequence. */
export function IdentitiesTable({ rows }: { rows: ReceiptRow[] }) {
  return (
    <Table>
      <TableBody>
        {rows.map((r) => {
          const id = r.name.replace('sequence ', '')
          return (
            <TableRow key={r.name}>
              <TableCell className="w-28 align-top"><a href={`https://oeis.org/${id}`} className="font-mono text-primary hover:underline">{id}</a></TableCell>
              <TableCell className="font-mono text-sm">{r.value}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

/** The Clay lens: programs that return their own input — fixed points f(x) = x, involutions f∘f = id, inverse pairs. */
export function SealsTable({ rows }: { rows: ReceiptRow[] }) {
  return (
    <Table>
      <TableBody>
        {rows.map((r) => {
          const hex = r.value.split(' ').at(-1)!
          const [kind, ...rest] = r.value.replace(` ${hex}`, '').split(': ')
          return (
            <TableRow key={r.name}>
              <TableCell className="w-28 align-top"><Badge variant="secondary">{kind}</Badge></TableCell>
              <TableCell className="font-mono text-sm"><Link href={`/${hex}`} className="hover:underline">{r.name.replace('seal ', '')}</Link></TableCell>
              <TableCell className="text-xs text-muted-foreground">{rest.join(': ')}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
