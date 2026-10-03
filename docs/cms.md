---
title: "Payload & Cloudflare"
description: "Payload CMS on Workers in every combination, and the Payload readings the unit serves. 19 capabilities; 3 of 4 evidence predicates hold."
og:title: "Payload & Cloudflare — @uuidna/qpu"
og:description: "Payload CMS on Workers in every combination, and the Payload readings the unit serves. 19 capabilities; 3 of 4 evidence predicates hold."
og:type: article
og:url: "https://github.com/uuidna/qpu/blob/main/docs/cms.md"
og:image: "https://opengraph.githubassets.com/qpu/uuidna/qpu"
og:site_name: "@uuidna/qpu"
twitter:card: summary_large_image
twitter:title: "Payload & Cloudflare"
twitter:description: "Payload CMS on Workers in every combination, and the Payload readings the unit serves. 19 capabilities; 3 of 4 evidence predicates hold."
version: "1.0.1"
---
# Payload & Cloudflare

Payload CMS on Workers in every combination, and the Payload readings the unit serves.

| | |
|---|---|
| Capabilities | 19 |
| With an evidence predicate | 4 |
| Predicates that hold now | 3 |
| Live (need the network; checked by the live doors) | 0 |

| Capability | Kind | What it does | Evidence | Status |
|---|---|---|---|---|
| [`cloudflareCombinationOf`](../src/deployment/payload-cloudflare.ts#L62) | builder | Parse a combination key (runtime/db/storage/email/plugins) back into a combination. | — | — |
| [`cloudflareKeyOf`](../src/deployment/payload-cloudflare.ts#L54) | builder | A combination's canonical key: the axes in order, plugins sorted — what its content UUID is taken over. | — | — |
| [`cloudflarePayloadOf`](../src/deployment/payload-cloudflare.ts#L415) | builder | Generate one combination: payload.config.ts, wrangler.jsonc and dependencies, optionally carrying an app's own collections (CloudflareApp). | — | — |
| [`composeOf`](../src/deployment/payload-templates.ts#L147) | builder | docker-compose: the one service, built from the Dockerfile beside it, its port published as the boot listens. | — | — |
| [`dockerfileOf`](../src/deployment/payload-templates.ts#L106) | builder | The Dockerfile: a build stage that compiles (the version lock is the repository's gate, git and npm being outside the image), a runtime stage with only dist, production modules and what the package ships, run as its own user behind dumb-init at the path Alpine installs it, health being the boot's own answer. | — | — |
| [`kubernetesOf`](../src/deployment/payload-templates.ts#L168) | builder | Kubernetes: namespace, service account, deployment, service and autoscaler in one manifest, every port the boot's, every probe the boot's own answer, the replicas and bounds from the template's deployment config. | — | — |
| [`qpuFusionOf`](../src/quantum/processing/unit/index.ts#L11514) | builder | Fusion of catalogues, hosts, schemas, Payload, install and hologram readings over the fused capacity. | `qpuFusionHolds` | holds |
| [`qpuIntelligenceOf`](../src/quantum/processing/unit/index.ts#L11571) | builder | The 'intelligence' reading: the fusion test over free online research. | `qpuIntelligenceHolds` | holds |
| [`qpuPayloadFindOf`](../src/quantum/processing/unit/index.ts#L11305) | builder | One Payload collection's find tool, sealed against writes. | `qpuPayloadFindHolds` | checked on each call (needs inputs) |
| [`qpuPayloadMcpOf`](../src/quantum/processing/unit/index.ts#L11260) | builder | The Payload MCP the unit describes: collections, find-only tools, the database plugin and its write path. | `qpuPayloadMcpHolds` | holds |
| [`themeCssOf`](../src/deployment/payload-templates.ts#L75) | builder | The site's theme as the lattice gives it, every colour the reflection σ_t(L) = L + t(1 − 2L) of its light value: inks on the rays ladder (k/rays), surfaces a step below white on bits and faces, the primary at L = ½ — σ's fixed point, so it does not move between light and dark — with its hue folded from the host's name, the destructive hue σ's reflection of it on the circle, the radius ten sixteenths. | — | — |
| [`cloudflareCombinations`](../src/deployment/payload-cloudflare.ts#L434) | function | Every combination of the axes: runtimes × databases × storage × email × every subset of the plugins. | — | — |
| [`payloadTemplates`](../src/deployment/payload-templates.ts#L422) | function | A PayloadTemplates instance. | — | — |
| [`PayloadTemplates`](../src/deployment/payload-templates.ts#L246) | class | Deployment templates: four hardware modes (browser, standalone, docker, kubernetes) and the Cloudflare family (cloudflarePayload) for Next.js + Payload on Workers. | — | — |
| [`CLOUDFLARE_DATABASES`](../src/deployment/payload-cloudflare.ts#L16) | constant | qpu-raid and qpu-d1 are the QPU document database (MongoDB semantics) on native bindings: a MongoDB request on Workers is one of these. | — | — |
| [`CLOUDFLARE_EMAIL`](../src/deployment/payload-cloudflare.ts#L30) | constant | Email choices: Resend, or none. | — | — |
| [`CLOUDFLARE_PLUGINS`](../src/deployment/payload-cloudflare.ts#L37) | constant | The Payload plugins a combination can include. | — | — |
| [`CLOUDFLARE_RUNTIMES`](../src/deployment/payload-cloudflare.ts#L9) | constant | Next.js runtimes on Workers: vinext (Cloudflare's recommended path) and the OpenNext adapter. | — | — |
| [`CLOUDFLARE_STORAGE`](../src/deployment/payload-cloudflare.ts#L23) | constant | Upload storage choices: R2, S3, or none. | — | — |

Generated from the inline docs by `npm run docs`. Index: [docs](README.md).
