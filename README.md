# UUIDNA QPU

**Final build receipt** `4bc36cab-31db-824d-9295-f2d466c79517`

| | |
|---|---|
| version | 0.5.0 |
| commit | `54abab2b4837b81307cc35723de58db768f7f95e` |
| receipts | 8 files, 44 nodes |
| build stream | length 44, head `4bc36cab-31db-824d-9295-f2d466c79517`, chain `05040c824b81cd77`, holds **true** |

Each node is a quantum receipt: its UUID is the RFC 9562 v8 content address of its payload fold and its referrer, and
its referrer is the node above it. Change any receipt's bytes and its node, its file's node, the build stream chain
and this final receipt move; the root moves with the commit.

```mermaid
flowchart TD
  n365c7f8d["root<br/><code>365c7f8d</code>"]
  ne7962333["cross-receipt.json<br/><code>e7962333</code>"]
  n4d8d8b2d["cross-receipt.json#0<br/><code>4d8d8b2d</code>"]
  n016a16a5["cross-receipt.json#1<br/><code>016a16a5</code>"]
  n23f35a60["cross-receipt.json#2<br/><code>23f35a60</code>"]
  n96939b03["cross-receipt.json#3<br/><code>96939b03</code>"]
  n360ed044["cross-receipt.json#4<br/><code>360ed044</code>"]
  n4b88c7ac["cross-receipt.json#5<br/><code>4b88c7ac</code>"]
  n232a5766["cross-receipt.json#6<br/><code>232a5766</code>"]
  n42cbd144["cross-receipt.json#7<br/><code>42cbd144</code>"]
  nf8d04f2c["cross-receipt.json#8<br/><code>f8d04f2c</code>"]
  nfbafeae4["cross-receipt.json#9<br/><code>fbafeae4</code>"]
  nd64cce99["cross-receipt.json#10<br/><code>d64cce99</code>"]
  nf00d64cd["cross-receipt.json#11<br/><code>f00d64cd</code>"]
  n7b88c1a5["cross-receipt.json#12<br/><code>7b88c1a5</code>"]
  n32a678c7["cross-receipt.json#13<br/><code>32a678c7</code>"]
  n13172447["cross-receipt.json#14<br/><code>13172447</code>"]
  n69acc7e7["cross-receipt.json#15<br/><code>69acc7e7</code>"]
  n072b1a6d["cross-receipt.json#16<br/><code>072b1a6d</code>"]
  ne1d0f9c9["cross-receipt.json#17<br/><code>e1d0f9c9</code>"]
  nc074a170["cross-receipt.json#18<br/><code>c074a170</code>"]
  n486db758["cross-receipt.json#19<br/><code>486db758</code>"]
  n160cd619["cross-receipt.json#20<br/><code>160cd619</code>"]
  n1eafe053["cross-receipt.json#21<br/><code>1eafe053</code>"]
  nb6786c40["cross-receipt.json#22<br/><code>b6786c40</code>"]
  nb74706c8["debts-receipt.json<br/><code>b74706c8</code>"]
  n6ecbee7c["flaws-receipt.json<br/><code>6ecbee7c</code>"]
  n0be91cf3["lattice-receipt.json<br/><code>0be91cf3</code>"]
  n1698b65c["percall-receipt.json<br/><code>1698b65c</code>"]
  necc6e790["refusals-receipt.json<br/><code>ecc6e790</code>"]
  nad7f161e["test-receipt.json<br/><code>ad7f161e</code>"]
  n3e721838["test-receipt.json#0<br/><code>3e721838</code>"]
  nfcfbc11f["test-receipt.json#1<br/><code>fcfbc11f</code>"]
  n64d94c07["test-receipt.json#2<br/><code>64d94c07</code>"]
  ncf44e878["test-receipt.json#3<br/><code>cf44e878</code>"]
  n9ad46b1f["test-receipt.json#4<br/><code>9ad46b1f</code>"]
  n4de55ccc["test-receipt.json#5<br/><code>4de55ccc</code>"]
  n1a431caa["test-receipt.json#6<br/><code>1a431caa</code>"]
  nec670be1["test-receipt.json#7<br/><code>ec670be1</code>"]
  n03dc815e["test-receipt.json#8<br/><code>03dc815e</code>"]
  n6c523b31["test-receipt.json#9<br/><code>6c523b31</code>"]
  n7a4eba78["test-receipt.json#10<br/><code>7a4eba78</code>"]
  na9cd9594["walls-receipt.json<br/><code>a9cd9594</code>"]
  n4bc36cab["readme<br/><code>4bc36cab</code>"]
  n365c7f8d --> ne7962333
  ne7962333 --> n4d8d8b2d
  ne7962333 --> n016a16a5
  ne7962333 --> n23f35a60
  ne7962333 --> n96939b03
  ne7962333 --> n360ed044
  ne7962333 --> n4b88c7ac
  ne7962333 --> n232a5766
  ne7962333 --> n42cbd144
  ne7962333 --> nf8d04f2c
  ne7962333 --> nfbafeae4
  ne7962333 --> nd64cce99
  ne7962333 --> nf00d64cd
  ne7962333 --> n7b88c1a5
  ne7962333 --> n32a678c7
  ne7962333 --> n13172447
  ne7962333 --> n69acc7e7
  ne7962333 --> n072b1a6d
  ne7962333 --> ne1d0f9c9
  ne7962333 --> nc074a170
  ne7962333 --> n486db758
  ne7962333 --> n160cd619
  ne7962333 --> n1eafe053
  ne7962333 --> nb6786c40
  n365c7f8d --> nb74706c8
  n365c7f8d --> n6ecbee7c
  n365c7f8d --> n0be91cf3
  n365c7f8d --> n1698b65c
  n365c7f8d --> necc6e790
  n365c7f8d --> nad7f161e
  nad7f161e --> n3e721838
  nad7f161e --> nfcfbc11f
  nad7f161e --> n64d94c07
  nad7f161e --> ncf44e878
  nad7f161e --> n9ad46b1f
  nad7f161e --> n4de55ccc
  nad7f161e --> n1a431caa
  nad7f161e --> nec670be1
  nad7f161e --> n03dc815e
  nad7f161e --> n6c523b31
  nad7f161e --> n7a4eba78
  n365c7f8d --> na9cd9594
  n365c7f8d --> n4bc36cab
```

| node | receipt uuid | referrer | payload fold | seq |
|---|---|---|---|---|
| root | `365c7f8d-51b2-897e-aa09-1f4de55aa0e8` | `54abab2b` | `7d846f71eb15215d` | 0 |
| cross-receipt.json | `e7962333-031c-8b31-8116-72cefe617590` | `365c7f8d` | `20967f1cc4886764` | 1 |
| cross-receipt.json#0 | `4d8d8b2d-4f24-81e4-87b6-7f62304c01c1` | `e7962333` | `14432830058e1e46` | 2 |
| cross-receipt.json#1 | `016a16a5-bf8a-86a6-8df6-8219d007ae43` | `e7962333` | `09410219d171472e` | 3 |
| cross-receipt.json#2 | `23f35a60-bc7f-8263-bea0-4a951f4cfb32` | `e7962333` | `e2cac0a5a1701ff8` | 4 |
| cross-receipt.json#3 | `96939b03-4996-8575-8806-182c74984a12` | `e7962333` | `72b0abb676747470` | 5 |
| cross-receipt.json#4 | `360ed044-94e3-8b54-b0fb-7f29c6147699` | `e7962333` | `c1a885b32ef960e5` | 6 |
| cross-receipt.json#5 | `4b88c7ac-8fec-87cc-b84c-e509e7f8685e` | `e7962333` | `6b591900e22f2ba8` | 7 |
| cross-receipt.json#6 | `232a5766-e31f-855c-bb56-2306682d1e87` | `e7962333` | `ad1fcc55bdfb7a52` | 8 |
| cross-receipt.json#7 | `42cbd144-be3b-88ff-a2fe-af959746dfbd` | `e7962333` | `c27faa42150e6e98` | 9 |
| cross-receipt.json#8 | `f8d04f2c-bdb7-8698-b8af-61048b7d4859` | `e7962333` | `294f0992ef5aa44f` | 10 |
| cross-receipt.json#9 | `fbafeae4-61bd-8baf-9f9a-212efdb2404e` | `e7962333` | `c02f3dc29a4b8ace` | 11 |
| cross-receipt.json#10 | `d64cce99-84f9-8fef-afdf-7b84cb10fb72` | `e7962333` | `764468a81718149c` | 12 |
| cross-receipt.json#11 | `f00d64cd-d87e-818e-972a-ba37f61e2baf` | `e7962333` | `870f3b1867cf8006` | 13 |
| cross-receipt.json#12 | `7b88c1a5-1e9a-837c-9950-653a9e63e8fc` | `e7962333` | `e3aa4daad4f109db` | 14 |
| cross-receipt.json#13 | `32a678c7-988b-83ff-9f97-17d76c7c22da` | `e7962333` | `0ef75e8dc811861b` | 15 |
| cross-receipt.json#14 | `13172447-5a01-8fb0-a939-6efe68a37a1e` | `e7962333` | `87276d09343fa13b` | 16 |
| cross-receipt.json#15 | `69acc7e7-7d9b-86bc-a9b6-fbc69d07b80d` | `e7962333` | `0df990216d41b6e8` | 17 |
| cross-receipt.json#16 | `072b1a6d-b510-8250-935f-803d81a2d802` | `e7962333` | `d148afcd4838e3b8` | 18 |
| cross-receipt.json#17 | `e1d0f9c9-c5b3-87f0-bca5-e96008bf11d9` | `e7962333` | `fc9ca0ae74cb7a8e` | 19 |
| cross-receipt.json#18 | `c074a170-2906-86fb-80f0-fbec139aec78` | `e7962333` | `58579b18fc23f7ca` | 20 |
| cross-receipt.json#19 | `486db758-2551-8cc6-addc-483c959cfb79` | `e7962333` | `571b3a1c9d1084ae` | 21 |
| cross-receipt.json#20 | `160cd619-ba31-83b8-9171-dec0671b7b4d` | `e7962333` | `f892be6f720eced1` | 22 |
| cross-receipt.json#21 | `1eafe053-10ee-8a27-9968-99c2534c115a` | `e7962333` | `33be92ef70a7f2c7` | 23 |
| cross-receipt.json#22 | `b6786c40-b7dd-8c8b-9d2e-f3f1090d8cfd` | `e7962333` | `2e6b165e813c9a55` | 24 |
| debts-receipt.json | `b74706c8-a843-8559-89b8-1e03d89d40d2` | `365c7f8d` | `de5129853bb193de` | 25 |
| flaws-receipt.json | `6ecbee7c-7df4-85aa-afa8-20856db1bae0` | `365c7f8d` | `ff955046d9f87003` | 26 |
| lattice-receipt.json | `0be91cf3-ce3e-81f6-9c9b-26b024e338a2` | `365c7f8d` | `36da43b99a7f4375` | 27 |
| percall-receipt.json | `1698b65c-3df6-8c87-a782-fd5c22cfdc65` | `365c7f8d` | `227e095d17f22621` | 28 |
| refusals-receipt.json | `ecc6e790-d89d-8143-be5a-c8444d2d81cb` | `365c7f8d` | `e0e972028d35f5b2` | 29 |
| test-receipt.json | `ad7f161e-a3bb-8a90-a7c6-a491530c6bd9` | `365c7f8d` | `5fc637f79dfc94eb` | 30 |
| test-receipt.json#0 | `3e721838-0b6e-8757-97de-0a6041fb5a8b` | `ad7f161e` | `8f31e84778031660` | 31 |
| test-receipt.json#1 | `fcfbc11f-39fb-8de6-b487-797ba38bcbe7` | `ad7f161e` | `da3eb97348e29c82` | 32 |
| test-receipt.json#2 | `64d94c07-3b5d-8732-ba30-901c1d59d64a` | `ad7f161e` | `6523d3075b964345` | 33 |
| test-receipt.json#3 | `cf44e878-48d6-82d6-9056-a2742a4162e7` | `ad7f161e` | `34a901af3f06268a` | 34 |
| test-receipt.json#4 | `9ad46b1f-d622-89d3-b22e-b493bf920df8` | `ad7f161e` | `e83367f743ae290e` | 35 |
| test-receipt.json#5 | `4de55ccc-7721-8f71-980f-cbad56d795eb` | `ad7f161e` | `05903ab5ea276b01` | 36 |
| test-receipt.json#6 | `1a431caa-056f-83d3-9a55-d7576caea2cb` | `ad7f161e` | `6dbdd2e465db81e1` | 37 |
| test-receipt.json#7 | `ec670be1-cff6-895c-93f0-8b3a56afaf46` | `ad7f161e` | `862a01d23f60c3e6` | 38 |
| test-receipt.json#8 | `03dc815e-0192-8a14-9688-69a592b188de` | `ad7f161e` | `dd8db09b8187d2b5` | 39 |
| test-receipt.json#9 | `6c523b31-6ef1-8547-8837-55e3d30364c9` | `ad7f161e` | `b8f486e7e88aae90` | 40 |
| test-receipt.json#10 | `7a4eba78-5fcb-82e9-8bc1-e43fd239f845` | `ad7f161e` | `99bb4c4605f26d4a` | 41 |
| walls-receipt.json | `a9cd9594-b074-8159-8411-b7ec2c30123a` | `365c7f8d` | `2a4c3de10ff7f9be` | 42 |
| readme | `4bc36cab-31db-824d-9295-f2d466c79517` | `365c7f8d` | `a0b50a46279a2f69` | 43 |

Regenerate with `npm run readme` after `npm run build` and the receipt-producing runs; `node scripts/generate-readme.mjs --check`
compares. Documentation: [docs/README.md](docs/README.md). License: CC-BY-NC-ND-4.0.
