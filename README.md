# UUIDNA QPU

**Final build receipt** `35c4be51-a2d3-88ba-ab12-5e94950b722d`

| | |
|---|---|
| version | 1.0.0 |
| commit | `0e68febb2e838e84e7f2b54a6308ce0a6ad2d16b` |
| receipts | 9 files, 151 nodes |
| build stream | length 151, head `35c4be51-a2d3-88ba-ab12-5e94950b722d`, chain `8f5e6440692b792e`, holds **true** |

Each node is a quantum receipt: its UUID is the RFC 9562 v8 content address of its payload fold and its referrer, and
its referrer is the node above it. Change any receipt's bytes and its node, its file's node, the build stream chain
and this final receipt move; the root moves with the commit.

```mermaid
flowchart TD
  n494ca9cc["root<br/><code>494ca9cc</code>"]
  ndcbb2a20["cross-receipt.json<br/><code>dcbb2a20</code>"]
  nb535d575["cross-receipt.json#0<br/><code>b535d575</code>"]
  n50990212["cross-receipt.json#1<br/><code>50990212</code>"]
  n0d8a1a3d["cross-receipt.json#2<br/><code>0d8a1a3d</code>"]
  nfe1c3b4c["cross-receipt.json#3<br/><code>fe1c3b4c</code>"]
  ne22f9d76["cross-receipt.json#4<br/><code>e22f9d76</code>"]
  n2eb5a6ae["cross-receipt.json#5<br/><code>2eb5a6ae</code>"]
  n05b30a8d["cross-receipt.json#6<br/><code>05b30a8d</code>"]
  nfc3ea654["cross-receipt.json#7<br/><code>fc3ea654</code>"]
  n1bb26113["cross-receipt.json#8<br/><code>1bb26113</code>"]
  n79551549["cross-receipt.json#9<br/><code>79551549</code>"]
  neaf2ae9a["cross-receipt.json#10<br/><code>eaf2ae9a</code>"]
  n35a23ed6["cross-receipt.json#11<br/><code>35a23ed6</code>"]
  n77aef98d["cross-receipt.json#12<br/><code>77aef98d</code>"]
  nae656c93["cross-receipt.json#13<br/><code>ae656c93</code>"]
  n0c790925["cross-receipt.json#14<br/><code>0c790925</code>"]
  n265d980e["cross-receipt.json#15<br/><code>265d980e</code>"]
  nb865ac16["cross-receipt.json#16<br/><code>b865ac16</code>"]
  n04b30bb0["cross-receipt.json#17<br/><code>04b30bb0</code>"]
  nd98ff738["cross-receipt.json#18<br/><code>d98ff738</code>"]
  n5562f552["cross-receipt.json#19<br/><code>5562f552</code>"]
  n839e5c56["cross-receipt.json#20<br/><code>839e5c56</code>"]
  n9a6ed41f["cross-receipt.json#21<br/><code>9a6ed41f</code>"]
  n57dce2cf["cross-receipt.json#22<br/><code>57dce2cf</code>"]
  nd3dfdaa4["cross-receipt.json#23<br/><code>d3dfdaa4</code>"]
  n35d2e878["cross-receipt.json#24<br/><code>35d2e878</code>"]
  n71ecf0c0["cross-receipt.json#25<br/><code>71ecf0c0</code>"]
  n15d10097["cross-receipt.json#26<br/><code>15d10097</code>"]
  n0934a162["cross-receipt.json#27<br/><code>0934a162</code>"]
  n5b295d8e["cross-receipt.json#28<br/><code>5b295d8e</code>"]
  nf153adab["cross-receipt.json#29<br/><code>f153adab</code>"]
  n1259721a["debts-receipt.json<br/><code>1259721a</code>"]
  nd2d86660["flaws-receipt.json<br/><code>d2d86660</code>"]
  n207ba236["lattice-receipt.json<br/><code>207ba236</code>"]
  n9487965c["lean-receipt.json<br/><code>9487965c</code>"]
  na3557df6["lean-receipt.json#0<br/><code>a3557df6</code>"]
  n9777f90f["lean-receipt.json#1<br/><code>9777f90f</code>"]
  n995828c7["lean-receipt.json#2<br/><code>995828c7</code>"]
  na4fd42e7["lean-receipt.json#3<br/><code>a4fd42e7</code>"]
  nee8e0ccd["lean-receipt.json#4<br/><code>ee8e0ccd</code>"]
  na5b48d0b["lean-receipt.json#5<br/><code>a5b48d0b</code>"]
  n8829f70b["lean-receipt.json#6<br/><code>8829f70b</code>"]
  n0643fce3["lean-receipt.json#7<br/><code>0643fce3</code>"]
  nf76b44c3["lean-receipt.json#8<br/><code>f76b44c3</code>"]
  n39cdcc77["lean-receipt.json#9<br/><code>39cdcc77</code>"]
  n6b0ddf34["lean-receipt.json#10<br/><code>6b0ddf34</code>"]
  n3bdb2850["lean-receipt.json#11<br/><code>3bdb2850</code>"]
  nf9f40b93["lean-receipt.json#12<br/><code>f9f40b93</code>"]
  n67348c30["lean-receipt.json#13<br/><code>67348c30</code>"]
  n8d57f575["lean-receipt.json#14<br/><code>8d57f575</code>"]
  n477aed38["lean-receipt.json#15<br/><code>477aed38</code>"]
  n0cb7aa08["lean-receipt.json#16<br/><code>0cb7aa08</code>"]
  ndb8b5fbd["lean-receipt.json#17<br/><code>db8b5fbd</code>"]
  nc646636b["lean-receipt.json#18<br/><code>c646636b</code>"]
  n6c5cd87a["lean-receipt.json#19<br/><code>6c5cd87a</code>"]
  n79e4a245["lean-receipt.json#20<br/><code>79e4a245</code>"]
  n7b430145["lean-receipt.json#21<br/><code>7b430145</code>"]
  n5d173f4c["lean-receipt.json#22<br/><code>5d173f4c</code>"]
  ncbb5975b["lean-receipt.json#23<br/><code>cbb5975b</code>"]
  n43375749["lean-receipt.json#24<br/><code>43375749</code>"]
  n3fdf6176["lean-receipt.json#25<br/><code>3fdf6176</code>"]
  nff09e79d["lean-receipt.json#26<br/><code>ff09e79d</code>"]
  n2040569e["lean-receipt.json#27<br/><code>2040569e</code>"]
  nf4174dd1["lean-receipt.json#28<br/><code>f4174dd1</code>"]
  ne474e079["lean-receipt.json#29<br/><code>e474e079</code>"]
  n8ebb7a12["lean-receipt.json#30<br/><code>8ebb7a12</code>"]
  n46e12f09["lean-receipt.json#31<br/><code>46e12f09</code>"]
  n514344aa["lean-receipt.json#32<br/><code>514344aa</code>"]
  ne51bc292["lean-receipt.json#33<br/><code>e51bc292</code>"]
  n33a0ccae["lean-receipt.json#34<br/><code>33a0ccae</code>"]
  nc4a984d5["lean-receipt.json#35<br/><code>c4a984d5</code>"]
  n3b70dcf0["lean-receipt.json#36<br/><code>3b70dcf0</code>"]
  na0bf5003["lean-receipt.json#37<br/><code>a0bf5003</code>"]
  n0c0a9d7b["lean-receipt.json#38<br/><code>0c0a9d7b</code>"]
  n8f16af88["lean-receipt.json#39<br/><code>8f16af88</code>"]
  n478c5137["lean-receipt.json#40<br/><code>478c5137</code>"]
  n9ae8b00a["lean-receipt.json#41<br/><code>9ae8b00a</code>"]
  n6907d146["lean-receipt.json#42<br/><code>6907d146</code>"]
  n3075b0e0["lean-receipt.json#43<br/><code>3075b0e0</code>"]
  n2e890359["lean-receipt.json#44<br/><code>2e890359</code>"]
  n49eab638["lean-receipt.json#45<br/><code>49eab638</code>"]
  nd42b9ad5["lean-receipt.json#46<br/><code>d42b9ad5</code>"]
  n82f1e313["lean-receipt.json#47<br/><code>82f1e313</code>"]
  n803e00fa["lean-receipt.json#48<br/><code>803e00fa</code>"]
  n4037853d["lean-receipt.json#49<br/><code>4037853d</code>"]
  nd7a12a0d["lean-receipt.json#50<br/><code>d7a12a0d</code>"]
  n06e43573["lean-receipt.json#51<br/><code>06e43573</code>"]
  nd8a7d80f["lean-receipt.json#52<br/><code>d8a7d80f</code>"]
  n00f96ee0["lean-receipt.json#53<br/><code>00f96ee0</code>"]
  na60e98a1["lean-receipt.json#54<br/><code>a60e98a1</code>"]
  n749d3ac3["lean-receipt.json#55<br/><code>749d3ac3</code>"]
  n9a27d330["lean-receipt.json#56<br/><code>9a27d330</code>"]
  nb5ae8ebb["lean-receipt.json#57<br/><code>b5ae8ebb</code>"]
  n94dc0c96["lean-receipt.json#58<br/><code>94dc0c96</code>"]
  n42bab506["lean-receipt.json#59<br/><code>42bab506</code>"]
  n27261cd2["lean-receipt.json#60<br/><code>27261cd2</code>"]
  n5f2db113["lean-receipt.json#61<br/><code>5f2db113</code>"]
  n1bf561d6["lean-receipt.json#62<br/><code>1bf561d6</code>"]
  n9ede0ca8["lean-receipt.json#63<br/><code>9ede0ca8</code>"]
  nf1321cf3["lean-receipt.json#64<br/><code>f1321cf3</code>"]
  n46a76211["lean-receipt.json#65<br/><code>46a76211</code>"]
  n57e06fb7["lean-receipt.json#66<br/><code>57e06fb7</code>"]
  n64b130a1["lean-receipt.json#67<br/><code>64b130a1</code>"]
  naac2cb72["lean-receipt.json#68<br/><code>aac2cb72</code>"]
  n6e91b165["lean-receipt.json#69<br/><code>6e91b165</code>"]
  n431d4681["lean-receipt.json#70<br/><code>431d4681</code>"]
  ncd5c4960["lean-receipt.json#71<br/><code>cd5c4960</code>"]
  n0a9ce8ec["lean-receipt.json#72<br/><code>0a9ce8ec</code>"]
  n9654c13d["lean-receipt.json#73<br/><code>9654c13d</code>"]
  nc7e9f9eb["lean-receipt.json#74<br/><code>c7e9f9eb</code>"]
  n66e43c2e["lean-receipt.json#75<br/><code>66e43c2e</code>"]
  n966ecafe["lean-receipt.json#76<br/><code>966ecafe</code>"]
  n48f41417["lean-receipt.json#77<br/><code>48f41417</code>"]
  ne581aa5a["lean-receipt.json#78<br/><code>e581aa5a</code>"]
  n93d48da5["lean-receipt.json#79<br/><code>93d48da5</code>"]
  nc26b9bea["lean-receipt.json#80<br/><code>c26b9bea</code>"]
  nf593d707["lean-receipt.json#81<br/><code>f593d707</code>"]
  nd49419b1["lean-receipt.json#82<br/><code>d49419b1</code>"]
  n2b58f9d4["lean-receipt.json#83<br/><code>2b58f9d4</code>"]
  n35dec0ea["lean-receipt.json#84<br/><code>35dec0ea</code>"]
  nb8382df6["lean-receipt.json#85<br/><code>b8382df6</code>"]
  n4d290377["lean-receipt.json#86<br/><code>4d290377</code>"]
  nf4f68d06["lean-receipt.json#87<br/><code>f4f68d06</code>"]
  nb3f150d0["lean-receipt.json#88<br/><code>b3f150d0</code>"]
  ncb0f6f52["lean-receipt.json#89<br/><code>cb0f6f52</code>"]
  ne8582e46["lean-receipt.json#90<br/><code>e8582e46</code>"]
  n3efa9eda["lean-receipt.json#91<br/><code>3efa9eda</code>"]
  nd9423b7f["lean-receipt.json#92<br/><code>d9423b7f</code>"]
  n1c206a94["lean-receipt.json#93<br/><code>1c206a94</code>"]
  n14ea3bd3["lean-receipt.json#94<br/><code>14ea3bd3</code>"]
  n08b67df4["lean-receipt.json#95<br/><code>08b67df4</code>"]
  nd6ebc4ed["lean-receipt.json#96<br/><code>d6ebc4ed</code>"]
  n7ec376e0["lean-receipt.json#97<br/><code>7ec376e0</code>"]
  nedc83ad3["lean-receipt.json#98<br/><code>edc83ad3</code>"]
  nc569d877["percall-receipt.json<br/><code>c569d877</code>"]
  ne5ba69ad["refusals-receipt.json<br/><code>e5ba69ad</code>"]
  nab750852["test-receipt.json<br/><code>ab750852</code>"]
  nf414ab46["test-receipt.json#0<br/><code>f414ab46</code>"]
  n12cc31f6["test-receipt.json#1<br/><code>12cc31f6</code>"]
  ne6fc018f["test-receipt.json#2<br/><code>e6fc018f</code>"]
  ne515594f["test-receipt.json#3<br/><code>e515594f</code>"]
  n256e2e83["test-receipt.json#4<br/><code>256e2e83</code>"]
  n24b2cc2c["test-receipt.json#5<br/><code>24b2cc2c</code>"]
  n1d1472a4["test-receipt.json#6<br/><code>1d1472a4</code>"]
  n77636ab1["test-receipt.json#7<br/><code>77636ab1</code>"]
  n63022a29["test-receipt.json#8<br/><code>63022a29</code>"]
  nd4471b20["test-receipt.json#9<br/><code>d4471b20</code>"]
  n60b6a578["test-receipt.json#10<br/><code>60b6a578</code>"]
  n53eeba88["walls-receipt.json<br/><code>53eeba88</code>"]
  n35c4be51["readme<br/><code>35c4be51</code>"]
  n494ca9cc --> ndcbb2a20
  ndcbb2a20 --> nb535d575
  ndcbb2a20 --> n50990212
  ndcbb2a20 --> n0d8a1a3d
  ndcbb2a20 --> nfe1c3b4c
  ndcbb2a20 --> ne22f9d76
  ndcbb2a20 --> n2eb5a6ae
  ndcbb2a20 --> n05b30a8d
  ndcbb2a20 --> nfc3ea654
  ndcbb2a20 --> n1bb26113
  ndcbb2a20 --> n79551549
  ndcbb2a20 --> neaf2ae9a
  ndcbb2a20 --> n35a23ed6
  ndcbb2a20 --> n77aef98d
  ndcbb2a20 --> nae656c93
  ndcbb2a20 --> n0c790925
  ndcbb2a20 --> n265d980e
  ndcbb2a20 --> nb865ac16
  ndcbb2a20 --> n04b30bb0
  ndcbb2a20 --> nd98ff738
  ndcbb2a20 --> n5562f552
  ndcbb2a20 --> n839e5c56
  ndcbb2a20 --> n9a6ed41f
  ndcbb2a20 --> n57dce2cf
  ndcbb2a20 --> nd3dfdaa4
  ndcbb2a20 --> n35d2e878
  ndcbb2a20 --> n71ecf0c0
  ndcbb2a20 --> n15d10097
  ndcbb2a20 --> n0934a162
  ndcbb2a20 --> n5b295d8e
  ndcbb2a20 --> nf153adab
  n494ca9cc --> n1259721a
  n494ca9cc --> nd2d86660
  n494ca9cc --> n207ba236
  n494ca9cc --> n9487965c
  n9487965c --> na3557df6
  n9487965c --> n9777f90f
  n9487965c --> n995828c7
  n9487965c --> na4fd42e7
  n9487965c --> nee8e0ccd
  n9487965c --> na5b48d0b
  n9487965c --> n8829f70b
  n9487965c --> n0643fce3
  n9487965c --> nf76b44c3
  n9487965c --> n39cdcc77
  n9487965c --> n6b0ddf34
  n9487965c --> n3bdb2850
  n9487965c --> nf9f40b93
  n9487965c --> n67348c30
  n9487965c --> n8d57f575
  n9487965c --> n477aed38
  n9487965c --> n0cb7aa08
  n9487965c --> ndb8b5fbd
  n9487965c --> nc646636b
  n9487965c --> n6c5cd87a
  n9487965c --> n79e4a245
  n9487965c --> n7b430145
  n9487965c --> n5d173f4c
  n9487965c --> ncbb5975b
  n9487965c --> n43375749
  n9487965c --> n3fdf6176
  n9487965c --> nff09e79d
  n9487965c --> n2040569e
  n9487965c --> nf4174dd1
  n9487965c --> ne474e079
  n9487965c --> n8ebb7a12
  n9487965c --> n46e12f09
  n9487965c --> n514344aa
  n9487965c --> ne51bc292
  n9487965c --> n33a0ccae
  n9487965c --> nc4a984d5
  n9487965c --> n3b70dcf0
  n9487965c --> na0bf5003
  n9487965c --> n0c0a9d7b
  n9487965c --> n8f16af88
  n9487965c --> n478c5137
  n9487965c --> n9ae8b00a
  n9487965c --> n6907d146
  n9487965c --> n3075b0e0
  n9487965c --> n2e890359
  n9487965c --> n49eab638
  n9487965c --> nd42b9ad5
  n9487965c --> n82f1e313
  n9487965c --> n803e00fa
  n9487965c --> n4037853d
  n9487965c --> nd7a12a0d
  n9487965c --> n06e43573
  n9487965c --> nd8a7d80f
  n9487965c --> n00f96ee0
  n9487965c --> na60e98a1
  n9487965c --> n749d3ac3
  n9487965c --> n9a27d330
  n9487965c --> nb5ae8ebb
  n9487965c --> n94dc0c96
  n9487965c --> n42bab506
  n9487965c --> n27261cd2
  n9487965c --> n5f2db113
  n9487965c --> n1bf561d6
  n9487965c --> n9ede0ca8
  n9487965c --> nf1321cf3
  n9487965c --> n46a76211
  n9487965c --> n57e06fb7
  n9487965c --> n64b130a1
  n9487965c --> naac2cb72
  n9487965c --> n6e91b165
  n9487965c --> n431d4681
  n9487965c --> ncd5c4960
  n9487965c --> n0a9ce8ec
  n9487965c --> n9654c13d
  n9487965c --> nc7e9f9eb
  n9487965c --> n66e43c2e
  n9487965c --> n966ecafe
  n9487965c --> n48f41417
  n9487965c --> ne581aa5a
  n9487965c --> n93d48da5
  n9487965c --> nc26b9bea
  n9487965c --> nf593d707
  n9487965c --> nd49419b1
  n9487965c --> n2b58f9d4
  n9487965c --> n35dec0ea
  n9487965c --> nb8382df6
  n9487965c --> n4d290377
  n9487965c --> nf4f68d06
  n9487965c --> nb3f150d0
  n9487965c --> ncb0f6f52
  n9487965c --> ne8582e46
  n9487965c --> n3efa9eda
  n9487965c --> nd9423b7f
  n9487965c --> n1c206a94
  n9487965c --> n14ea3bd3
  n9487965c --> n08b67df4
  n9487965c --> nd6ebc4ed
  n9487965c --> n7ec376e0
  n9487965c --> nedc83ad3
  n494ca9cc --> nc569d877
  n494ca9cc --> ne5ba69ad
  n494ca9cc --> nab750852
  nab750852 --> nf414ab46
  nab750852 --> n12cc31f6
  nab750852 --> ne6fc018f
  nab750852 --> ne515594f
  nab750852 --> n256e2e83
  nab750852 --> n24b2cc2c
  nab750852 --> n1d1472a4
  nab750852 --> n77636ab1
  nab750852 --> n63022a29
  nab750852 --> nd4471b20
  nab750852 --> n60b6a578
  n494ca9cc --> n53eeba88
  n494ca9cc --> n35c4be51
```

| node | receipt uuid | referrer | payload fold | seq |
|---|---|---|---|---|
| root | `494ca9cc-4d25-85b9-bed0-3d478434d3d6` | `0e68febb` | `2930da42d1a03022` | 0 |
| cross-receipt.json | `dcbb2a20-a5ad-8285-b63f-fedbeff5e6ee` | `494ca9cc` | `74f12a23d5e80f05` | 1 |
| cross-receipt.json#0 | `b535d575-2cb6-8a65-a818-ac810c8811df` | `dcbb2a20` | `14432830058e1e46` | 2 |
| cross-receipt.json#1 | `50990212-45e9-8d38-8f29-550ea6b2e259` | `dcbb2a20` | `09410219d171472e` | 3 |
| cross-receipt.json#2 | `0d8a1a3d-e397-8278-bc4e-8616d328ed54` | `dcbb2a20` | `e2cac0a5a1701ff8` | 4 |
| cross-receipt.json#3 | `fe1c3b4c-1475-8e9a-b44f-ce6e78265c34` | `dcbb2a20` | `72b0abb676747470` | 5 |
| cross-receipt.json#4 | `e22f9d76-a02e-865f-950d-93bf2e32b9f7` | `dcbb2a20` | `c1a885b32ef960e5` | 6 |
| cross-receipt.json#5 | `2eb5a6ae-670e-8011-b514-dff54f6fd390` | `dcbb2a20` | `6b591900e22f2ba8` | 7 |
| cross-receipt.json#6 | `05b30a8d-b617-8b1d-ad5e-05feb681ffdd` | `dcbb2a20` | `ad1fcc55bdfb7a52` | 8 |
| cross-receipt.json#7 | `fc3ea654-35bc-875b-93e7-1e989813374b` | `dcbb2a20` | `c27faa42150e6e98` | 9 |
| cross-receipt.json#8 | `1bb26113-92c4-80bb-811f-3d0eba135137` | `dcbb2a20` | `294f0992ef5aa44f` | 10 |
| cross-receipt.json#9 | `79551549-0af7-8ae2-8595-1c9081845260` | `dcbb2a20` | `c02f3dc29a4b8ace` | 11 |
| cross-receipt.json#10 | `eaf2ae9a-58c8-82fc-bc51-f6b2db191414` | `dcbb2a20` | `764468a81718149c` | 12 |
| cross-receipt.json#11 | `35a23ed6-f0e3-89fd-bdee-47d0ce1d8a05` | `dcbb2a20` | `870f3b1867cf8006` | 13 |
| cross-receipt.json#12 | `77aef98d-553c-8e9d-bf7a-6550e020fc6e` | `dcbb2a20` | `e3aa4daad4f109db` | 14 |
| cross-receipt.json#13 | `ae656c93-c5ee-8b50-8ad4-cfd879ba24bc` | `dcbb2a20` | `0ef75e8dc811861b` | 15 |
| cross-receipt.json#14 | `0c790925-407c-8b0d-8383-cf6bbde589d0` | `dcbb2a20` | `87276d09343fa13b` | 16 |
| cross-receipt.json#15 | `265d980e-e035-850e-9901-1def3dd6277b` | `dcbb2a20` | `0df990216d41b6e8` | 17 |
| cross-receipt.json#16 | `b865ac16-0b42-804b-b1db-7e6bee4f6a84` | `dcbb2a20` | `d148afcd4838e3b8` | 18 |
| cross-receipt.json#17 | `04b30bb0-9ac0-8213-8515-c56a37551ab7` | `dcbb2a20` | `fc9ca0ae74cb7a8e` | 19 |
| cross-receipt.json#18 | `d98ff738-9269-8708-b94d-c6297d8233ea` | `dcbb2a20` | `58579b18fc23f7ca` | 20 |
| cross-receipt.json#19 | `5562f552-b591-8679-b264-1a7410b96757` | `dcbb2a20` | `571b3a1c9d1084ae` | 21 |
| cross-receipt.json#20 | `839e5c56-cb30-8cc2-aae7-f2a30b46623b` | `dcbb2a20` | `f892be6f720eced1` | 22 |
| cross-receipt.json#21 | `9a6ed41f-3e52-8178-84a6-51c3608a133c` | `dcbb2a20` | `33be92ef70a7f2c7` | 23 |
| cross-receipt.json#22 | `57dce2cf-3470-8eb6-b42f-c49b2ca9b0e7` | `dcbb2a20` | `146e0cc7e9ce75ec` | 24 |
| cross-receipt.json#23 | `d3dfdaa4-aff3-84bc-b1c8-e91a2c967f5e` | `dcbb2a20` | `969872c0b9114f29` | 25 |
| cross-receipt.json#24 | `35d2e878-428b-837d-ac4d-bc3544c94e58` | `dcbb2a20` | `83589d423d2f6c5d` | 26 |
| cross-receipt.json#25 | `71ecf0c0-49cc-83da-b637-62bf085bef1c` | `dcbb2a20` | `c0f5574332b76de0` | 27 |
| cross-receipt.json#26 | `15d10097-0639-8041-92c7-44d9514f81c5` | `dcbb2a20` | `55ac55b92bd4690e` | 28 |
| cross-receipt.json#27 | `0934a162-f564-8318-a260-f57d0b4ea581` | `dcbb2a20` | `180465219da3fd47` | 29 |
| cross-receipt.json#28 | `5b295d8e-ea1d-8eea-bf39-8cb009215203` | `dcbb2a20` | `2fd485b1bf1c80a6` | 30 |
| cross-receipt.json#29 | `f153adab-baf1-8acc-bb4c-aad78c1d9219` | `dcbb2a20` | `44460d3c758a0a12` | 31 |
| debts-receipt.json | `1259721a-a3eb-8c9f-8201-a374a25fc9bd` | `494ca9cc` | `de5129853bb193de` | 32 |
| flaws-receipt.json | `d2d86660-5207-88b6-9cc6-c14a466a0743` | `494ca9cc` | `ff955046d9f87003` | 33 |
| lattice-receipt.json | `207ba236-6076-8bae-aeda-6c1dda7678ed` | `494ca9cc` | `36da43b99a7f4375` | 34 |
| lean-receipt.json | `9487965c-922f-82a4-b371-3a44f509adc1` | `494ca9cc` | `f848cde81cd22ed9` | 35 |
| lean-receipt.json#0 | `a3557df6-6e94-8734-a957-6b0c90dbf71b` | `9487965c` | `5e94eaa2291848e0` | 36 |
| lean-receipt.json#1 | `9777f90f-afe8-88a9-91ef-303e89a6a773` | `9487965c` | `486f749e6e5cc2d6` | 37 |
| lean-receipt.json#2 | `995828c7-af8d-8a4d-bc64-f6148dbdbc5f` | `9487965c` | `3ed2794945659ea1` | 38 |
| lean-receipt.json#3 | `a4fd42e7-6f3b-83e9-ba67-a2d93d0621d2` | `9487965c` | `3214d3c4765494b1` | 39 |
| lean-receipt.json#4 | `ee8e0ccd-5dfb-8ccc-9e73-5e04795c15fc` | `9487965c` | `fe892c0d3cd2308f` | 40 |
| lean-receipt.json#5 | `a5b48d0b-4d00-8212-b994-09f9d95f46e1` | `9487965c` | `edb5a96aac3a8c78` | 41 |
| lean-receipt.json#6 | `8829f70b-0dfa-814a-bbbf-37f7bc3efa95` | `9487965c` | `425d6a893d607f57` | 42 |
| lean-receipt.json#7 | `0643fce3-1a6a-81e4-a90a-3534aad35c63` | `9487965c` | `2f4868fd67d971b7` | 43 |
| lean-receipt.json#8 | `f76b44c3-112b-8f6a-a4b6-206b2163fc28` | `9487965c` | `194c11211968e8ad` | 44 |
| lean-receipt.json#9 | `39cdcc77-4059-8ed4-aa9c-75309ae5da07` | `9487965c` | `322269d4345167d7` | 45 |
| lean-receipt.json#10 | `6b0ddf34-66da-83ef-b884-0ad171236c3f` | `9487965c` | `ad9c158e7201d9c3` | 46 |
| lean-receipt.json#11 | `3bdb2850-a9f8-81a3-995a-90a2dd4b9971` | `9487965c` | `9666b9957e03951e` | 47 |
| lean-receipt.json#12 | `f9f40b93-88fe-8df0-835a-53cfef5bc85b` | `9487965c` | `2bf19c5c5f537caf` | 48 |
| lean-receipt.json#13 | `67348c30-f4ce-89ad-9d80-3bbf180b0dfa` | `9487965c` | `cd8425b10abefe2d` | 49 |
| lean-receipt.json#14 | `8d57f575-37f1-8cc8-b667-1cbadf96fe86` | `9487965c` | `9311fca7302cc8ac` | 50 |
| lean-receipt.json#15 | `477aed38-1d74-8cd3-a8b2-352a7dcc05ff` | `9487965c` | `e1e6b7a2bf5c6be1` | 51 |
| lean-receipt.json#16 | `0cb7aa08-3659-83b5-83a0-1c29f12a0aab` | `9487965c` | `f3a95674af922df6` | 52 |
| lean-receipt.json#17 | `db8b5fbd-c556-8de6-b37d-f9150ce9c4a1` | `9487965c` | `2c39da6127059ea9` | 53 |
| lean-receipt.json#18 | `c646636b-a448-8c76-88f7-666387586343` | `9487965c` | `388bd653e0cf976b` | 54 |
| lean-receipt.json#19 | `6c5cd87a-9eb1-8573-a051-2e837dce20b7` | `9487965c` | `dda4ee07b4352e1e` | 55 |
| lean-receipt.json#20 | `79e4a245-fc0e-8c65-8af6-497169001c85` | `9487965c` | `b82e28b0f4e6babd` | 56 |
| lean-receipt.json#21 | `7b430145-a3fa-8e55-b16d-1afc08cfe812` | `9487965c` | `ec904b9f78b235d7` | 57 |
| lean-receipt.json#22 | `5d173f4c-5c6d-8784-a13f-de1d078dbc4f` | `9487965c` | `d554e3d16ee326d1` | 58 |
| lean-receipt.json#23 | `cbb5975b-2932-8dab-a1ad-2b36b486c41a` | `9487965c` | `93ae29cf65f1a99a` | 59 |
| lean-receipt.json#24 | `43375749-9e8e-8468-9820-900aa4e9770f` | `9487965c` | `05a898d13fb78757` | 60 |
| lean-receipt.json#25 | `3fdf6176-abd8-8f79-8870-dc8f071b511d` | `9487965c` | `43fa4cd11065f9c3` | 61 |
| lean-receipt.json#26 | `ff09e79d-d242-88d4-b98b-f45c466514de` | `9487965c` | `518da1d1a24ea5e6` | 62 |
| lean-receipt.json#27 | `2040569e-95b6-8930-9dfe-2bfbdcdde26a` | `9487965c` | `6485e8665106098c` | 63 |
| lean-receipt.json#28 | `f4174dd1-e79a-8028-9b0a-70bbec4f663c` | `9487965c` | `82d30b3adffdb08e` | 64 |
| lean-receipt.json#29 | `e474e079-9487-86e3-82f5-202c5ff09b9a` | `9487965c` | `30a492adb17e8ba4` | 65 |
| lean-receipt.json#30 | `8ebb7a12-589d-8891-af2f-5d69dc07b852` | `9487965c` | `0ab2ce40501d40dc` | 66 |
| lean-receipt.json#31 | `46e12f09-08b2-8657-924d-2f4e63262dc9` | `9487965c` | `f80b43eafcc54ee9` | 67 |
| lean-receipt.json#32 | `514344aa-0947-8793-8c8e-fd7f63e37e0e` | `9487965c` | `9d4ef352a5ee8022` | 68 |
| lean-receipt.json#33 | `e51bc292-d47c-8c8e-87bd-300309fa33f9` | `9487965c` | `dea4299f484bef08` | 69 |
| lean-receipt.json#34 | `33a0ccae-dba5-8a95-8d4b-8ec028f593d8` | `9487965c` | `7d4241191f51a916` | 70 |
| lean-receipt.json#35 | `c4a984d5-1c41-807e-9738-c36f9f0f9ded` | `9487965c` | `5ac06a5de0f115c3` | 71 |
| lean-receipt.json#36 | `3b70dcf0-39d5-8f8e-861c-e059bd3a2026` | `9487965c` | `bb974fe10166a3b1` | 72 |
| lean-receipt.json#37 | `a0bf5003-bf0b-80ca-b6fa-69b6b53a03ca` | `9487965c` | `6e954885a9adee0e` | 73 |
| lean-receipt.json#38 | `0c0a9d7b-e838-8380-9dbc-133872e50f1e` | `9487965c` | `c27f368fbb00b8de` | 74 |
| lean-receipt.json#39 | `8f16af88-da22-88e2-912b-bdab5f51fcb4` | `9487965c` | `4f56bb14aff0205f` | 75 |
| lean-receipt.json#40 | `478c5137-13ac-8508-bc92-1df5d448e723` | `9487965c` | `fcdde40957b52735` | 76 |
| lean-receipt.json#41 | `9ae8b00a-2879-8173-a7eb-833a5b59a432` | `9487965c` | `c702d324a6bcf5bf` | 77 |
| lean-receipt.json#42 | `6907d146-f8b4-8408-939a-e9255d25984d` | `9487965c` | `b1d1e07d5eb8e646` | 78 |
| lean-receipt.json#43 | `3075b0e0-aec8-872d-bce9-fe7bb88b9b64` | `9487965c` | `5e20202c76dcd397` | 79 |
| lean-receipt.json#44 | `2e890359-348d-85cf-9394-93f9c069e60b` | `9487965c` | `a8f314feaa291caa` | 80 |
| lean-receipt.json#45 | `49eab638-4304-815f-a8cf-c4bdbf4ff476` | `9487965c` | `3a1156e016c7477c` | 81 |
| lean-receipt.json#46 | `d42b9ad5-9596-8cdb-8937-aa0c8df690f1` | `9487965c` | `445461ea85bf8c03` | 82 |
| lean-receipt.json#47 | `82f1e313-f2b2-8960-a140-3b763f340102` | `9487965c` | `65a67c467c583347` | 83 |
| lean-receipt.json#48 | `803e00fa-d89a-8534-93b2-73e9f9142ade` | `9487965c` | `deb8091055437d58` | 84 |
| lean-receipt.json#49 | `4037853d-ecd5-8181-8e6b-bedbe505061f` | `9487965c` | `02fbbc7c4f896070` | 85 |
| lean-receipt.json#50 | `d7a12a0d-e8a8-87e0-ba5f-690ca12008a3` | `9487965c` | `c1924f956e4f4fa4` | 86 |
| lean-receipt.json#51 | `06e43573-f59f-8b5f-9565-8270404c3138` | `9487965c` | `8fcc8372c288533b` | 87 |
| lean-receipt.json#52 | `d8a7d80f-744a-88a0-99fa-9b595a8c6dc8` | `9487965c` | `d74760769f2429bc` | 88 |
| lean-receipt.json#53 | `00f96ee0-c19e-8048-8a18-df229e9e2254` | `9487965c` | `01f83d0020cece6f` | 89 |
| lean-receipt.json#54 | `a60e98a1-531d-84ea-962a-f1a37549dd2d` | `9487965c` | `a1e8c5eba0673f9e` | 90 |
| lean-receipt.json#55 | `749d3ac3-058a-853c-bee2-ce7b10a9600d` | `9487965c` | `33dc13660b0f9bdc` | 91 |
| lean-receipt.json#56 | `9a27d330-afcb-868f-978a-a152bf51c63f` | `9487965c` | `b083e80ec22556ba` | 92 |
| lean-receipt.json#57 | `b5ae8ebb-7645-857d-a460-bdf71fbcb8d0` | `9487965c` | `7ca19a8ce205578a` | 93 |
| lean-receipt.json#58 | `94dc0c96-033a-8ed9-b566-a353a97808ae` | `9487965c` | `e5fb4cf4c5d01635` | 94 |
| lean-receipt.json#59 | `42bab506-248b-817c-b59d-d28d8996b3aa` | `9487965c` | `e17b3f566285bdfd` | 95 |
| lean-receipt.json#60 | `27261cd2-3eef-858f-9245-0c486d1bb3da` | `9487965c` | `0872d2fe8c39de5e` | 96 |
| lean-receipt.json#61 | `5f2db113-5064-846f-841a-515ee6e19ebd` | `9487965c` | `a6caf3c2add89e9f` | 97 |
| lean-receipt.json#62 | `1bf561d6-351d-8a8c-a1d2-21f0a1354d0d` | `9487965c` | `e0d78f5d9ff461d2` | 98 |
| lean-receipt.json#63 | `9ede0ca8-f25e-83b0-91d4-c0cfc5b29906` | `9487965c` | `e019b83a318c40a5` | 99 |
| lean-receipt.json#64 | `f1321cf3-bc7c-89af-a121-1dce79eabae5` | `9487965c` | `4cfccebbd6d5896a` | 100 |
| lean-receipt.json#65 | `46a76211-a435-8c46-a1e2-c16dda5b05d5` | `9487965c` | `e10b3b3e53b3371d` | 101 |
| lean-receipt.json#66 | `57e06fb7-c9f4-8118-a8b1-a01f9b989948` | `9487965c` | `384ae07b7cfe45b6` | 102 |
| lean-receipt.json#67 | `64b130a1-2ed5-8f6b-a73c-d1bb13874e89` | `9487965c` | `c0bc4e8611e5e865` | 103 |
| lean-receipt.json#68 | `aac2cb72-e911-810a-9bcf-56ae85dc0b34` | `9487965c` | `38091a9d77be6dc3` | 104 |
| lean-receipt.json#69 | `6e91b165-1ef7-878a-a7ed-6eb881d97439` | `9487965c` | `8efc43f088bf3a60` | 105 |
| lean-receipt.json#70 | `431d4681-45d5-897f-9587-b2139f244313` | `9487965c` | `6a5608f310fefaaf` | 106 |
| lean-receipt.json#71 | `cd5c4960-2702-8e78-bccd-c571cc67500f` | `9487965c` | `ffe2230ddcc64a7a` | 107 |
| lean-receipt.json#72 | `0a9ce8ec-095d-8ecd-a556-c939d1961d17` | `9487965c` | `d01acb546814188a` | 108 |
| lean-receipt.json#73 | `9654c13d-3f75-89a2-bfbf-59e355d84b6f` | `9487965c` | `426728d1ffdba3b5` | 109 |
| lean-receipt.json#74 | `c7e9f9eb-60bb-8361-a2cb-df5fab270c4c` | `9487965c` | `2689245fdde6727a` | 110 |
| lean-receipt.json#75 | `66e43c2e-2646-85ab-b333-050a3d65877f` | `9487965c` | `2c937ad64ea4c298` | 111 |
| lean-receipt.json#76 | `966ecafe-2557-8ed2-97b2-72e2f8b3b2e1` | `9487965c` | `641b234de7978812` | 112 |
| lean-receipt.json#77 | `48f41417-39da-838b-96ef-618d5a7eb21a` | `9487965c` | `aea3357928d2eabd` | 113 |
| lean-receipt.json#78 | `e581aa5a-4673-8134-bcc1-1350afb46499` | `9487965c` | `ea05bfbcc6c6db43` | 114 |
| lean-receipt.json#79 | `93d48da5-f176-8b54-8c64-1d555c79a0c1` | `9487965c` | `031acf293f6c1713` | 115 |
| lean-receipt.json#80 | `c26b9bea-f3b0-829e-a980-d9b101b50926` | `9487965c` | `386e56d4b6a022bd` | 116 |
| lean-receipt.json#81 | `f593d707-cda9-893a-95e7-475b51f7cdbb` | `9487965c` | `bd46e5ac1f2e8ce9` | 117 |
| lean-receipt.json#82 | `d49419b1-84ab-8136-b36e-bf546860f22f` | `9487965c` | `60a7799285b8915d` | 118 |
| lean-receipt.json#83 | `2b58f9d4-8f6b-8743-abc7-e8e92a65d7a5` | `9487965c` | `d99dd0496d2a08b7` | 119 |
| lean-receipt.json#84 | `35dec0ea-c401-873e-a0bf-95972ff21955` | `9487965c` | `12dc95cf8d8d6648` | 120 |
| lean-receipt.json#85 | `b8382df6-86e4-89eb-880e-edc338f019f1` | `9487965c` | `154368d275a3a113` | 121 |
| lean-receipt.json#86 | `4d290377-91c3-8275-bd58-941364650516` | `9487965c` | `bc9320ac7b3d92ea` | 122 |
| lean-receipt.json#87 | `f4f68d06-9b72-8bdf-8a84-fdb1bb7b30da` | `9487965c` | `845089b3e2f11776` | 123 |
| lean-receipt.json#88 | `b3f150d0-cc7e-85d2-8fdc-e6737b660f27` | `9487965c` | `fa6fd6f7a7d0138a` | 124 |
| lean-receipt.json#89 | `cb0f6f52-eda3-8e99-924a-63947677331d` | `9487965c` | `55a030fbb49b0bbd` | 125 |
| lean-receipt.json#90 | `e8582e46-c502-8fad-8f92-8c69f8c3e364` | `9487965c` | `5286a583cc4c90bf` | 126 |
| lean-receipt.json#91 | `3efa9eda-5658-8444-abd7-bfdac1c4d3de` | `9487965c` | `2ce6e23a1b7b9976` | 127 |
| lean-receipt.json#92 | `d9423b7f-1319-8303-9507-f796f5553532` | `9487965c` | `2ad187247c42038f` | 128 |
| lean-receipt.json#93 | `1c206a94-3b0b-89a1-ba6d-29e65e594429` | `9487965c` | `1db40b72341088d5` | 129 |
| lean-receipt.json#94 | `14ea3bd3-f10f-8218-92fb-de3649341082` | `9487965c` | `79407be9cc9ab8ef` | 130 |
| lean-receipt.json#95 | `08b67df4-4526-8cee-ac65-ef131d0f357b` | `9487965c` | `dd464982bbdde7d0` | 131 |
| lean-receipt.json#96 | `d6ebc4ed-594e-852c-8b0c-b4a8c77b7342` | `9487965c` | `6e924ff5fa233598` | 132 |
| lean-receipt.json#97 | `7ec376e0-f688-8e55-ae5f-9a193e6de812` | `9487965c` | `3fd54a13d189cdc1` | 133 |
| lean-receipt.json#98 | `edc83ad3-a802-82f7-8ba5-5c6febb39777` | `9487965c` | `62c0dfbce5ae4472` | 134 |
| percall-receipt.json | `c569d877-2f6e-886a-a54a-cdef85bc2dca` | `494ca9cc` | `227e095d17f22621` | 135 |
| refusals-receipt.json | `e5ba69ad-baf1-81fc-a995-5d11d192fdc0` | `494ca9cc` | `e0e972028d35f5b2` | 136 |
| test-receipt.json | `ab750852-7b60-8ab9-9add-1fcfff49a3d6` | `494ca9cc` | `5fc637f79dfc94eb` | 137 |
| test-receipt.json#0 | `f414ab46-05f5-8915-91cf-ec2f3dae65e4` | `ab750852` | `8f31e84778031660` | 138 |
| test-receipt.json#1 | `12cc31f6-c798-86ed-a000-2fa4e4448d58` | `ab750852` | `da3eb97348e29c82` | 139 |
| test-receipt.json#2 | `e6fc018f-a85b-8ea2-ade9-baa744a88415` | `ab750852` | `6523d3075b964345` | 140 |
| test-receipt.json#3 | `e515594f-d672-8bdd-bbcf-589d6afa2458` | `ab750852` | `34a901af3f06268a` | 141 |
| test-receipt.json#4 | `256e2e83-05a6-859d-b32d-e60f9f046217` | `ab750852` | `e83367f743ae290e` | 142 |
| test-receipt.json#5 | `24b2cc2c-c1d4-864f-ac46-fd7ef4ba0f44` | `ab750852` | `05903ab5ea276b01` | 143 |
| test-receipt.json#6 | `1d1472a4-b4e4-8249-921e-49e593a9b5a4` | `ab750852` | `6dbdd2e465db81e1` | 144 |
| test-receipt.json#7 | `77636ab1-53e9-8433-a000-f1fdc67e5709` | `ab750852` | `862a01d23f60c3e6` | 145 |
| test-receipt.json#8 | `63022a29-79a8-832d-a5bd-d20fd130c8d1` | `ab750852` | `dd8db09b8187d2b5` | 146 |
| test-receipt.json#9 | `d4471b20-0b8b-89e3-933d-75ee6eadbb0e` | `ab750852` | `b8f486e7e88aae90` | 147 |
| test-receipt.json#10 | `60b6a578-7d41-8774-b8e8-6321b35993c2` | `ab750852` | `99bb4c4605f26d4a` | 148 |
| walls-receipt.json | `53eeba88-7ffb-847d-9880-92d31e51f205` | `494ca9cc` | `2a4c3de10ff7f9be` | 149 |
| readme | `35c4be51-a2d3-88ba-ab12-5e94950b722d` | `494ca9cc` | `7e538dab312be6ac` | 150 |

Regenerate with `npm run readme` after `npm run build` and the receipt-producing runs; `node scripts/generate-readme.mjs --check`
compares. Documentation: [docs/README.md](docs/README.md). License: CC-BY-NC-ND-4.0.
