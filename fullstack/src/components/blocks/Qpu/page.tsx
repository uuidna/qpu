// Tsvetan Rouschev, @uuidna/qpu, CC-BY-NC-ND-4.0 (https://orcid.org/0009-0000-7312-9778)
// Added to the MIT fork of payloadcms/website (Copyright (c) 2023 Payload); this file is QPU's: see NOTICE.qpu.md.
// A UUID page, rendered by the app from the handler alone: the address verified, its channel, vortex, reflection and theme laid out
// as the Worker lays them out; nothing is fetched from anywhere. The catch-all hands a single UUID segment to this component.
import React from 'react'
import { handle } from '@uuidna/qpu/mcp'

export const QpuPage: React.FC<{ uuid: string }> = ({ uuid }) => {
  const verify = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'verify', arguments: { uuid } } }) as { result?: { structuredContent: Record<string, unknown>; _meta: { widget: string; theme?: Record<string, string> } }; error?: { message: string } }
  const css = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'css', arguments: { uuid } } }) as { result?: { structuredContent: { vars: Record<string, string> } } }
  if (!verify.result) return <main><h1>{uuid}</h1><p>{verify.error?.message ?? 'not verified'}</p></main>
  const style = Object.entries(css.result?.structuredContent.vars ?? {}).map(([k, v]) => `${k}: ${v}`).join('; ')
  return (
    <main className="qpu-block" data-block={uuid} style={{ cssText: style } as React.CSSProperties}>
      <h1>{uuid}</h1>
      <div dangerouslySetInnerHTML={{ __html: verify.result._meta.widget }} />
      <pre>{JSON.stringify(verify.result.structuredContent, null, 1)}</pre>
    </main>
  )
}
