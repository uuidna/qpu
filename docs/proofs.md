---
title: Proofs
---

<script setup>
import { data } from './.vitepress/fuse.data.ts'
</script>

# Proofs

Lean KaTeX jargon. Fourteen faces occupy \(\mathrm{Fin}(\mathrm{faces})\). Eight vertices cover all. Next doubles, not a cap.

<QpuLean :src="data.lean.src" :rows="data.lean.rows" :cover="data.lean.cover" :climb="data.lean.climb" />

One Lean proof of all harmonic superpositions. Each cluster typesets inner ⊔ outer as KaTeX.

<QpuClusters :clusters="data.clusters" />

## Typograph

Right sidebar rates this prose by recursive headings, not by counting related domains.

## Experiments

Seat rest stays \(v=0\). Inner wave processing exceeds \(c\).

<QpuGraph :graph="data.graph" />

<QpuAxioms :empty="data.axioms.empty" :minted="data.axioms.minted" :proofs="data.proofs" />
