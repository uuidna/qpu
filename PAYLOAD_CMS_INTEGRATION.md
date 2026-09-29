# Payload CMS Integration Guide

## Overview

The UUIDNA QPU system now integrates **Payload CMS** as a structured content management layer. All test fixtures have been converted into Payload CMS seed data, creating a unified data model for:

- Users and authentication
- Compliance tracking
- Audit logs
- Support tickets
- Training enrollments
- System metrics
- Certifications

## Architecture

### Collections

Each collection corresponds to a domain in the test suite:

| Collection | Source | Records | Purpose |
|------------|--------|---------|---------|
| `users` | test fixtures | 5 | Authentication, role management |
| `compliance-issues` | complianceScanner tests | 5 | Security issue tracking |
| `audit-logs` | compliance dashboard tests | 5 | Compliance audit trail |
| `support-tickets` | support portal tests | 3 | Customer support tracking |
| `enrollments` | training platform tests | 3 | Course enrollment tracking |
| `metrics` | operations dashboard tests | 8 | Real-time system metrics |
| `certifications` | certification portal tests | 3 | Compliance certifications |

**Total Records**: 32 records from consolidated test data

### Directory Structure

```
src/payload/
├── collections/               # Collection definitions
│   ├── users.ts
│   ├── compliance-issues.ts
│   ├── audit-logs.ts
│   ├── support-tickets.ts
│   ├── enrollments.ts
│   ├── metrics.ts
│   ├── certifications.ts
│   └── index.ts
├── seeds/                    # Seed data (test fixtures → CMS)
│   ├── users.seed.ts
│   ├── compliance-issues.seed.ts
│   ├── audit-logs.seed.ts
│   ├── support-tickets.seed.ts
│   ├── enrollments.seed.ts
│   ├── metrics.seed.ts
│   ├── certifications.seed.ts
│   └── index.ts             # Master seed function
└── payload-types.ts         # Auto-generated TypeScript types
```

## Setup

### Installation

```bash
npm install payload mongodb
```

### Configuration

The `payload.config.ts` file at the project root defines:

- MongoDB connection (configurable via `DATABASE_URI`)
- Collection definitions
- Admin UI configuration
- Rich text editor (Slate)

### Environment

Set database connection:

```bash
export DATABASE_URI=mongodb://localhost:27017/uuidna-qpu
```

## Usage

### Initialize Database with Seeds

```typescript
import { seedDatabase, getSeedSummary } from '@/payload/seeds'

// Get seed summary
const summary = getSeedSummary()
console.log('Records to seed:', summary)
// Output:
// {
//   users: 5,
//   complianceIssues: 5,
//   auditLogs: 5,
//   supportTickets: 3,
//   enrollments: 3,
//   metrics: 8,
//   certifications: 3,
//   total: 32
// }

// Seed database
await seedDatabase(payload)
```

### Query Examples

```typescript
// Get all compliance issues
const issues = await payload.find({
  collection: 'compliance-issues',
  where: { severity: { equals: 'critical' } }
})

// Get user enrollments
const enrollments = await payload.find({
  collection: 'enrollments',
  where: { user: { equals: 'user-1' } }
})

// Get metrics snapshot
const metrics = await payload.find({
  collection: 'metrics',
  where: { timestamp: { greater_than_equal: new Date('2024-01-20') } }
})
```

## Integration with 4-Mode Payload

This Payload CMS setup is the **Content Management layer** of the 4-mode deployment:

1. **Browser**: React components query Payload CMS via API
2. **Standalone**: Node.js server runs Payload admin + collections
3. **Docker**: Containerized Payload + MongoDB
4. **Kubernetes**: Scalable Payload deployment with persistent MongoDB

### Docker Deployment

```yaml
# docker-compose.yml
version: '3.9'
services:
  payload:
    image: node:18-alpine
    command: npm run dev
    ports:
      - "3000:3000"
    environment:
      DATABASE_URI: mongodb://mongo:27017/uuidna-qpu
    depends_on:
      - mongo
  
  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: payload-cms
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: payload
        image: uuidna/qpu-payload:latest
        env:
        - name: DATABASE_URI
          valueFrom:
            secretKeyRef:
              name: payload-secrets
              key: database-uri
        ports:
        - containerPort: 3000
```

## Data Model

### Users
- `id`, `email`, `name`, `role`, `active`
- Roles: admin, support, auditor, trainer, user

### Compliance Issues
- Severity: critical, high, medium, low, info
- Tracks: type, description, file, line, resolution status

### Audit Logs
- Action: deploy, access, modify, delete, export
- Captures: timestamp, actor, resource, status, IP address

### Support Tickets
- Priority: low, medium, high, critical
- Status: open, in-progress, waiting, resolved, closed
- Includes: requester info, responses, SLA tracking

### Enrollments
- Tracks course progress (0-100%)
- Modules with completion status and scores
- Status: enrolled, in-progress, completed, dropped

### Metrics
- Categories: system, performance, reliability, business
- Real-time values with status (healthy, warning, critical)
- Trend tracking and threshold management

### Certifications
- Frameworks: SOC 2, ISO 27001, HIPAA, etc.
- Status: planning, in-progress, review, completed, expired
- Requirement tracking with due dates

## API Routes

When running Payload:

- **Admin UI**: `http://localhost:3000/admin`
- **REST API**: `http://localhost:3000/api/collections/:collection`
- **GraphQL**: `http://localhost:3000/graphql`

## Conversion from Tests to CMS

The conversion process:

1. **Extract** test fixtures from `*.test.ts` files
2. **Map** test data to collection schemas
3. **Create** seed files with normalized data
4. **Validate** seeds match collection definitions
5. **Deploy** seeds to Payload database

This ensures the CMS is always aligned with the actual system behavior tested in the test suite.

## Next Steps

- [ ] Configure environment variables
- [ ] Set up MongoDB
- [ ] Run `npm run seed` to populate database
- [ ] Access admin UI at `/admin`
- [ ] Query data via REST/GraphQL APIs
- [ ] Deploy to Docker/Kubernetes

## Status

✅ Payload configuration created
✅ All collections defined
✅ All seed data generated from tests
✅ Master seed function implemented
⏳ Ready for deployment

---

**Note**: This Payload CMS setup uses the **payload templates** approach - all configuration and data flows through defined templates, no ad-hoc manual changes.
