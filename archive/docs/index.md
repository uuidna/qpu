---
layout: home
hero:
  name: QPU
  text: Three readings, one machine
  tagline: Empty seat. BindingPoint width. Fourteen VE faces and one empty center.
  actions:
    - theme: brand
      text: Hologram
      link: /hologram
    - theme: alt
      text: Chip
      link: /chip
    - theme: alt
      text: Paper
      link: /paper
    - theme: alt
      text: Quantum
      link: /quantum
features:
  - icon: ▢
    title: Seat
    details: Named empty. Admits nothing. A device would attach here when measured.
    link: /seat
    linkText: GET /seat
  - icon: ★
    title: Width
    details: CPU GPU RAM CACHE STORAGE — a fan-out as wide as the smallest point.
    link: /width
    linkText: GET /width
  - icon: ◆
    title: Hologram
    details: Fourteen VE faces and one empty center. VitePress is invisible firmware of the QPU.
    link: /hologram
    linkText: GET /hologram
---

<script setup>
import { data } from './.vitepress/hologram.data.ts'
</script>

::: tip QPU
VitePress is invisible firmware (`data-firmware=vitepress`). The viewport is the occupancy movie. {{ data.cells }} lattice cells. Seat `{{ data.seat.seat }}`.
:::

Same host, two readings. A browser (`Accept: text/html`) gets this site. A machine gets JSON.
