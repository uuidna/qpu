---
title: "Live science data"
description: "CERN Open Data, research APIs and citations read live with deadlines. 22 capabilities; 10 of 17 evidence predicates hold."
og:title: "Live science data — @uuidna/qpu"
og:description: "CERN Open Data, research APIs and citations read live with deadlines. 22 capabilities; 10 of 17 evidence predicates hold."
og:type: article
og:url: "https://github.com/uuidna/qpu/blob/main/docs/science.md"
og:image: "https://opengraph.githubassets.com/qpu/uuidna/qpu"
og:site_name: "@uuidna/qpu"
twitter:card: summary_large_image
twitter:title: "Live science data"
twitter:description: "CERN Open Data, research APIs and citations read live with deadlines. 22 capabilities; 10 of 17 evidence predicates hold."
version: "1.0.0"
---
# Live science data

CERN Open Data, research APIs and citations read live with deadlines.

| | |
|---|---|
| Capabilities | 22 |
| With an evidence predicate | 17 |
| Predicates that hold now | 10 |
| Live (need the network; checked by the live doors) | 7 |

| Capability | Kind | What it does | Evidence | Status |
|---|---|---|---|---|
| [`qpuCernCatalogsOf`](../src/quantum/processing/unit/index.ts#L11746) | builder | The CERN catalogues the unit reads (Open Data, LHC experiments), with their hosts and paths. | `qpuCernCatalogsHolds` | holds |
| [`qpuCernExperienceOf`](../src/quantum/processing/unit/index.ts#L12707) | builder | The live CERN reading, kept for one deadline window so a miss is not re-paid on every call. | `qpuCernExperienceHolds` | live (network) |
| [`qpuCernExperimentsOf`](../src/quantum/processing/unit/index.ts#L11769) | builder | LHC experiments seated on faces, with the views (LHC, Open Data) they share. | `qpuCernExperimentsHolds` | holds |
| [`qpuCernFetchOf`](../src/quantum/processing/unit/index.ts#L12039) | builder | Fetch one CMS Open Data record live and compare events, files, DOI and dates with the cern theorem. | `qpuCernFetchHolds` | live (network) |
| [`qpuCernLearnLiveOf`](../src/quantum/processing/unit/index.ts#L12578) | builder | The live CERN reading: every LHC and Open Data experiment's record total fetched under one deadline. | `qpuCernLearnLiveHolds` | live (network) |
| [`qpuCernLearnOf`](../src/quantum/processing/unit/index.ts#L11937) | builder | The offline CERN reading: experiments and catalogues as an occupancy lattice. | `qpuCernLearnHolds` | holds |
| [`qpuCernLiveOf`](../src/quantum/processing/unit/index.ts#L12626) | builder | The live CERN document: quoted records, projects and search, fetched under one deadline. | `qpuCernLiveHolds` | live (network) |
| [`qpuCernOf`](../src/quantum/processing/unit/index.ts#L12225) | builder | The CERN document: quoted records, catalogues, experiments and the occupancy lattice. | `qpuCernHolds` | holds |
| [`qpuCernProjectFetchOf`](../src/quantum/processing/unit/index.ts#L12148) | builder | Fetch one experiment's record total live from CERN Open Data. | `qpuCernProjectFetchHolds` | live (network) |
| [`qpuCernRecordsOf`](../src/quantum/processing/unit/index.ts#L11652) | builder | — | — | — |
| [`qpuCitationsLiveOf`](../src/quantum/processing/unit/index.ts#L10530) | builder | Resolve the corpus's DOIs through Crossref and check each title matches. | `qpuCitationsLiveHolds` | live (network) |
| [`qpuCitationsOf`](../src/quantum/processing/unit/index.ts#L10476) | builder | THE CITATIONS, AS IDENTIFIERS A MACHINE CAN RESOLVE RATHER THAN STRINGS A READER MIGHT. | `qpuCitationsHolds` | holds |
| [`qpuForeignReadsOf`](../src/quantum/processing/unit/index.ts#L143) | builder | How many times this process has read a host it does not own (CERN, Crossref, registries). | `qpuForeignReadsHolds` | holds |
| [`qpuResearchFetchOf`](../src/quantum/processing/unit/index.ts#L12903) | builder | Fetch a research API (INSPIRE, HEPData, Zenodo) live and count its hits. | `qpuResearchFetchHolds` | live (network) |
| [`qpuTeachingCensusOf`](../src/quantum/processing/unit/index.ts#L10951) | builder | THE WHOLE CENSUS, so "all entanglements" is a number and not a gesture. | `qpuTeachingCensusHolds` | holds |
| [`qpuTeachingPairsOf`](../src/quantum/processing/unit/index.ts#L9692) | builder | Teaching corpus crossed: subjects against domains, each pair entangled, application or undecided, with citations. | `qpuTeachingPairsHolds` | holds |
| [`qpuTeachingReadingOf`](../src/quantum/processing/unit/index.ts#L10998) | builder | THE EXPLANATION, GENERATED FROM THE EVIDENCE RATHER THAN WRITTEN BESIDE IT. | `qpuTeachingReadingHolds` | holds |
| [`qpuTeachingSeatingOf`](../src/quantum/processing/unit/index.ts#L10837) | builder | SEATED BY THE EVIDENCE, NOT BY THE AUTHOR'S ORDERING. | `qpuTeachingSeatingHolds` | holds |
| [`qpuCernCatalogsHold`](../src/quantum/processing/unit/index.ts#L11729) | function | THE CATALOGS ARE NOT THE FACES. | — | — |
| [`QPU_TEACHING_DOMAINS`](../src/quantum/processing/unit/index.ts#L9684) | constant | The distinct domains of the teaching corpus, sorted; the axis the corpus is crossed on. | — | — |
| [`QPU_TEACHING_SUBJECTS`](../src/quantum/processing/unit/index.ts#L9678) | constant | The corpus's own axes, named once: the combinatorial surface is built on these and the reading checks them. | — | — |
| [`QPU_TEACHINGS`](../src/quantum/processing/unit/index.ts#L9311) | constant | THE EVIDENCE. | — | — |

Generated from the inline docs by `npm run docs`. Index: [docs](README.md).
