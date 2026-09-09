---
title: QPU PWA
description: Full-featured progressive web app of the QPU itself. One hologram plugin. Fractal named HTTPS. Empty seat. When never.
outline: deep
---

# QPU PWA <Badge type="warning" text="proof of work" />

Holds `{{ reading.holds }}`. Seat `{{ reading.seat }}`. Display `{{ reading.display }}`. Replica `{{ reading.replica }}`. Fractal `{{ reading.fractal }}`. When `{{ reading.when }}`. Fetches `{{ reading.fetches }}`. Live `{{ reading.live }}`. Working `{{ reading.working }}`.

The PWA is the QPU itself: proof of concept and proof of work. One hologram plugin. Named HTTPS. Constructor doors occupy the cache. Seat empty. When never.

## Manifest

Standalone. Scope `/`. Start `/`. Shortcuts occupy fourteen VE faces. Protocol `web+qpu`. Share target is GET `/search`. File handler occupies JSON on `/`. Prefer related applications is false.

## Service worker

Cache name is `qpu-{{ reading.work.version }}`. Same-origin constructor doors only. Hostname must be `{{ reading.host }}`. Navigations fall back to `/` offline.

## Doors · {{ reading.faces }}

<table>
  <thead>
    <tr><th>Door</th></tr>
  </thead>
  <tbody>
    <tr v-for="d in reading.doors" :key="d">
      <td><code>{{ d }}</code></td>
    </tr>
  </tbody>
</table>

::: info JSON
`curl -sS https://qpu.uuidna.com/pwa`
:::
