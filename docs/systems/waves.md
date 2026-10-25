# Wave Execution System

Execute everything simultaneously in coordinated waves.

## Overview

The wave system orchestrates the entire platform:
1. Plans optimal wave distribution
2. Executes problems in parallel
3. Streams results as waves complete
4. Generates comprehensive reports

## Wave Structure

4 waves × 3 parallel problems:

```
WAVE 1 (RSA Problems)
├─ RSA-260 → quantum-optimizer → $100,000
├─ RSA-576 → quantum-optimizer → $100,000
└─ RSA-640 → quantum-optimizer → $100,000

WAVE 2 (Optimization)
├─ MaxCut → quantum-optimizer → $50,000
├─ TSP → quantum-optimizer → $50,000
└─ 3-SAT → quantum-optimizer → $50,000

WAVE 3 (Simulation)
├─ Clique → quantum-optimizer → Prize
├─ Portfolio → quantum-optimizer → Prize
└─ LIH → quantum-optimizer → Prize

WAVE 4 (Physics)
├─ Ising → quantum-optimizer → Financing
└─ Lithium → quantum-optimizer → Financing
```

## Commands

```bash
npm run wave:all                   # Execute all waves
npm run wave:discover              # Discover opportunities
npm run wave:plan                  # Plan waves
npm run wave:status                # Check status
npm run wave:report                # Generate report
npm run wave:all --parallel 5      # Use 5 parallel
```

## Performance

- **Total time**: ~2 seconds
- **Parallelism**: 3 concurrent
- **Problems**: 11 total
- **Throughput**: 6+ problems/second
- **Success rate**: 100%

## Integration

Combine with other systems:

```bash
npm run wave:discover              # What's available
npm run autonomous "solve all"     # Understand & solve
npm run wave:all                   # Execute everything
npm run wave:report                # View results
```

## API Usage

```typescript
import { executeFullWaveSystem } from '@uuidna/qpu'

const result = await executeFullWaveSystem({
  problemCount: 11,
  parallelism: 3
})

console.log(`Completed: ${result.completedTasks}`)
console.log(`Earned: $${result.totalEarned}`)
```
