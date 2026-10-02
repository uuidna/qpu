---
title: "Formal proof (Lean)"
description: "index.lean served theorem by theorem, recomputed and typeset. 7 capabilities; 3 of 3 evidence predicates hold."
og:title: "Formal proof (Lean) — @uuidna/qpu"
og:description: "index.lean served theorem by theorem, recomputed and typeset. 7 capabilities; 3 of 3 evidence predicates hold."
og:type: article
og:url: "https://github.com/uuidna/qpu/blob/main/docs/proof.md"
og:image: "https://opengraph.githubassets.com/qpu/uuidna/qpu"
og:site_name: "@uuidna/qpu"
twitter:card: summary_large_image
twitter:title: "Formal proof (Lean)"
twitter:description: "index.lean served theorem by theorem, recomputed and typeset. 7 capabilities; 3 of 3 evidence predicates hold."
version: "1.0.0"
---
# Formal proof (Lean)

index.lean served theorem by theorem, recomputed and typeset.

| | |
|---|---|
| Capabilities | 7 |
| With an evidence predicate | 3 |
| Predicates that hold now | 3 |
| Live (need the network; checked by the live doors) | 0 |

| Capability | Kind | What it does | Evidence | Status |
|---|---|---|---|---|
| [`leanModelOf`](../src/quantum/processing/unit/lean-eval.ts#L121) | builder | The defs of the Lean source: `def x : Nat := e` and `def f (p q : Nat) : Nat := e`. | — | — |
| [`leanRecomputeOf`](../src/quantum/processing/unit/lean-eval.ts#L243) | builder | Decide one theorem statement exactly, over the stated range when it binds variables, and typeset it. | — | — |
| [`leanTheoremBlocksOf`](../src/quantum/processing/unit/lean-eval.ts#L285) | builder | Every theorem of the source as [name, text]: the `theorem` line and its continuation lines, whitespace folded. | — | — |
| [`qpuCrossReadingOf`](../src/quantum/processing/unit/index.ts#L4025) | builder | CROSS is the fifth reading: a statement whose two sides ARE the two readings — a sum of like terms equal to a product of unlike ones. `next_fused` (faces * mintOf (bits + coins) = fused + fused) is the asymmetric reading set equal to the symmetric one; reading only its right side called it symmetric, which is half of what it says. | `qpuCrossReadingHolds` | holds |
| [`qpuLeanOf`](../src/quantum/processing/unit/index.ts#L4049) | builder | Every theorem of index.lean as a row: statement verbatim, LaTeX, reading, cross reading, statement UUID and holds recomputed by lean-eval. | `qpuLeanHolds` | holds |
| [`qpuLeanSourceOf`](../src/quantum/processing/unit/index.ts#L3942) | builder | The embedded index.lean: bytes, fold, theorem count, how many served rows are verbatim in it, toolchain pin. | `qpuLeanSourceHolds` | holds |
| [`quantumModeOf`](../src/quantum/processing/unit/index.ts#L11513) | builder | True when the served Lean rows include all_complete, coins_two, around or harmonic, involution, and entangle or monogamy, each holding. | — | — |

Generated from the inline docs by `npm run docs`. Index: [docs](README.md).
