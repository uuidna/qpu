# UUIDNA QPU

**Final build receipt** `d087460d-136c-8c7e-8f3f-9b98e4df48b7`

| | |
|---|---|
| version | 1.0.0 |
| commit | `52f07241501bcaa8a0b1b0318e045861582a7855` (working tree differed from this commit) |
| receipts | 13 files, 489 nodes |
| build stream | length 489, head `d087460d-136c-8c7e-8f3f-9b98e4df48b7`, chain `5fa2f275728cfa72aadeb9e464382945542c390635c111283da823662252b60c`, holds **true** |

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
| [MCP & agents](https://qpu.uuidna.com/agents) | 77 | 54 | 45 | 2 |
| [Live science data](https://qpu.uuidna.com/science) | 22 | 17 | 10 | 7 |
| [API fusion](https://qpu.uuidna.com/fusion) | 17 | 8 | 2 | 3 |
| [Payload & Cloudflare](https://qpu.uuidna.com/cms) | 27 | 4 | 3 | 0 |
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

Each node is a quantum receipt: its UUID is the RFC 9562 v8 content address of its payload fold and its referrer, and
its referrer is the node above it. Change any receipt's bytes and its node, its file's node, the build stream chain
and this final receipt move; the root moves with the commit.

```mermaid
flowchart TD
  n16cee539["root<br/><code>16cee539</code>"]
  n004b5f02["cross-receipt.json<br/><code>004b5f02</code>"]
  n6954952d["cross-receipt.json#0<br/><code>6954952d</code>"]
  n24c79da7["cross-receipt.json#1<br/><code>24c79da7</code>"]
  n33c408b6["cross-receipt.json#2<br/><code>33c408b6</code>"]
  nab3fe26e["cross-receipt.json#3<br/><code>ab3fe26e</code>"]
  n2c455c33["cross-receipt.json#4<br/><code>2c455c33</code>"]
  nbe0fab25["cross-receipt.json#5<br/><code>be0fab25</code>"]
  n6f0cfe85["cross-receipt.json#6<br/><code>6f0cfe85</code>"]
  n7780626a["cross-receipt.json#7<br/><code>7780626a</code>"]
  n85df2aad["cross-receipt.json#8<br/><code>85df2aad</code>"]
  n9b255abe["cross-receipt.json#9<br/><code>9b255abe</code>"]
  nc0003dcb["cross-receipt.json#10<br/><code>c0003dcb</code>"]
  n0809d858["cross-receipt.json#11<br/><code>0809d858</code>"]
  na725fa0f["cross-receipt.json#12<br/><code>a725fa0f</code>"]
  nafa21ec3["cross-receipt.json#13<br/><code>afa21ec3</code>"]
  nc740edac["cross-receipt.json#14<br/><code>c740edac</code>"]
  n5822b734["cross-receipt.json#15<br/><code>5822b734</code>"]
  n7644ebae["cross-receipt.json#16<br/><code>7644ebae</code>"]
  n0230db57["cross-receipt.json#17<br/><code>0230db57</code>"]
  n2ccd028d["cross-receipt.json#18<br/><code>2ccd028d</code>"]
  n298a9cd0["cross-receipt.json#19<br/><code>298a9cd0</code>"]
  n75b17341["cross-receipt.json#20<br/><code>75b17341</code>"]
  n3b046eb6["cross-receipt.json#21<br/><code>3b046eb6</code>"]
  n3bedb308["cross-receipt.json#22<br/><code>3bedb308</code>"]
  nb2dd6643["cross-receipt.json#23<br/><code>b2dd6643</code>"]
  n2699b978["cross-receipt.json#24<br/><code>2699b978</code>"]
  n16e79b5b["cross-receipt.json#25<br/><code>16e79b5b</code>"]
  nd2ec2217["cross-receipt.json#26<br/><code>d2ec2217</code>"]
  n55bde7f8["cross-receipt.json#27<br/><code>55bde7f8</code>"]
  n60ac759f["cross-receipt.json#28<br/><code>60ac759f</code>"]
  n7f2743a7["cross-receipt.json#29<br/><code>7f2743a7</code>"]
  n2fca7629["debts-receipt.json<br/><code>2fca7629</code>"]
  n71b6a6e4["discovery-receipt.json<br/><code>71b6a6e4</code>"]
  ne1390b4e["discovery-receipt.json#0<br/><code>e1390b4e</code>"]
  na4d6eeea["discovery-receipt.json#1<br/><code>a4d6eeea</code>"]
  n40cc6d07["discovery-receipt.json#2<br/><code>40cc6d07</code>"]
  nbbc904a8["discovery-receipt.json#3<br/><code>bbc904a8</code>"]
  n27860f41["discovery-receipt.json#4<br/><code>27860f41</code>"]
  n5baf6dcf["discovery-receipt.json#5<br/><code>5baf6dcf</code>"]
  n6ead3073["discovery-receipt.json#6<br/><code>6ead3073</code>"]
  ndf552522["discovery-receipt.json#7<br/><code>df552522</code>"]
  n13a80223["discovery-receipt.json#8<br/><code>13a80223</code>"]
  n04218162["discovery-receipt.json#9<br/><code>04218162</code>"]
  ndaa74981["discovery-receipt.json#10<br/><code>daa74981</code>"]
  n2674e8e2["discovery-receipt.json#11<br/><code>2674e8e2</code>"]
  nfa9d5cbb["discovery-receipt.json#12<br/><code>fa9d5cbb</code>"]
  ne6c615e6["discovery-receipt.json#13<br/><code>e6c615e6</code>"]
  nb9334a2f["discovery-receipt.json#14<br/><code>b9334a2f</code>"]
  n885cbb1e["discovery-receipt.json#15<br/><code>885cbb1e</code>"]
  nf8cd78b5["discovery-receipt.json#16<br/><code>f8cd78b5</code>"]
  n591568c2["discovery-receipt.json#17<br/><code>591568c2</code>"]
  n26f1f6ed["discovery-receipt.json#18<br/><code>26f1f6ed</code>"]
  n2573c526["discovery-receipt.json#19<br/><code>2573c526</code>"]
  n870faf91["discovery-receipt.json#20<br/><code>870faf91</code>"]
  nc1aa599f["discovery-receipt.json#21<br/><code>c1aa599f</code>"]
  nc8a37485["discovery-receipt.json#22<br/><code>c8a37485</code>"]
  n680911be["discovery-receipt.json#23<br/><code>680911be</code>"]
  n98e9c3e2["discovery-receipt.json#24<br/><code>98e9c3e2</code>"]
  n58a8fb21["discovery-receipt.json#25<br/><code>58a8fb21</code>"]
  ncc7cfad2["discovery-receipt.json#26<br/><code>cc7cfad2</code>"]
  nc8d44348["discovery-receipt.json#27<br/><code>c8d44348</code>"]
  nf2b152f9["discovery-receipt.json#28<br/><code>f2b152f9</code>"]
  nd8f6cbec["discovery-receipt.json#29<br/><code>d8f6cbec</code>"]
  ned16a6ce["discovery-receipt.json#30<br/><code>ed16a6ce</code>"]
  nabafc17c["discovery-receipt.json#31<br/><code>abafc17c</code>"]
  n255f7979["discovery-receipt.json#32<br/><code>255f7979</code>"]
  n2b1177c0["discovery-receipt.json#33<br/><code>2b1177c0</code>"]
  nc7857115["discovery-receipt.json#34<br/><code>c7857115</code>"]
  n2d0bd68e["discovery-receipt.json#35<br/><code>2d0bd68e</code>"]
  n233e35d0["discovery-receipt.json#36<br/><code>233e35d0</code>"]
  n09d0b6bc["discovery-receipt.json#37<br/><code>09d0b6bc</code>"]
  nc7f9bc88["discovery-receipt.json#38<br/><code>c7f9bc88</code>"]
  n9d24417c["discovery-receipt.json#39<br/><code>9d24417c</code>"]
  nde7bd2f6["discovery-receipt.json#40<br/><code>de7bd2f6</code>"]
  n5500c42b["discovery-receipt.json#41<br/><code>5500c42b</code>"]
  n2f765e71["discovery-receipt.json#42<br/><code>2f765e71</code>"]
  n50768208["discovery-receipt.json#43<br/><code>50768208</code>"]
  n7233ca3b["discovery-receipt.json#44<br/><code>7233ca3b</code>"]
  n59f711f3["discovery-receipt.json#45<br/><code>59f711f3</code>"]
  na8fe47c0["discovery-receipt.json#46<br/><code>a8fe47c0</code>"]
  n7ce0dce4["discovery-receipt.json#47<br/><code>7ce0dce4</code>"]
  n2eb78807["discovery-receipt.json#48<br/><code>2eb78807</code>"]
  n3ac8f9c8["discovery-receipt.json#49<br/><code>3ac8f9c8</code>"]
  nb9cbefd7["discovery-receipt.json#50<br/><code>b9cbefd7</code>"]
  n4cb84529["discovery-receipt.json#51<br/><code>4cb84529</code>"]
  n315871b9["discovery-receipt.json#52<br/><code>315871b9</code>"]
  n4ad87e7e["discovery-receipt.json#53<br/><code>4ad87e7e</code>"]
  nd1012a1d["discovery-receipt.json#54<br/><code>d1012a1d</code>"]
  n22e9d846["discovery-receipt.json#55<br/><code>22e9d846</code>"]
  nef882e04["discovery-receipt.json#56<br/><code>ef882e04</code>"]
  n19244517["discovery-receipt.json#57<br/><code>19244517</code>"]
  n9ec0c1da["discovery-receipt.json#58<br/><code>9ec0c1da</code>"]
  n1a93a1b2["discovery-receipt.json#59<br/><code>1a93a1b2</code>"]
  n6192b744["discovery-receipt.json#60<br/><code>6192b744</code>"]
  nb0e531a3["discovery-receipt.json#61<br/><code>b0e531a3</code>"]
  n5bb06577["discovery-receipt.json#62<br/><code>5bb06577</code>"]
  n83cc866e["discovery-receipt.json#63<br/><code>83cc866e</code>"]
  nfa69d082["discovery-receipt.json#64<br/><code>fa69d082</code>"]
  n90619277["discovery-receipt.json#65<br/><code>90619277</code>"]
  ne03a7833["discovery-receipt.json#66<br/><code>e03a7833</code>"]
  na9312500["discovery-receipt.json#67<br/><code>a9312500</code>"]
  nac477e24["discovery-receipt.json#68<br/><code>ac477e24</code>"]
  n1154a232["discovery-receipt.json#69<br/><code>1154a232</code>"]
  n2dbf9821["discovery-receipt.json#70<br/><code>2dbf9821</code>"]
  n784f0480["discovery-receipt.json#71<br/><code>784f0480</code>"]
  n65ebed61["discovery-receipt.json#72<br/><code>65ebed61</code>"]
  n1403791e["discovery-receipt.json#73<br/><code>1403791e</code>"]
  nc3c370ad["discovery-receipt.json#74<br/><code>c3c370ad</code>"]
  na62ec354["discovery-receipt.json#75<br/><code>a62ec354</code>"]
  n806a5ec0["discovery-receipt.json#76<br/><code>806a5ec0</code>"]
  n88a3bcb0["discovery-receipt.json#77<br/><code>88a3bcb0</code>"]
  n0451d033["discovery-receipt.json#78<br/><code>0451d033</code>"]
  n72eca790["discovery-receipt.json#79<br/><code>72eca790</code>"]
  ne89ccd69["discovery-receipt.json#80<br/><code>e89ccd69</code>"]
  n677aaeb7["discovery-receipt.json#81<br/><code>677aaeb7</code>"]
  n5ca5f67d["discovery-receipt.json#82<br/><code>5ca5f67d</code>"]
  nd6c48686["discovery-receipt.json#83<br/><code>d6c48686</code>"]
  nb1640d82["discovery-receipt.json#84<br/><code>b1640d82</code>"]
  n7287b3c6["discovery-receipt.json#85<br/><code>7287b3c6</code>"]
  nbac6a356["discovery-receipt.json#86<br/><code>bac6a356</code>"]
  n1b6a86fc["discovery-receipt.json#87<br/><code>1b6a86fc</code>"]
  n3fe34e47["discovery-receipt.json#88<br/><code>3fe34e47</code>"]
  nb1ad43cf["discovery-receipt.json#89<br/><code>b1ad43cf</code>"]
  n2aba3335["discovery-receipt.json#90<br/><code>2aba3335</code>"]
  nef6655c1["discovery-receipt.json#91<br/><code>ef6655c1</code>"]
  n2db0a84b["discovery-receipt.json#92<br/><code>2db0a84b</code>"]
  n35bb8227["discovery-receipt.json#93<br/><code>35bb8227</code>"]
  n0bfedd50["discovery-receipt.json#94<br/><code>0bfedd50</code>"]
  n68b1dd51["discovery-receipt.json#95<br/><code>68b1dd51</code>"]
  nb72d3b78["discovery-receipt.json#96<br/><code>b72d3b78</code>"]
  ne670ec28["discovery-receipt.json#97<br/><code>e670ec28</code>"]
  nb06f1240["discovery-receipt.json#98<br/><code>b06f1240</code>"]
  n89d23abd["discovery-receipt.json#99<br/><code>89d23abd</code>"]
  ne956e7ba["discovery-receipt.json#100<br/><code>e956e7ba</code>"]
  nc066c6ee["discovery-receipt.json#101<br/><code>c066c6ee</code>"]
  n3e730c42["discovery-receipt.json#102<br/><code>3e730c42</code>"]
  n1fe4cad2["discovery-receipt.json#103<br/><code>1fe4cad2</code>"]
  n4df89767["discovery-receipt.json#104<br/><code>4df89767</code>"]
  n2ba4dd49["discovery-receipt.json#105<br/><code>2ba4dd49</code>"]
  n710d20fb["discovery-receipt.json#106<br/><code>710d20fb</code>"]
  n40e27c08["discovery-receipt.json#107<br/><code>40e27c08</code>"]
  n0374eee1["discovery-receipt.json#108<br/><code>0374eee1</code>"]
  nabb14693["discovery-receipt.json#109<br/><code>abb14693</code>"]
  n2e24d46e["discovery-receipt.json#110<br/><code>2e24d46e</code>"]
  na0d702d9["discovery-receipt.json#111<br/><code>a0d702d9</code>"]
  n35e879f6["discovery-receipt.json#112<br/><code>35e879f6</code>"]
  n0d351449["discovery-receipt.json#113<br/><code>0d351449</code>"]
  nc827c0af["discovery-receipt.json#114<br/><code>c827c0af</code>"]
  n283a0f8a["discovery-receipt.json#115<br/><code>283a0f8a</code>"]
  n579631cf["discovery-receipt.json#116<br/><code>579631cf</code>"]
  ndabe632f["discovery-receipt.json#117<br/><code>dabe632f</code>"]
  n961a6ac0["discovery-receipt.json#118<br/><code>961a6ac0</code>"]
  nff430e0b["discovery-receipt.json#119<br/><code>ff430e0b</code>"]
  n09f1700e["discovery-receipt.json#120<br/><code>09f1700e</code>"]
  nd156056a["discovery-receipt.json#121<br/><code>d156056a</code>"]
  n39e4fc76["discovery-receipt.json#122<br/><code>39e4fc76</code>"]
  n8858f706["discovery-receipt.json#123<br/><code>8858f706</code>"]
  n853779ec["discovery-receipt.json#124<br/><code>853779ec</code>"]
  na758b7bc["discovery-receipt.json#125<br/><code>a758b7bc</code>"]
  n150cddc1["discovery-receipt.json#126<br/><code>150cddc1</code>"]
  n8b7d17ea["discovery-receipt.json#127<br/><code>8b7d17ea</code>"]
  nd7b82b6a["discovery-receipt.json#128<br/><code>d7b82b6a</code>"]
  n7fd4b531["discovery-receipt.json#129<br/><code>7fd4b531</code>"]
  nacc9241e["discovery-receipt.json#130<br/><code>acc9241e</code>"]
  n5170883f["discovery-receipt.json#131<br/><code>5170883f</code>"]
  n77a3b6cb["discovery-receipt.json#132<br/><code>77a3b6cb</code>"]
  n23c547de["discovery-receipt.json#133<br/><code>23c547de</code>"]
  ne97a76b5["discovery-receipt.json#134<br/><code>e97a76b5</code>"]
  n5fe33cf5["discovery-receipt.json#135<br/><code>5fe33cf5</code>"]
  n03170702["discovery-receipt.json#136<br/><code>03170702</code>"]
  n44877d15["discovery-receipt.json#137<br/><code>44877d15</code>"]
  nb40c5fc2["discovery-receipt.json#138<br/><code>b40c5fc2</code>"]
  naaf6a1cb["discovery-receipt.json#139<br/><code>aaf6a1cb</code>"]
  n4e14ced0["discovery-receipt.json#140<br/><code>4e14ced0</code>"]
  n2ee66faf["discovery-receipt.json#141<br/><code>2ee66faf</code>"]
  na65fe0b1["discovery-receipt.json#142<br/><code>a65fe0b1</code>"]
  n48899b7d["discovery-receipt.json#143<br/><code>48899b7d</code>"]
  ne970e12e["discovery-receipt.json#144<br/><code>e970e12e</code>"]
  n8ddf6c6b["discovery-receipt.json#145<br/><code>8ddf6c6b</code>"]
  n9532bcb8["discovery-receipt.json#146<br/><code>9532bcb8</code>"]
  n63c77d0b["discovery-receipt.json#147<br/><code>63c77d0b</code>"]
  nbef94b3b["discovery-receipt.json#148<br/><code>bef94b3b</code>"]
  ne54bfdc8["discovery-receipt.json#149<br/><code>e54bfdc8</code>"]
  na9afd709["discovery-receipt.json#150<br/><code>a9afd709</code>"]
  nc0b7834c["discovery-receipt.json#151<br/><code>c0b7834c</code>"]
  n2eeac53d["discovery-receipt.json#152<br/><code>2eeac53d</code>"]
  n2405513a["discovery-receipt.json#153<br/><code>2405513a</code>"]
  n7fdde1ba["discovery-receipt.json#154<br/><code>7fdde1ba</code>"]
  n22855962["discovery-receipt.json#155<br/><code>22855962</code>"]
  ne0808f36["discovery-receipt.json#156<br/><code>e0808f36</code>"]
  n272aa096["discovery-receipt.json#157<br/><code>272aa096</code>"]
  na54a1401["discovery-receipt.json#158<br/><code>a54a1401</code>"]
  n645d2b9b["discovery-receipt.json#159<br/><code>645d2b9b</code>"]
  n20b07da1["discovery-receipt.json#160<br/><code>20b07da1</code>"]
  nf24e48d6["discovery-receipt.json#161<br/><code>f24e48d6</code>"]
  n65ed5ebd["discovery-receipt.json#162<br/><code>65ed5ebd</code>"]
  n104d804e["discovery-receipt.json#163<br/><code>104d804e</code>"]
  nd13716cb["discovery-receipt.json#164<br/><code>d13716cb</code>"]
  n54c212a9["discovery-receipt.json#165<br/><code>54c212a9</code>"]
  nba58b6c8["discovery-receipt.json#166<br/><code>ba58b6c8</code>"]
  n10d10887["discovery-receipt.json#167<br/><code>10d10887</code>"]
  nc5c79b70["discovery-receipt.json#168<br/><code>c5c79b70</code>"]
  nfd77aceb["discovery-receipt.json#169<br/><code>fd77aceb</code>"]
  n08c4bac0["discovery-receipt.json#170<br/><code>08c4bac0</code>"]
  n47e8aab3["discovery-receipt.json#171<br/><code>47e8aab3</code>"]
  n195f37b4["discovery-receipt.json#172<br/><code>195f37b4</code>"]
  n46721768["discovery-receipt.json#173<br/><code>46721768</code>"]
  n465a7296["discovery-receipt.json#174<br/><code>465a7296</code>"]
  nd29a0a36["discovery-receipt.json#175<br/><code>d29a0a36</code>"]
  n2cce7b6c["discovery-receipt.json#176<br/><code>2cce7b6c</code>"]
  n515e1070["discovery-receipt.json#177<br/><code>515e1070</code>"]
  n96ebeea8["discovery-receipt.json#178<br/><code>96ebeea8</code>"]
  n26d059ef["discovery-receipt.json#179<br/><code>26d059ef</code>"]
  n0221af89["discovery-receipt.json#180<br/><code>0221af89</code>"]
  ndd906823["discovery-receipt.json#181<br/><code>dd906823</code>"]
  n737f8d4a["discovery-receipt.json#182<br/><code>737f8d4a</code>"]
  naac0d4ff["discovery-receipt.json#183<br/><code>aac0d4ff</code>"]
  n3008a5d2["discovery-receipt.json#184<br/><code>3008a5d2</code>"]
  n207f38ba["discovery-receipt.json#185<br/><code>207f38ba</code>"]
  nb9764a7c["discovery-receipt.json#186<br/><code>b9764a7c</code>"]
  n533ce3f8["discovery-receipt.json#187<br/><code>533ce3f8</code>"]
  nb1e3ada6["discovery-receipt.json#188<br/><code>b1e3ada6</code>"]
  n8c29d38d["discovery-receipt.json#189<br/><code>8c29d38d</code>"]
  n575956f3["discovery-receipt.json#190<br/><code>575956f3</code>"]
  nfc6a72e5["discovery-receipt.json#191<br/><code>fc6a72e5</code>"]
  n03a8778f["discovery-receipt.json#192<br/><code>03a8778f</code>"]
  nd30c77f5["discovery-receipt.json#193<br/><code>d30c77f5</code>"]
  nade49b3b["discovery-receipt.json#194<br/><code>ade49b3b</code>"]
  n35ded057["discovery-receipt.json#195<br/><code>35ded057</code>"]
  n265708c6["discovery-receipt.json#196<br/><code>265708c6</code>"]
  nde3c5ecb["discovery-receipt.json#197<br/><code>de3c5ecb</code>"]
  n3cdca497["discovery-receipt.json#198<br/><code>3cdca497</code>"]
  n7ead7fa2["discovery-receipt.json#199<br/><code>7ead7fa2</code>"]
  ne750923e["discovery-receipt.json#200<br/><code>e750923e</code>"]
  na09c747d["discovery-receipt.json#201<br/><code>a09c747d</code>"]
  nf622fdb9["discovery-receipt.json#202<br/><code>f622fdb9</code>"]
  n644d5748["discovery-receipt.json#203<br/><code>644d5748</code>"]
  n146dd364["discovery-receipt.json#204<br/><code>146dd364</code>"]
  n42fae4f1["discovery-receipt.json#205<br/><code>42fae4f1</code>"]
  ncc5c83ca["discovery-receipt.json#206<br/><code>cc5c83ca</code>"]
  ndcee649b["discovery-receipt.json#207<br/><code>dcee649b</code>"]
  nbed7c649["discovery-receipt.json#208<br/><code>bed7c649</code>"]
  n16c5c26c["discovery-receipt.json#209<br/><code>16c5c26c</code>"]
  n2ed0012e["discovery-receipt.json#210<br/><code>2ed0012e</code>"]
  n614827d4["discovery-receipt.json#211<br/><code>614827d4</code>"]
  n332a0b05["discovery-receipt.json#212<br/><code>332a0b05</code>"]
  n64acf609["discovery-receipt.json#213<br/><code>64acf609</code>"]
  n036d62a0["discovery-receipt.json#214<br/><code>036d62a0</code>"]
  n5dd5f7f5["discovery-receipt.json#215<br/><code>5dd5f7f5</code>"]
  n39d474ac["discovery-receipt.json#216<br/><code>39d474ac</code>"]
  n8df32896["discovery-receipt.json#217<br/><code>8df32896</code>"]
  nbfe8955f["discovery-receipt.json#218<br/><code>bfe8955f</code>"]
  n83457d35["discovery-receipt.json#219<br/><code>83457d35</code>"]
  nddcc9d0f["discovery-receipt.json#220<br/><code>ddcc9d0f</code>"]
  nd5c573c9["discovery-receipt.json#221<br/><code>d5c573c9</code>"]
  nf60efdab["discovery-receipt.json#222<br/><code>f60efdab</code>"]
  necedc3c9["discovery-receipt.json#223<br/><code>ecedc3c9</code>"]
  n1c5e29eb["discovery-receipt.json#224<br/><code>1c5e29eb</code>"]
  ne14c561c["discovery-receipt.json#225<br/><code>e14c561c</code>"]
  nf1693d0f["discovery-receipt.json#226<br/><code>f1693d0f</code>"]
  na24ab53f["discovery-receipt.json#227<br/><code>a24ab53f</code>"]
  n8d8352a0["discovery-receipt.json#228<br/><code>8d8352a0</code>"]
  n23bb18d5["discovery-receipt.json#229<br/><code>23bb18d5</code>"]
  na5977a2f["flaws-receipt.json<br/><code>a5977a2f</code>"]
  n98ea2bce["formulas-receipt.json<br/><code>98ea2bce</code>"]
  nc2e41006["formulas-receipt.json#0<br/><code>c2e41006</code>"]
  n55cc5272["formulas-receipt.json#1<br/><code>55cc5272</code>"]
  n9d88febc["formulas-receipt.json#2<br/><code>9d88febc</code>"]
  n196b054f["formulas-receipt.json#3<br/><code>196b054f</code>"]
  na93283a0["formulas-receipt.json#4<br/><code>a93283a0</code>"]
  n655ab557["formulas-receipt.json#5<br/><code>655ab557</code>"]
  nb4acca72["formulas-receipt.json#6<br/><code>b4acca72</code>"]
  n4a54b279["formulas-receipt.json#7<br/><code>4a54b279</code>"]
  n5a371732["formulas-receipt.json#8<br/><code>5a371732</code>"]
  nb0714cfc["formulas-receipt.json#9<br/><code>b0714cfc</code>"]
  n60b9f47f["formulas-receipt.json#10<br/><code>60b9f47f</code>"]
  n3ea16bea["formulas-receipt.json#11<br/><code>3ea16bea</code>"]
  n7f625fae["formulas-receipt.json#12<br/><code>7f625fae</code>"]
  n2cfeda23["formulas-receipt.json#13<br/><code>2cfeda23</code>"]
  nf2132b2f["formulas-receipt.json#14<br/><code>f2132b2f</code>"]
  n0037012d["formulas-receipt.json#15<br/><code>0037012d</code>"]
  n59f494bb["formulas-receipt.json#16<br/><code>59f494bb</code>"]
  n04d564a8["formulas-receipt.json#17<br/><code>04d564a8</code>"]
  nd67ee6f9["formulas-receipt.json#18<br/><code>d67ee6f9</code>"]
  n7ec26d87["formulas-receipt.json#19<br/><code>7ec26d87</code>"]
  nbddde8c4["formulas-receipt.json#20<br/><code>bddde8c4</code>"]
  n588115d9["formulas-receipt.json#21<br/><code>588115d9</code>"]
  n07c8f29e["formulas-receipt.json#22<br/><code>07c8f29e</code>"]
  n0f1112be["formulas-receipt.json#23<br/><code>0f1112be</code>"]
  nb7f304a1["formulas-receipt.json#24<br/><code>b7f304a1</code>"]
  n3dc00de8["formulas-receipt.json#25<br/><code>3dc00de8</code>"]
  na8ad9f60["formulas-receipt.json#26<br/><code>a8ad9f60</code>"]
  n10a0d625["formulas-receipt.json#27<br/><code>10a0d625</code>"]
  n44236939["formulas-receipt.json#28<br/><code>44236939</code>"]
  nb61aa6c7["formulas-receipt.json#29<br/><code>b61aa6c7</code>"]
  nec4b3f17["formulas-receipt.json#30<br/><code>ec4b3f17</code>"]
  n7e08f602["formulas-receipt.json#31<br/><code>7e08f602</code>"]
  nea3e4fcd["formulas-receipt.json#32<br/><code>ea3e4fcd</code>"]
  n027b8b17["formulas-receipt.json#33<br/><code>027b8b17</code>"]
  n327ae992["formulas-receipt.json#34<br/><code>327ae992</code>"]
  ne11fbd20["formulas-receipt.json#35<br/><code>e11fbd20</code>"]
  nc3c82234["formulas-receipt.json#36<br/><code>c3c82234</code>"]
  n32770239["formulas-receipt.json#37<br/><code>32770239</code>"]
  n968ef5a6["formulas-receipt.json#38<br/><code>968ef5a6</code>"]
  n24b8a577["formulas-receipt.json#39<br/><code>24b8a577</code>"]
  nbc4fa987["formulas-receipt.json#40<br/><code>bc4fa987</code>"]
  nc634f06f["formulas-receipt.json#41<br/><code>c634f06f</code>"]
  n9241c36a["formulas-receipt.json#42<br/><code>9241c36a</code>"]
  n7ed35ac4["formulas-receipt.json#43<br/><code>7ed35ac4</code>"]
  nd029f40b["formulas-receipt.json#44<br/><code>d029f40b</code>"]
  n91fb680d["formulas-receipt.json#45<br/><code>91fb680d</code>"]
  n0c909e45["formulas-receipt.json#46<br/><code>0c909e45</code>"]
  n180817ef["formulas-receipt.json#47<br/><code>180817ef</code>"]
  ndddf23cf["formulas-receipt.json#48<br/><code>dddf23cf</code>"]
  n5fe74812["formulas-receipt.json#49<br/><code>5fe74812</code>"]
  nabac1f95["formulas-receipt.json#50<br/><code>abac1f95</code>"]
  nab20f92a["formulas-receipt.json#51<br/><code>ab20f92a</code>"]
  n8248a08d["formulas-receipt.json#52<br/><code>8248a08d</code>"]
  nde0390f9["formulas-receipt.json#53<br/><code>de0390f9</code>"]
  n725643e0["formulas-receipt.json#54<br/><code>725643e0</code>"]
  n4ec4e6f7["formulas-receipt.json#55<br/><code>4ec4e6f7</code>"]
  nd46954da["formulas-receipt.json#56<br/><code>d46954da</code>"]
  nd38b5df8["formulas-receipt.json#57<br/><code>d38b5df8</code>"]
  n7dec05e2["formulas-receipt.json#58<br/><code>7dec05e2</code>"]
  nd13ccf92["formulas-receipt.json#59<br/><code>d13ccf92</code>"]
  n0873c6c8["formulas-receipt.json#60<br/><code>0873c6c8</code>"]
  nd11b6808["formulas-receipt.json#61<br/><code>d11b6808</code>"]
  n7ed9ed2f["formulas-receipt.json#62<br/><code>7ed9ed2f</code>"]
  n111b539e["formulas-receipt.json#63<br/><code>111b539e</code>"]
  n93ddd474["formulas-receipt.json#64<br/><code>93ddd474</code>"]
  nc63d6723["formulas-receipt.json#65<br/><code>c63d6723</code>"]
  nbbfdbc42["formulas-receipt.json#66<br/><code>bbfdbc42</code>"]
  nffc9841e["formulas-receipt.json#67<br/><code>ffc9841e</code>"]
  n5e632150["formulas-receipt.json#68<br/><code>5e632150</code>"]
  n566a564f["formulas-receipt.json#69<br/><code>566a564f</code>"]
  n948e436b["formulas-receipt.json#70<br/><code>948e436b</code>"]
  nd8db0c12["formulas-receipt.json#71<br/><code>d8db0c12</code>"]
  ne60499d4["formulas-receipt.json#72<br/><code>e60499d4</code>"]
  n029d4f23["formulas-receipt.json#73<br/><code>029d4f23</code>"]
  na7c3f193["formulas-receipt.json#74<br/><code>a7c3f193</code>"]
  n430d70c8["formulas-receipt.json#75<br/><code>430d70c8</code>"]
  n8baaedbc["formulas-receipt.json#76<br/><code>8baaedbc</code>"]
  nb468130b["formulas-receipt.json#77<br/><code>b468130b</code>"]
  n021d0d28["formulas-receipt.json#78<br/><code>021d0d28</code>"]
  nfae933cc["fuse-receipt.json<br/><code>fae933cc</code>"]
  n9599da48["lattice-receipt.json<br/><code>9599da48</code>"]
  nbbb3e4f7["lean-receipt.json<br/><code>bbb3e4f7</code>"]
  nc51ad2fa["lean-receipt.json#0<br/><code>c51ad2fa</code>"]
  n194fa01c["lean-receipt.json#1<br/><code>194fa01c</code>"]
  ndfce9e12["lean-receipt.json#2<br/><code>dfce9e12</code>"]
  n3ec76e26["lean-receipt.json#3<br/><code>3ec76e26</code>"]
  n8acf4ac8["lean-receipt.json#4<br/><code>8acf4ac8</code>"]
  n633408fd["lean-receipt.json#5<br/><code>633408fd</code>"]
  n4ca893e8["lean-receipt.json#6<br/><code>4ca893e8</code>"]
  n3e51d111["lean-receipt.json#7<br/><code>3e51d111</code>"]
  nd897da6e["lean-receipt.json#8<br/><code>d897da6e</code>"]
  n31e334ab["lean-receipt.json#9<br/><code>31e334ab</code>"]
  naba7bb80["lean-receipt.json#10<br/><code>aba7bb80</code>"]
  nfdeae1e5["lean-receipt.json#11<br/><code>fdeae1e5</code>"]
  n440b2d8d["lean-receipt.json#12<br/><code>440b2d8d</code>"]
  n22ba3823["lean-receipt.json#13<br/><code>22ba3823</code>"]
  nfcaab01a["lean-receipt.json#14<br/><code>fcaab01a</code>"]
  n85feb219["lean-receipt.json#15<br/><code>85feb219</code>"]
  n50297fe3["lean-receipt.json#16<br/><code>50297fe3</code>"]
  n775eb852["lean-receipt.json#17<br/><code>775eb852</code>"]
  n14b9a1cf["lean-receipt.json#18<br/><code>14b9a1cf</code>"]
  n6e3aeb60["lean-receipt.json#19<br/><code>6e3aeb60</code>"]
  n08e3a662["lean-receipt.json#20<br/><code>08e3a662</code>"]
  n29c4640c["lean-receipt.json#21<br/><code>29c4640c</code>"]
  nc2ec0966["lean-receipt.json#22<br/><code>c2ec0966</code>"]
  n7076f7a8["lean-receipt.json#23<br/><code>7076f7a8</code>"]
  na4e5edd3["lean-receipt.json#24<br/><code>a4e5edd3</code>"]
  n877c72e3["lean-receipt.json#25<br/><code>877c72e3</code>"]
  n4e006b41["lean-receipt.json#26<br/><code>4e006b41</code>"]
  n2661596f["lean-receipt.json#27<br/><code>2661596f</code>"]
  n7e1e9811["lean-receipt.json#28<br/><code>7e1e9811</code>"]
  n64a40aef["lean-receipt.json#29<br/><code>64a40aef</code>"]
  nfec4a466["lean-receipt.json#30<br/><code>fec4a466</code>"]
  nb5ba2aad["lean-receipt.json#31<br/><code>b5ba2aad</code>"]
  n80160332["lean-receipt.json#32<br/><code>80160332</code>"]
  n68461d41["lean-receipt.json#33<br/><code>68461d41</code>"]
  n9937f890["lean-receipt.json#34<br/><code>9937f890</code>"]
  n0cb6c9bb["lean-receipt.json#35<br/><code>0cb6c9bb</code>"]
  nfadad1e3["lean-receipt.json#36<br/><code>fadad1e3</code>"]
  n1725ab67["lean-receipt.json#37<br/><code>1725ab67</code>"]
  n21672244["lean-receipt.json#38<br/><code>21672244</code>"]
  ne461cc5d["lean-receipt.json#39<br/><code>e461cc5d</code>"]
  nd3fc4f6d["lean-receipt.json#40<br/><code>d3fc4f6d</code>"]
  nfbf4fd67["lean-receipt.json#41<br/><code>fbf4fd67</code>"]
  n9a75ac51["lean-receipt.json#42<br/><code>9a75ac51</code>"]
  n4209f3cc["lean-receipt.json#43<br/><code>4209f3cc</code>"]
  n0f3abe4a["lean-receipt.json#44<br/><code>0f3abe4a</code>"]
  n7e678c5f["lean-receipt.json#45<br/><code>7e678c5f</code>"]
  n49fecc1d["lean-receipt.json#46<br/><code>49fecc1d</code>"]
  n47ceb9c9["lean-receipt.json#47<br/><code>47ceb9c9</code>"]
  n0c80a675["lean-receipt.json#48<br/><code>0c80a675</code>"]
  nc92607a9["lean-receipt.json#49<br/><code>c92607a9</code>"]
  nc7ed789e["lean-receipt.json#50<br/><code>c7ed789e</code>"]
  nf58bd0ae["lean-receipt.json#51<br/><code>f58bd0ae</code>"]
  n151fc952["lean-receipt.json#52<br/><code>151fc952</code>"]
  n5f243533["lean-receipt.json#53<br/><code>5f243533</code>"]
  n966b2478["lean-receipt.json#54<br/><code>966b2478</code>"]
  n1d1630cb["lean-receipt.json#55<br/><code>1d1630cb</code>"]
  n0cad781f["lean-receipt.json#56<br/><code>0cad781f</code>"]
  n47d31f05["lean-receipt.json#57<br/><code>47d31f05</code>"]
  n2af51a39["lean-receipt.json#58<br/><code>2af51a39</code>"]
  n85cf96bf["lean-receipt.json#59<br/><code>85cf96bf</code>"]
  na705abb8["lean-receipt.json#60<br/><code>a705abb8</code>"]
  nbe7e6084["lean-receipt.json#61<br/><code>be7e6084</code>"]
  nf411eb43["lean-receipt.json#62<br/><code>f411eb43</code>"]
  nc9e50ad9["lean-receipt.json#63<br/><code>c9e50ad9</code>"]
  ne078a9a9["lean-receipt.json#64<br/><code>e078a9a9</code>"]
  n2c9cc26f["lean-receipt.json#65<br/><code>2c9cc26f</code>"]
  n18d05e91["lean-receipt.json#66<br/><code>18d05e91</code>"]
  n3921f151["lean-receipt.json#67<br/><code>3921f151</code>"]
  nb89ff4ce["lean-receipt.json#68<br/><code>b89ff4ce</code>"]
  n7ac10efe["lean-receipt.json#69<br/><code>7ac10efe</code>"]
  n4df01de1["lean-receipt.json#70<br/><code>4df01de1</code>"]
  nfe1f48d4["lean-receipt.json#71<br/><code>fe1f48d4</code>"]
  nfd2fca7d["lean-receipt.json#72<br/><code>fd2fca7d</code>"]
  n7dcc3ce2["lean-receipt.json#73<br/><code>7dcc3ce2</code>"]
  na4524944["lean-receipt.json#74<br/><code>a4524944</code>"]
  n2b0715ed["lean-receipt.json#75<br/><code>2b0715ed</code>"]
  nc490360f["lean-receipt.json#76<br/><code>c490360f</code>"]
  nf9a2bdf6["lean-receipt.json#77<br/><code>f9a2bdf6</code>"]
  nb264aaf0["lean-receipt.json#78<br/><code>b264aaf0</code>"]
  n675aaab9["lean-receipt.json#79<br/><code>675aaab9</code>"]
  nfbdc4dfa["lean-receipt.json#80<br/><code>fbdc4dfa</code>"]
  n52286689["lean-receipt.json#81<br/><code>52286689</code>"]
  n583f1da2["lean-receipt.json#82<br/><code>583f1da2</code>"]
  n948684e7["lean-receipt.json#83<br/><code>948684e7</code>"]
  ndf2b8778["lean-receipt.json#84<br/><code>df2b8778</code>"]
  n2c882ed3["lean-receipt.json#85<br/><code>2c882ed3</code>"]
  nfe1e9325["lean-receipt.json#86<br/><code>fe1e9325</code>"]
  nac1cc6f9["lean-receipt.json#87<br/><code>ac1cc6f9</code>"]
  n2dea2125["lean-receipt.json#88<br/><code>2dea2125</code>"]
  n15d0d7a3["lean-receipt.json#89<br/><code>15d0d7a3</code>"]
  nfb5bb67d["lean-receipt.json#90<br/><code>fb5bb67d</code>"]
  n6ed76ce9["lean-receipt.json#91<br/><code>6ed76ce9</code>"]
  n7e037f78["lean-receipt.json#92<br/><code>7e037f78</code>"]
  n0205f307["lean-receipt.json#93<br/><code>0205f307</code>"]
  n7c79865c["lean-receipt.json#94<br/><code>7c79865c</code>"]
  nef12270e["lean-receipt.json#95<br/><code>ef12270e</code>"]
  n0bf527e5["lean-receipt.json#96<br/><code>0bf527e5</code>"]
  n4aacddc2["lean-receipt.json#97<br/><code>4aacddc2</code>"]
  n0deeeb31["lean-receipt.json#98<br/><code>0deeeb31</code>"]
  ne1eafe2a["lean-receipt.json#99<br/><code>e1eafe2a</code>"]
  nbaf64af4["lean-receipt.json#100<br/><code>baf64af4</code>"]
  nfdda2ebe["lean-receipt.json#101<br/><code>fdda2ebe</code>"]
  nfd77d01a["lean-receipt.json#102<br/><code>fd77d01a</code>"]
  nac0c5365["lean-receipt.json#103<br/><code>ac0c5365</code>"]
  nd410aa42["lean-receipt.json#104<br/><code>d410aa42</code>"]
  nf63d316d["lean-receipt.json#105<br/><code>f63d316d</code>"]
  nc68247ec["lean-receipt.json#106<br/><code>c68247ec</code>"]
  n713a2aaa["lean-receipt.json#107<br/><code>713a2aaa</code>"]
  n81a03a5e["lean-receipt.json#108<br/><code>81a03a5e</code>"]
  n462412a6["lean-receipt.json#109<br/><code>462412a6</code>"]
  n75fe86eb["lean-receipt.json#110<br/><code>75fe86eb</code>"]
  nd4cb7f31["lean-receipt.json#111<br/><code>d4cb7f31</code>"]
  n80010f4b["lean-receipt.json#112<br/><code>80010f4b</code>"]
  n6be2beb8["lean-receipt.json#113<br/><code>6be2beb8</code>"]
  n5de2dfcb["lean-receipt.json#114<br/><code>5de2dfcb</code>"]
  n8a116d3f["lean-receipt.json#115<br/><code>8a116d3f</code>"]
  n746e75b0["lean-receipt.json#116<br/><code>746e75b0</code>"]
  n23160ed2["lean-receipt.json#117<br/><code>23160ed2</code>"]
  n4e505bcf["lean-receipt.json#118<br/><code>4e505bcf</code>"]
  n87e6583f["lean-receipt.json#119<br/><code>87e6583f</code>"]
  n7d0a7b21["lean-receipt.json#120<br/><code>7d0a7b21</code>"]
  n2e03dcff["lean-receipt.json#121<br/><code>2e03dcff</code>"]
  na80fca18["lean-receipt.json#122<br/><code>a80fca18</code>"]
  n68e79260["lean-receipt.json#123<br/><code>68e79260</code>"]
  ndcb61df5["payload-cf-receipt.json<br/><code>dcb61df5</code>"]
  n114d2cb8["percall-receipt.json<br/><code>114d2cb8</code>"]
  ndcc1e97c["refusals-receipt.json<br/><code>dcc1e97c</code>"]
  n49789ed7["test-receipt.json<br/><code>49789ed7</code>"]
  n4d33bb2f["test-receipt.json#0<br/><code>4d33bb2f</code>"]
  n00656e9e["test-receipt.json#1<br/><code>00656e9e</code>"]
  n920ffe6c["test-receipt.json#2<br/><code>920ffe6c</code>"]
  ndd913bd4["test-receipt.json#3<br/><code>dd913bd4</code>"]
  n6e2291fe["test-receipt.json#4<br/><code>6e2291fe</code>"]
  nadb45227["test-receipt.json#5<br/><code>adb45227</code>"]
  nb88cddf6["test-receipt.json#6<br/><code>b88cddf6</code>"]
  n362caec0["test-receipt.json#7<br/><code>362caec0</code>"]
  nd2b5b973["test-receipt.json#8<br/><code>d2b5b973</code>"]
  n3b73940f["test-receipt.json#9<br/><code>3b73940f</code>"]
  nec04c08a["test-receipt.json#10<br/><code>ec04c08a</code>"]
  n1a930f0d["walls-receipt.json<br/><code>1a930f0d</code>"]
  nd087460d["readme<br/><code>d087460d</code>"]
  n16cee539 --> n004b5f02
  n004b5f02 --> n6954952d
  n004b5f02 --> n24c79da7
  n004b5f02 --> n33c408b6
  n004b5f02 --> nab3fe26e
  n004b5f02 --> n2c455c33
  n004b5f02 --> nbe0fab25
  n004b5f02 --> n6f0cfe85
  n004b5f02 --> n7780626a
  n004b5f02 --> n85df2aad
  n004b5f02 --> n9b255abe
  n004b5f02 --> nc0003dcb
  n004b5f02 --> n0809d858
  n004b5f02 --> na725fa0f
  n004b5f02 --> nafa21ec3
  n004b5f02 --> nc740edac
  n004b5f02 --> n5822b734
  n004b5f02 --> n7644ebae
  n004b5f02 --> n0230db57
  n004b5f02 --> n2ccd028d
  n004b5f02 --> n298a9cd0
  n004b5f02 --> n75b17341
  n004b5f02 --> n3b046eb6
  n004b5f02 --> n3bedb308
  n004b5f02 --> nb2dd6643
  n004b5f02 --> n2699b978
  n004b5f02 --> n16e79b5b
  n004b5f02 --> nd2ec2217
  n004b5f02 --> n55bde7f8
  n004b5f02 --> n60ac759f
  n004b5f02 --> n7f2743a7
  n16cee539 --> n2fca7629
  n16cee539 --> n71b6a6e4
  n71b6a6e4 --> ne1390b4e
  n71b6a6e4 --> na4d6eeea
  n71b6a6e4 --> n40cc6d07
  n71b6a6e4 --> nbbc904a8
  n71b6a6e4 --> n27860f41
  n71b6a6e4 --> n5baf6dcf
  n71b6a6e4 --> n6ead3073
  n71b6a6e4 --> ndf552522
  n71b6a6e4 --> n13a80223
  n71b6a6e4 --> n04218162
  n71b6a6e4 --> ndaa74981
  n71b6a6e4 --> n2674e8e2
  n71b6a6e4 --> nfa9d5cbb
  n71b6a6e4 --> ne6c615e6
  n71b6a6e4 --> nb9334a2f
  n71b6a6e4 --> n885cbb1e
  n71b6a6e4 --> nf8cd78b5
  n71b6a6e4 --> n591568c2
  n71b6a6e4 --> n26f1f6ed
  n71b6a6e4 --> n2573c526
  n71b6a6e4 --> n870faf91
  n71b6a6e4 --> nc1aa599f
  n71b6a6e4 --> nc8a37485
  n71b6a6e4 --> n680911be
  n71b6a6e4 --> n98e9c3e2
  n71b6a6e4 --> n58a8fb21
  n71b6a6e4 --> ncc7cfad2
  n71b6a6e4 --> nc8d44348
  n71b6a6e4 --> nf2b152f9
  n71b6a6e4 --> nd8f6cbec
  n71b6a6e4 --> ned16a6ce
  n71b6a6e4 --> nabafc17c
  n71b6a6e4 --> n255f7979
  n71b6a6e4 --> n2b1177c0
  n71b6a6e4 --> nc7857115
  n71b6a6e4 --> n2d0bd68e
  n71b6a6e4 --> n233e35d0
  n71b6a6e4 --> n09d0b6bc
  n71b6a6e4 --> nc7f9bc88
  n71b6a6e4 --> n9d24417c
  n71b6a6e4 --> nde7bd2f6
  n71b6a6e4 --> n5500c42b
  n71b6a6e4 --> n2f765e71
  n71b6a6e4 --> n50768208
  n71b6a6e4 --> n7233ca3b
  n71b6a6e4 --> n59f711f3
  n71b6a6e4 --> na8fe47c0
  n71b6a6e4 --> n7ce0dce4
  n71b6a6e4 --> n2eb78807
  n71b6a6e4 --> n3ac8f9c8
  n71b6a6e4 --> nb9cbefd7
  n71b6a6e4 --> n4cb84529
  n71b6a6e4 --> n315871b9
  n71b6a6e4 --> n4ad87e7e
  n71b6a6e4 --> nd1012a1d
  n71b6a6e4 --> n22e9d846
  n71b6a6e4 --> nef882e04
  n71b6a6e4 --> n19244517
  n71b6a6e4 --> n9ec0c1da
  n71b6a6e4 --> n1a93a1b2
  n71b6a6e4 --> n6192b744
  n71b6a6e4 --> nb0e531a3
  n71b6a6e4 --> n5bb06577
  n71b6a6e4 --> n83cc866e
  n71b6a6e4 --> nfa69d082
  n71b6a6e4 --> n90619277
  n71b6a6e4 --> ne03a7833
  n71b6a6e4 --> na9312500
  n71b6a6e4 --> nac477e24
  n71b6a6e4 --> n1154a232
  n71b6a6e4 --> n2dbf9821
  n71b6a6e4 --> n784f0480
  n71b6a6e4 --> n65ebed61
  n71b6a6e4 --> n1403791e
  n71b6a6e4 --> nc3c370ad
  n71b6a6e4 --> na62ec354
  n71b6a6e4 --> n806a5ec0
  n71b6a6e4 --> n88a3bcb0
  n71b6a6e4 --> n0451d033
  n71b6a6e4 --> n72eca790
  n71b6a6e4 --> ne89ccd69
  n71b6a6e4 --> n677aaeb7
  n71b6a6e4 --> n5ca5f67d
  n71b6a6e4 --> nd6c48686
  n71b6a6e4 --> nb1640d82
  n71b6a6e4 --> n7287b3c6
  n71b6a6e4 --> nbac6a356
  n71b6a6e4 --> n1b6a86fc
  n71b6a6e4 --> n3fe34e47
  n71b6a6e4 --> nb1ad43cf
  n71b6a6e4 --> n2aba3335
  n71b6a6e4 --> nef6655c1
  n71b6a6e4 --> n2db0a84b
  n71b6a6e4 --> n35bb8227
  n71b6a6e4 --> n0bfedd50
  n71b6a6e4 --> n68b1dd51
  n71b6a6e4 --> nb72d3b78
  n71b6a6e4 --> ne670ec28
  n71b6a6e4 --> nb06f1240
  n71b6a6e4 --> n89d23abd
  n71b6a6e4 --> ne956e7ba
  n71b6a6e4 --> nc066c6ee
  n71b6a6e4 --> n3e730c42
  n71b6a6e4 --> n1fe4cad2
  n71b6a6e4 --> n4df89767
  n71b6a6e4 --> n2ba4dd49
  n71b6a6e4 --> n710d20fb
  n71b6a6e4 --> n40e27c08
  n71b6a6e4 --> n0374eee1
  n71b6a6e4 --> nabb14693
  n71b6a6e4 --> n2e24d46e
  n71b6a6e4 --> na0d702d9
  n71b6a6e4 --> n35e879f6
  n71b6a6e4 --> n0d351449
  n71b6a6e4 --> nc827c0af
  n71b6a6e4 --> n283a0f8a
  n71b6a6e4 --> n579631cf
  n71b6a6e4 --> ndabe632f
  n71b6a6e4 --> n961a6ac0
  n71b6a6e4 --> nff430e0b
  n71b6a6e4 --> n09f1700e
  n71b6a6e4 --> nd156056a
  n71b6a6e4 --> n39e4fc76
  n71b6a6e4 --> n8858f706
  n71b6a6e4 --> n853779ec
  n71b6a6e4 --> na758b7bc
  n71b6a6e4 --> n150cddc1
  n71b6a6e4 --> n8b7d17ea
  n71b6a6e4 --> nd7b82b6a
  n71b6a6e4 --> n7fd4b531
  n71b6a6e4 --> nacc9241e
  n71b6a6e4 --> n5170883f
  n71b6a6e4 --> n77a3b6cb
  n71b6a6e4 --> n23c547de
  n71b6a6e4 --> ne97a76b5
  n71b6a6e4 --> n5fe33cf5
  n71b6a6e4 --> n03170702
  n71b6a6e4 --> n44877d15
  n71b6a6e4 --> nb40c5fc2
  n71b6a6e4 --> naaf6a1cb
  n71b6a6e4 --> n4e14ced0
  n71b6a6e4 --> n2ee66faf
  n71b6a6e4 --> na65fe0b1
  n71b6a6e4 --> n48899b7d
  n71b6a6e4 --> ne970e12e
  n71b6a6e4 --> n8ddf6c6b
  n71b6a6e4 --> n9532bcb8
  n71b6a6e4 --> n63c77d0b
  n71b6a6e4 --> nbef94b3b
  n71b6a6e4 --> ne54bfdc8
  n71b6a6e4 --> na9afd709
  n71b6a6e4 --> nc0b7834c
  n71b6a6e4 --> n2eeac53d
  n71b6a6e4 --> n2405513a
  n71b6a6e4 --> n7fdde1ba
  n71b6a6e4 --> n22855962
  n71b6a6e4 --> ne0808f36
  n71b6a6e4 --> n272aa096
  n71b6a6e4 --> na54a1401
  n71b6a6e4 --> n645d2b9b
  n71b6a6e4 --> n20b07da1
  n71b6a6e4 --> nf24e48d6
  n71b6a6e4 --> n65ed5ebd
  n71b6a6e4 --> n104d804e
  n71b6a6e4 --> nd13716cb
  n71b6a6e4 --> n54c212a9
  n71b6a6e4 --> nba58b6c8
  n71b6a6e4 --> n10d10887
  n71b6a6e4 --> nc5c79b70
  n71b6a6e4 --> nfd77aceb
  n71b6a6e4 --> n08c4bac0
  n71b6a6e4 --> n47e8aab3
  n71b6a6e4 --> n195f37b4
  n71b6a6e4 --> n46721768
  n71b6a6e4 --> n465a7296
  n71b6a6e4 --> nd29a0a36
  n71b6a6e4 --> n2cce7b6c
  n71b6a6e4 --> n515e1070
  n71b6a6e4 --> n96ebeea8
  n71b6a6e4 --> n26d059ef
  n71b6a6e4 --> n0221af89
  n71b6a6e4 --> ndd906823
  n71b6a6e4 --> n737f8d4a
  n71b6a6e4 --> naac0d4ff
  n71b6a6e4 --> n3008a5d2
  n71b6a6e4 --> n207f38ba
  n71b6a6e4 --> nb9764a7c
  n71b6a6e4 --> n533ce3f8
  n71b6a6e4 --> nb1e3ada6
  n71b6a6e4 --> n8c29d38d
  n71b6a6e4 --> n575956f3
  n71b6a6e4 --> nfc6a72e5
  n71b6a6e4 --> n03a8778f
  n71b6a6e4 --> nd30c77f5
  n71b6a6e4 --> nade49b3b
  n71b6a6e4 --> n35ded057
  n71b6a6e4 --> n265708c6
  n71b6a6e4 --> nde3c5ecb
  n71b6a6e4 --> n3cdca497
  n71b6a6e4 --> n7ead7fa2
  n71b6a6e4 --> ne750923e
  n71b6a6e4 --> na09c747d
  n71b6a6e4 --> nf622fdb9
  n71b6a6e4 --> n644d5748
  n71b6a6e4 --> n146dd364
  n71b6a6e4 --> n42fae4f1
  n71b6a6e4 --> ncc5c83ca
  n71b6a6e4 --> ndcee649b
  n71b6a6e4 --> nbed7c649
  n71b6a6e4 --> n16c5c26c
  n71b6a6e4 --> n2ed0012e
  n71b6a6e4 --> n614827d4
  n71b6a6e4 --> n332a0b05
  n71b6a6e4 --> n64acf609
  n71b6a6e4 --> n036d62a0
  n71b6a6e4 --> n5dd5f7f5
  n71b6a6e4 --> n39d474ac
  n71b6a6e4 --> n8df32896
  n71b6a6e4 --> nbfe8955f
  n71b6a6e4 --> n83457d35
  n71b6a6e4 --> nddcc9d0f
  n71b6a6e4 --> nd5c573c9
  n71b6a6e4 --> nf60efdab
  n71b6a6e4 --> necedc3c9
  n71b6a6e4 --> n1c5e29eb
  n71b6a6e4 --> ne14c561c
  n71b6a6e4 --> nf1693d0f
  n71b6a6e4 --> na24ab53f
  n71b6a6e4 --> n8d8352a0
  n71b6a6e4 --> n23bb18d5
  n16cee539 --> na5977a2f
  n16cee539 --> n98ea2bce
  n98ea2bce --> nc2e41006
  n98ea2bce --> n55cc5272
  n98ea2bce --> n9d88febc
  n98ea2bce --> n196b054f
  n98ea2bce --> na93283a0
  n98ea2bce --> n655ab557
  n98ea2bce --> nb4acca72
  n98ea2bce --> n4a54b279
  n98ea2bce --> n5a371732
  n98ea2bce --> nb0714cfc
  n98ea2bce --> n60b9f47f
  n98ea2bce --> n3ea16bea
  n98ea2bce --> n7f625fae
  n98ea2bce --> n2cfeda23
  n98ea2bce --> nf2132b2f
  n98ea2bce --> n0037012d
  n98ea2bce --> n59f494bb
  n98ea2bce --> n04d564a8
  n98ea2bce --> nd67ee6f9
  n98ea2bce --> n7ec26d87
  n98ea2bce --> nbddde8c4
  n98ea2bce --> n588115d9
  n98ea2bce --> n07c8f29e
  n98ea2bce --> n0f1112be
  n98ea2bce --> nb7f304a1
  n98ea2bce --> n3dc00de8
  n98ea2bce --> na8ad9f60
  n98ea2bce --> n10a0d625
  n98ea2bce --> n44236939
  n98ea2bce --> nb61aa6c7
  n98ea2bce --> nec4b3f17
  n98ea2bce --> n7e08f602
  n98ea2bce --> nea3e4fcd
  n98ea2bce --> n027b8b17
  n98ea2bce --> n327ae992
  n98ea2bce --> ne11fbd20
  n98ea2bce --> nc3c82234
  n98ea2bce --> n32770239
  n98ea2bce --> n968ef5a6
  n98ea2bce --> n24b8a577
  n98ea2bce --> nbc4fa987
  n98ea2bce --> nc634f06f
  n98ea2bce --> n9241c36a
  n98ea2bce --> n7ed35ac4
  n98ea2bce --> nd029f40b
  n98ea2bce --> n91fb680d
  n98ea2bce --> n0c909e45
  n98ea2bce --> n180817ef
  n98ea2bce --> ndddf23cf
  n98ea2bce --> n5fe74812
  n98ea2bce --> nabac1f95
  n98ea2bce --> nab20f92a
  n98ea2bce --> n8248a08d
  n98ea2bce --> nde0390f9
  n98ea2bce --> n725643e0
  n98ea2bce --> n4ec4e6f7
  n98ea2bce --> nd46954da
  n98ea2bce --> nd38b5df8
  n98ea2bce --> n7dec05e2
  n98ea2bce --> nd13ccf92
  n98ea2bce --> n0873c6c8
  n98ea2bce --> nd11b6808
  n98ea2bce --> n7ed9ed2f
  n98ea2bce --> n111b539e
  n98ea2bce --> n93ddd474
  n98ea2bce --> nc63d6723
  n98ea2bce --> nbbfdbc42
  n98ea2bce --> nffc9841e
  n98ea2bce --> n5e632150
  n98ea2bce --> n566a564f
  n98ea2bce --> n948e436b
  n98ea2bce --> nd8db0c12
  n98ea2bce --> ne60499d4
  n98ea2bce --> n029d4f23
  n98ea2bce --> na7c3f193
  n98ea2bce --> n430d70c8
  n98ea2bce --> n8baaedbc
  n98ea2bce --> nb468130b
  n98ea2bce --> n021d0d28
  n16cee539 --> nfae933cc
  n16cee539 --> n9599da48
  n16cee539 --> nbbb3e4f7
  nbbb3e4f7 --> nc51ad2fa
  nbbb3e4f7 --> n194fa01c
  nbbb3e4f7 --> ndfce9e12
  nbbb3e4f7 --> n3ec76e26
  nbbb3e4f7 --> n8acf4ac8
  nbbb3e4f7 --> n633408fd
  nbbb3e4f7 --> n4ca893e8
  nbbb3e4f7 --> n3e51d111
  nbbb3e4f7 --> nd897da6e
  nbbb3e4f7 --> n31e334ab
  nbbb3e4f7 --> naba7bb80
  nbbb3e4f7 --> nfdeae1e5
  nbbb3e4f7 --> n440b2d8d
  nbbb3e4f7 --> n22ba3823
  nbbb3e4f7 --> nfcaab01a
  nbbb3e4f7 --> n85feb219
  nbbb3e4f7 --> n50297fe3
  nbbb3e4f7 --> n775eb852
  nbbb3e4f7 --> n14b9a1cf
  nbbb3e4f7 --> n6e3aeb60
  nbbb3e4f7 --> n08e3a662
  nbbb3e4f7 --> n29c4640c
  nbbb3e4f7 --> nc2ec0966
  nbbb3e4f7 --> n7076f7a8
  nbbb3e4f7 --> na4e5edd3
  nbbb3e4f7 --> n877c72e3
  nbbb3e4f7 --> n4e006b41
  nbbb3e4f7 --> n2661596f
  nbbb3e4f7 --> n7e1e9811
  nbbb3e4f7 --> n64a40aef
  nbbb3e4f7 --> nfec4a466
  nbbb3e4f7 --> nb5ba2aad
  nbbb3e4f7 --> n80160332
  nbbb3e4f7 --> n68461d41
  nbbb3e4f7 --> n9937f890
  nbbb3e4f7 --> n0cb6c9bb
  nbbb3e4f7 --> nfadad1e3
  nbbb3e4f7 --> n1725ab67
  nbbb3e4f7 --> n21672244
  nbbb3e4f7 --> ne461cc5d
  nbbb3e4f7 --> nd3fc4f6d
  nbbb3e4f7 --> nfbf4fd67
  nbbb3e4f7 --> n9a75ac51
  nbbb3e4f7 --> n4209f3cc
  nbbb3e4f7 --> n0f3abe4a
  nbbb3e4f7 --> n7e678c5f
  nbbb3e4f7 --> n49fecc1d
  nbbb3e4f7 --> n47ceb9c9
  nbbb3e4f7 --> n0c80a675
  nbbb3e4f7 --> nc92607a9
  nbbb3e4f7 --> nc7ed789e
  nbbb3e4f7 --> nf58bd0ae
  nbbb3e4f7 --> n151fc952
  nbbb3e4f7 --> n5f243533
  nbbb3e4f7 --> n966b2478
  nbbb3e4f7 --> n1d1630cb
  nbbb3e4f7 --> n0cad781f
  nbbb3e4f7 --> n47d31f05
  nbbb3e4f7 --> n2af51a39
  nbbb3e4f7 --> n85cf96bf
  nbbb3e4f7 --> na705abb8
  nbbb3e4f7 --> nbe7e6084
  nbbb3e4f7 --> nf411eb43
  nbbb3e4f7 --> nc9e50ad9
  nbbb3e4f7 --> ne078a9a9
  nbbb3e4f7 --> n2c9cc26f
  nbbb3e4f7 --> n18d05e91
  nbbb3e4f7 --> n3921f151
  nbbb3e4f7 --> nb89ff4ce
  nbbb3e4f7 --> n7ac10efe
  nbbb3e4f7 --> n4df01de1
  nbbb3e4f7 --> nfe1f48d4
  nbbb3e4f7 --> nfd2fca7d
  nbbb3e4f7 --> n7dcc3ce2
  nbbb3e4f7 --> na4524944
  nbbb3e4f7 --> n2b0715ed
  nbbb3e4f7 --> nc490360f
  nbbb3e4f7 --> nf9a2bdf6
  nbbb3e4f7 --> nb264aaf0
  nbbb3e4f7 --> n675aaab9
  nbbb3e4f7 --> nfbdc4dfa
  nbbb3e4f7 --> n52286689
  nbbb3e4f7 --> n583f1da2
  nbbb3e4f7 --> n948684e7
  nbbb3e4f7 --> ndf2b8778
  nbbb3e4f7 --> n2c882ed3
  nbbb3e4f7 --> nfe1e9325
  nbbb3e4f7 --> nac1cc6f9
  nbbb3e4f7 --> n2dea2125
  nbbb3e4f7 --> n15d0d7a3
  nbbb3e4f7 --> nfb5bb67d
  nbbb3e4f7 --> n6ed76ce9
  nbbb3e4f7 --> n7e037f78
  nbbb3e4f7 --> n0205f307
  nbbb3e4f7 --> n7c79865c
  nbbb3e4f7 --> nef12270e
  nbbb3e4f7 --> n0bf527e5
  nbbb3e4f7 --> n4aacddc2
  nbbb3e4f7 --> n0deeeb31
  nbbb3e4f7 --> ne1eafe2a
  nbbb3e4f7 --> nbaf64af4
  nbbb3e4f7 --> nfdda2ebe
  nbbb3e4f7 --> nfd77d01a
  nbbb3e4f7 --> nac0c5365
  nbbb3e4f7 --> nd410aa42
  nbbb3e4f7 --> nf63d316d
  nbbb3e4f7 --> nc68247ec
  nbbb3e4f7 --> n713a2aaa
  nbbb3e4f7 --> n81a03a5e
  nbbb3e4f7 --> n462412a6
  nbbb3e4f7 --> n75fe86eb
  nbbb3e4f7 --> nd4cb7f31
  nbbb3e4f7 --> n80010f4b
  nbbb3e4f7 --> n6be2beb8
  nbbb3e4f7 --> n5de2dfcb
  nbbb3e4f7 --> n8a116d3f
  nbbb3e4f7 --> n746e75b0
  nbbb3e4f7 --> n23160ed2
  nbbb3e4f7 --> n4e505bcf
  nbbb3e4f7 --> n87e6583f
  nbbb3e4f7 --> n7d0a7b21
  nbbb3e4f7 --> n2e03dcff
  nbbb3e4f7 --> na80fca18
  nbbb3e4f7 --> n68e79260
  n16cee539 --> ndcb61df5
  n16cee539 --> n114d2cb8
  n16cee539 --> ndcc1e97c
  n16cee539 --> n49789ed7
  n49789ed7 --> n4d33bb2f
  n49789ed7 --> n00656e9e
  n49789ed7 --> n920ffe6c
  n49789ed7 --> ndd913bd4
  n49789ed7 --> n6e2291fe
  n49789ed7 --> nadb45227
  n49789ed7 --> nb88cddf6
  n49789ed7 --> n362caec0
  n49789ed7 --> nd2b5b973
  n49789ed7 --> n3b73940f
  n49789ed7 --> nec04c08a
  n16cee539 --> n1a930f0d
  n16cee539 --> nd087460d
```

| node | receipt uuid | referrer | payload fold | seq |
|---|---|---|---|---|
| root | `16cee539-71e7-883c-906b-72b98aa5174f` | `52f07241` | `ee31897de03e2182` | 0 |
| cross-receipt.json | `004b5f02-108d-8b3d-a458-8e0046b5c622` | `16cee539` | `32e33b4efc02552d` | 1 |
| cross-receipt.json#0 | `6954952d-07a3-8afc-a933-3603feed9281` | `004b5f02` | `1dfb50c09d3ec562` | 2 |
| cross-receipt.json#1 | `24c79da7-42bd-849f-bc51-2daeb5368066` | `004b5f02` | `71cd4b0253241eba` | 3 |
| cross-receipt.json#2 | `33c408b6-308e-850f-8bcd-0631ad93aaff` | `004b5f02` | `d395906a7c1ca3bd` | 4 |
| cross-receipt.json#3 | `ab3fe26e-4857-886b-9ef1-1bfd9b845245` | `004b5f02` | `6d6d0a981d52ac76` | 5 |
| cross-receipt.json#4 | `2c455c33-e6b5-818d-bc4c-292f3f94f64f` | `004b5f02` | `3206e3e260b0bda7` | 6 |
| cross-receipt.json#5 | `be0fab25-9236-8208-8db4-1c4fb2af011a` | `004b5f02` | `15acf0a0cff5c260` | 7 |
| cross-receipt.json#6 | `6f0cfe85-1a8b-8682-af4b-93ebfe47f87e` | `004b5f02` | `15196e19197c8657` | 8 |
| cross-receipt.json#7 | `7780626a-d4d2-8fb2-a963-730f3e0a1a4a` | `004b5f02` | `c63f9497ab57fde9` | 9 |
| cross-receipt.json#8 | `85df2aad-e237-8a9c-8f09-3f2b9266de96` | `004b5f02` | `e153a0b9425f5a0a` | 10 |
| cross-receipt.json#9 | `9b255abe-238c-871b-a55f-04ceb55c6310` | `004b5f02` | `da63fe824b42d3b9` | 11 |
| cross-receipt.json#10 | `c0003dcb-de2a-8319-a09e-d4b18cf792cc` | `004b5f02` | `30617b9216899d69` | 12 |
| cross-receipt.json#11 | `0809d858-26c4-83c0-835d-5e7a62ae1226` | `004b5f02` | `e5d9a81caa284bd2` | 13 |
| cross-receipt.json#12 | `a725fa0f-19f7-856f-8a29-055ea512f7e9` | `004b5f02` | `c926f909137e13ea` | 14 |
| cross-receipt.json#13 | `afa21ec3-934d-8a2a-a0a0-ba68ad4d2ec4` | `004b5f02` | `970496b026f43786` | 15 |
| cross-receipt.json#14 | `c740edac-15b7-8245-b7b0-8707297f3230` | `004b5f02` | `eddfd8ec84208444` | 16 |
| cross-receipt.json#15 | `5822b734-4eb6-85be-84c6-bc5894db4836` | `004b5f02` | `c635847ade052b98` | 17 |
| cross-receipt.json#16 | `7644ebae-24b1-8236-85d1-16e868e95af6` | `004b5f02` | `e73fd7a6d186d5b9` | 18 |
| cross-receipt.json#17 | `0230db57-de05-88cc-b0cb-0ab145b60532` | `004b5f02` | `488374c9d21d1916` | 19 |
| cross-receipt.json#18 | `2ccd028d-d740-8548-ab4f-febff1323349` | `004b5f02` | `5a3a20319bd79246` | 20 |
| cross-receipt.json#19 | `298a9cd0-8fae-8cd8-b5c9-2fe0afa21ea4` | `004b5f02` | `9722a986196949c6` | 21 |
| cross-receipt.json#20 | `75b17341-0ae7-836f-9d60-413ecf1790dd` | `004b5f02` | `91ee2fdc046a71f2` | 22 |
| cross-receipt.json#21 | `3b046eb6-4d99-8632-a6c3-14e1c07e6d53` | `004b5f02` | `5464a03fab9710c1` | 23 |
| cross-receipt.json#22 | `3bedb308-cd79-8127-871a-26460300ac45` | `004b5f02` | `7ef706f14b351d5e` | 24 |
| cross-receipt.json#23 | `b2dd6643-a248-851c-af44-04dc53d9c8f7` | `004b5f02` | `38fbb18b1e27788c` | 25 |
| cross-receipt.json#24 | `2699b978-802e-87f9-873c-3bbaf7feab80` | `004b5f02` | `740b3c309e28316f` | 26 |
| cross-receipt.json#25 | `16e79b5b-c2a5-8ef8-93f5-e7223c8cf21b` | `004b5f02` | `e90b89ce056c1a01` | 27 |
| cross-receipt.json#26 | `d2ec2217-77c8-8c54-b71e-d2153a57878d` | `004b5f02` | `f1e15ae62cdf1e35` | 28 |
| cross-receipt.json#27 | `55bde7f8-57a3-8c88-ad57-4f47b0ba070c` | `004b5f02` | `d1ffa93bf956431e` | 29 |
| cross-receipt.json#28 | `60ac759f-89b0-8bd5-a1f0-339fa0a828c0` | `004b5f02` | `d5266feaca6b7beb` | 30 |
| cross-receipt.json#29 | `7f2743a7-ab03-8264-a3d9-5cf507070b22` | `004b5f02` | `960c32a22f42e091` | 31 |
| debts-receipt.json | `2fca7629-b538-816a-becd-e0220dbd1cb1` | `16cee539` | `ddb0d39a20dd9254` | 32 |
| discovery-receipt.json | `71b6a6e4-41b2-8805-8755-0dc0cdef9064` | `16cee539` | `773bd24f0f292f58` | 33 |
| discovery-receipt.json#0 | `e1390b4e-b7e1-8129-8780-5a3a875c7069` | `71b6a6e4` | `b81fbea12947c2a4` | 34 |
| discovery-receipt.json#1 | `a4d6eeea-70c0-89ca-9579-0bc6df65b650` | `71b6a6e4` | `fb13d499f5313981` | 35 |
| discovery-receipt.json#2 | `40cc6d07-74ac-81fb-b56b-65d6671c23c5` | `71b6a6e4` | `15bfece2a2eb7f6e` | 36 |
| discovery-receipt.json#3 | `bbc904a8-bb96-82ce-b154-6915180a45a5` | `71b6a6e4` | `439866928513d906` | 37 |
| discovery-receipt.json#4 | `27860f41-7733-8e39-a3a3-3b5797be3d98` | `71b6a6e4` | `5a434500752e901f` | 38 |
| discovery-receipt.json#5 | `5baf6dcf-9c88-8798-b023-225553aeb155` | `71b6a6e4` | `afaad818097e2d99` | 39 |
| discovery-receipt.json#6 | `6ead3073-444e-875b-97e2-13ca05e28185` | `71b6a6e4` | `92276eeea54ec502` | 40 |
| discovery-receipt.json#7 | `df552522-6889-8211-8123-c2db9e2824fd` | `71b6a6e4` | `55e6691d18d9c9c8` | 41 |
| discovery-receipt.json#8 | `13a80223-eed0-8fbc-a44b-84e961494acf` | `71b6a6e4` | `597cb60eb7626d7b` | 42 |
| discovery-receipt.json#9 | `04218162-cd79-8ab0-b3fe-df47334b350e` | `71b6a6e4` | `05b629752aee2c9b` | 43 |
| discovery-receipt.json#10 | `daa74981-b202-8c56-b59e-5724c3a74516` | `71b6a6e4` | `a10cbce96361cbce` | 44 |
| discovery-receipt.json#11 | `2674e8e2-507c-8bbf-b275-5bfcf3a91078` | `71b6a6e4` | `63cc6492be74c9aa` | 45 |
| discovery-receipt.json#12 | `fa9d5cbb-2637-83a1-a850-8f6b8199d6f7` | `71b6a6e4` | `88dcbad51ccc8d86` | 46 |
| discovery-receipt.json#13 | `e6c615e6-1b2a-8217-a502-a5da0718e72d` | `71b6a6e4` | `d501ae000e06d578` | 47 |
| discovery-receipt.json#14 | `b9334a2f-dd55-8e4d-9b66-d06e84f9679c` | `71b6a6e4` | `b13d7e3aa8acb358` | 48 |
| discovery-receipt.json#15 | `885cbb1e-4fef-8c1d-b8ae-a5f3ce96c484` | `71b6a6e4` | `93528f34702a28e1` | 49 |
| discovery-receipt.json#16 | `f8cd78b5-ee8b-8337-b706-714a13202fab` | `71b6a6e4` | `7869ae04f2749eed` | 50 |
| discovery-receipt.json#17 | `591568c2-6de8-85b7-a51c-8a73a20870cb` | `71b6a6e4` | `d24dd1647dffc04a` | 51 |
| discovery-receipt.json#18 | `26f1f6ed-6385-85ab-ab69-1b212f799e56` | `71b6a6e4` | `f14c3ff9d5bcf377` | 52 |
| discovery-receipt.json#19 | `2573c526-0fc3-8744-9b7b-5100b3ee3a55` | `71b6a6e4` | `5692de49794242a2` | 53 |
| discovery-receipt.json#20 | `870faf91-e9e9-88ac-87a0-b3b947088c4e` | `71b6a6e4` | `45f4882f8396f42b` | 54 |
| discovery-receipt.json#21 | `c1aa599f-a37f-8961-a7dc-8003866f620c` | `71b6a6e4` | `8bb59253b21c5158` | 55 |
| discovery-receipt.json#22 | `c8a37485-c438-8812-b965-d710c624aa09` | `71b6a6e4` | `5c7ec5bc47441a7e` | 56 |
| discovery-receipt.json#23 | `680911be-2e09-8a19-b23d-7eeba38ce475` | `71b6a6e4` | `61244c197f0344fe` | 57 |
| discovery-receipt.json#24 | `98e9c3e2-8e20-80c1-88f7-b9a9720722c0` | `71b6a6e4` | `fef25a9cd5ac45fc` | 58 |
| discovery-receipt.json#25 | `58a8fb21-fb73-8bac-8684-01321c575c80` | `71b6a6e4` | `a5839c0a0090d8ac` | 59 |
| discovery-receipt.json#26 | `cc7cfad2-edd8-8e1b-be11-c5ae160b7c7e` | `71b6a6e4` | `fd588187f8d8bcbc` | 60 |
| discovery-receipt.json#27 | `c8d44348-b77c-85b3-b3fc-ca3044bcf81d` | `71b6a6e4` | `c6a6d15c3fa63243` | 61 |
| discovery-receipt.json#28 | `f2b152f9-5dca-85f3-8bea-0a0f2a539fc4` | `71b6a6e4` | `cc5e1dff250f9af0` | 62 |
| discovery-receipt.json#29 | `d8f6cbec-83c8-8d67-9fd0-51ed8594390c` | `71b6a6e4` | `02fbfbbd6fc24ac8` | 63 |
| discovery-receipt.json#30 | `ed16a6ce-b6fe-89cb-948f-3ed9f47d78f6` | `71b6a6e4` | `fd34751b916815a5` | 64 |
| discovery-receipt.json#31 | `abafc17c-48b9-8375-8b69-c2c49a560cc5` | `71b6a6e4` | `c2ce36187b72d342` | 65 |
| discovery-receipt.json#32 | `255f7979-e25c-8827-b448-d558ef1281f6` | `71b6a6e4` | `49d93c7c40f0f133` | 66 |
| discovery-receipt.json#33 | `2b1177c0-3661-8a73-83f8-61c98b2dae00` | `71b6a6e4` | `832fb763d5098ad4` | 67 |
| discovery-receipt.json#34 | `c7857115-be2e-8329-8e7a-8ac59b521df5` | `71b6a6e4` | `fc2b9b71372e6e0b` | 68 |
| discovery-receipt.json#35 | `2d0bd68e-9617-8776-8a6e-2f2cee4c852b` | `71b6a6e4` | `a12c1ec0442dae4e` | 69 |
| discovery-receipt.json#36 | `233e35d0-4144-82b7-b854-bc50e14b4794` | `71b6a6e4` | `3bed177b94ec7f6e` | 70 |
| discovery-receipt.json#37 | `09d0b6bc-a23d-8cad-b90c-281bab714f0f` | `71b6a6e4` | `9fc19c41115ef1b5` | 71 |
| discovery-receipt.json#38 | `c7f9bc88-47fc-84a2-acbc-4e8ee13cdce0` | `71b6a6e4` | `f65ada3caf5e0310` | 72 |
| discovery-receipt.json#39 | `9d24417c-c355-8768-9fa0-621858917714` | `71b6a6e4` | `984a0119a58fa775` | 73 |
| discovery-receipt.json#40 | `de7bd2f6-effa-8e92-bd21-c1d561011100` | `71b6a6e4` | `55d931fde91914f0` | 74 |
| discovery-receipt.json#41 | `5500c42b-3ae0-84a1-b257-8a6df34d616e` | `71b6a6e4` | `8419438e3d4b356c` | 75 |
| discovery-receipt.json#42 | `2f765e71-86bf-82f4-8c63-a8ca7d56068d` | `71b6a6e4` | `b538b73ca7361ee2` | 76 |
| discovery-receipt.json#43 | `50768208-f31e-8403-9d66-e8c319eea332` | `71b6a6e4` | `8fb58c1d15803bce` | 77 |
| discovery-receipt.json#44 | `7233ca3b-b5bb-841b-8be9-37b188062261` | `71b6a6e4` | `785b5d1e8faab94f` | 78 |
| discovery-receipt.json#45 | `59f711f3-2eaf-87d9-b06a-4ea2c3150fcb` | `71b6a6e4` | `c0511efb27ea8ed8` | 79 |
| discovery-receipt.json#46 | `a8fe47c0-42ac-82b0-9715-2cfb279322bd` | `71b6a6e4` | `3935d91be72f06df` | 80 |
| discovery-receipt.json#47 | `7ce0dce4-fa3c-81e8-8c06-ec5980ed25ee` | `71b6a6e4` | `36c662bee868f77e` | 81 |
| discovery-receipt.json#48 | `2eb78807-045b-82d9-9893-3debdb315f5a` | `71b6a6e4` | `5cdddbb61071c24a` | 82 |
| discovery-receipt.json#49 | `3ac8f9c8-53de-8f76-9557-fa14cae725c3` | `71b6a6e4` | `0807ef93f1d0224e` | 83 |
| discovery-receipt.json#50 | `b9cbefd7-561d-87d5-9f32-b5e1b9f6187d` | `71b6a6e4` | `08adc8d8676c6002` | 84 |
| discovery-receipt.json#51 | `4cb84529-4821-8004-a1a1-90f1a044843e` | `71b6a6e4` | `851639718b49f5c1` | 85 |
| discovery-receipt.json#52 | `315871b9-23e1-87ae-8677-b448cd4aebb8` | `71b6a6e4` | `84fbf4fbb046b6e3` | 86 |
| discovery-receipt.json#53 | `4ad87e7e-ceca-8d82-beef-3d2aca43eca4` | `71b6a6e4` | `ad55dbb27e65b19f` | 87 |
| discovery-receipt.json#54 | `d1012a1d-5675-8f4e-9f64-b91b2d31d477` | `71b6a6e4` | `1bc7f5d3220049db` | 88 |
| discovery-receipt.json#55 | `22e9d846-4474-8999-87bd-c5426610a353` | `71b6a6e4` | `3bb1f02f0dcd9f10` | 89 |
| discovery-receipt.json#56 | `ef882e04-432a-8ee2-906c-90024583b750` | `71b6a6e4` | `8bf8d1110f2521cf` | 90 |
| discovery-receipt.json#57 | `19244517-2c8c-874c-b471-15bdc69061d5` | `71b6a6e4` | `36b2a9ad458d6164` | 91 |
| discovery-receipt.json#58 | `9ec0c1da-24e6-80d7-b896-4e4171eb73b7` | `71b6a6e4` | `2fe389238f541cb3` | 92 |
| discovery-receipt.json#59 | `1a93a1b2-59b6-8d12-b1f3-c1b2b8491b1c` | `71b6a6e4` | `eabcb5133f82430d` | 93 |
| discovery-receipt.json#60 | `6192b744-152d-81a8-ad12-7b87e0d01942` | `71b6a6e4` | `f5ba04ee4a363773` | 94 |
| discovery-receipt.json#61 | `b0e531a3-d1ce-8aa1-8e07-d27fc7e7bd88` | `71b6a6e4` | `4ce34ba596fb0c48` | 95 |
| discovery-receipt.json#62 | `5bb06577-0126-83db-b74e-171314adf353` | `71b6a6e4` | `b8cebd8396daf45c` | 96 |
| discovery-receipt.json#63 | `83cc866e-0b83-8ef5-9a59-00b805e059b3` | `71b6a6e4` | `12368a16a8e36c5e` | 97 |
| discovery-receipt.json#64 | `fa69d082-77a2-8e7d-a945-4c2d19a5d395` | `71b6a6e4` | `9ec9b02365db1f19` | 98 |
| discovery-receipt.json#65 | `90619277-33c9-8901-85da-b41c00385c5a` | `71b6a6e4` | `b83eca284f9b1307` | 99 |
| discovery-receipt.json#66 | `e03a7833-9c13-8955-85d2-fcd101745403` | `71b6a6e4` | `7e5d60fd80a6010b` | 100 |
| discovery-receipt.json#67 | `a9312500-ad3a-8d52-9d39-64c6241e4375` | `71b6a6e4` | `6a36996a59eb4e15` | 101 |
| discovery-receipt.json#68 | `ac477e24-27aa-873b-8534-3daa27aebce4` | `71b6a6e4` | `7b1a316a3b2468fa` | 102 |
| discovery-receipt.json#69 | `1154a232-e4c4-8026-ae65-8f52d6502158` | `71b6a6e4` | `09dabdf29c5a6131` | 103 |
| discovery-receipt.json#70 | `2dbf9821-6fb3-8bfd-a957-0ce6df6a9744` | `71b6a6e4` | `ca6fd18a9e14bf1e` | 104 |
| discovery-receipt.json#71 | `784f0480-0258-8753-956e-3d2e0cc29300` | `71b6a6e4` | `c5c2a6b4d2d8b6ad` | 105 |
| discovery-receipt.json#72 | `65ebed61-735f-87a5-b6ab-a7258fedc2d6` | `71b6a6e4` | `d2741a8ba6883585` | 106 |
| discovery-receipt.json#73 | `1403791e-f1ae-8777-8880-720c7f7662d1` | `71b6a6e4` | `92e9a6898c451bb9` | 107 |
| discovery-receipt.json#74 | `c3c370ad-6177-88ea-9a98-54407239168c` | `71b6a6e4` | `a72347b2fe996dce` | 108 |
| discovery-receipt.json#75 | `a62ec354-8bca-8544-90d6-af11adaee94b` | `71b6a6e4` | `bdfdc0be03b6abba` | 109 |
| discovery-receipt.json#76 | `806a5ec0-f874-86c9-8820-5e5b629bd657` | `71b6a6e4` | `fe5fa02df926b350` | 110 |
| discovery-receipt.json#77 | `88a3bcb0-69b3-8c2a-a80e-af80645b26c2` | `71b6a6e4` | `a4b41d16c19028d3` | 111 |
| discovery-receipt.json#78 | `0451d033-f58f-80fe-a09f-7a73dd7202dc` | `71b6a6e4` | `a8d652f57f302045` | 112 |
| discovery-receipt.json#79 | `72eca790-de2e-8ff5-97eb-b4c7e313d5a7` | `71b6a6e4` | `8ae5accd3c101747` | 113 |
| discovery-receipt.json#80 | `e89ccd69-06ad-8aaa-ac3a-d388da72de8b` | `71b6a6e4` | `b0ce32e7a390af62` | 114 |
| discovery-receipt.json#81 | `677aaeb7-1c50-8019-9f9d-edd518f526dd` | `71b6a6e4` | `456ded2664e8a23c` | 115 |
| discovery-receipt.json#82 | `5ca5f67d-5a2b-87c3-8c4b-8e5ebf3f2a7e` | `71b6a6e4` | `abdfe71a4d6c906e` | 116 |
| discovery-receipt.json#83 | `d6c48686-345d-8e7a-9731-5c7fcb054bec` | `71b6a6e4` | `89242ae5cb5bd523` | 117 |
| discovery-receipt.json#84 | `b1640d82-3362-8acc-a54e-9d5454b510f6` | `71b6a6e4` | `1556fcaf0368d403` | 118 |
| discovery-receipt.json#85 | `7287b3c6-24f7-83de-a44b-9717080c63d8` | `71b6a6e4` | `6d476ff3005b766a` | 119 |
| discovery-receipt.json#86 | `bac6a356-c41d-83aa-9a03-d50ce57977f6` | `71b6a6e4` | `2cee7900a99ea4be` | 120 |
| discovery-receipt.json#87 | `1b6a86fc-d8a4-8a97-a7d8-74d29ebf09fb` | `71b6a6e4` | `7aa2eaa185a6b234` | 121 |
| discovery-receipt.json#88 | `3fe34e47-2f66-81b9-a7cd-19b6156ab6ac` | `71b6a6e4` | `941085c88b28ac29` | 122 |
| discovery-receipt.json#89 | `b1ad43cf-81e8-84dd-a0df-da197fdd725c` | `71b6a6e4` | `49412412aa8009b6` | 123 |
| discovery-receipt.json#90 | `2aba3335-178d-890a-8278-9e6207016902` | `71b6a6e4` | `a6fb802912ff9f43` | 124 |
| discovery-receipt.json#91 | `ef6655c1-f189-89ad-997d-f13cb352547c` | `71b6a6e4` | `b80414540fa633ab` | 125 |
| discovery-receipt.json#92 | `2db0a84b-b250-8340-814e-cae8be9b6e51` | `71b6a6e4` | `e8c2287ed498c658` | 126 |
| discovery-receipt.json#93 | `35bb8227-049b-8b6d-9196-e181f4f48ad9` | `71b6a6e4` | `301a916d118dc686` | 127 |
| discovery-receipt.json#94 | `0bfedd50-3043-8027-9c6a-db32b36bc57f` | `71b6a6e4` | `d52f9310aa26719b` | 128 |
| discovery-receipt.json#95 | `68b1dd51-15ba-88d5-946f-b7b664e3ba2b` | `71b6a6e4` | `d88047485009070d` | 129 |
| discovery-receipt.json#96 | `b72d3b78-836b-8b72-b30c-41a842c71b6a` | `71b6a6e4` | `57fa5fbc57608d90` | 130 |
| discovery-receipt.json#97 | `e670ec28-de87-81e3-93bf-4822ad6baffe` | `71b6a6e4` | `e426f3b25b47fb5a` | 131 |
| discovery-receipt.json#98 | `b06f1240-8a7c-8185-89d3-f72fe4f77bc3` | `71b6a6e4` | `b0c0e1a53d0354e5` | 132 |
| discovery-receipt.json#99 | `89d23abd-e158-87f9-bf4d-529e3d060b99` | `71b6a6e4` | `6013df5ed90b24ef` | 133 |
| discovery-receipt.json#100 | `e956e7ba-68e1-8bff-853e-c4e76a2927b8` | `71b6a6e4` | `15fe8aa64b3744de` | 134 |
| discovery-receipt.json#101 | `c066c6ee-bba8-81b1-b640-dae7cd06042c` | `71b6a6e4` | `dd782dacfef4b8b0` | 135 |
| discovery-receipt.json#102 | `3e730c42-a0ad-870c-b8ea-ddd474c99b50` | `71b6a6e4` | `93edb7ec307e71f2` | 136 |
| discovery-receipt.json#103 | `1fe4cad2-c553-80a9-a40a-efe7977a29d1` | `71b6a6e4` | `30f1e5fd921c05db` | 137 |
| discovery-receipt.json#104 | `4df89767-806a-816d-a942-5a8d0ce3e258` | `71b6a6e4` | `e2249bddfc7fd8b5` | 138 |
| discovery-receipt.json#105 | `2ba4dd49-f825-8269-971d-c05e2d753e64` | `71b6a6e4` | `960499556efa87e0` | 139 |
| discovery-receipt.json#106 | `710d20fb-ef0e-8e20-85f0-8df9007ccc68` | `71b6a6e4` | `8721add579a464de` | 140 |
| discovery-receipt.json#107 | `40e27c08-e588-85e7-847c-fc832529f57a` | `71b6a6e4` | `4d259ab4a4612983` | 141 |
| discovery-receipt.json#108 | `0374eee1-941c-8f01-bdf8-543f8c43df3c` | `71b6a6e4` | `b226d90ed35017e8` | 142 |
| discovery-receipt.json#109 | `abb14693-c2c5-8027-a2fc-0283a85328c9` | `71b6a6e4` | `a5645eee404403ce` | 143 |
| discovery-receipt.json#110 | `2e24d46e-1f31-805d-827c-6c0cca66f19c` | `71b6a6e4` | `e02ae8d65c73fa8b` | 144 |
| discovery-receipt.json#111 | `a0d702d9-aec6-86bb-ba26-db6c3557afbe` | `71b6a6e4` | `f474467dd74484bf` | 145 |
| discovery-receipt.json#112 | `35e879f6-86b5-8ee3-906a-bec07ee9a0d0` | `71b6a6e4` | `98b345f5e55e385c` | 146 |
| discovery-receipt.json#113 | `0d351449-5c7f-8dd9-8970-2f7de82bcb28` | `71b6a6e4` | `5d012e604fddd338` | 147 |
| discovery-receipt.json#114 | `c827c0af-5177-8bd7-8b19-4cfd7b8c56d6` | `71b6a6e4` | `d912361ef31afeb0` | 148 |
| discovery-receipt.json#115 | `283a0f8a-7fb8-8c7d-b124-573c19f8e382` | `71b6a6e4` | `d9f38d35e066abb3` | 149 |
| discovery-receipt.json#116 | `579631cf-73c5-8cdf-ab3b-4b5b74e7556d` | `71b6a6e4` | `c345210ac8e49750` | 150 |
| discovery-receipt.json#117 | `dabe632f-3c9f-8750-b78a-c3cb02ee5d21` | `71b6a6e4` | `0464825320ded6e4` | 151 |
| discovery-receipt.json#118 | `961a6ac0-a7bd-8d8c-b409-b1ee2cc8a3f6` | `71b6a6e4` | `8333fc9e46bdafe5` | 152 |
| discovery-receipt.json#119 | `ff430e0b-6b31-8619-85bb-af28e198cda3` | `71b6a6e4` | `6775f08cdab910a3` | 153 |
| discovery-receipt.json#120 | `09f1700e-9538-81b6-a045-47e671ee04ed` | `71b6a6e4` | `df5e904fa500f6f2` | 154 |
| discovery-receipt.json#121 | `d156056a-0f88-89d9-9cab-0e54c941152f` | `71b6a6e4` | `3393a589a6209096` | 155 |
| discovery-receipt.json#122 | `39e4fc76-051f-860b-85e5-7d6cca02613c` | `71b6a6e4` | `4120f26873e60328` | 156 |
| discovery-receipt.json#123 | `8858f706-5116-812f-8a56-4e30c31ac3b6` | `71b6a6e4` | `db741cbf6ea2274c` | 157 |
| discovery-receipt.json#124 | `853779ec-a50f-81bc-9e72-b43dbccacfb0` | `71b6a6e4` | `fe2a91f34bf74286` | 158 |
| discovery-receipt.json#125 | `a758b7bc-6c85-8a88-b72c-86cb5b2adf38` | `71b6a6e4` | `826df5162918f7d9` | 159 |
| discovery-receipt.json#126 | `150cddc1-bc42-80d7-beea-2d5089c61876` | `71b6a6e4` | `44bc6472ae3caf1f` | 160 |
| discovery-receipt.json#127 | `8b7d17ea-9b90-872e-a2fd-38a12fea1403` | `71b6a6e4` | `b52a37b208d8e9d4` | 161 |
| discovery-receipt.json#128 | `d7b82b6a-1ab0-8ab6-bf3c-09ebbce92358` | `71b6a6e4` | `4c406c1336acba42` | 162 |
| discovery-receipt.json#129 | `7fd4b531-6488-8e80-b864-aee59af7f90d` | `71b6a6e4` | `b1b0112fa01f0e47` | 163 |
| discovery-receipt.json#130 | `acc9241e-d518-8f4a-9e78-0ec7103aa22c` | `71b6a6e4` | `ec07552ae992aa1f` | 164 |
| discovery-receipt.json#131 | `5170883f-3066-851b-8843-e94d59f43167` | `71b6a6e4` | `df99146848a3a0c1` | 165 |
| discovery-receipt.json#132 | `77a3b6cb-9ba1-8642-8aba-8c89c3caa406` | `71b6a6e4` | `6d3168c3f43ef3d2` | 166 |
| discovery-receipt.json#133 | `23c547de-7a9f-8062-9b65-9e561279f78d` | `71b6a6e4` | `7fd2a1bb33d1868c` | 167 |
| discovery-receipt.json#134 | `e97a76b5-7556-89ab-9900-4898a3ae57c0` | `71b6a6e4` | `c6892520d1ddef26` | 168 |
| discovery-receipt.json#135 | `5fe33cf5-8bbf-843d-abfb-334bef95519c` | `71b6a6e4` | `4cd19e884afce7d7` | 169 |
| discovery-receipt.json#136 | `03170702-3e1d-87a2-a122-c1d291275ede` | `71b6a6e4` | `e7fb005ab43a1b55` | 170 |
| discovery-receipt.json#137 | `44877d15-4126-84d1-90e8-54eef9366fd8` | `71b6a6e4` | `2ca80e120f0bb862` | 171 |
| discovery-receipt.json#138 | `b40c5fc2-b94f-8f8a-91a1-4ec26b05d5a3` | `71b6a6e4` | `4351d87135dbbd00` | 172 |
| discovery-receipt.json#139 | `aaf6a1cb-33b6-8cd3-9959-39dc1f71243c` | `71b6a6e4` | `8c8022eb19799b13` | 173 |
| discovery-receipt.json#140 | `4e14ced0-83ff-8a5a-ae02-e7fa41874106` | `71b6a6e4` | `7d03146c1805a91b` | 174 |
| discovery-receipt.json#141 | `2ee66faf-4a14-8b54-a7e2-1da0ad051b36` | `71b6a6e4` | `91cfb7bd7ea728d5` | 175 |
| discovery-receipt.json#142 | `a65fe0b1-81aa-8598-9854-824b2d463284` | `71b6a6e4` | `3fb264919eee087a` | 176 |
| discovery-receipt.json#143 | `48899b7d-b9a1-8b6c-94c8-6cf955d8d1a0` | `71b6a6e4` | `ccbccf78fd0b268c` | 177 |
| discovery-receipt.json#144 | `e970e12e-a552-8c3d-a4bf-c6413898cd69` | `71b6a6e4` | `afb182415a86fd9c` | 178 |
| discovery-receipt.json#145 | `8ddf6c6b-b74b-8408-9871-b210d9467d53` | `71b6a6e4` | `88779156db00f353` | 179 |
| discovery-receipt.json#146 | `9532bcb8-a26b-8dcc-ae29-5428afe07eb2` | `71b6a6e4` | `2520995372c3f5cf` | 180 |
| discovery-receipt.json#147 | `63c77d0b-e4cd-8f27-93c6-ee0c27c29521` | `71b6a6e4` | `3895897059b9c14a` | 181 |
| discovery-receipt.json#148 | `bef94b3b-3204-894e-8ac7-bdf659f109e8` | `71b6a6e4` | `808b97c8d736188b` | 182 |
| discovery-receipt.json#149 | `e54bfdc8-8037-8038-b824-fa097b9a916b` | `71b6a6e4` | `19a5d9b97e14b705` | 183 |
| discovery-receipt.json#150 | `a9afd709-0cfb-8d96-8cfa-9dc815cf0ee7` | `71b6a6e4` | `85648634f05e78f6` | 184 |
| discovery-receipt.json#151 | `c0b7834c-e8fb-8c6e-bb48-b0921e3fa06e` | `71b6a6e4` | `dc3628920b93d2e0` | 185 |
| discovery-receipt.json#152 | `2eeac53d-cee6-8633-890b-ed6c56dcbf41` | `71b6a6e4` | `b47575c2fabd594a` | 186 |
| discovery-receipt.json#153 | `2405513a-2808-8cd1-9fcb-d1354b88fac8` | `71b6a6e4` | `b08d4fda51c70e96` | 187 |
| discovery-receipt.json#154 | `7fdde1ba-26e3-8419-98da-ae6cb094f733` | `71b6a6e4` | `ee0b71787e57ba32` | 188 |
| discovery-receipt.json#155 | `22855962-a59b-8e85-ad35-b1ed0913291f` | `71b6a6e4` | `d85edf24fe34bf20` | 189 |
| discovery-receipt.json#156 | `e0808f36-9910-8868-aef5-8663d722adf1` | `71b6a6e4` | `3c6c6bdf4cc45e94` | 190 |
| discovery-receipt.json#157 | `272aa096-3da9-870f-a232-29f1cfba7442` | `71b6a6e4` | `cc04c7a35f05233e` | 191 |
| discovery-receipt.json#158 | `a54a1401-4909-8b93-8c7f-84621e5c0396` | `71b6a6e4` | `7f000dc39ccaf98b` | 192 |
| discovery-receipt.json#159 | `645d2b9b-2748-82ee-9620-f1c3de2b4aec` | `71b6a6e4` | `7f3e2af7a56efadb` | 193 |
| discovery-receipt.json#160 | `20b07da1-062b-8bf6-866d-9120ee690bb8` | `71b6a6e4` | `32582ffa2803266b` | 194 |
| discovery-receipt.json#161 | `f24e48d6-e9ef-8ae2-80a8-7eee925560e2` | `71b6a6e4` | `c23cfdb4034f4136` | 195 |
| discovery-receipt.json#162 | `65ed5ebd-40f7-89e3-b747-2ff8d560699a` | `71b6a6e4` | `7ca59c62446bffbd` | 196 |
| discovery-receipt.json#163 | `104d804e-45d3-8d6c-becc-43e04e0eaff1` | `71b6a6e4` | `5320d81848a70fa2` | 197 |
| discovery-receipt.json#164 | `d13716cb-601e-8314-927a-ab308fe91c13` | `71b6a6e4` | `d467d92066f11f83` | 198 |
| discovery-receipt.json#165 | `54c212a9-36d6-8474-a615-363f705daa8f` | `71b6a6e4` | `6f5e0012fce73398` | 199 |
| discovery-receipt.json#166 | `ba58b6c8-b883-8619-b84b-36edd3a25a44` | `71b6a6e4` | `598b54ac4f12e509` | 200 |
| discovery-receipt.json#167 | `10d10887-73b9-8aca-9a66-1f8ff8f00131` | `71b6a6e4` | `3ad07e202ddf9908` | 201 |
| discovery-receipt.json#168 | `c5c79b70-90ea-8540-879e-6f8111f7ce0e` | `71b6a6e4` | `921676a512dc89bf` | 202 |
| discovery-receipt.json#169 | `fd77aceb-dc24-84eb-8948-f6dbce9a9344` | `71b6a6e4` | `2d29fce8d0e4d89b` | 203 |
| discovery-receipt.json#170 | `08c4bac0-c6a1-8ddc-bc50-5711d3c23093` | `71b6a6e4` | `2d56bf8f4de3e191` | 204 |
| discovery-receipt.json#171 | `47e8aab3-03fb-8e4c-ac13-7fb902c175af` | `71b6a6e4` | `61e9f2df1e343857` | 205 |
| discovery-receipt.json#172 | `195f37b4-3e73-8ae4-87b7-a5f1dca6bc9a` | `71b6a6e4` | `68520e1596c20912` | 206 |
| discovery-receipt.json#173 | `46721768-52a4-809c-a12a-17493beb1df6` | `71b6a6e4` | `aa3d3fafa654b883` | 207 |
| discovery-receipt.json#174 | `465a7296-dac5-8af4-b601-ba91634027f8` | `71b6a6e4` | `1fce4c5edecd7058` | 208 |
| discovery-receipt.json#175 | `d29a0a36-af7b-877d-8d3e-46397987e60f` | `71b6a6e4` | `df708985cb572ed8` | 209 |
| discovery-receipt.json#176 | `2cce7b6c-34b0-8269-8db0-36ce909a0d26` | `71b6a6e4` | `c10c63eb2eacb74f` | 210 |
| discovery-receipt.json#177 | `515e1070-d2b8-8794-87b9-162ca959d37d` | `71b6a6e4` | `0bce590949b1a3a5` | 211 |
| discovery-receipt.json#178 | `96ebeea8-4e99-8308-85c9-f6fefadbac79` | `71b6a6e4` | `6a6534b1f188e4e6` | 212 |
| discovery-receipt.json#179 | `26d059ef-e13e-88f2-9608-e4f246285bca` | `71b6a6e4` | `c33804ef1343ea40` | 213 |
| discovery-receipt.json#180 | `0221af89-c89a-88ce-9b47-d0400d15a28f` | `71b6a6e4` | `83515dbbf9ca19ea` | 214 |
| discovery-receipt.json#181 | `dd906823-3460-8500-ad70-80b2ba003d3e` | `71b6a6e4` | `9838855f82ec4297` | 215 |
| discovery-receipt.json#182 | `737f8d4a-2fa5-88d2-856d-b7cbe17a923d` | `71b6a6e4` | `61281c352e026697` | 216 |
| discovery-receipt.json#183 | `aac0d4ff-37d8-8822-9b9a-42ad99c39c7b` | `71b6a6e4` | `7da277908a9bf78c` | 217 |
| discovery-receipt.json#184 | `3008a5d2-2fcc-845f-9fe6-fc3a407fdc66` | `71b6a6e4` | `9d66222e5d69dc2d` | 218 |
| discovery-receipt.json#185 | `207f38ba-8a4d-809f-9fbe-0e079ad49fa1` | `71b6a6e4` | `fa1857cf2b5e7635` | 219 |
| discovery-receipt.json#186 | `b9764a7c-a09e-8169-b94f-1762a59c35e3` | `71b6a6e4` | `87f4b7c171574f5e` | 220 |
| discovery-receipt.json#187 | `533ce3f8-6699-8e24-85a0-9f3c009078ec` | `71b6a6e4` | `0e79bad6eb8aaf67` | 221 |
| discovery-receipt.json#188 | `b1e3ada6-d190-8b4b-83bc-de4f04b132df` | `71b6a6e4` | `6b13d4b2d843ab7a` | 222 |
| discovery-receipt.json#189 | `8c29d38d-adef-83f2-8b01-ddba331683ea` | `71b6a6e4` | `99e90c3e6b55c6dc` | 223 |
| discovery-receipt.json#190 | `575956f3-9d16-829b-8a41-4e5072d21192` | `71b6a6e4` | `4fb00c115dc42784` | 224 |
| discovery-receipt.json#191 | `fc6a72e5-17ca-8b29-81f1-1d3d0e04723b` | `71b6a6e4` | `3093bd1487680509` | 225 |
| discovery-receipt.json#192 | `03a8778f-0d07-8c48-be96-c2bb52b04a5d` | `71b6a6e4` | `7cc9084e81f03f50` | 226 |
| discovery-receipt.json#193 | `d30c77f5-6da2-82e3-8272-a78e2c455e00` | `71b6a6e4` | `1cbd72c282689b20` | 227 |
| discovery-receipt.json#194 | `ade49b3b-7b4f-873e-9528-34b212a239e0` | `71b6a6e4` | `1f6e1f663cfacf77` | 228 |
| discovery-receipt.json#195 | `35ded057-bbf6-8c89-aa63-238146efa0ea` | `71b6a6e4` | `5776a3358a6e9a78` | 229 |
| discovery-receipt.json#196 | `265708c6-d505-8c0f-acba-3b88c0f9147b` | `71b6a6e4` | `b2560673946779ab` | 230 |
| discovery-receipt.json#197 | `de3c5ecb-d385-8fc7-b7f1-19f502d844d9` | `71b6a6e4` | `775228158b41822e` | 231 |
| discovery-receipt.json#198 | `3cdca497-f85b-8784-b124-06d0c5978c2c` | `71b6a6e4` | `b71fc29da858bd2f` | 232 |
| discovery-receipt.json#199 | `7ead7fa2-7473-89fd-b938-8a4712e5c207` | `71b6a6e4` | `8f5adcc8b9a28a4f` | 233 |
| discovery-receipt.json#200 | `e750923e-64d9-8415-86eb-8e4b9679b002` | `71b6a6e4` | `b183eddb4f0bf5c7` | 234 |
| discovery-receipt.json#201 | `a09c747d-1c79-8b89-a569-4c5825bf9230` | `71b6a6e4` | `340adf806dc1c91e` | 235 |
| discovery-receipt.json#202 | `f622fdb9-57f6-8cdc-a758-8211801a6621` | `71b6a6e4` | `be76479034765de3` | 236 |
| discovery-receipt.json#203 | `644d5748-a231-85d2-a054-36af79b0f0a1` | `71b6a6e4` | `0934c24c6503521a` | 237 |
| discovery-receipt.json#204 | `146dd364-d743-8544-84c5-484960479325` | `71b6a6e4` | `bfeb5e0f8de168a9` | 238 |
| discovery-receipt.json#205 | `42fae4f1-67c0-8ef3-bd1a-7080be86d835` | `71b6a6e4` | `e8c0387a3e9d33c9` | 239 |
| discovery-receipt.json#206 | `cc5c83ca-26f0-897b-b596-fc603fe7f576` | `71b6a6e4` | `08ddd53c30fb35b5` | 240 |
| discovery-receipt.json#207 | `dcee649b-a27d-80b8-ba3e-92b4cb0b1261` | `71b6a6e4` | `8f14f50d30eddc08` | 241 |
| discovery-receipt.json#208 | `bed7c649-9e8e-8e9c-881d-bf36086c80b4` | `71b6a6e4` | `80a068db015e620b` | 242 |
| discovery-receipt.json#209 | `16c5c26c-c0b7-803b-8e2c-30c3afc4f8b8` | `71b6a6e4` | `fcb906ed5dc1acf6` | 243 |
| discovery-receipt.json#210 | `2ed0012e-4608-82ac-bf16-5b022ddce936` | `71b6a6e4` | `973b211ededb0199` | 244 |
| discovery-receipt.json#211 | `614827d4-1977-8c70-91d9-c1c5e023412b` | `71b6a6e4` | `15ce0fca3069fa4f` | 245 |
| discovery-receipt.json#212 | `332a0b05-4551-851b-a9e7-4d2938c5f892` | `71b6a6e4` | `807625ec60fae795` | 246 |
| discovery-receipt.json#213 | `64acf609-6d91-8e77-bfac-7650418ee63e` | `71b6a6e4` | `658b4c9f830d1c4d` | 247 |
| discovery-receipt.json#214 | `036d62a0-6480-8bd6-a02d-03595cc428c9` | `71b6a6e4` | `350239ad42ad3a31` | 248 |
| discovery-receipt.json#215 | `5dd5f7f5-d971-89a8-b0eb-896963311390` | `71b6a6e4` | `03c74cf56f89d1ad` | 249 |
| discovery-receipt.json#216 | `39d474ac-f0f9-8fa6-97f7-6bf04b69234f` | `71b6a6e4` | `03651aef1939c990` | 250 |
| discovery-receipt.json#217 | `8df32896-540c-80ed-847a-001695d77aca` | `71b6a6e4` | `3ca172c3d500d7d1` | 251 |
| discovery-receipt.json#218 | `bfe8955f-7d27-89c0-b01f-b0798fdb27e5` | `71b6a6e4` | `7fd7593adb1c7784` | 252 |
| discovery-receipt.json#219 | `83457d35-fec1-8b2a-a1fc-a04077efab5d` | `71b6a6e4` | `8709bdf57536f4b8` | 253 |
| discovery-receipt.json#220 | `ddcc9d0f-c359-805b-92c5-89070c180fe1` | `71b6a6e4` | `c5de1f2f44e4418b` | 254 |
| discovery-receipt.json#221 | `d5c573c9-0329-8b5f-a4c3-d13a18313ce1` | `71b6a6e4` | `f6f721aec81300bf` | 255 |
| discovery-receipt.json#222 | `f60efdab-0e08-8c7d-a740-6bc9d66aba32` | `71b6a6e4` | `212212a95a7bdb59` | 256 |
| discovery-receipt.json#223 | `ecedc3c9-0ed4-86d7-bc41-05dc17da634a` | `71b6a6e4` | `55ea669f107b23d8` | 257 |
| discovery-receipt.json#224 | `1c5e29eb-597b-834e-a916-e1abf9a3ab71` | `71b6a6e4` | `fd92843d186def66` | 258 |
| discovery-receipt.json#225 | `e14c561c-751e-8ff8-90de-d2a375ce89d0` | `71b6a6e4` | `74ed838974541991` | 259 |
| discovery-receipt.json#226 | `f1693d0f-c866-851d-ab05-694e573f08e2` | `71b6a6e4` | `318791b61c5211ed` | 260 |
| discovery-receipt.json#227 | `a24ab53f-182f-8c77-af3c-9d4aff6842f5` | `71b6a6e4` | `7d7ae99e77285750` | 261 |
| discovery-receipt.json#228 | `8d8352a0-9744-8777-8853-42174e8973c1` | `71b6a6e4` | `5bde732c5d1bc17a` | 262 |
| discovery-receipt.json#229 | `23bb18d5-cb74-8e87-8194-efabaec18388` | `71b6a6e4` | `5df9855ae52c2554` | 263 |
| flaws-receipt.json | `a5977a2f-a657-8717-91c2-cc872f91616b` | `16cee539` | `4c375110f22b54d5` | 264 |
| formulas-receipt.json | `98ea2bce-1163-8db4-86a3-2b937c87caf0` | `16cee539` | `6048947560a8c8f5` | 265 |
| formulas-receipt.json#0 | `c2e41006-e9a5-81af-b31f-8d7c5818ac4a` | `98ea2bce` | `0058da71f50b662b` | 266 |
| formulas-receipt.json#1 | `55cc5272-b634-808f-827e-9452305f2bb5` | `98ea2bce` | `5ba6f4caf9d2f0ec` | 267 |
| formulas-receipt.json#2 | `9d88febc-7912-8250-8f9a-830fce93ba0e` | `98ea2bce` | `fb53a12c3e4dc86b` | 268 |
| formulas-receipt.json#3 | `196b054f-a4ff-881c-8617-23ac485a514b` | `98ea2bce` | `0327cdf3ff5ff25c` | 269 |
| formulas-receipt.json#4 | `a93283a0-ca27-8cc7-9970-d555c88d76c7` | `98ea2bce` | `febc404cf0b62b11` | 270 |
| formulas-receipt.json#5 | `655ab557-c71a-8542-92e1-c38f5d90b545` | `98ea2bce` | `8a53cf1be2c01b2a` | 271 |
| formulas-receipt.json#6 | `b4acca72-4221-86bd-89b6-cc58ba55d774` | `98ea2bce` | `c85deb48fadc165a` | 272 |
| formulas-receipt.json#7 | `4a54b279-3898-88a0-b521-3291e4713ba3` | `98ea2bce` | `da9991e7f620c657` | 273 |
| formulas-receipt.json#8 | `5a371732-e9ab-8f11-a93b-7af32616baa6` | `98ea2bce` | `4a2f9ced771365cf` | 274 |
| formulas-receipt.json#9 | `b0714cfc-85ac-819b-8f11-f18bb01b1ae2` | `98ea2bce` | `e9433487a11810e4` | 275 |
| formulas-receipt.json#10 | `60b9f47f-a326-8f06-b4a8-0160ea25d6a6` | `98ea2bce` | `a7c5a55ec042da39` | 276 |
| formulas-receipt.json#11 | `3ea16bea-cc04-8997-9e3c-3b872c4c060e` | `98ea2bce` | `85f4227e8f6975fd` | 277 |
| formulas-receipt.json#12 | `7f625fae-76a8-83c4-a1fe-6a103ea66648` | `98ea2bce` | `3ecd407b75aeee80` | 278 |
| formulas-receipt.json#13 | `2cfeda23-5aac-8bc8-b2dc-95066a286a04` | `98ea2bce` | `a14661c22cbff91a` | 279 |
| formulas-receipt.json#14 | `f2132b2f-1fa7-8c1f-82f0-eee24b61d704` | `98ea2bce` | `b6375f1e92a0eead` | 280 |
| formulas-receipt.json#15 | `0037012d-5b98-869a-8a86-ecabc28b4a76` | `98ea2bce` | `0b2015048c22eb50` | 281 |
| formulas-receipt.json#16 | `59f494bb-3831-8fb4-85f8-523f84c0fe2a` | `98ea2bce` | `eb643c0fe59562f8` | 282 |
| formulas-receipt.json#17 | `04d564a8-44f8-802e-812d-635969d8b3bf` | `98ea2bce` | `299e9be2158e8ae2` | 283 |
| formulas-receipt.json#18 | `d67ee6f9-84b6-8b30-9fff-84aa1c0239cc` | `98ea2bce` | `17154987b2389fa2` | 284 |
| formulas-receipt.json#19 | `7ec26d87-912c-8d79-86cf-12f54c658d27` | `98ea2bce` | `70717e3f55b7653a` | 285 |
| formulas-receipt.json#20 | `bddde8c4-d865-8e70-8559-fef8729b37e9` | `98ea2bce` | `51721fb236fb28ba` | 286 |
| formulas-receipt.json#21 | `588115d9-5922-80fb-879c-1b33765f8a40` | `98ea2bce` | `0fcf8356f102c14a` | 287 |
| formulas-receipt.json#22 | `07c8f29e-d83c-80c3-ba29-86c76d68e83a` | `98ea2bce` | `f73a1036197e59e6` | 288 |
| formulas-receipt.json#23 | `0f1112be-97c8-8b15-a4c0-056b1f62e4b2` | `98ea2bce` | `dd21fbdf349b5c0b` | 289 |
| formulas-receipt.json#24 | `b7f304a1-f2c5-8a8b-9270-a6448dfe3026` | `98ea2bce` | `3846fea915bc3f84` | 290 |
| formulas-receipt.json#25 | `3dc00de8-5d1a-8f1b-a6ba-996d6557ba7b` | `98ea2bce` | `5e0058ae62006644` | 291 |
| formulas-receipt.json#26 | `a8ad9f60-51c9-88b3-afc3-b1509edf8a48` | `98ea2bce` | `e29fe3e03a3183c7` | 292 |
| formulas-receipt.json#27 | `10a0d625-a92b-80c1-9458-2521220f7ee4` | `98ea2bce` | `3450b2490f319219` | 293 |
| formulas-receipt.json#28 | `44236939-f986-825d-bc5f-d056bf05d8dc` | `98ea2bce` | `1431dc1c73730e38` | 294 |
| formulas-receipt.json#29 | `b61aa6c7-3109-8fc1-95e7-c98661b34979` | `98ea2bce` | `dab118e47ec79854` | 295 |
| formulas-receipt.json#30 | `ec4b3f17-3dfe-8743-ba4f-2bb3fb27bc72` | `98ea2bce` | `bab2b7d190de6106` | 296 |
| formulas-receipt.json#31 | `7e08f602-68aa-8a46-b280-512a544a36d5` | `98ea2bce` | `5c33eb9daa20de5f` | 297 |
| formulas-receipt.json#32 | `ea3e4fcd-976a-8fc0-923b-f4bdb26e862c` | `98ea2bce` | `f5966cd95fb8a587` | 298 |
| formulas-receipt.json#33 | `027b8b17-60ce-8275-b26a-8b2e7f211194` | `98ea2bce` | `5e9ee50c2190517d` | 299 |
| formulas-receipt.json#34 | `327ae992-fba7-8f76-8402-1be6503e2806` | `98ea2bce` | `9452f0a9a14df85f` | 300 |
| formulas-receipt.json#35 | `e11fbd20-ecbd-8a73-8531-3f91a2691e9b` | `98ea2bce` | `918f4c150a270ab6` | 301 |
| formulas-receipt.json#36 | `c3c82234-ad78-80a6-bfe0-e828ba9b2597` | `98ea2bce` | `19e4e1441e0ec965` | 302 |
| formulas-receipt.json#37 | `32770239-8f5d-8ea4-8d69-2b09671982ef` | `98ea2bce` | `aa2cfb68632c5119` | 303 |
| formulas-receipt.json#38 | `968ef5a6-04ed-8592-b82e-708eb849f9b7` | `98ea2bce` | `8392917421a52db1` | 304 |
| formulas-receipt.json#39 | `24b8a577-dc17-83e1-9280-d01f54d29a9a` | `98ea2bce` | `6662ca2e44ab30ce` | 305 |
| formulas-receipt.json#40 | `bc4fa987-0a54-8274-b726-5e386c380539` | `98ea2bce` | `f563e65959af7e4e` | 306 |
| formulas-receipt.json#41 | `c634f06f-582a-8506-b169-cd0c7cf7c822` | `98ea2bce` | `92831b82805af163` | 307 |
| formulas-receipt.json#42 | `9241c36a-2777-8ab5-be2d-e2dc7d9aa1a2` | `98ea2bce` | `557f5e671bd51404` | 308 |
| formulas-receipt.json#43 | `7ed35ac4-048f-8a0e-b5d8-53411f4dc89d` | `98ea2bce` | `96bf41580bb3e014` | 309 |
| formulas-receipt.json#44 | `d029f40b-19f8-8529-b82b-c1cd5511f94c` | `98ea2bce` | `1081e629ee709212` | 310 |
| formulas-receipt.json#45 | `91fb680d-19ec-866a-a57e-49d4883ed87d` | `98ea2bce` | `8f9bf89769e156e0` | 311 |
| formulas-receipt.json#46 | `0c909e45-a33d-8f18-a872-7f12288ea10b` | `98ea2bce` | `c26d82a4db15e6e2` | 312 |
| formulas-receipt.json#47 | `180817ef-646f-89e9-bd63-adc775ff0f77` | `98ea2bce` | `7589f697a532a331` | 313 |
| formulas-receipt.json#48 | `dddf23cf-4745-833a-a185-574888c9f442` | `98ea2bce` | `ca69c8b2bfd18768` | 314 |
| formulas-receipt.json#49 | `5fe74812-7ce1-8fea-939b-23a632e3da31` | `98ea2bce` | `35d178ba5806de3e` | 315 |
| formulas-receipt.json#50 | `abac1f95-2538-8550-8644-bca8f9ee6285` | `98ea2bce` | `79165b15a85cd1c9` | 316 |
| formulas-receipt.json#51 | `ab20f92a-5c8e-8995-90a8-3794df6d5d35` | `98ea2bce` | `19b9443386db5207` | 317 |
| formulas-receipt.json#52 | `8248a08d-37bf-864a-9e44-8350f469cb58` | `98ea2bce` | `a5e18eaf7c36d53e` | 318 |
| formulas-receipt.json#53 | `de0390f9-3284-82d8-a173-7cbcc45232c0` | `98ea2bce` | `4af9d1ed26649ab9` | 319 |
| formulas-receipt.json#54 | `725643e0-bf04-8f36-8bbb-a115f1f6922e` | `98ea2bce` | `829600c37fb2c3cc` | 320 |
| formulas-receipt.json#55 | `4ec4e6f7-65c4-80a4-bbd4-33f9926c871d` | `98ea2bce` | `6384cd49f6ae7653` | 321 |
| formulas-receipt.json#56 | `d46954da-239f-8d02-8967-3fe9ea708a65` | `98ea2bce` | `b9182644b90809c4` | 322 |
| formulas-receipt.json#57 | `d38b5df8-a6f5-8593-a8a7-1ec8ae6efa96` | `98ea2bce` | `e1016d184d08867a` | 323 |
| formulas-receipt.json#58 | `7dec05e2-e578-8b8e-bdff-1c89b90a9b63` | `98ea2bce` | `61e5f465150e9fb6` | 324 |
| formulas-receipt.json#59 | `d13ccf92-4c0b-849e-8691-07184011e9d9` | `98ea2bce` | `0bb30b26a85df1e2` | 325 |
| formulas-receipt.json#60 | `0873c6c8-2615-80dc-9234-2bb50b99a693` | `98ea2bce` | `e856c137149495c1` | 326 |
| formulas-receipt.json#61 | `d11b6808-f9c4-8608-b97e-ea10258fbe4f` | `98ea2bce` | `577494687c1be17c` | 327 |
| formulas-receipt.json#62 | `7ed9ed2f-f8e4-88d5-a358-61ae2473b45d` | `98ea2bce` | `06962e72272574ab` | 328 |
| formulas-receipt.json#63 | `111b539e-4d3f-89ed-ae7a-cae1013da6d2` | `98ea2bce` | `56b20f8799d6b7ec` | 329 |
| formulas-receipt.json#64 | `93ddd474-f68c-86f8-820c-0d5a14fa8ab1` | `98ea2bce` | `9d5eabf51b1d3f15` | 330 |
| formulas-receipt.json#65 | `c63d6723-06f8-8779-9d07-7994229ea713` | `98ea2bce` | `ab940b45add682a2` | 331 |
| formulas-receipt.json#66 | `bbfdbc42-f9d2-8c9d-9dd0-7d7c4e577dc1` | `98ea2bce` | `c1b32a56a930528a` | 332 |
| formulas-receipt.json#67 | `ffc9841e-e3e3-8793-93b4-8ab84b8c7235` | `98ea2bce` | `2558048ef349fa9d` | 333 |
| formulas-receipt.json#68 | `5e632150-040b-8868-87c9-97cd1c6f055d` | `98ea2bce` | `c41a2a719dbe2407` | 334 |
| formulas-receipt.json#69 | `566a564f-3e19-8efe-be63-c48a98723101` | `98ea2bce` | `5e9d093b584d1aa5` | 335 |
| formulas-receipt.json#70 | `948e436b-946a-8a42-8e92-e21121434630` | `98ea2bce` | `f1c0a497d54f22b0` | 336 |
| formulas-receipt.json#71 | `d8db0c12-30de-8612-8e25-0bacecf4c4a6` | `98ea2bce` | `9c4dbfae16230c90` | 337 |
| formulas-receipt.json#72 | `e60499d4-ddda-8c0f-beb9-5fe87377bbd8` | `98ea2bce` | `d342241f5ab2d9dc` | 338 |
| formulas-receipt.json#73 | `029d4f23-b8ff-8e4d-be67-5069128cbe7f` | `98ea2bce` | `1986cdb8d489b44b` | 339 |
| formulas-receipt.json#74 | `a7c3f193-0520-86aa-89a4-b5d94ef2d543` | `98ea2bce` | `9092ba22b6b56870` | 340 |
| formulas-receipt.json#75 | `430d70c8-db58-81a3-aaa7-ee3dcbce5ef2` | `98ea2bce` | `6b53d7d27b6d3a5c` | 341 |
| formulas-receipt.json#76 | `8baaedbc-a58e-825a-beed-5ccdecd0bad9` | `98ea2bce` | `8a1eb11de8387202` | 342 |
| formulas-receipt.json#77 | `b468130b-33ec-81df-bb61-ae15fff934aa` | `98ea2bce` | `39ccfe9889225e5b` | 343 |
| formulas-receipt.json#78 | `021d0d28-aca4-82b0-9eeb-6db0db08cc85` | `98ea2bce` | `9116f7ac9d0cd1b4` | 344 |
| fuse-receipt.json | `fae933cc-9d4d-8256-b1fc-c9040b9021b4` | `16cee539` | `1e8c60741e0cdbbe` | 345 |
| lattice-receipt.json | `9599da48-cedc-8163-884c-01156b9584c6` | `16cee539` | `5c9367f8765423b2` | 346 |
| lean-receipt.json | `bbb3e4f7-ce50-8546-9108-e874caf84328` | `16cee539` | `7a63d6ab25d404f4` | 347 |
| lean-receipt.json#0 | `c51ad2fa-906e-8f88-8077-c7046b9b49ab` | `bbb3e4f7` | `01a4314334920464` | 348 |
| lean-receipt.json#1 | `194fa01c-0cb8-862a-be90-5079a619cda7` | `bbb3e4f7` | `17dd686d646c00c4` | 349 |
| lean-receipt.json#2 | `dfce9e12-07b4-8c83-8a56-6381bd2f1f40` | `bbb3e4f7` | `85559ecfe991db72` | 350 |
| lean-receipt.json#3 | `3ec76e26-9629-8094-a7e2-9fcd7316228e` | `bbb3e4f7` | `0b81c75ca7b9f612` | 351 |
| lean-receipt.json#4 | `8acf4ac8-6ab7-8cfd-b5d7-99baecefc5cf` | `bbb3e4f7` | `856c8808576cb0ed` | 352 |
| lean-receipt.json#5 | `633408fd-1526-84e4-a08e-3b4da43f0d23` | `bbb3e4f7` | `8c42f871b54b87a0` | 353 |
| lean-receipt.json#6 | `4ca893e8-24a6-8e31-8a10-3dddcf0ff1a4` | `bbb3e4f7` | `a1bb51780f3b93f2` | 354 |
| lean-receipt.json#7 | `3e51d111-a5b5-8a3f-8058-4980d4d21bc1` | `bbb3e4f7` | `8c393b1c4570738a` | 355 |
| lean-receipt.json#8 | `d897da6e-8533-8e60-a985-cdc1dd38a253` | `bbb3e4f7` | `8759e151d526b48d` | 356 |
| lean-receipt.json#9 | `31e334ab-aec4-8c83-8a1a-3ed46f33dc8a` | `bbb3e4f7` | `ba236e62d0f2e667` | 357 |
| lean-receipt.json#10 | `aba7bb80-07c3-8459-9f54-44835eedd6a6` | `bbb3e4f7` | `2d3bffa2815b71de` | 358 |
| lean-receipt.json#11 | `fdeae1e5-c75a-89e6-9f3d-07d422c2a48f` | `bbb3e4f7` | `3b823db63b5cf251` | 359 |
| lean-receipt.json#12 | `440b2d8d-e537-8279-9437-cf9c674299de` | `bbb3e4f7` | `8198bb405e69ae3d` | 360 |
| lean-receipt.json#13 | `22ba3823-bc57-8b65-a01c-0a36e9d4d72f` | `bbb3e4f7` | `fa381a949b4f1709` | 361 |
| lean-receipt.json#14 | `fcaab01a-887b-827c-b853-cd542d856d66` | `bbb3e4f7` | `ccbc114c64b5d7d5` | 362 |
| lean-receipt.json#15 | `85feb219-f1ab-86bf-8e8a-fee12d06f746` | `bbb3e4f7` | `ca2d842deaaa3417` | 363 |
| lean-receipt.json#16 | `50297fe3-ef62-8f1d-a4f6-9c4b2c6567be` | `bbb3e4f7` | `c26db2931600ef72` | 364 |
| lean-receipt.json#17 | `775eb852-6d95-8de5-8025-005bed7bd30b` | `bbb3e4f7` | `f1d614a5647be442` | 365 |
| lean-receipt.json#18 | `14b9a1cf-8e80-84af-9191-b422dd4e489e` | `bbb3e4f7` | `20b0af073db0d784` | 366 |
| lean-receipt.json#19 | `6e3aeb60-0934-80e1-be96-7263d4b9a844` | `bbb3e4f7` | `661bd8788a9d8fec` | 367 |
| lean-receipt.json#20 | `08e3a662-df25-8b4d-9f12-2ada02dc70e9` | `bbb3e4f7` | `8ae5bda61686e5fe` | 368 |
| lean-receipt.json#21 | `29c4640c-461d-896d-a6ff-ad5911d1d20e` | `bbb3e4f7` | `0173e958093f571c` | 369 |
| lean-receipt.json#22 | `c2ec0966-9bc2-8d31-a4c7-17676a3fbbff` | `bbb3e4f7` | `dc9170336312cfdd` | 370 |
| lean-receipt.json#23 | `7076f7a8-0d2b-8073-9cab-bc40c4cc108c` | `bbb3e4f7` | `a928836e949a3b08` | 371 |
| lean-receipt.json#24 | `a4e5edd3-0fac-8772-a740-cfb28d619d4c` | `bbb3e4f7` | `892beb0c6c10c5d8` | 372 |
| lean-receipt.json#25 | `877c72e3-9db9-8079-b71f-0d5b3295738a` | `bbb3e4f7` | `54b1ada5511adb73` | 373 |
| lean-receipt.json#26 | `4e006b41-11e7-81cf-a0d2-54a36a122063` | `bbb3e4f7` | `ac8eef3ad8936c18` | 374 |
| lean-receipt.json#27 | `2661596f-405c-8326-9190-5be0fa55620b` | `bbb3e4f7` | `7256c466c3448c3f` | 375 |
| lean-receipt.json#28 | `7e1e9811-6d85-8342-9067-6c835082b3cf` | `bbb3e4f7` | `783f0872ec919aeb` | 376 |
| lean-receipt.json#29 | `64a40aef-8abc-8e8a-9ca3-30f164d01d6b` | `bbb3e4f7` | `c2625317519e7ea0` | 377 |
| lean-receipt.json#30 | `fec4a466-fb10-8265-813a-9c17d93b9f05` | `bbb3e4f7` | `b828aefe631f023f` | 378 |
| lean-receipt.json#31 | `b5ba2aad-7983-810e-81fc-bcd8a4e040f5` | `bbb3e4f7` | `28c97dc8c98c1353` | 379 |
| lean-receipt.json#32 | `80160332-7b45-8862-9173-992ef52d1dc5` | `bbb3e4f7` | `a50a453d176456ba` | 380 |
| lean-receipt.json#33 | `68461d41-6e06-881e-b1f0-669a91f56845` | `bbb3e4f7` | `e9987eb5bb747c92` | 381 |
| lean-receipt.json#34 | `9937f890-7cc3-895b-90cc-720486f5f9df` | `bbb3e4f7` | `d96c3e86ca8300bb` | 382 |
| lean-receipt.json#35 | `0cb6c9bb-2122-8269-898b-2486409942fe` | `bbb3e4f7` | `026803944de9f8fb` | 383 |
| lean-receipt.json#36 | `fadad1e3-cc2d-822e-8b19-bfb4735163aa` | `bbb3e4f7` | `9493a574bb66c834` | 384 |
| lean-receipt.json#37 | `1725ab67-ac62-82f6-bf58-9d12e19a0f65` | `bbb3e4f7` | `e49607ea34f2e643` | 385 |
| lean-receipt.json#38 | `21672244-381f-87f0-945e-5959ad68aec4` | `bbb3e4f7` | `3a9d0303d541d513` | 386 |
| lean-receipt.json#39 | `e461cc5d-1d66-8ef9-9a84-1e4ed0663af6` | `bbb3e4f7` | `850461c1588ef998` | 387 |
| lean-receipt.json#40 | `d3fc4f6d-c32a-89e7-80f0-8790a459655a` | `bbb3e4f7` | `54ced7ee08c43b01` | 388 |
| lean-receipt.json#41 | `fbf4fd67-9bab-8f6e-a8da-56405429db8c` | `bbb3e4f7` | `883120543a46eeba` | 389 |
| lean-receipt.json#42 | `9a75ac51-bfad-8ada-b105-1f8799466374` | `bbb3e4f7` | `3ab0cd25a6b5a51c` | 390 |
| lean-receipt.json#43 | `4209f3cc-86d1-873a-9892-f00bd9ff02d5` | `bbb3e4f7` | `f9b7bcab6eb1f2ec` | 391 |
| lean-receipt.json#44 | `0f3abe4a-ae09-8be8-a4e2-72866898975a` | `bbb3e4f7` | `ba26eb0385ad4049` | 392 |
| lean-receipt.json#45 | `7e678c5f-c958-8c99-a189-dec4fbadea02` | `bbb3e4f7` | `cdfdeaec366d59a9` | 393 |
| lean-receipt.json#46 | `49fecc1d-bed5-8139-a568-5b470debe788` | `bbb3e4f7` | `a3f34c2b09cbdc81` | 394 |
| lean-receipt.json#47 | `47ceb9c9-14bf-8855-8bec-3e5b8a406d99` | `bbb3e4f7` | `fa828c0c9002434a` | 395 |
| lean-receipt.json#48 | `0c80a675-0cba-8cd7-bc26-1916821b3486` | `bbb3e4f7` | `390ee6112bc84229` | 396 |
| lean-receipt.json#49 | `c92607a9-98cf-8d6e-9de8-30b45b7a24cf` | `bbb3e4f7` | `14e7224d07b82fe5` | 397 |
| lean-receipt.json#50 | `c7ed789e-886c-8753-aefd-6dd2a2fb9324` | `bbb3e4f7` | `a26d61f94731765b` | 398 |
| lean-receipt.json#51 | `f58bd0ae-f47a-8e01-9522-e1e537246ae5` | `bbb3e4f7` | `0606ba04128bc864` | 399 |
| lean-receipt.json#52 | `151fc952-1a87-88a5-b037-7dfe432e7ab2` | `bbb3e4f7` | `d8fe7dee19a9eca9` | 400 |
| lean-receipt.json#53 | `5f243533-77aa-8b9f-b253-bda6ed712916` | `bbb3e4f7` | `5e9815aaca739805` | 401 |
| lean-receipt.json#54 | `966b2478-2fa9-838b-a440-752996c9b268` | `bbb3e4f7` | `fca5ef45f516834b` | 402 |
| lean-receipt.json#55 | `1d1630cb-078f-8615-a541-6ce8a978267f` | `bbb3e4f7` | `4e0f8d28c2a80cb1` | 403 |
| lean-receipt.json#56 | `0cad781f-8825-86dd-9d63-ead52216a057` | `bbb3e4f7` | `bddfe267a640156c` | 404 |
| lean-receipt.json#57 | `47d31f05-5f9c-8a6a-8269-fae358b29449` | `bbb3e4f7` | `aaca8fa141b1b164` | 405 |
| lean-receipt.json#58 | `2af51a39-b178-8067-a7ef-8e93e4a46ee0` | `bbb3e4f7` | `de9c1d0eb319845f` | 406 |
| lean-receipt.json#59 | `85cf96bf-67dd-89e4-a66e-c80fbe528d2a` | `bbb3e4f7` | `5ad4efe87055dad6` | 407 |
| lean-receipt.json#60 | `a705abb8-1b7a-81a1-a54e-a70f8680d172` | `bbb3e4f7` | `21f8222a910896f8` | 408 |
| lean-receipt.json#61 | `be7e6084-c197-86c9-8598-c7e9aebba3c6` | `bbb3e4f7` | `9ab521ab8bfd2c30` | 409 |
| lean-receipt.json#62 | `f411eb43-ca3f-810e-a2d4-32a968a59f96` | `bbb3e4f7` | `97f276540373c55c` | 410 |
| lean-receipt.json#63 | `c9e50ad9-5abe-8af2-bb2b-de2746c27eb1` | `bbb3e4f7` | `433fae11c15a3406` | 411 |
| lean-receipt.json#64 | `e078a9a9-44e8-897f-8772-3ccaad50fa2f` | `bbb3e4f7` | `99f6f1bba698c440` | 412 |
| lean-receipt.json#65 | `2c9cc26f-149d-8ca3-ab7b-8aeb7a41e441` | `bbb3e4f7` | `9f74c15228e068ae` | 413 |
| lean-receipt.json#66 | `18d05e91-7a46-89a2-ad4f-b01618fb0003` | `bbb3e4f7` | `50d88d048369584c` | 414 |
| lean-receipt.json#67 | `3921f151-4516-85ea-97f9-e5fc95584430` | `bbb3e4f7` | `89f9254372ae56a4` | 415 |
| lean-receipt.json#68 | `b89ff4ce-de24-8b5d-a42c-ae3af98a38f3` | `bbb3e4f7` | `019312acb7ec2b4b` | 416 |
| lean-receipt.json#69 | `7ac10efe-e0ab-8507-abb0-a73851bf0199` | `bbb3e4f7` | `09fe6367b5d53bf0` | 417 |
| lean-receipt.json#70 | `4df01de1-20d9-8cfa-babe-0dd6b0958a63` | `bbb3e4f7` | `228f135985843f8b` | 418 |
| lean-receipt.json#71 | `fe1f48d4-6451-8ff2-bdb4-b58001024884` | `bbb3e4f7` | `43d4a9af3eae5238` | 419 |
| lean-receipt.json#72 | `fd2fca7d-a610-882f-a30b-39521e805c03` | `bbb3e4f7` | `c48f727b686daaaa` | 420 |
| lean-receipt.json#73 | `7dcc3ce2-b749-8de1-9d25-730423bb0e83` | `bbb3e4f7` | `e948e238756c4b88` | 421 |
| lean-receipt.json#74 | `a4524944-6cc8-8d79-b931-3d4962ea4ae9` | `bbb3e4f7` | `97efe68b81d61976` | 422 |
| lean-receipt.json#75 | `2b0715ed-6e9d-8800-b781-23fbbd48aa97` | `bbb3e4f7` | `9bff2b6d5fc53087` | 423 |
| lean-receipt.json#76 | `c490360f-2215-8066-848b-d633963d268e` | `bbb3e4f7` | `f7c370cf81952879` | 424 |
| lean-receipt.json#77 | `f9a2bdf6-abf7-8ea5-b740-bfb85e14005d` | `bbb3e4f7` | `d3ac9515015a7683` | 425 |
| lean-receipt.json#78 | `b264aaf0-3a8f-86b5-9efd-f2d442ca11fe` | `bbb3e4f7` | `e39144dd650da2d3` | 426 |
| lean-receipt.json#79 | `675aaab9-6297-8602-93c2-c63b18e42998` | `bbb3e4f7` | `13aa26d4330f37b7` | 427 |
| lean-receipt.json#80 | `fbdc4dfa-23b3-8c77-b64a-7367f444cbfe` | `bbb3e4f7` | `6fd3a89255a92ed8` | 428 |
| lean-receipt.json#81 | `52286689-9847-80e4-a169-bcb834f63fa3` | `bbb3e4f7` | `2150be74f267d805` | 429 |
| lean-receipt.json#82 | `583f1da2-3abd-8436-89e7-20270b84b855` | `bbb3e4f7` | `ca40f3358e8ba4a4` | 430 |
| lean-receipt.json#83 | `948684e7-c683-8351-b762-0679b93a0831` | `bbb3e4f7` | `cd77c6f87b5b1064` | 431 |
| lean-receipt.json#84 | `df2b8778-7920-8f5e-8023-5656c8d11c89` | `bbb3e4f7` | `7013fccd8490dad7` | 432 |
| lean-receipt.json#85 | `2c882ed3-19ec-8148-99c3-04d164c73fe6` | `bbb3e4f7` | `7502a7db02d5a467` | 433 |
| lean-receipt.json#86 | `fe1e9325-a93a-860d-ace3-2be3dbbde87f` | `bbb3e4f7` | `d8ed6351f82dc020` | 434 |
| lean-receipt.json#87 | `ac1cc6f9-6c92-8b8a-9992-c527a77ad09b` | `bbb3e4f7` | `87ad43e6d9e74af4` | 435 |
| lean-receipt.json#88 | `2dea2125-f693-892f-b4e7-24eb5a1e464b` | `bbb3e4f7` | `29a1ce5eccc794cd` | 436 |
| lean-receipt.json#89 | `15d0d7a3-5729-8c76-990f-e11cc94ac0cf` | `bbb3e4f7` | `917a754ef7ded231` | 437 |
| lean-receipt.json#90 | `fb5bb67d-227b-8a69-acdd-b48dde7c58fc` | `bbb3e4f7` | `2ddbc9e72c5863a3` | 438 |
| lean-receipt.json#91 | `6ed76ce9-0d04-8542-ac89-f56921c1afb2` | `bbb3e4f7` | `19e70810b6c0569e` | 439 |
| lean-receipt.json#92 | `7e037f78-2ca8-8b2b-b93b-2c09895b1337` | `bbb3e4f7` | `ab2dc0ed36085aae` | 440 |
| lean-receipt.json#93 | `0205f307-5727-862f-9ceb-59f500b9b358` | `bbb3e4f7` | `6b6a512c4de306e7` | 441 |
| lean-receipt.json#94 | `7c79865c-1342-87f8-ab48-9aee84df343a` | `bbb3e4f7` | `8cc93ec2a2c3b4c1` | 442 |
| lean-receipt.json#95 | `ef12270e-1d7a-837d-aad6-d7fa5c5bfb5e` | `bbb3e4f7` | `4da17eb3cca04d6f` | 443 |
| lean-receipt.json#96 | `0bf527e5-c5d5-8253-86ce-ac47ff960027` | `bbb3e4f7` | `cca2e313bbad6348` | 444 |
| lean-receipt.json#97 | `4aacddc2-ec79-838b-8e19-d3a51222dea2` | `bbb3e4f7` | `178311578707a3d9` | 445 |
| lean-receipt.json#98 | `0deeeb31-39c1-8d87-9f91-9ee18997932e` | `bbb3e4f7` | `d6aad521dd3822c7` | 446 |
| lean-receipt.json#99 | `e1eafe2a-e707-8156-a69e-3ecc4ce5d205` | `bbb3e4f7` | `a558c1105bcf6999` | 447 |
| lean-receipt.json#100 | `baf64af4-455f-8b9f-8c3f-08ecf93bc0d2` | `bbb3e4f7` | `7002d9a2943b4233` | 448 |
| lean-receipt.json#101 | `fdda2ebe-7ef3-8a76-801b-429d105bc407` | `bbb3e4f7` | `af05078facef6371` | 449 |
| lean-receipt.json#102 | `fd77d01a-3e51-8599-bb7e-527339c7b450` | `bbb3e4f7` | `d440e12709b21f65` | 450 |
| lean-receipt.json#103 | `ac0c5365-50a4-8b9b-9e07-24d59f3cb2c2` | `bbb3e4f7` | `4a5dc765b0ae881a` | 451 |
| lean-receipt.json#104 | `d410aa42-8760-8faa-87a0-2bd0323fa2fa` | `bbb3e4f7` | `6e33961b381f1b24` | 452 |
| lean-receipt.json#105 | `f63d316d-2007-8438-a559-5d34c0065510` | `bbb3e4f7` | `8995d8a066b7efef` | 453 |
| lean-receipt.json#106 | `c68247ec-c62e-863f-805b-f158ef992895` | `bbb3e4f7` | `ee05cc004c566b7d` | 454 |
| lean-receipt.json#107 | `713a2aaa-4730-8c2f-b8b5-335752f2c49e` | `bbb3e4f7` | `4a5f92880000ec12` | 455 |
| lean-receipt.json#108 | `81a03a5e-5689-89bc-a1bb-8f179150613e` | `bbb3e4f7` | `673fccabf7917e43` | 456 |
| lean-receipt.json#109 | `462412a6-e557-891e-891d-83e55cdccf6c` | `bbb3e4f7` | `7e721ac4c1f5636e` | 457 |
| lean-receipt.json#110 | `75fe86eb-b157-820d-83ec-f5886aa4df01` | `bbb3e4f7` | `5104b1b5d221fe0c` | 458 |
| lean-receipt.json#111 | `d4cb7f31-77f1-861d-bb0d-9e004e4efd50` | `bbb3e4f7` | `a53e2a3165bc2079` | 459 |
| lean-receipt.json#112 | `80010f4b-8848-80d0-87f9-64b9774d9da0` | `bbb3e4f7` | `ac11551381559b5d` | 460 |
| lean-receipt.json#113 | `6be2beb8-56c9-8d30-8966-e91889968199` | `bbb3e4f7` | `1e76aaa529c1faf4` | 461 |
| lean-receipt.json#114 | `5de2dfcb-1634-81af-98c7-c875b9e21874` | `bbb3e4f7` | `6650de8fa69d0055` | 462 |
| lean-receipt.json#115 | `8a116d3f-ae4a-8616-867a-b282047ca480` | `bbb3e4f7` | `45ffdc938f29d266` | 463 |
| lean-receipt.json#116 | `746e75b0-25b9-824a-9ccd-3338d3b4612b` | `bbb3e4f7` | `29720f16131d7884` | 464 |
| lean-receipt.json#117 | `23160ed2-fe40-8cda-8c8c-827be00460fa` | `bbb3e4f7` | `8f9e22c7e2bea6c9` | 465 |
| lean-receipt.json#118 | `4e505bcf-5910-88e5-8ecf-dc66e105064d` | `bbb3e4f7` | `f9363e39d4b6cfec` | 466 |
| lean-receipt.json#119 | `87e6583f-3c24-85d5-9cfb-cd0a378a878e` | `bbb3e4f7` | `123fa2b2b6e380b2` | 467 |
| lean-receipt.json#120 | `7d0a7b21-83cf-81d0-84e8-b2b4e42cba93` | `bbb3e4f7` | `df00ee1dd773d8f2` | 468 |
| lean-receipt.json#121 | `2e03dcff-4fb6-85b3-b5de-9a99619e3cf3` | `bbb3e4f7` | `20f85f44fda02861` | 469 |
| lean-receipt.json#122 | `a80fca18-3e06-8bf0-9e5d-ad207273efb1` | `bbb3e4f7` | `040743c9cee1336f` | 470 |
| lean-receipt.json#123 | `68e79260-f35f-8671-a06b-107f778aafae` | `bbb3e4f7` | `bfa20fd6cf759420` | 471 |
| payload-cf-receipt.json | `dcb61df5-f639-8a53-bcc6-997674baf545` | `16cee539` | `f62f0aaf7ff26014` | 472 |
| percall-receipt.json | `114d2cb8-05da-8723-8b5c-bea34af70d18` | `16cee539` | `bb48a531ebc72170` | 473 |
| refusals-receipt.json | `dcc1e97c-2ea2-8f86-a20b-3f4db29213a3` | `16cee539` | `8c5570077f4d6204` | 474 |
| test-receipt.json | `49789ed7-7aa3-851b-a9d2-9d2cc07ccabf` | `16cee539` | `4a5cfb5ecff89ea1` | 475 |
| test-receipt.json#0 | `4d33bb2f-cd75-8a52-9233-842106b5b78b` | `49789ed7` | `9a01ace6de6b54ec` | 476 |
| test-receipt.json#1 | `00656e9e-f361-8a00-997f-8b2072f0283f` | `49789ed7` | `a13d744057ec9cc2` | 477 |
| test-receipt.json#2 | `920ffe6c-c253-8847-9944-9903f09072e0` | `49789ed7` | `bbd68eebc2fb3df3` | 478 |
| test-receipt.json#3 | `dd913bd4-a191-8e85-9bbe-7de606311f21` | `49789ed7` | `e739f4896d14e203` | 479 |
| test-receipt.json#4 | `6e2291fe-6f40-8ec8-b1dd-7a3b915f2eeb` | `49789ed7` | `7d78476f346361f5` | 480 |
| test-receipt.json#5 | `adb45227-39e4-85e9-96bc-f13554ee4647` | `49789ed7` | `3120a62df82699eb` | 481 |
| test-receipt.json#6 | `b88cddf6-8675-866c-a808-afac793a27ff` | `49789ed7` | `e603dbc8c5889a16` | 482 |
| test-receipt.json#7 | `362caec0-1cda-8fe5-966e-07be7f37335e` | `49789ed7` | `09c5ebed7bd28d13` | 483 |
| test-receipt.json#8 | `d2b5b973-51cc-8f1b-a949-7cb49764d664` | `49789ed7` | `987476006a69a566` | 484 |
| test-receipt.json#9 | `3b73940f-4928-8511-8a9f-f44a0e9d775e` | `49789ed7` | `5d554129661dae60` | 485 |
| test-receipt.json#10 | `ec04c08a-ec0a-8fea-a0a6-729cb1e879b2` | `49789ed7` | `c25f540b1357461f` | 486 |
| walls-receipt.json | `1a930f0d-bf93-83fc-a94b-91ea004fd017` | `16cee539` | `46393a1f4c0937d6` | 487 |
| readme | `d087460d-136c-8c7e-8f3f-9b98e4df48b7` | `16cee539` | `bfac00094591bf35` | 488 |

Regenerate with `npm run readme` after `npm run build` and the receipt-producing runs; `node scripts/generate-readme.mjs --check`
compares. Documentation: [docs/README.md](docs/README.md). License: CC-BY-NC-ND-4.0.
