---
title: Fuse
---

<script setup>
import { data } from '../../.vitepress/fuse.data.ts'
</script>

# Fuse

Named HTTPS. Keys occupy doors.

firmware `{{ data.fuse.firmware }}`. `{{ data.fuse.src }}`. Next {{ data.fuse.next }}.

## Keys

<table>
  <thead>
    <tr>
      <th scope="col">Kind</th>
      <th scope="col">Href</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="k in data.fuse.keys" :key="k.path">
      <td>{{ k.kind }}</td>
      <td><a :href="k.path">{{ k.href }}</a></td>
    </tr>
  </tbody>
</table>

## Source

<<< @/../src/quantum/processing/unit/index.ts
