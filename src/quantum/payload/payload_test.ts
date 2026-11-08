import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { call, handleBatch } from '../processing/mcp.ts'
import { channel } from '../uuid/index.ts'
import { DEPLOY_STAGES, deployCommand } from './deploy.ts'
import { deployWorkflow } from './waves.ts'
import { findPage, pageData, savePage, writeArgs, findArgs, recordAgrees, seedsSynced, syncSeeds, mcpPages } from './index.ts'
import { mcpHostList } from '../processing/discovery.ts'
import { TOOLBOXES } from '../processing/mcp.ts'

const text = 'A coil is one sealed UUID.'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: pages are stored with Payload find, then create, then update. */
test('pages are stored with Payload find, then create, then update', async () => {
  const store = new Map<string, { id: string; slug: string }>()
  const calls: string[] = []
  const payload = {
    find: async (args: ReturnType<typeof findArgs>) => {
      calls.push('find')
      assert.equal(args.collection, 'pages')
      assert.equal(args.draft, true)
      assert.equal(args.overrideAccess, true)
      assert.equal(args.limit, 1)
      const doc = store.get(args.where.slug.equals)
      return { docs: doc ? [doc as never] : [] }
    },
    create: async (args: ReturnType<typeof writeArgs>) => {
      calls.push('create')
      assert.equal(args.collection, 'pages')
      assert.equal(args.draft, true)
      assert.equal(args.overrideAccess, true)
      assert.equal(args.context.disableRevalidate, true)
      assert.equal(args.data.slug, 'a-coil-is-one-sealed-uuid')
      assert.equal(args.data._status, 'draft')
      assert.equal(args.data.hero.type, 'default')
      assert.equal(args.data.layout[0]!.blockType, 'content')
      assert.equal(args.data.layout[0]!.contentFields.layout, 'oneColumn')
      assert.equal(args.data.meta.title, text)
      assert.equal('id' in args.data, false)
      assert.equal('breadcrumbs' in args.data, false)
      const doc = { ...args.data, id: 'page-1' }
      store.set(args.data.slug, doc)
      return doc
    },
    update: async (args: ReturnType<typeof writeArgs> & { id: string | number }) => {
      calls.push('update')
      assert.equal(args.id, 'page-1')
      assert.equal(args.collection, 'pages')
      const doc = { ...args.data, id: args.id }
      store.set(args.data.slug, doc as { id: string; slug: string })
      return doc
    },
  }
  const created = await savePage(payload, text, text)
  const updated = await savePage(payload, text, text)
  const found = await findPage(payload, 'a-coil-is-one-sealed-uuid')
  assert.equal(created.id, 'page-1')
  assert.equal(updated.id, 'page-1')
  assert.equal(found?.slug, 'a-coil-is-one-sealed-uuid')
  assert.deepEqual(calls, ['find', 'create', 'find', 'update', 'find'])
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: deploy is allowed when the current records agree with the seeds. */
test('deploy is allowed when the current records agree with the seeds', async () => {
  const text = 'the chess players are the players of every other game'
  const { page } = pageData('chess', text)
  const store = new Map<string, ReturnType<typeof writeArgs>['data'] & { id: string }>()
  const payload = {
    find: async (args: ReturnType<typeof findArgs>) => ({ docs: store.has(args.where.slug.equals) ? [store.get(args.where.slug.equals)!] : [] }),
    create: async (args: ReturnType<typeof writeArgs>) => { const doc = { ...args.data, id: 'page-chess', breadcrumbs: [{ url: `/${args.data.slug}`, label: args.data.title }] }; store.set(args.data.slug, doc); return doc },
    update: async (args: ReturnType<typeof writeArgs> & { id: string | number }) => { const doc = { ...args.data, id: String(args.id), breadcrumbs: [{ url: `/${args.data.slug}`, label: args.data.title }] }; store.set(args.data.slug, doc); return doc },
  }
  const closed = await seedsSynced(payload, [page])
  const seeded = await syncSeeds(payload, [page])
  const open = await seedsSynced(payload, [page])
  const drifted = { ...store.get(page.slug)!, title: 'other' }
  store.set(page.slug, drifted)
  const refused = await seedsSynced(payload, [page])
  assert.equal(recordAgrees(null, page), false)
  assert.equal(closed.allowsDeploy, false)
  assert.equal(seeded.written, 1)
  assert.equal(seeded.allowsDeploy, true)
  assert.equal(open.allowsDeploy, true)
  assert.equal(open.written, 0)
  assert.equal(refused.allowsDeploy, false)
  assert.equal(store.get(page.slug)?.layout[0]?.contentFields.columnOne.root.children[0]?.children[0]?.text, text)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the Cloudflare workflow is the Payload deploy. */
test('the Cloudflare workflow is the Payload deploy', () => {
  const workflow = deployWorkflow()
  const file = readFileSync(new URL('../../../.github/workflows/deploy.yml', import.meta.url), 'utf8')
  assert.equal(file.replace(/\n$/, ''), workflow.replace(/\n$/, ''))
  const pkg = JSON.parse(readFileSync(new URL('../../../package.json', import.meta.url), 'utf8')) as { scripts: { deploy: string } }
  assert.equal(pkg.scripts.deploy, deployCommand())
  assert.deepEqual(DEPLOY_STAGES.map((stage) => stage.id), ['database', 'seed', 'check', 'app', 'smoke', 'logs'])
  assert.equal(workflow.includes('pnpm run deploy:app'), true)
  assert.equal(workflow.includes('query Worker logs'), true)
  assert.equal(workflow.includes('https://qpu.uuidna.com/admin'), true)
  assert.equal(workflow.includes('https://qpu.psg.bg/admin/login'), true)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: nested docs covers every MCP URL, and the website plugins read those pages. */
test('nested docs covers every MCP URL, and the website plugins read those pages', () => {
  const tools = TOOLBOXES.flatMap((box) => box.tools.map((tool) => ({ name: tool.name, toolbox: box.name, description: tool.description })))
  const hosts = mcpHostList()
  const seeded = mcpPages(tools, hosts)
  const root = seeded.pages[0]!
  const tool = seeded.pages.find((page) => page.kind === 'tool')!
  const toolbox = seeded.pages.find((page) => page.id === tool.parentId)!
  const host = hosts[0]!
  const hostPage = seeded.pages.find((page) => page.kind === 'host' && page.title === host.name)!
  const leaf = [...seeded.pages].reverse().find((page) => page.kind === 'path' && page.url.startsWith(`${hostPage.url}/`))!
  const order = seeded.pages.every((page) => page.parentId === null || seeded.pages.findIndex((row) => row.id === page.parentId) < seeded.pages.findIndex((row) => row.id === page.id))
  const written = seeded.pages.map((page) => writeArgs(page).data)
  const shared = seeded.pages.filter((page) => page.slug === 'mcp')
  assert.equal(seeded.via, 'seeds')
  assert.equal(seeded.manual, false)
  assert.equal(seeded.unique, true)
  assert.equal(seeded.pages.every((page) => page._status === 'published'), true)
  assert.equal(root.slug, 'mcp')
  assert.equal(root.parentId, null)
  assert.equal(root.url, '/mcp')
  assert.equal(order, true)
  assert.equal(tool.url, `/mcp/${toolbox.slug}/${tool.slug}`)
  assert.equal(tool.breadcrumbs.at(-1)?.url, tool.url)
  assert.equal(seeded.pages.filter((page) => page.kind === 'tool').length, tools.length)
  assert.equal(seeded.pages.filter((page) => page.kind === 'collection').length, 15)
  assert.equal(seeded.pages.find((page) => page.kind === 'collection' && page.slug === 'case-studies')?.url, '/mcp/case-studies')
  assert.equal(hostPage.url, `/mcp/${hostPage.slug}`)
  assert.equal(leaf.url.startsWith(`${hostPage.url}/`), true)
  assert.equal(leaf.layout[0]?.contentFields.columnOne.root.children.some((block) => block.children.some((child) => child.text === host.url)), true)
  assert.equal(shared.length > 1 && new Set(shared.map((page) => page.url)).size === shared.length, true)
  assert.equal(seeded.plugins['nested-docs'].urls.includes(tool.url), true)
  assert.equal(seeded.plugins.seo.urls.includes(`https://qpu.uuidna.com${tool.url}`), true)
  assert.equal(seeded.plugins.search.priority, 10)
  assert.equal(seeded.plugins.search.collections.includes('pages') && !seeded.plugins.search.collections.includes('users'), true)
  assert.equal(seeded.plugins.mcp.tool, 'findDocuments')
  assert.equal(seeded.plugins.mcp.path, '/api/mcp')
  assert.equal(seeded.plugins.mcp.where.some((where) => where.slug.equals === tool.slug), true)
  assert.deepEqual(seeded.plugins.stripe.sync, [])
  assert.equal(seeded.plugins['form-builder'].forms, 0)
  assert.equal(seeded.plugins['import-export'].collections.find((row) => row.slug === 'users')?.import, false)
  assert.equal(seeded.pages.find((page) => page.kind === 'route' && page.slug === 'finddocuments')?.url, '/mcp/finddocuments')
  assert.equal(seeded.pages.some((page) => page.title.includes('payload-rbac') || page.slug.includes('payload-rbac')), false)
  assert.equal(written.every((data) => !('parentId' in data) && !('kind' in data) && !('url' in data) && data.layout[0]?.blockType === 'content'), true)
  assert.equal(new Set(hosts.map((row) => row.url)).size, hosts.length)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: an idea is the same pages document the local API writes. */
test('an idea is the same pages document the local API writes', () => {
  const s = call('payload', { idea: text }).result!.structuredContent
  const built = pageData(text, text)
  assert.equal(s.page.slug, 'a-coil-is-one-sealed-uuid')
  assert.deepEqual(s.find, findArgs(built.page.slug))
  assert.deepEqual(s.create, writeArgs(built.page))
  assert.equal(s.create.data.layout[0].contentFields.columnOne.root.children[0].children[0].text, text)
  assert.equal(built.page.sku, channel(built.page.id).sku)
  assert.equal(s.page.sku, built.page.sku)
  assert.equal(s.create.data.sku, built.page.sku)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: mcp variants managed by the hooks cover every tool. */
test('mcp variants managed by the hooks cover every tool', () => {
  const a = call('payload', { variants: 'one' }).result!.structuredContent as { phase: string; standard: string; variants: number; documented: number; catalogue: number; combinations: number; textbooks: number; mcp: number; formulas: { presentations: { locales: number; value: number }; sitemapCapacity: { value: number }; pluginCombinations: { plugins: number; value: number } }; coverage: { max: boolean; autonomous: boolean; managed: number; complete: number; variants: number; percent: number; because: string }; improvement: { holds: boolean; complete: number; of: number; fetched: boolean; written: boolean }; next: { holds: boolean; clause: string; decision: string; accepted: number; refused: number; of: number; id: string; from: string; executable: boolean; kept: boolean; back: boolean; around: boolean; places: number; aspects: number; all: boolean; walked: boolean; fetched: boolean; written: boolean; tool: string; arguments: { variants: boolean } }; products: { product: string; kind: string; autonomous: boolean; improved: boolean; end: { complete: boolean; decision: string; monitor: string } | null; iso: { documented: boolean; standard: string } }[] }
  const b = call('payload', { variants: { other: true } }).result!.structuredContent as { variants: number; mcp: number; next: { id: string } }
  assert.equal(a.phase, 'iso')
  assert.equal(a.standard, 'ISO 9001')
  assert.equal(a.variants, b.variants)
  assert.equal(a.mcp, b.mcp)
  assert.equal(a.formulas.presentations.value, 10 * a.formulas.presentations.locales)
  assert.equal(a.formulas.sitemapCapacity.value, 50000 * 50000)
  assert.equal(a.formulas.pluginCombinations.value, 2 ** a.formulas.pluginCombinations.plugins)
  assert.equal(a.combinations, a.formulas.pluginCombinations.value)
  assert.equal(a.catalogue + a.combinations + a.textbooks + a.mcp, a.variants)
  assert.equal(a.documented, a.variants)
  assert.equal(a.coverage.max, true)
  assert.equal(a.coverage.autonomous, true)
  assert.equal(a.coverage.because, 'automation')
  assert.equal(a.coverage.managed, a.coverage.variants)
  assert.equal(a.coverage.complete, a.mcp)
  assert.equal(a.coverage.percent, 100)
  assert.equal(a.improvement.holds, true)
  assert.equal(a.improvement.complete, a.improvement.of)
  assert.equal(a.improvement.fetched, false)
  assert.equal(a.improvement.written, false)
  assert.equal(a.next.holds, true)
  assert.equal(a.next.clause, 'ISO 9001:2015, 9.3')
  assert.equal(a.next.decision, 'accept')
  assert.equal(a.next.accepted, a.mcp)
  assert.equal(a.next.refused, 0)
  assert.equal(a.next.of, a.mcp)
  assert.equal(a.next.id, b.next.id)
  assert.notEqual(a.next.id, a.next.from)
  assert.equal(a.next.executable, true)
  assert.equal(a.next.kept, true)
  assert.equal(a.next.back, true)
  assert.equal(a.next.around, true)
  assert.equal(a.next.places, 10)
  assert.equal(a.next.aspects, 4)
  assert.equal(a.next.all, true)
  assert.equal(a.next.walked, false)
  assert.equal(a.next.fetched, false)
  assert.equal(a.next.written, false)
  assert.equal(a.next.tool, 'payload')
  assert.equal(a.next.arguments.variants, true)
  assert.ok(a.products.filter((p) => p.kind === 'mcp').every((p) => p.product === 'mcp' && p.autonomous && p.improved && p.end?.complete === true && p.end.decision === 'accept' && p.end.monitor === 'ISO 9001:2015, 9.1' && p.iso.standard === 'ISO 9001' && p.iso.documented))
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the website's pages are the memory, and a page is processed after its parent. */
test('the website\'s pages are the memory, and a page is processed after its parent', () => {
  const asked = call('payload', { parent: true }).result!.structuredContent as { memory: string; processing: string; find: { collection: string; page: number; pagination?: boolean }; docs?: unknown; rbac: { calls: { action: string; access: boolean }[] } }
  assert.equal(asked.memory, 'website')
  assert.equal(asked.processing, 'website')
  assert.equal(asked.find.collection, 'pages')
  assert.equal(asked.find.page, 1)
  assert.equal(asked.find.pagination, undefined)
  assert.equal(asked.rbac.calls.find((c) => c.action === 'read')!.access, true)
  assert.equal(asked.docs, undefined)
  const refused = call('payload', { parent: true, role: 'guest' }).result!.structuredContent as { find?: unknown; says: string }
  assert.equal(refused.find, undefined)
  assert.match(refused.says, /guest may not batch a read/)
  const docs = [{ id: 2, title: 'src/access', slug: 'srcaccess', parent: 'src' }, { id: 3, title: 'src/quantum', slug: 'srcquantum', parent: { slug: 'src' } }, { id: 1, title: 'src', slug: 'src', parent: null }]
  const s = call('payload', { parent: { docs } }).result!.structuredContent as { memory: string; processing: string; merged: boolean; docs: { slug: string; title: string; order: number; depth: number }[] }
  assert.equal(s.memory, 'website')
  assert.equal(s.processing, 'website')
  assert.equal(s.merged, true)
  assert.deepEqual(s.docs.map((doc) => doc.slug), ['src', 'srcaccess', 'srcquantum'])
  assert.deepEqual(s.docs.map((doc) => doc.title), ['src', 'src/access', 'src/quantum'])
  assert.deepEqual(s.docs.map((doc) => doc.depth), [0, 1, 1])
  assert.equal(s.docs.length, docs.length)
  const continued = call('payload', { parent: { docs, page: 1, hasNextPage: true, nextPage: 2 } }).result!.structuredContent as { find: { page: number }; hasNextPage: boolean }
  assert.equal(continued.hasNextPage, true)
  assert.equal(continued.find.page, 2)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the Payload API manages a whole collection or any one collection. */
test('the Payload API manages a whole collection or any one collection', () => {
  const pages = call('payload', { api: true }).result!.structuredContent as { managedBy: string; api: string; access: boolean; args: { collection: string; page: number; pagination?: boolean } }
  assert.equal(pages.managedBy, 'payload')
  assert.equal(pages.api, 'find')
  assert.equal(pages.access, true)
  assert.equal(pages.args.collection, 'pages')
  assert.equal(pages.args.page, 1)
  assert.equal(pages.args.pagination, undefined)
  const orders = call('payload', { api: { collection: 'orders', action: 'find', role: 'reader' } }).result!.structuredContent as { subject: string; args: { collection: string } }
  assert.equal(orders.subject, 'apis')
  assert.equal(orders.args.collection, 'orders')
  const refused = call('payload', { api: { collection: 'entries', action: 'delete', role: 'reader' } }).result!.structuredContent as { access: boolean; args?: unknown; says: string }
  assert.equal(refused.access, false)
  assert.equal(refused.args, undefined)
  assert.match(refused.says, /reader may not delete entries/)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a build finds through the Payload MCP door, one page of the arguments that door declares. */
test('a build finds through the Payload MCP door, one page of the arguments that door declares', () => {
  const list = JSON.stringify({ jsonrpc: '2.0', id: 1, result: { tools: [{ name: 'findDocuments', inputSchema: { properties: { slug: {}, where: {}, limit: { default: 10 }, page: {}, depth: {}, select: {} } } }, { name: 'updateDocument', inputSchema: { properties: { slug: {}, id: {}, data: {} } } }] } })
  const find = call('payload', { theorems: true, payloadUrl: 'https://payload.example', answers: { list } }).result!.structuredContent as { phase: string; requestList: { body: { params: { name: string; arguments: Record<string, unknown> } } }[] }
  const asked = find.requestList[0]!.body.params.arguments
  assert.equal(find.phase, 'find')
  assert.equal(find.requestList[0]!.body.params.name, 'findDocuments')
  assert.equal(asked.slug, 'pages')
  assert.deepEqual(asked.where, { 'layout.blockType': { equals: 'qpu' } })
  assert.equal(asked.limit, 10)
  assert.equal(asked.depth, 0)
  assert.deepEqual(asked.select, { id: true, layout: true })
  assert.equal(asked.page, undefined)
  assert.equal('pagination' in asked, false)
  const found = JSON.stringify({ jsonrpc: '2.0', id: 2, result: { structuredContent: { docs: [{ id: 'p1', layout: [{ blockType: 'qpu', tool: 'configure', arguments: { kind: 'payload' }, theorem: null }] }], page: 1, hasNextPage: true, nextPage: 2, totalDocs: 11 } } })
  const built = call('payload', { theorems: true, payloadUrl: 'https://payload.example', answers: { list, found } }).result!.structuredContent as { phase: string; hasNextPage: boolean; page: number; requestList: { id: string; body: { params: { arguments: { page?: number; data?: { layout: { theorem?: string }[] } } } } }[] }
  assert.equal(built.phase, 'update')
  assert.equal(built.hasNextPage, true)
  assert.equal(built.page, 1)
  assert.equal(built.requestList[0]!.body.params.arguments.data!.layout[0]!.theorem, 'textbook_plugin_combinations')
  assert.equal(built.requestList.at(-1)!.id, 'payload-mcp-find-2')
  assert.equal(built.requestList.at(-1)!.body.params.arguments.page, 2)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a batch action is the operation it repeats, and RBAC decides that operation. */
test('a batch action is the operation it repeats, and RBAC decides that operation', () => {
  const reader = call('payload', { rbac: { subject: 'mcps', action: 'batch', role: 'reader' } }).result!.structuredContent as { action: string; access: boolean; calls: { action: string; access: boolean }[] }
  const admin = call('payload', { rbac: { subject: 'mcps', action: 'batch', role: 'admin' } }).result!.structuredContent as { access: boolean; calls: { action: string; access: boolean }[] }
  const of = (calls: { action: string; access: boolean }[], action: string) => calls.find((c) => c.action === action)!.access
  assert.equal(reader.action, 'batch')
  assert.equal(of(reader.calls, 'read'), true)
  assert.equal(of(reader.calls, 'create'), false)
  assert.equal(of(reader.calls, 'update'), false)
  assert.equal(of(reader.calls, 'delete'), false)
  assert.equal(reader.access, false)
  assert.equal(admin.access, true)
  assert.ok(admin.calls.every((c) => c.access))
  const replies = handleBatch([
    { jsonrpc: '2.0', id: 1, method: 'tools/list', params: { role: 'reader', tools: 'payload' } },
    { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { role: 'reader', name: 'fold', arguments: { radices: [2], index: '0' } } },
  ]) as { result?: { tools: unknown[] }; error?: { message: string; data: { rbac: { action: string; access: boolean } } } }[]
  assert.ok(replies[0]!.result!.tools.length >= 1)
  assert.equal(replies[1]!.error!.data.rbac.action, 'create')
  assert.equal(replies[1]!.error!.data.rbac.access, false)
  assert.match(replies[1]!.error!.message, /reader may not create/)
  const grant = call('payload', { rbac: true }).result!.structuredContent as { grant: { mcps: { reader: { read: boolean; batch: { read: boolean; delete: boolean } }; admin: { batch: { update: boolean; delete: boolean } } } } }
  assert.equal(grant.grant.mcps.reader.read, true)
  assert.equal(grant.grant.mcps.reader.batch.read, true)
  assert.equal(grant.grant.mcps.reader.batch.delete, false)
  assert.equal(grant.grant.mcps.admin.batch.update, true)
  assert.equal(grant.grant.mcps.admin.batch.delete, true)
  const list = JSON.stringify({ jsonrpc: '2.0', id: 1, result: { tools: [{ name: 'findDocuments', inputSchema: { properties: { slug: {}, where: {}, limit: {} } } }, { name: 'updateDocument', inputSchema: { properties: { slug: {}, id: {}, data: {} } } }] } })
  const found = JSON.stringify({ jsonrpc: '2.0', id: 2, result: { structuredContent: { docs: [{ id: 'p1', layout: [{ blockType: 'qpu', tool: 'configure', arguments: { kind: 'payload' }, theorem: null }] }] } } })
  const withheld = call('payload', { theorems: true, role: 'reader', payloadUrl: 'https://payload.example', answers: { list, found } }).result!.structuredContent as { replaced: number; requestList: unknown[]; rbac: { calls: { action: string; access: boolean }[] }; note: string }
  assert.equal(withheld.replaced, 0)
  assert.equal(withheld.requestList.length, 0)
  assert.equal(withheld.rbac.calls.find((c) => c.action === 'update')!.access, false)
  assert.match(withheld.note, /reader may not batch an update/)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: develop is an ISO 9001 process based on the axioms the formula names. */
test('develop is an ISO 9001 process based on the axioms the formula names', () => {
  const s = call('payload', { develop: 'coins + rays' }).result!.structuredContent as { process: string; framework: readonly string[]; params: { name: string; value: number }[]; iso: { standard?: string; documented?: boolean; formula: string }; docs: { text: string } }
  const empty = call('payload', { develop: '' }).result!.structuredContent as { params: unknown[]; iso: { documented?: boolean } }
  assert.equal(s.process, 'ISO 9001')
  assert.equal(s.iso.standard, 'ISO 9001')
  assert.equal(s.iso.documented, true)
  assert.equal(s.iso.formula, 'coins + rays')
  assert.equal(s.docs.text, 'coins + rays')
  assert.deepEqual(s.params.map((p) => p.name), ['coins', 'rays'])
  assert.deepEqual(s.params.map((p) => p.value), [2, 7])
  assert.deepEqual([...s.framework], ['ISO/IEC 9834-8', 'ISO 22739:2024', 'ISO 23257:2022', 'ISO 20022', 'ISO 4217'])
  assert.equal(empty.iso.documented, undefined)
  assert.deepEqual(empty.params, [])
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: an audit that stops continues as a Payload create of the lead. */
test('an audit that stops continues as a Payload create of the lead', () => {
  const s = call('audit', { errors: ['TypeError: something entirely new happened'] }).result!.structuredContent as { fallback: { terminated: boolean; continued: { api: string; args: { collection: string; data: { kind: string; body: { left: string[] } } } } } }
  assert.equal(s.fallback.terminated, true)
  assert.equal(s.fallback.continued.api, 'create')
  assert.equal(s.fallback.continued.args.collection, 'entries')
  assert.equal(s.fallback.continued.args.data.kind, 'audit-stop')
  assert.equal(s.fallback.continued.args.data.body.left.length, 1)
})
