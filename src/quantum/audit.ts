// The MCP surface audited through the MCP surface: every check below is made by calling `handle` the way a client
// does, so the audit sees exactly what a client sees. A failed check is a lead with its evidence, never a ruling.

import type { Example } from './examples.js'

export type Rpc = { jsonrpc: '2.0'; id?: number | string | null; method: string; params?: unknown }
export type Check = { id: string; passed: boolean; evidence: string }
export type Audit = { total: number; passed: number; failed: number; tools: number; examples: number; leads: number; checks: Check[] }

type Lead = { id: string; status: string; tool?: string; reason?: string }
type ToolSpec = { name: string; description: string; inputSchema: { type?: string; required?: string[]; properties?: Record<string, unknown> } }

/** Audit a handler against the example registry and the leads it serves. Pure: no I/O. */
/** What a screen reader or a braille display needs of a widget, measured on its HTML: a name on every image, a header row on every
 * table, words in every link, a heading to land on. Each miss is named; an empty list is a pass. */
export const accessibilityOf = (html: string): string[] => {
  const misses: string[] = []
  const imgs = html.match(/<img\b[^>]*>/gi) ?? []
  const unnamed = imgs.filter((t) => !/\balt="[^"]+"/i.test(t)).length
  if (unnamed) misses.push(`${unnamed} image(s) without alt text`)
  const tables = html.match(/<table\b[\s\S]*?<\/table>/gi) ?? []
  const unheaded = tables.filter((t) => !/<th\b/i.test(t)).length
  if (unheaded) misses.push(`${unheaded} table(s) without a header cell`)
  const links = html.match(/<a\b[^>]*>[\s\S]*?<\/a>/gi) ?? []
  const wordless = links.filter((a) => !/\baria-label="[^"]+"/i.test(a) && a.replace(/<[^>]*>/g, '').trim() === '').length
  if (wordless) misses.push(`${wordless} link(s) without words`)
  if (!/<h[1-6]\b|role="heading"/i.test(html)) misses.push('no heading to land on')
  return misses
}

export const auditOf = (handle: (m: Rpc) => any, examples: readonly Example[], leads: readonly Lead[]): Audit => {
  const checks: Check[] = []
  const check = (id: string, passed: boolean, evidence: string) => checks.push({ id, passed, evidence })
  const call = (name: string, args: unknown) => handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } })

  const init = handle({ jsonrpc: '2.0', id: 0, method: 'initialize' })
  check('initialize', 'result' in init && typeof init.result?.serverInfo?.version === 'string' && init.result.serverInfo.name === 'qpu', JSON.stringify(init.result?.serverInfo ?? init.error))
  check('license:initialize', 'result' in init && init.result?.serverInfo?.license === 'CC-BY-NC-ND-4.0' && typeof init.result?.instructions === 'string' && init.result.instructions.includes('CC-BY-NC-ND-4.0'), 'serverInfo.license and instructions carry the licence')

  const list = handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' })
  const tools: ToolSpec[] = 'result' in list ? list.result.tools : []
  check('tools/list', tools.length > 0, `${tools.length} tools`)
  const names = new Set(tools.map((t) => t.name))
  for (const t of tools) {
    const schema = t.inputSchema ?? {}
    const props = Object.keys(schema.properties ?? {})
    const required = schema.required ?? []
    const missing = required.filter((r) => !props.includes(r))
    check(`schema:${t.name}`, t.description.length > 0 && schema.type === 'object' && missing.length === 0, missing.length ? `required ${missing.join(', ')} not in properties` : `${props.length} properties, ${required.length} required`)
    const covered = examples.filter((e) => e.tool === t.name)
    check(`covered:${t.name}`, covered.length > 0, covered.length ? `${covered.length} example(s)` : 'no example calls this tool')
  }
  for (const e of examples) {
    check(`example-tool:${e.id}`, names.has(e.tool), names.has(e.tool) ? e.tool : `tool ${e.tool} is not served`)
    if (!names.has(e.tool)) continue
    if (e.tool === 'audit') continue // the self example is evaluated by the caller: it would recurse here
    const reply = call(e.tool, e.arguments)
    if ('error' in reply) { check(`example:${e.id}`, false, `${reply.error.code} ${reply.error.message}`); continue }
    const r = reply.result
    const shape = Array.isArray(r.content) && r.content[0]?.type === 'text' && 'structuredContent' in r && typeof r._meta?.widget === 'string' && r._meta.widget.length > 0
    check(`license:${e.id}`, r._meta?.license?.spdx === 'CC-BY-NC-ND-4.0' && r._meta.widget.includes('data-license="CC-BY-NC-ND-4.0"') && r._meta?.block?.license === 'CC-BY-NC-ND-4.0', r._meta?.license ? 'result, widget and block carry the licence' : 'no licence on the result')
    const a11y = accessibilityOf(r._meta?.widget ?? '')
    check(`accessibility:${e.id}`, a11y.length === 0, a11y.length ? a11y.join('; ') : 'images named, tables headed, links worded, a heading present')
    const why = e.expect(r.structuredContent)
    check(`example:${e.id}`, shape && why === null, why ?? (shape ? e.shows : 'result lacks content, structuredContent or a widget'))
  }
  const ids = new Set<string>()
  const dup = examples.filter((e) => (ids.has(e.id) ? true : (ids.add(e.id), false))).map((e) => e.id)
  check('example-ids-unique', dup.length === 0, dup.length ? `duplicates: ${dup.join(', ')}` : `${examples.length} unique ids`)

  const servedWithoutTool = leads.filter((l) => l.status === 'served' && !(l.tool && names.has(l.tool)))
  check('leads:served-have-tools', servedWithoutTool.length === 0, servedWithoutTool.length ? servedWithoutTool.map((l) => `${l.id}→${l.tool ?? 'none'}`).join(', ') : `${leads.filter((l) => l.status === 'served').length} served leads name a served tool`)
  const unexplained = leads.filter((l) => l.status !== 'served' && !(l.reason && l.reason.length > 0))
  check('leads:others-have-reasons', unexplained.length === 0, unexplained.length ? unexplained.map((l) => l.id).join(', ') : `${leads.length - leads.filter((l) => l.status === 'served').length} non-served leads carry a reason`)

  const unknownTool = call('no-such-tool', {})
  check('error:unknown-tool', 'error' in unknownTool && unknownTool.error.code === -32601, JSON.stringify(unknownTool.error ?? unknownTool.result).slice(0, 80))
  const unknownMethod = handle({ jsonrpc: '2.0', id: 2, method: 'no/such' })
  check('error:unknown-method', 'error' in unknownMethod && unknownMethod.error.code === -32601, JSON.stringify(unknownMethod.error ?? unknownMethod.result).slice(0, 80))
  const badArgs = call('processor', { name: 'Mars' })
  check('error:invalid-params', 'error' in badArgs && badArgs.error.code === -32602, JSON.stringify(badArgs.error ?? badArgs.result).slice(0, 80))

  const passed = checks.filter((c) => c.passed).length
  return { total: checks.length, passed, failed: checks.length - passed, tools: tools.length, examples: examples.length, leads: leads.length, checks }
}
