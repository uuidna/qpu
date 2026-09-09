---
title: Seat
description: QPU lane — empty. Admits nothing.
outline: deep
---

# Seat <Badge type="warning" text="empty" />

<Seat />

The hardware QPU lane stays empty. Filling it to look like a chip would be a fake measurement.

```ts
import { qpuSeatOf } from '@uuidna/qpu'
qpuSeatOf() // { name: 'QPU', seat: 'empty', admits: 'nothing' }
```

::: info JSON
`curl -sS https://qpu.uuidna.com/seat`
:::
