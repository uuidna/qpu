---
uuid: "73bd111d-62b5-6d2a-b040-e339ad004895"
title: "Presentation & discovery"
description: "Stylesheets, schemas, SEO zones, citation and the documents a reader or crawler sees. 16 capabilities; 14 of 14 evidence predicates hold."
og:title: "Presentation & discovery — @uuidna/qpu"
og:description: "Stylesheets, schemas, SEO zones, citation and the documents a reader or crawler sees. 16 capabilities; 14 of 14 evidence predicates hold."
og:type: article
og:url: "https://github.com/uuidna/qpu/blob/main/docs/presentation.md"
og:image: "https://opengraph.githubassets.com/qpu/uuidna/qpu"
og:site_name: "@uuidna/qpu"
twitter:card: summary_large_image
twitter:title: "Presentation & discovery"
twitter:description: "Stylesheets, schemas, SEO zones, citation and the documents a reader or crawler sees. 16 capabilities; 14 of 14 evidence predicates hold."
version: "1.4.0"
---
# Presentation & discovery

Stylesheets, schemas, SEO zones, citation and the documents a reader or crawler sees.

| | |
|---|---|
| Capabilities | 16 |
| With an evidence predicate | 14 |
| Predicates that hold now | 14 |
| Live (need the network; checked by the live doors) | 0 |

| Capability | Kind | What it does | Evidence | Status |
|---|---|---|---|---|
| [`accessOf`](../src/quantum/processing/unit/presentation.ts#L213) | builder | Access keys (domain, occupancy) for every occupancy, with their fused names. | `accessHolds` | holds |
| [`combinatoricsWindowOf`](../src/quantum/processing/unit/presentation.ts#L947) | builder | One window of the combinatorics family on a UUID's own dimensions. | — | — |
| [`cssOf`](../src/quantum/processing/unit/presentation.ts#L705) | builder | The fused stylesheet the unit serves (qpu.css), with its size against the naive stylesheet. | `cssHolds` | holds |
| [`genesisOf`](../src/quantum/processing/unit/presentation.ts#L46) | builder | The UI schema: shadcn card variants, sizes, states and themes seated on the lattice's faces and rays, served as data (no HTML). | `genesisHolds` | holds |
| [`pentagramOf`](../src/quantum/processing/unit/presentation.ts#L166) | builder | The occupancy pentagram: five occupancies x five skills joined in a single stroke of step 2. | `pentagramHolds` | holds |
| [`presenceOf`](../src/quantum/processing/unit/presentation.ts#L584) | builder | Presence of users per face (active, inactive, chatting) with starter templates, merged into storage. | `presenceHolds` | holds |
| [`qpuCiteOf`](../src/quantum/processing/unit/presentation.ts#L434) | builder | How to cite the unit (MLA 8): DOI, concept DOI, ORCID, archived version and commit, served version, and whether they match. | `citeHolds` | holds |
| [`qpuHologramOf`](../src/quantum/processing/unit/presentation.ts#L231) | builder | The 'hologram' reading: the pentagram and access readings composed with the fused capacity and the STORAGE/BLOBS bindings. | `hologramHolds` | holds |
| [`qpuPageOf`](../src/quantum/processing/unit/presentation.ts#L980) | builder | A door's JSON-LD reading rendered as one crawlable HTML document: the SEO head a search engine and a social card read (title, meta description, canonical, Open Graph, Twitter, robots), a visible <h1> and lede, the door's own API links for crawl depth, the unit's stylesheet inline, and the full reading embedded as application/ld+json so the structured data travels with the page. | — | — |
| [`qpuZoneOf`](../src/quantum/processing/unit/presentation.ts#L278) | builder | The zone with each first-party host resolved from its label — the apex carries the empty label and is the zone. | `zoneHolds` | holds |
| [`reflectOf`](../src/quantum/processing/unit/presentation.ts#L905) | builder | Reflect a caller's text onto a face and its involution hop, with the stylesheet slots it occupies. | `reflectHolds` | holds |
| [`robotsOf`](../src/quantum/processing/unit/presentation.ts#L1066) | builder | robots.txt for one first-party host — the zone's content-signal policy, and the one sitemap that host serves. | `robotsHolds` | holds |
| [`schemasOf`](../src/quantum/processing/unit/presentation.ts#L320) | builder | The JSON-LD schemas the unit serves, mounted under storage, with their prefixes and context. | `schemasHolds` | holds |
| [`seoZoneOf`](../src/quantum/processing/unit/presentation.ts#L1094) | builder | SEO zone fields for each host: robots, sitemap and the zone's reserved labels. | `seoZoneHolds` | holds |
| [`tenantZoneOf`](../src/quantum/processing/unit/presentation.ts#L308) | builder | The tenant zone QPU serves and the labels in it that are never a tenant — one declaration, read by the router and by Payload (src/access.ts), never restated there. | `tenantZoneHolds` | holds |
| [`zoneHostOf`](../src/quantum/processing/unit/presentation.ts#L299) | builder | The first-party host this request landed on, or undefined — and `qpu: false` is as good as absent here. | `zoneHostHolds` | holds |

Generated from the inline docs by `npm run docs`. Index: [docs](README.md).
