---
title: Roadmap
order: 15
---

# Roadmap

Google Quantum AI's roadmap, as its published roadmap figure states it: six technical milestones toward a large-scale, error-corrected quantum computer. The code is `src/quantum/roadmap.ts`, served by the `roadmap` tool.

| Milestone | Title | Year | Physical qubits | Status |
| --- | --- | --- | --- | --- |
| M1 | Beyond classical | 2019 | 54 | achieved |
| M2 | Logical qubit prototype | 2023 | 10² | achieved |
| M3 | 1 long-lived logical qubit | 2025+ | 10³ | in progress |
| M4 | Tileable module (logical gate) | | 10⁴ | planned |
| M5 | Engineering scale up | | 10⁵ | planned |
| M6 | Error-corrected quantum computer | | 10⁶ | planned |

The figure's caption says Google is currently working towards Milestone 3, a long-lived logical qubit, capable of living for 1 million computational steps with less than 1 error.

## Applications by qubit scale

Google's roadmap figure predicts which applications each scale of physical qubits, with quantum error correction, would unlock. The same bands are served by the `roadmap` tool.

| Physical qubits | Predicted applications |
| --- | --- |
| 50k–100k | Fundamental physics (quantum gravity, many-body states); certified randomness |
| 100k–500k | Quantum magnets; spectroscopy (NMR, ESR); quantum machine learning with "quantum data"; novel phases of matter |
| 500k–5M | Molecular modeling (drug targets and anti-targets, homogeneous catalysis, solar cell dye molecules); topological data analysis; some differential equations; quantum machine learning of "classical data" |
| 5M–50M | Molecular modeling (materials for qubits, battery cathodes, heterogeneous catalysis, fusion reactor design); factoring |

## Progress, as Google states it

Google has been working on quantum computing since 2014. It announced the first beyond-classical performance in 2019 (Milestone 1), and the first experimental demonstration of scaling quantum error correction in 2023 (Milestone 2). Google plans to tile thousands of surface-encoded logical qubits into a fully fault-tolerant quantum computer.

## What quantum computing is, as Google states it

Quantum computers use quantum physics to access different computational abilities from those of classical computers. A qubit can take the value of a complex combination of 0 and 1, while a classical bit stores either 0 or 1. Quantum algorithms rely on interference to amplify correct answers and cancel incorrect ones, and Google expects quantum computing to tackle certain problems that are difficult or impossible for the largest classical supercomputers.
