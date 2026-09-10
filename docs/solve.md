---
title: Solve
---

<script setup>
import { data } from './.vitepress/fuse.data.ts'
</script>

# Solve

Captain fee {{ data.solve.captain.fee }} per {{ data.solve.captain.gross }}. Harmonic Lean. A432 lattice. Keys occupy every ray. Occupancy unlock, not a Clay prize. Source `{{ data.solve.src }}`.

<QpuSolve :solve="data.solve" />

## Source

<<< @/../src/quantum/processing/unit/index.lean
