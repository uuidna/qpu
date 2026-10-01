# UUIDNA QPU - Usage Guide

**License:** CC-BY-NC-ND-4.0

---

## Quick Start

### 1. Local Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Start development server
npm run dev

# Access dashboard
open http://localhost:8080
```

### 2. With Docker Compose

```bash
# Start full stack (QPU + DB + Redis + Monitoring)
docker-compose up -d

# Access services
# Dashboard: http://localhost:8080
# Prometheus: http://localhost:9000
# Grafana: http://localhost:3000
```

### 3. Production on Kubernetes

```bash
# Deploy to K8s cluster
kubectl apply -f k8s/deployment.yaml

# Get external IP
kubectl get svc qpu-loadbalancer -n qpu-prod

# Access dashboard
open http://<EXTERNAL-IP>:80
```

---

## Using the Dashboard

### Explore Formula Corpus

1. Open http://localhost:8080
2. Browse 42+ formulas in left sidebar
3. Click formula to view:
   - Mathematical expression
   - Plain English explanation
   - Domain (combinatorics, geometry, etc.)
   - Lean 4 proof
   - Dataset validation results

### Validate on Quantum Hardware

1. Select a formula from corpus
2. Click "Validate on Quantum Hardware"
3. View results:
   - Classical vs. Quantum comparison
   - Circuit metrics (qubits, depth)
   - Execution time
   - Superposition/Entanglement verification

### Run Autonomous Wave

1. Click "Execute Wave" in Wave Execution panel
2. Watch real-time discovery:
   - Step-by-step theorem derivation
   - Cryptographic proof chain (folds)
   - Performance metrics
   - Convergence analysis

### View Metrics

Top of dashboard shows:
- **Formulas**: Total corpus size (42)
- **Validated**: Dataset tests passed (30)
- **Pass Rate**: Test success rate (100%)
- **Avg Latency**: Computation time (~50ms)
- **Qubits**: Quantum validation depth (7)
- **Uptime**: System availability (99.99%)

---

## API Usage Examples

### Get Formula Corpus

```bash
curl http://localhost:8080/api/formulas | jq '.'
```

### Execute Single Formula

```bash
curl -X POST http://localhost:8080/api/formulas/Fibonacci_7/execute | jq '.'
```

### Validate on Quantum

```bash
curl -X POST http://localhost:8080/api/quantum/validate \
  -H "Content-Type: application/json" \
  -d '{
    "formulaName": "Superposition_2_7",
    "expectedValue": 128,
    "qubits": 7
  }' | jq '.'
```

### Run Autonomous Wave

```bash
curl -X POST http://localhost:8080/api/quantum/wave \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "combinatorics",
    "maxSteps": 20
  }' | jq '.'
```

### Get Metrics

```bash
curl http://localhost:8080/api/metrics | jq '.'
```

### Check Health

```bash
curl http://localhost:8080/api/health | jq '.status'
```

---

## Integration Examples

### JavaScript/Node.js

```javascript
const fetch = require('node-fetch')

async function getFormulas() {
  const response = await fetch('http://localhost:8080/api/formulas')
  const formulas = await response.json()
  return formulas
}

async function validateFormula(name) {
  const response = await fetch('http://localhost:8080/api/formulas/' + name + '/execute', {
    method: 'POST'
  })
  const result = await response.json()
  return result
}

// Usage
getFormulas().then(formulas => {
  console.log(`Found ${formulas.length} formulas`)
  formulas.slice(0, 5).forEach(f => {
    console.log(`- ${f.name}: ${f.formula}`)
  })
})
```

### Python

```python
import requests

BASE_URL = 'http://localhost:8080/api'

def get_formulas():
    response = requests.get(f'{BASE_URL}/formulas')
    return response.json()

def execute_formula(name):
    response = requests.post(f'{BASE_URL}/formulas/{name}/execute')
    return response.json()

def validate_quantum(name, value, qubits=7):
    response = requests.post(
        f'{BASE_URL}/quantum/validate',
        json={
            'formulaName': name,
            'expectedValue': value,
            'qubits': qubits
        }
    )
    return response.json()

# Usage
formulas = get_formulas()
print(f"Corpus size: {len(formulas)}")

result = validate_quantum('Fibonacci_7', 13)
print(f"Classical: {result['classicalResult']}, Quantum: {result['quantumResult']}")
```

### Go

```go
package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

const BaseURL = "http://localhost:8080/api"

type Formula struct {
	Name   string `json:"name"`
	Value  int    `json:"value"`
	Domain string `json:"domain"`
}

func getFormulas() ([]Formula, error) {
	resp, err := http.Get(BaseURL + "/formulas")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var formulas []Formula
	body, _ := ioutil.ReadAll(resp.Body)
	json.Unmarshal(body, &formulas)
	return formulas, nil
}

func main() {
	formulas, _ := getFormulas()
	fmt.Printf("Loaded %d formulas\n", len(formulas))
	for _, f := range formulas[:5] {
		fmt.Printf("- %s = %d (%s)\n", f.Name, f.Value, f.Domain)
	}
}
```

### cURL Scripting

```bash
#!/bin/bash

BASE_URL="http://localhost:8080/api"

# List all formulas
echo "=== Fetching Formula Corpus ==="
curl -s "$BASE_URL/formulas" | jq '.[] | {name, value, domain}' | head -20

# Get specific formula
echo -e "\n=== Getting Fibonacci_7 ==="
curl -s "$BASE_URL/formulas/Fibonacci_7" | jq '{name, formula, value}'

# Validate on quantum
echo -e "\n=== Quantum Validation ==="
curl -s -X POST "$BASE_URL/quantum/validate" \
  -H "Content-Type: application/json" \
  -d '{
    "formulaName": "Superposition_2_7",
    "expectedValue": 128,
    "qubits": 7
  }' | jq '.[] | {formulaName, classicalResult, quantumResult}'

# Get metrics
echo -e "\n=== System Metrics ==="
curl -s "$BASE_URL/metrics" | jq '.'
```

---

## Monitoring & Observability

### Prometheus Metrics

Access Prometheus at `http://localhost:9000`

Key metrics to monitor:

```promql
# Formula computation rate
rate(formula_computations_total[5m])

# Quantum validation success rate
rate(quantum_validation_failures_total[5m])

# Average computation latency
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Cache hit ratio
rate(redis_cache_hits_total[5m]) / (rate(redis_cache_hits_total[5m]) + rate(redis_cache_misses_total[5m]))
```

### Grafana Dashboards

Access Grafana at `http://localhost:3000` (admin/admin)

Pre-configured dashboards:

1. **QPU Overview** - System metrics at a glance
2. **Formula Performance** - Per-formula execution stats
3. **Quantum Validation** - Hardware validation results
4. **Infrastructure** - CPU, memory, disk usage

### Jaeger Tracing

Access Jaeger at `http://localhost:16686`

Trace autonomous wave execution:

1. Open Jaeger UI
2. Select service: `qpu-main`
3. Operation: `quantum.wave.execute`
4. View full trace of theorem discovery

---

## Advanced Usage

### Custom Domain Discovery

```bash
# Execute wave in specific domain
curl -X POST http://localhost:8080/api/quantum/wave \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "geometry",
    "maxSteps": 30
  }'
```

### Convergence Analysis

```bash
# Test quantum-classical agreement over 10 iterations
curl -X POST http://localhost:8080/api/quantum/convergence \
  -H "Content-Type: application/json" \
  -d '{
    "formulaName": "Bell_3",
    "expectedValue": 5,
    "iterations": 10
  }' | jq '.foldAgreement'
```

### Formula Relationships

```bash
# Discover autonomous relationships
curl http://localhost:8080/api/quantum/relationships | jq '.'
```

### Domain Statistics

```bash
# Get stats for combinatorics domain
curl 'http://localhost:8080/api/stats/domain/combinatorics' | jq '.'
```

---

## Troubleshooting

### Service Won't Start

```bash
# Check logs
docker-compose logs qpu

# Or on Kubernetes
kubectl logs -f deployment/qpu-main -n qpu-prod

# Check health
curl http://localhost:8080/api/health
```

### High Latency

1. Check CPU/Memory usage: `docker stats`
2. Monitor cache hits: Check Prometheus
3. Review database connections: `docker-compose exec postgres psql -U qpu -c "SELECT count(*) FROM pg_stat_activity;"`

### Quantum Validation Fails

- Ensure Qiskit is installed: `pip install qiskit`
- For IBM Quantum: Provide API key in environment
- Check qubit count (default 7 is optimal)

### Dashboard Not Loading

```bash
# Restart UI server
docker-compose restart qpu

# Clear browser cache
# Visit http://localhost:8080 again
```

---

## Performance Optimization

### Database Optimization

```sql
-- Create indices for faster lookups
CREATE INDEX idx_formula_name ON formulas(name);
CREATE INDEX idx_formula_domain ON formulas(domain);
```

### Cache Configuration

```bash
# Increase Redis memory
docker-compose.yml:
  redis:
    command: redis-server --maxmemory 1gb --maxmemory-policy allkeys-lru
```

### Horizontal Scaling

```bash
# Increase QPU replicas
kubectl scale deployment qpu-main --replicas=5 -n qpu-prod
```

---

## Security Best Practices

1. **API Keys**: Implement authentication for production
2. **HTTPS**: Use TLS/SSL certificates
3. **RBAC**: Restrict API access by role
4. **Rate Limiting**: Enforce request limits
5. **Input Validation**: Validate all parameters
6. **Secrets**: Store API keys in secrets manager

---

## Support & Community

- **Discussions**: https://github.com/tsvetan/uuidna/discussions
- **Issues**: https://github.com/tsvetan/uuidna/issues
- **Email**: ceccec@psg.bg
- **Wiki**: https://github.com/tsvetan/uuidna/wiki

---

**License:** CC-BY-NC-ND-4.0

For commercial use or licensing questions, contact the author.
