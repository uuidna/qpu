import type { CollectionConfig, PayloadRequest } from 'payload'
import { authenticated, superAdmin } from '../access'

export const hostOf = (req: PayloadRequest): string | undefined => req.headers?.get('x-forwarded-host') ?? req.headers?.get('host') ?? undefined

/** A tenant is a domain; the first tenant's domain is the host the request came in on. */
export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: { useAsTitle: 'name' },
  // deleting a tenant cascades deletes across every tenant-scoped collection, so only a super-admin may update or
  // delete one; an ordinary signed-in user must not be able to drop a tenant and its data (Wave XIII HIGH).
  // create is super-admin only: a tenant's domain routes a host to it, so letting any signed-in user create a tenant
  // with any domain is a routing/host hijack (Wave XIV compliance, SOC2-CC8.1). The first tenant is still bootstrapped
  // by the first super-admin's afterChange hook with overrideAccess, so that path is unaffected.
  access: { read: authenticated, create: superAdmin, update: superAdmin, delete: superAdmin },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== 'create' || data?.domain) return data
        const { totalDocs } = await req.payload.count({ collection: 'tenants', overrideAccess: true, req })
        return totalDocs === 0 ? { ...data, domain: hostOf(req) } : data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'domain', type: 'text', unique: true, index: true },
  ],
}
