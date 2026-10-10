---
uuid: "ed11e561-c0c5-88d1-b7ff-3fef154b35f3"
title: "Quantum computation"
description: "Exact integer-amplitude state vectors, the running circuit, Shor and the end-to-end proof. 20 capabilities; 11 of 14 evidence predicates hold."
og:title: "Quantum computation — @uuidna/qpu"
og:description: "Exact integer-amplitude state vectors, the running circuit, Shor and the end-to-end proof. 20 capabilities; 11 of 14 evidence predicates hold."
og:type: article
og:url: "https://github.com/uuidna/qpu/blob/main/docs/quantum.md"
og:image: "https://opengraph.githubassets.com/qpu/uuidna/qpu"
og:site_name: "@uuidna/qpu"
twitter:card: summary_large_image
twitter:title: "Quantum computation"
twitter:description: "Exact integer-amplitude state vectors, the running circuit, Shor and the end-to-end proof. 20 capabilities; 11 of 14 evidence predicates hold."
version: "1.1.0"
---
# Quantum computation

Exact integer-amplitude state vectors, the running circuit, Shor and the end-to-end proof.

| | |
|---|---|
| Capabilities | 20 |
| With an evidence predicate | 14 |
| Predicates that hold now | 11 |
| Live (need the network; checked by the live doors) | 3 |

| Capability | Kind | What it does | Evidence | Status |
|---|---|---|---|---|
| [`qpuCircuitLiveOf`](../src/quantum/processing/unit/circuit.ts#L59) | builder | — | — | — |
| [`qpuCircuitOf`](../src/quantum/processing/unit/circuit.ts#L58) | builder | Runtime reads the drift-checked embed so a cold isolate never JIT-compiles qpuCircuitLiveOf; falls back to live. | — | — |
| [`qpuComputerLiveOf`](../src/quantum/processing/unit/index.ts#L1777) | builder | — | — | — |
| [`qpuComputerOf`](../src/quantum/processing/unit/index.ts#L1757) | builder | Runtime reads the drift-checked embed so a cold Worker isolate never JIT-compiles qpuComputerLiveOf (~2.8s shared graph); falls back to live when the embed is absent. | — | — |
| [`qpuDesignOf`](../src/quantum/processing/unit/index.ts#L1499) | builder | Fourteen named design nodes, one per face, each with a synapse fold; vacant must be zero. | `qpuDesignHolds` | holds |
| [`qpuEvidenceOf`](../src/quantum/processing/unit/index.ts#L3831) | builder | Provenance and verification evidence: provider and device (exact-amplitudes), noise, volume, cross-checks, scaling and fault readings. | `qpuEvidenceHolds` | holds |
| [`qpuIdeasOf`](../src/quantum/processing/unit/index.ts#L5821) | builder | The seven ideas the sandbox teams compete on, each as a sealed op tree with its left and right sides. | `qpuIdeasHolds` | holds |
| [`qpuImproveLiveOf`](../src/quantum/processing/unit/index.ts#L9068) | builder | improve with live CERN occupancy. | `qpuImproveLiveHolds` | live (network) |
| [`qpuImproveOf`](../src/quantum/processing/unit/doors.ts#L89) | builder | Improve by doubling: before and after readings of quality, speed, security and throughoutput, with the unlocked quantum door. | `qpuImproveHolds` | holds |
| [`qpuIntegrityOf`](../src/quantum/processing/unit/index.ts#L8144) | builder | Three integrity tests (quantum, cube, around) plus the CERN records the cern theorem quotes. | `qpuIntegrityHolds` | holds |
| [`qpuNeuroOf`](../src/quantum/processing/unit/index.ts#L1548) | builder | A fixed integer network: depth n, width faces, weights from the lattice, one exact forward pass. | `qpuNeuroHolds` | holds |
| [`qpuProveLiveOf`](../src/quantum/processing/unit/index.ts#L9144) | builder | prove after the live sequence. | `qpuProveLiveHolds` | live (network) |
| [`qpuProveOf`](../src/quantum/processing/unit/doors.ts#L481) | builder | Prove the unit end to end: every Lean row, the Shor run, the circuit steps, the source fold and the evidence block; holds is their conjunction. | `qpuProveHolds` | holds |
| [`qpuPurposeOf`](../src/quantum/processing/unit/index.ts#L3694) | builder | What the unit is for, read from its own state: exact-amplitude platform, n qubits, and its cybersecurity, optimisation, science and sensing readings. | `qpuPurposeHolds` | holds |
| [`qpuQuantumLiveOf`](../src/quantum/processing/unit/quantum.ts#L51) | builder | — | — | — |
| [`qpuQuantumOf`](../src/quantum/processing/unit/quantum.ts#L50) | builder | Runtime reads the drift-checked embed so a cold isolate never JIT-compiles qpuQuantumLiveOf; falls back to live. | — | — |
| [`qpuReadingOf`](../src/quantum/processing/unit/index.ts#L3319) | builder | A compact reading of the quantum document (circuit, lattice, Shor, sequence, purpose, evidence) for agents. | `qpuReadingHolds` | holds |
| [`qpuSequenceLiveOf`](../src/quantum/processing/unit/index.ts#L9171) | builder | The live sequence: train, improve, compete and prove, each live. | `qpuSequenceLiveHolds` | live (network) |
| [`qpuSequenceOf`](../src/quantum/processing/unit/index.ts#L3475) | builder | The learning sequence: rungs, API rows and climb over storage, network and server tools. | `qpuSequenceHolds` | holds |
| [`qpuVmOf`](../src/quantum/processing/unit/index.ts#L6508) | builder | The VM reading: isolate rungs and replicas doubling to next, agents per face. | `qpuVmHolds` | holds |

Generated from the inline docs by `npm run docs`. Index: [docs](README.md).
