---
uuid: "cc0eab1a-fb6f-87e5-b9b7-be0ead52b57a"
title: "Formal proof (Lean)"
description: "index.lean served theorem by theorem, recomputed and typeset. 11 capabilities; 3 of 3 evidence predicates hold."
og:title: "Formal proof (Lean) — @uuidna/qpu"
og:description: "index.lean served theorem by theorem, recomputed and typeset. 11 capabilities; 3 of 3 evidence predicates hold."
og:type: article
og:url: "https://github.com/uuidna/qpu/blob/main/docs/proof.md"
og:image: "https://opengraph.githubassets.com/qpu/uuidna/qpu"
og:site_name: "@uuidna/qpu"
twitter:card: summary_large_image
twitter:title: "Formal proof (Lean)"
twitter:description: "index.lean served theorem by theorem, recomputed and typeset. 11 capabilities; 3 of 3 evidence predicates hold."
version: "1.1.0"
---
# Formal proof (Lean)

index.lean served theorem by theorem, recomputed and typeset.

| | |
|---|---|
| Capabilities | 11 |
| With an evidence predicate | 3 |
| Predicates that hold now | 3 |
| Live (need the network; checked by the live doors) | 0 |

| Capability | Kind | What it does | Evidence | Status |
|---|---|---|---|---|
| [`leanArityOf`](../src/quantum/processing/unit/lean-eval.ts#L349) | builder | The arity of a definition: its parameter count (pattern-matched builtins by their transcription). | — | — |
| [`leanModelOf`](../src/quantum/processing/unit/lean-eval.ts#L143) | builder | The defs of the Lean source: `def x : Nat := e` and `def f (p q : Nat) : Nat := e`. | — | — |
| [`leanRecomputeOf`](../src/quantum/processing/unit/lean-eval.ts#L280) | builder | Decide one theorem statement exactly, over the stated range when it binds variables, and typeset it. | — | — |
| [`leanTheoremBlocksOf`](../src/quantum/processing/unit/lean-eval.ts#L322) | builder | Every theorem of the source as [name, text]: the `theorem` line and its continuation lines, whitespace folded. | — | — |
| [`qpuCrossReadingOf`](../src/quantum/processing/unit/index.ts#L2578) | builder | CROSS is the fifth reading: a statement whose two sides ARE the two readings — a sum of like terms equal to a product of unlike ones. `next_fused` (faces * mintOf (bits + coins) = fused + fused) is the asymmetric reading set equal to the symmetric one; reading only its right side called it symmetric, which is half of what it says. | `qpuCrossReadingHolds` | holds |
| [`qpuLeanOf`](../src/quantum/processing/unit/proof.ts#L52) | builder | Every theorem of index.lean as a row: statement verbatim, LaTeX, reading, cross reading, statement UUID and holds recomputed by lean-eval. | `qpuLeanHolds` | holds |
| [`qpuLeanSourceOf`](../src/quantum/processing/unit/index.ts#L2495) | builder | The embedded index.lean: bytes, fold, theorem count, how many served rows are verbatim in it, toolchain pin. | `qpuLeanSourceHolds` | holds |
| [`quantumModeOf`](../src/quantum/processing/unit/index.ts#L8107) | builder | True when the served Lean rows include all_complete, coins_two, around or harmonic, involution, and entangle or monogamy, each holding. | — | — |
| [`leanCallOf`](../src/quantum/processing/unit/lean-eval.ts#L340) | function | Call one definition of the Lean source by name with natural-number arguments, under Lean's Nat semantics. | — | — |
| [`leanLinksOf`](../src/quantum/processing/unit/lean-eval.ts#L358) | function | The formulas discover each other: every declaration's statement and proof are read for the other declarations they name. | — | — |
| [`qpuStatementUuidOf`](../src/quantum/processing/unit/index.ts#L2482) | function | The content UUID of a theorem's statement (its type, binders excluded): the address every served row's handle is cut from. | — | — |

## Lean families

index.lean is the bundle of these modules (scripts/lean-bundle.mjs); `npm run lean` builds the modules with Lake, checks the bundle matches them, and checks the bundle with Lean. Each module with definitions is a hex family: its handle is the fold of its name and each definition is one program nibble.

| Module | Hex handle | Formulas (nibble: name) | Theorems | Uses |
|---|---|---|---|---|
| [Qpu.Mint](../src/quantum/processing/unit/lean/Qpu/Mint.lean) | `c8372ae3` | 1: mintOf, 2: chooseOf | 4 | — |
| [Qpu.Lattice](../src/quantum/processing/unit/lean/Qpu/Lattice.lean) | `72af0c7c` | 1: n, 2: seed, 3: coins, 4: scanner, 5: radar, 6: rays, 7: vertices, 8: hexbit, 9: bits, a: faces, b: amplitudes, c: fused, d: plane | 38 | Mint (50) |
| [Qpu.Annealing](../src/quantum/processing/unit/lean/Qpu/Annealing.lean) | `fb9c24ee` | 1: chimera, 2: pegasus | 1 | Lattice (3) |
| [Qpu.Anyon](../src/quantum/processing/unit/lean/Qpu/Anyon.lean) | `12d947ac` | 1: fibFusion, 2: isingFusion | 1 | Lattice (2), Mint (1) |
| [Qpu.Cern](../src/quantum/processing/unit/lean/Qpu/Cern.lean) | — | — | 1 | — |
| [Qpu.Circuit](../src/quantum/processing/unit/lean/Qpu/Circuit.lean) | — | — | 22 | Mint (17), Lattice (51) |
| [Qpu.Coil](../src/quantum/processing/unit/lean/Qpu/Coil.lean) | `a13a4aae` | 1: theory, 2: practice, 3: coil | 9 | Lattice (39), Mint (5) |
| [Qpu.Hybrid](../src/quantum/processing/unit/lean/Qpu/Hybrid.lean) | `61b7d2d2` | 1: kvCost, 2: r2Cost, 3: hybridCost, 4: kvSpeed, 5: r2Speed, 6: hybridSpeed | 3 | Lattice (21), Mint (2) |
| [Qpu.Physics](../src/quantum/processing/unit/lean/Qpu/Physics.lean) | `cf1194df` | 1: planck, 2: boltzmann, 3: transmon, 4: photon, 5: thermal, 6: bcs, 7: aluminium, 8: niobium, 9: gap | 4 | — |
| [Qpu.Shor](../src/quantum/processing/unit/lean/Qpu/Shor.lean) | `d5716b2a` | 1: powMod, 2: periodOf, 3: gcdOf, 4: half | 2 | — |
| [Qpu.Clay](../src/quantum/processing/unit/lean/Qpu/Clay.lean) | — | — | 8 | Hybrid (2), Mint (7), Lattice (31), Coil (2), Shor (4) |
| [Qpu.Clifford](../src/quantum/processing/unit/lean/Qpu/Clifford.lean) | `df67f06b` | 1: sympProd, 2: symplectic, 3: cliffordOrder | 1 | Mint (3) |
| [Qpu.Cross](../src/quantum/processing/unit/lean/Qpu/Cross.lean) | — | — | 16 | Lattice (73), Mint (8), Coil (2) |
| [Qpu.Fuse](../src/quantum/processing/unit/lean/Qpu/Fuse.lean) | — | — | 1 | — |
| [Qpu.Galois](../src/quantum/processing/unit/lean/Qpu/Galois.lean) | `a571a32a` | 1: glProd, 2: gl2 | 1 | Mint (1) |
| [Qpu.Grover](../src/quantum/processing/unit/lean/Qpu/Grover.lean) | `c2701f5f` | 1: groverIters, 2: groverSize | 1 | Lattice (6), Mint (2) |
| [Qpu.Magic](../src/quantum/processing/unit/lean/Qpu/Magic.lean) | `045a2b38` | 1: magicBlock, 2: magicLogical, 3: magicDistance, 4: magicCubic | 1 | Lattice (6) |
| [Qpu.Pi](../src/quantum/processing/unit/lean/Qpu/Pi.lean) | — | — | 8 | Lattice (26), Mint (2) |
| [Qpu.Primes](../src/quantum/processing/unit/lean/Qpu/Primes.lean) | — | — | 13 | Lattice (36), Mint (6) |
| [Qpu.Qaoa](../src/quantum/processing/unit/lean/Qpu/Qaoa.lean) | `8b42c93c` | 1: qaoaParams, 2: qaoaZz, 3: qaoaX | 1 | Lattice (1) |
| [Qpu.Qft](../src/quantum/processing/unit/lean/Qpu/Qft.lean) | `3442e922` | 1: qftGates, 2: qftSwaps, 3: qftDepth, 4: qftStates | 1 | — |
| [Qpu.Stabilizer](../src/quantum/processing/unit/lean/Qpu/Stabilizer.lean) | `68792683` | 1: stabProd, 2: stabStates, 3: paulis, 4: stabSubgroup | 1 | Mint (4) |
| [Qpu.Surfacecode](../src/quantum/processing/unit/lean/Qpu/Surfacecode.lean) | `d7d3f93e` | 1: surfacePhysical, 2: surfaceCorrectable, 3: surfaceLogical | 1 | Lattice (5) |

154 pairs of definitions are related by at least one theorem. Strongest: mintOf ~ seed (39), coins ~ mintOf (32), coins ~ faces (27), coins ~ rays (27), faces ~ rays (27), mintOf ~ n (26).

## Discovered relations

Every formula evaluated over the lattice constants; values reached by formulas of two or more families, each way as a runnable hex program (`GET /hex/<uuid>`).

| Value | Families | Ways (hex) |
|---|---|---|
| 8 | Qpu.Annealing, Qpu.Anyon, Qpu.Hybrid, Qpu.Lattice, Qpu.Mint, Qpu.Qaoa, Qpu.Qft, Qpu.Shor, Qpu.Stabilizer | vertices() `72af0c7c-7000-2000-8000-000000000000`<br>hybridSpeed() `61b7d2d2-6000-3000-8000-000000000000`<br>mintOf(3) `c8372ae3-1000-1000-9000-000000000003` |
| 16 | Qpu.Anyon, Qpu.Grover, Qpu.Mint, Qpu.Qaoa, Qpu.Qft, Qpu.Shor, Qpu.Stabilizer | mintOf(4) `c8372ae3-1000-2000-9000-000000000004`<br>isingFusion(5) `12d947ac-2000-1000-9000-000000000005`<br>powMod(3, 8, 35) `d5716b2a-1000-5000-b000-000300080023` |
| 32 | Qpu.Annealing, Qpu.Lattice, Qpu.Mint, Qpu.Qaoa, Qpu.Qft, Qpu.Shor, Qpu.Stabilizer | bits() `72af0c7c-9000-7000-8000-000000000000`<br>mintOf(5) `c8372ae3-1000-8000-9000-000000000005`<br>chimera(2) `fb9c24ee-1000-3000-9000-000000000002` |
| 128 | Qpu.Annealing, Qpu.Anyon, Qpu.Mint, Qpu.Qaoa, Qpu.Qft, Qpu.Shor, Qpu.Stabilizer | mintOf(7) `c8372ae3-1000-5000-9000-000000000007`<br>chimera(4) `fb9c24ee-1000-2000-9000-000000000004`<br>isingFusion(8) `12d947ac-2000-3000-9000-000000000008` |
| 15 | Qpu.Galois, Qpu.Magic, Qpu.Qaoa, Qpu.Qft, Qpu.Stabilizer, Qpu.Surfacecode | magicBlock() `045a2b38-1000-8000-8000-000000000000`<br>glProd(4, 1) `a571a32a-1000-5000-a000-000004000001`<br>qaoaZz(3, 5) `8b42c93c-2000-1000-a000-000003000005` |
| 256 | Qpu.Grover, Qpu.Mint, Qpu.Qaoa, Qpu.Qft, Qpu.Shor, Qpu.Stabilizer | mintOf(8) `c8372ae3-1000-6000-9000-000000000008`<br>powMod(2, 8, 352) `d5716b2a-1000-1000-b000-000200080160`<br>powMod(2, 28, 352) `d5716b2a-1000-5000-b000-0002001c0160` |
| 14 | Qpu.Coil, Qpu.Lattice, Qpu.Qaoa, Qpu.Qft, Qpu.Shor | faces() `72af0c7c-a000-7000-8000-000000000000`<br>coil() `a13a4aae-3000-7000-8000-000000000000`<br>powMod(7, 2, 35) `d5716b2a-1000-6000-b000-000700020023` |
| 25 | Qpu.Grover, Qpu.Physics, Qpu.Qaoa, Qpu.Shor, Qpu.Surfacecode | gap(352) `cf1194df-9000-8000-9000-000000000160`<br>powMod(3, 4, 28) `d5716b2a-1000-3000-b000-00030004001c`<br>powMod(3, 14, 32) `d5716b2a-1000-1000-b000-0003000e0020` |
| 28 | Qpu.Lattice, Qpu.Mint, Qpu.Qaoa, Qpu.Qft, Qpu.Shor | plane() `72af0c7c-d000-5000-8000-000000000000`<br>chooseOf(8, 2) `c8372ae3-2000-3000-a000-000008000002`<br>powMod(7, 3, 35) `d5716b2a-1000-6000-b000-000700030023` |
| 64 | Qpu.Anyon, Qpu.Grover, Qpu.Qaoa, Qpu.Shor, Qpu.Stabilizer | isingFusion(7) `12d947ac-2000-3000-9000-000000000007`<br>powMod(8, 2, 352) `d5716b2a-1000-1000-b000-000800020160`<br>powMod(8, 32, 352) `d5716b2a-1000-2000-b000-000800200160` |
| 16384 | Qpu.Anyon, Qpu.Grover, Qpu.Mint, Qpu.Qft, Qpu.Stabilizer | mintOf(14) `c8372ae3-1000-6000-9000-00000000000e`<br>isingFusion(15) `12d947ac-2000-3000-9000-00000000000f`<br>groverSize(7) `c2701f5f-2000-7000-9000-000000000007` |
| 10 | Qpu.Mint, Qpu.Qaoa, Qpu.Qft, Qpu.Shor | chooseOf(5, 3) `c8372ae3-2000-6000-a000-000005000003`<br>chooseOf(5, 2) `c8372ae3-2000-6000-a000-000005000002`<br>powMod(5, 2, 15) `d5716b2a-1000-4000-b000-00050002000f` |
| 13 | Qpu.Anyon, Qpu.Qft, Qpu.Shor, Qpu.Surfacecode | fibFusion(7) `12d947ac-1000-3000-9000-000000000007`<br>powMod(3, 3, 14) `d5716b2a-1000-2000-b000-00030003000e`<br>powMod(3, 15, 14) `d5716b2a-1000-5000-b000-0003000f000e` |
| 21 | Qpu.Anyon, Qpu.Mint, Qpu.Qaoa, Qpu.Shor | chooseOf(7, 2) `c8372ae3-2000-6000-a000-000007000002`<br>chooseOf(7, 5) `c8372ae3-2000-3000-a000-000007000005`<br>fibFusion(8) `12d947ac-1000-4000-9000-000000000008` |
| 268435456 | Qpu.Grover, Qpu.Mint, Qpu.Qft, Qpu.Stabilizer | mintOf(28) `c8372ae3-1000-8000-9000-00000000001c`<br>groverSize(14) `c2701f5f-2000-4000-9000-00000000000e`<br>qftStates(28) `3442e922-4000-4000-9000-00000000001c` |
| 4294967296 | Qpu.Lattice, Qpu.Mint, Qpu.Qft, Qpu.Stabilizer | amplitudes() `72af0c7c-b000-2000-8000-000000000000`<br>mintOf(32) `c8372ae3-1000-6000-9000-000000000020`<br>qftStates(32) `3442e922-4000-6000-9000-000000000020` |
| 9 | Qpu.Qaoa, Qpu.Qft, Qpu.Shor | powMod(3, 2, 32) `d5716b2a-1000-7000-b000-000300020020`<br>powMod(3, 2, 14) `d5716b2a-1000-3000-b000-00030002000e`<br>powMod(3, 2, 28) `d5716b2a-1000-3000-b000-00030002001c` |
| 12 | Qpu.Grover, Qpu.Qaoa, Qpu.Shor | powMod(3, 3, 15) `d5716b2a-1000-6000-b000-00030003000f`<br>powMod(3, 7, 15) `d5716b2a-1000-8000-b000-00030007000f`<br>powMod(3, 15, 15) `d5716b2a-1000-8000-b000-0003000f000f` |
| 17 | Qpu.Qft, Qpu.Shor, Qpu.Surfacecode | powMod(3, 7, 35) `d5716b2a-1000-6000-b000-000300070023`<br>powMod(3, 4, 32) `d5716b2a-1000-2000-b000-000300040020`<br>powMod(3, 28, 32) `d5716b2a-1000-8000-b000-0003001c0020` |
| 24 | Qpu.Clifford, Qpu.Qaoa, Qpu.Shor | powMod(14, 3, 32) `d5716b2a-1000-7000-b000-000e00030020`<br>cliffordOrder(1) `df67f06b-3000-6000-9000-000000000001`<br>qaoaZz(3, 8) `8b42c93c-2000-4000-a000-000003000008` |
| 35 | Qpu.Magic, Qpu.Mint, Qpu.Qaoa | magicCubic() `045a2b38-4000-5000-8000-000000000000`<br>chooseOf(7, 3) `c8372ae3-2000-3000-a000-000007000003`<br>chooseOf(7, 4) `c8372ae3-2000-8000-a000-000007000004` |
| 45 | Qpu.Clifford, Qpu.Qaoa, Qpu.Shor | powMod(5, 15, 352) `d5716b2a-1000-3000-b000-0005000f0160`<br>sympProd(2) `df67f06b-1000-7000-9000-000000000002`<br>qaoaZz(3, 15) `8b42c93c-2000-8000-a000-00000300000f` |
| 105 | Qpu.Mint, Qpu.Qaoa, Qpu.Qft | chooseOf(15, 2) `c8372ae3-2000-8000-a000-00000f000002`<br>qaoaZz(3, 35) `8b42c93c-2000-6000-a000-000003000023`<br>qaoaZz(7, 15) `8b42c93c-2000-2000-a000-00000700000f` |
| 1024 | Qpu.Grover, Qpu.Qaoa, Qpu.Stabilizer | groverSize(5) `c2701f5f-2000-5000-9000-000000000005`<br>qaoaZz(32, 32) `8b42c93c-2000-8000-a000-000020000020`<br>qaoaX(32, 32) `8b42c93c-3000-7000-a000-000020000020` |
| 32768 | Qpu.Mint, Qpu.Qft, Qpu.Stabilizer | mintOf(15) `c8372ae3-1000-3000-9000-00000000000f`<br>qftStates(15) `3442e922-4000-2000-9000-00000000000f`<br>stabSubgroup(15) `68792683-4000-5000-9000-00000000000f` |
| 34359738368 | Qpu.Mint, Qpu.Qft, Qpu.Stabilizer | mintOf(35) `c8372ae3-1000-1000-9000-000000000023`<br>qftStates(35) `3442e922-4000-3000-9000-000000000023`<br>stabSubgroup(35) `68792683-4000-4000-9000-000000000023` |
| 9173994463960286046443283581208347763186259956673124494950355357547691504353939232280074212440502746218496 | Qpu.Mint, Qpu.Qft, Qpu.Stabilizer | mintOf(352) `c8372ae3-1000-4000-9000-000000000160`<br>qftStates(352) `3442e922-4000-4000-9000-000000000160`<br>stabSubgroup(352) `68792683-4000-6000-9000-000000000160` |
| 20 | Qpu.Qaoa, Qpu.Shor | powMod(5, 3, 35) `d5716b2a-1000-5000-b000-000500030023`<br>powMod(5, 15, 35) `d5716b2a-1000-8000-b000-0005000f0023`<br>periodOf(7, 352) `d5716b2a-2000-4000-a000-000007000160` |
| 27 | Qpu.Qft, Qpu.Shor | powMod(3, 3, 32) `d5716b2a-1000-4000-b000-000300030020`<br>powMod(3, 3, 28) `d5716b2a-1000-3000-b000-00030003001c`<br>powMod(3, 3, 352) `d5716b2a-1000-8000-b000-000300030160` |
| 29 | Qpu.Qft, Qpu.Shor | powMod(8, 2, 35) `d5716b2a-1000-8000-b000-000800020023`<br>powMod(8, 14, 35) `d5716b2a-1000-5000-b000-0008000e0023`<br>powMod(4, 3, 35) `d5716b2a-1000-1000-b000-000400030023` |
| 30 | Qpu.Qaoa, Qpu.Shor | powMod(5, 4, 35) `d5716b2a-1000-8000-b000-000500040023`<br>powMod(5, 28, 35) `d5716b2a-1000-2000-b000-0005001c0023`<br>powMod(5, 352, 35) `d5716b2a-1000-8000-b000-000501600023` |
| 40 | Qpu.Qaoa, Qpu.Shor | periodOf(3, 352) `d5716b2a-2000-6000-a000-000003000160`<br>periodOf(5, 352) `d5716b2a-2000-8000-a000-000005000160`<br>periodOf(35, 352) `d5716b2a-2000-5000-a000-000023000160` |
| 42 | Qpu.Galois, Qpu.Qaoa | glProd(3, 2) `a571a32a-1000-5000-a000-000003000002`<br>qaoaZz(3, 14) `8b42c93c-2000-2000-a000-00000300000e`<br>qaoaZz(14, 3) `8b42c93c-2000-2000-a000-00000e000003` |
| 48 | Qpu.Annealing, Qpu.Shor | pegasus(2) `fb9c24ee-2000-3000-9000-000000000002`<br>powMod(14, 4, 352) `d5716b2a-1000-6000-b000-000e00040160` |
| 49 | Qpu.Qaoa, Qpu.Shor | powMod(3, 28, 352) `d5716b2a-1000-5000-b000-0003001c0160`<br>powMod(7, 2, 352) `d5716b2a-1000-1000-b000-000700020160`<br>powMod(35, 4, 352) `d5716b2a-1000-5000-b000-002300040160` |
| 56 | Qpu.Mint, Qpu.Qaoa | chooseOf(8, 3) `c8372ae3-2000-8000-a000-000008000003`<br>chooseOf(8, 5) `c8372ae3-2000-4000-a000-000008000005`<br>qaoaParams(28) `8b42c93c-1000-4000-9000-00000000001c` |
| 60 | Qpu.Qaoa, Qpu.Stabilizer | qaoaZz(4, 15) `8b42c93c-2000-4000-a000-00000400000f`<br>qaoaZz(15, 4) `8b42c93c-2000-4000-a000-00000f000004`<br>qaoaX(4, 15) `8b42c93c-3000-4000-a000-00000400000f` |
| 70 | Qpu.Mint, Qpu.Qaoa | chooseOf(8, 4) `c8372ae3-2000-3000-a000-000008000004`<br>qaoaParams(35) `8b42c93c-1000-8000-9000-000000000023`<br>qaoaZz(2, 35) `8b42c93c-2000-6000-a000-000002000023` |
| 75 | Qpu.Qaoa, Qpu.Shor | powMod(3, 7, 352) `d5716b2a-1000-8000-b000-000300070160`<br>qaoaZz(5, 15) `8b42c93c-2000-5000-a000-00000500000f`<br>qaoaZz(15, 5) `8b42c93c-2000-5000-a000-00000f000005` |
| 96 | Qpu.Qaoa, Qpu.Shor | powMod(28, 7, 352) `d5716b2a-1000-6000-b000-001c00070160`<br>qaoaZz(3, 32) `8b42c93c-2000-4000-a000-000003000020`<br>qaoaZz(32, 3) `8b42c93c-2000-4000-a000-000020000003` |
| 113 | Qpu.Shor, Qpu.Surfacecode | powMod(7, 14, 352) `d5716b2a-1000-4000-b000-0007000e0160`<br>powMod(35, 28, 352) `d5716b2a-1000-1000-b000-0023001c0160`<br>surfacePhysical(8) `d7d3f93e-1000-2000-9000-000000000008` |
| 120 | Qpu.Qaoa, Qpu.Qft | qaoaZz(8, 15) `8b42c93c-2000-8000-a000-00000800000f`<br>qaoaZz(15, 8) `8b42c93c-2000-8000-a000-00000f000008`<br>qaoaX(8, 15) `8b42c93c-3000-6000-a000-00000800000f` |
| 160 | Qpu.Qaoa, Qpu.Shor | powMod(8, 3, 352) `d5716b2a-1000-1000-b000-000800030160`<br>qaoaZz(32, 5) `8b42c93c-2000-6000-a000-000020000005`<br>qaoaZz(5, 32) `8b42c93c-2000-6000-a000-000005000020` |
| 175 | Qpu.Qaoa, Qpu.Surfacecode | qaoaZz(5, 35) `8b42c93c-2000-3000-a000-000005000023`<br>qaoaZz(35, 5) `8b42c93c-2000-3000-a000-000023000005`<br>qaoaX(5, 35) `8b42c93c-3000-1000-a000-000005000023` |
| 196 | Qpu.Qaoa, Qpu.Shor | powMod(14, 2, 352) `d5716b2a-1000-6000-b000-000e00020160`<br>qaoaZz(7, 28) `8b42c93c-2000-4000-a000-00000700001c`<br>qaoaZz(14, 14) `8b42c93c-2000-3000-a000-00000e00000e` |
| 210 | Qpu.Galois, Qpu.Qaoa | glProd(4, 2) `a571a32a-1000-6000-a000-000004000002`<br>qaoaZz(14, 15) `8b42c93c-2000-6000-a000-00000e00000f`<br>qaoaZz(15, 14) `8b42c93c-2000-6000-a000-00000f00000e` |
| 224 | Qpu.Qaoa, Qpu.Shor | powMod(2, 32, 352) `d5716b2a-1000-2000-b000-000200200160`<br>powMod(2, 352, 352) `d5716b2a-1000-2000-b000-000201600160`<br>powMod(8, 4, 352) `d5716b2a-1000-3000-b000-000800040160` |
| 225 | Qpu.Qaoa, Qpu.Shor | powMod(3, 8, 352) `d5716b2a-1000-8000-b000-000300080160`<br>powMod(7, 32, 352) `d5716b2a-1000-3000-b000-000700200160`<br>powMod(7, 352, 352) `d5716b2a-1000-3000-b000-000701600160` |
| 280 | Qpu.Qaoa, Qpu.Shor | powMod(14, 3, 352) `d5716b2a-1000-4000-b000-000e00030160`<br>qaoaZz(8, 35) `8b42c93c-2000-4000-a000-000008000023`<br>qaoaZz(35, 8) `8b42c93c-2000-4000-a000-000023000008` |
| 288 | Qpu.Annealing, Qpu.Shor | pegasus(4) `fb9c24ee-2000-2000-9000-000000000004`<br>powMod(8, 7, 352) `d5716b2a-1000-6000-b000-000800070160` |
| 392 | Qpu.Annealing, Qpu.Qaoa | chimera(7) `fb9c24ee-1000-5000-9000-000000000007`<br>qaoaZz(14, 28) `8b42c93c-2000-3000-a000-00000e00001c`<br>qaoaZz(28, 14) `8b42c93c-2000-3000-a000-00001c00000e` |
| 480 | Qpu.Annealing, Qpu.Qaoa | pegasus(5) `fb9c24ee-2000-5000-9000-000000000005`<br>qaoaZz(32, 15) `8b42c93c-2000-8000-a000-00002000000f`<br>qaoaZz(15, 32) `8b42c93c-2000-8000-a000-00000f000020` |
| 8192 | Qpu.Annealing, Qpu.Anyon | chimera(32) `fb9c24ee-1000-6000-9000-000000000020`<br>isingFusion(14) `12d947ac-2000-7000-9000-00000000000e` |
| 65536 | Qpu.Grover, Qpu.Stabilizer | groverSize(8) `c2701f5f-2000-7000-9000-000000000008`<br>paulis(7) `68792683-3000-3000-9000-000000000007` |
| 1073741824 | Qpu.Grover, Qpu.Stabilizer | groverSize(15) `c2701f5f-2000-8000-9000-00000000000f`<br>paulis(14) `68792683-3000-2000-9000-00000000000e` |

Generated from the inline docs by `npm run docs`. Index: [docs](README.md).
