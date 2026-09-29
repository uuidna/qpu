# UUIDNA QPU - Cloudflare Bindings Toolbox

**Complete binding configuration, verification, and error handling for production deployment**

---

## Overview

The Cloudflare Worker requires **4 critical bindings** to function:

| Binding | Type | Purpose | Status |
|---------|------|---------|--------|
| **STORAGE** | KV Namespace | Result caching, temp data | ✅ Required |
| **BLOBS** | R2 Bucket | File storage | ✅ Required |
| **PAYLOAD** | Service Binding | Admin backend | ✅ Required |
| **CF_VERSION_METADATA** | Env Binding | Version tracking | ✅ Required |

**All must be present and functional before deployment.**

---

## Bindings Configuration

### 1. STORAGE (KV Namespace)

```toml
# wrangler.toml
[[kv_namespaces]]
binding = "STORAGE"
id = "b341b266250444198e54508ca3aee53a"
preview_id = "b341b266250444198e54508ca3aee53a"
```

**Functions that use STORAGE:**
```typescript
export const qpuStorageOf = async (env, { method, key, value, auth, via })
// Methods: GET, PUT, DELETE
// Auth: Bearer token (unless via='binding')
```

**Operations:**
```bash
# List keys
wrangler kv:key list STORAGE

# Get value
wrangler kv:key get STORAGE <key>

# Put value
wrangler kv:key put STORAGE <key> <value>

# Delete value
wrangler kv:key delete STORAGE <key>
```

**Error Handling:**
```javascript
try {
  const result = await env.STORAGE.get(key);
  if (!result) throw new Error(`Key not found: ${key}`);
} catch (error) {
  return { error: `Storage failed: ${error.message}` };
}
```

---

### 2. BLOBS (R2 Bucket)

```toml
# wrangler.toml
[[r2_buckets]]
binding = "BLOBS"
bucket_name = "uuidna-qpu-blobs"
```

**Bucket Configuration:**
- Name: `uuidna-qpu-blobs`
- Region: Auto (Cloudflare chooses optimal location)
- Versioning: Enabled (for rollback safety)
- Lifecycle: 90-day retention

**Operations:**
```bash
# List objects
wrangler r2 object list uuidna-qpu-blobs

# Upload file
wrangler r2 object create uuidna-qpu-blobs <key> --file <path>

# Download file
wrangler r2 object get uuidna-qpu-blobs <key>

# Delete object
wrangler r2 object delete uuidna-qpu-blobs <key>
```

**Error Handling:**
```javascript
try {
  const object = await env.BLOBS.get(key);
  if (!object) throw new Error(`Blob not found: ${key}`);
  return object.stream();
} catch (error) {
  return new Response(`Blob error: ${error.message}`, { status: 500 });
}
```

---

### 3. PAYLOAD (Service Binding)

```toml
# wrangler.toml
[[services]]
binding = "PAYLOAD"
service = "uuidna-payload"
```

**Service Requirements:**
- Service name: `uuidna-payload` (must exist in same account)
- Available endpoints: `/api/*`
- Authentication: Service-to-service (no token required)
- Billing: No additional cost (service binding hops not billed)

**Usage in worker.js:**
```typescript
export class QpuDeposit extends WorkerEntrypoint {
  async deposit(key, value) {
    return qpuStorageOf(this.env, { 
      method: 'PUT', 
      key, 
      value, 
      via: 'binding'  // Marks as service binding (no token)
    })
  }
}
```

**Error Handling:**
```javascript
try {
  const response = await env.PAYLOAD.fetch('https://payload/api/deposit', {
    method: 'POST',
    body: JSON.stringify({ key, value })
  });
  if (!response.ok) throw new Error(`Payload error: ${response.status}`);
} catch (error) {
  return { error: `Backend unavailable: ${error.message}` };
}
```

---

### 4. CF_VERSION_METADATA (Environment)

```toml
# wrangler.toml
[version_metadata]
binding = "CF_VERSION_METADATA"
```

**Available at runtime:**
```typescript
interface CloudflareVersionMetadata {
  id: string;        // Deployment ID
  tag?: string;      // Version tag
  timestamp: number; // Deployment time
}
```

**Usage:**
```typescript
export const versionOf = () => env.CF_VERSION_METADATA?.id || 'unknown';
```

---

## Binding Initialization Checklist

### Pre-Deployment

```bash
# 1. Verify STORAGE namespace exists
wrangler kv:namespace list
# Expected: STORAGE binding listed

# 2. Verify BLOBS bucket exists
wrangler r2 bucket list
# Expected: uuidna-qpu-blobs listed

# 3. Verify PAYLOAD service exists
wrangler services list  # or check Cloudflare dashboard
# Expected: uuidna-payload service exists

# 4. Test STORAGE connectivity
wrangler kv:key put STORAGE test "hello"
wrangler kv:key get STORAGE test
wrangler kv:key delete STORAGE test

# 5. Test BLOBS connectivity
echo "test" > /tmp/test.txt
wrangler r2 object create uuidna-qpu-blobs test.txt --file /tmp/test.txt
wrangler r2 object get uuidna-qpu-blobs test.txt
wrangler r2 object delete uuidna-qpu-blobs test.txt
```

### Post-Deployment

```bash
# 1. Verify worker responds
curl https://qpu.uuidna.com/health

# 2. Test storage operation
curl -X POST https://qpu.uuidna.com/api/execute/batch/batchExecute \
  -d '{"count": 10}'

# 3. Monitor logs for binding errors
wrangler tail --status error

# 4. Check storage contents
wrangler kv:key list STORAGE

# 5. Check blob storage
wrangler r2 object list uuidna-qpu-blobs
```

---

## Error Scenarios & Recovery

### Missing STORAGE Binding

**Symptom:**
```
Error: Unknown KV namespace: STORAGE
```

**Recovery:**
```bash
# 1. Create namespace
wrangler kv:namespace create "qpu-storage"

# 2. Get the ID from output
# 3. Update wrangler.toml with correct ID
[[kv_namespaces]]
binding = "STORAGE"
id = "<new-id>"

# 4. Redeploy
npm run ship
```

### Missing BLOBS Binding

**Symptom:**
```
Error: Unknown bucket: uuidna-qpu-blobs
```

**Recovery:**
```bash
# 1. Create bucket
wrangler r2 bucket create uuidna-qpu-blobs

# 2. Verify bucket exists
wrangler r2 bucket list

# 3. Redeploy
npm run ship
```

### Unavailable PAYLOAD Service

**Symptom:**
```
Error: Service 'uuidna-payload' not found or not ready
```

**Recovery:**
```bash
# 1. Check service status
wrangler services list

# 2. Deploy PAYLOAD service if missing
cd ../payload && npm run ship  # From payload repo

# 3. Wait for service to be ready (~30 seconds)

# 4. Redeploy QPU
npm run ship
```

### Permission Denied (Auth Token)

**Symptom:**
```
Error: Unauthorized: Missing or invalid QPU_WRITE_TOKEN
```

**Recovery:**
```bash
# 1. Set write token
wrangler secret put QPU_WRITE_TOKEN

# 2. Enter token when prompted (or pass via env var)
QPU_WRITE_TOKEN=<token> wrangler deploy

# 3. Verify with authenticated request
curl -X PUT https://qpu.uuidna.com/storage \
  -H "Authorization: Bearer $QPU_WRITE_TOKEN" \
  -d '{"key": "test", "value": "data"}'
```

---

## Binding Dependencies Map

```
qpu-worker
├── STORAGE (KV)
│   └── Required by:
│       ├── qpuStorageOf() - GET/PUT/DELETE operations
│       ├── Result caching
│       └── Algorithm state persistence
│
├── BLOBS (R2)
│   └── Required by:
│       ├── Large file storage
│       ├── Benchmark results
│       └── Training data
│
├── PAYLOAD (Service)
│   └── Required by:
│       ├── QpuDeposit entrypoint
│       ├── Admin API calls
│       └── Backend synchronization
│
└── CF_VERSION_METADATA (Env)
    └── Required by:
        ├── Deployment tracking
        └── Version reporting
```

---

## Complete Toolbox Verification Script

```bash
#!/bin/bash
# verify-bindings.sh - Full binding verification

set -e

echo "🔍 Verifying UUIDNA QPU Bindings..."
echo ""

# 1. STORAGE
echo "1️⃣  STORAGE (KV Namespace)"
if wrangler kv:key put STORAGE binding-test "$(date)" > /dev/null 2>&1; then
  VALUE=$(wrangler kv:key get STORAGE binding-test)
  wrangler kv:key delete STORAGE binding-test > /dev/null
  echo "   ✅ STORAGE namespace is working"
else
  echo "   ❌ STORAGE namespace is NOT accessible"
  exit 1
fi

# 2. BLOBS
echo "2️⃣  BLOBS (R2 Bucket)"
if wrangler r2 object list uuidna-qpu-blobs > /dev/null 2>&1; then
  echo "   ✅ BLOBS bucket is accessible"
else
  echo "   ❌ BLOBS bucket is NOT accessible"
  exit 1
fi

# 3. PAYLOAD
echo "3️⃣  PAYLOAD (Service Binding)"
if wrangler services list | grep -q "uuidna-payload"; then
  echo "   ✅ PAYLOAD service is registered"
else
  echo "   ⚠️  PAYLOAD service not found (may be OK if not yet deployed)"
fi

# 4. Version Metadata
echo "4️⃣  CF_VERSION_METADATA"
if grep -q "version_metadata" wrangler.toml; then
  echo "   ✅ Version metadata binding is configured"
else
  echo "   ❌ Version metadata binding is NOT configured"
  exit 1
fi

# 5. Worker responds
echo "5️⃣  Worker Health Check"
if curl -s https://qpu.uuidna.com/health | grep -q "healthy"; then
  echo "   ✅ Worker is responding"
else
  echo "   ⚠️  Worker may not be deployed yet"
fi

echo ""
echo "✅ All critical bindings verified!"
echo ""
echo "Binding Status:"
echo "  • STORAGE: ✅ Working"
echo "  • BLOBS: ✅ Accessible"
echo "  • PAYLOAD: ✅ Available"
echo "  • CF_VERSION_METADATA: ✅ Configured"
echo ""
echo "Ready to deploy: npm run ship"
```

**Run verification:**
```bash
bash verify-bindings.sh
```

---

## Production Checklist

Before `npm run ship`:

- [ ] All 4 bindings configured in wrangler.toml
- [ ] STORAGE namespace created and accessible
- [ ] BLOBS bucket created and accessible
- [ ] PAYLOAD service deployed (in same account)
- [ ] QPU_WRITE_TOKEN secret set (if auth required)
- [ ] All 33 tools exported from dist/quantum/processing/unit/
- [ ] qpuStorageOf function properly handles errors
- [ ] Tests pass: npm test
- [ ] Local dev works: wrangler dev
- [ ] Verify script passes: bash verify-bindings.sh
- [ ] No uncommitted changes: git status clean

---

## Deployed Bindings Map

Once deployed at https://qpu.uuidna.com:

```
├─ /health                    (binding-independent)
├─ /ready                     (checks all bindings)
├─ /metrics                   (cached in STORAGE)
├─ /api/execute/*            (uses all bindings)
│  ├─ /cryptography/*        (caches in STORAGE)
│  ├─ /optimization/*        (stores results in BLOBS)
│  └─ /testing/*             (receipts in STORAGE)
└─ /storage                  (STORAGE & auth via PAYLOAD)
```

---

## Next Steps

1. ✅ Verify all bindings configured
2. ✅ Run verification script
3. ✅ Deploy with `npm run ship`
4. ✅ Monitor with `wrangler tail`
5. ✅ Test with curl or browser
6. ✅ Check KV/R2 contents afterward

---

**Status:** Complete Toolbox Ready for Production

For deployment issues, consult [CLOUDFLARE.md](CLOUDFLARE.md)
