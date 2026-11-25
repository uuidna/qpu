---
name: qpu
description: Use when the task touches the QPU (uuidna/qpu): its 11 toolboxes, their doors over the QPU MCP, the ISO/IEC 4879:2024 vocabulary they compute and the UUID registers that address them. Start here, then open the toolbox skill named (qpu-<toolbox>).
license: CC-BY-NC-ND-4.0
---

# QPU

The quantum processing unit as skills: one per toolbox, generated from the toolbox itself by `payload { scripts: { skills: true } }`. Every capability is a tool called over the MCP door (`POST /api/mcp`, JSON-RPC 2.0: initialize, tools/list, tools/call); the hosted door is https://qpu.uuidna.com/api/mcp, the local app's is http://localhost:3000/api/mcp. Nothing runs by shell: the developer machine is the `machine` tool (next, status, commit, push under the workflow rules), long actions queued as jobs.

## Toolboxes

| Skill | Idea | Tools | Examples | ISO/IEC 4879 terms | UUID |
| --- | --- | --- | --- | --- | --- |
| `qpu-google` | the Google Quantum AI layer: the Willow processor as its spec sheet states it, Cirq gates and circuits, Quantum Echoes, the roadmap, the software, the statements and the repositories. | 14 | 77 | 86 | `e04e7ffc-7a3a-3465-84e3-0cf0367a88d8` |
| `qpu-tree` | the tree knows itself: its leads, its self-audit, any statement matched or proved impossible, the Clay register recomputed, any UUID verified cheaply, its metrics in real time. | 11 | 260 | 9 | `5de13a37-34b8-41c2-8cdd-2309c3b2dbb9` |
| `qpu-flow` | the run of the tree as tools: discover the hosts, verify the leads, let the unit judge, imagine the next leads; the client only fetches and writes. | 6 | 21 | 6 | `c5f961f7-be55-3b7e-a4f7-8c80971a92af` |
| `qpu-language` | any language and dialect, offline and token-free: translation by vocabulary both ways, the vocabulary measured against every term the surface emits, and prose programmed from a tool's result and its toolbox's skill. | 2 | 2 | 0 | `49c73d75-4b4e-25cd-bfff-bdcf7e939669` |
| `qpu-raid` | the docket as a database: MongoDB's query and update language ported as pure functions over content-addressed entries, so any document framework (Payload first) stores on the RAID through its mongodb adapter. | 1 | 2 | 0 | `1bedd3f0-317f-1255-8bf5-163c384a2fd8` |
| `qpu-billing` | Stripe per tenant: a licence bought at one tenant is an entry valid on the domains it names, every event idempotent and linked, every signature verified with the tenant's own secret, every refusal a lead. | 2 | 11 | 1 | `ca7b3d80-013d-31cd-b166-d34427edae96` |
| `qpu-legal` | the legal and security audit of this MCP through MCP: the author's claims judged by the unit's forensic, legal and security doors, free agents by default, the operator alone overriding, beside the tree's own checks of its sources. | 3 | 14 | 4 | `c9049682-e888-57eb-b56e-42fe60822af0` |
| `qpu-repository` | the repository watched: every workspace, branch, tag and release here compared with the remote and the archive online, every disagreement a lead. | 1 | 3 | 0 | `d5534926-469b-43c3-ad84-5ecc5d001db7` |
| `qpu-standards` | the standards fused: schema.org on every block, page and offer; ISO 8601, 639-1, 4217 and 3166-1 in every date, language, price and country, validated against the CLDR lists discovery reads as contracts. | 3 | 4 | 0 | `d5e9aae5-3084-4d67-a7c8-de316acc5fce` |
| `qpu-extension` | QPU the natural extension of every MCP and every MCP of QPU: a host's tools read into doors of this catalogue by the same reading discovery uses, a foreign door served by one request the client fetches, and this catalogue expressed as the registration any MCP client mounts; tenant configurable through the hosts and tokens a tenant names. | 1 | 19 | 4 | `faa2029c-83ad-8dad-9c15-810d72aca56e` |
| `qpu-crypto` | the split folds: what a place cannot hold is folded into pieces it can, each addressed by content and the whole by its pieces; a key names its piece; the bound is a reflective boundary that decides by comparison before computing. | 3 | 44 | 6 | `cca07823-09e0-5a48-8a42-e9f332e79b23` |

## Vocabulary coverage (ISO/IEC 4879:2024)

86 of 86 terms are named by at least one skill: 86 computed by the QPU through qpu-google (each term one sealed UUID register, its circuit gate the witness; e2e { standards: true } replays them), 41 namings by the skills' own text.

Every term is named by a skill (textbook_skills_complete).

## Register

Every skill is one UUID (ISO/IEC 9834-8) of its canonical text, a register of 122 qubits at hexbit width 4 (32 × 4 − 4 − 2 = 122); this index is `9388d6d9-a272-538c-9330-19587327445e`, the UUID of the 11 skill addresses in order. Recompute to verify; a different address is a different skill.
