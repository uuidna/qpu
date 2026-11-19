# Quantum Processing Unit

The detailed specification of the simulator. The public page is the repository [`README.md`](../../README.md).

The Quantum Processing Unit (QPU) performs **quantum information processing** (ISO/IEC 4879:2024, 3.4.1). A **quantum simulator** (3.4.22) is the classical program that simulates quantum circuits (3.4.5) and quantum systems (3.2.6). The Clay register is recomputed in integer arithmetic only. ISO/IEC 4879:2024 names the device a **quantum processor** (3.4.8). Where that model is fully programmable, the standard name is **quantum computer** (3.4.10). The model here is **circuit-based quantum computing** (3.4.13): quantum circuits of quantum gates (3.4.2) on qubits (3.3.3).

Every quantum term from clause 3.1.1 through 3.6.4 is one row of [`quantum-vocabulary.ts`](./processing/quantum-vocabulary.ts): 86 terms. Nine are in 3.1, twenty-one in 3.2, twelve in 3.3, thirty-two in 3.4, eight in 3.5, and four in 3.6. The clause, the name, and the check are listed in [`VOCABULARY.md`](./VOCABULARY.md). `quantumTermNames()` lists the clause and the English name. `quantumVocabulary()` runs each term's check once and addresses the term with one sealed UUID. Device terms name a tangible device. This program is the simulator of that behaviour.

Identifiers and ledger records use ISO/IEC 9834-8, ISO 22739:2024, ISO 23257:2022, ISO/TR 23455:2019, ISO 24165, ISO 20022, and ISO 4217. The further dimensions this tree names are ISO 80000-10, ISO 8601, ISO 639-1, ISO 3166-1, ISO/IEC 19770, ISO 16, and ISO 9001. Quantum purity is gated on ISO/IEC 4879:2024. A state of trace 1 and purity 1 is admitted. A state of trace 1 and purity below 1 is refused as pure.

The Payload website serves this cover through one connector: `qpuMcpPlugin` at `POST /api/mcp` (tool `coverDomains` among others). Nested pages → ecommerce → post → Zenodo. The rest of this processing stays off the website. Rails names the folders and the generators. Payload answers them.

## Abstract

The register is one UUID (ISO/IEC 9834-8). `channel` reads it from the id alone. The handle is the first eight hex digits, and it is the SKU. The program is one hex combination of ten nibbles, the middle with the version nibble and the variant nibble set aside. The tail is three 16-bit params. They are valid when they write back as the tail and the seal holds. The door of an address is `qpu://` plus the handle.

**Hexbit** is the next dimension of qubit. The two **gateway** bits are the UUID variant. Law: **hexbit + 2 gateway bits teleport any hexbit faster than light** (`textbook_hexbit_gateway_ftl`) — the program index arrives in one step; the combination space is not walked. Lean decides the register arithmetic only. Physics is true when the [`physics`](./uuid/programs/physics/index.ts) UUID program proves register FTL; the [`challenge`](./uuid/programs/challenge/index.ts) UUID program adversarially verifies that decision and the law. Navigate, teleport, σ-signal and σ-reflection are [`hexbit`](./uuid/index.ts).

## Quantum capacity

`hexbit` is `mint(coins)` = 4 qubits on one hex digit. A handle of eight digits holds 32 qubits. The possible handles are eight self-similar scales: each scale multiplies the handles by 16 and adds 4 qubits. The last scale is 16⁸ = 4,294,967,296 handles, 32 qubits on each, capacity 137,438,953,472 = 2³⁷. One UUID holds 122 effective qubits: `32 * 4 - 4 - 2 = 122`. These counts are evaluations of [`Qpu.Information.Qubit`](./processing/unit/lean/Qpu/Information/Qubit.lean): `Qubit.effective_formula` states an address's qubits at every hexbit width, `Qubit.couplers_formula` its couplers, `Qubit.chains` and `Qubit.unbounded` that coins chain addresses past any count; the `Register` processor is that grid. The processor's blueprint (register, coupling graph, gate set, algorithms, compilation), generated from its Lean, is [`BLUEPRINT.md`](./BLUEPRINT.md). The version nibble and the two gateway bits are not free. The program combination is 16¹⁰ = 1,099,511,627,776. Capacity is unlimited: the next handle is another UUID. [`uuidQubits`](./uuid/index.ts) computes the register; [`hexbit`](./uuid/index.ts) teleports any program index through it. The count is a sealed coin, booked in double entry, receipted as an ISO quantum record under clause 3.3.3.

| Scale | Handles | Qubits on one handle | Capacity |
|---:|---:|---:|---:|
| 1 | 16 | 4 | 64 |
| 2 | 256 | 8 | 2,048 |
| 3 | 4,096 | 12 | 49,152 |
| 4 | 65,536 | 16 | 1,048,576 |
| 5 | 1,048,576 | 20 | 20,971,520 |
| 6 | 16,777,216 | 24 | 402,653,184 |
| 7 | 268,435,456 | 28 | 7,516,192,768 |
| 8 | 4,294,967,296 | 32 | 137,438,953,472 |

Scientific domains are one product. [`scientificDomains`](./processing/domains.ts) multiplies the field count of every domain on a single domains page, and that product is the cover. Omit the page and the call returns the formula and the one request `https://api.openalex.org/domains?page=1`. A domain id is not a request of its own. `leads { domains }` is that door. The source plan carries the same request once, under `science`. [`domainConfigs`](./processing/domains.ts) puts that same product on the UUID of every Payload config. `payload { improve: { domains } }` and `configure { domains }` are that improvement. The live door is `coverDomains`.

## One coin and the ISO post-quantum floor

A coin is one sealed UUID (ISO/IEC 9834-8). `seal` in [`uuid/index.ts`](./uuid/index.ts) holds when the text is 8-4-4-4-12 hex digits, the variant nibble is in {8, 9, a, b}, and the version nibble equals the nibble the other thirty-one decide. That decision is one modular power. `textbook_uuid_is_36` is \(32 + 4 = 36\). `textbook_uuid_time_space` is \(48 + 4 + 2 + 74 = 128\). The version nibble and the two gateway bits (variant) are reserved, so the free register is \(32 \times 4 - 4 - 2 = 122\). [`uuidQubits`](./uuid/index.ts) computes the register; [`hexbit`](./uuid/index.ts) teleports through it. Fourteen witnesses map back to that address: `textbook_cuboctahedron_faces` is \(8 + 6 = 14\), and the faces are [`WITNESSES.md`](./WITNESSES.md). `mintWitnessCoins` books a coin only for a witness whose seal holds. The ledger names that coin under ISO/IEC 9834-8, ISO 22739:2024, ISO 23257:2022, ISO 20022, and ISO 4217 (`COIN_STANDARDS` in [`coil.ts`](./processing/unit/coil.ts)).

The published ISO post-quantum mechanism documents read for this proof are these:

| Document | What it specifies | Where that statement was read |
|---|---|---|
| ISO/IEC 14888-4:2024 | Stateful hash-based signatures | [JRC144095](https://publications.jrc.ec.europa.eu/repository/bitstream/JRC144095/JRC144095_01.pdf) |
| ISO/IEC 18033-2 Amendment 2, 5 June 2026 | Classic McEliece, FrodoKEM, and ML-KEM | [Lange, AsiaPQC 2026](https://hyperelliptic-backup.cr.yp.to/tanja/talks/2026-AsiaPQC-Lange.pdf), [Classic McEliece](https://classic.mceliece.org/iso.html) |
| ISO/IEC 9594-11:2025 | A wrapper a protocol uses when it migrates onto stronger algorithms, including quantum-safe ones | [IEC catalogue](https://webstore.iec.ch/en/publication/109398) |

A document that was not read is outside this proof. Drafts named beside these publications (lattice-based signatures, stateless hash-based signatures, an NTRU amendment) stay drafts until the page that was read calls them published.

The Classic McEliece page states the floor ISO asked of those cryptosystems: at least 128 bits of security in a quantum model that gives Grover search a square-root speedup. A square root that is still \(2^{128}\) comes from a space of \(2^{256}\).

Grover search of the coin's \(122\) free bits costs \(2^{61}\) queries. The quantum collision cost on those bits is \(2^{122/3}\).

\[
2^{122/3} < 2^{61} < 2^{128} < 2^{256}
\]

\(2^{61} < 2^{128}\) is the comparison with the floor. One coin clears ISO/IEC 9834-8 by the seal. Its quantum search cost sits below the floor those mechanism standards were asked to clear.

The binding this tree puts beside the coin is the SHA-256 of the receipt. `textbook_tamper_detected` is \(256 / 2 = 128\) and \(10^{38} < 2^{128}\). `textbook_receipt_binds_sha256` is \(2^{32} < 2^{128}\). `verify` states the division of work: the fold separates content, and the docket and the receipts carry a SHA-256 for the search an adversary can run. The host-executed plans in [`crypto.ts`](./processing/toolboxes/crypto.ts) name the mechanisms: ML-KEM (FIPS 203, also the ML-KEM of the 18033-2 amendment), ML-DSA (FIPS 204), and SLH-DSA (FIPS 205). Each plan names its sizes and sets `executedBy` to the host. The smallest shared secret among those ML-KEM sets is 32 bytes. A coin is 16 bytes.

## Layout

The folders, the twelve plugins, and `payload { generate }` are [`LAYOUT.md`](./LAYOUT.md). `tsconfig.json` excludes `src/quantum`, so there is no `/api/qpu/*` route.

## Two layers

**Unit** — [`processing/unit`](./processing/unit). The origin, the channel, the coil, and the kernel are [`UNIT.md`](./UNIT.md).

**Processing** — [`processing`](./processing). How a call is answered. [`mcp.ts`](./processing/mcp.ts) is JSON-RPC with no I/O of its own. A tool call compiles a circuit and returns a block.

| Path | What it holds |
|---|---|
| [`cirq.ts`](./processing/cirq.ts) | Qubits (3.3.3), gates (3.4.2), circuits (3.4.5), and the state (3.2.7). The simulators are [`CIRQ.md`](./CIRQ.md). |
| [`algorithms.ts`](./processing/algorithms.ts) | Quantum algorithms (3.4.9). The 22 names, their arguments, and the width at which the call returns the UUID register are [`ALGORITHMS.md`](./ALGORITHMS.md). |
| [`processor.ts`](./processing/processor.ts) | Five layouts. Qubit counts, coupler counts, and Willow's two chips are [`PROCESSORS.md`](./PROCESSORS.md). |
| [`qec.ts`](./processing/qec.ts) | Quantum error correction (3.4.6). The repetition-code cycle, the break-even, and the Steane table are [`QEC.md`](./QEC.md). |
| [`chemistry.ts`](./processing/chemistry.ts) | H₂ in STO-3G. The integrals, the two-qubit Hamiltonian, and the sweep are [`CHEMISTRY.md`](./CHEMISTRY.md). |
| [`echo.ts`](./processing/echo.ts) | Quantum echoes. The circuit, the return probability, and the stated Willow figures are [`ECHO.md`](./ECHO.md). |
| [`clay-register.ts`](./processing/clay-register.ts) | 55 Clay relations in integer arithmetic. The axioms, the recompute, and the UUID check are [`CLAY.md`](./CLAY.md). |
| [`witnesses.ts`](./processing/witnesses.ts) | Fourteen faces around a UUID, and the shared-witness merge. The squares, the triangles, and the coins are [`WITNESSES.md`](./WITNESSES.md). |
| [`standards.ts`](./processing/standards.ts) | The ISO dimensions, the purity gate, and the equivalence check. The defining rows are [`STANDARDS.md`](./STANDARDS.md). |
| [`crypto/index.ts`](./processing/crypto/index.ts) | \(2^{999}+1\) and the 1000-bit trapdoor. The pieces, the product check, and the reflection integer are [`CRYPTO.md`](./CRYPTO.md). |
| [`repositories.ts`](./processing/repositories.ts) | Fifteen quantumlib repositories, and three payloadcms repositories with 21 mounted packages. The matrix is [`REPOSITORIES.md`](./REPOSITORIES.md). |
| [`toolboxes/`](./processing/toolboxes) | Twelve toolboxes, their tools counted by `textbook_mcp_tools_by_toolbox`. The names are [`TOOLBOXES.md`](./TOOLBOXES.md). |

Tests sit next to the modules (`coin-uuid_test.ts`, `google-challenges_test.ts`, `cirq_test.ts`, `qec_test.ts`, `processor_test.ts`, `thousand-bit_test.ts`, and others). A test file is `*_test.ts`: lowercase, and the only punctuation is the extension. Run one with `node --experimental-strip-types --test <file>`. The website `package.json` has no script for that. The deploy workflow does not run these tests.

## API

[`index.ts`](./index.ts) is the import. The exports, the JSON-RPC methods, and the worked calls are [`API.md`](./API.md). There is no `/api/qpu/*` route.

## Open

What stays open is [`OPEN.md`](./OPEN.md).
