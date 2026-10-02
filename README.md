# UUIDNA QPU

**Final build receipt** `27149ff6-aabe-8fe8-b77e-78be7caadec0`

| | |
|---|---|
| version | 1.0.0 |
| commit | `3028272efd112dd0280e62d92b64a8b6321c96f4` (working tree differed from this commit) |
| receipts | 12 files, 252 nodes |
| build stream | length 252, head `27149ff6-aabe-8fe8-b77e-78be7caadec0`, chain `a59862deebd7ca650f54b254b2c9b3e7c68de96257da703a6f7b74f7c0a58c91`, holds **true** |

Each node is a quantum receipt: its UUID is the RFC 9562 v8 content address of its payload fold and its referrer, and
its referrer is the node above it. Change any receipt's bytes and its node, its file's node, the build stream chain
and this final receipt move; the root moves with the commit.

```mermaid
flowchart TD
  n21a3bbad["root<br/><code>21a3bbad</code>"]
  n6b829f64["cross-receipt.json<br/><code>6b829f64</code>"]
  n6e7cd9e8["cross-receipt.json#0<br/><code>6e7cd9e8</code>"]
  nb1503328["cross-receipt.json#1<br/><code>b1503328</code>"]
  nb3723214["cross-receipt.json#2<br/><code>b3723214</code>"]
  ne370c116["cross-receipt.json#3<br/><code>e370c116</code>"]
  n3d08b606["cross-receipt.json#4<br/><code>3d08b606</code>"]
  nc6b0cc3e["cross-receipt.json#5<br/><code>c6b0cc3e</code>"]
  neb0d472f["cross-receipt.json#6<br/><code>eb0d472f</code>"]
  nc2f1b53e["cross-receipt.json#7<br/><code>c2f1b53e</code>"]
  nae1b35dc["cross-receipt.json#8<br/><code>ae1b35dc</code>"]
  n7637f12a["cross-receipt.json#9<br/><code>7637f12a</code>"]
  n6c870ee9["cross-receipt.json#10<br/><code>6c870ee9</code>"]
  n2f711c0b["cross-receipt.json#11<br/><code>2f711c0b</code>"]
  nafcaf4b1["cross-receipt.json#12<br/><code>afcaf4b1</code>"]
  n8e163d13["cross-receipt.json#13<br/><code>8e163d13</code>"]
  n7d9ffbc7["cross-receipt.json#14<br/><code>7d9ffbc7</code>"]
  n7394ff98["cross-receipt.json#15<br/><code>7394ff98</code>"]
  n6e39a509["cross-receipt.json#16<br/><code>6e39a509</code>"]
  nc0896775["cross-receipt.json#17<br/><code>c0896775</code>"]
  n210ec77a["cross-receipt.json#18<br/><code>210ec77a</code>"]
  nf2144e49["cross-receipt.json#19<br/><code>f2144e49</code>"]
  n51daaa63["cross-receipt.json#20<br/><code>51daaa63</code>"]
  n6d9944be["cross-receipt.json#21<br/><code>6d9944be</code>"]
  n0d8884f6["cross-receipt.json#22<br/><code>0d8884f6</code>"]
  n47570be1["cross-receipt.json#23<br/><code>47570be1</code>"]
  n40eb1d34["cross-receipt.json#24<br/><code>40eb1d34</code>"]
  nfa724151["cross-receipt.json#25<br/><code>fa724151</code>"]
  n9430dc0d["cross-receipt.json#26<br/><code>9430dc0d</code>"]
  n9ea1c2b6["cross-receipt.json#27<br/><code>9ea1c2b6</code>"]
  n6d928d3f["cross-receipt.json#28<br/><code>6d928d3f</code>"]
  n0f4fbcfc["cross-receipt.json#29<br/><code>0f4fbcfc</code>"]
  n64bb7d6b["debts-receipt.json<br/><code>64bb7d6b</code>"]
  n143d49b7["flaws-receipt.json<br/><code>143d49b7</code>"]
  n42c006ec["formulas-receipt.json<br/><code>42c006ec</code>"]
  nc6ab8ca3["formulas-receipt.json#0<br/><code>c6ab8ca3</code>"]
  nb224151f["formulas-receipt.json#1<br/><code>b224151f</code>"]
  nb880ecd6["formulas-receipt.json#2<br/><code>b880ecd6</code>"]
  n4e291709["formulas-receipt.json#3<br/><code>4e291709</code>"]
  n1a5ee391["formulas-receipt.json#4<br/><code>1a5ee391</code>"]
  n074a7e76["formulas-receipt.json#5<br/><code>074a7e76</code>"]
  nde7e11ec["formulas-receipt.json#6<br/><code>de7e11ec</code>"]
  nd7ef8c1e["formulas-receipt.json#7<br/><code>d7ef8c1e</code>"]
  ndbee1d09["formulas-receipt.json#8<br/><code>dbee1d09</code>"]
  n8e9d1e56["formulas-receipt.json#9<br/><code>8e9d1e56</code>"]
  nea64a7e8["formulas-receipt.json#10<br/><code>ea64a7e8</code>"]
  n77885898["formulas-receipt.json#11<br/><code>77885898</code>"]
  na71bdefe["formulas-receipt.json#12<br/><code>a71bdefe</code>"]
  n59811a79["formulas-receipt.json#13<br/><code>59811a79</code>"]
  nfd45fc97["formulas-receipt.json#14<br/><code>fd45fc97</code>"]
  n776549b0["formulas-receipt.json#15<br/><code>776549b0</code>"]
  nf97e2e46["formulas-receipt.json#16<br/><code>f97e2e46</code>"]
  nf45f69b0["formulas-receipt.json#17<br/><code>f45f69b0</code>"]
  n475b6b7f["formulas-receipt.json#18<br/><code>475b6b7f</code>"]
  n3d723211["formulas-receipt.json#19<br/><code>3d723211</code>"]
  nd8bac186["formulas-receipt.json#20<br/><code>d8bac186</code>"]
  n47940f55["formulas-receipt.json#21<br/><code>47940f55</code>"]
  n0c644df6["formulas-receipt.json#22<br/><code>0c644df6</code>"]
  n578519e7["formulas-receipt.json#23<br/><code>578519e7</code>"]
  n15cd92a4["formulas-receipt.json#24<br/><code>15cd92a4</code>"]
  n06310739["formulas-receipt.json#25<br/><code>06310739</code>"]
  nd5fff6e1["formulas-receipt.json#26<br/><code>d5fff6e1</code>"]
  n7993232a["formulas-receipt.json#27<br/><code>7993232a</code>"]
  n0e9ea1c4["formulas-receipt.json#28<br/><code>0e9ea1c4</code>"]
  n60b871b7["formulas-receipt.json#29<br/><code>60b871b7</code>"]
  nff81f686["formulas-receipt.json#30<br/><code>ff81f686</code>"]
  n38ed1e0d["formulas-receipt.json#31<br/><code>38ed1e0d</code>"]
  n032d34a4["formulas-receipt.json#32<br/><code>032d34a4</code>"]
  n42931574["formulas-receipt.json#33<br/><code>42931574</code>"]
  n76d49d15["formulas-receipt.json#34<br/><code>76d49d15</code>"]
  n81d4490a["formulas-receipt.json#35<br/><code>81d4490a</code>"]
  n87d471fe["formulas-receipt.json#36<br/><code>87d471fe</code>"]
  n9b177ca6["formulas-receipt.json#37<br/><code>9b177ca6</code>"]
  n75b7d20e["formulas-receipt.json#38<br/><code>75b7d20e</code>"]
  n8321d667["formulas-receipt.json#39<br/><code>8321d667</code>"]
  n12dc15fe["formulas-receipt.json#40<br/><code>12dc15fe</code>"]
  n71cf263f["formulas-receipt.json#41<br/><code>71cf263f</code>"]
  n1a7fbbce["formulas-receipt.json#42<br/><code>1a7fbbce</code>"]
  nb50e9760["formulas-receipt.json#43<br/><code>b50e9760</code>"]
  n46015b27["formulas-receipt.json#44<br/><code>46015b27</code>"]
  n0d680e37["formulas-receipt.json#45<br/><code>0d680e37</code>"]
  nbbff9bea["formulas-receipt.json#46<br/><code>bbff9bea</code>"]
  ne6543052["formulas-receipt.json#47<br/><code>e6543052</code>"]
  n94fcba5b["formulas-receipt.json#48<br/><code>94fcba5b</code>"]
  nd14d4653["formulas-receipt.json#49<br/><code>d14d4653</code>"]
  n4a8c48bd["formulas-receipt.json#50<br/><code>4a8c48bd</code>"]
  naa1f1968["formulas-receipt.json#51<br/><code>aa1f1968</code>"]
  naa380c08["formulas-receipt.json#52<br/><code>aa380c08</code>"]
  n9d513145["formulas-receipt.json#53<br/><code>9d513145</code>"]
  n94ec2efe["formulas-receipt.json#54<br/><code>94ec2efe</code>"]
  na09caebe["formulas-receipt.json#55<br/><code>a09caebe</code>"]
  nc29b895a["formulas-receipt.json#56<br/><code>c29b895a</code>"]
  n58ab49ce["formulas-receipt.json#57<br/><code>58ab49ce</code>"]
  n63ec8432["formulas-receipt.json#58<br/><code>63ec8432</code>"]
  n76b4e993["formulas-receipt.json#59<br/><code>76b4e993</code>"]
  n21db09ac["formulas-receipt.json#60<br/><code>21db09ac</code>"]
  nc7a5d86e["formulas-receipt.json#61<br/><code>c7a5d86e</code>"]
  n4f7fbdba["formulas-receipt.json#62<br/><code>4f7fbdba</code>"]
  ned5d96a8["formulas-receipt.json#63<br/><code>ed5d96a8</code>"]
  nbd9729cb["formulas-receipt.json#64<br/><code>bd9729cb</code>"]
  n27d6efc2["formulas-receipt.json#65<br/><code>27d6efc2</code>"]
  n029da78e["formulas-receipt.json#66<br/><code>029da78e</code>"]
  n9ad558de["formulas-receipt.json#67<br/><code>9ad558de</code>"]
  necfa3ede["formulas-receipt.json#68<br/><code>ecfa3ede</code>"]
  na27a9c60["formulas-receipt.json#69<br/><code>a27a9c60</code>"]
  n56436aee["formulas-receipt.json#70<br/><code>56436aee</code>"]
  nd4461990["formulas-receipt.json#71<br/><code>d4461990</code>"]
  n48a17571["formulas-receipt.json#72<br/><code>48a17571</code>"]
  naaea1a20["fuse-receipt.json<br/><code>aaea1a20</code>"]
  n59f0cd85["lattice-receipt.json<br/><code>59f0cd85</code>"]
  n572d116a["lean-receipt.json<br/><code>572d116a</code>"]
  n05802627["lean-receipt.json#0<br/><code>05802627</code>"]
  n8117d057["lean-receipt.json#1<br/><code>8117d057</code>"]
  n1a7a0083["lean-receipt.json#2<br/><code>1a7a0083</code>"]
  n040b3d2b["lean-receipt.json#3<br/><code>040b3d2b</code>"]
  n6f3f2738["lean-receipt.json#4<br/><code>6f3f2738</code>"]
  n5905783a["lean-receipt.json#5<br/><code>5905783a</code>"]
  n47bfbeb1["lean-receipt.json#6<br/><code>47bfbeb1</code>"]
  ne8d1dd98["lean-receipt.json#7<br/><code>e8d1dd98</code>"]
  nb8ebd111["lean-receipt.json#8<br/><code>b8ebd111</code>"]
  nc9f55979["lean-receipt.json#9<br/><code>c9f55979</code>"]
  n5c3f5630["lean-receipt.json#10<br/><code>5c3f5630</code>"]
  n96d36eb5["lean-receipt.json#11<br/><code>96d36eb5</code>"]
  n7299da2d["lean-receipt.json#12<br/><code>7299da2d</code>"]
  n94a82dbb["lean-receipt.json#13<br/><code>94a82dbb</code>"]
  n726b0cca["lean-receipt.json#14<br/><code>726b0cca</code>"]
  n4635b29a["lean-receipt.json#15<br/><code>4635b29a</code>"]
  nbea18815["lean-receipt.json#16<br/><code>bea18815</code>"]
  n93acb9b8["lean-receipt.json#17<br/><code>93acb9b8</code>"]
  n921a2803["lean-receipt.json#18<br/><code>921a2803</code>"]
  na792e8e6["lean-receipt.json#19<br/><code>a792e8e6</code>"]
  n7151253b["lean-receipt.json#20<br/><code>7151253b</code>"]
  nbf4db2f2["lean-receipt.json#21<br/><code>bf4db2f2</code>"]
  n1931329c["lean-receipt.json#22<br/><code>1931329c</code>"]
  nd7512384["lean-receipt.json#23<br/><code>d7512384</code>"]
  n0d77557e["lean-receipt.json#24<br/><code>0d77557e</code>"]
  n9fc39793["lean-receipt.json#25<br/><code>9fc39793</code>"]
  n977ee823["lean-receipt.json#26<br/><code>977ee823</code>"]
  nca9e3936["lean-receipt.json#27<br/><code>ca9e3936</code>"]
  n01f6cfda["lean-receipt.json#28<br/><code>01f6cfda</code>"]
  n6a9fd283["lean-receipt.json#29<br/><code>6a9fd283</code>"]
  nf62ef748["lean-receipt.json#30<br/><code>f62ef748</code>"]
  n1261aeb5["lean-receipt.json#31<br/><code>1261aeb5</code>"]
  n0853c7c6["lean-receipt.json#32<br/><code>0853c7c6</code>"]
  n15d1a937["lean-receipt.json#33<br/><code>15d1a937</code>"]
  n49873db4["lean-receipt.json#34<br/><code>49873db4</code>"]
  n66627412["lean-receipt.json#35<br/><code>66627412</code>"]
  n661f50af["lean-receipt.json#36<br/><code>661f50af</code>"]
  n1cd4167c["lean-receipt.json#37<br/><code>1cd4167c</code>"]
  nc2a6c93c["lean-receipt.json#38<br/><code>c2a6c93c</code>"]
  na62c4714["lean-receipt.json#39<br/><code>a62c4714</code>"]
  nc4f87feb["lean-receipt.json#40<br/><code>c4f87feb</code>"]
  na603b582["lean-receipt.json#41<br/><code>a603b582</code>"]
  n4221b325["lean-receipt.json#42<br/><code>4221b325</code>"]
  n65f98137["lean-receipt.json#43<br/><code>65f98137</code>"]
  na75b45c3["lean-receipt.json#44<br/><code>a75b45c3</code>"]
  n35fbaa58["lean-receipt.json#45<br/><code>35fbaa58</code>"]
  n0a3610fd["lean-receipt.json#46<br/><code>0a3610fd</code>"]
  nade672fa["lean-receipt.json#47<br/><code>ade672fa</code>"]
  n1f77e899["lean-receipt.json#48<br/><code>1f77e899</code>"]
  ne1d876f7["lean-receipt.json#49<br/><code>e1d876f7</code>"]
  n4a0722ef["lean-receipt.json#50<br/><code>4a0722ef</code>"]
  n1dc67335["lean-receipt.json#51<br/><code>1dc67335</code>"]
  n60695f5a["lean-receipt.json#52<br/><code>60695f5a</code>"]
  ne89ccccd["lean-receipt.json#53<br/><code>e89ccccd</code>"]
  nee9a6073["lean-receipt.json#54<br/><code>ee9a6073</code>"]
  n6135cf12["lean-receipt.json#55<br/><code>6135cf12</code>"]
  n4be5080e["lean-receipt.json#56<br/><code>4be5080e</code>"]
  n711ee845["lean-receipt.json#57<br/><code>711ee845</code>"]
  n8a4fb4cb["lean-receipt.json#58<br/><code>8a4fb4cb</code>"]
  n3d30607f["lean-receipt.json#59<br/><code>3d30607f</code>"]
  nab6fa770["lean-receipt.json#60<br/><code>ab6fa770</code>"]
  nb922b2bf["lean-receipt.json#61<br/><code>b922b2bf</code>"]
  ncb9b43c5["lean-receipt.json#62<br/><code>cb9b43c5</code>"]
  nbe6ed065["lean-receipt.json#63<br/><code>be6ed065</code>"]
  n4ac266b4["lean-receipt.json#64<br/><code>4ac266b4</code>"]
  n583d8a92["lean-receipt.json#65<br/><code>583d8a92</code>"]
  n8ffc30a5["lean-receipt.json#66<br/><code>8ffc30a5</code>"]
  nfd49d851["lean-receipt.json#67<br/><code>fd49d851</code>"]
  n0bfe829e["lean-receipt.json#68<br/><code>0bfe829e</code>"]
  n31f6f846["lean-receipt.json#69<br/><code>31f6f846</code>"]
  nfd31145f["lean-receipt.json#70<br/><code>fd31145f</code>"]
  n3be77f8f["lean-receipt.json#71<br/><code>3be77f8f</code>"]
  n979f803b["lean-receipt.json#72<br/><code>979f803b</code>"]
  na8a5b2c9["lean-receipt.json#73<br/><code>a8a5b2c9</code>"]
  n446e1362["lean-receipt.json#74<br/><code>446e1362</code>"]
  ndad269d1["lean-receipt.json#75<br/><code>dad269d1</code>"]
  n6bb96ef7["lean-receipt.json#76<br/><code>6bb96ef7</code>"]
  n1aa55f7a["lean-receipt.json#77<br/><code>1aa55f7a</code>"]
  n138a647c["lean-receipt.json#78<br/><code>138a647c</code>"]
  naf8df62e["lean-receipt.json#79<br/><code>af8df62e</code>"]
  nb9547432["lean-receipt.json#80<br/><code>b9547432</code>"]
  n4ba776cb["lean-receipt.json#81<br/><code>4ba776cb</code>"]
  n2a1e9d0a["lean-receipt.json#82<br/><code>2a1e9d0a</code>"]
  n4ea5b010["lean-receipt.json#83<br/><code>4ea5b010</code>"]
  n1f6b9d43["lean-receipt.json#84<br/><code>1f6b9d43</code>"]
  ndbc01685["lean-receipt.json#85<br/><code>dbc01685</code>"]
  n4ba12b36["lean-receipt.json#86<br/><code>4ba12b36</code>"]
  nf50bae2a["lean-receipt.json#87<br/><code>f50bae2a</code>"]
  nbcfcf205["lean-receipt.json#88<br/><code>bcfcf205</code>"]
  n6ca69d8b["lean-receipt.json#89<br/><code>6ca69d8b</code>"]
  n1a9d8350["lean-receipt.json#90<br/><code>1a9d8350</code>"]
  n88c4c536["lean-receipt.json#91<br/><code>88c4c536</code>"]
  n01ebb8f0["lean-receipt.json#92<br/><code>01ebb8f0</code>"]
  n272991f9["lean-receipt.json#93<br/><code>272991f9</code>"]
  n46182109["lean-receipt.json#94<br/><code>46182109</code>"]
  n7fb48d1a["lean-receipt.json#95<br/><code>7fb48d1a</code>"]
  nf617d85d["lean-receipt.json#96<br/><code>f617d85d</code>"]
  nc24d28a9["lean-receipt.json#97<br/><code>c24d28a9</code>"]
  n53ffb3fc["lean-receipt.json#98<br/><code>53ffb3fc</code>"]
  n0532b6f2["lean-receipt.json#99<br/><code>0532b6f2</code>"]
  n37969ef0["lean-receipt.json#100<br/><code>37969ef0</code>"]
  n6e587924["lean-receipt.json#101<br/><code>6e587924</code>"]
  n1fa18c70["lean-receipt.json#102<br/><code>1fa18c70</code>"]
  n20aad8c0["lean-receipt.json#103<br/><code>20aad8c0</code>"]
  n24a803ea["lean-receipt.json#104<br/><code>24a803ea</code>"]
  nd3ce8277["lean-receipt.json#105<br/><code>d3ce8277</code>"]
  nef527c09["lean-receipt.json#106<br/><code>ef527c09</code>"]
  n3cafa006["lean-receipt.json#107<br/><code>3cafa006</code>"]
  n49472059["lean-receipt.json#108<br/><code>49472059</code>"]
  ndafa251b["lean-receipt.json#109<br/><code>dafa251b</code>"]
  nf23e1f10["lean-receipt.json#110<br/><code>f23e1f10</code>"]
  nbe641e74["lean-receipt.json#111<br/><code>be641e74</code>"]
  n9794ab7c["lean-receipt.json#112<br/><code>9794ab7c</code>"]
  n1ecedb15["lean-receipt.json#113<br/><code>1ecedb15</code>"]
  ncc5cf60c["lean-receipt.json#114<br/><code>cc5cf60c</code>"]
  n372507f9["lean-receipt.json#115<br/><code>372507f9</code>"]
  nb78a5b2c["lean-receipt.json#116<br/><code>b78a5b2c</code>"]
  n2c46f747["lean-receipt.json#117<br/><code>2c46f747</code>"]
  n7029b29f["lean-receipt.json#118<br/><code>7029b29f</code>"]
  n0e72fee8["lean-receipt.json#119<br/><code>0e72fee8</code>"]
  n474030b2["lean-receipt.json#120<br/><code>474030b2</code>"]
  n46151703["lean-receipt.json#121<br/><code>46151703</code>"]
  nad8e4093["lean-receipt.json#122<br/><code>ad8e4093</code>"]
  n4bcf9102["lean-receipt.json#123<br/><code>4bcf9102</code>"]
  n68f41032["payload-cf-receipt.json<br/><code>68f41032</code>"]
  nfe17db1e["percall-receipt.json<br/><code>fe17db1e</code>"]
  nfac777df["refusals-receipt.json<br/><code>fac777df</code>"]
  n40960a8b["test-receipt.json<br/><code>40960a8b</code>"]
  n49d1313d["test-receipt.json#0<br/><code>49d1313d</code>"]
  n6c5631f0["test-receipt.json#1<br/><code>6c5631f0</code>"]
  n7a3f5f48["test-receipt.json#2<br/><code>7a3f5f48</code>"]
  nf062ceef["test-receipt.json#3<br/><code>f062ceef</code>"]
  n34095074["test-receipt.json#4<br/><code>34095074</code>"]
  n92c539f5["test-receipt.json#5<br/><code>92c539f5</code>"]
  n2664443d["test-receipt.json#6<br/><code>2664443d</code>"]
  n7b1c17d2["test-receipt.json#7<br/><code>7b1c17d2</code>"]
  n34f0c429["test-receipt.json#8<br/><code>34f0c429</code>"]
  n5eb949a8["test-receipt.json#9<br/><code>5eb949a8</code>"]
  n6062d7b5["test-receipt.json#10<br/><code>6062d7b5</code>"]
  n1a4a2c6c["walls-receipt.json<br/><code>1a4a2c6c</code>"]
  n27149ff6["readme<br/><code>27149ff6</code>"]
  n21a3bbad --> n6b829f64
  n6b829f64 --> n6e7cd9e8
  n6b829f64 --> nb1503328
  n6b829f64 --> nb3723214
  n6b829f64 --> ne370c116
  n6b829f64 --> n3d08b606
  n6b829f64 --> nc6b0cc3e
  n6b829f64 --> neb0d472f
  n6b829f64 --> nc2f1b53e
  n6b829f64 --> nae1b35dc
  n6b829f64 --> n7637f12a
  n6b829f64 --> n6c870ee9
  n6b829f64 --> n2f711c0b
  n6b829f64 --> nafcaf4b1
  n6b829f64 --> n8e163d13
  n6b829f64 --> n7d9ffbc7
  n6b829f64 --> n7394ff98
  n6b829f64 --> n6e39a509
  n6b829f64 --> nc0896775
  n6b829f64 --> n210ec77a
  n6b829f64 --> nf2144e49
  n6b829f64 --> n51daaa63
  n6b829f64 --> n6d9944be
  n6b829f64 --> n0d8884f6
  n6b829f64 --> n47570be1
  n6b829f64 --> n40eb1d34
  n6b829f64 --> nfa724151
  n6b829f64 --> n9430dc0d
  n6b829f64 --> n9ea1c2b6
  n6b829f64 --> n6d928d3f
  n6b829f64 --> n0f4fbcfc
  n21a3bbad --> n64bb7d6b
  n21a3bbad --> n143d49b7
  n21a3bbad --> n42c006ec
  n42c006ec --> nc6ab8ca3
  n42c006ec --> nb224151f
  n42c006ec --> nb880ecd6
  n42c006ec --> n4e291709
  n42c006ec --> n1a5ee391
  n42c006ec --> n074a7e76
  n42c006ec --> nde7e11ec
  n42c006ec --> nd7ef8c1e
  n42c006ec --> ndbee1d09
  n42c006ec --> n8e9d1e56
  n42c006ec --> nea64a7e8
  n42c006ec --> n77885898
  n42c006ec --> na71bdefe
  n42c006ec --> n59811a79
  n42c006ec --> nfd45fc97
  n42c006ec --> n776549b0
  n42c006ec --> nf97e2e46
  n42c006ec --> nf45f69b0
  n42c006ec --> n475b6b7f
  n42c006ec --> n3d723211
  n42c006ec --> nd8bac186
  n42c006ec --> n47940f55
  n42c006ec --> n0c644df6
  n42c006ec --> n578519e7
  n42c006ec --> n15cd92a4
  n42c006ec --> n06310739
  n42c006ec --> nd5fff6e1
  n42c006ec --> n7993232a
  n42c006ec --> n0e9ea1c4
  n42c006ec --> n60b871b7
  n42c006ec --> nff81f686
  n42c006ec --> n38ed1e0d
  n42c006ec --> n032d34a4
  n42c006ec --> n42931574
  n42c006ec --> n76d49d15
  n42c006ec --> n81d4490a
  n42c006ec --> n87d471fe
  n42c006ec --> n9b177ca6
  n42c006ec --> n75b7d20e
  n42c006ec --> n8321d667
  n42c006ec --> n12dc15fe
  n42c006ec --> n71cf263f
  n42c006ec --> n1a7fbbce
  n42c006ec --> nb50e9760
  n42c006ec --> n46015b27
  n42c006ec --> n0d680e37
  n42c006ec --> nbbff9bea
  n42c006ec --> ne6543052
  n42c006ec --> n94fcba5b
  n42c006ec --> nd14d4653
  n42c006ec --> n4a8c48bd
  n42c006ec --> naa1f1968
  n42c006ec --> naa380c08
  n42c006ec --> n9d513145
  n42c006ec --> n94ec2efe
  n42c006ec --> na09caebe
  n42c006ec --> nc29b895a
  n42c006ec --> n58ab49ce
  n42c006ec --> n63ec8432
  n42c006ec --> n76b4e993
  n42c006ec --> n21db09ac
  n42c006ec --> nc7a5d86e
  n42c006ec --> n4f7fbdba
  n42c006ec --> ned5d96a8
  n42c006ec --> nbd9729cb
  n42c006ec --> n27d6efc2
  n42c006ec --> n029da78e
  n42c006ec --> n9ad558de
  n42c006ec --> necfa3ede
  n42c006ec --> na27a9c60
  n42c006ec --> n56436aee
  n42c006ec --> nd4461990
  n42c006ec --> n48a17571
  n21a3bbad --> naaea1a20
  n21a3bbad --> n59f0cd85
  n21a3bbad --> n572d116a
  n572d116a --> n05802627
  n572d116a --> n8117d057
  n572d116a --> n1a7a0083
  n572d116a --> n040b3d2b
  n572d116a --> n6f3f2738
  n572d116a --> n5905783a
  n572d116a --> n47bfbeb1
  n572d116a --> ne8d1dd98
  n572d116a --> nb8ebd111
  n572d116a --> nc9f55979
  n572d116a --> n5c3f5630
  n572d116a --> n96d36eb5
  n572d116a --> n7299da2d
  n572d116a --> n94a82dbb
  n572d116a --> n726b0cca
  n572d116a --> n4635b29a
  n572d116a --> nbea18815
  n572d116a --> n93acb9b8
  n572d116a --> n921a2803
  n572d116a --> na792e8e6
  n572d116a --> n7151253b
  n572d116a --> nbf4db2f2
  n572d116a --> n1931329c
  n572d116a --> nd7512384
  n572d116a --> n0d77557e
  n572d116a --> n9fc39793
  n572d116a --> n977ee823
  n572d116a --> nca9e3936
  n572d116a --> n01f6cfda
  n572d116a --> n6a9fd283
  n572d116a --> nf62ef748
  n572d116a --> n1261aeb5
  n572d116a --> n0853c7c6
  n572d116a --> n15d1a937
  n572d116a --> n49873db4
  n572d116a --> n66627412
  n572d116a --> n661f50af
  n572d116a --> n1cd4167c
  n572d116a --> nc2a6c93c
  n572d116a --> na62c4714
  n572d116a --> nc4f87feb
  n572d116a --> na603b582
  n572d116a --> n4221b325
  n572d116a --> n65f98137
  n572d116a --> na75b45c3
  n572d116a --> n35fbaa58
  n572d116a --> n0a3610fd
  n572d116a --> nade672fa
  n572d116a --> n1f77e899
  n572d116a --> ne1d876f7
  n572d116a --> n4a0722ef
  n572d116a --> n1dc67335
  n572d116a --> n60695f5a
  n572d116a --> ne89ccccd
  n572d116a --> nee9a6073
  n572d116a --> n6135cf12
  n572d116a --> n4be5080e
  n572d116a --> n711ee845
  n572d116a --> n8a4fb4cb
  n572d116a --> n3d30607f
  n572d116a --> nab6fa770
  n572d116a --> nb922b2bf
  n572d116a --> ncb9b43c5
  n572d116a --> nbe6ed065
  n572d116a --> n4ac266b4
  n572d116a --> n583d8a92
  n572d116a --> n8ffc30a5
  n572d116a --> nfd49d851
  n572d116a --> n0bfe829e
  n572d116a --> n31f6f846
  n572d116a --> nfd31145f
  n572d116a --> n3be77f8f
  n572d116a --> n979f803b
  n572d116a --> na8a5b2c9
  n572d116a --> n446e1362
  n572d116a --> ndad269d1
  n572d116a --> n6bb96ef7
  n572d116a --> n1aa55f7a
  n572d116a --> n138a647c
  n572d116a --> naf8df62e
  n572d116a --> nb9547432
  n572d116a --> n4ba776cb
  n572d116a --> n2a1e9d0a
  n572d116a --> n4ea5b010
  n572d116a --> n1f6b9d43
  n572d116a --> ndbc01685
  n572d116a --> n4ba12b36
  n572d116a --> nf50bae2a
  n572d116a --> nbcfcf205
  n572d116a --> n6ca69d8b
  n572d116a --> n1a9d8350
  n572d116a --> n88c4c536
  n572d116a --> n01ebb8f0
  n572d116a --> n272991f9
  n572d116a --> n46182109
  n572d116a --> n7fb48d1a
  n572d116a --> nf617d85d
  n572d116a --> nc24d28a9
  n572d116a --> n53ffb3fc
  n572d116a --> n0532b6f2
  n572d116a --> n37969ef0
  n572d116a --> n6e587924
  n572d116a --> n1fa18c70
  n572d116a --> n20aad8c0
  n572d116a --> n24a803ea
  n572d116a --> nd3ce8277
  n572d116a --> nef527c09
  n572d116a --> n3cafa006
  n572d116a --> n49472059
  n572d116a --> ndafa251b
  n572d116a --> nf23e1f10
  n572d116a --> nbe641e74
  n572d116a --> n9794ab7c
  n572d116a --> n1ecedb15
  n572d116a --> ncc5cf60c
  n572d116a --> n372507f9
  n572d116a --> nb78a5b2c
  n572d116a --> n2c46f747
  n572d116a --> n7029b29f
  n572d116a --> n0e72fee8
  n572d116a --> n474030b2
  n572d116a --> n46151703
  n572d116a --> nad8e4093
  n572d116a --> n4bcf9102
  n21a3bbad --> n68f41032
  n21a3bbad --> nfe17db1e
  n21a3bbad --> nfac777df
  n21a3bbad --> n40960a8b
  n40960a8b --> n49d1313d
  n40960a8b --> n6c5631f0
  n40960a8b --> n7a3f5f48
  n40960a8b --> nf062ceef
  n40960a8b --> n34095074
  n40960a8b --> n92c539f5
  n40960a8b --> n2664443d
  n40960a8b --> n7b1c17d2
  n40960a8b --> n34f0c429
  n40960a8b --> n5eb949a8
  n40960a8b --> n6062d7b5
  n21a3bbad --> n1a4a2c6c
  n21a3bbad --> n27149ff6
```

| node | receipt uuid | referrer | payload fold | seq |
|---|---|---|---|---|
| root | `21a3bbad-10b4-8e1f-812f-35f305a9ebe4` | `3028272e` | `bde51f25d9e4c220` | 0 |
| cross-receipt.json | `6b829f64-9745-860b-8ac8-f6a3de7e32df` | `21a3bbad` | `32e33b4efc02552d` | 1 |
| cross-receipt.json#0 | `6e7cd9e8-53a2-893a-94a0-96802426ece1` | `6b829f64` | `1dfb50c09d3ec562` | 2 |
| cross-receipt.json#1 | `b1503328-cc1d-8310-b747-5c549f522e8c` | `6b829f64` | `71cd4b0253241eba` | 3 |
| cross-receipt.json#2 | `b3723214-49e8-8068-9e55-878773215ea8` | `6b829f64` | `d395906a7c1ca3bd` | 4 |
| cross-receipt.json#3 | `e370c116-81ec-8ac5-808c-2fb8372a4ca6` | `6b829f64` | `6d6d0a981d52ac76` | 5 |
| cross-receipt.json#4 | `3d08b606-33cc-8442-a4ed-65bbc52b03d0` | `6b829f64` | `3206e3e260b0bda7` | 6 |
| cross-receipt.json#5 | `c6b0cc3e-77f0-8f84-9a46-3727e599817e` | `6b829f64` | `15acf0a0cff5c260` | 7 |
| cross-receipt.json#6 | `eb0d472f-6db0-81e9-adb5-b7b021f2808e` | `6b829f64` | `15196e19197c8657` | 8 |
| cross-receipt.json#7 | `c2f1b53e-c51d-80d0-8e02-0a373b0e19bf` | `6b829f64` | `c63f9497ab57fde9` | 9 |
| cross-receipt.json#8 | `ae1b35dc-f18b-8388-81b6-91e8fdb27220` | `6b829f64` | `e153a0b9425f5a0a` | 10 |
| cross-receipt.json#9 | `7637f12a-a02d-8164-9ba2-19d5ec68800c` | `6b829f64` | `da63fe824b42d3b9` | 11 |
| cross-receipt.json#10 | `6c870ee9-0bff-8089-ae77-7fae998e1b4c` | `6b829f64` | `30617b9216899d69` | 12 |
| cross-receipt.json#11 | `2f711c0b-d05f-8830-8d1d-0ca4f341bdfd` | `6b829f64` | `e5d9a81caa284bd2` | 13 |
| cross-receipt.json#12 | `afcaf4b1-72b3-89a8-9308-b0e1287144ae` | `6b829f64` | `c926f909137e13ea` | 14 |
| cross-receipt.json#13 | `8e163d13-7874-8c54-a29c-1ddbd1b37b0e` | `6b829f64` | `970496b026f43786` | 15 |
| cross-receipt.json#14 | `7d9ffbc7-236d-8ca6-adb1-8e3b92746467` | `6b829f64` | `eddfd8ec84208444` | 16 |
| cross-receipt.json#15 | `7394ff98-9e4c-8ff7-bc21-e362aac8ec96` | `6b829f64` | `c635847ade052b98` | 17 |
| cross-receipt.json#16 | `6e39a509-558e-83a4-b026-2f39685ba55d` | `6b829f64` | `e73fd7a6d186d5b9` | 18 |
| cross-receipt.json#17 | `c0896775-54dd-8946-b22a-8647c8ad665e` | `6b829f64` | `488374c9d21d1916` | 19 |
| cross-receipt.json#18 | `210ec77a-f244-8008-be81-01536e73d461` | `6b829f64` | `5a3a20319bd79246` | 20 |
| cross-receipt.json#19 | `f2144e49-8d2a-85d6-9b71-f631e73b3d1f` | `6b829f64` | `9722a986196949c6` | 21 |
| cross-receipt.json#20 | `51daaa63-2716-8e37-8487-37a15a85b690` | `6b829f64` | `91ee2fdc046a71f2` | 22 |
| cross-receipt.json#21 | `6d9944be-bfd6-8130-bacb-92a272210cce` | `6b829f64` | `5464a03fab9710c1` | 23 |
| cross-receipt.json#22 | `0d8884f6-bfb8-8a52-ba71-9e15128826e6` | `6b829f64` | `7ef706f14b351d5e` | 24 |
| cross-receipt.json#23 | `47570be1-0a86-8e11-99bd-56c2e2d98eac` | `6b829f64` | `38fbb18b1e27788c` | 25 |
| cross-receipt.json#24 | `40eb1d34-7a9b-8263-ba35-3761630b1b8c` | `6b829f64` | `740b3c309e28316f` | 26 |
| cross-receipt.json#25 | `fa724151-b389-805a-b917-bff8e11c02bf` | `6b829f64` | `e90b89ce056c1a01` | 27 |
| cross-receipt.json#26 | `9430dc0d-8297-8427-b51e-234c67260be1` | `6b829f64` | `f1e15ae62cdf1e35` | 28 |
| cross-receipt.json#27 | `9ea1c2b6-ff1d-822d-8478-c2c44bc6303a` | `6b829f64` | `d1ffa93bf956431e` | 29 |
| cross-receipt.json#28 | `6d928d3f-660a-846e-8b34-9541a6ba2595` | `6b829f64` | `d5266feaca6b7beb` | 30 |
| cross-receipt.json#29 | `0f4fbcfc-3769-8d5e-ad21-2c6dd442dd9b` | `6b829f64` | `960c32a22f42e091` | 31 |
| debts-receipt.json | `64bb7d6b-b066-80b1-b471-35788548f0bd` | `21a3bbad` | `ddb0d39a20dd9254` | 32 |
| flaws-receipt.json | `143d49b7-09d0-8c57-8592-af2a15db6965` | `21a3bbad` | `4c375110f22b54d5` | 33 |
| formulas-receipt.json | `42c006ec-814b-850b-9ead-70e21afc06e9` | `21a3bbad` | `391b8012eadae1b1` | 34 |
| formulas-receipt.json#0 | `c6ab8ca3-3ef6-816a-9094-1da7e6b8a357` | `42c006ec` | `228bbc06405d7937` | 35 |
| formulas-receipt.json#1 | `b224151f-3b41-8492-a42d-ba72d790ef59` | `42c006ec` | `a4b327eefda7c3fd` | 36 |
| formulas-receipt.json#2 | `b880ecd6-6012-8eba-bc0c-29d2cd715bcf` | `42c006ec` | `0d0810723e31f1dd` | 37 |
| formulas-receipt.json#3 | `4e291709-5ac2-87cb-9a0a-73052eae0714` | `42c006ec` | `9055270629b9f9f8` | 38 |
| formulas-receipt.json#4 | `1a5ee391-5f61-8954-b0bd-d60d051653f4` | `42c006ec` | `b7fb4da7a9265752` | 39 |
| formulas-receipt.json#5 | `074a7e76-d229-89c9-898b-20960ee29291` | `42c006ec` | `c86392ed8041b0cc` | 40 |
| formulas-receipt.json#6 | `de7e11ec-6a47-845c-a73e-014918dbd044` | `42c006ec` | `07eaca198c1e9c03` | 41 |
| formulas-receipt.json#7 | `d7ef8c1e-90c5-8481-b52f-e09671cfaf3e` | `42c006ec` | `77f0244e53565d49` | 42 |
| formulas-receipt.json#8 | `dbee1d09-0bf5-8425-98d4-0515241b5918` | `42c006ec` | `4c066873d6bbdbcc` | 43 |
| formulas-receipt.json#9 | `8e9d1e56-deb5-826b-a26e-27631aee33ea` | `42c006ec` | `66921593cc44565e` | 44 |
| formulas-receipt.json#10 | `ea64a7e8-b107-8b85-b70d-408a05f28e26` | `42c006ec` | `68e39dc65f164a3d` | 45 |
| formulas-receipt.json#11 | `77885898-5331-8dfe-bc4f-eb858cf34ea7` | `42c006ec` | `a887bafca82d34ef` | 46 |
| formulas-receipt.json#12 | `a71bdefe-696d-8a5b-9e9e-104bcc2991a6` | `42c006ec` | `575536e64cdc2b2d` | 47 |
| formulas-receipt.json#13 | `59811a79-2c85-88f4-bf21-87d3f72214d7` | `42c006ec` | `9434495d4d48b33a` | 48 |
| formulas-receipt.json#14 | `fd45fc97-e27b-8d4a-87f3-d618e872a596` | `42c006ec` | `4f2907317cb50665` | 49 |
| formulas-receipt.json#15 | `776549b0-9e7c-8490-be53-16f403ca66f5` | `42c006ec` | `81fc03a10e669870` | 50 |
| formulas-receipt.json#16 | `f97e2e46-d351-84f0-b2b0-314cf3135bbb` | `42c006ec` | `1a8fed80e3dab0f8` | 51 |
| formulas-receipt.json#17 | `f45f69b0-4589-86af-a21c-a22e6f751a67` | `42c006ec` | `c60111d5252152fc` | 52 |
| formulas-receipt.json#18 | `475b6b7f-e0b6-8439-adfb-6164c55cf599` | `42c006ec` | `e4c2781588b547ef` | 53 |
| formulas-receipt.json#19 | `3d723211-9ce3-8387-9ebd-1de4b95891b1` | `42c006ec` | `8a642c361edae5b5` | 54 |
| formulas-receipt.json#20 | `d8bac186-fc8e-8f5d-8f04-ab5aaab10a04` | `42c006ec` | `ff6d60b33a43e447` | 55 |
| formulas-receipt.json#21 | `47940f55-9020-87e6-a903-17b03dad748a` | `42c006ec` | `7868501f3f36e763` | 56 |
| formulas-receipt.json#22 | `0c644df6-8245-8b02-afbf-989f5ee29858` | `42c006ec` | `acf391c894e20de7` | 57 |
| formulas-receipt.json#23 | `578519e7-3190-85de-91fd-b5acb1eba64f` | `42c006ec` | `18f2218dc5f01405` | 58 |
| formulas-receipt.json#24 | `15cd92a4-55fb-8ec0-bab4-9cd2df6f2a0c` | `42c006ec` | `0f29c3ad359baf2c` | 59 |
| formulas-receipt.json#25 | `06310739-8628-8fe1-afc6-ac4a1f877d9c` | `42c006ec` | `b730efebfcfb57b6` | 60 |
| formulas-receipt.json#26 | `d5fff6e1-2237-80c9-9c6d-838512e7ad58` | `42c006ec` | `a5b1fbf147aa574c` | 61 |
| formulas-receipt.json#27 | `7993232a-00f1-8d89-b55e-9c89cfd660c8` | `42c006ec` | `af805a700026ed6a` | 62 |
| formulas-receipt.json#28 | `0e9ea1c4-849a-88de-9415-d8838fe0f5f1` | `42c006ec` | `4a1de8fd04dd94c9` | 63 |
| formulas-receipt.json#29 | `60b871b7-1527-8efe-850d-abe9b0b76ceb` | `42c006ec` | `8f19d5e53bf7330b` | 64 |
| formulas-receipt.json#30 | `ff81f686-a5e1-807f-a830-999f417f5d15` | `42c006ec` | `d9c118648af5ffd1` | 65 |
| formulas-receipt.json#31 | `38ed1e0d-2589-8f0c-93a0-81f9342323b7` | `42c006ec` | `1f8ad483ee5426a3` | 66 |
| formulas-receipt.json#32 | `032d34a4-7c7f-8a94-82e4-fc66a68754be` | `42c006ec` | `b1a55f198175ab9b` | 67 |
| formulas-receipt.json#33 | `42931574-6cdd-8464-8dab-3fa828e29971` | `42c006ec` | `b37ca1663355014b` | 68 |
| formulas-receipt.json#34 | `76d49d15-0361-8c81-86dc-ce1da6410771` | `42c006ec` | `a0ab991acd3621c4` | 69 |
| formulas-receipt.json#35 | `81d4490a-2abe-8212-ad48-10bf41bc2168` | `42c006ec` | `5de892cc59bc5b15` | 70 |
| formulas-receipt.json#36 | `87d471fe-66f2-8a49-bc2b-055fafcb2cef` | `42c006ec` | `a6cb83e26b1aee54` | 71 |
| formulas-receipt.json#37 | `9b177ca6-7588-861b-b233-19792808f31a` | `42c006ec` | `0081568b80136713` | 72 |
| formulas-receipt.json#38 | `75b7d20e-7244-87f4-8329-e020113e1f6b` | `42c006ec` | `2126a48b1ca9b28a` | 73 |
| formulas-receipt.json#39 | `8321d667-14cd-88b6-94fc-053b945bc6d2` | `42c006ec` | `d74338036b5d8587` | 74 |
| formulas-receipt.json#40 | `12dc15fe-6129-8a37-85e1-d1aae94de6b0` | `42c006ec` | `860e0487b733bb7c` | 75 |
| formulas-receipt.json#41 | `71cf263f-7b2d-8d42-862e-8c335d43b338` | `42c006ec` | `1ad06e958866a3f7` | 76 |
| formulas-receipt.json#42 | `1a7fbbce-eccd-8042-bb26-38edd0702bbb` | `42c006ec` | `5f7b5dd6feb41a76` | 77 |
| formulas-receipt.json#43 | `b50e9760-6fc2-8799-8458-b972623ad325` | `42c006ec` | `b7d62a05a6b19829` | 78 |
| formulas-receipt.json#44 | `46015b27-7b3f-8778-bfa7-c572803f6b40` | `42c006ec` | `fd26bf6ceac5d8d4` | 79 |
| formulas-receipt.json#45 | `0d680e37-21a7-852d-940e-a9aac1e32c18` | `42c006ec` | `04a580e9bd0ddd00` | 80 |
| formulas-receipt.json#46 | `bbff9bea-d5f9-8db6-949a-7d5ea3d70675` | `42c006ec` | `3d7eaeafbcd803f0` | 81 |
| formulas-receipt.json#47 | `e6543052-8c50-8d3a-846e-fa59f1a4410e` | `42c006ec` | `71b7ea9b58e894d4` | 82 |
| formulas-receipt.json#48 | `94fcba5b-e540-84ba-83f5-e441477299be` | `42c006ec` | `1849944a7eda40fd` | 83 |
| formulas-receipt.json#49 | `d14d4653-9f38-8891-984c-deae95579d83` | `42c006ec` | `fadecdaf6f4168b6` | 84 |
| formulas-receipt.json#50 | `4a8c48bd-d125-8dc7-9ea0-3eff6dddd43e` | `42c006ec` | `2da1122feff8eb66` | 85 |
| formulas-receipt.json#51 | `aa1f1968-1446-855a-ab3f-110ea0e0958f` | `42c006ec` | `cc235a90a1fc32c4` | 86 |
| formulas-receipt.json#52 | `aa380c08-c285-8a49-b92f-30f0b7ace7b6` | `42c006ec` | `dab288ebc838662d` | 87 |
| formulas-receipt.json#53 | `9d513145-7a07-803f-bccb-4c95a7ac56a6` | `42c006ec` | `8f612ff41643cf04` | 88 |
| formulas-receipt.json#54 | `94ec2efe-74cc-81bb-b98f-0aea14f4f36f` | `42c006ec` | `648ee8955b159157` | 89 |
| formulas-receipt.json#55 | `a09caebe-e1d3-8ac7-b19b-5b23af15a499` | `42c006ec` | `8b609e3967b2f66a` | 90 |
| formulas-receipt.json#56 | `c29b895a-e7d9-86e9-b301-8d3a8c00d1c6` | `42c006ec` | `852d13a0830bbf24` | 91 |
| formulas-receipt.json#57 | `58ab49ce-1b0c-8b54-9f60-c485836c333a` | `42c006ec` | `292feba0d4c184f5` | 92 |
| formulas-receipt.json#58 | `63ec8432-253a-8136-ae86-26fbfb1437b2` | `42c006ec` | `2027b3bb99f978e9` | 93 |
| formulas-receipt.json#59 | `76b4e993-7026-8cb8-ba5a-898f58950bbe` | `42c006ec` | `3f8d16ce2c529826` | 94 |
| formulas-receipt.json#60 | `21db09ac-aec6-893f-96f8-5261f4311e1a` | `42c006ec` | `f20390472249ece4` | 95 |
| formulas-receipt.json#61 | `c7a5d86e-e14a-8c1f-82c1-9581e92ded2f` | `42c006ec` | `e1614ccc052b69cb` | 96 |
| formulas-receipt.json#62 | `4f7fbdba-828f-8853-8e96-f8fd9303e6fe` | `42c006ec` | `5380536178f7e6a9` | 97 |
| formulas-receipt.json#63 | `ed5d96a8-62d7-88e6-ab86-5e7d3278ae92` | `42c006ec` | `3652d09aac51d6f0` | 98 |
| formulas-receipt.json#64 | `bd9729cb-9013-8b6d-8f23-f2875aca3387` | `42c006ec` | `50ffeaa4ef65d14a` | 99 |
| formulas-receipt.json#65 | `27d6efc2-4c0f-8259-9db2-b4ef0363e9be` | `42c006ec` | `fd1faf331e6af3a9` | 100 |
| formulas-receipt.json#66 | `029da78e-9d9e-8146-8aee-0cc7a5eb4a5a` | `42c006ec` | `1e7c280b0072d0fe` | 101 |
| formulas-receipt.json#67 | `9ad558de-7f08-89d3-a31d-fbc7f9a9eeda` | `42c006ec` | `eb4a8d495031d3a3` | 102 |
| formulas-receipt.json#68 | `ecfa3ede-4efb-81f4-9bce-a35f617428af` | `42c006ec` | `bd5a9046c83be489` | 103 |
| formulas-receipt.json#69 | `a27a9c60-9ac8-8096-800d-498844795670` | `42c006ec` | `687093adfd295eb4` | 104 |
| formulas-receipt.json#70 | `56436aee-a96d-84db-a130-ffd1fb183d11` | `42c006ec` | `4fa9eab16336ce59` | 105 |
| formulas-receipt.json#71 | `d4461990-6f55-8bca-9f03-0659ed19bf2a` | `42c006ec` | `801abb5468825589` | 106 |
| formulas-receipt.json#72 | `48a17571-7ae8-839e-8363-10b2653ff8c3` | `42c006ec` | `0b9db17598ad16a5` | 107 |
| fuse-receipt.json | `aaea1a20-88a3-8fad-824d-feded773d665` | `21a3bbad` | `bb2c4ca42d7d9bcf` | 108 |
| lattice-receipt.json | `59f0cd85-1f8e-8a02-b65b-ed350a9765cc` | `21a3bbad` | `5c9367f8765423b2` | 109 |
| lean-receipt.json | `572d116a-90a4-89e3-87d3-acc026c0ec56` | `21a3bbad` | `7a63d6ab25d404f4` | 110 |
| lean-receipt.json#0 | `05802627-5ef2-84a3-8436-9138a2296738` | `572d116a` | `01a4314334920464` | 111 |
| lean-receipt.json#1 | `8117d057-31a4-8dca-b0eb-e2cb8d283dad` | `572d116a` | `17dd686d646c00c4` | 112 |
| lean-receipt.json#2 | `1a7a0083-27a6-8232-8919-25ab0e534a8f` | `572d116a` | `85559ecfe991db72` | 113 |
| lean-receipt.json#3 | `040b3d2b-cdfd-84f4-89d9-33f6a07acb1d` | `572d116a` | `0b81c75ca7b9f612` | 114 |
| lean-receipt.json#4 | `6f3f2738-4029-851a-a7fe-07f7c2eef6b6` | `572d116a` | `856c8808576cb0ed` | 115 |
| lean-receipt.json#5 | `5905783a-cb4f-81c7-a0f9-178616c700ea` | `572d116a` | `8c42f871b54b87a0` | 116 |
| lean-receipt.json#6 | `47bfbeb1-4e5f-8e56-bc92-94c93af08597` | `572d116a` | `a1bb51780f3b93f2` | 117 |
| lean-receipt.json#7 | `e8d1dd98-f1ae-808c-8c64-428661f5eddd` | `572d116a` | `8c393b1c4570738a` | 118 |
| lean-receipt.json#8 | `b8ebd111-b256-849e-ae17-98428185e5d6` | `572d116a` | `8759e151d526b48d` | 119 |
| lean-receipt.json#9 | `c9f55979-d5f7-809b-8b49-59963ee3669c` | `572d116a` | `ba236e62d0f2e667` | 120 |
| lean-receipt.json#10 | `5c3f5630-93a1-85c6-bde2-22a3df9d87bb` | `572d116a` | `2d3bffa2815b71de` | 121 |
| lean-receipt.json#11 | `96d36eb5-e272-8f58-820f-85fc00958334` | `572d116a` | `3b823db63b5cf251` | 122 |
| lean-receipt.json#12 | `7299da2d-6673-8d47-971e-55a91bb11f43` | `572d116a` | `8198bb405e69ae3d` | 123 |
| lean-receipt.json#13 | `94a82dbb-70ad-86c8-a8a0-9220925d5f5e` | `572d116a` | `fa381a949b4f1709` | 124 |
| lean-receipt.json#14 | `726b0cca-22a8-86a0-a49b-ad6e45f4629e` | `572d116a` | `ccbc114c64b5d7d5` | 125 |
| lean-receipt.json#15 | `4635b29a-4f98-8a02-ac19-c24b452aedc9` | `572d116a` | `ca2d842deaaa3417` | 126 |
| lean-receipt.json#16 | `bea18815-f6e1-8d32-956f-07f0b6cb123d` | `572d116a` | `c26db2931600ef72` | 127 |
| lean-receipt.json#17 | `93acb9b8-74ac-8dd9-a764-67ff55c4b6b9` | `572d116a` | `f1d614a5647be442` | 128 |
| lean-receipt.json#18 | `921a2803-2cc4-8891-9456-73ee774ccec0` | `572d116a` | `20b0af073db0d784` | 129 |
| lean-receipt.json#19 | `a792e8e6-c6a2-8905-91c5-83f899c8031b` | `572d116a` | `661bd8788a9d8fec` | 130 |
| lean-receipt.json#20 | `7151253b-0fe4-8896-a78f-8d3b11842f82` | `572d116a` | `8ae5bda61686e5fe` | 131 |
| lean-receipt.json#21 | `bf4db2f2-0570-8e3e-a311-13913c4fe457` | `572d116a` | `0173e958093f571c` | 132 |
| lean-receipt.json#22 | `1931329c-7ce5-8063-a0b5-9fc9553ddc50` | `572d116a` | `dc9170336312cfdd` | 133 |
| lean-receipt.json#23 | `d7512384-d09f-8261-9078-21f5ab1ed213` | `572d116a` | `a928836e949a3b08` | 134 |
| lean-receipt.json#24 | `0d77557e-6936-8318-9bb1-fcf1de1b080c` | `572d116a` | `892beb0c6c10c5d8` | 135 |
| lean-receipt.json#25 | `9fc39793-ed31-863d-be48-70df9e39e2b5` | `572d116a` | `54b1ada5511adb73` | 136 |
| lean-receipt.json#26 | `977ee823-6d0d-894d-9ec0-c30ae5d8b522` | `572d116a` | `ac8eef3ad8936c18` | 137 |
| lean-receipt.json#27 | `ca9e3936-81cd-805c-b1d4-32b0dc1cb89e` | `572d116a` | `7256c466c3448c3f` | 138 |
| lean-receipt.json#28 | `01f6cfda-0fca-88d5-b487-0bb992a038e6` | `572d116a` | `783f0872ec919aeb` | 139 |
| lean-receipt.json#29 | `6a9fd283-b342-83e6-9115-29d5950e372d` | `572d116a` | `c2625317519e7ea0` | 140 |
| lean-receipt.json#30 | `f62ef748-6acd-8320-b68d-d4d0050b0e36` | `572d116a` | `b828aefe631f023f` | 141 |
| lean-receipt.json#31 | `1261aeb5-7c61-819a-a9ea-96868e615862` | `572d116a` | `28c97dc8c98c1353` | 142 |
| lean-receipt.json#32 | `0853c7c6-d018-8053-a924-ce80377878ed` | `572d116a` | `a50a453d176456ba` | 143 |
| lean-receipt.json#33 | `15d1a937-d689-8444-8ca6-c0cf40d98a2c` | `572d116a` | `e9987eb5bb747c92` | 144 |
| lean-receipt.json#34 | `49873db4-731b-8521-ba25-2de513b053bf` | `572d116a` | `d96c3e86ca8300bb` | 145 |
| lean-receipt.json#35 | `66627412-cb48-8ca5-b6d7-d051209cb81c` | `572d116a` | `026803944de9f8fb` | 146 |
| lean-receipt.json#36 | `661f50af-6a90-84d0-a625-1f335b5064fa` | `572d116a` | `9493a574bb66c834` | 147 |
| lean-receipt.json#37 | `1cd4167c-5f09-89dc-86e8-25c6b66fbb88` | `572d116a` | `e49607ea34f2e643` | 148 |
| lean-receipt.json#38 | `c2a6c93c-aa91-834b-9e0d-e0f2f38dac73` | `572d116a` | `3a9d0303d541d513` | 149 |
| lean-receipt.json#39 | `a62c4714-d4c7-8ea4-a3ae-68db73f93d07` | `572d116a` | `850461c1588ef998` | 150 |
| lean-receipt.json#40 | `c4f87feb-5bf5-89d0-afa5-cf562443ae95` | `572d116a` | `54ced7ee08c43b01` | 151 |
| lean-receipt.json#41 | `a603b582-cad7-8991-adad-49e2ffcb2ec2` | `572d116a` | `883120543a46eeba` | 152 |
| lean-receipt.json#42 | `4221b325-4970-853a-8a43-e75d05c3f081` | `572d116a` | `3ab0cd25a6b5a51c` | 153 |
| lean-receipt.json#43 | `65f98137-d5cf-8bd1-85df-47e6ee91cbeb` | `572d116a` | `f9b7bcab6eb1f2ec` | 154 |
| lean-receipt.json#44 | `a75b45c3-0f72-8e2d-ae9b-8bb1e640a6de` | `572d116a` | `ba26eb0385ad4049` | 155 |
| lean-receipt.json#45 | `35fbaa58-1434-87c7-af2f-c1fa5a295ee5` | `572d116a` | `cdfdeaec366d59a9` | 156 |
| lean-receipt.json#46 | `0a3610fd-43b1-81aa-aa41-318acc96da9d` | `572d116a` | `a3f34c2b09cbdc81` | 157 |
| lean-receipt.json#47 | `ade672fa-7d31-80b3-9c68-49f636442a9e` | `572d116a` | `fa828c0c9002434a` | 158 |
| lean-receipt.json#48 | `1f77e899-f46d-8b15-b901-8013f8527a9a` | `572d116a` | `390ee6112bc84229` | 159 |
| lean-receipt.json#49 | `e1d876f7-31a9-8a99-900b-5207c9ae8b22` | `572d116a` | `14e7224d07b82fe5` | 160 |
| lean-receipt.json#50 | `4a0722ef-9f5b-8093-bfae-14683e8727b5` | `572d116a` | `a26d61f94731765b` | 161 |
| lean-receipt.json#51 | `1dc67335-3f7f-8a92-ab4f-7135e065bed8` | `572d116a` | `0606ba04128bc864` | 162 |
| lean-receipt.json#52 | `60695f5a-4b9a-80d1-8583-8a45327d9597` | `572d116a` | `d8fe7dee19a9eca9` | 163 |
| lean-receipt.json#53 | `e89ccccd-e8ee-89ad-a79a-7f0a7f744509` | `572d116a` | `5e9815aaca739805` | 164 |
| lean-receipt.json#54 | `ee9a6073-a284-8f86-be9f-ae20fe6e1355` | `572d116a` | `fca5ef45f516834b` | 165 |
| lean-receipt.json#55 | `6135cf12-0eab-83aa-a98c-dbc4e60f75be` | `572d116a` | `4e0f8d28c2a80cb1` | 166 |
| lean-receipt.json#56 | `4be5080e-3fc0-8e86-9e0a-5b10e7a51c4f` | `572d116a` | `bddfe267a640156c` | 167 |
| lean-receipt.json#57 | `711ee845-6b52-859b-a086-6aeff2bbfb0f` | `572d116a` | `aaca8fa141b1b164` | 168 |
| lean-receipt.json#58 | `8a4fb4cb-e47a-8d21-8329-17e9e504f9ea` | `572d116a` | `de9c1d0eb319845f` | 169 |
| lean-receipt.json#59 | `3d30607f-1f69-86b2-8780-81803165e439` | `572d116a` | `5ad4efe87055dad6` | 170 |
| lean-receipt.json#60 | `ab6fa770-0a2d-8f26-832e-aead40e30334` | `572d116a` | `21f8222a910896f8` | 171 |
| lean-receipt.json#61 | `b922b2bf-8df0-8e01-99c4-b074c61dc421` | `572d116a` | `9ab521ab8bfd2c30` | 172 |
| lean-receipt.json#62 | `cb9b43c5-4e1e-89a8-a26e-8c2692d70174` | `572d116a` | `97f276540373c55c` | 173 |
| lean-receipt.json#63 | `be6ed065-fba3-8494-a52b-3585cc1b9d62` | `572d116a` | `433fae11c15a3406` | 174 |
| lean-receipt.json#64 | `4ac266b4-dcae-8911-aa44-6adbee928026` | `572d116a` | `99f6f1bba698c440` | 175 |
| lean-receipt.json#65 | `583d8a92-d011-888b-bba2-d71e2803d614` | `572d116a` | `9f74c15228e068ae` | 176 |
| lean-receipt.json#66 | `8ffc30a5-c71c-85a3-a6c1-6663d50e06a5` | `572d116a` | `50d88d048369584c` | 177 |
| lean-receipt.json#67 | `fd49d851-8239-8ec8-9e1b-0be55371f218` | `572d116a` | `89f9254372ae56a4` | 178 |
| lean-receipt.json#68 | `0bfe829e-717f-8167-939e-c31c24cddade` | `572d116a` | `019312acb7ec2b4b` | 179 |
| lean-receipt.json#69 | `31f6f846-2d14-89d5-9fb8-462a3cb247dd` | `572d116a` | `09fe6367b5d53bf0` | 180 |
| lean-receipt.json#70 | `fd31145f-94b6-8129-8b62-f39f26be237e` | `572d116a` | `228f135985843f8b` | 181 |
| lean-receipt.json#71 | `3be77f8f-9144-828d-9bf6-5d2c35ab68ce` | `572d116a` | `43d4a9af3eae5238` | 182 |
| lean-receipt.json#72 | `979f803b-907b-8c8d-bce6-e9955a098bbd` | `572d116a` | `c48f727b686daaaa` | 183 |
| lean-receipt.json#73 | `a8a5b2c9-7952-89be-932b-7f992ee769f5` | `572d116a` | `e948e238756c4b88` | 184 |
| lean-receipt.json#74 | `446e1362-f0f9-851b-be7f-c74d8363bf15` | `572d116a` | `97efe68b81d61976` | 185 |
| lean-receipt.json#75 | `dad269d1-0fcb-8fe4-a750-cebda88748f9` | `572d116a` | `9bff2b6d5fc53087` | 186 |
| lean-receipt.json#76 | `6bb96ef7-27a0-8012-ae0f-37482e0f4252` | `572d116a` | `f7c370cf81952879` | 187 |
| lean-receipt.json#77 | `1aa55f7a-ce4d-8378-a913-81d6aec5de9e` | `572d116a` | `d3ac9515015a7683` | 188 |
| lean-receipt.json#78 | `138a647c-0830-876b-8a48-acfd87a08579` | `572d116a` | `e39144dd650da2d3` | 189 |
| lean-receipt.json#79 | `af8df62e-1f34-8bbb-899f-1fff22e9b7d2` | `572d116a` | `13aa26d4330f37b7` | 190 |
| lean-receipt.json#80 | `b9547432-0974-84ab-a260-940f2e11b8d5` | `572d116a` | `6fd3a89255a92ed8` | 191 |
| lean-receipt.json#81 | `4ba776cb-8eb2-862b-b0ca-d6251220413a` | `572d116a` | `2150be74f267d805` | 192 |
| lean-receipt.json#82 | `2a1e9d0a-6ef0-8b7e-9410-62454cd15487` | `572d116a` | `ca40f3358e8ba4a4` | 193 |
| lean-receipt.json#83 | `4ea5b010-cbc5-880c-8ee3-01afb601f27d` | `572d116a` | `cd77c6f87b5b1064` | 194 |
| lean-receipt.json#84 | `1f6b9d43-9db3-8c7c-9b99-e276bc07a5d8` | `572d116a` | `7013fccd8490dad7` | 195 |
| lean-receipt.json#85 | `dbc01685-a6a0-81bd-9f80-62946fd805f7` | `572d116a` | `7502a7db02d5a467` | 196 |
| lean-receipt.json#86 | `4ba12b36-9567-8cd5-a80f-f9d703d85167` | `572d116a` | `d8ed6351f82dc020` | 197 |
| lean-receipt.json#87 | `f50bae2a-8ad8-8e76-87d7-627e5975bdb2` | `572d116a` | `87ad43e6d9e74af4` | 198 |
| lean-receipt.json#88 | `bcfcf205-95f0-8810-aab0-840c7eae0eda` | `572d116a` | `29a1ce5eccc794cd` | 199 |
| lean-receipt.json#89 | `6ca69d8b-58ff-839a-aacf-f0377694f389` | `572d116a` | `917a754ef7ded231` | 200 |
| lean-receipt.json#90 | `1a9d8350-7695-820d-9235-41ddb024941b` | `572d116a` | `2ddbc9e72c5863a3` | 201 |
| lean-receipt.json#91 | `88c4c536-e467-8110-bc4f-03a61e11c67e` | `572d116a` | `19e70810b6c0569e` | 202 |
| lean-receipt.json#92 | `01ebb8f0-390e-82f8-a9b6-de7ac01fe565` | `572d116a` | `ab2dc0ed36085aae` | 203 |
| lean-receipt.json#93 | `272991f9-a109-8872-8a7f-a2a772b22e9a` | `572d116a` | `6b6a512c4de306e7` | 204 |
| lean-receipt.json#94 | `46182109-7752-8d2f-9335-c68d6348ce8a` | `572d116a` | `8cc93ec2a2c3b4c1` | 205 |
| lean-receipt.json#95 | `7fb48d1a-c802-8854-8505-7bf30ab045e6` | `572d116a` | `4da17eb3cca04d6f` | 206 |
| lean-receipt.json#96 | `f617d85d-8276-8ae4-8875-1a4c14cbd495` | `572d116a` | `cca2e313bbad6348` | 207 |
| lean-receipt.json#97 | `c24d28a9-0aeb-8986-8f79-b985a8203c3a` | `572d116a` | `178311578707a3d9` | 208 |
| lean-receipt.json#98 | `53ffb3fc-0afc-8a9c-8488-0036023aaeed` | `572d116a` | `d6aad521dd3822c7` | 209 |
| lean-receipt.json#99 | `0532b6f2-29e5-887c-8f5f-f74078a015e6` | `572d116a` | `a558c1105bcf6999` | 210 |
| lean-receipt.json#100 | `37969ef0-734a-88e1-8f2b-c84cc1686bc0` | `572d116a` | `7002d9a2943b4233` | 211 |
| lean-receipt.json#101 | `6e587924-0e32-822e-a43f-d1ffda6f41af` | `572d116a` | `af05078facef6371` | 212 |
| lean-receipt.json#102 | `1fa18c70-748f-87cd-a1e2-662af6539b85` | `572d116a` | `d440e12709b21f65` | 213 |
| lean-receipt.json#103 | `20aad8c0-26cf-8d18-8b53-0c5a258b354d` | `572d116a` | `4a5dc765b0ae881a` | 214 |
| lean-receipt.json#104 | `24a803ea-5304-8b0e-ab68-97418b720dad` | `572d116a` | `6e33961b381f1b24` | 215 |
| lean-receipt.json#105 | `d3ce8277-fdf1-8702-829e-d81786146c08` | `572d116a` | `8995d8a066b7efef` | 216 |
| lean-receipt.json#106 | `ef527c09-0f58-8e34-9e4d-db720c329ddd` | `572d116a` | `ee05cc004c566b7d` | 217 |
| lean-receipt.json#107 | `3cafa006-1e52-8af4-a8f8-f9a43b4f3cb5` | `572d116a` | `4a5f92880000ec12` | 218 |
| lean-receipt.json#108 | `49472059-3456-8078-a62b-93514b31e645` | `572d116a` | `673fccabf7917e43` | 219 |
| lean-receipt.json#109 | `dafa251b-87ed-8361-848e-0b757adc764b` | `572d116a` | `7e721ac4c1f5636e` | 220 |
| lean-receipt.json#110 | `f23e1f10-97b5-85f9-bc46-52e3d7266478` | `572d116a` | `5104b1b5d221fe0c` | 221 |
| lean-receipt.json#111 | `be641e74-0851-867e-acc9-9efa735904ad` | `572d116a` | `a53e2a3165bc2079` | 222 |
| lean-receipt.json#112 | `9794ab7c-aa34-86ad-88bb-c85d927fdea9` | `572d116a` | `ac11551381559b5d` | 223 |
| lean-receipt.json#113 | `1ecedb15-2af4-8fcd-b4ca-966297ed0fce` | `572d116a` | `1e76aaa529c1faf4` | 224 |
| lean-receipt.json#114 | `cc5cf60c-69ba-8eba-9a57-ca12f701e519` | `572d116a` | `6650de8fa69d0055` | 225 |
| lean-receipt.json#115 | `372507f9-77f3-8c8d-b926-0282c43b712c` | `572d116a` | `45ffdc938f29d266` | 226 |
| lean-receipt.json#116 | `b78a5b2c-8926-84b2-808f-79dbcf68ea06` | `572d116a` | `29720f16131d7884` | 227 |
| lean-receipt.json#117 | `2c46f747-52d7-87fe-99d0-e017377624f8` | `572d116a` | `8f9e22c7e2bea6c9` | 228 |
| lean-receipt.json#118 | `7029b29f-91fe-8480-bf4a-22776305336e` | `572d116a` | `f9363e39d4b6cfec` | 229 |
| lean-receipt.json#119 | `0e72fee8-73a5-8ad9-a95c-bcfabc2e3c4b` | `572d116a` | `123fa2b2b6e380b2` | 230 |
| lean-receipt.json#120 | `474030b2-2c25-8d7b-8b0b-152c2b0b9bb1` | `572d116a` | `df00ee1dd773d8f2` | 231 |
| lean-receipt.json#121 | `46151703-2668-8ef4-a52f-d7973ea9347e` | `572d116a` | `20f85f44fda02861` | 232 |
| lean-receipt.json#122 | `ad8e4093-5eb0-8ab7-ba41-e072b01065e7` | `572d116a` | `040743c9cee1336f` | 233 |
| lean-receipt.json#123 | `4bcf9102-44c4-8a5d-b4f1-1f43656d801c` | `572d116a` | `bfa20fd6cf759420` | 234 |
| payload-cf-receipt.json | `68f41032-d49c-874d-8256-dbf415fb9bbe` | `21a3bbad` | `f62f0aaf7ff26014` | 235 |
| percall-receipt.json | `fe17db1e-eb74-88ce-8447-b0f4c4d819f7` | `21a3bbad` | `bb48a531ebc72170` | 236 |
| refusals-receipt.json | `fac777df-8ec2-8898-b064-4ca8dfeedef3` | `21a3bbad` | `8c5570077f4d6204` | 237 |
| test-receipt.json | `40960a8b-6319-819d-aa40-41710cc48a81` | `21a3bbad` | `4a5cfb5ecff89ea1` | 238 |
| test-receipt.json#0 | `49d1313d-5561-88a6-b2e3-eb7afaf777cd` | `40960a8b` | `9a01ace6de6b54ec` | 239 |
| test-receipt.json#1 | `6c5631f0-ef23-846a-b640-17afe11665f1` | `40960a8b` | `a13d744057ec9cc2` | 240 |
| test-receipt.json#2 | `7a3f5f48-2f99-80d6-b0ea-c020b94c5473` | `40960a8b` | `bbd68eebc2fb3df3` | 241 |
| test-receipt.json#3 | `f062ceef-869c-8ee5-9d13-961266eb0435` | `40960a8b` | `e739f4896d14e203` | 242 |
| test-receipt.json#4 | `34095074-1c51-8310-b5e6-4cc93b18a2a3` | `40960a8b` | `7d78476f346361f5` | 243 |
| test-receipt.json#5 | `92c539f5-dd8d-8bfb-885e-9fb5dfce45aa` | `40960a8b` | `3120a62df82699eb` | 244 |
| test-receipt.json#6 | `2664443d-24aa-8dc4-90f7-2f4d3b4fce8b` | `40960a8b` | `e603dbc8c5889a16` | 245 |
| test-receipt.json#7 | `7b1c17d2-e222-8b3d-97d3-788897ab605c` | `40960a8b` | `09c5ebed7bd28d13` | 246 |
| test-receipt.json#8 | `34f0c429-2368-8550-904b-73157c2d5ce8` | `40960a8b` | `987476006a69a566` | 247 |
| test-receipt.json#9 | `5eb949a8-ac9e-8278-b9ac-040456e730aa` | `40960a8b` | `5d554129661dae60` | 248 |
| test-receipt.json#10 | `6062d7b5-0b3c-864d-b4b5-b97cb2949565` | `40960a8b` | `c25f540b1357461f` | 249 |
| walls-receipt.json | `1a4a2c6c-2aea-832c-8a51-575226f08050` | `21a3bbad` | `46393a1f4c0937d6` | 250 |
| readme | `27149ff6-aabe-8fe8-b77e-78be7caadec0` | `21a3bbad` | `8dd847c9f5d2cc73` | 251 |

Regenerate with `npm run readme` after `npm run build` and the receipt-producing runs; `node scripts/generate-readme.mjs --check`
compares. Documentation: [docs/README.md](docs/README.md). License: CC-BY-NC-ND-4.0.
