// Payload's combinatorial surface handled programmatically: every schema (any collection's fields → JSON Schema 2020-12, the
// GraphQL type, the MCP tools of the plugin, the OpenAPI paths) and every combination of the surface (field types × operations,
// where operators × field types, hooks, access, realtime channels × operations), with the meaning and the naming taken from the
// textbook (the textbook_payload_* theorems: the key names the dimension, its statement says the meaning) and every count computed
// here from PAYLOAD_SURFACE and decided through the MCP's own theorems (the match tool serves the theorem the kernel accepted; a
// count the theorem does not state is a lead, never a rewrite). The sources are re-read by the textbook step; drift is a lead.
import type { Context } from '../toolbox.js'
import { PAYLOAD_SURFACE } from '../payload-surface.js'
import { TEXTBOOK_THEOREMS } from '../textbook-theorems.js'
import type { Lead } from '../leads.js'

type PayloadFieldConfig = { name?: string; type: string; required?: boolean; hasMany?: boolean; fields?: PayloadFieldConfig[]; blocks?: { slug: string; fields: PayloadFieldConfig[] }[]; tabs?: { name?: string; fields: PayloadFieldConfig[] }[]; options?: (string | { value: string })[]; relationTo?: string | string[]; label?: string }
export type PayloadCollectionInput = { slug: string; fields: PayloadFieldConfig[] }

const SCOPE_ORDER = ['collection', 'global', 'auth', 'access', 'preferences', 'jobs', 'custom', 'graphql'] as const
const HOOK_LEVELS = ['root', 'collection', 'global', 'field'] as const
const ACCESS_LEVELS = ['collection', 'global', 'field', 'jobs'] as const
const typeOf = (t: string) => PAYLOAD_SURFACE.fieldTypes.find((f) => f.type === t)

/** The counts of the surface, each a number a theorem states: computed from the table, never written by hand. */
const surfaceCountsOf = () => {
  const data = PAYLOAD_SURFACE.fieldTypes.filter((f) => f.data).length, presentational = PAYLOAD_SURFACE.fieldTypes.length - data
  const byScope = SCOPE_ORDER.map((s) => PAYLOAD_SURFACE.operations.filter((o) => o.scope === s).length)
  const collectionOps = byScope[0]!
  const hooks = HOOK_LEVELS.map((l) => (PAYLOAD_SURFACE.hooks as Record<string, readonly unknown[]>)[l]?.length ?? 0)
  const access = ACCESS_LEVELS.map((l) => (PAYLOAD_SURFACE.access as Record<string, readonly unknown[]>)[l]?.length ?? 0)
  return {
    fieldTypes: { data, presentational, total: PAYLOAD_SURFACE.fieldTypes.length, numbers: [data, presentational, PAYLOAD_SURFACE.fieldTypes.length] },
    operations: { byScope: Object.fromEntries(SCOPE_ORDER.map((s, i) => [s, byScope[i]])), total: PAYLOAD_SURFACE.operations.length, numbers: [...byScope, PAYLOAD_SURFACE.operations.length] },
    schemas: { dataTypes: data, collectionOperations: collectionOps, total: data * collectionOps, numbers: [data, collectionOps, data * collectionOps] },
    queries: { operators: PAYLOAD_SURFACE.whereOperators.length, dataTypes: data, total: PAYLOAD_SURFACE.whereOperators.length * data, numbers: [PAYLOAD_SURFACE.whereOperators.length, data, PAYLOAD_SURFACE.whereOperators.length * data] },
    hooks: { byLevel: Object.fromEntries(HOOK_LEVELS.map((l, i) => [l, hooks[i]])), total: hooks.reduce((a, b) => a + b, 0), numbers: [...hooks, hooks.reduce((a, b) => a + b, 0)] },
    access: { byLevel: Object.fromEntries(ACCESS_LEVELS.map((l, i) => [l, access[i]])), total: access.reduce((a, b) => a + b, 0), numbers: [...access, access.reduce((a, b) => a + b, 0)] },
    coordination: { channels: PAYLOAD_SURFACE.realtime.length, operations: PAYLOAD_SURFACE.operations.length, total: PAYLOAD_SURFACE.realtime.length * PAYLOAD_SURFACE.operations.length, numbers: [PAYLOAD_SURFACE.realtime.length, PAYLOAD_SURFACE.operations.length, PAYLOAD_SURFACE.realtime.length * PAYLOAD_SURFACE.operations.length] },
  }
}

/** The numbers a theorem's statement carries, in order: `theorem k : 19 + 4 = 23 := by decide` → [19, 4, 23]. */
export const numbersOfTheorem = (lean: string) => { const stmt = lean.slice(lean.indexOf(':') + 1, lean.includes(':=') ? lean.indexOf(':=') : undefined); return [...stmt.matchAll(/\d+/g)].map((m) => Number(m[0])) }

/** Every dimension of the surface named and meant by its textbook theorem, its count computed here and decided through the MCP. */
const dimensionsOf = (ctx: Context) => {
  const counts = surfaceCountsOf()
  const keys: Record<keyof typeof counts, string> = { fieldTypes: 'textbook_payload_field_types', operations: 'textbook_payload_operations', schemas: 'textbook_payload_schemas', queries: 'textbook_payload_queries', hooks: 'textbook_payload_hooks', access: 'textbook_payload_access', coordination: 'textbook_payload_coordination' }
  return (Object.keys(counts) as (keyof typeof counts)[]).map((dimension) => {
    const key = keys[dimension], theorem = TEXTBOOK_THEOREMS.find((t) => t.key === key)
    const computed = counts[dimension].numbers, stated = theorem ? numbersOfTheorem(theorem.lean) : []
    const agrees = theorem !== undefined && stated.length === computed.length && stated.every((n, i) => n === computed[i])
    const decided = ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'match', arguments: { statement: key.replace(/_/g, ' ') } } }) as { result?: { structuredContent?: { verdict?: string; theorem?: string } }; error?: { message: string } }
    const verdict = decided.result?.structuredContent?.verdict ?? 'unknown', served = decided.result?.structuredContent?.theorem === key
    const { numbers: _n, ...count } = counts[dimension]; void _n
    return { dimension, name: key, meaning: theorem?.says ?? null, count, computed, stated, agrees, decided: { verdict, theorem: decided.result?.structuredContent?.theorem ?? null, served }, lean: theorem?.lean ?? null }
  })
}

const graphqlScalarOf = (g: string | null) => g ? g.replace(/^GraphQL/, '').replace(/^(String|Int|Float|Boolean|ID|JSON|DateTime|JSONObject)$/, '$1') : 'JSON'

/** Any collection's fields as JSON Schema 2020-12, by the shape each field type generates (the table's own); nesting by recursion. */
const jsonSchemaOf = (fields: readonly PayloadFieldConfig[]): { type: 'object'; properties: Record<string, unknown>; required: string[]; additionalProperties: false } => {
  const properties: Record<string, unknown> = {}, required: string[] = []
  const add = (name: string, schema: unknown, req: boolean | undefined) => { properties[name] = schema; if (req) required.push(name) }
  for (const f of fields) {
    const t = typeOf(f.type)
    if (!t) { if (f.name) add(f.name, { description: `unknown field type ${f.type}: a lead` }, f.required); continue }
    if (f.type === 'row' || f.type === 'collapsible' || (f.type === 'tabs' && (f.tabs ?? []).every((tab) => !tab.name))) { const inner = jsonSchemaOf([...(f.fields ?? []), ...(f.tabs ?? []).flatMap((tab) => tab.fields)]); Object.assign(properties, inner.properties); required.push(...inner.required); continue }
    if (f.type === 'tabs') { for (const tab of f.tabs ?? []) { if (tab.name) add(tab.name, jsonSchemaOf(tab.fields), false); else { const inner = jsonSchemaOf(tab.fields); Object.assign(properties, inner.properties); required.push(...inner.required) } } continue }
    if (!f.name || !t.data) continue
    if (f.type === 'group') { add(f.name, jsonSchemaOf(f.fields ?? []), f.required); continue }
    if (f.type === 'array') { add(f.name, { type: ['array', 'null'], items: { ...jsonSchemaOf(f.fields ?? []), properties: { ...jsonSchemaOf(f.fields ?? []).properties, id: { type: ['string', 'null'] } } } }, f.required); continue }
    if (f.type === 'blocks') { add(f.name, { type: ['array', 'null'], items: (f.blocks ?? []).length ? { oneOf: (f.blocks ?? []).map((b) => { const s = jsonSchemaOf(b.fields); return { ...s, properties: { ...s.properties, blockType: { const: b.slug }, blockName: { type: ['string', 'null'] }, id: { type: ['string', 'null'] } }, required: [...s.required, 'blockType'] } }) } : {} }, f.required); continue }
    if (f.type === 'select' || f.type === 'radio') { const values = (f.options ?? []).map((o) => (typeof o === 'string' ? o : o.value)); const one = { type: ['string', 'null'], enum: [...values, null] }; add(f.name, f.hasMany ? { type: ['array', 'null'], items: { type: 'string', enum: values } } : one, f.required); continue }
    if (f.type === 'relationship' || f.type === 'upload') { const to = Array.isArray(f.relationTo) ? f.relationTo : [f.relationTo ?? 'unknown']; const one = to.length > 1 ? { oneOf: to.map((c) => ({ type: 'object', properties: { relationTo: { const: c }, value: { oneOf: [{ type: 'string' }, { type: 'object' }] } }, required: ['relationTo', 'value'] })) } : { oneOf: [{ type: 'string' }, { type: 'object' }] }; add(f.name, f.hasMany ? { type: ['array', 'null'], items: one } : { ...one, description: `relation to ${to.join(' | ')}` }, f.required); continue }
    const base = f.hasMany && t.jsonSchemaMany ? t.jsonSchemaMany : (t.jsonSchema ?? { description: `the shape ${f.type} generates is inferred` })
    add(f.name, base, f.required)
  }
  return { type: 'object', properties, required, additionalProperties: false }
}

/** The GraphQL type of a collection, in SDL, from the type each field type maps to. */
const graphqlOf = (slug: string, fields: readonly PayloadFieldConfig[]): string => {
  const Type = slug.replace(/(^|[-_])(\w)/g, (_, __, c: string) => c.toUpperCase())
  const lines = fields.flatMap(function line(f): string[] {
    const t = typeOf(f.type)
    if (!t) return []
    if (f.type === 'row' || f.type === 'collapsible') return (f.fields ?? []).flatMap(line)
    if (f.type === 'tabs') return (f.tabs ?? []).flatMap((tab) => (tab.name ? [`  ${tab.name}: ${Type}_${tab.name}`] : tab.fields.flatMap(line)))
    if (!f.name || !t.data) return []
    const scalar = f.type === 'group' || f.type === 'array' ? `${Type}_${f.name}` : f.type === 'blocks' ? `${Type}_${f.name}_Block` : f.type === 'relationship' || f.type === 'upload' ? (Array.isArray(f.relationTo) ? `${Type}_${f.name}_Relationship` : (f.relationTo ?? 'JSON').replace(/(^|[-_])(\w)/g, (_, __, c: string) => c.toUpperCase())) : graphqlScalarOf(t.graphql)
    const many = f.type === 'array' || f.type === 'blocks' || f.hasMany
    return [`  ${f.name}: ${many ? `[${scalar}!]` : scalar}${f.required ? '!' : ''}`]
  })
  return `type ${Type} {\n  id: String!\n${lines.join('\n')}\n  createdAt: DateTime!\n  updatedAt: DateTime!\n}`
}

/** The MCP tools the plugin exposes for a collection (its config keys over the plugin's tool names), each with the input schema computed here. */
const mcpToolsOf = (slug: string, fields: readonly PayloadFieldConfig[]) => {
  const data = jsonSchemaOf(fields)
  const where = { type: 'object', description: `Where: { [path]: { [operator]: value }, and?, or? } over ${PAYLOAD_SURFACE.whereOperators.length} operators (${PAYLOAD_SURFACE.whereOperators.map((w) => w.operator).join(', ')})` }
  return PAYLOAD_SURFACE.mcp.tools.filter((t) => t.scope === 'collection').map((t) => ({ name: t.name, configKey: t.configKey, does: t.does, inputSchema: { type: 'object', properties: { collection: { const: slug }, ...(t.configKey === 'find' || t.configKey === 'count' || t.configKey === 'findDistinct' ? { where, limit: { type: 'integer' }, page: { type: 'integer' }, sort: { type: 'string' }, depth: { type: 'integer' } } : {}), ...(t.configKey === 'update' || t.configKey === 'delete' || t.configKey === 'duplicate' || t.configKey === 'findVersionByID' || t.configKey === 'restoreVersion' ? { id: { type: 'string' } } : {}), ...(t.configKey === 'create' || t.configKey === 'update' ? { data } : {}) } } }))
}

/** The OpenAPI 3.1 paths of a collection: every collection operation's REST method and path with the slug substituted, the data schema the collection's. */
const openapiPathsOf = (slug: string, fields: readonly PayloadFieldConfig[]) => {
  const schema = jsonSchemaOf(fields)
  const paths: Record<string, Record<string, unknown>> = {}
  for (const o of PAYLOAD_SURFACE.operations) {
    const rest = o.rest && 'path' in o.rest && typeof (o.rest as { path?: unknown }).path === 'string' ? (o.rest as { method: string; path: string }) : null
    if (o.scope !== 'collection' || !rest) continue
    const path = rest.path.replace('{collection}', slug)
    paths[path] = { ...(paths[path] ?? {}), [rest.method.toLowerCase()]: { operationId: `${o.name}${o.variant ? `-${o.variant}` : ''}-${slug}`, ...(rest.method === 'POST' || rest.method === 'PATCH' ? { requestBody: { content: { 'application/json': { schema } } } } : {}), responses: { 200: { description: `${o.name} on ${slug}` }, 404: { description: 'no document; a block answers the page computed from the id' } }, externalDocs: { url: o.url } } }
  }
  return paths
}

/** The realtime coordination: every channel over every operation it touches, coordinated by the content address (the collision guard), never a socket of its own. */
const coordinationOf = () => PAYLOAD_SURFACE.realtime.map((r) => ({ channel: r.name, transport: r.transport, mechanism: r.mechanism, operations: PAYLOAD_SURFACE.operations.filter((o) => /autosave|lock|schedule|job/i.test(r.name) ? /update|version|job|lock/i.test(o.name) : /preview/i.test(r.name) ? /find|update/i.test(o.name) : /mcp/i.test(r.name) ? o.scope === 'collection' || o.scope === 'global' : false).map((o) => o.name), coordinatedBy: 'the content address the edit names (If-Match, context.prev, editBase): accepted while the document still folds to it, a collision answered with both addresses', url: r.url }))

/** The surface re-read from its sources (the client fetched them; text by url) and compared to the table: every differing count a lead. */
const rereadOf = (answers: Record<string, string>) => {
  const text = (part: string) => Object.entries(answers).find(([u]) => u.includes(part))?.[1]
  const types = text('fields/config/types.ts'), constants = text('types/constants.ts'), endpoints = text('collections/endpoints/index.ts')
  const union = types ? (() => { const i = types.indexOf('export type Field ='); if (i < 0) return null; const body = types.slice(i, types.indexOf('\n\n', i) > 0 ? types.indexOf('\n\n', i) : undefined); return [...body.matchAll(/\|\s*([A-Z][A-Za-z]*Field)\b/g)].map((m) => m[1]!) })() : null
  const operators = constants ? (() => { const i = constants.indexOf('validOperators'); if (i < 0) return null; const body = constants.slice(i, constants.indexOf(']', i) + 1); return [...body.matchAll(/'([a-z_]+)'/g)].map((m) => m[1]!) })() : null
  const sourceEndpoints = endpoints ? (() => { const live = endpoints.split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n'); return [...live.matchAll(/method:\s*'(\w+)'[^}]*?path:\s*'([^']*)'/g)].map((m) => `${m[1]!.toUpperCase()} /api/{collection}${m[2]!.replace(/\/:(\w+)\?/g, '/{$1}').replace(/\/:(\w+)/g, '/{$1}').replace(/\/$/, '')}`).sort() })() : null
  const heldEndpoints = [...new Set(PAYLOAD_SURFACE.operations.filter((o) => o.rest && 'path' in o.rest && typeof (o.rest as { path?: unknown }).path === 'string' && (o.rest as { path: string }).path.startsWith('/api/{collection}')).map((o) => `${(o.rest as { method: string }).method.toUpperCase()} ${(o.rest as { path: string }).path.replace(/\{(\w+)\?\}/g, '{$1}').replace(/\?.*$/, '')}`))].sort()
  const restOps = sourceEndpoints?.length ?? null, heldRest = heldEndpoints.length
  const endpointDrift = sourceEndpoints ? { missingInTable: sourceEndpoints.filter((e) => !heldEndpoints.includes(e)), missingInSource: heldEndpoints.filter((e) => !sourceEndpoints.includes(e)) } : null
  const measures = [
    { measure: 'field types', held: PAYLOAD_SURFACE.fieldTypes.length, read: union?.length ?? null, source: 'packages/payload/src/fields/config/types.ts (the Field union)', detail: union },
    { measure: 'where operators', held: PAYLOAD_SURFACE.whereOperators.length, read: operators?.length ?? null, source: 'packages/payload/src/types/constants.ts (validOperators)', detail: operators },
    { measure: 'collection REST endpoints', held: heldRest, read: restOps, source: 'packages/payload/src/collections/endpoints/index.ts (method and path, comments excluded)', detail: endpointDrift },
  ]
  const leads: Lead[] = measures.filter((m) => m.read !== null && m.read !== m.held).map((m) => ({ id: `payload-surface-${m.measure.replace(/\s+/g, '-')}`, statement: `Payload's ${m.measure} read from ${m.source}: ${m.read}; the table holds ${m.held}: the surface moved, the table and its theorems follow`, status: 'open' as const, reason: 'drift between the source and the table: a count the kernel stated no longer matches what the source lists' } as Lead))
  return { answered: Object.keys(answers).length, measures, unread: measures.filter((m) => m.read === null).map((m) => m.measure), agree: measures.filter((m) => m.read !== null).every((m) => m.read === m.held), leads }
}

export const schemasOf = (ctx: Context, input: { collection?: PayloadCollectionInput; answers?: Record<string, string> }) => {
  const collection = input.collection ?? { slug: 'entries', fields: [{ name: 'kind', type: 'text', required: true }, { name: 'from', type: 'text', required: true }, { name: 'body', type: 'json' }, { name: 'links', type: 'relationship', relationTo: 'entries', hasMany: true }, { name: 'date', type: 'date' }, { name: 'status', type: 'select', options: ['committed', 'revealed'] }] }
  const dimensions = dimensionsOf(ctx)
  const schema = { slug: collection.slug, jsonSchema: jsonSchemaOf(collection.fields), graphql: graphqlOf(collection.slug, collection.fields), mcpTools: mcpToolsOf(collection.slug, collection.fields), openapiPaths: openapiPathsOf(collection.slug, collection.fields) }
  const standards = PAYLOAD_SURFACE.standards.map((s) => ({ id: s.id, standard: s.standard, canonical: s.canonical, describes: s.describes }))
  const requestList = PAYLOAD_SURFACE.sources.map((url, i) => ({ id: `payload-source-${i + 1}`, method: 'GET' as const, url, verifier: 'the source text: the Field union, validOperators and the endpoints counted and compared to the table' }))
  const reread = input.answers ? rereadOf(input.answers) : null
  return {
    phase: (reread ? 'reread' : 'plan') as 'reread' | 'plan',
    readOn: PAYLOAD_SURFACE.readOn, docs: PAYLOAD_SURFACE.docs,
    dimensions, agreeing: dimensions.filter((d) => d.agrees).length, served: dimensions.filter((d) => d.decided.served).length,
    schema, standards, coordination: coordinationOf(), mcp: { package: PAYLOAD_SURFACE.mcp.package, path: PAYLOAD_SURFACE.mcp.path, transport: PAYLOAD_SURFACE.mcp.transport, auth: PAYLOAD_SURFACE.mcp.auth, tools: PAYLOAD_SURFACE.mcp.tools.length },
    requestList, reread,
    leads: [...(reread?.leads ?? []), ...dimensions.filter((d) => !d.agrees).map((d) => ({ id: `payload-theorem-${d.dimension}`, statement: `the dimension ${d.dimension} computes ${d.computed.join(', ')} and its theorem ${d.name} states ${d.stated.join(', ') || 'nothing'}: the theorem follows the table`, status: 'open' as const, reason: 'a count the table computes that the kernel has not stated' } as Lead))],
    says: 'every schema handled programmatically from the table alone (JSON Schema 2020-12, GraphQL, the plugin\'s MCP tools, OpenAPI 3.1 paths), every dimension named and meant by its textbook theorem, every count computed here and decided through the MCP\'s match tool; the sources re-read by the textbook step, drift a lead',
  }
}
