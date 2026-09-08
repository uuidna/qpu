---
title: QPU boot
description: Alpine netboot matrix. Eight official ISAs, trinity parts. Chip empty. Hardware QPU lane stays empty.
outline: deep
---

# QPU boot

Holds `{{ reading.holds }}`. Alpine ISAs `{{ reading.alpine }}`. Parts `{{ reading.parts }}`. Images `{{ reading.images }}`.

Occupancy of Alpine netboot. Each image is kernel + initramfs + modloop. The empty chip stays at [Seat](/seat).

## Arches · {{ reading.arches.length }}

{{ reading.arches.join(' · ') }}

::: info JSON
`curl -sS https://qpu.uuidna.com/boot`
:::
