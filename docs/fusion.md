---
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
version: "1.0.0"
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
| [`crossFormulaOf`](../src/mcp/cross-domain-formulas.ts#L34) | builder | Seal a cross formula: content UUID of {src, dst, formula}, holds (inputs in domain, value finite) and a quantum receipt in the cross stream. | — | — |
| [`domainPathOf`](../src/mcp/cross-domain-paths.ts#L27) | builder | Seal a multi-hop path: content UUID of {hops, formula} and a quantum receipt in the path stream. | — | — |
| [`pathHexOf`](../src/mcp/cross-domain-paths.ts#L141) | builder | The hex program that returns a named path. @wing fusion @kind function | — | — |
| [`qpuApisLiveOf`](../src/quantum/processing/unit/index.ts#L10378) | builder | The registry, the schemas and the methods, discovered live and bounded to `faces` schemas from an offset. | `qpuApisLiveHolds` | live (network) |
| [`qpuComposeLiveOf`](../src/quantum/processing/unit/index.ts#L10233) | builder | DISCOVERED AND CROSSED IN ONE CALL, so a door can carry the finding rather than the ingredients. | `qpuComposeLiveHolds` | live (network) |
| [`qpuComposeOf`](../src/quantum/processing/unit/index.ts#L10208) | builder | Cross API methods into compositions (entangled, application, undecided) joined on field shape UUIDs. | `qpuComposeHolds` | checked on each call (needs inputs) |
| [`qpuCrossOf`](../src/quantum/processing/unit/index.ts#L10588) | builder | The swap criterion over rows: a pair is entangled when each gives what the other takes, application when one way, undecided otherwise. | `qpuCrossHolds` | checked on each call (needs inputs) |
| [`qpuFuseOf`](../src/quantum/processing/unit/index.ts#L10112) | builder | Fuse API methods by an inverted field-UUID index: an edge is a giver and a taker of one field; edges carry direction, counts and the rarest field per direction; hubs ranked by giver x taker. | — | — |
| [`qpuGraphStateOf`](../src/quantum/processing/unit/index.ts#L10160) | builder | THE FUSED GRAPH IS A GRAPH STATE. | `qpuGraphStateHolds` | holds |
| [`qpuProbeableOf`](../src/quantum/processing/unit/index.ts#L10318) | builder | Probeable when nothing must be supplied and nothing is written: no path template, no required parameter. | `qpuProbeableHolds` | holds |
| [`qpuProbeLiveOf`](../src/quantum/processing/unit/index.ts#L10331) | builder | Probe discovered APIs live with argument-free GET and POST calls and report which answer. | `qpuProbeLiveHolds` | live (network) |
| [`qpuSchemaMethodsOf`](../src/quantum/processing/unit/index.ts#L10051) | builder | An OpenAPI document read as methods: what each one takes, and what it gives back. | `qpuSchemaMethodsHolds` | checked on each call (needs inputs) |
| [`crossDomainFormulas`](../src/mcp/cross-domain-formulas.ts#L172) | function | A CrossDomainFormulas instance. | — | — |
| [`crossDomainPaths`](../src/mcp/cross-domain-paths.ts#L135) | function | A CrossDomainPaths instance. | — | — |
| [`CrossDomainFormulas`](../src/mcp/cross-domain-formulas.ts#L54) | class | The ten named cross-domain bridges (each a CrossFormula) and allBridges(), their transforms over plain inputs. | — | — |
| [`CrossDomainPaths`](../src/mcp/cross-domain-paths.ts#L37) | class | The seven named multi-hop paths across domains, each with its hops, formula and transform. | — | — |

Generated from the inline docs by `npm run docs`. Index: [docs](README.md).
