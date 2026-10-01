# UUIDNA QPU - API Reference

**Version:** 0.2.1  
**License:** CC-BY-NC-ND-4.0

---

## Base URL

```
http://localhost:8080/api        # Local development
https://api.example.com/api      # Production
```

---

## Authentication

Currently no authentication required. Production deployment should implement API key authentication.

---

## Response Format

All endpoints return JSON. Standard response structure:

```json
{
  "data": { /* response data */ },
  "timestamp": "2026-10-01T10:30:00Z",
  "status": 200
}
```

### Error Response

```json
{
  "error": "Error message",
  "status": 400
}
```

---

## Formulas

### List All Formulas

Get all 42+ validated formulas in the corpus.

**Request**

```
GET /api/formulas
```

**Response**

```json
[
  {
    "name": "Fibonacci_7",
    "formula": "fib(7) = 13",
    "value": 13,
    "domain": "combinatorics",
    "humanReadable": "The 7th Fibonacci number",
    "theoremProof": "theorem fib_7 : fib 7 = 13 := by...",
    "publicDatasetTests": [
      {
        "dataset": "ImageNet",
        "result": true,
        "evidence": "Validated on 1M+ images"
      }
    ]
  }
]
```

**Status Codes**

- `200` - Success

---

### Get Formula by Name

Retrieve a specific formula.

**Request**

```
GET /api/formulas/{name}
```

**Parameters**

| Name | Type | Required | Example |
|------|------|----------|---------|
| name | string | Yes | Fibonacci_7 |

**Response**

```json
{
  "name": "Fibonacci_7",
  "formula": "fib(7) = 13",
  "value": 13,
  "domain": "combinatorics",
  "humanReadable": "...",
  "theoremProof": "...",
  "publicDatasetTests": [...]
}
```

**Status Codes**

- `200` - Success
- `404` - Formula not found

---

### Execute Formula

Execute a formula and return cryptographic proof.

**Request**

```
POST /api/formulas/{name}/execute
```

**Parameters**

| Name | Type | Required | Example |
|------|------|----------|---------|
| name | string | Yes | Fibonacci_7 |

**Response**

```json
{
  "name": "Fibonacci_7",
  "value": 13,
  "fold": "a1b2c3d4e5f6...",
  "timestamp": "2026-10-01T10:30:00Z",
  "proof": "theorem fib_7 : fib 7 = 13 := ..."
}
```

**Status Codes**

- `200` - Success

---

## Quantum Operations

### Validate Formula on Quantum Simulator

Test formula on Qiskit quantum simulator.

**Request**

```
POST /api/quantum/validate
Content-Type: application/json

{
  "formulaName": "Superposition_2_7",
  "expectedValue": 128,
  "qubits": 7
}
```

**Parameters**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| formulaName | string | Yes | - | Formula name |
| expectedValue | number | Yes | - | Expected result |
| qubits | integer | No | 7 | Qubit count |

**Response**

```json
{
  "formulaName": "Superposition_2_7",
  "classicalResult": 128,
  "quantumResult": 62.92,
  "matchesClassical": false,
  "qubits": 7,
  "gateCount": 15,
  "depth": 8,
  "executionTime": 45,
  "simulatorUsed": "Qiskit Simulator"
}
```

**Status Codes**

- `200` - Success
- `400` - Missing required parameters

---

### Execute Autonomous Wave

Run autonomous theorem discovery and proof chain.

**Request**

```
POST /api/quantum/wave
Content-Type: application/json

{
  "domain": "math",
  "maxSteps": 20
}
```

**Parameters**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| domain | string | No | math | Domain (math, combinatorics, geometry) |
| maxSteps | integer | No | 20 | Maximum theorem steps |

**Response**

```json
{
  "waveId": "wave_abc123...",
  "domain": "math",
  "theoremsCrossProved": 8,
  "totalDuration": 125,
  "foldChainLength": 42,
  "stepCount": 15,
  "foldChain": [
    "a1b2c3d4e5f6...",
    "f6e5d4c3b2a1...",
    "..."
  ],
  "steps": [
    {
      "index": 0,
      "domain": "math",
      "operation": "fibonacci_derivation",
      "result": "13"
    }
  ]
}
```

**Status Codes**

- `200` - Success

---

### Quantum Convergence Test

Test quantum-classical agreement over multiple iterations.

**Request**

```
POST /api/quantum/convergence
Content-Type: application/json

{
  "formulaName": "Fibonacci_7",
  "expectedValue": 13,
  "iterations": 5
}
```

**Parameters**

| Name | Type | Required | Default |
|------|------|----------|---------|
| formulaName | string | Yes | - |
| expectedValue | number | Yes | - |
| iterations | integer | No | 5 |

**Response**

```json
{
  "formulaName": "Fibonacci_7",
  "iterations": 5,
  "results": [
    {
      "iteration": 1,
      "classicalResult": 13,
      "quantumResult": "62.889",
      "matchesClassical": false
    }
  ],
  "convergenceAchieved": false,
  "foldAgreement": 0,
  "averageDelta": 49.74
}
```

---

## Discovery

### Get Formula Relationships

Discover autonomous relationships between formulas.

**Request**

```
GET /api/quantum/relationships
```

**Response**

```json
{
  "discovered": 12,
  "relationships": [
    {
      "formula1": "Bell_3",
      "formula2": "Catalan_3",
      "commonValue": 5,
      "ratio": 1.0,
      "autonomous": true
    }
  ]
}
```

---

## Statistics

### Get Corpus Statistics

Get overall corpus statistics.

**Request**

```
GET /api/stats/corpus
```

**Response**

```json
{
  "totalFormulas": 42,
  "totalDomains": 8,
  "totalTests": 30,
  "passedTests": 30,
  "passRate": 100,
  "domains": [
    {
      "domain": "combinatorics",
      "formulas": 8
    }
  ]
}
```

---

### Get Domain Statistics

Get statistics for specific domain.

**Request**

```
GET /api/stats/domain/{domain}
```

**Parameters**

| Name | Type | Required | Example |
|------|------|----------|---------|
| domain | string | Yes | combinatorics |

**Response**

```json
{
  "domain": "combinatorics",
  "formulas": 8,
  "totalTests": 10,
  "passedTests": 10,
  "passRate": 100,
  "formulas": [
    {
      "name": "Fibonacci_7",
      "value": 13,
      "formula": "fib(7) = 13"
    }
  ]
}
```

---

## Monitoring

### Get Dashboard Metrics

Get current system metrics.

**Request**

```
GET /api/metrics
```

**Response**

```json
{
  "totalFormulas": 42,
  "validatedDatasets": 30,
  "passRate": 100,
  "avgLatency": 52,
  "quantumQubits": 7,
  "uptime": 99.99
}
```

---

### Health Check

Check if service is healthy.

**Request**

```
GET /api/health
```

**Response**

```json
{
  "status": "ok",
  "timestamp": "2026-10-01T10:30:00Z",
  "uptime": 3600,
  "version": "0.2.1"
}
```

**Status Codes**

- `200` - Healthy

---

### Readiness Check

Check if service is ready to handle requests.

**Request**

```
GET /api/ready
```

**Response**

```json
{
  "ready": true,
  "formulasLoaded": 42
}
```

**Status Codes**

- `200` - Ready
- `503` - Not ready

---

## Rate Limiting

No rate limiting currently implemented. Production deployment should enforce:

- 100 requests per minute per IP
- 1000 requests per minute globally
- 10 concurrent requests per IP

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 400 | Bad Request - Missing or invalid parameters |
| 404 | Not Found - Formula or endpoint not found |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

---

## Examples

### Execute Fibonacci Formula

```bash
curl -X POST http://localhost:8080/api/formulas/Fibonacci_7/execute
```

### Validate on Quantum Hardware

```bash
curl -X POST http://localhost:8080/api/quantum/validate \
  -H "Content-Type: application/json" \
  -d '{
    "formulaName": "Superposition_2_7",
    "expectedValue": 128,
    "qubits": 7
  }'
```

### Get Corpus Statistics

```bash
curl http://localhost:8080/api/stats/corpus
```

### Execute Autonomous Wave

```bash
curl -X POST http://localhost:8080/api/quantum/wave \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "combinatorics",
    "maxSteps": 20
  }'
```

---

## Webhooks (Future)

Future versions will support webhooks for:

- Formula validation completion
- Wave execution results
- Convergence threshold breaches
- System alerts

---

## SDK & Libraries

### JavaScript/TypeScript

```bash
npm install uuidna-qpu-sdk
```

```typescript
import { QPUClient } from 'uuidna-qpu-sdk'

const client = new QPUClient({
  baseURL: 'http://localhost:8080/api'
})

// Get all formulas
const formulas = await client.formulas.list()

// Validate on quantum hardware
const result = await client.quantum.validate({
  formulaName: 'Fibonacci_7',
  expectedValue: 13,
  qubits: 7
})
```

### Python

```bash
pip install uuidna-qpu
```

```python
from uuidna_qpu import QPUClient

client = QPUClient(base_url='http://localhost:8080/api')

# Execute wave
wave = client.quantum.execute_wave(domain='math', max_steps=20)
print(wave.theorems_cross_proved)
```

---

## Support

- **GitHub Issues**: https://github.com/tsvetan/uuidna/issues
- **Email**: ceccec@psg.bg
- **Discussions**: https://github.com/tsvetan/uuidna/discussions

---

**License:** CC-BY-NC-ND-4.0

For commercial licensing or modifications, contact the author.
