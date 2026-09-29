# Payload CMS Deployment Guide

**Time to Complete**: 30 minutes (varies by deployment mode)  
**Difficulty**: Intermediate  
**Prerequisites**: Payload CMS configured locally, git, Docker (for Docker/K8s)  

---

## Choose Your Deployment Mode

| Mode | Time | Complexity | Best For |
|------|------|-----------|----------|
| Standalone | 5 min | Low | Development, small deployments |
| Docker | 10 min | Medium | Staging, testing, local prod |
| Kubernetes | 20 min | High | Production, scalability |
| Cloudflare Workers | 15 min | Medium | Edge deployment, serverless |

---

## Deployment Mode 1: Standalone Node.js

### 1.1 Prepare Application

```bash
# Build production bundle
npm run build

# Verify build
ls -lh dist/
```

### 1.2 Set Production Environment

```bash
# Create production .env
cat > .env.production << 'EOF'
DATABASE_URI=mongodb://prod-mongo:27017/uuidna-qpu
PAYLOAD_SECRET=your-production-secret-key-change-this
NODE_ENV=production
ADMIN_USER_EMAIL=admin@qpu.uuidna.com
EOF
```

### 1.3 Start Production Server

```bash
# Start server
NODE_ENV=production npm run server

# Or in background
NODE_ENV=production npm run server &
```

### 1.4 Verify Running

```bash
# Check admin UI
curl http://localhost:3000/admin

# Check API
curl http://localhost:3000/api/users
```

---

## Deployment Mode 2: Docker

### 2.1 Build Docker Image

```bash
# Build image (creates Dockerfile if needed)
npm run docker:build

# Verify image
docker images | grep uuidna-qpu
```

### 2.2 Create docker-compose.yml

```bash
cat > docker-compose.yml << 'EOF'
version: '3.9'

services:
  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: changeme
    healthcheck:
      test: echo 'db.runCommand("ping").ok'
      interval: 10s
      timeout: 5s
      retries: 5

  payload:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      mongodb:
        condition: service_healthy
    environment:
      DATABASE_URI: mongodb://admin:changeme@mongodb:27017/uuidna-qpu
      PAYLOAD_SECRET: your-secret-key-change-this
      NODE_ENV: production
    volumes:
      - ./uploads:/app/uploads

volumes:
  mongodb_data:
EOF
```

### 2.3 Start Docker Containers

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f payload
```

### 2.4 Verify Deployment

```bash
# Check MongoDB
docker-compose exec mongodb mongosh

# Check Payload
curl http://localhost:3000/api/users
```

### 2.5 Stop Services

```bash
docker-compose down

# Keep data
docker-compose down -v  # Remove volumes too
```

---

## Deployment Mode 3: Kubernetes

### 3.1 Create Docker Image

```bash
# Build and push to registry
docker build -t your-registry/uuidna-qpu:1.0.0 .
docker push your-registry/uuidna-qpu:1.0.0
```

### 3.2 Create Namespace

```bash
kubectl create namespace quantum
```

### 3.3 Create ConfigMap

```bash
cat > k8s-configmap.yaml << 'EOF'
apiVersion: v1
kind: ConfigMap
metadata:
  name: payload-config
  namespace: quantum
data:
  PAYLOAD_SECRET: "your-secret-key"
  NODE_ENV: "production"
EOF

kubectl apply -f k8s-configmap.yaml
```

### 3.4 Create Secret for MongoDB

```bash
kubectl create secret generic mongodb-secret \
  --from-literal=username=admin \
  --from-literal=password=changeme \
  -n quantum
```

### 3.5 Create MongoDB StatefulSet

```bash
cat > k8s-mongodb.yaml << 'EOF'
apiVersion: v1
kind: Service
metadata:
  name: mongodb
  namespace: quantum
spec:
  clusterIP: None
  selector:
    app: mongodb
  ports:
  - port: 27017

---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mongodb
  namespace: quantum
spec:
  serviceName: mongodb
  replicas: 1
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
      - name: mongodb
        image: mongo:6
        ports:
        - containerPort: 27017
        volumeMounts:
        - name: mongodb-storage
          mountPath: /data/db
        env:
        - name: MONGO_INITDB_ROOT_USERNAME
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: username
        - name: MONGO_INITDB_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: password
  volumeClaimTemplates:
  - metadata:
      name: mongodb-storage
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 10Gi
EOF

kubectl apply -f k8s-mongodb.yaml
```

### 3.6 Create Payload Deployment

```bash
cat > k8s-payload.yaml << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: payload
  namespace: quantum
spec:
  replicas: 2
  selector:
    matchLabels:
      app: payload
  template:
    metadata:
      labels:
        app: payload
    spec:
      containers:
      - name: payload
        image: your-registry/uuidna-qpu:1.0.0
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URI
          value: "mongodb://admin:changeme@mongodb:27017/uuidna-qpu"
        - name: PAYLOAD_SECRET
          valueFrom:
            configMapKeyRef:
              name: payload-config
              key: PAYLOAD_SECRET
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: payload-config
              key: NODE_ENV
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/users
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: payload
  namespace: quantum
spec:
  type: LoadBalancer
  selector:
    app: payload
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
EOF

kubectl apply -f k8s-payload.yaml
```

### 3.7 Monitor Deployment

```bash
# Check pod status
kubectl get pods -n quantum

# View logs
kubectl logs -n quantum deployment/payload

# Get service IP
kubectl get svc -n quantum payload
```

### 3.8 Scale Deployment

```bash
# Scale to 3 replicas
kubectl scale deployment payload --replicas=3 -n quantum

# Verify
kubectl get pods -n quantum
```

---

## Deployment Mode 4: Cloudflare Workers

### 4.1 Setup Wrangler

```bash
# Install wrangler
npm install -g wrangler

# Authenticate with Cloudflare
wrangler login
```

### 4.2 Configure wrangler.toml

```toml
name = "uuidna-qpu"
main = "dist/index.js"
compatibility_date = "2024-09-29"

[env.production]
name = "uuidna-qpu-prod"
route = "qpu.uuidna.com/*"
zone_id = "your-zone-id"

[[kv_namespaces]]
binding = "PAYLOAD_DB"
id = "your-kv-namespace-id"

[[d1_databases]]
binding = "DB"
database_name = "uuidna-qpu"
```

### 4.3 Deploy to Cloudflare

```bash
# Deploy to staging
wrangler deploy

# Deploy to production
wrangler deploy --env production
```

### 4.4 Verify Deployment

```bash
# Test endpoint
curl https://qpu.uuidna.com/api/users

# View logs
wrangler tail
```

---

## Post-Deployment Checklist

### ✅ Health Checks

```bash
# API Health
curl http://localhost:3000/api/health

# Database Connection
curl http://localhost:3000/api/users

# Admin UI
curl http://localhost:3000/admin
```

### ✅ Validate Data

```bash
# Run validation
npm run payload:validate

# Check seed records
curl http://localhost:3000/api/compliance-issues | grep -c "severity"
```

### ✅ Security Verification

- [ ] PAYLOAD_SECRET set to unique value
- [ ] DATABASE_URI uses production credentials
- [ ] CORS origins configured
- [ ] HTTPS enabled (production)
- [ ] Admin user credentials changed

### ✅ Monitoring Setup

- [ ] Logging configured
- [ ] Error tracking enabled
- [ ] Uptime monitoring active
- [ ] Performance metrics tracked

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URI | Yes | MongoDB connection string |
| PAYLOAD_SECRET | Yes | Secret key for encryption |
| NODE_ENV | No | `production` or `development` |
| ADMIN_USER_EMAIL | No | Initial admin email |
| ADMIN_USER_PASSWORD | No | Initial admin password |
| CORS_ORIGINS | No | Allowed CORS origins |

---

## Rollback Procedures

### Docker Rollback

```bash
# Stop current version
docker-compose down

# Start previous version
docker-compose up -d
```

### Kubernetes Rollback

```bash
# View rollout history
kubectl rollout history deployment/payload -n quantum

# Rollback to previous version
kubectl rollout undo deployment/payload -n quantum

# Verify rollback
kubectl get pods -n quantum
```

---

## Performance Optimization

### Database Optimization

```bash
# Create indexes
kubectl exec -it mongodb-0 -n quantum -- mongosh

db.users.createIndex({ email: 1 })
db.complianceIssues.createIndex({ severity: 1 })
db.supportTickets.createIndex({ status: 1 })
```

### Caching Strategy

```bash
# Enable Redis cache
export REDIS_URL=redis://redis:6379

# Restart services
npm run server
```

---

## Troubleshooting Deployments

### Issue: Database Connection Failed

```bash
# Check MongoDB
mongosh mongodb://user:pass@host:27017/db

# Check firewall
telnet mongodb-host 27017
```

### Issue: Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Issue: Out of Memory

```bash
# Increase heap size
NODE_OPTIONS=--max-old-space-size=2048 npm run server

# Kubernetes: set resource limits
# See k8s-payload.yaml for resources section
```

---

## Monitoring & Alerts

### Setup Monitoring

```bash
# View real-time logs
kubectl logs -f deployment/payload -n quantum

# Monitor resources
kubectl top pods -n quantum

# Check health
kubectl get endpoints payload -n quantum
```

### Configure Alerts

Set up alerts for:
- Pod restart frequency
- CPU usage > 80%
- Memory usage > 85%
- API response time > 1s
- Error rate > 5%

---

## Next Steps

After deployment:

1. **🔐 Security Hardening**: See security best practices
2. **📊 Monitoring Setup**: Configure logging and alerts
3. **🔄 CI/CD Pipeline**: Set up automated deployments
4. **📚 Documentation**: Update runbooks
5. **👥 Team Training**: Train team on deployment process

---

**Deployment Status**: Ready to deploy  
**Recommended**: Docker for staging, Kubernetes for production
