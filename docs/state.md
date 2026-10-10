---
uuid: "80523816-f6e3-1913-8441-34071c72b304"
title: "State"
description: "Current state of @uuidna/qpu 1.1.0: what is built, what is verified, and what is open."
og:title: "State — @uuidna/qpu"
og:description: "Current state of @uuidna/qpu 1.1.0: what is built, what is verified, and what is open."
og:type: article
og:url: "https://github.com/uuidna/qpu/blob/main/docs/state.md"
og:image: "https://opengraph.githubassets.com/qpu/uuidna/qpu"
og:site_name: "@uuidna/qpu"
twitter:card: summary_large_image
twitter:title: "State"
twitter:description: "Current state of @uuidna/qpu 1.1.0: what is built, what is verified, and what is open."
version: "1.1.0"
---
# State

Version **1.1.0** (version lock: `v1.<minor>.<digit>`, 0 = LTS; [scripts/version-lock.mjs](../scripts/version-lock.mjs)).

| Measure | Value | Source |
|---|---|---|
| Capabilities documented inline | 280 of 307 exports | [scripts/generate-docs.mjs](../scripts/generate-docs.mjs) |
| Evidence predicates that hold | 117 of 149 (live ones need the network) | evaluated by `npm run docs` |
| Lean theorems served / recomputed | 145 / 145 of 145 | [lean-receipt.json](../lean-receipt.json) |
| API registry fused | 2529 of 2529 APIs, 438299 cross formulas | [fuse-receipt.json](../fuse-receipt.json) |
| Payload on Cloudflare | 1376256 combinations, 96 of 96 bases type-check | [payload-cf-receipt.json](../payload-cf-receipt.json) |
| Live cross-proof | 2026-10-02: 27 of 30 claims agree; differ: zenodo latest archive, orcid family name, tc niobium mK | [cross-receipt.json](../cross-receipt.json) |

## Open

- **Live host is behind main.** qpu.uuidna.com serves v1.0.1 while main is 1.1.0. The host's cite names archive 10.5281/zenodo.23091364 (v1.0.0, commit 50eace7) and current is false. Publish run 37683222011 (2026-10-07) failed in the build job; deploy, image, test and publish were skipped. Evidence: GET https://qpu.uuidna.com/cite; origin/main package.json; `gh run view 37683222011`.
- **1.1.0 is not published.** npm's latest is 1.0.1. archive 1.0.1 is true at 10.5281/zenodo.23156998. tag 1.1.0 is true: package.json is 1.1.0 and git tag v1.1.0 is that version. GitHub has no release v1.1.0. On this tree the zenodo, npm and release checks differ for that reason. The version lock holds because 1.0.1 is the previous released version. Evidence: `npm view @uuidna/qpu version`; gate.gaps.
- **QPU database limits.** A collection scan reads at most 4 pages of 1000 keys per request on KV+R2; KV is eventually consistent (prefer the D1 store when a write must be read back at once); no transactions; localized-field queries and geo operators are refused. Evidence: src/quantum/processing/unit/docdb.ts and src/db/payload-qpu.ts.
- **Not yet run on Workers.** The Payload adapter, the regenerated payload configs and the 1376256 Payload-on-Cloudflare combinations are type-checked and run in Node; none has run on a deployed Worker against real D1, KV, R2 or Hyperdrive bindings. The restored admin dashboard has not been rendered in Payload 4's admin; src/payload/admin/config.tsx imports slate and is unused. Evidence: payload-cf-receipt.json.
