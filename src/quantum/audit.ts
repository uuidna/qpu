// The MCP surface audited through the MCP surface: every check below is made by calling `handle` the way a client
// does, so the audit sees exactly what a client sees. A failed check is a lead with its evidence, never a ruling.

import type { Example } from './examples.js'

export type Rpc = { jsonrpc: '2.0'; id?: number | string | null; method: string; params?: unknown }
import { THEOREMS, THEOREM_KEYS } from './theorems-index.js'

export type Check = { id: string; passed: boolean; evidence: string; /** milliseconds since the previous check: where the audit's time goes */ ms?: number }
export type Audit = { /** the eight slowest checks, with their milliseconds: where the audit's time goes */ slowest: string[]; total: number; passed: number; failed: number; tools: number; examples: number; leads: number; checks: Check[] }

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
  const links: string[] = html.match(/<a\b[^>]*>[\s\S]*?<\/a>/gi) ?? []
  const wordless = links.filter((a) => !/\baria-label="[^"]+"/i.test(a) && a.replace(/<[^>]*>/g, '').trim() === '').length
  if (wordless) misses.push(`${wordless} link(s) without words`)
  if (!/<h[1-6]\b|role="heading"/i.test(html)) misses.push('no heading to land on')
  return misses
}

export const auditOf = (handle: (m: Rpc) => any, examples: readonly Example[], leads: readonly Lead[], toolboxes: readonly { name: string; tools: { name: string }[]; skill: { selftest: (ctx: { handle: (m: Rpc) => any; examples: any; leads: any }) => { passed: boolean; checks: Check[] } } }[] = []): Audit => {
  const checks: Check[] = []
  let clock = Date.now()
  const check = (id: string, passed: boolean, evidence: string) => { const now = Date.now(); checks.push({ id, passed, evidence, ms: now - clock }); clock = now }
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
    const w: string = r._meta?.widget ?? ''
    check(`css-vars:${e.id}`, w.includes('class="qpu-block"') && w.includes('--qpu-accent:') && w.includes('--qpu-angle:') && w.includes('--qpu-period:') && !/style="[^"]*#[0-9a-f]{3,6}\b/i.test(w), 'the block root carries its UUID\'s custom properties and no hex colour; the stylesheet draws it')
    const a11y = accessibilityOf(w)
    check(`accessibility:${e.id}`, a11y.length === 0, a11y.length ? a11y.join('; ') : 'images named, tables headed, links worded, a heading present')
    const why = e.expect(r.structuredContent)
    check(`example:${e.id}`, shape && why === null, why ?? (shape ? e.shows : 'result lacks content, structuredContent or a widget'))
  }
  // Toolboxes: every tool names one the host composes, every toolbox tests itself in its directions, every check is recorded.
  if (toolboxes.length) {
    const named = new Map(toolboxes.flatMap((b) => b.tools.map((t) => [t.name, b.name] as const)))
    for (const t of tools) { const meta = (t as { _meta?: { toolbox?: string } })._meta; check(`toolbox:${t.name}`, typeof meta?.toolbox === 'string' && named.get(t.name) === meta.toolbox, meta?.toolbox ? `in ${meta.toolbox}` : 'names no toolbox') }
    for (const b of toolboxes) {
      try { const r = b.skill.selftest({ handle, examples, leads }); for (const c of r.checks) { check(`selftest:${b.name}:${c.id}`, c.passed, c.evidence); if (c.ms !== undefined) checks.at(-1)!.ms = c.ms } check(`selftest:${b.name}`, r.passed, `${r.checks.filter((c) => c.passed).length} of ${r.checks.length} checks pass`) }
      catch (e) { check(`selftest:${b.name}`, false, `threw: ${(e as Error).message.slice(0, 160)}`) }
    }
  }
  const backed = examples.filter((e) => e.theorem)
  for (const e of backed) check(`theorem-exists:${e.id}`, THEOREM_KEYS.has(e.theorem!), THEOREM_KEYS.has(e.theorem!) ? `${e.theorem} is kernel-accepted (${THEOREMS.find((t) => t.key === e.theorem)?.statement.slice(0, 80)})` : `${e.theorem} is not among the ${THEOREMS.length} hand-written theorems the kernel accepted: a fabricated citation`)
  check('examples-backed-by-theorems', true, `${backed.length} of ${examples.length} examples name the theorem that makes them true (${backed.map((e) => `${e.id}→${e.theorem}`).join(', ') || 'none'}); the rest are the textbook, respected, each a lead for a theorem`)
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
  return { slowest: [...checks].sort((a, b) => (b.ms ?? 0) - (a.ms ?? 0)).slice(0, 8).map((c) => `${c.id} ${c.ms} ms`), total: checks.length, passed, failed: checks.length - passed, tools: tools.length, examples: examples.length, leads: leads.length, checks }
}
