---
title: "Payload & Cloudflare"
description: "Payload CMS on Workers in every combination, and the Payload readings the unit serves. 15 capabilities; 3 of 4 evidence predicates hold."
og:title: "Payload & Cloudflare — @uuidna/qpu"
og:description: "Payload CMS on Workers in every combination, and the Payload readings the unit serves. 15 capabilities; 3 of 4 evidence predicates hold."
og:type: article
og:url: "https://github.com/uuidna/qpu/blob/main/docs/cms.md"
og:image: "https://opengraph.githubassets.com/qpu/uuidna/qpu"
og:site_name: "@uuidna/qpu"
twitter:card: summary_large_image
twitter:title: "Payload & Cloudflare"
twitter:description: "Payload CMS on Workers in every combination, and the Payload readings the unit serves. 15 capabilities; 3 of 4 evidence predicates hold."
version: "1.0.0"
---
# Payload & Cloudflare

Payload CMS on Workers in every combination, and the Payload readings the unit serves.

| | |
|---|---|
| Capabilities | 15 |
| With an evidence predicate | 4 |
| Predicates that hold now | 3 |
| Live (need the network; checked by the live doors) | 0 |

| Capability | Kind | What it does | Evidence | Status |
|---|---|---|---|---|
| [`cloudflareCombinationOf`](../src/deployment/payload-templates.ts#L382) | builder | Parse a combination key (runtime/db/storage/email/plugins) back into a combination. | — | — |
| [`cloudflareKeyOf`](../src/deployment/payload-templates.ts#L375) | builder | A combination's canonical key: the axes in order, plugins sorted — what its content UUID is taken over. | — | — |
| [`cloudflarePayloadOf`](../src/deployment/payload-templates.ts#L528) | builder | Generate one combination: payload.config.ts, wrangler.jsonc and dependencies, optionally carrying an app's own collections (CloudflareApp). | — | — |
| [`qpuFusionOf`](../src/quantum/processing/unit/index.ts#L14001) | builder | Fusion of catalogues, hosts, schemas, Payload, install and hologram readings over the fused capacity. | `qpuFusionHolds` | holds |
| [`qpuIntelligenceOf`](../src/quantum/processing/unit/index.ts#L14058) | builder | The 'intelligence' reading: the fusion test over free online research. | `qpuIntelligenceHolds` | holds |
| [`qpuPayloadFindOf`](../src/quantum/processing/unit/index.ts#L13792) | builder | One Payload collection's find tool, sealed against writes. | `qpuPayloadFindHolds` | checked on each call (needs inputs) |
| [`qpuPayloadMcpOf`](../src/quantum/processing/unit/index.ts#L13747) | builder | The Payload MCP the unit describes: collections, find-only tools, the database plugin and its write path. | `qpuPayloadMcpHolds` | holds |
| [`cloudflareCombinations`](../src/deployment/payload-templates.ts#L547) | function | Every combination of the axes: runtimes × databases × storage × email × every subset of the plugins. | — | — |
| [`payloadTemplates`](../src/deployment/payload-templates.ts#L561) | function | A PayloadTemplates instance. | — | — |
| [`PayloadTemplates`](../src/deployment/payload-templates.ts#L44) | class | Deployment templates: four hardware modes (browser, standalone, docker, kubernetes) and the Cloudflare family (cloudflarePayload) for Next.js + Payload on Workers. | — | — |
| [`CLOUDFLARE_DATABASES`](../src/deployment/payload-templates.ts#L341) | constant | qpu-raid and qpu-d1 are the QPU document database (MongoDB semantics) on native bindings: a MongoDB request on Workers is one of these. | — | — |
| [`CLOUDFLARE_EMAIL`](../src/deployment/payload-templates.ts#L353) | constant | Email choices: Resend, or none. | — | — |
| [`CLOUDFLARE_PLUGINS`](../src/deployment/payload-templates.ts#L359) | constant | The Payload plugins a combination can include. | — | — |
| [`CLOUDFLARE_RUNTIMES`](../src/deployment/payload-templates.ts#L335) | constant | Next.js runtimes on Workers: vinext (Cloudflare's recommended path) and the OpenNext adapter. | — | — |
| [`CLOUDFLARE_STORAGE`](../src/deployment/payload-templates.ts#L347) | constant | Upload storage choices: R2, S3, or none. | — | — |

Generated from the inline docs by `npm run docs`. Index: [docs](README.md).
