# API

[`index.ts`](index.ts) is the import. Run it from the repository root with `node --experimental-strip-types`. The website template does not mount this file, so there is no `/api/qpu/*` route. The detailed specification is [`README.md`](README.md). The unit is [`UNIT.md`](UNIT.md). The tools are [`TOOLBOXES.md`](TOOLBOXES.md).

```ts
import { call, caller, chat, handle, uuid, seal } from './src/quantum/index.ts'
```

## Exports

The UUID core, from [`uuid/index.ts`](uuid/index.ts): `uuid`, `reflection`, `seal`, `style`, `neighbours`, `block`, `verify`, `coins`, `quantumSku`, `organiseQubits`.

Pages, through Payload's local API, from [`payload/index.ts`](payload/index.ts): `findPage`, `openPages`, `pageData`, `savePage`, `saveSeed`, `writeArgs`, `findArgs`, `recordAgrees`, `seedsSynced`, `syncSeeds`, `linkSeedParents`, `seedWaves`, `mcpPages`. `pageData`, `findArgs`, and `writeArgs` build the document. `openPages` opens the local API. `findPage`, `savePage`, `saveSeed`, `syncSeeds`, and `linkSeedParents` use that API.

The unit, by `export *` from [`processing/unit`](processing/unit/index.ts): `QPU`, `tenantAddress`, the coil, the standards check, and `crypto1000Bit`.

The call, from [`processing/index.ts`](processing/index.ts): `handle`, `handleBatch`, `call`, `caller`, `chat`, `TOOLBOXES`.

Beside those: `os` is alpine, debian, and ubuntu. `calculator` is the integer calculator. `engine` is the default of the game seeds, and `seeds`, `play`, `impact`, and `capabilities` are its named exports. `plugins` is the twelve folder plugins.

## A call

`caller(name)(arguments)` returns the tool's structured content. An error is thrown.

`call(name, arguments)` returns the JSON-RPC envelope. The content is `result.structuredContent`. An error is `error.message`.

`handle` takes one message. An array is a batch. `handleBatch` answers a JSON-RPC array in order. The claimed role is decided before each call runs. A role that may not take the action gets an error, and that call does not run.

The methods are `initialize`, `tools/list`, `tools/call`, `resources/list`, `resources/templates/list`, and `resources/read`. `initialize` answers protocol `2025-06-18`. The server name is `qpu` and the version is `1.4.0`.

A `tools/call` message is `{ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments } }`.

`chat(statement)` routes a sentence to a tool.

No arguments on `algorithm` reads the formulas and does not run them.

```ts
const formulas = caller('algorithm')({})
// formulas.phase === 'discovery'
// formulas.unlimited === true
// formulas.hz === 432
// formulas.ran === false
// formulas.formulas maps to order, shor, factor
```

A named algorithm runs.

```ts
const qft = caller('algorithm')({ name: 'qft', qubits: 1 })
// qft.rows[0] is ['0', '0.7071 + 0.0000i', '50.00%']

const shor = call('algorithm', { name: 'shor', N: 15, a: 7 })
// shor.result.structuredContent.summary includes ['Factors', '3 × 5']
```

Omit the processor name and every layout is computed.

```ts
const layouts = caller('processor')({})
// layouts.name === 'Willow'
// layouts.qubits === 105
// layouts.unlimited === true
// layouts.hz === 432
// layouts.processors is Willow 105, Sycamore 54, Sycamore23 23, Bristlecone 72, Foxtail 22
```

An address is minted on the same import.

```ts
const address = uuid('qpu')
// address === '70a13419-52d5-2702-a236-d17851bf2b4a'
// seal(address).valid === true
```

`seeds()` returns the three game seeds chess, tarro, and unreal. Each is a draft pages document with one content block. `play(move)` reseals each seed with that move appended. `impact` books the bytes. `capabilities()` reports those seeds under `experimental.games`.

A quantum lead that is open, partial, or blocked, and is not one of the 86 terms, is an idea under `.idea/leads/quantum/gaps`. `leads { ideas: { next: 'quantum-leads' } }` develops each one, then the next idea that lead names. The 86 terms stay the `quantum` walk.
