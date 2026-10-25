// Tsvetan Rouschev, @uuidna/qpu, CC-BY-NC-ND-4.0 (https://orcid.org/0009-0000-7312-9778)
// Added to the MIT fork of payloadcms/website (Copyright (c) 2023 Payload); this file is QPU's: see NOTICE.qpu.md.
// The qpu block, rendered by the app from the handler alone: the block names a tool and its arguments, the linked handler computes
// the block here (once per process, by the balancer) and the page carries its widget; nothing is fetched from anywhere. Consolidated:
// no Worker behind the app's pages.
import React from 'react'
import { handle } from '@uuidna/qpu/mcp'

export type QpuBlockProps = { uuid: string; handle: string; program: string; tail: string; tool: string; arguments?: Record<string, unknown> | null; prev?: string | null; next?: string | null; theorem?: string | null; blockType: 'qpu' }

export const QpuBlock: React.FC<QpuBlockProps> = ({ uuid, tool, arguments: args, next, theorem }) => {
  const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: tool, arguments: args ?? {} } }) as { result?: { _meta?: { widget?: string; block?: { meta?: { id?: string } } } }; error?: { message: string } }
  const widget = r.result?._meta?.widget ?? ''
  const note = r.error ? `the handler refused: ${r.error.message}` : r.result?._meta?.block?.meta?.id && r.result._meta.block.meta.id !== uuid ? `the block answered under ${r.result._meta.block.meta.id}, not ${uuid}: a lead` : ''
  return (
    <section data-block={uuid} data-tool={tool} data-theorem={theorem ?? undefined} className="qpu-block">
      {widget ? <div dangerouslySetInnerHTML={{ __html: widget }} /> : <p>{note || 'no widget'}</p>}
      {note && widget ? <small>{note}</small> : null}
      {theorem ? <small>proven by {theorem}</small> : null}
      {next ? <a href={`/${next}`}>next</a> : null}
    </section>
  )
}
