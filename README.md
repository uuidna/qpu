# UUIDNA QPU

**Final build receipt** `a6fc5840-83ac-886c-8635-b98d1f76a25e`

| | |
|---|---|
| version | 0.5.0 |
| commit | `7c7a7f5b7e307c754f41b7c4157798cc439bc6d0` |
| receipts | 8 files, 44 nodes |
| build stream | length 44, head `a6fc5840-83ac-886c-8635-b98d1f76a25e`, chain `53495e428322401b`, holds **true** |

Each node is a quantum receipt: its UUID is the RFC 9562 v8 content address of its payload fold and its referrer, and
its referrer is the node above it. Change any receipt's bytes and its node, its file's node, the build stream chain
and this final receipt move; the root moves with the commit.

```mermaid
flowchart TD
  n6638596e["root<br/><code>6638596e</code>"]
  n1d7b95b3["cross-receipt.json<br/><code>1d7b95b3</code>"]
  nd5943b52["cross-receipt.json#0<br/><code>d5943b52</code>"]
  n34216bbc["cross-receipt.json#1<br/><code>34216bbc</code>"]
  n92dd280c["cross-receipt.json#2<br/><code>92dd280c</code>"]
  n4a94abfe["cross-receipt.json#3<br/><code>4a94abfe</code>"]
  n29353ad3["cross-receipt.json#4<br/><code>29353ad3</code>"]
  n3295dfe1["cross-receipt.json#5<br/><code>3295dfe1</code>"]
  n2fea1d23["cross-receipt.json#6<br/><code>2fea1d23</code>"]
  n5407ab62["cross-receipt.json#7<br/><code>5407ab62</code>"]
  n51e9832a["cross-receipt.json#8<br/><code>51e9832a</code>"]
  nf39c275f["cross-receipt.json#9<br/><code>f39c275f</code>"]
  n9607ea8b["cross-receipt.json#10<br/><code>9607ea8b</code>"]
  nb84d612e["cross-receipt.json#11<br/><code>b84d612e</code>"]
  nd3930afa["cross-receipt.json#12<br/><code>d3930afa</code>"]
  nce0084c6["cross-receipt.json#13<br/><code>ce0084c6</code>"]
  n2aa2fd0b["cross-receipt.json#14<br/><code>2aa2fd0b</code>"]
  ne11add85["cross-receipt.json#15<br/><code>e11add85</code>"]
  nfb77e3aa["cross-receipt.json#16<br/><code>fb77e3aa</code>"]
  n3aea2dc7["cross-receipt.json#17<br/><code>3aea2dc7</code>"]
  n216838a9["cross-receipt.json#18<br/><code>216838a9</code>"]
  n260bebd1["cross-receipt.json#19<br/><code>260bebd1</code>"]
  n84fccd93["cross-receipt.json#20<br/><code>84fccd93</code>"]
  nba09ec52["cross-receipt.json#21<br/><code>ba09ec52</code>"]
  n208e4212["cross-receipt.json#22<br/><code>208e4212</code>"]
  n6046cf59["debts-receipt.json<br/><code>6046cf59</code>"]
  ne957faaa["flaws-receipt.json<br/><code>e957faaa</code>"]
  nceb556b4["lattice-receipt.json<br/><code>ceb556b4</code>"]
  n40570233["percall-receipt.json<br/><code>40570233</code>"]
  n72d079c8["refusals-receipt.json<br/><code>72d079c8</code>"]
  n64079547["test-receipt.json<br/><code>64079547</code>"]
  nf592fc1a["test-receipt.json#0<br/><code>f592fc1a</code>"]
  n07688280["test-receipt.json#1<br/><code>07688280</code>"]
  nb77796f9["test-receipt.json#2<br/><code>b77796f9</code>"]
  nd9b1a9d9["test-receipt.json#3<br/><code>d9b1a9d9</code>"]
  n81f9f20e["test-receipt.json#4<br/><code>81f9f20e</code>"]
  nbd6f07ed["test-receipt.json#5<br/><code>bd6f07ed</code>"]
  ndd00359f["test-receipt.json#6<br/><code>dd00359f</code>"]
  n2781a97a["test-receipt.json#7<br/><code>2781a97a</code>"]
  n42bd12be["test-receipt.json#8<br/><code>42bd12be</code>"]
  n54871030["test-receipt.json#9<br/><code>54871030</code>"]
  ne4a757b3["test-receipt.json#10<br/><code>e4a757b3</code>"]
  n1c8ddb17["walls-receipt.json<br/><code>1c8ddb17</code>"]
  na6fc5840["readme<br/><code>a6fc5840</code>"]
  n6638596e --> n1d7b95b3
  n1d7b95b3 --> nd5943b52
  n1d7b95b3 --> n34216bbc
  n1d7b95b3 --> n92dd280c
  n1d7b95b3 --> n4a94abfe
  n1d7b95b3 --> n29353ad3
  n1d7b95b3 --> n3295dfe1
  n1d7b95b3 --> n2fea1d23
  n1d7b95b3 --> n5407ab62
  n1d7b95b3 --> n51e9832a
  n1d7b95b3 --> nf39c275f
  n1d7b95b3 --> n9607ea8b
  n1d7b95b3 --> nb84d612e
  n1d7b95b3 --> nd3930afa
  n1d7b95b3 --> nce0084c6
  n1d7b95b3 --> n2aa2fd0b
  n1d7b95b3 --> ne11add85
  n1d7b95b3 --> nfb77e3aa
  n1d7b95b3 --> n3aea2dc7
  n1d7b95b3 --> n216838a9
  n1d7b95b3 --> n260bebd1
  n1d7b95b3 --> n84fccd93
  n1d7b95b3 --> nba09ec52
  n1d7b95b3 --> n208e4212
  n6638596e --> n6046cf59
  n6638596e --> ne957faaa
  n6638596e --> nceb556b4
  n6638596e --> n40570233
  n6638596e --> n72d079c8
  n6638596e --> n64079547
  n64079547 --> nf592fc1a
  n64079547 --> n07688280
  n64079547 --> nb77796f9
  n64079547 --> nd9b1a9d9
  n64079547 --> n81f9f20e
  n64079547 --> nbd6f07ed
  n64079547 --> ndd00359f
  n64079547 --> n2781a97a
  n64079547 --> n42bd12be
  n64079547 --> n54871030
  n64079547 --> ne4a757b3
  n6638596e --> n1c8ddb17
  n6638596e --> na6fc5840
```

| node | receipt uuid | referrer | payload fold | seq |
|---|---|---|---|---|
| root | `6638596e-4ce6-80eb-84ed-15315753c78e` | `7c7a7f5b` | `24f06005b096320f` | 0 |
| cross-receipt.json | `1d7b95b3-5b2d-8103-ae56-a99fb6d7a8f8` | `6638596e` | `20967f1cc4886764` | 1 |
| cross-receipt.json#0 | `d5943b52-8902-858f-b8d1-95f38c2d6e4e` | `1d7b95b3` | `14432830058e1e46` | 2 |
| cross-receipt.json#1 | `34216bbc-6c21-8d68-bc7a-d90e93277648` | `1d7b95b3` | `09410219d171472e` | 3 |
| cross-receipt.json#2 | `92dd280c-0ccd-8abe-a701-c5dbd68ebef9` | `1d7b95b3` | `e2cac0a5a1701ff8` | 4 |
| cross-receipt.json#3 | `4a94abfe-746f-80c0-b71f-0058bc8f76d9` | `1d7b95b3` | `72b0abb676747470` | 5 |
| cross-receipt.json#4 | `29353ad3-cc78-8e3a-95a3-ea35eeaed066` | `1d7b95b3` | `c1a885b32ef960e5` | 6 |
| cross-receipt.json#5 | `3295dfe1-3f15-8951-a48c-703c1391cac5` | `1d7b95b3` | `6b591900e22f2ba8` | 7 |
| cross-receipt.json#6 | `2fea1d23-e5b2-8277-9ad1-ba42967faaec` | `1d7b95b3` | `ad1fcc55bdfb7a52` | 8 |
| cross-receipt.json#7 | `5407ab62-3e8d-86fb-bcc6-2b85c9eff11a` | `1d7b95b3` | `c27faa42150e6e98` | 9 |
| cross-receipt.json#8 | `51e9832a-c986-8e9e-b066-55367705c926` | `1d7b95b3` | `294f0992ef5aa44f` | 10 |
| cross-receipt.json#9 | `f39c275f-6939-8760-8d63-2faad1756035` | `1d7b95b3` | `c02f3dc29a4b8ace` | 11 |
| cross-receipt.json#10 | `9607ea8b-ecb4-8e3a-ba3f-1cdd8cc84739` | `1d7b95b3` | `764468a81718149c` | 12 |
| cross-receipt.json#11 | `b84d612e-7db9-8a24-be2e-f98f1dea9294` | `1d7b95b3` | `870f3b1867cf8006` | 13 |
| cross-receipt.json#12 | `d3930afa-6e9a-87df-9ad0-bce082df7913` | `1d7b95b3` | `e3aa4daad4f109db` | 14 |
| cross-receipt.json#13 | `ce0084c6-9dfb-8dd2-a404-155990d422e1` | `1d7b95b3` | `0ef75e8dc811861b` | 15 |
| cross-receipt.json#14 | `2aa2fd0b-19bc-8835-b75a-a6d151dd3185` | `1d7b95b3` | `87276d09343fa13b` | 16 |
| cross-receipt.json#15 | `e11add85-8411-8010-b1ae-68b86e14606a` | `1d7b95b3` | `0df990216d41b6e8` | 17 |
| cross-receipt.json#16 | `fb77e3aa-25c5-8e4f-8bc4-570f789a9149` | `1d7b95b3` | `d148afcd4838e3b8` | 18 |
| cross-receipt.json#17 | `3aea2dc7-d182-8ff6-b45c-dd91f44792a6` | `1d7b95b3` | `fc9ca0ae74cb7a8e` | 19 |
| cross-receipt.json#18 | `216838a9-00c2-8de5-9767-b8656e9089df` | `1d7b95b3` | `58579b18fc23f7ca` | 20 |
| cross-receipt.json#19 | `260bebd1-e282-8ecc-ac6c-76afea390e46` | `1d7b95b3` | `571b3a1c9d1084ae` | 21 |
| cross-receipt.json#20 | `84fccd93-8d40-886c-b92d-e196acd66aaa` | `1d7b95b3` | `f892be6f720eced1` | 22 |
| cross-receipt.json#21 | `ba09ec52-165f-83fa-9dd5-974477a41161` | `1d7b95b3` | `33be92ef70a7f2c7` | 23 |
| cross-receipt.json#22 | `208e4212-82be-8fe7-8bc0-71bc6dd88d5a` | `1d7b95b3` | `2e6b165e813c9a55` | 24 |
| debts-receipt.json | `6046cf59-8579-83bc-83cc-24ca3f08ef5e` | `6638596e` | `de5129853bb193de` | 25 |
| flaws-receipt.json | `e957faaa-2ca5-8f8c-a521-68ea5955d408` | `6638596e` | `ff955046d9f87003` | 26 |
| lattice-receipt.json | `ceb556b4-3f1b-8925-a665-7178498780ee` | `6638596e` | `36da43b99a7f4375` | 27 |
| percall-receipt.json | `40570233-a2c1-8079-ba73-698ae7e13e11` | `6638596e` | `227e095d17f22621` | 28 |
| refusals-receipt.json | `72d079c8-41e7-82fa-ae0b-4d88b65789bb` | `6638596e` | `e0e972028d35f5b2` | 29 |
| test-receipt.json | `64079547-126f-81ae-867f-b02df503d8ed` | `6638596e` | `5fc637f79dfc94eb` | 30 |
| test-receipt.json#0 | `f592fc1a-db70-8e86-a895-58e890b658be` | `64079547` | `8f31e84778031660` | 31 |
| test-receipt.json#1 | `07688280-134a-8ed0-a7ac-11b43b696002` | `64079547` | `da3eb97348e29c82` | 32 |
| test-receipt.json#2 | `b77796f9-a365-823b-b529-2b2f21b6487f` | `64079547` | `6523d3075b964345` | 33 |
| test-receipt.json#3 | `d9b1a9d9-2225-83c0-837b-3aacc21ef702` | `64079547` | `34a901af3f06268a` | 34 |
| test-receipt.json#4 | `81f9f20e-5d04-8142-a23e-3bc91895de15` | `64079547` | `e83367f743ae290e` | 35 |
| test-receipt.json#5 | `bd6f07ed-5ad3-8b50-a084-c638e731e41e` | `64079547` | `05903ab5ea276b01` | 36 |
| test-receipt.json#6 | `dd00359f-22d2-8062-916a-cff83cb19ffe` | `64079547` | `6dbdd2e465db81e1` | 37 |
| test-receipt.json#7 | `2781a97a-e2b7-85e0-a568-ff18afafe8a3` | `64079547` | `862a01d23f60c3e6` | 38 |
| test-receipt.json#8 | `42bd12be-3474-89ee-b609-30f06442857b` | `64079547` | `dd8db09b8187d2b5` | 39 |
| test-receipt.json#9 | `54871030-cef5-8d4d-a870-24ceda06e68c` | `64079547` | `b8f486e7e88aae90` | 40 |
| test-receipt.json#10 | `e4a757b3-0e9a-8662-8b16-e582630f4a60` | `64079547` | `99bb4c4605f26d4a` | 41 |
| walls-receipt.json | `1c8ddb17-1a2d-8f3c-ab40-61a42db79d46` | `6638596e` | `2a4c3de10ff7f9be` | 42 |
| readme | `a6fc5840-83ac-886c-8635-b98d1f76a25e` | `6638596e` | `fb5b6fe380484c5a` | 43 |

Regenerate with `npm run readme` after `npm run build` and the receipt-producing runs; `node scripts/generate-readme.mjs --check`
compares. Documentation: [docs/README.md](docs/README.md). License: CC-BY-NC-ND-4.0.
