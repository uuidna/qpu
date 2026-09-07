# @uuidna/qpu

The QPU worker at [https://qpu.uuidna.com](https://qpu.uuidna.com). Three readings, one machine.

```ts
import { handleQpuFetch, qpuMachineOf } from '@uuidna/qpu'
```

| Path | Reading |
| --- | --- |
| `/` | discovery + machine |
| `/seat` | `QPU` · `empty` |
| `/width` | CPU GPU RAM CACHE STORAGE |
| `/hologram` | foundation 0, debit 3, credit 6, pentagram 5, fold 7, octet 8, VE 14 |
| `/.well-known/qpu.json` | discovery |

```
npm install @uuidna/qpu
npx wrangler deploy
```

Licence: CC BY-NC-ND 4.0 · © Tsvetan Rouschev — the same licence as [`@uuidna/uuidna`](https://github.com/uuidna/uuidna).
