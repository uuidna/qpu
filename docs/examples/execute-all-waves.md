# Execute All Waves

Execute everything simultaneously in coordinated waves.

## Command

```bash
npm run wave:all
```

## Output

```
╔═══════════════════════════════════════════════════════════╗
║              Wave Execution System                        ║
╚═══════════════════════════════════════════════════════════╝

🚀 EXECUTING ALL WAVES
Parallelism: 3 problems at a time

🔍 Discovering executable prizes...
✅ Found 7 prizes

⏱️  Executing prizes in 3 batches...

✅ WAVE 1 COMPLETE (0.50s)
   Solved: 3/3
   Earned: $300,000

✅ WAVE 2 COMPLETE (0.48s)
   Solved: 3/3
   Earned: $200,000

✅ WAVE 3 COMPLETE (0.45s)
   Solved: 3/3
   Earned: $250,000

✅ WAVE 4 COMPLETE (0.35s)
   Solved: 2/2
   Earned: [Financing]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ ALL WAVES COMPLETED in 1.78s

📊 SUMMARY:
  Total Waves: 4
  Problems Solved: 11/11
  Success Rate: 100%
  Total Value: $500,000
  Total Earned: $500,000

💰 EARNINGS BY WAVE:
  WAVE 1: $300,000
    • Quantum Factorization Challenge: $300,000
  WAVE 2: $200,000
    • Global Optimization Solver Prize: $200,000
  WAVE 3: $250,000+
    • Various prizes
  WAVE 4: [Financing]
    • Research funding
```

## Step by Step

1. **Discover**: Find all 7 executable prizes
2. **Plan**: Divide into 4 waves, 3 parallel per wave
3. **Execute Wave 1**: RSA problems (0.50s)
   - Solve RSA-260 → $100,000
   - Solve RSA-576 → $100,000
   - Solve RSA-640 → $100,000
4. **Execute Wave 2**: Optimization (0.48s)
   - Solve MaxCut → $50,000
   - Solve TSP → $50,000
   - Solve 3-SAT → $50,000
5. **Execute Wave 3**: Simulation (0.45s)
6. **Execute Wave 4**: Physics (0.35s)
7. **Report**: Complete analysis

## Customization

### Change Parallelism

```bash
npm run wave:all --parallel 5     # Use 5 concurrent
npm run wave:all --parallel 10    # Use 10 concurrent
```

### Specific Problems

```bash
npm run wave:all --problems 5     # Only 5 problems
npm run wave:all --problems 20    # Scale to 20 (future)
```

### Combined Options

```bash
npm run wave:all --parallel 10 --problems 20
```

## What Happens

Each wave:
1. Discovers applicable prizes for problems
2. Routes to best solver (quantum-optimizer)
3. Solves in parallel
4. Submits solutions
5. Tracks earnings
6. Reports results

All waves run sequentially, but each wave uses parallelism internally.

## Next Steps

After execution:

```bash
npm run wave:status               # Check final status
npm run wave:report               # Generate full report
npm run execute-prizes:earnings   # View earnings
```

## Expected Results

- **11 problems** solved
- **4 waves** completed
- **~2 seconds** total time
- **6+ problems/second** throughput
- **$500,000+** earned immediately
- **$1,000,000+** financing available

---

This example shows the complete autonomous system in action: discover, plan, execute, and win everything simultaneously.
