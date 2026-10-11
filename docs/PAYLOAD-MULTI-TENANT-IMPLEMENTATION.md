# Multi-Tenant Implementation Guide for QPU MCP
**Based on:** Payload CMS Enterprise Patterns  
**Status:** Ready to implement  
**Effort:** 6-8 weeks full implementation

---

## Core Architecture Pattern (From Payload CMS)

### 1. Tenant Model Structure

```typescript
// src/collections/Tenants.ts
import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    create: ({ req: { user } }) => user?.role === 'super-admin',
    read: ({ req: { user } }) => true,
    update: ({ req: { user }, doc }) => {
      // Tenant owner or super admin
      return doc.owner === user?.id || user?.role === 'super-admin'
    },
    delete: ({ req: { user } }) => user?.role === 'super-admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL-safe identifier (e.g., org-123)',
      },
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'plan',
      type: 'select',
      options: ['starter', 'professional', 'enterprise'],
      defaultValue: 'starter',
      required: true,
    },
    {
      name: 'quotas',
      type: 'group',
      fields: [
        {
          name: 'operations_per_minute',
          type: 'number',
          defaultValue: 100,
          required: true,
        },
        {
          name: 'max_concurrent_compositions',
          type: 'number',
          defaultValue: 10,
          required: true,
        },
        {
          name: 'monthly_operations',
          type: 'number',
          defaultValue: 1000000,
          required: true,
        },
        {
          name: 'max_compute_seconds',
          type: 'number',
          defaultValue: 3600,
          required: true,
        },
        {
          name: 'max_storage_mb',
          type: 'number',
          defaultValue: 10240,
          required: true,
        },
      ],
    },
    {
      name: 'billing',
      type: 'group',
      fields: [
        {
          name: 'stripe_customer_id',
          type: 'text',
          index: true,
        },
        {
          name: 'stripe_subscription_id',
          type: 'text',
        },
        {
          name: 'billing_email',
          type: 'email',
          required: true,
        },
        {
          name: 'payment_method',
          type: 'text',
        },
        {
          name: 'status',
          type: 'select',
          options: ['active', 'suspended', 'past_due', 'trial'],
          defaultValue: 'trial',
        },
        {
          name: 'trial_ends_at',
          type: 'date',
        },
      ],
    },
    {
      name: 'features',
      type: 'checkbox',
      options: [
        { label: 'Custom domains', value: 'custom_domains' },
        { label: 'Webhooks', value: 'webhooks' },
        { label: 'Custom roles', value: 'custom_roles' },
        { label: 'SSO', value: 'sso' },
        { label: 'Advanced analytics', value: 'analytics' },
        { label: 'SLA support', value: 'sla' },
      ],
      defaultValue: [],
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Custom metadata for this tenant',
      },
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
  ],
}
```

### 2. User-Tenant Relationship

```typescript
// src/collections/Users.ts - Extended
export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 28800, // 8 hours
    cookies: {
      domain: process.env.COOKIE_DOMAIN,
      sameSite: 'None',
      secure: true,
    },
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: ['user', 'admin', 'super-admin'],
      defaultValue: 'user',
      required: true,
      index: true,
      access: {
        create: ({ req: { user } }) => user?.role === 'super-admin',
        update: ({ req: { user } }) => user?.role === 'super-admin',
      },
    },
    {
      // Multi-tenant: user can belong to multiple tenants
      name: 'tenants',
      type: 'relationship',
      relationTo: 'tenants',
      hasMany: true,
      index: true,
      access: {
        read: ({ req: { user }, doc }) => {
          // Users can see their own tenants
          // Admins can see all
          return user?.role === 'super-admin' || doc.id === user?.id
        },
      },
    },
    {
      name: 'apiTokens',
      type: 'relationship',
      relationTo: 'api-tokens',
      hasMany: true,
    },
    {
      name: 'mfaEnabled',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
  ],
}
```

### 3. API Token Collection

```typescript
// src/collections/APITokens.ts
export const APITokens: CollectionConfig = {
  slug: 'api-tokens',
  access: {
    create: ({ req: { user } }) => Boolean(user),
    read: ({ req: { user }, doc }) => {
      // Only owner or super-admin can see
      return doc.owner === user?.id || user?.role === 'super-admin'
    },
    update: ({ req: { user } }) => user?.role === 'super-admin',
    delete: ({ req: { user }, doc }) => {
      return doc.owner === user?.id || user?.role === 'super-admin'
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'token',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Token hash - never shown after creation',
      },
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      index: true,
    },
    {
      name: 'permissions',
      type: 'checkbox',
      options: [
        { label: 'Read operations', value: 'read' },
        { label: 'Execute operations', value: 'execute' },
        { label: 'Create compositions', value: 'compose' },
        { label: 'View quotas', value: 'quota_read' },
        { label: 'Manage webhooks', value: 'webhook' },
      ],
      required: true,
      defaultValue: ['read', 'execute'],
    },
    {
      name: 'lastUsedAt',
      type: 'date',
    },
    {
      name: 'expiresAt',
      type: 'date',
    },
    {
      name: 'ipWhitelist',
      type: 'textarea',
      admin: {
        description: 'One IP per line (optional)',
      },
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
  ],
}
```

---

## 4. Access Control Implementation

### Payload-Style Access Control

```typescript
// src/access/canAccessTenant.ts
import type { Access, FieldAccess } from 'payload'

export const canAccessTenant: Access = async ({ req, id }) => {
  const { user, payload } = req
  
  if (!user) {
    return false
  }
  
  if (user.role === 'super-admin') {
    return true
  }
  
  // Check if user belongs to this tenant
  const tenant = await payload.findByID({
    collection: 'tenants',
    id: id,
  })
  
  return tenant.owner === user.id || 
         (user.tenants || []).includes(tenant.id)
}

// Field-level access
export const canAccessTenantFieldLevel: FieldAccess = async ({
  req,
  doc,
}) => {
  const { user, payload } = req
  
  if (!user) {
    return false
  }
  
  if (user.role === 'super-admin') {
    return true
  }
  
  return (user.tenants || []).includes(doc.id)
}
```

### Middleware for Tenant Isolation

```typescript
// src/middleware/tenantIsolation.ts
import type { Request, Response, NextFunction } from 'express'

export const tenantIsolationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { user } = req as any
  const tenantSlug = req.params['tenant-slug'] || req.headers['x-tenant-id']
  
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  if (!tenantSlug) {
    return res.status(400).json({ error: 'Tenant not specified' })
  }
  
  // Get tenant
  const tenant = await (req as any).payload.findByID({
    collection: 'tenants',
    id: tenantSlug,
  })
  
  if (!tenant) {
    return res.status(404).json({ error: 'Tenant not found' })
  }
  
  // Verify access
  const hasAccess =
    user.role === 'super-admin' ||
    tenant.owner === user.id ||
    (user.tenants || []).includes(tenant.id)
  
  if (!hasAccess) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  
  // Attach to request for use in controllers
  (req as any).tenant = tenant
  
  next()
}
```

---

## 5. Hooks System (Payload Pattern)

```typescript
// src/hooks/beforeOperationExecute.ts
import type { CollectionBeforeChangeHook } from 'payload'

export const beforeOperationExecute: CollectionBeforeChangeHook = async ({
  data,
  req,
  doc,
  operation,
}) => {
  const { user, payload, tenant } = req as any
  
  if (!user || !tenant) {
    throw new Error('Tenant context required')
  }
  
  // Hook 1: Validate tenant access
  const hasAccess = (user.tenants || []).includes(tenant.id)
  if (!hasAccess) {
    throw new Error('Access denied')
  }
  
  // Hook 2: Check quota
  const quota = tenant.quotas
  const usage = await getUsage(payload, tenant.id)
  
  if (usage.operations_per_minute >= quota.operations_per_minute) {
    throw new Error('Rate limit exceeded')
  }
  
  // Hook 3: Check cost
  const operationCost = calculateCost(data)
  const balance = await getTenantBalance(payload, tenant.id)
  
  if (balance < operationCost) {
    throw new Error('Insufficient credit')
  }
  
  // Hook 4: Log for audit
  await payload.create({
    collection: 'audit-logs',
    data: {
      tenant: tenant.id,
      actor: user.id,
      action: 'operation_requested',
      resource: data.operation,
      timestamp: new Date(),
    },
  })
  
  return data
}

// src/hooks/afterOperationExecute.ts
export const afterOperationExecute: CollectionAfterChangeHook = async ({
  doc,
  req,
}) => {
  const { payload, tenant } = req as any
  
  // Hook 5: Update usage metrics
  await payload.db.findAndModify({
    collection: 'usage-metrics',
    where: { tenant: { equals: tenant.id } },
    data: {
      operations_count: { increment: 1 },
    },
  })
  
  // Hook 6: Emit webhook
  const webhooks = await payload.find({
    collection: 'webhooks',
    where: {
      tenant: { equals: tenant.id },
      events: { contains: 'operation.completed' },
    },
  })
  
  for (const webhook of webhooks.docs) {
    emitWebhook(webhook, {
      event: 'operation.completed',
      data: doc,
    })
  }
  
  // Hook 7: Update billing
  const cost = calculateCost(doc)
  await recordTransaction(payload, tenant.id, {
    type: 'operation',
    cost,
    operation: doc.operation,
  })
  
  return doc
}
```

---

## 6. Routes & Routing Pattern

```typescript
// app/api/tenants/[tenant-slug]/operations/route.ts
import { tenantIsolationMiddleware } from '@/middleware/tenantIsolation'

export async function GET(
  request: Request,
  { params }: { params: { 'tenant-slug': string } },
) {
  const { tenant, user } = request as any
  
  // Tenant context already verified by middleware
  
  const operations = await getOperations(tenant.id)
  return Response.json({
    tenant: tenant.id,
    operations,
  })
}

export async function POST(
  request: Request,
  { params }: { params: { 'tenant-slug': string } },
) {
  const { tenant, user, payload } = request as any
  const body = await request.json()
  
  // Before-hook already ran
  // Execute operation
  const result = await executeOperation(tenant, body)
  
  // After-hook will run automatically
  
  return Response.json(result)
}

// Route structure
// GET  /api/tenants/:tenant-slug/operations
// POST /api/tenants/:tenant-slug/operations/:id/execute
// GET  /api/tenants/:tenant-slug/quotas
// GET  /api/tenants/:tenant-slug/usage
// POST /api/tenants/:tenant-slug/webhooks
// GET  /api/tenants/:tenant-slug/audit-logs
// GET  /api/tenants/:tenant-slug/billing/invoices
```

---

## 7. Webhook Collection

```typescript
// src/collections/Webhooks.ts
export const Webhooks: CollectionConfig = {
  slug: 'webhooks',
  access: {
    create: ({ req: { user, tenant } }) => Boolean(user && tenant),
    read: ({ req: { tenant }, doc }) => doc.tenant === tenant.id,
    update: ({ req: { user }, doc }) => {
      return doc.owner === user?.id
    },
    delete: ({ req: { user }, doc }) => {
      return doc.owner === user?.id
    },
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      validate: (value) => {
        try {
          new URL(value)
          return true
        } catch {
          return 'Invalid URL'
        }
      },
    },
    {
      name: 'events',
      type: 'checkbox',
      options: [
        { label: 'Operation Started', value: 'operation.started' },
        { label: 'Operation Completed', value: 'operation.completed' },
        { label: 'Operation Failed', value: 'operation.failed' },
        { label: 'Quota Warning', value: 'quota.warning' },
        { label: 'Quota Exceeded', value: 'quota.exceeded' },
        { label: 'Invoice Generated', value: 'invoice.generated' },
        { label: 'Payment Received', value: 'payment.received' },
      ],
      required: true,
    },
    {
      name: 'signingSecret',
      type: 'text',
      required: true,
      admin: {
        description: 'Used to sign webhook payloads',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'retryPolicy',
      type: 'group',
      fields: [
        {
          name: 'maxRetries',
          type: 'number',
          defaultValue: 3,
          required: true,
        },
        {
          name: 'backoffMultiplier',
          type: 'number',
          defaultValue: 2,
          required: true,
        },
      ],
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
  ],
}
```

---

## 8. Complete Configuration

```typescript
// src/payload.config.ts - Multi-tenant setup
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

import { Tenants } from './collections/Tenants'
import { Users } from './collections/Users'
import { APITokens } from './collections/APITokens'
import { Webhooks } from './collections/Webhooks'
import { AuditLogs } from './collections/AuditLogs'
import { UsageMetrics } from './collections/UsageMetrics'
import { Transactions } from './collections/Transactions'

import { beforeOperationExecute, afterOperationExecute } from './hooks'

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Tenants,
    Users,
    APITokens,
    Webhooks,
    AuditLogs,
    UsageMetrics,
    Transactions,
  ],
  db: mongooseAdapter({
    url: process.env.MONGODB_URI,
  }),
  email: nodemailerAdapter({
    defaultFromAddress: process.env.FROM_EMAIL,
    defaultFromName: 'QPU MCP',
    transport: nodemailerSendgrid({
      apiKey: process.env.SENDGRID_API_KEY,
    }),
  }),
  secret: process.env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

---

## 9. Middleware Integration (Next.js)

```typescript
// src/middleware.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Tenant isolation routes
  if (pathname.startsWith('/api/tenants/')) {
    const tenantSlug = pathname.split('/')[3]
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token && !request.cookies.get('payload-token')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Verify token belongs to tenant
    // This will be done in the route handler middleware
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/tenants/:path*', '/tenants/:path*'],
}
```

---

## 10. Testing Multi-Tenancy

```typescript
// __tests__/multi-tenant-isolation.test.ts
import { describe, it, expect } from 'vitest'
import { initializePayload } from '@payloadcms/test-utils'

describe('Multi-Tenant Isolation', () => {
  let payload: typeof Payload
  let tenant1: any
  let tenant2: any
  let user1: any
  let user2: any

  beforeEach(async () => {
    // Setup
    payload = await initializePayload()
    
    tenant1 = await payload.create({
      collection: 'tenants',
      data: { name: 'Tenant 1', slug: 'tenant-1' },
    })
    
    tenant2 = await payload.create({
      collection: 'tenants',
      data: { name: 'Tenant 2', slug: 'tenant-2' },
    })
    
    user1 = await payload.create({
      collection: 'users',
      data: {
        email: 'user1@tenant1.com',
        password: 'test',
        tenants: [tenant1.id],
      },
    })
    
    user2 = await payload.create({
      collection: 'users',
      data: {
        email: 'user2@tenant2.com',
        password: 'test',
        tenants: [tenant2.id],
      },
    })
  })

  it('user from tenant1 cannot access tenant2 data', async () => {
    const req = createMockRequest({ user: user1, tenant: tenant1 })
    
    try {
      const data = await getOperations(req, tenant2.id)
      expect.fail('Should have thrown error')
    } catch (error) {
      expect(error.message).toContain('Access denied')
    }
  })

  it('quota is enforced per tenant', async () => {
    const smallQuota = await payload.update({
      collection: 'tenants',
      id: tenant1.id,
      data: {
        quotas: {
          operations_per_minute: 5,
        },
      },
    })
    
    const req = createMockRequest({ user: user1, tenant: tenant1 })
    
    // Execute 5 operations - should succeed
    for (let i = 0; i < 5; i++) {
      await executeOperation(req, { operation: 'test' })
    }
    
    // 6th operation should fail
    expect.rejects(async () => {
      await executeOperation(req, { operation: 'test' })
    })
  })

  it('webhooks only receive events for their tenant', async () => {
    const webhook1 = await payload.create({
      collection: 'webhooks',
      data: {
        url: 'https://example.com/webhook1',
        events: ['operation.completed'],
        tenant: tenant1.id,
        owner: user1.id,
      },
    })
    
    // Execute operation in tenant2
    await executeOperation(
      createMockRequest({ user: user2, tenant: tenant2 }),
      { operation: 'test' }
    )
    
    // webhook1 should NOT have been called
    const calls = await getWebhookCalls(webhook1.id)
    expect(calls.length).toBe(0)
  })
})
```

---

## Implementation Checklist

- [ ] Create Tenants collection
- [ ] Extend Users collection with tenant relationships
- [ ] Create APITokens collection
- [ ] Create Webhooks collection  
- [ ] Create AuditLogs collection
- [ ] Create UsageMetrics collection
- [ ] Create Transactions collection
- [ ] Implement tenant isolation middleware
- [ ] Add before/after operation hooks
- [ ] Implement quota enforcement hooks
- [ ] Implement billing hooks
- [ ] Set up webhook dispatch system
- [ ] Create tenant-scoped routes
- [ ] Add access control functions
- [ ] Configure Stripe integration
- [ ] Set up email notifications
- [ ] Implement audit logging
- [ ] Add comprehensive tests
- [ ] Set up monitoring/alerts
- [ ] Create admin dashboard

---

## Key Differences from Single-Tenant

| Aspect | Single-Tenant | Multi-Tenant |
|--------|---------------|-------------|
| Routing | /api/operations | /api/tenants/:id/operations |
| Data Isolation | Global | Tenant-scoped |
| Billing | Per system | Per tenant |
| Quotas | System-wide | Per tenant |
| Webhooks | Global | Tenant-specific |
| Access Control | Global roles | Tenant + Global roles |
| Audit Trail | System | Per tenant + System |
| Scaling | Vertical | Horizontal per tenant |

---

## Production Readiness

When ready to ship:

1. **Security Review**: All access controls verified
2. **Data Isolation**: Complete tenant isolation proven
3. **Quota Testing**: All limits enforced
4. **Load Testing**: Multi-tenant performance validated
5. **Disaster Recovery**: Backups work per tenant
6. **Compliance**: Audit trails complete
7. **Monitoring**: Alerts configured
8. **Documentation**: User guides complete

---

## Estimated Timeline

- **Week 1-2**: Collections + Access Control
- **Week 3**: Routing + Middleware
- **Week 4**: Hooks + Billing  
- **Week 5**: Webhooks + Audit
- **Week 6**: Testing + Monitoring
- **Week 7**: Admin Dashboard
- **Week 8**: Documentation + Launch

**Total Effort:** ~200-250 engineer hours
