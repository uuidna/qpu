'use client'

import Link from 'next/link'
import { useEffect, useState, useTransition } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SealWavePanel } from '@/components/Public/SealWavePanel'
import { NativeAdaptersPanel } from '@/components/Public/NativeAdaptersPanel'
import { ConnectorUsePanel } from '@/components/Public/ConnectorUsePanel'
import { ObservePanel } from '@/components/Public/ObservePanel'
import { PrintChipsPanel } from '@/components/Public/PrintChipsPanel'

export type AccessDecides = {
  read: boolean
  write: boolean
  execute: boolean
  call: boolean
  buy: boolean
}

export type AccessReading = {
  kind: 'access-mode'
  call: string
  endpoint: string
  thesis: string
  unix: {
    mode: { triad: number; symbolic: string; read: boolean; write: boolean; execute: boolean }
    who: string
    whoIndex: number
  }
  decides: AccessDecides
  formulas: { call: string; hex: string | null; value: number; holds: boolean }[]
  enums: {
    rwx: { value: string; label: string; octal: number; args: Record<string, unknown>; hex: string | null }[]
    ugo: { value: string; label: string; args: Record<string, unknown>; hex: string | null }[]
  }
  holds: boolean
  goal: string
  connectBill?: { doors: number; bytes: number; under16384: boolean; qpuPrefixed: number }
}

export type AccessProduct = {
  slug: string
  enums: readonly string[]
  door: string
  address: string
}

type DoorRow = { name: string; kind: string }

type Props = {
  initial: AccessReading
  doors: DoorRow[]
  products: AccessProduct[]
  /** Lattice faces — seal-wave domain bound (bsd ≤faces∪{15}, arity walks). */
  faces: number
}

type McpReply = { result?: unknown; error?: { message?: string } }

const mcpCall = async (name: string, args: Record<string, unknown>): Promise<McpReply> => {
  const r = await fetch('/mcp', {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: { name, arguments: args },
    }),
  })
  return (await r.json()) as McpReply
}

const asReading = (body: unknown, fallback: AccessReading): AccessReading => {
  if (!body || typeof body !== 'object') return fallback
  const row = body as Partial<AccessReading>
  if (row.kind !== 'access-mode' || !row.decides || !row.unix) return fallback
  return { ...fallback, ...row, decides: row.decides, unix: row.unix } as AccessReading
}

/** chmod-style console: mode digit × ugo decides read/write/execute on sealed doors — connector only, no ACL graph. */
export function AccessPanel({ initial, doors, products, faces }: Props) {
  const [mode, setMode] = useState(initial.unix.mode.triad)
  const [who, setWho] = useState(initial.unix.who)
  const [reading, setReading] = useState(initial)
  const [log, setLog] = useState<string>('connector { access: true } · public r-x until you change mode/who')
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const reply = await mcpCall('connector', { access: true, mode, who })
      if (reply.error?.message) {
        setLog(`connector denied: ${reply.error.message}`)
        return
      }
      const next = asReading(reply.result, reading)
      setReading(next)
      setLog(`${next.call} · ${next.unix.mode.symbolic} as ${next.unix.who} · r=${String(next.decides.read)} w=${String(next.decides.write)} x=${String(next.decides.execute)}`)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-resolve when mode/who change
  }, [mode, who])

  const operate = (label: string, name: string, args: Record<string, unknown>) => {
    if (!reading.decides.call && !reading.decides.execute) {
      setLog(`mode ${reading.unix.mode.symbolic}: execute denied — pick a triad with x (1/3/5/7)`)
      return
    }
    startTransition(async () => {
      const reply = await mcpCall(name, args)
      if (reply.error?.message) {
        setLog(`${label}: ${reply.error.message}`)
        return
      }
      const preview = JSON.stringify(reply.result).slice(0, 280)
      setLog(`${label} via connector/MCP · ${preview}${preview.length >= 280 ? '…' : ''}`)
    })
  }

  const d = reading.decides
  const symbolic = reading.enums.rwx.find((row) => row.octal === mode)?.label ?? reading.unix.mode.symbolic

  return (
    <div className="space-y-8">
    <section id="access" className="qpu-panel space-y-4 border p-4" style={{ ['--walk' as string]: mode }}>
      <header className="space-y-1">
        <h2 className="font-mono text-xl font-semibold tracking-tight">Access · chmod console</h2>
        <p className="text-sm text-muted-foreground">
          {reading.thesis} Mode digit × ugo → <code className="font-mono text-xs">access.*</code> hex. Not an ACL.
        </p>
        <p className="font-mono text-xs text-muted-foreground">
          {reading.call} · <Link href={reading.endpoint} className="text-primary hover:underline">{reading.endpoint}</Link>
          {reading.connectBill ? (
            <span>
              {' · '}doors {reading.connectBill.doors} · bytes {reading.connectBill.bytes}
              {reading.connectBill.under16384 ? '' : ' · over 16384'}
              {reading.connectBill.qpuPrefixed ? ` · qpu_ ${reading.connectBill.qpuPrefixed}` : ' · no qpu_'}
            </span>
          ) : null}
        </p>
      </header>

      <div className="qpu-access-grid grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
        <label className="space-y-1 text-sm">
          <span className="font-mono text-xs text-muted-foreground">mode digit 0…7</span>
          <select
            className="flex h-9 w-full rounded-md border bg-background px-2 font-mono text-sm"
            value={mode}
            onChange={(e) => setMode(Number(e.target.value))}
            aria-label="chmod mode digit"
          >
            {reading.enums.rwx.map((row) => (
              <option key={row.octal} value={row.octal}>
                {row.octal}={row.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-mono text-xs text-muted-foreground">who (ugo+owner)</span>
          <select
            className="flex h-9 w-full rounded-md border bg-background px-2 font-mono text-sm"
            value={who}
            onChange={(e) => setWho(e.target.value)}
            aria-label="access subject"
          >
            {reading.enums.ugo.map((row) => (
              <option key={row.value} value={row.value}>
                {row.label}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-wrap items-end gap-2">
          <Badge className="font-mono">{symbolic}</Badge>
          <Badge variant={d.read ? 'default' : 'outline'} className="font-mono">r {d.read ? 'on' : 'off'}</Badge>
          <Badge variant={d.write ? 'default' : 'outline'} className="font-mono">w {d.write ? 'on' : 'off'}</Badge>
          <Badge variant={d.execute ? 'default' : 'outline'} className="font-mono">x {d.execute ? 'on' : 'off'}</Badge>
          {pending ? <Badge variant="secondary" className="font-mono">resolving</Badge> : null}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-mono text-sm font-semibold">Operate doors</h3>
        <p className="text-xs text-muted-foreground">
          Read browses public paths. Execute runs <code className="font-mono">tools/call</code> through the connector. Write stays bearer-gated — no token invented.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={d.read ? 'default' : 'outline'}
            disabled={!d.read || pending}
            onClick={() => operate('point', 'connector', { point: true })}
          >
            read · point
          </Button>
          <Button
            type="button"
            size="sm"
            variant={d.execute ? 'default' : 'outline'}
            disabled={!d.execute || pending}
            onClick={() => operate('wave', 'connector', { from: 0 })}
          >
            exec · wave from:0
          </Button>
          <Button
            type="button"
            size="sm"
            variant={d.execute ? 'default' : 'outline'}
            disabled={!d.execute || pending}
            onClick={() => operate('seal-wave', 'connector', { seal: true })}
          >
            exec · seal: true
          </Button>
          <Button
            type="button"
            size="sm"
            variant={d.execute ? 'secondary' : 'outline'}
            disabled={!d.execute || pending}
            onClick={() => operate('pass:0', 'connector', { pass: 0 })}
          >
            exec · pass:0
          </Button>
          <Button
            type="button"
            size="sm"
            variant={d.execute ? 'default' : 'outline'}
            disabled={!d.execute || pending}
            onClick={() => operate('access', 'connector', { access: true, mode, who })}
          >
            exec · re-resolve access
          </Button>
          <Button
            type="button"
            size="sm"
            variant={d.read ? 'secondary' : 'outline'}
            disabled={!d.read || pending}
            onClick={() => {
              document.getElementById('connector-use')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              setLog('open #connector-use · load · use: true on the agent map panel')
            }}
            title="Agent map panel: tools/list bill vs fused routes — not legal-doc/Drive"
          >
            read · use: true →
          </Button>
          <Button
            type="button"
            size="sm"
            variant={d.execute ? 'default' : 'outline'}
            disabled={!d.execute || pending}
            onClick={() => operate('goal', 'connector', { goal: true })}
            title="goal.combinations — OPEN|LEAD; not prose document variants"
          >
            exec · goal: true
          </Button>
          <Button
            type="button"
            size="sm"
            variant={d.execute ? 'default' : 'outline'}
            disabled={!d.execute || pending}
            onClick={() => operate('court', 'connector', { court: true })}
          >
            exec · court: true
          </Button>
          <Button
            type="button"
            size="sm"
            variant={d.execute ? 'default' : 'outline'}
            disabled={!d.execute || pending}
            onClick={() => operate('exam', 'connector', { exam: true })}
          >
            exec · exam: true
          </Button>
          <Button
            type="button"
            size="sm"
            variant={d.execute ? 'default' : 'outline'}
            disabled={!d.execute || pending}
            onClick={() => operate('cite', 'cite', {})}
          >
            exec · cite
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!d.write || pending}
            title={d.write ? 'storage writes need Bearer — no token minted here' : 'write bit off'}
            onClick={() => setLog(d.write ? 'write on · storage doors need Authorization: Bearer — not invented on this console' : 'write denied by mode')}
          >
            write · storage (bearer)
          </Button>
        </div>
        {d.read ? (
          <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3 font-mono text-xs">
            {doors.slice(0, 24).map((row) => (
              <li key={`${row.kind}:${row.name}`}>
                <Link href={`/${encodeURIComponent(row.name)}`} className="text-primary hover:underline">
                  {row.name}
                </Link>
                <span className="text-muted-foreground"> · {row.kind}</span>
                {d.execute ? (
                  <button
                    type="button"
                    className="ml-2 text-muted-foreground underline-offset-2 hover:underline disabled:opacity-40"
                    disabled={pending}
                    onClick={() =>
                      operate(
                        row.name,
                        row.name,
                        row.name === 'connector' ? { access: true, mode, who } : {},
                      )
                    }
                  >
                    call
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">read off — door browse denied until mode has r (4–7).</p>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="font-mono text-sm font-semibold">Product access enums</h3>
        <ul className="space-y-1 text-sm">
          {products.map((p) => (
            <li key={p.slug} className="font-mono text-xs">
              <span>{p.slug}</span>
              <span className="text-muted-foreground"> · {p.address} · door {p.door} · enums {p.enums.join(', ')}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="font-mono text-sm font-semibold">Formulas this mode called</h3>
        <ul className="space-y-1 font-mono text-xs">
          {reading.formulas.map((row) => (
            <li key={row.call}>
              {row.hex ? (
                <Link href={`/${row.hex}`} className="text-primary hover:underline">{row.call} = {String(row.value)}</Link>
              ) : (
                <span>{row.call} = {String(row.value)}</span>
              )}
              {row.holds ? <Badge className="ml-2">holds</Badge> : <Badge variant="outline" className="ml-2">lead</Badge>}
            </li>
          ))}
        </ul>
      </div>

      <pre className="overflow-x-auto border bg-muted/40 p-3 font-mono text-xs whitespace-pre-wrap">{log}</pre>
    </section>

    <ConnectorUsePanel canRead={d.read} canExecute={d.execute} pendingAccess={pending} />
    <ObservePanel canRead={d.read} pendingAccess={pending} />
    <SealWavePanel canExecute={d.execute} faces={faces} pendingAccess={pending} />
    <NativeAdaptersPanel canExecute={d.execute} pendingAccess={pending} />
    <PrintChipsPanel canExecute={d.execute} pendingAccess={pending} />
    </div>
  )
}
