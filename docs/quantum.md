---
uuid: "1497735e-42e0-3f12-8ede-d2f2c31c9f3b"
title: "Quantum computation"
description: "Exact integer-amplitude state vectors, the running circuit, Shor and the end-to-end proof. 14 capabilities; 9 of 14 evidence predicates hold."
og:title: "Quantum computation — @uuidna/qpu"
og:description: "Exact integer-amplitude state vectors, the running circuit, Shor and the end-to-end proof. 14 capabilities; 9 of 14 evidence predicates hold."
og:type: article
og:url: "https://github.com/uuidna/qpu/blob/main/docs/quantum.md"
og:image: "https://opengraph.githubassets.com/qpu/uuidna/qpu"
og:site_name: "@uuidna/qpu"
twitter:card: summary_large_image
twitter:title: "Quantum computation"
twitter:description: "Exact integer-amplitude state vectors, the running circuit, Shor and the end-to-end proof. 14 capabilities; 9 of 14 evidence predicates hold."
version: "1.4.0"
---
# Quantum computation

Exact integer-amplitude state vectors, the running circuit, Shor and the end-to-end proof.

| | |
|---|---|
| Capabilities | 14 |
| With an evidence predicate | 14 |
| Predicates that hold now | 9 |
| Live (need the network; checked by the live doors) | 3 |

| Capability | Kind | What it does | Evidence | Status |
|---|---|---|---|---|
| [`designOf`](../src/quantum/processing/unit/index.ts#L1487) | builder | Fourteen named design nodes, one per face, each with a synapse fold; vacant must be zero. | `designHolds` | holds |
| [`ideasOf`](../src/quantum/processing/unit/index.ts#L5796) | builder | The seven ideas the sandbox teams compete on, each as a sealed op tree with its left and right sides. | `ideasOf` | **false** |
| [`improveLiveOf`](../src/quantum/processing/unit/index.ts#L9087) | builder | improve with live CERN occupancy. | `improveLiveOf` | live (network) |
| [`improveOf`](../src/quantum/processing/unit/doors.ts#L89) | builder | Improve by doubling: before and after readings of quality, speed, security and throughoutput, with the unlocked quantum door. | `improveHolds` | holds |
| [`integrityOf`](../src/quantum/processing/unit/index.ts#L8171) | builder | Three integrity tests (quantum, cube, around) plus the CERN records the cern theorem quotes. | `integrityHolds` | holds |
| [`neuroOf`](../src/quantum/processing/unit/index.ts#L1536) | builder | A fixed integer network: depth n, width faces, weights from the lattice, one exact forward pass. | `neuroHolds` | holds |
| [`proveLiveOf`](../src/quantum/processing/unit/index.ts#L9161) | builder | prove after the live sequence. | `proveLiveOf` | live (network) |
| [`proveOf`](../src/quantum/processing/unit/doors.ts#L481) | builder | Prove the unit end to end: every Lean row, the Shor run, the circuit steps, the source fold and the evidence block; holds is their conjunction. | `proveHolds` | holds |
| [`purposeOf`](../src/quantum/processing/unit/index.ts#L3657) | builder | What the unit is for, read from its own state: exact-amplitude platform, n qubits, and its cybersecurity, optimisation, science and sensing readings. | `purposeHolds` | holds |
| [`qpuEvidenceOf`](../src/quantum/processing/unit/index.ts#L3794) | builder | Provenance and verification evidence: provider and device (exact-amplitudes), noise, volume, cross-checks, scaling and fault readings. | `evidenceHolds` | holds |
| [`qpuReadingOf`](../src/quantum/processing/unit/index.ts#L3293) | builder | A compact reading of the quantum document (circuit, lattice, Shor, sequence, purpose, evidence) for agents. | `qpuReadingOf` | **false** |
| [`qpuSequenceOf`](../src/quantum/processing/unit/index.ts#L3448) | builder | The learning sequence: rungs, API rows and climb over storage, network and server tools. | `sequenceHolds` | holds |
| [`sequenceLiveOf`](../src/quantum/processing/unit/index.ts#L9187) | builder | The live sequence: train, improve, compete and prove, each live. | `sequenceLiveOf` | live (network) |
| [`vmOf`](../src/quantum/processing/unit/index.ts#L6486) | builder | The VM reading: isolate rungs and replicas doubling to next, agents per face. | `vmHolds` | holds |

Generated from the inline docs by `npm run docs`. Index: [docs](README.md).
