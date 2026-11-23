// One JSON-RPC call to this deployment's /api/mcp as Streamable HTTP asks: the client accepts JSON and an event stream,
// and the answer is the JSON body or the last data line of the stream. A paid call answers in band (_meta x402/error).
export const rpc = async (method: string, params: unknown, endpoint = '/api/mcp') => {
  const res = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }) })
  const text = await res.text()
  return JSON.parse(text.trimStart().startsWith('{') ? text : text.split('\n').filter((line) => line.startsWith('data:')).pop()!.slice(5))
}
