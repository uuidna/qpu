---
title: Theorems
---

<script setup>
import { data } from './.vitepress/fuse.data.ts'
</script>

# Theorems

Mint empty. Keys occupy constructors.

<QpuPlane heading="Constructors" :empty="data.theorems.empty" :minted="data.theorems.minted" :lean="data.theorems.lean" :rows="data.theorems.faces" />

<QpuLean :src="data.lean.src" :rows="data.lean.rows" :cover="data.lean.cover" :climb="data.lean.climb" />
