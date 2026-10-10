---
uuid: "19dad732-c2c8-35eb-8e0f-6f014da32378"
title: "UUIDs & quantum receipts"
description: "Content-addressed identity and the receipt streams that record every computation. 39 capabilities; 14 of 16 evidence predicates hold."
og:title: "UUIDs & quantum receipts — @uuidna/qpu"
og:description: "Content-addressed identity and the receipt streams that record every computation. 39 capabilities; 14 of 16 evidence predicates hold."
og:type: article
og:url: "https://github.com/uuidna/qpu/blob/main/docs/receipts.md"
og:image: "https://opengraph.githubassets.com/qpu/uuidna/qpu"
og:site_name: "@uuidna/qpu"
twitter:card: summary_large_image
twitter:title: "UUIDs & quantum receipts"
twitter:description: "Content-addressed identity and the receipt streams that record every computation. 39 capabilities; 14 of 16 evidence predicates hold."
version: "1.1.0"
---
# UUIDs & quantum receipts

Content-addressed identity and the receipt streams that record every computation.

| | |
|---|---|
| Capabilities | 39 |
| With an evidence predicate | 16 |
| Predicates that hold now | 14 |
| Live (need the network; checked by the live doors) | 0 |

| Capability | Kind | What it does | Evidence | Status |
|---|---|---|---|---|
| [`qpuContentUuidOf`](../src/quantum/processing/unit/index.ts#L7127) | builder | RFC 9562 v8 content UUID of any JSON value over canonical JSON (sorted keys); the same content gives the same UUID anywhere. | `qpuContentUuidHolds` | holds |
| [`qpuContextOf`](../src/quantum/processing/unit/index.ts#L2333) | builder | The JSON-LD @context every served document carries (schema.org plus the unit's prefixes). | — | — |
| [`qpuFieldUuidOf`](../src/quantum/processing/unit/index.ts#L7363) | builder | One field, addressed by what it IS rather than by what it is called: its name and its shape, folded. | `qpuFieldUuidHolds` | holds |
| [`qpuFoldOf`](../src/quantum/processing/unit/index.ts#L83) | builder | FNV-1a 64 fold of a string to 16 lowercase hex digits (BigInt arithmetic); the hash every receipt, ETag and content address in the unit is built on. | `qpuFoldHolds` | holds |
| [`qpuHexCatalogOf`](../src/quantum/processing/unit/index.ts#L10972) | builder | The hex catalogue: every formula family with its handle and formulas by nibble, the param modes, the layout. | `qpuHexHolds` | holds |
| [`qpuHexDecodeOf`](../src/quantum/processing/unit/index.ts#L10751) | builder | Read a hex-program UUID back: its family, its formulas in order, its params. | `qpuHexHolds` | holds |
| [`qpuHexFamiliesOf`](../src/quantum/processing/unit/index.ts#L10655) | builder | Every formula family a hex program can name: each Lean module with definitions (Qpu.Mint, Qpu.Shor, Qpu.Lattice, Qpu.Hybrid, Qpu.Physics; its definitions in file order, helpers ending Aux left out) evaluated exactly under Lean's Nat semantics, and every registered family. | `qpuHexHolds` | holds |
| [`qpuHexUuidOf`](../src/quantum/processing/unit/index.ts#L10704) | builder | Mint the UUID that is a program of formulas: handle (8 hex) = fold of the family name; three 4-hex program sections hold up to ten formula indexes, one per nibble (version 8 and the variant kept; the variant's two free bits select how the params split); params (12 hex) carry up to three naturals. | `qpuHexHolds` | holds |
| [`qpuMessageOf`](../src/quantum/processing/unit/index.ts#L4262) | builder | Send or read a message on a lane; each message gets an RFC 9562 UUID and a clock sequence. | `qpuMessageHolds` | holds |
| [`qpuMintReceiptOf`](../src/quantum/processing/unit/index.ts#L202) | builder | The mint ledger: number of mintOf calls and the two FNV chains (process-wide and current scope) over every k:x it minted. | — | — |
| [`qpuReceiptFoldOf`](../src/quantum/processing/unit/index.ts#L317) | builder | Fold a list of receipt rows (name:dim:fold) to one 16-hex digest; the proof compares this digest across runs. | — | — |
| [`qpuReceiptLedgerOf`](../src/quantum/processing/unit/index.ts#L236) | builder | The ledger of every quantum computation this process ran, in order. | — | — |
| [`qpuReceiptStreamsOf`](../src/quantum/processing/unit/index.ts#L277) | builder | Every stream replayed from the ledger: each row's prev is the UUID before it (genesis is the stream's href), each UUID recomputes from its payload fold and referrer, and the replayed chain equals the live head's. | `qpuReceiptStreamsHolds` | holds |
| [`qpuSeatHandleOf`](../src/quantum/processing/unit/index.ts#L4217) | builder | A seat's handle on a face: its id, href, hop across the involution and the KV capacity it addresses. | `qpuSeatHandleHolds` | checked on each call (needs inputs) |
| [`qpuServedLedgerOf`](../src/quantum/processing/unit/index.ts#L10537) | builder | Ledger of memoised documents served, each with the fold of its bytes (its ETag). | `qpuServedLedgerHolds` | holds |
| [`qpuServedMemoOf`](../src/quantum/processing/unit/index.ts#L10584) | builder | The served-document memo: entries, cap and integrity check. | `qpuServedMemoHolds` | holds |
| [`qpuShapeUuidOf`](../src/quantum/processing/unit/index.ts#L7095) | builder | A UUID COMPUTED FROM CONTENT, WHICH IS WHAT MAKES ONE PROGRAMMABLE. uuidImprintOf mints: it counts a sequence and lays the lattice into RFC 9562 fields, so two calls differ. | `qpuShapeUuidHolds` | holds |
| [`qpuShorReceiptsOf`](../src/quantum/processing/unit/shor.ts#L349) | builder | The receipts of one Shor run: the folds, and the exact amplitudes of the modexp and noise states, the ledger gained after `from`. | `qpuShorReceiptsHolds` | checked on each call (needs inputs) |
| [`qpuUuidReceiptOf`](../src/quantum/processing/unit/index.ts#L261) | builder | Append a quantum receipt for a UUID-addressed computation: payload fold of {name, subject, value}; receipt UUID = content UUID of {payload fold, referrer}; chained per stream (seq, prev). | `qpuUuidReceiptHolds` | holds |
| [`allInDomain`](../src/core/uuid.ts#L269) | function | Every UUID registered in a domain. | — | — |
| [`allOfType`](../src/core/uuid.ts#L278) | function | Every UUID registered with a type. | — | — |
| [`consolidatedMCP`](../src/mcp/uuid-programmable-core.ts#L277) | function | The ConsolidatedMCP singleton. | — | — |
| [`executeByName`](../src/core/uuid-bridge.ts#L162) | function | Execute operation by name (global) | — | — |
| [`executeByUUID`](../src/core/uuid-bridge.ts#L153) | function | Execute operation by UUID (global) | — | — |
| [`find`](../src/core/uuid.ts#L224) | function | The registry entry for a domain and resource. | — | — |
| [`gen`](../src/core/uuid.ts#L233) | function | A UUID for a domain and resource: content-derived, or random when asked. | — | — |
| [`get`](../src/core/uuid.ts#L215) | function | The registry entry for a UUID. | — | — |
| [`inDomain`](../src/core/uuid.ts#L251) | function | Whether a UUID is registered in a domain. | — | — |
| [`ofType`](../src/core/uuid.ts#L260) | function | Whether a UUID is registered with a type. | — | — |
| [`qpuHexRegisterOf`](../src/quantum/processing/unit/index.ts#L10615) | function | Register a formula in a family (cross, audit, path, fuse) so a hex UUID can run it; formulas are indexed in name order. | `qpuHexHolds` | holds |
| [`qpuMcpRegisterOf`](../src/quantum/processing/unit/index.ts#L519) | function | Register a JSON-RPC method on /mcp (resources, prompts, completion, logging) and the capability it adds to initialize. | — | — |
| [`register`](../src/core/uuid.ts#L200) | function | Register a resource under a UUID with its type, domain and metadata. | — | — |
| [`summary`](../src/core/uuid.ts#L287) | function | Registry counts: total, domains, per type, verified. | — | — |
| [`uuid`](../src/core/uuid.ts#L189) | function | The process-wide UUID registry. | — | — |
| [`uuidBridge`](../src/core/uuid-bridge.ts#L146) | function | The UUIDBridge singleton. | — | — |
| [`verify`](../src/core/uuid.ts#L242) | function | Whether a string has RFC 9562 UUID shape. | — | — |
| [`ConsolidatedMCP`](../src/mcp/uuid-programmable-core.ts#L20) | class | Operations and workflows addressed by content UUID: executeByUUID, executeProgram (a list of UUIDs, each receipt the next referrer), runDeploymentGate (every operation resolves and prove holds) and release checks that read npm, GitHub and Zenodo. | — | — |
| [`UUID`](../src/core/uuid.ts#L42) | class | The UUID registry: register resources by UUID and index them by domain, resource and type; deterministic() gives content UUIDs (qpuShapeUuidOf). | — | — |
| [`UUIDBridge`](../src/core/uuid-bridge.ts#L31) | class | Addresses every core operation by its content UUID (registered in the UUID registry) and executes it by UUID, with a quantum receipt per execution. | — | — |

Generated from the inline docs by `npm run docs`. Index: [docs](README.md).
