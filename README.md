# UUIDNA QPU

**Final build receipt** `5363dd68-bd21-85c6-8bc1-cfac52c9b6fb`

| | |
|---|---|
| version | 1.0.0 |
| commit | `baec2d703f8d327fe76497366ea93e4736949e8e` |
| receipts | 11 files, 154 nodes |
| build stream | length 154, head `5363dd68-bd21-85c6-8bc1-cfac52c9b6fb`, chain `24dfffd3914e6186`, holds **true** |

Each node is a quantum receipt: its UUID is the RFC 9562 v8 content address of its payload fold and its referrer, and
its referrer is the node above it. Change any receipt's bytes and its node, its file's node, the build stream chain
and this final receipt move; the root moves with the commit.

```mermaid
flowchart TD
  n43e62a11["root<br/><code>43e62a11</code>"]
  n57eeb85a["cross-receipt.json<br/><code>57eeb85a</code>"]
  n289106fb["cross-receipt.json#0<br/><code>289106fb</code>"]
  n0feed14b["cross-receipt.json#1<br/><code>0feed14b</code>"]
  n57ff7354["cross-receipt.json#2<br/><code>57ff7354</code>"]
  nd32f82ad["cross-receipt.json#3<br/><code>d32f82ad</code>"]
  ne6a5f70c["cross-receipt.json#4<br/><code>e6a5f70c</code>"]
  n92b71e40["cross-receipt.json#5<br/><code>92b71e40</code>"]
  nad930378["cross-receipt.json#6<br/><code>ad930378</code>"]
  n73d44a48["cross-receipt.json#7<br/><code>73d44a48</code>"]
  neafa4537["cross-receipt.json#8<br/><code>eafa4537</code>"]
  nf8788f4d["cross-receipt.json#9<br/><code>f8788f4d</code>"]
  n11aaa709["cross-receipt.json#10<br/><code>11aaa709</code>"]
  nb16781bf["cross-receipt.json#11<br/><code>b16781bf</code>"]
  n6841b6e2["cross-receipt.json#12<br/><code>6841b6e2</code>"]
  n89c79599["cross-receipt.json#13<br/><code>89c79599</code>"]
  ne743e000["cross-receipt.json#14<br/><code>e743e000</code>"]
  n294acf50["cross-receipt.json#15<br/><code>294acf50</code>"]
  n984025fb["cross-receipt.json#16<br/><code>984025fb</code>"]
  nd3faefd4["cross-receipt.json#17<br/><code>d3faefd4</code>"]
  n10e8d9b7["cross-receipt.json#18<br/><code>10e8d9b7</code>"]
  n5e4dbbaf["cross-receipt.json#19<br/><code>5e4dbbaf</code>"]
  n13de16ca["cross-receipt.json#20<br/><code>13de16ca</code>"]
  n75d0fd24["cross-receipt.json#21<br/><code>75d0fd24</code>"]
  nd22b1139["cross-receipt.json#22<br/><code>d22b1139</code>"]
  nbeded7e5["cross-receipt.json#23<br/><code>beded7e5</code>"]
  n0ab9a781["cross-receipt.json#24<br/><code>0ab9a781</code>"]
  nce850b13["cross-receipt.json#25<br/><code>ce850b13</code>"]
  n57d4f857["cross-receipt.json#26<br/><code>57d4f857</code>"]
  n2c05cdaf["cross-receipt.json#27<br/><code>2c05cdaf</code>"]
  n36e69674["cross-receipt.json#28<br/><code>36e69674</code>"]
  n80b398ec["cross-receipt.json#29<br/><code>80b398ec</code>"]
  n9fd2dafe["debts-receipt.json<br/><code>9fd2dafe</code>"]
  n39822a40["flaws-receipt.json<br/><code>39822a40</code>"]
  n19dc3e5a["fuse-receipt.json<br/><code>19dc3e5a</code>"]
  nd8bfea01["lattice-receipt.json<br/><code>d8bfea01</code>"]
  nd656c8a1["lean-receipt.json<br/><code>d656c8a1</code>"]
  ne26d36f3["lean-receipt.json#0<br/><code>e26d36f3</code>"]
  nc80b54a4["lean-receipt.json#1<br/><code>c80b54a4</code>"]
  nbe783e89["lean-receipt.json#2<br/><code>be783e89</code>"]
  n61848fb0["lean-receipt.json#3<br/><code>61848fb0</code>"]
  n79cc369c["lean-receipt.json#4<br/><code>79cc369c</code>"]
  n7492ece1["lean-receipt.json#5<br/><code>7492ece1</code>"]
  n036e462c["lean-receipt.json#6<br/><code>036e462c</code>"]
  nc86171cb["lean-receipt.json#7<br/><code>c86171cb</code>"]
  ndfa2a49e["lean-receipt.json#8<br/><code>dfa2a49e</code>"]
  n1cae6db2["lean-receipt.json#9<br/><code>1cae6db2</code>"]
  n88e84211["lean-receipt.json#10<br/><code>88e84211</code>"]
  nbdb589c4["lean-receipt.json#11<br/><code>bdb589c4</code>"]
  nb2624036["lean-receipt.json#12<br/><code>b2624036</code>"]
  nf60e5b4b["lean-receipt.json#13<br/><code>f60e5b4b</code>"]
  nf31c6555["lean-receipt.json#14<br/><code>f31c6555</code>"]
  nd3885c90["lean-receipt.json#15<br/><code>d3885c90</code>"]
  n36f3676d["lean-receipt.json#16<br/><code>36f3676d</code>"]
  n9b080bb8["lean-receipt.json#17<br/><code>9b080bb8</code>"]
  neb88ac74["lean-receipt.json#18<br/><code>eb88ac74</code>"]
  n5d07c556["lean-receipt.json#19<br/><code>5d07c556</code>"]
  n7179a6a2["lean-receipt.json#20<br/><code>7179a6a2</code>"]
  n43c53520["lean-receipt.json#21<br/><code>43c53520</code>"]
  n029127d6["lean-receipt.json#22<br/><code>029127d6</code>"]
  nea23bfbb["lean-receipt.json#23<br/><code>ea23bfbb</code>"]
  n8f15be5c["lean-receipt.json#24<br/><code>8f15be5c</code>"]
  n408a71dd["lean-receipt.json#25<br/><code>408a71dd</code>"]
  n628dad52["lean-receipt.json#26<br/><code>628dad52</code>"]
  n1d0d50fa["lean-receipt.json#27<br/><code>1d0d50fa</code>"]
  nee0a95b3["lean-receipt.json#28<br/><code>ee0a95b3</code>"]
  n02e308da["lean-receipt.json#29<br/><code>02e308da</code>"]
  n4b42c6db["lean-receipt.json#30<br/><code>4b42c6db</code>"]
  nbfe02806["lean-receipt.json#31<br/><code>bfe02806</code>"]
  n67881348["lean-receipt.json#32<br/><code>67881348</code>"]
  n62f04f05["lean-receipt.json#33<br/><code>62f04f05</code>"]
  ndf0d817f["lean-receipt.json#34<br/><code>df0d817f</code>"]
  n8f994959["lean-receipt.json#35<br/><code>8f994959</code>"]
  ne8c02cd8["lean-receipt.json#36<br/><code>e8c02cd8</code>"]
  n91572783["lean-receipt.json#37<br/><code>91572783</code>"]
  n19466c0e["lean-receipt.json#38<br/><code>19466c0e</code>"]
  n34e4e8cd["lean-receipt.json#39<br/><code>34e4e8cd</code>"]
  n0a6420e9["lean-receipt.json#40<br/><code>0a6420e9</code>"]
  n561043ae["lean-receipt.json#41<br/><code>561043ae</code>"]
  n5b08e80d["lean-receipt.json#42<br/><code>5b08e80d</code>"]
  n48802f99["lean-receipt.json#43<br/><code>48802f99</code>"]
  n46735043["lean-receipt.json#44<br/><code>46735043</code>"]
  nfabbef20["lean-receipt.json#45<br/><code>fabbef20</code>"]
  nb0b88f93["lean-receipt.json#46<br/><code>b0b88f93</code>"]
  n43ab1b17["lean-receipt.json#47<br/><code>43ab1b17</code>"]
  nf3a8d127["lean-receipt.json#48<br/><code>f3a8d127</code>"]
  n2137489d["lean-receipt.json#49<br/><code>2137489d</code>"]
  n1a4ef6f8["lean-receipt.json#50<br/><code>1a4ef6f8</code>"]
  ne15db270["lean-receipt.json#51<br/><code>e15db270</code>"]
  na5ab238a["lean-receipt.json#52<br/><code>a5ab238a</code>"]
  n8f872552["lean-receipt.json#53<br/><code>8f872552</code>"]
  nd5c353ce["lean-receipt.json#54<br/><code>d5c353ce</code>"]
  nbbbb9458["lean-receipt.json#55<br/><code>bbbb9458</code>"]
  na4dc3693["lean-receipt.json#56<br/><code>a4dc3693</code>"]
  ne2e86570["lean-receipt.json#57<br/><code>e2e86570</code>"]
  nc892a90f["lean-receipt.json#58<br/><code>c892a90f</code>"]
  n0222dbea["lean-receipt.json#59<br/><code>0222dbea</code>"]
  nc1f340d4["lean-receipt.json#60<br/><code>c1f340d4</code>"]
  n8bf65234["lean-receipt.json#61<br/><code>8bf65234</code>"]
  n82a39257["lean-receipt.json#62<br/><code>82a39257</code>"]
  nf377870b["lean-receipt.json#63<br/><code>f377870b</code>"]
  n1bb033c8["lean-receipt.json#64<br/><code>1bb033c8</code>"]
  na63ff012["lean-receipt.json#65<br/><code>a63ff012</code>"]
  n79bf86a8["lean-receipt.json#66<br/><code>79bf86a8</code>"]
  n694ad711["lean-receipt.json#67<br/><code>694ad711</code>"]
  nb7cf1512["lean-receipt.json#68<br/><code>b7cf1512</code>"]
  n3e5b75de["lean-receipt.json#69<br/><code>3e5b75de</code>"]
  n80eff553["lean-receipt.json#70<br/><code>80eff553</code>"]
  n8616ac34["lean-receipt.json#71<br/><code>8616ac34</code>"]
  nbbf59df8["lean-receipt.json#72<br/><code>bbf59df8</code>"]
  nadd123d8["lean-receipt.json#73<br/><code>add123d8</code>"]
  n28314852["lean-receipt.json#74<br/><code>28314852</code>"]
  ncffd74bc["lean-receipt.json#75<br/><code>cffd74bc</code>"]
  na69016e2["lean-receipt.json#76<br/><code>a69016e2</code>"]
  nafb23ed8["lean-receipt.json#77<br/><code>afb23ed8</code>"]
  na4d24330["lean-receipt.json#78<br/><code>a4d24330</code>"]
  n920284d0["lean-receipt.json#79<br/><code>920284d0</code>"]
  n2703ea7f["lean-receipt.json#80<br/><code>2703ea7f</code>"]
  nbe666838["lean-receipt.json#81<br/><code>be666838</code>"]
  nfd8c4c48["lean-receipt.json#82<br/><code>fd8c4c48</code>"]
  n763a7488["lean-receipt.json#83<br/><code>763a7488</code>"]
  ncbbe7d14["lean-receipt.json#84<br/><code>cbbe7d14</code>"]
  n549dfe47["lean-receipt.json#85<br/><code>549dfe47</code>"]
  n3bf4f3d8["lean-receipt.json#86<br/><code>3bf4f3d8</code>"]
  n38e8344c["lean-receipt.json#87<br/><code>38e8344c</code>"]
  nf17fd58b["lean-receipt.json#88<br/><code>f17fd58b</code>"]
  nde1ec4d8["lean-receipt.json#89<br/><code>de1ec4d8</code>"]
  nd45761e5["lean-receipt.json#90<br/><code>d45761e5</code>"]
  ne8538b06["lean-receipt.json#91<br/><code>e8538b06</code>"]
  n7f99089d["lean-receipt.json#92<br/><code>7f99089d</code>"]
  nc5880e27["lean-receipt.json#93<br/><code>c5880e27</code>"]
  naa2ea3a8["lean-receipt.json#94<br/><code>aa2ea3a8</code>"]
  ne35854fc["lean-receipt.json#95<br/><code>e35854fc</code>"]
  n16621807["lean-receipt.json#96<br/><code>16621807</code>"]
  n40f517cc["lean-receipt.json#97<br/><code>40f517cc</code>"]
  n2ea2bc83["lean-receipt.json#98<br/><code>2ea2bc83</code>"]
  n3f883958["lean-receipt.json#99<br/><code>3f883958</code>"]
  n7bef5934["payload-cf-receipt.json<br/><code>7bef5934</code>"]
  ne7c5e927["percall-receipt.json<br/><code>e7c5e927</code>"]
  naa4390e7["refusals-receipt.json<br/><code>aa4390e7</code>"]
  nb8749a4c["test-receipt.json<br/><code>b8749a4c</code>"]
  nd6b4222d["test-receipt.json#0<br/><code>d6b4222d</code>"]
  n3602effd["test-receipt.json#1<br/><code>3602effd</code>"]
  n871b2e7d["test-receipt.json#2<br/><code>871b2e7d</code>"]
  n084c1756["test-receipt.json#3<br/><code>084c1756</code>"]
  ncaf8de15["test-receipt.json#4<br/><code>caf8de15</code>"]
  na874029a["test-receipt.json#5<br/><code>a874029a</code>"]
  n3e3e9cf5["test-receipt.json#6<br/><code>3e3e9cf5</code>"]
  n6f780e76["test-receipt.json#7<br/><code>6f780e76</code>"]
  n6f9a8fdd["test-receipt.json#8<br/><code>6f9a8fdd</code>"]
  na951c75b["test-receipt.json#9<br/><code>a951c75b</code>"]
  n8c71b993["test-receipt.json#10<br/><code>8c71b993</code>"]
  n0957893c["walls-receipt.json<br/><code>0957893c</code>"]
  n5363dd68["readme<br/><code>5363dd68</code>"]
  n43e62a11 --> n57eeb85a
  n57eeb85a --> n289106fb
  n57eeb85a --> n0feed14b
  n57eeb85a --> n57ff7354
  n57eeb85a --> nd32f82ad
  n57eeb85a --> ne6a5f70c
  n57eeb85a --> n92b71e40
  n57eeb85a --> nad930378
  n57eeb85a --> n73d44a48
  n57eeb85a --> neafa4537
  n57eeb85a --> nf8788f4d
  n57eeb85a --> n11aaa709
  n57eeb85a --> nb16781bf
  n57eeb85a --> n6841b6e2
  n57eeb85a --> n89c79599
  n57eeb85a --> ne743e000
  n57eeb85a --> n294acf50
  n57eeb85a --> n984025fb
  n57eeb85a --> nd3faefd4
  n57eeb85a --> n10e8d9b7
  n57eeb85a --> n5e4dbbaf
  n57eeb85a --> n13de16ca
  n57eeb85a --> n75d0fd24
  n57eeb85a --> nd22b1139
  n57eeb85a --> nbeded7e5
  n57eeb85a --> n0ab9a781
  n57eeb85a --> nce850b13
  n57eeb85a --> n57d4f857
  n57eeb85a --> n2c05cdaf
  n57eeb85a --> n36e69674
  n57eeb85a --> n80b398ec
  n43e62a11 --> n9fd2dafe
  n43e62a11 --> n39822a40
  n43e62a11 --> n19dc3e5a
  n43e62a11 --> nd8bfea01
  n43e62a11 --> nd656c8a1
  nd656c8a1 --> ne26d36f3
  nd656c8a1 --> nc80b54a4
  nd656c8a1 --> nbe783e89
  nd656c8a1 --> n61848fb0
  nd656c8a1 --> n79cc369c
  nd656c8a1 --> n7492ece1
  nd656c8a1 --> n036e462c
  nd656c8a1 --> nc86171cb
  nd656c8a1 --> ndfa2a49e
  nd656c8a1 --> n1cae6db2
  nd656c8a1 --> n88e84211
  nd656c8a1 --> nbdb589c4
  nd656c8a1 --> nb2624036
  nd656c8a1 --> nf60e5b4b
  nd656c8a1 --> nf31c6555
  nd656c8a1 --> nd3885c90
  nd656c8a1 --> n36f3676d
  nd656c8a1 --> n9b080bb8
  nd656c8a1 --> neb88ac74
  nd656c8a1 --> n5d07c556
  nd656c8a1 --> n7179a6a2
  nd656c8a1 --> n43c53520
  nd656c8a1 --> n029127d6
  nd656c8a1 --> nea23bfbb
  nd656c8a1 --> n8f15be5c
  nd656c8a1 --> n408a71dd
  nd656c8a1 --> n628dad52
  nd656c8a1 --> n1d0d50fa
  nd656c8a1 --> nee0a95b3
  nd656c8a1 --> n02e308da
  nd656c8a1 --> n4b42c6db
  nd656c8a1 --> nbfe02806
  nd656c8a1 --> n67881348
  nd656c8a1 --> n62f04f05
  nd656c8a1 --> ndf0d817f
  nd656c8a1 --> n8f994959
  nd656c8a1 --> ne8c02cd8
  nd656c8a1 --> n91572783
  nd656c8a1 --> n19466c0e
  nd656c8a1 --> n34e4e8cd
  nd656c8a1 --> n0a6420e9
  nd656c8a1 --> n561043ae
  nd656c8a1 --> n5b08e80d
  nd656c8a1 --> n48802f99
  nd656c8a1 --> n46735043
  nd656c8a1 --> nfabbef20
  nd656c8a1 --> nb0b88f93
  nd656c8a1 --> n43ab1b17
  nd656c8a1 --> nf3a8d127
  nd656c8a1 --> n2137489d
  nd656c8a1 --> n1a4ef6f8
  nd656c8a1 --> ne15db270
  nd656c8a1 --> na5ab238a
  nd656c8a1 --> n8f872552
  nd656c8a1 --> nd5c353ce
  nd656c8a1 --> nbbbb9458
  nd656c8a1 --> na4dc3693
  nd656c8a1 --> ne2e86570
  nd656c8a1 --> nc892a90f
  nd656c8a1 --> n0222dbea
  nd656c8a1 --> nc1f340d4
  nd656c8a1 --> n8bf65234
  nd656c8a1 --> n82a39257
  nd656c8a1 --> nf377870b
  nd656c8a1 --> n1bb033c8
  nd656c8a1 --> na63ff012
  nd656c8a1 --> n79bf86a8
  nd656c8a1 --> n694ad711
  nd656c8a1 --> nb7cf1512
  nd656c8a1 --> n3e5b75de
  nd656c8a1 --> n80eff553
  nd656c8a1 --> n8616ac34
  nd656c8a1 --> nbbf59df8
  nd656c8a1 --> nadd123d8
  nd656c8a1 --> n28314852
  nd656c8a1 --> ncffd74bc
  nd656c8a1 --> na69016e2
  nd656c8a1 --> nafb23ed8
  nd656c8a1 --> na4d24330
  nd656c8a1 --> n920284d0
  nd656c8a1 --> n2703ea7f
  nd656c8a1 --> nbe666838
  nd656c8a1 --> nfd8c4c48
  nd656c8a1 --> n763a7488
  nd656c8a1 --> ncbbe7d14
  nd656c8a1 --> n549dfe47
  nd656c8a1 --> n3bf4f3d8
  nd656c8a1 --> n38e8344c
  nd656c8a1 --> nf17fd58b
  nd656c8a1 --> nde1ec4d8
  nd656c8a1 --> nd45761e5
  nd656c8a1 --> ne8538b06
  nd656c8a1 --> n7f99089d
  nd656c8a1 --> nc5880e27
  nd656c8a1 --> naa2ea3a8
  nd656c8a1 --> ne35854fc
  nd656c8a1 --> n16621807
  nd656c8a1 --> n40f517cc
  nd656c8a1 --> n2ea2bc83
  nd656c8a1 --> n3f883958
  n43e62a11 --> n7bef5934
  n43e62a11 --> ne7c5e927
  n43e62a11 --> naa4390e7
  n43e62a11 --> nb8749a4c
  nb8749a4c --> nd6b4222d
  nb8749a4c --> n3602effd
  nb8749a4c --> n871b2e7d
  nb8749a4c --> n084c1756
  nb8749a4c --> ncaf8de15
  nb8749a4c --> na874029a
  nb8749a4c --> n3e3e9cf5
  nb8749a4c --> n6f780e76
  nb8749a4c --> n6f9a8fdd
  nb8749a4c --> na951c75b
  nb8749a4c --> n8c71b993
  n43e62a11 --> n0957893c
  n43e62a11 --> n5363dd68
```

| node | receipt uuid | referrer | payload fold | seq |
|---|---|---|---|---|
| root | `43e62a11-983b-8c47-b4ee-8302902ccef6` | `baec2d70` | `000dd98fbb8d578e` | 0 |
| cross-receipt.json | `57eeb85a-b561-8fee-aadc-5452b0480cdc` | `43e62a11` | `74f12a23d5e80f05` | 1 |
| cross-receipt.json#0 | `289106fb-763f-81c6-b195-d6a97653cb79` | `57eeb85a` | `14432830058e1e46` | 2 |
| cross-receipt.json#1 | `0feed14b-bf60-8cf5-aff2-ceb74de98b97` | `57eeb85a` | `09410219d171472e` | 3 |
| cross-receipt.json#2 | `57ff7354-ed4d-82ac-b449-bad94713265e` | `57eeb85a` | `e2cac0a5a1701ff8` | 4 |
| cross-receipt.json#3 | `d32f82ad-8293-8b7e-9829-d5b38b738c3e` | `57eeb85a` | `72b0abb676747470` | 5 |
| cross-receipt.json#4 | `e6a5f70c-0bf1-8090-b79c-84ac5ed7a101` | `57eeb85a` | `c1a885b32ef960e5` | 6 |
| cross-receipt.json#5 | `92b71e40-e59c-83b4-a3fe-d55da72737c2` | `57eeb85a` | `6b591900e22f2ba8` | 7 |
| cross-receipt.json#6 | `ad930378-6d9f-8e72-be1a-c2ce47c4a683` | `57eeb85a` | `ad1fcc55bdfb7a52` | 8 |
| cross-receipt.json#7 | `73d44a48-43e5-80db-b47a-41a5cb09e9fd` | `57eeb85a` | `c27faa42150e6e98` | 9 |
| cross-receipt.json#8 | `eafa4537-2c2d-88ec-b884-58931ce90e41` | `57eeb85a` | `294f0992ef5aa44f` | 10 |
| cross-receipt.json#9 | `f8788f4d-52eb-8491-9123-d31579d77852` | `57eeb85a` | `c02f3dc29a4b8ace` | 11 |
| cross-receipt.json#10 | `11aaa709-4882-8420-9c5b-b121911d491e` | `57eeb85a` | `764468a81718149c` | 12 |
| cross-receipt.json#11 | `b16781bf-e29e-84a2-9eda-96e1901b703b` | `57eeb85a` | `870f3b1867cf8006` | 13 |
| cross-receipt.json#12 | `6841b6e2-ff20-83a3-9174-b3dfc6f9ab2c` | `57eeb85a` | `e3aa4daad4f109db` | 14 |
| cross-receipt.json#13 | `89c79599-2000-895d-8a1c-6db11a099f96` | `57eeb85a` | `0ef75e8dc811861b` | 15 |
| cross-receipt.json#14 | `e743e000-fd21-8470-abb2-c060cfbf6a02` | `57eeb85a` | `87276d09343fa13b` | 16 |
| cross-receipt.json#15 | `294acf50-326f-85e6-adfd-38b354c7e06d` | `57eeb85a` | `0df990216d41b6e8` | 17 |
| cross-receipt.json#16 | `984025fb-6eb8-8897-81c8-dba3c3c13ace` | `57eeb85a` | `d148afcd4838e3b8` | 18 |
| cross-receipt.json#17 | `d3faefd4-3429-8a44-bc7a-e0ee9a2ad7c1` | `57eeb85a` | `fc9ca0ae74cb7a8e` | 19 |
| cross-receipt.json#18 | `10e8d9b7-7a62-8a30-9798-5d3f2401dc80` | `57eeb85a` | `58579b18fc23f7ca` | 20 |
| cross-receipt.json#19 | `5e4dbbaf-1d36-8f22-a814-b4955c39cfe1` | `57eeb85a` | `571b3a1c9d1084ae` | 21 |
| cross-receipt.json#20 | `13de16ca-8fb3-877a-ba32-fcffaf6efe2d` | `57eeb85a` | `f892be6f720eced1` | 22 |
| cross-receipt.json#21 | `75d0fd24-9863-8f85-83ed-ef9c00d98e16` | `57eeb85a` | `33be92ef70a7f2c7` | 23 |
| cross-receipt.json#22 | `d22b1139-429c-8063-97c4-de48ce532571` | `57eeb85a` | `146e0cc7e9ce75ec` | 24 |
| cross-receipt.json#23 | `beded7e5-eef7-8a16-8ecd-832ab8c83b5c` | `57eeb85a` | `969872c0b9114f29` | 25 |
| cross-receipt.json#24 | `0ab9a781-905e-87a5-9a91-f45de970d17a` | `57eeb85a` | `83589d423d2f6c5d` | 26 |
| cross-receipt.json#25 | `ce850b13-29a3-8b07-80e9-03237cd85af6` | `57eeb85a` | `c0f5574332b76de0` | 27 |
| cross-receipt.json#26 | `57d4f857-e900-82b6-aeeb-cb3f4a7fcdfb` | `57eeb85a` | `55ac55b92bd4690e` | 28 |
| cross-receipt.json#27 | `2c05cdaf-e636-8f8a-99ca-41ea7c7d55ef` | `57eeb85a` | `180465219da3fd47` | 29 |
| cross-receipt.json#28 | `36e69674-561a-8121-9237-17bc593f9fc5` | `57eeb85a` | `2fd485b1bf1c80a6` | 30 |
| cross-receipt.json#29 | `80b398ec-9551-8bc9-90a6-d786a94a5457` | `57eeb85a` | `44460d3c758a0a12` | 31 |
| debts-receipt.json | `9fd2dafe-9093-8bdd-a767-25b2a3a0192b` | `43e62a11` | `de5129853bb193de` | 32 |
| flaws-receipt.json | `39822a40-5b28-87e5-922a-583dd4a69851` | `43e62a11` | `ff955046d9f87003` | 33 |
| fuse-receipt.json | `19dc3e5a-f5ba-89e6-b72a-9af8c8d57fa2` | `43e62a11` | `35bc56efc158f869` | 34 |
| lattice-receipt.json | `d8bfea01-185f-8a22-9c77-0675ea38083b` | `43e62a11` | `36da43b99a7f4375` | 35 |
| lean-receipt.json | `d656c8a1-06a6-8d1c-b48f-0f677a33555e` | `43e62a11` | `7cf59af706f2fc77` | 36 |
| lean-receipt.json#0 | `e26d36f3-d1db-88de-9a0b-3642aaf2e3dc` | `d656c8a1` | `5e94eaa2291848e0` | 37 |
| lean-receipt.json#1 | `c80b54a4-b174-83d5-a38c-2a6351eab1e4` | `d656c8a1` | `486f749e6e5cc2d6` | 38 |
| lean-receipt.json#2 | `be783e89-7e2a-84e6-902a-057fb1a94368` | `d656c8a1` | `3ed2794945659ea1` | 39 |
| lean-receipt.json#3 | `61848fb0-afa9-82bb-bc33-dbd75390b325` | `d656c8a1` | `3214d3c4765494b1` | 40 |
| lean-receipt.json#4 | `79cc369c-361f-86d0-91ef-fadfdc753fa3` | `d656c8a1` | `fe892c0d3cd2308f` | 41 |
| lean-receipt.json#5 | `7492ece1-5b4b-8037-9ed4-a0d0184bd5f6` | `d656c8a1` | `edb5a96aac3a8c78` | 42 |
| lean-receipt.json#6 | `036e462c-15a6-8823-80f6-680a06387732` | `d656c8a1` | `425d6a893d607f57` | 43 |
| lean-receipt.json#7 | `c86171cb-7e21-82e0-90d8-13199b6b5fd4` | `d656c8a1` | `2f4868fd67d971b7` | 44 |
| lean-receipt.json#8 | `dfa2a49e-03fb-8dda-b96e-ce2c603aaba7` | `d656c8a1` | `194c11211968e8ad` | 45 |
| lean-receipt.json#9 | `1cae6db2-39d3-862e-be03-904c1702a3a0` | `d656c8a1` | `322269d4345167d7` | 46 |
| lean-receipt.json#10 | `88e84211-ade0-85d0-ad67-0ec4b11a68c8` | `d656c8a1` | `ad9c158e7201d9c3` | 47 |
| lean-receipt.json#11 | `bdb589c4-3efa-8600-8a25-a0646e14d606` | `d656c8a1` | `9666b9957e03951e` | 48 |
| lean-receipt.json#12 | `b2624036-4820-8eba-8ad6-2587f5caad1c` | `d656c8a1` | `2bf19c5c5f537caf` | 49 |
| lean-receipt.json#13 | `f60e5b4b-562f-8385-a601-6cb3ac45f25d` | `d656c8a1` | `cd8425b10abefe2d` | 50 |
| lean-receipt.json#14 | `f31c6555-61a0-848d-ba7b-4d2b0e71aed1` | `d656c8a1` | `9311fca7302cc8ac` | 51 |
| lean-receipt.json#15 | `d3885c90-87bd-8754-8c08-3007805b8c88` | `d656c8a1` | `e1e6b7a2bf5c6be1` | 52 |
| lean-receipt.json#16 | `36f3676d-34a2-8907-8268-5b2af43d0bec` | `d656c8a1` | `f3a95674af922df6` | 53 |
| lean-receipt.json#17 | `9b080bb8-2564-80ab-b4bc-e5a28472f9b6` | `d656c8a1` | `2c39da6127059ea9` | 54 |
| lean-receipt.json#18 | `eb88ac74-a95b-896a-b476-fb022017e134` | `d656c8a1` | `388bd653e0cf976b` | 55 |
| lean-receipt.json#19 | `5d07c556-f803-8fad-97e4-a44ee84103d0` | `d656c8a1` | `dda4ee07b4352e1e` | 56 |
| lean-receipt.json#20 | `7179a6a2-d88d-8fee-9a83-7ebe1f08fc22` | `d656c8a1` | `b82e28b0f4e6babd` | 57 |
| lean-receipt.json#21 | `43c53520-2d07-8af7-80c6-94a7e73d4b65` | `d656c8a1` | `ec904b9f78b235d7` | 58 |
| lean-receipt.json#22 | `029127d6-afeb-8a91-a677-d1082e625418` | `d656c8a1` | `d554e3d16ee326d1` | 59 |
| lean-receipt.json#23 | `ea23bfbb-dbf3-82b3-95e1-c996d67f7b7d` | `d656c8a1` | `93ae29cf65f1a99a` | 60 |
| lean-receipt.json#24 | `8f15be5c-4b97-8b15-8a90-8734d0095bd8` | `d656c8a1` | `05a898d13fb78757` | 61 |
| lean-receipt.json#25 | `408a71dd-6c61-897e-b367-688ec994998a` | `d656c8a1` | `43fa4cd11065f9c3` | 62 |
| lean-receipt.json#26 | `628dad52-5d21-8eec-b02b-b8eb1de84419` | `d656c8a1` | `518da1d1a24ea5e6` | 63 |
| lean-receipt.json#27 | `1d0d50fa-7091-822c-8378-1aa50847770d` | `d656c8a1` | `6485e8665106098c` | 64 |
| lean-receipt.json#28 | `ee0a95b3-6c6c-83bc-b76c-4751d59cede3` | `d656c8a1` | `82d30b3adffdb08e` | 65 |
| lean-receipt.json#29 | `02e308da-4747-8beb-b729-be8c81e952fd` | `d656c8a1` | `30a492adb17e8ba4` | 66 |
| lean-receipt.json#30 | `4b42c6db-990b-8763-b0fb-9667f29249a5` | `d656c8a1` | `0ab2ce40501d40dc` | 67 |
| lean-receipt.json#31 | `bfe02806-28a2-85a5-8c95-165dcf3a08ee` | `d656c8a1` | `f80b43eafcc54ee9` | 68 |
| lean-receipt.json#32 | `67881348-008f-8f67-82a8-7ddb72a176c9` | `d656c8a1` | `9d4ef352a5ee8022` | 69 |
| lean-receipt.json#33 | `62f04f05-e511-8e10-aeb4-e0df3111b01e` | `d656c8a1` | `dea4299f484bef08` | 70 |
| lean-receipt.json#34 | `df0d817f-98bf-8ab5-9593-905b2e308797` | `d656c8a1` | `7d4241191f51a916` | 71 |
| lean-receipt.json#35 | `8f994959-6ded-811b-b4e4-4c34cf87031a` | `d656c8a1` | `5ac06a5de0f115c3` | 72 |
| lean-receipt.json#36 | `e8c02cd8-6465-876b-b9b5-5da289b031f1` | `d656c8a1` | `bb974fe10166a3b1` | 73 |
| lean-receipt.json#37 | `91572783-d83c-8076-980f-5e8fa30f816d` | `d656c8a1` | `6e954885a9adee0e` | 74 |
| lean-receipt.json#38 | `19466c0e-88d5-8138-a520-53b2c0942259` | `d656c8a1` | `c27f368fbb00b8de` | 75 |
| lean-receipt.json#39 | `34e4e8cd-e605-85f9-b799-39e0168d7ad2` | `d656c8a1` | `bb7d32116e14d51a` | 76 |
| lean-receipt.json#40 | `0a6420e9-14b7-84c4-a9f9-a066013f51c6` | `d656c8a1` | `8f556063bbd23223` | 77 |
| lean-receipt.json#41 | `561043ae-1f76-822f-83cc-68341a653613` | `d656c8a1` | `a0c650cfb1930384` | 78 |
| lean-receipt.json#42 | `5b08e80d-3236-8744-af56-f83b9c3afd99` | `d656c8a1` | `a92bba2749029a4c` | 79 |
| lean-receipt.json#43 | `48802f99-2cc0-8e1e-84e0-fddd9bf70df4` | `d656c8a1` | `079d6d4b530ff885` | 80 |
| lean-receipt.json#44 | `46735043-8344-8639-8e82-139debeff873` | `d656c8a1` | `f2ccb74b705c4f24` | 81 |
| lean-receipt.json#45 | `fabbef20-4a7b-8494-a4cd-88ca025b65f5` | `d656c8a1` | `8a1138f404e72703` | 82 |
| lean-receipt.json#46 | `b0b88f93-f758-8bf1-a35f-6cef1d082190` | `d656c8a1` | `4f7031bec2a755c5` | 83 |
| lean-receipt.json#47 | `43ab1b17-5549-838a-a4cb-07a0d9528261` | `d656c8a1` | `f2f9bf4b2439fa24` | 84 |
| lean-receipt.json#48 | `f3a8d127-e544-84f1-b1ec-ab663c722c24` | `d656c8a1` | `42f1cc508bbc5c1e` | 85 |
| lean-receipt.json#49 | `2137489d-420a-8c77-90e8-6d1a4e9679f6` | `d656c8a1` | `250ecb837147de61` | 86 |
| lean-receipt.json#50 | `1a4ef6f8-6974-8453-a0bd-8531f7fdc909` | `d656c8a1` | `bcf551b2875b2dea` | 87 |
| lean-receipt.json#51 | `e15db270-174c-8608-97ed-94f47f4c7723` | `d656c8a1` | `7c6dd01f9c9415fb` | 88 |
| lean-receipt.json#52 | `a5ab238a-9636-820e-80d2-8cf65e4ecbf9` | `d656c8a1` | `08ba5b967b1a5274` | 89 |
| lean-receipt.json#53 | `8f872552-dc47-831f-855e-499df58b8d13` | `d656c8a1` | `193b3dfa08806b7b` | 90 |
| lean-receipt.json#54 | `d5c353ce-0dbf-8b07-a6fe-c79ab8018130` | `d656c8a1` | `ec6f62ba602a90b6` | 91 |
| lean-receipt.json#55 | `bbbb9458-fec8-8cf4-81d6-a42f108c2bc2` | `d656c8a1` | `b372ad6040c5b9cf` | 92 |
| lean-receipt.json#56 | `a4dc3693-9fb5-8697-a0c2-cd9b4b214d3d` | `d656c8a1` | `2ccbc878069485a3` | 93 |
| lean-receipt.json#57 | `e2e86570-7fc1-86f3-b775-0b9d8da0d49a` | `d656c8a1` | `edf2ea6648ed6821` | 94 |
| lean-receipt.json#58 | `c892a90f-ca69-8af0-9d8a-dd61fc16bb8f` | `d656c8a1` | `a52192c0f9eef2a7` | 95 |
| lean-receipt.json#59 | `0222dbea-9ae6-8c3a-a000-e7820de87561` | `d656c8a1` | `0c757ec00e79f212` | 96 |
| lean-receipt.json#60 | `c1f340d4-cc1c-86a4-b39f-7b60f317628d` | `d656c8a1` | `313d30b4a7fb34d1` | 97 |
| lean-receipt.json#61 | `8bf65234-2ac9-81f0-b5e2-1628d23608d4` | `d656c8a1` | `4653370b1b356b77` | 98 |
| lean-receipt.json#62 | `82a39257-dcbd-8a06-a7b2-fa3b7d257e0a` | `d656c8a1` | `630951ef59e13e66` | 99 |
| lean-receipt.json#63 | `f377870b-5be6-83af-aca2-d70b94e005da` | `d656c8a1` | `43f0afd5503520ed` | 100 |
| lean-receipt.json#64 | `1bb033c8-6f0c-81bb-8fe1-ae5c15338b89` | `d656c8a1` | `c03fd303542afaa4` | 101 |
| lean-receipt.json#65 | `a63ff012-c787-82a4-a9c9-ba6e1e266f07` | `d656c8a1` | `ecec7c1157936ddb` | 102 |
| lean-receipt.json#66 | `79bf86a8-b29b-8b6a-a6c9-90bbbea1cb66` | `d656c8a1` | `2ff018b404208db8` | 103 |
| lean-receipt.json#67 | `694ad711-2b7f-86d1-a914-336a22d56c2e` | `d656c8a1` | `162637e21244a609` | 104 |
| lean-receipt.json#68 | `b7cf1512-eaa5-8ee3-9063-0d598ec701a5` | `d656c8a1` | `2b0ae195561c9702` | 105 |
| lean-receipt.json#69 | `3e5b75de-d474-8bd7-a135-f8123107dcb8` | `d656c8a1` | `de3c6a92d5442d2a` | 106 |
| lean-receipt.json#70 | `80eff553-b01e-8583-bfe2-5ff9478da5cb` | `d656c8a1` | `c3ab172f41e4453a` | 107 |
| lean-receipt.json#71 | `8616ac34-969e-836b-81c9-71fd27a822f0` | `d656c8a1` | `e7fbc371f821c410` | 108 |
| lean-receipt.json#72 | `bbf59df8-60e9-8468-bb62-adf14d2c770f` | `d656c8a1` | `dcb23db43852033b` | 109 |
| lean-receipt.json#73 | `add123d8-a826-8fe2-a3d2-bd4c12bbc94a` | `d656c8a1` | `5ef95fe4fd251be7` | 110 |
| lean-receipt.json#74 | `28314852-16d2-8263-bac3-c80d4fef79a5` | `d656c8a1` | `10f22f66c39d193c` | 111 |
| lean-receipt.json#75 | `cffd74bc-df88-827a-a79e-6f2bffacf466` | `d656c8a1` | `7abd5c7fc1fbd9d7` | 112 |
| lean-receipt.json#76 | `a69016e2-b017-8f3d-a668-2e491058c1d1` | `d656c8a1` | `c65da4a2b96e1735` | 113 |
| lean-receipt.json#77 | `afb23ed8-30e7-899e-a76b-d0e6b2e605f4` | `d656c8a1` | `c1cf212796fe22a5` | 114 |
| lean-receipt.json#78 | `a4d24330-3fc5-8dab-ba88-b11a0d2e1084` | `d656c8a1` | `6fe3337831190956` | 115 |
| lean-receipt.json#79 | `920284d0-59a2-8042-b8ad-0d1663c41f4a` | `d656c8a1` | `3da77e052908f1fe` | 116 |
| lean-receipt.json#80 | `2703ea7f-1e2b-8d54-a638-65a19b7f1b63` | `d656c8a1` | `1ea8871eba4ed8df` | 117 |
| lean-receipt.json#81 | `be666838-adb5-8c2d-85e2-f304c2147033` | `d656c8a1` | `7df37dac6752eb7e` | 118 |
| lean-receipt.json#82 | `fd8c4c48-62a9-8069-a3ba-dca2122c209f` | `d656c8a1` | `39ebbe4b66b48244` | 119 |
| lean-receipt.json#83 | `763a7488-b50b-8b24-a157-b77d20381a2a` | `d656c8a1` | `ab01598adb66a22e` | 120 |
| lean-receipt.json#84 | `cbbe7d14-e45b-812e-80ff-ee442c38cf3e` | `d656c8a1` | `c459367eeaf2040e` | 121 |
| lean-receipt.json#85 | `549dfe47-01bb-8631-ab65-bc1cc21766d7` | `d656c8a1` | `f641c82553389a79` | 122 |
| lean-receipt.json#86 | `3bf4f3d8-fa08-801a-bc63-b06f81f18d03` | `d656c8a1` | `d73e54f4a519e84e` | 123 |
| lean-receipt.json#87 | `38e8344c-5802-8f7d-879d-39846af30e58` | `d656c8a1` | `9b07c490cfc7f0bd` | 124 |
| lean-receipt.json#88 | `f17fd58b-74f6-8911-a7fe-cd2ed797e390` | `d656c8a1` | `2606d1ac0a77b8d7` | 125 |
| lean-receipt.json#89 | `de1ec4d8-81e5-88e9-8922-2ec5dfd6689f` | `d656c8a1` | `812c53beba4c55b3` | 126 |
| lean-receipt.json#90 | `d45761e5-607d-805a-b5bd-9c3a85ec93a7` | `d656c8a1` | `6ca94c75bde2d403` | 127 |
| lean-receipt.json#91 | `e8538b06-2e4d-8e08-b90c-33013393f0c7` | `d656c8a1` | `71f6fc16aba4a5ac` | 128 |
| lean-receipt.json#92 | `7f99089d-b90d-8638-b779-1b95199248db` | `d656c8a1` | `ff6d40b180d68e8b` | 129 |
| lean-receipt.json#93 | `c5880e27-a5e3-8c45-88dd-f2e5e615fa16` | `d656c8a1` | `52de4de3f9f809ba` | 130 |
| lean-receipt.json#94 | `aa2ea3a8-bbe3-80d4-9a40-90e4e18d5d2a` | `d656c8a1` | `745159aff798bd8c` | 131 |
| lean-receipt.json#95 | `e35854fc-fbc4-8e1c-b3c8-81cb457b4a42` | `d656c8a1` | `4ee00e016d0e618e` | 132 |
| lean-receipt.json#96 | `16621807-7c3a-8a42-82bf-5f29398e26e2` | `d656c8a1` | `d2b4b69e536fbd47` | 133 |
| lean-receipt.json#97 | `40f517cc-d41f-8a03-8146-76f4c291a070` | `d656c8a1` | `99664321ddf7dc89` | 134 |
| lean-receipt.json#98 | `2ea2bc83-8547-8bc5-aec5-afa49af2e285` | `d656c8a1` | `ae9b4914206ed34e` | 135 |
| lean-receipt.json#99 | `3f883958-9d4d-88e0-aa12-4346122e1406` | `d656c8a1` | `2a412f090ebe42bb` | 136 |
| payload-cf-receipt.json | `7bef5934-c27a-84c8-a31d-d288f75a2a54` | `43e62a11` | `1d127a2ff799a5e5` | 137 |
| percall-receipt.json | `e7c5e927-da41-8488-a56f-6a3bfe15b600` | `43e62a11` | `227e095d17f22621` | 138 |
| refusals-receipt.json | `aa4390e7-9358-8781-b3dd-40fb7baadf2e` | `43e62a11` | `e0e972028d35f5b2` | 139 |
| test-receipt.json | `b8749a4c-7c73-87d5-9b9b-5c4c303ff1e4` | `43e62a11` | `5fc637f79dfc94eb` | 140 |
| test-receipt.json#0 | `d6b4222d-aeb8-80f2-a23d-bbc1c8cac115` | `b8749a4c` | `8f31e84778031660` | 141 |
| test-receipt.json#1 | `3602effd-08a0-8216-840f-8830cccbe879` | `b8749a4c` | `da3eb97348e29c82` | 142 |
| test-receipt.json#2 | `871b2e7d-88f1-845e-b55f-7c25b41551f4` | `b8749a4c` | `6523d3075b964345` | 143 |
| test-receipt.json#3 | `084c1756-177a-8706-9fde-b12953817f79` | `b8749a4c` | `34a901af3f06268a` | 144 |
| test-receipt.json#4 | `caf8de15-6512-8b6e-bc97-22a441f4533e` | `b8749a4c` | `e83367f743ae290e` | 145 |
| test-receipt.json#5 | `a874029a-5e9a-8ddc-9395-79be36be7675` | `b8749a4c` | `05903ab5ea276b01` | 146 |
| test-receipt.json#6 | `3e3e9cf5-8f6a-828e-b5e8-b474db406655` | `b8749a4c` | `6dbdd2e465db81e1` | 147 |
| test-receipt.json#7 | `6f780e76-7881-8f5d-9a25-26bafdad9c58` | `b8749a4c` | `862a01d23f60c3e6` | 148 |
| test-receipt.json#8 | `6f9a8fdd-f9b1-893e-bd5e-e7f8ca618ca0` | `b8749a4c` | `dd8db09b8187d2b5` | 149 |
| test-receipt.json#9 | `a951c75b-8920-8871-b411-051c88aabd1f` | `b8749a4c` | `b8f486e7e88aae90` | 150 |
| test-receipt.json#10 | `8c71b993-fb3f-8a82-b72f-898c109c9f83` | `b8749a4c` | `99bb4c4605f26d4a` | 151 |
| walls-receipt.json | `0957893c-4b79-8f9d-9261-037b6c4eaf33` | `43e62a11` | `2a4c3de10ff7f9be` | 152 |
| readme | `5363dd68-bd21-85c6-8bc1-cfac52c9b6fb` | `43e62a11` | `4682efb694c89a85` | 153 |

Regenerate with `npm run readme` after `npm run build` and the receipt-producing runs; `node scripts/generate-readme.mjs --check`
compares. Documentation: [docs/README.md](docs/README.md). License: CC-BY-NC-ND-4.0.
