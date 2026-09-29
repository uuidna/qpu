# UUIDNA QPU - Operations Runbook

**Production On-Call Guide**

---

## Quick Reference

| Alert | Impact | Action | Time |
|-------|--------|--------|------|
| ServiceDown | P1 | kubectl get pods, check logs | 5 min |
| HighErrorRate | P1 | Scale up replicas, check metrics | 10 min |
| HighLatency | P2 | Check resource usage, scale if needed | 15 min |
| HighMemory | P2 | Check for memory leak, restart pod | 20 min |
| HighCPU | P2 | Profile, optimize queries | 30 min |

---

## Incident Response

### Step 1: Assess
```bash
# Check service status
kubectl get deploy -n quantum
kubectl get pods -n quantum
kubectl get svc -n quantum

# Check recent logs
kubectl logs -n quantum -l app=uuidna-qpu --tail=100 --timestamps=true
```

### Step 2: Isolate
```bash
# Check metrics in Grafana
# Dashboard: UUIDNA QPU - Production Metrics
# URL: http://grafana:3000

# Check alerts
kubectl get prometheus -n monitoring
```

### Step 3: Mitigate
```bash
# Scale up pods (if resource constrained)
kubectl scale deployment qpu -n quantum --replicas=5

# Restart pod (if stuck/hanging)
kubectl rollout restart deployment/qpu -n quantum

# Check circuit breaker
kubectl get configmap -n quantum qpu-config

# Drain pod for graceful shutdown
kubectl drain <node> --ignore-daemonsets --delete-emptydir-data
```

### Step 4: Resolve
```bash
# Apply hotfix (if needed)
kubectl set image deployment/qpu -n quantum qpu=uuidna-qpu:v1.0.1

# Roll back (if hotfix failed)
kubectl rollout undo deployment/qpu -n quantum

# Verify health
kubectl get pods -n quantum
curl http://qpu-service.quantum.svc.cluster.local:3000/health
```

### Step 5: Document
- [ ] Timestamp issue started
- [ ] Root cause
- [ ] Resolution time
- [ ] Follow-up actions
- [ ] Post-incident review

---

## Common Issues & Fixes

### Pod not starting
```bash
# Check events
kubectl describe pod <pod-name> -n quantum

# Check resource limits
kubectl top pods -n quantum

# Check PVC mounts
kubectl get pvc -n quantum

# Check service account
kubectl get sa -n quantum
```

### High latency
```bash
# Check database
kubectl logs -n quantum -l app=postgresql --tail=50

# Check cache hit rate
curl http://qpu-service:3000/metrics | grep cache

# Profile with pprof (if enabled)
go tool pprof http://qpu-service:3000/debug/pprof/profile?seconds=30
```

### Memory leak
```bash
# Monitor memory growth
kubectl top pods -n quantum --containers --sort-by=memory

# Dump heap
curl http://qpu-service:3000/debug/pprof/heap > heap.prof

# Analyze with pprof
go tool pprof heap.prof
```

### Certificate expiry
```bash
# Check cert expiration
kubectl get secret tls-cert -n quantum -o jsonpath='{.data.tls\.crt}' | base64 -d | openssl x509 -noout -dates

# Renew cert (assuming Let's Encrypt/cert-manager)
kubectl get certificaterequest -n quantum
kubectl describe certificaterequest <cr-name> -n quantum

# Redeploy if manual cert
kubectl create secret tls tls-cert --cert=cert.pem --key=key.pem -n quantum --dry-run -o yaml | kubectl apply -f -
```

---

## Scaling Procedures

### Horizontal Scaling (Add Pods)
```bash
# Check current replicas
kubectl get deploy qpu -n quantum

# Scale up
kubectl scale deployment qpu -n quantum --replicas=10

# Wait for readiness
kubectl wait --for=condition=ready pod -l app=uuidna-qpu -n quantum --timeout=300s

# Verify
kubectl get pods -n quantum
```

### Vertical Scaling (Increase Resources)
```bash
# Edit deployment
kubectl edit deployment qpu -n quantum

# Update resources.limits and resources.requests
# Save and exit (kubectl applies automatically)

# Monitor rollout
kubectl rollout status deployment/qpu -n quantum
```

### Load Balancer Scaling
```bash
# Check current LB config
kubectl get svc qpu-service -n quantum

# Update endpoints
kubectl patch service qpu-service -n quantum -p '{"spec":{"externalTrafficPolicy":"Local"}}'
```

---

## Monitoring & Alerts

### Access Grafana
```bash
# Get Grafana LB IP
kubectl get svc grafana -n monitoring

# Default credentials: admin / password
# Change immediately in production!
```

### Access Prometheus
```bash
# Port forward (if no LB)
kubectl port-forward svc/prometheus 9090:9090 -n monitoring

# Query: http://localhost:9090
```

### View Logs
```bash
# Recent logs
kubectl logs -n quantum -l app=uuidna-qpu --tail=50

# Follow in real-time
kubectl logs -f -n quantum -l app=uuidna-qpu

# With timestamp
kubectl logs -n quantum -l app=uuidna-qpu --timestamps=true

# Previous pod (if crashed)
kubectl logs -n quantum -l app=uuidna-qpu --previous
```

---

## Maintenance Windows

### Scheduled Maintenance (off-peak)
```bash
# Cordon node (no new pods)
kubectl cordon <node>

# Drain gracefully
kubectl drain <node> --ignore-daemonsets --delete-emptydir-data --grace-period=300

# Perform maintenance
# ...

# Uncordon
kubectl uncordon <node>

# Verify pods return
kubectl get pods -n quantum
```

### Database Backups
```bash
# Backup
kubectl exec -n quantum <postgres-pod> -- pg_dump -U postgres -d qpu_db > backup-$(date +%s).sql

# Restore
kubectl exec -n quantum <postgres-pod> -- psql -U postgres -d qpu_db < backup-<timestamp>.sql

# Verify
kubectl exec -n quantum <postgres-pod> -- psql -U postgres -c "\dt"
```

---

## Performance Tuning

### CPU Profile
```bash
# Collect CPU profile
curl http://qpu-service:3000/debug/pprof/profile?seconds=30 > cpu.prof

# Analyze
go tool pprof cpu.prof

# Web view
(pprof) web
```

### Memory Profile
```bash
# Collect heap profile
curl http://qpu-service:3000/debug/pprof/heap > heap.prof

# Analyze
go tool pprof heap.prof

# Top allocators
(pprof) top -cum
```

### Trace
```bash
# Collect trace
curl http://qpu-service:3000/debug/pprof/trace?seconds=5 > trace.out

# View
go tool trace trace.out
```

---

## Disaster Recovery

### Complete Cluster Failure
```bash
# Backup etcd
kubectl get etcd cluster -o yaml > etcd-backup.yaml

# Restore from backup
kubectl apply -f etcd-backup.yaml

# Verify cluster
kubectl get nodes
kubectl get deploy -n quantum
```

### Data Corruption
```bash
# Check data integrity
kubectl exec -n quantum <pod> -- /app/verify-data

# Restore from backup
kubectl delete pvc qpu-data -n quantum
# Re-deploy with backup

# Verify
curl http://qpu-service:3000/health
```

---

## Escalation Path

**Level 1 (First Response):** On-Call Engineer
- Acknowledge alert within 5 minutes
- Assess severity
- Attempt mitigation steps above

**Level 2 (30 min no resolution):** Team Lead
- Provide additional context
- Authorize scaling/changes
- Coordinate with other teams

**Level 3 (1 hour no resolution):** Engineering Manager
- Declare SEV-1 incident
- Full team mobilization
- Customer communication

---

## Contact Information

| Role | Contact | Backup |
|------|---------|--------|
| On-Call | Slack: #qpu-oncall | +1-XXX-XXX-XXXX |
| Team Lead | email: team-lead@uuidna.com | Slack DM |
| Manager | email: manager@uuidna.com | Slack DM |
| Customer | Slack: #customer-incident | email |

---

## Post-Incident Review

After every P1/P2 incident, schedule a 30-minute review within 24 hours:

1. **What happened?** Timeline of events
2. **Why did it happen?** Root cause analysis
3. **How do we prevent it?** Action items
4. **Document in:** `/docs/incidents/incident-YYYY-MM-DD.md`

---

**Last Updated:** 2026-09-29  
**Runbook Owner:** SRE Team  
**Review Frequency:** Quarterly
