---
uuid: "7778ebab-7f77-42ea-ae3a-834f3d35c495"
title: "Storage & database"
description: "RAID over Cloudflare KV and R2, content-addressed storage and the MongoDB-semantics document database. 25 capabilities; 6 of 10 evidence predicates hold."
og:title: "Storage & database — @uuidna/qpu"
og:description: "RAID over Cloudflare KV and R2, content-addressed storage and the MongoDB-semantics document database. 25 capabilities; 6 of 10 evidence predicates hold."
og:type: article
og:url: "https://github.com/uuidna/qpu/blob/main/docs/storage.md"
og:image: "https://opengraph.githubassets.com/qpu/uuidna/qpu"
og:site_name: "@uuidna/qpu"
twitter:card: summary_large_image
twitter:title: "Storage & database"
twitter:description: "RAID over Cloudflare KV and R2, content-addressed storage and the MongoDB-semantics document database. 25 capabilities; 6 of 10 evidence predicates hold."
version: "1.4.0"
---
# Storage & database

RAID over Cloudflare KV and R2, content-addressed storage and the MongoDB-semantics document database.

| | |
|---|---|
| Capabilities | 25 |
| With an evidence predicate | 10 |
| Predicates that hold now | 6 |
| Live (need the network; checked by the live doors) | 3 |

| Capability | Kind | What it does | Evidence | Status |
|---|---|---|---|---|
| [`docDbOf`](../src/quantum/processing/unit/docdb.ts#L412) | builder | A database: named collections over one store, one id function and one write hook. | — | — |
| [`filterOf`](../src/db/payload-qpu.ts#L52) | builder | Payload's where, operator for operator, as a docdb filter. | — | — |
| [`payloadDbOf`](../src/quantum/processing/unit/index.ts#L1285) | builder | How Payload's database maps onto the hybrid store: KV upper layer, R2 lower layer, collections and the speed/cost readings (theorem hybrid). | `payloadDbHolds` | holds |
| [`qpuDocDbOf`](../src/quantum/processing/unit/index.ts#L4701) | builder | The QPU document database (MongoDB query and update semantics, docdb.ts) over the unit's store; ids are content UUIDs; every write is a quantum receipt in the db stream. | — | — |
| [`raidOf`](../src/quantum/processing/unit/index.ts#L1022) | builder | RAID 10 over the faces: rays stripes mirrored by coins teams, cheapest-first placement for a given traffic. | `raidHolds` | holds |
| [`storageAddressOf`](../src/quantum/processing/unit/index.ts#L4375) | builder | THE KEY IS THE CONTENT, SO THE ADDRESS MUST SEPARATE CONTENT. | `storageAddressHolds` | holds |
| [`storageListOf`](../src/quantum/processing/unit/index.ts#L5052) | builder | storageListOf(env, prefix, limit) → the link names under a prefix in ascending order (so a name that begins with an inverted arrival time lists the newest first), each with the document a GET of it returns; RAID shares and inode keys never list. | `storageListHolds` | holds |
| [`storageMaintainOf`](../src/quantum/processing/unit/index.ts#L4924) | builder | Repair broken RAID shares and delete orphans (a write; needs the write token). | `storageMaintainOf` | live (network) |
| [`storageMcpOf`](../src/quantum/processing/unit/index.ts#L5387) | builder | The storage sub-server's catalogue and live store reading. | `storageMcpOf` | live (network) |
| [`storageMetaOf`](../src/quantum/processing/unit/index.ts#L4717) | builder | Storage description: memory or KV, RAID, hybrid layers, Payload database mapping, Alpine overlay and bindings. | `storageMetaOf` | **false** |
| [`storageMonitorOf`](../src/quantum/processing/unit/index.ts#L4765) | builder | Monitor RAID health: expected and missing shares, incomplete keys, sampled bytes and traffic. | `storageMonitorOf` | live (network) |
| [`storageOf`](../src/quantum/processing/unit/index.ts#L5083) | builder | Content-addressed storage: GET/PUT/DELETE by key with inodes, referrer links, nlink counting and RAID striping over KV and R2. | `storageHolds` | holds |
| [`storageToolsOf`](../src/quantum/processing/unit/index.ts#L5320) | builder | The storage MCP tools (get, list, put, delete, maintain, monitor) bound to an environment and an auth header. | — | — |
| [`storageWriteAllowedOf`](../src/quantum/processing/unit/index.ts#L5033) | builder | Whether a public write is allowed: only when QPU_WRITE_TOKEN is bound and the bearer matches; fails closed. | `storageWriteAllowedHolds` | holds |
| [`applyUpdate`](../src/quantum/processing/unit/docdb.ts#L177) | function | Apply a MongoDB update document (operators or a replacement) to a copy of a document; inserting enables $setOnInsert. | — | — |
| [`compareValues`](../src/quantum/processing/unit/docdb.ts#L103) | function | MongoDB comparison order across types: null/undefined < numbers < strings < objects < arrays < booleans; arrays element-wise. | — | — |
| [`down`](../src/db/payload-qpu.ts#L37) | function | — | — | — |
| [`matches`](../src/quantum/processing/unit/docdb.ts#L161) | function | Whether a document matches a MongoDB filter (operators, $and/$or/$nor, dotted paths through arrays). | — | — |
| [`project`](../src/quantum/processing/unit/docdb.ts#L218) | function | Apply an include or exclude projection to a document. | — | — |
| [`up`](../src/db/payload-qpu.ts#L33) | function | — | — | — |
| [`DocCollection`](../src/quantum/processing/unit/docdb.ts#L262) | class | One collection over a DocStore: insert, find with sort/skip/limit/projection, count, distinct, update (with upsert), replace and delete. | — | — |
| [`d1DocStore`](../src/quantum/processing/unit/docdb.ts#L431) | store | A document store on a D1 binding: one key/value table, prefix listing by range, so it never scans past its prefix. | — | — |
| [`docStoreOf`](../src/quantum/processing/unit/index.ts#L4687) | store | THE QPU AS A DATABASE. | — | — |
| [`memoryDocStore`](../src/quantum/processing/unit/docdb.ts#L36) | store | An in-memory DocStore (JSON-serialised values), for tests and Node. | — | — |
| [`qpuAdapter`](../src/db/payload-qpu.ts#L152) | adapter | Payload database adapter on the QPU document database. | — | — |

Generated from the inline docs by `npm run docs`. Index: [docs](README.md).
