// Tsvetan Rouschev, @uuidna/qpu, CC-BY-NC-ND-4.0 (https://orcid.org/0009-0000-7312-9778)
// Added to the MIT fork of payloadcms/website (Copyright (c) 2023 Payload); this file is QPU's: see NOTICE.qpu.md.
// A UUID page through Payload's own API: the page is the entry of the call { tool: verify, arguments: { uuid } } in the entries collection —
// read by its content address through the local API (free: nothing computed), created once when absent (the collection's hook computes the result).
// The catch-all hands a single UUID segment to this component. Nothing is fetched from anywhere else; no custom endpoint.
import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { uuidOf } from '@uuidna/qpu/blocks'

type Call = { id: string; result?: { structuredContent?: Record<string, unknown>; _meta?: { widget?: string; theme?: Record<string, string> }; error?: { message: string } } }
export const callOf = async (tool: string, args: Record<string, unknown>, from = 'page'): Promise<Call> => {
  const payload = await getPayload({ config })
  const body = { tool, arguments: args }
  const id = uuidOf(JSON.stringify({ kind: 'call', from, body }))
  // the collection is QPU's own (the generated types of the fork name the site's); the id is the content address of the call
  try { return await payload.findByID({ collection: 'entries' as never, id }) as unknown as Call } catch { /* not yet called: created once below */ }
  return await payload.create({ collection: 'entries' as never, data: { id, kind: 'call', from, body } as never }) as unknown as Call
}

export const QpuPage = async ({ uuid }: { uuid: string }) => {
  const verify = await callOf('verify', { uuid })
  const css = await callOf('css', { uuid })
  const r = verify.result
  if (!r?.structuredContent) return <main><h1>{uuid}</h1><p>{r?.error?.message ?? 'not verified'}</p></main>
  const vars = (css.result?.structuredContent as { vars?: Record<string, string> } | undefined)?.vars ?? {}
  const style = Object.entries(vars).map(([k, v]) => k + ': ' + v).join('; ')
  return (
    <main className="qpu-block" data-block={uuid} data-entry={verify.id} style={{ cssText: style } as React.CSSProperties}>
      <h1>{uuid}</h1>
      <div dangerouslySetInnerHTML={{ __html: r._meta?.widget ?? '' }} />
      <pre>{JSON.stringify(r.structuredContent, null, 1)}</pre>
    </main>
  )
}
