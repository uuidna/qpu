---
title: QPU live
description: Occupancy now. The snapshot recomputes on every tick. Seat empty. Hardware QPU lane stays empty.
outline: deep
---

# QPU live

Holds `{{ reading.holds }}`. Seat `{{ reading.seat }}`. Face `{{ reading.k }}`. Walked `{{ reading.walked }}`.

Occupancy now. Build tables stay; this snapshot recomputes on every tick. Events stay at [Events](/events).

{{ reading.message }}

::: info JSON
`curl -sS https://qpu.uuidna.com/live`
:::
