/** The circuit tool asked at /api/mcp, the one door the MCP clients use, so the admin and the shop show what an MCP client
 *  gets. The catalogue answers without a key. */
export const runViaMcp = async (program: unknown): Promise<{ error?: string; outcome?: Record<string, unknown> }> => {
  const res = await fetch('/api/mcp', {
    body: JSON.stringify({ id: 1, jsonrpc: '2.0', method: 'tools/call', params: { arguments: program, name: 'circuit' } }),
    headers: { accept: 'application/json, text/event-stream', 'content-type': 'application/json' },
    method: 'POST',
  })
  const text = await res.text()
  // a streamable HTTP answer is JSON, or an event stream whose last data line is the JSON
  const json = text.trimStart().startsWith('{') ? text : (text.split('\n').filter((l) => l.startsWith('data:')).pop()?.slice(5) ?? '{}')
  const body = JSON.parse(json) as {
    error?: { message?: string }
    result?: { content?: { text?: string }[]; isError?: boolean; structuredContent?: Record<string, unknown> }
  }
  if (body.error) return { error: body.error.message ?? `/api/mcp answered ${res.status}` }
  if (body.result?.isError || !body.result?.structuredContent)
    return { error: body.result?.content?.map((c) => c.text ?? '').join(' ') || `/api/mcp answered ${res.status}` }
  return { outcome: body.result.structuredContent }
}
