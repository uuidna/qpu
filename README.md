# UUIDNA QPU

**Final build receipt** `7bfd814e-9d3d-896e-969b-0d8fccc0333e`

| | |
|---|---|
| version | 1.0.0 |
| commit | `27853c6898f7420c1b2c489794c0fbbf3b1f3be8` (working tree differed from this commit) |
| receipts | 8 files, 44 nodes |
| build stream | length 44, head `7bfd814e-9d3d-896e-969b-0d8fccc0333e`, chain `d360e6276cc92c26`, holds **true** |

Each node is a quantum receipt: its UUID is the RFC 9562 v8 content address of its payload fold and its referrer, and
its referrer is the node above it. Change any receipt's bytes and its node, its file's node, the build stream chain
and this final receipt move; the root moves with the commit.

```mermaid
flowchart TD
  nd7a2ea2b["root<br/><code>d7a2ea2b</code>"]
  n8942a11f["cross-receipt.json<br/><code>8942a11f</code>"]
  n63a32b4c["cross-receipt.json#0<br/><code>63a32b4c</code>"]
  n38c1173c["cross-receipt.json#1<br/><code>38c1173c</code>"]
  naafad0ea["cross-receipt.json#2<br/><code>aafad0ea</code>"]
  n10f23842["cross-receipt.json#3<br/><code>10f23842</code>"]
  n95def5b5["cross-receipt.json#4<br/><code>95def5b5</code>"]
  nd1894229["cross-receipt.json#5<br/><code>d1894229</code>"]
  n78f77a23["cross-receipt.json#6<br/><code>78f77a23</code>"]
  n4ca1b57b["cross-receipt.json#7<br/><code>4ca1b57b</code>"]
  nf1db7be9["cross-receipt.json#8<br/><code>f1db7be9</code>"]
  n267e560a["cross-receipt.json#9<br/><code>267e560a</code>"]
  nfbb84db6["cross-receipt.json#10<br/><code>fbb84db6</code>"]
  n73d1efe9["cross-receipt.json#11<br/><code>73d1efe9</code>"]
  nf0d5ab0c["cross-receipt.json#12<br/><code>f0d5ab0c</code>"]
  nf07a8049["cross-receipt.json#13<br/><code>f07a8049</code>"]
  n18d28870["cross-receipt.json#14<br/><code>18d28870</code>"]
  nec1f76a2["cross-receipt.json#15<br/><code>ec1f76a2</code>"]
  n20fa9b17["cross-receipt.json#16<br/><code>20fa9b17</code>"]
  ndadc2686["cross-receipt.json#17<br/><code>dadc2686</code>"]
  n69655bbd["cross-receipt.json#18<br/><code>69655bbd</code>"]
  nfe664712["cross-receipt.json#19<br/><code>fe664712</code>"]
  n254f18b9["cross-receipt.json#20<br/><code>254f18b9</code>"]
  ndc83e7d4["cross-receipt.json#21<br/><code>dc83e7d4</code>"]
  nb7f0be93["cross-receipt.json#22<br/><code>b7f0be93</code>"]
  n97df0538["debts-receipt.json<br/><code>97df0538</code>"]
  nbe2ac85f["flaws-receipt.json<br/><code>be2ac85f</code>"]
  n397f3036["lattice-receipt.json<br/><code>397f3036</code>"]
  n1a361edf["percall-receipt.json<br/><code>1a361edf</code>"]
  ne819af39["refusals-receipt.json<br/><code>e819af39</code>"]
  n83d1e74c["test-receipt.json<br/><code>83d1e74c</code>"]
  n02d9a643["test-receipt.json#0<br/><code>02d9a643</code>"]
  n876deb1d["test-receipt.json#1<br/><code>876deb1d</code>"]
  nedab3fe7["test-receipt.json#2<br/><code>edab3fe7</code>"]
  n59b71277["test-receipt.json#3<br/><code>59b71277</code>"]
  n5778cf4b["test-receipt.json#4<br/><code>5778cf4b</code>"]
  na9e03134["test-receipt.json#5<br/><code>a9e03134</code>"]
  ne96270ac["test-receipt.json#6<br/><code>e96270ac</code>"]
  n8a47152d["test-receipt.json#7<br/><code>8a47152d</code>"]
  n65f6c884["test-receipt.json#8<br/><code>65f6c884</code>"]
  n270bd0b0["test-receipt.json#9<br/><code>270bd0b0</code>"]
  n763f40a1["test-receipt.json#10<br/><code>763f40a1</code>"]
  n49f105e9["walls-receipt.json<br/><code>49f105e9</code>"]
  n7bfd814e["readme<br/><code>7bfd814e</code>"]
  nd7a2ea2b --> n8942a11f
  n8942a11f --> n63a32b4c
  n8942a11f --> n38c1173c
  n8942a11f --> naafad0ea
  n8942a11f --> n10f23842
  n8942a11f --> n95def5b5
  n8942a11f --> nd1894229
  n8942a11f --> n78f77a23
  n8942a11f --> n4ca1b57b
  n8942a11f --> nf1db7be9
  n8942a11f --> n267e560a
  n8942a11f --> nfbb84db6
  n8942a11f --> n73d1efe9
  n8942a11f --> nf0d5ab0c
  n8942a11f --> nf07a8049
  n8942a11f --> n18d28870
  n8942a11f --> nec1f76a2
  n8942a11f --> n20fa9b17
  n8942a11f --> ndadc2686
  n8942a11f --> n69655bbd
  n8942a11f --> nfe664712
  n8942a11f --> n254f18b9
  n8942a11f --> ndc83e7d4
  n8942a11f --> nb7f0be93
  nd7a2ea2b --> n97df0538
  nd7a2ea2b --> nbe2ac85f
  nd7a2ea2b --> n397f3036
  nd7a2ea2b --> n1a361edf
  nd7a2ea2b --> ne819af39
  nd7a2ea2b --> n83d1e74c
  n83d1e74c --> n02d9a643
  n83d1e74c --> n876deb1d
  n83d1e74c --> nedab3fe7
  n83d1e74c --> n59b71277
  n83d1e74c --> n5778cf4b
  n83d1e74c --> na9e03134
  n83d1e74c --> ne96270ac
  n83d1e74c --> n8a47152d
  n83d1e74c --> n65f6c884
  n83d1e74c --> n270bd0b0
  n83d1e74c --> n763f40a1
  nd7a2ea2b --> n49f105e9
  nd7a2ea2b --> n7bfd814e
```

| node | receipt uuid | referrer | payload fold | seq |
|---|---|---|---|---|
| root | `d7a2ea2b-db0c-853f-894c-10cedd3bd4b1` | `27853c68` | `e4fe0ee14e16f158` | 0 |
| cross-receipt.json | `8942a11f-2218-842d-b591-54bfff6bcc69` | `d7a2ea2b` | `20967f1cc4886764` | 1 |
| cross-receipt.json#0 | `63a32b4c-9cc7-85d3-b9c3-bd7c1918b570` | `8942a11f` | `14432830058e1e46` | 2 |
| cross-receipt.json#1 | `38c1173c-4b14-89d8-8c7a-e3a05d6d38ea` | `8942a11f` | `09410219d171472e` | 3 |
| cross-receipt.json#2 | `aafad0ea-180f-8ead-b79d-e0aed3175833` | `8942a11f` | `e2cac0a5a1701ff8` | 4 |
| cross-receipt.json#3 | `10f23842-5621-8187-a7b4-2eb51dd6df93` | `8942a11f` | `72b0abb676747470` | 5 |
| cross-receipt.json#4 | `95def5b5-c282-84cc-92d7-ba96345c8808` | `8942a11f` | `c1a885b32ef960e5` | 6 |
| cross-receipt.json#5 | `d1894229-e1db-8220-87aa-2f7198308647` | `8942a11f` | `6b591900e22f2ba8` | 7 |
| cross-receipt.json#6 | `78f77a23-68ad-8fe8-8cee-40aa5a2a2086` | `8942a11f` | `ad1fcc55bdfb7a52` | 8 |
| cross-receipt.json#7 | `4ca1b57b-3bd1-84e4-8e33-9030ac37de94` | `8942a11f` | `c27faa42150e6e98` | 9 |
| cross-receipt.json#8 | `f1db7be9-0282-8bb0-bfca-d50c9bf556c8` | `8942a11f` | `294f0992ef5aa44f` | 10 |
| cross-receipt.json#9 | `267e560a-cd88-847b-afe9-b5d7122cad37` | `8942a11f` | `c02f3dc29a4b8ace` | 11 |
| cross-receipt.json#10 | `fbb84db6-fbf6-8539-bbd8-0c605b2e6873` | `8942a11f` | `764468a81718149c` | 12 |
| cross-receipt.json#11 | `73d1efe9-7fe2-8e25-b28a-df202dc850ee` | `8942a11f` | `870f3b1867cf8006` | 13 |
| cross-receipt.json#12 | `f0d5ab0c-62de-875e-8c7b-44db60b38b55` | `8942a11f` | `e3aa4daad4f109db` | 14 |
| cross-receipt.json#13 | `f07a8049-754e-8cb4-ae8a-2fa208698f1b` | `8942a11f` | `0ef75e8dc811861b` | 15 |
| cross-receipt.json#14 | `18d28870-8e20-8ab4-a5c9-73d9811a2807` | `8942a11f` | `87276d09343fa13b` | 16 |
| cross-receipt.json#15 | `ec1f76a2-5391-8fed-b792-dc6617b3c764` | `8942a11f` | `0df990216d41b6e8` | 17 |
| cross-receipt.json#16 | `20fa9b17-5901-8a6e-b584-8959a8df26c3` | `8942a11f` | `d148afcd4838e3b8` | 18 |
| cross-receipt.json#17 | `dadc2686-0a7e-8d08-83c1-5d6819372048` | `8942a11f` | `fc9ca0ae74cb7a8e` | 19 |
| cross-receipt.json#18 | `69655bbd-b177-88a9-a1fe-4ffd20e4d0a9` | `8942a11f` | `58579b18fc23f7ca` | 20 |
| cross-receipt.json#19 | `fe664712-5b32-8456-a646-791798794268` | `8942a11f` | `571b3a1c9d1084ae` | 21 |
| cross-receipt.json#20 | `254f18b9-b34d-85c9-a759-5b3d52672da4` | `8942a11f` | `f892be6f720eced1` | 22 |
| cross-receipt.json#21 | `dc83e7d4-edb2-82dc-a85b-b18cef397d9b` | `8942a11f` | `33be92ef70a7f2c7` | 23 |
| cross-receipt.json#22 | `b7f0be93-3891-8ed0-8b64-d8bc213fe6d4` | `8942a11f` | `2e6b165e813c9a55` | 24 |
| debts-receipt.json | `97df0538-a3f8-8b15-bc5b-414961f28ab3` | `d7a2ea2b` | `de5129853bb193de` | 25 |
| flaws-receipt.json | `be2ac85f-1a1a-8596-9c8a-1971f0526079` | `d7a2ea2b` | `ff955046d9f87003` | 26 |
| lattice-receipt.json | `397f3036-2e77-80d2-9352-a0ed65101c83` | `d7a2ea2b` | `36da43b99a7f4375` | 27 |
| percall-receipt.json | `1a361edf-4a2e-86fd-8f22-889960eef064` | `d7a2ea2b` | `227e095d17f22621` | 28 |
| refusals-receipt.json | `e819af39-eb6c-8d2a-a944-7b739c2319ca` | `d7a2ea2b` | `e0e972028d35f5b2` | 29 |
| test-receipt.json | `83d1e74c-a89b-8e2f-979b-0b9d8c97bfb0` | `d7a2ea2b` | `5fc637f79dfc94eb` | 30 |
| test-receipt.json#0 | `02d9a643-b69c-84fe-b4e0-1ef2dc6942f9` | `83d1e74c` | `8f31e84778031660` | 31 |
| test-receipt.json#1 | `876deb1d-fffc-87d9-8858-326362a8271d` | `83d1e74c` | `da3eb97348e29c82` | 32 |
| test-receipt.json#2 | `edab3fe7-6f4e-842d-af6f-cf6ce536eb64` | `83d1e74c` | `6523d3075b964345` | 33 |
| test-receipt.json#3 | `59b71277-0ed6-8cc9-a427-5b5be95dbe1d` | `83d1e74c` | `34a901af3f06268a` | 34 |
| test-receipt.json#4 | `5778cf4b-c4f8-8937-a53f-20c7e9bf74ce` | `83d1e74c` | `e83367f743ae290e` | 35 |
| test-receipt.json#5 | `a9e03134-5c16-8a18-b54d-c7b02c00c059` | `83d1e74c` | `05903ab5ea276b01` | 36 |
| test-receipt.json#6 | `e96270ac-dc7d-872a-872a-c9d9ae0a1e39` | `83d1e74c` | `6dbdd2e465db81e1` | 37 |
| test-receipt.json#7 | `8a47152d-366c-821f-b7f2-f33b75583d38` | `83d1e74c` | `862a01d23f60c3e6` | 38 |
| test-receipt.json#8 | `65f6c884-7d49-84e4-a8dc-424391ac5840` | `83d1e74c` | `dd8db09b8187d2b5` | 39 |
| test-receipt.json#9 | `270bd0b0-0fc6-89d8-800d-caedcab20c23` | `83d1e74c` | `b8f486e7e88aae90` | 40 |
| test-receipt.json#10 | `763f40a1-762e-89e6-996c-bf910b588be7` | `83d1e74c` | `99bb4c4605f26d4a` | 41 |
| walls-receipt.json | `49f105e9-f341-8bd8-a700-4d2d46d652db` | `d7a2ea2b` | `2a4c3de10ff7f9be` | 42 |
| readme | `7bfd814e-9d3d-896e-969b-0d8fccc0333e` | `d7a2ea2b` | `2e1bf9f0474bffd5` | 43 |

Regenerate with `npm run readme` after `npm run build` and the receipt-producing runs; `node scripts/generate-readme.mjs --check`
compares. Documentation: [docs/README.md](docs/README.md). License: CC-BY-NC-ND-4.0.
