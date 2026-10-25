# System Architecture

## Quantum Solver Core

**File**: `src/quantum/quantum-solver.ts`  
**Size**: 256 lines  
**Combinations**: 70+ (10 problems × 7 algorithms)

```typescript
interface QuantumProof {
  id: string
  name: string
  algorithm: string
  solution: string
  complexity: { classical: string; quantum: string; speedup: string }
  verification: { proven: boolean; confidence: number; details: string }
  resources: { qubits: number; gates: number; time: string }
  status: 'solved' | 'solving' | 'open'
  icon: string
}

export function getAllProofs(): QuantumProof[]
export function getProofsSummary(): SummaryStats
export function exportProofsJSON(): JsonExport
export function exportProofsMarkdown(): string
```

## Unified Type System

**File**: `src/types.ts`

Central repository for all interface definitions:
- Quantum types (QuantumProof, Algorithm)
- API types (ApiResponse, ApiError)
- Database types (StorageQuery, ReplicationState)
- Security types (AuditLog, SecurityContext)
- Observability types (Metric, TraceSpan)

## Consolidated Constants

**File**: `src/constants.ts`

All application-wide constants:
- Quantum algorithms
- HTTP status codes
- Database modes
- Security levels
- Default timeouts
- Replication strategies

## Integration Patterns

**File**: `src/integration.ts`

Common utilities:
- API response helpers
- Metrics recording
- Distributed tracing
- Retry logic with exponential backoff
- Cache implementation

## Examples & Use Cases

**File**: `src/examples.ts`

Canonical implementations:
- Quantum problem examples
- MCP integration patterns
- Database usage
- API patterns

## CLI Tools

**Path**: `src/cli/`
- `next-command.ts` - Phase automation
- `quantum-solver-cli.ts` - Quantum interface

## Development Phases

```
Phase 0: WAVE 8 Complete ✅
Phase 1: Cleanup ✅
Phase 2: Staging 🔄
Phase 3: Production ⏳
Phase 4: Optimization ⏳
```

## Key Metrics

- Build time: < 2s
- Test execution: < 5s
- Type checking: < 1s
- Code quality: 100% (95/95 tests passing)
- Type safety: 0 errors
