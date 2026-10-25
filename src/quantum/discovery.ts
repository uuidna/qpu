// Discovery before use, as a pure toolbox: the handler says what to fetch (the contracts of every host this tree talks to), the
// client fetches it, and the handler reads what came back into doors and capabilities. No I/O here; the client's own MCP
// fetches. An MCP host is asked for tools/list and, where it serves one, its catalogue door; an API host for the OpenAPI,
// index or identify document the verifiers registry names; both domains for /.well-known/qpu.json.
import type { Verifier } from './verifiers.js'

export type Purpose = 'mcp-list' | 'catalogue' | 'contract' | 'well-known' | 'api-contract'
export type Request = { id: string; method: 'GET' | 'POST'; url: string; body?: unknown; purpose: Purpose; host: string; name?: string }
export type Answer = Request & { status: number; type: string; text: string }
export type Door = { name: string; description: string; takes: string[]; required: string[]; answers: string[]; readOnly: boolean | null; contract: 'tools/list' | 'catalogue' }
export type Host = { host: string; kind: 'mcp' | 'api' | 'well-known'; contract: string; status: number; detected: string; note: string; doors?: Door[]; paths?: string[] }
export type Discovery = { hosts: Host[]; doors: (Door & { host: string; url: string })[]; capabilities: { statementVerdict: string[]; signing: string[]; readiness: string[]; addressing: string[]; rbac: string[] }; leads: { id: string; source: string; statement: string; status: 'open'; reason: string }[] }

/** What a client can fill from a theorem, a statement or a value, and what an answer may carry. */
export const TAKES = ['statement', 'claim', 'input', 'deposits', 'proof', 'key', 'theorems', 'message', 'q', 'query', 'text', 'value', 'sources', 'subject', 'token', 'tenant'] as const
export const ANSWERS = ['verdict', 'receipt', 'deposited', 'sealed', 'signed', 'verified', 'proofRoot', 'ready', 'address', 'role'] as const

const rpcBody = (method: string, params?: unknown) => ({ jsonrpc: '2.0', id: 1, method, params })
const idOf = (purpose: Purpose, host: string, name?: string) => `${purpose}:${host}${name ? `:${name}` : ''}`

/** The first wave: every host's contract address. */
export const discoveryRequestsOf = (mcpHosts: readonly string[], verifiers: readonly Verifier[]): Request[] => {
  const out: Request[] = []
  for (const url of mcpHosts) {
    const host = new URL(url).host
    out.push({ id: idOf('mcp-list', host), method: 'POST', url, body: rpcBody('tools/list'), purpose: 'mcp-list', host })
    out.push({ id: idOf('catalogue', host), method: 'POST', url, body: rpcBody('tools/call', { name: 'list_tools', arguments: {} }), purpose: 'catalogue', host })
    out.push({ id: idOf('well-known', host), method: 'GET', url: `https://${host}/.well-known/qpu.json`, purpose: 'well-known', host })
  }
  for (const v of verifiers) if (v.contract) out.push({ id: idOf('api-contract', new URL(v.contract).host, v.id), method: 'GET', url: v.contract, purpose: 'api-contract', host: new URL(v.contract).host, name: v.id })
  return out
}

/** A JSON-RPC answer read: the result, or the error text. */
const resultOf = (a: Answer): { result?: any; error?: string } => {
  if (a.status !== 200) return { error: a.status === 0 ? a.text.slice(0, 120) : `HTTP ${a.status}` }
  try {
    const j = JSON.parse(a.text) as { result?: { tools?: unknown[]; structuredContent?: unknown; content?: { text: string }[]; isError?: boolean }; error?: { message: string } }
    if (j.error) return { error: j.error.message }
    if (j.result?.isError) return { error: j.result.content?.[0]?.text ?? 'refused' }
    if (j.result?.tools) return { result: j.result }
    if (j.result?.structuredContent !== undefined) return { result: j.result.structuredContent }
    if (j.result?.content?.[0]) { try { return { result: JSON.parse(j.result.content[0].text) } } catch { return { result: j.result.content[0].text } } }
    return { result: j.result }
  } catch { return { error: `not JSON: ${a.text.slice(0, 80)}` } }
}

/** A door's capability from its contract: the properties it takes (of the ones a client can fill) and the keys it answers. */
export const doorOf = (t: { name: string; description?: string; inputSchema?: { properties?: Record<string, unknown>; required?: string[] }; outputSchema?: { properties?: Record<string, unknown> }; annotations?: { readOnlyHint?: boolean } }, contract: Door['contract']): Door => {
  const props = Object.keys(t.inputSchema?.properties ?? {})
  const outKeys = Object.keys(t.outputSchema?.properties ?? {})
  const fromText = (/Returns \{([^}]*)\}/.exec(t.description ?? '')?.[1] ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  const answers = [...new Set([...outKeys, ...fromText])].filter((k) => (ANSWERS as readonly string[]).includes(k))
  return { name: t.name, description: (t.description ?? '').slice(0, 200), takes: props.filter((p) => (TAKES as readonly string[]).includes(p)), required: t.inputSchema?.required ?? [], answers, readOnly: t.annotations?.readOnlyHint ?? null, contract }
}

/** The second wave: the contract of every catalogue door that answers a verdict and is not in tools/list, not yet read. */
export const followUpsOf = (answers: readonly Answer[]): Request[] => {
  const done = new Set(answers.map((a) => a.id))
  const out: Request[] = []
  for (const a of answers.filter((x) => x.purpose === 'catalogue')) {
    const r = resultOf(a); if (!r.result) continue
    const names = (Array.isArray(r.result) ? r.result : r.result.tools ?? []) as { name: string; description: string }[]
    const listed = new Set<string>((resultOf(answers.find((x) => x.id === idOf('mcp-list', a.host)) ?? a).result?.tools ?? []).map((t: { name: string }) => t.name))
    for (const t of names) {
      if (listed.has(t.name) || !doorOf({ name: t.name, description: t.description }, 'catalogue').answers.length) continue
      const id = idOf('contract', a.host, t.name)
      if (!done.has(id)) out.push({ id, method: 'POST', url: a.url, body: rpcBody('tools/call', { name: 'list_tools', arguments: { name: t.name } }), purpose: 'contract', host: a.host, name: t.name })
    }
  }
  return out
}

/** Which document a host answered with: an OpenAPI or Swagger file (and its paths), a JSON index, an OAI identify, a page, nothing. */
export const detect = (r: { status: number; type: string; text: string }): { detected: string; note: string; paths?: string[] } => {
  if (r.status === 0) return { detected: 'unreachable', note: r.text.slice(0, 120) }
  if (r.status >= 400) return { detected: `HTTP ${r.status}`, note: 'no contract at this address' }
  const t = r.text.trim()
  try {
    const j = JSON.parse(t) as Record<string, unknown>
    if (j.openapi || j.swagger) { const paths = Object.keys((j.paths as object) ?? {}); return { detected: `openapi ${j.openapi ?? j.swagger}`, note: `${paths.length} paths, ${t.length.toLocaleString('en-US')} chars`, paths } }
    const schema = (j.data as { __schema?: { types?: unknown[] } } | undefined)?.__schema ?? (j as { __schema?: { types?: unknown[] } }).__schema
    if (schema) return { detected: 'graphql schema', note: `${schema.types?.length ?? 0} types (${t.length.toLocaleString('en-US')} chars)` }
    if (j.links || j.hits || j.tools) return { detected: 'json index', note: `${Object.keys(j).slice(0, 6).join(', ')} (${t.length.toLocaleString('en-US')} chars)` }
    return { detected: 'json', note: Object.keys(j).slice(0, 6).join(', ') }
  } catch { /* not json */ }
  if (/^openapi:\s*\d/m.test(t) || /^swagger:/m.test(t)) { const paths = (t.match(/^\s{2}(\/[^:\s]+):/gm) ?? []).map((l) => l.trim().replace(/:$/, '')); return { detected: 'openapi (yaml)', note: `${paths.length} paths, ${t.length.toLocaleString('en-US')} chars`, paths } }
  if (/<OAI-PMH|<Identify>/.test(t)) return { detected: 'oai-pmh identify', note: /<repositoryName>([^<]*)/.exec(t)?.[1] ?? 'identify' }
  if (/<html/i.test(t)) return { detected: 'html page', note: /<title>([^<]*)/i.exec(t)?.[1]?.trim().slice(0, 80) ?? 'a page: documentation for humans, no machine contract' }
  return { detected: r.type.split(';')[0] || 'unknown', note: `${t.length.toLocaleString('en-US')} chars` }
}

/** Everything that came back, read into hosts, doors, capabilities and leads. */
export const discoveryOf = (answers: readonly Answer[], verifiers: readonly Verifier[]): Discovery => {
  const hosts: Host[] = []
  const mcpHosts = [...new Set(answers.filter((a) => a.purpose === 'mcp-list').map((a) => a.host))]
  for (const host of mcpHosts) {
    const list = answers.find((a) => a.id === idOf('mcp-list', host))!
    const r = resultOf(list)
    const wk = answers.find((a) => a.id === idOf('well-known', host))
    if (!r.result) { hosts.push({ host, kind: 'mcp', contract: list.url, status: list.status, detected: 'unreachable', note: r.error ?? 'no answer', doors: [] }); if (wk) hosts.push({ host, kind: 'well-known', contract: wk.url, status: wk.status, ...detect(wk) }); continue }
    const doors: Door[] = (r.result.tools as Parameters<typeof doorOf>[0][]).map((t) => doorOf(t, 'tools/list'))
    let note = `${doors.length} tools in tools/list`
    const cat = answers.find((a) => a.id === idOf('catalogue', host))
    const cr = cat ? resultOf(cat) : { error: 'not asked' }
    if (cr.result) {
      const names = (Array.isArray(cr.result) ? cr.result : cr.result.tools ?? []) as { name: string; description: string }[]
      const listed = new Set(doors.map((d) => d.name)); let read = 0
      for (const t of names) {
        if (listed.has(t.name)) continue
        const contract = answers.find((a) => a.id === idOf('contract', host, t.name))
        const c = contract ? resultOf(contract) : null
        if (c?.result && typeof c.result === 'object') { doors.push(doorOf({ ...(c.result as object), name: t.name, description: t.description }, 'catalogue')); read += 1 }
        else doors.push({ ...doorOf({ name: t.name, description: t.description }, 'catalogue'), description: `${t.description.slice(0, 200)}${c?.error ? ` (contract unread: ${c.error.slice(0, 60)})` : ''}` })
      }
      note += `; ${names.length} in the catalogue door, ${read} contracts read`
    } else note += `; catalogue door: ${cr.error}`
    hosts.push({ host, kind: 'mcp', contract: list.url, status: 200, detected: 'mcp tools/list', note, doors })
    if (wk) hosts.push({ host, kind: 'well-known', contract: wk.url, status: wk.status, ...detect(wk) })
  }
  for (const v of verifiers) {
    if (!v.contract) { hosts.push({ host: new URL(v.docs).host, kind: 'api', contract: v.docs, status: 0, detected: 'no machine contract named', note: `${v.id}: the registry names documentation for humans only; a lead` }); continue }
    const a = answers.find((x) => x.purpose === 'api-contract' && x.name === v.id)
    hosts.push(a ? { host: a.host, kind: 'api', contract: v.contract, status: a.status, ...detect(a) } : { host: new URL(v.contract).host, kind: 'api', contract: v.contract, status: 0, detected: 'not asked', note: 'the client did not fetch this contract' })
  }
  const doors = hosts.flatMap((h) => (h.doors ?? []).map((d) => ({ host: h.host, url: h.contract, ...d })))
  const takesAny = (d: Door, ks: string[]) => d.takes.some((t) => ks.includes(t))
  const capabilities = {
    statementVerdict: doors.filter((d) => takesAny(d, ['statement', 'claim', 'input', 'deposits']) && d.answers.some((a) => ['verdict', 'deposited', 'sealed', 'verified', 'proofRoot'].includes(a)) && d.required.every((r) => (TAKES as readonly string[]).includes(r))).map((d) => d.name),
    signing: doors.filter((d) => d.answers.includes('signed')).map((d) => d.name),
    readiness: doors.filter((d) => d.answers.includes('ready')).map((d) => d.name),
    addressing: doors.filter((d) => d.takes.includes('value') && d.answers.includes('address')).map((d) => d.name),
    rbac: doors.filter((d) => d.takes.includes('token') && d.answers.includes('role')).map((d) => d.name),
  }
  const leads = hosts.filter((h) => h.kind === 'api' && !/^openapi|json index|oai-pmh/.test(h.detected)).map((h) => ({ id: `contract-${h.host}`, source: h.contract, statement: `${h.host} publishes no machine-readable contract at the address the registry names (${h.detected})`, status: 'open' as const, reason: 'the client is built from documentation read by a person; an OpenAPI or index document would let it be built from the host' }))
  return { hosts, doors, capabilities, leads }
}

/** The discovery page, from the discovery alone. */
export const discoveryPageOf = (d: Discovery, date: string): string => ['---', 'title: Discovery', 'order: 46', '---', '', '# Discovery before use', '',
  `Every host this tree talks to, asked for its contract on ${date} by \`npm run next\` through the \`discover\` tool: MCP hosts for tools/list and their catalogue door, API hosts for the OpenAPI, index or identify document the verifiers registry names, both domains for \`/.well-known/qpu.json\`. The client tools choose their doors from this table by capability, never from a name in code.`, '',
  '| Host | Kind | Contract | Status | Detected | Note |', '|---|---|---|---:|---|---|', ...d.hosts.map((h) => `| ${h.host} | ${h.kind} | ${h.contract} | ${h.status || '—'} | ${h.detected} | ${h.note.replace(/\|/g, '\\|')} |`), '',
  '## Capabilities found', '', `Statement → verdict: ${d.capabilities.statementVerdict.join(', ') || 'none'}. Signing: ${d.capabilities.signing.join(', ') || 'none'}. Readiness: ${d.capabilities.readiness.join(', ') || 'none'}. Addressing: ${d.capabilities.addressing.join(', ') || 'none'}. RBAC (a token in, a role out): ${d.capabilities.rbac.join(', ') || 'none: roles come from the tenant secrets until a Payload MCP host is named'}.`, '',
  '## Doors', '', `${d.doors.length} doors across ${d.hosts.filter((h) => h.kind === 'mcp').length} MCP host(s).`, '',
  '| Host | Door | Takes | Required | Answers | Read-only | From |', '|---|---|---|---|---|---|---|', ...d.doors.map((x) => `| ${x.host} | ${x.name} | ${x.takes.join(', ') || '—'} | ${x.required.join(', ') || '—'} | ${x.answers.join(', ') || '—'} | ${x.readOnly === null ? '?' : x.readOnly} | ${x.contract} |`), '',
  '## Leads', '', ...(d.leads.length ? d.leads.map((l) => `- \`${l.id}\`: ${l.statement}`) : ['none: every API host published a contract']), ''].join('\n')
