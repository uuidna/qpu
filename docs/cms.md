---
uuid: "f600c607-276c-1485-a589-a22132a0f312"
title: "Payload & Cloudflare"
description: "Payload CMS on Workers in every combination, and the Payload readings the unit serves. 24 capabilities; 3 of 4 evidence predicates hold."
og:title: "Payload & Cloudflare — @uuidna/qpu"
og:description: "Payload CMS on Workers in every combination, and the Payload readings the unit serves. 24 capabilities; 3 of 4 evidence predicates hold."
og:type: article
og:url: "https://github.com/uuidna/qpu/blob/main/docs/cms.md"
og:image: "https://opengraph.githubassets.com/qpu/uuidna/qpu"
og:site_name: "@uuidna/qpu"
twitter:card: summary_large_image
twitter:title: "Payload & Cloudflare"
twitter:description: "Payload CMS on Workers in every combination, and the Payload readings the unit serves. 24 capabilities; 3 of 4 evidence predicates hold."
version: "1.1.0"
---
# Payload & Cloudflare

Payload CMS on Workers in every combination, and the Payload readings the unit serves.

| | |
|---|---|
| Capabilities | 24 |
| With an evidence predicate | 4 |
| Predicates that hold now | 3 |
| Live (need the network; checked by the live doors) | 0 |

| Capability | Kind | What it does | Evidence | Status |
|---|---|---|---|---|
| [`cloudflareCombinationOf`](../src/deployment/payload-cloudflare.ts#L185) | builder | Parse a combination key (runtime/db/storage/email/plugins) back into a combination. | — | — |
| [`cloudflareKeyOf`](../src/deployment/payload-cloudflare.ts#L177) | builder | A combination's canonical key: the axes in order, plugins sorted — what its content UUID is taken over. | — | — |
| [`cloudflarePayloadOf`](../src/deployment/payload-cloudflare.ts#L678) | builder | Generate one combination: payload.config.ts, wrangler.jsonc and dependencies, optionally carrying an app's own collections (CloudflareApp). | — | — |
| [`cloudflareRaidAdaptersOf`](../src/deployment/payload-cloudflare.ts#L154) | builder | Replace checklist: which binding/package to swap for a combination's db + storage. | — | — |
| [`composeOf`](../src/deployment/payload-templates.ts#L164) | builder | docker-compose: the one service, built from the Dockerfile beside it, its port published as the boot listens. | — | — |
| [`dockerfileOf`](../src/deployment/payload-templates.ts#L123) | builder | The Dockerfile: a build stage that compiles (the version lock is the repository's gate, git and npm being outside the image), a runtime stage with only dist, production modules and what the package ships, run as its own user behind dumb-init at the path Alpine installs it, health being the boot's own answer. | — | — |
| [`kubernetesOf`](../src/deployment/payload-templates.ts#L185) | builder | Kubernetes: namespace, service account, deployment, service and autoscaler in one manifest, every port the boot's, every probe the boot's own answer, the replicas and bounds from the template's deployment config. | — | — |
| [`qpuFusionOf`](../src/quantum/processing/unit/cms.ts#L112) | builder | Fusion of catalogues, hosts, schemas, Payload, install and hologram readings over the fused capacity. | `qpuFusionHolds` | holds |
| [`qpuIntelligenceOf`](../src/quantum/processing/unit/cms.ts#L168) | builder | The 'intelligence' reading: the fusion test over free online research. | `qpuIntelligenceHolds` | holds |
| [`qpuPayloadFindOf`](../src/quantum/processing/unit/cms.ts#L72) | builder | One Payload collection's find tool, sealed against writes. | `qpuPayloadFindHolds` | checked on each call (needs inputs) |
| [`qpuPayloadMcpOf`](../src/quantum/processing/unit/cms.ts#L28) | builder | The Payload MCP the unit describes: collections, find-only tools, the database plugin and its write path. | `qpuPayloadMcpHolds` | holds |
| [`themeCssOf`](../src/deployment/payload-templates.ts#L92) | builder | The site's theme as the lattice gives it, every colour the reflection σ_t(L) = L + t(1 − 2L) of its light value: inks on the rays ladder (k/rays), surfaces a step below white on bits and faces, the primary at L = ½ — σ's fixed point, so it does not move between light and dark — with its hue folded from the host's name, the destructive hue σ's reflection of it on the circle, the radius ten sixteenths. | — | — |
| [`cloudflareCombinations`](../src/deployment/payload-cloudflare.ts#L697) | function | Every combination of the axes: runtimes × databases × storage × email × every subset of the plugins. | — | — |
| [`payloadTemplates`](../src/deployment/payload-templates.ts#L441) | function | A PayloadTemplates instance. | — | — |
| [`PayloadTemplates`](../src/deployment/payload-templates.ts#L263) | class | Deployment templates: four hardware modes (browser, standalone, docker, kubernetes) and the Cloudflare family (cloudflarePayload) for Next.js + Payload on Workers. | — | — |
| [`CLOUDFLARE_DATABASES`](../src/deployment/payload-cloudflare.ts#L16) | constant | qpu-raid and qpu-d1 are the QPU document database (MongoDB semantics) on native bindings: a MongoDB request on Workers is one of these. | — | — |
| [`CLOUDFLARE_DB_ADAPTERS`](../src/deployment/payload-cloudflare.ts#L32) | constant | RAID-native DB adapters on the combination `db` axis. | — | — |
| [`CLOUDFLARE_EMAIL`](../src/deployment/payload-cloudflare.ts#L118) | constant | Email choices: Resend, or none. | — | — |
| [`CLOUDFLARE_FRONTENDS`](../src/deployment/payload-cloudflare.ts#L135) | constant | The frontend a combination delivers over the same Payload backend — the configs are frontend-agnostic. `next` is the React app; `shadcn` adds Tailwind and shadcn/ui to it; `pwa` adds an installable web-app manifest and service worker; `vitepress` delivers an alternative static docs frontend that reads the same Payload REST API. | — | — |
| [`CLOUDFLARE_PLUGINS`](../src/deployment/payload-cloudflare.ts#L125) | constant | The Payload plugins a combination can include. | — | — |
| [`CLOUDFLARE_RUNTIMES`](../src/deployment/payload-cloudflare.ts#L9) | constant | Next.js runtimes on Workers: vinext (Cloudflare's recommended path) and the OpenNext adapter. | — | — |
| [`CLOUDFLARE_STORAGE`](../src/deployment/payload-cloudflare.ts#L23) | constant | Upload storage choices: R2, S3, or none. | — | — |
| [`CLOUDFLARE_STORAGE_ADAPTERS`](../src/deployment/payload-cloudflare.ts#L80) | constant | Upload storage adapters on the combination `storage` axis (Payload 4 `storage: []`). | — | — |
| [`PAYLOAD_WEBSITE_CLONE`](../src/deployment/payload-cloudflare.ts#L93) | constant | Clone path for Payload CMS website, then QPU does the rest. | — | — |

Generated from the inline docs by `npm run docs`. Index: [docs](README.md).
