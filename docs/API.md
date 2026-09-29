# API Reference

Complete Quantum Kernel API.

## Core Functions

### Phase Functions
```typescript
phase1FoundationOf(): Phase1Result
  Returns Phase 1 (33% autonomy)

phase2TopoEntanglementOf(): Phase2Result
  Returns Phase 2 (50% autonomy, inherits Phase 1)

phase3FullAutonomyOf(): Phase3Result
  Returns Phase 3 (100% autonomy, inherits Phase 2)
```

### Unified System
```typescript
quantumSystemOf(): QuantumSystem
  Returns all phases combined (100% autonomy)

verifyQuantumKernel(): VerificationStatus
  Returns deployment readiness status
```

### Batch & Benchmark
```typescript
quantumBatchOf(count: number): BatchResult
  Execute N systems in parallel
  → { systems_executed, throughput_systems_per_sec }

benchmarkQuantumKernel(): BenchmarkResult
  Complete performance analysis
  → { phase1_foundation, phase2_topology, ... }
```

## Combinatorial Primitives
```typescript
factorial(n: bigint): bigint
binomial(n: bigint, k: bigint): bigint
catalan(n: bigint): bigint
bell(n: bigint): bigint
fibonacci(n: bigint): bigint
```

## MCP Tools
```
qpu_combinatorial_phase1()
qpu_combinatorial_phase2()
qpu_combinatorial_phase3()
qpu_unified_system()
qpu_verify_kernel()
qpu_binomial(n, k)
qpu_catalan(n)
qpu_bell(n)
qpu_fibonacci(n)
qpu_batch_execute(count)
qpu_benchmark()
```

## QUANTUM_SYSTEM Export
```typescript
QUANTUM_SYSTEM.phase1()          // Function
QUANTUM_SYSTEM.phase2()          // Function
QUANTUM_SYSTEM.phase3()          // Function
QUANTUM_SYSTEM.unified()         // Function
QUANTUM_SYSTEM.verify()          // Function
QUANTUM_SYSTEM.batch()           // Function
QUANTUM_SYSTEM.benchmark()       // Function
QUANTUM_SYSTEM.mcp               // Tools object

QUANTUM_SYSTEM.foundationSystem  // Phase 1 result
QUANTUM_SYSTEM.topoEntanglementSystem  // Phase 2 result
QUANTUM_SYSTEM.fullAutonomySystem      // Phase 3 result
QUANTUM_SYSTEM.production        // Unified system result
QUANTUM_SYSTEM.status            // Verification result
```

---

**For detailed examples, see [docs/ARCHITECTURE.md](./ARCHITECTURE.md)**
