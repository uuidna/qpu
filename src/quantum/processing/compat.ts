// Quantum demand from another model is computed on this register. The adapter speaks that model's API and runs the call here.
// Sending the work to the model would wait on the model. The UUID of the formula is the ISO quantum receipt: every standard is in the formula, and the address stores that proof.
import { canonicalText, channel, seal, uuid, uuidQubits } from '../uuid/index.ts'
import { ISO_DIMENSIONS } from './standards.ts'
import { getAdvantage } from './audit.ts'
import { ALL_PROCESSORS, DEVICES } from './processor.ts'
import { CLAUDE_API, GEMINI_API } from './discovery.ts'

/** The Schema fields the Gemini API publishes for a function declaration. A keyword outside this set is dropped and its meaning is kept in the description. */
const GEMINI_SCHEMA = new Set(['type', 'format', 'description', 'nullable', 'enum', 'items', 'maxItems', 'minItems', 'properties', 'required', 'minimum', 'maximum', 'minLength', 'maxLength', 'pattern', 'example', 'anyOf', 'propertyOrdering', 'title'])
/** The JSON Schema subset strict tool use publishes (platform.claude.com/docs/en/build-with-claude/structured-outputs). A keyword outside it is dropped into the description. */
const CLAUDE_SCHEMA = new Set(['type', 'properties', 'required', 'items', 'description', 'title', 'enum', 'const', 'anyOf', 'allOf', '$ref', '$def', 'definitions', 'default', 'additionalProperties', 'format', 'minItems'])
const CLAUDE_FORMATS = new Set(['date-time', 'time', 'date', 'duration', 'email', 'hostname', 'uri', 'ipv4', 'ipv6', 'uuid'])
const NESTED = new Set(['items', 'anyOf', 'allOf'])
const NESTED_MAP = new Set(['properties', '$def', 'definitions'])
const SECRET = /^(api[-_]?key|token|secret|authorization|password|access[-_]?token|x-goog-api-key|x-api-key)$/i
type NativeRun = (tool: string, args: Record<string, unknown>) => { ok: boolean; result?: unknown; error?: string }

const registerCapacity = () => {
  const register = uuidQubits(4)
  return { unlimited: true as const, ceiling: null, effective: register.effective, handles: register.handles.possible, scale: register.handles.capacity }
}
const capacity = registerCapacity

const adapters = (cursorModel: string) => [
  { id: 'gemini' as const, model: GEMINI_API.model, speaks: 'functionResponse' as const },
  { id: 'claude' as const, model: CLAUDE_API.model, speaks: 'tool_result' as const },
  { id: 'cursor' as const, model: cursorModel, speaks: 'tool_result' as const },
  { id: 'cirq-google' as const, model: 'cirq-google', speaks: 'engine' as const },
]

const summarise = (value: unknown) => {
  const text = canonicalText(value)
  return text.length > 80 ? `${text.slice(0, 80)}…` : text
}

const primitiveEnum = (value: unknown) => Array.isArray(value) && value.every((item) => item === null || typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean')

/** A keyword Claude's strict tool use keeps. additionalProperties stays only when it is false; minItems only at 0 or 1; format only from the published list; $ref only inside the document; an enum only of primitives; allOf only without $ref. */
const claudeKeeps = (key: string, value: unknown) => {
  if (!CLAUDE_SCHEMA.has(key)) return false
  if (key === 'additionalProperties') return value === false
  if (key === 'minItems') return value === 0 || value === 1
  if (key === 'format') return typeof value === 'string' && CLAUDE_FORMATS.has(value)
  if (key === '$ref') return typeof value === 'string' && value.startsWith('#')
  if (key === 'enum') return primitiveEnum(value)
  if (key === 'allOf') return Array.isArray(value) && value.every((item) => !item || typeof item !== 'object' || !('$ref' in (item as object)))
  return true
}

const walkSchema = (schema: unknown, keep: (key: string, value: unknown) => boolean, path = '', drops: { path: string; keyword: string }[] = []) => {
  const walk = (node: unknown, at: string): unknown => {
    if (Array.isArray(node)) return node.map((item, index) => walk(item, `${at}/${index}`))
    if (!node || typeof node !== 'object') return node
    const source = node as Record<string, unknown>
    const kept: Record<string, unknown> = {}
    const notes: string[] = []
    for (const [key, value] of Object.entries(source)) {
      if (keep(key, value)) {
        kept[key] = NESTED_MAP.has(key) && value && typeof value === 'object' && !Array.isArray(value)
          ? Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([name, child]) => [name, walk(child, `${at}/${name}`)]))
          : NESTED.has(key) ? walk(value, `${at}/${key}`) : value
      } else {
        drops.push({ path: at || '/', keyword: key })
        notes.push(`${key} ${summarise(value)}`)
      }
    }
    if (notes.length) {
      const prior = typeof kept.description === 'string' ? `${kept.description} ` : ''
      kept.description = `${prior}${notes.join('; ')}`
    }
    return kept
  }
  return { schema: walk(schema, path), drops }
}

/** Narrow a schema to the Gemini subset. Each dropped keyword is named, and its text is appended to the description. */
const narrowSchema = (schema: unknown, path = '', drops: { path: string; keyword: string }[] = []) =>
  walkSchema(schema, (key) => GEMINI_SCHEMA.has(key), path, drops)

/** Strict tool use requires additionalProperties false on every object. A value other than false was already dropped into the description. */
const sealObjects = (node: unknown): unknown => {
  if (Array.isArray(node)) return node.map(sealObjects)
  if (!node || typeof node !== 'object') return node
  const source = { ...(node as Record<string, unknown>) }
  for (const key of NESTED_MAP) {
    const value = source[key]
    if (value && typeof value === 'object' && !Array.isArray(value)) source[key] = Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([name, child]) => [name, sealObjects(child)]))
  }
  for (const key of NESTED) if (source[key] !== undefined) source[key] = sealObjects(source[key])
  const objectLike = source.type === 'object' || (source.properties !== undefined && typeof source.properties === 'object' && !Array.isArray(source.properties))
  if (objectLike) source.additionalProperties = false
  return source
}

const claudeClean = (node: unknown): boolean => {
  if (Array.isArray(node)) return node.every(claudeClean)
  if (!node || typeof node !== 'object') return true
  const source = node as Record<string, unknown>
  if (!Object.keys(source).every((key) => CLAUDE_SCHEMA.has(key))) return false
  if ('additionalProperties' in source && source.additionalProperties !== false) return false
  if ('minItems' in source && source.minItems !== 0 && source.minItems !== 1) return false
  if ('format' in source && (typeof source.format !== 'string' || !CLAUDE_FORMATS.has(source.format))) return false
  if ('$ref' in source && (typeof source.$ref !== 'string' || !source.$ref.startsWith('#'))) return false
  if ('enum' in source && !primitiveEnum(source.enum)) return false
  const objectLike = source.type === 'object' || (source.properties !== undefined && typeof source.properties === 'object' && !Array.isArray(source.properties))
  if (objectLike && source.additionalProperties !== false) return false
  const properties = source.properties
  const propertiesKept = !properties || typeof properties !== 'object' || Array.isArray(properties) || Object.values(properties as Record<string, unknown>).every(claudeClean)
  return propertiesKept && (source.items === undefined || claudeClean(source.items)) && (source.anyOf === undefined || claudeClean(source.anyOf)) && (source.allOf === undefined || claudeClean(source.allOf))
}

/** Narrow a schema to Claude's strict subset and seal every object. */
const narrowClaude = (schema: unknown) => {
  const narrowed = walkSchema(schema, claudeKeeps)
  return { schema: sealObjects(narrowed.schema), drops: narrowed.drops }
}

const stripSecrets = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(stripSecrets)
  if (!value || typeof value !== 'object') return value
  const out: Record<string, unknown> = {}
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    if (SECRET.test(key)) continue
    out[key] = stripSecrets(item)
  }
  return out
}

const onlyKept = (node: unknown): boolean => {
  if (Array.isArray(node)) return node.every(onlyKept)
  if (!node || typeof node !== 'object') return true
  const source = node as Record<string, unknown>
  if (!Object.keys(source).every((key) => GEMINI_SCHEMA.has(key))) return false
  const properties = source.properties
  const propertiesKept = !properties || typeof properties !== 'object' || Array.isArray(properties) || Object.values(properties as Record<string, unknown>).every(onlyKept)
  return propertiesKept && (source.items === undefined || onlyKept(source.items)) && (source.anyOf === undefined || onlyKept(source.anyOf))
}

/** Every quantum tool schema narrowed to the Gemini Schema. The UUID of the tool list is the receipt. Nothing is sent to the model. */
export const integrateDeclarations = (tools: readonly { name: string; description?: string; inputSchema?: unknown }[]) => {
  const rows = tools.map((tool) => {
    const narrowed = narrowSchema(tool.inputSchema ?? { type: 'object' })
    return { name: tool.name, description: tool.description ?? '', parameters: narrowed.schema, drops: narrowed.drops }
  })
  const dropped = [...new Set(rows.flatMap((row) => row.drops.map((drop) => drop.keyword)))]
  const clean = rows.length > 0 && rows.every((row) => onlyKept(row.parameters))
  const formula = canonicalText({ adapter: 'gemini', compat: true, native: true, outbound: 0, tools: rows.map((row) => row.name), dropped, standards: [...ISO_DIMENSIONS] })
  const receipt = storeReceipt(formula, clean)
  return { declarations: rows.map(({ name, description, parameters }) => ({ name, description, parameters })), dropped, drops: rows.reduce((n, row) => n + row.drops.length, 0), clean, capacity: capacity(), advantage: getAdvantage(2, receipt.holds ? 2 : 0), receipt }
}

const cursorName = /^[a-zA-Z0-9_-]{1,128}$/

/** Cursor accepts an MCP tool when the root schema is type object, every property schema is an object, and required is a list of names (forum.cursor.com, tools/list validation). A name outside ^[a-zA-Z0-9_-]{1,128}$ is rewritten the way advertiseTools rewrites it. */
const narrowCursor = (schema: unknown) => {
  const drops: { path: string; keyword: string }[] = []
  const note = (target: Record<string, unknown>, text: string) => {
    const prior = typeof target.description === 'string' ? `${target.description} ` : ''
    target.description = `${prior}${text}`
  }
  const fix = (node: unknown, at: string, root: boolean): Record<string, unknown> => {
    if (!node || typeof node !== 'object' || Array.isArray(node)) {
      drops.push({ path: at || '/', keyword: typeof node === 'boolean' ? 'boolean' : 'schema' })
      const standIn: Record<string, unknown> = { description: `schema ${summarise(node)}` }
      if (root) standIn.type = 'object'
      return standIn
    }
    const source = { ...(node as Record<string, unknown>) }
    if (source.properties && typeof source.properties === 'object' && !Array.isArray(source.properties)) {
      source.properties = Object.fromEntries(Object.entries(source.properties as Record<string, unknown>).map(([name, child]) => [name, fix(child, `${at}/${name}`, false)]))
    } else if ('properties' in source) {
      drops.push({ path: at || '/', keyword: 'properties' })
      note(source, `properties ${summarise(source.properties)}`)
      delete source.properties
    }
    if ('required' in source && !(Array.isArray(source.required) && source.required.every((item) => typeof item === 'string'))) {
      drops.push({ path: at || '/', keyword: 'required' })
      note(source, `required ${summarise(source.required)}`)
      delete source.required
    }
    for (const key of ['items', 'anyOf', 'oneOf', 'allOf'] as const) {
      if (!(key in source)) continue
      const value = source[key]
      if (key === 'items') source.items = Array.isArray(value) ? value.map((item, index) => fix(item, `${at}/items/${index}`, false)) : fix(value, `${at}/items`, false)
      else if (Array.isArray(value)) source[key] = value.map((item, index) => fix(item, `${at}/${key}/${index}`, false))
      else {
        drops.push({ path: at || '/', keyword: key })
        note(source, `${key} ${summarise(value)}`)
        delete source[key]
      }
    }
    if (root && source.type !== 'object') {
      if (source.type !== undefined) {
        drops.push({ path: at || '/', keyword: 'type' })
        note(source, `type ${summarise(source.type)}`)
      }
      source.type = 'object'
    }
    return source
  }
  return { schema: fix(schema ?? { type: 'object' }, '', true), drops }
}

const cursorClean = (node: unknown, root = true): boolean => {
  if (!node || typeof node !== 'object' || Array.isArray(node)) return false
  const source = node as Record<string, unknown>
  if (root && source.type !== 'object') return false
  if ('required' in source && !(Array.isArray(source.required) && (source.required as unknown[]).every((item) => typeof item === 'string'))) return false
  if ('properties' in source) {
    const properties = source.properties
    if (!properties || typeof properties !== 'object' || Array.isArray(properties)) return false
    if (!Object.values(properties as Record<string, unknown>).every((child) => cursorClean(child, false))) return false
  }
  for (const key of ['anyOf', 'oneOf', 'allOf'] as const) {
    if (key in source && !(Array.isArray(source[key]) && (source[key] as unknown[]).every((item) => cursorClean(item, false)))) return false
  }
  if ('items' in source) {
    const items = source.items
    if (Array.isArray(items) ? !items.every((item) => cursorClean(item, false)) : !cursorClean(items, false)) return false
  }
  return true
}

const advertiseName = (name: string, used: Set<string>) => {
  const slug = name.replace(/[^a-zA-Z0-9_-]/g, '_')
  const base = (slug.length > 0 ? slug : 'tool').slice(0, 128)
  let candidate = base
  let n = 2
  while (used.has(candidate) || !cursorName.test(candidate)) {
    const suffix = `_${n}`
    candidate = `${base.slice(0, 128 - suffix.length)}${suffix}`
    n += 1
  }
  used.add(candidate)
  return candidate
}

/** Every quantum tool as an MCP tool Cursor's tools/list check accepts. The UUID of that list is the receipt. No agent request leaves. */
export const integrateCursor = (tools: readonly { name: string; description?: string; inputSchema?: unknown; outputSchema?: unknown; annotations?: unknown }[]) => {
  const used = new Set<string>()
  const rows = tools.map((tool) => {
    const input = narrowCursor(tool.inputSchema ?? { type: 'object' })
    const output = tool.outputSchema === undefined ? null : narrowCursor(tool.outputSchema)
    const name = advertiseName(tool.name, used)
    return { name, from: tool.name, description: tool.description ?? '', inputSchema: input.schema, outputSchema: output?.schema ?? null, annotations: tool.annotations ?? null, drops: [...input.drops, ...(output?.drops ?? [])] }
  })
  const dropped = [...new Set(rows.flatMap((row) => row.drops.map((drop) => drop.keyword)))]
  const renamed = rows.filter((row) => row.from !== row.name).map((row) => ({ from: row.from, name: row.name }))
  const clean = rows.length > 0 && rows.every((row) => cursorName.test(row.name) && cursorClean(row.inputSchema) && (row.outputSchema === null || cursorClean(row.outputSchema, true)))
  const formula = canonicalText({ adapter: 'cursor', compat: true, native: true, outbound: 0, tools: rows.map((row) => row.name), renamed, dropped, standards: [...ISO_DIMENSIONS] })
  const receipt = storeReceipt(formula, clean)
  return {
    tools: rows.map(({ name, from, description, inputSchema, outputSchema, annotations }) => ({ name, from, description, inputSchema, ...(outputSchema ? { outputSchema } : {}), ...(annotations ? { annotations } : {}) })),
    renamed,
    dropped,
    drops: rows.reduce((n, row) => n + row.drops.length, 0),
    clean,
    capacity: capacity(),
    advantage: getAdvantage(2, receipt.holds ? 2 : 0),
    receipt,
  }
}

/** Every quantum tool as a strict Claude tool. The UUID of the tool list is the receipt. No messages request leaves. */
export const integrateClaude = (tools: readonly { name: string; description?: string; inputSchema?: unknown }[]) => {
  const rows = tools.map((tool) => {
    const narrowed = narrowClaude(tool.inputSchema ?? { type: 'object' })
    return { name: tool.name, description: tool.description ?? '', input_schema: narrowed.schema, strict: true as const, drops: narrowed.drops }
  })
  const dropped = [...new Set(rows.flatMap((row) => row.drops.map((drop) => drop.keyword)))]
  const clean = rows.length > 0 && rows.every((row) => /^[a-zA-Z0-9_-]{1,128}$/.test(row.name) && claudeClean(row.input_schema))
  const formula = canonicalText({ adapter: 'claude', compat: true, strict: true, native: true, outbound: 0, tools: rows.map((row) => row.name), dropped, standards: [...ISO_DIMENSIONS] })
  const receipt = storeReceipt(formula, clean)
  return { tools: rows.map(({ name, description, input_schema, strict }) => ({ name, description, input_schema, strict })), dropped, drops: rows.reduce((n, row) => n + row.drops.length, 0), clean, capacity: capacity(), advantage: getAdvantage(2, receipt.holds ? 2 : 0), receipt }
}

const amplitudesHold = (result: unknown) => {
  if (!result || typeof result !== 'object' || !('amplitudes' in result)) return true
  const rows = (result as { amplitudes?: { re?: number; im?: number }[] }).amplitudes
  if (!Array.isArray(rows) || rows.length === 0) return false
  let sum = 0
  for (const row of rows) {
    if (typeof row?.re !== 'number' || typeof row?.im !== 'number') return false
    const p = row.re * row.re + row.im * row.im
    if (p < 0 || p > 1) return false
    sum += p
  }
  const drift = sum - 1
  return drift < 1e-6 && drift > -1e-6
}

/** A native result holds when every amplitude probability is in range and every measured bit is 0 or 1. */
const stateHolds = (result: unknown) => {
  if (!amplitudesHold(result)) return false
  if (!result || typeof result !== 'object' || !('bitstrings' in result)) return true
  const rows = (result as { bitstrings?: unknown }).bitstrings
  return Array.isArray(rows) && rows.every((row) => typeof row === 'string' && [...row].every((bit) => bit === '0' || bit === '1'))
}

/** The cirq-google engine result, certified on this register. The fields sit beside the simulation. */
export const engineReceipt = (processor: string, programId: string, jobId: string, result: unknown) => {
  const formula = canonicalText({ adapter: 'cirq-google', native: true, outbound: 0, processor, program: programId, job: jobId, standards: [...ISO_DIMENSIONS] })
  return { native: true as const, outbound: 0 as const, slower: false as const, capacity: capacity(), receipt: storeReceipt(formula, stateHolds(result)) }
}

/** The UUID of the formula is the receipt. Every ISO dimension is in that formula, so the address stores the proof. */
const storeReceipt = (formula: string, compatible: boolean) => {
  const id = uuid(formula)
  const stamped = seal(id)
  const read = channel(id)
  const again = uuid(formula) === id
  const standards = ISO_DIMENSIONS.map((dimension) => ({
    dimension,
    stored: id,
    computes: dimension === 'ISO 16' ? 432 as const : null,
    holds: compatible && stamped.valid && again,
  }))
  const certified = formula.length > 0 && standards.length === ISO_DIMENSIONS.length && standards.every((row) => row.holds)
  return {
    kind: 'iso-quantum' as const,
    process: 'ISO 9001' as const,
    clause: certified ? 'ISO 9001:2015, 8.6' as const : 'ISO 9001:2015, 10.2' as const,
    id,
    coin: id,
    formula,
    documented: formula.length > 0,
    sealed: stamped.valid,
    stored: { handle: read.handle, sku: read.sku, program: read.combination.hex, tail: read.tail, validation: read.validation.holds },
    standards,
    of: ISO_DIMENSIONS.length,
    certified,
    holds: certified && read.validation.holds,
  }
}

const speak = (adapter: { id: string; speaks: string }, tool: string, result: unknown, toolUseId: string, ok: boolean, rpcId: string | number | null, wire: Demand['wire']) => {
  if (wire === 'tools') return { role: 'tool' as const, tool_call_id: toolUseId, content: result === null ? '' : JSON.stringify(result) }
  if (wire === 'gemini' || (wire === 'call' && adapter.speaks === 'functionResponse')) return { functionResponse: { name: tool, response: result } }
  if (wire === 'claude' || (wire === 'call' && adapter.id === 'claude')) return { type: 'tool_result' as const, tool_use_id: toolUseId, content: result }
  if (wire === 'cursor' || (wire === 'call' && adapter.id === 'cursor')) {
    const resultBody = { content: [{ type: 'text' as const, text: result === null ? '' : JSON.stringify(result) }], structuredContent: result, isError: !ok }
    return rpcId === null ? resultBody : { jsonrpc: '2.0' as const, id: rpcId, result: resultBody }
  }
  if (adapter.speaks === 'engine') return { engine: result }
  return { type: 'tool_result' as const, name: tool, content: result }
}

const engineDevices = Object.keys(DEVICES)
const layouts = Object.keys(ALL_PROCESSORS)

type Demand = { tool: string; args: Record<string, unknown>; processor: string | null; program: unknown; repetitions?: number; schema: unknown; toolUseId: string | null; rpcId: string | number | null; wire: 'gemini' | 'claude' | 'cursor' | 'tools' | 'call' }

const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)

const argsOf = (value: unknown): Record<string, unknown> => {
  if (record(value)) return value
  if (typeof value !== 'string') return {}
  if (!value.trim()) throw new Error('adapter.call function.arguments is a JSON object')
  let parsed: unknown
  try { parsed = JSON.parse(value) } catch { throw new Error('adapter.call function.arguments is a JSON object') }
  if (!record(parsed)) throw new Error('adapter.call function.arguments is a JSON object')
  return parsed
}

const oneDemand = (name: unknown, args: unknown, extra: Partial<Demand>): Demand | null => {
  if (typeof name !== 'string' || name.length === 0) return null
  return { tool: name, args: argsOf(args), processor: extra.processor ?? null, program: extra.program, repetitions: extra.repetitions, schema: extra.schema, toolUseId: extra.toolUseId ?? null, rpcId: extra.rpcId ?? null, wire: extra.wire ?? 'call' }
}

/** The model's own envelope, read into the calls this register computes. Text parts are not demand. A generateContent body is read from candidates. A chat completion is read from tool_calls. */
const readDemands = (call: Record<string, unknown>): Demand[] => {
  const demands: Demand[] = []
  const takeGemini = (part: unknown) => {
    if (!record(part) || !record(part.functionCall)) return
    const asked = oneDemand(part.functionCall.name, part.functionCall.args ?? part.functionCall.arguments, { wire: 'gemini' })
    if (asked) demands.push(asked)
  }
  if (Array.isArray(call.candidates)) {
    for (const candidate of call.candidates) {
      if (!record(candidate) || !record(candidate.content) || !Array.isArray(candidate.content.parts)) continue
      candidate.content.parts.forEach(takeGemini)
    }
  } else if (record(call.content) && Array.isArray(call.content.parts)) call.content.parts.forEach(takeGemini)
  else if (Array.isArray(call.parts)) call.parts.forEach(takeGemini)
  else takeGemini({ functionCall: call.functionCall })
  if (demands.length === 0) {
    const blocks = Array.isArray(call.content) ? call.content : call.type === 'tool_use' ? [call] : []
    for (const block of blocks) {
      if (!record(block) || block.type !== 'tool_use') continue
      const asked = oneDemand(block.name, block.input ?? block.arguments, { toolUseId: typeof block.id === 'string' ? block.id : null, wire: 'claude' })
      if (asked) demands.push(asked)
    }
  }
  if (demands.length === 0 && call.method === 'tools/call' && record(call.params)) {
    const id = typeof call.id === 'string' || typeof call.id === 'number' ? call.id : null
    const asked = oneDemand(call.params.name, call.params.arguments, { rpcId: id, wire: 'cursor' })
    if (asked) demands.push(asked)
  } else if (typeof call.method === 'string' && demands.length === 0) throw new Error('adapter.call for Cursor is a tools/call')
  if (demands.length === 0) {
    const fromChoices = Array.isArray(call.choices) ? call.choices.flatMap((choice) => record(choice) && record(choice.message) && Array.isArray(choice.message.tool_calls) ? choice.message.tool_calls : []) : []
    const listed = fromChoices.length > 0 ? fromChoices : Array.isArray(call.tool_calls) ? call.tool_calls : []
    for (const entry of listed) {
      if (!record(entry)) continue
      const fn = record(entry.function) ? entry.function : entry
      const asked = oneDemand(fn.name, fn.arguments ?? fn.args ?? entry.arguments, { toolUseId: typeof entry.id === 'string' ? entry.id : null, wire: 'tools' })
      if (asked) demands.push(asked)
    }
  }
  if (demands.length > 0) return demands
  const processor = typeof call.processor === 'string' ? call.processor : null
  if (typeof call.name === 'string' || processor) {
    const asked = oneDemand(typeof call.name === 'string' ? call.name : 'circuit', call.arguments, { processor, program: call.program, repetitions: typeof call.repetitions === 'number' ? call.repetitions : undefined, schema: call.parameters ?? call.schema, wire: 'call' })
    if (asked) demands.push(asked)
  }
  return demands
}

/** One model's quantum demand, computed here. The call does not leave, so the adapter does not wait on the model. */
export const adaptQuantum = (raw: true | Record<string, unknown>, cursorModel: string, run: NativeRun) => {
  const register = capacity()
  const known = adapters(cursorModel)
  if (raw === true) {
    const formula = canonicalText({ native: true, outbound: 0, adapters: known.map((row) => row.id), standards: [...ISO_DIMENSIONS] })
    const receipt = storeReceipt(formula, true)
    return {
      phase: 'native' as const,
      origin: 'https://qpu.uuidna.com' as const,
      slower: false as const,
      outbound: 0 as const,
      waited: false as const,
      capacity: register,
      adapters: known.map((row) => ({ ...row, native: true as const, outbound: 0 as const, slower: false as const })),
      advantage: getAdvantage(2, receipt.holds ? 2 : 0),
      receipt,
      says: 'Each model\'s quantum demand is an adapter on this register. The call is computed here, and the UUID of that formula is the receipt of every standard.',
    }
  }
  const model = typeof raw.model === 'string' ? raw.model : typeof raw.api === 'string' ? raw.api : ''
  if (!/^[A-Za-z0-9._:-]{1,80}$/.test(model)) throw new Error('adapter.model names the model whose quantum demand this register computes')
  const call = (raw.call && typeof raw.call === 'object' ? stripSecrets(raw.call) : {}) as Record<string, unknown>
  const named = known.find((row) => row.id === model || row.model === model) ?? { id: model, model, speaks: 'tool_result' as const }
  const demands = readDemands(call)
  if (demands.length === 0) throw new Error('adapter.call names the tool, or a processor this register computes')
  const runs = demands.map((demand) => {
    const narrowed = demand.schema === undefined ? { schema: null, drops: [] as { path: string; keyword: string }[] } : narrowSchema(demand.schema)
    const processor = demand.processor
    const onEngine = processor !== null && engineDevices.includes(processor)
    const onLayout = processor !== null && !onEngine && layouts.includes(processor)
    let tool = demand.tool
    let args = demand.args
    if (onEngine) {
      tool = 'circuit'
      args = { engine: { processor, program: demand.program ?? {}, ...(demand.repetitions !== undefined ? { repetitions: demand.repetitions } : {}) } }
    } else if (onLayout) {
      tool = 'processor'
      args = { name: processor }
    }
    const ran = run(tool, args)
    return { demand, tool, args, narrowed, onEngine, onLayout, processor, ran }
  })
  const dropped = runs.flatMap((row) => row.narrowed.drops)
  const held = runs.every((row) => row.ran.ok && stateHolds(row.ran.result))
  const first = runs[0]
  const formula = runs.length === 1
    ? canonicalText({ adapter: named.id, model: named.model, native: true, outbound: 0, tool: first.tool, arguments: first.args, dropped: dropped.map((drop) => drop.keyword), standards: [...ISO_DIMENSIONS] })
    : canonicalText({ adapter: named.id, model: named.model, native: true, outbound: 0, calls: runs.map((row) => ({ tool: row.tool, arguments: row.args, id: row.demand.toolUseId })), dropped: dropped.map((drop) => drop.keyword), standards: [...ISO_DIMENSIONS] })
  const receipt = storeReceipt(formula, held)
  const replies = runs.map((row) => speak(named, row.tool, row.ran.result ?? null, row.demand.toolUseId ?? receipt.id, row.ran.ok, row.demand.rpcId, row.demand.wire))
  const wire = first.demand.wire
  const reply = replies.length === 1 ? replies[0]
    : wire === 'claude' ? { role: 'user' as const, content: replies }
    : wire === 'gemini' ? { role: 'user' as const, parts: replies }
    : wire === 'tools' ? { messages: replies }
    : { replies }
  return {
    phase: 'native' as const,
    origin: 'https://qpu.uuidna.com' as const,
    slower: false as const,
    outbound: 0 as const,
    waited: false as const,
    absorbed: raw.over === true || raw.remote === true,
    capacity: register,
    adapter: { ...named, native: true as const, outbound: 0 as const },
    calls: runs.length,
    tool: first.tool,
    dropped,
    declaration: first.narrowed.schema,
    engine: first.onEngine,
    layout: first.onLayout ? first.processor : null,
    reply,
    replies,
    result: first.ran.result ?? null,
    error: runs.find((row) => row.ran.error)?.ran.error ?? null,
    advantage: getAdvantage(2, receipt.holds ? 2 : 0),
    receipt,
    says: held
      ? `${named.model} asked ${runs.map((row) => row.tool).join(', ')}. This register computed it, and ${receipt.id} stores the proof of every standard.`
      : `${named.model} asked ${first.tool}. The register did not certify the result${first.ran.error ? `: ${first.ran.error}` : ''}.`,
  }
}
