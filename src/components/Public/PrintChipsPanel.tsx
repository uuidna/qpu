'use client'

import { useState, useTransition } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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

type Props = { canExecute: boolean; pendingAccess?: boolean }

/**
 * Print ray-layered chips with crypto-imprinted SPDX license.
 * tools/call connector { chips: true } — Unix x required.
 */
export function PrintChipsPanel({ canExecute, pendingAccess }: Props) {
  const [log, setLog] = useState('chips idle · ray layers · crypto imprint · needs mode x')
  const [pending, startTransition] = useTransition()
  const busy = pending || pendingAccess === true

  const print = () => {
    if (!canExecute) {
      setLog('mode x off — cannot tools/call connector { chips: true }')
      return
    }
    startTransition(async () => {
      const reply = await mcpCall({ chips: true, mode: 5, who: 'other' })
      if (reply.error?.message) {
        setLog(`chips: ${reply.error.message}`)
        return
      }
      const body = reply.result as {
        kind?: string
        holds?: boolean
        chips?: { chip: string; layers?: number; licenseVerified?: boolean; holds?: boolean }[]
        license?: { spdx?: string; verified?: boolean; holds?: boolean; signature?: string }
        rays?: { lattice?: { rays?: number; faces?: number; coins?: number } }
        printers?: { address: string; pass?: boolean; value?: number }[]
        wrote?: string[]
        denied?: string
      }
      if (body.denied) {
        setLog(`denied: ${body.denied}`)
        return
      }
      const rays = body.rays?.lattice
      const bits = [
        `kind ${body.kind ?? '—'}`,
        `holds ${String(body.holds)}`,
        rays ? `coins ${rays.coins} · rays ${rays.rays} · faces ${rays.faces}` : null,
        body.license ? `license ${body.license.spdx} verified ${String(body.license.verified)} holds ${String(body.license.holds)}` : null,
        body.chips ? `chips ${body.chips.filter((c) => c.holds).length}/${body.chips.length}` : null,
        body.printers ? `printers pass ${body.printers.filter((p) => p.pass).length}/${body.printers.length}` : null,
        body.wrote ? `wrote ${body.wrote.length}` : null,
        body.license?.signature ? `sig ${body.license.signature.slice(0, 24)}…` : null,
      ].filter(Boolean)
      setLog(bits.join(' · '))
    })
  }

  return (
    <section id="print-chips" className="qpu-panel space-y-4 border p-4" style={{ ['--walk' as string]: 6 }}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-mono text-lg font-semibold">Print chips</h2>
        <Badge variant={canExecute ? 'default' : 'outline'}>{canExecute ? 'x on' : 'x off'}</Badge>
      </div>
      <p className="text-sm text-muted-foreground">
        Ray-layered semiconductor/hardware/firmware blueprints — layers = UUID rays (coins·rays=faces). Crypto-imprinted{' '}
        <code className="font-mono text-xs">CC-BY-NC-ND-4.0</code> via ed25519+HMAC. Printers: publishing.print / printmaking /
        driver.dmaPages.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button type="button" disabled={busy || !canExecute} onClick={print}>
          Print chips {'{ chips: true }'}
        </Button>
      </div>
      <pre className="overflow-x-auto border bg-muted/40 p-3 font-mono text-xs whitespace-pre-wrap">{log}</pre>
    </section>
  )
}
