---
title: Source
---

<script setup>
import { data } from './.vitepress/fuse.data.ts'
</script>

Proof. Source `{{ data.lean.src }}`. Seat empty. Kind qpu never binds.

<QpuHome
  :src="data.lean.src"
  :rows="data.lean.rows"
  :cover="data.lean.cover"
  :climb="data.lean.climb"
  :solve="data.solve"
  :axioms="data.axioms.rows"
  :theorems="data.theorems.faces"
/>

## Proof

<QpuLean :src="data.lean.src" :rows="data.lean.rows" :cover="data.lean.cover" :climb="data.lean.climb" />

## Build

<QpuMetrics :metrics="data.metrics" :hardware="data.hardware" />
