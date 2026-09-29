# Payload CMS - UUIDNA QPU Content Management System

## Overview

This directory contains the Payload CMS integration for UUIDNA QPU. It converts all test fixtures into a structured content management system with 7 collections and 32+ seed records.

## Architecture

### Collections (7 total, 32 records)

1. **Users** (5 records)
   - Path: `collections/users.ts`
   - Seeds: `seeds/users.seed.ts`
   - Manages system users and authentication

2. **Compliance Issues** (5 records)
   - Path: `collections/compliance-issues.ts`
   - Seeds: `seeds/compliance-issues.seed.ts`
   - Tracks security issues from SAST scanning

3. **Audit Logs** (5 records)
   - Path: `collections/audit-logs.ts`
   - Seeds: `seeds/audit-logs.seed.ts`
   - Records all system actions and access

4. **Support Tickets** (3 records)
   - Path: `collections/support-tickets.ts`
   - Seeds: `seeds/support-tickets.seed.ts`
   - Customer support ticket management

5. **Enrollments** (3 records)
   - Path: `collections/enrollments.ts`
   - Seeds: `seeds/enrollments.seed.ts`
   - Training course enrollments and progress

6. **Metrics** (8 records)
   - Path: `collections/metrics.ts`
   - Seeds: `seeds/metrics.seed.ts`
   - Real-time system performance metrics

7. **Certifications** (3 records)
   - Path: `collections/certifications.ts`
   - Seeds: `seeds/certifications.seed.ts`
   - Compliance certification tracking

## Directory Structure

```
src/payload/
├── collections/                    # Collection definitions
│   ├── users.ts
│   ├── compliance-issues.ts
│   ├── audit-logs.ts
│   ├── support-tickets.ts
│   ├── enrollments.ts
│   ├── metrics.ts
│   ├── certifications.ts
│   └── index.ts
├── seeds/                         # Seed data (32 records)
│   ├── users.seed.ts
│   ├── compliance-issues.seed.ts
│   ├── audit-logs.seed.ts
│   ├── support-tickets.seed.ts
│   ├── enrollments.seed.ts
│   ├── metrics.seed.ts
│   ├── certifications.seed.ts
│   └── index.ts
├── utils/                         # Utilities
│   └── seed-validator.ts
├── payload-types.ts              # Auto-generated types
└── README.md                      # This file
```

## Quick Start

### 1. Install Dependencies

```bash
npm install payload mongodb
```

### 2. Validate Seeds

```bash
npm run payload:validate
```

Expected output:
```
✅ users: 5 records
✅ compliance-issues: 5 records
✅ audit-logs: 5 records
✅ support-tickets: 3 records
✅ enrollments: 3 records
✅ metrics: 8 records
✅ certifications: 3 records

Summary:
  - Total collections: 7
  - Valid collections: 7
  - Total records: 32
  - Total errors: 0
```

### 3. Configure Environment

```bash
export DATABASE_URI=mongodb://localhost:27017/uuidna-qpu
```

### 4. Start MongoDB

```bash
mongod --dbpath ./data
```

### 5. Seed Database

```bash
npm run payload:seed
```

### 6. Access Admin UI

```bash
npm run payload:admin
```

Then visit: `http://localhost:3000/admin`

## Data Flow: Tests → Seeds → CMS

```
Test Files (enterprise.test.ts, *.test.ts)
    ↓
Extract Fixtures
    ↓
Create Seed Files (*.seed.ts)
    ↓
Payload Collections (*.ts)
    ↓
MongoDB Database
    ↓
Admin UI + APIs
```

## Collections Detail

### Users
```typescript
interface User {
  email: string          // unique
  name: string
  role: 'admin' | 'support' | 'auditor' | 'trainer' | 'user'
  active: boolean
}
```

### Compliance Issues
```typescript
interface ComplianceIssue {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  type: string
  description: string
  file?: string
  line?: number
  resolved: boolean
  resolvedAt?: Date
  discoveredAt: Date
}
```

### Audit Logs
```typescript
interface AuditLog {
  timestamp: Date
  action: 'deploy' | 'access' | 'modify' | 'delete' | 'export'
  actor: string
  resource: string
  status: 'success' | 'failure' | 'pending'
  details?: string
  ipAddress?: string
}
```

### Support Tickets
```typescript
interface SupportTicket {
  ticketNumber: string  // unique
  subject: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in-progress' | 'waiting' | 'resolved' | 'closed'
  requester: { id, name, email }
  responses: Response[]
  createdAt: Date
  resolvedAt?: Date
  slaMet?: boolean
}
```

### Enrollments
```typescript
interface Enrollment {
  user: User
  courseId: string
  courseName: string
  progress: 0-100
  status: 'enrolled' | 'in-progress' | 'completed' | 'dropped'
  modules: Module[]
  enrolledAt: Date
  completedAt?: Date
}
```

### Metrics
```typescript
interface Metric {
  name: string
  category: 'system' | 'performance' | 'reliability' | 'business'
  value: number
  unit?: string
  status: 'healthy' | 'warning' | 'critical'
  timestamp: Date
  threshold?: number
  trend: 'up' | 'down' | 'stable'
  source: string
}
```

### Certifications
```typescript
interface Certification {
  framework: string
  status: 'planning' | 'in-progress' | 'review' | 'completed' | 'expired'
  auditor?: string
  completeness: 0-100
  startDate?: Date
  targetDate?: Date
  completedDate?: Date
  validUntil?: Date
  requirements: Requirement[]
  findings?: string
  notes?: string
}
```

## API Usage

### Query with REST

```bash
# Get all compliance issues
curl http://localhost:3000/api/compliance-issues

# Get critical issues only
curl "http://localhost:3000/api/compliance-issues?where[severity][equals]=critical"

# Get user enrollments
curl "http://localhost:3000/api/enrollments?where[user][equals]=user-1"
```

### Query with GraphQL

```bash
curl http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ complianceIssues { docs { id severity type } } }"
  }'
```

### Seed Programmatically

```typescript
import { seedDatabase, getSeedSummary } from '@/payload/seeds'

// Get summary
const summary = getSeedSummary()
console.log(`${summary.total} records ready to seed`)

// Seed all collections
await seedDatabase(payload)
```

## Deployment

### Docker

```bash
npm run docker:build
npm run docker:run
```

### Kubernetes

```bash
npm run k8s:deploy
npm run k8s:status
```

### Cloudflare Workers

```bash
npm run cf:deploy
```

## Integration Points

### With QPU System
- Metrics collection syncs with MetricsFlow.tsx
- Audit logs record all QPU operations
- Users manage system access

### With Testing Framework
- All test data automatically converts to seeds
- Validates data integrity across systems
- Maintains parity between tests and production

### With 4-Mode Payload
- Browser: React components query `/api/`
- Standalone: Node.js runs Payload server
- Docker: Containerized with MongoDB
- Kubernetes: Scalable multi-replica deployment

## Validation

The seed validator ensures data integrity:

```bash
npm run payload:validate
```

Checks:
- ✅ All required fields present
- ✅ Valid enum values
- ✅ Number ranges correct
- ✅ Date formats valid
- ✅ References consistent

## Troubleshooting

### MongoDB Connection Failed

```bash
# Check MongoDB is running
mongosh --eval "db.version()"

# Set correct URI
export DATABASE_URI=mongodb://localhost:27017/uuidna-qpu
```

### Admin UI Not Accessible

```bash
# Check port 3000 is available
lsof -i :3000

# Start Payload admin
npm run payload:admin
```

### Seed Data Not Imported

```bash
# Validate seeds first
npm run payload:validate

# Check database
mongosh uuidna-qpu --eval "show collections"
```

## Next Steps

1. ✅ Define collections
2. ✅ Create seed data
3. ✅ Validate schemas
4. ⏳ Deploy to production
5. ⏳ Connect frontend APIs
6. ⏳ Set up webhooks
7. ⏳ Configure backups

## Resources

- [Payload CMS Docs](https://payloadcms.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [UUIDNA QPU Docs](../../PAYLOAD_CMS_INTEGRATION.md)

---

**Status**: ✅ Ready for deployment

**Records**: 32 consolidated from test fixtures

**Collections**: 7 fully defined and validated

**Deployment**: Browser, Standalone, Docker, Kubernetes supported
