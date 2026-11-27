// The contract a client reads from tools/list alone, held against the code: whole sentences, an output schema on every tool, alternatives
// refused by name, annotations that say what a second call answers, leads in pages, one count of tools, one shape of refusal, plain JSON.
import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { call, handle } from '../../../../../../../../3/8/5/9/0/2/0/f/index.ts'
import { EXAMPLES } from '../../../../../../../../9/d/4/f/e/4/4/2/index.ts'
import { ALTERNATIVES, BOUND_TOOLS, ERROR_KINDS, NOT_IDEMPOTENT, codeOfThrown, findAmbiguity } from '../../../../../../../../3/1/1/a/2/d/9/3/index.ts'
import { VERSION } from '../../../../../../../../c/0/7/0/9/8/4/3/index.ts'
import { serveMcp } from '../../../../../../../../7/6/a/e/5/0/3/9/index.ts'
import { MESSAGING_TOOLS } from '../../../../../../../../1/6/e/c/4/7/3/b/index.ts'
import { PROVER_TOOLS } from '../../../../../../../../6/a/b/e/3/a/d/f/index.ts'

type Listed = { name: string; description: string; inputSchema: { properties?: Record<string, { description?: string; type?: unknown; anyOf?: unknown; enum?: unknown; examples?: unknown[] }>; 'x-alternatives'?: { oneOf: { inputs: string[]; with: string[] }[] } }; outputSchema?: { type?: string; description?: string; properties?: Record<string, { type?: unknown }> }; annotations?: { readOnlyHint?: boolean; idempotentHint?: boolean }; _meta?: { state?: { writes?: boolean; idempotent?: boolean } } }
const listed = (params?: object) => (handle({ jsonrpc: '2.0', id: 1, method: 'tools/list', ...(params ? { params } : {}) }) as { result: { tools: Listed[]; _meta: { context: { tokens: number; fullTokens: number; saved: number } } } }).result
const kernel = listed().tools
/** The contract with every key and worked example: the list where the tools are named. */
const detailed = listed({ tools: kernel.map((t) => t.name) }).tools
const failed = (name: string, args: object) => (handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }) as { error?: { code: number; message: string; data: { code: string; kind: string; error: string } } }).error
const bound = { PROVER: { getByName: () => ({ fetch: async () => Response.json({ ok: true, timedOut: false, ms: 1, messages: [], toolchain: 'x' }) }) }, MAILBOX: { getByName: () => ({ post: async () => ({ seq: 1 }), read: async () => [] }) } }
const post = (body: object, accept: string, env: Record<string, unknown> = bound) => serveMcp(new Request('https://qpu.uuidna.com/api/mcp', { method: 'POST', headers: { host: 'qpu.uuidna.com', 'content-type': 'application/json', accept }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, ...body }) }), env)

/** ISO/IEC/IEEE 29119-3 test case. Identifier: tools/list alone is readable: every description is a whole sentence, every tool states its output, and every input says what it is. */
test('tools/list alone is readable: every description is a whole sentence, every tool states its output, and every input says what it is', () => {
  const whole = (d: string) => /[.…)}\]"'”]$/.test(d.trim())
  assert.deepEqual(kernel.filter((t) => !whole(t.description)).map((t) => t.name), [])
  // what the brief cut on 2026-11-24 ("true", "schema", "The statements quantumai") is now the first sentence
  const fold = kernel.find((t) => t.name === 'fold')!, seal = kernel.find((t) => t.name === 'seal')!
  assert.ok(fold.inputSchema.properties!.superpositions!.description!.length > 20)
  assert.match(seal.inputSchema.properties!.merkle!.description!, /\{ leaves \}.*inclusion proof/)
  assert.deepEqual(detailed.find((t) => t.name === 'seal')!.inputSchema.properties!.merkle!.examples, [{ leaves: ['a', 'b', 'c'], index: 1 }])
  // the list asked whole costs an agent less context than the whole contract: on 2026-11-24 it cost more (47,762 tokens against 45,863)
  const asked = listed()._meta.context, one = listed({ tools: ['seal'] })._meta.context
  assert.ok(asked.saved > 0 && asked.tokens * 4 < asked.fullTokens * 3, JSON.stringify(asked))
  assert.ok(one.tokens * 4 < one.fullTokens, JSON.stringify(one))
  assert.match(seal.outputSchema!.description!, /tools\/list with tools naming seal/)
  const inputs = detailed.flatMap((t) => Object.entries(t.inputSchema.properties ?? {}).map(([k, p]) => ({ at: `${t.name}.${k}`, p })))
  assert.deepEqual(inputs.filter(({ p }) => p.description === undefined && p.type === undefined && p.anyOf === undefined && p.enum === undefined).map((i) => i.at), [])
  assert.deepEqual(kernel.flatMap((t) => Object.entries(t.inputSchema.properties ?? {}).map(([k, p]) => ({ at: `${t.name}.${k}`, p }))).filter(({ p }) => typeof p.description === 'string' && /\b(true|schema|Currency)$/.test(p.description)).map((i) => i.at), [])
  // an example beside an input is an argument a worked example passes; the inputs still without one are counted so the number only falls
  const without = inputs.filter(({ p }) => !p.examples).length
  assert.ok(without <= 190, `${without} of ${inputs.length} inputs have no worked example`)
  for (const t of kernel) assert.equal(t.outputSchema?.type, 'object', t.name)
  assert.ok(detailed.filter((t) => Object.keys(t.outputSchema!.properties ?? {}).length > 0).length >= 45)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the output schemas and input examples are the ones the worked examples witness today, and every example's answer has only stated types. */
test('the output schemas and input examples are the ones the worked examples witness today, and every example\'s answer has only stated types', () => {
  const written = call('textbook', { scripts: { outputs: true } }).result!.structuredContent as { path: string; text: string }
  assert.equal(readFileSync(written.path, 'utf8'), written.text, 'run: node src/quantum/uuid/programs/0/d/b/3/5/7/8/9/index.ts step textbook \'{"scripts":{"outputs":true}}\' --write')
  const kind = (v: unknown) => (v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v === 'number' ? (Number.isInteger(v) ? 'integer' : 'number') : typeof v)
  const e = EXAMPLES.find((x) => x.id === 'seal-merkle') ?? EXAMPLES.find((x) => x.tool === 'seal')!, s = call(e.tool, e.arguments).result!.structuredContent as Record<string, unknown>
  const stated = detailed.find((t) => t.name === e.tool)!.outputSchema!.properties!
  for (const [k, v] of Object.entries(s)) { const t = [stated[k]?.type].flat(); assert.ok(t.includes(kind(v)) || (kind(v) === 'integer' && t.includes('number')), `${e.tool}.${k}: ${kind(v)} not in ${t}`) }
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: alternatives named together are refused by name, an input beside an alternative it does not combine with is refused, and every worked example still passes. */
test('alternatives named together are refused by name, an input beside an alternative it does not combine with is refused, and every worked example still passes', () => {
  // the call that answered on 2026-11-24 with the first branch and dropped the rest in silence
  const two = failed('fold', { text: 'abc', combinatorics: true })!
  assert.deepEqual([two.data.code, two.data.kind, /combinatorics/.test(two.message) && /text/.test(two.message)], ['ambiguous_arguments', 'validation', true])
  const stray = failed('seal', { merkle: { leaves: ['a'] }, brief: true })!
  assert.deepEqual([stray.data.code, /brief beside merkle/.test(stray.message), /brief combines with texts, text/.test(stray.message)], ['ambiguous_arguments', true, true])
  assert.equal(failed('verify', { numerology: true, uuid: '9f46ed5e-ad2b-8c96-bd8d-431be987c981' })!.data.code, 'ambiguous_arguments')
  // an input read beside an alternative is no second alternative
  assert.equal(findAmbiguity('seal', { slh: { seed: '00' }, text: 'a' }), null)
  assert.equal(findAmbiguity('fold', { radices: [2, 3], index: 1 }), null)
  assert.equal(findAmbiguity('processor', { anything: 1, at: 2 }), null)
  assert.deepEqual(EXAMPLES.filter((e) => findAmbiguity(e.tool, e.arguments as Record<string, unknown>) !== null).map((e) => e.id), [])
  // every input of the three tools is placed: it selects an alternative, is read beside one, or is read beside any
  for (const [tool, alternatives] of Object.entries(ALTERNATIVES)) {
    const listed = kernel.find((t) => t.name === tool)!, placed = new Set([...alternatives.flatMap((a) => [...a.keys, ...(a.with ?? [])]), 'selftest'])
    assert.deepEqual(Object.keys(listed.inputSchema.properties!).filter((k) => !placed.has(k)), [], tool)
    assert.equal(listed.inputSchema['x-alternatives']!.oneOf.length, alternatives.length)
  }
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a tool annotated idempotent answers the same in another process, and the tools that do not are annotated so with the reason. */
test('a tool annotated idempotent answers the same in another process, and the tools that do not are annotated so with the reason', () => {
  const digest = (v: unknown) => createHash('sha256').update(JSON.stringify(v ?? null)).digest('hex').slice(0, 16)
  const here = Object.fromEntries(EXAMPLES.map((e) => [e.id, digest(call(e.tool, e.arguments).result?.structuredContent)]))
  const script = `const { call } = await import('./src/quantum/uuid/programs/3/8/5/9/0/2/0/f/index.ts'), { EXAMPLES } = await import('./src/quantum/uuid/programs/9/d/4/f/e/4/4/2/index.ts'), { createHash } = await import('node:crypto'); console.log(JSON.stringify(Object.fromEntries(EXAMPLES.map((e) => [e.id, createHash('sha256').update(JSON.stringify(call(e.tool, e.arguments).result?.structuredContent ?? null)).digest('hex').slice(0, 16)]))))`
  const there = JSON.parse(spawnSync(process.execPath, ['--input-type=module', '-e', script], { encoding: 'utf8', maxBuffer: 1 << 26 }).stdout) as Record<string, string>
  const differing = [...new Set(EXAMPLES.filter((e) => here[e.id] !== there[e.id]).map((e) => e.tool))]
  assert.deepEqual(differing.filter((tool) => !(tool in NOT_IDEMPOTENT)), [])
  for (const t of kernel) assert.deepEqual([t.annotations?.idempotentHint, t._meta?.state?.idempotent, t._meta?.state?.writes, t.annotations?.readOnlyHint], [!(t.name in NOT_IDEMPOTENT), !(t.name in NOT_IDEMPOTENT), false, true], t.name)
  // the one tool that writes says so
  const send = MESSAGING_TOOLS.find((t) => t.name === 'send')!
  assert.deepEqual([send.annotations.readOnlyHint, send._meta.state.writes], [false, true])
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: leads answers in pages that cover the matching leads once, filters by status and tool, and a summary of a few hundred bytes. */
test('leads answers in pages that cover the matching leads once, filters by status and tool, and a summary of a few hundred bytes', () => {
  const leads = (args: object) => call('leads', args).result!.structuredContent as { leads: { id: string; status: string; tool?: string }[]; total: number; matching?: number; next?: number | null; matchingByStatus?: Record<string, number>; matchingByTool?: Record<string, number> }
  const all = leads({ status: 'open' }), ids: string[] = []
  for (let offset: number | null = 0, pages = 0; offset !== null && pages < 50; pages++) { const page = leads({ status: 'open', limit: 100, offset }); assert.ok(page.leads.length <= 100); ids.push(...page.leads.map((l) => l.id)); offset = page.next ?? null }
  assert.deepEqual(ids, all.leads.map((l) => l.id))
  const summary = call('leads', { summary: true }).result!.structuredContent
  assert.ok(JSON.stringify(summary).length < 4096, `${JSON.stringify(summary).length} bytes`)
  assert.deepEqual([summary.leads.length, summary.matching, Object.values(summary.matchingByTool as Record<string, number>).reduce((a, b) => a + b, 0)], [0, summary.total, summary.total])
  const door = Object.keys(summary.matchingByTool).find((k) => k !== '')!, byDoor = leads({ tool: door, status: 'open', summary: true })
  assert.equal(byDoor.matching, all.leads.filter((l) => l.tool === door).length)
  assert.equal(failed('leads', { limit: 0 })!.data.code, 'invalid_params')
  // without limit, offset or summary the answer is what it was: every matching lead
  assert.equal(leads({}).leads.length, leads({}).total)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every refusal carries a code of the one list with its kind, and the code's own fault is not blamed on the arguments. */
test('every refusal carries a code of the one list with its kind, and the code\'s own fault is not blamed on the arguments', () => {
  const none = failed('nosuch', {})!, bad = failed('seal', { merkle: {} })!
  assert.deepEqual([none.data.code, none.data.kind, bad.data.code, bad.data.kind, bad.code], ['not_found', 'validation', 'invalid_params', 'validation', -32602])
  assert.deepEqual([codeOfThrown(new TypeError('x is not a function')), codeOfThrown(new ReferenceError('y')), codeOfThrown(new Error('merkle takes { leaves }')), codeOfThrown(new RangeError('too big'))], ['internal_error', 'internal_error', 'invalid_params', 'invalid_params'])
  assert.deepEqual([...new Set(Object.values(ERROR_KINDS))].sort(), ['internal', 'limit', 'role', 'upstream', 'validation'])
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: one count of tools everywhere, one version, and a client that accepts JSON alone is answered JSON. */
test('one count of tools everywhere, one version, and a client that accepts JSON alone is answered JSON', async () => {
  assert.deepEqual([...MESSAGING_TOOLS, ...PROVER_TOOLS].map((t) => t.name), [...BOUND_TOOLS])
  const metrics = call('metrics', {}).result!.structuredContent
  assert.deepEqual([metrics.tools, metrics.toolsBound, metrics.toolsServed], [kernel.length, BOUND_TOOLS.length, kernel.length + BOUND_TOOLS.length])
  const doc = readFileSync('docs/mcp.md', 'utf8')
  assert.equal(Number(/## tools\/list \((\d+)\)/.exec(doc)?.[1]), kernel.length)
  assert.deepEqual(kernel.filter((t) => !doc.includes(`| \`${t.name}\` |`)).map((t) => t.name), [])
  assert.match(doc, new RegExp(`answers ${kernel.length + BOUND_TOOLS.length}\\.`))
  const pkg = (path: string) => (JSON.parse(readFileSync(path, 'utf8')) as { version: string }).version
  assert.deepEqual([pkg('package.json'), pkg('src/quantum/package.json')], [VERSION, VERSION])
  // Accept: application/json alone, which the transport answered 406 on 2026-11-24
  const plain = await post({ method: 'tools/list' }, 'application/json')
  assert.deepEqual([plain.status, plain.headers.get('content-type')], [200, 'application/json'])
  const served = (JSON.parse(await plain.text()) as { result: { tools: Listed[] } }).result.tools
  assert.equal(served.length, metrics.toolsServed)
  // through the Worker every tool, the bound ones too, states its output and what a second call answers
  for (const t of served) assert.deepEqual([t.outputSchema?.type, typeof t.annotations?.idempotentHint, typeof t._meta?.state?.writes], ['object', 'boolean', 'boolean'], t.name)
  assert.match(served.find((t) => t.name === 'seal')!.outputSchema!.description!, /An object of \d+ key/)
  // a client that accepts the stream still gets it, and a refusal has the one shape through the Worker too
  const stream = await post({ method: 'tools/call', params: { name: 'fold', arguments: { text: 'abc', combinatorics: true } } }, 'application/json, text/event-stream')
  const refused = JSON.parse((await stream.text()).replace(/^[\s\S]*?data: /, '')).result
  assert.deepEqual([stream.headers.get('content-type'), refused.isError, refused.structuredContent.code, refused.structuredContent.kind], ['text/event-stream', true, 'ambiguous_arguments', 'validation'])
})
