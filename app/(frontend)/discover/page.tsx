import type { Metadata } from 'next'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import receipt from '@/discovery-receipt.json'

export const metadata: Metadata = {
  title: 'Discovery',
  description: 'Cross-formulated solutions across every formula family: values reached by programs of two or more families, with the live public data that fed them.',
  alternates: { canonical: '/discover' },
}

type Row = { name: string; pass: boolean; value: string; receipt: string }

export default function Discover() {
  const rows = receipt.rows as Row[]
  const live = rows.filter((r) => r.name.startsWith('live '))
  const families = rows.filter((r) => r.name.startsWith('family '))
  const relations = rows.filter((r) => r.name.startsWith('relation '))
  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Discovery</h1>
        <p className="max-w-3xl text-muted-foreground">
          Every family, every program of one formula and every composition of two, over parameters that fit the hex split
          (one 48-bit, two 24-bit or three 16-bit naturals), with the numbers read live from {receipt.sourcesAgree} of {receipt.sources} public
          sources as inputs. A value reached by two or more families is a cross-formulated solution. Generated {receipt.when}; the
          same run is the MCP tool <code className="font-mono">qpu_discover</code>.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['families', receipt.families],
          ['hex programs run', receipt.runs],
          ['cross-family solutions', receipt.relationsTotal],
          ['fed by live data', receipt.liveRelations],
        ].map(([label, value]) => (
          <Card key={String(label)}>
            <CardHeader className="pb-2">
              <CardDescription>{label}</CardDescription>
              <CardTitle className="font-mono text-3xl">{Number(value).toLocaleString('en')}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Solutions</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">Value</TableHead>
              <TableHead>Families and programs</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {relations.map((r) => {
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
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Live sources</h2>
          <Table>
            <TableBody>
              {live.map((r) => (
                <TableRow key={r.name}>
                  <TableCell className="text-sm">{r.name.replace('live ', '')}</TableCell>
                  <TableCell className="text-right"><Badge variant={r.pass ? 'default' : 'secondary'}>{r.pass ? 'agrees' : 'unreachable'}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Families</h2>
          <Table>
            <TableBody>
              {families.map((r) => (
                <TableRow key={r.name}>
                  <TableCell><Link href={`/${encodeURIComponent(r.name.replace('family ', ''))}`} className="font-mono text-sm text-primary hover:underline">{r.name.replace('family ', '')}</Link></TableCell>
                  <TableCell className="text-right font-mono text-xs text-muted-foreground">{r.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {receipt.unrelated !== 'none' ? <p className="text-xs text-muted-foreground">Reaching no value another family reaches: {receipt.unrelated}</p> : null}
        </div>
      </section>
    </div>
  )
}
