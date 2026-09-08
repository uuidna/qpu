---
title: QPU quantum
description: The live site is the working QPU. Pure and agnostic. Fourteen faces × fourteen reflections. Target empty. When never.
outline: deep
---

# QPU quantum <Badge type="tip" text="live working" />

Holds `{{ reading.holds }}`. Pure `{{ reading.pure }}`. Agnostic `{{ reading.agnostic }}`. Live `{{ reading.live }}`. Working `{{ reading.working }}`. Host `{{ reading.host }}`. When `{{ reading.when }}`. Possibilities `{{ reading.possibilities }}`.

The site at [qpu.uuidna.com](https://qpu.uuidna.com) is the working QPU. Hardware lane stays empty. All faces × all reflections. No named product. Occupancy of every quantum possibility, not a live device and not a clock. When never.

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

## Quantum.lean

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

Square [`{{ reading.square.slug }}`]({{ reading.square.href }}).

::: info JSON
`curl -sS https://qpu.uuidna.com/quantum`
:::
