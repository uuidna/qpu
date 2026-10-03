---
title: "Formal proof (Lean)"
description: "index.lean served theorem by theorem, recomputed and typeset. 12 capabilities; 4 of 4 evidence predicates hold."
og:title: "Formal proof (Lean) — @uuidna/qpu"
og:description: "index.lean served theorem by theorem, recomputed and typeset. 12 capabilities; 4 of 4 evidence predicates hold."
og:type: article
og:url: "https://github.com/uuidna/qpu/blob/main/docs/proof.md"
og:image: "https://opengraph.githubassets.com/qpu/uuidna/qpu"
og:site_name: "@uuidna/qpu"
twitter:card: summary_large_image
twitter:title: "Formal proof (Lean)"
twitter:description: "index.lean served theorem by theorem, recomputed and typeset. 12 capabilities; 4 of 4 evidence predicates hold."
version: "1.0.1"
---
# Formal proof (Lean)

index.lean served theorem by theorem, recomputed and typeset.

| | |
|---|---|
| Capabilities | 12 |
| With an evidence predicate | 4 |
| Predicates that hold now | 4 |
| Live (need the network; checked by the live doors) | 0 |

| Capability | Kind | What it does | Evidence | Status |
|---|---|---|---|---|
| [`leanArityOf`](../src/quantum/processing/unit/lean-eval.ts#L327) | builder | The arity of a definition: its parameter count (pattern-matched builtins by their transcription). | — | — |
| [`leanModelOf`](../src/quantum/processing/unit/lean-eval.ts#L121) | builder | The defs of the Lean source: `def x : Nat := e` and `def f (p q : Nat) : Nat := e`. | — | — |
| [`leanRecomputeOf`](../src/quantum/processing/unit/lean-eval.ts#L258) | builder | Decide one theorem statement exactly, over the stated range when it binds variables, and typeset it. | — | — |
| [`leanTheoremBlocksOf`](../src/quantum/processing/unit/lean-eval.ts#L300) | builder | Every theorem of the source as [name, text]: the `theorem` line and its continuation lines, whitespace folded. | — | — |
| [`qpuCrossReadingOf`](../src/quantum/processing/unit/index.ts#L3125) | builder | CROSS is the fifth reading: a statement whose two sides ARE the two readings — a sum of like terms equal to a product of unlike ones. `next_fused` (faces * mintOf (bits + coins) = fused + fused) is the asymmetric reading set equal to the symmetric one; reading only its right side called it symmetric, which is half of what it says. | `qpuCrossReadingHolds` | holds |
| [`qpuHexDiscoverOf`](../src/quantum/processing/unit/index.ts#L12071) | builder | The formulas discover each other: every Lean formula is evaluated over the lattice's own constants (each 0-arity formula's value, bounded so loops stay small), results are grouped by value, and a value reached by formulas of two or more families is a discovered relation. | `qpuHexDiscoverHolds` | holds |
| [`qpuLeanOf`](../src/quantum/processing/unit/proof.ts#L52) | builder | Every theorem of index.lean as a row: statement verbatim, LaTeX, reading, cross reading, statement UUID and holds recomputed by lean-eval. | `qpuLeanHolds` | holds |
| [`qpuLeanSourceOf`](../src/quantum/processing/unit/index.ts#L3042) | builder | The embedded index.lean: bytes, fold, theorem count, how many served rows are verbatim in it, toolchain pin. | `qpuLeanSourceHolds` | holds |
| [`quantumModeOf`](../src/quantum/processing/unit/index.ts#L9026) | builder | True when the served Lean rows include all_complete, coins_two, around or harmonic, involution, and entangle or monogamy, each holding. | — | — |
| [`leanCallOf`](../src/quantum/processing/unit/lean-eval.ts#L318) | function | Call one definition of the Lean source by name with natural-number arguments, under Lean's Nat semantics. | — | — |
| [`leanLinksOf`](../src/quantum/processing/unit/lean-eval.ts#L336) | function | The formulas discover each other: every declaration's statement and proof are read for the other declarations they name. | — | — |
| [`qpuStatementUuidOf`](../src/quantum/processing/unit/index.ts#L3029) | function | The content UUID of a theorem's statement (its type, binders excluded): the address every served row's handle is cut from. | — | — |

## Lean families

index.lean is the bundle of these modules (scripts/lean-bundle.mjs); `npm run lean` builds the modules with Lake, checks the bundle matches them, and checks the bundle with Lean. Each module with definitions is a hex family: its handle is the fold of its name and each definition is one program nibble.

| Module | Hex handle | Formulas (nibble: name) | Theorems | Uses |
|---|---|---|---|---|
| [Qpu.Mint](../src/quantum/processing/unit/lean/Qpu/Mint.lean) | `c8372ae3` | 1: mintOf, 2: chooseOf | 4 | — |
| [Qpu.Shor](../src/quantum/processing/unit/lean/Qpu/Shor.lean) | `d5716b2a` | 1: powMod, 2: periodOf, 3: gcdOf, 4: half | 2 | — |
| [Qpu.Lattice](../src/quantum/processing/unit/lean/Qpu/Lattice.lean) | `72af0c7c` | 1: n, 2: seed, 3: coins, 4: scanner, 5: radar, 6: rays, 7: vertices, 8: hexbit, 9: bits, a: faces, b: amplitudes, c: fused, d: plane | 38 | Mint (50) |
| [Qpu.Circuit](../src/quantum/processing/unit/lean/Qpu/Circuit.lean) | — | — | 22 | Mint (17), Lattice (51) |
| [Qpu.Hybrid](../src/quantum/processing/unit/lean/Qpu/Hybrid.lean) | `61b7d2d2` | 1: kvCost, 2: r2Cost, 3: hybridCost, 4: kvSpeed, 5: r2Speed, 6: hybridSpeed | 3 | Lattice (21), Mint (2) |
| [Qpu.Coil](../src/quantum/processing/unit/lean/Qpu/Coil.lean) | `a13a4aae` | 1: theory, 2: practice, 3: coil | 9 | Lattice (39), Mint (5) |
| [Qpu.Physics](../src/quantum/processing/unit/lean/Qpu/Physics.lean) | `cf1194df` | 1: planck, 2: boltzmann, 3: transmon, 4: photon, 5: thermal, 6: bcs, 7: aluminium, 8: niobium, 9: gap | 4 | — |
| [Qpu.Cern](../src/quantum/processing/unit/lean/Qpu/Cern.lean) | — | — | 1 | — |
| [Qpu.Fuse](../src/quantum/processing/unit/lean/Qpu/Fuse.lean) | — | — | 1 | — |
| [Qpu.Cross](../src/quantum/processing/unit/lean/Qpu/Cross.lean) | — | — | 16 | Lattice (73), Mint (8), Coil (2) |
| [Qpu.Clay](../src/quantum/processing/unit/lean/Qpu/Clay.lean) | — | — | 24 | Lattice (56), Mint (14), Hybrid (2), Coil (2), Shor (4) |

133 pairs of definitions are related by at least one theorem. Strongest: mintOf ~ seed (35), coins ~ mintOf (28), mintOf ~ n (25), bits ~ mintOf (24), coins ~ rays (23), faces ~ rays (23).

## Discovered relations

Every formula evaluated over the lattice constants; values reached by formulas of two or more families, each way as a runnable hex program (`GET /hex/<uuid>`).

| Value | Families | Ways (hex) |
|---|---|---|
| 8 | Qpu.Hybrid, Qpu.Lattice, Qpu.Mint, Qpu.Shor | vertices() `72af0c7c-7000-8000-8000-000000000000`<br>hybridSpeed() `61b7d2d2-6000-8000-8000-000000000000`<br>mintOf(3) `c8372ae3-1000-8000-9000-000000000003` |
| 32 | Qpu.Lattice, Qpu.Mint, Qpu.Shor | bits() `72af0c7c-9000-8000-8000-000000000000`<br>mintOf(5) `c8372ae3-1000-8000-9000-000000000005`<br>powMod(2, 5, 352) `d5716b2a-1000-8000-b000-000200050160` |
| 14 | Qpu.Coil, Qpu.Lattice | faces() `72af0c7c-a000-8000-8000-000000000000`<br>coil() `a13a4aae-3000-8000-8000-000000000000` |
| 16 | Qpu.Mint, Qpu.Shor | mintOf(4) `c8372ae3-1000-8000-9000-000000000004`<br>powMod(2, 7, 28) `d5716b2a-1000-8000-b000-00020007001c`<br>powMod(2, 4, 32) `d5716b2a-1000-8000-b000-000200040020` |
| 21 | Qpu.Mint, Qpu.Shor | chooseOf(7, 2) `c8372ae3-2000-8000-a000-000007000002`<br>chooseOf(7, 5) `c8372ae3-2000-8000-a000-000007000005`<br>powMod(7, 2, 28) `d5716b2a-1000-8000-b000-00070002001c` |
| 25 | Qpu.Physics, Qpu.Shor | powMod(3, 4, 28) `d5716b2a-1000-8000-b000-00030004001c`<br>powMod(3, 14, 32) `d5716b2a-1000-8000-b000-0003000e0020`<br>powMod(3, 28, 28) `d5716b2a-1000-8000-b000-0003001c001c` |
| 28 | Qpu.Lattice, Qpu.Mint | plane() `72af0c7c-d000-8000-8000-000000000000`<br>chooseOf(8, 2) `c8372ae3-2000-8000-a000-000008000002` |
| 128 | Qpu.Mint, Qpu.Shor | mintOf(7) `c8372ae3-1000-8000-9000-000000000007`<br>powMod(2, 7, 352) `d5716b2a-1000-8000-b000-000200070160`<br>powMod(28, 3, 352) `d5716b2a-1000-8000-b000-001c00030160` |
| 256 | Qpu.Mint, Qpu.Shor | mintOf(8) `c8372ae3-1000-8000-9000-000000000008`<br>powMod(2, 8, 352) `d5716b2a-1000-8000-b000-000200080160`<br>powMod(2, 28, 352) `d5716b2a-1000-8000-b000-0002001c0160` |
| 4294967296 | Qpu.Lattice, Qpu.Mint | amplitudes() `72af0c7c-b000-8000-8000-000000000000`<br>mintOf(32) `c8372ae3-1000-8000-9000-000000000020` |

Generated from the inline docs by `npm run docs`. Index: [docs](README.md).
