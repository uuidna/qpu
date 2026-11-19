# Standards

The ISO dimensions this tree names, and the check that the simulator meets them. The list and the check are [`standards.ts`](processing/standards.ts). The defining rows the `payload` door holds are `ISO_OPEN_DEFINITIONS` in [`payload.ts`](processing/toolboxes/payload.ts). The detailed specification is [`README.md`](README.md). The witnesses are [`WITNESSES.md`](WITNESSES.md).

`ISO_DIMENSIONS` names the dimensions; every count of them is `ISO_DIMENSIONS.length`. A catalogue row matches a name when its reference is that name, or starts with the name plus `:` or `-`. `ISO 16` does not match `ISO 16000`. A current row has stage at least 6060 and below 9500. Among the rows that match, the one kept is current, then defining, then not a supplement, then the later year, then the higher stage. The defining row of each, with its catalogue number and stage from ISO open data, is `ISO_OPEN_DEFINITIONS` in [`iso-deliverables.ts`](processing/iso-deliverables.ts).

Entropy as a quantity is **ISO 80000-5:2019** (catalogue 64976): \(S = k \ln W\), unit J/K (natural measure uses \(k = 1\), unit nat). It is not a purpose dimension of its own. `audit { entropy }` and crypto integer fusion set \(W\) to the number of distinct microstates (fused leads) and report \(S\); vacuum is \(W = 1\), \(S = 0\). The open-data row is held beside ISO 80000-10 in `ISO_OPEN_DEFINITIONS`.

`validate { classify }` classifies files by the dimensions they cite (`isoClassify`): handed paths it asks for those files, and handed the files it answers each path with its dimensions and names every file that cites none.

`verifyIsoOnline` fetches nothing. With no answer the phase is `requests`, the page is `https://www.iso.org/open-data.html`, the dataset is `iso_deliverables_metadata`, the licence is ODC-By 1.0, and `holds` is false. An HTML answer that links the JSONLines file asks for that file next. A file answer verifies a dimension when a row names it, and defines it when that row has an English title and a scope. `holds` is true when every dimension is verified and defined. Research beside that file asks ISO 690 and ISO 26324 of the DOI ecosystem.

`payload { iso: true }` defines every dimension from those rows. Each is current except ISO 639-1, which is defined and is not current. Nothing is fetched and nothing is written.

`gateQuantumPurity` admits a state of trace 1 and purity 1 under ISO/IEC 4879:2024. A state of trace 1 and purity below 1 is mixed, and is not admitted as pure. The other fourteen dimensions are not a purity question: each of those rows holds, and none of them is admitted.

`verifyIsoQuantumEquivalence` seals one address. It is bijective when the vocabulary holds and every group, guard, and layer holds.

Six groups. `qubit_hilbert_space` checks a qubit, a quantum state, and a Hilbert space. `superposition_interference` checks superposition and coherence. `unitary_gates_circuits` checks a gate, a unitary gate, and a circuit. `entanglement_nonlocality` checks entanglement. `measurement_open_systems` checks measurement, projective measurement, and decoherence. `qec_fault_tolerance` checks a logical qubit, quantum error correction, and fault-tolerant quantum computing.

Four guards. `unitarity_trace_probability_guards` gives every gate a power and an exponential, including `S` and `T`, and refuses a probability outside [0, 1], an asymmetric sum above 1, two operations on one qubit in one moment, an uncoupled device pair, and noise on a state vector. `no_go_theorems_and_simulator_bounds` checks cloning fidelity 5/6, Holevo χ at most 1 bit, Clifford order 24, and a polynomial stabilizer. `kernel_and_standards_closure` holds when every Clay relation holds, the relation count is at least 54, the kernel has at least 1439 theorems, the textbooks have at least 376, and no standard is uncovered. `purity-iso-iec-4879-2024` is the purity gate on the Bell state and on that state after a depolarizing channel.

Four identifier and ledger layers. ISO/IEC 9834-8 is the sealed UUID, nine schemas, and fourteen witnesses. ISO 22739:2024 is the vocabulary and the hash-linked chain. ISO 23257:2022 with ISO/TR 23455:2019 is the reference architecture. ISO 24165, ISO 20022, and ISO 4217 are the token and the double-entry coins in EUR, USD, and BGN.

`validateStandards` covers the 44 rows of `STANDARDS`: 40 reference, 3 codes, and 1 vocabulary. The bound is 6, so the rows sit in 8 slices. An unchanged slice is skipped by its address. The vocabulary of the 86 quantum terms is [`VOCABULARY.md`](VOCABULARY.md).
