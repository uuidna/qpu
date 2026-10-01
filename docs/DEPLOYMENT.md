# UUIDNA QPU - Deployment Guide

**License:** CC-BY-NC-ND-4.0  
**Status:** Production-Ready (Phase 4 Complete)

---

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Start local server
npm run dev
```

### Docker Compose (Staging/Testing)

```bash
# Start all services (QPU + PostgreSQL + Redis + Prometheus + Grafana + Jaeger)
docker-compose up -d

# Access services:
# - QPU API: http://localhost:8080
# - Prometheus: http://localhost:9000
# - Grafana: http://localhost:3000 (admin/admin)
# - Jaeger: http://localhost:16686

# View logs
docker-compose logs -f qpu

# Stop services
docker-compose down
```

---

## Kubernetes Deployment (Production)

### Prerequisites

- Kubernetes 1.24+
- kubectl configured with cluster access
- Container registry access (DockerHub, GitHub Container Registry, etc.)

### Deploy to Production

```bash
# 1. Build and push Docker image
docker buildx build --platform linux/amd64,linux/arm64 \
  -t ghcr.io/tsvetan/uuidna:latest \
  --push .

# 2. Create namespace
kubectl create namespace qpu-prod

# 3. Create secrets (OPTIONAL - for IBM Quantum API, etc.)
kubectl create secret generic qpu-secrets \
  --from-literal=IBM_QUANTUM_API_KEY="your-api-key" \
  -n qpu-prod

# 4. Apply Kubernetes manifests
kubectl apply -f k8s/deployment.yaml

# 5. Verify deployment
kubectl get deployment -n qpu-prod
kubectl get pods -n qpu-prod
kubectl get svc -n qpu-prod

# 6. Check rollout status
kubectl rollout status deployment/qpu-main -n qpu-prod

# 7. Get LoadBalancer IP
kubectl get svc qpu-loadbalancer -n qpu-prod
```

### Upgrade Deployment

```bash
# Update image
kubectl set image deployment/qpu-main qpu=ghcr.io/tsvetan/uuidna:v0.2.1 \
  -n qpu-prod \
  --record

# Check rollout
kubectl rollout status deployment/qpu-main -n qpu-prod

# Rollback if needed
kubectl rollout undo deployment/qpu-main -n qpu-prod
```

### Monitoring

```bash
# View logs
kubectl logs -f deployment/qpu-main -n qpu-prod

# Port forward to Prometheus
kubectl port-forward -n qpu-prod svc/prometheus 9090:9090

# Port forward to Grafana
kubectl port-forward -n qpu-prod svc/grafana 3000:3000
```

---

## Cloudflare Workers (Edge Deployment)

### Prerequisites

- Cloudflare account
- Wrangler CLI: `npm install -g wrangler`

### Deploy to Cloudflare

```bash
# 1. Login to Cloudflare
wrangler login

# 2. Update wrangler.toml with your account ID
# Change: account_id = "YOUR_CLOUDFLARE_ACCOUNT_ID"

# 3. Deploy to production
wrangler deploy --env production

# 4. Deploy to staging
wrangler deploy --env staging

# 5. View logs
wrangler tail --env production

# 6. Test endpoint
curl https://api.example.com/quantum/prove?formula=Fibonacci_7
```

---

## CI/CD Pipeline

### GitHub Actions

The project includes automated CI/CD pipeline (`.github/workflows/ci-cd.yml`):

1. **Lint & Type Check** - TypeScript compilation, linting, license compliance
2. **Unit Tests** - Run test suite with coverage
3. **Security Scan** - Trivy vulnerability scanning, npm audit
4. **Docker Build** - Multi-platform build (amd64, arm64)
5. **Deploy to Staging** - Automatic deployment on `develop` branch
6. **Deploy to Production** - Manual approval required for `main` branch

### Manual Trigger

```bash
# Push to develop branch (triggers staging deployment)
git push origin develop

# Tag release for production
git tag v0.2.1
git push origin v0.2.1
```

---

## Environment Variables

### Local Development

```bash
NODE_ENV=development
LOG_LEVEL=debug
FORMULA_CORPUS_SIZE=42
QUANTUM_SIMULATOR=mock
MCP_ENABLED=true
```

### Staging

```bash
NODE_ENV=staging
LOG_LEVEL=info
FORMULA_CORPUS_SIZE=42
QUANTUM_SIMULATOR=qiskit
MCP_ENABLED=true
DATABASE_URL=postgresql://user:pass@postgres:5432/qpu_staging
REDIS_URL=redis://redis:6379/0
```

### Production

```bash
NODE_ENV=production
LOG_LEVEL=warn
FORMULA_CORPUS_SIZE=42
QUANTUM_SIMULATOR=qiskit
IBM_QUANTUM_ENABLED=true
MCP_ENABLED=true
DATABASE_URL=postgresql://user:pass@postgres-prod:5432/qpu_db
REDIS_URL=redis://redis-prod:6379/0
MONITORING_TOKEN=your-token-here
```

---

## Monitoring & Observability

### Metrics

- **Prometheus**: http://localhost:9000
- **Grafana**: http://localhost:3000
- **Custom Metrics**:
  - `http_requests_total` - Total HTTP requests
  - `http_request_duration_seconds` - Request duration
  - `formula_computations_total` - Total formulas computed
  - `quantum_validation_failures_total` - Quantum validation failures
  - `redis_cache_hits_total` - Cache hit count
  - `license_compliance_violations_total` - License violations

### Alerting

Alert rules in `k8s/prometheus-rules.yml`:

- Service availability (up/down)
- High error rates (5xx)
- High latency (p95 > 1s)
- Resource usage (memory > 80%, CPU > 80%)
- Database connectivity issues
- Cache miss ratio > 30%
- Quantum validation failures
- License compliance violations
- Deployment issues (insufficient replicas, stuck rollout)

### Distributed Tracing

- **Jaeger**: http://localhost:16686
- Traces quantum computations end-to-end
- Visualize formula derivation chains
- Performance profiling

---

## Troubleshooting

### Service Not Starting

```bash
# Check logs
docker-compose logs qpu

# Or on Kubernetes
kubectl logs -f deployment/qpu-main -n qpu-prod

# Check health endpoint
curl http://localhost:8080/health
```

### High Latency

1. Check database connection pool
2. Check Redis cache hit rate
3. Check CPU/memory usage
4. Review Prometheus metrics

### Database Connection Failures

```bash
# Test PostgreSQL connection
psql postgresql://user:pass@localhost:5432/qpu_db

# Check connection pool settings
# In docker-compose.yml or k8s deployment
```

### License Compliance Issues

```bash
# Run license checker
node scripts/check-license.mjs

# Fix with --fix flag
node scripts/check-license.mjs --fix

# Check pre-commit hook
ls -la .husky/pre-commit
```

---

## Security Best Practices

1. **Run as non-root user** (UID 1001 in Docker)
2. **Use secrets** for sensitive data (API keys, tokens)
3. **Enable HTTPS** in production
4. **Network policies** restrict inter-pod communication
5. **Pod Security Policies** enforce security standards
6. **RBAC** limits service account permissions
7. **Regular security scans** (Trivy, npm audit)
8. **License compliance** enforced by pre-commit hooks

---

## Performance Optimization

- **Multi-stage Docker build** reduces image size
- **ARM64 support** for edge devices (Raspberry Pi)
- **Kubernetes HPA** auto-scales based on CPU/memory
- **Redis cache** for formula results
- **Database connection pooling** via PostgreSQL
- **Prometheus caching** for metrics queries

---

## Cost Optimization

- **Cloudflare Workers** for edge deployments (pay-per-request)
- **Local caching** reduces database queries
- **Pod anti-affinity** spreads load across nodes
- **Resource limits** prevent runaway costs
- **Automatic scaling** ensures efficient utilization

---

## Support & Resources

- **GitHub Issues**: https://github.com/tsvetan/uuidna/issues
- **Discussions**: https://github.com/tsvetan/uuidna/discussions
- **Wiki & Runbooks**: https://github.com/tsvetan/uuidna/wiki
- **Email**: ceccec@psg.bg

---

## License

CC-BY-NC-ND-4.0 - Creative Commons license with attribution, non-commercial, no-derivatives restrictions.

Commercial licensing available - contact author.
