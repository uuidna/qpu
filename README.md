# UUIDNA QPU

**Final build receipt** `c358db1e-f086-8e7e-9018-2df0d2d940a0`

| | |
|---|---|
| version | 1.0.0 |
| commit | `d7ccc36145c9a03912ec8fc6b050c5863a4e938a` |
| receipts | 11 files, 154 nodes |
| build stream | length 154, head `c358db1e-f086-8e7e-9018-2df0d2d940a0`, chain `7447284384dd054d`, holds **true** |

Each node is a quantum receipt: its UUID is the RFC 9562 v8 content address of its payload fold and its referrer, and
its referrer is the node above it. Change any receipt's bytes and its node, its file's node, the build stream chain
and this final receipt move; the root moves with the commit.

```mermaid
flowchart TD
  n50c1f0fe["root<br/><code>50c1f0fe</code>"]
  nedc1e9e4["cross-receipt.json<br/><code>edc1e9e4</code>"]
  ndd2bbb8a["cross-receipt.json#0<br/><code>dd2bbb8a</code>"]
  n00348956["cross-receipt.json#1<br/><code>00348956</code>"]
  n97a5d6f6["cross-receipt.json#2<br/><code>97a5d6f6</code>"]
  nebc8899f["cross-receipt.json#3<br/><code>ebc8899f</code>"]
  nd0ad43aa["cross-receipt.json#4<br/><code>d0ad43aa</code>"]
  n16c8bd17["cross-receipt.json#5<br/><code>16c8bd17</code>"]
  n36e33bba["cross-receipt.json#6<br/><code>36e33bba</code>"]
  n99dc7c5f["cross-receipt.json#7<br/><code>99dc7c5f</code>"]
  nb1232893["cross-receipt.json#8<br/><code>b1232893</code>"]
  n09bc3fc1["cross-receipt.json#9<br/><code>09bc3fc1</code>"]
  n33e3a474["cross-receipt.json#10<br/><code>33e3a474</code>"]
  n75cc977c["cross-receipt.json#11<br/><code>75cc977c</code>"]
  n9175cd44["cross-receipt.json#12<br/><code>9175cd44</code>"]
  n21fed7b4["cross-receipt.json#13<br/><code>21fed7b4</code>"]
  nca0dcfd3["cross-receipt.json#14<br/><code>ca0dcfd3</code>"]
  na8408b5e["cross-receipt.json#15<br/><code>a8408b5e</code>"]
  n533db316["cross-receipt.json#16<br/><code>533db316</code>"]
  n9a23d330["cross-receipt.json#17<br/><code>9a23d330</code>"]
  nafd02271["cross-receipt.json#18<br/><code>afd02271</code>"]
  n8157ec2f["cross-receipt.json#19<br/><code>8157ec2f</code>"]
  naac5ef91["cross-receipt.json#20<br/><code>aac5ef91</code>"]
  n0e083f3f["cross-receipt.json#21<br/><code>0e083f3f</code>"]
  n1aff4123["cross-receipt.json#22<br/><code>1aff4123</code>"]
  ne064c82c["cross-receipt.json#23<br/><code>e064c82c</code>"]
  n5f169045["cross-receipt.json#24<br/><code>5f169045</code>"]
  nd59a90a3["cross-receipt.json#25<br/><code>d59a90a3</code>"]
  n0183857c["cross-receipt.json#26<br/><code>0183857c</code>"]
  n112f9e87["cross-receipt.json#27<br/><code>112f9e87</code>"]
  n7f71ec01["cross-receipt.json#28<br/><code>7f71ec01</code>"]
  ncc470c46["cross-receipt.json#29<br/><code>cc470c46</code>"]
  ne8f7f2a7["debts-receipt.json<br/><code>e8f7f2a7</code>"]
  nc8154910["flaws-receipt.json<br/><code>c8154910</code>"]
  na07c7d59["fuse-receipt.json<br/><code>a07c7d59</code>"]
  n9095864a["lattice-receipt.json<br/><code>9095864a</code>"]
  n295b17f2["lean-receipt.json<br/><code>295b17f2</code>"]
  na4fb10af["lean-receipt.json#0<br/><code>a4fb10af</code>"]
  n0dc549c8["lean-receipt.json#1<br/><code>0dc549c8</code>"]
  nadfb07e0["lean-receipt.json#2<br/><code>adfb07e0</code>"]
  n6d818da5["lean-receipt.json#3<br/><code>6d818da5</code>"]
  nee1d1fd2["lean-receipt.json#4<br/><code>ee1d1fd2</code>"]
  nf67d6e34["lean-receipt.json#5<br/><code>f67d6e34</code>"]
  ncd85af95["lean-receipt.json#6<br/><code>cd85af95</code>"]
  ncbe36373["lean-receipt.json#7<br/><code>cbe36373</code>"]
  n9c1af07e["lean-receipt.json#8<br/><code>9c1af07e</code>"]
  nfcce6952["lean-receipt.json#9<br/><code>fcce6952</code>"]
  n07a6f4e4["lean-receipt.json#10<br/><code>07a6f4e4</code>"]
  n7a72a566["lean-receipt.json#11<br/><code>7a72a566</code>"]
  ne20f2e6b["lean-receipt.json#12<br/><code>e20f2e6b</code>"]
  n8a85f21a["lean-receipt.json#13<br/><code>8a85f21a</code>"]
  n1177f2db["lean-receipt.json#14<br/><code>1177f2db</code>"]
  nc28dfdd4["lean-receipt.json#15<br/><code>c28dfdd4</code>"]
  n0e00a6ca["lean-receipt.json#16<br/><code>0e00a6ca</code>"]
  n5ec88a95["lean-receipt.json#17<br/><code>5ec88a95</code>"]
  n70e359bc["lean-receipt.json#18<br/><code>70e359bc</code>"]
  n498c35a9["lean-receipt.json#19<br/><code>498c35a9</code>"]
  n0f619f57["lean-receipt.json#20<br/><code>0f619f57</code>"]
  n743d95f8["lean-receipt.json#21<br/><code>743d95f8</code>"]
  nf990f434["lean-receipt.json#22<br/><code>f990f434</code>"]
  nba5e4d98["lean-receipt.json#23<br/><code>ba5e4d98</code>"]
  nf9380989["lean-receipt.json#24<br/><code>f9380989</code>"]
  n953c7474["lean-receipt.json#25<br/><code>953c7474</code>"]
  ne6d44b14["lean-receipt.json#26<br/><code>e6d44b14</code>"]
  n85d7049d["lean-receipt.json#27<br/><code>85d7049d</code>"]
  n6223b136["lean-receipt.json#28<br/><code>6223b136</code>"]
  nd31d96b6["lean-receipt.json#29<br/><code>d31d96b6</code>"]
  n573fc4d0["lean-receipt.json#30<br/><code>573fc4d0</code>"]
  ne5fe867a["lean-receipt.json#31<br/><code>e5fe867a</code>"]
  nd84eded6["lean-receipt.json#32<br/><code>d84eded6</code>"]
  nd32620fd["lean-receipt.json#33<br/><code>d32620fd</code>"]
  n8101ace2["lean-receipt.json#34<br/><code>8101ace2</code>"]
  n6b15d9af["lean-receipt.json#35<br/><code>6b15d9af</code>"]
  n510ae444["lean-receipt.json#36<br/><code>510ae444</code>"]
  nad56fd5c["lean-receipt.json#37<br/><code>ad56fd5c</code>"]
  nad8d2677["lean-receipt.json#38<br/><code>ad8d2677</code>"]
  nb6071127["lean-receipt.json#39<br/><code>b6071127</code>"]
  n30b39b26["lean-receipt.json#40<br/><code>30b39b26</code>"]
  nb2fa39c5["lean-receipt.json#41<br/><code>b2fa39c5</code>"]
  ndf4f85cf["lean-receipt.json#42<br/><code>df4f85cf</code>"]
  nc770727d["lean-receipt.json#43<br/><code>c770727d</code>"]
  nd7499181["lean-receipt.json#44<br/><code>d7499181</code>"]
  n44ea0732["lean-receipt.json#45<br/><code>44ea0732</code>"]
  n8d4642f0["lean-receipt.json#46<br/><code>8d4642f0</code>"]
  n00b72781["lean-receipt.json#47<br/><code>00b72781</code>"]
  nec961c6a["lean-receipt.json#48<br/><code>ec961c6a</code>"]
  na321c9f0["lean-receipt.json#49<br/><code>a321c9f0</code>"]
  n2550cbe1["lean-receipt.json#50<br/><code>2550cbe1</code>"]
  n55ae9ba6["lean-receipt.json#51<br/><code>55ae9ba6</code>"]
  nf40a0f88["lean-receipt.json#52<br/><code>f40a0f88</code>"]
  nec711b69["lean-receipt.json#53<br/><code>ec711b69</code>"]
  n2c93f284["lean-receipt.json#54<br/><code>2c93f284</code>"]
  ne58ad6c9["lean-receipt.json#55<br/><code>e58ad6c9</code>"]
  n42015069["lean-receipt.json#56<br/><code>42015069</code>"]
  nbe64f5c6["lean-receipt.json#57<br/><code>be64f5c6</code>"]
  n53e3250e["lean-receipt.json#58<br/><code>53e3250e</code>"]
  nbf2ee854["lean-receipt.json#59<br/><code>bf2ee854</code>"]
  n2abcf477["lean-receipt.json#60<br/><code>2abcf477</code>"]
  n8f7843dc["lean-receipt.json#61<br/><code>8f7843dc</code>"]
  nd75594ef["lean-receipt.json#62<br/><code>d75594ef</code>"]
  nd912e712["lean-receipt.json#63<br/><code>d912e712</code>"]
  n26b208b1["lean-receipt.json#64<br/><code>26b208b1</code>"]
  n488ff60a["lean-receipt.json#65<br/><code>488ff60a</code>"]
  n16c73055["lean-receipt.json#66<br/><code>16c73055</code>"]
  n5376c318["lean-receipt.json#67<br/><code>5376c318</code>"]
  nc3cc1307["lean-receipt.json#68<br/><code>c3cc1307</code>"]
  na4404bff["lean-receipt.json#69<br/><code>a4404bff</code>"]
  nf4a07142["lean-receipt.json#70<br/><code>f4a07142</code>"]
  n7936378c["lean-receipt.json#71<br/><code>7936378c</code>"]
  n474619f6["lean-receipt.json#72<br/><code>474619f6</code>"]
  ncc144526["lean-receipt.json#73<br/><code>cc144526</code>"]
  n342e4646["lean-receipt.json#74<br/><code>342e4646</code>"]
  n6d051e69["lean-receipt.json#75<br/><code>6d051e69</code>"]
  nc4eba469["lean-receipt.json#76<br/><code>c4eba469</code>"]
  n2ea281bc["lean-receipt.json#77<br/><code>2ea281bc</code>"]
  n5d7be3c2["lean-receipt.json#78<br/><code>5d7be3c2</code>"]
  nb045a61d["lean-receipt.json#79<br/><code>b045a61d</code>"]
  n9b1d0602["lean-receipt.json#80<br/><code>9b1d0602</code>"]
  n1d41bc82["lean-receipt.json#81<br/><code>1d41bc82</code>"]
  nc96ebab5["lean-receipt.json#82<br/><code>c96ebab5</code>"]
  n2c3abc07["lean-receipt.json#83<br/><code>2c3abc07</code>"]
  n5665a96a["lean-receipt.json#84<br/><code>5665a96a</code>"]
  ne4c77442["lean-receipt.json#85<br/><code>e4c77442</code>"]
  n8162d424["lean-receipt.json#86<br/><code>8162d424</code>"]
  na30a7f79["lean-receipt.json#87<br/><code>a30a7f79</code>"]
  nce0d88e7["lean-receipt.json#88<br/><code>ce0d88e7</code>"]
  naa013346["lean-receipt.json#89<br/><code>aa013346</code>"]
  n90cfadc5["lean-receipt.json#90<br/><code>90cfadc5</code>"]
  n4b0ac53f["lean-receipt.json#91<br/><code>4b0ac53f</code>"]
  n49dcb487["lean-receipt.json#92<br/><code>49dcb487</code>"]
  nfa5b2761["lean-receipt.json#93<br/><code>fa5b2761</code>"]
  n602eeb27["lean-receipt.json#94<br/><code>602eeb27</code>"]
  n0d27976d["lean-receipt.json#95<br/><code>0d27976d</code>"]
  n36158e1b["lean-receipt.json#96<br/><code>36158e1b</code>"]
  n3414a325["lean-receipt.json#97<br/><code>3414a325</code>"]
  n1919a4ed["lean-receipt.json#98<br/><code>1919a4ed</code>"]
  nfc4554fb["lean-receipt.json#99<br/><code>fc4554fb</code>"]
  n4fabf3e9["payload-cf-receipt.json<br/><code>4fabf3e9</code>"]
  n4478a5a3["percall-receipt.json<br/><code>4478a5a3</code>"]
  nff3c8c06["refusals-receipt.json<br/><code>ff3c8c06</code>"]
  nc1aa0e30["test-receipt.json<br/><code>c1aa0e30</code>"]
  n6b6abd70["test-receipt.json#0<br/><code>6b6abd70</code>"]
  n8998bf8d["test-receipt.json#1<br/><code>8998bf8d</code>"]
  n1d06e088["test-receipt.json#2<br/><code>1d06e088</code>"]
  n5be1e6e6["test-receipt.json#3<br/><code>5be1e6e6</code>"]
  ne3dd127d["test-receipt.json#4<br/><code>e3dd127d</code>"]
  n3159e4af["test-receipt.json#5<br/><code>3159e4af</code>"]
  n52399005["test-receipt.json#6<br/><code>52399005</code>"]
  n39852c7e["test-receipt.json#7<br/><code>39852c7e</code>"]
  nd7a8b7c6["test-receipt.json#8<br/><code>d7a8b7c6</code>"]
  nb9feffab["test-receipt.json#9<br/><code>b9feffab</code>"]
  nc64a4eac["test-receipt.json#10<br/><code>c64a4eac</code>"]
  n974a9d73["walls-receipt.json<br/><code>974a9d73</code>"]
  nc358db1e["readme<br/><code>c358db1e</code>"]
  n50c1f0fe --> nedc1e9e4
  nedc1e9e4 --> ndd2bbb8a
  nedc1e9e4 --> n00348956
  nedc1e9e4 --> n97a5d6f6
  nedc1e9e4 --> nebc8899f
  nedc1e9e4 --> nd0ad43aa
  nedc1e9e4 --> n16c8bd17
  nedc1e9e4 --> n36e33bba
  nedc1e9e4 --> n99dc7c5f
  nedc1e9e4 --> nb1232893
  nedc1e9e4 --> n09bc3fc1
  nedc1e9e4 --> n33e3a474
  nedc1e9e4 --> n75cc977c
  nedc1e9e4 --> n9175cd44
  nedc1e9e4 --> n21fed7b4
  nedc1e9e4 --> nca0dcfd3
  nedc1e9e4 --> na8408b5e
  nedc1e9e4 --> n533db316
  nedc1e9e4 --> n9a23d330
  nedc1e9e4 --> nafd02271
  nedc1e9e4 --> n8157ec2f
  nedc1e9e4 --> naac5ef91
  nedc1e9e4 --> n0e083f3f
  nedc1e9e4 --> n1aff4123
  nedc1e9e4 --> ne064c82c
  nedc1e9e4 --> n5f169045
  nedc1e9e4 --> nd59a90a3
  nedc1e9e4 --> n0183857c
  nedc1e9e4 --> n112f9e87
  nedc1e9e4 --> n7f71ec01
  nedc1e9e4 --> ncc470c46
  n50c1f0fe --> ne8f7f2a7
  n50c1f0fe --> nc8154910
  n50c1f0fe --> na07c7d59
  n50c1f0fe --> n9095864a
  n50c1f0fe --> n295b17f2
  n295b17f2 --> na4fb10af
  n295b17f2 --> n0dc549c8
  n295b17f2 --> nadfb07e0
  n295b17f2 --> n6d818da5
  n295b17f2 --> nee1d1fd2
  n295b17f2 --> nf67d6e34
  n295b17f2 --> ncd85af95
  n295b17f2 --> ncbe36373
  n295b17f2 --> n9c1af07e
  n295b17f2 --> nfcce6952
  n295b17f2 --> n07a6f4e4
  n295b17f2 --> n7a72a566
  n295b17f2 --> ne20f2e6b
  n295b17f2 --> n8a85f21a
  n295b17f2 --> n1177f2db
  n295b17f2 --> nc28dfdd4
  n295b17f2 --> n0e00a6ca
  n295b17f2 --> n5ec88a95
  n295b17f2 --> n70e359bc
  n295b17f2 --> n498c35a9
  n295b17f2 --> n0f619f57
  n295b17f2 --> n743d95f8
  n295b17f2 --> nf990f434
  n295b17f2 --> nba5e4d98
  n295b17f2 --> nf9380989
  n295b17f2 --> n953c7474
  n295b17f2 --> ne6d44b14
  n295b17f2 --> n85d7049d
  n295b17f2 --> n6223b136
  n295b17f2 --> nd31d96b6
  n295b17f2 --> n573fc4d0
  n295b17f2 --> ne5fe867a
  n295b17f2 --> nd84eded6
  n295b17f2 --> nd32620fd
  n295b17f2 --> n8101ace2
  n295b17f2 --> n6b15d9af
  n295b17f2 --> n510ae444
  n295b17f2 --> nad56fd5c
  n295b17f2 --> nad8d2677
  n295b17f2 --> nb6071127
  n295b17f2 --> n30b39b26
  n295b17f2 --> nb2fa39c5
  n295b17f2 --> ndf4f85cf
  n295b17f2 --> nc770727d
  n295b17f2 --> nd7499181
  n295b17f2 --> n44ea0732
  n295b17f2 --> n8d4642f0
  n295b17f2 --> n00b72781
  n295b17f2 --> nec961c6a
  n295b17f2 --> na321c9f0
  n295b17f2 --> n2550cbe1
  n295b17f2 --> n55ae9ba6
  n295b17f2 --> nf40a0f88
  n295b17f2 --> nec711b69
  n295b17f2 --> n2c93f284
  n295b17f2 --> ne58ad6c9
  n295b17f2 --> n42015069
  n295b17f2 --> nbe64f5c6
  n295b17f2 --> n53e3250e
  n295b17f2 --> nbf2ee854
  n295b17f2 --> n2abcf477
  n295b17f2 --> n8f7843dc
  n295b17f2 --> nd75594ef
  n295b17f2 --> nd912e712
  n295b17f2 --> n26b208b1
  n295b17f2 --> n488ff60a
  n295b17f2 --> n16c73055
  n295b17f2 --> n5376c318
  n295b17f2 --> nc3cc1307
  n295b17f2 --> na4404bff
  n295b17f2 --> nf4a07142
  n295b17f2 --> n7936378c
  n295b17f2 --> n474619f6
  n295b17f2 --> ncc144526
  n295b17f2 --> n342e4646
  n295b17f2 --> n6d051e69
  n295b17f2 --> nc4eba469
  n295b17f2 --> n2ea281bc
  n295b17f2 --> n5d7be3c2
  n295b17f2 --> nb045a61d
  n295b17f2 --> n9b1d0602
  n295b17f2 --> n1d41bc82
  n295b17f2 --> nc96ebab5
  n295b17f2 --> n2c3abc07
  n295b17f2 --> n5665a96a
  n295b17f2 --> ne4c77442
  n295b17f2 --> n8162d424
  n295b17f2 --> na30a7f79
  n295b17f2 --> nce0d88e7
  n295b17f2 --> naa013346
  n295b17f2 --> n90cfadc5
  n295b17f2 --> n4b0ac53f
  n295b17f2 --> n49dcb487
  n295b17f2 --> nfa5b2761
  n295b17f2 --> n602eeb27
  n295b17f2 --> n0d27976d
  n295b17f2 --> n36158e1b
  n295b17f2 --> n3414a325
  n295b17f2 --> n1919a4ed
  n295b17f2 --> nfc4554fb
  n50c1f0fe --> n4fabf3e9
  n50c1f0fe --> n4478a5a3
  n50c1f0fe --> nff3c8c06
  n50c1f0fe --> nc1aa0e30
  nc1aa0e30 --> n6b6abd70
  nc1aa0e30 --> n8998bf8d
  nc1aa0e30 --> n1d06e088
  nc1aa0e30 --> n5be1e6e6
  nc1aa0e30 --> ne3dd127d
  nc1aa0e30 --> n3159e4af
  nc1aa0e30 --> n52399005
  nc1aa0e30 --> n39852c7e
  nc1aa0e30 --> nd7a8b7c6
  nc1aa0e30 --> nb9feffab
  nc1aa0e30 --> nc64a4eac
  n50c1f0fe --> n974a9d73
  n50c1f0fe --> nc358db1e
```

| node | receipt uuid | referrer | payload fold | seq |
|---|---|---|---|---|
| root | `50c1f0fe-443c-82f5-a2c1-489a86d674e9` | `d7ccc361` | `9d9021b112744c64` | 0 |
| cross-receipt.json | `edc1e9e4-f22d-8f3f-bcd8-6c64623d8be5` | `50c1f0fe` | `74f12a23d5e80f05` | 1 |
| cross-receipt.json#0 | `dd2bbb8a-f08e-87cc-ae5a-7f049f40cd42` | `edc1e9e4` | `14432830058e1e46` | 2 |
| cross-receipt.json#1 | `00348956-1b3b-8727-aeec-7f00084429b8` | `edc1e9e4` | `09410219d171472e` | 3 |
| cross-receipt.json#2 | `97a5d6f6-f6b0-8b54-b922-b8046263a0c1` | `edc1e9e4` | `e2cac0a5a1701ff8` | 4 |
| cross-receipt.json#3 | `ebc8899f-fa84-8b06-8dab-c121068986a1` | `edc1e9e4` | `72b0abb676747470` | 5 |
| cross-receipt.json#4 | `d0ad43aa-0349-82eb-8b65-e83b9c77781a` | `edc1e9e4` | `c1a885b32ef960e5` | 6 |
| cross-receipt.json#5 | `16c8bd17-61a0-884a-811c-0daa0244e32d` | `edc1e9e4` | `6b591900e22f2ba8` | 7 |
| cross-receipt.json#6 | `36e33bba-7254-86b2-8170-ad1db75f109c` | `edc1e9e4` | `ad1fcc55bdfb7a52` | 8 |
| cross-receipt.json#7 | `99dc7c5f-609d-8897-962b-1e90bdbe3ace` | `edc1e9e4` | `c27faa42150e6e98` | 9 |
| cross-receipt.json#8 | `b1232893-5a40-8877-a4cd-f9e192a60e5a` | `edc1e9e4` | `294f0992ef5aa44f` | 10 |
| cross-receipt.json#9 | `09bc3fc1-c705-8fbb-802c-4f758372e7fd` | `edc1e9e4` | `c02f3dc29a4b8ace` | 11 |
| cross-receipt.json#10 | `33e3a474-1f61-8f18-994f-dd6b674e6581` | `edc1e9e4` | `764468a81718149c` | 12 |
| cross-receipt.json#11 | `75cc977c-822d-8e85-83bd-bff96083c4e4` | `edc1e9e4` | `870f3b1867cf8006` | 13 |
| cross-receipt.json#12 | `9175cd44-f878-8889-a8a4-f646cab5c057` | `edc1e9e4` | `e3aa4daad4f109db` | 14 |
| cross-receipt.json#13 | `21fed7b4-1213-8ce5-acb1-b879cfd2dbe9` | `edc1e9e4` | `0ef75e8dc811861b` | 15 |
| cross-receipt.json#14 | `ca0dcfd3-42b4-8e26-8a64-291cfc5a446d` | `edc1e9e4` | `87276d09343fa13b` | 16 |
| cross-receipt.json#15 | `a8408b5e-7db9-8d26-b397-89c261ee72be` | `edc1e9e4` | `0df990216d41b6e8` | 17 |
| cross-receipt.json#16 | `533db316-e65b-82e7-8ea6-ea6791497b31` | `edc1e9e4` | `d148afcd4838e3b8` | 18 |
| cross-receipt.json#17 | `9a23d330-623c-89cf-a8c4-823d0fe7d7da` | `edc1e9e4` | `fc9ca0ae74cb7a8e` | 19 |
| cross-receipt.json#18 | `afd02271-3163-85ec-9933-71f8c8b5b8e3` | `edc1e9e4` | `58579b18fc23f7ca` | 20 |
| cross-receipt.json#19 | `8157ec2f-1ed8-8cd5-bf88-113461df4c7a` | `edc1e9e4` | `571b3a1c9d1084ae` | 21 |
| cross-receipt.json#20 | `aac5ef91-555c-884a-ad85-0a7a31deca7e` | `edc1e9e4` | `f892be6f720eced1` | 22 |
| cross-receipt.json#21 | `0e083f3f-8a77-830d-a683-3a64b6a2ca69` | `edc1e9e4` | `33be92ef70a7f2c7` | 23 |
| cross-receipt.json#22 | `1aff4123-2c8a-8b16-aa46-7002ddf4470a` | `edc1e9e4` | `146e0cc7e9ce75ec` | 24 |
| cross-receipt.json#23 | `e064c82c-1ff4-8b48-9103-81ac9db124c7` | `edc1e9e4` | `969872c0b9114f29` | 25 |
| cross-receipt.json#24 | `5f169045-39a8-84b2-b374-602a02b01d15` | `edc1e9e4` | `83589d423d2f6c5d` | 26 |
| cross-receipt.json#25 | `d59a90a3-0b48-8cdf-aea5-1ff02bf67249` | `edc1e9e4` | `c0f5574332b76de0` | 27 |
| cross-receipt.json#26 | `0183857c-654c-8589-a374-0099671549a4` | `edc1e9e4` | `55ac55b92bd4690e` | 28 |
| cross-receipt.json#27 | `112f9e87-df5e-8538-8e59-ea17f30f2900` | `edc1e9e4` | `180465219da3fd47` | 29 |
| cross-receipt.json#28 | `7f71ec01-1b0b-84d0-a9fb-b37ea2279b06` | `edc1e9e4` | `2fd485b1bf1c80a6` | 30 |
| cross-receipt.json#29 | `cc470c46-b52d-89db-b6c5-e88fe3e82a78` | `edc1e9e4` | `44460d3c758a0a12` | 31 |
| debts-receipt.json | `e8f7f2a7-f666-86d9-b512-f0d9f32788ae` | `50c1f0fe` | `de5129853bb193de` | 32 |
| flaws-receipt.json | `c8154910-453c-8380-afb1-54aedcb20980` | `50c1f0fe` | `ff955046d9f87003` | 33 |
| fuse-receipt.json | `a07c7d59-f313-89c2-a109-32cd6b92bd6f` | `50c1f0fe` | `35bc56efc158f869` | 34 |
| lattice-receipt.json | `9095864a-81d5-82ee-910d-36e10a110b3e` | `50c1f0fe` | `36da43b99a7f4375` | 35 |
| lean-receipt.json | `295b17f2-7f22-855c-867e-d63cb822659b` | `50c1f0fe` | `7cf59af706f2fc77` | 36 |
| lean-receipt.json#0 | `a4fb10af-85a4-8d8c-af2d-f0412b55b408` | `295b17f2` | `5e94eaa2291848e0` | 37 |
| lean-receipt.json#1 | `0dc549c8-b2ed-8ee3-ac6f-60ca5cd4fe70` | `295b17f2` | `486f749e6e5cc2d6` | 38 |
| lean-receipt.json#2 | `adfb07e0-04a4-8087-8304-7f165f60c3ec` | `295b17f2` | `3ed2794945659ea1` | 39 |
| lean-receipt.json#3 | `6d818da5-65d5-850c-9c59-333d554f4041` | `295b17f2` | `3214d3c4765494b1` | 40 |
| lean-receipt.json#4 | `ee1d1fd2-ef9a-83cb-a87d-fa7930aa3a37` | `295b17f2` | `fe892c0d3cd2308f` | 41 |
| lean-receipt.json#5 | `f67d6e34-e1c7-88cb-b9c3-9739614e661a` | `295b17f2` | `edb5a96aac3a8c78` | 42 |
| lean-receipt.json#6 | `cd85af95-b920-8a50-88d1-344357f3541e` | `295b17f2` | `425d6a893d607f57` | 43 |
| lean-receipt.json#7 | `cbe36373-5cc7-8a12-92d7-3dfe51c36d60` | `295b17f2` | `2f4868fd67d971b7` | 44 |
| lean-receipt.json#8 | `9c1af07e-0dcc-82a8-8e46-030661fc7123` | `295b17f2` | `194c11211968e8ad` | 45 |
| lean-receipt.json#9 | `fcce6952-782e-82b5-82d4-df276d64afe4` | `295b17f2` | `322269d4345167d7` | 46 |
| lean-receipt.json#10 | `07a6f4e4-06ce-8969-804b-32c3fa9a88cc` | `295b17f2` | `ad9c158e7201d9c3` | 47 |
| lean-receipt.json#11 | `7a72a566-db42-819c-8e36-f88aa5e225aa` | `295b17f2` | `9666b9957e03951e` | 48 |
| lean-receipt.json#12 | `e20f2e6b-ba40-8ca8-beb5-a38a9cc3ca48` | `295b17f2` | `2bf19c5c5f537caf` | 49 |
| lean-receipt.json#13 | `8a85f21a-641d-8d18-bb8b-3b51b4ba7059` | `295b17f2` | `cd8425b10abefe2d` | 50 |
| lean-receipt.json#14 | `1177f2db-ea17-86c2-832f-4c584ff47615` | `295b17f2` | `9311fca7302cc8ac` | 51 |
| lean-receipt.json#15 | `c28dfdd4-c9f5-86fd-bafe-159359d2698c` | `295b17f2` | `e1e6b7a2bf5c6be1` | 52 |
| lean-receipt.json#16 | `0e00a6ca-84a5-8e7d-b84a-0bb650da7e58` | `295b17f2` | `f3a95674af922df6` | 53 |
| lean-receipt.json#17 | `5ec88a95-19e6-8fdf-be4d-d2ea0cdd70da` | `295b17f2` | `2c39da6127059ea9` | 54 |
| lean-receipt.json#18 | `70e359bc-cc94-8e9c-89c8-29449746f7c0` | `295b17f2` | `388bd653e0cf976b` | 55 |
| lean-receipt.json#19 | `498c35a9-6650-8b58-89ed-5d47204d8b54` | `295b17f2` | `dda4ee07b4352e1e` | 56 |
| lean-receipt.json#20 | `0f619f57-8669-843f-9e19-727fccd9c14e` | `295b17f2` | `b82e28b0f4e6babd` | 57 |
| lean-receipt.json#21 | `743d95f8-c0d9-8af8-8916-3175d5ebb381` | `295b17f2` | `ec904b9f78b235d7` | 58 |
| lean-receipt.json#22 | `f990f434-a62a-8f42-b740-70372919919c` | `295b17f2` | `d554e3d16ee326d1` | 59 |
| lean-receipt.json#23 | `ba5e4d98-2559-8c8e-a61b-f9c9f92f33f9` | `295b17f2` | `93ae29cf65f1a99a` | 60 |
| lean-receipt.json#24 | `f9380989-3dda-8466-928b-2fa8e9dcf85c` | `295b17f2` | `05a898d13fb78757` | 61 |
| lean-receipt.json#25 | `953c7474-c7a0-8521-833f-f47c72bcb656` | `295b17f2` | `43fa4cd11065f9c3` | 62 |
| lean-receipt.json#26 | `e6d44b14-4dfb-8df3-98cf-c95069a78f7d` | `295b17f2` | `518da1d1a24ea5e6` | 63 |
| lean-receipt.json#27 | `85d7049d-0eaa-8507-8852-42d4b21b80c9` | `295b17f2` | `6485e8665106098c` | 64 |
| lean-receipt.json#28 | `6223b136-77ba-8497-9703-357b09cd6177` | `295b17f2` | `82d30b3adffdb08e` | 65 |
| lean-receipt.json#29 | `d31d96b6-90ae-85c6-8763-eebfa4990b79` | `295b17f2` | `30a492adb17e8ba4` | 66 |
| lean-receipt.json#30 | `573fc4d0-4f37-89b4-9120-edcdf450d6c1` | `295b17f2` | `0ab2ce40501d40dc` | 67 |
| lean-receipt.json#31 | `e5fe867a-86ec-848f-ae84-0bb9493f7572` | `295b17f2` | `f80b43eafcc54ee9` | 68 |
| lean-receipt.json#32 | `d84eded6-a2e3-8c66-bcee-9a7a4f23086d` | `295b17f2` | `9d4ef352a5ee8022` | 69 |
| lean-receipt.json#33 | `d32620fd-082e-8a66-a159-c5f82adb47a2` | `295b17f2` | `dea4299f484bef08` | 70 |
| lean-receipt.json#34 | `8101ace2-3f1b-840b-b451-025d4fc99f53` | `295b17f2` | `7d4241191f51a916` | 71 |
| lean-receipt.json#35 | `6b15d9af-a08c-805e-aa3d-f5d3a6d10526` | `295b17f2` | `5ac06a5de0f115c3` | 72 |
| lean-receipt.json#36 | `510ae444-6fa1-8590-b2a3-ec914b28eb35` | `295b17f2` | `bb974fe10166a3b1` | 73 |
| lean-receipt.json#37 | `ad56fd5c-198a-8519-b5ac-0aa929fd1fa9` | `295b17f2` | `6e954885a9adee0e` | 74 |
| lean-receipt.json#38 | `ad8d2677-64a5-81cf-a25f-bf7904d544bd` | `295b17f2` | `c27f368fbb00b8de` | 75 |
| lean-receipt.json#39 | `b6071127-6024-8256-9f2e-7d8a2accedbe` | `295b17f2` | `bb7d32116e14d51a` | 76 |
| lean-receipt.json#40 | `30b39b26-5abe-8920-a90e-2234f9dfa96a` | `295b17f2` | `8f556063bbd23223` | 77 |
| lean-receipt.json#41 | `b2fa39c5-0dac-89e2-8dbb-8ff7f5f88827` | `295b17f2` | `a0c650cfb1930384` | 78 |
| lean-receipt.json#42 | `df4f85cf-2310-864b-97fb-08a0e7fa48fd` | `295b17f2` | `a92bba2749029a4c` | 79 |
| lean-receipt.json#43 | `c770727d-a723-8b80-9ddb-a432363d8980` | `295b17f2` | `079d6d4b530ff885` | 80 |
| lean-receipt.json#44 | `d7499181-6283-832c-99f1-1c100f575387` | `295b17f2` | `f2ccb74b705c4f24` | 81 |
| lean-receipt.json#45 | `44ea0732-34a5-8821-9b3e-358fecff8491` | `295b17f2` | `8a1138f404e72703` | 82 |
| lean-receipt.json#46 | `8d4642f0-1502-865c-ae16-f0299fd31a14` | `295b17f2` | `4f7031bec2a755c5` | 83 |
| lean-receipt.json#47 | `00b72781-89fb-8dd7-827c-66afc32f8965` | `295b17f2` | `f2f9bf4b2439fa24` | 84 |
| lean-receipt.json#48 | `ec961c6a-3550-8d9f-ae48-f70d5eecbeb0` | `295b17f2` | `42f1cc508bbc5c1e` | 85 |
| lean-receipt.json#49 | `a321c9f0-c887-850b-abd7-638397990a1a` | `295b17f2` | `250ecb837147de61` | 86 |
| lean-receipt.json#50 | `2550cbe1-4aaa-8b92-952a-9912b6a593ad` | `295b17f2` | `bcf551b2875b2dea` | 87 |
| lean-receipt.json#51 | `55ae9ba6-d0c7-8303-ae7b-948dd38171b7` | `295b17f2` | `7c6dd01f9c9415fb` | 88 |
| lean-receipt.json#52 | `f40a0f88-3a6f-830d-99a6-4913693746dd` | `295b17f2` | `08ba5b967b1a5274` | 89 |
| lean-receipt.json#53 | `ec711b69-ca7d-8ad2-8f4d-7161d11edf27` | `295b17f2` | `193b3dfa08806b7b` | 90 |
| lean-receipt.json#54 | `2c93f284-6e79-8862-bce5-d5e2227f34b4` | `295b17f2` | `ec6f62ba602a90b6` | 91 |
| lean-receipt.json#55 | `e58ad6c9-8e74-88fd-b6ec-0a0bede8f26e` | `295b17f2` | `b372ad6040c5b9cf` | 92 |
| lean-receipt.json#56 | `42015069-e056-8c42-a65f-86f2d7f643b9` | `295b17f2` | `2ccbc878069485a3` | 93 |
| lean-receipt.json#57 | `be64f5c6-b260-8636-acce-b53c64ead6a6` | `295b17f2` | `edf2ea6648ed6821` | 94 |
| lean-receipt.json#58 | `53e3250e-1305-892f-9485-3e7918f1ec0b` | `295b17f2` | `a52192c0f9eef2a7` | 95 |
| lean-receipt.json#59 | `bf2ee854-cf99-8687-bdb2-4690f7c57c65` | `295b17f2` | `0c757ec00e79f212` | 96 |
| lean-receipt.json#60 | `2abcf477-6a35-897f-b879-a3909ceb6c49` | `295b17f2` | `313d30b4a7fb34d1` | 97 |
| lean-receipt.json#61 | `8f7843dc-096f-8922-b7e1-410d888e1660` | `295b17f2` | `4653370b1b356b77` | 98 |
| lean-receipt.json#62 | `d75594ef-37fc-85a9-b78b-8629264d9ad6` | `295b17f2` | `630951ef59e13e66` | 99 |
| lean-receipt.json#63 | `d912e712-36b5-8bb2-a963-f80f0467cbe6` | `295b17f2` | `43f0afd5503520ed` | 100 |
| lean-receipt.json#64 | `26b208b1-5042-88fa-844e-c23cd3db562d` | `295b17f2` | `c03fd303542afaa4` | 101 |
| lean-receipt.json#65 | `488ff60a-5ac7-874a-85f7-25f462842803` | `295b17f2` | `ecec7c1157936ddb` | 102 |
| lean-receipt.json#66 | `16c73055-a84f-8306-9fe3-f988f5ee8e0a` | `295b17f2` | `2ff018b404208db8` | 103 |
| lean-receipt.json#67 | `5376c318-5a6e-8b1b-b03a-514663080ab2` | `295b17f2` | `162637e21244a609` | 104 |
| lean-receipt.json#68 | `c3cc1307-a0d2-8134-b088-64bf90858ec1` | `295b17f2` | `2b0ae195561c9702` | 105 |
| lean-receipt.json#69 | `a4404bff-f5a7-8568-a08a-a12b703f1a3c` | `295b17f2` | `de3c6a92d5442d2a` | 106 |
| lean-receipt.json#70 | `f4a07142-2592-82b7-9aec-337b4d8214bf` | `295b17f2` | `c3ab172f41e4453a` | 107 |
| lean-receipt.json#71 | `7936378c-e58b-8f96-b7ec-d70174dc4974` | `295b17f2` | `e7fbc371f821c410` | 108 |
| lean-receipt.json#72 | `474619f6-a985-82a7-b25d-0f086a07a78b` | `295b17f2` | `dcb23db43852033b` | 109 |
| lean-receipt.json#73 | `cc144526-2996-8b15-91ab-f647b93abf16` | `295b17f2` | `5ef95fe4fd251be7` | 110 |
| lean-receipt.json#74 | `342e4646-ccfe-84b4-9ae9-1f7351ae06c1` | `295b17f2` | `10f22f66c39d193c` | 111 |
| lean-receipt.json#75 | `6d051e69-d53b-8a16-a0b8-d7f936f9b70a` | `295b17f2` | `7abd5c7fc1fbd9d7` | 112 |
| lean-receipt.json#76 | `c4eba469-388f-8172-af1c-2d7651db8915` | `295b17f2` | `c65da4a2b96e1735` | 113 |
| lean-receipt.json#77 | `2ea281bc-ab4a-8700-8066-773b4d2c8180` | `295b17f2` | `c1cf212796fe22a5` | 114 |
| lean-receipt.json#78 | `5d7be3c2-aa67-85f1-990f-a4b6eb09c190` | `295b17f2` | `6fe3337831190956` | 115 |
| lean-receipt.json#79 | `b045a61d-db11-8b75-a686-46120a431516` | `295b17f2` | `3da77e052908f1fe` | 116 |
| lean-receipt.json#80 | `9b1d0602-2979-8e2f-85cf-53cacfaf8ef7` | `295b17f2` | `1ea8871eba4ed8df` | 117 |
| lean-receipt.json#81 | `1d41bc82-4424-8ce0-9424-1cbb619fd247` | `295b17f2` | `7df37dac6752eb7e` | 118 |
| lean-receipt.json#82 | `c96ebab5-e6da-8830-8254-a1a81a1b4c5b` | `295b17f2` | `39ebbe4b66b48244` | 119 |
| lean-receipt.json#83 | `2c3abc07-8da0-85bf-b334-f986203f8a76` | `295b17f2` | `ab01598adb66a22e` | 120 |
| lean-receipt.json#84 | `5665a96a-6aa6-85cc-b9cf-190f25d1ad42` | `295b17f2` | `c459367eeaf2040e` | 121 |
| lean-receipt.json#85 | `e4c77442-ba3e-8b97-8e51-f82be3f5b893` | `295b17f2` | `f641c82553389a79` | 122 |
| lean-receipt.json#86 | `8162d424-c31b-83cd-b9ea-c6cbe89ced17` | `295b17f2` | `d73e54f4a519e84e` | 123 |
| lean-receipt.json#87 | `a30a7f79-4a45-88ce-8f97-e1f884c6aadc` | `295b17f2` | `9b07c490cfc7f0bd` | 124 |
| lean-receipt.json#88 | `ce0d88e7-92a0-837c-b2b6-50695a62dc14` | `295b17f2` | `2606d1ac0a77b8d7` | 125 |
| lean-receipt.json#89 | `aa013346-0617-80b0-a7bb-f3cbe7c5945b` | `295b17f2` | `812c53beba4c55b3` | 126 |
| lean-receipt.json#90 | `90cfadc5-6a4d-8528-8a94-d11487ae5923` | `295b17f2` | `6ca94c75bde2d403` | 127 |
| lean-receipt.json#91 | `4b0ac53f-dc78-80fe-b9b6-25ba5c7287c3` | `295b17f2` | `71f6fc16aba4a5ac` | 128 |
| lean-receipt.json#92 | `49dcb487-0a39-882c-8df9-ea67ec9b12cf` | `295b17f2` | `ff6d40b180d68e8b` | 129 |
| lean-receipt.json#93 | `fa5b2761-48b2-8381-9585-01a91b34c0ba` | `295b17f2` | `52de4de3f9f809ba` | 130 |
| lean-receipt.json#94 | `602eeb27-9477-8b6f-ac1d-d2ede194cd76` | `295b17f2` | `745159aff798bd8c` | 131 |
| lean-receipt.json#95 | `0d27976d-8b70-8a25-a8dd-e7a822d810ee` | `295b17f2` | `4ee00e016d0e618e` | 132 |
| lean-receipt.json#96 | `36158e1b-afaa-8a73-b08d-af72738cbc0e` | `295b17f2` | `d2b4b69e536fbd47` | 133 |
| lean-receipt.json#97 | `3414a325-230d-862e-b769-dbf90fc5c6f4` | `295b17f2` | `99664321ddf7dc89` | 134 |
| lean-receipt.json#98 | `1919a4ed-29a5-8816-8430-1925a77e0fa1` | `295b17f2` | `ae9b4914206ed34e` | 135 |
| lean-receipt.json#99 | `fc4554fb-3995-847c-ae23-9b6c49fb63aa` | `295b17f2` | `2a412f090ebe42bb` | 136 |
| payload-cf-receipt.json | `4fabf3e9-1cd3-8473-abef-6cbdfa0db77d` | `50c1f0fe` | `1d127a2ff799a5e5` | 137 |
| percall-receipt.json | `4478a5a3-1590-8d5d-9dad-ef09d9f68769` | `50c1f0fe` | `227e095d17f22621` | 138 |
| refusals-receipt.json | `ff3c8c06-51d4-8709-a73f-e634f40da36b` | `50c1f0fe` | `e0e972028d35f5b2` | 139 |
| test-receipt.json | `c1aa0e30-778f-8fc0-8641-89b1929757cd` | `50c1f0fe` | `5fc637f79dfc94eb` | 140 |
| test-receipt.json#0 | `6b6abd70-c314-88a7-94bf-fbc7f2820b30` | `c1aa0e30` | `8f31e84778031660` | 141 |
| test-receipt.json#1 | `8998bf8d-3a1e-8b03-9f33-7432cee5f12c` | `c1aa0e30` | `da3eb97348e29c82` | 142 |
| test-receipt.json#2 | `1d06e088-6469-877a-9d7e-781ecff4fe2d` | `c1aa0e30` | `6523d3075b964345` | 143 |
| test-receipt.json#3 | `5be1e6e6-48f8-8ff3-bb02-9d2b559b882c` | `c1aa0e30` | `34a901af3f06268a` | 144 |
| test-receipt.json#4 | `e3dd127d-edf5-835f-a546-6b35a35f370b` | `c1aa0e30` | `e83367f743ae290e` | 145 |
| test-receipt.json#5 | `3159e4af-cddc-8111-b199-7095a3b16390` | `c1aa0e30` | `05903ab5ea276b01` | 146 |
| test-receipt.json#6 | `52399005-44b4-8833-a39d-0ae9ae4a2b70` | `c1aa0e30` | `6dbdd2e465db81e1` | 147 |
| test-receipt.json#7 | `39852c7e-5f5c-8636-a076-de66d9c29a79` | `c1aa0e30` | `862a01d23f60c3e6` | 148 |
| test-receipt.json#8 | `d7a8b7c6-40e0-88cc-b100-521847379c41` | `c1aa0e30` | `dd8db09b8187d2b5` | 149 |
| test-receipt.json#9 | `b9feffab-8945-8894-9315-301190f730de` | `c1aa0e30` | `b8f486e7e88aae90` | 150 |
| test-receipt.json#10 | `c64a4eac-e421-81f2-9cfe-e5f6f3f3224a` | `c1aa0e30` | `99bb4c4605f26d4a` | 151 |
| walls-receipt.json | `974a9d73-9af2-896b-861c-5019bd7825b6` | `50c1f0fe` | `2a4c3de10ff7f9be` | 152 |
| readme | `c358db1e-f086-8e7e-9018-2df0d2d940a0` | `50c1f0fe` | `75d2a59d4e57eebd` | 153 |

Regenerate with `npm run readme` after `npm run build` and the receipt-producing runs; `node scripts/generate-readme.mjs --check`
compares. Documentation: [docs/README.md](docs/README.md). License: CC-BY-NC-ND-4.0.
