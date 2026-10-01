# UUIDNA QPU

**Final build receipt** `75d69660-0671-8b3c-9bdd-a9d0e5ef7814`

| | |
|---|---|
| version | 1.0.0 |
| commit | `eed33b0277daec5eedfc998c560069404c310d44` |
| receipts | 8 files, 44 nodes |
| build stream | length 44, head `75d69660-0671-8b3c-9bdd-a9d0e5ef7814`, chain `4960a562d7b6a7a5`, holds **true** |

Each node is a quantum receipt: its UUID is the RFC 9562 v8 content address of its payload fold and its referrer, and
its referrer is the node above it. Change any receipt's bytes and its node, its file's node, the build stream chain
and this final receipt move; the root moves with the commit.

```mermaid
flowchart TD
  n77e4b316["root<br/><code>77e4b316</code>"]
  n49d61cc6["cross-receipt.json<br/><code>49d61cc6</code>"]
  n3e4d779c["cross-receipt.json#0<br/><code>3e4d779c</code>"]
  n4743baf5["cross-receipt.json#1<br/><code>4743baf5</code>"]
  n1c7a3ffd["cross-receipt.json#2<br/><code>1c7a3ffd</code>"]
  n09b19e3c["cross-receipt.json#3<br/><code>09b19e3c</code>"]
  n9075a437["cross-receipt.json#4<br/><code>9075a437</code>"]
  n59647392["cross-receipt.json#5<br/><code>59647392</code>"]
  nb3fc4c55["cross-receipt.json#6<br/><code>b3fc4c55</code>"]
  naaeb64be["cross-receipt.json#7<br/><code>aaeb64be</code>"]
  nceb0d0ca["cross-receipt.json#8<br/><code>ceb0d0ca</code>"]
  nf4ff5e32["cross-receipt.json#9<br/><code>f4ff5e32</code>"]
  n8e2d904c["cross-receipt.json#10<br/><code>8e2d904c</code>"]
  ne4350220["cross-receipt.json#11<br/><code>e4350220</code>"]
  n85543064["cross-receipt.json#12<br/><code>85543064</code>"]
  nb4eee968["cross-receipt.json#13<br/><code>b4eee968</code>"]
  n7d06f532["cross-receipt.json#14<br/><code>7d06f532</code>"]
  n32862289["cross-receipt.json#15<br/><code>32862289</code>"]
  n04aa8a06["cross-receipt.json#16<br/><code>04aa8a06</code>"]
  nb7b17b67["cross-receipt.json#17<br/><code>b7b17b67</code>"]
  n7efe5236["cross-receipt.json#18<br/><code>7efe5236</code>"]
  n8000ccde["cross-receipt.json#19<br/><code>8000ccde</code>"]
  n0366489a["cross-receipt.json#20<br/><code>0366489a</code>"]
  na0f850f3["cross-receipt.json#21<br/><code>a0f850f3</code>"]
  n5d6d932a["cross-receipt.json#22<br/><code>5d6d932a</code>"]
  n8202523f["debts-receipt.json<br/><code>8202523f</code>"]
  n54283bc0["flaws-receipt.json<br/><code>54283bc0</code>"]
  n901dbc61["lattice-receipt.json<br/><code>901dbc61</code>"]
  n101c1bdc["percall-receipt.json<br/><code>101c1bdc</code>"]
  nca407332["refusals-receipt.json<br/><code>ca407332</code>"]
  n6a55abe3["test-receipt.json<br/><code>6a55abe3</code>"]
  n49fb0971["test-receipt.json#0<br/><code>49fb0971</code>"]
  ne2e6e70f["test-receipt.json#1<br/><code>e2e6e70f</code>"]
  nabb03102["test-receipt.json#2<br/><code>abb03102</code>"]
  nb5300e68["test-receipt.json#3<br/><code>b5300e68</code>"]
  n871a3a05["test-receipt.json#4<br/><code>871a3a05</code>"]
  n971d8748["test-receipt.json#5<br/><code>971d8748</code>"]
  naa4a2ae7["test-receipt.json#6<br/><code>aa4a2ae7</code>"]
  n6035c392["test-receipt.json#7<br/><code>6035c392</code>"]
  n5b218ae5["test-receipt.json#8<br/><code>5b218ae5</code>"]
  n83505488["test-receipt.json#9<br/><code>83505488</code>"]
  nf8195f9e["test-receipt.json#10<br/><code>f8195f9e</code>"]
  n9504763d["walls-receipt.json<br/><code>9504763d</code>"]
  n75d69660["readme<br/><code>75d69660</code>"]
  n77e4b316 --> n49d61cc6
  n49d61cc6 --> n3e4d779c
  n49d61cc6 --> n4743baf5
  n49d61cc6 --> n1c7a3ffd
  n49d61cc6 --> n09b19e3c
  n49d61cc6 --> n9075a437
  n49d61cc6 --> n59647392
  n49d61cc6 --> nb3fc4c55
  n49d61cc6 --> naaeb64be
  n49d61cc6 --> nceb0d0ca
  n49d61cc6 --> nf4ff5e32
  n49d61cc6 --> n8e2d904c
  n49d61cc6 --> ne4350220
  n49d61cc6 --> n85543064
  n49d61cc6 --> nb4eee968
  n49d61cc6 --> n7d06f532
  n49d61cc6 --> n32862289
  n49d61cc6 --> n04aa8a06
  n49d61cc6 --> nb7b17b67
  n49d61cc6 --> n7efe5236
  n49d61cc6 --> n8000ccde
  n49d61cc6 --> n0366489a
  n49d61cc6 --> na0f850f3
  n49d61cc6 --> n5d6d932a
  n77e4b316 --> n8202523f
  n77e4b316 --> n54283bc0
  n77e4b316 --> n901dbc61
  n77e4b316 --> n101c1bdc
  n77e4b316 --> nca407332
  n77e4b316 --> n6a55abe3
  n6a55abe3 --> n49fb0971
  n6a55abe3 --> ne2e6e70f
  n6a55abe3 --> nabb03102
  n6a55abe3 --> nb5300e68
  n6a55abe3 --> n871a3a05
  n6a55abe3 --> n971d8748
  n6a55abe3 --> naa4a2ae7
  n6a55abe3 --> n6035c392
  n6a55abe3 --> n5b218ae5
  n6a55abe3 --> n83505488
  n6a55abe3 --> nf8195f9e
  n77e4b316 --> n9504763d
  n77e4b316 --> n75d69660
```

| node | receipt uuid | referrer | payload fold | seq |
|---|---|---|---|---|
| root | `77e4b316-c9ab-8de1-8556-6ce0a2920091` | `eed33b02` | `f3e7e348783603f5` | 0 |
| cross-receipt.json | `49d61cc6-3b0f-88c3-8f81-cb2be47f2fa5` | `77e4b316` | `20967f1cc4886764` | 1 |
| cross-receipt.json#0 | `3e4d779c-7046-8c11-84a5-1f7539a08b91` | `49d61cc6` | `14432830058e1e46` | 2 |
| cross-receipt.json#1 | `4743baf5-df04-8440-97e1-690366bfe88f` | `49d61cc6` | `09410219d171472e` | 3 |
| cross-receipt.json#2 | `1c7a3ffd-40ba-8cb7-a63e-3fddeadf5df6` | `49d61cc6` | `e2cac0a5a1701ff8` | 4 |
| cross-receipt.json#3 | `09b19e3c-6b2b-8e09-aaeb-a8bb738670d6` | `49d61cc6` | `72b0abb676747470` | 5 |
| cross-receipt.json#4 | `9075a437-6254-8038-946d-91b34b779259` | `49d61cc6` | `c1a885b32ef960e5` | 6 |
| cross-receipt.json#5 | `59647392-ac25-8bb6-a01a-84be9b35810a` | `49d61cc6` | `6b591900e22f2ba8` | 7 |
| cross-receipt.json#6 | `b3fc4c55-adc6-8da6-b4e0-21ff8516c4fb` | `49d61cc6` | `ad1fcc55bdfb7a52` | 8 |
| cross-receipt.json#7 | `aaeb64be-0489-8f25-aff9-086afc74e885` | `49d61cc6` | `c27faa42150e6e98` | 9 |
| cross-receipt.json#8 | `ceb0d0ca-1633-82a4-a913-04052a438399` | `49d61cc6` | `294f0992ef5aa44f` | 10 |
| cross-receipt.json#9 | `f4ff5e32-c95f-8813-bbee-dc4925bed69a` | `49d61cc6` | `c02f3dc29a4b8ace` | 11 |
| cross-receipt.json#10 | `8e2d904c-5a79-8e1b-818d-3b4ba199d8b6` | `49d61cc6` | `764468a81718149c` | 12 |
| cross-receipt.json#11 | `e4350220-8130-8e43-8a8f-52132e9006d3` | `49d61cc6` | `870f3b1867cf8006` | 13 |
| cross-receipt.json#12 | `85543064-38b3-8a6b-81ad-94694337d3ac` | `49d61cc6` | `e3aa4daad4f109db` | 14 |
| cross-receipt.json#13 | `b4eee968-32e4-8dbb-b4f4-de609c9d6c8e` | `49d61cc6` | `0ef75e8dc811861b` | 15 |
| cross-receipt.json#14 | `7d06f532-22f7-8582-ae82-a4ac4abbd34a` | `49d61cc6` | `87276d09343fa13b` | 16 |
| cross-receipt.json#15 | `32862289-ba97-8b68-a884-4b770dd4bcb5` | `49d61cc6` | `0df990216d41b6e8` | 17 |
| cross-receipt.json#16 | `04aa8a06-1de2-8822-994b-d88c764a1ae6` | `49d61cc6` | `d148afcd4838e3b8` | 18 |
| cross-receipt.json#17 | `b7b17b67-1e2f-83fc-ad09-8c60a7854d19` | `49d61cc6` | `fc9ca0ae74cb7a8e` | 19 |
| cross-receipt.json#18 | `7efe5236-99f5-8d5b-87f9-48b55a2489f0` | `49d61cc6` | `58579b18fc23f7ca` | 20 |
| cross-receipt.json#19 | `8000ccde-ded0-8dc2-bd78-02fa87b59bb9` | `49d61cc6` | `571b3a1c9d1084ae` | 21 |
| cross-receipt.json#20 | `0366489a-eb9c-8e7c-9109-131a99eeb075` | `49d61cc6` | `f892be6f720eced1` | 22 |
| cross-receipt.json#21 | `a0f850f3-ab48-83e3-aec6-604b836d5b0e` | `49d61cc6` | `33be92ef70a7f2c7` | 23 |
| cross-receipt.json#22 | `5d6d932a-f2cf-8579-a845-84975edd1945` | `49d61cc6` | `2e6b165e813c9a55` | 24 |
| debts-receipt.json | `8202523f-015e-89f1-9bbf-a6eccd4c37f3` | `77e4b316` | `de5129853bb193de` | 25 |
| flaws-receipt.json | `54283bc0-c6bc-8692-bd96-6980395ecb15` | `77e4b316` | `ff955046d9f87003` | 26 |
| lattice-receipt.json | `901dbc61-ee6d-8a8c-a719-dbfa7f3c32e3` | `77e4b316` | `36da43b99a7f4375` | 27 |
| percall-receipt.json | `101c1bdc-5957-8f94-aeeb-f6bc1fccfe7c` | `77e4b316` | `227e095d17f22621` | 28 |
| refusals-receipt.json | `ca407332-7360-846e-aeda-3480fe99633e` | `77e4b316` | `e0e972028d35f5b2` | 29 |
| test-receipt.json | `6a55abe3-33e4-84df-bb67-baa943220938` | `77e4b316` | `5fc637f79dfc94eb` | 30 |
| test-receipt.json#0 | `49fb0971-97ed-8718-b653-1cb9b293e082` | `6a55abe3` | `8f31e84778031660` | 31 |
| test-receipt.json#1 | `e2e6e70f-1ac0-8783-80d7-ee2738385b36` | `6a55abe3` | `da3eb97348e29c82` | 32 |
| test-receipt.json#2 | `abb03102-4d60-8d8d-b737-642afffc505f` | `6a55abe3` | `6523d3075b964345` | 33 |
| test-receipt.json#3 | `b5300e68-299a-8c73-9ca7-171fbeedf236` | `6a55abe3` | `34a901af3f06268a` | 34 |
| test-receipt.json#4 | `871a3a05-f5e3-87e9-9b44-b89ebedd601d` | `6a55abe3` | `e83367f743ae290e` | 35 |
| test-receipt.json#5 | `971d8748-644b-889a-9d6c-477984524062` | `6a55abe3` | `05903ab5ea276b01` | 36 |
| test-receipt.json#6 | `aa4a2ae7-9c84-89b4-9eaf-a9967b2497c2` | `6a55abe3` | `6dbdd2e465db81e1` | 37 |
| test-receipt.json#7 | `6035c392-fa72-8d2c-b8ba-b1f0b4de8ce3` | `6a55abe3` | `862a01d23f60c3e6` | 38 |
| test-receipt.json#8 | `5b218ae5-3944-8086-9c3e-4646b38a02fb` | `6a55abe3` | `dd8db09b8187d2b5` | 39 |
| test-receipt.json#9 | `83505488-08e8-814b-90a4-3692c776a978` | `6a55abe3` | `b8f486e7e88aae90` | 40 |
| test-receipt.json#10 | `f8195f9e-f021-8b6e-a0ab-13c8454804dc` | `6a55abe3` | `99bb4c4605f26d4a` | 41 |
| walls-receipt.json | `9504763d-0d77-8ed8-be09-cd67360702db` | `77e4b316` | `2a4c3de10ff7f9be` | 42 |
| readme | `75d69660-0671-8b3c-9bdd-a9d0e5ef7814` | `77e4b316` | `1d583077d6188238` | 43 |

Regenerate with `npm run readme` after `npm run build` and the receipt-producing runs; `node scripts/generate-readme.mjs --check`
compares. Documentation: [docs/README.md](docs/README.md). License: CC-BY-NC-ND-4.0.
