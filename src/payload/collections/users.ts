import type { CollectionConfig } from 'payload'
import { hostOf } from './tenants'

/** The first user is the super admin, with access to every tenant; creating it creates the first tenant on the request's host. */
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
        const { totalDocs } = await req.payload.count({ collection: 'users', overrideAccess: true, req })
        return totalDocs === 0 ? { ...data, role: 'super-admin', active: true } : data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create' || doc.role !== 'super-admin') return doc
        const { totalDocs } = await req.payload.count({ collection: 'tenants', overrideAccess: true, req })
        if (totalDocs === 0) {
          const domain = hostOf(req)
          await req.payload.create({ collection: 'tenants', data: { name: domain ?? 'default', domain }, overrideAccess: true, req })
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
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: ['super-admin', 'admin', 'user'],
      defaultValue: 'user',
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
