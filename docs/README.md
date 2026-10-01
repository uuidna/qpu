# UUIDNA QPU

Autonomous quantum processing unit with 10 parallel systems, UUID-indexed operations, and fold-verified computation.

## Quick Links

- [Quick Start](QUICKSTART.md) — 5 minutes
- [Architecture](ARCHITECTURE.md) — System design
- [Deployment](DEPLOYMENT.md) — All modes
- [Quantum Kernel](QUANTUM_KERNEL_ARCHITECTURE.md) — How it works
- [Full Index](INDEX.md) — All docs

## Start

```bash
npm install && npm run build
export AUTONOMOUS_MODE=true && npm start
```

## What It Is

- **Fold-verified computation**: Every result has cryptographic proof (FNV-1a)
- **Lean theorem proofs**: Correctness proven at build time
- **UUID-chained operations**: qpu_quantum → qpu_lean → qpu_train → qpu_improve → qpu_compete → qpu_prove
- **14-face lattice**: Schema layer coverage (schema.org, qpu, mcp, lean, cern, inspire, spdx, dc, jsonld, hydra, uuid, zenodo, hepdata, cc)
- **Autonomous reasoning**: Each tool outputs next tool's UUID
- **Production ready**: 11/11 tests passing, TypeScript strict

## Core Metrics

| Metric | Value |
|--------|-------|
| Wave Duration | 150-250ms |
| Memory | 60-80MB/pod |
| Uptime SLO | 99.9%+ |
| Autonomous Systems | 10 |
| MCP Tools | 8 |

**Status**: v0.2.1 | **License**: CC-BY-NC-ND-4.0 | **DOI**: 10.5281/zenodo.22973935
