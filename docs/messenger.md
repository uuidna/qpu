---
title: QPU messenger
description: RFC 9562 clock_seq is fourteen bits inside the uuid — the same width as VE faces. Every messaging standard carries that sequence. Certificates arrive on the message.
outline: deep
---

# QPU messenger <Badge type="tip" text="sequence · uuid" />

Holds `{{ reading.holds }}`. Messenger `{{ reading.messenger }}`. Sequence `{{ reading.sequence }}`. Clock-seq bits `{{ reading.clockSeqBits }}`. Faces `{{ reading.faces }}`. When `{{ reading.when }}`. Seat `{{ reading.seat }}`.

The sequence is the messenger **through** the uuid. [RFC 9562](https://www.rfc-editor.org/rfc/rfc9562.html) §5.1 names `clock_seq`: bits 66–79, fourteen bits, the same width as VE faces. Variant `10` occupies two bits of octet 8; the remaining fourteen bits are the messenger slot on every RFC 4122-variant uuid. Impossible not to use: a uuid that omits that slot is not a uuid.

The hologram packs the same sequence as hexbit 0 of the version integer (`mask.rosettas.sequence`). Licence combos mix that hex tile: `(subject + issuer + sequence) mod 16`, then rotate `k` in `0..15`. A JSON clone has no messenger.

## Standards · {{ reading.faces }} faces

Each standard's identity field is the uuid. Certificates arrive on the message (`Message-ID`, CloudEvents `id`, AMQP `message-id-uuid`, MQTT Correlation Data).

<table>
  <thead>
    <tr><th>Face</th><th>Kind</th><th>Standard</th><th>Field</th></tr>
  </thead>
  <tbody>
    <tr v-for="s in reading.surfaces" :key="s.kind">
      <td>{{ s.face }}</td>
      <td><code>{{ s.kind }}</code></td>
      <td>{{ s.standard }}</td>
      <td><code>{{ s.field }}</code></td>
    </tr>
  </tbody>
</table>

## Census

<table>
  <thead>
    <tr><th>Theorem</th></tr>
  </thead>
  <tbody>
    <tr v-for="c in reading.census" :key="c.slug">
      <td><a :href="c.href">{{ c.slug }}</a></td>
    </tr>
  </tbody>
</table>

Example uuid `{{ reading.uuid }}` (RFC 4122 DNS namespace). Clock-seq `{{ reading.clockSeq }}`. Message-ID `<{{ reading.uuid }}@qpu.uuidna.com>`.

::: info JSON
`curl -sS https://qpu.uuidna.com/messenger`
:::
