# Standards

The ISO dimensions this tree names, and the check that the simulator meets them. The list and the check are [`standards.ts`](processing/standards.ts). The defining rows the `payload` door holds are `ISO_OPEN_DEFINITIONS` in [`payload.ts`](processing/toolboxes/payload.ts). The detailed specification is [`README.md`](README.md). The witnesses are [`WITNESSES.md`](WITNESSES.md).

`ISO_DIMENSIONS` is fifteen names. A catalogue row matches a name when its reference is that name, or starts with the name plus `:` or `-`. `ISO 16` does not match `ISO 16000`. A current row has stage at least 6060 and below 9500. Among the rows that match, the one kept is current, then defining, then not a supplement, then the later year, then the higher stage.

| Dimension | Defining row held here | Stage | Current |
|---|---|---:|---|
| ISO/IEC 4879:2024 | ISO/IEC 4879:2024, catalogue 80432 | 6060 | yes |
| ISO 80000-10 | ISO 80000-10:2019, catalogue 64980 | 9093 | yes |

Entropy as a quantity is **ISO 80000-5:2019** (catalogue 64976): \(S = k \ln W\), unit J/K (natural measure uses \(k = 1\), unit nat). It is not a sixteenth purpose dimension. `audit { entropy }` and crypto integer fusion set \(W\) to the number of distinct microstates (fused leads) and report \(S\); vacuum is \(W = 1\), \(S = 0\). The open-data row is held beside ISO 80000-10 in `ISO_OPEN_DEFINITIONS`.
| ISO/IEC 9834-8 | ISO/IEC 9834-8:2014, catalogue 62795 | 9093 | yes |
| ISO 22739:2024 | ISO 22739:2024, catalogue 82208 | 9092 | yes |
| ISO 23257:2022 | ISO 23257:2022, catalogue 75093 | 9092 | yes |
| ISO/TR 23455:2019 | ISO/TR 23455:2019, catalogue 75624 | 6060 | yes |
| ISO 24165 | ISO 24165-1:2025, catalogue 85546 | 6060 | yes |
| ISO 20022 | ISO 20022-1:2026, catalogue 84854 | 6060 | yes |
| ISO 4217 | ISO 4217:2015, catalogue 64758 | 9060 | yes |
| ISO 8601 | ISO 8601-1:2019, catalogue 70907 | 9092 | yes |
| ISO 639-1 | ISO 639-1:2002, catalogue 22109 | 9599 | no |
| ISO 3166-1 | ISO 3166-1:2020, catalogue 72482 | 9093 | yes |
| ISO/IEC 19770 | ISO/IEC 19770-6:2024, catalogue 77642 | 6060 | yes |
| ISO 16 | ISO 16:1975, catalogue 3601 | 9093 | yes |
| ISO 9001 | ISO 9001:2026, catalogue 88464 | 6060 | yes |

`verifyIsoOnline` fetches nothing. With no answer the phase is `requests`, the page is `https://www.iso.org/open-data.html`, the dataset is `iso_deliverables_metadata`, the licence is ODC-By 1.0, and `holds` is false. An HTML answer that links the JSONLines file asks for that file next. A file answer verifies a dimension when a row names it, and defines it when that row has an English title and a scope. `holds` is true when all fifteen are verified and defined. Research beside that file asks ISO 690 and ISO 26324 of the DOI ecosystem.

`payload { iso: true }` defines the fifteen from the rows above. Fourteen are current. ISO 639-1 is defined and is not current. Nothing is fetched and nothing is written.

`gateQuantumPurity` admits a state of trace 1 and purity 1 under ISO/IEC 4879:2024. A state of trace 1 and purity below 1 is mixed, and is not admitted as pure. The other fourteen dimensions are not a purity question: each of those rows holds, and none of them is admitted.

`verifyIsoQuantumEquivalence` seals one address. It is bijective when the vocabulary holds and every group, guard, and layer holds.

Six groups. `qubit_hilbert_space` checks a qubit, a quantum state, and a Hilbert space. `superposition_interference` checks superposition and coherence. `unitary_gates_circuits` checks a gate, a unitary gate, and a circuit. `entanglement_nonlocality` checks entanglement. `measurement_open_systems` checks measurement, projective measurement, and decoherence. `qec_fault_tolerance` checks a logical qubit, quantum error correction, and fault-tolerant quantum computing.

Four guards. `unitarity_trace_probability_guards` gives every gate a power and an exponential, including `S` and `T`, and refuses a probability outside [0, 1], an asymmetric sum above 1, two operations on one qubit in one moment, an uncoupled device pair, and noise on a state vector. `no_go_theorems_and_simulator_bounds` checks cloning fidelity 5/6, Holevo χ at most 1 bit, Clifford order 24, and a polynomial stabilizer. `kernel_and_standards_closure` holds when every Clay relation holds, the relation count is at least 54, the kernel has at least 1439 theorems, the textbooks have at least 376, and no standard is uncovered. `purity-iso-iec-4879-2024` is the purity gate on the Bell state and on that state after a depolarizing channel.

Four identifier and ledger layers. ISO/IEC 9834-8 is the sealed UUID, nine schemas, and fourteen witnesses. ISO 22739:2024 is the vocabulary and the hash-linked chain. ISO 23257:2022 with ISO/TR 23455:2019 is the reference architecture. ISO 24165, ISO 20022, and ISO 4217 are the token and the double-entry coins in EUR, USD, and BGN.

`validateStandards` covers the 44 rows of `STANDARDS`: 40 reference, 3 codes, and 1 vocabulary. The bound is 6, so the rows sit in 8 slices. An unchanged slice is skipped by its address. The vocabulary of the 86 quantum terms is [`VOCABULARY.md`](VOCABULARY.md).
