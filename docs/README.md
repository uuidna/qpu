---
uuid: "bf92c791-b4fb-80d3-9d27-3a2bbe8d6a32"
title: "Documentation"
description: "@uuidna/qpu 1.1.0: an exact quantum processing unit served over MCP, with formal proofs, content-addressed receipts, a document database on Cloudflare and Payload CMS integration."
og:title: "Documentation — @uuidna/qpu"
og:description: "@uuidna/qpu 1.1.0: an exact quantum processing unit served over MCP, with formal proofs, content-addressed receipts, a document database on Cloudflare and Payload CMS integration."
og:type: article
og:url: "https://github.com/uuidna/qpu/blob/main/docs/README.md"
og:image: "https://opengraph.githubassets.com/qpu/uuidna/qpu"
og:site_name: "@uuidna/qpu"
twitter:card: summary_large_image
twitter:title: "Documentation"
twitter:description: "@uuidna/qpu 1.1.0: an exact quantum processing unit served over MCP, with formal proofs, content-addressed receipts, a document database on Cloudflare and Payload CMS integration."
version: "1.1.0"
---
# @uuidna/qpu documentation

An exact quantum processing unit served over MCP at qpu.uuidna.com: integer-amplitude state vectors, Lean-checked theorems, content-addressed quantum receipts, a MongoDB-semantics document database on Cloudflare bindings, API fusion and Payload CMS on Workers. Every page is generated from the inline docs; every capability links to its source and its evidence.

| Wing | Capabilities | Evidence holds |
|---|---|---|
| [Lattice & arithmetic](lattice.md) | 10 | 7 of 7 |
| [Quantum computation](quantum.md) | 17 | 14 of 17 |
| [Formal proof (Lean)](proof.md) | 12 | 4 of 4 |
| [Cryptography](crypto.md) | 3 | 2 of 2 |
| [UUIDs & quantum receipts](receipts.md) | 39 | 14 of 16 |
| [Storage & database](storage.md) | 25 | 6 of 10 |
| [MCP & agents](agents.md) | 112 | 46 of 55 |
| [Live science data](science.md) | 22 | 10 of 17 |
| [API fusion](fusion.md) | 18 | 5 of 11 |
| [Payload & Cloudflare](cms.md) | 24 | 3 of 4 |
| [Presentation & discovery](presentation.md) | 16 | 14 of 14 |

Also: [state](state.md) · [comparison](comparison.md) · [build receipt](../README.md)

## Use

| Command | Does |
|---|---|
| `npm run build` | compile, after the version lock |
| `npm run lean` | check index.lean with Lean 4 |
| `npm run lean:embed` | embed index.lean and the version into the unit |
| `npm run fuse` | fuse the API registry |
| `npm run payload:cf` | enumerate and type-check every Payload-on-Cloudflare combination (`-- --repo` regenerates this repo's configs) |
| `npm run readme` | write the build receipt |
| `npm run docs` | write these docs |
