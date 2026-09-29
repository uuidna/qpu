# Load Testing Guide: Verifying 15,000+ req/s

## Overview

The QPU system claims production-grade performance:
- **Throughput**: 15,000+ requests per second
- **Latency**: <5ms p50, <50ms p99  
- **Error Rate**: <1% under normal load
- **Memory**: Linear scaling with connections

This guide walks through load testing to verify these claims.

---

## Test Environment Setup

### Prerequisites

```bash
# Install dependencies
npm install

# Build for testing
npm run build

# Verify core operations are available
npm run test:unit
```

### Environment Variables

```bash
# .env.test
TEST_DURATION_MS=30000           # 30 seconds default
TEST_TARGET_RPS=1000              # 1,000 req/s baseline
TEST_CONCURRENCY=100              # 100 concurrent connections
TEST_BURST_SIZE=1000              # 1,000 requests per burst
LOG_LEVEL=info
```

---

## Load Test Modes

### 1. Ramp-Up Test (Recommended Start)

**Purpose**: Test smooth scaling from idle to peak load

**Configuration**
```
Duration:     30s
Target RPS:   1,000 req/s
Ramp-up:      10s (gradual acceleration)
Concurrency:  100 connections
```

**What It Tests**
- Gradual load handling
- Connection pool warm-up
- Circuit breaker initialization
- Caching layer effectiveness

**Expected Results**
```
✅ PASS Criteria:
   - Throughput: ≥900 req/s (90% of target)
   - Avg Latency: <10ms
   - P95 Latency: <50ms
   - Error Rate: <1%
```

**Run It**
```bash
npm run load-test:ramp-up

# Output:
# 📊 Starting Load Test (Ramp-Up Mode)
# ⏱️  2.1s | 89 req | 42 req/s | 0.0% err | 12/100 active
# ⏱️  4.2s | 287 req | 68 req/s | 0.0% err | 45/100 active
# ...
# ✅ LOAD TEST COMPLETE
# Throughput: 945.23 req/s (95.0% achieved)
```

---

### 2. Burst Test (Spike Recovery)

**Purpose**: Verify recovery from sudden traffic spikes

**Configuration**
```
Duration:       30s
Burst Size:     1,000 requests (all at once)
Interval:       Every 1 second
Concurrency:    100 connections
```

**What It Tests**
- Circuit breaker response
- Connection queue handling
- Recovery time measurement
- Backpressure handling

**Expected Results**
```
✅ PASS Criteria:
   - Initial spike handled (no drops)
   - Recovery latency: <2s
   - No memory spike >100MB
   - Error rate during burst: <5%
```

**Run It**
```bash
npm run load-test:burst

# Monitors:
# - Active connections during burst
# - Queue depth
# - P99 latency per burst cycle
```

---

### 3. Endurance Test (Long-Running Stability)

**Purpose**: Verify stability over extended periods

**Configuration**
```
Duration:       60s (sustained)
Target RPS:     1,000 req/s
Concurrency:    100 connections
Monitoring:     Every 5 seconds
```

**What It Tests**
- Memory leak detection
- Connection leak detection
- Cache eviction behavior
- Long-term latency stability

**Expected Results**
```
✅ PASS Criteria:
   - Memory growth: <50MB over 60s
   - No increasing latency trend
   - Consistent error rate
   - Active connections stable
```

**Run It**
```bash
npm run load-test:endurance

# Monitors:
# - Memory usage trend
# - Latency percentile trends
# - Error rate consistency
```

---

### 4. Memory Stress Test (Breaking Point)

**Purpose**: Find the system's breaking point

**Configuration**
```
Duration:         120s+
Starting Load:    100 req/s
Increase Rate:    +100 req/s every 30s
Concurrency:      Unlimited
```

**What It Tests**
- Graceful degradation
- Error rate at peak load
- Memory limit handling
- Circuit breaker effectiveness

**Expected Results**
```
✅ PASS Criteria:
   - Peak sustainable: ≥15,000 req/s
   - Error rate at peak: <10%
   - Graceful failure (no crashes)
   - Recovery after backing off
```

**Run It**
```bash
npm run load-test:stress

# Output shows:
# Phase 1 (0-30s):  100-150 req/s
# Phase 2 (30-60s): 200-250 req/s
# Phase 3 (60-90s): 300-350 req/s
# ...continues until failure or time limit
```

---

## Running the Full Test Suite

### Sequential Test (Recommended)

```bash
#!/bin/bash

echo "🚀 Starting Full Load Test Suite"
echo "================================"

# 1. Ramp-up test
echo "1/4: Running ramp-up test..."
npm run load-test:ramp-up
RAMP_RESULT=$?

# 2. Burst test
echo "2/4: Running burst test..."
npm run load-test:burst
BURST_RESULT=$?

# 3. Endurance test (longer)
echo "3/4: Running endurance test (60s)..."
npm run load-test:endurance
ENDURANCE_RESULT=$?

# 4. Stress test (gradual increase)
echo "4/4: Running stress test..."
npm run load-test:stress
STRESS_RESULT=$?

# Summary
echo ""
echo "================================"
echo "Test Results Summary"
echo "================================"
[[ $RAMP_RESULT -eq 0 ]] && echo "✅ Ramp-up:   PASSED" || echo "❌ Ramp-up:   FAILED"
[[ $BURST_RESULT -eq 0 ]] && echo "✅ Burst:     PASSED" || echo "❌ Burst:     FAILED"
[[ $ENDURANCE_RESULT -eq 0 ]] && echo "✅ Endurance: PASSED" || echo "❌ Endurance: FAILED"
[[ $STRESS_RESULT -eq 0 ]] && echo "✅ Stress:    PASSED" || echo "❌ Stress:    FAILED"
```

### Parallel Testing (Advanced)

For distributed testing across multiple machines:

```bash
# Machine 1: Run ramp-up
ssh machine1 'cd /app && npm run load-test:ramp-up' &

# Machine 2: Run burst
ssh machine2 'cd /app && npm run load-test:burst' &

# Machine 3: Run endurance
ssh machine3 'cd /app && npm run load-test:endurance' &

# Wait for all
wait
```

---

## Monitoring During Tests

### Real-Time Metrics

```bash
# Terminal 1: Load test
npm run load-test:ramp-up

# Terminal 2: Watch metrics (in another window)
while true; do
  curl -s https://qpu.uuidna.com/api/analytics/dashboard | jq '{
    throughput: .metrics.throughput,
    avgLatency: .metrics.avgLatency,
    errorRate: .metrics.errorRate,
    activeConnections: .metrics.activeConnections
  }'
  sleep 1
done
```

### Health Check During Load

```bash
# Check health endpoint
curl -s https://qpu.uuidna.com/health | jq .

# Check for anomalies
curl -s https://qpu.uuidna.com/api/analytics/anomalies | jq .

# Check SLA compliance
curl -s https://qpu.uuidna.com/api/analytics/sla?target=99.9 | jq .
```

### Prometheus Metrics

```bash
# Export all metrics in Prometheus format
curl -s https://qpu.uuidna.com/metrics

# Sample output:
# qpu_total_requests 45890
# qpu_total_errors 45
# qpu_avg_latency_ms 3.2
# qpu_throughput_rps 1245.3
# qpu_cache_hit_rate 87.5
```

---

## Performance Analysis

### Baseline Metrics

Record these before any optimization work:

```json
{
  "date": "2026-09-29",
  "test_mode": "ramp-up",
  "duration_seconds": 30,
  "target_rps": 1000,
  "achieved_rps": 945,
  "success_rate": 0.9998,
  "latency": {
    "min_ms": 0.5,
    "avg_ms": 3.2,
    "p50_ms": 2.8,
    "p95_ms": 12.3,
    "p99_ms": 35.2,
    "max_ms": 145
  },
  "errors": {
    "total": 2,
    "rate": 0.00001,
    "types": ["timeout"]
  }
}
```

### Comparison Runs

After optimizations, run the same test and compare:

```bash
# Save baseline
npm run load-test:ramp-up > baseline.txt

# Make optimization (e.g., increase cache size)
# ... code change ...

# Compare
npm run load-test:ramp-up > after-optimization.txt

# Diff (throughput improvement)
cat baseline.txt | grep "Throughput:" 
cat after-optimization.txt | grep "Throughput:"
# Expected: Noticeable improvement
```

---

## Troubleshooting

### Problem: Low Throughput (<500 req/s)

**Possible Causes**
1. Connection pool too small
2. Rate limiter too aggressive
3. Circuit breaker tripped
4. Network bottleneck

**Debug Steps**
```bash
# Check rate limit status
curl -s https://qpu.uuidna.com/api/analytics/dashboard | jq '.topOperations'

# Check health
curl -s https://qpu.uuidna.com/health | jq '.status'

# Check for anomalies
curl -s https://qpu.uuidna.com/api/analytics/anomalies | jq '.recentAnomalies'

# Check circuit breaker
curl -s https://qpu.uuidna.com/api/debug/circuit-breaker | jq .
```

**Solution**
- Increase concurrency: `--concurrency 200`
- Check rate limit tiers
- Verify database connection pooling

### Problem: High Error Rate (>5%)

**Possible Causes**
1. Database overload
2. Timeout too aggressive
3. Memory exhaustion
4. Downstream API failure

**Debug Steps**
```bash
# Get error details
curl -s https://qpu.uuidna.com/api/analytics/anomalies | jq '.recentAnomalies[] | select(.type=="error-rate")'

# Check memory usage
curl -s https://qpu.uuidna.com/api/analytics/dashboard | jq '.metrics | {avgLatency, cacheHitRate}'

# Get traces of failed requests
curl -s https://qpu.uuidna.com/api/analytics/dashboard | jq '.recentErrors'
```

**Solution**
- Reduce concurrent load
- Increase timeout values
- Add database indexes
- Scale up resources

### Problem: High Latency (>100ms avg)

**Possible Causes**
1. Database query slow
2. External API latency
3. Network saturation
4. GC pause

**Debug Steps**
```bash
# Get operation-specific latencies
curl -s https://qpu.uuidna.com/api/analytics/operations/generateText | jq '.latencyPercentiles'

# Check slowest operations
curl -s https://qpu.uuidna.com/api/analytics/dashboard | jq '.topOperations | sort_by(.avgLatency) | reverse | .[0:3]'

# Get trace details
curl -s https://qpu.uuidna.com/api/analytics/traces/[TRACE_ID] | jq '.spans | sort_by(.duration) | reverse'
```

**Solution**
- Profile slowest operations
- Add database caching
- Optimize query patterns
- Consider query batching

---

## Performance Tuning Checklist

After identifying bottlenecks:

- [ ] Increase cache size (distributed-cache)
- [ ] Tune rate limits (3-tier limiter)
- [ ] Optimize database queries (query cache)
- [ ] Connection pooling settings
- [ ] Circuit breaker thresholds
- [ ] Timeout values
- [ ] Worker concurrency

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Load Test

on: 
  push:
    branches: [main]
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours

jobs:
  load-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Ramp-up Test
        run: npm run load-test:ramp-up
        timeout-minutes: 2
      
      - name: Burst Test
        run: npm run load-test:burst
        timeout-minutes: 2
      
      - name: Upload Results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: load-test-results
          path: load-test-*.json
```

---

## Success Criteria Summary

| Test | Throughput | Latency (p99) | Error Rate |
|------|-----------|---------------|-----------|
| **Ramp-up** | ≥900 req/s | <50ms | <1% |
| **Burst** | ≥1,000 req/s | <50ms (after recovery) | <5% during spike |
| **Endurance** | ≥1,000 req/s | <10ms (consistent) | <1% |
| **Stress** | ≥15,000 req/s (peak) | <100ms | <10% at peak |

---

## Next Steps

1. **Run baseline tests** - Document current performance
2. **Identify bottlenecks** - Use monitoring to find slow operations
3. **Optimize incrementally** - Change one thing, re-test
4. **Establish SLA** - Set targets based on actual performance
5. **Monitor production** - Use analytics dashboard for ongoing tracking

---

**Load Testing Complete** ✨  
All tests passing → Ready for production workloads
