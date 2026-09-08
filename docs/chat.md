---
title: QPU chat
description: Realtime chat handling every input. Fourteen UI kinds occupy VE faces. Capture imprints; never preventDefault. Sequence is the uuid messenger through /ws. When never.
outline: deep
---

# QPU chat <Badge type="tip" text="realtime · all input" />

Holds `{{ reading.holds }}`. Realtime `{{ reading.realtime }}`. Capture `{{ reading.capture }}`. Prevent-default `{{ reading.preventDefault }}`. Messenger `{{ reading.messenger }}`. Billed `{{ reading.billed }}`. Occupancy `{{ reading.occupancy }}`. When `{{ reading.when }}`. Seat `{{ reading.seat }}`.

Every input occupies a VE face: pointer, keyboard, wheel, input, focus, composition, clipboard, drag, touch, scroll, window, history, visibility, device. Capture imprints; the page still handles (`preventDefault` is false). Unknown types refuse. A chat frame without a uuid refuses — sequence is the messenger. Inference never runs on this worker; a uuid account is billed through [Bindings](/bindings) and [MCP](/mcp).

Signalling is `{{ reading.signal }}`. Same occupancy as [Events](/events). Rooms alias [Room](/room).

## Inputs · {{ reading.faces }}

<table>
  <thead>
    <tr><th>Face</th><th>Kind</th><th>Listen</th></tr>
  </thead>
  <tbody>
    <tr v-for="row in reading.inputs" :key="row.kind">
      <td>{{ row.face }}</td>
      <td><code>{{ row.kind }}</code></td>
      <td>{{ row.listen.join(', ') }}</td>
    </tr>
  </tbody>
</table>

::: info JSON
`curl -sS https://qpu.uuidna.com/chat`
:::
