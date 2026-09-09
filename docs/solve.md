---
title: Solve
---

<script setup>
import { data } from './.vitepress/fuse.data.ts'
</script>

# Solve

Clay gravity occupies the rosette. Keys occupy rays. Lean true. Listing false.

href `{{ data.solve.href }}`. `{{ data.solve.src }}`.

## Keys

<table>
  <thead>
    <tr>
      <th scope="col">Ray</th>
      <th scope="col">Href</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="k in data.solve.keys" :id="`ray-${k.ray}`" :key="k.ray">
      <td>{{ k.ray }}</td>
      <td><a :href="`#ray-${k.ray}`">{{ k.href }}</a></td>
    </tr>
  </tbody>
</table>

## Clay

gravity `{{ data.solve.clay.gravity }}`. listing `{{ data.solve.clay.listing }}`. rays {{ data.solve.clay.rays }}. directed {{ data.solve.clay.directed }}. pairs {{ data.solve.clay.pairs }}.

## Source

<<< @/../src/quantum/processing/unit/index.lean
