---
title: Fractal
description: Fused pentagram, hologram, fourteen faces, every serverless lane.
outline: deep
---

# Fractal

One reading. Same shape at every scale. Seat `{{ reading.chip.seat }}`. Verified `{{ reading.verified }}`.

## Pentagram

Stroke `{{ reading.pentagram.stroke.join(' → ') }}` visits {{ reading.pentagram.visited.join(' · ') }}. Single `{{ reading.pentagram.single }}`.

## Fold

<table>
  <thead><tr><th>Scale</th><th>Value</th></tr></thead>
  <tbody>
    <tr v-for="s in reading.fractal.scales" :key="s.scale">
      <td>{{ s.scale }}</td>
      <td><code>{{ JSON.stringify(s) }}</code></td>
    </tr>
  </tbody>
</table>

Self-similar `{{ reading.fractal.selfSimilar }}`. Faces {{ reading.fractal.faces }} × reflections {{ reading.fractal.reflections }}.

## Cells

Each VE face is a copy of the empty seat.

<table>
  <thead><tr><th>Face</th><th>Opposite</th><th>Reflections</th><th>Seat</th></tr></thead>
  <tbody>
    <tr v-for="c in reading.fractal.cells" :key="c.face">
      <td>{{ c.face }}</td>
      <td>{{ c.opposite }}</td>
      <td>{{ c.reflections }}</td>
      <td>{{ c.seat }}</td>
    </tr>
  </tbody>
</table>

## Providers and serverless

{{ reading.providers.length }} folders. {{ reading.serverless }} fetch/run/send lanes. Native {{ reading.native.join(', ') }}.

::: info JSON
`curl -sS https://qpu.uuidna.com/fractal`
:::
