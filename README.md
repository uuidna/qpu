# @uuidna/qpu v1.1.1: An exact quantum processing unit served over MCP

## qpu

| receipt |  |
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

| qpu |  |
| --- | --- |
| rfc | 6962 |
| root | 305658b87baa9c65684a005de4ce064c585bc47433539783b51e43a16f037647 |
| parts | ba6cdad3-2685-344b-b53f-20a8151801ac, f4b15a9f-ade1-853a-a56b-8e07cb0b2be0, 6434ef1e-d198-6248-9e25-fbf75a94b200, e9045825-9cd3-19c5-91ae-8c31ba8d1216 |

## textbook\_sha256\_fips\_180\_4

| receipt |  |
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
| author | Tsvetan Rouschev |
| orcid | <https://orcid.org/0009-0000-7312-9778> |
| licence | <https://creativecommons.org/licenses/by-nc-nd/4.0/> |
| licensing | <https://uuidna.com/license> |
| donation | <https://revolut.me/ceccec> |
| contact | <https://revolut.me/ceccec> |

| textbook\_sha256\_fips\_180\_4 |  |
| --- | --- |
| theorem | `textbook_sha256_fips_180_4` |
| module | Qpu.General.Textbook |
| source | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| axioms | propext, Classical.choice, Quot.sound |

| textbook\_sha256\_fips\_180\_4.nist |  |
| --- | --- |
| host | qpu.uuidna.com |
| holds | true |

| textbook\_sha256\_fips\_180\_4.cern |  |
| --- | --- |
| host | opendata.cern.ch |
| via | cern |
| holds | true |

### textbook\_sha256\_fips\_180\_4.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_sha256_fips_180_4` | $\forall (m\ k : \mathbb{N}), \mathrm{Fintype.card} (\mathrm{Fin} (m \cdot k) \to \mathrm{Bool}) = \mathrm{Fintype.card} (\mathrm{Fin}\ m \to \mathrm{Fin}\ k \to \mathrm{Bool})$ | 175 | 1400 | 44 | 4.0193704391102135e-18 | 000000af-f5c6-63f2-8613-45eb992d2fe6 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## textbook\_sha3\_fips\_202

| receipt |  |
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
| author | Tsvetan Rouschev |
| orcid | <https://orcid.org/0009-0000-7312-9778> |
| licence | <https://creativecommons.org/licenses/by-nc-nd/4.0/> |
| licensing | <https://uuidna.com/license> |
| donation | <https://revolut.me/ceccec> |
| contact | <https://revolut.me/ceccec> |

| textbook\_sha3\_fips\_202 |  |
| --- | --- |
| theorem | `textbook_sha3_fips_202` |
| module | Qpu.General.Textbook |
| source | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| axioms |  |

| textbook\_sha3\_fips\_202.nist |  |
| --- | --- |
| host | qpu.uuidna.com |
| holds | true |

| textbook\_sha3\_fips\_202.cern |  |
| --- | --- |
| host | opendata.cern.ch |
| via | cern |
| holds | true |

### textbook\_sha3\_fips\_202.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_sha3_fips_202` | $1600 - 512 = 1088 \land 512 = 2 \cdot 256 \land 1600 - 1024 = 576 \land 1024 = 2 \cdot 512$ | 90 | 720 | 23 | 2.0671047972566813e-18 | 0000005a-e5e3-600f-88e4-fa974e4b3cf7 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## textbook\_pqc\_standards\_three

| receipt |  |
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
| author | Tsvetan Rouschev |
| orcid | <https://orcid.org/0009-0000-7312-9778> |
| licence | <https://creativecommons.org/licenses/by-nc-nd/4.0/> |
| licensing | <https://uuidna.com/license> |
| donation | <https://revolut.me/ceccec> |
| contact | <https://revolut.me/ceccec> |

| textbook\_pqc\_standards\_three |  |
| --- | --- |
| theorem | `textbook_pqc_standards_three` |
| module | Qpu.General.Textbook |
| source | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| axioms |  |

| textbook\_pqc\_standards\_three.nist |  |
| --- | --- |
| host | qpu.uuidna.com |
| holds | true |

| textbook\_pqc\_standards\_three.cern |  |
| --- | --- |
| host | opendata.cern.ch |
| via | cern |
| holds | true |

### textbook\_pqc\_standards\_three.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_pqc_standards_three` | $202 + 1 = 203 \land 203 + 1 = 204 \land 204 + 1 = 205 \land 205 - 202 = 3 \land 384 \cdot 3 + 32 = 1184 \land 32 \cdot (10 \cdot 3 + 4) = 1088 \land 16 \cdot (1 + 14 \cdot (1 + 12) + 63 + 7 \cdot 35) = 7856$ | 206 | 1648 | 52 | 4.731373202609737e-18 | 000000ce-c7be-3aef-8508-9bd7711f2bb0 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## textbook\_coil\_green

| receipt |  |
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
| author | Tsvetan Rouschev |
| orcid | <https://orcid.org/0009-0000-7312-9778> |
| licence | <https://creativecommons.org/licenses/by-nc-nd/4.0/> |
| licensing | <https://uuidna.com/license> |
| donation | <https://revolut.me/ceccec> |
| contact | <https://revolut.me/ceccec> |

| textbook\_coil\_green |  |
| --- | --- |
| theorem | `textbook_coil_green` |
| module | Qpu.General.Textbook |
| source | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| axioms |  |

| textbook\_coil\_green.nist |  |
| --- | --- |
| host | qpu.uuidna.com |
| holds | true |

| textbook\_coil\_green.cern |  |
| --- | --- |
| host | opendata.cern.ch |
| via | cern |
| holds | true |

### textbook\_coil\_green.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_coil_green` | $432 \bmod 360 + 432 / 9 = 120$ | 29 | 232 | 8 | 6.660671013382639e-19 | 0000001d-a774-129f-876b-f5812d543cda | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
---

| text |  |
| --- | --- |
| uuid | 057be532-ffb6-8567-a9eb-3c280f02738b |
| sha256 | 65154726ddd393cb159379496af4546cb168d8050ff30adf71bd273a2710bfc3 |
| merge | d4c79029-a249-8b77-9f2f-b8b9d1436fc9 |
| verify | `verify {"uuid":"057be532-ffb6-8567-a9eb-3c280f02738b","content":"text"}` |
| mcp | <https://qpu.uuidna.com/api/mcp> |

<!-- hardware -->

## hardware

| receipt |  |
| --- | --- |
| uuid | 8b83e5b5-205d-84fb-83a6-b3f35300147f |
| handle | `8b83e5b5` |
| sha256 | bcb1ecdab826dffbefc91e71e1e0cdb50b073219320f9278bb8eb659560f366b |

| hardware |  |
| --- | --- |
| registerBytes | 16 |
| registerQubits | 122 |
| registersInMemory | 1054292224 |
| registerQubitsInMemory | 128623651328 |
| platform | linux |
| type | Linux |
| release | 6.18.44-fc-v880 |
| version | \#1 SMP PREEMPT\_DYNAMIC @0 |
| arch | x64 |
| machine | x86\_64 |
| endianness | LE |
| cpu | Intel(R) Xeon(R) Processor @ 2.10GHz |
| cores | 4 |
| parallelism | 4 |
| cpuMHz | 0, 0, 0, 0 |
| cpuUserMs | 15145060 |
| cpuNiceMs | 0 |
| cpuSysMs | 2227160 |
| cpuIdleMs | 58631420 |
| cpuIrqMs | 0 |
| memoryBytes | 16868675584 |
| freeMemoryBytes | 15351709696 |
| load1 | 2.01 |
| load5 | 1.6 |
| load15 | 1.65 |
| uptimeS | 19595 |
| diskBytes | 270553174016 |
| diskFreeBytes | 232210743296 |
| diskAvailableBytes | 35539181568 |
| diskBlockBytes | 4096 |
| inodes | 16777216 |
| inodesFree | 14906341 |
| networkInterfaces | 2 |
| lean | leanprover/lean4:v4.33.0 |
| rssBytes | 163766272 |
| heapTotalBytes | 77885440 |
| heapUsedBytes | 50049264 |
| externalBytes | 18179239 |
| arrayBuffersBytes | 914597 |
| processUserMicros | 2631860 |
| processSystemMicros | 165644 |
| maxRssKb | 159928 |
| pageFaults | 39126 |
| fsReads | 0 |
| fsWrites | 0 |
| contextSwitches | 802 |
| buildMs | 1346 |
| at | 2026-11-25T09:23:13.778Z |

| hardware.versions |  |
| --- | --- |
| node | 22.23.5 |
| acorn | 8.16.0 |
| ada | 2.9.2 |
| amaro | 1.1.8 |
| ares | 1.34.9 |
| brotli | 1.1.0 |
| cjs\_module\_lexer | 2.2.0 |
| cldr | 48.0 |
| icu | 78.3 |
| llhttp | 9.4.4 |
| modules | 127 |
| napi | 10 |
| nbytes | 0.1.3 |
| ncrypto | 0.0.1 |
| nghttp2 | 1.69.0 |
| openssl | 3.5.9 |
| simdjson | 4.5.0 |
| simdutf | 6.4.2 |
| sqlite | 3.54.1 |
| tz | 2026e |
| undici | 6.29.1 |
| unicode | 17.0 |
| uv | 1.51.0 |
| uvwasi | 0.0.23 |
| v8 | 12.4.254.21-node.57 |
| zlib | 1.3.1-e00f703 |
| zstd | 1.5.7 |
