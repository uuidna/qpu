import type { Access, CollectionConfig, FieldAccess } from 'payload'
import { hostOf } from './Tenants'

// shown only to a signed-in admin: the first-user screen asks for an email and a password and nothing else
const signedIn = (_: unknown, __: unknown, { user }: { user?: unknown }) => Boolean(user)
// A privileged field (role, active, tenants) is writable ONLY by a super-admin. Without this, Payload enforces no field
// access and any signed-in user could PATCH its own role to super-admin and cross every tenant. The first user is still
// created by first-register with overrideAccess, so that bootstrap is unaffected; a normal user keeps read + self-profile.
const roleOf = (req: { user?: unknown } | undefined) => (req?.user as { role?: string } | null | undefined)?.role
const isSuperAdmin: Access = ({ req }) => roleOf(req) === 'super-admin'
const superAdminField: FieldAccess = ({ req }) => roleOf(req) === 'super-admin'
const signedInField: FieldAccess = ({ req }) => Boolean(req.user)

/** The first user is the super admin, with access to every tenant; creating it creates the first tenant on the request's host.
 *  It gives only an email and a password: the role, the state, the tenant and the name are known. */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  // Only a super-admin creates or deletes accounts (first-register bootstraps with overrideAccess). Read and update are
  // left to the multi-tenant default (self + own tenants); the privileged fields below are locked to super-admin.
  access: {
    create: isSuperAdmin,
    delete: isSuperAdmin,
  },
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
      access: { update: superAdminField, create: superAdminField },
      admin: { condition: signedIn },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      access: { update: superAdminField, create: superAdminField },
      admin: { condition: signedIn },
    },
    {
      name: 'tenants',
      type: 'array',
      admin: { condition: signedIn },
      access: { read: signedInField, update: superAdminField, create: superAdminField },
      fields: [{ name: 'tenant', type: 'relationship', relationTo: 'tenants', required: true, index: true }],
    },
  ],
}
