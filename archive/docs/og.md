---
title: Hero · Open Graph
description: The homepage hero is the Open Graph image. 1200×630 BindingPoint pentagram.
outline: deep
---

# Hero · Open Graph

The homepage hero **is** this card. Crawlers fetch `GET /og.svg`. Constructors return the same numbers.

<img :src="reading.path" :alt="reading.alt" :width="reading.width" :height="reading.height" />

| Field | Occupancy |
| --- | --- |
| Width | {{ reading.width }} |
| Height | {{ reading.height }} |
| Type | `{{ reading.type }}` |
| Seat | `{{ reading.seat }}` |
| Faces | {{ reading.faces }} × {{ reading.faces }} |
| Href | [`{{ reading.href }}`]({{ reading.href }}) |

::: info JSON
`curl -sS https://qpu.uuidna.com/og` · `curl -sS https://qpu.uuidna.com/og.svg`
:::
