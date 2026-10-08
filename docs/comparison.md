---
uuid: "e9c06761-1b05-6907-baad-43d304825d8b"
title: "Comparison"
description: "What @uuidna/qpu does, wing by wing, beside quantum SDKs and simulators (Qiskit Aer, Cirq, Amazon Braket, PennyLane) and general AI models."
og:title: "Comparison — @uuidna/qpu"
og:description: "What @uuidna/qpu does, wing by wing, beside quantum SDKs and simulators (Qiskit Aer, Cirq, Amazon Braket, PennyLane) and general AI models."
og:type: article
og:url: "https://github.com/uuidna/qpu/blob/main/docs/comparison.md"
og:image: "https://opengraph.githubassets.com/qpu/uuidna/qpu"
og:site_name: "@uuidna/qpu"
twitter:card: summary_large_image
twitter:title: "Comparison"
twitter:description: "What @uuidna/qpu does, wing by wing, beside quantum SDKs and simulators (Qiskit Aer, Cirq, Amazon Braket, PennyLane) and general AI models."
version: "1.1.0"
---
# Comparison

Rows are capability classes; a cell says what the system documents, not a benchmark. The qpu column is generated from this repository (receipts and evidence predicates); the others cite the vendor documentation listed below. qpu runs no physical quantum hardware.

| Capability | qpu | Qiskit Aer | Cirq | Amazon Braket | PennyLane | AI models (LLMs) |
|---|---|---|---|---|---|---|
| Exact state vector | integer amplitudes, 3-qubit register (dim vertices); sparse states, Shor on 9 qubits (dim mintOf(9)) | statevector (dense, GPU) | state vector; qsim | SV1, up to 34 qubits | lightning.qubit / .gpu / .kokkos | none |
| Noise / density matrix | XX noise identity only | noise models, density matrix | density matrix | DM1, up to 17 qubits | default.mixed | none |
| Stabilizer / large structured states | graph state of the fused API registry, 2529 qubits, exact entanglement by GF(2) rank | stabilizer, extended stabilizer, MPS | Clifford simulator | TN1, up to 50 qubits | lightning.tensor (MPS) | none |
| Physical hardware | none | IBM Quantum | Google Quantum AI (by access) | IonQ, Rigetti, IQM, QuEra and others | via plugins | none |
| Formal proof | 124 Lean 4 theorems, all served and recomputed (124/124) | none | none | none | none | none |
| Content-addressed results | RFC 9562 v8 UUIDs and chained quantum receipts on every computation | job ids | none | task ARNs | none | none |
| Agent interface | MCP server (/mcp), 16 tools | SDK (Python) | SDK (Python) | SDK and API | SDK (Python) | call tools through MCP or function calling |
| Document database | MongoDB query/update semantics on Cloudflare KV+R2 or D1, Payload adapter | — | — | — | — | — |
| API fusion | 2529 APIs, 438299 composing pairs, 438299 cross formulas | — | — | — | — | — |
| CMS on the edge | 1376256 Next.js + Payload configurations on Workers | — | — | — | — | — |
| License | CC-BY-NC-ND-4.0 (non-commercial, no derivatives) | Apache-2.0 | Apache-2.0 | commercial service | Apache-2.0 | per provider |

## Sources

- [Amazon Braket simulators](https://docs.aws.amazon.com/braket/latest/developerguide/choose-a-simulator.html)
- [Qiskit Aer AerSimulator](https://qiskit.org/ecosystem/aer/stubs/qiskit_aer.AerSimulator.html)
- [Cirq](https://pypi.org/project/cirq/)
- [qsim](https://github.com/quantumlib/qsim)
- [PennyLane Lightning](https://pypi.org/project/PennyLane-Lightning/0.32.0)
- [Model Context Protocol](https://modelcontextprotocol.io/)

Live cross-checks of qpu's own claims against CERN, Zenodo, ORCID and NIST: 2026-10-02: 27 of 30 agree (see [state](state.md)).
