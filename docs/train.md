---
title: QPU train
description: Professional training. Fourteen VE faces fused with uuidna public keyless APIs, BindingPoint hardware occupancy, constructor APIs, asset skip, relations, and sealed leads. Named uuidna.com HTTPS only. Constructors only, never a crawl. When never.
outline: deep
---

# QPU train <Badge type="tip" text="corpus" />

Holds `{{ reading.holds }}`. Corpus `{{ reading.corpus }}`. Crawl `{{ reading.crawl }}`. Fetches `{{ reading.fetches }}`. Sequence `{{ reading.sequence }}`. Faces `{{ reading.faces }}`. When `{{ reading.when }}`. Seat `{{ reading.seat }}`.

Professional training. The live working QPU is the curriculum. Fourteen lessons occupy fourteen VE faces. Public keyless APIs are the uuidna replicas — they respond as occupancy JSON. Hardware occupancy walks BindingPoints; the chip named QPU never binds. Constructor APIs occupy the same pentagram; they are not exchange quotes. Hashed `/assets/*` skip the Worker. Sealed leads stay on uuidna.com/theorem. E2E may record one webm chapter per lesson. Sequence is the uuid messenger. Constructors only — never a crawl. When never. Seat stays empty.

Training `{{ reading.training }}`. Record `{{ reading.record }}`. Video `{{ reading.video.container }}`.

## Law

Keys `{{ reading.law.keys }}`. Completions `{{ reading.law.completions }}`. Quotes `{{ reading.law.quotes }}`. Secrets `{{ reading.law.secrets }}`. Wildcards `{{ reading.law.wildcards }}`. Hosts `{{ reading.law.hosts }}`.

Named uuidna.com HTTPS only. No API keys. No third-party model completions. No market quotes.

## Lessons · {{ reading.faces }}

<table>
  <thead>
    <tr><th>Face</th><th>Lesson</th><th>Door</th><th>Constructor</th><th>Claim</th></tr>
  </thead>
  <tbody>
    <tr v-for="l in reading.lessons" :key="l.face">
      <td>{{ l.face }}</td>
      <td>{{ l.title }}</td>
      <td><a :href="l.path"><code>{{ l.path }}</code></a></td>
      <td><code>{{ l.constructor }}</code></td>
      <td>{{ l.claim }}</td>
    </tr>
  </tbody>
</table>

## Public keyless APIs

<table>
  <thead>
    <tr><th>Host</th><th>Kind</th><th>Key</th><th>uuidna</th><th>Point</th></tr>
  </thead>
  <tbody>
    <tr v-for="a in reading.apis" :key="a.host">
      <td><a :href="a.href">{{ a.host }}</a></td>
      <td>{{ a.kind }}</td>
      <td>{{ a.key }}</td>
      <td>{{ a.uuidna }}</td>
      <td>{{ a.point }}</td>
    </tr>
  </tbody>
</table>

## Relations

<table>
  <thead>
    <tr><th>Point</th><th>Hardware binds</th><th>Constructor APIs</th><th>Lead</th></tr>
  </thead>
  <tbody>
    <tr v-for="r in reading.relations" :key="r.point">
      <td>{{ r.point }}</td>
      <td>{{ r.hardware.binds }}</td>
      <td>{{ r.trading.count }}</td>
      <td><a :href="r.lead.href">{{ r.lead.slug }}</a></td>
    </tr>
  </tbody>
</table>

## Strategies

<table>
  <thead>
    <tr><th>Face</th><th>Point</th><th>API</th><th>Lead</th></tr>
  </thead>
  <tbody>
    <tr v-for="s in reading.strategies" :key="s.face">
      <td>{{ s.face }}</td>
      <td>{{ s.point }}</td>
      <td>{{ s.ai.host }}</td>
      <td><a :href="s.lead.href">{{ s.lead.slug }}</a></td>
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

::: info JSON
`curl -sS https://qpu.uuidna.com/train`
:::
