import type { Access, CollectionConfig, FieldAccess } from 'payload'
import { hostOf } from './Tenants'
import { canAccessAdmin } from '../access'

// shown only to a signed-in admin: the first-user screen asks for an email and a password and nothing else
const signedIn = (_: unknown, __: unknown, { user }: { user?: unknown }) => Boolean(user)
// A privileged field (role, active, tenants) is writable ONLY by a super-admin. Without this, Payload enforces no field
// access and any signed-in user could PATCH its own role to super-admin and cross every tenant. The first user is still
// created by first-register with overrideAccess, so that bootstrap is unaffected; a normal user keeps read + self-profile.
const roleOf = (req: { user?: unknown } | undefined) => (req?.user as { role?: string } | null | undefined)?.role
const isSuperAdmin: Access = ({ req }) => roleOf(req) === 'super-admin'
const superAdminField: FieldAccess = ({ req }) => roleOf(req) === 'super-admin'
const signedInField: FieldAccess = ({ req }) => Boolean(req.user)
// UPDATE IS SELF-ONLY (or super-admin). The multi-tenant default would let any signed-in user update PEERS in their
// tenant — and email/password are auth fields with no field-level lock, so that was a same-tenant password reset =
// account takeover (Wave XIV compliance, SOC2-CC6.1). A user may edit only their own record; a super-admin, anyone.
const selfOrSuperAdmin: Access = ({ req }) => (roleOf(req) === 'super-admin' ? true : req.user ? { id: { equals: req.user.id } } : false)

/** The first user is the super admin, with access to every tenant; creating it creates the first tenant on the request's host.
 *  It gives only an email and a password: the role, the state, the tenant and the name are known. */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  // Only a super-admin creates or deletes accounts (first-register bootstraps with overrideAccess). Update is self-only
  // (or super-admin) — never a same-tenant peer, so no one can reset another account's password. The privileged fields
  // (role, active, tenants) are additionally locked to super-admin below.
  access: {
    // The admin PANEL is gated to an active admin or super-admin: a role:'user' account (or a deactivated one) can hold a
    // session and authenticate, but is held out of /admin by construction — Payload's panel gate — separate from the
    // per-collection read/write access below. (Wave XIV compliance, SOC2-CC6.1 least-privilege.)
    admin: canAccessAdmin,
    create: isSuperAdmin,
    update: selfOrSuperAdmin,
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
