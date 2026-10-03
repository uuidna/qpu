# UUIDNA QPU

**Final build receipt** `56fdc627-8cd1-80bc-b587-29de20d72096`

| | |
|---|---|
| version | 1.0.0 |
| commit | `396cd8c8d7b3634816bfab447e98513c11383c7a` (working tree differed from this commit) |
| receipts | 14 files, 530 nodes |
| build stream | length 530, head `56fdc627-8cd1-80bc-b587-29de20d72096`, chain `5f191743b4fc460af852dae7691deda95fab7f2f3d1f27fc002f9f7bdabcda16`, holds **true** |

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

Each node is a quantum receipt: its UUID is the RFC 9562 v8 content address of its payload fold and its referrer, and
its referrer is the node above it. Change any receipt's bytes and its node, its file's node, the build stream chain
and this final receipt move; the root moves with the commit.

```mermaid
flowchart TD
  n4065f6d6["root<br/><code>4065f6d6</code>"]
  n91a0d2da["cross-receipt.json<br/><code>91a0d2da</code>"]
  nbee88834["cross-receipt.json#0<br/><code>bee88834</code>"]
  n6cdc9823["cross-receipt.json#1<br/><code>6cdc9823</code>"]
  nf844dde8["cross-receipt.json#2<br/><code>f844dde8</code>"]
  ne404747d["cross-receipt.json#3<br/><code>e404747d</code>"]
  nd507a869["cross-receipt.json#4<br/><code>d507a869</code>"]
  nd93ebcdd["cross-receipt.json#5<br/><code>d93ebcdd</code>"]
  n7519b438["cross-receipt.json#6<br/><code>7519b438</code>"]
  nc441cf73["cross-receipt.json#7<br/><code>c441cf73</code>"]
  ne1808469["cross-receipt.json#8<br/><code>e1808469</code>"]
  ne91ad963["cross-receipt.json#9<br/><code>e91ad963</code>"]
  n5f7d1086["cross-receipt.json#10<br/><code>5f7d1086</code>"]
  n3b7e83c4["cross-receipt.json#11<br/><code>3b7e83c4</code>"]
  nfc9d5c2a["cross-receipt.json#12<br/><code>fc9d5c2a</code>"]
  nf8027600["cross-receipt.json#13<br/><code>f8027600</code>"]
  n7a3d3126["cross-receipt.json#14<br/><code>7a3d3126</code>"]
  nc190557b["cross-receipt.json#15<br/><code>c190557b</code>"]
  n8e1a940e["cross-receipt.json#16<br/><code>8e1a940e</code>"]
  n3a91314c["cross-receipt.json#17<br/><code>3a91314c</code>"]
  n924c0c9d["cross-receipt.json#18<br/><code>924c0c9d</code>"]
  nc9675ec9["cross-receipt.json#19<br/><code>c9675ec9</code>"]
  n06a58390["cross-receipt.json#20<br/><code>06a58390</code>"]
  nd6307a52["cross-receipt.json#21<br/><code>d6307a52</code>"]
  n4e4bc5b7["cross-receipt.json#22<br/><code>4e4bc5b7</code>"]
  n56fdb0c2["cross-receipt.json#23<br/><code>56fdb0c2</code>"]
  n15a69ea3["cross-receipt.json#24<br/><code>15a69ea3</code>"]
  n2dd51618["cross-receipt.json#25<br/><code>2dd51618</code>"]
  n5bc2e782["cross-receipt.json#26<br/><code>5bc2e782</code>"]
  n606a37c2["cross-receipt.json#27<br/><code>606a37c2</code>"]
  n1c370d00["cross-receipt.json#28<br/><code>1c370d00</code>"]
  n1c63fa72["cross-receipt.json#29<br/><code>1c63fa72</code>"]
  n0c3b4f5c["debts-receipt.json<br/><code>0c3b4f5c</code>"]
  ncca3ca6c["discovery-receipt.json<br/><code>cca3ca6c</code>"]
  n792ae0a6["discovery-receipt.json#0<br/><code>792ae0a6</code>"]
  nc921d1e7["discovery-receipt.json#1<br/><code>c921d1e7</code>"]
  n51730c52["discovery-receipt.json#2<br/><code>51730c52</code>"]
  n40272d45["discovery-receipt.json#3<br/><code>40272d45</code>"]
  nf3f371ff["discovery-receipt.json#4<br/><code>f3f371ff</code>"]
  necee5139["discovery-receipt.json#5<br/><code>ecee5139</code>"]
  nb9f8b321["discovery-receipt.json#6<br/><code>b9f8b321</code>"]
  nee5be4de["discovery-receipt.json#7<br/><code>ee5be4de</code>"]
  n9244b83e["discovery-receipt.json#8<br/><code>9244b83e</code>"]
  n7180c5ff["discovery-receipt.json#9<br/><code>7180c5ff</code>"]
  nf2e3be3a["discovery-receipt.json#10<br/><code>f2e3be3a</code>"]
  nffa422d3["discovery-receipt.json#11<br/><code>ffa422d3</code>"]
  n8224793c["discovery-receipt.json#12<br/><code>8224793c</code>"]
  n58df9405["discovery-receipt.json#13<br/><code>58df9405</code>"]
  n3f45a959["discovery-receipt.json#14<br/><code>3f45a959</code>"]
  n37e32cb2["discovery-receipt.json#15<br/><code>37e32cb2</code>"]
  n8ddc53e0["discovery-receipt.json#16<br/><code>8ddc53e0</code>"]
  n7afd865c["discovery-receipt.json#17<br/><code>7afd865c</code>"]
  nab58c8b2["discovery-receipt.json#18<br/><code>ab58c8b2</code>"]
  n44556097["discovery-receipt.json#19<br/><code>44556097</code>"]
  nd7fae280["discovery-receipt.json#20<br/><code>d7fae280</code>"]
  n3f188c88["discovery-receipt.json#21<br/><code>3f188c88</code>"]
  n9de22b63["discovery-receipt.json#22<br/><code>9de22b63</code>"]
  ne384d0b6["discovery-receipt.json#23<br/><code>e384d0b6</code>"]
  nd088c492["discovery-receipt.json#24<br/><code>d088c492</code>"]
  n98d65907["discovery-receipt.json#25<br/><code>98d65907</code>"]
  na7eac08e["discovery-receipt.json#26<br/><code>a7eac08e</code>"]
  nf22b89da["discovery-receipt.json#27<br/><code>f22b89da</code>"]
  n61e95636["discovery-receipt.json#28<br/><code>61e95636</code>"]
  n18c54424["discovery-receipt.json#29<br/><code>18c54424</code>"]
  nbf97c6b7["discovery-receipt.json#30<br/><code>bf97c6b7</code>"]
  nf6c2789c["discovery-receipt.json#31<br/><code>f6c2789c</code>"]
  n52808d40["discovery-receipt.json#32<br/><code>52808d40</code>"]
  n966d4c0a["discovery-receipt.json#33<br/><code>966d4c0a</code>"]
  n1dd33907["discovery-receipt.json#34<br/><code>1dd33907</code>"]
  na85335a5["discovery-receipt.json#35<br/><code>a85335a5</code>"]
  nfe6952b6["discovery-receipt.json#36<br/><code>fe6952b6</code>"]
  n4c1a5fef["discovery-receipt.json#37<br/><code>4c1a5fef</code>"]
  na6c95686["discovery-receipt.json#38<br/><code>a6c95686</code>"]
  nd1af9564["discovery-receipt.json#39<br/><code>d1af9564</code>"]
  n5dc232fc["discovery-receipt.json#40<br/><code>5dc232fc</code>"]
  nccd0591b["discovery-receipt.json#41<br/><code>ccd0591b</code>"]
  n40e8ccc8["discovery-receipt.json#42<br/><code>40e8ccc8</code>"]
  n6bbb3b7c["discovery-receipt.json#43<br/><code>6bbb3b7c</code>"]
  n29b69888["discovery-receipt.json#44<br/><code>29b69888</code>"]
  n2373a12b["discovery-receipt.json#45<br/><code>2373a12b</code>"]
  ne181b55c["discovery-receipt.json#46<br/><code>e181b55c</code>"]
  nfcb0d134["discovery-receipt.json#47<br/><code>fcb0d134</code>"]
  nbacb29de["discovery-receipt.json#48<br/><code>bacb29de</code>"]
  nb6168cca["discovery-receipt.json#49<br/><code>b6168cca</code>"]
  n977ccc96["discovery-receipt.json#50<br/><code>977ccc96</code>"]
  n224c6212["discovery-receipt.json#51<br/><code>224c6212</code>"]
  n522c70d0["discovery-receipt.json#52<br/><code>522c70d0</code>"]
  nfee34a58["discovery-receipt.json#53<br/><code>fee34a58</code>"]
  ne43e45e2["discovery-receipt.json#54<br/><code>e43e45e2</code>"]
  nddfc618a["discovery-receipt.json#55<br/><code>ddfc618a</code>"]
  n14063e14["discovery-receipt.json#56<br/><code>14063e14</code>"]
  n911e6419["discovery-receipt.json#57<br/><code>911e6419</code>"]
  n58e9b56e["discovery-receipt.json#58<br/><code>58e9b56e</code>"]
  n509ea5e7["discovery-receipt.json#59<br/><code>509ea5e7</code>"]
  n1a98bbfe["discovery-receipt.json#60<br/><code>1a98bbfe</code>"]
  ndd3db21e["discovery-receipt.json#61<br/><code>dd3db21e</code>"]
  n5b95854d["discovery-receipt.json#62<br/><code>5b95854d</code>"]
  n34d266e2["discovery-receipt.json#63<br/><code>34d266e2</code>"]
  nc1a72538["discovery-receipt.json#64<br/><code>c1a72538</code>"]
  na060df6d["discovery-receipt.json#65<br/><code>a060df6d</code>"]
  n49857f3d["discovery-receipt.json#66<br/><code>49857f3d</code>"]
  n4facca0e["discovery-receipt.json#67<br/><code>4facca0e</code>"]
  n388919c4["discovery-receipt.json#68<br/><code>388919c4</code>"]
  n79c55b0e["discovery-receipt.json#69<br/><code>79c55b0e</code>"]
  n9c2f5d37["discovery-receipt.json#70<br/><code>9c2f5d37</code>"]
  n5519e794["discovery-receipt.json#71<br/><code>5519e794</code>"]
  n0bd98a79["discovery-receipt.json#72<br/><code>0bd98a79</code>"]
  n241fdc85["discovery-receipt.json#73<br/><code>241fdc85</code>"]
  nad3e98ff["discovery-receipt.json#74<br/><code>ad3e98ff</code>"]
  n4b235ece["discovery-receipt.json#75<br/><code>4b235ece</code>"]
  n8d0cbb81["discovery-receipt.json#76<br/><code>8d0cbb81</code>"]
  n15c0af2a["discovery-receipt.json#77<br/><code>15c0af2a</code>"]
  n15f256d2["discovery-receipt.json#78<br/><code>15f256d2</code>"]
  na8ee8acc["discovery-receipt.json#79<br/><code>a8ee8acc</code>"]
  n3df14be3["discovery-receipt.json#80<br/><code>3df14be3</code>"]
  nb54be111["discovery-receipt.json#81<br/><code>b54be111</code>"]
  n41beddd1["discovery-receipt.json#82<br/><code>41beddd1</code>"]
  nf279221f["discovery-receipt.json#83<br/><code>f279221f</code>"]
  nfb013760["discovery-receipt.json#84<br/><code>fb013760</code>"]
  n40c27993["discovery-receipt.json#85<br/><code>40c27993</code>"]
  n8218fa0c["discovery-receipt.json#86<br/><code>8218fa0c</code>"]
  n24a05d66["discovery-receipt.json#87<br/><code>24a05d66</code>"]
  n2a0ed400["discovery-receipt.json#88<br/><code>2a0ed400</code>"]
  nb433a178["discovery-receipt.json#89<br/><code>b433a178</code>"]
  n0720d35d["discovery-receipt.json#90<br/><code>0720d35d</code>"]
  n82cb4ece["discovery-receipt.json#91<br/><code>82cb4ece</code>"]
  nfe207ecc["discovery-receipt.json#92<br/><code>fe207ecc</code>"]
  n5e203120["discovery-receipt.json#93<br/><code>5e203120</code>"]
  nd3138fed["discovery-receipt.json#94<br/><code>d3138fed</code>"]
  nefcde21c["discovery-receipt.json#95<br/><code>efcde21c</code>"]
  n741604f2["discovery-receipt.json#96<br/><code>741604f2</code>"]
  n978bfe09["discovery-receipt.json#97<br/><code>978bfe09</code>"]
  n2b29ed20["discovery-receipt.json#98<br/><code>2b29ed20</code>"]
  n7e6b75c8["discovery-receipt.json#99<br/><code>7e6b75c8</code>"]
  nd9a2f22c["discovery-receipt.json#100<br/><code>d9a2f22c</code>"]
  nbd363d74["discovery-receipt.json#101<br/><code>bd363d74</code>"]
  nab324106["discovery-receipt.json#102<br/><code>ab324106</code>"]
  n0bc2bf56["discovery-receipt.json#103<br/><code>0bc2bf56</code>"]
  n341011a8["discovery-receipt.json#104<br/><code>341011a8</code>"]
  n1ad1c9ae["discovery-receipt.json#105<br/><code>1ad1c9ae</code>"]
  n43784b02["discovery-receipt.json#106<br/><code>43784b02</code>"]
  ndba0f562["discovery-receipt.json#107<br/><code>dba0f562</code>"]
  n5176dfb2["discovery-receipt.json#108<br/><code>5176dfb2</code>"]
  nc26f348a["discovery-receipt.json#109<br/><code>c26f348a</code>"]
  n952976ee["discovery-receipt.json#110<br/><code>952976ee</code>"]
  n5cd1e71c["discovery-receipt.json#111<br/><code>5cd1e71c</code>"]
  nb3e4ba2c["discovery-receipt.json#112<br/><code>b3e4ba2c</code>"]
  n92798c8e["discovery-receipt.json#113<br/><code>92798c8e</code>"]
  nae56da5f["discovery-receipt.json#114<br/><code>ae56da5f</code>"]
  n7669e52a["discovery-receipt.json#115<br/><code>7669e52a</code>"]
  n9f7d6186["discovery-receipt.json#116<br/><code>9f7d6186</code>"]
  na6878b5e["discovery-receipt.json#117<br/><code>a6878b5e</code>"]
  n8766c22e["discovery-receipt.json#118<br/><code>8766c22e</code>"]
  n83352abd["discovery-receipt.json#119<br/><code>83352abd</code>"]
  nb0dd0348["discovery-receipt.json#120<br/><code>b0dd0348</code>"]
  n8b9de8a0["discovery-receipt.json#121<br/><code>8b9de8a0</code>"]
  na5014947["discovery-receipt.json#122<br/><code>a5014947</code>"]
  n77eb5fa8["discovery-receipt.json#123<br/><code>77eb5fa8</code>"]
  n693d479c["discovery-receipt.json#124<br/><code>693d479c</code>"]
  n975df879["discovery-receipt.json#125<br/><code>975df879</code>"]
  n49631729["discovery-receipt.json#126<br/><code>49631729</code>"]
  n80d35e66["discovery-receipt.json#127<br/><code>80d35e66</code>"]
  n977d7b45["discovery-receipt.json#128<br/><code>977d7b45</code>"]
  nfacac8b3["discovery-receipt.json#129<br/><code>facac8b3</code>"]
  n6a69d442["discovery-receipt.json#130<br/><code>6a69d442</code>"]
  n18bcbd5b["discovery-receipt.json#131<br/><code>18bcbd5b</code>"]
  n6135ca8d["discovery-receipt.json#132<br/><code>6135ca8d</code>"]
  n1f9419c4["discovery-receipt.json#133<br/><code>1f9419c4</code>"]
  n53ede1b9["discovery-receipt.json#134<br/><code>53ede1b9</code>"]
  n91da274a["discovery-receipt.json#135<br/><code>91da274a</code>"]
  nbe2652a8["discovery-receipt.json#136<br/><code>be2652a8</code>"]
  n142ca731["discovery-receipt.json#137<br/><code>142ca731</code>"]
  n77143843["discovery-receipt.json#138<br/><code>77143843</code>"]
  ncd55d6c5["discovery-receipt.json#139<br/><code>cd55d6c5</code>"]
  nc06bc8d9["discovery-receipt.json#140<br/><code>c06bc8d9</code>"]
  n9abadf84["discovery-receipt.json#141<br/><code>9abadf84</code>"]
  nd001d1a8["discovery-receipt.json#142<br/><code>d001d1a8</code>"]
  n5d77dcce["discovery-receipt.json#143<br/><code>5d77dcce</code>"]
  n0b607c9a["discovery-receipt.json#144<br/><code>0b607c9a</code>"]
  n6dd03554["discovery-receipt.json#145<br/><code>6dd03554</code>"]
  n35efc9c5["discovery-receipt.json#146<br/><code>35efc9c5</code>"]
  n7417fc13["discovery-receipt.json#147<br/><code>7417fc13</code>"]
  n3ed45ce8["discovery-receipt.json#148<br/><code>3ed45ce8</code>"]
  n477284bf["discovery-receipt.json#149<br/><code>477284bf</code>"]
  nb3f1dee6["discovery-receipt.json#150<br/><code>b3f1dee6</code>"]
  n8a051401["discovery-receipt.json#151<br/><code>8a051401</code>"]
  nec216080["discovery-receipt.json#152<br/><code>ec216080</code>"]
  nc5825e31["discovery-receipt.json#153<br/><code>c5825e31</code>"]
  n81f274db["discovery-receipt.json#154<br/><code>81f274db</code>"]
  nf8ab687a["discovery-receipt.json#155<br/><code>f8ab687a</code>"]
  n8d2f2795["discovery-receipt.json#156<br/><code>8d2f2795</code>"]
  n6fc1ecdb["discovery-receipt.json#157<br/><code>6fc1ecdb</code>"]
  n8aaf695e["discovery-receipt.json#158<br/><code>8aaf695e</code>"]
  nc0f06afd["discovery-receipt.json#159<br/><code>c0f06afd</code>"]
  n4a20a14e["discovery-receipt.json#160<br/><code>4a20a14e</code>"]
  n23f83aec["discovery-receipt.json#161<br/><code>23f83aec</code>"]
  n68a551c3["discovery-receipt.json#162<br/><code>68a551c3</code>"]
  n26f4e29f["discovery-receipt.json#163<br/><code>26f4e29f</code>"]
  nb1a8290e["discovery-receipt.json#164<br/><code>b1a8290e</code>"]
  nc4b4447b["discovery-receipt.json#165<br/><code>c4b4447b</code>"]
  n006bf915["discovery-receipt.json#166<br/><code>006bf915</code>"]
  n76d93f34["discovery-receipt.json#167<br/><code>76d93f34</code>"]
  nc8fcae20["discovery-receipt.json#168<br/><code>c8fcae20</code>"]
  nc8c16089["discovery-receipt.json#169<br/><code>c8c16089</code>"]
  n5859aebd["discovery-receipt.json#170<br/><code>5859aebd</code>"]
  n0ab17ff1["discovery-receipt.json#171<br/><code>0ab17ff1</code>"]
  n7f310b18["discovery-receipt.json#172<br/><code>7f310b18</code>"]
  n60a396c4["discovery-receipt.json#173<br/><code>60a396c4</code>"]
  nc4568216["discovery-receipt.json#174<br/><code>c4568216</code>"]
  nf379a84c["discovery-receipt.json#175<br/><code>f379a84c</code>"]
  n39271cc8["discovery-receipt.json#176<br/><code>39271cc8</code>"]
  n4c4b4d3e["discovery-receipt.json#177<br/><code>4c4b4d3e</code>"]
  n48a6aae5["discovery-receipt.json#178<br/><code>48a6aae5</code>"]
  ncecd3653["discovery-receipt.json#179<br/><code>cecd3653</code>"]
  n0129a78c["discovery-receipt.json#180<br/><code>0129a78c</code>"]
  ncc7de7e6["discovery-receipt.json#181<br/><code>cc7de7e6</code>"]
  n878ae476["discovery-receipt.json#182<br/><code>878ae476</code>"]
  n578ca390["discovery-receipt.json#183<br/><code>578ca390</code>"]
  n99c419b7["discovery-receipt.json#184<br/><code>99c419b7</code>"]
  nca023116["discovery-receipt.json#185<br/><code>ca023116</code>"]
  n0d971d18["discovery-receipt.json#186<br/><code>0d971d18</code>"]
  ncca58042["discovery-receipt.json#187<br/><code>cca58042</code>"]
  n691829e8["discovery-receipt.json#188<br/><code>691829e8</code>"]
  nae0146c1["discovery-receipt.json#189<br/><code>ae0146c1</code>"]
  n063f07a9["discovery-receipt.json#190<br/><code>063f07a9</code>"]
  ne2688c27["discovery-receipt.json#191<br/><code>e2688c27</code>"]
  n041d6b40["discovery-receipt.json#192<br/><code>041d6b40</code>"]
  n9621f29e["discovery-receipt.json#193<br/><code>9621f29e</code>"]
  n1aa4c78e["discovery-receipt.json#194<br/><code>1aa4c78e</code>"]
  na0ac888c["discovery-receipt.json#195<br/><code>a0ac888c</code>"]
  nbb59f947["discovery-receipt.json#196<br/><code>bb59f947</code>"]
  n02edf583["discovery-receipt.json#197<br/><code>02edf583</code>"]
  n29f8fce2["discovery-receipt.json#198<br/><code>29f8fce2</code>"]
  n41743c6d["discovery-receipt.json#199<br/><code>41743c6d</code>"]
  ndc84e450["discovery-receipt.json#200<br/><code>dc84e450</code>"]
  n93f407a3["discovery-receipt.json#201<br/><code>93f407a3</code>"]
  n444dc5bc["discovery-receipt.json#202<br/><code>444dc5bc</code>"]
  n9f1161bf["discovery-receipt.json#203<br/><code>9f1161bf</code>"]
  na7e18658["discovery-receipt.json#204<br/><code>a7e18658</code>"]
  n2b62f369["discovery-receipt.json#205<br/><code>2b62f369</code>"]
  nbd74e827["discovery-receipt.json#206<br/><code>bd74e827</code>"]
  n838cffa0["discovery-receipt.json#207<br/><code>838cffa0</code>"]
  n4e2f6847["discovery-receipt.json#208<br/><code>4e2f6847</code>"]
  nbff99dbf["discovery-receipt.json#209<br/><code>bff99dbf</code>"]
  n2cfa694a["discovery-receipt.json#210<br/><code>2cfa694a</code>"]
  n1ff80eed["discovery-receipt.json#211<br/><code>1ff80eed</code>"]
  ne04adb39["discovery-receipt.json#212<br/><code>e04adb39</code>"]
  n2c9c4e8f["discovery-receipt.json#213<br/><code>2c9c4e8f</code>"]
  n589a1b65["discovery-receipt.json#214<br/><code>589a1b65</code>"]
  nff911332["discovery-receipt.json#215<br/><code>ff911332</code>"]
  neff69341["discovery-receipt.json#216<br/><code>eff69341</code>"]
  nff8c0300["discovery-receipt.json#217<br/><code>ff8c0300</code>"]
  nf75173ec["discovery-receipt.json#218<br/><code>f75173ec</code>"]
  nf46881cf["discovery-receipt.json#219<br/><code>f46881cf</code>"]
  n1b34b755["discovery-receipt.json#220<br/><code>1b34b755</code>"]
  ndb0b4fbf["discovery-receipt.json#221<br/><code>db0b4fbf</code>"]
  n238a5d5c["discovery-receipt.json#222<br/><code>238a5d5c</code>"]
  nb3544934["discovery-receipt.json#223<br/><code>b3544934</code>"]
  nb9e1b51a["discovery-receipt.json#224<br/><code>b9e1b51a</code>"]
  na114359c["discovery-receipt.json#225<br/><code>a114359c</code>"]
  n5a12452b["discovery-receipt.json#226<br/><code>5a12452b</code>"]
  n3cb9ae35["discovery-receipt.json#227<br/><code>3cb9ae35</code>"]
  n1e2d9f31["discovery-receipt.json#228<br/><code>1e2d9f31</code>"]
  n06f14c52["discovery-receipt.json#229<br/><code>06f14c52</code>"]
  ne25204d4["flaws-receipt.json<br/><code>e25204d4</code>"]
  na322c914["formulas-receipt.json<br/><code>a322c914</code>"]
  n4a32430e["formulas-receipt.json#0<br/><code>4a32430e</code>"]
  n5bba049f["formulas-receipt.json#1<br/><code>5bba049f</code>"]
  n88921ccf["formulas-receipt.json#2<br/><code>88921ccf</code>"]
  nd9c1ac8f["formulas-receipt.json#3<br/><code>d9c1ac8f</code>"]
  n9b4d646f["formulas-receipt.json#4<br/><code>9b4d646f</code>"]
  nfe9795f3["formulas-receipt.json#5<br/><code>fe9795f3</code>"]
  nac0ffb0a["formulas-receipt.json#6<br/><code>ac0ffb0a</code>"]
  n9a992ef6["formulas-receipt.json#7<br/><code>9a992ef6</code>"]
  nff0cc644["formulas-receipt.json#8<br/><code>ff0cc644</code>"]
  nb700a8e1["formulas-receipt.json#9<br/><code>b700a8e1</code>"]
  nab6cacb0["formulas-receipt.json#10<br/><code>ab6cacb0</code>"]
  ne292e9da["formulas-receipt.json#11<br/><code>e292e9da</code>"]
  n66d19107["formulas-receipt.json#12<br/><code>66d19107</code>"]
  n2adae0ad["formulas-receipt.json#13<br/><code>2adae0ad</code>"]
  nb81cf544["formulas-receipt.json#14<br/><code>b81cf544</code>"]
  n23ccc37a["formulas-receipt.json#15<br/><code>23ccc37a</code>"]
  nb54f0d74["formulas-receipt.json#16<br/><code>b54f0d74</code>"]
  n8e423bcf["formulas-receipt.json#17<br/><code>8e423bcf</code>"]
  n688d65d9["formulas-receipt.json#18<br/><code>688d65d9</code>"]
  n4de40d8e["formulas-receipt.json#19<br/><code>4de40d8e</code>"]
  nde5d17d4["formulas-receipt.json#20<br/><code>de5d17d4</code>"]
  n5ebadc0e["formulas-receipt.json#21<br/><code>5ebadc0e</code>"]
  n392b8db5["formulas-receipt.json#22<br/><code>392b8db5</code>"]
  ndb1aed2c["formulas-receipt.json#23<br/><code>db1aed2c</code>"]
  n7e93edd6["formulas-receipt.json#24<br/><code>7e93edd6</code>"]
  nafbbaa23["formulas-receipt.json#25<br/><code>afbbaa23</code>"]
  n05042e3b["formulas-receipt.json#26<br/><code>05042e3b</code>"]
  n14c2d2ac["formulas-receipt.json#27<br/><code>14c2d2ac</code>"]
  nc2b7fde2["formulas-receipt.json#28<br/><code>c2b7fde2</code>"]
  n0d2c2845["formulas-receipt.json#29<br/><code>0d2c2845</code>"]
  nc68c5eb2["formulas-receipt.json#30<br/><code>c68c5eb2</code>"]
  na8983d8d["formulas-receipt.json#31<br/><code>a8983d8d</code>"]
  n9c0cd1ce["formulas-receipt.json#32<br/><code>9c0cd1ce</code>"]
  na40e6f7a["formulas-receipt.json#33<br/><code>a40e6f7a</code>"]
  n85ccab05["formulas-receipt.json#34<br/><code>85ccab05</code>"]
  nc20d20ca["formulas-receipt.json#35<br/><code>c20d20ca</code>"]
  nb967b762["formulas-receipt.json#36<br/><code>b967b762</code>"]
  n709254d3["formulas-receipt.json#37<br/><code>709254d3</code>"]
  ncf64efd7["formulas-receipt.json#38<br/><code>cf64efd7</code>"]
  nccdea6c9["formulas-receipt.json#39<br/><code>ccdea6c9</code>"]
  n1c9d5d9a["formulas-receipt.json#40<br/><code>1c9d5d9a</code>"]
  n1cc25106["formulas-receipt.json#41<br/><code>1cc25106</code>"]
  n03ac01a3["formulas-receipt.json#42<br/><code>03ac01a3</code>"]
  n1ffef034["formulas-receipt.json#43<br/><code>1ffef034</code>"]
  nb4df7b0d["formulas-receipt.json#44<br/><code>b4df7b0d</code>"]
  nfd714ceb["formulas-receipt.json#45<br/><code>fd714ceb</code>"]
  nb9461333["formulas-receipt.json#46<br/><code>b9461333</code>"]
  na70a65e8["formulas-receipt.json#47<br/><code>a70a65e8</code>"]
  n5694ead0["formulas-receipt.json#48<br/><code>5694ead0</code>"]
  n56feab7e["formulas-receipt.json#49<br/><code>56feab7e</code>"]
  n00026851["formulas-receipt.json#50<br/><code>00026851</code>"]
  ne7625e66["formulas-receipt.json#51<br/><code>e7625e66</code>"]
  n267e7b47["formulas-receipt.json#52<br/><code>267e7b47</code>"]
  nca5d87a0["formulas-receipt.json#53<br/><code>ca5d87a0</code>"]
  n2028f05e["formulas-receipt.json#54<br/><code>2028f05e</code>"]
  n5828cd27["formulas-receipt.json#55<br/><code>5828cd27</code>"]
  n0340dba0["formulas-receipt.json#56<br/><code>0340dba0</code>"]
  n1ade8091["formulas-receipt.json#57<br/><code>1ade8091</code>"]
  n60812a2c["formulas-receipt.json#58<br/><code>60812a2c</code>"]
  nf5617442["formulas-receipt.json#59<br/><code>f5617442</code>"]
  n733ef269["formulas-receipt.json#60<br/><code>733ef269</code>"]
  n3a3091b3["formulas-receipt.json#61<br/><code>3a3091b3</code>"]
  n5261c853["formulas-receipt.json#62<br/><code>5261c853</code>"]
  n068de534["formulas-receipt.json#63<br/><code>068de534</code>"]
  n261dcf72["formulas-receipt.json#64<br/><code>261dcf72</code>"]
  n93853848["formulas-receipt.json#65<br/><code>93853848</code>"]
  n38dc3b1c["formulas-receipt.json#66<br/><code>38dc3b1c</code>"]
  n9ecc2771["formulas-receipt.json#67<br/><code>9ecc2771</code>"]
  n0960fca9["formulas-receipt.json#68<br/><code>0960fca9</code>"]
  nc74b8710["formulas-receipt.json#69<br/><code>c74b8710</code>"]
  n571e18c5["formulas-receipt.json#70<br/><code>571e18c5</code>"]
  n39cfcdad["formulas-receipt.json#71<br/><code>39cfcdad</code>"]
  nfd75a2ee["formulas-receipt.json#72<br/><code>fd75a2ee</code>"]
  n4a6aed6a["formulas-receipt.json#73<br/><code>4a6aed6a</code>"]
  nf6f60101["formulas-receipt.json#74<br/><code>f6f60101</code>"]
  ncb398261["formulas-receipt.json#75<br/><code>cb398261</code>"]
  n9ea4f111["formulas-receipt.json#76<br/><code>9ea4f111</code>"]
  n1491533a["formulas-receipt.json#77<br/><code>1491533a</code>"]
  n55934d81["formulas-receipt.json#78<br/><code>55934d81</code>"]
  n75962712["fuse-receipt.json<br/><code>75962712</code>"]
  n1a611e49["heat-receipt.json<br/><code>1a611e49</code>"]
  n97a1c5a2["heat-receipt.json#0<br/><code>97a1c5a2</code>"]
  n866a894e["heat-receipt.json#1<br/><code>866a894e</code>"]
  n3c978e25["heat-receipt.json#2<br/><code>3c978e25</code>"]
  nf093510e["heat-receipt.json#3<br/><code>f093510e</code>"]
  nbee09b23["heat-receipt.json#4<br/><code>bee09b23</code>"]
  nc6a9450b["heat-receipt.json#5<br/><code>c6a9450b</code>"]
  ne9647aba["heat-receipt.json#6<br/><code>e9647aba</code>"]
  nc5672ca9["heat-receipt.json#7<br/><code>c5672ca9</code>"]
  n31dd3624["heat-receipt.json#8<br/><code>31dd3624</code>"]
  nec96b056["heat-receipt.json#9<br/><code>ec96b056</code>"]
  ne39aab93["heat-receipt.json#10<br/><code>e39aab93</code>"]
  n415cf0b0["heat-receipt.json#11<br/><code>415cf0b0</code>"]
  n1c993376["heat-receipt.json#12<br/><code>1c993376</code>"]
  n7c1730a4["heat-receipt.json#13<br/><code>7c1730a4</code>"]
  nd1e0990f["heat-receipt.json#14<br/><code>d1e0990f</code>"]
  nd73e0d41["heat-receipt.json#15<br/><code>d73e0d41</code>"]
  n08c54403["heat-receipt.json#16<br/><code>08c54403</code>"]
  ndf45ffca["heat-receipt.json#17<br/><code>df45ffca</code>"]
  nbd4f03bb["heat-receipt.json#18<br/><code>bd4f03bb</code>"]
  nc71e8315["heat-receipt.json#19<br/><code>c71e8315</code>"]
  n2489c5a6["heat-receipt.json#20<br/><code>2489c5a6</code>"]
  na82773e5["heat-receipt.json#21<br/><code>a82773e5</code>"]
  ndf255612["heat-receipt.json#22<br/><code>df255612</code>"]
  n46dc3890["heat-receipt.json#23<br/><code>46dc3890</code>"]
  nbb661013["heat-receipt.json#24<br/><code>bb661013</code>"]
  n34c898e2["heat-receipt.json#25<br/><code>34c898e2</code>"]
  na7e6c5e4["heat-receipt.json#26<br/><code>a7e6c5e4</code>"]
  n48e1f6ec["heat-receipt.json#27<br/><code>48e1f6ec</code>"]
  nf9946f31["heat-receipt.json#28<br/><code>f9946f31</code>"]
  n05e3fa77["heat-receipt.json#29<br/><code>05e3fa77</code>"]
  nbacea7e5["heat-receipt.json#30<br/><code>bacea7e5</code>"]
  n3e84abf8["heat-receipt.json#31<br/><code>3e84abf8</code>"]
  ncf0dbc16["heat-receipt.json#32<br/><code>cf0dbc16</code>"]
  na2920cd9["heat-receipt.json#33<br/><code>a2920cd9</code>"]
  n51420a65["heat-receipt.json#34<br/><code>51420a65</code>"]
  n9768fd77["heat-receipt.json#35<br/><code>9768fd77</code>"]
  n0a455431["heat-receipt.json#36<br/><code>0a455431</code>"]
  n53d8939e["heat-receipt.json#37<br/><code>53d8939e</code>"]
  n51d29a9b["heat-receipt.json#38<br/><code>51d29a9b</code>"]
  n61de4584["heat-receipt.json#39<br/><code>61de4584</code>"]
  n9899ee9b["lattice-receipt.json<br/><code>9899ee9b</code>"]
  nce47701e["lean-receipt.json<br/><code>ce47701e</code>"]
  n5f898432["lean-receipt.json#0<br/><code>5f898432</code>"]
  nb0a02592["lean-receipt.json#1<br/><code>b0a02592</code>"]
  nd091db71["lean-receipt.json#2<br/><code>d091db71</code>"]
  n99ea1a16["lean-receipt.json#3<br/><code>99ea1a16</code>"]
  n45850654["lean-receipt.json#4<br/><code>45850654</code>"]
  n91cb88e5["lean-receipt.json#5<br/><code>91cb88e5</code>"]
  n88ed2fd6["lean-receipt.json#6<br/><code>88ed2fd6</code>"]
  n72b472f8["lean-receipt.json#7<br/><code>72b472f8</code>"]
  n5da25169["lean-receipt.json#8<br/><code>5da25169</code>"]
  nebe71619["lean-receipt.json#9<br/><code>ebe71619</code>"]
  ne32b44fa["lean-receipt.json#10<br/><code>e32b44fa</code>"]
  ne2ab650a["lean-receipt.json#11<br/><code>e2ab650a</code>"]
  n0392297c["lean-receipt.json#12<br/><code>0392297c</code>"]
  na28390b3["lean-receipt.json#13<br/><code>a28390b3</code>"]
  n7cd59701["lean-receipt.json#14<br/><code>7cd59701</code>"]
  ne2502ea8["lean-receipt.json#15<br/><code>e2502ea8</code>"]
  n0f00f681["lean-receipt.json#16<br/><code>0f00f681</code>"]
  nfb866b22["lean-receipt.json#17<br/><code>fb866b22</code>"]
  n32ad5850["lean-receipt.json#18<br/><code>32ad5850</code>"]
  ne78799aa["lean-receipt.json#19<br/><code>e78799aa</code>"]
  nac86d2bf["lean-receipt.json#20<br/><code>ac86d2bf</code>"]
  nfff55c10["lean-receipt.json#21<br/><code>fff55c10</code>"]
  n34fa6e85["lean-receipt.json#22<br/><code>34fa6e85</code>"]
  nea4be644["lean-receipt.json#23<br/><code>ea4be644</code>"]
  nc52acb04["lean-receipt.json#24<br/><code>c52acb04</code>"]
  naaa9dd99["lean-receipt.json#25<br/><code>aaa9dd99</code>"]
  nea70c48b["lean-receipt.json#26<br/><code>ea70c48b</code>"]
  ne5faa350["lean-receipt.json#27<br/><code>e5faa350</code>"]
  n26c6e3c1["lean-receipt.json#28<br/><code>26c6e3c1</code>"]
  nea5285cb["lean-receipt.json#29<br/><code>ea5285cb</code>"]
  n6d5d593e["lean-receipt.json#30<br/><code>6d5d593e</code>"]
  n978a9b27["lean-receipt.json#31<br/><code>978a9b27</code>"]
  n7999dec0["lean-receipt.json#32<br/><code>7999dec0</code>"]
  n57ef0769["lean-receipt.json#33<br/><code>57ef0769</code>"]
  n1618ffa0["lean-receipt.json#34<br/><code>1618ffa0</code>"]
  n2571e715["lean-receipt.json#35<br/><code>2571e715</code>"]
  n4cb74d48["lean-receipt.json#36<br/><code>4cb74d48</code>"]
  n691f7138["lean-receipt.json#37<br/><code>691f7138</code>"]
  n7dafa281["lean-receipt.json#38<br/><code>7dafa281</code>"]
  na2a3c3be["lean-receipt.json#39<br/><code>a2a3c3be</code>"]
  n8ba32930["lean-receipt.json#40<br/><code>8ba32930</code>"]
  n53e970bf["lean-receipt.json#41<br/><code>53e970bf</code>"]
  n21d507e7["lean-receipt.json#42<br/><code>21d507e7</code>"]
  n58229458["lean-receipt.json#43<br/><code>58229458</code>"]
  nf8dbb81d["lean-receipt.json#44<br/><code>f8dbb81d</code>"]
  n886f6198["lean-receipt.json#45<br/><code>886f6198</code>"]
  n4f933df7["lean-receipt.json#46<br/><code>4f933df7</code>"]
  n61722f28["lean-receipt.json#47<br/><code>61722f28</code>"]
  n103fc533["lean-receipt.json#48<br/><code>103fc533</code>"]
  nadd7d40f["lean-receipt.json#49<br/><code>add7d40f</code>"]
  nddeeb3a5["lean-receipt.json#50<br/><code>ddeeb3a5</code>"]
  n1c04b770["lean-receipt.json#51<br/><code>1c04b770</code>"]
  n22294fc2["lean-receipt.json#52<br/><code>22294fc2</code>"]
  n2cb8d64c["lean-receipt.json#53<br/><code>2cb8d64c</code>"]
  n29e530eb["lean-receipt.json#54<br/><code>29e530eb</code>"]
  na29f7310["lean-receipt.json#55<br/><code>a29f7310</code>"]
  nc74da606["lean-receipt.json#56<br/><code>c74da606</code>"]
  n52fc753b["lean-receipt.json#57<br/><code>52fc753b</code>"]
  n604e2da0["lean-receipt.json#58<br/><code>604e2da0</code>"]
  nda2618dd["lean-receipt.json#59<br/><code>da2618dd</code>"]
  n67e299cb["lean-receipt.json#60<br/><code>67e299cb</code>"]
  ndc055ebd["lean-receipt.json#61<br/><code>dc055ebd</code>"]
  n97d40d65["lean-receipt.json#62<br/><code>97d40d65</code>"]
  n30ce2a88["lean-receipt.json#63<br/><code>30ce2a88</code>"]
  n26a9f7f9["lean-receipt.json#64<br/><code>26a9f7f9</code>"]
  n35972c94["lean-receipt.json#65<br/><code>35972c94</code>"]
  n577a6930["lean-receipt.json#66<br/><code>577a6930</code>"]
  nd160ceff["lean-receipt.json#67<br/><code>d160ceff</code>"]
  nd82f710d["lean-receipt.json#68<br/><code>d82f710d</code>"]
  n13f26e08["lean-receipt.json#69<br/><code>13f26e08</code>"]
  n877dbbfc["lean-receipt.json#70<br/><code>877dbbfc</code>"]
  na295c289["lean-receipt.json#71<br/><code>a295c289</code>"]
  n2919be93["lean-receipt.json#72<br/><code>2919be93</code>"]
  nc61c4a87["lean-receipt.json#73<br/><code>c61c4a87</code>"]
  n550ffb63["lean-receipt.json#74<br/><code>550ffb63</code>"]
  n2f9a33f5["lean-receipt.json#75<br/><code>2f9a33f5</code>"]
  n9ed7a49b["lean-receipt.json#76<br/><code>9ed7a49b</code>"]
  n8f16deb2["lean-receipt.json#77<br/><code>8f16deb2</code>"]
  n39abc13f["lean-receipt.json#78<br/><code>39abc13f</code>"]
  n03086476["lean-receipt.json#79<br/><code>03086476</code>"]
  n00d8233a["lean-receipt.json#80<br/><code>00d8233a</code>"]
  nc91e4aa9["lean-receipt.json#81<br/><code>c91e4aa9</code>"]
  n1fb0f5b9["lean-receipt.json#82<br/><code>1fb0f5b9</code>"]
  nd8b3b2e7["lean-receipt.json#83<br/><code>d8b3b2e7</code>"]
  n34debd66["lean-receipt.json#84<br/><code>34debd66</code>"]
  n94aa7b23["lean-receipt.json#85<br/><code>94aa7b23</code>"]
  n06cdc78f["lean-receipt.json#86<br/><code>06cdc78f</code>"]
  n05430847["lean-receipt.json#87<br/><code>05430847</code>"]
  neb625bd8["lean-receipt.json#88<br/><code>eb625bd8</code>"]
  nec8220e4["lean-receipt.json#89<br/><code>ec8220e4</code>"]
  nd544b683["lean-receipt.json#90<br/><code>d544b683</code>"]
  neef17a1b["lean-receipt.json#91<br/><code>eef17a1b</code>"]
  n13bbc8fe["lean-receipt.json#92<br/><code>13bbc8fe</code>"]
  nfa8c42ff["lean-receipt.json#93<br/><code>fa8c42ff</code>"]
  n29b2740d["lean-receipt.json#94<br/><code>29b2740d</code>"]
  nf76cba61["lean-receipt.json#95<br/><code>f76cba61</code>"]
  ncd9d4a9c["lean-receipt.json#96<br/><code>cd9d4a9c</code>"]
  n8ac6bd4c["lean-receipt.json#97<br/><code>8ac6bd4c</code>"]
  n9b1f4e46["lean-receipt.json#98<br/><code>9b1f4e46</code>"]
  n865511cc["lean-receipt.json#99<br/><code>865511cc</code>"]
  n11de06b1["lean-receipt.json#100<br/><code>11de06b1</code>"]
  n5343062d["lean-receipt.json#101<br/><code>5343062d</code>"]
  nb873a347["lean-receipt.json#102<br/><code>b873a347</code>"]
  n5ebf0baa["lean-receipt.json#103<br/><code>5ebf0baa</code>"]
  necbbb323["lean-receipt.json#104<br/><code>ecbbb323</code>"]
  n29fef8e1["lean-receipt.json#105<br/><code>29fef8e1</code>"]
  n98a07080["lean-receipt.json#106<br/><code>98a07080</code>"]
  n67bc2ed9["lean-receipt.json#107<br/><code>67bc2ed9</code>"]
  n9c0502d7["lean-receipt.json#108<br/><code>9c0502d7</code>"]
  na65712bb["lean-receipt.json#109<br/><code>a65712bb</code>"]
  nd475d8d3["lean-receipt.json#110<br/><code>d475d8d3</code>"]
  n0b520ef4["lean-receipt.json#111<br/><code>0b520ef4</code>"]
  n7f07a76e["lean-receipt.json#112<br/><code>7f07a76e</code>"]
  n3242e9cc["lean-receipt.json#113<br/><code>3242e9cc</code>"]
  ne18c022e["lean-receipt.json#114<br/><code>e18c022e</code>"]
  n682c36e7["lean-receipt.json#115<br/><code>682c36e7</code>"]
  n5d7c702a["lean-receipt.json#116<br/><code>5d7c702a</code>"]
  n7f402d2b["lean-receipt.json#117<br/><code>7f402d2b</code>"]
  n5d251909["lean-receipt.json#118<br/><code>5d251909</code>"]
  n02d207ac["lean-receipt.json#119<br/><code>02d207ac</code>"]
  nb041ab1b["lean-receipt.json#120<br/><code>b041ab1b</code>"]
  ne3c8228a["lean-receipt.json#121<br/><code>e3c8228a</code>"]
  nde2d9ce9["lean-receipt.json#122<br/><code>de2d9ce9</code>"]
  nc89b4cd8["lean-receipt.json#123<br/><code>c89b4cd8</code>"]
  n9aa288b9["payload-cf-receipt.json<br/><code>9aa288b9</code>"]
  na7073cf3["percall-receipt.json<br/><code>a7073cf3</code>"]
  n705efc2c["refusals-receipt.json<br/><code>705efc2c</code>"]
  n667c1621["test-receipt.json<br/><code>667c1621</code>"]
  ndc60fee8["test-receipt.json#0<br/><code>dc60fee8</code>"]
  n28c91dd4["test-receipt.json#1<br/><code>28c91dd4</code>"]
  nb8f97d4a["test-receipt.json#2<br/><code>b8f97d4a</code>"]
  n65655be9["test-receipt.json#3<br/><code>65655be9</code>"]
  n929feeb1["test-receipt.json#4<br/><code>929feeb1</code>"]
  n24d8da78["test-receipt.json#5<br/><code>24d8da78</code>"]
  neca2c616["test-receipt.json#6<br/><code>eca2c616</code>"]
  n63cc5a2a["test-receipt.json#7<br/><code>63cc5a2a</code>"]
  n25e30882["test-receipt.json#8<br/><code>25e30882</code>"]
  n3e0b11fd["test-receipt.json#9<br/><code>3e0b11fd</code>"]
  n92b70203["test-receipt.json#10<br/><code>92b70203</code>"]
  na14d50e0["walls-receipt.json<br/><code>a14d50e0</code>"]
  n56fdc627["readme<br/><code>56fdc627</code>"]
  n4065f6d6 --> n91a0d2da
  n91a0d2da --> nbee88834
  n91a0d2da --> n6cdc9823
  n91a0d2da --> nf844dde8
  n91a0d2da --> ne404747d
  n91a0d2da --> nd507a869
  n91a0d2da --> nd93ebcdd
  n91a0d2da --> n7519b438
  n91a0d2da --> nc441cf73
  n91a0d2da --> ne1808469
  n91a0d2da --> ne91ad963
  n91a0d2da --> n5f7d1086
  n91a0d2da --> n3b7e83c4
  n91a0d2da --> nfc9d5c2a
  n91a0d2da --> nf8027600
  n91a0d2da --> n7a3d3126
  n91a0d2da --> nc190557b
  n91a0d2da --> n8e1a940e
  n91a0d2da --> n3a91314c
  n91a0d2da --> n924c0c9d
  n91a0d2da --> nc9675ec9
  n91a0d2da --> n06a58390
  n91a0d2da --> nd6307a52
  n91a0d2da --> n4e4bc5b7
  n91a0d2da --> n56fdb0c2
  n91a0d2da --> n15a69ea3
  n91a0d2da --> n2dd51618
  n91a0d2da --> n5bc2e782
  n91a0d2da --> n606a37c2
  n91a0d2da --> n1c370d00
  n91a0d2da --> n1c63fa72
  n4065f6d6 --> n0c3b4f5c
  n4065f6d6 --> ncca3ca6c
  ncca3ca6c --> n792ae0a6
  ncca3ca6c --> nc921d1e7
  ncca3ca6c --> n51730c52
  ncca3ca6c --> n40272d45
  ncca3ca6c --> nf3f371ff
  ncca3ca6c --> necee5139
  ncca3ca6c --> nb9f8b321
  ncca3ca6c --> nee5be4de
  ncca3ca6c --> n9244b83e
  ncca3ca6c --> n7180c5ff
  ncca3ca6c --> nf2e3be3a
  ncca3ca6c --> nffa422d3
  ncca3ca6c --> n8224793c
  ncca3ca6c --> n58df9405
  ncca3ca6c --> n3f45a959
  ncca3ca6c --> n37e32cb2
  ncca3ca6c --> n8ddc53e0
  ncca3ca6c --> n7afd865c
  ncca3ca6c --> nab58c8b2
  ncca3ca6c --> n44556097
  ncca3ca6c --> nd7fae280
  ncca3ca6c --> n3f188c88
  ncca3ca6c --> n9de22b63
  ncca3ca6c --> ne384d0b6
  ncca3ca6c --> nd088c492
  ncca3ca6c --> n98d65907
  ncca3ca6c --> na7eac08e
  ncca3ca6c --> nf22b89da
  ncca3ca6c --> n61e95636
  ncca3ca6c --> n18c54424
  ncca3ca6c --> nbf97c6b7
  ncca3ca6c --> nf6c2789c
  ncca3ca6c --> n52808d40
  ncca3ca6c --> n966d4c0a
  ncca3ca6c --> n1dd33907
  ncca3ca6c --> na85335a5
  ncca3ca6c --> nfe6952b6
  ncca3ca6c --> n4c1a5fef
  ncca3ca6c --> na6c95686
  ncca3ca6c --> nd1af9564
  ncca3ca6c --> n5dc232fc
  ncca3ca6c --> nccd0591b
  ncca3ca6c --> n40e8ccc8
  ncca3ca6c --> n6bbb3b7c
  ncca3ca6c --> n29b69888
  ncca3ca6c --> n2373a12b
  ncca3ca6c --> ne181b55c
  ncca3ca6c --> nfcb0d134
  ncca3ca6c --> nbacb29de
  ncca3ca6c --> nb6168cca
  ncca3ca6c --> n977ccc96
  ncca3ca6c --> n224c6212
  ncca3ca6c --> n522c70d0
  ncca3ca6c --> nfee34a58
  ncca3ca6c --> ne43e45e2
  ncca3ca6c --> nddfc618a
  ncca3ca6c --> n14063e14
  ncca3ca6c --> n911e6419
  ncca3ca6c --> n58e9b56e
  ncca3ca6c --> n509ea5e7
  ncca3ca6c --> n1a98bbfe
  ncca3ca6c --> ndd3db21e
  ncca3ca6c --> n5b95854d
  ncca3ca6c --> n34d266e2
  ncca3ca6c --> nc1a72538
  ncca3ca6c --> na060df6d
  ncca3ca6c --> n49857f3d
  ncca3ca6c --> n4facca0e
  ncca3ca6c --> n388919c4
  ncca3ca6c --> n79c55b0e
  ncca3ca6c --> n9c2f5d37
  ncca3ca6c --> n5519e794
  ncca3ca6c --> n0bd98a79
  ncca3ca6c --> n241fdc85
  ncca3ca6c --> nad3e98ff
  ncca3ca6c --> n4b235ece
  ncca3ca6c --> n8d0cbb81
  ncca3ca6c --> n15c0af2a
  ncca3ca6c --> n15f256d2
  ncca3ca6c --> na8ee8acc
  ncca3ca6c --> n3df14be3
  ncca3ca6c --> nb54be111
  ncca3ca6c --> n41beddd1
  ncca3ca6c --> nf279221f
  ncca3ca6c --> nfb013760
  ncca3ca6c --> n40c27993
  ncca3ca6c --> n8218fa0c
  ncca3ca6c --> n24a05d66
  ncca3ca6c --> n2a0ed400
  ncca3ca6c --> nb433a178
  ncca3ca6c --> n0720d35d
  ncca3ca6c --> n82cb4ece
  ncca3ca6c --> nfe207ecc
  ncca3ca6c --> n5e203120
  ncca3ca6c --> nd3138fed
  ncca3ca6c --> nefcde21c
  ncca3ca6c --> n741604f2
  ncca3ca6c --> n978bfe09
  ncca3ca6c --> n2b29ed20
  ncca3ca6c --> n7e6b75c8
  ncca3ca6c --> nd9a2f22c
  ncca3ca6c --> nbd363d74
  ncca3ca6c --> nab324106
  ncca3ca6c --> n0bc2bf56
  ncca3ca6c --> n341011a8
  ncca3ca6c --> n1ad1c9ae
  ncca3ca6c --> n43784b02
  ncca3ca6c --> ndba0f562
  ncca3ca6c --> n5176dfb2
  ncca3ca6c --> nc26f348a
  ncca3ca6c --> n952976ee
  ncca3ca6c --> n5cd1e71c
  ncca3ca6c --> nb3e4ba2c
  ncca3ca6c --> n92798c8e
  ncca3ca6c --> nae56da5f
  ncca3ca6c --> n7669e52a
  ncca3ca6c --> n9f7d6186
  ncca3ca6c --> na6878b5e
  ncca3ca6c --> n8766c22e
  ncca3ca6c --> n83352abd
  ncca3ca6c --> nb0dd0348
  ncca3ca6c --> n8b9de8a0
  ncca3ca6c --> na5014947
  ncca3ca6c --> n77eb5fa8
  ncca3ca6c --> n693d479c
  ncca3ca6c --> n975df879
  ncca3ca6c --> n49631729
  ncca3ca6c --> n80d35e66
  ncca3ca6c --> n977d7b45
  ncca3ca6c --> nfacac8b3
  ncca3ca6c --> n6a69d442
  ncca3ca6c --> n18bcbd5b
  ncca3ca6c --> n6135ca8d
  ncca3ca6c --> n1f9419c4
  ncca3ca6c --> n53ede1b9
  ncca3ca6c --> n91da274a
  ncca3ca6c --> nbe2652a8
  ncca3ca6c --> n142ca731
  ncca3ca6c --> n77143843
  ncca3ca6c --> ncd55d6c5
  ncca3ca6c --> nc06bc8d9
  ncca3ca6c --> n9abadf84
  ncca3ca6c --> nd001d1a8
  ncca3ca6c --> n5d77dcce
  ncca3ca6c --> n0b607c9a
  ncca3ca6c --> n6dd03554
  ncca3ca6c --> n35efc9c5
  ncca3ca6c --> n7417fc13
  ncca3ca6c --> n3ed45ce8
  ncca3ca6c --> n477284bf
  ncca3ca6c --> nb3f1dee6
  ncca3ca6c --> n8a051401
  ncca3ca6c --> nec216080
  ncca3ca6c --> nc5825e31
  ncca3ca6c --> n81f274db
  ncca3ca6c --> nf8ab687a
  ncca3ca6c --> n8d2f2795
  ncca3ca6c --> n6fc1ecdb
  ncca3ca6c --> n8aaf695e
  ncca3ca6c --> nc0f06afd
  ncca3ca6c --> n4a20a14e
  ncca3ca6c --> n23f83aec
  ncca3ca6c --> n68a551c3
  ncca3ca6c --> n26f4e29f
  ncca3ca6c --> nb1a8290e
  ncca3ca6c --> nc4b4447b
  ncca3ca6c --> n006bf915
  ncca3ca6c --> n76d93f34
  ncca3ca6c --> nc8fcae20
  ncca3ca6c --> nc8c16089
  ncca3ca6c --> n5859aebd
  ncca3ca6c --> n0ab17ff1
  ncca3ca6c --> n7f310b18
  ncca3ca6c --> n60a396c4
  ncca3ca6c --> nc4568216
  ncca3ca6c --> nf379a84c
  ncca3ca6c --> n39271cc8
  ncca3ca6c --> n4c4b4d3e
  ncca3ca6c --> n48a6aae5
  ncca3ca6c --> ncecd3653
  ncca3ca6c --> n0129a78c
  ncca3ca6c --> ncc7de7e6
  ncca3ca6c --> n878ae476
  ncca3ca6c --> n578ca390
  ncca3ca6c --> n99c419b7
  ncca3ca6c --> nca023116
  ncca3ca6c --> n0d971d18
  ncca3ca6c --> ncca58042
  ncca3ca6c --> n691829e8
  ncca3ca6c --> nae0146c1
  ncca3ca6c --> n063f07a9
  ncca3ca6c --> ne2688c27
  ncca3ca6c --> n041d6b40
  ncca3ca6c --> n9621f29e
  ncca3ca6c --> n1aa4c78e
  ncca3ca6c --> na0ac888c
  ncca3ca6c --> nbb59f947
  ncca3ca6c --> n02edf583
  ncca3ca6c --> n29f8fce2
  ncca3ca6c --> n41743c6d
  ncca3ca6c --> ndc84e450
  ncca3ca6c --> n93f407a3
  ncca3ca6c --> n444dc5bc
  ncca3ca6c --> n9f1161bf
  ncca3ca6c --> na7e18658
  ncca3ca6c --> n2b62f369
  ncca3ca6c --> nbd74e827
  ncca3ca6c --> n838cffa0
  ncca3ca6c --> n4e2f6847
  ncca3ca6c --> nbff99dbf
  ncca3ca6c --> n2cfa694a
  ncca3ca6c --> n1ff80eed
  ncca3ca6c --> ne04adb39
  ncca3ca6c --> n2c9c4e8f
  ncca3ca6c --> n589a1b65
  ncca3ca6c --> nff911332
  ncca3ca6c --> neff69341
  ncca3ca6c --> nff8c0300
  ncca3ca6c --> nf75173ec
  ncca3ca6c --> nf46881cf
  ncca3ca6c --> n1b34b755
  ncca3ca6c --> ndb0b4fbf
  ncca3ca6c --> n238a5d5c
  ncca3ca6c --> nb3544934
  ncca3ca6c --> nb9e1b51a
  ncca3ca6c --> na114359c
  ncca3ca6c --> n5a12452b
  ncca3ca6c --> n3cb9ae35
  ncca3ca6c --> n1e2d9f31
  ncca3ca6c --> n06f14c52
  n4065f6d6 --> ne25204d4
  n4065f6d6 --> na322c914
  na322c914 --> n4a32430e
  na322c914 --> n5bba049f
  na322c914 --> n88921ccf
  na322c914 --> nd9c1ac8f
  na322c914 --> n9b4d646f
  na322c914 --> nfe9795f3
  na322c914 --> nac0ffb0a
  na322c914 --> n9a992ef6
  na322c914 --> nff0cc644
  na322c914 --> nb700a8e1
  na322c914 --> nab6cacb0
  na322c914 --> ne292e9da
  na322c914 --> n66d19107
  na322c914 --> n2adae0ad
  na322c914 --> nb81cf544
  na322c914 --> n23ccc37a
  na322c914 --> nb54f0d74
  na322c914 --> n8e423bcf
  na322c914 --> n688d65d9
  na322c914 --> n4de40d8e
  na322c914 --> nde5d17d4
  na322c914 --> n5ebadc0e
  na322c914 --> n392b8db5
  na322c914 --> ndb1aed2c
  na322c914 --> n7e93edd6
  na322c914 --> nafbbaa23
  na322c914 --> n05042e3b
  na322c914 --> n14c2d2ac
  na322c914 --> nc2b7fde2
  na322c914 --> n0d2c2845
  na322c914 --> nc68c5eb2
  na322c914 --> na8983d8d
  na322c914 --> n9c0cd1ce
  na322c914 --> na40e6f7a
  na322c914 --> n85ccab05
  na322c914 --> nc20d20ca
  na322c914 --> nb967b762
  na322c914 --> n709254d3
  na322c914 --> ncf64efd7
  na322c914 --> nccdea6c9
  na322c914 --> n1c9d5d9a
  na322c914 --> n1cc25106
  na322c914 --> n03ac01a3
  na322c914 --> n1ffef034
  na322c914 --> nb4df7b0d
  na322c914 --> nfd714ceb
  na322c914 --> nb9461333
  na322c914 --> na70a65e8
  na322c914 --> n5694ead0
  na322c914 --> n56feab7e
  na322c914 --> n00026851
  na322c914 --> ne7625e66
  na322c914 --> n267e7b47
  na322c914 --> nca5d87a0
  na322c914 --> n2028f05e
  na322c914 --> n5828cd27
  na322c914 --> n0340dba0
  na322c914 --> n1ade8091
  na322c914 --> n60812a2c
  na322c914 --> nf5617442
  na322c914 --> n733ef269
  na322c914 --> n3a3091b3
  na322c914 --> n5261c853
  na322c914 --> n068de534
  na322c914 --> n261dcf72
  na322c914 --> n93853848
  na322c914 --> n38dc3b1c
  na322c914 --> n9ecc2771
  na322c914 --> n0960fca9
  na322c914 --> nc74b8710
  na322c914 --> n571e18c5
  na322c914 --> n39cfcdad
  na322c914 --> nfd75a2ee
  na322c914 --> n4a6aed6a
  na322c914 --> nf6f60101
  na322c914 --> ncb398261
  na322c914 --> n9ea4f111
  na322c914 --> n1491533a
  na322c914 --> n55934d81
  n4065f6d6 --> n75962712
  n4065f6d6 --> n1a611e49
  n1a611e49 --> n97a1c5a2
  n1a611e49 --> n866a894e
  n1a611e49 --> n3c978e25
  n1a611e49 --> nf093510e
  n1a611e49 --> nbee09b23
  n1a611e49 --> nc6a9450b
  n1a611e49 --> ne9647aba
  n1a611e49 --> nc5672ca9
  n1a611e49 --> n31dd3624
  n1a611e49 --> nec96b056
  n1a611e49 --> ne39aab93
  n1a611e49 --> n415cf0b0
  n1a611e49 --> n1c993376
  n1a611e49 --> n7c1730a4
  n1a611e49 --> nd1e0990f
  n1a611e49 --> nd73e0d41
  n1a611e49 --> n08c54403
  n1a611e49 --> ndf45ffca
  n1a611e49 --> nbd4f03bb
  n1a611e49 --> nc71e8315
  n1a611e49 --> n2489c5a6
  n1a611e49 --> na82773e5
  n1a611e49 --> ndf255612
  n1a611e49 --> n46dc3890
  n1a611e49 --> nbb661013
  n1a611e49 --> n34c898e2
  n1a611e49 --> na7e6c5e4
  n1a611e49 --> n48e1f6ec
  n1a611e49 --> nf9946f31
  n1a611e49 --> n05e3fa77
  n1a611e49 --> nbacea7e5
  n1a611e49 --> n3e84abf8
  n1a611e49 --> ncf0dbc16
  n1a611e49 --> na2920cd9
  n1a611e49 --> n51420a65
  n1a611e49 --> n9768fd77
  n1a611e49 --> n0a455431
  n1a611e49 --> n53d8939e
  n1a611e49 --> n51d29a9b
  n1a611e49 --> n61de4584
  n4065f6d6 --> n9899ee9b
  n4065f6d6 --> nce47701e
  nce47701e --> n5f898432
  nce47701e --> nb0a02592
  nce47701e --> nd091db71
  nce47701e --> n99ea1a16
  nce47701e --> n45850654
  nce47701e --> n91cb88e5
  nce47701e --> n88ed2fd6
  nce47701e --> n72b472f8
  nce47701e --> n5da25169
  nce47701e --> nebe71619
  nce47701e --> ne32b44fa
  nce47701e --> ne2ab650a
  nce47701e --> n0392297c
  nce47701e --> na28390b3
  nce47701e --> n7cd59701
  nce47701e --> ne2502ea8
  nce47701e --> n0f00f681
  nce47701e --> nfb866b22
  nce47701e --> n32ad5850
  nce47701e --> ne78799aa
  nce47701e --> nac86d2bf
  nce47701e --> nfff55c10
  nce47701e --> n34fa6e85
  nce47701e --> nea4be644
  nce47701e --> nc52acb04
  nce47701e --> naaa9dd99
  nce47701e --> nea70c48b
  nce47701e --> ne5faa350
  nce47701e --> n26c6e3c1
  nce47701e --> nea5285cb
  nce47701e --> n6d5d593e
  nce47701e --> n978a9b27
  nce47701e --> n7999dec0
  nce47701e --> n57ef0769
  nce47701e --> n1618ffa0
  nce47701e --> n2571e715
  nce47701e --> n4cb74d48
  nce47701e --> n691f7138
  nce47701e --> n7dafa281
  nce47701e --> na2a3c3be
  nce47701e --> n8ba32930
  nce47701e --> n53e970bf
  nce47701e --> n21d507e7
  nce47701e --> n58229458
  nce47701e --> nf8dbb81d
  nce47701e --> n886f6198
  nce47701e --> n4f933df7
  nce47701e --> n61722f28
  nce47701e --> n103fc533
  nce47701e --> nadd7d40f
  nce47701e --> nddeeb3a5
  nce47701e --> n1c04b770
  nce47701e --> n22294fc2
  nce47701e --> n2cb8d64c
  nce47701e --> n29e530eb
  nce47701e --> na29f7310
  nce47701e --> nc74da606
  nce47701e --> n52fc753b
  nce47701e --> n604e2da0
  nce47701e --> nda2618dd
  nce47701e --> n67e299cb
  nce47701e --> ndc055ebd
  nce47701e --> n97d40d65
  nce47701e --> n30ce2a88
  nce47701e --> n26a9f7f9
  nce47701e --> n35972c94
  nce47701e --> n577a6930
  nce47701e --> nd160ceff
  nce47701e --> nd82f710d
  nce47701e --> n13f26e08
  nce47701e --> n877dbbfc
  nce47701e --> na295c289
  nce47701e --> n2919be93
  nce47701e --> nc61c4a87
  nce47701e --> n550ffb63
  nce47701e --> n2f9a33f5
  nce47701e --> n9ed7a49b
  nce47701e --> n8f16deb2
  nce47701e --> n39abc13f
  nce47701e --> n03086476
  nce47701e --> n00d8233a
  nce47701e --> nc91e4aa9
  nce47701e --> n1fb0f5b9
  nce47701e --> nd8b3b2e7
  nce47701e --> n34debd66
  nce47701e --> n94aa7b23
  nce47701e --> n06cdc78f
  nce47701e --> n05430847
  nce47701e --> neb625bd8
  nce47701e --> nec8220e4
  nce47701e --> nd544b683
  nce47701e --> neef17a1b
  nce47701e --> n13bbc8fe
  nce47701e --> nfa8c42ff
  nce47701e --> n29b2740d
  nce47701e --> nf76cba61
  nce47701e --> ncd9d4a9c
  nce47701e --> n8ac6bd4c
  nce47701e --> n9b1f4e46
  nce47701e --> n865511cc
  nce47701e --> n11de06b1
  nce47701e --> n5343062d
  nce47701e --> nb873a347
  nce47701e --> n5ebf0baa
  nce47701e --> necbbb323
  nce47701e --> n29fef8e1
  nce47701e --> n98a07080
  nce47701e --> n67bc2ed9
  nce47701e --> n9c0502d7
  nce47701e --> na65712bb
  nce47701e --> nd475d8d3
  nce47701e --> n0b520ef4
  nce47701e --> n7f07a76e
  nce47701e --> n3242e9cc
  nce47701e --> ne18c022e
  nce47701e --> n682c36e7
  nce47701e --> n5d7c702a
  nce47701e --> n7f402d2b
  nce47701e --> n5d251909
  nce47701e --> n02d207ac
  nce47701e --> nb041ab1b
  nce47701e --> ne3c8228a
  nce47701e --> nde2d9ce9
  nce47701e --> nc89b4cd8
  n4065f6d6 --> n9aa288b9
  n4065f6d6 --> na7073cf3
  n4065f6d6 --> n705efc2c
  n4065f6d6 --> n667c1621
  n667c1621 --> ndc60fee8
  n667c1621 --> n28c91dd4
  n667c1621 --> nb8f97d4a
  n667c1621 --> n65655be9
  n667c1621 --> n929feeb1
  n667c1621 --> n24d8da78
  n667c1621 --> neca2c616
  n667c1621 --> n63cc5a2a
  n667c1621 --> n25e30882
  n667c1621 --> n3e0b11fd
  n667c1621 --> n92b70203
  n4065f6d6 --> na14d50e0
  n4065f6d6 --> n56fdc627
```

| node | receipt uuid | referrer | payload fold | seq |
|---|---|---|---|---|
| root | `4065f6d6-3eb3-8c64-b4dd-55d8abbfd177` | `396cd8c8` | `ea195da7ea3694d2` | 0 |
| cross-receipt.json | `91a0d2da-eb8d-868a-8123-adcbd24157b5` | `4065f6d6` | `32e33b4efc02552d` | 1 |
| cross-receipt.json#0 | `bee88834-bb44-8ae7-a5ec-99dd7d83de21` | `91a0d2da` | `1dfb50c09d3ec562` | 2 |
| cross-receipt.json#1 | `6cdc9823-1238-85f9-bbc4-b1360c7bfea6` | `91a0d2da` | `71cd4b0253241eba` | 3 |
| cross-receipt.json#2 | `f844dde8-e497-8dcb-9b5a-c1c9db6723b7` | `91a0d2da` | `d395906a7c1ca3bd` | 4 |
| cross-receipt.json#3 | `e404747d-b6d1-8c20-a2ca-9e2e290183c9` | `91a0d2da` | `6d6d0a981d52ac76` | 5 |
| cross-receipt.json#4 | `d507a869-2103-829f-a383-8489ec9d3764` | `91a0d2da` | `3206e3e260b0bda7` | 6 |
| cross-receipt.json#5 | `d93ebcdd-6082-8acf-a664-80412835416f` | `91a0d2da` | `15acf0a0cff5c260` | 7 |
| cross-receipt.json#6 | `7519b438-c49a-88bf-bab3-314f842612a2` | `91a0d2da` | `15196e19197c8657` | 8 |
| cross-receipt.json#7 | `c441cf73-ffd3-8bc4-af95-4677f30e6588` | `91a0d2da` | `c63f9497ab57fde9` | 9 |
| cross-receipt.json#8 | `e1808469-6c1e-8c64-ae5d-2d67df14e85d` | `91a0d2da` | `e153a0b9425f5a0a` | 10 |
| cross-receipt.json#9 | `e91ad963-faad-81d7-880f-07995bed26ae` | `91a0d2da` | `da63fe824b42d3b9` | 11 |
| cross-receipt.json#10 | `5f7d1086-b91f-85f1-9b91-6b87b87d9ea2` | `91a0d2da` | `30617b9216899d69` | 12 |
| cross-receipt.json#11 | `3b7e83c4-e380-833a-b82d-b2b38a04a259` | `91a0d2da` | `e5d9a81caa284bd2` | 13 |
| cross-receipt.json#12 | `fc9d5c2a-5f8b-8589-8871-dc4ae33dc9d3` | `91a0d2da` | `c926f909137e13ea` | 14 |
| cross-receipt.json#13 | `f8027600-cc96-89cf-8877-76bcdd10b364` | `91a0d2da` | `970496b026f43786` | 15 |
| cross-receipt.json#14 | `7a3d3126-b243-8747-a1f1-135767dee70c` | `91a0d2da` | `eddfd8ec84208444` | 16 |
| cross-receipt.json#15 | `c190557b-399b-805f-870c-92e251d282d4` | `91a0d2da` | `c635847ade052b98` | 17 |
| cross-receipt.json#16 | `8e1a940e-aeba-86f2-b8bb-4039c2efce3b` | `91a0d2da` | `e73fd7a6d186d5b9` | 18 |
| cross-receipt.json#17 | `3a91314c-5149-8983-bb84-0efb7fbd43f0` | `91a0d2da` | `488374c9d21d1916` | 19 |
| cross-receipt.json#18 | `924c0c9d-5a22-8a94-9b30-82fd72fa20fe` | `91a0d2da` | `5a3a20319bd79246` | 20 |
| cross-receipt.json#19 | `c9675ec9-bd35-800e-b197-e8ae34a34f05` | `91a0d2da` | `9722a986196949c6` | 21 |
| cross-receipt.json#20 | `06a58390-b368-8326-89da-380f1e2eb353` | `91a0d2da` | `91ee2fdc046a71f2` | 22 |
| cross-receipt.json#21 | `d6307a52-b4c2-8221-b8c5-d5921715b1d8` | `91a0d2da` | `5464a03fab9710c1` | 23 |
| cross-receipt.json#22 | `4e4bc5b7-f6c3-80b5-9514-784acb672445` | `91a0d2da` | `7ef706f14b351d5e` | 24 |
| cross-receipt.json#23 | `56fdb0c2-04e7-8350-b628-d43ca286c5ea` | `91a0d2da` | `38fbb18b1e27788c` | 25 |
| cross-receipt.json#24 | `15a69ea3-fc06-8c26-b23b-40b36dcd3a9e` | `91a0d2da` | `740b3c309e28316f` | 26 |
| cross-receipt.json#25 | `2dd51618-1053-804d-bbd9-30631cd933b6` | `91a0d2da` | `e90b89ce056c1a01` | 27 |
| cross-receipt.json#26 | `5bc2e782-0d88-89bd-ba00-a9dbd0052105` | `91a0d2da` | `f1e15ae62cdf1e35` | 28 |
| cross-receipt.json#27 | `606a37c2-f10e-8fac-94d2-88358a371715` | `91a0d2da` | `d1ffa93bf956431e` | 29 |
| cross-receipt.json#28 | `1c370d00-72da-86ad-b83c-38c1f4506466` | `91a0d2da` | `d5266feaca6b7beb` | 30 |
| cross-receipt.json#29 | `1c63fa72-9438-80e8-a71b-2d0fb7d4a6b5` | `91a0d2da` | `960c32a22f42e091` | 31 |
| debts-receipt.json | `0c3b4f5c-0b99-84f1-bb09-9f1945b0b874` | `4065f6d6` | `ddb0d39a20dd9254` | 32 |
| discovery-receipt.json | `cca3ca6c-f09e-80b8-a0f4-7d1d3a79941a` | `4065f6d6` | `773bd24f0f292f58` | 33 |
| discovery-receipt.json#0 | `792ae0a6-03a1-87a3-bfc4-b7e3949ceead` | `cca3ca6c` | `b81fbea12947c2a4` | 34 |
| discovery-receipt.json#1 | `c921d1e7-174d-8721-bfe1-620416998482` | `cca3ca6c` | `fb13d499f5313981` | 35 |
| discovery-receipt.json#2 | `51730c52-7b1c-8434-9e75-9d0654fcd8f2` | `cca3ca6c` | `15bfece2a2eb7f6e` | 36 |
| discovery-receipt.json#3 | `40272d45-bf9c-83f2-bd90-e6f91186d9af` | `cca3ca6c` | `439866928513d906` | 37 |
| discovery-receipt.json#4 | `f3f371ff-744c-846e-8349-771fc6fe3cff` | `cca3ca6c` | `5a434500752e901f` | 38 |
| discovery-receipt.json#5 | `ecee5139-9e5d-8f73-afe5-1d63c95149e5` | `cca3ca6c` | `afaad818097e2d99` | 39 |
| discovery-receipt.json#6 | `b9f8b321-d8cb-86f8-8d56-a902ccd95d31` | `cca3ca6c` | `92276eeea54ec502` | 40 |
| discovery-receipt.json#7 | `ee5be4de-eb29-8577-9e2c-814d5b88cccc` | `cca3ca6c` | `55e6691d18d9c9c8` | 41 |
| discovery-receipt.json#8 | `9244b83e-ad04-8b84-a008-b418d83b7fff` | `cca3ca6c` | `597cb60eb7626d7b` | 42 |
| discovery-receipt.json#9 | `7180c5ff-0249-8ad2-bc7f-5d3bffb46bb7` | `cca3ca6c` | `05b629752aee2c9b` | 43 |
| discovery-receipt.json#10 | `f2e3be3a-3758-8aa6-ae8d-ccdd3b8766b0` | `cca3ca6c` | `a10cbce96361cbce` | 44 |
| discovery-receipt.json#11 | `ffa422d3-a827-8b31-915f-ef0af533cb99` | `cca3ca6c` | `63cc6492be74c9aa` | 45 |
| discovery-receipt.json#12 | `8224793c-47d2-8248-a165-16208abb445a` | `cca3ca6c` | `88dcbad51ccc8d86` | 46 |
| discovery-receipt.json#13 | `58df9405-0db5-8b92-ad85-68ddf9fbfdb7` | `cca3ca6c` | `d501ae000e06d578` | 47 |
| discovery-receipt.json#14 | `3f45a959-d5d2-8ec0-a37f-08858444a6c8` | `cca3ca6c` | `b13d7e3aa8acb358` | 48 |
| discovery-receipt.json#15 | `37e32cb2-1d1e-8b0c-8097-51697691f29d` | `cca3ca6c` | `93528f34702a28e1` | 49 |
| discovery-receipt.json#16 | `8ddc53e0-356c-87a8-8304-158d5847eaa0` | `cca3ca6c` | `7869ae04f2749eed` | 50 |
| discovery-receipt.json#17 | `7afd865c-db5e-847f-94c6-8fdcba0b394b` | `cca3ca6c` | `d24dd1647dffc04a` | 51 |
| discovery-receipt.json#18 | `ab58c8b2-e822-8b85-bc38-9409949f8945` | `cca3ca6c` | `f14c3ff9d5bcf377` | 52 |
| discovery-receipt.json#19 | `44556097-90da-834c-9c3f-97438ff1df78` | `cca3ca6c` | `5692de49794242a2` | 53 |
| discovery-receipt.json#20 | `d7fae280-080e-8df2-8c7c-0b745058c816` | `cca3ca6c` | `45f4882f8396f42b` | 54 |
| discovery-receipt.json#21 | `3f188c88-08da-82aa-a062-a10ee6ab5c43` | `cca3ca6c` | `8bb59253b21c5158` | 55 |
| discovery-receipt.json#22 | `9de22b63-2ebb-83c1-9445-c515f7c68c90` | `cca3ca6c` | `5c7ec5bc47441a7e` | 56 |
| discovery-receipt.json#23 | `e384d0b6-d33b-8788-86d6-89d9c00122d9` | `cca3ca6c` | `61244c197f0344fe` | 57 |
| discovery-receipt.json#24 | `d088c492-2965-8e64-af05-5dc3eac33550` | `cca3ca6c` | `fef25a9cd5ac45fc` | 58 |
| discovery-receipt.json#25 | `98d65907-0c10-8bd6-a25e-35211547a19e` | `cca3ca6c` | `a5839c0a0090d8ac` | 59 |
| discovery-receipt.json#26 | `a7eac08e-99e2-8f98-bd17-29722e9abfe1` | `cca3ca6c` | `fd588187f8d8bcbc` | 60 |
| discovery-receipt.json#27 | `f22b89da-8d8b-805f-8342-b5796b9f5552` | `cca3ca6c` | `c6a6d15c3fa63243` | 61 |
| discovery-receipt.json#28 | `61e95636-60c2-86d6-b642-b09dde0f9e13` | `cca3ca6c` | `cc5e1dff250f9af0` | 62 |
| discovery-receipt.json#29 | `18c54424-8e9d-8a53-bb30-0e36c3d5eab9` | `cca3ca6c` | `02fbfbbd6fc24ac8` | 63 |
| discovery-receipt.json#30 | `bf97c6b7-0951-884b-b735-b69ec9098d11` | `cca3ca6c` | `fd34751b916815a5` | 64 |
| discovery-receipt.json#31 | `f6c2789c-a35a-8f89-ba77-af15d0fd6a9c` | `cca3ca6c` | `c2ce36187b72d342` | 65 |
| discovery-receipt.json#32 | `52808d40-c184-81f7-91ee-2e30f1953d6b` | `cca3ca6c` | `49d93c7c40f0f133` | 66 |
| discovery-receipt.json#33 | `966d4c0a-fb69-8c4c-936c-d47bbc769f13` | `cca3ca6c` | `832fb763d5098ad4` | 67 |
| discovery-receipt.json#34 | `1dd33907-4729-8f04-8610-e970f5dd5e1c` | `cca3ca6c` | `fc2b9b71372e6e0b` | 68 |
| discovery-receipt.json#35 | `a85335a5-0fa5-86ac-953a-70ed079dfc86` | `cca3ca6c` | `a12c1ec0442dae4e` | 69 |
| discovery-receipt.json#36 | `fe6952b6-a63c-87d4-a69d-0e590b59f77c` | `cca3ca6c` | `3bed177b94ec7f6e` | 70 |
| discovery-receipt.json#37 | `4c1a5fef-f4fe-8f59-b76a-623023242d8e` | `cca3ca6c` | `9fc19c41115ef1b5` | 71 |
| discovery-receipt.json#38 | `a6c95686-dd3b-83d8-90a7-8abccc186a38` | `cca3ca6c` | `f65ada3caf5e0310` | 72 |
| discovery-receipt.json#39 | `d1af9564-4abe-89b4-b013-5e61603837fe` | `cca3ca6c` | `984a0119a58fa775` | 73 |
| discovery-receipt.json#40 | `5dc232fc-4d53-8c90-b0a2-46f295273764` | `cca3ca6c` | `55d931fde91914f0` | 74 |
| discovery-receipt.json#41 | `ccd0591b-3c18-885a-a3fd-971076c73072` | `cca3ca6c` | `8419438e3d4b356c` | 75 |
| discovery-receipt.json#42 | `40e8ccc8-97b2-8ee4-879e-7b5e18cf14df` | `cca3ca6c` | `b538b73ca7361ee2` | 76 |
| discovery-receipt.json#43 | `6bbb3b7c-48de-8027-9862-613672600f6f` | `cca3ca6c` | `8fb58c1d15803bce` | 77 |
| discovery-receipt.json#44 | `29b69888-3d14-8fe1-9cb2-564620a475e5` | `cca3ca6c` | `785b5d1e8faab94f` | 78 |
| discovery-receipt.json#45 | `2373a12b-96dd-8230-a391-790de50c31f1` | `cca3ca6c` | `c0511efb27ea8ed8` | 79 |
| discovery-receipt.json#46 | `e181b55c-7ba5-871f-b15f-425d2979e4a8` | `cca3ca6c` | `3935d91be72f06df` | 80 |
| discovery-receipt.json#47 | `fcb0d134-4f3b-806a-9167-ef63df0743cc` | `cca3ca6c` | `36c662bee868f77e` | 81 |
| discovery-receipt.json#48 | `bacb29de-ed67-8a69-91ae-59a74b5bbef2` | `cca3ca6c` | `5cdddbb61071c24a` | 82 |
| discovery-receipt.json#49 | `b6168cca-1ebd-8df0-acb9-b0ba93584c94` | `cca3ca6c` | `0807ef93f1d0224e` | 83 |
| discovery-receipt.json#50 | `977ccc96-872f-8e47-ae73-9fa7c3d5d701` | `cca3ca6c` | `08adc8d8676c6002` | 84 |
| discovery-receipt.json#51 | `224c6212-70e9-8ea3-8255-717dcef04ff3` | `cca3ca6c` | `851639718b49f5c1` | 85 |
| discovery-receipt.json#52 | `522c70d0-91b8-849c-ba75-720053e93c95` | `cca3ca6c` | `84fbf4fbb046b6e3` | 86 |
| discovery-receipt.json#53 | `fee34a58-77b5-889f-a0b3-99262c973db1` | `cca3ca6c` | `ad55dbb27e65b19f` | 87 |
| discovery-receipt.json#54 | `e43e45e2-b1ba-8cbf-828d-157585078595` | `cca3ca6c` | `1bc7f5d3220049db` | 88 |
| discovery-receipt.json#55 | `ddfc618a-987f-8a59-b834-3b4e6af2365b` | `cca3ca6c` | `3bb1f02f0dcd9f10` | 89 |
| discovery-receipt.json#56 | `14063e14-b313-87a4-b9e9-8926998e07d3` | `cca3ca6c` | `8bf8d1110f2521cf` | 90 |
| discovery-receipt.json#57 | `911e6419-41ac-823e-9a0e-d17cb0f43624` | `cca3ca6c` | `36b2a9ad458d6164` | 91 |
| discovery-receipt.json#58 | `58e9b56e-a319-89a9-86ab-a9d6c7a78046` | `cca3ca6c` | `2fe389238f541cb3` | 92 |
| discovery-receipt.json#59 | `509ea5e7-1ab8-8c9c-9df5-3e592e5b5a85` | `cca3ca6c` | `eabcb5133f82430d` | 93 |
| discovery-receipt.json#60 | `1a98bbfe-2073-88a9-9344-cfffa0ec55d9` | `cca3ca6c` | `f5ba04ee4a363773` | 94 |
| discovery-receipt.json#61 | `dd3db21e-eba6-82a7-b75e-5b5bd92f25f4` | `cca3ca6c` | `4ce34ba596fb0c48` | 95 |
| discovery-receipt.json#62 | `5b95854d-b928-89c6-9864-498d1fe41a61` | `cca3ca6c` | `b8cebd8396daf45c` | 96 |
| discovery-receipt.json#63 | `34d266e2-31fa-8702-914e-22e33dd4a0ac` | `cca3ca6c` | `12368a16a8e36c5e` | 97 |
| discovery-receipt.json#64 | `c1a72538-ce78-8102-9914-fcf9128e537a` | `cca3ca6c` | `9ec9b02365db1f19` | 98 |
| discovery-receipt.json#65 | `a060df6d-b55e-85eb-9479-9bf8520be94c` | `cca3ca6c` | `b83eca284f9b1307` | 99 |
| discovery-receipt.json#66 | `49857f3d-697d-8c06-8eb5-1a5c120259eb` | `cca3ca6c` | `7e5d60fd80a6010b` | 100 |
| discovery-receipt.json#67 | `4facca0e-f67b-8104-aa17-ea565c68f21d` | `cca3ca6c` | `6a36996a59eb4e15` | 101 |
| discovery-receipt.json#68 | `388919c4-f6a4-86ea-a595-59bd99f08e36` | `cca3ca6c` | `7b1a316a3b2468fa` | 102 |
| discovery-receipt.json#69 | `79c55b0e-6ea8-8b75-a1f4-20253337461f` | `cca3ca6c` | `09dabdf29c5a6131` | 103 |
| discovery-receipt.json#70 | `9c2f5d37-a497-811e-845e-9068a3458e89` | `cca3ca6c` | `ca6fd18a9e14bf1e` | 104 |
| discovery-receipt.json#71 | `5519e794-8425-88bd-84de-cd608c4aeb0b` | `cca3ca6c` | `c5c2a6b4d2d8b6ad` | 105 |
| discovery-receipt.json#72 | `0bd98a79-e03d-8543-a3e5-1c72c63ff8ee` | `cca3ca6c` | `d2741a8ba6883585` | 106 |
| discovery-receipt.json#73 | `241fdc85-f429-834a-a99d-7b00f9e6a022` | `cca3ca6c` | `92e9a6898c451bb9` | 107 |
| discovery-receipt.json#74 | `ad3e98ff-476d-85fb-a68e-ef84ef64cdf7` | `cca3ca6c` | `a72347b2fe996dce` | 108 |
| discovery-receipt.json#75 | `4b235ece-658f-8471-8b96-10436d482deb` | `cca3ca6c` | `bdfdc0be03b6abba` | 109 |
| discovery-receipt.json#76 | `8d0cbb81-87f4-8f63-a6bd-29de7b54b1f3` | `cca3ca6c` | `fe5fa02df926b350` | 110 |
| discovery-receipt.json#77 | `15c0af2a-6522-893b-8441-5f00e4516097` | `cca3ca6c` | `a4b41d16c19028d3` | 111 |
| discovery-receipt.json#78 | `15f256d2-6fdf-8aac-98f7-429f28f173ec` | `cca3ca6c` | `a8d652f57f302045` | 112 |
| discovery-receipt.json#79 | `a8ee8acc-ef89-8339-956c-cd7b931975f7` | `cca3ca6c` | `8ae5accd3c101747` | 113 |
| discovery-receipt.json#80 | `3df14be3-a3e6-8146-8a97-4b6d8d79b863` | `cca3ca6c` | `b0ce32e7a390af62` | 114 |
| discovery-receipt.json#81 | `b54be111-d79d-8924-a506-dce69e4eca16` | `cca3ca6c` | `456ded2664e8a23c` | 115 |
| discovery-receipt.json#82 | `41beddd1-ff32-8992-ac05-06a62b44e5da` | `cca3ca6c` | `abdfe71a4d6c906e` | 116 |
| discovery-receipt.json#83 | `f279221f-6587-8c81-aa9f-d478879f2ee3` | `cca3ca6c` | `89242ae5cb5bd523` | 117 |
| discovery-receipt.json#84 | `fb013760-64e3-8a62-8f21-92c12ed42343` | `cca3ca6c` | `1556fcaf0368d403` | 118 |
| discovery-receipt.json#85 | `40c27993-8f57-8054-b97d-1f904752848b` | `cca3ca6c` | `6d476ff3005b766a` | 119 |
| discovery-receipt.json#86 | `8218fa0c-0eef-8241-9527-aa7a383130ff` | `cca3ca6c` | `2cee7900a99ea4be` | 120 |
| discovery-receipt.json#87 | `24a05d66-2b80-8e4f-869a-930a4b6eda1f` | `cca3ca6c` | `7aa2eaa185a6b234` | 121 |
| discovery-receipt.json#88 | `2a0ed400-09c0-8d87-9338-785bc4709c05` | `cca3ca6c` | `941085c88b28ac29` | 122 |
| discovery-receipt.json#89 | `b433a178-a8e7-86b7-b0ee-69b7011f1444` | `cca3ca6c` | `49412412aa8009b6` | 123 |
| discovery-receipt.json#90 | `0720d35d-ebe4-899f-aa45-3c506c733a44` | `cca3ca6c` | `a6fb802912ff9f43` | 124 |
| discovery-receipt.json#91 | `82cb4ece-4568-8e25-a37a-c0a75c22cfa7` | `cca3ca6c` | `b80414540fa633ab` | 125 |
| discovery-receipt.json#92 | `fe207ecc-a164-87b4-b94e-5076dc1c6ff6` | `cca3ca6c` | `e8c2287ed498c658` | 126 |
| discovery-receipt.json#93 | `5e203120-7a49-8f0f-ab49-12ab1852ee43` | `cca3ca6c` | `301a916d118dc686` | 127 |
| discovery-receipt.json#94 | `d3138fed-c76a-89c1-a859-4b9eb281004e` | `cca3ca6c` | `d52f9310aa26719b` | 128 |
| discovery-receipt.json#95 | `efcde21c-56cb-829a-87f7-18c484e5e644` | `cca3ca6c` | `d88047485009070d` | 129 |
| discovery-receipt.json#96 | `741604f2-ac8d-8362-9b35-311fc126535c` | `cca3ca6c` | `57fa5fbc57608d90` | 130 |
| discovery-receipt.json#97 | `978bfe09-bc2a-8456-a224-dd109f5296ee` | `cca3ca6c` | `e426f3b25b47fb5a` | 131 |
| discovery-receipt.json#98 | `2b29ed20-d001-80a1-bf08-8ca53db26ea5` | `cca3ca6c` | `b0c0e1a53d0354e5` | 132 |
| discovery-receipt.json#99 | `7e6b75c8-266f-851e-98e7-e19a9c24134d` | `cca3ca6c` | `6013df5ed90b24ef` | 133 |
| discovery-receipt.json#100 | `d9a2f22c-9145-810e-8aeb-46a5b4b1f0e2` | `cca3ca6c` | `15fe8aa64b3744de` | 134 |
| discovery-receipt.json#101 | `bd363d74-748b-8754-bd56-f38d0ae98f04` | `cca3ca6c` | `dd782dacfef4b8b0` | 135 |
| discovery-receipt.json#102 | `ab324106-6da1-8b05-9123-769e53c79fdf` | `cca3ca6c` | `93edb7ec307e71f2` | 136 |
| discovery-receipt.json#103 | `0bc2bf56-904a-84cc-b3de-950bf8512dc3` | `cca3ca6c` | `30f1e5fd921c05db` | 137 |
| discovery-receipt.json#104 | `341011a8-1acd-898e-a296-4cd58027cf3c` | `cca3ca6c` | `e2249bddfc7fd8b5` | 138 |
| discovery-receipt.json#105 | `1ad1c9ae-9986-80a7-b6a0-f90c83857760` | `cca3ca6c` | `960499556efa87e0` | 139 |
| discovery-receipt.json#106 | `43784b02-0cc8-8aa9-a324-9788ee923620` | `cca3ca6c` | `8721add579a464de` | 140 |
| discovery-receipt.json#107 | `dba0f562-b4f3-8229-abb6-0bca2317e0dd` | `cca3ca6c` | `4d259ab4a4612983` | 141 |
| discovery-receipt.json#108 | `5176dfb2-7829-8673-b8a8-eb0b6613eeb4` | `cca3ca6c` | `b226d90ed35017e8` | 142 |
| discovery-receipt.json#109 | `c26f348a-a127-8d3d-bb52-1b9a4d4fa2ff` | `cca3ca6c` | `a5645eee404403ce` | 143 |
| discovery-receipt.json#110 | `952976ee-b4ff-8c80-aed3-f9b8fa281aaf` | `cca3ca6c` | `e02ae8d65c73fa8b` | 144 |
| discovery-receipt.json#111 | `5cd1e71c-8dc3-8724-b01e-cac856f8b3db` | `cca3ca6c` | `f474467dd74484bf` | 145 |
| discovery-receipt.json#112 | `b3e4ba2c-d742-8f7f-96c3-fee67caf9d1b` | `cca3ca6c` | `98b345f5e55e385c` | 146 |
| discovery-receipt.json#113 | `92798c8e-78cc-8116-afab-86a28e119429` | `cca3ca6c` | `5d012e604fddd338` | 147 |
| discovery-receipt.json#114 | `ae56da5f-43ea-8b08-bfee-29ab4965e322` | `cca3ca6c` | `d912361ef31afeb0` | 148 |
| discovery-receipt.json#115 | `7669e52a-d348-8d69-b6e9-61fa0f715598` | `cca3ca6c` | `d9f38d35e066abb3` | 149 |
| discovery-receipt.json#116 | `9f7d6186-08e2-82a5-9491-244b6d226699` | `cca3ca6c` | `c345210ac8e49750` | 150 |
| discovery-receipt.json#117 | `a6878b5e-a818-824f-a788-68736c52445e` | `cca3ca6c` | `0464825320ded6e4` | 151 |
| discovery-receipt.json#118 | `8766c22e-7984-88c4-bb09-7412ba89310c` | `cca3ca6c` | `8333fc9e46bdafe5` | 152 |
| discovery-receipt.json#119 | `83352abd-3610-88fc-8d8c-a3848a7b751c` | `cca3ca6c` | `6775f08cdab910a3` | 153 |
| discovery-receipt.json#120 | `b0dd0348-4f11-82fe-bae4-ff7f071a85b0` | `cca3ca6c` | `df5e904fa500f6f2` | 154 |
| discovery-receipt.json#121 | `8b9de8a0-b33d-86ec-bfff-cd0d1379df86` | `cca3ca6c` | `3393a589a6209096` | 155 |
| discovery-receipt.json#122 | `a5014947-3ade-8246-a6cf-f6199c67b620` | `cca3ca6c` | `4120f26873e60328` | 156 |
| discovery-receipt.json#123 | `77eb5fa8-d31f-8fc6-a046-bc37aeaa9fe5` | `cca3ca6c` | `db741cbf6ea2274c` | 157 |
| discovery-receipt.json#124 | `693d479c-02b1-8cda-a5af-9347c79a735c` | `cca3ca6c` | `fe2a91f34bf74286` | 158 |
| discovery-receipt.json#125 | `975df879-e6b4-80e0-991f-817ccc72ec1f` | `cca3ca6c` | `826df5162918f7d9` | 159 |
| discovery-receipt.json#126 | `49631729-baa7-81fa-9cd5-3931a8ea95bc` | `cca3ca6c` | `44bc6472ae3caf1f` | 160 |
| discovery-receipt.json#127 | `80d35e66-e46b-8433-a33d-5e501cd1b570` | `cca3ca6c` | `b52a37b208d8e9d4` | 161 |
| discovery-receipt.json#128 | `977d7b45-cfff-8a93-bc05-eafb1a052736` | `cca3ca6c` | `4c406c1336acba42` | 162 |
| discovery-receipt.json#129 | `facac8b3-b397-8629-9614-a76d11a0ff28` | `cca3ca6c` | `b1b0112fa01f0e47` | 163 |
| discovery-receipt.json#130 | `6a69d442-ba66-86b4-a9c8-cd710f410663` | `cca3ca6c` | `ec07552ae992aa1f` | 164 |
| discovery-receipt.json#131 | `18bcbd5b-2fa5-8937-88ff-381b4936e2ae` | `cca3ca6c` | `df99146848a3a0c1` | 165 |
| discovery-receipt.json#132 | `6135ca8d-7a45-8c5f-8ab6-6df69bc31815` | `cca3ca6c` | `6d3168c3f43ef3d2` | 166 |
| discovery-receipt.json#133 | `1f9419c4-11b2-877d-8330-0424b2aea6f7` | `cca3ca6c` | `7fd2a1bb33d1868c` | 167 |
| discovery-receipt.json#134 | `53ede1b9-878d-8ab4-a928-28cdd556784e` | `cca3ca6c` | `c6892520d1ddef26` | 168 |
| discovery-receipt.json#135 | `91da274a-ea18-867e-a954-95ecfc87a558` | `cca3ca6c` | `4cd19e884afce7d7` | 169 |
| discovery-receipt.json#136 | `be2652a8-12cd-8405-b1ef-2108d70985e1` | `cca3ca6c` | `e7fb005ab43a1b55` | 170 |
| discovery-receipt.json#137 | `142ca731-40e9-8e9d-b4ea-0774a518646f` | `cca3ca6c` | `2ca80e120f0bb862` | 171 |
| discovery-receipt.json#138 | `77143843-8056-80b7-b105-35e013812949` | `cca3ca6c` | `4351d87135dbbd00` | 172 |
| discovery-receipt.json#139 | `cd55d6c5-4b24-8ab2-a947-c70b43768771` | `cca3ca6c` | `8c8022eb19799b13` | 173 |
| discovery-receipt.json#140 | `c06bc8d9-307c-8d2c-8ea2-57ccc574d04f` | `cca3ca6c` | `7d03146c1805a91b` | 174 |
| discovery-receipt.json#141 | `9abadf84-4463-81b2-b340-a14a77a274bb` | `cca3ca6c` | `91cfb7bd7ea728d5` | 175 |
| discovery-receipt.json#142 | `d001d1a8-7501-8003-848d-935789aa0637` | `cca3ca6c` | `3fb264919eee087a` | 176 |
| discovery-receipt.json#143 | `5d77dcce-b8a9-8fad-9aa4-650476d0dd1f` | `cca3ca6c` | `ccbccf78fd0b268c` | 177 |
| discovery-receipt.json#144 | `0b607c9a-5111-836b-9a7d-af6f71f8f861` | `cca3ca6c` | `afb182415a86fd9c` | 178 |
| discovery-receipt.json#145 | `6dd03554-25a4-8387-b77d-2d68d02d5ab0` | `cca3ca6c` | `88779156db00f353` | 179 |
| discovery-receipt.json#146 | `35efc9c5-a4cf-8e75-ac52-137ce0d09982` | `cca3ca6c` | `2520995372c3f5cf` | 180 |
| discovery-receipt.json#147 | `7417fc13-3dfd-89e9-9238-be223012e2f5` | `cca3ca6c` | `3895897059b9c14a` | 181 |
| discovery-receipt.json#148 | `3ed45ce8-38b8-8958-8f24-c7d4e16ab15b` | `cca3ca6c` | `808b97c8d736188b` | 182 |
| discovery-receipt.json#149 | `477284bf-9db3-8ad3-9db0-ac8599beb5ae` | `cca3ca6c` | `19a5d9b97e14b705` | 183 |
| discovery-receipt.json#150 | `b3f1dee6-37d5-85db-92f3-810d3f35b2ab` | `cca3ca6c` | `85648634f05e78f6` | 184 |
| discovery-receipt.json#151 | `8a051401-11ad-8697-af93-8105561b5ca8` | `cca3ca6c` | `dc3628920b93d2e0` | 185 |
| discovery-receipt.json#152 | `ec216080-811e-819e-a475-6fa23ab39639` | `cca3ca6c` | `b47575c2fabd594a` | 186 |
| discovery-receipt.json#153 | `c5825e31-63bf-8850-b924-3cd09bd68e3c` | `cca3ca6c` | `b08d4fda51c70e96` | 187 |
| discovery-receipt.json#154 | `81f274db-842d-8bc5-8070-de89682cb016` | `cca3ca6c` | `ee0b71787e57ba32` | 188 |
| discovery-receipt.json#155 | `f8ab687a-d7c4-8ca1-b9b6-43b271da7632` | `cca3ca6c` | `d85edf24fe34bf20` | 189 |
| discovery-receipt.json#156 | `8d2f2795-1db5-8d9e-ba75-1216ede1aeb1` | `cca3ca6c` | `3c6c6bdf4cc45e94` | 190 |
| discovery-receipt.json#157 | `6fc1ecdb-e813-882e-ac46-321ad38b9798` | `cca3ca6c` | `cc04c7a35f05233e` | 191 |
| discovery-receipt.json#158 | `8aaf695e-5eb0-85cd-9ad0-b0b69b6daf78` | `cca3ca6c` | `7f000dc39ccaf98b` | 192 |
| discovery-receipt.json#159 | `c0f06afd-4df5-8c8d-badc-7eca27674816` | `cca3ca6c` | `7f3e2af7a56efadb` | 193 |
| discovery-receipt.json#160 | `4a20a14e-8686-8294-b2a0-27e617d4c953` | `cca3ca6c` | `32582ffa2803266b` | 194 |
| discovery-receipt.json#161 | `23f83aec-efce-897e-98d4-92dbe0db7f86` | `cca3ca6c` | `c23cfdb4034f4136` | 195 |
| discovery-receipt.json#162 | `68a551c3-b077-8bdb-9de8-f06868733e9d` | `cca3ca6c` | `7ca59c62446bffbd` | 196 |
| discovery-receipt.json#163 | `26f4e29f-6a70-8884-b641-cc70ed194c92` | `cca3ca6c` | `5320d81848a70fa2` | 197 |
| discovery-receipt.json#164 | `b1a8290e-30db-8e73-af6a-08d930edc6c1` | `cca3ca6c` | `d467d92066f11f83` | 198 |
| discovery-receipt.json#165 | `c4b4447b-3240-8229-a6c9-47fe80666a5e` | `cca3ca6c` | `6f5e0012fce73398` | 199 |
| discovery-receipt.json#166 | `006bf915-c5bc-857f-83dc-118e611817c0` | `cca3ca6c` | `598b54ac4f12e509` | 200 |
| discovery-receipt.json#167 | `76d93f34-08e5-8668-894f-e76101c04695` | `cca3ca6c` | `3ad07e202ddf9908` | 201 |
| discovery-receipt.json#168 | `c8fcae20-6324-8ca4-9520-df8fc16efe36` | `cca3ca6c` | `921676a512dc89bf` | 202 |
| discovery-receipt.json#169 | `c8c16089-f91b-8dcc-b56f-7870ee840430` | `cca3ca6c` | `2d29fce8d0e4d89b` | 203 |
| discovery-receipt.json#170 | `5859aebd-aee0-8f34-b480-1914d0a94489` | `cca3ca6c` | `2d56bf8f4de3e191` | 204 |
| discovery-receipt.json#171 | `0ab17ff1-4a24-8e9b-9a07-12586e8e1671` | `cca3ca6c` | `61e9f2df1e343857` | 205 |
| discovery-receipt.json#172 | `7f310b18-4d4f-856b-8ee2-594c4693d681` | `cca3ca6c` | `68520e1596c20912` | 206 |
| discovery-receipt.json#173 | `60a396c4-8773-8824-9f42-99cc9755f054` | `cca3ca6c` | `aa3d3fafa654b883` | 207 |
| discovery-receipt.json#174 | `c4568216-860b-80d5-9f7a-3bff10e5047c` | `cca3ca6c` | `1fce4c5edecd7058` | 208 |
| discovery-receipt.json#175 | `f379a84c-71a2-8832-a9cb-8669ece83758` | `cca3ca6c` | `df708985cb572ed8` | 209 |
| discovery-receipt.json#176 | `39271cc8-925c-8a00-844b-6e291ed8ab12` | `cca3ca6c` | `c10c63eb2eacb74f` | 210 |
| discovery-receipt.json#177 | `4c4b4d3e-65b4-863e-9d6a-49a5e5f6881d` | `cca3ca6c` | `0bce590949b1a3a5` | 211 |
| discovery-receipt.json#178 | `48a6aae5-e476-8e2d-9b08-8eac1ca3774b` | `cca3ca6c` | `6a6534b1f188e4e6` | 212 |
| discovery-receipt.json#179 | `cecd3653-2941-8f5a-89fc-1df0291d1169` | `cca3ca6c` | `c33804ef1343ea40` | 213 |
| discovery-receipt.json#180 | `0129a78c-c4fd-80f2-ac4a-eba4b9622081` | `cca3ca6c` | `83515dbbf9ca19ea` | 214 |
| discovery-receipt.json#181 | `cc7de7e6-3528-8a96-9c26-e668400dba62` | `cca3ca6c` | `9838855f82ec4297` | 215 |
| discovery-receipt.json#182 | `878ae476-eace-8f6d-a216-4a98b8be10fd` | `cca3ca6c` | `61281c352e026697` | 216 |
| discovery-receipt.json#183 | `578ca390-6bbf-85f6-b1c5-c1f445ec1f7a` | `cca3ca6c` | `7da277908a9bf78c` | 217 |
| discovery-receipt.json#184 | `99c419b7-b3f0-878d-8b0c-127b20b281e7` | `cca3ca6c` | `9d66222e5d69dc2d` | 218 |
| discovery-receipt.json#185 | `ca023116-1dd5-8758-8a85-a1630c4be79e` | `cca3ca6c` | `fa1857cf2b5e7635` | 219 |
| discovery-receipt.json#186 | `0d971d18-32e9-85cc-8ea5-f0f44ef6651f` | `cca3ca6c` | `87f4b7c171574f5e` | 220 |
| discovery-receipt.json#187 | `cca58042-8dd3-8a1f-bbb4-ac2b6630e5c9` | `cca3ca6c` | `0e79bad6eb8aaf67` | 221 |
| discovery-receipt.json#188 | `691829e8-f07c-81d3-946c-607b98de8d8e` | `cca3ca6c` | `6b13d4b2d843ab7a` | 222 |
| discovery-receipt.json#189 | `ae0146c1-25f5-8cad-803f-531d6da60f27` | `cca3ca6c` | `99e90c3e6b55c6dc` | 223 |
| discovery-receipt.json#190 | `063f07a9-32a5-813e-af4a-6152c4b6ccda` | `cca3ca6c` | `4fb00c115dc42784` | 224 |
| discovery-receipt.json#191 | `e2688c27-e52a-8977-8543-1c60bed8beb8` | `cca3ca6c` | `3093bd1487680509` | 225 |
| discovery-receipt.json#192 | `041d6b40-c68b-857b-a439-955578d7ec0a` | `cca3ca6c` | `7cc9084e81f03f50` | 226 |
| discovery-receipt.json#193 | `9621f29e-4bbd-8aa1-a423-3642dca615ca` | `cca3ca6c` | `1cbd72c282689b20` | 227 |
| discovery-receipt.json#194 | `1aa4c78e-72da-8f6f-8ce6-66c5daea7196` | `cca3ca6c` | `1f6e1f663cfacf77` | 228 |
| discovery-receipt.json#195 | `a0ac888c-032a-80f6-87ca-db0844e292e8` | `cca3ca6c` | `5776a3358a6e9a78` | 229 |
| discovery-receipt.json#196 | `bb59f947-71d3-8ecb-8223-1addc1cff40f` | `cca3ca6c` | `b2560673946779ab` | 230 |
| discovery-receipt.json#197 | `02edf583-23e0-8ad0-bfdb-708296dbb94f` | `cca3ca6c` | `775228158b41822e` | 231 |
| discovery-receipt.json#198 | `29f8fce2-4534-8936-a8ce-0b4b4356b9c0` | `cca3ca6c` | `b71fc29da858bd2f` | 232 |
| discovery-receipt.json#199 | `41743c6d-86ae-84c6-8cb7-498cb4097d9f` | `cca3ca6c` | `8f5adcc8b9a28a4f` | 233 |
| discovery-receipt.json#200 | `dc84e450-55b2-89f9-acb8-a23aa5517c34` | `cca3ca6c` | `b183eddb4f0bf5c7` | 234 |
| discovery-receipt.json#201 | `93f407a3-e94f-88ea-8a73-ef6278e78619` | `cca3ca6c` | `340adf806dc1c91e` | 235 |
| discovery-receipt.json#202 | `444dc5bc-0ca9-8cab-8a26-0db70199f0cd` | `cca3ca6c` | `be76479034765de3` | 236 |
| discovery-receipt.json#203 | `9f1161bf-51e6-8063-bbd1-ae79e59f9efe` | `cca3ca6c` | `0934c24c6503521a` | 237 |
| discovery-receipt.json#204 | `a7e18658-44ca-8f7f-ad72-282617c8bee3` | `cca3ca6c` | `bfeb5e0f8de168a9` | 238 |
| discovery-receipt.json#205 | `2b62f369-819b-8549-9115-6bbeee38d34c` | `cca3ca6c` | `e8c0387a3e9d33c9` | 239 |
| discovery-receipt.json#206 | `bd74e827-3826-8c6f-b073-695dc7f9e40e` | `cca3ca6c` | `08ddd53c30fb35b5` | 240 |
| discovery-receipt.json#207 | `838cffa0-c9b7-8a6b-8d78-136e0fbc5db5` | `cca3ca6c` | `8f14f50d30eddc08` | 241 |
| discovery-receipt.json#208 | `4e2f6847-cce4-803d-9eed-6a238d319d70` | `cca3ca6c` | `80a068db015e620b` | 242 |
| discovery-receipt.json#209 | `bff99dbf-1134-8fec-a4bf-54a3deafebc5` | `cca3ca6c` | `fcb906ed5dc1acf6` | 243 |
| discovery-receipt.json#210 | `2cfa694a-1bda-8fa1-ae2c-7d9d1abcb767` | `cca3ca6c` | `973b211ededb0199` | 244 |
| discovery-receipt.json#211 | `1ff80eed-70e4-8d21-be8a-7b066979a197` | `cca3ca6c` | `15ce0fca3069fa4f` | 245 |
| discovery-receipt.json#212 | `e04adb39-b25a-86c9-b63a-fa1bc2956ed9` | `cca3ca6c` | `807625ec60fae795` | 246 |
| discovery-receipt.json#213 | `2c9c4e8f-fc71-8d5f-9c00-c737e97e8fb8` | `cca3ca6c` | `658b4c9f830d1c4d` | 247 |
| discovery-receipt.json#214 | `589a1b65-d01c-8119-99b2-8d27f3e59350` | `cca3ca6c` | `350239ad42ad3a31` | 248 |
| discovery-receipt.json#215 | `ff911332-9da0-87ce-b4a3-a9883a3b8ac2` | `cca3ca6c` | `03c74cf56f89d1ad` | 249 |
| discovery-receipt.json#216 | `eff69341-fa32-8dcc-b868-3cb33b4a9a73` | `cca3ca6c` | `03651aef1939c990` | 250 |
| discovery-receipt.json#217 | `ff8c0300-ab7e-86bd-b647-f33f1813f667` | `cca3ca6c` | `3ca172c3d500d7d1` | 251 |
| discovery-receipt.json#218 | `f75173ec-d8e0-8c12-8286-b4e93173098c` | `cca3ca6c` | `7fd7593adb1c7784` | 252 |
| discovery-receipt.json#219 | `f46881cf-bb48-87bf-b6d9-3b7a1f53781f` | `cca3ca6c` | `8709bdf57536f4b8` | 253 |
| discovery-receipt.json#220 | `1b34b755-7658-8e08-baf0-26aaddc04d21` | `cca3ca6c` | `c5de1f2f44e4418b` | 254 |
| discovery-receipt.json#221 | `db0b4fbf-613d-8f8f-9975-9e8ef9ae7115` | `cca3ca6c` | `f6f721aec81300bf` | 255 |
| discovery-receipt.json#222 | `238a5d5c-fa28-82bc-9976-4abb97962b14` | `cca3ca6c` | `212212a95a7bdb59` | 256 |
| discovery-receipt.json#223 | `b3544934-7f9d-874b-8405-090b5f6d820a` | `cca3ca6c` | `55ea669f107b23d8` | 257 |
| discovery-receipt.json#224 | `b9e1b51a-9600-8d7f-810d-906f56a64807` | `cca3ca6c` | `fd92843d186def66` | 258 |
| discovery-receipt.json#225 | `a114359c-1722-8530-85e4-d7ecc82492fb` | `cca3ca6c` | `74ed838974541991` | 259 |
| discovery-receipt.json#226 | `5a12452b-0f9c-8d17-8bd2-9de8c9c6bcd1` | `cca3ca6c` | `318791b61c5211ed` | 260 |
| discovery-receipt.json#227 | `3cb9ae35-9960-8eeb-a845-56ef9406d088` | `cca3ca6c` | `7d7ae99e77285750` | 261 |
| discovery-receipt.json#228 | `1e2d9f31-4eb2-8d37-9f63-86fdc8480c68` | `cca3ca6c` | `5bde732c5d1bc17a` | 262 |
| discovery-receipt.json#229 | `06f14c52-cc22-8a2a-839f-ea8bf9cd5b0a` | `cca3ca6c` | `5df9855ae52c2554` | 263 |
| flaws-receipt.json | `e25204d4-63a3-8b3f-9975-195b27018811` | `4065f6d6` | `4c375110f22b54d5` | 264 |
| formulas-receipt.json | `a322c914-edbb-8345-988b-b9f5b0f647fd` | `4065f6d6` | `6048947560a8c8f5` | 265 |
| formulas-receipt.json#0 | `4a32430e-093e-8492-ba33-bf3bd4c744e9` | `a322c914` | `0058da71f50b662b` | 266 |
| formulas-receipt.json#1 | `5bba049f-02d1-8628-920a-268d087f1146` | `a322c914` | `5ba6f4caf9d2f0ec` | 267 |
| formulas-receipt.json#2 | `88921ccf-cbac-8a7b-98c1-f32fd026f729` | `a322c914` | `fb53a12c3e4dc86b` | 268 |
| formulas-receipt.json#3 | `d9c1ac8f-a7d0-87ef-b123-565079a483c6` | `a322c914` | `0327cdf3ff5ff25c` | 269 |
| formulas-receipt.json#4 | `9b4d646f-6fab-851c-a0c7-b02a372f2697` | `a322c914` | `febc404cf0b62b11` | 270 |
| formulas-receipt.json#5 | `fe9795f3-3fd6-8a87-aa91-241a84efa1ed` | `a322c914` | `8a53cf1be2c01b2a` | 271 |
| formulas-receipt.json#6 | `ac0ffb0a-ca1d-8260-9daf-ac2155a62394` | `a322c914` | `c85deb48fadc165a` | 272 |
| formulas-receipt.json#7 | `9a992ef6-4b80-8ad4-85b7-46c3b7bf763a` | `a322c914` | `da9991e7f620c657` | 273 |
| formulas-receipt.json#8 | `ff0cc644-9948-8da2-b25e-ec27d7adefa6` | `a322c914` | `4a2f9ced771365cf` | 274 |
| formulas-receipt.json#9 | `b700a8e1-0e61-8a20-9d7d-f1a1fafd65d5` | `a322c914` | `e9433487a11810e4` | 275 |
| formulas-receipt.json#10 | `ab6cacb0-f2f7-849b-b131-4797a439e63d` | `a322c914` | `a7c5a55ec042da39` | 276 |
| formulas-receipt.json#11 | `e292e9da-ba01-875c-84b3-5f503f5006d9` | `a322c914` | `85f4227e8f6975fd` | 277 |
| formulas-receipt.json#12 | `66d19107-dfb9-8198-a12b-15df71acd476` | `a322c914` | `3ecd407b75aeee80` | 278 |
| formulas-receipt.json#13 | `2adae0ad-70b5-806b-ba0f-39101246c191` | `a322c914` | `a14661c22cbff91a` | 279 |
| formulas-receipt.json#14 | `b81cf544-0adb-8694-8108-72ece08d25be` | `a322c914` | `b6375f1e92a0eead` | 280 |
| formulas-receipt.json#15 | `23ccc37a-21a9-886c-9fa1-0f469148b591` | `a322c914` | `0b2015048c22eb50` | 281 |
| formulas-receipt.json#16 | `b54f0d74-c3f3-8981-bd0a-ec99700cab39` | `a322c914` | `eb643c0fe59562f8` | 282 |
| formulas-receipt.json#17 | `8e423bcf-a9a0-8755-b98a-7dcc49630a2c` | `a322c914` | `299e9be2158e8ae2` | 283 |
| formulas-receipt.json#18 | `688d65d9-d492-84f6-b779-bca53f857297` | `a322c914` | `17154987b2389fa2` | 284 |
| formulas-receipt.json#19 | `4de40d8e-c9ea-8ea8-ba35-3b5d6fbf6fad` | `a322c914` | `70717e3f55b7653a` | 285 |
| formulas-receipt.json#20 | `de5d17d4-e516-8432-b276-36019a3a73fc` | `a322c914` | `51721fb236fb28ba` | 286 |
| formulas-receipt.json#21 | `5ebadc0e-21d2-8aba-9896-d73e60b04393` | `a322c914` | `0fcf8356f102c14a` | 287 |
| formulas-receipt.json#22 | `392b8db5-4220-829d-a924-097f38bf9bc4` | `a322c914` | `f73a1036197e59e6` | 288 |
| formulas-receipt.json#23 | `db1aed2c-f031-8f8d-9d6a-cc6723d68986` | `a322c914` | `dd21fbdf349b5c0b` | 289 |
| formulas-receipt.json#24 | `7e93edd6-600a-8dcf-94fc-c7e01e487697` | `a322c914` | `3846fea915bc3f84` | 290 |
| formulas-receipt.json#25 | `afbbaa23-4290-856c-affd-b2f5bab41366` | `a322c914` | `5e0058ae62006644` | 291 |
| formulas-receipt.json#26 | `05042e3b-cbe0-8784-87d9-c094e55cea07` | `a322c914` | `e29fe3e03a3183c7` | 292 |
| formulas-receipt.json#27 | `14c2d2ac-fc8a-8a4c-aac7-f3dc3a771d56` | `a322c914` | `3450b2490f319219` | 293 |
| formulas-receipt.json#28 | `c2b7fde2-f6df-8c0d-8709-8ebeece40fef` | `a322c914` | `1431dc1c73730e38` | 294 |
| formulas-receipt.json#29 | `0d2c2845-9964-8f22-b337-6545d2786200` | `a322c914` | `dab118e47ec79854` | 295 |
| formulas-receipt.json#30 | `c68c5eb2-8c20-846a-bfaf-b7bc1a98b6d7` | `a322c914` | `bab2b7d190de6106` | 296 |
| formulas-receipt.json#31 | `a8983d8d-8fd6-88a2-9efb-ba59eec3ae19` | `a322c914` | `5c33eb9daa20de5f` | 297 |
| formulas-receipt.json#32 | `9c0cd1ce-5193-888b-bcbf-73322c935730` | `a322c914` | `f5966cd95fb8a587` | 298 |
| formulas-receipt.json#33 | `a40e6f7a-d8ee-8ea1-abf7-e0e4e1a0f52c` | `a322c914` | `5e9ee50c2190517d` | 299 |
| formulas-receipt.json#34 | `85ccab05-5301-86be-b456-145a0444ee4f` | `a322c914` | `9452f0a9a14df85f` | 300 |
| formulas-receipt.json#35 | `c20d20ca-38c3-8fc0-a20d-63af67ecfa24` | `a322c914` | `918f4c150a270ab6` | 301 |
| formulas-receipt.json#36 | `b967b762-4736-85c4-992f-977921b0e2ae` | `a322c914` | `19e4e1441e0ec965` | 302 |
| formulas-receipt.json#37 | `709254d3-95b8-89df-8db3-ef9d7ebe2238` | `a322c914` | `aa2cfb68632c5119` | 303 |
| formulas-receipt.json#38 | `cf64efd7-18a8-8a32-a24f-222af0524508` | `a322c914` | `8392917421a52db1` | 304 |
| formulas-receipt.json#39 | `ccdea6c9-6242-8214-96ab-3023959f132b` | `a322c914` | `6662ca2e44ab30ce` | 305 |
| formulas-receipt.json#40 | `1c9d5d9a-3c05-83d1-9fe4-1a3297e53905` | `a322c914` | `f563e65959af7e4e` | 306 |
| formulas-receipt.json#41 | `1cc25106-020a-8746-a33e-0dfff6eff8d5` | `a322c914` | `92831b82805af163` | 307 |
| formulas-receipt.json#42 | `03ac01a3-2d65-86bd-939a-b24df26d7f76` | `a322c914` | `557f5e671bd51404` | 308 |
| formulas-receipt.json#43 | `1ffef034-9f6a-8582-be56-1d25c9156dbb` | `a322c914` | `96bf41580bb3e014` | 309 |
| formulas-receipt.json#44 | `b4df7b0d-9741-8200-be5b-45ecb19404bb` | `a322c914` | `1081e629ee709212` | 310 |
| formulas-receipt.json#45 | `fd714ceb-0b2c-8038-92c0-50cda886d0fb` | `a322c914` | `8f9bf89769e156e0` | 311 |
| formulas-receipt.json#46 | `b9461333-591a-81e8-9989-d562e1d280e8` | `a322c914` | `c26d82a4db15e6e2` | 312 |
| formulas-receipt.json#47 | `a70a65e8-b62e-8393-a66b-b8dad4255a1b` | `a322c914` | `7589f697a532a331` | 313 |
| formulas-receipt.json#48 | `5694ead0-31c2-8a77-b045-2c42c6ae5667` | `a322c914` | `ca69c8b2bfd18768` | 314 |
| formulas-receipt.json#49 | `56feab7e-2174-8cb8-b90b-d88a617e56ed` | `a322c914` | `35d178ba5806de3e` | 315 |
| formulas-receipt.json#50 | `00026851-5e08-8749-8412-6464711763ca` | `a322c914` | `79165b15a85cd1c9` | 316 |
| formulas-receipt.json#51 | `e7625e66-fac7-8dca-b8de-8a4e961032be` | `a322c914` | `19b9443386db5207` | 317 |
| formulas-receipt.json#52 | `267e7b47-bef4-8aea-b770-aaaed6143122` | `a322c914` | `a5e18eaf7c36d53e` | 318 |
| formulas-receipt.json#53 | `ca5d87a0-2f12-88c6-acf8-e6faa1e11d50` | `a322c914` | `4af9d1ed26649ab9` | 319 |
| formulas-receipt.json#54 | `2028f05e-7f34-886c-b123-e8dad451663c` | `a322c914` | `829600c37fb2c3cc` | 320 |
| formulas-receipt.json#55 | `5828cd27-4b42-8b4f-aece-c22a8ee5663a` | `a322c914` | `6384cd49f6ae7653` | 321 |
| formulas-receipt.json#56 | `0340dba0-41d8-886e-8eab-2def562678c5` | `a322c914` | `b9182644b90809c4` | 322 |
| formulas-receipt.json#57 | `1ade8091-122f-8486-aa16-edd150ccc47b` | `a322c914` | `e1016d184d08867a` | 323 |
| formulas-receipt.json#58 | `60812a2c-64a2-8169-9d05-30ba18069e2e` | `a322c914` | `61e5f465150e9fb6` | 324 |
| formulas-receipt.json#59 | `f5617442-da42-8d48-b161-9dbebb647e88` | `a322c914` | `0bb30b26a85df1e2` | 325 |
| formulas-receipt.json#60 | `733ef269-70c4-8ba0-9eba-0a573ae0059a` | `a322c914` | `e856c137149495c1` | 326 |
| formulas-receipt.json#61 | `3a3091b3-277e-8b27-838d-64d26f048be7` | `a322c914` | `577494687c1be17c` | 327 |
| formulas-receipt.json#62 | `5261c853-a6ea-85e1-90a9-31b025208a58` | `a322c914` | `06962e72272574ab` | 328 |
| formulas-receipt.json#63 | `068de534-f72c-8315-9d09-0458670bfdb7` | `a322c914` | `56b20f8799d6b7ec` | 329 |
| formulas-receipt.json#64 | `261dcf72-a481-86d6-a2bd-7f467239f259` | `a322c914` | `9d5eabf51b1d3f15` | 330 |
| formulas-receipt.json#65 | `93853848-5692-852c-8c77-1811f28fd3c8` | `a322c914` | `ab940b45add682a2` | 331 |
| formulas-receipt.json#66 | `38dc3b1c-9454-8aae-9a3c-93ae693207d6` | `a322c914` | `c1b32a56a930528a` | 332 |
| formulas-receipt.json#67 | `9ecc2771-5f8e-8238-b443-a3b42a3cf08b` | `a322c914` | `2558048ef349fa9d` | 333 |
| formulas-receipt.json#68 | `0960fca9-b31e-8a60-9020-85fc3abcfc36` | `a322c914` | `c41a2a719dbe2407` | 334 |
| formulas-receipt.json#69 | `c74b8710-7a91-8856-8081-de8d357b1867` | `a322c914` | `5e9d093b584d1aa5` | 335 |
| formulas-receipt.json#70 | `571e18c5-aaed-8d33-92f8-1afed9a4ae63` | `a322c914` | `f1c0a497d54f22b0` | 336 |
| formulas-receipt.json#71 | `39cfcdad-35cf-8ce4-b57d-cbff45ce66ea` | `a322c914` | `9c4dbfae16230c90` | 337 |
| formulas-receipt.json#72 | `fd75a2ee-c765-8114-96aa-fb7e3dc6c68e` | `a322c914` | `d342241f5ab2d9dc` | 338 |
| formulas-receipt.json#73 | `4a6aed6a-c129-8441-b3b5-d7b1288b6601` | `a322c914` | `1986cdb8d489b44b` | 339 |
| formulas-receipt.json#74 | `f6f60101-7727-89dd-9bd3-1015d89cee1f` | `a322c914` | `9092ba22b6b56870` | 340 |
| formulas-receipt.json#75 | `cb398261-2af3-8675-ab81-2185876de82c` | `a322c914` | `6b53d7d27b6d3a5c` | 341 |
| formulas-receipt.json#76 | `9ea4f111-7329-86ec-8069-fb89b94f7bb3` | `a322c914` | `8a1eb11de8387202` | 342 |
| formulas-receipt.json#77 | `1491533a-c24d-8c2a-a7f8-253519dd8d3d` | `a322c914` | `39ccfe9889225e5b` | 343 |
| formulas-receipt.json#78 | `55934d81-2a4a-890f-b8f4-c674f780ebb6` | `a322c914` | `9116f7ac9d0cd1b4` | 344 |
| fuse-receipt.json | `75962712-9fa8-8201-ae2d-cd35c17d0ac6` | `4065f6d6` | `1e8c60741e0cdbbe` | 345 |
| heat-receipt.json | `1a611e49-dc46-8bdb-a7b0-b12316aec26f` | `4065f6d6` | `fc1a45fc399a8477` | 346 |
| heat-receipt.json#0 | `97a1c5a2-0b2c-8557-b60f-592c0b13dbb4` | `1a611e49` | `b2737284398a0f26` | 347 |
| heat-receipt.json#1 | `866a894e-74eb-8067-90f9-1200c1e31d72` | `1a611e49` | `7533a7370cea232c` | 348 |
| heat-receipt.json#2 | `3c978e25-9172-8ebc-896e-519f047aa7f2` | `1a611e49` | `962dd0dcff4891ce` | 349 |
| heat-receipt.json#3 | `f093510e-4470-8ab6-89b3-0be7470638e0` | `1a611e49` | `0c4df2e2e4416d68` | 350 |
| heat-receipt.json#4 | `bee09b23-e566-8a01-ab42-99e454ac8d7d` | `1a611e49` | `929c3130c3ed4b52` | 351 |
| heat-receipt.json#5 | `c6a9450b-d946-8308-88b8-d892b5c9c7ff` | `1a611e49` | `1ab5d6e0627adcc3` | 352 |
| heat-receipt.json#6 | `e9647aba-91c9-8583-ac17-44fe9ff924b8` | `1a611e49` | `73ec51b652b2f49a` | 353 |
| heat-receipt.json#7 | `c5672ca9-c7da-8d70-943b-33457850e9c3` | `1a611e49` | `b17f013a9dea1e80` | 354 |
| heat-receipt.json#8 | `31dd3624-722e-8f25-aa30-dbd2e13d8380` | `1a611e49` | `98f0372bd35bad49` | 355 |
| heat-receipt.json#9 | `ec96b056-1860-81a4-92c0-3d3902505376` | `1a611e49` | `00b4ce2c9bfc777a` | 356 |
| heat-receipt.json#10 | `e39aab93-5431-8471-8fb7-b4f99ee49193` | `1a611e49` | `46d1c541952e93a9` | 357 |
| heat-receipt.json#11 | `415cf0b0-d427-83ed-90d2-c15372558b32` | `1a611e49` | `7d53b2ce1addd53d` | 358 |
| heat-receipt.json#12 | `1c993376-179a-88a7-ac96-75fd918e58f0` | `1a611e49` | `716f7eb929594907` | 359 |
| heat-receipt.json#13 | `7c1730a4-089c-895b-93af-56e904b6840b` | `1a611e49` | `3a57a85b8740b936` | 360 |
| heat-receipt.json#14 | `d1e0990f-4050-82a3-a0c5-2124781970e7` | `1a611e49` | `66586546aa026706` | 361 |
| heat-receipt.json#15 | `d73e0d41-d797-8c5c-b80f-9e55d4bf3593` | `1a611e49` | `b963b9c7a221285d` | 362 |
| heat-receipt.json#16 | `08c54403-3140-84be-97a2-735641f3be99` | `1a611e49` | `8ecffa54a21afd33` | 363 |
| heat-receipt.json#17 | `df45ffca-c104-8d8e-8898-f75c39fb7314` | `1a611e49` | `5c5a842cdc7f7d21` | 364 |
| heat-receipt.json#18 | `bd4f03bb-be2f-88d6-a8bd-811fea31301d` | `1a611e49` | `3f3b3999015d961d` | 365 |
| heat-receipt.json#19 | `c71e8315-769c-89db-9338-775b413602be` | `1a611e49` | `b6a8189547bfb8f6` | 366 |
| heat-receipt.json#20 | `2489c5a6-4f6d-8ef9-a579-04a86e63c846` | `1a611e49` | `02646492e69a4322` | 367 |
| heat-receipt.json#21 | `a82773e5-ed23-84fe-a6fe-3432f08cf44f` | `1a611e49` | `55b016de85ba99a2` | 368 |
| heat-receipt.json#22 | `df255612-b64f-82e2-b2b9-7a9cd9cd2788` | `1a611e49` | `c24e5314d30db09e` | 369 |
| heat-receipt.json#23 | `46dc3890-61ea-891a-9ac0-81eb970f8a26` | `1a611e49` | `c39ed620e94fb2bd` | 370 |
| heat-receipt.json#24 | `bb661013-a1e9-8f85-91aa-932844148796` | `1a611e49` | `ce3331d2ac941b0b` | 371 |
| heat-receipt.json#25 | `34c898e2-aaaa-8f72-ae6f-4a4ad950f306` | `1a611e49` | `54251c5261d19877` | 372 |
| heat-receipt.json#26 | `a7e6c5e4-82fa-895c-9791-6dab0ebe24d7` | `1a611e49` | `3b3cd7c8616cd27c` | 373 |
| heat-receipt.json#27 | `48e1f6ec-509d-8f73-89e8-f1b227535046` | `1a611e49` | `0d59aa3faedc13e7` | 374 |
| heat-receipt.json#28 | `f9946f31-e572-8d38-a938-2a499093fd75` | `1a611e49` | `b3d2796247096e16` | 375 |
| heat-receipt.json#29 | `05e3fa77-ab59-8c73-ab8e-d0443e3d5092` | `1a611e49` | `3e853ed3da3673d5` | 376 |
| heat-receipt.json#30 | `bacea7e5-946a-8a1a-8f07-26fd47b6439e` | `1a611e49` | `422b264e153eb21c` | 377 |
| heat-receipt.json#31 | `3e84abf8-c69c-8f6a-a298-acc221fed735` | `1a611e49` | `ecbc7be9c75943af` | 378 |
| heat-receipt.json#32 | `cf0dbc16-eead-82bc-81a2-876f5d403d1d` | `1a611e49` | `9111f892b64c0867` | 379 |
| heat-receipt.json#33 | `a2920cd9-45b6-8dc5-a8dc-477a9d566dc0` | `1a611e49` | `312680d08620b63f` | 380 |
| heat-receipt.json#34 | `51420a65-358f-8e7a-8325-2f6944f64972` | `1a611e49` | `8074ccd791c4166a` | 381 |
| heat-receipt.json#35 | `9768fd77-799e-8fa1-9eb7-f07465ff8801` | `1a611e49` | `a1aac37861033fe6` | 382 |
| heat-receipt.json#36 | `0a455431-e0e2-82d4-8305-534b7377dd02` | `1a611e49` | `8be6f26a65162afe` | 383 |
| heat-receipt.json#37 | `53d8939e-6e02-8774-911c-ddbe4c876102` | `1a611e49` | `5bb76a0c778251a8` | 384 |
| heat-receipt.json#38 | `51d29a9b-231d-8350-b2a3-da5524061425` | `1a611e49` | `fcded73b28ff1289` | 385 |
| heat-receipt.json#39 | `61de4584-9cf8-87ee-bfaa-9353fcba79d9` | `1a611e49` | `53115254b8e43437` | 386 |
| lattice-receipt.json | `9899ee9b-9957-89a1-920c-4f92387daecd` | `4065f6d6` | `5c9367f8765423b2` | 387 |
| lean-receipt.json | `ce47701e-25ef-8890-8557-39e5eb2b661f` | `4065f6d6` | `7a63d6ab25d404f4` | 388 |
| lean-receipt.json#0 | `5f898432-02d5-8bb3-9a63-b836308aa6e0` | `ce47701e` | `01a4314334920464` | 389 |
| lean-receipt.json#1 | `b0a02592-41f4-826b-9a9d-35fef03c0bba` | `ce47701e` | `17dd686d646c00c4` | 390 |
| lean-receipt.json#2 | `d091db71-a9dd-8623-9711-028692a3fb30` | `ce47701e` | `85559ecfe991db72` | 391 |
| lean-receipt.json#3 | `99ea1a16-3f34-8d50-9a6c-68d5fd4a1fd3` | `ce47701e` | `0b81c75ca7b9f612` | 392 |
| lean-receipt.json#4 | `45850654-2886-8a17-9ad6-d8565d498f38` | `ce47701e` | `856c8808576cb0ed` | 393 |
| lean-receipt.json#5 | `91cb88e5-c8e2-85cc-b9a7-37a41257b9a3` | `ce47701e` | `8c42f871b54b87a0` | 394 |
| lean-receipt.json#6 | `88ed2fd6-a74b-82c7-a2c6-5d49d625c2d4` | `ce47701e` | `a1bb51780f3b93f2` | 395 |
| lean-receipt.json#7 | `72b472f8-3b0a-8859-bbbd-3ce5f46009c3` | `ce47701e` | `8c393b1c4570738a` | 396 |
| lean-receipt.json#8 | `5da25169-b966-8a2f-8c09-bb2d5d594ce9` | `ce47701e` | `8759e151d526b48d` | 397 |
| lean-receipt.json#9 | `ebe71619-7f5a-8a89-a0e9-8decfffbde6f` | `ce47701e` | `ba236e62d0f2e667` | 398 |
| lean-receipt.json#10 | `e32b44fa-3427-8afa-a4fc-36383b05e64b` | `ce47701e` | `2d3bffa2815b71de` | 399 |
| lean-receipt.json#11 | `e2ab650a-9048-8319-b66f-8229ab1e9b26` | `ce47701e` | `3b823db63b5cf251` | 400 |
| lean-receipt.json#12 | `0392297c-79b0-8df8-a332-7949e67db127` | `ce47701e` | `8198bb405e69ae3d` | 401 |
| lean-receipt.json#13 | `a28390b3-6202-8807-8b5c-f6df9c94545d` | `ce47701e` | `fa381a949b4f1709` | 402 |
| lean-receipt.json#14 | `7cd59701-0c7d-8465-8685-c673950b92a1` | `ce47701e` | `ccbc114c64b5d7d5` | 403 |
| lean-receipt.json#15 | `e2502ea8-537e-88ad-825d-8614dbb4d8ce` | `ce47701e` | `ca2d842deaaa3417` | 404 |
| lean-receipt.json#16 | `0f00f681-0e93-8372-9851-7aa628c9453b` | `ce47701e` | `c26db2931600ef72` | 405 |
| lean-receipt.json#17 | `fb866b22-e34f-8778-a194-87dfcf3a271a` | `ce47701e` | `f1d614a5647be442` | 406 |
| lean-receipt.json#18 | `32ad5850-a956-8f2e-98bc-160ff647ed99` | `ce47701e` | `20b0af073db0d784` | 407 |
| lean-receipt.json#19 | `e78799aa-eb66-8d97-8bc0-0874850625e9` | `ce47701e` | `661bd8788a9d8fec` | 408 |
| lean-receipt.json#20 | `ac86d2bf-876f-88f7-9fec-2aa7b5188d07` | `ce47701e` | `8ae5bda61686e5fe` | 409 |
| lean-receipt.json#21 | `fff55c10-2348-8fa3-8e4e-4587fbaf36ea` | `ce47701e` | `0173e958093f571c` | 410 |
| lean-receipt.json#22 | `34fa6e85-a76f-8c29-a8af-358d80c22d23` | `ce47701e` | `dc9170336312cfdd` | 411 |
| lean-receipt.json#23 | `ea4be644-a91a-8738-a471-c64fb48b898a` | `ce47701e` | `a928836e949a3b08` | 412 |
| lean-receipt.json#24 | `c52acb04-8960-8360-8857-d525fba668bc` | `ce47701e` | `892beb0c6c10c5d8` | 413 |
| lean-receipt.json#25 | `aaa9dd99-8d38-8327-90d8-b5b42c58a38c` | `ce47701e` | `54b1ada5511adb73` | 414 |
| lean-receipt.json#26 | `ea70c48b-06ec-8941-8fd6-aafdf8191d6f` | `ce47701e` | `ac8eef3ad8936c18` | 415 |
| lean-receipt.json#27 | `e5faa350-2711-82ce-9a3d-c5d282d27cb9` | `ce47701e` | `7256c466c3448c3f` | 416 |
| lean-receipt.json#28 | `26c6e3c1-ed47-8179-8ae8-f476498ecb8f` | `ce47701e` | `783f0872ec919aeb` | 417 |
| lean-receipt.json#29 | `ea5285cb-b804-8779-9188-cd2d49c22c50` | `ce47701e` | `c2625317519e7ea0` | 418 |
| lean-receipt.json#30 | `6d5d593e-46b5-8bd9-abbe-1eaef5d388ce` | `ce47701e` | `b828aefe631f023f` | 419 |
| lean-receipt.json#31 | `978a9b27-39dd-8a51-99ec-5e7d3d4d1040` | `ce47701e` | `28c97dc8c98c1353` | 420 |
| lean-receipt.json#32 | `7999dec0-5ad4-83f4-a52a-bc04bf128021` | `ce47701e` | `a50a453d176456ba` | 421 |
| lean-receipt.json#33 | `57ef0769-6485-817a-857a-7d73c13071f4` | `ce47701e` | `e9987eb5bb747c92` | 422 |
| lean-receipt.json#34 | `1618ffa0-4ee1-8fc1-bfc8-fb744aecd5d4` | `ce47701e` | `d96c3e86ca8300bb` | 423 |
| lean-receipt.json#35 | `2571e715-fbc5-8a2e-974f-e495fcf17ab2` | `ce47701e` | `026803944de9f8fb` | 424 |
| lean-receipt.json#36 | `4cb74d48-9d4d-8010-854c-d7da9ba5baa2` | `ce47701e` | `9493a574bb66c834` | 425 |
| lean-receipt.json#37 | `691f7138-0c42-84fe-b86a-479b8bb372b9` | `ce47701e` | `e49607ea34f2e643` | 426 |
| lean-receipt.json#38 | `7dafa281-5810-843e-a2ef-310b4e2fa431` | `ce47701e` | `3a9d0303d541d513` | 427 |
| lean-receipt.json#39 | `a2a3c3be-d127-8c39-a303-1be9aaabb511` | `ce47701e` | `850461c1588ef998` | 428 |
| lean-receipt.json#40 | `8ba32930-b81d-8d25-af4f-00707d8b7c40` | `ce47701e` | `54ced7ee08c43b01` | 429 |
| lean-receipt.json#41 | `53e970bf-8054-8f07-b4b7-190745279d19` | `ce47701e` | `883120543a46eeba` | 430 |
| lean-receipt.json#42 | `21d507e7-abbc-8434-a6df-ee9fc25beaab` | `ce47701e` | `3ab0cd25a6b5a51c` | 431 |
| lean-receipt.json#43 | `58229458-279c-8e5c-b373-186cf4dc4682` | `ce47701e` | `f9b7bcab6eb1f2ec` | 432 |
| lean-receipt.json#44 | `f8dbb81d-284f-88ec-abd7-264067f5b64b` | `ce47701e` | `ba26eb0385ad4049` | 433 |
| lean-receipt.json#45 | `886f6198-c638-8ab7-ad8a-18d9dcc18878` | `ce47701e` | `cdfdeaec366d59a9` | 434 |
| lean-receipt.json#46 | `4f933df7-47a4-8b63-a3ad-5674e0433f50` | `ce47701e` | `a3f34c2b09cbdc81` | 435 |
| lean-receipt.json#47 | `61722f28-d70e-866b-bc91-d6db2a080db6` | `ce47701e` | `fa828c0c9002434a` | 436 |
| lean-receipt.json#48 | `103fc533-e08f-8b3d-84c4-777ba6858abc` | `ce47701e` | `390ee6112bc84229` | 437 |
| lean-receipt.json#49 | `add7d40f-1932-8ab4-86d2-ac29d0c50c89` | `ce47701e` | `14e7224d07b82fe5` | 438 |
| lean-receipt.json#50 | `ddeeb3a5-e65a-8e03-b7fb-c6e704d579bb` | `ce47701e` | `a26d61f94731765b` | 439 |
| lean-receipt.json#51 | `1c04b770-fec1-80a6-af0b-011c7d6c714a` | `ce47701e` | `0606ba04128bc864` | 440 |
| lean-receipt.json#52 | `22294fc2-251c-8398-863f-665341018e9c` | `ce47701e` | `d8fe7dee19a9eca9` | 441 |
| lean-receipt.json#53 | `2cb8d64c-be89-82f3-bf04-3b4b119ae770` | `ce47701e` | `5e9815aaca739805` | 442 |
| lean-receipt.json#54 | `29e530eb-622b-8724-a158-7c777d538968` | `ce47701e` | `fca5ef45f516834b` | 443 |
| lean-receipt.json#55 | `a29f7310-3df2-8089-bbc7-fa329884f128` | `ce47701e` | `4e0f8d28c2a80cb1` | 444 |
| lean-receipt.json#56 | `c74da606-e57e-8e3e-ae5a-2a8218abe9ea` | `ce47701e` | `bddfe267a640156c` | 445 |
| lean-receipt.json#57 | `52fc753b-cd6b-8a66-8b12-2b251ccff25a` | `ce47701e` | `aaca8fa141b1b164` | 446 |
| lean-receipt.json#58 | `604e2da0-e7a0-820f-8f18-76d2e75fa6e1` | `ce47701e` | `de9c1d0eb319845f` | 447 |
| lean-receipt.json#59 | `da2618dd-7a11-8d1e-93b2-a7716d1a35ec` | `ce47701e` | `5ad4efe87055dad6` | 448 |
| lean-receipt.json#60 | `67e299cb-0bf5-8d3b-83a0-d771d16111ad` | `ce47701e` | `21f8222a910896f8` | 449 |
| lean-receipt.json#61 | `dc055ebd-07c5-8c8f-9e3a-4d74fecfd4d8` | `ce47701e` | `9ab521ab8bfd2c30` | 450 |
| lean-receipt.json#62 | `97d40d65-570f-8c75-bfba-e96e784d17eb` | `ce47701e` | `97f276540373c55c` | 451 |
| lean-receipt.json#63 | `30ce2a88-edab-8346-866b-041539810bf1` | `ce47701e` | `433fae11c15a3406` | 452 |
| lean-receipt.json#64 | `26a9f7f9-4422-8b58-8455-4ba6606398c3` | `ce47701e` | `99f6f1bba698c440` | 453 |
| lean-receipt.json#65 | `35972c94-85dd-821d-92cc-619d978fdced` | `ce47701e` | `9f74c15228e068ae` | 454 |
| lean-receipt.json#66 | `577a6930-99af-86eb-b2de-ac623d6c8c58` | `ce47701e` | `50d88d048369584c` | 455 |
| lean-receipt.json#67 | `d160ceff-2520-8416-9b3a-d662d3f8154e` | `ce47701e` | `89f9254372ae56a4` | 456 |
| lean-receipt.json#68 | `d82f710d-8056-85be-be03-0d22db143c62` | `ce47701e` | `019312acb7ec2b4b` | 457 |
| lean-receipt.json#69 | `13f26e08-e059-83e8-b02c-7b24bc3d03bc` | `ce47701e` | `09fe6367b5d53bf0` | 458 |
| lean-receipt.json#70 | `877dbbfc-3f98-8d22-959f-86036a2c1575` | `ce47701e` | `228f135985843f8b` | 459 |
| lean-receipt.json#71 | `a295c289-a8cd-8bec-aa08-3f4615ffef2e` | `ce47701e` | `43d4a9af3eae5238` | 460 |
| lean-receipt.json#72 | `2919be93-a072-80bf-a12a-87de89f688c2` | `ce47701e` | `c48f727b686daaaa` | 461 |
| lean-receipt.json#73 | `c61c4a87-b73a-845c-84a4-2774e2d8fc73` | `ce47701e` | `e948e238756c4b88` | 462 |
| lean-receipt.json#74 | `550ffb63-b693-8b4a-9ce8-d569f591e292` | `ce47701e` | `97efe68b81d61976` | 463 |
| lean-receipt.json#75 | `2f9a33f5-0b9a-8948-81b0-9dba815fadfe` | `ce47701e` | `9bff2b6d5fc53087` | 464 |
| lean-receipt.json#76 | `9ed7a49b-c4c7-814c-b6a0-7f26593b4727` | `ce47701e` | `f7c370cf81952879` | 465 |
| lean-receipt.json#77 | `8f16deb2-d22a-8766-95c3-6fc49e5d6024` | `ce47701e` | `d3ac9515015a7683` | 466 |
| lean-receipt.json#78 | `39abc13f-5698-8625-bcbf-26d4565057e5` | `ce47701e` | `e39144dd650da2d3` | 467 |
| lean-receipt.json#79 | `03086476-3db0-8ae9-8ba7-f52cf8aa49c4` | `ce47701e` | `13aa26d4330f37b7` | 468 |
| lean-receipt.json#80 | `00d8233a-4647-8c6f-9eda-2567b4430de4` | `ce47701e` | `6fd3a89255a92ed8` | 469 |
| lean-receipt.json#81 | `c91e4aa9-7f7f-804c-854d-7a966854d1e3` | `ce47701e` | `2150be74f267d805` | 470 |
| lean-receipt.json#82 | `1fb0f5b9-a33b-88d1-b9dd-3156615e249e` | `ce47701e` | `ca40f3358e8ba4a4` | 471 |
| lean-receipt.json#83 | `d8b3b2e7-de7b-8c59-9b66-e8193d86dc36` | `ce47701e` | `cd77c6f87b5b1064` | 472 |
| lean-receipt.json#84 | `34debd66-698e-8b81-89d5-5461477c742d` | `ce47701e` | `7013fccd8490dad7` | 473 |
| lean-receipt.json#85 | `94aa7b23-d7c4-8b41-8263-489aeafc89c6` | `ce47701e` | `7502a7db02d5a467` | 474 |
| lean-receipt.json#86 | `06cdc78f-cc5d-839e-aace-3fded51ec757` | `ce47701e` | `d8ed6351f82dc020` | 475 |
| lean-receipt.json#87 | `05430847-c5be-80d2-b184-b0b2ab183095` | `ce47701e` | `87ad43e6d9e74af4` | 476 |
| lean-receipt.json#88 | `eb625bd8-091a-8a28-af09-049b41907fa6` | `ce47701e` | `29a1ce5eccc794cd` | 477 |
| lean-receipt.json#89 | `ec8220e4-198e-8239-a9ef-5450465c8d63` | `ce47701e` | `917a754ef7ded231` | 478 |
| lean-receipt.json#90 | `d544b683-e68f-8491-976d-7295694eb01c` | `ce47701e` | `2ddbc9e72c5863a3` | 479 |
| lean-receipt.json#91 | `eef17a1b-d813-8acf-9562-e413976ce1e6` | `ce47701e` | `19e70810b6c0569e` | 480 |
| lean-receipt.json#92 | `13bbc8fe-264f-8357-9cf5-98097d0870ee` | `ce47701e` | `ab2dc0ed36085aae` | 481 |
| lean-receipt.json#93 | `fa8c42ff-965d-8478-b7fd-51edf58aac5c` | `ce47701e` | `6b6a512c4de306e7` | 482 |
| lean-receipt.json#94 | `29b2740d-6e10-8c66-8fa9-3a7de5291eb3` | `ce47701e` | `8cc93ec2a2c3b4c1` | 483 |
| lean-receipt.json#95 | `f76cba61-16ca-8336-8b62-c17607d7bb19` | `ce47701e` | `4da17eb3cca04d6f` | 484 |
| lean-receipt.json#96 | `cd9d4a9c-3ee4-8ce7-9f39-d677faab6bdd` | `ce47701e` | `cca2e313bbad6348` | 485 |
| lean-receipt.json#97 | `8ac6bd4c-626f-8949-a4d0-2f7118a5f4b1` | `ce47701e` | `178311578707a3d9` | 486 |
| lean-receipt.json#98 | `9b1f4e46-6e4e-8727-89d0-9b367ecb46a3` | `ce47701e` | `d6aad521dd3822c7` | 487 |
| lean-receipt.json#99 | `865511cc-a7ce-836a-8ff9-acb47b984333` | `ce47701e` | `a558c1105bcf6999` | 488 |
| lean-receipt.json#100 | `11de06b1-d1c0-8bdc-8ad7-d7be64959906` | `ce47701e` | `7002d9a2943b4233` | 489 |
| lean-receipt.json#101 | `5343062d-7c7c-8989-8e7a-06a341b9b154` | `ce47701e` | `af05078facef6371` | 490 |
| lean-receipt.json#102 | `b873a347-75ee-84e5-b7eb-e3a63231943d` | `ce47701e` | `d440e12709b21f65` | 491 |
| lean-receipt.json#103 | `5ebf0baa-514f-8357-a5b3-72d10c43cb58` | `ce47701e` | `4a5dc765b0ae881a` | 492 |
| lean-receipt.json#104 | `ecbbb323-0d2d-8e89-bf26-6173bfcab10b` | `ce47701e` | `6e33961b381f1b24` | 493 |
| lean-receipt.json#105 | `29fef8e1-bfe9-8847-a1ef-3226186e8365` | `ce47701e` | `8995d8a066b7efef` | 494 |
| lean-receipt.json#106 | `98a07080-b380-8e58-afd4-25937fd3c19a` | `ce47701e` | `ee05cc004c566b7d` | 495 |
| lean-receipt.json#107 | `67bc2ed9-cb10-8652-97e1-80a32e48690e` | `ce47701e` | `4a5f92880000ec12` | 496 |
| lean-receipt.json#108 | `9c0502d7-9c24-8961-be0c-331e2efce966` | `ce47701e` | `673fccabf7917e43` | 497 |
| lean-receipt.json#109 | `a65712bb-3adc-868b-bd83-edcdca8ddb61` | `ce47701e` | `7e721ac4c1f5636e` | 498 |
| lean-receipt.json#110 | `d475d8d3-f53f-88a4-8cef-9e7b24a63fa6` | `ce47701e` | `5104b1b5d221fe0c` | 499 |
| lean-receipt.json#111 | `0b520ef4-c160-8b8e-b290-f24122918c8f` | `ce47701e` | `a53e2a3165bc2079` | 500 |
| lean-receipt.json#112 | `7f07a76e-cf72-8eaf-85bc-96bb8853eb3a` | `ce47701e` | `ac11551381559b5d` | 501 |
| lean-receipt.json#113 | `3242e9cc-f542-8138-97ef-4b36b0e5f634` | `ce47701e` | `1e76aaa529c1faf4` | 502 |
| lean-receipt.json#114 | `e18c022e-6094-8985-97fb-1b940a15923b` | `ce47701e` | `6650de8fa69d0055` | 503 |
| lean-receipt.json#115 | `682c36e7-cfcb-87fc-be76-3b8430881944` | `ce47701e` | `45ffdc938f29d266` | 504 |
| lean-receipt.json#116 | `5d7c702a-80f7-824c-bc65-261023a1e60a` | `ce47701e` | `29720f16131d7884` | 505 |
| lean-receipt.json#117 | `7f402d2b-e088-8236-8864-8b9f58f8540f` | `ce47701e` | `8f9e22c7e2bea6c9` | 506 |
| lean-receipt.json#118 | `5d251909-1650-882e-8b5e-030a2f6c02f0` | `ce47701e` | `f9363e39d4b6cfec` | 507 |
| lean-receipt.json#119 | `02d207ac-afcb-8dd7-b00c-f65bef312067` | `ce47701e` | `123fa2b2b6e380b2` | 508 |
| lean-receipt.json#120 | `b041ab1b-6361-8be3-a8ff-63e17f4510f7` | `ce47701e` | `df00ee1dd773d8f2` | 509 |
| lean-receipt.json#121 | `e3c8228a-743f-8ff1-bdd7-82703d3faec7` | `ce47701e` | `20f85f44fda02861` | 510 |
| lean-receipt.json#122 | `de2d9ce9-8d25-8a36-a4b2-684d953b17c8` | `ce47701e` | `040743c9cee1336f` | 511 |
| lean-receipt.json#123 | `c89b4cd8-0374-85c5-8fdc-c66ba836100e` | `ce47701e` | `bfa20fd6cf759420` | 512 |
| payload-cf-receipt.json | `9aa288b9-1d0a-80d0-a50d-25e1dfe36824` | `4065f6d6` | `f62f0aaf7ff26014` | 513 |
| percall-receipt.json | `a7073cf3-1bc5-8f80-93a8-313a5cac9773` | `4065f6d6` | `bb48a531ebc72170` | 514 |
| refusals-receipt.json | `705efc2c-7f15-8a65-ab03-a2afff801d02` | `4065f6d6` | `8c5570077f4d6204` | 515 |
| test-receipt.json | `667c1621-1285-862b-b869-63b1fe20e190` | `4065f6d6` | `4a5cfb5ecff89ea1` | 516 |
| test-receipt.json#0 | `dc60fee8-e223-8df7-bfea-252899ee0f89` | `667c1621` | `9a01ace6de6b54ec` | 517 |
| test-receipt.json#1 | `28c91dd4-c7e2-8ca1-ba6d-3b489685a890` | `667c1621` | `a13d744057ec9cc2` | 518 |
| test-receipt.json#2 | `b8f97d4a-f1df-8cbd-af84-5ded86489764` | `667c1621` | `bbd68eebc2fb3df3` | 519 |
| test-receipt.json#3 | `65655be9-9e83-8bef-89c8-a0fbbdd33f1a` | `667c1621` | `e739f4896d14e203` | 520 |
| test-receipt.json#4 | `929feeb1-fc35-8807-85d6-a4e8f2149b73` | `667c1621` | `7d78476f346361f5` | 521 |
| test-receipt.json#5 | `24d8da78-387c-88cb-9da0-d75ce016259c` | `667c1621` | `3120a62df82699eb` | 522 |
| test-receipt.json#6 | `eca2c616-e2c6-8da2-8c0a-fac0c1ed9132` | `667c1621` | `e603dbc8c5889a16` | 523 |
| test-receipt.json#7 | `63cc5a2a-a40d-841a-9154-c1d15972c359` | `667c1621` | `09c5ebed7bd28d13` | 524 |
| test-receipt.json#8 | `25e30882-b083-869f-9c0b-6748002c1734` | `667c1621` | `987476006a69a566` | 525 |
| test-receipt.json#9 | `3e0b11fd-3fef-8ae3-8685-8faf492b28af` | `667c1621` | `5d554129661dae60` | 526 |
| test-receipt.json#10 | `92b70203-d22b-87c0-8568-1f58fbbfee62` | `667c1621` | `c25f540b1357461f` | 527 |
| walls-receipt.json | `a14d50e0-13b2-875c-b478-5cd9c938d1ae` | `4065f6d6` | `46393a1f4c0937d6` | 528 |
| readme | `56fdc627-8cd1-80bc-b587-29de20d72096` | `4065f6d6` | `b1098f0df2c1eaa0` | 529 |

Regenerate with `npm run readme` after `npm run build` and the receipt-producing runs; `node scripts/generate-readme.mjs --check`
compares. Documentation: [docs/README.md](docs/README.md). License: CC-BY-NC-ND-4.0.
