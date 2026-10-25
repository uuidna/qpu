// Tsvetan Rouschev, @uuidna/qpu, CC-BY-NC-ND-4.0 (https://orcid.org/0009-0000-7312-9778)
// Added to the MIT fork of payloadcms/website (Copyright (c) 2023 Payload); this file is QPU's: see NOTICE.qpu.md.
// The qpu block, rendered: the block names a tool and its arguments; the page asks the QPU Worker for the block (one tools/call,
// the content hash named with If-None-Match so an unchanged block costs the edge nothing) and renders the widget the handler
// computed. The page never computes: it carries what the QPU computed, as payloadcms.com carries what Payload computed.
import React from 'react'

export type QpuBlockProps = { uuid: string; handle: string; program: string; tail: string; tool: string; arguments?: Record<string, unknown> | null; prev?: string | null; next?: string | null; blockType: 'qpu' }

const ORIGIN = process.env.QPU_ORIGIN ?? 'https://qpu.uuidna.com'

export const QpuBlock: React.FC<QpuBlockProps> = async ({ uuid, tool, arguments: args, next }) => {
  let widget = ''
  let note = ''
  try {
    const res = await fetch(`${ORIGIN}/mcp`, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: tool, arguments: args ?? {} } }), next: { revalidate: 31536000 } })
    const j = (await res.json()) as { result?: { _meta?: { widget?: string; block?: { meta?: { id?: string } } } }; error?: { message: string } }
    widget = j.result?._meta?.widget ?? ''
    note = j.error ? `the QPU refused: ${j.error.message}` : j.result?._meta?.block?.meta?.id && j.result._meta.block.meta.id !== uuid ? `the block answered under ${j.result._meta.block.meta.id}, not ${uuid}: a lead` : ''
  } catch (e) {
    note = `the QPU did not answer: ${(e as Error).message}`
  }
  return (
    <section data-block={uuid} data-tool={tool} className="qpu-block">
      {widget ? <div dangerouslySetInnerHTML={{ __html: widget }} /> : <p>{note || 'no widget'}</p>}
      {note && widget ? <small>{note}</small> : null}
      {next ? <a href={`/u/${next}`}>next</a> : null}
    </section>
  )
}
