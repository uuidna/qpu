import type { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { liveOf } from '../_lib/qpu'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Live data checks',
  description: 'Public datasets read live and checked against the unit: CERN Open Data against theorem cern, NIST CODATA against Qpu.Physics, OEIS against the kernel sequences, Zenodo against the release.',
  alternates: { canonical: '/data' },
}

const show = (x: unknown) => (typeof x === 'object' ? JSON.stringify(x) : String(x ?? ''))

export default async function Data() {
  const rows = await liveOf()
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Live data checks</h1>
        <p className="max-w-2xl text-muted-foreground">Read at request time from the public source and compared with what the unit proves or computes. The same check is the MCP tool <code className="font-mono">qpu_data</code>.</p>
      </div>
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
          {rows.map((r) => (
            <TableRow key={r.label}>
              <TableCell className="whitespace-nowrap">{r.result.url ? <a href={r.result.url} className="text-primary hover:underline">{r.label}</a> : r.label}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">{r.checks}</TableCell>
              <TableCell className="max-w-md truncate font-mono text-xs" title={show(r.result.reading)}>{r.result.denied ? `unreachable: ${show(r.result.reading)}` : show(r.result.reading)}</TableCell>
              <TableCell className="text-right">
                <Badge variant={r.result.agrees ? 'default' : r.result.denied ? 'secondary' : 'destructive'}>{r.result.agrees ? 'agrees' : r.result.denied ? 'unreachable' : 'differs'}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
