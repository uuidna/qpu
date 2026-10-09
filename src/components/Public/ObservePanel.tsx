'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type Verbosity = 0 | 1 | 2 | 3

type ObserveReading = {
  kind?: string
  call?: string
  verbosity?: Verbosity
  cap?: number
  levels?: { level: Verbosity; keeps: string }[]
  connectBill?: { doors: number; bytes: number; under16384: boolean; qpuPrefixed: number; holds?: boolean }
  receipts?: {
    file: string
    name: string
    kind: string | null
    holds: boolean | null
    seconds: number | null
    observability: Record<string, unknown>
  }[]
  formulas?: Record<string, { address?: string; hex?: string | null; value?: number; holds?: boolean }>
  usage?: { target?: { who?: string; door?: string; tool?: string; panel?: string }; bytes?: number; llmTokens?: number; sealed?: boolean }[]
  tokenSeal?: { sealed?: boolean; note?: string }
  holds?: boolean
  goal?: string
  note?: string
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

type Props = { canRead: boolean; pendingAccess?: boolean }

/**
 * Receipt observability console — tools/call connector { observe: true, verbosity }.
 * Registered on the public surface; Unix r required.
 */
export function ObservePanel({ canRead, pendingAccess }: Props) {
  const [verbosity, setVerbosity] = useState<Verbosity>(2)
  const [reading, setReading] = useState<ObserveReading | null>(null)
  const [log, setLog] = useState('observe idle · receipt sampling/signal/slo · needs mode r')
  const [pending, startTransition] = useTransition()
  const busy = pending || pendingAccess === true

  const load = (level: Verbosity = verbosity) => {
    if (!canRead) {
      setLog('mode r off — cannot tools/call connector { observe: true }')
      return
    }
    startTransition(async () => {
      const reply = await mcpCall({ observe: true, verbosity: level })
      if (reply.error?.message) {
        setLog(`observe: ${reply.error.message}`)
        return
      }
      const body = reply.result as ObserveReading
      setReading(body)
      setVerbosity(level)
      const n = body.receipts?.length ?? 0
      const bill = body.connectBill
      const sealed = body.tokenSeal?.sealed === true
      const usageN = body.usage?.length ?? 0
      setLog(
        `${body.call ?? 'connector { observe: true }'} · v${body.verbosity ?? level} · receipts ${n} · usage ${usageN} · sealed ${String(sealed)} · goal ${body.goal ?? 'OPEN'} · holds ${String(body.holds)}${
          bill ? ` · bill doors ${bill.doors} bytes ${bill.bytes}` : ''
        }`,
      )
    })
  }

  return (
    <section id="observe" className="qpu-panel space-y-4 border p-4" style={{ ['--walk' as string]: 3 }}>
      <header className="space-y-1">
        <h2 className="font-mono text-xl font-semibold tracking-tight">Observe · receipts</h2>
        <p className="text-sm text-muted-foreground">
          {reading?.note ??
            'Formulated observability on committed receipts — sampling / signal / slo; verbosity fused on connector.'}
        </p>
        <p className="font-mono text-xs text-muted-foreground">
          <code className="font-mono text-xs">{'{ observe: true, verbosity: 0..3 }'}</code>
          {' · '}
          <Link href="/api/qpu/observe" className="text-primary hover:underline">
            /api/qpu/observe
          </Link>
          {reading?.goal ? ` · goal ${reading.goal}` : ''}
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" size="sm" variant={canRead ? 'default' : 'outline'} disabled={!canRead || busy} onClick={() => load()}>
          load · observe
        </Button>
        {([0, 1, 2, 3] as const).map((v) => (
          <Button
            key={v}
            type="button"
            size="sm"
            variant={verbosity === v ? 'default' : 'secondary'}
            disabled={!canRead || busy}
            title={reading?.levels?.find((l) => l.level === v)?.keeps ?? `verbosity ${v}`}
            onClick={() => load(v)}
          >
            v{v}
          </Button>
        ))}
        {!canRead ? <Badge variant="outline">needs mode r</Badge> : null}
        {reading?.holds === true ? <Badge>holds</Badge> : reading ? <Badge variant="outline">lead</Badge> : null}
        {busy ? <Badge variant="secondary">resolving</Badge> : null}
      </div>

      {reading?.formulas ? (
        <ul className="space-y-1 font-mono text-xs">
          {Object.entries(reading.formulas).map(([k, row]) => (
            <li key={k}>
              {row.hex ? (
                <Link href={`/${row.hex}`} className="text-primary hover:underline">
                  {row.address ?? k} = {String(row.value)}
                </Link>
              ) : (
                <span>
                  {row.address ?? k} = {String(row.value)}
                </span>
              )}
              {row.holds ? <Badge className="ml-2">holds</Badge> : <Badge variant="outline" className="ml-2">lead</Badge>}
            </li>
          ))}
        </ul>
      ) : null}

      {reading?.usage?.length ? (
        <div className="space-y-2">
          <h3 className="font-mono text-sm font-semibold">
            Token usage ({reading.usage.length})
            {reading.tokenSeal?.sealed === true ? <Badge className="ml-2">sealed</Badge> : null}
          </h3>
          <ul className="grid max-h-40 gap-1 overflow-y-auto font-mono text-xs sm:grid-cols-2">
            {reading.usage.map((u, i) => (
              <li key={`${u.target?.who ?? i}`} className="border border-dashed px-2 py-1">
                <span>{u.target?.who ?? '—'}</span>
                {typeof u.llmTokens === 'number' ? <span className="ml-2 text-muted-foreground">{u.llmTokens} tok</span> : null}
                {typeof u.bytes === 'number' ? <span className="ml-2 text-muted-foreground">{u.bytes}B</span> : null}
                {u.sealed === true ? <Badge className="ml-2">ok</Badge> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {reading?.receipts?.length ? (
        <div className="space-y-2">
          <h3 className="font-mono text-sm font-semibold">Receipts ({reading.receipts.length})</h3>
          <ul className="grid max-h-56 gap-1 overflow-y-auto font-mono text-xs sm:grid-cols-2">
            {reading.receipts.map((r) => (
              <li key={r.file} className="border border-dashed px-2 py-1">
                <span className="text-muted-foreground">{r.name}</span>
                {r.holds === true ? <Badge className="ml-2">holds</Badge> : r.holds === false ? <Badge variant="outline" className="ml-2">lead</Badge> : null}
                {typeof r.seconds === 'number' ? <span className="ml-2 text-muted-foreground">{r.seconds}s</span> : null}
                {typeof r.observability.ms === 'number' ? <span className="ml-2">ms {r.observability.ms}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <pre className="overflow-x-auto border bg-muted/40 p-3 font-mono text-xs whitespace-pre-wrap">{log}</pre>
    </section>
  )
}
