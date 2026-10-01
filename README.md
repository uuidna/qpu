# UUIDNA QPU

**Final build receipt** `f496c00a-2290-8ec2-8825-54a239d92bb9`

| | |
|---|---|
| version | 1.0.0 |
| commit | `3ad70000ac7fe18cd14eae5e0b2c1f87519b9148` |
| receipts | 10 files, 153 nodes |
| build stream | length 153, head `f496c00a-2290-8ec2-8825-54a239d92bb9`, chain `d5dcc167c4d85889`, holds **true** |

Each node is a quantum receipt: its UUID is the RFC 9562 v8 content address of its payload fold and its referrer, and
its referrer is the node above it. Change any receipt's bytes and its node, its file's node, the build stream chain
and this final receipt move; the root moves with the commit.

```mermaid
flowchart TD
  n3d2c65df["root<br/><code>3d2c65df</code>"]
  nac343804["cross-receipt.json<br/><code>ac343804</code>"]
  nf1c34a52["cross-receipt.json#0<br/><code>f1c34a52</code>"]
  n3496c8d1["cross-receipt.json#1<br/><code>3496c8d1</code>"]
  nb1a450b9["cross-receipt.json#2<br/><code>b1a450b9</code>"]
  n802bb95f["cross-receipt.json#3<br/><code>802bb95f</code>"]
  n4fbc881f["cross-receipt.json#4<br/><code>4fbc881f</code>"]
  n07ff3acb["cross-receipt.json#5<br/><code>07ff3acb</code>"]
  n949740f7["cross-receipt.json#6<br/><code>949740f7</code>"]
  n8bad90a8["cross-receipt.json#7<br/><code>8bad90a8</code>"]
  n5464b35b["cross-receipt.json#8<br/><code>5464b35b</code>"]
  n5b042ad5["cross-receipt.json#9<br/><code>5b042ad5</code>"]
  n64e558a3["cross-receipt.json#10<br/><code>64e558a3</code>"]
  n1476c1ff["cross-receipt.json#11<br/><code>1476c1ff</code>"]
  nb4adb425["cross-receipt.json#12<br/><code>b4adb425</code>"]
  nb678059c["cross-receipt.json#13<br/><code>b678059c</code>"]
  n0901ed62["cross-receipt.json#14<br/><code>0901ed62</code>"]
  n3e50b7bb["cross-receipt.json#15<br/><code>3e50b7bb</code>"]
  nc80c4d42["cross-receipt.json#16<br/><code>c80c4d42</code>"]
  n3d655df8["cross-receipt.json#17<br/><code>3d655df8</code>"]
  n2e4e476d["cross-receipt.json#18<br/><code>2e4e476d</code>"]
  nc4cb13f0["cross-receipt.json#19<br/><code>c4cb13f0</code>"]
  n26b2256b["cross-receipt.json#20<br/><code>26b2256b</code>"]
  na2816d28["cross-receipt.json#21<br/><code>a2816d28</code>"]
  n9e6e5783["cross-receipt.json#22<br/><code>9e6e5783</code>"]
  n1256e1ea["cross-receipt.json#23<br/><code>1256e1ea</code>"]
  nb1657433["cross-receipt.json#24<br/><code>b1657433</code>"]
  n97dcf212["cross-receipt.json#25<br/><code>97dcf212</code>"]
  n04e49c78["cross-receipt.json#26<br/><code>04e49c78</code>"]
  n1289d97b["cross-receipt.json#27<br/><code>1289d97b</code>"]
  n274af3ab["cross-receipt.json#28<br/><code>274af3ab</code>"]
  n72bced0a["cross-receipt.json#29<br/><code>72bced0a</code>"]
  n0b658762["debts-receipt.json<br/><code>0b658762</code>"]
  na182d74c["flaws-receipt.json<br/><code>a182d74c</code>"]
  n1e713435["fuse-receipt.json<br/><code>1e713435</code>"]
  nfb1359e8["lattice-receipt.json<br/><code>fb1359e8</code>"]
  nc5d19db5["lean-receipt.json<br/><code>c5d19db5</code>"]
  nfe6d0b5b["lean-receipt.json#0<br/><code>fe6d0b5b</code>"]
  n7466e314["lean-receipt.json#1<br/><code>7466e314</code>"]
  ned662c2c["lean-receipt.json#2<br/><code>ed662c2c</code>"]
  naec5c138["lean-receipt.json#3<br/><code>aec5c138</code>"]
  nb1a76c1c["lean-receipt.json#4<br/><code>b1a76c1c</code>"]
  n604242ec["lean-receipt.json#5<br/><code>604242ec</code>"]
  n68b49374["lean-receipt.json#6<br/><code>68b49374</code>"]
  ncdf301b1["lean-receipt.json#7<br/><code>cdf301b1</code>"]
  ne440c834["lean-receipt.json#8<br/><code>e440c834</code>"]
  nb46c0727["lean-receipt.json#9<br/><code>b46c0727</code>"]
  n01615e3b["lean-receipt.json#10<br/><code>01615e3b</code>"]
  n8f64b2aa["lean-receipt.json#11<br/><code>8f64b2aa</code>"]
  n2a4339ac["lean-receipt.json#12<br/><code>2a4339ac</code>"]
  n3d2a92b7["lean-receipt.json#13<br/><code>3d2a92b7</code>"]
  ndfa00651["lean-receipt.json#14<br/><code>dfa00651</code>"]
  nccd7faf6["lean-receipt.json#15<br/><code>ccd7faf6</code>"]
  n535964ad["lean-receipt.json#16<br/><code>535964ad</code>"]
  n64de2a1d["lean-receipt.json#17<br/><code>64de2a1d</code>"]
  n64ff450c["lean-receipt.json#18<br/><code>64ff450c</code>"]
  na85466de["lean-receipt.json#19<br/><code>a85466de</code>"]
  n62784157["lean-receipt.json#20<br/><code>62784157</code>"]
  n5eb24923["lean-receipt.json#21<br/><code>5eb24923</code>"]
  ndfdb95ea["lean-receipt.json#22<br/><code>dfdb95ea</code>"]
  n92dfbe06["lean-receipt.json#23<br/><code>92dfbe06</code>"]
  nc060efe3["lean-receipt.json#24<br/><code>c060efe3</code>"]
  n673f13b6["lean-receipt.json#25<br/><code>673f13b6</code>"]
  n32b6ff5b["lean-receipt.json#26<br/><code>32b6ff5b</code>"]
  na0d3a7ff["lean-receipt.json#27<br/><code>a0d3a7ff</code>"]
  n73f6da84["lean-receipt.json#28<br/><code>73f6da84</code>"]
  nab9f0724["lean-receipt.json#29<br/><code>ab9f0724</code>"]
  n9883f863["lean-receipt.json#30<br/><code>9883f863</code>"]
  n42121699["lean-receipt.json#31<br/><code>42121699</code>"]
  n1def6d7c["lean-receipt.json#32<br/><code>1def6d7c</code>"]
  nf0743fb6["lean-receipt.json#33<br/><code>f0743fb6</code>"]
  ne7de1a69["lean-receipt.json#34<br/><code>e7de1a69</code>"]
  n78353002["lean-receipt.json#35<br/><code>78353002</code>"]
  nb30a468a["lean-receipt.json#36<br/><code>b30a468a</code>"]
  n20bf78cc["lean-receipt.json#37<br/><code>20bf78cc</code>"]
  n9d8db2b2["lean-receipt.json#38<br/><code>9d8db2b2</code>"]
  n50e5995e["lean-receipt.json#39<br/><code>50e5995e</code>"]
  n21b2db3f["lean-receipt.json#40<br/><code>21b2db3f</code>"]
  n1401485c["lean-receipt.json#41<br/><code>1401485c</code>"]
  n2b323a16["lean-receipt.json#42<br/><code>2b323a16</code>"]
  n15adbb73["lean-receipt.json#43<br/><code>15adbb73</code>"]
  n093829b4["lean-receipt.json#44<br/><code>093829b4</code>"]
  ne9e4d8e5["lean-receipt.json#45<br/><code>e9e4d8e5</code>"]
  n4a3c210d["lean-receipt.json#46<br/><code>4a3c210d</code>"]
  nd4693c95["lean-receipt.json#47<br/><code>d4693c95</code>"]
  n68cfd970["lean-receipt.json#48<br/><code>68cfd970</code>"]
  n0ce69ea8["lean-receipt.json#49<br/><code>0ce69ea8</code>"]
  nd6630520["lean-receipt.json#50<br/><code>d6630520</code>"]
  n1938e7f0["lean-receipt.json#51<br/><code>1938e7f0</code>"]
  n9900775c["lean-receipt.json#52<br/><code>9900775c</code>"]
  n4d782a01["lean-receipt.json#53<br/><code>4d782a01</code>"]
  nf29a51e1["lean-receipt.json#54<br/><code>f29a51e1</code>"]
  n926cf643["lean-receipt.json#55<br/><code>926cf643</code>"]
  n2e987bce["lean-receipt.json#56<br/><code>2e987bce</code>"]
  ncb844c19["lean-receipt.json#57<br/><code>cb844c19</code>"]
  ne06c1a97["lean-receipt.json#58<br/><code>e06c1a97</code>"]
  n92e0fd68["lean-receipt.json#59<br/><code>92e0fd68</code>"]
  n45b997da["lean-receipt.json#60<br/><code>45b997da</code>"]
  n9187e21a["lean-receipt.json#61<br/><code>9187e21a</code>"]
  na9583430["lean-receipt.json#62<br/><code>a9583430</code>"]
  n77f842d2["lean-receipt.json#63<br/><code>77f842d2</code>"]
  nd7c441f0["lean-receipt.json#64<br/><code>d7c441f0</code>"]
  nbcbce5ee["lean-receipt.json#65<br/><code>bcbce5ee</code>"]
  n121d062e["lean-receipt.json#66<br/><code>121d062e</code>"]
  nc39d4f59["lean-receipt.json#67<br/><code>c39d4f59</code>"]
  n0510469a["lean-receipt.json#68<br/><code>0510469a</code>"]
  n2b8e662c["lean-receipt.json#69<br/><code>2b8e662c</code>"]
  nf89bdb34["lean-receipt.json#70<br/><code>f89bdb34</code>"]
  ne1c5c7e0["lean-receipt.json#71<br/><code>e1c5c7e0</code>"]
  nd3cf0f80["lean-receipt.json#72<br/><code>d3cf0f80</code>"]
  nb6a491a9["lean-receipt.json#73<br/><code>b6a491a9</code>"]
  n757279d9["lean-receipt.json#74<br/><code>757279d9</code>"]
  n685af442["lean-receipt.json#75<br/><code>685af442</code>"]
  n9313b7de["lean-receipt.json#76<br/><code>9313b7de</code>"]
  n7cdfcab2["lean-receipt.json#77<br/><code>7cdfcab2</code>"]
  n1b329e30["lean-receipt.json#78<br/><code>1b329e30</code>"]
  n9ad5f2a1["lean-receipt.json#79<br/><code>9ad5f2a1</code>"]
  nacf02f50["lean-receipt.json#80<br/><code>acf02f50</code>"]
  nf80684f9["lean-receipt.json#81<br/><code>f80684f9</code>"]
  n7437ff11["lean-receipt.json#82<br/><code>7437ff11</code>"]
  n567dae6d["lean-receipt.json#83<br/><code>567dae6d</code>"]
  nbc172a51["lean-receipt.json#84<br/><code>bc172a51</code>"]
  nf48cbd3c["lean-receipt.json#85<br/><code>f48cbd3c</code>"]
  n40f2a1e2["lean-receipt.json#86<br/><code>40f2a1e2</code>"]
  n6a3365d3["lean-receipt.json#87<br/><code>6a3365d3</code>"]
  n8b036705["lean-receipt.json#88<br/><code>8b036705</code>"]
  n54ca77a1["lean-receipt.json#89<br/><code>54ca77a1</code>"]
  nd8f5857b["lean-receipt.json#90<br/><code>d8f5857b</code>"]
  ned5af556["lean-receipt.json#91<br/><code>ed5af556</code>"]
  nbd4818f2["lean-receipt.json#92<br/><code>bd4818f2</code>"]
  n7b17afd4["lean-receipt.json#93<br/><code>7b17afd4</code>"]
  n8a71dd8d["lean-receipt.json#94<br/><code>8a71dd8d</code>"]
  nba09b6e7["lean-receipt.json#95<br/><code>ba09b6e7</code>"]
  n72047ac3["lean-receipt.json#96<br/><code>72047ac3</code>"]
  n9ca43378["lean-receipt.json#97<br/><code>9ca43378</code>"]
  n8298598a["lean-receipt.json#98<br/><code>8298598a</code>"]
  n1137623e["lean-receipt.json#99<br/><code>1137623e</code>"]
  nbcce5f43["percall-receipt.json<br/><code>bcce5f43</code>"]
  n05a26b73["refusals-receipt.json<br/><code>05a26b73</code>"]
  n773aeb30["test-receipt.json<br/><code>773aeb30</code>"]
  n30352b49["test-receipt.json#0<br/><code>30352b49</code>"]
  n8b85cc0f["test-receipt.json#1<br/><code>8b85cc0f</code>"]
  n7d1bf222["test-receipt.json#2<br/><code>7d1bf222</code>"]
  n5dcef369["test-receipt.json#3<br/><code>5dcef369</code>"]
  n4cd45140["test-receipt.json#4<br/><code>4cd45140</code>"]
  nb3ce1cf5["test-receipt.json#5<br/><code>b3ce1cf5</code>"]
  n3921ca06["test-receipt.json#6<br/><code>3921ca06</code>"]
  n2023e45b["test-receipt.json#7<br/><code>2023e45b</code>"]
  n9dca7801["test-receipt.json#8<br/><code>9dca7801</code>"]
  n5b02912f["test-receipt.json#9<br/><code>5b02912f</code>"]
  ned583c0b["test-receipt.json#10<br/><code>ed583c0b</code>"]
  n8e5d663d["walls-receipt.json<br/><code>8e5d663d</code>"]
  nf496c00a["readme<br/><code>f496c00a</code>"]
  n3d2c65df --> nac343804
  nac343804 --> nf1c34a52
  nac343804 --> n3496c8d1
  nac343804 --> nb1a450b9
  nac343804 --> n802bb95f
  nac343804 --> n4fbc881f
  nac343804 --> n07ff3acb
  nac343804 --> n949740f7
  nac343804 --> n8bad90a8
  nac343804 --> n5464b35b
  nac343804 --> n5b042ad5
  nac343804 --> n64e558a3
  nac343804 --> n1476c1ff
  nac343804 --> nb4adb425
  nac343804 --> nb678059c
  nac343804 --> n0901ed62
  nac343804 --> n3e50b7bb
  nac343804 --> nc80c4d42
  nac343804 --> n3d655df8
  nac343804 --> n2e4e476d
  nac343804 --> nc4cb13f0
  nac343804 --> n26b2256b
  nac343804 --> na2816d28
  nac343804 --> n9e6e5783
  nac343804 --> n1256e1ea
  nac343804 --> nb1657433
  nac343804 --> n97dcf212
  nac343804 --> n04e49c78
  nac343804 --> n1289d97b
  nac343804 --> n274af3ab
  nac343804 --> n72bced0a
  n3d2c65df --> n0b658762
  n3d2c65df --> na182d74c
  n3d2c65df --> n1e713435
  n3d2c65df --> nfb1359e8
  n3d2c65df --> nc5d19db5
  nc5d19db5 --> nfe6d0b5b
  nc5d19db5 --> n7466e314
  nc5d19db5 --> ned662c2c
  nc5d19db5 --> naec5c138
  nc5d19db5 --> nb1a76c1c
  nc5d19db5 --> n604242ec
  nc5d19db5 --> n68b49374
  nc5d19db5 --> ncdf301b1
  nc5d19db5 --> ne440c834
  nc5d19db5 --> nb46c0727
  nc5d19db5 --> n01615e3b
  nc5d19db5 --> n8f64b2aa
  nc5d19db5 --> n2a4339ac
  nc5d19db5 --> n3d2a92b7
  nc5d19db5 --> ndfa00651
  nc5d19db5 --> nccd7faf6
  nc5d19db5 --> n535964ad
  nc5d19db5 --> n64de2a1d
  nc5d19db5 --> n64ff450c
  nc5d19db5 --> na85466de
  nc5d19db5 --> n62784157
  nc5d19db5 --> n5eb24923
  nc5d19db5 --> ndfdb95ea
  nc5d19db5 --> n92dfbe06
  nc5d19db5 --> nc060efe3
  nc5d19db5 --> n673f13b6
  nc5d19db5 --> n32b6ff5b
  nc5d19db5 --> na0d3a7ff
  nc5d19db5 --> n73f6da84
  nc5d19db5 --> nab9f0724
  nc5d19db5 --> n9883f863
  nc5d19db5 --> n42121699
  nc5d19db5 --> n1def6d7c
  nc5d19db5 --> nf0743fb6
  nc5d19db5 --> ne7de1a69
  nc5d19db5 --> n78353002
  nc5d19db5 --> nb30a468a
  nc5d19db5 --> n20bf78cc
  nc5d19db5 --> n9d8db2b2
  nc5d19db5 --> n50e5995e
  nc5d19db5 --> n21b2db3f
  nc5d19db5 --> n1401485c
  nc5d19db5 --> n2b323a16
  nc5d19db5 --> n15adbb73
  nc5d19db5 --> n093829b4
  nc5d19db5 --> ne9e4d8e5
  nc5d19db5 --> n4a3c210d
  nc5d19db5 --> nd4693c95
  nc5d19db5 --> n68cfd970
  nc5d19db5 --> n0ce69ea8
  nc5d19db5 --> nd6630520
  nc5d19db5 --> n1938e7f0
  nc5d19db5 --> n9900775c
  nc5d19db5 --> n4d782a01
  nc5d19db5 --> nf29a51e1
  nc5d19db5 --> n926cf643
  nc5d19db5 --> n2e987bce
  nc5d19db5 --> ncb844c19
  nc5d19db5 --> ne06c1a97
  nc5d19db5 --> n92e0fd68
  nc5d19db5 --> n45b997da
  nc5d19db5 --> n9187e21a
  nc5d19db5 --> na9583430
  nc5d19db5 --> n77f842d2
  nc5d19db5 --> nd7c441f0
  nc5d19db5 --> nbcbce5ee
  nc5d19db5 --> n121d062e
  nc5d19db5 --> nc39d4f59
  nc5d19db5 --> n0510469a
  nc5d19db5 --> n2b8e662c
  nc5d19db5 --> nf89bdb34
  nc5d19db5 --> ne1c5c7e0
  nc5d19db5 --> nd3cf0f80
  nc5d19db5 --> nb6a491a9
  nc5d19db5 --> n757279d9
  nc5d19db5 --> n685af442
  nc5d19db5 --> n9313b7de
  nc5d19db5 --> n7cdfcab2
  nc5d19db5 --> n1b329e30
  nc5d19db5 --> n9ad5f2a1
  nc5d19db5 --> nacf02f50
  nc5d19db5 --> nf80684f9
  nc5d19db5 --> n7437ff11
  nc5d19db5 --> n567dae6d
  nc5d19db5 --> nbc172a51
  nc5d19db5 --> nf48cbd3c
  nc5d19db5 --> n40f2a1e2
  nc5d19db5 --> n6a3365d3
  nc5d19db5 --> n8b036705
  nc5d19db5 --> n54ca77a1
  nc5d19db5 --> nd8f5857b
  nc5d19db5 --> ned5af556
  nc5d19db5 --> nbd4818f2
  nc5d19db5 --> n7b17afd4
  nc5d19db5 --> n8a71dd8d
  nc5d19db5 --> nba09b6e7
  nc5d19db5 --> n72047ac3
  nc5d19db5 --> n9ca43378
  nc5d19db5 --> n8298598a
  nc5d19db5 --> n1137623e
  n3d2c65df --> nbcce5f43
  n3d2c65df --> n05a26b73
  n3d2c65df --> n773aeb30
  n773aeb30 --> n30352b49
  n773aeb30 --> n8b85cc0f
  n773aeb30 --> n7d1bf222
  n773aeb30 --> n5dcef369
  n773aeb30 --> n4cd45140
  n773aeb30 --> nb3ce1cf5
  n773aeb30 --> n3921ca06
  n773aeb30 --> n2023e45b
  n773aeb30 --> n9dca7801
  n773aeb30 --> n5b02912f
  n773aeb30 --> ned583c0b
  n3d2c65df --> n8e5d663d
  n3d2c65df --> nf496c00a
```

| node | receipt uuid | referrer | payload fold | seq |
|---|---|---|---|---|
| root | `3d2c65df-5466-8f6a-a9d1-d3f4b7941a03` | `3ad70000` | `5c4c97fda20fe04b` | 0 |
| cross-receipt.json | `ac343804-1671-8565-b13f-ba8d75cbcd7a` | `3d2c65df` | `74f12a23d5e80f05` | 1 |
| cross-receipt.json#0 | `f1c34a52-2877-8fc1-a9d2-50ec53c7432e` | `ac343804` | `14432830058e1e46` | 2 |
| cross-receipt.json#1 | `3496c8d1-1e49-85e9-8a5c-74669920bd98` | `ac343804` | `09410219d171472e` | 3 |
| cross-receipt.json#2 | `b1a450b9-68e5-8745-a155-09db90e4d1e9` | `ac343804` | `e2cac0a5a1701ff8` | 4 |
| cross-receipt.json#3 | `802bb95f-68f4-83d7-828e-8df116df45c9` | `ac343804` | `72b0abb676747470` | 5 |
| cross-receipt.json#4 | `4fbc881f-26eb-898d-9ee0-c1e73baf4a96` | `ac343804` | `c1a885b32ef960e5` | 6 |
| cross-receipt.json#5 | `07ff3acb-86df-8540-81cf-f557b317ce35` | `ac343804` | `6b591900e22f2ba8` | 7 |
| cross-receipt.json#6 | `949740f7-07ab-8af7-ab27-8f5d2e3ef2ec` | `ac343804` | `ad1fcc55bdfb7a52` | 8 |
| cross-receipt.json#7 | `8bad90a8-1b78-80d1-9af0-65e190ff2dba` | `ac343804` | `c27faa42150e6e98` | 9 |
| cross-receipt.json#8 | `5464b35b-42d6-80c9-9f3f-615682723cd6` | `ac343804` | `294f0992ef5aa44f` | 10 |
| cross-receipt.json#9 | `5b042ad5-7c72-8f19-872f-4c9a87666345` | `ac343804` | `c02f3dc29a4b8ace` | 11 |
| cross-receipt.json#10 | `64e558a3-71db-8ec9-9c61-832cdd0aa2a9` | `ac343804` | `764468a81718149c` | 12 |
| cross-receipt.json#11 | `1476c1ff-0b99-8901-9120-6862e6b3a524` | `ac343804` | `870f3b1867cf8006` | 13 |
| cross-receipt.json#12 | `b4adb425-d8f4-8cf3-b4be-a46b465824cb` | `ac343804` | `e3aa4daad4f109db` | 14 |
| cross-receipt.json#13 | `b678059c-e9a7-8a08-ae20-288f152c5c81` | `ac343804` | `0ef75e8dc811861b` | 15 |
| cross-receipt.json#14 | `0901ed62-8f84-8a3c-9584-ba874fef8c75` | `ac343804` | `87276d09343fa13b` | 16 |
| cross-receipt.json#15 | `3e50b7bb-a1ad-851c-9d27-9ca979119daa` | `ac343804` | `0df990216d41b6e8` | 17 |
| cross-receipt.json#16 | `c80c4d42-58cf-878c-83c9-7d234a47fe19` | `ac343804` | `d148afcd4838e3b8` | 18 |
| cross-receipt.json#17 | `3d655df8-4ad2-8221-a335-e9b1ffb40656` | `ac343804` | `fc9ca0ae74cb7a8e` | 19 |
| cross-receipt.json#18 | `2e4e476d-3231-8f8f-91c1-9b08d7b074f7` | `ac343804` | `58579b18fc23f7ca` | 20 |
| cross-receipt.json#19 | `c4cb13f0-21b0-860f-bd71-a08930aea776` | `ac343804` | `571b3a1c9d1084ae` | 21 |
| cross-receipt.json#20 | `26b2256b-cc5e-8ff0-bd27-687cf7e5ee6a` | `ac343804` | `f892be6f720eced1` | 22 |
| cross-receipt.json#21 | `a2816d28-620b-8030-a7f1-aa79fbfc4b01` | `ac343804` | `33be92ef70a7f2c7` | 23 |
| cross-receipt.json#22 | `9e6e5783-b44d-8d94-ac45-8785b7d2b6c6` | `ac343804` | `146e0cc7e9ce75ec` | 24 |
| cross-receipt.json#23 | `1256e1ea-8079-8fe2-b404-1fef173e843b` | `ac343804` | `969872c0b9114f29` | 25 |
| cross-receipt.json#24 | `b1657433-3f83-82e8-97d5-a5a93b4c964d` | `ac343804` | `83589d423d2f6c5d` | 26 |
| cross-receipt.json#25 | `97dcf212-3e11-8aca-9857-55a2ebac5661` | `ac343804` | `c0f5574332b76de0` | 27 |
| cross-receipt.json#26 | `04e49c78-465b-8ed5-b284-d9b75ba0e1e4` | `ac343804` | `55ac55b92bd4690e` | 28 |
| cross-receipt.json#27 | `1289d97b-77c3-8591-a3ee-97ba21e06b90` | `ac343804` | `180465219da3fd47` | 29 |
| cross-receipt.json#28 | `274af3ab-6f2f-8388-af97-683ed7232f82` | `ac343804` | `2fd485b1bf1c80a6` | 30 |
| cross-receipt.json#29 | `72bced0a-74f5-806d-99c5-abff33726558` | `ac343804` | `44460d3c758a0a12` | 31 |
| debts-receipt.json | `0b658762-4930-8083-871a-1919949e3409` | `3d2c65df` | `de5129853bb193de` | 32 |
| flaws-receipt.json | `a182d74c-7894-8c19-9d3d-42d59485ac6b` | `3d2c65df` | `ff955046d9f87003` | 33 |
| fuse-receipt.json | `1e713435-3a60-8ce6-953f-c9a679fdb674` | `3d2c65df` | `35bc56efc158f869` | 34 |
| lattice-receipt.json | `fb1359e8-d128-8c26-b5d5-3276b0bdc179` | `3d2c65df` | `36da43b99a7f4375` | 35 |
| lean-receipt.json | `c5d19db5-7286-8cbd-afbc-26bd1e078cd0` | `3d2c65df` | `7cf59af706f2fc77` | 36 |
| lean-receipt.json#0 | `fe6d0b5b-ff42-8fc5-8a09-0d506ae819e9` | `c5d19db5` | `5e94eaa2291848e0` | 37 |
| lean-receipt.json#1 | `7466e314-abd4-8a8c-b14a-c3014139d841` | `c5d19db5` | `486f749e6e5cc2d6` | 38 |
| lean-receipt.json#2 | `ed662c2c-893a-863f-9c18-238e12a27be5` | `c5d19db5` | `3ed2794945659ea1` | 39 |
| lean-receipt.json#3 | `aec5c138-1d41-8e50-be88-ce31f501b0c8` | `c5d19db5` | `3214d3c4765494b1` | 40 |
| lean-receipt.json#4 | `b1a76c1c-6d89-81cc-a193-4423eace6d42` | `c5d19db5` | `fe892c0d3cd2308f` | 41 |
| lean-receipt.json#5 | `604242ec-761e-8233-9345-4cc2a6cf8cb7` | `c5d19db5` | `edb5a96aac3a8c78` | 42 |
| lean-receipt.json#6 | `68b49374-c42e-8da0-8275-7366093284a3` | `c5d19db5` | `425d6a893d607f57` | 43 |
| lean-receipt.json#7 | `cdf301b1-7057-87b1-800d-fc204735f591` | `c5d19db5` | `2f4868fd67d971b7` | 44 |
| lean-receipt.json#8 | `e440c834-6856-8ba2-baec-1db1a57a92e6` | `c5d19db5` | `194c11211968e8ad` | 45 |
| lean-receipt.json#9 | `b46c0727-9f4f-8f2a-af61-11f9fb68612d` | `c5d19db5` | `322269d4345167d7` | 46 |
| lean-receipt.json#10 | `01615e3b-8012-83c1-914b-130c2bfcf9c5` | `c5d19db5` | `ad9c158e7201d9c3` | 47 |
| lean-receipt.json#11 | `8f64b2aa-42b3-8d96-b7a7-58c12ba4aee7` | `c5d19db5` | `9666b9957e03951e` | 48 |
| lean-receipt.json#12 | `2a4339ac-fe4d-8399-a98d-25df40d2c7a9` | `c5d19db5` | `2bf19c5c5f537caf` | 49 |
| lean-receipt.json#13 | `3d2a92b7-ef65-8b53-a7b9-54d0ce6a4d70` | `c5d19db5` | `cd8425b10abefe2d` | 50 |
| lean-receipt.json#14 | `dfa00651-2259-8721-9a41-4f202238f724` | `c5d19db5` | `9311fca7302cc8ac` | 51 |
| lean-receipt.json#15 | `ccd7faf6-3d49-88ad-b94a-8c60df90dd05` | `c5d19db5` | `e1e6b7a2bf5c6be1` | 52 |
| lean-receipt.json#16 | `535964ad-4245-813c-895c-52b826598119` | `c5d19db5` | `f3a95674af922df6` | 53 |
| lean-receipt.json#17 | `64de2a1d-8144-81ff-8515-4da433e523f7` | `c5d19db5` | `2c39da6127059ea9` | 54 |
| lean-receipt.json#18 | `64ff450c-1ff3-83ab-b80f-db2075d8d5f1` | `c5d19db5` | `388bd653e0cf976b` | 55 |
| lean-receipt.json#19 | `a85466de-62d7-876b-a172-ca6c05394afd` | `c5d19db5` | `dda4ee07b4352e1e` | 56 |
| lean-receipt.json#20 | `62784157-2188-80e9-8510-f6677a430b73` | `c5d19db5` | `b82e28b0f4e6babd` | 57 |
| lean-receipt.json#21 | `5eb24923-2924-81a4-b74d-77e528d44988` | `c5d19db5` | `ec904b9f78b235d7` | 58 |
| lean-receipt.json#22 | `dfdb95ea-5ab1-885c-864f-3e6305b9de75` | `c5d19db5` | `d554e3d16ee326d1` | 59 |
| lean-receipt.json#23 | `92dfbe06-051d-8ce1-907c-4e60b6827890` | `c5d19db5` | `93ae29cf65f1a99a` | 60 |
| lean-receipt.json#24 | `c060efe3-5c0e-85d8-8153-ce9bfd69ebb5` | `c5d19db5` | `05a898d13fb78757` | 61 |
| lean-receipt.json#25 | `673f13b6-8b4f-8b0b-8a32-eae7107d5a4b` | `c5d19db5` | `43fa4cd11065f9c3` | 62 |
| lean-receipt.json#26 | `32b6ff5b-9e8f-8e42-8275-39387933019c` | `c5d19db5` | `518da1d1a24ea5e6` | 63 |
| lean-receipt.json#27 | `a0d3a7ff-ce5f-8408-8420-edeefe91ee00` | `c5d19db5` | `6485e8665106098c` | 64 |
| lean-receipt.json#28 | `73f6da84-8376-8940-b339-ba262f4b8f02` | `c5d19db5` | `82d30b3adffdb08e` | 65 |
| lean-receipt.json#29 | `ab9f0724-7072-8619-b1c4-435661ec5010` | `c5d19db5` | `30a492adb17e8ba4` | 66 |
| lean-receipt.json#30 | `9883f863-06a4-82f8-b350-88c294034748` | `c5d19db5` | `0ab2ce40501d40dc` | 67 |
| lean-receipt.json#31 | `42121699-2bc4-87ed-99ce-3b40dc90465f` | `c5d19db5` | `f80b43eafcc54ee9` | 68 |
| lean-receipt.json#32 | `1def6d7c-d4fd-8f63-bcec-ac53e0c0872c` | `c5d19db5` | `9d4ef352a5ee8022` | 69 |
| lean-receipt.json#33 | `f0743fb6-d4f9-8102-be3a-0d996361916f` | `c5d19db5` | `dea4299f484bef08` | 70 |
| lean-receipt.json#34 | `e7de1a69-bc92-8133-9b38-1f4f48c5de36` | `c5d19db5` | `7d4241191f51a916` | 71 |
| lean-receipt.json#35 | `78353002-21f8-85ca-be43-448d3ff88ebb` | `c5d19db5` | `5ac06a5de0f115c3` | 72 |
| lean-receipt.json#36 | `b30a468a-b30d-86cf-856b-58144e9cd744` | `c5d19db5` | `bb974fe10166a3b1` | 73 |
| lean-receipt.json#37 | `20bf78cc-0fa7-8a52-afc5-29af2cbc5160` | `c5d19db5` | `6e954885a9adee0e` | 74 |
| lean-receipt.json#38 | `9d8db2b2-7470-8406-8cbb-c9b06a9da25c` | `c5d19db5` | `c27f368fbb00b8de` | 75 |
| lean-receipt.json#39 | `50e5995e-f898-8246-8f18-9e963bf21843` | `c5d19db5` | `bb7d32116e14d51a` | 76 |
| lean-receipt.json#40 | `21b2db3f-aea1-8772-87c6-f2287552d927` | `c5d19db5` | `8f556063bbd23223` | 77 |
| lean-receipt.json#41 | `1401485c-a9b4-8679-beb1-be3190b642d2` | `c5d19db5` | `a0c650cfb1930384` | 78 |
| lean-receipt.json#42 | `2b323a16-73a4-869a-81a0-7888f785bb1c` | `c5d19db5` | `a92bba2749029a4c` | 79 |
| lean-receipt.json#43 | `15adbb73-52db-8c87-98cb-8a8a2b07c531` | `c5d19db5` | `079d6d4b530ff885` | 80 |
| lean-receipt.json#44 | `093829b4-26a6-8a43-a709-1315eb8c0932` | `c5d19db5` | `f2ccb74b705c4f24` | 81 |
| lean-receipt.json#45 | `e9e4d8e5-1786-8b3f-a72c-c674932ebf38` | `c5d19db5` | `8a1138f404e72703` | 82 |
| lean-receipt.json#46 | `4a3c210d-c37d-8fc7-ab2d-9063c77c083d` | `c5d19db5` | `4f7031bec2a755c5` | 83 |
| lean-receipt.json#47 | `d4693c95-6234-8108-b8cb-ceebb94ece54` | `c5d19db5` | `f2f9bf4b2439fa24` | 84 |
| lean-receipt.json#48 | `68cfd970-9a5b-8e00-9766-acd61deb8001` | `c5d19db5` | `42f1cc508bbc5c1e` | 85 |
| lean-receipt.json#49 | `0ce69ea8-5cdd-8e73-8559-190cdd1a30b7` | `c5d19db5` | `250ecb837147de61` | 86 |
| lean-receipt.json#50 | `d6630520-8bb2-8667-a859-98760c47b1ec` | `c5d19db5` | `bcf551b2875b2dea` | 87 |
| lean-receipt.json#51 | `1938e7f0-4eb6-8104-a790-de388da5a4c2` | `c5d19db5` | `7c6dd01f9c9415fb` | 88 |
| lean-receipt.json#52 | `9900775c-a6cb-84f4-8625-0e6688ff247c` | `c5d19db5` | `08ba5b967b1a5274` | 89 |
| lean-receipt.json#53 | `4d782a01-6685-8769-8043-9f9b6bdc99d2` | `c5d19db5` | `193b3dfa08806b7b` | 90 |
| lean-receipt.json#54 | `f29a51e1-d15d-8abd-b6c8-3e234272a9dd` | `c5d19db5` | `ec6f62ba602a90b6` | 91 |
| lean-receipt.json#55 | `926cf643-97c4-8267-ab40-f03705f8fd93` | `c5d19db5` | `b372ad6040c5b9cf` | 92 |
| lean-receipt.json#56 | `2e987bce-ae53-897d-bb98-db43e068f8d0` | `c5d19db5` | `2ccbc878069485a3` | 93 |
| lean-receipt.json#57 | `cb844c19-33cc-8ba2-80d4-03f5fe12603b` | `c5d19db5` | `edf2ea6648ed6821` | 94 |
| lean-receipt.json#58 | `e06c1a97-bde2-87ce-8ce7-0e42215b693e` | `c5d19db5` | `a52192c0f9eef2a7` | 95 |
| lean-receipt.json#59 | `92e0fd68-a7d1-89b8-b401-aeccede4c154` | `c5d19db5` | `0c757ec00e79f212` | 96 |
| lean-receipt.json#60 | `45b997da-29ea-8880-b448-4eaae961d980` | `c5d19db5` | `313d30b4a7fb34d1` | 97 |
| lean-receipt.json#61 | `9187e21a-1cff-86c1-a517-ff2f7e009e91` | `c5d19db5` | `4653370b1b356b77` | 98 |
| lean-receipt.json#62 | `a9583430-fbab-8b93-be7e-7c93c40e3ecb` | `c5d19db5` | `630951ef59e13e66` | 99 |
| lean-receipt.json#63 | `77f842d2-2a43-8fe6-8d90-6022eacbc8fb` | `c5d19db5` | `43f0afd5503520ed` | 100 |
| lean-receipt.json#64 | `d7c441f0-914a-83cf-977d-c1a0297d746c` | `c5d19db5` | `c03fd303542afaa4` | 101 |
| lean-receipt.json#65 | `bcbce5ee-dc11-8bc4-bf89-3cb2c70241c6` | `c5d19db5` | `ecec7c1157936ddb` | 102 |
| lean-receipt.json#66 | `121d062e-0a0c-8008-a2c0-94724da910c7` | `c5d19db5` | `2ff018b404208db8` | 103 |
| lean-receipt.json#67 | `c39d4f59-1b58-8dd1-b4be-06509fb9e31f` | `c5d19db5` | `162637e21244a609` | 104 |
| lean-receipt.json#68 | `0510469a-583e-8a78-92b7-ffb43037ff48` | `c5d19db5` | `2b0ae195561c9702` | 105 |
| lean-receipt.json#69 | `2b8e662c-8aef-8cca-9e23-ebbcd344f295` | `c5d19db5` | `de3c6a92d5442d2a` | 106 |
| lean-receipt.json#70 | `f89bdb34-26fc-86b9-91ec-2811f90f383a` | `c5d19db5` | `c3ab172f41e4453a` | 107 |
| lean-receipt.json#71 | `e1c5c7e0-774f-87f9-9d2f-53f909af991d` | `c5d19db5` | `e7fbc371f821c410` | 108 |
| lean-receipt.json#72 | `d3cf0f80-5462-8146-aabe-ded1727124be` | `c5d19db5` | `dcb23db43852033b` | 109 |
| lean-receipt.json#73 | `b6a491a9-939b-88d7-9a2a-85a60c95b28b` | `c5d19db5` | `5ef95fe4fd251be7` | 110 |
| lean-receipt.json#74 | `757279d9-846a-8df8-bd18-ba67f1607748` | `c5d19db5` | `10f22f66c39d193c` | 111 |
| lean-receipt.json#75 | `685af442-36f8-8718-a395-72e28eb439c7` | `c5d19db5` | `7abd5c7fc1fbd9d7` | 112 |
| lean-receipt.json#76 | `9313b7de-70d1-81d1-862e-303e24200a24` | `c5d19db5` | `c65da4a2b96e1735` | 113 |
| lean-receipt.json#77 | `7cdfcab2-5702-8807-bb56-5d9341f6bd31` | `c5d19db5` | `c1cf212796fe22a5` | 114 |
| lean-receipt.json#78 | `1b329e30-1cfd-8492-8f2f-4f649dad2ee1` | `c5d19db5` | `6fe3337831190956` | 115 |
| lean-receipt.json#79 | `9ad5f2a1-4516-8937-af04-d5705d9e088b` | `c5d19db5` | `3da77e052908f1fe` | 116 |
| lean-receipt.json#80 | `acf02f50-3536-82d8-a205-d875f52dbc82` | `c5d19db5` | `1ea8871eba4ed8df` | 117 |
| lean-receipt.json#81 | `f80684f9-4053-844f-a09f-d29574159172` | `c5d19db5` | `7df37dac6752eb7e` | 118 |
| lean-receipt.json#82 | `7437ff11-8453-8251-9c9b-f0d9e249642e` | `c5d19db5` | `39ebbe4b66b48244` | 119 |
| lean-receipt.json#83 | `567dae6d-1af0-86c9-9e35-82479c30bf6b` | `c5d19db5` | `ab01598adb66a22e` | 120 |
| lean-receipt.json#84 | `bc172a51-49bc-8fd8-8b7c-9f8b2ada360f` | `c5d19db5` | `c459367eeaf2040e` | 121 |
| lean-receipt.json#85 | `f48cbd3c-72aa-86c7-aaa5-5032f0c036f6` | `c5d19db5` | `f641c82553389a79` | 122 |
| lean-receipt.json#86 | `40f2a1e2-ccda-8496-8627-10b9282492a2` | `c5d19db5` | `d73e54f4a519e84e` | 123 |
| lean-receipt.json#87 | `6a3365d3-6879-8a40-be60-80eb98539e35` | `c5d19db5` | `9b07c490cfc7f0bd` | 124 |
| lean-receipt.json#88 | `8b036705-411b-8ce7-afcc-f0a3820bca3d` | `c5d19db5` | `2606d1ac0a77b8d7` | 125 |
| lean-receipt.json#89 | `54ca77a1-a38f-8ad1-8203-42fdaff3ac2e` | `c5d19db5` | `812c53beba4c55b3` | 126 |
| lean-receipt.json#90 | `d8f5857b-c4d7-8e22-b73a-ebbfcb2c7ae6` | `c5d19db5` | `6ca94c75bde2d403` | 127 |
| lean-receipt.json#91 | `ed5af556-6eaa-81f0-92e1-8b18c8f05d06` | `c5d19db5` | `71f6fc16aba4a5ac` | 128 |
| lean-receipt.json#92 | `bd4818f2-fb47-8880-ac84-619c3ca26f6a` | `c5d19db5` | `ff6d40b180d68e8b` | 129 |
| lean-receipt.json#93 | `7b17afd4-47b8-8729-a616-ba4828ecda57` | `c5d19db5` | `52de4de3f9f809ba` | 130 |
| lean-receipt.json#94 | `8a71dd8d-21c7-8c79-971e-5baf5d86026b` | `c5d19db5` | `745159aff798bd8c` | 131 |
| lean-receipt.json#95 | `ba09b6e7-94c0-838f-9d32-cdd33ae81c13` | `c5d19db5` | `4ee00e016d0e618e` | 132 |
| lean-receipt.json#96 | `72047ac3-6037-8525-b09c-5ec84d6a63b3` | `c5d19db5` | `d2b4b69e536fbd47` | 133 |
| lean-receipt.json#97 | `9ca43378-b4d0-8e91-9cac-58f0a499169d` | `c5d19db5` | `99664321ddf7dc89` | 134 |
| lean-receipt.json#98 | `8298598a-5bd8-887a-83e9-453dbaf64528` | `c5d19db5` | `ae9b4914206ed34e` | 135 |
| lean-receipt.json#99 | `1137623e-a107-8076-9793-fba2cfbdece7` | `c5d19db5` | `2a412f090ebe42bb` | 136 |
| percall-receipt.json | `bcce5f43-1a74-8f72-941b-f284475f48fe` | `3d2c65df` | `227e095d17f22621` | 137 |
| refusals-receipt.json | `05a26b73-0ddd-80d4-91fe-3e1dd74bdf40` | `3d2c65df` | `e0e972028d35f5b2` | 138 |
| test-receipt.json | `773aeb30-7875-85cc-8ed3-8fb552e8ad42` | `3d2c65df` | `5fc637f79dfc94eb` | 139 |
| test-receipt.json#0 | `30352b49-47c9-802d-93b2-d4f3c90bab64` | `773aeb30` | `8f31e84778031660` | 140 |
| test-receipt.json#1 | `8b85cc0f-fe3a-8f33-afe2-b20a67d91b70` | `773aeb30` | `da3eb97348e29c82` | 141 |
| test-receipt.json#2 | `7d1bf222-a6a8-8651-89e5-9c61b4447729` | `773aeb30` | `6523d3075b964345` | 142 |
| test-receipt.json#3 | `5dcef369-0d15-8423-8bb1-db02ee8eb270` | `773aeb30` | `34a901af3f06268a` | 143 |
| test-receipt.json#4 | `4cd45140-5da3-8976-a65c-132ad970b343` | `773aeb30` | `e83367f743ae290e` | 144 |
| test-receipt.json#5 | `b3ce1cf5-ba0a-89d7-887c-5091d8ffa3c4` | `773aeb30` | `05903ab5ea276b01` | 145 |
| test-receipt.json#6 | `3921ca06-3f2d-8ca9-bdbf-f9959a73aba4` | `773aeb30` | `6dbdd2e465db81e1` | 146 |
| test-receipt.json#7 | `2023e45b-97a5-8236-b039-caf8a0a12cd5` | `773aeb30` | `862a01d23f60c3e6` | 147 |
| test-receipt.json#8 | `9dca7801-5d9c-8173-b22d-1ddb87a4077d` | `773aeb30` | `dd8db09b8187d2b5` | 148 |
| test-receipt.json#9 | `5b02912f-f446-808b-9cbc-8690310e718e` | `773aeb30` | `b8f486e7e88aae90` | 149 |
| test-receipt.json#10 | `ed583c0b-548a-864d-b63f-b734d11707fa` | `773aeb30` | `99bb4c4605f26d4a` | 150 |
| walls-receipt.json | `8e5d663d-c32e-8377-b606-e0da6e3c7c31` | `3d2c65df` | `2a4c3de10ff7f9be` | 151 |
| readme | `f496c00a-2290-8ec2-8825-54a239d92bb9` | `3d2c65df` | `280cca14dde0224e` | 152 |

Regenerate with `npm run readme` after `npm run build` and the receipt-producing runs; `node scripts/generate-readme.mjs --check`
compares. Documentation: [docs/README.md](docs/README.md). License: CC-BY-NC-ND-4.0.
