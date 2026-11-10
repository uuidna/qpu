import { execFileSync } from 'child_process'
import { randomBytes } from 'crypto'
import { createPayloadRequest, getPayload, registerFirstUserOperation } from 'payload'

import config from '@payload-config'
import { uuid } from '../quantum/password/address.js'

/** Queue the old tree's modules as legacyLead jobs and run them: `pnpm payload run src/scripts/queueLegacyLeads.ts`.
 *  The modules are the committed legacy/ tree (the payloadcms/website fork qpu ran until this installation), read from
 *  git; each module's address is the content address of its committed text. LEGACY_LIMIT takes the first N. Every
 *  write runs as an admin user with access on (the v4 Local API default), so hooks and access decide. */
const git = (...args: string[]) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 1 << 30 })
const EXPORT = /export\s+(?:default\s+)?(?:async\s+)?(?:function\*?|const|let|var|class|type|interface|enum)\s+([A-Za-z0-9_$]+)/g
const EXPORT_LIST = /export\s*\{([^}]*)\}/g
const modules = git('ls-tree', '-r', '--name-only', 'HEAD', 'legacy')
  .split('\n')
  .filter((p) => /\.(ts|tsx|js|mjs|cjs)$/.test(p) && !p.endsWith('.d.ts'))
  .sort()
// LEGACY_PATHS (comma-separated) takes those modules instead of the tree's head
const paths = process.env.LEGACY_PATHS?.split(',').map((p) => p.trim()).filter(Boolean)
const chosen = paths ? modules.filter((p) => paths.includes(p)) : modules
const limit = Number(process.env.LEGACY_LIMIT || chosen.length)
const entries = chosen.slice(0, limit).map((p) => {
  const text = git('show', `HEAD:${p}`)
  const names = new Set<string>()
  for (const m of text.matchAll(EXPORT)) names.add(m[1]!)
  for (const m of text.matchAll(EXPORT_LIST))
    for (const part of m[1]!.split(',')) { const name = part.trim().split(/\s+as\s+/).pop()?.trim(); if (name) names.add(name) }
  return { address: uuid(text) as string, exports: [...names].sort(), path: p }
})
const payload = await getPayload({ config })

// THE ACTING USER. Resolving who acts is the one read past access, as the template's ensureFirstUserIsAdmin does. On an
// empty database the first admin is made by Payload's own first-user operation (the admin panel's "create first user").
// Its password is random and kept nowhere: the script never logs in, and an admin resets it to sign in.
const email = process.env.LEGACY_ADMIN_EMAIL || 'legacy-leads@qpu.localhost'
const found = await payload.find({ collection: 'users', limit: 1, overrideAccess: true, where: { email: { equals: email } } })
const user =
  found.docs[0] ??
  (
    await registerFirstUserOperation({
      collection: payload.collections.users,
      data: { email, name: 'legacy leads', password: randomBytes(32).toString('hex'), roles: ['admin'] },
      req: await createPayloadRequest({ payload }),
    })
  ).user
if (!user) throw new Error(`${email} is not a user here, and the database already has users: name an admin with LEGACY_ADMIN_EMAIL`)
if (!user.roles?.includes('admin')) throw new Error(`${email} is not an admin: name one with LEGACY_ADMIN_EMAIL`)
const req = await createPayloadRequest({ payload, user: { ...user, collection: 'users' } })

const tenants = await payload.find({ collection: 'tenants', limit: 1, req, where: { slug: { equals: 'qpu' } } })
const tenant =
  tenants.docs[0] ??
  (await payload.create({ collection: 'tenants', data: { name: 'qpu', slug: 'qpu', allowPublicRead: true }, req }))

for (const entry of entries)
  await payload.jobs.queue({
    task: 'legacyLead',
    input: { address: entry.address, exports: entry.exports.join(', '), path: entry.path, tenant: tenant.id },
    req,
  })
// in queue order: a module's directory pages are created by the first module under them, not raced by its siblings
const result = await payload.jobs.run({ limit, req, sequential: true })
payload.logger.info({ msg: 'legacy leads run', queued: limit, ...result })
process.exit(0)
