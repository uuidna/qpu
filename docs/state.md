---
title: "State"
description: "Current state of @uuidna/qpu 1.0.0: what is built, what is verified, and what is open."
og:title: "State — @uuidna/qpu"
og:description: "Current state of @uuidna/qpu 1.0.0: what is built, what is verified, and what is open."
og:type: article
og:url: "https://github.com/uuidna/qpu/blob/main/docs/state.md"
og:image: "https://opengraph.githubassets.com/qpu/uuidna/qpu"
og:site_name: "@uuidna/qpu"
twitter:card: summary_large_image
twitter:title: "State"
twitter:description: "Current state of @uuidna/qpu 1.0.0: what is built, what is verified, and what is open."
version: "1.0.0"
---
# State

Version **1.0.0** (version lock: `v1.<minor>.<digit>`, 0 = LTS; [scripts/version-lock.mjs](../scripts/version-lock.mjs)).

| Measure | Value | Source |
|---|---|---|
| Capabilities documented inline | 245 of 259 exports | [scripts/generate-docs.mjs](../scripts/generate-docs.mjs) |
| Evidence predicates that hold | 117 of 149 (live ones need the network) | evaluated by `npm run docs` |
| Lean theorems served / recomputed | 124 / 124 of 124 | [lean-receipt.json](../lean-receipt.json) |
| API registry fused | 2529 of 2529 APIs, 438299 cross formulas | [fuse-receipt.json](../fuse-receipt.json) |
| Payload on Cloudflare | 98304 combinations, 96 of 96 bases type-check | [payload-cf-receipt.json](../payload-cf-receipt.json) |
| Live cross-proof | 27 of 30 claims agree; differ: zenodo latest archive, orcid family name, tc niobium mK | [cross-receipt.json](../cross-receipt.json) |

## Open

- **Live host is behind main.** Cloudflare Workers Builds for the uuidna-qpu Worker has failed on every commit since 2026-10-01, so qpu.uuidna.com still serves v0.2.1. A clean clone of main installs, builds and passes `wrangler deploy --dry-run` (the unit bundles at 526 KiB with the STORAGE, BLOBS and PAYLOAD bindings); the failing step is in the Workers project's dashboard build settings, which this repository does not hold. Evidence: the Workers Builds check run on each commit; `npx wrangler deploy --dry-run`.
- **1.0.0 is not on npm.** v1.0.0 has a GitHub release and a Zenodo record (10.5281/zenodo.23091364) but npm's latest is 0.2.1. The version lock forbids any bump until 1.0.0 is published: run publish.yml by workflow_dispatch from main; it needs a trusted publisher for publish.yml on npmjs.com. Evidence: `consolidatedMCP.executeWorkflow('release-workflow', { version: '1.0.0' })` reads npm, GitHub and Zenodo.
- **Two GitHub workflows still fail.** ci-cd.yml and wave2-sdk-release.yml fail on push and have not been examined here. ci.yml was invalid YAML (a plain scalar holding `: `) and is fixed; its gate now resolves every operation by UUID and requires qpu_prove to hold. Evidence: GitHub Actions runs on main.
- **Two data discrepancies.** ORCID 0009-0000-7312-9778 records the family name Roustchev while the citation and Zenodo say Rouschev; index.lean sets niobium to 9200 mK while the cited reference table gives 9.26 K (theorem superconductivity would read gap niobium = 679, not 674). Evidence: cross-receipt.json.
- **QPU database limits.** A collection scan reads at most 4 pages of 1000 keys per request on KV+R2; KV is eventually consistent (prefer the D1 store when a write must be read back at once); no transactions; localized-field queries and geo operators are refused. Evidence: src/quantum/processing/unit/docdb.ts and src/db/payload-qpu.ts.
- **Not yet run on Workers.** The Payload adapter, the regenerated payload configs and the 98304 Payload-on-Cloudflare combinations are type-checked and run in Node; none has run on a deployed Worker against real D1, KV, R2 or Hyperdrive bindings. The restored admin dashboard has not been rendered in Payload 4's admin; src/payload/admin/config.tsx imports slate and is unused. Evidence: payload-cf-receipt.json.
- **qpu_lean is near its token budget.** The efficiency invariant requires calling a door to cost fewer tokens than reading the tree; qpu_lean now serves all 100 theorems with their family graph at 11574 tokens against 11709 to read. A larger proof will need a paginated or summarised qpu_lean before it grows. Evidence: qpuEfficiencyOf().rows.
