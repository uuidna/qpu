---
title: QPU pqc
description: Fourteen VE faces, eight uuidna.com theorem tiles. Target empty. When never. Sandbox HTTP of named domains. Experiments unlimited.
outline: deep
---

# QPU pqc <Badge type="warning" text="target empty" />

Holds `{{ reading.holds }}`. Seat `{{ reading.seat }}`. Target `{{ reading.target.seat }}`. When `{{ reading.when }}`. Sandbox `{{ reading.sandbox }}`. Experiments `{{ reading.experiments }}`. Possibilities `{{ reading.possibilities }}`.

All faces × all reflections. No named product. Occupancy of the posture, not a live cipher and not a clock. Fuse is HTTP GET of named domains only. Experiments unlimited. When never.

## Faces · {{ reading.faces }}

<table>
  <thead>
    <tr><th>Face</th><th>Opposite</th></tr>
  </thead>
  <tbody>
    <tr v-for="s in reading.surfaces" :key="s.face">
      <td>{{ s.face }}</td>
      <td>{{ s.opposite }}</td>
    </tr>
  </tbody>
</table>

## Census · {{ reading.handle }} uuidna.com theorems

<table>
  <thead>
    <tr><th>Theorem</th></tr>
  </thead>
  <tbody>
    <tr v-for="c in reading.census" :key="c.slug">
      <td><a :href="c.href">{{ c.slug }}</a></td>
    </tr>
  </tbody>
</table>

::: info JSON
`curl -sS https://qpu.uuidna.com/pqc`
:::
