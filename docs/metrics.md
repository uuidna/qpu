---
title: Metrics
description: Formula versus peer. Every speed rung is walked.
outline: deep
---

# Metrics <Badge type="tip" text="holds" />

Holds `{{ reading.holds }}`.

<table>
  <thead>
    <tr><th>Name</th><th>Formula</th><th>Value</th><th>Peer</th></tr>
  </thead>
  <tbody>
    <tr v-for="r in reading.compare" :key="r.name">
      <td>{{ r.name }}</td>
      <td><code>{{ r.formula }}</code></td>
      <td>{{ r.value }}</td>
      <td>{{ r.peer }}</td>
    </tr>
  </tbody>
</table>

Speed rungs stay at [Speed](/speed).

::: info JSON
`curl -sS https://qpu.uuidna.com/metrics` · `curl -sS https://qpu.uuidna.com/speed`
:::
