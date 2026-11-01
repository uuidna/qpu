// Local-only: attach the dev super-admin's API key (QPU_APP_KEY) so the hooks/MCP can authenticate to this app. Not shipped.
// Run with: pnpm payload run src/scripts/bootstrapKey.ts  (QPU_APP_KEY in the env, read from the keychain item qpu-app-key)
import { getPayload } from 'payload'
import config from '@payload-config'

const main = async () => {
  const key = process.env.QPU_APP_KEY
  if (!key) throw new Error('QPU_APP_KEY required (keychain item qpu-app-key)')
  const payload = await getPayload({ config })
  const existing = await payload.find({ collection: 'users', limit: 1, overrideAccess: true })
  if (existing.totalDocs) {
    const u = existing.docs[0] as { id: string; email?: string }
    await payload.update({ collection: 'users', id: u.id, overrideAccess: true, context: { disableRevalidate: true }, data: { enableAPIKey: true, apiKey: key } as never })
    console.log(`bootstrap: enabled API key on existing user ${u.email ?? u.id}`)
  } else {
    const t = await payload.find({ collection: 'tenants' as never, limit: 1, overrideAccess: true })
    const tenantId = (t.docs[0] as { id: string } | undefined)?.id
    await payload.create({ collection: 'users', overrideAccess: true, context: { disableRevalidate: true }, data: { email: 'admin@localhost.test', password: key, firstName: 'Super', lastName: 'Admin', roles: ['admin'], enableAPIKey: true, apiKey: key, ...(tenantId ? { tenants: [{ tenant: tenantId, roles: ['tenant-admin'] }] } : {}) } as never })
    console.log('bootstrap: created super admin with API key')
  }
}
await main()
process.exit(0)
