# @uuidna/qpu v1.1.1: An exact quantum processing unit served over MCP

## qpu

| receipt |  |
| --- | --- |
| uuid | 8e27a41e-6ec9-5931-be39-f662b696691f |
| handle | `8e27a41e` |
| sha256 | 13d5e419df192c7d30d41908841c0ecbf2b3222cec30c2c9564fe495bc534971 |
| coin | 00000100-6ec9-6931-8e39-f662b696691f |
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
| `textbook_sha256_fips_180_4` | `460f5805` | 460f5805-8ae0-14d0-b7fe-6d1fc9b6d8c8 |
| `textbook_sha3_fips_202` | `e0028c71` | e0028c71-0058-43c4-b4a6-ec45d856dc94 |
| `textbook_pqc_standards_three` | `ba853ce3` | ba853ce3-baac-583e-a382-a68856cb258a |
| `textbook_coil_green` | `cdb22ab5` | cdb22ab5-7757-3466-bae4-81f905bf740a |

| qpu |  |
| --- | --- |
| rfc | 6962 |
| root | 55c57fc9f121c85e5afd4bdb43834f7c32ed581c4ed3873a78a27009dbed8f6b |
| parts | 460f5805-8ae0-14d0-b7fe-6d1fc9b6d8c8, e0028c71-0058-43c4-b4a6-ec45d856dc94, ba853ce3-baac-583e-a382-a68856cb258a, cdb22ab5-7757-3466-bae4-81f905bf740a |

## textbook\_sha256\_fips\_180\_4

| receipt |  |
| --- | --- |
| uuid | 460f5805-8ae0-14d0-b7fe-6d1fc9b6d8c8 |
| handle | `460f5805` |
| sha256 | 8d17358d56238ce1c5492f5c6e41a85aaace6a2948645030d1942804c10c5891 |
| coin | 000007a8-8ae0-44d0-87fe-6d1fc9b6d8c8 |
| bytes | 1960 |
| bits | 15680 |
| tokens | 490 |
| joules | 4.501694891803439e-17 |
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

### textbook\_sha256\_fips\_180\_4.nist.probes

| id | url |
| --- | --- |
| codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| nist-opendata | <https://data.nist.gov/rmm/records?page=0&size=5> |
| nist-beacon | <https://beacon.nist.gov/beacon/2.0/pulse/last> |
| ct-sth | <https://ct.googleapis.com/logs/us1/argon2026h2/ct/v1/get-sth> |
| acme-directory | <https://acme-v02.api.letsencrypt.org/directory> |
| nvd-cves | <https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=ML-KEM&resultsPerPage=5> |
| cern-opendata | <https://opendata.cern.ch/api/records/?q=higgs&size=5> |
| csrc-pqc | <https://csrc.nist.gov/projects/post-quantum-cryptography> |
| nist-codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| crt-sh | <https://crt.sh/?q=qpu.uuidna.com&output=json> |

| textbook\_sha256\_fips\_180\_4.cern |  |
| --- | --- |
| host | opendata.cern.ch |
| via | cern |
| holds | true |

### textbook\_sha256\_fips\_180\_4.cern.probes

| id | url |
| --- | --- |
| cern-opendata | <https://opendata.cern.ch/api/records/?q=higgs&size=5> |
| codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| nist-codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| csrc-pqc | <https://csrc.nist.gov/projects/post-quantum-cryptography> |
| nvd-cves | <https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=ML-KEM&resultsPerPage=5> |
| acme-directory | <https://acme-v02.api.letsencrypt.org/directory> |
| ct-sth | <https://ct.googleapis.com/logs/us1/argon2026h2/ct/v1/get-sth> |
| nist-beacon | <https://beacon.nist.gov/beacon/2.0/pulse/last> |
| crt-sh | <https://crt.sh/?q=opendata.cern.ch&output=json> |

### textbook\_sha256\_fips\_180\_4.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_sha256_fips_180_4` | $\forall (m\ k : \mathbb{N}), \mathrm{Fintype.card} (\mathrm{Fin} (m \cdot k) \to \mathrm{Bool}) = \mathrm{Fintype.card} (\mathrm{Fin}\ m \to \mathrm{Fin}\ k \to \mathrm{Bool})$ | 175 | 1400 | 44 | 4.0193704391102135e-18 | 000000af-f5c6-63f2-8613-45eb992d2fe6 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## textbook\_sha3\_fips\_202

| receipt |  |
| --- | --- |
| uuid | e0028c71-0058-43c4-b4a6-ec45d856dc94 |
| handle | `e0028c71` |
| sha256 | 81a592cf17b3805c5fd1d071d0e3fb485d9fa4f2a4d778c95cfeb98ecda555ee |
| coin | 00000777-0058-63c4-84a6-ec45d856dc94 |
| bytes | 1911 |
| bits | 15288 |
| tokens | 478 |
| joules | 4.389152519508353e-17 |
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

### textbook\_sha3\_fips\_202.nist.probes

| id | url |
| --- | --- |
| codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| nist-opendata | <https://data.nist.gov/rmm/records?page=0&size=5> |
| nist-beacon | <https://beacon.nist.gov/beacon/2.0/pulse/last> |
| ct-sth | <https://ct.googleapis.com/logs/us1/argon2026h2/ct/v1/get-sth> |
| acme-directory | <https://acme-v02.api.letsencrypt.org/directory> |
| nvd-cves | <https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=ML-KEM&resultsPerPage=5> |
| cern-opendata | <https://opendata.cern.ch/api/records/?q=higgs&size=5> |
| csrc-pqc | <https://csrc.nist.gov/projects/post-quantum-cryptography> |
| nist-codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| crt-sh | <https://crt.sh/?q=qpu.uuidna.com&output=json> |

| textbook\_sha3\_fips\_202.cern |  |
| --- | --- |
| host | opendata.cern.ch |
| via | cern |
| holds | true |

### textbook\_sha3\_fips\_202.cern.probes

| id | url |
| --- | --- |
| cern-opendata | <https://opendata.cern.ch/api/records/?q=higgs&size=5> |
| codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| nist-codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| csrc-pqc | <https://csrc.nist.gov/projects/post-quantum-cryptography> |
| nvd-cves | <https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=ML-KEM&resultsPerPage=5> |
| acme-directory | <https://acme-v02.api.letsencrypt.org/directory> |
| ct-sth | <https://ct.googleapis.com/logs/us1/argon2026h2/ct/v1/get-sth> |
| nist-beacon | <https://beacon.nist.gov/beacon/2.0/pulse/last> |
| crt-sh | <https://crt.sh/?q=opendata.cern.ch&output=json> |

### textbook\_sha3\_fips\_202.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_sha3_fips_202` | $1600 - 512 = 1088 \land 512 = 2 \cdot 256 \land 1600 - 1024 = 576 \land 1024 = 2 \cdot 512$ | 90 | 720 | 23 | 2.0671047972566813e-18 | 0000005a-e5e3-600f-88e4-fa974e4b3cf7 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## textbook\_pqc\_standards\_three

| receipt |  |
| --- | --- |
| uuid | ba853ce3-baac-583e-a382-a68856cb258a |
| handle | `ba853ce3` |
| sha256 | a8801ecccfc22b5cbfce544926d5f99ba15554b5eb7924ea8bc133dc92131d99 |
| coin | 00000783-baac-283e-8382-a68856cb258a |
| bytes | 1923 |
| bits | 15384 |
| tokens | 481 |
| joules | 4.416713916805109e-17 |
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

### textbook\_pqc\_standards\_three.nist.probes

| id | url |
| --- | --- |
| codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| nist-opendata | <https://data.nist.gov/rmm/records?page=0&size=5> |
| nist-beacon | <https://beacon.nist.gov/beacon/2.0/pulse/last> |
| ct-sth | <https://ct.googleapis.com/logs/us1/argon2026h2/ct/v1/get-sth> |
| acme-directory | <https://acme-v02.api.letsencrypt.org/directory> |
| nvd-cves | <https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=ML-KEM&resultsPerPage=5> |
| cern-opendata | <https://opendata.cern.ch/api/records/?q=higgs&size=5> |
| csrc-pqc | <https://csrc.nist.gov/projects/post-quantum-cryptography> |
| nist-codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| crt-sh | <https://crt.sh/?q=qpu.uuidna.com&output=json> |

| textbook\_pqc\_standards\_three.cern |  |
| --- | --- |
| host | opendata.cern.ch |
| via | cern |
| holds | true |

### textbook\_pqc\_standards\_three.cern.probes

| id | url |
| --- | --- |
| cern-opendata | <https://opendata.cern.ch/api/records/?q=higgs&size=5> |
| codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| nist-codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| csrc-pqc | <https://csrc.nist.gov/projects/post-quantum-cryptography> |
| nvd-cves | <https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=ML-KEM&resultsPerPage=5> |
| acme-directory | <https://acme-v02.api.letsencrypt.org/directory> |
| ct-sth | <https://ct.googleapis.com/logs/us1/argon2026h2/ct/v1/get-sth> |
| nist-beacon | <https://beacon.nist.gov/beacon/2.0/pulse/last> |
| crt-sh | <https://crt.sh/?q=opendata.cern.ch&output=json> |

### textbook\_pqc\_standards\_three.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_pqc_standards_three` | $202 + 1 = 203 \land 203 + 1 = 204 \land 204 + 1 = 205 \land 205 - 202 = 3 \land 384 \cdot 3 + 32 = 1184 \land 32 \cdot (10 \cdot 3 + 4) = 1088 \land 16 \cdot (1 + 14 \cdot (1 + 12) + 63 + 7 \cdot 35) = 7856$ | 206 | 1648 | 52 | 4.731373202609737e-18 | 000000ce-c7be-3aef-8508-9bd7711f2bb0 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## textbook\_coil\_green

| receipt |  |
| --- | --- |
| uuid | cdb22ab5-7757-3466-bae4-81f905bf740a |
| handle | `cdb22ab5` |
| sha256 | 64917fbf82f88e96f19f53da058d29de5d908598f4073636ff1d40dc17d54550 |
| coin | 00000771-7757-6466-8ae4-81f905bf740a |
| bytes | 1905 |
| bits | 15240 |
| tokens | 477 |
| joules | 4.3753718208599755e-17 |
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

### textbook\_coil\_green.nist.probes

| id | url |
| --- | --- |
| codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| nist-opendata | <https://data.nist.gov/rmm/records?page=0&size=5> |
| nist-beacon | <https://beacon.nist.gov/beacon/2.0/pulse/last> |
| ct-sth | <https://ct.googleapis.com/logs/us1/argon2026h2/ct/v1/get-sth> |
| acme-directory | <https://acme-v02.api.letsencrypt.org/directory> |
| nvd-cves | <https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=ML-KEM&resultsPerPage=5> |
| cern-opendata | <https://opendata.cern.ch/api/records/?q=higgs&size=5> |
| csrc-pqc | <https://csrc.nist.gov/projects/post-quantum-cryptography> |
| nist-codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| crt-sh | <https://crt.sh/?q=qpu.uuidna.com&output=json> |

| textbook\_coil\_green.cern |  |
| --- | --- |
| host | opendata.cern.ch |
| via | cern |
| holds | true |

### textbook\_coil\_green.cern.probes

| id | url |
| --- | --- |
| cern-opendata | <https://opendata.cern.ch/api/records/?q=higgs&size=5> |
| codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| nist-codata | <https://physics.nist.gov/cuu/Constants/Table/allascii.txt> |
| csrc-pqc | <https://csrc.nist.gov/projects/post-quantum-cryptography> |
| nvd-cves | <https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=ML-KEM&resultsPerPage=5> |
| acme-directory | <https://acme-v02.api.letsencrypt.org/directory> |
| ct-sth | <https://ct.googleapis.com/logs/us1/argon2026h2/ct/v1/get-sth> |
| nist-beacon | <https://beacon.nist.gov/beacon/2.0/pulse/last> |
| crt-sh | <https://crt.sh/?q=opendata.cern.ch&output=json> |

### textbook\_coil\_green.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_coil_green` | $432 \bmod 360 + 432 / 9 = 120$ | 29 | 232 | 8 | 6.660671013382639e-19 | 0000001d-a774-129f-876b-f5812d543cda | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
---

| text |  |
| --- | --- |
| uuid | 246a97b1-95e2-739d-94ea-c2620fc7638c |
| sha256 | 9601aa66caab6ee2821b676eeb710cef341c7f67aee9e1541404fe328b97e009 |
| merge | 8e27a41e-6ec9-5931-be39-f662b696691f |
| verify | `verify {"uuid":"246a97b1-95e2-739d-94ea-c2620fc7638c","content":"text"}` |
| mcp | <https://qpu.uuidna.com/api/mcp> |

<!-- hardware -->

## hardware

| receipt |  |
| --- | --- |
| uuid | 10e3c3fc-9e09-28b4-902e-8f954a7e4f1b |
| handle | `10e3c3fc` |
| sha256 | 70dbcf84d2e58f6e13b7828f9aeec902d3d2223b4b27e6116950beb49c338751 |

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
| cpu | Intel(R) Xeon(R) Processor @ 2.30GHz |
| cores | 4 |
| parallelism | 4 |
| cpuMHz | 0, 0, 0, 0 |
| cpuUserMs | 508690 |
| cpuNiceMs | 0 |
| cpuSysMs | 23960 |
| cpuIdleMs | 565740 |
| cpuIrqMs | 0 |
| memoryBytes | 16868675584 |
| freeMemoryBytes | 16073527296 |
| load1 | 1.47 |
| load5 | 1.57 |
| load15 | 0.7 |
| uptimeS | 277 |
| diskBytes | 270553174016 |
| diskFreeBytes | 231487479808 |
| diskAvailableBytes | 34815918080 |
| diskBlockBytes | 4096 |
| inodes | 16777216 |
| inodesFree | 14870065 |
| networkInterfaces | 2 |
| lean | leanprover/lean4:v4.33.0 |
| rssBytes | 219975680 |
| heapTotalBytes | 112984064 |
| heapUsedBytes | 84280824 |
| externalBytes | 17666084 |
| arrayBuffersBytes | 401442 |
| processUserMicros | 4692741 |
| processSystemMicros | 198076 |
| maxRssKb | 215244 |
| pageFaults | 58100 |
| fsReads | 0 |
| fsWrites | 0 |
| contextSwitches | 5242 |
| challenges | 574a161f, fb1cd940, d6d7b748, ec54afc7, bbcc2c0f, dbbc4fe8, 9f253959, 52a07646, a7fa7c75, d8719ba7, 5d7c7a76, 4d938405, 02f60ed8, 3edf017a |
| isoHardwareTerms | 3.3.5 physical qubit, 3.3.6 physical qudit, 3.4.8 quantum processor, 3.4.10 quantum computer, 3.4.26 circuit-based quantum computer, 3.4.27 one-way quantum computer, 3.4.28 adiabatic quantum computer |
| quantumBehaviour | UNVERIFIED |
| buildMs | 3219 |
| at | 2026-11-26T20:59:50.304Z |

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

## willow-connectivity

| receipt |  |
| --- | --- |
| uuid | 574a161f-208a-6ab1-b611-50fb8ba7b0c5 |
| handle | `574a161f` |
| sha256 | 3341344b81f5e255796aa7b0506da31df71b4b067178d4df72d3915050a6fd5a |
| coin | 0000045f-208a-8ab1-8611-50fb8ba7b0c5 |
| bytes | 1119 |
| bits | 8952 |
| tokens | 280 |
| joules | 2.5701002979224737e-17 |
| technique | `google {"challenge":"willow-connectivity"}` |
| author | Tsvetan Rouschev |
| orcid | <https://orcid.org/0009-0000-7312-9778> |
| licence | <https://creativecommons.org/licenses/by-nc-nd/4.0/> |
| licensing | <https://uuidna.com/license> |
| donation | <https://revolut.me/ceccec> |
| contact | <https://revolut.me/ceccec> |

| willow-connectivity |  |
| --- | --- |
| challenge | willow-connectivity |
| title | Willow 105-Qubit Superconducting Grid, Coupler Connectivity & Code Capacity |
| category | quantum-hardware |
| theorem | `textbook_willow_connectivity` |
| relatedTheorems | `textbook_willow_connectivity`, `textbook_willow_holds_codes`, `textbook_willow_distance_seven` |
| formula | (2 \* 182 \* 100 + 52) / 105 = 347 ∧ 7 \* 7 + (7 \* 7 - 1) = 97 \< 101 ≤ 105 ∧ 103 ≤ 105 |
| holds | true |
| kernelAccepted | true |

| willow-connectivity.solution |  |
| --- | --- |
| uuid | d6ffe97c-c666-55e3-92b5-28ffe1187332 |
| sha256 | 9092d2847d698ff0ac38644142f005e6b852bd951e6363b78d5d0064da840c96 |

### willow-connectivity.iso

| clause | term | standard | qpu | uuid |
| --- | --- | --- | --- | --- |
| 3.3.3 | qubit | ISO/IEC 4879:2024 | true | add14fe8-b0f2-88d0-828e-91dc9b7c0002 |
| 3.4.8 | quantum processor | ISO/IEC 4879:2024 | true | 8efaebe5-0912-1fb1-a4b7-247fccfa5756 |
| 3.4.17 | quantum code | ISO/IEC 4879:2024 | true | de2c0bfe-6df8-3bf2-989f-816df42926b9 |
| 3.4.32 | coupler | ISO/IEC 4879:2024 | true | 28b5b13d-3018-59a3-bfe5-ea5e2523ed36 |

### willow-connectivity.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_willow_connectivity` | $\forall \{V : \mathrm{Type}\ \mathrm{u\_1}\} [\mathrm{inst} : \mathrm{Fintype}\ V] [\mathrm{DecidableEq}\ V] (G : \mathrm{SimpleGraph}\ V) [\mathrm{inst\_2} : \mathrm{DecidableRel}\ \mathrm{G.Adj}], \sum v, \mathrm{G.degree}\ v = 2 \cdot \mathrm{G.edgeFinset.card}$ | 264 | 2112 | 66 | 6.063507405286265e-18 | 00000108-cc8f-5949-8064-b982a655be9f | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_willow_holds_codes` | $101 \le 105 \land 103 \le 105 \land 347 < 400$ | 45 | 360 | 12 | 1.0335523986283406e-18 | 0000002d-1afc-4df7-8a46-23f73bfaf830 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_willow_distance_seven` | $7 \cdot 7 + (7 \cdot 7 - 1) = 97 \land 97 < 101 \land 101 \le 105$ | 65 | 520 | 17 | 1.4929090202409365e-18 | 00000041-5ede-645f-8355-b50ce404a476 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## sycamore-topology

| receipt |  |
| --- | --- |
| uuid | fb1cd940-c0fb-2897-95a6-696de14731c9 |
| handle | `fb1cd940` |
| sha256 | 24558ef16281e3dc1e5533ff22210360d00ade12c13bd425ae265159f17af06f |
| coin | 000002de-c0fb-6897-85a6-696de14731c9 |
| bytes | 734 |
| bits | 5872 |
| tokens | 184 |
| joules | 1.6858388013182266e-17 |
| technique | `google {"challenge":"sycamore-topology"}` |
| author | Tsvetan Rouschev |
| orcid | <https://orcid.org/0009-0000-7312-9778> |
| licence | <https://creativecommons.org/licenses/by-nc-nd/4.0/> |
| licensing | <https://uuidna.com/license> |
| donation | <https://revolut.me/ceccec> |
| contact | <https://revolut.me/ceccec> |

| sycamore-topology |  |
| --- | --- |
| challenge | sycamore-topology |
| title | Sycamore 54-Qubit & Sycamore23 Known-Device Grid Topology |
| category | quantum-hardware |
| theorem | `textbook_sycamore_couplers` |
| relatedTheorems | `textbook_sycamore_couplers` |
| formula | 2 \* 88 = 176 ∧ 176 ≤ 4 \* 54 ∧ qubits(Sycamore23) = 23 |
| holds | true |
| kernelAccepted | true |

| sycamore-topology.solution |  |
| --- | --- |
| uuid | 13ebf53e-dde7-2072-8a71-56f9808231e2 |
| sha256 | 8342bc3ed1d3dcf68e54572a4505a91509c7b009f05e0d4c09a5b027b5ae5a83 |

### sycamore-topology.iso

| clause | term | standard | qpu | uuid |
| --- | --- | --- | --- | --- |
| 3.3.3 | qubit | ISO/IEC 4879:2024 | true | add14fe8-b0f2-88d0-828e-91dc9b7c0002 |
| 3.4.32 | coupler | ISO/IEC 4879:2024 | true | 28b5b13d-3018-59a3-bfe5-ea5e2523ed36 |

### sycamore-topology.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_sycamore_couplers` | $\forall \{V : \mathrm{Type}\ \mathrm{u\_1}\} [\mathrm{inst} : \mathrm{Fintype}\ V] [\mathrm{DecidableEq}\ V] (G : \mathrm{SimpleGraph}\ V) [\mathrm{inst\_2} : \mathrm{DecidableRel}\ \mathrm{G.Adj}], (\forall (v : V), \mathrm{G.degree}\ v \le 4) \to 2 \cdot \mathrm{G.edgeFinset.card} \le \mathrm{Fintype.card}\ V \cdot 4$ | 320 | 2560 | 80 | 7.349705945801534e-18 | 00000140-0b4d-1192-8f34-6158eacfb9e6 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## surface-code-qec

| receipt |  |
| --- | --- |
| uuid | d6d7b748-ce2c-2c60-a9e2-62a3bf52b601 |
| handle | `d6d7b748` |
| sha256 | 3a7c8185ba90173febbecb0a47ae846d7a4716bea27d3362f41529f0baf66496 |
| coin | 00000375-ce2c-1c60-89e2-62a3bf52b601 |
| bytes | 885 |
| bits | 7080 |
| tokens | 222 |
| joules | 2.0326530506357364e-17 |
| technique | `google {"challenge":"surface-code-qec"}` |
| author | Tsvetan Rouschev |
| orcid | <https://orcid.org/0009-0000-7312-9778> |
| licence | <https://creativecommons.org/licenses/by-nc-nd/4.0/> |
| licensing | <https://uuidna.com/license> |
| donation | <https://revolut.me/ceccec> |
| contact | <https://revolut.me/ceccec> |

| surface-code-qec |  |
| --- | --- |
| challenge | surface-code-qec |
| title | Surface Code Below Threshold (Λ = 2.14), Repetition Code & Steane \[\[7,1,3\]\] CSS QEC |
| category | quantum-error-correction |
| theorem | `textbook_bit_flip_purity` |
| relatedTheorems | `textbook_bit_flip_purity`, `textbook_steane`, `surfacecode_all`, `textbook_toric_torus_code` |
| formula | P\_L(p) = 3p² − 2p³ = 0.028 \< p = 0.1 ∧ Λ\_3,5,7 = 2.14 \> 1 ∧ Steane \[\[7,1,3\]\] = 14/14 |
| holds | true |
| kernelAccepted | true |

| surface-code-qec.solution |  |
| --- | --- |
| uuid | c7944e9f-9252-3f2f-a96e-06171a641ef7 |
| sha256 | 03552aa0694f4fa913194835d3cc4a82a58e69b71a814d17e2e1f6db6e70bf93 |

### surface-code-qec.iso

| clause | term | standard | qpu | uuid |
| --- | --- | --- | --- | --- |
| 3.4.6 | quantum error correction | ISO/IEC 4879:2024 | true | f3fa6e08-9138-5345-9c5b-9cbaa5907f12 |
| 3.4.17 | quantum code | ISO/IEC 4879:2024 | true | de2c0bfe-6df8-3bf2-989f-816df42926b9 |

### surface-code-qec.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_bit_flip_purity` | $\forall \{R : \mathrm{Type}\} [\mathrm{inst} : \mathrm{CommRing}\ R] (p\ q : R), p + q = 1 \to p ^{2} + q ^{2} = 1 - 2 \cdot p \cdot q$ | 134 | 1072 | 34 | 3.077689364804392e-18 | 00000086-21a1-7fc0-89e0-d5ea28f2ad80 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_steane` | $\forall \{F : \mathrm{Type}\} [\mathrm{inst} : \mathrm{DecidableEq}\ F] \{n : \mathbb{N}\} (d\ t : \mathbb{N}) (c_{1} c_{2} x : \mathrm{Fin}\ n \to F), (c_{1} \ne c_{2} \to d \le \mathrm{hammingDist}\ c_{1} c_{2}) \to 2 \cdot t < d \to \mathrm{hammingDist}\ c_{1} x \le t \to \mathrm{hammingDist}\ x\ c_{2} \le t \to c_{1} = c_{2}$ | 330 | 2640 | 83 | 7.57938425660783e-18 | 0000014a-ddbe-20e5-8c1d-379b199e39df | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `surfacecode_all` | $\mathrm{surfacePhysical}\ 3 = 13 \land \mathrm{surfaceCorrectable}\ 5 = 2 \land \mathrm{surfaceLogical} = 2$ | 107 | 856 | 27 | 2.4575579256273876e-18 | 0000006b-97d5-2995-8b4f-cedf95fb0ee9 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/Processing/Surfacecode.lean> |
| `textbook_toric_torus_code` | $\forall \{F : \mathrm{Type}\} [\mathrm{inst} : \mathrm{DecidableEq}\ F] \{n : \mathbb{N}\} (d\ t : \mathbb{N}) (c_{1} c_{2} x : \mathrm{Fin}\ n \to F), (c_{1} \ne c_{2} \to d \le \mathrm{hammingDist}\ c_{1} c_{2}) \to 2 \cdot t < d \to \mathrm{hammingDist}\ c_{1} x \le t \to \mathrm{hammingDist}\ x\ c_{2} \le t \to c_{1} = c_{2}$ | 330 | 2640 | 83 | 7.57938425660783e-18 | 0000014a-ddbe-20e5-8c1d-379b199e39df | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## rcs-xeb-beyond-classical

| receipt |  |
| --- | --- |
| uuid | ec54afc7-fd30-2293-b42b-c276a6fcc436 |
| handle | `ec54afc7` |
| sha256 | 1fdf386807ece963b19d165c91c22bb2ed55ad8722bceb6f037719a2bc49fd24 |
| coin | 00000508-fd30-3293-842b-c276a6fcc436 |
| bytes | 1288 |
| bits | 10304 |
| tokens | 322 |
| joules | 2.958256643185117e-17 |
| technique | `google {"challenge":"rcs-xeb-beyond-classical"}` |
| author | Tsvetan Rouschev |
| orcid | <https://orcid.org/0009-0000-7312-9778> |
| licence | <https://creativecommons.org/licenses/by-nc-nd/4.0/> |
| licensing | <https://uuidna.com/license> |
| donation | <https://revolut.me/ceccec> |
| contact | <https://revolut.me/ceccec> |

| rcs-xeb-beyond-classical |  |
| --- | --- |
| challenge | rcs-xeb-beyond-classical |
| title | Random Circuit Sampling (RCS) & Cross-Entropy Benchmarking (XEB) Porter–Thomas Speckle |
| category | quantum-algorithms |
| theorem | `textbook_xeb` |
| relatedTheorems | `textbook_xeb` |
| formula | Σ p\_k² \> 1/D ∧ 2/(D+1) \> 1/D (2 \* 16 \> 16 + 1 ∧ 16 + 1 \> 16) |
| holds | true |
| kernelAccepted | true |

| rcs-xeb-beyond-classical.solution |  |
| --- | --- |
| uuid | 801a59dc-a895-73b1-af83-f6a89161c0c5 |
| sha256 | 2dec537759661d42c7e9471f0d176292dd22e692b26de9c162a5590f349bc974 |

### rcs-xeb-beyond-classical.iso

| clause | term | standard | qpu | uuid |
| --- | --- | --- | --- | --- |
| 3.1.9 | algorithm | ISO/IEC 4879:2024 | true | 8960a7da-04a5-775e-88db-84d0185ada3e |
| 3.3.3 | qubit | ISO/IEC 4879:2024 | true | add14fe8-b0f2-88d0-828e-91dc9b7c0002 |
| 3.3.11 | fidelity | ISO/IEC 4879:2024 | true | bd389d3a-11d4-15eb-a310-8881b9798fb2 |
| 3.4.5 | quantum circuit | ISO/IEC 4879:2024 | true | cafc1b4a-7ef6-5fe7-8e9a-ac14d5a73cc4 |
| 3.4.9 | quantum algorithm | ISO/IEC 4879:2024 | true | b15d6e88-e95c-179b-b5ae-f4685dc52b1a |
| 3.5.3 | sampling algorithm | ISO/IEC 4879:2024 | true | c26c3331-b31e-50fa-98e2-cb6c1bbad62d |

### rcs-xeb-beyond-classical.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_xeb` | $\forall (D : \mathbb{N}), 1 < D \to D + 1 < 2 \cdot D \land D < D + 1$ | 69 | 552 | 18 | 1.5847803445634556e-18 | 00000045-fc03-360a-86f5-6d5677afdb34 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## quantum-echoes-otoc

| receipt |  |
| --- | --- |
| uuid | bbcc2c0f-8d77-522c-a9bf-b64802c30241 |
| handle | `bbcc2c0f` |
| sha256 | 42acf93aee3f1821fee9a427ee26951ceeca83693d680d17b455eac13d993a85 |
| coin | 00000455-8d77-622c-89bf-b64802c30241 |
| bytes | 1109 |
| bits | 8872 |
| tokens | 278 |
| joules | 2.5471324668418437e-17 |
| technique | `google {"challenge":"quantum-echoes-otoc"}` |
| author | Tsvetan Rouschev |
| orcid | <https://orcid.org/0009-0000-7312-9778> |
| licence | <https://creativecommons.org/licenses/by-nc-nd/4.0/> |
| licensing | <https://uuidna.com/license> |
| donation | <https://revolut.me/ceccec> |
| contact | <https://revolut.me/ceccec> |

| quantum-echoes-otoc |  |
| --- | --- |
| challenge | quantum-echoes-otoc |
| title | Quantum Echoes Out-of-Time-Order Correlator (OTOC) Time-Reversal Protocol on Willow |
| category | quantum-algorithms |
| theorem | `textbook_echo_qubits_within_willow` |
| relatedTheorems | `textbook_echo_qubits_within_willow`, `Qpu.Verify.Gate.h_z_h_is_two_x` |
| formula | P(U† U \|0⟩ = \|0⟩) = 1 ∧ P(H† Z H \|0⟩ = \|0⟩) = 0 ∧ 65 ≤ 103 ≤ 105 |
| holds | true |
| kernelAccepted | true |

| quantum-echoes-otoc.solution |  |
| --- | --- |
| uuid | 9278d97b-36c7-4e06-962c-d3e55458972f |
| sha256 | 2b7f25a33e361ed965e2f89329ec641717bbd599e05e0e0b83141228d4c432bc |

### quantum-echoes-otoc.iso

| clause | term | standard | qpu | uuid |
| --- | --- | --- | --- | --- |
| 3.1.9 | algorithm | ISO/IEC 4879:2024 | true | 8960a7da-04a5-775e-88db-84d0185ada3e |
| 3.3.3 | qubit | ISO/IEC 4879:2024 | true | add14fe8-b0f2-88d0-828e-91dc9b7c0002 |
| 3.4.8 | quantum processor | ISO/IEC 4879:2024 | true | 8efaebe5-0912-1fb1-a4b7-247fccfa5756 |
| 3.4.9 | quantum algorithm | ISO/IEC 4879:2024 | true | b15d6e88-e95c-179b-b5ae-f4685dc52b1a |

### quantum-echoes-otoc.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_echo_qubits_within_willow` | $\forall \{Q : \mathrm{Type}\} (\mathrm{figure}\ \mathrm{text}\ \mathrm{willow} : \mathrm{Finset}\ Q), \mathrm{figure} \subseteq \mathrm{text} \to \mathrm{text} \subseteq \mathrm{willow} \to \mathrm{figure.card} \le \mathrm{text.card} \land \mathrm{text.card} \le \mathrm{willow.card} \land \mathrm{figure} \subseteq \mathrm{willow}$ | 331 | 2648 | 83 | 7.602352087688462e-18 | 0000014b-9ea0-4370-8f31-22de2a2fd080 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `Qpu.Verify.Gate.h_z_h_is_two_x` | $\mathrm{Qpu.Verify.Gate.scaledH} \cdot \mathrm{Qpu.Verify.Gate.matZ} \cdot \mathrm{Qpu.Verify.Gate.scaledH} = \{ \mathrm{a00} := \mathrm{Qpu.Verify.Gate.g}\ 0, \mathrm{a01} := \mathrm{Qpu.Verify.Gate.g}\ 2, \mathrm{a10} := \mathrm{Qpu.Verify.Gate.g}\ 2, \mathrm{a11} := \mathrm{Qpu.Verify.Gate.g}\ 0 \}$ | 302 | 2416 | 76 | 6.936284986350197e-18 | 0000012e-3ad8-4100-8591-b8f7d18c271e | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/Processing/Verify/Gate.lean> |

## cirq-qvm-simulation

| receipt |  |
| --- | --- |
| uuid | dbbc4fe8-23c8-725d-bfed-8cb41f8a755f |
| handle | `dbbc4fe8` |
| sha256 | 4e4bc8da59d266ba1598293bc310985f938433e34b72f3fdf34e1cb6b9c480b7 |
| coin | 00000299-23c8-425d-8fed-8cb41f8a755f |
| bytes | 665 |
| bits | 5320 |
| tokens | 167 |
| joules | 1.5273607668618812e-17 |
| technique | `google {"challenge":"cirq-qvm-simulation"}` |
| author | Tsvetan Rouschev |
| orcid | <https://orcid.org/0009-0000-7312-9778> |
| licence | <https://creativecommons.org/licenses/by-nc-nd/4.0/> |
| licensing | <https://uuidna.com/license> |
| donation | <https://revolut.me/ceccec> |
| contact | <https://revolut.me/ceccec> |

| cirq-qvm-simulation |  |
| --- | --- |
| challenge | cirq-qvm-simulation |
| title | Cirq State-Vector, Density-Matrix Kraus Channels & Willow Quantum Virtual Machine |
| category | quantum-hardware |
| theorem | `textbook_cirq_exports` |
| relatedTheorems | `textbook_cirq_exports` |
| formula | Tr(ρ) = 1 ∧ Tr(ρ²) = 0.1² + 0.9² = 0.82 ∧ Cirq\_exports = 28 ∧ emulated = 15/15 |
| holds | true |
| kernelAccepted | true |

| cirq-qvm-simulation.solution |  |
| --- | --- |
| uuid | b5648eb8-bf19-3908-8554-99c47b81f759 |
| sha256 | 39d3179c515b65df95ad87a66da9843e77b6bd203b6463e504f83b4fc6846e85 |

### cirq-qvm-simulation.iso

| clause | term | standard | qpu | uuid |
| --- | --- | --- | --- | --- |
| 3.2.7 | quantum state | ISO/IEC 4879:2024 | true | c6762069-f0d8-568c-aa4c-a1e6f529aa46 |

### cirq-qvm-simulation.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_cirq_exports` | $7 + 3 + 11 + 10 = 31 \land 6 + 11 = 17$ | 38 | 304 | 10 | 8.72777581063932e-19 | 00000026-20ed-5082-8633-71a96dc8059c | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## recirq-qaoa-shor-algorithms

| receipt |  |
| --- | --- |
| uuid | 9f253959-6bce-5823-a254-a5353dea7f0e |
| handle | `9f253959` |
| sha256 | 1ff35138ad804cd2e93281710099fa5cca5e7249f38e8c6f9df4793dce61594f |
| coin | 0000037c-6bce-3823-8254-a5353dea7f0e |
| bytes | 892 |
| bits | 7136 |
| tokens | 223 |
| joules | 2.0487305323921775e-17 |
| technique | `google {"challenge":"recirq-qaoa-shor-algorithms"}` |
| author | Tsvetan Rouschev |
| orcid | <https://orcid.org/0009-0000-7312-9778> |
| licence | <https://creativecommons.org/licenses/by-nc-nd/4.0/> |
| licensing | <https://uuidna.com/license> |
| donation | <https://revolut.me/ceccec> |
| contact | <https://revolut.me/ceccec> |

| recirq-qaoa-shor-algorithms |  |
| --- | --- |
| challenge | recirq-qaoa-shor-algorithms |
| title | ReCirq Sycamore QAOA Max-Cut, Shor Order-Finding & Bell CHSH Tsirelson Bound |
| category | quantum-algorithms |
| theorem | `textbook_shor_fifteen_order` |
| relatedTheorems | `textbook_shor_fifteen_order`, `qaoa_all`, `textbook_tsirelson`, `textbook_order_finding` |
| formula | 7^4 ≡ 1 (mod 15) ∧ gcd(7² ± 1, 15) = (3, 5) ∧ E\_QAOA(α\*, β\*) \> E\_random ∧ S\_CHSH = 2√2 \> 2 |
| holds | true |
| kernelAccepted | true |

| recirq-qaoa-shor-algorithms.solution |  |
| --- | --- |
| uuid | 9972b6e6-8208-48c0-9d71-3b774ab4536a |
| sha256 | fdcd0e8874fecd7ffd3ece96c1588c65224d590f057288a1577aae6bc58831f1 |

### recirq-qaoa-shor-algorithms.iso

| clause | term | standard | qpu | uuid |
| --- | --- | --- | --- | --- |
| 3.1.9 | algorithm | ISO/IEC 4879:2024 | true | 8960a7da-04a5-775e-88db-84d0185ada3e |
| 3.4.9 | quantum algorithm | ISO/IEC 4879:2024 | true | b15d6e88-e95c-179b-b5ae-f4685dc52b1a |

### recirq-qaoa-shor-algorithms.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_shor_fifteen_order` | $\forall (n : \mathbb{N}) [\mathrm{NeZero}\ n] (a : (\mathrm{ZMod}\ n)^{\times}), \mathrm{orderOf}\ a \mid \mathrm{n.totient}$ | 124 | 992 | 31 | 2.8480110539980942e-18 | 0000007c-bb27-2a2e-8eab-d61b41ec13e8 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `qaoa_all` | $\mathrm{qaoaParams}\ 3 = 6 \land \mathrm{qaoaZz}\ 2\ 5 = 10 \land \mathrm{qaoaX}\ 3\ 4 = 12$ | 91 | 728 | 23 | 2.090072628337311e-18 | 0000005b-fe79-2bad-8b65-d80bc786a833 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/Application/Qaoa.lean> |
| `textbook_tsirelson` | $\forall (a\ x : \mathbb{R}), 0 \le x \to (a \cdot \surd x) ^{2} = a ^{2} \cdot x$ | 80 | 640 | 20 | 1.8374264864503834e-18 | 00000050-2392-3afb-8eb9-b35b3949a08e | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_order_finding` | $\forall (N : \mathbb{N}) (x : \mathrm{ZMod}\ N), x ^{\mathrm{orderOf}} x = 1 \land \forall (k : \mathbb{N}), 0 < k \to k < \mathrm{orderOf}\ x \to x ^{k} \ne 1$ | 159 | 1272 | 40 | 3.6518851418201365e-18 | 0000009f-f2c1-7bb9-87a7-e2342d4fb9a9 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## openfermion-chemistry-h2

| receipt |  |
| --- | --- |
| uuid | 52a07646-5bee-37e3-b414-a1df0afd26f8 |
| handle | `52a07646` |
| sha256 | 1eaace8c611720c5cf1cf0d2e5b5042aaea02828e556db1a3a00887cbdd298ae |
| coin | 000003d5-5bee-17e3-8414-a1df0afd26f8 |
| bytes | 981 |
| bits | 7848 |
| tokens | 246 |
| joules | 2.2531442290097824e-17 |
| technique | `google {"challenge":"openfermion-chemistry-h2"}` |
| author | Tsvetan Rouschev |
| orcid | <https://orcid.org/0009-0000-7312-9778> |
| licence | <https://creativecommons.org/licenses/by-nc-nd/4.0/> |
| licensing | <https://uuidna.com/license> |
| donation | <https://revolut.me/ceccec> |
| contact | <https://revolut.me/ceccec> |

| openfermion-chemistry-h2 |  |
| --- | --- |
| challenge | openfermion-chemistry-h2 |
| title | OpenFermion H₂ STO-3G Molecular Integrals, Pauli Hamiltonian & VQE Ground Energy |
| category | quantum-algorithms |
| theorem | `textbook_h2_below_hartree_fock` |
| relatedTheorems | `textbook_h2_below_hartree_fock` |
| formula | E\_VQE(θ\*) = min\_θ ⟨00\|exp(iθ Y⊗X) H exp(−iθ Y⊗X)\|00⟩ = E\_FCI = −1.137284 Ha \< E\_HF = −1.116759 Ha |
| holds | true |
| kernelAccepted | true |

| openfermion-chemistry-h2.solution |  |
| --- | --- |
| uuid | fb5f1d3a-d8b3-50d2-ae4c-2a8882bdd2e1 |
| sha256 | 6503673075fce3fbe2b92cba04776955a933ca6f5ff7685e0725d26824d1db48 |

### openfermion-chemistry-h2.iso

| clause | term | standard | qpu | uuid |
| --- | --- | --- | --- | --- |
| 3.1.9 | algorithm | ISO/IEC 4879:2024 | true | 8960a7da-04a5-775e-88db-84d0185ada3e |
| 3.2.12 | Hamiltonian | ISO/IEC 4879:2024 | true | 090bc065-3453-2204-b632-ac869d481a40 |
| 3.4.9 | quantum algorithm | ISO/IEC 4879:2024 | true | b15d6e88-e95c-179b-b5ae-f4685dc52b1a |

### openfermion-chemistry-h2.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_h2_below_hartree_fock` | $11167 < 11373 \land 11373 - 11167 = 206 \land 1 + 2 + 1 + 1 = 5$ | 63 | 504 | 16 | 1.4469733580796768e-18 | 0000003f-8d28-8a22-8cb6-628499a73ae6 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## qualtran-ftqc-magic-state

| receipt |  |
| --- | --- |
| uuid | a7fa7c75-e6b7-439c-a1f0-f5a3e9b645aa |
| handle | `a7fa7c75` |
| sha256 | 79bcdb2367b9b81cb714d4ca238a6192b65fcc41977f08ac806c46620487e5b4 |
| coin | 000004c1-e6b7-639c-81f0-f5a3e9b645aa |
| bytes | 1217 |
| bits | 9736 |
| tokens | 305 |
| joules | 2.7951850425126457e-17 |
| technique | `google {"challenge":"qualtran-ftqc-magic-state"}` |
| author | Tsvetan Rouschev |
| orcid | <https://orcid.org/0009-0000-7312-9778> |
| licence | <https://creativecommons.org/licenses/by-nc-nd/4.0/> |
| licensing | <https://uuidna.com/license> |
| donation | <https://revolut.me/ceccec> |
| contact | <https://revolut.me/ceccec> |

| qualtran-ftqc-magic-state |  |
| --- | --- |
| challenge | qualtran-ftqc-magic-state |
| title | Qualtran Fault-Tolerant Clifford+T Resource Counts & Willow Magic State Cultivation |
| category | quantum-error-correction |
| theorem | `surfacecode_all` |
| relatedTheorems | `surfacecode_all` |
| formula | T(Toffoli) = 7 ∧ T(CS) = 3 ∧ T(T) = 1 ∧ T(Grover) = 7 ∧ T(QEC) = 21 ∧ F\_T(Willow) = 99.99% |
| holds | true |
| kernelAccepted | true |

| qualtran-ftqc-magic-state.solution |  |
| --- | --- |
| uuid | f49209a2-87b3-612a-a629-ba58077a7d34 |
| sha256 | d5ecb9c158acd2930c4d62725bb7427f60a60788e390a7c6c061ed90e415f478 |

### qualtran-ftqc-magic-state.iso

| clause | term | standard | qpu | uuid |
| --- | --- | --- | --- | --- |
| 3.2.7 | quantum state | ISO/IEC 4879:2024 | true | c6762069-f0d8-568c-aa4c-a1e6f529aa46 |
| 3.3.10 | state fidelity | ISO/IEC 4879:2024 | true | 8d3d77ca-4c0b-4351-a745-14a0dab315ba |
| 3.3.11 | fidelity | ISO/IEC 4879:2024 | true | bd389d3a-11d4-15eb-a310-8881b9798fb2 |
| 3.4.5 | quantum circuit | ISO/IEC 4879:2024 | true | cafc1b4a-7ef6-5fe7-8e9a-ac14d5a73cc4 |
| 3.4.6 | quantum error correction | ISO/IEC 4879:2024 | true | f3fa6e08-9138-5345-9c5b-9cbaa5907f12 |

### qualtran-ftqc-magic-state.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `surfacecode_all` | $\mathrm{surfacePhysical}\ 3 = 13 \land \mathrm{surfaceCorrectable}\ 5 = 2 \land \mathrm{surfaceLogical} = 2$ | 107 | 856 | 27 | 2.4575579256273876e-18 | 0000006b-97d5-2995-8b4f-cedf95fb0ee9 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/Processing/Surfacecode.lean> |

## google-quantum-roadmap-catalog

| receipt |  |
| --- | --- |
| uuid | d8719ba7-ced8-8a1d-98a2-a87e9b36fc05 |
| handle | `d8719ba7` |
| sha256 | ff5309818ca7b3db3a86a8f488f0be95a898a9c6d6169c2fcd45bc9629ef561f |
| coin | 0000038b-ced8-4a1d-88a2-a87e9b36fc05 |
| bytes | 907 |
| bits | 7256 |
| tokens | 227 |
| joules | 2.083182279013122e-17 |
| technique | `google {"challenge":"google-quantum-roadmap-catalog"}` |
| author | Tsvetan Rouschev |
| orcid | <https://orcid.org/0009-0000-7312-9778> |
| licence | <https://creativecommons.org/licenses/by-nc-nd/4.0/> |
| licensing | <https://uuidna.com/license> |
| donation | <https://revolut.me/ceccec> |
| contact | <https://revolut.me/ceccec> |

| google-quantum-roadmap-catalog |  |
| --- | --- |
| challenge | google-quantum-roadmap-catalog |
| title | Google Quantum AI 6-Milestone Roadmap to 10⁶ Qubits, Software, Statements & Quantumlib |
| category | quantum-hardware |
| theorem | `textbook_software_cirq_implemented` |
| relatedTheorems | `textbook_software_cirq_implemented`, `textbook_statements_one_topic`, `textbook_repositories_by_language` |
| formula | milestones = 6 (10² → 10⁶ qubits) ∧ software = 1 + 4 = 5 ∧ repositories = 15 |
| holds | true |
| kernelAccepted | true |

| google-quantum-roadmap-catalog.solution |  |
| --- | --- |
| uuid | 9dcfcfad-6671-698f-8faa-6716200da549 |
| sha256 | c7bd046f68fa565a0cd7b03fc51044a26ba0e9bc69accdfdbc19db131c51b4e6 |

### google-quantum-roadmap-catalog.iso

| clause | term | standard | qpu | uuid |
| --- | --- | --- | --- | --- |
| 3.3.3 | qubit | ISO/IEC 4879:2024 | true | add14fe8-b0f2-88d0-828e-91dc9b7c0002 |
| 3.3.5 | physical qubit | ISO/IEC 4879:2024 | true | e8112047-4fd2-374c-8f47-bde71c844441 |

### google-quantum-roadmap-catalog.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_software_cirq_implemented` | $\forall \{\alpha : \mathrm{Type}\ \mathrm{u\_1}\} (\mathrm{tools} : \mathrm{Finset} \alpha ) (\mathrm{implemented} : \alpha \to \mathrm{Prop}) [\mathrm{inst} : \mathrm{DecidablePred}\ \mathrm{implemented}], (\mathrm{Finset.filter}\ \mathrm{implemented}\ \mathrm{tools})\mathrm{.card} + \{x \in \mathrm{tools} \| \neg \mathrm{implemented}\ x\}\mathrm{.card} = \mathrm{tools.card}$ | 377 | 3016 | 95 | 8.658872317397431e-18 | 00000179-ea45-50cd-8841-20b7dce7bb58 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_statements_one_topic` | $\forall \{\alpha : \mathrm{Type}\ \mathrm{u\_1}\} [\mathrm{inst} : \mathrm{DecidableEq} \alpha ] (\mathrm{statements} : \mathrm{Finset} \alpha ), \forall a \in \mathrm{statements}, 1 + (\mathrm{statements.erase}\ a)\mathrm{.card} = \mathrm{statements.card}$ | 256 | 2048 | 64 | 5.8797647566412266e-18 | 00000100-6e30-66e0-8be8-de7b5bf67247 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_repositories_by_language` | $\forall \{\iota \kappa : \mathrm{Type}\} [\mathrm{inst} : \mathrm{DecidableEq} \kappa ] (f : \iota \to \kappa ) (s : \mathrm{Finset} \iota ) (t : \mathrm{Finset} \kappa ), (\forall x \in s, f\ x \in t) \to \mathrm{s.card} = \sum k \in t, \{x \in s \| f\ x = k\}\mathrm{.card}$ | 274 | 2192 | 69 | 6.293185716092563e-18 | 00000112-cc76-65d1-874d-4ad5fb7efdba | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## google-discovery-one-door

| receipt |  |
| --- | --- |
| uuid | 5d7c7a76-d6ce-8766-a033-ffe9975097a2 |
| handle | `5d7c7a76` |
| sha256 | d09c0bfa72608aef0dffe385c0376e6dae2485010b0372894ab49677d1ce4e79 |
| coin | 00000285-d6ce-2766-8033-ffe9975097a2 |
| bytes | 645 |
| bits | 5160 |
| tokens | 162 |
| joules | 1.4814251047006216e-17 |
| technique | `google {"challenge":"google-discovery-one-door"}` |
| author | Tsvetan Rouschev |
| orcid | <https://orcid.org/0009-0000-7312-9778> |
| licence | <https://creativecommons.org/licenses/by-nc-nd/4.0/> |
| licensing | <https://uuidna.com/license> |
| donation | <https://revolut.me/ceccec> |
| contact | <https://revolut.me/ceccec> |

| google-discovery-one-door |  |
| --- | --- |
| challenge | google-discovery-one-door |
| title | Google Discovery Service Validation, 7 Named Endpoints, Docs Rewrite & qpu-google-call Job |
| category | google-apis-discovery |
| theorem | `textbook_google_one_door` |
| relatedTheorems | `textbook_google_one_door`, `textbook_google_call_schema`, `textbook_google_api_surfaces`, `textbook_google_measured` |
| formula | unknown + missing + broken = 0 ↔ allowed = true ∧ direct = 0 ∧ a + r = n |
| holds | true |
| kernelAccepted | true |
| iso |  |

| google-discovery-one-door.solution |  |
| --- | --- |
| uuid | 347066af-0a6a-54fe-9f12-529bd1870a21 |
| sha256 | 6e63fe2e092beba182d874ae335856e6f5c2786cb952274c8f9f1956acd9057d |

### google-discovery-one-door.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_google_one_door` | $\forall (\mathrm{direct} : \mathbb{N}), \mathrm{direct} = 0 \leftrightarrow \neg 0 < \mathrm{direct}$ | 100 | 800 | 25 | 2.296783108062979e-18 | 00000064-0b65-36da-8f22-d24951397b28 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_google_call_schema` | $\forall (\mathrm{unknown}\ \mathrm{missing}\ \mathrm{broken} : \mathbb{N}), \mathrm{unknown} + \mathrm{missing} + \mathrm{broken} = 0 \leftrightarrow \mathrm{unknown} = 0 \land \mathrm{missing} = 0 \land \mathrm{broken} = 0$ | 223 | 1784 | 56 | 5.121826330980444e-18 | 000000df-1620-2672-86ed-59f5af612683 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_google_api_surfaces` | $\forall \{\alpha : \mathrm{Type}\ \mathrm{u\_1}\} \{\beta : \mathrm{Type}\ \mathrm{u\_2}\} [\mathrm{inst} : \mathrm{Fintype} \alpha ] [\mathrm{inst\_1} : \mathrm{Fintype} \beta ] (e : \alpha \simeq \beta ), \mathrm{Fintype.card} \alpha = \mathrm{Fintype.card} \beta $ | 266 | 2128 | 67 | 6.109443067447525e-18 | 0000010a-dbec-4ebd-81b1-bbe00293f9d1 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_google_measured` | $\forall \{\mathrm{Call} : \mathrm{Type}\} [\mathrm{inst} : \mathrm{DecidableEq}\ \mathrm{Call}] (\mathrm{calls}\ \mathrm{refused} : \mathrm{Finset}\ \mathrm{Call}), \mathrm{refused} \subseteq \mathrm{calls} \to (\mathrm{calls} \setminus \mathrm{refused})\mathrm{.card} = \mathrm{calls.card} - \mathrm{refused.card}$ | 314 | 2512 | 79 | 7.211898959317754e-18 | 0000013a-412e-7eec-82c4-25319331e30d | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## google-workspace-roundtrip-sets

| receipt |  |
| --- | --- |
| uuid | 4d938405-148c-44cb-8983-eb8141d9d7f1 |
| handle | `4d938405` |
| sha256 | a795bed4d28b59f6413e0e9e7f02db1792df6ecd29192bb7298e130bf0d8534f |
| coin | 000002f0-148c-14cb-8983-eb8141d9d7f1 |
| bytes | 752 |
| bits | 6016 |
| tokens | 188 |
| joules | 1.7271808972633603e-17 |
| technique | `google {"challenge":"google-workspace-roundtrip-sets"}` |
| author | Tsvetan Rouschev |
| orcid | <https://orcid.org/0009-0000-7312-9778> |
| licence | <https://creativecommons.org/licenses/by-nc-nd/4.0/> |
| licensing | <https://uuidna.com/license> |
| donation | <https://revolut.me/ceccec> |
| contact | <https://revolut.me/ceccec> |

| google-workspace-roundtrip-sets |  |
| --- | --- |
| challenge | google-workspace-roundtrip-sets |
| title | Google Workspace Forms v1, Docs v1, Drive v3 Bidirectional Round-Trips & 26,244 Institution Sets |
| category | google-workspace-cloud |
| theorem | `textbook_workspace_sets` |
| relatedTheorems | `textbook_workspace_sets`, `textbook_workspace_coverage`, `textbook_workspace_round_trip`, `textbook_workspace_docs_round_trip`, `textbook_workspace_drive`, `textbook_institution_bill` |
| formula | 3 \* 3^7 \* 2^2 = 26244 ∧ Forms(14/14) ∧ f(g(f(g(b)))) = b ∧ Docs(lost = 0) ∧ Drive(same = true) |
| holds | true |
| kernelAccepted | true |
| iso |  |

| google-workspace-roundtrip-sets.solution |  |
| --- | --- |
| uuid | a8bb9e92-2986-72d2-9c28-b93314789960 |
| sha256 | d3160c4d6b16a1b192f93f334d5a39f74674c9a5c5cc74104519a26d70f99c09 |

### google-workspace-roundtrip-sets.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_workspace_sets` | $\forall (k : \mathbb{N}) (r : \mathrm{Fin}\ k \to \mathbb{N}), \mathrm{Fintype.card} ((i : \mathrm{Fin}\ k) \to \mathrm{Fin} (r\ i)) = \prod i, r\ i$ | 148 | 1184 | 37 | 3.399238999933209e-18 | 00000094-3fa6-602c-8443-bc6834061bfc | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_workspace_coverage` | $\forall \{\alpha : \mathrm{Type}\ \mathrm{u\_1}\} [\mathrm{inst} : \mathrm{PartialOrder} \alpha ] [\mathrm{inst\_1} : \mathrm{AddCommSemigroup} \alpha ] [\mathrm{inst\_2} : \mathrm{Sub} \alpha ] [\mathrm{OrderedSub} \alpha ] [\mathrm{AddLeftReflectLE} \alpha ] (\mathrm{held}\ \mathrm{missing}\ \mathrm{kinds} : \alpha ), \mathrm{held} + \mathrm{missing} = \mathrm{kinds} \to \mathrm{kinds} - \mathrm{missing} = \mathrm{held}$ | 425 | 3400 | 107 | 9.761328209267661e-18 | 000001a9-cdfb-55ed-8fa8-cc3157bd94d1 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_workspace_round_trip` | $\forall \{\alpha \beta : \mathrm{Type}\} (f : \alpha \to \beta ) (g : \beta \to \alpha ), \mathrm{Function.LeftInverse}\ f\ g \to (f \circ g) \circ f \circ g = \mathrm{id}$ | 171 | 1368 | 43 | 3.927499114787694e-18 | 000000ab-85a8-5013-8333-bc86bc35fab7 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_workspace_docs_round_trip` | $\forall \{\alpha : \mathrm{Type}\ \mathrm{u\_1}\} \{\beta : \mathrm{Type}\ \mathrm{u\_2}\} (\mathrm{shape} : \alpha \to \beta ) (\mathrm{back} : \alpha \to \alpha ), (\forall (x : \alpha ), \mathrm{shape} (\mathrm{back}\ x) = \mathrm{shape}\ x) \to \forall (n : \mathbb{N}) (x : \alpha ), \mathrm{shape} (\mathrm{back}^{}[n] x) = \mathrm{shape}\ x$ | 347 | 2776 | 87 | 7.969837384978538e-18 | 0000015b-7a9e-1654-8ae5-0d9623e82cde | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_workspace_drive` | $\forall \{\alpha \beta : \mathrm{Type}\} (e : \alpha \simeq \beta ) (x : \alpha ), \mathrm{e.symm} (e\ x) = x$ | 109 | 872 | 28 | 2.5034935877886473e-18 | 0000006d-76de-21bc-8fc2-8ebc303f19c0 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_institution_bill` | $\forall \{\alpha : \mathrm{Type}\ \mathrm{u\_1}\} [\mathrm{inst} : \mathrm{Mul} \alpha ] [\mathrm{inst\_1} : \mathrm{Zero} \alpha ] [\mathrm{inst\_2} : \mathrm{Preorder} \alpha ] [\mathrm{MulPosMono} \alpha ] (u\ c\ p : \alpha ), u \le c \to 0 \le p \to u \cdot p \le c \cdot p$ | 277 | 2216 | 70 | 6.362089209334452e-18 | 00000115-23ae-4185-8f6f-3d15c981e251 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## google-cloud-mcp-bindings-rbac

| receipt |  |
| --- | --- |
| uuid | 02f60ed8-974c-2e2f-be18-c7c84b82284e |
| handle | `02f60ed8` |
| sha256 | 7c9a9a122c94776a3a6568f48f661f32da6f05a824cb3a99fc7b9ec60fc91a20 |
| coin | 00000238-974c-6e2f-8e18-c7c84b82284e |
| bytes | 568 |
| bits | 4544 |
| tokens | 142 |
| joules | 1.304572805379772e-17 |
| technique | `google {"challenge":"google-cloud-mcp-bindings-rbac"}` |
| author | Tsvetan Rouschev |
| orcid | <https://orcid.org/0009-0000-7312-9778> |
| licence | <https://creativecommons.org/licenses/by-nc-nd/4.0/> |
| licensing | <https://uuidna.com/license> |
| donation | <https://revolut.me/ceccec> |
| contact | <https://revolut.me/ceccec> |

| google-cloud-mcp-bindings-rbac |  |
| --- | --- |
| challenge | google-cloud-mcp-bindings-rbac |
| title | 15 Google MCPs & Standards RBAC from Workspace groups |
| category | google-workspace-cloud |
| theorem | `textbook_abilities_merge` |
| relatedTheorems | `textbook_abilities_merge`, `textbook_google_mcps`, `textbook_cannot_binds` |
| formula | roles = 4 ∧ google\_mcps = 15 + 3 = 18 ∧ cannot\_waive\_main = true |
| holds | true |
| kernelAccepted | true |
| iso |  |

| google-cloud-mcp-bindings-rbac.solution |  |
| --- | --- |
| uuid | 08e3b3ae-1dfc-4bb1-b413-82dcd61b5618 |
| sha256 | 266ac8068237450000eaf4b263e3f681f97eb6682e08a2cae3daa11cdf911514 |

### google-cloud-mcp-bindings-rbac.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_abilities_merge` | $\forall \{\alpha : \mathrm{Type}\ \mathrm{u\_1}\} [\mathrm{inst} : \mathrm{BooleanAlgebra} \alpha ] (\mathrm{can}\ \mathrm{cannot} : \alpha ), \mathrm{can} \sqcap \mathrm{cannot}^{c} = \top \to \mathrm{can} = \top \land \mathrm{cannot} = \bot $ | 243 | 1944 | 61 | 5.581182952593039e-18 | 000000f3-e10b-85b0-8d15-287e19f9da1e | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_google_mcps` | $\forall (a\ b : \mathbb{N}), \mathrm{Fintype.card} (\mathrm{Fin}\ a \oplus \mathrm{Fin}\ b) = a + b$ | 99 | 792 | 25 | 2.2738152769823494e-18 | 00000063-a21d-83cb-8624-74a29b9478f0 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_cannot_binds` | $\forall \{\alpha : \mathrm{Type}\} [\mathrm{inst} : \mathrm{BooleanAlgebra} \alpha ] (\mathrm{can}\ \mathrm{cannot} : \alpha ), \mathrm{cannot} = \top \to \mathrm{can} \sqcap \mathrm{cannot}^{c} = \bot $ | 202 | 1616 | 51 | 4.6395018782872176e-18 | 000000ca-2408-7b2a-8c45-b15d09f1d828 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |

## google-patents-gemini-xprize-sitemap

| receipt |  |
| --- | --- |
| uuid | 3edf017a-bf65-7751-8ce4-fb1878e168d7 |
| handle | `3edf017a` |
| sha256 | 4c147f11be68175c401869f5a51871055a6260bfe64cff802a12ee8e70ee982a |
| coin | 00000391-bf65-8751-8ce4-fb1878e168d7 |
| bytes | 913 |
| bits | 7304 |
| tokens | 229 |
| joules | 2.0969629776615e-17 |
| technique | `google {"challenge":"google-patents-gemini-xprize-sitemap"}` |
| author | Tsvetan Rouschev |
| orcid | <https://orcid.org/0009-0000-7312-9778> |
| licence | <https://creativecommons.org/licenses/by-nc-nd/4.0/> |
| licensing | <https://uuidna.com/license> |
| donation | <https://revolut.me/ceccec> |
| contact | <https://revolut.me/ceccec> |

| google-patents-gemini-xprize-sitemap |  |
| --- | --- |
| challenge | google-patents-gemini-xprize-sitemap |
| title | Google Patents Hardware Verification, Gemini 3.8 Flash Coil Plan & Google XPRIZE Competitions |
| category | google-apis-discovery |
| theorem | `textbook_patent_dates_ordered` |
| relatedTheorems | `textbook_patent_dates_ordered`, `textbook_patent_number_well_formed`, `textbook_patent_term_twenty_years`, `textbook_free_or_coil`, `textbook_prizes_computable`, `textbook_sitemap_leads` |
| formula | priority ≤ filing ≤ publication ∧ filing ≤ grant \< filing + 20y ∧ header = x-goog-api-key ∧ google\_competitions = 4 |
| holds | true |
| kernelAccepted | true |

| google-patents-gemini-xprize-sitemap.solution |  |
| --- | --- |
| uuid | 81c12bbb-5d29-2b80-a051-066d1fd1abc8 |
| sha256 | 959bf3b5a293dd93f432a00a7cab251d2f9d2d4848986ad1f8b556b5f3546362 |

### google-patents-gemini-xprize-sitemap.iso

| clause | term | standard | qpu | uuid |
| --- | --- | --- | --- | --- |
| 3.1.1 | model | ISO/IEC 4879:2024 | true | 5917f698-338e-73a3-b3c7-272a84148d36 |

### google-patents-gemini-xprize-sitemap.formula

| theorem | formula | bytes | bits | tokens | joules | coin | source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `textbook_patent_dates_ordered` | $\forall \{\alpha : \mathrm{Type}\ \mathrm{u\_1}\} [\mathrm{inst} : \mathrm{Preorder} \alpha ] (p\ f\ g : \alpha ), p \le f \to f \le g \to p \le g$ | 146 | 1168 | 37 | 3.3533033377719496e-18 | 00000092-2b67-2ac6-8044-3e83b3fba2a1 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_patent_number_well_formed` | $\forall (a\ b\ c : \mathbb{N}), \mathrm{Fintype.card} (\mathrm{Fin}\ a \oplus \mathrm{Fin}\ b \oplus \mathrm{Fin}\ c) = a + b + c$ | 129 | 1032 | 33 | 2.962850209401243e-18 | 00000081-c6aa-8da5-8fd5-108711389085 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_patent_term_twenty_years` | $\forall (f\ \mathrm{term} : \mathbb{N}), 0 < \mathrm{term} \to f < f + \mathrm{term}$ | 84 | 672 | 21 | 1.9292978107729025e-18 | 00000054-4f98-78ad-854d-b8820e0dd56e | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_free_or_coil` | $\forall \{\alpha : \mathrm{Type}\ \mathrm{u\_1}\} [\mathrm{inst} : \mathrm{AddCommSemigroup} \alpha ] [\mathrm{inst\_1} : \mathrm{PartialOrder} \alpha ] [\mathrm{ExistsAddOfLE} \alpha ] [\mathrm{AddLeftMono} \alpha ] [\mathrm{inst\_4} : \mathrm{Sub} \alpha ] [\mathrm{OrderedSub} \alpha ] (\mathrm{calls}\ \mathrm{free} : \alpha ), \mathrm{free} \le \mathrm{calls} \to \mathrm{calls} - \mathrm{free} + \mathrm{free} = \mathrm{calls}$ | 432 | 3456 | 108 | 9.92210302683207e-18 | 000001b0-ae89-20c5-8dbe-fe2ab544c7df | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_prizes_computable` | $\forall \{\alpha : \mathrm{Type}\ \mathrm{u\_1}\} [\mathrm{inst} : \mathrm{PartialOrder} \alpha ] [\mathrm{inst\_1} : \mathrm{AddCommSemigroup} \alpha ] [\mathrm{inst\_2} : \mathrm{Sub} \alpha ] [\mathrm{OrderedSub} \alpha ] [\mathrm{AddLeftReflectLE} \alpha ] (\mathrm{purse}\ \mathrm{fund}\ \mathrm{perproblem}\ \mathrm{invested}\ \mathrm{none}\ \mathrm{total}\ \mathrm{winnable} : \alpha ), \mathrm{purse} + \mathrm{fund} + \mathrm{perproblem} + \mathrm{invested} + \mathrm{none} = \mathrm{total} \to \mathrm{winnable} = \mathrm{purse} + \mathrm{fund} + \mathrm{perproblem} \to \mathrm{total} - \mathrm{invested} - \mathrm{none} = \mathrm{winnable}$ | 651 | 5208 | 163 | 1.4952058033489994e-17 | 0000028b-d7ee-48e6-8071-fe281125d8fb | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
| `textbook_sitemap_leads` | $\forall (u\ v\ c\ l : \mathbb{N}), v \le u \to c + l = v \to c + l + (u - v) = u$ | 80 | 640 | 20 | 1.8374264864503834e-18 | 00000050-5d07-84e5-8735-f89045cf7ae4 | <https://github.com/uuidna/qpu/blob/v1.1.1/lean/Qpu/General/Textbook.lean> |
