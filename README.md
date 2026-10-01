# UUIDNA QPU

**Final build receipt** `53e2bb5d-f4c1-865e-9aea-408594fa7ee8`

| | |
|---|---|
| version | 1.0.0 |
| commit | `b002d736f92f15edb4f83905d1fdb5abeea1e3a7` |
| receipts | 8 files, 44 nodes |
| build stream | length 44, head `53e2bb5d-f4c1-865e-9aea-408594fa7ee8`, chain `cd3699cd82ac8b14`, holds **true** |

Each node is a quantum receipt: its UUID is the RFC 9562 v8 content address of its payload fold and its referrer, and
its referrer is the node above it. Change any receipt's bytes and its node, its file's node, the build stream chain
and this final receipt move; the root moves with the commit.

```mermaid
flowchart TD
  nb826fee4["root<br/><code>b826fee4</code>"]
  ndf7c9345["cross-receipt.json<br/><code>df7c9345</code>"]
  n556756b2["cross-receipt.json#0<br/><code>556756b2</code>"]
  ncf41ad68["cross-receipt.json#1<br/><code>cf41ad68</code>"]
  nf2a67b11["cross-receipt.json#2<br/><code>f2a67b11</code>"]
  n60a37258["cross-receipt.json#3<br/><code>60a37258</code>"]
  n42718bca["cross-receipt.json#4<br/><code>42718bca</code>"]
  n2438962e["cross-receipt.json#5<br/><code>2438962e</code>"]
  ndd64aade["cross-receipt.json#6<br/><code>dd64aade</code>"]
  n5050d706["cross-receipt.json#7<br/><code>5050d706</code>"]
  n44bd5a4c["cross-receipt.json#8<br/><code>44bd5a4c</code>"]
  n6cd5cfa4["cross-receipt.json#9<br/><code>6cd5cfa4</code>"]
  n13fdb5f2["cross-receipt.json#10<br/><code>13fdb5f2</code>"]
  n0d929086["cross-receipt.json#11<br/><code>0d929086</code>"]
  n44265d79["cross-receipt.json#12<br/><code>44265d79</code>"]
  n986eeddb["cross-receipt.json#13<br/><code>986eeddb</code>"]
  nc77a328b["cross-receipt.json#14<br/><code>c77a328b</code>"]
  n36068536["cross-receipt.json#15<br/><code>36068536</code>"]
  n34df2c1a["cross-receipt.json#16<br/><code>34df2c1a</code>"]
  n2dbe04e9["cross-receipt.json#17<br/><code>2dbe04e9</code>"]
  n1f97bcb9["cross-receipt.json#18<br/><code>1f97bcb9</code>"]
  n13a90b6c["cross-receipt.json#19<br/><code>13a90b6c</code>"]
  n2d7785e7["cross-receipt.json#20<br/><code>2d7785e7</code>"]
  n84785566["cross-receipt.json#21<br/><code>84785566</code>"]
  n58a58d57["cross-receipt.json#22<br/><code>58a58d57</code>"]
  n0d0e026e["debts-receipt.json<br/><code>0d0e026e</code>"]
  n5a3c074d["flaws-receipt.json<br/><code>5a3c074d</code>"]
  nf196d23b["lattice-receipt.json<br/><code>f196d23b</code>"]
  nd1c5c6e1["percall-receipt.json<br/><code>d1c5c6e1</code>"]
  ne8d1ce6d["refusals-receipt.json<br/><code>e8d1ce6d</code>"]
  n48454920["test-receipt.json<br/><code>48454920</code>"]
  nee0d1368["test-receipt.json#0<br/><code>ee0d1368</code>"]
  ndf4b9036["test-receipt.json#1<br/><code>df4b9036</code>"]
  n0870964d["test-receipt.json#2<br/><code>0870964d</code>"]
  nb194b78f["test-receipt.json#3<br/><code>b194b78f</code>"]
  n7fabfe58["test-receipt.json#4<br/><code>7fabfe58</code>"]
  n7a8845ea["test-receipt.json#5<br/><code>7a8845ea</code>"]
  n7a8db162["test-receipt.json#6<br/><code>7a8db162</code>"]
  n1b0580fe["test-receipt.json#7<br/><code>1b0580fe</code>"]
  na6b4f225["test-receipt.json#8<br/><code>a6b4f225</code>"]
  n08da53cf["test-receipt.json#9<br/><code>08da53cf</code>"]
  nfd1b7f2b["test-receipt.json#10<br/><code>fd1b7f2b</code>"]
  n03e9996f["walls-receipt.json<br/><code>03e9996f</code>"]
  n53e2bb5d["readme<br/><code>53e2bb5d</code>"]
  nb826fee4 --> ndf7c9345
  ndf7c9345 --> n556756b2
  ndf7c9345 --> ncf41ad68
  ndf7c9345 --> nf2a67b11
  ndf7c9345 --> n60a37258
  ndf7c9345 --> n42718bca
  ndf7c9345 --> n2438962e
  ndf7c9345 --> ndd64aade
  ndf7c9345 --> n5050d706
  ndf7c9345 --> n44bd5a4c
  ndf7c9345 --> n6cd5cfa4
  ndf7c9345 --> n13fdb5f2
  ndf7c9345 --> n0d929086
  ndf7c9345 --> n44265d79
  ndf7c9345 --> n986eeddb
  ndf7c9345 --> nc77a328b
  ndf7c9345 --> n36068536
  ndf7c9345 --> n34df2c1a
  ndf7c9345 --> n2dbe04e9
  ndf7c9345 --> n1f97bcb9
  ndf7c9345 --> n13a90b6c
  ndf7c9345 --> n2d7785e7
  ndf7c9345 --> n84785566
  ndf7c9345 --> n58a58d57
  nb826fee4 --> n0d0e026e
  nb826fee4 --> n5a3c074d
  nb826fee4 --> nf196d23b
  nb826fee4 --> nd1c5c6e1
  nb826fee4 --> ne8d1ce6d
  nb826fee4 --> n48454920
  n48454920 --> nee0d1368
  n48454920 --> ndf4b9036
  n48454920 --> n0870964d
  n48454920 --> nb194b78f
  n48454920 --> n7fabfe58
  n48454920 --> n7a8845ea
  n48454920 --> n7a8db162
  n48454920 --> n1b0580fe
  n48454920 --> na6b4f225
  n48454920 --> n08da53cf
  n48454920 --> nfd1b7f2b
  nb826fee4 --> n03e9996f
  nb826fee4 --> n53e2bb5d
```

| node | receipt uuid | referrer | payload fold | seq |
|---|---|---|---|---|
| root | `b826fee4-fe9b-8f24-aa6e-4a66abeadc40` | `b002d736` | `fd4a5478c6c12005` | 0 |
| cross-receipt.json | `df7c9345-2e62-8694-8d8c-5b9127fbbd1b` | `b826fee4` | `20967f1cc4886764` | 1 |
| cross-receipt.json#0 | `556756b2-e63a-8a19-b64e-9d586b1eefa9` | `df7c9345` | `14432830058e1e46` | 2 |
| cross-receipt.json#1 | `cf41ad68-0da7-8bb8-b737-49073712840f` | `df7c9345` | `09410219d171472e` | 3 |
| cross-receipt.json#2 | `f2a67b11-fc8a-8ac3-b58b-cb7c7181d132` | `df7c9345` | `e2cac0a5a1701ff8` | 4 |
| cross-receipt.json#3 | `60a37258-6ef1-877d-8054-c5e659858692` | `df7c9345` | `72b0abb676747470` | 5 |
| cross-receipt.json#4 | `42718bca-0a96-8352-92e4-9be0f741bae1` | `df7c9345` | `c1a885b32ef960e5` | 6 |
| cross-receipt.json#5 | `2438962e-5206-82e4-b29c-2cb86c9ba3c6` | `df7c9345` | `6b591900e22f2ba8` | 7 |
| cross-receipt.json#6 | `dd64aade-581b-8fb7-a314-511eb042308b` | `df7c9345` | `ad1fcc55bdfb7a52` | 8 |
| cross-receipt.json#7 | `5050d706-c71f-8164-8cc4-f365d3b7ae8d` | `df7c9345` | `c27faa42150e6e98` | 9 |
| cross-receipt.json#8 | `44bd5a4c-d5fb-8bee-8d66-91dd1fc2c121` | `df7c9345` | `294f0992ef5aa44f` | 10 |
| cross-receipt.json#9 | `6cd5cfa4-e4ce-8331-b915-5c423ef9cf56` | `df7c9345` | `c02f3dc29a4b8ace` | 11 |
| cross-receipt.json#10 | `13fdb5f2-6cbc-8667-b1d9-2065b0e706f2` | `df7c9345` | `764468a81718149c` | 12 |
| cross-receipt.json#11 | `0d929086-fa56-8769-b7de-1a564ca83373` | `df7c9345` | `870f3b1867cf8006` | 13 |
| cross-receipt.json#12 | `44265d79-116b-8596-81ec-88952eff8620` | `df7c9345` | `e3aa4daad4f109db` | 14 |
| cross-receipt.json#13 | `986eeddb-6d4f-8ca1-801f-87ad933642ba` | `df7c9345` | `0ef75e8dc811861b` | 15 |
| cross-receipt.json#14 | `c77a328b-c7dd-8fb0-a60c-6375dda45906` | `df7c9345` | `87276d09343fa13b` | 16 |
| cross-receipt.json#15 | `36068536-d3bd-8dbb-9dcf-41d56fa3c7fd` | `df7c9345` | `0df990216d41b6e8` | 17 |
| cross-receipt.json#16 | `34df2c1a-cae3-801a-ba86-f45b7adbf862` | `df7c9345` | `d148afcd4838e3b8` | 18 |
| cross-receipt.json#17 | `2dbe04e9-ddf7-8d46-915d-1a389d048aa1` | `df7c9345` | `fc9ca0ae74cb7a8e` | 19 |
| cross-receipt.json#18 | `1f97bcb9-53e9-888c-90ed-bd9e595be514` | `df7c9345` | `58579b18fc23f7ca` | 20 |
| cross-receipt.json#19 | `13a90b6c-f49d-84a4-bffd-d4582c4ecdc1` | `df7c9345` | `571b3a1c9d1084ae` | 21 |
| cross-receipt.json#20 | `2d7785e7-ca24-882f-a4e0-585d2d16fabd` | `df7c9345` | `f892be6f720eced1` | 22 |
| cross-receipt.json#21 | `84785566-e5b3-82c9-b9f1-09987a06313a` | `df7c9345` | `33be92ef70a7f2c7` | 23 |
| cross-receipt.json#22 | `58a58d57-0327-8398-abad-198e0655094d` | `df7c9345` | `2e6b165e813c9a55` | 24 |
| debts-receipt.json | `0d0e026e-d594-8095-aee3-2d88c45e7b5d` | `b826fee4` | `de5129853bb193de` | 25 |
| flaws-receipt.json | `5a3c074d-af9a-8f9f-aa8f-a8bf7adfdb0b` | `b826fee4` | `ff955046d9f87003` | 26 |
| lattice-receipt.json | `f196d23b-869b-8a5c-8af5-4a5b64f0a20d` | `b826fee4` | `36da43b99a7f4375` | 27 |
| percall-receipt.json | `d1c5c6e1-8bb0-85b9-91e5-002580bfa83a` | `b826fee4` | `227e095d17f22621` | 28 |
| refusals-receipt.json | `e8d1ce6d-9023-8434-a957-38bdfcb1e540` | `b826fee4` | `e0e972028d35f5b2` | 29 |
| test-receipt.json | `48454920-02fc-8b60-b96a-ef1700191d1e` | `b826fee4` | `5fc637f79dfc94eb` | 30 |
| test-receipt.json#0 | `ee0d1368-3af9-8584-8993-255537a1ebc1` | `48454920` | `8f31e84778031660` | 31 |
| test-receipt.json#1 | `df4b9036-72e5-8119-9eb7-c6ddcb8f8345` | `48454920` | `da3eb97348e29c82` | 32 |
| test-receipt.json#2 | `0870964d-0e46-8bd1-8353-27ae50a21b4c` | `48454920` | `6523d3075b964345` | 33 |
| test-receipt.json#3 | `b194b78f-81bf-8609-ba86-efd652451a45` | `48454920` | `34a901af3f06268a` | 34 |
| test-receipt.json#4 | `7fabfe58-8ef0-8fea-a153-ab3e8b4ed366` | `48454920` | `e83367f743ae290e` | 35 |
| test-receipt.json#5 | `7a8845ea-7bf4-857e-a833-3d026372d221` | `48454920` | `05903ab5ea276b01` | 36 |
| test-receipt.json#6 | `7a8db162-4f18-8f28-adb6-809082d39e81` | `48454920` | `6dbdd2e465db81e1` | 37 |
| test-receipt.json#7 | `1b0580fe-170c-89b1-b08b-9513643c1d90` | `48454920` | `862a01d23f60c3e6` | 38 |
| test-receipt.json#8 | `a6b4f225-257c-8f97-9d83-a6b3164538b8` | `48454920` | `dd8db09b8187d2b5` | 39 |
| test-receipt.json#9 | `08da53cf-dc75-897f-8898-5db2e8c44313` | `48454920` | `b8f486e7e88aae90` | 40 |
| test-receipt.json#10 | `fd1b7f2b-9499-8c01-bdf0-8207fe881bd7` | `48454920` | `99bb4c4605f26d4a` | 41 |
| walls-receipt.json | `03e9996f-214d-8f1f-93a1-f9dfbcd119e5` | `b826fee4` | `2a4c3de10ff7f9be` | 42 |
| readme | `53e2bb5d-f4c1-865e-9aea-408594fa7ee8` | `b826fee4` | `1952de69e1a1b33b` | 43 |

Regenerate with `npm run readme` after `npm run build` and the receipt-producing runs; `node scripts/generate-readme.mjs --check`
compares. Documentation: [docs/README.md](docs/README.md). License: CC-BY-NC-ND-4.0.
