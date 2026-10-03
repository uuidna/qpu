import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { countsOf, type Family } from '../_lib/qpu'

export const programHref = (family: string, program: string[]) => `/${encodeURIComponent(family)}/${program.map(encodeURIComponent).join('+')}`

export function FamilyView({ family: f }: { family: Family }) {
  const c = countsOf(f.formulas.length)
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">formula family</p>
        <h1 className="font-mono text-3xl font-semibold tracking-tight">{f.name}</h1>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{c.formulas} formulas</Badge>
          <Badge variant="outline">{c.pairs} pairs</Badge>
          <Badge variant="outline">{c.compositions} compositions</Badge>
          <Badge variant="secondary" className="font-mono">{c.programs.toString()} programs</Badge>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Formulas</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Nibble</TableHead>
              <TableHead>Formula</TableHead>
              <TableHead className="text-right">Arity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {f.formulas.map((x) => (
              <TableRow key={x.name}>
                <TableCell className="font-mono text-muted-foreground">{x.nibble}</TableCell>
                <TableCell><Link href={programHref(f.name, [x.name])} className="font-mono text-primary hover:underline">{x.name}</Link></TableCell>
                <TableCell className="text-right font-mono">{x.arity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Composition matrix</h2>
        <p className="text-sm text-muted-foreground">Row then column: the accumulator leaves the row formula and enters the column formula. Every cell is a hex program.</p>
        <div className="overflow-x-auto rounded-lg border">
          <table className="text-xs">
            <thead>
              <tr>
                <th className="sticky left-0 bg-background p-2" />
                {f.formulas.map((b) => (
                  <th key={b.name} className="p-2 font-mono font-normal text-muted-foreground" title={b.name}>{b.nibble}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {f.formulas.map((a) => (
                <tr key={a.name} className="border-t">
                  <th className="sticky left-0 bg-background p-2 text-left font-mono font-normal whitespace-nowrap">{a.nibble} {a.name}</th>
                  {f.formulas.map((b) => (
                    <td key={b.name} className="p-1 text-center">
                      <Link href={programHref(f.name, [a.name, b.name])} title={`${a.name} → ${b.name}`} className="block size-6 rounded bg-primary/15 transition-colors hover:bg-primary" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
