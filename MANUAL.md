# User manual — `@uuidna/qpu`

QPU worker. Version **0.3.1**. Live **[https://qpu.uuidna.com](https://qpu.uuidna.com)**. Paper: [README.md](README.md).

| Field | Value |
| --- | --- |
| Product | `@uuidna/qpu` |
| Host | `qpu.uuidna.com` |
| Node | ≥ 22 |
| Licence | CC BY-NC-ND 4.0 |
| Cite | [CITATION.cff](CITATION.cff) |
| Tests | 71/71 pass in 886 ms |

## What you get

Three JSON readings. No hardware QPU.

| Reading | Constructor | HTTP |
| --- | --- | --- |
| Seat | `qpuSeatOf()` → `QPU` · `empty` | `GET /seat` |
| Width | `qpuWidthOf()` → CPU GPU RAM CACHE STORAGE · binds `cpu` | `GET /width` |
| Hologram | `qpuHologramOf()` → foundation 0 · debit 3 · credit 6 · pentagram 5 · fold 7 · octet 8 · VE 14 | `GET /hologram` |

Metrics: `GET /metrics`. Discovery: `GET /` and `GET /.well-known/qpu.json`. Proofs stay on uuidna ([DOI 10.5281/zenodo.22256708](https://doi.org/10.5281/zenodo.22256708)).

## Install

```
npm install @uuidna/qpu
```

From git:

```
git clone https://github.com/uuidna/qpu
cd qpu
npm ci
npm test
```

## HTTP

Base URL: `https://qpu.uuidna.com`. Methods: GET, OPTIONS. Body: `application/json; charset=utf-8`.

| Method | Path | Status | Body |
| --- | --- | --- | --- |
| GET | `/` | 200 | discovery + `machine` |
| GET | `/seat` | 200 | `empty` seat |
| GET | `/width` | 200 | CPU GPU RAM CACHE STORAGE |
| GET | `/hologram` | 200 | planes 0 3 6 5 7 8 14 |
| GET | `/metrics` | 200 | `compare` + `holds` |
| GET | `/.well-known/qpu.json` | 200 | discovery |
| OPTIONS | any of the above | 204 | empty |
| GET | other path | 404 | `{ "error": "no such reading" }` |

```
curl -sS https://qpu.uuidna.com/seat
curl -sS https://qpu.uuidna.com/width
curl -sS https://qpu.uuidna.com/hologram
curl -sS https://qpu.uuidna.com/metrics
```

## Library

```ts
import { handleQpuFetch, qpuMachineOf, qpuCompareOf } from '@uuidna/qpu'

const machine = qpuMachineOf()
const res = await handleQpuFetch(new Request('https://qpu.uuidna.com/seat'))
const compare = qpuCompareOf()
```

| Export | Returns |
| --- | --- |
| `qpuSeatOf()` | `{ name: 'QPU', seat: 'empty', admits: 'nothing' }` |
| `qpuWidthOf()` | `{ points, pentagram: 5, binds: 'cpu' }` |
| `qpuHologramOf()` | planes, plus `seal: [0, 1, 2, 4, 8, 7, 5, 3, 6, 9]` |
| `qpuFacesOf()` | 14 face pairs |
| `qpuMachineOf()` | `{ host, seat, width, hologram }` |
| `handleQpuFetch(request)` | `Response` |
| `qpuCompareOf()` | formula vs peer rows |
| `qpuCompareHolds()` | `true` when every row matches |

Workers entry: `worker.js` exports `fetch: handleQpuFetch`. Config: `wrangler.toml` `name = "uuidna-qpu"`.

## Deploy

```
npm run ship
```

That is `tsc`, `vitepress build docs`, then `npx wrangler deploy`. Do not fill the QPU seat from the deploy script.

## Errors

| Symptom | Cause | What to do |
| --- | --- | --- |
| 404 | path is not a door | use `/` `/seat` `/width` `/hologram` `/metrics` |
| 405 | method is not GET or OPTIONS | GET a reading |
| `holds: false` | a compare row drifted | fail the build |
| empty seat | expected | do not invent a device |

## Tests

This generation: **71/71 pass in 886 ms**.

| Name | Formula | Value | Peer | Match |
| --- | --- | --- | --- | --- |
| foundation | `0` | 0 | 0 | holds |
| debit | `TRINITY` | 3 | 3 | holds |
| credit | `HEXBIT_BITS + COINS` | 6 | 6 | holds |
| pentagram | `QPU_POINTS.length` | 5 | 5 | holds |
| fold | `BASE - COINS` | 7 | 7 | holds |
| octet | `UUID_HEXBITS / HEXBIT_BITS` | 8 | 8 | holds |
| veFaces | `HANDLE_HEXBITS + HEXBIT_BITS + COINS` | 14 | 14 | holds |
| debit+credit | `debit + credit` | 9 | 9 | holds |
| fold+coins | `fold + COINS` | 9 | 9 | holds |
| credit-debit | `credit - debit` | 3 | 3 | holds |
| octet×hexbit | `octet × HEXBIT_BITS` | 32 | 32 | holds |
| ve−octet | `veFaces − octet` | 6 | 6 | holds |
| rays×coins | `(BASE - COINS) × COINS` | 14 | 14 | holds |
| merkaba | `HEXBIT_BITS × COINS` | 8 | 8 | holds |
| faces | `qpuFacesOf().length` | 14 | 14 | holds |
| points | `QPU_POINTS.length` | 5 | 5 | holds |
| addressBytes | `ADDRESS_BITS / 8` | 16 | 16 | holds |
| messageTokens | `(ADDRESS_BITS / 8) / HEXBIT_BITS` | 4 | 4 | holds |
| payloadless | `VE_FACES × address / address` | 14 | 14 | holds |

```
npm run readme
```

## Citation and licence

APA 7th: see [CITATION.cff](CITATION.cff). Parent: uuidna DOI [10.5281/zenodo.22256708](https://doi.org/10.5281/zenodo.22256708).

Licence CC BY-NC-ND 4.0. Full text [LICENSE](LICENSE).
