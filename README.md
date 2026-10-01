# UUIDNA QPU

**Final build receipt** `f806b904-dba9-828f-a99f-32aa1e658c13`

| | |
|---|---|
| version | 1.0.0 |
| commit | `a5b9103e021a8388fbd883dd3ffd24dfa29bc250` |
| receipts | 8 files, 44 nodes |
| build stream | length 44, head `f806b904-dba9-828f-a99f-32aa1e658c13`, chain `a94bc75beb8fc2e7`, holds **true** |

Each node is a quantum receipt: its UUID is the RFC 9562 v8 content address of its payload fold and its referrer, and
its referrer is the node above it. Change any receipt's bytes and its node, its file's node, the build stream chain
and this final receipt move; the root moves with the commit.

```mermaid
flowchart TD
  nc7e00b90["root<br/><code>c7e00b90</code>"]
  nd464fd64["cross-receipt.json<br/><code>d464fd64</code>"]
  nf3ed3558["cross-receipt.json#0<br/><code>f3ed3558</code>"]
  n08ff6daa["cross-receipt.json#1<br/><code>08ff6daa</code>"]
  n977df2cd["cross-receipt.json#2<br/><code>977df2cd</code>"]
  n0dc43b64["cross-receipt.json#3<br/><code>0dc43b64</code>"]
  n1379cf57["cross-receipt.json#4<br/><code>1379cf57</code>"]
  n6c57f793["cross-receipt.json#5<br/><code>6c57f793</code>"]
  n92192fe6["cross-receipt.json#6<br/><code>92192fe6</code>"]
  n788abf87["cross-receipt.json#7<br/><code>788abf87</code>"]
  nedb47231["cross-receipt.json#8<br/><code>edb47231</code>"]
  nad596f2a["cross-receipt.json#9<br/><code>ad596f2a</code>"]
  n564b0da4["cross-receipt.json#10<br/><code>564b0da4</code>"]
  n5e22e558["cross-receipt.json#11<br/><code>5e22e558</code>"]
  n5ad7bed5["cross-receipt.json#12<br/><code>5ad7bed5</code>"]
  na6ba7d17["cross-receipt.json#13<br/><code>a6ba7d17</code>"]
  n77bf8286["cross-receipt.json#14<br/><code>77bf8286</code>"]
  nadb91b51["cross-receipt.json#15<br/><code>adb91b51</code>"]
  n7d788808["cross-receipt.json#16<br/><code>7d788808</code>"]
  nd6b51cce["cross-receipt.json#17<br/><code>d6b51cce</code>"]
  nafcfcbb3["cross-receipt.json#18<br/><code>afcfcbb3</code>"]
  n7dead367["cross-receipt.json#19<br/><code>7dead367</code>"]
  n9d4d5083["cross-receipt.json#20<br/><code>9d4d5083</code>"]
  n92c3e4a2["cross-receipt.json#21<br/><code>92c3e4a2</code>"]
  n2b101a2e["cross-receipt.json#22<br/><code>2b101a2e</code>"]
  n0f71ef05["debts-receipt.json<br/><code>0f71ef05</code>"]
  na40c7e3f["flaws-receipt.json<br/><code>a40c7e3f</code>"]
  nbc4d4f11["lattice-receipt.json<br/><code>bc4d4f11</code>"]
  n17f30845["percall-receipt.json<br/><code>17f30845</code>"]
  nfae2915b["refusals-receipt.json<br/><code>fae2915b</code>"]
  ne256cc7d["test-receipt.json<br/><code>e256cc7d</code>"]
  n9ae9f1eb["test-receipt.json#0<br/><code>9ae9f1eb</code>"]
  n7989bb19["test-receipt.json#1<br/><code>7989bb19</code>"]
  ncb955219["test-receipt.json#2<br/><code>cb955219</code>"]
  n4bd2e272["test-receipt.json#3<br/><code>4bd2e272</code>"]
  n8ab4e861["test-receipt.json#4<br/><code>8ab4e861</code>"]
  n09f76ca9["test-receipt.json#5<br/><code>09f76ca9</code>"]
  n42ea2270["test-receipt.json#6<br/><code>42ea2270</code>"]
  nfa44341b["test-receipt.json#7<br/><code>fa44341b</code>"]
  n631a52de["test-receipt.json#8<br/><code>631a52de</code>"]
  n7337d0b4["test-receipt.json#9<br/><code>7337d0b4</code>"]
  nc88c799a["test-receipt.json#10<br/><code>c88c799a</code>"]
  n7a938dd8["walls-receipt.json<br/><code>7a938dd8</code>"]
  nf806b904["readme<br/><code>f806b904</code>"]
  nc7e00b90 --> nd464fd64
  nd464fd64 --> nf3ed3558
  nd464fd64 --> n08ff6daa
  nd464fd64 --> n977df2cd
  nd464fd64 --> n0dc43b64
  nd464fd64 --> n1379cf57
  nd464fd64 --> n6c57f793
  nd464fd64 --> n92192fe6
  nd464fd64 --> n788abf87
  nd464fd64 --> nedb47231
  nd464fd64 --> nad596f2a
  nd464fd64 --> n564b0da4
  nd464fd64 --> n5e22e558
  nd464fd64 --> n5ad7bed5
  nd464fd64 --> na6ba7d17
  nd464fd64 --> n77bf8286
  nd464fd64 --> nadb91b51
  nd464fd64 --> n7d788808
  nd464fd64 --> nd6b51cce
  nd464fd64 --> nafcfcbb3
  nd464fd64 --> n7dead367
  nd464fd64 --> n9d4d5083
  nd464fd64 --> n92c3e4a2
  nd464fd64 --> n2b101a2e
  nc7e00b90 --> n0f71ef05
  nc7e00b90 --> na40c7e3f
  nc7e00b90 --> nbc4d4f11
  nc7e00b90 --> n17f30845
  nc7e00b90 --> nfae2915b
  nc7e00b90 --> ne256cc7d
  ne256cc7d --> n9ae9f1eb
  ne256cc7d --> n7989bb19
  ne256cc7d --> ncb955219
  ne256cc7d --> n4bd2e272
  ne256cc7d --> n8ab4e861
  ne256cc7d --> n09f76ca9
  ne256cc7d --> n42ea2270
  ne256cc7d --> nfa44341b
  ne256cc7d --> n631a52de
  ne256cc7d --> n7337d0b4
  ne256cc7d --> nc88c799a
  nc7e00b90 --> n7a938dd8
  nc7e00b90 --> nf806b904
```

| node | receipt uuid | referrer | payload fold | seq |
|---|---|---|---|---|
| root | `c7e00b90-dfa1-8d98-bca5-9c441a2f0882` | `a5b9103e` | `cf8b20f57aa7c12d` | 0 |
| cross-receipt.json | `d464fd64-eb3d-84ea-ac41-829ded5db203` | `c7e00b90` | `20967f1cc4886764` | 1 |
| cross-receipt.json#0 | `f3ed3558-1b52-863a-a6b8-4aa8839f1561` | `d464fd64` | `14432830058e1e46` | 2 |
| cross-receipt.json#1 | `08ff6daa-bf99-8b76-ba71-1b62c2871ce7` | `d464fd64` | `09410219d171472e` | 3 |
| cross-receipt.json#2 | `977df2cd-33bc-84c5-8750-e34c8bc0937a` | `d464fd64` | `e2cac0a5a1701ff8` | 4 |
| cross-receipt.json#3 | `0dc43b64-7702-8827-9da3-94ab4cf8f15a` | `d464fd64` | `72b0abb676747470` | 5 |
| cross-receipt.json#4 | `1379cf57-4841-8a75-aa21-ecc69ede2ce9` | `d464fd64` | `c1a885b32ef960e5` | 6 |
| cross-receipt.json#5 | `6c57f793-c664-8fad-bedd-e0ba1032c56e` | `d464fd64` | `6b591900e22f2ba8` | 7 |
| cross-receipt.json#6 | `92192fe6-1bd4-8140-a4a0-bfa9f1d86ea3` | `d464fd64` | `ad1fcc55bdfb7a52` | 8 |
| cross-receipt.json#7 | `788abf87-456e-8854-9340-bb577eebc1f5` | `d464fd64` | `c27faa42150e6e98` | 9 |
| cross-receipt.json#8 | `edb47231-67fa-8b09-aa53-768ef97c46a9` | `d464fd64` | `294f0992ef5aa44f` | 10 |
| cross-receipt.json#9 | `ad596f2a-3d8d-851c-b2f9-57e97a85d55e` | `d464fd64` | `c02f3dc29a4b8ace` | 11 |
| cross-receipt.json#10 | `564b0da4-ad0f-8e91-acd4-315b8bf729ba` | `d464fd64` | `764468a81718149c` | 12 |
| cross-receipt.json#11 | `5e22e558-ec9b-8f3c-b818-4d7ae66a939b` | `d464fd64` | `870f3b1867cf8006` | 13 |
| cross-receipt.json#12 | `5ad7bed5-1098-8229-a1c5-2ebeee9a4910` | `d464fd64` | `e3aa4daad4f109db` | 14 |
| cross-receipt.json#13 | `a6ba7d17-85c9-8b91-9b5f-d98a47fe6852` | `d464fd64` | `0ef75e8dc811861b` | 15 |
| cross-receipt.json#14 | `77bf8286-69e1-8de1-ab29-fe0e8b26952e` | `d464fd64` | `87276d09343fa13b` | 16 |
| cross-receipt.json#15 | `adb91b51-d5ac-8cf1-b7f6-d9d62c19b4c5` | `d464fd64` | `0df990216d41b6e8` | 17 |
| cross-receipt.json#16 | `7d788808-3f69-8f96-8bf7-ef778b5b4f0a` | `d464fd64` | `d148afcd4838e3b8` | 18 |
| cross-receipt.json#17 | `d6b51cce-6ff6-8c61-ae49-feea76be1029` | `d464fd64` | `fc9ca0ae74cb7a8e` | 19 |
| cross-receipt.json#18 | `afcfcbb3-1b54-828f-bd37-9d5d37c4b344` | `d464fd64` | `58579b18fc23f7ca` | 20 |
| cross-receipt.json#19 | `7dead367-3a90-8127-ac4a-97b1ce4fb2c9` | `d464fd64` | `571b3a1c9d1084ae` | 21 |
| cross-receipt.json#20 | `9d4d5083-a4cc-832d-87ad-2e7421984505` | `d464fd64` | `f892be6f720eced1` | 22 |
| cross-receipt.json#21 | `92c3e4a2-fe2d-81b9-9531-5b752ece56d2` | `d464fd64` | `33be92ef70a7f2c7` | 23 |
| cross-receipt.json#22 | `2b101a2e-3896-8da0-b1f8-68985c98a435` | `d464fd64` | `2e6b165e813c9a55` | 24 |
| debts-receipt.json | `0f71ef05-a9be-8efa-a802-c840fa124161` | `c7e00b90` | `de5129853bb193de` | 25 |
| flaws-receipt.json | `a40c7e3f-d9b6-8083-ae10-d32fc20d0ad3` | `c7e00b90` | `ff955046d9f87003` | 26 |
| lattice-receipt.json | `bc4d4f11-128e-8bdf-9253-82aee1416eb1` | `c7e00b90` | `36da43b99a7f4375` | 27 |
| percall-receipt.json | `17f30845-d14d-8630-b09d-ff408739a602` | `c7e00b90` | `227e095d17f22621` | 28 |
| refusals-receipt.json | `fae2915b-df81-80f6-807a-6c8261722f74` | `c7e00b90` | `e0e972028d35f5b2` | 29 |
| test-receipt.json | `e256cc7d-3979-894d-8602-df296a346696` | `c7e00b90` | `5fc637f79dfc94eb` | 30 |
| test-receipt.json#0 | `9ae9f1eb-24a5-8c56-b16e-96d7d25b2ea2` | `e256cc7d` | `8f31e84778031660` | 31 |
| test-receipt.json#1 | `7989bb19-6247-81ce-84d3-05a224432426` | `e256cc7d` | `da3eb97348e29c82` | 32 |
| test-receipt.json#2 | `cb955219-c61f-8439-a559-8574f7ebd873` | `e256cc7d` | `6523d3075b964345` | 33 |
| test-receipt.json#3 | `4bd2e272-7121-86be-a0a2-2e9aaaf8bb26` | `e256cc7d` | `34a901af3f06268a` | 34 |
| test-receipt.json#4 | `8ab4e861-b13d-8f36-be6b-10179d050d6d` | `e256cc7d` | `e83367f743ae290e` | 35 |
| test-receipt.json#5 | `09f76ca9-7e72-84c8-8fca-3847f28aa382` | `e256cc7d` | `05903ab5ea276b01` | 36 |
| test-receipt.json#6 | `42ea2270-4ad8-8d62-ab77-7b84a77348e2` | `e256cc7d` | `6dbdd2e465db81e1` | 37 |
| test-receipt.json#7 | `fa44341b-dd52-8284-81f3-f48e16ccfd07` | `e256cc7d` | `862a01d23f60c3e6` | 38 |
| test-receipt.json#8 | `631a52de-714d-8de2-8911-dee0b7976f6f` | `e256cc7d` | `dd8db09b8187d2b5` | 39 |
| test-receipt.json#9 | `7337d0b4-2083-8fe0-951b-de3ad46d65bc` | `e256cc7d` | `b8f486e7e88aae90` | 40 |
| test-receipt.json#10 | `c88c799a-48fd-8978-ab40-17c5aa1d4d00` | `e256cc7d` | `99bb4c4605f26d4a` | 41 |
| walls-receipt.json | `7a938dd8-1f8f-8ff3-a2f8-932710063309` | `c7e00b90` | `2a4c3de10ff7f9be` | 42 |
| readme | `f806b904-dba9-828f-a99f-32aa1e658c13` | `c7e00b90` | `d50dc2b98c30c21a` | 43 |

Regenerate with `npm run readme` after `npm run build` and the receipt-producing runs; `node scripts/generate-readme.mjs --check`
compares. Documentation: [docs/README.md](docs/README.md). License: CC-BY-NC-ND-4.0.
