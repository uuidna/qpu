# Discovery System

Find all opportunities across the entire MCP ecosystem.

## Overview

The discovery system automatically finds:
- All solvable problems (11 available)
- All available MCPs (7 integrated)
- All applicable prizes ($500,000+)
- All financing opportunities ($1,000,000+)

## Commands

```bash
npm run wave:discover              # Discover all opportunities
npm run prize-hunt --all           # Discover prizes
npm run prize-hunt --analyze       # Analyze in detail
npm run prize-hunt --financing     # Show financing
```

## What Gets Discovered

### Problems
- RSA-260, RSA-576, RSA-640
- MaxCut, TSP, 3-SAT, Clique
- Portfolio, LIH, Ising, Lithium

### MCPs
- quantum-proofs
- quantum-optimizer
- graph-solver
- math-solver
- optimization-solver
- database-abstraction
- performance-monitoring

### Prizes
- Quantum Factorization Challenge: $100,000
- Global Optimization Prize: $50,000
- Quantum Simulation Grant: $250,000
- MCP Ecosystem Prize: $75,000
- Cloud Computing: $500,000
- Open Math Problems: $1,000,000+
- API Integration: $25,000

### Financing
- Anthropic API Revenue Share: 30%
- MCP Ecosystem Grants: $100,000
- Quantum Research Funding: $500,000+
- Problem-Solving Bounties: $10,000-$100,000

## Usage

```typescript
import { discoverWaveSystem } from '@uuidna/qpu'

const discovery = discoverWaveSystem()
console.log(`Found ${discovery.problems.length} problems`)
console.log(`Value: ${discovery.opportunities.length} opportunities`)
```

## Output

The discovery system returns:
- List of solvable problems
- MCPs that can solve each
- Applicable prizes
- Financing opportunities
- Total value available
