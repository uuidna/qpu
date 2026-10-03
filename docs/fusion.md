---
uuid: "02b75686-f18f-8372-bf87-d8ca36f9a1ad"
title: "API fusion"
description: "Every API in a registry crossed on field UUIDs into compositions, formulas and a graph state. 16 capabilities; 2 of 8 evidence predicates hold."
og:title: "API fusion — @uuidna/qpu"
og:description: "Every API in a registry crossed on field UUIDs into compositions, formulas and a graph state. 16 capabilities; 2 of 8 evidence predicates hold."
og:type: article
og:url: "https://github.com/uuidna/qpu/blob/main/docs/fusion.md"
og:image: "https://opengraph.githubassets.com/qpu/uuidna/qpu"
og:site_name: "@uuidna/qpu"
twitter:card: summary_large_image
twitter:title: "API fusion"
twitter:description: "Every API in a registry crossed on field UUIDs into compositions, formulas and a graph state. 16 capabilities; 2 of 8 evidence predicates hold."
version: "1.0.1"
---
# API fusion

Every API in a registry crossed on field UUIDs into compositions, formulas and a graph state.

| | |
|---|---|
| Capabilities | 16 |
| With an evidence predicate | 8 |
| Predicates that hold now | 2 |
| Live (need the network; checked by the live doors) | 3 |

| Capability | Kind | What it does | Evidence | Status |
|---|---|---|---|---|
| [`crossFormulaOf`](../src/families/cross/index.ts#L37) | builder | Seal a cross formula: content UUID of {src, dst, formula}, holds (inputs in domain, value finite) and a quantum receipt in the cross stream. | — | — |
| [`domainPathOf`](../src/families/path/index.ts#L30) | builder | Seal a multi-hop path: content UUID of {hops, formula} and a quantum receipt in the path stream. | — | — |
| [`qpuApisLiveOf`](../src/quantum/processing/unit/index.ts#L8324) | builder | The registry, the schemas and the methods, discovered live and bounded to `faces` schemas from an offset. | `qpuApisLiveHolds` | live (network) |
| [`qpuComposeLiveOf`](../src/quantum/processing/unit/index.ts#L8179) | builder | DISCOVERED AND CROSSED IN ONE CALL, so a door can carry the finding rather than the ingredients. | `qpuComposeLiveHolds` | live (network) |
| [`qpuComposeOf`](../src/quantum/processing/unit/index.ts#L8154) | builder | Cross API methods into compositions (entangled, application, undecided) joined on field shape UUIDs. | `qpuComposeHolds` | checked on each call (needs inputs) |
| [`qpuCrossOf`](../src/quantum/processing/unit/index.ts#L8534) | builder | The swap criterion over rows: a pair is entangled when each gives what the other takes, application when one way, undecided otherwise. | `qpuCrossHolds` | checked on each call (needs inputs) |
| [`qpuFuseOf`](../src/quantum/processing/unit/index.ts#L8058) | builder | Fuse API methods by an inverted field-UUID index: an edge is a giver and a taker of one field; edges carry direction, counts and the rarest field per direction; hubs ranked by giver x taker. | — | — |
| [`qpuGraphStateOf`](../src/quantum/processing/unit/index.ts#L8106) | builder | THE FUSED GRAPH IS A GRAPH STATE. | `qpuGraphStateHolds` | holds |
| [`qpuMcpFusedOf`](../src/quantum/processing/unit/index.ts#L530) | builder | Every fused tool with its contract: the catalogue a client reads to call what tools/list does not show. | — | — |
| [`qpuProbeableOf`](../src/quantum/processing/unit/index.ts#L8264) | builder | Probeable when nothing must be supplied and nothing is written: no path template, no required parameter. | `qpuProbeableHolds` | holds |
| [`qpuProbeLiveOf`](../src/quantum/processing/unit/index.ts#L8277) | builder | Probe discovered APIs live with argument-free GET and POST calls and report which answer. | `qpuProbeLiveHolds` | live (network) |
| [`qpuSchemaMethodsOf`](../src/quantum/processing/unit/index.ts#L7997) | builder | An OpenAPI document read as methods: what each one takes, and what it gives back. | `qpuSchemaMethodsHolds` | checked on each call (needs inputs) |
| [`crossDomainFormulas`](../src/families/cross/index.ts#L175) | function | A CrossDomainFormulas instance. | — | — |
| [`crossDomainPaths`](../src/families/path/index.ts#L145) | function | A CrossDomainPaths instance. | — | — |
| [`CrossDomainFormulas`](../src/families/cross/index.ts#L57) | class | The ten named cross-domain bridges (each a CrossFormula) and allBridges(), their transforms over plain inputs. | — | — |
| [`CrossDomainPaths`](../src/families/path/index.ts#L40) | class | The seven named multi-hop paths across domains, each with its hops, formula and transform. | — | — |

Generated from the inline docs by `npm run docs`. Index: [docs](README.md).
