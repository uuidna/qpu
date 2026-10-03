# UUIDNA QPU

An exact quantum processing unit served over MCP at https://qpu.uuidna.com, with its site, admin and API on the
same host. Reads need no auth; storage writes need a Bearer token. Use it as an MCP server (`{ "qpu": { "type": "http",
"url": "https://qpu.uuidna.com/mcp" } }`), as a package (`npm install @uuidna/qpu`), or as a container.

| Capability | How much | Compared with |
|---|---|---|
| MCP door (https://qpu.uuidna.com/mcp) | 16 listed tools; through any of them 51 doors and 108 formulas (`{ doors: true }`, `{ door }`, `{ hex }`, `{ errors: true }`) | the Model Context Protocol: `tools/list` sealed by the Lean theorem agents_mcp_tools |
| Formal proof | 124 Lean theorems served, 124 recomputed in TypeScript | the Lean 4 kernel (leanprover/lean4:v4.33.0) |
| Formula families | 15 families run as hex-program UUIDs (RFC 9562 v8); 10,902 programs in the last discovery | each other: 161 values reached by two or more families, 7 seals (fixed points, involutions) |
| Live public data | 35 of 46 sources agree | CERN Open Data, NIST CODATA, OEIS (8 formulas identified as sequences), Zenodo, DataCite, ORCID, GitHub, npm, INSPIRE catalogues |
| Public APIs | 2,529 of 2,529 APIs walked live, 123,136 methods, 438,299 cross formulas | the APIs.guru registry, against the Lean theorem fuse |
| Cross formulas | 78 of 79 rows hold across 37 formulas | their own hex programs (36 agree) |
| Cryptography | 27/27 attacks resisted, no node:crypto | Node's crypto (parity), its own attacks |
| Live cross-proof | 27 of 30 claims agree | the hosts the claims name |
| Payload on Cloudflare | 98,304 combinations generated; the site is one Worker | Payload's documented plugins and adapters |
| Code heat | 324 of 340 files cold, 16 hot | Qpu.Physics: photon / thermal T |

Cite: Rouschev, Tsvetan. "qpu." doi:[10.5281/zenodo.23091364](https://doi.org/10.5281/zenodo.23091364). License: CC-BY-NC-ND-4.0
(commercial use by license: https://qpu.uuidna.com/license).

**Final build receipt** `5e23d602-2950-8061-83df-537db2f1da20`

| | |
|---|---|
| version | 1.0.1 |
| commit | `f7a8547db7731e8a17730cdea6dc95a6d4e6cb64` (working tree differed from this commit) |
| receipts | 14 files, 530 nodes |
| build stream | length 530, head `5e23d602-2950-8061-83df-537db2f1da20`, chain `153ca2c7eaf0bc98ac5042b06ea2dcd43eccc2d68428bd2287b7a5677af4d053`, holds **true** |

## What QPU does

An exact quantum processing unit served over MCP at https://qpu.uuidna.com: integer state vectors, Lean-checked theorems,
formula families addressed by hex-program UUIDs, quantum receipts, its own cryptography, and live checks against public
data. Each wing reports itself:

| Wing | Capabilities | With an evidence predicate | Predicates that hold now | Live (need the network; checked by the live doors) |
|---|---:|---:|---:|---:|
| [Lattice & arithmetic](https://qpu.uuidna.com/lattice) | 10 | 7 | 7 | 0 |
| [Quantum computation](https://qpu.uuidna.com/quantum) | 17 | 17 | 14 | 3 |
| [Formal proof (Lean)](https://qpu.uuidna.com/proof) | 12 | 4 | 4 | 0 |
| [Cryptography](https://qpu.uuidna.com/crypto) | 3 | 2 | 2 | 0 |
| [UUIDs & quantum receipts](https://qpu.uuidna.com/receipts) | 40 | 17 | 15 | 0 |
| [Storage & database](https://qpu.uuidna.com/storage) | 25 | 10 | 6 | 0 |
| [MCP & agents](https://qpu.uuidna.com/agents) | 97 | 54 | 45 | 2 |
| [Live science data](https://qpu.uuidna.com/science) | 22 | 17 | 10 | 7 |
| [API fusion](https://qpu.uuidna.com/fusion) | 17 | 8 | 2 | 3 |
| [Payload & Cloudflare](https://qpu.uuidna.com/cms) | 19 | 4 | 3 | 0 |
| [Presentation & discovery](https://qpu.uuidna.com/presentation) | 14 | 14 | 14 | 0 |

## Clay Millennium Prize Problems

The author claims solutions to 6 of the Millennium Prize Problems, composed by the unit's cross formulas
across its families; Poincaré was solved by Perelman. Each claim links to the document that states it, with its argument
and verification status.

| Problem | Status | Claim and approach composed by the cross formulas |
|---|---|---|
| P vs NP | claimed solved by Tsvetan Rouschev ([claim](https://doi.org/10.5281/zenodo.21781603)) | P ≠ NP (information-theoretic proof); causal_inversion |
| Hodge Conjecture | claimed solved by Tsvetan Rouschev ([claim](https://doi.org/10.5281/zenodo.21781603)) | xai_synthesis_composition; explain_hodge_decomposition (XAI); synthesize_algebraic_cycle (Synthesis); transfer_from_kahler_varieties (Zero-Shot) |
| Riemann Hypothesis | claimed solved by Tsvetan Rouschev ([claim](https://doi.org/10.5281/zenodo.21781603)) | All non-trivial zeros lie on Re(s) = 1/2 (symmetry proof); functional_symmetry |
| Yang-Mills and Mass Gap | claimed solved by Tsvetan Rouschev ([claim](https://doi.org/10.5281/zenodo.21781603)) | federated_gauge_convergence; federated_gauge_symmetry_convergence (Federated); synthesize_yang_mills_lagrangian (Synthesis); transfer_from_qed_to_qcd (Zero-Shot) |
| Navier-Stokes Existence and Smoothness | claimed solved by Tsvetan Rouschev ([claim](https://doi.org/10.5281/zenodo.21781603)) | Existence and smoothness proven for smooth initial data; federated_smoothness_aggregation |
| Birch and Swinnerton-Dyer Conjecture | claimed solved by Tsvetan Rouschev ([claim](https://doi.org/10.5281/zenodo.21781603)) | causal_rank_transfer; causal_rank_from_l_function (Causal); transfer_rank_across_isogeny_class (Zero-Shot); synthesize_rational_point_generator (Synthesis) |
| Poincaré Conjecture | solved (Grigori Perelman, 2003) |  |

## Build receipt

<details>
<summary>530 receipts, chained in the build stream</summary>

Each node is a quantum receipt: its UUID is the RFC 9562 v8 content address of its payload fold and its referrer, and
its referrer is the node above it. Change any receipt's bytes and its node, its file's node, the build stream chain
and this final receipt move; the root moves with the commit.

```mermaid
flowchart TD
  n3efdf618["root<br/><code>3efdf618</code>"]
  n3d979984["cross-receipt.json<br/><code>3d979984</code>"]
  nc037da2b["cross-receipt.json#0<br/><code>c037da2b</code>"]
  n72e6e4d6["cross-receipt.json#1<br/><code>72e6e4d6</code>"]
  ne9ae521d["cross-receipt.json#2<br/><code>e9ae521d</code>"]
  ncedaa099["cross-receipt.json#3<br/><code>cedaa099</code>"]
  n9c5fb560["cross-receipt.json#4<br/><code>9c5fb560</code>"]
  n2f67b070["cross-receipt.json#5<br/><code>2f67b070</code>"]
  nc04d4d07["cross-receipt.json#6<br/><code>c04d4d07</code>"]
  n2c918719["cross-receipt.json#7<br/><code>2c918719</code>"]
  n421d81e3["cross-receipt.json#8<br/><code>421d81e3</code>"]
  n0620424b["cross-receipt.json#9<br/><code>0620424b</code>"]
  nf00c6be4["cross-receipt.json#10<br/><code>f00c6be4</code>"]
  n00ee3665["cross-receipt.json#11<br/><code>00ee3665</code>"]
  nfc951844["cross-receipt.json#12<br/><code>fc951844</code>"]
  n18567652["cross-receipt.json#13<br/><code>18567652</code>"]
  n244db4f8["cross-receipt.json#14<br/><code>244db4f8</code>"]
  n3546be57["cross-receipt.json#15<br/><code>3546be57</code>"]
  n4275e3a8["cross-receipt.json#16<br/><code>4275e3a8</code>"]
  n4eb30c80["cross-receipt.json#17<br/><code>4eb30c80</code>"]
  n56a9656c["cross-receipt.json#18<br/><code>56a9656c</code>"]
  nc813d3fe["cross-receipt.json#19<br/><code>c813d3fe</code>"]
  n0f5a30e6["cross-receipt.json#20<br/><code>0f5a30e6</code>"]
  n2f1c9756["cross-receipt.json#21<br/><code>2f1c9756</code>"]
  n827922a2["cross-receipt.json#22<br/><code>827922a2</code>"]
  n629b1b2b["cross-receipt.json#23<br/><code>629b1b2b</code>"]
  n2123d1e7["cross-receipt.json#24<br/><code>2123d1e7</code>"]
  nf6fe021e["cross-receipt.json#25<br/><code>f6fe021e</code>"]
  n3cc39d3b["cross-receipt.json#26<br/><code>3cc39d3b</code>"]
  n185a0b05["cross-receipt.json#27<br/><code>185a0b05</code>"]
  n8a5f1c07["cross-receipt.json#28<br/><code>8a5f1c07</code>"]
  n7bc302b2["cross-receipt.json#29<br/><code>7bc302b2</code>"]
  n6403c518["debts-receipt.json<br/><code>6403c518</code>"]
  nb88c9f1c["discovery-receipt.json<br/><code>b88c9f1c</code>"]
  nd279b7c8["discovery-receipt.json#0<br/><code>d279b7c8</code>"]
  nf9b0b75e["discovery-receipt.json#1<br/><code>f9b0b75e</code>"]
  n6eb23a74["discovery-receipt.json#2<br/><code>6eb23a74</code>"]
  n3f5d3ec8["discovery-receipt.json#3<br/><code>3f5d3ec8</code>"]
  n04bc44e5["discovery-receipt.json#4<br/><code>04bc44e5</code>"]
  n6af453b2["discovery-receipt.json#5<br/><code>6af453b2</code>"]
  n5ce5c570["discovery-receipt.json#6<br/><code>5ce5c570</code>"]
  n147be0dc["discovery-receipt.json#7<br/><code>147be0dc</code>"]
  ne97c6e57["discovery-receipt.json#8<br/><code>e97c6e57</code>"]
  nd07e2a8f["discovery-receipt.json#9<br/><code>d07e2a8f</code>"]
  ndd93f388["discovery-receipt.json#10<br/><code>dd93f388</code>"]
  n2d046f0a["discovery-receipt.json#11<br/><code>2d046f0a</code>"]
  nc3931f91["discovery-receipt.json#12<br/><code>c3931f91</code>"]
  nec04f186["discovery-receipt.json#13<br/><code>ec04f186</code>"]
  n80b9aba2["discovery-receipt.json#14<br/><code>80b9aba2</code>"]
  n0a71bef1["discovery-receipt.json#15<br/><code>0a71bef1</code>"]
  n8a08c28a["discovery-receipt.json#16<br/><code>8a08c28a</code>"]
  ne46e1947["discovery-receipt.json#17<br/><code>e46e1947</code>"]
  n56ed83cf["discovery-receipt.json#18<br/><code>56ed83cf</code>"]
  n4be07c2c["discovery-receipt.json#19<br/><code>4be07c2c</code>"]
  ndbe7f43c["discovery-receipt.json#20<br/><code>dbe7f43c</code>"]
  nf62d34ea["discovery-receipt.json#21<br/><code>f62d34ea</code>"]
  n36986951["discovery-receipt.json#22<br/><code>36986951</code>"]
  na56a62c9["discovery-receipt.json#23<br/><code>a56a62c9</code>"]
  n58a66815["discovery-receipt.json#24<br/><code>58a66815</code>"]
  n26f4ae45["discovery-receipt.json#25<br/><code>26f4ae45</code>"]
  nc280965d["discovery-receipt.json#26<br/><code>c280965d</code>"]
  n17b646d0["discovery-receipt.json#27<br/><code>17b646d0</code>"]
  n49ccd085["discovery-receipt.json#28<br/><code>49ccd085</code>"]
  nb4a01cec["discovery-receipt.json#29<br/><code>b4a01cec</code>"]
  n4af61e31["discovery-receipt.json#30<br/><code>4af61e31</code>"]
  ne1464278["discovery-receipt.json#31<br/><code>e1464278</code>"]
  nc74e13ed["discovery-receipt.json#32<br/><code>c74e13ed</code>"]
  n9d285bd1["discovery-receipt.json#33<br/><code>9d285bd1</code>"]
  n7dfc0120["discovery-receipt.json#34<br/><code>7dfc0120</code>"]
  nadf5d4b9["discovery-receipt.json#35<br/><code>adf5d4b9</code>"]
  nf9b092bc["discovery-receipt.json#36<br/><code>f9b092bc</code>"]
  n323a0415["discovery-receipt.json#37<br/><code>323a0415</code>"]
  n17d1f273["discovery-receipt.json#38<br/><code>17d1f273</code>"]
  n1ae1036b["discovery-receipt.json#39<br/><code>1ae1036b</code>"]
  n86def864["discovery-receipt.json#40<br/><code>86def864</code>"]
  nef7403f8["discovery-receipt.json#41<br/><code>ef7403f8</code>"]
  n94a6899d["discovery-receipt.json#42<br/><code>94a6899d</code>"]
  n3da020a8["discovery-receipt.json#43<br/><code>3da020a8</code>"]
  nd19b55fe["discovery-receipt.json#44<br/><code>d19b55fe</code>"]
  n0a5f0c27["discovery-receipt.json#45<br/><code>0a5f0c27</code>"]
  n7574b21a["discovery-receipt.json#46<br/><code>7574b21a</code>"]
  n4576d411["discovery-receipt.json#47<br/><code>4576d411</code>"]
  n0fa4aa89["discovery-receipt.json#48<br/><code>0fa4aa89</code>"]
  nadc03d11["discovery-receipt.json#49<br/><code>adc03d11</code>"]
  ncb283674["discovery-receipt.json#50<br/><code>cb283674</code>"]
  nf47b81d0["discovery-receipt.json#51<br/><code>f47b81d0</code>"]
  n880022ad["discovery-receipt.json#52<br/><code>880022ad</code>"]
  n3bf7042b["discovery-receipt.json#53<br/><code>3bf7042b</code>"]
  n1f82a45d["discovery-receipt.json#54<br/><code>1f82a45d</code>"]
  n8e16aec5["discovery-receipt.json#55<br/><code>8e16aec5</code>"]
  na29c9a4f["discovery-receipt.json#56<br/><code>a29c9a4f</code>"]
  n95692965["discovery-receipt.json#57<br/><code>95692965</code>"]
  n1bbe83a0["discovery-receipt.json#58<br/><code>1bbe83a0</code>"]
  n409ac80f["discovery-receipt.json#59<br/><code>409ac80f</code>"]
  ne5af2e44["discovery-receipt.json#60<br/><code>e5af2e44</code>"]
  nd87cc2ec["discovery-receipt.json#61<br/><code>d87cc2ec</code>"]
  nea4dd95a["discovery-receipt.json#62<br/><code>ea4dd95a</code>"]
  nd7f5dc92["discovery-receipt.json#63<br/><code>d7f5dc92</code>"]
  nf7ec278c["discovery-receipt.json#64<br/><code>f7ec278c</code>"]
  n31ef75c3["discovery-receipt.json#65<br/><code>31ef75c3</code>"]
  n45b19787["discovery-receipt.json#66<br/><code>45b19787</code>"]
  n6a891c70["discovery-receipt.json#67<br/><code>6a891c70</code>"]
  ncb92fb2f["discovery-receipt.json#68<br/><code>cb92fb2f</code>"]
  n8e06baff["discovery-receipt.json#69<br/><code>8e06baff</code>"]
  n329bbc76["discovery-receipt.json#70<br/><code>329bbc76</code>"]
  n7c06873e["discovery-receipt.json#71<br/><code>7c06873e</code>"]
  n361c6224["discovery-receipt.json#72<br/><code>361c6224</code>"]
  n34026f21["discovery-receipt.json#73<br/><code>34026f21</code>"]
  ncf0bc282["discovery-receipt.json#74<br/><code>cf0bc282</code>"]
  n942d6dd0["discovery-receipt.json#75<br/><code>942d6dd0</code>"]
  n26d22af5["discovery-receipt.json#76<br/><code>26d22af5</code>"]
  n35f32cb2["discovery-receipt.json#77<br/><code>35f32cb2</code>"]
  n4d49bd47["discovery-receipt.json#78<br/><code>4d49bd47</code>"]
  na6d79c0e["discovery-receipt.json#79<br/><code>a6d79c0e</code>"]
  n7a96ba98["discovery-receipt.json#80<br/><code>7a96ba98</code>"]
  nb19481eb["discovery-receipt.json#81<br/><code>b19481eb</code>"]
  n37409fa2["discovery-receipt.json#82<br/><code>37409fa2</code>"]
  nd7e4af18["discovery-receipt.json#83<br/><code>d7e4af18</code>"]
  n08eb72f8["discovery-receipt.json#84<br/><code>08eb72f8</code>"]
  n12aa1c5f["discovery-receipt.json#85<br/><code>12aa1c5f</code>"]
  n6ee6a1b0["discovery-receipt.json#86<br/><code>6ee6a1b0</code>"]
  n27363477["discovery-receipt.json#87<br/><code>27363477</code>"]
  nd13a74ef["discovery-receipt.json#88<br/><code>d13a74ef</code>"]
  n50fc53ed["discovery-receipt.json#89<br/><code>50fc53ed</code>"]
  n9a54cdbc["discovery-receipt.json#90<br/><code>9a54cdbc</code>"]
  nacd3ca75["discovery-receipt.json#91<br/><code>acd3ca75</code>"]
  n3e5e07eb["discovery-receipt.json#92<br/><code>3e5e07eb</code>"]
  n9a3c0fe8["discovery-receipt.json#93<br/><code>9a3c0fe8</code>"]
  n6ee2ecf3["discovery-receipt.json#94<br/><code>6ee2ecf3</code>"]
  na7512a99["discovery-receipt.json#95<br/><code>a7512a99</code>"]
  ne2b0ff54["discovery-receipt.json#96<br/><code>e2b0ff54</code>"]
  nfa572771["discovery-receipt.json#97<br/><code>fa572771</code>"]
  n17f29234["discovery-receipt.json#98<br/><code>17f29234</code>"]
  n92752eb2["discovery-receipt.json#99<br/><code>92752eb2</code>"]
  n36681a97["discovery-receipt.json#100<br/><code>36681a97</code>"]
  nd63fe463["discovery-receipt.json#101<br/><code>d63fe463</code>"]
  n56cc6b86["discovery-receipt.json#102<br/><code>56cc6b86</code>"]
  n81adc527["discovery-receipt.json#103<br/><code>81adc527</code>"]
  ncd20cea2["discovery-receipt.json#104<br/><code>cd20cea2</code>"]
  n0a0e5be5["discovery-receipt.json#105<br/><code>0a0e5be5</code>"]
  n33a31936["discovery-receipt.json#106<br/><code>33a31936</code>"]
  n60ea46bc["discovery-receipt.json#107<br/><code>60ea46bc</code>"]
  n7a7d6145["discovery-receipt.json#108<br/><code>7a7d6145</code>"]
  ncfbe3f80["discovery-receipt.json#109<br/><code>cfbe3f80</code>"]
  n66629425["discovery-receipt.json#110<br/><code>66629425</code>"]
  nfd59d692["discovery-receipt.json#111<br/><code>fd59d692</code>"]
  n29f941a2["discovery-receipt.json#112<br/><code>29f941a2</code>"]
  nbe5c92f0["discovery-receipt.json#113<br/><code>be5c92f0</code>"]
  n5f27e337["discovery-receipt.json#114<br/><code>5f27e337</code>"]
  n44faa81d["discovery-receipt.json#115<br/><code>44faa81d</code>"]
  nc5fb2ff6["discovery-receipt.json#116<br/><code>c5fb2ff6</code>"]
  n2284746c["discovery-receipt.json#117<br/><code>2284746c</code>"]
  n55a94846["discovery-receipt.json#118<br/><code>55a94846</code>"]
  n1a06a713["discovery-receipt.json#119<br/><code>1a06a713</code>"]
  n6ac66dc7["discovery-receipt.json#120<br/><code>6ac66dc7</code>"]
  ne8ab37b6["discovery-receipt.json#121<br/><code>e8ab37b6</code>"]
  nc9f4e6ca["discovery-receipt.json#122<br/><code>c9f4e6ca</code>"]
  nfb9218fc["discovery-receipt.json#123<br/><code>fb9218fc</code>"]
  n5de15297["discovery-receipt.json#124<br/><code>5de15297</code>"]
  n040d018b["discovery-receipt.json#125<br/><code>040d018b</code>"]
  n3ed048fb["discovery-receipt.json#126<br/><code>3ed048fb</code>"]
  nebbae416["discovery-receipt.json#127<br/><code>ebbae416</code>"]
  n4c600254["discovery-receipt.json#128<br/><code>4c600254</code>"]
  nb0a75e8f["discovery-receipt.json#129<br/><code>b0a75e8f</code>"]
  n037953cd["discovery-receipt.json#130<br/><code>037953cd</code>"]
  nd18bc1dd["discovery-receipt.json#131<br/><code>d18bc1dd</code>"]
  n3e50343d["discovery-receipt.json#132<br/><code>3e50343d</code>"]
  n164b706e["discovery-receipt.json#133<br/><code>164b706e</code>"]
  na6e613dc["discovery-receipt.json#134<br/><code>a6e613dc</code>"]
  n1d9c64aa["discovery-receipt.json#135<br/><code>1d9c64aa</code>"]
  nf6d184f0["discovery-receipt.json#136<br/><code>f6d184f0</code>"]
  n9149928d["discovery-receipt.json#137<br/><code>9149928d</code>"]
  n663b3412["discovery-receipt.json#138<br/><code>663b3412</code>"]
  n733efda6["discovery-receipt.json#139<br/><code>733efda6</code>"]
  nad7de8ef["discovery-receipt.json#140<br/><code>ad7de8ef</code>"]
  n3c022113["discovery-receipt.json#141<br/><code>3c022113</code>"]
  nb12533b4["discovery-receipt.json#142<br/><code>b12533b4</code>"]
  n53ad13c2["discovery-receipt.json#143<br/><code>53ad13c2</code>"]
  n618b8aa7["discovery-receipt.json#144<br/><code>618b8aa7</code>"]
  n0feb8131["discovery-receipt.json#145<br/><code>0feb8131</code>"]
  n573ee94f["discovery-receipt.json#146<br/><code>573ee94f</code>"]
  nf3dcb1e4["discovery-receipt.json#147<br/><code>f3dcb1e4</code>"]
  n84f3525a["discovery-receipt.json#148<br/><code>84f3525a</code>"]
  n283f60f7["discovery-receipt.json#149<br/><code>283f60f7</code>"]
  n4698fd30["discovery-receipt.json#150<br/><code>4698fd30</code>"]
  n82108337["discovery-receipt.json#151<br/><code>82108337</code>"]
  n68022ae4["discovery-receipt.json#152<br/><code>68022ae4</code>"]
  nfe746fe9["discovery-receipt.json#153<br/><code>fe746fe9</code>"]
  n4d621ee4["discovery-receipt.json#154<br/><code>4d621ee4</code>"]
  n53b3dce2["discovery-receipt.json#155<br/><code>53b3dce2</code>"]
  n37ebd276["discovery-receipt.json#156<br/><code>37ebd276</code>"]
  n2c737baa["discovery-receipt.json#157<br/><code>2c737baa</code>"]
  n6b90504f["discovery-receipt.json#158<br/><code>6b90504f</code>"]
  n46a95954["discovery-receipt.json#159<br/><code>46a95954</code>"]
  nd7df94e4["discovery-receipt.json#160<br/><code>d7df94e4</code>"]
  nd135aebe["discovery-receipt.json#161<br/><code>d135aebe</code>"]
  n1694c00a["discovery-receipt.json#162<br/><code>1694c00a</code>"]
  n62da04cf["discovery-receipt.json#163<br/><code>62da04cf</code>"]
  n576b5062["discovery-receipt.json#164<br/><code>576b5062</code>"]
  n373374c2["discovery-receipt.json#165<br/><code>373374c2</code>"]
  n27eaa13e["discovery-receipt.json#166<br/><code>27eaa13e</code>"]
  n54810f29["discovery-receipt.json#167<br/><code>54810f29</code>"]
  ndad80ab8["discovery-receipt.json#168<br/><code>dad80ab8</code>"]
  nfaf7826e["discovery-receipt.json#169<br/><code>faf7826e</code>"]
  n21c4c1ef["discovery-receipt.json#170<br/><code>21c4c1ef</code>"]
  nf7c01fac["discovery-receipt.json#171<br/><code>f7c01fac</code>"]
  n79b2b8b5["discovery-receipt.json#172<br/><code>79b2b8b5</code>"]
  n232b2035["discovery-receipt.json#173<br/><code>232b2035</code>"]
  nbd8b7e8e["discovery-receipt.json#174<br/><code>bd8b7e8e</code>"]
  n232336b4["discovery-receipt.json#175<br/><code>232336b4</code>"]
  n740e7bb9["discovery-receipt.json#176<br/><code>740e7bb9</code>"]
  n0368c48c["discovery-receipt.json#177<br/><code>0368c48c</code>"]
  ned4a3be8["discovery-receipt.json#178<br/><code>ed4a3be8</code>"]
  nb3888002["discovery-receipt.json#179<br/><code>b3888002</code>"]
  n34112abf["discovery-receipt.json#180<br/><code>34112abf</code>"]
  nfc2cff90["discovery-receipt.json#181<br/><code>fc2cff90</code>"]
  n766de8a3["discovery-receipt.json#182<br/><code>766de8a3</code>"]
  ncc529999["discovery-receipt.json#183<br/><code>cc529999</code>"]
  n38c3f2be["discovery-receipt.json#184<br/><code>38c3f2be</code>"]
  n0903f7b2["discovery-receipt.json#185<br/><code>0903f7b2</code>"]
  n00509596["discovery-receipt.json#186<br/><code>00509596</code>"]
  n27fffa1c["discovery-receipt.json#187<br/><code>27fffa1c</code>"]
  n2076285b["discovery-receipt.json#188<br/><code>2076285b</code>"]
  n7e637243["discovery-receipt.json#189<br/><code>7e637243</code>"]
  n88e451b7["discovery-receipt.json#190<br/><code>88e451b7</code>"]
  n8c673627["discovery-receipt.json#191<br/><code>8c673627</code>"]
  n9ae240f6["discovery-receipt.json#192<br/><code>9ae240f6</code>"]
  n1ec7e4bf["discovery-receipt.json#193<br/><code>1ec7e4bf</code>"]
  n564408a5["discovery-receipt.json#194<br/><code>564408a5</code>"]
  nc4865abe["discovery-receipt.json#195<br/><code>c4865abe</code>"]
  n7621f6b2["discovery-receipt.json#196<br/><code>7621f6b2</code>"]
  need19b99["discovery-receipt.json#197<br/><code>eed19b99</code>"]
  n3a466de6["discovery-receipt.json#198<br/><code>3a466de6</code>"]
  nb8005b8c["discovery-receipt.json#199<br/><code>b8005b8c</code>"]
  nbed94654["discovery-receipt.json#200<br/><code>bed94654</code>"]
  ne20529d0["discovery-receipt.json#201<br/><code>e20529d0</code>"]
  n44ce3e69["discovery-receipt.json#202<br/><code>44ce3e69</code>"]
  n157a95d5["discovery-receipt.json#203<br/><code>157a95d5</code>"]
  n10e7dd8b["discovery-receipt.json#204<br/><code>10e7dd8b</code>"]
  n5212eb32["discovery-receipt.json#205<br/><code>5212eb32</code>"]
  n2e7e7a84["discovery-receipt.json#206<br/><code>2e7e7a84</code>"]
  nfaadabea["discovery-receipt.json#207<br/><code>faadabea</code>"]
  nea522328["discovery-receipt.json#208<br/><code>ea522328</code>"]
  nadf91266["discovery-receipt.json#209<br/><code>adf91266</code>"]
  nbe6fe785["discovery-receipt.json#210<br/><code>be6fe785</code>"]
  n181b9424["discovery-receipt.json#211<br/><code>181b9424</code>"]
  n6ebed8aa["discovery-receipt.json#212<br/><code>6ebed8aa</code>"]
  nef594d2f["discovery-receipt.json#213<br/><code>ef594d2f</code>"]
  na7eea3ef["discovery-receipt.json#214<br/><code>a7eea3ef</code>"]
  n07933d1f["discovery-receipt.json#215<br/><code>07933d1f</code>"]
  n53eb375c["discovery-receipt.json#216<br/><code>53eb375c</code>"]
  ne7717789["discovery-receipt.json#217<br/><code>e7717789</code>"]
  na60813a1["discovery-receipt.json#218<br/><code>a60813a1</code>"]
  n111a7837["discovery-receipt.json#219<br/><code>111a7837</code>"]
  n649749d7["discovery-receipt.json#220<br/><code>649749d7</code>"]
  n90988773["discovery-receipt.json#221<br/><code>90988773</code>"]
  n1e35a508["discovery-receipt.json#222<br/><code>1e35a508</code>"]
  n415e8229["discovery-receipt.json#223<br/><code>415e8229</code>"]
  n533bb20f["discovery-receipt.json#224<br/><code>533bb20f</code>"]
  n785f82a5["discovery-receipt.json#225<br/><code>785f82a5</code>"]
  nb292ec0b["discovery-receipt.json#226<br/><code>b292ec0b</code>"]
  nccfcf0da["discovery-receipt.json#227<br/><code>ccfcf0da</code>"]
  nb77628f2["discovery-receipt.json#228<br/><code>b77628f2</code>"]
  n86a44de3["discovery-receipt.json#229<br/><code>86a44de3</code>"]
  n99384329["flaws-receipt.json<br/><code>99384329</code>"]
  n0b49234b["formulas-receipt.json<br/><code>0b49234b</code>"]
  n3d2059d3["formulas-receipt.json#0<br/><code>3d2059d3</code>"]
  n122cdba7["formulas-receipt.json#1<br/><code>122cdba7</code>"]
  n1fb846be["formulas-receipt.json#2<br/><code>1fb846be</code>"]
  n4744c715["formulas-receipt.json#3<br/><code>4744c715</code>"]
  nbf27b91c["formulas-receipt.json#4<br/><code>bf27b91c</code>"]
  n3a4538c2["formulas-receipt.json#5<br/><code>3a4538c2</code>"]
  n0ee1fae4["formulas-receipt.json#6<br/><code>0ee1fae4</code>"]
  n29bfabd6["formulas-receipt.json#7<br/><code>29bfabd6</code>"]
  n3b83044b["formulas-receipt.json#8<br/><code>3b83044b</code>"]
  n26be92fa["formulas-receipt.json#9<br/><code>26be92fa</code>"]
  nd12391a5["formulas-receipt.json#10<br/><code>d12391a5</code>"]
  n6676b096["formulas-receipt.json#11<br/><code>6676b096</code>"]
  n611b940b["formulas-receipt.json#12<br/><code>611b940b</code>"]
  nc85cbebe["formulas-receipt.json#13<br/><code>c85cbebe</code>"]
  neb4276db["formulas-receipt.json#14<br/><code>eb4276db</code>"]
  n082487f1["formulas-receipt.json#15<br/><code>082487f1</code>"]
  nc6a9f49d["formulas-receipt.json#16<br/><code>c6a9f49d</code>"]
  nefce3e20["formulas-receipt.json#17<br/><code>efce3e20</code>"]
  n05a4bb1c["formulas-receipt.json#18<br/><code>05a4bb1c</code>"]
  n2ff87b3f["formulas-receipt.json#19<br/><code>2ff87b3f</code>"]
  n85da7373["formulas-receipt.json#20<br/><code>85da7373</code>"]
  n7e8ae26d["formulas-receipt.json#21<br/><code>7e8ae26d</code>"]
  n52355949["formulas-receipt.json#22<br/><code>52355949</code>"]
  n223b4a3d["formulas-receipt.json#23<br/><code>223b4a3d</code>"]
  na32326ca["formulas-receipt.json#24<br/><code>a32326ca</code>"]
  n57ef6049["formulas-receipt.json#25<br/><code>57ef6049</code>"]
  n51d2fdf6["formulas-receipt.json#26<br/><code>51d2fdf6</code>"]
  n8cd01ab7["formulas-receipt.json#27<br/><code>8cd01ab7</code>"]
  n9abb948c["formulas-receipt.json#28<br/><code>9abb948c</code>"]
  n31755ea3["formulas-receipt.json#29<br/><code>31755ea3</code>"]
  na355128a["formulas-receipt.json#30<br/><code>a355128a</code>"]
  ne589841c["formulas-receipt.json#31<br/><code>e589841c</code>"]
  n8118c934["formulas-receipt.json#32<br/><code>8118c934</code>"]
  na93b7883["formulas-receipt.json#33<br/><code>a93b7883</code>"]
  nf6c79102["formulas-receipt.json#34<br/><code>f6c79102</code>"]
  n9c9f8b5a["formulas-receipt.json#35<br/><code>9c9f8b5a</code>"]
  na7c7bc9e["formulas-receipt.json#36<br/><code>a7c7bc9e</code>"]
  n1c8dc3bd["formulas-receipt.json#37<br/><code>1c8dc3bd</code>"]
  n796eb868["formulas-receipt.json#38<br/><code>796eb868</code>"]
  nd2487d9f["formulas-receipt.json#39<br/><code>d2487d9f</code>"]
  n6cf94ea3["formulas-receipt.json#40<br/><code>6cf94ea3</code>"]
  na1865459["formulas-receipt.json#41<br/><code>a1865459</code>"]
  n9c188d9e["formulas-receipt.json#42<br/><code>9c188d9e</code>"]
  n904cbda8["formulas-receipt.json#43<br/><code>904cbda8</code>"]
  na74440cf["formulas-receipt.json#44<br/><code>a74440cf</code>"]
  ne453330c["formulas-receipt.json#45<br/><code>e453330c</code>"]
  na50867d8["formulas-receipt.json#46<br/><code>a50867d8</code>"]
  n55829bab["formulas-receipt.json#47<br/><code>55829bab</code>"]
  na8df055f["formulas-receipt.json#48<br/><code>a8df055f</code>"]
  nb85c441f["formulas-receipt.json#49<br/><code>b85c441f</code>"]
  n5ba85722["formulas-receipt.json#50<br/><code>5ba85722</code>"]
  n747a988c["formulas-receipt.json#51<br/><code>747a988c</code>"]
  n01fd9128["formulas-receipt.json#52<br/><code>01fd9128</code>"]
  n6bf1cc70["formulas-receipt.json#53<br/><code>6bf1cc70</code>"]
  n8123449b["formulas-receipt.json#54<br/><code>8123449b</code>"]
  nb5a57efb["formulas-receipt.json#55<br/><code>b5a57efb</code>"]
  nf41bf9ff["formulas-receipt.json#56<br/><code>f41bf9ff</code>"]
  n70ad65f2["formulas-receipt.json#57<br/><code>70ad65f2</code>"]
  n90f6874c["formulas-receipt.json#58<br/><code>90f6874c</code>"]
  n0cf5a8f7["formulas-receipt.json#59<br/><code>0cf5a8f7</code>"]
  n1660c833["formulas-receipt.json#60<br/><code>1660c833</code>"]
  n4ae1e17f["formulas-receipt.json#61<br/><code>4ae1e17f</code>"]
  n7eaaca59["formulas-receipt.json#62<br/><code>7eaaca59</code>"]
  n6018e7ce["formulas-receipt.json#63<br/><code>6018e7ce</code>"]
  n30f53e63["formulas-receipt.json#64<br/><code>30f53e63</code>"]
  n597dee7a["formulas-receipt.json#65<br/><code>597dee7a</code>"]
  n5a4833c7["formulas-receipt.json#66<br/><code>5a4833c7</code>"]
  n71e57233["formulas-receipt.json#67<br/><code>71e57233</code>"]
  ndd1578e4["formulas-receipt.json#68<br/><code>dd1578e4</code>"]
  n07037204["formulas-receipt.json#69<br/><code>07037204</code>"]
  nc57dff73["formulas-receipt.json#70<br/><code>c57dff73</code>"]
  nd501fe7e["formulas-receipt.json#71<br/><code>d501fe7e</code>"]
  n6f041ae5["formulas-receipt.json#72<br/><code>6f041ae5</code>"]
  ned6df0bd["formulas-receipt.json#73<br/><code>ed6df0bd</code>"]
  n0b31db37["formulas-receipt.json#74<br/><code>0b31db37</code>"]
  n79762620["formulas-receipt.json#75<br/><code>79762620</code>"]
  n3a71afc0["formulas-receipt.json#76<br/><code>3a71afc0</code>"]
  n63f029d4["formulas-receipt.json#77<br/><code>63f029d4</code>"]
  n36b4cb41["formulas-receipt.json#78<br/><code>36b4cb41</code>"]
  n8ec75d64["fuse-receipt.json<br/><code>8ec75d64</code>"]
  n2348a986["heat-receipt.json<br/><code>2348a986</code>"]
  ndbd90c94["heat-receipt.json#0<br/><code>dbd90c94</code>"]
  nf5385f79["heat-receipt.json#1<br/><code>f5385f79</code>"]
  n4156474c["heat-receipt.json#2<br/><code>4156474c</code>"]
  n738590e1["heat-receipt.json#3<br/><code>738590e1</code>"]
  n35aab0c5["heat-receipt.json#4<br/><code>35aab0c5</code>"]
  n88c540e8["heat-receipt.json#5<br/><code>88c540e8</code>"]
  nf069bf9c["heat-receipt.json#6<br/><code>f069bf9c</code>"]
  nc8d7b94d["heat-receipt.json#7<br/><code>c8d7b94d</code>"]
  n9ff3609a["heat-receipt.json#8<br/><code>9ff3609a</code>"]
  n363e9769["heat-receipt.json#9<br/><code>363e9769</code>"]
  n59de9074["heat-receipt.json#10<br/><code>59de9074</code>"]
  nf275c409["heat-receipt.json#11<br/><code>f275c409</code>"]
  n2a7ef551["heat-receipt.json#12<br/><code>2a7ef551</code>"]
  n84be3d5f["heat-receipt.json#13<br/><code>84be3d5f</code>"]
  nf4727853["heat-receipt.json#14<br/><code>f4727853</code>"]
  n169a18f9["heat-receipt.json#15<br/><code>169a18f9</code>"]
  n213b0063["heat-receipt.json#16<br/><code>213b0063</code>"]
  nea725e51["heat-receipt.json#17<br/><code>ea725e51</code>"]
  n9b351299["heat-receipt.json#18<br/><code>9b351299</code>"]
  n8fc46eec["heat-receipt.json#19<br/><code>8fc46eec</code>"]
  nf7b862ff["heat-receipt.json#20<br/><code>f7b862ff</code>"]
  n2a4f9028["heat-receipt.json#21<br/><code>2a4f9028</code>"]
  neb361c82["heat-receipt.json#22<br/><code>eb361c82</code>"]
  n7e432f03["heat-receipt.json#23<br/><code>7e432f03</code>"]
  n85bdcd34["heat-receipt.json#24<br/><code>85bdcd34</code>"]
  n04918d1f["heat-receipt.json#25<br/><code>04918d1f</code>"]
  ndfa87f74["heat-receipt.json#26<br/><code>dfa87f74</code>"]
  nf453c0d8["heat-receipt.json#27<br/><code>f453c0d8</code>"]
  n35f0134e["heat-receipt.json#28<br/><code>35f0134e</code>"]
  nf427bae2["heat-receipt.json#29<br/><code>f427bae2</code>"]
  nf1cae088["heat-receipt.json#30<br/><code>f1cae088</code>"]
  ne3ebe465["heat-receipt.json#31<br/><code>e3ebe465</code>"]
  na747466f["heat-receipt.json#32<br/><code>a747466f</code>"]
  n5fcf0061["heat-receipt.json#33<br/><code>5fcf0061</code>"]
  n583a4d8b["heat-receipt.json#34<br/><code>583a4d8b</code>"]
  nc3b32d94["heat-receipt.json#35<br/><code>c3b32d94</code>"]
  n797c304d["heat-receipt.json#36<br/><code>797c304d</code>"]
  n742389e4["heat-receipt.json#37<br/><code>742389e4</code>"]
  nba8ac9dc["heat-receipt.json#38<br/><code>ba8ac9dc</code>"]
  n16344130["heat-receipt.json#39<br/><code>16344130</code>"]
  n2d2d7ccf["lattice-receipt.json<br/><code>2d2d7ccf</code>"]
  n1a5f4a99["lean-receipt.json<br/><code>1a5f4a99</code>"]
  n58263a57["lean-receipt.json#0<br/><code>58263a57</code>"]
  n07d835fa["lean-receipt.json#1<br/><code>07d835fa</code>"]
  n388a9f96["lean-receipt.json#2<br/><code>388a9f96</code>"]
  n03a9a055["lean-receipt.json#3<br/><code>03a9a055</code>"]
  n8e613a62["lean-receipt.json#4<br/><code>8e613a62</code>"]
  ne986de65["lean-receipt.json#5<br/><code>e986de65</code>"]
  n0785bbdd["lean-receipt.json#6<br/><code>0785bbdd</code>"]
  n0c09d334["lean-receipt.json#7<br/><code>0c09d334</code>"]
  n54f262d6["lean-receipt.json#8<br/><code>54f262d6</code>"]
  n5fb29085["lean-receipt.json#9<br/><code>5fb29085</code>"]
  n9a2ef8b6["lean-receipt.json#10<br/><code>9a2ef8b6</code>"]
  n357b6dae["lean-receipt.json#11<br/><code>357b6dae</code>"]
  n70c640f2["lean-receipt.json#12<br/><code>70c640f2</code>"]
  n97978321["lean-receipt.json#13<br/><code>97978321</code>"]
  n19b7a62f["lean-receipt.json#14<br/><code>19b7a62f</code>"]
  n5586ac39["lean-receipt.json#15<br/><code>5586ac39</code>"]
  ne9e1bc14["lean-receipt.json#16<br/><code>e9e1bc14</code>"]
  nf2eee90f["lean-receipt.json#17<br/><code>f2eee90f</code>"]
  nb8f1e02a["lean-receipt.json#18<br/><code>b8f1e02a</code>"]
  n73a75339["lean-receipt.json#19<br/><code>73a75339</code>"]
  nb065a947["lean-receipt.json#20<br/><code>b065a947</code>"]
  n83b7cb32["lean-receipt.json#21<br/><code>83b7cb32</code>"]
  n0af42176["lean-receipt.json#22<br/><code>0af42176</code>"]
  nabd2c3f8["lean-receipt.json#23<br/><code>abd2c3f8</code>"]
  nd461ac00["lean-receipt.json#24<br/><code>d461ac00</code>"]
  n31f4ab4d["lean-receipt.json#25<br/><code>31f4ab4d</code>"]
  n99c794f5["lean-receipt.json#26<br/><code>99c794f5</code>"]
  ndf38bb0b["lean-receipt.json#27<br/><code>df38bb0b</code>"]
  n02078a0a["lean-receipt.json#28<br/><code>02078a0a</code>"]
  n1050260d["lean-receipt.json#29<br/><code>1050260d</code>"]
  n8eb6ca55["lean-receipt.json#30<br/><code>8eb6ca55</code>"]
  nee878290["lean-receipt.json#31<br/><code>ee878290</code>"]
  n94a6a929["lean-receipt.json#32<br/><code>94a6a929</code>"]
  n35bd6693["lean-receipt.json#33<br/><code>35bd6693</code>"]
  n3bfd41a6["lean-receipt.json#34<br/><code>3bfd41a6</code>"]
  n8a778827["lean-receipt.json#35<br/><code>8a778827</code>"]
  n12261a2d["lean-receipt.json#36<br/><code>12261a2d</code>"]
  n47800eb0["lean-receipt.json#37<br/><code>47800eb0</code>"]
  nf0ed362b["lean-receipt.json#38<br/><code>f0ed362b</code>"]
  nd1daf2b7["lean-receipt.json#39<br/><code>d1daf2b7</code>"]
  n7ff5fbeb["lean-receipt.json#40<br/><code>7ff5fbeb</code>"]
  n685a1f01["lean-receipt.json#41<br/><code>685a1f01</code>"]
  n87f0cb06["lean-receipt.json#42<br/><code>87f0cb06</code>"]
  nc18c74b8["lean-receipt.json#43<br/><code>c18c74b8</code>"]
  n26399ae6["lean-receipt.json#44<br/><code>26399ae6</code>"]
  naca13174["lean-receipt.json#45<br/><code>aca13174</code>"]
  n666462c7["lean-receipt.json#46<br/><code>666462c7</code>"]
  n47f0efe9["lean-receipt.json#47<br/><code>47f0efe9</code>"]
  na84ee201["lean-receipt.json#48<br/><code>a84ee201</code>"]
  ndb48c610["lean-receipt.json#49<br/><code>db48c610</code>"]
  n3ab5902f["lean-receipt.json#50<br/><code>3ab5902f</code>"]
  n5e146c01["lean-receipt.json#51<br/><code>5e146c01</code>"]
  n92c5094d["lean-receipt.json#52<br/><code>92c5094d</code>"]
  n63189fc5["lean-receipt.json#53<br/><code>63189fc5</code>"]
  nac2d0a1f["lean-receipt.json#54<br/><code>ac2d0a1f</code>"]
  ndb59f36d["lean-receipt.json#55<br/><code>db59f36d</code>"]
  n2fa603e4["lean-receipt.json#56<br/><code>2fa603e4</code>"]
  ned533f0c["lean-receipt.json#57<br/><code>ed533f0c</code>"]
  n2ebd0f8f["lean-receipt.json#58<br/><code>2ebd0f8f</code>"]
  n402e4912["lean-receipt.json#59<br/><code>402e4912</code>"]
  n723f18d2["lean-receipt.json#60<br/><code>723f18d2</code>"]
  n50c747c8["lean-receipt.json#61<br/><code>50c747c8</code>"]
  nee9348f4["lean-receipt.json#62<br/><code>ee9348f4</code>"]
  nff4eeb84["lean-receipt.json#63<br/><code>ff4eeb84</code>"]
  n92747809["lean-receipt.json#64<br/><code>92747809</code>"]
  na4c660b0["lean-receipt.json#65<br/><code>a4c660b0</code>"]
  nfc4500a5["lean-receipt.json#66<br/><code>fc4500a5</code>"]
  n74c4df39["lean-receipt.json#67<br/><code>74c4df39</code>"]
  n10ad2eba["lean-receipt.json#68<br/><code>10ad2eba</code>"]
  n47f248ac["lean-receipt.json#69<br/><code>47f248ac</code>"]
  n8ac51c85["lean-receipt.json#70<br/><code>8ac51c85</code>"]
  nf01e7f42["lean-receipt.json#71<br/><code>f01e7f42</code>"]
  n9e4ce99a["lean-receipt.json#72<br/><code>9e4ce99a</code>"]
  n19e32fb2["lean-receipt.json#73<br/><code>19e32fb2</code>"]
  nd5ab5e8f["lean-receipt.json#74<br/><code>d5ab5e8f</code>"]
  n1082ed1c["lean-receipt.json#75<br/><code>1082ed1c</code>"]
  n797bb6da["lean-receipt.json#76<br/><code>797bb6da</code>"]
  nac7da8ce["lean-receipt.json#77<br/><code>ac7da8ce</code>"]
  n598dfed0["lean-receipt.json#78<br/><code>598dfed0</code>"]
  n7b76aa15["lean-receipt.json#79<br/><code>7b76aa15</code>"]
  n3a0396d3["lean-receipt.json#80<br/><code>3a0396d3</code>"]
  n1405d1b3["lean-receipt.json#81<br/><code>1405d1b3</code>"]
  n15262ff9["lean-receipt.json#82<br/><code>15262ff9</code>"]
  n1c5cd857["lean-receipt.json#83<br/><code>1c5cd857</code>"]
  n429036cf["lean-receipt.json#84<br/><code>429036cf</code>"]
  ne0dc70da["lean-receipt.json#85<br/><code>e0dc70da</code>"]
  nccc9a42a["lean-receipt.json#86<br/><code>ccc9a42a</code>"]
  n7f671737["lean-receipt.json#87<br/><code>7f671737</code>"]
  n51f45a7c["lean-receipt.json#88<br/><code>51f45a7c</code>"]
  ndd36994c["lean-receipt.json#89<br/><code>dd36994c</code>"]
  n573576be["lean-receipt.json#90<br/><code>573576be</code>"]
  nd7aadc8a["lean-receipt.json#91<br/><code>d7aadc8a</code>"]
  nb88b91ca["lean-receipt.json#92<br/><code>b88b91ca</code>"]
  nf6ff8cdf["lean-receipt.json#93<br/><code>f6ff8cdf</code>"]
  nefee4812["lean-receipt.json#94<br/><code>efee4812</code>"]
  ncf09be1e["lean-receipt.json#95<br/><code>cf09be1e</code>"]
  n5dfacbda["lean-receipt.json#96<br/><code>5dfacbda</code>"]
  n14dd5c58["lean-receipt.json#97<br/><code>14dd5c58</code>"]
  n651bd231["lean-receipt.json#98<br/><code>651bd231</code>"]
  ne5696a82["lean-receipt.json#99<br/><code>e5696a82</code>"]
  n06ecf7c4["lean-receipt.json#100<br/><code>06ecf7c4</code>"]
  nf2ebd2a9["lean-receipt.json#101<br/><code>f2ebd2a9</code>"]
  na57489c9["lean-receipt.json#102<br/><code>a57489c9</code>"]
  nd6f5a518["lean-receipt.json#103<br/><code>d6f5a518</code>"]
  n3b65ac95["lean-receipt.json#104<br/><code>3b65ac95</code>"]
  ndc3a829d["lean-receipt.json#105<br/><code>dc3a829d</code>"]
  n791c0068["lean-receipt.json#106<br/><code>791c0068</code>"]
  n37acb686["lean-receipt.json#107<br/><code>37acb686</code>"]
  n97291be6["lean-receipt.json#108<br/><code>97291be6</code>"]
  n1cf49047["lean-receipt.json#109<br/><code>1cf49047</code>"]
  n402e14a0["lean-receipt.json#110<br/><code>402e14a0</code>"]
  n5090a3d1["lean-receipt.json#111<br/><code>5090a3d1</code>"]
  n7fad7178["lean-receipt.json#112<br/><code>7fad7178</code>"]
  n78a1b6d8["lean-receipt.json#113<br/><code>78a1b6d8</code>"]
  n1c11efd9["lean-receipt.json#114<br/><code>1c11efd9</code>"]
  n2b86e2f9["lean-receipt.json#115<br/><code>2b86e2f9</code>"]
  nb8c65bbf["lean-receipt.json#116<br/><code>b8c65bbf</code>"]
  naf704e68["lean-receipt.json#117<br/><code>af704e68</code>"]
  n25bf1640["lean-receipt.json#118<br/><code>25bf1640</code>"]
  n4417ca50["lean-receipt.json#119<br/><code>4417ca50</code>"]
  n5114ffaf["lean-receipt.json#120<br/><code>5114ffaf</code>"]
  n6a10ef3f["lean-receipt.json#121<br/><code>6a10ef3f</code>"]
  nd52d71e5["lean-receipt.json#122<br/><code>d52d71e5</code>"]
  n966da024["lean-receipt.json#123<br/><code>966da024</code>"]
  n665f38b3["payload-cf-receipt.json<br/><code>665f38b3</code>"]
  na4369bde["percall-receipt.json<br/><code>a4369bde</code>"]
  na8e4163f["refusals-receipt.json<br/><code>a8e4163f</code>"]
  nd6d27344["test-receipt.json<br/><code>d6d27344</code>"]
  na8f560d3["test-receipt.json#0<br/><code>a8f560d3</code>"]
  n86110348["test-receipt.json#1<br/><code>86110348</code>"]
  nc503dc23["test-receipt.json#2<br/><code>c503dc23</code>"]
  na13c43f0["test-receipt.json#3<br/><code>a13c43f0</code>"]
  n4ec73578["test-receipt.json#4<br/><code>4ec73578</code>"]
  nb81e2de4["test-receipt.json#5<br/><code>b81e2de4</code>"]
  n0ef20e44["test-receipt.json#6<br/><code>0ef20e44</code>"]
  n362e99d2["test-receipt.json#7<br/><code>362e99d2</code>"]
  nc59daee6["test-receipt.json#8<br/><code>c59daee6</code>"]
  nf6cff321["test-receipt.json#9<br/><code>f6cff321</code>"]
  n3a938f3a["test-receipt.json#10<br/><code>3a938f3a</code>"]
  n6b286681["walls-receipt.json<br/><code>6b286681</code>"]
  n5e23d602["readme<br/><code>5e23d602</code>"]
  n3efdf618 --> n3d979984
  n3d979984 --> nc037da2b
  n3d979984 --> n72e6e4d6
  n3d979984 --> ne9ae521d
  n3d979984 --> ncedaa099
  n3d979984 --> n9c5fb560
  n3d979984 --> n2f67b070
  n3d979984 --> nc04d4d07
  n3d979984 --> n2c918719
  n3d979984 --> n421d81e3
  n3d979984 --> n0620424b
  n3d979984 --> nf00c6be4
  n3d979984 --> n00ee3665
  n3d979984 --> nfc951844
  n3d979984 --> n18567652
  n3d979984 --> n244db4f8
  n3d979984 --> n3546be57
  n3d979984 --> n4275e3a8
  n3d979984 --> n4eb30c80
  n3d979984 --> n56a9656c
  n3d979984 --> nc813d3fe
  n3d979984 --> n0f5a30e6
  n3d979984 --> n2f1c9756
  n3d979984 --> n827922a2
  n3d979984 --> n629b1b2b
  n3d979984 --> n2123d1e7
  n3d979984 --> nf6fe021e
  n3d979984 --> n3cc39d3b
  n3d979984 --> n185a0b05
  n3d979984 --> n8a5f1c07
  n3d979984 --> n7bc302b2
  n3efdf618 --> n6403c518
  n3efdf618 --> nb88c9f1c
  nb88c9f1c --> nd279b7c8
  nb88c9f1c --> nf9b0b75e
  nb88c9f1c --> n6eb23a74
  nb88c9f1c --> n3f5d3ec8
  nb88c9f1c --> n04bc44e5
  nb88c9f1c --> n6af453b2
  nb88c9f1c --> n5ce5c570
  nb88c9f1c --> n147be0dc
  nb88c9f1c --> ne97c6e57
  nb88c9f1c --> nd07e2a8f
  nb88c9f1c --> ndd93f388
  nb88c9f1c --> n2d046f0a
  nb88c9f1c --> nc3931f91
  nb88c9f1c --> nec04f186
  nb88c9f1c --> n80b9aba2
  nb88c9f1c --> n0a71bef1
  nb88c9f1c --> n8a08c28a
  nb88c9f1c --> ne46e1947
  nb88c9f1c --> n56ed83cf
  nb88c9f1c --> n4be07c2c
  nb88c9f1c --> ndbe7f43c
  nb88c9f1c --> nf62d34ea
  nb88c9f1c --> n36986951
  nb88c9f1c --> na56a62c9
  nb88c9f1c --> n58a66815
  nb88c9f1c --> n26f4ae45
  nb88c9f1c --> nc280965d
  nb88c9f1c --> n17b646d0
  nb88c9f1c --> n49ccd085
  nb88c9f1c --> nb4a01cec
  nb88c9f1c --> n4af61e31
  nb88c9f1c --> ne1464278
  nb88c9f1c --> nc74e13ed
  nb88c9f1c --> n9d285bd1
  nb88c9f1c --> n7dfc0120
  nb88c9f1c --> nadf5d4b9
  nb88c9f1c --> nf9b092bc
  nb88c9f1c --> n323a0415
  nb88c9f1c --> n17d1f273
  nb88c9f1c --> n1ae1036b
  nb88c9f1c --> n86def864
  nb88c9f1c --> nef7403f8
  nb88c9f1c --> n94a6899d
  nb88c9f1c --> n3da020a8
  nb88c9f1c --> nd19b55fe
  nb88c9f1c --> n0a5f0c27
  nb88c9f1c --> n7574b21a
  nb88c9f1c --> n4576d411
  nb88c9f1c --> n0fa4aa89
  nb88c9f1c --> nadc03d11
  nb88c9f1c --> ncb283674
  nb88c9f1c --> nf47b81d0
  nb88c9f1c --> n880022ad
  nb88c9f1c --> n3bf7042b
  nb88c9f1c --> n1f82a45d
  nb88c9f1c --> n8e16aec5
  nb88c9f1c --> na29c9a4f
  nb88c9f1c --> n95692965
  nb88c9f1c --> n1bbe83a0
  nb88c9f1c --> n409ac80f
  nb88c9f1c --> ne5af2e44
  nb88c9f1c --> nd87cc2ec
  nb88c9f1c --> nea4dd95a
  nb88c9f1c --> nd7f5dc92
  nb88c9f1c --> nf7ec278c
  nb88c9f1c --> n31ef75c3
  nb88c9f1c --> n45b19787
  nb88c9f1c --> n6a891c70
  nb88c9f1c --> ncb92fb2f
  nb88c9f1c --> n8e06baff
  nb88c9f1c --> n329bbc76
  nb88c9f1c --> n7c06873e
  nb88c9f1c --> n361c6224
  nb88c9f1c --> n34026f21
  nb88c9f1c --> ncf0bc282
  nb88c9f1c --> n942d6dd0
  nb88c9f1c --> n26d22af5
  nb88c9f1c --> n35f32cb2
  nb88c9f1c --> n4d49bd47
  nb88c9f1c --> na6d79c0e
  nb88c9f1c --> n7a96ba98
  nb88c9f1c --> nb19481eb
  nb88c9f1c --> n37409fa2
  nb88c9f1c --> nd7e4af18
  nb88c9f1c --> n08eb72f8
  nb88c9f1c --> n12aa1c5f
  nb88c9f1c --> n6ee6a1b0
  nb88c9f1c --> n27363477
  nb88c9f1c --> nd13a74ef
  nb88c9f1c --> n50fc53ed
  nb88c9f1c --> n9a54cdbc
  nb88c9f1c --> nacd3ca75
  nb88c9f1c --> n3e5e07eb
  nb88c9f1c --> n9a3c0fe8
  nb88c9f1c --> n6ee2ecf3
  nb88c9f1c --> na7512a99
  nb88c9f1c --> ne2b0ff54
  nb88c9f1c --> nfa572771
  nb88c9f1c --> n17f29234
  nb88c9f1c --> n92752eb2
  nb88c9f1c --> n36681a97
  nb88c9f1c --> nd63fe463
  nb88c9f1c --> n56cc6b86
  nb88c9f1c --> n81adc527
  nb88c9f1c --> ncd20cea2
  nb88c9f1c --> n0a0e5be5
  nb88c9f1c --> n33a31936
  nb88c9f1c --> n60ea46bc
  nb88c9f1c --> n7a7d6145
  nb88c9f1c --> ncfbe3f80
  nb88c9f1c --> n66629425
  nb88c9f1c --> nfd59d692
  nb88c9f1c --> n29f941a2
  nb88c9f1c --> nbe5c92f0
  nb88c9f1c --> n5f27e337
  nb88c9f1c --> n44faa81d
  nb88c9f1c --> nc5fb2ff6
  nb88c9f1c --> n2284746c
  nb88c9f1c --> n55a94846
  nb88c9f1c --> n1a06a713
  nb88c9f1c --> n6ac66dc7
  nb88c9f1c --> ne8ab37b6
  nb88c9f1c --> nc9f4e6ca
  nb88c9f1c --> nfb9218fc
  nb88c9f1c --> n5de15297
  nb88c9f1c --> n040d018b
  nb88c9f1c --> n3ed048fb
  nb88c9f1c --> nebbae416
  nb88c9f1c --> n4c600254
  nb88c9f1c --> nb0a75e8f
  nb88c9f1c --> n037953cd
  nb88c9f1c --> nd18bc1dd
  nb88c9f1c --> n3e50343d
  nb88c9f1c --> n164b706e
  nb88c9f1c --> na6e613dc
  nb88c9f1c --> n1d9c64aa
  nb88c9f1c --> nf6d184f0
  nb88c9f1c --> n9149928d
  nb88c9f1c --> n663b3412
  nb88c9f1c --> n733efda6
  nb88c9f1c --> nad7de8ef
  nb88c9f1c --> n3c022113
  nb88c9f1c --> nb12533b4
  nb88c9f1c --> n53ad13c2
  nb88c9f1c --> n618b8aa7
  nb88c9f1c --> n0feb8131
  nb88c9f1c --> n573ee94f
  nb88c9f1c --> nf3dcb1e4
  nb88c9f1c --> n84f3525a
  nb88c9f1c --> n283f60f7
  nb88c9f1c --> n4698fd30
  nb88c9f1c --> n82108337
  nb88c9f1c --> n68022ae4
  nb88c9f1c --> nfe746fe9
  nb88c9f1c --> n4d621ee4
  nb88c9f1c --> n53b3dce2
  nb88c9f1c --> n37ebd276
  nb88c9f1c --> n2c737baa
  nb88c9f1c --> n6b90504f
  nb88c9f1c --> n46a95954
  nb88c9f1c --> nd7df94e4
  nb88c9f1c --> nd135aebe
  nb88c9f1c --> n1694c00a
  nb88c9f1c --> n62da04cf
  nb88c9f1c --> n576b5062
  nb88c9f1c --> n373374c2
  nb88c9f1c --> n27eaa13e
  nb88c9f1c --> n54810f29
  nb88c9f1c --> ndad80ab8
  nb88c9f1c --> nfaf7826e
  nb88c9f1c --> n21c4c1ef
  nb88c9f1c --> nf7c01fac
  nb88c9f1c --> n79b2b8b5
  nb88c9f1c --> n232b2035
  nb88c9f1c --> nbd8b7e8e
  nb88c9f1c --> n232336b4
  nb88c9f1c --> n740e7bb9
  nb88c9f1c --> n0368c48c
  nb88c9f1c --> ned4a3be8
  nb88c9f1c --> nb3888002
  nb88c9f1c --> n34112abf
  nb88c9f1c --> nfc2cff90
  nb88c9f1c --> n766de8a3
  nb88c9f1c --> ncc529999
  nb88c9f1c --> n38c3f2be
  nb88c9f1c --> n0903f7b2
  nb88c9f1c --> n00509596
  nb88c9f1c --> n27fffa1c
  nb88c9f1c --> n2076285b
  nb88c9f1c --> n7e637243
  nb88c9f1c --> n88e451b7
  nb88c9f1c --> n8c673627
  nb88c9f1c --> n9ae240f6
  nb88c9f1c --> n1ec7e4bf
  nb88c9f1c --> n564408a5
  nb88c9f1c --> nc4865abe
  nb88c9f1c --> n7621f6b2
  nb88c9f1c --> need19b99
  nb88c9f1c --> n3a466de6
  nb88c9f1c --> nb8005b8c
  nb88c9f1c --> nbed94654
  nb88c9f1c --> ne20529d0
  nb88c9f1c --> n44ce3e69
  nb88c9f1c --> n157a95d5
  nb88c9f1c --> n10e7dd8b
  nb88c9f1c --> n5212eb32
  nb88c9f1c --> n2e7e7a84
  nb88c9f1c --> nfaadabea
  nb88c9f1c --> nea522328
  nb88c9f1c --> nadf91266
  nb88c9f1c --> nbe6fe785
  nb88c9f1c --> n181b9424
  nb88c9f1c --> n6ebed8aa
  nb88c9f1c --> nef594d2f
  nb88c9f1c --> na7eea3ef
  nb88c9f1c --> n07933d1f
  nb88c9f1c --> n53eb375c
  nb88c9f1c --> ne7717789
  nb88c9f1c --> na60813a1
  nb88c9f1c --> n111a7837
  nb88c9f1c --> n649749d7
  nb88c9f1c --> n90988773
  nb88c9f1c --> n1e35a508
  nb88c9f1c --> n415e8229
  nb88c9f1c --> n533bb20f
  nb88c9f1c --> n785f82a5
  nb88c9f1c --> nb292ec0b
  nb88c9f1c --> nccfcf0da
  nb88c9f1c --> nb77628f2
  nb88c9f1c --> n86a44de3
  n3efdf618 --> n99384329
  n3efdf618 --> n0b49234b
  n0b49234b --> n3d2059d3
  n0b49234b --> n122cdba7
  n0b49234b --> n1fb846be
  n0b49234b --> n4744c715
  n0b49234b --> nbf27b91c
  n0b49234b --> n3a4538c2
  n0b49234b --> n0ee1fae4
  n0b49234b --> n29bfabd6
  n0b49234b --> n3b83044b
  n0b49234b --> n26be92fa
  n0b49234b --> nd12391a5
  n0b49234b --> n6676b096
  n0b49234b --> n611b940b
  n0b49234b --> nc85cbebe
  n0b49234b --> neb4276db
  n0b49234b --> n082487f1
  n0b49234b --> nc6a9f49d
  n0b49234b --> nefce3e20
  n0b49234b --> n05a4bb1c
  n0b49234b --> n2ff87b3f
  n0b49234b --> n85da7373
  n0b49234b --> n7e8ae26d
  n0b49234b --> n52355949
  n0b49234b --> n223b4a3d
  n0b49234b --> na32326ca
  n0b49234b --> n57ef6049
  n0b49234b --> n51d2fdf6
  n0b49234b --> n8cd01ab7
  n0b49234b --> n9abb948c
  n0b49234b --> n31755ea3
  n0b49234b --> na355128a
  n0b49234b --> ne589841c
  n0b49234b --> n8118c934
  n0b49234b --> na93b7883
  n0b49234b --> nf6c79102
  n0b49234b --> n9c9f8b5a
  n0b49234b --> na7c7bc9e
  n0b49234b --> n1c8dc3bd
  n0b49234b --> n796eb868
  n0b49234b --> nd2487d9f
  n0b49234b --> n6cf94ea3
  n0b49234b --> na1865459
  n0b49234b --> n9c188d9e
  n0b49234b --> n904cbda8
  n0b49234b --> na74440cf
  n0b49234b --> ne453330c
  n0b49234b --> na50867d8
  n0b49234b --> n55829bab
  n0b49234b --> na8df055f
  n0b49234b --> nb85c441f
  n0b49234b --> n5ba85722
  n0b49234b --> n747a988c
  n0b49234b --> n01fd9128
  n0b49234b --> n6bf1cc70
  n0b49234b --> n8123449b
  n0b49234b --> nb5a57efb
  n0b49234b --> nf41bf9ff
  n0b49234b --> n70ad65f2
  n0b49234b --> n90f6874c
  n0b49234b --> n0cf5a8f7
  n0b49234b --> n1660c833
  n0b49234b --> n4ae1e17f
  n0b49234b --> n7eaaca59
  n0b49234b --> n6018e7ce
  n0b49234b --> n30f53e63
  n0b49234b --> n597dee7a
  n0b49234b --> n5a4833c7
  n0b49234b --> n71e57233
  n0b49234b --> ndd1578e4
  n0b49234b --> n07037204
  n0b49234b --> nc57dff73
  n0b49234b --> nd501fe7e
  n0b49234b --> n6f041ae5
  n0b49234b --> ned6df0bd
  n0b49234b --> n0b31db37
  n0b49234b --> n79762620
  n0b49234b --> n3a71afc0
  n0b49234b --> n63f029d4
  n0b49234b --> n36b4cb41
  n3efdf618 --> n8ec75d64
  n3efdf618 --> n2348a986
  n2348a986 --> ndbd90c94
  n2348a986 --> nf5385f79
  n2348a986 --> n4156474c
  n2348a986 --> n738590e1
  n2348a986 --> n35aab0c5
  n2348a986 --> n88c540e8
  n2348a986 --> nf069bf9c
  n2348a986 --> nc8d7b94d
  n2348a986 --> n9ff3609a
  n2348a986 --> n363e9769
  n2348a986 --> n59de9074
  n2348a986 --> nf275c409
  n2348a986 --> n2a7ef551
  n2348a986 --> n84be3d5f
  n2348a986 --> nf4727853
  n2348a986 --> n169a18f9
  n2348a986 --> n213b0063
  n2348a986 --> nea725e51
  n2348a986 --> n9b351299
  n2348a986 --> n8fc46eec
  n2348a986 --> nf7b862ff
  n2348a986 --> n2a4f9028
  n2348a986 --> neb361c82
  n2348a986 --> n7e432f03
  n2348a986 --> n85bdcd34
  n2348a986 --> n04918d1f
  n2348a986 --> ndfa87f74
  n2348a986 --> nf453c0d8
  n2348a986 --> n35f0134e
  n2348a986 --> nf427bae2
  n2348a986 --> nf1cae088
  n2348a986 --> ne3ebe465
  n2348a986 --> na747466f
  n2348a986 --> n5fcf0061
  n2348a986 --> n583a4d8b
  n2348a986 --> nc3b32d94
  n2348a986 --> n797c304d
  n2348a986 --> n742389e4
  n2348a986 --> nba8ac9dc
  n2348a986 --> n16344130
  n3efdf618 --> n2d2d7ccf
  n3efdf618 --> n1a5f4a99
  n1a5f4a99 --> n58263a57
  n1a5f4a99 --> n07d835fa
  n1a5f4a99 --> n388a9f96
  n1a5f4a99 --> n03a9a055
  n1a5f4a99 --> n8e613a62
  n1a5f4a99 --> ne986de65
  n1a5f4a99 --> n0785bbdd
  n1a5f4a99 --> n0c09d334
  n1a5f4a99 --> n54f262d6
  n1a5f4a99 --> n5fb29085
  n1a5f4a99 --> n9a2ef8b6
  n1a5f4a99 --> n357b6dae
  n1a5f4a99 --> n70c640f2
  n1a5f4a99 --> n97978321
  n1a5f4a99 --> n19b7a62f
  n1a5f4a99 --> n5586ac39
  n1a5f4a99 --> ne9e1bc14
  n1a5f4a99 --> nf2eee90f
  n1a5f4a99 --> nb8f1e02a
  n1a5f4a99 --> n73a75339
  n1a5f4a99 --> nb065a947
  n1a5f4a99 --> n83b7cb32
  n1a5f4a99 --> n0af42176
  n1a5f4a99 --> nabd2c3f8
  n1a5f4a99 --> nd461ac00
  n1a5f4a99 --> n31f4ab4d
  n1a5f4a99 --> n99c794f5
  n1a5f4a99 --> ndf38bb0b
  n1a5f4a99 --> n02078a0a
  n1a5f4a99 --> n1050260d
  n1a5f4a99 --> n8eb6ca55
  n1a5f4a99 --> nee878290
  n1a5f4a99 --> n94a6a929
  n1a5f4a99 --> n35bd6693
  n1a5f4a99 --> n3bfd41a6
  n1a5f4a99 --> n8a778827
  n1a5f4a99 --> n12261a2d
  n1a5f4a99 --> n47800eb0
  n1a5f4a99 --> nf0ed362b
  n1a5f4a99 --> nd1daf2b7
  n1a5f4a99 --> n7ff5fbeb
  n1a5f4a99 --> n685a1f01
  n1a5f4a99 --> n87f0cb06
  n1a5f4a99 --> nc18c74b8
  n1a5f4a99 --> n26399ae6
  n1a5f4a99 --> naca13174
  n1a5f4a99 --> n666462c7
  n1a5f4a99 --> n47f0efe9
  n1a5f4a99 --> na84ee201
  n1a5f4a99 --> ndb48c610
  n1a5f4a99 --> n3ab5902f
  n1a5f4a99 --> n5e146c01
  n1a5f4a99 --> n92c5094d
  n1a5f4a99 --> n63189fc5
  n1a5f4a99 --> nac2d0a1f
  n1a5f4a99 --> ndb59f36d
  n1a5f4a99 --> n2fa603e4
  n1a5f4a99 --> ned533f0c
  n1a5f4a99 --> n2ebd0f8f
  n1a5f4a99 --> n402e4912
  n1a5f4a99 --> n723f18d2
  n1a5f4a99 --> n50c747c8
  n1a5f4a99 --> nee9348f4
  n1a5f4a99 --> nff4eeb84
  n1a5f4a99 --> n92747809
  n1a5f4a99 --> na4c660b0
  n1a5f4a99 --> nfc4500a5
  n1a5f4a99 --> n74c4df39
  n1a5f4a99 --> n10ad2eba
  n1a5f4a99 --> n47f248ac
  n1a5f4a99 --> n8ac51c85
  n1a5f4a99 --> nf01e7f42
  n1a5f4a99 --> n9e4ce99a
  n1a5f4a99 --> n19e32fb2
  n1a5f4a99 --> nd5ab5e8f
  n1a5f4a99 --> n1082ed1c
  n1a5f4a99 --> n797bb6da
  n1a5f4a99 --> nac7da8ce
  n1a5f4a99 --> n598dfed0
  n1a5f4a99 --> n7b76aa15
  n1a5f4a99 --> n3a0396d3
  n1a5f4a99 --> n1405d1b3
  n1a5f4a99 --> n15262ff9
  n1a5f4a99 --> n1c5cd857
  n1a5f4a99 --> n429036cf
  n1a5f4a99 --> ne0dc70da
  n1a5f4a99 --> nccc9a42a
  n1a5f4a99 --> n7f671737
  n1a5f4a99 --> n51f45a7c
  n1a5f4a99 --> ndd36994c
  n1a5f4a99 --> n573576be
  n1a5f4a99 --> nd7aadc8a
  n1a5f4a99 --> nb88b91ca
  n1a5f4a99 --> nf6ff8cdf
  n1a5f4a99 --> nefee4812
  n1a5f4a99 --> ncf09be1e
  n1a5f4a99 --> n5dfacbda
  n1a5f4a99 --> n14dd5c58
  n1a5f4a99 --> n651bd231
  n1a5f4a99 --> ne5696a82
  n1a5f4a99 --> n06ecf7c4
  n1a5f4a99 --> nf2ebd2a9
  n1a5f4a99 --> na57489c9
  n1a5f4a99 --> nd6f5a518
  n1a5f4a99 --> n3b65ac95
  n1a5f4a99 --> ndc3a829d
  n1a5f4a99 --> n791c0068
  n1a5f4a99 --> n37acb686
  n1a5f4a99 --> n97291be6
  n1a5f4a99 --> n1cf49047
  n1a5f4a99 --> n402e14a0
  n1a5f4a99 --> n5090a3d1
  n1a5f4a99 --> n7fad7178
  n1a5f4a99 --> n78a1b6d8
  n1a5f4a99 --> n1c11efd9
  n1a5f4a99 --> n2b86e2f9
  n1a5f4a99 --> nb8c65bbf
  n1a5f4a99 --> naf704e68
  n1a5f4a99 --> n25bf1640
  n1a5f4a99 --> n4417ca50
  n1a5f4a99 --> n5114ffaf
  n1a5f4a99 --> n6a10ef3f
  n1a5f4a99 --> nd52d71e5
  n1a5f4a99 --> n966da024
  n3efdf618 --> n665f38b3
  n3efdf618 --> na4369bde
  n3efdf618 --> na8e4163f
  n3efdf618 --> nd6d27344
  nd6d27344 --> na8f560d3
  nd6d27344 --> n86110348
  nd6d27344 --> nc503dc23
  nd6d27344 --> na13c43f0
  nd6d27344 --> n4ec73578
  nd6d27344 --> nb81e2de4
  nd6d27344 --> n0ef20e44
  nd6d27344 --> n362e99d2
  nd6d27344 --> nc59daee6
  nd6d27344 --> nf6cff321
  nd6d27344 --> n3a938f3a
  n3efdf618 --> n6b286681
  n3efdf618 --> n5e23d602
```

| node | receipt uuid | referrer | payload fold | seq |
|---|---|---|---|---|
| root | `3efdf618-13c4-8d0a-8f6c-2a45c84d4ee9` | `f7a8547d` | `bcb38459fc79b529` | 0 |
| cross-receipt.json | `3d979984-9180-8475-8527-b8bb88f45421` | `3efdf618` | `32e33b4efc02552d` | 1 |
| cross-receipt.json#0 | `c037da2b-67de-834e-bdbd-8e3116610843` | `3d979984` | `1dfb50c09d3ec562` | 2 |
| cross-receipt.json#1 | `72e6e4d6-6839-88b2-bc88-5f9b542efd98` | `3d979984` | `71cd4b0253241eba` | 3 |
| cross-receipt.json#2 | `e9ae521d-3956-8588-9ec5-ee0078a7ce25` | `3d979984` | `d395906a7c1ca3bd` | 4 |
| cross-receipt.json#3 | `cedaa099-37d9-8569-91bf-64839f966827` | `3d979984` | `6d6d0a981d52ac76` | 5 |
| cross-receipt.json#4 | `9c5fb560-affc-8e34-b9dd-72a44b4ee78d` | `3d979984` | `3206e3e260b0bda7` | 6 |
| cross-receipt.json#5 | `2f67b070-0a5d-8536-9a35-32f3b5686de6` | `3d979984` | `15acf0a0cff5c260` | 7 |
| cross-receipt.json#6 | `c04d4d07-c229-8927-baa2-a198aad9b23a` | `3d979984` | `15196e19197c8657` | 8 |
| cross-receipt.json#7 | `2c918719-74df-895e-8e7c-9b8287c76990` | `3d979984` | `c63f9497ab57fde9` | 9 |
| cross-receipt.json#8 | `421d81e3-366b-8fd2-b87b-da9c48ba9f76` | `3d979984` | `e153a0b9425f5a0a` | 10 |
| cross-receipt.json#9 | `0620424b-e91a-80e4-941c-654b4984537b` | `3d979984` | `da63fe824b42d3b9` | 11 |
| cross-receipt.json#10 | `f00c6be4-f1b7-8ba4-88d1-49a9a38332b6` | `3d979984` | `30617b9216899d69` | 12 |
| cross-receipt.json#11 | `00ee3665-8a12-8cbf-81d3-85a58b07e3c1` | `3d979984` | `e5d9a81caa284bd2` | 13 |
| cross-receipt.json#12 | `fc951844-f5f6-86de-b40c-14cfeb2051ae` | `3d979984` | `c926f909137e13ea` | 14 |
| cross-receipt.json#13 | `18567652-70fd-8460-a3bb-89278aba015e` | `3d979984` | `970496b026f43786` | 15 |
| cross-receipt.json#14 | `244db4f8-de25-8ec7-bbe3-85b630da4f2d` | `3d979984` | `eddfd8ec84208444` | 16 |
| cross-receipt.json#15 | `3546be57-4d84-8107-9d2c-ab2f071f0cde` | `3d979984` | `c635847ade052b98` | 17 |
| cross-receipt.json#16 | `4275e3a8-89b7-8bb2-b6fb-c23f9cc7a394` | `3d979984` | `e73fd7a6d186d5b9` | 18 |
| cross-receipt.json#17 | `4eb30c80-ffec-8cf6-b413-ea435b564e80` | `3d979984` | `488374c9d21d1916` | 19 |
| cross-receipt.json#18 | `56a9656c-4dcd-87ed-8301-797cd913fb73` | `3d979984` | `5a3a20319bd79246` | 20 |
| cross-receipt.json#19 | `c813d3fe-efd2-81d4-b121-a9d4534751a8` | `3d979984` | `9722a986196949c6` | 21 |
| cross-receipt.json#20 | `0f5a30e6-d36a-8121-b205-394edf2a25ee` | `3d979984` | `91ee2fdc046a71f2` | 22 |
| cross-receipt.json#21 | `2f1c9756-bdc5-85d0-a7c2-0fcca84ec8bf` | `3d979984` | `5464a03fab9710c1` | 23 |
| cross-receipt.json#22 | `827922a2-1860-8289-b7c1-74264b1be72b` | `3d979984` | `7ef706f14b351d5e` | 24 |
| cross-receipt.json#23 | `629b1b2b-de5e-8331-b50d-5b401b870968` | `3d979984` | `38fbb18b1e27788c` | 25 |
| cross-receipt.json#24 | `2123d1e7-81b1-8042-b0e1-00a932a1bd79` | `3d979984` | `740b3c309e28316f` | 26 |
| cross-receipt.json#25 | `f6fe021e-d344-841b-8512-e8e1fb8b2e4d` | `3d979984` | `e90b89ce056c1a01` | 27 |
| cross-receipt.json#26 | `3cc39d3b-8d5c-8cd6-88d1-bd8093fd213e` | `3d979984` | `f1e15ae62cdf1e35` | 28 |
| cross-receipt.json#27 | `185a0b05-b7ba-81e5-9b45-5e7fdc3c6abd` | `3d979984` | `d1ffa93bf956431e` | 29 |
| cross-receipt.json#28 | `8a5f1c07-105d-8b03-ae5e-18be46146b7a` | `3d979984` | `d5266feaca6b7beb` | 30 |
| cross-receipt.json#29 | `7bc302b2-3411-8447-8a7d-f7bae66d93c2` | `3d979984` | `960c32a22f42e091` | 31 |
| debts-receipt.json | `6403c518-13b6-8cf9-9753-6c4f27fdcc77` | `3efdf618` | `ddb0d39a20dd9254` | 32 |
| discovery-receipt.json | `b88c9f1c-ed36-8354-b6f7-2321ae4a197f` | `3efdf618` | `c2776bfbc2df3180` | 33 |
| discovery-receipt.json#0 | `d279b7c8-9461-89cf-9b1f-cc5757e3fc61` | `b88c9f1c` | `b81fbea12947c2a4` | 34 |
| discovery-receipt.json#1 | `f9b0b75e-fa79-8332-b727-1d77e5f2a0cf` | `b88c9f1c` | `fb13d499f5313981` | 35 |
| discovery-receipt.json#2 | `6eb23a74-60a4-8897-add5-96c3cda6ee43` | `b88c9f1c` | `15bfece2a2eb7f6e` | 36 |
| discovery-receipt.json#3 | `3f5d3ec8-7138-86b6-bca4-617d238208b2` | `b88c9f1c` | `439866928513d906` | 37 |
| discovery-receipt.json#4 | `04bc44e5-bf06-85d0-bc1d-819c131b4ca9` | `b88c9f1c` | `5a434500752e901f` | 38 |
| discovery-receipt.json#5 | `6af453b2-ef44-88a4-afa2-99f8697df1b2` | `b88c9f1c` | `afaad818097e2d99` | 39 |
| discovery-receipt.json#6 | `5ce5c570-7d85-898b-9a6c-cf963cd7da66` | `b88c9f1c` | `92276eeea54ec502` | 40 |
| discovery-receipt.json#7 | `147be0dc-c7bf-8103-83b6-a9eee929034e` | `b88c9f1c` | `55e6691d18d9c9c8` | 41 |
| discovery-receipt.json#8 | `e97c6e57-493a-8147-848e-2dc0a7f5df2a` | `b88c9f1c` | `2263cc0cf5d1abdc` | 42 |
| discovery-receipt.json#9 | `d07e2a8f-5c0c-87b4-91e3-2341a7413eb3` | `b88c9f1c` | `5d85ffc193aa1b4c` | 43 |
| discovery-receipt.json#10 | `dd93f388-e5a1-8170-8dc6-86b26f5cfd8b` | `b88c9f1c` | `a10cbce96361cbce` | 44 |
| discovery-receipt.json#11 | `2d046f0a-3b9b-8579-89e6-e3c6541213ba` | `b88c9f1c` | `3bb4f3a117e7cf28` | 45 |
| discovery-receipt.json#12 | `c3931f91-8a02-81a1-b74d-94d24982bb19` | `b88c9f1c` | `d7185f17cf2b0643` | 46 |
| discovery-receipt.json#13 | `ec04f186-cccb-80c7-b268-529d0ae37ada` | `b88c9f1c` | `37159e7d5f3d11b6` | 47 |
| discovery-receipt.json#14 | `80b9aba2-4645-882f-860f-75c66d9fa094` | `b88c9f1c` | `38e5ed37a27d321a` | 48 |
| discovery-receipt.json#15 | `0a71bef1-4e17-803d-ba85-60a1fb0b112d` | `b88c9f1c` | `ef635f089cfd9af7` | 49 |
| discovery-receipt.json#16 | `8a08c28a-9374-869d-a102-f228109f520e` | `b88c9f1c` | `5288582bb95d0240` | 50 |
| discovery-receipt.json#17 | `e46e1947-1b09-8ee2-a2ec-1ff30e26a63f` | `b88c9f1c` | `05fff2e69da33e28` | 51 |
| discovery-receipt.json#18 | `56ed83cf-fa55-81e8-8d35-2cbee26644ce` | `b88c9f1c` | `41a8a08f1bcfb4c5` | 52 |
| discovery-receipt.json#19 | `4be07c2c-4859-82c2-8a16-5cb471fcb500` | `b88c9f1c` | `2cc651027cb7837f` | 53 |
| discovery-receipt.json#20 | `dbe7f43c-cad7-8c1c-a7b9-10b7151cdb6c` | `b88c9f1c` | `e043a0c59df2c1f7` | 54 |
| discovery-receipt.json#21 | `f62d34ea-589d-8c69-8e7a-072b7fe66e50` | `b88c9f1c` | `505f2810129310d8` | 55 |
| discovery-receipt.json#22 | `36986951-1268-8986-86f9-3a169f666618` | `b88c9f1c` | `e33f322ac025c9af` | 56 |
| discovery-receipt.json#23 | `a56a62c9-206d-84ad-bd7e-3a43ad6b3396` | `b88c9f1c` | `0f889b2cf81215d8` | 57 |
| discovery-receipt.json#24 | `58a66815-bdcd-8f96-aabc-8f5bdcb7b809` | `b88c9f1c` | `edaafab4803f0d63` | 58 |
| discovery-receipt.json#25 | `26f4ae45-502c-8210-a23e-0dae23b9974c` | `b88c9f1c` | `5b4d59bd0ff61fb1` | 59 |
| discovery-receipt.json#26 | `c280965d-96b0-8091-8d1a-c40d249f15b4` | `b88c9f1c` | `4e763d9f1debd026` | 60 |
| discovery-receipt.json#27 | `17b646d0-149a-8296-acb3-dee6fcc679bf` | `b88c9f1c` | `b3f048daa0deeb52` | 61 |
| discovery-receipt.json#28 | `49ccd085-8329-87c8-b5b4-6c6e892cac97` | `b88c9f1c` | `0462d35b280b065e` | 62 |
| discovery-receipt.json#29 | `b4a01cec-9ec6-8c97-9737-489fc6b4689c` | `b88c9f1c` | `eb1f0689d4c76201` | 63 |
| discovery-receipt.json#30 | `4af61e31-b0cb-8f43-9fe2-bee6cc1d071b` | `b88c9f1c` | `162e8b672eddb1e7` | 64 |
| discovery-receipt.json#31 | `e1464278-ecd9-838f-893e-58a7b3c6e98a` | `b88c9f1c` | `fac98e25ed82cc0d` | 65 |
| discovery-receipt.json#32 | `c74e13ed-3abf-8203-ab5e-5625c30d9dca` | `b88c9f1c` | `db3abcc7b9831941` | 66 |
| discovery-receipt.json#33 | `9d285bd1-6e65-8067-87a1-a0bd1dccc783` | `b88c9f1c` | `39e731415e57018a` | 67 |
| discovery-receipt.json#34 | `7dfc0120-e42b-8d28-b21d-5dd9d897f3a8` | `b88c9f1c` | `5e40081f34f4b77a` | 68 |
| discovery-receipt.json#35 | `adf5d4b9-0003-8974-8e79-850de76e02b2` | `b88c9f1c` | `2ecca24a7452063b` | 69 |
| discovery-receipt.json#36 | `f9b092bc-0d2a-819d-b93c-b6f2e23bdb95` | `b88c9f1c` | `3bed177b94ec7f6e` | 70 |
| discovery-receipt.json#37 | `323a0415-0310-8109-813b-e0d4e0ae65d5` | `b88c9f1c` | `bfab91598bbe3734` | 71 |
| discovery-receipt.json#38 | `17d1f273-92a8-8e3c-8a43-2e253d8271ee` | `b88c9f1c` | `687a27b28ec1a0cd` | 72 |
| discovery-receipt.json#39 | `1ae1036b-126e-8be3-97e5-16c94928aa75` | `b88c9f1c` | `515c9272aee36022` | 73 |
| discovery-receipt.json#40 | `86def864-1cf1-8e72-ba3d-7f85f7225bdf` | `b88c9f1c` | `c2d2c4ca36035b70` | 74 |
| discovery-receipt.json#41 | `ef7403f8-4c77-8edf-989e-40ad31f43784` | `b88c9f1c` | `013e96e1e075ac08` | 75 |
| discovery-receipt.json#42 | `94a6899d-814b-8ec9-a2e0-d0b696d458e5` | `b88c9f1c` | `8ff9cd2ec9031a96` | 76 |
| discovery-receipt.json#43 | `3da020a8-a22c-86ef-9e93-c393924b6226` | `b88c9f1c` | `ad4961f45d51d333` | 77 |
| discovery-receipt.json#44 | `d19b55fe-5a4f-8ac8-8d67-e8a39275755a` | `b88c9f1c` | `f240dcd852c46639` | 78 |
| discovery-receipt.json#45 | `0a5f0c27-bb26-8c9e-9d6f-4d2ee37117e1` | `b88c9f1c` | `0037cbafb54b3a43` | 79 |
| discovery-receipt.json#46 | `7574b21a-0d41-876b-960e-859db855bf78` | `b88c9f1c` | `8f040d086bca9d71` | 80 |
| discovery-receipt.json#47 | `4576d411-c0da-8c8e-a35e-cb7f014c426f` | `b88c9f1c` | `208d8de9cd055e9f` | 81 |
| discovery-receipt.json#48 | `0fa4aa89-c00d-843d-9f00-e74c8f48eec5` | `b88c9f1c` | `a4f1f63251c9e81a` | 82 |
| discovery-receipt.json#49 | `adc03d11-a962-8894-b32b-21ed7b4d4bbf` | `b88c9f1c` | `e45311c441f1d829` | 83 |
| discovery-receipt.json#50 | `cb283674-c2bf-8ba9-9d7a-6b2301e7f478` | `b88c9f1c` | `3dd240c02ab8586a` | 84 |
| discovery-receipt.json#51 | `f47b81d0-6afa-882a-94a5-e27aca9a534b` | `b88c9f1c` | `b99ee48732fdf533` | 85 |
| discovery-receipt.json#52 | `880022ad-ce83-8bf5-a09e-90bc60129989` | `b88c9f1c` | `ba54df6bc058ab9d` | 86 |
| discovery-receipt.json#53 | `3bf7042b-0261-8eb5-bf4d-312a09100ed7` | `b88c9f1c` | `f4cb6a92e96750ff` | 87 |
| discovery-receipt.json#54 | `1f82a45d-ea24-8f74-96bd-b9aa67eadadb` | `b88c9f1c` | `975ecce9b007c730` | 88 |
| discovery-receipt.json#55 | `8e16aec5-9b30-8792-a5eb-30797338ecdb` | `b88c9f1c` | `d41acd211806c557` | 89 |
| discovery-receipt.json#56 | `a29c9a4f-bf78-886c-8678-a3702067ca55` | `b88c9f1c` | `45e0cce5d1a4bdd5` | 90 |
| discovery-receipt.json#57 | `95692965-db25-851a-8dbb-5b78e16c50fe` | `b88c9f1c` | `63af86c3f63846c0` | 91 |
| discovery-receipt.json#58 | `1bbe83a0-81b1-8b38-90b4-c6fdcf5640b3` | `b88c9f1c` | `93dfc55653ca200a` | 92 |
| discovery-receipt.json#59 | `409ac80f-c849-8093-a877-2c6d9a4735c8` | `b88c9f1c` | `8dc6fc31b3c3e51f` | 93 |
| discovery-receipt.json#60 | `e5af2e44-f195-8ad5-b4f9-fd9a52d2861b` | `b88c9f1c` | `d67f3e1d42ea3e29` | 94 |
| discovery-receipt.json#61 | `d87cc2ec-b848-878f-81bf-e729d55e7c4b` | `b88c9f1c` | `0849e13464e26581` | 95 |
| discovery-receipt.json#62 | `ea4dd95a-1a38-80a5-bab1-cb91b02c0259` | `b88c9f1c` | `9060ee2802c71acb` | 96 |
| discovery-receipt.json#63 | `d7f5dc92-a7f8-8091-a3fa-75d6dffb76c1` | `b88c9f1c` | `cd3afb3bb3751c00` | 97 |
| discovery-receipt.json#64 | `f7ec278c-667a-8035-9e84-9a0943bbcd91` | `b88c9f1c` | `7219375c62be1062` | 98 |
| discovery-receipt.json#65 | `31ef75c3-4ab1-8db4-b75f-b141fc350a74` | `b88c9f1c` | `af92d267d24bd090` | 99 |
| discovery-receipt.json#66 | `45b19787-f27d-82af-842d-f64b7ab2c9f3` | `b88c9f1c` | `caa7b8ac09af59ee` | 100 |
| discovery-receipt.json#67 | `6a891c70-0a6c-845a-8642-ae35aa0bc6d9` | `b88c9f1c` | `b82e7132265c6684` | 101 |
| discovery-receipt.json#68 | `cb92fb2f-92c7-804c-93ab-0cb587b6ad5d` | `b88c9f1c` | `e24854d642a3d1f0` | 102 |
| discovery-receipt.json#69 | `8e06baff-b0ac-8f3d-895c-ef84933054ec` | `b88c9f1c` | `e8db7b4b6513e0bf` | 103 |
| discovery-receipt.json#70 | `329bbc76-1f0d-8288-b74d-f66562abb8ac` | `b88c9f1c` | `2d39e8a1d9d3eee9` | 104 |
| discovery-receipt.json#71 | `7c06873e-473a-8539-90ad-57a2aa43f062` | `b88c9f1c` | `a1bd783f0738d928` | 105 |
| discovery-receipt.json#72 | `361c6224-1b23-8f40-a258-751a358e988c` | `b88c9f1c` | `060c20482a47140d` | 106 |
| discovery-receipt.json#73 | `34026f21-2fb7-8867-8a04-b25d3c817f0c` | `b88c9f1c` | `92e9a6898c451bb9` | 107 |
| discovery-receipt.json#74 | `cf0bc282-6944-80c3-9763-dfe42dfb31f2` | `b88c9f1c` | `0282050f14f9637f` | 108 |
| discovery-receipt.json#75 | `942d6dd0-0753-875d-8071-cf6014a9f07c` | `b88c9f1c` | `bdfdc0be03b6abba` | 109 |
| discovery-receipt.json#76 | `26d22af5-5ee8-8720-8799-7f913afd808a` | `b88c9f1c` | `f992242321aca9e1` | 110 |
| discovery-receipt.json#77 | `35f32cb2-13ef-808d-bf72-95944c290cb1` | `b88c9f1c` | `67e264db3c04dba5` | 111 |
| discovery-receipt.json#78 | `4d49bd47-499b-8b05-b96a-5dcccd4fcdad` | `b88c9f1c` | `b6a3faa85e072cc2` | 112 |
| discovery-receipt.json#79 | `a6d79c0e-7e42-82d1-b5a9-a5b2e9ed9a73` | `b88c9f1c` | `275228529762226e` | 113 |
| discovery-receipt.json#80 | `7a96ba98-b3b5-8c9f-857b-8684e8816124` | `b88c9f1c` | `d1051ec978a81d50` | 114 |
| discovery-receipt.json#81 | `b19481eb-eabc-8038-ba5c-503540cad3d4` | `b88c9f1c` | `c273b719f795d828` | 115 |
| discovery-receipt.json#82 | `37409fa2-0f68-8eeb-88a2-db84072c2eda` | `b88c9f1c` | `40b43a8d576b5a45` | 116 |
| discovery-receipt.json#83 | `d7e4af18-51a4-817e-99cd-bf031a6fcea0` | `b88c9f1c` | `37c48044ecaa4eb0` | 117 |
| discovery-receipt.json#84 | `08eb72f8-69af-85e5-afb6-252a6e3b00bc` | `b88c9f1c` | `a4a81e4c801c43c1` | 118 |
| discovery-receipt.json#85 | `12aa1c5f-bc16-8f47-831b-1db9ee80b2bf` | `b88c9f1c` | `718f9c71350f2111` | 119 |
| discovery-receipt.json#86 | `6ee6a1b0-0fa0-8424-b993-49dde0327b5d` | `b88c9f1c` | `767c4f0d9cbcdc16` | 120 |
| discovery-receipt.json#87 | `27363477-e2a0-8b1b-a221-7a5249d979fa` | `b88c9f1c` | `438c4140566f4367` | 121 |
| discovery-receipt.json#88 | `d13a74ef-48b9-893f-ab56-5b8b6e499c15` | `b88c9f1c` | `0052f76c401f2b28` | 122 |
| discovery-receipt.json#89 | `50fc53ed-bfc7-8909-be15-33abb36e7228` | `b88c9f1c` | `49412412aa8009b6` | 123 |
| discovery-receipt.json#90 | `9a54cdbc-45dc-86d4-8288-eac99e16ce4c` | `b88c9f1c` | `7eb36ab2b56a377a` | 124 |
| discovery-receipt.json#91 | `acd3ca75-c7ce-831d-8269-3feba63c9916` | `b88c9f1c` | `0db5cca504b7cf2d` | 125 |
| discovery-receipt.json#92 | `3e5e07eb-4ab8-804d-8067-b8ce9e43de27` | `b88c9f1c` | `7c2c723c184acc00` | 126 |
| discovery-receipt.json#93 | `9a3c0fe8-15cd-8264-832f-8b0383f9dd04` | `b88c9f1c` | `ae6631a33753ad12` | 127 |
| discovery-receipt.json#94 | `6ee2ecf3-6887-8f4a-956a-04069de143c6` | `b88c9f1c` | `d52f9310aa26719b` | 128 |
| discovery-receipt.json#95 | `a7512a99-47d4-8d1f-84ee-57fba6728ca1` | `b88c9f1c` | `d88047485009070d` | 129 |
| discovery-receipt.json#96 | `e2b0ff54-1589-8513-a574-30d068a0a8f7` | `b88c9f1c` | `1b9b7a984431b9bc` | 130 |
| discovery-receipt.json#97 | `fa572771-7655-8d64-a0f5-a6777e427b47` | `b88c9f1c` | `1080e4275c3c30a3` | 131 |
| discovery-receipt.json#98 | `17f29234-13b4-8201-b01e-89a993da0778` | `b88c9f1c` | `ffbdaf4250cd04fb` | 132 |
| discovery-receipt.json#99 | `92752eb2-9dde-86ee-bb3b-ce395153a6dd` | `b88c9f1c` | `6013df5ed90b24ef` | 133 |
| discovery-receipt.json#100 | `36681a97-1616-84ac-9a2f-256906cecb33` | `b88c9f1c` | `b127482637514a09` | 134 |
| discovery-receipt.json#101 | `d63fe463-34ea-8aeb-a4f0-c417d19d64b6` | `b88c9f1c` | `dd782dacfef4b8b0` | 135 |
| discovery-receipt.json#102 | `56cc6b86-7e5d-8602-a3f3-dcf37b98a974` | `b88c9f1c` | `d96de2e3bd649d9f` | 136 |
| discovery-receipt.json#103 | `81adc527-2fa6-87d5-9fad-83345a3cf292` | `b88c9f1c` | `367b83a755c094fe` | 137 |
| discovery-receipt.json#104 | `cd20cea2-b76e-8a8e-b150-b5da920de922` | `b88c9f1c` | `4ec535ba4c556a6b` | 138 |
| discovery-receipt.json#105 | `0a0e5be5-7bb6-89d6-bff3-84a00773c58f` | `b88c9f1c` | `82c10e16cea07425` | 139 |
| discovery-receipt.json#106 | `33a31936-5fca-85b3-adf6-f195a5173f9c` | `b88c9f1c` | `e2c895bbb52ec685` | 140 |
| discovery-receipt.json#107 | `60ea46bc-4c77-83ee-8552-c3a6d9fc1d9e` | `b88c9f1c` | `02975b2a41c5a28b` | 141 |
| discovery-receipt.json#108 | `7a7d6145-4b81-8f47-9de4-23ddb4156cbf` | `b88c9f1c` | `af6c83808dda8a80` | 142 |
| discovery-receipt.json#109 | `cfbe3f80-93b2-823d-add1-a2f1c2c32e42` | `b88c9f1c` | `ac1f52ebd3e763c4` | 143 |
| discovery-receipt.json#110 | `66629425-43bf-84d6-9aff-1325c02b626e` | `b88c9f1c` | `bac698dd73975acf` | 144 |
| discovery-receipt.json#111 | `fd59d692-8cc7-8b7f-92de-3bb00dce8387` | `b88c9f1c` | `b5feb3c03ca2748f` | 145 |
| discovery-receipt.json#112 | `29f941a2-07c1-8e51-be77-4cd474b76412` | `b88c9f1c` | `a482c2011d58de27` | 146 |
| discovery-receipt.json#113 | `be5c92f0-284f-8cda-b8c3-d545c1785943` | `b88c9f1c` | `98922a194b8d1a19` | 147 |
| discovery-receipt.json#114 | `5f27e337-d3c0-844c-aa49-0945903d6c56` | `b88c9f1c` | `0ed1d2f417c93066` | 148 |
| discovery-receipt.json#115 | `44faa81d-cf38-8307-8b9b-d6cb01c59854` | `b88c9f1c` | `9e7847d7ad70426a` | 149 |
| discovery-receipt.json#116 | `c5fb2ff6-d164-8df3-bb85-4da0e2791430` | `b88c9f1c` | `2e10e53c4dc73633` | 150 |
| discovery-receipt.json#117 | `2284746c-3aab-8792-bda6-4184794f2401` | `b88c9f1c` | `4fa012fa742b3a3c` | 151 |
| discovery-receipt.json#118 | `55a94846-93bf-87ac-9b19-6268d35d58ca` | `b88c9f1c` | `7648e02de4d7c32f` | 152 |
| discovery-receipt.json#119 | `1a06a713-2d85-8989-a64f-893759e71276` | `b88c9f1c` | `3df323b389682da2` | 153 |
| discovery-receipt.json#120 | `6ac66dc7-fe52-800c-b6cd-3990a640c077` | `b88c9f1c` | `ea79d6610b3c6345` | 154 |
| discovery-receipt.json#121 | `e8ab37b6-b9eb-87f6-9659-3120bb94d90e` | `b88c9f1c` | `d9b5561ac307d5ad` | 155 |
| discovery-receipt.json#122 | `c9f4e6ca-d2ed-8909-ad81-57371826dd2b` | `b88c9f1c` | `9bf1f58d18a5a104` | 156 |
| discovery-receipt.json#123 | `fb9218fc-252e-8b60-b70f-02c3be2f9409` | `b88c9f1c` | `8f5ce95bdd2b890a` | 157 |
| discovery-receipt.json#124 | `5de15297-aaa8-8a74-94da-288ebb98bd05` | `b88c9f1c` | `f4bede6f8f779044` | 158 |
| discovery-receipt.json#125 | `040d018b-d506-89c3-aefd-db7c48ee282b` | `b88c9f1c` | `a92da4f64344e870` | 159 |
| discovery-receipt.json#126 | `3ed048fb-9030-89ee-8c5c-6fd2bd133194` | `b88c9f1c` | `0fe8fb7b0874b82e` | 160 |
| discovery-receipt.json#127 | `ebbae416-3385-83b1-b193-74c77c0a9b95` | `b88c9f1c` | `6e721e556d7cd24a` | 161 |
| discovery-receipt.json#128 | `4c600254-3188-84c0-8aaa-cadfb0c123b0` | `b88c9f1c` | `585df069d2f06a25` | 162 |
| discovery-receipt.json#129 | `b0a75e8f-bef9-8bea-9052-950ba8282892` | `b88c9f1c` | `04eeb516dba6154b` | 163 |
| discovery-receipt.json#130 | `037953cd-ba95-8be8-a8e3-0e0a5dc66368` | `b88c9f1c` | `5bcf1c6c88516b42` | 164 |
| discovery-receipt.json#131 | `d18bc1dd-4e3a-877e-b085-7402c6b41c94` | `b88c9f1c` | `9d011ef5e7ac1a81` | 165 |
| discovery-receipt.json#132 | `3e50343d-8c44-8b5f-9a73-53dc630e1c79` | `b88c9f1c` | `e0ba79d1e399867c` | 166 |
| discovery-receipt.json#133 | `164b706e-18be-8957-9e2d-e41fa9cba2b8` | `b88c9f1c` | `1dac1e6861e09e6f` | 167 |
| discovery-receipt.json#134 | `a6e613dc-68f6-826e-a3d3-63b1e102ffdf` | `b88c9f1c` | `5aa7b8fef04ba790` | 168 |
| discovery-receipt.json#135 | `1d9c64aa-e7ae-8984-8782-867d576e2056` | `b88c9f1c` | `5ba0802197d22414` | 169 |
| discovery-receipt.json#136 | `f6d184f0-d678-86da-96e9-5ee46626d6d1` | `b88c9f1c` | `afea37102a532f12` | 170 |
| discovery-receipt.json#137 | `9149928d-1f36-88e1-ac0d-c013d6f079e8` | `b88c9f1c` | `4f9248c4aaee4688` | 171 |
| discovery-receipt.json#138 | `663b3412-b509-8c1f-88bc-c80137b2ee2b` | `b88c9f1c` | `6b1e857ca9e71968` | 172 |
| discovery-receipt.json#139 | `733efda6-d442-84f2-958f-741212190b21` | `b88c9f1c` | `b644296aff32e933` | 173 |
| discovery-receipt.json#140 | `ad7de8ef-977e-8562-9a8d-59b1a086857b` | `b88c9f1c` | `79bc8313e5600754` | 174 |
| discovery-receipt.json#141 | `3c022113-6eb0-8509-9545-567c268c5af2` | `b88c9f1c` | `5e8d8c0b661d7faf` | 175 |
| discovery-receipt.json#142 | `b12533b4-f1ab-8864-a3b0-07fbd39c9e1b` | `b88c9f1c` | `486fa7afc89c2388` | 176 |
| discovery-receipt.json#143 | `53ad13c2-d3ab-824a-a1f7-f4e0ca536e82` | `b88c9f1c` | `8e59e004b93048bb` | 177 |
| discovery-receipt.json#144 | `618b8aa7-a870-8f30-9e6a-ffe819c9ff69` | `b88c9f1c` | `baea7358deb5b51a` | 178 |
| discovery-receipt.json#145 | `0feb8131-a16d-8fb0-a020-a8aeabe420b1` | `b88c9f1c` | `97648eeb1e32e954` | 179 |
| discovery-receipt.json#146 | `573ee94f-7d62-84ed-b729-fcdd58c095d6` | `b88c9f1c` | `449e2f565e0bce62` | 180 |
| discovery-receipt.json#147 | `f3dcb1e4-d2ff-8c14-9f13-2b69a02e401e` | `b88c9f1c` | `add4c2a39b6e45e0` | 181 |
| discovery-receipt.json#148 | `84f3525a-99db-830f-a142-9b321a29c873` | `b88c9f1c` | `f8913e572630938b` | 182 |
| discovery-receipt.json#149 | `283f60f7-a602-8d8e-b45b-2a7966a0f4c4` | `b88c9f1c` | `b8feae756b51b9e2` | 183 |
| discovery-receipt.json#150 | `4698fd30-6021-8ab5-a7c2-7d5ffa1d9c07` | `b88c9f1c` | `a08c4d43f616063e` | 184 |
| discovery-receipt.json#151 | `82108337-6e69-84bc-b39e-21e5feb4400d` | `b88c9f1c` | `da5899af89d11b84` | 185 |
| discovery-receipt.json#152 | `68022ae4-f7e8-89a5-a57f-397ff35e4a34` | `b88c9f1c` | `3216aaf236154b53` | 186 |
| discovery-receipt.json#153 | `fe746fe9-b7fb-838c-93e6-f239226be02d` | `b88c9f1c` | `904765472f820f77` | 187 |
| discovery-receipt.json#154 | `4d621ee4-f0d9-86b7-881b-09b3bf76ccc2` | `b88c9f1c` | `c37b98117195927a` | 188 |
| discovery-receipt.json#155 | `53b3dce2-ed98-812b-8d0a-1f0387caf407` | `b88c9f1c` | `985e8e492a6dfe96` | 189 |
| discovery-receipt.json#156 | `37ebd276-f7cf-8c70-b4b0-67176d8efabc` | `b88c9f1c` | `b08d32dc684d2bf8` | 190 |
| discovery-receipt.json#157 | `2c737baa-f38b-8306-8207-afef26d09d43` | `b88c9f1c` | `7c728ea69768dd60` | 191 |
| discovery-receipt.json#158 | `6b90504f-4c2f-8ca8-9ab9-83679287f96e` | `b88c9f1c` | `f780f1c709a037a8` | 192 |
| discovery-receipt.json#159 | `46a95954-5de4-8c67-9a23-d2812153d3f9` | `b88c9f1c` | `f93f6d8f975f8464` | 193 |
| discovery-receipt.json#160 | `d7df94e4-29d6-83dd-b2f9-4ce3b5b7b7dc` | `b88c9f1c` | `2b7c34f5ce5a0b84` | 194 |
| discovery-receipt.json#161 | `d135aebe-23f5-8cb0-98ec-2fda0834fbf1` | `b88c9f1c` | `4fbffb663e66d8ff` | 195 |
| discovery-receipt.json#162 | `1694c00a-69ba-819e-9383-c672ee0e4493` | `b88c9f1c` | `537f45bf37dc2a9e` | 196 |
| discovery-receipt.json#163 | `62da04cf-6105-846d-97eb-d1360d628d82` | `b88c9f1c` | `d16836a01873f562` | 197 |
| discovery-receipt.json#164 | `576b5062-3823-89ad-9b8a-b7c6840582d2` | `b88c9f1c` | `184f03337a3a3b62` | 198 |
| discovery-receipt.json#165 | `373374c2-ae30-8aa1-9149-9cb01dcaeb2b` | `b88c9f1c` | `2607d22e5625be74` | 199 |
| discovery-receipt.json#166 | `27eaa13e-205f-8260-a0cf-3c23069932ce` | `b88c9f1c` | `6ce78669b8057775` | 200 |
| discovery-receipt.json#167 | `54810f29-8044-803f-9aa3-834571e7d424` | `b88c9f1c` | `7561d9465edd56ca` | 201 |
| discovery-receipt.json#168 | `dad80ab8-0df1-85b0-896d-b6b79b47296b` | `b88c9f1c` | `daf282dcd6cbb095` | 202 |
| discovery-receipt.json#169 | `faf7826e-d4b3-8a7d-9922-59513f160d42` | `b88c9f1c` | `a1eea6f5ce417c88` | 203 |
| discovery-receipt.json#170 | `21c4c1ef-f517-829e-9061-f17cd365b5d7` | `b88c9f1c` | `9705fbd6135979c5` | 204 |
| discovery-receipt.json#171 | `f7c01fac-932e-8ac5-99ef-36327e4ad635` | `b88c9f1c` | `da9ba4d24a12ee8f` | 205 |
| discovery-receipt.json#172 | `79b2b8b5-63a6-844d-bc8c-58fd703c7bab` | `b88c9f1c` | `3053fd9781f2fee3` | 206 |
| discovery-receipt.json#173 | `232b2035-5c9c-8d58-9ddc-390ee902c51a` | `b88c9f1c` | `53cb420549c9e5a7` | 207 |
| discovery-receipt.json#174 | `bd8b7e8e-9f1c-8615-8cbf-4fafdba950a9` | `b88c9f1c` | `1f907306d88bbf5f` | 208 |
| discovery-receipt.json#175 | `232336b4-9b11-8861-b474-069abaedfa95` | `b88c9f1c` | `1d33d4c75713ce64` | 209 |
| discovery-receipt.json#176 | `740e7bb9-19f1-81b7-9d53-7c48d7e04ee4` | `b88c9f1c` | `adc1dfe050ede287` | 210 |
| discovery-receipt.json#177 | `0368c48c-a4e3-82a8-9113-28e5ab8c7b4c` | `b88c9f1c` | `fef5b2d284c8a9c0` | 211 |
| discovery-receipt.json#178 | `ed4a3be8-c8a1-89b7-8ecb-505137888103` | `b88c9f1c` | `13f63a48560f6e03` | 212 |
| discovery-receipt.json#179 | `b3888002-bb2c-8dfa-b6a9-f38a595b33ad` | `b88c9f1c` | `bd15436417c763fd` | 213 |
| discovery-receipt.json#180 | `34112abf-7886-86d1-b3f9-08dfde79e980` | `b88c9f1c` | `b659bb0dac9d5e96` | 214 |
| discovery-receipt.json#181 | `fc2cff90-8387-89cf-ae9a-4ca86c3f39e6` | `b88c9f1c` | `318f861511ea347d` | 215 |
| discovery-receipt.json#182 | `766de8a3-0f31-80ad-872f-a58a03945112` | `b88c9f1c` | `8582651cd8640c90` | 216 |
| discovery-receipt.json#183 | `cc529999-135a-8f8e-af71-cda21abb25e6` | `b88c9f1c` | `b9e28c50faba735d` | 217 |
| discovery-receipt.json#184 | `38c3f2be-b9fd-864a-8062-5f3e97f5ccdd` | `b88c9f1c` | `07e7bef2a8838444` | 218 |
| discovery-receipt.json#185 | `0903f7b2-5c46-84bd-9975-be383fb94d07` | `b88c9f1c` | `51ecfbafd8835025` | 219 |
| discovery-receipt.json#186 | `00509596-1a7f-8478-a459-4a79e6f0f7db` | `b88c9f1c` | `8833c3daac32b247` | 220 |
| discovery-receipt.json#187 | `27fffa1c-4daa-80cd-9311-8e2130450335` | `b88c9f1c` | `672f42a69ab50d0b` | 221 |
| discovery-receipt.json#188 | `2076285b-3566-86a7-a8e3-1d306d803fb3` | `b88c9f1c` | `06dc2bd041958842` | 222 |
| discovery-receipt.json#189 | `7e637243-e61c-8140-9866-5fae856d4093` | `b88c9f1c` | `6f230670cc8de004` | 223 |
| discovery-receipt.json#190 | `88e451b7-203e-8955-a6cd-bf4c2c6a40d7` | `b88c9f1c` | `3c85eab206e93b88` | 224 |
| discovery-receipt.json#191 | `8c673627-6c5b-8aa5-9889-3f74ff91c619` | `b88c9f1c` | `c5618ffee891400e` | 225 |
| discovery-receipt.json#192 | `9ae240f6-f1f6-8f03-ba72-a4b04fb23a37` | `b88c9f1c` | `6c609067c549d0a4` | 226 |
| discovery-receipt.json#193 | `1ec7e4bf-f647-8992-b2e9-31cfad6807bf` | `b88c9f1c` | `a78606a3a54e44ca` | 227 |
| discovery-receipt.json#194 | `564408a5-e95b-87ea-abd1-9c3e4cda7450` | `b88c9f1c` | `3e7d8bc188901e37` | 228 |
| discovery-receipt.json#195 | `c4865abe-f7f6-8b52-b15d-3993478b708d` | `b88c9f1c` | `a24c6622ee310185` | 229 |
| discovery-receipt.json#196 | `7621f6b2-54a9-8769-b114-c21ebb131db7` | `b88c9f1c` | `833cc4971781eca2` | 230 |
| discovery-receipt.json#197 | `eed19b99-cd37-8d47-9a80-69358a98913a` | `b88c9f1c` | `ea77dc4c447946bd` | 231 |
| discovery-receipt.json#198 | `3a466de6-a44b-8953-a4a1-522262b08fd3` | `b88c9f1c` | `63bd571dd4b43221` | 232 |
| discovery-receipt.json#199 | `b8005b8c-2534-8a0a-bb14-d83981b5c1b9` | `b88c9f1c` | `66f289a97eb01e79` | 233 |
| discovery-receipt.json#200 | `bed94654-20c3-8104-8865-02e8ba7dbd95` | `b88c9f1c` | `255f6318ae21fe81` | 234 |
| discovery-receipt.json#201 | `e20529d0-1195-8cef-9644-bc56882d0c83` | `b88c9f1c` | `f3aa5aed9e1d97f5` | 235 |
| discovery-receipt.json#202 | `44ce3e69-ae4d-80b4-a353-28aa86b50417` | `b88c9f1c` | `9d7131ec68b8b985` | 236 |
| discovery-receipt.json#203 | `157a95d5-8246-83b3-8dfd-1efc40e591f3` | `b88c9f1c` | `5ee9be8c559ff35e` | 237 |
| discovery-receipt.json#204 | `10e7dd8b-3315-8992-a554-240baf6dbe71` | `b88c9f1c` | `ec2224549819b3ec` | 238 |
| discovery-receipt.json#205 | `5212eb32-3a0f-8dea-9a26-6a98637a9811` | `b88c9f1c` | `9c8dc3c4c31f281c` | 239 |
| discovery-receipt.json#206 | `2e7e7a84-2412-8c03-ac50-d986e3143714` | `b88c9f1c` | `706f17eec2da1804` | 240 |
| discovery-receipt.json#207 | `faadabea-8900-8e70-9a50-a469477979c3` | `b88c9f1c` | `c5adb7f2246ceab6` | 241 |
| discovery-receipt.json#208 | `ea522328-97fe-8bf3-a48e-567ce1483dea` | `b88c9f1c` | `8a3159920184f9bd` | 242 |
| discovery-receipt.json#209 | `adf91266-5394-8614-abe7-4f14e908b8f7` | `b88c9f1c` | `8eff31f38b201035` | 243 |
| discovery-receipt.json#210 | `be6fe785-c845-8575-b759-7e145bb81786` | `b88c9f1c` | `290c2d40623edd21` | 244 |
| discovery-receipt.json#211 | `181b9424-10e4-8d96-8088-064ede04009a` | `b88c9f1c` | `4b9c0d6196ccb2e8` | 245 |
| discovery-receipt.json#212 | `6ebed8aa-08d9-8e76-b73a-ec5538ecad8d` | `b88c9f1c` | `2619e6e1450e2056` | 246 |
| discovery-receipt.json#213 | `ef594d2f-ea7d-8ecb-9954-8d6f7a9cadc6` | `b88c9f1c` | `1f4acbacf536338b` | 247 |
| discovery-receipt.json#214 | `a7eea3ef-fa6a-8d2c-8fbc-96ceac282d98` | `b88c9f1c` | `fb60ef74cc9c82b6` | 248 |
| discovery-receipt.json#215 | `07933d1f-c39e-8c93-8c7c-43a9dd8e78c6` | `b88c9f1c` | `e5c366993f6be29a` | 249 |
| discovery-receipt.json#216 | `53eb375c-30b7-87c7-a0e3-060a72a945cb` | `b88c9f1c` | `6b1436b5ccf02bb2` | 250 |
| discovery-receipt.json#217 | `e7717789-28c5-85f8-994c-debaad6e1d3b` | `b88c9f1c` | `26a14d16c1300628` | 251 |
| discovery-receipt.json#218 | `a60813a1-0273-8d96-acbb-c43f46285940` | `b88c9f1c` | `6e5532399152ff67` | 252 |
| discovery-receipt.json#219 | `111a7837-0160-8b08-8ec8-3d7caf1f01ae` | `b88c9f1c` | `de04d8eefa63082e` | 253 |
| discovery-receipt.json#220 | `649749d7-7c5a-8814-8f0a-d82c8142c8e3` | `b88c9f1c` | `16efa9ab05d98327` | 254 |
| discovery-receipt.json#221 | `90988773-3adc-83c8-a7dc-18794e296fe5` | `b88c9f1c` | `c2d87709d75daade` | 255 |
| discovery-receipt.json#222 | `1e35a508-4003-8690-a909-191402c2cbb9` | `b88c9f1c` | `c454b96dae273b4a` | 256 |
| discovery-receipt.json#223 | `415e8229-dbbe-8445-96d8-1463213949d2` | `b88c9f1c` | `654695c3c848ff98` | 257 |
| discovery-receipt.json#224 | `533bb20f-8734-8cb9-a954-ced7a2f63d90` | `b88c9f1c` | `52ff27930450db3b` | 258 |
| discovery-receipt.json#225 | `785f82a5-396d-8d30-932c-9481d534f5b0` | `b88c9f1c` | `95757de9d331060c` | 259 |
| discovery-receipt.json#226 | `b292ec0b-c8ca-84f4-b5f8-f4a98d6226fc` | `b88c9f1c` | `3eff6cc650443033` | 260 |
| discovery-receipt.json#227 | `ccfcf0da-4ad2-8120-be0f-0bdb065be85b` | `b88c9f1c` | `1a1ff06bc8f2e26b` | 261 |
| discovery-receipt.json#228 | `b77628f2-828e-8d7d-9880-e01492acc702` | `b88c9f1c` | `14f89118fbdfd7b7` | 262 |
| discovery-receipt.json#229 | `86a44de3-6014-89f1-9e6e-359a3c45f024` | `b88c9f1c` | `a2365ecce90bac41` | 263 |
| flaws-receipt.json | `99384329-334e-803f-9158-4c5bedc6009a` | `3efdf618` | `4c375110f22b54d5` | 264 |
| formulas-receipt.json | `0b49234b-1646-8bf2-be2d-2f6726cb5667` | `3efdf618` | `dbe2c46cfd62eb3b` | 265 |
| formulas-receipt.json#0 | `3d2059d3-192f-8051-97cb-0186acdc222d` | `0b49234b` | `84e655e8d3dfadf7` | 266 |
| formulas-receipt.json#1 | `122cdba7-a682-809a-89d6-07301208b019` | `0b49234b` | `b837e0c85c7ea7a6` | 267 |
| formulas-receipt.json#2 | `1fb846be-8439-85df-8c7a-1bf25bf168e4` | `0b49234b` | `89515e2fd2f24836` | 268 |
| formulas-receipt.json#3 | `4744c715-74c5-8f14-93a4-d9c87cf005f3` | `0b49234b` | `6b67046c9f183b50` | 269 |
| formulas-receipt.json#4 | `bf27b91c-1b20-8d73-adb0-2b4c8b2b5af0` | `0b49234b` | `ba2c5aec06ecbd89` | 270 |
| formulas-receipt.json#5 | `3a4538c2-22f7-8898-87ea-f81d8c96b9b0` | `0b49234b` | `8029612895653f0a` | 271 |
| formulas-receipt.json#6 | `0ee1fae4-c344-861f-a0ed-292012f55419` | `0b49234b` | `3cfe621165acf092` | 272 |
| formulas-receipt.json#7 | `29bfabd6-870f-8748-abb1-9b068ce32633` | `0b49234b` | `c413c598db1ba1bb` | 273 |
| formulas-receipt.json#8 | `3b83044b-a91d-82d6-889a-871006760227` | `0b49234b` | `98b5615f3e903f5e` | 274 |
| formulas-receipt.json#9 | `26be92fa-08ec-80af-ab7d-df8a64e0c8b8` | `0b49234b` | `decadaf79acd8762` | 275 |
| formulas-receipt.json#10 | `d12391a5-72d9-8612-b054-7bf9280fa540` | `0b49234b` | `ed5da4f41c11e58e` | 276 |
| formulas-receipt.json#11 | `6676b096-c68f-82f7-a2c4-2b2ca766e947` | `0b49234b` | `b294d8d0988d8060` | 277 |
| formulas-receipt.json#12 | `611b940b-54d0-8b50-b33f-501e3fb86281` | `0b49234b` | `4694da2288c7ade7` | 278 |
| formulas-receipt.json#13 | `c85cbebe-64b8-817c-bc49-19fd6ba0fbab` | `0b49234b` | `12b16223ef1b90cd` | 279 |
| formulas-receipt.json#14 | `eb4276db-7ca7-8dbf-a262-a30a72068cce` | `0b49234b` | `8bc877971d962b06` | 280 |
| formulas-receipt.json#15 | `082487f1-3b3a-8b64-a56e-c9d0926fdc6b` | `0b49234b` | `b7259d8ee30f0913` | 281 |
| formulas-receipt.json#16 | `c6a9f49d-6bbf-8199-8800-8a8598c8a14a` | `0b49234b` | `f95bf8f55440fdb1` | 282 |
| formulas-receipt.json#17 | `efce3e20-ef22-85a9-8df7-d6c228cc7984` | `0b49234b` | `fcdfb6c0cd255804` | 283 |
| formulas-receipt.json#18 | `05a4bb1c-f49d-8876-ba0b-560324bad438` | `0b49234b` | `f8b50a06e62c14fb` | 284 |
| formulas-receipt.json#19 | `2ff87b3f-a0ee-8820-a9ea-ec1f6f40c8be` | `0b49234b` | `baccc5af8f75a8c8` | 285 |
| formulas-receipt.json#20 | `85da7373-f59b-8394-842e-047fccf933ae` | `0b49234b` | `ff11c6163f9ede4c` | 286 |
| formulas-receipt.json#21 | `7e8ae26d-2a83-8210-b042-af57ba0be7f4` | `0b49234b` | `164906aa079c439b` | 287 |
| formulas-receipt.json#22 | `52355949-8650-8db4-874c-1caddf7f62a7` | `0b49234b` | `f1b1d55ca4a1c11d` | 288 |
| formulas-receipt.json#23 | `223b4a3d-aac2-87a4-a75c-35d5006d0680` | `0b49234b` | `7a6cdad6e47d249f` | 289 |
| formulas-receipt.json#24 | `a32326ca-483d-8b64-af32-16d733f4a134` | `0b49234b` | `b2facf976b3c1a4b` | 290 |
| formulas-receipt.json#25 | `57ef6049-4983-816a-adb3-9d9ee036ec4f` | `0b49234b` | `5a0fb345c45025a1` | 291 |
| formulas-receipt.json#26 | `51d2fdf6-a99b-8be8-9b73-963e15c5e397` | `0b49234b` | `a49ef8ab807dcf49` | 292 |
| formulas-receipt.json#27 | `8cd01ab7-d491-81e0-b715-2141275f7c47` | `0b49234b` | `c81fa3fafb55d393` | 293 |
| formulas-receipt.json#28 | `9abb948c-6a5f-8767-a2ba-61b2380e6e69` | `0b49234b` | `0be6c8e0144a9779` | 294 |
| formulas-receipt.json#29 | `31755ea3-2b03-8c56-8b5f-2d925feb9c70` | `0b49234b` | `cf1133e5a2ce9d6f` | 295 |
| formulas-receipt.json#30 | `a355128a-1513-8990-aec2-abbfe1d2359b` | `0b49234b` | `bc24f66d8a1d843d` | 296 |
| formulas-receipt.json#31 | `e589841c-cad2-8976-9d7b-9e2be8dbfcc4` | `0b49234b` | `b403f671d6e6cdec` | 297 |
| formulas-receipt.json#32 | `8118c934-ce43-818f-93c6-789eda5f16e5` | `0b49234b` | `63be93de7cf8af77` | 298 |
| formulas-receipt.json#33 | `a93b7883-42de-84cd-a688-227cff6a1dde` | `0b49234b` | `c61a88659071f907` | 299 |
| formulas-receipt.json#34 | `f6c79102-55f1-8359-a5c8-856e4aa124f7` | `0b49234b` | `7807d888be900817` | 300 |
| formulas-receipt.json#35 | `9c9f8b5a-3175-8679-b10c-f9771ce1c123` | `0b49234b` | `48a59d501fb01b13` | 301 |
| formulas-receipt.json#36 | `a7c7bc9e-5355-831a-94b8-eca0112e4989` | `0b49234b` | `f5c3ba49b68d8f91` | 302 |
| formulas-receipt.json#37 | `1c8dc3bd-6ecc-81f0-9365-6b7125e14ad2` | `0b49234b` | `aa2cfb68632c5119` | 303 |
| formulas-receipt.json#38 | `796eb868-9e4e-84a3-be38-49df32093ce8` | `0b49234b` | `8392917421a52db1` | 304 |
| formulas-receipt.json#39 | `d2487d9f-6160-8efc-9695-4629e7c46fdf` | `0b49234b` | `6662ca2e44ab30ce` | 305 |
| formulas-receipt.json#40 | `6cf94ea3-3bfb-87be-b7cd-98205b5d5264` | `0b49234b` | `f563e65959af7e4e` | 306 |
| formulas-receipt.json#41 | `a1865459-e0c5-8aa8-a22a-2995dc7a2d92` | `0b49234b` | `92831b82805af163` | 307 |
| formulas-receipt.json#42 | `9c188d9e-30a0-8a68-a80d-d0753c9e55ac` | `0b49234b` | `557f5e671bd51404` | 308 |
| formulas-receipt.json#43 | `904cbda8-e37e-8aed-b0b6-1643e0321b16` | `0b49234b` | `96bf41580bb3e014` | 309 |
| formulas-receipt.json#44 | `a74440cf-ac48-8019-aba2-f46a26337bf8` | `0b49234b` | `1081e629ee709212` | 310 |
| formulas-receipt.json#45 | `e453330c-bf9c-8ccf-9084-42b8ec32b53b` | `0b49234b` | `8f9bf89769e156e0` | 311 |
| formulas-receipt.json#46 | `a50867d8-482f-8f42-b2d8-532de4f6c02d` | `0b49234b` | `c26d82a4db15e6e2` | 312 |
| formulas-receipt.json#47 | `55829bab-427b-8f0b-975a-3cfc3ac6580e` | `0b49234b` | `7589f697a532a331` | 313 |
| formulas-receipt.json#48 | `a8df055f-0bee-8cb3-88d7-6ed6eb7b9c17` | `0b49234b` | `ca69c8b2bfd18768` | 314 |
| formulas-receipt.json#49 | `b85c441f-a5aa-8593-8b51-5c35036cb965` | `0b49234b` | `35d178ba5806de3e` | 315 |
| formulas-receipt.json#50 | `5ba85722-c7f6-87e0-95ab-dce33f64d552` | `0b49234b` | `79165b15a85cd1c9` | 316 |
| formulas-receipt.json#51 | `747a988c-da57-8276-8672-d5a32a32b6ca` | `0b49234b` | `19b9443386db5207` | 317 |
| formulas-receipt.json#52 | `01fd9128-b9dd-8161-bb38-077b7719706b` | `0b49234b` | `a5e18eaf7c36d53e` | 318 |
| formulas-receipt.json#53 | `6bf1cc70-b177-8a50-b344-40d234b409e8` | `0b49234b` | `4af9d1ed26649ab9` | 319 |
| formulas-receipt.json#54 | `8123449b-e69d-8385-8182-a2bad3685855` | `0b49234b` | `829600c37fb2c3cc` | 320 |
| formulas-receipt.json#55 | `b5a57efb-5768-825b-b7dd-2edabc4e62b0` | `0b49234b` | `6384cd49f6ae7653` | 321 |
| formulas-receipt.json#56 | `f41bf9ff-e350-8d1e-aacd-eed67d00c0b1` | `0b49234b` | `b9182644b90809c4` | 322 |
| formulas-receipt.json#57 | `70ad65f2-b655-8999-9873-941f0ed8beec` | `0b49234b` | `e1016d184d08867a` | 323 |
| formulas-receipt.json#58 | `90f6874c-0623-8c84-b955-ebe2086c1ab0` | `0b49234b` | `61e5f465150e9fb6` | 324 |
| formulas-receipt.json#59 | `0cf5a8f7-8075-81ec-8af8-07e1ffa29b79` | `0b49234b` | `0bb30b26a85df1e2` | 325 |
| formulas-receipt.json#60 | `1660c833-11ee-8cce-b4e6-683cae380b39` | `0b49234b` | `e856c137149495c1` | 326 |
| formulas-receipt.json#61 | `4ae1e17f-8c4b-8b35-8169-7344b6e66fe2` | `0b49234b` | `577494687c1be17c` | 327 |
| formulas-receipt.json#62 | `7eaaca59-7aca-8117-a1f1-fc426ee96ca9` | `0b49234b` | `06962e72272574ab` | 328 |
| formulas-receipt.json#63 | `6018e7ce-af30-8593-8b65-d9ca1314c30b` | `0b49234b` | `56b20f8799d6b7ec` | 329 |
| formulas-receipt.json#64 | `30f53e63-c8b1-8528-a2c3-a01b178bcc51` | `0b49234b` | `9d5eabf51b1d3f15` | 330 |
| formulas-receipt.json#65 | `597dee7a-151c-8d96-a1d6-20ad89155681` | `0b49234b` | `ab940b45add682a2` | 331 |
| formulas-receipt.json#66 | `5a4833c7-8147-88c2-aabc-d733a44ea5c2` | `0b49234b` | `c1b32a56a930528a` | 332 |
| formulas-receipt.json#67 | `71e57233-1183-8734-95ee-c2059c8a0231` | `0b49234b` | `2558048ef349fa9d` | 333 |
| formulas-receipt.json#68 | `dd1578e4-4350-825a-a5e4-f0e387159cd4` | `0b49234b` | `c41a2a719dbe2407` | 334 |
| formulas-receipt.json#69 | `07037204-2b8c-8976-ae9a-4ac5dde4624d` | `0b49234b` | `5e9d093b584d1aa5` | 335 |
| formulas-receipt.json#70 | `c57dff73-9f08-8fdf-9c78-7f7eace6be96` | `0b49234b` | `f1c0a497d54f22b0` | 336 |
| formulas-receipt.json#71 | `d501fe7e-066f-84c9-9869-a14d5131be95` | `0b49234b` | `9c4dbfae16230c90` | 337 |
| formulas-receipt.json#72 | `6f041ae5-e7a3-8427-a84c-900fa610e3b1` | `0b49234b` | `d342241f5ab2d9dc` | 338 |
| formulas-receipt.json#73 | `ed6df0bd-fc92-8dd9-9c89-915b87a91ec5` | `0b49234b` | `1986cdb8d489b44b` | 339 |
| formulas-receipt.json#74 | `0b31db37-abbb-8252-8a08-f1aade410022` | `0b49234b` | `9092ba22b6b56870` | 340 |
| formulas-receipt.json#75 | `79762620-5ea2-8580-b9d1-b40c46a4e2f9` | `0b49234b` | `6b53d7d27b6d3a5c` | 341 |
| formulas-receipt.json#76 | `3a71afc0-ecdd-8424-b28a-daa7fcbb6e72` | `0b49234b` | `8a1eb11de8387202` | 342 |
| formulas-receipt.json#77 | `63f029d4-f314-820b-b0a7-05b0788c5944` | `0b49234b` | `39ccfe9889225e5b` | 343 |
| formulas-receipt.json#78 | `36b4cb41-7f44-8d0b-bcb3-031506f1559e` | `0b49234b` | `9116f7ac9d0cd1b4` | 344 |
| fuse-receipt.json | `8ec75d64-9786-8b8d-a515-eb875466465d` | `3efdf618` | `1e8c60741e0cdbbe` | 345 |
| heat-receipt.json | `2348a986-4bc4-806c-9d12-d9e67757eed4` | `3efdf618` | `4fe0429f895f7db7` | 346 |
| heat-receipt.json#0 | `dbd90c94-bddc-8f72-8745-30bf03ff8164` | `2348a986` | `a2ea20d5ec47d6fb` | 347 |
| heat-receipt.json#1 | `f5385f79-973b-8d37-8c45-11b2d35d0a87` | `2348a986` | `823155902f9e0b06` | 348 |
| heat-receipt.json#2 | `4156474c-e5e9-827b-a65a-83a7f4381199` | `2348a986` | `bcec9f3722ed4a06` | 349 |
| heat-receipt.json#3 | `738590e1-0006-807b-a4dc-137fd34875f7` | `2348a986` | `475a704ad8699986` | 350 |
| heat-receipt.json#4 | `35aab0c5-5078-8796-8614-d66751cc9d8e` | `2348a986` | `7a7c9474c1b53873` | 351 |
| heat-receipt.json#5 | `88c540e8-8031-87bb-90f2-f9d26db8b0e5` | `2348a986` | `c24b53a1650bcafb` | 352 |
| heat-receipt.json#6 | `f069bf9c-e8ea-8ad0-9b1a-ebe5d8af3f88` | `2348a986` | `b0d45c8b1fb7de8e` | 353 |
| heat-receipt.json#7 | `c8d7b94d-361d-89c2-936c-87c29f566a1c` | `2348a986` | `4174b8dec229652a` | 354 |
| heat-receipt.json#8 | `9ff3609a-ab4d-8cf4-8fa4-1e1954a022a5` | `2348a986` | `59123dc9b7e17427` | 355 |
| heat-receipt.json#9 | `363e9769-662a-89eb-9866-d622a282c0e1` | `2348a986` | `d08c403160cb7c9d` | 356 |
| heat-receipt.json#10 | `59de9074-446c-81ef-9596-1c552fc0a012` | `2348a986` | `66d32962a5c0ac72` | 357 |
| heat-receipt.json#11 | `f275c409-245f-893a-b166-fa0f0d4bc28a` | `2348a986` | `4e964ca7498f146f` | 358 |
| heat-receipt.json#12 | `2a7ef551-f706-8264-9025-676f84592534` | `2348a986` | `953c383ef4bae49b` | 359 |
| heat-receipt.json#13 | `84be3d5f-5fab-8351-bba4-55560fbcb6c4` | `2348a986` | `3a458ad1b52cd3c7` | 360 |
| heat-receipt.json#14 | `f4727853-dae7-8930-8ddb-53bea17e7d01` | `2348a986` | `b50e541a40930d5b` | 361 |
| heat-receipt.json#15 | `169a18f9-3d24-809b-a9f7-364053b3c69e` | `2348a986` | `b68206758ce7664e` | 362 |
| heat-receipt.json#16 | `213b0063-84b7-87b6-ac62-bd4a4ab72703` | `2348a986` | `c8d3d8b851b41379` | 363 |
| heat-receipt.json#17 | `ea725e51-965f-8578-9251-1f86d207f805` | `2348a986` | `aaf6f2712a25b1ca` | 364 |
| heat-receipt.json#18 | `9b351299-5e82-8408-af91-4573cf72e530` | `2348a986` | `7bde43a734e23181` | 365 |
| heat-receipt.json#19 | `8fc46eec-3dd4-8ea5-8999-5bc06b6739bb` | `2348a986` | `48354a4224f8966f` | 366 |
| heat-receipt.json#20 | `f7b862ff-e017-8bc5-a570-004000b6d8c3` | `2348a986` | `2d7e511c7a7cf3da` | 367 |
| heat-receipt.json#21 | `2a4f9028-b4ec-817b-96d3-6fbb9d912b70` | `2348a986` | `4f387b8f199fb44a` | 368 |
| heat-receipt.json#22 | `eb361c82-27a4-8e0b-9725-4f9d39ff1fb1` | `2348a986` | `099bf50bb6b8227a` | 369 |
| heat-receipt.json#23 | `7e432f03-bf5b-8d2e-95f6-1c9e863a6c56` | `2348a986` | `1683d05bf66c1155` | 370 |
| heat-receipt.json#24 | `85bdcd34-5a5e-84c1-bcdc-275da530429b` | `2348a986` | `f2d79ff9379603c4` | 371 |
| heat-receipt.json#25 | `04918d1f-28ab-856a-ad1d-ce829b8ea9d4` | `2348a986` | `9d30213f0a50217f` | 372 |
| heat-receipt.json#26 | `dfa87f74-290a-82e0-a368-794c13afcc63` | `2348a986` | `3e07dfc3548b2740` | 373 |
| heat-receipt.json#27 | `f453c0d8-a7e7-834c-a2f3-50d96b98d080` | `2348a986` | `a7d4fedc982e2b54` | 374 |
| heat-receipt.json#28 | `35f0134e-22dc-8318-8adc-f82b60401ab7` | `2348a986` | `991e5a9e912aee24` | 375 |
| heat-receipt.json#29 | `f427bae2-ec38-87ac-83c9-cc97373948db` | `2348a986` | `93d061239fd53b6b` | 376 |
| heat-receipt.json#30 | `f1cae088-6c7d-89e0-94ac-0ab6238204b8` | `2348a986` | `838fc11c15c23588` | 377 |
| heat-receipt.json#31 | `e3ebe465-f3ec-8df9-8818-23dc4943d547` | `2348a986` | `e51b1f3f1170fffd` | 378 |
| heat-receipt.json#32 | `a747466f-3a56-8b33-869e-84bd27b3386b` | `2348a986` | `0dff5941f9e50d5f` | 379 |
| heat-receipt.json#33 | `5fcf0061-03c9-82b4-85e6-5fcb04461cd6` | `2348a986` | `6b490d2c047e8765` | 380 |
| heat-receipt.json#34 | `583a4d8b-c379-84bd-a1c4-dbf6ba3d3849` | `2348a986` | `e68fd33f5acdf7e4` | 381 |
| heat-receipt.json#35 | `c3b32d94-2513-8502-b8c0-1443fc0d805b` | `2348a986` | `49d512f9289536df` | 382 |
| heat-receipt.json#36 | `797c304d-dbf8-8975-b58f-ab77c138b135` | `2348a986` | `aa60725f9ef896d4` | 383 |
| heat-receipt.json#37 | `742389e4-d3b6-8a02-b357-f29973405b6a` | `2348a986` | `fab341b1d3da5f1b` | 384 |
| heat-receipt.json#38 | `ba8ac9dc-e742-84a7-916e-d8d78defa2cf` | `2348a986` | `65af7b69aa21b0e9` | 385 |
| heat-receipt.json#39 | `16344130-2dfe-8b35-ac82-7189fac2d62e` | `2348a986` | `0a0c00efb61b5f24` | 386 |
| lattice-receipt.json | `2d2d7ccf-e8a1-8fcf-b01a-3e875c0f844d` | `3efdf618` | `5c9367f8765423b2` | 387 |
| lean-receipt.json | `1a5f4a99-8b95-8ae8-bcd3-a9d5a6625ed0` | `3efdf618` | `7a63d6ab25d404f4` | 388 |
| lean-receipt.json#0 | `58263a57-1a66-81d1-b080-b27ee369a191` | `1a5f4a99` | `01a4314334920464` | 389 |
| lean-receipt.json#1 | `07d835fa-f3c7-86f4-a639-07afa86bb922` | `1a5f4a99` | `17dd686d646c00c4` | 390 |
| lean-receipt.json#2 | `388a9f96-96a5-8bd2-af1b-111e9f16e818` | `1a5f4a99` | `85559ecfe991db72` | 391 |
| lean-receipt.json#3 | `03a9a055-5b7d-86b6-ad41-af4fc6ddec48` | `1a5f4a99` | `0b81c75ca7b9f612` | 392 |
| lean-receipt.json#4 | `8e613a62-4431-89ce-b9fe-59d801be9b0a` | `1a5f4a99` | `856c8808576cb0ed` | 393 |
| lean-receipt.json#5 | `e986de65-2ad9-8721-8379-83e39510d51c` | `1a5f4a99` | `8c42f871b54b87a0` | 394 |
| lean-receipt.json#6 | `0785bbdd-b4b8-8d59-9121-c48b1c717c37` | `1a5f4a99` | `a1bb51780f3b93f2` | 395 |
| lean-receipt.json#7 | `0c09d334-6fa0-8dcb-82ff-51f83c4b8d16` | `1a5f4a99` | `8c393b1c4570738a` | 396 |
| lean-receipt.json#8 | `54f262d6-be3d-8756-b546-0cb5b7f183aa` | `1a5f4a99` | `8759e151d526b48d` | 397 |
| lean-receipt.json#9 | `5fb29085-4f6d-83cb-89c4-55b47f76cc93` | `1a5f4a99` | `ba236e62d0f2e667` | 398 |
| lean-receipt.json#10 | `9a2ef8b6-a6a5-82cf-a3c2-62d0f6aabd37` | `1a5f4a99` | `2d3bffa2815b71de` | 399 |
| lean-receipt.json#11 | `357b6dae-6e03-8343-bf5d-5e8817117f0f` | `1a5f4a99` | `3b823db63b5cf251` | 400 |
| lean-receipt.json#12 | `70c640f2-91a7-8f1b-a5e9-e07425cc894c` | `1a5f4a99` | `8198bb405e69ae3d` | 401 |
| lean-receipt.json#13 | `97978321-d719-8a00-b240-1c508d420c46` | `1a5f4a99` | `fa381a949b4f1709` | 402 |
| lean-receipt.json#14 | `19b7a62f-95cf-89d1-bdcb-bb36ae7ee670` | `1a5f4a99` | `ccbc114c64b5d7d5` | 403 |
| lean-receipt.json#15 | `5586ac39-0222-8993-834f-194e4d192373` | `1a5f4a99` | `ca2d842deaaa3417` | 404 |
| lean-receipt.json#16 | `e9e1bc14-941b-814c-b0dd-e23950dcdea6` | `1a5f4a99` | `c26db2931600ef72` | 405 |
| lean-receipt.json#17 | `f2eee90f-1f4e-8c2e-9646-731beed343a3` | `1a5f4a99` | `f1d614a5647be442` | 406 |
| lean-receipt.json#18 | `b8f1e02a-d29b-850b-ba5e-07aee6c2ae6d` | `1a5f4a99` | `20b0af073db0d784` | 407 |
| lean-receipt.json#19 | `73a75339-1276-8f57-8de5-073cc243a3e0` | `1a5f4a99` | `661bd8788a9d8fec` | 408 |
| lean-receipt.json#20 | `b065a947-4829-8715-9e9e-d7d9908ba850` | `1a5f4a99` | `8ae5bda61686e5fe` | 409 |
| lean-receipt.json#21 | `83b7cb32-194b-843f-841c-c631d56c1f3e` | `1a5f4a99` | `0173e958093f571c` | 410 |
| lean-receipt.json#22 | `0af42176-cbc0-8064-a3cc-23ce27c80c43` | `1a5f4a99` | `dc9170336312cfdd` | 411 |
| lean-receipt.json#23 | `abd2c3f8-bb26-83ae-8099-1ace86f75d79` | `1a5f4a99` | `a928836e949a3b08` | 412 |
| lean-receipt.json#24 | `d461ac00-4b45-8260-9d89-8e0baab573f7` | `1a5f4a99` | `892beb0c6c10c5d8` | 413 |
| lean-receipt.json#25 | `31f4ab4d-ed37-8a59-bea2-6ff2e6d01c95` | `1a5f4a99` | `54b1ada5511adb73` | 414 |
| lean-receipt.json#26 | `99c794f5-1b5e-8c54-a3ad-e3b2793be44f` | `1a5f4a99` | `ac8eef3ad8936c18` | 415 |
| lean-receipt.json#27 | `df38bb0b-aa01-8332-99e9-df10c138a0dd` | `1a5f4a99` | `7256c466c3448c3f` | 416 |
| lean-receipt.json#28 | `02078a0a-f9cc-8cfa-aa68-df8be7c91e00` | `1a5f4a99` | `783f0872ec919aeb` | 417 |
| lean-receipt.json#29 | `1050260d-62f5-8f7f-a5c0-1e6849dac896` | `1a5f4a99` | `c2625317519e7ea0` | 418 |
| lean-receipt.json#30 | `8eb6ca55-7c31-8ae7-ba96-a0bfbfcb9316` | `1a5f4a99` | `b828aefe631f023f` | 419 |
| lean-receipt.json#31 | `ee878290-9020-840c-a31b-8446d914af61` | `1a5f4a99` | `28c97dc8c98c1353` | 420 |
| lean-receipt.json#32 | `94a6a929-3c9c-8c84-8a10-d753b891bb54` | `1a5f4a99` | `a50a453d176456ba` | 421 |
| lean-receipt.json#33 | `35bd6693-9da4-88d2-84ed-b886f7dbcc8f` | `1a5f4a99` | `e9987eb5bb747c92` | 422 |
| lean-receipt.json#34 | `3bfd41a6-455b-82e8-9793-70a7501d2366` | `1a5f4a99` | `d96c3e86ca8300bb` | 423 |
| lean-receipt.json#35 | `8a778827-baa3-86cc-8a19-a957d0f0862b` | `1a5f4a99` | `026803944de9f8fb` | 424 |
| lean-receipt.json#36 | `12261a2d-fc9d-866d-a9cf-1cd4d93cb27d` | `1a5f4a99` | `9493a574bb66c834` | 425 |
| lean-receipt.json#37 | `47800eb0-ef71-824f-b53a-156655f5da0e` | `1a5f4a99` | `e49607ea34f2e643` | 426 |
| lean-receipt.json#38 | `f0ed362b-a5d5-8b9b-a4fd-c80530cec762` | `1a5f4a99` | `3a9d0303d541d513` | 427 |
| lean-receipt.json#39 | `d1daf2b7-cdad-8fbd-8bf2-7ba2ca94bd72` | `1a5f4a99` | `850461c1588ef998` | 428 |
| lean-receipt.json#40 | `7ff5fbeb-35dc-8223-997a-911395a3915a` | `1a5f4a99` | `54ced7ee08c43b01` | 429 |
| lean-receipt.json#41 | `685a1f01-58cd-82fd-abbe-b3505226b122` | `1a5f4a99` | `883120543a46eeba` | 430 |
| lean-receipt.json#42 | `87f0cb06-1f4a-8f34-80e4-3cf058d99ff4` | `1a5f4a99` | `3ab0cd25a6b5a51c` | 431 |
| lean-receipt.json#43 | `c18c74b8-cb28-8f5d-8984-37fad2bcf441` | `1a5f4a99` | `f9b7bcab6eb1f2ec` | 432 |
| lean-receipt.json#44 | `26399ae6-2a1b-8856-bc96-c103ee1340f0` | `1a5f4a99` | `ba26eb0385ad4049` | 433 |
| lean-receipt.json#45 | `aca13174-e113-88fc-b3a2-e6ad88f98d53` | `1a5f4a99` | `cdfdeaec366d59a9` | 434 |
| lean-receipt.json#46 | `666462c7-48c3-85c3-b89c-ebca83146738` | `1a5f4a99` | `a3f34c2b09cbdc81` | 435 |
| lean-receipt.json#47 | `47f0efe9-249f-82e0-baf6-9227345aac57` | `1a5f4a99` | `fa828c0c9002434a` | 436 |
| lean-receipt.json#48 | `a84ee201-5e5f-89fc-bb46-101f9f73d29b` | `1a5f4a99` | `390ee6112bc84229` | 437 |
| lean-receipt.json#49 | `db48c610-10a0-8648-bcc4-ad04574681ef` | `1a5f4a99` | `14e7224d07b82fe5` | 438 |
| lean-receipt.json#50 | `3ab5902f-3087-8c3d-8264-178216ef0052` | `1a5f4a99` | `a26d61f94731765b` | 439 |
| lean-receipt.json#51 | `5e146c01-d128-886c-919a-eacd29f4799e` | `1a5f4a99` | `0606ba04128bc864` | 440 |
| lean-receipt.json#52 | `92c5094d-63d8-86fa-a526-5635ac8a8cb1` | `1a5f4a99` | `d8fe7dee19a9eca9` | 441 |
| lean-receipt.json#53 | `63189fc5-7d3d-830a-8009-782fa1932f5d` | `1a5f4a99` | `5e9815aaca739805` | 442 |
| lean-receipt.json#54 | `ac2d0a1f-6cfd-81e2-85c0-3dbc04c2ce00` | `1a5f4a99` | `fca5ef45f516834b` | 443 |
| lean-receipt.json#55 | `db59f36d-3c97-87a9-9d20-a45676da8c8c` | `1a5f4a99` | `4e0f8d28c2a80cb1` | 444 |
| lean-receipt.json#56 | `2fa603e4-d66f-8187-b975-3d8239421c5a` | `1a5f4a99` | `bddfe267a640156c` | 445 |
| lean-receipt.json#57 | `ed533f0c-4fa3-8b2f-bb52-511eaa894559` | `1a5f4a99` | `aaca8fa141b1b164` | 446 |
| lean-receipt.json#58 | `2ebd0f8f-2164-862b-acf8-5cc96658a0a0` | `1a5f4a99` | `de9c1d0eb319845f` | 447 |
| lean-receipt.json#59 | `402e4912-8c03-8940-9c56-cf41c56e1f82` | `1a5f4a99` | `5ad4efe87055dad6` | 448 |
| lean-receipt.json#60 | `723f18d2-782f-8e3d-a8c7-d02e21a07c33` | `1a5f4a99` | `21f8222a910896f8` | 449 |
| lean-receipt.json#61 | `50c747c8-760d-829c-962b-de363d668d8c` | `1a5f4a99` | `9ab521ab8bfd2c30` | 450 |
| lean-receipt.json#62 | `ee9348f4-ee42-8e0b-95e3-062f762d41ee` | `1a5f4a99` | `97f276540373c55c` | 451 |
| lean-receipt.json#63 | `ff4eeb84-18f0-8654-bd14-c2ef5ca3722f` | `1a5f4a99` | `433fae11c15a3406` | 452 |
| lean-receipt.json#64 | `92747809-7286-8da1-851e-51ba99191b8a` | `1a5f4a99` | `99f6f1bba698c440` | 453 |
| lean-receipt.json#65 | `a4c660b0-487b-82dd-9c45-3ba60e35f985` | `1a5f4a99` | `9f74c15228e068ae` | 454 |
| lean-receipt.json#66 | `fc4500a5-7003-8923-8ba5-e46cbfa9e6a0` | `1a5f4a99` | `50d88d048369584c` | 455 |
| lean-receipt.json#67 | `74c4df39-a0bd-8ce0-bc38-e6033123840d` | `1a5f4a99` | `89f9254372ae56a4` | 456 |
| lean-receipt.json#68 | `10ad2eba-c06d-8b15-94c9-e866a4a2e552` | `1a5f4a99` | `019312acb7ec2b4b` | 457 |
| lean-receipt.json#69 | `47f248ac-e464-86cc-86f8-ef478eb473cc` | `1a5f4a99` | `09fe6367b5d53bf0` | 458 |
| lean-receipt.json#70 | `8ac51c85-adbf-894b-987f-72fc9b4b1e94` | `1a5f4a99` | `228f135985843f8b` | 459 |
| lean-receipt.json#71 | `f01e7f42-2686-8edf-906d-9a146eca19a3` | `1a5f4a99` | `43d4a9af3eae5238` | 460 |
| lean-receipt.json#72 | `9e4ce99a-2e51-87b6-ba65-45ad3e20a4ac` | `1a5f4a99` | `c48f727b686daaaa` | 461 |
| lean-receipt.json#73 | `19e32fb2-8f0c-8122-ba5f-7d6a6463ddb4` | `1a5f4a99` | `e948e238756c4b88` | 462 |
| lean-receipt.json#74 | `d5ab5e8f-29a0-8ab6-ad6b-84de6005e5a7` | `1a5f4a99` | `97efe68b81d61976` | 463 |
| lean-receipt.json#75 | `1082ed1c-1ebf-81ab-9c5d-cf31203c7ecb` | `1a5f4a99` | `9bff2b6d5fc53087` | 464 |
| lean-receipt.json#76 | `797bb6da-1a00-8352-9bd5-b0863cad5964` | `1a5f4a99` | `f7c370cf81952879` | 465 |
| lean-receipt.json#77 | `ac7da8ce-5505-834e-a904-3093e53f6900` | `1a5f4a99` | `d3ac9515015a7683` | 466 |
| lean-receipt.json#78 | `598dfed0-8219-881c-a0ec-fa074b2d4812` | `1a5f4a99` | `e39144dd650da2d3` | 467 |
| lean-receipt.json#79 | `7b76aa15-6cc4-8714-b63d-8fe2e693049c` | `1a5f4a99` | `13aa26d4330f37b7` | 468 |
| lean-receipt.json#80 | `3a0396d3-5a22-856e-9103-95ab9a0dfc5a` | `1a5f4a99` | `6fd3a89255a92ed8` | 469 |
| lean-receipt.json#81 | `1405d1b3-8c82-8bc1-9407-972358ddb005` | `1a5f4a99` | `2150be74f267d805` | 470 |
| lean-receipt.json#82 | `15262ff9-36fb-8b33-84f7-6a582c2362cd` | `1a5f4a99` | `ca40f3358e8ba4a4` | 471 |
| lean-receipt.json#83 | `1c5cd857-5c66-8536-8dc0-54599e118953` | `1a5f4a99` | `cd77c6f87b5b1064` | 472 |
| lean-receipt.json#84 | `429036cf-293d-8fab-9e0d-896dd457f13a` | `1a5f4a99` | `7013fccd8490dad7` | 473 |
| lean-receipt.json#85 | `e0dc70da-f77d-83a2-8fce-e08eac579597` | `1a5f4a99` | `7502a7db02d5a467` | 474 |
| lean-receipt.json#86 | `ccc9a42a-08c8-874e-a4c3-15f8aec01023` | `1a5f4a99` | `d8ed6351f82dc020` | 475 |
| lean-receipt.json#87 | `7f671737-67a3-89ff-9cfd-c6d0763e6168` | `1a5f4a99` | `87ad43e6d9e74af4` | 476 |
| lean-receipt.json#88 | `51f45a7c-68da-8c4f-86ea-d4282b251643` | `1a5f4a99` | `29a1ce5eccc794cd` | 477 |
| lean-receipt.json#89 | `dd36994c-962d-8d28-a9dd-fef1e3678c39` | `1a5f4a99` | `917a754ef7ded231` | 478 |
| lean-receipt.json#90 | `573576be-3022-8f1f-8dda-a5f201e485fc` | `1a5f4a99` | `2ddbc9e72c5863a3` | 479 |
| lean-receipt.json#91 | `d7aadc8a-fba7-8b55-8cd8-cd90fbdf22cb` | `1a5f4a99` | `19e70810b6c0569e` | 480 |
| lean-receipt.json#92 | `b88b91ca-efca-83e6-bedd-26c5f0a2bb3f` | `1a5f4a99` | `ab2dc0ed36085aae` | 481 |
| lean-receipt.json#93 | `f6ff8cdf-eb85-8627-baca-f4bcc99743ea` | `1a5f4a99` | `6b6a512c4de306e7` | 482 |
| lean-receipt.json#94 | `efee4812-ba5b-8493-b8d2-7b0c5a32cd8a` | `1a5f4a99` | `8cc93ec2a2c3b4c1` | 483 |
| lean-receipt.json#95 | `cf09be1e-11aa-85fe-a01c-b9dee43ab67b` | `1a5f4a99` | `4da17eb3cca04d6f` | 484 |
| lean-receipt.json#96 | `5dfacbda-3bbd-8289-a5ec-35a9f55f4928` | `1a5f4a99` | `cca2e313bbad6348` | 485 |
| lean-receipt.json#97 | `14dd5c58-bc7e-89ec-8b50-1ba95f7ce529` | `1a5f4a99` | `178311578707a3d9` | 486 |
| lean-receipt.json#98 | `651bd231-a565-8024-b416-80aeb540e6c6` | `1a5f4a99` | `d6aad521dd3822c7` | 487 |
| lean-receipt.json#99 | `e5696a82-3d13-8670-b65e-63bab2f0bcbf` | `1a5f4a99` | `a558c1105bcf6999` | 488 |
| lean-receipt.json#100 | `06ecf7c4-5016-8119-b371-297854341605` | `1a5f4a99` | `7002d9a2943b4233` | 489 |
| lean-receipt.json#101 | `f2ebd2a9-7073-8c81-80c8-0855c92681c2` | `1a5f4a99` | `af05078facef6371` | 490 |
| lean-receipt.json#102 | `a57489c9-2e91-82b0-953c-e1ed52ec1b24` | `1a5f4a99` | `d440e12709b21f65` | 491 |
| lean-receipt.json#103 | `d6f5a518-453a-8be5-b9a6-a92dc9300f03` | `1a5f4a99` | `4a5dc765b0ae881a` | 492 |
| lean-receipt.json#104 | `3b65ac95-7e35-8bb6-93c5-c362cc519478` | `1a5f4a99` | `6e33961b381f1b24` | 493 |
| lean-receipt.json#105 | `dc3a829d-bdfc-827b-9553-21e4389e8161` | `1a5f4a99` | `8995d8a066b7efef` | 494 |
| lean-receipt.json#106 | `791c0068-4397-8885-bac4-ef920a2b6c4d` | `1a5f4a99` | `ee05cc004c566b7d` | 495 |
| lean-receipt.json#107 | `37acb686-78b2-810d-873d-429815f3fd6e` | `1a5f4a99` | `4a5f92880000ec12` | 496 |
| lean-receipt.json#108 | `97291be6-21bb-8647-9395-c76f8a6cd4ab` | `1a5f4a99` | `673fccabf7917e43` | 497 |
| lean-receipt.json#109 | `1cf49047-d277-895f-9107-74628510d565` | `1a5f4a99` | `7e721ac4c1f5636e` | 498 |
| lean-receipt.json#110 | `402e14a0-aa43-8f72-a0a8-3ec1945be482` | `1a5f4a99` | `5104b1b5d221fe0c` | 499 |
| lean-receipt.json#111 | `5090a3d1-d3f6-8476-9887-1a506352e9c8` | `1a5f4a99` | `a53e2a3165bc2079` | 500 |
| lean-receipt.json#112 | `7fad7178-e3af-8d40-8a63-c671607f424f` | `1a5f4a99` | `ac11551381559b5d` | 501 |
| lean-receipt.json#113 | `78a1b6d8-8e15-819e-b8a0-642e76c23274` | `1a5f4a99` | `1e76aaa529c1faf4` | 502 |
| lean-receipt.json#114 | `1c11efd9-898b-8d32-9975-a4ac6659f7da` | `1a5f4a99` | `6650de8fa69d0055` | 503 |
| lean-receipt.json#115 | `2b86e2f9-b3e6-8d8c-9da7-d07636ce8c0d` | `1a5f4a99` | `45ffdc938f29d266` | 504 |
| lean-receipt.json#116 | `b8c65bbf-ed41-8199-9c0f-8fb27d0498e6` | `1a5f4a99` | `29720f16131d7884` | 505 |
| lean-receipt.json#117 | `af704e68-29b5-8885-9f2d-65b5a5b5b4b7` | `1a5f4a99` | `8f9e22c7e2bea6c9` | 506 |
| lean-receipt.json#118 | `25bf1640-245f-8381-a39a-af3dc670f165` | `1a5f4a99` | `f9363e39d4b6cfec` | 507 |
| lean-receipt.json#119 | `4417ca50-8405-891e-92ee-08a4f80e0aeb` | `1a5f4a99` | `123fa2b2b6e380b2` | 508 |
| lean-receipt.json#120 | `5114ffaf-1c1b-8d58-8de2-7a61123e10c0` | `1a5f4a99` | `df00ee1dd773d8f2` | 509 |
| lean-receipt.json#121 | `6a10ef3f-4e0e-87b6-9550-5e7c8c17ef11` | `1a5f4a99` | `20f85f44fda02861` | 510 |
| lean-receipt.json#122 | `d52d71e5-e1b9-81f8-aef9-fdb242bf2065` | `1a5f4a99` | `040743c9cee1336f` | 511 |
| lean-receipt.json#123 | `966da024-4f7c-855c-a6d7-51df2df8399a` | `1a5f4a99` | `bfa20fd6cf759420` | 512 |
| payload-cf-receipt.json | `665f38b3-2808-8991-a81f-3c099efc277c` | `3efdf618` | `f62f0aaf7ff26014` | 513 |
| percall-receipt.json | `a4369bde-5678-8ddc-b240-94a96b57ef3f` | `3efdf618` | `bb48a531ebc72170` | 514 |
| refusals-receipt.json | `a8e4163f-b665-8038-a82e-91ec8c0c3651` | `3efdf618` | `8c5570077f4d6204` | 515 |
| test-receipt.json | `d6d27344-9c2f-8987-b744-9083ab264c06` | `3efdf618` | `4a5cfb5ecff89ea1` | 516 |
| test-receipt.json#0 | `a8f560d3-6c18-8a3f-b281-71b6c132971a` | `d6d27344` | `9a01ace6de6b54ec` | 517 |
| test-receipt.json#1 | `86110348-5826-849a-af2b-50f3846b709c` | `d6d27344` | `a13d744057ec9cc2` | 518 |
| test-receipt.json#2 | `c503dc23-2b63-8918-b9d9-215606f3b88c` | `d6d27344` | `bbd68eebc2fb3df3` | 519 |
| test-receipt.json#3 | `a13c43f0-043c-8b80-9414-34f2ca5e2891` | `d6d27344` | `e739f4896d14e203` | 520 |
| test-receipt.json#4 | `4ec73578-23d4-8130-b286-d6b86b24ba36` | `d6d27344` | `7d78476f346361f5` | 521 |
| test-receipt.json#5 | `b81e2de4-a218-8809-a552-82e6a252b53a` | `d6d27344` | `3120a62df82699eb` | 522 |
| test-receipt.json#6 | `0ef20e44-d8e7-8486-a84c-ea8520180d3a` | `d6d27344` | `e603dbc8c5889a16` | 523 |
| test-receipt.json#7 | `362e99d2-e229-80e5-8408-cbefa03dea63` | `d6d27344` | `09c5ebed7bd28d13` | 524 |
| test-receipt.json#8 | `c59daee6-21d1-8254-bfbf-1b0c19429fc5` | `d6d27344` | `987476006a69a566` | 525 |
| test-receipt.json#9 | `f6cff321-4270-83eb-9fcb-c4fae88e59a9` | `d6d27344` | `5d554129661dae60` | 526 |
| test-receipt.json#10 | `3a938f3a-3b67-872e-aa38-fe8794dbca89` | `d6d27344` | `c25f540b1357461f` | 527 |
| walls-receipt.json | `6b286681-8c0e-837e-96e1-9411a8402ea7` | `3efdf618` | `83830280c48bcc9d` | 528 |
| readme | `5e23d602-2950-8061-83df-537db2f1da20` | `3efdf618` | `7234f8c0011dbcc7` | 529 |

</details>

Regenerate with `npm run readme` after `npm run build` and the receipt-producing runs; `node scripts/generate-readme.mjs --check`
compares. Documentation: [docs/README.md](docs/README.md). License: CC-BY-NC-ND-4.0.
