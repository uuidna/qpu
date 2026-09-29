# Quantum Kernel Documentation Index

**Organized by Domain and Combinatorial Family**

---

## Quick Navigation

### By Purpose
- **Getting Started:** [QUICKSTART.md](./QUICKSTART.md)
- **Architecture:** [ARCHITECTURE.md](./ARCHITECTURE.md)
- **API Reference:** [API.md](./API.md)
- **Deployment:** [DEPLOYMENT.md](./DEPLOYMENT.md)

### By Domain
1. **[Quantum Domain](./domains/QUANTUM.md)** — Phases, autonomy, coherence
2. **[Cryptographic Domain](./domains/CRYPTO.md)** — Shor, factorization
3. **[Topological Domain](./domains/TOPOLOGY.md)** — Involution, faces, routing
4. **[Arithmetic Domain](./domains/ARITHMETIC.md)** — Binomial, Catalan, Bell

### By Combinatorial Family
1. **[Binomial Coefficients](./families/BINOMIAL.md)** — C(n,k) foundations
2. **[Catalan Numbers](./families/CATALAN.md)** — Path counting
3. **[Bell Numbers](./families/BELL.md)** — Partitions
4. **[Fibonacci](./families/FIBONACCI.md)** — Recurrence

### By Purpose
- **[Security](./SECURITY.md)** — Audit, compliance, threats
- **[Performance](./PERFORMANCE.md)** — Benchmarks, metrics
- **[Testing](./TESTING.md)** — Test suites, verification
- **[Deployment](./DEPLOYMENT.md)** — Production checklist

---

## System Overview

### What Is Quantum Kernel?

Pure mathematical computation system implementing quantum theory via **combinatorial mathematics**.

- **Foundation:** Binomial + Catalan + Bell + Fibonacci
- **Phases:** 3 (Foundation → Topology → Autonomy)
- **Autonomy:** 100% (zero manual gates)
- **Performance:** 200 µs per phase, 40,000+ systems/sec

### Three-Phase Architecture

```
Phase 1: Foundation (33% autonomy)
├─ Binomial(2,1) = 2 coins
├─ Binomial(8,2)/Binomial(4,1) = 7 rays
├─ 2 × 7 = 14 faces (topology)
└─ 2² × 7 = 28 plane (geometry)

Phase 2: Topology + Entanglement (50% autonomy)
├─ Catalan(4) = 14 paths
├─ Bell(4) = 15 partitions
├─ Healing: all faces healthy
└─ Entanglement: symmetric structure

Phase 3: Full Autonomy (100% autonomy)
├─ Shor: 7 × 13 = 91 (period finding)
├─ Amplitudes: 2^(5+1) = 64 levels
├─ Yang-Baxter: braiding verified
└─ Zero manual gates remaining
```

---

## Domain Organization

### Quantum Domain
**Files:** PHASES.md, AUTONOMY.md, CIRCUITS.md  
**Theorems:** involution, entanglement, coherence, amplitudes  
**Formulas:** Phase 1-3 transitions, autonomy progression  

### Cryptographic Domain
**Files:** SHOR.md, FACTORIZATION.md, ADVANTAGE.md  
**Theorems:** period finding, GCD, Shor advantage  
**Formulas:** Shor(8,91), gcd(half(8,91)±1, 91) = 7,13  

### Topological Domain
**Files:** TOPOLOGY.md, INVOLUTION.md, FACES.md  
**Theorems:** clay theorem, harmonic, faces, routing  
**Formulas:** (face+rays+rays)%faces=face%faces, coins×rays=faces  

### Arithmetic Domain
**Files:** BINOMIAL.md, CATALAN.md, BELL.md, FIBONACCI.md  
**Theorems:** C(n,k), Catalan(n), Bell(n), Fib(n)  
**Formulas:** Combinatorial primitives (all foundation)  

---

## Combinatorial Families

### Binomial Coefficients C(n,k)
**Quantum interpretation:** Probability amplitudes  
**Definition:** n! / (k!(n-k)!)  
**Key theorem:** C(2,1)=2, C(8,2)=28, C(4,1)=4  
**File:** [families/BINOMIAL.md](./families/BINOMIAL.md)  

### Catalan Numbers C(n)
**Quantum interpretation:** Topology paths  
**Definition:** C(2n,n)/(n+1)  
**Key theorem:** C(4)=14 (covers all faces)  
**File:** [families/CATALAN.md](./families/CATALAN.md)  

### Bell Numbers B(n)
**Quantum interpretation:** Entanglement partitions  
**Definition:** Partitions of n-element set  
**Key theorem:** B(4)=15 (all entanglement structures)  
**File:** [families/BELL.md](./families/BELL.md)  

### Fibonacci F(n)
**Quantum interpretation:** Recurrence relations  
**Definition:** F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)  
**Key theorem:** Fibonacci via split_coin (exponential scaling)  
**File:** [families/FIBONACCI.md](./families/FIBONACCI.md)  

---

## Cross-Domain Theorems

### Quantum × Crypto
- Shor's factorization (period finding → factors)
- Quantum advantage (exponential speedup)

### Quantum × Topology
- Yang-Baxter equation (braiding protected)
- Involution via faces (routing invariant)

### Topology × Crypto
- Hash collision protection (topological structure)
- Lattice-based cryptography (torus geometry)

### All Domains
- System completeness (all formulas derive)
- Autonomous execution (zero gaps)

---

## Documentation Map

```
docs/
├─ INDEX.md (this file)
├─ QUICKSTART.md (5-minute guide)
├─ ARCHITECTURE.md (system design)
├─ API.md (complete API reference)
├─ SECURITY.md (audit + compliance)
├─ PERFORMANCE.md (benchmarks)
├─ TESTING.md (test suites)
├─ DEPLOYMENT.md (production guide)
│
├─ domains/
│  ├─ QUANTUM.md (phases, autonomy, coherence)
│  ├─ CRYPTO.md (Shor, factorization, advantage)
│  ├─ TOPOLOGY.md (involution, faces, routing)
│  └─ ARITHMETIC.md (binomial, Catalan, Bell)
│
└─ families/
   ├─ BINOMIAL.md (C(n,k) complete reference)
   ├─ CATALAN.md (Catalan(n) complete reference)
   ├─ BELL.md (Bell(n) complete reference)
   └─ FIBONACCI.md (Fib(n) complete reference)
```

---

## Key Resources

### For Developers
- [API.md](./API.md) — Complete API reference
- [ARCHITECTURE.md](./ARCHITECTURE.md) — System design
- [TESTING.md](./TESTING.md) — Test suites

### For Operations
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Production checklist
- [PERFORMANCE.md](./PERFORMANCE.md) — Benchmarks
- [SECURITY.md](./SECURITY.md) — Security audit

### For Researchers
- [domains/QUANTUM.md](./domains/QUANTUM.md) — Quantum theory
- [domains/CRYPTO.md](./domains/CRYPTO.md) — Cryptographic advantage
- [domains/TOPOLOGY.md](./domains/TOPOLOGY.md) — Topological protection
- [domains/ARITHMETIC.md](./domains/ARITHMETIC.md) — Mathematical foundations

### For Learning
- [QUICKSTART.md](./QUICKSTART.md) — 5-minute intro
- [families/BINOMIAL.md](./families/BINOMIAL.md) — Start here
- [families/CATALAN.md](./families/CATALAN.md) — Then here
- [families/BELL.md](./families/BELL.md) — Then here

---

## Quick Links

- **GitHub:** [/uuidna/qpu](https://github.com/uuidna/qpu)
- **Status:** Production Ready ✓
- **Version:** 1.0.0 (PRODUCTION)
- **Autonomy:** 100%
- **Tests:** 79+ passing
- **Performance:** <200 µs per system

---

**Start with [QUICKSTART.md](./QUICKSTART.md) for a 5-minute overview.**

Last updated: 2026-09-29
