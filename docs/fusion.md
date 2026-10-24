---
uuid: "ba39a098-89f6-8fc3-82a1-24a31d49a90e"
title: "API fusion"
description: "Every API in a registry crossed on field UUIDs into compositions, formulas and a graph state. 18 capabilities; 5 of 11 evidence predicates hold."
og:title: "API fusion — @uuidna/qpu"
og:description: "Every API in a registry crossed on field UUIDs into compositions, formulas and a graph state. 18 capabilities; 5 of 11 evidence predicates hold."
og:type: article
og:url: "https://github.com/uuidna/qpu/blob/main/docs/fusion.md"
og:image: "https://opengraph.githubassets.com/qpu/uuidna/qpu"
og:site_name: "@uuidna/qpu"
twitter:card: summary_large_image
twitter:title: "API fusion"
twitter:description: "Every API in a registry crossed on field UUIDs into compositions, formulas and a graph state. 18 capabilities; 5 of 11 evidence predicates hold."
version: "1.4.0"
---
# API fusion

Every API in a registry crossed on field UUIDs into compositions, formulas and a graph state.

| | |
|---|---|
| Capabilities | 18 |
| With an evidence predicate | 11 |
| Predicates that hold now | 5 |
| Live (need the network; checked by the live doors) | 3 |

| Capability | Kind | What it does | Evidence | Status |
|---|---|---|---|---|
| [`apisLiveOf`](../src/quantum/processing/unit/fuse.ts#L251) | builder | The registry, the schemas and the methods, discovered live and bounded to `faces` schemas from an offset. | `apisLiveOf` | live (network) |
| [`composeLiveOf`](../src/quantum/processing/unit/fuse.ts#L166) | builder | DISCOVERED AND CROSSED IN ONE CALL, so a door can carry the finding rather than the ingredients. | `composeLiveOf` | live (network) |
| [`crossDiscoverSchemaOf`](../src/families/cross/index.ts#L306) | builder | ORGANISE THE DISCOVERED RELATIONS AS ONE SCHEMA.ORG SCHEMA. | `crossDiscoverSchemaHolds` | holds |
| [`crossOf`](../src/quantum/processing/unit/fuse.ts#L303) | builder | The swap criterion over rows: a pair is entangled when each gives what the other takes, application when one way, undecided otherwise. | `qpuCrossHolds` | **false** |
| [`crossSchemaOf`](../src/families/cross/index.ts#L227) | builder | ORGANISE A FAMILY AS A SCHEMA.ORG SCHEMA, ADDRESSED BY THE FULL UUID PROGRAMMABLE CAPACITY. | `crossSchemaHolds` | holds |
| [`crossSchemasOf`](../src/families/cross/index.ts#L268) | builder | ORGANISE ALL FAMILIES AS ONE SCHEMA.ORG CATALOG. | `crossSchemasHolds` | holds |
| [`domainPathOf`](../src/families/path/index.ts#L38) | builder | Seal a multi-hop path: content UUID of {hops, formula} and a quantum receipt in the path stream. | — | — |
| [`fuseOf`](../src/quantum/processing/unit/fuse.ts#L61) | builder | Fuse API methods by an inverted field-UUID index: an edge is a giver and a taker of one field; edges carry direction, counts and the rarest field per direction; hubs ranked by giver x taker. | — | — |
| [`graphStateOf`](../src/quantum/processing/unit/fuse.ts#L109) | builder | THE FUSED GRAPH IS A GRAPH STATE. | `graphStateHolds` | holds |
| [`mcpFusedOf`](../src/quantum/processing/unit/index.ts#L534) | builder | Every fused tool with its contract: the catalogue a client reads to call what tools/list does not show. | — | — |
| [`probeableOf`](../src/quantum/processing/unit/fuse.ts#L198) | builder | Probeable when nothing must be supplied and nothing is written: no path template, no required parameter. | `probeableHolds` | holds |
| [`probeLiveOf`](../src/quantum/processing/unit/fuse.ts#L207) | builder | Probe discovered APIs live with argument-free GET and POST calls and report which answer. | `probeLiveHolds` | live (network) |
| [`qpuComposeOf`](../src/quantum/processing/unit/fuse.ts#L143) | builder | Cross API methods into compositions (entangled, application, undecided) joined on field shape UUIDs. | `composeHolds` | **false** |
| [`schemaMethodsOf`](../src/quantum/processing/unit/fuse.ts#L30) | builder | An OpenAPI document read as methods: what each one takes, and what it gives back. | `schemaMethodsHolds` | checked on each call (needs inputs) |
| [`crossDomainFormulas`](../src/families/cross/index.ts#L206) | function | A CrossDomainFormulas instance. | — | — |
| [`crossDomainPaths`](../src/families/path/index.ts#L153) | function | A CrossDomainPaths instance. | — | — |
| [`CrossDomainFormulas`](../src/families/cross/index.ts#L88) | class | The ten named cross-domain bridges (each a CrossFormula) and allBridges(), their transforms over plain inputs. | — | — |
| [`CrossDomainPaths`](../src/families/path/index.ts#L48) | class | The seven named multi-hop paths across domains, each with its hops, formula and transform. | — | — |

Generated from the inline docs by `npm run docs`. Index: [docs](README.md).
