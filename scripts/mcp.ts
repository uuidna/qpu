// The one MCP client every script shares: a tools/call with the user's MCP key (QPU_APP_KEY, never written anywhere) to the app's
// /api/mcp (QPU_APP_MCP, else the local app), the streamed `data:` line read, the plugin's json blocks parsed, a find walked page by page.
// Without a key or an answer it says so and returns nothing: an unread docket is unknown to its caller, never a file fallback.
export const MCP_URL = 'http://localhost:3000/api/mcp'
type Answer = { text: string; error?: undefined } | { text?: undefined; error: string }
export const mcpOf = (url: string = process.env.QPU_APP_MCP ?? MCP_URL, key: string | undefined = process.env.QPU_APP_KEY) => {
  const call = async (tool: string, args: Record<string, unknown>): Promise<Answer> => {
    if (!key) return { error: `no MCP key for ${url} (QPU_APP_KEY)` }
    const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', authorization: `Bearer ${key}` }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: tool, arguments: args } }) }).catch((e: Error) => e)
    if (res instanceof Error) return { error: res.message }
    if (!res.ok) return { error: `HTTP ${res.status}` }
    const raw = await res.text(), json = raw.trimStart().startsWith('{') ? raw : raw.split('\n').filter((l) => l.startsWith('data: ')).map((l) => l.slice(6)).pop() ?? '{}'
    const j = JSON.parse(json) as { result?: { content?: { text: string }[] }; error?: { message: string } }
    return j.error ? { error: j.error.message } : { text: (j.result?.content ?? []).map((c) => c.text).join('\n') }
  }
  const docsOf = (text: string): unknown[] => [...text.matchAll(/```json\n([\s\S]*?)\n```/g)].map((m) => JSON.parse(m[1]!))
  /** every page of a find tool's answer: the documents, or null and why */
  const findAll = async (tool: string, args: Record<string, unknown>): Promise<{ docs: unknown[] | null; says: string }> => {
    const docs: unknown[] = []
    for (let page = 1, pages = 1; page <= pages; page++) {
      const a = await call(tool, { ...args, page })
      if (a.error !== undefined) return { docs: null, says: `unread: ${a.error}` }
      const total = /Page: \d+ of (\d+)/.exec(a.text); if (!total) return { docs: null, says: `unread: ${a.text}` }
      pages = Number(total[1]); docs.push(...docsOf(a.text))
    }
    return { docs, says: `${docs.length} document(s) read through ${tool}` }
  }
  return { url, call, docsOf, findAll }
}
