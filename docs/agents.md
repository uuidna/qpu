---
title: "MCP & agents"
description: "The MCP server, its tools and man pages, the sandbox, training and competition doors. 76 capabilities; 45 of 54 evidence predicates hold."
og:title: "MCP & agents — @uuidna/qpu"
og:description: "The MCP server, its tools and man pages, the sandbox, training and competition doors. 76 capabilities; 45 of 54 evidence predicates hold."
og:type: article
og:url: "https://github.com/uuidna/qpu/blob/main/docs/agents.md"
og:image: "https://opengraph.githubassets.com/qpu/uuidna/qpu"
og:site_name: "@uuidna/qpu"
twitter:card: summary_large_image
twitter:title: "MCP & agents"
twitter:description: "The MCP server, its tools and man pages, the sandbox, training and competition doors. 76 capabilities; 45 of 54 evidence predicates hold."
version: "1.0.0"
---
# MCP & agents

The MCP server, its tools and man pages, the sandbox, training and competition doors.

| | |
|---|---|
| Capabilities | 76 |
| With an evidence predicate | 54 |
| Predicates that hold now | 45 |
| Live (need the network; checked by the live doors) | 2 |

| Capability | Kind | What it does | Evidence | Status |
|---|---|---|---|---|
| [`cryptoClaimOf`](../src/quantum/processing/unit/index.ts#L3825) | builder | The crypto claim READ from the run: the split identity holds and secrecy does not. | — | — |
| [`mintOf`](../src/quantum/processing/unit/index.ts#L273) | builder | The lattice's doubling, exported so nothing has to re-implement it. | — | — |
| [`qpuAlpineOf`](../src/quantum/processing/unit/index.ts#L1630) | builder | Native Alpine Linux storage. musl. busybox. overlayfs — KV upper, R2 lower, KV work. | `qpuAlpineHolds` | holds |
| [`qpuCallUuidOf`](../src/quantum/processing/unit/index.ts#L9870) | builder | qpuCallUuidOf(door, left, right) → the address of that combination, as an RFC 9562 v8 UUID. | `qpuCallUuidHolds` | holds |
| [`qpuClayOf`](../src/quantum/processing/unit/index.ts#L721) | builder | 2×7 coins = 1+6 coils = clay. | `qpuClayHolds` | holds |
| [`qpuCoilEfficiencyOf`](../src/quantum/processing/unit/index.ts#L1692) | builder | Measure coil efficiency in RAID clusters. | `qpuCoilEfficiencyHolds` | holds |
| [`qpuCoilOf`](../src/quantum/processing/unit/index.ts#L573) | builder | Two coins make a coil. | `qpuCoilHolds` | holds |
| [`qpuCombinatorialDoorsOf`](../src/quantum/processing/unit/index.ts#L9829) | builder | The door table, with collisions RECOMPUTED rather than assumed — two names can fold to one hex. | `qpuCombinatorialDoorsHolds` | holds |
| [`qpuCompeteLiveOf`](../src/quantum/processing/unit/index.ts#L12749) | builder | qpu_compete with live CERN occupancy. | `qpuCompeteLiveHolds` | live (network) |
| [`qpuCompeteOf`](../src/quantum/processing/unit/index.ts#L11219) | builder | The read team against the call team on quality, speed and security per token; the winner calls qpu_prove. | `qpuCompeteHolds` | holds |
| [`qpuDevelopOf`](../src/quantum/processing/unit/index.ts#L14611) | builder | The develop reading: source, host, tools, API and integrity, for contributors. | `qpuDevelopHolds` | holds |
| [`qpuDocsOf`](../src/quantum/processing/unit/index.ts#L4716) | builder | The unit's inline guide: abstract, API rows, formulas and the learning ladder, as one document. | `qpuDocsHolds` | holds |
| [`qpuDryOf`](../src/quantum/processing/unit/index.ts#L1032) | builder | Coordinated dry-clean: two teams, occupancy pentagram, genesis coins. | `qpuDryHolds` | holds |
| [`qpuEfficiencyOf`](../src/quantum/processing/unit/index.ts#L5427) | builder | Token efficiency of each door: bytes and tokens to read the tree versus to call the tool. | `qpuEfficiencyHolds` | holds |
| [`qpuFollowOf`](../src/quantum/processing/unit/index.ts#L953) | builder | theorem follow_the_coins | `qpuFollowHolds` | holds |
| [`qpuForgeOf`](../src/quantum/processing/unit/index.ts#L8815) | builder | Forge a tool from a sealed op tree; { name, run, args } forges and evaluates in one call, { uuid, args } runs a forged tool by its content UUID. | `qpuForgeHolds` | holds |
| [`qpuGlossaryOf`](../src/quantum/processing/unit/index.ts#L4789) | builder | WHAT THE WORDS MEAN, SERVED BESIDE THEM. `holds` is said of every record and means that the record is self-consistent and recomputes to itself; it is not a claim that the test the record describes passed. | — | — |
| [`qpuHarnessesOf`](../src/quantum/processing/unit/index.ts#L13011) | builder | INTEGRATE IN ANY HARNESS (the captain, 2026-09-12). | `qpuHarnessesHolds` | holds |
| [`qpuHostsOf`](../src/quantum/processing/unit/index.ts#L12918) | builder | MCP hosts the unit is reachable from: fourteen agent harnesses and fourteen LLM clients, one per face. | `qpuHostsHolds` | holds |
| [`qpuHybridOf`](../src/quantum/processing/unit/index.ts#L1398) | builder | Measure hybrid storage speed and cost. | `qpuHybridHolds` | holds |
| [`qpuInstallManifestOf`](../src/quantum/processing/unit/index.ts#L13326) | builder | install.json, served and written from one function so host and file agree. | `qpuInstallManifestHolds` | holds |
| [`qpuInstallOf`](../src/quantum/processing/unit/index.ts#L13883) | builder | Interactive install: steps, choices per occupancy and the combinations they make. | `qpuInstallHolds` | holds |
| [`qpuManOf`](../src/quantum/processing/unit/index.ts#L5107) | builder | A tool's man page (NAME, SYNOPSIS, DESCRIPTION, SEE ALSO) for the /mcp door. | `qpuManHolds` | checked on each call (needs inputs) |
| [`qpuMcpCallOf`](../src/quantum/processing/unit/index.ts#L14419) | builder | Dispatch one MCP tools/call by name with arguments and shape the reply for MCP clients. | — | — |
| [`qpuMcpDiscoverOf`](../src/quantum/processing/unit/index.ts#L13043) | builder | MCP discovery reply: protocol version, capabilities, tools, server info, instructions and install entries. | `qpuMcpDiscoverHolds` | checked on each call (needs inputs) |
| [`qpuMcpOf`](../src/quantum/processing/unit/index.ts#L14334) | builder | The MCP catalogue at /mcp: tools, cybersecurity tools, capacity and provider as one JSON-LD WebAPI. | `qpuMcpHolds` | holds |
| [`qpuMcpShownOf`](../src/quantum/processing/unit/index.ts#L5182) | builder | THE REPLY ON THE WIRE, ONCE AS TEXT AND ONCE AS STRUCTURE. | `qpuMcpShownHolds` | checked on each call (needs inputs) |
| [`qpuMcpToolsListOf`](../src/quantum/processing/unit/index.ts#L14314) | builder | THE CONNECT BILL (the captain, 2026-09-12: "minimise bills of any kind"). tools/list is paid by every client on every connect, in context tokens: the sixteen output schemas were 34,232 of its 44,197 bytes — three quarters of the bill for a document a client validates a reply against at most once. | — | — |
| [`qpuMintScopeOpenOf`](../src/quantum/processing/unit/index.ts#L178) | builder | Start a fresh scope chain and answer the one just closed, so a caller can bracket a region and fold only it. | `qpuMintScopeOpenHolds` | holds |
| [`qpuMixedOf`](../src/quantum/processing/unit/index.ts#L10730) | builder | The domains crossed against each other, as unordered pairs of the vocabulary the experiments name. | `qpuMixedHolds` | holds |
| [`qpuMountsOf`](../src/quantum/processing/unit/index.ts#L13365) | builder | Every mount this unit offers on the host that asked, plus the zone's other MCP, named and not claimed. | `qpuMountsHolds` | holds |
| [`qpuNatureOf`](../src/quantum/processing/unit/index.ts#L10758) | builder | IS EVERYTHING ENTANGLED BY NATURE? — the claim, stated precisely enough to be wrong. | `qpuNatureHolds` | holds |
| [`qpuNetworkMcpOf`](../src/quantum/processing/unit/index.ts#L7946) | builder | The network sub-server's catalogue. | `qpuNetworkMcpHolds` | holds |
| [`qpuNetworkToolsOf`](../src/quantum/processing/unit/index.ts#L7820) | builder | The network MCP tools (send, receive, fetch on the named host) for channels in memory. | — | — |
| [`qpuNextOf`](../src/quantum/processing/unit/index.ts#L675) | builder | Next is the double. | `qpuNextHolds` | holds |
| [`qpuOccupantOf`](../src/quantum/processing/unit/index.ts#L13209) | builder | Which seat occupies the unit for a referrer, and why. | `qpuOccupantHolds` | holds |
| [`qpuOutputSchemaOf`](../src/quantum/processing/unit/index.ts#L5130) | builder | A JSON Schema derived from a tool's own replies: properties typed from the samples, required = keys present in every sample. | — | — |
| [`qpuPayloadPluginOf`](../src/quantum/processing/unit/index.ts#L13699) | builder | Payload extends like a plugin. | `qpuPayloadPluginHolds` | holds |
| [`qpuPlanesOf`](../src/quantum/processing/unit/index.ts#L5676) | builder | PLANES (the captain, 2026-09-12). theorem planes: plane = coins·coins·rays is less than mintOf(rays + seed), and coins·rays = faces. | `qpuPlanesHolds` | holds |
| [`qpuPriorArtOf`](../src/quantum/processing/unit/index.ts#L13143) | builder | Prior-art references the router cites, each with its kind (reference, vector, device). | `qpuPriorArtHolds` | holds |
| [`qpuReadmeOf`](../src/quantum/processing/unit/index.ts#L14732) | builder | THE README IS THE npm PAGE. | `qpuReadmeHolds` | holds |
| [`qpuRouterOf`](../src/quantum/processing/unit/index.ts#L13232) | builder | Route a referrer and path to a seat and door. | `qpuRouterHolds` | holds |
| [`qpuSandboxDurabilityOf`](../src/quantum/processing/unit/index.ts#L8915) | builder | Sandbox durability: rounds of put/get, fs and net shims and worker isolation, each checked to persist in memory and stay isolated. | `qpuSandboxDurabilityHolds` | holds |
| [`qpuSandboxEpochOf`](../src/quantum/processing/unit/index.ts#L8618) | builder | The sandbox's write epoch: advances when a forge changes a tool, so memoised readings of the sandbox refresh. | `qpuSandboxEpochHolds` | holds |
| [`qpuSandboxOf`](../src/quantum/processing/unit/index.ts#L8721) | builder | The in-memory sandbox census: ops, host shims (all in memory), heap, forged tools; nothing touches disk, network or eval. | `qpuSandboxHolds` | holds |
| [`qpuSandboxRunOf`](../src/quantum/processing/unit/index.ts#L8784) | builder | Run a sandbox tool by name with arguments; the run is a quantum receipt in the sandbox stream. | `qpuSandboxRunHolds` | checked on each call (needs inputs) |
| [`qpuSeatOf`](../src/quantum/processing/unit/index.ts#L13273) | builder | The seat record: how to install and run the unit (command, packages, Cloudflare button). | `qpuSeatHolds` | holds |
| [`qpuSeatsAvailableOf`](../src/quantum/processing/unit/index.ts#L13162) | builder | THE UNIT AS A ROUTER OF REFERRERS (the captain, 2026-09-13: "QPU is basically intelligent router of referrers", "intelligence decides lean where processes is computed in realtime"). | `qpuSeatsAvailableHolds` | holds |
| [`qpuSeoOf`](../src/quantum/processing/unit/index.ts#L13613) | builder | The reading a caller can check: what this unit serves for one host, and the canonical door it points every host at. | `qpuSeoHolds` | holds |
| [`qpuServerMcpOf`](../src/quantum/processing/unit/index.ts#L8153) | builder | The server sub-server's catalogue: eight tools, the job queue and the backend. | `qpuServerMcpHolds` | holds |
| [`qpuServerSubmitOf`](../src/quantum/processing/unit/index.ts#L8004) | builder | Submit a job to the server: runs it on the exact computer and returns the result inline (jobs are not stored). | `qpuServerSubmitHolds` | holds |
| [`qpuServerToolsOf`](../src/quantum/processing/unit/index.ts#L8052) | builder | The server MCP tools (submit, queue, result, backends and the rest) for jobs on the exact computer. | — | — |
| [`qpuShorOf`](../src/quantum/processing/unit/index.ts#L2495) | builder | Shor on the sparse exact state vector. | `qpuShorHolds` | holds |
| [`qpuShorTryOf`](../src/quantum/processing/unit/index.ts#L2482) | builder | Shor as a caller asked for it: the run on their n and a, whatever they are. | `qpuShorTryHolds` | checked on each call (needs inputs) |
| [`qpuSitemapOf`](../src/quantum/processing/unit/index.ts#L13567) | builder | sitemap.xml for one first-party host — only URLs on that host, because a crawler ignores the rest. | `qpuSitemapHolds` | holds |
| [`qpuSpecServerOf`](../src/quantum/processing/unit/index.ts#L10299) | builder | The server a document declares, which is where its methods actually live. | `qpuSpecServerHolds` | holds |
| [`qpuStandardsOf`](../src/quantum/processing/unit/index.ts#L9607) | builder | WHAT THIS TREE HOLDS ITSELF TO, SERVED RATHER THAN RUN BY HAND. | `qpuStandardsHolds` | holds |
| [`qpuStepsOf`](../src/quantum/processing/unit/index.ts#L5628) | builder | AUTONOMOUS STEPS, COMPUTED FROM THE LATTICE (the captain, 2026-09-12). | `qpuStepsHolds` | holds |
| [`qpuSubCatalogOf`](../src/quantum/processing/unit/index.ts#L5323) | builder | A sub-server's JSON-LD WebAPI catalogue: its tools as SoftwareApplication items and an ItemList. | `qpuSubCatalogHolds` | checked on each call (needs inputs) |
| [`qpuSubManOf`](../src/quantum/processing/unit/index.ts#L5251) | builder | A man page for a sub-server tool (storage, network, server), synopsis on that server's href. | `qpuSubManHolds` | checked on each call (needs inputs) |
| [`qpuToolsOf`](../src/quantum/processing/unit/index.ts#L14147) | builder | The eight qpu tools (quantum, lean, cite, train, improve, compete, forge, prove) with schemas, man pages and handlers. | — | — |
| [`qpuTrainLiveOf`](../src/quantum/processing/unit/index.ts#L12694) | builder | qpu_train with live CERN occupancy and the live API composition. | `qpuTrainLiveHolds` | live (network) |
| [`qpuTrainOf`](../src/quantum/processing/unit/index.ts#L11005) | builder | Two teams of seven agents run the lattice walk: steps, challenges, sandbox tools and the next door to call. | `qpuTrainHolds` | holds |
| [`raidJoinOf`](../src/quantum/processing/unit/index.ts#L6886) | builder | The stripes read back in the order they were dealt — the inverse of raidStripeOf, collected and joined once. | — | — |
| [`raidStripeOf`](../src/quantum/processing/unit/index.ts#L6874) | builder | Exported for the property that used to be sampled on every write: raidJoinOf is the inverse of raidStripeOf, and dealing into rays can only differ by length modulo rays, so the claim is a cross product of residue against ray count. | — | — |
| [`rpcErrorOf`](../src/quantum/processing/unit/index.ts#L471) | builder | A JSON-RPC 2.0 error, as the protocol spells it: `jsonrpc`, the request's `id` (null when none was understood), and an `error` with code and message. | — | — |
| [`shorArgsOf`](../src/quantum/processing/unit/index.ts#L2471) | builder | Modulus and base as the caller gave them, read as integers, with how each was read. | — | — |
| [`shorDefaultsOf`](../src/quantum/processing/unit/index.ts#L2427) | builder | The modulus and base Shor runs on when the caller names none: faces.rays * (n * n + n + seed) = 91 and mintOf n = 8. | — | — |
| [`shorFactorOf`](../src/quantum/processing/unit/index.ts#L3818) | builder | The factoring claim computed from the run: the modulus Shor factored in this unit's exact state-vector computation — by default 91, the instance theorem shor states. | — | — |
| [`bootPort`](../src/quantum/processing/unit/index.ts#L13296) | function | The one declaration of the port a booted unit serves on: boot.ts listens on $PORT, else this; the install manifest's docker command publishes it. | — | — |
| [`isUnknownTool`](../src/quantum/processing/unit/index.ts#L14516) | function | Type guard for the reply to a tools/call that names no tool of this unit. | — | — |
| [`qpuCallOfUuid`](../src/quantum/processing/unit/index.ts#L9927) | function | qpuCallOfUuid(uuid) → the combination that address names: the door, the pair, and whether it verifies. | — | — |
| [`HEX_PARAM_MODES`](../src/quantum/processing/unit/index.ts#L15315) | constant | How the params section splits: by the two free bits of the variant nibble. | — | — |
| [`MCP_VERSIONS`](../src/quantum/processing/unit/index.ts#L13034) | constant | MCP protocol versions the /mcp door negotiates. | — | — |
| [`QPU_EXPERIMENTS`](../src/quantum/processing/unit/index.ts#L10652) | constant | MIXED EXPERIMENTS: one experiment standing in two domains, and which of them taught the other. | — | — |
| [`QPU_ZONE_HOSTS`](../src/quantum/processing/unit/index.ts#L1485) | constant | THE ZONE, HOST BY HOST — and every one of these names reaches this unit. | — | — |

Generated from the inline docs by `npm run docs`. Index: [docs](README.md).
