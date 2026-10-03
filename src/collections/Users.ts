import type { CollectionConfig } from 'payload'
import { hostOf } from './Tenants'

// shown only to a signed-in admin: the first-user screen asks for an email and a password and nothing else
const signedIn = (_: unknown, __: unknown, { user }: { user?: unknown }) => Boolean(user)

/** The first user is the super admin, with access to every tenant; creating it creates the first tenant on the request's host.
 *  It gives only an email and a password: the role, the state, the tenant and the name are known. */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        const named = { ...data, name: data?.name || String(data?.email ?? '').split('@')[0] }
        const { totalDocs } = await req.payload.count({ collection: 'users', overrideAccess: true, req })
        return totalDocs === 0 ? { ...named, role: 'super-admin', active: true } : named
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create' || doc.role !== 'super-admin') return doc
        const { totalDocs } = await req.payload.count({ collection: 'tenants', overrideAccess: true, req })
        if (totalDocs === 0) {
          const domain = hostOf(req)
          const tenant = await req.payload.create({ collection: 'tenants', data: { name: domain ?? 'default', domain }, overrideAccess: true, req })
          await req.payload.update({ collection: 'users', id: doc.id, data: { tenants: [{ tenant: tenant.id }] }, overrideAccess: true, req })
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'name',
      type: 'text',
      admin: { condition: signedIn },
    },
    {
      name: 'role',
      type: 'select',
      options: ['super-admin', 'admin', 'user'],
      defaultValue: 'user',
      admin: { condition: signedIn },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: { condition: signedIn },
    },
    {
      name: 'tenants',
      type: 'array',
      admin: { condition: signedIn },
      access: { read: ({ req }) => Boolean(req.user), create: ({ req }) => Boolean(req.user) },
      fields: [{ name: 'tenant', type: 'relationship', relationTo: 'tenants', required: true, index: true }],
    },
  ],
}
