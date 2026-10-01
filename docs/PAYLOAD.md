# Payload CMS Integration Guide

**Complete configuration and usage guide for Payload CMS integration with UUIDNA QPU**

---

## Overview

QPU integrates with Payload CMS as its primary data persistence layer. This guide covers installation, configuration, and usage patterns.

### Key Features

✅ Headless CMS architecture
✅ GraphQL + REST APIs
✅ Type-safe data models
✅ 7 core collections
✅ 6 production plugins

---

## Collections

### 1. users
User accounts and profiles
- `id` (UUID)
- `email` (string, unique)
- `role` (admin/user/viewer)
- `createdAt` (timestamp)

### 2. audit-logs
Activity logging for compliance
- `id` (UUID)
- `action` (string)
- `userId` (reference)
- `resource` (string)
- `timestamp` (timestamp)

### 3. metrics
System performance and health metrics
- `id` (UUID)
- `waveCount` (number)
- `health` (percentage)
- `systems` (JSON)
- `timestamp` (timestamp)

### 4. support-tickets
Customer support tracking
- `id` (UUID)
- `title` (string)
- `description` (rich text)
- `status` (open/in-progress/closed)
- `userId` (reference)
- `createdAt` (timestamp)

### 5. enrollments
User enrollments and subscriptions
- `id` (UUID)
- `userId` (reference)
- `plan` (string)
- `status` (active/paused/cancelled)
- `expiresAt` (timestamp)

### 6. certifications
Certification tracking
- `id` (UUID)
- `userId` (reference)
- `name` (string)
- `issuedAt` (timestamp)
- `expiresAt` (timestamp)

### 7. compliance-issues
Compliance tracking and resolution
- `id` (UUID)
- `title` (string)
- `severity` (low/medium/high/critical)
- `status` (open/resolved)
- `resolvedAt` (timestamp)

---

## Plugins

### 1. S3 (Amazon S3)
Media storage and CDN integration
```env
S3_BUCKET=qpu-assets
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=xxx
S3_SECRET_ACCESS_KEY=xxx
```

### 2. Meilisearch
Full-text search across collections
```env
MEILISEARCH_URL=http://meilisearch:7700
MEILISEARCH_API_KEY=xxx
```

### 3. Webhooks
Event-driven integrations
- Configure in Payload admin UI
- Trigger on collection changes
- POST to external endpoints

### 4. Nested Docs
Support for document hierarchies
- Parent-child relationships
- Breadcrumb navigation
- Recursive queries

### 5. Email (Resend)
Email notifications and campaigns
```env
RESEND_API_KEY=xxx
RESEND_FROM=noreply@qpu.uuidna.com
```

### 6. Rich Text (Slate)
Advanced rich text editing
- Formatting (bold, italic, underline)
- Lists and blockquotes
- Code blocks
- Embeds

---

## Installation

### 1. Install Payload

```bash
npm install payload @payloadcms/db-mongodb
```

### 2. Configure Collections

Create `src/collections/index.ts`:

```typescript
import { CollectionConfig } from 'payload/types'
import { Users } from './Users'
import { Metrics } from './Metrics'
import { AuditLogs } from './AuditLogs'

export const collections: CollectionConfig[] = [
  Users,
  Metrics,
  AuditLogs,
  // ... other collections
]
```

### 3. Configure Payload

Create `src/payload.config.ts`:

```typescript
import { buildConfig } from 'payload/config'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: collections,
  db: mongooseAdapter({
    url: process.env.DATABASE_URL,
  }),
  // plugins: [...]
})
```

### 4. Initialize Database

```bash
npm run payload build
npm run payload migrate
```

---

## API Usage

### GraphQL Queries

```graphql
query GetMetrics {
  metrics(limit: 10) {
    docs {
      id
      waveCount
      health
      systems
      timestamp
    }
  }
}

query GetUserTickets($userId: String!) {
  supportTickets(where: { userId: { equals: $userId } }) {
    docs {
      id
      title
      status
      createdAt
    }
  }
}
```

### GraphQL Mutations

```graphql
mutation CreateMetric($input: MetricsInput!) {
  createMetrics(data: $input) {
    id
    waveCount
    health
  }
}

mutation UpdateTicketStatus($id: String!, $status: String!) {
  updateSupportTickets(id: $id, data: { status: $status }) {
    id
    status
  }
}
```

### REST API

```bash
# Get metrics
curl http://localhost:3000/api/metrics?limit=10

# Create audit log
curl -X POST http://localhost:3000/api/audit-logs \
  -H "Content-Type: application/json" \
  -d '{
    "action": "user_login",
    "userId": "xxx",
    "resource": "users",
    "timestamp": "2026-10-01T00:00:00Z"
  }'

# Get user
curl http://localhost:3000/api/users/xxx

# Update enrollment
curl -X PATCH http://localhost:3000/api/enrollments/xxx \
  -d '{"status": "active"}'
```

---

## Authentication

### Admin Access

```bash
# Create admin user on first run
npm run payload create:user

# Login at http://localhost:3000/admin
```

### API Authentication

```bash
# Generate API token in admin UI
# Use in Authorization header

curl -H "Authorization: Bearer YOUR_API_TOKEN" \
  http://localhost:3000/api/metrics
```

### Role-Based Access

Configure collection access in Payload config:

```typescript
access: {
  read: isAuthenticated,
  create: isAdmin,
  update: isAdmin,
  delete: isAdmin,
},
```

---

## Backup & Recovery

### Database Backup

```bash
# MongoDB backup
mongodump --db qpu --out backup/

# Restore
mongorestore --db qpu backup/qpu/
```

### S3 Backup

```bash
# Sync S3 to local
aws s3 sync s3://qpu-assets backup/s3/

# Restore from local
aws s3 sync backup/s3/ s3://qpu-assets
```

---

## Troubleshooting

### Collections Not Appearing

```bash
# Check migrations ran
npm run payload migrate:current

# Rebuild Payload
npm run payload build
```

### Search Not Working

```bash
# Check Meilisearch is running
curl http://localhost:7700/health

# Re-index collections
# (Via Payload admin UI or API)
```

### Email Sending Fails

```bash
# Verify Resend API key
echo $RESEND_API_KEY

# Check email configuration in payload.config.ts
```

---

## Performance

### Indexing

Create indexes for common queries:

```typescript
indexes: [
  { userId: 1 },
  { status: 1, createdAt: -1 },
  { waveCount: -1 },
]
```

### Caching

```typescript
cache: {
  ttl: 300, // 5 minutes
}
```

### Pagination

Always use pagination for large collections:

```typescript
metrics(limit: 100, page: 1) {
  docs { ... }
  totalDocs
  totalPages
  hasNextPage
}
```

---

## References

- [Payload CMS Documentation](https://payloadcms.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
- [DEPLOYMENT.md](DEPLOYMENT.md) — Deployment with Payload
- [API.md](API.md) — QPU API reference

---

**Last Updated**: 2026-10-01  
**Status**: Production (v0.2.1)
