# hardware chip blueprint (ray layers)

> Printed by fused MCP `papers { chips: true }` — multidimensional layers managed by UUID rays (lattice coins·rays=faces).

## Proof

src/families/hardware — dies off a wafer; the silicon's own arithmetic

## Kind

`blueprint`

## UUID ray lattice

| field | value | holds |
|---|---|---|
| n | 3 | true |
| coins | 2 | true |
| rays (layers) | 7 | true |
| faces | 14 | true |
| cube.bits | 32 | true |
| cube.hexbit | 4 | true |
| handle.amplitudes | 4294967296 | true |
| topology.dimension(rays) | 7 | true |
| manifold.dimension(faces,coins) | 12 | true |

Identity: `coins · rays = faces (theorem around / harmonic)`

### Layer stack (one layer per ray)

| ray | coinSlot | faceIndex | dimension | manages |
|---|---|---|---|---|
| 0 | 0 | 0 | 7 | UUID ray 0/7 · coin 0 · face 0 |
| 1 | 1 | 2 | 7 | UUID ray 1/7 · coin 1 · face 2 |
| 2 | 0 | 4 | 7 | UUID ray 2/7 · coin 0 · face 4 |
| 3 | 1 | 6 | 7 | UUID ray 3/7 · coin 1 · face 6 |
| 4 | 0 | 8 | 7 | UUID ray 4/7 · coin 0 · face 8 |
| 5 | 1 | 10 | 7 | UUID ray 5/7 · coin 1 · face 10 |
| 6 | 0 | 12 | 7 | UUID ray 6/7 · coin 0 · face 12 |

## Formula table (ray-stamped)

| ray | address | params | value | holds | hex |
|---|---|---|---|---|---|
| ray 0 | `hardware.dies` | [70650, 100] | 706 | true | c3ac1a5d-4000-5000-a000-0113fa000064 |
| ray 1 | `hardware.threads` | [8] | 16 | true | c3ac1a5d-8000-8000-9000-000000000008 |
| ray 2 | `hardware.cacheLines` | [4096] | 64 | true | c3ac1a5d-3000-4000-9000-000000001000 |
| ray 3 | `hardware.tdpPerCore` | [125, 8] | 15 | true | c3ac1a5d-7000-3000-a000-00007d000008 |

## Readings

### ray 0 · hardware.dies

- formula: `dies(wafer, die) = wafer / die`
- params: [70650, 100]
- value: **706**
- holds: **true**
- hex: `c3ac1a5d-4000-5000-a000-0113fa000064`

### ray 1 · hardware.threads

- formula: `threads(cores) = cores · 2`
- params: [8]
- value: **16**
- holds: **true**
- hex: `c3ac1a5d-8000-8000-9000-000000000008`

### ray 2 · hardware.cacheLines

- formula: `cacheLines(bytes) = bytes / 64`
- params: [4096]
- value: **64**
- holds: **true**
- hex: `c3ac1a5d-3000-4000-9000-000000001000`

### ray 3 · hardware.tdpPerCore

- formula: `tdpPerCore(tdp, cores) = tdp / cores`
- params: [125, 8]
- value: **15**
- holds: **true**
- hex: `c3ac1a5d-7000-3000-a000-00007d000008`


## Invoke

```bash
npm run mcp -- --local '{ "door": "papers", "chips": true }'
tools/call papers { "chips": true }
tools/call connector { "chips": true }
tools/call connector { "print": true }
```

## Crypto-imprinted license

| field | value |
|---|---|
| spdx | `CC-BY-NC-ND-4.0` |
| file | `LICENSE` |
| commercial | `/license` |
| law.lawful | `12658319-4000-3000-9000-000000000000` value 1 holds true |
| law.reviewed | `12658319-c000-6000-9000-000000000000` value 0 holds false (lead) |
| access.read | `7e6283be-3000-4000-a000-000002000000` holds true |
| access.token | `7e6283be-9000-5000-9000-000000000100` holds true |
| digest | `1eb5836d10940c9b5a88e3fa9aa7626221bf548bb467192c1569b0e77e0388b3` |
| hmac-sha256 | `5f73c4f9b6282eedf935d507712a1825d631f14c9d9d2fecfb908c511bf88fd2` |
| ed25519 publicKey | `009a68bc845a8243b7c42adf3bc92c1b1d6bb8c5a1ea778b41cc863d5c66c665` |
| ed25519 signature | `d91d993debd0724acf7995e1147f3e368d9d905a159a8feb1d590a21a7fba4879c4cd830caa0a6856531f8c852142c54883a6c201d13c62e98492a521b99eb0a` |
| verified | **true** |
| imprint holds | **true** |

ed25519+HMAC over SPDX+law hex+body digest; law.reviewed remains lead; no Clay prize

