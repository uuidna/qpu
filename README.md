# UUIDNA QPU

**Final build receipt** `df116fb4-4656-8618-8f5a-774fd74e834b`

| | |
|---|---|
| version | 1.0.0 |
| commit | `fb90a6f48dcb57548c849b12570dc90567d70dc4` (working tree differed from this commit) |
| receipts | 13 files, 344 nodes |
| build stream | length 344, head `df116fb4-4656-8618-8f5a-774fd74e834b`, chain `075a04e25b4581b7673d21878432dc23dad52bc1ef2ae3df1c8019edbcfebb61`, holds **true** |

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
  nf9cebb72["root<br/><code>f9cebb72</code>"]
  nc6a8b61c["cross-receipt.json<br/><code>c6a8b61c</code>"]
  n144f8e0d["cross-receipt.json#0<br/><code>144f8e0d</code>"]
  nf1ebdb3a["cross-receipt.json#1<br/><code>f1ebdb3a</code>"]
  n93f1f81c["cross-receipt.json#2<br/><code>93f1f81c</code>"]
  n52fa905b["cross-receipt.json#3<br/><code>52fa905b</code>"]
  n836f09ac["cross-receipt.json#4<br/><code>836f09ac</code>"]
  n96b9ff4c["cross-receipt.json#5<br/><code>96b9ff4c</code>"]
  n05e765a5["cross-receipt.json#6<br/><code>05e765a5</code>"]
  ne6d4f149["cross-receipt.json#7<br/><code>e6d4f149</code>"]
  n1749bf07["cross-receipt.json#8<br/><code>1749bf07</code>"]
  nbe2cdb99["cross-receipt.json#9<br/><code>be2cdb99</code>"]
  nff4fae3c["cross-receipt.json#10<br/><code>ff4fae3c</code>"]
  n3295f3a8["cross-receipt.json#11<br/><code>3295f3a8</code>"]
  n2ab14222["cross-receipt.json#12<br/><code>2ab14222</code>"]
  n3fced43d["cross-receipt.json#13<br/><code>3fced43d</code>"]
  nb779dfc4["cross-receipt.json#14<br/><code>b779dfc4</code>"]
  ne8374523["cross-receipt.json#15<br/><code>e8374523</code>"]
  n2595dfc6["cross-receipt.json#16<br/><code>2595dfc6</code>"]
  ne7e769f7["cross-receipt.json#17<br/><code>e7e769f7</code>"]
  n734848a0["cross-receipt.json#18<br/><code>734848a0</code>"]
  n03ac1e4e["cross-receipt.json#19<br/><code>03ac1e4e</code>"]
  n73e63ce9["cross-receipt.json#20<br/><code>73e63ce9</code>"]
  ne1e840f9["cross-receipt.json#21<br/><code>e1e840f9</code>"]
  nd6859e04["cross-receipt.json#22<br/><code>d6859e04</code>"]
  ne8f0ec1e["cross-receipt.json#23<br/><code>e8f0ec1e</code>"]
  nc5876e7c["cross-receipt.json#24<br/><code>c5876e7c</code>"]
  n8689951d["cross-receipt.json#25<br/><code>8689951d</code>"]
  n0ee7644a["cross-receipt.json#26<br/><code>0ee7644a</code>"]
  nd3505b72["cross-receipt.json#27<br/><code>d3505b72</code>"]
  nf8411b76["cross-receipt.json#28<br/><code>f8411b76</code>"]
  nfed25c11["cross-receipt.json#29<br/><code>fed25c11</code>"]
  na8e2dd5f["debts-receipt.json<br/><code>a8e2dd5f</code>"]
  n90acc254["discovery-receipt.json<br/><code>90acc254</code>"]
  n57347359["discovery-receipt.json#0<br/><code>57347359</code>"]
  n690a5e74["discovery-receipt.json#1<br/><code>690a5e74</code>"]
  nd6de0bec["discovery-receipt.json#2<br/><code>d6de0bec</code>"]
  n5b9df424["discovery-receipt.json#3<br/><code>5b9df424</code>"]
  n92ea6c4a["discovery-receipt.json#4<br/><code>92ea6c4a</code>"]
  nc9186bac["discovery-receipt.json#5<br/><code>c9186bac</code>"]
  neaf29d35["discovery-receipt.json#6<br/><code>eaf29d35</code>"]
  nb3717bbe["discovery-receipt.json#7<br/><code>b3717bbe</code>"]
  n35216eab["discovery-receipt.json#8<br/><code>35216eab</code>"]
  n9c823d2e["discovery-receipt.json#9<br/><code>9c823d2e</code>"]
  n1325d1c5["discovery-receipt.json#10<br/><code>1325d1c5</code>"]
  n3cc63d28["discovery-receipt.json#11<br/><code>3cc63d28</code>"]
  n628bc269["discovery-receipt.json#12<br/><code>628bc269</code>"]
  n22683737["discovery-receipt.json#13<br/><code>22683737</code>"]
  na3ff24de["discovery-receipt.json#14<br/><code>a3ff24de</code>"]
  n6409a32f["discovery-receipt.json#15<br/><code>6409a32f</code>"]
  ne1478d97["discovery-receipt.json#16<br/><code>e1478d97</code>"]
  nc91ceb3e["discovery-receipt.json#17<br/><code>c91ceb3e</code>"]
  n1a2de23c["discovery-receipt.json#18<br/><code>1a2de23c</code>"]
  n0451b6a7["discovery-receipt.json#19<br/><code>0451b6a7</code>"]
  n56ae8bd4["discovery-receipt.json#20<br/><code>56ae8bd4</code>"]
  nf50ff3bf["discovery-receipt.json#21<br/><code>f50ff3bf</code>"]
  n5a5a4da7["discovery-receipt.json#22<br/><code>5a5a4da7</code>"]
  n2976e5ca["discovery-receipt.json#23<br/><code>2976e5ca</code>"]
  nb71d41f1["discovery-receipt.json#24<br/><code>b71d41f1</code>"]
  ne9d54f13["discovery-receipt.json#25<br/><code>e9d54f13</code>"]
  n8baec31e["discovery-receipt.json#26<br/><code>8baec31e</code>"]
  n1c3b0856["discovery-receipt.json#27<br/><code>1c3b0856</code>"]
  n89f1bf7a["discovery-receipt.json#28<br/><code>89f1bf7a</code>"]
  nb80df67f["discovery-receipt.json#29<br/><code>b80df67f</code>"]
  n3a2230d9["discovery-receipt.json#30<br/><code>3a2230d9</code>"]
  n120f9364["discovery-receipt.json#31<br/><code>120f9364</code>"]
  n85b0ec0a["discovery-receipt.json#32<br/><code>85b0ec0a</code>"]
  nb9f98b20["discovery-receipt.json#33<br/><code>b9f98b20</code>"]
  n6cfaaca7["discovery-receipt.json#34<br/><code>6cfaaca7</code>"]
  n2fe4c765["discovery-receipt.json#35<br/><code>2fe4c765</code>"]
  n479b8453["discovery-receipt.json#36<br/><code>479b8453</code>"]
  n18428db3["discovery-receipt.json#37<br/><code>18428db3</code>"]
  n0954e86c["discovery-receipt.json#38<br/><code>0954e86c</code>"]
  n05e0d490["discovery-receipt.json#39<br/><code>05e0d490</code>"]
  nf34795ae["discovery-receipt.json#40<br/><code>f34795ae</code>"]
  n92e2748e["discovery-receipt.json#41<br/><code>92e2748e</code>"]
  n848ef947["discovery-receipt.json#42<br/><code>848ef947</code>"]
  n8d2f60e3["discovery-receipt.json#43<br/><code>8d2f60e3</code>"]
  n24d98cd4["discovery-receipt.json#44<br/><code>24d98cd4</code>"]
  nd45f4b89["discovery-receipt.json#45<br/><code>d45f4b89</code>"]
  ndb1d0981["discovery-receipt.json#46<br/><code>db1d0981</code>"]
  n910ebbd1["discovery-receipt.json#47<br/><code>910ebbd1</code>"]
  n2637d38b["discovery-receipt.json#48<br/><code>2637d38b</code>"]
  n04402930["discovery-receipt.json#49<br/><code>04402930</code>"]
  nd7e633a1["discovery-receipt.json#50<br/><code>d7e633a1</code>"]
  n7c32a36a["discovery-receipt.json#51<br/><code>7c32a36a</code>"]
  n9b69a3e4["discovery-receipt.json#52<br/><code>9b69a3e4</code>"]
  n4c61af52["discovery-receipt.json#53<br/><code>4c61af52</code>"]
  nc24411e4["discovery-receipt.json#54<br/><code>c24411e4</code>"]
  n4825fdaf["discovery-receipt.json#55<br/><code>4825fdaf</code>"]
  n4e175c58["discovery-receipt.json#56<br/><code>4e175c58</code>"]
  n4e3af939["discovery-receipt.json#57<br/><code>4e3af939</code>"]
  nc7dd3182["discovery-receipt.json#58<br/><code>c7dd3182</code>"]
  nb596b8d3["discovery-receipt.json#59<br/><code>b596b8d3</code>"]
  n6d01957c["discovery-receipt.json#60<br/><code>6d01957c</code>"]
  n80256a31["discovery-receipt.json#61<br/><code>80256a31</code>"]
  nbbeb6976["discovery-receipt.json#62<br/><code>bbeb6976</code>"]
  n332988e7["discovery-receipt.json#63<br/><code>332988e7</code>"]
  n1eb00b50["discovery-receipt.json#64<br/><code>1eb00b50</code>"]
  nf07d6dc9["discovery-receipt.json#65<br/><code>f07d6dc9</code>"]
  n0f15a78a["discovery-receipt.json#66<br/><code>0f15a78a</code>"]
  ne8c6c068["discovery-receipt.json#67<br/><code>e8c6c068</code>"]
  n73f98772["discovery-receipt.json#68<br/><code>73f98772</code>"]
  nd8293b5f["discovery-receipt.json#69<br/><code>d8293b5f</code>"]
  n16eed20e["discovery-receipt.json#70<br/><code>16eed20e</code>"]
  n67eafa78["discovery-receipt.json#71<br/><code>67eafa78</code>"]
  n3fc0e119["discovery-receipt.json#72<br/><code>3fc0e119</code>"]
  n07864dfc["discovery-receipt.json#73<br/><code>07864dfc</code>"]
  ne7332290["discovery-receipt.json#74<br/><code>e7332290</code>"]
  nf5213ae6["discovery-receipt.json#75<br/><code>f5213ae6</code>"]
  nb66e342c["discovery-receipt.json#76<br/><code>b66e342c</code>"]
  n063d6665["discovery-receipt.json#77<br/><code>063d6665</code>"]
  n0f6b4e0e["discovery-receipt.json#78<br/><code>0f6b4e0e</code>"]
  n3e3ac22f["discovery-receipt.json#79<br/><code>3e3ac22f</code>"]
  n02754db9["discovery-receipt.json#80<br/><code>02754db9</code>"]
  nc32d3894["discovery-receipt.json#81<br/><code>c32d3894</code>"]
  n3e03b7cf["discovery-receipt.json#82<br/><code>3e03b7cf</code>"]
  nfbacbcf9["discovery-receipt.json#83<br/><code>fbacbcf9</code>"]
  n6ce54299["discovery-receipt.json#84<br/><code>6ce54299</code>"]
  n7e64e1ad["flaws-receipt.json<br/><code>7e64e1ad</code>"]
  nf2bcd634["formulas-receipt.json<br/><code>f2bcd634</code>"]
  ncf31f329["formulas-receipt.json#0<br/><code>cf31f329</code>"]
  n7164514a["formulas-receipt.json#1<br/><code>7164514a</code>"]
  nf8b97c0a["formulas-receipt.json#2<br/><code>f8b97c0a</code>"]
  na0c9613d["formulas-receipt.json#3<br/><code>a0c9613d</code>"]
  n01ed5d58["formulas-receipt.json#4<br/><code>01ed5d58</code>"]
  n3cf0a131["formulas-receipt.json#5<br/><code>3cf0a131</code>"]
  n4a8f2821["formulas-receipt.json#6<br/><code>4a8f2821</code>"]
  n3f92236b["formulas-receipt.json#7<br/><code>3f92236b</code>"]
  nff873da5["formulas-receipt.json#8<br/><code>ff873da5</code>"]
  n31c422f3["formulas-receipt.json#9<br/><code>31c422f3</code>"]
  nb4850d94["formulas-receipt.json#10<br/><code>b4850d94</code>"]
  nfa25cef3["formulas-receipt.json#11<br/><code>fa25cef3</code>"]
  n97585d92["formulas-receipt.json#12<br/><code>97585d92</code>"]
  ne8aae182["formulas-receipt.json#13<br/><code>e8aae182</code>"]
  n32d669b5["formulas-receipt.json#14<br/><code>32d669b5</code>"]
  n49b80ea9["formulas-receipt.json#15<br/><code>49b80ea9</code>"]
  n01b90ac3["formulas-receipt.json#16<br/><code>01b90ac3</code>"]
  nb47ffb72["formulas-receipt.json#17<br/><code>b47ffb72</code>"]
  n3d64703f["formulas-receipt.json#18<br/><code>3d64703f</code>"]
  na6069f9b["formulas-receipt.json#19<br/><code>a6069f9b</code>"]
  nb65c3f9e["formulas-receipt.json#20<br/><code>b65c3f9e</code>"]
  n43de016b["formulas-receipt.json#21<br/><code>43de016b</code>"]
  n4f5ac523["formulas-receipt.json#22<br/><code>4f5ac523</code>"]
  na3b943d8["formulas-receipt.json#23<br/><code>a3b943d8</code>"]
  n74cb03f2["formulas-receipt.json#24<br/><code>74cb03f2</code>"]
  nfa5b3ad6["formulas-receipt.json#25<br/><code>fa5b3ad6</code>"]
  nb9bcda6a["formulas-receipt.json#26<br/><code>b9bcda6a</code>"]
  nd365f8a7["formulas-receipt.json#27<br/><code>d365f8a7</code>"]
  nd2ad5596["formulas-receipt.json#28<br/><code>d2ad5596</code>"]
  n2f0aaa06["formulas-receipt.json#29<br/><code>2f0aaa06</code>"]
  na4d705b8["formulas-receipt.json#30<br/><code>a4d705b8</code>"]
  nbddfbe49["formulas-receipt.json#31<br/><code>bddfbe49</code>"]
  n155f1ba2["formulas-receipt.json#32<br/><code>155f1ba2</code>"]
  n12949df1["formulas-receipt.json#33<br/><code>12949df1</code>"]
  ned8cc233["formulas-receipt.json#34<br/><code>ed8cc233</code>"]
  ndb26a6bb["formulas-receipt.json#35<br/><code>db26a6bb</code>"]
  nfa685b23["formulas-receipt.json#36<br/><code>fa685b23</code>"]
  n80941865["formulas-receipt.json#37<br/><code>80941865</code>"]
  n86dd73be["formulas-receipt.json#38<br/><code>86dd73be</code>"]
  n290c96b3["formulas-receipt.json#39<br/><code>290c96b3</code>"]
  n14a560ed["formulas-receipt.json#40<br/><code>14a560ed</code>"]
  n4206b774["formulas-receipt.json#41<br/><code>4206b774</code>"]
  n5953aff2["formulas-receipt.json#42<br/><code>5953aff2</code>"]
  n3adae609["formulas-receipt.json#43<br/><code>3adae609</code>"]
  ndc4fcd8f["formulas-receipt.json#44<br/><code>dc4fcd8f</code>"]
  nbc4b6821["formulas-receipt.json#45<br/><code>bc4b6821</code>"]
  nb36d9802["formulas-receipt.json#46<br/><code>b36d9802</code>"]
  n3daa9db0["formulas-receipt.json#47<br/><code>3daa9db0</code>"]
  n9d612907["formulas-receipt.json#48<br/><code>9d612907</code>"]
  n977f4d21["formulas-receipt.json#49<br/><code>977f4d21</code>"]
  nd8a44984["formulas-receipt.json#50<br/><code>d8a44984</code>"]
  n7ff796d5["formulas-receipt.json#51<br/><code>7ff796d5</code>"]
  ndbf0dcc4["formulas-receipt.json#52<br/><code>dbf0dcc4</code>"]
  n64132140["formulas-receipt.json#53<br/><code>64132140</code>"]
  nec109888["formulas-receipt.json#54<br/><code>ec109888</code>"]
  nb9c4b6ee["formulas-receipt.json#55<br/><code>b9c4b6ee</code>"]
  n3282e5a8["formulas-receipt.json#56<br/><code>3282e5a8</code>"]
  n5ddec5b9["formulas-receipt.json#57<br/><code>5ddec5b9</code>"]
  n199724c6["formulas-receipt.json#58<br/><code>199724c6</code>"]
  n0db331c9["formulas-receipt.json#59<br/><code>0db331c9</code>"]
  n5357bd1c["formulas-receipt.json#60<br/><code>5357bd1c</code>"]
  n4b72f19a["formulas-receipt.json#61<br/><code>4b72f19a</code>"]
  n8ca9dca2["formulas-receipt.json#62<br/><code>8ca9dca2</code>"]
  n1bd28bbf["formulas-receipt.json#63<br/><code>1bd28bbf</code>"]
  naf2529fb["formulas-receipt.json#64<br/><code>af2529fb</code>"]
  n2f1f17f0["formulas-receipt.json#65<br/><code>2f1f17f0</code>"]
  nfd0838a3["formulas-receipt.json#66<br/><code>fd0838a3</code>"]
  n20b53df2["formulas-receipt.json#67<br/><code>20b53df2</code>"]
  n29463506["formulas-receipt.json#68<br/><code>29463506</code>"]
  n2ddac3b3["formulas-receipt.json#69<br/><code>2ddac3b3</code>"]
  n8adb6a39["formulas-receipt.json#70<br/><code>8adb6a39</code>"]
  n0c83691e["formulas-receipt.json#71<br/><code>0c83691e</code>"]
  nee26da7b["formulas-receipt.json#72<br/><code>ee26da7b</code>"]
  nf39e6293["formulas-receipt.json#73<br/><code>f39e6293</code>"]
  nafdd3309["formulas-receipt.json#74<br/><code>afdd3309</code>"]
  nba5fff83["formulas-receipt.json#75<br/><code>ba5fff83</code>"]
  n4bb9c148["formulas-receipt.json#76<br/><code>4bb9c148</code>"]
  nb7bfda60["formulas-receipt.json#77<br/><code>b7bfda60</code>"]
  n50b43669["formulas-receipt.json#78<br/><code>50b43669</code>"]
  n0456dfbc["fuse-receipt.json<br/><code>0456dfbc</code>"]
  n2f2b1ade["lattice-receipt.json<br/><code>2f2b1ade</code>"]
  nbce42eb5["lean-receipt.json<br/><code>bce42eb5</code>"]
  nc2407a8c["lean-receipt.json#0<br/><code>c2407a8c</code>"]
  n6861c52b["lean-receipt.json#1<br/><code>6861c52b</code>"]
  n183c3544["lean-receipt.json#2<br/><code>183c3544</code>"]
  ne97b3dea["lean-receipt.json#3<br/><code>e97b3dea</code>"]
  n5c159dd9["lean-receipt.json#4<br/><code>5c159dd9</code>"]
  n8ec0b683["lean-receipt.json#5<br/><code>8ec0b683</code>"]
  nafeaeae2["lean-receipt.json#6<br/><code>afeaeae2</code>"]
  n803a23e9["lean-receipt.json#7<br/><code>803a23e9</code>"]
  ne1647e5c["lean-receipt.json#8<br/><code>e1647e5c</code>"]
  neddf7cd0["lean-receipt.json#9<br/><code>eddf7cd0</code>"]
  n33015af2["lean-receipt.json#10<br/><code>33015af2</code>"]
  na4cf0685["lean-receipt.json#11<br/><code>a4cf0685</code>"]
  n2431bbf2["lean-receipt.json#12<br/><code>2431bbf2</code>"]
  n1c9a7e83["lean-receipt.json#13<br/><code>1c9a7e83</code>"]
  n73154e92["lean-receipt.json#14<br/><code>73154e92</code>"]
  nd4f6a5a7["lean-receipt.json#15<br/><code>d4f6a5a7</code>"]
  n14b21b35["lean-receipt.json#16<br/><code>14b21b35</code>"]
  nafe5ba15["lean-receipt.json#17<br/><code>afe5ba15</code>"]
  ncd99be32["lean-receipt.json#18<br/><code>cd99be32</code>"]
  n83e62925["lean-receipt.json#19<br/><code>83e62925</code>"]
  n00caae3c["lean-receipt.json#20<br/><code>00caae3c</code>"]
  na0e11465["lean-receipt.json#21<br/><code>a0e11465</code>"]
  nd3ac9b62["lean-receipt.json#22<br/><code>d3ac9b62</code>"]
  n5be674a3["lean-receipt.json#23<br/><code>5be674a3</code>"]
  n1b1b3a0a["lean-receipt.json#24<br/><code>1b1b3a0a</code>"]
  nc230cd7c["lean-receipt.json#25<br/><code>c230cd7c</code>"]
  n180ebbea["lean-receipt.json#26<br/><code>180ebbea</code>"]
  ncfb00fca["lean-receipt.json#27<br/><code>cfb00fca</code>"]
  na38cb598["lean-receipt.json#28<br/><code>a38cb598</code>"]
  n3cb3b347["lean-receipt.json#29<br/><code>3cb3b347</code>"]
  nf2e4e390["lean-receipt.json#30<br/><code>f2e4e390</code>"]
  n4954f0de["lean-receipt.json#31<br/><code>4954f0de</code>"]
  nf670516c["lean-receipt.json#32<br/><code>f670516c</code>"]
  nff34d7f3["lean-receipt.json#33<br/><code>ff34d7f3</code>"]
  n7aabf96a["lean-receipt.json#34<br/><code>7aabf96a</code>"]
  n2712e240["lean-receipt.json#35<br/><code>2712e240</code>"]
  n349a4386["lean-receipt.json#36<br/><code>349a4386</code>"]
  n630055f5["lean-receipt.json#37<br/><code>630055f5</code>"]
  nf99d45fb["lean-receipt.json#38<br/><code>f99d45fb</code>"]
  n32826cea["lean-receipt.json#39<br/><code>32826cea</code>"]
  n91aa90f9["lean-receipt.json#40<br/><code>91aa90f9</code>"]
  n4efc8f5c["lean-receipt.json#41<br/><code>4efc8f5c</code>"]
  n805a9394["lean-receipt.json#42<br/><code>805a9394</code>"]
  ne340379e["lean-receipt.json#43<br/><code>e340379e</code>"]
  nce001eb5["lean-receipt.json#44<br/><code>ce001eb5</code>"]
  n483e0818["lean-receipt.json#45<br/><code>483e0818</code>"]
  n8235ed60["lean-receipt.json#46<br/><code>8235ed60</code>"]
  n699b6a17["lean-receipt.json#47<br/><code>699b6a17</code>"]
  n57dd3c1d["lean-receipt.json#48<br/><code>57dd3c1d</code>"]
  n944940d9["lean-receipt.json#49<br/><code>944940d9</code>"]
  n1e34b89d["lean-receipt.json#50<br/><code>1e34b89d</code>"]
  nc9a9307f["lean-receipt.json#51<br/><code>c9a9307f</code>"]
  nd47498e2["lean-receipt.json#52<br/><code>d47498e2</code>"]
  n0181f929["lean-receipt.json#53<br/><code>0181f929</code>"]
  ne3fb9b8a["lean-receipt.json#54<br/><code>e3fb9b8a</code>"]
  n9924da12["lean-receipt.json#55<br/><code>9924da12</code>"]
  n3a24b350["lean-receipt.json#56<br/><code>3a24b350</code>"]
  n7eeb088f["lean-receipt.json#57<br/><code>7eeb088f</code>"]
  n7778587e["lean-receipt.json#58<br/><code>7778587e</code>"]
  nca1fd48a["lean-receipt.json#59<br/><code>ca1fd48a</code>"]
  nbd24e85d["lean-receipt.json#60<br/><code>bd24e85d</code>"]
  nc74a6ae7["lean-receipt.json#61<br/><code>c74a6ae7</code>"]
  n5d29dfc3["lean-receipt.json#62<br/><code>5d29dfc3</code>"]
  n6a6a09c0["lean-receipt.json#63<br/><code>6a6a09c0</code>"]
  na93181dd["lean-receipt.json#64<br/><code>a93181dd</code>"]
  n12ca26a2["lean-receipt.json#65<br/><code>12ca26a2</code>"]
  n2f241438["lean-receipt.json#66<br/><code>2f241438</code>"]
  n2a333cdd["lean-receipt.json#67<br/><code>2a333cdd</code>"]
  n6d8c8fdb["lean-receipt.json#68<br/><code>6d8c8fdb</code>"]
  n1e9b1c82["lean-receipt.json#69<br/><code>1e9b1c82</code>"]
  nf2fe07fe["lean-receipt.json#70<br/><code>f2fe07fe</code>"]
  n0cade781["lean-receipt.json#71<br/><code>0cade781</code>"]
  nf6a0dc6c["lean-receipt.json#72<br/><code>f6a0dc6c</code>"]
  n76f963cb["lean-receipt.json#73<br/><code>76f963cb</code>"]
  n38d7e379["lean-receipt.json#74<br/><code>38d7e379</code>"]
  n02c580b9["lean-receipt.json#75<br/><code>02c580b9</code>"]
  ndf98e113["lean-receipt.json#76<br/><code>df98e113</code>"]
  nae13249b["lean-receipt.json#77<br/><code>ae13249b</code>"]
  n220576d3["lean-receipt.json#78<br/><code>220576d3</code>"]
  n72e2dbc5["lean-receipt.json#79<br/><code>72e2dbc5</code>"]
  n8c62cd50["lean-receipt.json#80<br/><code>8c62cd50</code>"]
  nef94a2ed["lean-receipt.json#81<br/><code>ef94a2ed</code>"]
  nbbaf7a56["lean-receipt.json#82<br/><code>bbaf7a56</code>"]
  na85ec869["lean-receipt.json#83<br/><code>a85ec869</code>"]
  n7f95a32f["lean-receipt.json#84<br/><code>7f95a32f</code>"]
  n5ceb8d82["lean-receipt.json#85<br/><code>5ceb8d82</code>"]
  n32335fb5["lean-receipt.json#86<br/><code>32335fb5</code>"]
  n5ee5b447["lean-receipt.json#87<br/><code>5ee5b447</code>"]
  n42445ffa["lean-receipt.json#88<br/><code>42445ffa</code>"]
  nf0061d7c["lean-receipt.json#89<br/><code>f0061d7c</code>"]
  nad2e0d4f["lean-receipt.json#90<br/><code>ad2e0d4f</code>"]
  n8afc32bc["lean-receipt.json#91<br/><code>8afc32bc</code>"]
  n955cbcea["lean-receipt.json#92<br/><code>955cbcea</code>"]
  n323f20bb["lean-receipt.json#93<br/><code>323f20bb</code>"]
  n7635bb19["lean-receipt.json#94<br/><code>7635bb19</code>"]
  n5cb0ebae["lean-receipt.json#95<br/><code>5cb0ebae</code>"]
  n9bd66712["lean-receipt.json#96<br/><code>9bd66712</code>"]
  ncdd19e3a["lean-receipt.json#97<br/><code>cdd19e3a</code>"]
  n7bd168b9["lean-receipt.json#98<br/><code>7bd168b9</code>"]
  n40ec85b9["lean-receipt.json#99<br/><code>40ec85b9</code>"]
  ne199d3ef["lean-receipt.json#100<br/><code>e199d3ef</code>"]
  n7a4733b8["lean-receipt.json#101<br/><code>7a4733b8</code>"]
  nba88a222["lean-receipt.json#102<br/><code>ba88a222</code>"]
  n9b7d31bd["lean-receipt.json#103<br/><code>9b7d31bd</code>"]
  n8cbdcc25["lean-receipt.json#104<br/><code>8cbdcc25</code>"]
  n66e520ad["lean-receipt.json#105<br/><code>66e520ad</code>"]
  nd99a9579["lean-receipt.json#106<br/><code>d99a9579</code>"]
  nd84e8722["lean-receipt.json#107<br/><code>d84e8722</code>"]
  nb1334502["lean-receipt.json#108<br/><code>b1334502</code>"]
  na38248b8["lean-receipt.json#109<br/><code>a38248b8</code>"]
  n258c2a05["lean-receipt.json#110<br/><code>258c2a05</code>"]
  ne9749e20["lean-receipt.json#111<br/><code>e9749e20</code>"]
  n6315e7b1["lean-receipt.json#112<br/><code>6315e7b1</code>"]
  nbde33cbd["lean-receipt.json#113<br/><code>bde33cbd</code>"]
  nd3b03c24["lean-receipt.json#114<br/><code>d3b03c24</code>"]
  n3e6aa242["lean-receipt.json#115<br/><code>3e6aa242</code>"]
  n1f50a701["lean-receipt.json#116<br/><code>1f50a701</code>"]
  n319c5d11["lean-receipt.json#117<br/><code>319c5d11</code>"]
  nae2e1e8c["lean-receipt.json#118<br/><code>ae2e1e8c</code>"]
  n0147757d["lean-receipt.json#119<br/><code>0147757d</code>"]
  nae014cbf["lean-receipt.json#120<br/><code>ae014cbf</code>"]
  nf8849b9a["lean-receipt.json#121<br/><code>f8849b9a</code>"]
  n598b4558["lean-receipt.json#122<br/><code>598b4558</code>"]
  n5ba952f3["lean-receipt.json#123<br/><code>5ba952f3</code>"]
  n4feb0122["payload-cf-receipt.json<br/><code>4feb0122</code>"]
  n60dfd82b["percall-receipt.json<br/><code>60dfd82b</code>"]
  nb3fe23b3["refusals-receipt.json<br/><code>b3fe23b3</code>"]
  n1a07c473["test-receipt.json<br/><code>1a07c473</code>"]
  nba9a6d47["test-receipt.json#0<br/><code>ba9a6d47</code>"]
  n309d7358["test-receipt.json#1<br/><code>309d7358</code>"]
  n5ffb258f["test-receipt.json#2<br/><code>5ffb258f</code>"]
  n3a9dafe0["test-receipt.json#3<br/><code>3a9dafe0</code>"]
  ndbb68e9b["test-receipt.json#4<br/><code>dbb68e9b</code>"]
  n42ee9187["test-receipt.json#5<br/><code>42ee9187</code>"]
  nf08aabe7["test-receipt.json#6<br/><code>f08aabe7</code>"]
  nb0a99080["test-receipt.json#7<br/><code>b0a99080</code>"]
  n126d8ee9["test-receipt.json#8<br/><code>126d8ee9</code>"]
  nd931fd45["test-receipt.json#9<br/><code>d931fd45</code>"]
  nbccabe4a["test-receipt.json#10<br/><code>bccabe4a</code>"]
  nc378bafb["walls-receipt.json<br/><code>c378bafb</code>"]
  ndf116fb4["readme<br/><code>df116fb4</code>"]
  nf9cebb72 --> nc6a8b61c
  nc6a8b61c --> n144f8e0d
  nc6a8b61c --> nf1ebdb3a
  nc6a8b61c --> n93f1f81c
  nc6a8b61c --> n52fa905b
  nc6a8b61c --> n836f09ac
  nc6a8b61c --> n96b9ff4c
  nc6a8b61c --> n05e765a5
  nc6a8b61c --> ne6d4f149
  nc6a8b61c --> n1749bf07
  nc6a8b61c --> nbe2cdb99
  nc6a8b61c --> nff4fae3c
  nc6a8b61c --> n3295f3a8
  nc6a8b61c --> n2ab14222
  nc6a8b61c --> n3fced43d
  nc6a8b61c --> nb779dfc4
  nc6a8b61c --> ne8374523
  nc6a8b61c --> n2595dfc6
  nc6a8b61c --> ne7e769f7
  nc6a8b61c --> n734848a0
  nc6a8b61c --> n03ac1e4e
  nc6a8b61c --> n73e63ce9
  nc6a8b61c --> ne1e840f9
  nc6a8b61c --> nd6859e04
  nc6a8b61c --> ne8f0ec1e
  nc6a8b61c --> nc5876e7c
  nc6a8b61c --> n8689951d
  nc6a8b61c --> n0ee7644a
  nc6a8b61c --> nd3505b72
  nc6a8b61c --> nf8411b76
  nc6a8b61c --> nfed25c11
  nf9cebb72 --> na8e2dd5f
  nf9cebb72 --> n90acc254
  n90acc254 --> n57347359
  n90acc254 --> n690a5e74
  n90acc254 --> nd6de0bec
  n90acc254 --> n5b9df424
  n90acc254 --> n92ea6c4a
  n90acc254 --> nc9186bac
  n90acc254 --> neaf29d35
  n90acc254 --> nb3717bbe
  n90acc254 --> n35216eab
  n90acc254 --> n9c823d2e
  n90acc254 --> n1325d1c5
  n90acc254 --> n3cc63d28
  n90acc254 --> n628bc269
  n90acc254 --> n22683737
  n90acc254 --> na3ff24de
  n90acc254 --> n6409a32f
  n90acc254 --> ne1478d97
  n90acc254 --> nc91ceb3e
  n90acc254 --> n1a2de23c
  n90acc254 --> n0451b6a7
  n90acc254 --> n56ae8bd4
  n90acc254 --> nf50ff3bf
  n90acc254 --> n5a5a4da7
  n90acc254 --> n2976e5ca
  n90acc254 --> nb71d41f1
  n90acc254 --> ne9d54f13
  n90acc254 --> n8baec31e
  n90acc254 --> n1c3b0856
  n90acc254 --> n89f1bf7a
  n90acc254 --> nb80df67f
  n90acc254 --> n3a2230d9
  n90acc254 --> n120f9364
  n90acc254 --> n85b0ec0a
  n90acc254 --> nb9f98b20
  n90acc254 --> n6cfaaca7
  n90acc254 --> n2fe4c765
  n90acc254 --> n479b8453
  n90acc254 --> n18428db3
  n90acc254 --> n0954e86c
  n90acc254 --> n05e0d490
  n90acc254 --> nf34795ae
  n90acc254 --> n92e2748e
  n90acc254 --> n848ef947
  n90acc254 --> n8d2f60e3
  n90acc254 --> n24d98cd4
  n90acc254 --> nd45f4b89
  n90acc254 --> ndb1d0981
  n90acc254 --> n910ebbd1
  n90acc254 --> n2637d38b
  n90acc254 --> n04402930
  n90acc254 --> nd7e633a1
  n90acc254 --> n7c32a36a
  n90acc254 --> n9b69a3e4
  n90acc254 --> n4c61af52
  n90acc254 --> nc24411e4
  n90acc254 --> n4825fdaf
  n90acc254 --> n4e175c58
  n90acc254 --> n4e3af939
  n90acc254 --> nc7dd3182
  n90acc254 --> nb596b8d3
  n90acc254 --> n6d01957c
  n90acc254 --> n80256a31
  n90acc254 --> nbbeb6976
  n90acc254 --> n332988e7
  n90acc254 --> n1eb00b50
  n90acc254 --> nf07d6dc9
  n90acc254 --> n0f15a78a
  n90acc254 --> ne8c6c068
  n90acc254 --> n73f98772
  n90acc254 --> nd8293b5f
  n90acc254 --> n16eed20e
  n90acc254 --> n67eafa78
  n90acc254 --> n3fc0e119
  n90acc254 --> n07864dfc
  n90acc254 --> ne7332290
  n90acc254 --> nf5213ae6
  n90acc254 --> nb66e342c
  n90acc254 --> n063d6665
  n90acc254 --> n0f6b4e0e
  n90acc254 --> n3e3ac22f
  n90acc254 --> n02754db9
  n90acc254 --> nc32d3894
  n90acc254 --> n3e03b7cf
  n90acc254 --> nfbacbcf9
  n90acc254 --> n6ce54299
  nf9cebb72 --> n7e64e1ad
  nf9cebb72 --> nf2bcd634
  nf2bcd634 --> ncf31f329
  nf2bcd634 --> n7164514a
  nf2bcd634 --> nf8b97c0a
  nf2bcd634 --> na0c9613d
  nf2bcd634 --> n01ed5d58
  nf2bcd634 --> n3cf0a131
  nf2bcd634 --> n4a8f2821
  nf2bcd634 --> n3f92236b
  nf2bcd634 --> nff873da5
  nf2bcd634 --> n31c422f3
  nf2bcd634 --> nb4850d94
  nf2bcd634 --> nfa25cef3
  nf2bcd634 --> n97585d92
  nf2bcd634 --> ne8aae182
  nf2bcd634 --> n32d669b5
  nf2bcd634 --> n49b80ea9
  nf2bcd634 --> n01b90ac3
  nf2bcd634 --> nb47ffb72
  nf2bcd634 --> n3d64703f
  nf2bcd634 --> na6069f9b
  nf2bcd634 --> nb65c3f9e
  nf2bcd634 --> n43de016b
  nf2bcd634 --> n4f5ac523
  nf2bcd634 --> na3b943d8
  nf2bcd634 --> n74cb03f2
  nf2bcd634 --> nfa5b3ad6
  nf2bcd634 --> nb9bcda6a
  nf2bcd634 --> nd365f8a7
  nf2bcd634 --> nd2ad5596
  nf2bcd634 --> n2f0aaa06
  nf2bcd634 --> na4d705b8
  nf2bcd634 --> nbddfbe49
  nf2bcd634 --> n155f1ba2
  nf2bcd634 --> n12949df1
  nf2bcd634 --> ned8cc233
  nf2bcd634 --> ndb26a6bb
  nf2bcd634 --> nfa685b23
  nf2bcd634 --> n80941865
  nf2bcd634 --> n86dd73be
  nf2bcd634 --> n290c96b3
  nf2bcd634 --> n14a560ed
  nf2bcd634 --> n4206b774
  nf2bcd634 --> n5953aff2
  nf2bcd634 --> n3adae609
  nf2bcd634 --> ndc4fcd8f
  nf2bcd634 --> nbc4b6821
  nf2bcd634 --> nb36d9802
  nf2bcd634 --> n3daa9db0
  nf2bcd634 --> n9d612907
  nf2bcd634 --> n977f4d21
  nf2bcd634 --> nd8a44984
  nf2bcd634 --> n7ff796d5
  nf2bcd634 --> ndbf0dcc4
  nf2bcd634 --> n64132140
  nf2bcd634 --> nec109888
  nf2bcd634 --> nb9c4b6ee
  nf2bcd634 --> n3282e5a8
  nf2bcd634 --> n5ddec5b9
  nf2bcd634 --> n199724c6
  nf2bcd634 --> n0db331c9
  nf2bcd634 --> n5357bd1c
  nf2bcd634 --> n4b72f19a
  nf2bcd634 --> n8ca9dca2
  nf2bcd634 --> n1bd28bbf
  nf2bcd634 --> naf2529fb
  nf2bcd634 --> n2f1f17f0
  nf2bcd634 --> nfd0838a3
  nf2bcd634 --> n20b53df2
  nf2bcd634 --> n29463506
  nf2bcd634 --> n2ddac3b3
  nf2bcd634 --> n8adb6a39
  nf2bcd634 --> n0c83691e
  nf2bcd634 --> nee26da7b
  nf2bcd634 --> nf39e6293
  nf2bcd634 --> nafdd3309
  nf2bcd634 --> nba5fff83
  nf2bcd634 --> n4bb9c148
  nf2bcd634 --> nb7bfda60
  nf2bcd634 --> n50b43669
  nf9cebb72 --> n0456dfbc
  nf9cebb72 --> n2f2b1ade
  nf9cebb72 --> nbce42eb5
  nbce42eb5 --> nc2407a8c
  nbce42eb5 --> n6861c52b
  nbce42eb5 --> n183c3544
  nbce42eb5 --> ne97b3dea
  nbce42eb5 --> n5c159dd9
  nbce42eb5 --> n8ec0b683
  nbce42eb5 --> nafeaeae2
  nbce42eb5 --> n803a23e9
  nbce42eb5 --> ne1647e5c
  nbce42eb5 --> neddf7cd0
  nbce42eb5 --> n33015af2
  nbce42eb5 --> na4cf0685
  nbce42eb5 --> n2431bbf2
  nbce42eb5 --> n1c9a7e83
  nbce42eb5 --> n73154e92
  nbce42eb5 --> nd4f6a5a7
  nbce42eb5 --> n14b21b35
  nbce42eb5 --> nafe5ba15
  nbce42eb5 --> ncd99be32
  nbce42eb5 --> n83e62925
  nbce42eb5 --> n00caae3c
  nbce42eb5 --> na0e11465
  nbce42eb5 --> nd3ac9b62
  nbce42eb5 --> n5be674a3
  nbce42eb5 --> n1b1b3a0a
  nbce42eb5 --> nc230cd7c
  nbce42eb5 --> n180ebbea
  nbce42eb5 --> ncfb00fca
  nbce42eb5 --> na38cb598
  nbce42eb5 --> n3cb3b347
  nbce42eb5 --> nf2e4e390
  nbce42eb5 --> n4954f0de
  nbce42eb5 --> nf670516c
  nbce42eb5 --> nff34d7f3
  nbce42eb5 --> n7aabf96a
  nbce42eb5 --> n2712e240
  nbce42eb5 --> n349a4386
  nbce42eb5 --> n630055f5
  nbce42eb5 --> nf99d45fb
  nbce42eb5 --> n32826cea
  nbce42eb5 --> n91aa90f9
  nbce42eb5 --> n4efc8f5c
  nbce42eb5 --> n805a9394
  nbce42eb5 --> ne340379e
  nbce42eb5 --> nce001eb5
  nbce42eb5 --> n483e0818
  nbce42eb5 --> n8235ed60
  nbce42eb5 --> n699b6a17
  nbce42eb5 --> n57dd3c1d
  nbce42eb5 --> n944940d9
  nbce42eb5 --> n1e34b89d
  nbce42eb5 --> nc9a9307f
  nbce42eb5 --> nd47498e2
  nbce42eb5 --> n0181f929
  nbce42eb5 --> ne3fb9b8a
  nbce42eb5 --> n9924da12
  nbce42eb5 --> n3a24b350
  nbce42eb5 --> n7eeb088f
  nbce42eb5 --> n7778587e
  nbce42eb5 --> nca1fd48a
  nbce42eb5 --> nbd24e85d
  nbce42eb5 --> nc74a6ae7
  nbce42eb5 --> n5d29dfc3
  nbce42eb5 --> n6a6a09c0
  nbce42eb5 --> na93181dd
  nbce42eb5 --> n12ca26a2
  nbce42eb5 --> n2f241438
  nbce42eb5 --> n2a333cdd
  nbce42eb5 --> n6d8c8fdb
  nbce42eb5 --> n1e9b1c82
  nbce42eb5 --> nf2fe07fe
  nbce42eb5 --> n0cade781
  nbce42eb5 --> nf6a0dc6c
  nbce42eb5 --> n76f963cb
  nbce42eb5 --> n38d7e379
  nbce42eb5 --> n02c580b9
  nbce42eb5 --> ndf98e113
  nbce42eb5 --> nae13249b
  nbce42eb5 --> n220576d3
  nbce42eb5 --> n72e2dbc5
  nbce42eb5 --> n8c62cd50
  nbce42eb5 --> nef94a2ed
  nbce42eb5 --> nbbaf7a56
  nbce42eb5 --> na85ec869
  nbce42eb5 --> n7f95a32f
  nbce42eb5 --> n5ceb8d82
  nbce42eb5 --> n32335fb5
  nbce42eb5 --> n5ee5b447
  nbce42eb5 --> n42445ffa
  nbce42eb5 --> nf0061d7c
  nbce42eb5 --> nad2e0d4f
  nbce42eb5 --> n8afc32bc
  nbce42eb5 --> n955cbcea
  nbce42eb5 --> n323f20bb
  nbce42eb5 --> n7635bb19
  nbce42eb5 --> n5cb0ebae
  nbce42eb5 --> n9bd66712
  nbce42eb5 --> ncdd19e3a
  nbce42eb5 --> n7bd168b9
  nbce42eb5 --> n40ec85b9
  nbce42eb5 --> ne199d3ef
  nbce42eb5 --> n7a4733b8
  nbce42eb5 --> nba88a222
  nbce42eb5 --> n9b7d31bd
  nbce42eb5 --> n8cbdcc25
  nbce42eb5 --> n66e520ad
  nbce42eb5 --> nd99a9579
  nbce42eb5 --> nd84e8722
  nbce42eb5 --> nb1334502
  nbce42eb5 --> na38248b8
  nbce42eb5 --> n258c2a05
  nbce42eb5 --> ne9749e20
  nbce42eb5 --> n6315e7b1
  nbce42eb5 --> nbde33cbd
  nbce42eb5 --> nd3b03c24
  nbce42eb5 --> n3e6aa242
  nbce42eb5 --> n1f50a701
  nbce42eb5 --> n319c5d11
  nbce42eb5 --> nae2e1e8c
  nbce42eb5 --> n0147757d
  nbce42eb5 --> nae014cbf
  nbce42eb5 --> nf8849b9a
  nbce42eb5 --> n598b4558
  nbce42eb5 --> n5ba952f3
  nf9cebb72 --> n4feb0122
  nf9cebb72 --> n60dfd82b
  nf9cebb72 --> nb3fe23b3
  nf9cebb72 --> n1a07c473
  n1a07c473 --> nba9a6d47
  n1a07c473 --> n309d7358
  n1a07c473 --> n5ffb258f
  n1a07c473 --> n3a9dafe0
  n1a07c473 --> ndbb68e9b
  n1a07c473 --> n42ee9187
  n1a07c473 --> nf08aabe7
  n1a07c473 --> nb0a99080
  n1a07c473 --> n126d8ee9
  n1a07c473 --> nd931fd45
  n1a07c473 --> nbccabe4a
  nf9cebb72 --> nc378bafb
  nf9cebb72 --> ndf116fb4
```

| node | receipt uuid | referrer | payload fold | seq |
|---|---|---|---|---|
| root | `f9cebb72-8cc7-8d3f-b0f6-3bea3aad4595` | `fb90a6f4` | `9cde4bf627d35eab` | 0 |
| cross-receipt.json | `c6a8b61c-0a2d-8340-a144-60fc29ec49c5` | `f9cebb72` | `32e33b4efc02552d` | 1 |
| cross-receipt.json#0 | `144f8e0d-5bb1-8baf-8df9-6af8d79e9b40` | `c6a8b61c` | `1dfb50c09d3ec562` | 2 |
| cross-receipt.json#1 | `f1ebdb3a-eb97-82bd-b22b-96a117a5adbb` | `c6a8b61c` | `71cd4b0253241eba` | 3 |
| cross-receipt.json#2 | `93f1f81c-4652-8130-91db-ac251a6982a1` | `c6a8b61c` | `d395906a7c1ca3bd` | 4 |
| cross-receipt.json#3 | `52fa905b-240a-838c-a585-51a58c202090` | `c6a8b61c` | `6d6d0a981d52ac76` | 5 |
| cross-receipt.json#4 | `836f09ac-c3b4-807f-a02f-22165131873c` | `c6a8b61c` | `3206e3e260b0bda7` | 6 |
| cross-receipt.json#5 | `96b9ff4c-9938-83fa-80ef-bf0750b69dda` | `c6a8b61c` | `15acf0a0cff5c260` | 7 |
| cross-receipt.json#6 | `05e765a5-cc37-8282-bd7f-62e8e0c918a4` | `c6a8b61c` | `15196e19197c8657` | 8 |
| cross-receipt.json#7 | `e6d4f149-12d0-859c-9a6b-8df4485dcbfe` | `c6a8b61c` | `c63f9497ab57fde9` | 9 |
| cross-receipt.json#8 | `1749bf07-4742-864b-9736-78838c2ac07b` | `c6a8b61c` | `e153a0b9425f5a0a` | 10 |
| cross-receipt.json#9 | `be2cdb99-dd66-81c1-9045-967345179f43` | `c6a8b61c` | `da63fe824b42d3b9` | 11 |
| cross-receipt.json#10 | `ff4fae3c-780b-89ea-bff7-3386d3e6f28a` | `c6a8b61c` | `30617b9216899d69` | 12 |
| cross-receipt.json#11 | `3295f3a8-a08e-85f4-95b2-0ff2276a9328` | `c6a8b61c` | `e5d9a81caa284bd2` | 13 |
| cross-receipt.json#12 | `2ab14222-2c55-8648-bdc4-76441432f24c` | `c6a8b61c` | `c926f909137e13ea` | 14 |
| cross-receipt.json#13 | `3fced43d-b1b0-8a10-a6eb-ea29ac57d99a` | `c6a8b61c` | `970496b026f43786` | 15 |
| cross-receipt.json#14 | `b779dfc4-f7e3-8841-b748-a1a3770a62aa` | `c6a8b61c` | `eddfd8ec84208444` | 16 |
| cross-receipt.json#15 | `e8374523-aed2-8770-ad44-3202612debe6` | `c6a8b61c` | `c635847ade052b98` | 17 |
| cross-receipt.json#16 | `2595dfc6-3f5d-8444-9b35-95d6e8b4c622` | `c6a8b61c` | `e73fd7a6d186d5b9` | 18 |
| cross-receipt.json#17 | `e7e769f7-4d80-8d5b-b98f-83ee5b61ea40` | `c6a8b61c` | `488374c9d21d1916` | 19 |
| cross-receipt.json#18 | `734848a0-0237-8c1b-bf3a-592aeb7e5c11` | `c6a8b61c` | `5a3a20319bd79246` | 20 |
| cross-receipt.json#19 | `03ac1e4e-6914-855e-913c-e5681e8cbd5b` | `c6a8b61c` | `9722a986196949c6` | 21 |
| cross-receipt.json#20 | `73e63ce9-caf1-85e2-aa61-64ad14bbb66f` | `c6a8b61c` | `91ee2fdc046a71f2` | 22 |
| cross-receipt.json#21 | `e1e840f9-60b7-83ba-ac0e-ad4963307840` | `c6a8b61c` | `5464a03fab9710c1` | 23 |
| cross-receipt.json#22 | `d6859e04-e920-88be-81cc-e0d75e322a6e` | `c6a8b61c` | `7ef706f14b351d5e` | 24 |
| cross-receipt.json#23 | `e8f0ec1e-edbb-8681-9f6d-0ca2a2422611` | `c6a8b61c` | `38fbb18b1e27788c` | 25 |
| cross-receipt.json#24 | `c5876e7c-fb64-869f-8a47-f1c87829f229` | `c6a8b61c` | `740b3c309e28316f` | 26 |
| cross-receipt.json#25 | `8689951d-b5ad-82cd-aeac-18ced821cc7c` | `c6a8b61c` | `e90b89ce056c1a01` | 27 |
| cross-receipt.json#26 | `0ee7644a-0a07-8d14-b332-39d21258f0a8` | `c6a8b61c` | `f1e15ae62cdf1e35` | 28 |
| cross-receipt.json#27 | `d3505b72-5f8f-8161-bcd8-d1b56e677ed1` | `c6a8b61c` | `d1ffa93bf956431e` | 29 |
| cross-receipt.json#28 | `f8411b76-9ef7-87ca-9a05-e665ef97968e` | `c6a8b61c` | `d5266feaca6b7beb` | 30 |
| cross-receipt.json#29 | `fed25c11-4395-8232-bc88-9200b99ad446` | `c6a8b61c` | `960c32a22f42e091` | 31 |
| debts-receipt.json | `a8e2dd5f-8789-88da-816d-464ac10f196d` | `f9cebb72` | `ddb0d39a20dd9254` | 32 |
| discovery-receipt.json | `90acc254-55ef-864b-93d0-1cc403bf1b20` | `f9cebb72` | `ef3b7ecd1a2328e1` | 33 |
| discovery-receipt.json#0 | `57347359-8352-801e-bac6-a93e81da7a81` | `90acc254` | `059f184ab19ce618` | 34 |
| discovery-receipt.json#1 | `690a5e74-82c2-855d-8048-21a868e450e7` | `90acc254` | `f6e41e53fdaed685` | 35 |
| discovery-receipt.json#2 | `d6de0bec-f54a-8f9d-9f7c-4e062e490dfc` | `90acc254` | `e0bc4e1a15bccd00` | 36 |
| discovery-receipt.json#3 | `5b9df424-9cb1-8ddd-9c0b-0b3f112d1a1f` | `90acc254` | `44821011871adee6` | 37 |
| discovery-receipt.json#4 | `92ea6c4a-3915-8411-8a5f-ca4158cc6326` | `90acc254` | `a9965439b7970c67` | 38 |
| discovery-receipt.json#5 | `c9186bac-a16d-8fa4-aec5-71e1d4a97bce` | `90acc254` | `d1543651eba9c240` | 39 |
| discovery-receipt.json#6 | `eaf29d35-45c9-88f2-b302-431ab3220777` | `90acc254` | `3f69de3552a3f47b` | 40 |
| discovery-receipt.json#7 | `b3717bbe-522b-8a35-bc7c-68191064188c` | `90acc254` | `aad6ceb779b49503` | 41 |
| discovery-receipt.json#8 | `35216eab-16d2-8cf5-9095-7414d79d837b` | `90acc254` | `79d626414fa6dd42` | 42 |
| discovery-receipt.json#9 | `9c823d2e-dde8-8710-9e56-d4610233f566` | `90acc254` | `6650cb5622bb7cb5` | 43 |
| discovery-receipt.json#10 | `1325d1c5-d92b-8e2a-a2fd-386b618abd3d` | `90acc254` | `68177d3b0609aaba` | 44 |
| discovery-receipt.json#11 | `3cc63d28-88d2-848f-8bfb-9bd34dcecc2c` | `90acc254` | `c5bc3905e716385c` | 45 |
| discovery-receipt.json#12 | `628bc269-9359-8179-bba2-2cef2e7643b4` | `90acc254` | `8413f7cceac49e88` | 46 |
| discovery-receipt.json#13 | `22683737-052e-85f1-9315-186b5d0b38ba` | `90acc254` | `f68cb911f238f2d4` | 47 |
| discovery-receipt.json#14 | `a3ff24de-d5c0-84e5-8992-9f2a09ce363c` | `90acc254` | `e6152b74f987b70a` | 48 |
| discovery-receipt.json#15 | `6409a32f-a20d-8562-957b-ff8115efdd99` | `90acc254` | `9e4d9a63b1f4c6d5` | 49 |
| discovery-receipt.json#16 | `e1478d97-b8f0-84fd-baca-b34123d28fd3` | `90acc254` | `66580fac2910536d` | 50 |
| discovery-receipt.json#17 | `c91ceb3e-69d2-8dbe-bff2-0d33f5c83fe4` | `90acc254` | `d09596c73a7d4940` | 51 |
| discovery-receipt.json#18 | `1a2de23c-95e8-8e0a-bda7-509faf525004` | `90acc254` | `65542b92538f70bf` | 52 |
| discovery-receipt.json#19 | `0451b6a7-2af9-8ddc-be29-d97e82231601` | `90acc254` | `0ea7ee8a4bcf4703` | 53 |
| discovery-receipt.json#20 | `56ae8bd4-d881-88bf-acc9-88b050314711` | `90acc254` | `e31718a037c53d12` | 54 |
| discovery-receipt.json#21 | `f50ff3bf-47ba-8b6c-8611-f8133d86fdd5` | `90acc254` | `c77b1581fd13e48e` | 55 |
| discovery-receipt.json#22 | `5a5a4da7-74dc-84bd-8b4c-74f1a44a9ba9` | `90acc254` | `92c291343b328db2` | 56 |
| discovery-receipt.json#23 | `2976e5ca-b132-8a9a-9109-2dad9ea97444` | `90acc254` | `b5232ea609523659` | 57 |
| discovery-receipt.json#24 | `b71d41f1-1fae-827b-b2df-817d92a3ef4d` | `90acc254` | `c39ee7b68e0f9600` | 58 |
| discovery-receipt.json#25 | `e9d54f13-0e56-89f0-8675-df6519fbf46c` | `90acc254` | `163dbe23b9c4a0e2` | 59 |
| discovery-receipt.json#26 | `8baec31e-2828-8a4c-b039-7b0651250bf2` | `90acc254` | `98b58baec3a17438` | 60 |
| discovery-receipt.json#27 | `1c3b0856-0c99-888a-b734-49a1e01aabcc` | `90acc254` | `d5b62e9563453468` | 61 |
| discovery-receipt.json#28 | `89f1bf7a-1813-85c5-b5ad-7b5052d8fc89` | `90acc254` | `bb2da3e85cb85ea2` | 62 |
| discovery-receipt.json#29 | `b80df67f-aff9-8e5f-a20a-9c684e0ef65d` | `90acc254` | `7239bb7980d8dfa1` | 63 |
| discovery-receipt.json#30 | `3a2230d9-b16d-829b-8984-f8fcb1de42c0` | `90acc254` | `e88b0d632c48e663` | 64 |
| discovery-receipt.json#31 | `120f9364-008e-88de-8828-19af9345ba10` | `90acc254` | `eda20c6817a03e09` | 65 |
| discovery-receipt.json#32 | `85b0ec0a-ee94-81ea-8ba5-753632400795` | `90acc254` | `f6ceb164b2812f53` | 66 |
| discovery-receipt.json#33 | `b9f98b20-e298-8102-8521-20fa49eb6445` | `90acc254` | `177ddd6319beffb1` | 67 |
| discovery-receipt.json#34 | `6cfaaca7-7213-8afb-8631-9d2810824d8a` | `90acc254` | `a1504a5f8b86c6cf` | 68 |
| discovery-receipt.json#35 | `2fe4c765-0f62-8e0d-b89a-74e5ddef72b8` | `90acc254` | `90f78ec8ca1a9521` | 69 |
| discovery-receipt.json#36 | `479b8453-2d19-8ac6-b76c-344468c19e5f` | `90acc254` | `4114417a9188836f` | 70 |
| discovery-receipt.json#37 | `18428db3-9819-8cde-8f62-0a3cf19a5cbd` | `90acc254` | `1a0bf175bf1ef069` | 71 |
| discovery-receipt.json#38 | `0954e86c-dc6f-8523-ad21-b516307784fe` | `90acc254` | `078f89ef6f5ff3d7` | 72 |
| discovery-receipt.json#39 | `05e0d490-538c-848b-af6d-b4faa767a7ce` | `90acc254` | `446425367fea6d00` | 73 |
| discovery-receipt.json#40 | `f34795ae-d0aa-89d3-aa07-29135e2391f9` | `90acc254` | `8b5c73b26c792b53` | 74 |
| discovery-receipt.json#41 | `92e2748e-a90a-8d3e-a439-f940a5ced3d6` | `90acc254` | `5101618ad50cc50c` | 75 |
| discovery-receipt.json#42 | `848ef947-767d-8a2f-bcec-c12f34d29511` | `90acc254` | `bdbe7a5ea9f686e4` | 76 |
| discovery-receipt.json#43 | `8d2f60e3-ff4e-81b7-bf2c-4ade559a8a2f` | `90acc254` | `0d09b9b0659a4c14` | 77 |
| discovery-receipt.json#44 | `24d98cd4-1478-8c7c-9a68-e8cf8094b288` | `90acc254` | `22540b1705287605` | 78 |
| discovery-receipt.json#45 | `d45f4b89-dbb8-82c1-a1a3-9328c2cf2b2e` | `90acc254` | `6f584b29a417e95d` | 79 |
| discovery-receipt.json#46 | `db1d0981-c23e-8538-98d8-8d9b2fbe4272` | `90acc254` | `a62c6574887f02f7` | 80 |
| discovery-receipt.json#47 | `910ebbd1-9e53-8ed1-abfa-1998ad6a8d33` | `90acc254` | `f026925e7414736b` | 81 |
| discovery-receipt.json#48 | `2637d38b-b881-8599-81fa-0aaced3ab9e3` | `90acc254` | `e0d9bc65b0e2c530` | 82 |
| discovery-receipt.json#49 | `04402930-8daa-856d-9f75-1390bafd7a8c` | `90acc254` | `9275ae235efc6f82` | 83 |
| discovery-receipt.json#50 | `d7e633a1-f6fa-8795-b22f-984c37086d38` | `90acc254` | `1afe85d2252b34d3` | 84 |
| discovery-receipt.json#51 | `7c32a36a-eff4-838a-b233-6838aba0c129` | `90acc254` | `f9d446bee8bcfe3f` | 85 |
| discovery-receipt.json#52 | `9b69a3e4-1f0c-81ff-8874-4986b51d3e8e` | `90acc254` | `b4107a5cb73a87e7` | 86 |
| discovery-receipt.json#53 | `4c61af52-8c59-85b0-b740-c291ebe3f749` | `90acc254` | `d4b0d270b22616b4` | 87 |
| discovery-receipt.json#54 | `c24411e4-e508-8ce6-8cc0-ef72da0b5017` | `90acc254` | `9aba016238f106a7` | 88 |
| discovery-receipt.json#55 | `4825fdaf-6383-8522-bad6-85b36c842520` | `90acc254` | `86d3c0788ab1df66` | 89 |
| discovery-receipt.json#56 | `4e175c58-a5ae-8dc5-8c52-8c5fe66542d1` | `90acc254` | `b052ab186884165f` | 90 |
| discovery-receipt.json#57 | `4e3af939-c8e7-8f92-b271-ead6259aefca` | `90acc254` | `57c0fc50704e7eb7` | 91 |
| discovery-receipt.json#58 | `c7dd3182-7d4c-818a-893f-46c47142ebd5` | `90acc254` | `4d8b2980b3f01d8f` | 92 |
| discovery-receipt.json#59 | `b596b8d3-3e3f-8b84-bee0-0d172ea48eea` | `90acc254` | `bf3f0e066bd57846` | 93 |
| discovery-receipt.json#60 | `6d01957c-669a-80a4-b672-6f19bba61afa` | `90acc254` | `3021929170ffbca6` | 94 |
| discovery-receipt.json#61 | `80256a31-3724-86d7-a801-44e126731f6b` | `90acc254` | `b38f81840d49667e` | 95 |
| discovery-receipt.json#62 | `bbeb6976-d11f-8397-8d96-0b7b4285449a` | `90acc254` | `38eeecbfca23cc5a` | 96 |
| discovery-receipt.json#63 | `332988e7-d3dc-8fbd-8976-8fb2a34dec3e` | `90acc254` | `1eae849e96456e3c` | 97 |
| discovery-receipt.json#64 | `1eb00b50-5e0b-806e-b942-79261be1e00b` | `90acc254` | `034c2b5e6899f971` | 98 |
| discovery-receipt.json#65 | `f07d6dc9-60ae-827c-bbf2-63418fc22f2f` | `90acc254` | `b90c932937a6e37e` | 99 |
| discovery-receipt.json#66 | `0f15a78a-f75a-8323-b592-38e30a6115bd` | `90acc254` | `680cfe39258f9750` | 100 |
| discovery-receipt.json#67 | `e8c6c068-c806-8162-81fd-802206739340` | `90acc254` | `05cc0e423598ec1e` | 101 |
| discovery-receipt.json#68 | `73f98772-78ed-8d81-9b3a-df34e50eb7db` | `90acc254` | `fc94c4ed5436a870` | 102 |
| discovery-receipt.json#69 | `d8293b5f-4f32-85fd-9faa-a509dacf8c97` | `90acc254` | `b3093ce5b9138db5` | 103 |
| discovery-receipt.json#70 | `16eed20e-e01f-8bef-884d-102191201afd` | `90acc254` | `aff5420767ab9f79` | 104 |
| discovery-receipt.json#71 | `67eafa78-fe5f-8433-90db-0e3a65da04c3` | `90acc254` | `c2dce09eef5b7062` | 105 |
| discovery-receipt.json#72 | `3fc0e119-2a20-81c8-88bc-a3e0e080a8f3` | `90acc254` | `b81fb13edb7e3bf5` | 106 |
| discovery-receipt.json#73 | `07864dfc-59cc-81cc-8aea-dd59a1d597dd` | `90acc254` | `3ff69a09ce0cbfb8` | 107 |
| discovery-receipt.json#74 | `e7332290-460b-81ed-9812-8112356ad124` | `90acc254` | `adf723ec6f9c3dbd` | 108 |
| discovery-receipt.json#75 | `f5213ae6-88b1-815d-952d-c638f1abfda0` | `90acc254` | `372a8b345edaf117` | 109 |
| discovery-receipt.json#76 | `b66e342c-ee3c-8316-8efa-19568fce29df` | `90acc254` | `4939f8249188cd70` | 110 |
| discovery-receipt.json#77 | `063d6665-55fb-86bc-8176-5218af2ed587` | `90acc254` | `f0f5e07aa9ddd55e` | 111 |
| discovery-receipt.json#78 | `0f6b4e0e-afa6-8a44-bc8d-b3a1d01d339f` | `90acc254` | `a9aae1fd1b16986b` | 112 |
| discovery-receipt.json#79 | `3e3ac22f-2d32-85e7-8dab-be6df8daec5a` | `90acc254` | `9bc66140a45e37ba` | 113 |
| discovery-receipt.json#80 | `02754db9-90e5-8310-910f-54dbed4b107d` | `90acc254` | `786857f72301f3a8` | 114 |
| discovery-receipt.json#81 | `c32d3894-eea7-83d4-b7c5-bf07a9f4e71a` | `90acc254` | `fc189f771ff91508` | 115 |
| discovery-receipt.json#82 | `3e03b7cf-66e6-8c25-abe3-62ad6add74c8` | `90acc254` | `07a5fcd598ca3eb0` | 116 |
| discovery-receipt.json#83 | `fbacbcf9-b2d3-8bf1-9eee-dbaf18661353` | `90acc254` | `8be0f30e0dce8051` | 117 |
| discovery-receipt.json#84 | `6ce54299-3d00-8a23-83f2-4e33ffdcdee7` | `90acc254` | `5c2e93f0eb86f4c0` | 118 |
| flaws-receipt.json | `7e64e1ad-9a0f-863e-9233-66d3fa9ded43` | `f9cebb72` | `4c375110f22b54d5` | 119 |
| formulas-receipt.json | `f2bcd634-de4b-817e-907a-18c67ac18114` | `f9cebb72` | `a57644fd2503454f` | 120 |
| formulas-receipt.json#0 | `cf31f329-bb9e-8a4c-a053-6387e5f4c237` | `f2bcd634` | `1773b99aede669da` | 121 |
| formulas-receipt.json#1 | `7164514a-85d0-8627-81d0-a5994c64138f` | `f2bcd634` | `a2f4ccae5fbb3ece` | 122 |
| formulas-receipt.json#2 | `f8b97c0a-ff5d-8d67-89c5-39b92940d0c2` | `f2bcd634` | `7855a0eea052244a` | 123 |
| formulas-receipt.json#3 | `a0c9613d-2331-80a5-8ce0-f5d22864feb5` | `f2bcd634` | `7ee228c2689a66ab` | 124 |
| formulas-receipt.json#4 | `01ed5d58-cd0b-8c2c-b3d6-bfe597a08dcb` | `f2bcd634` | `533f9775ce5d5e81` | 125 |
| formulas-receipt.json#5 | `3cf0a131-4e70-863b-9ee9-d9b91e1d404a` | `f2bcd634` | `87e55d941f84b20b` | 126 |
| formulas-receipt.json#6 | `4a8f2821-2d1a-8a12-887e-1b4d2400a86f` | `f2bcd634` | `bfe7a7cf26570987` | 127 |
| formulas-receipt.json#7 | `3f92236b-0fc0-8ec6-aa5d-9896195f641a` | `f2bcd634` | `2a94c1d2e5611437` | 128 |
| formulas-receipt.json#8 | `ff873da5-8d07-8667-ac12-529c7e750f51` | `f2bcd634` | `9f4d73f669496e6e` | 129 |
| formulas-receipt.json#9 | `31c422f3-b525-8ae4-9e40-c80af1ac606f` | `f2bcd634` | `bc16d88e54ab53fd` | 130 |
| formulas-receipt.json#10 | `b4850d94-3a19-87f4-ae7e-29099d35667f` | `f2bcd634` | `b98014b85fb11578` | 131 |
| formulas-receipt.json#11 | `fa25cef3-9306-8bdc-a2fc-b0dddd511909` | `f2bcd634` | `c58cac102231072f` | 132 |
| formulas-receipt.json#12 | `97585d92-5ce4-86b6-a919-0327f31b7be7` | `f2bcd634` | `f35583c48ecfe4fd` | 133 |
| formulas-receipt.json#13 | `e8aae182-7fe4-8133-9399-b5faba40cb43` | `f2bcd634` | `a54834fe29f60963` | 134 |
| formulas-receipt.json#14 | `32d669b5-a7a7-80f5-97b4-d8fa8748d4fd` | `f2bcd634` | `85db02ff0efa172b` | 135 |
| formulas-receipt.json#15 | `49b80ea9-6571-8798-aca0-492d0551966d` | `f2bcd634` | `9fd8f6830da4b679` | 136 |
| formulas-receipt.json#16 | `01b90ac3-6b87-83f0-bd4f-faa5db64a35d` | `f2bcd634` | `aa7f90384433d5b2` | 137 |
| formulas-receipt.json#17 | `b47ffb72-edb8-801f-8703-61124bc70f70` | `f2bcd634` | `7ee3e17945b94864` | 138 |
| formulas-receipt.json#18 | `3d64703f-95c3-8cb0-8ad9-de407b7507fe` | `f2bcd634` | `18f078af840d0f24` | 139 |
| formulas-receipt.json#19 | `a6069f9b-26cf-8662-88b8-3ac4be464677` | `f2bcd634` | `bd08b0a2499a9952` | 140 |
| formulas-receipt.json#20 | `b65c3f9e-338a-86b5-9d3c-372b9aa0ad1f` | `f2bcd634` | `95415a518593c3bc` | 141 |
| formulas-receipt.json#21 | `43de016b-61de-8287-8f76-edefa917916c` | `f2bcd634` | `8cdbdcccaa2966af` | 142 |
| formulas-receipt.json#22 | `4f5ac523-bc3b-89ae-95f8-48f714a74d9b` | `f2bcd634` | `ac4726b7d2a7d80a` | 143 |
| formulas-receipt.json#23 | `a3b943d8-7468-83b0-812d-ecc0a9ea2867` | `f2bcd634` | `08d5895b9beed98c` | 144 |
| formulas-receipt.json#24 | `74cb03f2-3755-88ff-b9c9-b25c11dab4d9` | `f2bcd634` | `c2d34f7e5f4b14d7` | 145 |
| formulas-receipt.json#25 | `fa5b3ad6-5073-8f36-b293-7394f1a53c7b` | `f2bcd634` | `2e2823d6317b07a6` | 146 |
| formulas-receipt.json#26 | `b9bcda6a-4af8-856d-bc2c-fda3eff3e98e` | `f2bcd634` | `c3b41995f4d1c959` | 147 |
| formulas-receipt.json#27 | `d365f8a7-ad0e-8949-8256-95df95e7d96f` | `f2bcd634` | `1ed9c3bfa9ec87e2` | 148 |
| formulas-receipt.json#28 | `d2ad5596-7d8f-80a2-96ad-6dceae42abf9` | `f2bcd634` | `959148a0c75be80c` | 149 |
| formulas-receipt.json#29 | `2f0aaa06-e765-81f5-b5f3-793619d923a6` | `f2bcd634` | `1c664d2e05ff40a6` | 150 |
| formulas-receipt.json#30 | `a4d705b8-2826-8d95-a2e3-fa478de5a108` | `f2bcd634` | `18cea4ceacbae271` | 151 |
| formulas-receipt.json#31 | `bddfbe49-9be8-8c64-8d20-3073e5ba238a` | `f2bcd634` | `28aaad3aff6ae870` | 152 |
| formulas-receipt.json#32 | `155f1ba2-c006-8136-9851-a0fa169de48a` | `f2bcd634` | `7b3986f6bb97f181` | 153 |
| formulas-receipt.json#33 | `12949df1-55a0-8cbe-a756-e1e7130aeb66` | `f2bcd634` | `bd39cc5dce91543c` | 154 |
| formulas-receipt.json#34 | `ed8cc233-4ea0-8232-9492-5f0f33002fdc` | `f2bcd634` | `e503c74d49f6e7f2` | 155 |
| formulas-receipt.json#35 | `db26a6bb-1a47-8b46-a00c-bed773619cf9` | `f2bcd634` | `070587868b502e3e` | 156 |
| formulas-receipt.json#36 | `fa685b23-1115-88d5-93b8-d1b053fdc8a7` | `f2bcd634` | `8bc389ceb6708a6e` | 157 |
| formulas-receipt.json#37 | `80941865-532e-8b23-b5d5-dd912227dc3c` | `f2bcd634` | `aa2cfb68632c5119` | 158 |
| formulas-receipt.json#38 | `86dd73be-0f2e-8469-a942-9d89bfeb8e5b` | `f2bcd634` | `8392917421a52db1` | 159 |
| formulas-receipt.json#39 | `290c96b3-d7f3-8070-a318-f5370b86a2fa` | `f2bcd634` | `6662ca2e44ab30ce` | 160 |
| formulas-receipt.json#40 | `14a560ed-5d9b-847b-af49-0e2a0e8dfa15` | `f2bcd634` | `f563e65959af7e4e` | 161 |
| formulas-receipt.json#41 | `4206b774-a827-804c-8517-752a7cb30564` | `f2bcd634` | `92831b82805af163` | 162 |
| formulas-receipt.json#42 | `5953aff2-af07-8381-b8c9-70e1d7ba39bf` | `f2bcd634` | `557f5e671bd51404` | 163 |
| formulas-receipt.json#43 | `3adae609-6f35-8044-8a36-7fb605b96b75` | `f2bcd634` | `96bf41580bb3e014` | 164 |
| formulas-receipt.json#44 | `dc4fcd8f-b515-8d7b-ab2c-87ab95bbb994` | `f2bcd634` | `1081e629ee709212` | 165 |
| formulas-receipt.json#45 | `bc4b6821-6dd5-8d3f-ac43-4063d9993891` | `f2bcd634` | `8f9bf89769e156e0` | 166 |
| formulas-receipt.json#46 | `b36d9802-370d-8b0f-80c9-cc51daafd013` | `f2bcd634` | `c26d82a4db15e6e2` | 167 |
| formulas-receipt.json#47 | `3daa9db0-5752-80cd-95be-c73d2462181f` | `f2bcd634` | `7589f697a532a331` | 168 |
| formulas-receipt.json#48 | `9d612907-4b22-8276-9d97-f6f930236782` | `f2bcd634` | `ca69c8b2bfd18768` | 169 |
| formulas-receipt.json#49 | `977f4d21-f9bc-8b15-876d-22f14f239892` | `f2bcd634` | `35d178ba5806de3e` | 170 |
| formulas-receipt.json#50 | `d8a44984-8f8e-86fa-8449-9822fcf45522` | `f2bcd634` | `79165b15a85cd1c9` | 171 |
| formulas-receipt.json#51 | `7ff796d5-3f1d-8395-982b-0067a15cb128` | `f2bcd634` | `19b9443386db5207` | 172 |
| formulas-receipt.json#52 | `dbf0dcc4-bb4b-82ca-a7c8-d8b13d48fb64` | `f2bcd634` | `a5e18eaf7c36d53e` | 173 |
| formulas-receipt.json#53 | `64132140-f098-8b39-8918-60b922639800` | `f2bcd634` | `4af9d1ed26649ab9` | 174 |
| formulas-receipt.json#54 | `ec109888-e49d-89c6-80f2-2280e39f6a8b` | `f2bcd634` | `829600c37fb2c3cc` | 175 |
| formulas-receipt.json#55 | `b9c4b6ee-2f6c-89a6-ad78-2ce0a90c4dbf` | `f2bcd634` | `6384cd49f6ae7653` | 176 |
| formulas-receipt.json#56 | `3282e5a8-bf3a-8f76-a5fd-c32317ff77a1` | `f2bcd634` | `b9182644b90809c4` | 177 |
| formulas-receipt.json#57 | `5ddec5b9-5f24-8c61-afc8-6ead8a9d4b74` | `f2bcd634` | `e1016d184d08867a` | 178 |
| formulas-receipt.json#58 | `199724c6-4a12-879d-a142-e1ea5bdb8ad5` | `f2bcd634` | `61e5f465150e9fb6` | 179 |
| formulas-receipt.json#59 | `0db331c9-e567-89ea-be19-275ed9882239` | `f2bcd634` | `0bb30b26a85df1e2` | 180 |
| formulas-receipt.json#60 | `5357bd1c-8038-8c74-99f5-12a106b5ce83` | `f2bcd634` | `e856c137149495c1` | 181 |
| formulas-receipt.json#61 | `4b72f19a-d500-8b34-98f2-cefe3988b7b4` | `f2bcd634` | `577494687c1be17c` | 182 |
| formulas-receipt.json#62 | `8ca9dca2-3c34-8a25-8979-0919754b38c9` | `f2bcd634` | `06962e72272574ab` | 183 |
| formulas-receipt.json#63 | `1bd28bbf-dcb2-8d6e-96fc-1d55412a1817` | `f2bcd634` | `56b20f8799d6b7ec` | 184 |
| formulas-receipt.json#64 | `af2529fb-3e54-82c3-8e41-d93f942da170` | `f2bcd634` | `9d5eabf51b1d3f15` | 185 |
| formulas-receipt.json#65 | `2f1f17f0-d0c4-869b-a387-b3b44e26eca6` | `f2bcd634` | `ab940b45add682a2` | 186 |
| formulas-receipt.json#66 | `fd0838a3-1290-8295-b5f6-c7c3eb9724a4` | `f2bcd634` | `c1b32a56a930528a` | 187 |
| formulas-receipt.json#67 | `20b53df2-a8a1-8385-b62e-45d4f957c379` | `f2bcd634` | `2558048ef349fa9d` | 188 |
| formulas-receipt.json#68 | `29463506-6877-84eb-a7a8-61910a9ce421` | `f2bcd634` | `c41a2a719dbe2407` | 189 |
| formulas-receipt.json#69 | `2ddac3b3-5c39-89a7-adea-ac6ae423632a` | `f2bcd634` | `5e9d093b584d1aa5` | 190 |
| formulas-receipt.json#70 | `8adb6a39-a65b-8168-b9c8-0f2edfe9c466` | `f2bcd634` | `f1c0a497d54f22b0` | 191 |
| formulas-receipt.json#71 | `0c83691e-8932-812c-a182-4230d92c7f1e` | `f2bcd634` | `9c4dbfae16230c90` | 192 |
| formulas-receipt.json#72 | `ee26da7b-9030-8e42-994e-7c859e3f1c1d` | `f2bcd634` | `d342241f5ab2d9dc` | 193 |
| formulas-receipt.json#73 | `f39e6293-92a7-8baa-8ccd-741ec5eabfd6` | `f2bcd634` | `1986cdb8d489b44b` | 194 |
| formulas-receipt.json#74 | `afdd3309-0dec-8f68-b84b-db3d5ff0d2e3` | `f2bcd634` | `9092ba22b6b56870` | 195 |
| formulas-receipt.json#75 | `ba5fff83-ccf7-87b9-ad87-5ce9444839bb` | `f2bcd634` | `6b53d7d27b6d3a5c` | 196 |
| formulas-receipt.json#76 | `4bb9c148-039f-865d-993e-6c44f72811ea` | `f2bcd634` | `8a1eb11de8387202` | 197 |
| formulas-receipt.json#77 | `b7bfda60-cd1d-8923-a052-9c69e5672d52` | `f2bcd634` | `39ccfe9889225e5b` | 198 |
| formulas-receipt.json#78 | `50b43669-fa6c-8b66-b509-90825b7dc3d4` | `f2bcd634` | `9116f7ac9d0cd1b4` | 199 |
| fuse-receipt.json | `0456dfbc-2ef8-86fc-87b0-f51a08b289c5` | `f9cebb72` | `bb2c4ca42d7d9bcf` | 200 |
| lattice-receipt.json | `2f2b1ade-10d7-864b-a22e-3cba12d38b7d` | `f9cebb72` | `5c9367f8765423b2` | 201 |
| lean-receipt.json | `bce42eb5-eb9c-889b-a851-375082602b1c` | `f9cebb72` | `7a63d6ab25d404f4` | 202 |
| lean-receipt.json#0 | `c2407a8c-d246-87d0-8630-19eeb5c68f78` | `bce42eb5` | `01a4314334920464` | 203 |
| lean-receipt.json#1 | `6861c52b-cf1b-8dbc-95aa-5a2fe8f4b8bd` | `bce42eb5` | `17dd686d646c00c4` | 204 |
| lean-receipt.json#2 | `183c3544-95da-8c41-afc3-18e064190b06` | `bce42eb5` | `85559ecfe991db72` | 205 |
| lean-receipt.json#3 | `e97b3dea-5ece-8138-a3e4-80306d992ffa` | `bce42eb5` | `0b81c75ca7b9f612` | 206 |
| lean-receipt.json#4 | `5c159dd9-bf70-8a50-b507-9d1e5608243b` | `bce42eb5` | `856c8808576cb0ed` | 207 |
| lean-receipt.json#5 | `8ec0b683-dfe6-8363-996d-e7f1a2bb1c2f` | `bce42eb5` | `8c42f871b54b87a0` | 208 |
| lean-receipt.json#6 | `afeaeae2-4aa4-856f-8de3-e26ed877f82f` | `bce42eb5` | `a1bb51780f3b93f2` | 209 |
| lean-receipt.json#7 | `803a23e9-b25f-8c2b-9983-ad1c62780582` | `bce42eb5` | `8c393b1c4570738a` | 210 |
| lean-receipt.json#8 | `e1647e5c-7134-8253-b3a3-a6f9cb3841d6` | `bce42eb5` | `8759e151d526b48d` | 211 |
| lean-receipt.json#9 | `eddf7cd0-163b-8d80-aa6f-cf6d9451e0dc` | `bce42eb5` | `ba236e62d0f2e667` | 212 |
| lean-receipt.json#10 | `33015af2-f282-80f1-a49c-3cc077998e04` | `bce42eb5` | `2d3bffa2815b71de` | 213 |
| lean-receipt.json#11 | `a4cf0685-8834-8887-8350-7abff11bb896` | `bce42eb5` | `3b823db63b5cf251` | 214 |
| lean-receipt.json#12 | `2431bbf2-693c-8544-8556-3bca6f3eeeab` | `bce42eb5` | `8198bb405e69ae3d` | 215 |
| lean-receipt.json#13 | `1c9a7e83-e8c1-8d7d-9f17-19a99c0628b6` | `bce42eb5` | `fa381a949b4f1709` | 216 |
| lean-receipt.json#14 | `73154e92-a62d-8de3-91ef-596ecf7769d7` | `bce42eb5` | `ccbc114c64b5d7d5` | 217 |
| lean-receipt.json#15 | `d4f6a5a7-f148-8378-b470-8d5d0ee1b612` | `bce42eb5` | `ca2d842deaaa3417` | 218 |
| lean-receipt.json#16 | `14b21b35-5e62-8af4-8542-227f247bf5da` | `bce42eb5` | `c26db2931600ef72` | 219 |
| lean-receipt.json#17 | `afe5ba15-9e7b-87ac-a97a-bba8b719b521` | `bce42eb5` | `f1d614a5647be442` | 220 |
| lean-receipt.json#18 | `cd99be32-f60a-868e-a374-097d59521cdc` | `bce42eb5` | `20b0af073db0d784` | 221 |
| lean-receipt.json#19 | `83e62925-4638-8824-9c0f-c8b712082f27` | `bce42eb5` | `661bd8788a9d8fec` | 222 |
| lean-receipt.json#20 | `00caae3c-e047-8a73-9f46-de0018601f0a` | `bce42eb5` | `8ae5bda61686e5fe` | 223 |
| lean-receipt.json#21 | `a0e11465-0b58-84cb-b856-c7e3c3a855a2` | `bce42eb5` | `0173e958093f571c` | 224 |
| lean-receipt.json#22 | `d3ac9b62-9eb2-8809-bbe4-039401ccf669` | `bce42eb5` | `dc9170336312cfdd` | 225 |
| lean-receipt.json#23 | `5be674a3-011e-8f50-980c-41edd0b0365d` | `bce42eb5` | `a928836e949a3b08` | 226 |
| lean-receipt.json#24 | `1b1b3a0a-df7a-8230-b879-f0c109e297c6` | `bce42eb5` | `892beb0c6c10c5d8` | 227 |
| lean-receipt.json#25 | `c230cd7c-83f5-85ed-9502-f07f8cdb68c9` | `bce42eb5` | `54b1ada5511adb73` | 228 |
| lean-receipt.json#26 | `180ebbea-f7ef-8304-b591-b1ca424dc403` | `bce42eb5` | `ac8eef3ad8936c18` | 229 |
| lean-receipt.json#27 | `cfb00fca-02b0-83c0-ae85-6052135099f1` | `bce42eb5` | `7256c466c3448c3f` | 230 |
| lean-receipt.json#28 | `a38cb598-f556-886d-b370-f36dda0fdcd0` | `bce42eb5` | `783f0872ec919aeb` | 231 |
| lean-receipt.json#29 | `3cb3b347-8ef1-8c3a-bda6-0e0bc42f2a1b` | `bce42eb5` | `c2625317519e7ea0` | 232 |
| lean-receipt.json#30 | `f2e4e390-6a02-881a-a7b9-fe4f0daf24f1` | `bce42eb5` | `b828aefe631f023f` | 233 |
| lean-receipt.json#31 | `4954f0de-7c67-80fc-a6cd-3c2e705ed922` | `bce42eb5` | `28c97dc8c98c1353` | 234 |
| lean-receipt.json#32 | `f670516c-e449-8aaf-9650-7733981f0254` | `bce42eb5` | `a50a453d176456ba` | 235 |
| lean-receipt.json#33 | `ff34d7f3-0074-865e-9fec-6514df850658` | `bce42eb5` | `e9987eb5bb747c92` | 236 |
| lean-receipt.json#34 | `7aabf96a-d5dd-8ca4-a8f5-30e35aed1ffe` | `bce42eb5` | `d96c3e86ca8300bb` | 237 |
| lean-receipt.json#35 | `2712e240-407b-8882-888a-6072a0827bfd` | `bce42eb5` | `026803944de9f8fb` | 238 |
| lean-receipt.json#36 | `349a4386-8c05-8997-8452-4c1386166045` | `bce42eb5` | `9493a574bb66c834` | 239 |
| lean-receipt.json#37 | `630055f5-c27a-863d-a474-1c14402bea4f` | `bce42eb5` | `e49607ea34f2e643` | 240 |
| lean-receipt.json#38 | `f99d45fb-d0b9-810b-b6a2-d652c81bb374` | `bce42eb5` | `3a9d0303d541d513` | 241 |
| lean-receipt.json#39 | `32826cea-df93-8e6d-8a2a-d5e76949b95c` | `bce42eb5` | `850461c1588ef998` | 242 |
| lean-receipt.json#40 | `91aa90f9-112e-8e2c-a6d7-fc4c337c4bff` | `bce42eb5` | `54ced7ee08c43b01` | 243 |
| lean-receipt.json#41 | `4efc8f5c-a7bd-84d8-8b5b-487da94f2525` | `bce42eb5` | `883120543a46eeba` | 244 |
| lean-receipt.json#42 | `805a9394-4379-823a-bd47-59056adf2933` | `bce42eb5` | `3ab0cd25a6b5a51c` | 245 |
| lean-receipt.json#43 | `e340379e-9fab-83ec-abae-e166979660f7` | `bce42eb5` | `f9b7bcab6eb1f2ec` | 246 |
| lean-receipt.json#44 | `ce001eb5-cf5d-870e-87ba-d72f41bc2414` | `bce42eb5` | `ba26eb0385ad4049` | 247 |
| lean-receipt.json#45 | `483e0818-ceff-8c45-8584-3edc2aaf8efe` | `bce42eb5` | `cdfdeaec366d59a9` | 248 |
| lean-receipt.json#46 | `8235ed60-0653-85d7-ad0c-6922956cd343` | `bce42eb5` | `a3f34c2b09cbdc81` | 249 |
| lean-receipt.json#47 | `699b6a17-ec21-8ba7-8484-883bb075b088` | `bce42eb5` | `fa828c0c9002434a` | 250 |
| lean-receipt.json#48 | `57dd3c1d-f835-8416-bb65-b40178ef22d0` | `bce42eb5` | `390ee6112bc84229` | 251 |
| lean-receipt.json#49 | `944940d9-62d0-8574-92b9-c19ad21d3f27` | `bce42eb5` | `14e7224d07b82fe5` | 252 |
| lean-receipt.json#50 | `1e34b89d-e874-8299-adc0-e078284d676b` | `bce42eb5` | `a26d61f94731765b` | 253 |
| lean-receipt.json#51 | `c9a9307f-d366-8aa6-ba38-71903b586479` | `bce42eb5` | `0606ba04128bc864` | 254 |
| lean-receipt.json#52 | `d47498e2-208a-8a69-889b-3d53a79e744b` | `bce42eb5` | `d8fe7dee19a9eca9` | 255 |
| lean-receipt.json#53 | `0181f929-3573-8e1c-9fb1-c65cfdc4d623` | `bce42eb5` | `5e9815aaca739805` | 256 |
| lean-receipt.json#54 | `e3fb9b8a-3ed5-8462-8df5-2451d933a2bb` | `bce42eb5` | `fca5ef45f516834b` | 257 |
| lean-receipt.json#55 | `9924da12-3103-89a4-92ee-69f5f4857059` | `bce42eb5` | `4e0f8d28c2a80cb1` | 258 |
| lean-receipt.json#56 | `3a24b350-d469-843b-a9e7-9b463b7f67e4` | `bce42eb5` | `bddfe267a640156c` | 259 |
| lean-receipt.json#57 | `7eeb088f-fd64-8af4-8452-e415e6e4a8c3` | `bce42eb5` | `aaca8fa141b1b164` | 260 |
| lean-receipt.json#58 | `7778587e-ca0f-8314-ab09-52b4a69f202d` | `bce42eb5` | `de9c1d0eb319845f` | 261 |
| lean-receipt.json#59 | `ca1fd48a-ab09-8c35-9378-881a2e30e345` | `bce42eb5` | `5ad4efe87055dad6` | 262 |
| lean-receipt.json#60 | `bd24e85d-c7cb-8449-9348-88105f880e46` | `bce42eb5` | `21f8222a910896f8` | 263 |
| lean-receipt.json#61 | `c74a6ae7-19e3-8d80-adb5-bec44b06675d` | `bce42eb5` | `9ab521ab8bfd2c30` | 264 |
| lean-receipt.json#62 | `5d29dfc3-722b-8582-b704-2918f9281a67` | `bce42eb5` | `97f276540373c55c` | 265 |
| lean-receipt.json#63 | `6a6a09c0-54d8-8b05-972c-43971fcfc296` | `bce42eb5` | `433fae11c15a3406` | 266 |
| lean-receipt.json#64 | `a93181dd-58bf-8613-942c-61ce0cf7e378` | `bce42eb5` | `99f6f1bba698c440` | 267 |
| lean-receipt.json#65 | `12ca26a2-9b83-8156-96a2-3cd2a34c29b3` | `bce42eb5` | `9f74c15228e068ae` | 268 |
| lean-receipt.json#66 | `2f241438-d3cc-8f9e-8872-daac534a179e` | `bce42eb5` | `50d88d048369584c` | 269 |
| lean-receipt.json#67 | `2a333cdd-b219-88f9-8fbb-216a3c9ef4eb` | `bce42eb5` | `89f9254372ae56a4` | 270 |
| lean-receipt.json#68 | `6d8c8fdb-6ac6-8b45-82c2-a70c78638eec` | `bce42eb5` | `019312acb7ec2b4b` | 271 |
| lean-receipt.json#69 | `1e9b1c82-e338-89b1-99a0-003739fc7a54` | `bce42eb5` | `09fe6367b5d53bf0` | 272 |
| lean-receipt.json#70 | `f2fe07fe-8ec0-8778-9ede-52e3a443ef21` | `bce42eb5` | `228f135985843f8b` | 273 |
| lean-receipt.json#71 | `0cade781-b6ef-888d-aa75-bec2712e3114` | `bce42eb5` | `43d4a9af3eae5238` | 274 |
| lean-receipt.json#72 | `f6a0dc6c-e454-8686-8a36-dee11b0b1843` | `bce42eb5` | `c48f727b686daaaa` | 275 |
| lean-receipt.json#73 | `76f963cb-6136-8fd1-8477-e7b192cc3898` | `bce42eb5` | `e948e238756c4b88` | 276 |
| lean-receipt.json#74 | `38d7e379-b98a-88ea-a10c-19a7e4848d9a` | `bce42eb5` | `97efe68b81d61976` | 277 |
| lean-receipt.json#75 | `02c580b9-15ac-83b9-be05-d7e59a02ce6a` | `bce42eb5` | `9bff2b6d5fc53087` | 278 |
| lean-receipt.json#76 | `df98e113-81e2-82cd-af79-e16186508035` | `bce42eb5` | `f7c370cf81952879` | 279 |
| lean-receipt.json#77 | `ae13249b-5b80-8b84-84ef-59e9258303d2` | `bce42eb5` | `d3ac9515015a7683` | 280 |
| lean-receipt.json#78 | `220576d3-c117-8874-a569-7a20d5ee70e1` | `bce42eb5` | `e39144dd650da2d3` | 281 |
| lean-receipt.json#79 | `72e2dbc5-7029-8899-9f0f-7ed1290b6c60` | `bce42eb5` | `13aa26d4330f37b7` | 282 |
| lean-receipt.json#80 | `8c62cd50-270c-80d4-bbb2-c9d5c889b90e` | `bce42eb5` | `6fd3a89255a92ed8` | 283 |
| lean-receipt.json#81 | `ef94a2ed-e0f9-8bd4-a860-1a7d622022a7` | `bce42eb5` | `2150be74f267d805` | 284 |
| lean-receipt.json#82 | `bbaf7a56-c463-8d27-8e56-e8b586a9d690` | `bce42eb5` | `ca40f3358e8ba4a4` | 285 |
| lean-receipt.json#83 | `a85ec869-244c-8587-a9f7-4ca43ebb4592` | `bce42eb5` | `cd77c6f87b5b1064` | 286 |
| lean-receipt.json#84 | `7f95a32f-56ff-88c1-bc77-bb53f3f79dd3` | `bce42eb5` | `7013fccd8490dad7` | 287 |
| lean-receipt.json#85 | `5ceb8d82-b7e5-85e3-97c4-046f530b16a4` | `bce42eb5` | `7502a7db02d5a467` | 288 |
| lean-receipt.json#86 | `32335fb5-f125-8ed3-8ba7-0ea654009860` | `bce42eb5` | `d8ed6351f82dc020` | 289 |
| lean-receipt.json#87 | `5ee5b447-a22a-8148-9aef-521dc9b74bdb` | `bce42eb5` | `87ad43e6d9e74af4` | 290 |
| lean-receipt.json#88 | `42445ffa-3aaa-8307-ac6d-f15191a98f2c` | `bce42eb5` | `29a1ce5eccc794cd` | 291 |
| lean-receipt.json#89 | `f0061d7c-0583-8a92-8ddd-c361aff89751` | `bce42eb5` | `917a754ef7ded231` | 292 |
| lean-receipt.json#90 | `ad2e0d4f-bda3-8916-a9b0-024b6d050492` | `bce42eb5` | `2ddbc9e72c5863a3` | 293 |
| lean-receipt.json#91 | `8afc32bc-c19e-8cf5-8baa-a4822f0a457c` | `bce42eb5` | `19e70810b6c0569e` | 294 |
| lean-receipt.json#92 | `955cbcea-1dba-80fd-9462-43c678e0a43d` | `bce42eb5` | `ab2dc0ed36085aae` | 295 |
| lean-receipt.json#93 | `323f20bb-187e-82da-829d-c01e4721cd8d` | `bce42eb5` | `6b6a512c4de306e7` | 296 |
| lean-receipt.json#94 | `7635bb19-5727-8029-bb76-984f97608396` | `bce42eb5` | `8cc93ec2a2c3b4c1` | 297 |
| lean-receipt.json#95 | `5cb0ebae-2aad-8213-90ec-8fcfc4faa4cb` | `bce42eb5` | `4da17eb3cca04d6f` | 298 |
| lean-receipt.json#96 | `9bd66712-4afe-85c3-990f-2de50e07388a` | `bce42eb5` | `cca2e313bbad6348` | 299 |
| lean-receipt.json#97 | `cdd19e3a-ad2e-8f5b-872b-40a9925cc2ea` | `bce42eb5` | `178311578707a3d9` | 300 |
| lean-receipt.json#98 | `7bd168b9-4d71-81fe-8d55-af28aab9a22f` | `bce42eb5` | `d6aad521dd3822c7` | 301 |
| lean-receipt.json#99 | `40ec85b9-2784-877f-bcc7-cf5d9f626d77` | `bce42eb5` | `a558c1105bcf6999` | 302 |
| lean-receipt.json#100 | `e199d3ef-87b5-8153-a974-df36141f36d2` | `bce42eb5` | `7002d9a2943b4233` | 303 |
| lean-receipt.json#101 | `7a4733b8-9f95-8981-b93c-dc18090bc477` | `bce42eb5` | `af05078facef6371` | 304 |
| lean-receipt.json#102 | `ba88a222-b03f-8af4-8fd0-b502135027cd` | `bce42eb5` | `d440e12709b21f65` | 305 |
| lean-receipt.json#103 | `9b7d31bd-d761-8e84-8214-71f889724d01` | `bce42eb5` | `4a5dc765b0ae881a` | 306 |
| lean-receipt.json#104 | `8cbdcc25-1369-8f47-8808-85d6cb571a74` | `bce42eb5` | `6e33961b381f1b24` | 307 |
| lean-receipt.json#105 | `66e520ad-e681-8ce8-8236-017a4f2c2a06` | `bce42eb5` | `8995d8a066b7efef` | 308 |
| lean-receipt.json#106 | `d99a9579-1d6d-8f1a-ab92-fdd997200804` | `bce42eb5` | `ee05cc004c566b7d` | 309 |
| lean-receipt.json#107 | `d84e8722-8ca4-8883-8dda-f2c33403cb5a` | `bce42eb5` | `4a5f92880000ec12` | 310 |
| lean-receipt.json#108 | `b1334502-b28e-8364-abbe-6411ed63831a` | `bce42eb5` | `673fccabf7917e43` | 311 |
| lean-receipt.json#109 | `a38248b8-12eb-877f-b739-a853eebf6267` | `bce42eb5` | `7e721ac4c1f5636e` | 312 |
| lean-receipt.json#110 | `258c2a05-e623-8efc-adfb-7a4472b08c3c` | `bce42eb5` | `5104b1b5d221fe0c` | 313 |
| lean-receipt.json#111 | `e9749e20-5d93-8fff-84f3-e905d764f62e` | `bce42eb5` | `a53e2a3165bc2079` | 314 |
| lean-receipt.json#112 | `6315e7b1-3ffd-8261-823b-f792923fa78c` | `bce42eb5` | `ac11551381559b5d` | 315 |
| lean-receipt.json#113 | `bde33cbd-88e2-8e1d-ac87-f3af58752764` | `bce42eb5` | `1e76aaa529c1faf4` | 316 |
| lean-receipt.json#114 | `d3b03c24-5bc7-808b-bf18-d5c6a2369839` | `bce42eb5` | `6650de8fa69d0055` | 317 |
| lean-receipt.json#115 | `3e6aa242-b2fc-806a-a98c-d4a24f7bef42` | `bce42eb5` | `45ffdc938f29d266` | 318 |
| lean-receipt.json#116 | `1f50a701-d724-85b9-a4dd-b83598afb2f8` | `bce42eb5` | `29720f16131d7884` | 319 |
| lean-receipt.json#117 | `319c5d11-05cf-8f84-bb85-92a100777954` | `bce42eb5` | `8f9e22c7e2bea6c9` | 320 |
| lean-receipt.json#118 | `ae2e1e8c-6dde-8028-b1a2-d67c04bdf611` | `bce42eb5` | `f9363e39d4b6cfec` | 321 |
| lean-receipt.json#119 | `0147757d-613d-883f-a882-a9bfa5915acf` | `bce42eb5` | `123fa2b2b6e380b2` | 322 |
| lean-receipt.json#120 | `ae014cbf-57ce-8a4f-b6fe-c23fd89ea140` | `bce42eb5` | `df00ee1dd773d8f2` | 323 |
| lean-receipt.json#121 | `f8849b9a-daac-8078-9d8b-03cb71c34237` | `bce42eb5` | `20f85f44fda02861` | 324 |
| lean-receipt.json#122 | `598b4558-8a59-879e-8344-fb872ef2cf86` | `bce42eb5` | `040743c9cee1336f` | 325 |
| lean-receipt.json#123 | `5ba952f3-6d6a-8889-a292-d15728d49660` | `bce42eb5` | `bfa20fd6cf759420` | 326 |
| payload-cf-receipt.json | `4feb0122-140c-8cf1-9011-135663b8d64e` | `f9cebb72` | `f62f0aaf7ff26014` | 327 |
| percall-receipt.json | `60dfd82b-ff13-8043-b4b0-16b13116cd89` | `f9cebb72` | `bb48a531ebc72170` | 328 |
| refusals-receipt.json | `b3fe23b3-237c-8bcc-912d-0e53a32a93d4` | `f9cebb72` | `8c5570077f4d6204` | 329 |
| test-receipt.json | `1a07c473-f66a-8cbd-a2bd-95fcd5b62f9c` | `f9cebb72` | `4a5cfb5ecff89ea1` | 330 |
| test-receipt.json#0 | `ba9a6d47-ff93-8713-be93-7720d22844a1` | `1a07c473` | `9a01ace6de6b54ec` | 331 |
| test-receipt.json#1 | `309d7358-7f51-8046-8446-89de62275917` | `1a07c473` | `a13d744057ec9cc2` | 332 |
| test-receipt.json#2 | `5ffb258f-418d-846a-ba05-d6820ad2ffda` | `1a07c473` | `bbd68eebc2fb3df3` | 333 |
| test-receipt.json#3 | `3a9dafe0-3da5-8275-a1de-34563534a29c` | `1a07c473` | `e739f4896d14e203` | 334 |
| test-receipt.json#4 | `dbb68e9b-c9e6-888f-a8fb-13777cf7e584` | `1a07c473` | `7d78476f346361f5` | 335 |
| test-receipt.json#5 | `42ee9187-1000-870e-9265-686fd0d5a350` | `1a07c473` | `3120a62df82699eb` | 336 |
| test-receipt.json#6 | `f08aabe7-a242-85f5-8938-c14c75ae0b63` | `1a07c473` | `e603dbc8c5889a16` | 337 |
| test-receipt.json#7 | `b0a99080-49fd-8aeb-913b-9dc17c214fc9` | `1a07c473` | `09c5ebed7bd28d13` | 338 |
| test-receipt.json#8 | `126d8ee9-2f79-82bd-b15a-3d3cdcb2a8cc` | `1a07c473` | `987476006a69a566` | 339 |
| test-receipt.json#9 | `d931fd45-ddb6-8c28-a6bd-3e3ae1390ef4` | `1a07c473` | `5d554129661dae60` | 340 |
| test-receipt.json#10 | `bccabe4a-2365-8ffd-ad72-91fd653edc20` | `1a07c473` | `c25f540b1357461f` | 341 |
| walls-receipt.json | `c378bafb-1057-883a-8c2c-a3c5bc27117d` | `f9cebb72` | `46393a1f4c0937d6` | 342 |
| readme | `df116fb4-4656-8618-8f5a-774fd74e834b` | `f9cebb72` | `361a66a1fe0b07ca` | 343 |

Regenerate with `npm run readme` after `npm run build` and the receipt-producing runs; `node scripts/generate-readme.mjs --check`
compares. Documentation: [docs/README.md](docs/README.md). License: CC-BY-NC-ND-4.0.
