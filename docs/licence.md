---
title: QPU licence
description: Occupancy licence is an offline certificate of a named uuidna.com host. No wildcards. Verify never calls the network. Expires never.
outline: deep
---

# QPU licence <Badge type="tip" text="offline" />

Holds `{{ reading.holds }}`. Offline `{{ reading.offline }}`. When `{{ reading.when }}`. Expires `{{ reading.expires }}`. Subject `{{ reading.subject }}`. Issuer `{{ reading.issuer }}`.

The occupancy licence is an offline certificate of a named `uuidna.com` host, issued by `license.uuidna.com`. Sequence is the uuid messenger: every combo mixes one hex tile of RFC 9562 `clock_seq`. Verify is a constructor. No network. Wildcards refuse. Seat stays empty. When never.

## SAN

<table>
  <thead>
    <tr><th>Host</th></tr>
  </thead>
  <tbody>
    <tr v-for="h in reading.san" :key="h">
      <td><code>{{ h }}</code></td>
    </tr>
  </tbody>
</table>

::: info JSON
`curl -sS https://qpu.uuidna.com/licence`
:::
