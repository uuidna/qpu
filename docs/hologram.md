---
title: Hologram
description: Fourteen superpositions, fourteen reflections each.
outline: deep
---

# Hologram <Badge type="tip" text="14 × 14" />

{{ reading.superpositions.length * reading.veFaces }} cells. Each row is a VE face and its opposite through the void. Each column is a reflection `k = 0 … 13`: `throughVoid((face + k) mod 9)` and the paired opposite shift. Reflection `k = 0` **is** the standing opposite.

<Lattice />

Planes from constructors: foundation {{ reading.foundation }}, debit {{ reading.debit }}, credit {{ reading.credit }}, pentagram {{ reading.pentagram }}, fold {{ reading.fold }}, octet {{ reading.octet }}, VE {{ reading.veFaces }}.

::: info JSON
`curl -sS https://qpu.uuidna.com/hologram` · `curl -sS https://qpu.uuidna.com/superpositions`
:::
