---
title: "Presentation & discovery"
description: "Stylesheets, schemas, SEO zones, citation and the documents a reader or crawler sees. 14 capabilities; 14 of 14 evidence predicates hold."
og:title: "Presentation & discovery — @uuidna/qpu"
og:description: "Stylesheets, schemas, SEO zones, citation and the documents a reader or crawler sees. 14 capabilities; 14 of 14 evidence predicates hold."
og:type: article
og:url: "https://github.com/uuidna/qpu/blob/main/docs/presentation.md"
og:image: "https://opengraph.githubassets.com/qpu/uuidna/qpu"
og:site_name: "@uuidna/qpu"
twitter:card: summary_large_image
twitter:title: "Presentation & discovery"
twitter:description: "Stylesheets, schemas, SEO zones, citation and the documents a reader or crawler sees. 14 capabilities; 14 of 14 evidence predicates hold."
version: "1.0.0"
---
# Presentation & discovery

Stylesheets, schemas, SEO zones, citation and the documents a reader or crawler sees.

| | |
|---|---|
| Capabilities | 14 |
| With an evidence predicate | 14 |
| Predicates that hold now | 14 |
| Live (need the network; checked by the live doors) | 0 |

| Capability | Kind | What it does | Evidence | Status |
|---|---|---|---|---|
| [`qpuAccessOf`](../src/quantum/processing/unit/index.ts#L1114) | builder | Access keys (domain, occupancy) for every occupancy, with their fused names. | `qpuAccessHolds` | holds |
| [`qpuCiteOf`](../src/quantum/processing/unit/index.ts#L3141) | builder | How to cite the unit (MLA 8): DOI, concept DOI, ORCID, archived version and commit, served version, and whether they match. | `qpuCiteHolds` | holds |
| [`qpuCssOf`](../src/quantum/processing/unit/index.ts#L9751) | builder | The fused stylesheet the unit serves (qpu.css), with its size against the naive stylesheet. | `qpuCssHolds` | holds |
| [`qpuGenesisOf`](../src/quantum/processing/unit/index.ts#L819) | builder | The UI schema: shadcn card variants, sizes, states and themes seated on the lattice's faces and rays, served as data (no HTML). | `qpuGenesisHolds` | holds |
| [`qpuHologramOf`](../src/quantum/processing/unit/index.ts#L1140) | builder | The 'hologram' reading: the pentagram and access readings composed with the fused capacity and the STORAGE/BLOBS bindings. | `qpuHologramHolds` | holds |
| [`qpuPentagramOf`](../src/quantum/processing/unit/index.ts#L947) | builder | The occupancy pentagram: five occupancies x five skills joined in a single stroke of step 2. | `qpuPentagramHolds` | holds |
| [`qpuPresenceOf`](../src/quantum/processing/unit/index.ts#L4801) | builder | Presence of users per face (active, inactive, chatting) with starter templates, merged into storage. | `qpuPresenceHolds` | holds |
| [`qpuReflectOf`](../src/quantum/processing/unit/index.ts#L9966) | builder | Reflect a caller's text onto a face and its involution hop, with the stylesheet slots it occupies. | `qpuReflectHolds` | holds |
| [`qpuRobotsOf`](../src/quantum/processing/unit/index.ts#L11000) | builder | robots.txt for one first-party host — the zone's content-signal policy, and the one sitemap that host serves. | `qpuRobotsHolds` | holds |
| [`qpuSchemasOf`](../src/quantum/processing/unit/index.ts#L2535) | builder | The JSON-LD schemas the unit serves, mounted under storage, with their prefixes and context. | `qpuSchemasHolds` | holds |
| [`qpuSeoZoneOf`](../src/quantum/processing/unit/index.ts#L11130) | builder | SEO zone fields for each host: robots, sitemap and the zone's reserved labels. | `qpuSeoZoneHolds` | holds |
| [`qpuTenantZoneOf`](../src/quantum/processing/unit/index.ts#L1610) | builder | The tenant zone QPU serves and the labels in it that are never a tenant — one declaration, read by the router and by Payload (src/access.ts), never restated there. | `qpuTenantZoneHolds` | holds |
| [`qpuZoneHostOf`](../src/quantum/processing/unit/index.ts#L1587) | builder | The first-party host this request landed on, or undefined — and `qpu: false` is as good as absent here. | `qpuZoneHostHolds` | holds |
| [`qpuZoneOf`](../src/quantum/processing/unit/index.ts#L1553) | builder | The zone with each first-party host resolved from its label — the apex carries the empty label and is the zone. | `qpuZoneHolds` | holds |

Generated from the inline docs by `npm run docs`. Index: [docs](README.md).
