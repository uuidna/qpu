---
title: "Cryptography"
description: "Shor on 91, RSA factoring and the crypt split identity as callable doors. 3 capabilities; 2 of 2 evidence predicates hold."
og:title: "Cryptography — @uuidna/qpu"
og:description: "Shor on 91, RSA factoring and the crypt split identity as callable doors. 3 capabilities; 2 of 2 evidence predicates hold."
og:type: article
og:url: "https://github.com/uuidna/qpu/blob/main/docs/crypto.md"
og:image: "https://opengraph.githubassets.com/qpu/uuidna/qpu"
og:site_name: "@uuidna/qpu"
twitter:card: summary_large_image
twitter:title: "Cryptography"
twitter:description: "Shor on 91, RSA factoring and the crypt split identity as callable doors. 3 capabilities; 2 of 2 evidence predicates hold."
version: "1.0.0"
---
# Cryptography

Shor on 91, RSA factoring and the crypt split identity as callable doors.

| | |
|---|---|
| Capabilities | 3 |
| With an evidence predicate | 2 |
| Predicates that hold now | 2 |
| Live (need the network; checked by the live doors) | 0 |

| Capability | Kind | What it does | Evidence | Status |
|---|---|---|---|---|
| [`qpuCybersecurityOf`](../src/quantum/processing/unit/index.ts#L6079) | builder | The cybersecurity door set: Shor on 91, RSA factoring, the encrypt identity, crypt split and RAID, with what each verifies. | `qpuCybersecurityHolds` | holds |
| [`qpuCybersecurityToolsOf`](../src/quantum/processing/unit/index.ts#L6208) | builder | The eight cybersecurity MCP tools (catalog, rsa, shor, cmodexp, iqft, shots, split, verify) with their man pages and handlers. | — | — |
| [`qpuEncryptOf`](../src/quantum/processing/unit/index.ts#L3769) | builder | The split identity of theorem crypto: fused = split x share, recomputed; secrecy is reported false (it is an identity, not a cipher). | `qpuEncryptHolds` | holds |

Generated from the inline docs by `npm run docs`. Index: [docs](README.md).
