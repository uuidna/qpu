import type { CollectionConfig, PayloadRequest } from 'payload'
import { authenticated } from '../access'

export const hostOf = (req: PayloadRequest): string | undefined => req.headers?.get('x-forwarded-host') ?? req.headers?.get('host') ?? undefined

/** A tenant is a domain; the first tenant's domain is the host the request came in on. */
export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: { useAsTitle: 'name' },
  access: { read: authenticated, create: authenticated, update: authenticated, delete: authenticated },
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
