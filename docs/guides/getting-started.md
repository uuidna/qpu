# Payload CMS Getting Started Guide

**Time to Complete**: 15 minutes  
**Difficulty**: Beginner  
**Prerequisites**: Node.js 22+, npm, MongoDB  

---

## Step 1: Installation (2 minutes)

### 1.1 Install Payload Dependencies

```bash
npm install payload mongodb
```

### 1.2 Install Dev Dependencies

```bash
npm install --save-dev @types/payload
```

### 1.3 Verify Installation

```bash
npm list payload mongodb
```

Expected output:
```
├── payload@3.0.0+
└── mongodb@4.0.0+
```

---

## Step 2: Configure Environment (3 minutes)

### 2.1 Create `.env.local`

```bash
cat > .env.local << 'EOF'
DATABASE_URI=mongodb://localhost:27017/uuidna-qpu
PAYLOAD_SECRET=your-secret-key-change-this
NODE_ENV=development
EOF
```

### 2.2 Verify Environment

```bash
cat .env.local
```

---

## Step 3: Start MongoDB (2 minutes)

### 3.1 Start MongoDB Server

**Option A: Local Installation**
```bash
mongod --dbpath ./data
```

**Option B: Docker**
```bash
docker run -d -p 27017:27017 mongo:latest
```

### 3.2 Verify Connection

```bash
mongosh mongodb://localhost:27017/uuidna-qpu
```

Type `exit` to close the shell.

---

## Step 4: Validate Payload Configuration (2 minutes)

### 4.1 Run Validation Script

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

---

## Step 5: View Seed Information (1 minute)

### 5.1 Check Available Seeds

```bash
npm run payload:seed
```

Expected output:
```
🌱 Payload CMS Database Seeder
Records to seed: 32
Database URI: mongodb://localhost:27017/uuidna-qpu
```

---

## Step 6: Start Admin UI (3 minutes)

### 6.1 Launch Payload Admin

```bash
npm run payload:admin
```

You should see:
```
✓ Building Admin
✓ Admin built successfully
→ Payload CMS Admin UI available at http://localhost:3000/admin
```

### 6.2 Access Admin Dashboard

Open browser to: `http://localhost:3000/admin`

You should see the Payload CMS login screen.

---

## Step 7: Create Admin User (2 minutes)

### 7.1 Create First User

In the admin UI, you'll see a form to create the first admin user.

Fill in:
- **Email**: admin@example.com
- **Password**: Create a strong password
- **Confirm Password**: Repeat password

Click **Create Admin User**

### 7.2 Login

You'll be logged in automatically and see the admin dashboard.

---

## Step 8: Explore Collections (5 minutes)

### 8.1 View Users

1. Left sidebar → Click **Users**
2. You should see 5 users listed:
   - john@example.com (user)
   - support@example.com (support)
   - auditor@example.com (auditor)
   - admin@example.com (admin)
   - trainer@example.com (trainer)

### 8.2 View Compliance Issues

1. Left sidebar → Click **Compliance Issues**
2. You should see 5 issues with different severities:
   - Critical: hardcoded API key
   - Critical: hardcoded secret
   - High: hardcoded password
   - Medium: missing authentication
   - Low: outdated dependency

### 8.3 View Metrics

1. Left sidebar → Click **Metrics**
2. You should see 8 metrics:
   - CPU Usage: 45%
   - Memory Usage: 60%
   - Learning: 89.7%
   - And 5 more...

---

## Step 9: View Dashboards (3 minutes)

### 9.1 Access Main Dashboard

At the top of the admin panel, click the dashboard icon or navigate to:
`http://localhost:3000/admin/dashboard`

### 9.2 Explore Dashboard Tabs

You should see 4 tabs:
1. **🏥 System Health** - Real-time metrics overview
2. **📋 Compliance** - Issues and certification status
3. **🎫 Support** - Ticket management and SLA tracking
4. **🎓 Training** - Course and enrollment progress

Each tab shows real-time data and interactive visualizations.

---

## Step 10: Test API Endpoints (3 minutes)

### 10.1 REST API - Get All Users

```bash
curl http://localhost:3000/api/users
```

Expected response:
```json
{
  "docs": [
    {
      "id": "...",
      "email": "john@example.com",
      "name": "John",
      "role": "user",
      "active": true
    },
    ...
  ],
  "totalDocs": 5,
  "limit": 10,
  "page": 1
}
```

### 10.2 REST API - Get Compliance Issues

```bash
curl "http://localhost:3000/api/compliance-issues?where[severity][equals]=critical"
```

This filters for only critical issues.

### 10.3 GraphQL - Query Users

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ users { docs { id email name role } } }"
  }'
```

Expected response includes all users in JSON format.

---

## Step 11: Seed Database (Optional) (2 minutes)

### 11.1 Import Seed Data

```typescript
// In your application code
import { seedDatabase } from '@/payload/seeds'

async function initializeDatabase() {
  const result = await seedDatabase(payload)
  console.log('Database seeded with 32 records')
}
```

Or via CLI:
```bash
npx payload seed
```

### 11.2 Verify Seeds Imported

Go to admin UI and check each collection for records:
- Users: 5 records ✓
- Compliance Issues: 5 records ✓
- Audit Logs: 5 records ✓
- Support Tickets: 3 records ✓
- Enrollments: 3 records ✓
- Metrics: 8 records ✓
- Certifications: 3 records ✓

---

## Step 12: Create First Custom Record (3 minutes)

### 12.1 Add New Metric

1. Go to **Metrics** collection
2. Click **Create New** button
3. Fill in:
   - **name**: "Custom Metric"
   - **value**: 85
   - **unit**: "%"
   - **status**: "healthy"
   - **timestamp**: Today's date
   - **source**: "manual-entry"

4. Click **Save**

### 12.2 Verify Record Created

The new metric should appear in the metrics list with a unique ID.

---

## Troubleshooting

### Issue: MongoDB Connection Failed

**Solution**:
```bash
# Check MongoDB is running
mongosh --eval "db.version()"

# If not running, start it
mongod --dbpath ./data &
```

### Issue: Admin UI Not Loading

**Solution**:
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9

# Start fresh
npm run payload:admin
```

### Issue: Validation Errors

**Solution**:
```bash
# Re-validate seeds
npm run payload:validate

# Check for specific collection errors
# See output for detailed error messages
```

### Issue: Can't Login

**Solution**:
1. Stop admin server: `Ctrl+C`
2. Delete admin user data
3. Restart: `npm run payload:admin`
4. Create new admin user

---

## Next Steps

### 🚀 Deploy to Production
See: `PAYLOAD_DEPLOYMENT_GUIDE.md`

### 🔗 Integrate with Application
See: `PAYLOAD_INTEGRATION_GUIDE.md`

### 👨‍💻 Development & Customization
See: `PAYLOAD_DEVELOPMENT_GUIDE.md`

### 📚 Reference Documentation
See: `src/payload/README.md`

---

## Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run payload:validate` | Validate all seed data |
| `npm run payload:seed` | Show seed information |
| `npm run payload:admin` | Start admin UI (port 3000) |
| `npm run docker:build` | Build Docker image |
| `npm run docker:run` | Run Docker container |
| `npm run k8s:deploy` | Deploy to Kubernetes |

---

## Success Checklist

After completing this guide, you should have:

- ✅ Payload CMS installed
- ✅ MongoDB running
- ✅ Environment configured
- ✅ Validation passed
- ✅ Admin UI accessible
- ✅ All 7 collections visible
- ✅ 32 seed records loaded
- ✅ 4 dashboards functional
- ✅ APIs working (REST + GraphQL)
- ✅ First custom record created

---

**Estimated Time**: 15 minutes  
**Difficulty**: Beginner ✓ Completed!

**Next**: Ready for deployment or development. See guides above.
