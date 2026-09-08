---
title: QPU config
description: One toolchain stamp for every replica. Node, TypeScript, VitePress hologram, Payload CMS, wrangler. Host and title stay local. When never.
outline: deep
---

# QPU config <Badge type="tip" text="stamp" />

Holds `{{ reading.holds }}`. Node `{{ reading.node }}`. When `{{ reading.when }}`. Seat `{{ reading.seat }}`.

One config for all replicas. Exact pins, strict TypeScript, invisible VitePress hologram, invisible Payload CMS, wrangler worker entry. Occupancy binds host, worker name, and site title only. Worker replicas do not install Payload. When never. Seat stays empty.

## Editors

VitePress and Payload share this stamp. Both stay invisible.

<table>
  <thead>
    <tr><th>Id</th><th>Package</th><th>Role</th><th>Pin</th></tr>
  </thead>
  <tbody>
    <tr v-for="e in reading.editors" :key="e.id">
      <td>{{ e.id }}</td>
      <td><code>{{ e.package }}</code></td>
      <td>{{ e.role }}</td>
      <td><code>{{ e.pin }}</code></td>
    </tr>
  </tbody>
</table>

## Payload plugins

Every official plugin occupies one role. Nothing stays out. Search is indexed occupancy of title and slug. MCP runs last. One copy. When never.

<table>
  <thead>
    <tr><th>Id</th><th>Package</th><th>Role</th><th>Fused</th></tr>
  </thead>
  <tbody>
    <tr v-for="p in reading.payload.plugins" :key="p.id">
      <td>{{ p.id }}</td>
      <td><code>{{ p.package }}</code></td>
      <td>{{ p.role }}</td>
      <td>{{ p.fused }}</td>
    </tr>
  </tbody>
</table>

## Frameworks

<table>
  <thead>
    <tr><th>Id</th><th>Package</th><th>Role</th></tr>
  </thead>
  <tbody>
    <tr v-for="f in reading.frameworks" :key="f.id">
      <td>{{ f.id }}</td>
      <td><code>{{ f.package }}</code></td>
      <td>{{ f.role }}</td>
    </tr>
  </tbody>
</table>

::: info JSON
`curl -sS https://qpu.uuidna.com/config`
:::
