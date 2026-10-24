---
uuid: "836b0301-e194-17b1-9c3d-f1322c2f9a52"
title: "Live science data"
description: "CERN Open Data, research APIs and citations read live with deadlines. 21 capabilities; 8 of 17 evidence predicates hold."
og:title: "Live science data — @uuidna/qpu"
og:description: "CERN Open Data, research APIs and citations read live with deadlines. 21 capabilities; 8 of 17 evidence predicates hold."
og:type: article
og:url: "https://github.com/uuidna/qpu/blob/main/docs/science.md"
og:image: "https://opengraph.githubassets.com/qpu/uuidna/qpu"
og:site_name: "@uuidna/qpu"
twitter:card: summary_large_image
twitter:title: "Live science data"
twitter:description: "CERN Open Data, research APIs and citations read live with deadlines. 21 capabilities; 8 of 17 evidence predicates hold."
version: "1.4.0"
---
# Live science data

CERN Open Data, research APIs and citations read live with deadlines.

| | |
|---|---|
| Capabilities | 21 |
| With an evidence predicate | 17 |
| Predicates that hold now | 8 |
| Live (need the network; checked by the live doors) | 7 |

| Capability | Kind | What it does | Evidence | Status |
|---|---|---|---|---|
| [`cernCatalogsOf`](../src/quantum/processing/unit/index.ts#L8331) | builder | The CERN catalogues the unit reads (Open Data, LHC experiments), with their hosts and paths. | `cernCatalogsHolds` | holds |
| [`cernExperienceOf`](../src/quantum/processing/unit/index.ts#L9048) | builder | The live CERN reading, kept for one deadline window so a miss is not re-paid on every call. | `cernExperienceOf` | live (network) |
| [`cernExperimentsOf`](../src/quantum/processing/unit/index.ts#L8354) | builder | LHC experiments seated on faces, with the views (LHC, Open Data) they share. | `cernExperimentsOf` | **false** |
| [`cernFetchOf`](../src/quantum/processing/unit/index.ts#L8622) | builder | Fetch one CMS Open Data record live and compare events, files, DOI and dates with the cern theorem. | `cernFetchOf` | live (network) |
| [`cernLearnLiveOf`](../src/quantum/processing/unit/index.ts#L8921) | builder | The live CERN reading: every LHC and Open Data experiment's record total fetched under one deadline. | `cernLearnLiveOf` | live (network) |
| [`cernLearnOf`](../src/quantum/processing/unit/index.ts#L8521) | builder | The offline CERN reading: experiments and catalogues as an occupancy lattice. | `cernLearnOf` | **false** |
| [`cernLiveOf`](../src/quantum/processing/unit/index.ts#L8968) | builder | The live CERN document: quoted records, projects and search, fetched under one deadline. | `cernLiveOf` | live (network) |
| [`cernOf`](../src/quantum/processing/unit/index.ts#L8806) | builder | The CERN document: quoted records, catalogues, experiments and the occupancy lattice. | `cernHolds` | holds |
| [`cernProjectFetchOf`](../src/quantum/processing/unit/index.ts#L8730) | builder | Fetch one experiment's record total live from CERN Open Data. | `cernProjectFetchOf` | live (network) |
| [`citationsLiveOf`](../src/quantum/processing/unit/index.ts#L7598) | builder | Resolve the corpus's DOIs through Crossref and check each title matches. | `citationsLiveOf` | live (network) |
| [`citationsOf`](../src/quantum/processing/unit/index.ts#L7550) | builder | THE CITATIONS, AS IDENTIFIERS A MACHINE CAN RESOLVE RATHER THAN STRINGS A READER MIGHT. | `citationsHolds` | holds |
| [`foreignReadsOf`](../src/quantum/processing/unit/index.ts#L176) | builder | How many times this process has read a host it does not own (CERN, Crossref, registries). | `foreignReadsHolds` | holds |
| [`researchFetchOf`](../src/quantum/processing/unit/index.ts#L9238) | builder | Fetch a research API (INSPIRE, HEPData, Zenodo) live and count its hits. | `researchFetchOf` | live (network) |
| [`teachingCensusOf`](../src/quantum/processing/unit/index.ts#L7973) | builder | THE WHOLE CENSUS, so "all entanglements" is a number and not a gesture. | `teachingCensusHolds` | holds |
| [`teachingPairsOf`](../src/quantum/processing/unit/index.ts#L7047) | builder | Teaching corpus crossed: subjects against domains, each pair entangled, application or undecided, with citations. | `teachingPairsHolds` | holds |
| [`teachingReadingOf`](../src/quantum/processing/unit/index.ts#L8020) | builder | THE EXPLANATION, GENERATED FROM THE EVIDENCE RATHER THAN WRITTEN BESIDE IT. | `teachingReadingHolds` | holds |
| [`teachingSeatingOf`](../src/quantum/processing/unit/index.ts#L7859) | builder | SEATED BY THE EVIDENCE, NOT BY THE AUTHOR'S ORDERING. | `teachingSeatingHolds` | holds |
| [`cernCatalogsHold`](../src/quantum/processing/unit/index.ts#L8314) | function | THE CATALOGS ARE NOT THE FACES. | — | — |
| [`QPU_TEACHING_DOMAINS`](../src/quantum/processing/unit/index.ts#L7039) | constant | The distinct domains of the teaching corpus, sorted; the axis the corpus is crossed on. | — | — |
| [`QPU_TEACHING_SUBJECTS`](../src/quantum/processing/unit/index.ts#L7033) | constant | The corpus's own axes, named once: the combinatorial surface is built on these and the reading checks them. | — | — |
| [`QPU_TEACHINGS`](../src/quantum/processing/unit/index.ts#L6599) | constant | THE EVIDENCE. | — | — |

Generated from the inline docs by `npm run docs`. Index: [docs](README.md).
