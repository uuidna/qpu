'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

/** Circuit vendors that land on qpuServerSubmitOf via connector { vendor, gates|qasm }. */
const CIRCUIT_VENDORS = [
  'qiskit',
  'braket',
  'cirq',
  'openqasm',
  'azure',
  'ionq',
  'rigetti',
  'pennylane',
  'dwave',
  'server',
] as const

type AdapterRow = {
  i: number
  vendor: string
  door: string
  address: string
  hex: string | null
  shapes: string[]
  example: { foreign: string; qpu: string }
  holds: boolean
  price?: PriceView
}

type PriceView = {
  kind?: string
  measure?: number | null
  holds?: boolean
  goal?: string
  ticket?: {
    kind?: string
    minted?: boolean
    address?: string
    hex?: string | null
    vendorIndex?: number | null
    shots?: number | null
  }
  court?: {
    holds?: boolean
    standard?: { value?: number; holds?: boolean }
    fidelity?: { value?: number; holds?: boolean }
  }
  legs?: { address: string; value: number; holds: boolean; hex?: string | null }[]
}

type Catalog = {
  kind?: string
  count?: number
  adapters?: AdapterRow[]
  connectBill?: { doors: number; bytes: number; under16384: boolean; qpuPrefixed: number; holds?: boolean }
  seal?: { call: string; capacity?: { path?: string; allow?: boolean }; note?: string; court?: string }
  goal?: string
  holds?: boolean
  price?: PriceView
}

type JobResult = {
  kind?: string
  vendor?: string
  holds?: boolean
  foreign?: unknown
  result?: { counts?: unknown; index?: number; support?: unknown; holds?: boolean }
  shots?: { asked?: number; qpu?: number }
  seal?: { discover?: string; involutive?: boolean; name?: string; hex?: string | null }
  denied?: string
  price?: PriceView
  connectBill?: Catalog['connectBill']
  dropped?: number
  read?: string
}

type McpReply = { result?: unknown; error?: { message?: string } }

const mcpCall = async (args: Record<string, unknown>): Promise<McpReply> => {
  const r = await fetch('/mcp', {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: { name: 'connector', arguments: args },
    }),
  })
  return (await r.json()) as McpReply
}

const PriceBlock = ({ price, title }: { price?: PriceView | null; title: string }) => {
  if (!price || price.kind !== 'price-relation') return null
  return (
    <div className="space-y-2 border border-dashed p-3">
      <div className="flex flex-wrap items-baseline gap-2 font-mono text-xs">
        <span className="font-semibold">{title}</span>
        {price.holds === true ? <Badge>holds</Badge> : <Badge variant="outline">lead</Badge>}
        {typeof price.measure === 'number' ? <span>measure {price.measure}</span> : null}
        {price.goal ? <span>goal {price.goal}</span> : null}
        {price.court?.standard ? (
          <span>
            court.standard {price.court.standard.value ?? '—'}
            {price.court.holds === true ? ' · court holds' : ''}
          </span>
        ) : null}
      </div>
      {price.ticket ? (
        <p className="font-mono text-xs text-muted-foreground">
          ticket minted {String(price.ticket.minted)} · {price.ticket.address}
          {price.ticket.hex ? (
            <>
              {' · '}
              <Link href={`/${price.ticket.hex}`} className="text-primary hover:underline break-all">
                {price.ticket.hex.slice(0, 18)}…
              </Link>
            </>
          ) : (
            ' · hex —'
          )}
        </p>
      ) : null}
      {price.legs?.length ? (
        <ul className="grid gap-1 sm:grid-cols-2 font-mono text-[10px]">
          {price.legs.slice(0, 8).map((leg) => (
            <li key={`${leg.address}:${leg.value}`}>
              {leg.hex ? (
                <Link href={`/${leg.hex}`} className="text-primary hover:underline">
                  {leg.address}={leg.value}
                </Link>
              ) : (
                <span>
                  {leg.address}={leg.value}
                </span>
              )}
              {leg.holds ? <Badge className="ml-1 scale-90">holds</Badge> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

type Props = {
  canExecute: boolean
  pendingAccess?: boolean
}

/**
 * Native compute console: catalogue adapters, submit Bell / QASM, show priceRelation ticket.
 */
export function NativeAdaptersPanel({ canExecute, pendingAccess }: Props) {
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [job, setJob] = useState<JobResult | null>(null)
  const [vendor, setVendor] = useState<(typeof CIRCUIT_VENDORS)[number]>('qiskit')
  const [shots, setShots] = useState(8)
  const [log, setLog] = useState('idle · list adapters, pick vendor, submit Bell · priceRelationOf on the job')
  const [pending, startTransition] = useTransition()
  const busy = pending || pendingAccess === true

  const loadCatalog = () => {
    startTransition(async () => {
      const reply = await mcpCall({ adapters: true })
      if (reply.error?.message) {
        setLog(`adapters: ${reply.error.message}`)
        return
      }
      const body = reply.result as Catalog
      setCatalog(body)
      setLog(
        `connector { adapters: true } · ${body.count ?? 0} adapters · bill doors ${body.connectBill?.doors} bytes ${body.connectBill?.bytes} · goal ${body.goal ?? 'OPEN'}`,
      )
    })
  }

  const submitBell = () => {
    if (!canExecute) {
      setLog('mode x off — cannot submit native job')
      return
    }
    startTransition(async () => {
      const args: Record<string, unknown> = {
        vendor,
        gates: [
          { name: 'h', q: 0 },
          { name: 'cnot', c: 0, t: 1 },
        ],
        shots,
        seal: true,
        pass: 0,
        mode: 5,
        who: 'other',
      }
      if (vendor === 'openqasm') {
        args.qasm = 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[2];\nh q[0];\ncx q[0],q[1];'
        delete args.gates
      }
      const reply = await mcpCall(args)
      if (reply.error?.message) {
        setLog(`job: ${reply.error.message}`)
        return
      }
      const body = reply.result as JobResult
      setJob(body)
      const ticket = body.price?.ticket?.hex?.slice(0, 13) ?? '—'
      setLog(
        `connector { vendor:'${vendor}', shots:${shots} } · holds ${String(body.holds)} · qpu shots ${body.shots?.qpu ?? '—'} · ticket ${ticket}… · seal ${body.seal?.discover ?? 'skipped'}`,
      )
    })
  }

  return (
    <section id="native-adapters" className="qpu-panel space-y-4 border p-4" style={{ ['--walk' as string]: 5 }}>
      <header className="space-y-1">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-mono text-xl font-semibold tracking-tight">Native compute · job console</h2>
          <p className="font-mono text-xs text-muted-foreground">
            <Link href="/api/qpu/native" className="text-primary hover:underline">
              /api/qpu/native
            </Link>
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Foreign circuit shapes → <code className="font-mono text-xs">qpuServerSubmitOf</code> through the connector.
          Price is <code className="font-mono text-xs">priceRelationOf</code> (formulated ticket, not a cloud dollar SKU).
        </p>
      </header>

      <div className="flex flex-wrap items-end gap-2">
        <Button type="button" size="sm" variant="outline" disabled={busy} onClick={loadCatalog}>
          List adapters
        </Button>
        <label className="space-y-1 text-xs">
          <span className="font-mono text-muted-foreground">vendor</span>
          <select
            className="flex h-8 rounded border bg-background px-2 font-mono text-xs"
            value={vendor}
            disabled={busy}
            onChange={(e) => setVendor(e.target.value as (typeof CIRCUIT_VENDORS)[number])}
            aria-label="native vendor"
          >
            {CIRCUIT_VENDORS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-xs">
          <span className="font-mono text-muted-foreground">shots</span>
          <input
            type="number"
            min={0}
            max={1024}
            className="flex h-8 w-20 rounded border bg-background px-2 font-mono text-xs"
            value={shots}
            disabled={busy}
            onChange={(e) => setShots(Math.max(0, Math.min(1024, Number(e.target.value) || 0)))}
            aria-label="shots"
          />
        </label>
        <Button type="button" size="sm" disabled={busy || !canExecute} onClick={submitBell}>
          Submit Bell ({vendor})
        </Button>
        {!canExecute ? <Badge variant="outline">needs mode x</Badge> : null}
        {busy ? <Badge variant="secondary">resolving</Badge> : null}
      </div>

      <p className="font-mono text-xs text-muted-foreground">{log}</p>

      {catalog?.connectBill ? (
        <p className="font-mono text-xs">
          connect bill doors {catalog.connectBill.doors} · bytes {catalog.connectBill.bytes}
          {catalog.connectBill.under16384 ? ' · &lt;16384' : ' · OVER'}
          {catalog.connectBill.qpuPrefixed ? ` · qpu_ ${catalog.connectBill.qpuPrefixed}` : ' · no qpu_'}
          {catalog.holds === true ? <Badge className="ml-2">holds</Badge> : <Badge variant="outline" className="ml-2">lead</Badge>}
        </p>
      ) : null}

      <PriceBlock price={catalog?.price} title="catalog priceRelation" />

      {catalog?.adapters?.length ? (
        <ul className="grid max-h-56 gap-1 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3 text-xs font-mono">
          {catalog.adapters.map((a) => (
            <li key={a.vendor} className="border border-dashed p-2">
              <button
                type="button"
                className="text-left text-primary hover:underline disabled:opacity-40"
                disabled={busy || !CIRCUIT_VENDORS.includes(a.vendor as (typeof CIRCUIT_VENDORS)[number])}
                onClick={() => {
                  if (CIRCUIT_VENDORS.includes(a.vendor as (typeof CIRCUIT_VENDORS)[number])) {
                    setVendor(a.vendor as (typeof CIRCUIT_VENDORS)[number])
                  }
                }}
              >
                {a.i}:{a.vendor}
              </button>
              <span className="block text-muted-foreground">
                {a.door} · {a.address}
              </span>
              <span className="block text-muted-foreground">{a.shapes.join('·')}</span>
              {a.price?.ticket?.hex ? (
                <Link href={`/${a.price.ticket.hex}`} className="block text-muted-foreground hover:underline">
                  ticket {a.price.ticket.hex.slice(0, 13)}…
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      <PriceBlock price={job?.price} title="job priceRelation" />

      {job?.result ? (
        <div className="space-y-1 font-mono text-xs">
          <p>
            result index {String(job.result.index ?? '—')} · holds {String(job.result.holds)}
            {typeof job.dropped === 'number' ? ` · dropped ${job.dropped}` : ''}
            {job.read ? ` · read ${job.read}` : ''}
            {job.seal?.name ? ` · seal ${job.seal.name}` : ''}
          </p>
          {job.result.counts ? (
            <pre className="max-h-32 overflow-auto border bg-muted/30 p-2 text-[10px] leading-relaxed">
              {JSON.stringify(job.result.counts, null, 2)}
            </pre>
          ) : null}
        </div>
      ) : null}

      {job?.foreign ? (
        <pre className="max-h-40 overflow-auto rounded border bg-muted/30 p-2 font-mono text-[10px] leading-relaxed">
          {JSON.stringify(job.foreign, null, 2)}
        </pre>
      ) : null}
      {job?.denied ? <p className="text-sm text-destructive">denied {job.denied}</p> : null}
    </section>
  )
}
