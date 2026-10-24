---
uuid: "b3e78453-aaa1-2d96-811f-3ae963a2aee7"
title: "UUIDs & quantum receipts"
description: "Content-addressed identity and the receipt streams that record every computation. 38 capabilities; 13 of 15 evidence predicates hold."
og:title: "UUIDs & quantum receipts — @uuidna/qpu"
og:description: "Content-addressed identity and the receipt streams that record every computation. 38 capabilities; 13 of 15 evidence predicates hold."
og:type: article
og:url: "https://github.com/uuidna/qpu/blob/main/docs/receipts.md"
og:image: "https://opengraph.githubassets.com/qpu/uuidna/qpu"
og:site_name: "@uuidna/qpu"
twitter:card: summary_large_image
twitter:title: "UUIDs & quantum receipts"
twitter:description: "Content-addressed identity and the receipt streams that record every computation. 38 capabilities; 13 of 15 evidence predicates hold."
version: "1.4.0"
---
# UUIDs & quantum receipts

Content-addressed identity and the receipt streams that record every computation.

| | |
|---|---|
| Capabilities | 38 |
| With an evidence predicate | 15 |
| Predicates that hold now | 13 |
| Live (need the network; checked by the live doors) | 0 |

| Capability | Kind | What it does | Evidence | Status |
|---|---|---|---|---|
| [`contentUuidOf`](../src/quantum/processing/unit/index.ts#L7147) | builder | RFC 9562 v8 content UUID of any JSON value over canonical JSON (sorted keys); the same content gives the same UUID anywhere. | `contentUuidHolds` | holds |
| [`contextOf`](../src/quantum/processing/unit/index.ts#L2303) | builder | The JSON-LD @context every served document carries (schema.org plus the unit's prefixes). | — | — |
| [`fieldUuidOf`](../src/quantum/processing/unit/index.ts#L7383) | builder | One field, addressed by what it IS rather than by what it is called: its name and its shape, folded. | `fieldUuidHolds` | holds |
| [`foldOf`](../src/quantum/processing/unit/index.ts#L83) | builder | FNV-1a 64 fold of a string to 16 lowercase hex digits (BigInt arithmetic); the hash every receipt, ETag and content address in the unit is built on. | `foldHolds` | holds |
| [`hexCatalogOf`](../src/quantum/processing/unit/index.ts#L10960) | builder | The hex catalogue: every formula family with its handle and formulas by nibble, the param modes, the layout. | `hexHolds` | holds |
| [`hexDecodeOf`](../src/quantum/processing/unit/index.ts#L10739) | builder | Read a hex-program UUID back: its family, its formulas in order, its params. | `hexHolds` | holds |
| [`hexFamiliesOf`](../src/quantum/processing/unit/index.ts#L10643) | builder | Every formula family a hex program can name: each Lean module with definitions (Qpu.Mint, Qpu.Shor, Qpu.Lattice, Qpu.Hybrid, Qpu.Physics; its definitions in file order, helpers ending Aux left out) evaluated exactly under Lean's Nat semantics, and every registered family. | `hexHolds` | holds |
| [`messageOf`](../src/quantum/processing/unit/index.ts#L4224) | builder | Send or read a message on a lane; each message gets an RFC 9562 UUID and a clock sequence. | `messageHolds` | holds |
| [`qpuHexUuidOf`](../src/quantum/processing/unit/index.ts#L10692) | builder | Mint the UUID that is a program of formulas: handle (8 hex) = fold of the family name; three 4-hex program sections hold up to ten formula indexes, one per nibble (version 8 and the variant kept; the variant's two free bits select how the params split); params (12 hex) carry up to three naturals. | `hexHolds` | holds |
| [`qpuMintReceiptOf`](../src/quantum/processing/unit/index.ts#L202) | builder | The mint ledger: number of mintOf calls and the two FNV chains (process-wide and current scope) over every k:x it minted. | — | — |
| [`qpuReceiptFoldOf`](../src/quantum/processing/unit/index.ts#L316) | builder | Fold a list of receipt rows (name:dim:fold) to one 16-hex digest; the proof compares this digest across runs. | — | — |
| [`receiptLedgerOf`](../src/quantum/processing/unit/index.ts#L236) | builder | The ledger of every quantum computation this process ran, in order. | — | — |
| [`receiptStreamsOf`](../src/quantum/processing/unit/index.ts#L277) | builder | Every stream replayed from the ledger: each row's prev is the UUID before it (genesis is the stream's href), each UUID recomputes from its payload fold and referrer, and the replayed chain equals the live head's. | `receiptStreamsOf` | **false** |
| [`seatHandleOf`](../src/quantum/processing/unit/index.ts#L4180) | builder | A seat's handle on a face: its id, href, hop across the involution and the KV capacity it addresses. | `seatHandleOf` | **false** |
| [`servedLedgerOf`](../src/quantum/processing/unit/index.ts#L10525) | builder | Ledger of memoised documents served, each with the fold of its bytes (its ETag). | `servedLedgerHolds` | holds |
| [`servedMemoOf`](../src/quantum/processing/unit/index.ts#L10572) | builder | The served-document memo: entries, cap and integrity check. | `servedMemoHolds` | holds |
| [`shapeUuidOf`](../src/quantum/processing/unit/index.ts#L7115) | builder | A UUID COMPUTED FROM CONTENT, WHICH IS WHAT MAKES ONE PROGRAMMABLE. uuidImprintOf mints: it counts a sequence and lays the lattice into RFC 9562 fields, so two calls differ. | `shapeUuidHolds` | holds |
| [`uuidReceiptOf`](../src/quantum/processing/unit/index.ts#L261) | builder | Append a quantum receipt for a UUID-addressed computation: payload fold of {name, subject, value}; receipt UUID = content UUID of {payload fold, referrer}; chained per stream (seq, prev). | `uuidReceiptHolds` | holds |
| [`allInDomain`](../src/core/uuid.ts#L268) | function | Every UUID registered in a domain. | — | — |
| [`allOfType`](../src/core/uuid.ts#L277) | function | Every UUID registered with a type. | — | — |
| [`consolidatedMCP`](../src/mcp/uuid-programmable-core.ts#L275) | function | The ConsolidatedMCP singleton. | — | — |
| [`executeByName`](../src/core/uuid-bridge.ts#L161) | function | Execute operation by name (global) | — | — |
| [`executeByUUID`](../src/core/uuid-bridge.ts#L152) | function | Execute operation by UUID (global) | — | — |
| [`find`](../src/core/uuid.ts#L223) | function | The registry entry for a domain and resource. | — | — |
| [`gen`](../src/core/uuid.ts#L232) | function | A UUID for a domain and resource: content-derived, or random when asked. | — | — |
| [`get`](../src/core/uuid.ts#L214) | function | The registry entry for a UUID. | — | — |
| [`hexRegisterOf`](../src/quantum/processing/unit/index.ts#L10603) | function | Register a formula in a family (cross, audit, path, fuse) so a hex UUID can run it; formulas are indexed in name order. | `hexHolds` | holds |
| [`inDomain`](../src/core/uuid.ts#L250) | function | Whether a UUID is registered in a domain. | — | — |
| [`mcpRegisterOf`](../src/quantum/processing/unit/index.ts#L518) | function | Register a JSON-RPC method on /mcp (resources, prompts, completion, logging) and the capability it adds to initialize. | — | — |
| [`ofType`](../src/core/uuid.ts#L259) | function | Whether a UUID is registered with a type. | — | — |
| [`register`](../src/core/uuid.ts#L199) | function | Register a resource under a UUID with its type, domain and metadata. | — | — |
| [`summary`](../src/core/uuid.ts#L286) | function | Registry counts: total, domains, per type, verified. | — | — |
| [`uuid`](../src/core/uuid.ts#L188) | function | The process-wide UUID registry. | — | — |
| [`uuidBridge`](../src/core/uuid-bridge.ts#L145) | function | The UUIDBridge singleton. | — | — |
| [`verify`](../src/core/uuid.ts#L241) | function | Whether a string has RFC 9562 UUID shape. | — | — |
| [`ConsolidatedMCP`](../src/mcp/uuid-programmable-core.ts#L20) | class | Operations and workflows addressed by content UUID: executeByUUID, executeProgram (a list of UUIDs, each receipt the next referrer), runDeploymentGate (every operation resolves and prove holds) and release checks that read npm, GitHub and Zenodo. | — | — |
| [`UUID`](../src/core/uuid.ts#L42) | class | The UUID registry: register resources by UUID and index them by domain, resource and type; deterministic() gives content UUIDs (shapeUuidOf). | — | — |
| [`UUIDBridge`](../src/core/uuid-bridge.ts#L31) | class | Addresses every core operation by its content UUID (registered in the UUID registry) and executes it by UUID, with a quantum receipt per execution. | — | — |

Generated from the inline docs by `npm run docs`. Index: [docs](README.md).
