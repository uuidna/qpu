---
uuid: "6f71f239-2530-4329-a441-73b0e17265ae"
title: "MCP & agents"
description: "The MCP server, its tools and man pages, the sandbox, training and competition doors. 124 capabilities; 34 of 53 evidence predicates hold."
og:title: "MCP & agents — @uuidna/qpu"
og:description: "The MCP server, its tools and man pages, the sandbox, training and competition doors. 124 capabilities; 34 of 53 evidence predicates hold."
og:type: article
og:url: "https://github.com/uuidna/qpu/blob/main/docs/agents.md"
og:image: "https://opengraph.githubassets.com/qpu/uuidna/qpu"
og:site_name: "@uuidna/qpu"
twitter:card: summary_large_image
twitter:title: "MCP & agents"
twitter:description: "The MCP server, its tools and man pages, the sandbox, training and competition doors. 124 capabilities; 34 of 53 evidence predicates hold."
version: "1.4.0"
---
# MCP & agents

The MCP server, its tools and man pages, the sandbox, training and competition doors.

| | |
|---|---|
| Capabilities | 124 |
| With an evidence predicate | 53 |
| Predicates that hold now | 34 |
| Live (need the network; checked by the live doors) | 2 |

| Capability | Kind | What it does | Evidence | Status |
|---|---|---|---|---|
| [`addressReferrerOf`](../src/quantum/processing/unit/index.ts#L253) | builder | — | — | — |
| [`alpineOf`](../src/quantum/processing/unit/index.ts#L1340) | builder | Native Alpine Linux storage. musl. busybox. overlayfs — KV upper, R2 lower, KV work. | `alpineHolds` | holds |
| [`callUuidOf`](../src/quantum/processing/unit/index.ts#L7256) | builder | callUuidOf(door, left, right) → the address of that combination, as an RFC 9562 v8 UUID. | `callUuidHolds` | holds |
| [`cernRecordsOf`](../src/quantum/processing/unit/index.ts#L8237) | builder | — | — | — |
| [`circuitLiveOf`](../src/quantum/processing/unit/circuit.ts#L58) | builder | — | — | — |
| [`circuitOf`](../src/quantum/processing/unit/circuit.ts#L57) | builder | Runtime reads the drift-checked embed so a cold isolate never JIT-compiles circuitLiveOf; falls back to live. | — | — |
| [`coilEfficiencyOf`](../src/quantum/processing/unit/index.ts#L1402) | builder | Measure coil efficiency in RAID clusters. | `coilEfficiencyHolds` | holds |
| [`coilOf`](../src/quantum/processing/unit/index.ts#L606) | builder | Two coins make a coil. | `coilHolds` | holds |
| [`combinatorialDoorsOf`](../src/quantum/processing/unit/index.ts#L7215) | builder | The door table, with collisions RECOMPUTED rather than assumed — two names can fold to one hex. | `combinatorialDoorsHolds` | holds |
| [`competeLiveOf`](../src/quantum/processing/unit/index.ts#L9120) | builder | compete with live CERN occupancy. | `competeLiveOf` | live (network) |
| [`competeOf`](../src/quantum/processing/unit/index.ts#L8060) | builder | The read team against the call team on quality, speed and security per token; the winner calls prove. | `competeHolds` | holds |
| [`computerLiveOf`](../src/quantum/processing/unit/index.ts#L1767) | builder | — | — | — |
| [`computerOf`](../src/quantum/processing/unit/index.ts#L1747) | builder | Runtime reads the drift-checked embed so a cold Worker isolate never JIT-compiles computerLiveOf (~2.8s shared graph); falls back to live when the embed is absent. | — | — |
| [`crossBridgesOf`](../src/families/cross/index.ts#L45) | builder | Each family's domain, as far as the families have sealed a formula — src → dst. | — | — |
| [`crossFormulaOf`](../src/families/cross/index.ts#L67) | builder | — | — | — |
| [`cryptoClaimOf`](../src/quantum/processing/unit/index.ts#L2384) | builder | The crypto claim READ from the run: the split identity holds and secrecy does not. | — | — |
| [`dataLiveOf`](../src/quantum/processing/unit/index.ts#L542) | builder | Every live public dataset the fused data door checks, read now and carried by prove { live: true }: the proof's live block names what agrees with the unit, what differs and what could not be reached. | — | — |
| [`developOf`](../src/quantum/processing/unit/index.ts#L10382) | builder | The develop reading: source, host, tools, API and integrity, for contributors. | `developHolds` | holds |
| [`documentOf`](../src/deployment/payload-cloudflare.ts#L494) | builder | — | — | — |
| [`dryOf`](../src/quantum/processing/unit/index.ts#L848) | builder | Coordinated dry-clean: two teams, occupancy pentagram, genesis coins. | `dryHolds` | holds |
| [`efficiencyOf`](../src/quantum/processing/unit/index.ts#L3368) | builder | Token efficiency of each door: bytes and tokens to read the tree versus to call the tool. | `efficiencyHolds` | holds |
| [`embedDriftOf`](../src/quantum/processing/unit/index.ts#L1755) | builder | THE COOL IS FRESH, AT THE GATE, FROM ONE PLACE. | — | — |
| [`failureOf`](../src/quantum/processing/unit/mcp.ts#L327) | builder | A failure, classified so it is answered rather than thrown: when the host network is unreachable (no route, DNS, refused connection, timeout) the work that needs it is skipped and the answer is a WARNING; anything else is an ERROR. | — | — |
| [`familyModuleUrlOf`](../src/quantum/processing/unit/index.ts#L10777) | builder | One family module under that same root. | — | — |
| [`familyRegistryUrlOf`](../src/quantum/processing/unit/index.ts#L10774) | builder | The one registry: `mcp/families` beside this module. | — | — |
| [`familyRootOf`](../src/quantum/processing/unit/index.ts#L10771) | builder | The tree this module is running from. | — | — |
| [`forgeOf`](../src/quantum/processing/unit/index.ts#L6315) | builder | Forge a tool from a sealed op tree; { name, run, args } forges and evaluates in one call, { uuid, args } runs a forged tool by its content UUID. | `forgeOf` | **false** |
| [`gibbsFreeOf`](../src/quantum/processing/unit/index.ts#L2838) | builder | GIBBS FREE ENERGY, the one definition the thermodynamics family and this recognition share: the work left once the bound heat is taken from the enthalpy, max(0, enthalpy − heat). `thermodynamics.gibbs` seals this same function as a nested hex-program crossed to `heat`; the recognition reads it here instead of keeping a rule of its own, so the energy is a family formula like everything else, not a constant hardcoded at the core. | — | — |
| [`glossaryOf`](../src/quantum/processing/unit/index.ts#L2570) | builder | WHAT THE WORDS MEAN, SERVED BESIDE THEM. `holds` is said of every record and means that the record is self-consistent and recomputes to itself; it is not a claim that the test the record describes passed. | — | — |
| [`harnessesOf`](../src/quantum/processing/unit/index.ts#L9378) | builder | INTEGRATE IN ANY HARNESS (the captain, 2026-09-12). | `harnessesHolds` | holds |
| [`hexDiscoverOf`](../src/quantum/processing/unit/index.ts#L10931) | builder | — | — | — |
| [`hexFamilyCapOf`](../src/quantum/processing/unit/index.ts#L10682) | builder | The nibble's cap on a family's formulas: fifteen (0 is no formula). | — | — |
| [`hexMissOf`](../src/quantum/processing/unit/index.ts#L10715) | builder | One next address when a formula name is not in the family. | — | — |
| [`hexParamMaxOf`](../src/quantum/processing/unit/index.ts#L10591) | builder | — | — | — |
| [`hexRegistryOf`](../src/quantum/processing/unit/index.ts#L10785) | builder | — | — | — |
| [`hexRunOf`](../src/quantum/processing/unit/index.ts#L10792) | builder | — | — | — |
| [`hexWidthsOf`](../src/quantum/processing/unit/index.ts#L10590) | builder | The widths of the params section by count, in hex digits, and the first natural a param of that count cannot hold: what every module that mints or filters hex programs reads instead of restating 2^48, 2^24, 2^16. | — | — |
| [`hostsOf`](../src/quantum/processing/unit/index.ts#L9285) | builder | MCP hosts the unit is reachable from: fourteen agent harnesses and fourteen LLM clients, one per face. | `hostsHolds` | holds |
| [`hybridOf`](../src/quantum/processing/unit/index.ts#L1149) | builder | Measure hybrid storage speed and cost. | `hybridHolds` | holds |
| [`installManifestOf`](../src/quantum/processing/unit/index.ts#L9690) | builder | install.json, served and written from one function so host and file agree. | `installManifestOf` | **false** |
| [`installOf`](../src/quantum/processing/unit/index.ts#L10127) | builder | Interactive install: steps, choices per occupancy and the combinations they make. | `installHolds` | holds |
| [`mcpCallOf`](../src/quantum/processing/unit/mcp.ts#L453) | builder | Every call is answered: a door that throws is answered with its classified failure, never a crash. | — | — |
| [`mcpChecksOf`](../src/quantum/processing/unit/mcp.ts#L644) | builder | THE MCP SELF-CHECK AS NAMED CLAUSES, NOT ONE OPAQUE BOOLEAN. | — | — |
| [`mcpDiscoverOf`](../src/quantum/processing/unit/index.ts#L9410) | builder | MCP discovery reply: protocol version, capabilities, tools, server info, instructions and install entries. | `mcpDiscoverOf` | **false** |
| [`mcpDoorsOf`](../src/quantum/processing/unit/mcp.ts#L395) | builder | — | — | — |
| [`mcpErrorsOf`](../src/quantum/processing/unit/mcp.ts#L432) | builder | Every current error and warning at once: each fused door's own checks read through the registry (data's every source), each classified with where, why and what resolves it. | — | — |
| [`mcpFailuresOf`](../src/quantum/processing/unit/mcp.ts#L769) | builder | The names of the clauses that are currently false — empty when the MCP contract holds. | — | — |
| [`mcpOf`](../src/quantum/processing/unit/mcp.ts#L236) | builder | The MCP catalogue at /mcp: tools, cybersecurity tools, capacity and provider as one JSON-LD WebAPI. | `mcpHolds` | holds |
| [`mcpShownOf`](../src/quantum/processing/unit/index.ts#L3118) | builder | THE REPLY ON THE WIRE, ONCE AS TEXT AND ONCE AS STRUCTURE. | `mcpShownHolds` | checked on each call (needs inputs) |
| [`mcpToolsListOf`](../src/quantum/processing/unit/index.ts#L10342) | builder | THE CONNECT BILL (the captain, 2026-09-12: "minimise bills of any kind"). tools/list is paid by every client on every connect, in context tokens: the sixteen output schemas were 34,232 of its 44,197 bytes — three quarters of the bill for a document a client validates a reply against at most once. | — | — |
| [`mintOf`](../src/quantum/processing/unit/index.ts#L321) | builder | The lattice's doubling, exported so nothing has to re-implement it. | — | — |
| [`mintScopeOpenOf`](../src/quantum/processing/unit/index.ts#L212) | builder | Start a fresh scope chain and answer the one just closed, so a caller can bracket a region and fold only it. | `mintScopeOpenHolds` | holds |
| [`mixedOf`](../src/quantum/processing/unit/index.ts#L7785) | builder | The domains crossed against each other, as unordered pairs of the vocabulary the experiments name. | `mixedHolds` | holds |
| [`mountsOf`](../src/quantum/processing/unit/index.ts#L9728) | builder | Every mount this unit offers on the host that asked, plus the zone's other MCP, named and not claimed. | `mountsHolds` | holds |
| [`natureOf`](../src/quantum/processing/unit/index.ts#L7813) | builder | IS EVERYTHING ENTANGLED BY NATURE? — the claim, stated precisely enough to be wrong. | `natureHolds` | holds |
| [`networkMcpOf`](../src/quantum/processing/unit/index.ts#L5549) | builder | The network sub-server's catalogue. | `networkMcpOf` | **false** |
| [`networkToolsOf`](../src/quantum/processing/unit/index.ts#L5423) | builder | The network MCP tools (send, receive, fetch on the named host) for channels in memory. | — | — |
| [`occupantOf`](../src/quantum/processing/unit/index.ts#L9576) | builder | Which seat occupies the unit for a referrer, and why. | `occupantOf` | **false** |
| [`orderSliceOf`](../src/quantum/processing/unit/index.ts#L2243) | builder | Order-finding as a SPLIT, not a cap: one hexbit-wide slice of the exact walk from `cur = base^from`. | — | — |
| [`outputSchemaOf`](../src/quantum/processing/unit/index.ts#L2699) | builder | A JSON Schema derived from a tool's own replies: properties typed from the samples, required = keys present in every sample. | — | — |
| [`pathHexOf`](../src/families/path/index.ts#L159) | builder | The hex program that returns a named path. @wing fusion @kind function | — | — |
| [`payloadPluginOf`](../src/quantum/processing/unit/index.ts#L10028) | builder | Payload extends like a plugin. | `payloadPluginHolds` | holds |
| [`planesOf`](../src/quantum/processing/unit/index.ts#L3619) | builder | PLANES (the captain, 2026-09-12). theorem planes: plane = coins·coins·rays is less than mintOf(rays + seed), and coins·rays = faces. | `planesOf` | **false** |
| [`priorArtOf`](../src/quantum/processing/unit/index.ts#L9510) | builder | Prior-art references the router cites, each with its kind (reference, vector, device). | `priorArtHolds` | holds |
| [`qpuClayOf`](../src/quantum/processing/unit/index.ts#L714) | builder | 2×7 coins = 1+6 coils = clay. | `qpuClayOf` | **false** |
| [`qpuDocsOf`](../src/quantum/processing/unit/readme.ts#L58) | builder | The unit's inline guide: abstract, API rows, formulas and the learning ladder, as one document. | `docsHolds` | holds |
| [`qpuDomainsOf`](../src/families/cross/index.ts#L65) | builder | The whole family → domain graph in one reading: each domain with the families that cross to it (and so, for any family, its siblings in its own domain — its experts). | — | — |
| [`qpuFollowOf`](../src/quantum/processing/unit/index.ts#L769) | builder | theorem follow_the_coins | `followHolds` | holds |
| [`qpuManOf`](../src/quantum/processing/unit/index.ts#L2676) | builder | A tool's man page (NAME, SYNOPSIS, DESCRIPTION, SEE ALSO) for the /mcp door. | `manHolds` | **false** |
| [`qpuNextOf`](../src/quantum/processing/unit/index.ts#L668) | builder | Next is the double. | `qpuNextHolds` | holds |
| [`quantumLiveOf`](../src/quantum/processing/unit/quantum.ts#L51) | builder | — | — | — |
| [`quantumOf`](../src/quantum/processing/unit/quantum.ts#L50) | builder | Runtime reads the drift-checked embed so a cold isolate never JIT-compiles quantumLiveOf; falls back to live. | — | — |
| [`raidJoinOf`](../src/quantum/processing/unit/index.ts#L4475) | builder | The stripes read back in the order they were dealt — the inverse of raidStripeOf, collected and joined once. | — | — |
| [`raidStripeOf`](../src/quantum/processing/unit/index.ts#L4463) | builder | Exported for the property that used to be sampled on every write: raidJoinOf is the inverse of raidStripeOf, and dealing into rays can only differ by length modulo rays, so the claim is a cross product of residue against ray count. | — | — |
| [`readmeOf`](../src/quantum/processing/unit/readme.ts#L135) | builder | THE README IS THE npm PAGE. | `readmeHolds` | holds |
| [`recognizeOf`](../src/quantum/processing/unit/index.ts#L3015) | builder | RECOGNISE, THEN THINK. | `recognizeHolds` | holds |
| [`routerOf`](../src/quantum/processing/unit/index.ts#L9598) | builder | Route a referrer and path to a seat and door. | `routerOf` | **false** |
| [`rpcErrorOf`](../src/quantum/processing/unit/index.ts#L503) | builder | A JSON-RPC 2.0 error, as the protocol spells it: `jsonrpc`, the request's `id` (null when none was understood), and an `error` with code and message. | — | — |
| [`sandboxDurabilityOf`](../src/quantum/processing/unit/index.ts#L6414) | builder | Sandbox durability: rounds of put/get, fs and net shims and worker isolation, each checked to persist in memory and stay isolated. | `sandboxDurabilityHolds` | holds |
| [`sandboxEpochOf`](../src/quantum/processing/unit/sandbox.ts#L38) | builder | The sandbox's write epoch: advances when a forge changes a tool, so memoised readings of the sandbox refresh. | `sandboxEpochHolds` | holds |
| [`sandboxOf`](../src/quantum/processing/unit/sandbox.ts#L49) | builder | The in-memory sandbox census: ops, host shims (all in memory), heap, forged tools; nothing touches disk, network or eval. | `sandboxHolds` | holds |
| [`sandboxRunOf`](../src/quantum/processing/unit/sandbox.ts#L112) | builder | Run a sandbox tool by name with arguments; the run is a quantum receipt in the sandbox stream. | `sandboxRunHolds` | checked on each call (needs inputs) |
| [`seatOf`](../src/quantum/processing/unit/index.ts#L9638) | builder | The seat record: how to install and run the unit (command, packages, Cloudflare button). | `seatOf` | **false** |
| [`seatsAvailableOf`](../src/quantum/processing/unit/index.ts#L9529) | builder | THE UNIT AS A ROUTER OF REFERRERS (the captain, 2026-09-13: "QPU is basically intelligent router of referrers", "intelligence decides lean where processes is computed in realtime"). | `seatsAvailableHolds` | holds |
| [`seoOf`](../src/quantum/processing/unit/index.ts#L9951) | builder | The reading a caller can check: what this unit serves for one host, and the canonical door it points every host at. | `seoHolds` | holds |
| [`serverMcpOf`](../src/quantum/processing/unit/index.ts#L5754) | builder | The server sub-server's catalogue: eight tools, the job queue and the backend. | `serverMcpOf` | **false** |
| [`serverSubmitOf`](../src/quantum/processing/unit/index.ts#L5606) | builder | Submit a job to the server: runs it on the exact computer and returns the result inline (jobs are not stored). | `serverSubmitOf` | **false** |
| [`serverToolsOf`](../src/quantum/processing/unit/index.ts#L5653) | builder | The server MCP tools (submit, queue, result, backends and the rest) for jobs on the exact computer. | — | — |
| [`shorArgsOf`](../src/quantum/processing/unit/index.ts#L2277) | builder | Modulus and base as the caller gave them, read as integers, with how each was read. | — | — |
| [`shorDefaultsOf`](../src/quantum/processing/unit/index.ts#L2213) | builder | The modulus and base Shor runs on when the caller names none: faces.rays * (n * n + n + seed) = 91 and mintOf n = 8. | — | — |
| [`shorFactorOf`](../src/quantum/processing/unit/index.ts#L2377) | builder | The factoring claim computed from the run: the modulus Shor factored in this unit's exact state-vector computation — by default 91, the instance theorem shor states. | — | — |
| [`sitemapOf`](../src/quantum/processing/unit/index.ts#L9905) | builder | sitemap.xml for one first-party host — only URLs on that host, because a crawler ignores the rest. | `sitemapHolds` | holds |
| [`specServerOf`](../src/quantum/processing/unit/index.ts#L7511) | builder | The server a document declares, which is where its methods actually live. | `specServerHolds` | holds |
| [`standardsOf`](../src/quantum/processing/unit/index.ts#L6995) | builder | WHAT THIS TREE HOLDS ITSELF TO, SERVED RATHER THAN RUN BY HAND. | `standardsHolds` | **false** |
| [`stepsOf`](../src/quantum/processing/unit/index.ts#L3571) | builder | AUTONOMOUS STEPS, COMPUTED FROM THE LATTICE (the captain, 2026-09-12). | `stepsHolds` | holds |
| [`subCatalogOf`](../src/quantum/processing/unit/index.ts#L3265) | builder | A sub-server's JSON-LD WebAPI catalogue: its tools as SoftwareApplication items and an ItemList. | `subCatalogOf` | **error** |
| [`subManOf`](../src/quantum/processing/unit/index.ts#L3194) | builder | A man page for a sub-server tool (storage, network, server), synopsis on that server's href. | `subManOf` | **error** |
| [`throughSchemaOf`](../src/quantum/processing/unit/mcp.ts#L354) | builder | EVERY CAPABILITY THROUGH EVERY DOOR. tools/list is sealed (theorem agents_mcp_tools), and an MCP client calls only what it was listed; so each listed door also takes an address or another door. | — | — |
| [`toolsOf`](../src/quantum/processing/unit/mcp.ts#L96) | builder | The eight qpu tools (quantum, lean, cite, train, improve, compete, forge, prove) with schemas, man pages and handlers. | — | — |
| [`trainLiveOf`](../src/quantum/processing/unit/index.ts#L9067) | builder | train with live CERN occupancy and the live API composition. | `trainLiveOf` | live (network) |
| [`trainOf`](../src/quantum/processing/unit/doors.ts#L267) | builder | Two teams of seven agents run the lattice walk: steps, challenges, sandbox tools and the next door to call. | `trainHolds` | holds |
| [`apiDoorsOf`](../src/quantum/processing/unit/readme.ts#L42) | function | The door TABLE — method, path, name, href only, no theorem readings. | — | — |
| [`bootPort`](../src/quantum/processing/unit/index.ts#L9660) | function | The one declaration of the port a booted unit serves on: boot.ts listens on $PORT, else this; the install manifest's docker command publishes it. | — | — |
| [`callOfUuid`](../src/quantum/processing/unit/index.ts#L7311) | function | callOfUuid(uuid) → the combination that address names: the door, the pair, and whether it verifies. | — | — |
| [`dynamic`](../src/deployment/payload-cloudflare.ts#L492) | function | — | — | — |
| [`dynamic`](../src/deployment/payload-cloudflare.ts#L504) | function | — | — | — |
| [`generateMetadata`](../src/deployment/payload-cloudflare.ts#L506) | function | — | — | — |
| [`generateMetadata`](../src/deployment/payload-cloudflare.ts#L603) | function | — | — | — |
| [`generateMetadata`](../src/deployment/payload-cloudflare.ts#L617) | function | — | — | — |
| [`hexRegisteredSizeOf`](../src/quantum/processing/unit/index.ts#L10680) | function | How many formulas a family registered, before the nibble's cap: a family past the cap is truncated silently by hexFamiliesOf, so the rule family reads this to say so. | — | — |
| [`isUnknownTool`](../src/quantum/processing/unit/index.ts#L10373) | function | Type guard for the reply to a tools/call that names no tool of this unit. | — | — |
| [`mcpFuseOf`](../src/quantum/processing/unit/index.ts#L529) | function | Fuse a tool into the unit: answered by tools/call, never added to tools/list, so the sixteen sealed doors stay sixteen. | — | — |
| [`worker`](../src/quantum/processing/unit/router.ts#L76) | function | The unit's front door, cooled out of index.ts by the heat family: the Workers fetch that routes every path to the door that answers it, and hands the rest to Payload. | — | — |
| [`ALT_FRONTENDS`](../src/deployment/payload-cloudflare.ts#L402) | constant | — | — | — |
| [`DELETE`](../src/deployment/payload-cloudflare.ts#L629) | constant | — | — | — |
| [`GET`](../src/deployment/payload-cloudflare.ts#L627) | constant | — | — | — |
| [`HEX_PARAM_MODES`](../src/quantum/processing/unit/index.ts#L10587) | constant | — | — | — |
| [`MCP_VERSIONS`](../src/quantum/processing/unit/index.ts#L9401) | constant | MCP protocol versions the /mcp door negotiates. | — | — |
| [`OPTIONS`](../src/deployment/payload-cloudflare.ts#L632) | constant | — | — | — |
| [`PATCH`](../src/deployment/payload-cloudflare.ts#L630) | constant | — | — | — |
| [`POST`](../src/deployment/payload-cloudflare.ts#L628) | constant | — | — | — |
| [`PUT`](../src/deployment/payload-cloudflare.ts#L631) | constant | — | — | — |
| [`QPU_EXPERIMENTS`](../src/quantum/processing/unit/index.ts#L7707) | constant | MIXED EXPERIMENTS: one experiment standing in two domains, and which of them taught the other. | — | — |
| [`QPU_ZONE_HOSTS`](../src/quantum/processing/unit/index.ts#L1236) | constant | THE ZONE, HOST BY HOST — and every one of these names reaches this unit. | — | — |

Generated from the inline docs by `npm run docs`. Index: [docs](README.md).
