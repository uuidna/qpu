---
uuid: "759ac108-ee92-3f11-94e0-49443da94390"
title: "MCP & agents"
description: "The MCP server, its tools and man pages, the sandbox, training and competition doors. 118 capabilities; 46 of 55 evidence predicates hold."
og:title: "MCP & agents — @uuidna/qpu"
og:description: "The MCP server, its tools and man pages, the sandbox, training and competition doors. 118 capabilities; 46 of 55 evidence predicates hold."
og:type: article
og:url: "https://github.com/uuidna/qpu/blob/main/docs/agents.md"
og:image: "https://opengraph.githubassets.com/qpu/uuidna/qpu"
og:site_name: "@uuidna/qpu"
twitter:card: summary_large_image
twitter:title: "MCP & agents"
twitter:description: "The MCP server, its tools and man pages, the sandbox, training and competition doors. 118 capabilities; 46 of 55 evidence predicates hold."
version: "1.1.0"
---
# MCP & agents

The MCP server, its tools and man pages, the sandbox, training and competition doors.

| | |
|---|---|
| Capabilities | 118 |
| With an evidence predicate | 55 |
| Predicates that hold now | 46 |
| Live (need the network; checked by the live doors) | 2 |

| Capability | Kind | What it does | Evidence | Status |
|---|---|---|---|---|
| [`crossFormulaOf`](../src/families/cross/index.ts#L67) | builder | — | — | — |
| [`cryptoClaimOf`](../src/quantum/processing/unit/index.ts#L2414) | builder | The crypto claim READ from the run: the split identity holds and secrecy does not. | — | — |
| [`documentOf`](../src/deployment/payload-cloudflare.ts#L482) | builder | — | — | — |
| [`mintOf`](../src/quantum/processing/unit/index.ts#L322) | builder | The lattice's doubling, exported so nothing has to re-implement it. | — | — |
| [`pathHexOf`](../src/families/path/index.ts#L159) | builder | The hex program that returns a named path. @wing fusion @kind function | — | — |
| [`qpuAddressReferrerOf`](../src/quantum/processing/unit/index.ts#L253) | builder | — | — | — |
| [`qpuAlpineOf`](../src/quantum/processing/unit/index.ts#L1352) | builder | Native Alpine Linux storage. musl. busybox. overlayfs — KV upper, R2 lower, KV work. | `qpuAlpineHolds` | holds |
| [`qpuCallUuidOf`](../src/quantum/processing/unit/index.ts#L7211) | builder | qpuCallUuidOf(door, left, right) → the address of that combination, as an RFC 9562 v8 UUID. | `qpuCallUuidHolds` | holds |
| [`qpuClayOf`](../src/quantum/processing/unit/index.ts#L716) | builder | 2×7 coins = 1+6 coils = clay. | `qpuClayHolds` | holds |
| [`qpuCoilEfficiencyOf`](../src/quantum/processing/unit/index.ts#L1414) | builder | Measure coil efficiency in RAID clusters. | `qpuCoilEfficiencyHolds` | holds |
| [`qpuCoilOf`](../src/quantum/processing/unit/index.ts#L608) | builder | Two coins make a coil. | `qpuCoilHolds` | holds |
| [`qpuCombinatorialDoorsOf`](../src/quantum/processing/unit/index.ts#L7170) | builder | The door table, with collisions RECOMPUTED rather than assumed — two names can fold to one hex. | `qpuCombinatorialDoorsHolds` | holds |
| [`qpuCompeteLiveOf`](../src/quantum/processing/unit/index.ts#L9095) | builder | compete with live CERN occupancy. | `qpuCompeteLiveHolds` | live (network) |
| [`qpuCompeteOf`](../src/quantum/processing/unit/index.ts#L8026) | builder | The read team against the call team on quality, speed and security per token; the winner calls prove. | `qpuCompeteHolds` | holds |
| [`qpuCrossBridgesOf`](../src/families/cross/index.ts#L45) | builder | Each family's domain, as far as the families have sealed a formula — src → dst. | — | — |
| [`qpuDataLiveOf`](../src/quantum/processing/unit/index.ts#L543) | builder | Every live public dataset the fused data door checks, read now and carried by prove { live: true }: the proof's live block names what agrees with the unit, what differs and what could not be reached. | — | — |
| [`qpuDevelopOf`](../src/quantum/processing/unit/index.ts#L10369) | builder | The develop reading: source, host, tools, API and integrity, for contributors. | `qpuDevelopHolds` | holds |
| [`qpuDocsOf`](../src/quantum/processing/unit/readme.ts#L58) | builder | The unit's inline guide: abstract, API rows, formulas and the learning ladder, as one document. | `qpuDocsHolds` | holds |
| [`qpuDomainsOf`](../src/families/cross/index.ts#L65) | builder | The whole family → domain graph in one reading: each domain with the families that cross to it (and so, for any family, its siblings in its own domain — its experts). | — | — |
| [`qpuDryOf`](../src/quantum/processing/unit/index.ts#L860) | builder | Coordinated dry-clean: two teams, occupancy pentagram, genesis coins. | `qpuDryHolds` | holds |
| [`qpuEfficiencyOf`](../src/quantum/processing/unit/index.ts#L3395) | builder | Token efficiency of each door: bytes and tokens to read the tree versus to call the tool. | `qpuEfficiencyHolds` | holds |
| [`qpuEmbedDriftOf`](../src/quantum/processing/unit/index.ts#L1765) | builder | THE COOL IS FRESH, AT THE GATE, FROM ONE PLACE. | — | — |
| [`qpuFailureOf`](../src/quantum/processing/unit/mcp.ts#L326) | builder | A failure, classified so it is answered rather than thrown: when the network cannot be reached (no route, DNS, refused connection, timeout) the work that needs it is skipped and the answer is a WARNING; anything else is an ERROR. | — | — |
| [`qpuFamilyModuleUrlOf`](../src/quantum/processing/unit/index.ts#L10764) | builder | One family module under that same root. | — | — |
| [`qpuFamilyRegistryUrlOf`](../src/quantum/processing/unit/index.ts#L10761) | builder | The one registry: `mcp/families` beside this module. | — | — |
| [`qpuFamilyRootOf`](../src/quantum/processing/unit/index.ts#L10758) | builder | The tree this module is running from. | — | — |
| [`qpuFollowOf`](../src/quantum/processing/unit/index.ts#L781) | builder | theorem follow_the_coins | `qpuFollowHolds` | holds |
| [`qpuForgeOf`](../src/quantum/processing/unit/index.ts#L6336) | builder | Forge a tool from a sealed op tree; { name, run, args } forges and evaluates in one call, { uuid, args } runs a forged tool by its content UUID. | `qpuForgeHolds` | holds |
| [`qpuGlossaryOf`](../src/quantum/processing/unit/index.ts#L2601) | builder | WHAT THE WORDS MEAN, SERVED BESIDE THEM. `holds` is said of every record and means that the record is self-consistent and recomputes to itself; it is not a claim that the test the record describes passed. | — | — |
| [`qpuHarnessesOf`](../src/quantum/processing/unit/index.ts#L9357) | builder | INTEGRATE IN ANY HARNESS (the captain, 2026-09-12). | `qpuHarnessesHolds` | holds |
| [`qpuHexDiscoverOf`](../src/quantum/processing/unit/index.ts#L10918) | builder | — | — | — |
| [`qpuHexFamilyCapOf`](../src/quantum/processing/unit/index.ts#L10669) | builder | The nibble's cap on a family's formulas: fifteen (0 is no formula). | — | — |
| [`qpuHexMissOf`](../src/quantum/processing/unit/index.ts#L10702) | builder | One next address when a formula name is not in the family. | — | — |
| [`qpuHexParamMaxOf`](../src/quantum/processing/unit/index.ts#L10578) | builder | — | — | — |
| [`qpuHexRegistryOf`](../src/quantum/processing/unit/index.ts#L10772) | builder | — | — | — |
| [`qpuHexRunOf`](../src/quantum/processing/unit/index.ts#L10779) | builder | — | — | — |
| [`qpuHexWidthsOf`](../src/quantum/processing/unit/index.ts#L10577) | builder | The widths of the params section by count, in hex digits, and the first natural a param of that count cannot hold: what every module that mints or filters hex programs reads instead of restating 2^48, 2^24, 2^16. | — | — |
| [`qpuHostsOf`](../src/quantum/processing/unit/index.ts#L9264) | builder | MCP hosts the unit is reachable from: fourteen agent harnesses and fourteen LLM clients, one per face. | `qpuHostsHolds` | holds |
| [`qpuHybridOf`](../src/quantum/processing/unit/index.ts#L1161) | builder | Measure hybrid storage speed and cost. | `qpuHybridHolds` | holds |
| [`qpuInstallManifestOf`](../src/quantum/processing/unit/index.ts#L9673) | builder | install.json, served and written from one function so host and file agree. | `qpuInstallManifestHolds` | holds |
| [`qpuInstallOf`](../src/quantum/processing/unit/index.ts#L10114) | builder | Interactive install: steps, choices per occupancy and the combinations they make. | `qpuInstallHolds` | holds |
| [`qpuManOf`](../src/quantum/processing/unit/index.ts#L2705) | builder | A tool's man page (NAME, SYNOPSIS, DESCRIPTION, SEE ALSO) for the /mcp door. | `qpuManHolds` | checked on each call (needs inputs) |
| [`qpuMcpCallOf`](../src/quantum/processing/unit/mcp.ts#L427) | builder | Every call is answered: a door that throws is answered with its classified failure, never a crash. | — | — |
| [`qpuMcpChecksOf`](../src/quantum/processing/unit/mcp.ts#L618) | builder | THE MCP SELF-CHECK AS NAMED CLAUSES, NOT ONE OPAQUE BOOLEAN. | — | — |
| [`qpuMcpDiscoverOf`](../src/quantum/processing/unit/index.ts#L9389) | builder | MCP discovery reply: protocol version, capabilities, tools, server info, instructions and install entries. | `qpuMcpDiscoverHolds` | checked on each call (needs inputs) |
| [`qpuMcpDoorsOf`](../src/quantum/processing/unit/mcp.ts#L387) | builder | — | — | — |
| [`qpuMcpErrorsOf`](../src/quantum/processing/unit/mcp.ts#L406) | builder | Every current error and warning at once: each fused door's own checks read through the registry (data's every source), each classified with where, why and what resolves it. | — | — |
| [`qpuMcpFailuresOf`](../src/quantum/processing/unit/mcp.ts#L743) | builder | The names of the clauses that are currently false — empty when the MCP contract holds. | — | — |
| [`qpuMcpOf`](../src/quantum/processing/unit/mcp.ts#L235) | builder | The MCP catalogue at /mcp: tools, cybersecurity tools, capacity and provider as one JSON-LD WebAPI. | `qpuMcpHolds` | holds |
| [`qpuMcpShownOf`](../src/quantum/processing/unit/index.ts#L3142) | builder | THE REPLY ON THE WIRE, ONCE AS TEXT AND ONCE AS STRUCTURE. | `qpuMcpShownHolds` | checked on each call (needs inputs) |
| [`qpuMcpToolsListOf`](../src/quantum/processing/unit/index.ts#L10329) | builder | THE CONNECT BILL (the captain, 2026-09-12: "minimise bills of any kind"). tools/list is paid by every client on every connect, in context tokens: the sixteen output schemas were 34,232 of its 44,197 bytes — three quarters of the bill for a document a client validates a reply against at most once. | — | — |
| [`qpuMintScopeOpenOf`](../src/quantum/processing/unit/index.ts#L212) | builder | Start a fresh scope chain and answer the one just closed, so a caller can bracket a region and fold only it. | `qpuMintScopeOpenHolds` | holds |
| [`qpuMixedOf`](../src/quantum/processing/unit/index.ts#L7751) | builder | The domains crossed against each other, as unordered pairs of the vocabulary the experiments name. | `qpuMixedHolds` | holds |
| [`qpuMountsOf`](../src/quantum/processing/unit/index.ts#L9712) | builder | Every mount this unit offers on the host that asked, plus the zone's other MCP, named and not claimed. | `qpuMountsHolds` | holds |
| [`qpuNatureOf`](../src/quantum/processing/unit/index.ts#L7779) | builder | IS EVERYTHING ENTANGLED BY NATURE? — the claim, stated precisely enough to be wrong. | `qpuNatureHolds` | holds |
| [`qpuNetworkMcpOf`](../src/quantum/processing/unit/index.ts#L5571) | builder | The network sub-server's catalogue. | `qpuNetworkMcpHolds` | holds |
| [`qpuNetworkToolsOf`](../src/quantum/processing/unit/index.ts#L5445) | builder | The network MCP tools (send, receive, fetch on the named host) for channels in memory. | — | — |
| [`qpuNextOf`](../src/quantum/processing/unit/index.ts#L670) | builder | Next is the double. | `qpuNextHolds` | holds |
| [`qpuOccupantOf`](../src/quantum/processing/unit/index.ts#L9556) | builder | Which seat occupies the unit for a referrer, and why. | `qpuOccupantHolds` | holds |
| [`qpuOrderSliceOf`](../src/quantum/processing/unit/index.ts#L2273) | builder | Order-finding as a SPLIT, not a cap: one hexbit-wide slice of the exact walk from `cur = base^from`. | — | — |
| [`qpuOutputSchemaOf`](../src/quantum/processing/unit/index.ts#L2728) | builder | A JSON Schema derived from a tool's own replies: properties typed from the samples, required = keys present in every sample. | — | — |
| [`qpuPayloadPluginOf`](../src/quantum/processing/unit/index.ts#L10012) | builder | Payload extends like a plugin. | `qpuPayloadPluginHolds` | holds |
| [`qpuPlanesOf`](../src/quantum/processing/unit/index.ts#L3646) | builder | PLANES (the captain, 2026-09-12). theorem planes: plane = coins·coins·rays is less than mintOf(rays + seed), and coins·rays = faces. | `qpuPlanesHolds` | holds |
| [`qpuPriorArtOf`](../src/quantum/processing/unit/index.ts#L9490) | builder | Prior-art references the router cites, each with its kind (reference, vector, device). | `qpuPriorArtHolds` | holds |
| [`qpuReadmeOf`](../src/quantum/processing/unit/readme.ts#L135) | builder | THE README IS THE npm PAGE. | `qpuReadmeHolds` | holds |
| [`qpuRecognizeOf`](../src/quantum/processing/unit/index.ts#L3039) | builder | RECOGNISE, THEN THINK. | `qpuRecognizeHolds` | holds |
| [`qpuRouterOf`](../src/quantum/processing/unit/index.ts#L9579) | builder | Route a referrer and path to a seat and door. | `qpuRouterHolds` | holds |
| [`qpuSandboxDurabilityOf`](../src/quantum/processing/unit/index.ts#L6436) | builder | Sandbox durability: rounds of put/get, fs and net shims and worker isolation, each checked to persist in memory and stay isolated. | `qpuSandboxDurabilityHolds` | holds |
| [`qpuSandboxEpochOf`](../src/quantum/processing/unit/sandbox.ts#L38) | builder | The sandbox's write epoch: advances when a forge changes a tool, so memoised readings of the sandbox refresh. | `qpuSandboxEpochHolds` | holds |
| [`qpuSandboxOf`](../src/quantum/processing/unit/sandbox.ts#L49) | builder | The in-memory sandbox census: ops, host shims (all in memory), heap, forged tools; nothing touches disk, network or eval. | `qpuSandboxHolds` | holds |
| [`qpuSandboxRunOf`](../src/quantum/processing/unit/sandbox.ts#L112) | builder | Run a sandbox tool by name with arguments; the run is a quantum receipt in the sandbox stream. | `qpuSandboxRunHolds` | checked on each call (needs inputs) |
| [`qpuSeatOf`](../src/quantum/processing/unit/index.ts#L9620) | builder | The seat record: how to install and run the unit (command, packages, Cloudflare button). | `qpuSeatHolds` | holds |
| [`qpuSeatsAvailableOf`](../src/quantum/processing/unit/index.ts#L9509) | builder | THE UNIT AS A ROUTER OF REFERRERS (the captain, 2026-09-13: "QPU is basically intelligent router of referrers", "intelligence decides lean where processes is computed in realtime"). | `qpuSeatsAvailableHolds` | holds |
| [`qpuSeoOf`](../src/quantum/processing/unit/index.ts#L9935) | builder | The reading a caller can check: what this unit serves for one host, and the canonical door it points every host at. | `qpuSeoHolds` | holds |
| [`qpuServerMcpOf`](../src/quantum/processing/unit/index.ts#L5778) | builder | The server sub-server's catalogue: eight tools, the job queue and the backend. | `qpuServerMcpHolds` | holds |
| [`qpuServerSubmitOf`](../src/quantum/processing/unit/index.ts#L5629) | builder | Submit a job to the server: runs it on the exact computer and returns the result inline (jobs are not stored). | `qpuServerSubmitHolds` | holds |
| [`qpuServerToolsOf`](../src/quantum/processing/unit/index.ts#L5677) | builder | The server MCP tools (submit, queue, result, backends and the rest) for jobs on the exact computer. | — | — |
| [`qpuShorOf`](../src/quantum/processing/unit/shor.ts#L67) | builder | Shor on the sparse exact state vector. | `qpuShorHolds` | holds |
| [`qpuShorTryOf`](../src/quantum/processing/unit/shor.ts#L53) | builder | Shor as a caller asked for it: the run on their n and a, whatever they are. | `qpuShorTryHolds` | checked on each call (needs inputs) |
| [`qpuSitemapOf`](../src/quantum/processing/unit/index.ts#L9889) | builder | sitemap.xml for one first-party host — only URLs on that host, because a crawler ignores the rest. | `qpuSitemapHolds` | holds |
| [`qpuSpecServerOf`](../src/quantum/processing/unit/index.ts#L7471) | builder | The server a document declares, which is where its methods actually live. | `qpuSpecServerHolds` | holds |
| [`qpuStandardsOf`](../src/quantum/processing/unit/index.ts#L6950) | builder | WHAT THIS TREE HOLDS ITSELF TO, SERVED RATHER THAN RUN BY HAND. | `qpuStandardsHolds` | holds |
| [`qpuStepsOf`](../src/quantum/processing/unit/index.ts#L3598) | builder | AUTONOMOUS STEPS, COMPUTED FROM THE LATTICE (the captain, 2026-09-12). | `qpuStepsHolds` | holds |
| [`qpuSubCatalogOf`](../src/quantum/processing/unit/index.ts#L3290) | builder | A sub-server's JSON-LD WebAPI catalogue: its tools as SoftwareApplication items and an ItemList. | `qpuSubCatalogHolds` | checked on each call (needs inputs) |
| [`qpuSubManOf`](../src/quantum/processing/unit/index.ts#L3218) | builder | A man page for a sub-server tool (storage, network, server), synopsis on that server's href. | `qpuSubManHolds` | checked on each call (needs inputs) |
| [`qpuThroughSchemaOf`](../src/quantum/processing/unit/mcp.ts#L353) | builder | EVERY CAPABILITY THROUGH EVERY DOOR. tools/list is sealed (theorem agents_mcp_tools), and an MCP client calls only what it was listed; so each listed door also takes an address or another door. | — | — |
| [`qpuToolsOf`](../src/quantum/processing/unit/mcp.ts#L95) | builder | The eight qpu tools (quantum, lean, cite, train, improve, compete, forge, prove) with schemas, man pages and handlers. | — | — |
| [`qpuTrainLiveOf`](../src/quantum/processing/unit/index.ts#L9040) | builder | train with live CERN occupancy and the live API composition. | `qpuTrainLiveHolds` | live (network) |
| [`qpuTrainOf`](../src/quantum/processing/unit/doors.ts#L267) | builder | Two teams of seven agents run the lattice walk: steps, challenges, sandbox tools and the next door to call. | `qpuTrainHolds` | holds |
| [`raidJoinOf`](../src/quantum/processing/unit/index.ts#L4510) | builder | The stripes read back in the order they were dealt — the inverse of raidStripeOf, collected and joined once. | — | — |
| [`raidStripeOf`](../src/quantum/processing/unit/index.ts#L4498) | builder | Exported for the property that used to be sampled on every write: raidJoinOf is the inverse of raidStripeOf, and dealing into rays can only differ by length modulo rays, so the claim is a cross product of residue against ray count. | — | — |
| [`rpcErrorOf`](../src/quantum/processing/unit/index.ts#L504) | builder | A JSON-RPC 2.0 error, as the protocol spells it: `jsonrpc`, the request's `id` (null when none was understood), and an `error` with code and message. | — | — |
| [`shorArgsOf`](../src/quantum/processing/unit/index.ts#L2307) | builder | Modulus and base as the caller gave them, read as integers, with how each was read. | — | — |
| [`shorDefaultsOf`](../src/quantum/processing/unit/index.ts#L2223) | builder | The modulus and base Shor runs on when the caller names none: faces.rays * (n * n + n + seed) = 91 and mintOf n = 8. | — | — |
| [`shorFactorOf`](../src/quantum/processing/unit/index.ts#L2407) | builder | The factoring claim computed from the run: the modulus Shor factored in this unit's exact state-vector computation — by default 91, the instance theorem shor states. | — | — |
| [`bootPort`](../src/quantum/processing/unit/index.ts#L9643) | function | The one declaration of the port a booted unit serves on: boot.ts listens on $PORT, else this; the install manifest's docker command publishes it. | — | — |
| [`dynamic`](../src/deployment/payload-cloudflare.ts#L480) | function | — | — | — |
| [`dynamic`](../src/deployment/payload-cloudflare.ts#L492) | function | — | — | — |
| [`generateMetadata`](../src/deployment/payload-cloudflare.ts#L494) | function | — | — | — |
| [`generateMetadata`](../src/deployment/payload-cloudflare.ts#L591) | function | — | — | — |
| [`generateMetadata`](../src/deployment/payload-cloudflare.ts#L605) | function | — | — | — |
| [`isUnknownTool`](../src/quantum/processing/unit/index.ts#L10360) | function | Type guard for the reply to a tools/call that names no tool of this unit. | — | — |
| [`qpuApiDoorsOf`](../src/quantum/processing/unit/readme.ts#L42) | function | The door TABLE — method, path, name, href only, no theorem readings. | — | — |
| [`qpuCallOfUuid`](../src/quantum/processing/unit/index.ts#L7266) | function | qpuCallOfUuid(uuid) → the combination that address names: the door, the pair, and whether it verifies. | — | — |
| [`qpuHexRegisteredSizeOf`](../src/quantum/processing/unit/index.ts#L10667) | function | How many formulas a family registered, before the nibble's cap: a family past the cap is truncated silently by qpuHexFamiliesOf, so the rule family reads this to say so. | — | — |
| [`qpuMcpFuseOf`](../src/quantum/processing/unit/index.ts#L530) | function | Fuse a tool into the unit: answered by tools/call, never added to tools/list, so the sixteen sealed doors stay sixteen. | — | — |
| [`worker`](../src/quantum/processing/unit/router.ts#L76) | function | The unit's front door, cooled out of index.ts by the heat family: the Workers fetch that routes every path to the door that answers it, and hands the rest to Payload. | — | — |
| [`ALT_FRONTENDS`](../src/deployment/payload-cloudflare.ts#L391) | constant | — | — | — |
| [`DELETE`](../src/deployment/payload-cloudflare.ts#L617) | constant | — | — | — |
| [`GET`](../src/deployment/payload-cloudflare.ts#L615) | constant | — | — | — |
| [`HEX_PARAM_MODES`](../src/quantum/processing/unit/index.ts#L10574) | constant | — | — | — |
| [`MCP_VERSIONS`](../src/quantum/processing/unit/index.ts#L9380) | constant | MCP protocol versions the /mcp door negotiates. | — | — |
| [`OPTIONS`](../src/deployment/payload-cloudflare.ts#L620) | constant | — | — | — |
| [`PATCH`](../src/deployment/payload-cloudflare.ts#L618) | constant | — | — | — |
| [`POST`](../src/deployment/payload-cloudflare.ts#L616) | constant | — | — | — |
| [`PUT`](../src/deployment/payload-cloudflare.ts#L619) | constant | — | — | — |
| [`QPU_EXPERIMENTS`](../src/quantum/processing/unit/index.ts#L7673) | constant | MIXED EXPERIMENTS: one experiment standing in two domains, and which of them taught the other. | — | — |
| [`QPU_ZONE_HOSTS`](../src/quantum/processing/unit/index.ts#L1248) | constant | THE ZONE, HOST BY HOST — and every one of these names reaches this unit. | — | — |

Generated from the inline docs by `npm run docs`. Index: [docs](README.md).
