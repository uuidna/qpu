# @uuidna/qpu v1.1.1: An exact quantum processing unit served over MCP

1631 declared theorems, 2466 in the Lean 4 kernel with the lemmas the compiler writes, rest on 0 sorry, and 836 of them are recomputed by a worked example (textbook\_expressions\_evaluate). Each statement below is the one the kernel checked, beside the line of its proof, and every tool is served over MCP at <https://qpu.uuidna.com/api/mcp>.

## statements

| theorem | statement | axioms | proof |
| --- | --- | --- | --- |
| `textbook_sha256_fips_180_4` | $\forall (m\ k : \mathbb{N}), \mathrm{Fintype.card} (\mathrm{Fin} (m \cdot k) \to \mathrm{Bool}) = \mathrm{Fintype.card} (\mathrm{Fin}\ m \to \mathrm{Fin}\ k \to \mathrm{Bool})$ | propext, Classical.choice, Quot.sound | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean#L2208> |
| `textbook_sha3_fips_202` | $1600 - 512 = 1088 \land 512 = 2 \cdot 256 \land 1600 - 1024 = 576 \land 1024 = 2 \cdot 512$ | none | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean#L2215> |
| `textbook_pqc_standards_three` | $202 + 1 = 203 \land 203 + 1 = 204 \land 204 + 1 = 205 \land 205 - 202 = 3 \land 384 \cdot 3 + 32 = 1184 \land 32 \cdot (10 \cdot 3 + 4) = 1088 \land 16 \cdot (1 + 14 \cdot (1 + 12) + 63 + 7 \cdot 35) = 7856$ | none | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean#L2268> |
| `textbook_coil_green` | $432 \bmod 360 + 432 / 9 = 120$ | none | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean#L705> |

## kernel

| kernel | value |
| --- | --- |
| declared theorems | 1631 |
| kernel theorems | 2466 |
| generated lemmas | 835 |
| sorry | 0 |
| recomputed by an example | 836 |
| source | <https://github.com/uuidna/qpu/tree/v1.1.1/lean> |

## use

```json
{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"metrics","arguments":{}}}
```

| use | value |
| --- | --- |
| mcp | <https://qpu.uuidna.com/api/mcp> |
| method | POST |

## receipts

## qpu

| receipt | value |
| --- | --- |
| uuid | d4c79029-a249-8b77-9f2f-b8b9d1436fc9 |
| handle | `d4c79029` |
| sha256 | f49e5d82d0be8f9cd542f27471d55561ce0e2e63d6e2c88512e82c1bd034bb24 |
| coin | 00000100-a249-7b77-8f2f-b8b9d1436fc9 |
| bytes | 256 |
| bits | 2048 |
| tokens | 64 |
| joules | 5.8797647566412266e-18 |
| technique | `seal {"merkle":{"leaves":["uuid"]}}` |
| author | Tsvetan Rouschev |
| orcid | <https://orcid.org/0009-0000-7312-9778> |
| licence | <https://creativecommons.org/licenses/by-nc-nd/4.0/> |
| licensing | <https://uuidna.com/license> |
| donation | <https://revolut.me/ceccec> |
| contact | <https://revolut.me/ceccec> |
| parts | 4 |

| part | handle | uuid |
| --- | --- | --- |
| `textbook_sha256_fips_180_4` | `ba6cdad3` | ba6cdad3-2685-344b-b53f-20a8151801ac |
| `textbook_sha3_fips_202` | `f4b15a9f` | f4b15a9f-ade1-853a-a56b-8e07cb0b2be0 |
| `textbook_pqc_standards_three` | `6434ef1e` | 6434ef1e-d198-6248-9e25-fbf75a94b200 |
| `textbook_coil_green` | `e9045825` | e9045825-9cd3-19c5-91ae-8c31ba8d1216 |

| qpu | value |
| --- | --- |
| rfc | 6962 |
| root | 305658b87baa9c65684a005de4ce064c585bc47433539783b51e43a16f037647 |
| parts | ba6cdad3-2685-344b-b53f-20a8151801ac, f4b15a9f-ade1-853a-a56b-8e07cb0b2be0, 6434ef1e-d198-6248-9e25-fbf75a94b200, e9045825-9cd3-19c5-91ae-8c31ba8d1216 |

## textbook\_sha256\_fips\_180\_4

| receipt | value |
| --- | --- |
| uuid | ba6cdad3-2685-344b-b53f-20a8151801ac |
| handle | `ba6cdad3` |
| sha256 | 3e56abec65b29f07871a4d5154999adb0babe31dc7ef667020abe725a951f6fc |
| coin | 00000157-2685-544b-853f-20a8151801ac |
| bytes | 343 |
| bits | 2744 |
| tokens | 86 |
| joules | 7.877966060656018e-18 |
| technique | `lean/tools/Theorems.lean, seal {"nist":true}, seal {"nist":{"reverse":true,"via":"cern"}}` |

| textbook\_sha256\_fips\_180\_4 | value |
| --- | --- |
| theorem | `textbook_sha256_fips_180_4` |
| module | Qpu.General.Textbook |
| source | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| axioms | propext, Classical.choice, Quot.sound |

| textbook\_sha256\_fips\_180\_4.nist | value |
| --- | --- |
| host | qpu.uuidna.com |
| holds | true |

| textbook\_sha256\_fips\_180\_4.cern | value |
| --- | --- |
| host | opendata.cern.ch |
| via | cern |
| holds | true |

### textbook\_sha256\_fips\_180\_4.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_sha256_fips_180_4` | $\forall (m\ k : \mathbb{N}), \mathrm{Fintype.card} (\mathrm{Fin} (m \cdot k) \to \mathrm{Bool}) = \mathrm{Fintype.card} (\mathrm{Fin}\ m \to \mathrm{Fin}\ k \to \mathrm{Bool})$ | 175 | 1400 | 44 | 4.0193704391102135e-18 | 000000af-f5c6-63f2-8613-45eb992d2fe6 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## textbook\_sha3\_fips\_202

| receipt | value |
| --- | --- |
| uuid | f4b15a9f-ade1-853a-a56b-8e07cb0b2be0 |
| handle | `f4b15a9f` |
| sha256 | 6acc70da1fed60c95daf7526bea90b3495789a4701d1aa78c4968aedea9b0c19 |
| coin | 00000126-ade1-453a-856b-8e07cb0b2be0 |
| bytes | 294 |
| bits | 2352 |
| tokens | 74 |
| joules | 6.7525423377051586e-18 |
| technique | `lean/tools/Theorems.lean, seal {"nist":true}, seal {"nist":{"reverse":true,"via":"cern"}}` |

| textbook\_sha3\_fips\_202 | value |
| --- | --- |
| theorem | `textbook_sha3_fips_202` |
| module | Qpu.General.Textbook |
| source | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| axioms |  |

| textbook\_sha3\_fips\_202.nist | value |
| --- | --- |
| host | qpu.uuidna.com |
| holds | true |

| textbook\_sha3\_fips\_202.cern | value |
| --- | --- |
| host | opendata.cern.ch |
| via | cern |
| holds | true |

### textbook\_sha3\_fips\_202.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_sha3_fips_202` | $1600 - 512 = 1088 \land 512 = 2 \cdot 256 \land 1600 - 1024 = 576 \land 1024 = 2 \cdot 512$ | 90 | 720 | 23 | 2.0671047972566813e-18 | 0000005a-e5e3-600f-88e4-fa974e4b3cf7 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## textbook\_pqc\_standards\_three

| receipt | value |
| --- | --- |
| uuid | 6434ef1e-d198-6248-9e25-fbf75a94b200 |
| handle | `6434ef1e` |
| sha256 | bb91b18b495e1c476efeab5b5f4eda09e3e0c30273c99012f6d9f6adf1d3d2ba |
| coin | 00000132-d198-3248-8e25-fbf75a94b200 |
| bytes | 306 |
| bits | 2448 |
| tokens | 77 |
| joules | 7.028156310672717e-18 |
| technique | `lean/tools/Theorems.lean, seal {"nist":true}, seal {"nist":{"reverse":true,"via":"cern"}}` |

| textbook\_pqc\_standards\_three | value |
| --- | --- |
| theorem | `textbook_pqc_standards_three` |
| module | Qpu.General.Textbook |
| source | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| axioms |  |

| textbook\_pqc\_standards\_three.nist | value |
| --- | --- |
| host | qpu.uuidna.com |
| holds | true |

| textbook\_pqc\_standards\_three.cern | value |
| --- | --- |
| host | opendata.cern.ch |
| via | cern |
| holds | true |

### textbook\_pqc\_standards\_three.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_pqc_standards_three` | $202 + 1 = 203 \land 203 + 1 = 204 \land 204 + 1 = 205 \land 205 - 202 = 3 \land 384 \cdot 3 + 32 = 1184 \land 32 \cdot (10 \cdot 3 + 4) = 1088 \land 16 \cdot (1 + 14 \cdot (1 + 12) + 63 + 7 \cdot 35) = 7856$ | 206 | 1648 | 52 | 4.731373202609737e-18 | 000000ce-c7be-3aef-8508-9bd7711f2bb0 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## textbook\_coil\_green

| receipt | value |
| --- | --- |
| uuid | e9045825-9cd3-19c5-91ae-8c31ba8d1216 |
| handle | `e9045825` |
| sha256 | aab4fc6d08f4a6afefeed5fad368f4aed13661df3eac0b27459b310af9d6f42e |
| coin | 00000120-9cd3-49c5-81ae-8c31ba8d1216 |
| bytes | 288 |
| bits | 2304 |
| tokens | 72 |
| joules | 6.61473535122138e-18 |
| technique | `lean/tools/Theorems.lean, seal {"nist":true}, seal {"nist":{"reverse":true,"via":"cern"}}` |

| textbook\_coil\_green | value |
| --- | --- |
| theorem | `textbook_coil_green` |
| module | Qpu.General.Textbook |
| source | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| axioms |  |

| textbook\_coil\_green.nist | value |
| --- | --- |
| host | qpu.uuidna.com |
| holds | true |

| textbook\_coil\_green.cern | value |
| --- | --- |
| host | opendata.cern.ch |
| via | cern |
| holds | true |

### textbook\_coil\_green.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_coil_green` | $432 \bmod 360 + 432 / 9 = 120$ | 29 | 232 | 8 | 6.660671013382639e-19 | 0000001d-a774-129f-876b-f5812d543cda | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
---

| text | value |
| --- | --- |
| uuid | 85f9408c-0cdc-6adc-b711-be4e7d36cb19 |
| sha256 | f9af3184d978f02d76c69fe143c5865ff48a02a6823634ba57fee181296e845f |
| merge | d4c79029-a249-8b77-9f2f-b8b9d1436fc9 |
| verify | `verify {"uuid":"85f9408c-0cdc-6adc-b711-be4e7d36cb19","content":"text"}` |
| mcp | <https://qpu.uuidna.com/api/mcp> |

<!-- hardware -->

<details>
<summary>hardware</summary>

## hardware

| receipt | value |
| --- | --- |
| uuid | 9d25f082-a775-8138-8b5f-0edad89fe900 |
| handle | `9d25f082` |
| sha256 | 1371f6c2c3884cda0f250b2f72f75637de10fd8af53e5576da1cbb8c26b27e67 |

| hardware | value |
| --- | --- |
| registerBytes | 16 |
| registerQubits | 122 |
| registersInMemory | 2147483648 |
| registerQubitsInMemory | 261993005056 |
| platform | darwin |
| type | Darwin |
| release | 27.2.0 |
| version | Darwin Kernel Version 27.2.0: Thu Oct 15 00:02:46 PDT 2026; root:xnu-13432.41.4~25/RELEASE\_ARM64\_T6000 |
| arch | arm64 |
| machine | arm64 |
| endianness | LE |
| cpu | Apple M1 Max |
| cores | 10 |
| parallelism | 10 |
| cpuMHz | 2400, 2400, 2400, 2400, 2400, 2400, 2400, 2400, 2400, 2400 |
| cpuUserMs | 424144990 |
| cpuNiceMs | 0 |
| cpuSysMs | 182053140 |
| cpuIdleMs | 1435622730 |
| cpuIrqMs | 0 |
| memoryBytes | 34359738368 |
| freeMemoryBytes | 4917493760 |
| load1 | 7.359375 |
| load5 | 5.7998046875 |
| load15 | 5.3623046875 |
| uptimeS | 221718 |
| diskBytes | 994662584320 |
| diskFreeBytes | 820865904640 |
| diskAvailableBytes | 820865904640 |
| diskBlockBytes | 4096 |
| inodes | 8030950878 |
| inodesFree | 8016268600 |
| networkInterfaces | 10 |
| lean | leanprover/lean4:v4.33.0 |
| rssBytes | 320372736 |
| heapTotalBytes | 194691072 |
| heapUsedBytes | 138016016 |
| externalBytes | 7512459 |
| arrayBuffersBytes | 1096848 |
| processUserMicros | 2612245 |
| processSystemMicros | 99864 |
| maxRssKb | 312880 |
| pageFaults | 20348 |
| fsReads | 0 |
| fsWrites | 0 |
| contextSwitches | 2666 |
| buildMs | 1586 |
| at | 2026-11-26T06:22:00.442Z |

| hardware.versions | value |
| --- | --- |
| node | 26.13.1 |
| acorn | 8.19.0 |
| ada | 4.0.0 |
| amaro | 1.1.11 |
| ares | 1.34.9 |
| brotli | 1.2.1 |
| cldr | 48.0 |
| icu | 78.3 |
| libffi | 3.8.0 |
| lief | 1.0.0 |
| llhttp | 9.4.4 |
| merve | 1.2.2 |
| modules | 147 |
| napi | 10 |
| nbytes | 0.1.4 |
| ncrypto | 0.0.1 |
| nghttp2 | 1.70.0 |
| nghttp3 |  |
| ngtcp2 |  |
| openssl | 3.5.9 |
| simdjson | 5.0.3 |
| simdutf | 7.7.0 |
| sqlite | 3.54.1 |
| tz | 2026e |
| undici | 8.12.4 |
| unicode | 17.0 |
| uv | 1.52.1 |
| uvwasi | 0.0.23 |
| v8 | 14.6.202.34-node.40 |
| zlib | 1.3.2.1-motley-456ae73 |
| zstd | 1.5.7 |

</details>
