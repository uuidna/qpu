# UUIDNA QPU

**Final build receipt** `b5406961-cdc1-866e-aaf8-e5025cf9833e`

| | |
|---|---|
| version | 1.0.0 |
| commit | `50ad7fcf324ef5706524ddc08a820b759d133404` (working tree differed from this commit) |
| receipts | 11 files, 154 nodes |
| build stream | length 154, head `b5406961-cdc1-866e-aaf8-e5025cf9833e`, chain `14c599534835388d`, holds **true** |

Each node is a quantum receipt: its UUID is the RFC 9562 v8 content address of its payload fold and its referrer, and
its referrer is the node above it. Change any receipt's bytes and its node, its file's node, the build stream chain
and this final receipt move; the root moves with the commit.

```mermaid
flowchart TD
  nc218f6d0["root<br/><code>c218f6d0</code>"]
  nfd29064a["cross-receipt.json<br/><code>fd29064a</code>"]
  nce529e24["cross-receipt.json#0<br/><code>ce529e24</code>"]
  n390ca40f["cross-receipt.json#1<br/><code>390ca40f</code>"]
  n4d16a77c["cross-receipt.json#2<br/><code>4d16a77c</code>"]
  n2a584c58["cross-receipt.json#3<br/><code>2a584c58</code>"]
  nc780761e["cross-receipt.json#4<br/><code>c780761e</code>"]
  ncf596326["cross-receipt.json#5<br/><code>cf596326</code>"]
  n19943362["cross-receipt.json#6<br/><code>19943362</code>"]
  n66f42399["cross-receipt.json#7<br/><code>66f42399</code>"]
  naa80bc0f["cross-receipt.json#8<br/><code>aa80bc0f</code>"]
  n87525663["cross-receipt.json#9<br/><code>87525663</code>"]
  n8e9153fa["cross-receipt.json#10<br/><code>8e9153fa</code>"]
  n8cfdfd0d["cross-receipt.json#11<br/><code>8cfdfd0d</code>"]
  n321253d9["cross-receipt.json#12<br/><code>321253d9</code>"]
  n8c0dae7b["cross-receipt.json#13<br/><code>8c0dae7b</code>"]
  nd21790f5["cross-receipt.json#14<br/><code>d21790f5</code>"]
  n2af3af5e["cross-receipt.json#15<br/><code>2af3af5e</code>"]
  n1de6bd22["cross-receipt.json#16<br/><code>1de6bd22</code>"]
  n938166ac["cross-receipt.json#17<br/><code>938166ac</code>"]
  n8912b531["cross-receipt.json#18<br/><code>8912b531</code>"]
  n8d161970["cross-receipt.json#19<br/><code>8d161970</code>"]
  na7fb8d88["cross-receipt.json#20<br/><code>a7fb8d88</code>"]
  n78171606["cross-receipt.json#21<br/><code>78171606</code>"]
  nd999a0fa["cross-receipt.json#22<br/><code>d999a0fa</code>"]
  n2cccbefe["cross-receipt.json#23<br/><code>2cccbefe</code>"]
  n0739bfa8["cross-receipt.json#24<br/><code>0739bfa8</code>"]
  nf280b536["cross-receipt.json#25<br/><code>f280b536</code>"]
  n461a4cce["cross-receipt.json#26<br/><code>461a4cce</code>"]
  n74689ca4["cross-receipt.json#27<br/><code>74689ca4</code>"]
  n50e0f9dd["cross-receipt.json#28<br/><code>50e0f9dd</code>"]
  na0f444d1["cross-receipt.json#29<br/><code>a0f444d1</code>"]
  nbb465ee8["debts-receipt.json<br/><code>bb465ee8</code>"]
  nb001e702["flaws-receipt.json<br/><code>b001e702</code>"]
  n4266a4dd["fuse-receipt.json<br/><code>4266a4dd</code>"]
  nc98be8b5["lattice-receipt.json<br/><code>c98be8b5</code>"]
  nd6dc93e2["lean-receipt.json<br/><code>d6dc93e2</code>"]
  n92916743["lean-receipt.json#0<br/><code>92916743</code>"]
  n167396f2["lean-receipt.json#1<br/><code>167396f2</code>"]
  ndf447684["lean-receipt.json#2<br/><code>df447684</code>"]
  n05b09833["lean-receipt.json#3<br/><code>05b09833</code>"]
  nfb13dd25["lean-receipt.json#4<br/><code>fb13dd25</code>"]
  nf4fe39f0["lean-receipt.json#5<br/><code>f4fe39f0</code>"]
  n969dd57a["lean-receipt.json#6<br/><code>969dd57a</code>"]
  n88fe0eca["lean-receipt.json#7<br/><code>88fe0eca</code>"]
  n2ae4425a["lean-receipt.json#8<br/><code>2ae4425a</code>"]
  n6f494606["lean-receipt.json#9<br/><code>6f494606</code>"]
  n7d8c5475["lean-receipt.json#10<br/><code>7d8c5475</code>"]
  n618500e1["lean-receipt.json#11<br/><code>618500e1</code>"]
  nfec054a3["lean-receipt.json#12<br/><code>fec054a3</code>"]
  n68cd92d6["lean-receipt.json#13<br/><code>68cd92d6</code>"]
  nc45ddb32["lean-receipt.json#14<br/><code>c45ddb32</code>"]
  n2a0bbb8f["lean-receipt.json#15<br/><code>2a0bbb8f</code>"]
  na7513877["lean-receipt.json#16<br/><code>a7513877</code>"]
  n3588ecac["lean-receipt.json#17<br/><code>3588ecac</code>"]
  n4eb3742c["lean-receipt.json#18<br/><code>4eb3742c</code>"]
  nb58933a3["lean-receipt.json#19<br/><code>b58933a3</code>"]
  n42addf86["lean-receipt.json#20<br/><code>42addf86</code>"]
  nf204ab28["lean-receipt.json#21<br/><code>f204ab28</code>"]
  n25fee6a2["lean-receipt.json#22<br/><code>25fee6a2</code>"]
  n17dbf853["lean-receipt.json#23<br/><code>17dbf853</code>"]
  n3eebceae["lean-receipt.json#24<br/><code>3eebceae</code>"]
  n33206315["lean-receipt.json#25<br/><code>33206315</code>"]
  n2b51e866["lean-receipt.json#26<br/><code>2b51e866</code>"]
  nfdafe8b6["lean-receipt.json#27<br/><code>fdafe8b6</code>"]
  nb9a73022["lean-receipt.json#28<br/><code>b9a73022</code>"]
  n2e9b76dc["lean-receipt.json#29<br/><code>2e9b76dc</code>"]
  nae1f67e3["lean-receipt.json#30<br/><code>ae1f67e3</code>"]
  n7ac2ffde["lean-receipt.json#31<br/><code>7ac2ffde</code>"]
  n833aee18["lean-receipt.json#32<br/><code>833aee18</code>"]
  nf4a78447["lean-receipt.json#33<br/><code>f4a78447</code>"]
  n8824f769["lean-receipt.json#34<br/><code>8824f769</code>"]
  ncbde1a2c["lean-receipt.json#35<br/><code>cbde1a2c</code>"]
  n0a6f9f7f["lean-receipt.json#36<br/><code>0a6f9f7f</code>"]
  neeb68cdd["lean-receipt.json#37<br/><code>eeb68cdd</code>"]
  nf3076175["lean-receipt.json#38<br/><code>f3076175</code>"]
  nf1166a59["lean-receipt.json#39<br/><code>f1166a59</code>"]
  naf1a2dba["lean-receipt.json#40<br/><code>af1a2dba</code>"]
  n1c76ce25["lean-receipt.json#41<br/><code>1c76ce25</code>"]
  nc6dfccf7["lean-receipt.json#42<br/><code>c6dfccf7</code>"]
  n4deb6c0d["lean-receipt.json#43<br/><code>4deb6c0d</code>"]
  n0541e9c7["lean-receipt.json#44<br/><code>0541e9c7</code>"]
  nde83d7bc["lean-receipt.json#45<br/><code>de83d7bc</code>"]
  ncb4cbfd7["lean-receipt.json#46<br/><code>cb4cbfd7</code>"]
  n9edb3f89["lean-receipt.json#47<br/><code>9edb3f89</code>"]
  nbf26cbe8["lean-receipt.json#48<br/><code>bf26cbe8</code>"]
  ncb06067d["lean-receipt.json#49<br/><code>cb06067d</code>"]
  n3ce21700["lean-receipt.json#50<br/><code>3ce21700</code>"]
  n484d422e["lean-receipt.json#51<br/><code>484d422e</code>"]
  ncb22a561["lean-receipt.json#52<br/><code>cb22a561</code>"]
  nc007b434["lean-receipt.json#53<br/><code>c007b434</code>"]
  n7f36acc0["lean-receipt.json#54<br/><code>7f36acc0</code>"]
  n340405a3["lean-receipt.json#55<br/><code>340405a3</code>"]
  nf7920112["lean-receipt.json#56<br/><code>f7920112</code>"]
  nafbe9d2b["lean-receipt.json#57<br/><code>afbe9d2b</code>"]
  n287cb899["lean-receipt.json#58<br/><code>287cb899</code>"]
  neb143364["lean-receipt.json#59<br/><code>eb143364</code>"]
  nfef3d5b2["lean-receipt.json#60<br/><code>fef3d5b2</code>"]
  n4d824f17["lean-receipt.json#61<br/><code>4d824f17</code>"]
  nf4fd6163["lean-receipt.json#62<br/><code>f4fd6163</code>"]
  n826cb385["lean-receipt.json#63<br/><code>826cb385</code>"]
  n3d1d7cbc["lean-receipt.json#64<br/><code>3d1d7cbc</code>"]
  n47fa6bf9["lean-receipt.json#65<br/><code>47fa6bf9</code>"]
  na17b1756["lean-receipt.json#66<br/><code>a17b1756</code>"]
  n1e013824["lean-receipt.json#67<br/><code>1e013824</code>"]
  nec83a056["lean-receipt.json#68<br/><code>ec83a056</code>"]
  n3c748eb1["lean-receipt.json#69<br/><code>3c748eb1</code>"]
  nc54dea35["lean-receipt.json#70<br/><code>c54dea35</code>"]
  n47673f7d["lean-receipt.json#71<br/><code>47673f7d</code>"]
  n1e0e8d15["lean-receipt.json#72<br/><code>1e0e8d15</code>"]
  n22669f65["lean-receipt.json#73<br/><code>22669f65</code>"]
  n87346ce1["lean-receipt.json#74<br/><code>87346ce1</code>"]
  n60d26adf["lean-receipt.json#75<br/><code>60d26adf</code>"]
  n953e6566["lean-receipt.json#76<br/><code>953e6566</code>"]
  ncc8cf9bb["lean-receipt.json#77<br/><code>cc8cf9bb</code>"]
  n255812dc["lean-receipt.json#78<br/><code>255812dc</code>"]
  n3afaf099["lean-receipt.json#79<br/><code>3afaf099</code>"]
  n89a193a9["lean-receipt.json#80<br/><code>89a193a9</code>"]
  n736aa640["lean-receipt.json#81<br/><code>736aa640</code>"]
  n9bb6348f["lean-receipt.json#82<br/><code>9bb6348f</code>"]
  n898cacb8["lean-receipt.json#83<br/><code>898cacb8</code>"]
  nf6d4dbd4["lean-receipt.json#84<br/><code>f6d4dbd4</code>"]
  n5821cd4c["lean-receipt.json#85<br/><code>5821cd4c</code>"]
  nba622ed4["lean-receipt.json#86<br/><code>ba622ed4</code>"]
  n24d835aa["lean-receipt.json#87<br/><code>24d835aa</code>"]
  nd91cebab["lean-receipt.json#88<br/><code>d91cebab</code>"]
  na99c6cd5["lean-receipt.json#89<br/><code>a99c6cd5</code>"]
  nc8cdfbfd["lean-receipt.json#90<br/><code>c8cdfbfd</code>"]
  ncb43836a["lean-receipt.json#91<br/><code>cb43836a</code>"]
  n71bbb405["lean-receipt.json#92<br/><code>71bbb405</code>"]
  n4600697d["lean-receipt.json#93<br/><code>4600697d</code>"]
  nb75e8239["lean-receipt.json#94<br/><code>b75e8239</code>"]
  n4fcc8c75["lean-receipt.json#95<br/><code>4fcc8c75</code>"]
  n5b3c70cc["lean-receipt.json#96<br/><code>5b3c70cc</code>"]
  n8344bedf["lean-receipt.json#97<br/><code>8344bedf</code>"]
  n4314f664["lean-receipt.json#98<br/><code>4314f664</code>"]
  n1557d2a4["lean-receipt.json#99<br/><code>1557d2a4</code>"]
  n73e3fb19["payload-cf-receipt.json<br/><code>73e3fb19</code>"]
  n3e97eb2f["percall-receipt.json<br/><code>3e97eb2f</code>"]
  n40f2c6e1["refusals-receipt.json<br/><code>40f2c6e1</code>"]
  n8530f74c["test-receipt.json<br/><code>8530f74c</code>"]
  n3d8de2d7["test-receipt.json#0<br/><code>3d8de2d7</code>"]
  n0954c1ff["test-receipt.json#1<br/><code>0954c1ff</code>"]
  nf82810a9["test-receipt.json#2<br/><code>f82810a9</code>"]
  ndb9de958["test-receipt.json#3<br/><code>db9de958</code>"]
  n2110fbb5["test-receipt.json#4<br/><code>2110fbb5</code>"]
  nbda6ef6a["test-receipt.json#5<br/><code>bda6ef6a</code>"]
  n460b2890["test-receipt.json#6<br/><code>460b2890</code>"]
  nb504c72e["test-receipt.json#7<br/><code>b504c72e</code>"]
  n7b0758de["test-receipt.json#8<br/><code>7b0758de</code>"]
  nd02f5e7b["test-receipt.json#9<br/><code>d02f5e7b</code>"]
  n8c0ff0d7["test-receipt.json#10<br/><code>8c0ff0d7</code>"]
  nd0f4297f["walls-receipt.json<br/><code>d0f4297f</code>"]
  nb5406961["readme<br/><code>b5406961</code>"]
  nc218f6d0 --> nfd29064a
  nfd29064a --> nce529e24
  nfd29064a --> n390ca40f
  nfd29064a --> n4d16a77c
  nfd29064a --> n2a584c58
  nfd29064a --> nc780761e
  nfd29064a --> ncf596326
  nfd29064a --> n19943362
  nfd29064a --> n66f42399
  nfd29064a --> naa80bc0f
  nfd29064a --> n87525663
  nfd29064a --> n8e9153fa
  nfd29064a --> n8cfdfd0d
  nfd29064a --> n321253d9
  nfd29064a --> n8c0dae7b
  nfd29064a --> nd21790f5
  nfd29064a --> n2af3af5e
  nfd29064a --> n1de6bd22
  nfd29064a --> n938166ac
  nfd29064a --> n8912b531
  nfd29064a --> n8d161970
  nfd29064a --> na7fb8d88
  nfd29064a --> n78171606
  nfd29064a --> nd999a0fa
  nfd29064a --> n2cccbefe
  nfd29064a --> n0739bfa8
  nfd29064a --> nf280b536
  nfd29064a --> n461a4cce
  nfd29064a --> n74689ca4
  nfd29064a --> n50e0f9dd
  nfd29064a --> na0f444d1
  nc218f6d0 --> nbb465ee8
  nc218f6d0 --> nb001e702
  nc218f6d0 --> n4266a4dd
  nc218f6d0 --> nc98be8b5
  nc218f6d0 --> nd6dc93e2
  nd6dc93e2 --> n92916743
  nd6dc93e2 --> n167396f2
  nd6dc93e2 --> ndf447684
  nd6dc93e2 --> n05b09833
  nd6dc93e2 --> nfb13dd25
  nd6dc93e2 --> nf4fe39f0
  nd6dc93e2 --> n969dd57a
  nd6dc93e2 --> n88fe0eca
  nd6dc93e2 --> n2ae4425a
  nd6dc93e2 --> n6f494606
  nd6dc93e2 --> n7d8c5475
  nd6dc93e2 --> n618500e1
  nd6dc93e2 --> nfec054a3
  nd6dc93e2 --> n68cd92d6
  nd6dc93e2 --> nc45ddb32
  nd6dc93e2 --> n2a0bbb8f
  nd6dc93e2 --> na7513877
  nd6dc93e2 --> n3588ecac
  nd6dc93e2 --> n4eb3742c
  nd6dc93e2 --> nb58933a3
  nd6dc93e2 --> n42addf86
  nd6dc93e2 --> nf204ab28
  nd6dc93e2 --> n25fee6a2
  nd6dc93e2 --> n17dbf853
  nd6dc93e2 --> n3eebceae
  nd6dc93e2 --> n33206315
  nd6dc93e2 --> n2b51e866
  nd6dc93e2 --> nfdafe8b6
  nd6dc93e2 --> nb9a73022
  nd6dc93e2 --> n2e9b76dc
  nd6dc93e2 --> nae1f67e3
  nd6dc93e2 --> n7ac2ffde
  nd6dc93e2 --> n833aee18
  nd6dc93e2 --> nf4a78447
  nd6dc93e2 --> n8824f769
  nd6dc93e2 --> ncbde1a2c
  nd6dc93e2 --> n0a6f9f7f
  nd6dc93e2 --> neeb68cdd
  nd6dc93e2 --> nf3076175
  nd6dc93e2 --> nf1166a59
  nd6dc93e2 --> naf1a2dba
  nd6dc93e2 --> n1c76ce25
  nd6dc93e2 --> nc6dfccf7
  nd6dc93e2 --> n4deb6c0d
  nd6dc93e2 --> n0541e9c7
  nd6dc93e2 --> nde83d7bc
  nd6dc93e2 --> ncb4cbfd7
  nd6dc93e2 --> n9edb3f89
  nd6dc93e2 --> nbf26cbe8
  nd6dc93e2 --> ncb06067d
  nd6dc93e2 --> n3ce21700
  nd6dc93e2 --> n484d422e
  nd6dc93e2 --> ncb22a561
  nd6dc93e2 --> nc007b434
  nd6dc93e2 --> n7f36acc0
  nd6dc93e2 --> n340405a3
  nd6dc93e2 --> nf7920112
  nd6dc93e2 --> nafbe9d2b
  nd6dc93e2 --> n287cb899
  nd6dc93e2 --> neb143364
  nd6dc93e2 --> nfef3d5b2
  nd6dc93e2 --> n4d824f17
  nd6dc93e2 --> nf4fd6163
  nd6dc93e2 --> n826cb385
  nd6dc93e2 --> n3d1d7cbc
  nd6dc93e2 --> n47fa6bf9
  nd6dc93e2 --> na17b1756
  nd6dc93e2 --> n1e013824
  nd6dc93e2 --> nec83a056
  nd6dc93e2 --> n3c748eb1
  nd6dc93e2 --> nc54dea35
  nd6dc93e2 --> n47673f7d
  nd6dc93e2 --> n1e0e8d15
  nd6dc93e2 --> n22669f65
  nd6dc93e2 --> n87346ce1
  nd6dc93e2 --> n60d26adf
  nd6dc93e2 --> n953e6566
  nd6dc93e2 --> ncc8cf9bb
  nd6dc93e2 --> n255812dc
  nd6dc93e2 --> n3afaf099
  nd6dc93e2 --> n89a193a9
  nd6dc93e2 --> n736aa640
  nd6dc93e2 --> n9bb6348f
  nd6dc93e2 --> n898cacb8
  nd6dc93e2 --> nf6d4dbd4
  nd6dc93e2 --> n5821cd4c
  nd6dc93e2 --> nba622ed4
  nd6dc93e2 --> n24d835aa
  nd6dc93e2 --> nd91cebab
  nd6dc93e2 --> na99c6cd5
  nd6dc93e2 --> nc8cdfbfd
  nd6dc93e2 --> ncb43836a
  nd6dc93e2 --> n71bbb405
  nd6dc93e2 --> n4600697d
  nd6dc93e2 --> nb75e8239
  nd6dc93e2 --> n4fcc8c75
  nd6dc93e2 --> n5b3c70cc
  nd6dc93e2 --> n8344bedf
  nd6dc93e2 --> n4314f664
  nd6dc93e2 --> n1557d2a4
  nc218f6d0 --> n73e3fb19
  nc218f6d0 --> n3e97eb2f
  nc218f6d0 --> n40f2c6e1
  nc218f6d0 --> n8530f74c
  n8530f74c --> n3d8de2d7
  n8530f74c --> n0954c1ff
  n8530f74c --> nf82810a9
  n8530f74c --> ndb9de958
  n8530f74c --> n2110fbb5
  n8530f74c --> nbda6ef6a
  n8530f74c --> n460b2890
  n8530f74c --> nb504c72e
  n8530f74c --> n7b0758de
  n8530f74c --> nd02f5e7b
  n8530f74c --> n8c0ff0d7
  nc218f6d0 --> nd0f4297f
  nc218f6d0 --> nb5406961
```

| node | receipt uuid | referrer | payload fold | seq |
|---|---|---|---|---|
| root | `c218f6d0-a683-84ff-a6b8-16007517b2da` | `50ad7fcf` | `2865b87269c29171` | 0 |
| cross-receipt.json | `fd29064a-ae72-8df4-b135-f474031afac1` | `c218f6d0` | `74f12a23d5e80f05` | 1 |
| cross-receipt.json#0 | `ce529e24-30bd-819a-95ad-6444e2e0aeef` | `fd29064a` | `14432830058e1e46` | 2 |
| cross-receipt.json#1 | `390ca40f-69b3-8736-8979-21778d852a79` | `fd29064a` | `09410219d171472e` | 3 |
| cross-receipt.json#2 | `4d16a77c-846c-8036-8beb-c34e57a16020` | `fd29064a` | `e2cac0a5a1701ff8` | 4 |
| cross-receipt.json#3 | `2a584c58-1c69-8f20-9d93-db593dbc7380` | `fd29064a` | `72b0abb676747470` | 5 |
| cross-receipt.json#4 | `c780761e-7f49-8e2c-9215-ef48d3b48387` | `fd29064a` | `c1a885b32ef960e5` | 6 |
| cross-receipt.json#5 | `cf596326-c02c-8008-925b-75b72d44f43c` | `fd29064a` | `6b591900e22f2ba8` | 7 |
| cross-receipt.json#6 | `19943362-a4a5-86ab-afcc-e48aaacc9efd` | `fd29064a` | `ad1fcc55bdfb7a52` | 8 |
| cross-receipt.json#7 | `66f42399-efd4-81c7-b451-071ff2c7898b` | `fd29064a` | `c27faa42150e6e98` | 9 |
| cross-receipt.json#8 | `aa80bc0f-ce59-8df0-8d06-0ad633969b47` | `fd29064a` | `294f0992ef5aa44f` | 10 |
| cross-receipt.json#9 | `87525663-d9b1-8647-a113-d8f8c0823fec` | `fd29064a` | `c02f3dc29a4b8ace` | 11 |
| cross-receipt.json#10 | `8e9153fa-8e32-8102-8fc5-184623502460` | `fd29064a` | `764468a81718149c` | 12 |
| cross-receipt.json#11 | `8cfdfd0d-ff40-8d09-ba04-199cd0b70a45` | `fd29064a` | `870f3b1867cf8006` | 13 |
| cross-receipt.json#12 | `321253d9-8c7c-8d57-a15d-4258d4676c5a` | `fd29064a` | `e3aa4daad4f109db` | 14 |
| cross-receipt.json#13 | `8c0dae7b-2712-8948-9591-32a543b5c448` | `fd29064a` | `0ef75e8dc811861b` | 15 |
| cross-receipt.json#14 | `d21790f5-36b0-8edc-9baf-c090e2366efc` | `fd29064a` | `87276d09343fa13b` | 16 |
| cross-receipt.json#15 | `2af3af5e-0680-83d8-b7f3-c93e66c0d2db` | `fd29064a` | `0df990216d41b6e8` | 17 |
| cross-receipt.json#16 | `1de6bd22-9d72-843f-8b7b-0b3d305958b0` | `fd29064a` | `d148afcd4838e3b8` | 18 |
| cross-receipt.json#17 | `938166ac-d655-8f48-90fc-9331b0d864c7` | `fd29064a` | `fc9ca0ae74cb7a8e` | 19 |
| cross-receipt.json#18 | `8912b531-1873-8062-8f18-272a4a8f7ee6` | `fd29064a` | `58579b18fc23f7ca` | 20 |
| cross-receipt.json#19 | `8d161970-8793-8186-8a44-65a87b13b5e7` | `fd29064a` | `571b3a1c9d1084ae` | 21 |
| cross-receipt.json#20 | `a7fb8d88-6104-8fd4-9416-23c280a6b11b` | `fd29064a` | `f892be6f720eced1` | 22 |
| cross-receipt.json#21 | `78171606-9f75-8f70-8f62-b4902a85b2c8` | `fd29064a` | `33be92ef70a7f2c7` | 23 |
| cross-receipt.json#22 | `d999a0fa-0749-8f2d-b9a7-4f7b8dc77317` | `fd29064a` | `146e0cc7e9ce75ec` | 24 |
| cross-receipt.json#23 | `2cccbefe-8f08-8c10-9e2b-6b233dbe206a` | `fd29064a` | `969872c0b9114f29` | 25 |
| cross-receipt.json#24 | `0739bfa8-109a-81e9-a540-ab56188a5fa4` | `fd29064a` | `83589d423d2f6c5d` | 26 |
| cross-receipt.json#25 | `f280b536-5551-84ba-a68d-a1a03271e928` | `fd29064a` | `c0f5574332b76de0` | 27 |
| cross-receipt.json#26 | `461a4cce-17c8-8bc5-8305-d5ffffabe285` | `fd29064a` | `55ac55b92bd4690e` | 28 |
| cross-receipt.json#27 | `74689ca4-c596-884c-8980-382f098bd441` | `fd29064a` | `180465219da3fd47` | 29 |
| cross-receipt.json#28 | `50e0f9dd-2659-887e-a97b-3d3e2a763fc3` | `fd29064a` | `2fd485b1bf1c80a6` | 30 |
| cross-receipt.json#29 | `a0f444d1-bb1e-80c2-b1db-c88b78054bb9` | `fd29064a` | `44460d3c758a0a12` | 31 |
| debts-receipt.json | `bb465ee8-c352-8fe3-bdbe-3e8cd5881332` | `c218f6d0` | `de5129853bb193de` | 32 |
| flaws-receipt.json | `b001e702-61d1-841c-86fe-a402636f1508` | `c218f6d0` | `ff955046d9f87003` | 33 |
| fuse-receipt.json | `4266a4dd-eff6-8606-aa33-b552294f9afb` | `c218f6d0` | `48886db182f7ad7c` | 34 |
| lattice-receipt.json | `c98be8b5-f715-80ac-96ff-46c6d30a6b42` | `c218f6d0` | `36da43b99a7f4375` | 35 |
| lean-receipt.json | `d6dc93e2-31ba-8b1b-aad9-23fed216934b` | `c218f6d0` | `e755baddffa0d67f` | 36 |
| lean-receipt.json#0 | `92916743-2056-8346-b0d9-68384cb1866d` | `d6dc93e2` | `019a0586328eda49` | 37 |
| lean-receipt.json#1 | `167396f2-2e95-8d66-a646-08ae63785d2f` | `d6dc93e2` | `682ff44cb43f510d` | 38 |
| lean-receipt.json#2 | `df447684-2d37-8284-9774-b9aac6453bc1` | `d6dc93e2` | `3d69fe0db3c0dfeb` | 39 |
| lean-receipt.json#3 | `05b09833-88d5-89d1-8248-af1013898f90` | `d6dc93e2` | `e813d5625a1a4c26` | 40 |
| lean-receipt.json#4 | `fb13dd25-5b04-8021-aac7-0631e4a42518` | `d6dc93e2` | `cecc0085e608b373` | 41 |
| lean-receipt.json#5 | `f4fe39f0-de63-86ee-b840-9a3ef02eec22` | `d6dc93e2` | `1cfe32bc2e91301e` | 42 |
| lean-receipt.json#6 | `969dd57a-3d56-8b19-b9d1-b8409f14bcd2` | `d6dc93e2` | `2e23aca573b6aabe` | 43 |
| lean-receipt.json#7 | `88fe0eca-5372-8902-9a5b-0365fcb34d9c` | `d6dc93e2` | `c05e6f13b029ad48` | 44 |
| lean-receipt.json#8 | `2ae4425a-135e-8b65-98da-f2aa254d005d` | `d6dc93e2` | `e7809edb84ed58c3` | 45 |
| lean-receipt.json#9 | `6f494606-2302-8392-9a46-c1dede5f4560` | `d6dc93e2` | `9a6a9e626761f3d9` | 46 |
| lean-receipt.json#10 | `7d8c5475-9364-8caf-bc9b-ca4a0b75640b` | `d6dc93e2` | `2b4870137e37b1a7` | 47 |
| lean-receipt.json#11 | `618500e1-08a2-84ae-8ef5-4726667baac3` | `d6dc93e2` | `4157b994b853f614` | 48 |
| lean-receipt.json#12 | `fec054a3-8554-8b0e-ae66-a7a244fdaedc` | `d6dc93e2` | `6c494bb3024c8025` | 49 |
| lean-receipt.json#13 | `68cd92d6-109c-8d5b-9ed5-85eb694d8d25` | `d6dc93e2` | `c9a3fb24dde3f8aa` | 50 |
| lean-receipt.json#14 | `c45ddb32-8bbd-8a90-8251-7b265525658f` | `d6dc93e2` | `e5f4dca720a1bcf4` | 51 |
| lean-receipt.json#15 | `2a0bbb8f-bbc2-85e7-b57a-e4c41bd8ed5a` | `d6dc93e2` | `3d3b7bb1e1115983` | 52 |
| lean-receipt.json#16 | `a7513877-9a7c-895f-96e9-1f85724686b1` | `d6dc93e2` | `a66770c9d668f5dd` | 53 |
| lean-receipt.json#17 | `3588ecac-fd37-84af-a64e-fea6734a5e38` | `d6dc93e2` | `59dad0bbd91834cd` | 54 |
| lean-receipt.json#18 | `4eb3742c-41e9-8d87-a9c8-7e2b75a8043d` | `d6dc93e2` | `f0af6270de61b952` | 55 |
| lean-receipt.json#19 | `b58933a3-8864-8778-97e2-2aec8080600f` | `d6dc93e2` | `66173bd38790b46d` | 56 |
| lean-receipt.json#20 | `42addf86-d035-82e6-ac0d-d895c209cd79` | `d6dc93e2` | `c2a072e5f778a725` | 57 |
| lean-receipt.json#21 | `f204ab28-4840-88d9-9f8f-592e5a915273` | `d6dc93e2` | `3ce2357e2f34a4e2` | 58 |
| lean-receipt.json#22 | `25fee6a2-f69a-8fea-a075-051b91a43ee0` | `d6dc93e2` | `61242e1fe1863696` | 59 |
| lean-receipt.json#23 | `17dbf853-5083-83c2-b114-3a8f2671999c` | `d6dc93e2` | `dc77cc56bc7e5ba8` | 60 |
| lean-receipt.json#24 | `3eebceae-eed9-8127-81d3-96a5c4298993` | `d6dc93e2` | `f418a4972fe32aef` | 61 |
| lean-receipt.json#25 | `33206315-f593-829b-b83c-192c83243df0` | `d6dc93e2` | `cb65b765aa0d3b86` | 62 |
| lean-receipt.json#26 | `2b51e866-3769-86cf-a76a-6a6ee933d949` | `d6dc93e2` | `778448fd9011a8d0` | 63 |
| lean-receipt.json#27 | `fdafe8b6-087c-8dc2-a210-a6204d753383` | `d6dc93e2` | `c102ea79a2cf0190` | 64 |
| lean-receipt.json#28 | `b9a73022-986d-83f2-8171-e794798d3e83` | `d6dc93e2` | `9d0f445a5752e056` | 65 |
| lean-receipt.json#29 | `2e9b76dc-b5db-87cb-847b-6b2c954b2284` | `d6dc93e2` | `65d798d6bef19403` | 66 |
| lean-receipt.json#30 | `ae1f67e3-3214-81b1-9d82-8ccdbf9cd3f3` | `d6dc93e2` | `cd06fea9b6542436` | 67 |
| lean-receipt.json#31 | `7ac2ffde-79a2-8450-949a-4cc35bb5fd01` | `d6dc93e2` | `dcdc11ccf3902958` | 68 |
| lean-receipt.json#32 | `833aee18-92a8-8fc4-b284-f9b1d60dcbde` | `d6dc93e2` | `fc5e16f33280066c` | 69 |
| lean-receipt.json#33 | `f4a78447-ee45-8783-9ba7-709bb69cfad3` | `d6dc93e2` | `73a1297dc40d4e11` | 70 |
| lean-receipt.json#34 | `8824f769-8db0-8373-a851-c145a75fc432` | `d6dc93e2` | `8512f581bef3e43a` | 71 |
| lean-receipt.json#35 | `cbde1a2c-6e3b-8dd3-8402-127e57093570` | `d6dc93e2` | `283496d85405ba2d` | 72 |
| lean-receipt.json#36 | `0a6f9f7f-242a-8a5f-b0ba-ce1cc0b4934e` | `d6dc93e2` | `0729a7d79899916e` | 73 |
| lean-receipt.json#37 | `eeb68cdd-ddd2-81fc-bb3c-c52fcc6dcc0d` | `d6dc93e2` | `c0f780238b6efe23` | 74 |
| lean-receipt.json#38 | `f3076175-f45c-800e-9a00-0df97741e826` | `d6dc93e2` | `460f08b23930b2cc` | 75 |
| lean-receipt.json#39 | `f1166a59-b457-89f9-a6ad-5b86141389cc` | `d6dc93e2` | `f804c38626c1991f` | 76 |
| lean-receipt.json#40 | `af1a2dba-05a1-833e-a63f-db41d8fcd567` | `d6dc93e2` | `f8d9e49676147bf8` | 77 |
| lean-receipt.json#41 | `1c76ce25-adf5-80d2-9a03-afd5632a47ad` | `d6dc93e2` | `0018e4981d62b0bf` | 78 |
| lean-receipt.json#42 | `c6dfccf7-3184-8b88-b15b-82b53ce235db` | `d6dc93e2` | `dc22c32ef77d0086` | 79 |
| lean-receipt.json#43 | `4deb6c0d-3490-84fc-85fd-75d945b0c887` | `d6dc93e2` | `98f4925c97027d9d` | 80 |
| lean-receipt.json#44 | `0541e9c7-61b1-870a-a9b7-e07acb4f567e` | `d6dc93e2` | `2646096a33420bc4` | 81 |
| lean-receipt.json#45 | `de83d7bc-a9f3-87a7-8f4f-5d0731bf7e65` | `d6dc93e2` | `88cb56053ceb7403` | 82 |
| lean-receipt.json#46 | `cb4cbfd7-f386-8bbc-b060-214b4f611b9b` | `d6dc93e2` | `fa120465efd6d561` | 83 |
| lean-receipt.json#47 | `9edb3f89-ccdd-80e4-800f-f96af6fd962a` | `d6dc93e2` | `bbd519014b694f8b` | 84 |
| lean-receipt.json#48 | `bf26cbe8-cec8-8aa8-a14a-061b9bad324d` | `d6dc93e2` | `3b86529d580317b3` | 85 |
| lean-receipt.json#49 | `cb06067d-1606-8acf-b82d-b368704567da` | `d6dc93e2` | `4e1d2f51133f1ef0` | 86 |
| lean-receipt.json#50 | `3ce21700-c85a-8685-ab7c-f10c77ee1ad8` | `d6dc93e2` | `8be662d9ef37d8f6` | 87 |
| lean-receipt.json#51 | `484d422e-bfd6-8f52-9faf-d69bda2bca9c` | `d6dc93e2` | `9a1d6ce8cdc7efc9` | 88 |
| lean-receipt.json#52 | `cb22a561-980e-8bd5-9267-5ba677955250` | `d6dc93e2` | `9ce45fba892b7bf4` | 89 |
| lean-receipt.json#53 | `c007b434-4334-8904-be29-95f941bb75c6` | `d6dc93e2` | `821c9ce4d134ba49` | 90 |
| lean-receipt.json#54 | `7f36acc0-28f3-861f-9628-2e42d54709e5` | `d6dc93e2` | `8e29b8e6efab19de` | 91 |
| lean-receipt.json#55 | `340405a3-e422-84e8-b375-c853494e9c54` | `d6dc93e2` | `2ae144fcf9ce9a3e` | 92 |
| lean-receipt.json#56 | `f7920112-ec23-88d1-911b-bcb6752c1818` | `d6dc93e2` | `276f29d0d73a4ef3` | 93 |
| lean-receipt.json#57 | `afbe9d2b-2f07-8196-a2ac-36c8f832836d` | `d6dc93e2` | `5403aa49c30f8830` | 94 |
| lean-receipt.json#58 | `287cb899-197d-8bd6-8bc9-6fa4a7614ffb` | `d6dc93e2` | `cfc7aae0f4b4ac13` | 95 |
| lean-receipt.json#59 | `eb143364-bc76-8468-a979-2ecaefea7d59` | `d6dc93e2` | `fc549cab344263c6` | 96 |
| lean-receipt.json#60 | `fef3d5b2-5cbb-877c-bf3a-80fc8186f79b` | `d6dc93e2` | `1440b8b0671feb33` | 97 |
| lean-receipt.json#61 | `4d824f17-c7a7-88c9-9129-e541152142a9` | `d6dc93e2` | `ed2a859f97100526` | 98 |
| lean-receipt.json#62 | `f4fd6163-5b4d-8f25-b562-0707553403b3` | `d6dc93e2` | `fd19f8e62d1cc314` | 99 |
| lean-receipt.json#63 | `826cb385-0ae1-8da3-93f0-134a4b3accd3` | `d6dc93e2` | `5ec64152e896e2ee` | 100 |
| lean-receipt.json#64 | `3d1d7cbc-fe05-84dd-b5dc-79c167be7ed0` | `d6dc93e2` | `bc785d01899a6d77` | 101 |
| lean-receipt.json#65 | `47fa6bf9-27df-89ce-b99e-7f22d91f3a55` | `d6dc93e2` | `ee3483626ad53658` | 102 |
| lean-receipt.json#66 | `a17b1756-cda3-8fc7-9120-5e94987b6cf2` | `d6dc93e2` | `aab26e988d837e37` | 103 |
| lean-receipt.json#67 | `1e013824-ba90-844a-9dfc-a8d977337bca` | `d6dc93e2` | `65d3bcde975c39a0` | 104 |
| lean-receipt.json#68 | `ec83a056-5490-8d87-bef4-f996209642f6` | `d6dc93e2` | `e1e3f16b64c0c611` | 105 |
| lean-receipt.json#69 | `3c748eb1-ff21-800e-b4d8-dffc1a70577b` | `d6dc93e2` | `b4f2d056f98bb95b` | 106 |
| lean-receipt.json#70 | `c54dea35-437e-899e-b7f1-4027a08505f4` | `d6dc93e2` | `85a26624d688035a` | 107 |
| lean-receipt.json#71 | `47673f7d-9d3e-8648-a910-44474fa487ea` | `d6dc93e2` | `716fe488cad58957` | 108 |
| lean-receipt.json#72 | `1e0e8d15-ad0d-8195-a1bb-608da9b88fee` | `d6dc93e2` | `73433b56aa2a7a2c` | 109 |
| lean-receipt.json#73 | `22669f65-0f52-8f29-a987-9dada12ef8a9` | `d6dc93e2` | `38d871ed1de2b875` | 110 |
| lean-receipt.json#74 | `87346ce1-1b66-8b5e-968f-42eade5df8f9` | `d6dc93e2` | `6cf774cd97cb2bd9` | 111 |
| lean-receipt.json#75 | `60d26adf-dddf-8fda-ba70-2fa60741af1c` | `d6dc93e2` | `74d93482ebc4af94` | 112 |
| lean-receipt.json#76 | `953e6566-e0fa-8fb3-a0cf-15ef8a9d6832` | `d6dc93e2` | `66f49c73eee896a0` | 113 |
| lean-receipt.json#77 | `cc8cf9bb-5f77-87a3-938c-69f59bfdebb7` | `d6dc93e2` | `084fa616af8032ce` | 114 |
| lean-receipt.json#78 | `255812dc-8ae1-8acc-b0e9-f104b59c8d75` | `d6dc93e2` | `8c3f56c452a63498` | 115 |
| lean-receipt.json#79 | `3afaf099-f41d-8865-8367-3592ef656051` | `d6dc93e2` | `a67d2fe65c974450` | 116 |
| lean-receipt.json#80 | `89a193a9-d0fb-847b-95c5-212cc8c7ad37` | `d6dc93e2` | `822931c2b0ad5d00` | 117 |
| lean-receipt.json#81 | `736aa640-99ef-851b-b7a5-e4940a9925f0` | `d6dc93e2` | `db6ed7fda5ace273` | 118 |
| lean-receipt.json#82 | `9bb6348f-aa8f-814e-aade-a9385e195c26` | `d6dc93e2` | `8a029e8fd5c1d47d` | 119 |
| lean-receipt.json#83 | `898cacb8-08fb-802e-92db-716fed30e521` | `d6dc93e2` | `4ee3128cb08d7a21` | 120 |
| lean-receipt.json#84 | `f6d4dbd4-d3f5-87ed-86c4-532f412eb4d1` | `d6dc93e2` | `394e531767404248` | 121 |
| lean-receipt.json#85 | `5821cd4c-502b-827d-9750-42e3603ad205` | `d6dc93e2` | `be9f7671725c7fc6` | 122 |
| lean-receipt.json#86 | `ba622ed4-0d6c-88b1-a2ce-898b13d51a2e` | `d6dc93e2` | `ac2a175a639842f0` | 123 |
| lean-receipt.json#87 | `24d835aa-13a4-89db-8ae9-ad5517997b84` | `d6dc93e2` | `3efac1e9064d5636` | 124 |
| lean-receipt.json#88 | `d91cebab-036e-8bb6-89b1-30e620657b74` | `d6dc93e2` | `df9bb8fe31219a91` | 125 |
| lean-receipt.json#89 | `a99c6cd5-ca92-8fa6-8e4c-ca95ef49e4fb` | `d6dc93e2` | `7d54812e417847f5` | 126 |
| lean-receipt.json#90 | `c8cdfbfd-aaa4-8df7-a7c9-cb3ed67f57c9` | `d6dc93e2` | `ac5e3a9551f68192` | 127 |
| lean-receipt.json#91 | `cb43836a-33ed-8683-a241-758f883ce92c` | `d6dc93e2` | `0feff58ade324e9d` | 128 |
| lean-receipt.json#92 | `71bbb405-2e0c-8a8c-9caf-bbfd8fb1d841` | `d6dc93e2` | `6786f769ce3b42ea` | 129 |
| lean-receipt.json#93 | `4600697d-7b89-83db-b68a-fa987e9072ac` | `d6dc93e2` | `fcc7f7bd72006664` | 130 |
| lean-receipt.json#94 | `b75e8239-275d-8c1c-960b-d62304b07b46` | `d6dc93e2` | `6aa9a9bad44e18c4` | 131 |
| lean-receipt.json#95 | `4fcc8c75-0d74-87e1-ac42-874985fda091` | `d6dc93e2` | `087123c273e3f6d2` | 132 |
| lean-receipt.json#96 | `5b3c70cc-4b2d-8f15-9ead-bef7feac507a` | `d6dc93e2` | `1ae5018836a35d42` | 133 |
| lean-receipt.json#97 | `8344bedf-2912-8158-83cb-d06ac45f7d48` | `d6dc93e2` | `63510fae69055a82` | 134 |
| lean-receipt.json#98 | `4314f664-d7bb-8f37-901d-cb79d5a6e2b8` | `d6dc93e2` | `779c21a3791e5cc7` | 135 |
| lean-receipt.json#99 | `1557d2a4-cfbb-8a15-8d2d-ab80d421c412` | `d6dc93e2` | `4cd7edb32a3a6541` | 136 |
| payload-cf-receipt.json | `73e3fb19-48bf-89bd-9ad0-8a47d2849d69` | `c218f6d0` | `1d127a2ff799a5e5` | 137 |
| percall-receipt.json | `3e97eb2f-0cb6-867a-80f9-c9223f5f7595` | `c218f6d0` | `227e095d17f22621` | 138 |
| refusals-receipt.json | `40f2c6e1-4bf2-8ce6-8033-28cef49df243` | `c218f6d0` | `e0e972028d35f5b2` | 139 |
| test-receipt.json | `8530f74c-7b11-86ea-a5b0-b9a6ade53a39` | `c218f6d0` | `5fc637f79dfc94eb` | 140 |
| test-receipt.json#0 | `3d8de2d7-7257-8bbe-923a-cf63012997f4` | `8530f74c` | `8f31e84778031660` | 141 |
| test-receipt.json#1 | `0954c1ff-6705-845c-938c-ee0a8b1bf908` | `8530f74c` | `da3eb97348e29c82` | 142 |
| test-receipt.json#2 | `f82810a9-f81c-89e4-acae-c34482a081c1` | `8530f74c` | `6523d3075b964345` | 143 |
| test-receipt.json#3 | `db9de958-75df-894c-af5c-170311d19008` | `8530f74c` | `34a901af3f06268a` | 144 |
| test-receipt.json#4 | `2110fbb5-3d0c-8735-94a7-486ec46182ab` | `8530f74c` | `e83367f743ae290e` | 145 |
| test-receipt.json#5 | `bda6ef6a-bbcd-8308-8f0d-ff803b26ee54` | `8530f74c` | `05903ab5ea276b01` | 146 |
| test-receipt.json#6 | `460b2890-e901-8e02-b937-af1d9a773eb4` | `8530f74c` | `6dbdd2e465db81e1` | 147 |
| test-receipt.json#7 | `b504c72e-7592-8e46-9387-1e119ed725d5` | `8530f74c` | `862a01d23f60c3e6` | 148 |
| test-receipt.json#8 | `7b0758de-95e0-8246-81d5-aac91807f66d` | `8530f74c` | `dd8db09b8187d2b5` | 149 |
| test-receipt.json#9 | `d02f5e7b-c871-8682-bd9e-f01e7bff50e6` | `8530f74c` | `b8f486e7e88aae90` | 150 |
| test-receipt.json#10 | `8c0ff0d7-a055-8f13-b81d-64ef0d3dc69a` | `8530f74c` | `99bb4c4605f26d4a` | 151 |
| walls-receipt.json | `d0f4297f-e88c-8d50-b692-a107279e946a` | `c218f6d0` | `2a4c3de10ff7f9be` | 152 |
| readme | `b5406961-cdc1-866e-aaf8-e5025cf9833e` | `c218f6d0` | `978d7fcae6f28334` | 153 |

Regenerate with `npm run readme` after `npm run build` and the receipt-producing runs; `node scripts/generate-readme.mjs --check`
compares. Documentation: [docs/README.md](docs/README.md). License: CC-BY-NC-ND-4.0.
