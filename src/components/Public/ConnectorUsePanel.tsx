'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type Route = { args: Record<string, unknown>; does: string }

type ConnectorUse = {
  kind?: string
  call?: string
  thesis?: string
  listed?: {
    doors?: number
    names?: string[]
    bytes?: number
    under16384?: boolean
    qpuPrefixed?: number
    note?: string
  }
  fused?: { names?: string[]; connector?: boolean; note?: string }
  routes?: Route[]
  not?: string[]
  connectBill?: { doors: number; bytes: number; under16384: boolean; qpuPrefixed: number; holds?: boolean }
  goal?: string
  holds?: boolean
  perplexity?: {
    transport?: string
    server_url?: string
    auth?: string
    first_calls?: string[]
  }
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

const previewOf = (body: unknown): string => {
  if (!body || typeof body !== 'object') return String(body)
  const row = body as Record<string, unknown>
  const bits: string[] = []
  if (typeof row.kind === 'string') bits.push(`kind ${row.kind}`)
  if (typeof row.goal === 'string') bits.push(`goal ${row.goal}`)
  if (typeof row.holds === 'boolean') bits.push(`holds ${String(row.holds)}`)
  if (typeof row.call === 'string') bits.push(row.call)
  if (row.connectBill && typeof row.connectBill === 'object') {
    const b = row.connectBill as { doors?: number; bytes?: number }
    bits.push(`bill doors ${b.doors ?? '—'} bytes ${b.bytes ?? '—'}`)
  }
  if (Array.isArray(row.waves)) bits.push(`waves ${row.waves.length}`)
  if (typeof row.count === 'number') bits.push(`count ${row.count}`)
  if (typeof row.path === 'string') bits.push(`path ${row.path}`)
  return bits.length ? bits.join(' · ') : JSON.stringify(body).slice(0, 240)
}

type Props = {
  canRead: boolean
  canExecute: boolean
  pendingAccess?: boolean
}

/**
 * Guided connector app: tools/list bill vs fused routes.
 * Loads { use: true }, then runs each route through tools/call connector.
 */
export function ConnectorUsePanel({ canRead, canExecute, pendingAccess }: Props) {
  const [map, setMap] = useState<ConnectorUse | null>(null)
  const [active, setActive] = useState<string | null>(null)
  const [runLog, setRunLog] = useState('idle · load the agent map, then run a fused route')
  const [pending, startTransition] = useTransition()
  const busy = pending || pendingAccess === true

  const loadMap = () => {
    if (!canRead) {
      setRunLog('mode r off — cannot tools/call connector { use: true }')
      return
    }
    startTransition(async () => {
      const reply = await mcpCall({ use: true })
      if (reply.error?.message) {
        setRunLog(`use: ${reply.error.message}`)
        return
      }
      const body = reply.result as ConnectorUse
      setMap(body)
      setActive('use')
      setRunLog(
        `${body.call ?? 'connector { use: true }'} · listed ${body.listed?.doors ?? '—'} · fused ${body.fused?.names?.length ?? 0} · goal ${body.goal ?? 'OPEN'} · holds ${String(body.holds)}`,
      )
    })
  }

  const runRoute = (route: Route) => {
    const needsExec = !('use' in route.args || 'point' in route.args || 'man' in route.args)
    if (needsExec && !canExecute) {
      setRunLog('mode x off — this route needs execute (digit 1/3/5/7)')
      return
    }
    if (!canRead && !canExecute) {
      setRunLog('mode denies call — set r or x in the chmod console')
      return
    }
    const label = JSON.stringify(route.args)
    startTransition(async () => {
      const reply = await mcpCall(route.args)
      if (reply.error?.message) {
        setRunLog(`${label}: ${reply.error.message}`)
        return
      }
      setActive(label)
      setRunLog(`${label} · ${route.does} · ${previewOf(reply.result)}`)
    })
  }

  return (
    <section id="connector-use" className="qpu-panel space-y-4 border p-4" style={{ ['--walk' as string]: 2 }}>
      <header className="space-y-1">
        <h2 className="font-mono text-xl font-semibold tracking-tight">Connector · agent map</h2>
        <p className="text-sm text-muted-foreground">
          {map?.thesis ??
            'tools/list is the measured connect bill. Fused connector is tools/call by name — not a legal-doc or Drive tool.'}
        </p>
        <p className="font-mono text-xs text-muted-foreground">
          <code className="font-mono text-xs">{'{ use: true }'}</code>
          {' · '}
          {map?.perplexity?.server_url ? (
            <Link href={map.perplexity.server_url} className="text-primary hover:underline">
              {map.perplexity.server_url}
            </Link>
          ) : (
            <Link href="/mcp" className="text-primary hover:underline">
              /mcp
            </Link>
          )}
          {map?.perplexity?.transport ? ` · ${map.perplexity.transport}` : ''}
          {map?.goal ? ` · goal ${map.goal}` : ''}
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant={canRead ? 'default' : 'outline'} disabled={!canRead || busy} onClick={loadMap}>
          load · use: true
        </Button>
        {!canRead ? <Badge variant="outline">needs mode r</Badge> : null}
        {map?.holds === true ? <Badge>holds</Badge> : map ? <Badge variant="outline">lead</Badge> : null}
        {busy ? <Badge variant="secondary">resolving</Badge> : null}
      </div>

      {map?.connectBill ? (
        <p className="font-mono text-xs">
          connect bill doors {map.connectBill.doors} · bytes {map.connectBill.bytes}
          {map.connectBill.under16384 ? ' · &lt;16384' : ' · OVER'}
          {map.connectBill.qpuPrefixed ? ` · qpu_ ${map.connectBill.qpuPrefixed}` : ' · no qpu_'}
          {map.connectBill.holds === true ? <Badge className="ml-2">bill holds</Badge> : null}
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <h3 className="font-mono text-sm font-semibold">Listed (tools/list)</h3>
          <p className="text-xs text-muted-foreground">{map?.listed?.note ?? 'load the map to see the bill'}</p>
          <ul className="grid max-h-40 gap-1 overflow-y-auto font-mono text-xs sm:grid-cols-2">
            {(map?.listed?.names ?? []).map((name) => (
              <li key={name} className="border border-dashed px-2 py-1">
                <Link href={`/${encodeURIComponent(name)}`} className="text-primary hover:underline">
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <h3 className="font-mono text-sm font-semibold">Fused (tools/call by name)</h3>
          <p className="text-xs text-muted-foreground">{map?.fused?.note ?? 'omitted from list so the bill stays lean'}</p>
          <ul className="grid max-h-40 gap-1 overflow-y-auto font-mono text-xs sm:grid-cols-2">
            {(map?.fused?.names ?? []).map((name) => (
              <li key={name} className="border border-dashed px-2 py-1">
                <span className={name === 'connector' ? 'text-primary' : ''}>{name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-mono text-sm font-semibold">Run a fused route</h3>
        <p className="text-xs text-muted-foreground">
          Each button is <code className="font-mono">tools/call connector</code> with that args object. Seal / adapters / court need execute.
        </p>
        <div className="flex flex-wrap gap-2">
          {(map?.routes ?? []).map((route) => {
            const label = Object.keys(route.args)
              .map((k) => `${k}:${JSON.stringify(route.args[k])}`)
              .join(',')
            const needsX = !('use' in route.args || 'point' in route.args || 'man' in route.args)
            const enabled = needsX ? canExecute : canRead
            return (
              <Button
                key={label}
                type="button"
                size="sm"
                variant={active === JSON.stringify(route.args) ? 'default' : enabled ? 'secondary' : 'outline'}
                disabled={!enabled || busy || !map}
                title={route.does}
                onClick={() => runRoute(route)}
              >
                {label}
              </Button>
            )
          })}
        </div>
      </div>

      {map?.not?.length ? (
        <div className="space-y-1">
          <h3 className="font-mono text-sm font-semibold">Not this door</h3>
          <ul className="space-y-1 text-xs text-muted-foreground">
            {map.not.map((row) => (
              <li key={row}>· {row}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {map?.perplexity?.first_calls?.length ? (
        <div className="space-y-1">
          <h3 className="font-mono text-sm font-semibold">First calls (MCP clients)</h3>
          <ol className="list-decimal space-y-1 pl-5 font-mono text-xs text-muted-foreground">
            {map.perplexity.first_calls.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ol>
        </div>
      ) : null}

      <pre className="overflow-x-auto border bg-muted/40 p-3 font-mono text-xs whitespace-pre-wrap">{runLog}</pre>
    </section>
  )
}
