// A minimal Payload config with the generated Lexical blocks and form fields, over an in-memory adapter: a form the workspace door read from
// a Forms Form is created, a Lexical document placing it validates, a FormResponse lands in form-submissions, an unknown block is refused; the
// witnesses bind every rich text field and Lexical block, one in a block in an array too.
import { test, after } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { readFileSync, readdirSync, mkdtempSync, mkdirSync, renameSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { pathToFileURL } from 'node:url'
import { WORKSPACE_FIXTURES as W } from './examples.ts'
import { readWorkspace } from './workspace.ts'
import { qpuHooksOf } from './blocks.ts'
import { readBinding0 } from './toolboxes/raid.ts'
import { register } from 'tsx/esm/api'

register() // the site's extensionless imports load through tsx; the tree runs on Node's own type stripping

const site = createRequire(join(process.cwd(), 'site', 'package.json')), load = (m: string) => import(pathToFileURL(site.resolve(m)).href)
test('a Lexical form block validates, its submission lands, every rich text field and Lexical block is witnessed, every plugin\'s records kept at binding 0 and verified against bit 0', async () => {
  const b0 = process.env.QPU_BINDING0 = mkdtempSync(join(tmpdir(), 'qpu-b0-')), { qpuRaid } = await import(pathToFileURL(join(process.cwd(), 'site', 'src', 'plugins', 'qpu.ts')).href)
  const [{ buildConfig, definePlugin, getPayload }, { formBuilderPlugin }, { seoPlugin }, { BlocksFeature, lexicalEditor }, { qpuFormFields, qpuLexicalBlocks }] = await Promise.all([...['payload', '@payloadcms/plugin-form-builder', '@payloadcms/plugin-seo', '@payloadcms/richtext-lexical'].map(load), import(pathToFileURL(join(process.cwd(), 'site', 'src', 'payload.qpu.lexical.ts')).href)])
  const rows: Record<string, any[]> = {}, eq = (d: any, w: any): boolean => !w || Object.entries(w).every(([k, v]: [string, any]) => (k === 'and' ? v.every((x: any) => eq(d, x)) : v?.equals === undefined || String(d[k]) === String(v.equals)))
  const find = async ({ collection, where }: any) => { const docs = (rows[collection] ?? []).filter((d) => eq(d, where)); return { docs, totalDocs: docs.length, page: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false } }
  const db = { name: 'memory', defaultIDType: 'text', init: ({ payload }: any) => ({ payload, name: 'memory', defaultIDType: 'text', find, count: async (a: any) => ({ totalDocs: (await find(a)).totalDocs }), findOne: async (a: any) => (await find(a)).docs[0] ?? null, create: async ({ collection, data }: any) => { const doc = { id: String((rows[collection] ??= []).length + 1), ...data }; rows[collection]!.push(doc); return doc } }) }
  const types = (pkg: string, ...at: string[]) => [...readFileSync(join(site.resolve(pkg), '..', ...at), 'utf8').split('hooks?: {')[1]!.split('};')[0]!.matchAll(/^\s+(\w+)\?:/gm)].map((m) => m[1]).sort()
  const { pairs } = qpuHooksOf({}), declared = (w: string) => (pairs as Record<string, { before?: string; after?: string }[]>)[w]!.flatMap((p) => [p.before, p.after].filter(Boolean)).sort()
  for (const w of ['collection', 'global', 'field']) assert.deepEqual(declared(w), types('payload', w + 's', 'config', 'types.d.ts'), w)
  assert.deepEqual(declared('node'), types('@payloadcms/richtext-lexical', 'features', 'typesServer.d.ts'))
  const editor = lexicalEditor({ features: ({ defaultFeatures }: any) => [...defaultFeatures, BlocksFeature({ blocks: qpuLexicalBlocks })] })
  const config = await buildConfig({ secret: 'test', db, editor: lexicalEditor(), blocks: ['form', 'qpu'].map((slug) => ({ slug, fields: [{ name: slug, type: 'text' }] })), collections: [{ slug: 'entries', fields: ['kind', 'from'].map((name) => ({ name, type: 'text' })).concat({ name: 'body', type: 'json' }) }, { slug: 'pages', fields: [{ name: 'body', type: 'richText', editor }, { name: 'items', type: 'array', fields: [{ name: 'layout', type: 'blocks', blocks: [{ slug: 'note', fields: [{ name: 'body', type: 'richText', editor }] }] }] }] }], plugins: [definePlugin({ slug: 'qpu-hooks', order: Number.MAX_SAFE_INTEGER, plugin: ({ config }: any) => qpuHooksOf(config).config })({}), formBuilderPlugin({ fields: qpuFormFields }), seoPlugin({ collections: ['pages'] }), qpuRaid({})] })
  const rich: any[] = [], walk = (fs: any[] = []) => { for (const f of fs) { if (f.type === 'richText') rich.push(f); for (const x of [...(f.tabs ?? []), ...(f.blocks ?? [])]) walk(x.fields); walk(f.fields) } }
  for (const c of [...config.collections, ...config.globals]) walk(c.fields)
  const w = rich[0].hooks, node = (f: any) => f.editor.editorConfig.features.nodeHooks.beforeChange.get('block')?.[0], blocks = rich.flatMap((f) => (f.editor.editorConfig.resolvedFeatureMap.get('blocks')?.sanitizedServerFeatureProps.blocks ?? []).map(() => f))
  assert.deepEqual([rich.filter((f) => Object.keys(w).every((h) => f.hooks[h].includes(w[h][0]))).length, rich.length, blocks.filter((f) => node(f) === node(rich[0])).length, blocks.length], [5, 5, 6, 6]) // two bodies, the form builder's three; form, qpu and driveFile in each editor
  const payload = await getPayload({ config }), context: Record<string, any> = {}
  const read = readWorkspace({ forms: readWorkspace({ form: W.form }).forms })
  const form = await payload.create({ collection: 'forms', data: { ...read.form, confirmationType: 'message', confirmationMessage: W.form.fields[4]!.message } })
  const block = (fields: object) => ({ root: { type: 'root', version: 1, direction: null, format: '', indent: 0, children: [{ type: 'block', version: 2, format: '', fields: { id: 'b', blockName: '', ...fields } }] } })
  await payload.create({ collection: 'pages', data: { body: block({ blockType: 'form', form: form.id }) } })
  const drive = block({ blockType: 'driveFile', fileId: '1AbC', name: 'Plan' }), keys = ['collection:pages:change', 'field:body:change', 'field:items.0.layout.0.body:change', 'node:b:change']
  await payload.create({ collection: 'pages', data: { body: drive, items: [{ layout: [{ blockType: 'note', body: drive }] }] }, context })
  const at = context.qpuWitness
  assert.deepEqual([keys.filter((k) => at[k]?.before && at[k].after && at[k].collapse < 14).length, at[keys[0]!].changed, at[keys[3]!].changed, context.qpuWitnessErrors], [4, true, false, undefined])
  await payload.create({ collection: 'form-submissions', data: { ...readWorkspace({ response: W.response }).submission, form: form.id } })
  assert.equal(rows['form-submissions']?.length, 1)
  assert.deepEqual(rows['forms']![0].fields.map((f: { blockType: string }) => f.blockType), W.form.fields.map((f) => f.blockType))
  await assert.rejects(payload.create({ collection: 'pages', data: { body: block({ blockType: 'nope' }) } }))
  // every plugin's collection (the form builder's two among them) read back from binding 0; then one version moved back to its first-four-digit
  // folder, and the qpu-raid-verify batch moves it to the UUID's middle and finds every version Payload holds on two verified copies or rebuilt at binding 0
  const files = () => Object.fromEntries(readdirSync(b0, { recursive: true }).map(String).filter((f) => /[\da-f-]{36}(\.latest)?$/.test(f)).map((f) => [f, readFileSync(join(b0, f), 'utf8')]))
  for (const c of ['pages', 'forms', 'form-submissions']) { const back = readBinding0(c, null, files()); assert.deepEqual([back.docs?.map((d) => d.id).sort(), back.refused], [rows[c]!.map((d) => d.id).sort(), []], c) }
  const moved = Object.keys(files()).find((f) => !f.endsWith('.latest'))!, id = moved.split('/').at(-1)!, legacy = join(b0, id.slice(0, 2), id.slice(2, 4), id)
  mkdirSync(join(legacy, '..'), { recursive: true }); renameSync(join(b0, moved), legacy)
  await config.jobs.tasks.find((t: { slug: string }) => t.slug === 'qpu-raid-verify').handler({ input: {}, req: { payload } })
  const v = rows['entries']!.at(-1).body
  const { filesystem: f, payload: p } = v.bindings
  assert.deepEqual([v.moves.length, v.refused, f.differ + p.differ, v.twoCopies + f.missing, v.rebuilt, readFileSync(join(b0, moved), 'utf8').length > 0], [1, [], 0, p.verified, f.missing + p.missing, true])
})
after(() => setImmediate(() => process.exit(process.exitCode ?? 0))) // Payload keeps its schedulers alive past the test
