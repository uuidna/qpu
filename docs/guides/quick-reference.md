# Quick Reference

Common commands and usage patterns.

## Discovery

```bash
npm run wave:discover              # Find all opportunities
npm run prize-hunt --all           # Find all prizes
npm run prize-hunt --analyze       # Analyze opportunities
```

## Solving

```bash
npm run autonomous "PROBLEM"       # Understand & solve
npm run autonomous --all           # Solve everything
npm run autonomous "Solve RSA-260" # Solve specific
```

## Prize Hunting

```bash
npm run prize-hunt "PROBLEM"       # Hunt specific prize
npm run prize-hunt --strategy      # Show strategies
npm run prize-hunt --financing     # Show financing
```

## Prize Execution

```bash
npm run execute-prizes --all       # Execute all
npm run execute-prizes "PROBLEM"   # Execute specific
npm run execute-prizes:status      # Check status
npm run execute-prizes:earnings    # Show earnings
```

## Wave Execution (Everything!)

```bash
npm run wave:all                   # Execute all waves
npm run wave:plan                  # Plan waves
npm run wave:status                # Check status
npm run wave:report                # Generate report
npm run wave:all --parallel 5      # Custom parallelism
npm run wave:all --problems 5      # Subset of problems
```

## Typical Workflows

### Discover & Understand
```bash
npm run wave:discover              # See what's available
npm run autonomous "PROBLEM"       # Understand specific
```

### Find Prizes
```bash
npm run prize-hunt "PROBLEM"       # Find prizes for one
npm run prize-hunt --all           # Find all prizes
npm run prize-hunt --strategy      # See strategies
```

### Win Everything
```bash
npm run wave:all                   # Execute all in waves
npm run wave:report                # See results
```

### Detailed Analysis
```bash
npm run wave:discover              # Discover opportunities
npm run wave:plan                  # Plan execution
npm run wave:all                   # Execute
npm run wave:status                # Check progress
npm run wave:report                # Full report
```

## Example Outputs

### Wave Execution
```
🚀 EXECUTING ALL WAVES
Executing system with 3 parallel tasks...

✅ WAVE 1 COMPLETE (0.50s)
   Solved: 3/3
   Earned: $300,000

✅ WAVE 2 COMPLETE (0.48s)
   Solved: 3/3
   Earned: $200,000

✅ ALL WAVES COMPLETED in 1.78s
Total Waves: 4
Problems Solved: 11/11
Success Rate: 100%
Total Earned: $500,000
```

### Prize Hunting
```
🎯 Prize Hunt: RSA-260
✅ Problem solvable via quantum-optimizer MCP

💰 AVAILABLE PRIZES:
  1. Quantum Factorization Challenge
     Reward: $100,000
     Type: bounty
     Deadline: 2026-12-31

💵 FINANCING OPPORTUNITIES:
  1. Anthropic API Revenue Share
     Amount: Up to 30% revenue share
```

## Configuration

### Parallelism
```bash
npm run wave:all --parallel 1      # Sequential
npm run wave:all --parallel 3      # Default
npm run wave:all --parallel 10     # High parallelism
npm run wave:all --parallel 100    # Maximum
```

### Problem Count
```bash
npm run wave:all --problems 1      # Single problem
npm run wave:all --problems 5      # 5 problems
npm run wave:all --problems 11     # All problems
npm run wave:all --problems 20     # More (future)
```

## Tips & Tricks

- Run `npm run wave:discover` first to understand what's available
- Use `npm run wave:plan` to see the execution plan
- `npm run wave:status` to check progress during execution
- `npm run wave:report` for comprehensive analysis
- Combine `--parallel` and `--problems` for custom execution

## Performance Targets

| Task | Time | Throughput |
|------|------|-----------|
| Single problem | <100ms | - |
| Batch (11 prob) | ~2s | 6+ prob/sec |
| Wave system | ~2s | 11 problems |
| Parallel ×10 | ~1s | 60+ prob/sec |
