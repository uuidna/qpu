// A minimal Payload config with the generated Lexical blocks and form fields, over an in-memory adapter: a form the workspace door read from
// a Forms Form is created, a Lexical document placing it validates, a FormResponse lands in form-submissions, an unknown block is refused.
import { test, after } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { WORKSPACE_FIXTURES as W } from './examples.js'
import { workspaceOf } from './workspace.js'

const site = createRequire(join(process.cwd(), 'site', 'package.json')), load = (m: string) => import(pathToFileURL(site.resolve(m)).href)
test('a Lexical form block validates and its submission lands in form-submissions', async () => {
  const [{ buildConfig, getPayload }, { formBuilderPlugin }, { BlocksFeature, lexicalEditor }, { qpuFormFields, qpuLexicalBlocks }] = await Promise.all([...['payload', '@payloadcms/plugin-form-builder', '@payloadcms/richtext-lexical'].map(load), import(pathToFileURL(join(process.cwd(), 'site', 'src', 'payload.qpu.lexical.ts')).href)])
  const rows: Record<string, any[]> = {}, eq = (d: any, w: any): boolean => !w || Object.entries(w).every(([k, v]: [string, any]) => (k === 'and' ? v.every((x: any) => eq(d, x)) : v?.equals === undefined || String(d[k]) === String(v.equals)))
  const find = async ({ collection, where }: any) => { const docs = (rows[collection] ?? []).filter((d) => eq(d, where)); return { docs, totalDocs: docs.length, page: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false } }
  const db = { name: 'memory', defaultIDType: 'text', init: ({ payload }: any) => ({ payload, name: 'memory', defaultIDType: 'text', find, count: async (a: any) => ({ totalDocs: (await find(a)).totalDocs }), findOne: async (a: any) => (await find(a)).docs[0] ?? null, create: async ({ collection, data }: any) => { const doc = { id: String((rows[collection] ??= []).length + 1), ...data }; rows[collection]!.push(doc); return doc } }) }
  const payload = await getPayload({ config: buildConfig({ secret: 'test', db, editor: lexicalEditor(), blocks: ['form', 'qpu'].map((slug) => ({ slug, fields: [{ name: slug, type: 'text' }] })), collections: [{ slug: 'pages', fields: [{ name: 'body', type: 'richText', editor: lexicalEditor({ features: ({ defaultFeatures }: any) => [...defaultFeatures, BlocksFeature({ blocks: qpuLexicalBlocks })] }) }] }], plugins: [formBuilderPlugin({ fields: qpuFormFields })] }) })
  const read = workspaceOf({ forms: workspaceOf({ form: W.form }).forms })
  const form = await payload.create({ collection: 'forms', data: { ...read.form, confirmationType: 'message', confirmationMessage: W.form.fields[4]!.message } })
  const block = (fields: object) => ({ root: { type: 'root', version: 1, direction: null, format: '', indent: 0, children: [{ type: 'block', version: 2, format: '', fields: { id: 'b', blockName: '', ...fields } }] } })
  await payload.create({ collection: 'pages', data: { body: block({ blockType: 'form', form: form.id }) } })
  await payload.create({ collection: 'pages', data: { body: block({ blockType: 'driveFile', fileId: '1AbC', name: 'Plan' }) } })
  await payload.create({ collection: 'form-submissions', data: { ...workspaceOf({ response: W.response }).submission, form: form.id } })
  assert.equal(rows['form-submissions']?.length, 1)
  assert.deepEqual(rows['forms']![0].fields.map((f: { blockType: string }) => f.blockType), W.form.fields.map((f) => f.blockType))
  await assert.rejects(payload.create({ collection: 'pages', data: { body: block({ blockType: 'nope' }) } }))
})
after(() => setImmediate(() => process.exit(process.exitCode ?? 0))) // Payload keeps its schedulers alive past the test
