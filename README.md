# UUIDNA QPU

An exact quantum processing unit served over MCP at https://qpu.uuidna.com, with its site, admin and API on the
same host. Reads need no auth; storage writes need a Bearer token. Use it as an MCP server (`{ "qpu": { "type": "http",
"url": "https://qpu.uuidna.com/mcp" } }`), as a package (`npm install @uuidna/qpu`), or as a container.

| Capability | How much | Compared with |
|---|---|---|
| MCP door (https://qpu.uuidna.com/mcp) | 16 listed tools; through any of them 51 doors and 108 formulas (`{ doors: true }`, `{ door }`, `{ hex }`, `{ errors: true }`) | the Model Context Protocol: `tools/list` sealed by the Lean theorem agents_mcp_tools |
| Formal proof | 124 Lean theorems served, 124 recomputed in TypeScript | the Lean 4 kernel (leanprover/lean4:v4.33.0) |
| Formula families | 15 families run as hex-program UUIDs (RFC 9562 v8); 10,924 programs in the last discovery | each other: 162 values reached by two or more families, 7 seals (fixed points, involutions) |
| Live public data | 35 of 45 sources agree | CERN Open Data, NIST CODATA, OEIS (8 formulas identified as sequences), Zenodo, DataCite, ORCID, GitHub, npm, INSPIRE catalogues |
| Public APIs | 2,529 of 2,529 APIs walked live, 123,136 methods, 438,299 cross formulas | the APIs.guru registry, against the Lean theorem fuse |
| Cross formulas | 78 of 79 rows hold across 37 formulas | their own hex programs (36 agree) |
| Cryptography | 27/27 attacks resisted, no node:crypto | Node's crypto (parity), its own attacks |
| Live cross-proof | 27 of 30 claims agree | the hosts the claims name |
| Payload on Cloudflare | 98,304 combinations generated; the site is one Worker | Payload's documented plugins and adapters |
| Code heat | 314 of 328 files cold, 14 hot | Qpu.Physics: photon / thermal T |

Cite: Rouschev, Tsvetan. "qpu." doi:[10.5281/zenodo.23091364](https://doi.org/10.5281/zenodo.23091364). License: CC-BY-NC-ND-4.0
(commercial use by license: https://qpu.uuidna.com/license).

**Final build receipt** `805d0954-50af-8a20-8d19-a30dcf1b3b6d`

| | |
|---|---|
| version | 1.0.0 |
| commit | `160946266484515506574db2c15677ec8e85f340` (working tree differed from this commit) |
| receipts | 14 files, 530 nodes |
| build stream | length 530, head `805d0954-50af-8a20-8d19-a30dcf1b3b6d`, chain `2ae9871977193b3097af90ca9011abfb58ff80b8ca3e95d5b4d1101196f506ec`, holds **true** |

## What QPU does

An exact quantum processing unit served over MCP at https://qpu.uuidna.com: integer state vectors, Lean-checked theorems,
formula families addressed by hex-program UUIDs, quantum receipts, its own cryptography, and live checks against public
data. Each wing reports itself:

| Wing | Capabilities | With an evidence predicate | Predicates that hold now | Live (need the network; checked by the live doors) |
|---|---:|---:|---:|---:|
| [Lattice & arithmetic](https://qpu.uuidna.com/lattice) | 9 | 7 | 7 | 0 |
| [Quantum computation](https://qpu.uuidna.com/quantum) | 17 | 17 | 14 | 3 |
| [Formal proof (Lean)](https://qpu.uuidna.com/proof) | 12 | 4 | 4 | 0 |
| [Cryptography](https://qpu.uuidna.com/crypto) | 3 | 2 | 2 | 0 |
| [UUIDs & quantum receipts](https://qpu.uuidna.com/receipts) | 40 | 17 | 15 | 0 |
| [Storage & database](https://qpu.uuidna.com/storage) | 25 | 10 | 6 | 0 |
| [MCP & agents](https://qpu.uuidna.com/agents) | 90 | 54 | 45 | 2 |
| [Live science data](https://qpu.uuidna.com/science) | 22 | 17 | 10 | 7 |
| [API fusion](https://qpu.uuidna.com/fusion) | 17 | 8 | 2 | 3 |
| [Payload & Cloudflare](https://qpu.uuidna.com/cms) | 15 | 4 | 3 | 0 |
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
  nf13854d7["root<br/><code>f13854d7</code>"]
  n59bee0cd["cross-receipt.json<br/><code>59bee0cd</code>"]
  nf2dc32fb["cross-receipt.json#0<br/><code>f2dc32fb</code>"]
  n32c087d2["cross-receipt.json#1<br/><code>32c087d2</code>"]
  ne4689a5b["cross-receipt.json#2<br/><code>e4689a5b</code>"]
  n9f2522f0["cross-receipt.json#3<br/><code>9f2522f0</code>"]
  n8cb99c5b["cross-receipt.json#4<br/><code>8cb99c5b</code>"]
  nd9eef1f8["cross-receipt.json#5<br/><code>d9eef1f8</code>"]
  nabbecdb9["cross-receipt.json#6<br/><code>abbecdb9</code>"]
  nea42af2f["cross-receipt.json#7<br/><code>ea42af2f</code>"]
  n47600a8d["cross-receipt.json#8<br/><code>47600a8d</code>"]
  n6cd918da["cross-receipt.json#9<br/><code>6cd918da</code>"]
  n9b91d2b2["cross-receipt.json#10<br/><code>9b91d2b2</code>"]
  nf0392383["cross-receipt.json#11<br/><code>f0392383</code>"]
  n7a1eaa4d["cross-receipt.json#12<br/><code>7a1eaa4d</code>"]
  ne98e956a["cross-receipt.json#13<br/><code>e98e956a</code>"]
  n5d6620d2["cross-receipt.json#14<br/><code>5d6620d2</code>"]
  n42715b1a["cross-receipt.json#15<br/><code>42715b1a</code>"]
  n915c3ae8["cross-receipt.json#16<br/><code>915c3ae8</code>"]
  n18885b4e["cross-receipt.json#17<br/><code>18885b4e</code>"]
  ne4d9898b["cross-receipt.json#18<br/><code>e4d9898b</code>"]
  nab87c6d4["cross-receipt.json#19<br/><code>ab87c6d4</code>"]
  nd3a8bee5["cross-receipt.json#20<br/><code>d3a8bee5</code>"]
  n46bda07b["cross-receipt.json#21<br/><code>46bda07b</code>"]
  ndc3cfbc3["cross-receipt.json#22<br/><code>dc3cfbc3</code>"]
  ne7a8c287["cross-receipt.json#23<br/><code>e7a8c287</code>"]
  n80231bb2["cross-receipt.json#24<br/><code>80231bb2</code>"]
  nda1eb480["cross-receipt.json#25<br/><code>da1eb480</code>"]
  neafe931b["cross-receipt.json#26<br/><code>eafe931b</code>"]
  n04f4bd05["cross-receipt.json#27<br/><code>04f4bd05</code>"]
  n9ec5157a["cross-receipt.json#28<br/><code>9ec5157a</code>"]
  n0fe61f25["cross-receipt.json#29<br/><code>0fe61f25</code>"]
  n17a095c0["debts-receipt.json<br/><code>17a095c0</code>"]
  nafe9c9d4["discovery-receipt.json<br/><code>afe9c9d4</code>"]
  ndd795f53["discovery-receipt.json#0<br/><code>dd795f53</code>"]
  n4bc51e81["discovery-receipt.json#1<br/><code>4bc51e81</code>"]
  n9e823b8c["discovery-receipt.json#2<br/><code>9e823b8c</code>"]
  n574083d4["discovery-receipt.json#3<br/><code>574083d4</code>"]
  nbcf05d08["discovery-receipt.json#4<br/><code>bcf05d08</code>"]
  n1e19b2b1["discovery-receipt.json#5<br/><code>1e19b2b1</code>"]
  n6d69999d["discovery-receipt.json#6<br/><code>6d69999d</code>"]
  n32dd158f["discovery-receipt.json#7<br/><code>32dd158f</code>"]
  nc5451838["discovery-receipt.json#8<br/><code>c5451838</code>"]
  n850d7f85["discovery-receipt.json#9<br/><code>850d7f85</code>"]
  n0a10684d["discovery-receipt.json#10<br/><code>0a10684d</code>"]
  n6755532d["discovery-receipt.json#11<br/><code>6755532d</code>"]
  n5012b47a["discovery-receipt.json#12<br/><code>5012b47a</code>"]
  n5573e778["discovery-receipt.json#13<br/><code>5573e778</code>"]
  ne6ab87cb["discovery-receipt.json#14<br/><code>e6ab87cb</code>"]
  n5bf04361["discovery-receipt.json#15<br/><code>5bf04361</code>"]
  nb2790d94["discovery-receipt.json#16<br/><code>b2790d94</code>"]
  nf4f7bc21["discovery-receipt.json#17<br/><code>f4f7bc21</code>"]
  n12a588bc["discovery-receipt.json#18<br/><code>12a588bc</code>"]
  n42ecad09["discovery-receipt.json#19<br/><code>42ecad09</code>"]
  n484d6ce5["discovery-receipt.json#20<br/><code>484d6ce5</code>"]
  n4fe4ac3f["discovery-receipt.json#21<br/><code>4fe4ac3f</code>"]
  ned0c6841["discovery-receipt.json#22<br/><code>ed0c6841</code>"]
  n89868020["discovery-receipt.json#23<br/><code>89868020</code>"]
  nb1b493b5["discovery-receipt.json#24<br/><code>b1b493b5</code>"]
  n3309e13c["discovery-receipt.json#25<br/><code>3309e13c</code>"]
  n3dacc227["discovery-receipt.json#26<br/><code>3dacc227</code>"]
  n792cfc02["discovery-receipt.json#27<br/><code>792cfc02</code>"]
  nedaf7bff["discovery-receipt.json#28<br/><code>edaf7bff</code>"]
  na57210f4["discovery-receipt.json#29<br/><code>a57210f4</code>"]
  n829d27be["discovery-receipt.json#30<br/><code>829d27be</code>"]
  n7a7cf064["discovery-receipt.json#31<br/><code>7a7cf064</code>"]
  n360e8a9c["discovery-receipt.json#32<br/><code>360e8a9c</code>"]
  n5f995c32["discovery-receipt.json#33<br/><code>5f995c32</code>"]
  n282eb83a["discovery-receipt.json#34<br/><code>282eb83a</code>"]
  n09ade90e["discovery-receipt.json#35<br/><code>09ade90e</code>"]
  ncc687e45["discovery-receipt.json#36<br/><code>cc687e45</code>"]
  ne2d90249["discovery-receipt.json#37<br/><code>e2d90249</code>"]
  nc4926d91["discovery-receipt.json#38<br/><code>c4926d91</code>"]
  n969ef9fe["discovery-receipt.json#39<br/><code>969ef9fe</code>"]
  nd16d6333["discovery-receipt.json#40<br/><code>d16d6333</code>"]
  nd8dea17b["discovery-receipt.json#41<br/><code>d8dea17b</code>"]
  ndacbf7f3["discovery-receipt.json#42<br/><code>dacbf7f3</code>"]
  n0a979d4c["discovery-receipt.json#43<br/><code>0a979d4c</code>"]
  nda0d78c9["discovery-receipt.json#44<br/><code>da0d78c9</code>"]
  n24468a1e["discovery-receipt.json#45<br/><code>24468a1e</code>"]
  n8c75cd1b["discovery-receipt.json#46<br/><code>8c75cd1b</code>"]
  nff71bfb6["discovery-receipt.json#47<br/><code>ff71bfb6</code>"]
  n6a8e7d99["discovery-receipt.json#48<br/><code>6a8e7d99</code>"]
  na30a6dc1["discovery-receipt.json#49<br/><code>a30a6dc1</code>"]
  n1b12d9b9["discovery-receipt.json#50<br/><code>1b12d9b9</code>"]
  n2f8d9069["discovery-receipt.json#51<br/><code>2f8d9069</code>"]
  nbf35dfef["discovery-receipt.json#52<br/><code>bf35dfef</code>"]
  nf649fde7["discovery-receipt.json#53<br/><code>f649fde7</code>"]
  n7fa13309["discovery-receipt.json#54<br/><code>7fa13309</code>"]
  nb22974ca["discovery-receipt.json#55<br/><code>b22974ca</code>"]
  ncd23cb69["discovery-receipt.json#56<br/><code>cd23cb69</code>"]
  n6a1ba18a["discovery-receipt.json#57<br/><code>6a1ba18a</code>"]
  n925ce825["discovery-receipt.json#58<br/><code>925ce825</code>"]
  n18215640["discovery-receipt.json#59<br/><code>18215640</code>"]
  na0e640e6["discovery-receipt.json#60<br/><code>a0e640e6</code>"]
  n3110c5b6["discovery-receipt.json#61<br/><code>3110c5b6</code>"]
  nd2164923["discovery-receipt.json#62<br/><code>d2164923</code>"]
  na901f8a9["discovery-receipt.json#63<br/><code>a901f8a9</code>"]
  n1b39f28e["discovery-receipt.json#64<br/><code>1b39f28e</code>"]
  nc87970d2["discovery-receipt.json#65<br/><code>c87970d2</code>"]
  n7ab4e4ff["discovery-receipt.json#66<br/><code>7ab4e4ff</code>"]
  n60dd185f["discovery-receipt.json#67<br/><code>60dd185f</code>"]
  n82032d05["discovery-receipt.json#68<br/><code>82032d05</code>"]
  n0bcd42ae["discovery-receipt.json#69<br/><code>0bcd42ae</code>"]
  na447cbaf["discovery-receipt.json#70<br/><code>a447cbaf</code>"]
  n4409fea6["discovery-receipt.json#71<br/><code>4409fea6</code>"]
  nb45bc68c["discovery-receipt.json#72<br/><code>b45bc68c</code>"]
  n4554b694["discovery-receipt.json#73<br/><code>4554b694</code>"]
  n4066b873["discovery-receipt.json#74<br/><code>4066b873</code>"]
  ncb594885["discovery-receipt.json#75<br/><code>cb594885</code>"]
  n56427665["discovery-receipt.json#76<br/><code>56427665</code>"]
  n3a2c568f["discovery-receipt.json#77<br/><code>3a2c568f</code>"]
  na14323c6["discovery-receipt.json#78<br/><code>a14323c6</code>"]
  nf01ba095["discovery-receipt.json#79<br/><code>f01ba095</code>"]
  n880fa236["discovery-receipt.json#80<br/><code>880fa236</code>"]
  n16f8699c["discovery-receipt.json#81<br/><code>16f8699c</code>"]
  n8b4c9531["discovery-receipt.json#82<br/><code>8b4c9531</code>"]
  nc8d49a0e["discovery-receipt.json#83<br/><code>c8d49a0e</code>"]
  n26f88300["discovery-receipt.json#84<br/><code>26f88300</code>"]
  naf0c2829["discovery-receipt.json#85<br/><code>af0c2829</code>"]
  n6ca40ad3["discovery-receipt.json#86<br/><code>6ca40ad3</code>"]
  n04664ab7["discovery-receipt.json#87<br/><code>04664ab7</code>"]
  nfd711c8a["discovery-receipt.json#88<br/><code>fd711c8a</code>"]
  nb81f66a5["discovery-receipt.json#89<br/><code>b81f66a5</code>"]
  nc7f9b0fd["discovery-receipt.json#90<br/><code>c7f9b0fd</code>"]
  n77473884["discovery-receipt.json#91<br/><code>77473884</code>"]
  nae96244a["discovery-receipt.json#92<br/><code>ae96244a</code>"]
  n444eb698["discovery-receipt.json#93<br/><code>444eb698</code>"]
  nec253fd5["discovery-receipt.json#94<br/><code>ec253fd5</code>"]
  ne731cf1b["discovery-receipt.json#95<br/><code>e731cf1b</code>"]
  n7dd371a5["discovery-receipt.json#96<br/><code>7dd371a5</code>"]
  n17de9fe6["discovery-receipt.json#97<br/><code>17de9fe6</code>"]
  n3af6ca57["discovery-receipt.json#98<br/><code>3af6ca57</code>"]
  ndde02889["discovery-receipt.json#99<br/><code>dde02889</code>"]
  n81776625["discovery-receipt.json#100<br/><code>81776625</code>"]
  ndbfec671["discovery-receipt.json#101<br/><code>dbfec671</code>"]
  nf7833ff0["discovery-receipt.json#102<br/><code>f7833ff0</code>"]
  nfe8b8d2a["discovery-receipt.json#103<br/><code>fe8b8d2a</code>"]
  n7bfcef91["discovery-receipt.json#104<br/><code>7bfcef91</code>"]
  n9681d343["discovery-receipt.json#105<br/><code>9681d343</code>"]
  n1ea292ea["discovery-receipt.json#106<br/><code>1ea292ea</code>"]
  ncf87ce6e["discovery-receipt.json#107<br/><code>cf87ce6e</code>"]
  n8d5c5cf4["discovery-receipt.json#108<br/><code>8d5c5cf4</code>"]
  n9a57549c["discovery-receipt.json#109<br/><code>9a57549c</code>"]
  n181df217["discovery-receipt.json#110<br/><code>181df217</code>"]
  n37909430["discovery-receipt.json#111<br/><code>37909430</code>"]
  n541c9b04["discovery-receipt.json#112<br/><code>541c9b04</code>"]
  ned5be4da["discovery-receipt.json#113<br/><code>ed5be4da</code>"]
  n242ce724["discovery-receipt.json#114<br/><code>242ce724</code>"]
  nac2e1072["discovery-receipt.json#115<br/><code>ac2e1072</code>"]
  n55806a8c["discovery-receipt.json#116<br/><code>55806a8c</code>"]
  n5ee5810a["discovery-receipt.json#117<br/><code>5ee5810a</code>"]
  nd03cce69["discovery-receipt.json#118<br/><code>d03cce69</code>"]
  na1643618["discovery-receipt.json#119<br/><code>a1643618</code>"]
  na7c5ef03["discovery-receipt.json#120<br/><code>a7c5ef03</code>"]
  n0b47dc19["discovery-receipt.json#121<br/><code>0b47dc19</code>"]
  n0bd2d2c0["discovery-receipt.json#122<br/><code>0bd2d2c0</code>"]
  nbb94ee72["discovery-receipt.json#123<br/><code>bb94ee72</code>"]
  nf1202f14["discovery-receipt.json#124<br/><code>f1202f14</code>"]
  n4bdd3665["discovery-receipt.json#125<br/><code>4bdd3665</code>"]
  nd6287cac["discovery-receipt.json#126<br/><code>d6287cac</code>"]
  n169732af["discovery-receipt.json#127<br/><code>169732af</code>"]
  n1158e3c8["discovery-receipt.json#128<br/><code>1158e3c8</code>"]
  n0d55bbd6["discovery-receipt.json#129<br/><code>0d55bbd6</code>"]
  nf9aab39a["discovery-receipt.json#130<br/><code>f9aab39a</code>"]
  neef0489d["discovery-receipt.json#131<br/><code>eef0489d</code>"]
  n66c30857["discovery-receipt.json#132<br/><code>66c30857</code>"]
  n0a2f576d["discovery-receipt.json#133<br/><code>0a2f576d</code>"]
  n22764d00["discovery-receipt.json#134<br/><code>22764d00</code>"]
  nd9fcfa8c["discovery-receipt.json#135<br/><code>d9fcfa8c</code>"]
  ndd8e0473["discovery-receipt.json#136<br/><code>dd8e0473</code>"]
  n8c160b0e["discovery-receipt.json#137<br/><code>8c160b0e</code>"]
  n90983efc["discovery-receipt.json#138<br/><code>90983efc</code>"]
  n82d12245["discovery-receipt.json#139<br/><code>82d12245</code>"]
  n4643c413["discovery-receipt.json#140<br/><code>4643c413</code>"]
  n53b025cd["discovery-receipt.json#141<br/><code>53b025cd</code>"]
  n84953e09["discovery-receipt.json#142<br/><code>84953e09</code>"]
  n9385c5bd["discovery-receipt.json#143<br/><code>9385c5bd</code>"]
  n0593c74e["discovery-receipt.json#144<br/><code>0593c74e</code>"]
  nac0b7dcc["discovery-receipt.json#145<br/><code>ac0b7dcc</code>"]
  n5d9a9df0["discovery-receipt.json#146<br/><code>5d9a9df0</code>"]
  ncbcaa9b7["discovery-receipt.json#147<br/><code>cbcaa9b7</code>"]
  n74587fc5["discovery-receipt.json#148<br/><code>74587fc5</code>"]
  n18c8baaf["discovery-receipt.json#149<br/><code>18c8baaf</code>"]
  n4a75cd4a["discovery-receipt.json#150<br/><code>4a75cd4a</code>"]
  n851f5292["discovery-receipt.json#151<br/><code>851f5292</code>"]
  ne0a61d76["discovery-receipt.json#152<br/><code>e0a61d76</code>"]
  n497e8648["discovery-receipt.json#153<br/><code>497e8648</code>"]
  nb06df231["discovery-receipt.json#154<br/><code>b06df231</code>"]
  n0e5408a3["discovery-receipt.json#155<br/><code>0e5408a3</code>"]
  n145fcc88["discovery-receipt.json#156<br/><code>145fcc88</code>"]
  n74223d05["discovery-receipt.json#157<br/><code>74223d05</code>"]
  nf4ed3226["discovery-receipt.json#158<br/><code>f4ed3226</code>"]
  nb36bdb50["discovery-receipt.json#159<br/><code>b36bdb50</code>"]
  nf0a53845["discovery-receipt.json#160<br/><code>f0a53845</code>"]
  n453712e0["discovery-receipt.json#161<br/><code>453712e0</code>"]
  nd23ab6c2["discovery-receipt.json#162<br/><code>d23ab6c2</code>"]
  n625466b9["discovery-receipt.json#163<br/><code>625466b9</code>"]
  ne6f5b301["discovery-receipt.json#164<br/><code>e6f5b301</code>"]
  n130445ca["discovery-receipt.json#165<br/><code>130445ca</code>"]
  ncf1243ee["discovery-receipt.json#166<br/><code>cf1243ee</code>"]
  n2362cf15["discovery-receipt.json#167<br/><code>2362cf15</code>"]
  nc8edb929["discovery-receipt.json#168<br/><code>c8edb929</code>"]
  n9da9f171["discovery-receipt.json#169<br/><code>9da9f171</code>"]
  nc60edbe9["discovery-receipt.json#170<br/><code>c60edbe9</code>"]
  n7b1e23a9["discovery-receipt.json#171<br/><code>7b1e23a9</code>"]
  n64b60a04["discovery-receipt.json#172<br/><code>64b60a04</code>"]
  n296104ab["discovery-receipt.json#173<br/><code>296104ab</code>"]
  ndef951c7["discovery-receipt.json#174<br/><code>def951c7</code>"]
  n8820b65b["discovery-receipt.json#175<br/><code>8820b65b</code>"]
  n038d5e4f["discovery-receipt.json#176<br/><code>038d5e4f</code>"]
  nd84ecec2["discovery-receipt.json#177<br/><code>d84ecec2</code>"]
  n92725ea5["discovery-receipt.json#178<br/><code>92725ea5</code>"]
  nd7493b33["discovery-receipt.json#179<br/><code>d7493b33</code>"]
  n8d1899ee["discovery-receipt.json#180<br/><code>8d1899ee</code>"]
  nb385b8ae["discovery-receipt.json#181<br/><code>b385b8ae</code>"]
  n9cfc0277["discovery-receipt.json#182<br/><code>9cfc0277</code>"]
  nb94333c4["discovery-receipt.json#183<br/><code>b94333c4</code>"]
  nd0dc64d3["discovery-receipt.json#184<br/><code>d0dc64d3</code>"]
  nb930acb0["discovery-receipt.json#185<br/><code>b930acb0</code>"]
  n9ab50410["discovery-receipt.json#186<br/><code>9ab50410</code>"]
  n820e86ec["discovery-receipt.json#187<br/><code>820e86ec</code>"]
  n0a94bc20["discovery-receipt.json#188<br/><code>0a94bc20</code>"]
  n4aa7ddda["discovery-receipt.json#189<br/><code>4aa7ddda</code>"]
  ncfb54137["discovery-receipt.json#190<br/><code>cfb54137</code>"]
  n89e4b844["discovery-receipt.json#191<br/><code>89e4b844</code>"]
  n4144338f["discovery-receipt.json#192<br/><code>4144338f</code>"]
  n273381f3["discovery-receipt.json#193<br/><code>273381f3</code>"]
  na8464e00["discovery-receipt.json#194<br/><code>a8464e00</code>"]
  nda83a9e6["discovery-receipt.json#195<br/><code>da83a9e6</code>"]
  n998c0563["discovery-receipt.json#196<br/><code>998c0563</code>"]
  na5040d99["discovery-receipt.json#197<br/><code>a5040d99</code>"]
  nda31f184["discovery-receipt.json#198<br/><code>da31f184</code>"]
  na0624434["discovery-receipt.json#199<br/><code>a0624434</code>"]
  n4c82fbda["discovery-receipt.json#200<br/><code>4c82fbda</code>"]
  n885222c4["discovery-receipt.json#201<br/><code>885222c4</code>"]
  n2325ad64["discovery-receipt.json#202<br/><code>2325ad64</code>"]
  ne2434bab["discovery-receipt.json#203<br/><code>e2434bab</code>"]
  n0de805d1["discovery-receipt.json#204<br/><code>0de805d1</code>"]
  nb92cf8f9["discovery-receipt.json#205<br/><code>b92cf8f9</code>"]
  n21cc5f5b["discovery-receipt.json#206<br/><code>21cc5f5b</code>"]
  n9e6f98e9["discovery-receipt.json#207<br/><code>9e6f98e9</code>"]
  n28f3bf55["discovery-receipt.json#208<br/><code>28f3bf55</code>"]
  nc36442b9["discovery-receipt.json#209<br/><code>c36442b9</code>"]
  nf2a7f6eb["discovery-receipt.json#210<br/><code>f2a7f6eb</code>"]
  n78e52ddf["discovery-receipt.json#211<br/><code>78e52ddf</code>"]
  ncded2c90["discovery-receipt.json#212<br/><code>cded2c90</code>"]
  ncd74ecc1["discovery-receipt.json#213<br/><code>cd74ecc1</code>"]
  n7425d975["discovery-receipt.json#214<br/><code>7425d975</code>"]
  n32569fe7["discovery-receipt.json#215<br/><code>32569fe7</code>"]
  n6f2c7a2b["discovery-receipt.json#216<br/><code>6f2c7a2b</code>"]
  ne304f11d["discovery-receipt.json#217<br/><code>e304f11d</code>"]
  nb06f8edb["discovery-receipt.json#218<br/><code>b06f8edb</code>"]
  n672fa686["discovery-receipt.json#219<br/><code>672fa686</code>"]
  nba237817["discovery-receipt.json#220<br/><code>ba237817</code>"]
  n0c25e998["discovery-receipt.json#221<br/><code>0c25e998</code>"]
  nc5cbc849["discovery-receipt.json#222<br/><code>c5cbc849</code>"]
  nf63bc4fe["discovery-receipt.json#223<br/><code>f63bc4fe</code>"]
  nf4c95316["discovery-receipt.json#224<br/><code>f4c95316</code>"]
  n2d09d8bd["discovery-receipt.json#225<br/><code>2d09d8bd</code>"]
  n986f8756["discovery-receipt.json#226<br/><code>986f8756</code>"]
  n16f180be["discovery-receipt.json#227<br/><code>16f180be</code>"]
  n4529336c["discovery-receipt.json#228<br/><code>4529336c</code>"]
  ncb0268d6["discovery-receipt.json#229<br/><code>cb0268d6</code>"]
  nc5ba3923["flaws-receipt.json<br/><code>c5ba3923</code>"]
  n009ce86d["formulas-receipt.json<br/><code>009ce86d</code>"]
  nb4df478e["formulas-receipt.json#0<br/><code>b4df478e</code>"]
  nbba1c8d7["formulas-receipt.json#1<br/><code>bba1c8d7</code>"]
  nbd2f2f6e["formulas-receipt.json#2<br/><code>bd2f2f6e</code>"]
  nbe2b7953["formulas-receipt.json#3<br/><code>be2b7953</code>"]
  ne5fa3a9b["formulas-receipt.json#4<br/><code>e5fa3a9b</code>"]
  n0022d77f["formulas-receipt.json#5<br/><code>0022d77f</code>"]
  n6c133681["formulas-receipt.json#6<br/><code>6c133681</code>"]
  n29e6a011["formulas-receipt.json#7<br/><code>29e6a011</code>"]
  n619fe335["formulas-receipt.json#8<br/><code>619fe335</code>"]
  na16f5c31["formulas-receipt.json#9<br/><code>a16f5c31</code>"]
  n16041ea5["formulas-receipt.json#10<br/><code>16041ea5</code>"]
  nc0bec0a9["formulas-receipt.json#11<br/><code>c0bec0a9</code>"]
  n2ac7df07["formulas-receipt.json#12<br/><code>2ac7df07</code>"]
  n552dfb9d["formulas-receipt.json#13<br/><code>552dfb9d</code>"]
  nd66abb16["formulas-receipt.json#14<br/><code>d66abb16</code>"]
  nb995cd9b["formulas-receipt.json#15<br/><code>b995cd9b</code>"]
  ne23af03f["formulas-receipt.json#16<br/><code>e23af03f</code>"]
  n26a60b69["formulas-receipt.json#17<br/><code>26a60b69</code>"]
  n2ef1390e["formulas-receipt.json#18<br/><code>2ef1390e</code>"]
  n1db79c87["formulas-receipt.json#19<br/><code>1db79c87</code>"]
  nfe531899["formulas-receipt.json#20<br/><code>fe531899</code>"]
  nc19c1dcc["formulas-receipt.json#21<br/><code>c19c1dcc</code>"]
  n2e772cad["formulas-receipt.json#22<br/><code>2e772cad</code>"]
  n74e3c546["formulas-receipt.json#23<br/><code>74e3c546</code>"]
  n61f6d79c["formulas-receipt.json#24<br/><code>61f6d79c</code>"]
  ne595fb40["formulas-receipt.json#25<br/><code>e595fb40</code>"]
  ne6b7af4f["formulas-receipt.json#26<br/><code>e6b7af4f</code>"]
  n9c4329d6["formulas-receipt.json#27<br/><code>9c4329d6</code>"]
  n5f8abc25["formulas-receipt.json#28<br/><code>5f8abc25</code>"]
  naeaf3608["formulas-receipt.json#29<br/><code>aeaf3608</code>"]
  n8343d81e["formulas-receipt.json#30<br/><code>8343d81e</code>"]
  n0346e653["formulas-receipt.json#31<br/><code>0346e653</code>"]
  n9a8e8b03["formulas-receipt.json#32<br/><code>9a8e8b03</code>"]
  n3e2dbfe0["formulas-receipt.json#33<br/><code>3e2dbfe0</code>"]
  n226f45f3["formulas-receipt.json#34<br/><code>226f45f3</code>"]
  n6047c470["formulas-receipt.json#35<br/><code>6047c470</code>"]
  nb1eeb1d8["formulas-receipt.json#36<br/><code>b1eeb1d8</code>"]
  n6d8b46d1["formulas-receipt.json#37<br/><code>6d8b46d1</code>"]
  n0dcb4998["formulas-receipt.json#38<br/><code>0dcb4998</code>"]
  n0e685f36["formulas-receipt.json#39<br/><code>0e685f36</code>"]
  n18722811["formulas-receipt.json#40<br/><code>18722811</code>"]
  n85765073["formulas-receipt.json#41<br/><code>85765073</code>"]
  nd7537663["formulas-receipt.json#42<br/><code>d7537663</code>"]
  ne833caeb["formulas-receipt.json#43<br/><code>e833caeb</code>"]
  na1df532b["formulas-receipt.json#44<br/><code>a1df532b</code>"]
  n9abcbdd0["formulas-receipt.json#45<br/><code>9abcbdd0</code>"]
  nd7e709db["formulas-receipt.json#46<br/><code>d7e709db</code>"]
  ne894624a["formulas-receipt.json#47<br/><code>e894624a</code>"]
  nc691ea88["formulas-receipt.json#48<br/><code>c691ea88</code>"]
  nf26fd519["formulas-receipt.json#49<br/><code>f26fd519</code>"]
  nf5bd4604["formulas-receipt.json#50<br/><code>f5bd4604</code>"]
  n6156926c["formulas-receipt.json#51<br/><code>6156926c</code>"]
  n10daf93e["formulas-receipt.json#52<br/><code>10daf93e</code>"]
  n91f9cdd3["formulas-receipt.json#53<br/><code>91f9cdd3</code>"]
  nd0eb3989["formulas-receipt.json#54<br/><code>d0eb3989</code>"]
  nd237b1ea["formulas-receipt.json#55<br/><code>d237b1ea</code>"]
  nbb9f30ce["formulas-receipt.json#56<br/><code>bb9f30ce</code>"]
  n1b6cb2ab["formulas-receipt.json#57<br/><code>1b6cb2ab</code>"]
  nb5fad0b7["formulas-receipt.json#58<br/><code>b5fad0b7</code>"]
  n364aab6b["formulas-receipt.json#59<br/><code>364aab6b</code>"]
  nb6fcc3f3["formulas-receipt.json#60<br/><code>b6fcc3f3</code>"]
  n125c5df1["formulas-receipt.json#61<br/><code>125c5df1</code>"]
  n236281ba["formulas-receipt.json#62<br/><code>236281ba</code>"]
  na4a1b13f["formulas-receipt.json#63<br/><code>a4a1b13f</code>"]
  nd51695cb["formulas-receipt.json#64<br/><code>d51695cb</code>"]
  n18f5bcc7["formulas-receipt.json#65<br/><code>18f5bcc7</code>"]
  n044ad361["formulas-receipt.json#66<br/><code>044ad361</code>"]
  n56250534["formulas-receipt.json#67<br/><code>56250534</code>"]
  nb9860cd9["formulas-receipt.json#68<br/><code>b9860cd9</code>"]
  neb629057["formulas-receipt.json#69<br/><code>eb629057</code>"]
  n6a594de1["formulas-receipt.json#70<br/><code>6a594de1</code>"]
  n17345d26["formulas-receipt.json#71<br/><code>17345d26</code>"]
  nefba8edf["formulas-receipt.json#72<br/><code>efba8edf</code>"]
  n561aa955["formulas-receipt.json#73<br/><code>561aa955</code>"]
  n0fac2feb["formulas-receipt.json#74<br/><code>0fac2feb</code>"]
  n98941647["formulas-receipt.json#75<br/><code>98941647</code>"]
  n44ec5e97["formulas-receipt.json#76<br/><code>44ec5e97</code>"]
  naa26f79b["formulas-receipt.json#77<br/><code>aa26f79b</code>"]
  n9e8f3af4["formulas-receipt.json#78<br/><code>9e8f3af4</code>"]
  n5f53c1b7["fuse-receipt.json<br/><code>5f53c1b7</code>"]
  na5c3e4e5["heat-receipt.json<br/><code>a5c3e4e5</code>"]
  nd44d0766["heat-receipt.json#0<br/><code>d44d0766</code>"]
  neb4c279f["heat-receipt.json#1<br/><code>eb4c279f</code>"]
  n8da90c82["heat-receipt.json#2<br/><code>8da90c82</code>"]
  n609ff7ea["heat-receipt.json#3<br/><code>609ff7ea</code>"]
  n016a2c35["heat-receipt.json#4<br/><code>016a2c35</code>"]
  n22cc4bc3["heat-receipt.json#5<br/><code>22cc4bc3</code>"]
  n01b650c3["heat-receipt.json#6<br/><code>01b650c3</code>"]
  nb5a30da8["heat-receipt.json#7<br/><code>b5a30da8</code>"]
  n85b64984["heat-receipt.json#8<br/><code>85b64984</code>"]
  n1af6e739["heat-receipt.json#9<br/><code>1af6e739</code>"]
  ne254bafb["heat-receipt.json#10<br/><code>e254bafb</code>"]
  n3a224c06["heat-receipt.json#11<br/><code>3a224c06</code>"]
  n5ab1b773["heat-receipt.json#12<br/><code>5ab1b773</code>"]
  n361d2381["heat-receipt.json#13<br/><code>361d2381</code>"]
  ne671e7f8["heat-receipt.json#14<br/><code>e671e7f8</code>"]
  n85c87619["heat-receipt.json#15<br/><code>85c87619</code>"]
  nd88621f1["heat-receipt.json#16<br/><code>d88621f1</code>"]
  n07218149["heat-receipt.json#17<br/><code>07218149</code>"]
  n1053972a["heat-receipt.json#18<br/><code>1053972a</code>"]
  n0545f658["heat-receipt.json#19<br/><code>0545f658</code>"]
  n189df36b["heat-receipt.json#20<br/><code>189df36b</code>"]
  ne0a3a55e["heat-receipt.json#21<br/><code>e0a3a55e</code>"]
  n94733d8d["heat-receipt.json#22<br/><code>94733d8d</code>"]
  n36fd8db0["heat-receipt.json#23<br/><code>36fd8db0</code>"]
  n4d5f1083["heat-receipt.json#24<br/><code>4d5f1083</code>"]
  ndfc16675["heat-receipt.json#25<br/><code>dfc16675</code>"]
  n1ad5950d["heat-receipt.json#26<br/><code>1ad5950d</code>"]
  n29604306["heat-receipt.json#27<br/><code>29604306</code>"]
  n6ecd3bbe["heat-receipt.json#28<br/><code>6ecd3bbe</code>"]
  na360b711["heat-receipt.json#29<br/><code>a360b711</code>"]
  n2cff9bb9["heat-receipt.json#30<br/><code>2cff9bb9</code>"]
  n826848f7["heat-receipt.json#31<br/><code>826848f7</code>"]
  nbeee82eb["heat-receipt.json#32<br/><code>beee82eb</code>"]
  ndb7a5772["heat-receipt.json#33<br/><code>db7a5772</code>"]
  n19cbcec9["heat-receipt.json#34<br/><code>19cbcec9</code>"]
  nf5309246["heat-receipt.json#35<br/><code>f5309246</code>"]
  n0e11a312["heat-receipt.json#36<br/><code>0e11a312</code>"]
  n1cfac2d2["heat-receipt.json#37<br/><code>1cfac2d2</code>"]
  nbbdc289a["heat-receipt.json#38<br/><code>bbdc289a</code>"]
  n27bf89a6["heat-receipt.json#39<br/><code>27bf89a6</code>"]
  n329b4e7f["lattice-receipt.json<br/><code>329b4e7f</code>"]
  n1290e76b["lean-receipt.json<br/><code>1290e76b</code>"]
  n56ce2155["lean-receipt.json#0<br/><code>56ce2155</code>"]
  ncf348e8a["lean-receipt.json#1<br/><code>cf348e8a</code>"]
  n499e6b35["lean-receipt.json#2<br/><code>499e6b35</code>"]
  nc562331b["lean-receipt.json#3<br/><code>c562331b</code>"]
  nb873611b["lean-receipt.json#4<br/><code>b873611b</code>"]
  na759d121["lean-receipt.json#5<br/><code>a759d121</code>"]
  n3cba977c["lean-receipt.json#6<br/><code>3cba977c</code>"]
  nf8bbbb48["lean-receipt.json#7<br/><code>f8bbbb48</code>"]
  n625fbe86["lean-receipt.json#8<br/><code>625fbe86</code>"]
  n8b6bd865["lean-receipt.json#9<br/><code>8b6bd865</code>"]
  nd7224177["lean-receipt.json#10<br/><code>d7224177</code>"]
  nfde5e0b3["lean-receipt.json#11<br/><code>fde5e0b3</code>"]
  n1695a9eb["lean-receipt.json#12<br/><code>1695a9eb</code>"]
  nd69bbcae["lean-receipt.json#13<br/><code>d69bbcae</code>"]
  n8a07e8c9["lean-receipt.json#14<br/><code>8a07e8c9</code>"]
  ndb9d6d0d["lean-receipt.json#15<br/><code>db9d6d0d</code>"]
  na781b051["lean-receipt.json#16<br/><code>a781b051</code>"]
  n9f182e92["lean-receipt.json#17<br/><code>9f182e92</code>"]
  n627532fd["lean-receipt.json#18<br/><code>627532fd</code>"]
  n997956c7["lean-receipt.json#19<br/><code>997956c7</code>"]
  nbe5e72c2["lean-receipt.json#20<br/><code>be5e72c2</code>"]
  nab3b5745["lean-receipt.json#21<br/><code>ab3b5745</code>"]
  nf3e7f6cd["lean-receipt.json#22<br/><code>f3e7f6cd</code>"]
  n57eaba4e["lean-receipt.json#23<br/><code>57eaba4e</code>"]
  n9c712b6f["lean-receipt.json#24<br/><code>9c712b6f</code>"]
  nc9a63eb8["lean-receipt.json#25<br/><code>c9a63eb8</code>"]
  n1cc424f3["lean-receipt.json#26<br/><code>1cc424f3</code>"]
  n6ee439a2["lean-receipt.json#27<br/><code>6ee439a2</code>"]
  n4901d3aa["lean-receipt.json#28<br/><code>4901d3aa</code>"]
  n32d3926d["lean-receipt.json#29<br/><code>32d3926d</code>"]
  n4dac126e["lean-receipt.json#30<br/><code>4dac126e</code>"]
  n54e71fc9["lean-receipt.json#31<br/><code>54e71fc9</code>"]
  n02479ae8["lean-receipt.json#32<br/><code>02479ae8</code>"]
  nf9d3feb0["lean-receipt.json#33<br/><code>f9d3feb0</code>"]
  n8919f291["lean-receipt.json#34<br/><code>8919f291</code>"]
  n6d0fdaf6["lean-receipt.json#35<br/><code>6d0fdaf6</code>"]
  ndd421abc["lean-receipt.json#36<br/><code>dd421abc</code>"]
  n8f69019d["lean-receipt.json#37<br/><code>8f69019d</code>"]
  n758832ef["lean-receipt.json#38<br/><code>758832ef</code>"]
  n001fa8ec["lean-receipt.json#39<br/><code>001fa8ec</code>"]
  n992f1a13["lean-receipt.json#40<br/><code>992f1a13</code>"]
  neaabcde1["lean-receipt.json#41<br/><code>eaabcde1</code>"]
  n3b68e21d["lean-receipt.json#42<br/><code>3b68e21d</code>"]
  n7c0baadd["lean-receipt.json#43<br/><code>7c0baadd</code>"]
  nbcb917d9["lean-receipt.json#44<br/><code>bcb917d9</code>"]
  n609b6091["lean-receipt.json#45<br/><code>609b6091</code>"]
  n81c70498["lean-receipt.json#46<br/><code>81c70498</code>"]
  nbc0a1798["lean-receipt.json#47<br/><code>bc0a1798</code>"]
  n93229b86["lean-receipt.json#48<br/><code>93229b86</code>"]
  nbba2ebd4["lean-receipt.json#49<br/><code>bba2ebd4</code>"]
  nb2cec79b["lean-receipt.json#50<br/><code>b2cec79b</code>"]
  nf04c24f6["lean-receipt.json#51<br/><code>f04c24f6</code>"]
  nb3e3710a["lean-receipt.json#52<br/><code>b3e3710a</code>"]
  nb961dcd7["lean-receipt.json#53<br/><code>b961dcd7</code>"]
  nee9e5638["lean-receipt.json#54<br/><code>ee9e5638</code>"]
  nc6461a47["lean-receipt.json#55<br/><code>c6461a47</code>"]
  na9b855cd["lean-receipt.json#56<br/><code>a9b855cd</code>"]
  n19f23813["lean-receipt.json#57<br/><code>19f23813</code>"]
  n49f4bc36["lean-receipt.json#58<br/><code>49f4bc36</code>"]
  n31ab447d["lean-receipt.json#59<br/><code>31ab447d</code>"]
  n226ee7ad["lean-receipt.json#60<br/><code>226ee7ad</code>"]
  n24f71b2b["lean-receipt.json#61<br/><code>24f71b2b</code>"]
  n3b2096c6["lean-receipt.json#62<br/><code>3b2096c6</code>"]
  n8fc7baa3["lean-receipt.json#63<br/><code>8fc7baa3</code>"]
  nb29ac76a["lean-receipt.json#64<br/><code>b29ac76a</code>"]
  n7199cbe0["lean-receipt.json#65<br/><code>7199cbe0</code>"]
  n7fc45f3d["lean-receipt.json#66<br/><code>7fc45f3d</code>"]
  n14b68062["lean-receipt.json#67<br/><code>14b68062</code>"]
  n9b2009a7["lean-receipt.json#68<br/><code>9b2009a7</code>"]
  nff014850["lean-receipt.json#69<br/><code>ff014850</code>"]
  n58885521["lean-receipt.json#70<br/><code>58885521</code>"]
  nf37d57fa["lean-receipt.json#71<br/><code>f37d57fa</code>"]
  nad24bb5d["lean-receipt.json#72<br/><code>ad24bb5d</code>"]
  n1946f81b["lean-receipt.json#73<br/><code>1946f81b</code>"]
  nca14010a["lean-receipt.json#74<br/><code>ca14010a</code>"]
  nc32da34a["lean-receipt.json#75<br/><code>c32da34a</code>"]
  nf7046fa2["lean-receipt.json#76<br/><code>f7046fa2</code>"]
  nd5bc4c04["lean-receipt.json#77<br/><code>d5bc4c04</code>"]
  nb5948cb4["lean-receipt.json#78<br/><code>b5948cb4</code>"]
  n15cf38af["lean-receipt.json#79<br/><code>15cf38af</code>"]
  n434587cb["lean-receipt.json#80<br/><code>434587cb</code>"]
  n12568d22["lean-receipt.json#81<br/><code>12568d22</code>"]
  nc81b7aed["lean-receipt.json#82<br/><code>c81b7aed</code>"]
  nbaeff895["lean-receipt.json#83<br/><code>baeff895</code>"]
  nd2266df1["lean-receipt.json#84<br/><code>d2266df1</code>"]
  nb23b41c6["lean-receipt.json#85<br/><code>b23b41c6</code>"]
  n50970efe["lean-receipt.json#86<br/><code>50970efe</code>"]
  n010d505d["lean-receipt.json#87<br/><code>010d505d</code>"]
  n2dec2de1["lean-receipt.json#88<br/><code>2dec2de1</code>"]
  nfbd9632a["lean-receipt.json#89<br/><code>fbd9632a</code>"]
  n78cce8dc["lean-receipt.json#90<br/><code>78cce8dc</code>"]
  n430b58d5["lean-receipt.json#91<br/><code>430b58d5</code>"]
  n79332f72["lean-receipt.json#92<br/><code>79332f72</code>"]
  n4466468c["lean-receipt.json#93<br/><code>4466468c</code>"]
  n15047a24["lean-receipt.json#94<br/><code>15047a24</code>"]
  ncbbe0cfe["lean-receipt.json#95<br/><code>cbbe0cfe</code>"]
  n5677ccf4["lean-receipt.json#96<br/><code>5677ccf4</code>"]
  n109a0919["lean-receipt.json#97<br/><code>109a0919</code>"]
  nc2f39ac5["lean-receipt.json#98<br/><code>c2f39ac5</code>"]
  n87ac62a1["lean-receipt.json#99<br/><code>87ac62a1</code>"]
  n4a9abc62["lean-receipt.json#100<br/><code>4a9abc62</code>"]
  n99569d87["lean-receipt.json#101<br/><code>99569d87</code>"]
  n909234c4["lean-receipt.json#102<br/><code>909234c4</code>"]
  n062db515["lean-receipt.json#103<br/><code>062db515</code>"]
  n75a1f63f["lean-receipt.json#104<br/><code>75a1f63f</code>"]
  n8420b94c["lean-receipt.json#105<br/><code>8420b94c</code>"]
  n2203ac90["lean-receipt.json#106<br/><code>2203ac90</code>"]
  ndda8151a["lean-receipt.json#107<br/><code>dda8151a</code>"]
  n903b7b76["lean-receipt.json#108<br/><code>903b7b76</code>"]
  nd39d1d07["lean-receipt.json#109<br/><code>d39d1d07</code>"]
  n7246f3e9["lean-receipt.json#110<br/><code>7246f3e9</code>"]
  nb1e0afc8["lean-receipt.json#111<br/><code>b1e0afc8</code>"]
  n17210552["lean-receipt.json#112<br/><code>17210552</code>"]
  ndf148d10["lean-receipt.json#113<br/><code>df148d10</code>"]
  na6ca1b65["lean-receipt.json#114<br/><code>a6ca1b65</code>"]
  ne0f342a2["lean-receipt.json#115<br/><code>e0f342a2</code>"]
  nc16426f7["lean-receipt.json#116<br/><code>c16426f7</code>"]
  n6ecec40d["lean-receipt.json#117<br/><code>6ecec40d</code>"]
  nff2b4043["lean-receipt.json#118<br/><code>ff2b4043</code>"]
  n44e0b699["lean-receipt.json#119<br/><code>44e0b699</code>"]
  n99cc7263["lean-receipt.json#120<br/><code>99cc7263</code>"]
  n1d11ebf6["lean-receipt.json#121<br/><code>1d11ebf6</code>"]
  nee63ccfa["lean-receipt.json#122<br/><code>ee63ccfa</code>"]
  n90c1d613["lean-receipt.json#123<br/><code>90c1d613</code>"]
  n044a9712["payload-cf-receipt.json<br/><code>044a9712</code>"]
  n77a6925f["percall-receipt.json<br/><code>77a6925f</code>"]
  n4b2cd23a["refusals-receipt.json<br/><code>4b2cd23a</code>"]
  nd343473b["test-receipt.json<br/><code>d343473b</code>"]
  nf067068c["test-receipt.json#0<br/><code>f067068c</code>"]
  nffd866cc["test-receipt.json#1<br/><code>ffd866cc</code>"]
  n55a8ff7a["test-receipt.json#2<br/><code>55a8ff7a</code>"]
  n61473d41["test-receipt.json#3<br/><code>61473d41</code>"]
  nc4b06297["test-receipt.json#4<br/><code>c4b06297</code>"]
  n4bb5c5a8["test-receipt.json#5<br/><code>4bb5c5a8</code>"]
  nf368565b["test-receipt.json#6<br/><code>f368565b</code>"]
  n9ad88ab4["test-receipt.json#7<br/><code>9ad88ab4</code>"]
  n1eb7365e["test-receipt.json#8<br/><code>1eb7365e</code>"]
  nb569520c["test-receipt.json#9<br/><code>b569520c</code>"]
  n73db19e7["test-receipt.json#10<br/><code>73db19e7</code>"]
  n1693f967["walls-receipt.json<br/><code>1693f967</code>"]
  n805d0954["readme<br/><code>805d0954</code>"]
  nf13854d7 --> n59bee0cd
  n59bee0cd --> nf2dc32fb
  n59bee0cd --> n32c087d2
  n59bee0cd --> ne4689a5b
  n59bee0cd --> n9f2522f0
  n59bee0cd --> n8cb99c5b
  n59bee0cd --> nd9eef1f8
  n59bee0cd --> nabbecdb9
  n59bee0cd --> nea42af2f
  n59bee0cd --> n47600a8d
  n59bee0cd --> n6cd918da
  n59bee0cd --> n9b91d2b2
  n59bee0cd --> nf0392383
  n59bee0cd --> n7a1eaa4d
  n59bee0cd --> ne98e956a
  n59bee0cd --> n5d6620d2
  n59bee0cd --> n42715b1a
  n59bee0cd --> n915c3ae8
  n59bee0cd --> n18885b4e
  n59bee0cd --> ne4d9898b
  n59bee0cd --> nab87c6d4
  n59bee0cd --> nd3a8bee5
  n59bee0cd --> n46bda07b
  n59bee0cd --> ndc3cfbc3
  n59bee0cd --> ne7a8c287
  n59bee0cd --> n80231bb2
  n59bee0cd --> nda1eb480
  n59bee0cd --> neafe931b
  n59bee0cd --> n04f4bd05
  n59bee0cd --> n9ec5157a
  n59bee0cd --> n0fe61f25
  nf13854d7 --> n17a095c0
  nf13854d7 --> nafe9c9d4
  nafe9c9d4 --> ndd795f53
  nafe9c9d4 --> n4bc51e81
  nafe9c9d4 --> n9e823b8c
  nafe9c9d4 --> n574083d4
  nafe9c9d4 --> nbcf05d08
  nafe9c9d4 --> n1e19b2b1
  nafe9c9d4 --> n6d69999d
  nafe9c9d4 --> n32dd158f
  nafe9c9d4 --> nc5451838
  nafe9c9d4 --> n850d7f85
  nafe9c9d4 --> n0a10684d
  nafe9c9d4 --> n6755532d
  nafe9c9d4 --> n5012b47a
  nafe9c9d4 --> n5573e778
  nafe9c9d4 --> ne6ab87cb
  nafe9c9d4 --> n5bf04361
  nafe9c9d4 --> nb2790d94
  nafe9c9d4 --> nf4f7bc21
  nafe9c9d4 --> n12a588bc
  nafe9c9d4 --> n42ecad09
  nafe9c9d4 --> n484d6ce5
  nafe9c9d4 --> n4fe4ac3f
  nafe9c9d4 --> ned0c6841
  nafe9c9d4 --> n89868020
  nafe9c9d4 --> nb1b493b5
  nafe9c9d4 --> n3309e13c
  nafe9c9d4 --> n3dacc227
  nafe9c9d4 --> n792cfc02
  nafe9c9d4 --> nedaf7bff
  nafe9c9d4 --> na57210f4
  nafe9c9d4 --> n829d27be
  nafe9c9d4 --> n7a7cf064
  nafe9c9d4 --> n360e8a9c
  nafe9c9d4 --> n5f995c32
  nafe9c9d4 --> n282eb83a
  nafe9c9d4 --> n09ade90e
  nafe9c9d4 --> ncc687e45
  nafe9c9d4 --> ne2d90249
  nafe9c9d4 --> nc4926d91
  nafe9c9d4 --> n969ef9fe
  nafe9c9d4 --> nd16d6333
  nafe9c9d4 --> nd8dea17b
  nafe9c9d4 --> ndacbf7f3
  nafe9c9d4 --> n0a979d4c
  nafe9c9d4 --> nda0d78c9
  nafe9c9d4 --> n24468a1e
  nafe9c9d4 --> n8c75cd1b
  nafe9c9d4 --> nff71bfb6
  nafe9c9d4 --> n6a8e7d99
  nafe9c9d4 --> na30a6dc1
  nafe9c9d4 --> n1b12d9b9
  nafe9c9d4 --> n2f8d9069
  nafe9c9d4 --> nbf35dfef
  nafe9c9d4 --> nf649fde7
  nafe9c9d4 --> n7fa13309
  nafe9c9d4 --> nb22974ca
  nafe9c9d4 --> ncd23cb69
  nafe9c9d4 --> n6a1ba18a
  nafe9c9d4 --> n925ce825
  nafe9c9d4 --> n18215640
  nafe9c9d4 --> na0e640e6
  nafe9c9d4 --> n3110c5b6
  nafe9c9d4 --> nd2164923
  nafe9c9d4 --> na901f8a9
  nafe9c9d4 --> n1b39f28e
  nafe9c9d4 --> nc87970d2
  nafe9c9d4 --> n7ab4e4ff
  nafe9c9d4 --> n60dd185f
  nafe9c9d4 --> n82032d05
  nafe9c9d4 --> n0bcd42ae
  nafe9c9d4 --> na447cbaf
  nafe9c9d4 --> n4409fea6
  nafe9c9d4 --> nb45bc68c
  nafe9c9d4 --> n4554b694
  nafe9c9d4 --> n4066b873
  nafe9c9d4 --> ncb594885
  nafe9c9d4 --> n56427665
  nafe9c9d4 --> n3a2c568f
  nafe9c9d4 --> na14323c6
  nafe9c9d4 --> nf01ba095
  nafe9c9d4 --> n880fa236
  nafe9c9d4 --> n16f8699c
  nafe9c9d4 --> n8b4c9531
  nafe9c9d4 --> nc8d49a0e
  nafe9c9d4 --> n26f88300
  nafe9c9d4 --> naf0c2829
  nafe9c9d4 --> n6ca40ad3
  nafe9c9d4 --> n04664ab7
  nafe9c9d4 --> nfd711c8a
  nafe9c9d4 --> nb81f66a5
  nafe9c9d4 --> nc7f9b0fd
  nafe9c9d4 --> n77473884
  nafe9c9d4 --> nae96244a
  nafe9c9d4 --> n444eb698
  nafe9c9d4 --> nec253fd5
  nafe9c9d4 --> ne731cf1b
  nafe9c9d4 --> n7dd371a5
  nafe9c9d4 --> n17de9fe6
  nafe9c9d4 --> n3af6ca57
  nafe9c9d4 --> ndde02889
  nafe9c9d4 --> n81776625
  nafe9c9d4 --> ndbfec671
  nafe9c9d4 --> nf7833ff0
  nafe9c9d4 --> nfe8b8d2a
  nafe9c9d4 --> n7bfcef91
  nafe9c9d4 --> n9681d343
  nafe9c9d4 --> n1ea292ea
  nafe9c9d4 --> ncf87ce6e
  nafe9c9d4 --> n8d5c5cf4
  nafe9c9d4 --> n9a57549c
  nafe9c9d4 --> n181df217
  nafe9c9d4 --> n37909430
  nafe9c9d4 --> n541c9b04
  nafe9c9d4 --> ned5be4da
  nafe9c9d4 --> n242ce724
  nafe9c9d4 --> nac2e1072
  nafe9c9d4 --> n55806a8c
  nafe9c9d4 --> n5ee5810a
  nafe9c9d4 --> nd03cce69
  nafe9c9d4 --> na1643618
  nafe9c9d4 --> na7c5ef03
  nafe9c9d4 --> n0b47dc19
  nafe9c9d4 --> n0bd2d2c0
  nafe9c9d4 --> nbb94ee72
  nafe9c9d4 --> nf1202f14
  nafe9c9d4 --> n4bdd3665
  nafe9c9d4 --> nd6287cac
  nafe9c9d4 --> n169732af
  nafe9c9d4 --> n1158e3c8
  nafe9c9d4 --> n0d55bbd6
  nafe9c9d4 --> nf9aab39a
  nafe9c9d4 --> neef0489d
  nafe9c9d4 --> n66c30857
  nafe9c9d4 --> n0a2f576d
  nafe9c9d4 --> n22764d00
  nafe9c9d4 --> nd9fcfa8c
  nafe9c9d4 --> ndd8e0473
  nafe9c9d4 --> n8c160b0e
  nafe9c9d4 --> n90983efc
  nafe9c9d4 --> n82d12245
  nafe9c9d4 --> n4643c413
  nafe9c9d4 --> n53b025cd
  nafe9c9d4 --> n84953e09
  nafe9c9d4 --> n9385c5bd
  nafe9c9d4 --> n0593c74e
  nafe9c9d4 --> nac0b7dcc
  nafe9c9d4 --> n5d9a9df0
  nafe9c9d4 --> ncbcaa9b7
  nafe9c9d4 --> n74587fc5
  nafe9c9d4 --> n18c8baaf
  nafe9c9d4 --> n4a75cd4a
  nafe9c9d4 --> n851f5292
  nafe9c9d4 --> ne0a61d76
  nafe9c9d4 --> n497e8648
  nafe9c9d4 --> nb06df231
  nafe9c9d4 --> n0e5408a3
  nafe9c9d4 --> n145fcc88
  nafe9c9d4 --> n74223d05
  nafe9c9d4 --> nf4ed3226
  nafe9c9d4 --> nb36bdb50
  nafe9c9d4 --> nf0a53845
  nafe9c9d4 --> n453712e0
  nafe9c9d4 --> nd23ab6c2
  nafe9c9d4 --> n625466b9
  nafe9c9d4 --> ne6f5b301
  nafe9c9d4 --> n130445ca
  nafe9c9d4 --> ncf1243ee
  nafe9c9d4 --> n2362cf15
  nafe9c9d4 --> nc8edb929
  nafe9c9d4 --> n9da9f171
  nafe9c9d4 --> nc60edbe9
  nafe9c9d4 --> n7b1e23a9
  nafe9c9d4 --> n64b60a04
  nafe9c9d4 --> n296104ab
  nafe9c9d4 --> ndef951c7
  nafe9c9d4 --> n8820b65b
  nafe9c9d4 --> n038d5e4f
  nafe9c9d4 --> nd84ecec2
  nafe9c9d4 --> n92725ea5
  nafe9c9d4 --> nd7493b33
  nafe9c9d4 --> n8d1899ee
  nafe9c9d4 --> nb385b8ae
  nafe9c9d4 --> n9cfc0277
  nafe9c9d4 --> nb94333c4
  nafe9c9d4 --> nd0dc64d3
  nafe9c9d4 --> nb930acb0
  nafe9c9d4 --> n9ab50410
  nafe9c9d4 --> n820e86ec
  nafe9c9d4 --> n0a94bc20
  nafe9c9d4 --> n4aa7ddda
  nafe9c9d4 --> ncfb54137
  nafe9c9d4 --> n89e4b844
  nafe9c9d4 --> n4144338f
  nafe9c9d4 --> n273381f3
  nafe9c9d4 --> na8464e00
  nafe9c9d4 --> nda83a9e6
  nafe9c9d4 --> n998c0563
  nafe9c9d4 --> na5040d99
  nafe9c9d4 --> nda31f184
  nafe9c9d4 --> na0624434
  nafe9c9d4 --> n4c82fbda
  nafe9c9d4 --> n885222c4
  nafe9c9d4 --> n2325ad64
  nafe9c9d4 --> ne2434bab
  nafe9c9d4 --> n0de805d1
  nafe9c9d4 --> nb92cf8f9
  nafe9c9d4 --> n21cc5f5b
  nafe9c9d4 --> n9e6f98e9
  nafe9c9d4 --> n28f3bf55
  nafe9c9d4 --> nc36442b9
  nafe9c9d4 --> nf2a7f6eb
  nafe9c9d4 --> n78e52ddf
  nafe9c9d4 --> ncded2c90
  nafe9c9d4 --> ncd74ecc1
  nafe9c9d4 --> n7425d975
  nafe9c9d4 --> n32569fe7
  nafe9c9d4 --> n6f2c7a2b
  nafe9c9d4 --> ne304f11d
  nafe9c9d4 --> nb06f8edb
  nafe9c9d4 --> n672fa686
  nafe9c9d4 --> nba237817
  nafe9c9d4 --> n0c25e998
  nafe9c9d4 --> nc5cbc849
  nafe9c9d4 --> nf63bc4fe
  nafe9c9d4 --> nf4c95316
  nafe9c9d4 --> n2d09d8bd
  nafe9c9d4 --> n986f8756
  nafe9c9d4 --> n16f180be
  nafe9c9d4 --> n4529336c
  nafe9c9d4 --> ncb0268d6
  nf13854d7 --> nc5ba3923
  nf13854d7 --> n009ce86d
  n009ce86d --> nb4df478e
  n009ce86d --> nbba1c8d7
  n009ce86d --> nbd2f2f6e
  n009ce86d --> nbe2b7953
  n009ce86d --> ne5fa3a9b
  n009ce86d --> n0022d77f
  n009ce86d --> n6c133681
  n009ce86d --> n29e6a011
  n009ce86d --> n619fe335
  n009ce86d --> na16f5c31
  n009ce86d --> n16041ea5
  n009ce86d --> nc0bec0a9
  n009ce86d --> n2ac7df07
  n009ce86d --> n552dfb9d
  n009ce86d --> nd66abb16
  n009ce86d --> nb995cd9b
  n009ce86d --> ne23af03f
  n009ce86d --> n26a60b69
  n009ce86d --> n2ef1390e
  n009ce86d --> n1db79c87
  n009ce86d --> nfe531899
  n009ce86d --> nc19c1dcc
  n009ce86d --> n2e772cad
  n009ce86d --> n74e3c546
  n009ce86d --> n61f6d79c
  n009ce86d --> ne595fb40
  n009ce86d --> ne6b7af4f
  n009ce86d --> n9c4329d6
  n009ce86d --> n5f8abc25
  n009ce86d --> naeaf3608
  n009ce86d --> n8343d81e
  n009ce86d --> n0346e653
  n009ce86d --> n9a8e8b03
  n009ce86d --> n3e2dbfe0
  n009ce86d --> n226f45f3
  n009ce86d --> n6047c470
  n009ce86d --> nb1eeb1d8
  n009ce86d --> n6d8b46d1
  n009ce86d --> n0dcb4998
  n009ce86d --> n0e685f36
  n009ce86d --> n18722811
  n009ce86d --> n85765073
  n009ce86d --> nd7537663
  n009ce86d --> ne833caeb
  n009ce86d --> na1df532b
  n009ce86d --> n9abcbdd0
  n009ce86d --> nd7e709db
  n009ce86d --> ne894624a
  n009ce86d --> nc691ea88
  n009ce86d --> nf26fd519
  n009ce86d --> nf5bd4604
  n009ce86d --> n6156926c
  n009ce86d --> n10daf93e
  n009ce86d --> n91f9cdd3
  n009ce86d --> nd0eb3989
  n009ce86d --> nd237b1ea
  n009ce86d --> nbb9f30ce
  n009ce86d --> n1b6cb2ab
  n009ce86d --> nb5fad0b7
  n009ce86d --> n364aab6b
  n009ce86d --> nb6fcc3f3
  n009ce86d --> n125c5df1
  n009ce86d --> n236281ba
  n009ce86d --> na4a1b13f
  n009ce86d --> nd51695cb
  n009ce86d --> n18f5bcc7
  n009ce86d --> n044ad361
  n009ce86d --> n56250534
  n009ce86d --> nb9860cd9
  n009ce86d --> neb629057
  n009ce86d --> n6a594de1
  n009ce86d --> n17345d26
  n009ce86d --> nefba8edf
  n009ce86d --> n561aa955
  n009ce86d --> n0fac2feb
  n009ce86d --> n98941647
  n009ce86d --> n44ec5e97
  n009ce86d --> naa26f79b
  n009ce86d --> n9e8f3af4
  nf13854d7 --> n5f53c1b7
  nf13854d7 --> na5c3e4e5
  na5c3e4e5 --> nd44d0766
  na5c3e4e5 --> neb4c279f
  na5c3e4e5 --> n8da90c82
  na5c3e4e5 --> n609ff7ea
  na5c3e4e5 --> n016a2c35
  na5c3e4e5 --> n22cc4bc3
  na5c3e4e5 --> n01b650c3
  na5c3e4e5 --> nb5a30da8
  na5c3e4e5 --> n85b64984
  na5c3e4e5 --> n1af6e739
  na5c3e4e5 --> ne254bafb
  na5c3e4e5 --> n3a224c06
  na5c3e4e5 --> n5ab1b773
  na5c3e4e5 --> n361d2381
  na5c3e4e5 --> ne671e7f8
  na5c3e4e5 --> n85c87619
  na5c3e4e5 --> nd88621f1
  na5c3e4e5 --> n07218149
  na5c3e4e5 --> n1053972a
  na5c3e4e5 --> n0545f658
  na5c3e4e5 --> n189df36b
  na5c3e4e5 --> ne0a3a55e
  na5c3e4e5 --> n94733d8d
  na5c3e4e5 --> n36fd8db0
  na5c3e4e5 --> n4d5f1083
  na5c3e4e5 --> ndfc16675
  na5c3e4e5 --> n1ad5950d
  na5c3e4e5 --> n29604306
  na5c3e4e5 --> n6ecd3bbe
  na5c3e4e5 --> na360b711
  na5c3e4e5 --> n2cff9bb9
  na5c3e4e5 --> n826848f7
  na5c3e4e5 --> nbeee82eb
  na5c3e4e5 --> ndb7a5772
  na5c3e4e5 --> n19cbcec9
  na5c3e4e5 --> nf5309246
  na5c3e4e5 --> n0e11a312
  na5c3e4e5 --> n1cfac2d2
  na5c3e4e5 --> nbbdc289a
  na5c3e4e5 --> n27bf89a6
  nf13854d7 --> n329b4e7f
  nf13854d7 --> n1290e76b
  n1290e76b --> n56ce2155
  n1290e76b --> ncf348e8a
  n1290e76b --> n499e6b35
  n1290e76b --> nc562331b
  n1290e76b --> nb873611b
  n1290e76b --> na759d121
  n1290e76b --> n3cba977c
  n1290e76b --> nf8bbbb48
  n1290e76b --> n625fbe86
  n1290e76b --> n8b6bd865
  n1290e76b --> nd7224177
  n1290e76b --> nfde5e0b3
  n1290e76b --> n1695a9eb
  n1290e76b --> nd69bbcae
  n1290e76b --> n8a07e8c9
  n1290e76b --> ndb9d6d0d
  n1290e76b --> na781b051
  n1290e76b --> n9f182e92
  n1290e76b --> n627532fd
  n1290e76b --> n997956c7
  n1290e76b --> nbe5e72c2
  n1290e76b --> nab3b5745
  n1290e76b --> nf3e7f6cd
  n1290e76b --> n57eaba4e
  n1290e76b --> n9c712b6f
  n1290e76b --> nc9a63eb8
  n1290e76b --> n1cc424f3
  n1290e76b --> n6ee439a2
  n1290e76b --> n4901d3aa
  n1290e76b --> n32d3926d
  n1290e76b --> n4dac126e
  n1290e76b --> n54e71fc9
  n1290e76b --> n02479ae8
  n1290e76b --> nf9d3feb0
  n1290e76b --> n8919f291
  n1290e76b --> n6d0fdaf6
  n1290e76b --> ndd421abc
  n1290e76b --> n8f69019d
  n1290e76b --> n758832ef
  n1290e76b --> n001fa8ec
  n1290e76b --> n992f1a13
  n1290e76b --> neaabcde1
  n1290e76b --> n3b68e21d
  n1290e76b --> n7c0baadd
  n1290e76b --> nbcb917d9
  n1290e76b --> n609b6091
  n1290e76b --> n81c70498
  n1290e76b --> nbc0a1798
  n1290e76b --> n93229b86
  n1290e76b --> nbba2ebd4
  n1290e76b --> nb2cec79b
  n1290e76b --> nf04c24f6
  n1290e76b --> nb3e3710a
  n1290e76b --> nb961dcd7
  n1290e76b --> nee9e5638
  n1290e76b --> nc6461a47
  n1290e76b --> na9b855cd
  n1290e76b --> n19f23813
  n1290e76b --> n49f4bc36
  n1290e76b --> n31ab447d
  n1290e76b --> n226ee7ad
  n1290e76b --> n24f71b2b
  n1290e76b --> n3b2096c6
  n1290e76b --> n8fc7baa3
  n1290e76b --> nb29ac76a
  n1290e76b --> n7199cbe0
  n1290e76b --> n7fc45f3d
  n1290e76b --> n14b68062
  n1290e76b --> n9b2009a7
  n1290e76b --> nff014850
  n1290e76b --> n58885521
  n1290e76b --> nf37d57fa
  n1290e76b --> nad24bb5d
  n1290e76b --> n1946f81b
  n1290e76b --> nca14010a
  n1290e76b --> nc32da34a
  n1290e76b --> nf7046fa2
  n1290e76b --> nd5bc4c04
  n1290e76b --> nb5948cb4
  n1290e76b --> n15cf38af
  n1290e76b --> n434587cb
  n1290e76b --> n12568d22
  n1290e76b --> nc81b7aed
  n1290e76b --> nbaeff895
  n1290e76b --> nd2266df1
  n1290e76b --> nb23b41c6
  n1290e76b --> n50970efe
  n1290e76b --> n010d505d
  n1290e76b --> n2dec2de1
  n1290e76b --> nfbd9632a
  n1290e76b --> n78cce8dc
  n1290e76b --> n430b58d5
  n1290e76b --> n79332f72
  n1290e76b --> n4466468c
  n1290e76b --> n15047a24
  n1290e76b --> ncbbe0cfe
  n1290e76b --> n5677ccf4
  n1290e76b --> n109a0919
  n1290e76b --> nc2f39ac5
  n1290e76b --> n87ac62a1
  n1290e76b --> n4a9abc62
  n1290e76b --> n99569d87
  n1290e76b --> n909234c4
  n1290e76b --> n062db515
  n1290e76b --> n75a1f63f
  n1290e76b --> n8420b94c
  n1290e76b --> n2203ac90
  n1290e76b --> ndda8151a
  n1290e76b --> n903b7b76
  n1290e76b --> nd39d1d07
  n1290e76b --> n7246f3e9
  n1290e76b --> nb1e0afc8
  n1290e76b --> n17210552
  n1290e76b --> ndf148d10
  n1290e76b --> na6ca1b65
  n1290e76b --> ne0f342a2
  n1290e76b --> nc16426f7
  n1290e76b --> n6ecec40d
  n1290e76b --> nff2b4043
  n1290e76b --> n44e0b699
  n1290e76b --> n99cc7263
  n1290e76b --> n1d11ebf6
  n1290e76b --> nee63ccfa
  n1290e76b --> n90c1d613
  nf13854d7 --> n044a9712
  nf13854d7 --> n77a6925f
  nf13854d7 --> n4b2cd23a
  nf13854d7 --> nd343473b
  nd343473b --> nf067068c
  nd343473b --> nffd866cc
  nd343473b --> n55a8ff7a
  nd343473b --> n61473d41
  nd343473b --> nc4b06297
  nd343473b --> n4bb5c5a8
  nd343473b --> nf368565b
  nd343473b --> n9ad88ab4
  nd343473b --> n1eb7365e
  nd343473b --> nb569520c
  nd343473b --> n73db19e7
  nf13854d7 --> n1693f967
  nf13854d7 --> n805d0954
```

| node | receipt uuid | referrer | payload fold | seq |
|---|---|---|---|---|
| root | `f13854d7-db2a-8c69-b8d8-57af8a1d967f` | `16094626` | `d4e825eedabbbb66` | 0 |
| cross-receipt.json | `59bee0cd-a6be-8fa1-8068-204ce8650559` | `f13854d7` | `32e33b4efc02552d` | 1 |
| cross-receipt.json#0 | `f2dc32fb-24a3-8b78-bd3f-3326f7fe1d52` | `59bee0cd` | `1dfb50c09d3ec562` | 2 |
| cross-receipt.json#1 | `32c087d2-57b0-8fb8-a50e-76169f2973cf` | `59bee0cd` | `71cd4b0253241eba` | 3 |
| cross-receipt.json#2 | `e4689a5b-3090-8d43-a298-2fc817e7564b` | `59bee0cd` | `d395906a7c1ca3bd` | 4 |
| cross-receipt.json#3 | `9f2522f0-bb1e-856b-9e95-10ef8c4a48a3` | `59bee0cd` | `6d6d0a981d52ac76` | 5 |
| cross-receipt.json#4 | `8cb99c5b-52ce-8688-87da-07368e45c0d6` | `59bee0cd` | `3206e3e260b0bda7` | 6 |
| cross-receipt.json#5 | `d9eef1f8-fa7c-88db-8abf-9059930fba99` | `59bee0cd` | `15acf0a0cff5c260` | 7 |
| cross-receipt.json#6 | `abbecdb9-d908-8d75-9d03-b18f1074acd9` | `59bee0cd` | `15196e19197c8657` | 8 |
| cross-receipt.json#7 | `ea42af2f-eb6e-86b8-b47b-a8f09ca94b90` | `59bee0cd` | `c63f9497ab57fde9` | 9 |
| cross-receipt.json#8 | `47600a8d-d21f-833e-9458-3f4c6c230aa1` | `59bee0cd` | `e153a0b9425f5a0a` | 10 |
| cross-receipt.json#9 | `6cd918da-0bb2-8e23-9045-57011906362f` | `59bee0cd` | `da63fe824b42d3b9` | 11 |
| cross-receipt.json#10 | `9b91d2b2-5476-826c-970a-88e63c06e2e5` | `59bee0cd` | `30617b9216899d69` | 12 |
| cross-receipt.json#11 | `f0392383-0d45-86e2-8aa4-4d4edd0c3d75` | `59bee0cd` | `e5d9a81caa284bd2` | 13 |
| cross-receipt.json#12 | `7a1eaa4d-9d2d-8279-8a0a-b723201317e6` | `59bee0cd` | `c926f909137e13ea` | 14 |
| cross-receipt.json#13 | `e98e956a-3db0-86d9-b9a9-ac65df0d8013` | `59bee0cd` | `970496b026f43786` | 15 |
| cross-receipt.json#14 | `5d6620d2-f029-88a4-8d56-f98913caab47` | `59bee0cd` | `eddfd8ec84208444` | 16 |
| cross-receipt.json#15 | `42715b1a-4af1-8372-9644-460bba4eab66` | `59bee0cd` | `c635847ade052b98` | 17 |
| cross-receipt.json#16 | `915c3ae8-de83-8e4a-9bc6-491c869a0e3c` | `59bee0cd` | `e73fd7a6d186d5b9` | 18 |
| cross-receipt.json#17 | `18885b4e-ec91-887d-9ef2-6867f2207678` | `59bee0cd` | `488374c9d21d1916` | 19 |
| cross-receipt.json#18 | `e4d9898b-e266-8989-92fc-d1fce5cd18b1` | `59bee0cd` | `5a3a20319bd79246` | 20 |
| cross-receipt.json#19 | `ab87c6d4-496a-8166-9bfa-67dc11064c01` | `59bee0cd` | `9722a986196949c6` | 21 |
| cross-receipt.json#20 | `d3a8bee5-8cc0-8b5d-886f-8184b3af4f92` | `59bee0cd` | `91ee2fdc046a71f2` | 22 |
| cross-receipt.json#21 | `46bda07b-41d6-8fa4-b93e-5257c7f1e4ab` | `59bee0cd` | `5464a03fab9710c1` | 23 |
| cross-receipt.json#22 | `dc3cfbc3-98c9-8899-913a-e885acb267b8` | `59bee0cd` | `7ef706f14b351d5e` | 24 |
| cross-receipt.json#23 | `e7a8c287-b0c2-867e-8eea-77424af692de` | `59bee0cd` | `38fbb18b1e27788c` | 25 |
| cross-receipt.json#24 | `80231bb2-93ad-8b8a-bdf4-891b96c32fc3` | `59bee0cd` | `740b3c309e28316f` | 26 |
| cross-receipt.json#25 | `da1eb480-f60a-8ce4-b300-4bceb7d76262` | `59bee0cd` | `e90b89ce056c1a01` | 27 |
| cross-receipt.json#26 | `eafe931b-0964-8aa7-9e01-130a7ed001b5` | `59bee0cd` | `f1e15ae62cdf1e35` | 28 |
| cross-receipt.json#27 | `04f4bd05-9021-81a5-ba95-a8b7d4ef645f` | `59bee0cd` | `d1ffa93bf956431e` | 29 |
| cross-receipt.json#28 | `9ec5157a-dc95-8ebf-88eb-495644f6968e` | `59bee0cd` | `d5266feaca6b7beb` | 30 |
| cross-receipt.json#29 | `0fe61f25-d204-8f94-b1c0-66a15deffbe3` | `59bee0cd` | `960c32a22f42e091` | 31 |
| debts-receipt.json | `17a095c0-c7ef-8ef8-8815-7dad582ab8d8` | `f13854d7` | `ddb0d39a20dd9254` | 32 |
| discovery-receipt.json | `afe9c9d4-a122-8374-9737-7a09cafede0d` | `f13854d7` | `773bd24f0f292f58` | 33 |
| discovery-receipt.json#0 | `dd795f53-633c-8893-b0f0-16286a78a58b` | `afe9c9d4` | `b81fbea12947c2a4` | 34 |
| discovery-receipt.json#1 | `4bc51e81-f33c-869a-a890-f3dd51f686ca` | `afe9c9d4` | `fb13d499f5313981` | 35 |
| discovery-receipt.json#2 | `9e823b8c-6dbc-803b-b360-2cd96126e0b9` | `afe9c9d4` | `15bfece2a2eb7f6e` | 36 |
| discovery-receipt.json#3 | `574083d4-8cfd-8dd1-b561-b889e889ad3b` | `afe9c9d4` | `439866928513d906` | 37 |
| discovery-receipt.json#4 | `bcf05d08-4c5c-8676-bbb2-001c5ff9c602` | `afe9c9d4` | `5a434500752e901f` | 38 |
| discovery-receipt.json#5 | `1e19b2b1-1ce8-8150-9953-f267a2fb123f` | `afe9c9d4` | `afaad818097e2d99` | 39 |
| discovery-receipt.json#6 | `6d69999d-c0b9-8112-86b4-bdb82ad16505` | `afe9c9d4` | `92276eeea54ec502` | 40 |
| discovery-receipt.json#7 | `32dd158f-f0a2-8255-82c5-eee4adf01c15` | `afe9c9d4` | `55e6691d18d9c9c8` | 41 |
| discovery-receipt.json#8 | `c5451838-a19b-8ef3-8be1-0a28b6bd49ba` | `afe9c9d4` | `597cb60eb7626d7b` | 42 |
| discovery-receipt.json#9 | `850d7f85-2f95-87d5-af58-fb1c7c71b9d8` | `afe9c9d4` | `05b629752aee2c9b` | 43 |
| discovery-receipt.json#10 | `0a10684d-f2b2-8d9e-99e4-4f72ce94ebac` | `afe9c9d4` | `a10cbce96361cbce` | 44 |
| discovery-receipt.json#11 | `6755532d-4388-840a-b989-779bad013e52` | `afe9c9d4` | `63cc6492be74c9aa` | 45 |
| discovery-receipt.json#12 | `5012b47a-ad34-819e-b0b7-50365bc772ab` | `afe9c9d4` | `88dcbad51ccc8d86` | 46 |
| discovery-receipt.json#13 | `5573e778-1631-812e-8645-7b3f1484c44f` | `afe9c9d4` | `d501ae000e06d578` | 47 |
| discovery-receipt.json#14 | `e6ab87cb-bc3d-8dbf-af78-56730cc4e821` | `afe9c9d4` | `b13d7e3aa8acb358` | 48 |
| discovery-receipt.json#15 | `5bf04361-ef33-8f59-8fe9-7cdea9734b49` | `afe9c9d4` | `93528f34702a28e1` | 49 |
| discovery-receipt.json#16 | `b2790d94-54d7-893b-a89d-f3a6c59bc14d` | `afe9c9d4` | `7869ae04f2749eed` | 50 |
| discovery-receipt.json#17 | `f4f7bc21-c961-824e-a1fd-e08152384a6b` | `afe9c9d4` | `d24dd1647dffc04a` | 51 |
| discovery-receipt.json#18 | `12a588bc-ded4-8ea5-b59c-4094c23257c9` | `afe9c9d4` | `f14c3ff9d5bcf377` | 52 |
| discovery-receipt.json#19 | `42ecad09-2eca-8c83-a78b-28d0494ce5b5` | `afe9c9d4` | `5692de49794242a2` | 53 |
| discovery-receipt.json#20 | `484d6ce5-de87-8348-aaf1-60250e9c18f0` | `afe9c9d4` | `45f4882f8396f42b` | 54 |
| discovery-receipt.json#21 | `4fe4ac3f-ea92-8a79-b546-d0cb5d8d5cdc` | `afe9c9d4` | `8bb59253b21c5158` | 55 |
| discovery-receipt.json#22 | `ed0c6841-efb8-85dd-8f2b-505a39aca769` | `afe9c9d4` | `5c7ec5bc47441a7e` | 56 |
| discovery-receipt.json#23 | `89868020-fb30-8c35-b881-ae2dfd7e80ed` | `afe9c9d4` | `61244c197f0344fe` | 57 |
| discovery-receipt.json#24 | `b1b493b5-0e0e-8a61-a0cc-f2624f01bfc1` | `afe9c9d4` | `fef25a9cd5ac45fc` | 58 |
| discovery-receipt.json#25 | `3309e13c-cf10-86f2-ae7e-209d7a5ecd78` | `afe9c9d4` | `a5839c0a0090d8ac` | 59 |
| discovery-receipt.json#26 | `3dacc227-d6e1-84d7-925c-dcc725a3455d` | `afe9c9d4` | `fd588187f8d8bcbc` | 60 |
| discovery-receipt.json#27 | `792cfc02-4d24-8d04-ac39-7f188e84134c` | `afe9c9d4` | `c6a6d15c3fa63243` | 61 |
| discovery-receipt.json#28 | `edaf7bff-414d-843a-950a-c6e172595b85` | `afe9c9d4` | `cc5e1dff250f9af0` | 62 |
| discovery-receipt.json#29 | `a57210f4-6062-8f00-b5af-3e33095bf0cb` | `afe9c9d4` | `02fbfbbd6fc24ac8` | 63 |
| discovery-receipt.json#30 | `829d27be-ef0e-8d8e-bcc9-ecd52fc2d9c8` | `afe9c9d4` | `fd34751b916815a5` | 64 |
| discovery-receipt.json#31 | `7a7cf064-8fa0-8410-80a9-aca29aa8144a` | `afe9c9d4` | `c2ce36187b72d342` | 65 |
| discovery-receipt.json#32 | `360e8a9c-ec2e-8a81-9c5c-f05fdfc701f3` | `afe9c9d4` | `49d93c7c40f0f133` | 66 |
| discovery-receipt.json#33 | `5f995c32-302b-8c62-91dc-506ba587e4db` | `afe9c9d4` | `832fb763d5098ad4` | 67 |
| discovery-receipt.json#34 | `282eb83a-e6ad-8f60-976b-5d0754711359` | `afe9c9d4` | `fc2b9b71372e6e0b` | 68 |
| discovery-receipt.json#35 | `09ade90e-f9b4-8119-aa8a-0c2262df31f5` | `afe9c9d4` | `a12c1ec0442dae4e` | 69 |
| discovery-receipt.json#36 | `cc687e45-c894-8c79-8a4e-e21aa02f1c08` | `afe9c9d4` | `3bed177b94ec7f6e` | 70 |
| discovery-receipt.json#37 | `e2d90249-5bbb-8076-8064-e0d242c01a88` | `afe9c9d4` | `9fc19c41115ef1b5` | 71 |
| discovery-receipt.json#38 | `c4926d91-d6fe-8133-9335-b10a99d7f4e0` | `afe9c9d4` | `f65ada3caf5e0310` | 72 |
| discovery-receipt.json#39 | `969ef9fe-460c-8977-adfa-8abe46bc01f3` | `afe9c9d4` | `984a0119a58fa775` | 73 |
| discovery-receipt.json#40 | `d16d6333-7631-812a-acab-be2ef1afd38d` | `afe9c9d4` | `55d931fde91914f0` | 74 |
| discovery-receipt.json#41 | `d8dea17b-b7c1-8e4d-bfb1-d3d5f2927531` | `afe9c9d4` | `8419438e3d4b356c` | 75 |
| discovery-receipt.json#42 | `dacbf7f3-4d05-826c-9f80-3320d3d23d04` | `afe9c9d4` | `b538b73ca7361ee2` | 76 |
| discovery-receipt.json#43 | `0a979d4c-1323-8a91-8635-bed264d22f43` | `afe9c9d4` | `8fb58c1d15803bce` | 77 |
| discovery-receipt.json#44 | `da0d78c9-849c-8e94-824c-0598197a3bf9` | `afe9c9d4` | `785b5d1e8faab94f` | 78 |
| discovery-receipt.json#45 | `24468a1e-f320-8359-8c0f-9fe3215f9699` | `afe9c9d4` | `c0511efb27ea8ed8` | 79 |
| discovery-receipt.json#46 | `8c75cd1b-81d4-886a-af35-ad4bd3b131a4` | `afe9c9d4` | `3935d91be72f06df` | 80 |
| discovery-receipt.json#47 | `ff71bfb6-01fe-837a-8659-6d28d7431d63` | `afe9c9d4` | `36c662bee868f77e` | 81 |
| discovery-receipt.json#48 | `6a8e7d99-1307-818e-b2d5-f2b53c42996a` | `afe9c9d4` | `5cdddbb61071c24a` | 82 |
| discovery-receipt.json#49 | `a30a6dc1-e980-80b5-b411-b15491d99ae7` | `afe9c9d4` | `0807ef93f1d0224e` | 83 |
| discovery-receipt.json#50 | `1b12d9b9-ac6a-8e10-b83a-2b1717939f79` | `afe9c9d4` | `08adc8d8676c6002` | 84 |
| discovery-receipt.json#51 | `2f8d9069-eeba-81c1-bfd6-d6bea949cf6b` | `afe9c9d4` | `851639718b49f5c1` | 85 |
| discovery-receipt.json#52 | `bf35dfef-6c99-88bc-aa3a-48c2c7da0a2e` | `afe9c9d4` | `84fbf4fbb046b6e3` | 86 |
| discovery-receipt.json#53 | `f649fde7-0d5e-852f-b63c-2ad3ec9fb20e` | `afe9c9d4` | `ad55dbb27e65b19f` | 87 |
| discovery-receipt.json#54 | `7fa13309-034d-848b-999f-0106edeb2f84` | `afe9c9d4` | `1bc7f5d3220049db` | 88 |
| discovery-receipt.json#55 | `b22974ca-3a55-8c3c-ab8c-2a647c33cd5c` | `afe9c9d4` | `3bb1f02f0dcd9f10` | 89 |
| discovery-receipt.json#56 | `cd23cb69-6c2d-80dd-acdb-a6d324585c57` | `afe9c9d4` | `8bf8d1110f2521cf` | 90 |
| discovery-receipt.json#57 | `6a1ba18a-a26e-81c2-afbd-956b9758c345` | `afe9c9d4` | `36b2a9ad458d6164` | 91 |
| discovery-receipt.json#58 | `925ce825-f7d4-8582-9e29-4fdf3cf36018` | `afe9c9d4` | `2fe389238f541cb3` | 92 |
| discovery-receipt.json#59 | `18215640-d9cb-89c0-8af7-93dea7813f15` | `afe9c9d4` | `eabcb5133f82430d` | 93 |
| discovery-receipt.json#60 | `a0e640e6-97e8-810a-b68b-ed627857e846` | `afe9c9d4` | `f5ba04ee4a363773` | 94 |
| discovery-receipt.json#61 | `3110c5b6-e0b6-8f54-ac3b-c8da717b396a` | `afe9c9d4` | `4ce34ba596fb0c48` | 95 |
| discovery-receipt.json#62 | `d2164923-8703-8656-94e1-4861bfaacc6e` | `afe9c9d4` | `b8cebd8396daf45c` | 96 |
| discovery-receipt.json#63 | `a901f8a9-a3a8-8a17-ab06-6c07b58f9f61` | `afe9c9d4` | `12368a16a8e36c5e` | 97 |
| discovery-receipt.json#64 | `1b39f28e-35fd-8b51-acf4-47ccfb3f2239` | `afe9c9d4` | `9ec9b02365db1f19` | 98 |
| discovery-receipt.json#65 | `c87970d2-b4ca-836b-80a4-3d6efc2e67f0` | `afe9c9d4` | `b83eca284f9b1307` | 99 |
| discovery-receipt.json#66 | `7ab4e4ff-e987-83ca-82ba-e301ff3ab5f6` | `afe9c9d4` | `7e5d60fd80a6010b` | 100 |
| discovery-receipt.json#67 | `60dd185f-a444-8284-b154-d398de2e9b85` | `afe9c9d4` | `6a36996a59eb4e15` | 101 |
| discovery-receipt.json#68 | `82032d05-4d97-8218-9234-b8b7b2802278` | `afe9c9d4` | `7b1a316a3b2468fa` | 102 |
| discovery-receipt.json#69 | `0bcd42ae-198b-847c-8714-57cd70c06491` | `afe9c9d4` | `09dabdf29c5a6131` | 103 |
| discovery-receipt.json#70 | `a447cbaf-715a-8cd3-a165-c6d31c8c8083` | `afe9c9d4` | `ca6fd18a9e14bf1e` | 104 |
| discovery-receipt.json#71 | `4409fea6-f0db-8b39-a3ff-b18d7eaf0623` | `afe9c9d4` | `c5c2a6b4d2d8b6ad` | 105 |
| discovery-receipt.json#72 | `b45bc68c-6e68-8839-8624-13cbf3dac750` | `afe9c9d4` | `d2741a8ba6883585` | 106 |
| discovery-receipt.json#73 | `4554b694-a6a7-8047-918e-81fef5f126d2` | `afe9c9d4` | `92e9a6898c451bb9` | 107 |
| discovery-receipt.json#74 | `4066b873-4aa0-8c96-8d1f-6010ab1114d0` | `afe9c9d4` | `a72347b2fe996dce` | 108 |
| discovery-receipt.json#75 | `cb594885-d9fd-8abd-8919-d5d7c9a399f0` | `afe9c9d4` | `bdfdc0be03b6abba` | 109 |
| discovery-receipt.json#76 | `56427665-d6d3-8167-84c9-2d06af6eed54` | `afe9c9d4` | `fe5fa02df926b350` | 110 |
| discovery-receipt.json#77 | `3a2c568f-e48b-8af4-9b1c-a145b26fb2bf` | `afe9c9d4` | `a4b41d16c19028d3` | 111 |
| discovery-receipt.json#78 | `a14323c6-a470-8ea9-862c-8b5b4612c7e2` | `afe9c9d4` | `a8d652f57f302045` | 112 |
| discovery-receipt.json#79 | `f01ba095-7ffa-8a5e-9f8d-ca69a5a80da6` | `afe9c9d4` | `8ae5accd3c101747` | 113 |
| discovery-receipt.json#80 | `880fa236-ad4d-8175-8bd2-f6a87e66bb29` | `afe9c9d4` | `b0ce32e7a390af62` | 114 |
| discovery-receipt.json#81 | `16f8699c-b48c-8bb0-9f4c-29cf8813559e` | `afe9c9d4` | `456ded2664e8a23c` | 115 |
| discovery-receipt.json#82 | `8b4c9531-147f-87ae-b4b9-b403c1fdd36e` | `afe9c9d4` | `abdfe71a4d6c906e` | 116 |
| discovery-receipt.json#83 | `c8d49a0e-44c6-8392-b1bd-ba49e6eaa2bf` | `afe9c9d4` | `89242ae5cb5bd523` | 117 |
| discovery-receipt.json#84 | `26f88300-a8bb-85c5-b71e-47d6334bddcf` | `afe9c9d4` | `1556fcaf0368d403` | 118 |
| discovery-receipt.json#85 | `af0c2829-bfc2-8f21-85cc-47b830b3f799` | `afe9c9d4` | `6d476ff3005b766a` | 119 |
| discovery-receipt.json#86 | `6ca40ad3-7824-801b-a673-f97e0b109063` | `afe9c9d4` | `2cee7900a99ea4be` | 120 |
| discovery-receipt.json#87 | `04664ab7-c50b-8241-be95-594c2fc399c1` | `afe9c9d4` | `7aa2eaa185a6b234` | 121 |
| discovery-receipt.json#88 | `fd711c8a-00e8-8cd6-9483-21b437981dd0` | `afe9c9d4` | `941085c88b28ac29` | 122 |
| discovery-receipt.json#89 | `b81f66a5-a7fc-8524-af9d-cac6e445f44f` | `afe9c9d4` | `49412412aa8009b6` | 123 |
| discovery-receipt.json#90 | `c7f9b0fd-5092-8576-bf19-0d1b51a195c2` | `afe9c9d4` | `a6fb802912ff9f43` | 124 |
| discovery-receipt.json#91 | `77473884-32ca-81d2-84e3-dbb84cec55a2` | `afe9c9d4` | `b80414540fa633ab` | 125 |
| discovery-receipt.json#92 | `ae96244a-2eb5-8524-af50-4707893e7861` | `afe9c9d4` | `e8c2287ed498c658` | 126 |
| discovery-receipt.json#93 | `444eb698-943a-8826-ba55-3890aaf3b666` | `afe9c9d4` | `301a916d118dc686` | 127 |
| discovery-receipt.json#94 | `ec253fd5-017d-8bf7-9920-98309080ced2` | `afe9c9d4` | `d52f9310aa26719b` | 128 |
| discovery-receipt.json#95 | `e731cf1b-739d-86b4-8e56-093574c32957` | `afe9c9d4` | `d88047485009070d` | 129 |
| discovery-receipt.json#96 | `7dd371a5-5811-8fe7-8548-329ed539e903` | `afe9c9d4` | `57fa5fbc57608d90` | 130 |
| discovery-receipt.json#97 | `17de9fe6-3edd-8a46-9e14-8f94e9969ea5` | `afe9c9d4` | `e426f3b25b47fb5a` | 131 |
| discovery-receipt.json#98 | `3af6ca57-2e89-826e-9f6b-d26e73fc8291` | `afe9c9d4` | `b0c0e1a53d0354e5` | 132 |
| discovery-receipt.json#99 | `dde02889-3a32-8c92-95cd-0caab6369b44` | `afe9c9d4` | `6013df5ed90b24ef` | 133 |
| discovery-receipt.json#100 | `81776625-28d8-818f-92c6-f47b95619392` | `afe9c9d4` | `15fe8aa64b3744de` | 134 |
| discovery-receipt.json#101 | `dbfec671-4329-84f4-b851-f70a7f2f77e9` | `afe9c9d4` | `dd782dacfef4b8b0` | 135 |
| discovery-receipt.json#102 | `f7833ff0-64de-8477-b322-2ca50ce05229` | `afe9c9d4` | `93edb7ec307e71f2` | 136 |
| discovery-receipt.json#103 | `fe8b8d2a-4cb3-871e-99f9-ae0dcdbc0a5a` | `afe9c9d4` | `30f1e5fd921c05db` | 137 |
| discovery-receipt.json#104 | `7bfcef91-2caf-8598-8710-1c0a585650ed` | `afe9c9d4` | `e2249bddfc7fd8b5` | 138 |
| discovery-receipt.json#105 | `9681d343-6a6a-883a-b6b2-12ee0d19df44` | `afe9c9d4` | `960499556efa87e0` | 139 |
| discovery-receipt.json#106 | `1ea292ea-1423-81c3-bc1f-6a43f8e46ee2` | `afe9c9d4` | `8721add579a464de` | 140 |
| discovery-receipt.json#107 | `cf87ce6e-fc47-8736-a2dc-269b63eb68b8` | `afe9c9d4` | `4d259ab4a4612983` | 141 |
| discovery-receipt.json#108 | `8d5c5cf4-2978-80ad-8dc9-63cd756cbde0` | `afe9c9d4` | `b226d90ed35017e8` | 142 |
| discovery-receipt.json#109 | `9a57549c-2559-8baa-af59-07d2cabb47c3` | `afe9c9d4` | `a5645eee404403ce` | 143 |
| discovery-receipt.json#110 | `181df217-31be-80b3-9edf-b7ca053b1cce` | `afe9c9d4` | `e02ae8d65c73fa8b` | 144 |
| discovery-receipt.json#111 | `37909430-2281-8ed5-ae99-f5dc3448fb09` | `afe9c9d4` | `f474467dd74484bf` | 145 |
| discovery-receipt.json#112 | `541c9b04-2776-8ce4-9bc7-b289907929f6` | `afe9c9d4` | `98b345f5e55e385c` | 146 |
| discovery-receipt.json#113 | `ed5be4da-6b45-8617-bb35-2626c84a4c0a` | `afe9c9d4` | `5d012e604fddd338` | 147 |
| discovery-receipt.json#114 | `242ce724-7336-8958-9c4d-abe5e73a0df9` | `afe9c9d4` | `d912361ef31afeb0` | 148 |
| discovery-receipt.json#115 | `ac2e1072-468c-8548-ad90-a3358fbf5573` | `afe9c9d4` | `d9f38d35e066abb3` | 149 |
| discovery-receipt.json#116 | `55806a8c-5932-8b6e-bd14-edee57f37c4f` | `afe9c9d4` | `c345210ac8e49750` | 150 |
| discovery-receipt.json#117 | `5ee5810a-e6d7-821f-a523-2c7fd626be23` | `afe9c9d4` | `0464825320ded6e4` | 151 |
| discovery-receipt.json#118 | `d03cce69-75b2-87c2-bf32-c8738186c6fa` | `afe9c9d4` | `8333fc9e46bdafe5` | 152 |
| discovery-receipt.json#119 | `a1643618-152b-8194-966e-7e0eed4f88ac` | `afe9c9d4` | `6775f08cdab910a3` | 153 |
| discovery-receipt.json#120 | `a7c5ef03-68ae-8b9f-ac3e-8fcf7b798e3d` | `afe9c9d4` | `df5e904fa500f6f2` | 154 |
| discovery-receipt.json#121 | `0b47dc19-0219-8e87-9e4d-062a44d60b62` | `afe9c9d4` | `3393a589a6209096` | 155 |
| discovery-receipt.json#122 | `0bd2d2c0-5752-84c4-bde8-ae0b3322ac1f` | `afe9c9d4` | `4120f26873e60328` | 156 |
| discovery-receipt.json#123 | `bb94ee72-8e90-8595-b51f-4d01aa9f29e3` | `afe9c9d4` | `db741cbf6ea2274c` | 157 |
| discovery-receipt.json#124 | `f1202f14-d9e5-8cde-84d6-db793d338f1d` | `afe9c9d4` | `fe2a91f34bf74286` | 158 |
| discovery-receipt.json#125 | `4bdd3665-6870-8f52-bc44-912434299574` | `afe9c9d4` | `826df5162918f7d9` | 159 |
| discovery-receipt.json#126 | `d6287cac-bc57-8958-8b3c-06f9958282a7` | `afe9c9d4` | `44bc6472ae3caf1f` | 160 |
| discovery-receipt.json#127 | `169732af-3f09-8f14-a618-b7c59bf31f77` | `afe9c9d4` | `b52a37b208d8e9d4` | 161 |
| discovery-receipt.json#128 | `1158e3c8-0b34-88c6-a388-ad9bdd332a53` | `afe9c9d4` | `4c406c1336acba42` | 162 |
| discovery-receipt.json#129 | `0d55bbd6-4119-8629-b7db-3fd6cadf7669` | `afe9c9d4` | `b1b0112fa01f0e47` | 163 |
| discovery-receipt.json#130 | `f9aab39a-95f9-882d-96d8-21ecddb21d96` | `afe9c9d4` | `ec07552ae992aa1f` | 164 |
| discovery-receipt.json#131 | `eef0489d-1078-85a4-9949-1fbe9e2346d3` | `afe9c9d4` | `df99146848a3a0c1` | 165 |
| discovery-receipt.json#132 | `66c30857-ddaa-8d7b-86d0-86b4a0869342` | `afe9c9d4` | `6d3168c3f43ef3d2` | 166 |
| discovery-receipt.json#133 | `0a2f576d-35ed-827c-ae48-8c18db0bd1e0` | `afe9c9d4` | `7fd2a1bb33d1868c` | 167 |
| discovery-receipt.json#134 | `22764d00-0978-8fa9-8f43-44bdfa16efb7` | `afe9c9d4` | `c6892520d1ddef26` | 168 |
| discovery-receipt.json#135 | `d9fcfa8c-6321-8e6a-a32f-289cd851e986` | `afe9c9d4` | `4cd19e884afce7d7` | 169 |
| discovery-receipt.json#136 | `dd8e0473-2243-85ca-a7f8-6a368509b315` | `afe9c9d4` | `e7fb005ab43a1b55` | 170 |
| discovery-receipt.json#137 | `8c160b0e-b8c9-80bd-9fda-d6c2883f3666` | `afe9c9d4` | `2ca80e120f0bb862` | 171 |
| discovery-receipt.json#138 | `90983efc-f898-84f4-bd68-869823eda32c` | `afe9c9d4` | `4351d87135dbbd00` | 172 |
| discovery-receipt.json#139 | `82d12245-1eb6-80bb-bfa7-7830d2a10a05` | `afe9c9d4` | `8c8022eb19799b13` | 173 |
| discovery-receipt.json#140 | `4643c413-4e96-8828-b0d0-7f6800783ecb` | `afe9c9d4` | `7d03146c1805a91b` | 174 |
| discovery-receipt.json#141 | `53b025cd-c497-8af1-a618-8858296d912d` | `afe9c9d4` | `91cfb7bd7ea728d5` | 175 |
| discovery-receipt.json#142 | `84953e09-c9b6-8b61-8dfe-ba48edea6327` | `afe9c9d4` | `3fb264919eee087a` | 176 |
| discovery-receipt.json#143 | `9385c5bd-bcee-8c5a-8e6e-f705dd12f6f2` | `afe9c9d4` | `ccbccf78fd0b268c` | 177 |
| discovery-receipt.json#144 | `0593c74e-6c3e-8e5d-b314-3dfbcaf6be73` | `afe9c9d4` | `afb182415a86fd9c` | 178 |
| discovery-receipt.json#145 | `ac0b7dcc-201e-8443-8ac5-760e2268fe2b` | `afe9c9d4` | `88779156db00f353` | 179 |
| discovery-receipt.json#146 | `5d9a9df0-5af2-804e-86d8-8eb65c10b967` | `afe9c9d4` | `2520995372c3f5cf` | 180 |
| discovery-receipt.json#147 | `cbcaa9b7-4fc3-8ab1-876e-ceea392b8754` | `afe9c9d4` | `3895897059b9c14a` | 181 |
| discovery-receipt.json#148 | `74587fc5-dc33-83d6-a1a2-b47c4038503c` | `afe9c9d4` | `808b97c8d736188b` | 182 |
| discovery-receipt.json#149 | `18c8baaf-c425-8253-bf16-3377ee2ff197` | `afe9c9d4` | `19a5d9b97e14b705` | 183 |
| discovery-receipt.json#150 | `4a75cd4a-a587-8338-9c3a-828fea9a92a1` | `afe9c9d4` | `85648634f05e78f6` | 184 |
| discovery-receipt.json#151 | `851f5292-6ea9-849b-98df-7893cf745c6a` | `afe9c9d4` | `dc3628920b93d2e0` | 185 |
| discovery-receipt.json#152 | `e0a61d76-1da8-8d76-86d7-8a0ee687f2c5` | `afe9c9d4` | `b47575c2fabd594a` | 186 |
| discovery-receipt.json#153 | `497e8648-46c7-8e56-beb9-c5b20423cc46` | `afe9c9d4` | `b08d4fda51c70e96` | 187 |
| discovery-receipt.json#154 | `b06df231-3944-894c-a408-2b734aba7f90` | `afe9c9d4` | `ee0b71787e57ba32` | 188 |
| discovery-receipt.json#155 | `0e5408a3-8dcd-88e9-8f30-c715fb6394a6` | `afe9c9d4` | `d85edf24fe34bf20` | 189 |
| discovery-receipt.json#156 | `145fcc88-f31d-87d2-beda-5707f1bef164` | `afe9c9d4` | `3c6c6bdf4cc45e94` | 190 |
| discovery-receipt.json#157 | `74223d05-232e-88c1-b723-72634ff71f5c` | `afe9c9d4` | `cc04c7a35f05233e` | 191 |
| discovery-receipt.json#158 | `f4ed3226-519d-8090-a007-c3545fff894f` | `afe9c9d4` | `7f000dc39ccaf98b` | 192 |
| discovery-receipt.json#159 | `b36bdb50-fdf8-8fcb-9770-9fc8658d8891` | `afe9c9d4` | `7f3e2af7a56efadb` | 193 |
| discovery-receipt.json#160 | `f0a53845-a59b-88fa-b533-1a23a05084f9` | `afe9c9d4` | `32582ffa2803266b` | 194 |
| discovery-receipt.json#161 | `453712e0-45b8-84dd-879d-a0206c5c2ba8` | `afe9c9d4` | `c23cfdb4034f4136` | 195 |
| discovery-receipt.json#162 | `d23ab6c2-9626-80eb-aec9-73aa1d489437` | `afe9c9d4` | `7ca59c62446bffbd` | 196 |
| discovery-receipt.json#163 | `625466b9-c7c1-894d-9387-65d7e7b722d3` | `afe9c9d4` | `5320d81848a70fa2` | 197 |
| discovery-receipt.json#164 | `e6f5b301-b401-8bf2-a58c-4980524af1f0` | `afe9c9d4` | `d467d92066f11f83` | 198 |
| discovery-receipt.json#165 | `130445ca-2c71-891f-a26d-5f9741246f72` | `afe9c9d4` | `6f5e0012fce73398` | 199 |
| discovery-receipt.json#166 | `cf1243ee-d027-86de-887e-fbced39907d2` | `afe9c9d4` | `598b54ac4f12e509` | 200 |
| discovery-receipt.json#167 | `2362cf15-5b04-845c-b7d0-9195ea81cb45` | `afe9c9d4` | `3ad07e202ddf9908` | 201 |
| discovery-receipt.json#168 | `c8edb929-5f36-8338-b547-c3123a52ef5c` | `afe9c9d4` | `921676a512dc89bf` | 202 |
| discovery-receipt.json#169 | `9da9f171-1938-885e-ba21-8f5b1ffb1aba` | `afe9c9d4` | `2d29fce8d0e4d89b` | 203 |
| discovery-receipt.json#170 | `c60edbe9-a0f1-84cc-91d2-75e36c2a1be8` | `afe9c9d4` | `2d56bf8f4de3e191` | 204 |
| discovery-receipt.json#171 | `7b1e23a9-4ba2-8fcf-8cc0-33c1eb723b41` | `afe9c9d4` | `61e9f2df1e343857` | 205 |
| discovery-receipt.json#172 | `64b60a04-dbc6-861d-9025-4eebf6a47b63` | `afe9c9d4` | `68520e1596c20912` | 206 |
| discovery-receipt.json#173 | `296104ab-2a39-8515-baca-fd302457b22d` | `afe9c9d4` | `aa3d3fafa654b883` | 207 |
| discovery-receipt.json#174 | `def951c7-67e6-8498-87d4-fd507720fa68` | `afe9c9d4` | `1fce4c5edecd7058` | 208 |
| discovery-receipt.json#175 | `8820b65b-ee24-85f0-b207-c21be42a7467` | `afe9c9d4` | `df708985cb572ed8` | 209 |
| discovery-receipt.json#176 | `038d5e4f-298c-8989-890f-444d65724fae` | `afe9c9d4` | `c10c63eb2eacb74f` | 210 |
| discovery-receipt.json#177 | `d84ecec2-c49a-83d1-8e8e-6f854cba1dd7` | `afe9c9d4` | `0bce590949b1a3a5` | 211 |
| discovery-receipt.json#178 | `92725ea5-f4b6-8634-8a75-a0fb6e357aeb` | `afe9c9d4` | `6a6534b1f188e4e6` | 212 |
| discovery-receipt.json#179 | `d7493b33-fc79-844a-b84e-4ce2c0e45076` | `afe9c9d4` | `c33804ef1343ea40` | 213 |
| discovery-receipt.json#180 | `8d1899ee-4534-8cf9-93a7-e63ac1c6d7c5` | `afe9c9d4` | `83515dbbf9ca19ea` | 214 |
| discovery-receipt.json#181 | `b385b8ae-1dda-86b7-8612-db75d46b9d26` | `afe9c9d4` | `9838855f82ec4297` | 215 |
| discovery-receipt.json#182 | `9cfc0277-993f-879a-90ea-db2c482bcb05` | `afe9c9d4` | `61281c352e026697` | 216 |
| discovery-receipt.json#183 | `b94333c4-bab4-8b7b-8212-b4739e45e076` | `afe9c9d4` | `7da277908a9bf78c` | 217 |
| discovery-receipt.json#184 | `d0dc64d3-41ad-8d14-8ae7-063f150a1821` | `afe9c9d4` | `9d66222e5d69dc2d` | 218 |
| discovery-receipt.json#185 | `b930acb0-f03c-8739-8ef1-21ae3066e2ad` | `afe9c9d4` | `fa1857cf2b5e7635` | 219 |
| discovery-receipt.json#186 | `9ab50410-558a-8e44-8ac3-d535b8d81430` | `afe9c9d4` | `87f4b7c171574f5e` | 220 |
| discovery-receipt.json#187 | `820e86ec-61b3-8590-8cc0-92e64f242621` | `afe9c9d4` | `0e79bad6eb8aaf67` | 221 |
| discovery-receipt.json#188 | `0a94bc20-acf0-8adc-9b2e-97db4869c927` | `afe9c9d4` | `6b13d4b2d843ab7a` | 222 |
| discovery-receipt.json#189 | `4aa7ddda-9bed-8fd1-b068-2fd709f17f5c` | `afe9c9d4` | `99e90c3e6b55c6dc` | 223 |
| discovery-receipt.json#190 | `cfb54137-4455-8b1e-acad-d445ea01d137` | `afe9c9d4` | `4fb00c115dc42784` | 224 |
| discovery-receipt.json#191 | `89e4b844-0f2d-8cdc-895f-dc4d10fa1927` | `afe9c9d4` | `3093bd1487680509` | 225 |
| discovery-receipt.json#192 | `4144338f-9710-89ee-affe-187b2fa07f81` | `afe9c9d4` | `7cc9084e81f03f50` | 226 |
| discovery-receipt.json#193 | `273381f3-2e0e-8645-af2f-882ab7e6d93e` | `afe9c9d4` | `1cbd72c282689b20` | 227 |
| discovery-receipt.json#194 | `a8464e00-5a36-8c1c-b030-8914fb468d6f` | `afe9c9d4` | `1f6e1f663cfacf77` | 228 |
| discovery-receipt.json#195 | `da83a9e6-4a9d-86dc-90b9-e5b9717ffe7d` | `afe9c9d4` | `5776a3358a6e9a78` | 229 |
| discovery-receipt.json#196 | `998c0563-18ea-8c53-9a90-e1560f5d5e8f` | `afe9c9d4` | `b2560673946779ab` | 230 |
| discovery-receipt.json#197 | `a5040d99-aab9-8415-866e-fb553f84f80e` | `afe9c9d4` | `775228158b41822e` | 231 |
| discovery-receipt.json#198 | `da31f184-16a8-8db7-9861-f430101a39fa` | `afe9c9d4` | `b71fc29da858bd2f` | 232 |
| discovery-receipt.json#199 | `a0624434-70a3-85d0-905c-68ece2f706ac` | `afe9c9d4` | `8f5adcc8b9a28a4f` | 233 |
| discovery-receipt.json#200 | `4c82fbda-c5a4-85e9-a255-e820154ae05d` | `afe9c9d4` | `b183eddb4f0bf5c7` | 234 |
| discovery-receipt.json#201 | `885222c4-627f-8fd3-8323-23ea29128ac7` | `afe9c9d4` | `340adf806dc1c91e` | 235 |
| discovery-receipt.json#202 | `2325ad64-f20e-880f-93ca-d9f74bfc0a12` | `afe9c9d4` | `be76479034765de3` | 236 |
| discovery-receipt.json#203 | `e2434bab-fe98-8c85-bbc0-a54790d101e7` | `afe9c9d4` | `0934c24c6503521a` | 237 |
| discovery-receipt.json#204 | `0de805d1-3c04-85a5-aa7f-a4a929784b07` | `afe9c9d4` | `bfeb5e0f8de168a9` | 238 |
| discovery-receipt.json#205 | `b92cf8f9-79df-80da-beb3-3dcdd0cea6b6` | `afe9c9d4` | `e8c0387a3e9d33c9` | 239 |
| discovery-receipt.json#206 | `21cc5f5b-bbf5-8f1a-aeaf-986aba4f9f04` | `afe9c9d4` | `08ddd53c30fb35b5` | 240 |
| discovery-receipt.json#207 | `9e6f98e9-a92c-8264-ad3b-fa99bc94ebdb` | `afe9c9d4` | `8f14f50d30eddc08` | 241 |
| discovery-receipt.json#208 | `28f3bf55-7f5d-82ce-b64d-cc24b3355141` | `afe9c9d4` | `80a068db015e620b` | 242 |
| discovery-receipt.json#209 | `c36442b9-c2c1-87b2-8346-7f9f7cf09cc0` | `afe9c9d4` | `fcb906ed5dc1acf6` | 243 |
| discovery-receipt.json#210 | `f2a7f6eb-35e6-8eec-ba72-6f15da5ffb15` | `afe9c9d4` | `973b211ededb0199` | 244 |
| discovery-receipt.json#211 | `78e52ddf-dd6d-8d59-98b7-eb2c5f0b9bb8` | `afe9c9d4` | `15ce0fca3069fa4f` | 245 |
| discovery-receipt.json#212 | `cded2c90-9113-8a4f-ae8c-739da9395b29` | `afe9c9d4` | `807625ec60fae795` | 246 |
| discovery-receipt.json#213 | `cd74ecc1-331e-8007-8a49-0211f4f18efb` | `afe9c9d4` | `658b4c9f830d1c4d` | 247 |
| discovery-receipt.json#214 | `7425d975-7832-8086-8c85-64729124d742` | `afe9c9d4` | `350239ad42ad3a31` | 248 |
| discovery-receipt.json#215 | `32569fe7-199a-8305-a797-0bcd63463a41` | `afe9c9d4` | `03c74cf56f89d1ad` | 249 |
| discovery-receipt.json#216 | `6f2c7a2b-0783-8f36-8071-1de760879682` | `afe9c9d4` | `03651aef1939c990` | 250 |
| discovery-receipt.json#217 | `e304f11d-b3c8-8fef-82a6-0e723ac75d37` | `afe9c9d4` | `3ca172c3d500d7d1` | 251 |
| discovery-receipt.json#218 | `b06f8edb-ed35-8126-bc82-b851ce0cdb90` | `afe9c9d4` | `7fd7593adb1c7784` | 252 |
| discovery-receipt.json#219 | `672fa686-216d-8604-9deb-046e0f6dcef3` | `afe9c9d4` | `8709bdf57536f4b8` | 253 |
| discovery-receipt.json#220 | `ba237817-47ed-8e5b-9c90-31579785c47a` | `afe9c9d4` | `c5de1f2f44e4418b` | 254 |
| discovery-receipt.json#221 | `0c25e998-db02-8d02-9bef-a8abdbca33e7` | `afe9c9d4` | `f6f721aec81300bf` | 255 |
| discovery-receipt.json#222 | `c5cbc849-439d-8c8b-bb4b-6e4fc8c026de` | `afe9c9d4` | `212212a95a7bdb59` | 256 |
| discovery-receipt.json#223 | `f63bc4fe-42f7-81a9-b1c7-26df2b7ef842` | `afe9c9d4` | `55ea669f107b23d8` | 257 |
| discovery-receipt.json#224 | `f4c95316-c61f-8ab2-87e0-e503614a0163` | `afe9c9d4` | `fd92843d186def66` | 258 |
| discovery-receipt.json#225 | `2d09d8bd-d789-8436-b6fe-93a7da63e4bd` | `afe9c9d4` | `74ed838974541991` | 259 |
| discovery-receipt.json#226 | `986f8756-90f7-8480-9875-53438084ed97` | `afe9c9d4` | `318791b61c5211ed` | 260 |
| discovery-receipt.json#227 | `16f180be-2dd1-832c-a417-3c834f820a18` | `afe9c9d4` | `7d7ae99e77285750` | 261 |
| discovery-receipt.json#228 | `4529336c-eda2-81c8-84be-fb95f369dbb3` | `afe9c9d4` | `5bde732c5d1bc17a` | 262 |
| discovery-receipt.json#229 | `cb0268d6-6a1f-8099-beb9-fcb40c050835` | `afe9c9d4` | `5df9855ae52c2554` | 263 |
| flaws-receipt.json | `c5ba3923-a4e4-812c-91d2-e688ad4b70b0` | `f13854d7` | `4c375110f22b54d5` | 264 |
| formulas-receipt.json | `009ce86d-793e-83e3-9862-f0db65393f89` | `f13854d7` | `6048947560a8c8f5` | 265 |
| formulas-receipt.json#0 | `b4df478e-ff30-81a6-adfb-1b61e9a44eeb` | `009ce86d` | `0058da71f50b662b` | 266 |
| formulas-receipt.json#1 | `bba1c8d7-e352-8f53-b3ad-653ebfff81b8` | `009ce86d` | `5ba6f4caf9d2f0ec` | 267 |
| formulas-receipt.json#2 | `bd2f2f6e-d2e8-863e-9684-5832187bb77c` | `009ce86d` | `fb53a12c3e4dc86b` | 268 |
| formulas-receipt.json#3 | `be2b7953-7792-8ad6-a144-cea5c3cf7fe2` | `009ce86d` | `0327cdf3ff5ff25c` | 269 |
| formulas-receipt.json#4 | `e5fa3a9b-f167-8abe-9b01-cdea44abc081` | `009ce86d` | `febc404cf0b62b11` | 270 |
| formulas-receipt.json#5 | `0022d77f-b01b-824e-862d-b33f605640bb` | `009ce86d` | `8a53cf1be2c01b2a` | 271 |
| formulas-receipt.json#6 | `6c133681-e272-85e5-9bea-ea1699b0e258` | `009ce86d` | `c85deb48fadc165a` | 272 |
| formulas-receipt.json#7 | `29e6a011-2462-8f9a-9650-3aa616e939c5` | `009ce86d` | `da9991e7f620c657` | 273 |
| formulas-receipt.json#8 | `619fe335-a87a-81f2-800e-49450a368810` | `009ce86d` | `4a2f9ced771365cf` | 274 |
| formulas-receipt.json#9 | `a16f5c31-1cc1-8491-bf3d-deb3e7fea42a` | `009ce86d` | `e9433487a11810e4` | 275 |
| formulas-receipt.json#10 | `16041ea5-0c23-8329-943f-bbfdef354221` | `009ce86d` | `a7c5a55ec042da39` | 276 |
| formulas-receipt.json#11 | `c0bec0a9-de3e-822d-a9e2-2744ca1b0704` | `009ce86d` | `85f4227e8f6975fd` | 277 |
| formulas-receipt.json#12 | `2ac7df07-cd31-8854-a8fb-2edf307e3f46` | `009ce86d` | `3ecd407b75aeee80` | 278 |
| formulas-receipt.json#13 | `552dfb9d-2aae-88e4-8a34-4cddeed6390d` | `009ce86d` | `a14661c22cbff91a` | 279 |
| formulas-receipt.json#14 | `d66abb16-ce6c-821f-8776-05ec9179c9d0` | `009ce86d` | `b6375f1e92a0eead` | 280 |
| formulas-receipt.json#15 | `b995cd9b-fd83-85fa-951a-c87995d06ebc` | `009ce86d` | `0b2015048c22eb50` | 281 |
| formulas-receipt.json#16 | `e23af03f-f970-8cba-8eb3-7821165ba423` | `009ce86d` | `eb643c0fe59562f8` | 282 |
| formulas-receipt.json#17 | `26a60b69-d5d3-85cd-84f3-7197ec965dea` | `009ce86d` | `299e9be2158e8ae2` | 283 |
| formulas-receipt.json#18 | `2ef1390e-9f10-8e34-ab27-0de8bf04381f` | `009ce86d` | `17154987b2389fa2` | 284 |
| formulas-receipt.json#19 | `1db79c87-0307-81ca-a13d-87fb9c394e94` | `009ce86d` | `70717e3f55b7653a` | 285 |
| formulas-receipt.json#20 | `fe531899-d3dc-8fd3-9bf0-b8fde5061a1d` | `009ce86d` | `51721fb236fb28ba` | 286 |
| formulas-receipt.json#21 | `c19c1dcc-2f0f-8222-bb71-2851f1631c89` | `009ce86d` | `0fcf8356f102c14a` | 287 |
| formulas-receipt.json#22 | `2e772cad-6953-8f03-a38f-8c2a4c415848` | `009ce86d` | `f73a1036197e59e6` | 288 |
| formulas-receipt.json#23 | `74e3c546-8911-8852-81a8-5ed315b7b8d1` | `009ce86d` | `dd21fbdf349b5c0b` | 289 |
| formulas-receipt.json#24 | `61f6d79c-c476-8580-87a2-a7eb47990db0` | `009ce86d` | `3846fea915bc3f84` | 290 |
| formulas-receipt.json#25 | `e595fb40-3a9f-8667-a977-1c0b743ded50` | `009ce86d` | `5e0058ae62006644` | 291 |
| formulas-receipt.json#26 | `e6b7af4f-ac03-8b10-b663-eb5a1d4002dd` | `009ce86d` | `e29fe3e03a3183c7` | 292 |
| formulas-receipt.json#27 | `9c4329d6-4fc3-83df-9429-525a473ee50c` | `009ce86d` | `3450b2490f319219` | 293 |
| formulas-receipt.json#28 | `5f8abc25-cead-89e5-a23e-71de1d761e7a` | `009ce86d` | `1431dc1c73730e38` | 294 |
| formulas-receipt.json#29 | `aeaf3608-3b39-8ed7-9749-44a603d30a54` | `009ce86d` | `dab118e47ec79854` | 295 |
| formulas-receipt.json#30 | `8343d81e-9f73-816b-b71d-ec7381c61f67` | `009ce86d` | `bab2b7d190de6106` | 296 |
| formulas-receipt.json#31 | `0346e653-9a14-84fc-94e4-abb5b5b38347` | `009ce86d` | `5c33eb9daa20de5f` | 297 |
| formulas-receipt.json#32 | `9a8e8b03-7802-87ee-b961-9e95f7856eee` | `009ce86d` | `f5966cd95fb8a587` | 298 |
| formulas-receipt.json#33 | `3e2dbfe0-f821-8b31-ad82-beda9aaccd9c` | `009ce86d` | `5e9ee50c2190517d` | 299 |
| formulas-receipt.json#34 | `226f45f3-1b43-8561-b28e-049a78d355d1` | `009ce86d` | `9452f0a9a14df85f` | 300 |
| formulas-receipt.json#35 | `6047c470-5ca4-8246-a464-ec4e3b2f6c23` | `009ce86d` | `918f4c150a270ab6` | 301 |
| formulas-receipt.json#36 | `b1eeb1d8-eb52-8507-b206-2f3ef3d955b1` | `009ce86d` | `19e4e1441e0ec965` | 302 |
| formulas-receipt.json#37 | `6d8b46d1-1f6a-8523-9dcc-8be44fd3653b` | `009ce86d` | `aa2cfb68632c5119` | 303 |
| formulas-receipt.json#38 | `0dcb4998-72f2-8faf-8eae-000d83bcb64d` | `009ce86d` | `8392917421a52db1` | 304 |
| formulas-receipt.json#39 | `0e685f36-2bba-8e3c-b968-3400fd027995` | `009ce86d` | `6662ca2e44ab30ce` | 305 |
| formulas-receipt.json#40 | `18722811-fd51-8fac-b81d-d733d88b8f6a` | `009ce86d` | `f563e65959af7e4e` | 306 |
| formulas-receipt.json#41 | `85765073-d05a-8dc6-8a46-4c5cea014831` | `009ce86d` | `92831b82805af163` | 307 |
| formulas-receipt.json#42 | `d7537663-d413-81e2-a049-cf165e1d27d9` | `009ce86d` | `557f5e671bd51404` | 308 |
| formulas-receipt.json#43 | `e833caeb-b4ef-83dd-92d4-6140a1427f39` | `009ce86d` | `96bf41580bb3e014` | 309 |
| formulas-receipt.json#44 | `a1df532b-cb9c-8696-bc9c-558fb66b7c0d` | `009ce86d` | `1081e629ee709212` | 310 |
| formulas-receipt.json#45 | `9abcbdd0-1323-8d7e-a995-ee53aabfe5fb` | `009ce86d` | `8f9bf89769e156e0` | 311 |
| formulas-receipt.json#46 | `d7e709db-1288-8cc3-9dd5-3e161ec1cd29` | `009ce86d` | `c26d82a4db15e6e2` | 312 |
| formulas-receipt.json#47 | `e894624a-cb63-894e-99bc-3363ea172909` | `009ce86d` | `7589f697a532a331` | 313 |
| formulas-receipt.json#48 | `c691ea88-60e6-8cab-98ca-5531f18fb627` | `009ce86d` | `ca69c8b2bfd18768` | 314 |
| formulas-receipt.json#49 | `f26fd519-adea-8f14-96e1-471363176177` | `009ce86d` | `35d178ba5806de3e` | 315 |
| formulas-receipt.json#50 | `f5bd4604-8865-80e4-bc53-3932394fc2a1` | `009ce86d` | `79165b15a85cd1c9` | 316 |
| formulas-receipt.json#51 | `6156926c-7f8a-8fdf-8253-c9c4e314f6bb` | `009ce86d` | `19b9443386db5207` | 317 |
| formulas-receipt.json#52 | `10daf93e-0e52-8fc7-b94f-e2f6c82c576c` | `009ce86d` | `a5e18eaf7c36d53e` | 318 |
| formulas-receipt.json#53 | `91f9cdd3-4f8a-803d-a3b4-be823661244d` | `009ce86d` | `4af9d1ed26649ab9` | 319 |
| formulas-receipt.json#54 | `d0eb3989-e1eb-85cf-a813-8fe5869b3d84` | `009ce86d` | `829600c37fb2c3cc` | 320 |
| formulas-receipt.json#55 | `d237b1ea-09da-8101-b62c-633d42e59c99` | `009ce86d` | `6384cd49f6ae7653` | 321 |
| formulas-receipt.json#56 | `bb9f30ce-f7ef-8131-b5b4-357079ca53fd` | `009ce86d` | `b9182644b90809c4` | 322 |
| formulas-receipt.json#57 | `1b6cb2ab-80bb-8286-af17-740d4fc5dfcc` | `009ce86d` | `e1016d184d08867a` | 323 |
| formulas-receipt.json#58 | `b5fad0b7-ff4e-8cac-90e5-1a3bb5c0ba54` | `009ce86d` | `61e5f465150e9fb6` | 324 |
| formulas-receipt.json#59 | `364aab6b-c53d-8fce-ad33-2f804800ff62` | `009ce86d` | `0bb30b26a85df1e2` | 325 |
| formulas-receipt.json#60 | `b6fcc3f3-2111-85fa-87a0-7272dc7c9adb` | `009ce86d` | `e856c137149495c1` | 326 |
| formulas-receipt.json#61 | `125c5df1-f208-8945-84bb-f1f99b5dc063` | `009ce86d` | `577494687c1be17c` | 327 |
| formulas-receipt.json#62 | `236281ba-7ae3-8f23-9932-bcdce2a8db14` | `009ce86d` | `06962e72272574ab` | 328 |
| formulas-receipt.json#63 | `a4a1b13f-7bf9-8d1e-862b-cde455bcc1f6` | `009ce86d` | `56b20f8799d6b7ec` | 329 |
| formulas-receipt.json#64 | `d51695cb-25f8-84ee-bdad-37f4d4e69038` | `009ce86d` | `9d5eabf51b1d3f15` | 330 |
| formulas-receipt.json#65 | `18f5bcc7-850d-858a-914f-7d3d30bdb055` | `009ce86d` | `ab940b45add682a2` | 331 |
| formulas-receipt.json#66 | `044ad361-a8be-8d8e-b87d-985f661a24f8` | `009ce86d` | `c1b32a56a930528a` | 332 |
| formulas-receipt.json#67 | `56250534-5010-832b-94ae-2300aad8ab28` | `009ce86d` | `2558048ef349fa9d` | 333 |
| formulas-receipt.json#68 | `b9860cd9-38f9-836b-8500-4be91d15db15` | `009ce86d` | `c41a2a719dbe2407` | 334 |
| formulas-receipt.json#69 | `eb629057-30f5-8477-93ba-f7f54c7bccbd` | `009ce86d` | `5e9d093b584d1aa5` | 335 |
| formulas-receipt.json#70 | `6a594de1-e892-8938-89fd-5e70bde4a129` | `009ce86d` | `f1c0a497d54f22b0` | 336 |
| formulas-receipt.json#71 | `17345d26-45e8-8f95-a5b6-8f666d66b670` | `009ce86d` | `9c4dbfae16230c90` | 337 |
| formulas-receipt.json#72 | `efba8edf-da09-86ac-81a5-d92676b2566e` | `009ce86d` | `d342241f5ab2d9dc` | 338 |
| formulas-receipt.json#73 | `561aa955-3591-81dc-a182-a7555a50b152` | `009ce86d` | `1986cdb8d489b44b` | 339 |
| formulas-receipt.json#74 | `0fac2feb-212b-8fe0-9348-8ccfca3e57af` | `009ce86d` | `9092ba22b6b56870` | 340 |
| formulas-receipt.json#75 | `98941647-596b-84b6-a9c4-77fa0b0d3fae` | `009ce86d` | `6b53d7d27b6d3a5c` | 341 |
| formulas-receipt.json#76 | `44ec5e97-0f18-8cc3-93c9-e57889183e88` | `009ce86d` | `8a1eb11de8387202` | 342 |
| formulas-receipt.json#77 | `aa26f79b-82fd-8c85-9d73-3d9567f3b44a` | `009ce86d` | `39ccfe9889225e5b` | 343 |
| formulas-receipt.json#78 | `9e8f3af4-7a99-8530-935d-7323c6d94069` | `009ce86d` | `9116f7ac9d0cd1b4` | 344 |
| fuse-receipt.json | `5f53c1b7-43fa-83fc-a4ed-e2e5dffa4480` | `f13854d7` | `1e8c60741e0cdbbe` | 345 |
| heat-receipt.json | `a5c3e4e5-1846-87fd-81b3-264729086fd9` | `f13854d7` | `fc1a45fc399a8477` | 346 |
| heat-receipt.json#0 | `d44d0766-8e27-8250-9681-69b87146baf5` | `a5c3e4e5` | `b2737284398a0f26` | 347 |
| heat-receipt.json#1 | `eb4c279f-91fd-81dd-a77b-c11a49faa701` | `a5c3e4e5` | `7533a7370cea232c` | 348 |
| heat-receipt.json#2 | `8da90c82-882e-87d0-b914-96482829a3c7` | `a5c3e4e5` | `962dd0dcff4891ce` | 349 |
| heat-receipt.json#3 | `609ff7ea-7843-8989-b4f3-bd161e2c8e90` | `a5c3e4e5` | `0c4df2e2e4416d68` | 350 |
| heat-receipt.json#4 | `016a2c35-8dc5-8daa-a9c4-0f4d2a71eb22` | `a5c3e4e5` | `929c3130c3ed4b52` | 351 |
| heat-receipt.json#5 | `22cc4bc3-048d-8e2a-a5e7-17136820094f` | `a5c3e4e5` | `1ab5d6e0627adcc3` | 352 |
| heat-receipt.json#6 | `01b650c3-1e21-8c06-ab49-b52fd9c11592` | `a5c3e4e5` | `73ec51b652b2f49a` | 353 |
| heat-receipt.json#7 | `b5a30da8-f812-87a0-bd9c-e19c89e5b835` | `a5c3e4e5` | `b17f013a9dea1e80` | 354 |
| heat-receipt.json#8 | `85b64984-849c-85a8-84f1-ed4e95a4393a` | `a5c3e4e5` | `98f0372bd35bad49` | 355 |
| heat-receipt.json#9 | `1af6e739-3db4-8501-85d8-ca6aa2a98ba5` | `a5c3e4e5` | `00b4ce2c9bfc777a` | 356 |
| heat-receipt.json#10 | `e254bafb-6365-8a86-90c7-1bba7713976f` | `a5c3e4e5` | `46d1c541952e93a9` | 357 |
| heat-receipt.json#11 | `3a224c06-836c-82b5-a72a-e0887835ce5e` | `a5c3e4e5` | `7d53b2ce1addd53d` | 358 |
| heat-receipt.json#12 | `5ab1b773-2279-83d6-84ab-cfcb73ab61c8` | `a5c3e4e5` | `716f7eb929594907` | 359 |
| heat-receipt.json#13 | `361d2381-089c-8ec4-a636-ddff3acf5e81` | `a5c3e4e5` | `3a57a85b8740b936` | 360 |
| heat-receipt.json#14 | `e671e7f8-8680-8571-85a2-c9800cf1c414` | `a5c3e4e5` | `66586546aa026706` | 361 |
| heat-receipt.json#15 | `85c87619-3829-857c-b6b1-b4f4f61f2597` | `a5c3e4e5` | `b963b9c7a221285d` | 362 |
| heat-receipt.json#16 | `d88621f1-83cb-831f-8f17-c074ad92dfeb` | `a5c3e4e5` | `8ecffa54a21afd33` | 363 |
| heat-receipt.json#17 | `07218149-777b-8d8c-9e31-6c08feecccb0` | `a5c3e4e5` | `5c5a842cdc7f7d21` | 364 |
| heat-receipt.json#18 | `1053972a-e022-83fe-ad58-044d11458862` | `a5c3e4e5` | `3f3b3999015d961d` | 365 |
| heat-receipt.json#19 | `0545f658-727f-8da4-aa4e-feb60c9e96d1` | `a5c3e4e5` | `b6a8189547bfb8f6` | 366 |
| heat-receipt.json#20 | `189df36b-be4f-8c95-8e69-b5f22b91c864` | `a5c3e4e5` | `02646492e69a4322` | 367 |
| heat-receipt.json#21 | `e0a3a55e-1e48-89d3-843f-c11408ce639d` | `a5c3e4e5` | `55b016de85ba99a2` | 368 |
| heat-receipt.json#22 | `94733d8d-235e-83ca-ae37-75b8d3ed125b` | `a5c3e4e5` | `c24e5314d30db09e` | 369 |
| heat-receipt.json#23 | `36fd8db0-6f7e-8941-a97d-27fb401a1d3a` | `a5c3e4e5` | `c39ed620e94fb2bd` | 370 |
| heat-receipt.json#24 | `4d5f1083-cb84-86d0-afc2-bcf43867cdf2` | `a5c3e4e5` | `ce3331d2ac941b0b` | 371 |
| heat-receipt.json#25 | `dfc16675-ca1d-89a8-bb27-180906717358` | `a5c3e4e5` | `54251c5261d19877` | 372 |
| heat-receipt.json#26 | `1ad5950d-1534-8dcb-889c-c5e47362af12` | `a5c3e4e5` | `3b3cd7c8616cd27c` | 373 |
| heat-receipt.json#27 | `29604306-5cc1-826d-87ac-52e410497560` | `a5c3e4e5` | `0d59aa3faedc13e7` | 374 |
| heat-receipt.json#28 | `6ecd3bbe-3548-8612-98d2-e9b63a0024ea` | `a5c3e4e5` | `b3d2796247096e16` | 375 |
| heat-receipt.json#29 | `a360b711-2703-808b-8b58-42c606b0e57e` | `a5c3e4e5` | `3e853ed3da3673d5` | 376 |
| heat-receipt.json#30 | `2cff9bb9-c503-829b-9e2e-14d97f76a5b0` | `a5c3e4e5` | `422b264e153eb21c` | 377 |
| heat-receipt.json#31 | `826848f7-e763-8379-8249-a44a6d6fbd08` | `a5c3e4e5` | `ecbc7be9c75943af` | 378 |
| heat-receipt.json#32 | `beee82eb-88bd-80ae-89db-909dfb50b853` | `a5c3e4e5` | `9111f892b64c0867` | 379 |
| heat-receipt.json#33 | `db7a5772-f0f5-8046-82f9-55b5b8e24435` | `a5c3e4e5` | `312680d08620b63f` | 380 |
| heat-receipt.json#34 | `19cbcec9-9f08-815e-a189-eacc390a76d9` | `a5c3e4e5` | `8074ccd791c4166a` | 381 |
| heat-receipt.json#35 | `f5309246-646b-8065-8132-2960ad6f6b0e` | `a5c3e4e5` | `a1aac37861033fe6` | 382 |
| heat-receipt.json#36 | `0e11a312-7ba5-8f09-9fee-19326f4a4682` | `a5c3e4e5` | `8be6f26a65162afe` | 383 |
| heat-receipt.json#37 | `1cfac2d2-118a-87df-b9ef-53230f2a95a8` | `a5c3e4e5` | `5bb76a0c778251a8` | 384 |
| heat-receipt.json#38 | `bbdc289a-79ad-8af4-9a03-593dbaf4eec1` | `a5c3e4e5` | `fcded73b28ff1289` | 385 |
| heat-receipt.json#39 | `27bf89a6-c122-888a-826a-7b614f1e9732` | `a5c3e4e5` | `53115254b8e43437` | 386 |
| lattice-receipt.json | `329b4e7f-1e21-8a3a-b913-55d9e66d4842` | `f13854d7` | `5c9367f8765423b2` | 387 |
| lean-receipt.json | `1290e76b-a537-8861-88da-796da0d81d66` | `f13854d7` | `7a63d6ab25d404f4` | 388 |
| lean-receipt.json#0 | `56ce2155-ccb7-8cab-bab6-28818bf18785` | `1290e76b` | `01a4314334920464` | 389 |
| lean-receipt.json#1 | `cf348e8a-614b-86fd-b44b-b52925e3bef4` | `1290e76b` | `17dd686d646c00c4` | 390 |
| lean-receipt.json#2 | `499e6b35-9f8c-8adb-a5ba-1d66f4e62ee3` | `1290e76b` | `85559ecfe991db72` | 391 |
| lean-receipt.json#3 | `c562331b-9d0d-8276-8428-39259f756496` | `1290e76b` | `0b81c75ca7b9f612` | 392 |
| lean-receipt.json#4 | `b873611b-447c-8847-8fe7-bd85da6f0843` | `1290e76b` | `856c8808576cb0ed` | 393 |
| lean-receipt.json#5 | `a759d121-171d-8638-bd06-02d8afb95aba` | `1290e76b` | `8c42f871b54b87a0` | 394 |
| lean-receipt.json#6 | `3cba977c-c401-86b3-b9c2-f34721f048ce` | `1290e76b` | `a1bb51780f3b93f2` | 395 |
| lean-receipt.json#7 | `f8bbbb48-23de-8fb5-a7f4-24468d60e125` | `1290e76b` | `8c393b1c4570738a` | 396 |
| lean-receipt.json#8 | `625fbe86-ad13-89da-a5b1-37fadd77fd08` | `1290e76b` | `8759e151d526b48d` | 397 |
| lean-receipt.json#9 | `8b6bd865-466e-8aea-b319-9a365ef9268f` | `1290e76b` | `ba236e62d0f2e667` | 398 |
| lean-receipt.json#10 | `d7224177-c034-88b4-b4ed-7c30efd0b421` | `1290e76b` | `2d3bffa2815b71de` | 399 |
| lean-receipt.json#11 | `fde5e0b3-f598-854d-97ca-56966176480a` | `1290e76b` | `3b823db63b5cf251` | 400 |
| lean-receipt.json#12 | `1695a9eb-d37e-878a-8f68-b5a5e53c623d` | `1290e76b` | `8198bb405e69ae3d` | 401 |
| lean-receipt.json#13 | `d69bbcae-7a85-8bf8-af01-305463c6937f` | `1290e76b` | `fa381a949b4f1709` | 402 |
| lean-receipt.json#14 | `8a07e8c9-511f-89cb-89b6-5d6e1776d401` | `1290e76b` | `ccbc114c64b5d7d5` | 403 |
| lean-receipt.json#15 | `db9d6d0d-8b0a-8887-bdc7-a16fa5300405` | `1290e76b` | `ca2d842deaaa3417` | 404 |
| lean-receipt.json#16 | `a781b051-915e-805e-8287-b0745fb1b2d3` | `1290e76b` | `c26db2931600ef72` | 405 |
| lean-receipt.json#17 | `9f182e92-1475-8f94-8b67-11d6ffa50e2d` | `1290e76b` | `f1d614a5647be442` | 406 |
| lean-receipt.json#18 | `627532fd-fbcb-8912-9da7-ba7ca9b9896a` | `1290e76b` | `20b0af073db0d784` | 407 |
| lean-receipt.json#19 | `997956c7-210a-89fb-aa4c-8e06e406a46f` | `1290e76b` | `661bd8788a9d8fec` | 408 |
| lean-receipt.json#20 | `be5e72c2-f642-8c3d-98c3-c58f2041b2f6` | `1290e76b` | `8ae5bda61686e5fe` | 409 |
| lean-receipt.json#21 | `ab3b5745-5671-833a-949b-843cfe5e2a30` | `1290e76b` | `0173e958093f571c` | 410 |
| lean-receipt.json#22 | `f3e7f6cd-7ec7-8fd7-a9c3-e60b92a9b9f5` | `1290e76b` | `dc9170336312cfdd` | 411 |
| lean-receipt.json#23 | `57eaba4e-7382-83ea-8a75-6e5d2cdcf405` | `1290e76b` | `a928836e949a3b08` | 412 |
| lean-receipt.json#24 | `9c712b6f-87dd-8847-ad1e-c45dad6b15f0` | `1290e76b` | `892beb0c6c10c5d8` | 413 |
| lean-receipt.json#25 | `c9a63eb8-b58b-89af-82fd-308e8673b960` | `1290e76b` | `54b1ada5511adb73` | 414 |
| lean-receipt.json#26 | `1cc424f3-464d-8a64-b860-90df10e9674d` | `1290e76b` | `ac8eef3ad8936c18` | 415 |
| lean-receipt.json#27 | `6ee439a2-cd84-833d-972a-a65ad0efcc42` | `1290e76b` | `7256c466c3448c3f` | 416 |
| lean-receipt.json#28 | `4901d3aa-5ec0-89b8-9daa-1bd04b79d5bc` | `1290e76b` | `783f0872ec919aeb` | 417 |
| lean-receipt.json#29 | `32d3926d-e96f-84bf-8a24-f51251168045` | `1290e76b` | `c2625317519e7ea0` | 418 |
| lean-receipt.json#30 | `4dac126e-bfc6-8c54-b004-29b9a4a70981` | `1290e76b` | `b828aefe631f023f` | 419 |
| lean-receipt.json#31 | `54e71fc9-08c1-813f-b9e9-fa36bf31ec9f` | `1290e76b` | `28c97dc8c98c1353` | 420 |
| lean-receipt.json#32 | `02479ae8-f55e-84f2-97c3-c79324506544` | `1290e76b` | `a50a453d176456ba` | 421 |
| lean-receipt.json#33 | `f9d3feb0-cd66-8b39-b08f-884bfb28acf1` | `1290e76b` | `e9987eb5bb747c92` | 422 |
| lean-receipt.json#34 | `8919f291-7b89-888a-9696-24571cdb8e96` | `1290e76b` | `d96c3e86ca8300bb` | 423 |
| lean-receipt.json#35 | `6d0fdaf6-e00f-8d65-9db9-31a6a5de22dd` | `1290e76b` | `026803944de9f8fb` | 424 |
| lean-receipt.json#36 | `dd421abc-bcd9-83b5-9944-67167165f8f5` | `1290e76b` | `9493a574bb66c834` | 425 |
| lean-receipt.json#37 | `8f69019d-5daf-8732-964e-2003752bf550` | `1290e76b` | `e49607ea34f2e643` | 426 |
| lean-receipt.json#38 | `758832ef-6a1c-88cf-b8e2-9824b63559b8` | `1290e76b` | `3a9d0303d541d513` | 427 |
| lean-receipt.json#39 | `001fa8ec-55bd-826a-9efd-b7e80059aca7` | `1290e76b` | `850461c1588ef998` | 428 |
| lean-receipt.json#40 | `992f1a13-e52c-898d-97ac-fc5f42d3a9ab` | `1290e76b` | `54ced7ee08c43b01` | 429 |
| lean-receipt.json#41 | `eaabcde1-aaf6-8c82-84e9-d85a9eaf6ab4` | `1290e76b` | `883120543a46eeba` | 430 |
| lean-receipt.json#42 | `3b68e21d-31a3-8ca2-add0-ac12d9efd3c1` | `1290e76b` | `3ab0cd25a6b5a51c` | 431 |
| lean-receipt.json#43 | `7c0baadd-137c-88bd-837e-ec43da78d24a` | `1290e76b` | `f9b7bcab6eb1f2ec` | 432 |
| lean-receipt.json#44 | `bcb917d9-565f-8bb1-84ce-4e2bf8785b77` | `1290e76b` | `ba26eb0385ad4049` | 433 |
| lean-receipt.json#45 | `609b6091-4054-87e0-8e9d-68e8635d456d` | `1290e76b` | `cdfdeaec366d59a9` | 434 |
| lean-receipt.json#46 | `81c70498-8469-853b-b5be-800aa93dc5f4` | `1290e76b` | `a3f34c2b09cbdc81` | 435 |
| lean-receipt.json#47 | `bc0a1798-9826-85a1-82db-88b0d14118c4` | `1290e76b` | `fa828c0c9002434a` | 436 |
| lean-receipt.json#48 | `93229b86-b5f3-8c6e-bce9-b77e311b1409` | `1290e76b` | `390ee6112bc84229` | 437 |
| lean-receipt.json#49 | `bba2ebd4-8197-8015-88b0-8cb47aae5ac4` | `1290e76b` | `14e7224d07b82fe5` | 438 |
| lean-receipt.json#50 | `b2cec79b-3bb8-889c-8912-960e26c0603c` | `1290e76b` | `a26d61f94731765b` | 439 |
| lean-receipt.json#51 | `f04c24f6-b088-8088-b250-e8aedff64b53` | `1290e76b` | `0606ba04128bc864` | 440 |
| lean-receipt.json#52 | `b3e3710a-892f-8f9d-b5f9-75ca0a6b6876` | `1290e76b` | `d8fe7dee19a9eca9` | 441 |
| lean-receipt.json#53 | `b961dcd7-5496-8ff8-816e-1ee03448641e` | `1290e76b` | `5e9815aaca739805` | 442 |
| lean-receipt.json#54 | `ee9e5638-a110-8032-a9bc-2a6d7ad611fb` | `1290e76b` | `fca5ef45f516834b` | 443 |
| lean-receipt.json#55 | `c6461a47-ab39-81f5-8edd-41668a2011f4` | `1290e76b` | `4e0f8d28c2a80cb1` | 444 |
| lean-receipt.json#56 | `a9b855cd-accd-8e42-a2b6-bfa731ba97ed` | `1290e76b` | `bddfe267a640156c` | 445 |
| lean-receipt.json#57 | `19f23813-b121-8eac-b911-06c4c8474fdb` | `1290e76b` | `aaca8fa141b1b164` | 446 |
| lean-receipt.json#58 | `49f4bc36-9cd2-8af0-a322-0e4291f18146` | `1290e76b` | `de9c1d0eb319845f` | 447 |
| lean-receipt.json#59 | `31ab447d-12e0-84a0-bba2-46c84523d5c1` | `1290e76b` | `5ad4efe87055dad6` | 448 |
| lean-receipt.json#60 | `226ee7ad-b14d-8e21-bd84-6b21135efb5f` | `1290e76b` | `21f8222a910896f8` | 449 |
| lean-receipt.json#61 | `24f71b2b-b1cb-8c0f-b437-853439693340` | `1290e76b` | `9ab521ab8bfd2c30` | 450 |
| lean-receipt.json#62 | `3b2096c6-5939-83d7-9722-ab233e665fe7` | `1290e76b` | `97f276540373c55c` | 451 |
| lean-receipt.json#63 | `8fc7baa3-82c3-8f8e-b5a9-5e9682de3f29` | `1290e76b` | `433fae11c15a3406` | 452 |
| lean-receipt.json#64 | `b29ac76a-5680-8b8d-a01d-821ed5e47b74` | `1290e76b` | `99f6f1bba698c440` | 453 |
| lean-receipt.json#65 | `7199cbe0-e790-8f0b-9163-fd094146b075` | `1290e76b` | `9f74c15228e068ae` | 454 |
| lean-receipt.json#66 | `7fc45f3d-d682-8c97-a9b5-da72301dd9b0` | `1290e76b` | `50d88d048369584c` | 455 |
| lean-receipt.json#67 | `14b68062-217d-8936-9f8c-1bf0168bc409` | `1290e76b` | `89f9254372ae56a4` | 456 |
| lean-receipt.json#68 | `9b2009a7-a44b-82cd-995e-2bd7a4b90962` | `1290e76b` | `019312acb7ec2b4b` | 457 |
| lean-receipt.json#69 | `ff014850-4d74-8c61-a27f-6ab2b1b54bc5` | `1290e76b` | `09fe6367b5d53bf0` | 458 |
| lean-receipt.json#70 | `58885521-14d0-872c-8b8c-b091bda0a9eb` | `1290e76b` | `228f135985843f8b` | 459 |
| lean-receipt.json#71 | `f37d57fa-420d-8d37-bae8-feb196ae33d9` | `1290e76b` | `43d4a9af3eae5238` | 460 |
| lean-receipt.json#72 | `ad24bb5d-33b1-8f8c-9aae-ca4476db19d9` | `1290e76b` | `c48f727b686daaaa` | 461 |
| lean-receipt.json#73 | `1946f81b-f7d3-8cb0-9cad-66d0968d029a` | `1290e76b` | `e948e238756c4b88` | 462 |
| lean-receipt.json#74 | `ca14010a-11cc-8e3f-9f81-46bbbe933b4f` | `1290e76b` | `97efe68b81d61976` | 463 |
| lean-receipt.json#75 | `c32da34a-b1a4-8036-8bcf-1ae93dbff800` | `1290e76b` | `9bff2b6d5fc53087` | 464 |
| lean-receipt.json#76 | `f7046fa2-6cec-8223-9458-1a01ecb236f3` | `1290e76b` | `f7c370cf81952879` | 465 |
| lean-receipt.json#77 | `d5bc4c04-b15f-82a0-92e2-03b534c9c638` | `1290e76b` | `d3ac9515015a7683` | 466 |
| lean-receipt.json#78 | `b5948cb4-e334-8278-b1c4-010194ff5979` | `1290e76b` | `e39144dd650da2d3` | 467 |
| lean-receipt.json#79 | `15cf38af-de3c-812e-944f-b66ce7eaf96a` | `1290e76b` | `13aa26d4330f37b7` | 468 |
| lean-receipt.json#80 | `434587cb-7cf7-85fd-bcfc-19c2294935fe` | `1290e76b` | `6fd3a89255a92ed8` | 469 |
| lean-receipt.json#81 | `12568d22-a98f-8ec0-9fdd-87efea2fd67d` | `1290e76b` | `2150be74f267d805` | 470 |
| lean-receipt.json#82 | `c81b7aed-6bd0-8e73-aa22-587876de7dbc` | `1290e76b` | `ca40f3358e8ba4a4` | 471 |
| lean-receipt.json#83 | `baeff895-48b9-84ff-90ad-3593e274c9ec` | `1290e76b` | `cd77c6f87b5b1064` | 472 |
| lean-receipt.json#84 | `d2266df1-8a0d-8479-a678-d8b4dd1a0d8f` | `1290e76b` | `7013fccd8490dad7` | 473 |
| lean-receipt.json#85 | `b23b41c6-1e2d-8656-af38-983f06576ca8` | `1290e76b` | `7502a7db02d5a467` | 474 |
| lean-receipt.json#86 | `50970efe-1322-82df-b6ad-4e8a15cc0f02` | `1290e76b` | `d8ed6351f82dc020` | 475 |
| lean-receipt.json#87 | `010d505d-4ca8-8ab5-9675-eca7b8289416` | `1290e76b` | `87ad43e6d9e74af4` | 476 |
| lean-receipt.json#88 | `2dec2de1-df03-82a6-a7db-47eacedacdb6` | `1290e76b` | `29a1ce5eccc794cd` | 477 |
| lean-receipt.json#89 | `fbd9632a-6d7f-88a9-baf7-72893a652100` | `1290e76b` | `917a754ef7ded231` | 478 |
| lean-receipt.json#90 | `78cce8dc-104b-8951-b41c-fecd532916cf` | `1290e76b` | `2ddbc9e72c5863a3` | 479 |
| lean-receipt.json#91 | `430b58d5-c5fd-8122-9f7b-f2ae697d2acf` | `1290e76b` | `19e70810b6c0569e` | 480 |
| lean-receipt.json#92 | `79332f72-0c91-8f8c-80d7-321546712309` | `1290e76b` | `ab2dc0ed36085aae` | 481 |
| lean-receipt.json#93 | `4466468c-b774-871f-8c28-4bfbd42989d6` | `1290e76b` | `6b6a512c4de306e7` | 482 |
| lean-receipt.json#94 | `15047a24-ecab-841c-b3b2-a55985e5f7e5` | `1290e76b` | `8cc93ec2a2c3b4c1` | 483 |
| lean-receipt.json#95 | `cbbe0cfe-477c-8c3a-9e6c-8dd0157c28db` | `1290e76b` | `4da17eb3cca04d6f` | 484 |
| lean-receipt.json#96 | `5677ccf4-f755-8eaf-aa45-c3dfbe17b30d` | `1290e76b` | `cca2e313bbad6348` | 485 |
| lean-receipt.json#97 | `109a0919-ff52-8bf1-8a47-9e3864dc36a7` | `1290e76b` | `178311578707a3d9` | 486 |
| lean-receipt.json#98 | `c2f39ac5-b918-8fb5-bc21-14e06ab11e86` | `1290e76b` | `d6aad521dd3822c7` | 487 |
| lean-receipt.json#99 | `87ac62a1-6cb1-88dc-9d0c-35ea1fcd6278` | `1290e76b` | `a558c1105bcf6999` | 488 |
| lean-receipt.json#100 | `4a9abc62-bd05-832d-8f10-fca9861096c0` | `1290e76b` | `7002d9a2943b4233` | 489 |
| lean-receipt.json#101 | `99569d87-873f-85b6-be61-936e57a36f6d` | `1290e76b` | `af05078facef6371` | 490 |
| lean-receipt.json#102 | `909234c4-5eaf-8725-95ab-3cca8b0ac852` | `1290e76b` | `d440e12709b21f65` | 491 |
| lean-receipt.json#103 | `062db515-20f2-8892-90b5-d8c1e2bba7f3` | `1290e76b` | `4a5dc765b0ae881a` | 492 |
| lean-receipt.json#104 | `75a1f63f-257b-8431-b074-ea19105995fa` | `1290e76b` | `6e33961b381f1b24` | 493 |
| lean-receipt.json#105 | `8420b94c-a823-8850-9789-996cc08d8f44` | `1290e76b` | `8995d8a066b7efef` | 494 |
| lean-receipt.json#106 | `2203ac90-0c34-8185-ab69-8c030bb31e2c` | `1290e76b` | `ee05cc004c566b7d` | 495 |
| lean-receipt.json#107 | `dda8151a-7996-89f5-8701-c28b55073cac` | `1290e76b` | `4a5f92880000ec12` | 496 |
| lean-receipt.json#108 | `903b7b76-c61a-848d-8d4f-4303641014e8` | `1290e76b` | `673fccabf7917e43` | 497 |
| lean-receipt.json#109 | `d39d1d07-eec6-81a4-bad1-3c4b624bdbdf` | `1290e76b` | `7e721ac4c1f5636e` | 498 |
| lean-receipt.json#110 | `7246f3e9-e4e4-8067-929f-1f0cfd751597` | `1290e76b` | `5104b1b5d221fe0c` | 499 |
| lean-receipt.json#111 | `b1e0afc8-62c5-8d2f-afcf-0b90d414d100` | `1290e76b` | `a53e2a3165bc2079` | 500 |
| lean-receipt.json#112 | `17210552-0bf4-8caa-ab32-cf6b17aee46e` | `1290e76b` | `ac11551381559b5d` | 501 |
| lean-receipt.json#113 | `df148d10-1b1b-8b39-b010-b4dad5c9d79a` | `1290e76b` | `1e76aaa529c1faf4` | 502 |
| lean-receipt.json#114 | `a6ca1b65-3e63-87c6-ad65-ea5884f32fa1` | `1290e76b` | `6650de8fa69d0055` | 503 |
| lean-receipt.json#115 | `e0f342a2-db9b-81dd-864a-b0ccba8d83bf` | `1290e76b` | `45ffdc938f29d266` | 504 |
| lean-receipt.json#116 | `c16426f7-ee47-8c1a-bb2e-87b67ba888d2` | `1290e76b` | `29720f16131d7884` | 505 |
| lean-receipt.json#117 | `6ecec40d-9c78-88b6-97a1-80b280ea60ca` | `1290e76b` | `8f9e22c7e2bea6c9` | 506 |
| lean-receipt.json#118 | `ff2b4043-3a13-8cd2-aed9-afd77aed5a28` | `1290e76b` | `f9363e39d4b6cfec` | 507 |
| lean-receipt.json#119 | `44e0b699-36de-8631-a2c8-84d123ed9a5c` | `1290e76b` | `123fa2b2b6e380b2` | 508 |
| lean-receipt.json#120 | `99cc7263-be50-8a36-9abb-56c0fc91d2f0` | `1290e76b` | `df00ee1dd773d8f2` | 509 |
| lean-receipt.json#121 | `1d11ebf6-437a-8c9f-b5c1-0e854194ddb4` | `1290e76b` | `20f85f44fda02861` | 510 |
| lean-receipt.json#122 | `ee63ccfa-10bd-80c3-bfdd-1362d69b3f3e` | `1290e76b` | `040743c9cee1336f` | 511 |
| lean-receipt.json#123 | `90c1d613-22e8-821a-af7b-f28debc90af9` | `1290e76b` | `bfa20fd6cf759420` | 512 |
| payload-cf-receipt.json | `044a9712-ef3b-8f1f-9201-96b20d9050c0` | `f13854d7` | `f62f0aaf7ff26014` | 513 |
| percall-receipt.json | `77a6925f-4c30-80c7-ad82-9582e922430c` | `f13854d7` | `bb48a531ebc72170` | 514 |
| refusals-receipt.json | `4b2cd23a-f59f-8d01-b26d-87efcbbc91d9` | `f13854d7` | `8c5570077f4d6204` | 515 |
| test-receipt.json | `d343473b-be0f-8c48-a4e2-102a753cf047` | `f13854d7` | `4a5cfb5ecff89ea1` | 516 |
| test-receipt.json#0 | `f067068c-f54b-8951-bd4e-dbd034b50ff3` | `d343473b` | `9a01ace6de6b54ec` | 517 |
| test-receipt.json#1 | `ffd866cc-3a7f-802c-bb36-4e965a2bae27` | `d343473b` | `a13d744057ec9cc2` | 518 |
| test-receipt.json#2 | `55a8ff7a-803e-8797-806a-ca1492c62dc6` | `d343473b` | `bbd68eebc2fb3df3` | 519 |
| test-receipt.json#3 | `61473d41-a033-8cfd-9f98-4221b2b6569e` | `d343473b` | `e739f4896d14e203` | 520 |
| test-receipt.json#4 | `c4b06297-20fc-8260-88be-86e7e5825147` | `d343473b` | `7d78476f346361f5` | 521 |
| test-receipt.json#5 | `4bb5c5a8-e824-816f-a59c-ae160a6daada` | `d343473b` | `3120a62df82699eb` | 522 |
| test-receipt.json#6 | `f368565b-abae-80d8-bdc0-0831058d0b75` | `d343473b` | `e603dbc8c5889a16` | 523 |
| test-receipt.json#7 | `9ad88ab4-57e9-802f-ad73-64d488b8235c` | `d343473b` | `09c5ebed7bd28d13` | 524 |
| test-receipt.json#8 | `1eb7365e-c31d-8e87-9e2b-21bf71b5c9d6` | `d343473b` | `987476006a69a566` | 525 |
| test-receipt.json#9 | `b569520c-f942-85b5-b795-7b53d46e825a` | `d343473b` | `5d554129661dae60` | 526 |
| test-receipt.json#10 | `73db19e7-9b32-819b-9fe5-37b1a999f661` | `d343473b` | `c25f540b1357461f` | 527 |
| walls-receipt.json | `1693f967-0205-812f-bb1e-7b67aa1c7849` | `f13854d7` | `46393a1f4c0937d6` | 528 |
| readme | `805d0954-50af-8a20-8d19-a30dcf1b3b6d` | `f13854d7` | `c2d0ea4b7c5cfa12` | 529 |

</details>

Regenerate with `npm run readme` after `npm run build` and the receipt-producing runs; `node scripts/generate-readme.mjs --check`
compares. Documentation: [docs/README.md](docs/README.md). License: CC-BY-NC-ND-4.0.
