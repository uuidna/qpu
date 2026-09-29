# UUIDNA QPU - Service Level Objectives (SLOs)

**Production Performance Targets**

---

## Overview

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| **Availability** | 99.95% | < 99.90% |
| **Latency (P99)** | < 100ms | > 200ms |
| **Throughput** | 40K req/sec | < 30K req/sec |
| **Error Rate** | < 0.1% | > 0.5% |

---

## Availability SLO (99.95%)

**Definition:** Percentage of time the service responds to API requests

```
Availability = Successful Requests / Total Requests
Target: 99.95% uptime = max 21.6 minutes downtime per month
```

### Measurement
```bash
# Track via Prometheus
sum(rate(http_requests_total{status!~"5.."}[5m])) / sum(rate(http_requests_total[5m]))
```

### Incidents
- Unplanned downtime: Counts against SLO
- Planned maintenance (announced 48h prior): Excluded
- Customer error (4xx): Counts as available
- Our error (5xx): Counts as downtime

### Alert Thresholds
- **Critical:** < 99.90% (rolling 30-day)
- **Warning:** < 99.93% (rolling 7-day)

---

## Latency SLO (< 100ms P99)

**Definition:** 99th percentile response time

```
P99 Latency = histogram_quantile(0.99, http_request_duration_seconds)
Target: < 100ms
```

### Breakdown by Endpoint
| Endpoint | P50 | P99 | Target |
|----------|-----|-----|--------|
| /health | 1ms | 5ms | < 10ms |
| /api/execute/cryptography/shor | 10ms | 50ms | < 100ms |
| /api/execute/optimization/knapsack | 5ms | 40ms | < 100ms |
| /api/execute/search/grover | 15ms | 80ms | < 100ms |
| /metrics | 5ms | 20ms | < 50ms |

### Alert Thresholds
- **Critical:** P99 > 200ms (for 5 minutes)
- **Warning:** P99 > 150ms (for 10 minutes)

---

## Throughput SLO (40K req/sec)

**Definition:** Sustained request rate under normal conditions

```
Throughput = rate(http_requests_total[1m])
Target: 40K req/sec sustained
Burst capacity: 100K req/sec
```

### Scaling Rules
- **At 80% capacity (32K req/sec):** Add 1 replica
- **At 50% capacity (20K req/sec):** Remove 1 replica
- **Max replicas:** 100
- **Min replicas:** 3

### Alert Thresholds
- **Critical:** < 20K req/sec (potential outage)
- **Warning:** < 30K req/sec (capacity constrained)

---

## Error Rate SLO (< 0.1%)

**Definition:** Percentage of requests returning 5xx errors

```
Error Rate = sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))
Target: < 0.1% (< 1 in 1000 requests)
```

### By Error Type
| Error | Target | Cause |
|-------|--------|-------|
| 500 Internal Server Error | < 10 per hour | Code bug, memory, timeout |
| 502 Bad Gateway | < 5 per hour | Upstream service down |
| 503 Service Unavailable | < 3 per hour | Overload, maintenance |
| 504 Gateway Timeout | < 10 per hour | Slow backend |

### Alert Thresholds
- **Critical:** > 0.5% error rate
- **Warning:** > 0.2% error rate

---

## Reliability Metrics

### Mean Time To Recovery (MTTR)
- **Target:** < 15 minutes for P1 incident
- **Measurement:** Alert detection → Service healthy

### Mean Time Between Failures (MTBF)
- **Target:** > 720 hours (30 days)
- **Measurement:** Time between unplanned outages

### Change Failure Rate
- **Target:** < 5%
- **Measurement:** Deploys causing P1/P2 incidents / Total deploys

---

## Dependency SLOs

| Dependency | SLO | Alert |
|------------|-----|-------|
| Kubernetes Cluster | 99.9% | Down for > 5 min |
| Prometheus | 99.5% | Scrape fail > 5 min |
| Grafana | 95% | Unavailable > 15 min |
| PostgreSQL DB | 99.95% | Connection fail > 1 min |
| Redis Cache | 99% | Timeout > 10 sec |

---

## Monthly Review

**Metrics collected daily:**
- Uptime percentage
- Error rate
- Latency percentiles (P50, P95, P99)
- Throughput
- MTTR for incidents

**Report format:**
```
Month: January 2026

Availability: 99.97% (↑ 0.02% vs target)
Errors: 0.08% (↓ within SLO)
Latency P99: 87ms (✓ well within target)
Throughput Peak: 52K req/sec

Incidents:
- Jan 15: 5-min latency spike (cache flush)
- Jan 28: Pod memory leak (patched)

Next Month: Implement query caching, upgrade Redis
```

---

## Error Budget

**Monthly error budget: 0.05% (14.4 minutes max downtime)**

Use when:
- Deploying new features (higher risk)
- A/B testing
- Infrastructure experiments

Don't use for:
- Known bugs (fix first)
- Experimental code (test thoroughly)
- Preventable issues

---

## SLO Escalation

```
Month   Availability  Status
------  ------ ------  ------
Jul-26  99.96%        ✓ Green
Aug-26  99.91%        ⚠ Yellow (under threshold)
Sep-26  99.87%        🔴 Red (approaching breach)

Action: Freeze new features, stabilize platform
```

---

## Continuous Improvement

**Quarterly targets:**
- Increase availability from 99.95% → 99.99%
- Reduce P99 latency from 100ms → 50ms
- Increase throughput from 40K → 100K req/sec
- Reduce MTTR from 15min → 5min

**How:**
- Add caching layer (Redis)
- Database query optimization
- Horizontal pod autoscaling
- Multi-region deployment

---

## Public SLO Commitment

> **We commit to 99.95% availability for UUIDNA QPU.**
>
> - Response times < 100ms (99th percentile)
> - Zero unplanned maintenance
> - 24/7 on-call support
> - SLO credits for breaches > 0.05%

---

**Last Updated:** 2026-09-29  
**Next Review:** 2026-12-29  
**Owner:** SRE Team
