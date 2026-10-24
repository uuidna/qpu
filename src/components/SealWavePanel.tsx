'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

/** Same order as CLAY_SEALS — client mirror; truth stays in families/clay. */
export const SEAL_NAMES = ['bsd', 'hodge', 'navierStokes', 'pVsNp', 'riemann', 'yangMills'] as const

export type SealWaveRow = {
  i: number
  seal: string
  hex: string | null
  held: number
  agents: number
  involution: string
  involutive: boolean
  values: number[]
  discover?: string
  /** discover.capacity court path when present. */
  path?: string
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

const rowOf = (body: unknown, i: number, fallbackName: string): SealWaveRow => {
  const r = body && typeof body === 'object' ? (body as Record<string, unknown>) : {}
  const held = typeof r.held === 'number' ? r.held : 0
  const agents = typeof r.agents === 'number' ? r.agents : 0
  return {
    i: typeof r.i === 'number' ? r.i : i,
    seal: typeof r.seal === 'string' ? r.seal : typeof r.name === 'string' ? r.name : fallbackName,
    hex: typeof r.hex === 'string' && r.hex ? r.hex : null,
    held,
    agents,
    involution: typeof r.involution === 'string' ? r.involution : held ? `holds on ${held}` : 'none',
    involutive: r.involutive === true || r.holds === true,
    values: Array.isArray(r.values) ? r.values.map(Number).filter(Number.isFinite) : [],
    discover: typeof r.discover === 'string' ? r.discover : 'skipped',
  }
}

type Props = {
  /** Unix execute bit from modeAccessOf — seal-wave is tools/call. */
  canExecute: boolean
  /** Lattice faces bound arity-correct domains (bsd m≤faces∪{15}, etc.). */
  faces: number
  pendingAccess?: boolean
}

/**
 * Inside-out clay console: connector { seal: true } / { pass: i }.
 * Each seal walks its combinatorial domain (not blind 1…faces). Discover capacity-gated.
 */
export function SealWavePanel({ canExecute, faces, pendingAccess }: Props) {
  const [rows, setRows] = useState<SealWaveRow[]>(
    SEAL_NAMES.map((seal, i) => ({
      i,
      seal,
      hex: null,
      held: 0,
      agents: 0,
      involution: 'not run',
      involutive: false,
      values: [],
      discover: 'skipped',
    })),
  )
  const [log, setLog] = useState('seal-wave idle · domain walk · exec needs mode x · connector { pass: i } or { seal: true }')
  const [pending, startTransition] = useTransition()
  const busy = pending || pendingAccess === true

  const runPass = (i: number) => {
    if (!canExecute) {
      setLog(`mode x off — cannot tools/call connector { pass: ${i} }`)
      return
    }
    startTransition(async () => {
      const reply = await mcpCall({ pass: i })
      if (reply.error?.message) {
        setLog(`pass ${i}: ${reply.error.message}`)
        return
      }
      const next = rowOf(reply.result, i, SEAL_NAMES[i]!)
      setRows((prev) => prev.map((r) => (r.i === i ? next : r)))
      setLog(
        `connector { pass: ${i} } · ${next.seal} · ${next.held}/${next.agents} · ${next.involution} · discover ${next.discover ?? 'skipped'}`,
      )
    })
  }

  const runAll = () => {
    if (!canExecute) {
      setLog('mode x off — cannot tools/call connector { seal: true }')
      return
    }
    startTransition(async () => {
      const reply = await mcpCall({ seal: true })
      if (reply.error?.message) {
        setLog(`seal: true: ${reply.error.message}`)
        return
      }
      const body = reply.result && typeof reply.result === 'object' ? (reply.result as { waves?: unknown[] }) : {}
      const waves = Array.isArray(body.waves) ? body.waves : []
      if (waves.length) {
        setRows(SEAL_NAMES.map((seal, i) => rowOf(waves[i] ?? { i, seal }, i, seal)))
      }
      const preview = JSON.stringify(reply.result).slice(0, 320)
      setLog(`connector { seal: true } · ${waves.length || SEAL_NAMES.length} waves · ${preview}${preview.length >= 320 ? '…' : ''}`)
    })
  }

  return (
    <section id="seal-wave" className="qpu-panel space-y-4 border p-4" style={{ ['--walk' as string]: 3 }}>
      <header className="space-y-1">
        <h2 className="font-mono text-xl font-semibold tracking-tight">Seal-wave · clay evidence</h2>
        <p className="text-sm text-muted-foreground">
          Usable path is <code className="font-mono text-xs">claySealWaveOf</code> via connector — combinatorial domains
          (bsd m=3…{faces}∪{'{'}15{'}'}; pVsNp {'{'}0,1{'}'}; others arity-correct). Faces bound = {faces}.
          Full-registry discover only when <code className="font-mono text-xs">discover.capacity</code> court-allows.
        </p>
        <p className="font-mono text-xs text-muted-foreground">
          tools/call connector {'{'} seal: true {'}'} · {'{'} pass: i {'}'} · mode x · goal from combinatorics (connector {'{'} goal: true {'}'})
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant={canExecute ? 'default' : 'outline'} disabled={!canExecute || busy} onClick={runAll}>
          exec · seal: true (0…5)
        </Button>
        {SEAL_NAMES.map((seal, i) => (
          <Button
            key={seal}
            type="button"
            size="sm"
            variant={canExecute ? 'secondary' : 'outline'}
            disabled={!canExecute || busy}
            onClick={() => runPass(i)}
          >
            pass:{i} · {seal}
          </Button>
        ))}
      </div>

      {!canExecute ? (
        <p className="text-sm text-muted-foreground">execute off — set mode digit with x (1/3/5/7) in the chmod console, then seal-wave.</p>
      ) : null}

      <ul className="space-y-2 font-mono text-xs">
        {rows.map((row) => (
          <li key={row.seal} className="flex flex-wrap items-baseline gap-2 border-b border-border/60 pb-2">
            <span className="w-4 text-muted-foreground">{row.i}</span>
            <span className="min-w-[8rem]">{row.seal}</span>
            <span className="text-muted-foreground">
              {row.held}/{row.agents || faces}
            </span>
            <span className="text-muted-foreground">{row.involution}</span>
            {row.involutive ? <Badge>involutive</Badge> : <Badge variant="outline">lead</Badge>}
            {row.hex ? (
              <Link href={`/${row.hex}`} className="text-primary hover:underline break-all">
                {row.hex.slice(0, 13)}…
              </Link>
            ) : (
              <span className="text-muted-foreground">hex —</span>
            )}
            {row.values.length ? <span className="text-muted-foreground">values {row.values.join(',')}</span> : null}
            <span className="text-muted-foreground">discover {row.discover ?? 'skipped'}</span>
          </li>
        ))}
      </ul>

      <pre className="overflow-x-auto border bg-muted/40 p-3 font-mono text-xs whitespace-pre-wrap">{log}</pre>
    </section>
  )
}
