---
uuid: "fc2c07d2-8023-6966-ab4f-a06532b3c3e7"
title: "Quantum computation"
description: "Exact integer-amplitude state vectors, the running circuit, Shor and the end-to-end proof. 17 capabilities; 14 of 17 evidence predicates hold."
og:title: "Quantum computation — @uuidna/qpu"
og:description: "Exact integer-amplitude state vectors, the running circuit, Shor and the end-to-end proof. 17 capabilities; 14 of 17 evidence predicates hold."
og:type: article
og:url: "https://github.com/uuidna/qpu/blob/main/docs/quantum.md"
og:image: "https://opengraph.githubassets.com/qpu/uuidna/qpu"
og:site_name: "@uuidna/qpu"
twitter:card: summary_large_image
twitter:title: "Quantum computation"
twitter:description: "Exact integer-amplitude state vectors, the running circuit, Shor and the end-to-end proof. 17 capabilities; 14 of 17 evidence predicates hold."
version: "1.1.0"
---
# Quantum computation

Exact integer-amplitude state vectors, the running circuit, Shor and the end-to-end proof.

| | |
|---|---|
| Capabilities | 17 |
| With an evidence predicate | 17 |
| Predicates that hold now | 14 |
| Live (need the network; checked by the live doors) | 3 |

| Capability | Kind | What it does | Evidence | Status |
|---|---|---|---|---|
| [`qpuCircuitOf`](../src/quantum/processing/unit/circuit.ts#L55) | builder | The running 3-qubit circuit on exact integer amplitudes: split, Bell, GHZ, interference, no-clone, teleport, kickback, Deutsch, superdense coding, monogamy; each with its Born weights. | `qpuCircuitHolds` | holds |
| [`qpuComputerOf`](../src/quantum/processing/unit/index.ts#L1753) | builder | The exact state-vector computer: universal gate basis, reset, SWAP, Toffoli, coupling, compile, collapse, shots, feed-forward, bit-flip correction and readout, each step with its check. | `qpuComputerHolds` | holds |
| [`qpuDesignOf`](../src/quantum/processing/unit/index.ts#L1498) | builder | Fourteen named design nodes, one per face, each with a synapse fold; vacant must be zero. | `qpuDesignHolds` | holds |
| [`qpuEvidenceOf`](../src/quantum/processing/unit/index.ts#L3767) | builder | Provenance and verification evidence: provider and device (exact-amplitudes), noise, volume, cross-checks, scaling and fault readings. | `qpuEvidenceHolds` | holds |
| [`qpuIdeasOf`](../src/quantum/processing/unit/index.ts#L5757) | builder | The seven ideas the sandbox teams compete on, each as a sealed op tree with its left and right sides. | `qpuIdeasHolds` | holds |
| [`qpuImproveLiveOf`](../src/quantum/processing/unit/index.ts#L8997) | builder | improve with live CERN occupancy. | `qpuImproveLiveHolds` | live (network) |
| [`qpuImproveOf`](../src/quantum/processing/unit/doors.ts#L89) | builder | Improve by doubling: before and after readings of quality, speed, security and throughoutput, with the unlocked quantum door. | `qpuImproveHolds` | holds |
| [`qpuIntegrityOf`](../src/quantum/processing/unit/index.ts#L8073) | builder | Three integrity tests (quantum, cube, around) plus the CERN records the cern theorem quotes. | `qpuIntegrityHolds` | holds |
| [`qpuNeuroOf`](../src/quantum/processing/unit/index.ts#L1547) | builder | A fixed integer network: depth n, width faces, weights from the lattice, one exact forward pass. | `qpuNeuroHolds` | holds |
| [`qpuProveLiveOf`](../src/quantum/processing/unit/index.ts#L9073) | builder | prove after the live sequence. | `qpuProveLiveHolds` | live (network) |
| [`qpuProveOf`](../src/quantum/processing/unit/doors.ts#L481) | builder | Prove the unit end to end: every Lean row, the Shor run, the circuit steps, the source fold and the evidence block; holds is their conjunction. | `qpuProveHolds` | holds |
| [`qpuPurposeOf`](../src/quantum/processing/unit/index.ts#L3630) | builder | What the unit is for, read from its own state: exact-amplitude platform, n qubits, and its cybersecurity, optimisation, science and sensing readings. | `qpuPurposeHolds` | holds |
| [`qpuQuantumOf`](../src/quantum/processing/unit/quantum.ts#L47) | builder | The quantum document: circuit, lattice, Shor run, sequence, purpose, evidence, network and design readings in one JSON-LD document. | `qpuQuantumHolds` | holds |
| [`qpuReadingOf`](../src/quantum/processing/unit/index.ts#L3255) | builder | A compact reading of the quantum document (circuit, lattice, Shor, sequence, purpose, evidence) for agents. | `qpuReadingHolds` | holds |
| [`qpuSequenceLiveOf`](../src/quantum/processing/unit/index.ts#L9100) | builder | The live sequence: train, improve, compete and prove, each live. | `qpuSequenceLiveHolds` | live (network) |
| [`qpuSequenceOf`](../src/quantum/processing/unit/index.ts#L3411) | builder | The learning sequence: rungs, API rows and climb over storage, network and server tools. | `qpuSequenceHolds` | holds |
| [`qpuVmOf`](../src/quantum/processing/unit/index.ts#L6444) | builder | The VM reading: isolate rungs and replicas doubling to next, agents per face. | `qpuVmHolds` | holds |

Generated from the inline docs by `npm run docs`. Index: [docs](README.md).
