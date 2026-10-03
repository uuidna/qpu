---
title: "Lattice & arithmetic"
description: "The register geometry and the exact integer arithmetic every other wing is built on. 10 capabilities; 7 of 7 evidence predicates hold."
og:title: "Lattice & arithmetic — @uuidna/qpu"
og:description: "The register geometry and the exact integer arithmetic every other wing is built on. 10 capabilities; 7 of 7 evidence predicates hold."
og:type: article
og:url: "https://github.com/uuidna/qpu/blob/main/docs/lattice.md"
og:image: "https://opengraph.githubassets.com/qpu/uuidna/qpu"
og:site_name: "@uuidna/qpu"
twitter:card: summary_large_image
twitter:title: "Lattice & arithmetic"
twitter:description: "The register geometry and the exact integer arithmetic every other wing is built on. 10 capabilities; 7 of 7 evidence predicates hold."
version: "1.0.1"
---
# Lattice & arithmetic

The register geometry and the exact integer arithmetic every other wing is built on.

| | |
|---|---|
| Capabilities | 10 |
| With an evidence predicate | 7 |
| Predicates that hold now | 7 |
| Live (need the network; checked by the live doors) | 0 |

| Capability | Kind | What it does | Evidence | Status |
|---|---|---|---|---|
| [`chooseOf`](../src/quantum/processing/unit/index.ts#L314) | builder | Binomial coefficient C(nn, k) by Pascal recursion, mirroring chooseOf in index.lean. | — | — |
| [`qpuBalanceOf`](../src/quantum/processing/unit/index.ts#L726) | builder | The 'balance' reading: theory and practice equal and summing to coins (theorem follow_the_coins). | `qpuBalanceHolds` | holds |
| [`qpuCapacityOf`](../src/quantum/processing/unit/index.ts#L2706) | builder | Capacity counts: bits, amplitudes, fused = faces x 2^(bits+1), next, the crypt split and the agent and schema counts. | `qpuCapacityHolds` | holds |
| [`qpuCubeOf`](../src/quantum/processing/unit/index.ts#L592) | builder | The register geometry: n qubits, vertices = 2^n, hexbit = 2^(n-1), bits = vertices x hexbit. | `qpuCubeHolds` | holds |
| [`qpuElectronicsOf`](../src/quantum/processing/unit/index.ts#L698) | builder | The 'electronics' reading: the coil (coins x rays) used as staged windings, theory and practice each one seed. | `qpuElectronicsHolds` | holds |
| [`qpuFacesOf`](../src/quantum/processing/unit/index.ts#L638) | builder | The lattice of faces: coins, rays = n + 2 coins, faces = coins x rays = rays + rays, with the coil derived from them. | `qpuFacesHolds` | holds |
| [`qpuHandleOf`](../src/quantum/processing/unit/index.ts#L606) | builder | Amplitude capacity: amplitudes = 2^bits, next = 2 x amplitudes, and the KV reading of both. | `qpuHandleHolds` | holds |
| [`qpuLatticeNamesOf`](../src/quantum/processing/unit/index.ts#L11927) | builder | The lattice by name — n, seed, coins, hexbit, vertices, bits, rays, faces, plane — so a module outside this one writes its numbers as this unit does (never a literal: a count is a lattice name, a power is mintOf, a page is tenOf). | — | — |
| [`qpuSpeedOf`](../src/quantum/processing/unit/index.ts#L2931) | builder | The doubling rung: next = fused + fused, with the cover of rungs and a benchmark of the step. | `qpuSpeedHolds` | holds |
| [`tenOf`](../src/quantum/processing/unit/index.ts#L562) | builder | 10^k by repeated multiplication (no Math.pow), used for page sizes and deadlines. | — | — |

Generated from the inline docs by `npm run docs`. Index: [docs](README.md).
