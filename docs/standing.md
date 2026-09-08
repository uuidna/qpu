---
title: QPU standing
description: uuidna Lean keys this worker stands on. Desk cites; the kernel sealed. Hardware QPU lane stays empty.
outline: deep
---

# QPU standing

The file census of Lean keys this worker is licensed to cite. This package does not mint keys. Cited keys stay on uuidna (`https://uuidna.com/theorem/<key>`). The paper stays at [Paper](/paper).

## By file

<table>
  <thead>
    <tr><th>File</th><th>Keys</th></tr>
  </thead>
  <tbody>
    <tr v-for="f in reading.byFile" :key="f.file">
      <td><code>{{ f.file }}</code></td>
      <td>{{ f.theorems.length }}</td>
    </tr>
  </tbody>
</table>

## Claims · {{ reading.standing.length }}

<table>
  <thead>
    <tr><th>Role</th><th>Key</th><th>File</th></tr>
  </thead>
  <tbody>
    <tr v-for="s in reading.standing" :key="s.key">
      <td>{{ s.role }}</td>
      <td><code>{{ s.key }}</code></td>
      <td>{{ s.file }}</td>
    </tr>
  </tbody>
</table>

::: info JSON
`curl -sS https://qpu.uuidna.com/standing`
:::
