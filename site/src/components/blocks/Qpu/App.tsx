// Tsvetan Rouschev, @uuidna/qpu, CC-BY-NC-ND-4.0 (https://orcid.org/0009-0000-7312-9778)
// Added to the MIT fork of payloadcms/website (Copyright (c) 2023 Payload); this file is QPU's: see NOTICE.qpu.md.
'use client'
// The host of an MCP App: the tool's ui:// resource read over the MCP endpoint (resources/read), hosted in a sandboxed frame and spoken to
// through the MCP Apps protocol (ui/initialize → initialized, tool-input, tool-result, size-changed). The UI is built from the MCP; nothing is drawn here.
import React, { useEffect, useRef, useState } from 'react'

// html: the resource already read by the server (the app reads it from the handler in its own runtime); else it is read over mcp with the key the MCP plugin takes (Authorization: Bearer <payload-mcp-api-keys key>, measured on 3.90.1)
export type QpuAppProps = { tool: string; args: Record<string, unknown>; result: unknown; html?: string; mcp?: string; apiKey?: string }
export const QpuApp: React.FC<QpuAppProps> = ({ tool, args, result, html: given, mcp = '/api/mcp', apiKey }) => {
  const frame = useRef<HTMLIFrameElement>(null)
  const [html, setHtml] = useState('') // mounted only once the listener below is registered: the view's ui/initialize must not race the host (measured)
  const [height, setHeight] = useState(120)
  const ready = useRef(false)
  // plain data only: a framework proxy cannot be cloned across the frame, so every message is the JSON of itself
  const post = (m: Record<string, unknown>) => frame.current?.contentWindow?.postMessage(JSON.parse(JSON.stringify({ jsonrpc: '2.0', ...m })), '*')
  const tell = () => { if (!ready.current) return; post({ method: 'ui/notifications/tool-input', params: { arguments: args } }); post({ method: 'ui/notifications/tool-result', params: result }) }
  useEffect(() => {
    ready.current = false
    if (given !== undefined) { setTimeout(() => setHtml(given), 0); return }
    fetch(mcp, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', ...(apiKey ? { authorization: 'Bearer ' + apiKey } : {}) }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'resources/read', params: { uri: 'ui://qpu/' + tool } }) })
      .then((r) => r.text()).then((t) => { const line = t.split('\n').find((l) => l.startsWith('{') || l.startsWith('data: ')) ?? t; const j = JSON.parse(line.replace(/^data: /, '')); setHtml(j.result?.contents?.[0]?.text ?? '') }).catch(() => setHtml(''))
  }, [tool, mcp, given, apiKey])
  useEffect(() => { tell() }, [result])
  useEffect(() => {
    const on = (e: MessageEvent) => {
      if (!frame.current || e.source !== frame.current.contentWindow) return
      const m = e.data ?? {}
      if (m.method === 'ui/initialize') { post({ id: m.id, result: { protocolVersion: '2026-01-26', hostCapabilities: {}, hostContext: { displayMode: 'inline' } } }); return }
      if (m.method === 'ui/notifications/initialized') { ready.current = true; tell(); return }
      if (m.method === 'ui/notifications/size-changed' && typeof m.params?.height === 'number') setHeight(Math.max(40, Math.min(2400, m.params.height + 8)))
    }
    window.addEventListener('message', on)
    return () => window.removeEventListener('message', on)
  })
  return <iframe ref={frame} srcDoc={html} sandbox="allow-scripts" title={'qpu · ' + tool} style={{ width: '100%', height, border: '0.5px solid var(--color-border-primary, #e4e4e7)', borderRadius: 8, background: 'transparent' }} />
}
