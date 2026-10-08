---
uuid: "5b805df9-515d-1400-84dc-d937616b3aa3"
title: "MCP & agents"
description: "The MCP server, its tools and man pages, the sandbox, training and competition doors. 106 capabilities; 46 of 55 evidence predicates hold."
og:title: "MCP & agents — @uuidna/qpu"
og:description: "The MCP server, its tools and man pages, the sandbox, training and competition doors. 106 capabilities; 46 of 55 evidence predicates hold."
og:type: article
og:url: "https://github.com/uuidna/qpu/blob/main/docs/agents.md"
og:image: "https://opengraph.githubassets.com/qpu/uuidna/qpu"
og:site_name: "@uuidna/qpu"
twitter:card: summary_large_image
twitter:title: "MCP & agents"
twitter:description: "The MCP server, its tools and man pages, the sandbox, training and competition doors. 106 capabilities; 46 of 55 evidence predicates hold."
version: "1.1.0"
---
# MCP & agents

The MCP server, its tools and man pages, the sandbox, training and competition doors.

| | |
|---|---|
| Capabilities | 106 |
| With an evidence predicate | 55 |
| Predicates that hold now | 46 |
| Live (need the network; checked by the live doors) | 2 |

| Capability | Kind | What it does | Evidence | Status |
|---|---|---|---|---|
| [`crossFormulaOf`](../src/families/cross/index.ts#L45) | builder | — | — | — |
| [`cryptoClaimOf`](../src/quantum/processing/unit/index.ts#L2350) | builder | The crypto claim READ from the run: the split identity holds and secrecy does not. | — | — |
| [`documentOf`](../src/deployment/payload-cloudflare.ts#L361) | builder | — | — | — |
| [`mintOf`](../src/quantum/processing/unit/index.ts#L321) | builder | The lattice's doubling, exported so nothing has to re-implement it. | — | — |
| [`pathHexOf`](../src/families/path/index.ts#L159) | builder | The hex program that returns a named path. @wing fusion @kind function | — | — |
| [`qpuAddressReferrerOf`](../src/quantum/processing/unit/index.ts#L252) | builder | — | — | — |
| [`qpuAlpineOf`](../src/quantum/processing/unit/index.ts#L1351) | builder | Native Alpine Linux storage. musl. busybox. overlayfs — KV upper, R2 lower, KV work. | `qpuAlpineHolds` | holds |
| [`qpuCallUuidOf`](../src/quantum/processing/unit/index.ts#L7130) | builder | qpuCallUuidOf(door, left, right) → the address of that combination, as an RFC 9562 v8 UUID. | `qpuCallUuidHolds` | holds |
| [`qpuClayOf`](../src/quantum/processing/unit/index.ts#L715) | builder | 2×7 coins = 1+6 coils = clay. | `qpuClayHolds` | holds |
| [`qpuCoilEfficiencyOf`](../src/quantum/processing/unit/index.ts#L1413) | builder | Measure coil efficiency in RAID clusters. | `qpuCoilEfficiencyHolds` | holds |
| [`qpuCoilOf`](../src/quantum/processing/unit/index.ts#L607) | builder | Two coins make a coil. | `qpuCoilHolds` | holds |
| [`qpuCombinatorialDoorsOf`](../src/quantum/processing/unit/index.ts#L7089) | builder | The door table, with collisions RECOMPUTED rather than assumed — two names can fold to one hex. | `qpuCombinatorialDoorsHolds` | holds |
| [`qpuCompeteLiveOf`](../src/quantum/processing/unit/index.ts#L9014) | builder | compete with live CERN occupancy. | `qpuCompeteLiveHolds` | live (network) |
| [`qpuCompeteOf`](../src/quantum/processing/unit/index.ts#L7945) | builder | The read team against the call team on quality, speed and security per token; the winner calls prove. | `qpuCompeteHolds` | holds |
| [`qpuCrossBridgesOf`](../src/families/cross/index.ts#L43) | builder | Each family's domain, as far as the families have sealed a formula — src → dst. | — | — |
| [`qpuDataLiveOf`](../src/quantum/processing/unit/index.ts#L542) | builder | Every live public dataset the fused data door checks, read now and carried by prove { live: true }: the proof's live block names what agrees with the unit, what differs and what could not be reached. | — | — |
| [`qpuDevelopOf`](../src/quantum/processing/unit/index.ts#L10283) | builder | The develop reading: source, host, tools, API and integrity, for contributors. | `qpuDevelopHolds` | holds |
| [`qpuDocsOf`](../src/quantum/processing/unit/readme.ts#L41) | builder | The unit's inline guide: abstract, API rows, formulas and the learning ladder, as one document. | `qpuDocsHolds` | holds |
| [`qpuDryOf`](../src/quantum/processing/unit/index.ts#L859) | builder | Coordinated dry-clean: two teams, occupancy pentagram, genesis coins. | `qpuDryHolds` | holds |
| [`qpuEfficiencyOf`](../src/quantum/processing/unit/index.ts#L3314) | builder | Token efficiency of each door: bytes and tokens to read the tree versus to call the tool. | `qpuEfficiencyHolds` | holds |
| [`qpuFailureOf`](../src/quantum/processing/unit/mcp.ts#L325) | builder | A failure, classified so it is answered rather than thrown: when the network cannot be reached (no route, DNS, refused connection, timeout) the work that needs it is skipped and the answer is a WARNING; anything else is an ERROR. | — | — |
| [`qpuFollowOf`](../src/quantum/processing/unit/index.ts#L780) | builder | theorem follow_the_coins | `qpuFollowHolds` | holds |
| [`qpuForgeOf`](../src/quantum/processing/unit/index.ts#L6255) | builder | Forge a tool from a sealed op tree; { name, run, args } forges and evaluates in one call, { uuid, args } runs a forged tool by its content UUID. | `qpuForgeHolds` | holds |
| [`qpuGlossaryOf`](../src/quantum/processing/unit/index.ts#L2537) | builder | WHAT THE WORDS MEAN, SERVED BESIDE THEM. `holds` is said of every record and means that the record is self-consistent and recomputes to itself; it is not a claim that the test the record describes passed. | — | — |
| [`qpuHarnessesOf`](../src/quantum/processing/unit/index.ts#L9276) | builder | INTEGRATE IN ANY HARNESS (the captain, 2026-09-12). | `qpuHarnessesHolds` | holds |
| [`qpuHexFamilyCapOf`](../src/quantum/processing/unit/index.ts#L10546) | builder | The nibble's cap on a family's formulas: fifteen (0 is no formula). | — | — |
| [`qpuHexMissOf`](../src/quantum/processing/unit/index.ts#L10579) | builder | One next address when a formula name is not in the family. | — | — |
| [`qpuHexParamMaxOf`](../src/quantum/processing/unit/index.ts#L10492) | builder | — | — | — |
| [`qpuHexWidthsOf`](../src/quantum/processing/unit/index.ts#L10491) | builder | The widths of the params section by count, in hex digits, and the first natural a param of that count cannot hold: what every module that mints or filters hex programs reads instead of restating 2^48, 2^24, 2^16. | — | — |
| [`qpuHostsOf`](../src/quantum/processing/unit/index.ts#L9183) | builder | MCP hosts the unit is reachable from: fourteen agent harnesses and fourteen LLM clients, one per face. | `qpuHostsHolds` | holds |
| [`qpuHybridOf`](../src/quantum/processing/unit/index.ts#L1160) | builder | Measure hybrid storage speed and cost. | `qpuHybridHolds` | holds |
| [`qpuInstallManifestOf`](../src/quantum/processing/unit/index.ts#L9592) | builder | install.json, served and written from one function so host and file agree. | `qpuInstallManifestHolds` | holds |
| [`qpuInstallOf`](../src/quantum/processing/unit/index.ts#L10030) | builder | Interactive install: steps, choices per occupancy and the combinations they make. | `qpuInstallHolds` | holds |
| [`qpuManOf`](../src/quantum/processing/unit/index.ts#L2626) | builder | A tool's man page (NAME, SYNOPSIS, DESCRIPTION, SEE ALSO) for the /mcp door. | `qpuManHolds` | checked on each call (needs inputs) |
| [`qpuMcpCallOf`](../src/quantum/processing/unit/mcp.ts#L414) | builder | Every call is answered: a door that throws is answered with its classified failure, never a crash. | — | — |
| [`qpuMcpDiscoverOf`](../src/quantum/processing/unit/index.ts#L9308) | builder | MCP discovery reply: protocol version, capabilities, tools, server info, instructions and install entries. | `qpuMcpDiscoverHolds` | checked on each call (needs inputs) |
| [`qpuMcpDoorsOf`](../src/quantum/processing/unit/mcp.ts#L370) | builder | Every door this unit answers, read from its registries, and every formula of every hex family as family.formula. | — | — |
| [`qpuMcpErrorsOf`](../src/quantum/processing/unit/mcp.ts#L393) | builder | Every current error and warning at once: each fused door's own checks read through the registry (data's every source), each classified with where, why and what resolves it. | — | — |
| [`qpuMcpOf`](../src/quantum/processing/unit/mcp.ts#L234) | builder | The MCP catalogue at /mcp: tools, cybersecurity tools, capacity and provider as one JSON-LD WebAPI. | `qpuMcpHolds` | holds |
| [`qpuMcpShownOf`](../src/quantum/processing/unit/index.ts#L3061) | builder | THE REPLY ON THE WIRE, ONCE AS TEXT AND ONCE AS STRUCTURE. | `qpuMcpShownHolds` | checked on each call (needs inputs) |
| [`qpuMcpToolsListOf`](../src/quantum/processing/unit/index.ts#L10245) | builder | THE CONNECT BILL (the captain, 2026-09-12: "minimise bills of any kind"). tools/list is paid by every client on every connect, in context tokens: the sixteen output schemas were 34,232 of its 44,197 bytes — three quarters of the bill for a document a client validates a reply against at most once. | — | — |
| [`qpuMintScopeOpenOf`](../src/quantum/processing/unit/index.ts#L211) | builder | Start a fresh scope chain and answer the one just closed, so a caller can bracket a region and fold only it. | `qpuMintScopeOpenHolds` | holds |
| [`qpuMixedOf`](../src/quantum/processing/unit/index.ts#L7670) | builder | The domains crossed against each other, as unordered pairs of the vocabulary the experiments name. | `qpuMixedHolds` | holds |
| [`qpuMountsOf`](../src/quantum/processing/unit/index.ts#L9631) | builder | Every mount this unit offers on the host that asked, plus the zone's other MCP, named and not claimed. | `qpuMountsHolds` | holds |
| [`qpuNatureOf`](../src/quantum/processing/unit/index.ts#L7698) | builder | IS EVERYTHING ENTANGLED BY NATURE? — the claim, stated precisely enough to be wrong. | `qpuNatureHolds` | holds |
| [`qpuNetworkMcpOf`](../src/quantum/processing/unit/index.ts#L5490) | builder | The network sub-server's catalogue. | `qpuNetworkMcpHolds` | holds |
| [`qpuNetworkToolsOf`](../src/quantum/processing/unit/index.ts#L5364) | builder | The network MCP tools (send, receive, fetch on the named host) for channels in memory. | — | — |
| [`qpuNextOf`](../src/quantum/processing/unit/index.ts#L669) | builder | Next is the double. | `qpuNextHolds` | holds |
| [`qpuOccupantOf`](../src/quantum/processing/unit/index.ts#L9475) | builder | Which seat occupies the unit for a referrer, and why. | `qpuOccupantHolds` | holds |
| [`qpuOutputSchemaOf`](../src/quantum/processing/unit/index.ts#L2649) | builder | A JSON Schema derived from a tool's own replies: properties typed from the samples, required = keys present in every sample. | — | — |
| [`qpuPayloadPluginOf`](../src/quantum/processing/unit/index.ts#L9928) | builder | Payload extends like a plugin. | `qpuPayloadPluginHolds` | holds |
| [`qpuPlanesOf`](../src/quantum/processing/unit/index.ts#L3565) | builder | PLANES (the captain, 2026-09-12). theorem planes: plane = coins·coins·rays is less than mintOf(rays + seed), and coins·rays = faces. | `qpuPlanesHolds` | holds |
| [`qpuPriorArtOf`](../src/quantum/processing/unit/index.ts#L9409) | builder | Prior-art references the router cites, each with its kind (reference, vector, device). | `qpuPriorArtHolds` | holds |
| [`qpuReadmeOf`](../src/quantum/processing/unit/readme.ts#L117) | builder | THE README IS THE npm PAGE. | `qpuReadmeHolds` | holds |
| [`qpuRecognizeOf`](../src/quantum/processing/unit/index.ts#L2958) | builder | RECOGNISE, THEN THINK. | `qpuRecognizeHolds` | holds |
| [`qpuRouterOf`](../src/quantum/processing/unit/index.ts#L9498) | builder | Route a referrer and path to a seat and door. | `qpuRouterHolds` | holds |
| [`qpuSandboxDurabilityOf`](../src/quantum/processing/unit/index.ts#L6355) | builder | Sandbox durability: rounds of put/get, fs and net shims and worker isolation, each checked to persist in memory and stay isolated. | `qpuSandboxDurabilityHolds` | holds |
| [`qpuSandboxEpochOf`](../src/quantum/processing/unit/sandbox.ts#L38) | builder | The sandbox's write epoch: advances when a forge changes a tool, so memoised readings of the sandbox refresh. | `qpuSandboxEpochHolds` | holds |
| [`qpuSandboxOf`](../src/quantum/processing/unit/sandbox.ts#L49) | builder | The in-memory sandbox census: ops, host shims (all in memory), heap, forged tools; nothing touches disk, network or eval. | `qpuSandboxHolds` | holds |
| [`qpuSandboxRunOf`](../src/quantum/processing/unit/sandbox.ts#L112) | builder | Run a sandbox tool by name with arguments; the run is a quantum receipt in the sandbox stream. | `qpuSandboxRunHolds` | checked on each call (needs inputs) |
| [`qpuSeatOf`](../src/quantum/processing/unit/index.ts#L9539) | builder | The seat record: how to install and run the unit (command, packages, Cloudflare button). | `qpuSeatHolds` | holds |
| [`qpuSeatsAvailableOf`](../src/quantum/processing/unit/index.ts#L9428) | builder | THE UNIT AS A ROUTER OF REFERRERS (the captain, 2026-09-13: "QPU is basically intelligent router of referrers", "intelligence decides lean where processes is computed in realtime"). | `qpuSeatsAvailableHolds` | holds |
| [`qpuSeoOf`](../src/quantum/processing/unit/index.ts#L9851) | builder | The reading a caller can check: what this unit serves for one host, and the canonical door it points every host at. | `qpuSeoHolds` | holds |
| [`qpuServerMcpOf`](../src/quantum/processing/unit/index.ts#L5697) | builder | The server sub-server's catalogue: eight tools, the job queue and the backend. | `qpuServerMcpHolds` | holds |
| [`qpuServerSubmitOf`](../src/quantum/processing/unit/index.ts#L5548) | builder | Submit a job to the server: runs it on the exact computer and returns the result inline (jobs are not stored). | `qpuServerSubmitHolds` | holds |
| [`qpuServerToolsOf`](../src/quantum/processing/unit/index.ts#L5596) | builder | The server MCP tools (submit, queue, result, backends and the rest) for jobs on the exact computer. | — | — |
| [`qpuShorOf`](../src/quantum/processing/unit/shor.ts#L67) | builder | Shor on the sparse exact state vector. | `qpuShorHolds` | holds |
| [`qpuShorTryOf`](../src/quantum/processing/unit/shor.ts#L53) | builder | Shor as a caller asked for it: the run on their n and a, whatever they are. | `qpuShorTryHolds` | checked on each call (needs inputs) |
| [`qpuSitemapOf`](../src/quantum/processing/unit/index.ts#L9805) | builder | sitemap.xml for one first-party host — only URLs on that host, because a crawler ignores the rest. | `qpuSitemapHolds` | holds |
| [`qpuSpecServerOf`](../src/quantum/processing/unit/index.ts#L7390) | builder | The server a document declares, which is where its methods actually live. | `qpuSpecServerHolds` | holds |
| [`qpuStandardsOf`](../src/quantum/processing/unit/index.ts#L6869) | builder | WHAT THIS TREE HOLDS ITSELF TO, SERVED RATHER THAN RUN BY HAND. | `qpuStandardsHolds` | holds |
| [`qpuStepsOf`](../src/quantum/processing/unit/index.ts#L3517) | builder | AUTONOMOUS STEPS, COMPUTED FROM THE LATTICE (the captain, 2026-09-12). | `qpuStepsHolds` | holds |
| [`qpuSubCatalogOf`](../src/quantum/processing/unit/index.ts#L3209) | builder | A sub-server's JSON-LD WebAPI catalogue: its tools as SoftwareApplication items and an ItemList. | `qpuSubCatalogHolds` | checked on each call (needs inputs) |
| [`qpuSubManOf`](../src/quantum/processing/unit/index.ts#L3137) | builder | A man page for a sub-server tool (storage, network, server), synopsis on that server's href. | `qpuSubManHolds` | checked on each call (needs inputs) |
| [`qpuThroughSchemaOf`](../src/quantum/processing/unit/mcp.ts#L352) | builder | EVERY CAPABILITY THROUGH EVERY DOOR. tools/list is sealed (theorem agents_mcp_tools), and an MCP client calls only what it was listed; so each listed door also takes an address or another door. | — | — |
| [`qpuToolsOf`](../src/quantum/processing/unit/mcp.ts#L94) | builder | The eight qpu tools (quantum, lean, cite, train, improve, compete, forge, prove) with schemas, man pages and handlers. | — | — |
| [`qpuTrainLiveOf`](../src/quantum/processing/unit/index.ts#L8959) | builder | train with live CERN occupancy and the live API composition. | `qpuTrainLiveHolds` | live (network) |
| [`qpuTrainOf`](../src/quantum/processing/unit/doors.ts#L267) | builder | Two teams of seven agents run the lattice walk: steps, challenges, sandbox tools and the next door to call. | `qpuTrainHolds` | holds |
| [`raidJoinOf`](../src/quantum/processing/unit/index.ts#L4429) | builder | The stripes read back in the order they were dealt — the inverse of raidStripeOf, collected and joined once. | — | — |
| [`raidStripeOf`](../src/quantum/processing/unit/index.ts#L4417) | builder | Exported for the property that used to be sampled on every write: raidJoinOf is the inverse of raidStripeOf, and dealing into rays can only differ by length modulo rays, so the claim is a cross product of residue against ray count. | — | — |
| [`rpcErrorOf`](../src/quantum/processing/unit/index.ts#L503) | builder | A JSON-RPC 2.0 error, as the protocol spells it: `jsonrpc`, the request's `id` (null when none was understood), and an `error` with code and message. | — | — |
| [`shorArgsOf`](../src/quantum/processing/unit/index.ts#L2243) | builder | Modulus and base as the caller gave them, read as integers, with how each was read. | — | — |
| [`shorDefaultsOf`](../src/quantum/processing/unit/index.ts#L2199) | builder | The modulus and base Shor runs on when the caller names none: faces.rays * (n * n + n + seed) = 91 and mintOf n = 8. | — | — |
| [`shorFactorOf`](../src/quantum/processing/unit/index.ts#L2343) | builder | The factoring claim computed from the run: the modulus Shor factored in this unit's exact state-vector computation — by default 91, the instance theorem shor states. | — | — |
| [`bootPort`](../src/quantum/processing/unit/index.ts#L9562) | function | The one declaration of the port a booted unit serves on: boot.ts listens on $PORT, else this; the install manifest's docker command publishes it. | — | — |
| [`dynamic`](../src/deployment/payload-cloudflare.ts#L359) | function | — | — | — |
| [`dynamic`](../src/deployment/payload-cloudflare.ts#L371) | function | — | — | — |
| [`generateMetadata`](../src/deployment/payload-cloudflare.ts#L373) | function | — | — | — |
| [`generateMetadata`](../src/deployment/payload-cloudflare.ts#L470) | function | — | — | — |
| [`generateMetadata`](../src/deployment/payload-cloudflare.ts#L484) | function | — | — | — |
| [`isUnknownTool`](../src/quantum/processing/unit/index.ts#L10274) | function | Type guard for the reply to a tools/call that names no tool of this unit. | — | — |
| [`qpuCallOfUuid`](../src/quantum/processing/unit/index.ts#L7185) | function | qpuCallOfUuid(uuid) → the combination that address names: the door, the pair, and whether it verifies. | — | — |
| [`qpuHexRegisteredSizeOf`](../src/quantum/processing/unit/index.ts#L10544) | function | How many formulas a family registered, before the nibble's cap: a family past the cap is truncated silently by qpuHexFamiliesOf, so the rule family reads this to say so. | — | — |
| [`qpuMcpFuseOf`](../src/quantum/processing/unit/index.ts#L529) | function | Fuse a tool into the unit: answered by tools/call, never added to tools/list, so the sixteen sealed doors stay sixteen. | — | — |
| [`worker`](../src/quantum/processing/unit/router.ts#L79) | function | The unit's front door, cooled out of index.ts by the heat family: the Workers fetch that routes every path to the door that answers it, and hands the rest to Payload. | — | — |
| [`ALT_FRONTENDS`](../src/deployment/payload-cloudflare.ts#L270) | constant | — | — | — |
| [`DELETE`](../src/deployment/payload-cloudflare.ts#L496) | constant | — | — | — |
| [`GET`](../src/deployment/payload-cloudflare.ts#L494) | constant | — | — | — |
| [`HEX_PARAM_MODES`](../src/quantum/processing/unit/index.ts#L10488) | constant | — | — | — |
| [`MCP_VERSIONS`](../src/quantum/processing/unit/index.ts#L9299) | constant | MCP protocol versions the /mcp door negotiates. | — | — |
| [`OPTIONS`](../src/deployment/payload-cloudflare.ts#L499) | constant | — | — | — |
| [`PATCH`](../src/deployment/payload-cloudflare.ts#L497) | constant | — | — | — |
| [`POST`](../src/deployment/payload-cloudflare.ts#L495) | constant | — | — | — |
| [`PUT`](../src/deployment/payload-cloudflare.ts#L498) | constant | — | — | — |
| [`QPU_EXPERIMENTS`](../src/quantum/processing/unit/index.ts#L7592) | constant | MIXED EXPERIMENTS: one experiment standing in two domains, and which of them taught the other. | — | — |
| [`QPU_ZONE_HOSTS`](../src/quantum/processing/unit/index.ts#L1247) | constant | THE ZONE, HOST BY HOST — and every one of these names reaches this unit. | — | — |

Generated from the inline docs by `npm run docs`. Index: [docs](README.md).
