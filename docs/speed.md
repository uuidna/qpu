---
title: QPU speed
description: Constructor occupancy versus 2^n. Every finite IEEE rung is walked. Hardware QPU lane stays empty.
outline: deep
---

# QPU speed

Constructor µs versus 2ⁿ. Seat `{{ reading.seat.seat }}`. Formula versus peer stays at [Metrics](/metrics).

Every finite IEEE 2ⁿ is walked. µs are not truncated to 32-bit.

<table>
  <thead>
    <tr><th>Name</th><th>n</th><th>2ⁿ</th><th>Walked</th><th>median µs</th></tr>
  </thead>
  <tbody>
    <tr v-for="r in reading.speed" :key="r.name">
      <td>{{ r.name }}</td>
      <td>{{ r.n }}</td>
      <td>{{ r.amplitudes }}</td>
      <td>{{ r.walked }}</td>
      <td>{{ r.medianUs }}</td>
    </tr>
  </tbody>
</table>

::: info JSON
`curl -sS https://qpu.uuidna.com/speed`
:::
