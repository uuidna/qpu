---
title: Scale
description: All serverless doors. Multiple workers may fan out over MCP and every fused lane.
outline: deep
---

# Scale

May `{{ reading.may }}`. Fused `{{ reading.fused }}`. Chip `{{ reading.chip.seat }}`. Transports {{ reading.transports }}.

## Native

<table>
  <thead><tr><th>Id</th><th>Op</th><th>Path / key</th><th>Bound</th></tr></thead>
  <tbody>
    <tr v-for="t in reading.native" :key="t.id">
      <td>{{ t.id }}</td>
      <td>{{ t.op }}</td>
      <td><code>{{ t.path || t.envKey || 'schedule' }}</code></td>
      <td>{{ t.bound }}</td>
    </tr>
  </tbody>
</table>

## Peers

{{ reading.peers.join(' · ') }}

::: info JSON
`curl -sS https://qpu.uuidna.com/scale`
:::
