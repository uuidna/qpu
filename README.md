# UUIDNA QPU

An exact quantum processing unit served over MCP at https://qpu.uuidna.com, with its site, admin and API on the
same host. Reads need no auth; storage writes need a Bearer token. Use it as an MCP server (`{ "qpu": { "type": "http",
"url": "https://qpu.uuidna.com/mcp" } }`), as a package (`npm install @uuidna/qpu`), or as a container.

| Capability | How much | Compared with |
|---|---|---|
| MCP door (https://qpu.uuidna.com/mcp) | 16 listed tools; through any of them 51 doors and 108 formulas (`{ doors: true }`, `{ door }`, `{ hex }`, `{ errors: true }`) | the Model Context Protocol: `tools/list` sealed by the Lean theorem agents_mcp_tools |
| Formal proof | 124 Lean theorems served, 124 recomputed in TypeScript | the Lean 4 kernel (leanprover/lean4:v4.33.0) |
| Formula families | 15 families run as hex-program UUIDs (RFC 9562 v8); 10,902 programs in the last discovery | each other: 161 values reached by two or more families, 7 seals (fixed points, involutions) |
| Live public data | 35 of 45 sources agree | CERN Open Data, NIST CODATA, OEIS (8 formulas identified as sequences), Zenodo, DataCite, ORCID, GitHub, npm, INSPIRE catalogues |
| Public APIs | 2,529 of 2,529 APIs walked live, 123,136 methods, 438,299 cross formulas | the APIs.guru registry, against the Lean theorem fuse |
| Cross formulas | 78 of 79 rows hold across 37 formulas | their own hex programs (36 agree) |
| Cryptography | 27/27 attacks resisted, no node:crypto | Node's crypto (parity), its own attacks |
| Live cross-proof | 27 of 30 claims agree | the hosts the claims name |
| Payload on Cloudflare | 98,304 combinations generated; the site is one Worker | Payload's documented plugins and adapters |
| Code heat | 324 of 340 files cold, 16 hot | Qpu.Physics: photon / thermal T |

Cite: Rouschev, Tsvetan. "qpu." doi:[10.5281/zenodo.23091364](https://doi.org/10.5281/zenodo.23091364). License: CC-BY-NC-ND-4.0
(commercial use by license: https://qpu.uuidna.com/license).

**Final build receipt** `149af883-c261-8986-9f01-268b94c88c04`

| | |
|---|---|
| version | 1.0.1 |
| commit | `a52cf8f3acf88e86df30a0acaa0a3ecf1f65ea25` (working tree differed from this commit) |
| receipts | 14 files, 529 nodes |
| build stream | length 529, head `149af883-c261-8986-9f01-268b94c88c04`, chain `c1fa6aeb8b2d73ed02b053312c09f9ad7fda7586f025d86ee8c8bbdb2f749b6f`, holds **true** |

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
| [Payload & Cloudflare](https://qpu.uuidna.com/cms) | 18 | 4 | 3 | 0 |
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
<summary>529 receipts, chained in the build stream</summary>

Each node is a quantum receipt: its UUID is the RFC 9562 v8 content address of its payload fold and its referrer, and
its referrer is the node above it. Change any receipt's bytes and its node, its file's node, the build stream chain
and this final receipt move; the root moves with the commit.

```mermaid
flowchart TD
  nae56ab68["root<br/><code>ae56ab68</code>"]
  n35c1451d["cross-receipt.json<br/><code>35c1451d</code>"]
  nef9664e7["cross-receipt.json#0<br/><code>ef9664e7</code>"]
  n837cb252["cross-receipt.json#1<br/><code>837cb252</code>"]
  n7ec2441c["cross-receipt.json#2<br/><code>7ec2441c</code>"]
  n4d4787dc["cross-receipt.json#3<br/><code>4d4787dc</code>"]
  nba991110["cross-receipt.json#4<br/><code>ba991110</code>"]
  naad33ea3["cross-receipt.json#5<br/><code>aad33ea3</code>"]
  n74aaa6eb["cross-receipt.json#6<br/><code>74aaa6eb</code>"]
  n50e2140d["cross-receipt.json#7<br/><code>50e2140d</code>"]
  n179c7d06["cross-receipt.json#8<br/><code>179c7d06</code>"]
  n9ad607be["cross-receipt.json#9<br/><code>9ad607be</code>"]
  n1742dd90["cross-receipt.json#10<br/><code>1742dd90</code>"]
  n089f1c96["cross-receipt.json#11<br/><code>089f1c96</code>"]
  nbc665889["cross-receipt.json#12<br/><code>bc665889</code>"]
  ne4cd5a63["cross-receipt.json#13<br/><code>e4cd5a63</code>"]
  n0452a696["cross-receipt.json#14<br/><code>0452a696</code>"]
  n5a66ce7b["cross-receipt.json#15<br/><code>5a66ce7b</code>"]
  n0d54e17a["cross-receipt.json#16<br/><code>0d54e17a</code>"]
  nbe346193["cross-receipt.json#17<br/><code>be346193</code>"]
  nb9e20632["cross-receipt.json#18<br/><code>b9e20632</code>"]
  n8b4b180c["cross-receipt.json#19<br/><code>8b4b180c</code>"]
  nf094aa84["cross-receipt.json#20<br/><code>f094aa84</code>"]
  ndce5a8e8["cross-receipt.json#21<br/><code>dce5a8e8</code>"]
  nae17f862["cross-receipt.json#22<br/><code>ae17f862</code>"]
  n8ed0cb58["cross-receipt.json#23<br/><code>8ed0cb58</code>"]
  nbd272266["cross-receipt.json#24<br/><code>bd272266</code>"]
  n69218f3c["cross-receipt.json#25<br/><code>69218f3c</code>"]
  n4c2efc0d["cross-receipt.json#26<br/><code>4c2efc0d</code>"]
  n1c527f60["cross-receipt.json#27<br/><code>1c527f60</code>"]
  n26c8299d["cross-receipt.json#28<br/><code>26c8299d</code>"]
  nd438293b["cross-receipt.json#29<br/><code>d438293b</code>"]
  na18b746a["debts-receipt.json<br/><code>a18b746a</code>"]
  nab9a5e3b["discovery-receipt.json<br/><code>ab9a5e3b</code>"]
  n2b200363["discovery-receipt.json#0<br/><code>2b200363</code>"]
  n80d47b09["discovery-receipt.json#1<br/><code>80d47b09</code>"]
  n1e4a6690["discovery-receipt.json#2<br/><code>1e4a6690</code>"]
  n4ed1529d["discovery-receipt.json#3<br/><code>4ed1529d</code>"]
  n6641a14c["discovery-receipt.json#4<br/><code>6641a14c</code>"]
  n864bb092["discovery-receipt.json#5<br/><code>864bb092</code>"]
  n50a05ce9["discovery-receipt.json#6<br/><code>50a05ce9</code>"]
  nb125f93b["discovery-receipt.json#7<br/><code>b125f93b</code>"]
  n22cdb512["discovery-receipt.json#8<br/><code>22cdb512</code>"]
  neab20563["discovery-receipt.json#9<br/><code>eab20563</code>"]
  n65a0bab0["discovery-receipt.json#10<br/><code>65a0bab0</code>"]
  n3f91053e["discovery-receipt.json#11<br/><code>3f91053e</code>"]
  nb156dc69["discovery-receipt.json#12<br/><code>b156dc69</code>"]
  n13f9d259["discovery-receipt.json#13<br/><code>13f9d259</code>"]
  n59a9bdeb["discovery-receipt.json#14<br/><code>59a9bdeb</code>"]
  n5a8d969e["discovery-receipt.json#15<br/><code>5a8d969e</code>"]
  n8eac52db["discovery-receipt.json#16<br/><code>8eac52db</code>"]
  neec8c575["discovery-receipt.json#17<br/><code>eec8c575</code>"]
  n4d3d5748["discovery-receipt.json#18<br/><code>4d3d5748</code>"]
  n51108749["discovery-receipt.json#19<br/><code>51108749</code>"]
  nd3097e40["discovery-receipt.json#20<br/><code>d3097e40</code>"]
  n830161b3["discovery-receipt.json#21<br/><code>830161b3</code>"]
  n894a98cb["discovery-receipt.json#22<br/><code>894a98cb</code>"]
  n96942f37["discovery-receipt.json#23<br/><code>96942f37</code>"]
  n635c61c1["discovery-receipt.json#24<br/><code>635c61c1</code>"]
  n89331104["discovery-receipt.json#25<br/><code>89331104</code>"]
  n079017b2["discovery-receipt.json#26<br/><code>079017b2</code>"]
  n777ddd07["discovery-receipt.json#27<br/><code>777ddd07</code>"]
  nf230cadd["discovery-receipt.json#28<br/><code>f230cadd</code>"]
  n1f1239b4["discovery-receipt.json#29<br/><code>1f1239b4</code>"]
  nafd8a515["discovery-receipt.json#30<br/><code>afd8a515</code>"]
  n880607f3["discovery-receipt.json#31<br/><code>880607f3</code>"]
  n28dfbb2a["discovery-receipt.json#32<br/><code>28dfbb2a</code>"]
  n64a88d42["discovery-receipt.json#33<br/><code>64a88d42</code>"]
  n499cec91["discovery-receipt.json#34<br/><code>499cec91</code>"]
  n5fb56287["discovery-receipt.json#35<br/><code>5fb56287</code>"]
  n5e0ee080["discovery-receipt.json#36<br/><code>5e0ee080</code>"]
  nb38185a6["discovery-receipt.json#37<br/><code>b38185a6</code>"]
  nff08c831["discovery-receipt.json#38<br/><code>ff08c831</code>"]
  n478636fa["discovery-receipt.json#39<br/><code>478636fa</code>"]
  nfe72b29c["discovery-receipt.json#40<br/><code>fe72b29c</code>"]
  n292e5ad1["discovery-receipt.json#41<br/><code>292e5ad1</code>"]
  nd5134997["discovery-receipt.json#42<br/><code>d5134997</code>"]
  n3d45e04a["discovery-receipt.json#43<br/><code>3d45e04a</code>"]
  na9e278d7["discovery-receipt.json#44<br/><code>a9e278d7</code>"]
  ndf3061f8["discovery-receipt.json#45<br/><code>df3061f8</code>"]
  n8886ab7f["discovery-receipt.json#46<br/><code>8886ab7f</code>"]
  ncd87354c["discovery-receipt.json#47<br/><code>cd87354c</code>"]
  n74ab1c29["discovery-receipt.json#48<br/><code>74ab1c29</code>"]
  ne94c9fab["discovery-receipt.json#49<br/><code>e94c9fab</code>"]
  n7df54db8["discovery-receipt.json#50<br/><code>7df54db8</code>"]
  nba5534a2["discovery-receipt.json#51<br/><code>ba5534a2</code>"]
  n606abde1["discovery-receipt.json#52<br/><code>606abde1</code>"]
  n2ad8ad31["discovery-receipt.json#53<br/><code>2ad8ad31</code>"]
  n8488b3b3["discovery-receipt.json#54<br/><code>8488b3b3</code>"]
  n47d603bb["discovery-receipt.json#55<br/><code>47d603bb</code>"]
  n912b345e["discovery-receipt.json#56<br/><code>912b345e</code>"]
  n59788aa1["discovery-receipt.json#57<br/><code>59788aa1</code>"]
  nc9733bcb["discovery-receipt.json#58<br/><code>c9733bcb</code>"]
  nd7d05958["discovery-receipt.json#59<br/><code>d7d05958</code>"]
  n4f8b5b63["discovery-receipt.json#60<br/><code>4f8b5b63</code>"]
  n3190339f["discovery-receipt.json#61<br/><code>3190339f</code>"]
  ndbd42fdd["discovery-receipt.json#62<br/><code>dbd42fdd</code>"]
  n92b2a4a5["discovery-receipt.json#63<br/><code>92b2a4a5</code>"]
  n2df48648["discovery-receipt.json#64<br/><code>2df48648</code>"]
  n651ce11c["discovery-receipt.json#65<br/><code>651ce11c</code>"]
  n7046cfd1["discovery-receipt.json#66<br/><code>7046cfd1</code>"]
  n4002fbeb["discovery-receipt.json#67<br/><code>4002fbeb</code>"]
  nd16a8940["discovery-receipt.json#68<br/><code>d16a8940</code>"]
  n46cea1c7["discovery-receipt.json#69<br/><code>46cea1c7</code>"]
  n56612b47["discovery-receipt.json#70<br/><code>56612b47</code>"]
  n80880bd5["discovery-receipt.json#71<br/><code>80880bd5</code>"]
  n1b40541c["discovery-receipt.json#72<br/><code>1b40541c</code>"]
  n5a8e0c90["discovery-receipt.json#73<br/><code>5a8e0c90</code>"]
  nd7c079c7["discovery-receipt.json#74<br/><code>d7c079c7</code>"]
  n7c6fc5ce["discovery-receipt.json#75<br/><code>7c6fc5ce</code>"]
  n756695f8["discovery-receipt.json#76<br/><code>756695f8</code>"]
  nb514cc7f["discovery-receipt.json#77<br/><code>b514cc7f</code>"]
  n2d9c3f5d["discovery-receipt.json#78<br/><code>2d9c3f5d</code>"]
  n4e11f7c1["discovery-receipt.json#79<br/><code>4e11f7c1</code>"]
  n0054c862["discovery-receipt.json#80<br/><code>0054c862</code>"]
  n03340fff["discovery-receipt.json#81<br/><code>03340fff</code>"]
  n9ffe98e9["discovery-receipt.json#82<br/><code>9ffe98e9</code>"]
  n42e58179["discovery-receipt.json#83<br/><code>42e58179</code>"]
  n85de9815["discovery-receipt.json#84<br/><code>85de9815</code>"]
  n03b9b6bd["discovery-receipt.json#85<br/><code>03b9b6bd</code>"]
  n6608c993["discovery-receipt.json#86<br/><code>6608c993</code>"]
  n839cf3bf["discovery-receipt.json#87<br/><code>839cf3bf</code>"]
  n393cb8b3["discovery-receipt.json#88<br/><code>393cb8b3</code>"]
  n5f301816["discovery-receipt.json#89<br/><code>5f301816</code>"]
  na26ba745["discovery-receipt.json#90<br/><code>a26ba745</code>"]
  nb743200c["discovery-receipt.json#91<br/><code>b743200c</code>"]
  nb543a244["discovery-receipt.json#92<br/><code>b543a244</code>"]
  nb30ed214["discovery-receipt.json#93<br/><code>b30ed214</code>"]
  n4c0d5c02["discovery-receipt.json#94<br/><code>4c0d5c02</code>"]
  n26cf7be1["discovery-receipt.json#95<br/><code>26cf7be1</code>"]
  nad9cfdb2["discovery-receipt.json#96<br/><code>ad9cfdb2</code>"]
  n6d82626a["discovery-receipt.json#97<br/><code>6d82626a</code>"]
  n9ec164c9["discovery-receipt.json#98<br/><code>9ec164c9</code>"]
  n3e0194ef["discovery-receipt.json#99<br/><code>3e0194ef</code>"]
  n27e9ca92["discovery-receipt.json#100<br/><code>27e9ca92</code>"]
  n87539973["discovery-receipt.json#101<br/><code>87539973</code>"]
  n5ae60ede["discovery-receipt.json#102<br/><code>5ae60ede</code>"]
  na71c1c63["discovery-receipt.json#103<br/><code>a71c1c63</code>"]
  n1ca289dd["discovery-receipt.json#104<br/><code>1ca289dd</code>"]
  nc6c68023["discovery-receipt.json#105<br/><code>c6c68023</code>"]
  n80b6fdf6["discovery-receipt.json#106<br/><code>80b6fdf6</code>"]
  nb94d98ec["discovery-receipt.json#107<br/><code>b94d98ec</code>"]
  n01c4eaca["discovery-receipt.json#108<br/><code>01c4eaca</code>"]
  n1f437ae1["discovery-receipt.json#109<br/><code>1f437ae1</code>"]
  n76a71a5b["discovery-receipt.json#110<br/><code>76a71a5b</code>"]
  n29fc936b["discovery-receipt.json#111<br/><code>29fc936b</code>"]
  n5f98b6c6["discovery-receipt.json#112<br/><code>5f98b6c6</code>"]
  nb0be1262["discovery-receipt.json#113<br/><code>b0be1262</code>"]
  n789ac09f["discovery-receipt.json#114<br/><code>789ac09f</code>"]
  n5f0bb4e0["discovery-receipt.json#115<br/><code>5f0bb4e0</code>"]
  n1a36c36c["discovery-receipt.json#116<br/><code>1a36c36c</code>"]
  n7a5aa441["discovery-receipt.json#117<br/><code>7a5aa441</code>"]
  n6c371828["discovery-receipt.json#118<br/><code>6c371828</code>"]
  n74325bec["discovery-receipt.json#119<br/><code>74325bec</code>"]
  n7ccf2af9["discovery-receipt.json#120<br/><code>7ccf2af9</code>"]
  n1219f3c0["discovery-receipt.json#121<br/><code>1219f3c0</code>"]
  ncb9d7e8e["discovery-receipt.json#122<br/><code>cb9d7e8e</code>"]
  n75032bc7["discovery-receipt.json#123<br/><code>75032bc7</code>"]
  n6693a87d["discovery-receipt.json#124<br/><code>6693a87d</code>"]
  n36b95f38["discovery-receipt.json#125<br/><code>36b95f38</code>"]
  na3eb0764["discovery-receipt.json#126<br/><code>a3eb0764</code>"]
  n5aa63c6c["discovery-receipt.json#127<br/><code>5aa63c6c</code>"]
  nc5b82165["discovery-receipt.json#128<br/><code>c5b82165</code>"]
  ne712bd99["discovery-receipt.json#129<br/><code>e712bd99</code>"]
  n82e87b69["discovery-receipt.json#130<br/><code>82e87b69</code>"]
  n10c6ab61["discovery-receipt.json#131<br/><code>10c6ab61</code>"]
  n51cfae22["discovery-receipt.json#132<br/><code>51cfae22</code>"]
  n8d311f77["discovery-receipt.json#133<br/><code>8d311f77</code>"]
  n07e654e7["discovery-receipt.json#134<br/><code>07e654e7</code>"]
  n14ff18e9["discovery-receipt.json#135<br/><code>14ff18e9</code>"]
  nd945f34f["discovery-receipt.json#136<br/><code>d945f34f</code>"]
  n8d3df946["discovery-receipt.json#137<br/><code>8d3df946</code>"]
  nbbc9be56["discovery-receipt.json#138<br/><code>bbc9be56</code>"]
  n05d8ec82["discovery-receipt.json#139<br/><code>05d8ec82</code>"]
  nd3344a20["discovery-receipt.json#140<br/><code>d3344a20</code>"]
  n59ee899e["discovery-receipt.json#141<br/><code>59ee899e</code>"]
  n33103cf1["discovery-receipt.json#142<br/><code>33103cf1</code>"]
  n1ed6b382["discovery-receipt.json#143<br/><code>1ed6b382</code>"]
  n8928aa83["discovery-receipt.json#144<br/><code>8928aa83</code>"]
  nfbf2e3f7["discovery-receipt.json#145<br/><code>fbf2e3f7</code>"]
  ncc8a7d6e["discovery-receipt.json#146<br/><code>cc8a7d6e</code>"]
  nddf7dc03["discovery-receipt.json#147<br/><code>ddf7dc03</code>"]
  nf157f46b["discovery-receipt.json#148<br/><code>f157f46b</code>"]
  n24fe0656["discovery-receipt.json#149<br/><code>24fe0656</code>"]
  nce34580c["discovery-receipt.json#150<br/><code>ce34580c</code>"]
  n92e6a0b0["discovery-receipt.json#151<br/><code>92e6a0b0</code>"]
  ne41eb5f2["discovery-receipt.json#152<br/><code>e41eb5f2</code>"]
  n3848dd26["discovery-receipt.json#153<br/><code>3848dd26</code>"]
  na00f2bc1["discovery-receipt.json#154<br/><code>a00f2bc1</code>"]
  n6c867399["discovery-receipt.json#155<br/><code>6c867399</code>"]
  n1b378f0c["discovery-receipt.json#156<br/><code>1b378f0c</code>"]
  nc391e075["discovery-receipt.json#157<br/><code>c391e075</code>"]
  n5b4b6564["discovery-receipt.json#158<br/><code>5b4b6564</code>"]
  n0e06c9e4["discovery-receipt.json#159<br/><code>0e06c9e4</code>"]
  ndeeaea23["discovery-receipt.json#160<br/><code>deeaea23</code>"]
  nba41e3ac["discovery-receipt.json#161<br/><code>ba41e3ac</code>"]
  n6249daa4["discovery-receipt.json#162<br/><code>6249daa4</code>"]
  n21ef046d["discovery-receipt.json#163<br/><code>21ef046d</code>"]
  ne5141809["discovery-receipt.json#164<br/><code>e5141809</code>"]
  nbbea098e["discovery-receipt.json#165<br/><code>bbea098e</code>"]
  n6f95957b["discovery-receipt.json#166<br/><code>6f95957b</code>"]
  n522989e1["discovery-receipt.json#167<br/><code>522989e1</code>"]
  n84f5a155["discovery-receipt.json#168<br/><code>84f5a155</code>"]
  n2babb571["discovery-receipt.json#169<br/><code>2babb571</code>"]
  n766322b0["discovery-receipt.json#170<br/><code>766322b0</code>"]
  ndca56923["discovery-receipt.json#171<br/><code>dca56923</code>"]
  n31fc70b9["discovery-receipt.json#172<br/><code>31fc70b9</code>"]
  n63f8bc1b["discovery-receipt.json#173<br/><code>63f8bc1b</code>"]
  n7c0bcea3["discovery-receipt.json#174<br/><code>7c0bcea3</code>"]
  n4c250770["discovery-receipt.json#175<br/><code>4c250770</code>"]
  ne9dabf4b["discovery-receipt.json#176<br/><code>e9dabf4b</code>"]
  n0b487108["discovery-receipt.json#177<br/><code>0b487108</code>"]
  n3fc29edc["discovery-receipt.json#178<br/><code>3fc29edc</code>"]
  nc8af5c5d["discovery-receipt.json#179<br/><code>c8af5c5d</code>"]
  na7875506["discovery-receipt.json#180<br/><code>a7875506</code>"]
  n594ecd79["discovery-receipt.json#181<br/><code>594ecd79</code>"]
  n64d30943["discovery-receipt.json#182<br/><code>64d30943</code>"]
  n80341f0f["discovery-receipt.json#183<br/><code>80341f0f</code>"]
  n4b7394fb["discovery-receipt.json#184<br/><code>4b7394fb</code>"]
  ne81c8b5a["discovery-receipt.json#185<br/><code>e81c8b5a</code>"]
  n18bd89cf["discovery-receipt.json#186<br/><code>18bd89cf</code>"]
  n4cb7abeb["discovery-receipt.json#187<br/><code>4cb7abeb</code>"]
  n8c6ee526["discovery-receipt.json#188<br/><code>8c6ee526</code>"]
  na8dc1c3b["discovery-receipt.json#189<br/><code>a8dc1c3b</code>"]
  nadd1a6bf["discovery-receipt.json#190<br/><code>add1a6bf</code>"]
  n3e80288e["discovery-receipt.json#191<br/><code>3e80288e</code>"]
  n01940383["discovery-receipt.json#192<br/><code>01940383</code>"]
  n67374c9b["discovery-receipt.json#193<br/><code>67374c9b</code>"]
  nf4ebbba6["discovery-receipt.json#194<br/><code>f4ebbba6</code>"]
  nbacc6318["discovery-receipt.json#195<br/><code>bacc6318</code>"]
  n0a0e7360["discovery-receipt.json#196<br/><code>0a0e7360</code>"]
  n4847d5e9["discovery-receipt.json#197<br/><code>4847d5e9</code>"]
  n0bf193bc["discovery-receipt.json#198<br/><code>0bf193bc</code>"]
  n585a4945["discovery-receipt.json#199<br/><code>585a4945</code>"]
  n9a448049["discovery-receipt.json#200<br/><code>9a448049</code>"]
  n7e08e90e["discovery-receipt.json#201<br/><code>7e08e90e</code>"]
  nef81fb2f["discovery-receipt.json#202<br/><code>ef81fb2f</code>"]
  n310b7338["discovery-receipt.json#203<br/><code>310b7338</code>"]
  nee1b4757["discovery-receipt.json#204<br/><code>ee1b4757</code>"]
  na86c961f["discovery-receipt.json#205<br/><code>a86c961f</code>"]
  nbe0dcde2["discovery-receipt.json#206<br/><code>be0dcde2</code>"]
  nc7acb61e["discovery-receipt.json#207<br/><code>c7acb61e</code>"]
  nebaa924c["discovery-receipt.json#208<br/><code>ebaa924c</code>"]
  n1b6693b9["discovery-receipt.json#209<br/><code>1b6693b9</code>"]
  nebdda918["discovery-receipt.json#210<br/><code>ebdda918</code>"]
  n475947e4["discovery-receipt.json#211<br/><code>475947e4</code>"]
  n327e0a0f["discovery-receipt.json#212<br/><code>327e0a0f</code>"]
  n339295ca["discovery-receipt.json#213<br/><code>339295ca</code>"]
  n8c073057["discovery-receipt.json#214<br/><code>8c073057</code>"]
  nd0117b12["discovery-receipt.json#215<br/><code>d0117b12</code>"]
  n70b50423["discovery-receipt.json#216<br/><code>70b50423</code>"]
  n84ee0e1c["discovery-receipt.json#217<br/><code>84ee0e1c</code>"]
  nac1b668d["discovery-receipt.json#218<br/><code>ac1b668d</code>"]
  ne4708bd3["discovery-receipt.json#219<br/><code>e4708bd3</code>"]
  nd31d4da5["discovery-receipt.json#220<br/><code>d31d4da5</code>"]
  n94ed4c8e["discovery-receipt.json#221<br/><code>94ed4c8e</code>"]
  na1b19c65["discovery-receipt.json#222<br/><code>a1b19c65</code>"]
  n06839614["discovery-receipt.json#223<br/><code>06839614</code>"]
  nf609f3f6["discovery-receipt.json#224<br/><code>f609f3f6</code>"]
  n1161c634["discovery-receipt.json#225<br/><code>1161c634</code>"]
  n0428665a["discovery-receipt.json#226<br/><code>0428665a</code>"]
  nb389b2d1["discovery-receipt.json#227<br/><code>b389b2d1</code>"]
  n47badb54["discovery-receipt.json#228<br/><code>47badb54</code>"]
  n98d423a8["flaws-receipt.json<br/><code>98d423a8</code>"]
  n5f2adf60["formulas-receipt.json<br/><code>5f2adf60</code>"]
  n2f3e8087["formulas-receipt.json#0<br/><code>2f3e8087</code>"]
  n12ae5830["formulas-receipt.json#1<br/><code>12ae5830</code>"]
  n0f4849c1["formulas-receipt.json#2<br/><code>0f4849c1</code>"]
  n0f433af0["formulas-receipt.json#3<br/><code>0f433af0</code>"]
  n43509cc4["formulas-receipt.json#4<br/><code>43509cc4</code>"]
  n531a511b["formulas-receipt.json#5<br/><code>531a511b</code>"]
  n832fb220["formulas-receipt.json#6<br/><code>832fb220</code>"]
  n176181c6["formulas-receipt.json#7<br/><code>176181c6</code>"]
  n2e07f218["formulas-receipt.json#8<br/><code>2e07f218</code>"]
  n68441e36["formulas-receipt.json#9<br/><code>68441e36</code>"]
  n30a02274["formulas-receipt.json#10<br/><code>30a02274</code>"]
  n50bdf797["formulas-receipt.json#11<br/><code>50bdf797</code>"]
  ne809da3b["formulas-receipt.json#12<br/><code>e809da3b</code>"]
  n167a54be["formulas-receipt.json#13<br/><code>167a54be</code>"]
  n56e1c677["formulas-receipt.json#14<br/><code>56e1c677</code>"]
  n0314175f["formulas-receipt.json#15<br/><code>0314175f</code>"]
  nc48ffd1b["formulas-receipt.json#16<br/><code>c48ffd1b</code>"]
  ne9fbcacf["formulas-receipt.json#17<br/><code>e9fbcacf</code>"]
  n6a91fc51["formulas-receipt.json#18<br/><code>6a91fc51</code>"]
  nfbae82c7["formulas-receipt.json#19<br/><code>fbae82c7</code>"]
  nbfc3bd74["formulas-receipt.json#20<br/><code>bfc3bd74</code>"]
  n4e7e00c8["formulas-receipt.json#21<br/><code>4e7e00c8</code>"]
  ncffcd9b5["formulas-receipt.json#22<br/><code>cffcd9b5</code>"]
  n2d38dcd0["formulas-receipt.json#23<br/><code>2d38dcd0</code>"]
  n149ce9d7["formulas-receipt.json#24<br/><code>149ce9d7</code>"]
  n22727bf1["formulas-receipt.json#25<br/><code>22727bf1</code>"]
  n5d9c4848["formulas-receipt.json#26<br/><code>5d9c4848</code>"]
  n2a4dd0a5["formulas-receipt.json#27<br/><code>2a4dd0a5</code>"]
  n2d136859["formulas-receipt.json#28<br/><code>2d136859</code>"]
  n7b1ef0c5["formulas-receipt.json#29<br/><code>7b1ef0c5</code>"]
  n90f5c917["formulas-receipt.json#30<br/><code>90f5c917</code>"]
  naa6904fc["formulas-receipt.json#31<br/><code>aa6904fc</code>"]
  n7fe32d87["formulas-receipt.json#32<br/><code>7fe32d87</code>"]
  n6489df59["formulas-receipt.json#33<br/><code>6489df59</code>"]
  n69377344["formulas-receipt.json#34<br/><code>69377344</code>"]
  n4bec54d9["formulas-receipt.json#35<br/><code>4bec54d9</code>"]
  nd4ec5613["formulas-receipt.json#36<br/><code>d4ec5613</code>"]
  n2382d698["formulas-receipt.json#37<br/><code>2382d698</code>"]
  n8f3e4b2e["formulas-receipt.json#38<br/><code>8f3e4b2e</code>"]
  n3d340567["formulas-receipt.json#39<br/><code>3d340567</code>"]
  ncda8a66d["formulas-receipt.json#40<br/><code>cda8a66d</code>"]
  n988521e1["formulas-receipt.json#41<br/><code>988521e1</code>"]
  nea165f53["formulas-receipt.json#42<br/><code>ea165f53</code>"]
  n25ed1bce["formulas-receipt.json#43<br/><code>25ed1bce</code>"]
  na8254e01["formulas-receipt.json#44<br/><code>a8254e01</code>"]
  n6c974c01["formulas-receipt.json#45<br/><code>6c974c01</code>"]
  n6cde3e66["formulas-receipt.json#46<br/><code>6cde3e66</code>"]
  na5ea7ffc["formulas-receipt.json#47<br/><code>a5ea7ffc</code>"]
  n04d485a1["formulas-receipt.json#48<br/><code>04d485a1</code>"]
  nae151cf4["formulas-receipt.json#49<br/><code>ae151cf4</code>"]
  n3423da0c["formulas-receipt.json#50<br/><code>3423da0c</code>"]
  n38cb7298["formulas-receipt.json#51<br/><code>38cb7298</code>"]
  n8bfd171b["formulas-receipt.json#52<br/><code>8bfd171b</code>"]
  n312a2c43["formulas-receipt.json#53<br/><code>312a2c43</code>"]
  n75ca9b48["formulas-receipt.json#54<br/><code>75ca9b48</code>"]
  nb0097989["formulas-receipt.json#55<br/><code>b0097989</code>"]
  n8d66eac8["formulas-receipt.json#56<br/><code>8d66eac8</code>"]
  n4684237e["formulas-receipt.json#57<br/><code>4684237e</code>"]
  n4c00f675["formulas-receipt.json#58<br/><code>4c00f675</code>"]
  n5070fd9a["formulas-receipt.json#59<br/><code>5070fd9a</code>"]
  n11399815["formulas-receipt.json#60<br/><code>11399815</code>"]
  n9adf0a45["formulas-receipt.json#61<br/><code>9adf0a45</code>"]
  n02c98291["formulas-receipt.json#62<br/><code>02c98291</code>"]
  n0025b625["formulas-receipt.json#63<br/><code>0025b625</code>"]
  n9e851d1a["formulas-receipt.json#64<br/><code>9e851d1a</code>"]
  n063859ac["formulas-receipt.json#65<br/><code>063859ac</code>"]
  n46c32104["formulas-receipt.json#66<br/><code>46c32104</code>"]
  nee879185["formulas-receipt.json#67<br/><code>ee879185</code>"]
  n20f18199["formulas-receipt.json#68<br/><code>20f18199</code>"]
  n01641cc0["formulas-receipt.json#69<br/><code>01641cc0</code>"]
  n0cdea27f["formulas-receipt.json#70<br/><code>0cdea27f</code>"]
  nf318433e["formulas-receipt.json#71<br/><code>f318433e</code>"]
  n3dc82513["formulas-receipt.json#72<br/><code>3dc82513</code>"]
  n918c4f1b["formulas-receipt.json#73<br/><code>918c4f1b</code>"]
  n4480f370["formulas-receipt.json#74<br/><code>4480f370</code>"]
  naf30ddd9["formulas-receipt.json#75<br/><code>af30ddd9</code>"]
  n6dbd3968["formulas-receipt.json#76<br/><code>6dbd3968</code>"]
  nc07edf99["formulas-receipt.json#77<br/><code>c07edf99</code>"]
  nb0bd9b00["formulas-receipt.json#78<br/><code>b0bd9b00</code>"]
  n73b66dcd["fuse-receipt.json<br/><code>73b66dcd</code>"]
  ne26e8f1f["heat-receipt.json<br/><code>e26e8f1f</code>"]
  nb430890a["heat-receipt.json#0<br/><code>b430890a</code>"]
  n65f82c5e["heat-receipt.json#1<br/><code>65f82c5e</code>"]
  nc8adf1f6["heat-receipt.json#2<br/><code>c8adf1f6</code>"]
  n81295b04["heat-receipt.json#3<br/><code>81295b04</code>"]
  n37c807c9["heat-receipt.json#4<br/><code>37c807c9</code>"]
  n0e88eba5["heat-receipt.json#5<br/><code>0e88eba5</code>"]
  nab2478c5["heat-receipt.json#6<br/><code>ab2478c5</code>"]
  n3d50671a["heat-receipt.json#7<br/><code>3d50671a</code>"]
  nae23952c["heat-receipt.json#8<br/><code>ae23952c</code>"]
  n8860989e["heat-receipt.json#9<br/><code>8860989e</code>"]
  nb0ac7229["heat-receipt.json#10<br/><code>b0ac7229</code>"]
  nca69d66d["heat-receipt.json#11<br/><code>ca69d66d</code>"]
  n0d252d60["heat-receipt.json#12<br/><code>0d252d60</code>"]
  n3dfab2c6["heat-receipt.json#13<br/><code>3dfab2c6</code>"]
  n75d7e2be["heat-receipt.json#14<br/><code>75d7e2be</code>"]
  n038bdda1["heat-receipt.json#15<br/><code>038bdda1</code>"]
  n5647b3df["heat-receipt.json#16<br/><code>5647b3df</code>"]
  nae4d775a["heat-receipt.json#17<br/><code>ae4d775a</code>"]
  n6a558934["heat-receipt.json#18<br/><code>6a558934</code>"]
  nb8b068bf["heat-receipt.json#19<br/><code>b8b068bf</code>"]
  n7373b861["heat-receipt.json#20<br/><code>7373b861</code>"]
  n7f3e1737["heat-receipt.json#21<br/><code>7f3e1737</code>"]
  n41439444["heat-receipt.json#22<br/><code>41439444</code>"]
  n3aae1b58["heat-receipt.json#23<br/><code>3aae1b58</code>"]
  nd7f02ebe["heat-receipt.json#24<br/><code>d7f02ebe</code>"]
  nfa201637["heat-receipt.json#25<br/><code>fa201637</code>"]
  ne291165f["heat-receipt.json#26<br/><code>e291165f</code>"]
  nd85cc981["heat-receipt.json#27<br/><code>d85cc981</code>"]
  n891c391b["heat-receipt.json#28<br/><code>891c391b</code>"]
  n0d9d42b4["heat-receipt.json#29<br/><code>0d9d42b4</code>"]
  nd96fb160["heat-receipt.json#30<br/><code>d96fb160</code>"]
  n24de8590["heat-receipt.json#31<br/><code>24de8590</code>"]
  n1b4463f5["heat-receipt.json#32<br/><code>1b4463f5</code>"]
  n49e015c2["heat-receipt.json#33<br/><code>49e015c2</code>"]
  na7c9caa5["heat-receipt.json#34<br/><code>a7c9caa5</code>"]
  n86d744fd["heat-receipt.json#35<br/><code>86d744fd</code>"]
  nf698100f["heat-receipt.json#36<br/><code>f698100f</code>"]
  n3e24f51f["heat-receipt.json#37<br/><code>3e24f51f</code>"]
  n0d9370a1["heat-receipt.json#38<br/><code>0d9370a1</code>"]
  n4c311b93["heat-receipt.json#39<br/><code>4c311b93</code>"]
  n06c53b46["lattice-receipt.json<br/><code>06c53b46</code>"]
  ndf2a5e48["lean-receipt.json<br/><code>df2a5e48</code>"]
  nd6d461a7["lean-receipt.json#0<br/><code>d6d461a7</code>"]
  nf317cd0f["lean-receipt.json#1<br/><code>f317cd0f</code>"]
  nc06ab1d9["lean-receipt.json#2<br/><code>c06ab1d9</code>"]
  n53384654["lean-receipt.json#3<br/><code>53384654</code>"]
  ndfce4fbb["lean-receipt.json#4<br/><code>dfce4fbb</code>"]
  ne21deda3["lean-receipt.json#5<br/><code>e21deda3</code>"]
  n1c28aecd["lean-receipt.json#6<br/><code>1c28aecd</code>"]
  nc9287749["lean-receipt.json#7<br/><code>c9287749</code>"]
  n01da53e4["lean-receipt.json#8<br/><code>01da53e4</code>"]
  nca5e7a51["lean-receipt.json#9<br/><code>ca5e7a51</code>"]
  n3f69ef7f["lean-receipt.json#10<br/><code>3f69ef7f</code>"]
  n54f94869["lean-receipt.json#11<br/><code>54f94869</code>"]
  n5dad05dc["lean-receipt.json#12<br/><code>5dad05dc</code>"]
  n4964930d["lean-receipt.json#13<br/><code>4964930d</code>"]
  nd7b0d49c["lean-receipt.json#14<br/><code>d7b0d49c</code>"]
  nf3c510d6["lean-receipt.json#15<br/><code>f3c510d6</code>"]
  n2ee233b9["lean-receipt.json#16<br/><code>2ee233b9</code>"]
  n186d1eca["lean-receipt.json#17<br/><code>186d1eca</code>"]
  nf01be46d["lean-receipt.json#18<br/><code>f01be46d</code>"]
  n9ea93275["lean-receipt.json#19<br/><code>9ea93275</code>"]
  n76180c65["lean-receipt.json#20<br/><code>76180c65</code>"]
  n485003d2["lean-receipt.json#21<br/><code>485003d2</code>"]
  nba81aa39["lean-receipt.json#22<br/><code>ba81aa39</code>"]
  n25e65ae5["lean-receipt.json#23<br/><code>25e65ae5</code>"]
  n4b3e34f7["lean-receipt.json#24<br/><code>4b3e34f7</code>"]
  n0563b3a6["lean-receipt.json#25<br/><code>0563b3a6</code>"]
  nc3d7cc34["lean-receipt.json#26<br/><code>c3d7cc34</code>"]
  n89d5cc60["lean-receipt.json#27<br/><code>89d5cc60</code>"]
  na2da598d["lean-receipt.json#28<br/><code>a2da598d</code>"]
  n0982d2f5["lean-receipt.json#29<br/><code>0982d2f5</code>"]
  nb7db3475["lean-receipt.json#30<br/><code>b7db3475</code>"]
  nc1a5ae70["lean-receipt.json#31<br/><code>c1a5ae70</code>"]
  ne17ddde9["lean-receipt.json#32<br/><code>e17ddde9</code>"]
  n8b06e40a["lean-receipt.json#33<br/><code>8b06e40a</code>"]
  n0ce66b34["lean-receipt.json#34<br/><code>0ce66b34</code>"]
  n4bb21feb["lean-receipt.json#35<br/><code>4bb21feb</code>"]
  ne9dc99f2["lean-receipt.json#36<br/><code>e9dc99f2</code>"]
  n3ffa0121["lean-receipt.json#37<br/><code>3ffa0121</code>"]
  nc520368a["lean-receipt.json#38<br/><code>c520368a</code>"]
  n79597c9a["lean-receipt.json#39<br/><code>79597c9a</code>"]
  nc85873ff["lean-receipt.json#40<br/><code>c85873ff</code>"]
  n3431cf4e["lean-receipt.json#41<br/><code>3431cf4e</code>"]
  nd855ee66["lean-receipt.json#42<br/><code>d855ee66</code>"]
  n92d1f8d6["lean-receipt.json#43<br/><code>92d1f8d6</code>"]
  n591253d4["lean-receipt.json#44<br/><code>591253d4</code>"]
  nbecc4fd1["lean-receipt.json#45<br/><code>becc4fd1</code>"]
  nbf1f93a6["lean-receipt.json#46<br/><code>bf1f93a6</code>"]
  n6ec1f5ad["lean-receipt.json#47<br/><code>6ec1f5ad</code>"]
  nb4cd21a0["lean-receipt.json#48<br/><code>b4cd21a0</code>"]
  ncc86d262["lean-receipt.json#49<br/><code>cc86d262</code>"]
  nf06e1426["lean-receipt.json#50<br/><code>f06e1426</code>"]
  n39f1ad55["lean-receipt.json#51<br/><code>39f1ad55</code>"]
  n4142e839["lean-receipt.json#52<br/><code>4142e839</code>"]
  nfd15d424["lean-receipt.json#53<br/><code>fd15d424</code>"]
  n58130ece["lean-receipt.json#54<br/><code>58130ece</code>"]
  nd6613d3e["lean-receipt.json#55<br/><code>d6613d3e</code>"]
  n8c62d970["lean-receipt.json#56<br/><code>8c62d970</code>"]
  n11fe8b6f["lean-receipt.json#57<br/><code>11fe8b6f</code>"]
  n4b0b781b["lean-receipt.json#58<br/><code>4b0b781b</code>"]
  n49a2766b["lean-receipt.json#59<br/><code>49a2766b</code>"]
  nbaaf8e27["lean-receipt.json#60<br/><code>baaf8e27</code>"]
  nca6a283a["lean-receipt.json#61<br/><code>ca6a283a</code>"]
  nb93130c6["lean-receipt.json#62<br/><code>b93130c6</code>"]
  n7a4a3c58["lean-receipt.json#63<br/><code>7a4a3c58</code>"]
  n86a00011["lean-receipt.json#64<br/><code>86a00011</code>"]
  nc67de806["lean-receipt.json#65<br/><code>c67de806</code>"]
  n586efa28["lean-receipt.json#66<br/><code>586efa28</code>"]
  n8b8be02f["lean-receipt.json#67<br/><code>8b8be02f</code>"]
  n998f6e9e["lean-receipt.json#68<br/><code>998f6e9e</code>"]
  n5e9cbd57["lean-receipt.json#69<br/><code>5e9cbd57</code>"]
  n02f95f60["lean-receipt.json#70<br/><code>02f95f60</code>"]
  n5dc4917b["lean-receipt.json#71<br/><code>5dc4917b</code>"]
  n3313c274["lean-receipt.json#72<br/><code>3313c274</code>"]
  ne5ce307c["lean-receipt.json#73<br/><code>e5ce307c</code>"]
  n2c29e531["lean-receipt.json#74<br/><code>2c29e531</code>"]
  n5e18919f["lean-receipt.json#75<br/><code>5e18919f</code>"]
  n00f2699f["lean-receipt.json#76<br/><code>00f2699f</code>"]
  n9eaec6c8["lean-receipt.json#77<br/><code>9eaec6c8</code>"]
  n8c831950["lean-receipt.json#78<br/><code>8c831950</code>"]
  nd7c8f3cc["lean-receipt.json#79<br/><code>d7c8f3cc</code>"]
  ned519e42["lean-receipt.json#80<br/><code>ed519e42</code>"]
  n6bb03a88["lean-receipt.json#81<br/><code>6bb03a88</code>"]
  n5b86cc94["lean-receipt.json#82<br/><code>5b86cc94</code>"]
  nb49da70f["lean-receipt.json#83<br/><code>b49da70f</code>"]
  na778b7fa["lean-receipt.json#84<br/><code>a778b7fa</code>"]
  n5e7dacbc["lean-receipt.json#85<br/><code>5e7dacbc</code>"]
  n37cd5862["lean-receipt.json#86<br/><code>37cd5862</code>"]
  n60ef0493["lean-receipt.json#87<br/><code>60ef0493</code>"]
  nf17f37a9["lean-receipt.json#88<br/><code>f17f37a9</code>"]
  n4a8b4ab3["lean-receipt.json#89<br/><code>4a8b4ab3</code>"]
  n4effb9a2["lean-receipt.json#90<br/><code>4effb9a2</code>"]
  n100f323a["lean-receipt.json#91<br/><code>100f323a</code>"]
  nf77ec3ce["lean-receipt.json#92<br/><code>f77ec3ce</code>"]
  n45c1df58["lean-receipt.json#93<br/><code>45c1df58</code>"]
  na8d6155e["lean-receipt.json#94<br/><code>a8d6155e</code>"]
  nbb90c974["lean-receipt.json#95<br/><code>bb90c974</code>"]
  n0d384b3e["lean-receipt.json#96<br/><code>0d384b3e</code>"]
  n45b553d6["lean-receipt.json#97<br/><code>45b553d6</code>"]
  n8ad35aa0["lean-receipt.json#98<br/><code>8ad35aa0</code>"]
  n38e96be8["lean-receipt.json#99<br/><code>38e96be8</code>"]
  nff292077["lean-receipt.json#100<br/><code>ff292077</code>"]
  ncd6ae03a["lean-receipt.json#101<br/><code>cd6ae03a</code>"]
  ndbd4b516["lean-receipt.json#102<br/><code>dbd4b516</code>"]
  n057848eb["lean-receipt.json#103<br/><code>057848eb</code>"]
  n045881b0["lean-receipt.json#104<br/><code>045881b0</code>"]
  n1159235a["lean-receipt.json#105<br/><code>1159235a</code>"]
  nb509f363["lean-receipt.json#106<br/><code>b509f363</code>"]
  na2bc38f3["lean-receipt.json#107<br/><code>a2bc38f3</code>"]
  n45b58278["lean-receipt.json#108<br/><code>45b58278</code>"]
  n1446a5ec["lean-receipt.json#109<br/><code>1446a5ec</code>"]
  n894e455f["lean-receipt.json#110<br/><code>894e455f</code>"]
  n53ca76e3["lean-receipt.json#111<br/><code>53ca76e3</code>"]
  n8035ac46["lean-receipt.json#112<br/><code>8035ac46</code>"]
  nef2413ac["lean-receipt.json#113<br/><code>ef2413ac</code>"]
  n04e5fdbb["lean-receipt.json#114<br/><code>04e5fdbb</code>"]
  n7377391d["lean-receipt.json#115<br/><code>7377391d</code>"]
  n33ad518f["lean-receipt.json#116<br/><code>33ad518f</code>"]
  n6034cc20["lean-receipt.json#117<br/><code>6034cc20</code>"]
  n0ba5819b["lean-receipt.json#118<br/><code>0ba5819b</code>"]
  n855010a4["lean-receipt.json#119<br/><code>855010a4</code>"]
  n1b48bf3b["lean-receipt.json#120<br/><code>1b48bf3b</code>"]
  nce8320b7["lean-receipt.json#121<br/><code>ce8320b7</code>"]
  n25432579["lean-receipt.json#122<br/><code>25432579</code>"]
  n2a96490e["lean-receipt.json#123<br/><code>2a96490e</code>"]
  n713b8b68["payload-cf-receipt.json<br/><code>713b8b68</code>"]
  ndc13645e["percall-receipt.json<br/><code>dc13645e</code>"]
  n5d3a7b29["refusals-receipt.json<br/><code>5d3a7b29</code>"]
  nf88c08bb["test-receipt.json<br/><code>f88c08bb</code>"]
  n21bbe036["test-receipt.json#0<br/><code>21bbe036</code>"]
  nd4006356["test-receipt.json#1<br/><code>d4006356</code>"]
  nc65cb64a["test-receipt.json#2<br/><code>c65cb64a</code>"]
  nf164744f["test-receipt.json#3<br/><code>f164744f</code>"]
  nc77dd5dc["test-receipt.json#4<br/><code>c77dd5dc</code>"]
  nf92dd0f4["test-receipt.json#5<br/><code>f92dd0f4</code>"]
  n96f0f7ae["test-receipt.json#6<br/><code>96f0f7ae</code>"]
  n5ab15940["test-receipt.json#7<br/><code>5ab15940</code>"]
  n0399ab5e["test-receipt.json#8<br/><code>0399ab5e</code>"]
  n2a7c073a["test-receipt.json#9<br/><code>2a7c073a</code>"]
  n03d9edbf["test-receipt.json#10<br/><code>03d9edbf</code>"]
  n6b52214f["walls-receipt.json<br/><code>6b52214f</code>"]
  n149af883["readme<br/><code>149af883</code>"]
  nae56ab68 --> n35c1451d
  n35c1451d --> nef9664e7
  n35c1451d --> n837cb252
  n35c1451d --> n7ec2441c
  n35c1451d --> n4d4787dc
  n35c1451d --> nba991110
  n35c1451d --> naad33ea3
  n35c1451d --> n74aaa6eb
  n35c1451d --> n50e2140d
  n35c1451d --> n179c7d06
  n35c1451d --> n9ad607be
  n35c1451d --> n1742dd90
  n35c1451d --> n089f1c96
  n35c1451d --> nbc665889
  n35c1451d --> ne4cd5a63
  n35c1451d --> n0452a696
  n35c1451d --> n5a66ce7b
  n35c1451d --> n0d54e17a
  n35c1451d --> nbe346193
  n35c1451d --> nb9e20632
  n35c1451d --> n8b4b180c
  n35c1451d --> nf094aa84
  n35c1451d --> ndce5a8e8
  n35c1451d --> nae17f862
  n35c1451d --> n8ed0cb58
  n35c1451d --> nbd272266
  n35c1451d --> n69218f3c
  n35c1451d --> n4c2efc0d
  n35c1451d --> n1c527f60
  n35c1451d --> n26c8299d
  n35c1451d --> nd438293b
  nae56ab68 --> na18b746a
  nae56ab68 --> nab9a5e3b
  nab9a5e3b --> n2b200363
  nab9a5e3b --> n80d47b09
  nab9a5e3b --> n1e4a6690
  nab9a5e3b --> n4ed1529d
  nab9a5e3b --> n6641a14c
  nab9a5e3b --> n864bb092
  nab9a5e3b --> n50a05ce9
  nab9a5e3b --> nb125f93b
  nab9a5e3b --> n22cdb512
  nab9a5e3b --> neab20563
  nab9a5e3b --> n65a0bab0
  nab9a5e3b --> n3f91053e
  nab9a5e3b --> nb156dc69
  nab9a5e3b --> n13f9d259
  nab9a5e3b --> n59a9bdeb
  nab9a5e3b --> n5a8d969e
  nab9a5e3b --> n8eac52db
  nab9a5e3b --> neec8c575
  nab9a5e3b --> n4d3d5748
  nab9a5e3b --> n51108749
  nab9a5e3b --> nd3097e40
  nab9a5e3b --> n830161b3
  nab9a5e3b --> n894a98cb
  nab9a5e3b --> n96942f37
  nab9a5e3b --> n635c61c1
  nab9a5e3b --> n89331104
  nab9a5e3b --> n079017b2
  nab9a5e3b --> n777ddd07
  nab9a5e3b --> nf230cadd
  nab9a5e3b --> n1f1239b4
  nab9a5e3b --> nafd8a515
  nab9a5e3b --> n880607f3
  nab9a5e3b --> n28dfbb2a
  nab9a5e3b --> n64a88d42
  nab9a5e3b --> n499cec91
  nab9a5e3b --> n5fb56287
  nab9a5e3b --> n5e0ee080
  nab9a5e3b --> nb38185a6
  nab9a5e3b --> nff08c831
  nab9a5e3b --> n478636fa
  nab9a5e3b --> nfe72b29c
  nab9a5e3b --> n292e5ad1
  nab9a5e3b --> nd5134997
  nab9a5e3b --> n3d45e04a
  nab9a5e3b --> na9e278d7
  nab9a5e3b --> ndf3061f8
  nab9a5e3b --> n8886ab7f
  nab9a5e3b --> ncd87354c
  nab9a5e3b --> n74ab1c29
  nab9a5e3b --> ne94c9fab
  nab9a5e3b --> n7df54db8
  nab9a5e3b --> nba5534a2
  nab9a5e3b --> n606abde1
  nab9a5e3b --> n2ad8ad31
  nab9a5e3b --> n8488b3b3
  nab9a5e3b --> n47d603bb
  nab9a5e3b --> n912b345e
  nab9a5e3b --> n59788aa1
  nab9a5e3b --> nc9733bcb
  nab9a5e3b --> nd7d05958
  nab9a5e3b --> n4f8b5b63
  nab9a5e3b --> n3190339f
  nab9a5e3b --> ndbd42fdd
  nab9a5e3b --> n92b2a4a5
  nab9a5e3b --> n2df48648
  nab9a5e3b --> n651ce11c
  nab9a5e3b --> n7046cfd1
  nab9a5e3b --> n4002fbeb
  nab9a5e3b --> nd16a8940
  nab9a5e3b --> n46cea1c7
  nab9a5e3b --> n56612b47
  nab9a5e3b --> n80880bd5
  nab9a5e3b --> n1b40541c
  nab9a5e3b --> n5a8e0c90
  nab9a5e3b --> nd7c079c7
  nab9a5e3b --> n7c6fc5ce
  nab9a5e3b --> n756695f8
  nab9a5e3b --> nb514cc7f
  nab9a5e3b --> n2d9c3f5d
  nab9a5e3b --> n4e11f7c1
  nab9a5e3b --> n0054c862
  nab9a5e3b --> n03340fff
  nab9a5e3b --> n9ffe98e9
  nab9a5e3b --> n42e58179
  nab9a5e3b --> n85de9815
  nab9a5e3b --> n03b9b6bd
  nab9a5e3b --> n6608c993
  nab9a5e3b --> n839cf3bf
  nab9a5e3b --> n393cb8b3
  nab9a5e3b --> n5f301816
  nab9a5e3b --> na26ba745
  nab9a5e3b --> nb743200c
  nab9a5e3b --> nb543a244
  nab9a5e3b --> nb30ed214
  nab9a5e3b --> n4c0d5c02
  nab9a5e3b --> n26cf7be1
  nab9a5e3b --> nad9cfdb2
  nab9a5e3b --> n6d82626a
  nab9a5e3b --> n9ec164c9
  nab9a5e3b --> n3e0194ef
  nab9a5e3b --> n27e9ca92
  nab9a5e3b --> n87539973
  nab9a5e3b --> n5ae60ede
  nab9a5e3b --> na71c1c63
  nab9a5e3b --> n1ca289dd
  nab9a5e3b --> nc6c68023
  nab9a5e3b --> n80b6fdf6
  nab9a5e3b --> nb94d98ec
  nab9a5e3b --> n01c4eaca
  nab9a5e3b --> n1f437ae1
  nab9a5e3b --> n76a71a5b
  nab9a5e3b --> n29fc936b
  nab9a5e3b --> n5f98b6c6
  nab9a5e3b --> nb0be1262
  nab9a5e3b --> n789ac09f
  nab9a5e3b --> n5f0bb4e0
  nab9a5e3b --> n1a36c36c
  nab9a5e3b --> n7a5aa441
  nab9a5e3b --> n6c371828
  nab9a5e3b --> n74325bec
  nab9a5e3b --> n7ccf2af9
  nab9a5e3b --> n1219f3c0
  nab9a5e3b --> ncb9d7e8e
  nab9a5e3b --> n75032bc7
  nab9a5e3b --> n6693a87d
  nab9a5e3b --> n36b95f38
  nab9a5e3b --> na3eb0764
  nab9a5e3b --> n5aa63c6c
  nab9a5e3b --> nc5b82165
  nab9a5e3b --> ne712bd99
  nab9a5e3b --> n82e87b69
  nab9a5e3b --> n10c6ab61
  nab9a5e3b --> n51cfae22
  nab9a5e3b --> n8d311f77
  nab9a5e3b --> n07e654e7
  nab9a5e3b --> n14ff18e9
  nab9a5e3b --> nd945f34f
  nab9a5e3b --> n8d3df946
  nab9a5e3b --> nbbc9be56
  nab9a5e3b --> n05d8ec82
  nab9a5e3b --> nd3344a20
  nab9a5e3b --> n59ee899e
  nab9a5e3b --> n33103cf1
  nab9a5e3b --> n1ed6b382
  nab9a5e3b --> n8928aa83
  nab9a5e3b --> nfbf2e3f7
  nab9a5e3b --> ncc8a7d6e
  nab9a5e3b --> nddf7dc03
  nab9a5e3b --> nf157f46b
  nab9a5e3b --> n24fe0656
  nab9a5e3b --> nce34580c
  nab9a5e3b --> n92e6a0b0
  nab9a5e3b --> ne41eb5f2
  nab9a5e3b --> n3848dd26
  nab9a5e3b --> na00f2bc1
  nab9a5e3b --> n6c867399
  nab9a5e3b --> n1b378f0c
  nab9a5e3b --> nc391e075
  nab9a5e3b --> n5b4b6564
  nab9a5e3b --> n0e06c9e4
  nab9a5e3b --> ndeeaea23
  nab9a5e3b --> nba41e3ac
  nab9a5e3b --> n6249daa4
  nab9a5e3b --> n21ef046d
  nab9a5e3b --> ne5141809
  nab9a5e3b --> nbbea098e
  nab9a5e3b --> n6f95957b
  nab9a5e3b --> n522989e1
  nab9a5e3b --> n84f5a155
  nab9a5e3b --> n2babb571
  nab9a5e3b --> n766322b0
  nab9a5e3b --> ndca56923
  nab9a5e3b --> n31fc70b9
  nab9a5e3b --> n63f8bc1b
  nab9a5e3b --> n7c0bcea3
  nab9a5e3b --> n4c250770
  nab9a5e3b --> ne9dabf4b
  nab9a5e3b --> n0b487108
  nab9a5e3b --> n3fc29edc
  nab9a5e3b --> nc8af5c5d
  nab9a5e3b --> na7875506
  nab9a5e3b --> n594ecd79
  nab9a5e3b --> n64d30943
  nab9a5e3b --> n80341f0f
  nab9a5e3b --> n4b7394fb
  nab9a5e3b --> ne81c8b5a
  nab9a5e3b --> n18bd89cf
  nab9a5e3b --> n4cb7abeb
  nab9a5e3b --> n8c6ee526
  nab9a5e3b --> na8dc1c3b
  nab9a5e3b --> nadd1a6bf
  nab9a5e3b --> n3e80288e
  nab9a5e3b --> n01940383
  nab9a5e3b --> n67374c9b
  nab9a5e3b --> nf4ebbba6
  nab9a5e3b --> nbacc6318
  nab9a5e3b --> n0a0e7360
  nab9a5e3b --> n4847d5e9
  nab9a5e3b --> n0bf193bc
  nab9a5e3b --> n585a4945
  nab9a5e3b --> n9a448049
  nab9a5e3b --> n7e08e90e
  nab9a5e3b --> nef81fb2f
  nab9a5e3b --> n310b7338
  nab9a5e3b --> nee1b4757
  nab9a5e3b --> na86c961f
  nab9a5e3b --> nbe0dcde2
  nab9a5e3b --> nc7acb61e
  nab9a5e3b --> nebaa924c
  nab9a5e3b --> n1b6693b9
  nab9a5e3b --> nebdda918
  nab9a5e3b --> n475947e4
  nab9a5e3b --> n327e0a0f
  nab9a5e3b --> n339295ca
  nab9a5e3b --> n8c073057
  nab9a5e3b --> nd0117b12
  nab9a5e3b --> n70b50423
  nab9a5e3b --> n84ee0e1c
  nab9a5e3b --> nac1b668d
  nab9a5e3b --> ne4708bd3
  nab9a5e3b --> nd31d4da5
  nab9a5e3b --> n94ed4c8e
  nab9a5e3b --> na1b19c65
  nab9a5e3b --> n06839614
  nab9a5e3b --> nf609f3f6
  nab9a5e3b --> n1161c634
  nab9a5e3b --> n0428665a
  nab9a5e3b --> nb389b2d1
  nab9a5e3b --> n47badb54
  nae56ab68 --> n98d423a8
  nae56ab68 --> n5f2adf60
  n5f2adf60 --> n2f3e8087
  n5f2adf60 --> n12ae5830
  n5f2adf60 --> n0f4849c1
  n5f2adf60 --> n0f433af0
  n5f2adf60 --> n43509cc4
  n5f2adf60 --> n531a511b
  n5f2adf60 --> n832fb220
  n5f2adf60 --> n176181c6
  n5f2adf60 --> n2e07f218
  n5f2adf60 --> n68441e36
  n5f2adf60 --> n30a02274
  n5f2adf60 --> n50bdf797
  n5f2adf60 --> ne809da3b
  n5f2adf60 --> n167a54be
  n5f2adf60 --> n56e1c677
  n5f2adf60 --> n0314175f
  n5f2adf60 --> nc48ffd1b
  n5f2adf60 --> ne9fbcacf
  n5f2adf60 --> n6a91fc51
  n5f2adf60 --> nfbae82c7
  n5f2adf60 --> nbfc3bd74
  n5f2adf60 --> n4e7e00c8
  n5f2adf60 --> ncffcd9b5
  n5f2adf60 --> n2d38dcd0
  n5f2adf60 --> n149ce9d7
  n5f2adf60 --> n22727bf1
  n5f2adf60 --> n5d9c4848
  n5f2adf60 --> n2a4dd0a5
  n5f2adf60 --> n2d136859
  n5f2adf60 --> n7b1ef0c5
  n5f2adf60 --> n90f5c917
  n5f2adf60 --> naa6904fc
  n5f2adf60 --> n7fe32d87
  n5f2adf60 --> n6489df59
  n5f2adf60 --> n69377344
  n5f2adf60 --> n4bec54d9
  n5f2adf60 --> nd4ec5613
  n5f2adf60 --> n2382d698
  n5f2adf60 --> n8f3e4b2e
  n5f2adf60 --> n3d340567
  n5f2adf60 --> ncda8a66d
  n5f2adf60 --> n988521e1
  n5f2adf60 --> nea165f53
  n5f2adf60 --> n25ed1bce
  n5f2adf60 --> na8254e01
  n5f2adf60 --> n6c974c01
  n5f2adf60 --> n6cde3e66
  n5f2adf60 --> na5ea7ffc
  n5f2adf60 --> n04d485a1
  n5f2adf60 --> nae151cf4
  n5f2adf60 --> n3423da0c
  n5f2adf60 --> n38cb7298
  n5f2adf60 --> n8bfd171b
  n5f2adf60 --> n312a2c43
  n5f2adf60 --> n75ca9b48
  n5f2adf60 --> nb0097989
  n5f2adf60 --> n8d66eac8
  n5f2adf60 --> n4684237e
  n5f2adf60 --> n4c00f675
  n5f2adf60 --> n5070fd9a
  n5f2adf60 --> n11399815
  n5f2adf60 --> n9adf0a45
  n5f2adf60 --> n02c98291
  n5f2adf60 --> n0025b625
  n5f2adf60 --> n9e851d1a
  n5f2adf60 --> n063859ac
  n5f2adf60 --> n46c32104
  n5f2adf60 --> nee879185
  n5f2adf60 --> n20f18199
  n5f2adf60 --> n01641cc0
  n5f2adf60 --> n0cdea27f
  n5f2adf60 --> nf318433e
  n5f2adf60 --> n3dc82513
  n5f2adf60 --> n918c4f1b
  n5f2adf60 --> n4480f370
  n5f2adf60 --> naf30ddd9
  n5f2adf60 --> n6dbd3968
  n5f2adf60 --> nc07edf99
  n5f2adf60 --> nb0bd9b00
  nae56ab68 --> n73b66dcd
  nae56ab68 --> ne26e8f1f
  ne26e8f1f --> nb430890a
  ne26e8f1f --> n65f82c5e
  ne26e8f1f --> nc8adf1f6
  ne26e8f1f --> n81295b04
  ne26e8f1f --> n37c807c9
  ne26e8f1f --> n0e88eba5
  ne26e8f1f --> nab2478c5
  ne26e8f1f --> n3d50671a
  ne26e8f1f --> nae23952c
  ne26e8f1f --> n8860989e
  ne26e8f1f --> nb0ac7229
  ne26e8f1f --> nca69d66d
  ne26e8f1f --> n0d252d60
  ne26e8f1f --> n3dfab2c6
  ne26e8f1f --> n75d7e2be
  ne26e8f1f --> n038bdda1
  ne26e8f1f --> n5647b3df
  ne26e8f1f --> nae4d775a
  ne26e8f1f --> n6a558934
  ne26e8f1f --> nb8b068bf
  ne26e8f1f --> n7373b861
  ne26e8f1f --> n7f3e1737
  ne26e8f1f --> n41439444
  ne26e8f1f --> n3aae1b58
  ne26e8f1f --> nd7f02ebe
  ne26e8f1f --> nfa201637
  ne26e8f1f --> ne291165f
  ne26e8f1f --> nd85cc981
  ne26e8f1f --> n891c391b
  ne26e8f1f --> n0d9d42b4
  ne26e8f1f --> nd96fb160
  ne26e8f1f --> n24de8590
  ne26e8f1f --> n1b4463f5
  ne26e8f1f --> n49e015c2
  ne26e8f1f --> na7c9caa5
  ne26e8f1f --> n86d744fd
  ne26e8f1f --> nf698100f
  ne26e8f1f --> n3e24f51f
  ne26e8f1f --> n0d9370a1
  ne26e8f1f --> n4c311b93
  nae56ab68 --> n06c53b46
  nae56ab68 --> ndf2a5e48
  ndf2a5e48 --> nd6d461a7
  ndf2a5e48 --> nf317cd0f
  ndf2a5e48 --> nc06ab1d9
  ndf2a5e48 --> n53384654
  ndf2a5e48 --> ndfce4fbb
  ndf2a5e48 --> ne21deda3
  ndf2a5e48 --> n1c28aecd
  ndf2a5e48 --> nc9287749
  ndf2a5e48 --> n01da53e4
  ndf2a5e48 --> nca5e7a51
  ndf2a5e48 --> n3f69ef7f
  ndf2a5e48 --> n54f94869
  ndf2a5e48 --> n5dad05dc
  ndf2a5e48 --> n4964930d
  ndf2a5e48 --> nd7b0d49c
  ndf2a5e48 --> nf3c510d6
  ndf2a5e48 --> n2ee233b9
  ndf2a5e48 --> n186d1eca
  ndf2a5e48 --> nf01be46d
  ndf2a5e48 --> n9ea93275
  ndf2a5e48 --> n76180c65
  ndf2a5e48 --> n485003d2
  ndf2a5e48 --> nba81aa39
  ndf2a5e48 --> n25e65ae5
  ndf2a5e48 --> n4b3e34f7
  ndf2a5e48 --> n0563b3a6
  ndf2a5e48 --> nc3d7cc34
  ndf2a5e48 --> n89d5cc60
  ndf2a5e48 --> na2da598d
  ndf2a5e48 --> n0982d2f5
  ndf2a5e48 --> nb7db3475
  ndf2a5e48 --> nc1a5ae70
  ndf2a5e48 --> ne17ddde9
  ndf2a5e48 --> n8b06e40a
  ndf2a5e48 --> n0ce66b34
  ndf2a5e48 --> n4bb21feb
  ndf2a5e48 --> ne9dc99f2
  ndf2a5e48 --> n3ffa0121
  ndf2a5e48 --> nc520368a
  ndf2a5e48 --> n79597c9a
  ndf2a5e48 --> nc85873ff
  ndf2a5e48 --> n3431cf4e
  ndf2a5e48 --> nd855ee66
  ndf2a5e48 --> n92d1f8d6
  ndf2a5e48 --> n591253d4
  ndf2a5e48 --> nbecc4fd1
  ndf2a5e48 --> nbf1f93a6
  ndf2a5e48 --> n6ec1f5ad
  ndf2a5e48 --> nb4cd21a0
  ndf2a5e48 --> ncc86d262
  ndf2a5e48 --> nf06e1426
  ndf2a5e48 --> n39f1ad55
  ndf2a5e48 --> n4142e839
  ndf2a5e48 --> nfd15d424
  ndf2a5e48 --> n58130ece
  ndf2a5e48 --> nd6613d3e
  ndf2a5e48 --> n8c62d970
  ndf2a5e48 --> n11fe8b6f
  ndf2a5e48 --> n4b0b781b
  ndf2a5e48 --> n49a2766b
  ndf2a5e48 --> nbaaf8e27
  ndf2a5e48 --> nca6a283a
  ndf2a5e48 --> nb93130c6
  ndf2a5e48 --> n7a4a3c58
  ndf2a5e48 --> n86a00011
  ndf2a5e48 --> nc67de806
  ndf2a5e48 --> n586efa28
  ndf2a5e48 --> n8b8be02f
  ndf2a5e48 --> n998f6e9e
  ndf2a5e48 --> n5e9cbd57
  ndf2a5e48 --> n02f95f60
  ndf2a5e48 --> n5dc4917b
  ndf2a5e48 --> n3313c274
  ndf2a5e48 --> ne5ce307c
  ndf2a5e48 --> n2c29e531
  ndf2a5e48 --> n5e18919f
  ndf2a5e48 --> n00f2699f
  ndf2a5e48 --> n9eaec6c8
  ndf2a5e48 --> n8c831950
  ndf2a5e48 --> nd7c8f3cc
  ndf2a5e48 --> ned519e42
  ndf2a5e48 --> n6bb03a88
  ndf2a5e48 --> n5b86cc94
  ndf2a5e48 --> nb49da70f
  ndf2a5e48 --> na778b7fa
  ndf2a5e48 --> n5e7dacbc
  ndf2a5e48 --> n37cd5862
  ndf2a5e48 --> n60ef0493
  ndf2a5e48 --> nf17f37a9
  ndf2a5e48 --> n4a8b4ab3
  ndf2a5e48 --> n4effb9a2
  ndf2a5e48 --> n100f323a
  ndf2a5e48 --> nf77ec3ce
  ndf2a5e48 --> n45c1df58
  ndf2a5e48 --> na8d6155e
  ndf2a5e48 --> nbb90c974
  ndf2a5e48 --> n0d384b3e
  ndf2a5e48 --> n45b553d6
  ndf2a5e48 --> n8ad35aa0
  ndf2a5e48 --> n38e96be8
  ndf2a5e48 --> nff292077
  ndf2a5e48 --> ncd6ae03a
  ndf2a5e48 --> ndbd4b516
  ndf2a5e48 --> n057848eb
  ndf2a5e48 --> n045881b0
  ndf2a5e48 --> n1159235a
  ndf2a5e48 --> nb509f363
  ndf2a5e48 --> na2bc38f3
  ndf2a5e48 --> n45b58278
  ndf2a5e48 --> n1446a5ec
  ndf2a5e48 --> n894e455f
  ndf2a5e48 --> n53ca76e3
  ndf2a5e48 --> n8035ac46
  ndf2a5e48 --> nef2413ac
  ndf2a5e48 --> n04e5fdbb
  ndf2a5e48 --> n7377391d
  ndf2a5e48 --> n33ad518f
  ndf2a5e48 --> n6034cc20
  ndf2a5e48 --> n0ba5819b
  ndf2a5e48 --> n855010a4
  ndf2a5e48 --> n1b48bf3b
  ndf2a5e48 --> nce8320b7
  ndf2a5e48 --> n25432579
  ndf2a5e48 --> n2a96490e
  nae56ab68 --> n713b8b68
  nae56ab68 --> ndc13645e
  nae56ab68 --> n5d3a7b29
  nae56ab68 --> nf88c08bb
  nf88c08bb --> n21bbe036
  nf88c08bb --> nd4006356
  nf88c08bb --> nc65cb64a
  nf88c08bb --> nf164744f
  nf88c08bb --> nc77dd5dc
  nf88c08bb --> nf92dd0f4
  nf88c08bb --> n96f0f7ae
  nf88c08bb --> n5ab15940
  nf88c08bb --> n0399ab5e
  nf88c08bb --> n2a7c073a
  nf88c08bb --> n03d9edbf
  nae56ab68 --> n6b52214f
  nae56ab68 --> n149af883
```

| node | receipt uuid | referrer | payload fold | seq |
|---|---|---|---|---|
| root | `ae56ab68-9ec3-884a-bcff-312c1ab4c6de` | `a52cf8f3` | `417ded1fec75796e` | 0 |
| cross-receipt.json | `35c1451d-3592-87e4-ad9a-06e29b2cdb5c` | `ae56ab68` | `32e33b4efc02552d` | 1 |
| cross-receipt.json#0 | `ef9664e7-76a8-8af9-b4d4-2afbc05c55f9` | `35c1451d` | `1dfb50c09d3ec562` | 2 |
| cross-receipt.json#1 | `837cb252-3601-8681-a1be-8e5bbcadf3ea` | `35c1451d` | `71cd4b0253241eba` | 3 |
| cross-receipt.json#2 | `7ec2441c-a134-8afd-a162-5aaedb5f9d5e` | `35c1451d` | `d395906a7c1ca3bd` | 4 |
| cross-receipt.json#3 | `4d4787dc-db06-81df-bfbf-a8286d26f6c8` | `35c1451d` | `6d6d0a981d52ac76` | 5 |
| cross-receipt.json#4 | `ba991110-1081-81a2-8420-734c65fc095d` | `35c1451d` | `3206e3e260b0bda7` | 6 |
| cross-receipt.json#5 | `aad33ea3-b9ba-8dd7-8c2d-e32c730cb1e8` | `35c1451d` | `15acf0a0cff5c260` | 7 |
| cross-receipt.json#6 | `74aaa6eb-20f3-8bf2-94d6-719299b71386` | `35c1451d` | `15196e19197c8657` | 8 |
| cross-receipt.json#7 | `50e2140d-6a2a-84c0-a129-280644356458` | `35c1451d` | `c63f9497ab57fde9` | 9 |
| cross-receipt.json#8 | `179c7d06-f04e-8724-96a1-d5ff2a121563` | `35c1451d` | `e153a0b9425f5a0a` | 10 |
| cross-receipt.json#9 | `9ad607be-6a87-8f56-a9d5-b49efa5b97f5` | `35c1451d` | `da63fe824b42d3b9` | 11 |
| cross-receipt.json#10 | `1742dd90-c0e8-8ce1-a453-dbfb3a5ee8e6` | `35c1451d` | `30617b9216899d69` | 12 |
| cross-receipt.json#11 | `089f1c96-ceff-8eeb-9120-781e1ff397aa` | `35c1451d` | `e5d9a81caa284bd2` | 13 |
| cross-receipt.json#12 | `bc665889-3b38-86dd-81e7-7ff430827031` | `35c1451d` | `c926f909137e13ea` | 14 |
| cross-receipt.json#13 | `e4cd5a63-d711-8c56-9e57-fe175c8d99cd` | `35c1451d` | `970496b026f43786` | 15 |
| cross-receipt.json#14 | `0452a696-cc16-8268-806b-6a93ba013394` | `35c1451d` | `eddfd8ec84208444` | 16 |
| cross-receipt.json#15 | `5a66ce7b-ce7d-810d-89ec-3f04a88f9dd9` | `35c1451d` | `c635847ade052b98` | 17 |
| cross-receipt.json#16 | `0d54e17a-73db-8f7f-ab03-eaad912592db` | `35c1451d` | `e73fd7a6d186d5b9` | 18 |
| cross-receipt.json#17 | `be346193-355b-8281-b6bd-ea5c4e0280ae` | `35c1451d` | `488374c9d21d1916` | 19 |
| cross-receipt.json#18 | `b9e20632-d50d-8de0-a3cc-efdd577f9933` | `35c1451d` | `5a3a20319bd79246` | 20 |
| cross-receipt.json#19 | `8b4b180c-a5e1-87c5-a571-758450d63757` | `35c1451d` | `9722a986196949c6` | 21 |
| cross-receipt.json#20 | `f094aa84-4b43-850a-9cd3-abfdcde5ee34` | `35c1451d` | `91ee2fdc046a71f2` | 22 |
| cross-receipt.json#21 | `dce5a8e8-06e4-87e3-9cc2-a896b6230024` | `35c1451d` | `5464a03fab9710c1` | 23 |
| cross-receipt.json#22 | `ae17f862-440f-8a13-9bb4-8daba811faa1` | `35c1451d` | `7ef706f14b351d5e` | 24 |
| cross-receipt.json#23 | `8ed0cb58-455c-877b-b49f-dbe6705577d1` | `35c1451d` | `38fbb18b1e27788c` | 25 |
| cross-receipt.json#24 | `bd272266-6ceb-8876-9997-69f0bf57ff32` | `35c1451d` | `740b3c309e28316f` | 26 |
| cross-receipt.json#25 | `69218f3c-ef3c-85e0-b504-ae45b400948a` | `35c1451d` | `e90b89ce056c1a01` | 27 |
| cross-receipt.json#26 | `4c2efc0d-dd5f-8074-811f-3364b7fd89e4` | `35c1451d` | `f1e15ae62cdf1e35` | 28 |
| cross-receipt.json#27 | `1c527f60-d627-8f27-8a61-3d72abc0e169` | `35c1451d` | `d1ffa93bf956431e` | 29 |
| cross-receipt.json#28 | `26c8299d-6ed6-850f-9bbc-2d4c06d4d9b3` | `35c1451d` | `d5266feaca6b7beb` | 30 |
| cross-receipt.json#29 | `d438293b-ba12-8d45-b61f-848898925bf1` | `35c1451d` | `960c32a22f42e091` | 31 |
| debts-receipt.json | `a18b746a-ce9b-8c84-b900-8557397d7702` | `ae56ab68` | `ddb0d39a20dd9254` | 32 |
| discovery-receipt.json | `ab9a5e3b-ff45-8aa7-950e-d69323caf929` | `ae56ab68` | `3b2305b40028723a` | 33 |
| discovery-receipt.json#0 | `2b200363-3283-837d-a0b5-a443b3da94ac` | `ab9a5e3b` | `b81fbea12947c2a4` | 34 |
| discovery-receipt.json#1 | `80d47b09-b07c-8f79-9904-158d0daff142` | `ab9a5e3b` | `fb13d499f5313981` | 35 |
| discovery-receipt.json#2 | `1e4a6690-8fea-8e7a-855b-e1e70bc835fb` | `ab9a5e3b` | `15bfece2a2eb7f6e` | 36 |
| discovery-receipt.json#3 | `4ed1529d-972f-88ad-b33c-48ce2337bba5` | `ab9a5e3b` | `439866928513d906` | 37 |
| discovery-receipt.json#4 | `6641a14c-7a05-8769-8d77-7046f2da23a8` | `ab9a5e3b` | `5a434500752e901f` | 38 |
| discovery-receipt.json#5 | `864bb092-c0e1-8d75-8616-b1d6050cb75c` | `ab9a5e3b` | `afaad818097e2d99` | 39 |
| discovery-receipt.json#6 | `50a05ce9-3ce3-8a68-906e-4dbea991f97f` | `ab9a5e3b` | `92276eeea54ec502` | 40 |
| discovery-receipt.json#7 | `b125f93b-bed0-8d3d-a0af-2e304beab7e1` | `ab9a5e3b` | `55e6691d18d9c9c8` | 41 |
| discovery-receipt.json#8 | `22cdb512-ebdb-8b9f-81c8-f94003cf10f3` | `ab9a5e3b` | `2263cc0cf5d1abdc` | 42 |
| discovery-receipt.json#9 | `eab20563-05d3-8be0-bdc9-3177b7b952f7` | `ab9a5e3b` | `ccc482093ac8a46d` | 43 |
| discovery-receipt.json#10 | `65a0bab0-7c98-8f5c-9ea2-827af6e9f2cf` | `ab9a5e3b` | `a10cbce96361cbce` | 44 |
| discovery-receipt.json#11 | `3f91053e-c6aa-8521-97b6-30413f3495d5` | `ab9a5e3b` | `d9cfac3917d7509d` | 45 |
| discovery-receipt.json#12 | `b156dc69-7733-8c6e-ade1-31f8323e8a09` | `ab9a5e3b` | `05341fd2b782b5e0` | 46 |
| discovery-receipt.json#13 | `13f9d259-e3ca-8949-a9a7-d9f1f76b119b` | `ab9a5e3b` | `beab8c43b10bb533` | 47 |
| discovery-receipt.json#14 | `59a9bdeb-d32b-8c67-bbe8-f2e3dde03f9c` | `ab9a5e3b` | `2af8f731fb01afaf` | 48 |
| discovery-receipt.json#15 | `5a8d969e-c43e-80b3-bcc0-ff5814f3fcb1` | `ab9a5e3b` | `e29b428081beb370` | 49 |
| discovery-receipt.json#16 | `8eac52db-56cb-80ce-934d-e29fe321b84c` | `ab9a5e3b` | `0d97eef7d584a01c` | 50 |
| discovery-receipt.json#17 | `eec8c575-927a-8298-bc05-3744e411bee5` | `ab9a5e3b` | `e3d493621ef8ff43` | 51 |
| discovery-receipt.json#18 | `4d3d5748-6a08-8472-98f7-3d11d9da4688` | `ab9a5e3b` | `44789b85e1965616` | 52 |
| discovery-receipt.json#19 | `51108749-2123-8abe-96fa-97fdec034b9f` | `ab9a5e3b` | `2d30840e1f0e95a5` | 53 |
| discovery-receipt.json#20 | `d3097e40-2c4c-8ced-bc94-bf8929ccf05c` | `ab9a5e3b` | `603b514897ff0577` | 54 |
| discovery-receipt.json#21 | `830161b3-9731-8325-a7c0-d33cb221eee6` | `ab9a5e3b` | `9967db9f7d275941` | 55 |
| discovery-receipt.json#22 | `894a98cb-a508-8b53-8926-69bda78a1eb1` | `ab9a5e3b` | `a5a5474089b10076` | 56 |
| discovery-receipt.json#23 | `96942f37-63df-8d9b-9b83-0f5132a33a43` | `ab9a5e3b` | `a0353edfcdefb05b` | 57 |
| discovery-receipt.json#24 | `635c61c1-ce4c-80e2-8183-69dff255cce3` | `ab9a5e3b` | `ebbf1d6ae7ce1b60` | 58 |
| discovery-receipt.json#25 | `89331104-353b-870f-b693-a6178a0bc331` | `ab9a5e3b` | `7738c57423ad47e1` | 59 |
| discovery-receipt.json#26 | `079017b2-6852-8cb4-9af5-47b6e119389a` | `ab9a5e3b` | `d69d60e023d98aa0` | 60 |
| discovery-receipt.json#27 | `777ddd07-1eaa-874e-8d86-a2ee4bb6cd01` | `ab9a5e3b` | `22d2d4f7ebcce76e` | 61 |
| discovery-receipt.json#28 | `f230cadd-26f0-83e0-b96c-4649565b83a2` | `ab9a5e3b` | `9db8e1ef41518f3a` | 62 |
| discovery-receipt.json#29 | `1f1239b4-40c7-8d7b-a8c7-b898d85692cd` | `ab9a5e3b` | `850103b0e392a924` | 63 |
| discovery-receipt.json#30 | `afd8a515-28d6-85c9-82a0-2789cbee07f9` | `ab9a5e3b` | `1addc3ee0f07af0f` | 64 |
| discovery-receipt.json#31 | `880607f3-127f-8087-b3d4-c57c8d7e0420` | `ab9a5e3b` | `29c86af8ec021724` | 65 |
| discovery-receipt.json#32 | `28dfbb2a-0e6d-82db-8507-841748016140` | `ab9a5e3b` | `d745ed362f209caf` | 66 |
| discovery-receipt.json#33 | `64a88d42-27c1-8dd3-9dcf-9091e52475b9` | `ab9a5e3b` | `c48d688fc02068d8` | 67 |
| discovery-receipt.json#34 | `499cec91-b4b6-8920-a1b2-e42b4ce41c05` | `ab9a5e3b` | `cb194093566bc472` | 68 |
| discovery-receipt.json#35 | `5fb56287-db05-8700-90f1-117029a51737` | `ab9a5e3b` | `f735a6d0a17ec034` | 69 |
| discovery-receipt.json#36 | `5e0ee080-8212-8f76-bfe7-1f726e16c9ff` | `ab9a5e3b` | `3bed177b94ec7f6e` | 70 |
| discovery-receipt.json#37 | `b38185a6-80b8-86d1-8e55-c7b74673b259` | `ab9a5e3b` | `72950d0fe90d1ed3` | 71 |
| discovery-receipt.json#38 | `ff08c831-a82e-8fbf-be43-cae4da19751f` | `ab9a5e3b` | `400f3866d02afe7f` | 72 |
| discovery-receipt.json#39 | `478636fa-8dc1-8448-b461-87da35cbba9d` | `ab9a5e3b` | `a69bc0a7f4295a60` | 73 |
| discovery-receipt.json#40 | `fe72b29c-5534-8dca-a29e-6eba392bdaa9` | `ab9a5e3b` | `eebbe864f9c5fd9c` | 74 |
| discovery-receipt.json#41 | `292e5ad1-6270-858b-8796-be18d69583ed` | `ab9a5e3b` | `cb45ed7b597873d3` | 75 |
| discovery-receipt.json#42 | `d5134997-ffe7-86bb-8b7e-401029481486` | `ab9a5e3b` | `159e08ca895a6e0c` | 76 |
| discovery-receipt.json#43 | `3d45e04a-aa7b-8118-b1f4-0a9b829ff7c0` | `ab9a5e3b` | `0006ffc4e1f9b5fb` | 77 |
| discovery-receipt.json#44 | `a9e278d7-a930-8af5-a736-ef204f1c0c00` | `ab9a5e3b` | `0b67dae4a620ca54` | 78 |
| discovery-receipt.json#45 | `df3061f8-dbd3-82a3-afad-59dc5016a9fa` | `ab9a5e3b` | `b45e424737267e4a` | 79 |
| discovery-receipt.json#46 | `8886ab7f-7a8b-8447-bc08-588934d2b5e1` | `ab9a5e3b` | `7c5ed4cfc4b35334` | 80 |
| discovery-receipt.json#47 | `cd87354c-bb72-8a8d-b8b6-4d4cc2efe40e` | `ab9a5e3b` | `fb5d940edd2d69cf` | 81 |
| discovery-receipt.json#48 | `74ab1c29-b33c-86c5-8db5-69162ad76dce` | `ab9a5e3b` | `326d16d5a97c28f7` | 82 |
| discovery-receipt.json#49 | `e94c9fab-a9cf-8d5e-9b79-fd75adecc64a` | `ab9a5e3b` | `9161739f6adcd400` | 83 |
| discovery-receipt.json#50 | `7df54db8-6d20-8473-8b95-2aa6ca2b1c49` | `ab9a5e3b` | `aaf5123c1d8ccfeb` | 84 |
| discovery-receipt.json#51 | `ba5534a2-d6c4-8175-93c7-2b831cf91a38` | `ab9a5e3b` | `851639718b49f5c1` | 85 |
| discovery-receipt.json#52 | `606abde1-a744-85a7-8e38-13e92cce615a` | `ab9a5e3b` | `ae5f029f4e4f3074` | 86 |
| discovery-receipt.json#53 | `2ad8ad31-8a86-88e1-b151-664743d44d2a` | `ab9a5e3b` | `ad55dbb27e65b19f` | 87 |
| discovery-receipt.json#54 | `8488b3b3-e090-8a31-923f-717f4e33ce08` | `ab9a5e3b` | `1bc7f5d3220049db` | 88 |
| discovery-receipt.json#55 | `47d603bb-b7e8-854e-bc97-d66d22d47a7e` | `ab9a5e3b` | `3bb1f02f0dcd9f10` | 89 |
| discovery-receipt.json#56 | `912b345e-7a46-8721-9084-73e870db9ceb` | `ab9a5e3b` | `8bf8d1110f2521cf` | 90 |
| discovery-receipt.json#57 | `59788aa1-7784-8ded-93ce-a8c86e1bf632` | `ab9a5e3b` | `36b2a9ad458d6164` | 91 |
| discovery-receipt.json#58 | `c9733bcb-e27e-841d-a511-ea607020381e` | `ab9a5e3b` | `2fe389238f541cb3` | 92 |
| discovery-receipt.json#59 | `d7d05958-6182-8fb1-bb11-82d6fc372782` | `ab9a5e3b` | `eabcb5133f82430d` | 93 |
| discovery-receipt.json#60 | `4f8b5b63-4466-85ba-b92a-d66d462afe37` | `ab9a5e3b` | `13b55f0de5384367` | 94 |
| discovery-receipt.json#61 | `3190339f-830e-8371-807b-5fc77d429b50` | `ab9a5e3b` | `8ac16dab188d70d3` | 95 |
| discovery-receipt.json#62 | `dbd42fdd-f434-8e76-ac60-80e76aab6c6e` | `ab9a5e3b` | `a1975b8d7aca1a21` | 96 |
| discovery-receipt.json#63 | `92b2a4a5-fade-8eae-9739-e25e89df66a4` | `ab9a5e3b` | `82e2ca0f444f3e97` | 97 |
| discovery-receipt.json#64 | `2df48648-2371-81e0-aec7-24389add30ef` | `ab9a5e3b` | `c8c3e8d58bc1570b` | 98 |
| discovery-receipt.json#65 | `651ce11c-a525-819e-9cf2-6335c7e4b85f` | `ab9a5e3b` | `471928fabe8f76a9` | 99 |
| discovery-receipt.json#66 | `7046cfd1-c6e2-8dfd-a951-0f7155f19fd8` | `ab9a5e3b` | `7e5d60fd80a6010b` | 100 |
| discovery-receipt.json#67 | `4002fbeb-8570-855f-a606-b958b2cb8c73` | `ab9a5e3b` | `13cfa5ea874e50b7` | 101 |
| discovery-receipt.json#68 | `d16a8940-1fbf-8ba9-9523-14d8f4739800` | `ab9a5e3b` | `39d1fad38a13df82` | 102 |
| discovery-receipt.json#69 | `46cea1c7-fbd0-8d0f-8c68-67c46ebd7194` | `ab9a5e3b` | `bb0eb68c1e4df555` | 103 |
| discovery-receipt.json#70 | `56612b47-36e9-8285-801d-a6addcf45538` | `ab9a5e3b` | `9474b70daa72e517` | 104 |
| discovery-receipt.json#71 | `80880bd5-6363-81fe-8e10-d39492ab3cb4` | `ab9a5e3b` | `c5c2a6b4d2d8b6ad` | 105 |
| discovery-receipt.json#72 | `1b40541c-f8ba-8143-826f-0198744779f3` | `ab9a5e3b` | `a51fd36a1f6a9d5d` | 106 |
| discovery-receipt.json#73 | `5a8e0c90-6a4d-839a-ac7e-48c9afab9162` | `ab9a5e3b` | `e321c2d28d204950` | 107 |
| discovery-receipt.json#74 | `d7c079c7-91d3-8b6b-868c-8826fdb71958` | `ab9a5e3b` | `f2cf997e4c5db4cf` | 108 |
| discovery-receipt.json#75 | `7c6fc5ce-1b47-8651-8c53-e563858f7c44` | `ab9a5e3b` | `7981252991a6e244` | 109 |
| discovery-receipt.json#76 | `756695f8-0240-80a5-a7a6-779337da9f75` | `ab9a5e3b` | `8fc316b1164aa221` | 110 |
| discovery-receipt.json#77 | `b514cc7f-a4ba-86ad-9554-d76451cfa59c` | `ab9a5e3b` | `91da31260599422d` | 111 |
| discovery-receipt.json#78 | `2d9c3f5d-88e3-8133-bbc4-052377bf3646` | `ab9a5e3b` | `f99e5df93a8e9e16` | 112 |
| discovery-receipt.json#79 | `4e11f7c1-82ac-8eaa-b29d-f60b83e99b90` | `ab9a5e3b` | `95e07a3719cda391` | 113 |
| discovery-receipt.json#80 | `0054c862-e420-82c4-83b1-7297ab0d8f0e` | `ab9a5e3b` | `2fe97258aa5dee5a` | 114 |
| discovery-receipt.json#81 | `03340fff-819b-89eb-a4e0-c1ab2e2d9034` | `ab9a5e3b` | `3cb51de013b962b2` | 115 |
| discovery-receipt.json#82 | `9ffe98e9-763c-8a7b-9363-1dbc3bf0ba34` | `ab9a5e3b` | `abdfe71a4d6c906e` | 116 |
| discovery-receipt.json#83 | `42e58179-b4b7-8acc-a325-10553201059e` | `ab9a5e3b` | `89242ae5cb5bd523` | 117 |
| discovery-receipt.json#84 | `85de9815-97b7-891f-a1a6-49c25c9dff82` | `ab9a5e3b` | `75ed8e61a3e6642e` | 118 |
| discovery-receipt.json#85 | `03b9b6bd-3b22-8a74-8d45-850364ee0a40` | `ab9a5e3b` | `6d476ff3005b766a` | 119 |
| discovery-receipt.json#86 | `6608c993-a082-855a-8af4-ec52bbf1e34a` | `ab9a5e3b` | `71a8873f118d59ab` | 120 |
| discovery-receipt.json#87 | `839cf3bf-727a-802c-a347-92aaa5f56b3c` | `ab9a5e3b` | `4b579768420c5a4d` | 121 |
| discovery-receipt.json#88 | `393cb8b3-4459-8cf8-bff2-6fd5919387dd` | `ab9a5e3b` | `169d9ca31cea83d0` | 122 |
| discovery-receipt.json#89 | `5f301816-b4cf-81e7-ba28-8360439c1b5f` | `ab9a5e3b` | `505cf0c8789d555a` | 123 |
| discovery-receipt.json#90 | `a26ba745-fb74-80cb-b988-071313c9dff3` | `ab9a5e3b` | `323cd17e99e13657` | 124 |
| discovery-receipt.json#91 | `b743200c-42d5-87ef-b7ff-34054b0c8271` | `ab9a5e3b` | `ed681e062da1cfaa` | 125 |
| discovery-receipt.json#92 | `b543a244-abe2-84f4-81f5-4f37345ea7f9` | `ab9a5e3b` | `0455d61dec206e72` | 126 |
| discovery-receipt.json#93 | `b30ed214-aafd-8a96-ab0d-629db4903a18` | `ab9a5e3b` | `3218016ff37a807a` | 127 |
| discovery-receipt.json#94 | `4c0d5c02-00ec-8b22-b6a4-104ac7fbbba2` | `ab9a5e3b` | `b5680e2bf48c2b58` | 128 |
| discovery-receipt.json#95 | `26cf7be1-6685-8a7e-8c9e-28b77bf9c718` | `ab9a5e3b` | `b74b548fc66f8e31` | 129 |
| discovery-receipt.json#96 | `ad9cfdb2-4a69-8443-bf87-954b137141f0` | `ab9a5e3b` | `6a47a1b4dbb27de5` | 130 |
| discovery-receipt.json#97 | `6d82626a-a7b3-8305-b661-e75e44c1a339` | `ab9a5e3b` | `035ceb32fb5c55d9` | 131 |
| discovery-receipt.json#98 | `9ec164c9-002d-868d-9870-51f20b889a6e` | `ab9a5e3b` | `150fbace6ca72bf2` | 132 |
| discovery-receipt.json#99 | `3e0194ef-de7d-88c5-b5ec-0cf1912f8372` | `ab9a5e3b` | `a01a01215b8d6029` | 133 |
| discovery-receipt.json#100 | `27e9ca92-eb8c-8d56-8c7d-f29efa8ec855` | `ab9a5e3b` | `61b2e06f792e8f2f` | 134 |
| discovery-receipt.json#101 | `87539973-9bd8-8f37-96fd-418a99b3fe82` | `ab9a5e3b` | `59ff93467974d7f6` | 135 |
| discovery-receipt.json#102 | `5ae60ede-9ac8-8dcc-9054-3c0af03401a9` | `ab9a5e3b` | `4416d9effc445518` | 136 |
| discovery-receipt.json#103 | `a71c1c63-eb17-8ace-a939-7d1794cc9869` | `ab9a5e3b` | `663794438c6d54d8` | 137 |
| discovery-receipt.json#104 | `1ca289dd-2a06-87b2-81cf-e0ee492aff0c` | `ab9a5e3b` | `cb2283cb042dc51b` | 138 |
| discovery-receipt.json#105 | `c6c68023-aefd-89f9-b3f7-6826d49dca48` | `ab9a5e3b` | `906b95b27be0cd9e` | 139 |
| discovery-receipt.json#106 | `80b6fdf6-2d41-8979-b122-647eb9c9b364` | `ab9a5e3b` | `da3d2659109201cf` | 140 |
| discovery-receipt.json#107 | `b94d98ec-4d6d-8fe6-b834-8d54c903977a` | `ab9a5e3b` | `4e6385f1282fd860` | 141 |
| discovery-receipt.json#108 | `01c4eaca-f62a-8d46-b6c0-4e6f7a2d28e6` | `ab9a5e3b` | `4e8cf13908722a7d` | 142 |
| discovery-receipt.json#109 | `1f437ae1-8c7d-87dc-9579-f105ef126f56` | `ab9a5e3b` | `4dc75a1779d9a6ac` | 143 |
| discovery-receipt.json#110 | `76a71a5b-632c-8e7f-a18a-1cca83bcd72a` | `ab9a5e3b` | `379ef2f666e52b9d` | 144 |
| discovery-receipt.json#111 | `29fc936b-69f9-8734-8f0d-4f4e616470bd` | `ab9a5e3b` | `12196e2d9f479f49` | 145 |
| discovery-receipt.json#112 | `5f98b6c6-88f1-8683-81c7-5e391a6bb7cf` | `ab9a5e3b` | `ba34094a30a5fd8e` | 146 |
| discovery-receipt.json#113 | `b0be1262-0255-8fa1-9d96-1cc881c7959b` | `ab9a5e3b` | `0fb9fbe10a139d72` | 147 |
| discovery-receipt.json#114 | `789ac09f-2255-8d63-b12b-c4ccfb139852` | `ab9a5e3b` | `19c55fbb9a260dee` | 148 |
| discovery-receipt.json#115 | `5f0bb4e0-5de5-84b7-8b3d-4d391adf1a0c` | `ab9a5e3b` | `6551a75dcf097276` | 149 |
| discovery-receipt.json#116 | `1a36c36c-54a9-85b5-9c02-733f7b32c419` | `ab9a5e3b` | `30444cdf508e2ab3` | 150 |
| discovery-receipt.json#117 | `7a5aa441-b046-84af-8727-ce761eb8e06e` | `ab9a5e3b` | `2c9c5d4c1c5a9c3f` | 151 |
| discovery-receipt.json#118 | `6c371828-c258-830a-b58a-b72e732ecd27` | `ab9a5e3b` | `629d4fd1fd33c601` | 152 |
| discovery-receipt.json#119 | `74325bec-0135-8f16-af89-ba7aa33d2a32` | `ab9a5e3b` | `276396eaa5e1a2b5` | 153 |
| discovery-receipt.json#120 | `7ccf2af9-db0e-8104-a018-f7b8629fe5a6` | `ab9a5e3b` | `c99d45ac0e9d3e31` | 154 |
| discovery-receipt.json#121 | `1219f3c0-fadb-8109-85a5-acda1bcd3cbc` | `ab9a5e3b` | `6c6c3b7750835c0d` | 155 |
| discovery-receipt.json#122 | `cb9d7e8e-9c17-8c59-ae59-b0fc0b66b5f0` | `ab9a5e3b` | `61bf96cb5fc1389e` | 156 |
| discovery-receipt.json#123 | `75032bc7-95fc-875c-9d21-6be5cfb3fb26` | `ab9a5e3b` | `4f919a0347278120` | 157 |
| discovery-receipt.json#124 | `6693a87d-023c-851d-9d9e-f24c40a6c2cc` | `ab9a5e3b` | `89d5d5e5cdc0e151` | 158 |
| discovery-receipt.json#125 | `36b95f38-4e0d-8d7f-8862-20ca50b04c92` | `ab9a5e3b` | `1f1e4b46327d5683` | 159 |
| discovery-receipt.json#126 | `a3eb0764-a788-8183-bd60-1606e2b9274b` | `ab9a5e3b` | `76ec2974b64126f9` | 160 |
| discovery-receipt.json#127 | `5aa63c6c-b269-89c1-8700-cfe88c1224f6` | `ab9a5e3b` | `e477f21278f7ca82` | 161 |
| discovery-receipt.json#128 | `c5b82165-bce9-899d-9c68-4edc680908a8` | `ab9a5e3b` | `63f8ab4d61720b68` | 162 |
| discovery-receipt.json#129 | `e712bd99-734f-869d-b5a1-83df4b7e8b99` | `ab9a5e3b` | `17e95aabdecf7648` | 163 |
| discovery-receipt.json#130 | `82e87b69-439f-8d01-90b3-5e6c01da30cc` | `ab9a5e3b` | `0a5d059a5af1a653` | 164 |
| discovery-receipt.json#131 | `10c6ab61-684e-829f-928f-4962d700cae9` | `ab9a5e3b` | `22541736ccfdb270` | 165 |
| discovery-receipt.json#132 | `51cfae22-214f-8ff6-8249-1d2825eb70ef` | `ab9a5e3b` | `fe25c2e4959c480b` | 166 |
| discovery-receipt.json#133 | `8d311f77-440d-8319-ac3b-e450322120fc` | `ab9a5e3b` | `b510bd3e54653a54` | 167 |
| discovery-receipt.json#134 | `07e654e7-1f0d-8c37-a2ef-0f845cde6091` | `ab9a5e3b` | `a12bf3f7ef414a5d` | 168 |
| discovery-receipt.json#135 | `14ff18e9-f654-8a02-9816-e404992d4791` | `ab9a5e3b` | `0c3e358aea780f06` | 169 |
| discovery-receipt.json#136 | `d945f34f-097d-8f68-b195-e2f8e5362182` | `ab9a5e3b` | `39953db9a3aadfb9` | 170 |
| discovery-receipt.json#137 | `8d3df946-d66a-81d6-bfa4-e8ee4865f12c` | `ab9a5e3b` | `95e3a1d4c932dc47` | 171 |
| discovery-receipt.json#138 | `bbc9be56-24e6-823b-964b-b92648fc8378` | `ab9a5e3b` | `bdb66b58436dcc84` | 172 |
| discovery-receipt.json#139 | `05d8ec82-814d-8f85-946f-eea281e03ec1` | `ab9a5e3b` | `6858024f68d897a7` | 173 |
| discovery-receipt.json#140 | `d3344a20-7df3-897b-bc47-0308287f4c9a` | `ab9a5e3b` | `afc8516a0268a4b9` | 174 |
| discovery-receipt.json#141 | `59ee899e-0fe5-8eab-b621-e78749098ff8` | `ab9a5e3b` | `062f4c6fc767fe1c` | 175 |
| discovery-receipt.json#142 | `33103cf1-d879-85c6-bee3-12bf1cde5545` | `ab9a5e3b` | `6b97b0e6d26603bd` | 176 |
| discovery-receipt.json#143 | `1ed6b382-a64b-8f70-8f33-a2b6b509b697` | `ab9a5e3b` | `e43eea874cca6714` | 177 |
| discovery-receipt.json#144 | `8928aa83-a440-8f50-a7f9-807deda1bf8a` | `ab9a5e3b` | `afb182415a86fd9c` | 178 |
| discovery-receipt.json#145 | `fbf2e3f7-9b79-846c-95a8-c55e0fa74924` | `ab9a5e3b` | `f3cd641802ca6af3` | 179 |
| discovery-receipt.json#146 | `cc8a7d6e-cd23-813d-8ec2-7fb103bb7180` | `ab9a5e3b` | `0aa1b7337ed819e7` | 180 |
| discovery-receipt.json#147 | `ddf7dc03-74c9-82b7-b31b-2bab307a0887` | `ab9a5e3b` | `4261755c53e0f106` | 181 |
| discovery-receipt.json#148 | `f157f46b-152e-8240-a784-61f6d8fd59b2` | `ab9a5e3b` | `808b97c8d736188b` | 182 |
| discovery-receipt.json#149 | `24fe0656-b544-84f2-8bed-38b2b1d99d6c` | `ab9a5e3b` | `19a5d9b97e14b705` | 183 |
| discovery-receipt.json#150 | `ce34580c-17c4-8d85-b512-55375311e6b1` | `ab9a5e3b` | `85648634f05e78f6` | 184 |
| discovery-receipt.json#151 | `92e6a0b0-a96f-8c09-a02e-7f31ec2f766d` | `ab9a5e3b` | `dc3628920b93d2e0` | 185 |
| discovery-receipt.json#152 | `e41eb5f2-c963-8f91-9140-65f45de91435` | `ab9a5e3b` | `b47575c2fabd594a` | 186 |
| discovery-receipt.json#153 | `3848dd26-8f4a-8d86-849a-aca144ca5fed` | `ab9a5e3b` | `b08d4fda51c70e96` | 187 |
| discovery-receipt.json#154 | `a00f2bc1-b982-8ae2-b472-e5775261f9f8` | `ab9a5e3b` | `cc6b19555a1deb3f` | 188 |
| discovery-receipt.json#155 | `6c867399-13b2-8c39-99be-1414156d7339` | `ab9a5e3b` | `d85edf24fe34bf20` | 189 |
| discovery-receipt.json#156 | `1b378f0c-5ec6-8e52-b8b8-dc009c58f6ba` | `ab9a5e3b` | `aced62d64abca2a0` | 190 |
| discovery-receipt.json#157 | `c391e075-8817-8a00-beee-32a4aa04c3c5` | `ab9a5e3b` | `cc04c7a35f05233e` | 191 |
| discovery-receipt.json#158 | `5b4b6564-dacc-8463-99c2-3ec7b9b12204` | `ab9a5e3b` | `5ee401697a9153a7` | 192 |
| discovery-receipt.json#159 | `0e06c9e4-9434-885c-b66d-f0b6b3e591f4` | `ab9a5e3b` | `65f7e64148d38a28` | 193 |
| discovery-receipt.json#160 | `deeaea23-fba0-85e7-8235-f21dda9e671b` | `ab9a5e3b` | `674a08a5db79e1af` | 194 |
| discovery-receipt.json#161 | `ba41e3ac-5d68-8513-9bce-e0c15903f7ec` | `ab9a5e3b` | `f22286415a01ecb9` | 195 |
| discovery-receipt.json#162 | `6249daa4-efef-8cd7-8452-edaa7da97db3` | `ab9a5e3b` | `5eee2bc1b33131ba` | 196 |
| discovery-receipt.json#163 | `21ef046d-811e-86d0-aa45-560ba4bf1860` | `ab9a5e3b` | `ba095a80e59d381d` | 197 |
| discovery-receipt.json#164 | `e5141809-ca68-8bd4-a4d0-2ef530c618f8` | `ab9a5e3b` | `1a61455b894b74b3` | 198 |
| discovery-receipt.json#165 | `bbea098e-8993-81b4-8abc-e70da842ed43` | `ab9a5e3b` | `3ff8f8c040c4c0ec` | 199 |
| discovery-receipt.json#166 | `6f95957b-dc2e-8e54-9eb9-7e290ad37796` | `ab9a5e3b` | `bfae892d4aca4bc1` | 200 |
| discovery-receipt.json#167 | `522989e1-abc1-8a56-afb7-bc79a339b66a` | `ab9a5e3b` | `442112f893b99849` | 201 |
| discovery-receipt.json#168 | `84f5a155-878f-86ba-a212-2b069200d356` | `ab9a5e3b` | `989545106315201c` | 202 |
| discovery-receipt.json#169 | `2babb571-f769-8349-af9f-e90a317a0ecc` | `ab9a5e3b` | `be3917a50f21df72` | 203 |
| discovery-receipt.json#170 | `766322b0-11e0-8cbf-a493-5c15bc4c92c4` | `ab9a5e3b` | `9a4c12d33cf24efa` | 204 |
| discovery-receipt.json#171 | `dca56923-9e58-8265-8208-3ad7347325de` | `ab9a5e3b` | `61e9f2df1e343857` | 205 |
| discovery-receipt.json#172 | `31fc70b9-b87c-8ba3-b668-65ffff407a0d` | `ab9a5e3b` | `63754a41c5ed8292` | 206 |
| discovery-receipt.json#173 | `63f8bc1b-2055-8498-b510-62d87ca10382` | `ab9a5e3b` | `59713c60bd5f1a58` | 207 |
| discovery-receipt.json#174 | `7c0bcea3-6487-808a-bf11-a926af1c687a` | `ab9a5e3b` | `ffae6f90eba81622` | 208 |
| discovery-receipt.json#175 | `4c250770-cf19-8c37-8a28-746e132bb66d` | `ab9a5e3b` | `86759df4a103945d` | 209 |
| discovery-receipt.json#176 | `e9dabf4b-8a6f-826b-bab3-0cb7097fa1fb` | `ab9a5e3b` | `2fc303db50d6f362` | 210 |
| discovery-receipt.json#177 | `0b487108-9751-8490-85bb-56aa23fd33c1` | `ab9a5e3b` | `1d70654f424f93c9` | 211 |
| discovery-receipt.json#178 | `3fc29edc-ee3d-89c6-b1a0-5751151f8352` | `ab9a5e3b` | `e10b7d496458a14d` | 212 |
| discovery-receipt.json#179 | `c8af5c5d-3a8c-8ece-92c1-ea9e295b1361` | `ab9a5e3b` | `755ad5e18520a01e` | 213 |
| discovery-receipt.json#180 | `a7875506-702a-8663-b9a6-91e739230a86` | `ab9a5e3b` | `b8deff581df242b6` | 214 |
| discovery-receipt.json#181 | `594ecd79-a914-8620-adb9-183c16acb0f8` | `ab9a5e3b` | `a70e1efe285b46c7` | 215 |
| discovery-receipt.json#182 | `64d30943-9c98-855a-aa72-7a90872dedfe` | `ab9a5e3b` | `571eb834d52bb6d6` | 216 |
| discovery-receipt.json#183 | `80341f0f-e5f6-834e-ba75-a6683fa65322` | `ab9a5e3b` | `adc4dc0e53fda72a` | 217 |
| discovery-receipt.json#184 | `4b7394fb-51c6-8a29-a26d-c1b6462b111f` | `ab9a5e3b` | `cbc4f63c8ed5448a` | 218 |
| discovery-receipt.json#185 | `e81c8b5a-fcee-836d-90db-f30a55aaebe1` | `ab9a5e3b` | `b2a2e9d800e5fe5e` | 219 |
| discovery-receipt.json#186 | `18bd89cf-14bf-8ee0-b647-b2de2948b352` | `ab9a5e3b` | `140b2649054e8a19` | 220 |
| discovery-receipt.json#187 | `4cb7abeb-13f8-8024-ac52-a6d2140a6da7` | `ab9a5e3b` | `1eb4ca143aa8ae95` | 221 |
| discovery-receipt.json#188 | `8c6ee526-8fbc-89b3-b098-ac8352788bbf` | `ab9a5e3b` | `e77196186609ce38` | 222 |
| discovery-receipt.json#189 | `a8dc1c3b-11e3-8be7-ac1e-966dec8129c7` | `ab9a5e3b` | `9592f428d9e85b03` | 223 |
| discovery-receipt.json#190 | `add1a6bf-8f67-8f33-9c77-f9efba88d2a0` | `ab9a5e3b` | `95adfe659906ad53` | 224 |
| discovery-receipt.json#191 | `3e80288e-72fb-807b-88a8-55d6ca87e361` | `ab9a5e3b` | `22f7cae973ca611f` | 225 |
| discovery-receipt.json#192 | `01940383-8820-8957-8ccc-72c791bf0200` | `ab9a5e3b` | `b8167d7f74c12f6a` | 226 |
| discovery-receipt.json#193 | `67374c9b-4ffc-84c3-913d-762f95f13cd2` | `ab9a5e3b` | `a598553e99207e15` | 227 |
| discovery-receipt.json#194 | `f4ebbba6-b179-80a2-997d-c9a915da72fd` | `ab9a5e3b` | `6228cb1a7e81f8f0` | 228 |
| discovery-receipt.json#195 | `bacc6318-0174-8350-96a9-b3cafceccef7` | `ab9a5e3b` | `66a78ecce680bd1b` | 229 |
| discovery-receipt.json#196 | `0a0e7360-a666-8c4e-ba5c-ae0c90c4af41` | `ab9a5e3b` | `8ff703ac2935d5a2` | 230 |
| discovery-receipt.json#197 | `4847d5e9-0e3a-8a31-b091-f29b8742a1e3` | `ab9a5e3b` | `8ec10fff4c954180` | 231 |
| discovery-receipt.json#198 | `0bf193bc-6b35-82b2-b210-c11b2f20b9a1` | `ab9a5e3b` | `e8f66df48ab139a8` | 232 |
| discovery-receipt.json#199 | `585a4945-bc04-85ff-9f17-d16aff17860a` | `ab9a5e3b` | `84fcfde08ef09521` | 233 |
| discovery-receipt.json#200 | `9a448049-8b5d-837a-9f39-419f75ed7222` | `ab9a5e3b` | `9c512dde538bbdd0` | 234 |
| discovery-receipt.json#201 | `7e08e90e-3660-8b30-9d00-c37e0bf7e5a6` | `ab9a5e3b` | `b9a81fa717b39c17` | 235 |
| discovery-receipt.json#202 | `ef81fb2f-48a5-8276-aa21-a0d4569691cf` | `ab9a5e3b` | `b1469eff917feabc` | 236 |
| discovery-receipt.json#203 | `310b7338-1bbe-81bc-ac03-8ef3ca0a5bae` | `ab9a5e3b` | `6540a0dfd99333ad` | 237 |
| discovery-receipt.json#204 | `ee1b4757-2359-80df-97e2-36ebd9ae5cf4` | `ab9a5e3b` | `009ea04eb25763e6` | 238 |
| discovery-receipt.json#205 | `a86c961f-bc91-8049-a97f-5b09775d7572` | `ab9a5e3b` | `c1bfe22e74318e83` | 239 |
| discovery-receipt.json#206 | `be0dcde2-aebd-8aae-b893-899fc78d3cec` | `ab9a5e3b` | `429075c978b236b5` | 240 |
| discovery-receipt.json#207 | `c7acb61e-cc0a-8c47-8544-a461480259c5` | `ab9a5e3b` | `7be2a0f86108bc25` | 241 |
| discovery-receipt.json#208 | `ebaa924c-69cb-8214-9cf1-a72b580d4349` | `ab9a5e3b` | `c775c5aaefad2178` | 242 |
| discovery-receipt.json#209 | `1b6693b9-4717-82e8-ba88-91e5d0ee4c58` | `ab9a5e3b` | `bfad9461617d28a2` | 243 |
| discovery-receipt.json#210 | `ebdda918-7533-8994-a4aa-55006b0287fc` | `ab9a5e3b` | `02d203c0237715bd` | 244 |
| discovery-receipt.json#211 | `475947e4-217f-879d-a1a0-32684a986714` | `ab9a5e3b` | `15ce0fca3069fa4f` | 245 |
| discovery-receipt.json#212 | `327e0a0f-509e-8eb0-b1d3-7e00af5820c0` | `ab9a5e3b` | `26512b77bb92cd99` | 246 |
| discovery-receipt.json#213 | `339295ca-d419-829c-98fb-8be73496ee1f` | `ab9a5e3b` | `5758a4ff89fce29a` | 247 |
| discovery-receipt.json#214 | `8c073057-5672-8070-8d55-844c19c331a6` | `ab9a5e3b` | `350239ad42ad3a31` | 248 |
| discovery-receipt.json#215 | `d0117b12-4425-8c43-9df0-30002f98a77b` | `ab9a5e3b` | `b3064f2205427119` | 249 |
| discovery-receipt.json#216 | `70b50423-1237-836e-9b30-6a8e85b1b53c` | `ab9a5e3b` | `1f5423e4e0f87404` | 250 |
| discovery-receipt.json#217 | `84ee0e1c-8fe0-8f15-a3c3-c8e526fee90d` | `ab9a5e3b` | `3ca172c3d500d7d1` | 251 |
| discovery-receipt.json#218 | `ac1b668d-6685-841b-bef4-1d4e9f73a2e9` | `ab9a5e3b` | `6ccdf5cef70d5625` | 252 |
| discovery-receipt.json#219 | `e4708bd3-4feb-8a89-b8b0-4803e59b8ac2` | `ab9a5e3b` | `f01de9b23e26fbc3` | 253 |
| discovery-receipt.json#220 | `d31d4da5-81b1-8334-b5eb-807101b939a3` | `ab9a5e3b` | `c5de1f2f44e4418b` | 254 |
| discovery-receipt.json#221 | `94ed4c8e-65cd-8e63-8741-593817932b74` | `ab9a5e3b` | `649851d4b7b5cc95` | 255 |
| discovery-receipt.json#222 | `a1b19c65-9ca3-87a7-aea7-aa1a98ad1a50` | `ab9a5e3b` | `f872d5dddd78589f` | 256 |
| discovery-receipt.json#223 | `06839614-0004-87b7-a42b-226c02e78c3d` | `ab9a5e3b` | `20f893b75c8141b1` | 257 |
| discovery-receipt.json#224 | `f609f3f6-23b2-860f-b786-34868e38513a` | `ab9a5e3b` | `b849585b01fc61b4` | 258 |
| discovery-receipt.json#225 | `1161c634-d357-8b9c-b750-468da048dfd6` | `ab9a5e3b` | `24c375f7b70a5e4d` | 259 |
| discovery-receipt.json#226 | `0428665a-f394-8ab8-b6be-bd0096bb8764` | `ab9a5e3b` | `33fcab3fc0bd320e` | 260 |
| discovery-receipt.json#227 | `b389b2d1-fe5b-8316-a6e5-7e52dcc4958d` | `ab9a5e3b` | `e95dfe19d7139556` | 261 |
| discovery-receipt.json#228 | `47badb54-ca47-8f1e-b93b-cf194ca6ce63` | `ab9a5e3b` | `d2c871c77fb5edeb` | 262 |
| flaws-receipt.json | `98d423a8-6b97-8531-8612-3a13df3df758` | `ae56ab68` | `4c375110f22b54d5` | 263 |
| formulas-receipt.json | `5f2adf60-ccf1-8955-9b60-1faff2450d22` | `ae56ab68` | `3ec3d49f76726d92` | 264 |
| formulas-receipt.json#0 | `2f3e8087-4c7d-885b-99fe-705090362eff` | `5f2adf60` | `339b29236990d5b2` | 265 |
| formulas-receipt.json#1 | `12ae5830-c495-8916-bba1-afba213d6bce` | `5f2adf60` | `579e3fa69c9eef8f` | 266 |
| formulas-receipt.json#2 | `0f4849c1-b08b-81d9-a700-5250a91c09fe` | `5f2adf60` | `74e221e1272871fc` | 267 |
| formulas-receipt.json#3 | `0f433af0-613f-8cda-9bf3-90dd92540c7e` | `5f2adf60` | `668c47e5af18e443` | 268 |
| formulas-receipt.json#4 | `43509cc4-8af4-81f6-a96e-9a045c6c390a` | `5f2adf60` | `0ff60b28464c322f` | 269 |
| formulas-receipt.json#5 | `531a511b-1e59-805d-b786-b972fca5b5db` | `5f2adf60` | `5eb3e9f6d90d2f27` | 270 |
| formulas-receipt.json#6 | `832fb220-6772-8123-ac80-9946fc4dc464` | `5f2adf60` | `8120fa4b12eae213` | 271 |
| formulas-receipt.json#7 | `176181c6-acc3-8043-9ab3-79c6a9bdd302` | `5f2adf60` | `e8dcaf6c7580bacb` | 272 |
| formulas-receipt.json#8 | `2e07f218-e66c-89c7-8d54-bdf73a33e4a2` | `5f2adf60` | `033cfa5f2d97ed33` | 273 |
| formulas-receipt.json#9 | `68441e36-b8e7-86b5-9795-2c06ec58b31b` | `5f2adf60` | `fb250d0073ccd2fb` | 274 |
| formulas-receipt.json#10 | `30a02274-628e-800e-9bb8-334abd4afcc8` | `5f2adf60` | `4450f64296c88e61` | 275 |
| formulas-receipt.json#11 | `50bdf797-bb42-8016-8d9d-65a3f9d54c75` | `5f2adf60` | `5f8d0d99620ebc7d` | 276 |
| formulas-receipt.json#12 | `e809da3b-8cc7-89af-b887-114f7d305b60` | `5f2adf60` | `45d18fb681106e6b` | 277 |
| formulas-receipt.json#13 | `167a54be-604e-8247-8dd6-a1b290c76b35` | `5f2adf60` | `02e52d0e5fd15a21` | 278 |
| formulas-receipt.json#14 | `56e1c677-ddbf-818d-a98b-d560a751f7b4` | `5f2adf60` | `2714bf6a7a160a32` | 279 |
| formulas-receipt.json#15 | `0314175f-d02c-8151-9929-074b582a22d6` | `5f2adf60` | `6a8ad3b3a9344235` | 280 |
| formulas-receipt.json#16 | `c48ffd1b-c2c0-8553-9962-37963274706f` | `5f2adf60` | `5382e6c45f3d167a` | 281 |
| formulas-receipt.json#17 | `e9fbcacf-3109-81f8-924e-5b9b183d5f62` | `5f2adf60` | `cfae898e8a152c51` | 282 |
| formulas-receipt.json#18 | `6a91fc51-144a-8d11-9118-e8619e60ff70` | `5f2adf60` | `1957a6a221d7dd78` | 283 |
| formulas-receipt.json#19 | `fbae82c7-5e13-81b8-9d82-a09152aad0a5` | `5f2adf60` | `8dfdae6212da76e0` | 284 |
| formulas-receipt.json#20 | `bfc3bd74-26b4-887d-a8ab-f15911e9611e` | `5f2adf60` | `9113a02b3f5793ee` | 285 |
| formulas-receipt.json#21 | `4e7e00c8-6eeb-8cb9-be02-a06cf8c1bcf9` | `5f2adf60` | `caf1a0783f72b0cb` | 286 |
| formulas-receipt.json#22 | `cffcd9b5-11a3-88ca-8b3c-3941db8d0d43` | `5f2adf60` | `c3f7d9ef5ab7f679` | 287 |
| formulas-receipt.json#23 | `2d38dcd0-f927-8402-8683-1439acfab662` | `5f2adf60` | `14fd332c2da3c06e` | 288 |
| formulas-receipt.json#24 | `149ce9d7-c47a-8c9c-97c9-723ffc57eb49` | `5f2adf60` | `b346451102e24243` | 289 |
| formulas-receipt.json#25 | `22727bf1-bac8-82f5-ad90-364243e1128b` | `5f2adf60` | `5b9b75a7bbee084b` | 290 |
| formulas-receipt.json#26 | `5d9c4848-36d0-8000-adf3-9dc0f597a942` | `5f2adf60` | `e92f3c572cc0ca2f` | 291 |
| formulas-receipt.json#27 | `2a4dd0a5-85de-8929-aa57-6d33ce49379f` | `5f2adf60` | `71b96d7e46fb6d81` | 292 |
| formulas-receipt.json#28 | `2d136859-5cc4-8ff8-ae0e-6abaf41ec77c` | `5f2adf60` | `c7ee385f88655f1c` | 293 |
| formulas-receipt.json#29 | `7b1ef0c5-0cd6-83c4-98ed-d33cb56f8cc5` | `5f2adf60` | `9535e25b8284b28d` | 294 |
| formulas-receipt.json#30 | `90f5c917-f32e-8970-817e-3f9e6dee0eeb` | `5f2adf60` | `2519279fd060dae7` | 295 |
| formulas-receipt.json#31 | `aa6904fc-366c-8568-93df-1bdbccd85574` | `5f2adf60` | `59d519703e63fd74` | 296 |
| formulas-receipt.json#32 | `7fe32d87-adfd-88eb-af5f-b46ddd09491c` | `5f2adf60` | `b20295de72ed3dea` | 297 |
| formulas-receipt.json#33 | `6489df59-6752-86a3-9e65-b9ebdbac6c2c` | `5f2adf60` | `c654633000ec41f3` | 298 |
| formulas-receipt.json#34 | `69377344-e426-8399-a393-b395918fa0f7` | `5f2adf60` | `ee3215a0871ec55e` | 299 |
| formulas-receipt.json#35 | `4bec54d9-e362-8586-956c-492c70d8c956` | `5f2adf60` | `7d6607762e81fe4d` | 300 |
| formulas-receipt.json#36 | `d4ec5613-ccd8-8965-8847-4eef36bf7cd5` | `5f2adf60` | `b8834e0eafdf00d1` | 301 |
| formulas-receipt.json#37 | `2382d698-9d34-8af9-aaee-47a3b4e152cf` | `5f2adf60` | `aa2cfb68632c5119` | 302 |
| formulas-receipt.json#38 | `8f3e4b2e-9c72-8272-ab6a-ad648b1aceed` | `5f2adf60` | `8392917421a52db1` | 303 |
| formulas-receipt.json#39 | `3d340567-d21f-8a67-b284-561fb7ee4602` | `5f2adf60` | `6662ca2e44ab30ce` | 304 |
| formulas-receipt.json#40 | `cda8a66d-e31c-89cd-95a0-142e2d4132ec` | `5f2adf60` | `f563e65959af7e4e` | 305 |
| formulas-receipt.json#41 | `988521e1-d2d6-8896-87f9-047b581c49f3` | `5f2adf60` | `92831b82805af163` | 306 |
| formulas-receipt.json#42 | `ea165f53-66f4-8498-bb3b-2796bdd2343d` | `5f2adf60` | `557f5e671bd51404` | 307 |
| formulas-receipt.json#43 | `25ed1bce-046c-8c34-aeee-8b1521f207f6` | `5f2adf60` | `96bf41580bb3e014` | 308 |
| formulas-receipt.json#44 | `a8254e01-7e54-8b8d-b1eb-e491889f182e` | `5f2adf60` | `1081e629ee709212` | 309 |
| formulas-receipt.json#45 | `6c974c01-52d3-8e40-a112-e7e05119162c` | `5f2adf60` | `8f9bf89769e156e0` | 310 |
| formulas-receipt.json#46 | `6cde3e66-c316-8e1b-922a-263a77557e9e` | `5f2adf60` | `c26d82a4db15e6e2` | 311 |
| formulas-receipt.json#47 | `a5ea7ffc-ccab-8b1b-869a-c972a2bc1fe4` | `5f2adf60` | `7589f697a532a331` | 312 |
| formulas-receipt.json#48 | `04d485a1-d717-8f15-b715-ee48973edf00` | `5f2adf60` | `ca69c8b2bfd18768` | 313 |
| formulas-receipt.json#49 | `ae151cf4-2da1-8a01-9aee-fb82b854324f` | `5f2adf60` | `35d178ba5806de3e` | 314 |
| formulas-receipt.json#50 | `3423da0c-affc-862d-ac61-08df63545d16` | `5f2adf60` | `79165b15a85cd1c9` | 315 |
| formulas-receipt.json#51 | `38cb7298-7ae0-8bf9-bb33-f673b59841b8` | `5f2adf60` | `19b9443386db5207` | 316 |
| formulas-receipt.json#52 | `8bfd171b-6f2e-8804-b379-25bff7d1e9e5` | `5f2adf60` | `a5e18eaf7c36d53e` | 317 |
| formulas-receipt.json#53 | `312a2c43-c24d-8fed-8501-0cdadc2f2050` | `5f2adf60` | `4af9d1ed26649ab9` | 318 |
| formulas-receipt.json#54 | `75ca9b48-16b1-8ece-8047-bd7f5766f06b` | `5f2adf60` | `829600c37fb2c3cc` | 319 |
| formulas-receipt.json#55 | `b0097989-89e6-88ca-82f3-0fb20e1ce777` | `5f2adf60` | `6384cd49f6ae7653` | 320 |
| formulas-receipt.json#56 | `8d66eac8-31b9-825f-96d0-0ef8596f3cd6` | `5f2adf60` | `b9182644b90809c4` | 321 |
| formulas-receipt.json#57 | `4684237e-63e0-870b-9884-0277040489a6` | `5f2adf60` | `e1016d184d08867a` | 322 |
| formulas-receipt.json#58 | `4c00f675-d40d-892f-9679-f9fbc84259c2` | `5f2adf60` | `61e5f465150e9fb6` | 323 |
| formulas-receipt.json#59 | `5070fd9a-3a33-83b5-9a51-f5346dddf240` | `5f2adf60` | `0bb30b26a85df1e2` | 324 |
| formulas-receipt.json#60 | `11399815-bdc6-8dd7-82ba-a010adc3008a` | `5f2adf60` | `e856c137149495c1` | 325 |
| formulas-receipt.json#61 | `9adf0a45-d5f7-8446-8ec4-e0c830125cbe` | `5f2adf60` | `577494687c1be17c` | 326 |
| formulas-receipt.json#62 | `02c98291-e40a-8eae-9c5e-8e2577059239` | `5f2adf60` | `06962e72272574ab` | 327 |
| formulas-receipt.json#63 | `0025b625-d4ae-865b-bcb9-8d35da8ff12f` | `5f2adf60` | `56b20f8799d6b7ec` | 328 |
| formulas-receipt.json#64 | `9e851d1a-8e0c-83d8-86bc-f20b9e15fe52` | `5f2adf60` | `9d5eabf51b1d3f15` | 329 |
| formulas-receipt.json#65 | `063859ac-2ba4-85b2-96cc-d03d8ecf0e6e` | `5f2adf60` | `ab940b45add682a2` | 330 |
| formulas-receipt.json#66 | `46c32104-a160-8e13-9f81-7c83ec01424c` | `5f2adf60` | `c1b32a56a930528a` | 331 |
| formulas-receipt.json#67 | `ee879185-08a7-848c-aa6a-318a0158d487` | `5f2adf60` | `2558048ef349fa9d` | 332 |
| formulas-receipt.json#68 | `20f18199-aaad-8a96-8e2d-9120fd5c655c` | `5f2adf60` | `c41a2a719dbe2407` | 333 |
| formulas-receipt.json#69 | `01641cc0-3bec-8e7e-a57e-bc166634ef2b` | `5f2adf60` | `5e9d093b584d1aa5` | 334 |
| formulas-receipt.json#70 | `0cdea27f-a03e-8624-8ffe-f37db5f8ae20` | `5f2adf60` | `f1c0a497d54f22b0` | 335 |
| formulas-receipt.json#71 | `f318433e-0715-8b08-a73d-d68ff84a59c9` | `5f2adf60` | `9c4dbfae16230c90` | 336 |
| formulas-receipt.json#72 | `3dc82513-f144-8c49-a346-2bfee966f0ba` | `5f2adf60` | `d342241f5ab2d9dc` | 337 |
| formulas-receipt.json#73 | `918c4f1b-de82-8c6f-959f-03995b88d2d5` | `5f2adf60` | `1986cdb8d489b44b` | 338 |
| formulas-receipt.json#74 | `4480f370-99a0-821a-9e26-7a2601502d9e` | `5f2adf60` | `9092ba22b6b56870` | 339 |
| formulas-receipt.json#75 | `af30ddd9-4bcf-8249-aea7-5ba84131e1ed` | `5f2adf60` | `6b53d7d27b6d3a5c` | 340 |
| formulas-receipt.json#76 | `6dbd3968-d04c-86f1-acdb-26629f5d8e69` | `5f2adf60` | `8a1eb11de8387202` | 341 |
| formulas-receipt.json#77 | `c07edf99-002c-80a1-9bfe-ea3fa8bb4ae1` | `5f2adf60` | `39ccfe9889225e5b` | 342 |
| formulas-receipt.json#78 | `b0bd9b00-e823-8402-8e65-431bb5839304` | `5f2adf60` | `9116f7ac9d0cd1b4` | 343 |
| fuse-receipt.json | `73b66dcd-1e1c-84f7-a8bd-a5ac349ee5f5` | `ae56ab68` | `1e8c60741e0cdbbe` | 344 |
| heat-receipt.json | `e26e8f1f-a196-8491-8b89-c5c262b13328` | `ae56ab68` | `4fe0429f895f7db7` | 345 |
| heat-receipt.json#0 | `b430890a-8e01-888a-bdb1-ca7246fff298` | `e26e8f1f` | `a2ea20d5ec47d6fb` | 346 |
| heat-receipt.json#1 | `65f82c5e-c10a-872c-9768-51a6b054a1a8` | `e26e8f1f` | `823155902f9e0b06` | 347 |
| heat-receipt.json#2 | `c8adf1f6-6c37-8666-bf7b-56d4e2b41912` | `e26e8f1f` | `bcec9f3722ed4a06` | 348 |
| heat-receipt.json#3 | `81295b04-a85a-8d1f-81a6-16f57ef86d09` | `e26e8f1f` | `475a704ad8699986` | 349 |
| heat-receipt.json#4 | `37c807c9-d7be-8f2f-8040-8318f7e0b482` | `e26e8f1f` | `7a7c9474c1b53873` | 350 |
| heat-receipt.json#5 | `0e88eba5-eb42-81e0-a533-8ded107caf48` | `e26e8f1f` | `c24b53a1650bcafb` | 351 |
| heat-receipt.json#6 | `ab2478c5-bef4-8ebd-a1b5-7916f1839ed0` | `e26e8f1f` | `b0d45c8b1fb7de8e` | 352 |
| heat-receipt.json#7 | `3d50671a-f538-8f1e-8b2d-00398ea6257e` | `e26e8f1f` | `4174b8dec229652a` | 353 |
| heat-receipt.json#8 | `ae23952c-6d65-8c2f-a737-269519508403` | `e26e8f1f` | `59123dc9b7e17427` | 354 |
| heat-receipt.json#9 | `8860989e-ece9-8854-84d8-4034a5f10b1c` | `e26e8f1f` | `d08c403160cb7c9d` | 355 |
| heat-receipt.json#10 | `b0ac7229-899e-85f5-8ad1-92f1f6ba0d03` | `e26e8f1f` | `66d32962a5c0ac72` | 356 |
| heat-receipt.json#11 | `ca69d66d-5d0f-8741-8762-83cc1fa1e3c3` | `e26e8f1f` | `4e964ca7498f146f` | 357 |
| heat-receipt.json#12 | `0d252d60-72c5-8e23-b1e2-d8c463100857` | `e26e8f1f` | `953c383ef4bae49b` | 358 |
| heat-receipt.json#13 | `3dfab2c6-bd67-8a16-b808-28d84dfc0094` | `e26e8f1f` | `3a458ad1b52cd3c7` | 359 |
| heat-receipt.json#14 | `75d7e2be-1df1-87ef-9fb0-422b03a5af9e` | `e26e8f1f` | `b50e541a40930d5b` | 360 |
| heat-receipt.json#15 | `038bdda1-dfab-83de-b2c0-e85c9a7e3dc4` | `e26e8f1f` | `b68206758ce7664e` | 361 |
| heat-receipt.json#16 | `5647b3df-45ca-836f-8e8b-843cfcddb49f` | `e26e8f1f` | `c8d3d8b851b41379` | 362 |
| heat-receipt.json#17 | `ae4d775a-b383-8c52-9c1b-68f658f73802` | `e26e8f1f` | `aaf6f2712a25b1ca` | 363 |
| heat-receipt.json#18 | `6a558934-4546-8f7a-b950-30968acbb990` | `e26e8f1f` | `7bde43a734e23181` | 364 |
| heat-receipt.json#19 | `b8b068bf-3a95-89f0-8aad-6ed4dd024657` | `e26e8f1f` | `48354a4224f8966f` | 365 |
| heat-receipt.json#20 | `7373b861-c62c-8b1f-8bde-f99bc9819115` | `e26e8f1f` | `2d7e511c7a7cf3da` | 366 |
| heat-receipt.json#21 | `7f3e1737-3a05-8ffa-8ef3-afc502136a94` | `e26e8f1f` | `4f387b8f199fb44a` | 367 |
| heat-receipt.json#22 | `41439444-287e-8aa0-9eab-3524f12f57e0` | `e26e8f1f` | `099bf50bb6b8227a` | 368 |
| heat-receipt.json#23 | `3aae1b58-8106-855f-bc14-a6484e3ec208` | `e26e8f1f` | `1683d05bf66c1155` | 369 |
| heat-receipt.json#24 | `d7f02ebe-893a-8f25-99ee-1625fcf49111` | `e26e8f1f` | `f2d79ff9379603c4` | 370 |
| heat-receipt.json#25 | `fa201637-89ed-89d5-80c5-ed74c1326bb1` | `e26e8f1f` | `9d30213f0a50217f` | 371 |
| heat-receipt.json#26 | `e291165f-8e01-83e5-b12d-e4c1633d44ad` | `e26e8f1f` | `3e07dfc3548b2740` | 372 |
| heat-receipt.json#27 | `d85cc981-d168-84b2-bf92-a55a8e20fd49` | `e26e8f1f` | `a7d4fedc982e2b54` | 373 |
| heat-receipt.json#28 | `891c391b-91f3-834f-b79e-30a3b6309c2e` | `e26e8f1f` | `991e5a9e912aee24` | 374 |
| heat-receipt.json#29 | `0d9d42b4-dfcd-825a-b87d-7bcb1e075ab0` | `e26e8f1f` | `93d061239fd53b6b` | 375 |
| heat-receipt.json#30 | `d96fb160-f864-834f-9acf-51614ad3a6eb` | `e26e8f1f` | `838fc11c15c23588` | 376 |
| heat-receipt.json#31 | `24de8590-0f9d-859b-9720-dc3a7444978c` | `e26e8f1f` | `e51b1f3f1170fffd` | 377 |
| heat-receipt.json#32 | `1b4463f5-5b2d-8afb-8f0f-e9b981e8a534` | `e26e8f1f` | `0dff5941f9e50d5f` | 378 |
| heat-receipt.json#33 | `49e015c2-ad1f-8bae-be6a-6a97d898fd15` | `e26e8f1f` | `6b490d2c047e8765` | 379 |
| heat-receipt.json#34 | `a7c9caa5-3c79-818e-a16d-364a5b307bc7` | `e26e8f1f` | `e68fd33f5acdf7e4` | 380 |
| heat-receipt.json#35 | `86d744fd-798d-8a4d-ab53-a1db4f59ab00` | `e26e8f1f` | `49d512f9289536df` | 381 |
| heat-receipt.json#36 | `f698100f-d030-8d8f-ba50-38d1dd41d7ae` | `e26e8f1f` | `aa60725f9ef896d4` | 382 |
| heat-receipt.json#37 | `3e24f51f-0807-8eed-89cc-782846f868ad` | `e26e8f1f` | `fab341b1d3da5f1b` | 383 |
| heat-receipt.json#38 | `0d9370a1-9a7e-8f72-8dfb-bb7c421dbdc8` | `e26e8f1f` | `65af7b69aa21b0e9` | 384 |
| heat-receipt.json#39 | `4c311b93-755d-86d7-be22-99af36b901cb` | `e26e8f1f` | `0a0c00efb61b5f24` | 385 |
| lattice-receipt.json | `06c53b46-20b2-8893-a792-902068ca43f1` | `ae56ab68` | `5c9367f8765423b2` | 386 |
| lean-receipt.json | `df2a5e48-e6c0-8864-a97d-1ef491f0deb9` | `ae56ab68` | `7a63d6ab25d404f4` | 387 |
| lean-receipt.json#0 | `d6d461a7-ff29-8ea0-8958-cbbb86ef1fe4` | `df2a5e48` | `01a4314334920464` | 388 |
| lean-receipt.json#1 | `f317cd0f-2e8f-82b5-b01d-8950314571be` | `df2a5e48` | `17dd686d646c00c4` | 389 |
| lean-receipt.json#2 | `c06ab1d9-c3ea-8c4b-b634-a51493f84de1` | `df2a5e48` | `85559ecfe991db72` | 390 |
| lean-receipt.json#3 | `53384654-4974-8048-8276-f316ce8b39ea` | `df2a5e48` | `0b81c75ca7b9f612` | 391 |
| lean-receipt.json#4 | `dfce4fbb-4ada-83a4-8450-ce6a51fa65f0` | `df2a5e48` | `856c8808576cb0ed` | 392 |
| lean-receipt.json#5 | `e21deda3-a130-8a5f-a298-88e3e60abe12` | `df2a5e48` | `8c42f871b54b87a0` | 393 |
| lean-receipt.json#6 | `1c28aecd-7449-82a6-bb10-fbd1fa14c10d` | `df2a5e48` | `a1bb51780f3b93f2` | 394 |
| lean-receipt.json#7 | `c9287749-898c-86b4-a12d-86e9ac9285a6` | `df2a5e48` | `8c393b1c4570738a` | 395 |
| lean-receipt.json#8 | `01da53e4-899d-8d71-9921-98ce122d2db4` | `df2a5e48` | `8759e151d526b48d` | 396 |
| lean-receipt.json#9 | `ca5e7a51-3a36-8b5b-902d-6357ea65aa8e` | `df2a5e48` | `ba236e62d0f2e667` | 397 |
| lean-receipt.json#10 | `3f69ef7f-0b5e-8f10-8adb-ce8dd58e1458` | `df2a5e48` | `2d3bffa2815b71de` | 398 |
| lean-receipt.json#11 | `54f94869-b6ef-85a8-b658-bf165fd505f5` | `df2a5e48` | `3b823db63b5cf251` | 399 |
| lean-receipt.json#12 | `5dad05dc-4b87-8e29-b5a1-66ce3c467460` | `df2a5e48` | `8198bb405e69ae3d` | 400 |
| lean-receipt.json#13 | `4964930d-e26f-8238-a1c7-5362037765fe` | `df2a5e48` | `fa381a949b4f1709` | 401 |
| lean-receipt.json#14 | `d7b0d49c-4cd2-8eb7-9589-0f896fca8202` | `df2a5e48` | `ccbc114c64b5d7d5` | 402 |
| lean-receipt.json#15 | `f3c510d6-7747-8e7d-888c-7af41dca32f9` | `df2a5e48` | `ca2d842deaaa3417` | 403 |
| lean-receipt.json#16 | `2ee233b9-589b-8d03-9af7-715960c108ce` | `df2a5e48` | `c26db2931600ef72` | 404 |
| lean-receipt.json#17 | `186d1eca-477d-85e6-9996-b4da59485605` | `df2a5e48` | `f1d614a5647be442` | 405 |
| lean-receipt.json#18 | `f01be46d-2d10-807c-97b3-80e6588b9fd7` | `df2a5e48` | `20b0af073db0d784` | 406 |
| lean-receipt.json#19 | `9ea93275-2750-8870-be49-1a4b5546c72d` | `df2a5e48` | `661bd8788a9d8fec` | 407 |
| lean-receipt.json#20 | `76180c65-26e1-87e5-a97f-393223eb0714` | `df2a5e48` | `8ae5bda61686e5fe` | 408 |
| lean-receipt.json#21 | `485003d2-43d6-8691-a2ea-56176828b8a2` | `df2a5e48` | `0173e958093f571c` | 409 |
| lean-receipt.json#22 | `ba81aa39-d451-894b-99d2-3aeea5c93886` | `df2a5e48` | `dc9170336312cfdd` | 410 |
| lean-receipt.json#23 | `25e65ae5-2346-8ffe-b1c6-16d7e9b6ac55` | `df2a5e48` | `a928836e949a3b08` | 411 |
| lean-receipt.json#24 | `4b3e34f7-815e-8f5c-b0a5-30a0a0550d07` | `df2a5e48` | `892beb0c6c10c5d8` | 412 |
| lean-receipt.json#25 | `0563b3a6-47f9-8b0b-a66b-38362e95e348` | `df2a5e48` | `54b1ada5511adb73` | 413 |
| lean-receipt.json#26 | `c3d7cc34-c110-8f9f-a462-f083f9d81101` | `df2a5e48` | `ac8eef3ad8936c18` | 414 |
| lean-receipt.json#27 | `89d5cc60-4ef1-874a-ba7a-e5698ac79d59` | `df2a5e48` | `7256c466c3448c3f` | 415 |
| lean-receipt.json#28 | `a2da598d-c5d6-8144-a95f-047bfcd63949` | `df2a5e48` | `783f0872ec919aeb` | 416 |
| lean-receipt.json#29 | `0982d2f5-d24a-872b-80ba-5195ca1958d0` | `df2a5e48` | `c2625317519e7ea0` | 417 |
| lean-receipt.json#30 | `b7db3475-9467-8dd5-9340-542895792645` | `df2a5e48` | `b828aefe631f023f` | 418 |
| lean-receipt.json#31 | `c1a5ae70-c83d-85b2-9953-9e8733b03097` | `df2a5e48` | `28c97dc8c98c1353` | 419 |
| lean-receipt.json#32 | `e17ddde9-1c3a-8fa5-97be-a47508da2da3` | `df2a5e48` | `a50a453d176456ba` | 420 |
| lean-receipt.json#33 | `8b06e40a-8d06-8ec7-85d5-0302e58153b8` | `df2a5e48` | `e9987eb5bb747c92` | 421 |
| lean-receipt.json#34 | `0ce66b34-a677-834c-a47c-765022992958` | `df2a5e48` | `d96c3e86ca8300bb` | 422 |
| lean-receipt.json#35 | `4bb21feb-24f4-81eb-b52d-5cb01ff576de` | `df2a5e48` | `026803944de9f8fb` | 423 |
| lean-receipt.json#36 | `e9dc99f2-4726-8844-8fca-c9476aa6d071` | `df2a5e48` | `9493a574bb66c834` | 424 |
| lean-receipt.json#37 | `3ffa0121-6a79-82ca-b8ac-e0a8f6a15d86` | `df2a5e48` | `e49607ea34f2e643` | 425 |
| lean-receipt.json#38 | `c520368a-fdb3-8b9b-b1ef-96ea379ba4fb` | `df2a5e48` | `3a9d0303d541d513` | 426 |
| lean-receipt.json#39 | `79597c9a-82ca-85a4-8bc0-0bef60cefe66` | `df2a5e48` | `850461c1588ef998` | 427 |
| lean-receipt.json#40 | `c85873ff-fcee-8beb-963c-a7477748cedc` | `df2a5e48` | `54ced7ee08c43b01` | 428 |
| lean-receipt.json#41 | `3431cf4e-6ed5-8e43-acc0-08364bffb595` | `df2a5e48` | `883120543a46eeba` | 429 |
| lean-receipt.json#42 | `d855ee66-6668-8123-930f-b83ea59915aa` | `df2a5e48` | `3ab0cd25a6b5a51c` | 430 |
| lean-receipt.json#43 | `92d1f8d6-1237-859b-ba10-564922583329` | `df2a5e48` | `f9b7bcab6eb1f2ec` | 431 |
| lean-receipt.json#44 | `591253d4-1512-85c5-811d-c20943ea36b1` | `df2a5e48` | `ba26eb0385ad4049` | 432 |
| lean-receipt.json#45 | `becc4fd1-a64f-8100-adfa-6b572844d239` | `df2a5e48` | `cdfdeaec366d59a9` | 433 |
| lean-receipt.json#46 | `bf1f93a6-0bf0-8bb8-adee-f76adf97da0c` | `df2a5e48` | `a3f34c2b09cbdc81` | 434 |
| lean-receipt.json#47 | `6ec1f5ad-0cf4-8362-b170-e5e18bd64785` | `df2a5e48` | `fa828c0c9002434a` | 435 |
| lean-receipt.json#48 | `b4cd21a0-f822-80a9-8962-e16288844bb3` | `df2a5e48` | `390ee6112bc84229` | 436 |
| lean-receipt.json#49 | `cc86d262-d935-8eb6-8c46-77fa48cbf247` | `df2a5e48` | `14e7224d07b82fe5` | 437 |
| lean-receipt.json#50 | `f06e1426-13ea-8370-8b52-2c7303bdd05d` | `df2a5e48` | `a26d61f94731765b` | 438 |
| lean-receipt.json#51 | `39f1ad55-6c8f-85d3-bfb6-c108de2f1330` | `df2a5e48` | `0606ba04128bc864` | 439 |
| lean-receipt.json#52 | `4142e839-63b6-83ef-bbe2-8157dcb85162` | `df2a5e48` | `d8fe7dee19a9eca9` | 440 |
| lean-receipt.json#53 | `fd15d424-ad78-8cfe-8b7a-723c16be80ab` | `df2a5e48` | `5e9815aaca739805` | 441 |
| lean-receipt.json#54 | `58130ece-ba98-87ef-8dc1-b9733fc3d7e2` | `df2a5e48` | `fca5ef45f516834b` | 442 |
| lean-receipt.json#55 | `d6613d3e-36d4-8c4f-ba39-a6a6e248aeb9` | `df2a5e48` | `4e0f8d28c2a80cb1` | 443 |
| lean-receipt.json#56 | `8c62d970-94a4-8bbc-9771-08ae2a17c559` | `df2a5e48` | `bddfe267a640156c` | 444 |
| lean-receipt.json#57 | `11fe8b6f-3fb6-8549-b5f3-9819563633aa` | `df2a5e48` | `aaca8fa141b1b164` | 445 |
| lean-receipt.json#58 | `4b0b781b-ccc0-8301-8a00-1fdbee81942f` | `df2a5e48` | `de9c1d0eb319845f` | 446 |
| lean-receipt.json#59 | `49a2766b-79a1-8eb4-99b2-97e585ca2519` | `df2a5e48` | `5ad4efe87055dad6` | 447 |
| lean-receipt.json#60 | `baaf8e27-e635-8f08-93d8-46f66e4948b6` | `df2a5e48` | `21f8222a910896f8` | 448 |
| lean-receipt.json#61 | `ca6a283a-ee69-8ec7-9b0b-cb1006c0850e` | `df2a5e48` | `9ab521ab8bfd2c30` | 449 |
| lean-receipt.json#62 | `b93130c6-8421-803e-8385-bba47b40fc48` | `df2a5e48` | `97f276540373c55c` | 450 |
| lean-receipt.json#63 | `7a4a3c58-4f37-8814-9e97-438c31dd4872` | `df2a5e48` | `433fae11c15a3406` | 451 |
| lean-receipt.json#64 | `86a00011-5c21-8817-8f80-cfcb80259f3c` | `df2a5e48` | `99f6f1bba698c440` | 452 |
| lean-receipt.json#65 | `c67de806-006f-830a-ae6d-7c52bdce4805` | `df2a5e48` | `9f74c15228e068ae` | 453 |
| lean-receipt.json#66 | `586efa28-cc82-897a-ba70-109ca3b7a288` | `df2a5e48` | `50d88d048369584c` | 454 |
| lean-receipt.json#67 | `8b8be02f-8104-8a41-b4b7-8a3679f600ec` | `df2a5e48` | `89f9254372ae56a4` | 455 |
| lean-receipt.json#68 | `998f6e9e-99fc-827f-accb-3773bc733e56` | `df2a5e48` | `019312acb7ec2b4b` | 456 |
| lean-receipt.json#69 | `5e9cbd57-b2d4-80df-956a-23e5e6264391` | `df2a5e48` | `09fe6367b5d53bf0` | 457 |
| lean-receipt.json#70 | `02f95f60-7730-80c7-bb8a-81c9fb97f79e` | `df2a5e48` | `228f135985843f8b` | 458 |
| lean-receipt.json#71 | `5dc4917b-9d96-8385-9c3a-8d1203935480` | `df2a5e48` | `43d4a9af3eae5238` | 459 |
| lean-receipt.json#72 | `3313c274-196f-81cd-ba21-45ee358adab2` | `df2a5e48` | `c48f727b686daaaa` | 460 |
| lean-receipt.json#73 | `e5ce307c-1c42-89f0-8a2c-9809118f55a8` | `df2a5e48` | `e948e238756c4b88` | 461 |
| lean-receipt.json#74 | `2c29e531-e2ec-846a-854f-379b220248d0` | `df2a5e48` | `97efe68b81d61976` | 462 |
| lean-receipt.json#75 | `5e18919f-5b49-825c-b42c-9e74f2fe2ffb` | `df2a5e48` | `9bff2b6d5fc53087` | 463 |
| lean-receipt.json#76 | `00f2699f-2ac4-8c96-a0fb-63414539d2e9` | `df2a5e48` | `f7c370cf81952879` | 464 |
| lean-receipt.json#77 | `9eaec6c8-a61a-8d32-b07b-e46217e6687b` | `df2a5e48` | `d3ac9515015a7683` | 465 |
| lean-receipt.json#78 | `8c831950-f8ca-85ed-982c-23ec9b6fde15` | `df2a5e48` | `e39144dd650da2d3` | 466 |
| lean-receipt.json#79 | `d7c8f3cc-31cc-8910-8484-4434460ea64f` | `df2a5e48` | `13aa26d4330f37b7` | 467 |
| lean-receipt.json#80 | `ed519e42-096d-830c-886e-1f3944535063` | `df2a5e48` | `6fd3a89255a92ed8` | 468 |
| lean-receipt.json#81 | `6bb03a88-b217-87bf-8076-2b63d8e332ec` | `df2a5e48` | `2150be74f267d805` | 469 |
| lean-receipt.json#82 | `5b86cc94-7f19-80f2-85cb-6cf9ea3362a9` | `df2a5e48` | `ca40f3358e8ba4a4` | 470 |
| lean-receipt.json#83 | `b49da70f-1272-886c-b979-077004486699` | `df2a5e48` | `cd77c6f87b5b1064` | 471 |
| lean-receipt.json#84 | `a778b7fa-c1ba-8917-993e-5b02a5e50e6d` | `df2a5e48` | `7013fccd8490dad7` | 472 |
| lean-receipt.json#85 | `5e7dacbc-6ccb-8bf0-8416-f3b9ad1390b5` | `df2a5e48` | `7502a7db02d5a467` | 473 |
| lean-receipt.json#86 | `37cd5862-1c14-85e9-beeb-6416dfe40f15` | `df2a5e48` | `d8ed6351f82dc020` | 474 |
| lean-receipt.json#87 | `60ef0493-fa48-8fa8-b217-b6baabcd8bca` | `df2a5e48` | `87ad43e6d9e74af4` | 475 |
| lean-receipt.json#88 | `f17f37a9-95fb-83f1-856f-9cd5809e5944` | `df2a5e48` | `29a1ce5eccc794cd` | 476 |
| lean-receipt.json#89 | `4a8b4ab3-76f4-89c8-8ced-b61f9e3bc829` | `df2a5e48` | `917a754ef7ded231` | 477 |
| lean-receipt.json#90 | `4effb9a2-d07f-8dfc-8567-cce1afaed460` | `df2a5e48` | `2ddbc9e72c5863a3` | 478 |
| lean-receipt.json#91 | `100f323a-935d-8647-a6bf-2f296e3e254e` | `df2a5e48` | `19e70810b6c0569e` | 479 |
| lean-receipt.json#92 | `f77ec3ce-d84e-8dfb-a43a-300dc44eb6b4` | `df2a5e48` | `ab2dc0ed36085aae` | 480 |
| lean-receipt.json#93 | `45c1df58-105a-84c0-a2d2-f9300ea65566` | `df2a5e48` | `6b6a512c4de306e7` | 481 |
| lean-receipt.json#94 | `a8d6155e-2b62-809c-8e7b-e031b438b6f2` | `df2a5e48` | `8cc93ec2a2c3b4c1` | 482 |
| lean-receipt.json#95 | `bb90c974-d37d-8097-a7a4-58a9968905d5` | `df2a5e48` | `4da17eb3cca04d6f` | 483 |
| lean-receipt.json#96 | `0d384b3e-abd9-8241-8e37-a26ad5a023e2` | `df2a5e48` | `cca2e313bbad6348` | 484 |
| lean-receipt.json#97 | `45b553d6-4ffe-8714-812f-fb2c6370144f` | `df2a5e48` | `178311578707a3d9` | 485 |
| lean-receipt.json#98 | `8ad35aa0-fce5-8aa7-87a7-815204e4b28d` | `df2a5e48` | `d6aad521dd3822c7` | 486 |
| lean-receipt.json#99 | `38e96be8-34ad-8806-a459-a8cf31bbcd53` | `df2a5e48` | `a558c1105bcf6999` | 487 |
| lean-receipt.json#100 | `ff292077-7746-836c-a0ed-aaf6610e4568` | `df2a5e48` | `7002d9a2943b4233` | 488 |
| lean-receipt.json#101 | `cd6ae03a-692f-8ee9-b035-9804c0a900d0` | `df2a5e48` | `af05078facef6371` | 489 |
| lean-receipt.json#102 | `dbd4b516-37b5-865c-8e27-fe211b527d45` | `df2a5e48` | `d440e12709b21f65` | 490 |
| lean-receipt.json#103 | `057848eb-24da-80d3-9d07-dea8d4cafd54` | `df2a5e48` | `4a5dc765b0ae881a` | 491 |
| lean-receipt.json#104 | `045881b0-e6d3-857d-9aed-2820c792af3a` | `df2a5e48` | `6e33961b381f1b24` | 492 |
| lean-receipt.json#105 | `1159235a-d6f1-86b0-b25b-4e8cd48020bf` | `df2a5e48` | `8995d8a066b7efef` | 493 |
| lean-receipt.json#106 | `b509f363-8efc-8fe9-9e08-564673dfc541` | `df2a5e48` | `ee05cc004c566b7d` | 494 |
| lean-receipt.json#107 | `a2bc38f3-fe45-8016-86bf-66763008ab29` | `df2a5e48` | `4a5f92880000ec12` | 495 |
| lean-receipt.json#108 | `45b58278-ce8c-8acd-ac38-e39a02d73792` | `df2a5e48` | `673fccabf7917e43` | 496 |
| lean-receipt.json#109 | `1446a5ec-537e-84a1-b33f-8f59f3caf48f` | `df2a5e48` | `7e721ac4c1f5636e` | 497 |
| lean-receipt.json#110 | `894e455f-e5e0-82cd-8b8c-8f95ce713994` | `df2a5e48` | `5104b1b5d221fe0c` | 498 |
| lean-receipt.json#111 | `53ca76e3-8ad4-8f2d-8eee-4de476b48c72` | `df2a5e48` | `a53e2a3165bc2079` | 499 |
| lean-receipt.json#112 | `8035ac46-7fb8-8267-9a62-58f21a1ddf50` | `df2a5e48` | `ac11551381559b5d` | 500 |
| lean-receipt.json#113 | `ef2413ac-47b1-8d0e-8896-2a9c59ebc4e0` | `df2a5e48` | `1e76aaa529c1faf4` | 501 |
| lean-receipt.json#114 | `04e5fdbb-a107-8648-aedb-00b4f659c8cb` | `df2a5e48` | `6650de8fa69d0055` | 502 |
| lean-receipt.json#115 | `7377391d-05f7-8741-a811-142798f51e59` | `df2a5e48` | `45ffdc938f29d266` | 503 |
| lean-receipt.json#116 | `33ad518f-59c5-8ede-a182-d7d667bdbabf` | `df2a5e48` | `29720f16131d7884` | 504 |
| lean-receipt.json#117 | `6034cc20-165d-8ca9-8b92-7e55d897a546` | `df2a5e48` | `8f9e22c7e2bea6c9` | 505 |
| lean-receipt.json#118 | `0ba5819b-5392-8074-8a8b-c87d01266fb4` | `df2a5e48` | `f9363e39d4b6cfec` | 506 |
| lean-receipt.json#119 | `855010a4-30ab-8073-ad4a-940390910cf5` | `df2a5e48` | `123fa2b2b6e380b2` | 507 |
| lean-receipt.json#120 | `1b48bf3b-2daf-822c-a43a-7f32f14c84c1` | `df2a5e48` | `df00ee1dd773d8f2` | 508 |
| lean-receipt.json#121 | `ce8320b7-4cb5-877c-b9c3-6c0a1ebbfebd` | `df2a5e48` | `20f85f44fda02861` | 509 |
| lean-receipt.json#122 | `25432579-590f-8123-9382-2c62805af236` | `df2a5e48` | `040743c9cee1336f` | 510 |
| lean-receipt.json#123 | `2a96490e-b55b-8a1d-8fc6-94e486491aa0` | `df2a5e48` | `bfa20fd6cf759420` | 511 |
| payload-cf-receipt.json | `713b8b68-d416-8eff-a886-633537b519f6` | `ae56ab68` | `f62f0aaf7ff26014` | 512 |
| percall-receipt.json | `dc13645e-f408-8fb3-ab76-989b051f59be` | `ae56ab68` | `bb48a531ebc72170` | 513 |
| refusals-receipt.json | `5d3a7b29-8c62-83c7-afac-f2c29947cf9a` | `ae56ab68` | `8c5570077f4d6204` | 514 |
| test-receipt.json | `f88c08bb-6586-8646-993b-b3af288cbc3d` | `ae56ab68` | `4a5cfb5ecff89ea1` | 515 |
| test-receipt.json#0 | `21bbe036-4b55-8f3f-b951-81138aa2b89b` | `f88c08bb` | `9a01ace6de6b54ec` | 516 |
| test-receipt.json#1 | `d4006356-1fa3-87cb-b8b7-533309550a91` | `f88c08bb` | `a13d744057ec9cc2` | 517 |
| test-receipt.json#2 | `c65cb64a-d980-8384-9f8e-7ed38fc0c73f` | `f88c08bb` | `bbd68eebc2fb3df3` | 518 |
| test-receipt.json#3 | `f164744f-de2c-8d6f-921b-a0b42f4ed36b` | `f88c08bb` | `e739f4896d14e203` | 519 |
| test-receipt.json#4 | `c77dd5dc-d1a5-84d1-ba0d-e7dfcac534ff` | `f88c08bb` | `7d78476f346361f5` | 520 |
| test-receipt.json#5 | `f92dd0f4-ae07-8e64-aac1-283c2ee29736` | `f88c08bb` | `3120a62df82699eb` | 521 |
| test-receipt.json#6 | `96f0f7ae-cb4b-8acf-8330-8186e64e60c4` | `f88c08bb` | `e603dbc8c5889a16` | 522 |
| test-receipt.json#7 | `5ab15940-1bf0-8a15-87a0-afe9a20b286d` | `f88c08bb` | `09c5ebed7bd28d13` | 523 |
| test-receipt.json#8 | `0399ab5e-b3cb-8031-b503-4beb195f3ae4` | `f88c08bb` | `987476006a69a566` | 524 |
| test-receipt.json#9 | `2a7c073a-afba-8cfa-a8f5-158d5cc927fb` | `f88c08bb` | `5d554129661dae60` | 525 |
| test-receipt.json#10 | `03d9edbf-f109-80ee-908c-98fa21004d80` | `f88c08bb` | `c25f540b1357461f` | 526 |
| walls-receipt.json | `6b52214f-a743-8052-a8f1-20fd3d21f0e6` | `ae56ab68` | `46393a1f4c0937d6` | 527 |
| readme | `149af883-c261-8986-9f01-268b94c88c04` | `ae56ab68` | `6c81e06a5de7294f` | 528 |

</details>

Regenerate with `npm run readme` after `npm run build` and the receipt-producing runs; `node scripts/generate-readme.mjs --check`
compares. Documentation: [docs/README.md](docs/README.md). License: CC-BY-NC-ND-4.0.
