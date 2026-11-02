// The qpu-news-solve Payload job (src/quantum/toolboxes/payload.ts: newsSolveTask) run end to end: Payload booted on the RAID adapter with a tenant, a
// posts collection (title, a tenant relationship, a blogMarkdown content block, drafts on) and an entries collection; the real handler reads the day's
// news, solves the served ones through the match tool (editorialOf), and writes each as a draft post whose body is the solution and whose tenant is the
// tenant it belongs to — the autonomous per-tenant editorial blog, never a deploy.
import { test, after } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { mkdtempSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { pathToFileURL } from 'node:url'
import { register } from 'tsx/esm/api'

register()
// the generated plugin pulls in the website's plugins (search, revalidate timers), which keep the process alive after the test; force a clean exit with
// the recorded code so the run never hangs CI (the assertions have already decided pass or fail)
after(() => process.exit(process.exitCode ?? 0))
const APP = ([process.env.QPU_APP_DIR, '.qpu-app'].find((d) => d && existsSync(join(process.cwd(), d, 'package.json'))) ?? null) as string | null
const site = (APP ? createRequire(join(process.cwd(), APP, 'package.json')) : { resolve: (m: string) => m }), load = (m: string) => import(pathToFileURL(site.resolve(m)).href)
const dbMod = () => import(pathToFileURL(join(process.cwd(), (APP as string), 'src', 'payload.qpu.db.ts')).href) as Promise<{ qpuRaidDb: (o?: Record<string, unknown>) => unknown }>
// newsSolveTask is generated into .qpu-app/src/plugins/qpu.ts (the pluginModule template), not a payload.ts export — import it from the generated plugin
const taskMod = () => import(pathToFileURL(join(process.cwd(), (APP as string), 'src', 'plugins', 'qpu.ts')).href) as Promise<{ newsSolveTask: { handler: (a: { input: Record<string, unknown>; req: unknown }) => Promise<{ output: { entry: string; posts: number } }> } }>

test('qpu-news-solve writes the solved news as a tenant blog draft (solution the body, tenant the relationship)', { skip: !APP }, async () => {
  const dir = mkdtempSync(join(tmpdir(), 'qpu-news-'))
  const [{ buildConfig, getPayload }, { qpuRaidDb }, { newsSolveTask }] = await Promise.all([load('payload'), dbMod(), taskMod()])
  const blogMarkdown = { slug: 'blogMarkdown', fields: [{ name: 'blogMarkdownFields', type: 'group', fields: [{ name: 'markdown', type: 'text' }] }] }
  const config = await buildConfig({ secret: 'test', db: qpuRaidDb({ dir }) as never, collections: [
    { slug: 'tenants', fields: [{ name: 'slug', type: 'text' }] },
    { slug: 'posts', versions: { drafts: true }, fields: [{ name: 'title', type: 'text', required: true }, { name: 'tenant', type: 'relationship', relationTo: 'tenants' }, { name: 'content', type: 'blocks', blocks: [blogMarkdown as never] }] },
    { slug: 'entries', fields: [{ name: 'kind', type: 'text' }, { name: 'from', type: 'text' }, { name: 'body', type: 'json' }] },
  ] })
  const payload = await getPayload({ key: 'news-job', config })
  try {
  await payload.create({ collection: 'tenants', data: { slug: 'uuidna' } })
  const out = await newsSolveTask.handler({ input: { tenant: 'uuidna', news: [{ title: 'factor 15', source: 'HN' }, { title: 'a brand new unheard-of problem about zxqw' }] }, req: { payload } as never })
  assert.equal(out.output.posts, 1, 'one served news item written as a draft post')
  const posts = await payload.find({ collection: 'posts', overrideAccess: true })
  assert.equal(posts.totalDocs, 1, 'the post exists (the RAID adapter stores the draft as the main doc)')
  const p = posts.docs[0] as { content?: unknown; tenant?: unknown; _status?: string }
  assert.ok(/factor 15/.test(JSON.stringify(p.content)), 'the solution is the post content body (a blogMarkdown block)')
  assert.ok(p.tenant, 'the tenant relationship is set')
  assert.equal(p._status, 'draft', 'the post is a draft the editor publishes')
  const entries = await payload.find({ collection: 'entries', overrideAccess: true })
  assert.ok(entries.docs.some((e: { from?: string }) => e.from === 'qpu-news-solve'), 'an editorial entry is recorded')
  } catch (e) { console.error('NEWS-JOB TEST ERROR:', (e as Error).message); throw e }
})
