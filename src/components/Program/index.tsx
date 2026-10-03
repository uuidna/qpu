import Link from 'next/link'
import { Fragment } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type Run = { holds?: boolean; value?: unknown; receipt?: string; steps?: { formula: string; args: string[]; value: unknown }[]; error?: string }

/** One run of a hex program: its UUID, value, holds, the steps and the receipt. */
export function RunCard({ uuid, run }: { uuid: string; run: Run }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription className="font-mono break-all">{uuid}</CardDescription>
        <CardTitle className="flex items-center gap-3 font-mono text-3xl">
          {String(run.value ?? '—')}
          <Badge variant={run.holds ? 'default' : 'destructive'}>{run.holds ? 'holds' : 'does not hold'}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {run.error ? <p className="text-sm text-destructive">{run.error}</p> : null}
        {run.steps?.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Step</TableHead>
                <TableHead>Arguments</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {run.steps.map((s, i) => (
                <TableRow key={i}>
                  <TableCell className="font-mono">{s.formula}</TableCell>
                  <TableCell className="font-mono text-muted-foreground">{s.args.join(', ')}</TableCell>
                  <TableCell className="text-right font-mono">{typeof s.value === 'object' ? JSON.stringify(s.value) : String(s.value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : null}
        {run.receipt ? <p className="font-mono text-xs text-muted-foreground">receipt {run.receipt}</p> : null}
        <p className="text-xs text-muted-foreground">
          Permalink <Link href={`/${uuid}`} className="font-mono underline">/{uuid}</Link> · MCP <code className="font-mono">tools/call qpu_hex {'{'} "uuid": "{uuid}" {'}'}</code>
        </p>
      </CardContent>
    </Card>
  )
}

// a program is nested like a doc: each prefix is its parent (family › a › a+b › …), each one-step extension a child
const hrefOf = (family: string, names: string[], raw: string) => `/${encodeURIComponent(family)}${names.length ? `/${names.map(encodeURIComponent).join('+')}` : ''}${raw && names.length ? `?p=${encodeURIComponent(raw)}` : ''}`

export function ProgramView({ family, names, formulas = [], raw, uuid, run, error }: { family: string; names: string[]; formulas?: string[]; raw: string; uuid?: string; run?: Run; error?: string }) {
  const parents = names.map((_, i) => names.slice(0, i + 1))
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link href={hrefOf(family, [], raw)} className="font-mono">{family}</Link></BreadcrumbLink></BreadcrumbItem>
            {parents.map((prefix, i) => (
              <Fragment key={prefix.join('+')}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {i === parents.length - 1 ? <BreadcrumbPage className="font-mono">{prefix.at(-1)}</BreadcrumbPage> : <BreadcrumbLink asChild><Link href={hrefOf(family, prefix, raw)} className="font-mono">{prefix.at(-1)}</Link></BreadcrumbLink>}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="font-mono text-2xl font-semibold tracking-tight">{names.join(' → ')}</h1>
        <p className="text-sm text-muted-foreground">The accumulator starts at the first parameter; each formula takes the accumulator and the remaining parameters up to its arity.</p>
      </div>
      <form className="flex flex-wrap items-end gap-3" method="get">
        <div className="grid gap-1.5">
          <Label htmlFor="p">Parameters (up to three naturals)</Label>
          <Input id="p" name="p" defaultValue={raw} placeholder="e.g. 14,2" className="w-64 font-mono" />
        </div>
        <Button type="submit">Run</Button>
      </form>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {uuid && run ? <RunCard uuid={uuid} run={run} /> : null}
      {formulas.length && names.length < 10 ? (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">Nested one step further</h2>
          <div className="flex flex-wrap gap-2">
            {formulas.map((f) => <Link key={f} href={hrefOf(family, [...names, f], raw)}><Badge variant="outline" className="font-mono">{names.join('+')}+{f}</Badge></Link>)}
          </div>
        </div>
      ) : null}
    </div>
  )
}
